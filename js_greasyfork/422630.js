// ==UserScript==
// @name         恢复右键功能
// @namespace    https://github.com/yujinpan/tampermonkey-extension
// @version      1.0
// @license      MIT
// @description  解除右键菜单的禁用。
// @author       yujinpan
// @include      http*://**
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/422630/%E6%81%A2%E5%A4%8D%E5%8F%B3%E9%94%AE%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/422630/%E6%81%A2%E5%A4%8D%E5%8F%B3%E9%94%AE%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(() => {
  EventTarget.prototype.addEventListener_ = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function () {
    if (arguments[0] === 'contextmenu') {
      const cb = arguments[1];
      arguments[1] = (e) => {
        e.preventDefault = () => {};
        cb(e);
      };
    }
    this.addEventListener_.apply(this, arguments);
  };
})();