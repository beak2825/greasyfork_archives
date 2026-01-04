// ==UserScript==
// @name         GOメンズエステ 口コミ最新投稿時間表示
// @namespace    http://tampermonkey.net/
// @version      2024-12-25_2
// @description  お店一覧を表示した際にｸﾁｺﾐの部分に最新コメントの日付を挿入します
// @author       kkmmrr1920
// @match        https://go-mensesthe.net/category/*
// @match        https://kansai.go-mensesthe.net/category/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=go-mensesthe.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521755/GO%E3%83%A1%E3%83%B3%E3%82%BA%E3%82%A8%E3%82%B9%E3%83%86%20%E5%8F%A3%E3%82%B3%E3%83%9F%E6%9C%80%E6%96%B0%E6%8A%95%E7%A8%BF%E6%99%82%E9%96%93%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521755/GO%E3%83%A1%E3%83%B3%E3%82%BA%E3%82%A8%E3%82%B9%E3%83%86%20%E5%8F%A3%E3%82%B3%E3%83%9F%E6%9C%80%E6%96%B0%E6%8A%95%E7%A8%BF%E6%99%82%E9%96%93%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const main = () => {
    // ページ内のすべての <a> タグを取得し、「のｸﾁｺﾐ」というテキストを含むリンクだけをフィルタリング
    const anchor = [...document.querySelectorAll("a")].filter(
      (a) => a.innerHTML.includes("のｸﾁｺﾐ") // innerHTML に「のｸﾁｺﾐ」が含まれているリンクを選択
    );

    // 各リンクに対して非同期処理を行う
    anchor.forEach(async (a) => {
      try {
        if (a.innerHTML.includes(`last`)) {
          // すでに最新のコメント日時が表示されている場合は処理を終了
          return;
        }

        // リンクの href 属性を使って、リンク先のページを非同期でフェッチ
        const res = await fetch(a.href); // リンク先の URL を fetch で取得

        // レスポンスが正常かどうかを確認（HTTP ステータスコードが 200 番台か）
        if (!res.ok) {
          return; // レスポンスが不正（HTTP ステータスが 200 番台でない）場合は処理を終了
        }

        // フェッチしたレスポンスのテキスト（HTML）を取得
        const text = await res.text(); // レスポンスとして返された HTML コンテンツを取得

        // 取得した HTML を DOM に解析して HTML ドキュメントオブジェクトを作成
        const html = new DOMParser().parseFromString(text, "text/html"); // 文字列を HTML ドキュメントに変換

        // 最新のコメント日時を取得（コメントセクション内の span.date 要素から取得）
        const latestCommentTime = html
          ?.querySelector("div#comments span.date") // コメント日時が記載された要素を選択
          ?.innerHTML?.replace("投稿日", "") // 「投稿日」というテキストを削除
          ?.replace(/\s/g, "") // 内部の空白文字を削除
          ?.replace(/年|月/g, "/") // 年と月を「/」に置き換え（スラッシュ区切り）
          ?.replace(/日/g, ""); // 最後の「日」を削除（不要な部分を取り除く）

        // 挿入する span 要素を作成
        const spanForInsert = document.createElement("span");
        // 最新コメント時間及び現在の時間をnew Date()で取得
        const latestCommentTimeDate = new Date(latestCommentTime).getTime();
        const now = new Date().getTime();
        if (latestCommentTimeDate > now - 1000 * 60 * 60 * 24 * 30) {
          // 30日以内のコメントの場合は文字色を赤に変更
          spanForInsert.style.color = "red";
        } else if (latestCommentTimeDate < now - 1000 * 60 * 60 * 24 * 30 * 6) {
          // 6ヶ月以上前のコメントの場合は文字色を灰色に変更
          spanForInsert.style.color = "rgb(150, 150, 150)";
        } else {
          // 30日以内でも6ヶ月以上前でもない場合は文字色を青に変更
          spanForInsert.style.color = "blue";
        }
        spanForInsert.innerHTML = latestCommentTime;

        // コメント日時が取得できない場合は処理を終了
        if (latestCommentTime === undefined || latestCommentTime === "") {
          return; // コメント日時が undefined または空文字の場合は次のリンクへ
        }

        // リンクの後ろに最新のコメント日時を「(last 口コミ YYYY/MM/DD)」形式で挿入
        a.insertAdjacentHTML(
          "beforeend",
          `(last ｸﾁｺﾐ ${spanForInsert.outerHTML})`
        ); // リンクの直後に日時を表示
      } catch (error) {
        // エラーハンドリング：ネットワークエラーやパースエラーが発生した場合
        console.error("エラーが発生しました:", error); // エラー内容をコンソールに表示
      }
    });
  };
  // main 関数を実行
  main();

  // ページ内の変更を監視して、変更があった場合に main 関数を再実行
  const targetElement = document.querySelector("table#area-table");
  const mu = new MutationObserver(main);
  const options = {
    childList: true,
    subtree: false,
  };
  mu.observe(targetElement, options);
})();
