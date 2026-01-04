// ==UserScript==
// @name         Apple Emoji Anywhere
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Forces websites to use Apple emoji font
// @author       LushyTheDev
// @match        *://**/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531495/Apple%20Emoji%20Anywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/531495/Apple%20Emoji%20Anywhere.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Create and inject stylesheet
    const injectStylesheet = () => {
        const style = document.createElement('style');
        style.textContent = `
            /* Force Apple Color Emoji font */
            @font-face {
                font-family: 'Apple Color Emoji Fallback';
                src: local('Apple Color Emoji');
                /* This includes specific Apple emoji code points */
                unicode-range: U+0023, U+0034, U+0037, U+00A9, U+2049, U+2199, U+21AA, U+23EA, U+23EC, 
                              U+23F0, U+2611, U+2649, U+264C, U+264F, U+2652, U+2660, U+2666, U+26AB, 
                              U+26F5, U+26FA, U+2702, U+2705, U+270B, U+270C, U+2712, U+2733, U+2744, 
                              U+274C, U+2754, U+2757, U+2795, U+27B0, U+2935, U+2B06, U+2B07, U+2B50, 
                              U+3297, U+FE0F, U+1F0CF, U+1F171, U+1F17F, U+1F191, U+1F196, U+1F197, 
                              U+1F199, U+1F19A, U+1F1E9, U+1F1EA, U+1F1EB, U+1F1F0, U+1F1F7, U+1F1FA, 
                              U+1F202, U+1F236, U+1F238, U+1F23A, U+1F300, U+1F305, U+1F306, U+1F309, 
                              U+1F30C, U+1F30E, U+1F311, U+1F314, U+1F317, U+1F31B, U+1F31E, U+1F330, 
                              U+1F334, U+1F338, U+1F339, U+1F33D, U+1F33E, U+1F33F, U+1F341, U+1F34C, 
                              U+1F34F, U+1F352, U+1F353, U+1F355, U+1F357, U+1F358, U+1F35B, U+1F360, 
                              U+1F363, U+1F367, U+1F36A, U+1F36D, U+1F36E, U+1F372, U+1F375, U+1F379, 
                              U+1F37A, U+1F385, U+1F386, U+1F389, U+1F391, U+1F392, U+1F3A1, U+1F3A5, 
                              U+1F3A8, U+1F3A9, U+1F3AB, U+1F3AF, U+1F3B3, U+1F3BA, U+1F3BB, U+1F3BE, 
                              U+1F3C0, U+1F3C1, U+1F3C3, U+1F3C6, U+1F3CA, U+1F3E2, U+1F3E6, U+1F3E8, 
                              U+1F3EC, U+1F405, U+1F40B, U+1F40F, U+1F410, U+1F412, U+1F414, U+1F416, 
                              U+1F41B, U+1F420, U+1F424, U+1F429, U+1F42A, U+1F42B, U+1F42E, U+1F431, 
                              U+1F432, U+1F438, U+1F439, U+1F43B, U+1F43C, U+1F442, U+1F444, U+1F445, 
                              U+1F447, U+1F44A, U+1F44E, U+1F44F, U+1F453, U+1F455, U+1F457, U+1F458, 
                              U+1F45C, U+1F45E, U+1F465, U+1F467, U+1F46C, U+1F46F, U+1F476, U+1F477, 
                              U+1F478, U+1F481, U+1F482, U+1F484, U+1F487, U+1F48A, U+1F48F, U+1F497, 
                              U+1F498, U+1F499, U+1F49A, U+1F4A0, U+1F4A1, U+1F4A3, U+1F4A5, U+1F4A6, 
                              U+1F4A9, U+1F4AE, U+1F4B0, U+1F4B7, U+1F4B8, U+1F4B9, U+1F4BD, U+1F4BE, 
                              U+1F4C3, U+1F4C7, U+1F4C8, U+1F4CB, U+1F4CD, U+1F4D0, U+1F4D4, U+1F4D8, 
                              U+1F4DD, U+1F4DE, U+1F4E1, U+1F4E3, U+1F4E4, U+1F4ED, U+1F4EE, U+1F4EF, 
                              U+1F4F1, U+1F4F2, U+1F4F6, U+1F502, U+1F505, U+1F508, U+1F50E, U+1F50F, 
                              U+1F514, U+1F516, U+1F51B, U+1F51F, U+1F520, U+1F525, U+1F529, U+1F52D, 
                              U+1F52E, U+1F52F, U+1F530, U+1F531, U+1F535, U+1F539, U+1F53B, U+1F53C, 
                              U+1F552, U+1F555, U+1F558, U+1F55A, U+1F55C, U+1F55F, U+1F562, U+1F567, 
                              U+1F595, U+1F5FE, U+1F5FF, U+1F606, U+1F607, U+1F608, U+1F60A, U+1F60E, 
                              U+1F60F, U+1F612, U+1F615, U+1F617, U+1F61A, U+1F61C, U+1F61E, U+1F620, 
                              U+1F625, U+1F627, U+1F62A, U+1F62D, U+1F630, U+1F631, U+1F634, U+1F63B, 
                              U+1F63E, U+1F640, U+1F648, U+1F64C, U+1F680, U+1F682, U+1F685, U+1F68B, 
                              U+1F68C, U+1F68F, U+1F691, U+1F693, U+1F695, U+1F698, U+1F69D, U+1F6A0, 
                              U+1F6A2, U+1F6A5, U+1F6AB, U+1F6AF, U+1F6B0, U+1F6B2, U+1F6B4, U+1F6B7, 
                              U+1F6BA, U+1F6BF, U+1F6C4, U+1F6C5, U+1F95A, U+1FAB2, U+20E3, U+200D, 
                              U+2642;
            }

            /* Apply Apple emoji to all text on all websites */
            * {
                font-family: -apple-system, BlinkMacSystemFont, 'Apple Color Emoji Fallback', 
                            system-ui, sans-serif !important;
            }

            /* Special fixes for Twitter */
            .r-sdzlij {
                font-family: 'Apple Color Emoji Fallback' !important;
            }
            
            /* Special handling for emoji elements on twitter */
            [data-testid="tweetText"] .emoji,
            [data-testid="tweetText"] img.Emoji,
            img.Emoji, div.Emoji, span.Emoji,
            img[src*="emoji"],
            img[src*="twemoji"] {
                display: none !important;
            }
            
            /* Show underlying character instead of hidden emoji images */
            [data-testid="tweetText"] img.Emoji:after,
            img.Emoji:after, div.Emoji:after, span.Emoji:after {
                content: attr(alt);
                font-family: 'Apple Color Emoji Fallback' !important;
                font-size: 1em;
            }
        `;
        document.head.appendChild(style);
    };

    // Apply to the DOM as early as possible
    if (document.head) {
        injectStylesheet();
    } else {
        // If the document hasn't fully loaded yet, wait for the head
        const observer = new MutationObserver((mutations, obs) => {
            if (document.head) {
                injectStylesheet();
                obs.disconnect();
            }
        });
        
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
    
    // Optional: Add a more aggressive emoji replacer for Twitter's custom emoji images
    const replaceTwitterEmojis = () => {
        // Find all emoji images and replace them with their alt text
        const emojiImages = document.querySelectorAll('img.Emoji, img[src*="emoji"], img[src*="twemoji"]');
        
        emojiImages.forEach(img => {
            if (img.alt && img.alt.match(/\p{Emoji}/u)) {
                const span = document.createElement('span');
                span.style.fontFamily = 'Apple Color Emoji Fallback';
                span.textContent = img.alt;
                img.parentNode.replaceChild(span, img);
            }
        });
    };
    
    // Run this periodically on Twitter
    if (window.location.hostname.includes('twitter.com') || 
        window.location.hostname.includes('x.com')) {
        
        // Initial run
        setTimeout(replaceTwitterEmojis, 1000);
        
        // Then keep checking as the user scrolls
        setInterval(replaceTwitterEmojis, 2000);
        
        // Also run when new content loads
        const tweetObserver = new MutationObserver(mutations => {
            replaceTwitterEmojis();
        });
        
        document.addEventListener('DOMContentLoaded', () => {
            const timeline = document.querySelector('[data-testid="primaryColumn"]');
            if (timeline) {
                tweetObserver.observe(timeline, {
                    childList: true,
                    subtree: true
                });
            }
        });
    }
})();