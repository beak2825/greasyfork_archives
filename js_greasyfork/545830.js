// ==UserScript==
// @name         discord mod
// @namespace    http://tampermonkey.net/
// @description  makes user names gradient and removes message timestamps.
// @version      2025-08-09
// @author       0day
// @match        https://discord.com/channels/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545830/discord%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/545830/discord%20mod.meta.js
// ==/UserScript==

(() => {
  const gradientColors = ["#d43da0", "#ffde90", "#d43da0"];

  const style = document.createElement("style");
  style.textContent = `
    .js-gradient-username {
      background-image: linear-gradient(
        90deg,
        var(--custom-gradient-color-1),
        var(--custom-gradient-color-2),
        var(--custom-gradient-color-3)
      );
      background-size: 200% auto;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent !important;
      animation: js-gradient-move 3s linear infinite;
    }

    @keyframes js-gradient-move {
      0% {
        background-position: 0% 50%;
      }
      100% {
        background-position: 200% 50%;
      }
    }
  `;
  document.head.appendChild(style);

  function applyGradient() {
    const usernameEls = document.querySelectorAll("span.username_c19a55, span[role='button']");
      usernameEls.forEach((el) => {
        el.classList.add("js-gradient-username");
        el.style.setProperty("--custom-gradient-color-1", gradientColors[0]);
        el.style.setProperty("--custom-gradient-color-2", gradientColors[1]);
        el.style.setProperty("--custom-gradient-color-3", gradientColors[2]);
      })
  }
  applyGradient();

  const observer = new MutationObserver(() => {
    applyGradient();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log("Gradient username script running");
})();

function hideTimestamps() {
  const selectors = [
    '[class*="timestamp"]',
    '[class*="timestampInline"]',
    '[class*="timestampVisibleOnHover"]',
    '[class*="messageTimestamp"]'
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = 'none';
    });
  });
}

hideTimestamps();


const observer = new MutationObserver(() => {
  hideTimestamps();
});

observer.observe(document.body, { childList: true, subtree: true });