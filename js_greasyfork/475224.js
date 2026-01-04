// ==UserScript==
// @name         Twitter (X) 片思い表示
// @namespace    https://kuds.win/
// @version      1.3
// @description  Twitter (X) で片思いフォロー中のアカウントのみを表示できます。また、両思いフォロー中のアカウントは強調表示できます。
// @author       KUDs
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/475224/Twitter%20%28X%29%20%E7%89%87%E6%80%9D%E3%81%84%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/475224/Twitter%20%28X%29%20%E7%89%87%E6%80%9D%E3%81%84%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // デフォルト状態（非表示・ハイライト無し）
  let isHiding = false;
  let isHighlighting = false;

  // 更新処理のスケジューリングフラグ
  let updateScheduled = false;

  // 共通スタイルのボタン作成
  function createStyledButton(text, clickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    Object.assign(button.style, {
      border: "none",
      borderRadius: "20px",
      padding: "10px 20px",
      marginTop: "10px",
      cursor: "pointer",
      transition: "filter 0.3s, transform 0.3s",
    });
    button.addEventListener("mouseover", () => {
      button.style.filter = "brightness(1.25)";
      button.style.transform = "scale(1.05)";
    });
    button.addEventListener("mouseout", () => {
      button.style.filter = "brightness(1)";
      button.style.transform = "scale(1)";
    });
    button.addEventListener("click", clickHandler);
    return button;
  }

  // 片思い表示ボタンのクリックハンドラ
  function handleHideButtonClick() {
    isHiding = !isHiding;
    hideButton.textContent = isHiding ? "片思い ONLY: ON" : "片思い ONLY: OFF";
    hideButton.style.backgroundColor = isHiding ? "skyblue" : "gray";
    scheduleDOMUpdate();
  }

  // 両思いハイライトボタンのクリックハンドラ
  function handleHighlightButtonClick() {
    isHighlighting = !isHighlighting;
    highlightButton.textContent = isHighlighting
      ? "両思い HIGHLIGHT: ON"
      : "両思い HIGHLIGHT: OFF";
    highlightButton.style.backgroundColor = isHighlighting ? "pink" : "gray";
    scheduleDOMUpdate();
  }

  const hideButton = createStyledButton(
    "片思い ONLY: OFF",
    handleHideButtonClick
  );
  hideButton.style.backgroundColor = "gray";

  const highlightButton = createStyledButton(
    "両思い HIGHLIGHT: OFF",
    handleHighlightButtonClick
  );
  highlightButton.style.backgroundColor = "gray";
  highlightButton.style.display = "none";

  // ボタン配置の初期化
  function initializeButtons() {
    const targetNavElement = document.querySelector(
      '[data-testid="SideNav_NewTweet_Button"]'
    );
    if (targetNavElement) {
      const parentNavElement = targetNavElement.parentNode;
      if (parentNavElement && !hideButton.parentNode) {
        parentNavElement.appendChild(hideButton);
        parentNavElement.appendChild(highlightButton);
      }
    }
  }

  // cellInnerDiv の表示更新
  function updateCellInnerDivVisibility(node) {
    if (
      node.textContent.includes("フォローされています") ||
      node.textContent.includes("両思いです♡")
    ) {
      node.style.display = isHiding ? "none" : "";
    }
  }

  // userFollowIndicator の更新
  function updateFollowIndicator(node) {
    if (
      node.textContent.trim() === "フォローされています" ||
      node.textContent.trim() === "両思いです♡"
    ) {
      const spanElement = node.querySelector("span");
      if (isHighlighting) {
        node.style.backgroundColor = "pink";
        if (spanElement) spanElement.textContent = "両思いです♡";
      } else {
        node.style.backgroundColor = "";
        if (spanElement) spanElement.textContent = "フォローされています";
      }
    }
  }

  // 一括して DOM を更新する処理
  function performDOMUpdate() {
    // 各 cellInnerDiv の更新
    document
      .querySelectorAll('div[data-testid="cellInnerDiv"]')
      .forEach(updateCellInnerDivVisibility);
    // 各 userFollowIndicator の更新
    document
      .querySelectorAll('[data-testid="userFollowIndicator"]')
      .forEach(updateFollowIndicator);

    // ボタンの表示切替（片思い表示時はハイライトボタンを非表示）
    highlightButton.style.display = isHiding ? "none" : "";
    initializeButtons();
    updateScheduled = false;
  }

  // 更新をスケジュールする（複数回のミューテーションがあっても1フレーム内にまとめて実行）
  function scheduleDOMUpdate() {
    if (!updateScheduled) {
      updateScheduled = true;
      requestAnimationFrame(performDOMUpdate);
    }
  }

  // MutationObserver で DOM の変化を監視
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          // 新規追加ノードがボタンの配置対象の場合
          if (
            node.matches &&
            node.matches('[data-testid="SideNav_NewTweet_Button"]')
          ) {
            initializeButtons();
          }
          // cellInnerDiv の処理
          if (node.matches && node.matches('div[data-testid="cellInnerDiv"]')) {
            updateCellInnerDivVisibility(node);
          }
          // userFollowIndicator の処理
          if (
            node.matches &&
            node.matches('[data-testid="userFollowIndicator"]')
          ) {
            updateFollowIndicator(node);
          }
        });
      }
    });
    scheduleDOMUpdate();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // 初期化
  initializeButtons();
})();
