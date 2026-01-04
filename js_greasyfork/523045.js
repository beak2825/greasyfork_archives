// ==UserScript==
// @name           Serial Code Tracker
// @description    Save and mark serial codes as used when accessed.
// @description:ja アクセスされたシリアルコードを保存し、使用済みとしてマークします。
// @author         Ginoa AI
// @namespace      https://greasyfork.org/ja/users/119008-ginoaai
// @version        1.1
// @match          https://www.hoyolab.com/article/*
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @icon           https://pbs.twimg.com/profile_images/1648150443522940932/4TTHKbGo_400x400.png
// @downloadURL https://update.greasyfork.org/scripts/523045/Serial%20Code%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/523045/Serial%20Code%20Tracker.meta.js
// ==/UserScript==

function getSavedCodes() {
  return new Set(GM_listValues());
}

function updateLinkText(node) {
  const savedCodes = getSavedCodes();
  const links = node.querySelectorAll('a');
  links.forEach((link) => {
    if (link.href.includes('code=')) {
      const url = new URL(link.href);
      const code = url.searchParams.get('code');

      if (savedCodes.has(code)) {
        link.textContent = 'アクセス済み';
      }
    }
  });
}

function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        callback(element);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

document.addEventListener('mousedown', function (event) {
  if (event.button === 0 || event.button === 1) {
    const target = event.target.closest('a');
    if (target && target.href.includes('code=')) {
      const url = new URL(target.href);
      const code = url.searchParams.get('code');
      if (code) {
        GM_setValue(code, true);
        console.log(`Saved code: ${code}`);

        waitForElement('div[class="mhy-article-page__content"]', (ost) => {
          updateLinkText(ost);
        });
      }
    }
  }
});

waitForElement('div[class="mhy-article-page__content"]', (ost) => {
  updateLinkText(ost);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.nodeType === Node.ELEMENT_NODE) {
          updateLinkText(addedNode);
        }
      }
    }
  });

  observer.observe(ost, { childList: true, subtree: true });
  console.log('Saved Codes:', getSavedCodes());
});