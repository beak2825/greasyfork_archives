// ==UserScript==
// @name         去除水印
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除水印是啥
// @author       You
// @match        http*://*.xiaoke.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoke.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459184/%E5%8E%BB%E9%99%A4%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/459184/%E5%8E%BB%E9%99%A4%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var intervalID;
    intervalID = setInterval(remove_water, 500);

    function remove_water() {
        if (document.getElementById("water-copy")) {
            document.getElementById("water-copy").remove();
            console.log("water-copy has remove");
            clearInterval(intervalID);
        } else {
            console.log("water-copy unload");
        }
    }
}
)();