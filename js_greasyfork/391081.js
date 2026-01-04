// ==UserScript==
// @name         Add the link of "Advanced search" to the GitHub header
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       9sako6
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391081/Add%20the%20link%20of%20%22Advanced%20search%22%20to%20the%20GitHub%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/391081/Add%20the%20link%20of%20%22Advanced%20search%22%20to%20the%20GitHub%20header.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let navElem = document.querySelector("body > div.position-relative.js-header-wrapper > header > div.Header-item.Header-item--full > nav");
    console.log(navElem);
    navElem.insertAdjacentHTML('beforeend', `<a class="js-selected-navigation-item Header-link py-lg-3 d-inline-block" href="/search/advanced">Advanced search</a>`);
})();