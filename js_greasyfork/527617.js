// ==UserScript==
// @name         Gemini Conversation Exporter
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Export Gemini conversation
// @author       Charles Chan
// @match        https://gemini.google.com/*
// @require      https://cdn.jsdelivr.net/npm/turndown@7.1.1/dist/turndown.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527617/Gemini%20Conversation%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/527617/Gemini%20Conversation%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let exportButton = document.createElement('button');
    exportButton.textContent = 'Export Conversation';
    exportButton.onclick = function() {
        let conversationElement = document.querySelector('chat-window');
        let conversationText = '';
        if (conversationElement) {
          	const turndownService = new TurndownService();
          	turndownService.addRule('codeblock', {
              filter: function (node) {
                return node.nodeName.toLowerCase() === 'code-block';
              },
              replacement: function (content) {
                return '```\n' + content + '\n```';
              }
            });
          	conversationText = turndownService.turndown(conversationElement.innerHTML);
        }
      
        let label = document.querySelector('.selected');
        let filename = label ? label.innerText : 'conversation';

        let blob = new Blob([conversationText], { type: 'text/markdown' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename + '.md';
        a.click();
    };

    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                let toolbar = document.querySelector('.gds-label-l');
                if (toolbar) {
                  	toolbar.appendChild(exportButton);
                    observer.disconnect();
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
