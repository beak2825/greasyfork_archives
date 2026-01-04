// ==UserScript==
// @name         [掘金]自动签到
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @author       sutie
// @description  在用户打开掘金页面后, 自动签到, 每天最多签到一次. 基于iframe实现, 不用担心接口被禁. 只支持 Chrome80+ 浏览器.
// @license      MIT
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png
// @match        https://juejin.cn/*
// @grant        none
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/457881/%5B%E6%8E%98%E9%87%91%5D%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/457881/%5B%E6%8E%98%E9%87%91%5D%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
  "use strict";
  const NAMESPACE = "juejin-auto-check";
  const LOCAL_STORAGE_KEY = "tampermonkey-" + NAMESPACE;
  function getDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function createIframe(id) {
    const iframe = document.createElement("iframe");
    iframe.id = id;
    iframe.style.position = "fixed";
    iframe.style.top = "120px";
    iframe.style.right = "24px";
    iframe.style.width = "375px";
    iframe.style.height = "850px";
    iframe.style.zIndex = "1000";
    iframe.src = "https://juejin.cn/user/center/signin";
    return iframe;
  }
  function removeIframe(id) {
    const ele = document.getElementById(id);
    if (ele) {
      document.body.removeChild(ele);
    }
  }
  function updateBtn() {
    const signInBtn = document.querySelector(".signin-btn");
    if (signInBtn) {
      signInBtn.classList.remove("signin-btn");
      signInBtn.classList.add("signedin-btn");
    }
    const textEle = signInBtn == null ? void 0 : signInBtn.querySelector(".btn-text");
    if (textEle) {
      textEle.classList.add("signed-text");
      textEle.textContent = "已签到";
    }
  }
  function signIn() {
    const id = `iframe-${Math.ceil(Math.random() * 100)}`;
    const iframe = createIframe(id);
    document.body.prepend(iframe);
    iframe.onload = () => {
      const dialog = document.getElementById(id);
      if (dialog && dialog.contentDocument) {
        const btn = dialog.contentDocument.querySelector(".signin.btn");
        if (btn) {
          btn.click();
        }
        const timer = setTimeout(() => {
          clearTimeout(timer);
          removeIframe(id);
          updateBtn();
        }, 1e3);
      }
    };
  }
  function main() {
    const latestDay = localStorage.getItem(LOCAL_STORAGE_KEY);
    const today = getDate();
    if (!latestDay || latestDay !== today) {
      try {
        signIn();
        localStorage.setItem(LOCAL_STORAGE_KEY, today);
      } catch (error) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }
  main();
})();
