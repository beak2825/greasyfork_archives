// ==UserScript==
// @name         cytube_validate_url
// @namespace    https://cytube.xyz/
// @version      0.3
// @description  cytubeに独自のURLチェックを追加します
// @author       utubo
// @match        *://cytube.xyz/*
// @match        *://cytube.mm428.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406900/cytube_validate_url.user.js
// @updateURL https://update.greasyfork.org/scripts/406900/cytube_validate_url.meta.js
// ==/UserScript==

(window.unsafeWindow || window).eval(` // チャンネルのJSに設定するときはこの行(と最後の行)を削除
(function() {
  // 設定 ------------------------------------
  var BAD_URLS = [
    { startsWith:'https://www.nicovideo.jp/watch/nm', msg:'ニコニコ動画の動画IDが"nm～～"で始まるURLは未対応です。' },
    { startsWith:'URLがこれで始まってたらNG', msg:'サンプル1' },
    { regex:/URLがこの正規表現にマッチしたらNG/, msg:'サンプル2' }
  ];
  // 本体 ------------------------------------
  // 2重起動されたら前のはクリア
  var win = (window.unsafeWindow || window);
  if (win.BAD_URLS_HANDLER) {
    win.document.body.removeEventListener(win.BAD_URLS_HANDLER);
  }
  // ここからメイン
  var toHttps = url => url.replace('http://', 'https://');
  win.BAD_URLS_HANDLER = e => {
    if (!e.target) return;
    if (e.target.id !== 'queue_next' && e.target.id !== 'queue_end') return;
    var url = toHttps(document.getElementById('mediaurl').value);
    for (var badURL of BAD_URLS) {
      if (badURL.startsWith && url.startsWith(toHttps(badURL.startsWith)) || badURL.regex && url.match(badURL.regex)) {
        queueMessage({ msg: badURL.msg }, 'alert-danger');
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  };
  win.document.body.addEventListener('click', win.BAD_URLS_HANDLER, true);
})();
`); // チャンネルのJSに設定するときはこの行も削除