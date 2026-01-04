// ==UserScript==
// @name        Switch to Invidious
// @namespace   ca.kyleschwartz
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      Kyle Schwartz
// @description Adds a button
// @downloadURL https://update.greasyfork.org/scripts/453840/Switch%20to%20Invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/453840/Switch%20to%20Invidious.meta.js
// ==/UserScript==

(async () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let curURL;
  let running = false;

  window.onload = () => {
    setInterval(() => {
      if (window.location.search !== curURL) {
        curURL = window.location.search;
        console.log("Page change!");
        addInvidious();
      }
    }, 200);
  };

  const addInvidious = async () => {
    if (window.location.search === "") return;

    const link = "https://yt.notato.xyz/watch" + curURL;

    const inner = `
<div>
  <a href="${link}"
     class="yt-simple-endpoint style-scope ytd-button-renderer"
     style="font-weight: 500; font-size: 14px; text-transform: uppercase; height: 100%; flex-direction: row; align-items: center; justify-content: center; margin-right: 1.5rem; letter-spacing: 0.5px;"
     tabindex="-1">
      <button id="button"
              class="style-scope yt-icon-button"
              aria-label="Open in Invidious"
              style="height: 24px; width: 24px; margin-right: 0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
      </button>
      Invidious
  </a>
</div>`.trim();

    const wrapper = document.createElement("template");
    wrapper.innerHTML = inner;

    if (running) return;
    running = true;

    await sleep(3000);

    const [bar1, bar2] = document.querySelectorAll(
      "#top-row .top-level-buttons"
    );

    bar1.insertBefore(wrapper.content.firstChild, bar1.firstChild);
    bar2.insertBefore(wrapper.content.firstChild, bar2.firstChild);

    running = false;
  };
})();