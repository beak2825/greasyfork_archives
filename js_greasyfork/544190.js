// ==UserScript==
// @name         Manaba Time Modifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace 0:00 times with previous day 24:00 and make them bold on manaba.tsukuba.ac.jp
// @author       You
// @match        https://manaba.tsukuba.ac.jp/ct/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544190/Manaba%20Time%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/544190/Manaba%20Time%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyTimes() {
        // Get all text nodes in the document
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        // Regex to match dates with times of 0:00
        const timeRegex = /(\d{4})-(\d{2})-(\d{2})\s+0:00/g;

        textNodes.forEach(textNode => {
            if (timeRegex.test(textNode.textContent)) {
                const parent = textNode.parentNode;
                const content = textNode.textContent;
                
                // Replace 0:00 with previous day 24:00
                const newContent = content.replace(timeRegex, (match, year, month, day) => {
                    // Create date object and subtract one day
                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    date.setDate(date.getDate() - 1);
                    
                    // Format previous day
                    const prevYear = date.getFullYear();
                    const prevMonth = String(date.getMonth() + 1).padStart(2, '0');
                    const prevDay = String(date.getDate()).padStart(2, '0');
                    
                    return `${prevYear}-${prevMonth}-${prevDay} 24:00`;
                });

                if (newContent !== content) {
                    // Create a span element to hold the modified content
                    const span = document.createElement('span');
                    
                    // Split content and make the time part bold
                    const modifiedHTML = newContent.replace(/(\d{4}-\d{2}-\d{2}\s+24:00)/g, '<strong>$1</strong>');
                    span.innerHTML = modifiedHTML;
                    
                    // Replace the text node with the new span
                    parent.replaceChild(span, textNode);
                }
            }
        });
    }

    // Run the modification when the page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', modifyTimes);
    } else {
        modifyTimes();
    }

    // Also run when new content is dynamically loaded
    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldCheck = true;
            }
        });
        if (shouldCheck) {
            setTimeout(modifyTimes, 100);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();