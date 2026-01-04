// ==UserScript==
// @name         noemoji
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Blocks emojis on all websites (with special handling for X.com and YouTube)
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534232/noemoji.user.js
// @updateURL https://update.greasyfork.org/scripts/534232/noemoji.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Unicode ranges for emojis
    const emojiRanges = [
        { start: 0x1F600, end: 0x1F64F }, // Emoticons
        { start: 0x1F300, end: 0x1F5FF }, // Misc Symbols and Pictographs
        { start: 0x1F680, end: 0x1F6FF }, // Transport and Map
        { start: 0x1F700, end: 0x1F77F }, // Alchemical Symbols
        { start: 0x1F780, end: 0x1F7FF }, // Geometric Shapes
        { start: 0x1F800, end: 0x1F8FF }, // Supplemental Arrows-C
        { start: 0x1F900, end: 0x1F9FF }, // Supplemental Symbols and Pictographs
        { start: 0x1FA00, end: 0x1FA6F }, // Chess Symbols
        { start: 0x1FA70, end: 0x1FAFF }, // Symbols and Pictographs Extended-A
        { start: 0x2600, end: 0x26FF },   // Misc symbols
        { start: 0x2700, end: 0x27BF },   // Dingbats
        { start: 0x2300, end: 0x23FF },   // Miscellaneous Technical
        { start: 0x2B00, end: 0x2BFF },   // Miscellaneous Symbols and Arrows
        { start: 0x3000, end: 0x303F }    // CJK Symbols and Punctuation (includes some emoji-like symbols)
    ];

    // Check if we're on specific sites that need special handling
    const isYouTube = () => window.location.hostname.includes('youtube');
    const isTwitter = () => window.location.hostname.includes('twitter') || window.location.hostname.includes('x.com');
    const isFacebook = () => window.location.hostname.includes('facebook') || window.location.hostname.includes('fb.com');
    const isInstagram = () => window.location.hostname.includes('instagram');
    const isReddit = () => window.location.hostname.includes('reddit');
    const isDiscord = () => window.location.hostname.includes('discord');
    const isWhatsApp = () => window.location.hostname.includes('whatsapp');
    const isTelegram = () => window.location.hostname.includes('telegram');

    // Check if a character is an emoji
    function isEmoji(char) {
        const code = char.codePointAt(0);
        if (!code) return false;

        return emojiRanges.some(range => code >= range.start && code <= range.end);
    }

    // Check if text contains any emoji
    function containsEmoji(text) {
        if (!text) return false;

        for (let i = 0; i < text.length; i++) {
            const charCode = text.codePointAt(i);
            if (charCode !== text.charCodeAt(i)) {
                // This is a surrogate pair
                const char = String.fromCodePoint(charCode);
                if (isEmoji(char)) {
                    return true;
                }
                i++; // Skip the second part of the surrogate pair
            } else {
                const char = text.charAt(i);
                if (isEmoji(char)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Replace emojis with empty string
    function removeEmojis(text) {
        if (!text) return text;

        let result = '';
        for (let i = 0; i < text.length; i++) {
            // Handle surrogate pairs correctly for emojis
            const charCode = text.codePointAt(i);
            if (charCode !== text.charCodeAt(i)) {
                // This is a surrogate pair (likely an emoji)
                const char = String.fromCodePoint(charCode);
                if (isEmoji(char)) {
                    result += ''; // Remove emoji completely
                    i++; // Skip the second part of the surrogate pair
                } else {
                    result += char;
                    i++; // Skip the second part of the surrogate pair
                }
            } else {
                const char = text.charAt(i);
                if (isEmoji(char)) {
                    result += ''; // Remove emoji completely
                } else {
                    result += char;
                }
            }
        }
        return result;
    }

    // Process text nodes and elements
    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const originalText = node.nodeValue;
            const newText = removeEmojis(originalText);
            if (originalText !== newText) {
                node.nodeValue = newText;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Skip script, style, and svg elements
            if (['SCRIPT', 'STYLE', 'SVG'].includes(node.tagName)) {
                return;
            }

            // Check for img elements that might be emoji
            if (node.tagName === 'IMG') {
                const alt = node.getAttribute('alt') || '';
                const src = node.getAttribute('src') || '';
                const className = node.className || '';

                // Hide image if it's likely an emoji
                if (containsEmoji(alt) ||
                    src.includes('emoji') ||
                    src.includes('twemoji') ||
                    className.includes('emoji') ||
                    (node.width > 0 && node.height > 0 && node.width < 32 && node.height < 32)) {
                    node.style.display = 'none';
                }
            }

            // Process elements that might contain emoji
            if (['SPAN', 'DIV', 'P', 'A', 'BUTTON', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(node.tagName)) {
                const aria = node.getAttribute('aria-label') || '';
                const title = node.getAttribute('title') || '';
                const className = node.className || '';

                if ((aria && containsEmoji(aria)) ||
                    (title && containsEmoji(title)) ||
                    className.includes('emoji')) {

                    // For X.com and other platforms that use spans to wrap emojis
                    if (node.childNodes.length === 0 ||
                        (node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE && containsEmoji(node.childNodes[0].nodeValue))) {
                        node.style.display = 'none';
                    }
                }
            }

            // Process children recursively
            Array.from(node.childNodes).forEach(processNode);
        }
    }

    // Process elements specific to certain platforms
    function processPlatformSpecificElements() {
        // YouTube specific processing
        if (isYouTube()) {
            const youtubeSelectors = [
                'yt-live-chat-text-message-renderer img',
                'yt-formatted-string img',
                'ytd-comment-renderer #content-text img',
                'img[src*="emoji"]',
                'img.emoji',
                'yt-emoji',
                'yt-emoji-picker-renderer'
            ];

            youtubeSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    el.style.display = 'none';
                });
            });
        }

        // Twitter/X.com specific processing
        if (isTwitter()) {
            const twitterSelectors = [
                'span[aria-label*="Emoji"]',
                'img.Emoji',
                'img[alt*="Emoji"]',
                '.r-4qtqp9.r-1bwzh9t.r-dnmrzs.r-bnwqim',
                '[data-testid="tweetText"] span:not(.r-18u37iz):not(:has(*))'
            ];

            twitterSelectors.forEach(selector => {
                try {
                    document.querySelectorAll(selector).forEach(el => {
                        el.style.display = 'none';
                    });
                } catch (e) {
                    // Some complex CSS selectors might not be supported in all browsers
                }
            });
        }

        // Facebook specific processing
        if (isFacebook()) {
            const fbSelectors = [
                'span[aria-label*="emoji"]',
                'img[alt*="emoji"]',
                'img[src*="emoji"]',
                '.x1lliihq', // Facebook's emoji class
                'img[alt*="Emoticon"]'
            ];

            fbSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    el.style.display = 'none';
                });
            });
        }

        // Instagram specific processing
        if (isInstagram()) {
            const igSelectors = [
                'span[aria-label*="emoji"]',
                'img[alt*="emoji"]',
                'img[src*="emoji"]',
                'img._7yuu' // Instagram's emoji class
            ];

            igSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    el.style.display = 'none';
                });
            });
        }

        // Reddit specific processing
        if (isReddit()) {
            const redditSelectors = [
                'span[aria-label*="emoji"]',
                'img.emoji',
                'img[alt*="emoji"]',
                'img[src*="emoji"]'
            ];

            redditSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    el.style.display = 'none';
                });
            });
        }

        // Discord specific processing
        if (isDiscord()) {
            const discordSelectors = [
                'img.emoji',
                'img[alt*="emoji"]',
                'img[src*="emoji"]',
                'span.emoji'
            ];

            discordSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    el.style.display = 'none';
                });
            });
        }
    }

    // Add custom CSS for universal emoji blocking
    function addCustomStyle() {
        const style = document.createElement('style');

        style.textContent = `
            /* Universal emoji hiding */
            img.emoji,
            img[src*="emoji"],
            img[alt*="emoji"],
            span[aria-label*="emoji"],
            span.emoji,
            .emoji,
            [role="img"][aria-label*="emoji"],
            [role="img"][aria-label*="Emoji"],
            [role="img"][title*="emoji"],
            [role="img"][title*="Emoji"] {
                display: none !important;
            }

            /* Site-specific emoji hiding */

            /* YouTube */
            yt-emoji-picker-renderer,
            yt-emoji,
            yt-img-shadow:has(img[src*="emoji"]),
            img[src*="emojiasset"],
            yt-live-chat-paid-message-renderer img,
            yt-live-chat-paid-sticker-renderer img,
            ytd-comment-renderer #content-text img {
                display: none !important;
            }

            /* X.com / Twitter */
            .r-4qtqp9.r-1bwzh9t.r-dnmrzs.r-bnwqim,
            span[aria-label*="Emoji"],
            span[aria-label*="emoji"] {
                display: none !important;
            }

            /* Facebook */
            .x1lliihq,
            img[alt*="Emoticon"] {
                display: none !important;
            }

            /* WhatsApp Web */
            span.selectable-text img,
            div.selectable-text img {
                display: none !important;
            }

            /* Slack */
            .c-emoji,
            .emoji {
                display: none !important;
            }

            /* Gmail */
            img[src*="emojione"],
            img[src*="goomoji"] {
                display: none !important;
            }

            /* Discord */
            img.emoji-4QhjQqh,
            span.emojiContainer-3X8SvE {
                display: none !important;
            }

            /* Common classes across platforms */
            .emoji-mart-emoji,
            .emoji-picker,
            .emoji-container,
            .emoji-wrapper {
                display: none !important;
            }
        `;

        document.head.appendChild(style);
    }

    // Main initialization function
    function init() {
        addCustomStyle();

        // Process the entire document
        processNode(document.body);

        // Process platform-specific elements
        processPlatformSpecificElements();

        // Set up a MutationObserver to handle dynamically added content
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    processNode(node);
                });
            });

            // Re-process platform specific elements after DOM changes
            processPlatformSpecificElements();
        });

        // Observe the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // Initialize as soon as possible
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // Handle SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Wait a bit for content to load after navigation
            setTimeout(() => {
                processNode(document.body);
                processPlatformSpecificElements();
            }, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

    // Apply initial styling even before full DOM load
    // This helps catch emoji that load very early
    (function earlyInit() {
        // Add basic style to prevent flash of emoji
        const earlyStyle = document.createElement('style');
        earlyStyle.textContent = `
            img[src*="emoji"], img.emoji, .emoji {
                display: none !important;
            }
        `;

        // Try to insert style as early as possible
        if (document.head) {
            document.head.appendChild(earlyStyle);
        } else {
            // If head isn't available yet, wait for it
            const observer = new MutationObserver(() => {
                if (document.head) {
                    document.head.appendChild(earlyStyle);
                    observer.disconnect();
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    })();
})();