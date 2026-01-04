// ==UserScript==
// @name         HWM_RHelper
// @description  RHelper
// @version      12.38
// @author       Neleus
// @namespace    Neleus
// @license      MIT
// @match        https://www.heroeswm.ru/roulette.php
// @match        https://my.lordswm.com/roulette.php
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      daily.lordswm.com
// @connect      time-1026728216423.europe-west3.run.app
// @run-at       document-end
// @config       numberOfBets=2
// @config       numbersToParseAndChooseFrom=7
// @config       daysForStatistics=31
// @config       minBetInterval=5
// @config       maxBetInterval=10
// @config       randomScriptEnabled=false
// @config       fixedBetEnabled=false
// @config       logicBetEnabled=false
// @config       fixedBetNumber="00"
// @config       betCycles=999
// @config       fallbackTimezoneOffset=1
// @downloadURL https://update.greasyfork.org/scripts/518456/HWM_RHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/518456/HWM_RHelper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let cycleEventsScheduled = false;

  const settings = {
    randomScriptEnabled: GM_getValue('randomScriptEnabled', false),
    fixedBetEnabled: GM_getValue('fixedBetEnabled', false),
    logicBetEnabled: GM_getValue('logicBetEnabled', false),
    numberOfBets: GM_getValue('numberOfBets', 2),
    numbersToParseAndChooseFrom: GM_getValue('numbersToParseAndChooseFrom', 7),
    daysForStatistics: GM_getValue('daysForStatistics', 31),
    minBetInterval: GM_getValue('minBetInterval', 5),
    maxBetInterval: GM_getValue('maxBetInterval', 10),
    fixedBetNumber: GM_getValue('fixedBetNumber', '00'),
    betCycles: GM_getValue('betCycles', 999),
    bettingLogic: GM_getValue('bettingLogic', {}),
    customBettingLogicText: GM_getValue('customBettingLogicText', ''),
    fallbackTimezoneOffset: GM_getValue('fallbackTimezoneOffset', 1),

    lastWinningNumber: GM_getValue('lastWinningNumber', null),
    chosenNumbers: GM_getValue('chosenNumbers', []),
    lastBetTime: GM_getValue('lastBetTime', 0),
    lastFetchTime: GM_getValue('lastFetchTime', 0),
    lastCycleTime: GM_getValue('lastCycleTime', 0),
    currentBetIndex: GM_getValue('currentBetIndex', 0),
    placedBets: GM_getValue('placedBets', []),
    currentBetAmount: GM_getValue('currentBetAmount', null)
  };

  function saveState() {
    GM_setValue('chosenNumbers', settings.chosenNumbers);
    GM_setValue('placedBets', settings.placedBets);
    GM_setValue('lastBetTime', settings.lastBetTime);
    GM_setValue('currentBetIndex', settings.currentBetIndex);
    GM_setValue('currentBetAmount', settings.currentBetAmount);
    console.log('Состояние сохранено');
  }

  function loadState() {
    settings.chosenNumbers = GM_getValue('chosenNumbers', []);
    settings.placedBets = GM_getValue('placedBets', []);
    settings.lastBetTime = GM_getValue('lastBetTime', 0);
    settings.currentBetIndex = GM_getValue('currentBetIndex', 0);
    settings.currentBetAmount = GM_getValue('currentBetAmount', null);
    settings.betCycles = GM_getValue('betCycles', 999);
    console.log('Состояние загружено');
  }

  const toogleRouletteScriptBtn = document.createElement('div');
  toogleRouletteScriptBtn.style.cssText =
    'width: 70px; height: 70px; border-radius: 50%; background: wheat; cursor: pointer; position: fixed; z-index: 99999; bottom: 10px; left: 10px;';
  toogleRouletteScriptBtn.innerHTML = `<img style='width: 100%; height: 100%' src='https://cfcdn.lordswm.com/i/new_top/_panelRoulette.png'/>`;
  document.body.appendChild(toogleRouletteScriptBtn);

  const panel = document.createElement('div');
  panel.style.cssText =
    'position: fixed; top: 50%; left: 50%; width: 350px; transform: translate(-50%, -50%); background: white; border: 2px solid black; padding: 20px; z-index: 999999; visibility: hidden; box-shadow: 0 0 15px rgba(0, 0, 0, 0.3); max-height: 85vh; overflow-y: auto;';
  panel.innerHTML = `
		<button id="closePanel" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 35px; cursor: pointer;">&times;</button>
		<h2 style="text-align: center; margin: 10px 0;">Настройки</h2>
		<table style="width: 100%; border-collapse: collapse;">
        <!-- Случайные -->
				<tr>
						<td style="padding: 5px;"><b>Случайные числа:</b></td>
						<td style="padding: 5px;"><input type="checkbox" id="randomScriptEnabled" ${settings.randomScriptEnabled ? 'checked' : ''} style="transform: scale(1.5);"></td>
				</tr>
				<tr>
						<td style="padding: 5px;">Количество ставок:</td>
						<td style="padding: 5px;"><input type="number" id="numberOfBets" value="${settings.numberOfBets}" min="1" style="width: 100%;"></td>
				</tr>
				<tr>
						<td style="padding: 5px;">Чисел статистики:</td>
						<td style="padding: 5px;"><input type="number" id="numbersToParseAndChooseFrom" value="${
              settings.numbersToParseAndChooseFrom
            }" min="1" style="width: 100%;"></td>
				</tr>
				<tr>
						<td style="padding: 5px;">Дней статистики:</td>
						<td style="padding: 5px;"><input type="number" id="daysForStatistics" value="${settings.daysForStatistics}" min="1" style="width: 100%;"></td>
				</tr>
        <tr><td colspan="2" style="border-bottom: 1px solid #ccc; padding: 5px 0;"></td></tr>

        <!-- Фиксированные -->
				<tr>
						<td style="padding: 5px;"><b>Фиксированные:</b></td>
						<td style="padding: 5px;"><input type="checkbox" id="fixedBetEnabled" ${settings.fixedBetEnabled ? 'checked' : ''} style="transform: scale(1.5);"></td>
				</tr>
				<tr>
						<td style="padding: 5px;">Числа 0-36 или 00:</td>
						<td style="padding: 5px;"><input type="text" id="fixedBetNumber" value="${
              settings.fixedBetNumber
            }" style="width: 100%;" pattern="^(0[0-9]?|[1-9][0-9]?|00)$"></td>
				</tr>
        <tr><td colspan="2" style="border-bottom: 1px solid #ccc; padding: 5px 0;"></td></tr>

        <!-- Логика -->
        <tr>
						<td style="padding: 5px;"><b>Логика ставок:</b></td>
						<td style="padding: 5px;"><input type="checkbox" id="logicBetEnabled" ${settings.logicBetEnabled ? 'checked' : ''} style="transform: scale(1.5);"></td>
				</tr>
        <tr>
						<td colspan="2" style="padding: 5px;">
              <textarea id="customBettingLogicText" style="width: 100%; height: 100px; font-family: monospace; white-space: pre;" placeholder="Введите логику ставок">${
                settings.customBettingLogicText
              }</textarea>
              <div style="font-size: 11px; margin-top: 5px;">Формат: XX-YY,ZZ (где XX = предыдущее число, YY,ZZ = числа для ставок). Каждая строка - новая логика.</div>
            </td>
				</tr>
        <tr><td colspan="2" style="border-bottom: 1px solid #ccc; padding: 5px 0;"></td></tr>

        <!-- Общие -->
        <tr>
						<td style="padding: 5px;" colspan="2"><b>Общие настройки:</b></td>
				</tr>
        <tr>
						<td style="padding: 5px;">Циклов (Макс ${calculateMaxBetCycles()}):</td>
						<td style="padding: 5px;"><input type="number" id="betCycles" value="${settings.betCycles}" min="1" style="width: 100%;"></td>
				</tr>
        <tr>
            <td style="padding: 5px;">Смещение времени(+):</td>
            <td style="padding: 5px;"><input type="number" id="fallbackTimezoneOffset" value="${settings.fallbackTimezoneOffset}" style="width: 100%;"></td>
        </tr>
        <!-- Задержки - Перенесено сюда -->
				<tr>
						<td style="padding: 5px;">Мин. задержка (с):</td>
						<td style="padding: 5px;"><input type="number" id="minBetInterval" value="${settings.minBetInterval}" min="1" style="width: 100%;"></td>
				</tr>
				<tr>
						<td style="padding: 5px;">Макс. задержка (с):</td>
						<td style="padding: 5px;"><input type="number" id="maxBetInterval" value="${settings.maxBetInterval}" min="1" style="width: 100%;"></td>
				</tr>

				<!-- Кнопка -->
				<tr><td colspan="2" style="padding: 10px 0;"></td></tr>
				<tr>
						<td colspan="2" style="text-align: center; padding: 10px;">
								<button id="saveSettings" style="padding: 10px 20px; background-color: #f0f0f0; border: 1px solid #ccc; cursor: pointer;">Сохранить настройки</button>
						</td>
				</tr>
		</table>
		`;
  document.body.appendChild(panel);

  let toogleRouletteScript = JSON.parse(localStorage.getItem('toogleRouletteScript'));
  if (toogleRouletteScript === null) {
    toogleRouletteScript = true;
    localStorage.setItem('toogleRouletteScript', JSON.stringify(toogleRouletteScript));
  }

  function togglePanelVisibility() {
    toogleRouletteScript = !toogleRouletteScript;
    localStorage.setItem('toogleRouletteScript', JSON.stringify(toogleRouletteScript));
    panel.style.visibility = toogleRouletteScript ? 'visible' : 'hidden';
  }

  toogleRouletteScriptBtn.addEventListener('click', togglePanelVisibility);

  document.getElementById('closePanel').addEventListener('click', () => {
    toogleRouletteScript = false;
    localStorage.setItem('toogleRouletteScript', JSON.stringify(toogleRouletteScript));
    panel.style.visibility = 'hidden';
  });

  function calculateMaxBetCycles() {
    const balance = getCurrentGoldBalance();
    const maxBet = getMaxBet();
    return Math.floor(balance / maxBet);
  }

  document.getElementById('saveSettings').addEventListener('click', () => {
    resetCycleState();
    GM_setValue('bettingLogic', {});
    settings.bettingLogic = {};
    GM_setValue('chosenNumbers', []);
    settings.chosenNumbers = [];
    console.log('Настройки сохранены и сброшены');
    GM_setValue('randomScriptEnabled', document.getElementById('randomScriptEnabled').checked);
    GM_setValue('fixedBetEnabled', document.getElementById('fixedBetEnabled').checked);
    GM_setValue('logicBetEnabled', document.getElementById('logicBetEnabled').checked);
    const customLogicText = document.getElementById('customBettingLogicText').value.trim();
    GM_setValue('customBettingLogicText', customLogicText);

    if (document.getElementById('logicBetEnabled').checked) {
      loadBettingLogic();
    }
    GM_setValue('numberOfBets', parseInt(document.getElementById('numberOfBets').value, 10));
    GM_setValue('numbersToParseAndChooseFrom', parseInt(document.getElementById('numbersToParseAndChooseFrom').value, 10));
    GM_setValue('daysForStatistics', parseInt(document.getElementById('daysForStatistics').value, 10));
    GM_setValue('minBetInterval', parseInt(document.getElementById('minBetInterval').value, 10));
    GM_setValue('maxBetInterval', parseInt(document.getElementById('maxBetInterval').value, 10));

    const fixedBetNumbers = document
      .getElementById('fixedBetNumber')
      .value.split(',')
      .map(num => num.trim())
      .filter(num => /^(0[0-9]?|[1-9]?[0-9]?|00)$/.test(num));

    if (fixedBetNumbers.length > 0) {
      GM_setValue('fixedBetNumber', fixedBetNumbers.join(','));
    } else {
      alert('Неверное значение для числа ставки. Введите числа от 0 до 36 или 00, разделенные запятыми.');
      return;
    }

    GM_setValue('betCycles', parseInt(document.getElementById('betCycles').value, 10));
    GM_setValue('fallbackTimezoneOffset', parseInt(document.getElementById('fallbackTimezoneOffset').value, 10));

    toogleRouletteScript = false;
    localStorage.setItem('toogleRouletteScript', JSON.stringify(toogleRouletteScript));
    panel.style.visibility = 'hidden';

    location.reload();
    scheduleCycleEvents();
  });

  panel.style.visibility = toogleRouletteScript ? 'visible' : 'hidden';

  if (!settings.randomScriptEnabled && !settings.fixedBetEnabled && !settings.logicBetEnabled) {
    console.log('Скрипт отключен');
    return;
  }

  function getMoscowTime(callback) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://time-1026728216423.europe-west3.run.app/moscow-time?key=e9bfc14a-029b-4f93-8866-e8d1b9d705da',
      headers: {
        Accept: 'application/json'
      },
      anonymous: true,
      timeout: 10000,
      onload: function (response) {
        try {
          if (response.status !== 200) {
            console.error('Ошибка при запросе времени, статус:', response.status);
            callback(null);
            return;
          }

          const data = JSON.parse(response.responseText);
          const {year, month, day, hours, minutes, seconds, millis} = data;
          const dateTime = new Date(year, month - 1, day, hours, minutes, seconds, millis);
          callback(dateTime);
        } catch (e) {
          console.error('Ошибка при обработке ответа сервера времени:', e);
          const now = new Date();
          now.setHours(now.getHours() + settings.fallbackTimezoneOffset);
          callback(now);
        }
      },
      onerror: function (error) {
        console.error('Ошибка при запросе времени:', error);
        const now = new Date();
        now.setHours(now.getHours() + settings.fallbackTimezoneOffset);
        callback(now);
      },
      ontimeout: function () {
        console.error('Тайм-аут при запросе времени');
        const now = new Date();
        now.setHours(now.getHours() + settings.fallbackTimezoneOffset);
        callback(now);
      }
    });
  }

  function getMaxBet() {
    const maxBetElement = document.evaluate(
      "//td[contains(text(), 'Ваша максимальная сумма ставок:')]/following-sibling::td",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    if (maxBetElement) {
      const maxBetText = maxBetElement.textContent.trim().replace(/,/g, '');
      return parseInt(maxBetText, 10);
    }
    return 0;
  }

  function getMinBet() {
    const minBetElement = document.evaluate(
      "//td[contains(text(), 'Минимальная ставка:')]/following-sibling::td/table/tbody/tr/td[2]",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    if (minBetElement) {
      const minBetText = minBetElement.textContent.trim().replace(/,/g, '');
      return parseInt(minBetText, 10);
    }

    console.error('Не удалось определить минимальную ставку');
    return null;
  }

  function getExistingBets() {
    const existingBets = {};
    const betTableHeader = document.evaluate(
      "//b[contains(text(), 'Ваши ставки')]/ancestor::center/following-sibling::table[@class='wb']",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    if (betTableHeader) {
      const rows = betTableHeader.querySelectorAll('tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 2) {
          const amount = parseInt(cells[0].textContent.replace(/,/g, ''), 10);
          const straightUpMatch = cells[1].textContent.match(/Straight up (\d+|00)/);
          const splitMatch = cells[1].textContent.match(/Split (\d+|00), (\d+|00)/);

          if (straightUpMatch) {
            const number = straightUpMatch[1];
            if (existingBets[number]) {
              existingBets[number] += amount;
            } else {
              existingBets[number] = amount;
            }
          } else if (splitMatch) {
            const firstNumber = splitMatch[1];
            const secondNumber = splitMatch[2];
            const splitAmount = amount / 2;

            if (existingBets[firstNumber]) {
              existingBets[firstNumber] += splitAmount;
            } else {
              existingBets[firstNumber] = splitAmount;
            }

            if (existingBets[secondNumber]) {
              existingBets[secondNumber] += splitAmount;
            } else {
              existingBets[secondNumber] = splitAmount;
            }
          }
        }
      });
    }
    if (Object.keys(existingBets).length > 0) {
      console.log('Текущие ставки:', existingBets);
    }
    return existingBets;
  }

  function getCurrentGoldBalance() {
    let balanceElement = document.querySelector('#ResourceAmount');

    if (!balanceElement) {
      balanceElement = document.querySelector('#res_gold');
    }

    if (balanceElement) {
      const balanceText = balanceElement.textContent.trim().replace(/,/g, '');
      const balance = parseInt(balanceText, 10);
      console.log('Текущий баланс золота:', balance);
      return balance;
    }

    console.error('Не удалось определить текущий баланс золота');
    return 0;
  }

  function fetchBettingData(callback) {
    if (settings.fixedBetEnabled || settings.logicBetEnabled) {
      console.log('Случайные ставки не используются, так как включен другой режим ставок.');
      if (callback) {
        callback();
      }
      return;
    }

    if (!settings.randomScriptEnabled) {
      console.log('Режим случайных ставок не активирован.');
      if (callback) {
        callback();
      }
      return;
    }

    console.log('Получение данных о ставках...');
    settings.lastFetchTime = new Date().getTime();
    GM_setValue('lastFetchTime', settings.lastFetchTime);

    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://daily.lordswm.com/roulette/spin-repeat.php?per=${settings.daysForStatistics}&filter=0&num=`,
      onload: function (response) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.responseText, 'text/html');

        const tables = doc.querySelectorAll('table.report');
        let targetTable;
        for (let table of tables) {
          if (table.querySelector('th') && table.querySelector('th').textContent.includes('Следущее число')) {
            targetTable = table;
            break;
          }
        }

        if (!targetTable) {
          console.log('Не удалось найти нужную таблицу');
          return;
        }

        const rows = targetTable.querySelectorAll('tbody tr');
        const bettingNumbers = [];
        for (let i = 0; i < rows.length && bettingNumbers.length < settings.numbersToParseAndChooseFrom; i++) {
          const cells = rows[i].querySelectorAll('td');
          if (cells.length >= 1) {
            const matchResult = cells[0].textContent.match(/->\s*(0{1,2}|\d+)/);
            if (matchResult && matchResult[1]) {
              const number = matchResult[1] === '00' ? '00' : matchResult[1] === '0' ? '0' : parseInt(matchResult[1], 10);
              bettingNumbers.push(number);
            } else {
              console.log(`Не удалось спарсить строку: ${cells[0].textContent}`);
            }
          }
        }

        console.log(`Последние ${settings.numbersToParseAndChooseFrom} результатов: ${bettingNumbers.join(', ')}`);

        settings.chosenNumbers = [];

        const betCount = settings.numberOfBets === 0 ? Math.floor(Math.random() * 3) + 1 : settings.numberOfBets;
        while (settings.chosenNumbers.length < betCount && bettingNumbers.length > 0) {
          const randomIndex = Math.floor(Math.random() * bettingNumbers.length);
          const number = bettingNumbers.splice(randomIndex, 1)[0];
          settings.chosenNumbers.push(number);
        }
        saveState();
        settings.lastCycleTime = new Date().getTime();
        GM_setValue('lastCycleTime', settings.lastCycleTime);
        settings.currentBetIndex = 0;
        saveState();
        settings.placedBets = [];
        saveState();

        console.log(`Выбранные числа: ${settings.chosenNumbers.join(', ')}`);

        if (callback) {
          callback();
        }
      },
      onerror: function (error) {
        console.error('Ошибка при запросе данных о ставках:', error);
      },
      ontimeout: function () {
        console.error('Тайм-аут при запросе данных о ставках.');
        if (callback) {
          callback();
        }
      }
    });
  }

  function scheduleBets() {
    const existingBets = getExistingBets();
    const totalExistingBets = Object.values(existingBets).reduce((a, b) => a + b, 0);
    const maxBet = getMaxBet();

    const pendingBets = GM_getValue('pendingBets', []);
    if (pendingBets.length > 0) {
      console.log('Обнаружены незавершенные ставки:', pendingBets);
      settings.chosenNumbers = pendingBets;
      settings.currentBetIndex = 0;
    }

    if (totalExistingBets >= maxBet) {
      console.log('Сумма существующих ставок уже достигла максимальной суммы ставки. Ожидание следующего цикла.');
      return;
    }

    placeBet(settings.currentBetIndex);
  }

  function disableScript() {
    GM_setValue('randomScriptEnabled', false);
    GM_setValue('fixedBetEnabled', false);
    GM_setValue('logicBetEnabled', false);
    console.log('Скрипт отключен из-за недостаточного баланса для минимальной ставки.');
    location.reload();
  }

  function loadBettingLogic() {
    settings.bettingLogic = {};
    GM_setValue('bettingLogic', {});

    let bettingLogic = {};

    if (settings.customBettingLogicText) {
      try {
        bettingLogic = parseCustomBettingLogicText(settings.customBettingLogicText);
      } catch (error) {
        console.error('Ошибка при парсинге логики ставок:', error);
        alert('Ошибка в формате логики ставок. Проверьте синтаксис.');
      }
    }

    settings.bettingLogic = bettingLogic;
    GM_setValue('bettingLogic', bettingLogic);

    settings.chosenNumbers = [];
    GM_setValue('chosenNumbers', []);
  }

  function parseCustomBettingLogicText(text) {
    const bettingLogic = {};

    const lines = text.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('//')) {
        continue;
      }

      const parts = trimmedLine.split('-');
      if (parts.length === 2) {
        const previousNumber = parts[0].trim();
        const betNumbers = parts[1]
          .split(',')
          .map(num => num.trim())
          .filter(num => num);
        if (betNumbers.length > 0) {
          bettingLogic[previousNumber] = betNumbers;
        }
      } else {
        console.log('Неверный формат строки логики: ', trimmedLine);
      }
    }
    return bettingLogic;
  }

  function findWinningNumber(callback) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://daily.lordswm.com/roulette/spin-repeat.php',
      onload: function (response) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.responseText, 'text/html');

        const targetTable = doc.querySelector('table#report_1');
        if (!targetTable) {
          console.log('Не удалось найти таблицу с ID report_1');
          if (callback) callback(null);
          return;
        }

        const dataRows = [];
        const allRows = targetTable.querySelectorAll('tr');
        for (let i = 0; i < allRows.length; i++) {
          const row = allRows[i];
          if (row.querySelector('td')) {
            dataRows.push(row);
          }
        }

        if (dataRows.length === 0) {
          console.log('В таблице нет строк с данными');
          if (callback) callback(null);
          return;
        }

        const firstRow = dataRows[0];
        const cells = firstRow.querySelectorAll('td');

        if (cells.length === 0) {
          console.log('В строке нет ячеек td');
          if (callback) callback(null);
          return;
        }

        const firstCell = cells[0];
        if (!firstCell) {
          console.log('Не удалось найти ячейку с информацией о числах');
          if (callback) callback(null);
          return;
        }

        const boldElements = firstCell.querySelectorAll('b');

        if (boldElements.length < 2) {
          const cellText = firstCell.textContent.trim();

          const arrowIndex = cellText.indexOf('->');
          if (arrowIndex !== -1 && arrowIndex < cellText.length - 2) {
            const textAfterArrow = cellText.substring(arrowIndex + 2).trim();

            const match = textAfterArrow.match(/\d+/);
            if (match) {
              let winningNumber = match[0];

              settings.lastWinningNumber = winningNumber;
              GM_setValue('lastWinningNumber', winningNumber);

              if (callback) callback(winningNumber);
              return;
            }
          }

          if (callback) callback(null);
          return;
        }

        const secondBoldElement = boldElements[1];

        const secondBoldText = secondBoldElement.textContent.trim();
        const match = secondBoldText.match(/\d+/);
        let winningNumber = match ? match[0] : secondBoldText;

        if (winningNumber === '0') {
          winningNumber = '0';
        } else if (winningNumber === '00') {
          winningNumber = '00';
        } else {
          const num = parseInt(winningNumber, 10);
          if (isNaN(num) || num < 1 || num > 36) {
            console.log('Недопустимое значение числа:', winningNumber);
            if (callback) callback(null);
            return;
          }
          winningNumber = String(num);
        }

        settings.lastWinningNumber = winningNumber;
        GM_setValue('lastWinningNumber', winningNumber);

        if (callback) callback(winningNumber);
      },
      onerror: function (error) {
        console.error('Ошибка при запросе данных о выпавшем числе:', error);
        if (callback) callback(null);
      },
      ontimeout: function () {
        console.error('Тайм-аут при запросе данных о выпавшем числе.');
        if (callback) callback(null);
      }
    });
  }

  function scheduleWinningNumberCheck() {
    getMoscowTime(now => {
      if (!now) {
        console.error('scheduleWinningNumberCheck: Не удалось получить текущее время. Повторная попытка через 30 секунд.');
        setTimeout(scheduleWinningNumberCheck, 30000);
        return;
      }

      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const currentCycle = Math.floor(minutes / 5);
      const nextCycleMinute = (currentCycle + 1) * 5;
      const currentCycleMinute = currentCycle * 5;

      let timeToNextCheck;
      if (minutes === currentCycleMinute && seconds < 20) {
        timeToNextCheck = (20 - seconds) * 1000 - now.getMilliseconds();
      } else {
        timeToNextCheck = ((nextCycleMinute - minutes) * 60 - seconds + 20) * 1000 - now.getMilliseconds();
      }

      if (timeToNextCheck < 0) {
        timeToNextCheck = 5 * 60 * 1000 + 20 * 1000;
      }

      const nextCheckDate = new Date(now.getTime() + timeToNextCheck);
      console.log(
        `Проверка числа в ${nextCheckDate.getHours()}:${nextCheckDate.getMinutes().toString().padStart(2, '0')}:${nextCheckDate
          .getSeconds()
          .toString()
          .padStart(2, '0')}`
      );

      setTimeout(() => {
        findWinningNumber(winningNumber => {
          if (winningNumber && settings.logicBetEnabled && settings.bettingLogic[winningNumber]) {
          }
          scheduleWinningNumberCheck();
        });
      }, timeToNextCheck);
    });
  }

  function clickOnImageAndSetBet(number, amount) {
    const imgTitle = number === '00' ? 'Straight up 00' : `Straight up ${number}`;
    const img = document.querySelector(`img[title="${imgTitle}"]`);

    if (!img) {
      console.log(`Не удалось найти изображение для числа ${number}`);
      return;
    }

    img.click();

    setTimeout(() => {
      const betInput = document.querySelector('input[name="bet"]');

      if (!betInput) {
        console.log('Не удалось найти поле для ввода ставки');
        return;
      }

      betInput.value = amount;

      const submitButton = document.querySelector('input[value="Поставить!"]');
      if (submitButton && !submitButton.disabled) {
        GM_setValue('intendedBet', {number, amount});
        console.log(`Попытка ставки ${amount} на ${number}. Сохранено intendedBet.`);
        submitButton.click();
      } else {
        console.log('Кнопка "Поставить!" недоступна или отключена');
      }
    }, 2000);
  }

  function checkBalance(amount) {
    const currentBalance = getCurrentGoldBalance();
    if (currentBalance < amount) {
      console.log(`Недостаточно золота для ставки в размере ${amount}. Отключение скрипта.`);
      disableScript();
      return false;
    }
    return true;
  }

  function getRemainingNumbers(existingBets) {
    if (settings.betCycles <= 0) {
      console.log('Достигнут лимит циклов ставок. Отключение скрипта.');
      disableScript();
      return [];
    }

    let remainingNumbers = settings.chosenNumbers.filter(number => !existingBets[number]);

    if (settings.fixedBetEnabled) {
      const fixedBetNumbers = settings.fixedBetNumber.split(',').map(num => num.trim());
      remainingNumbers = fixedBetNumbers.filter(number => !existingBets[number]);
      if (remainingNumbers.length === 0) {
        console.log('Все фиксированные числа уже имеют ставки');
        return [];
      }
    }

    return remainingNumbers;
  }

  function placeBet(index) {
    loadState();

    const pendingBets = GM_getValue('pendingBets', []);
    if (pendingBets.length > 0 && settings.chosenNumbers.length === 0) {
      settings.chosenNumbers = pendingBets;
      settings.currentBetIndex = 0;
    }

    if (settings.chosenNumbers.length === 0) {
      console.log('Номера для ставок не выбраны');
      return;
    }

    if (settings.chosenNumbers.length > 0) {
      console.log('Числа для ставок:', settings.chosenNumbers.join(', '));
    }

    const nowTime = Date.now();
    if (nowTime - settings.lastBetTime < settings.minBetInterval * 1000) {
      console.log('Ожидание минимального интервала между ставками');
      setTimeout(() => placeBet(settings.currentBetIndex), 1000);
      return;
    }

    const maxBet = getMaxBet();
    const existingBets = getExistingBets();
    const totalExistingBets = Object.values(existingBets).reduce((a, b) => a + b, 0);

    if (totalExistingBets >= maxBet) {
      console.log('Сумма существующих ставок уже достигла максимальной суммы ставки');
      console.log('Ожидание следующего цикла');
      if (!cycleEventsScheduled) {
        console.log('Планирование следующего цикла из placeBet (макс. ставка достигнута)');
        cycleEventsScheduled = false;
        setTimeout(() => {
          scheduleCycleEvents();
        }, 60000);
      }
      return;
    }

    const remainingNumbers = getRemainingNumbers(existingBets);
    if (remainingNumbers.length === 0) {
      console.log('placeBet: Нет оставшихся номеров для ставок.');
      return;
    }

    let currentBetIndexToUse = index;
    if (currentBetIndexToUse >= remainingNumbers.length) {
      console.log('Индекс ставки превышает количество оставшихся чисел, сброс на 0.');
      currentBetIndexToUse = 0;
      settings.currentBetIndex = 0;
      GM_setValue('currentBetIndex', 0);
    }

    const number = remainingNumbers[currentBetIndexToUse];
    let betAmount = settings.currentBetAmount;
    if (betAmount === null || betAmount === undefined) {
      const numbersToBetOnThisTurn = remainingNumbers.length;
      betAmount = Math.floor((maxBet - totalExistingBets) / numbersToBetOnThisTurn);
      const minBet = getMinBet();
      if (minBet !== null && betAmount < minBet) {
        console.log(`Рассчитанная ставка ${betAmount} меньше минимальной ${minBet}. Используем минимальную.`);
        betAmount = minBet;
      }
    }

    if (number === undefined) {
      console.error('Критическая ошибка: Не удалось определить номер для ставки по индексу', currentBetIndexToUse);
      resetCycleState();
      return;
    }

    const pendingBetsList = remainingNumbers.filter(n => n !== number);
    console.log('Осталось чисел для ставок (pending):', pendingBetsList.join(', '));

    if (!checkBalance(betAmount)) {
      return;
    }

    GM_setValue('pendingBets', pendingBetsList);
    console.log('Сохранены незавершенные ставки:', pendingBetsList);
    GM_setValue('currentBetIndex', currentBetIndexToUse);

    clickOnImageAndSetBet(number, betAmount);
  }

  function scheduleCycleEvents() {
    if (cycleEventsScheduled) {
      console.log('События цикла уже запланированы');
      return;
    }

    cycleEventsScheduled = true;

    getMoscowTime(now => {
      if (!now) {
        console.error('scheduleCycleEvents: Не удалось получить текущее время. Повторная попытка через 30 секунд.');
        cycleEventsScheduled = false;
        setTimeout(scheduleCycleEvents, 30000);
        return;
      }

      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const currentCycle = Math.floor(minutes / 5);
      const nextCycleMinute = (currentCycle + 1) * 5;
      const currentCycleMinute = currentCycle * 5;

      let timeToDataFetch;
      if (minutes === currentCycleMinute && seconds < 20) {
        timeToDataFetch = (20 - seconds) * 1000 - now.getMilliseconds();
      } else {
        timeToDataFetch = ((nextCycleMinute - minutes) * 60 - seconds + 20) * 1000 - now.getMilliseconds();
      }

      let timeToBetting;
      if (minutes === currentCycleMinute && seconds < 30) {
        timeToBetting = (30 - seconds) * 1000 - now.getMilliseconds();
      } else {
        timeToBetting = ((nextCycleMinute - minutes) * 60 - seconds + 30) * 1000 - now.getMilliseconds();
      }

      if (timeToDataFetch < 0) timeToDataFetch = 5 * 60 * 1000 + 20 * 1000;
      if (timeToBetting < 0) timeToBetting = 5 * 60 * 1000 + 30 * 1000;

      if (settings.randomScriptEnabled || settings.logicBetEnabled) {
        const nextFetchDate = new Date(now.getTime() + timeToDataFetch);
        setTimeout(() => {
          if (settings.randomScriptEnabled) {
            fetchBettingData(() => {});
          }

          if (settings.logicBetEnabled) {
            findWinningNumber(winningNumber => {
              if (winningNumber) {
                console.log(`Выпавшее число: ${winningNumber}`);
                if (settings.bettingLogic[winningNumber]) {
                  settings.chosenNumbers = settings.bettingLogic[winningNumber];
                  GM_setValue('chosenNumbers', settings.chosenNumbers);
                  console.log(`Ставки на: ${settings.chosenNumbers.join(', ')}`);
                } else {
                  settings.chosenNumbers = [];
                  GM_setValue('chosenNumbers', []);
                  console.log(`Для числа ${winningNumber} нет логики ставок. Пропускаем цикл.`);
                  resetCycleState();
                }
              } else {
                settings.chosenNumbers = [];
                GM_setValue('chosenNumbers', []);
                console.log('Не удалось определить выпавшее число. Пропускаем цикл.');
                resetCycleState();
              }
            });
          }
        }, timeToDataFetch);
      }

      const nextBettingProcessStartDate = new Date(now.getTime() + timeToBetting);
      console.log(
        `Начало процесса ставок запланировано на ${nextBettingProcessStartDate.getHours()}:${nextBettingProcessStartDate
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${nextBettingProcessStartDate.getSeconds().toString().padStart(2, '0')}`
      );

      setTimeout(() => {
        const initialRandomDelay = calculateRandomInterval();
        const firstBetTime = new Date(Date.now() + initialRandomDelay);
        console.log(
          `Первая ставка цикла будет сделана примерно через ${initialRandomDelay / 1000}с в ${firstBetTime.getHours()}:${firstBetTime
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${firstBetTime.getSeconds().toString().padStart(2, '0')}`
        );

        setTimeout(() => {
          console.log('Время для первой ставки настало.');
          if (settings.fixedBetEnabled) {
            setupFixedBets();
          }

          if (settings.logicBetEnabled) {
            settings.chosenNumbers = GM_getValue('chosenNumbers', []);
            if (settings.chosenNumbers.length === 0) {
              console.log('Не найдены числа для логической ставки перед scheduleBets, повторная проверка...');
              findWinningNumber(winningNumber => {
                if (winningNumber && settings.bettingLogic[winningNumber]) {
                  settings.chosenNumbers = settings.bettingLogic[winningNumber];
                  GM_setValue('chosenNumbers', settings.chosenNumbers);
                  console.log(`Срочное получение чисел для ставок по логике: ${settings.chosenNumbers.join(', ')}`);
                  scheduleBets();
                } else {
                  settings.chosenNumbers = [];
                  GM_setValue('chosenNumbers', []);
                  console.log('Не удалось определить выпавшее число или для него нет логики ставок. Пропускаем цикл ставок.');
                  cycleEventsScheduled = false;
                  setTimeout(() => {
                    scheduleCycleEvents();
                  }, 270000);
                }
              });
              return;
            }
          }

          scheduleBets();

          cycleEventsScheduled = false;
          setTimeout(() => {
            scheduleCycleEvents();
          }, 270000);
        }, initialRandomDelay);
      }, timeToBetting);
    });
  }

  function resetCycleState() {
    settings.chosenNumbers = [];
    settings.placedBets = [];
    settings.currentBetIndex = 0;
    settings.currentBetAmount = null;
    settings.missingBets = [];

    GM_setValue('chosenNumbers', settings.chosenNumbers);
    GM_setValue('placedBets', settings.placedBets);
    GM_setValue('currentBetIndex', settings.currentBetIndex);
    GM_setValue('currentBetAmount', settings.currentBetAmount);
    GM_setValue('pendingBets', []);
    GM_setValue('alreadyPlacedBets', false);
    GM_setValue('lastBetTime', 0);
    GM_setValue('lastFetchTime', 0);
    GM_setValue('lastCycleTime', 0);
  }

  function calculateRandomInterval() {
    return Math.floor(Math.random() * (settings.maxBetInterval - settings.minBetInterval + 1) + settings.minBetInterval) * 1000;
  }

  function setupFixedBets() {
    settings.chosenNumbers = settings.fixedBetNumber.split(',').map(num => num.trim());
    GM_setValue('chosenNumbers', settings.chosenNumbers);
    console.log('Фиксированные числа для ставок установлены:', settings.chosenNumbers.join(', '));
  }

  function confirmPreviousBetAndProceed() {
    const intendedBet = GM_getValue('intendedBet', null);

    if (intendedBet) {
      console.log('Обнаружена ожидаемая ставка:', intendedBet);
      GM_setValue('intendedBet', null);

      setTimeout(() => {
        const existingBets = getExistingBets();
        let confirmed = false;

        if (existingBets[intendedBet.number]) {
          confirmed = true;
        }

        if (confirmed) {
          console.log(`Ставка ${intendedBet.amount} на ${intendedBet.number} подтверждена после перезагрузки.`);
          settings.lastBetTime = new Date().getTime();
          settings.placedBets.push(intendedBet);
          settings.currentBetIndex = GM_getValue('currentBetIndex', 0) + 1;

          GM_setValue('currentBetIndex', settings.currentBetIndex);
          saveState();

          const pendingBets = GM_getValue('pendingBets', []);
          if (pendingBets.length > 0) {
            console.log(`Продолжение цикла ставок, осталось: ${pendingBets.join(', ')}`);
            settings.chosenNumbers = pendingBets;
            settings.currentBetIndex = 0;
            GM_setValue('currentBetIndex', 0);
            saveState();

            const randomDelay = calculateRandomInterval();
            console.log(`Следующая ставка из pendingBets через ${randomDelay / 1000} сек`);
            setTimeout(() => placeBet(0), randomDelay);
          } else {
            console.log('Цикл ставок завершен после подтверждения последней ставки.');
            GM_setValue('currentBetAmount', null);

            settings.betCycles = settings.betCycles - 1;
            GM_setValue('betCycles', settings.betCycles);
            console.log(`Цикл ставок завершен. Осталось циклов: ${settings.betCycles}`);
            if (settings.betCycles <= 0) {
              console.log('Достигнут лимит циклов. Отключение.');
              disableScript();
            }
          }
        } else {
          console.error(`Не удалось подтвердить ставку ${intendedBet.amount} на ${intendedBet.number} после перезагрузки.`);
          GM_setValue('pendingBets', []);
        }
      }, 1500);

      return true;
    }
    return false;
  }

  function main() {
    loadState();

    const confirmationRun = confirmPreviousBetAndProceed();

    if (confirmationRun) {
      console.log('Обработка подтверждения ставки завершена или запущена. Ожидание результата...');
    } else {
      console.log('Ожидаемая ставка не найдена, стандартный запуск.');

      const pendingBets = GM_getValue('pendingBets', []);
      if (pendingBets.length > 0) {
        console.log(`Обнаружены старые незавершенные ставки: ${pendingBets.join(', ')}. Попытка продолжить...`);
        settings.chosenNumbers = pendingBets;
        settings.currentBetIndex = 0;

        getMoscowTime(now => {
          if (now) {
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            const currentCycle = Math.floor(minutes / 5);
            const currentCycleMinute = currentCycle * 5;

            if (
              (minutes === currentCycleMinute && seconds >= 30) ||
              (minutes > currentCycleMinute && minutes < currentCycleMinute + 4) ||
              (minutes === currentCycleMinute + 4 && seconds < 40)
            ) {
              const randomDelay = calculateRandomInterval();
              console.log(`Продолжение старого цикла ставок через ${randomDelay / 1000} сек`);
              setTimeout(() => {
                placeBet(0);
              }, randomDelay);
            } else {
              console.log('Текущее время не подходит для продолжения старого цикла ставок. Очистка pendingBets.');
              GM_setValue('pendingBets', []);
            }
          } else {
            console.log('Не удалось получить время, очистка старых pendingBets.');
            GM_setValue('pendingBets', []);
          }
        });
        return;
      }

      if (settings.logicBetEnabled) {
        loadBettingLogic();
      }

      getMoscowTime(now => {
        if (!now) {
          console.log('Не удалось получить текущее время для начальной проверки');
          scheduleCycleEvents();
          return;
        }

        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const currentCycle = Math.floor(minutes / 5);
        const currentCycleMinute = currentCycle * 5;

        if (minutes === currentCycleMinute && seconds >= 20 && seconds < 30) {
          console.log('Скрипт запущен в окно запроса данных (20-30 сек). Запрос данных...');
          if (settings.randomScriptEnabled) {
            fetchBettingData(() => {
              console.log('Данные для случайных ставок получены при инициализации');
            });
          }
          if (settings.logicBetEnabled) {
            findWinningNumber(winningNumber => {
              if (winningNumber && settings.bettingLogic[winningNumber]) {
                settings.chosenNumbers = settings.bettingLogic[winningNumber];
                GM_setValue('chosenNumbers', settings.chosenNumbers);
                console.log(`Числа для ставок по логике при инициализации: ${settings.chosenNumbers.join(', ')}`);
              } else {
                settings.chosenNumbers = [];
                GM_setValue('chosenNumbers', []);
                console.log('Не удалось определить выпавшее число или для него нет логики ставок (инициализация).');
                resetCycleState();
              }
            });
          }
        }
      });

      scheduleWinningNumberCheck();
      scheduleCycleEvents();
    }
  }

  main();
})();
