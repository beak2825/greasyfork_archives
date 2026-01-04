// ==UserScript==
// @name         Links searcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  extension for searching links on ali page
// @author       You
// @match        https://aliexpress.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        all
// @license      AER
// @downloadURL https://update.greasyfork.org/scripts/464559/Links%20searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/464559/Links%20searcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for (let i = 0; i < document.links.length; i += 1) {
        document.links[i].style.backgroundColor='#d75b48';
    }
})();