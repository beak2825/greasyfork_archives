// ==UserScript==
// @name         JIO Vertical
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove empty cells and enables vertical text scrolling on Japanese.IO
// @author       hosma
// @match        https://www.japanese.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421337/JIO%20Vertical.user.js
// @updateURL https://update.greasyfork.org/scripts/421337/JIO%20Vertical.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var frags;
    var check = setInterval(function(){
        frags = document.querySelectorAll(".reader-span.reader-span-fragment");

        if (frags.length != 0) {
            console.log(frags[0].innerText);
            clearInterval(check);
            for (var frag of frags) if (frag.innerText == "　")
                frag.remove();
        }
    },400);
})();