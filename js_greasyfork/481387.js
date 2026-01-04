// ==UserScript==
// @name         Imgur: add vote counts to comments
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script adds vote counts (+ and -) to the visible points on comments. This information is normally not viewable on the web site despite being loaded from the API. It also removes the "via Android" and "via iPhone" badges in the old design, because I have a tendency to click on them accidentally and don't feel that they add any value.
// @author       Corrodias
// @match        https://imgur.com/gallery/*
// @match        https://imgur.com/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481387/Imgur%3A%20add%20vote%20counts%20to%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/481387/Imgur%3A%20add%20vote%20counts%20to%20comments.meta.js
// ==/UserScript==

// TODO: In the new design, navigating to the user profile or to different "tabs" within the profile doesn't reload the page like it does in the old design, and this approach doesn't work for that. I should fix that some time. It may also be inefficient to listen to *every* mutation until then.

(function() {
    'use strict';

    let isOldDesign = (typeof imgur !== 'undefined'); // This object only seems to exist in the old design.
    let isGallery = window.location.pathname.startsWith('/gallery/'); // Otherwise, it's a user page.

    let commentsSectionSelector = isOldDesign ? '#captions' : isGallery ? '.CommentsList-comments' : '.ProfileComments';

    waitForElement(commentsSectionSelector).then(commentsSection => {
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
                    if (isOldDesign)
                        processAddedElementOldDesign(node);
                    else
                        processAddedElementNewDesign(node);
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

    function processAddedElementNewDesign(node) {
        if (isGallery && node.classList.contains('GalleryComment-replies')) {
            // Replies were expanded. We can safely update just the new nodes.
            updateComments(node);
        } else if (isGallery && node.classList.contains('GalleryComment')) {
            // A gallery page loaded comments either due to post navigation or the user choosing the "context" of a post.
            // `.parentElement` simply gets the wrapper that contains this comment and all replies.
            updateComments(node.parentElement);
        } else if (!isGallery && node.classList.contains('ProfileComments-comment')) {
            // Comments on a user's "comments" page just loaded.
            updateComments(node);
        }
    }

    function updateComments(node) {
        hideMobileBadges(node);
        removeOldPointsDetails(node);
        addPointsDetails(node);
    }

    function hideMobileBadges(node) {
        if (!isOldDesign) return; // It's more complicated in the new design. I'm not bothering with it, for now.
        // Hide the Android/iPhone badges. Do not remove them, or React will break.
        let via = node.querySelectorAll('.via');
        for (const a of via) {
            a.style.display = 'none';
        }
    }

    function removeOldPointsDetails(node) {
        // Remove any existing vote counts so that we can calculate them fresh.
        // This is needed because navigating to the "context" or "permalink" of a comment in the old design doesn't necessarily add new nodes but rather can modify existing ones.
        let oldPoints = node.querySelectorAll('.points-detail');
        for (const a of oldPoints) {
            a.remove();
        }
    }

    function getPointsDetailsConfig() {
        if (isOldDesign) {
            return {
                getSubElements: (node) => node.querySelectorAll('.caption'),
                getCommentDataFunction: getCommentDataOldDesign,
                newElementType: 'span',
                newElementClass: 'comment-meta-spacer points-detail',
                getInsertionPoint: (node) => node.firstChild.firstChild.querySelector('time').previousElementSibling,
            };
        } else if (isGallery) {
            return {
                getSubElements: (node) => node.querySelectorAll('.GalleryComment'),
                getCommentDataFunction: getCommentDataNewDesignGallery,
                newElementType: 'div',
                newElementClass: 'points undefined points-detail',
                getInsertionPoint: (node) => node.querySelector('.vote-btn.down'),
            };
        } else {
            return {
                getSubElements: (node) => node.classList.contains('ProfileComments-comment') ? [node] : node.querySelectorAll('.ProfileComments-comment'),
                getCommentDataFunction: getCommentDataNewDesignProfile,
                newElementType: 'span',
                newElementClass: 'Comment-actionbar-item Comment-actionbar-item--disabled Comment-upvotes',
                getInsertionPoint: (node) => node.querySelector('.Comment-actionbar').firstElementChild,
            };
        }
    }

    function addPointsDetails(node) {
        let config = getPointsDetailsConfig();
        let commentElements = config.getSubElements(node);
        for (const element of commentElements) {
            // Pull the comment data from the React objects.
            let commentData = config.getCommentDataFunction(element);
            if (commentData === undefined || commentData === null) continue; // no data found

            // Build then add an element with the vote counts.
            let newElement = document.createElement(config.newElementType);
            newElement.textContent = '(+' + commentData.ups + ', -' + commentData.downs + ')';
            newElement.setAttribute('class', config.newElementClass);

            let previousSibling = config.getInsertionPoint(element);
            if (previousSibling === null) continue;
            previousSibling.after(newElement);
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

    function getCommentDataNewDesignGallery(node) {
        // The rest of the name past the $ is not always identical.
        for (const propertyKey in node) {
            if (propertyKey.startsWith('__reactFiber$')) {
                let data = node[propertyKey].return.memoizedProps.comment;
                return { ups: data.get('upvote_count'), downs: data.get('downvote_count') };
            }
        }

        return null;
    }

    function getCommentDataNewDesignProfile(node) {
        // The rest of the name past the $ is not always identical.
        for (const propertyKey in node) {
            if (propertyKey.startsWith('__reactProps$')) {
                let data = node[propertyKey].children[1].props.children.props;
                if (data === undefined)
                    return { ups: 0, downs: 0 };
                return { ups: data.upvotes, downs: data.downvotes };
            }
        }

        return null;
    }
})();