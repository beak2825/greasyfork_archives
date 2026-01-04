// ==UserScript==
// @name         BookmeterReviewSaver
// @namespace    https://github.com/mosaicer
// @version      1.0.0
// @description  Save reviews on Bookmeter(読書メーター) in real time
// @author       mosaicer
// @match        https://bookmeter.com/*
// run-at        document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/380676/BookmeterReviewSaver.user.js
// @updateURL https://update.greasyfork.org/scripts/380676/BookmeterReviewSaver.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const readModal = document.getElementById('modals').children[2];
  const reviewArea = readModal.getElementsByTagName('textarea')[0]
  const hiddenTextArea = reviewArea.previousSibling;

  let targetBookId = null;
  let working = false;

  const hiddenTextAreaObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // テキストが変更されたとき、キーを本のID・値を変更後のテキストで保存する
      if (mutation.addedNodes.length > 0 && targetBookId && working) {
        const text = mutation.addedNodes[0].textContent.trim();
        GM_setValue(targetBookId, text);
      }
    });
  });
  const hiddenTextAreaObserverConfig = { childList: true };

  const readModalObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // ダイアログ（モーダル）がアクティブ（前面）になったときに、監視を始める
      if (mutation.target.classList.contains('modal--active')) {
        hiddenTextAreaObserver.observe(hiddenTextArea, hiddenTextAreaObserverConfig);
      }
      // ダイアログ（モーダル）が閉じたときに、値をリセットし、動作を停止する
      else {
        working = false;
        targetBookId = null;

        hiddenTextAreaObserver.disconnect();
      }
    });
  });
  const readModalObserverConfig = { attributes: true };

  // 読んだ本として登録するダイアログ（モーダル）の監視を開始する
  readModalObserver.observe(readModal, readModalObserverConfig);

  // クリックイベントリスナのセットアップ
  document.addEventListener('click', (e) => {
    const targetNode = e.target;

    // 下記クラスを持たないノードは無視
    if (targetNode.className !== 'js-modal-button modal-button') {
      return;
    }

    // 読んだ本として登録するアクション以外は無視
    const actionText = targetNode.textContent;
    if (actionText !== '読んだ本に登録' && actionText !== '再読本に登録') {
      return;
    }

    const bookData = JSON.parse(targetNode.getAttribute('data-modal'));
    // 本情報を持っていなければ無視
    if (!bookData.hasOwnProperty('book')) {
      return;
    }

    targetBookId = bookData.book.id;

    const draft = GM_getValue(targetBookId);
    if (draft) {
      reviewArea.value = draft;

      // フォーカス＆ブラーで入力チェッカーのイベントを発火させる
      reviewArea.focus();
      reviewArea.blur();
    }

    // 登録ボタン押下を動作開始の契機とする
    working = true;
  }, false);
})();