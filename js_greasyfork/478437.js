// ==UserScript==
// @name         Trello cards count
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Show the quantity of cards in the list.
// @author       Grégory M. Esberci
// @match        https://trello.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trello.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478437/Trello%20cards%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/478437/Trello%20cards%20count.meta.js
// ==/UserScript==

(function () {
  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        func(args);
      }, timeout);
    };
  }

  const setQuantity = (listWrapper) => {
    const className = 'trello-cards-count quiet';

    const header = listWrapper.querySelector('[data-testid=list-header] > div');
    const list = listWrapper.querySelector('[data-testid=list-cards]');

    const content = `${list.querySelectorAll('[data-testid=list-card]').length} cards`;

    let element = header.getElementsByClassName(className)[0];

    if (list.hidden) {
      if (element) element.remove();
      return;
    }

    if (!element) {
      element = document.createElement('p');

      element.className = className;
      element.style = 'padding: 0 12px';
    }

    if (content !== element.textContent) {
      element.textContent = content;
    }

    if (!header.contains(element)) {
      header.append(element);
    }
  };

  const observer = new MutationObserver(
    debounce((changes) => {
      document
        .querySelectorAll('[data-testid=list-wrapper]')
        .forEach(setQuantity);
    }, 30)
  );

  observer.observe(document.body, { childList: true, subtree: true });
})();
