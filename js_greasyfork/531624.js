// ==UserScript==
// @name        Rewrite reddit links to use the Narwhal 2 URI scheme
// @namespace   codes.heals.violentmonkey.narwhal2-opener
// @match       https://*/*
// @require     https://update.greasyfork.org/scripts/446257/1059316/waitForKeyElements%20utility%20function.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_addValueChangeListener
// @grant       window.close
// @run-at      document-start
// @version     1.3
// @author      HealsCodes
// @description 4/5/2025, 11:24:00 AM
// @license     GPL3
// @downloadURL https://update.greasyfork.org/scripts/531624/Rewrite%20reddit%20links%20to%20use%20the%20Narwhal%202%20URI%20scheme.user.js
// @updateURL https://update.greasyfork.org/scripts/531624/Rewrite%20reddit%20links%20to%20use%20the%20Narwhal%202%20URI%20scheme.meta.js
// ==/UserScript==

const redditLinkDomains = ['https://reddit.com', 'https://m.reddit.com', 'https://www.reddit.com', 'https://reddit.app.link'];

function redirectHrefAndCloseIfPossible() {
  // handle a new tab that is about to load a reddit-url (opened from another app for example)
  for(const prefix of redditLinkDomains) {
    if (window.location.href.startsWith(prefix)) {
      let encodedUrl = encodeURIComponent(window.location.href);
      window.location.href = 'narwhal://open-url/' + encodedUrl;
      setTimeout(() => window.close(), 500);
      return true;
    }
  }

  return false;
}

function updatePageLinks(element) {
    'use strict';

    function updateTextContent(textContent) {
      if (GM_getValue('addWhaleMark', true)) {
        return textContent + ' ' + String.fromCodePoint(0x1f433);
      }
      return textContent;
    }

    // Function to extract the original URL and redirect to Narwhal
    function redirectToNarwhal(link) {
        var originalUrl = link.href;
        var originalTextContent = link.textContent;

        if (originalUrl.startsWith('narwhal://')) {
          // already processed
          return;
        }

        for(const prefix of redditLinkDomains) {
          if (originalUrl.startsWith(prefix)) {
            let encodedUrl = encodeURIComponent(originalUrl);
            let textContent = updateTextContent(originalTextContent);
            Object.assign(link, {
              textContent: textContent,
              href: 'narwhal://open-url/' + encodedUrl
            });
            return;
          }
        }
    }

    if (element !== undefined) {
      redirectToNarwhal(element);
    } else {
      document.querySelectorAll(`a[href*="reddit."]`).forEach(link => redirectToNarwhal(link));
    }
}

function menuCommandTitle(state) {
  let checked = (state != null) ? state : GM_getValue('addWhaleMark', true);
  return String.fromCodePoint(checked ? 0x2611 : 0x2610) + ' Add ' + String.fromCodePoint(0x1f433) + ' to Narwhal links';
}

let valueChangedListener = GM_addValueChangeListener('addWhaleMark', function(name, oldVal, newVal, remote) {
  GM_unregisterMenuCommand(menuCommandTitle(oldVal));
  GM_registerMenuCommand(menuCommandTitle(newVal), (_) => GM_setValue('addWhaleMark', !GM_getValue('addWhaleMark', true)));
});


(function () {
  // move straight to Narwhal is we're already on reddit
  if (redirectHrefAndCloseIfPossible()) {
    return;
  }
  // register the context menu handler
  GM_registerMenuCommand(menuCommandTitle(null), (_) => GM_setValue('addWhaleMark', !GM_getValue('addWhaleMark', true)));
  // run on ajax updates
  waitForKeyElements(`a[href*="reddit."]`, (element) => updatePageLinks(), false);
  // run on initial page load
  document.updatePageLinks(undefined);
})();
