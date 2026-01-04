// ==UserScript==
// @name         Ban All Fun in Ace Attorney Online
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disables specific lines in the Ace Attorney client.css file to make it not fun
// @author       Uri
// @match        web.aceattorneyonline.com/*
// @grant        GM_addStyle
// @licence      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463019/Ban%20All%20Fun%20in%20Ace%20Attorney%20Online.user.js
// @updateURL https://update.greasyfork.org/scripts/463019/Ban%20All%20Fun%20in%20Ace%20Attorney%20Online.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .lm_item .lm_header .lm_controls .lm_maximise { display: none !important; }
        div * { font-family: unset !important; }
        img { animation: none !important; }
        #client_chatcontainer { animation: none !important; }
        button:hover { animation: none !important; }
        .area-button:hover { animation: none !important; }
        .menu_button { animation: none !important; }
        .text_rainbow { background-color: unset !important; background-image: none !important; -webkit-text-fill-color: unset !important; animation: none !important; }
        #client_error { display: none !important; }
        #client_errortext { animation: none !important; }
        #client_secondfactor { display: none !important; }
    `);
})();