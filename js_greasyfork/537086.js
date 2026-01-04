// ==UserScript==
// @name         Mastodon vid
// @description  Replace zoomable vid with clone and close modal on click
// @match        https://mastodon.social/*
// @run-at       document-idle
// @version 0.0.1.20251129172031
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/537086/Mastodon%20vid.user.js
// @updateURL https://update.greasyfork.org/scripts/537086/Mastodon%20vid.meta.js
// ==/UserScript==

const observer = new MutationObserver(() => {
  const oldElement = document.querySelector('.gifv video');

  if (oldElement && !oldElement.dataset.replaced) {
    const newElement = oldElement.cloneNode(true); // deep clone
    newElement.dataset.replaced = 'true'; // mark the new one
    oldElement.parentNode.replaceChild(newElement, oldElement);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

if (document.querySelector('.gifv video')) {
  document.querySelector('.gifv video')
    .addEventListener('click', () => {
      document.querySelector('.media-modal__buttons .icon-button[title="Close"]').click();
    });

}