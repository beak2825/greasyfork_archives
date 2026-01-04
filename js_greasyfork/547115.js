// ==UserScript==
// @name         lurl / myppt 資源下載
// @namespace    http://tampermonkey.net/
// @version      2.1.2
// @description  lurl 自動帶入日期、影片/圖片下載、Dcard 藍頭處理、播放器調整。移除 delete 用法，提升穩定性與可讀性。
// @author       You (refactor by ChatGPT)
// @match        https://lurl.cc/*
// @match        https://myppt.cc/*
// @match        https://www.dcard.tw/f/sex/*
// @match        https://www.dcard.tw/f/sex
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lurl.cc
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547115/lurl%20%20myppt%20%E8%B3%87%E6%BA%90%E4%B8%8B%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/547115/lurl%20%20myppt%20%E8%B3%87%E6%BA%90%E4%B8%8B%E8%BC%89.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /** 小工具區 **/
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (el, evt, cb, opts) => el && el.addEventListener(evt, cb, opts);
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const isDcardSex = () => location.href.startsWith('https://www.dcard.tw/f/sex');
  const isLurlOrMyppt = () => location.href.startsWith('https://lurl.cc/') || location.href.startsWith('https://myppt.cc/');

  // 載入外部資源（Toastify）
  const injectToastify = () => {
    if (!document.getElementById('toastify-css')) {
      const link = document.createElement('link');
      link.id = 'toastify-css';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css';
      (document.head || document.documentElement).appendChild(link);
    }
    if (!document.getElementById('toastify-js')) {
      const script = document.createElement('script');
      script.id = 'toastify-js';
      script.type = 'text/javascript';
      script.src = 'https://cdn.jsdelivr.net/npm/toastify-js';
      (document.head || document.documentElement).appendChild(script);
    }
  };

  const showToast = (text, ok = true) => {
    // 若 Toastify 尚未就緒就略過（避免報錯）；下一次點擊會再試
    if (typeof window.Toastify !== 'function') return;
    window.Toastify({
      text,
      duration: 5000,
      newWindow: true,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true,
      style: { background: ok ? '#28a745' : '#dc3545' }
    }).showToast();
  };

  const addCss = (cssText) => {
    const style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
    return style;
  };

  /*** Dcard 藍頭處理：將連到 lurl 的超連結新分頁開啟並帶上文章標題 ***/
  const bootDcard = () => {
    // 允許滑動（藍頭彈窗常阻滯滾動）
    document.body.style.overflow = 'auto';

    // 嘗試點「是，已滿 18 歲」
    const tryClick18 = async () => {
      // 粗略判斷：頁上 button 數量等於 13 時，點第二顆
      const buttons = $$('button');
      if (buttons.length === 13) {
        // 嘗試從藍頭結構中找到第二顆按鈕
        const ps = $$('p');
        const sibling = ps[1]?.nextSibling;
        if (sibling?.nodeType === 1) {
          const bs = $$('button', sibling);
          bs[1]?.click();
        }
      }
      // 清掉 __portal（覆蓋層）
      $$('.__portal').forEach(div => div.remove());
    };

    // 監聽所有 a，導到 lurl 時帶上 ?title=xxx
    const rewriteLinks = () => {
      $$('a').forEach(a => {
        on(a, 'click', (ev) => {
          const href = a.getAttribute('href');
          if (href && href.startsWith('https://lurl.cc/')) {
            ev.preventDefault();
            const webTitle = document.title || 'dcard';
            window.open(`${href}?title=${encodeURIComponent(webTitle)}`, '_blank');
          }
        }, { capture: true });
      });
    };

    // 單純在 /f/sex（列表）頁時，點擊後如 URL 變更則重新整理
    if (location.href === 'https://www.dcard.tw/f/sex') {
      let prev = location.href;
      on(document, 'click', () => {
        const now = location.href;
        if (now !== prev) location.reload();
        prev = now;
      }, { capture: true });
    }

    rewriteLinks();
    // 等待 3.5 秒讓彈窗出現，再嘗試處理
    setTimeout(tryClick18, 3500);
  };

  /*** 影片播放器替換：解除 oncontextmenu / controlslist、改回原生 control ***/
  const upgradePlayer = () => {
    const source = $('source');
    const oldVideo = $('video');
    if (!source || !oldVideo) return;

    const url = source.src;
    if (!url) return;

    const newVideo = document.createElement('video');
    newVideo.src = url;
    newVideo.controls = true;
    newVideo.autoplay = true;
    newVideo.width = 640;
    newVideo.height = 360;
    newVideo.preload = 'metadata';
    newVideo.classList.add('vjs-tech');
    newVideo.setAttribute('data-setup', '{"aspectRatio":"16:9"}');
    newVideo.id = 'vjs_video_3_html5_api';
    newVideo.tabIndex = -1;
    newVideo.setAttribute('role', 'application');

    oldVideo.parentNode?.replaceChild(newVideo, oldVideo);

    const wrap = document.getElementById('vjs_video_3');
    if (wrap) {
      wrap.removeAttribute('oncontextmenu');
      wrap.removeAttribute('controlslist');
    }
    $$('.vjs-control-bar').forEach(bar => bar.remove());
  };

  /*** 影片下載按鈕 ***/
  const addVideoDownload = () => {
    const source = $('source');
    if (!source?.src) return;

    const params = new URLSearchParams(location.search);
    const pageTitle = params.get('title') || 'video';
    const fileName = `${pageTitle}.mp4`;
    const url = source.src;

    // 建按鈕（放到 h2 旁或上）
    const link = document.createElement('a');
    link.className = 'btn btn-primary';
    link.style.cssText = 'color:white;float:right;';
    link.href = url;
    link.download = fileName;
    link.textContent = '下載影片';

    const h2s = $$('h2');
    if (h2s.length === 3) {
      const videoDiv = document.getElementById('vjs_video_3');
      if (videoDiv?.parentNode) {
        const h2 = document.createElement('h2');
        h2.textContent = '✅助手啟動';
        h2.style.color = 'white';
        h2.style.textAlign = 'center';
        h2.style.marginTop = '25px';
        videoDiv.parentNode.insertBefore(h2, videoDiv);
        h2.appendChild(link);
      }
    } else {
      const header = $('h2');
      if (header) header.appendChild(link);
    }

    // 防手殘瘋狂連點：按一次後 7 秒解鎖
    addCss(`
      .disabled-button {
        background-color:#ccc;color:#999;opacity:.5;cursor:not-allowed;
      }
    `);

    on(link, 'click', async (e) => {
      e.preventDefault();
      if (link.classList.contains('disabled-button')) return;

      // 嘗試 fetch 下載（避免某些站阻 a[download]）
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const objUrl = URL.createObjectURL(blob);

        // 動態 a 觸發下載
        const a = document.createElement('a');
        a.href = objUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // 清理臨時節點與 URL（不使用 delete）
        a.remove();
        URL.revokeObjectURL(objUrl);

        showToast('🎉 成功下載！請稍等幾秒……', true);
      } catch (err) {
        console.error(err);
        showToast('❌ 下載失敗，等等再試一次', false);
      }

      link.setAttribute('disabled', 'true');
      link.classList.add('disabled-button');
      setTimeout(() => {
        link.removeAttribute('disabled');
        link.classList.remove('disabled-button');
      }, 7000);
    }, { capture: true });
  };

  /*** 圖片下載按鈕（從 preload <link as="image"> 取得） ***/
  const addImageDownload = () => {
    const preload = $('link[rel="preload"][as="image"]');
    if (!preload?.href) return;

    const a = document.createElement('a');
    a.href = preload.href;
    a.download = 'downloaded-image.jpg'; // 可自行客製
    a.style.textDecoration = 'none';

    const btn = document.createElement('button');
    btn.textContent = '下載圖片';
    btn.className = 'btn btn-primary';
    a.appendChild(btn);

    const col = document.createElement('div');
    col.className = 'col-12';
    col.appendChild(a);

    const targetRow = $('div.row[style*="margin: 10px"][style*="border-style:solid"]');
    if (targetRow) {
      targetRow.appendChild(col);
    } else {
      console.warn('找不到指定的 <div class="row"> 容器；已略過圖片下載按鈕。');
    }
  };

  /*** lurl：自動帶入當天日期 -> Cookie、並嘗試刷新 ***/
  const lurlBruteforce = () => {
    const cookieName = getCookieNameFromURL();
    if (!cookieName) return;

    const stopOK = '成功';
    const stopWrong = '錯誤';
    const stopEl = () => $('#back_top > div.container.NEWii_con > section:nth-child(6) > div > div > h2 > span');
    const isStop = () => {
      const el = stopEl();
      const t = el?.textContent || '';
      return t.includes(stopOK) || t.includes(stopWrong);
    };

    const getCookieValue = (name) => {
      const map = Object.fromEntries(document.cookie.split('; ').map(s => s.split('=')));
      return map[name] ?? null;
    };

    const padZero = (num) => (num < 10 ? '0' : '') + num;

    const simulateNextDay = () => {
      if (isStop()) return;
      const raw = getCookieValue(cookieName);
      const cur = parseInt(raw, 10);
      if (Number.isFinite(cur) && cur >= 101 && cur <= 1231) {
        let next = cur + 1;
        if (next % 100 > 31) next = (Math.floor(next / 100) + 1) * 100 + 1;
        const padded = padZero(next);
        document.cookie = `${cookieName}=${padded}; path=/`;
        console.log('目前進度:', padded);
        setTimeout(() => location.reload(), 1000);
      }
    };

    const tryToday = () => {
      if (isStop()) return;
      // 從頁面 login_span 取 yyyy-mm-dd
      const spans = $$('.login_span');
      const txt = spans[1]?.textContent || '';
      const m = txt.match(/(\d{4})-(\d{2})-(\d{2})\s+\d{2}:\d{2}:\d{2}/);
      if (m) {
        const mmdd = `${m[2]}${m[3]}`;
        document.cookie = `${cookieName}=${mmdd}; path=/`;
        location.reload();
      } else {
        console.log('未找到日期資訊，改用 +1 模式。');
        simulateNextDay();
      }
    };

    tryToday();

    /*** 工具：從 URL 取出短碼，組 cookie 名稱 ***/
    function getCookieNameFromURL() {
      const m = location.href.match(/^https:\/\/lurl\.cc\/(\w+)/);
      return m?.[1] ? `psc_${m[1]}` : null;
    }
  };

  /*** 入口 ***/
  const main = async () => {
    injectToastify();

    if (isDcardSex()) {
      bootDcard();
      return;
    }

    if (isLurlOrMyppt()) {
      // 等待 DOM 初步可用
      await sleep(100);

      // 有 <video> => 新播放器 + 影片下載；否則嘗試圖片下載
      const hasVideo = !!$('video');
      if (hasVideo) {
        addVideoDownload();
        upgradePlayer();
      } else {
        addImageDownload();
      }

      // 自動帶入日期 cookie（暴力試）
      lurlBruteforce();
    }
  };

  // 等 document-idle 執行
  main().catch(err => console.error(err));
})();
