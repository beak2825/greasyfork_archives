// ==UserScript==
// @name         Ubiquiti Wireguard server QR code fix
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Apply CSS to specific content on a website
// @author       BerserkeR_031
// @match        https://192.168.0.1/network/*/settings/vpn/server/form/*
// @grant        GM_addStyle
// @icon         https://www.ui.com/microsite/favicon.ico?v=2
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487192/Ubiquiti%20Wireguard%20server%20QR%20code%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/487192/Ubiquiti%20Wireguard%20server%20QR%20code%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change CSS if it's no longer working, here.
    GM_addStyle(`
        :root canvas {
            background-color: white !important;
        }
    `);
})();
