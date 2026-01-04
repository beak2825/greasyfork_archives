// ==UserScript==
// @name         Nejire Refine
// @namespace    http://nejiten.halfmoon.jp/
// @version      1.0.0
// @description  ねじれ天国のUIを使いやすくするスクリプトです。
// @author       euro_s
// @match        https://nejiten.halfmoon.jp/index.cgi?vid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=halfmoon.jp
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447367/Nejire%20Refine.user.js
// @updateURL https://update.greasyfork.org/scripts/447367/Nejire%20Refine.meta.js
// ==/UserScript==

(function () {
  "use strict";

  ////////////////////////////////////////////////////////////////////////////////
  // 設定
  ////////////////////////////////////////////////////////////////////////////////

  // サイドバーの表示(デフォルト非表示)
  let sideBarDisplay = GM_getValue("sideBarDisplay", "none");
  // 表示の場合の値
  // let sideBarDisplay = 'table-cell';

  // ページリンクの表示(デフォルト表示)
  let alllogAnnounceDisplay = GM_getValue("alllogAnnounceDisplay", "block");
  // 非表示の場合の値
  // let alllogAnnounceDisplay = 'none';

  // テキストエリアのフォントサイズ(デフォルト1.5)
  let textareaFontSize = GM_getValue("textareaFontSize", 1.5);

  // メッセージの最大行数 これを超えると省略される(デフォルト20)
  let maxBrTags = GM_getValue("maxBrTags", 20);

  // メッセージの最大文字数 これを超えると省略される(デフォルト800)
  let maxTextLength = GM_getValue("maxTextLength", 800);

  // 発言に含まれる画像の最大数 これを超えると削除される(デフォルト10)
  let maxImgCount = GM_getValue("maxImgCount", 10);

  // 連投制限(デフォルトで省略=truncate, 削除=delete, 何もしない=none)
  let spamOption = GM_getValue("spamOption", "truncate");

  // ページ右上に移動ボタンを表示するか(デフォルト非表示)
  let showScrollButton = GM_getValue("showScrollButton", false);

  // ページ右下に検索ボタンを表示するか(デフォルト非表示)
  let showSearchButton = GM_getValue("showSearchButton", false);

  ////////////////////////////////////////////////////////////////////////////////
  // メタ情報
  ////////////////////////////////////////////////////////////////////////////////

  let vid = 0;
  let date = 0;
  let idAndNames = new Map();

  function getMetadata() {
    const url = location.href;
    const vidMatch = url.match(/vid=(\d+)/);
    if (vidMatch) {
      vid = vidMatch[1];
    }
    const dateMatch = url.match(/date=(\d+)/);
    if (dateMatch) {
      date = dateMatch[1];
    } else {
      const str = document.querySelector("span.today").innerText;
      const dateMatch = str.match(/(\d+)日目/);
      if (dateMatch) {
        date = dateMatch[1];
      }
    }
    const list = document.getElementById("list");
    const aTags = list.getElementsByTagName("a");
    for (let i = 0; i < aTags.length; i++) {
      const aTag = aTags[i];
      const href = aTag.href;
      const idMatch = href.match(/&id=(\d+)/);
      if (idMatch) {
        const id = idMatch[1];
        const name = aTag.innerText;
        idAndNames.set(id, name);
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // メイン
  ////////////////////////////////////////////////////////////////////////////////

  window.addEventListener("DOMContentLoaded", async (event) => {
    getMetadata();
    createTopButtonContainer();
    createBottomButtonContainer();
    disableDoubleSubmit();
    createSettingDialog();
    upDownButtons();
    new MutationObserver(processMessage).observe(
      document.querySelector("#content"),
      { childList: true }
    );
    processMessage();
    new MutationObserver(processAnnounce).observe(
      document.querySelector("#content"),
      { childList: true }
    );
    processAnnounce();
    await addCopyAnchorEvent();
    disableLeaveButtonAndAddCheckbox();
    pagination();
    setAnchorToggle();
    addSearchIcon();
    applySettings();
  });

  ////////////////////////////////////////////////////////////////////////////////
  // 各種処理
  ////////////////////////////////////////////////////////////////////////////////

  // 設定の反映
  function applySettings() {
    // サイドバーの表示
    const sideBars = document.querySelectorAll(
      "body > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1)"
    );
    sideBars.forEach((sideBar) => {
      sideBar.style.display = sideBarDisplay;
    });

    // ページリンクの表示
    const alllogAnnounces = document.querySelectorAll(".alllog_announce");
    alllogAnnounces.forEach((alllogAnnounce) => {
      alllogAnnounce.style.display = alllogAnnounceDisplay;
    });

    // 発言欄のフォントサイズ
    const textarea = document.querySelectorAll("textarea");
    textarea.forEach((ta) => {
      ta.style.fontSize = `${textareaFontSize}rem`;
    });

    // 上下移動ボタンの表示
    const buttonUp = document.getElementById("scrollToTopButton");
    const buttonDown = document.getElementById("scrollToBottomButton");
    if (showScrollButton) {
      buttonUp.style.display = "block";
      buttonDown.style.display = "block";
    } else {
      buttonUp.style.display = "none";
      buttonDown.style.display = "none";
    }

    // 検索ボタンの表示
    const searchButton = document.getElementById("searchIcon");
    if (showSearchButton) {
      searchButton.style.display = "block";
    } else {
      searchButton.style.display = "none";
    }
  }

  // 設定ボタンを作成
  function createSettingDialog() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.title = "設定";
    btn.id = "settingButton";
    // 歯車アイコンのSVGをBase64でエンコードしたもの 白背景用
    btn.innerHTML = `
    <img src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI1cHgiIGhlaWdodD0iMjVweCIgdmlld0JveD0iMCAwIDEyODAuMDAwMDAwIDEyODAuMDAwMDAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ij4KPG1ldGFkYXRhPgpDcmVhdGVkIGJ5IHBvdHJhY2UgMS4xNSwgd3JpdHRlbiBieSBQZXRlciBTZWxpbmdlciAyMDAxLTIwMTcKPC9tZXRhZGF0YT4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0id2hpdGUiLz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsMTI4MC4wMDAwMDApIHNjYWxlKDAuMTAwMDAwLC0wLjEwMDAwMCkiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSI+CjxwYXRoIGQ9Ik02MDMzIDEyNzkwIGMtNDA5IC0yNyAtOTEzIC0xMDQgLTk3MyAtMTQ5IC02MSAtNDQgLTYwIC0zNiAtNjAgLTUxOQpsLTEgLTQ0MyAtMjIgLTkgYy0xMiAtNCAtOTggLTMxIC0xOTIgLTYwIC0xOTAgLTU4IC0zODMgLTEyOCAtNTU1IC0yMDMgLTEzNgotNTggLTQyMCAtMTk5IC01MDUgLTI1MCBsLTYwIC0zNiAtMzEwIDMwOCBjLTE3MCAxNzAgLTMyMCAzMTQgLTMzMiAzMjAgLTMwCjE1IC05NyAxNCAtMTM2IC0zIC00MSAtMTcgLTI1NiAtMTcxIC00MTIgLTI5NSAtMzk0IC0zMTIgLTgxNyAtNzM1IC0xMTI2Ci0xMTI2IC0xODYgLTIzNSAtMjk3IC0zOTcgLTMwOSAtNDUwIC0xOCAtNzggLTEwIC04OCAzMjUgLTQyNSBsMzE0IC0zMTUgLTM2Ci02MCBjLTUxIC04NiAtMTkyIC0zNzAgLTI1MCAtNTA1IC03NSAtMTcyIC0xNDUgLTM2NSAtMjAzIC01NTUgLTI5IC05MyAtNTYKLTE4MCAtNjAgLTE5MiBsLTkgLTIyIC00NDMgLTEgYy00ODUgMCAtNDc0IDEgLTUyMSAtNjIgLTM0IC00NiAtOTggLTQyNiAtMTM0Ci03OTMgLTI0IC0yNTIgLTI0IC04MzggMCAtMTA5MCAzNiAtMzY3IDEwMCAtNzQ4IDEzNSAtNzk0IDQ2IC02MiAzNiAtNjEgNTIwCi02MSBsNDQzIC0xIDkgLTIyIGM0IC0xMiAzMSAtOTggNjAgLTE5MiA1OCAtMTkwIDEyOCAtMzgzIDIwMyAtNTU1IDU4IC0xMzYKMTk5IC00MjAgMjUwIC01MDUgbDM2IC02MCAtMzA4IC0zMTAgYy0xNzAgLTE3MCAtMzE0IC0zMjAgLTMyMCAtMzMyIC0xNSAtMzAKLTE0IC05NyAzIC0xMzYgMTcgLTQxIDE3MSAtMjU2IDI5NSAtNDEyIDMxMiAtMzk0IDczNSAtODE3IDExMjYgLTExMjYgMjM1Ci0xODYgMzk3IC0yOTcgNDUwIC0zMDkgNzggLTE4IDg4IC0xMCA0MjUgMzI1IGwzMTUgMzE0IDYwIC0zNiBjODYgLTUxIDM3MAotMTkyIDUwNSAtMjUwIDE3MiAtNzUgMzY1IC0xNDUgNTU1IC0yMDMgOTQgLTI5IDE4MCAtNTYgMTkyIC02MCBsMjIgLTkgMQotNDQzIGMwIC00ODUgLTEgLTQ3NCA2MiAtNTIxIDQ2IC0zNCA0MjYgLTk4IDc5MyAtMTM0IDI1MiAtMjQgODM4IC0yNCAxMDkwIDAKMzY3IDM2IDc0OCAxMDAgNzk0IDEzNSA2MiA0NiA2MSAzNiA2MSA1MjAgbDEgNDQzIDIyIDkgYzEyIDQgOTkgMzEgMTkyIDYwCjE5MCA1OCAzODMgMTI4IDU1NSAyMDMgMTM2IDU4IDQyMCAxOTkgNTA1IDI1MCBsNjAgMzYgMzEwIC0zMDggYzE3MSAtMTcwIDMyMAotMzE0IDMzMiAtMzIwIDMwIC0xNSA5NyAtMTQgMTM2IDMgNDEgMTcgMjU2IDE3MSA0MTIgMjk1IDM5NCAzMTIgODE3IDczNQoxMTI2IDExMjYgMTg2IDIzNSAyOTcgMzk3IDMwOSA0NTAgMTggNzggMTAgODggLTMyNSA0MjUgbC0zMTQgMzE1IDM2IDYwIGM1MQo4NiAxOTIgMzcwIDI1MCA1MDUgNzUgMTcyIDE0NSAzNjUgMjAzIDU1NSAyOSA5NCA1NiAxODAgNjAgMTkyIGw5IDIyIDQ0MyAxCmM0ODUgMCA0NzQgLTEgNTIxIDYyIDM0IDQ2IDk4IDQyNiAxMzQgNzkzIDI0IDI1MiAyNCA4MzggMCAxMDkwIC0zNiAzNjcgLTEwMAo3NDggLTEzNSA3OTQgLTQ2IDYyIC0zNiA2MSAtNTIwIDYxIGwtNDQzIDEgLTkgMjIgYy00IDEyIC0zMSA5OSAtNjAgMTkyIC01OAoxOTAgLTEyOCAzODMgLTIwMyA1NTUgLTU4IDEzNiAtMTk5IDQyMCAtMjUwIDUwNSBsLTM2IDYwIDMwOCAzMTAgYzE3MCAxNzEKMzE0IDMyMCAzMjAgMzMyIDE1IDMwIDE0IDk3IC0zIDEzNiAtMTcgNDEgLTE3MSAyNTYgLTI5NSA0MTIgLTMxMiAzOTQgLTczNQo4MTcgLTExMjYgMTEyNiAtMjM1IDE4NiAtMzk3IDI5NyAtNDUwIDMwOSAtNzggMTggLTg4IDEwIC00MjUgLTMyNSBsLTMxNQotMzE0IC02MCAzNiBjLTg2IDUxIC0zNzAgMTkyIC01MDUgMjUwIC0xNzIgNzUgLTM2NSAxNDUgLTU1NSAyMDMgLTkzIDI5IC0xODAKNTYgLTE5MiA2MCBsLTIyIDkgLTEgNDQzIGMwIDQ4NSAxIDQ3NCAtNjIgNTIxIC00NiAzNCAtNDMyIDk5IC03ODMgMTMyIC0yMDAKMTkgLTczMyAyNyAtOTIyIDE1eiBtNjYwIC0zNDQxIGMxMDE3IC05MiAxOTM1IC03MzcgMjM4MyAtMTY3NCAxNzAgLTM1NSAyNjEKLTcxNSAyODMgLTExMTggNDEgLTczOSAtMTk0IC0xNDU3IC02NjggLTIwMzcgLTQ3MSAtNTc4IC0xMTQ1IC05NTMgLTE5MDEKLTEwNjAgLTIwOCAtMjkgLTU3MiAtMjkgLTc4MCAwIC02NjAgOTMgLTEyNDIgMzgyIC0xNzA1IDg0NSAtNDYzIDQ2MyAtNzUyCjEwNDUgLTg0NSAxNzA1IC0yOSAyMDggLTI5IDU3MiAwIDc4MCAxMDcgNzU2IDQ4MiAxNDMwIDEwNjAgMTkwMSA2MTkgNTA1CjEzNjQgNzMxIDIxNzMgNjU4eiIvPgo8L2c+Cjwvc3ZnPgo="/>
    `;
    // ボタンのクリックイベントリスナーを設定
    btn.addEventListener("click", function () {
      // ボタンがクリックされたときにポップアップウィンドウを表示
      dialog.showModal();
    });

    // ボタンを挿入する位置
    const action_box = document.querySelector(".action_box");
    const entryForm = document.querySelector("form[name=entryForm]");
    let target;
    if (action_box && !entryForm) {
      target = action_box.querySelector(
        "td.action_body" // 発言欄の名前の右
      );
      // replace innerHTML
      target.innerHTML = target.innerHTML.replace('</span>', '</span></div>');
      target.innerHTML = `<div>${target.innerHTML}`;
      target.classList.add("container");
      const span = document.createElement("span");
      span.classList.add("right");
      btn.classList.add("with_action_box");
      // ボタンを追加
      span.appendChild(btn);
      target.appendChild(span);

      // hopeForm の位置を変更
      const hopeForm = document.querySelector("form[name=hopeForm]");
      const boxHope = document.querySelector("#box_hope");
      if (hopeForm && boxHope) {
        boxHope.parentElement.appendChild(hopeForm);
        boxHope.parentElement.removeChild(boxHope);
        hopeForm.appendChild(boxHope);
      }
    } else {
      // ログアウト中などで発言欄がない場合、または入村前の場合
      // aタグ、title=にゃおーんの要素を取得してそこに追加
      target = document.querySelector('a[title="にゃおーん"]');
      // 歯車アイコンのSVGをBase64でエンコードしたもの 黒背景用
      btn.innerHTML = `
      <img src="data:image/svg+xml;base64,ICAgIDxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgICB3aWR0aD0iMjVweCIgaGVpZ2h0PSIyNXB4IiB2aWV3Qm94PSIwIDAgMTI4MC4wMDAwMDAgMTI4MC4wMDAwMDAiCiAgICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ij4KICAgIDx0aXRsZT5TZXR0aW5nIEljb248L3RpdGxlPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsMTI4MC4wMDAwMDApIHNjYWxlKDAuMTAwMDAwLC0wLjEwMDAwMCkiCiAgICBmaWxsPSIjRkZGRkZGIiBzdHJva2U9Im5vbmUiPgogICAgPHBhdGggZD0iTTYwMzMgMTI3OTAgYy00MDkgLTI3IC05MTMgLTEwNCAtOTczIC0xNDkgLTYxIC00NCAtNjAgLTM2IC02MCAtNTE5CiAgICBsLTEgLTQ0MyAtMjIgLTkgYy0xMiAtNCAtOTggLTMxIC0xOTIgLTYwIC0xOTAgLTU4IC0zODMgLTEyOCAtNTU1IC0yMDMgLTEzNgogICAgLTU4IC00MjAgLTE5OSAtNTA1IC0yNTAgbC02MCAtMzYgLTMxMCAzMDggYy0xNzAgMTcwIC0zMjAgMzE0IC0zMzIgMzIwIC0zMAogICAgMTUgLTk3IDE0IC0xMzYgLTMgLTQxIC0xNyAtMjU2IC0xNzEgLTQxMiAtMjk1IC0zOTQgLTMxMiAtODE3IC03MzUgLTExMjYKICAgIC0xMTI2IC0xODYgLTIzNSAtMjk3IC0zOTcgLTMwOSAtNDUwIC0xOCAtNzggLTEwIC04OCAzMjUgLTQyNSBsMzE0IC0zMTUgLTM2CiAgICAtNjAgYy01MSAtODYgLTE5MiAtMzcwIC0yNTAgLTUwNSAtNzUgLTE3MiAtMTQ1IC0zNjUgLTIwMyAtNTU1IC0yOSAtOTMgLTU2CiAgICAtMTgwIC02MCAtMTkyIGwtOSAtMjIgLTQ0MyAtMSBjLTQ4NSAwIC00NzQgMSAtNTIxIC02MiAtMzQgLTQ2IC05OCAtNDI2IC0xMzQKICAgIC03OTMgLTI0IC0yNTIgLTI0IC04MzggMCAtMTA5MCAzNiAtMzY3IDEwMCAtNzQ4IDEzNSAtNzk0IDQ2IC02MiAzNiAtNjEgNTIwCiAgICAtNjEgbDQ0MyAtMSA5IC0yMiBjNCAtMTIgMzEgLTk4IDYwIC0xOTIgNTggLTE5MCAxMjggLTM4MyAyMDMgLTU1NSA1OCAtMTM2CiAgICAxOTkgLTQyMCAyNTAgLTUwNSBsMzYgLTYwIC0zMDggLTMxMCBjLTE3MCAtMTcwIC0zMTQgLTMyMCAtMzIwIC0zMzIgLTE1IC0zMAogICAgLTE0IC05NyAzIC0xMzYgMTcgLTQxIDE3MSAtMjU2IDI5NSAtNDEyIDMxMiAtMzk0IDczNSAtODE3IDExMjYgLTExMjYgMjM1CiAgICAtMTg2IDM5NyAtMjk3IDQ1MCAtMzA5IDc4IC0xOCA4OCAtMTAgNDI1IDMyNSBsMzE1IDMxNCA2MCAtMzYgYzg2IC01MSAzNzAKICAgIC0xOTIgNTA1IC0yNTAgMTcyIC03NSAzNjUgLTE0NSA1NTUgLTIwMyA5NCAtMjkgMTgwIC01NiAxOTIgLTYwIGwyMiAtOSAxCiAgICAtNDQzIGMwIC00ODUgLTEgLTQ3NCA2MiAtNTIxIDQ2IC0zNCA0MjYgLTk4IDc5MyAtMTM0IDI1MiAtMjQgODM4IC0yNCAxMDkwIDAKICAgIDM2NyAzNiA3NDggMTAwIDc5NCAxMzUgNjIgNDYgNjEgMzYgNjEgNTIwIGwxIDQ0MyAyMiA5IGMxMiA0IDk5IDMxIDE5MiA2MAogICAgMTkwIDU4IDM4MyAxMjggNTU1IDIwMyAxMzYgNTggNDIwIDE5OSA1MDUgMjUwIGw2MCAzNiAzMTAgLTMwOCBjMTcxIC0xNzAgMzIwCiAgICAtMzE0IDMzMiAtMzIwIDMwIC0xNSA5NyAtMTQgMTM2IDMgNDEgMTcgMjU2IDE3MSA0MTIgMjk1IDM5NCAzMTIgODE3IDczNQogICAgMTEyNiAxMTI2IDE4NiAyMzUgMjk3IDM5NyAzMDkgNDUwIDE4IDc4IDEwIDg4IC0zMjUgNDI1IGwtMzE0IDMxNSAzNiA2MCBjNTEKICAgIDg2IDE5MiAzNzAgMjUwIDUwNSA3NSAxNzIgMTQ1IDM2NSAyMDMgNTU1IDI5IDk0IDU2IDE4MCA2MCAxOTIgbDkgMjIgNDQzIDEKICAgIGM0ODUgMCA0NzQgLTEgNTIxIDYyIDM0IDQ2IDk4IDQyNiAxMzQgNzkzIDI0IDI1MiAyNCA4MzggMCAxMDkwIC0zNiAzNjcgLTEwMAogICAgNzQ4IC0xMzUgNzk0IC00NiA2MiAtMzYgNjEgLTUyMCA2MSBsLTQ0MyAxIC05IDIyIGMtNCAxMiAtMzEgOTkgLTYwIDE5MiAtNTgKICAgIDE5MCAtMTI4IDM4MyAtMjAzIDU1NSAtNTggMTM2IC0xOTkgNDIwIC0yNTAgNTA1IGwtMzYgNjAgMzA4IDMxMCBjMTcwIDE3MQogICAgMzE0IDMyMCAzMjAgMzMyIDE1IDMwIDE0IDk3IC0zIDEzNiAtMTcgNDEgLTE3MSAyNTYgLTI5NSA0MTIgLTMxMiAzOTQgLTczNQogICAgODE3IC0xMTI2IDExMjYgLTIzNSAxODYgLTM5NyAyOTcgLTQ1MCAzMDkgLTc4IDE4IC04OCAxMCAtNDI1IC0zMjUgbC0zMTUKICAgIC0zMTQgLTYwIDM2IGMtODYgNTEgLTM3MCAxOTIgLTUwNSAyNTAgLTE3MiA3NSAtMzY1IDE0NSAtNTU1IDIwMyAtOTMgMjkgLTE4MAogICAgNTYgLTE5MiA2MCBsLTIyIDkgLTEgNDQzIGMwIDQ4NSAxIDQ3NCAtNjIgNTIxIC00NiAzNCAtNDMyIDk5IC03ODMgMTMyIC0yMDAKICAgIDE5IC03MzMgMjcgLTkyMiAxNXogbTY2MCAtMzQ0MSBjMTAxNyAtOTIgMTkzNSAtNzM3IDIzODMgLTE2NzQgMTcwIC0zNTUgMjYxCiAgICAtNzE1IDI4MyAtMTExOCA0MSAtNzM5IC0xOTQgLTE0NTcgLTY2OCAtMjAzNyAtNDcxIC01NzggLTExNDUgLTk1MyAtMTkwMQogICAgLTEwNjAgLTIwOCAtMjkgLTU3MiAtMjkgLTc4MCAwIC02NjAgOTMgLTEyNDIgMzgyIC0xNzA1IDg0NSAtNDYzIDQ2MyAtNzUyCiAgICAxMDQ1IC04NDUgMTcwNSAtMjkgMjA4IC0yOSA1NzIgMCA3ODAgMTA3IDc1NiA0ODIgMTQzMCAxMDYwIDE5MDEgNjE5IDUwNQogICAgMTM2NCA3MzEgMjE3MyA2NTh6Ii8+CiAgICA8L2c+CiAgIDwvc3ZnPg=="/>
      `;
      btn.classList.add("no_action_box");
      if (target) {
        target.insertAdjacentElement("afterend", btn);
      }
    }

    // 設定値の設定
    const sidebarChecked = sideBarDisplay == "table-cell" ? "checked" : "";
    const pageLinkChecked = alllogAnnounceDisplay == "block" ? "checked" : "";
    const showScrollButtonChecked = showScrollButton ? "checked" : "";
    const showSearchButtonChecked = showSearchButton ? "checked" : "";
    const truncateSelected = spamOption == "truncate" ? "selected" : "";
    const deleteSelected = spamOption == "delete" ? "selected" : "";
    const noneSelected = spamOption == "none" ? "selected" : "";

    // ポップアップウィンドウ（<dialog>）を作成
    const dialog = document.createElement("dialog");
    dialog.innerHTML = `
    <div class="dialog">
      <h2>Nejire Refine 設定</h2>
      <label>
        <input type="checkbox" id="sidebarCheckbox" ${sidebarChecked}>
        サイドバーを表示する
      </label>
      <br/>
      <label>
        <input type="checkbox" id="pageLinkCheckbox" ${pageLinkChecked}>
        ページリンクを表示する
      </label>
      <br/>
      <label>
        <input type="checkbox" id="showScrollButton" ${showScrollButtonChecked}>
        一番上/一番下に移動するボタンを表示する
      </label>
      <br/>
      <label>
        <input type="checkbox" id="showSearchButton" ${showSearchButtonChecked}>
        検索ボタンを表示する
      </label>
      <br/>
      <hr>
      <div>ここから下は保存したあと画面リロードで反映</div>
      <label for="spamControl">連投制御オプション:</label>
      <select id="spamControl">
        <option value="truncate" ${truncateSelected}>省略表示</option>
        <option value="delete" ${deleteSelected}>発言全体を削除</option>
        <option value="none" ${noneSelected}>何もしない</option>
      </select>
      <br/>
      <label>
        <input type="number" id="fontSizeInput" value="${textareaFontSize}">
        発言欄のフォントサイズ(rem) デフォルトは 1.5
      </label>
      <br/>
      <label>
        <input type="number" id="maxLinesInput" value="${maxBrTags}">
        発言の最大行数（超えると省略） デフォルトは 20
      </label>
      <br/>
      <label>
        <input type="number" id="maxCharsInput" value="${maxTextLength}">
        発言の最大文字数（超えると省略） デフォルトは 800
      </label>
      <br/>
      <label>
        <input type="number" id="maxImagesInput" value="${maxImgCount}">
        発言の最大画像数（タペストリー対策） デフォルトは 10
      </label>
      <br/>
      <br/>
    </div>
    `;
    document.body.appendChild(dialog);

    // 設定を保存し、ダイアログを閉じるためのボタンを作成
    let saveButton = document.createElement("button");
    saveButton.classList.add("primary");
    saveButton.type = "button";
    saveButton.innerText = "保存";
    saveButton.addEventListener("click", () => {
      // 設定値を変数に反映
      sideBarDisplay = document.querySelector("#sidebarCheckbox").checked
        ? "table-cell"
        : "none";
      alllogAnnounceDisplay = document.querySelector("#pageLinkCheckbox")
        .checked
        ? "block"
        : "none";
      spamOption = document.querySelector("#spamControl").value;
      textareaFontSize = document.querySelector("#fontSizeInput").value;
      maxBrTags = document.querySelector("#maxLinesInput").value;
      maxTextLength = document.querySelector("#maxCharsInput").value;
      maxImgCount = document.querySelector("#maxImagesInput").value;
      showScrollButton = document.querySelector("#showScrollButton").checked;
      showSearchButton = document.querySelector("#showSearchButton").checked;

      // 設定値を保存
      GM_setValue("sideBarDisplay", sideBarDisplay);
      GM_setValue("alllogAnnounceDisplay", alllogAnnounceDisplay);
      GM_setValue("spamOption", spamOption);
      GM_setValue("textareaFontSize", textareaFontSize);
      GM_setValue("maxBrTags", maxBrTags);
      GM_setValue("maxTextLength", maxTextLength);
      GM_setValue("maxImgCount", maxImgCount);
      GM_setValue("showScrollButton", showScrollButton);
      GM_setValue("showSearchButton", showSearchButton);

      // 変数からDOMに反映
      applySettings();
      dialog.close();
    });
    dialog.appendChild(saveButton);

    // 設定をキャンセルし、ダイアログを閉じるためのボタンを作成
    let cancelButton = document.createElement("button");
    cancelButton.classList.add("secondary");
    cancelButton.type = "button";
    cancelButton.innerText = "キャンセル";
    cancelButton.addEventListener("click", () => {
      // 設定を元に戻す
      document.querySelector("#sidebarCheckbox").checked =
        sideBarDisplay == "table-cell";
      document.querySelector("#pageLinkCheckbox").checked =
        alllogAnnounceDisplay == "block";
      document.querySelector("#spamControl").value = spamOption;
      document.querySelector("#fontSizeInput").value = textareaFontSize;
      document.querySelector("#maxLinesInput").value = maxBrTags;
      document.querySelector("#maxCharsInput").value = maxTextLength;
      document.querySelector("#maxImagesInput").value = maxImgCount;
      document.querySelector("#showScrollButton").checked = showScrollButton;
      document.querySelector("#showSearchButton").checked = showSearchButton;

      // ダイアログを閉じる
      dialog.close();
    });
    dialog.appendChild(cancelButton);
  }

  // 右上ボタン群のコンテナ作成
  function createTopButtonContainer() {
    if (document.querySelector("#topButtonContainer")) {
      return;
    }
    // Create a new div element for buttons
    const topButtonContainer = document.createElement("div");
    topButtonContainer.id = "topButtonContainer";

    // Append the new div element to the bottom of the page
    document.body.appendChild(topButtonContainer);
  }

  // 右下ボタン群のコンテナ作成
  function createBottomButtonContainer() {
    if (document.querySelector("#bottomButtonContainer")) {
      return;
    }
    // Create a new div element for buttons
    const bottomButtonContainer = document.createElement("div");
    bottomButtonContainer.id = "bottomButtonContainer";

    // Append the new div element to the bottom of the page
    document.body.appendChild(bottomButtonContainer);
  }

  // 上下スクロールボタンを作成
  function upDownButtons() {
    const topButtonContainer = document.querySelector("#topButtonContainer");

    // Create a new button element for scrolling to bottom
    const buttonDown = document.createElement("button");
    buttonDown.id = "scrollToBottomButton";
    buttonDown.innerHTML = `
    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDMwIDMwIj4KICAgIDxwYXRoIGQ9Ik0xNSAyMEw1IDEwaDIwbC0xMCAxMHoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo="/>
    `;

    // Create a new button element for scrolling to top
    const buttonUp = document.createElement("button");
    buttonUp.id = "scrollToTopButton";
    buttonUp.innerHTML = `
    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDMwIDMwIj4KICAgIDxwYXRoIGQ9Ik0xNSAxMEw1IDIwaDIwbC0xMCAtMTB6IiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K"/>
    `;

    // Add the buttons to the document body
    topButtonContainer.append(buttonUp, buttonDown);

    // Attach an event listener to the buttons to handle clicks
    buttonDown.addEventListener("click", function () {
      window.scrollTo({
        top: document.body.scrollHeight, // Scroll to the bottom of the page
        behavior: "smooth", // Animate the scroll
      });
    });

    buttonUp.addEventListener("click", function () {
      window.scrollTo({
        top: 0, // Scroll to the top of the page
        behavior: "smooth", // Animate the scroll
      });
    });
  }

  // 発言ボタン2度押し防止
  function disableDoubleSubmit() {
    const submitButtons = document.querySelectorAll('input[type="submit"]');
    for (const submitButton of submitButtons) {
      submitButton.addEventListener("click", (event) => {
        setTimeout(() => (this.disabled = true), 0);
      });
    }
  }

  // メッセージの情報を取得する
  function getMessageInformationFromMessageTable(messageTable) {
    // mark processed message, add data-processed: true
    messageTable.setAttribute("data-processed", true);

    const meta = messageTable.querySelector("tbody > tr:nth-child(1)");
    const icon = meta
      .querySelector("td:nth-child(1) > img")
      .getAttribute("src");
    const number = meta.querySelector(
      "td:nth-child(2) > span.mes_number"
    )?.textContent;
    const nameATag = meta.querySelector("td:nth-child(2) > a:nth-child(3)");
    let id;
    let name;
    if (!nameATag) {
      // nameATagがないのは匿名ユーザー
      id = "anonymous";
      name = "汝はねじれなりや？";
    } else {
      name = nameATag.textContent;
      let match;
      // 参加中のユーザーは数値のidを持つ
      match = /&id=(\d+)/.exec(nameATag.href);
      if (match) {
        id = match[1];
      } else {
        // 観戦発言などはuidを持つ
        match = /&uid=(\w+)/.exec(nameATag.href);
        if (match) {
          id = match[1];
        }
      }
    }
    if (!id) {
      console.error("IDが取得できませんでした");
      console.error(nameATag.href);
    }
    const content = messageTable.querySelector("[class$=body1]");
    const original = content.innerHTML;
    return { id, name, number, icon, content, original };
  }

  // div.announceの処理
  function processAnnounce() {
    const announces = document.querySelectorAll("div.announce:not([data-processed])");
    for (const announce of announces) {
      // mark processed announce, add data-processed: true
      announce.setAttribute("data-processed", true);
      if (announce.classList.contains("testament")) {
        // 遺言
        let tempHTML = announce.innerHTML;
        const brTags = tempHTML.split("<br>");
        const text = announce.textContent;
        const originalContentHTML = announce.innerHTML;

        if (brTags && brTags.length > maxBrTags) {
          // brタグの数がmaxBrTagsを超えていたら、それ以降のHTMLを削除し、最後に...を追加したHTMLを作成する
          const tempBrTags = brTags.slice(0, maxBrTags);
          tempHTML =
            tempBrTags.join("<br>") +
            "<br><a class='ellipsis' title='省略されています'>...</a>";
        } else if (text.length > maxTextLength) {
          // textContent の長さがmaxTextLengthを超えていたら、まずtextをmaxTextLengthで切り取る
          announce.textContent = text.slice(0, maxTextLength);
          announce.innerHTML +=
            "<a class='ellipsis' title='省略されています'>...</a>";
          tempHTML = announce.innerHTML;
        }

        announce.innerHTML = tempHTML;

        // ...にはイベントリスナーを追加し、クリックされたら全文を表示する
        announce
          .querySelector("a.ellipsis")
          ?.addEventListener("click", (event) => {
            event.preventDefault();
            announce.innerHTML = originalContentHTML;
          });
      }
    }
  }

  // messageの処理
  function processMessage() {
    const messages = document.querySelectorAll(
      "table.message:not([data-processed])"
    );
    const originalContentHTML = [];
    const latestMessages = {};
    for (const [i, messageTable] of messages.entries()) {
      const message = getMessageInformationFromMessageTable(messageTable);

      // 発言者のIDでグループ化
      if (!latestMessages[message.id]) {
        latestMessages[message.id] = [];
      }
      latestMessages[message.id].push(message);

      // originalの本文を保存しておく
      originalContentHTML.push(message.content.innerHTML);

      // 連投対策。同じ発言者の連続した発言は、発言内容を省略する
      if (spamOption == "truncate" || spamOption == "delete") {
        if (i > 0) {
          if (latestMessages[message.id].length > 1) {
            // 連投していたら、最後の発言の内容を省略する
            const lastMessage =
              latestMessages[message.id][latestMessages[message.id].length - 2];
            if (lastMessage.original == message.original) {
              if (spamOption == "truncate") {
                message.content.innerHTML =
                  "<a class='ellipsis' title='省略されています'>...</a>";
              } else if (spamOption == "delete") {
                messageTable.parentElement.removeChild(messageTable);
              }
            }
          }
        }
      }

      // タペストリー対策。imgタグがmaxImgCountを超えたら削除する
      const imgs = message.content.querySelectorAll("img");
      if (imgs.length > maxImgCount) {
        // 画像を削除したことを通知するメッセージ要素を作成
        const messageElement = document.createElement("span");
        messageElement.classList.add("ellipsis");
        messageElement.innerText = `この発言の画像は省略されました。`;
        imgs[0].parentElement.appendChild(messageElement);
        imgs.forEach((img) => {
          img.parentElement.removeChild(img);
        });
      }

      // 長文対策
      const innerHTML = message.content.innerHTML;
      const text = message.content.textContent;
      let count = 0;
      const savedLinks = {};

      // { と } をエスケープ
      let tempHTML = innerHTML.replace(/({|})/g, "\\$1");

      // aタグをプレースホルダーに置換
      tempHTML = tempHTML.replace(/<a\b[^>]*>(.*?)<\/a>/gi, function (match) {
        const placeholder = `{{link${count}}}`;
        savedLinks[placeholder] = match;
        count++;
        return placeholder;
      });

      // 置換したHTMLを<br>で分割
      const brTags = tempHTML.split("<br>");

      if (brTags && brTags.length > maxBrTags) {
        // brタグの数がmaxBrTagsを超えていたら、それ以降のHTMLを削除し、最後に...を追加したHTMLを作成する
        const tempBrTags = brTags.slice(0, maxBrTags);
        tempHTML =
          tempBrTags.join("<br>") +
          "<br><a class='ellipsis' title='省略されています'>...</a>";
      } else if (text.length > maxTextLength) {
        // textContent の長さがmaxTextLengthを超えていたら、まずtextをmaxTextLengthで切り取る
        // この場合、リンクやアンカーなどのタグが消えてしまうが、今のところしょうがない
        message.content.textContent = text.slice(0, maxTextLength);
        message.content.innerHTML +=
          "<a class='ellipsis' title='省略されています'>...</a>";
        tempHTML = message.content.innerHTML;
      }

      // プレースホルダーを元のaタグに戻す
      for (let placeholder in savedLinks) {
        tempHTML = tempHTML.replace(placeholder, savedLinks[placeholder]);
      }

      // エスケープした { と } を元に戻す
      tempHTML = tempHTML.replace(/\\({|})/g, "$1");

      message.content.innerHTML = tempHTML;

      // ...にはイベントリスナーを追加し、クリックされたら全文を表示する
      message.content
        .querySelector("a.ellipsis")
        ?.addEventListener("click", (event) => {
          event.preventDefault();
          message.content.innerHTML = originalContentHTML[i];
        });
    }
  }

  // 過去ログのアンカーをコピーする処理の追加
  async function addCopyAnchorEvent() {
    const match = /&date=(\d+)/.exec(location.href);
    if (match) {
      const date = match[1];
      const mesNumbers = document.querySelectorAll("span.mes_number");
      for (const mesNumberElm of mesNumbers) {
        mesNumberElm.addEventListener("click", async (event) => {
          const mesNumber = mesNumberElm.textContent;
          const anchor = `>>${date}:${mesNumber}`;
          // コピーするテキストを一時的なテキストエリアにセット
          const tempTextArea = document.createElement("textarea");
          tempTextArea.style.position = "absolute";
          tempTextArea.style.left = "-9999px";
          tempTextArea.value = anchor;
          document.body.appendChild(tempTextArea);
          tempTextArea.select();
          // クリップボードにコピー
          document.execCommand("copy");
          document.body.removeChild(tempTextArea);
          // コピーしたことを通知
          const notification = document.createElement("div");
          notification.textContent = `${anchor}をコピーしました`;
          notification.style.position = "fixed";
          notification.style.top = `${event.clientY + 20}px`;
          notification.style.left = `${event.clientX + 20}px`;
          notification.style.zIndex = "9999";
          notification.style.backgroundColor = "black";
          notification.style.padding = "1rem";
          notification.style.border = "1px solid black";
          notification.style.borderRadius = "1rem";
          notification.style.opacity = "0";
          notification.style.transition = "opacity 0.5s";
          document.body.appendChild(notification);
          setTimeout(() => {
            notification.style.opacity = "1";
          }, 10);
          setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => {
              document.body.removeChild(notification);
            }, 500);
          }, 1000);
        });
      }
    }
  }

  // 村を出るボタンの無効化とチェックボックスの追加
  function disableLeaveButtonAndAddCheckbox() {
    const leaeveButton = document.querySelector("input[value='村を出る']");
    if (leaeveButton) {
      leaeveButton.disabled = true;
      leaeveButton.style.opacity = "0.5";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "vil_leave_checkbox";
      checkbox.style.marginRight = "0.5rem";
      checkbox.style.verticalAlign = "middle";
      checkbox.addEventListener("change", (event) => {
        leaeveButton.disabled = !event.target.checked;
        leaeveButton.style.opacity = event.target.checked ? "1" : "0.5";
      });
      // add checkbox element before leave button
      leaeveButton.parentNode.insertBefore(checkbox, leaeveButton);
    }
  }

  // ページネーションの追加
  function pagination() {
    const announce = document.querySelector(".alllog_announce");
    if (!announce) {
      return;
    }
    const match = window.location.href.match(/part=(\d+)/);
    if (match) {
      const currentPart = parseInt(match[1]);
      const parts = Array.from(announce.querySelectorAll("a[href*='part']"))
        .map((a) => parseInt(a.innerText))
        .filter((n) => !isNaN(n));
      const minPart = 1;
      const maxPart = Math.max(parts[parts.length - 1], currentPart);

      const firstMessage = getFirstMessageOrAnnounce();
      const lastMessage = getLastMessageOrAnnounce();

      if (currentPart > minPart) {
        const prevButton = createPaginationButton(
          "▲前のページを読み込む",
          currentPart - 1,
          firstMessage,
          false,
          maxPart
        );
        firstMessage.parentNode.insertBefore(prevButton, firstMessage.previousSibling);
      }
      if (currentPart < maxPart) {
        const nextButton = createPaginationButton(
          "▼次のページを読み込む",
          currentPart + 1,
          lastMessage,
          true,
          maxPart
        );
        // insert next button after last message
        lastMessage.parentNode.insertBefore(nextButton, lastMessage.nextSibling);
      }
    }
  }

  function getFirstMessageOrAnnounce() {
    const content = document.querySelector("#content");
    const firstChild = content.firstElementChild;
    if (firstChild.classList.contains("alllog_announce")) {
      return firstChild.nextElementSibling;
    } else {
      return firstChild;
    }
  }

  function getLastMessageOrAnnounce() {
    const content = document.querySelector("#content");
    const lastChild = content.lastElementChild;
    if (lastChild.classList.contains("alllog_announce")) {
      return lastChild.previousSibling;
    } else {
      return lastChild;
    }
  }

  // ページネーションのボタンを作成
  function createPaginationButton(text, part, anchorMessage, isNext, maxPart) {
    const button = document.createElement("button");
    button.innerText = text;
    button.style.cursor = "pointer";
    button.style.width = "100%";
    button.style.margin = "10px 0";
    button.style.backgroundColor = "black";
    button.style.color = "#994";
    button.style.borderWidth = "0";
    button.setAttribute("data-part", part);

    button.addEventListener("click", async function () {
      const part = parseInt(this.getAttribute("data-part"));
      if ((part <= 0 && !isNext) || (part > maxPart && isNext)) {
        alert(isNext ? "最後のページです。" : "最初のページです");
        return;
      }

      const messages = await fetchPage(part, isNext);
      const anchorRectBefore = anchorMessage.getBoundingClientRect();

      messages.forEach((message) => {
        anchorMessage.parentElement.insertBefore(
          message,
          isNext ? anchorMessage.nextSibling : anchorMessage
        );
      });

      const anchorRectAfter = anchorMessage.getBoundingClientRect();
      const topDiff = anchorRectAfter.top - anchorRectBefore.top;
      window.scrollBy(0, topDiff);

      anchorMessage = messages[0];
      button.setAttribute("data-part", isNext ? part + 1 : part - 1);
    });

    return button;
  }

  // ページを取得
  async function fetchPage(part, isNext) {
    const url = window.location.href.replace(/part=\d+/, `part=${part}`);
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const html = new TextDecoder("euc-jp").decode(arrayBuffer);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const messages = Array.from(doc.querySelectorAll("#content > *")).filter(
      (e) => !e.classList.contains("alllog_announce")
    );
    return isNext ? messages.reverse() : messages;
  }

  // アンカーのAjaxを再設定
  function setAnchorToggle() {
    $(document).on("click touchstart touchend", ".say", function (event) {
      event.preventDefault();
      if ($(this).data("clicked")) {
        onSayToggleOff.call(this);
      } else {
        onSayClick.call(this);
      }
      $(this).data("clicked", !$(this).data("clicked"));
    });

    $(document).on("click", ".mes_res", function (event) {
      if ($(this).data("clicked")) {
        onMesResToggleOff.call(this);
      } else {
        onMesResClick.call(this);
      }
      $(this).data("clicked", !$(this).data("clicked"));
    });
  }

  // アンカークリック時の処理
  function onSayClick() {
    const ank = $(this);

    if (ank.text().startsWith(">>")) {
      if (!ank.attr("onmouseover")) {
        if (
          confirm(
            "このアンカーの遷移先が見つかりません。それでも移動しますか？"
          )
        ) {
          window.location.href = this.href;
        }
        return false;
      }

      const href = this.href.replace("all", "anc").replace("#", "&num=");
      $.get(href, function (data) {
        const mes = $(data).find(".anchor");
        mes.addClass("ajax");
        insertElementAfterParents(mes, ank, [".message", ".announce"]);
        mes.find(".mes_res").show();
        mes.hide().toggle("slide");
      });
    } else {
      window.open(this.href, "_blank");
    }

    return false;
  }

  // アンカー閉じる処理
  function onSayToggleOff() {
    toggleSlideAndRemove($(this), [".message", ".announce"]);
    return false;
  }

  // レスクリック時の処理
  function onMesResClick() {
    const ank = $(this);
    const text = markEscape(ank.attr("id"));
    const reg = new RegExp(text + "(?![\\d:])");

    const res = $("<div>");
    $("#content")
      .children('.message, [class^="announce"]')
      .each(function () {
        const elementText = $(this).find(".say").text();
        if (elementText.search(reg) === -1) return;

        const cloned = $(this).clone().show();
        res.append(cloned).addClass("ajax");
      });

    insertElementAfterParents(res, ank, [".message", ".announce"]);
    res.hide().toggle("slide");
  }

  // レス閉じる処理
  function onMesResToggleOff() {
    toggleSlideAndRemove($(this), [".message", ".announce"]);
    return false;
  }

  // 要素を削除
  function toggleSlideAndRemove(element, parentSelectors) {
    parentSelectors.forEach((selector) => {
      const parent = element.parents(selector);
      parent.nextAll(".ajax").toggle("slide", function () {
        parent.nextAll(".ajax").remove();
      });
    });
  }

  // 親要素の後ろに要素を挿入する
  function insertElementAfterParents(element, reference, parentSelectors) {
    parentSelectors.forEach((selector) => {
      const parent = reference.parents(selector);
      parent.after(element);
    });
  }

  // 検索ボタンを追加
  function addSearchIcon() {
    const searchIcon = `
      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDwhLS0g6Jmr55y86Y+h44Gu5YaG6YOo5YiGIC0tPgogICAgPGNpcmNsZSBjeD0iMTEiIGN5PSIxMSIgcj0iNyIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8IS0tIOiZq+ecvOmPoeOBruODj+ODs+ODieODq+mDqOWIhiAtLT4KICAgIDxsaW5lIHgxPSIxNi42NSIgeTE9IjE2LjY1IiB4Mj0iMjIiIHkyPSIyMiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=">
    `;

    const $searchBoxContainer = $("<div>", { id: "searchBoxContainer" })
      .html(
        `
      <div class="container">
        <input id="searchBox" type="text" placeholder="Search...">
        <input id="searchButton" type="button" value="検索" class="submit2" onclick="window.open('?vid=${vid}&amp;date=${date}&amp;hash=' + encodeURIComponent(metaEscape(document.querySelector('#searchBox').value)));">
      </div>
      <hr>
      <div class="container">
        <select id="filter">
        </select>
        <input id="filterButton" type="button" value="抽出" class="submit2" onclick="window.open('?vid=${vid}&amp;date=${date}&amp;id=' + encodeURIComponent(document.querySelector('#filter').value));">
      </div>
      `
      )
      .hide();

    // idAndNamesの各要素を<select>ボックスに追加します
    idAndNames.forEach((name, id) => {
      const $option = $("<option>", {
        value: id,
        text: name,
      });
      $("#filter", $searchBoxContainer).append($option);
    });

    const $searchIcon = $("<button>", { id: "searchIcon" }).html(searchIcon);

    $("#bottomButtonContainer").append($searchBoxContainer).append($searchIcon);

    $searchIcon.on("click", function (event) {
      $searchBoxContainer.toggle();
      event.stopPropagation();
    });
    $searchBoxContainer.on("click", function (event) {
      event.stopPropagation();
    });
    $("#searchButton, #filterButton", $searchBoxContainer).on("click", function () {
      $searchBoxContainer.hide();
    });
    $(document).on("click", function () {
      $searchBoxContainer.hide();
    });

    $("#searchBox").on("keydown", function (event) {
      if (event.which === 13 || event.keyCode === 13) {
        // 13 is the key code for Enter
        $("#searchButton").click(); // Trigger the click event on the button
        event.preventDefault(); // Prevent the default behavior of Enter key
      }
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  // ねじれスクリプト置換
  ////////////////////////////////////////////////////////////////////////////////

  unsafeWindow.getElementsByClass = getElementsByClass;
  unsafeWindow.setAjaxEvent = setAjaxEvent;

  function getElementsByClass(searchClass) {
    // もしsearchClassが"announce"の場合、そのクラス名を含むすべての要素を取得
    if (searchClass === "announce") {
      return Array.from(document.querySelectorAll(`[class*="${searchClass}"]`));
    }
    // それ以外の場合、クラス名が正確にマッチする要素のみを取得
    return Array.from(document.getElementsByClassName(searchClass));
  }

  // ねじれスクリプトのsetAjaxEvent関数を置換して無効化
  function setAjaxEvent(target) {
    return false;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // CSS
  ////////////////////////////////////////////////////////////////////////////////
  GM_addStyle(`
  div {
    overflow-wrap: anywhere;
    line-break: anywhere;
  }

  table.main {
    width: 100%;
  }

  body > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) {
    display: ${sideBarDisplay};
  }

  .vil_main {
    margin: auto;
    width: 552px;
  }

  .alllog_announce {
    display: ${alllogAnnounceDisplay};
  }

  a.ellipsis,
  span.ellipsis {
    font-weight: bold;
  }

  a.ellipsis {
    color: blue !important;
    font-size: 1.2rem;
    cursor: pointer;
  }

  span.ellipsis {
    font-size: 0.8rem;
  }

  textarea {
    font-size: ${textareaFontSize}rem !important;
  }

  .dialog {
    text-align: left;
    margin: 0 auto;
  }

  input[type=number] {
    width: 3rem;
    text-align: right;
  }

  button.primary, button.secondary, button.no_action_box {
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    font-size: 1rem;
    cursor: pointer;
  }

  button.primary, button.secondary {
    padding: 0.5rem 1rem;
    display: inline-block;
    margin: 0.5rem 0.5rem;
  }

  button.primary {
    background-color: #4CAF50;
  }

  button.secondary {
    background-color: #008CBA;
  }

  button.with_action_box {
    border: none;
    cursor: pointer;
    background-color: white;
    padding: 0;
  }

  button.no_action_box {
    background-color: #000000;
    padding: 0rem 1rem;
  }

  .container {
    display: flex;
    position: relative;
    justify-content: space-between;
  }

  span.right {
    margin-left: auto;
  }

  #scrollToBottomButton, #scrollToTopButton, #searchIcon {
    padding: 5px;
    cursor: pointer;
    background: #ddd;
    border: none;
    border-radius: 5px;
    transition: background 0.2s;
    margin-bottom: 10px;
  }

  #scrollToTopButton:hover, #scrollToBottomButton:hover, #searchIcon:hover {
    background: #bbb;
  }

  #scrollToTopButton {
    order: 1;
  }

  #scrollToBottomButton {
    order: 2;
  }

  #topButtonContainer, #bottomButtonContainer {
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 20px;
    z-index: 1000;
  }

  #topButtonContainer {
    top: 20px;
  }

  #bottomButtonContainer {
    bottom: 20px;
  }

  #searchBoxContainer {
    order: 1;
    align-items: center;
    padding: 5px;
    position: absolute;
    right: 55px;
    bottom: 0;
    display: none;
    background: #fff;
  }

  #searchBox, select#filter {
    width: 200px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid #aaa;
  }

  input#searchBox, select#filter {
    margin-right: 10px;
  }

  hr {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 5px 0;
  }

`);
})();
