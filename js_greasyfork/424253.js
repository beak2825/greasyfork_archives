// ==UserScript==
// @name         页面小优化(知乎/CSDN/简书)
// @icon         https://avatars.githubusercontent.com/u/43409097?v=4
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  (知乎：移除登录弹窗；CSDN：移除登录弹窗、免登录复制；简书：移除登录弹窗；)
// @author       leekbillow
// @homepage     https://github.com/leekbillow/customTampermonkey
// @match        https://*.zhihu.com/*
// @match        https://*.blog.csdn.net/*
// @match        https://*.jianshu.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/424253/%E9%A1%B5%E9%9D%A2%E5%B0%8F%E4%BC%98%E5%8C%96%28%E7%9F%A5%E4%B9%8ECSDN%E7%AE%80%E4%B9%A6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424253/%E9%A1%B5%E9%9D%A2%E5%B0%8F%E4%BC%98%E5%8C%96%28%E7%9F%A5%E4%B9%8ECSDN%E7%AE%80%E4%B9%A6%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  switch (true) {
    case /\bblog\.csdn\.net\b(?!\.)/.test(location.hostname): {
      // CSDN
      GM_addStyle(`
        .passport-login-container,
        #passportbox
        {
            display:none!important
        }
        code
        {
          user-select:text!important;
        }
        .hljs-button
        {
          display:none!important;
        }
      `);
      document.body.querySelector("#content_views").oncopy = function () {
        GM_setClipboard(getSelection().toString());
      };
      break;
    }
    case /\bzhihu\.com\b(?!\.)/.test(location.hostname): {
      // 知乎
      // 不移除搜索结果
      if (location.pathname === "/search") document.querySelector(".List").removeChild = () => null;
      // 移除登录tooltip
      GM_addStyle(`
        .css-1wq6v87,
        .css-yoby3j
        {
          display:none!important;
        }
      `);
      //添加限制样式
      let bhuStyle = GM_addStyle(`
        .Modal-wrapper,
        .Modal-backdrop,
        .signFlowModal
        {
            display:none!important;
        }
      `);
      // 弹窗数量，专栏为2
      let rubbishDialogQuantity = 1 + /\bzhuanlan\.zhihu\.com\b(?!\.)/.test(location.hostname),
        clicked = [];
      // 取消首次自动弹出登录框,解除监听
      let removeStyle = function () {
          bhuStyle.remove();
        },
        targetNode = document.body,
        observerOptions = {
          childList: true,
          subtree: true,
        },
        observer = new MutationObserver(function (mutationList, observer) {
          let rubbishDialogCloseButtons = document.querySelectorAll(".Modal-closeButton");
          if (rubbishDialogCloseButtons.length > 0) {
            // 关闭弹窗
            rubbishDialogCloseButtons.forEach((E) => {
              if (clicked.includes(E)) return;
              E.click();
              clicked.push(E);
              if (--rubbishDialogQuantity < 1) {
                observer.disconnect();
                let loginButton = document.querySelector(".AppHeader-login");
                loginButton && (loginButton.onclick = () => removeStyle());
              }
            });
          } else return;
        });
      observer.observe(targetNode, observerOptions);
      //3秒后移除监听
      setTimeout(() => (observer.disconnect(), removeStyle()), 3000);
      break;
    }
    case /\bjianshu\.com\b(?!\.)/.test(location.hostname): {
      // 简书
      GM_addStyle(`
        body>div:last-child
        {
          display:none!important
        }
        body
        {
            overflow:auto!important
        }
      `);
      break;
    }
    default:
      break;
  }
})();
