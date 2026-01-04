// ==UserScript==
// @name         Mastodon img Zoom Fix and Auto-Close
// @description  Replace zoomable image with clone and close modal on click
// @match        https://mastodon.social/*
// @run-at       document-idle
// @version 0.0.1.20251129171913
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/537070/Mastodon%20img%20Zoom%20Fix%20and%20Auto-Close.user.js
// @updateURL https://update.greasyfork.org/scripts/537070/Mastodon%20img%20Zoom%20Fix%20and%20Auto-Close.meta.js
// ==/UserScript==

const observer = new MutationObserver(() => {

  //callback function

  const oldElement = document.querySelector('.zoomable-image img');

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

if (document.querySelector('.zoomable-image img')) {
  document.querySelector('.zoomable-image img')
    .addEventListener('click', () => {
      document.querySelector('.media-modal__buttons .icon-button[title="Close"]').click();
    });

}