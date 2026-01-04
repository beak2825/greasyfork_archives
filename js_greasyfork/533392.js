// ==UserScript==
// @name         Авто-подгрузка статистики GreasyFork для тем с дополнениями
// @namespace    https://lolz.live/
// @version      1.0
// @description  Для форума
// @author       umikud
// @match        https://lolz.live/threads/*
// @grant        GM.xmlHttpRequest
// @connect      greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/533392/%D0%90%D0%B2%D1%82%D0%BE-%D0%BF%D0%BE%D0%B4%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B0%20%D1%81%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B8%20GreasyFork%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D0%BC%20%D1%81%20%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F%D0%BC%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/533392/%D0%90%D0%B2%D1%82%D0%BE-%D0%BF%D0%BE%D0%B4%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B0%20%D1%81%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B8%20GreasyFork%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D0%BC%20%D1%81%20%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F%D0%BC%D0%B8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log('cкрипт запущен');

  const match = document.body.innerText.match(/https?:\/\/greasyfork\.org\/(?:[a-z-]+\/)?scripts\/(\d+)/i);
  if (!match) {
    console.log('cсылка на Greasy Fork не найдена');
    return;
  }

  const scriptId = match[1];
  const apiUrl = `https://greasyfork.org/scripts/${scriptId}.json`;

  GM.xmlHttpRequest({
    method: 'GET',
    url: apiUrl,
    headers: { 'Accept': 'application/json' },
    onload: function (res) {
      if (res.status !== 200) {
        console.error('не удалось получить данные');
        return;
      }

      const data = JSON.parse(res.responseText);
      console.log('получены данные:', data);

      const container = getOrCreateButtonBlock();
      if (!container) {
        console.error('контейнер не найден');
        return;
      }

      const installBtn = document.createElement('a');
      installBtn.className = 'deposit_green button OverlayTrigger';
      installBtn.href = data.code_url;
      installBtn.target = '_blank';
      installBtn.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center;">
          <p style="margin: 0;">Установить расширение</p>
        </div>
      `;

      const installsBtn = document.createElement('a');
      installsBtn.className = 'button OverlayTrigger';
      installsBtn.href = data.url;
      installsBtn.target = '_blank';
      installsBtn.innerHTML = `
        ${data.total_installs.toLocaleString()} установок
      `;

      const updateBtn = document.createElement('a');
      updateBtn.className = 'button OverlayTrigger';
      updateBtn.href = data.url;
      updateBtn.target = '_blank';
      updateBtn.innerHTML = `
        Обновлён: ${new Date(data.code_updated_at).toLocaleDateString('ru-RU')}
      `;

      container.appendChild(installBtn);
      container.appendChild(installsBtn);
      container.appendChild(updateBtn);

      console.log('все кнопки успешно добавлены');
    },
    onerror: function (e) {
      console.error('ошибка запроса:', e);
    }
  });

  function getOrCreateButtonBlock() {
    let container = document.querySelector('.contactToSellerButtons');
    if (container) return container;

    const message = document.querySelector('.messageContent');
    if (!message) return null;

    container = document.createElement('div');
    container.className = 'contactToSellerButtons';
    container.style.marginTop = '20px';

    message.appendChild(container);
    return container;
  }
})();

