// ==UserScript==
// @name         MAGADAN | ГС / ЗГС ОПГ .»
// @namespace    Azimut Elemental
// @version      2.0
// @description  Короткие кнопки сразу после «Модер.» в верхнем меню форума
// @author       Azimut Elemental
// @match        https://forum.blackrussia.online/*
// @run-at       document-end
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546069/MAGADAN%20%7C%20%D0%93%D0%A1%20%20%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93%20%C2%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/546069/MAGADAN%20%7C%20%D0%93%D0%A1%20%20%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93%20%C2%BB.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Короткие названия + все нужные ссылки
  const LINKS = [
    { t: 'Адм',   h: 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3930/' },
    { t: 'Игрок', h: 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3932/' },
    { t: 'Лид',   h: 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3931/' },
    { t: 'Обж',   h: 'https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.3933/' },
    { t: 'Отчет', h: 'https://forum.blackrussia.online/threads/magadan-%D0%95%D0%B6%D0%B5%D0%B4%D0%BD%D0%B5%D0%B2%D0%BD%D0%B0%D1%8F-%D0%BE%D1%82%D1%87%D0%B5%D1%82%D0%BD%D0%BE%D1%81%D1%82%D1%8C-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.13257543/' },
    { t: 'Неакт', h: 'https://forum.blackrussia.online/threads/magadan-%D0%97%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D0%BD%D0%B5%D0%B0%D0%BA%D1%82%D0%B8%D0%B2.13257570/' },
    { t: 'Анти',  h: 'https://forum.blackrussia.online/threads/magadan-%D0%90%D0%BD%D1%82%D0%B8-%D0%91%D0%BB%D0%B0%D1%82-biz-war-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%B0.11556354/page-69#post-55347660' },
    { t: 'Собр',  h: 'https://forum.blackrussia.online/threads/magadan-%D0%97%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D0%BF%D1%80%D0%BE%D0%BF%D1%83%D1%81%D0%BA-%D0%B5%D0%B6%D0%B5%D0%BD%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B3%D0%BE-%D1%81%D0%BE%D0%B1%D1%80%D0%B0%D0%BD%D0%B8%D1%8F.12936089/' },
    { t: 'Снятие',h: 'https://forum.blackrussia.online/threads/magadan-%D0%97%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D1%81%D0%BD%D1%8F%D1%82%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.12936200/' },
    { t: 'Баллы', h: 'https://forum.blackrussia.online/threads/magadan-%D0%97%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%BC%D0%B5%D0%BD-%D0%B1%D0%B0%D0%BB%D0%BB%D0%BE%D0%B2-%D0%B8%D0%B7-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B0.13257557/' }
  ];

  // Стили — минимально, чтобы на мобиле выглядело ровно и не ломало тему форума
  GM_addStyle(`
    .az-nav-item .p-navEl-link { padding: 0 10px; }
    .az-nav-item .p-navEl-text { white-space: nowrap; font-weight: 600; }
    @media (max-width: 768px){
      .az-nav-item .p-navEl-link { padding: 0 8px; }
      .az-nav-item .p-navEl-text { font-weight: 600; }
    }
  `);

  const SEL_NAV_LISTS = [
    '.p-nav .p-nav-scroller .p-nav-list',   // обычный XF2
    '.p-nav .p-nav-list',                    // запасной
    'nav .p-nav-list'                        // ещё один вариант
  ];

  function getNavList() {
    for (const sel of SEL_NAV_LISTS) {
      const list = document.querySelector(sel);
      if (list) return list;
    }
    return null;
  }

  function findModerLi(navList) {
    if (!navList) return null;
    const items = navList.querySelectorAll('li');
    for (const li of items) {
      const a = li.querySelector('a');
      if (!a) continue;
      const txt = (a.textContent || '').trim();
      if (txt.includes('Модер')) return li;
    }
    return null;
  }

  function alreadyInjected(navList) {
    return !!(navList && navList.querySelector('.az-nav-item'));
  }

  function createLi(text, href) {
    const li = document.createElement('li');
    li.className = 'p-navEl az-nav-item';
    const a = document.createElement('a');
    a.className = 'p-navEl-link';
    a.href = href;
    a.setAttribute('data-nav-id', 'az-' + Math.random().toString(36).slice(2));
    const span = document.createElement('span');
    span.className = 'p-navEl-text';
    span.textContent = text;
    a.appendChild(span);
    li.appendChild(a);
    return li;
  }

  function inject() {
    const navList = getNavList();
    if (!navList) return;

    // если уже есть — выходим (предотвращаем дубли при ajax-переходах)
    if (alreadyInjected(navList)) return;

    // ищем «Модер.»
    const moderLi = findModerLi(navList);

    // создаём все наши пункты
    const nodes = LINKS.map(l => createLi(l.t, l.h));

    if (moderLi && moderLi.parentElement === navList) {
      // вставляем строго после «Модер.»
      let ref = moderLi;
      nodes.forEach(node => {
        ref.insertAdjacentElement('afterend', node);
        ref = node;
      });
    } else {
      // если «Модер.» нет (или не нашли) — просто в конец верхнего меню
      nodes.forEach(node => navList.appendChild(node));
    }
  }

  // 1) пробуем сразу
  inject();

  // 2) наблюдаем за изменениями (форум часто перерисовывает шапку ajax’ом)
  const obs = new MutationObserver(() => {
    const navList = getNavList();
    if (!navList) return;
    if (!alreadyInjected(navList)) inject();
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });

  // 3) периодическая подстраховка
  setInterval(inject, 1500);
})();
