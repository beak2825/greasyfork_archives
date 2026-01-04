// ==UserScript==
// @name         ChatGPT File-Batch Sender (v0.7, with Random Gap)
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  批量发送JSON消息，带可拖拽/缩放面板、自动休息和随机发送间隔
// @author       liuweiqing
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536583/ChatGPT%20File-Batch%20Sender%20%28v07%2C%20with%20Random%20Gap%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536583/ChatGPT%20File-Batch%20Sender%20%28v07%2C%20with%20Random%20Gap%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /* ---------- 工具 ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  async function waitFor(sel, t = 10000) {
    const start = performance.now();
    while (performance.now() - start < t) {
      const n = $(sel);
      if (n) return n;
      await delay(100);
    }
    throw `timeout: ${sel}`;
  }
  const untilEnabled = (btn) =>
    new Promise((res) => {
      if (!btn.disabled) return res();
      const mo = new MutationObserver(() => {
        if (!btn.disabled) {
          mo.disconnect();
          res();
        }
      });
      mo.observe(btn, { attributes: true, attributeFilter: ["disabled"] });
    });
  async function setComposer(text) {
    const p = await waitFor("div.ProseMirror[data-virtualkeyboard]");
    p.focus();
    document.execCommand("selectAll", false);
    document.execCommand("insertText", false, text);
    p.dispatchEvent(
      new InputEvent("input", { bubbles: true, inputType: "insertText" })
    );
  }

  /* ---------- 主题变化监听 ---------- */
  const onTheme = (cb) => {
    cb();
    new MutationObserver(cb).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  };

  /* ---------- 生成操作面板 ---------- */
  const panel = document.createElement("div");
  panel.id = "batchPanel";
  panel.innerHTML = `
    <style>
      #batchPanel{
        position:fixed;top:12px;right:12px;z-index:2147483647;
        width:240px;padding:0;font-family:Arial,sans-serif;
        background:var(--bg,#fff);color:var(--fg,#000);
        border:1px solid var(--bd,#0003);border-radius:8px;
        box-shadow:0 4px 14px #0004;resize:both;overflow:auto;
        transition:background .2s,color .2s;
      }
      #batchPanel.collapsed{width:46px;height:46px;padding:0;overflow:hidden}
      #batchHeader{
        cursor:move;user-select:none;height:36px;line-height:36px;
        padding:0 10px;font-weight:bold;display:flex;justify-content:space-between;align-items:center;
        border-bottom:1px solid var(--bd,#0003);background:var(--hdr,#f1f3f5);
      }
      #batchBody{padding:10px;display:flex;flex-direction:column;gap:6px}
      #batchPanel input[type="text"],
      #batchPanel input[type="number"]{width:100%;padding:4px;border:1px solid var(--bd,#0003);border-radius:4px}
      #batchBody div.flexRow{display:flex;gap:4px}
      #run{padding:6px;border:none;border-radius:4px;background:#0b5cff;color:#fff;cursor:pointer}
      #run:disabled{opacity:.5;cursor:not-allowed}
      .dark #batchPanel{--bg:#1f1f1f;--fg:#f8f8f8;--bd:#555;--hdr:#2a2a2a}
      #gap, #gapRand {width:58px}
    </style>
    <div id="batchHeader">
      <span>Batch&nbsp;Sender</span>
      <span id="toggle">▾</span>
    </div>
    <div id="batchBody">
      <input type="file" id="file">
      <span id="fname" style="font-size:12px;color:#888"></span>

      <label>Prompt 前缀</label>
      <input type="text" id="common">

      <label style="display:flex;align-items:center;gap:4px">
        <input type="checkbox" id="restSwitch"> 自动休息
      </label>
      <div class="flexRow" style="align-items:center">
        <input type="number" id="restCount" value="25"
               placeholder="条数"  title="连续发送多少条后休息"  style="width:60px">
        <span style="font-size:12px;">条</span>
        <input type="number" id="restHours" value="3"
               placeholder="小时" title="每次休息时长(小时，可填小数)"
               step="0.1" min="0" style="width:60px">
        <span style="font-size:12px;">小时</span>
      </div>

      <div class="flexRow" style="align-items:center">
        <input type="number" id="gap" placeholder="间隔(s)">
        <span style="font-size:12px;">±</span>
        <input type="number" id="gapRand" value="0" min="0" max="999" step="0.1">
        <span style="font-size:12px;">秒随机</span>
      </div>

      <button id="run">开始</button>
      <progress id="bar" value="0" max="1" style="width:100%"></progress>
    </div>`;
  document.body.appendChild(panel);

  const $header = $("#batchHeader");
  const $toggle = $("#toggle");

  /* ---------- 主题同步 ---------- */
  onTheme(() => {
    if (document.documentElement.classList.contains("dark"))
      panel.classList.add("dark");
    else panel.classList.remove("dark");
  });

  /* ---------- 折叠 / 展开 ---------- */
  let collapsed = localStorage.getItem("batchCollapsed") === "1";
  const applyCollapse = () => {
    panel.classList.toggle("collapsed", collapsed);
    $toggle.textContent = collapsed ? "▸" : "▾";
    localStorage.setItem("batchCollapsed", collapsed ? "1" : "0");
  };
  $toggle.onclick = (e) => {
    collapsed = !collapsed;
    applyCollapse();
    e.stopPropagation();
  };
  applyCollapse();

  /* ---------- 拖拽移动 ---------- */
  let drag = null;
  $header.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    drag = {
      x: e.clientX,
      y: e.clientY,
      left: panel.offsetLeft,
      top: panel.offsetTop,
    };
    e.preventDefault();
  });
  window.addEventListener("mousemove", (e) => {
    if (!drag) return;
    panel.style.left = drag.left + (e.clientX - drag.x) + "px";
    panel.style.top = drag.top + (e.clientY - drag.y) + "px";
  });
  window.addEventListener("mouseup", () => {
    drag = null;
  });

  /* ---------- DOM 引用 ---------- */
  const $file = $("#file");
  const $fname = $("#fname");
  const $common = $("#common");
  const $gap = $("#gap");
  const $gapRand = $("#gapRand");
  const $restSw = $("#restSwitch");
  const $restCt = $("#restCount");
  const $restHr = $("#restHours");
  const $run = $("#run");
  const $bar = $("#bar");

  /* ---------- 恢复设置 ---------- */
  [
    ["savedFileName", (v) => ($fname.textContent = v)],
    ["prompt", (v) => ($common.value = v)],
    ["delay", (v) => ($gap.value = v)],
    ["gapRand", (v) => ($gapRand.value = v)],
    ["restFlag", (v) => ($restSw.checked = v === "1")],
    ["restCount", (v) => ($restCt.value = v)],
    ["restHours", (v) => ($restHr.value = v)],
    ["panelLeft", (v) => (panel.style.left = v)],
    ["panelTop", (v) => (panel.style.top = v)],
    ["panelBottom", (v) => (panel.style.bottom = v)],
  ].forEach(([k, fn]) => {
    const v = localStorage.getItem(k);
    if (v) fn(v);
  });

  /* ---------- 保存位置变化 ---------- */
  new MutationObserver(() => {
    localStorage.setItem("panelLeft", panel.style.left || "");
    localStorage.setItem("panelTop", panel.style.top || "");
    localStorage.setItem("panelBottom", panel.style.bottom || "");
  }).observe(panel, { attributes: true, attributeFilter: ["style"] });

  /* ---------- 读取文件 ---------- */
  $file.onchange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = (ev) => {
      localStorage.setItem("savedFile", ev.target.result);
      localStorage.setItem("savedFileName", f.name);
      $fname.textContent = f.name;
    };
    rd.readAsText(f);
  };

  /* ---------- 主要发送逻辑 ---------- */
  $run.onclick = async () => {
    const raw = localStorage.getItem("savedFile");
    if (!raw) return alert("请先选择文件");
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return alert("JSON 解析失败");
    }
    if (!Array.isArray(data)) return alert("JSON 必须是数组");

    /* 保存参数 */
    localStorage.setItem("prompt", $common.value);
    localStorage.setItem("delay", $gap.value);
    localStorage.setItem("gapRand", $gapRand.value);
    localStorage.setItem("restFlag", $restSw.checked ? "1" : "0");
    localStorage.setItem("restCount", $restCt.value);
    localStorage.setItem("restHours", $restHr.value);

    /* 参数解析 */
    const prefix = $common.value || "";
    const gapMs = (+$gap.value || 100) * 1000;
    const gapRandMs = (+$gapRand.value || 0) * 1000;
    const restOn = $restSw.checked;
    const restAfter = Math.max(1, +$restCt.value || 25);
    const restMs = Math.max(0, +$restHr.value || 3) * 3600 * 1000;

    // 生成随机延迟：范围 [gapMs-gapRandMs, gapMs+gapRandMs]，最小为0
    function randomGap() {
      if (!gapRandMs) return gapMs;
      const min = Math.max(0, gapMs - gapRandMs);
      const max = gapMs + gapRandMs;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    $bar.max = data.length;
    $run.disabled = true;

    try {
      for (let i = 0; i < data.length; i++) {
        await setComposer(`${prefix}${data[i].title ?? data[i]}`);
        await delay(1000); // 额外 1 秒
        const btn = await waitFor('button[data-testid="send-button"]');
        await untilEnabled(btn);
        btn.click();
        $bar.value = i + 1;

        if (restOn && (i + 1) % restAfter === 0) await delay(restMs);
        else await delay(randomGap());
      }
      alert("全部发送完毕！");
    } catch (e) {
      console.error(e);
      alert(e.message || e);
    } finally {
      $run.disabled = false;
    }
  };

  /* ---------- 防止页面刷新 panel 被清理，自动重插入 ---------- */
  function reinsertPanel() {
    if (!document.body.contains(panel)) {
      document.body.appendChild(panel);
    }
  }
  new MutationObserver(reinsertPanel).observe(document.body, {
    childList: true,
    subtree: true,
  });
  reinsertPanel();
})();
