// ==UserScript==
// @name         RTINGS Prices
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Shows current prices on RTINGS website
// @author       You
// @match        https://*.rtings.com/*
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎯</text></svg>
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504695/RTINGS%20Prices.user.js
// @updateURL https://update.greasyfork.org/scripts/504695/RTINGS%20Prices.meta.js
// ==/UserScript==

(function() {
    'use strict';
    runWhenReady("a.price_box", addPrices, "href") // wait until links with .price_box contain a url, then call addPrices
})();


const MAX_PRICE_QUERY_TIMEOUT = 10000
const HEADERS = {
    "Accept": "*/*",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": " Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0",
    "Connection": "keep-alive",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9,fr;q=0.8"
}

async function addPrices() {
    const els = document.querySelectorAll("a.price_box")
    const els_arr = [...els]

    const pre_msg = "<span style='font-size: 16px'>"
    const post_msg = "</span>"

    els_arr.forEach( async (n) => {

        if(n.href.includes("amazon"))
            n.childNodes[0].innerHTML = pre_msg + await queryAmazonPrice(n.href) + post_msg
        else if(n.href.includes("walmart"))
            n.childNodes[0].innerHTML = pre_msg + await queryWalmartPrice(n.href) + post_msg
        else if(n.href.includes("shop-links"))
            n.childNodes[0].innerHTML = pre_msg + await queryBestBuyPrice(n.href) + post_msg
        else if(n.href.includes("bhphotovideo"))
            n.childNodes[0].innerHTML = pre_msg + await queryBHPrice(n.href) + post_msg
        else
            console.warn("This price box's url is not supported: ", n)
    })
}

function runWhenReady(readySelector, callback, sel=undefined) {
    var numAttempts = 0;
    var tryNow = function() {
        var elem = document.querySelector(readySelector);
        if ( (sel !== undefined && elem[sel]) || (sel === undefined && elem) ) {
            callback(elem);
        } else {
            numAttempts++;
            if (numAttempts >= 34) {
                console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
            } else {
                setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
            }
        }
    };
    tryNow();
}



// --- QUERY FUNCTIONS --- //

async function queryAmazonPrice(url) {

    var regex = RegExp("http://www.amazon.com/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})");
    const m = url.match(regex); let asin;
    if (m) {
        asin = m[4]
    } else {
        console.warn(m)
        throw new Error("Could not get asin from amazon url")
    }

    return new Promise((resolve, reject) => GM_xmlhttpRequest({
        method: 'GET',
        headers: HEADERS,
        url: `https://www.amazon.com/portal-migration/aod?asin=${asin}`,
        onload: function(resp) {
            const ohtml = resp.responseText
            const status = resp.status

            if(ohtml == null || status !== 200)
                throw new Error(`Non 200 code (${status}) or invalid html returned for ASIN ${asin}.`);

            let html = document.createElement('div');
            html.innerHTML = ohtml.trim();

            let price = html.querySelector("span.a-price > span").innerHTML.split("$")[1].split(".")[0]
            price = parseFloat(price.replace(/,/g, ''));

            resolve("$"+price)
        },
        onerror: function(e) {
            console.warn("probably blocked by amazon", e);
            resolve("Blocked")
        },
    }));
}

async function queryWalmartPrice(url) {
    url = url.replace("subId1=rtings-hp-r-in-stock&", "") // avoid sponsor link spamming

    return new Promise((resolve, _) => GM_xmlhttpRequest({
        method: 'GET',
        headers: HEADERS,
        url: url,
        onload: function(resp) {
            const ohtml = resp.responseText
            const status = resp.status

            if(ohtml == null || status !== 200)
                throw new Error(`Non 200 code (${status}) or invalid html returned for ASIN ${asin}.`);

            let html = document.createElement('div');
            html.innerHTML = ohtml.trim();
            console.log(html)

            let price = html.querySelector(".buy-box-container > div > span > span:nth-child(2) > span").innerHTML.split("$")[1].split(".")[0]
            price = parseFloat(price.replace(/,/g, ''));

            resolve("$"+price);
        }, // onload
        onerror: function() {
            console.error("ERROR when following redirect for bestbuy price");
        },
    })); // new Promise => GM_xmlhttpRequest
}

async function queryBestBuyPrice(url) {
    url = url.split('?')[0] // avoid sponsor link spamming

    return new Promise((resolve, _) => GM_xmlhttpRequest({
        method: 'GET',
        headers: HEADERS,
        url: url,
        onload: async function(resp) {
            const ohtml = resp.responseText
            const status = resp.status

            if(ohtml == null || status !== 200) {
                throw new Error(`Non 200 code (${status}) or invalid html returned for ASIN ${asin}.`);
            }

            let html = document.createElement('div');
            html.innerHTML = ohtml.trim();

            const redir_url = html.childNodes[7].content.split("url=")[1] // get from meta redirect
            const result = new Promise((resolve2, _) => GM_xmlhttpRequest({
                method: 'GET',
                headers: HEADERS,
                url: redir_url,
                onload: function(resp) {
                    const ohtml = resp.responseText
                    const status = resp.status

                    if(ohtml == null || status !== 200)
                        throw new Error(`Non 200 code (${status}) or invalid html returned for ASIN ${asin}.`);

                    let html = document.createElement('div');
                    html.innerHTML = ohtml.trim();

                    let price = html.querySelector(".priceView-hero-price > span").innerHTML.split("$")[1].split(".")[0]
                    price = parseFloat(price.replace(/,/g, ''));

                    resolve2(price);
                }, // onload
                onerror: function() {
                    console.error("ERROR when following redirect for bestbuy price");
                },
            })); // new Promise => GM_xmlhttpRequest
            resolve("$"+await result)

        }, // onload
        onerror: function() {
            console.error("ERROR when querying bestbuy price");
        },
    })); // new Promise => GM_xmlhttpRequest
}

async function queryBHPrice(url) {
    url = url.replace("/BI/20783/KBID/16415/KWID/rtingshprinstock", "")

    return new Promise((resolve, _) => GM_xmlhttpRequest({
        method: 'GET',
        headers: HEADERS,
        url: url,
        onload: function(resp) {
            const ohtml = resp.responseText
            const status = resp.status

            if(ohtml == null || status !== 200)
                throw new Error(`Non 200 code (${status}) or invalid html returned for ASIN ${asin}.`);

            let html = document.createElement('div');
            html.innerHTML = ohtml.trim();

            let price = html.querySelector(".price__9gLfjPSjp").innerHTML.split("$")[1].split(".")[0]
            price = parseFloat(price.replace(/,/g, ''));

            resolve("$"+price);
        }, // onload
        onerror: function() {
            console.error("ERROR when following redirect for bestbuy price");
        },
    })); // new Promise => GM_xmlhttpRequest
}