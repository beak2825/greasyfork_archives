// ==UserScript==
// @name         Провкер
// @namespace    ast_fightId_helper
// @version      2.7
// @match        https://asteriagame.com/main_frame.php
// @grant        none
// @description  провокации (с авто-режимом)
// @downloadURL https://update.greasyfork.org/scripts/546424/%D0%9F%D1%80%D0%BE%D0%B2%D0%BA%D0%B5%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/546424/%D0%9F%D1%80%D0%BE%D0%B2%D0%BA%D0%B5%D1%80.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ----------  1.  стили (убираем стрелки)  ---------- */
  const style = document.createElement('style');
  style.textContent = `
    #bot-input::-webkit-outer-spin-button,
    #bot-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    #bot-input[type="number"] {
      -moz-appearance: textfield;
      appearance: none;
    }
  `;
  document.head.appendChild(style);

  /* ----------  3.  компактная панель  ---------- */
const wrap = document.createElement('div');
wrap.style.cssText = `
  position: fixed;
  top: 18px; left: 370px; z-index: 9999;
  display: flex; flex-direction: column; gap: 2px;
  padding: 3px 5px; border-radius: 3px;
  background: #c8f7c5; border: 1px solid #0b800d;
  font: 11px/1 Arial, sans-serif; color: #000; width: 88px;
`;

/* ----------  первая строка ---------- */
const topRow = document.createElement('div');
topRow.style.cssText = 'display: flex; align-items: center; gap: 3px;';

const btn = document.createElement('button');
btn.textContent = 'Злить';

const input = document.createElement('input');
input.type = 'number';
input.id = 'bot-input';
input.placeholder = ' ';
input.style.cssText = 'width: 40px; text-align: center;';
input.addEventListener('wheel', e => e.preventDefault(), { passive: false });

topRow.append(btn, input);

/* ----------  вторая строка ---------- */
const bottomRow = document.createElement('div');
bottomRow.style.cssText = 'display: flex; align-items: center; gap: 4px; font-size: 10px;';

const chkX10 = document.createElement('input');
chkX10.type = 'checkbox';
chkX10.id = 'x10';
const lblX10 = document.createElement('label');
lblX10.htmlFor = 'x10';
lblX10.textContent = 'x10';

const chkAuto = document.createElement('input');
chkAuto.type = 'checkbox';
chkAuto.id = 'auto';
const lblAuto = document.createElement('label');
lblAuto.htmlFor = 'auto';
lblAuto.textContent = 'auto';

bottomRow.append(chkX10, lblX10, chkAuto, lblAuto);

/* ----------  сборка ---------- */
wrap.append(topRow, bottomRow);
document.body.appendChild(wrap);

  /* ----------  4.  логика ---------- */
  let autoTimer = null;

  function sendRequest() {
    const botId = input.value.trim();
    if (!botId) {
      alert('Введите botId!');
      return;
    }

    const battleId = top.__lastFightId;
    const suffix = chkX10.checked ? 'open=1&x10=1' : 'open=1';
    const url = `https://asteriagame.com/provocation.php?&action=agr&mob_id=${botId}&gdata=${battleId}&${suffix}`;

    for (let i = 0; i < 3; i++) console.log(url);

    fetch(url, {
      headers: {
        accept: '*/*',
        'accept-language': 'ru-RU,ru;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6',
        priority: 'u=1, i',
        'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      },
      referrer: `https://asteriagame.com/provocation.php?&open=1&gdata=${battleId}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
      .then(r => r.text())
      .then(txt => console.log('Ответ сервера:', txt))
      .catch(e => console.error('Ошибка запроса:', e));
  }

  /* ручной запуск */
  btn.addEventListener('click', sendRequest);

  /* авто-режим */
  chkAuto.addEventListener('change', () => {
    if (chkAuto.checked) {
      autoTimer = setInterval(sendRequest, 1000);
    } else {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  });
})();