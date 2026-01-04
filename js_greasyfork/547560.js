// ==UserScript==
// @name         Strava GPX→STL (Embed gpxtruder)
// @namespace    https://github.com/qixiaoyu0315/gpxtruder
// @version      1.0.1
// @description  在 Strava 活动/路线页面右下角增加“导出 STL”按钮；自动获取当前页面 GPX，内嵌运行 gpxtruder 完整页面，并把 GPX 作为已选文件传入，保持原有功能不变
// @author       qixiaoyu0315
// @match        https://www.strava.com/activities/*
// @match        https://www.strava.com/routes/*
// @icon         https://www.strava.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547560/Strava%20GPX%E2%86%92STL%20%28Embed%20gpxtruder%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547560/Strava%20GPX%E2%86%92STL%20%28Embed%20gpxtruder%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ====== 可按需修改的配置 =====
  const CDN_BASE = 'https://cdn.jsdelivr.net/gh/qixiaoyu0315/gpxtruder@tag5/';
  const INDEX_HTML_URL = CDN_BASE + 'index.html';

  const MODAL_WIDTH = 'min(1600px, 95vw)';
  const MODAL_HEIGHT = 'min(1020px, 92vh)';

  // ====== 样式与按钮 ======
  GM_addStyle(`
    #gpxtruder-fab {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 999999;
      background: #fc4c02;
      color: #fff;
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 6px 20px rgba(0,0,0,0.25);
      cursor: pointer;
      border: none;
    }
    #gpxtruder-fab:hover { filter: brightness(1.05); }

    #gpxtruder-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      backdrop-filter: blur(1px);
      z-index: 999998;
      display: none;
    }
    #gpxtruder-modal {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      width: ${MODAL_WIDTH};
      height: ${MODAL_HEIGHT};
      z-index: 999999;
      display: none;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.35);
      background: #111;
    }
    #gpxtruder-iframe {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
      background: #111;
    }
    #gpxtruder-close {
      position: absolute;
      top: 8px;
      right: 1500px;
      z-index: 2;
      background: rgba(0,0,0,0.6);
      color: #fff;
      border: 0;
      border-radius: 10px;
      padding: 6px 10px;
      cursor: pointer;
      font-size: 12px;
    }
  `);

  function ensureUI() {
    if (document.getElementById('gpxtruder-fab')) return;

    const fab = document.createElement('button');
    fab.id = 'gpxtruder-fab';
    fab.textContent = '导出 STL';
    fab.title = '从当前 Strava 页面自动抓取 GPX 并生成 STL';
    fab.addEventListener('click', onFabClick);
    document.body.appendChild(fab);

    const backdrop = document.createElement('div');
    backdrop.id = 'gpxtruder-backdrop';
    backdrop.addEventListener('click', closeModal);

    const modal = document.createElement('div');
    modal.id = 'gpxtruder-modal';

    const closeBtn = document.createElement('button');
    closeBtn.id = 'gpxtruder-close';
    closeBtn.textContent = '关闭（Esc）';
    closeBtn.addEventListener('click', closeModal);

    const iframe = document.createElement('iframe');
    iframe.id = 'gpxtruder-iframe';
    iframe.setAttribute('referrerpolicy', 'no-referrer');

    modal.appendChild(closeBtn);
    modal.appendChild(iframe);
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  function openModal() {
    document.getElementById('gpxtruder-backdrop').style.display = 'block';
    document.getElementById('gpxtruder-modal').style.display = 'block';
  }
  function closeModal() {
    document.getElementById('gpxtruder-backdrop').style.display = 'none';
    document.getElementById('gpxtruder-modal').style.display = 'none';
  }

  function buildStravaGpxUrl() {
    const u = new URL(location.href);
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts[0] === 'activities' && parts[1]) {
      return `https://www.strava.com/activities/${parts[1]}/export_gpx`;
    }
    if (parts[0] === 'routes' && parts[1]) {
      return `https://www.strava.com/routes/${parts[1]}/export_gpx`;
    }
    return null;
  }

  function fetchGpxText(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { 'Accept': 'application/gpx+xml,text/xml,*/*;q=0.1' },
        onload: (resp) => {
          if (resp.status >= 200 && resp.status < 300) resolve(resp.responseText);
          else reject(new Error(`GPX 下载失败：HTTP ${resp.status}`));
        },
        onerror: (e) => reject(new Error('GPX 下载失败：网络错误')),
      });
    });
  }

  function fetchIndexHtml() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: INDEX_HTML_URL,
        onload: (resp) => {
          if (resp.status >= 200 && resp.status < 300) {
            let html = resp.responseText || '';

            // 1) 在 <head> 中插入 <base>
            html = html.replace(/<head([^>]*)>/i,
              `<head$1><base href="${CDN_BASE}">`);

            // 2) 替换所有 "js/..." 路径为 CDN_BASE + "js/..."
            html = html.replace(/(['"])(js\/[^'"]+)/g, `$1${CDN_BASE}$2`);

            resolve(html);
          } else {
            reject(new Error(`index.html 获取失败：HTTP ${resp.status}`));
          }
        },
        onerror: () => reject(new Error('index.html 获取失败：网络错误')),
      });
    });
  }

  async function injectGpxIntoIframe(iframe, gpxText) {
    const doc = iframe.contentDocument;
    if (!doc) throw new Error('无法访问 gpxtruder 文档');

    const fileInput = await waitFor(() => {
      return doc.querySelector('input[type="file"]');
    }, 15000, 100);

    if (!fileInput) throw new Error('未找到 gpxtruder 的文件选择控件');

    const file = new File([gpxText], 'strava.gpx', { type: 'application/gpx+xml' });

    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;

    const ev = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(ev);
  }

  function waitFor(getter, timeout = 10000, interval = 50) {
    return new Promise((resolve) => {
      const start = Date.now();
      const t = setInterval(() => {
        let val;
        try { val = getter(); } catch (e) {}
        if (val) { clearInterval(t); resolve(val); }
        else if (Date.now() - start > timeout) { clearInterval(t); resolve(null); }
      }, interval);
    });
  }

  async function onFabClick() {
    try {
      ensureUI();

      const gpxUrl = buildStravaGpxUrl();
      if (!gpxUrl) {
        alert('当前页面无法确定 GPX 导出地址（仅支持活动页 /activities/{id} 或路线页 /routes/{id}）。');
        return;
      }

      const gpxText = await fetchGpxText(gpxUrl);

      openModal();
      const iframe = document.getElementById('gpxtruder-iframe');

      const html = await fetchIndexHtml();
      iframe.srcdoc = html;

      await new Promise((r) => iframe.addEventListener('load', r, { once: true }));

      await injectGpxIntoIframe(iframe, gpxText);

    } catch (err) {
      console.error(err);
      alert('处理失败：' + (err && err.message ? err.message : err));
    }
  }

  ensureUI();
})();
