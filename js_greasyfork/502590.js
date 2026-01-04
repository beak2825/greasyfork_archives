// ==UserScript==
// @name         Fantia TORA COIN 序列码自动填写
// @namespace    https://github.com/Jeremy-Hibiki/fantia-tora-coin-auto-fill
// @version      1.0.3
// @author       Jeremy Hibiki
// @description  Fantia TORA COIN 序列码自动填写，在任意一个输入框中黏贴，脚本将自动填充所有 4 个输入框
// @license      MIT
// @icon         https://fantia.jp/assets/customers/favicon-32x32-8ab6e1f6c630503f280adca20d089646e0ea67559d5696bb3b9f34469e15c168.png
// @homepageURL  https://github.com/Jeremy-Hibiki/fantia-tora-coin-auto-fill
// @supportURL   https://github.com/Jeremy-Hibiki/fantia-tora-coin-auto-fill/issues
// @match        https://fantia.jp/mypage/users/coins/charges
// @downloadURL https://update.greasyfork.org/scripts/502590/Fantia%20TORA%20COIN%20%E5%BA%8F%E5%88%97%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/502590/Fantia%20TORA%20COIN%20%E5%BA%8F%E5%88%97%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SERIAL_CODE_PATTERN = /^(\w{4})-(\w{4})-(\w{4})-(\w{4})$/gm;
  function autoFillInput() {
    const inputGroup = document.querySelector(".input-serial.js-input-group");
    if (!inputGroup) {
      return;
    }
    inputGroup.addEventListener("paste", (e) => {
      var _a;
      const clipboardText = (_a = e.clipboardData) == null ? void 0 : _a.getData("text");
      if (!clipboardText) {
        return;
      }
      const match = SERIAL_CODE_PATTERN.exec(clipboardText);
      if (!match || match.length !== 5) {
        return;
      }
      match.slice(1, 5).forEach((code, index) => {
        const input = inputGroup.querySelector(`#serial${index + 1}`);
        if (input) {
          input.value = code;
        }
      });
    });
  }
  autoFillInput();

})();