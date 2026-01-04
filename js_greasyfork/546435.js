// ==UserScript==
// @name         ТП Город
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Кнопка «Город» → POST-запрос на action_form.php без всплывающего окна
// @author       You
// @match        https://asteriagame.com/main_frame.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546435/%D0%A2%D0%9F%20%D0%93%D0%BE%D1%80%D0%BE%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/546435/%D0%A2%D0%9F%20%D0%93%D0%BE%D1%80%D0%BE%D0%B4.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ----------  НАСТРОЙКИ  ---------- */
  const CONFIG = {
    artifact_id: 71030190,
    no_confirm: 1,
    opener_success_function:
      "frames['main_frame'].frames['main'].frames['user_iframe'].updateCurrentIframe();",
    window_reload: 0,
    url_close: 'user.php?mode=personage&group=1&update_swf=1'
  };
  /* --------------------------------- */

  // CSS кнопки
  const style = document.createElement('style');
  style.textContent = `
    #tm-city-btn {
      position: fixed;
      top: 1px;
      left: 265px;
      z-index: 10000;
      padding: 1px 1px;
      background: #2ecc71;
      color: #fff;
      font-weight: bold;
      border: 2px solid #ffeb3b;  /* жёлтая рамка */
      border-radius: 1px;
      cursor: pointer;
      transition: background .2s;
    }
    #tm-pomestie-btn:hover {
      background: #27ae60;
  `;
  document.head.appendChild(style);

  // Кнопка
  const btn = document.createElement('button');
  btn.id = 'tm-city-btn';
  btn.textContent = 'Город';
  btn.addEventListener('click', () => {
    const url = `https://asteriagame.com/action_form.php?${Math.random()}&no_confirm=${CONFIG.no_confirm}&artifact_id=${CONFIG.artifact_id}`;

    const body = new URLSearchParams({
      'in[param_success][opener_success_function]': CONFIG.opener_success_function,
      'in[param_success][window_reload]': CONFIG.window_reload,
      'in[param_success][url_close]': CONFIG.url_close
    });

    fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    })
      .then(r => r.text())
      .then(txt => {
        console.groupCollapsed('[Город] Ответ сервера');
        console.log(txt);
        console.groupEnd();
      })
      .catch(err => console.error('Ошибка отправки:', err));
  });

  document.body.appendChild(btn);
})();