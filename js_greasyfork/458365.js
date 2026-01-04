// ==UserScript==
// @name        Only Hanzi YT Captions
// @namespace   Violentmonkey Scripts
// @match       *://*.youtube.com/watch*
// @match       *://youtube.com/watch*
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_notification
// @version     0.2
// @author      KerfuffleV2
// @description Blurs and shrinks non-Hanzi YouTube captions. They are revealed if hovered.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/458365/Only%20Hanzi%20YT%20Captions.user.js
// @updateURL https://update.greasyfork.org/scripts/458365/Only%20Hanzi%20YT%20Captions.meta.js
// ==/UserScript==

// Set to true if you want the non-matching captions completely hidden. Note that you won't be able to hover.
const completelyHideNonHanzi = false;

// Font size for non-matching captions.
const nonHanziSize = "20pt";

// Regexp to match hanzi (or whatever).
const hanRe = /\p{Script=Han}/u;

// End user adjustable settings.


let enabled = GM_getValue('StartEnabled');

const sty = `
  .ohc-nonhanzi-caption {
    opacity: 0.6;
    filter: blur(.15em);
    font-size: ${nonHanziSize} !important;
    ${completelyHideNonHanzi ? 'display: none !important;' : ''}
  }

  .ohc-nonhanzi-caption:hover {
    opacity: inherit;
    filter: inherit;
    transition: opacity .5s ease-in, filter .5s ease-in;
  }
`;

GM_addStyle(sty);


function go(disable) {
  if (typeof window.ohc_observer !== 'undefined') {
    window.ohc_observer.disconnect();
    window.ohc_observer = undefined;
    if (disable) {
      return;
    }
  }

  const observer = new MutationObserver((mutations) => {
    if (!enabled) {
      return;
    }
    for (const mut of mutations) {
      if (mut.type !== 'childList') {
        continue;
      }
      mut.addedNodes.forEach((node) => {
        if (node.classList?.contains('ytp-caption-segment') &&
            !node.textContent?.match(hanRe)) {
          node.classList.add('ohc-nonhanzi-caption');
        }
      });
    }
  });

  const body = document.querySelector('body');
  if (!body) {
    console.log('OnlyHanziYTCaptions: No body. Bailing out!');
    return;
  }
  observer.observe(body, {childList: true, subtree: true});
  window.ohc_observer = observer;
}

function showNote(txt) {
  GM_notification(txt, 'Only Hanzi YT Captions');
}

GM_registerMenuCommand('Toggle enabled', () => {
  enabled = !enabled;
  showNote(enabled ? 'Now enabled' : 'Now disabled');
  go(!enabled);
});


GM_registerMenuCommand('Toggle initial state', () => {
  const startEnabled = !GM_getValue('StartEnabled');
  showNote(startEnabled ? 'Initially enabled' : 'Initially disabled');
  GM_setValue('StartEnabled', startEnabled);
});


if (enabled) {
  go(false);
}