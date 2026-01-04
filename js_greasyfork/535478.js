// ==UserScript==
// @version     1.0
// @name        BuzzCopy
// @namespace   kyoruno
// @author      kyoruno
// @license     MIT
// @description Injects a copy link button next to the download button
// @icon        https://buzzheavier.com/favicon.ico
// @match       https://buzzheavier.com/*
// @exclude     https://buzzheavier.com/
// @exclude     https://buzzheavier.com/login*
// @exclude     https://buzzheavier.com/pricing*
// @exclude     https://buzzheavier.com/blog*
// @exclude     https://buzzheavier.com/speedtest*
// @exclude     https://buzzheavier.com/whyareyougay*
// @exclude     https://buzzheavier.com/developers*
// @exclude     https://buzzheavier.com/privacy*
// @exclude     https://buzzheavier.com/terms*
// @exclude     https://buzzheavier.com/contact*
// @exclude     https://buzzheavier.com/help*
// @exclude     https://buzzheavier.com/notfound*
// @exclude     https://buzzheavier.com/favicon.ico*
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/535478/BuzzCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/535478/BuzzCopy.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const log = (...args) => console.log("BuzzCopy:", ...args);

  const buzzUrl = new URL(window.location.href);
  if (!buzzUrl.pathname.endsWith('/download')) {
    buzzUrl.pathname = buzzUrl.pathname.replace(/\/+$/, '') + '/download';
  }

  function createButton() {
    const copyButton = document.createElement('a');
    copyButton.className = 'link-button';
    copyButton.textContent = 'Copy';

    copyButton.addEventListener('click', function(event) {
      event.preventDefault();
      fetch(buzzUrl)
        .then(response => {
          const hxRedirect = response.headers.get("hx-redirect");
          if(!hxRedirect) {
            log("could not retrieve redirect URL");
            alert("BuzzCopy: could not retrieve the link");
            return;
          }
          navigator.clipboard.writeText(hxRedirect)
            .then(() => log(hxRedirect))
            .catch(err => {
              log(err);
              alert("BuzzCopy: failed to use clipboard, check console logs");
            });
        })
        .catch(error => {
          log(error);
        });
    });
    return copyButton;
  }

  function insertButton() {
    const targetButton = document.querySelector('a.gay-button');
    if (!targetButton) {
      log("button not found");
      return;
    }

    const targetLi = targetButton.closest('li');
    if (!targetLi) {
      log("button's parent <li> not found");
      return;
    }

    const button = createButton();
    const space = document.createElement('span');
    space.textContent = ' - ';

    targetLi.insertBefore(button, targetButton);
    targetLi.insertBefore(space, targetButton);
  }

  insertButton();
})();

