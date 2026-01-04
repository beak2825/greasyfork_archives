// ==UserScript==
// @name         Rumble Chat Emojis
// @namespace    http://tampermonkey.net/
// @version      0.62
// @description  Replace keywords with emojis
// @author       Infrared Labs
// @match        https://rumble.com/*
// @icon         https://rumble.com/i/favicon-v4.png
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458360/Rumble%20Chat%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/458360/Rumble%20Chat%20Emojis.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    .RumbleChatEmotes-emoteMenu {
      background: #fff;
      border-radius: 0.6rem;
      margin-bottom: 1rem;
      padding: 0.75rem;
      user-select: none;
    }

    .RumbleChatEmotes-emoteMenu.dark {
      background: #061726;
      color: inherit;
    }

    .RumbleChatEmotes-emoteMenu summary { cursor: pointer; }
    .RumbleChatEmotes-emoteMenu img { cursor: pointer; padding: 4px; }
    .RumbleChatEmotes-emoteMenu img:hover { background: #d6e0ea; }
  `);

  let emotes = {};

  const emoteImage = (key) =>
    `<img src="${emotes[key]}" style="height: 24px; width: 24px;" title="${key}">`;

  const chatHistoryList = document.querySelector('#chat-history-list');
  if (!chatHistoryList) return;

  //
  // Load emote data
  //

  fetch('https://raw.githubusercontent.com/sungorilla2036/RumbleChatEmotes/master/emotes.json')
    .then((res) => res.json())
    .then((json) => {
      emotes = json;

      // Add emote menu
      document.querySelector('#chat-rant-form').insertAdjacentHTML(
        'afterend',
        `
         <details class="RumbleChatEmotes-emoteMenu">
           <summary>Emotes</summary>
           <div>${Object.keys(emotes).map(emoteImage).join('')}</div>
         </details>
         `
      );

      const emoteMenu = document.querySelector('.RumbleChatEmotes-emoteMenu');

      emoteMenu.addEventListener('click', (ev) => {
        if (!ev.target.matches('img')) return;
        document.querySelector('.chat--input').value += ev.target.title;
        document.querySelector('.chat--send').disabled = false;
      });

      const darkTheme = document.querySelector('.js-theme-ss--dark');

      const updateTheme = () => {
        if (darkTheme.disabled) {
          emoteMenu.classList.remove('dark');
        } else {
          emoteMenu.classList.add('dark');
        }
      };

      updateTheme();

      new MutationObserver(() => updateTheme()).observe(darkTheme, {
        attributes: true,
        attributeFilter: ['disabled'],
      });
    });

  //
  // Handle new messages
  //

  new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        let messageElem = node.querySelector('.chat-history--message');
        messageElem ||= node.querySelector('.chat-history--rant-text');

        if (!messageElem) continue;

        // Replace :emote: strings with images
        messageElem.innerHTML = messageElem.innerHTML.replaceAll(/:\w+:/g, (key) => {
          const keyLowerCased = key.toLowerCase();
          return keyLowerCased in emotes ? emoteImage(keyLowerCased) : key;
        });
      }
    }
  }).observe(chatHistoryList, { childList: true });
})();
