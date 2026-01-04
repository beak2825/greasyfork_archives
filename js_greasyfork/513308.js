// ==UserScript==
// @name         Replace Halloween with AoTA Theme
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  simulates having AoTA theme unlocked
// @match        https://www.neopets.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513308/Replace%20Halloween%20with%20AoTA%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/513308/Replace%20Halloween%20with%20AoTA%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace images
    const replacements = {
        'https://images.neopets.com/themes/003_hws_9bde9/header_bg.png': 'https://images.neopets.com/themes/024_aota_3db1f/header_bg.png',
        'https://images.neopets.com/themes/003_hws_9bde9/footer_bg.png': 'https://images.neopets.com/themes/024_aota_3db1f/footer_bg.png',
        'https://images.neopets.com/themes/003_hws_9bde9/rotations/1.png': 'https://images.neopets.com/themes/024_aota_3db1f/rotations/1.png',
        'https://images.neopets.com/themes/003_hws_9bde9/rotations/2.png': 'https://images.neopets.com/themes/024_aota_3db1f/rotations/2.png',
        'https://images.neopets.com/themes/003_hws_9bde9/rotations/3.png': 'https://images.neopets.com/themes/024_aota_3db1f/rotations/3.png',
        'https://images.neopets.com/themes/003_hws_9bde9/rotations/4.png': 'https://images.neopets.com/themes/024_aota_3db1f/rotations/4.png',
        'https://images.neopets.com/themes/003_hws_9bde9/rotations/5.png': 'https://images.neopets.com/themes/024_aota_3db1f/rotations/5.png',
        'https://images.neopets.com/themes/003_hws_9bde9/rotations/6.png': 'https://images.neopets.com/themes/024_aota_3db1f/rotations/6.png',
        'https://images.neopets.com/themes/003_hws_9bde9/rotations/7.png': 'https://images.neopets.com/themes/024_aota_3db1f/rotations/7.png',
        'https://images.neopets.com/themes/003_hws_9bde9/rotations/8.png': 'https://images.neopets.com/themes/024_aota_3db1f/rotations/8.png',
        'https://images.neopets.com/themes/003_hws_9bde9/rotations/9.png': 'https://images.neopets.com/themes/024_aota_3db1f/rotations/9.png',
        'https://images.neopets.com/themes/003_hws_9bde9/rotations/10.png': 'https://images.neopets.com/themes/024_aota_3db1f/rotations/10.png',
        'https://images.neopets.com/themes/003_hws_9bde9/rotations/11.png': 'https://images.neopets.com/themes/024_aota_3db1f/rotations/7.png',
        'https://images.neopets.com/themes/003_hws_9bde9/events/neomail.png': 'https://images.neopets.com/themes/024_aota_3db1f/events/neomail.png',
        'https://images.neopets.com/themes/003_hws_9bde9/events/friend_accept.png': 'https://images.neopets.com/themes/024_aota_3db1f/events/friend_accept.png',
        'https://images.neopets.com/themes/003_hws_9bde9/events/friend_request.png': 'https://images.neopets.com/themes/024_aota_3db1f/events/friend_request.png',
        'https://images.neopets.com/themes/003_hws_9bde9/events/battle_accept.png': 'https://images.neopets.com/themes/024_aota_3db1f/events/battle_accept.png',
        'https://images.neopets.com/themes/003_hws_9bde9/events/battle_challenge.png': 'https://images.neopets.com/themes/024_aota_3db1f/events/battle_challenge.png',
        'https://images.neopets.com/themes/003_hws_9bde9/events/warning.png': 'https://images.neopets.com/themes/024_aota_3db1f/events/warning.png',
        'https://images.neopets.com/themes/003_hws_9bde9/events/item.png': 'https://images.neopets.com/themes/024_aota_3db1f/events/item.png',
        'https://images.neopets.com/themes/003_hws_9bde9/events/trade_accept.png': 'https://images.neopets.com/themes/024_aota_3db1f/events/trade_accept.png',
        'https://images.neopets.com/themes/003_hws_9bde9/events/trade_reject.png': 'https://images.neopets.com/themes/024_aota_3db1f/events/trade_reject.png',
        'https://images.neopets.com/themes/003_hws_9bde9/events/trade_offer.png': 'https://images.neopets.com/themes/024_aota_3db1f/events/trade_offer.png',
        'https://images.neopets.com/themes/003_hws_9bde9/events/trade_withdraw.png': 'https://images.neopets.com/themes/024_aota_3db1f/events/trade_withdraw.png',
        'https://images.neopets.com/themes/003_hws_9bde9/events/direct_transfer.png': 'https://images.neopets.com/themes/024_aota_3db1f/events/direct_transfer.png',
    };

    // Function to replace images
    function replaceImages() {
        const images = document.querySelectorAll('img[src]');
        images.forEach(img => {
            if (replacements[img.src]) {
                console.log(`Replaced: ${img.src} with ${replacements[img.src]}`);
                img.src = replacements[img.src];
            }
        });

        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            const bgImage = getComputedStyle(el).backgroundImage;
            if (bgImage) {
                const match = bgImage.match(/url\(["']?([^"']+)["']?\)/);
                if (match && replacements[match[1]]) {
                    console.log(`Replaced background: ${match[1]} with ${replacements[match[1]]}`);
                    el.style.backgroundImage = `url(${replacements[match[1]]})`;
                }
            }
        });
    }

    // Function to replace specific colors
    function replaceColors() {
        const targetColors = ['rgb(75, 146, 146)', '#4B9292', 'rgb(0, 0, 255)']; // Add other colors to replace
        const newColor = '#880808'; // New color to apply

        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            const computedColor = window.getComputedStyle(el).color;
            const computedBgColor = window.getComputedStyle(el).backgroundColor;

            if (targetColors.includes(computedColor)) {
                console.log(`Changing text color on element from ${computedColor} to ${newColor}`);
                el.style.color = newColor;
            }
            if (targetColors.includes(computedBgColor)) {
                console.log(`Changing background color on element from ${computedBgColor} to ${newColor}`);
                el.style.backgroundColor = newColor;
            }
        });
    }

    // Process the page to apply changes
    function processPage() {
        replaceImages();
        replaceColors();
    }

    // Run on page load
    window.addEventListener('load', processPage);

    // Observe for changes in the DOM
    const observer = new MutationObserver(() => {
        clearTimeout(window.processTimeout);
        window.processTimeout = setTimeout(processPage, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();