// ==UserScript==
// @name         [0]JAV本地视频匹配
// @version      1.1
// @author       GPT-5
// @description  匹配本地视频文件名并标记 JavBus / JavLibrary 页面
// @license      MIT
// @icon         https://www.javbus.com/favicon.ico
// @namespace    https://greasyfork.org/users/439255
// @match        *://*.javbus.com/*
// @match        *://*.javlibrary.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/545165/%5B0%5DJAV%E6%9C%AC%E5%9C%B0%E8%A7%86%E9%A2%91%E5%8C%B9%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/545165/%5B0%5DJAV%E6%9C%AC%E5%9C%B0%E8%A7%86%E9%A2%91%E5%8C%B9%E9%85%8D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.__VM_JAV_LOCAL_VIDEO_MATCH_INITED) return;
  window.__VM_JAV_LOCAL_VIDEO_MATCH_INITED = true;

  const STORAGE_KEY = 'movieCodes';
  let movieCodeSet = new Set();

  function addStyle(cssText) {
    if (typeof GM_addStyle === 'function') {
      GM_addStyle(cssText);
    } else {
      const style = document.createElement('style');
      style.textContent = cssText;
      document.head.appendChild(style);
    }
  }

  addStyle(`
.vm-marked { outline: 3px solid #e74c3c !important; }
.vm-highlight { background-color: gold !important; }
.vm-floating-btn {
  position: fixed; bottom: 12px; left: 12px; z-index: 999999;
  border: 1px solid #ccc; padding: 6px 10px; cursor: pointer; border-radius: 6px;
  background: #fff; color: #333; box-shadow: 0 2px 8px rgba(0,0,0,.15);
}
`);

  const storage = {
    async get(key) {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          const result = await new Promise((resolve) => {
            try {
              chrome.storage.local.get([key], (items) => resolve(items || {}));
            } catch (err) {
              resolve({});
            }
          });
          const value = result[key];
          return Array.isArray(value) ? value : [];
        }
      } catch (e) { /* ignore */ }
      try {
        if (typeof GM !== 'undefined' && typeof GM.getValue === 'function') {
          return await GM.getValue(key, []);
        }
      } catch (e) { /* ignore */ }
      try {
        const str = localStorage.getItem(key);
        return str ? JSON.parse(str) : [];
      } catch (e) { return []; }
    },
    async set(key, value) {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          await new Promise((resolve) => {
            try {
              chrome.storage.local.set({ [key]: value }, () => resolve());
            } catch (err) {
              resolve();
            }
          });
          return;
        }
      } catch (e) { /* ignore */ }
      try {
        if (typeof GM !== 'undefined' && typeof GM.setValue === 'function') {
          return await GM.setValue(key, value);
        }
      } catch (e) { /* ignore */ }
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  function debounce(fn, wait) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function normalizeCode(raw) {
    if (!raw) return '';
    let s = String(raw).trim().toUpperCase().replace(/\s+/g, '');

    // 统一 FC2 形态
    let m = s.match(/^FC2(?:-PPV)?[-_]?(\d{3,8})$/i);
    if (m) return `FC2-PPV-${m[1]}`.toUpperCase();

    // 无连字符的常见形态 ABP123 -> ABP-123, CAWD123 -> CAWD-123
    m = s.match(/^([A-Z]{2,}\d*)(\d{2,6})$/);
    if (m && !s.includes('-')) return `${m[1]}-${m[2]}`;

    return s;
  }

  function extractMovieCode(filename) {
    if (!filename) return '';
    let name = String(filename)
      .trim()
      .replace(/^hhd800\.com@/i, '')
      .replace(/\.(mp4|mkv|avi|wmv|mov|flv|ts|m4v|webm|iso|rmvb)$/i, '')
      .replace(/[\[\(【（].*?[\]\)】）]/g, '')
      .replace(/[_\s]+/g, '-')
      .replace(/-C$/i, '')
      .replace(/-?uncensored|中文字幕?|中字|英字|国配|big5|srt|subrip|sub/ig, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    // FC2-PPV
    let m = name.match(/^FC2[-_ ]?(?:PPV)?[-_ ]?(\d{3,8})/i);
    if (m) return `FC2-PPV-${m[1]}`.toUpperCase();

    // 常见字母(可带尾数字)-数字，如 ABP-123、IPX-999、T28-123；
    // 放宽尾缀：只要数字后跟的不是数字（允许字母、符号或行尾，如 -4K、A、-UHD 等）
    m = name.match(/^([a-zA-Z]{2,}\d*)[-_ ]?(\d{2,6})(?=$|[^0-9])/);
    if (m) return `${m[1]}-${m[2]}`.toUpperCase();

    // 无连字符：ABP123, CAWD123；同样只要数字后不是数字即可
    m = name.match(/^([a-zA-Z]{2,}\d*)(\d{2,6})(?=$|[^0-9])/);
    if (m) return `${m[1]}-${m[2]}`.toUpperCase();

    return '';
  }

  function extractCodeFromJavBusUrl(urlLike) {
    try {
      const u = new URL(urlLike, location.href);
      const last = u.pathname.split('/') .filter(Boolean) .pop();
      return last ? last.toUpperCase() : '';
    } catch (e) {
      return '';
    }
  }

  async function loadCodes() {
    const arr = await storage.get(STORAGE_KEY);
    movieCodeSet = new Set(Array.isArray(arr) ? arr.map(v => String(v).toUpperCase()) : []);
  }

  async function saveCodes(arr) {
    const unique = Array.from(new Set(arr.map(v => String(v).toUpperCase())));
    await storage.set(STORAGE_KEY, unique);
    movieCodeSet = new Set(unique);
  }

  async function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = String(event.target.result || '');
        const codes = content.split(/\r?\n/)
          .map(line => line.trim())
          .filter(Boolean)
          .map(extractMovieCode)
          .filter(Boolean);
        resolve(codes);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  }

  async function openFilePicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (file) {
        const movieCodes = await readFile(file);
        await saveCodes(movieCodes);
        console.log(`成功导入 ${movieCodes.length} 条番号`);
        markPage();
      }
      input.remove();
    };
    input.click();
  }

  function installUI() {
    if (document.getElementById('vm-import-btn')) return;
    const button = document.createElement('button');
    button.id = 'vm-import-btn';
    button.textContent = '仓';
    button.className = 'vm-floating-btn';
    button.title = '导入番号TXT';
    button.addEventListener('click', openFilePicker);
    (document.body || document.documentElement).appendChild(button);

    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('导入番号TXT', openFilePicker);
      GM_registerMenuCommand('清空已导入番号', async () => {
        await saveCodes([]);
        alert('已清空');
        markPage();
      });
    }
  }

  function markJavBus() {
    // 列表卡片
    document.querySelectorAll('#waterfall .movie-box').forEach((ele) => {
      const href = ele.getAttribute('href') || (ele.href || '');
      const code = extractCodeFromJavBusUrl(href);
      if (code && movieCodeSet.has(code)) {
        ele.classList.add('vm-marked');
      }
    });

    // 详情页高亮
    const code = extractCodeFromJavBusUrl(location.href);
    if (code && movieCodeSet.has(code)) {
      const details = document.querySelector('div.row.movie');
      if (details) details.classList.add('vm-highlight');
    }
  }

  function markJavLibrary() {
    document.querySelectorAll('.video').forEach((ele) => {
      const idElement = ele.querySelector('.id');
      if (!idElement) return;
      const raw = (idElement.textContent || '').trim();
      const code = normalizeCode(raw);
      if (code && movieCodeSet.has(code)) {
        ele.classList.add('vm-marked');
      }
    });
  }

  function markPage() {
    if (!movieCodeSet || movieCodeSet.size === 0) return;
    const host = location.hostname;
    if (host.includes('javbus')) {
      markJavBus();
    } else if (host.includes('javlibrary')) {
      markJavLibrary();
    }
  }

  async function init() {
    installUI();
    await loadCodes();
    markPage();

    const debouncedMarkPage = debounce(markPage, 250);
    const observer = new MutationObserver(debouncedMarkPage);
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    window.addEventListener('pagehide', () => observer.disconnect(), { once: true });

    window.addEventListener('popstate', markPage);
    window.addEventListener('hashchange', markPage);
    document.addEventListener('pageshow', markPage);
  }

  init();
})();