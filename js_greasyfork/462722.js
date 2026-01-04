// ==UserScript==
// @name         Hiding button on zelenka.guru
// @namespace    https://example.com/
// @version      1.0
// @description  This script just hides a button
// @match        https://zelenka.guru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462722/Hiding%20button%20on%20zelenkaguru.user.js
// @updateURL https://update.greasyfork.org/scripts/462722/Hiding%20button%20on%20zelenkaguru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const divToHide = document.querySelector("div.forumSearchThreadsButton._forumSearchThreadsButton[rel='._forumSearchThreadsMenu']");

    if (divToHide) {
        divToHide.style.display = "none";
    }
})();
