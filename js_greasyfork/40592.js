// ==UserScript==
// @name         ChatButton
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add a channel/chat button
// @author       DoubleJarvis
// @match        https://*.twitch.tv/*
// @exclude      https://*.twitch.tv/*/chat
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40592/ChatButton.user.js
// @updateURL https://update.greasyfork.org/scripts/40592/ChatButton.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function rafAsync() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve); //faster than set time out
    });
  }

  // wait until target element is on the page
  async function checkElement(selector) {
    while (document.querySelector(selector) === null) {
        await rafAsync()
    }
    return true;
  }  

  checkElement('.chat-input__buttons-container').then(() => {
    appendButton();
  });

  

  function appendButton() {
    var pathname = window.location.pathname;
    var chat_link = pathname + "/chat";
    var target = document.getElementsByClassName("chat-input__buttons-container")[0].children[0];

    var button = document.createElement("a");
    button.href = chat_link;
    button.target = "_blank";
    button.classList.add("tw-button-icon");
    button.innerText = "Open chat";

    target.appendChild(button);
  }
})();
