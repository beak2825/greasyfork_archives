// ==UserScript==
// @name         Re-Library FB2: Export Single Chapter
// @namespace    https://re-library.com/
// @version      1.31
// @description  Экспорт текущей главы в FB2 (только <section>; без шапки). Фильтрация мусора, починка юникода.
// @match        https://re-library.com/translations/*/volume-*/chapter-*/*
// @match        https://re-library.com/translations/*/chapter-*/*
// @match        https://re-library.com/translations/*/volume-*/chapter-*
// @match        https://re-library.com/translations/*/chapter-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546123/Re-Library%20FB2%3A%20Export%20Single%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/546123/Re-Library%20FB2%3A%20Export%20Single%20Chapter.meta.js
// ==/UserScript==

(() => {
  'use strict';
  if (document.getElementById('fb2-export-btn')) return;

  const entry = document.querySelector('.entry-content');
  const h1 = document.querySelector('h1.entry-title');
  if (!entry || !h1) return;

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

    const stop = container.querySelector('.navigation'); // может и не быть
    for (const p of container.querySelectorAll('p')) {
      if (stop) {
        const rel = p.compareDocumentPosition(stop);
        // если stop уже НЕ "после" p — значит мы прошли границу
        if (!(rel & Node.DOCUMENT_POSITION_FOLLOWING)) break;
      }
      const t = (p.textContent || '').trim();
      if (!t) continue;
      // фильтр мусора по тексту
      if (/^leave a comment$/i.test(t)) continue;
      if (/^link here$/i.test(t)) continue;
      if (/donation to this page helps/i.test(t)) continue;
      if (/support your favorite translation groups/i.test(t)) continue;
      paras.push(`<p>${sanitizeText(t)}</p>`);
    }
    return paras;
  }

  function buildSection() {
    const title = sanitizeText(h1.textContent || '');
    const body = extractParagraphs(entry).join('\n');
    return `<section>\n<title><p>${title}</p></title>\n${body}\n</section>`;
  }

  function download(text, name) {
    const blob = new Blob([text], { type: 'application/xml;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  const btn = document.createElement('button');
  btn.id = 'fb2-export-btn';
  btn.textContent = 'Экспорт FB2';
  btn.style.cssText = 'margin:10px 0;padding:6px 12px;font-weight:600;';

  btn.onclick = () => {
    const section = buildSection();
    const safe = (h1.textContent || 'chapter').replace(/[^\w\d\-]+/g, '_').slice(0, 120);
    download(section, `${safe}.fb2`);
  };

  h1.parentNode.insertBefore(btn, h1.nextSibling);
})();
