// ==UserScript==
// @name        Remove PW images
// @namespace   https://politicsandwar.com/nation/id=98616
// @description Hide any images that you would prefer not to see on the Politics and War website
// @version     0.1
// @author      Talus
// @license     GPL-3.0-or-later
// @match       *://*.politicsandwar.com/*
// @run-at      document-start
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/467676/Remove%20PW%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/467676/Remove%20PW%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var configId = 'blockedImgUrlsConfig';  // Configuration ID for GM_config

    // Create the GM_config object
    var config = new GM_config({
        id: configId,
        title: 'Blocked Image URLs Configuration',
        fields: {
            blockedImgUrls: {
                label: 'Blocked URLs (one per line)',
                type: 'textarea',
                cols: 50,
                rows: 10
            }
        },
        events: {
            save: function() {
                var newBlockedUrls = config.get('blockedImgUrls').split('\n').map(url => url.trim());
                GM_setValue('blockedImgUrls', newBlockedUrls);
                blockImages(newBlockedUrls); // Block the images based on the updated URLs
            }
        }
    });

    // Register a menu command to open the configuration interface
    GM_registerMenuCommand('Manage Blocked URLs', config.open.bind(config));

    // Retrieve the blocked URLs from the user script settings
    var blockedImgUrls = GM_getValue('blockedImgUrls', []);

    // Block the images based on the stored blocked URLs
    blockImages(blockedImgUrls);

    // Function to block the images based on the provided URLs
    function blockImages(urls) {
        var css = urls.map(url => `img[src*="${decodeURIComponent(url)}"] { display: none !important; }`).join('\n');
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
})();
