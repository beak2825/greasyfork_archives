// ==UserScript==
// @name            Check Constraints
// @name:ja         制約をチェックする
// @description     Add checkboxes to constraints of an AtCoder problem.
// @description:ja  AtCoderの問題ページの制約にチェックボックスを追加します。
// @version         1.0.1
// @icon            https://www.google.com/s2/favicons?domain=atcoder.jp
// @author          w0mbat
// @match           https://atcoder.jp/contests/*/tasks/*
// @grant           GM_addStyle
// @namespace https://greasyfork.org/users/754798
// @downloadURL https://update.greasyfork.org/scripts/434715/Check%20Constraints.user.js
// @updateURL https://update.greasyfork.org/scripts/434715/Check%20Constraints.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log('😼＜「制約をチェックする」を実行します。');
  if (location.href.replace(/\?.*$/, '').endsWith('/editorial')) {
    console.log('😼＜ 問題ページではなさそうなので、実行するのをやめます。');
    return;
  }

  async function addStyle(src) {
    return new Promise((resolve) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = src;
      document.getElementsByTagName("head")[0].appendChild(link);
    });
  }
  addStyle('https://cdn.jsdelivr.net/npm/pretty-checkbox@3.0/dist/pretty-checkbox.min.css');
  addStyle('https://cdn.jsdelivr.net/npm/@mdi/font@6.4.95/css/materialdesignicons.min.css');
  GM_addStyle(`
    .pretty.p-icon .state .icon { top: calc(((100% - 1em) - 2px) / 3) !important }
    .pretty .state label:after,.pretty .state label:before { top: calc(((100% - 1em) - 2px) / 3) !important }
  `);

  function* getConstraintsSections() {
    // <h3>制約</h3>を子要素に持つsectionを取得
    for (const section of document.getElementsByTagName('section')) {
      for (const child of section.children) {
        if (child.tagName.toLowerCase() !== 'h3') continue;
        const text = child.textContent;
        if (text === '制約' || text === 'Constraints') yield section;
      }
    }
  }

  function createCheckBox() {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    return checkbox;
  }

  /**
   * @param {HTMLLIElement} li
   */
  function insertCheckBox(li) {
    // https://lokesh-coder.github.io/pretty-checkbox/
    const div = document.createElement('div');
    div.className = 'pretty p-icon p-round p-pulse';
    div.appendChild(createCheckBox());
    const state = div.appendChild(document.createElement('div'));
    state.className = 'state p-success';
    const icon = state.appendChild(document.createElement('i'));
    icon.className = 'icon mdi mdi-check';
    const label = state.appendChild(document.createElement('label'));
    [...li.childNodes].forEach(e => label.appendChild(e));
    li.appendChild(div);
    li.style.listStyleType = 'none';
  }

  for (const section of getConstraintsSections()) {
    const ul = [...section.getElementsByTagName('ul')].shift();
    if (ul) {
      ul.style.paddingLeft = '1em';
      [...ul.querySelectorAll('li')].forEach(li => insertCheckBox(li));
    }
  }

  console.log('😼＜「制約をチェックする」を実行しました。');
})();
