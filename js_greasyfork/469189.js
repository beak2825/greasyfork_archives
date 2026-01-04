// ==UserScript==
// @name         MZ - Neon Lights
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Neon lights for your username
// @author       Douglas
// @match        https://www.managerzone.com/?p=tactics
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469189/MZ%20-%20Neon%20Lights.user.js
// @updateURL https://update.greasyfork.org/scripts/469189/MZ%20-%20Neon%20Lights.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        @keyframes neon {
            0% { text-shadow: 0 0 5px #00f, 0 0 10px #00f, 0 0 15px #00f, 0 0 20px #00f; }
            50% { text-shadow: 0 0 10px #00f, 0 0 20px #00f, 0 0 30px #00f, 0 0 40px #00f; }
            100% { text-shadow: 0 0 5px #00f, 0 0 10px #00f, 0 0 15px #00f, 0 0 20px #00f; }
        }
        #mz_logo {
            color: #0ff;
            animation: neon 1s infinite;
        }
    `);

    window.onload = function() {
        const username = document.getElementById("header-username").textContent;
        const mzLogo = document.getElementById("mz_logo");
        if (mzLogo) {
            mzLogo.textContent = username;
        }
    }
})();
