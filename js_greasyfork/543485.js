// ==UserScript==
// @name         Skillspace Tracker Helper
// @namespace    https://tracker.yandex.ru/
// @version      1.5
// @description  Упрощает интерфейс Yandex Tracker: добавляет кнопки «Моя страница», «Спринт» и «Релизы» в левое меню, удаляет пункт «Все сервисы» и восстанавливает своё меню при SPA-навигации.
// @author       Skillspace
// @match        https://tracker.yandex.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543485/Skillspace%20Tracker%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/543485/Skillspace%20Tracker%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- КОНФИГ ---------- */
  const items = [
    {
      title: 'Моя страница',
      href:  'https://tracker.yandex.ru/',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M12.9823 2.764C12.631 2.49075 12.4553 2.35412 12.2613 2.3016C12.0902 2.25526 11.9098 2.25526 11.7387 2.3016C11.5447 2.35412 11.369 2.49075 11.0177 2.764L4.23539 8.03912C3.78202 8.39175 3.55534 8.56806 3.39203 8.78886C3.24737 8.98444 3.1396 9.20478 3.07403 9.43905C3 9.70352 3 9.9907 3 10.5651V17.8C3 18.9201 3 19.4801 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.0799 21 6.2 21H8.2C8.48003 21 8.62004 21 8.727 20.9455C8.82108 20.8976 8.89757 20.8211 8.9455 20.727C9 20.62 9 20.48 9 20.2V13.6C9 13.0399 9 12.7599 9.10899 12.546C9.20487 12.3578 9.35785 12.2049 9.54601 12.109C9.75992 12 10.0399 12 10.6 12H13.4C13.9601 12 14.2401 12 14.454 12.109C14.6422 12.2049 14.7951 12.3578 14.891 12.546C15 12.7599 15 13.0399 15 13.6V20.2C15 20.48 15 20.62 15.0545 20.727C15.1024 20.8211 15.1789 20.8976 15.273 20.9455C15.38 21 15.52 21 15.8 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4801 21 18.9201 21 17.8V10.5651C21 9.9907 21 9.70352 20.926 9.43905C20.8604 9.20478 20.7526 8.98444 20.608 8.78886C20.4447 8.56806 20.218 8.39175 19.7646 8.03913L12.9823 2.764Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>`
    },
    {
      title: 'Спринт',
      href:  'https://tracker.yandex.ru/agile/board/3',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M9 17.5H3.5M6.5 12H2M9 6.5H4M17 3L10.4036 12.235C10.1116 12.6438 9.96562 12.8481 9.97194 13.0185C9.97744 13.1669 10.0486 13.3051 10.1661 13.3958C10.3011 13.5 10.5522 13.5 11.0546 13.5H16L15 21L21.5964 11.765C21.8884 11.3562 22.0344 11.1519 22.0281 10.9815C22.0226 10.8331 21.9514 10.6949 21.8339 10.6042C21.6989 10.5 21.4478 10.5 20.9454 10.5H16L17 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>`
    },
    {
      title: 'Релизы',
      href:  'https://tracker.yandex.ru/pages/projects/2/gantt',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M12.9996 10.9999L3.49964 20.4999M14.0181 3.53838C15.2361 4.34658 16.4068 5.29941 17.5008 6.3934C18.6042 7.49683 19.564 8.67831 20.3767 9.90766M9.2546 7.89605L6.37973 6.93776C6.04865 6.8274 5.68398 6.89763 5.41756 7.12306L2.56041 9.54065C1.97548 10.0356 2.14166 10.9775 2.86064 11.2424L5.56784 12.2398M11.6807 18.3524L12.6781 21.0596C12.943 21.7786 13.8849 21.9448 14.3798 21.3599L16.7974 18.5027C17.0228 18.2363 17.0931 17.8716 16.9827 17.5405L16.0244 14.6657M19.3482 2.27063L14.4418 3.08838C13.9119 3.17668 13.426 3.43709 13.0591 3.82932L6.446 10.8985C4.73185 12.7308 4.77953 15.5924 6.55378 17.3667C8.32803 19.1409 11.1896 19.1886 13.022 17.4744L20.0911 10.8614C20.4834 10.4944 20.7438 10.0085 20.8321 9.47869L21.6498 4.57222C21.8754 3.21858 20.7019 2.04503 19.3482 2.27063Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>`
    }
  ];
  /* ---------------------------- */

  const LIST_CONTAINER_PARENT =
    '.gn-composite-bar.gn-composite-bar_subheader .g-list__items';
  const LIST_CONTAINER =
    '.gn-composite-bar.gn-composite-bar_subheader .g-list__items div';

  /* ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---------- */
  const build = ({ title, href, icon }) => {
    const li = document.createElement('div');
    li.role = 'listitem';
    li.className = 'g-list__item gn-composite-bar__root-menu-item';
    li.style.height = '40px';

    const wrap = document.createElement('div');
    wrap.className = 'g-list__item-content';

    const btn = document.createElement('button');
    btn.className = 'gn-composite-bar-item gn-composite-bar-item_type_regular';

    const go = e => {
      const newTab = e.ctrlKey || e.metaKey || e.button === 1;
      if (newTab) {
        window.open(href, '_blank');
      } else {
        location.href = href;
      }
    };
    btn.addEventListener('click', go);
    btn.addEventListener('auxclick', go); // middle-click

    const iBox = document.createElement('div');
    iBox.className = 'gn-composite-bar-item__icon-place';
    iBox.innerHTML = icon.trim();

    const tBox = document.createElement('div');
    tBox.className = 'gn-composite-bar-item__title';
    tBox.title = title;

    const tTxt = document.createElement('div');
    tTxt.className = 'gn-composite-bar-item__title-text';
    tTxt.textContent = title;

    tBox.appendChild(tTxt);
    btn.append(iBox, tBox);
    wrap.appendChild(btn);
    li.appendChild(wrap);

    return li;
  };

  const removeParentHeight = parent => {
    if (parent && !parent.dataset.heightCleared) {
      parent.style.removeProperty('height');
      parent.dataset.heightCleared = '1';
    }
  };

  const removeAllServicesItem = () => {
    // ищем элементы, в тексте которых есть «Все сервисы» и удаляем их
    document.querySelectorAll('[role="listitem"], .g-list__item, .listitem').forEach(el => {
      if (el.textContent.includes('Все сервисы')) el.remove();
    });
  };

  const inject = () => {
    const container = document.querySelector(LIST_CONTAINER);
    const parent = document.querySelector(LIST_CONTAINER_PARENT);
    if (!container || !parent) return;

    if (!container.dataset.extraInjected) {
      items.forEach(item => container.appendChild(build(item))); // в конец списка
      container.dataset.extraInjected = '1';
    }

    removeParentHeight(parent);
    removeAllServicesItem();
  };

  /* ---------- ИНИЦИАЛИЗАЦИЯ И OBSERVER ---------- */
  window.addEventListener('load', inject);

  const observer = new MutationObserver(inject);
  observer.observe(document.body, { childList: true, subtree: true });
})();