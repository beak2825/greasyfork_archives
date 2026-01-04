// ==UserScript==
// @name         VPN IP & User Tracker
// @namespace    http://tampermonkey.net/
// @version      16
// @description  Централизованно собирает ник, IP, сервер VPN с наглядным информационным индикатором и лидерством вкладок.
// @author       You
// @match        https://asstars.tv/*
// @match        https://animestars.org/*
// @match        https://astars.club/*
// @match        https://asstars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://as1.astars.club/*
// @match        https://as1.asstars.tv/*
// @match        https://as2.asstars.tv/*
// @match        https://asstars.online/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @connect      localhost
// @connect      api.ipify.org
// @downloadURL https://update.greasyfork.org/scripts/546574/VPN%20IP%20%20User%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/546574/VPN%20IP%20%20User%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Tab Leadership & Intervals ---
    const LEADER_KEY = 'vpn_tracker_leader_tab';
    const STATUS_KEY = 'vpn_tracker_last_status';
    const LEADER_TIMEOUT = 15000;
    const LEADER_HEARTBEAT_INTERVAL = 5000;
    const NOTIFICATION_POLL_INTERVAL = 15000;
    const SELF_IP_CHECK_INTERVAL_MIN = 25; // "Средняя" проверка каждые 25-35 минут
    const CONFLICT_SCAN_INTERVAL_MIN = 150; // "Тяжелая" проверка каждые 150-180 минут (2.5-3 часа)
    const MANUAL_IP_KEY = 'vpn_tracker_manual_ip'; // Ключ для хранения IP в localStorage

    const tabTimestamp = Date.now();
    const tabId = tabTimestamp.toString() + "_" + Math.random().toString(36).substr(2, 5);
    let isLeader = false;
    let leaderHeartbeatIntervalId = null; // Переименовано для ясности
    let leaderHealthTimeoutId = null; // ID для setTimeout у последователя
    let notificationPollIntervalId = null;
    let selfCheckTimeoutId = null;
    let conflictScanTimeoutId = null;
    const IP_APIS = [
        "https://api.ipify.org",
        "https://ipinfo.io/ip",
        "https://icanhazip.com",
        "https://seeip.org"
    ];

    GM_addStyle(`
        #vpn-status-indicator { position: fixed; top: 3px; right: 3px; width: 18px; height: 18px; border-radius: 50%; z-index: 9999; cursor: pointer; border: 2px solid rgba(0,0,0,0.3); box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: transform 0.2s, background-color 0.3s; }
        #vpn-status-indicator:hover { transform: scale(1.1); }
        .vpn-indicator-green { background-color: #4CAF50; }
        .vpn-indicator-red { background-color: #F44336; animation: pulse 1.5s infinite; }
        .vpn-indicator-orange { background-color: #FF9800; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); } 100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); } }
        #vpn-tracker-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10001; background: #1e1f22; padding: 20px; border-radius: 6px; border: 1px solid #4a2f3a; box-shadow: 0 0 15px rgba(180, 40, 70, 0.3); width: 540px; color: #b0b0b0; font-family: Arial, sans-serif; }
        #vpn-tracker-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; }
        #vpn-tracker-panel .input-group { margin-bottom: 10px; }
        #vpn-tracker-panel input[type="text"], #vpn-tracker-panel select { width: 100%; padding: 8px 10px; border-radius: 3px; border: 1px solid #33353a; background-color: #27292d; color: #b0b0b0; box-sizing: border-box; font-size: 0.9em; }
        #vpn-tracker-panel select { appearance: none; background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M4%206l4%204%204-4z%22%20fill%3D%22%23b0b0b0%22/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 8px center; padding-right: 30px; }
        #vpn-tracker-save-btn { color: #dadada; background-color: #c83a54; border: none; padding: 9px 15px; border-radius: 3px; cursor: pointer; font-weight: normal; font-size: 0.9em; width: 100%; margin-top: 8px; transition: background-color 0.2s; }
        #vpn-tracker-save-btn:hover { background-color: #b02c44; }
        #vpn-tracker-save-btn:disabled { background-color: #555; cursor: not-allowed; opacity: 0.7; }
        #vpn-ip-status { margin-top: 15px; padding: 10px; background-color: #27292d; border-radius: 3px; text-align: center; font-size: 0.9em; min-height: 20px; border: 1px solid #33353a; }
    `);


    // --- НОВЫЙ БЛОК: УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ДЛЯ ПОВТОРНЫХ ПОПЫТОК ---
    /**
     * Пытается выполнить асинхронную функцию до тех пор, пока она не завершится успешно.
     * @param {function(): Promise<any>} asyncFunction - Асинхронная функция для выполнения, которая должна возвращать Promise.
     * @param {string} functionName - Имя функции для логирования.
     * @param {number} delay - Задержка между попытками в миллисекундах.
     * @returns {Promise<any>} - Результат успешного выполнения функции.
     */
    async function retryUntilSuccess(asyncFunction, functionName, delay = 10000, maxAttempts = Infinity) {
        let attempt = 1;
        while (attempt <= maxAttempts) {
            try {
                const result = await asyncFunction();
                if (attempt > 1) {
                    // console.log(`VPN Tracker: Функция ${functionName} выполнена успешно с попытки №${attempt}.`);
                }
                return result;
            } catch (error) {
                if (attempt >= maxAttempts) {
                    throw error; // Превышен лимит попыток, выбрасываем ошибку дальше
                }
                // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
                // Показываем ошибку и переподключение, только если БУДЕТ следующая попытка
                if (attempt < maxAttempts) {
                    updateIndicator('orange', `Ошибка сети: ${error}. Идет переподключение...`, true);
                }
                attempt++;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }


    // --- Helper Functions ---
    const getUsername = () => document.querySelector('.lgn__name span')?.textContent.trim() || null;
    // Оригинальная функция получения IP. Она по-прежнему нужна.
    const getIpAddressInternal = (apiIndex = 0) => new Promise((resolve, reject) => {
        if (apiIndex >= IP_APIS.length) {
            // Перебрали все API, ни один не ответил
            return reject('All IP APIs failed');
        }
        const url = IP_APIS[apiIndex];
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            timeout: 7000, // Установим таймаут, чтобы не ждать слишком долго
            onload: (res) => {
                if (res.status >= 200 && res.status < 300 && res.responseText.trim().length > 6) {
                    resolve(res.responseText.trim());
                } else {
                    // Ошибка или пустой ответ, пробуем следующий API
                    resolve(getIpAddressInternal(apiIndex + 1));
                }
            },
            onerror: () => resolve(getIpAddressInternal(apiIndex + 1)), // Сетевая ошибка, пробуем следующий API
            ontimeout: () => resolve(getIpAddressInternal(apiIndex + 1)) // Таймаут, пробуем следующий API
        });
    });
    const getIpAddress = (maxAttempts = Infinity) => retryUntilSuccess(getIpAddressInternal, 'getIpAddress', 10000, maxAttempts);

    const getUserData = (username) => new Promise((resolve, reject) => GM_xmlhttpRequest({ method: "GET", url: `http://localhost:3000/get_user_data?username=${encodeURIComponent(username)}`, onload: (res) => (res.status === 200) ? resolve(JSON.parse(res.responseText)) : reject('Server Error'), onerror: () => reject('Server Unavailable'), ontimeout: () => reject('Server Timeout') }));
    // --- ИЗМЕНЕНО ---: Добавляем обертку с повторами и для этой функции, т.к. локальный сервер тоже может быть недоступен.
    const getUserDataWithRetry = (username) => retryUntilSuccess(() => getUserData(username), 'getUserData');


    const silentUpdateIp = (username, ip) => new Promise(resolve => GM_xmlhttpRequest({ method: "POST", url: "http://localhost:3000/update_user", data: JSON.stringify({ username, ip }), headers: { "Content-Type": "application/json" }, onload: res => resolve(res.status === 200), onerror: () => resolve(false) }));
    const getServerStatus = () => new Promise((resolve, reject) => GM_xmlhttpRequest({ method: "GET", url: "http://localhost:3000/get_server_status", onload: (res) => (res.status === 200) ? resolve(JSON.parse(res.responseText).data) : reject('Server Error') }));
    const checkIpConflict = (ip, currentUser) => new Promise(resolve => GM_xmlhttpRequest({ method: "GET", url: `http://localhost:3000/check_ip?ip=${ip}&currentUser=${encodeURIComponent(currentUser)}`, onload: res => (res.status === 200) ? resolve(JSON.parse(res.responseText)) : resolve({ status: 'error' }) }));
    const sendDataToServer = (username, ip, server) => GM_xmlhttpRequest({
        method: "POST", url: "http://localhost:3000/update_user", data: JSON.stringify({ username, ip, server }), headers: { "Content-Type": "application/json" },
        onload: (res) => {
            try {
                const data = JSON.parse(res.responseText);
                if (data.status.startsWith('success')) {
                    updateIndicator('ok', `Статус: OK. Данные сохранены.\nIP: ${ip}`);
                    alert(`✅ УСПЕХ!\n\nДанные сохранены:\nПользователь: ${username}\nIP: ${ip}\nСервер: ${server}`);
                    performFullConflictScan(false);
                } else {
                    alert(`❌ ОШИБКА!\n\n${data.message}`);
                }
                if (data.status === 'success_conflict') alert(`⚠️ ВНИМАНИЕ!\nВы создали конфликт с пользователем "${data.conflictedUser}". Ему отправлено уведомление.`);
            } catch (e) { console.error('Error parsing server response', e); }
        }
    });

    // --- Управление Индикатором ---
    let indicatorElement;
    function createIndicator() {
        if (document.getElementById('vpn-status-indicator')) return;
        indicatorElement = document.createElement('div');
        indicatorElement.id = 'vpn-status-indicator';
        document.body.appendChild(indicatorElement);
        indicatorElement.addEventListener('click', forceCheckAndUpdate);
    }
    function updateIndicator(state, message, broadcast = true) {
        if (!indicatorElement) return;
        indicatorElement.className = '';
        if (state === 'ok' || state === 'self') indicatorElement.classList.add('vpn-indicator-green');
        else if (state === 'conflict') indicatorElement.classList.add('vpn-indicator-red');
        else indicatorElement.classList.add('vpn-indicator-orange');
        indicatorElement.title = message;

        if (broadcast) {
            localStorage.setItem(STATUS_KEY, JSON.stringify({ state, message, timestamp: Date.now() }));
        }
    }

    // --- UI для выбора сервера ---
    function showChoicePanel(currentUser) {
        return new Promise(resolve => {
            document.querySelector('#vpn-tracker-panel')?.remove();
            document.querySelector('#vpn-tracker-overlay')?.remove();
            const overlay = document.createElement('div');
            overlay.id = 'vpn-tracker-overlay';
            const panel = document.createElement('div');
            panel.id = 'vpn-tracker-panel';
            panel.innerHTML = `
                <h3>Выбор VPN Сервера</h3>
                <div class="input-group"><h4>Выбрать из списка:</h4><select id="vpn-server-select"><option>Загрузка...</option></select></div>
                <div class="input-group"><h4>Или добавить свой:</h4><input type="text" id="vpn-custom-server-input" placeholder="Напр. Spain, Germany..."></div>
                <div id="vpn-ip-status">...</div>
                <div style="margin-top: 20px;"><button id="vpn-tracker-save-btn" disabled>Сохранить</button></div>`;
            document.body.appendChild(overlay); document.body.appendChild(panel);

            const selectEl = panel.querySelector('#vpn-server-select');
            const customInputEl = panel.querySelector('#vpn-custom-server-input');
            const saveBtn = panel.querySelector('#vpn-tracker-save-btn');
            const ipStatusEl = panel.querySelector('#vpn-ip-status');
            let currentIp = null;
            let serverStatusList = [];
            let isManualMode = false;

            const onSelectionChange = () => { saveBtn.disabled = !((selectEl.value || customInputEl.value.trim()) && currentIp); };

            getServerStatus().then(list => { serverStatusList = list; /* ... код загрузки серверов ... */ }).catch(err => { /*...*/ });
            // --- Сюда можно вставить ваш код для заполнения selectEl из предыдущей версии ---
            getServerStatus().then(list => {
                serverStatusList = list;
                selectEl.innerHTML = '<option value="" selected disabled>-- Выберите сервер --</option>'; const allServers = {}; for (let i = 1; i <= 55; i++) allServers[i] = null; serverStatusList.forEach(item => { allServers[item.server] = item; });
                Object.keys(allServers).sort((a, b) => isNaN(a) || isNaN(b) ? a.localeCompare(b) : Number(a) - Number(b)).forEach(serverName => {
                    const statusItem = allServers[serverName]; let text = `${serverName} - Свободно`; const option = new Option();
                    if (statusItem) { if (statusItem.conflict && statusItem.conflict.is_conflict) { text = `🔴 ${serverName} - ${statusItem.user} (${statusItem.ip}) Конфликт с: ${statusItem.conflict.with_user}`; } else { text = `🟢 ${serverName} - ${statusItem.user} (${statusItem.ip})`; } }
                    option.text = text; option.value = serverName; selectEl.appendChild(option);
                });
            }).catch(error => { selectEl.innerHTML = `<option>Ошибка загрузки серверов: ${error}</option>`; });
            // --- Конец вставки ---

            const runIpDetection = () => {
                isManualMode = false;
                ipStatusEl.textContent = 'Определение IP...';
                getIpAddressInternal().then(userIp => { // Используем Internal для одной попытки
                    currentIp = userIp;
                    const ipInfo = serverStatusList.find(item => item.ip === userIp);
                    ipStatusEl.style.textAlign = 'left';
                    ipStatusEl.style.lineHeight = '1.5';

                    if (ipInfo) {
                        // IP найден в базе данных сервера
                        if (ipInfo.conflict && ipInfo.conflict.is_conflict) {
                            // --- НОВАЯ ЛОГИКА С ПОДСВЕТКОЙ ---

                            // Создаем пометку для первого пользователя, если это текущий юзер
                            const user1_highlight = ipInfo.user.toLowerCase() === currentUser.toLowerCase()
                                ? ` <span style="color: #FFD700;">(это вы)</span>`
                                : '';

                            // Создаем пометку для второго пользователя, если это текущий юзер
                            const user2_highlight = ipInfo.conflict.with_user.toLowerCase() === currentUser.toLowerCase()
                                ? ` <span style="color: #FFD700;">(это вы)</span>`
                                : '';

                            // Ищем информацию о сервере второго пользователя
                            const conflictingUserInfo = serverStatusList.find(item => item.user === ipInfo.conflict.with_user);
                            const secondUserServer = conflictingUserInfo ? conflictingUserInfo.server : 'Неизвестно';

                            // Формируем итоговое сообщение с учетом пометок
                            ipStatusEl.innerHTML = `<strong><span style="color: #F44336;">🔴 КОНФЛИКТ!</span></strong><br>
                                                     Ваш IP: <strong>${userIp}</strong><br>
                                                     Используют:<br>
                                                     &nbsp;&nbsp;-&nbsp;<strong>${ipInfo.user}</strong> (Сервер: <strong>${ipInfo.server || 'Не указан'}</strong>)${user1_highlight}<br>
                                                     &nbsp;&nbsp;-&nbsp;<strong>${ipInfo.conflict.with_user}</strong> (Сервер: <strong>${secondUserServer || 'Не указан'}</strong>)${user2_highlight}`;
                        } else {
                            // Конфликта нет, IP просто используется
                            let userText = `Использует: <strong>${ipInfo.user}</strong>`;
                            if (ipInfo.user.toLowerCase() === currentUser.toLowerCase()) {
                                 userText = `Используете вы: <strong>${ipInfo.user}</strong>`;
                                 ipStatusEl.style.borderColor = '#4CAF50';
                            }
                            ipStatusEl.innerHTML = `Ваш текущий IP: <strong>${userIp}</strong><br>
                                                     Сервер: <strong>${ipInfo.server || 'Не указан'}</strong><br>
                                                     ${userText}`;
                        }
                    } else {
                        // IP не найден в базе, значит свободен
                        ipStatusEl.innerHTML = `Ваш текущий IP: <strong>${userIp}</strong> <span style="color: #4CAF50;">(Этот IP свободен)</span>`;
                        ipStatusEl.style.textAlign = 'center';
                    }
                    onSelectionChange();
                }).catch(error => {
                    ipStatusEl.innerHTML = `<strong style="color: #FF9800;">Не удалось определить IP (${error}).</strong><br>Пожалуйста, введите ваш IP вручную: <input type="text" id="manual-ip-input" placeholder="Напр. 95.191.5.180" style="width: 100%; margin-top: 5px; margin-bottom: 5px;">`;
                    const manualInput = document.getElementById('manual-ip-input');
                    manualInput.addEventListener('input', () => {
                        const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
                        if (ipRegex.test(manualInput.value)) { currentIp = manualInput.value; manualInput.style.borderColor = '#4CAF50'; }
                        else { currentIp = null; manualInput.style.borderColor = '#F44336'; }
                        onSelectionChange();
                    });
                });
            };

            const manualIp = localStorage.getItem(MANUAL_IP_KEY);
            if (manualIp) {
                isManualMode = true;
                currentIp = manualIp;
                ipStatusEl.innerHTML = `Используется IP, введенный вручную:<br><strong>${manualIp}</strong> <button id="delete-manual-ip" style="margin-left: 10px; font-size: 0.8em; cursor: pointer;">Удалить</button>`;
                document.getElementById('delete-manual-ip').onclick = () => {
                    localStorage.removeItem(MANUAL_IP_KEY);
                    currentIp = null;
                    onSelectionChange();
                    runIpDetection();
                };
                onSelectionChange();
            } else {
                runIpDetection();
            }

            selectEl.addEventListener('change', onSelectionChange);
            customInputEl.addEventListener('input', onSelectionChange);
            const complete = (data) => { panel.remove(); overlay.remove(); resolve(data); };

            saveBtn.onclick = () => {
                const server = customInputEl.value.trim() || selectEl.value;
                const manualInputElement = document.getElementById('manual-ip-input');
                if (manualInputElement && manualInputElement.value === currentIp) {
                    localStorage.setItem(MANUAL_IP_KEY, currentIp);
                } else if (!isManualMode) {
                    localStorage.removeItem(MANUAL_IP_KEY);
                }
                if (server && currentIp) { complete({ server, ip: currentIp }); }
            };
            overlay.onclick = () => complete(null);
        });
    }

    // --- Core Logic ---
    async function performFullConflictScan(isInteractive = false) {
        const username = getUsername();
        if (!username) {
            updateIndicator('error', 'Ошибка: не удалось найти ник.');
            return;
        }

        let ipToCheck = null;

        try {
            // Попытка №1: Определить реальный IP (только одна попытка)
            ipToCheck = await getIpAddress(1);
        } catch (error) {
            // Попытка №2 (План "Б"): Если не удалось, ищем IP, введенный вручную
            const manualIp = localStorage.getItem(MANUAL_IP_KEY);
            if (manualIp) {
                ipToCheck = manualIp;
            } else {
                // Если и ручного IP нет - это настоящая ошибка
                updateIndicator('error', `Критическая ошибка проверки: ${error}.`);
                if (isInteractive) alert(`❌ Критическая ошибка проверки: ${error}`);
                return; // Прекращаем выполнение
            }
        }

        // Если у нас есть IP для проверки (автоматический или ручной), продолжаем
        if (ipToCheck) {
            const conflictResult = await checkIpConflict(ipToCheck, username);

            if (conflictResult.status === 'conflict') {
                updateIndicator('conflict', `КОНФЛИКТ! Ваш IP ${ipToCheck} используется: ${conflictResult.user}`);
                if (isInteractive) alert(`🔴 КОНФЛИКТ!\n\nВаш IP (${ipToCheck}) уже используется пользователем: ${conflictResult.user}`);
            } else if (conflictResult.status === 'ok' || conflictResult.status === 'self') {
                let message = `Статус: OK. Конфликтов нет.\nIP: ${ipToCheck}`;
                // Добавляем пометку, если проверка шла по ручному IP
                if (localStorage.getItem(MANUAL_IP_KEY) === ipToCheck) {
                    message = `Статус: OK (проверка по сохраненным данным).\nIP: ${ipToCheck}`;
                }
                updateIndicator('ok', message);
                if (isInteractive) alert(`✅ Статус: OK\n\nВаш IP: ${ipToCheck}\n${conflictResult.status === 'self' ? `Записан за вами на сервере: ${conflictResult.server || 'не указан'}` : 'Этот IP свободен.'}`);
            }
        }
    }

    async function periodicSelfIpCheck() {
        if (!isLeader) return;
        const username = getUsername(); if (!username) { scheduleNextSelfCheck(); return; }
        updateIndicator('orange', 'Фоновая проверка IP...'); // Временно ставим оранжевый

        try {
            // Попытка №1: Стандартный путь для обычных VPN
            const currentIp = await getIpAddress();
            const savedData = await getUserDataWithRetry(username);

            // Если IP изменился, обновляем его и проверяем на конфликты
            if (savedData.status === 'found' && savedData.data.ip !== currentIp) {
                await silentUpdateIp(username, currentIp);
                await performFullConflictScan(false);
            } else {
                // Если IP не изменился, просто делаем стандартную проверку
                await performFullConflictScan(false);
            }
        } catch (error) {
            // Попытка №2: План "Б" для VPN, блокирующих проверку IP
            console.log(`VPN Tracker: Не удалось определить IP (${error}). Переключаюсь на проверку конфликта для сохраненного IP.`);
            try {
                const savedData = await getUserDataWithRetry(username);
                if (savedData.status === 'found' && savedData.data.ip) {
                    // Используем последний сохраненный IP для проверки конфликта
                    const conflictResult = await checkIpConflict(savedData.data.ip, username);
                    if (conflictResult.status === 'conflict') {
                        updateIndicator('conflict', `КОНФЛИКТ! Ваш сохраненный IP ${savedData.data.ip} используется: ${conflictResult.user}`);
                    } else if (conflictResult.status === 'ok' || conflictResult.status === 'self') {
                        updateIndicator('ok', `Статус: OK (проверка по сохраненным данным).\nIP: ${savedData.data.ip}`);
                    }
                } else {
                    updateIndicator('error', 'Ошибка: не удалось получить сохраненные данные для проверки.');
                }
            } catch (fallbackError) {
                // Если даже сервер с данными недоступен
                updateIndicator('error', `Критическая ошибка фоновой проверки: ${fallbackError}`);
            }
        } finally {
            // В любом случае планируем следующую проверку
            scheduleNextSelfCheck();
        }
    }

    async function forceCheckAndUpdate() {
        const username = getUsername();
        if (!username) {
            alert('Ошибка: не удалось найти имя пользователя.');
            return;
        }

        updateIndicator('orange', 'Проверка и синхронизация...');

        try {
            // Попытка №1: Определить реальный IP (только одна попытка для интерактивности)
            const currentIp = await getIpAddress(1);

            // Если удалось, работаем в автоматическом режиме
            const savedData = await getUserDataWithRetry(username);

            // Проверяем, не изменился ли наш IP с момента последнего сохранения
            if (savedData.status === 'found' && savedData.data.ip !== currentIp) {
                const updateSuccess = await silentUpdateIp(username, currentIp);
                if (updateSuccess) {
                    // Если IP успешно обновился, запускаем проверку на конфликт уже с новым IP
                    await performFullConflictScan(true);
                } else {
                    alert('❌ Ошибка! Не удалось обновить данные на сервере. Возможно, сервер недоступен.');
                    updateIndicator('error', 'Ошибка обновления на сервере.');
                }
            } else {
                // Если IP не менялся, просто запускаем стандартную проверку
                await performFullConflictScan(true);
            }
        } catch (error) {
            // Попытка №2 ("План Б"): Если авто-определение не удалось, проверяем, есть ли ручной ввод
            const manualIp = localStorage.getItem(MANUAL_IP_KEY);
            if (manualIp) {
                // Если ручной IP есть, это ожидаемое поведение.
                // Просто запускаем проверку на конфликт с этим IP.
                await performFullConflictScan(true);
            } else {
                // Если ручного IP нет, то это настоящая критическая ошибка
                alert(`❌ Критическая ошибка во время проверки: ${error}`);
                updateIndicator('error', `Ошибка проверки: ${error}.`);
            }
        }
    }

    // --- Опрос сервера на предмет уведомлений ---
    function pollForNotifications() {
        if (!isLeader) return;
        const username = getUsername();
        if (!username) return;

        GM_xmlhttpRequest({
            method: "GET",
            url: `http://localhost:3000/get_notifications?username=${encodeURIComponent(username)}`,
            onload: (res) => {
                if (res.status !== 200) return;
                try {
                    const notifications = JSON.parse(res.responseText);
                    if (notifications && notifications.length > 0) {
                        console.log(`VPN Tracker (Лидер): Получено ${notifications.length} уведомлений от сервера.`);
                        notifications.forEach(notification => {
                            if (notification.type === 'conflict_created') {
                                updateIndicator('conflict', `КОНФЛИКТ! Пользователь ${notification.with_user} теперь использует ваш IP: ${notification.ip}`);
                            } else if (notification.type === 'conflict_resolved') {
                                performFullConflictScan(false);
                            }
                        });
                    }
                } catch (e) { console.error("VPN Tracker: Ошибка парсинга уведомлений.", e); }
            },
            onerror: () => {}
        });
    }

    function startPolling() {
        stopPolling();
        notificationPollIntervalId = setInterval(pollForNotifications, NOTIFICATION_POLL_INTERVAL);
    }
    function stopPolling() {
        if (notificationPollIntervalId) { clearInterval(notificationPollIntervalId); notificationPollIntervalId = null; }
    }

    // --- Scheduling Logic ---
    function scheduleNextSelfCheck() {
        if (!isLeader) return;
        if (selfCheckTimeoutId) clearTimeout(selfCheckTimeoutId);
        const intervalMs = (SELF_IP_CHECK_INTERVAL_MIN + Math.random() * 10) * 60 * 1000;
        selfCheckTimeoutId = setTimeout(periodicSelfIpCheck, intervalMs);
    }

    function scheduleNextConflictScan() {
        if (!isLeader) return;
        if (conflictScanTimeoutId) clearTimeout(conflictScanTimeoutId);
        const intervalMs = (CONFLICT_SCAN_INTERVAL_MIN + Math.random() * 30) * 60 * 1000;
        conflictScanTimeoutId = setTimeout(() => {
            performFullConflictScan(false).then(() => scheduleNextConflictScan());
        }, intervalMs);
    }

    function stopAllPeriodicChecks() {
        if (selfCheckTimeoutId) { clearTimeout(selfCheckTimeoutId); selfCheckTimeoutId = null; }
        if (conflictScanTimeoutId) { clearTimeout(conflictScanTimeoutId); conflictScanTimeoutId = null; }
        if (leaderHeartbeatIntervalId) { clearInterval(leaderHeartbeatIntervalId); leaderHeartbeatIntervalId = null; }
        stopPolling();
    }

    // --- Логика выбора лидера вкладки ---
    function stopFollowerMonitoring() {
        if (leaderHealthTimeoutId) {
            clearTimeout(leaderHealthTimeoutId);
            leaderHealthTimeoutId = null;
        }
    }

    function leaderIsDead() {
        stopFollowerMonitoring();
        tryToBecomeLeader();
    }

    function startFollowerMonitoring() {
        stopFollowerMonitoring();
        leaderHealthTimeoutId = setTimeout(leaderIsDead, LEADER_TIMEOUT);
    }

    function startLeaderHeartbeat() {
        if (leaderHeartbeatIntervalId) clearInterval(leaderHeartbeatIntervalId);
        leaderHeartbeatIntervalId = setInterval(() => {
            localStorage.setItem(LEADER_KEY, JSON.stringify({ id: tabId, time: Date.now() }));
        }, LEADER_HEARTBEAT_INTERVAL);
    }

    function tryToBecomeLeader() {
        const currentLeaderJSON = localStorage.getItem(LEADER_KEY);
        let leaderIsAlive = false;
        if (currentLeaderJSON) {
            try {
                leaderIsAlive = (Date.now() - JSON.parse(currentLeaderJSON).time <= LEADER_TIMEOUT);
            } catch (e) {}
        }

        if (!leaderIsAlive) {
            isLeader = true;
            localStorage.setItem(LEADER_KEY, JSON.stringify({ id: tabId, time: Date.now() }));
            stopFollowerMonitoring();
            startLeaderHeartbeat();
            startPolling();
            scheduleNextSelfCheck();
            scheduleNextConflictScan();
        } else {
            isLeader = false;
            stopAllPeriodicChecks();
            startFollowerMonitoring();
        }
    }

    function handleStorageChange(e) {
        if (e.key === LEADER_KEY) {
            if (isLeader) return;
            if (e.newValue) {
                startFollowerMonitoring();
            } else {
                leaderIsDead();
            }
        } else if (e.key === STATUS_KEY && e.newValue) {
            try {
                const newStatus = JSON.parse(e.newValue);
                updateIndicator(newStatus.state, newStatus.message, false);
            } catch (err) {}
        }
    }

    function initializeLeadership() {
        window.addEventListener('beforeunload', () => {
            if (isLeader) {
                stopAllPeriodicChecks();
                localStorage.removeItem(LEADER_KEY);
            }
        });
        setTimeout(tryToBecomeLeader, Math.random() * 1000 + 100);
    }

    // --- Инициализация ---
    // Создаем индикатор и устанавливаем начальное состояние немедленно
createIndicator();
const lastStatusJSON = localStorage.getItem(STATUS_KEY);
if (lastStatusJSON) {
    try {
        const lastStatus = JSON.parse(lastStatusJSON);
        updateIndicator(lastStatus.state, lastStatus.message);
    } catch (e) {
        updateIndicator('orange', 'Ожидание проверки...');
    }
} else {
    updateIndicator('orange', 'Ожидание первой проверки...');
}

// Запускаем логику лидерства и отслеживания
initializeLeadership();
window.addEventListener('storage', handleStorageChange);


GM_registerMenuCommand("Указать/Изменить VPN Сервер", async () => {
    const username = getUsername(); if (!username) { alert('Не удалось найти имя пользователя.'); return; }
    const choice = await showChoicePanel(username);
    if (choice && choice.server && choice.ip) {
        sendDataToServer(username, choice.ip, choice.server);
    }
});
})();