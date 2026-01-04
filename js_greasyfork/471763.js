// ==UserScript==
// @name         Open Tweets on Nitter
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds a button to open Twitter links on Nitter.
// @author       https://greasyfork.org/en/users/1136400-zikin & GPT
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471763/Open%20Tweets%20on%20Nitter.user.js
// @updateURL https://update.greasyfork.org/scripts/471763/Open%20Tweets%20on%20Nitter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Create the button
  const nitterButton = document.createElement('a');
  nitterButton.innerText = 'Open on Nitter';
  nitterButton.style.position = 'fixed';
  nitterButton.style.top = '10px';
  nitterButton.style.right = '10px';
  nitterButton.style.zIndex = '9999';
  nitterButton.style.padding = '6px 12px';
  nitterButton.style.backgroundColor = '#1da1f2';
  nitterButton.style.color = '#fff';
  nitterButton.style.borderRadius = '4px';
  nitterButton.style.textDecoration = 'none';

  // Function: Update button link based on current URL
  function updateButtonLink() {
    const regex = /https:\/\/twitter.com\/([^/]+)\/status\/([^/]+)/;
    const match = window.location.href.match(regex);

    if (match) {
      const username = match[1];
      const statusID = match[2];
      nitterButton.href = `https://nitter.net/${username}/status/${statusID}`;
      nitterButton.style.display = 'inline-block';
    } else {
      nitterButton.style.display = 'none';
    }
  }

  // Function: Open Nitter link in a new page when the button is clicked
  function openInNewPage(event) {
    event.preventDefault();
    window.open(nitterButton.href, '_blank');
  }

  // Function: Observe URL changes and update button link
  function observeURLChanges() {
    const targetNode = document.querySelector('body');
    const observerOptions = { childList: true, subtree: true };

    const mutationObserver = new MutationObserver(() => {
      setTimeout(() => {
        updateButtonLink();
      }, 500); // Adding a delay of 500ms to avoid triggering multiple times
    });

    mutationObserver.observe(targetNode, observerOptions);
  }

  // Initialize button link, observe URL changes, and attach click event listener
  updateButtonLink();
  observeURLChanges();
  document.body.appendChild(nitterButton);
  nitterButton.addEventListener('click', openInNewPage);
})();
