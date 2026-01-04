// ==UserScript==
// @name         pixiv like combinator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  pixiv のブックマークボタンを押すと自動で「いいね！」も押されるようになります
// @author       null
// @match        https://www.pixiv.net/*
// @icon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542209/pixiv%20like%20combinator.user.js
// @updateURL https://update.greasyfork.org/scripts/542209/pixiv%20like%20combinator.meta.js
// ==/UserScript==

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(function () {
  'use strict';

  let prev_url = "";
  let executed = false;

  function add_listener() {
    if (location.href != prev_url) {
      executed = false;
      prev_url = location.href;
    }

    let path = location.pathname;
    if (!path.startsWith("/artwork")) {
      return;
    }

    let button_like;
    let button_bookmark;
    try {
      button_bookmark = document.getElementsByClassName("gtm-main-bookmark")[0];
      button_like = button_bookmark.parentElement.nextElementSibling.children[0];
    } catch (_) {
      return;
    }

    if (button_like && button_bookmark) {
      if (executed) return;
      executed = true;
      button_bookmark.addEventListener("click", async function () {
        await wait(300);
        button_like.click();
      });
    }
  };

  window.onload = add_listener;

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      add_listener();
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
