// ==UserScript==
// @name         wolai 文档助手
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  窗口化预览任意PDF，Word，支持打开多个预览窗口，缩放，拖拽，最小化，并且页面变化时预览窗口不会消失
// @author       请个神
// @match        *://*.wolai.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://unpkg.com/layui@2.8.11/dist/layui.js
// @resource css https://unpkg.com/layui@2.8.11/dist/css/layui.css
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471255/wolai%20%E6%96%87%E6%A1%A3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/471255/wolai%20%E6%96%87%E6%A1%A3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
  "use strict";
  const link = document.createElement("link");
  const layer = window.layer;
  const $ = window.layui.$;
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/layui@2.8.11/dist/css/layui.css";
  document.head.appendChild(link);

  function debounce(fn, delay = 1000, immediate = true) {
    let timer = null;
    return function (...args) {
      if (timer) clearTimeout(timer);
      immediate && !timer && fn.apply(this, args);
      timer = setTimeout(() => {
        timer = null;
        !immediate && fn.apply(this, args);
      }, delay);
    };
  }

  const open = debounce((title, url, token) => {
    layer.open({
      type: 2,
      title,
      maxmin: true,
      area: ["70vw", "90vh"],
      content: url,
      shade: 0,
      zIndex: layer.zIndex,
      moveOut: true,
      success: function (layero, index) {
        layer.setTop(layero);
        try {
          const event = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
          });
          $(".wolaiModal")[0].dispatchEvent(event);
        } catch (e) {}
        // 授权，不然显示无权访问（关键步骤）
        layero.find("iframe")[0].contentWindow.postMessage(
          JSON.stringify({
            eventName: "setToken",
            data: { token: token, timeout: 1000000 },
          }),
          "*"
        );
      },
    });
  });
  const modalLogic = function (url, apiUrl, iframeUrlField) {
    if (url.includes(apiUrl)) {
      const title = $(".node-selected-shadow:visible")
        .siblings()
        .find("._3gmvl")
        .text();
      const data = JSON.parse(this.responseText);
      const url = data.data[iframeUrlField];
      const token = data.data.AccessToken;

      open(title, url, token);
    }
  };

  // 拦截器
  const originalOpen = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function () {
    var method = arguments[0];
    var url = arguments[1];
    this.addEventListener("load", function () {
      modalLogic.call(this, url, "getOfficePreviewURL", "PreviewURL");
      modalLogic.call(this, url, "getWebOfficeURL", "WebofficeURL");
    });
    originalOpen.apply(this, arguments);
  };
})();
