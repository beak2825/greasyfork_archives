// ==UserScript==
// @name         Show trello card number
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Show the card number in the card title.
// @author       Grégory M. Esberci
// @match        https://trello.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trello.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478430/Show%20trello%20card%20number.user.js
// @updateURL https://update.greasyfork.org/scripts/478430/Show%20trello%20card%20number.meta.js
// ==/UserScript==

(function () {
  const debounce = (func, timeout) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        func(args);
      }, timeout);
    };
  };

  const getCardNumber = (url) => url.split('/').pop().split('-')[0];

  const setNumberInCard = (card) => {
    const titleClassName = 'show-trello-card-number-card-title';
    const title = card.querySelector('[data-testid=card-name]');
    const cardNumber = getCardNumber(title.href);
    const content = `(${cardNumber}) `;

    let cardNumberElement = title.getElementsByClassName(titleClassName)[0];

    if (!cardNumberElement) {
      cardNumberElement = document.createElement('b');
      cardNumberElement.className = titleClassName;
    }

    if (content !== cardNumberElement.textContent) {
      cardNumberElement.textContent = content;
    }

    if (!title.contains(cardNumberElement)) {
      title.prepend(cardNumberElement);
    }
  };

  const setNumberInModalTitle = (title) => {
    const titleClassName = 'show-trello-card-number-modal-title quiet';
    const cardNumber = getCardNumber(location.href);

    if (!isFinite(cardNumber)) return;

    const content = `#${cardNumber}`;

    let cardNumberElement = title.parentNode.getElementsByClassName(titleClassName)[0];

    if (!cardNumberElement) {
      cardNumberElement = document.createElement('h2');
      cardNumberElement.className = titleClassName;
    }

    if (content !== cardNumberElement.textContent) {
      cardNumberElement.textContent = `#${cardNumber}`;
    }

    if (!title.parentNode.contains(cardNumberElement)) {
      title.parentNode.prepend(cardNumberElement);
    }
  };

  const observer = new MutationObserver(
    debounce(() => {
      document
        .querySelectorAll('[data-testid=trello-card]:not(:has(.custom-card-title))')
        .forEach(setNumberInCard);

      const modalTitle = document.querySelector('[data-testid=card-back-title-input]');

      if (modalTitle) setNumberInModalTitle(modalTitle);
    }, 30)
  );

  observer.observe(document.body, { childList: true, subtree: true });
})();
