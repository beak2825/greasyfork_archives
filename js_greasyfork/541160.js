// ==UserScript==
// @name         LOFTER合集一键导出txt文档
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  基于真实文章链接选择器，自动滚动+关键词筛选+导出txt
// @match        *://*.lofter.com/view*
// @grant        none
// @license MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/541160/LOFTER%E5%90%88%E9%9B%86%E4%B8%80%E9%94%AE%E5%AF%BC%E5%87%BAtxt%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/541160/LOFTER%E5%90%88%E9%9B%86%E4%B8%80%E9%94%AE%E5%AF%BC%E5%87%BAtxt%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  const $ = window.jQuery;

  const delay = ms => new Promise(r => setTimeout(r, ms));

  async function autoScroll(maxAttempts = 40, interval = 1500) {
    let lastCount = 0, stableCount = 0;
    for(let i = 0; i < maxAttempts; i++) {
      window.scrollTo(0, document.body.scrollHeight);
      await delay(interval);
      const count = $("a[href*='/post/']").length;
      if(count === lastCount) {
        stableCount++;
        if(stableCount >= 3) break;
      } else {
        stableCount = 0;
        lastCount = count;
      }
    }
    return lastCount;
  }

  function extractArticles() {
    const articles = [];
    $("a[href*='/post/']").each(function(){
      const url = $(this).attr("href");
      let title = $(this).text().replace(/\s+/g, " ").trim();
      if(url && title) {
        articles.push({url, title});
      }
    });
    return [...new Map(articles.map(a => [a.url, a])).values()];
  }

  async function fetchContent(url) {
    try {
      const html = await $.get(url);
      const doc = new DOMParser().parseFromString(html, "text/html");
      const selectors = [".post-text", ".text", ".post-content", ".article-desc", ".article-content", ".ct", ".m-post"];
      let content = "";
      for(const sel of selectors) {
        const elems = doc.querySelectorAll(sel);
        if(elems.length) {
          content = Array.from(elems).map(e => e.textContent.trim()).join("\n\n");
          if(content.length > 30) break;
        }
      }
      return content || "";
    } catch(e) {
      console.warn("抓取正文失败:", url, e);
      return "";
    }
  }

  function exportTxt(data,keyword) {
    data.sort((a,b) => 0); 
    data.reverse();
    let text = "";
    data.forEach(item => {
      text += item.content.trim() + "\n\n---------------------------------\n\n";
    });
    const blob = new Blob([text], {type:"text/plain;charset=utf-8"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = keyword ? `lofter_${keyword}.txt` : "lofter_文章导出.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function injectButton() {
    const btn = $('<button style="position:fixed;top:15px;right:15px;z-index:999999;padding:10px;background:#1e90ff;color:#fff;border:none;border-radius:6px;cursor:pointer;">输入文章标题并导出</button>');
    $("body").append(btn);
    btn.on("click", async () => {
      const keyword = prompt("请输入关键词（留空导出全部）：") || "";
      btn.text("自动滚动加载中...");
      const totalCount = await autoScroll();
      btn.text(`加载到${totalCount}篇文章，开始抓正文...`);
      const articles = extractArticles();
      const results = [];
      for(let i=0; i<articles.length; i++) {
        btn.text(`抓取正文 ${i+1}/${articles.length} ...`);
        const content = await fetchContent(articles[i].url);
        if(keyword === "" || content.includes(keyword) || articles[i].title.includes(keyword)) {
          results.push({...articles[i], content});
        }
        await delay(800);
      }
      btn.text(`完成，匹配${results.length}篇，导出中...`);
      exportTxt(results,keyword);
      btn.text("输入文章标题并导出");
      alert(`导出完成，共导出${results.length}篇文章`);
    });
  }

  $(window).on("load", () => setTimeout(injectButton, 2000));
})();
