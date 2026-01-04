// ==UserScript==
// @name         [No longer maintained] Turbo Reddit Political Content Filter (New + Old Reddit)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide posts and comments related to politics on Reddit, including dynamic content. Works on both New and Old Reddit.
// @author       Blumsie (Updated)
// @match        *://*.reddit.com/*
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/531431/%5BNo%20longer%20maintained%5D%20Turbo%20Reddit%20Political%20Content%20Filter%20%28New%20%2B%20Old%20Reddit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531431/%5BNo%20longer%20maintained%5D%20Turbo%20Reddit%20Political%20Content%20Filter%20%28New%20%2B%20Old%20Reddit%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEYWORDS_URL = 'https://raw.githubusercontent.com/greenwenvy/homework/refs/heads/main/PCF';

    let hiddenPostsCount = 0;
    let hiddenCommentsCount = 0;
    
    // Detect whether we're on Old Reddit
    const isOldReddit = window.location.hostname === 'old.reddit.com' || 
                        document.querySelector('html.redesign-beta') === null && 
                        document.querySelector('.oldreddit') !== null;
    
    console.log(`Reddit Political Content Filter running on ${isOldReddit ? 'Old' : 'New'} Reddit`);

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

        if (isOldReddit) {
            // Old Reddit post filtering
            hideOldRedditPosts(keywordRegex, keywords);
            // Old Reddit comment filtering
            hideOldRedditComments(keywordRegex, keywords);
        } else {
            // New Reddit post filtering
            hideNewRedditPosts(keywordRegex, keywords);
            // New Reddit comment filtering
            hideNewRedditComments(keywordRegex, keywords);
        }

        console.log(`${hiddenPostsCount} posts and ${hiddenCommentsCount} comments were hidden because trigger keywords were found.`);
    }
    
    function hideOldRedditPosts(keywordRegex, keywords) {
        // Target the post containers in Old Reddit
        document.querySelectorAll('#siteTable .thing.link').forEach(post => {
            const titleElement = post.querySelector('a.title');
            const textContent = titleElement ? titleElement.innerText + ' ' + post.innerText : post.innerText;
            
            if (keywordRegex.test(textContent)) {
                post.style.display = 'none';
                hiddenPostsCount++;
                
                let triggeredKeywords = new Set();
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
    }
    
    function hideOldRedditComments(keywordRegex, keywords) {
        // Target the comment containers in Old Reddit
        document.querySelectorAll('.comment').forEach(comment => {
            const authorElement = comment.querySelector('.author');
            const textContent = comment.querySelector('.usertext-body') ? 
                                comment.querySelector('.usertext-body').innerText : '';
            
            if (keywordRegex.test(textContent)) {
                comment.style.display = 'none';
                hiddenCommentsCount++;
                
                let triggeredKeywords = new Set();
                keywords.forEach(keyword => {
                    if (new RegExp('\\b' + keyword + '\\b', 'i').test(textContent)) {
                        triggeredKeywords.add(keyword);
                    }
                });
                
                if (triggeredKeywords.size > 0) {
                    console.log('Keywords that triggered hiding the comment:', [...triggeredKeywords].join(', '));
                }
            }
        });
    }
    
    function hideNewRedditPosts(keywordRegex, keywords) {
        document.querySelectorAll('article').forEach(post => {
            const titleElement = post.querySelector('a[slot="title"], a[slot="full-post-link"], faceplate-screen-reader-content');
            const textContent = titleElement ? titleElement.innerText + ' ' + post.innerText : post.innerText;
            
            if (keywordRegex.test(textContent)) {
                console.debug('Hiding post:', textContent.slice(0, 100));
                post.style.display = 'none';
                hiddenPostsCount++;

                let triggeredKeywords = new Set();
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
    }
    
    function hideNewRedditComments(keywordRegex, keywords) {
        document.querySelectorAll('shreddit-comment').forEach(comment => {
            const authorElement = comment.getAttribute('author');
            const textContent = Array.from(comment.querySelectorAll('p')).map(p => p.innerText).join(' ');
            
            const parentElement = comment.closest('div[data-testid="comment"]') || comment;
            if (keywordRegex.test(textContent)) {
                console.debug('Hiding comment by:', authorElement);
                parentElement.style.display = 'none';
                hiddenCommentsCount++;
                
                let triggeredKeywords = new Set();
                keywords.forEach(keyword => {
                    if (new RegExp('\\b' + keyword + '\\b', 'i').test(textContent)) {
                        triggeredKeywords.add(keyword);
                    }
                });
                
                if (triggeredKeywords.size > 0) {
                    console.log('Keywords that triggered hiding the comment:', [...triggeredKeywords].join(', '));
                }
            }
            
            // Hide author name and reply button in new Reddit
            const authorName = comment.querySelector('[aria-label^="Comment from"]');
            if (authorName) {
                authorName.style.display = 'none';
            }
            
            const replyButton = comment.querySelector('[data-testid="comment-reply-button"]');
            if (replyButton) {
                replyButton.style.display = 'none';
            }
        });
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

    // Execute when DOM is ready rather than waiting for full load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFilter);
    } else {
        initializeFilter();
    }
})();