// ==UserScript==
// @name         Re-Library FB2: Bulk Export Novel
// @namespace    https://re-library.com/
// @version      1.31
// @description  Экспорт диапазона глав в один FB2 (с шапкой). Починка выборки, юникода.
// @match        https://re-library.com/translations/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546125/Re-Library%20FB2%3A%20Bulk%20Export%20Novel.user.js
// @updateURL https://update.greasyfork.org/scripts/546125/Re-Library%20FB2%3A%20Bulk%20Export%20Novel.meta.js
// ==/UserScript==

(() => {
  'use strict';
  if (document.getElementById('fb2-export-panel')) return;

  const h1 = document.querySelector('h1.entry-title');
  const entry = document.querySelector('.entry-content');
  if (!h1 || !entry) return;

  const novelTitle = (h1.textContent || '').trim();
  const novelDesc = (() => {
    // краткая аннотация: первые 1–3 абзаца страницы романа
    const ps = [...entry.querySelectorAll('p')].slice(0, 3).map(p => p.textContent.trim()).filter(Boolean);
    return ps.join('\n\n');
  })();

  // собираем ссылки на главы только из TOC; отфильтровываем соц.шеры и якоря
  const chapterLinks = [...entry.querySelectorAll('a[href*="/chapter-"]')]
    .map(a => a.href.split('#')[0])
    .filter(href => !href.includes('?share='))
    .filter((v, i, arr) => arr.indexOf(v) === i); // уникальные

  if (chapterLinks.length === 0) return;

  // ==== UI ====
  const panel = document.createElement('div');
  panel.id = 'fb2-export-panel';
  panel.style.cssText = 'margin:12px 0;padding:12px;border:1px solid #ddd;border-radius:8px;';

  const fromSel = document.createElement('select');
  const toSel = document.createElement('select');
  fromSel.style.marginRight = '8px';
  toSel.style.marginRight = '8px';

  chapterLinks.forEach((url, i) => {
    const label = url.replace(/\/$/, '').split('/').pop();
    const o1 = new Option(`#${i + 1} ${label}`, String(i));
    const o2 = new Option(`#${i + 1} ${label}`, String(i));
    fromSel.add(o1);
    toSel.add(o2);
  });
  toSel.selectedIndex = chapterLinks.length - 1;

  const btn = document.createElement('button');
  btn.textContent = 'Экспорт FB2 (диапазон)';
  btn.style.cssText = 'padding:6px 12px;font-weight:600;';

  const barWrap = document.createElement('div');
  barWrap.style.cssText = 'margin-top:10px;';
  const bar = document.createElement('div');
  bar.style.cssText = 'height:10px;background:#eee;border-radius:6px;overflow:hidden;';
  const fill = document.createElement('div');
  fill.style.cssText = 'height:100%;width:0%;transition:width .25s;';
  bar.appendChild(fill);
  const status = document.createElement('div');
  status.style.cssText = 'margin-top:6px;font-size:12px;opacity:.85;';
  barWrap.append(bar, status);

  panel.append('С главы: ', fromSel, ' по: ', toSel, ' ', btn, barWrap);
  h1.parentNode.insertBefore(panel, h1.nextSibling);

  // ==== helpers ====
  function sanitizeText(s) {
    return (s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
      .replace(/……/g, '......')
      .replace(/…/g, '...')
      .replace(/[–—]/g, '-')
      .replace(/[“”«»]/g, '"')
      .replace(/\u00A0/g, ' ')
      .replace(/[\u2000-\u200B]/g, ' ')
      .replace(/\s+\n/g, '\n')
      .trim();
  }

  function cleanContainer(root) {
    const junkSel = [
      '.navigation', '.sharedaddy', '.heateor_sss_sharing_container',
      '.wpulike', '.wpdiscuz', '.comments-area', '#comments',
      '.comment-respond', 'form.comment-form', '.sd-sharing', '.tags-links',
      'script', 'style', 'iframe', 'ins', 'nav', 'aside'
    ].join(',');
    root.querySelectorAll(junkSel).forEach(n => n.remove());
  }

  function extractParagraphs(container) {
    const paras = [];
    cleanContainer(container);

    const stop = container.querySelector('.navigation');
    for (const p of container.querySelectorAll('p')) {
      if (stop) {
        const rel = p.compareDocumentPosition(stop);
        if (!(rel & Node.DOCUMENT_POSITION_FOLLOWING)) break; // дошли до/после навигации — стоп
      }
      const t = (p.textContent || '').trim();
      if (!t) continue;
      if (/^leave a comment$/i.test(t)) continue;
      if (/^link here$/i.test(t)) continue;
      if (/donation to this page helps/i.test(t)) continue;
      if (/support your favorite translation groups/i.test(t)) continue;
      paras.push(`<p>${sanitizeText(t)}</p>`);
    }
    return paras;
  }

  async function fetchChapter(url) {
    const res = await fetch(url, { credentials: 'same-origin' });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const h = doc.querySelector('h1.entry-title');
    const cont = doc.querySelector('.entry-content');
    if (!h || !cont) return { title: url, section: '' };

    const title = (h.textContent || '').trim();
    const body = extractParagraphs(cont).join('\n');
    const section = `<section>\n<title><p>${sanitizeText(title)}</p></title>\n${body}\n</section>`;
    return { title, section };
  }

  function updateProgress(i, total, label) {
    const pct = Math.round(((i) / total) * 100);
    fill.style.width = pct + '%';
    status.textContent = `${i}/${total} — ${label || ''}`;
  }

  function buildFB2(sections) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0">
  <description>
    <title-info>
      <book-title>${sanitizeText(novelTitle)}</book-title>
      ${novelDesc ? `<annotation><p>${sanitizeText(novelDesc)}</p></annotation>` : ''}
    </title-info>
  </description>
  <body>
${sections.join('\n')}
  </body>
</FictionBook>`;
  }

  function download(text, name) {
    const blob = new Blob([text], { type: 'application/xml;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  // ==== export ====
  btn.onclick = async () => {
    const from = Math.min(+fromSel.value, +toSel.value);
    const to = Math.max(+fromSel.value, +toSel.value);
    const list = chapterLinks.slice(from, to + 1);

    const sections = [];
    for (let i = 0; i < list.length; i++) {
      try {
        const { title, section } = await fetchChapter(list[i]);
        updateProgress(i + 1, list.length, title);
        if (section) sections.push(section);
      } catch (e) {
        console.error('Fetch failed:', list[i], e);
        updateProgress(i + 1, list.length, 'Ошибка загрузки');
      }
    }

    const fb2 = buildFB2(sections);
    const safe = novelTitle.replace(/[^\w\d\-]+/g, '_').slice(0, 100);
    download(fb2, `${safe} (${from + 1}-${to + 1}).fb2`);
  };
})();
