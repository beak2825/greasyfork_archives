// ==UserScript==
// @name         custom Motd
// @namespace    http://tampermonkey.net/
// @version      69.424
// @description  custom message of the day
// @author       Xenia_Games
// @match        https://multiplayerpiano.net/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543927/custom%20Motd.user.js
// @updateURL https://update.greasyfork.org/scripts/543927/custom%20Motd.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const messages = [
    'Trivia: Add /retard to your room name and your piano will become retarded... What?!',
    'insert MOTD message here',
    'don’t forget: abuse nebula as much as you can!',
    'THE FOG IS COMING THE FOG IS COMING THE FOG IS COMING',
    'Do not answer the knocking at the door.',
    '"What’s 9 + 10?" – "21" - Albert Einstein',
  ];

  const chosenMessage = messages[Math.floor(Math.random() * messages.length)];

  const observer = new MutationObserver((mutations, obs) => {
    obs.disconnect();

    const motd = document.getElementById('motd');
    const motdText = document.getElementById('motd-text');

    if (motd && motdText) {
      for (const el of [motd, motdText]) {
        for (const attr of Array.from(el.attributes)) {
          if (attr.name.startsWith('i18next-orgval-')) {
            el.removeAttribute(attr.name);
          }
        }
        el.removeAttribute('localized');
      }

      motdText.textContent = chosenMessage;
    }

    obs.observe(document.body, { childList: true, subtree: true });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('load', () => {
    observer.disconnect();

    const motd = document.getElementById('motd');
    const motdText = document.getElementById('motd-text');

    if (motd && motdText) {
      for (const el of [motd, motdText]) {
        for (const attr of Array.from(el.attributes)) {
          if (attr.name.startsWith('i18next-orgval-')) {
            el.removeAttribute(attr.name);
          }
        }
        el.removeAttribute('localized');
      }

      motdText.textContent = chosenMessage;
    }

    observer.observe(document.body, { childList: true, subtree: true });
  });
})();