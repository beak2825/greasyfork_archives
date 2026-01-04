// ==UserScript==
// @name         Спамер
// @namespace    http://tampermonkey.net/
// @version      1.3
// @match        https://asteriagame.com/main_frame.php
// @grant        none
// @description спам
// @downloadURL https://update.greasyfork.org/scripts/546425/%D0%A1%D0%BF%D0%B0%D0%BC%D0%B5%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/546425/%D0%A1%D0%BF%D0%B0%D0%BC%D0%B5%D1%80.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
    no_confirm: 1,
    opener_success_function:
      "frames['main_frame'].frames['main'].frames['user_iframe'].updateCurrentIframe();",
    window_reload: 0,
    url_close: 'user.php?mode=personage&group=1&update_swf=1'
  };

  /* ----------  стили ---------- */
  const style = document.createElement('style');
  style.textContent = `
    #tm-spam-panel {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    #tm-artifact-id {
      width: 90px;
      padding: 6px 8px;
      border: 1px solid #555;
      border-radius: 4px;
      font-size: 13px;
      text-align: center;
    }
    #tm-spam-toggle {
      padding: 8px 14px;
      font-weight: bold;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background .2s;
    }
    .idle   { background: #2ecc71; } /* зелёный */
    .active { background: #e74c3c; } /* красный */
  `;
  document.head.appendChild(style);

  /* ----------  панель: поле ввода + кнопка ---------- */
  const panel = document.createElement('div');
  panel.id = 'tm-spam-panel';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'tm-artifact-id';
  input.placeholder = 'ID предмета';
  input.value = 'Спам';             // значение по умолчанию
  panel.appendChild(input);

  const btn = document.createElement('button');
  btn.id = 'tm-spam-toggle';
  btn.className = 'idle';
  btn.textContent = '▶ Спамим!';
  panel.appendChild(btn);

  document.body.appendChild(panel);

  /* ----------  логика тумблера ---------- */
  let timer = null;

  function start() {
    const artifactId = input.value.trim();
    if (!artifactId) return;

    btn.classList.remove('idle');
    btn.classList.add('active');
    btn.textContent = '⏸ 67269464';

    timer = setInterval(() => {
      const url = `https://asteriagame.com/action_form.php?${Math.random()}&no_confirm=${CONFIG.no_confirm}&artifact_id=${artifactId}`;
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
          console.log('[SPAM]', new Date().toLocaleTimeString(), txt.slice(0, 120) + '…');
        })
        .catch(err => console.error('[SPAM] ошибка', err));
    }, 250);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    btn.classList.remove('active');
    btn.classList.add('idle');
    btn.textContent = '▶ 67269464';
  }

  btn.addEventListener('click', () => (timer ? stop() : start()));
})();