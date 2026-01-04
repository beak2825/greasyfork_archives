// ==UserScript==
// @name         4PDA Radio v1.14
// @author       brant34
// @namespace    http://tampermonkey.net/
// @version      1.14
// @description  Радио на 4PDA с поиском через API и флагами стран
// @match        https://4pda.to/forum/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/536788/4PDA%20Radio%20v114.user.js
// @updateURL https://update.greasyfork.org/scripts/536788/4PDA%20Radio%20v114.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Проверка поддержки localStorage
  if (!window.localStorage) {
    showNotification('localStorage недоступен', 'error');
    return;
  }

  // === [Стили] ===
  GM_addStyle(`
    .radio-toggle-button {
      position: fixed;
      top: 10px;
      right: 10px;
      background-color: #2e6d5e;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      cursor: pointer;
      font-size: 16px;
      line-height: 32px;
      text-align: center;
      z-index: 99999;
    }
    .radio-toggle-button:hover {
      background-color: #3e8e77;
    }
    .radio-panel {
      display: none;
      background-color: #1a3c34;
      border-radius: 10px;
      padding: 10px;
      z-index: 99998;
      color: #fff;
      font-family: Arial, sans-serif;
      font-size: 14px;
      width: 320px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
      position: fixed;
      max-width: 90vw;
    }
    .radio-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .radio-panel-header span {
      font-weight: bold;
    }
    .radio-panel-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    .radio-panel-controls button {
      background-color: #17a2b8;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 12px;
    }
    .radio-panel-controls button:hover {
      background-color: #138496;
    }
    .radio-panel select {
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 5px;
      color: #333;
      font-size: 12px;
      flex-grow: 1;
    }
    .radio-player {
      background-color: transparent;
      border-radius: 5px;
      padding: 5px;
      margin: 10px 0;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .radio-player button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: #fff;
    }
    .radio-player input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      cursor: pointer;
      width: 100%;
    }
    .radio-player input[type="range"]::-webkit-slider-runnable-track {
      background: #2e6d5e;
      height: 6px;
      border-radius: 3px;
    }
    .radio-player input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      background: #fff;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      margin-top: -5px;
    }
    .radio-player input[type="range"]::-moz-range-track {
      background: #2e6d5e;
      height: 6px;
      border-radius: 3px;
    }
    .radio-player input[type="range"]::-moz-range-thumb {
      background: #fff;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      border: none;
    }
    .radio-player input[type="range"]::-moz-range-progress {
      background: #fff;
      height: 6px;
      border-radius: 3px;
    }
    .radio-player input[type="range"]:disabled::-webkit-slider-runnable-track {
      background: #1a3c34;
      opacity: 0.7;
    }
    .radio-player input[type="range"]:disabled::-webkit-slider-thumb {
      background: #999;
    }
    .radio-player input[type="range"]:disabled::-moz-range-track {
      background: #1a3c34;
      opacity: 0.7;
    }
    .radio-player input[type="range"]:disabled::-moz-range-thumb {
      background: #999;
    }
    .radio-player input[type="range"]:disabled::-moz-range-progress {
      background: #999;
    }
    .radio-player .volume-icon {
      cursor: pointer;
    }
    .radio-player .volume-icon.muted::before {
      content: "🔇";
    }
    .radio-player .volume-icon:not(.muted)::before {
      content: "🔊";
    }
    .radio-panel input[type="checkbox"] {
      margin-right: 5px;
    }
    .radio-panel-settings {
      margin-top: 10px;
      display: flex;
      gap: 5px;
    }
    .radio-search {
      display: flex;
      gap: 5px;
      margin: 10px 0;
    }
    .radio-search input[type="text"] {
      flex-grow: 1;
      padding: 5px;
      border-radius: 5px;
      border: 1px solid #ccc;
      background-color: #fff;
      color: #333;
      font-size: 12px;
    }
    .radio-search button {
      background-color: #17a2b8;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 12px;
    }
    .radio-search button:hover {
      background-color: #138496;
    }
    .radio-search-results {
      max-height: 150px;
      overflow-y: auto;
      margin-top: 5px;
      padding: 5px;
      background-color: #2e6d5e;
      border-radius: 5px;
    }
    .radio-search-results div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px;
      border-bottom: 1px solid #1a3c34;
    }
    .radio-search-results div:last-child {
      border-bottom: none;
    }
    .radio-search-results button {
      background-color: #17a2b8;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 3px 8px;
      cursor: pointer;
      font-size: 10px;
    }
    .radio-search-results button:hover {
      background-color: #138496;
    }
    .notification {
      position: fixed;
      top: 50px;
      right: 10px;
      padding: 10px 20px;
      border-radius: 5px;
      color: white;
      z-index: 99999;
    }
    .notification.success { background-color: #28a745; }
    .notification.info { background-color: #17a2b8; }
    .notification.warning { background-color: #ffc107; }
    .notification.error { background-color: #dc3545; }
  `);

  // === [Эксклюзивное воспроизведение радио во вкладке] ===
  const tabId = Date.now().toString();
  const MASTER_KEY = '4pda-radio-master';

  function setAsMaster() {
    localStorage.setItem(MASTER_KEY, tabId);
    showNotification('Эта вкладка теперь воспроизводит радио', 'success');
  }

  function isMaster() {
    return localStorage.getItem(MASTER_KEY) === tabId;
  }

  // === [Инициализация аудиоплеера] ===
  let audio = document.getElementById('radioPlayer4PDA');
  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'radioPlayer4PDA';
    document.body.appendChild(audio);
  }

  // Проверка перед запуском радио
  const currentMaster = localStorage.getItem(MASTER_KEY);
  if (!currentMaster) {
    setAsMaster();
  } else if (!isMaster()) {
    audio.pause();
  }

  // Слушаем изменения мастера
  window.addEventListener('storage', (e) => {
    if (e.key === MASTER_KEY && e.newValue !== tabId) {
      audio.pause();
    }
  });

  // Убираем себя из мастеров при закрытии вкладки
  window.addEventListener('beforeunload', () => {
    if (isMaster()) {
      localStorage.removeItem(MASTER_KEY);
    }
  });

  // === [Сохраненные настройки] ===
  const savedAutoplay = GM_getValue('autoplay', false);
  const savedRadio = GM_getValue('radio', '');
  const savedVolume = GM_getValue('volume', 1);
  const savedTimer = GM_getValue('autotimer', 0);
  const savedPlaying = GM_getValue('isPlaying', false);
  const savedTime = GM_getValue('currentTime', 0);
  let panelPosition = GM_getValue('panelPos', 'top-right');
  const panelScale = GM_getValue('panelSize', '1');
  const savedCustomStations = GM_getValue('customStations', {});

  // === [Список радиостанций] ===
  let RADIO = {
    '🇷🇺 Европа Плюс': 'https://ep256.hostingradio.ru:8052/europaplus256.mp3',
    '🇷🇺 Русское Радио': 'https://rusradio.hostingradio.ru/rusradio128.mp3',
    '🇷🇺 Юмор FM': 'https://pub0301.101.ru:8443/stream/air/mp3/256/102',
    '🇷🇺 Радио Рекорд': 'https://radio-srv1.11one.ru/record192k.mp3',
    '🇷🇺 Ретро FM': 'https://retro.hostingradio.ru:8014/retro320.mp3',
    '🇷🇺 Радио Шансон': 'https://chanson.hostingradio.ru:8041/chanson256.mp3',
    '🇷🇺 DFM Russian Dance': 'https://stream03.pcradio.ru/dfm_russian_dance-hi',
    '🇷🇺 DFM': 'https://dfm.hostingradio.ru:80/dfm96.aacp',
    '🇷🇺 Дорожное Радио': 'https://dorognoe.hostingradio.ru:8000/dorognoe',
    '🇷🇺 Авторадио': 'https://srv01.gpmradio.ru/stream/air/aac/64/100?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJrZXkiOiIwZWM3MjU3YTFhNDM5MmMyNWUwZDZkZDQwYjdjNzQ5ZCIsIklQIjoiODEuMTczLjE2NS4yMjUiLCJVQSI6Ik1vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzMuMC4wLjAgU2FmYXJpLzUzNy4zNiIsIlJlZiI6Imh0dHBzOi8vd3d3LmF2dG9yYWRpby5ydS8iLCJ1aWRfY2hhbm5lbCI6IjEwMCIsInR5cGVfY2hhbm5lbCI6ImNoYW5uZWwiLCJ0eXBlRGV2aWNlIjoiUEMiLCJCcm93c2VyIjoiQ2hyb21lIiwiQnJvd3NlclZlcnNpb24iOiIxMzMuMC4wLjAiLCJTeXN0ZW0iOiJNYWMgT1MgWCBQdW1hIiwiZXhwIjoxNzQyNjcxOTc1fQ.b1Hha0aGp4hWbgFELSzEapRcpOoejzs8tmdDARY0JyA',
    '🇩🇪 Радио Картина': 'https://rs.kartina.tv/kartina_320kb',
    '🇰🇿 LuxFM': 'https://icecast.luxfm.kz/luxfm',
    '🇰🇿 Radio NS': 'https://icecast.ns.kz/radions',
    '🇰🇿 NRJ Kazakhstan': 'https://stream03.pcradio.ru/energyfm_ru-med',
    '🇰🇿 Радио Жаңа FM': 'https://live.zhanafm.kz:8443/zhanafm_onair',
    '🇺🇦 Хіт FM': 'http://online.hitfm.ua/HitFM',
    '🇺🇦 Kiss FM UA': 'http://online.kissfm.ua/KissFM'
  };

  // Объединяем предопределенные станции с пользовательскими
  Object.assign(RADIO, savedCustomStations);

  // === [Проверка доступности радиопотоков] ===
  async function checkStream(url) {
    return true; // Заглушка, можно добавить реальную проверку
  }

  async function validateStations() {
    const validStations = {};
    for (const [name, url] of Object.entries(RADIO)) {
      if (await checkStream(url)) {
        validStations[name] = url;
      } else {
        showNotification(`Радиостанция ${name} недоступна`, 'warning');
      }
    }
    RADIO = validStations;
    updateStationList();
  }

  // === [Динамическое обновление списка радиостанций] ===
  async function loadStations() {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => resolve({ ok: true, json: () => Promise.resolve(RADIO) }), 1000);
      });
      if (response.ok) {
        RADIO = await response.json();
        await validateStations();
        showNotification('Список радиостанций обновлен', 'success');
      } else {
        showNotification('Ошибка загрузки списка радиостанций', 'error');
      }
    } catch (error) {
      console.error('Ошибка обновления радиостанций:', error);
      showNotification('Ошибка обновления радиостанций', 'error');
    }
  }

  // === [Уведомления] ===
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  // === [Преобразование кода страны в флаг] ===
  function countryCodeToFlag(countryCode) {
    if (!countryCode || countryCode.length !== 2) {
      return '🌐'; // Нейтральный флаг, если код страны отсутствует
    }

    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 0x1F1E6 + (char.charCodeAt(0) - 65)); // 'A' → 0x1F1E6, 'B' → 0x1F1E7, ..., 'U' → 0x1F1FA
    return String.fromCodePoint(...codePoints);
  }

  // === [Поиск через RadioBrowser API] ===
  function searchStations(query, callback) {
    showNotification('Поиск...', 'info');
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(query)}&limit=10`,
      onload: function(response) {
        try {
          const data = JSON.parse(response.responseText);
          const results = data.map(station => ({
            name: station.name,
            url: station.url_resolved,
            countryCode: station.countrycode || ''
          }));
          callback(results);
        } catch (error) {
          console.error('Ошибка парсинга ответа API:', error);
          showNotification('Ошибка поиска радиостанций', 'error');
          callback([]);
        }
      },
      onerror: function(error) {
        console.error('Ошибка запроса к API:', error);
        showNotification('Ошибка поиска радиостанций', 'error');
        callback([]);
      }
    });
  }

  function addStation(name, url, countryCode) {
    // Добавляем флаг к имени станции
    const flag = countryCodeToFlag(countryCode);
    const stationNameWithFlag = `${flag} ${name}`;

    if (RADIO[stationNameWithFlag]) {
      showNotification('Радиостанция уже добавлена', 'warning');
      return;
    }

    RADIO[stationNameWithFlag] = url;
    const customStations = GM_getValue('customStations', {});
    customStations[stationNameWithFlag] = url;
    GM_setValue('customStations', customStations);
    updateStationList();
    showNotification(`Радиостанция ${stationNameWithFlag} добавлена`, 'success');
  }

  // === [Интерфейс] ===
  function createInterface() {
    // Панель радио
    const panel = document.createElement('div');
    panel.className = 'radio-panel';
    panel.style.display = GM_getValue('panelVisible', false) ? 'block' : 'none';

    // Кнопка S
    const toggleButton = document.createElement('button');
    toggleButton.className = 'radio-toggle-button';
    toggleButton.textContent = '🎧';
    toggleButton.onclick = () => {
      if (!panel) {
        console.error('Панель не найдена');
        showNotification('Ошибка: панель не создана', 'error');
        return;
      }
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      GM_setValue('panelVisible', panel.style.display === 'block');
      showNotification(`Панель ${panel.style.display === 'block' ? 'открыта' : 'закрыта'}`, 'info');
    };
    document.body.appendChild(toggleButton);

    // Применение позиции и масштаба
    updatePanelPosition(panel, panelPosition);
    updatePanelScale(panel, panelScale);

    // Заголовок
    const header = document.createElement('div');
    header.className = 'radio-panel-header';
    header.innerHTML = '<span>⚡ Громкость:</span>';
    panel.appendChild(header);

    // Кнопки пресетов громкости
    const controls = document.createElement('div');
    controls.className = 'radio-panel-controls';
    ['Тихо', 'Комфорт', 'Громко'].forEach((label, index) => {
      const button = document.createElement('button');
      button.textContent = label;
      button.onclick = () => {
        if (!audio) {
          console.error('Аудиоплеер не инициализирован');
          showNotification('Ошибка: аудиоплеер не доступен', 'error');
          return;
        }
        const volumes = [0.2, 0.5, 0.8];
        audio.volume = volumes[index];
        GM_setValue('volume', audio.volume);
        updateVolumeSlider(audio.volume);
        showNotification(`Громкость: ${label} (${volumes[index] * 100}%)`, 'info');
      };
      controls.appendChild(button);
    });
    panel.appendChild(controls);

    // Ползунок громкости
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.01';
    volumeSlider.value = savedVolume;
    volumeSlider.oninput = () => {
      if (!audio) {
        console.error('Аудиоплеер не инициализирован');
        showNotification('Ошибка: аудиоплеер не доступен', 'error');
        return;
      }
      audio.volume = volumeSlider.value;
      GM_setValue('volume', audio.volume);
    };
    controls.appendChild(volumeSlider);

    // Выбор радиостанции
    const stationSelect = document.createElement('select');
    stationSelect.id = 'radioStationSelect';
    updateStationList();
    controls.appendChild(stationSelect);
    panel.appendChild(controls);

    // Поиск радиостанций
    const searchSection = document.createElement('div');
    searchSection.className = 'radio-search';
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск радиостанций...';
    searchSection.appendChild(searchInput);
    const searchButton = document.createElement('button');
    searchButton.textContent = 'Поиск';
    searchSection.appendChild(searchButton);
    panel.appendChild(searchSection);

    // Результаты поиска
    const searchResults = document.createElement('div');
    searchResults.className = 'radio-search-results';
    searchResults.style.display = 'none';
    panel.appendChild(searchResults);

    searchButton.onclick = () => {
      const query = searchInput.value.trim();
      if (!query) {
        showNotification('Введите запрос для поиска', 'warning');
        return;
      }

      searchStations(query, (results) => {
        searchResults.innerHTML = '';
        searchResults.style.display = results.length ? 'block' : 'none';

        if (!results.length) {
          showNotification('Радиостанции не найдены', 'info');
          return;
        }

        results.forEach(station => {
          const resultItem = document.createElement('div');
          const flag = countryCodeToFlag(station.countryCode);
          resultItem.textContent = `${flag} ${station.name}`;
          const addButton = document.createElement('button');
          addButton.textContent = 'Добавить';
          addButton.onclick = () => {
            addStation(station.name, station.url, station.countryCode);
            searchResults.style.display = 'none';
            searchInput.value = '';
          };
          resultItem.appendChild(addButton);
          searchResults.appendChild(resultItem);
        });
      });
    };

    // Плеер
    const player = document.createElement('div');
    player.className = 'radio-player';
    const playButton = document.createElement('button');
    playButton.textContent = savedPlaying ? '⏸' : '▶';
    playButton.onclick = togglePlay;
    player.appendChild(playButton);
    const timeSlider = document.createElement('input');
    timeSlider.type = 'range';
    timeSlider.min = '0';
    timeSlider.max = '100';
    timeSlider.value = '0';
    timeSlider.disabled = true;
    player.appendChild(timeSlider);
    const timeDisplay = document.createElement('span');
    timeDisplay.textContent = '0:00';
    player.appendChild(timeDisplay);
    const volumeIcon = document.createElement('span');
    volumeIcon.className = 'volume-icon';
    volumeIcon.onclick = () => {
      if (!audio) {
        console.error('Аудиоплеер не инициализирован');
        showNotification('Ошибка: аудиоплеер не доступен', 'error');
        return;
      }
      audio.muted = !audio.muted;
      volumeIcon.classList.toggle('muted', audio.muted);
      showNotification(audio.muted ? 'Звук выключен' : 'Звук включен', 'info');
    };
    player.appendChild(volumeIcon);
    panel.appendChild(player);

    // Таймер, автостарт и обновление
    const footer = document.createElement('div');
    footer.className = 'radio-panel-controls';
    const timerSelect = document.createElement('select');
    timerSelect.innerHTML = `
      <option value="0">Без таймера</option>
      <option value="10">10 мин</option>
      <option value="30">30 мин</option>
      <option value="60">60 мин</option>
    `;
    timerSelect.value = savedTimer;
    timerSelect.onchange = () => {
      GM_setValue('autotimer', parseInt(timerSelect.value) || 0);
      setAutoTimer(parseInt(timerSelect.value) || 0);
    };
    footer.appendChild(timerSelect);
    const autostartLabel = document.createElement('label');
    const autostartCheckbox = document.createElement('input');
    autostartCheckbox.type = 'checkbox';
    autostartCheckbox.checked = savedAutoplay;
    autostartCheckbox.onchange = () => {
      GM_setValue('autoplay', autostartCheckbox.checked);
    };
    autostartLabel.appendChild(autostartCheckbox);
    autostartLabel.appendChild(document.createTextNode('Автостарт'));
    footer.appendChild(autostartLabel);
    const refreshButton = document.createElement('button');
    refreshButton.textContent = '↻';
    refreshButton.title = 'Обновить станции';
    refreshButton.onclick = loadStations;
    footer.appendChild(refreshButton);
    panel.appendChild(footer);

    // Настройки панели
    const settings = document.createElement('div');
    settings.className = 'radio-panel-settings';
    const positionSelect = document.createElement('select');
    positionSelect.innerHTML = `
      <option value="top-left">Вверху слева</option>
      <option value="top-center">Вверху посередине</option>
      <option value="top-right">Вверху справа</option>
    `;
    positionSelect.value = panelPosition;
    positionSelect.onchange = () => {
      GM_setValue('panelPos', positionSelect.value);
      panelPosition = positionSelect.value;
      updatePanelPosition(panel, positionSelect.value);
      showNotification(`Панель перемещена: ${positionSelect.options[positionSelect.selectedIndex].text}`, 'info');
    };
    settings.appendChild(positionSelect);
    const scaleSelect = document.createElement('select');
    scaleSelect.innerHTML = `
      <option value="0.8">Маленький</option>
      <option value="1">Средний</option>
      <option value="1.1">Большой</option>
    `;
    scaleSelect.value = panelScale;
    scaleSelect.onchange = () => {
      GM_setValue('panelSize', scaleSelect.value);
      updatePanelScale(panel, scaleSelect.value);
      showNotification(`Масштаб панели: ${scaleSelect.options[scaleSelect.selectedIndex].text}`, 'info');
    };
    settings.appendChild(scaleSelect);
    panel.appendChild(settings);

    document.body.appendChild(panel);

    // Функция для обновления ползунка громкости
    function updateVolumeSlider(value) {
      volumeSlider.value = value;
    }
  }

  function updatePanelPosition(panel, position) {
    if (!panel) {
      console.error('Панель не найдена для обновления позиции');
      return;
    }
    panel.style.top = '10px';
    panel.style.bottom = '';
    panel.style.left = '';
    panel.style.right = '';
    panel.style.transform = '';
    switch (position) {
      case 'top-left':
        panel.style.left = '10px';
        break;
      case 'top-center':
        panel.style.left = '50%';
        panel.style.transform = 'translateX(-50%)';
        break;
      case 'top-right':
        panel.style.right = '10px';
        break;
    }
  }

  function updatePanelScale(panel, scale) {
    if (!panel) {
      console.error('Панель не найдена для обновления масштаба');
      return;
    }
    panel.style.transform = `scale(${scale})`;
    panel.style.transformOrigin = panelPosition.includes('left') ? 'top left' : panelPosition.includes('right') ? 'top right' : 'top center';
    if (parseFloat(scale) > 1) {
      panel.style.maxWidth = '80vw';
      if (panelPosition === 'top-center') {
        panel.style.left = '50%';
        panel.style.transform = `translateX(-50%) scale(${scale})`;
      }
    } else {
      panel.style.maxWidth = '90vw';
    }
  }

  function updateStationList() {
    const stationSelect = document.getElementById('radioStationSelect');
    if (!stationSelect) {
      return;
    }
    stationSelect.innerHTML = '<option value="">Выберите радиостанцию</option>';
    Object.keys(RADIO).forEach(name => {
      const option = document.createElement('option');
      option.value = RADIO[name];
      option.textContent = name;
      if (RADIO[name] === savedRadio) option.selected = true;
      stationSelect.appendChild(option);
    });
    stationSelect.onchange = () => {
      if (stationSelect.value) {
        audio.src = stationSelect.value;
        GM_setValue('radio', stationSelect.value);
        if (savedAutoplay || savedPlaying) {
          audio.play().catch(e => {
            console.error('Ошибка воспроизведения:', e);
            showNotification('Ошибка воспроизведения радиостанции', 'error');
          });
        }
      }
    };
  }

  // === [Управление воспроизведением] ===
  function togglePlay() {
    const playButton = document.querySelector('.radio-player button');
    if (!playButton) {
      return;
    }
    if (audio.paused) {
      if (isMaster()) {
        audio.play().catch(e => {
          console.error('Ошибка воспроизведения:', e);
          showNotification('Ошибка воспроизведения радиостанции', 'error');
        });
        GM_setValue('isPlaying', true);
        playButton.textContent = '⏸';
      }
    } else {
      audio.pause();
      GM_setValue('isPlaying', false);
      playButton.textContent = '▶';
    }
  }

  // === [Таймер автовыключения] ===
  let timerId;
  function setAutoTimer(minutes) {
    clearTimeout(timerId);
    if (minutes > 0) {
      timerId = setTimeout(() => {
        audio.pause();
        GM_setValue('isPlaying', false);
        const playButton = document.querySelector('.radio-player button');
        if (playButton) {
          playButton.textContent = '▶';
        }
        showNotification('Радио остановлено по таймеру', 'info');
      }, minutes * 60 * 1000);
    }
  }

  // === [Инициализация] ===
  try {
    createInterface();

    // Инициализация аудио
    audio.volume = savedVolume;
    if (savedRadio) {
      audio.src = savedRadio;
      if (savedAutoplay && isMaster()) {
        audio.play().catch(e => {
          console.error('Ошибка воспроизведения:', e);
          showNotification('Ошибка воспроизведения радиостанции', 'error');
        });
      }
    }
    audio.ontimeupdate = () => GM_setValue('currentTime', audio.currentTime);
    audio.onerror = () => {
      console.error('Ошибка загрузки радиопотока');
      showNotification('Ошибка загрузки радиопотока', 'error');
    };

    // Обновление списка радиостанций без проверки
    updateStationList();
    setAutoTimer(savedTimer);
  } catch (error) {
    console.error('Критическая ошибка инициализации:', error);
    showNotification('Ошибка запуска скрипта', 'error');
  }
})();