// ==UserScript==
// @name         CC98 HighLight
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  highlight code in www.cc98.org
// @author       Slowist
// @match        https://www.cc98.org/*
// @grant        none
// @run-at       document-end
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/510585/CC98%20HighLight.user.js
// @updateURL https://update.greasyfork.org/scripts/510585/CC98%20HighLight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function loadHighlightJs(callback) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js';
        script.onload = callback;

        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/kimbie-light.min.css';
        document.head.appendChild(style);
        document.head.appendChild(script);
    }

    function loadClipboardJs(callback) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Highlight and add copy buttons
    function AddCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach((codeBlock, index) => {
            if (!codeBlock.nextSibling || !codeBlock.nextSibling.matches('button')) { 
                const copyButton = document.createElement('button');
                copyButton.textContent = 'Copy'; //modify the text
                copyButton.style.position = 'absolute';
                copyButton.style.top = '5px';
                copyButton.style.right = '10px';
                copyButton.style.zIndex = '9999'; //ensure it's on the top
                copyButton.style.backgroundColor = '#E8E8E8';  //modify RGB to change the color of the button
                copyButton.style.color = '#616161';  //modify RGB to change the color of the text
                copyButton.style.cursor = 'pointer';
                copyButton.style.padding = '5px 10px';
                copyButton.style.border = 'none';
                copyButton.style.borderRadius = '3px';

                // Set code block ID
                const codeId = `code-block-${index}`;
                codeBlock.id = codeId;
                copyButton.setAttribute('data-clipboard-target', `#${codeId}`);
                codeBlock.parentNode.style.position = 'relative';
                codeBlock.parentNode.appendChild(copyButton);

                // Initialize Clipboard.js
                const clipboard = new ClipboardJS(copyButton);

                clipboard.on('success', function(e) {
                    copyButton.textContent = 'Copied!';
                    e.clearSelection();
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                });

                clipboard.on('error', function(e) {
                    copyButton.textContent = 'Failed';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy'; 
                    }, 2000);
                });
            }
        });
    }

    function observeDomChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                AddCopyButtons();  // Add buttons on DOM changes
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // HighLight
    loadHighlightJs(() => {
        hljs.configure({ ignoreUnescapedHTML: true });
        hljs.highlightAll();  
        setInterval(() => {
            hljs.highlightAll();  
        }, 100);  
        // ClipButton
        loadClipboardJs(AddCopyButtons);
        observeDomChanges();  // DOM changes
    });
})();
