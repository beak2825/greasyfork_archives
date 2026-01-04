// ==UserScript==
// @name         WhatsApp Web - Disable Ctrl+Delete Shortcut
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevents WhatsApp Web from clearing chat when pressing Ctrl+Delete
// @author       oscardianno
// @match        https://web.whatsapp.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532577/WhatsApp%20Web%20-%20Disable%20Ctrl%2BDelete%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/532577/WhatsApp%20Web%20-%20Disable%20Ctrl%2BDelete%20Shortcut.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(e) {
    if (e.key === 'Delete' && e.ctrlKey) {
        e.stopImmediatePropagation();
    }
}, true);