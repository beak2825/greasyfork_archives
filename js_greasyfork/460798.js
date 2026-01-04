// ==UserScript==
// @name         Leetcode Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Leetcode Enhancements. 1) Use Go Mono for Console. 2) Press Ctrl+E twice to reset the problem.
// @author       Senthil Kumaran
// @match        *://*leetcode.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460798/Leetcode%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/460798/Leetcode%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[tampermonkey-leetcode] Leetcode Enhancements.");


    let leetcode_css =`
        /* leetcode problem description */
        .content__1Y2H {
            font-size:1rem;
        }
        /* leetcode editor */
        .monaco-mouse-cursor-text {
            font-family: Go Mono !important;
            font-weight: 400 !important;
            letter-spacing: 0.1rem !important;
        }
        `

    console.log("[tampermonkey-leetcode] GM_addstyle");
    GM_addStyle(leetcode_css)

    console.log("[tampermonkey-leetcode] Enhanced Problem Statement");

    document.onkeyup=function(e){
        if(e.ctrlKey && e.which == 69) {


            document.querySelectorAll(".\\!flex-nowrap > div:nth-child(3) > button:nth-child(1)").forEach(resetToDefault => {
                resetToDefault.click();
            });

            document.querySelectorAll("button.text-label-r:nth-child(1)").forEach(confirm => {
                confirm.click();
            });
            return false;
        }
    }

    console.log("[tampermonkey-leetcode] Hotkey Insertion");

})();