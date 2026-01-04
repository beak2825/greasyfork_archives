// ==UserScript==
// @name         エンター2回でメッセージ送信
// @version      1.0
// @description  エンター2回でメッセージを送信する
// @author       recursive
// @match        https://www.chatpdf.com/*
// @grant        GM_getValue
// @license      MIT
// @namespace https://greasyfork.org/users/1090562
// @downloadURL https://update.greasyfork.org/scripts/467862/%E3%82%A8%E3%83%B3%E3%82%BF%E3%83%BC2%E5%9B%9E%E3%81%A7%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E9%80%81%E4%BF%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/467862/%E3%82%A8%E3%83%B3%E3%82%BF%E3%83%BC2%E5%9B%9E%E3%81%A7%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E9%80%81%E4%BF%A1.meta.js
// ==/UserScript==

const enterKeyHistory = new WeakMap();

function handleCtrlEnter(event) {
  const isEnter = event.key === "Enter";
  const isTextarea = event.target.tagName === "TEXTAREA";
  const isShiftPressed = event.shiftKey;
  const isCtrlOrMetaPressed = event.ctrlKey || event.metaKey;

  if (isEnter && isTextarea) {
    const lastEnterPressTime = enterKeyHistory.get(event.target) || 0;
    const currentTime = Date.now();
    const isDoubleEnter = currentTime - lastEnterPressTime < 500; // 500ms以内に2回Enterを押すと送信する

    if (isShiftPressed) {
      // Shift+Enterで改行
      event.stopPropagation();
    } else if (isDoubleEnter || isCtrlOrMetaPressed) {
      // 2回目のEnterまたはCtrl+Enter、Cmd+Enterで送信
      enterKeyHistory.delete(event.target);
    } else {
      // 最初のEnterキー押下を記録し、送信しない
      event.preventDefault();
      event.stopPropagation();
      enterKeyHistory.set(event.target, currentTime);
    }
  }
}

function enableSendingWithCtrlEnter() {
  document.addEventListener("keydown", handleCtrlEnter, { capture: true });
}

function disableSendingWithCtrlEnter() {
  document.removeEventListener("keydown", handleCtrlEnter, { capture: true });
}

// ストレージからisEnabledの値を取得
const isEnabled = GM_getValue("isEnabled", true);
if (isEnabled) {
  enableSendingWithCtrlEnter();
}

window.addEventListener("storage", (event) => {
  if (event.key === "isEnabled") {
    const isEnabled = event.newValue !== "false";
    if (isEnabled) {
      enableSendingWithCtrlEnter();
    } else {
      disableSendingWithCtrlEnter();
    }
  }
});
