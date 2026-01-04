// ==UserScript==
// @name         cleanSinaMailAds
// @namespace    https://codernotes.club/
// @version      0.17
// @description  clean Sina mail ads
// @author       mooring@codernotes.club
// @match        *.sina.com.cn/*
// @match        *.sinaimg.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sina.com.cn
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/449021/cleanSinaMailAds.user.js
// @updateURL https://update.greasyfork.org/scripts/449021/cleanSinaMailAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    style.innerText = [
        '.subCProfile + div,flow-ad-slot, ins,.sinaad-toolkit-box,.insertAd,[class*="sinaad"],[id^="BAIDU_SSP"],.extendAd{display:none!important}',
        '.wui-DeckPane .wui-PaneAppContent .pane_mail_pad .subCBody .mailMainArea{width:calc(100% -20px) !important}'
    ].join('')
    document.body.previousElementSibling.appendChild(style)
})();