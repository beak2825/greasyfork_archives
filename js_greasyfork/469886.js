// ==UserScript==
// @name         三男でIDコピー
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  三男掲示板で名前欄をクリック時にIDをコピーする
// @author       sasakinchu
// @match        https://*.sannan.nl/**
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469886/%E4%B8%89%E7%94%B7%E3%81%A7ID%E3%82%B3%E3%83%94%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/469886/%E4%B8%89%E7%94%B7%E3%81%A7ID%E3%82%B3%E3%83%94%E3%83%BC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ページ内のすべての <dt> タグを取得
  const dtTags = document.getElementsByTagName("dt");

  // ページ内のすべての <dt> タグに対してイベントリスナーを設定
  for (let i = 0; i < dtTags.length; i++) {
    const dtTag = dtTags[i];

    // <dt> タグ内のテキストを取得
    const dtText = dtTag.textContent;

    // IDを含むテキストを正規表現で検索
    const idMatch = dtText.match(/ID:([^\s]+)/);

    // 【忍法帖ID:...】を含むテキストを正規表現で検索
    // const ninpouMatch = dtText.match(/【忍法帖ID:([^\]]+)】/);
    const ninpouMatch = dtText.match(/【忍法帖ID:([^】]+)】/);

    if (ninpouMatch) {
      // 忍法帖IDが見つかった場合の処理を追加
      const idText = ninpouMatch[1]; // 【忍法帖ID:...】からID部分のテキストを抽出

      // <dt> タグにクリックイベントリスナーを追加
      dtTag.addEventListener("click", function () {
        GM_setClipboard(idText);
      });
    } else if (idMatch) {
      // IDが見つかった場合の処理を追加
      const idText = "ID:" + idMatch[1]; // "ID:" を含めた完全なIDのテキスト

      // <dt> タグにクリックイベントリスナーを追加
      dtTag.addEventListener("click", function () {
        GM_setClipboard(idText);
      });
    }
  }
})();
