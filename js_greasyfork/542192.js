// ==UserScript==
// @name         Rmine: автоподстановка 0 в «Трудозатраты»
// @namespace    https://rmine.net/
// @version      1.4
// @description  Ставит 0 в поле #time_entry_hours на страницах /issues/*, кроме указанных ID. Управление исключениями через меню Tampermonkey.
// @match        https://rmine.net/issues/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/542192/Rmine%3A%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%BE%D0%B4%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0%200%20%D0%B2%20%C2%AB%D0%A2%D1%80%D1%83%D0%B4%D0%BE%D0%B7%D0%B0%D1%82%D1%80%D0%B0%D1%82%D1%8B%C2%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/542192/Rmine%3A%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%BE%D0%B4%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0%200%20%D0%B2%20%C2%AB%D0%A2%D1%80%D1%83%D0%B4%D0%BE%D0%B7%D0%B0%D1%82%D1%80%D0%B0%D1%82%D1%8B%C2%BB.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'rmine_skip_issue_ids';

  const getSkipIds = () =>
    (GM_getValue(STORAGE_KEY, '') || '')
      .split(',')
      .map(s => Number(s.trim()))
      .filter(Boolean);

  const saveSkipIds = (ids) => GM_setValue(STORAGE_KEY, ids.join(','));

  const showEditPrompt = () => {
    const current = getSkipIds().join(', ');
    const input = prompt(
      'Введите ID задач через запятую, на которых НЕ нужно подставлять 0:',
      current
    );
    if (input !== null) {
      const ids = input
        .split(',')
        .map(s => Number(s.trim()))
        .filter(Boolean);
      saveSkipIds(ids);
      alert('Сохранено: ' + ids.join(', '));
      console.log('[rmine-0] Новый список исключений:', ids);
    }
  };

  // 🧩 Пункт в меню Tampermonkey
  GM_registerMenuCommand('🛠️ Настроить исключения (ID задач)', showEditPrompt);

  const issueMatch = location.pathname.match(/\/issues\/(\d+)/);
  if (!issueMatch) {
    console.log('[rmine-0] Не страница задачи.');
    return;
  }

  const issueId = Number(issueMatch[1]);
  const skipIds = getSkipIds();

  console.log('[rmine-0] ID задачи:', issueId);
  console.log('[rmine-0] Исключения:', skipIds);

  if (skipIds.includes(issueId)) {
    console.log('[rmine-0] Эта задача в списке исключений — ничего не делаем.');
    return;
  }

  const putZeroIfNeeded = (input) => {
    if (!input) {
      console.log('[rmine-0] Поле не найдено.');
      return;
    }
    console.log('[rmine-0] Найдено поле #time_entry_hours:', input);

    if (input.value === '') {
      input.value = '0';
      input.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('[rmine-0] Установлено значение: 0');
    } else {
      console.log('[rmine-0] Значение уже есть:', input.value);
    }
  };

  const tryNow = () => {
    const input = document.querySelector('#time_entry_hours');
    if (input) putZeroIfNeeded(input);
  };

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (node.id === 'time_entry_hours') {
          console.log('[rmine-0] Поле добавлено напрямую как #time_entry_hours');
          putZeroIfNeeded(node);
        } else {
          const input = node.querySelector?.('#time_entry_hours');
          if (input) {
            console.log('[rmine-0] Найден #time_entry_hours внутри добавленного узла');
            putZeroIfNeeded(input);
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('load', () => {
    tryNow(); // может быть уже отрисовано
  });
})();
