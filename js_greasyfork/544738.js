// ==UserScript==
// @name         Toooo MaTchING MBSS
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Перевод чатов на линию матчинга
// @author       v.stazhok
// @match        https://support-admin-common-master.mbss.maxbit.private/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544738/Toooo%20MaTchING%20MBSS.user.js
// @updateURL https://update.greasyfork.org/scripts/544738/Toooo%20MaTchING%20MBSS.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const projectSelector = '.list-item';
  const sidebarPanelSelector = '.flex.sidebar-panel .panel-elements';

  // Наблюдаем за появлением панели и вставляем кнопку
  const observer = new MutationObserver((mutations, obs) => {
    const panel = document.querySelector(sidebarPanelSelector);
    if (!panel) return;
    obs.disconnect();
    injectButton(panel);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  function injectButton(container) {
    const btn = document.createElement('div');
    btn.classList.add('vac-svg-button');
    btn.style.borderRadius = '0';
    btn.style.padding = '4px 8px';
    btn.style.marginLeft = '4px';
    btn.style.cursor = 'pointer';
    btn.textContent = 'Transfer to Matching';

    btn.addEventListener('click', () => {
      const confirmed = confirm('Вы уверены, что желаете перевести чат на линию поддержки Matching?');
      if (!confirmed) return;

      const projectText = document.querySelector(projectSelector)?.innerText || '';
      const code = projectText.split(' ')[0] || '';
      const target = `${code} MATCHING`;

      // Открываем меню опций комнаты
      document.querySelector('.vac-svg-button.vac-room-options')?.click();

      // Переходим на вкладку Transfer To → Matching
      setTimeout(() => {
        document.querySelector('#active_room_transferTo')?.click();
        document.querySelector('#tab-1')?.click();
      }, 400);

      // Заполняем поле и отправляем Enter
      setTimeout(() => {
        const input = document.querySelector('.el-input__inner');
        if (!input) return;
        input.value = target;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keyup',   { key: 'Enter', bubbles: true }));
      }, 1500);
    });

    container.appendChild(btn);
  }
})();
