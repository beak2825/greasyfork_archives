// ==UserScript==
// @name         GC Questing Keyboard Controls
// @namespace    http://tampermonkey.net/
// @version      3.4.5
// @description  Adds keyboard controls for questing on GC.
// @author       Z & Dij
// @match        https://www.grundos.cafe/halloween/esophagor/*
// @match        https://www.grundos.cafe/island/kitchen/*
// @match        https://www.grundos.cafe/winter/snowfaerie/*
// @match        https://www.grundos.cafe/halloween/witchtower/*
// @match        https://www.grundos.cafe/halloween/braintree/*
// @match        https://www.grundos.cafe/winter/grundo/*
// @match        https://www.grundos.cafe/safetydeposit/*
// @match        https://www.grundos.cafe/market/wizard/*
// @match        https://www.grundos.cafe/market/browseshop/?owner=*
// @license      MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @downloadURL https://update.greasyfork.org/scripts/486718/GC%20Questing%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/486718/GC%20Questing%20Keyboard%20Controls.meta.js
// ==/UserScript==

// shoutout to Dij for the massive optimization & to Berna and Kait for further JS help <3

var rmOne = document.querySelector("a.sdb-remove-one-text");
var search = document.querySelector("div.sw_search_submit input.form-control");
var shop = document.querySelector(".market_grid.sw_results .data a:nth-child(1)");
var myshop = document.querySelector("div.market_grid.sw_results.margin-1 div.data.sw_mine a");
var buy = document.querySelector("#searchedItem.shop-item input[type='image']");
var brain = document.querySelector("img[title='Brain Tree Quest']");
var eso = document.querySelector("img[title='Esophagor Quest']");
var chef = document.querySelector("img[title='Kitchen Quest']");
var taelia = document.querySelector("img[title='Taelia Quest']");
var edna = document.querySelector("img[title='Edna Quest']");

document.addEventListener("keydown", (event) => {
    if (!$('input:focus').length > 0) {
        if (event.keyCode == 13) { // keycode for enter
            if (rmOne != null) {
                rmOne.click();
            } else if (buy != null) {
                buy.click();
            } else if (search != null) {
                search.click();
            } else if (myshop != null) {
                myshop.click();
            } else if (shop != null) {
                shop.click();
            } else if (location.pathname.match(/halloween|island|winter/)) {
                let formbuttons = document.getElementById("page_content")
                    .querySelectorAll("form .form-control:not([type=text]), .form-control[type=button]");
                if (formbuttons.length > 1) {
                    formbuttons[0].click();
                } else {
                    window.location.reload();
                }
            }
        }
    }
});

document.addEventListener("keydown", (event) => {
    let codes = [37, 38, 39, 40] // keycodes for left, up, right, down arrows
    let index = codes.indexOf(event.keyCode);
    let itemlist = document.querySelectorAll(".shop-item,.inv-item");
    if (itemlist.length == 0) {
        itemlist = document.querySelectorAll(".shop-item,.quest-item,.centered-item,.inv-item");
    }
    if (!$('input:focus').length > 0) {
        if (index >= 0) {
            let item =
                itemlist[index].querySelector(`img.search-helper-sdb-exists`);
            if (item != null) {
                item.click();
            } else {
                itemlist[index].querySelector(`img.search-helper-sw`).click();
            }
        }
    }
});

const actions = { // numbers 49-53 represent keycodes 1-5, change those to change the hot keys!
    49: () => edna.click(),   // 1
    50: () => eso.click(),    // 2
    51: () => taelia.click(), // 3
    52: () => chef.click(),   // 4
    53: () => brain.click()   // 5
};
document.addEventListener("keydown", (event) => {
    if (!$('input:focus').length > 0) {
        if (actions[event.keyCode]) {
            actions[event.keyCode]();
        }
    }
});