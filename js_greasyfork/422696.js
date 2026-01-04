// ==UserScript==
// @name        Telegram Message Hide
// @version     0.1
// @description Hides messages from users in the user curated list
// @license     MIT
// @author      smsimeon
// @icon        https://web.telegram.org/favicon.ico
// @namespace   Telegram-Message-Hide
// @include     https://web.telegram.org/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/422696/Telegram%20Message%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/422696/Telegram%20Message%20Hide.meta.js
// ==/UserScript==

/* jshint esversion: 10 */
(function main() {
  let defaultList = [
    "#user",
    "#female",
  ];

  let messages;
  let messagesLength;
  let userNames = GM_getValue("user-names", defaultList);
  let delay = GM_getValue("update-interval", 3000);
  let eventTimeout;

  function applyStyles(messagesWrappers) {
    messagesWrappers.forEach(messageWrapper => {
      const message = messageWrapper.querySelector(".im_message_body");
      if (!message) return;
      if (message.innerText && userNames.some(v => message.innerText.toLowerCase().indexOf(v.toLowerCase()) >= 0)) {
        console.log(message.innerText);
        message.style.display = 'none';
        message.onclick = null;
      }
    });
  }

  function eventThrottler(timeout) {
    if (!eventTimeout) {
      eventTimeout = setTimeout(() => {
        eventTimeout = null;
        messages = document.querySelectorAll(".im_history_message_wrap");
        if (messages.length === messagesLength || messages.length === 0) return;
        messagesLength = messages.length;
        applyStyles(messages);
      }, timeout);
    }
  }

  GM_addStyle(`
    .userMessage {
      max-height: 40px;
    }
    .userMessage > div:before {
      color: dodgerblue;
      font-weight: bold;
      text-decoration: underline dotted;
      content: "Hidden Content";
    }
  `);

  GM_registerMenuCommand("Filter list", () => {
    const wordList = GM_getValue("user-names", userNames);
    let val = prompt("Enter usernames to filter, separated by comma:", wordList);
    if (val !== null && typeof val === "string") {
      val = val.split(",").filter(v => v).map(v => v.trim());
      userNames = val;
      GM_setValue("user-names", val);
      messages = document.querySelectorAll(".im_history_message_wrap");
      applyStyles(messages);
    }
  });

  GM_registerMenuCommand("Update interval", () => {
    const updateInterval = GM_getValue("update-interval", delay);
    const val = prompt("Enter message scanning frequency (in ms):", updateInterval);
    if (val !== null && typeof val === "string") {
      delay = val;
      GM_setValue("update-interval", val);
    }
  });

  // Run the script when an API message is received, throttled with delay
  window.addEventListener("message", () => eventThrottler(delay), false);
}());
