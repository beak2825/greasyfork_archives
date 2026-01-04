// ==UserScript==
// @name         YouTube: Revert Icon Dropdown
// @namespace    https://greasyfork.org/en/users/1008366-trickyclock
// @author       TrickyClock
// @version      1.4
// @description  Replace 'Google Account' with 'Your channel' on the Icon Dropdown
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-body
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@e86c722f2c9cc2a96298c8511028f15c45180185/waitForElement.js
// @downloadURL https://update.greasyfork.org/scripts/478677/YouTube%3A%20Revert%20Icon%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/478677/YouTube%3A%20Revert%20Icon%20Dropdown.meta.js
// ==/UserScript==
"use strict";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

(async () => {
  const channelIcon = `<div style="width: 100%; height: 100%; fill: currentcolor;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;">
  <path d="M3,3v18h18V3H3z M4.99,20c0.39-2.62,2.38-5.1,7.01-5.1s6.62,2.48,7.01,5.1H4.99z M9,10c0-1.65,1.35-3,3-3s3,1.35,3,3 c0,1.65-1.35,3-3,3S9,11.65,9,10z M12.72,13.93C14.58,13.59,16,11.96,16,10c0-2.21-1.79-4-4-4c-2.21,0-4,1.79-4,4 c0,1.96,1.42,3.59,3.28,3.93c-4.42,0.25-6.84,2.8-7.28,6V4h16v15.93C19.56,16.73,17.14,14.18,12.72,13.93z"></path>
  </svg></div>`;

  // Hide 'Your channel' button from the sidebar
  waitForElement('#contentContainer #endpoint[title="Your channel"]').then((yourChannelButton) => {
    yourChannelButton.parentNode.style.display = "none";
  });

  // Observe when Icon Dropdown changes
  const observer = new MutationObserver((mutations) => {
    const intervalId = setInterval(async () => {
      // Find 'Google Account' Button
      var googleAccountButton = await waitForElement('tp-yt-iron-dropdown #sections yt-multi-page-menu-section-renderer:nth-child(1) #endpoint:nth-child(1)');

      // Copy 'Google Account Button' to make sure it doesn't get too modified again
      if (!googleAccountButton.parentNode.hasAttribute('cloned')) {
        const newFullGoogleAccountButton = googleAccountButton.parentNode.cloneNode(true);
        const newGoogleAccountButton = newFullGoogleAccountButton.querySelector('#endpoint');
        newFullGoogleAccountButton.setAttribute('cloned', '');
        newFullGoogleAccountButton.setAttribute('prevHref', googleAccountButton.href);
        googleAccountButton.parentNode.parentNode.replaceChild(newFullGoogleAccountButton, googleAccountButton.parentNode);
        googleAccountButton = await waitForElement('tp-yt-iron-dropdown #sections yt-multi-page-menu-section-renderer:nth-child(1) #endpoint:nth-child(1)');
      }

      // Find 'View your channel' Button, Get the Channel URL, and replace it with 'Manage your Google Account'
      var viewYourChannelButton = await waitForElement('#channel-container #manage-account a:nth-child(1)');
      const channelUrl = viewYourChannelButton.hasAttribute('prevHref') ? viewYourChannelButton.getAttribute('prevHref') : viewYourChannelButton.href;
      viewYourChannelButton.setAttribute('prevHref', channelUrl);

      if (!viewYourChannelButton.parentNode.hasAttribute('cloned')) {
        const clonedViewYourChannelButton = viewYourChannelButton.cloneNode(true);
        clonedViewYourChannelButton.setAttribute('cloned', '');
        viewYourChannelButton.parentNode.replaceChild(clonedViewYourChannelButton, viewYourChannelButton);
        viewYourChannelButton = await waitForElement('#channel-container #manage-account a:nth-child(1)');
      }

      viewYourChannelButton.innerHTML = "Manage your Google Account";
      viewYourChannelButton.href = googleAccountButton.parentNode.getAttribute('prevHref');
      viewYourChannelButton.target = "_blank";

      // 'Google Account' Button Icons and Labels
      const googleAccountIcon = googleAccountButton.querySelector('#content-icon yt-icon');
      const googleAccountLabel = googleAccountButton.querySelector('#primary-text-container #label .yt-formatted-string');

      // Put things onto the copied 'Google Account' Button
      googleAccountButton.href = channelUrl;
      googleAccountButton.tabIndex = -1;
      googleAccountButton.dir = "auto";
      googleAccountLabel.innerHTML = "Your channel";
      googleAccountIcon.innerHTML = channelIcon;

      // Move 'YouTube Studio' Button below 'Your channel' Button
      const youTubeStudioButton = document.querySelector('tp-yt-iron-dropdown #endpoint[href^="https://studio.youtube.com"]');
      if (youTubeStudioButton) {
        insertAfter(youTubeStudioButton.parentNode, googleAccountButton.parentNode);
      }

      // Clear Interval so it doesn't run forever!
      clearInterval(intervalId);
    }, 100);
  });

  observer.observe((await waitForElement('#contentWrapper ytd-multi-page-menu-renderer #container')), {
    attributes: true,
  });
})();
