// ==UserScript==
// @name         GC Questing Keyboard Controls Shiba Shop
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Adds keyboard controls for questing on GC.
// @author       Z & Dij & Shiba
// @match        https://www.grundos.cafe/halloween/esophagor/*
// @match        https://www.grundos.cafe/island/kitchen/*
// @match        https://www.grundos.cafe/winter/snowfaerie/*
// @match        https://www.grundos.cafe/halloween/witchtower/*
// @match        https://www.grundos.cafe/halloween/braintree/*
// @match        https://www.grundos.cafe/safetydeposit/*
// @match        https://www.grundos.cafe/market/wizard/*
// @match        https://www.grundos.cafe/market/browseshop/?owner=*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @downloadURL https://update.greasyfork.org/scripts/507641/GC%20Questing%20Keyboard%20Controls%20Shiba%20Shop.user.js
// @updateURL https://update.greasyfork.org/scripts/507641/GC%20Questing%20Keyboard%20Controls%20Shiba%20Shop.meta.js
// ==/UserScript==

// shoutout to Dij for the massive optimization & to Berna and Kait for further JS help <3

var rmOne = document.querySelector("a.sdb-remove-one-text");
var search = document.querySelector("div.sw_search_submit input.form-control");
var myshop = document.querySelector("div.market_grid.sw_results.margin-1 div.data.sw_mine a");
var shop = document.querySelector(".market_grid.sw_results .data a:nth-child(1)");
var buy = document.querySelector("#searchedItem.shop-item input[type='image']");
var brain = document.querySelector("img[title='Brain Tree Quest']");
var eso = document.querySelector("img[title='Esophagor Quest']");
var chef = document.querySelector("img[title='Kitchen Quest']");
var taelia = document.querySelector("img[title='Taelia Quest']");
var edna = document.querySelector("img[title='Edna Quest']");
var shiba = document.querySelector('a[href*="?owner=Shiba"]');

document.addEventListener("keydown", (event) => {
    if ( !$('input:focus').length > 0 ) {
        if (event.keyCode == 13) { // keycode for enter
            if (rmOne != null) {
                rmOne.click();
            } else if (buy != null) {
                buy.click();
            } else if (search != null) {
                search.click();
            } else if (myshop != null) {
                myshop.click();
            } else if (shiba != null) {
                shiba.click();
            } else if (shop != null) {
                shop.click();
            } else if (location.pathname.match(/halloween|island|winter/)) {
                let queststart = document.getElementById("page_content").querySelector("form .form-control");
                if (queststart != null) {
                    queststart.click();
                } else {
                    document.getElementById("page_content").querySelector(".form-control:first-child[type=button]").click();
                }
            }
        }
    }
});

document.addEventListener("keydown", (event) => {
    let codes = [37, 38, 39, 40] // keycodes for left, up, right, down arrows
    let index = codes.indexOf(event.keyCode) + 1;
    console.log(index);
    if ( !$('input:focus').length > 0 ) {
        if (index > 0 ) {
            let item = document.querySelector(`.itemList .shop-item:nth-child(${index}) img.search-helper-sdb-exists`);
            console.log(item);
            if (item != null) {
                item.click();
            } else {
                document.querySelector(`.itemList .shop-item:nth-child(${index}) img.search-helper-sw`).click();
            }
        }
    }
});

;