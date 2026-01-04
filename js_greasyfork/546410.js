// ==UserScript==
// @name        АнтиЗанозка 3.1
// @namespace   https://asteriagame.com
// @version     3.1
// @match       https://asteriagame.com/main_frame.php
// @grant       GM_xmlhttpRequest
// @description антизаноза антинадевание
// @downloadURL https://update.greasyfork.org/scripts/546410/%D0%90%D0%BD%D1%82%D0%B8%D0%97%D0%B0%D0%BD%D0%BE%D0%B7%D0%BA%D0%B0%2031.user.js
// @updateURL https://update.greasyfork.org/scripts/546410/%D0%90%D0%BD%D1%82%D0%B8%D0%97%D0%B0%D0%BD%D0%BE%D0%B7%D0%BA%D0%B0%2031.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ----------  настройки  ---------- */
  const EFFECT_URL  = 'https://asteriagame.com/effect_info.php?nick=umxo';
  const MAIN_ID     = 68324833;   // «Занозка»
  const INTERVAL    = 1000;       // мс между проверками

  /* ----------  кнопка  ---------- */
  const style = document.createElement('style');
  style.textContent = `
    #tm-zanozka-btn {
      position: fixed;
      top: 1px;
      left: 480px;
      z-index: 9999;
      padding: 1px 4px;
      font-weight: bold;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background .2s;
    }
    .idle   { background: #2ecc71; }
    .active { background: #e74c3c; }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'tm-zanozka-btn';
  btn.className = 'idle';
  btn.textContent = 'АНТИ-ЗАНОЗКА';
  document.body.appendChild(btn);

  /* ----------  логика  ---------- */
  let timer = null;

  /* применяем артефакт «Занозка» и запускаем цепочку */
  const runChain = () => {
    const url = `https://asteriagame.com/action_form.php?${Math.random()}&no_confirm=1&artifact_id=${MAIN_ID}`;
    GM_xmlhttpRequest({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams({
        no_confirm: 1,
        'in[param_success][opener_success_function]': "frames['main_frame'].frames['main'].frames['user_iframe'].updateCurrentIframe();",
        'in[param_success][window_reload]': 0,
        'in[param_success][url_close]': 'user.php?mode=personage&group=1&update_swf=1'
      }),
      onload: () => {
        console.log('[ЗАНОЗКА] 68324833 (старт)');
        /* затем 10 раз антизанозка */
        for (let i = 1; i <= 10; i++) {
          setTimeout(() => {
            fetch(
              'https://asteriagame.com/action_run.php?code=PUT_ON&url_success=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&artifact_id=70494033&in[slot_num]=3&in[variant_effect]=0&ajax=1&out_ajax=1&update_swf=1',
              {
                headers: {
                  'accept': '*/*',
                  'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                  'priority': 'u=1, i',
                  'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
                  'sec-ch-ua-mobile': '?0',
                  'sec-ch-ua-platform': '"Windows"',
                  'sec-fetch-dest': 'empty',
                  'sec-fetch-mode': 'cors',
                  'sec-fetch-site': 'same-origin'
                },
                referrer: 'https://asteriagame.com/user_iframe.php?&group=1',
                body: null,
                method: 'GET',
                mode: 'cors',
                credentials: 'include'
              }
            )
              .then(r => r.text())
              .then(r => console.log(`[ЗАНОЗКА] антизанозка #${i}`, r.slice(0, 120) + '…'))
              .catch(e => console.error(`[ЗАНОЗКА] ошибка антизанозки #${i}`, e));
          }, i * 1000);
        }
      },
      onerror: e => console.error('[ЗАНОЗКА] ошибка 68324833', e)
    });
  };

  /* проверяем список эффектов */
  const tick = async () => {
    try {
      const active = await new Promise((res, rej) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: EFFECT_URL,
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

      if (active.has('Занозка')) {
        runChain();
      }
    } catch (e) {
      console.error('[ЗАНОЗКА] ошибка загрузки', e);
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