// ==UserScript==
// @name         微博默认按照最新时间排序
// @namespace    npm/vite-plugin-monkey
// @version      0.0.3
// @author       kazoottt
// @description  将网页版的微博自动设置为最新微博（按时间顺序）浏览
// @license      MIT
// @icon         https://weibo.com/favicon.ico
// @match        https://weibo.com/**
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/498729/%E5%BE%AE%E5%8D%9A%E9%BB%98%E8%AE%A4%E6%8C%89%E7%85%A7%E6%9C%80%E6%96%B0%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/498729/%E5%BE%AE%E5%8D%9A%E9%BB%98%E8%AE%A4%E6%8C%89%E7%85%A7%E6%9C%80%E6%96%B0%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const useOption = (key, title, defaultValue) => {
    if (typeof _GM_getValue === "undefined") {
      return {
        value: defaultValue
      };
    }
    let value = _GM_getValue(key, defaultValue);
    const ref = {
      get value() {
        return value;
      },
      set value(v) {
        value = v;
        _GM_setValue(key, v);
        location.reload();
      }
    };
    _GM_registerMenuCommand(`${title}: ${value ? "✅" : "❌"}`, () => {
      ref.value = !value;
    });
    return ref;
  };
  const timelineDefault = useOption(
    "isDanmakuScrollModeLocked",
    "默认最新微博",
    true
  );
  if (timelineDefault.value && (location.href === "https://weibo.com/" || location.href === "https://weibo.com")) {
    const clickElement = () => {
      const element = document.querySelector('[role="link"][title="最新微博"]');
      if (element) {
        element.click();
      } else {
        setTimeout(clickElement, 1e3);
      }
    };
    clickElement();
  }

})();