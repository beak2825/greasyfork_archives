// ==UserScript==
// @name         auto click read more stuff
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  clicks read more buttons automatically cuz im lazy lol
// @author       me
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540127/auto%20click%20read%20more%20stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/540127/auto%20click%20read%20more%20stuff.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // stuff to look for
    var keywords = [
        'read more', 'show more', 'see more', 'view more', 'load more',
        'more', 'expand', 'show all', 'see all', 'continue reading',
        'read full', 'full story', 'show thread',
        'show replies', 'view replies', 'see replies'
    ];
    
    var clickDelay = 500; // wait between clicks
    var maxClicks = 50; // dont go crazy
    
    // where to look for buttons
    var containers = [
        '[data-testid*="tweet"]',
        '.post', '.comment', '.entry', '.content',
        '[role="article"]', '.article',
        '.ytd-comment-thread-renderer',
        '.Comment', '.Thing',
        '.feed-shared-update-v2',
    ];
    
    // dont click these
    var dontClick = [
        '.advertisement', '.ad', '.sponsored',
        'header', 'nav', 'footer', '.menu'
    ];

    var clickCount = 0;
    var processing = false;
    var clicked = new WeakSet();
    var lastTime = 0;

    function normalize(text) {
        return text.toLowerCase().trim().replace(/\s+/g, ' ');
    }

    function hasKeyword(text) {
        var norm = normalize(text);
        for(var i = 0; i < keywords.length; i++) {
            if(norm.indexOf(keywords[i]) !== -1) return true;
        }
        return false;
    }

    function canClick(el) {
        if (!el || el.offsetParent === null) return false;
        var rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        var style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        if (style.pointerEvents === 'none') return false;
        return true;
    }

    function shouldSkip(el) {
        for(var i = 0; i < dontClick.length; i++) {
            try {
                if(el.closest(dontClick[i])) return true;
            } catch(e) {}
        }
        return false;
    }

    // site specific stuff
    function getYouTubeButtons() {
        if(!window.location.hostname.includes('youtube.com')) return [];
        return document.querySelectorAll('#more, .more-button, .expand-button, [aria-label*="more"], [aria-label*="Show"]');
    }

    function getTwitterButtons() {
        var isTwitter = window.location.hostname.includes('twitter.com') || window.location.hostname.includes('x.com');
        if(!isTwitter) return [];
        return document.querySelectorAll('[data-testid="tweet-text-show-more-link"], span[role="button"]:not([data-clicked])');
    }

    function getRedditButtons() {
        if(!window.location.hostname.includes('reddit.com')) return [];
        return document.querySelectorAll('.expando-button, .morecomments a, button[aria-expanded="false"]');
    }

    function clickStuff() {
        if (processing || clickCount >= maxClicks) return;
        
        processing = true;
        var totalClicked = 0;

        try {
            // try site specific first
            var ytButtons = getYouTubeButtons();
            if(ytButtons.length > 0) {
                console.log('found youtube buttons');
                totalClicked += clickButtons(ytButtons);
            }
            
            var twitterButtons = getTwitterButtons();
            if(twitterButtons.length > 0) {
                console.log('found twitter buttons');
                totalClicked += clickButtons(twitterButtons);
            }
            
            var redditButtons = getRedditButtons();
            if(redditButtons.length > 0) {
                console.log('found reddit buttons');
                totalClicked += clickButtons(redditButtons);
            }

            // fallback - look everywhere
            if (totalClicked === 0) {
                var allButtons = findButtons();
                totalClicked += clickButtons(allButtons);
            }

            if (totalClicked > 0) {
                console.log('clicked ' + totalClicked + ' buttons');
            }

        } catch (error) {
            console.log('error:', error);
        }
        
        processing = false;
    }

    function findButtons() {
        var found = [];
        var selectors = ['button', 'a[href]', '[role="button"]', 'span[onclick]', 'div[onclick]', '.btn', '.button', '.link'];

        for(var i = 0; i < selectors.length; i++) {
            try {
                var elements = document.querySelectorAll(selectors[i]);
                for(var j = 0; j < elements.length; j++) {
                    if (shouldProcess(elements[j])) {
                        found.push(elements[j]);
                    }
                }
            } catch (e) {
                // whatever
            }
        }

        return found;
    }

    function shouldProcess(el) {
        if (clicked.has(el)) return false;
        if (!canClick(el)) return false;
        if (shouldSkip(el)) return false;

        var text = el.textContent || el.getAttribute('aria-label') || '';
        return hasKeyword(text);
    }

    function clickButtons(buttons) {
        var clickedNow = 0;
        
        for(var i = 0; i < buttons.length; i++) {
            if (clickCount >= maxClicks) break;
            if (clicked.has(buttons[i])) continue;
            
            (function(btn, delay) {
                setTimeout(function() {
                    if (canClick(btn) && !clicked.has(btn)) {
                        try {
                            clicked.add(btn);
                            btn.click();
                            clickCount++;
                            btn.setAttribute('data-clicked', 'true');
                            console.log('clicked: ' + (btn.textContent || 'button').trim().substring(0, 30));
                        } catch (error) {
                            console.log('click failed:', error);
                        }
                    }
                }, delay);
            })(buttons[i], i * clickDelay);
            
            clickedNow++;
        }

        return clickedNow;
    }

    // watch for new stuff
    var observer = new MutationObserver(function(mutations) {
        var now = Date.now();
        if (now - lastTime < 250) return;
        lastTime = now;
        
        var hasNew = false;
        for(var i = 0; i < mutations.length; i++) {
            if (mutations[i].type === 'childList' && mutations[i].addedNodes.length > 0) {
                for(var j = 0; j < mutations[i].addedNodes.length; j++) {
                    if (mutations[i].addedNodes[j].nodeType === 1) {
                        hasNew = true;
                        break;
                    }
                }
            }
            if(hasNew) break;
        }

        if (hasNew) {
            setTimeout(clickStuff, 100);
        }
    });

    // scroll stuff
    var lastScrollTime = 0;
    function onScroll() {
        var now = Date.now();
        if (now - lastScrollTime < 500) return;
        lastScrollTime = now;
        
        var scrollPos = window.scrollY + window.innerHeight;
        var docHeight = document.documentElement.scrollHeight;
        
        if (scrollPos > docHeight - 1000) {
            setTimeout(clickStuff, 200);
        }
    }

    function reset() {
        clickCount = 0;
        clicked = new WeakSet();
        console.log('reset for new page');
    }

    // ctrl+shift+e to trigger
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            console.log('manual trigger');
            clickStuff();
        }
    });

    function start() {
        console.log('starting auto clicker...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(clickStuff, 1000);
            });
        } else {
            setTimeout(clickStuff, 1000);
        }

        if(document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        window.addEventListener('scroll', onScroll);

        // check for spa navigation
        var currentUrl = window.location.href;
        setInterval(function() {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                reset();
                setTimeout(clickStuff, 1000);
            }
        }, 1000);

        // backup scan
        setInterval(clickStuff, 5000);
    }

    if (document.body) {
        start();
    } else {
        var bodyWatcher = new MutationObserver(function() {
            if (document.body) {
                bodyWatcher.disconnect();
                start();
            }
        });
        bodyWatcher.observe(document.documentElement, { childList: true });
    }

})();
