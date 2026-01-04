// ==UserScript==
// @name        X (Twitter) Auto Gallery Mode
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*/status/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @license     MIT
// @grant       none
// @version     1.0
// @author      moh
// @description Opens posts that contains images in gallery mode by default
// @downloadURL https://update.greasyfork.org/scripts/532029/X%20%28Twitter%29%20Auto%20Gallery%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/532029/X%20%28Twitter%29%20Auto%20Gallery%20Mode.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function run() {
    const link = document.querySelector('article[data-testid="tweet"][tabindex="-1"]')?.querySelector('[aria-labelledby]')?.querySelector('a[role="link"]') ?? null;

    if (!link) {
      return;
    }

    if (window.location.toString().includes('photo')) {
      return;
    }

    console.log(
      "%cUserScript",
      "color: yellow; font-style: italic; background-color: blue;padding: 2px",
      "redirecting from",
      window.location.toString(),
      "to",
      link
    );

    const data = sessionStorage.getItem("userscript-redirect-"+link);
    if (data) {
      return;
    }

    link.click();
    sessionStorage.setItem("userscript-redirect-"+link, 1);
  }

  run();

  const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
          run();
      });
  });

  observer.observe(document.body, { subtree: true, childList: true });
})();
