// ==UserScript==
// @name         Market.csgo.com Steam Item Price
// @version      1.02
// @description  Shows item lowest price on Steam market
// @author       Yakine
// @match        *market.csgo.com/item/*
// @match        *market.csgo.com/*/item/*
// @match        *market-old.csgo.com/item/*
// @match        *market-old.csgo.com/*/item/*
// @match        *market.dota2.net/*/item/*
// @match        *market.dota2.net/item/*
// @grant        GM_xmlhttpRequest
// @namespace    steamcommunity.com/id/Yakine9
// @downloadURL https://update.greasyfork.org/scripts/455364/Marketcsgocom%20Steam%20Item%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/455364/Marketcsgocom%20Steam%20Item%20Price.meta.js
// ==/UserScript==

const dtm = new RegExp(/market.*dota2.*item/gm);
const csm = new RegExp(/market.*csgo.*item|market-old.*csgo.*item/gm);
let appid;

const currency = 0; // 5 for Rub

if (csm.test(window.location.href))
    appid = "730";
else if (dtm.test(window.location.href))
    appid = "570";

let req = `https://steamcommunity.com/market/priceoverview/?appid=${appid}&currency=${currency}&market_hash_name=`;
const skinName = document.querySelector("title").textContent;

let ind = document.querySelector(".item-extralinks > a").href.indexOf("search");
req += document.querySelector(".item-extralinks > a").href.slice(ind + 7);

let ref = `https://steamcommunity.com/market/listings/${appid}/` +
          document.querySelector(".item-extralinks > a").href.slice(ind + 7);

console.log(req);

GM_xmlhttpRequest({
    method: "GET",
    url: req,
    headers: {
        "Content-Type": "application/json"
    },
    onload: function(req){
        let res = JSON.parse(req.response);
        document
            .querySelector("body > div.content > section > div.left.inner > div.item-page > div.item-page-right > div.item-extralinks")
            .insertAdjacentHTML(
                "afterend",
                `<div style="text-align:center;margin:1rem 0;">
                    <span style="font-size:20px;font-weight:bold;">Steam lowest price : </span>
                    <a href="${ref}" target="_blank" style="font-size:20px">
                        ${res.lowest_price || "Price unavailable"}
                    </a>
                </div>`
            );
    },
    onerror: function(e){
        console.log(e);
    }
});