// ==UserScript==
// @name         Autohide Mangadex Header
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically hides the header when using MangaDex's legacy reader.
// @author       Noah Guillory
// @match        https://mangadex.org/chapter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382071/Autohide%20Mangadex%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/382071/Autohide%20Mangadex%20Header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        document.querySelector('#content > div:nth-child(1) > div > h6 > span.minimise.fas.fa-times.fa-lg.float-right').click();
    }
})();