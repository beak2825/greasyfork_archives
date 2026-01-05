// ==UserScript==
// @name        Pocket-goto-Original
// @namespace   garyli.rocks
// @description Opens the original link instead of the pocket View! (please use Ctrl+click)
// @include     http://getpocket.com/my-list*
// @include     https://getpocket.com/my-list*
// @version     2.0
// @downloadURL https://update.greasyfork.org/scripts/21411/Pocket-goto-Original.user.js
// @updateURL https://update.greasyfork.org/scripts/21411/Pocket-goto-Original.meta.js
// ==/UserScript==

(function (window) {
  'use strict';

  // add a new class for original link
  const customStyle = document.createElement('style');
  customStyle.innerText = `
    a.__original_link {
        text-decoration: none;
    }

    a.__original_link:hover {
      text-decoration: none !important;
    }

    a.__original_link h2::before {
      margin-right: .2em;
      padding: .2em;
      padding-left: 0;
      content: '○';
      position: relative;
      top: -1px;
    }

    a.__original_link:hover h2::before {
      content: '●';
    }
  `;
  document.querySelector('head').appendChild(customStyle);

  function addOriginalLinks() {
    console.log('Add original links');

    const allItems = window.__NEXT_REDUX_WRAPPER_STORE__.getState()
      .myListItemsById;

    // wrap title in an <a> element with original url
    document
      .querySelectorAll('article[data-cy^=article-card-]')
      .forEach(function (e) {
        if (e.dataset['original_link_added']) {
          return;
        }

        const itemId = e.dataset['cy'].replace(/article-card-(\d+)/, '$1');

        if (allItems[itemId]) {
          const originalUrl = allItems[itemId]['save_url'];
          const originalLink = document.createElement('a');
          originalLink.href = originalUrl;
          originalLink.classList.add('__original_link');
          originalLink.append(e.querySelector('h2'));
          e.querySelector('.content').prepend(originalLink);
        }

        e.dataset['original_link_added'] = 'true';
      });
  }

  let prevList;

  const getListNode = () => {
    return document.querySelector('.main header + div');
  };

  const config = { subtree: true, childList: true };

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      addOriginalLinks();
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  const checkList = setInterval(function () {
    const newList = getListNode();
    if (newList !== prevList) {
      if (observer) {
        observer.disconnect();
      }

      if (newList) {
        console.log('A new list loaded');
        prevList = newList;
        addOriginalLinks();

        // Start observing the target node for configured mutations
        observer.observe(prevList, config);
      } else {
        console.log('waiting');
      }
    }
  }, 1000);
})(window.unsafeWindow);

