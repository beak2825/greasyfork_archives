// ==UserScript==
// @name         CloudFlareDNS Tools by @AntiKeks
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Импорт hosts и очистка записей CloudFlareDNS
// @author       AntiKeks (fix by Andycar)
// @license      AGPLv3
// @match        https://one.dash.cloudflare.com/*/traffic-policies/policies*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543509/CloudFlareDNS%20Tools%20by%20%40AntiKeks.user.js
// @updateURL https://update.greasyfork.org/scripts/543509/CloudFlareDNS%20Tools%20by%20%40AntiKeks.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Функция подробного логирования
    function debugLog(message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[CF-DNS-DEBUG ${timestamp}]`, message, data || '');
    }

    function debugError(message, error = null) {
        const timestamp = new Date().toLocaleTimeString();
        console.error(`[CF-DNS-ERROR ${timestamp}]`, message, error || '');
    }

    // Функция парсинга ошибок API CloudFlare
    function parseApiError(status, responseText) {
        let errorMessage = `HTTP ${status}`;
        let userFriendlyMessage = '';

        try {
            const errorJson = JSON.parse(responseText);
            debugLog('Структура ошибки API:', errorJson);

            if (errorJson.errors && errorJson.errors.length > 0) {
                const error = errorJson.errors[0];
                errorMessage = `${error.code}: ${error.message}`;

                // Пользовательские объяснения частых ошибок
                switch (error.code) {
                    case 10000:
                        userFriendlyMessage = '❌ Некорректные данные. Проверьте формат IP-адреса (должно быть 4 части через точку, например: 1.1.1.1)';
                        break;
                    case 10001:
                        userFriendlyMessage = '❌ Недостаточно прав для создания правил DNS';
                        break;
                    case 10002:
                        userFriendlyMessage = '❌ Превышен лимит правил для вашего аккаунта';
                        break;
                    case 1004:
                        userFriendlyMessage = '❌ Неправильный формат DNS правила';
                        break;
                    default:
                        userFriendlyMessage = `❌ Ошибка API: ${error.message}`;
                }
            } else if (errorJson.message) {
                errorMessage = errorJson.message;
                userFriendlyMessage = `❌ ${errorJson.message}`;
            }
        } catch (e) {
            // Если не JSON, проверяем HTML ошибки
            if (responseText.includes('400 Bad Request')) {
                userFriendlyMessage = '❌ Некорректный формат данных. Убедитесь что IP-адрес содержит 4 части (например: 192.168.1.1)';
            } else if (responseText.includes('403 Forbidden')) {
                userFriendlyMessage = '❌ Недостаточно прав доступа';
            } else if (responseText.includes('429 Too Many Requests')) {
                userFriendlyMessage = '❌ Слишком много запросов. Подождите немного и попробуйте снова';
            } else {
                userFriendlyMessage = `❌ Ошибка сервера (${status})`;
            }
        }

        return { errorMessage, userFriendlyMessage };
    }

    // Обход CSP - ждем полной загрузки и создаем элементы через DOM
    function waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    // Определение мобильного устройства
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const BATCH = 14;
    const AUTO_REFRESH_DELAY = 4;

    function cleanInputLines(text) {
        debugLog('Очистка входных данных:', text.substring(0, 100) + '...');
        const cleaned = text.replace(/<br\s*\/?>/gi, '\n')
                   .replace(/&lt;br\s*\/?&gt;/gi, '\n')
                   .replace(/&nbsp;/gi, ' ')
                   .split('\n')
                   .map(line => line.replace(/\s+/g, ' ').trim())
                   .filter(line => {
                       if (!line) return false;
                       // Более строгая проверка IPv4 адреса
                       const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\s+[\w\.\-\*]+$/;
                       const ipv6Regex = /^[0-9a-fA-F:]+\s+[\w\.\-\*]+$/;
                       return ipv4Regex.test(line) || ipv6Regex.test(line);
                   });

        debugLog(`Очищено строк: ${cleaned.length} из ${text.split('\n').length}`);
        return cleaned;
    }

    function deduplicateByDomain(lines) {
        debugLog('Дедупликация доменов:', lines.length);
        const seen = new Set();
        const deduplicated = lines.filter(line => {
            let arr = line.trim().split(/\s+/, 2);
            if (arr.length !== 2) return false;
            let domain = arr[1].toLowerCase();
            if (seen.has(domain)) {
                debugLog(`Дублирующийся домен найден: ${domain}`);
                return false;
            }
            seen.add(domain);
            return true;
        });
        debugLog(`Дедупликация завершена: ${deduplicated.length} уникальных доменов`);
        return deduplicated;
    }

    function todayStr() {
        const d = new Date();
        return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    async function getRules(accountId) {
        debugLog('Получение правил для account:', accountId);
        try {
            // API endpoint остается gateway/rules, так как это бэкенд
            const url = `https://dash.cloudflare.com/api/v4/accounts/${accountId}/gateway/rules`;
            debugLog('Отправка GET запроса:', url);

            const resp = await fetch(url, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            debugLog('Ответ получен:', {
                status: resp.status,
                statusText: resp.statusText,
                ok: resp.ok
            });

            if (resp.ok) {
                const json = await resp.json();
                debugLog('JSON распарсен:', {
                    success: json.success,
                    result_count: json.result ? json.result.length : 0
                });
                return (json.result || []);
            } else {
                debugError('Ошибка HTTP ответа:', resp.status + ' ' + resp.statusText);
            }
        } catch (e) {
            debugError('Исключение при получении правил:', e);
        }
        return [];
    }

    function smartRefreshPols() {
        const dnsTabBtn = document.querySelector('button[aria-label="DNS"],a[aria-label="DNS"]');
        if (dnsTabBtn) {
            dnsTabBtn.click();
        } else {
            location.reload();
        }
    }

    async function exportAllRulesToClipboard(statusElement) {
        debugLog('Начало экспорта');
        statusElement.textContent = "Экспорт: Получение политик...";

        // UPDATED: Новый URL паттерн
        const accountIdMatch = window.location.pathname.match(/\/([a-z0-9]{24,})\/traffic-policies\/policies/i);
        debugLog('Парсинг URL для account_id:', {
            pathname: window.location.pathname,
            match: accountIdMatch
        });

        if (!accountIdMatch) {
            debugError('Account ID не найден в URL');
            statusElement.textContent = "Ошибка: не найден account_id в URL";
            return;
        }

        const accountId = accountIdMatch[1];
        debugLog('Account ID найден:', accountId);

        const rules = await getRules(accountId);
        debugLog('Всего правил получено:', rules.length);

        const dnsRules = rules.filter(r =>
            r.action === "override" &&
            r.traffic && r.traffic.startsWith("any(") &&
            Array.isArray(r.rule_settings?.override_ips) && r.rule_settings.override_ips[0]
        );
        debugLog('DNS правил найдено:', dnsRules.length);

        let hosts = [];
        for (let r of dnsRules.sort((a, b) => (a.precedence||0)-(b.precedence||0))) {
            let m = r.traffic.match(/==\s*"([^"]+)"/);
            let domain = m ? m[1] : '';
            let ip = r.rule_settings.override_ips[0];
            if(domain && ip) {
                hosts.push(`${ip} ${domain}`);
                debugLog(`Добавлен хост: ${ip} ${domain}`);
            }
        }

        let body =
