// ==UserScript==
// @name         new-LinkedIn-connection-opener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script opens new connection profile after accepting the invitation
// @author       goodwin64
// @include      https://www.linkedin.com/mynetwork/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398863/new-LinkedIn-connection-opener.user.js
// @updateURL https://update.greasyfork.org/scripts/398863/new-LinkedIn-connection-opener.meta.js
// ==/UserScript==

const BOT_NAME = 'new-LinkedIn-connection-opener';

(function () {
  'use strict';
  console.log(`${BOT_NAME} bot started`);

  function acceptHandler(e) {
    const target = e.target;
    const acceptButtonSelector = 'button[aria-label*="Accept"]';
    const acceptTextSelector = acceptButtonSelector + ' span';

    if (!target.matches(acceptButtonSelector) && !target.matches(acceptTextSelector)) {
      return;
    }

    const cardParent = target.closest('li.invitation-card');
    if (!cardParent) {
      return;
    }

    const memberLinkElem = cardParent.querySelector('a.invitation-card__link');
    if (!memberLinkElem) return;

    const memberLink = memberLinkElem.href;

    setTimeout(() => {
      window.open(memberLink);
    }, 3000);
  }

  if (!window[BOT_NAME]) {
    document.addEventListener('click', acceptHandler);
    window[BOT_NAME] = 'bot attached';
  }
})();
