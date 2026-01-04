// ==UserScript==
// @name         Kinozal.tv Logo VS
// @namespace    Land of the Valar
// @version      1.2.3
// @description  Replace the logo on kinozal.tv, forum.kinozal.tv, and other related sites with a custom one
// @author       Nemo1
// @match        https://kinozal.tv/*
// @match        https://kinozal.guru/*
// @match        https://forum.kinozal.guru/*
// @match        https://forum.kinozal.tv/*
// @match        https://forum-kinozal-tv.appspot.com/*
// @match        *://*.appspot.com/*
// @match        *://*.kinozal4me.lol/*
// @match        *://kinozal4me.lol/*
// @match        *://*.kinozal4me.site/*
// @match        *://kinozal4me.site/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      i.postimg.cc
// @connect      i.ibb.co
// @connect      *
// @license      MIT
// @icon         https://kinozal.tv/pic/favicon.ico
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/510011/Kinozaltv%20Logo%20VS.user.js
// @updateURL https://update.greasyfork.org/scripts/510011/Kinozaltv%20Logo%20VS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL of the new logo
    const newLogoUrl = 'https://i.ibb.co/sVt6jhP/kinozal-logo-11.png'; // Replace with your new logo URL

    // Block the original logos from loading
    GM_addStyle(`
        img[src="/pic/logo3.gif"],
        img[src="https://kinozal.tv/pic/logo3.gif"],
        img[src="/pic/logo_kinozal_guru.png?v=2"],
        img[src="https://kinozal.guru/pic/logo_kinozal_guru.png?v=3"],
        img[src*="kinozal4me.lol/pic/logo3.gif"] {
            visibility: hidden !important;
        }
    `);

    // Function to load the new logo and replace the old one
    function replaceLogo() {
        // Fetch the new logo
        GM_xmlhttpRequest({
            method: 'GET',
            url: newLogoUrl,
            responseType: 'blob',
            onload: function(response) {
                if (response.status === 200) {
                    // Create a URL for the new logo
                    const newLogoBlob = new Blob([response.response], { type: 'image/png' });
                    const newLogoObjectURL = URL.createObjectURL(newLogoBlob);

                    // Define all possible original logo elements
                    const logoSelectors = [
                        'img[src="/pic/logo3.gif"]',
                        'img[src="https://kinozal.tv/pic/logo3.gif"]',
                        'img[src="/pic/logo_kinozal_guru.png?v=2"]',
                        'img[src="https://kinozal.guru/pic/logo_kinozal_guru.png?v=3"]',
                        'img[src*="kinozal4me.lol/pic/logo3.gif"]'
                    ];

                    // Iterate through each selector and replace the logos
                    logoSelectors.forEach(selector => {
                        const originalLogoElement = document.querySelector(selector);
                        if (originalLogoElement) {
                            const newLogoElement = document.createElement('img');
                            newLogoElement.src = newLogoObjectURL;
                            newLogoElement.alt = 'Кинозал.ТВ';
                            newLogoElement.title = 'Кинозал.ТВ';

                            // Replace the original logo with the new one
                            originalLogoElement.parentNode.replaceChild(newLogoElement, originalLogoElement);
                        }
                    });
                }
            },
            onerror: function() {
                console.error('Failed to load the new logo.');
            }
        });
    }

    // Wait for the DOM to fully load before replacing the logo
    replaceLogo();
})();
