// ==UserScript==
// @name        Telegram - First Message
// @namespace   https://tampermonkey.net/
// @version     0.1
// @description  Navigate to the first message of a Telegram channel by pressing Ctrl+B
// @author       You
// @match       https://t.me/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/493168/Telegram%20-%20First%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/493168/Telegram%20-%20First%20Message.meta.js
// ==/UserScript==

const firstMessageUrl = (channelId) => `https://t.me/${channelId}/0`;

const navigateToFirstMessage = () => {
  const channelLink = document.querySelector('.tgme_channel_info_link');
  if (channelLink) {
    const channelId = channelLink.getAttribute('href').split('/');
    window.location.href = firstMessageUrl(channelId[1]);
  }
};

const handleKeyPress = (event) => {
  if (event.ctrlKey && event.key === 'b') {
    navigateToFirstMessage();
  }
};

document.addEventListener('keypress', handleKeyPress);

// Wait for channel info to load (mutation observer)
const observer = new MutationObserver(mutations => {
  if (document.querySelector('.tgme_channel_info_link')) {
    observer.disconnect();
    navigateToFirstMessage();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
