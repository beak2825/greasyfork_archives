// ==UserScript==
// @name         Remove Tumblr Notecount Borders
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removing the annoying borders from tumblr notecount
// @author       maolen
// @match        http*://*.tumblr.com/*
// @match        http*://*.tumblr.com/dashboard/*
// @run-at       document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466157/Remove%20Tumblr%20Notecount%20Borders.user.js
// @updateURL https://update.greasyfork.org/scripts/466157/Remove%20Tumblr%20Notecount%20Borders.meta.js
// ==/UserScript==

function remove() {
    let collection = document.getElementsByClassName("vE6sH");
    for (let i = 0; i < collection.length; i++) {
        if(parseInt(collection[i].textContent) === 0) {
            collection[i].textContent = "";
        }
        collection[i].style.border = "none";
        collection[i].style.padding = 0;
    }
    setTimeout(remove, 2*1000);
}

remove();