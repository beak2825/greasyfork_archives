// ==UserScript==
// @name         4chan Posts by ID Inline Count and w/Total Thread IDs Stat.
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  4chan Posts by ID Inline Count and w/Total Thread IDs Stat
// @author       Your Name
// @match        https://boards.4channel.org/biz/thread/*
// @match        https://boards.4chan.org/pol/thread/*
// @match        https://boards.4chan.org/biz/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494513/4chan%20Posts%20by%20ID%20Inline%20Count%20and%20wTotal%20Thread%20IDs%20Stat.user.js
// @updateURL https://update.greasyfork.org/scripts/494513/4chan%20Posts%20by%20ID%20Inline%20Count%20and%20wTotal%20Thread%20IDs%20Stat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ShowInlineCounts = false; // Toggle to enable showing ptbids inline, otherwise just show totals only.
    const enableBackgroundColor = false; // Toggle to enable background color

    function countAndDisplayPosts() {
        const ids = document.querySelectorAll('.posteruid');
        const countMap = {};
        const uniqueIDs = new Set();

        ids.forEach(idElement => {
            const idMatch = idElement.textContent.trim().match(/ID:\s+([^\s]+)/);
            if (idMatch) {
                const id = idMatch[1];
                uniqueIDs.add(id);
                if (!countMap[id]) {
                    countMap[id] = { count: 0, elements: [] };
                }
                countMap[id].elements.push(idElement);
                countMap[id].count++;
            }
        });

        Object.values(countMap).forEach(data => {
            data.elements.forEach(element => {
                const adjustedCount = Math.ceil(data.count / 2); // Adjusting for duplicates
                if (ShowInlineCounts) {
                    updateCountElement(element, adjustedCount);
                }
            });
        });

        const totalPosts = Math.ceil(ids.length / 2); // Adjust post count for duplicates
        updateUIDCount(uniqueIDs.size);
        console.log(`Mutation observed: Total posts counted = ${totalPosts}, Total unique UIDs = ${uniqueIDs.size}`);
    }
function updateCountElement(element, count) {
    if (!element.dataset.updated) {
        element.dataset.updated = 'true';

        // Clear previous updates to prevent duplication
        element.childNodes.forEach(child => {
            if (child !== element.querySelector('.hand')) {
                child.remove();
            }
        });

        // Create new elements for the count and 'pbt'
        const wrapperSpan = document.createElement('span');
        wrapperSpan.className = 'id-wrapper';

        const countText = document.createTextNode(`${count}`);
        const pbtSpan = document.createElement('span');
        pbtSpan.className = 'pbt';
        pbtSpan.textContent = 'pbt';
        const idText = document.createTextNode('ID'); // No colon included in the span

        // Assemble the text within the wrapper
        wrapperSpan.appendChild(countText);
        wrapperSpan.appendChild(pbtSpan);
        wrapperSpan.appendChild(idText);

        // Create a text node for the colon, placed inside the wrapper but before the hand span
        const colonText = document.createTextNode(': ');

        // Create a text node for the opening parenthesis
        const openParenthesis = document.createTextNode('(');

        // Create a text node for the closing parenthesis, placed after the hand span
        const closeParenthesis = document.createTextNode(')');

        // Insert the elements in order
        element.insertBefore(openParenthesis, element.firstChild);  // Insert at the start of the element
        element.insertBefore(wrapperSpan, element.querySelector('.hand'));
        element.insertBefore(colonText, element.querySelector('.hand'));
        element.appendChild(closeParenthesis); // Append at the end of the element
    }
}

    // Add or update CSS dynamically only once
    if (!document.querySelector('style#custom-pbt-style')) {
        const style = document.createElement('style');
        style.id = 'custom-pbt-style';
        style.innerHTML = `
.pbt {
    font-size: 7pt;
    ${enableBackgroundColor ? 'background-color: black; color: white;' : ''}
}
.id-wrapper {
    ${enableBackgroundColor ? 'background-color: black; color: white;' : ''}
}
        `;
        document.head.appendChild(style);
    }




function updateUIDCount(totalUIDs) {
    const statsDivs = document.querySelectorAll('.thread-stats');
    statsDivs.forEach(div => {
        let uidsDisplay = div.querySelector('.uids-count');
        if (!uidsDisplay) {
            uidsDisplay = document.createElement('span');
            uidsDisplay.className = 'uids-count';
            div.appendChild(uidsDisplay);
        }
        const tsRepliesSpan = div.querySelector('.ts-replies');
        const parentDiv = tsRepliesSpan.parentElement;
        parentDiv.insertBefore(uidsDisplay, tsRepliesSpan);
        uidsDisplay.textContent = `IDs: ${totalUIDs} / `;
    });
}


    function setupObserver() {
        const observer = new MutationObserver(mutations => {
            let relevantMutation = mutations.some(mutation => mutation.addedNodes.length > 0 && Array.from(mutation.addedNodes).some(node => node.nodeType === Node.ELEMENT_NODE && node.matches('.postContainer')));
            if (relevantMutation) {
                countAndDisplayPosts();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    countAndDisplayPosts();
    setupObserver();
})();
