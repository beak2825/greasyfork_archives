// ==UserScript==
// @name         Export Gmail Subjects to TXT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Export email subject list from Gmail to a TXT file.
// @author       Bui Quoc Dung
// @match        https://mail.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527695/Export%20Gmail%20Subjects%20to%20TXT.user.js
// @updateURL https://update.greasyfork.org/scripts/527695/Export%20Gmail%20Subjects%20to%20TXT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractData() {
        // Select email subjects
        let textElements = document.querySelectorAll('.y6 span[data-thread-id]');
        let txtData = [];

        // Iterate through emails and extract content
        textElements.forEach(el => {
            let text = el.textContent.trim();
            txtData.push(text);
        });

        downloadTXT(txtData);
    }

    function downloadTXT(data) {
        let txtContent = data.join("\n");
        let blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'emails.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Add export button to Gmail
    function addExportButton() {
        let container = document.querySelector('div[role="navigation"]');
        if (!container || document.getElementById('export-button')) return;

        let btn = document.createElement('button');
        btn.id = 'export-button';
        btn.innerText = 'Export TXT';
        btn.style.cssText = 'position:fixed;top:50px;right:20px;padding:10px;background:#007bff;color:white;border:none;border-radius:5px;cursor:pointer;z-index:9999;';

        btn.onclick = extractData;
        document.body.appendChild(btn);
    }

    setInterval(addExportButton, 3000); // Ensure button is displayed
})();
