// ==UserScript==
// @name         X Spaces Custom Reactions
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Replace X Spaces reaction emojis with a custom set for iOS
// @author       x.com/blankspeaker and x.com/PrestonHenshawX
// @match        https://twitter.com/*
// @match        https://x.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525018/X%20Spaces%20Custom%20Reactions.user.js
// @updateURL https://update.greasyfork.org/scripts/525018/X%20Spaces%20Custom%20Reactions.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const customEmojis = [
        '😂', '😲', '😢', '✌️', '💯',
        '👏', '✊', '👍', '👎', '👋',
        '😍', '😃', '😠', '🤔', '😷',
        '🔥', '🎯', '✨', '🥇', '✋',
        '🙌', '🙏', '🎶', '🎙', '🙉',
        '🪐', '🎨', '🎮', '🏛️', '💸',
        '🌲', '🐞', '❤️', '🧡', '💛',
        '💚', '💙', '💜', '🖤', '🤎',
        '💄', '🏠', '💡', '💢', '💻',
        '🖥️', '📺', '🎚️', '🎛️', '📡',
        '🔋', '🗒️', '📰', '📌', '💠',
    ];
 
    // Map custom emojis to original emojis
    const originalEmojis = ['😂', '😲', '😢', '💜', '💯', '👏', '✊', '👍', '👎', '👋'];
    const emojiMap = new Map();
 
    // Assign each custom emoji to an original emoji (round-robin)
    customEmojis.forEach((emoji, index) => {
        const originalEmoji = originalEmojis[index % originalEmojis.length];
        emojiMap.set(emoji, originalEmoji);
    });
 
    // Store the currently selected custom emoji
    let selectedCustomEmoji = null;
 
    // Function to hide the original emoji buttons
    function hideOriginalEmojiButtons() {
        const originalButtons = document.querySelectorAll('.css-175oi2r.r-1awozwy.r-18u37iz.r-9aw3ui.r-1777fci.r-tuq35u > div > button');
        originalButtons.forEach(button => {
            button.style.display = 'none'; // Hide the original buttons
        });
    }
 
    // Function to create the emoji picker grid
    function createEmojiPickerGrid() {
        const emojiPicker = document.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-9aw3ui.r-1777fci.r-tuq35u');
        if (!emojiPicker) return;
 
        // Check if the grid is already created to avoid duplicate work
        if (emojiPicker.querySelector('.emoji-grid-container')) return;
 
        // Hide the original emoji buttons
        hideOriginalEmojiButtons();
 
        // Create a container for the grid
        const gridContainer = document.createElement('div');
        gridContainer.className = 'emoji-grid-container';
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(5, 1fr)';
        gridContainer.style.gap = '10px'; // Increased gap between emojis
        gridContainer.style.padding = '10px'; // Add padding to the container
 
        // Create a document fragment to batch DOM updates
        const fragment = document.createDocumentFragment();
 
        // Add emojis to the grid
        customEmojis.forEach(emoji => {
            const emojiButton = document.createElement('button');
            emojiButton.setAttribute('aria-label', `React with ${emoji}`);
            emojiButton.setAttribute('role', 'button');
            emojiButton.className = 'css-175oi2r r-1awozwy r-z2wwpe r-6koalj r-18u37iz r-1w6e6rj r-a2tzq0 r-tuq35u r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l';
            emojiButton.type = 'button';
            emojiButton.style.margin = '5px'; // Add margin to each emoji button
 
            const emojiDiv = document.createElement('div');
            emojiDiv.dir = 'ltr';
            emojiDiv.className = 'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-1blvdjr r-vrz42v r-16dba41';
            emojiDiv.style.color = 'rgb(231, 233, 234)';
 
            const emojiImg = document.createElement('img');
            emojiImg.alt = emoji;
            emojiImg.draggable = 'false';
            emojiImg.src = `https://abs-0.twimg.com/emoji/v2/svg/${emoji.codePointAt(0).toString(16)}.svg`;
            emojiImg.title = emoji;
            emojiImg.className = 'r-4qtqp9 r-dflpy8 r-k4bwe5 r-1kpi4qh r-pp5qcn r-h9hxbl';
 
            emojiDiv.appendChild(emojiImg);
            emojiButton.appendChild(emojiDiv);
 
            // Add click event listener to set the selected custom emoji
            emojiButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
 
                // Set the selected custom emoji
                selectedCustomEmoji = emoji;
 
                // Find the associated original emoji
                const originalEmoji = emojiMap.get(emoji);
                if (originalEmoji) {
                    // Find the original emoji button and simulate a click
                    const originalButton = Array.from(document.querySelectorAll('button[aria-label^="React with"]'))
                        .find(button => button.querySelector('img')?.alt === originalEmoji);
                    if (originalButton) {
                        originalButton.click();
                    }
                }
            });
 
            fragment.appendChild(emojiButton);
        });
 
        // Append the fragment to the grid container
        gridContainer.appendChild(fragment);
 
        // Add attribution text at the bottom of the grid
        const attribution = document.createElement('div');
        attribution.style.gridColumn = '1 / -1'; // Span across all columns
        attribution.style.textAlign = 'center';
        attribution.style.fontSize = '12px';
        attribution.style.color = 'rgba(231, 233, 234, 0.8)';
        attribution.style.marginTop = '10px'; // Add margin to separate from the grid
 
        const blankspeakerLink = document.createElement('a');
        blankspeakerLink.href = 'https://www.x.com/blankspeaker';
        blankspeakerLink.textContent = '@blankspeaker';
        blankspeakerLink.style.color = 'inherit';
        blankspeakerLink.style.textDecoration = 'none';
        blankspeakerLink.target = '_blank'; // Open in new tab
 
        const prestonLink = document.createElement('a');
        prestonLink.href = 'https://www.x.com/PrestonHenshawX';
        prestonLink.textContent = '@PrestonHenshawX';
        prestonLink.style.color = 'inherit';
        prestonLink.style.textDecoration = 'none';
        prestonLink.target = '_blank'; // Open in new tab
 
        attribution.appendChild(document.createTextNode('by '));
        attribution.appendChild(blankspeakerLink);
        attribution.appendChild(document.createTextNode(' and '));
        attribution.appendChild(prestonLink);
 
        gridContainer.appendChild(attribution); // Append attribution to the bottom
        emojiPicker.appendChild(gridContainer);
    }
 
    // Intercept WebSocket messages to modify the payload
    const OrigWebSocket = window.WebSocket;
    window.WebSocket = function (url, protocols) {
        const ws = new OrigWebSocket(url, protocols);
        const originalSend = ws.send;
 
        ws.send = function (data) {
            if (typeof data === 'string') {
                try {
                    const parsed = JSON.parse(data);
 
                    if (parsed.payload && typeof parsed.payload === 'string') {
                        try {
                            const payloadParsed = JSON.parse(parsed.payload);
                            if (payloadParsed.body && selectedCustomEmoji) {
                                // Parse the nested body in the payload
                                const bodyParsed = JSON.parse(payloadParsed.body);
                                bodyParsed.body = selectedCustomEmoji; // Update the emoji in the body
                                payloadParsed.body = JSON.stringify(bodyParsed); // Re-stringify the body
                                parsed.payload = JSON.stringify(payloadParsed); // Re-stringify the payload
                                data = JSON.stringify(parsed); // Re-stringify the entire payload
                            }
                        } catch (e) {}
                    }
                } catch (e) {}
            }
            return originalSend.call(this, data);
        };
 
        return ws;
    };
 
    // Initialize
    function init() {
        // Create the emoji picker grid
        createEmojiPickerGrid();
 
        // Observe DOM changes to reapply emoji grid only when necessary
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if the emoji picker is in the added nodes
                    const hasEmojiPicker = Array.from(mutation.addedNodes).some(node =>
                        node.querySelector && node.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-9aw3ui.r-1777fci.r-tuq35u')
                    );
                    if (hasEmojiPicker) {
                        createEmojiPickerGrid();
                    }
                }
            }
        });
 
        observer.observe(document.body, { childList: true, subtree: true });
    }
 
    // Start after the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();