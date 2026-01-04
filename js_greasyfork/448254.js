// ==UserScript==
// @name        FileCR Assistant Bypass
// @namespace   lemons
// @license     Unlicense
// @match       *://filecr.com/*
// @match       https://anygame.net/downloads/*
// @icon        https://filecr.com/favicon.png
// @grant       none
// @version     1.5
// @author      lemons
// @description A simple script to bypass FileCR Assistant.
// @downloadURL https://update.greasyfork.org/scripts/448254/FileCR%20Assistant%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/448254/FileCR%20Assistant%20Bypass.meta.js
// ==/UserScript==

// derived from https://greasyfork.org/en/scripts/479625-filecr-assistant-bypass-helper
window.addEventListener('message', (event) => {
  const data = {
    direction: 'from-content-script',
    responseFor: event.data.id,
    type: 'response',
  };

  if (event.data.action === 'app.info') {
    data.data = {
      id: 'cgdlgjfaminolmljfokbbienpoibhknp',
      version: '9.9.9',
    };
    window.postMessage(data);
    return;
  }
  if (event.data.id === "install-check") {
    window.postMessage(data);
    return;
  };
  if (event.data.action === "downloads.extractLink") {
    data.data = event.data.data.url;
    window.location.href = event.data.data.url;
    window.postMessage(data);
    return;
  };
});

let reloading = false;

if (!document.cookie.includes("extensionIsInstalled")) {
  document.cookie = "extensionIsInstalled=1;";
}

const observer = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
            const scriptTag = document.querySelector('script#__NEXT_DATA__');
            if (scriptTag) {
              if (document.querySelector(".e-404") && !reloading) {
                reloading = true;
                location.reload();
              }
            }
        }
    });
});

observer.observe(document.head, {
    childList: true,
    subtree: true
});