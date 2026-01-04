// ==UserScript==
// @name         Zhihu Answer Downloader
// @namespace    https://tampermonkey.net/
// @version      0.2
// @description  在用户资料页添加“下载10条回答”，自己主页/他人主页都适用。
// @match        https://www.zhihu.com/people/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539091/Zhihu%20Answer%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/539091/Zhihu%20Answer%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ========== 通用工具 ========== */
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const downloadTxt = (name, content) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /* ========== 抓取回答并下载 ========== */
  async function grabFirst10Answers() {
    const btn = document.getElementById('zhihu-dl-btn');
    btn.disabled = true;
    btn.innerText = '准备中…';

    /* 1. 向下滚动直到 ≥10 条回答或最多滚 20 次 */
    let tries = 0;
    while (document.querySelectorAll('div.List-item').length < 10 && tries < 20) {
      window.scrollBy(0, window.innerHeight);
      await sleep(800);
      tries++;
    }

    /* 2. 展开「阅读全文」 */
    const readMore = Array.from(document.querySelectorAll('button.Button--plain'))
      .filter(b => /阅读全文/.test(b.innerText))
      .slice(0, 10);

    for (const b of readMore) {
      b.click();
      await sleep(400);
    }

    /* 3. 组装 TXT */
    const items = Array.from(document.querySelectorAll('div.List-item')).slice(0, 10);
    const txt = items.map((it, i) => {
      const q = it.querySelector('a.QuestionItem-title, a[data-za-detail-view-element_name="Title"]')?.innerText.trim()
             || `Question ${i + 1}`;
      const a = it.querySelector('span.RichText')?.innerText.trim().replace(/\s+\n/g, '\n') || '';
      return `Q${i + 1}: ${q}\nA${i + 1}: ${a}\n\n`;
    }).join('');

    /* 4. 下载 */
    downloadTxt('zhihu_answers.txt', txt);
    btn.innerText = '已下载';
  }

  /* ========== 插入按钮 ========== */
  function insertButton() {
    if (document.getElementById('zhihu-dl-btn')) return;          // 已插入

    // ① 先找「关注」按钮
    let anchor = Array.from(document.querySelectorAll('button'))
      .find(b => /关注(他|她)?$/.test(b.textContent.trim()));

    // ② 若无，再找「编辑个人资料」/「编辑资料」
    if (!anchor) {
      anchor = Array.from(document.querySelectorAll('button'))
        .find(b => /编辑.*资料/.test(b.textContent.trim()));
    }

    // ③ 再不行，就放到 .ProfileHeader-operation 容器里
    if (!anchor) {
      anchor = document.querySelector('.ProfileHeader-operation');
      if (!anchor) return;      // 还没渲染出来，先退出
    }

    // 构造下载按钮
    const dlBtn = document.createElement('button');
    dlBtn.id = 'zhihu-dl-btn';
    dlBtn.className = 'Button Button--primary Button--blue';  // 跟知乎原生按钮保持一致
    dlBtn.style.marginLeft = '8px';
    dlBtn.textContent = '下载10条回答';
    dlBtn.onclick = grabFirst10Answers;

    // 插入
    if (anchor.parentNode.classList.contains('ProfileHeader-operation')) {
      // anchor 是容器
      anchor.appendChild(dlBtn);
    } else {
      anchor.parentNode.insertBefore(dlBtn, anchor.nextSibling);
    }
  }

  /* ========== 监听页面变化，路由切换也能保持 ========== */
  const obs = new MutationObserver(insertButton);
  obs.observe(document.body, { childList: true, subtree: true });
  insertButton();    // 首次执行
})();
