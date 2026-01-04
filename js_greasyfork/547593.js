// ==UserScript==
// @name        Amazonの検索ワード自動補正を自動で遠慮
// @description 実験的
// @match       https://www.amazon.co.jp/*
// @version     0.1
// @run-at      document-end
// @grant       none
// @grant       GM_setValue
// @grant       GM_getValue
// @noframes
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/547593/Amazon%E3%81%AE%E6%A4%9C%E7%B4%A2%E3%83%AF%E3%83%BC%E3%83%89%E8%87%AA%E5%8B%95%E8%A3%9C%E6%AD%A3%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E9%81%A0%E6%85%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/547593/Amazon%E3%81%AE%E6%A4%9C%E7%B4%A2%E3%83%AF%E3%83%BC%E3%83%89%E8%87%AA%E5%8B%95%E8%A3%9C%E6%AD%A3%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E9%81%A0%E6%85%AE.meta.js
// ==/UserScript==

(function() {
  fix();
  let lasthref = location.href;
  new MutationObserver(mut => lasthref != location.href ? ((lasthref = location.href), fix()) : 0).observe(document, { childList: true, subtree: true });

  function fix() {
    if (Date.now() - (GM_getValue("latest") || 0) < 10000) {
      setTimeout(fix, 100);
    } else {
      if ((lh(/https:\/\/www\.amazon\.co\.jp\/s\?k\=/) && !lh('\&dc')) && /の結果を表示しています/.test(document?.body?.textContent) && /のすべての結果を表示します/.test(document?.body?.textContent)) {
        GM_setValue("latest", Date.now())
        document.body.insertAdjacentHTML(`afterbegin`, `<div id="antendiv" style='position:fixed;top:0;left:0;width:100%;height:100%;background:#0000;z-index:2147483647;transition:background 1s'></div>`);
        requestAnimationFrame(() => { document.querySelector('#antendiv').style.background = '#0008' });
        location.href = location.href + '&dc';
      }
    }
  }

  function lh(re) { let tmp = location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
})();
