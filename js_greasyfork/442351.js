// ==UserScript==
// @name         Tanki battle chat by 0xE3
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tanki online battle chat restored and improved by 0xE3
// @author       0xE3
// @match        https://*.tankionline.com/*
// @icon         https://tankicheats.com/favicon.ico
// @require      https://firebasestorage.googleapis.com/v0/b/tankichat-e80a2.appspot.com/o/new-chat.js?alt=media
// @grant        GM_xmlhttpRequest
// @connect      tankicheats.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442351/Tanki%20battle%20chat%20by%200xE3.user.js
// @updateURL https://update.greasyfork.org/scripts/442351/Tanki%20battle%20chat%20by%200xE3.meta.js
// ==/UserScript==

tanki.AddMuteOption();
tanki.restoreChat();