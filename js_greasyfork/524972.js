// ==UserScript==
// @name         Bloxd Auto Typer
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  يكتب تلقائيًا عبارة ⚡_Super_⚡ عند الضغط على Enter في مواقع Bloxd.io
// @author       اسمك هنا
// @match        *://bloxd.io/*
// @match        *://staging.bloxd.io/*
// @match        *://apkpure.bloxd.io/*
// @match        *://admin.bloxd.io/*
// @match        *://bloxdcdn.bloxdhop.io/*
// @match        *://static2.bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524972/Bloxd%20Auto%20Typer.user.js
// @updateURL https://update.greasyfork.org/scripts/524972/Bloxd%20Auto%20Typer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // يمنع الإرسال التلقائي
            let chatInput = document.activeElement; // يحدد مكان الكتابة
            if (chatInput && chatInput.tagName === 'INPUT') {
                chatInput.value = '⚡_Super_⚡'; // كتابة العبارة
                setTimeout(() => { 
                    chatInput.dispatchEvent(new Event('input', { bubbles: true })); 
                }, 10);
            }
        }
    });
})();
