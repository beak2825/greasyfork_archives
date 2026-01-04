// ==UserScript==
// @name         Ptt抓圖仔-高效版(2025)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  自動按domain分組批量下載圖片
// @author       You
// @match       https://www.ptt.cc/bbs/*
// @match       *://*.imgur.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_download
// @connect      *

// @downloadURL https://update.greasyfork.org/scripts/430823/Ptt%E6%8A%93%E5%9C%96%E4%BB%94-%E9%AB%98%E6%95%88%E7%89%88%282025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/430823/Ptt%E6%8A%93%E5%9C%96%E4%BB%94-%E9%AB%98%E6%95%88%E7%89%88%282025%29.meta.js
// ==/UserScript==

const imageMap = new Map();

// 1. 收集圖片並分組
document.querySelectorAll("a[href*='.jpg'], a[href*='.png'], a[href*='.jpeg']").forEach(a => {
  try {
    const url = new URL(a.href);
    const domain = `${url.protocol}//${url.host}/`;

    if (!imageMap.has(domain)) {
      imageMap.set(domain, []);
    }
    imageMap.get(domain).push(url.href);
  } catch {}
});

// 2. 下載控制器
async function downloadAll() {
  for (const [domain, urls] of imageMap) {
    console.log(`處理domain: ${domain}`);
    await downloadBatch(urls);
  }
}

// 3. 批量下載同domain圖片
async function downloadBatch(urls) {
  const DELAY = 1000; // 每個請求間隔

  for (const url of urls) {
    try {
      const filename = url.split('/').pop();
      await new Promise(resolve => {
        GM_download({ url, name: filename, onload: resolve, onerror: resolve });
      });
      await new Promise(r => setTimeout(r, DELAY));
    } catch (e) {
      console.error(`下載失敗: ${url}`, e);
    }
  }
}

// 4. 綁定熱鍵
document.addEventListener('keydown', (e) => {
  if (e.key === 'F8') downloadAll();
});