// ==UserScript==
// @name         YouTube Shorts – 自動下一則
// @namespace    jerry.tools
// @version      2025.08.30.1904
// @description  Auto-next for YouTube Shorts with a circular progress ring. Low-overhead (event-driven).
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546533/YouTube%20Shorts%20%E2%80%93%20%E8%87%AA%E5%8B%95%E4%B8%8B%E4%B8%80%E5%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/546533/YouTube%20Shorts%20%E2%80%93%20%E8%87%AA%E5%8B%95%E4%B8%8B%E4%B8%80%E5%89%87.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Route Guard ----------
  const isShorts = () => location.pathname.startsWith('/shorts/');
  let enabled = false;
  let mo = null;           // MutationObserver
  let ui = null;           // UI refs

  function enable() {
    if (enabled) return;
    enabled = true;
    mountUI();
    // 初次綁定
    document.querySelectorAll('video').forEach(wireVideo);
    // 觀察新增節點（批次）
    let pending = [];
    let scheduled = false;
    const flush = () => {
      scheduled = false;
      const batch = pending; pending = [];
      for (const n of batch) {
        if (n.nodeType !== 1) continue;
        if (n.tagName === 'VIDEO') wireVideo(n);
        else n.querySelectorAll?.('video').forEach(wireVideo);
      }
      const pv = pickPrimaryShortVideo();
      if (pv) updateRingFromVideo(pv);
    };
    mo = new MutationObserver(muts => {
      for (const m of muts) for (const n of m.addedNodes) pending.push(n);
      if (!scheduled) { scheduled = true; Promise.resolve().then(flush); }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  function disable() {
    if (!enabled) return;
    enabled = false;
    // 解除 observer
    try { mo && mo.disconnect(); } catch {}
    mo = null;
    // 移除 UI
    if (ui && ui.root && ui.root.isConnected) {
      try { ui.root.remove(); } catch {}
    }
    ui = null;
    // 解除已綁定 video 的事件
    document.querySelectorAll('video').forEach(unwireVideo);
  }

  // 監聽 YouTube SPA 導航（含返回鍵/點擊站內連結）
  const onNav = () => (isShorts() ? enable() : disable());
  window.addEventListener('yt-navigate-finish', onNav);
  window.addEventListener('popstate', onNav);
  window.addEventListener('DOMContentLoaded', onNav);

  // 若使用者把 @match 改成全站，此守門也可確保只在 /shorts/ 生效
  if (isShorts()) enable();

  // ---------- Shorts 專用邏輯 ----------
  const clamp01 = v => Math.max(0, Math.min(1, v));

  function pickPrimaryShortVideo(except = null) {
    const vids = Array.from(document.querySelectorAll('ytd-reel-video-renderer video, #shorts-container video, video'));
    let best = null, bestArea = 0;
    for (const v of vids) {
      if (!v || v === except) continue;
      const r = v.getBoundingClientRect();
      const w = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0));
      const h = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
      const area = w * h;
      if (area > bestArea) { bestArea = area; best = v; }
    }
    return best;
  }

  function goNextShort() {
    const opts = { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40, bubbles: true, cancelable: true };
    document.dispatchEvent(new KeyboardEvent('keydown', opts));
    document.dispatchEvent(new KeyboardEvent('keyup', opts));
    setTimeout(() => { try { window.scrollBy({ top: innerHeight * 0.9, behavior: 'smooth' }); } catch {} }, 120);
  }

function wireVideo(v) {
  if (!v || v.__ytShortBound) return;
  v.__ytShortBound = true;

  // 單次鎖 ＋ 媒體簽章（避免相同 <video> 被重用時不重置）
  v.__nextOnce = false;
  v.__mediaSig = '';  // currentSrc|duration

  const ensureMediaSig = () => {
    const d = isFinite(v.duration) ? v.duration : 0;
    const sig = (v.currentSrc || v.src || '') + '|' + d;
    // 新媒體載入：重置單次鎖
    if (sig && sig !== v.__mediaSig) {
      v.__mediaSig = sig;
      v.__nextOnce = false;
      // 如果你之前有其它一次性旗標，也可在這裡一併清
      // v.__doneFired = false;
    }
  };

  const onProgressEvent = () => {
    if (!enabled) return;
    ensureMediaSig();            // ★ 每次更新先檢查是否換片
    updateRingFromVideo(v);
  };

  v.addEventListener('loadedmetadata', onProgressEvent, { passive: true }); // ★ 換片一定會來
  v.addEventListener('play',            onProgressEvent, { passive: true });
  v.addEventListener('timeupdate',      onProgressEvent, { passive: true });
  v.addEventListener('seeking',         onProgressEvent, { passive: true });

  // 只在第一次跨過門檻時排程一次
  const nearEnd = () => {
    const d = v.duration || 0;
    if (d <= 1) return;
    const ratio = (v.currentTime || 0) / d;

    if (!v.__nextOnce && ratio >= 0.975) {   // 邊緣觸發 + 單次鎖
      v.__nextOnce = true;                   // 立刻上鎖，避免 97.6% → 99.5% 連觸發
      setTimeout(() => {
        if (enabled) goNextShort();
      }, 600); // 你的 0.6 秒延遲
    }
  };

  // 你選擇不用 ended 就維持註解；若要保險可開啟但仍會被 __nextOnce 限一次
  // v.addEventListener('ended', () => { if (enabled && !v.__nextOnce) { v.__nextOnce = true; setTimeout(()=>goNextShort(),1500); } }, { passive: true });

  v.addEventListener('timeupdate', () => { if (enabled) nearEnd(); }, { passive: true });

  // 初次更新
  onProgressEvent();
}

function unwireVideo(v) {
  v.__ytShortBound = false;
  // 不強制清 __nextOnce，因為同一個元素可能被重用；
  // 我們在 loadedmetadata/ensureMediaSig 時會正確重置。
}


  // ---------- 圓環 UI ----------
  function mountUI() {
    if (ui) return;
    const root = document.createElement('div');
    const shadow = root.attachShadow({ mode: 'open' });

        const wrap = document.createElement('div');
        wrap.style.position = 'fixed';
        wrap.style.bottom = '20px';
        wrap.style.right = '20px';
        wrap.style.zIndex = '2147483647';
        wrap.style.display = 'flex';
        wrap.style.flexDirection = 'column';
        wrap.style.alignItems = 'center';
        wrap.style.userSelect = 'none';
        wrap.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial';

        // 外框容器
        const ringBox = document.createElement('div');
        ringBox.style.width = '40px';
        ringBox.style.height = '40px';
        ringBox.style.marginTop = '8px';
        ringBox.style.position = 'relative';
        ringBox.style.display = 'flex';
        ringBox.style.alignItems = 'center';
        ringBox.style.justifyContent = 'center';

        const svgNS = 'http://www.w3.org/2000/svg';
        // SVG 圓環
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '40');
        svg.setAttribute('height', '40');
        svg.setAttribute('viewBox', '0 0 40 40');

        // 軌道半徑
        const R = 18; // 半徑
        const C = 2 * Math.PI * R;

        // 軌道
        const track = document.createElementNS(svgNS, 'circle');
        track.setAttribute('cx', '20'); track.setAttribute('cy', '20'); track.setAttribute('r', String(R));
        track.setAttribute('fill', 'none');
        track.setAttribute('stroke', 'rgba(255,255,255,0.25)');
        track.setAttribute('stroke-width', '4');

        // 進度弧
        const prog = document.createElementNS(svgNS, 'circle');
        prog.setAttribute('cx', '20'); prog.setAttribute('cy', '20'); prog.setAttribute('r', String(R));
        prog.setAttribute('fill', 'none');
        prog.setAttribute('stroke', '#22c55e');
        prog.setAttribute('stroke-width', '4');
        prog.setAttribute('stroke-linecap', 'round');
        prog.style.transform = 'rotate(-90deg)';
        prog.style.transformOrigin = '50% 50%';
        prog.setAttribute('stroke-dasharray', String(C));
        prog.setAttribute('stroke-dashoffset', String(C));

        // 文字
        const pctText = document.createElement('div');
        pctText.style.position = 'absolute';
        pctText.style.left = '0';
        pctText.style.top = '0';
        pctText.style.width = '40px';
        pctText.style.height = '40px';
        pctText.style.display = 'flex';
        pctText.style.alignItems = 'center';
        pctText.style.justifyContent = 'center';
        pctText.style.fontSize = '12px';
        pctText.style.color = '#fff';
        pctText.textContent = '--%';


        svg.appendChild(track);
        svg.appendChild(prog);
        ringBox.appendChild(svg);
        ringBox.appendChild(pctText);
        wrap.appendChild(ringBox);
        shadow.appendChild(wrap);

    const mount = () => (document.body ? document.body.appendChild(root) : setTimeout(mount, 50));
    mount();

    ui = { root, shadow, ring: { prog, pctText, C } };
  }

  function updateRingFromVideo(v) {
    if (!ui || !v) return;
    const d = v.duration || 0;
    if (!isFinite(d) || d <= 0) {
      ui.ring.pctText.textContent = '--%';
      ui.ring.prog.setAttribute('stroke-dashoffset', String(ui.ring.C));
      ui.ring.prog.setAttribute('stroke', '#22c55e');
      return;
    }
    const ratio = clamp01(v.currentTime / d);
    const pct = Math.round(ratio * 100);
    ui.ring.pctText.textContent = pct + '%';
    ui.ring.prog.setAttribute('stroke-dashoffset', String(ui.ring.C * (1 - ratio)));
    ui.ring.prog.setAttribute('stroke', ratio >= 0.985 ? '#f59e0b' : '#22c55e');
  }
})();