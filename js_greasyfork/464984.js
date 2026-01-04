// ==UserScript==
// @name         したらば削除サポーターレス管理画面用　同ホスト名/IDまとめてチェック
// @version      0.6
// @description  削除サポーター用レス管理画面で、レスのホスト名またはIDをクリックすると、ページ内にある同じホスト名/IDのレスのチェックボックスにチェックが入ります。
// @author       ura
// @license      MIT
// @match        https://cms.jbbs.shitaraba.net/*/*/delete/thread?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shitaraba.net
// @grant        none
// @namespace https://greasyfork.org/users/1068919
// @downloadURL https://update.greasyfork.org/scripts/464984/%E3%81%97%E3%81%9F%E3%82%89%E3%81%B0%E5%89%8A%E9%99%A4%E3%82%B5%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%BC%E3%83%AC%E3%82%B9%E7%AE%A1%E7%90%86%E7%94%BB%E9%9D%A2%E7%94%A8%E3%80%80%E5%90%8C%E3%83%9B%E3%82%B9%E3%83%88%E5%90%8DID%E3%81%BE%E3%81%A8%E3%82%81%E3%81%A6%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/464984/%E3%81%97%E3%81%9F%E3%82%89%E3%81%B0%E5%89%8A%E9%99%A4%E3%82%B5%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%BC%E3%83%AC%E3%82%B9%E7%AE%A1%E7%90%86%E7%94%BB%E9%9D%A2%E7%94%A8%E3%80%80%E5%90%8C%E3%83%9B%E3%82%B9%E3%83%88%E5%90%8DID%E3%81%BE%E3%81%A8%E3%82%81%E3%81%A6%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 各レスのID要素を取得
    const resIDs = Array.from(document.querySelectorAll('form .table-basic .small:last-child'))
  .filter((resID) => resID.textContent.includes('ID:'));

    // 各レスのID要素にクリックイベントを追加
    resIDs.forEach((resID) => {
      resID.addEventListener('click', () => {
        // クリックされたID要素からIDを取得
        const clickedResID = resID.textContent;

        //取得したIDと同じIDからのレスのチェックボックスを取得
        resIDs.forEach((resID) => {
          if (resID.textContent === clickedResID) {
            const checkbox = resID.closest('tr').querySelector('.check_single');
              // チェックボックスがnull(=1レス目または削除済で存在せず)以外の時、チェックを入れる
              if (checkbox) {
                  checkbox.checked = true;
              }
          }
        });
      });
    });

    // 各レスのホスト名要素を取得
    const hostnames = document.querySelectorAll('form .table-basic .small strong');

    // 各レスのホスト名要素にクリックイベントを追加
    hostnames.forEach((hostname) => {
      hostname.addEventListener('click', () => {
        // クリックされたホスト名要素からホスト名を取得
        const clickedHostname = hostname.textContent;

        //取得したホスト名と同じホスト名からのレスのチェックボックスを取得
        hostnames.forEach((hostname) => {
          if (hostname.textContent === clickedHostname) {
            const checkbox = hostname.closest('tr').querySelector('.check_single');
              // チェックボックスがnull(=1レス目または削除済で存在せず)以外の時、チェックを入れる
              if (checkbox) {
                  checkbox.checked = true;
              }
          }
        });
      });
    });
})();