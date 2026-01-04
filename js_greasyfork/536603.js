// ==UserScript==
// @name         Bangumi NSFW Image Blurrer
// @version      0.1.1
// @description  Blurs images in topics or replies marked as NSFW or by specified users on Bangumi sites.
// @match        https://bgm.tv/group/*
// @match        https://bangumi.tv/group/*
// @match        https://chii.in/group/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license MIT
// @namespace    bgmtv
// @downloadURL https://update.greasyfork.org/scripts/536603/Bangumi%20NSFW%20Image%20Blurrer.user.js
// @updateURL https://update.greasyfork.org/scripts/536603/Bangumi%20NSFW%20Image%20Blurrer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const DEFAULT_BLUR_AMOUNT = '10px';
    const DEFAULT_NSFW_KEYWORDS = ['nsfw', '色图'];
    let blurAmount = DEFAULT_BLUR_AMOUNT;
    let nsfwKeywords = [];

    function loadSettings() {
        blurAmount = GM_getValue('blurAmount_bgm', DEFAULT_BLUR_AMOUNT);
        nsfwKeywords = GM_getValue('nsfwKeywords_bgm', DEFAULT_NSFW_KEYWORDS.join(',')).split(',')
            .map(keyword => keyword.trim())
            .filter(keyword => keyword);
    }

    // Add blur amount setting menu
    GM_registerMenuCommand('Set Blur Amount', () => {
        const currentAmount = GM_getValue('blurAmount_bgm', DEFAULT_BLUR_AMOUNT);
        const newAmount = prompt(
            'Enter blur amount (e.g. 5px, 10px, 15px):\nDefault: 10px',
            currentAmount
        );
        if (newAmount !== null) {
            if (/^\d+px$/.test(newAmount)) {
                GM_setValue('blurAmount_bgm', newAmount);
                blurAmount = newAmount;
                updateStyles();
                applyBlurringLogic();
            } else {
                console.warn('[BGM NSFW Protection] Invalid blur amount format. Please use format like "10px"');
                alert('Invalid format. Please use format like "10px"');
            }
        }
    });

    // Update addGlobalStyle function
    function updateStyles() {
        const styleElement = document.getElementById('nsfw-blur-style');
        if (styleElement) styleElement.remove();
        
        addGlobalStyle(`
        .nsfw-blur-userscript {
            filter: blur(${blurAmount}) !important;
            transition: filter 0.25s ease-out !important;
        }
        .nsfw-blur-userscript:hover {
            filter: blur(0px) !important;
        }
    `, 'nsfw-blur-style');
    }

    // Modified addGlobalStyle to support ID
    function addGlobalStyle(css, id = '') {
        const head = document.getElementsByTagName('head')[0];
        if (!head) {
            console.error('[BGM NSFW Protection] Cannot find head element');
            return;
        }
        const style = document.createElement('style');
        if (id) style.id = id;
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function loadNsfwKeywords() {
        nsfwKeywords = GM_getValue('nsfwKeywords_bgm', DEFAULT_NSFW_KEYWORDS.join(',')).split(',')
            .map(keyword => keyword.trim())
            .filter(keyword => keyword);
    }

    GM_registerMenuCommand('Set NSFW Keywords', () => {
        const currentKeywords = GM_getValue('nsfwKeywords_bgm', DEFAULT_NSFW_KEYWORDS.join(','));
        const newKeywordsInput = prompt(
            'Enter comma-separated NSFW keywords (Latin letters are case-insensitive):\nExample: nsfw,色图,R18',
            currentKeywords
        );
        if (newKeywordsInput !== null) {
            GM_setValue('nsfwKeywords_bgm', newKeywordsInput);
            loadNsfwKeywords();
            applyBlurringLogic();
        }
    });

    function checkNsfwKeywords(text) {
        return nsfwKeywords.some(keyword => {
            // For Latin letters, use case-insensitive comparison
            if (/^[a-zA-Z]+$/.test(keyword)) {
                return text.toLowerCase().includes(keyword.toLowerCase());
            }
            // For other characters (like Chinese), use case-sensitive comparison
            return text.includes(keyword);
        });
    }

    // --- Styles ---
    function addGlobalStyle(css) {
        const head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(`
        .nsfw-blur-userscript {
            filter: blur(${blurAmount}) !important;
            transition: filter 0.25s ease-out !important;
        }
        .nsfw-blur-userscript:hover {
            filter: blur(0px) !important;
        }
    `);

    // --- NSFW User ID Management ---
    let nsfwUserIds = [];

    function loadNsfwUserIds() {
        nsfwUserIds = GM_getValue('nsfwUserIds_bgm', '').split(',')
                        .map(id => id.trim().toLowerCase())
                        .filter(id => id);
    }

    GM_registerMenuCommand('Set NSFW User IDs', () => {
        const currentIds = GM_getValue('nsfwUserIds_bgm', '');
        const newIdsInput = prompt('Enter comma-separated NSFW user IDs (usernames as seen in URL, e.g., `217781` （金刚可怜）):', currentIds);
        if (newIdsInput !== null) {
            GM_setValue('nsfwUserIds_bgm', newIdsInput);
            loadNsfwUserIds();
            applyBlurringLogic(); // Re-apply logic after changing settings
        }
    });

    // --- Blurring Logic ---
    function blurImagesInElement(element) {
        if (!element) return;
        const images = element.querySelectorAll('img'); // Blurs all img tags, including emojis.
        // If you want to be more specific, e.g., only 'img.code':
        // const images = element.querySelectorAll('img.code, .topic_content > img, .message > img');
        images.forEach(img => {
            // Avoid re-blurring images in quotes if the parent is already blurred
            if (img.closest('.nsfw-blur-userscript') && !img.closest('.quote')) {
                 // If image is inside something already blurred, and not in a quote that might be safe
                 if(!img.parentElement.classList.contains('nsfw-blur-userscript')) {
                    //img.classList.add('nsfw-blur-userscript');
                 }
            } else {
                 img.classList.add('nsfw-blur-userscript');
            }
        });
    }


    function applyBlurringLogic() {
        try {
            loadNsfwUserIds();
            loadSettings();

            const topicTitleElement = document.querySelector('#pageHeader h1');
            const mainPostContainer = document.querySelector('.postTopic[data-item-user]');

            if (mainPostContainer) {
                const mainPostContentElement = mainPostContainer.querySelector('.topic_content');
                const topicTitleText = topicTitleElement ? topicTitleElement.textContent || '' : '';
                const mainPostText = mainPostContentElement ? mainPostContentElement.textContent || '' : '';
                const mainPosterIdAttr = mainPostContainer.getAttribute('data-item-user');
                const mainPosterId = mainPosterIdAttr ? mainPosterIdAttr.toLowerCase() : '';

                let topicIsMarkedNSFW = checkNsfwKeywords(topicTitleText) || checkNsfwKeywords(mainPostText);
                let mainPosterIsNSFW = mainPosterId && nsfwUserIds.includes(mainPosterId);

                if (topicIsMarkedNSFW || mainPosterIsNSFW) {
                    if (mainPostContentElement) {
                        blurImagesInElement(mainPostContentElement);
                    }
                }
            }

            // Modified replies processing
            const replies = document.querySelectorAll('.row_reply');
            replies.forEach(reply => {
                try {
                    const replyMessageElement = reply.querySelector('.reply_content .message');
                    const replyText = replyMessageElement ? replyMessageElement.textContent || '' : '';

                    // New replierID extraction logic
                    let replierId = reply.getAttribute('data-item-user');
                    if (!replierId) {
                        console.warn('[BGM NSFW Protection] Cannot find replier ID for reply:', reply);
                    }

                    let replyIsMarkedNSFW = checkNsfwKeywords(replyText);
                    let replierIsNSFW = replierId && nsfwUserIds.includes(replierId.toLowerCase());

                    if (replyIsMarkedNSFW || replierIsNSFW) {
                        if (replyMessageElement) {
                            blurImagesInElement(replyMessageElement);
                        }
                    }
                } catch (replyError) {
                    console.error('[BGM NSFW Protection] Error processing reply:', replyError);
                }
            });
        } catch (error) {
            console.error('[BGM NSFW Protection] Error in applyBlurringLogic:', error);
        }
    }

    // --- Initialization ---
    loadSettings();
    loadNsfwUserIds();
    applyBlurringLogic();

    // Optional: Re-apply on dynamic content changes (if any, might be complex)
    // const observer = new MutationObserver(applyBlurringLogic);
    // const config = { childList: true, subtree: true };
    // const targetNode = document.getElementById('main') || document.body;
    // if (targetNode) observer.observe(targetNode, config);

})();