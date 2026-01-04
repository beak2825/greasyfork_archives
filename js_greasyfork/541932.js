// ==UserScript==
// @name         Connect items
// @namespace    http://tampermonkey.net/
// @version      2025-07-07
// @description  Connect RW items
// @author       olesien
// @match        https://www.torn.com/page.php?sid=ItemMarket
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541932/Connect%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/541932/Connect%20items.meta.js
// ==/UserScript==



(function() {
    'use strict';
    let items = [];
    let misc = {market_value: 0};
    let id = 0;
    let orig_url = "";
    const base_url = "https://39th.online/api/v1/rw_market" //https://ultimata.net
    const itemListClass = ".itemList___u4Hg1";
    let key = String(localStorage.getItem("ultimata-key"));
    if (key.length < 10) {
        let apiKey= prompt("Please enter key (public is ok)", "");
        if (apiKey.length > 10) {
            console.log("setting....");
            localStorage.setItem("ultimata-key", apiKey);
            key = apiKey;
        } else {
            alert("That is not a key");
        }
    }
    let addedItems = new Map();

    let old_items = [];
    window.addEventListener('popstate', (event) => {
        console.log('URL changed to:', window.location.href);
        old_items = [];
    });

    const getSearchData = async (response) => {
        if (["https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Defensive", "https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Primary", "https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Secondary", "https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Melee"].includes(window.location.href)) return;
        if (!(window.location.href.includes("Defensive")) && !(window.location.href.includes("Primary")) && !(window.location.href.includes("Secondary")) && !(window.location.href.includes("Melee"))) return;
        const data = await response.clone().json();
        console.log("orig data");
        console.log(data);
        if (data && data?.items) {
            old_items.push(...data.items);
            console.log("old_items");
            console.log(old_items);
            checkExisting();
        }
    }

    const getItem = async (response) => {
        if (["https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Defensive", "https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Primary", "https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Secondary", "https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Melee"].includes(window.location.href)) return;
        if (!(window.location.href.includes("Defensive")) && !(window.location.href.includes("Primary")) && !(window.location.href.includes("Secondary")) && !(window.location.href.includes("Melee"))) return;
        console.log("Checking for logger");
        const data = await response.clone().json();
        const list = data?.list;
        // Do stuff
        //console.log(data);
        if (list && list.length === 1) {
            let item = list[0];

            const otherData = old_items.find(old_item => old_item.listingID === item.listingID);
            if (otherData) {
                item = {...item, ...otherData, ID: item.listingID};

                console.log(item);
                //if (item.anonymous) return; //Early return for anon?
                //We only want to log if the list is exactly 1, meaning that it's a see more click
                const url = `${base_url}/additem?key=${key}`;
                GM.xmlHttpRequest({
                    method: 'POST',
                    url: url,
                    onload: async function (response) {
                        //console.log(response);
                        console.log("Success");
                    },
                    onerror: function (error) {
                        console.error(error);
                        alert("error");
                    },
                    data: JSON.stringify(item),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            } else {
                console.error("Other data not found");
                console.error(item);
                console.error(old_items);
                alert(":(");
            }
        }
    }

    const checkItem = (itemEl, addedItems, i, items, checkNextAndPrev) => {
        const itemProps = itemEl.querySelector(".properties___QCPEP .property___SHm8e .value___cwqHv"); //This is DAMAGE or ARMOR
        const stat = Number(itemProps?.innerText);
        const exists = !!addedItems.get(i);
        console.log(itemEl.children);
        if (!exists && itemEl.children[0]?.children?.length !== 0) {
            //Control check so it's actually the same item being compared...
            itemEl.style.backgroundColor = "green";
            itemEl.addEventListener("click", () => {
                itemEl.remove();
                itemEl.style.backgroundColor = "inherit";
            });
            return true;

        } else {
            //Unmark it
            itemEl.style.backgroundColor = "rgba(1,1,1,0.1)";

            return false;
        }
    }

    const checkMissingItems = () => {
        const list = document.querySelector(itemListClass);
        if (list) {
            const items = Array.from(list.children);
            items.forEach((itemEl, i) => {
                    checkItem(itemEl, addedItems, i, items, true);

            });
        } else {
            console.error("List not found");
        }
    }

    document.addEventListener("keypress", (e) => {
        const code = e.code;
        console.log(code);
        if (code === "Enter") {
            console.log("DELETING??");
            //Delete
            const list = document.querySelector(itemListClass);
            if (list) {
                console.log(list);
                Array.from(list.children).forEach((itemEl, i) => {
                    if (!(itemEl.style.backgroundColor === "green" || itemEl.style.backgroundColor === "red")) {
                        console.log("HIDING");
                        itemEl.style.display = "none";
                    } else {
                        console.log("green (or red");
                    }

                });
            }
        } else if (code === "Backquote") {
            checkMissingItems();
        }
    });
    const checkExisting = async () => {
        const url = `${base_url}/getlistings?key=${key}`;
        console.log(url);
        GM.xmlHttpRequest({
            method: 'POST',
            url: url,
            onload: async function (response) {
                const data = JSON.parse(response.responseText)?.data; //This is all items out of the batch that MATCH

                const listings = new Set(data?.listings ?? []);
                addedItems = new Map(old_items.map((item, index) => [index, listings.has(item.listingID)])); //Map with [index and true|false for has been included]

            },
            onerror: function (error) {
                console.error(error);
                alert("error");
            },
            data: JSON.stringify(old_items.map(item => item.listingID)),
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    const origFetch = unsafeWindow.fetch;
    const getOriginalData = async (response) => {
        console.log("Getting orig data");
        const data = await response.clone().json();
        // Do stuff
        items = data?.list.map(data => ({...data, listingID: data?.listingID ? data?.listingID : data?.ID}));
        //console.log(items);
    }
    unsafeWindow.fetch = async (url, config) => {
        //console.log("Intercepted URL:", url);
        const response = await origFetch(url, config);
        if (url.indexOf("getListing") != -1) {
            getOriginalData(response);
            getItem(response); //For cats
        } else if (url.indexOf("searchItem") != -1 || url.indexOf("getShopList") != -1) {
            //console.log("GOT SEARCH DATA!!!");
            getSearchData(response);
        }
        return response;
    }

})();