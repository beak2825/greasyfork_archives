// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.1
// @description  sfskfskfskfs
// @author       You
// @match        http://manhua.ikuku.cc/comiclist/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ikuku.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476612/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/476612/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("keyup",(e)=>{
        if (e.keyCode == 39) {
            let element = document.querySelector("body > table:nth-child(2) > tbody > tr > td > a:nth-child(5)");

            element.click();
        }else if (e.keyCode == 37) {

            let element = document.querySelector("body > table:nth-child(2) > tbody > tr > td > a:nth-child(11)");

            element.click();
        }
    })

    // Your code here...
})();