// ==UserScript==
// @name         qiita-hide-noisy-sections
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  qiita の見た目をシンプルにします
// @author
// @match       https://qiita.com/*/items/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509771/qiita-hide-noisy-sections.user.js
// @updateURL https://update.greasyfork.org/scripts/509771/qiita-hide-noisy-sections.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // うるさいポップアップや項目を非表示に
  document.head.insertAdjacentHTML(
    "beforeend",
    `
<style>
  [data-testid^="popup-"]{ display: none !important; }
  div.coins-optin-dialog{ display: none !important; }
</style>
`
  );

  // うるさいセクションを非表示に
  var removeSections = function () {
    const noisy_sections = Array.from(document.querySelectorAll("h2")).find(
      (el) =>
        el.textContent.includes("今日のトレンド") ||
        el.textContent.includes("キャンペーン開催中") ||
        el.textContent.includes("ピックアップ記事")

    );
    if (!!noisy_sections) {
      noisy_sections.closest("section").remove();
    }
    //コメントより後のセクションは削除
     const commentsNode=document.getElementById("comments");
     if(commentsNode){
         const noisy_=[];
         let section=commentsNode.parentNode.nextSibling;
         while(section){
             noisy_.push(section);
             section=section.nextSibling;
         }
         noisy_.forEach((e) => {
             e.remove();
         });
     }

    const register_links = Array.from(document.querySelectorAll("p")).find(
      (el) => el.textContent.includes("新規登録して")
    );
    if (!!register_links) {
      register_links.closest("div").remove();
    }

    const iine_login_links = Array.from(document.querySelectorAll("h3")).find(
       (el) => el.textContent.includes("いいね以上の気持ちはコメント")
    );
    // レイアウトくずれるので display none に
    if(iine_login_links) {iine_login_links.closest("div").style.display="none"};

     const footer = document.querySelector("[id^='GlobalFooter']");
     if(footer && footer.querySelector("footer")){
         [...footer.querySelector("footer").children].forEach((e) => {
             e.remove();
         });
     }
  };

  setInterval(removeSections, 1000);
})();