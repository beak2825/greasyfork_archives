// ==UserScript==
// @name         Native Spellcheck for Outlook Online
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enables the native Spellcheck for Outlook Online
// @author       Gerrit De Vriese
// @match        https://outlook.office.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442939/Native%20Spellcheck%20for%20Outlook%20Online.user.js
// @updateURL https://update.greasyfork.org/scripts/442939/Native%20Spellcheck%20for%20Outlook%20Online.meta.js
// ==/UserScript==

(function () {
    'use strict'
    window.document.addEventListener("click",
        function (param) {
            param.target.spellcheck = true
        })
})()