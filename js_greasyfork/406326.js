// ==UserScript==
// @name         Change toot visibility with Shift+Enter
// @namespace    http://github.com/heguro
// @version      1.0.0
// @description  Shift+Enter でトゥートの公開範囲変更
// @author       heguro / あすとら
// @match        https://mastodon.cloud/*
// @match        https://pawoo.net/*
// @match        https://mstdn.jp/*
// @match        https://best-friends.chat/*
// @match        https://fedibird.com/*
// @match        https://mastodon.social/*
// @match        https://odakyu.app/*
// @license       MIT License
// @downloadURL https://update.greasyfork.org/scripts/406326/Change%20toot%20visibility%20with%20Shift%2BEnter.user.js
// @updateURL https://update.greasyfork.org/scripts/406326/Change%20toot%20visibility%20with%20Shift%2BEnter.meta.js
// ==/UserScript==

// refered some codes from Quaternary Toot Button by nzws: https://greasyfork.org/ja/scripts/382929-quaternary-toot-button

window.addEventListener('load', () => {
  const keyDownListener = ev => {
    if (ev.key === 'Enter' && ev.shiftKey) {
      ev.preventDefault();
      document.getElementsByClassName('privacy-dropdown__value-icon')[0].click();
      const visibilities = Array.from(document.getElementsByClassName('privacy-dropdown__option'));
      const oldActive = visibilities.findIndex(elm => elm.classList.contains('active'));
      const newActive = (oldActive + 1 < visibilities.length) ? oldActive + 1 : 0;
      visibilities[newActive].click();
      ev.target.focus();
    }
  };
  Array.from(document.querySelectorAll('.compose-form textarea')).forEach(area => {
    area.addEventListener('keydown', keyDownListener);
  });
});
