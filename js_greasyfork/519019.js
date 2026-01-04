// ==UserScript==
// @name         Neopets Bring Back Color
// @description  Brings color back to Neopets.com during TVW plot pause
// @version      2025.01.30
// @license      GNU GPLv3
// @match        https://www.neopets.com/*
// @author       Posterboy
// @namespace    https://youtube.com/@Neo_PosterBoy
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519019/Neopets%20Bring%20Back%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/519019/Neopets%20Bring%20Back%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of CSS file URLs to block
    const cssToBlock = [
        'https://images.neopets.com/plots/tvw/shopkeepers/maps.css?d=20240617',
        'https://images.neopets.com/plots/tvw/shopkeepers/grumpyking.css?d=20240319',
        'https://images.neopets.com/plots/tvw/shopkeepers/wheelofknowledge.css?d=20240530',
        'https://images.neopets.com/plots/tvw/shopkeepers/coltzanshrine.css?d=20240509',
        'https://images.neopets.com/plots/tvw/shopkeepers/bank.css',
        'https://images.neopets.com/plots/tvw/shopkeepers/omelette.css?d=20240523',
        'https://images.neopets.com/plots/tvw/shopkeepers/moneytree.css?d=20240528',
        'https://images.neopets.com/plots/tvw/shopkeepers/magicalgrundo.css?d=20241202',
        'https://images.neopets.com/plots/tvw/shopkeepers/magicalgrundo.css?d=20240516',
    ];

    // Get all link elements on the page
const links = document.querySelectorAll('link[rel="stylesheet"][href]');

    links.forEach(link => {
        // Check if the link's href matches any of the CSS URLs to block
        if (cssToBlock.includes(link.href)) {
            // Remove the matching link element from the page
            link.parentNode.removeChild(link);
        }
    });
})();