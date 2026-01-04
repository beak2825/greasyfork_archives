// ==UserScript==
// @name                RFI direct media links
// @namespace           https://greasyfork.org/users/1129435
// @version             1.0.1
// @description         Adds direct links to media sources under players on RFI site
// @description:ru      Добавляет прямые ссылки на медиаисточники под плеерами на сайте RFI
// @copyright           2023 sha512:e5ca548d21f145140a0cd0e4f9835c768807ae58f546796644704c0b426485210f81984b81a271a726d56e4baff4232fa642efc4b60a1abc905e46900b521d4f
// @license             MPL-2.0
// @icon                https://www.google.com/s2/favicons?sz=64&domain=www.rfi.fr
// @match               https://www.rfi.fr/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/473828/RFI%20direct%20media%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/473828/RFI%20direct%20media%20links.meta.js
// ==/UserScript==

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

(function () {
  'use strict';

  let style = document.createElement('style');
  style.textContent = `\
    .source-links > a {
      margin-right: 2ex;
    }
    .source-links::before {
      content: '🔗';
    }
  `;
  document.body.append(style);

  /**
   * @param {Document | HTMLElement} articleElement
   */
  function addSourceLinks(articleElement = document) {
    let mediaList = articleElement.querySelectorAll('script[type="application/json"]');

    for (let media of mediaList) {
      try {
        let sources = JSON.parse(media.textContent).sources;
        if (!(sources && sources.length)) continue;

        let sourceLinks = document.createElement('div');
        sourceLinks.classList.add('source-links');
        media.parentElement.append(sourceLinks);

        for (let source of sources) {
          let link = document.createElement('a');
          link.textContent = '💾';
          link.href = source.url;
          sourceLinks.append(link);
        }
      } catch (err) { }
    }
  }

  let observer = new MutationObserver(mutations => {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (node instanceof HTMLElement) {
          if (node.id === 'main-content') {
            addSourceLinks(node); // when go to another RFI page
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  addSourceLinks(); // init
})();
