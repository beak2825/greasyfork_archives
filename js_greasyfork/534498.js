// ==UserScript==
// @name            账号切换器
// @name:en         TikTok Account Switcher
// @namespace       http://tampermonkey.net/
// @version         0.3.1
// @author          Lisulei
// @description     一个用于切换TikTok账号的工具，基于cookie配置，需要GM_cookie API权限
// @description:en  A tool for switching TikTok accounts based on cookie configuration, requires GM_cookie API permission
// @license         MIT
// @icon            https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @include         *://*.tiktok.com/*
// @include         *://tiktok.com/*
// @include         https://*.tiktok.com/*
// @include         https://tiktok.com/*
// @include         http://*.tiktok.com/*
// @include         http://tiktok.com/*
// @include         *.tiktok.com/*
// @include         tiktok.com/*
// @match           *://*.tiktok.com/*
// @match           *://tiktok.com/*
// @match           http://tiktok.com/*
// @match           https://tiktok.com/*
// @match           http://*.tiktok.com/*
// @match           https://*.tiktok.com/*
// @match           http://www.tiktok.com/*
// @match           https://www.tiktok.com/*
// @match           http://m.tiktok.com/*
// @match           https://m.tiktok.com/*
// @match           http://vm.tiktok.com/*
// @match           https://vm.tiktok.com/*
// @match           http://vt.tiktok.com/*
// @match           https://vt.tiktok.com/*
// @require         https://cdn.tailwindcss.com
// @connect         tiktok.com
// @connect         *.tiktok.com
// @connect         www.tiktok.com
// @connect         m.tiktok.com
// @connect         vm.tiktok.com
// @connect         vt.tiktok.com
// @grant           GM_addStyle
// @grant           GM_cookie
// @grant           GM_deleteValue
// @grant           GM_getValue
// @grant           GM_listValues
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           unsafeWindow
// @grant           window.close
// @grant           window.focus
// @run-at          document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/534498/%E8%B4%A6%E5%8F%B7%E5%88%87%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/534498/%E8%B4%A6%E5%8F%B7%E5%88%87%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(' .gu-mirror{position:fixed!important;margin:0!important;z-index:9999!important;opacity:.8;-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";filter:alpha(opacity=80)}.gu-hide{display:none!important}.gu-unselectable{-webkit-user-select:none!important;-moz-user-select:none!important;-ms-user-select:none!important;user-select:none!important}.gu-transit{opacity:.2;-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";filter:alpha(opacity=20)} ');

