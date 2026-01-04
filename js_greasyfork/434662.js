// ==UserScript==
// @name         巴哈瀏覽作者同版發文
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在巴哈右鍵點擊發文者連結，瀏覽作者同版發文
// @author       Rplus
// @match        https://m.gamer.com.tw/forum/*.php?*
// @match        https://forum.gamer.com.tw/*.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434662/%E5%B7%B4%E5%93%88%E7%80%8F%E8%A6%BD%E4%BD%9C%E8%80%85%E5%90%8C%E7%89%88%E7%99%BC%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/434662/%E5%B7%B4%E5%93%88%E7%80%8F%E8%A6%BD%E4%BD%9C%E8%80%85%E5%90%8C%E7%89%88%E7%99%BC%E6%96%87.meta.js
// ==/UserScript==

(function() {
  let isMobile = !/forum/.test(location.host);
  let bsn = new URLSearchParams(location.search)?.get('bsn');
  function getUid(a) {
    if (!a) { return false; }

    if (isMobile) {
      // https://m.gamer.com.tw/home/home.php?owner=***
      return (new URLSearchParams(a.search))?.get('owner');
    } else {
      // .userid
      // .username
      // .reply-content__user
      // https://home.gamer.com.tw/***
      if (a.matches('.userid, .username, .reply-content__user')) {
        return a.href.replace('https://home.gamer.com.tw/', '');
      }
      return false;
    }
  }

  document.body.addEventListener('contextmenu', e => {
    let a = e.target.closest('a');
    let uid = getUid(a);
    if (bsn && uid) {
      const url = `https://forum.gamer.com.tw/Bo.php?bsn=${bsn}&qt=6&q=${uid}`;
      const ans = window.confirm(`Go to ${url}?`);
      if (ans) {
        e.preventDefault();
        window.open(url, null, 'noopener,noreferrer');
      }
    }
  })
})();