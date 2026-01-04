// ==UserScript==
// @name          Facebook Comment Sorter
// @namespace     CustomScripts
// @description   Forces Facebook comments to show "All Comments" or "Newest" instead of "Most Relevant" + Auto-expand replies
// @author        areen-c
// @homepage      https://github.com/areen-c
// @match         *://*.facebook.com/*
// @version       2.2
// @license       MIT
// @icon          https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @run-at        document-start
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/533111/Facebook%20Comment%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/533111/Facebook%20Comment%20Sorter.meta.js
// ==/UserScript==

/*
CHANGELOG:

Version 2.2 (2025-09-16)
- FIXED: The script no longer clicks on comment previews in the main feed.
- USABILITY: Added a `setInterval` poller to run the `expandCommentReplies` function periodically.
- This ensures that comments visible on initial load are expanded proactively, without needing to scroll first.
- It also acts as a safety net to catch any reply buttons missed by the MutationObserver, providing a much more seamless and responsive experience.

Version 2.1 (2025-01-06)
- NEW: Added automatic comment reply expansion feature
- NEW: Configuration option to enable/disable reply expansion
- NEW: Smart scroll position preservation during reply expansion
- NEW: Viewport-aware processing (only expands visible replies)
- IMPROVED: Added debounced scroll handling for better performance
- IMPROVED: Better detection of reply buttons across multiple languages

Version 2.0 (2025-01-06)
- FIXED: Major bug where "All Comments" would incorrectly select "Newest" due to partial text matching
- ADDED: Smart text matching that prioritizes exact matches at the beginning of menu items
- ADDED: Comprehensive debug logging system with DEBUG flag
- ADDED: Better handling of Facebook's combined menu text (title + description)
- IMPROVED: Menu item detection logic with multiple fallback strategies
- IMPROVED: More robust parameter mappings for Facebook's GraphQL API
- IMPROVED: Added support for more API parameters (view_option, sort_by, isInitialFetch)

Version 1.2 (2024-12-XX)
- Added support for multiple languages
- Improved URL interception for XMLHttpRequest and fetch
- Added POST body modification for GraphQL requests

Version 1.1 (2024-XX-XX)
- Added parameter mappings for comment sorting
- Fixed menu item selection logic

Version 1.0 (2024-XX-XX)
- Initial release
- Basic comment sorting functionality
*/

