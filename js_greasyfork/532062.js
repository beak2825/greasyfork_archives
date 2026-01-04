// ==UserScript==
// @name         SaveMyExams Bypass
// @namespace    http://tampermonkey.net/
// @version      2025-04-07
// @description  Allows you to view unlimited notes, exam questions and past papers for free.
// @author       You
// @match        https://www.savemyexams.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=savemyexams.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532062/SaveMyExams%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/532062/SaveMyExams%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onclick = (e) => {
        if(e.target.classList.contains("btn") || e.target.parentElement.classList.contains("btn")) {
            localStorage.clear();
            console.log("Cleared")
        }
    }
})();