`### CloudFlareDNS: hosts file
# Последнее обновление: ${todayStr()}
# Экспортировано через CloudFlare Gateway Panel
${hosts.join('\n')}
`;
        try {
            await navigator.clipboard.writeText(body);
            debugLog('Экспорт в буфер успешен');
            statusElement.innerHTML = `<span style="color: #235574;font-weight:550">Экспортировано <b>${hosts.length}</b> записей в буфер!</span>`;
        } catch(e) {
            debugError('Ошибка копирования в буфер:', e);
            statusElement.textContent = "Ошибка экспорта, попробуйте вручную: " + e;
        }
    }

    // Создание DNS правила с детальным логированием ошибок
    async function createDNSRule(accountId, domain, ip, precedence) {
        debugLog(`Создание DNS правила: ${domain} → ${ip} (precedence: ${precedence})`);

        try {
            const bodyObj = {
                name: `${domain} → ${ip}`,
                description: "",
                precedence: precedence,
                enabled: true,
                action: "override",
                filters: ["dns"],
                traffic: `any(dns.domains[*] == "${domain}")`,
                rule_settings: { override_ips: [ip], override_host: "" }
            };

            debugLog('Тело запроса:', bodyObj);

            // API endpoint остается прежним
            const url = `https://dash.cloudflare.com/api/v4/accounts/${accountId}/gateway/rules`;
            debugLog('URL для POST запроса:', url);

            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify(bodyObj),
                credentials: 'include'
            });

            debugLog(`Ответ на создание правила: ${resp.status} ${resp.statusText}`);

            if (!resp.ok) {
                const errorText = await resp.text();
                debugError(`Ошибка создания правила (${resp.status}):`, errorText);

                const parsedError = parseApiError(resp.status, errorText);
                debugError('Распарсенная ошибка:', parsedError);

                return { success: false, error: parsedError };
            }

            const responseJson = await resp.json();
            debugLog('Ответ JSON:', responseJson);

            return { success: true };
        } catch (e) {
            debugError('Исключение при создании правила:', e);
            return { success: false, error: { userFriendlyMessage: `❌ Сетевая ошибка: ${e.message}` } };
        }
    }

    // Функция умной перезагрузки
    function handleSmartReload(done, errors, debugMode, statusElement, finalMessage) {
        if (debugMode) {
            // Если режим отладки - никогда не перезагружаем
            debugLog('Режим отладки: автоперезагрузка отключена');
            statusElement.textContent = finalMessage + '\n\n🔧 Режим отладки: автоперезагрузка отключена';
            return;
        }

        if (errors > 0) {
            // Если есть ошибки - не перезагружаем
            debugLog('Есть ошибки: автоперезагрузка отключена для анализа');
            statusElement.textContent = finalMessage + '\n\n⚠️ Есть ошибки: страница не перезагружается для анализа';
            return;
        }

        if (done > 0) {
            // Если есть успешные операции и нет ошибок - перезагружаем
            debugLog('Успешно завершено без ошибок: запуск автоперезагрузки');
            let seconds = AUTO_REFRESH_DELAY;
            function setTimerText(t, append = "") {
                statusElement.textContent = `${finalMessage}\n✅ Обновление через ${t} сек...${append}`;
            }
            setTimerText(seconds);
            let interval = setInterval(() => {
                seconds--;
                if (seconds > 0) setTimerText(seconds);
                else {
                    clearInterval(interval);
                    setTimerText(0, " (страница обновляется)");
                    smartRefreshPols();
                }
            }, 1000);
        }
    }

    // Создание независимой панели с обходом CSP
    function createMainPanel() {
        debugLog('Создание главной панели');

        // Удаляем старую панель если есть
        const existingPanel = document.querySelector('#cf-dns-tools-main');
        if (existingPanel) {
            debugLog('Удаление существующей панели');
            existingPanel.remove();
        }

        const mainContainer = document.createElement('div');
        mainContainer.id = 'cf-dns-tools-main';

        // Применяем стили через setAttribute для обхода CSP
        const containerStyles = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            width: ${isMobile ? '95vw' : '420px'} !important;
            max-width: 95vw !important;
            background: #ffffff !important;
            border: 2px solid #e1e5e9 !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
            z-index: 999999 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            font-size: 14px !important;
            max-height: 80vh !important;
            overflow-y: auto !important;
        `;
        mainContainer.setAttribute('style', containerStyles);

        // Заголовок
        const header = document.createElement('div');
        const headerStyles = `
            background: linear-gradient(135deg, #006be8 0%, #0056b3 100%) !important;
            color: white !important;
            padding: 12px 16px !important;
            border-radius: 10px 10px 0 0 !important;
            font-weight: 600 !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            cursor: pointer !important;
            user-select: none !important;
        `;
        header.setAttribute('style', headerStyles);
        header.innerHTML = '🛠️ CloudFlare DNS Tools <span id="toggle-btn" style="font-size: 18px;">▼</span>';

        // Контент
        const content = document.createElement('div');
        content.id = 'cf-panel-content';
        content.setAttribute('style', 'padding: 20px !important; display: block !important;');

        // Кнопки
        const buttonContainer = document.createElement('div');
        buttonContainer.setAttribute('style', 'display: flex !important; gap: 8px !important; margin-bottom: 16px !important; flex-wrap: wrap !important;');

        // Кнопка импорта
        const importBtn = document.createElement('button');
        importBtn.textContent = '📥 Импорт';
        importBtn.setAttribute('style', `
            background: #006be8 !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: ${isMobile ? '12px 16px' : '8px 16px'} !important;
            font-size: ${isMobile ? '16px' : '14px'} !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            flex: ${isMobile ? '1' : 'none'} !important;
        `);

        // Кнопка экспорта
        const exportBtn = document.createElement('button');
        exportBtn.textContent = '📤 Экспорт';
        exportBtn.setAttribute('style', `
            background: #545d69 !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: ${isMobile ? '12px 16px' : '8px 16px'} !important;
            font-size: ${isMobile ? '16px' : '14px'} !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            flex: ${isMobile ? '1' : 'none'} !important;
        `);

        // Кнопка удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️ Удалить все';
        deleteBtn.setAttribute('style', `
            background: #e5484d !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: ${isMobile ? '12px 16px' : '8px 16px'} !important;
            font-size: ${isMobile ? '16px' : '14px'} !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            flex: ${isMobile ? '1' : 'none'} !important;
        `);

        buttonContainer.appendChild(importBtn);
        buttonContainer.appendChild(exportBtn);
        buttonContainer.appendChild(deleteBtn);

        // Настройки
        const settingsContainer = document.createElement('div');
        settingsContainer.setAttribute('style', 'background: #f8f9fa !important; padding: 12px !important; border-radius: 8px !important; margin-bottom: 16px !important; border: 1px solid #e9ecef !important;');

        const precedenceContainer = document.createElement('div');
        precedenceContainer.setAttribute('style', 'display: flex !important; align-items: center !important; gap: 8px !important; margin-bottom: 8px !important;');

        const precedenceLabel = document.createElement('label');
        precedenceLabel.textContent = 'Precedence:';
        precedenceLabel.setAttribute('style', 'font-weight: 500 !important; color: #495057 !important;');

        const precedenceInput = document.createElement('input');
        precedenceInput.type = 'number';
        precedenceInput.value = '10000';
        precedenceInput.min = '1';
        precedenceInput.max = '1000000';
        precedenceInput.id = 'precedence-input';
        precedenceInput.setAttribute('style', 'width: 80px !important; padding: 4px 8px !important; border: 1px solid #ced4da !important; border-radius: 4px !important; font-size: 14px !important;');

        precedenceContainer.appendChild(precedenceLabel);
        precedenceContainer.appendChild(precedenceInput);

        const logContainer = document.createElement('div');
        logContainer.setAttribute('style', 'display: flex !important; align-items: center !important; gap: 8px !important;');

        const logCheckbox = document.createElement('input');
        logCheckbox.type = 'checkbox';
        logCheckbox.id = 'log-checkbox';
        logCheckbox.checked = false; // По умолчанию выключен для обычных пользователей
        logCheckbox.setAttribute('style', 'margin: 0 !important;');

        const logLabel = document.createElement('label');
        logLabel.textContent = 'Debug режим (без автоперезагрузки)';
        logLabel.setAttribute('for', 'log-checkbox');
        logLabel.setAttribute('style', 'font-weight: 500 !important; color: #495057 !important; cursor: pointer !important;');

        logContainer.appendChild(logCheckbox);
        logContainer.appendChild(logLabel);

        settingsContainer.appendChild(precedenceContainer);
        settingsContainer.appendChild(logContainer);

        // Поле ввода
        const textarea = document.createElement('textarea');
        textarea.id = 'hosts-input';
        textarea.placeholder = 'Вставьте hosts записи:\n8.8.8.8 google-dns.test\n1.1.1.1 cloudflare-dns.test\n...';
        textarea.setAttribute('style', `
            width: 100% !important;
            height: 120px !important;
            padding: 12px !important;
            border: 2px solid #e9ecef !important;
            border-radius: 8px !important;
            font-family: 'Courier New', monospace !important;
            font-size: 13px !important;
            resize: vertical !important;
            box-sizing: border-box !important;
            margin-bottom: 12px !important;
            background: #fdfdfe !important;
        `);

        // Статус
        const status = document.createElement('div');
        status.id = 'cf-status';
        status.textContent = 'Готов к работе...';
        status.setAttribute('style', `
            background: #e8f4f8 !important;
            border: 1px solid #bee5eb !important;
            border-radius: 6px !important;
            padding: 12px !important;
            font-family: 'Courier New', monospace !important;
            font-size: 12px !important;
            color: #0c5460 !important;
            min-height: 20px !important;
            white-space: pre-line !important;
            max-height: 300px !important;
            overflow-y: auto !important;
            width: 100% !important;
            box-sizing: border-box !important;
        `);

        // Сборка
        content.appendChild(buttonContainer);
        content.appendChild(settingsContainer);
        content.appendChild(textarea);
        content.appendChild(status);

        mainContainer.appendChild(header);
        mainContainer.appendChild(content);

        // Обработчики событий через addEventListener (безопасно для CSP)
        let isCollapsed = false;
        header.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            content.style.display = isCollapsed ? 'none' : 'block';
            const toggleBtn = header.querySelector('#toggle-btn');
            toggleBtn.style.transform = isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
            mainContainer.style.width = isCollapsed ? 'auto' : (isMobile ? '95vw' : '420px');
        });

        // Обработчики кнопок
        setupEventHandlers(importBtn, exportBtn, deleteBtn, status, textarea, precedenceInput, logCheckbox);

        return mainContainer;
    }

    function setupEventHandlers(importBtn, exportBtn, deleteBtn, statusElement, textarea, precedenceInput, logCheckbox) {

        // Экспорт
        exportBtn.addEventListener('click', async () => {
            debugLog('Кнопка экспорта нажата');
            await exportAllRulesToClipboard(statusElement);
        });

        // Импорт с умной перезагрузкой и детальными ошибками
        importBtn.addEventListener('click', async () => {
            debugLog('=== НАЧАЛО ИМПОРТА ===');

            let showFullLog = logCheckbox.checked;
            let basePrec = parseInt(precedenceInput.value) || 10000;
            debugLog('Настройки импорта:', { showFullLog, basePrec });

            statusElement.textContent = showFullLog ?
                '🔄 Начало импорта... (debug режим, смотрите консоль)' :
                '🔄 Импорт начат...';

            let lines = cleanInputLines(textarea.value);
            lines = deduplicateByDomain(lines);

            if (lines.length === 0) {
                debugError('Нет валидных строк для импорта');
                statusElement.textContent = "❌ Нет валидных строк!\n\n💡 Проверьте формат:\n- IP должен содержать 4 части (например: 192.168.1.1)\n- Формат: IP пробел ДОМЕН\n- Пример: 8.8.8.8 google.com";
                return;
            }

            debugLog(`Готово к импорту ${lines.length} записей`);

            // UPDATED: Новый URL паттерн
            const match = window.location.pathname.match(/\/([a-z0-9]{24,})\/traffic-policies\/policies/i);
            if (!match) {
                debugError('Account ID не найден в URL');
                statusElement.textContent = "❌ Ошибка: не найден account_id в URL\n\n💡 Убедитесь что вы находитесь на странице Gateway Policies";
                return;
            }

            const accountId = match[1];
            debugLog('Account ID получен:', accountId);

            let rules = await getRules(accountId);
            let usedPrecSet = new Set(rules.map(r => r.precedence));
            debugLog('Используемые precedence:', Array.from(usedPrecSet).sort((a,b) => a-b));

            let total = lines.length, done = 0, errors = 0;
            let errorMessages = [];

            // Создаем пул precedence
            let precPool = [], nextP = basePrec;
            while (precPool.length < total * 2) {
                if (!usedPrecSet.has(nextP)) precPool.push(nextP);
                nextP++;
            }
            debugLog(`Создан пул precedence: ${precPool.slice(0, 10)}... (всего ${precPool.length})`);

            function getNextPrec() {
                if (precPool.length === 0) {
                    let n = 10000 + Math.floor(Math.random()*1000000);
                    for (let j=0;j<300;j++) if (!usedPrecSet.has(n+j)) precPool.push(n+j);
                    debugLog('Пул precedence пополнен случайными значениями');
                }
                return precPool.shift();
            }

            // Обрабатываем записи по одной для лучшего дебага
            for (let index = 0; index < lines.length; index++) {
                const [ip, ...domainParts] = lines[index].split(' ');
                const domain = domainParts.join(' ');
                debugLog(`\n--- Обработка записи ${index + 1}/${total}: ${domain} → ${ip} ---`);

                let success = false;
                let lastError = null;

                for (let attempt = 1; attempt <= 3 && !success; ++attempt) {
                    let myPrec = getNextPrec();
                    debugLog(`Попытка ${attempt}: precedence = ${myPrec}`);

                    const result = await createDNSRule(accountId, domain, ip, myPrec);

                    if (result.success) {
                        success = true;
                        ++done;
                        usedPrecSet.add(myPrec);
                        debugLog(`✅ Успешно добавлено: ${domain} → ${ip}`);
                        if (showFullLog) {
                            console.log(`✅ [${index+1}] ${domain} → ${ip} (precedence: ${myPrec}, попытка: ${attempt})`);
                        }
                        break;
                    } else {
                        lastError = result.error;
                        debugError(`Попытка ${attempt} неудачна для ${domain}:`, result.error);
                    }
                }

                if (!success) {
                    ++errors;
                    if (lastError && lastError.userFriendlyMessage) {
                        errorMessages.push(`${domain}: ${lastError.userFriendlyMessage}`);
                    } else {
                        errorMessages.push(`${domain}: Неизвестная ошибка`);
                    }
                    debugError(`❌ Не удалось добавить: ${domain} → ${ip} после 3 попыток`);
                    if (showFullLog) {
                        console.error(`❌ [${index+1}] ${domain} → ${ip} (невозможно добавить за 3 попытки)`);
                    }
                }

                // Обновляем статус
                let statusText = `📥 Импорт: ${done + errors} / ${total}\n✅ Успешно: ${done}\n❌ Ошибок: ${errors}`;

                if (errors > 0 && !showFullLog) {
                    statusText += '\n\n🔍 Детали ошибок:\n' + errorMessages.slice(-3).join('\n');
                    if (errorMessages.length > 3) {
                        statusText += '\n... и еще ' + (errorMessages.length - 3) + ' ошибок';
                    }
                }

                if (showFullLog) {
                    statusText += '\n\nСмотрите консоль для подробностей...';
                }

                statusElement.textContent = statusText;

                // Пауза между запросами
                if ((index + 1) % BATCH === 0) {
                    debugLog('Пауза между batch...');
                    await new Promise(r => setTimeout(r, 200));
                }
            }

            let finish = `📊 Импорт завершен!\n✅ Успешно: ${done}\n❌ Ошибок: ${errors}`;

            if (errors > 0 && !showFullLog) {
                finish += '\n\n🔍 Основные ошибки:\n' + errorMessages.slice(0, 5).join('\n');
                if (errorMessages.length > 5) {
                    finish += '\n... и еще ' + (errorMessages.length - 5) + ' ошибок';
                }
                finish += '\n\n💡 Включите "Debug режим" для подробностей';
            }

            debugLog('=== ИМПОРТ ЗАВЕРШЕН ===');
            debugLog('Итоговая статистика:', { done, errors, total });

            // Умная перезагрузка
            handleSmartReload(done, errors, showFullLog, statusElement, finish);
        });

        // Удаление с умной перезагрузкой
        deleteBtn.addEventListener('click', async () => {
            debugLog('=== НАЧАЛО УДАЛЕНИЯ ===');

            let showFullLog = logCheckbox.checked;

            // UPDATED: Новый URL паттерн
            const match = window.location.pathname.match(/\/([a-z0-9]{24,})\/traffic-policies\/policies/i);
            if (!match) {
                debugError('Account ID не найден для удаления');
                statusElement.textContent = "❌ Ошибка: не найден account_id в URL";
                return;
            }

            const accountId = match[1];
            debugLog('Account ID для удаления:', accountId);

            let allRules = await getRules(accountId);
            let toDelete = allRules.filter(rule => rule.name && rule.name.match(/.+ → [0-9\.]+$/));

            debugLog(`Найдено правил для удаления: ${toDelete.length}`);
            toDelete.forEach((rule, i) => debugLog(`${i+1}. ${rule.name} (ID: ${rule.id})`));

            if (toDelete.length === 0) {
                statusElement.textContent = "❌ Нет политик для удаления (формат \"домен → IP\").";
                return;
            }

            const confirmed = confirm(`🗑️ Удалить ${toDelete.length} DNS записей?\n\nЭто действие нельзя отменить!`);
            if (!confirmed) {
                debugLog('Удаление отменено пользователем');
                statusElement.textContent = '❌ Удаление отменено';
                return;
            }

            statusElement.textContent = `🗑️ Удаление ${toDelete.length} записей...`;

            let done = 0, errors = 0;
            for (let i = 0; i < toDelete.length; i++) {
                debugLog(`Удаление ${i+1}/${toDelete.length}: ${toDelete[i].name}`);

                try {
                    const resp = await fetch(`https://dash.cloudflare.com/api/v4/accounts/${accountId}/gateway/rules/${toDelete[i].id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    debugLog(`Ответ на удаление: ${resp.status} ${resp.statusText}`);

                    if (resp.ok) {
                        done++;
                        debugLog(`✅ Удалено: ${toDelete[i].name}`);
                    } else {
                        errors++;
                        debugError(`❌ Ошибка удаления: ${toDelete[i].name}`);
                    }

                    statusElement.textContent = `🗑️ Удаление: ${done + errors}/${toDelete.length}\n✅ Удалено: ${done}\n❌ Ошибок: ${errors}`;

                    if ((i + 1) % BATCH === 0) {
                        debugLog('Пауза между batch удаления...');
                        await new Promise(resolve => setTimeout(resolve, 300));
                    }
                } catch (e) {
                    errors++;
                    debugError('Исключение при удалении:', e);
                }
            }

            const finish = `📊 Удаление завершено!\n✅ Удалено: ${done}\n❌ Ошибок: ${errors}`;
            debugLog('=== УДАЛЕНИЕ ЗАВЕРШЕНО ===');
            debugLog('Статистика удаления:', { done, errors, total: toDelete.length });

            // Умная перезагрузка
            handleSmartReload(done, errors, showFullLog, statusElement, finish);
        });
    }

    // Основная функция инициализации
    async function init() {
        try {
            debugLog('=== ИНИЦИАЛИЗАЦИЯ СКРИПТА ===');
            debugLog('User Agent:', navigator.userAgent);
            debugLog('URL:', window.location.href);
            debugLog('Document ready state:', document.readyState);

            // Ждем загрузки DOM
            await waitForDOM();
            debugLog('DOM загружен');

            // Дополнительная задержка для полной загрузки CloudFlare
            await new Promise(resolve => setTimeout(resolve, 2000));
            debugLog('Задержка завершена, создание панели...');

            const panel = createMainPanel();
            document.body.appendChild(panel);

            debugLog('✅ CloudFlare DNS Tools успешно загружены!');

        } catch (error) {
            debugError('❌ Ошибка загрузки CloudFlare DNS Tools:', error);
        }
    }

    // Запуск с обработкой ошибок
    init().catch(error => {
        debugError('❌ Критическая ошибка инициализации:', error);
    });

})();