(function() {
    'use strict';

    if (window.top.hasFBCSInitialized) {
        return;
    }
    window.top.hasFBCSInitialized = true;

    // =============== CONFIGURATION ===============
    const CONFIG = {
        sortPreference: "all",
        debug: true,
        expandReplies: true,
        replyExpandDelay: 1000,
        viewportOnly: true
    };

    let processedButtons = new WeakSet();
    let processedReplyButtons = new WeakSet();
    const processedUrls = new Set();

    const log = (msg, data) => {
        if (CONFIG.debug && data !== undefined) {
             console.log(`[FB Comment Sorter] ${msg}`, data);
        } else if (CONFIG.debug) {
             console.log(`[FB Comment Sorter] ${msg}`);
        }
    };

    const replyKeywords = [
        'reply', 'replies', 'balasan', '回覆', '回复', 'réponse',
        'respuesta', 'antwort', 'rispost', 'ตอบ', '返信'
    ];

    function isPermalinkPage() {
        const href = window.location.href;
        const permalinkPatterns = [
            '/posts/', '/videos/', '/photos/', '/photo.php',
            '/video.php', '/permalink/', 'story_fbid=', '&id='
        ];
        return permalinkPatterns.some(pattern => href.includes(pattern));
    }

    function expandCommentReplies() {
        if (!CONFIG.expandReplies) return;

        const onPermalink = isPermalinkPage();

        const replyButtons = Array.from(document.querySelectorAll('div[role="button"], span[role="button"]')).filter(button => {
            if (!button.textContent || processedReplyButtons.has(button)) return false;

            const text = button.textContent;
            const textLower = text.toLowerCase();

            const isHideButton = textLower.includes('hide') || textLower.includes('sembunyikan');
            const isMoreCommentsButton = (textLower.includes('more comments') && !textLower.includes('replies')) || (textLower.includes('komentar lainnya') && !textLower.includes('balasan'));
            if (isHideButton || isMoreCommentsButton) return false;

            const hasNumber = /\d/.test(text);
            const hasKeyword = replyKeywords.some(keyword => textLower.includes(keyword));
            if (!hasNumber || !hasKeyword) return false;

            const isInsideDialog = button.closest('div[role="dialog"]');
            if (!isInsideDialog && !onPermalink) {
                return false;
            }

            return true;
        });

        if (replyButtons.length > 0 && CONFIG.debug) {
            const unprocessedCount = replyButtons.filter(b => !processedReplyButtons.has(b)).length;
            if (unprocessedCount > 0) {
                 log(`Found ${unprocessedCount} new reply buttons to expand.`);
            }
        }

        for (const button of replyButtons) {
            if (processedReplyButtons.has(button)) continue;
            if (CONFIG.viewportOnly && !isInViewport(button)) continue;

            try {
                processedReplyButtons.add(button);
                log('Expanding replies:', button.textContent?.trim());
                button.click();
            } catch (error) {
                log('Error expanding replies:', error);
            }
        }
    }

    function initialize() {
        log('Initializing Facebook Comment Sorter v2.2');
        log('Configuration:', CONFIG);
        setupRequestIntercepts();

        setTimeout(() => {
            findAndClickSortButtons();
            if (CONFIG.expandReplies) expandCommentReplies();
        }, 2000);

        setInterval(findAndClickSortButtons, 3000);

        if (CONFIG.expandReplies) {
            setupReplyExpansionObserver();
            setInterval(expandCommentReplies, 3000);
        }

        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                log('URL changed, resetting internal state...');
                processedButtons = new WeakSet();
                processedReplyButtons = new WeakSet();
                processedUrls.clear();
                setTimeout(() => {
                    findAndClickSortButtons();
                    if (CONFIG.expandReplies) expandCommentReplies();
                }, 2000);
            }
        }).observe(document.body, { subtree: true, childList: true });
    }

    function isInViewport(element){const rect=element.getBoundingClientRect();return(rect.top>=0&&rect.left>=0&&rect.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&rect.right<=(window.innerWidth||document.documentElement.clientWidth));}
    let scrollTimeout=null;function handleScroll(){if(!CONFIG.expandReplies)return;if(scrollTimeout)clearTimeout(scrollTimeout);scrollTimeout=setTimeout(()=>{expandCommentReplies();},500);}
    function setupReplyExpansionObserver(){if(!CONFIG.expandReplies)return;if(CONFIG.viewportOnly){window.addEventListener('scroll',handleScroll,{passive:true});}const observer=new MutationObserver(()=>{if(scrollTimeout)clearTimeout(scrollTimeout);scrollTimeout=setTimeout(expandCommentReplies,CONFIG.replyExpandDelay);});observer.observe(document.body,{childList:true,subtree:true});}
    function findAndClickSortButtons(){const sortButtonTexts={default:['most relevant','paling relevan','relevan','most popular','komentar teratas','oldest','más relevantes','relevante','más populares','plus pertinents','pertinent','plus populaires','relevanteste','beliebteste','mais relevantes','relevante','mais populares','più rilevanti','rilevante','più popolari','meest relevant','relevant','populairste','наиболее релевантные','популярные','最相关','最热门','最も関連性の高い','人気','الأكثر صلة','الأكثر شعبية','सबसे उपयुक्त',' सबसे लोकप्रिय']};const potentialButtons=document.querySelectorAll('div[role="button"], span[role="button"]');for(const button of potentialButtons){if(!button||processedButtons.has(button))continue;const text=button.textContent.toLowerCase().trim();if(sortButtonTexts.default.some(sortText=>text.includes(sortText))){try{processedButtons.add(button);log('Found sort button with text:',text);button.click();setTimeout(()=>{const menuItems=document.querySelectorAll('[role="menuitem"], [role="menuitemradio"], [role="radio"]');const targetTexts=CONFIG.sortPreference==="newest"?['newest','terbaru']:['all comments','semua komentar','all'];if(menuItems.length===0){processedButtons.delete(button);return;}let targetItem=Array.from(menuItems).find(item=>item.textContent&&targetTexts.some(target=>item.textContent.toLowerCase().trim().startsWith(target)));if(targetItem){log('Clicking menu item:',targetItem.textContent?.trim());targetItem.click();}else{processedButtons.delete(button);}},500);}catch(error){processedButtons.delete(button);}}}}
    function setupRequestIntercepts(){const params=CONFIG.sortPreference==="all"?{"ranking_setting":"ALL","view_option":"ALL","sort_by":"all"}:{"ranking_setting":"CHRONOLOGICAL","view_option":"CHRONOLOGICAL","sort_by":"time"};if(window.fetch){const originalFetch=window.fetch;window.fetch=function(resource,init){if(init&&init.method==='POST'&&typeof init.body==='string'&&init.body.includes('UFI2CommentsProvider')){try{let bodyData=new URLSearchParams(init.body);let variables=JSON.parse(bodyData.get('variables'));Object.assign(variables,params);bodyData.set('variables',JSON.stringify(variables));init.body=bodyData.toString()}catch(e){}}return originalFetch.apply(this,arguments)}};}

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();