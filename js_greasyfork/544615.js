// ==UserScript==
// @name         小说自动翻页
// @version     1.0001
// @description  可设置翻页数。已适配起点小说、小说狂人、自我小说、全本小说、17k小说、纵横小说。暂未适配：刺猬猫、番茄、69书吧、独阅读、百度读书、晋江、有毒、少年梦、不可能文学。陆续添加支持（咕咕咕）。
//
//
// @match        *://www.qidian.com/chapter/*
// @match        *://czbooks.net/n/*
// @match        *://www.uuzw.cc/*
// @match        *://www.quanben-xiaoshuo.com/*
// @match        *://www.quanben.io/n/*
// @match        *://www.17k.com/chapter/*
// @match        *://read.zongheng.com/chapter/*
//
//
//
//
// @match1        *://www.qidiantu.com/booklists/*
// @match1        *://fanqienovel.com/reader/*
// @match1        *://www.ciweimao.com/chapter/*
// @match1        *://www.69shuba.com/txt/*
// @match1        *://dushu.baidu.com/pc/reader?gid=*
// @match1        *://www.cddaoyue.cn/chapter/book_chapter_detail/*
// @match1        *://www.jjwxc.net/onebook.php?novelid=*
// @match1        *://*:1122/*
// @match1        *://github.com/*
// @match1        *://www.google.com/*
// @match1        *://www.youdubook.com/bookread
// @match1        *://www.shaoniandream.com/readchapter/*
// @match1        *://wenxue.bkneng.com/www/book/read/*
//
// @namespace    https://greasyfork.org/users/1171320
// @author       yzcjd
// @author 1      ChatGPT4辅助
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544615/%E5%B0%8F%E8%AF%B4%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/544615/%E5%B0%8F%E8%AF%B4%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ====== 配置项 ======
  const contentSelector = 'main, article, .content, .post, #content, .article, .article-content';
  const includeKeywords = ['下一页', '下页', '下一章', '后页', 'continue', 'next', 'more', '›', '>>'];
  const excludeKeywords = ['首页', '尾页', 'first', 'last', 'top', 'bottom', '1'];
  const defaultPreloadPages = 10;

  let preloadPages = GM_getValue('preloadCount', defaultPreloadPages);
  const loadedURLs = new Set();
  let isLoading = false;
  let lastChapterURL = null;
  let originalTitle = document.title;

  const queue = []; // 明确按顺序推进的队列

  // ====== 菜单 ======
  GM_registerMenuCommand('页数', async () => {
    const val = prompt('预加载页数（建议≤20）：', preloadPages);
    const n = parseInt(val);
    if (n > 0 && n <= 100) {
      GM_setValue('preloadCount', n);
      alert('设置成功，刷新页面生效');
    } else {
      alert('超100！不会崩溃，但还是警告一下。');
    }
  });

  // ====== 工具函数 ======
  const sleep = ms => new Promise(res => setTimeout(res, ms));
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getContentContainer = () => document.querySelector(contentSelector);
  const getScrollRatio = () => (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;

  function isNextPageElement(el) {
    const text = (el.textContent || '').trim().toLowerCase();
    return includeKeywords.some(k => text.includes(k)) &&
           !excludeKeywords.some(k => text.includes(k));
  }

  function findNextPageUrl(doc) {
    const all = Array.from(doc.querySelectorAll('a'));
    for (const a of all) {
      if (a.href && isNextPageElement(a)) {
        return new URL(a.href, location.href).href;
      }
    }
    const match = doc.URL.match(/([?&\/\-_\.](page|p)?[=\/\-_]?)(\d{1,4})(?=[^\d]|$)/i);
    if (match) {
      const prefix = match[1];
      const pageNum = parseInt(match[3]);
      return doc.URL.replace(match[0], prefix + (pageNum + 1));
    }
    return null;
  }

  async function fetchAndInsertPage(url) {
    if (!url || loadedURLs.has(url)) return null;

    try {
      isLoading = true;
      console.log('[FETCH]', url);
      const res = await fetch(url, { credentials: 'include' });
      const html = await res.text();

      const doc = new DOMParser().parseFromString(html, 'text/html');
      const content = doc.querySelector(contentSelector);

      if (content) {
        const wrapper = document.createElement('div');
        wrapper.style.opacity = '0';
        wrapper.style.transition = 'opacity 0.6s';
        wrapper.appendChild(content.cloneNode(true));

        const container = getContentContainer();
        if (container) {
          container.appendChild(document.createElement('hr'));
          container.appendChild(wrapper);
          requestAnimationFrame(() => (wrapper.style.opacity = '1'));
        }

        loadedURLs.add(url);
        lastChapterURL = url;
        document.title = originalTitle;

        return findNextPageUrl(doc);
      } else {
        console.warn('[未找到正文]', url);
      }
    } catch (e) {
      console.warn('[加载失败]', url, e);
    } finally {
      isLoading = false;
    }
    return null;
  }

  // ====== 队列顺序推进加载 ======
  async function processQueue() {
    while (queue.length > 0 && queue.length <= preloadPages && !isLoading) {
      const next = queue[0]; // 只取第一个，保证顺序
      await sleep(rand(1000, 1200));
      const nextUrl = await fetchAndInsertPage(next);
      queue.shift(); // 当前加载完成后移除
      if (nextUrl && !loadedURLs.has(nextUrl)) {
        queue.push(nextUrl); // 按顺序推进
      }
    }
  }

  // ====== 滚动触发检查队列是否需要推进 ======
  function handleScroll() {
    if (getScrollRatio() > 0.9 && queue.length < preloadPages) {
      processQueue();
    }
  }

  // ====== 主程序入口 ======
  async function main() {
    const firstUrl = findNextPageUrl(document);
    if (firstUrl) queue.push(firstUrl);
    window.addEventListener('scroll', handleScroll);
    processQueue();

    window.addEventListener('beforeunload', () => {
      if (lastChapterURL) {
        localStorage.setItem('autopager:lastURL', lastChapterURL);
        console.log('[保存记录]', lastChapterURL);
      }
    });
  }

  main();
})();

