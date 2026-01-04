// ==UserScript==
// @name         Авто-баф
// @namespace    https://asteriagame.com
// @version      2.1
// @match        https://asteriagame.com/main_frame.php
// @grant        GM_xmlhttpRequest
// @description  автобафер астерия
// @downloadURL https://update.greasyfork.org/scripts/546409/%D0%90%D0%B2%D1%82%D0%BE-%D0%B1%D0%B0%D1%84.user.js
// @updateURL https://update.greasyfork.org/scripts/546409/%D0%90%D0%B2%D1%82%D0%BE-%D0%B1%D0%B0%D1%84.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ----------  настройки  ----------
  const BUFFS = {
    'Ледяная мазь':        68205363,
    'Мясная похлебка':     70492607,
    'Сфера воинского духа':70899691,
    'Чары сытости V':      67402913
  };
  const CHECK_URL = 'https://asteriagame.com/effect_info.php?nick=umxo';
  const INTERVAL  = 1000;
  const POST_BODY = new URLSearchParams({
    no_confirm: 1,
    'in[param_success][opener_success_function]': "frames['main_frame'].frames['main'].frames['user_iframe'].updateCurrentIframe();",
    'in[param_success][window_reload]': 0,
    'in[param_success][url_close]': 'user.php?mode=personage&group=1&update_swf=1'
  });

  // ----------  стили и кнопка  ----------
  const style = document.createElement('style');
  style.textContent = `
    #tm-autobuff-btn {
      position: fixed;
      top: 1px;
      left: 420px;
      z-index: 9999;
      padding: 1px 1px;
      font-weight: bold;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background .2s;
    }
    .idle   { background: #2ecc71; } /* зелёная */
    .active { background: #e74c3c; } /* красная   */
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'tm-autobuff-btn';
  btn.className = 'idle';
  btn.textContent = 'АВТОБАФ';
  document.body.appendChild(btn);

  // ----------  логика  ----------
  let timer = null;

  const fetchBuffs = () =>
    new Promise((res, rej) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: CHECK_URL,
        onload: resp => {
          const doc  = new DOMParser().parseFromString(resp.responseText, 'text/html');
          const list = new Set();
          doc.querySelectorAll('table tr').forEach(tr => {
            const tds = tr.querySelectorAll('td');
            if (tds.length >= 2) {
              const name = tds[0].textContent.trim();
              if (name && name !== 'Наименование') list.add(name);
            }
          });
          res(list);
        },
        onerror: rej
      });
    });

  const useItem = (id, name) => {
    const url = `https://asteriagame.com/action_form.php?${Math.random()}&no_confirm=1&artifact_id=${id}`;
    GM_xmlhttpRequest({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: POST_BODY,
      onload: r => console.log(`[АВТОБАФ] ${name} (${id})`, r.responseText.slice(0, 120) + '…'),
      onerror: e => console.error(`[АВТОБАФ] ошибка ${id}`, e)
    });
  };

  const tick = async () => {
    try {
      const active = await fetchBuffs();
      for (const [buff, id] of Object.entries(BUFFS)) {
        if (!active.has(buff)) useItem(id, buff);
      }
    } catch (e) {
      console.error('[АВТОБАФ] ошибка загрузки', e);
    }
  };

  const start = () => {
    btn.classList.remove('idle');
    btn.classList.add('active');
    tick();
    timer = setInterval(tick, INTERVAL);
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
    btn.classList.remove('active');
    btn.classList.add('idle');
  };

  btn.addEventListener('click', () => (timer ? stop() : start()));
})();