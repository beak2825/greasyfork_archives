// ==UserScript==
// @name         Better Rumble Chat
// @namespace    http://tampermonkey.net/
// @version      0.73
// @description  Read tips on rumble streams out loud using WebSpeech API
// @author       sungorilla2036
// @match        https://rumble.com/*
// @icon         https://rumble.com/i/favicon-v4.png
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458381/Better%20Rumble%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/458381/Better%20Rumble%20Chat.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    .chat-history--username { color: gold; }
    .chat--height { color: white; background-color: black; }
  `);

  const SUPABASE_API_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZ3VweWVrcGtzbHBhdWlkem9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQwNjg3NTgsImV4cCI6MTk4OTY0NDc1OH0.3iKSXMuR9Z0ZLp3I521hOeIuqRwvxiCMTAOhuKUr3Pg';

  const fetchAPI = (path, options = {}) => {
    options.headers = {
      apikey: SUPABASE_API_KEY,
      Authorization: `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    return fetch(`https://jdgupyekpkslpauidzoo.supabase.co/rest/v1/${path}`, options).then(
      (response) => {
        if (response.status !== 200) return Promise.reject(response.status);
        return response.json();
      }
    );
  };

  //
  // Load saved user data
  //

  const QUERY_INTERVAL_SECONDS = 1;
  const BLACKLISTED_USERS = new Set([]);
  const WHITELISTED_USERS = new Set([]);

  let lastUserId = 0;

  const fetchUsers = () => {
    fetchAPI(`RumbleUsers?select=*&id=gt.${lastUserId}`)
      .then((data) => {
        for (const user of data) {
          lastUserId = Math.max(lastUserId, user.id);

          if (user.isBlacklisted) {
            if (!BLACKLISTED_USERS.has(user.name)) {
              GM_addStyle(`[data-better-rumble-username="${user.name}"] { display: none; }`);
              BLACKLISTED_USERS.add(user.name);
            }
          } else {
            WHITELISTED_USERS.add(user.name);
          }
        }
      })
      // Continuously refresh user data
      .finally(() => setTimeout(fetchUsers, 1000 * QUERY_INTERVAL_SECONDS));
  };

  fetchUsers();

  //
  // Load flagged username word data
  //

  fetchAPI('BlacklistedUsernameKeywords?select=keywords&id=eq.1').then((data) => {
    if (!data[0]) return;

    for (const flaggedWord of data[0].keywords.split(',')) {
      GM_addStyle(`[data-better-rumble-username*="${flaggedWord}" i] { display: none; }`);
    }
  });

  //
  // Text to speech
  //

  tts: {
    GM_addStyle(`
      .BetterRumble-container {
        background: #fff;
        border-radius: 0.6rem;
        margin-bottom: 1rem;
        padding: 0.75rem;
      }

      .BetterRumble-ttsSettingsHeader { cursor: pointer; }

      .BetterRumble-ttsSettings { margin: 0.5rem 0; }
      .BetterRumble-ttsSettings label {
        display: flex;
        margin-bottom: 0.5rem;
        justify-content: space-between;
      }

      .BetterRumble-ttsQueueHeader { display: flex; justify-content: space-between; }
      .BetterRumble-ttsQueueHeader h3 { font-weight: bold; }

      .BetterRumble-ttsQueue { height: 400px; overflow: scroll; }

      .BetterRumble-ttsMessage {
        display: flex;
        padding: 0.5rem;
        justify-content: space-between;
      }

      .BetterRumble-ttsMessage:nth-child(even) { background: #f3f5f8; }
      .BetterRumble-ttsMessage button { margin-left: 0.5rem; }
    `);

    const speech = window.speechSynthesis;
    const chatContainer = document.querySelector('.chat--container');

    if (!chatContainer) break tts;

    // This seems to make TTS work more reliably on first load.
    speech.cancel();
    speech.resume();

    //
    // Insert TTS HTML
    //

    const minDonation = GM_getValue('minDonation') || 500;
    GM_setValue('minDonation', minDonation);

    chatContainer.insertAdjacentHTML(
      'beforeend',
      `
      <details class="BetterRumble-container">
        <summary class="BetterRumble-ttsSettingsHeader">TTS Settings</summary>
        <div class="BetterRumble-ttsSettings">
          <label>
            Voice:
            <select class="BetterRumble-ttsVoice"><option>DEFAULT</option></select>
          </label>

          <label>
            Min Donation ($):
            <input class="BetterRumble-minDonation" type="number" min="0" value=${
              minDonation / 100
            } />
          </label>
        </div>
      </details>

      <section class="BetterRumble-container">
        <header class="BetterRumble-ttsQueueHeader">
          <h3>TTS Queue</h3>
          <label>Read TTS: <input class="BetterRumble-ttsEnabled" type="checkbox" checked /></label>
        </header>

        <div class="BetterRumble-ttsQueue"></div>
      </section>
      `
    );

    //
    // Set up settings input handling
    //

    chatContainer.querySelector('.BetterRumble-minDonation').addEventListener('input', (ev) => {
      if (!ev.target.validity.valid) return;
      GM_setValue('minDonation', ev.target.value * 100);
    });

    chatContainer.querySelector('.BetterRumble-ttsEnabled').addEventListener('change', (ev) => {
      if (ev.target.checked) {
        speech.cancel();
        speech.resume();
      } else {
        speech.cancel();
        speech.pause();
      }
    });

    const voiceSelect = chatContainer.querySelector('.BetterRumble-ttsVoice');

    voiceSelect.addEventListener('change', (ev) => {
      GM_setValue('ttsVoiceIndex', ev.target.selectedIndex);
    });

    let voices = [];

    const populateVoiceList = () => {
      const ttsVoiceIndex = GM_getValue('ttsVoiceIndex');

      voices = speech
        .getVoices()
        .filter((voice) => voice.lang.startsWith('en'))
        // Case-insensitive sort
        .sort((a, b) => Intl.Collator().compare(a.name, b.name));

      const voiceOptions = voices.map((voice, i) => {
        const option = document.createElement('option');

        option.textContent = `${voice.name} (${voice.lang})`;

        if (voice.default) {
          option.textContent += ' — DEFAULT';
          if (!ttsVoiceIndex) GM_setValue('ttsVoiceIndex', i);
        }

        return option;
      });

      voiceSelect.replaceChildren(...voiceOptions);
      voiceSelect.selectedIndex = GM_getValue('ttsVoiceIndex');
    };

    populateVoiceList();
    speech.addEventListener('voiceschanged', () => populateVoiceList());

    //
    // Set up TTS queue handling
    //

    const ttsQueue = chatContainer.querySelector('.BetterRumble-ttsQueue');

    ttsQueue.addEventListener('click', (ev) => {
      if (!ev.target.matches('.BetterRumble-deleteTTS')) return;
      if (!window.confirm('Skip this TTS message?')) return;

      ev.target.closest('.BetterRumble-ttsMessage').remove();
    });

    const speakNextMessage = () => {
      const message = ttsQueue.firstElementChild;
      if (!message || speech.paused || speech.speaking) return;

      const messageText = message.firstElementChild.textContent;
      const utterance = new SpeechSynthesisUtterance(messageText);

      utterance.voice = voices[voiceSelect.selectedIndex];
      utterance.addEventListener('end', () => message.remove());

      speech.speak(utterance);
    };

    setInterval(speakNextMessage, 1000);

    //
    // Handle new API messages
    //

    const chatID = document.querySelector('.rumbles-vote').dataset.id;
    const chatStream = new EventSource(`https://web9.rumble.com/chat/api/chat/${chatID}/stream`);

    chatStream.addEventListener('message', (event) => {
      const json = JSON.parse(event.data);
      if (json.type !== 'messages') return;

      const userIdToUsername = {};

      for (const user of json.data.users) {
        userIdToUsername[user.id] = user.username;
      }

      const minDonation = GM_getValue('minDonation');

      const pendingItems = json.data.messages.flatMap((message) => {
        if (!message.rant || message.rant.price_cents < minDonation) return [];

        const dollars = message.rant.price_cents / 100;
        const username = userIdToUsername[message.user_id];
        const ttsMessage = `${username} donated ${dollars} dollars. ${message.text}`;

        const ttsMessageItem = document.createElement('div');

        ttsMessageItem.className = 'BetterRumble-ttsMessage';
        ttsMessageItem.style.display = 'flex';
        ttsMessageItem.insertAdjacentHTML(
          'beforeend',
          '<div></div><button class="BetterRumble-deleteTTS">❌</button>'
        );
        ttsMessageItem.firstElementChild.textContent = ttsMessage;

        return [ttsMessageItem];
      });

      ttsQueue.append(...pendingItems);
    });
  }

  emotes: {
    let emotes = {};

    const emoteImage = (key) =>
      `<img src="${emotes[key]}" style="height: 24px; width: 24px;" title="${key}">`;

    const chatHistoryList = document.querySelector('#chat-history-list');
    if (!chatHistoryList) break emotes;

    //
    // Load emote data
    //

    fetch('https://raw.githubusercontent.com/sungorilla2036/RumbleChatEmotes/master/emotes.json')
      .then((res) => res.json())
      .then((json) => {
        emotes = json;

        // Preload images
        for (const url of Object.values(emotes)) new Image().src = url;
      });

    //
    // Handle new chat messages
    //

    new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        for (const node of mutation.addedNodes) {
          let messageElem = node.querySelector('.chat-history--message');
          messageElem ||= node.querySelector('.chat-history--rant-text');

          let userElem = node.querySelector('.chat-history--username a');
          userElem ||= node.querySelector('.chat-history--rant-username');

          if (!messageElem) continue;

          // Set data attribute so message can be filtered using CSS
          messageElem.dataset.betterRumbleUsername = userElem.textContent;

          // Replace :emote: strings with images
          messageElem.innerHTML = messageElem.innerHTML.replaceAll(/:\w+:/g, (key) => {
            const keyLowerCased = key.toLowerCase();
            return keyLowerCased in emotes ? emoteImage(keyLowerCased) : key;
          });
        }
      }
    }).observe(chatHistoryList, { childList: true });
  }
})();
