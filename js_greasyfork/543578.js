// ==UserScript==
// @name         掘金签到辅助提醒助手
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  未签到时仅打开签到页并保持单例；在签到页用户点击后更新签到日期；当天已签则不做任何事。
// @author       石小石Orz
// @match        *://*/*
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_saveTab
// @grant        GM_addElement
// @grant        GM_openInTab
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/543578/%E6%8E%98%E9%87%91%E7%AD%BE%E5%88%B0%E8%BE%85%E5%8A%A9%E6%8F%90%E9%86%92%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/543578/%E6%8E%98%E9%87%91%E7%AD%BE%E5%88%B0%E8%BE%85%E5%8A%A9%E6%8F%90%E9%86%92%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  const SIGN_URL = "https://juejin.cn/user/center/signin";
  const today = () => new Date().toLocaleDateString();
  const storedDate = GM_getValue("signTime", ""); // 上次签到日（本地格式字符串）

  // —— 已签到：直接退出 —— //
  if (storedDate === today()) return;

  // UI 提示
  function toast(text = "你今天还未签到", duration = 3200) {
    const el = GM_addElement(document.body, "div", {
      textContent: text,
      style: `
        position: fixed; top: 20px; left: 50%;
        transform: translateX(-50%);
        background: #fff7e6; color: #d46b08;
        padding: 10px 14px; font-size: 14px; border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,.12); z-index: 99999;
        opacity: 0; transition: opacity .25s ease, transform .25s ease;
      `,
    });
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateX(-50%) translateY(8px)";
    });
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateX(-50%) translateY(0)";
      setTimeout(() => el.remove(), 250);
    }, duration);
  }

  // 获取当前是否在签到页
  const onSignPage = location.href.startsWith(SIGN_URL);

  // —— 在签到页内的逻辑 —— //
  if (onSignPage) {
    // 将本标签页标记为“激活的签到页”（单例）
    const selfTab = await GM.getTab();
    selfTab.isSignPage = true;
    await GM.saveTab(selfTab);

    // 监听“签到”按钮点击：一旦点击，就认为用户执行了签到操作，更新日期
    const bindWatcher = () => {
      const btn = document.querySelector(".code-calender button.btn");
      if (!btn) return false;

      const onClick = () => {
        // 用户主动点击签到：记录今天为已签到
        GM_setValue("signTime", today());
        toast("签到已记录，今天不再提示");
      };
      btn.addEventListener("click", onClick, { once: true });
      return true;
    };

    // 挂载监听；若按钮稍后才渲染，使用 MutationObserver 兜底
    if (!bindWatcher()) {
      const mo = new MutationObserver(() => {
        if (bindWatcher()) mo.disconnect();
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    }
    return; // 签到页不再执行下面逻辑
  }

  // —— 非签到页的逻辑（未签到） —— //
  const [tab, tabs] = await Promise.all([GM.getTab(), GM.getTabs()]);
  const allTabs = Object.values(tabs || {});
  const signTab = allTabs.find((t) => t && t.isSignPage);

  if (signTab) {
    // 签到页已存在：不重复打开，但每次新页面提醒未签到
    toast("掘金还没签到，快去签到把~");
  } else {
    // 签到页不存在：自动打开，并将其视为激活的签到页（单例）
    tab.isCoordinator = true; // 可选：标记协调者
    await GM.saveTab(tab);
    GM_openInTab(SIGN_URL, { active: true, insert: true, setParent: true });
    toast("已为你打开掘金签到页");
  }
})();
