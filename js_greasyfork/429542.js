// ==UserScript==
// @name         Spotify - Add label search link
// @description  add label search link
// @author       to
// @namespace    https://github.com/to
// @version      0.1
// @license      MIT
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?domain=spotify.com
// @downloadURL https://update.greasyfork.org/scripts/429542/Spotify%20-%20Add%20label%20search%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/429542/Spotify%20-%20Add%20label%20search%20link.meta.js
// ==/UserScript==

// ページ遷移を監視する
function watchLocation(match, callback) {
  let page;
  setInterval(() => {
    // ページ遷移が発生したか？
    if (page != location.href) {
      page = location.href;

      // 対象のページか？
      if (match.test(page))
        callback(page);
    }
  }, 500);
}

watchLocation(/\/album\//, () => {
  // DOMへの反映を待つ
  let timer = setInterval(() => {
    // 権利表記を繰り返す
    let pre;
    [...document.querySelectorAll('div[aria-colcount] + div p')].map(elmRight => {
      // 表記をクリアする
      let right = elmRight.textContent.replaceAll(/(\℗ |© |(\(P\))?\d{4} )/g, '');
      elmRight.innerHTML = '';

      // 同一の内容の場合、省略する
      if (pre == right) return;
      pre = right

      // 各権利者を繰り返す
      right.split(/ ?\/ ?/).map((label, i) => {
        i && elmRight.appendChild(document.createTextNode(" / "));

        // 検索リンクを追加する
        let elmLink = document.createElement('a');
        elmLink.href = `https://open.spotify.com/search/label:"${label}"`;
        elmLink.target = '_blank';
        elmLink.textContent = label;

        elmRight.appendChild(elmLink);
      });

      // 反映の監視を終了する(重複クリアは許容する)
      clearInterval(timer);
    });
  }, 100);
});