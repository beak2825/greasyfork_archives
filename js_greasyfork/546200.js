// ==UserScript==
// @name         Элик поиска АВТО
// @namespace    http://tampermonkey.net/
// @version      1.1
// @match        https://asteriagame.com/main_frame.php
// @grant        none
// @description автопитьё эликсира поиска Синий
// @downloadURL https://update.greasyfork.org/scripts/546200/%D0%AD%D0%BB%D0%B8%D0%BA%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%20%D0%90%D0%92%D0%A2%D0%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/546200/%D0%AD%D0%BB%D0%B8%D0%BA%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%20%D0%90%D0%92%D0%A2%D0%9E.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const CFG = {
    artifact_id: 68139974,
    no_confirm: 1,
    opener_success_function:
      "frames['main_frame'].frames['main'].frames['user_iframe'].updateCurrentIframe();",
    window_reload: 0,
    url_close: 'user.php?mode=personage&group=1&update_swf=1',
    // 500 = дважды в секунду
    interval: 500
  };

  /* ----------  стили и кнопка  ---------- */
  const style = document.createElement('style');
  style.textContent = `
    #tm-62min-btn {
      position: fixed;
      top: 1px;
      left: 370px;
      z-index: 9999;
      padding: 1px 1px;
      font-weight: bold;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background .2s;
    }
    .idle   { background: #2ecc71; } /* green */
    .active { background: #e74c3c; } /* red   */
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'tm-62min-btn';
  btn.className = 'idle';
  btn.textContent = 'ПОИСК';
  document.body.appendChild(btn);

  /* ----------  логика  ---------- */
  let tId = null;

  const send = () => {
    const url = `https://asteriagame.com/action_form.php?${Math.random()}&no_confirm=${CFG.no_confirm}&artifact_id=${CFG.artifact_id}`;
    const body = new URLSearchParams({
      'in[param_success][opener_success_function]': CFG.opener_success_function,
      'in[param_success][window_reload]': CFG.window_reload,
      'in[param_success][url_close]': CFG.url_close
    });

    fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    })
      .then(r => r.text())
      .then(txt => console.log('[62 min]', new Date().toLocaleTimeString(), txt.slice(0, 120) + '…'))
      .catch(console.error);
  };

  const start = () => {
    btn.classList.remove('idle');
    btn.classList.add('active');
    btn.textContent = '⏸ ПОИСК';
    send();                    // первый вызов сразу
    tId = setInterval(send, CFG.interval);
  };

  const stop = () => {
    clearInterval(tId);
    tId = null;
    btn.classList.remove('active');
    btn.classList.add('idle');
    btn.textContent = '▶ ПОИСК';
  };

  btn.addEventListener('click', () => (tId ? stop() : start()));
})();