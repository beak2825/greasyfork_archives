// ==UserScript==
// @name         Facebook Post Stat
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Сбор статистики постов
// @match        https://www.facebook.com/groups/244391556668107/post_insights/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/539593/Facebook%20Post%20Stat.user.js
// @updateURL https://update.greasyfork.org/scripts/539593/Facebook%20Post%20Stat.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const btn = document.createElement('button');
  btn.textContent = 'КОПИРОВАТЬ СТАТИСТИКУ';
  Object.assign(btn.style, {
    position: 'fixed',
    top: '50px',
    left: '0',
    width: '220px',
    padding: '12px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    zIndex: '9999',
    fontSize: '14px'
  });
  document.body.appendChild(btn);

  function flashOK() {
    btn.style.background = '#28a745';
    btn.textContent = '✅ СКОПИРОВАНО!';
    setTimeout(() => {
      btn.style.background = '#007bff';
      btn.textContent = 'КОПИРОВАТЬ СТАТИСТИКУ';
    }, 1200);
  }

  function findClassicValue(label) {
    const spans = Array.from(document.querySelectorAll('span'));
    const labelSpan = spans.find(s => s.innerText.trim() === label);
    if (labelSpan) {
      const block = labelSpan.closest('div')?.parentElement?.parentElement;
      if (block) {
        const numbers = Array.from(block.querySelectorAll('span, div'))
          .map(el => el.textContent.trim())
          .filter(text => /^\d+/.test(text) && text !== label);
        return numbers[0] || '-';
      }
    }
    return '-';
  }

  function findViewValue() {
    const labels = ['Просмотры фото', 'Просмотры видео'];
    const containers = Array.from(document.querySelectorAll('div'));
    for (let container of containers) {
      const text = container.innerText?.trim();
      if (!text) continue;
      if (labels.some(label => text.includes(label))) {
        let next = container.nextElementSibling;
        while (next && next.tagName !== 'DIV') {
          next = next.nextElementSibling;
        }
        if (next) {
          const num = next.innerText.match(/\d+/);
          if (num) return num[0];
        }
      }
    }
    return '-';
  }

  btn.addEventListener('click', () => {
    const link = window.location.href.split('?')[0];
    const interaction = findClassicValue('Взаимодействие с публикацией');
    const reach = findClassicValue('Охват людей');
    const views = findViewValue();

    // Формат: одна строка, табы
    const output = `${link}\t${interaction}\t${reach}\t${views}`;
    GM_setClipboard(output);
    flashOK();
  });

})();