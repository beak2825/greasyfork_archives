// ==UserScript==
// @name                  LastFM: History Cleanup
// @name:ru               LastFM: Очистка истории
// @description           You can easily remove unwanted plays from your listening history
// @description:ru        Позволяет легко удалять нежелательные воспроизведения из истории прослушивания
// @namespace             lastfm-chartlist-cleanup
// @version               0.2.0
// @license               WTFPL
// @author                askornot
// @match                 https://www.last.fm/*
// @grant                 unsafeWindow
// @homepageURL           https://greasyfork.org/ru/scripts/479773-lastfm-history-cleanup/
// @supportURL            https://greasyfork.org/ru/scripts/479773-lastfm-history-cleanup/feedback
// @compatible            chrome  Violentmonkey 2.31.0
// @compatible            firefox Violentmonkey 2.31.0
// @compatible            firefox Greasemonkey 4.11
// @downloadURL https://update.greasyfork.org/scripts/479773/LastFM%3A%20History%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/479773/LastFM%3A%20History%20Cleanup.meta.js
// ==/UserScript==

!(function (W, D) {
  'use strict';

  const HASH = '?_pjax=%23content';

  const clone = function (row) {
    const love = row.querySelector('.chartlist-loved div');
    const remove = row.querySelector('li:nth-child(7) form');
    if (love === null || remove === null) return;
    const a = love.cloneNode(true);
    const b = remove.cloneNode(true);
    const text = b.lastElementChild.textContent;
    if (text) {
      b.lastElementChild.title = text.trim();
      b.lastElementChild.textContent = '';
    }
    while (a.attributes.length > 0) {
      a.removeAttribute(a.attributes[0].name);
    }
    b.lastElementChild.style.background = 'transparent';
    a.replaceChild(b, a.lastElementChild);
    row.insertBefore(a, row.lastElementChild);
  };

  const content = {
    'text/html; charset=utf-8': function (id, fn) {
      return Object.assign(D.createElement('script'), {
        id: id,
        textContent: `document.querySelectorAll('.chartlist-row')
        .forEach(Function('row', \`return ${fn.toString()}\`)());
        document.scripts.namedItem(${id}).remove();`,
      }).outerHTML;
    },
  };

  const responseText = Object.getOwnPropertyDescriptor(
    XMLHttpRequest.prototype,
    'responseText',
  );
  Object.defineProperty(W.XMLHttpRequest.prototype, 'responseText', {
    get() {
      const res = responseText.get.apply(this, arguments);
      if (this.readyState === W.XMLHttpRequest.DONE) {
        if ((this.responseURL || '').endsWith(HASH)) {
          const type = this.getResponseHeader('content-type');
          if (type === null) return res;
          const fn = content[type];
          if (fn) return res + fn(W.Math.random(), clone);
        }
      }
      return res;
    },
  });

  D.querySelectorAll('.chartlist-row').forEach(clone);
})(unsafeWindow || window, document);
