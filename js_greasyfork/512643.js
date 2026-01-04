// ==UserScript==
// @name         Custom CSS for Max Width and Font
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Change max message width and font size
// @author       Clawberry
// @match        https://character.ai/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512643/Custom%20CSS%20for%20Max%20Width%20and%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/512643/Custom%20CSS%20for%20Max%20Width%20and%20Font.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS
    GM_addStyle(`
        .max-w-xl {
            max-width: 80rem !important;
        }

        .max-w-3xl {
            max-width: 80rem !important;
            font-size: 1.2rem !important;
        }

        .overflow-y-scroll {
            overflow-y: auto !important;
            scrollbar-width: thin !important;
        }

        .overflow-x-auto {
            scrollbar-width: thin !important;
        }

        .overflow-x-hidden {
            scrollbar-width: thin !important;
        }

        .max-w-2xl {
            max-width: 75rem !important;
        }

        .flex {
            scrollbar-width: thin !important;
        }
    `);
})();