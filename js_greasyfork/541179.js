// ==UserScript==
// @name         JAVDB 女优作品信息采集器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  采集 JAVDB 女优详情页全部作品信息，导出为 TXT
// @match        https://javdb.com/actors/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT     
// @downloadURL https://update.greasyfork.org/scripts/541179/JAVDB%20%E5%A5%B3%E4%BC%98%E4%BD%9C%E5%93%81%E4%BF%A1%E6%81%AF%E9%87%87%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541179/JAVDB%20%E5%A5%B3%E4%BC%98%E4%BD%9C%E5%93%81%E4%BF%A1%E6%81%AF%E9%87%87%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  function cleanText(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  function removeMinutes(text) {
    return text.replace(/\s*分鍾$/, '').trim();
  }

  function removeRatingOrDirector(line) {
    return /評分[:：]|導演[:：]/.test(line) ? null : line;
  }

  function formatActors(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  function removeFinalLinesAfterActors(lines) {
    const actorIndex = lines.findIndex(line => /[♀♂]$/.test(line));
    if (actorIndex >= 0) return lines.slice(0, actorIndex + 1);
    return lines;
  }

  async function fetchAllWorks() {
    const works = [];
    let page = 1;
    while (true) {
      const url = `${location.pathname}?page=${page}`;
      const res = await fetch(url);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const list = doc.querySelectorAll('.movie-list .item a.box');
      if (list.length === 0) break;
      list.forEach(el => works.push(el.href));
      page++;
      await sleep(1000);
    }
    return works;
  }

  async function fetchDetail(url) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: res => {
          const doc = new DOMParser().parseFromString(res.responseText, 'text/html');

          // 优先取隐藏原始标题 span.origin-title，没有则用 strong.current-title
          let originTitleElem = doc.querySelector('span.origin-title');
          let originTitle = originTitleElem ? cleanText(originTitleElem.textContent) : '';
          if (!originTitle) {
            const currentTitleElem = doc.querySelector('strong.current-title');
            originTitle = currentTitleElem ? cleanText(currentTitleElem.textContent) : '';
          }

          const blocks = [...doc.querySelectorAll('.panel-block')]
            .map(div => cleanText(div.textContent))
            .filter(removeRatingOrDirector);

          if (blocks.length > 1) blocks[1] = removeMinutes(blocks[1]);

          const lastIndex = blocks.length - 1;
          blocks[lastIndex] = formatActors(blocks[lastIndex]);

          const result = removeFinalLinesAfterActors([originTitle, ...blocks]);

          resolve(result.join('\n'));
        },
        onerror: () => resolve(null),
        ontimeout: () => resolve(null)
      });
    });
  }

  async function startExport() {
    const urls = await fetchAllWorks();
    const allText = [];
    for (let i = 0; i < urls.length; i++) {
      console.log(`正在采集 ${i + 1}/${urls.length}: ${urls[i]}`);
      const text = await fetchDetail(urls[i]);
      if (text) allText.push(text);
      await sleep(1000);
    }
    const blob = new Blob([allText.join('\n\n')], { type: 'text/plain' });
    const filename = `javdb_export_${new Date().toISOString().replace(/[:T]/g, '-').split('.')[0]}.txt`;
    GM_download({
      url: URL.createObjectURL(blob),
      name: filename,
      saveAs: true
    });
  }

  function addButton() {
    const btn = document.createElement('button');
    btn.textContent = '采集所有作品为TXT';
    btn.style.position = 'fixed';
    btn.style.top = '100px';
    btn.style.right = '20px';
    btn.style.zIndex = 9999;
    btn.style.padding = '10px';
    btn.style.backgroundColor = '#4CAF50';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.onclick = startExport;
    document.body.appendChild(btn);
  }

  addButton();
})();
