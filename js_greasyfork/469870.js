// ==UserScript==
// @name         Nejire Refine Old
// @namespace    http://nejiten.halfmoon.jp/
// @version      0.3.9
// @description  ねじれ天国のUIを使いやすくするスクリプトです。
// @author       euro_s
// @match        http://nejiten.halfmoon.jp/index.cgi?vid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=halfmoon.jp
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469870/Nejire%20Refine%20Old.user.js
// @updateURL https://update.greasyfork.org/scripts/469870/Nejire%20Refine%20Old.meta.js
// ==/UserScript==
 
(function () {
  // 各機能ごとの有効フラグ。不要なものは true を false にすると無効になります。
  const BLOCK_LITERATURE = true; // 文学ブロッカー
  const ADJUST_SEARCH_BOX = true; // 検索窓幅調整
  const REMOVE_SIDE_LIST = true; // 左リスト畳み込み＆発言入力欄ズームなし
  const CONFIRM_EXIT = true; // 村を出るボタンに確認ダイアログ追加 **現在動作しません**
  const BLOCK_DOUBLE_CLICK = true; // 発言ボタン2度押し抑止
  const HIDE_LOG_LINK = true; // ログのページ分割リンクを折りたたむ
  const HIDE_SECRET_FORM = true; // 秘話のフォームを折りたたむ
  const BLOCK_TAPESTRY = true; // 画像タペストリーをブロックする
  const BLOCK_CONTINUOUS = true; // 連投をブロックする
 
  // BLK_MAX_LENGTH 以上の文字数を短縮表示する
  const BLOCK_MAX_LENGTH = 800;
 
  // 発言フォームのフォントサイズ倍率
  const FONT_SIZE = 1.5;
 
  // 連投の代わりに表示される発言のHTML
  const BLOCKED_MESSAGE = '<div class="small_voice">連投あぼーん <i>by Nejire Refine</i></div>';
 
  if (
    document.readyState == "complete" ||
    document.readyState == "loaded" ||
    document.readyState == "interactive"
  ) {
    if (BLOCK_LITERATURE) {
      blockLiterature();
    }
    if (ADJUST_SEARCH_BOX) {
      adjustSearchBox();
    }
    if (REMOVE_SIDE_LIST) {
      removeSidebar();
    }
    if (CONFIRM_EXIT) {
      confirmExit();
    }
    if (BLOCK_DOUBLE_CLICK) {
      disableSubmit();
    }
    if (HIDE_LOG_LINK) {
      hideLogLink();
    }
    if (HIDE_SECRET_FORM) {
      hideSecretForm();
    }
    if (BLOCK_TAPESTRY) {
      blockTapestry();
    }
    if (BLOCK_CONTINUOUS) {
      blockContinuousPost();
    }
  }
 
  // 文学ブロッカー
  function blockLiterature() {
    // 表示変更リンクのテキスト
    const OPEN_MES = "▼全文表示";
    const CLOSE_MES = "▲短縮表示";
 
    function createOpenDiv(mes_num) {
      let div = document.createElement("div");
      div.style.color = "blue";
      let a = document.createElement("a");
      a.id = "open" + mes_num;
      a.innerText = OPEN_MES;
      a.style.cursor = "pointer";
      div.append(a);
      return div;
    }
 
    function createCloseDiv(mes_num) {
      let div = document.createElement("div");
      div.style.color = "blue";
      let a = document.createElement("a");
      a.id = "close" + mes_num;
      a.innerText = CLOSE_MES;
      a.style.cursor = "pointer";
      div.append(a);
      return div;
    }
 
    function createMsgDiv(msg, id) {
      let div = document.createElement("div");
      div.id = id;
      div.innerText = msg;
 
      return div;
    }
 
    let mes = document.querySelectorAll("[class$=body1]");
    for (let i = 0; i < mes.length; i++) {
      if (BLOCK_MAX_LENGTH < mes[i].innerText.length) {
        let msg = mes[i].innerText;
        let shortMsg = msg.slice(0, BLOCK_MAX_LENGTH) + "...\n\n";
        mes[i].innerText = "";
 
        // 長文を退避
        let msgDiv = createMsgDiv(msg, "msg" + i);
        let closeDiv = createCloseDiv(i);
        msgDiv.append(closeDiv);
        msgDiv.style.display = "none";
 
        // 短縮文を作成
        let shortMsgDiv = createMsgDiv(shortMsg, "shortMsg" + i);
        let openDiv = createOpenDiv(i);
        shortMsgDiv.append(openDiv);
 
        // クリック時に開閉を呼ぶようにイベントリスナ設定
        closeDiv.addEventListener("click", function () {
          toggle(i, true);
        });
        openDiv.addEventListener("click", function () {
          toggle(i, false);
        });
 
        // 追記
        mes[i].append(shortMsgDiv);
        mes[i].append(msgDiv);
      }
    }
 
    function toggle(i, isOpened) {
      const msgDivId = "msg" + i;
      const shortMsgDivId = "shortMsg" + i;
      let msgDiv = document.getElementById(msgDivId);
      let shortMsgDiv = document.getElementById(shortMsgDivId);
 
      if (isOpened) {
        // 全文表示から短縮表示に切り替える
        msgDiv.style.display = "none";
        shortMsgDiv.style.display = "inline";
 
        // 短縮時に発言が詰まってしまうので元発言のトップにスクロール
        shortMsgDiv.scrollIntoView(true);
      } else {
        // 短縮表示から全文表示に切り替える
        shortMsgDiv.style.display = "none";
        msgDiv.style.display = "inline";
      }
    }
  }
 
  // 検索窓幅調整
  function adjustSearchBox() {
    var target = document.querySelector("input#cse-search-box");
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        target.style.width = "auto";
      });
    });
 
    var config = { attributes: true, childList: true, characterData: true };
    observer.observe(target, config);
  }
 
  // 左リスト削除
  function removeSidebar() {
    var side = document.querySelector("#side");
    var side2 = document.querySelector("#side2");
    var sides = document.createElement("div");
    sides.id = "sides";
    sides.style.display = "none";
    sides.appendChild(side);
    sides.appendChild(side2);
    var btn = document.createElement("span");
    var btnMsg = document.createTextNode("リスト・検索窓を開く▼");
    btn.id = "btn";
    btn.classList.add("hope_toggle");
    btn.appendChild(btnMsg);
    btn.onclick = () => {
      if (sides.style.display === "none") {
        btn.innerText = btn.innerText.replace("開く▼", "閉じる▲");
        sides.style.display = "block";
      } else {
        btn.innerText = btn.innerText.replace("閉じる▲", "開く▼");
        sides.style.display = "none";
      }
    };
    var content = document.querySelector("#content");
    content.appendChild(btn);
    content.appendChild(sides);
 
    document.querySelector(
      "body > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1)"
    ).style.display = "none";
    document.querySelector("#main > td:nth-child(1)").style.display = "none";
    document.querySelector(
      "body > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(5) > td:nth-child(1)"
    ).style.display = "none";
    document.querySelector(
      "body > table > tbody > tr > td > table"
    ).style.width = "auto";
    document.querySelector("table.vil_main").parentElement.style.width =
      "554px";
 
    // 発言フォームのフォントサイズ変更（フォーカス時にズームされないようにする）
    let textAreas = document.querySelectorAll("textarea");
    Array.from(textAreas).forEach((ta) => {
      ta.style.fontSize = FONT_SIZE + "rem";
    });
  }
 
  // 村を出るボタンに確認ダイアログ追加
  function confirmExit() {
    var exit = document.querySelector('input[value="村を出る"]');
    if (exit) {
      var form = exit.closest("form");
      form.onsubmit = () => {
        if (window.confirm("村を出ますか？")) {
          return true;
        } else {
          return false;
        }
      };
    }
  }
 
  // 発言ボタン2度押し防止
  function disableSubmit() {
    let forms = Array.from(document.querySelectorAll("form"));
    let btn = Array.from(document.querySelectorAll('input[type="submit"]'));
 
    forms.forEach((form) => {
      form.onsubmit = () => {
        btn.forEach((b) => {
          b.disabled = true;
        });
      };
    });
  }
 
  // ログのページ分割リンクを折りたたむ
  function hideLogLink() {
    function addButton(element, id) {
      var btn = document.createElement("span");
      var btnMsg = document.createTextNode("ページリンクを開く▼");
      btn.id = id;
      btn.classList.add("hope_toggle");
      btn.appendChild(btnMsg);
      btn.onclick = () => {
        if (element.style.display === "none") {
          btn.innerText = btn.innerText.replace("開く▼", "閉じる▲");
          element.style.display = "block";
        } else {
          btn.innerText = btn.innerText.replace("閉じる▲", "開く▼");
          element.style.display = "none";
        }
      };
      element.parentElement.prepend(btn);
    }
 
    const links = document.querySelectorAll(".alllog_announce");
    if (links[0]) {
      links[0].style.display = "none";
      addButton(links[0], "top");
    }
    if (links[1]) {
      links[1].style.display = "none";
      addButton(links[1], "bottom");
    }
  }
 
  function hideSecretForm() {
    // アクション用トグルの margin を変更する
    const act_toggle = document.getElementById("act_tog");
    if (act_toggle) {
      act_toggle.style.marginLeft = "0px";
    } else {
      return;
    }
 
    const secret = document.querySelector(".secret_textarea");
    if (secret) {
      const tr = secret.parentElement.parentElement;
      tr.style.display = "none";
 
      var btn = document.createElement("span");
      var btnMsg = document.createTextNode("秘");
      btn.classList.add("hope_toggle");
      btn.appendChild(btnMsg);
      btn.onclick = () => {
        if (tr.style.display === "none") {
          tr.style.display = "table-row";
        } else {
          tr.style.display = "none";
        }
      };
 
      act_toggle.parentElement.appendChild(btn);
    }
  }
 
  function blockTapestry() {
    const messages = document.querySelectorAll('[class$=body1]');
    messages.forEach((message) => {
      const imgs = message.querySelectorAll('img');
      if (imgs.length > 5) {
        imgs.forEach((img) => {
          img.parentElement.removeChild(img);
        });
      }
    });
  }
 
  // 連続投稿をブロックする
  function blockContinuousPost() {
    const continues = [];
    const messages = document.querySelectorAll('[class$=body1]');
    for (let i = 1; i < messages.length; i++) {
      const prev = messages[i - 1];
      const current = messages[i];
      const prevBody = prev.innerText;
      const currentBody = current.innerText;
      if (prevBody === currentBody) {
        continues.push(current);
      }
    }
    continues.forEach((continueMessage) => {
      continueMessage.innerHTML = BLOCKED_MESSAGE;
    });
  }
 
 
  // 枠破壊防止
  GM_addStyle(`
    div {
        overflow-wrap: anywhere;
        line-break: anywhere;
    }
`);
})();