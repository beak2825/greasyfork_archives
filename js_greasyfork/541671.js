// ==UserScript==
// @name        Restore scrollbar
// @namespace   Violentmonkey Scripts
// @match       https://france.muji.eu/*
// @match       https://www.commencal.com/*
// @grant       GM_addStyle
// @version     1.0
// @author      kirinyaga
// @description 01/07/2025 15:56:32
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541671/Restore%20scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/541671/Restore%20scrollbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to restore scrollbars
    GM_addStyle(`
        html {
            overflow-y: scroll !important;
        }
        body {
            overflow-y: auto !important;
        }
        ::-webkit-scrollbar {
            -webkit-appearance: none;
            width: 12px !important;
        }
        ::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,.2) !important;
            border-radius: 10px !important;
        }
        ::-webkit-scrollbar-track {
            background: rgba(0,0,0,.05) !important;
            border-radius: 10px !important;
        }
    `);

    // Remove any elements that might be blocking scroll
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
        el.style.overflow = '';
        el.style.overflowX = '';
        el.style.overflowY = '';
    });
})();
