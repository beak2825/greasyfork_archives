// ==UserScript==
// @name         CreativeNovels — Export Chapter FB2 (section only)
// @version      1.01
// @description  Экспорт FB2: только section, без заголовков XML/FictionBook
// @match        *://creativenovels.com/*
// @grant        none
// @namespace https://example.local
// @downloadURL https://update.greasyfork.org/scripts/546126/CreativeNovels%20%E2%80%94%20Export%20Chapter%20FB2%20%28section%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546126/CreativeNovels%20%E2%80%94%20Export%20Chapter%20FB2%20%28section%20only%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (document.getElementById('fb2-export-wrapper')) return;

  const content = document.querySelector('.entry-content, .post-content, .novel-content, #content');
  if (!content) return; // если это не страница главы

  function xmlEscape(s) {
    if (!s) return '';
    return s.replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;')
            .replace(/'/g,'&apos;');
  }

  function sanitizeNode(node) {
    const allowed = new Set(['P','BR','EM','I','STRONG','B','SUP','SUB','SPAN']);
    const clone = node.cloneNode(true);
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT, null, false);
    const toRemove = [];
    while (walker.nextNode()) {
      const n = walker.currentNode;
      const tn = n.tagName.toUpperCase();
      if (['SCRIPT','STYLE','NOSCRIPT','IFRAME'].includes(tn)) { toRemove.push(n); continue; }
      if (!allowed.has(tn)) {
        const parent = n.parentNode;
        while (n.firstChild) parent.insertBefore(n.firstChild, n);
        parent.removeChild(n);
      } else {
        const attrs = Array.from(n.attributes || []);
        for (const a of attrs) n.removeAttribute(a.name);
      }
    }
    toRemove.forEach(n => n.remove());
    return clone;
  }

  function getChapterNumberFromText(text) {
    const match = text.match(/chapter\s*(\d+)/i) || text.match(/\b(\d{1,4})\b/);
    if (match && match[1]) {
      return String(match[1]).padStart(3, '0');
    }
    return null;
  }

  function buildSection() {
    const hTitle = (document.querySelector('h1')?.textContent.trim()) || document.title;
    const clean = sanitizeNode(content);
    const paragraphs = [];
    clean.childNodes.forEach(n => {
      const txt = n.textContent.trim();
      if (txt) paragraphs.push(`<p>${xmlEscape(txt)}</p>`);
    });
    return `<section>\n<title><p>${xmlEscape(hTitle)}</p></title>\n${paragraphs.join('\n')}\n</section>`;
  }

  function download(content, name) {
    const blob = new Blob([content], {type:'application/xml;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 5000);
  }

  // создаём кнопку
  const wrap = document.createElement('div');
  wrap.id = 'fb2-export-wrapper';
  wrap.style.margin = '8px 0';
  const btn = document.createElement('button');
  btn.textContent = 'Экспорт FB2';
  btn.style.padding = '6px 10px';
  btn.style.cursor = 'pointer';

  btn.onclick = () => {
    const section = buildSection();
    const chapterNum = getChapterNumberFromText(document.title) || '000';
    const bookTitle = document.title.replace(/\s+—.*$/,'').trim();
    download(section, `${bookTitle} — Глава ${chapterNum}.fb2`);
  };

  wrap.appendChild(btn);
  content.parentNode.insertBefore(wrap, content);

})();
