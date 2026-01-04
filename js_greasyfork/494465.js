// ==UserScript==
// @name         X from search
// @namespace    https://spfx.jp/
// @version      2024-05-18
// @license      MIT
// @description  Web版Xのユーザープロフ画面にその人の発言(from:@[screenname])を検索する窓を追加
// @author       https://spfx.jp/
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494465/X%20from%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/494465/X%20from%20search.meta.js
// ==/UserScript==

(function() {
  'use strict';
  setInterval(() => {
    const userActions = document.querySelector('button[data-testid="userActions"');
    if (! userActions) {
      return;
    }

    let screenName = document.body.innerHTML.match(/<span[^>]+>(@.*?)<\/span>/)[1];
    const searchInput = document.getElementById('from-search-input');

    if (searchInput) {
      if (searchInput.value.includes(screenName)) {
        return;
      } else {
        searchInput.value = `from:${screenName} `;
        return;
      }
    }

    const searchDiv = document.createElement('div');
    searchDiv.setAttribute('style', 'margin: 1rem;');
    searchDiv.innerHTML = `<form action="/search"><input id="from-search-input" type="text" name="q" value="from:${screenName} "></form>`;
    userActions.parentNode.insertBefore(searchDiv, userActions);

    // NOTE: return後なのでsearchInputは使い回せない
    document.getElementById('from-search-input').addEventListener('focus', function() {
      const length = this.value.length;
      this.setSelectionRange(length, length);
    });

  }, 500);
})();