// ==UserScript==
// @name         NekoDownloader additional
// @namespace    http://tampermonkey.net/
// @version      2024-02-19
// @description  We Are Love Neko!!!
// @author       BLOODYSHY
// @match        https://files.yande.re/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yande.re
// @grant	GM_addElement
// @grant	GM_addStyle
// @grant	GM_download
// @grant	GM_getResourceText
// @grant	GM_getResourceURL
// @grant	GM_info
// @grant	GM_log
// @grant	GM_notification
// @grant	GM_openInTab
// @grant	GM_registerMenuCommand
// @grant	GM_unregisterMenuCommand
// @grant	GM_setClipboard
// @grant	GM_getTab
// @grant	GM_saveTab
// @grant	GM_getTabs
// @grant	GM_setValue
// @grant	GM_getValue
// @grant	GM_deleteValue
// @grant	GM_listValues
// @grant	GM_addValueChangeListener
// @grant	GM_removeValueChangeListener
// @grant	GM_xmlhttpRequest
// @grant	GM_cookie
// @grant	window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/487860/NekoDownloader%20additional.user.js
// @updateURL https://update.greasyfork.org/scripts/487860/NekoDownloader%20additional.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';
var link = document.createElement('a');
link.href = 'images.png';
link.download = 'Neko.png';
document.body.appendChild(link);
link.click();
document.body.removeChild(link);

setTimeout(function(){
    self.close();
},200);

    // Your code here...

})();