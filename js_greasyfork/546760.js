// ==UserScript==
// @name         Таймер контроля за просрочками ГС/ЗГС (ЖБ на игроков и лидеорв)
// @version      1.2.1
// @author       Kostya_Belik
// @license      MIT
// @description  Контроль за сроками рассмотрения жалоб, работает на ПК и мобильной версии форума
// @match        https://forum.blackrussia.online/forums/Жалобы-на-лидеров.272/*
// @match        https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.272/*
// @match        https://forum.blackrussia.online/forums/Жалобы-на-игроков.273/*
// @match        https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.273/*
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @namespace    https://forum.blackrussia.online
// @downloadURL https://update.greasyfork.org/scripts/546760/%D0%A2%D0%B0%D0%B9%D0%BC%D0%B5%D1%80%20%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8F%20%D0%B7%D0%B0%20%D0%BF%D1%80%D0%BE%D1%81%D1%80%D0%BE%D1%87%D0%BA%D0%B0%D0%BC%D0%B8%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%28%D0%96%D0%91%20%D0%BD%D0%B0%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2%20%D0%B8%20%D0%BB%D0%B8%D0%B4%D0%B5%D0%BE%D1%80%D0%B2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546760/%D0%A2%D0%B0%D0%B9%D0%BC%D0%B5%D1%80%20%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8F%20%D0%B7%D0%B0%20%D0%BF%D1%80%D0%BE%D1%81%D1%80%D0%BE%D1%87%D0%BA%D0%B0%D0%BC%D0%B8%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%28%D0%96%D0%91%20%D0%BD%D0%B0%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2%20%D0%B8%20%D0%BB%D0%B8%D0%B4%D0%B5%D0%BE%D1%80%D0%B2%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const EXPIRE_HOURS = 48;
  const EXPIRE_MS = EXPIRE_HOURS * 60 * 60 * 1000;

  const WATCHED_PREFIXES = [
    'Главному администратору',
    'Специальному администратору',
    'На рассмотрении',
    'Ожидание'
  ];

  const toInt = (v) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  };

  const formatRemaining = (ms) => {
    const totalMin = Math.floor(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return h + 'ч ' + (m < 10 ? '0' + m : m) + 'м';
  };

  // --- определяем, мобильная версия или ПК ---
  const isMobile = !!document.querySelector('.p-body-inner--mobile') || /Mobi|Android/i.test(navigator.userAgent);

  const SELECTORS = {
    thread: '.structItem.structItem--thread',
    label: '.label',
    title: '.structItem-title',
    startDateTime: '.structItem-startDate time[data-time], .structItem-startDate time, time[data-time]'
  };

  function getCreatedAtMs(item) {
    if (item.dataset.createdAt) return parseInt(item.dataset.createdAt, 10);

    const startTimeEl = item.querySelector(SELECTORS.startDateTime);
    if (!startTimeEl) return null;

    const raw = startTimeEl.getAttribute('data-time') || startTimeEl.getAttribute('datetime');
    const stamp = raw ? toInt(raw) : null;
    if (!stamp) return null;

    const ms = stamp < 1e12 ? stamp * 1000 : stamp;
    item.dataset.createdAt = ms;
    return ms;
  }

  function ensureBadge(item) {
    let badge = item.querySelector('.br-deadline-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'br-deadline-badge';
      badge.style.cssText =
        'font-size:13px;margin-left:8px;padding:2px 8px;border-radius:12px;font-weight:700;';
      const titleEl = item.querySelector(SELECTORS.title);
      if (titleEl) titleEl.appendChild(badge);
    }
    return badge;
  }

  function updateItem(item) {
    if (!item || !item.classList || !item.classList.contains('structItem--thread')) return;

    const prefixEl = item.querySelector(SELECTORS.label);
    if (!prefixEl) return;
    const prefix = (prefixEl.textContent || '').trim();
    if (!WATCHED_PREFIXES.includes(prefix)) return;

    const createdAtMs = getCreatedAtMs(item);
    if (!createdAtMs) return;

    const deadline = createdAtMs + EXPIRE_MS;
    const remainingMs = deadline - Date.now();

    const badge = ensureBadge(item);
    if (!badge) return;

    if (remainingMs > 0) {
      badge.textContent = ' Осталось: ' + formatRemaining(remainingMs);
      badge.style.backgroundColor = '#198754';
      badge.style.color = '#FFFFFF';
      item.classList.remove('br-expired');
    } else {
      badge.textContent = ' Просрочка';
      badge.style.backgroundColor = '#dc3545';
      badge.style.color = '#FFFFFF';
      item.classList.add('br-expired');
    }
  }

  function scanList(container) {
    const items = container.querySelectorAll(SELECTORS.thread);
    items.forEach(updateItem);
  }

  function refreshBadges() {
    document.querySelectorAll('.br-deadline-badge').forEach(badge => {
      const item = badge.closest(SELECTORS.thread);
      if (item) updateItem(item);
    });
  }

  function injectStyles() {
    if (document.getElementById('br-deadline-style')) return;
    const style = document.createElement('style');
    style.id = 'br-deadline-style';
    style.textContent = `
      .br-expired { background: #ffeaea !important; }
      .br-expired .structItem-title a { color: #b30000 !important; }
    `;
    document.head.appendChild(style);
  }

  function boot() {
    injectStyles();

    const listContainer = document.querySelector('.structItemContainer') || document.body;
    scanList(listContainer);

    const obs = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.classList.contains('structItem--thread')) {
            updateItem(node);
          }
        });
      });
    });
    obs.observe(listContainer, { childList: true });

    setInterval(refreshBadges, 60 * 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
