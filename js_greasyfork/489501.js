// ==UserScript==
// @name         解除复制限制
// @namespace    https://github.com/LU-JIEJIE/copyable
// @version      1.2.0
// @author       lu-jiejie
// @description  解除部分网站的复制限制及小尾巴，如百度文库、CSDN、哔哩哔哩专栏等。
// @license      MIT
// @homepage     https://github.com/LU-JIEJIE/copyable
// @match        *://www.bilibili.com/read/*
// @match        *://blog.csdn.net/*
// @match        *://wenku.csdn.net/*
// @match        *://www.examcoo.com/editor/do/*
// @match        *://wenku.baidu.com/view/*
// @match        *://*.feishu.cn/*
// @match        *://docs.qq.com/doc/*
// @match        *://*.doc88.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/489501/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/489501/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BaiduWenku = {
    regexp: /wenku.baidu.com\/view/,
    handler: () => {
      document.querySelector(".header-wrapper").__vue__.$store.state.vipInfo.isVip = true;
      document.addEventListener("copy", async () => {
        const originClipboard = await navigator.clipboard.readText();
        const tailPattern = /(-{56,})[\s\S]*?作者：/;
        const match = tailPattern.exec(originClipboard);
        let newClipboard = originClipboard;
        if (match)
          newClipboard = originClipboard.substring(0, match.index).trim();
        navigator.clipboard.writeText(newClipboard);
      });
      document.addEventListener("keydown", (e) => {
        var _a;
        if (!(e.ctrlKey && e.key === "c") || ((_a = window.getSelection()) == null ? void 0 : _a.toString()) || document.querySelector("canvas") && !document.querySelector("#original-creader-interative-canvas-1"))
          return;
        document.querySelector(".reader-copy-button").click();
      });
    }
  };
  const stopCopyPropagation = () => {
    document.addEventListener("copy", (e) => {
      e.stopPropagation();
    }, true);
  };
  const stopSelectStartPropagation = () => {
    document.addEventListener("selectstart", (e) => {
      e.stopPropagation();
    }, true);
  };
  const enableCssUserSelect = () => {
    const css = "* {user-select: auto !important; -webkit-user-select: auto !important; cursor: auto !important;}";
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  };
  const BilibiliRead = {
    regexp: /www.bilibili.com\/read/,
    handler: () => {
      stopCopyPropagation();
    }
  };
  const CSDN = {
    regexp: /csdn/,
    handler: () => {
      stopCopyPropagation();
      enableCssUserSelect();
    }
  };
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const Doc88 = {
    regexp: /doc88.com/,
    handler: () => {
      _unsafeWindow.Config.vip = 1;
      _unsafeWindow.Config.logined = 1;
    }
  };
  const Examcoo = {
    regexp: /examcoo/,
    handler: () => {
      stopSelectStartPropagation();
      enableCssUserSelect();
    }
  };
  const Feishu = {
    regexp: /feishu.cn/,
    handler: () => {
      stopCopyPropagation();
    }
  };
  const QQDoc = {
    regexp: /docs.qq.com\/doc/,
    handler: () => {
      document.addEventListener("keydown", (e) => {
        if (!(e.ctrlKey && e.key === "c"))
          return;
        e.preventDefault();
        const selectText = _unsafeWindow.pad.editor.getCopyContent().plain;
        navigator.clipboard.writeText(selectText);
      });
    }
  };
  const websites = [
    BaiduWenku,
    BilibiliRead,
    CSDN,
    Examcoo,
    Feishu,
    QQDoc,
    Doc88
  ];
  websites.some((website) => {
    if (website.regexp.test(window.location.href)) {
      website.handler();
      return true;
    }
    return false;
  });

})();