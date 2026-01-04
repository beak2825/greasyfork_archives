// ==UserScript==
// @name        Agnai pics
// @namespace   Violentmonkey Scripts
// @match       https://agnai.chat/*
// @grant       none
// @version     0.1, 23/12/2023
// @author      -
// @description Makes stuff happen, watch the video.
// @icon        https://agnai.chat/favicon.ico
// @license     CC BY-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/482966/Agnai%20pics.user.js
// @updateURL https://update.greasyfork.org/scripts/482966/Agnai%20pics.meta.js
// ==/UserScript==

'use strict';

// Process AI reply

function ProcessReply (reply) {
  if (reply?.querySelector('div>div>div[class="break-words"]>span[data-bot-avatar="true"]>div>img')?.src) {
  if(!reply.getAttribute('checked')) {
    let thing = reply.querySelector('div>div>div[class="break-words"]');
    let oldpic = thing.querySelector('span[data-bot-avatar="true"]>div>img');
    let newpic = thing?.querySelector('div>p>p>code');
    if (newpic) {
      oldpic.src = newpic.textContent;
      newpic.remove();
    } else {
      console.log('Where new pic?');
    };
    reply.setAttribute('checked', 'true');
  };
  };
};

// Process all AI replies existing on page load

function ProcessOnLoad () {
  let Chat = document.getElementById("chat-messages");
  let AllReplies = Chat.querySelectorAll('div[data-sender="bot"]');
  AllReplies.forEach(ProcessReply);
};

// Observe shit

const RootObserver = new MutationObserver(function () {
  if (document.getElementById("chat-messages")) {
    ProcessOnLoad ();
  }
});
RootObserver.observe(document.getElementById("root"), {childList: true, subtree: true});