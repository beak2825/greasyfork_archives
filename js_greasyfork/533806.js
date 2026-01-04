// ==UserScript==
// @license MIT
// @name         arXiv Affiliation Highlighter (并发+进度条版)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在页面上的 arXiv 链接旁自动标注论文机构列表（并发8个+进度条）
// @author       Zezhou Wang
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      arxiv.org
// @connect      api.openai.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.min.js
// @downloadURL https://update.greasyfork.org/scripts/533806/arXiv%20Affiliation%20Highlighter%20%28%E5%B9%B6%E5%8F%91%2B%E8%BF%9B%E5%BA%A6%E6%9D%A1%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533806/arXiv%20Affiliation%20Highlighter%20%28%E5%B9%B6%E5%8F%91%2B%E8%BF%9B%E5%BA%A6%E6%9D%A1%E7%89%88%29.meta.js
// ==/UserScript==

;(async function() {
  'use strict';

  let OPENAI_API_KEY = GM_getValue('OPENAI_API_KEY', '');
  if (!OPENAI_API_KEY) {
    OPENAI_API_KEY = prompt('Please enter your OpenAI API Key:');
    if (OPENAI_API_KEY) {
      GM_setValue('OPENAI_API_KEY', OPENAI_API_KEY);
    } else {
      alert('No OpenAI API Key provided — script will stop.');
      return;
    }
  }
  const MODEL = 'gpt-4o-mini';
  const CACHE_KEY = 'arxivAffCache';
  const CACHE_TTL = 1000 * 60 * 60 * 24 * 365;

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.worker.min.js';
  GM_registerMenuCommand('🗑 清空 arXiv 机构缓存', () => {
    GM_setValue(CACHE_KEY, {});
    alert('已清空 arXiv 机构缓存');
  });

  let cache = GM_getValue(CACHE_KEY, {});
  const links = Array.from(
    document.querySelectorAll('a[href*="arxiv.org/abs/"], a[href*="arxiv.org/pdf/"]')
  );

  if (links.length === 0) return;

  // —— 添加进度条 —— //
  const progressBar = createProgressBar();
  updateProgressBar(0, links.length);

  let completed = 0;

  const tasks = links.map(link => async () => {
    const id = extractArxivId(link.href);
    if (!id) {
      incrementProgress();
      return;
    }
    let title = id;
    try {
      title = await fetchTitle(id);
    } catch (e) {
      // 忽略标题抓取失败
    }
    try {
      const entry = cache[id];
      if (entry && Date.now() - entry.ts < CACHE_TTL) {
        annotate(link, entry.affs);
      } else {
        const affs = await fetchAndAnnotate(id);
        annotate(link, affs);
        cache[id] = { affs, ts: Date.now() };
        GM_setValue(CACHE_KEY, cache);
      }
      incrementProgress();
    } catch (err) {
      console.error(err);
      alert('处理 arXiv ID ' + id + ' 时发生错误：\n' + err.message);
      removeProgressBar();
      throw err;
    }
  });

  try {
    await runTasksWithConcurrency(tasks, 8);
  } catch (e) {
    console.error('脚本执行中止：', e);
    // 错误时 progress bar 已经移除
  }
  removeProgressBar();

  // —— 辅助函数 —— //

  function extractArxivId(url) {
    const m = url.match(/arxiv\.org\/(?:abs|pdf)\/([\d\.v]+)/);
    return m ? m[1] : null;
  }

  function gmFetchText(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'text',
        onload: res => res.status === 200 ? resolve(res.response) : reject(new Error(`HTTP ${res.status}`)),
        onerror: () => reject(new Error('Network error')),
      });
    });
  }

  async function fetchTitle(id) {
    const html = await gmFetchText(`https://arxiv.org/abs/${id}`);
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const h1 = doc.querySelector('h1.title');
    if (h1) {
      return h1.textContent.replace(/^Title:\s*/i, '').trim();
    }
    const ti = doc.querySelector('title');
    if (ti) {
      const m = ti.textContent.match(/^(.+?)\s*\|/);
      if (m) return m[1].trim();
      return ti.textContent.trim();
    }
    return id;
  }

  async function fetchAndAnnotate(id) {
    const buffer = await gmFetchPdf(`https://arxiv.org/pdf/${id}.pdf`);
    const txt = await extractFirstPageText(buffer);
    return await gmOpenAIExtractAffs(txt);
  }

  function gmFetchPdf(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'arraybuffer',
        onload: res =>
          res.status === 200 ? resolve(res.response) : reject(new Error(`PDF 下载失败：${res.status}`)),
        onerror: () => reject(new Error('PDF 下载错误')),
      });
    });
  }

  async function extractFirstPageText(buffer) {
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const page = await pdf.getPage(1);
    const content = await page.getTextContent();
    return content.items.map(i => i.str).join(' ');
  }

  function gmOpenAIExtractAffs(text) {
    const prompt = `
Here is an example to illustrate the desired output format:

Example input (paper first page snippet):
"Alice is from Tsinghua University; Bob is from Peking University; Carol is also from Tsinghua University."

Example output (one institution per line):
Tsinghua University
Peking University

Now please:
1) Extract all author affiliations from the first page text below.
2) Output one affiliation per line, with no numbering or extra commentary.
3) Ensure each institution appears only once (deduplication will also be applied in the script).

First page text:
${text}

Please start listing the affiliations, one per line:`;

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        data: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0,
        }),
        responseType: 'json',
        onload: res => {
          if (res.status === 200) {
            try {
              const lines = res.response.choices[0].message.content
                .split('\n')
                .map(l => l.trim())
                .filter(l => l);
              resolve(Array.from(new Set(lines)));
            } catch {
              reject(new Error('Failed to parse GPT response'));
            }
          } else {
            reject(new Error(`OpenAI request failed: ${res.status}`));
          }
        },
        onerror: () => reject(new Error('Network error during OpenAI request')),
      });
    });
  }

  function annotate(linkEl, affs) {
    if (!affs || !affs.length) return;
    const span = document.createElement('span');
    span.textContent = affs.join(', ');
    span.style.cssText = `
      background: #fffbdd;
      color: #333;
      padding: 2px 4px;
      margin-left: 6px;
      border-radius: 3px;
      font-size: 90%;
      font-family: sans-serif;
    `;
    linkEl.after(span);
  }

  async function runTasksWithConcurrency(tasks, concurrency) {
    const executing = new Set();
    for (const task of tasks) {
      const p = task();
      executing.add(p);
      const clean = () => executing.delete(p);
      p.then(clean).catch(err => {
        executing.delete(p);
        throw err;
      });
      if (executing.size >= concurrency) {
        await Promise.race(executing);
      }
    }
    await Promise.all(executing);
  }

  // —— 进度条相关 —— //
  function createProgressBar() {
    const bar = document.createElement('div');
    bar.id = 'arxiv-aff-progress';
    bar.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 9999;
      font-family: sans-serif;
    `;
    document.body.appendChild(bar);
    return bar;
  }

  function updateProgressBar(done, total) {
    const bar = document.getElementById('arxiv-aff-progress');
    if (bar) {
      bar.textContent = `🔄 处理中：${done} / ${total}`;
    }
  }

  function incrementProgress() {
    completed++;
    updateProgressBar(completed, links.length);
  }

  function removeProgressBar() {
    const bar = document.getElementById('arxiv-aff-progress');
    if (bar) {
      bar.remove();
    }
  }

})();
