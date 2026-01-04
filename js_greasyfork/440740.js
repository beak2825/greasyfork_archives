// ==UserScript==
// @name         twitch进群助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  LFG!
// @license      MIT
// @author       ljybill
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440740/twitch%E8%BF%9B%E7%BE%A4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/440740/twitch%E8%BF%9B%E7%BE%A4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let count = 0;
  const MAX_COUNT = 5;

  function waitFor(condition, callback) {
    if (!condition()) {
      count++;
      if (count > MAX_COUNT) {
        return;
      }
      window.setTimeout(waitFor.bind(null, condition, callback), 500); /* this checks the flag every 100 milliseconds*/
    } else {
      callback();
    }
  }

  function isMessageDom(dom) {
    return dom.getAttribute('class') === 'chat-line__message';
  }

  function isDiscordInviteLink(msg) {
    return /https:\/\/discord\.gg\/.+/.test(msg);
  }

  function autoOpenLink(href) {
    const SPECIAL_ID = 'jerToTheMoon';
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.setAttribute('target', '_blank');
    a.setAttribute('id', SPECIAL_ID);

    if (document.getElementById(SPECIAL_ID)) {
      document.body.removeChild(document.getElementById(SPECIAL_ID));
    }
    document.body.appendChild(a);
    a.click();
  }

  function parseMessage(dom) {
    try {
      const msg_container = dom.querySelector('.chat-line__message-container');

      console.log(msg_container);
      const username = msg_container.querySelector('.chat-line__username').innerText;
      const msgDom = msg_container.querySelector('span[data-a-target=chat-message-text]');
      const msg = msgDom ? msgDom.innerText : '';
      const linkDom = msg_container.querySelector('a.tw-link');
      const link = linkDom ? linkDom.getAttribute('href') : '';

      return {
        username,
        msg,
        link,
        isLink: !!link,
        isDiscordInviteLink: isDiscordInviteLink(link),
      }

    } catch (e) {
      return false;
    }
  }

  function main() {
    const badgeListDom = document.querySelector('.chat-scrollable-area__message-container');

    badgeListDom.addEventListener('DOMNodeInserted', function (evt) {
      if (!isMessageDom(evt.target)) {
        return;
      }

      const result = parseMessage(evt.target);
      console.log(`${result.username}: ${result.msg} -- ${result.link}`);
      if (result && result.isDiscordInviteLink) {
        autoOpenLink(result.link);
      }

    }, false);
  }

  waitFor(() => !!document.querySelector('.chat-scrollable-area__message-container'), main);
})();
