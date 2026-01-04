// ==UserScript==
// @name         Power BI 表格抓取助手
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  选择表格 → 懒加载监听 → 智能滚动(含回退) → 去重导出CSV；支持 iframe / Shadow DOM / Load more
// @author       Spoony http://www.1ucn.com http://www.proxychk.com http://wwww.emailtry.com
// @match        https://app.powerbi.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @all-frames   true
// @downloadURL https://update.greasyfork.org/scripts/545304/Power%20BI%20%E8%A1%A8%E6%A0%BC%E6%8A%93%E5%8F%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/545304/Power%20BI%20%E8%A1%A8%E6%A0%BC%E6%8A%93%E5%8F%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** ---- 全局状态 ---- ***/
  const PANEL_ID = "powerbi-control-panel";
  const SEP = "\u241F";                // 行内容去重分隔符（极低碰撞）
  let running = false;
  let picking = false;
  let dataMap = new Map();
  let headers = [];
  let targetGrid = null;
  let scrollContainer = null;
  let rowObserver = null;
  let maxRowIndexSeen = 0;             // 记录 aria-rowindex 最大值
  let bottomPasses = 0;                // 到底来回的遍数

  /*** ---- UI ---- ***/
  function createControlPanel() {
    if (document.getElementById(PANEL_ID)) return;

    const panel = document.createElement("div");
    panel.id = PANEL_ID;
    Object.assign(panel.style, {
      position: "fixed", top: "20px", right: "20px",
      background: "#1e1e1e", color: "#fff", padding: "10px 12px",
      borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,.35)",
      zIndex: 999999, fontFamily: "ui-monospace, Consolas, monospace", fontSize: "12px", lineHeight: "1.45"
    });
    panel.innerHTML = `
      <div style="font-weight:700;margin-bottom:6px;">Power BI 抓取助手</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        <button id="pb-pick"  title="点击后，在页面上点击一个表格来选中">🧭 选择表格</button>
        <button id="pb-start">🟢 开始</button>
        <button id="pb-stop">🛑 停止</button>
        <button id="pb-reset">🔁 重置</button>
      </div>
      <div id="pb-status" style="margin-top:8px;">
        状态: 等待开始<br/>
        目标表格: 未选择<br/>
        抓取行: 0
      </div>
    `;
    panel.querySelectorAll("button").forEach(b=>{
      Object.assign(b.style,{padding:"4px 8px",borderRadius:"6px",border:"1px solid #444",background:"#2a2a2a",cursor:"pointer"});
      b.onmouseenter=()=>b.style.background="#333";
      b.onmouseleave=()=>b.style.background="#2a2a2a";
    });
    document.body.appendChild(panel);
  }
  const $ = id => document.getElementById(id);
  const statusEl = () => $("pb-status");
  const logStatus = (lines)=>{ if(statusEl()) statusEl().innerHTML=(Array.isArray(lines)?lines.join("<br/>"):String(lines)).replace(/\n/g,"<br/>"); };

  /*** ---- 工具函数 ---- ***/
  function flash(el) {
    if (!el) return;
    const prev = el.style.outline;
    el.style.outline = "2px solid #6cf";
    setTimeout(()=>{ el.style.outline = prev || ""; }, 900);
  }

  function isScrollable(el) {
    const cs = getComputedStyle(el);
    const overY = cs.overflowY;
    return ((overY === 'auto' || overY === 'scroll') && el.scrollHeight > el.clientHeight + 2) ||
           (el.scrollHeight > el.clientHeight + 20); // 有些组件 overflow:visible 仍可滚
  }
  function bestByScrollRoom(arr){
    return arr.sort((a,b)=>(b.scrollHeight-b.clientHeight)-(a.scrollHeight-a.clientHeight))[0];
  }
  function findScrollableElement(grid) {
    if (!grid) return null;
    // 1) grid 内部常见滚动容器
    const knownSel = '.scrollHost, .mid-viewport, .virtualizedContainer, [data-automationid="ScrollablePane"], [class*="scroll"], [class*="Scroll"], [class*="viewport"]';
    let cand = [...grid.querySelectorAll(knownSel)].filter(isScrollable);
    if (isScrollable(grid)) cand.push(grid);
    if (!cand.length) cand = [...grid.querySelectorAll('div')].filter(isScrollable);
    if (!cand.length) {
      // 2) 祖先链兜底
      let cur = grid, best = null;
      while (cur && cur !== document.documentElement) {
        if (isScrollable(cur)) best = best ? bestByScrollRoom([best, cur]) : cur;
        cur = cur.parentElement;
      }
      return best || grid;
    }
    return bestByScrollRoom(cand);
  }

  function getHeaders() {
    const list = targetGrid ? targetGrid.querySelectorAll('[role="columnheader"]') : [];
    const hs = [...list].map(th => th.textContent.trim()).filter(Boolean);
    return hs.length ? hs : ["列1","列2","列3"];
  }
  function getTitleForGrid() {
    if (!targetGrid) return null;
    const label = targetGrid.getAttribute('aria-label');
    if (label && label.trim()) return label.trim();
    let cur = targetGrid.parentElement;
    while (cur) {
      const t = cur.getAttribute && (cur.getAttribute('aria-label') || cur.getAttribute('title'));
      if (t && t.trim()) return t.trim();
      cur = cur.parentElement;
    }
    return null;
  }
  function getRowIndex(row){
    const v = row.getAttribute('aria-rowindex');
    const n = v ? parseInt(v, 10) : NaN;
    return Number.isFinite(n) ? n : 0;
  }
  function getRowCountFromAria(){
    const v = targetGrid ? targetGrid.getAttribute('aria-rowcount') : null;
    const n = v ? parseInt(v,10) : NaN;
    return Number.isFinite(n) ? n : null;
  }

  /*** ---- 选择表格（支持 iframe / Shadow DOM / SVG / 避开面板） ---- ***/
  function findGridFromPoint(x, y) {
    const els = document.elementsFromPoint(x, y) || [];
    for (const el of els) {
      let cur = el;
      // 支持 Shadow DOM：向上穿透 host
      while (cur && cur !== document.documentElement) {
        if (cur.getAttribute && cur.getAttribute('role') === 'grid') return cur;
        const root = cur.getRootNode && cur.getRootNode();
        cur = cur.parentElement || (root && root.host) || null;
      }
    }
    // 兜底：命中矩形
    const grids = document.querySelectorAll('[role="grid"]');
    for (const g of grids) {
      const r = g.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return g;
    }
    return null;
  }

  function enablePickMode() {
    if (picking) return;
    picking = true;
    document.body.style.cursor = "crosshair";
    const panel = document.getElementById(PANEL_ID);

    const onClick = (e) => {
      // 忽略点到面板自身
      if (panel && panel.contains(e.target)) return;
      e.preventDefault(); e.stopPropagation();

      // 优先 composedPath
      let grid = null;
      if (e.composedPath) {
        const path = e.composedPath();
        for (const node of path) {
          if (node && node.getAttribute && node.getAttribute('role') === 'grid') { grid = node; break; }
          if (!grid && node && node.closest && node.closest('[role="grid"]')) { grid = node.closest('[role="grid"]'); break; }
        }
      }
      // 回退坐标命中
      if (!grid) grid = findGridFromPoint(e.clientX, e.clientY);

      if (grid) {
        targetGrid = grid;
        scrollContainer = findScrollableElement(targetGrid);
        picking = false; document.body.style.cursor = "default";
        document.removeEventListener('click', onClick, true);
        document.removeEventListener('keydown', onEsc, true);
        flash(scrollContainer || targetGrid);
        logStatus([`状态: 已选中表格`, `目标表格: ${getTitleForGrid() || '未命名表格'}`, `抓取行: ${dataMap.size}`]);
      } else {
        logStatus([`状态: 选择模式：未识别到表格，请再点击一次（尽量点单元格文字）`, `目标表格: 未选择`, `抓取行: ${dataMap.size}`]);
      }
    };
    const onEsc = (e) => {
      if (e.key !== 'Escape') return;
      picking = false; document.body.style.cursor = "default";
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('keydown', onEsc, true);
      logStatus([`状态: 已退出选择模式`, `目标表格: ${getTitleForGrid() || '未选择'}`, `抓取行: ${dataMap.size}`]);
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onEsc, true);
    logStatus([`状态: 选择模式：请点击一个表格（或其中任意单元格）`, `目标表格: 未选择`, `抓取行: ${dataMap.size}`]);
  }

  /*** ---- 采集 & 观察 ---- ***/
  function installRowObserver() {
    if (!targetGrid) return;
    uninstallRowObserver();
    rowObserver = new MutationObserver(() => {
      captureVisibleRows();
    });
    rowObserver.observe(targetGrid, { childList: true, characterData: true, subtree: true });
  }
  function uninstallRowObserver(){
    if (rowObserver) { rowObserver.disconnect(); rowObserver = null; }
  }

  function captureVisibleRows() {
    if (!targetGrid) return 0;
    let added = 0;
    const rows = targetGrid.querySelectorAll('[role="row"]');
    for (let i = 1; i < rows.length; i++) { // 跳过表头
      const r = rows[i];
      const idx = getRowIndex(r);
      const cells = r.querySelectorAll('[role="gridcell"]');
      const row = [...cells].map(c => c.textContent.trim());
      if (!row.length) continue;

      if (idx > maxRowIndexSeen) maxRowIndexSeen = idx;
      const key = (idx ? `[${idx}]` : '') + row.join(SEP);  // 行号+内容强去重
      if (!dataMap.has(key)) { dataMap.set(key, row); added++; }
    }
    const totalAria = getRowCountFromAria();
    logStatus([
      `状态: 抓取中...`,
      `目标表格: ${getTitleForGrid() || '未命名表格'}`,
      `已抓取去重行: ${dataMap.size}${totalAria?` / 目标(aria): ${totalAria}`:''}`,
      `最高行号: ${maxRowIndexSeen}`
    ]);
    return added;
  }

  function waitForNewRows(prevSize, prevMaxIdx, timeout=1800) {
    return new Promise(resolve=>{
      const start = performance.now();
      function tick(){
        const now = performance.now();
        if (dataMap.size > prevSize || maxRowIndexSeen > prevMaxIdx) return resolve(true);
        if (now - start >= timeout) return resolve(false);
        requestAnimationFrame(tick);
      }
      tick();
    });
  }

  function tryClickLoadMore() {
    if (!scrollContainer) return false;
    const texts = ['Load more','Show more','More','加载更多','显示更多','更多'];
    const btns = scrollContainer.querySelectorAll('button, [role="button"], a');
    for (const b of btns) {
      const t = (b.textContent || '').trim();
      if (texts.some(s => t.toLowerCase().includes(s.toLowerCase()))) {
        b.click();
        return true;
      }
    }
    return false;
  }

  /*** ---- 导出 CSV ---- ***/
  function exportCSV() {
    const hdrs = headers.length ? headers :
      (dataMap.size ? Array.from({length: [...dataMap.values()][0].length}, (_,i)=>`列${i+1}`) : []);
    const lines = [hdrs, ...[...dataMap.values()]].map(row =>
      row.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')
    );
    const csv = '\uFEFF' + lines.join('\n');
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const now = new Date();
    const ts = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
    const title = (getTitleForGrid() || "powerbi_table").replace(/[\\/:*?"<>|]+/g, '_').slice(0, 60);
    a.href = url; a.download = `${title}_${ts}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  /*** ---- 核心滚动（含回退/轻抖/Load more） ---- ***/
  async function startScroll() {
    if (!targetGrid) { alert("请先点击“🧭 选择表格”，在页面上点一个表格后再开始。"); return; }

    headers = getHeaders();
    scrollContainer = findScrollableElement(targetGrid);
    if (!scrollContainer) { alert("未找到滚动容器，请重新选择表格重试。"); return; }
    flash(scrollContainer);

    installRowObserver();

    if (scrollContainer.focus) try { scrollContainer.focus({ preventScroll: true }); } catch(e){}

    running = true;
    bottomPasses = 0;
    const delay = ms => new Promise(r => setTimeout(r, ms));

    // 回顶部
    scrollContainer.scrollTop = 0;
    await delay(200);
    captureVisibleRows();

    const step = Math.max(80, Math.floor(scrollContainer.clientHeight * 0.7));
    let noGrowth = 0, MAX_NOGROWTH = 6;

    while (running) {
      const beforeSize = dataMap.size;
      const beforeIdx  = maxRowIndexSeen;
      const beforeTop  = scrollContainer.scrollTop;

      // 直接滚动一段
      const targetTop = Math.min(beforeTop + step, scrollContainer.scrollHeight);
      scrollContainer.scrollTop = targetTop;
      scrollContainer.dispatchEvent(new Event('scroll', { bubbles: true }));

      // 等待新行渲染（虚拟滚动会复用 DOM，必须等）
      let gotNew = await waitForNewRows(beforeSize, beforeIdx, 1800);

      // 没新行 → 回退方案：滚轮 + PageDown + 轻抖
      if (!gotNew) {
        for (let k=0; k<3 && running; k++){
          const ev = new WheelEvent('wheel', { deltaY: step/3, bubbles: true, cancelable: true });
          scrollContainer.dispatchEvent(ev);
          await delay(80);
          if (await waitForNewRows(beforeSize, beforeIdx, 600)) { gotNew=true; break; }
        }
      }
      if (!gotNew) {
        scrollContainer.dispatchEvent(new KeyboardEvent('keydown', { key:'PageDown', keyCode:34, which:34, bubbles:true }));
        await delay(120);
        gotNew = await waitForNewRows(beforeSize, beforeIdx, 600);
      }
      if (!gotNew) {
        tryClickLoadMore();
        await delay(500);
        gotNew = await waitForNewRows(beforeSize, beforeIdx, 1200);
      }

      // 增长统计
      if (dataMap.size === beforeSize && maxRowIndexSeen === beforeIdx) noGrowth++; else noGrowth = 0;

      const atBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 2;
      if (atBottom) {
        bottomPasses++;
        // 底部轻抖促进下一批加载
        for (let i=0;i<3 && running;i++){
          scrollContainer.scrollTop = Math.max(0, scrollContainer.scrollTop - Math.floor(step/3));
          await delay(120);
          scrollContainer.scrollTop = Math.min(scrollContainer.scrollHeight, scrollContainer.scrollTop + Math.floor(step/3));
          await delay(160);
          if (await waitForNewRows(dataMap.size, maxRowIndexSeen, 800)) { noGrowth = 0; break; }
        }
      }

      const totalAria = getRowCountFromAria();
      if ((totalAria && dataMap.size >= totalAria) ||            // 满额
          (atBottom && bottomPasses >= 2 && noGrowth >= 3) ||    // 底部往返≥2且无增长
          (noGrowth >= MAX_NOGROWTH)) {                          // 多轮无增长
        break;
      }

      await delay(100);
    }

    // 收尾
    captureVisibleRows();
    const totalAria = getRowCountFromAria();
    logStatus([`状态: 完成`, `目标表格: ${getTitleForGrid() || '未命名表格'}`, `总去重行: ${dataMap.size}${totalAria?` / 目标(aria): ${totalAria}`:''}`]);
    if (dataMap.size > 0) exportCSV();
    running = false;
    uninstallRowObserver();
  }

  function stopScroll() {
    running = false;
    logStatus([`状态: 已手动停止`, `目标表格: ${getTitleForGrid() || '未命名表格'}`, `已抓取行: ${dataMap.size}`]);
    uninstallRowObserver();
  }

  function resetAll() {
    running = false;
    dataMap.clear();
    headers = [];
    targetGrid = null;
    scrollContainer = null;
    maxRowIndexSeen = 0;
    bottomPasses = 0;
    uninstallRowObserver();
    logStatus([`状态: 数据已重置`, `目标表格: 未选择`, `抓取行: 0`]);
  }

  /*** ---- 入口 ---- ***/
  function bindButtons() {
    $('pb-pick').onclick  = () => { if (!running) enablePickMode(); };
    $('pb-start').onclick = () => { if (!running) { logStatus("状态: 开始抓取..."); startScroll(); } };
    $('pb-stop').onclick  = () => stopScroll();
    $('pb-reset').onclick = () => resetAll();
  }

  // 仅在真正含有 grid 的文档中挂面板（避免顶层/无表格页误注入）
  const readyTimer = setInterval(() => {
    const anyGrid = document.querySelector('[role="grid"]');
    if (anyGrid) {
      clearInterval(readyTimer);
      createControlPanel();
      bindButtons();
      console.log("✅ Power BI 抓取助手(完整增强版) 已就绪");
    }
  }, 800);

})();
