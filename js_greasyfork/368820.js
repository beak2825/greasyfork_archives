// ==UserScript==
// @name         Github Pull Requests Overview link
// @namespace    https://fyndiq.se/
// @version      0.5
// @description  Insert a Pulls Requests Overview and Pulls RFR link in the menu with pre-defined filters
// @author       Fyndiq AB
// @grant        none
// @include      https://github.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/368820/Github%20Pull%20Requests%20Overview%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/368820/Github%20Pull%20Requests%20Overview%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var filters;
    var a;
    var nav = document.querySelector('body > div.position-relative.js-header-wrapper > header > div.Header-item.Header-item--full > nav');

    filters = "&q=user%3Afyndiq+is%3Aopen+-repo%3Afyndiq%2Ffyndiq+";
    a = document.createElement('a');
    a.innerHTML = '<a class="js-selected-navigation-item Header-link mr-3" data-hotkey="g o" href="/pulls?utf8=✓'+filters+'">Pulls Overview</a>';
    nav.insertBefore(a, nav.childNodes[0]);

    filters = "&q=user%3Afyndiq+label%3A%22Ready+for+review%22+is%3Aopen+-repo%3Afyndiq%2Ffyndiq+";
    a = document.createElement('a');
    a.innerHTML = '<a class="js-selected-navigation-item Header-link mr-3" data-hotkey="g o" href="/pulls?utf8=✓'+filters+'">Pulls RFR</a>';
    nav.insertBefore(a, nav.childNodes[1]);
})();