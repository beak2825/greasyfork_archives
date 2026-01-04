// ==UserScript==
// @name         Get Link Coursera
// @namespace    https://github.com/DemonDucky
// @version      1.0.4
// @description  Get link Coursera peer review
// @author       DemonDucky
// @match        https://www.coursera.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coursera.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484796/Get%20Link%20Coursera.user.js
// @updateURL https://update.greasyfork.org/scripts/484796/Get%20Link%20Coursera.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const getLink = () => {
    const id = document
      .querySelector('.cds-formControl-root textarea[aria-label="Enter Peer Review comments"]')
      .getAttribute('id')
      .replace('~comment', '');

    const getLinkButton = document.querySelector('#special-getlink-button-demonducky');

    const oldText = getLinkButton.innerText;

    getLinkButton.innerText = 'Copied <3';

    getLinkButton.disabled = true;
    setTimeout(() => {
      getLinkButton.innerText = oldText;
      getLinkButton.disabled = false;
    }, 800);

    const url = window.location.href;
    const index = url.lastIndexOf('submit');
    const removedURL = url.slice(0, index);

    const reviewLink = `${removedURL}review/${id}`;

    navigator.clipboard.writeText(reviewLink);
  };

  const config = { attributes: false, childList: true, subtree: true };

  const observerHandler = () => {
    const buttonContainer = document.querySelector('.rc-PeerSubmissionWithReviewsBody')?.children[1];

    if (!buttonContainer) return;
    if (document.querySelector('#special-getlink-button-demonducky')) return;

    buttonContainer.style.justifyContent = 'space-around';

    const getLinkButton = document.createElement('button');
    const textContainer = document.createElement('span');

    getLinkButton.className = `${getLinkButton.className} cds-105 cds-button-disableElevation cds-button-secondary css-172qoqz`;

    getLinkButton.id = 'special-getlink-button-demonducky';
    getLinkButton.setAttribute('type', 'button');

    getLinkButton.addEventListener('click', getLink);

    textContainer.className = `${textContainer.className} cds-button-label`;
    textContainer.innerText = 'Get Link Review =))';

    getLinkButton.insertAdjacentElement('beforeend', textContainer);
    buttonContainer.insertAdjacentElement('afterbegin', getLinkButton);
  };
  const mutationObserver = new MutationObserver(observerHandler);

  const loadHandler = () => {
    const body = document.querySelector('#rendered-content');
    console.log(body);
    mutationObserver.observe(body, config);
  };

  window.addEventListener('load', loadHandler);
})();
