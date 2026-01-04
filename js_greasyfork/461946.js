// ==UserScript==
// @name         Website Navigation Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a menu to help navigate to other websites easily on the Google Search website
// @author       Bright Day
// @match        https://www.google.com/*
// @grant        GM_addStyle
// @license      Bright Day
// @downloadURL https://update.greasyfork.org/scripts/461946/Website%20Navigation%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/461946/Website%20Navigation%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the menu element
    var menu = document.createElement('div');
    menu.id = 'website-navigation-menu';

    // Add the menu items
    var items = [
        {
            label: 'Example Website 1',
            url: 'https://www.example.com/'
        },
        {
            label: 'Example Website 2',
            url: 'https://www.example2.com/'
        },
        {
            label: 'Example Website 3',
            url: 'https://www.example3.com/'
        }
    ];

    items.forEach(function(item) {
        var link = document.createElement('a');
        link.innerText = item.label;
        link.href = item.url;
        menu.appendChild(link);
    });

    // Add the menu to the page
    var container = document.createElement('div');
    container.id = 'website-navigation-container';
    container.appendChild(menu);
    document.body.appendChild(container);

    // Style the menu
    GM_addStyle('#website-navigation-container { position: fixed; top: 50px; right: 50px; } #website-navigation-menu { display: flex; flex-direction: column; } #website-navigation-menu a { margin-bottom: 10px; }');
})();
