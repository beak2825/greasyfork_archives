// ==UserScript==
// @name         Flicksbar - free KinoPoisk (fixed)
// @namespace    https://t.me/flicksbar
// @version      2.0.0
// @description  Кнопка "Смотреть бесплатно" на страницах фильма/сериала КиноПоиска
// @author       @flicksbar - Telegram (patch)
// @match        https://www.kinopoisk.ru/series/*
// @match        https://www.kinopoisk.ru/film/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440866/Flicksbar%20-%20free%20KinoPoisk%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440866/Flicksbar%20-%20free%20KinoPoisk%20%28fixed%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getKpId() {
    // /film/1097907/  или /series/12345/
    const m = location.pathname.match(/^\/(film|series)\/(\d+)\//);
    return m ? m[2] : null;
  }

  function addButton() {
    if (document.getElementById('flicksbar-btn')) return;

    const kpId = getKpId();
    if (!kpId) return;

    const endUrl = `https://flcksbr.lat/film/${kpId}`;

    const btn = document.createElement('button');
    btn.id = 'flicksbar-btn';
    btn.type = 'button';
    btn.textContent = 'Смотреть бесплатно';

    btn.style.cssText = [
      'position:fixed',
      'right:30px',
      'bottom:30px',
      'z-index:9999999',
      'background-color:#f60',
      'color:#fff',
      'border:0',
      'border-radius:4.4px',
      'height:44px',
      'padding:9px 15px 9px 38px',
      'font-family:Graphik Kinopoisk LC Web,Arial,Tahoma,Verdana,sans-serif',
      'font-size:13px',
      'font-weight:500',
      'cursor:pointer',
      'background-repeat:no-repeat',
      'background-position:15px 13px',
      'background-size:18px'
    ].join(';');

    btn.style.backgroundImage =
      'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\' fill=\'%23fff\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M3 1.3v9.4L10.311 6z\'/%3E%3C/svg%3E")';

    btn.addEventListener('click', () => {
      window.open(endUrl, '_blank', 'noopener,noreferrer');
    });

    document.body.appendChild(btn);
  }

  // Запуск когда DOM готов (и на всякий случай — если уже готов)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addButton, { once: true });
  } else {
    addButton();
  }
})();
