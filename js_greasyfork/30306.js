// ==UserScript==
// @name        mute live threads
// @namespace   org.stevenhoward
// @description Add a close button to reddit live threads so you can ignore them easily.
// @include     https://www.reddit.com/*
// @version     1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/30306/mute%20live%20threads.user.js
// @updateURL https://update.greasyfork.org/scripts/30306/mute%20live%20threads.meta.js
// ==/UserScript==

const selector = 'a.happening-now-wrap';

function onBannerInserted(root) {
  const liveBanner = root.querySelector(selector);
  const muted = JSON.parse(localStorage.mutedLiveThreads || '[]');

  function hideBanner() {
    liveBanner.style.display = "none";
  }

  function onClose(e) {
    e.preventDefault();
    localStorage.mutedLiveThreads = JSON.stringify(muted.concat([ liveBanner.href ]));
    hideBanner();
  }

  if (muted.includes(liveBanner.href)) {
    hideBanner();
  }
  else {
    const close = document.createElement('p');
    close.innerHTML = '[X]';
    close.style.float = 'right';
    close.addEventListener('click', onClose, true);

    liveBanner.querySelector('.happening-now').appendChild(close);
  }
}

new MutationObserver(mutations => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.querySelector && node.querySelector(selector)) {
        onBannerInserted(node);
      }
    }
  }
}).observe(document.documentElement, { childList: true, subtree: true });

onBannerInserted(document.body);