(function () {
  'use strict';

  GM_addStyle(`
    #tk-account-panel, #tk-login-panel, #tk-toggle-panel, #tk-login-backdrop {
        font-family: 'Inter', sans-serif;
    }

    /* 确保所有按钮文本横向显示 */
    #tk-switch-account, [data-switch], .tk-horizontal-text {
        writing-mode: horizontal-tb !important;
        text-orientation: mixed !important;
    }

    #tk-switch-account span, [data-switch] span, .tk-horizontal-text span {
        display: inline-block;
        writing-mode: horizontal-tb !important;
        text-orientation: mixed !important;
    }

    /* 修复select元素样式不对称问题 */
    select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.5rem center;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem !important;
    }

    /* 暗黑模式下select箭头的颜色 */
    @media (prefers-color-scheme: dark) {
        select {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ccc'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
        }
    }
    html.dark select, .dark-theme select, html[data-theme="dark"] select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ccc'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    }

    .tk-side-btn {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background-color: #0ea5e9;
        color: white;
        border-top-left-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
        box-shadow: -2px 3px 10px rgba(0, 0, 0, 0.15);
        z-index: 99999;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 15px 8px;
        writing-mode: vertical-lr;
        text-orientation: upright;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 2px;
        border: none;
    }

    .tk-side-btn:hover {
        background-color: #0284c7;
        box-shadow: -3px 5px 15px rgba(0, 0, 0, 0.2);
        padding-right: 12px;
    }

    #tk-login-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        backdrop-filter: blur(2px);
        animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes scaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }

    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    /* Toast通知样式 */
    .tk-toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 100000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 350px;
    }

    .tk-toast {
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: toastIn 0.3s ease;
        display: flex;
        align-items: center;
        overflow: hidden;
    }

    .tk-toast-success {
        background-color: #10b981;
    }

    .tk-toast-error {
        background-color: #ef4444;
    }

    .tk-toast-warning {
        background-color: #f59e0b;
    }

    .tk-toast-info {
        background-color: #3b82f6;
    }

    /* 确认对话框样式 */
    .tk-confirm-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100001;
        backdrop-filter: blur(2px);
        animation: fadeIn 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tk-confirm-dialog {
        background-color: white;
        border-radius: 12px;
        padding: 20px;
        width: 320px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        animation: confirmScaleIn 0.3s ease;
        position: relative;
        margin: 0 auto;
    }

    @keyframes confirmScaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }

    .tk-confirm-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 15px;
        color: #1f2937;
    }

    .tk-confirm-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    }

    .tk-confirm-cancel {
        background-color: #f3f4f6;
        color: #4b5563;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        border: none;
        font-weight: 500;
    }

    .tk-confirm-ok {
        background-color: #ef4444;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        border: none;
        font-weight: 500;
    }

    .tk-confirm-cancel:hover {
        background-color: #e5e7eb;
    }

    .tk-confirm-ok:hover {
        background-color: #dc2626;
    }

    @keyframes toastIn {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`);
  const globalCSS = `
    #tk-account-panel, #tk-login-panel, #tk-toggle-panel, #tk-login-backdrop {
        font-family: 'Inter', sans-serif;
    }

    /* 确保所有按钮文本横向显示 */
    #tk-switch-account, [data-switch], .tk-horizontal-text {
        writing-mode: horizontal-tb !important;
        text-orientation: mixed !important;
    }

    #tk-switch-account span, [data-switch] span, .tk-horizontal-text span {
        display: inline-block;
        writing-mode: horizontal-tb !important;
        text-orientation: mixed !important;
    }

    .tk-side-btn {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background-color: #0ea5e9;
        color: white;
        border-top-left-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
        box-shadow: -2px 3px 10px rgba(0, 0, 0, 0.15);
        z-index: 99999;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 15px 8px;
        writing-mode: vertical-lr;
        text-orientation: upright;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 2px;
        border: none;
    }

    /* 暗黑模式下的侧边按钮 */
    @media (prefers-color-scheme: dark) {
        .tk-side-btn {
            background-color: #0284c7;
            color: white;
            box-shadow: -2px 3px 10px rgba(0, 0, 0, 0.3);
        }

        .tk-side-btn:hover {
            background-color: #0369a1;
        }
    }

    html.dark .tk-side-btn, .dark-theme .tk-side-btn, html[data-theme="dark"] .tk-side-btn {
        background-color: #0284c7;
        color: white;
        box-shadow: -2px 3px 10px rgba(0, 0, 0, 0.3);
    }

    html.dark .tk-side-btn:hover, .dark-theme .tk-side-btn:hover, html[data-theme="dark"] .tk-side-btn:hover {
        background-color: #0369a1;
    }

    .tk-side-btn:hover {
        background-color: #0284c7;
        box-shadow: -3px 5px 15px rgba(0, 0, 0, 0.2);
        padding-right: 12px;
    }

    #tk-login-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        backdrop-filter: blur(2px);
        animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes scaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }

    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    /* Toast通知样式 */
    .tk-toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 100000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 350px;
    }

    .tk-toast {
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: toastIn 0.3s ease;
        display: flex;
        align-items: center;
        overflow: hidden;
    }

    .tk-toast-success {
        background-color: #10b981;
    }

    .tk-toast-error {
        background-color: #ef4444;
    }

    .tk-toast-warning {
        background-color: #f59e0b;
    }

    .tk-toast-info {
        background-color: #3b82f6;
    }

    /* 确认对话框样式 */
    .tk-confirm-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100001;
        backdrop-filter: blur(2px);
        animation: fadeIn 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tk-confirm-dialog {
        background-color: white;
        border-radius: 12px;
        padding: 20px;
        width: 320px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        animation: confirmScaleIn 0.3s ease;
        position: relative;
        margin: 0 auto;
    }

    /* 暗黑模式下的确认对话框 */
    @media (prefers-color-scheme: dark) {
        .tk-confirm-dialog {
            background-color: #1f2937;
            color: #f3f4f6;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }

        .tk-confirm-title {
            color: #f3f4f6;
        }

        .tk-confirm-cancel {
            background-color: #374151;
            color: #d1d5db;
        }

        .tk-confirm-cancel:hover {
            background-color: #4b5563;
        }

        .tk-confirm-ok {
            background-color: #b91c1c;
        }

        .tk-confirm-ok:hover {
            background-color: #991b1b;
        }
    }

    html.dark .tk-confirm-dialog, .dark-theme .tk-confirm-dialog, html[data-theme="dark"] .tk-confirm-dialog {
        background-color: #1f2937;
        color: #f3f4f6;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    }

    html.dark .tk-confirm-title, .dark-theme .tk-confirm-title, html[data-theme="dark"] .tk-confirm-title {
        color: #f3f4f6;
    }

    html.dark .tk-confirm-cancel, .dark-theme .tk-confirm-cancel, html[data-theme="dark"] .tk-confirm-cancel {
        background-color: #374151;
        color: #d1d5db;
    }

    html.dark .tk-confirm-cancel:hover, .dark-theme .tk-confirm-cancel:hover, html[data-theme="dark"] .tk-confirm-cancel:hover {
        background-color: #4b5563;
    }

    html.dark .tk-confirm-ok, .dark-theme .tk-confirm-ok, html[data-theme="dark"] .tk-confirm-ok {
        background-color: #b91c1c;
    }

    html.dark .tk-confirm-ok:hover, .dark-theme .tk-confirm-ok:hover, html[data-theme="dark"] .tk-confirm-ok:hover {
        background-color: #991b1b;
    }

    @keyframes confirmScaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }

    .tk-confirm-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 15px;
        color: #1f2937;
    }

    .tk-confirm-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    }

    .tk-confirm-cancel {
        background-color: #f3f4f6;
        color: #4b5563;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        border: none;
        font-weight: 500;
    }

    .tk-confirm-ok {
        background-color: #ef4444;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        border: none;
        font-weight: 500;
    }

    .tk-confirm-cancel:hover {
        background-color: #e5e7eb;
    }

    .tk-confirm-ok:hover {
        background-color: #dc2626;
    }

    @keyframes toastIn {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
  GM_addStyle(globalCSS);
  function createToastContainer() {
    if (document.querySelector(".tk-toast-container")) {
      return document.querySelector(".tk-toast-container");
    }
    const container = document.createElement("div");
    container.className = "tk-toast-container";
    document.body.appendChild(container);
    return container;
  }
  function showToast(message, type = "info", duration = 3e3) {
    const container = createToastContainer();
    const toast = document.createElement("div");
    toast.className = `tk-toast tk-toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(120%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => {
        container.removeChild(toast);
        if (container.children.length === 0) {
          document.body.removeChild(container);
        }
      }, 300);
    }, duration);
  }
  function showConfirm(message) {
    return new Promise((resolve) => {
      const backdrop = document.createElement("div");
      backdrop.className = "tk-confirm-backdrop";
      const dialog = document.createElement("div");
      dialog.className = "tk-confirm-dialog";
      dialog.innerHTML = `
            <div class="tk-confirm-title">${message}</div>
            <div class="tk-confirm-buttons">
                <button class="tk-confirm-cancel">取消</button>
                <button class="tk-confirm-ok">确定</button>
            </div>
        `;
      backdrop.appendChild(dialog);
      document.body.appendChild(backdrop);
      const cancelBtn = dialog.querySelector(".tk-confirm-cancel");
      const okBtn = dialog.querySelector(".tk-confirm-ok");
      cancelBtn.addEventListener("click", () => {
        document.body.removeChild(backdrop);
        resolve(false);
      });
      okBtn.addEventListener("click", () => {
        document.body.removeChild(backdrop);
        resolve(true);
      });
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          document.body.removeChild(backdrop);
          document.removeEventListener("keydown", handleKeyDown);
          resolve(false);
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          document.body.removeChild(backdrop);
          document.removeEventListener("keydown", handleKeyDown);
          resolve(false);
        }
      });
    });
  }
  const scriptRel = function detectScriptRel() {
    const relList = typeof document !== "undefined" && document.createElement("link").relList;
    return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
  }();
  const assetsURL = function(dep) {
    return "/" + dep;
  };
  const seen = {};
  const __vitePreload = function preload(baseModule, deps, importerUrl) {
    let promise = Promise.resolve();
    if (deps && deps.length > 0) {
      document.getElementsByTagName("link");
      const cspNonceMeta = document.querySelector(
        "meta[property=csp-nonce]"
      );
      const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
      promise = Promise.allSettled(
        deps.map((dep) => {
          dep = assetsURL(dep);
          if (dep in seen) return;
          seen[dep] = true;
          const isCss = dep.endsWith(".css");
          const cssSelector = isCss ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
            return;
          }
          const link = document.createElement("link");
          link.rel = isCss ? "stylesheet" : scriptRel;
          if (!isCss) {
            link.as = "script";
          }
          link.crossOrigin = "";
          link.href = dep;
          if (cspNonce) {
            link.setAttribute("nonce", cspNonce);
          }
          document.head.appendChild(link);
          if (isCss) {
            return new Promise((res, rej) => {
              link.addEventListener("load", res);
              link.addEventListener(
                "error",
                () => rej(new Error(`Unable to preload CSS for ${dep}`))
              );
            });
          }
        })
      );
    }
    function handlePreloadError(err) {
      const e = new Event("vite:preloadError", {
        cancelable: true
      });
      e.payload = err;
      window.dispatchEvent(e);
      if (!e.defaultPrevented) {
        throw err;
      }
    }
    return promise.then((res) => {
      for (const item of res || []) {
        if (item.status !== "rejected") continue;
        handlePreloadError(item.reason);
      }
      return baseModule().catch(handlePreloadError);
    });
  };
  function isGMCookieAvailable() {
    return typeof GM_cookie !== "undefined";
  }
  function parseCookieString(cookieString) {
    if (!cookieString) return [];
    const cookiePairs = cookieString.split(/;\s*/);
    const cookies = [];
    for (const pair of cookiePairs) {
      if (!pair.trim()) continue;
      const firstEquals = pair.indexOf("=");
      if (firstEquals < 0) continue;
      const name = pair.substring(0, firstEquals).trim();
      const value = pair.substring(firstEquals + 1).trim();
      if (name && value) {
        cookies.push({
          name,
          value,
          domain: ".tiktok.com",
          path: "/",
          secure: true
        });
      }
    }
    return cookies;
  }
  async function getAllCookies() {
    const WORKING_COOKIE_NAMES_PLACEHOLDER = [
      // 你需要从你那个\"能工作的Cookie字符串\"中解析出所有Cookie的name，然后替换掉这个数组
      // 这是一个示例，说明你需要做什么。确保这个列表是准确和完整的。
      "tt_csrf_token",
      "ak_bmsc",
      "passport_csrf_token",
      "passport_csrf_token_default",
      "s_v_web_id",
      "multi_sids",
      "cmpl_token",
      "uid_tt",
      "uid_tt_ss",
      "sid_tt",
      "sessionid",
      "sessionid_ss",
      "store-idc",
      "store-country-code",
      "store-country-code-src",
      "tt-target-idc",
      "tt-target-idc-sign",
      "tt_chain_token",
      "bm_sv",
      "ttwid",
      "sid_guard",
      "sid_ucp_v1",
      "ssid_ucp_v1",
      "odin_tt",
      "msToken"
      // 这是一个基于通用TikTok Cookie的示例列表, 请务必用你自己的替换
    ];
    const workingCookieNames = WORKING_COOKIE_NAMES_PLACEHOLDER;
    console.log("getAllCookies 诊断: 期望从工作字符串中找到的Cookie名称数量:", workingCookieNames.length, workingCookieNames);
    const currentUrl = window.location.href;
    const currentProtocol = window.location.protocol;
    let collectedCookies = [];
    if (isGMCookieAvailable()) {
      try {
        const cookiesFromCurrentUrl = await new Promise((resolveInner) => {
          GM_cookie.list({ url: currentUrl }, (cookies, error) => {
            if (error) {
              console.warn(`GM_cookie.list for currentUrl (${currentUrl}) failed:`, error);
              resolveInner([]);
            } else {
              resolveInner(cookies || []);
            }
          });
        });
        collectedCookies = collectedCookies.concat(cookiesFromCurrentUrl.map((c) => ({ ...c, querySource: "currentUrl", sourceDomain: currentUrl })));
        console.log(`getAllCookies: 从当前URL (${currentUrl}) 获取到 ${cookiesFromCurrentUrl.length} 个cookie`);
      } catch (e) {
        console.error(`getAllCookies: 获取当前URL (${currentUrl}) 的cookie时出错:`, e);
      }
      const domainsToQuery = [".tiktok.com", "tiktok.com", ".www.tiktok.com", "www.tiktok.com"];
      for (const domain of domainsToQuery) {
        const domainStr = domain.startsWith(".") ? domain.substring(1) : domain;
        const testUrl = `${currentProtocol}//${domainStr}/`;
        try {
          const cookiesFromDomain = await new Promise((resolveInner) => {
            GM_cookie.list({ url: testUrl }, (cookies, error) => {
              if (error) {
                console.warn(`GM_cookie.list for ${testUrl} failed:`, error);
                resolveInner([]);
              } else {
                resolveInner(cookies || []);
              }
            });
          });
          collectedCookies = collectedCookies.concat(cookiesFromDomain.map((c) => ({ ...c, querySource: "domainList", sourceDomain: testUrl })));
          console.log(`getAllCookies: 从 ${testUrl} 获取到 ${cookiesFromDomain.length} 个cookie`);
        } catch (e) {
          console.error(`getAllCookies: 获取域名 ${testUrl} 的cookie时出错:`, e);
        }
      }
      try {
        const documentCookiesRaw = document.cookie;
        if (documentCookiesRaw) {
          const documentCookiesParsed = parseCookieString(documentCookiesRaw);
          collectedCookies = collectedCookies.concat(documentCookiesParsed.map((c) => ({ ...c, querySource: "document.cookie" })));
          console.log(`getAllCookies: 从document.cookie解析出 ${documentCookiesParsed.length} 个cookie`);
        } else {
          console.log("getAllCookies: document.cookie 为空或不可访问。");
        }
      } catch (e) {
        console.error("getAllCookies: 解析 document.cookie 时出错:", e);
      }
    } else {
      console.log(`getAllCookies: GM_cookie不可用，尝试从document.cookie获取`);
      try {
        const documentCookiesRaw = document.cookie;
        if (documentCookiesRaw) {
          collectedCookies = parseCookieString(documentCookiesRaw).map((c) => ({ ...c, querySource: "document.cookie_fallback" }));
        } else {
          console.log("getAllCookies: GM_cookie不可用且document.cookie为空。");
        }
      } catch (e) {
        console.error("getAllCookies: GM_cookie不可用时，解析 document.cookie 出错:", e);
      }
    }
    const uniqueCookiesMap = /* @__PURE__ */ new Map();
    console.log(`getAllCookies: 去重前收集到 ${collectedCookies.length} 个cookies (包含潜在重复)`);
    for (const cookie of collectedCookies) {
      if (!cookie || typeof cookie.name !== "string" || typeof cookie.domain !== "string" || typeof cookie.path !== "string") {
        continue;
      }
      const normalizedDomainForKey = cookie.domain.toLowerCase().replace(/^\./, "");
      const signature = `${cookie.name}@${normalizedDomainForKey}@${cookie.path}`;
      const existingCookieInMap = uniqueCookiesMap.get(signature);
      if (!existingCookieInMap) {
        uniqueCookiesMap.set(signature, cookie);
      } else {
        if (cookie.querySource !== "document.cookie" && cookie.querySource !== "document.cookie_fallback" && (existingCookieInMap.querySource === "document.cookie" || existingCookieInMap.querySource === "document.cookie_fallback")) {
          uniqueCookiesMap.set(signature, cookie);
        }
      }
    }
    const finalUniqueCookiesWithSource = Array.from(uniqueCookiesMap.values());
    const finalUniqueCookies = finalUniqueCookiesWithSource.map(({ querySource, sourceDomain, ...rest }) => rest);
    const validFinalCookies = finalUniqueCookies.filter((cookie) => cookie.value !== "" && typeof cookie.name === "string" && cookie.name.trim() !== "");
    console.log(`getAllCookies: 唯一化和过滤后剩余 ${validFinalCookies.length} 个有效cookie对象。`);
    console.log("getAllCookies: 最终唯一Cookie列表详情 (深拷贝打印):", JSON.parse(JSON.stringify(validFinalCookies)));
    const foundNames = new Set(validFinalCookies.map((c) => c.name));
    const missingNames = workingCookieNames.filter((name) => !foundNames.has(name));
    const extraNames = Array.from(foundNames).filter((name) => !workingCookieNames.includes(name));
    if (workingCookieNames.length > 0) {
      if (missingNames.length > 0) {
        console.error(`getAllCookies 严重警告: 以下在"能工作的Cookie字符串"中定义的关键Cookie名称未能通过 GM API 捕获到 (共 ${missingNames.length} 个缺失):`, missingNames);
      } else {
        console.log('getAllCookies 好消息: 所有在"能工作的Cookie字符串"中定义的关键Cookie名称都已被 GM API 捕获到。');
      }
      if (extraNames.length > 0) {
        console.log('getAllCookies 信息: GM API 额外捕获了以下Cookie名称 (这些不在你提供的"能工作的Cookie字符串"的解析列表中):', extraNames);
      }
    } else {
      console.warn('getAllCookies 诊断: 未提供"能工作的Cookie字符串"中的名称列表 (workingCookieNames为空)，跳过缺失/额外诊断。');
    }
    console.log("getAllCookies: 最终返回的唯一Cookie数量:", validFinalCookies.length);
    return validFinalCookies;
  }
  async function deleteCookie(name, options = {}) {
    const domain = options.domain || ".tiktok.com";
    const path = options.path || "/";
    console.log(`尝试删除cookie: ${name} (域名: ${domain}, 路径: ${path})`);
    if (isGMCookieAvailable()) {
      return new Promise((resolve) => {
        const deleteParams = {
          name
        };
        {
          deleteParams.domain = domain;
        }
        GM_cookie.delete(deleteParams, (error) => {
          if (!error) {
            console.log(`GM_cookie成功删除: ${name} (${domain}${path})`);
            resolve(true);
          } else {
            console.warn(`GM_cookie无法删除: ${name} (${domain}${path})，错误: ${error}`);
            resolve(false);
          }
        });
      });
    } else {
      console.warn(`GM_cookie API不可用，无法删除cookie: ${name}`);
      return false;
    }
  }
  async function setCookie(cookie) {
    const cookieUrl = "https://www.tiktok.com";
    const domain = ".tiktok.com";
    if (isGMCookieAvailable()) {
      return new Promise((resolve) => {
        const cookieParams = {
          url: cookieUrl,
          name: cookie.name,
          value: cookie.value,
          domain,
          path: "/",
          secure: true,
          sameSite: "no_restriction",
          expirationDate: Math.floor(Date.now() / 1e3) + 365 * 24 * 60 * 60
        };
        console.log(`尝试设置cookie: ${cookie.name} 到域名 ${domain}`);
        GM_cookie.set(cookieParams, (error) => {
          if (error) {
            console.log(`GM_cookie设置失败: ${cookie.name}，尝试使用document.cookie`);
            resolve(setDocumentCookie(cookie));
          } else {
            console.log(`GM_cookie成功设置: ${cookie.name}`);
            resolve(true);
          }
        });
      });
    } else {
      return setDocumentCookie(cookie);
    }
  }
  function setDocumentCookie(cookie) {
    try {
      const expireDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3).toUTCString();
      const cookieString = `${cookie.name}=${cookie.value}; domain=.tiktok.com; path=/; secure; SameSite=None; expires=${expireDate}`;
      document.cookie = cookieString;
      console.log(`尝试通过document.cookie设置: ${cookie.name}`);
      return true;
    } catch (e) {
      console.error(`使用document.cookie设置 ${cookie.name} 失败:`, e);
      return false;
    }
  }
  async function clearAllTikTokCookies() {
    console.log("开始清除所有TikTok cookie...");
    let clearedCount = 0;
    const allCookies = await getAllCookies();
    console.log(`获取到 ${allCookies.length} 个cookie`);
    const domains = [".tiktok.com", "tiktok.com", ".www.tiktok.com", "www.tiktok.com", null];
    for (const cookie of allCookies) {
      try {
        let success = false;
        for (const domain of domains) {
          const options = domain ? { domain } : {};
          const deleted = await deleteCookie(cookie.name, options);
          if (deleted) {
            success = true;
            break;
          }
        }
        if (success) {
          clearedCount++;
        } else {
          console.warn(`无法删除cookie: ${cookie.name}`);
        }
      } catch (error) {
        console.error(`删除cookie ${cookie.name} 时出错:`, error);
      }
    }
    try {
      localStorage.clear();
      console.log("已清除localStorage");
      sessionStorage.clear();
      console.log("已清除sessionStorage");
    } catch (e) {
      console.error("清除本地存储失败:", e);
    }
    console.log(`清除完成，共删除 ${clearedCount} 个cookie`);
    return clearedCount;
  }
  async function setCookiesFromString(cookieString) {
    const cookies = parseCookieString(cookieString);
    console.log(`从字符串解析出 ${cookies.length} 个cookie，准备设置`);
    const cookiesByDomain = {};
    for (const cookie of cookies) {
      const domain = cookie.domain || "unknown";
      if (!cookiesByDomain[domain]) {
        cookiesByDomain[domain] = [];
      }
      cookiesByDomain[domain].push(cookie);
    }
    console.log("Cookies按域名分组:");
    for (const domain in cookiesByDomain) {
      console.log(`- ${domain}: ${cookiesByDomain[domain].length}个cookie`);
      console.log("  Cookie名称:", cookiesByDomain[domain].map((c) => c.name).join(", "));
    }
    let setCount = 0;
    console.log("先清除现有TikTok cookie以避免冲突...");
    await clearAllTikTokCookies();
    for (const cookie of cookies) {
      const success = await setCookie(cookie);
      if (success) {
        setCount++;
      } else {
        console.error(`设置cookie失败: ${cookie.name}`);
      }
    }
    console.log(`成功设置 ${setCount}/${cookies.length} 个cookie`);
    try {
      const currentCookies = await getAllCookies();
      const criticalCookiesSet = cookies.filter(
        (c) => currentCookies.some((cc) => cc.name === c.name)
      );
      console.log(
        `检查结果: 成功设置了 ${criticalCookiesSet.length} 个关键cookie:`,
        criticalCookiesSet.map((c) => c.name).join(", ")
      );
      if (criticalCookiesSet.some((c) => c.name === "sessionid") && criticalCookiesSet.some((c) => c.name === "ttwid")) {
        console.log("✅ 已成功设置必要的登录状态cookies (sessionid, ttwid)");
      } else {
        console.warn("⚠️ 可能未成功设置所有必要的登录状态cookies");
      }
    } catch (e) {
      console.error("验证cookie时出错:", e);
    }
    return setCount;
  }
  const APP_VERSION = "0.3.0";
  const APP_NAME = "账号切换器";
  const STORAGE_KEYS = {
    ACCOUNTS: "tiktokAccounts",
    GROUPS: "accountGroups",
    USERNAME: "username",
    PASSWORD: "password",
    CURRENT_GROUP: "currentGroup"
  };
  const DEFAULT_CONFIG = {
    refreshDelay: 1500,
    // 刷新页面前的延迟时间(毫秒)
    defaultUsername: "admin",
    defaultPassword: "admin",
    defaultGroup: "默认分组"
  };
  const ACCOUNT_STRUCTURE = {
    // 导入格式
    importFormat: {
      separator: "|",
      // 分隔符
      fields: [
        { index: 0, name: "name", required: true },
        // 账号名称(必填)
        { index: 1, name: "cookie", required: true },
        // cookie字符串(必填)
        { index: 2, name: "group", required: false },
        // 分组名称(可选)
        { index: 3, name: "note", required: false }
        // 账号备注(可选)
      ]
    }
  };
  const DOM_IDS = {
    PANEL: "tk-account-panel",
    TOGGLE_BUTTON: "tk-toggle-panel",
    ACCOUNT_LIST: "tk-account-list",
    ADD_ACCOUNT_FORM: "tk-add-account-form",
    EMPTY_ACCOUNT_BTN: "tk-empty-account",
    SAVE_CURRENT_BTN: "tk-save-current",
    PROCESS_BATCH_BTN: "tk-process-batch",
    CLOSE_PANEL_BTN: "tk-close-panel",
    GO_ADD_ACCOUNT_BTN: "tk-go-add-account"
  };
  const CSS_CLASSES = {
    HIDDEN: "hidden",
    BLOCK: "block",
    DARK_THEME: "dark-theme"
  };
  const refreshPage = () => {
    const url = window.location.href.split("#")[0] + (window.location.search ? "&" : "?") + "_t=" + (/* @__PURE__ */ new Date()).getTime();
    window.location.href = url;
  };
  function getStorageValue(key, defaultValue) {
    try {
      const value = GM_getValue(key, defaultValue);
      if (typeof defaultValue === "object" && defaultValue !== null && typeof value !== "object") {
        return defaultValue;
      }
      return value;
    } catch (error) {
      console.error(`获取存储值失败: ${key}`, error);
      return defaultValue;
    }
  }
  function setStorageValue(key, value) {
    try {
      GM_setValue(key, value);
      return true;
    } catch (error) {
      console.error(`设置存储值失败: ${key}`, error);
      return false;
    }
  }
  function getAccounts() {
    return getStorageValue(STORAGE_KEYS.ACCOUNTS, {});
  }
  function getGroups() {
    return getStorageValue(STORAGE_KEYS.GROUPS, {
      [DEFAULT_CONFIG.defaultGroup]: []
    });
  }
  function getCurrentGroup() {
    return getStorageValue(STORAGE_KEYS.CURRENT_GROUP, DEFAULT_CONFIG.defaultGroup);
  }
  function setCurrentGroup(groupName) {
    return setStorageValue(STORAGE_KEYS.CURRENT_GROUP, groupName);
  }
  function addGroup(groupName) {
    if (!groupName) return false;
    const groups = getGroups();
    if (groups[groupName]) return false;
    groups[groupName] = [];
    return setStorageValue(STORAGE_KEYS.GROUPS, groups);
  }
  function removeGroup(groupName) {
    if (!groupName || groupName === DEFAULT_CONFIG.defaultGroup) return false;
    const groups = getGroups();
    if (!groups[groupName]) return false;
    const accountsToMove = groups[groupName];
    if (accountsToMove.length > 0) {
      groups[DEFAULT_CONFIG.defaultGroup] = [
        .../* @__PURE__ */ new Set([...groups[DEFAULT_CONFIG.defaultGroup], ...accountsToMove])
      ];
    }
    delete groups[groupName];
    if (getCurrentGroup() === groupName) {
      setCurrentGroup(DEFAULT_CONFIG.defaultGroup);
    }
    return setStorageValue(STORAGE_KEYS.GROUPS, groups);
  }
  function addAccountToGroup(accountName, groupName = getCurrentGroup()) {
    if (!accountName) return false;
    const groups = getGroups();
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    if (!groups[groupName].includes(accountName)) {
      groups[groupName].push(accountName);
    }
    return setStorageValue(STORAGE_KEYS.GROUPS, groups);
  }
  function removeAccountFromGroup(accountName, groupName = null) {
    if (!accountName) return false;
    const groups = getGroups();
    if (groupName) {
      if (groups[groupName]) {
        groups[groupName] = groups[groupName].filter((name) => name !== accountName);
        return setStorageValue(STORAGE_KEYS.GROUPS, groups);
      }
      return false;
    } else {
      let changed = false;
      for (const group in groups) {
        if (groups[group].includes(accountName)) {
          groups[group] = groups[group].filter((name) => name !== accountName);
          changed = true;
        }
      }
      return changed ? setStorageValue(STORAGE_KEYS.GROUPS, groups) : false;
    }
  }
  function addAccount(name, cookieString, group = getCurrentGroup()) {
    if (!name || !cookieString) return false;
    const accounts = getAccounts();
    accounts[name] = cookieString;
    const accountSaved = setStorageValue(STORAGE_KEYS.ACCOUNTS, accounts);
    const groupAdded = addAccountToGroup(name, group);
    return accountSaved && groupAdded;
  }
  function getAccountsInGroup(groupName = getCurrentGroup()) {
    const groups = getGroups();
    return groups[groupName] || [];
  }
  function isDarkMode() {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const htmlHasDarkClass = document.documentElement.classList.contains("dark");
    const bodyBgColor = window.getComputedStyle(document.body).backgroundColor;
    let isDarkBg = false;
    if (bodyBgColor) {
      const rgb = bodyBgColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const brightness = (0.2126 * parseInt(rgb[0]) + 0.7152 * parseInt(rgb[1]) + 0.0722 * parseInt(rgb[2])) / 255;
        isDarkBg = brightness < 0.5;
      }
    }
    return prefersDark || htmlHasDarkClass || isDarkBg;
  }
  function getElementById(id, required = false) {
    const element = document.getElementById(id);
    if (required && !element) {
      console.error(`必要的DOM元素ID未找到: ${id}`);
    }
    return element;
  }
  function parseImportContent(content) {
    if (!content) return [];
    const { separator, fields } = ACCOUNT_STRUCTURE.importFormat;
    const lines = content.split("\n").filter((line) => line.trim().length > 0);
    const results = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const parts = line.split(separator);
      const requiredFields = fields.filter((f) => f.required);
      const missingFields = requiredFields.filter((f) => !parts[f.index] || parts[f.index].trim() === "");
      if (missingFields.length > 0) {
        results.push({
          success: false,
          lineNumber: i + 1,
          error: `缺少必填字段: ${missingFields.map((f) => f.name).join(", ")}`,
          data: null
        });
        continue;
      }
      const name = parts[fields.find((f) => f.name === "name").index].trim();
      const cookie = parts[fields.find((f) => f.name === "cookie").index].trim();
      let group = DEFAULT_CONFIG.defaultGroup;
      let note = "";
      const groupFieldIndex = fields.findIndex((f) => f.name === "group");
      if (groupFieldIndex >= 0 && parts[groupFieldIndex] && parts[groupFieldIndex].trim() !== "") {
        group = parts[groupFieldIndex].trim();
      }
      const noteFieldIndex = fields.findIndex((f) => f.name === "note");
      if (noteFieldIndex >= 0 && parts[noteFieldIndex] && parts[noteFieldIndex].trim() !== "") {
        note = parts[noteFieldIndex].trim();
      }
      const accountData = note ? { cookie, note } : cookie;
      results.push({
        success: true,
        lineNumber: i + 1,
        error: null,
        data: {
          name,
          accountData,
          group
        }
      });
    }
    return results;
  }
  function updateAccountNote(accountName, note) {
    const accounts = getAccounts();
    if (!accounts[accountName]) return false;
    let accountData = accounts[accountName];
    if (typeof accountData === "string") {
      accountData = {
        cookie: accountData,
        note
      };
    } else {
      accountData.note = note;
    }
    accounts[accountName] = accountData;
    return setStorageValue(STORAGE_KEYS.ACCOUNTS, accounts);
  }
  function getAccountNote(accountName) {
    const accounts = getAccounts();
    if (!accounts[accountName]) return "";
    const accountData = accounts[accountName];
    if (typeof accountData === "object" && accountData.note) {
      return accountData.note;
    }
    return "";
  }
  function renameAccount(oldName, newName) {
    if (!newName || oldName === newName) return false;
    const accounts = getAccounts();
    if (!accounts[oldName]) return false;
    if (accounts[newName]) return false;
    const accountData = accounts[oldName];
    accounts[newName] = accountData;
    delete accounts[oldName];
    const accountsSaved = setStorageValue(STORAGE_KEYS.ACCOUNTS, accounts);
    const groups = getGroups();
    let groupsChanged = false;
    for (const groupName in groups) {
      const accountList = groups[groupName];
      const index = accountList.indexOf(oldName);
      if (index !== -1) {
        accountList[index] = newName;
        groupsChanged = true;
      }
    }
    const groupsSaved = groupsChanged ? setStorageValue(STORAGE_KEYS.GROUPS, groups) : true;
    return accountsSaved && groupsSaved;
  }
  const helpers = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    addAccount,
    addAccountToGroup,
    addGroup,
    getAccountNote,
    getAccounts,
    getAccountsInGroup,
    getCurrentGroup,
    getElementById,
    getGroups,
    getStorageValue,
    isDarkMode,
    parseImportContent,
    removeAccountFromGroup,
    removeGroup,
    renameAccount,
    setCurrentGroup,
    setStorageValue,
    updateAccountNote
  }, Symbol.toStringTag, { value: "Module" }));
  async function switchAccount(accountName) {
    const accounts = getAccounts();
    let cookieString = accounts[accountName];
    if (typeof cookieString === "object" && cookieString.cookie) {
      cookieString = cookieString.cookie;
    }
    if (!cookieString) {
      showToast(`找不到账号 ${accountName} 的Cookie信息`, "error");
      return;
    }
    const hasCriticalCookies = ["sessionid", "ttwid", "odin_tt"].some(
      (name) => cookieString.includes(`${name}=`) && !cookieString.includes(`${name}=;`)
    );
    if (!hasCriticalCookies) {
      console.warn(`账号 ${accountName} 的cookie中缺少关键登录信息，切换可能失败`);
      const cookies = cookieString.split(/;\s*/);
      console.log("Cookie信息检查：");
      ["sessionid", "ttwid", "odin_tt", "uid_tt", "sid_tt"].forEach((name) => {
        const cookie = cookies.find((c) => c.startsWith(`${name}=`));
        console.log(`- ${name}: ${cookie ? "存在" : "不存在"}`);
      });
    }
    try {
      console.log("正在清除现有cookie...");
      const clearedCount = await clearAllTikTokCookies();
      console.log(`清除了 ${clearedCount} 个cookie`);
      console.log("正在设置新账号cookie...");
      const setCount = await setCookiesFromString(cookieString);
      console.log(`成功设置 ${setCount} 个cookie`);
      const currentCookies = document.cookie;
      const criticalCookiesSet = ["sessionid", "ttwid"].some(
        (name) => currentCookies.includes(`${name}=`)
      );
      if (!criticalCookiesSet) {
        console.warn("可能无法正确设置关键cookie到当前域，切换账号可能不完全");
      }
      showToast(`已切换到账号: ${accountName}，共设置 ${setCount} 个cookie，页面即将刷新`, "success");
      setTimeout(() => {
        refreshPage();
      }, DEFAULT_CONFIG.refreshDelay);
    } catch (error) {
      showToast("切换账号失败，请手动操作。", "error");
      console.error("切换账号出错:", error);
    }
  }
  async function deleteAccount(accountName) {
    const confirmed = await showConfirm(`确定要删除账号 ${accountName} 吗？`);
    if (confirmed) {
      const accounts = getAccounts();
      delete accounts[accountName];
      setStorageValue(STORAGE_KEYS.ACCOUNTS, accounts);
      loadAccounts();
      showToast(`账号 ${accountName} 已删除`, "info");
    }
  }
  function saveAccount() {
    const nameInput = getElementById("tk-account-name");
    const cookiesInput = getElementById("tk-account-cookies");
    const groupSelect = getElementById("tk-account-group");
    if (!nameInput || !cookiesInput) {
      showToast("无法获取表单元素", "error");
      return;
    }
    const accountName = nameInput.value.trim();
    const accountCookies = cookiesInput.value.trim();
    const groupName = groupSelect ? groupSelect.value : DEFAULT_CONFIG.defaultGroup;
    if (!accountName || !accountCookies) {
      showToast("请填写账号名称和Cookie信息", "warning");
      return;
    }
    const success = addAccount(accountName, accountCookies, groupName);
    if (success) {
      nameInput.value = "";
      cookiesInput.value = "";
      __vitePreload(async () => {
        const { updateAccountSelector: updateAccountSelector2, loadAccounts: loadAccounts2 } = await Promise.resolve().then(() => panel);
        return { updateAccountSelector: updateAccountSelector2, loadAccounts: loadAccounts2 };
      }, void 0 ).then(({ updateAccountSelector: updateAccountSelector2, loadAccounts: loadAccounts2 }) => {
        updateAccountSelector2();
        loadAccounts2();
        const switchTab = document.querySelector('[data-tab="switch"]');
        if (switchTab) {
          switchTab.click();
        }
      });
      showToast(`账号 ${accountName} 已保存到分组"${groupName}"！`, "success");
    } else {
      showToast("保存账号失败", "error");
    }
  }
  function processBatchImport() {
    const fileInput = document.getElementById("tk-batch-file");
    const resultsDiv = document.getElementById("tk-batch-results");
    const logDiv = document.getElementById("tk-batch-log");
    const groupSelect = document.getElementById("tk-batch-group");
    if (!fileInput.files || fileInput.files.length === 0) {
      showToast("请先选择TXT文件", "warning");
      return;
    }
    const file = fileInput.files[0];
    if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
      showToast("请选择TXT格式的文件", "error");
      return;
    }
    resultsDiv.classList.remove("hidden");
    logDiv.innerHTML = "正在处理文件，请稍候...";
    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      const parseResults = parseImportContent(content);
      if (parseResults.length === 0) {
        logDiv.innerHTML = "文件内容为空，没有找到账号信息";
        return;
      }
      let successCount = 0;
      let failCount = 0;
      let logContent = "";
      const selectedGroup = groupSelect.value || getCurrentGroup();
      parseResults.forEach((result) => {
        if (!result.success) {
          logContent += `行 ${result.lineNumber}: ${result.error}<br>`;
          failCount++;
          return;
        }
        const { name, accountData, group } = result.data;
        const targetGroup = selectedGroup !== DEFAULT_CONFIG.defaultGroup ? selectedGroup : group;
        const groups = getGroups();
        if (targetGroup && !groups[targetGroup]) {
          addGroup(targetGroup);
        }
        const accounts = getStorageValue("tiktokAccounts", {});
        accounts[name] = accountData;
        if (setStorageValue("tiktokAccounts", accounts)) {
          if (addAccountToGroup(name, targetGroup)) {
            successCount++;
            const hasNote = typeof accountData === "object" && accountData.note;
            logContent += `行 ${result.lineNumber}: 成功导入账号 "${name}" 到分组 "${targetGroup}"${hasNote ? " (包含备注)" : ""}<br>`;
          } else {
            failCount++;
            logContent += `行 ${result.lineNumber}: 账号 "${name}" 已保存，但添加到分组失败<br>`;
          }
        } else {
          failCount++;
          logContent += `行 ${result.lineNumber}: 保存账号 "${name}" 失败<br>`;
        }
      });
      logDiv.innerHTML = `
            <div class="mb-2">总共处理 ${parseResults.length} 行：</div>
            <div class="text-green-600 mb-2">✓ 成功导入 ${successCount} 个账号</div>
            ${failCount > 0 ? `<div class="text-red-600 mb-2">✗ 失败 ${failCount} 个账号</div>` : ""}
            <div class="mt-3 pt-3 border-t border-gray-200">详细日志：</div>
            <div class="mt-2 text-xs">${logContent}</div>
        `;
      __vitePreload(async () => {
        const { updateAccountSelector: updateAccountSelector2, loadAccounts: loadAccounts2 } = await Promise.resolve().then(() => panel);
        return { updateAccountSelector: updateAccountSelector2, loadAccounts: loadAccounts2 };
      }, void 0 ).then(({ updateAccountSelector: updateAccountSelector2, loadAccounts: loadAccounts2 }) => {
        updateAccountSelector2();
        loadAccounts2();
      });
      if (successCount > 0) {
        showToast(`成功导入 ${successCount} 个账号`, "success");
      }
    };
    reader.onerror = function() {
      logDiv.innerHTML = "读取文件时发生错误，请重试";
      showToast("读取文件失败，请重试", "error");
    };
    reader.readAsText(file);
  }
  function initBatchGroupSelector() {
    const groupSelect = document.getElementById("tk-batch-group");
    if (!groupSelect) return;
    groupSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = DEFAULT_CONFIG.defaultGroup;
    defaultOption.textContent = `使用文件中指定的分组`;
    groupSelect.appendChild(defaultOption);
    const groups = getGroups();
    for (const groupName in groups) {
      const option = document.createElement("option");
      option.value = groupName;
      option.textContent = `导入到 "${groupName}" 分组`;
      groupSelect.appendChild(option);
    }
  }
  function generateSaveAccountModalTemplate() {
    console.log("生成模态窗口模板...");
    return `
        <div id="tk-save-modal-backdrop" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-[100000] flex items-center justify-center animate-[fadeIn_0.2s_ease]">
            <div id="tk-save-modal" class="modal-content bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[350px] max-w-[90%] animate-[scaleIn_0.2s_ease] relative overflow-hidden">
                <div class="p-5 border-b border-gray-200 dark:border-gray-700">
                    <div class="text-lg font-semibold text-gray-900 dark:text-white">保存当前账号</div>
                    <button id="tk-save-modal-close" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div class="p-5">
                    <div class="mb-4">
                        <label for="tk-save-modal-name" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">账号名称</label>
                        <input type="text" id="tk-save-modal-name" class="w-full rounded-md border border-solid border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 p-3 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 dark:focus:ring-sky-700/30 transition" placeholder="为当前账号设置一个名称">
                    </div>

                    <div id="tk-save-modal-error" class="mb-4 text-sm text-red-500 dark:text-red-400 hidden"></div>

                    <div class="flex space-x-2 mt-6">
                        <button id="tk-save-modal-cancel" class="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer transition hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600">
                            取消
                        </button>
                        <button id="tk-save-modal-confirm" class="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-sky-500 dark:bg-sky-600 text-white cursor-pointer transition hover:bg-sky-600 dark:hover:bg-sky-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            保存
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
  }
  function showSaveAccountModal(onSave) {
    console.log("显示保存账号模态窗口...");
    const existingModal = document.getElementById("tk-save-modal-backdrop");
    if (existingModal) {
      console.log("发现已存在的模态窗口，移除中...");
      existingModal.remove();
    }
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = generateSaveAccountModalTemplate();
    document.body.appendChild(modalContainer.firstElementChild);
    console.log("模态窗口已添加到DOM");
    const modalBackdrop = document.getElementById("tk-save-modal-backdrop");
    const closeBtn = document.getElementById("tk-save-modal-close");
    const cancelBtn = document.getElementById("tk-save-modal-cancel");
    const confirmBtn = document.getElementById("tk-save-modal-confirm");
    const nameInput = document.getElementById("tk-save-modal-name");
    const errorMsg = document.getElementById("tk-save-modal-error");
    if (!modalBackdrop || !closeBtn || !cancelBtn || !confirmBtn || !nameInput || !errorMsg) {
      console.error("模态窗口DOM元素未找到，请检查ID:", {
        modalBackdrop: !!modalBackdrop,
        closeBtn: !!closeBtn,
        cancelBtn: !!cancelBtn,
        confirmBtn: !!confirmBtn,
        nameInput: !!nameInput,
        errorMsg: !!errorMsg
      });
      return;
    }
    const isDarkMode2 = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const htmlElement = document.documentElement;
    const bodyBgColor = window.getComputedStyle(document.body).backgroundColor;
    console.log("暗黑模式检测:", {
      prefersDark: isDarkMode2,
      htmlHasDarkClass: htmlElement.classList.contains("dark"),
      dataThemeDark: htmlElement.getAttribute("data-theme") === "dark",
      bodyBgColor
    });
    if (htmlElement.classList.contains("dark") || isDarkMode2 || htmlElement.getAttribute("data-theme") === "dark") {
      const modal = document.getElementById("tk-save-modal");
      if (modal) {
        console.log("应用暗黑模式样式到模态窗口");
        modal.classList.add("dark-mode");
      } else {
        console.error("模态窗口元素未找到，无法应用暗黑模式");
      }
    }
    const closeModal = () => {
      console.log("关闭模态窗口");
      modalBackdrop.classList.add("animate-[fadeOut_0.2s_ease]");
      setTimeout(() => {
        modalBackdrop.remove();
        console.log("模态窗口已从DOM移除");
      }, 200);
    };
    const validateAndSave = () => {
      const accountName = nameInput.value.trim();
      console.log("验证账号名称:", accountName);
      if (!accountName) {
        console.log("账号名称为空，显示错误");
        errorMsg.textContent = "请输入账号名称";
        errorMsg.classList.remove("hidden");
        nameInput.focus();
        return;
      }
      closeModal();
      console.log("执行保存回调函数");
      if (typeof onSave === "function") {
        onSave(accountName);
      } else {
        console.error("保存回调不是函数:", onSave);
      }
    };
    console.log("绑定模态窗口事件");
    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    confirmBtn.addEventListener("click", validateAndSave);
    document.addEventListener("keydown", function escHandler(e) {
      if (e.key === "Escape") {
        console.log("检测到ESC键，关闭模态窗口");
        closeModal();
        document.removeEventListener("keydown", escHandler);
      }
    });
    modalBackdrop.addEventListener("click", function(e) {
      if (e.target === modalBackdrop) {
        console.log("点击背景，关闭模态窗口");
        closeModal();
      }
    });
    nameInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        console.log("检测到回车键，提交表单");
        e.preventDefault();
        validateAndSave();
      }
    });
    nameInput.focus();
    console.log("模态窗口准备完成");
  }
  const fadeOutCSS = `
@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

@keyframes scaleOut {
    from { transform: scale(1); opacity: 1; }
    to { transform: scale(0.95); opacity: 0; }
}

/* 确保模态框容器在动画期间保持固定位置 */
.modal-content {
    transform-origin: center;
    will-change: transform, opacity;
}

/* 强制覆盖 Tailwind 暗黑模式样式 */
.dark-mode {
    background-color: #1f2937 !important;
    color: #f3f4f6 !important;
    border-color: #4b5563 !important;
}

.dark-mode input, .dark-mode button {
    color: #f3f4f6 !important;
}

.dark-mode input {
    background-color: #374151 !important;
    border-color: #4b5563 !important;
}

.dark-mode button.bg-gray-100 {
    background-color: #374151 !important;
    border-color: #4b5563 !important;
}

.dark-mode button.bg-sky-500 {
    background-color: #0284c7 !important;
}
`;
  function addModalCSS() {
    console.log("添加模态窗口CSS");
    const existingStyle = document.getElementById("tk-modal-style");
    if (existingStyle) {
      console.log("CSS已存在，跳过添加");
      return;
    }
    const style = document.createElement("style");
    style.id = "tk-modal-style";
    style.textContent = fadeOutCSS;
    document.head.appendChild(style);
    console.log("模态窗口CSS已添加到页面");
  }
  (function initModalCSS() {
    if (document.readyState === "complete") {
      addModalCSS();
    } else {
      window.addEventListener("load", addModalCSS);
    }
  })();
  async function openEmptyAccount() {
    console.log("开始执行打开空账号功能...");
    try {
      const clearedCount = await clearAllTikTokCookies();
      if (clearedCount > 0) {
        showToast(`已清除cookies和本地存储，即将打开无登录状态页面`, "success");
        console.log(`Cookie清除完成，共清除 ${clearedCount} 个cookie，准备刷新页面`);
        setTimeout(() => {
          refreshPage();
        }, DEFAULT_CONFIG.refreshDelay);
      } else {
        showToast("未检测到需要清除的Cookie", "info");
        console.log("未检测到需要清除的Cookie");
      }
    } catch (error) {
      showToast("打开空账号失败，请手动清除Cookie", "error");
      console.error("打开空账号失败:", error);
    }
  }
  async function saveCurrentAccount() {
    console.log("开始执行saveCurrentAccount函数...");
    showSaveAccountModal(async (accountName) => {
      console.log("模态窗口回调函数被触发，账号名称:", accountName);
      try {
        const allCookies = await getAllCookies();
        if (!allCookies || allCookies.length === 0) {
          console.warn("未获取到任何cookie，无法保存账号");
          showToast("未检测到任何cookie，请确保已登录TikTok", "error");
          return;
        }
        const validCookies = allCookies.filter((cookie) => cookie.value !== "");
        if (validCookies.length === 0) {
          console.warn("所有cookie都是空值，无法保存账号");
          showToast("所有cookie都是空值，请确保已登录TikTok", "error");
          return;
        }
        console.log(`获取到 ${validCookies.length} 个有效cookies`);
        const cookieString = validCookies.map(
          (cookie) => `${cookie.name}=${cookie.value}`
        ).join("; ");
        console.log(`准备保存 ${validCookies.length} 个cookies`);
        __vitePreload(async () => {
          const { addAccount: addAccount2 } = await Promise.resolve().then(() => helpers);
          return { addAccount: addAccount2 };
        }, true ? void 0 : void 0).then(({ addAccount: addAccount2 }) => {
          const success = addAccount2(accountName, cookieString, DEFAULT_CONFIG.defaultGroup);
          if (success) {
            loadAccounts();
            showToast(`账号"${accountName}"已保存到"${DEFAULT_CONFIG.defaultGroup}"，共保存了 ${validCookies.length} 个cookies`, "success");
          } else {
            showToast("保存账号失败，可能是账号名已存在", "error");
          }
        });
      } catch (error) {
        console.error("保存账号时出错:", error);
        showToast("保存账号失败，请重试", "error");
      }
    });
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var atoa$1 = function atoa(a, n) {
    return Array.prototype.slice.call(a, n);
  };
  var si = typeof setImmediate === "function", tick;
  if (si) {
    tick = function(fn) {
      setImmediate(fn);
    };
  } else {
    tick = function(fn) {
      setTimeout(fn, 0);
    };
  }
  var tickyBrowser = tick;
  var ticky = tickyBrowser;
  var debounce$1 = function debounce(fn, args, ctx) {
    if (!fn) {
      return;
    }
    ticky(function run() {
      fn.apply(ctx || null, args || []);
    });
  };
  var atoa2 = atoa$1;
  var debounce2 = debounce$1;
  var emitter$1 = function emitter(thing, options) {
    var opts = options || {};
    var evt = {};
    if (thing === void 0) {
      thing = {};
    }
    thing.on = function(type, fn) {
      if (!evt[type]) {
        evt[type] = [fn];
      } else {
        evt[type].push(fn);
      }
      return thing;
    };
    thing.once = function(type, fn) {
      fn._once = true;
      thing.on(type, fn);
      return thing;
    };
    thing.off = function(type, fn) {
      var c = arguments.length;
      if (c === 1) {
        delete evt[type];
      } else if (c === 0) {
        evt = {};
      } else {
        var et = evt[type];
        if (!et) {
          return thing;
        }
        et.splice(et.indexOf(fn), 1);
      }
      return thing;
    };
    thing.emit = function() {
      var args = atoa2(arguments);
      return thing.emitterSnapshot(args.shift()).apply(this, args);
    };
    thing.emitterSnapshot = function(type) {
      var et = (evt[type] || []).slice(0);
      return function() {
        var args = atoa2(arguments);
        var ctx = this || thing;
        if (type === "error" && opts.throws !== false && !et.length) {
          throw args.length === 1 ? args[0] : args;
        }
        et.forEach(function emitter3(listen) {
          if (opts.async) {
            debounce2(listen, args, ctx);
          } else {
            listen.apply(ctx, args);
          }
          if (listen._once) {
            thing.off(type, listen);
          }
        });
        return thing;
      };
    };
    return thing;
  };
  var NativeCustomEvent = commonjsGlobal.CustomEvent;
  function useNative() {
    try {
      var p = new NativeCustomEvent("cat", { detail: { foo: "bar" } });
      return "cat" === p.type && "bar" === p.detail.foo;
    } catch (e) {
    }
    return false;
  }
  var customEvent$1 = useNative() ? NativeCustomEvent : (
    // IE >= 9
    "undefined" !== typeof document && "function" === typeof document.createEvent ? function CustomEvent(type, params) {
      var e = document.createEvent("CustomEvent");
      if (params) {
        e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
      } else {
        e.initCustomEvent(type, false, false, void 0);
      }
      return e;
    } : (
      // IE <= 8
      function CustomEvent2(type, params) {
        var e = document.createEventObject();
        e.type = type;
        if (params) {
          e.bubbles = Boolean(params.bubbles);
          e.cancelable = Boolean(params.cancelable);
          e.detail = params.detail;
        } else {
          e.bubbles = false;
          e.cancelable = false;
          e.detail = void 0;
        }
        return e;
      }
    )
  );
  var eventmap$1 = [];
  var eventname = "";
  var ron = /^on/;
  for (eventname in commonjsGlobal) {
    if (ron.test(eventname)) {
      eventmap$1.push(eventname.slice(2));
    }
  }
  var eventmap_1 = eventmap$1;
  var customEvent = customEvent$1;
  var eventmap = eventmap_1;
  var doc$1 = commonjsGlobal.document;
  var addEvent = addEventEasy;
  var removeEvent = removeEventEasy;
  var hardCache = [];
  if (!commonjsGlobal.addEventListener) {
    addEvent = addEventHard;
    removeEvent = removeEventHard;
  }
  var crossvent$1 = {
    add: addEvent,
    remove: removeEvent,
    fabricate: fabricateEvent
  };
  function addEventEasy(el, type, fn, capturing) {
    return el.addEventListener(type, fn, capturing);
  }
  function addEventHard(el, type, fn) {
    return el.attachEvent("on" + type, wrap(el, type, fn));
  }
  function removeEventEasy(el, type, fn, capturing) {
    return el.removeEventListener(type, fn, capturing);
  }
  function removeEventHard(el, type, fn) {
    var listener = unwrap(el, type, fn);
    if (listener) {
      return el.detachEvent("on" + type, listener);
    }
  }
  function fabricateEvent(el, type, model) {
    var e = eventmap.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
    if (el.dispatchEvent) {
      el.dispatchEvent(e);
    } else {
      el.fireEvent("on" + type, e);
    }
    function makeClassicEvent() {
      var e2;
      if (doc$1.createEvent) {
        e2 = doc$1.createEvent("Event");
        e2.initEvent(type, true, true);
      } else if (doc$1.createEventObject) {
        e2 = doc$1.createEventObject();
      }
      return e2;
    }
    function makeCustomEvent() {
      return new customEvent(type, { detail: model });
    }
  }
  function wrapperFactory(el, type, fn) {
    return function wrapper(originalEvent) {
      var e = originalEvent || commonjsGlobal.event;
      e.target = e.target || e.srcElement;
      e.preventDefault = e.preventDefault || function preventDefault() {
        e.returnValue = false;
      };
      e.stopPropagation = e.stopPropagation || function stopPropagation() {
        e.cancelBubble = true;
      };
      e.which = e.which || e.keyCode;
      fn.call(el, e);
    };
  }
  function wrap(el, type, fn) {
    var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
    hardCache.push({
      wrapper,
      element: el,
      type,
      fn
    });
    return wrapper;
  }
  function unwrap(el, type, fn) {
    var i = find(el, type, fn);
    if (i) {
      var wrapper = hardCache[i].wrapper;
      hardCache.splice(i, 1);
      return wrapper;
    }
  }
  function find(el, type, fn) {
    var i, item;
    for (i = 0; i < hardCache.length; i++) {
      item = hardCache[i];
      if (item.element === el && item.type === type && item.fn === fn) {
        return i;
      }
    }
  }
  var cache = {};
  var start = "(?:^|\\s)";
  var end = "(?:\\s|$)";
  function lookupClass(className) {
    var cached = cache[className];
    if (cached) {
      cached.lastIndex = 0;
    } else {
      cache[className] = cached = new RegExp(start + className + end, "g");
    }
    return cached;
  }
  function addClass(el, className) {
    var current = el.className;
    if (!current.length) {
      el.className = className;
    } else if (!lookupClass(className).test(current)) {
      el.className += " " + className;
    }
  }
  function rmClass(el, className) {
    el.className = el.className.replace(lookupClass(className), " ").trim();
  }
  var classes$1 = {
    add: addClass,
    rm: rmClass
  };
  var emitter2 = emitter$1;
  var crossvent = crossvent$1;
  var classes = classes$1;
  var doc = document;
  var documentElement = doc.documentElement;
  function dragula(initialContainers, options) {
    var len = arguments.length;
    if (len === 1 && Array.isArray(initialContainers) === false) {
      options = initialContainers;
      initialContainers = [];
    }
    var _mirror;
    var _source;
    var _item;
    var _offsetX;
    var _offsetY;
    var _moveX;
    var _moveY;
    var _initialSibling;
    var _currentSibling;
    var _copy;
    var _renderTimer;
    var _lastDropTarget = null;
    var _grabbed;
    var o = options || {};
    if (o.moves === void 0) {
      o.moves = always;
    }
    if (o.accepts === void 0) {
      o.accepts = always;
    }
    if (o.invalid === void 0) {
      o.invalid = invalidTarget;
    }
    if (o.containers === void 0) {
      o.containers = initialContainers || [];
    }
    if (o.isContainer === void 0) {
      o.isContainer = never;
    }
    if (o.copy === void 0) {
      o.copy = false;
    }
    if (o.copySortSource === void 0) {
      o.copySortSource = false;
    }
    if (o.revertOnSpill === void 0) {
      o.revertOnSpill = false;
    }
    if (o.removeOnSpill === void 0) {
      o.removeOnSpill = false;
    }
    if (o.direction === void 0) {
      o.direction = "vertical";
    }
    if (o.ignoreInputTextSelection === void 0) {
      o.ignoreInputTextSelection = true;
    }
    if (o.mirrorContainer === void 0) {
      o.mirrorContainer = doc.body;
    }
    var drake = emitter2({
      containers: o.containers,
      start: manualStart,
      end: end2,
      cancel,
      remove,
      destroy,
      canMove,
      dragging: false
    });
    if (o.removeOnSpill === true) {
      drake.on("over", spillOver).on("out", spillOut);
    }
    events();
    return drake;
    function isContainer(el) {
      return drake.containers.indexOf(el) !== -1 || o.isContainer(el);
    }
    function events(remove2) {
      var op = remove2 ? "remove" : "add";
      touchy(documentElement, op, "mousedown", grab);
      touchy(documentElement, op, "mouseup", release);
    }
    function eventualMovements(remove2) {
      var op = remove2 ? "remove" : "add";
      touchy(documentElement, op, "mousemove", startBecauseMouseMoved);
    }
    function movements(remove2) {
      var op = remove2 ? "remove" : "add";
      crossvent[op](documentElement, "selectstart", preventGrabbed);
      crossvent[op](documentElement, "click", preventGrabbed);
    }
    function destroy() {
      events(true);
      release({});
    }
    function preventGrabbed(e) {
      if (_grabbed) {
        e.preventDefault();
      }
    }
    function grab(e) {
      _moveX = e.clientX;
      _moveY = e.clientY;
      var ignore = whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
      if (ignore) {
        return;
      }
      var item = e.target;
      var context = canStart(item);
      if (!context) {
        return;
      }
      _grabbed = context;
      eventualMovements();
      if (e.type === "mousedown") {
        if (isInput(item)) {
          item.focus();
        } else {
          e.preventDefault();
        }
      }
    }
    function startBecauseMouseMoved(e) {
      if (!_grabbed) {
        return;
      }
      if (whichMouseButton(e) === 0) {
        release({});
        return;
      }
      if (e.clientX !== void 0 && Math.abs(e.clientX - _moveX) <= (o.slideFactorX || 0) && (e.clientY !== void 0 && Math.abs(e.clientY - _moveY) <= (o.slideFactorY || 0))) {
        return;
      }
      if (o.ignoreInputTextSelection) {
        var clientX = getCoord("clientX", e) || 0;
        var clientY = getCoord("clientY", e) || 0;
        var elementBehindCursor = doc.elementFromPoint(clientX, clientY);
        if (isInput(elementBehindCursor)) {
          return;
        }
      }
      var grabbed = _grabbed;
      eventualMovements(true);
      movements();
      end2();
      start2(grabbed);
      var offset = getOffset(_item);
      _offsetX = getCoord("pageX", e) - offset.left;
      _offsetY = getCoord("pageY", e) - offset.top;
      classes.add(_copy || _item, "gu-transit");
      renderMirrorImage();
      drag(e);
    }
    function canStart(item) {
      if (drake.dragging && _mirror) {
        return;
      }
      if (isContainer(item)) {
        return;
      }
      var handle = item;
      while (getParent(item) && isContainer(getParent(item)) === false) {
        if (o.invalid(item, handle)) {
          return;
        }
        item = getParent(item);
        if (!item) {
          return;
        }
      }
      var source = getParent(item);
      if (!source) {
        return;
      }
      if (o.invalid(item, handle)) {
        return;
      }
      var movable = o.moves(item, source, handle, nextEl(item));
      if (!movable) {
        return;
      }
      return {
        item,
        source
      };
    }
    function canMove(item) {
      return !!canStart(item);
    }
    function manualStart(item) {
      var context = canStart(item);
      if (context) {
        start2(context);
      }
    }
    function start2(context) {
      if (isCopy(context.item, context.source)) {
        _copy = context.item.cloneNode(true);
        drake.emit("cloned", _copy, context.item, "copy");
      }
      _source = context.source;
      _item = context.item;
      _initialSibling = _currentSibling = nextEl(context.item);
      drake.dragging = true;
      drake.emit("drag", _item, _source);
    }
    function invalidTarget() {
      return false;
    }
    function end2() {
      if (!drake.dragging) {
        return;
      }
      var item = _copy || _item;
      drop(item, getParent(item));
    }
    function ungrab() {
      _grabbed = false;
      eventualMovements(true);
      movements(true);
    }
    function release(e) {
      ungrab();
      if (!drake.dragging) {
        return;
      }
      var item = _copy || _item;
      var clientX = getCoord("clientX", e) || 0;
      var clientY = getCoord("clientY", e) || 0;
      var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
      var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
      if (dropTarget && (_copy && o.copySortSource || (!_copy || dropTarget !== _source))) {
        drop(item, dropTarget);
      } else if (o.removeOnSpill) {
        remove();
      } else {
        cancel();
      }
    }
    function drop(item, target) {
      var parent = getParent(item);
      if (_copy && o.copySortSource && target === _source) {
        parent.removeChild(_item);
      }
      if (isInitialPlacement(target)) {
        drake.emit("cancel", item, _source, _source);
      } else {
        drake.emit("drop", item, target, _source, _currentSibling);
      }
      cleanup();
    }
    function remove() {
      if (!drake.dragging) {
        return;
      }
      var item = _copy || _item;
      var parent = getParent(item);
      if (parent) {
        parent.removeChild(item);
      }
      drake.emit(_copy ? "cancel" : "remove", item, parent, _source);
      cleanup();
    }
    function cancel(revert) {
      if (!drake.dragging) {
        return;
      }
      var reverts = arguments.length > 0 ? revert : o.revertOnSpill;
      var item = _copy || _item;
      var parent = getParent(item);
      var initial = isInitialPlacement(parent);
      if (initial === false && reverts) {
        if (_copy) {
          if (parent) {
            parent.removeChild(_copy);
          }
        } else {
          _source.insertBefore(item, _initialSibling);
        }
      }
      if (initial || reverts) {
        drake.emit("cancel", item, _source, _source);
      } else {
        drake.emit("drop", item, parent, _source, _currentSibling);
      }
      cleanup();
    }
    function cleanup() {
      var item = _copy || _item;
      ungrab();
      removeMirrorImage();
      if (item) {
        classes.rm(item, "gu-transit");
      }
      if (_renderTimer) {
        clearTimeout(_renderTimer);
      }
      drake.dragging = false;
      if (_lastDropTarget) {
        drake.emit("out", item, _lastDropTarget, _source);
      }
      drake.emit("dragend", item);
      _source = _item = _copy = _initialSibling = _currentSibling = _renderTimer = _lastDropTarget = null;
    }
    function isInitialPlacement(target, s) {
      var sibling;
      if (s !== void 0) {
        sibling = s;
      } else if (_mirror) {
        sibling = _currentSibling;
      } else {
        sibling = nextEl(_copy || _item);
      }
      return target === _source && sibling === _initialSibling;
    }
    function findDropTarget(elementBehindCursor, clientX, clientY) {
      var target = elementBehindCursor;
      while (target && !accepted()) {
        target = getParent(target);
      }
      return target;
      function accepted() {
        var droppable = isContainer(target);
        if (droppable === false) {
          return false;
        }
        var immediate = getImmediateChild(target, elementBehindCursor);
        var reference = getReference(target, immediate, clientX, clientY);
        var initial = isInitialPlacement(target, reference);
        if (initial) {
          return true;
        }
        return o.accepts(_item, target, _source, reference);
      }
    }
    function drag(e) {
      if (!_mirror) {
        return;
      }
      e.preventDefault();
      var clientX = getCoord("clientX", e) || 0;
      var clientY = getCoord("clientY", e) || 0;
      var x = clientX - _offsetX;
      var y = clientY - _offsetY;
      _mirror.style.left = x + "px";
      _mirror.style.top = y + "px";
      var item = _copy || _item;
      var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
      var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
      var changed = dropTarget !== null && dropTarget !== _lastDropTarget;
      if (changed || dropTarget === null) {
        out();
        _lastDropTarget = dropTarget;
        over();
      }
      var parent = getParent(item);
      if (dropTarget === _source && _copy && !o.copySortSource) {
        if (parent) {
          parent.removeChild(item);
        }
        return;
      }
      var reference;
      var immediate = getImmediateChild(dropTarget, elementBehindCursor);
      if (immediate !== null) {
        reference = getReference(dropTarget, immediate, clientX, clientY);
      } else if (o.revertOnSpill === true && !_copy) {
        reference = _initialSibling;
        dropTarget = _source;
      } else {
        if (_copy && parent) {
          parent.removeChild(item);
        }
        return;
      }
      if (reference === null && changed || reference !== item && reference !== nextEl(item)) {
        _currentSibling = reference;
        dropTarget.insertBefore(item, reference);
        drake.emit("shadow", item, dropTarget, _source);
      }
      function moved(type) {
        drake.emit(type, item, _lastDropTarget, _source);
      }
      function over() {
        if (changed) {
          moved("over");
        }
      }
      function out() {
        if (_lastDropTarget) {
          moved("out");
        }
      }
    }
    function spillOver(el) {
      classes.rm(el, "gu-hide");
    }
    function spillOut(el) {
      if (drake.dragging) {
        classes.add(el, "gu-hide");
      }
    }
    function renderMirrorImage() {
      if (_mirror) {
        return;
      }
      var rect = _item.getBoundingClientRect();
      _mirror = _item.cloneNode(true);
      _mirror.style.width = getRectWidth(rect) + "px";
      _mirror.style.height = getRectHeight(rect) + "px";
      classes.rm(_mirror, "gu-transit");
      classes.add(_mirror, "gu-mirror");
      o.mirrorContainer.appendChild(_mirror);
      touchy(documentElement, "add", "mousemove", drag);
      classes.add(o.mirrorContainer, "gu-unselectable");
      drake.emit("cloned", _mirror, _item, "mirror");
    }
    function removeMirrorImage() {
      if (_mirror) {
        classes.rm(o.mirrorContainer, "gu-unselectable");
        touchy(documentElement, "remove", "mousemove", drag);
        getParent(_mirror).removeChild(_mirror);
        _mirror = null;
      }
    }
    function getImmediateChild(dropTarget, target) {
      var immediate = target;
      while (immediate !== dropTarget && getParent(immediate) !== dropTarget) {
        immediate = getParent(immediate);
      }
      if (immediate === documentElement) {
        return null;
      }
      return immediate;
    }
    function getReference(dropTarget, target, x, y) {
      var horizontal = o.direction === "horizontal";
      var reference = target !== dropTarget ? inside() : outside();
      return reference;
      function outside() {
        var len2 = dropTarget.children.length;
        var i;
        var el;
        var rect;
        for (i = 0; i < len2; i++) {
          el = dropTarget.children[i];
          rect = el.getBoundingClientRect();
          if (horizontal && rect.left + rect.width / 2 > x) {
            return el;
          }
          if (!horizontal && rect.top + rect.height / 2 > y) {
            return el;
          }
        }
        return null;
      }
      function inside() {
        var rect = target.getBoundingClientRect();
        if (horizontal) {
          return resolve(x > rect.left + getRectWidth(rect) / 2);
        }
        return resolve(y > rect.top + getRectHeight(rect) / 2);
      }
      function resolve(after) {
        return after ? nextEl(target) : target;
      }
    }
    function isCopy(item, container) {
      return typeof o.copy === "boolean" ? o.copy : o.copy(item, container);
    }
  }
  function touchy(el, op, type, fn) {
    var touch = {
      mouseup: "touchend",
      mousedown: "touchstart",
      mousemove: "touchmove"
    };
    var pointers = {
      mouseup: "pointerup",
      mousedown: "pointerdown",
      mousemove: "pointermove"
    };
    var microsoft = {
      mouseup: "MSPointerUp",
      mousedown: "MSPointerDown",
      mousemove: "MSPointerMove"
    };
    if (commonjsGlobal.navigator.pointerEnabled) {
      crossvent[op](el, pointers[type], fn);
    } else if (commonjsGlobal.navigator.msPointerEnabled) {
      crossvent[op](el, microsoft[type], fn);
    } else {
      crossvent[op](el, touch[type], fn);
      crossvent[op](el, type, fn);
    }
  }
  function whichMouseButton(e) {
    if (e.touches !== void 0) {
      return e.touches.length;
    }
    if (e.which !== void 0 && e.which !== 0) {
      return e.which;
    }
    if (e.buttons !== void 0) {
      return e.buttons;
    }
    var button = e.button;
    if (button !== void 0) {
      return button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
    }
  }
  function getOffset(el) {
    var rect = el.getBoundingClientRect();
    return {
      left: rect.left + getScroll("scrollLeft", "pageXOffset"),
      top: rect.top + getScroll("scrollTop", "pageYOffset")
    };
  }
  function getScroll(scrollProp, offsetProp) {
    if (typeof commonjsGlobal[offsetProp] !== "undefined") {
      return commonjsGlobal[offsetProp];
    }
    if (documentElement.clientHeight) {
      return documentElement[scrollProp];
    }
    return doc.body[scrollProp];
  }
  function getElementBehindPoint(point, x, y) {
    point = point || {};
    var state = point.className || "";
    var el;
    point.className += " gu-hide";
    el = doc.elementFromPoint(x, y);
    point.className = state;
    return el;
  }
  function never() {
    return false;
  }
  function always() {
    return true;
  }
  function getRectWidth(rect) {
    return rect.width || rect.right - rect.left;
  }
  function getRectHeight(rect) {
    return rect.height || rect.bottom - rect.top;
  }
  function getParent(el) {
    return el.parentNode === doc ? null : el.parentNode;
  }
  function isInput(el) {
    return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || isEditable(el);
  }
  function isEditable(el) {
    if (!el) {
      return false;
    }
    if (el.contentEditable === "false") {
      return false;
    }
    if (el.contentEditable === "true") {
      return true;
    }
    return isEditable(getParent(el));
  }
  function nextEl(el) {
    return el.nextElementSibling || manually();
    function manually() {
      var sibling = el;
      do {
        sibling = sibling.nextSibling;
      } while (sibling && sibling.nodeType !== 1);
      return sibling;
    }
  }
  function getEventHost(e) {
    if (e.targetTouches && e.targetTouches.length) {
      return e.targetTouches[0];
    }
    if (e.changedTouches && e.changedTouches.length) {
      return e.changedTouches[0];
    }
    return e;
  }
  function getCoord(coord, e) {
    var host = getEventHost(e);
    var missMap = {
      pageX: "clientX",
      // IE8
      pageY: "clientY"
      // IE8
    };
    if (coord in missMap && !(coord in host) && missMap[coord] in host) {
      coord = missMap[coord];
    }
    return host[coord];
  }
  var dragula_1 = dragula;
  const dragula$1 = /* @__PURE__ */ getDefaultExportFromCjs(dragula_1);
  function exportAccounts(groupName = null) {
    const { separator } = ACCOUNT_STRUCTURE.importFormat;
    const accounts = getAccounts();
    const exportLines = [];
    let accountNames = [];
    if (groupName) {
      accountNames = getAccountsInGroup(groupName);
    } else {
      accountNames = Object.keys(accounts);
    }
    const groups = getGroups();
    accountNames.forEach((name) => {
      let accountGroup = "";
      for (const group in groups) {
        if (groups[group].includes(name)) {
          accountGroup = group;
          break;
        }
      }
      let accountData = accounts[name];
      let cookieString = "";
      let note = "";
      if (typeof accountData === "string") {
        cookieString = accountData;
      } else if (typeof accountData === "object") {
        cookieString = accountData.cookie || "";
        note = accountData.note || "";
      }
      const exportLine = [
        name,
        // 账号名称
        cookieString,
        // cookie字符串
        accountGroup,
        // 分组名称
        note
        // 账号备注
      ].join(separator);
      exportLines.push(exportLine);
    });
    return exportLines.join("\n");
  }
  function downloadExportedAccounts(groupName = null) {
    const exportContent = exportAccounts(groupName);
    if (!exportContent) {
      showToast("没有可导出的账号", "warning");
      return;
    }
    const blob = new Blob([exportContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = groupName ? `tiktok_accounts_${groupName}.txt` : "tiktok_accounts.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    showToast("账号数据导出成功", "success");
  }
  function generatePanelTemplate(accounts = {}) {
    Object.keys(accounts).map(
      (name) => `<option value="${name}">${name}</option>`
    ).join("");
    return `
        <div class="p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
            <div class="flex items-center justify-between">
                <div class="text-lg font-semibold text-sky-500 dark:text-sky-400">账号切换器</div>
                <button class="bg-transparent border-0 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 p-2" id="tk-close-panel">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <div class="flex border-b border-gray-200 dark:border-gray-700 mt-4 overflow-x-auto scrollbar-hide">
                <div class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 border-b-2 border-sky-500 dark:border-sky-400 text-sky-500 dark:text-sky-400 cursor-pointer" data-tab="switch">切换账号</div>
                <div class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 border-b-2 border-transparent hover:text-sky-500 dark:hover:text-sky-400 cursor-pointer" data-tab="add">添加账号</div>
                <div class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 border-b-2 border-transparent hover:text-sky-500 dark:hover:text-sky-400 cursor-pointer" data-tab="group">分组管理</div>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto p-5 bg-white dark:bg-gray-800">
            <div id="tab-switch" class="block">
                ${generateSwitchTabTemplate()}
            </div>

            <div id="tab-add" class="hidden">
                ${generateAddTabTemplate()}
            </div>

            <div id="tab-group" class="hidden">
                ${generateGroupTabTemplate()}
            </div>
        </div>
    `;
  }
  function generateSwitchTabTemplate(accountOptions) {
    return `
        <div class="mb-4">
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">选择分组</label>
            <select class="w-full rounded-md border border-solid border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 p-3 text-sm mb-4 text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 dark:focus:ring-sky-700/30 transition" id="tk-switch-group-selector">
                <!-- 分组选项将由JS动态填充 -->
            </select>
        </div>

        <!-- 快捷操作区域 -->
        <div class="mb-5 flex space-x-2">
            <button class="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer transition shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 hover:-translate-y-0.5 hover:shadow-md" id="tk-empty-account">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                打开空账号
            </button>
            <button class="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-emerald-500 dark:bg-emerald-600 text-white cursor-pointer transition shadow-sm hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:-translate-y-0.5 hover:shadow-md" id="tk-save-current">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                保存当前账号
            </button>
        </div>

        <div class="mt-5">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">已保存账号列表</label>
            <div id="tk-account-list" class="max-h-[calc(100vh-250px)] overflow-y-auto">
                <!-- 账号列表将在这里动态生成 -->
            </div>
        </div>
    `;
  }
  function generateAddTabTemplate() {
    return `
        <div class="mb-4">
            <div class="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto">
                <div class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-b-2 border-sky-500 dark:border-sky-400 text-sky-500 dark:text-sky-400 cursor-pointer" data-subtab="single">添加单个账号</div>
                <div class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-b-2 border-transparent hover:text-sky-500 dark:hover:text-sky-400 cursor-pointer" data-subtab="batch">批量导入账号</div>
            </div>

            <div id="subtab-single" class="block">
                <form id="tk-add-account-form">
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">账号名称</label>
                        <input type="text" class="w-full rounded-md border border-solid border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 p-3 text-sm mb-2 text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 dark:focus:ring-sky-700/30 transition" id="tk-account-name" placeholder="输入方便识别的账号名称">
                    </div>
                    <div class="mb-4">
                        <label for="tk-account-cookies" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">账号Cookie</label>
                        <textarea class="w-full rounded-md border border-solid border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 p-3 text-sm mb-2 text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 dark:focus:ring-sky-700/30 transition" id="tk-account-cookies" placeholder="" rows="6" style="resize: vertical;"></textarea>
                        <div class="text-xs text-gray-700 dark:text-gray-400 mt-2"></div>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">选择分组</label>
                        <select class="w-full rounded-md border border-solid border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 p-3 text-sm mb-2 text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 dark:focus:ring-sky-700/30 transition" id="tk-account-group">
                            <!-- 分组选项将由JS动态填充 -->
                        </select>
                    </div>
                    <button type="submit" class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-sky-500 dark:bg-sky-600 text-white cursor-pointer transition shadow-sm hover:bg-sky-600 dark:hover:bg-sky-500 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm" id="tk-save-account">保存账号</button>
                </form>
            </div>

            <div id="subtab-batch" class="hidden">
                <div class="text-xs text-gray-700 dark:text-gray-400 mb-4">
                    从本地TXT文件批量导入账号，文件格式要求：<br>
                    - 每行一个账号<br>
                    - 每行格式为：账号名称|cookie字符串|分组名称(可选)|备注(可选)<br>
                    - 必须包含账号名称和cookie字符串，分组名称和备注可选
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">选择导入分组</label>
                    <select class="w-full rounded-md border border-solid border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 p-3 text-sm mb-2 text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 dark:focus:ring-sky-700/30 transition" id="tk-batch-group">
                        <!-- 分组选项将由JS动态填充 -->
                    </select>
                    <div class="text-xs text-gray-700 dark:text-gray-400 mt-1">
                        如果选择"使用文件中指定的分组"，将优先使用导入文件中指定的分组。如果文件中没有指定分组，账号将被添加到默认分组。
                    </div>
                </div>
                <input type="file" accept=".txt" class="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-sky-50 dark:file:bg-sky-900 file:text-sky-600 dark:file:text-sky-300 hover:file:bg-sky-100 dark:hover:file:bg-sky-800 cursor-pointer" id="tk-batch-file">
                <button class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-sky-500 dark:bg-sky-600 text-white cursor-pointer transition shadow-sm hover:bg-sky-600 dark:hover:bg-sky-500 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm mt-4" id="tk-process-batch">开始导入</button>

                <div id="tk-batch-results" class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hidden">
                    <div class="font-medium mb-2">导入结果：</div>
                    <div id="tk-batch-log"></div>
                </div>
            </div>
        </div>
    `;
  }
  function generateAccountItemTemplate(accountName, note = "") {
    return `
        <div class="flex flex-col flex-grow mr-2">
            <div class="font-medium text-gray-800 dark:text-gray-200">${accountName}</div>
            ${note ? `<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${note}</div>` : ""}
        </div>
        <div class="flex">
            <button class="inline-flex items-center bg-sky-500 dark:bg-sky-600 text-white rounded px-2 py-1 text-xs cursor-pointer hover:bg-sky-600 dark:hover:bg-sky-500 transition mr-1" data-switch="${accountName}" title="切换到此账号" style="writing-mode: horizontal-tb !important; text-orientation: mixed !important;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                <span style="display: inline-block; writing-mode: horizontal-tb !important;">切换</span>
            </button>
            <button class="bg-transparent border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition px-2 py-1 cursor-pointer text-gray-700 dark:text-gray-300" data-delete="${accountName}" title="删除此账号">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
        </div>
    `;
  }
  function generateEmptyAccountsTemplate() {
    return `
        <div class="py-6 px-4 text-center text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="mb-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto text-gray-400 dark:text-gray-500">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            </div>
            <div class="text-sm mb-3">还没有保存的账号</div>
            <button class="inline-flex items-center justify-center rounded-md text-xs py-2 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500" id="tk-go-add-account">添加一个账号</button>
        </div>
    `;
  }
  function generateGroupTabTemplate() {
    return `
        <div class="mb-4">
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">分组管理</label>

            <div class="flex mb-4">
                <input type="text" class="flex-1 rounded-l-md border border-solid border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 dark:focus:ring-sky-700/30 transition" id="tk-group-name" placeholder="输入新分组名称">
                <button class="rounded-r-md px-4 bg-sky-500 dark:bg-sky-600 text-white cursor-pointer transition hover:bg-sky-600 dark:hover:bg-sky-500" id="tk-add-group">添加分组</button>
            </div>

            <div class="my-4">
                <div class="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">拖拽管理分组和账号：</div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    - 拖动分组可以调整顺序<br>
                    - 拖动账号可以在分组间移动<br>
                    - 点击分组名称可以重命名
                </div>
            </div>

            <div id="tk-groups-container" class="space-y-4">
                <!-- 分组列表将在这里动态生成 -->
            </div>
        </div>

        <div class="mt-4 flex space-x-2">
            <button class="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer transition shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 hover:-translate-y-0.5 hover:shadow-md" id="tk-export-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                导出所有账号
            </button>
        </div>
    `;
  }
  function generateGroupItemTemplate(groupName, isDefaultGroup = false) {
    return `
        <div class="group-header flex justify-between items-center p-2 bg-gray-200 dark:bg-gray-600 rounded-t-md" data-group="${groupName}">
            <div class="flex items-center">
                <svg class="drag-handle cursor-move mr-2 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9h14M5 15h14"></path></svg>
                <span class="group-name font-medium ${isDefaultGroup ? "" : "cursor-pointer hover:text-sky-600 dark:hover:text-sky-400"}">${groupName}</span>
            </div>
            <div class="flex items-center">
                <button class="export-group-btn p-1 text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400" title="导出分组账号">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </button>
                ${isDefaultGroup ? "" : `
                <button class="delete-group-btn p-1 text-gray-600 dark:text-gray-300 hover:text-red-600" title="删除分组">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path></svg>
                </button>
                `}
            </div>
        </div>
        <div class="account-container p-2 bg-gray-100 dark:bg-gray-700 rounded-b-md min-h-[50px]" data-group="${groupName}">
            <!-- 账号项将在这里动态生成 -->
        </div>
    `;
  }
  function generateAccountDragItemTemplate(accountName, note = "") {
    return `
        <div class="account-item flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded mb-2 cursor-move border border-gray-200 dark:border-gray-600 hover:bg-sky-50 dark:hover:bg-sky-900/30" data-account="${accountName}">
            <div class="flex flex-col">
                <div class="account-name text-sm font-medium text-gray-800 dark:text-gray-200">${accountName}</div>
                ${note ? `<div class="account-note text-xs text-gray-500 dark:text-gray-400 mt-1">${note}</div>` : ""}
            </div>
            <div class="flex items-center">
                <button class="rename-account-btn p-1 text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 mr-1" title="重命名账号">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="edit-account-note-btn p-1 text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 mr-1" title="编辑账号备注">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <line x1="10" y1="9" x2="8" y2="9"></line>
                    </svg>
                </button>
                <button class="switch-account-btn p-1 text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 mr-1" title="切换到该账号">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <polyline points="17 11 19 13 23 9"></polyline>
                    </svg>
                </button>
                <button class="delete-account-btn p-1 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400" title="删除账号">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        </div>
    `;
  }
  function initGroupManagement() {
    const groupsContainer = getElementById("tk-groups-container");
    if (!groupsContainer) return;
    groupsContainer.innerHTML = "";
    const groups = getGroups();
    const accounts = getAccounts();
    for (const groupName in groups) {
      const groupElement = document.createElement("div");
      groupElement.className = "group-wrapper mb-4";
      groupElement.innerHTML = generateGroupItemTemplate(
        groupName,
        groupName === DEFAULT_CONFIG.defaultGroup
      );
      groupsContainer.appendChild(groupElement);
      const accountContainer = groupElement.querySelector(`.account-container[data-group="${groupName}"]`);
      const accountNames = groups[groupName];
      accountNames.forEach((accountName) => {
        if (accounts[accountName]) {
          const accountData = accounts[accountName];
          let note = "";
          if (typeof accountData === "object" && accountData.note) {
            note = accountData.note;
          }
          const accountElement = document.createElement("div");
          accountElement.innerHTML = generateAccountDragItemTemplate(accountName, note);
          accountContainer.appendChild(accountElement.firstElementChild);
        }
      });
    }
    bindGroupEvents();
    initDragula();
  }
  function bindGroupEvents() {
    const addGroupBtn = getElementById("tk-add-group");
    const groupNameInput = getElementById("tk-group-name");
    if (addGroupBtn && groupNameInput) {
      addGroupBtn.removeEventListener("click", addGroupHandler);
      addGroupBtn.addEventListener("click", addGroupHandler);
    }
    const exportAllBtn = getElementById("tk-export-all");
    if (exportAllBtn) {
      exportAllBtn.removeEventListener("click", exportAllHandler);
      exportAllBtn.addEventListener("click", exportAllHandler);
    }
    const exportGroupBtns = document.querySelectorAll(".export-group-btn");
    exportGroupBtns.forEach((btn) => {
      btn.removeEventListener("click", exportGroupHandler);
      btn.addEventListener("click", exportGroupHandler);
    });
    const deleteGroupBtns = document.querySelectorAll(".delete-group-btn");
    deleteGroupBtns.forEach((btn) => {
      btn.removeEventListener("click", deleteGroupHandler);
      btn.addEventListener("click", deleteGroupHandler);
    });
    const groupNames = document.querySelectorAll(".group-name");
    groupNames.forEach((nameEl) => {
      const groupHeader = nameEl.closest(".group-header");
      const groupName = groupHeader.getAttribute("data-group");
      if (groupName === DEFAULT_CONFIG.defaultGroup) return;
      nameEl.removeEventListener("click", groupRenameHandler);
      nameEl.addEventListener("click", groupRenameHandler);
    });
    const switchAccountBtns = document.querySelectorAll(".switch-account-btn");
    switchAccountBtns.forEach((btn) => {
      btn.removeEventListener("click", switchAccountHandler);
      btn.addEventListener("click", switchAccountHandler);
    });
    const renameAccountBtns = document.querySelectorAll(".rename-account-btn");
    renameAccountBtns.forEach((btn) => {
      btn.removeEventListener("click", renameAccountHandler);
      btn.addEventListener("click", renameAccountHandler);
    });
    const deleteAccountBtns = document.querySelectorAll(".delete-account-btn");
    deleteAccountBtns.forEach((btn) => {
      btn.removeEventListener("click", deleteAccountHandler);
      btn.addEventListener("click", deleteAccountHandler);
    });
    const editAccountNoteBtns = document.querySelectorAll(".edit-account-note-btn");
    editAccountNoteBtns.forEach((btn) => {
      btn.removeEventListener("click", editAccountNoteHandler);
      btn.addEventListener("click", editAccountNoteHandler);
    });
  }
  function initDragula() {
    const accountContainers = document.querySelectorAll(".account-container");
    const accountDrake = dragula$1(Array.from(accountContainers), {
      moves: function(el, container, handle) {
        return el.classList.contains("account-item");
      },
      accepts: function(el, target, source, sibling) {
        return target.classList.contains("account-container");
      }
    });
    accountDrake.on("drop", function(el, target, source, sibling) {
      const accountName = el.getAttribute("data-account");
      const targetGroup = target.getAttribute("data-group");
      const sourceGroup = source.getAttribute("data-group");
      if (targetGroup !== sourceGroup) {
        removeAccountFromGroup(accountName, sourceGroup);
        addAccountToGroup(accountName, targetGroup);
        showToast(`已将账号"${accountName}"移动到"${targetGroup}"分组`, "success");
      }
    });
    const groupsContainer = getElementById("tk-groups-container");
    const groupDrake = dragula$1([groupsContainer], {
      moves: function(el, container, handle) {
        return handle && handle.classList.contains("drag-handle");
      },
      accepts: function(el, target, source, sibling) {
        if (sibling && sibling.querySelector(`.group-header[data-group="${DEFAULT_CONFIG.defaultGroup}"]`)) {
          return false;
        }
        return true;
      }
    });
    groupDrake.on("drop", function(el, target, source, sibling) {
      updateGroupsOrder();
    });
  }
  function updateGroupsOrder() {
    const groupWrappers = document.querySelectorAll(".group-wrapper");
    const newOrder = [];
    groupWrappers.forEach((wrapper) => {
      const groupHeader = wrapper.querySelector(".group-header");
      const groupName = groupHeader.getAttribute("data-group");
      newOrder.push(groupName);
    });
    saveGroupsOrder(newOrder);
  }
  function saveGroupsOrder(orderedGroups) {
    const groups = getGroups();
    const orderedGroupsObj = {};
    orderedGroups.forEach((groupName) => {
      if (groups[groupName]) {
        orderedGroupsObj[groupName] = groups[groupName];
      }
    });
    if (setStorageValue(STORAGE_KEYS.GROUPS, orderedGroupsObj)) {
      showToast("分组顺序已更新", "success");
    }
  }
  function renameGroup(oldName, newName) {
    const groups = getGroups();
    if (groups[newName]) {
      showToast(`分组"${newName}"已存在`, "warning");
      return false;
    }
    const accountsToMove = [...groups[oldName]];
    if (!addGroup(newName)) {
      showToast("创建新分组失败", "error");
      return false;
    }
    const updatedGroups = getGroups();
    accountsToMove.forEach((accountName) => {
      if (!updatedGroups[newName].includes(accountName)) {
        updatedGroups[newName].push(accountName);
      }
    });
    delete updatedGroups[oldName];
    if (getCurrentGroup() === oldName) {
      setCurrentGroup(newName);
    }
    if (setStorageValue(STORAGE_KEYS.GROUPS, updatedGroups)) {
      showToast(`已将分组"${oldName}"重命名为"${newName}"`, "success");
      initGroupManagement();
      return true;
    } else {
      showToast("重命名分组失败", "error");
      return false;
    }
  }
  function addGroupHandler() {
    const groupNameInput = getElementById("tk-group-name");
    const groupName = groupNameInput.value.trim();
    if (groupName) {
      if (addGroup(groupName)) {
        initGroupManagement();
        groupNameInput.value = "";
        showToast(`成功添加分组"${groupName}"`, "success");
      } else {
        showToast(`分组"${groupName}"已存在`, "warning");
      }
    } else {
      showToast("请输入分组名称", "warning");
    }
  }
  function exportAllHandler() {
    downloadExportedAccounts();
  }
  function exportGroupHandler(e) {
    e.stopPropagation();
    const groupHeader = this.closest(".group-header");
    const groupName = groupHeader.getAttribute("data-group");
    downloadExportedAccounts(groupName);
  }
  async function deleteGroupHandler(e) {
    e.stopPropagation();
    this.removeEventListener("click", deleteGroupHandler);
    const groupHeader = this.closest(".group-header");
    const groupName = groupHeader.getAttribute("data-group");
    const confirmed = await showConfirm(`确定要删除分组"${groupName}"吗？分组内的账号将移至默认分组。`);
    if (confirmed) {
      if (removeGroup(groupName)) {
        showToast(`成功删除分组"${groupName}"`, "success");
        initGroupManagement();
      }
    } else {
      this.addEventListener("click", deleteGroupHandler);
    }
  }
  function groupRenameHandler(e) {
    e.stopPropagation();
    const groupHeader = this.closest(".group-header");
    const groupName = groupHeader.getAttribute("data-group");
    const newName = prompt("请输入新的分组名称:", groupName);
    if (newName && newName.trim() && newName !== groupName) {
      renameGroup(groupName, newName.trim());
    }
  }
  function switchAccountHandler(e) {
    e.stopPropagation();
    const accountItem = this.closest(".account-item");
    const accountName = accountItem.getAttribute("data-account");
    switchAccount(accountName);
  }
  function renameAccountHandler(e) {
    e.stopPropagation();
    const accountItem = this.closest(".account-item");
    const accountName = accountItem.getAttribute("data-account");
    const modalBackdrop = document.createElement("div");
    modalBackdrop.className = "fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[100001] flex items-center justify-center animate-[fadeIn_0.2s_ease]";
    modalBackdrop.innerHTML = `
        <div class="modal-content bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[350px] max-w-[90%] animate-[scaleIn_0.2s_ease]">
            <div class="p-5 border-b border-gray-200 dark:border-gray-700">
                <div class="text-lg font-semibold text-gray-900 dark:text-white">重命名账号</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">账号: ${accountName}</div>
            </div>

            <div class="p-5">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">新账号名称</label>
                    <input type="text" class="w-full rounded-md border border-solid border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 p-3 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 dark:focus:ring-sky-700/30 transition" id="tk-account-rename" placeholder="输入新账号名称" value="${accountName}">
                </div>

                <div id="tk-rename-error" class="text-sm text-red-500 mb-4 hidden"></div>

                <div class="flex space-x-2 mt-4">
                    <button class="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600" id="tk-rename-cancel">
                        取消
                    </button>
                    <button class="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-sky-500 dark:bg-sky-600 text-white cursor-pointer hover:bg-sky-600 dark:hover:bg-sky-500" id="tk-rename-save">
                        保存
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalBackdrop);
    const renameInput = document.getElementById("tk-account-rename");
    const errorElement = document.getElementById("tk-rename-error");
    const saveBtn = document.getElementById("tk-rename-save");
    const cancelBtn = document.getElementById("tk-rename-cancel");
    const closeModal = () => {
      modalBackdrop.classList.add("animate-[fadeOut_0.2s_ease]");
      setTimeout(() => {
        document.body.removeChild(modalBackdrop);
      }, 200);
    };
    saveBtn.addEventListener("click", () => {
      const newName = renameInput.value.trim();
      if (!newName) {
        errorElement.textContent = "账号名称不能为空";
        errorElement.classList.remove("hidden");
        return;
      }
      if (newName === accountName) {
        closeModal();
        return;
      }
      if (renameAccount(accountName, newName)) {
        showToast(`账号"${accountName}"已重命名为"${newName}"`, "success");
        closeModal();
        initGroupManagement();
      } else {
        errorElement.textContent = `重命名失败，"${newName}"可能已存在`;
        errorElement.classList.remove("hidden");
      }
    });
    cancelBtn.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", (e2) => {
      if (e2.target === modalBackdrop) {
        closeModal();
      }
    });
    const escHandler = (e2) => {
      if (e2.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
    renameInput.focus();
    renameInput.select();
  }
  async function deleteAccountHandler(e) {
    e.stopPropagation();
    const accountItem = this.closest(".account-item");
    const accountName = accountItem.getAttribute("data-account");
    deleteAccount(accountName);
    initGroupManagement();
    showToast(`成功删除账号"${accountName}"`, "success");
  }
  function editAccountNoteHandler(e) {
    e.stopPropagation();
    const accountItem = this.closest(".account-item");
    const accountName = accountItem.getAttribute("data-account");
    const currentNote = getAccountNote(accountName);
    showNoteEditModal(accountName, currentNote, (newNote) => {
      if (updateAccountNote(accountName, newNote)) {
        showToast(`账号"${accountName}"的备注已更新`, "success");
        const accountNameEl = accountItem.querySelector(".account-name");
        let accountNoteEl = accountItem.querySelector(".account-note");
        if (!newNote) {
          if (accountNoteEl) {
            accountNoteEl.remove();
          }
        } else {
          if (!accountNoteEl) {
            accountNoteEl = document.createElement("div");
            accountNoteEl.className = "account-note text-xs text-gray-500 dark:text-gray-400 mt-1";
            accountNameEl.parentNode.appendChild(accountNoteEl);
          }
          accountNoteEl.textContent = newNote;
        }
      } else {
        showToast("更新备注失败", "error");
      }
    });
  }
  function showNoteEditModal(accountName, currentNote, onSave) {
    const modalBackdrop = document.createElement("div");
    modalBackdrop.className = "fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[100001] flex items-center justify-center animate-[fadeIn_0.2s_ease]";
    modalBackdrop.innerHTML = `
        <div class="modal-content bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[350px] max-w-[90%] animate-[scaleIn_0.2s_ease]">
            <div class="p-5 border-b border-gray-200 dark:border-gray-700">
                <div class="text-lg font-semibold text-gray-900 dark:text-white">编辑账号备注</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">账号: ${accountName}</div>
            </div>

            <div class="p-5">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">备注内容</label>
                    <textarea class="w-full rounded-md border border-solid border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 p-3 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 dark:focus:ring-sky-700/30 transition" id="tk-account-note" placeholder="输入账号备注信息" rows="4" style="resize: none;">${currentNote || ""}</textarea>
                </div>

                <div class="flex space-x-2 mt-4">
                    <button class="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600" id="tk-note-cancel">
                        取消
                    </button>
                    <button class="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-sky-500 dark:bg-sky-600 text-white cursor-pointer hover:bg-sky-600 dark:hover:bg-sky-500" id="tk-note-save">
                        保存
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalBackdrop);
    const noteTextarea = document.getElementById("tk-account-note");
    const saveBtn = document.getElementById("tk-note-save");
    const cancelBtn = document.getElementById("tk-note-cancel");
    const closeModal = () => {
      modalBackdrop.classList.add("animate-[fadeOut_0.2s_ease]");
      setTimeout(() => {
        document.body.removeChild(modalBackdrop);
      }, 200);
    };
    saveBtn.addEventListener("click", () => {
      const newNote = noteTextarea.value.trim();
      onSave(newNote);
      closeModal();
    });
    cancelBtn.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
    const escHandler = (e) => {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
    noteTextarea.focus();
  }
  function createPanel() {
    const existingPanel = getElementById(DOM_IDS.PANEL);
    if (existingPanel) {
      if (existingPanel.classList.contains(CSS_CLASSES.HIDDEN)) {
        existingPanel.classList.remove(CSS_CLASSES.HIDDEN);
      }
      return;
    }
    const panel2 = document.createElement("div");
    panel2.id = DOM_IDS.PANEL;
    panel2.className = "fixed top-0 right-0 h-screen w-[360px] bg-white dark:bg-gray-800 shadow-lg z-[9999] overflow-y-auto animate-[slideInRight_0.3s_ease] flex flex-col font-sans hidden";
    if (isDarkMode()) {
      panel2.classList.add(CSS_CLASSES.DARK_THEME);
    }
    const accounts = getAccounts();
    panel2.innerHTML = generatePanelTemplate(accounts);
    document.body.appendChild(panel2);
    _initPanelEventListeners();
    initSwitchGroupSelector();
    const groupSelector = getElementById("tk-switch-group-selector");
    if (groupSelector) {
      loadAccounts(groupSelector.value);
    } else {
      loadAccounts();
    }
    initAccountGroupSelector();
    initBatchGroupSelector();
  }
  function _initPanelEventListeners() {
    const closeBtn = getElementById(DOM_IDS.CLOSE_PANEL_BTN);
    if (closeBtn) {
      closeBtn.addEventListener("click", function() {
        const panel2 = getElementById(DOM_IDS.PANEL);
        if (panel2) {
          panel2.classList.add(CSS_CLASSES.HIDDEN);
        }
      });
    }
    _initTabSwitching();
    _initSubTabSwitching();
    const saveCurrentBtn = getElementById(DOM_IDS.SAVE_CURRENT_BTN);
    if (saveCurrentBtn) {
      saveCurrentBtn.addEventListener("click", saveCurrentAccount);
    }
    const emptyAccountBtn = getElementById(DOM_IDS.EMPTY_ACCOUNT_BTN);
    if (emptyAccountBtn) {
      emptyAccountBtn.addEventListener("click", openEmptyAccount);
    }
    const addAccountForm = getElementById(DOM_IDS.ADD_ACCOUNT_FORM);
    if (addAccountForm) {
      addAccountForm.addEventListener("submit", function(e) {
        e.preventDefault();
        saveAccount();
      });
    }
    const processBatchBtn = getElementById(DOM_IDS.PROCESS_BATCH_BTN);
    if (processBatchBtn) {
      processBatchBtn.addEventListener("click", processBatchImport);
    }
  }
  function _initTabSwitching() {
    const tabs = document.querySelectorAll("[data-tab]");
    tabs.forEach((tab) => {
      tab.addEventListener("click", function() {
        tabs.forEach((t) => {
          t.classList.remove("border-sky-500", "text-sky-500", "border-sky-400", "text-sky-400");
          t.classList.add("border-transparent");
        });
        this.classList.add(isDarkMode() ? "border-sky-400" : "border-sky-500");
        this.classList.add(isDarkMode() ? "text-sky-400" : "text-sky-500");
        this.classList.remove("border-transparent");
        const tabContents = document.querySelectorAll("#tab-switch, #tab-add, #tab-group");
        tabContents.forEach((content) => {
          content.classList.add(CSS_CLASSES.HIDDEN);
          content.classList.remove(CSS_CLASSES.BLOCK);
        });
        const tabId = `tab-${this.getAttribute("data-tab")}`;
        const tabContent = getElementById(tabId);
        if (tabContent) {
          tabContent.classList.add(CSS_CLASSES.BLOCK);
          tabContent.classList.remove(CSS_CLASSES.HIDDEN);
          if (tabId === "tab-add") {
            initAccountGroupSelector();
            initBatchGroupSelector();
          }
          if (tabId === "tab-group") {
            initGroupManagement();
          }
          if (tabId === "tab-switch") {
            initSwitchGroupSelector();
            const groupSelector = getElementById("tk-switch-group-selector");
            if (groupSelector) {
              loadAccounts(groupSelector.value);
            } else {
              loadAccounts();
            }
          }
        }
      });
    });
  }
  function _initSubTabSwitching() {
    const subTabs = document.querySelectorAll("[data-subtab]");
    subTabs.forEach((tab) => {
      tab.addEventListener("click", function() {
        subTabs.forEach((t) => {
          t.classList.remove("border-sky-500", "text-sky-500", "border-sky-400", "text-sky-400");
          t.classList.add("border-transparent");
        });
        this.classList.add(isDarkMode() ? "border-sky-400" : "border-sky-500");
        this.classList.add(isDarkMode() ? "text-sky-400" : "text-sky-500");
        this.classList.remove("border-transparent");
        const subTabContents = document.querySelectorAll("#subtab-single, #subtab-batch");
        subTabContents.forEach((content) => {
          content.classList.add(CSS_CLASSES.HIDDEN);
          content.classList.remove(CSS_CLASSES.BLOCK);
        });
        const subTabId = `subtab-${this.getAttribute("data-subtab")}`;
        const subTabContent = getElementById(subTabId);
        if (subTabContent) {
          subTabContent.classList.add(CSS_CLASSES.BLOCK);
          subTabContent.classList.remove(CSS_CLASSES.HIDDEN);
          if (subTabId === "subtab-batch") {
            initBatchGroupSelector();
          }
          if (subTabId === "subtab-single") {
            initAccountGroupSelector();
          }
        }
      });
    });
  }
  function initAccountGroupSelector() {
    const groupSelect = getElementById("tk-account-group");
    if (!groupSelect) return;
    groupSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = DEFAULT_CONFIG.defaultGroup;
    defaultOption.textContent = DEFAULT_CONFIG.defaultGroup;
    groupSelect.appendChild(defaultOption);
    const groups = getGroups();
    for (const groupName in groups) {
      if (groupName !== DEFAULT_CONFIG.defaultGroup) {
        const option = document.createElement("option");
        option.value = groupName;
        option.textContent = groupName;
        groupSelect.appendChild(option);
      }
    }
    const currentGroup = getCurrentGroup();
    if (groupSelect.querySelector(`option[value="${currentGroup}"]`)) {
      groupSelect.value = currentGroup;
    }
  }
  function initSwitchGroupSelector() {
    const groupSelect = getElementById("tk-switch-group-selector");
    if (!groupSelect) return;
    const currentValue = groupSelect.value;
    groupSelect.removeEventListener("change", handleSwitchGroupChange);
    groupSelect.innerHTML = "";
    const allGroupOption = document.createElement("option");
    allGroupOption.value = "";
    allGroupOption.textContent = "全部分组";
    groupSelect.appendChild(allGroupOption);
    const groups = getGroups();
    for (const groupName in groups) {
      const option = document.createElement("option");
      option.value = groupName;
      option.textContent = groupName;
      groupSelect.appendChild(option);
    }
    if (currentValue && groupSelect.querySelector(`option[value="${currentValue}"]`)) {
      groupSelect.value = currentValue;
    } else {
      const currentGroup = getCurrentGroup();
      if (groupSelect.querySelector(`option[value="${currentGroup}"]`)) {
        groupSelect.value = currentGroup;
      }
    }
    groupSelect.addEventListener("change", handleSwitchGroupChange);
    loadAccounts(groupSelect.value);
  }
  function handleSwitchGroupChange() {
    const groupSelect = getElementById("tk-switch-group-selector");
    if (!groupSelect) return;
    const selectedGroup = groupSelect.value;
    console.log("分组选择变更:", selectedGroup ? selectedGroup : "全部分组");
    if (selectedGroup) {
      setCurrentGroup(selectedGroup);
    }
    try {
      loadAccounts(selectedGroup);
      const accounts = getAccounts();
      const groups = getGroups();
      if (selectedGroup) {
        const groupAccounts = groups[selectedGroup] || [];
        console.log(`分组 "${selectedGroup}" 中有 ${groupAccounts.length} 个账号`);
      } else {
        console.log(`所有账号: ${Object.keys(accounts).length} 个`);
      }
    } catch (error) {
      console.error("加载账号列表出错:", error);
    }
  }
  function loadAccounts(selectedGroup = "") {
    const accountList = getElementById(DOM_IDS.ACCOUNT_LIST);
    if (!accountList) return;
    const accounts = getAccounts();
    console.log(`加载账号列表 - 选定分组:`, selectedGroup || "全部分组");
    console.log(`当前共有 ${Object.keys(accounts).length} 个账号`);
    let filteredAccountNames = Object.keys(accounts);
    if (selectedGroup) {
      const accountsInGroup = getAccountsInGroup(selectedGroup);
      console.log(`分组 "${selectedGroup}" 中有 ${accountsInGroup.length} 个账号`);
      filteredAccountNames = accountsInGroup.filter((name) => accounts[name]);
      console.log(`过滤后有效账号: ${filteredAccountNames.length} 个`);
    }
    accountList.innerHTML = "";
    if (filteredAccountNames.length === 0) {
      console.log("无账号显示空列表");
      _handleEmptyAccountsList(accountList);
      return;
    }
    console.log(`准备渲染 ${filteredAccountNames.length} 个账号`);
    _renderAccountsList(accountList, accounts, filteredAccountNames);
  }
  function updateAccountSelector(filteredAccountNames = null) {
    return;
  }
  function _handleEmptyAccountsList(container) {
    container.innerHTML = generateEmptyAccountsTemplate();
    const goAddBtn = getElementById(DOM_IDS.GO_ADD_ACCOUNT_BTN);
    if (goAddBtn) {
      goAddBtn.addEventListener("click", function() {
        const addTab = document.querySelector('[data-tab="add"]');
        if (addTab) {
          addTab.click();
        }
      });
    }
  }
  function _renderAccountsList(container, accounts, filteredAccountNames = null) {
    const accountNames = filteredAccountNames || Object.keys(accounts);
    for (const accountName of accountNames) {
      if (accounts[accountName]) {
        const accountItem = document.createElement("div");
        accountItem.className = "tk-account-item flex items-center justify-between p-3.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 mb-2.5 transition hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:-translate-y-0.5 hover:shadow-sm";
        let note = "";
        const accountData = accounts[accountName];
        if (typeof accountData === "object" && accountData.note) {
          note = accountData.note;
        }
        accountItem.innerHTML = generateAccountItemTemplate(accountName, note);
        container.appendChild(accountItem);
      }
    }
    _bindAccountItemEvents();
  }
  function _bindAccountItemEvents() {
    const accountItems = document.querySelectorAll(".tk-account-item");
    accountItems.forEach((item) => {
      item.addEventListener("click", function(e) {
        if (e.target.closest("[data-delete]")) {
          return;
        }
        const switchBtn = this.querySelector("[data-switch]");
        if (switchBtn) {
          const accountName = switchBtn.getAttribute("data-switch");
          switchAccount(accountName);
        }
      });
    });
    const switchButtons = document.querySelectorAll("[data-switch]");
    switchButtons.forEach((button) => {
      button.addEventListener("click", function(e) {
        e.stopPropagation();
        const accountName = this.getAttribute("data-switch");
        switchAccount(accountName);
      });
    });
    const deleteButtons = document.querySelectorAll("[data-delete]");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function(e) {
        e.stopPropagation();
        const accountName = this.getAttribute("data-delete");
        deleteAccount(accountName);
      });
    });
  }
  const panel = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    createPanel,
    initAccountGroupSelector,
    initSwitchGroupSelector,
    loadAccounts,
    updateAccountSelector
  }, Symbol.toStringTag, { value: "Module" }));
  function main() {
    console.log(`${APP_NAME} v${APP_VERSION} 已加载`);
    console.log("本插件统一使用GM_cookie API管理cookie，更加可靠地切换账号");
    _initDefaultCredentials();
    _initUserInterface();
    _registerMenuCommands();
  }
  function _initDefaultCredentials() {
    if (!getStorageValue(STORAGE_KEYS.USERNAME, null) || !getStorageValue(STORAGE_KEYS.PASSWORD, null)) {
      setStorageValue(STORAGE_KEYS.USERNAME, DEFAULT_CONFIG.defaultUsername);
      setStorageValue(STORAGE_KEYS.PASSWORD, DEFAULT_CONFIG.defaultPassword);
      console.log("已初始化默认凭据");
    }
  }
  function _initUserInterface() {
    createToggleButton();
    createToastContainer();
    document.addEventListener("DOMContentLoaded", function() {
    });
  }
  function createToggleButton() {
    if (getElementById(DOM_IDS.TOGGLE_BUTTON)) {
      return;
    }
    const toggleButton = document.createElement("button");
    toggleButton.className = "tk-side-btn";
    toggleButton.id = DOM_IDS.TOGGLE_BUTTON;
    toggleButton.title = APP_NAME;
    toggleButton.textContent = "切换账号";
    if (document.body) {
      document.body.appendChild(toggleButton);
      _addToggleButtonListeners(toggleButton);
    } else {
      const observer = new MutationObserver(function(mutations) {
        if (document.body) {
          document.body.appendChild(toggleButton);
          _addToggleButtonListeners(toggleButton);
          observer.disconnect();
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  }
  function _addToggleButtonListeners(toggleButton) {
    toggleButton.addEventListener("click", function() {
      const panel2 = getElementById(DOM_IDS.PANEL);
      if (panel2) {
        panel2.classList.toggle("hidden");
      } else {
        createPanel();
        getElementById(DOM_IDS.PANEL).classList.remove("hidden");
      }
    });
  }
  function _registerMenuCommands() {
    GM_registerMenuCommand("保存当前账号", saveCurrentAccount);
    GM_registerMenuCommand("打开账号切换器", function() {
      if (!getElementById(DOM_IDS.PANEL)) {
        createPanel();
      }
      getElementById(DOM_IDS.PANEL).classList.remove("hidden");
    });
  }
  main();

})();