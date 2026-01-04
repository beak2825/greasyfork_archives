// ==UserScript==
// @name         Torn Chat Timestamp
// @namespace    https://www.torn.com
// @version      1.3.0
// @description  Displays the time a chat message was sent right by it.
// @author       PhilMe [2590086]
// @match        *.torn.com/*
// @grant        none
// @homepageURL  https://greasyfork.org/en/scripts/420869-torn-chat-timestamp
// @downloadURL https://update.greasyfork.org/scripts/420869/Torn%20Chat%20Timestamp.user.js
// @updateURL https://update.greasyfork.org/scripts/420869/Torn%20Chat%20Timestamp.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // Feel free to edit the timestamp color below to any color you want
  let timestampColor = { red: 169, green: 169, blue: 169 };

  function parseDate(datestring) {
    let re = new RegExp(
      "^([0-2][0-9]):([0-5][0-9]):([0-5][0-9]) - ([0-3][0-9])/([0-1][0-9])/([0-9]{2})",
      "g"
    );
    let data = re.exec(datestring);
    return `${data[1]}:${data[2]}:${data[3]}`;
  }

  function addTimestamp(element) {
    let span = element.querySelector("span");
    let timeString = span.getAttribute("title");

    let timeSpan = document.createElement("span");
    timeSpan.innerHTML = parseDate(timeString) + " ";
    timeSpan.style.color = `rgb(${timestampColor.red}, ${timestampColor.green}, ${timestampColor.blue})`;

    let a = element.querySelector("a");
    element.prepend(timeSpan, a);
  }

  function addChatMessageObserver(element) {
    let messageDiv = element.querySelector("div[class*='_overview_']");

    if (messageDiv !== null) {
      messageDiv.querySelectorAll("div[class*='_message_']").forEach((msg) => {
        addTimestamp(msg);
      });
      chatMessageObserver.observe(messageDiv, { childList: true });

      // checks for the last message label at the bottom of chat to load, then scrolls the chatbox to it
      let interval = setInterval(() => {
        let lastMessageLabel = element.querySelector(
          "div[class*='_chat-last-message-label_']"
        );
        if (lastMessageLabel) {
          lastMessageLabel.scrollIntoView();
          clearInterval(interval);
        }
      }, 100);
    }
  }

  // Watches for if any new chats are created
  const chatObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        chatOpenedObserver.observe(mutation.addedNodes[i], { childList: true });
      }
    });
  });

  // When a chat is opened, timestamps are added
  const chatOpenedObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        let element = mutation.addedNodes[i];
        if (element.getAttribute("class").startsWith("_chat-box-content_")) {
          addChatMessageObserver(element);
        }
      }
    });
  });

  // When a new message is sent, add timestamp
  const chatMessageObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        addTimestamp(mutation.addedNodes[i]);
      }
    });
  });

  const chatRoot = document.querySelector("#chatRoot").firstElementChild;

  Array.from(
    chatRoot.querySelectorAll(
      "div[class*='_chat-box_']:not([class*='_chat-box-settings_'])"
    )
  ).forEach((element) => {
    addChatMessageObserver(element);
    chatOpenedObserver.observe(element, { childList: true });
  });
  chatObserver.observe(chatRoot, { childList: true }); // watches for new chats
})();
