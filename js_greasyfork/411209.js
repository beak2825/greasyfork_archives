// ==UserScript==
// @name         Mangaplus Custom Default Settings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom default settings
// @author       You
// @match        https://mangaplus.shueisha.co.jp/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/411209/Mangaplus%20Custom%20Default%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/411209/Mangaplus%20Custom%20Default%20Settings.meta.js
// ==/UserScript==

(function() {
    /*
    * quarity: low, high, super_high
    * viewerMode: vertical, horizontal
    */
    localStorage.setItem("quarity","super_high");
    localStorage.setItem("viewerMode","horizontal");
})();