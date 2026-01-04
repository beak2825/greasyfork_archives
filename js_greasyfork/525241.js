// ==UserScript==
// @name        AS mmd cleanup
// @version     1.3
// @namespace   mailto:percfag@gmail.com
// @author      perckle
// @description This script is to clean up the spam in the Anime sharing MMD sharethread.
// @license     MIT
// @match       https://www.anime-sharing.com/threads/mmd-discussion-and-sharing.1532636/*
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/525241/AS%20mmd%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/525241/AS%20mmd%20cleanup.meta.js
// ==/UserScript==

// Configuration flags
const CONFIG = {
    enableWordFilter: true,
    enableLinkCheck: true,
    enableHideBlockCheck: true,
    removeFormatting: false
};

// Function to check if text contains target words (case insensitive)
function containsTargetWords(text) {
    const normalizedText = text.toLowerCase();
    return normalizedText.includes('anyone') ||
           normalizedText.includes('any one') ||
           normalizedText.includes('anybody') ||
           normalizedText.includes('hero') ||
           normalizedText.includes('plz') ||
           normalizedText.includes('pls') ||
           normalizedText.includes('thx') ||
           normalizedText.includes('in advance');
}

// Function to check if element contains a direct child link
function containsLink(bbWrapper) {
    if (!bbWrapper || typeof bbWrapper.children === 'undefined') {
        console.log('Invalid element passed to containsLink');
        return false;
    }

    // Convert children to array and check only direct children
    const children = Array.from(bbWrapper.children);
    return children.some(child => {
        // Check if the child is an 'a' tag with href
        if (child.tagName === 'A' && child.hasAttribute('href')) {
            return true;
        }
        // Check if the child directly contains an 'a' tag (one level deep)
        return child.querySelector(':scope > a[href]') !== null;
    });
}

// Function to check if element contains hideBlock class
function containsHideBlock(bbWrapper) {
    if (!bbWrapper || typeof bbWrapper.querySelector !== 'function') {
        console.log('Invalid element passed to containsHideBlock');
        return false;
    }
    return bbWrapper.querySelector(':scope > .bbCodeBlock--hide, :scope > .hideBlock') !== null;
}

// Function to get text content excluding content within blockquotes
function getTextExcludingQuotes(element) {
    const clone = element.cloneNode(true);
    const blockquotes = clone.querySelectorAll('blockquote');
    blockquotes.forEach(quote => quote.remove());
    return clone.textContent.trim();
}

// Function to remove b and span tags while preserving their content
function removeFormattingTags(element) {
    if (!CONFIG.removeFormatting) return;

    const formattingTags = element.querySelectorAll('b, span');
    formattingTags.forEach(tag => {
        const textContent = document.createTextNode(tag.textContent);
        tag.parentNode.replaceChild(textContent, tag);
    });
}

// Main function to filter forum posts
function filterForumPosts() {
    const container = document.querySelector('.block--messages');
    if (!container) {
        console.log('Forum container not found, retrying...');
        return false;
    }

    const posts = container.querySelectorAll('.message-inner');
    if (posts.length === 0) {
        console.log('No posts found, retrying...');
        return false;
    }

    posts.forEach(post => {
        const bbWrapper = post.querySelector('.bbWrapper');
        if (!bbWrapper) return;

        let shouldRemove = true; // Start with true, set to false if any condition is met




        // Link check
        if (CONFIG.enableLinkCheck && shouldRemove) {
            if (containsLink(bbWrapper)) {
                shouldRemove = false;
            }
        }

        // HideBlock check
        if (CONFIG.enableHideBlockCheck && shouldRemove) {
            if (containsHideBlock(bbWrapper)) {
                shouldRemove = false;
            }
        }
              if (CONFIG.enableWordFilter) {
            const textContent = getTextExcludingQuotes(bbWrapper);
            if (containsTargetWords(textContent)) {
                shouldRemove = true;
            }
        }

        if (shouldRemove) {
            post.remove();
        } else if (CONFIG.removeFormatting) {
            removeFormattingTags(bbWrapper);
        }
    });

    return true;
}

// Function to wait for page to be fully rendered
function waitForPageLoad() {
    const observer = new MutationObserver((mutations, obs) => {
        const success = filterForumPosts();
        if (success) {
            obs.disconnect();
            console.log('Forum filtering complete');
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    document.addEventListener('DOMContentLoaded', () => {
        if (filterForumPosts()) {
            observer.disconnect();
            console.log('Forum filtering complete on initial load');
        }
    });

    setTimeout(() => {
        observer.disconnect();
        console.log('Stopped watching for page changes after timeout');
    }, 30000);
}

// Initialize the script
waitForPageLoad();