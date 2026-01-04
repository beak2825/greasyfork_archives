// ==UserScript==
// @name         lolcast-coup
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  롤캐 쿠팡용
// @author       lolcast
// @match        https://poooom6.blogspot.com/2025/04/livecoupang-play.html*
// @match        https://poooom6.blogspot.com/2025/04/cp*.html*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538987/lolcast-coup.user.js
// @updateURL https://update.greasyfork.org/scripts/538987/lolcast-coup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    if (currentUrl.includes('livecoupang-play.html')) {
        GM_addStyle(`
            #chat {
                display: none !important;
            }
            .wrapper {
                width: 100% !important;
            }
        `);
    }
    else if (currentUrl.includes('/cp')) {
        GM_addStyle(`
            #chat {
                display: none !important;
            }
            #video {
                width: 100vw !important;
                height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                object-fit: contain;
                background-color: black;
            }
            body {
                overflow: hidden !important;
            }
        `);
    }
})();