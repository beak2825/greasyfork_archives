// ==UserScript==
// @name           Gmail remove spam count
// @name:es        Gmail elimina el contador de spam
// @namespace      http://tampermonkey.net/
// @version        0.1
// @description    Remove spam message counter in gmail
// @description:es Elimina el contador de mensajes de spam en gmail
// @author         IgnaV
// @match          https://mail.google.com/*
// @icon           https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico
// @grant          GM_addStyle
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/447867/Gmail%20remove%20spam%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/447867/Gmail%20remove%20spam%20count.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('[data-tooltip="Spam"] span > a { font-weight: normal!important; }');
    GM_addStyle('[data-tooltip="Spam"] .bsU { display: none!important; }');
})();