// ==UserScript==
// @name        Gemini Copy Text Button
// @namespace   https://qestir.hatenablog.com/entry/2024/06/23/153328
// @match       https://gemini.google.com/*
// @grant       none
// @version     1.4.1
// @description Google Gemini（Advanced）の自分の質問からテキストをコピーするボタンを追加します。
// @author      qestir
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/498639/Gemini%20Copy%20Text%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/498639/Gemini%20Copy%20Text%20Button.meta.js
// ==/UserScript==

(function() {
  // テキストをコピーする関数
  function copyTextToClipboard(text) {
    // 一時的なテキストエリアを作成
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // テキストエリアをドキュメントに追加
    document.body.appendChild(textArea);

    // テキストを選択
    textArea.select();

    try {
      // クリップボードにコピー
      var successful = document.execCommand('copy');
      var msg = successful ? 'コピーに成功しました！' : 'コピーに失敗しました。';
      showNotification(msg, successful ? 'success' : 'error');
    } catch (err) {
      console.error('テキストのコピーに失敗しました', err);
      showNotification('コピーに失敗しました。', 'error');
    }

    // テキストエリアをドキュメントから削除
    document.body.removeChild(textArea);
  }

  // 通知を表示する関数
  function showNotification(message, type) {
    var notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 20px';
    notification.style.color = 'white';
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '1000';
    document.body.appendChild(notification);

    setTimeout(function() {
      document.body.removeChild(notification);
    }, 3000);
  }

  // テキストをコピーするボタンを作成する関数
  function createCopyButton(targetElement) {
    // コピー用ボタンを作成
    var button = document.createElement("button");
    button.textContent = "コピー";
    button.style.marginLeft = "10px";
    button.style.padding = "5px 10px";
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";

    // ボタンにホバースタイルを追加
    button.addEventListener("mouseover", function() {
      button.style.backgroundColor = "#45a049";
    });
    button.addEventListener("mouseout", function() {
      button.style.backgroundColor = "#4CAF50";
    });

    // ボタンがクリックされた時の処理
    button.addEventListener("click", function() {
      // query-textクラスのテキストのみを取得
      var textElement = targetElement.querySelector(".query-text");
      if (textElement) {
        var text = textElement.textContent;
        copyTextToClipboard(text);
      }
    });

    // 対象の要素にボタンを追加
    targetElement.appendChild(button);
  }

  // 特定のクラス名の要素にボタンを追加する関数
  function addCopyButtons() {
    var userQueryElements = document.querySelectorAll("user-query");
    userQueryElements.forEach(function(element) {
      if (!element.querySelector("button")) {
        createCopyButton(element);
      }
    });
  }

  // MutationObserverの設定
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // 要素ノードの場合
          var userQueryElements = node.querySelectorAll("user-query");
          userQueryElements.forEach(function(element) {
            createCopyButton(element);
          });
        }
      });
    });
  });

  // 監視を開始
  observer.observe(document.body, { childList: true, subtree: true });

  // 初回実行
  addCopyButtons();
})();