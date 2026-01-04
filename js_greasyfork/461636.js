// ==UserScript==
// @name         Manhuagui 阅读增强 · 全量加载/沉浸式双页排版/自动跨页显示
// @namespace    http://tampermonkey.net/
// @version      4.7.0
// @description  漫画柜双页浏览，全屏显示，从右到左显示。横图跨页；点击半屏翻页；记忆进度；
// @author       akira0245
// @match        https://www.manhuagui.com/comic/*/*.html
// @match        https://tw.manhuagui.com/comic/*/*.html
// @match        https://cn.manhuagui.com/comic/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manhuagui.com
// @run-at       document-idle
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/461636/Manhuagui%20%E9%98%85%E8%AF%BB%E5%A2%9E%E5%BC%BA%20%C2%B7%20%E5%85%A8%E9%87%8F%E5%8A%A0%E8%BD%BD%E6%B2%89%E6%B5%B8%E5%BC%8F%E5%8F%8C%E9%A1%B5%E6%8E%92%E7%89%88%E8%87%AA%E5%8A%A8%E8%B7%A8%E9%A1%B5%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/461636/Manhuagui%20%E9%98%85%E8%AF%BB%E5%A2%9E%E5%BC%BA%20%C2%B7%20%E5%85%A8%E9%87%8F%E5%8A%A0%E8%BD%BD%E6%B2%89%E6%B5%B8%E5%BC%8F%E5%8F%8C%E9%A1%B5%E6%8E%92%E7%89%88%E8%87%AA%E5%8A%A8%E8%B7%A8%E9%A1%B5%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===================== 开发者常量（仅此处修改） =====================
  const CONCURRENCY = 3;        // 并发上限
  const TIMEOUT_SEC = 15;       // 单张图片超时（秒）

  // 默认阅读外观/行为（可在设置中修改并持久化）
  const DEFAULTS = {
    // 交互
    clickNav: 'lr',             // 点击翻页：off / lr(左右半屏) / ud(上下半屏)
    autoHideToolbar: false,     // 自动隐藏菜单（右上角唤醒/短暂移动显示）
    snapWheel: false,           // 一屏滚动：滚轮一次跨页
    snapSmooth: true,           // 一屏滚动时平滑滚动
    showSpreadProgress: true,   // 底部跨页进度
    // 布局
    crossAspect: 1.0,           // 跨页判定阈值：w/h >= 阈值 => 跨页（默认 1.0）
    containerMaxW: 2200,        // 阅读容器最大宽（px）
    pageGapH: 16,               // 双页左右间距（px）
    spreadGapV: 16,             // 行间上下间距（px）
    pageHeight: '100vh',        // 单页高度（支持 calc）
    // 外观
    bodyBg: '#0a0a0a',          // 页面背景
    galleryBg: '#0d0d0d',       // 阅读区背景
    showPN: true,               // 显示页码
    shadow: false,              // 图片阴影
    // 视图模式
    double: true,               // 双页模式
    rtl: true,                  // 右到左
    firstSingle: true           // 首页单页
  };

  const LS_CFG = 'tmkReaderCfg.v43';
  const LS_POS_PREFIX = 'tmkPos:'; // 记忆阅读位置 key 前缀

  // ===================== 工具/检测 =====================
  const pageSelect = document.querySelector('#pageSelect');
  if (!pageSelect) return;

  const firstImg = document.querySelector('#mangaBox img.mangaFile, #mangaFile, #mangaMoreBox img[data-tag="mangaFile"]');
  if (!firstImg) return;
  const firstURL = new URL(firstImg.src, location.href);
  const fallbackOrigin = firstURL.origin;
  const fallbackPath = firstURL.pathname.replace(/\/[^/]+$/, '/');

  function waitFor(cond, timeout = 8000, interval = 60) {
    return new Promise((resolve) => {
      const t0 = Date.now();
      const timer = setInterval(() => {
        if (cond()) { clearInterval(timer); resolve(true); }
        else if (Date.now() - t0 > timeout) { clearInterval(timer); resolve(false); }
      }, interval);
    });
  }
  function getTotalPages() {
    const opts = Array.from(pageSelect.options);
    return opts.length ? parseInt(opts[opts.length - 1].value, 10) : 0;
  }
  function loadCfg() {
    try { const raw = localStorage.getItem(LS_CFG); return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS }; }
    catch { return { ...DEFAULTS }; }
  }
  function saveCfg(cfg) { localStorage.setItem(LS_CFG, JSON.stringify(cfg)); }

  function chapterKey() { return LS_POS_PREFIX + location.pathname; }
  function savePos(pageIdx) { try { localStorage.setItem(chapterKey(), String(pageIdx)); } catch {} }
  function loadPos() {
    try { const n = parseInt(localStorage.getItem(chapterKey()) || '', 10); return Number.isFinite(n) ? n : null; }
    catch { return null; }
  }

  // ===================== SMH/pVars 读取真实URL =====================
  function tryExtractConfFromPVars() {
    const pv = window.pVars;
    if (!pv || !pv.manga) return null;
    const m = pv.manga;
    const path = m.path || m.PATH || m.p || null;
    const sl = m.sl || m.SL || m.sign || null;
    let files = m.files || m.images || m.fs || null;

    const normalizeFiles = (val) => {
      if (!val) return null;
      if (Array.isArray(val)) return val.slice();
      if (typeof val === 'string') {
        try { const arr = JSON.parse(val); if (Array.isArray(arr)) return arr; } catch {}
        let dec = null;
        if (window.LZString?.decompressFromBase64) { try { dec = LZString.decompressFromBase64(val); } catch {} }
        if (!dec && window.M?.W?.Z) { try { dec = window.M.W.Z(val); } catch {} }
        if (dec && typeof dec === 'string') {
          try { const arr = JSON.parse(dec); if (Array.isArray(arr)) return arr; } catch {}
          let arr = dec.split('|'); if (arr.length <= 1) arr = dec.split(',');
          arr = arr.map(s => s.trim()).filter(Boolean);
          if (arr.length) return arr;
        }
      }
      return null;
    };
    const list = normalizeFiles(files);
    return { path: path || null, sl: sl || null, files: list };
  }

  async function collectUrlsByGoPage(total) {
    const urls = new Array(total + 1);
    const hasSMH = !!(window.SMH && window.SMH.utils && typeof window.SMH.utils.goPage === 'function');
    if (!hasSMH) return null;

    const conf = tryExtractConfFromPVars() || {};
    const origin = fallbackOrigin;
    const path = conf.path || fallbackPath;
    const sl = conf.sl || {};

    const waitCurFileChange = (prev, timeout = 1500) => new Promise((resolve) => {
      const t0 = Date.now();
      const timer = setInterval(() => {
        if (window.pVars?.curFile && window.pVars.curFile !== prev) { clearInterval(timer); resolve(true); }
        else if (Date.now() - t0 > timeout) { clearInterval(timer); resolve(false); }
      }, 30);
    });
    const readCurrentImgSrc = () => {
      const cur = document.querySelector('#mangaBox img.mangaFile, #mangaFile');
      if (cur?.src) return cur.src;
      const more = document.querySelectorAll('#mangaMoreBox img[data-tag="mangaFile"]');
      if (more && more.length) return more[more.length - 1].src;
      return null;
    };

    ['#mangaBox', '#mangaMoreBox', '.pager', '.main-btn', '#imgLoading'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.style.display = 'none';
    });

    for (let i = 1; i <= total; i++) {
      const prev = window.pVars?.curFile || '';
      try { window.SMH.utils.goPage(i); }
      catch {
        pageSelect.value = String(i);
        pageSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      await waitCurFileChange(prev, 1500);

      const curFile = window.pVars?.curFile;
      if (curFile && (sl.e || sl.m)) {
        const q = new URLSearchParams(); if (sl.e) q.set('e', sl.e); if (sl.m) q.set('m', sl.m);
        urls[i] = `${origin}${path}${curFile}?${q.toString()}`;
      } else {
        urls[i] = readCurrentImgSrc() || '';
      }
    }
    return urls;
  }

  // ===================== 主流程 =====================
  (async function main() {
    const ok = await waitFor(() => window.SMH && window.pVars && document.querySelector('#mangaFile'));
    if (!ok) return;

    const total = getTotalPages();
    if (!total) return;

    let conf = tryExtractConfFromPVars();
    let pageUrls = null;

    if (conf && conf.files && conf.sl) {
      const origin = fallbackOrigin;
      const path = conf.path || fallbackPath;
      const q = new URLSearchParams();
      if (conf.sl.e) q.set('e', conf.sl.e);
      if (conf.sl.m) q.set('m', conf.sl.m);
      pageUrls = conf.files.map(name => `${origin}${path}${name}?${q.toString()}`);
      pageUrls.unshift('');
      if (pageUrls.length - 1 !== total) pageUrls = null;
    }

    if (!pageUrls) {
      pageUrls = await collectUrlsByGoPage(total);
      if (!pageUrls) return;
    }

    const cfg = loadCfg();
    buildReaderUI(pageUrls, total, cfg);
  })();

  // ===================== 阅读 UI + 加载器 =====================
  function buildReaderUI(urls, totalPages, cfg) {
    // 样式（现代毛玻璃 + 自动隐藏 + 进度条 + 100vh + 贴中间 + 设置分组 + tooltip）
    const css = `
      :root{
        --page-height: ${cfg.pageHeight};
        --spread-gap-v: ${cfg.spreadGapV}px;
        --page-gap-h: ${cfg.pageGapH}px;
        --max-container-width: ${cfg.containerMaxW}px;
        --gallery-bg: ${cfg.galleryBg};
      }
      body { background: ${cfg.bodyBg}; }

	  .tbCenter {
        border: none;
      }
      .tmk-toolbar {
        position: fixed; right: 16px; top: 16px; z-index: 99999;
        color: #fff; font-size: 13px;
        padding: 10px 12px; border-radius: 12px; line-height: 1.6;
        background: rgba(24,24,24,.55);
        border: 1px solid rgba(255,255,255,.08);
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 28px rgba(0,0,0,.35);
        transition: opacity .25s ease, transform .25s ease;
      }
      .tmk-toolbar.auto-hide { opacity: 0; transform: translateY(-8px); pointer-events: none; }
      .tmk-toolbar.auto-hide.show { opacity: 1; transform: translateY(0); pointer-events: auto; }
      .tmk-reveal { position: fixed; right: 0; top: 0; width: 70px; height: 70px; z-index: 99998; }

      .tmk-toolbar .row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
      .tmk-toolbar .btn { color:#fff; background: linear-gradient(180deg,#515151,#444);
        border: 1px solid rgba(255,255,255,.12); padding: 6px 10px; border-radius: 8px; cursor:pointer; }
      .tmk-toolbar .btn:hover { filter: brightness(1.08); }
      .tmk-toolbar .sep { width:1px; height:18px; background: rgba(255,255,255,.15); margin: 0 6px; }
      .tmk-toolbar label { display:flex; align-items:center; gap:6px; user-select:none; cursor:pointer; }

      .tmk-gallery {
        width: min(98vw, var(--max-container-width));
        margin: 0 auto; padding: 8px 8px 120px;
        background: var(--gallery-bg);
        transition: background .2s ease;
      }
      .tmk-gallery .tmk-spread { width: 100%; margin-bottom: var(--spread-gap-v); }
      .tmk-gallery img { display: block; height: var(--page-height); width: auto; object-fit: contain; background: transparent; }
      .tmk-shadow img { box-shadow: 0 8px 24px rgba(0,0,0,.45); transition: box-shadow .2s ease; }
      .tmk-gallery.hide-pn .pn { display:none; }

      /* 单页模式：一行一页，居中 */
      .tmk-gallery.single .tmk-spread.single { display:flex; justify-content:center; }
      .tmk-gallery.single .tmk-spread.single .page-slot { position: relative; height: var(--page-height); }

      /* 双页：pair 组整体居中，“加载前半屏占位，加载后按图宽收缩” */
      .tmk-gallery.double .tmk-spread.pair { display:flex; gap: var(--page-gap-h); justify-content:center; }
      .tmk-gallery.double .tmk-spread.pair.rtl { flex-direction: row-reverse; }
      .tmk-gallery.double .tmk-spread.pair .page-slot {
        position: relative; height: var(--page-height);
        flex: 0 0 auto;
        width: calc((100% - var(--page-gap-h)) / 2);
        max-width: calc((100% - var(--page-gap-h)) / 2);
        overflow: hidden;
      }
      .tmk-gallery.double .tmk-spread.pair .page-slot.loaded { width: auto; max-width: none; }

      /* 双页中的单页（half slot），靠边（通过row-reverse控制靠右） */
      .tmk-gallery.double .tmk-spread.single-only { display:flex; justify-content:center; }
      .tmk-gallery.double .tmk-spread.single-only.rtl { flex-direction: row-reverse; }
      .tmk-gallery.double .tmk-spread.single-only .page-slot {
        position: relative; height: var(--page-height);
        flex: 0 0 auto;
        width: calc((100% - var(--page-gap-h)) / 2);
        max-width: calc((100% - var(--page-gap-h)) / 2);
        overflow: hidden;
      }
      .tmk-gallery.double .tmk-spread.single-only .page-slot.loaded {
        width: calc((100% - var(--page-gap-h)) / 2);
        max-width: calc((100% - var(--page-gap-h)) / 2);
      }

      /* 跨页：整行居中 */
      .tmk-gallery.double .tmk-spread.full { display:flex; justify-content:center; }
      .tmk-gallery.double .tmk-spread.full .page-slot { position: relative; height: var(--page-height); width: 100%; max-width: 100%; }

      /* 占位符骨架 */
      .page-slot .ph {
        position:absolute; inset:0; display:flex; align-items:center; justify-content:center; flex-direction:column;
        color:#9aa; font-size:13px; background: linear-gradient(180deg,#0f0f0f,#0b0b0b);
      }
      .page-slot.loaded .ph { display:none; }
      .ph .ring {
        width: 28px; height: 28px; border: 3px solid rgba(255,255,255,0.2); border-top-color:#bbb;
        border-radius:50%; animation: tmk-spin 0.9s linear infinite; margin-bottom:8px;
      }
      @keyframes tmk-spin { to { transform: rotate(360deg); } }

      /* 页码徽章 */
      .pn {
        position:absolute; left:50%; transform: translateX(-50%);
        bottom: 6px; padding: 2px 8px; font-size: 12px; color:#eee;
        background: rgba(0,0,0,.45); border-radius: 12px; pointer-events:none;
      }

      /* 底部跨页进度 */
      .tmk-bottom-progress {
        position: fixed; left: 50%; transform: translateX(-50%);
        bottom: 14px; z-index: 99990;
        color:#eee; font-size: 12px; padding: 4px 10px;
        background: rgba(20,20,20,.55);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 999px;
        box-shadow: 0 6px 18px rgba(0,0,0,.35);
      }
      .tmk-bottom-progress.hidden { display:none; }

      /* 下一章提示按钮 */
      .tmk-next-chapter {
        position: fixed; right: 24px; bottom: 20px; z-index: 99991;
        color:#fff; font-size: 14px; padding: 8px 12px;
        background: linear-gradient(180deg,#4e8a3f,#3f6d32);
        border: 1px solid rgba(255,255,255,.12); border-radius: 999px;
        box-shadow: 0 6px 18px rgba(0,0,0,.35);
        cursor: pointer; display:none;
      }
      .tmk-next-chapter.show { display:block; }

      /* 悬浮提示 */
      .tmk-floating-hint {
        position: fixed; left: 50%; transform: translateX(-50%);
        bottom: 80px; z-index: 99992;
        color:#fff; font-size: 14px; padding: 12px 20px;
        background: rgba(20,20,20,.85);
        border: 1px solid rgba(255,255,255,.15); border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,.4);
        backdrop-filter: blur(8px);
        text-align: center; line-height: 1.4;
        opacity: 0; transform: translateX(-50%) translateY(20px);
        transition: opacity .3s ease, transform .3s ease;
        pointer-events: none;
        max-width: 300px;
      }
      .tmk-floating-hint.show {
        opacity: 1; transform: translateX(-50%) translateY(0);
      }

      /* 设置面板 */
      .tmk-modal { position: fixed; inset:0; background: rgba(0,0,0,.35); z-index: 100000; display:none; align-items:center; justify-content:center; }
      .tmk-modal.show { display:flex; }
      .tmk-dialog {
        width: min(92vw, 720px); max-height: 88vh; overflow:auto;
        background: rgba(26,26,26,.7); color:#eee; border-radius:12px;
        box-shadow: 0 10px 28px rgba(0,0,0,.4);
        border: 1px solid rgba(255,255,255,.08);
        backdrop-filter: blur(16px);
        padding: 16px 18px 12px;
      }
      .tmk-dialog h3 { margin: 6px 0 6px; font-size: 16px; opacity: .9; }
      .tmk-section { margin: 10px 0 12px; border: 1px solid rgba(255,255,255,.08); border-radius: 10px; padding: 10px 12px; background: rgba(14,14,14,.35); }
      .tmk-section-title { font-size: 13px; opacity: .85; margin: 0 0 6px 0; }
      .tmk-dialog .row { display:flex; align-items:center; gap:10px; margin: 8px 0; flex-wrap:wrap; }
      .tmk-dialog label { min-width: 180px; display:flex; align-items:center; gap:6px; }
      .tmk-dialog input[type="number"], .tmk-dialog input[type="text"], .tmk-dialog select {
        padding: 6px 8px; border-radius: 8px; border: 1px solid #444; background:#111; color:#eee; width: 180px;
      }
      .tmk-dialog input[type="color"] { width: 44px; height: 28px; border: none; background: transparent; }
      .tmk-dialog .actions { display:flex; justify-content:flex-end; gap:8px; margin-top: 12px; }
      .tmk-dialog .btn { color:#fff; background: linear-gradient(180deg,#515151,#444); border:1px solid rgba(255,255,255,.12);
        padding: 6px 12px; border-radius:8px; cursor:pointer; }
      .tmk-dialog .btn:hover { filter: brightness(1.08); }
      .tmk-dialog .btn.warn { background: linear-gradient(180deg,#8a3838,#6a2b2b); }
      .tmk-dialog .btn.warn:hover { filter: brightness(1.08); }

      /* help 提示 */
      .help { display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; font-size:12px;
        border-radius:50%; background: rgba(255,255,255,.15); color:#fff; cursor: help; position:relative; }
      .help:hover::after {
        content: attr(data-tip); white-space: pre-line; position:absolute; left: -20px; right: auto; transform: none;
        bottom: 130%; min-width: 220px; max-width: 420px; background: rgba(20,20,20,.95); color:#eee;
        padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,.08);
        box-shadow: 0 10px 28px rgba(0,0,0,.35); text-align: left; line-height: 1.4; z-index: 1;
      }

      /* 关掉原站元素 */
      #mangaBox, #mangaMoreBox, #loading, .pager, .main-btn { display: none !important; }
    `;
    const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

    // 工具条
    const toolbar = document.createElement('div');
    toolbar.className = 'tmk-toolbar';
    toolbar.innerHTML = `
      <div class="row">
        <label><input type="checkbox" id="tmk-double" ${cfg.double ? 'checked' : ''}> 双页</label>
        <label><input type="checkbox" id="tmk-rtl" ${cfg.rtl ? 'checked' : ''}> 右到左</label>
        <label><input type="checkbox" id="tmk-first-single" ${cfg.firstSingle ? 'checked' : ''}> 首页单页</label>
        <div class="sep"></div>
        <button class="btn" id="tmk-prev">上一跨页</button>
        <button class="btn" id="tmk-next">下一跨页</button>
        <div class="sep"></div>
        <button class="btn" id="tmk-settings">设置</button>
        <div id="tmk-progress" style="margin-left:6px;opacity:.85;">加载 0/${totalPages}</div>
      </div>
    `;
    document.body.appendChild(toolbar);

    // 自动隐藏唤醒区
    const reveal = document.createElement('div');
    reveal.className = 'tmk-reveal';
    document.body.appendChild(reveal);

    // 设置面板（分组+帮助+四个按钮）
    const modal = document.createElement('div');
    modal.className = 'tmk-modal';
    modal.innerHTML = `
      <div class="tmk-dialog">
        <h3>阅读设置</h3>

        <div class="tmk-section">
          <div class="tmk-section-title">交互</div>
          <div class="row">
            <label>点击翻页 <span class="help" data-tip="点击屏幕的半区来翻页。左右半屏：左=上一跨页，右=下一跨页。上下半屏：上=上一跨页，下=下一跨页。">?</span></label>
            <select id="cfg-click-nav">
              <option value="off" ${cfg.clickNav==='off'?'selected':''}>禁用</option>
              <option value="lr" ${cfg.clickNav==='lr'?'selected':''}>左右半屏</option>
              <option value="ud" ${cfg.clickNav==='ud'?'selected':''}>上下半屏</option>
            </select>
          </div>
          <div class="row">
            <label>自动隐藏菜单栏 <span class="help" data-tip="开启后，右上角菜单仅在鼠标移动或将鼠标移到右上角唤醒区时显示。">?</span></label>
            <input type="checkbox" id="cfg-autohide" ${cfg.autoHideToolbar?'checked':''}>
          </div>
          <div class="row">
            <label>一屏滚动 <span class="help" data-tip="开启后，滚轮一次滚动将按“跨页”为单位进行。">?</span></label>
            <input type="checkbox" id="cfg-snap" ${cfg.snapWheel?'checked':''}>
          </div>
          <div class="row">
            <label>一屏滚动时平滑滚动 <span class="help" data-tip="与“一屏滚动”配合：若开启，将平滑滚动到下一跨页；关闭则瞬间跳转。">?</span></label>
            <input type="checkbox" id="cfg-snap-smooth" ${cfg.snapSmooth?'checked':''}>
          </div>
          <div class="row">
            <label>底部跨页进度 <span class="help" data-tip="在底部显示当前跨页序号/总跨页数。">?</span></label>
            <input type="checkbox" id="cfg-sp" ${cfg.showSpreadProgress?'checked':''}>
          </div>
        </div>

        <div class="tmk-section">
          <div class="tmk-section-title">快捷键说明 <span class="help" data-tip="← / →：上一/下一页&#10;Space / Enter：下一页&#10;D：切换单双页&#10;S：切换页面奇偶&#10;F：全屏开/关&#10;Q：打开/关闭设置面板&#10;W：切换显示页码&#10;E：切换‘右到左’方向&#10;G：跳转到页码&#10;Home / End：跳到首/尾跨页">?</span></div>
        </div>

        <div class="tmk-section">
          <div class="tmk-section-title">布局</div>
          <div class="row">
            <label>跨页判定阈值(w/h) <span class="help" data-tip="当图片宽高比≥此阈值时视为“横图”，在双页模式下占据整行（跨页）。默认1.0即横图触发。">?</span></label>
            <input type="number" id="cfg-cross" min="1.0" max="2.0" step="0.01" value="${cfg.crossAspect}">
          </div>
          <div class="row">
            <label>双页左右间距(px)</label><input type="number" id="cfg-gap-h" min="0" max="64" step="1" value="${cfg.pageGapH}">
          </div>
          <div class="row">
            <label>行间上下间距(px)</label><input type="number" id="cfg-gap-v" min="0" max="64" step="1" value="${cfg.spreadGapV}">
          </div>
          <div class="row">
            <label>单页高度(CSS) <span class="help" data-tip="单个页面的显示高度。例如 100vh 表示屏幕高；也可写 calc(100vh - 64px)。">?</span></label>
            <input type="text" id="cfg-page-height" value="${cfg.pageHeight}">
          </div>
          <div class="row">
            <label>最大容器宽(px) <span class="help" data-tip="阅读区域的最大宽度上限。可根据屏幕调整。">?</span></label>
            <input type="number" id="cfg-maxw" min="800" max="5000" step="10" value="${cfg.containerMaxW}">
          </div>
        </div>

        <div class="tmk-section">
          <div class="tmk-section-title">外观</div>
          <div class="row"><label>显示页码</label><input type="checkbox" id="cfg-pn" ${cfg.showPN ? 'checked' : ''}></div>
          <div class="row"><label>图片阴影</label><input type="checkbox" id="cfg-shadow" ${cfg.shadow ? 'checked' : ''}></div>
          <div class="row">
            <label>页面背景色</label><input type="color" id="cfg-body-bg" value="${toColor(cfg.bodyBg)}"><span>${cfg.bodyBg}</span>
          </div>
          <div class="row">
            <label>容器背景色 <span class="help" data-tip="阅读容器（图片区域）背景色。">?</span></label><input type="color" id="cfg-gallery-bg" value="${toColor(cfg.galleryBg)}"><span>${cfg.galleryBg}</span>
          </div>
        </div>

        <div class="tmk-section">
          <div class="tmk-section-title">视图模式</div>
          <div class="row">
            <label><input type="checkbox" id="tmk-double" ${cfg.double ? 'checked' : ''}> 双页</label>
            <label><input type="checkbox" id="tmk-rtl" ${cfg.rtl ? 'checked' : ''}> 右到左</label>
            <label><input type="checkbox" id="tmk-first-single" ${cfg.firstSingle ? 'checked' : ''}> 首页单页</label>
          </div>
        </div>

        <div class="actions">
          <button class="btn warn" id="cfg-reset">重置</button>
          <button class="btn" id="cfg-cancel">取消</button>
          <button class="btn" id="cfg-apply">应用</button>
          <button class="btn" id="cfg-save-close">保存并关闭</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    function toColor(v){const s=String(v||'').trim();return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)?s:'#000000';}

    // 底部跨页进度
    const spreadProg = document.createElement('div');
    spreadProg.className = 'tmk-bottom-progress' + (cfg.showSpreadProgress?'':' hidden');
    spreadProg.textContent = '';
    document.body.appendChild(spreadProg);

    // "下一章"按钮
    const nextChapterBtn = document.createElement('div');
    nextChapterBtn.className = 'tmk-next-chapter';
    nextChapterBtn.textContent = '下一章 ▶';
    nextChapterBtn.addEventListener('click', goNextChapter);
    document.body.appendChild(nextChapterBtn);

    // 悬浮提示
    const floatingHint = document.createElement('div');
    floatingHint.className = 'tmk-floating-hint';
    floatingHint.textContent = '再次翻页进入下一章';
    document.body.appendChild(floatingHint);

    // 容器
    const gallery = document.createElement('div');
    gallery.className = 'tmk-gallery';
    if (cfg.shadow) gallery.classList.add('tmk-shadow');
    if (!cfg.showPN) gallery.classList.add('hide-pn');
    document.querySelector('#tbBox')?.appendChild(gallery) || document.body.appendChild(gallery);

    // 状态
    let isDouble = cfg.double;
    let isRTL = cfg.rtl;
    let firstSingle = cfg.firstSingle;

    let active = 0;
    let loadedCount = 0;

    // 悬浮提示状态
    let isFloatingHintVisible = false;
    let floatingHintTimer = null;
    const state = new Array(totalPages + 1).fill(0);   // 0 pending, 1 loading, 2 done
    const attempts = new Array(totalPages + 1).fill(0);
    const nextTime = new Array(totalPages + 1).fill(0);
    const dims = new Array(totalPages + 1).fill(null);
    const isWide = new Array(totalPages + 1).fill(null);

    let spreadsCache = [];
    let lastLayoutRows = [];

    // 工具条按钮
    const progressEl = document.querySelector('#tmk-progress');
    const btnPrev = toolbar.querySelector('#tmk-prev');
    const btnNext = toolbar.querySelector('#tmk-next');
    const btnSettings = toolbar.querySelector('#tmk-settings');

    btnPrev.addEventListener('click', () => scrollToSpread(nearestSpread() - 1, true));
    btnNext.addEventListener('click', () => scrollToSpread(nearestSpread() + 1, true));
    btnSettings.addEventListener('click', () => {
      if (cfg.autoHideToolbar) toolbar.classList.add('show');
      modal.classList.add('show');
    });

    // 右上角工具栏复选框事件监听
    const toolbarDouble = toolbar.querySelector('#tmk-double');
    const toolbarRTL = toolbar.querySelector('#tmk-rtl');
    const toolbarFirst = toolbar.querySelector('#tmk-first-single');

    toolbarDouble.addEventListener('change', () => {
      isDouble = toolbarDouble.checked;
      cfg.double = isDouble;
      saveCfg(cfg);
      // 同步设置面板
      modal.querySelector('#tmk-double').checked = isDouble;
      render(true, { anchorMode: 'page' });
    });

    toolbarRTL.addEventListener('change', () => {
      isRTL = toolbarRTL.checked;
      cfg.rtl = isRTL;
      saveCfg(cfg);
      // 同步设置面板
      modal.querySelector('#tmk-rtl').checked = isRTL;
      render(true, { anchorMode: 'page' });
    });

    toolbarFirst.addEventListener('change', () => {
      firstSingle = toolbarFirst.checked;
      cfg.firstSingle = firstSingle;
      saveCfg(cfg);
      // 同步设置面板
      modal.querySelector('#tmk-first-single').checked = firstSingle;
      render(true, { anchorMode: 'spread' });
    });

    // 自动隐藏：唤醒逻辑
    function toolbarShow(show){
      if (!cfg.autoHideToolbar) return;
      toolbar.classList.toggle('show', !!show);
    }
    function applyAutohide(){
      toolbar.classList.toggle('auto-hide', cfg.autoHideToolbar);
      if (!cfg.autoHideToolbar) toolbar.classList.add('show');
    }
    applyAutohide();

    let hoverTimer = null, lastMove = 0;
    let isToolbarHover = false;
    const showFor = (ms)=>{ toolbarShow(true); clearTimeout(hoverTimer); hoverTimer = setTimeout(()=>{ if (!isToolbarHover) toolbarShow(false); }, ms); };
    reveal.addEventListener('mouseenter', ()=> toolbarShow(true));
    reveal.addEventListener('mouseleave', ()=> toolbarShow(false));
    toolbar.addEventListener('mouseenter', ()=> { isToolbarHover = true; toolbarShow(true); clearTimeout(hoverTimer); });
    toolbar.addEventListener('mouseleave', ()=> { isToolbarHover = false; toolbarShow(false); });
    window.addEventListener('mousemove', ()=>{
      if (!cfg.autoHideToolbar) return;
      if (Date.now() - lastMove > 800) toolbarShow(true);
      lastMove = Date.now(); showFor(1500);
    });

    // 设置面板逻辑
    const ui = {
      clickNav: modal.querySelector('#cfg-click-nav'),
      autohide: modal.querySelector('#cfg-autohide'),
      snap: modal.querySelector('#cfg-snap'),
      snapSmooth: modal.querySelector('#cfg-snap-smooth'),
      gapH: modal.querySelector('#cfg-gap-h'),
      gapV: modal.querySelector('#cfg-gap-v'),
      pageH: modal.querySelector('#cfg-page-height'),
      maxW: modal.querySelector('#cfg-maxw'),
      cross: modal.querySelector('#cfg-cross'),
      pn: modal.querySelector('#cfg-pn'),
      shadow: modal.querySelector('#cfg-shadow'),
      bodyBg: modal.querySelector('#cfg-body-bg'),
      galleryBg: modal.querySelector('#cfg-gallery-bg'),
      sp: modal.querySelector('#cfg-sp'),
      cancel: modal.querySelector('#cfg-cancel'),
      reset: modal.querySelector('#cfg-reset'),
      apply: modal.querySelector('#cfg-apply'),
      saveClose: modal.querySelector('#cfg-save-close'),
      chkDouble: modal.querySelector('#tmk-double'),
      chkRTL: modal.querySelector('#tmk-rtl'),
      chkFirst: modal.querySelector('#tmk-first-single')
    };
    modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.classList.remove('show'); });

    ui.reset.addEventListener('click', ()=>{
      // 重置输入框到默认值，但不立即应用
      ui.clickNav.value = DEFAULTS.clickNav;
      ui.autohide.checked = DEFAULTS.autoHideToolbar;
      ui.snap.checked = DEFAULTS.snapWheel;
      ui.snapSmooth.checked = DEFAULTS.snapSmooth;
      ui.gapH.value = DEFAULTS.pageGapH;
      ui.gapV.value = DEFAULTS.spreadGapV;
      ui.pageH.value = DEFAULTS.pageHeight;
      ui.maxW.value = DEFAULTS.containerMaxW;
      ui.cross.value = DEFAULTS.crossAspect;
      ui.pn.checked = DEFAULTS.showPN;
      ui.shadow.checked = DEFAULTS.shadow;
      ui.bodyBg.value = toColor(DEFAULTS.bodyBg);
      ui.bodyBg.nextElementSibling.textContent = DEFAULTS.bodyBg;
      ui.galleryBg.value = toColor(DEFAULTS.galleryBg);
      ui.galleryBg.nextElementSibling.textContent = DEFAULTS.galleryBg;
      ui.sp.checked = DEFAULTS.showSpreadProgress;
      ui.chkDouble.checked = DEFAULTS.double;
      ui.chkRTL.checked = DEFAULTS.rtl;
      ui.chkFirst.checked = DEFAULTS.firstSingle;
    });
    ui.cancel.addEventListener('click', ()=> modal.classList.remove('show'));

    function pickFormToCfg() {
      return {
        ...cfg,
        clickNav: ui.clickNav.value,
        autoHideToolbar: !!ui.autohide.checked,
        snapWheel: !!ui.snap.checked,
        snapSmooth: !!ui.snapSmooth.checked,
        pageGapH: clamp(+ui.gapH.value||0,0,64),
        spreadGapV: clamp(+ui.gapV.value||0,0,64),
        pageHeight: (ui.pageH.value||'100vh').trim(),
        containerMaxW: clamp(+ui.maxW.value||DEFAULTS.containerMaxW,800,5000),
        crossAspect: clamp(+ui.cross.value||DEFAULTS.crossAspect,1.0,2.0),
        showPN: !!ui.pn.checked,
        shadow: !!ui.shadow.checked,
        bodyBg: ui.bodyBg.value || DEFAULTS.bodyBg,
        galleryBg: ui.galleryBg.value || DEFAULTS.galleryBg,
        showSpreadProgress: !!ui.sp.checked,
        double: !!ui.chkDouble.checked,
        rtl: !!ui.chkRTL.checked,
        firstSingle: !!ui.chkFirst.checked
      };
    }
    ui.apply.addEventListener('click', ()=>{
      Object.assign(cfg, pickFormToCfg());
      // 同步运行时状态（与保存一致）
      isDouble = cfg.double; isRTL = cfg.rtl; firstSingle = cfg.firstSingle;
      applyCfg(); rejudgeWide(); render(true, { anchorMode: 'page' });
      showFor(1200); // 提示显示菜单
    });
    ui.saveClose.addEventListener('click', ()=>{
      Object.assign(cfg, pickFormToCfg());
      // 同步运行时状态
      isDouble = cfg.double; isRTL = cfg.rtl; firstSingle = cfg.firstSingle;
      saveCfg(cfg); applyCfg(); rejudgeWide(); render(true, { anchorMode: 'page' });
      modal.classList.remove('show');
      showFor(1200);
    });
    function clamp(v,a,b){return Math.min(b,Math.max(a,v));}

    // 外观/行为应用
    function applyCfg(){
      // 根变量刷新
      style.textContent = style.textContent.replace(/:root\{[\s\S]*?\}/, () => {
        return `:root{
          --page-height: ${cfg.pageHeight};
          --spread-gap-v: ${cfg.spreadGapV}px;
          --page-gap-h: ${cfg.pageGapH}px;
          --max-container-width: ${cfg.containerMaxW}px;
          --gallery-bg: ${cfg.galleryBg};
        }`;
      });
      document.body.style.background = cfg.bodyBg;
      gallery.style.background = cfg.galleryBg;
      gallery.classList.toggle('tmk-shadow', cfg.shadow);
      gallery.classList.toggle('hide-pn', !cfg.showPN);
      spreadProg.classList.toggle('hidden', !cfg.showSpreadProgress);
      toolbar.classList.toggle('auto-hide', cfg.autoHideToolbar);
      if (!cfg.autoHideToolbar) toolbar.classList.add('show');
      // color旁边显示文本
      ui.bodyBg.nextElementSibling.textContent = cfg.bodyBg;
      ui.galleryBg.nextElementSibling.textContent = cfg.galleryBg;
      // 视图模式（复选框同步到主工具条）
      const mainDouble = toolbar.querySelector('#tmk-double');
      const mainRTL = toolbar.querySelector('#tmk-rtl');
      const mainFirst = toolbar.querySelector('#tmk-first-single');
      if (mainDouble) mainDouble.checked = cfg.double;
      if (mainRTL) mainRTL.checked = cfg.rtl;
      if (mainFirst) mainFirst.checked = cfg.firstSingle;
      // 一屏滚动绑定
      bindSnapWheel(cfg.snapWheel);
    }

    // ========== 布局 & 渲染 ==========
    function computeLayout() {
      const rows = [];
      if (!isDouble) { for (let i = 1; i <= totalPages; i++) rows.push({ type: 'single', pages: [i] }); return rows; }
      let i = 1;
      // 期望的配对奇偶性：当首页单页启用时，配对应从偶数页开始（即 1 单，后续 2-3、4-5...）。
      // 若首页单页关闭，则配对从奇数页开始（即 1-2、3-4...）。
      const desiredPairStartParity = firstSingle ? 0 /* even */ : 1 /* odd */;

      if (i <= totalPages) {
        const w = isWide[i] === true;
        if (firstSingle && !w) { rows.push({ type: 'single-only', pages: [i] }); i++; }
      }
      while (i <= totalPages) {
        const w = isWide[i] === true;
        if (w) { rows.push({ type: 'full', pages: [i] }); i++; continue; }
        // 当下一页是跨页(full)时，仍需在进入pair前按期望奇偶性对齐
        if ((i % 2) !== desiredPairStartParity) { rows.push({ type: 'single-only', pages: [i] }); i++; continue; }
        if (i + 1 <= totalPages && isWide[i + 1] === true) { rows.push({ type: 'single-only', pages: [i] }); i++; continue; }
        rows.push({ type: 'pair', pages: [i, i + 1].filter(x => x <= totalPages) }); i += 2;
      }
      return rows;
    }
    function getAnchorPageIdx() {
      const slots = Array.from(document.querySelectorAll('.page-slot[data-idx]'));
      if (!slots.length) return 1;
      let best=1, dst=Infinity;
      for (const el of slots) { const d = Math.abs(el.getBoundingClientRect().top); if (d < dst) { dst=d; best=parseInt(el.dataset.idx,10); } }
      return best;
    }
    function pageToSpreadIndex(pageIdx) {
      for (let s=0; s<lastLayoutRows.length; s++) { if (lastLayoutRows[s].pages.includes(pageIdx)) return s; }
      return 0;
    }

    function render(preserve=false, opts={}) {
      const anchorMode = opts && opts.anchorMode === 'spread' ? 'spread' : 'page';
      // 预记录锚点：页面或跨页容器
      let beforeScrollTop = 0;
      let beforeOffset = 0;
      let beforeSpreadIdx = null;
      let anchorPage = null;
      if (preserve) {
        beforeScrollTop = window.scrollY;
        if (anchorMode === 'spread') {
          beforeSpreadIdx = nearestSpread();
          if (beforeSpreadIdx != null && spreadsCache[beforeSpreadIdx]) {
            const el = spreadsCache[beforeSpreadIdx];
            const r = el.getBoundingClientRect();
            beforeOffset = Math.min(Math.max(-r.top, 0), Math.max(0, r.height - 1));
          }
        } else {
          anchorPage = getAnchorPageIdx();
          if (anchorPage != null) {
            const el = document.querySelector(`.page-slot[data-idx="${anchorPage}"]`);
            if (el) {
              const r = el.getBoundingClientRect();
              beforeOffset = Math.min(Math.max(-r.top, 0), Math.max(0, r.height - 1));
            }
          }
        }
      }

      gallery.classList.toggle('double', isDouble);
      gallery.classList.toggle('single', !isDouble);

      // 收集现有的 page-slot，按 idx 复用，避免图片重新加载
      const existingSlots = new Map();
      const oldSlots = Array.from(gallery.querySelectorAll('.page-slot[data-idx]'));
      for (const el of oldSlots) {
        const idx = parseInt(el.getAttribute('data-idx')||'0',10);
        if (idx) existingSlots.set(idx, el);
      }

      function getOrCreateSlot(i){
        let slot = existingSlots.get(i);
        if (slot) {
          // 确保有页码徽章节点（若之前未创建且当前需要显示）
          if (cfg.showPN && !slot.querySelector('.pn')) {
            const pn = document.createElement('div'); pn.className = 'pn'; pn.textContent = i; slot.appendChild(pn);
          }
          // 若该页已加载完成，但 img 仍无 src（可能因DOM搬移时机导致onload阶段未能写入），则在此补齐
          if (state[i] === 2) {
            const img = slot.querySelector('img[data-idx]');
            if (img && !img.getAttribute('src')) img.setAttribute('src', urls[i]);
            slot.classList.add('loaded');
          }
          return slot;
        }
        // 不存在则新建（仅首次或极少数情况）
        return makePageSlot(i);
      }

      spreadsCache = [];
      lastLayoutRows = computeLayout();
      const frag = document.createDocumentFragment();

      for (const row of lastLayoutRows) {
        const spread = document.createElement('div');
        spread.className = `tmk-spread ${row.type}`;
        if (isDouble && (row.type === 'pair' || row.type === 'single-only') && isRTL) spread.classList.add('rtl');

        if (row.type === 'single') {
          spread.appendChild(getOrCreateSlot(row.pages[0]));
        } else if (row.type === 'full') {
          spread.appendChild(getOrCreateSlot(row.pages[0]));
        } else if (row.type === 'single-only') {
          spread.appendChild(getOrCreateSlot(row.pages[0]));
        } else if (row.type === 'pair') {
          const [a,b] = row.pages;
          spread.appendChild(getOrCreateSlot(a)); if (b) spread.appendChild(getOrCreateSlot(b));
        }
        frag.appendChild(spread); spreadsCache.push(spread);
      }

      // 用新布局替换旧内容（节点移动，不重新创建已有图片节点）
      while (gallery.firstChild) gallery.removeChild(gallery.firstChild);
      gallery.appendChild(frag);

      if (preserve) {
        if (anchorMode === 'spread' && beforeSpreadIdx != null && spreadsCache[beforeSpreadIdx]) {
          const el = spreadsCache[beforeSpreadIdx];
          const r = el.getBoundingClientRect();
          const top = beforeScrollTop + r.top + beforeOffset;
          window.scrollTo({ top, behavior: 'auto' });
        } else if (anchorMode === 'page' && anchorPage != null) {
          const el = document.querySelector(`.page-slot[data-idx="${anchorPage}"]`);
          if (el) {
            const r = el.getBoundingClientRect();
            const top = beforeScrollTop + r.top + beforeOffset;
            window.scrollTo({ top, behavior: 'auto' });
          }
        }
      } else {
        const saved = loadPos();
        if (saved && saved>=1 && saved<=totalPages) { const si = pageToSpreadIndex(saved); setTimeout(()=> scrollToSpread(si, true), 60); }
      }

      tick(); // 加载调度
      updateSpreadProgress();
      checkEndHint();
    }

    function makePageSlot(i) {
      const slot = document.createElement('div');
      slot.className = `page-slot ${state[i] === 2 ? 'loaded' : ''}`;
      slot.dataset.idx = String(i);

      const ph = document.createElement('div');
      ph.className = 'ph';
      ph.innerHTML = `<div class="ring"></div><div class="txt">加载中…</div>`;
      slot.appendChild(ph);

      const img = document.createElement('img');
      img.alt = `第 ${i} 页`;
      img.dataset.idx = String(i);
      if (state[i] === 2) img.src = urls[i];
      slot.appendChild(img);

      if (cfg.showPN) { const pn = document.createElement('div'); pn.className = 'pn'; pn.textContent = i; slot.appendChild(pn); }
      return slot;
    }

    function nearestSpread() {
      let nearest = 0, best = Infinity;
      spreadsCache.forEach((el,i)=>{ const d = Math.abs(el.getBoundingClientRect().top); if (d < best) {best=d; nearest=i;} });
      return nearest;
    }
    function scrollToSpread(idx, smooth = true) {
      if (!spreadsCache.length) return;
      const clamped = Math.max(0, Math.min(idx, spreadsCache.length - 1));

      // 检查是否尝试翻到最后一页之后
      if (idx >= spreadsCache.length) {
        // 如果悬浮提示已显示，则进入下一章
        if (isFloatingHintVisible) {
          hideFloatingHint();
          goNextChapter();
          return;
        } else {
          // 否则显示悬浮提示，并滚动到最后一页
          showFloatingHint();
          spreadsCache[spreadsCache.length - 1].scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
        }
      } else {
        // 正常翻页，隐藏悬浮提示
        hideFloatingHint();
        spreadsCache[clamped].scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      }

      setTimeout(()=>{ updateSpreadProgress(); checkEndHint(); }, 60);
    }

    function updateSpreadProgress(){
      const si = nearestSpread();
      const row = lastLayoutRows[si];
      spreadProg.textContent = `跨页 ${si+1} / ${spreadsCache.length || 0}`;
      if (row && row.pages && row.pages.length) savePos(row.pages[0]);
    }

    function checkEndHint() {
      // 当最后一个跨页已在视口内底部区域，显示"下一章"
      const last = spreadsCache[spreadsCache.length - 1];
      if (!last) {
        nextChapterBtn.classList.remove('show');
        hideFloatingHint();
        return;
      }
      const rect = last.getBoundingClientRect();
      const vh = window.innerHeight;
      const nearBottom = rect.top < vh * 0.6 && rect.bottom <= vh + 80;
      // or 已经滚到底
      const atEnd = (window.scrollY + vh) >= (document.documentElement.scrollHeight - 4);
      if (nearBottom || atEnd) {
        nextChapterBtn.classList.add('show');
        // 注意：悬浮提示只在用户主动翻页时显示，这里不显示
      } else {
        nextChapterBtn.classList.remove('show');
        hideFloatingHint();
      }
    }

    function goNextChapter() {
      if (window.SMH?.nextC) { try { window.SMH.nextC(); return; } catch {} }
      const a = document.querySelector('.main-btn .nextC, .pager .next');
      if (a) { a.click(); return; }
      // 兜底：跳回目录
      const list = document.querySelector('#viewList'); if (list) location.href = list.href;
    }

    // 悬浮提示控制函数
    function showFloatingHint() {
      if (isFloatingHintVisible) return;
      isFloatingHintVisible = true;
      floatingHint.classList.add('show');

      // 3秒后自动隐藏
      clearTimeout(floatingHintTimer);
      floatingHintTimer = setTimeout(() => {
        hideFloatingHint();
      }, 3000);
    }

    function hideFloatingHint() {
      if (!isFloatingHintVisible) return;
      isFloatingHintVisible = false;
      floatingHint.classList.remove('show');
      clearTimeout(floatingHintTimer);
    }

    // 键盘 & 点击翻页
    let fullscreenAnchor = null;
    window.addEventListener('keydown', (e)=>{
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      switch (e.key) {
        case 'ArrowLeft':
          scrollToSpread(nearestSpread()-1, true);
          e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
          break;
        case 'ArrowRight':
          scrollToSpread(nearestSpread()+1, true);
          e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
          break;
        case ' ': scrollToSpread(nearestSpread()+1, true); e.preventDefault(); break;
        case 'Enter': scrollToSpread(nearestSpread()+1, true); e.preventDefault(); break;
        case 'Home': scrollToSpread(0, true); e.preventDefault(); break;
        case 'End': scrollToSpread(spreadsCache.length-1, true); e.preventDefault(); break;
        case 'e': case 'E': // 切换 RTL（E）=> 触发工具条复选框
          if (toolbarRTL) { toolbarRTL.click(); e.preventDefault(); } break;
        case 'f': case 'F':
          fullscreenAnchor = { page: getAnchorPageIdx() };
          if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
          else document.exitFullscreen().catch(()=>{});
          break;
        case 'g': case 'G':
          const to = prompt(`跳转到页码 (1-${totalPages})：`);
          if (!to) break;
          const n = parseInt(to,10);
          if (Number.isFinite(n) && n>=1 && n<=totalPages) scrollToSpread(pageToSpreadIndex(n), true);
          break;
        case 'd': case 'D': // 切换单双页（D）=> 触发工具条复选框
          if (toolbarDouble) { toolbarDouble.click(); e.preventDefault(); } break;
        case 's': case 'S': // 切换首页单页（S）=> 触发工具条复选框
          if (toolbarFirst) { toolbarFirst.click(); e.preventDefault(); } break;
        case 'q': case 'Q': // 打开/关闭设置（Q）
          if (modal.classList.contains('show')) modal.classList.remove('show'); else {
            if (cfg.autoHideToolbar) toolbar.classList.add('show');
            modal.classList.add('show');
          }
          break;
        case 'w': case 'W': // 切换显示页码（W）
          cfg.showPN = !cfg.showPN; saveCfg(cfg);
          applyCfg(); render(true); break;
        case 'f': case 'F':
          fullscreenAnchor = { page: getAnchorPageIdx() };
          if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
          else document.exitFullscreen().catch(()=>{});
          break;
      }
    }, { passive:false, capture:true });

    document.addEventListener('fullscreenchange', ()=>{
      // 若未预先记录，则现场记录当前页作为锚点
      if (!fullscreenAnchor) fullscreenAnchor = { page: getAnchorPageIdx() };
      const page = fullscreenAnchor?.page;
      fullscreenAnchor = null;
      // 重新布局并滚回对应跨页
      render(true);
      if (page != null) {
        const si = pageToSpreadIndex(page);
        setTimeout(()=> scrollToSpread(si, false), 30);
      }
    });

    // 双击页面：切换单双页
    gallery.addEventListener('dblclick', (e)=>{
      isDouble = !isDouble; cfg.double=isDouble; saveCfg(cfg);
      modal.querySelector('#tmk-double').checked = isDouble;
      render(true);
    });

    // 点击半屏翻页
    gallery.addEventListener('click', (e)=>{
      if (modal.classList.contains('show')) return;
      if (e.target.closest('.tmk-toolbar')) return;
      if (cfg.clickNav === 'off') return;
      if ((e.target.closest('a,button,label,select,input,textarea'))) return;

      const vw = window.innerWidth, vh = window.innerHeight;
      const x = e.clientX, y = e.clientY;
      if (cfg.clickNav === 'lr') {
        if (x < vw/2) scrollToSpread(nearestSpread()-1, true);
        else scrollToSpread(nearestSpread()+1, true);
        e.preventDefault();
      } else if (cfg.clickNav === 'ud') {
        if (y < vh/2) scrollToSpread(nearestSpread()-1, true);
        else scrollToSpread(nearestSpread()+1, true);
        e.preventDefault();
      }
    });

    // 一屏滚动：滚轮=>按跨页前后；是否平滑由 cfg.snapSmooth 控制
    let lastWheel = 0;
    function wheelHandler(e){
      const now = Date.now();
      if (now - lastWheel < 300) { e.preventDefault(); return; } // 节流
      lastWheel = now;
      if (Math.abs(e.deltaY) < 3) return; // 触控板小抖动忽略
      if (e.deltaY > 0) scrollToSpread(nearestSpread()+1, !!cfg.snapSmooth);
      else scrollToSpread(nearestSpread()-1, !!cfg.snapSmooth);
      e.preventDefault();
    }
    function bindSnapWheel(on){
      window.removeEventListener('wheel', wheelHandler, { passive:false });
      if (on) window.addEventListener('wheel', wheelHandler, { passive:false });
    }

    // ========== 队列加载（顺序优先+限速+超时+指数退避） ==========
    function updateProgress(){ if (progressEl) progressEl.textContent = `加载 ${loadedCount}/${totalPages}`; }
    function rejudgeWide(){ for (let i=1;i<=totalPages;i++) if (dims[i]) isWide[i] = (dims[i].w/dims[i].h)>=cfg.crossAspect; }

    function backoff(attempt){ const base=500; return Math.min(30000, base*Math.pow(2,Math.max(0,attempt-1))) + Math.random()*300; }
    function pickNextIndex(){
      const now=Date.now();
      for (let i=1;i<=totalPages;i++){ if (state[i]===0 && now >= (nextTime[i]||0)) return i; }
      return 0;
    }
    function startLoad(i){
      state[i]=1; attempts[i]++; active++;
      const url=urls[i]; const toMs=Math.max(3000, TIMEOUT_SEC*1000);
      let done=false, timer=null;
      const onDone=(ok,w,h)=>{
        if (done) return; done=true; active--; clearTimeout(timer);
        const slot = document.querySelector(`.page-slot[data-idx="${i}"]`);
        if (ok){
          if (state[i]!==2){
            state[i]=2; loadedCount++; updateProgress();
            if (w && h){
              dims[i]={w,h};
              const was = isWide[i];
              const nowFlag = (w/h)>=cfg.crossAspect;
              isWide[i]=nowFlag;
              if (was!==nowFlag){ render(true); return; }
            }
            const img = slot?.querySelector('img[data-idx]');
            if (img && !img.src) img.src = url;
            slot?.classList.add('loaded');
          }
        } else {
          state[i]=0; nextTime[i]=Date.now()+backoff(attempts[i]);
          const txt = slot?.querySelector('.ph .txt'); if (txt) txt.textContent = `重试中…(#${attempts[i]})`;
        }
        tick();
      };
      const tmp = new Image();
      tmp.onload = ()=> onDone(true, tmp.naturalWidth||0, tmp.naturalHeight||0);
      tmp.onerror = ()=> onDone(false);
      timer = setTimeout(()=> onDone(false), toMs);
      tmp.src = url;
    }
    function tick(){
      while (active < CONCURRENCY){
        const idx = pickNextIndex();
        if (!idx) break;
        startLoad(idx);
      }
      if (loadedCount === totalPages) updateProgress();
    }

    // 初始应用与渲染
    applyCfg();
    updateProgress();
    render(false);

    // 滚动时更新进度/保存位置/章节末提示
    window.addEventListener('scroll', ()=> { updateSpreadProgress(); checkEndHint(); }, { passive:true });

    // 一屏滚动初始绑定
    bindSnapWheel(cfg.snapWheel);
  }

})();