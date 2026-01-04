// ==UserScript==
// @name         Reddit Political Content Filter
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Hide posts and comments related to politics on Reddit, including dynamic content.
// @author       Blumsie
// @match        *://www.reddit.com/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/510580/Reddit%20Political%20Content%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/510580/Reddit%20Political%20Content%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEYWORDS_URL = 'https://raw.githubusercontent.com/Blumsie/filter/refs/heads/main/keywords';

    let hiddenPostsCount = 0;
    let hiddenCommentsCount = 0;
    async function fetchKeywords() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: KEYWORDS_URL,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const keywords = response.responseText
                                .match(/"(.*?)"/g)
                                .map(word => word.replace(/"/g, '').trim());
                            resolve(keywords);
                        } catch (error) {
                            reject(`Error parsing keywords: ${error}`);
                        }
                    } else {
                        reject(`Failed to fetch keywords: ${response.statusText}`);
                    }
                },
                onerror: function(error) {
                    reject(`Request error: ${error}`);
                }
            });
        });
    }


    function hideContent(keywords) {
        const keywordRegex = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'i');

        const hidePosts = () => {
            document.querySelectorAll('article').forEach(post => {
                const titleElement = post.querySelector('a[slot="title"], a[slot="full-post-link"], faceplate-screen-reader-content');
                const textContent = titleElement ? titleElement.innerText + ' ' + post.innerText : post.innerText;
                let triggeredKeywords = new Set();
                if (keywordRegex.test(textContent)) {
                    console.debug('Hiding post:', textContent.slice(0, 100));
                    post.style.display = 'none';
                    hiddenPostsCount++;

                    keywords.forEach(keyword => {
                        if (new RegExp('\\b' + keyword + '\\b', 'i').test(textContent)) {
                            triggeredKeywords.add(keyword);
                        }
                    });

                    if (triggeredKeywords.size > 0) {
                        console.log('Keywords that triggered hiding the post:', [...triggeredKeywords].join(', '));
                    }
                }
            });
        };

        const hideComments = () => {
            document.querySelectorAll('shreddit-comment').forEach(comment => {
                const authorElement = comment.getAttribute('author');
                const textContent = Array.from(comment.querySelectorAll('p')).map(p => p.innerText).join(' ');
                let triggeredKeywords = new Set();

                const parentElement = comment.closest('div[data-testid="comment"]') || comment;
                if (keywordRegex.test(textContent)) {
                    console.debug('Hiding comment by:', authorElement);
                    parentElement.style.display = 'none';
                    hiddenCommentsCount++;
                    keywords.forEach(keyword => {
                        if (new RegExp('\\b' + keyword + '\\b', 'i').test(textContent)) {
                            triggeredKeywords.add(keyword);
                        }
                    });
                    if (triggeredKeywords.size > 0) {
                        console.log('Keywords that triggered hiding the comment:', [...triggeredKeywords].join(', '));
                    }
                }
                const authorName = comment.querySelector('[aria-label^="Comment from"]');
                if (authorName) {
                    authorName.style.display = 'none';
                }
                const replyButton = comment.querySelector('[data-testid="comment-reply-button"]');
                if (replyButton) {
                    replyButton.style.display = 'none';
                }
            });
        };
        hidePosts();
        hideComments();
        console.log(`${hiddenPostsCount} posts and ${hiddenCommentsCount} comments were hidden because trigger keywords were found.`);
    }
    async function initializeFilter() {
        try {
            const keywords = await fetchKeywords();
            console.log('Fetched Keywords:', keywords);
            hideContent(keywords);
            const observer = new MutationObserver(() => {
                console.debug('DOM changed, reapplying filter');
                hideContent(keywords);
            });
            observer.observe(document.body, { childList: true, subtree: true });
        } catch (error) {
            console.error('Error initializing filter:', error);
        }
    }
    window.addEventListener('load', initializeFilter);
})();
