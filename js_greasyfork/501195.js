// ==UserScript==
// @name        snaptik tiktok button
// @namespace   Violentmonkey Scripts
// @match       https://www.tiktok.com/*
// @grant       none
// @version     1.3
// @author      minnie
// @description 8/28/2024
// @downloadURL https://update.greasyfork.org/scripts/501195/snaptik%20tiktok%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/501195/snaptik%20tiktok%20button.meta.js
// ==/UserScript==

(function () {
  let isButtonAdded = false;

  function addSnaptikButton(targetElement) {
    if (targetElement.querySelector('.snaptik-btn')) return; // Prevent duplicate buttons

    let snaptikBtn = document.createElement('button');
    snaptikBtn.className = 'snaptik-btn';
    snaptikBtn.innerHTML = 'Snaptik';
    snaptikBtn.style.cssText = `
      box-sizing: border-box;
      appearance: none;
      min-width: 96px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      position: relative;
      border-style: solid;
      border-width: 1px;
      border-radius: 2px;
      font-family: var(--tux-fontFamilyParagraph);
      font-weight: var(--tux-fontWeightSemibold);
      text-decoration: none;
      cursor: pointer;
      background-clip: padding-box;
      font-size: 15px;
      height: 36px;
      padding-inline: 15px;
      color: var(--tux-colorConstTextInverse);
      background-color: var(--tux-colorPrimary);
      border-color: var(--tux-colorPrimary);
      margin-left: 10px;
    `;

    snaptikBtn.addEventListener('click', () => {
      let currentLink = window.location.href;
      navigator.clipboard
        .writeText(currentLink)
        .then(() => {
          console.log('Link copied to clipboard');
          window.open('https://snaptik.app/en1', '_blank');
        })
        .catch((err) => {
          console.error('Could not copy text: ', err);
        });
    });

    targetElement.appendChild(snaptikBtn);
  }

  // MutationObserver callback
  function observeChanges() {
    const targetWrapper = document.querySelector('.css-r4iroe-DivBtnWrapper.evv7pft7');
    if (targetWrapper) {
      addSnaptikButton(targetWrapper);
    }
  }

  // Set up a MutationObserver
  const observer = new MutationObserver(() => {
    observeChanges();
  });

  // Start observing the document body for changes
  observer.observe(document.body, { childList: true, subtree: true });

  // Optional: Disconnect the observer if the page is unloaded to prevent memory leaks
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
  });
})();
