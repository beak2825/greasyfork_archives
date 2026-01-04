// ==UserScript==
// @name         Reddit Comment Context Copier
// @namespace    http://greasyfork.org/
// @version      0.1
// @description  Copy full context of Reddit comments to clipboard
// @author       Chicken & ChatGPT
// @match        https://www.reddit.com/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480013/Reddit%20Comment%20Context%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/480013/Reddit%20Comment%20Context%20Copier.meta.js
// ==/UserScript==
function addButtonToComment(comment) {
    const listItem = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.textContent = 'copy-context';
    anchor.style.cursor = 'pointer';
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        copyCommentContext(comment);
    });

    listItem.appendChild(anchor);
    comment.querySelector('.buttons').appendChild(listItem);
}

window.addEventListener('load', function() {
    // Function to handle added nodes
    function handleAddedNodes(nodes) {
        nodes.forEach(node => {
            if (node.classList && node.classList.contains('comment')) {
                addButtonToComment(node);
            } else if (node.querySelectorAll) {
                node.querySelectorAll('.comment').forEach(addButtonToComment);
            }
        });
    }

    // Set up the observer
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            handleAddedNodes(Array.from(mutation.addedNodes));
        });
    });

    // Start observing
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    // Add buttons to existing comments
    document.querySelectorAll('.comment').forEach(addButtonToComment);
});


function copyCommentContext(comment) {
    let context = '';

    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.nodeValue;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName.toLowerCase() === 'p') {
                return node.textContent + '\n';
            } else if (node.tagName.toLowerCase() === 'blockquote') {
                // Process each child node and prepend '>' to each line
                return Array.from(node.childNodes)
                            .map(child => child.tagName && child.tagName.toLowerCase() === 'p'
                                ? '> ' + child.textContent
                                : processNode(child))
                            .join('\n') + '\n';
            }
            return Array.from(node.childNodes).map(processNode).join('');
        }
        return '';
    }

    let currentElement = comment;
    while (currentElement && currentElement.classList.contains('comment')) {
        const author = "**"+currentElement.querySelector('.author').textContent+"**";
        const commentBody = currentElement.querySelector('.usertext .md');
        const commentText = Array.from(commentBody.childNodes).map(processNode).join('');
        context = author + ': ' + commentText + '\n' + context;
        currentElement = currentElement.parentElement.closest('.comment');
    }
    GM_setClipboard(context.trim());
}


