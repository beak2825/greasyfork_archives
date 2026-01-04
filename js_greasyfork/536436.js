// ==UserScript==
// @name         YouTube Live Chat - Font 24px, Avatar Centered, Username Above Messages, Big Icons (Shadow DOM)
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  Font 24px, no left padding, avatar vertically centered, username above message, alternating colors, minimal spacing, BIG mod & member icons (Shadow DOM safe)
// @match        https://www.youtube.com/live_chat*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536436/YouTube%20Live%20Chat%20-%20Font%2024px%2C%20Avatar%20Centered%2C%20Username%20Above%20Messages%2C%20Big%20Icons%20%28Shadow%20DOM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536436/YouTube%20Live%20Chat%20-%20Font%2024px%2C%20Avatar%20Centered%2C%20Username%20Above%20Messages%2C%20Big%20Icons%20%28Shadow%20DOM%29.meta.js
// ==/UserScript==

GM_addStyle(`
  yt-live-chat-text-message-renderer, yt-live-chat-moderation-message-renderer {
    font-size: 22px !important;
    padding-left: 0 !important;
    color: inherit !important;
    box-sizing: border-box !important;
    display: flex !important;
    align-items: center !important;
    padding: 6px 12px !important;
  }
  #author-photo {
    flex-shrink: 0 !important;
    width: 3em !important;
    height: auto !important;
    margin-right: 12px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  yt-img-shadow {
    width: 3em !important;
    height: auto !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  yt-img-shadow img {
    width: 3em !important;
    height: auto !important;
    border-radius: 50% !important;
    object-fit: cover !important;
  }
  #content {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    flex: 1 1 auto !important;
    min-width: 0 !important;
  }
  #timestamp {
    font-size: 12px !important;
    color: #ccc !important;
    margin-bottom: 2px !important;
  }
  yt-live-chat-author-chip {
    font-weight: 700 !important;
    color: #fff !important;
    line-height: 1.1 !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  #author-name {
    display: block !important;
    font-weight: 700 !important;
    margin: 0 !important;
    padding: 0 !important;
    color: #fff !important;
    line-height: 1.1 !important;
  }
  #message {
    margin-top: -1.20em !important;
    line-height: 1.2 !important;
    color: #e0d7ff !important;
    white-space: normal !important;
    display: block !important;
  }
  yt-live-chat-moderation-message-renderer yt-formatted-string {
    margin-left: 3em !important;
  }
`);

// Utility: forcibly resize all SVG and IMG badges in a badge renderer's shadow root
function resizeBadgeIcons(badgeRenderer, size = '2.4em') {
    if (!badgeRenderer || !badgeRenderer.shadowRoot) return;
    // SVG badges (mod wrench, etc)
    badgeRenderer.shadowRoot.querySelectorAll('svg').forEach(svg => {
        svg.style.width = size;
        svg.style.height = size;
        svg.style.minWidth = size;
        svg.style.minHeight = size;
        svg.style.maxWidth = size;
        svg.style.maxHeight = size;
        svg.setAttribute('width', parseInt(size));
        svg.setAttribute('height', parseInt(size));
        svg.style.display = 'inline-block';
        svg.style.verticalAlign = 'middle';
    });
    // IMG badges (membership, etc)
    badgeRenderer.shadowRoot.querySelectorAll('img').forEach(img => {
        img.style.width = size;
        img.style.height = size;
        img.style.minWidth = size;
        img.style.minHeight = size;
        img.style.maxWidth = size;
        img.style.maxHeight = size;
        img.setAttribute('width', parseInt(size));
        img.setAttribute('height', parseInt(size));
        img.style.display = 'inline-block';
        img.style.verticalAlign = 'middle';
    });
}

// Process all current chat messages
function processAllChatMessages() {
    // All chat message types
    const selectors = [
        'yt-live-chat-text-message-renderer',
        'yt-live-chat-paid-message-renderer',
        'yt-live-chat-membership-item-renderer',
        'yt-live-chat-moderation-message-renderer'
    ];
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(renderer => {
            // Find all badge renderers in this message
            renderer.shadowRoot && renderer.shadowRoot.querySelectorAll('yt-live-chat-author-badge-renderer').forEach(badge => {
                resizeBadgeIcons(badge);
            });
        });
    });
}

// Observe for new chat messages and resize their icons
function observeChat() {
    const itemsContainer = document.querySelector('#items');
    if (!itemsContainer) {
        setTimeout(observeChat, 500);
        return;
    }
    // Initial run
    processAllChatMessages();
    // Observe for new messages
    new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.tagName && node.tagName.startsWith('YT-LIVE-CHAT-')) {
                    // For each new chat message, resize its badges
                    node.shadowRoot && node.shadowRoot.querySelectorAll('yt-live-chat-author-badge-renderer').forEach(badge => {
                        resizeBadgeIcons(badge);
                    });
                }
            }
        }
    }).observe(itemsContainer, { childList: true, subtree: true });
}

// Kick off everything
observeChat();