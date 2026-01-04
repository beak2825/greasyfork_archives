// ==UserScript==
// @name         ChatGPT Bulk Chat Remover (2025 DOM, FULLY WORKING)
// @namespace    https://chat.openai.com
// @version      2.0
// @description  Массовое удаление чатов: автопрокрутка, выбор, чекбоксы, удаление, индикатор, логи. Полностью рабочий DOM май 2025!
// @author       GPT, user fixes
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538409/ChatGPT%20Bulk%20Chat%20Remover%20%282025%20DOM%2C%20FULLY%20WORKING%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538409/ChatGPT%20Bulk%20Chat%20Remover%20%282025%20DOM%2C%20FULLY%20WORKING%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const EXCLUDED_CHATS = [
    'Правила игры в тринку',
    'Ответственность при повреждении машины',
  ].map((s) => s.toLowerCase());

  // сюда запишем токен, когда он впервые встретится в headers
  window.__GPT_ACCESS_TOKEN = null;

  // запомним оригинальный fetch
  const ___origFetch = window.fetch;

  // перехватываем
  window.fetch = async function (resource, config) {
    // если в конфиге есть заголовок Authorization — достанем оттуда токен
    if (config && config.headers && config.headers.Authorization) {
      const m = config.headers.Authorization.match(/Bearer\s+(.+)/i);
      if (m) {
        window.__GPT_ACCESS_TOKEN = m[1];
        console.log('🗝️ Захвачен GPT access token:', window.__GPT_ACCESS_TOKEN);
      }
    }
    // далее отдадим выполнение штатному fetch
    return ___origFetch.call(this, resource, config);
  };

  let UI_ADDED = false;

  /** Utility */
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Индикатор статуса */
  function createOrUpdateStatus(text) {
    let status = document.querySelector('#gpt-bulk-status');
    if (!status) {
      status = document.createElement('div');
      status.id = 'gpt-bulk-status';
      status.style.marginTop = '6px';
      status.style.fontStyle = 'italic';
      status.style.color = '#169800';
      status.style.fontWeight = 'bold';
      document.body.prepend(status);
    }
    status.textContent = text;
    return status;
  }

  /** Основной блок навигации */
  function waitForSidebar() {
    const interval = setInterval(() => {
      console.log('🔍 Поиск <nav.group/scrollport>...');
      const navBlock = document.querySelector(
        'nav.group\\/scrollport, nav.group\\/scrollport.relative'
      );
      if (navBlock) {
        console.log('✅ Найден nav-блок:', navBlock);
      } else {
        console.warn('❌ nav-блок не найден');
      }
      if (navBlock && !UI_ADDED) {
        UI_ADDED = true;
        addUI(navBlock);
        clearInterval(interval);
      }
    }, 1000);
  }

  /** UI-меню */
  function addUI(container) {
    const wrapper = document.createElement('div');
    wrapper.style.padding = '10px';
    wrapper.style.margin = '10px 0 10px 0';
    wrapper.style.background = '#f2f2f2';
    wrapper.style.border = '1px solid #ccc';
    wrapper.style.borderRadius = '5px';
    wrapper.style.fontSize = '14px';
    wrapper.style.display = 'flex';
    wrapper.style.gap = '6px';

    const scrollBtn = document.createElement('button');
    scrollBtn.textContent = '📜 Прокрутити всі чати';
    scrollBtn.onclick = scrollToBottom;

    const selectBtn = document.createElement('button');
    selectBtn.textContent = '✅ Виділити всі';
    selectBtn.onclick = () => {
      document.querySelectorAll('.gpt-chat-checkbox').forEach((cb) => {
        const link = cb.closest('a[draggable="true"]');
        // Находим текст заголовка внутри <a>
        const titleEl = link.querySelector('.truncate');
        const title = titleEl?.textContent.trim().toLowerCase() || '';

        cb.checked = !EXCLUDED_CHATS.includes(title);
      });
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑 Видалити обрані';
    deleteBtn.onclick = deleteSelectedChats;

    wrapper.appendChild(scrollBtn);
    wrapper.appendChild(selectBtn);
    wrapper.appendChild(deleteBtn);

    container.prepend(wrapper);

    // Статус под меню
    const status = document.createElement('div');
    status.id = 'gpt-bulk-status';
    status.style.marginTop = '6px';
    status.style.fontStyle = 'italic';
    status.style.color = '#169800';
    status.style.fontWeight = 'bold';
    container.prepend(status);
  }

  /** Прокрутка */
  async function scrollToBottom() {
    const scrollable = document.querySelector(
      'nav.group\\/scrollport, nav.group\\/scrollport.relative'
    );
    if (!scrollable) return;

    const status = createOrUpdateStatus('⏳ Завантаження...');
    let prevHeight = 0;
    let sameCount = 0;

    for (let i = 0; i < 50 && sameCount < 5; i++) {
      scrollable.scrollTo({ top: scrollable.scrollHeight, behavior: 'smooth' });
      await wait(500);

      const newHeight = scrollable.scrollHeight;
      if (newHeight === prevHeight) sameCount++;
      else sameCount = 0;

      prevHeight = newHeight;
    }

    addCheckboxes();
    status.textContent = '✅ Усі чати завантажено!';
  }

  /** Чекбоксы */
  function addCheckboxes() {
    const chatLinks = document.querySelectorAll(
      'aside[aria-labelledby] a[draggable="true"]'
    );
    chatLinks.forEach((link) => {
      // пропускаем, если чекбокс уже есть
      if (link.querySelector('.gpt-chat-checkbox')) return;

      // создаём чекбокс
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'gpt-chat-checkbox';
      checkbox.style.marginRight = '5px';

      // Останавливаем всплытие, чтобы клик по чекбоксу не кликал сам <a>
      checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        // больше ничего не останавливаем — дефолтное действие (переключение) остаётся
      });

      // вставляем перед ссылкой
      link.prepend(checkbox);
    });
  }

  /** Удаление чатов */
  async function deleteSelectedChats() {
    const selected = document.querySelectorAll('.gpt-chat-checkbox:checked');
    if (!selected.length) return alert('❗ Оберіть чати для видалення');
    if (!confirm(`Видалити ${selected.length} чат(и)?`)) return;

    createOrUpdateStatus('⏳ Видалення...');
    let countDeleted = 0;

    for (const cb of selected) {
      // 1. Находим ссылку и вытаскиваем ID
      const link = cb.closest('a[draggable="true"]');
      if (!link) {
        console.warn('❌ Не нашли <a> для чекбокса', cb);
        continue;
      }
      const href = link.getAttribute('href') || '';
      const m = href.match(/\/c\/([a-f0-9\-]+)/);
      if (!m) {
        console.warn('❌ Не смогли распарсить ID из', href);
        continue;
      }
      const id = m[1];

      // берём токен, который мы уже «поймали»
      const token = window.__GPT_ACCESS_TOKEN;
      if (!token) {
        console.error(
          '❌ Токен ещё не захвачен — сначала выполните в UI любое действие, вызывающее fetch с Authorization.'
        );
        alert(
          'Токен ещё не получен. Сначала откройте любое меню удаления вручную, чтобы скрипт успел перехватить fetch.'
        );
        return;
      }

      console.log('🗑 Удаляем (PATCH) conversation:', id);

      try {
        const res = await fetch(`/backend-api/conversation/${id}`, {
          method: 'PATCH',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_visible: false }),
        });
        if (res.ok) {
          console.log(`✅ Удалён ${id}`);
          countDeleted++;
        } else {
          console.warn(`⚠️ Ошибка ${res.status}`, await res.text());
        }
      } catch (err) {
        console.error('❌ Fetch failed for', id, err);
      }
    }

    createOrUpdateStatus(`✅ Видалено ${countDeleted} чат(и)!`);
    alert('✅ Видалення завершено!');
  }

  console.log('🚀 Скрипт Tampermonkey запущен');
  waitForSidebar();
})();
