// ==UserScript==
// @name         Claude 背景色控制器
// @author       夏天的清晨
// @namespace    https://claude.ai
// @version      1.0.1
// @description  调节 Claude 背景色
// @match        https://claude.ai/*
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546354/Claude%20%E8%83%8C%E6%99%AF%E8%89%B2%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/546354/Claude%20%E8%83%8C%E6%99%AF%E8%89%B2%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DEF = {
    enabled: GM_getValue("enabled", true),
    bodyColor: GM_getValue("bodyColor", "#1e1e1e"),
    bodyAlpha: GM_getValue("bodyAlpha", 1),
    divColor: GM_getValue("divColor", "#ffffff"),
    divAlpha: GM_getValue("divAlpha", 1),
    hotkey: GM_getValue("hotkey", "Alt+B"),
  };

  function hexToRgba(hex, alpha) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
    if (!m) return `rgba(30,30,30,${alpha})`;
    const r = parseInt(m[1], 16);
    const g = parseInt(m[2], 16);
    const b = parseInt(m[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${Math.min(Math.max(alpha,0),1)})`;
  }

  let styleEl;
  function applyStyle() {
    if (styleEl) styleEl.remove();
    if (!DEF.enabled) return;

    styleEl = document.createElement("style");
    styleEl.id = "tm-body-bg-style";
    styleEl.textContent = `
      html, body {
        background: ${hexToRgba(DEF.bodyColor, DEF.bodyAlpha)} !important;
        background-color: ${hexToRgba(DEF.bodyColor, DEF.bodyAlpha)} !important;
      }

      /* 按钮保持白色 */
      div.flex.items-center.justify-between button[data-testid="chat-menu-trigger"] {
        background: #fff !important;
        background-color: #fff !important;
      }

      /* 特定 div 背景动态控制 */
      div.flex.w-full.items-center.justify-between.gap-4.pl-11.lg\\:pl-8.gap-6.pr-2.pr-3 {
        background: ${hexToRgba(DEF.divColor, DEF.divAlpha)} !important;
        background-color: ${hexToRgba(DEF.divColor, DEF.divAlpha)} !important;
      }
    `;
    (document.head || document.documentElement).appendChild(styleEl);
  }

  applyStyle();

  // === 菜单注册，只注册一次，不重复 ===
  GM_registerMenuCommand("切换背景控制启用/停用", () => {
    DEF.enabled = !DEF.enabled;
    GM_setValue("enabled", DEF.enabled);
    applyStyle();
    alert(`背景控制：${DEF.enabled ? "已启用" : "已停用"}`);
  });

  GM_registerMenuCommand("设置 Body 颜色", () => {
    const c = prompt(`输入 Body 颜色 HEX（当前: ${DEF.bodyColor}）`, DEF.bodyColor);
    if (!c) return;
    DEF.bodyColor = c;
    GM_setValue("bodyColor", DEF.bodyColor);
    applyStyle();
  });

  GM_registerMenuCommand("设置 Body 透明度", () => {
    const a = parseFloat(prompt(`输入 Body 透明度 0~1（当前: ${DEF.bodyAlpha}）`, DEF.bodyAlpha));
    if (Number.isNaN(a)) return;
    DEF.bodyAlpha = Math.min(Math.max(a,0),1);
    GM_setValue("bodyAlpha", DEF.bodyAlpha);
    applyStyle();
  });

  GM_registerMenuCommand("设置首部颜色", () => {
    const c = prompt(`输入特定 div 颜色 HEX（当前: ${DEF.divColor}）`, DEF.divColor);
    if (!c) return;
    DEF.divColor = c;
    GM_setValue("divColor", DEF.divColor);
    applyStyle();
  });

  GM_registerMenuCommand("设置首部透明度", () => {
    const a = parseFloat(prompt(`输入特定 div 透明度 0~1（当前: ${DEF.divAlpha}）`, DEF.divAlpha));
    if (Number.isNaN(a)) return;
    DEF.divAlpha = Math.min(Math.max(a,0),1);
    GM_setValue("divAlpha", DEF.divAlpha);
    applyStyle();
  });

  GM_registerMenuCommand("关于/帮助", () => {
    alert([
      "Claude 背景控制器",
      "— Body 背景可调颜色与透明度",
      "— 特定 div 背景可调颜色与透明度",
      "— Alt+B 切换启用/停用",
      "— 按钮固定白色"
    ].join("\n"));
  });

  // === 快捷键监听 ===
  function matchHotkey(evt, hotkeyStr) {
    const parts = hotkeyStr.toLowerCase().split("+").map(s => s.trim());
    const need = {
      altKey: parts.includes("alt"),
      ctrlKey: parts.includes("ctrl") || parts.includes("control"),
      shiftKey: parts.includes("shift"),
      metaKey: parts.includes("meta") || parts.includes("cmd") || parts.includes("command"),
      key: parts[parts.length-1]
    };
    const keyOk = evt.key && evt.key.toLowerCase() === need.key;
    return (
      keyOk &&
      (!!evt.altKey === need.altKey) &&
      (!!evt.ctrlKey === need.ctrlKey) &&
      (!!evt.shiftKey === need.shiftKey) &&
      (!!evt.metaKey === need.metaKey)
    );
  }

  window.addEventListener("keydown", e => {
    const t = e.target;
    if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName))) return;
    if (matchHotkey(e, DEF.hotkey)) {
      e.preventDefault();
      DEF.enabled = !DEF.enabled;
      GM_setValue("enabled", DEF.enabled);
      applyStyle();
    }
  }, true);

  // === DOM 观察 ===
  const mo = new MutationObserver(() => {
    if (DEF.enabled && !document.getElementById("tm-body-bg-style")) {
      applyStyle();
    }
  });
  mo.observe(document.documentElement, { childList:true, subtree:true });
})();
