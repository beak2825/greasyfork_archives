// ==UserScript==
// @name         GroundNews Unlimited Articles
// @namespace    http://tampermonkey.net/
// @version      v1.0.0
// @description  Remove the 5 free articles limit on ground.news
// @author       Kilometres
// @match        https://ground.news/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ground.news
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522113/GroundNews%20Unlimited%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/522113/GroundNews%20Unlimited%20Articles.meta.js
// ==/UserScript==

(function() {
    'use strict';
    localStorage.removeItem("articlesAccessed")
    var localStorageSetItem = localStorage.setItem;
    localStorage.setItem = function(item, value) {
        if (item != "articlesAcessed") {localStorageSetItem(item, value);}
    }
})();