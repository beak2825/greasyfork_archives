// ==UserScript==
// @name         [Bangumi]BBCode链接上色工具
// @namespace    https://greasyfork.org/zh-CN/users/1386262-zintop
// @version      1.1.1
// @author       zintop
// @description  一键为 BBCode 链接添加颜色。
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547482/%5BBangumi%5DBBCode%E9%93%BE%E6%8E%A5%E4%B8%8A%E8%89%B2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/547482/%5BBangumi%5DBBCode%E9%93%BE%E6%8E%A5%E4%B8%8A%E8%89%B2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function $(s) { return document.querySelector(s); }

  // ====== 关灯模式适配 ======
  function applyTheme() {
    const theme = document.documentElement.getAttribute("data-theme");
    const bg = theme === "dark" ? "#444" : "#fff";
    const panel = $("#bbcode-panel");
    if (panel) panel.style.background = bg;
  }
  function observeThemeChange() {
    const observer = new MutationObserver(() => applyTheme());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  function createUI() {
    const panel = document.createElement("div");
    panel.id = "bbcode-panel";
    panel.style.cssText = `
      position: fixed; top:120px; left:320px; width:320px; max-height:80vh;
      overflow-y:auto; z-index:99999; border:1px solid #aaa;
      font-size:13px; font-family:sans-serif; border-radius:8px;
      box-shadow:0 2px 6px rgba(0,0,0,0.15); resize:both; overflow:hidden auto;
      opacity:1; display:none;
    `;

    panel.innerHTML = `
      <div id="bbcode-header" style="background:#666;color:#fff;padding:5px;cursor:move;">BBCode 链接上色工具</div>
      <div style="padding:8px;">
        <label>颜色: <input id="bbcode-color" placeholder="red 或 #ff0000" style="width:120px"></label>
        <br><br>
        <textarea id="bbcode-input" placeholder="粘贴带 BBCode 的文字..." style="width:100%;height:100px;"></textarea>
        <br>
        <button id="bbcode-run">上色</button>
        <button id="bbcode-copy">复制结果</button>
        <div id="bbcode-status" style="margin-top:5px;color:green;font-weight:bold;"></div>
        <textarea id="bbcode-output" readonly style="width:100%;height:100px;margin-top:5px;"></textarea>
      </div>
    `;
    document.body.appendChild(panel);

    applyTheme();
    observeThemeChange();

    // 拖动
    const header = $("#bbcode-header");
    let offsetX = 0, offsetY = 0, isDown = false;
    header.addEventListener("mousedown", e => {
      isDown = true;
      offsetX = e.clientX - panel.offsetLeft;
      offsetY = e.clientY - panel.offsetTop;
      e.preventDefault();
    });
    document.addEventListener("mouseup", () => { isDown = false; });
    document.addEventListener("mousemove", e => {
      if (!isDown) return;
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.top = `${e.clientY - offsetY}px`;
    });

    // 上色逻辑
    $("#bbcode-run").onclick = () => {
      const color = $("#bbcode-color").value.trim();
      const input = $("#bbcode-input").value;
      if (!color || !input) return;

      let count = 0;
      const output = input.replace(
        /\[url=(.+?)\](.+?)\[\/url\]/g,
        (match, url, text) => {
          count++;
          return `[url=${url}][color=${color}]${text}[/color][/url]`;
        }
      );

      $("#bbcode-output").value = output;
      $("#bbcode-status").innerText = `已为 ${count} 条链接上色`;
    };

    // 复制按钮
    $("#bbcode-copy").onclick = async () => {
      const output = $("#bbcode-output").value;
      if (!output) return;
      try {
        await navigator.clipboard.writeText(output);
        $("#bbcode-status").innerText = "✅ 已复制到剪贴板";
      } catch (e) {
        console.error("复制失败", e);
        $("#bbcode-status").innerText = "❌ 复制失败，请手动复制";
      }
    };
  }

  function init() {
    createUI();

    // dock栏按钮
    const dock = document.querySelector("#dock ul>li.first");
    if (dock) {
      const li = document.createElement("li");
      li.innerHTML = `<a href="javascript:void(0);" id="toggleBBCodeBtn">上色🎨</a><p></p>`;
      dock.after(li);
      $("#toggleBBCodeBtn").addEventListener("click", () => {
        const panel = $("#bbcode-panel");
        panel.style.display = panel.style.display === "none" ? "block" : "none";
      });
    }
  }

  window.addEventListener("load", init);
})();
