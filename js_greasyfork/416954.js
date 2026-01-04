// ==UserScript==
// @name        YouTubeの検索バーを自動でクリアする
// @description YouTubeの検索バーを自動でクリアする。
// @match       *://www.youtube.com/*
// @author      toshi (https://github.com/k08045kk)
// @license     MIT License
// @see         https://opensource.org/licenses/MIT
// @version     2.0
// @since       1.20201128 - 初版
// @since       2.20220126 - fix 検索文字が残ることがある
// @grant       none
// @namespace https://www.bugbugnow.net/
// @downloadURL https://update.greasyfork.org/scripts/416954/YouTube%E3%81%AE%E6%A4%9C%E7%B4%A2%E3%83%90%E3%83%BC%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E3%82%AF%E3%83%AA%E3%82%A2%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/416954/YouTube%E3%81%AE%E6%A4%9C%E7%B4%A2%E3%83%90%E3%83%BC%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E3%82%AF%E3%83%AA%E3%82%A2%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==
 
(function() {
  let href = location.href;
  setInterval(() => {
    if (href != location.href) {
      if (location.pathname != '/results') {
        //console.log('YouTube search bar clear.');
        document.querySelector('#search.ytd-searchbox').value = '';
      }
      href = location.href;
    }
  }, 500);
})();