// ==UserScript==
// @name         HeroesWM Clan Masters Info
// @namespace    http://tampermonkey.net/
// @version      1.37
// @description  Собирает информацию о мастерах и кузницах клана и выводит в виде таблиц во всплывающем окне
// @author       o3-mini-ChatGPT
// @match        https://www.heroeswm.ru/clan_info.php?id=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533142/HeroesWM%20Clan%20Masters%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/533142/HeroesWM%20Clan%20Masters%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    /**
     * @typedef {Object} PlayerResult
     * @property {string} id - Идентификатор игрока
     * @property {string} name - Имя игрока
     * @property {string} link - HTML-ссылка на страницу игрока
     * @property {number} guildKuznetsov - Значение "Гильдия Кузнецов"
     * @property {number} guildOrujejnikov - Значение "Гильдия Оружейников"
     * @property {number} masterOrujie - Значение "Мастер оружия"
     * @property {number} masterBronya - Значение "Мастер доспехов"
     * @property {number} jeweler - Значение "Ювелир"
     */
    
    // Создаём кнопку в левом верхнем углу для открытия анализа
    const button = document.createElement('button');
    button.innerText = 'Анализ мастеров';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);
    
    // Функция для создания модального окна с содержимым
    function createModal(content) {
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
      modal.style.backgroundColor = '#fff';
      modal.style.padding = '20px';
      modal.style.border = '1px solid #000';
      modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
      modal.style.zIndex = '2000';
      modal.style.maxHeight = '80vh';
      modal.style.overflowY = 'auto';
      modal.innerHTML = content;
    
      const closeButton = document.createElement('button');
      closeButton.innerText = 'Закрыть';
      closeButton.style.marginTop = '10px';
      closeButton.onclick = () => {
        document.body.removeChild(modal);
      };
      modal.appendChild(closeButton);
    
      return modal;
    }
    
    // Обработчик нажатия на кнопку анализа
    button.onclick = async function() {
      // Создаем модальное окно с индикатором прогресса
      const modalDiv = document.createElement('div');
      modalDiv.style.position = 'fixed';
      modalDiv.style.top = '50%';
      modalDiv.style.left = '50%';
      modalDiv.style.transform = 'translate(-50%, -50%)';
      modalDiv.style.backgroundColor = '#fff';
      modalDiv.style.padding = '20px';
      modalDiv.style.border = '1px solid #000';
      modalDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
      modalDiv.style.zIndex = '2000';
      modalDiv.style.minWidth = '600px';
      modalDiv.innerHTML = '<h2>Сбор информации...</h2><div id="progress">0%</div>';
      document.body.appendChild(modalDiv);
    
      // Поиск игроков только в таблице с id "table-content"
      const tableContent = document.getElementById('table-content');
      if (!tableContent) {
        modalDiv.innerHTML = '<h2>Ошибка</h2><p>Не найден блок с игроками (table-content).</p>';
        return;
      }
      const playerLinkElements = tableContent.querySelectorAll('a.pi[href^="pl_info.php?id="]');
      if (playerLinkElements.length === 0) {
        modalDiv.innerHTML = '<h2>Ошибка</h2><p>Игроки не найдены в блоке table-content.</p>';
        return;
      }
    
      /** @type {PlayerResult[]} */
      const results = [];
      const playerElements = Array.from(playerLinkElements);
      console.log(`Найдено ${playerElements.length} игроков`);
    
      // Обрабатываем каждого игрока по очереди
      for (let i = 0; i < playerElements.length; i++) {
        const linkElem = playerElements[i];
        const href = linkElem.getAttribute('href');
        const id = href.split('=')[1];
        const name = linkElem.textContent.trim();
        const playerLink = linkElem.outerHTML;
    
        // Обновляем индикатор прогресса
        const progressElem = document.getElementById('progress');
        if (progressElem) {
          progressElem.textContent = `${Math.round(((i + 1) / playerElements.length) * 100)}% (${i + 1}/${playerElements.length})`;
        }
    
        try {
          // Загружаем страницу игрока через скрытый iframe для эмуляции поведения реального пользователя
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
          iframe.src = `https://www.heroeswm.ru/pl_info.php?id=${id}`;
          await new Promise(resolve => iframe.onload = resolve);
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          document.body.removeChild(iframe);
          // Используем innerText для видимого текста и нормализуем его, заменяя неразрывные пробелы
          const normalizedBody = doc.body.innerText.replace(/\u00A0/g, ' ');
    
          // Извлекаем значение Гильдия Кузнецов из нормализованного текста страницы
          const guildKuznetsovMatch = normalizedBody.match(/Гильдия Кузнецов\s*:\s*(\d+)/i);
          const guildKuznetsov = guildKuznetsovMatch ? parseInt(guildKuznetsovMatch[1], 10) : 0;
    
          // Для Гильдии оружейников сначала пробуем получить данные из элемента с id "home_2"
          let guildOrujejnikov = 0;
          const home2 = doc.getElementById("home_2");
          if (home2) {
            const normalizedHome2 = home2.innerText.replace(/\u00A0/g, ' ');
            const match = normalizedHome2.match(/Гильдия Оружейников\s*:\s*(\d+)/i);
            guildOrujejnikov = match ? parseInt(match[1], 10) : 0;
          }
          // Если не найдено через home2, пробуем по всему тексту
          if (guildOrujejnikov === 0) {
            const extraMatch = normalizedBody.match(/Гильдия Оружейников\s*:\s*(\d+)/i);
            if (extraMatch) {
              guildOrujejnikov = parseInt(extraMatch[1], 10);
            }
          }
    
          // Извлекаем значения отделения гильдии оружейников (навыки) из нормализованного текста
          const masterOrujieMatch = normalizedBody.match(/Мастер оружия\s*:\s*(\d+)/i);
          const masterOrujie = masterOrujieMatch ? parseInt(masterOrujieMatch[1], 10) : 0;
    
          const masterBronyaMatch = normalizedBody.match(/Мастер доспехов\s*:\s*(\d+)/i);
          const masterBronya = masterBronyaMatch ? parseInt(masterBronyaMatch[1], 10) : 0;
    
          const jewelerMatch = normalizedBody.match(/Ювелир\s*:\s*(\d+)/i);
          const jeweler = jewelerMatch ? parseInt(jewelerMatch[1], 10) : 0;
    
          console.log(`Игрок ${name}: Кузница=${guildKuznetsov}, Оружейники=${guildOrujejnikov}, Мастер оружия=${masterOrujie}, Мастер доспехов=${masterBronya}, Ювелир=${jeweler}`);
    
          // Если у игрока не прокачан ни один стата в оружейных, пропускаем его
          if (masterOrujie === 0 && masterBronya === 0 && jeweler === 0 && guildKuznetsov === 0) {
            console.log(`Игрок ${name} пропущен, т.к. отсутствует прокачка статов в оружейных и кузницы.`);
            continue;
          }
    
          results.push({
            id,
            name,
            link: playerLink,
            guildKuznetsov,
            guildOrujejnikov,
            masterOrujie,
            masterBronya,
            jeweler
          });
    
          // Пауза между запросами
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`Ошибка при обработке игрока ${name}:`, error);
        }
      }
    
      // Если результатов нет, выводим сообщение
      if (results.length === 0) {
        document.body.removeChild(modalDiv);
        const noDataModal = createModal('<h2>Результаты</h2><p>Нет игроков с прокачанными статами в оружейных.</p>');
        document.body.appendChild(noDataModal);
        return;
      }
    
      // Формирование текстовой таблицы мастеров для удобного копирования
      let masterTableText = '|| Оружие || Броня || Ювелир || Персонаж\n\n';
      results.forEach(player => {
        if (!player.guildOrujejnikov) return; // пропускаем игроков с 0 гильдий
        const weaponValue = (player.guildOrujejnikov && player.masterOrujie) ? (Math.min(player.guildOrujejnikov + 1, 5) + '*' + String(Math.min(player.masterOrujie + 1, 12)).padStart(2, '0') + '%') : '- - - - -';
        const armorValue = (player.guildOrujejnikov && player.masterBronya) ? (Math.min(player.guildOrujejnikov + 1, 5) + '*' + String(Math.min(player.masterBronya + 1, 12)).padStart(2, '0') + '%') : '- - - - -';
        const jewelerValue = (player.guildOrujejnikov && player.jeweler) ? (Math.min(player.guildOrujejnikov + 1, 5) + '*' + String(Math.min(player.jeweler + 1, 12)).padStart(2, '0') + '%') : '- - - - -';
        masterTableText += `|| ${weaponValue} || ${armorValue} || ${jewelerValue} || ${player.name}\n`;
      });
      
      let smithTableText = '|| Кузница || Персонаж\n\n';
      results.forEach(player => {
        if (!(player.guildKuznetsov > 0)) return;
        const smithValue = (Math.min((player.guildKuznetsov + 1) * 10, 90)) + '%';
        smithTableText += `|| ${smithValue} || ${player.name}\n`;
      });

      const finalHTML = '<h2>Информация о мастерах клана</h2><textarea style="width:100%;height:200px;" readonly>' + masterTableText + '</textarea>' +
                         '<h2>Информация о кузницах клана</h2><textarea style="width:100%;height:200px;" readonly>' + smithTableText + '</textarea>';
      document.body.removeChild(modalDiv);
      const resultModal = createModal(finalHTML);
      document.body.appendChild(resultModal);
    };
    
  })();