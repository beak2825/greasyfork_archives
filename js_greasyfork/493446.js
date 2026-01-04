// ==UserScript==
// @name         Empornium: Name to tag search
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Takes marked text and searches empornium
// @author       Your Name
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=empornium.is
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493446/Empornium%3A%20Name%20to%20tag%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/493446/Empornium%3A%20Name%20to%20tag%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to process text
    function processSelectedText() {
        const selectedText = window.getSelection().toString();
        if (!selectedText) {
            alert("Please select some text before using this command.");
            return null;
        }
        let processedText = selectedText.trim().toLowerCase().replace(/\s+/g, '.');
        return encodeURIComponent(processedText);
    }

    // Navigate in current tab
    function navigateInCurrentTab() {
        const processedText = processSelectedText();
        if (processedText) {
            window.location.href = `https://www.empornium.is/torrents.php?order_by=seeders&order_way=desc&searchtext=&action=advanced&title=&sizeall=&sizetype=gb&sizerange=0.01&filelist=&taglist=${processedText}&autocomplete_toggle=on`;
        }
    }

    // Open in new tab
    function openInNewTab() {
        const processedText = processSelectedText();
        if (processedText) {
            GM_openInTab(`https://www.empornium.is/torrents.php?order_by=seeders&order_way=desc&searchtext=&action=advanced&title=&sizeall=&sizetype=gb&sizerange=0.01&filelist=&taglist=${processedText}&autocomplete_toggle=on`, true);
        }
    }

    // Register menu commands
    GM_registerMenuCommand("Emp (Ctrl+Alt+C)", navigateInCurrentTab, 'c');
    GM_registerMenuCommand("Emp in New Tab (Ctrl+Alt+N)", openInNewTab, 'n');

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.code === 'KeyN') {
            e.preventDefault();
            openInNewTab();
        } else if (e.ctrlKey && e.altKey && e.code === 'KeyC') {
            e.preventDefault();
            navigateInCurrentTab();
        }
    });
})();
