// ==UserScript==
// @name         iCorn
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change any page icon!
// @author       MultiverseG
// @match        https://www.youtube.com/*
// @icon         https://cdn2.iconfinder.com/data/icons/food-icons-6/200/food_corn-512.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480315/iCorn.user.js
// @updateURL https://update.greasyfork.org/scripts/480315/iCorn.meta.js
// ==/UserScript==

function gcloak() {
    var link = document.querySelector("link[rel*='icon']");
    document.createElement('link');
    link.type = 'image/x-icon';link.rel = 'shortcut icon';
    link.href = 'https://cdn2.iconfinder.com/data/icons/food-icons-6/200/food_corn-512.png'; //Use your own image here as the page's favicon
    document.title = 'iCorn'; //Enter the page title you want here.
    console.log(document.title);
    document.getElementsByTagName('head')[0].appendChild(link) };gcloak();setInterval(gcloak, 1000);