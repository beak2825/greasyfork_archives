// ==UserScript==
// @name         csdn remove full ad
// @namespace    http://tampermonkey.net/
// @version      2023-12-27
// @description  close csdn full page ad.
// @author       You
// @match        https://blog.csdn.net/virobotics/article/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498212/csdn%20remove%20full%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/498212/csdn%20remove%20full%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        document.evaluate("/html/body/div[2]/div/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.style.display = "none";
    }, 1000);
    // Your code here...
})();