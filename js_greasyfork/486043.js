// ==UserScript==
// @name         Imgur: enable line breaks in comments in the old design
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  This script makes line breaks in comments visible. Normally, in the HTML, they are new line characters (\n), which aren't displayed as line breaks by a browser. This simply replaces them with <br/> elements, which are. You can enter line breaks, with or without this script, by pasting them from the clipboard.
// @author       Corrodias
// @match        https://imgur.com/gallery/*
// @match        https://imgur.com/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486043/Imgur%3A%20enable%20line%20breaks%20in%20comments%20in%20the%20old%20design.user.js
// @updateURL https://update.greasyfork.org/scripts/486043/Imgur%3A%20enable%20line%20breaks%20in%20comments%20in%20the%20old%20design.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof imgur === 'undefined') return; // This is not the old design.

    let isGallery = window.location.pathname.startsWith('/gallery/'); // Otherwise, it's a user page.

    waitForElement('#captions').then(commentsSection => {
        // Update all currently displayed comments.
        updateComments(commentsSection);
        // Do the same on any comment that is loaded dynamically.
        mutationObserver.observe(commentsSection, { childList: true, subtree: true });
    });

    //////////////////////////////////////////////////

    // The comments container is not necessarily loaded before the script runs. Wait for it.
    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector))
                return resolve(document.querySelector(selector));

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    const mutationObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    //console.log(node);
                    processAddedElementOldDesign(node);
                }
            }
        }
    });

    function processAddedElementOldDesign(node) {
        if (isGallery && node.classList.contains('children')) {
            // Replies were expanded, or navigation to a new post loaded a whole, new set of comments. We can safely update just the new nodes.
            updateComments(node);
        } else if (isGallery && node.classList.contains('comment')) {
            // The user navigated to the "context" or "permalink" of an already displayed comment. Imgur modifies the existing structure rather than replace the nodes.
            updateComments(document.querySelector('#captions')); // The node that was added was a reply, not the top level comment, to replace all of them.
        } else if (!isGallery && node.classList.length === 0 && node.tagName === 'DIV') {
            // Comments on a user's "comments" or "replies" pages just loaded.
            updateComments(node);
        }
    }

    function getPointsDetailsConfig() {
        return {
            getSubElements: (node) => node.querySelectorAll('.caption'),
            getCommentDataFunction: getCommentDataOldDesign,
        };
    }

    function updateComments(node) {
        let config = getPointsDetailsConfig();
        let commentElements = config.getSubElements(node);
        for (const element of commentElements) {
            // Pull the comment data from the React objects.
            let commentData = config.getCommentDataFunction(element);
            if (commentData === undefined || commentData === null) continue; // no data found

            // Update the text.
            let text = element.querySelector('div.usertext > span > span');
            if (text.innerHTML != null)
                text.innerHTML = text.innerHTML.replaceAll('\n', '<br/>');
        }
    }

    function getCommentDataOldDesign(node) {
        // The rest of the name past the $ is not always identical.
        for (const propertyKey in node) {
            if (propertyKey.startsWith('__reactInternalInstance$'))
                return node[propertyKey]._currentElement._owner._instance.props.comment;
        }

        return null;
    }
})();