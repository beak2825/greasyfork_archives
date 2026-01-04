// ==UserScript==
// @name                YT Live Chat Emoji Copy Tool
// @name:zh             YT 直播聊天室貼圖複製工具
// @name:zh-TW          YT 直播聊天室貼圖複製工具
// @name:zh-CN          YT 直播聊天室贴图复制工具
// @namespace           https://github.com/kevin823lin
// @version             0.3
// @description         Make YouTube™ Live Chat's emoji can be copied.
// @description:zh      讓 YouTube™ 直播聊天室的貼圖可以被複製
// @description:zh-TW   讓 YouTube™ 直播聊天室的貼圖可以被複製
// @description:zh-CN   让 YouTube™ 直播聊天室的贴图可以被复制
// @author              kevin823lin
// @match               https://www.youtube.com/live_chat*
// @match               https://www.youtube.com/live_chat_replay*
// @match               https://studio.youtube.com/live_chat*
// @match               https://studio.youtube.com/live_chat_replay*
// @icon                https://www.google.com/s2/favicons?domain=youtube.com
// @require             https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @grant               none
// @date                2025-01-11
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/447599/YT%20Live%20Chat%20Emoji%20Copy%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/447599/YT%20Live%20Chat%20Emoji%20Copy%20Tool.meta.js
// ==/UserScript==

/*!
 * YT Live Chat Emoji Copy Tool v0.3
 * https://github.com/kevin823lin/yt-live-chat-emoji-copy-tool
 * 
 * Includes Lodash v4.17.21
 * 
 * Copyright (c) 2025 kevin823lin
 * Released under the MIT license
 * https://opensource.org/licenses/MIT
 * 
 * Date: 2025-01-11
 */

(function() {
    'use strict';

    // Your code here...
    const TYPES = {
        CHAT: Symbol("Chat"),
        INPUT: Symbol("Input"),
        PICKER: Symbol("Picker"),
    };

    const YOUTUBE_CHANNEL_ID_REGEX = /^UCkszU2WH9gy1mb0dV-11UJg\//;
    const CHAT_EMOJI_SELECTOR = 'img.emoji.yt-live-chat-text-message-renderer[shared-tooltip-text][data-emoji-id]:not(.copyable)';
    const INPUT_FIELD_SELECTOR = 'yt-live-chat-text-input-field-renderer > #input';
    const EMOJI_PICKER_SELECTOR = 'div.yt-emoji-picker-renderer#categories';
    const VERSION = (typeof GM_info !== 'undefined') ? GM_info?.script?.version : (typeof chrome !== 'undefined') ? chrome?.runtime?.getManifest()?.version : '';

    /**
     * Check if the emoji is already copyable.
     */
    function isEmojiCopyable(emoji) {
        return emoji.classList.contains('copyable');
    }

    /**
     * Retrieve the emoji's ID.
     */
    function getEmojiId(emoji) {
        return emoji.dataset.emojiId || emoji.id;
    }

    /**
     * Determine if the emoji is a YouTube-specific emoji.
     */
    function isYoutubeEmoji(emoji) {
        const id = getEmojiId(emoji);
        return !id || YOUTUBE_CHANNEL_ID_REGEX.test(id);
    }

    /**
     * Update the emoji's alt attribute with colon format.
     */
    function updateEmojiAltWithColon(emoji, compareText = null) {
        if (compareText && !compareText.match(emoji.alt)) return;
        emoji.alt = `:${isYoutubeEmoji(emoji) ? '' : '_'}${emoji.alt}:`;
    }

    /**
     * Process the emoji based on its type.
     */
    function processEmoji(emoji, type) {
        if (isEmojiCopyable(emoji)) return;

        emoji.classList.add('copyable');
        let compareText = null;

        switch (type) {
            case TYPES.CHAT:
                if (!document.contains(emoji)) return;
                compareText = emoji.getAttribute('shared-tooltip-text');
                break;
            case TYPES.INPUT:
                if (!getEmojiId(emoji)) return;
                break;
            case TYPES.PICKER:
                compareText = emoji.getAttribute('aria-label');
                break;
            default:
                console.warn(`Unknown emoji type: ${type}`);
                return;
        }

        updateEmojiAltWithColon(emoji, compareText);
    }

    /**
     * Update all emojis in the selected range.
     */
    function updateSelectedRangeEmojis() {
        try {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;
            const range = selection.getRangeAt(0);
            const fragment = range.cloneContents();
            const selectedEmojis = fragment.querySelectorAll(CHAT_EMOJI_SELECTOR);
            selectedEmojis.forEach(clonedEmoji => {
                const originalEmoji = range.commonAncestorContainer.querySelector(`img.emoji#${clonedEmoji.id}`);
                if (originalEmoji) {
                    processEmoji(originalEmoji, TYPES.CHAT);
                }
            });
        } catch (error) {
            console.error(`Error in updateSelectedRangeEmojis: ${error}`);
        }
    }

    /**
     * Update all emojis inside the input field.
     */
    function updateInputFieldEmojis(inputField) {
        const inputEmojis = inputField?.getElementsByClassName('yt-live-chat-text-input-field-renderer') || [];
        Array.from(inputEmojis).forEach((node) => processEmoji(node, TYPES.INPUT));
    }

    /**
     * Update emojis in the emoji picker based on mutations.
     */
    function updateEmojiPickerEmojis(mutations) {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IMG') {
                    processEmoji(node, TYPES.PICKER);
                }
            });
        });
    }

    /**
     * Initialize observers and event listeners on page load.
     */
    function initializeObservers() {
        const inputField = document.querySelector(INPUT_FIELD_SELECTOR);
        const emojiPicker = document.querySelector(EMOJI_PICKER_SELECTOR);

        const selectionchangeCallback = _.debounce(updateSelectedRangeEmojis, 200);
        const observeInputFieldCallback = _.debounce(() => {
            if (inputField) updateInputFieldEmojis(inputField);
        }, 200);
        const observeEmojiPickerCallback = updateEmojiPickerEmojis;

        const inputFieldObserver = new MutationObserver(observeInputFieldCallback);
        const emojiPickerObserver = new MutationObserver(observeEmojiPickerCallback);

        if (inputField) inputFieldObserver.observe(inputField, { childList: true, subtree: true });
        if (emojiPicker) emojiPickerObserver.observe(emojiPicker, { childList: true, subtree: true });

        document.addEventListener('selectionchange', selectionchangeCallback);
    }

    if (/^\/live_chat/.test(window.location.pathname)) {
        initializeObservers();
        console.log(`[YT Live Chat Emoji Copy Tool${VERSION ? ` v${VERSION}` : ''}]`);
    }
})();
