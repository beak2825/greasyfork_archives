// ==UserScript==
// @name         Grundos Cafe Tab Reducer
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Reuse the same tab for SDB searching.
// @author       Dij
// @grant        window.close
// @grant        window.focus
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @match        https://www.grundos.cafe/*
// @exclude      https://www.grundos.cafe/~*
// @exclude      https://www.grundos.cafe/userlookup/*
// @exclude      https://www.grundos.cafe/itemview/*
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @license      GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/490138/Grundos%20Cafe%20Tab%20Reducer.user.js
// @updateURL https://update.greasyfork.org/scripts/490138/Grundos%20Cafe%20Tab%20Reducer.meta.js
// ==/UserScript==
const re = /query=(.+)&/; // grabs the item name from the SDB link
const resaf = /^\/saf/;
const reshop = /seshop\/$/;
const saflink = "a[href^=\"/saf\"]";

const menu_command_id_1 = GM_registerMenuCommand("Toggle automatic tab closure", function() {
    /*local storage only stores as string, apparently*/
    let newOption = 1 - Number(localStorage.getItem("Dij_GCTabReducer_ShopBuyClose"));
    localStorage.setItem("Dij_GCTabReducer_ShopBuyClose", newOption);
    let optionText = newOption ? "true":"false";
    alert(`Automatic tab closure is now set to: ${optionText}`);
}, {
    autoClose: true
});

const menu_command_id_2 = GM_registerMenuCommand("Reset stored values", function() {
    alert("Values reset! (This did not reset your tab close preferences)");
    GM_setValue("searchTerm", "");
    GM_setValue("refresh", "0");
    GM_setValue("sdb", "0");
}, {
    autoClose: true
});

/* If your saved settings are bugged, uncomment this and select it
const menu_command_id_3 = GM_registerMenuCommand("!!Hard Reset (no confirmation)!!", function() {
    GM_setValue("searchTerm", "");
    GM_setValue("refresh", "0");
    GM_setValue("sdb", "0");
    localStorage.removeItem("Dij_GCTabReducer_ShopBuyClose");
}, {
    autoClose: true
});
*/
async function sleep(ms) {
    /*i stole this from https://dev.to/noamsauerutley/getting-sleep-with-promises-in-js-5f09
      bc idk async and im too afraid to ask*/
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sdbHandler(zEvent) {
    /*If a tab with SDB isn't open already, open one.*/
    if(GM_getValue("sdb") !== 1) {
        if (this.searchTerm) {
            window.open(`https://www.grundos.cafe/safetydeposit/?page=1&query=${this.searchTerm}&exact=1`,
                    "_blank");
        } else {
            window.location.href=`https://www.grundos.cafe/safetydeposit/`;
        }
    } else {
        /*this is jank sorry lol*/
        if (GM_getValue("searchTerm") != this.searchTerm) {
            GM_setValue("searchTerm", this.searchTerm);
        } else {
            GM_setValue("searchTerm", "&nbsp;" );
            GM_setValue("searchTerm", this.searchTerm);
        }
    }
}

function sdbSearch(key, oldValue, newValue, remote) {
    window.location.href=`https://www.grundos.cafe/safetydeposit/?page=1&query=${newValue}&exact=1`;
    window.focus();
}

function removeSDBTab (event){
    GM_setValue("sdb",0);
    GM_removeValueChangeListener("searchTerm");
}

async function closeAfterBuy() {
    /*Adds a listener to the searched item, adding a flag persistent to this tab.
      After refreshing, the script can see the flag is set, and closes it after 1 second.*/
    if (GM_getValue("refresh") == 1){
        console.log("Thank you, you're my favorite customer!");
        GM_setValue("refresh", 0);
        if (Number(localStorage.getItem("Dij_GCTabReducer_ShopBuyClose"))) {
            await sleep(1000);
            window.close();
        }
    } else {
        let searchedItem = document.getElementById("searchedItem");
        if (searchedItem) {
            searchedItem.querySelector("form").addEventListener("click", (event) => {GM_setValue("refresh", 1)});
        }
    }
}

function linkReplacer(element) {
    if (element.href.match(re)) { // It's a search helper
        element.searchTerm = element.href.match(re)[1].replace(/%20/g, " ");
    } else { // It's a regular link to the SDB
        element.searchTerm = "";
    }
    element.addEventListener("click", sdbHandler);
    element.removeAttribute("href");
    element.removeAttribute("target");
}

(function() {
    'use strict';
    try {
        if(localStorage.getItem("Dij_GCTabReducer_ShopBuyClose") === null) {
            // Initialize to automatically close after buying a searched item
            console.log("Initializing settings...");
            localStorage.setItem("Dij_GCTabReducer_ShopBuyClose", "1");
        }
        if (location.pathname.match(resaf)) { // SDB
            GM_addValueChangeListener("searchTerm", sdbSearch);
            window.addEventListener("beforeunload", removeSDBTab);
            GM_setValue("sdb",1);
        } else if (location.pathname.match(reshop)) { // User Shops
            closeAfterBuy();
        } else {
            var content;
            if (content = document.getElementById("page_content")) {
                var searchhelps = content.querySelectorAll(".searchhelp");
                var lensearch = searchhelps.length
                for (let i = 0; i < lensearch; i++) {
                    /*Captures the search term of each SDB search helper and stores it in the element.
                      Replaces the link with my own method that executes on click instead.*/
                    let b = searchhelps[i].querySelector(saflink);
                    linkReplacer(b);
                }
            }
        }
    } catch (error) {
        alert(`Error: ${error}`);
    }
})();