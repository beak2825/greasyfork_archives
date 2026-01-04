// ==UserScript==
// @name        Скрипт для системы логирования + TradeID Viewer
// @namespace    https://logs.blackrussia.online/
// @version      1.2
// @description  Theme Changer + Font Changer for Black Logs + TradeID Viewer
// @author       Kumiho + Assistant
// @match        https://logs.blackrussia.online/gslogs/*
// @icon         https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @license      Kumiho + GNU GPLv3
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      logs.blackrussia.online
// @connect      2ip.ru
// @connect      ipapi.co
// @connect      ipwhois.app
// @connect      ip.sb
// @connect      freeipapi.com
// @connect      ip-api.com
// @connect      reallyfreegeoip.org
// @connect      jsonip.com
// @resource leafletCSS https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
// @resource fontAwesomeCSS https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
// @downloadURL https://update.greasyfork.org/scripts/487756/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B%20%D0%BB%D0%BE%D0%B3%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%2B%20TradeID%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/487756/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B%20%D0%BB%D0%BE%D0%B3%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%2B%20TradeID%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === КОНФИГУРАЦИЯ TRADEID VIEWER ===
    const REQUEST_DELAY_MS = 4000;
    const SHOW_CONNECT_BTN_DELAY_MS = 2000;
    let lastRequestTime = 0;
    const openModals = {};

    const SERVER_ID_MATCH = window.location.pathname.match(/\/gslogs\/(\d+)/);
    const SERVER_ID = SERVER_ID_MATCH ? SERVER_ID_MATCH[1] : '1';

    // === ИНИЦИАЛИЗАЦИЯ ОСНОВНОГО СКРИПТА ===
    scriptInit();

    // === ФУНКЦИИ ОСНОВНОГО СКРИПТА ===

    function createStyleButton(element) {

        const styleToggle = document.createElement('button');
        styleToggle.className = 'style-button';
        styleToggle.id = 'style-modal-toggle';
        styleToggle.href = '#!';
        styleToggle.tabIndex = '0';
        styleToggle.dataset.bsToggle = 'modal';
        styleToggle.dataset.bsTarget = '#container-background';
        styleToggle.textContent = 'STYLE';

        const replaceElement = document.querySelector(element);
        replaceElement.replaceWith(styleToggle);
    }

    function createIPCheckButton() {
        const ipCheckButton = document.createElement('button');
        ipCheckButton.className = 'style-button';
        ipCheckButton.id = 'ip-check-toggle';
        ipCheckButton.href = '#!';
        ipCheckButton.tabIndex = '0';
        ipCheckButton.dataset.bsToggle = 'modal';
        ipCheckButton.dataset.bsTarget = '#ip-check-modal';
        ipCheckButton.textContent = 'ПРОВЕРКА IP';
        ipCheckButton.style.marginLeft = '10px';
        ipCheckButton.style.whiteSpace = 'nowrap';
        ipCheckButton.style.minWidth = '140px'; // Увеличиваем минимальную ширину для мобильных

        const styleButton = document.querySelector('#style-modal-toggle');
        if (styleButton) {
            styleButton.parentNode.insertBefore(ipCheckButton, styleButton.nextSibling);
        }
    }

    function createIPCheckModal() {
        const ipCheckModal = document.createElement('div');
        ipCheckModal.className = 'modal fade';
        ipCheckModal.id = 'ip-check-modal';
        ipCheckModal.tabIndex = '-1';
        ipCheckModal.style.display = 'none';
        ipCheckModal.ariaHidden = 'true';

        const modalDialog = document.createElement('div');
        modalDialog.className = 'modal-dialog modal-dialog-centered modal-lg';
        ipCheckModal.appendChild(modalDialog);

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalDialog.appendChild(modalContent);

        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalContent.appendChild(modalHeader);

        const modalTitle = document.createElement('h5');
        modalTitle.className = 'modal-title';
        modalTitle.textContent = 'Проверка IP адресов';
        modalHeader.appendChild(modalTitle);

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn-close';
        closeButton.dataset.bsDismiss = 'modal';
        closeButton.ariaLabel = 'Close';
        modalHeader.appendChild(closeButton);

        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalContent.appendChild(modalBody);

        // Форма для ввода IP
        const ipForm = document.createElement('div');
        ipForm.className = 'ip-check-form';
        ipForm.innerHTML = `
            <div class="ip-input-group">
                <label>Первый IP адрес:</label>
                <input type="text" class="form-control ip-input" id="ip1" placeholder="Введите IP адрес">
            </div>
            <div class="ip-input-group">
                <label>Второй IP адрес:</label>
                <input type="text" class="form-control ip-input" id="ip2" placeholder="Введите IP адрес">
            </div>
            <button class="btn btn-primary check-ip-btn" id="check-ip-btn">Проверить IP</button>
        `;
        modalBody.appendChild(ipForm);

        // Область для результатов
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'ip-results-container';
        resultsContainer.id = 'ip-results';
        resultsContainer.innerHTML = '<div class="loading-resp">Введите IP адреса для проверки</div>';
        modalBody.appendChild(resultsContainer);

        document.body.appendChild(ipCheckModal);

        // Обработчик кнопки проверки
        document.getElementById('check-ip-btn').addEventListener('click', checkIPs);
    }

    async function checkIPs() {
        const ip1 = document.getElementById('ip1').value.trim();
        const ip2 = document.getElementById('ip2').value.trim();
        const resultsContainer = document.getElementById('ip-results');

        if (!ip1 || !ip2) {
            resultsContainer.innerHTML = '<div class="error-resp">Пожалуйста, введите оба IP адреса</div>';
            return;
        }

        resultsContainer.innerHTML = '<div class="loading-resp">Загрузка данных...</div>';

        try {
            const [result1, result2] = await Promise.all([
                getIPInfo(ip1),
                getIPInfo(ip2)
            ]);

            displayIPResults(result1, result2);
        } catch (error) {
            resultsContainer.innerHTML = `<div class="error-resp">Ошибка при получении данных: ${error.message}</div>`;
        }
    }

    async function getIPInfo(ip) {
        // Проверяем валидность IP
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipRegex.test(ip)) {
            throw new Error(`Неверный формат IP: ${ip}`);
        }

        return new Promise((resolve, reject) => {
            // Сначала пробуем ipapi.co
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://ipapi.co/${ip}/json/`,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Accept": "application/json"
                },
                onload: function(response) {
                    try {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            console.log('[BR-Viewer] ipapi.co response:', data);

                            if (data.error || data.reserved) {
                                // Если ipapi.co возвращает ошибку, пробуем альтернативный сервис
                                console.log('[BR-Viewer] ipapi.co error, trying alternative');
                                getIPInfoAlternative(ip).then(resolve).catch(reject);
                            } else {
                                const result = {
                                    ip: data.ip || ip,
                                    country: data.country_name || 'Неизвестно',
                                    city: data.city || 'Неизвестно',
                                    region: data.region || 'Неизвестно',
                                    timezone: data.timezone || 'Неизвестно',
                                    org: data.org || 'Неизвестно',
                                    asn: data.asn || 'Неизвестно',
                                    latitude: data.latitude,
                                    longitude: data.longitude
                                };

                                // Проверяем что данные реальные
                                if (result.country !== 'Неизвестно' && result.city !== 'Неизвестно') {
                                    resolve(result);
                                } else {
                                    console.log('[BR-Viewer] ipapi.co returned unknown data, trying alternative');
                                    getIPInfoAlternative(ip).then(resolve).catch(reject);
                                }
                            }
                        } else {
                            // При ошибке пробуем альтернативный сервис
                            console.log('[BR-Viewer] ipapi.co status error:', response.status);
                            getIPInfoAlternative(ip).then(resolve).catch(reject);
                        }
                    } catch (e) {
                        console.error('[BR-Viewer] Error with ipapi.co:', e);
                        getIPInfoAlternative(ip).then(resolve).catch(reject);
                    }
                },
                onerror: function(error) {
                    console.error('[BR-Viewer] Network error with ipapi.co:', error);
                    getIPInfoAlternative(ip).then(resolve).catch(reject);
                },
                timeout: 10000
            });
        });
    }

    // Улучшенная альтернативная функция для получения информации об IP
    function getIPInfoAlternative(ip) {
        return new Promise((resolve, reject) => {
            // Используем работающие бесплатные сервисы с приоритетом
            const services = [
                {
                    url: `https://ipwhois.app/json/${ip}`,
                    parser: (data) => ({
                        ip: data.ip,
                        country: data.country,
                        city: data.city,
                        region: data.region,
                        timezone: data.timezone,
                        org: data.isp,
                        asn: data.asn,
                        latitude: data.latitude,
                        longitude: data.longitude
                    }),
                    check: (data) => data.success !== false
                },
                {
                    url: `https://api.ip.sb/geoip/${ip}`,
                    parser: (data) => ({
                        ip: data.ip,
                        country: data.country,
                        city: data.city,
                        region: data.region,
                        timezone: data.timezone,
                        org: data.organization,
                        asn: data.asn,
                        latitude: data.latitude,
                        longitude: data.longitude
                    }),
                    check: (data) => !!data.ip
                },
                {
                    url: `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`,
                    parser: (data) => ({
                        ip: data.query,
                        country: data.country,
                        city: data.city,
                        region: data.regionName,
                        timezone: data.timezone,
                        org: data.isp,
                        asn: data.as,
                        latitude: data.lat,
                        longitude: data.lon
                    }),
                    check: (data) => data.status === 'success'
                },
                {
                    url: `https://freeipapi.com/api/json/${ip}`,
                    parser: (data) => ({
                        ip: data.ipAddress,
                        country: data.countryName,
                        city: data.cityName,
                        region: data.regionName,
                        timezone: data.timeZone,
                        org: data.isp,
                        asn: '',
                        latitude: data.latitude,
                        longitude: data.longitude
                    }),
                    check: (data) => !!data.ipAddress
                },
                {
                    url: `https://reallyfreegeoip.org/json/${ip}`,
                    parser: (data) => ({
                        ip: data.ip,
                        country: data.country_name,
                        city: data.city,
                        region: data.region_name,
                        timezone: data.time_zone,
                        org: '',
                        asn: '',
                        latitude: data.latitude,
                        longitude: data.longitude
                    }),
                    check: (data) => !!data.ip
                }
            ];

            let currentServiceIndex = 0;

            function tryNextService() {
                if (currentServiceIndex >= services.length) {
                    // Если все сервисы не сработали, возвращаем базовую информацию
                    const fallbackResult = {
                        ip: ip,
                        country: 'Не удалось определить',
                        city: 'Неизвестно',
                        region: 'Неизвестно',
                        timezone: 'Неизвестно',
                        org: 'Неизвестно',
                        asn: 'Неизвестно',
                        latitude: null,
                        longitude: null,
                        note: 'Сервисы геолокации временно недоступны'
                    };
                    resolve(fallbackResult);
                    return;
                }

                const service = services[currentServiceIndex];
                currentServiceIndex++;

                console.log('[BR-Viewer] Trying IP API:', service.url);

                GM_xmlhttpRequest({
                    method: "GET",
                    url: service.url,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                        "Accept": "application/json"
                    },
                    onload: function(response) {
                        try {
                            console.log('[BR-Viewer] IP API Response status:', response.status, 'for URL:', service.url);

                            if (response.status === 200) {
                                const data = JSON.parse(response.responseText);
                                console.log('[BR-Viewer] IP API Response data:', data);

                                if (service.check(data)) {
                                    const result = service.parser(data);

                                    // Проверяем, есть ли реальные данные
                                    const hasRealData = result.country &&
                                                       result.country !== 'Неизвестно' &&
                                                       result.country !== 'Undefined' &&
                                                       result.country !== '';

                                    if (hasRealData) {
                                        console.log('[BR-Viewer] Successfully got IP info:', result);
                                        resolve(result);
                                    } else {
                                        console.log('[BR-Viewer] No valid data, trying next service');
                                        tryNextService();
                                    }
                                } else {
                                    console.log('[BR-Viewer] Service check failed, trying next service');
                                    tryNextService();
                                }
                            } else {
                                console.log('[BR-Viewer] API returned status:', response.status, 'trying next service');
                                tryNextService();
                            }
                        } catch (e) {
                            console.error('[BR-Viewer] Error parsing IP API response:', e);
                            tryNextService();
                        }
                    },
                    onerror: function(error) {
                        console.error('[BR-Viewer] Network error for IP API:', error);
                        tryNextService();
                    },
                    ontimeout: function() {
                        console.error('[BR-Viewer] Timeout for IP API');
                        tryNextService();
                    },
                    timeout: 15000
                });
            }

            // Начинаем с первого сервиса
            tryNextService();
        });
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        if (!lat1 || !lon1 || !lat2 || !lon2) return 'Недостаточно данных';

        const R = 6371; // Радиус Земли в км
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        return distance.toFixed(2) + ' км';
    }

    function displayIPResults(result1, result2) {
        const resultsContainer = document.getElementById('ip-results');
        const distance = calculateDistance(result1.latitude, result1.longitude, result2.latitude, result2.longitude);

        // Функция для форматирования значения
        const formatValue = (value) => {
            if (!value || value === 'Неизвестно' || value === 'Не удалось определить') {
                return '<span style="color: #ff6b6b;">Неизвестно</span>';
            }
            return value;
        };

        resultsContainer.innerHTML = `
            <div class="ip-results-grid">
                <div class="ip-result-card">
                    <h4><i class="fas fa-desktop"></i> IP 1: ${result1.ip}</h4>
                    <div class="ip-info">
                        <div class="info-row"><strong><i class="fas fa-flag"></i> Страна:</strong> ${formatValue(result1.country)}</div>
                        <div class="info-row"><strong><i class="fas fa-city"></i> Город:</strong> ${formatValue(result1.city)}</div>
                        <div class="info-row"><strong><i class="fas fa-map"></i> Регион:</strong> ${formatValue(result1.region)}</div>
                        <div class="info-row"><strong><i class="fas fa-clock"></i> Временная зона:</strong> ${formatValue(result1.timezone)}</div>
                        <div class="info-row"><strong><i class="fas fa-building"></i> Организация:</strong> ${formatValue(result1.org)}</div>
                        <div class="info-row"><strong><i class="fas fa-network-wired"></i> ASN:</strong> ${formatValue(result1.asn)}</div>
                        <div class="info-row"><strong><i class="fas fa-map-marker-alt"></i> Координаты:</strong> ${result1.latitude ? result1.latitude + ', ' + result1.longitude : 'Неизвестно'}</div>
                        ${result1.note ? `<div class="info-row note"><strong><i class="fas fa-info-circle"></i> Примечание:</strong> ${result1.note}</div>` : ''}
                    </div>
                </div>

                <div class="ip-result-card">
                    <h4><i class="fas fa-desktop"></i> IP 2: ${result2.ip}</h4>
                    <div class="ip-info">
                        <div class="info-row"><strong><i class="fas fa-flag"></i> Страна:</strong> ${formatValue(result2.country)}</div>
                        <div class="info-row"><strong><i class="fas fa-city"></i> Город:</strong> ${formatValue(result2.city)}</div>
                        <div class="info-row"><strong><i class="fas fa-map"></i> Регион:</strong> ${formatValue(result2.region)}</div>
                        <div class="info-row"><strong><i class="fas fa-clock"></i> Временная зона:</strong> ${formatValue(result2.timezone)}</div>
                        <div class="info-row"><strong><i class="fas fa-building"></i> Организация:</strong> ${formatValue(result2.org)}</div>
                        <div class="info-row"><strong><i class="fas fa-network-wired"></i> ASN:</strong> ${formatValue(result2.asn)}</div>
                        <div class="info-row"><strong><i class="fas fa-map-marker-alt"></i> Координаты:</strong> ${result2.latitude ? result2.latitude + ', ' + result2.longitude : 'Неизвестно'}</div>
                        ${result2.note ? `<div class="info-row note"><strong><i class="fas fa-info-circle"></i> Примечание:</strong> ${result2.note}</div>` : ''}
                    </div>
                </div>

                <div class="distance-info">
                    <h4><i class="fas fa-ruler-combined"></i> Расстояние между IP</h4>
                    <div class="distance-value">${distance}</div>
                    ${distance !== 'Недостаточно данных' ? '<div class="distance-note">Прямое расстояние по поверхности Земли</div>' : ''}
                </div>
            </div>
        `;

        // Если есть координаты, показываем карту
        if (result1.latitude && result1.longitude && result2.latitude && result2.longitude) {
            setTimeout(() => {
                showIPMap(result1, result2);
            }, 100);
        }
    }

    function showIPMap(ip1, ip2) {
        const resultsContainer = document.getElementById('ip-results');
        const mapContainer = document.createElement('div');
        mapContainer.id = 'ip-map-container';
        mapContainer.style.marginTop = '20px';
        mapContainer.style.height = '300px';
        mapContainer.style.borderRadius = 'var(--radius)';
        mapContainer.style.overflow = 'hidden';
        mapContainer.style.border = '1px solid var(--border-color)';

        resultsContainer.appendChild(mapContainer);

        // Динамически загружаем Leaflet если еще не загружен
        if (typeof L === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => initializeMap(ip1, ip2, mapContainer);
            document.head.appendChild(script);
        } else {
            initializeMap(ip1, ip2, mapContainer);
        }
    }

    function initializeMap(ip1, ip2, container) {
        try {
            // Создаем карту
            const map = L.map(container).setView([ip1.latitude, ip1.longitude], 3);

            // Добавляем слой карты
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Добавляем маркеры
            L.marker([ip1.latitude, ip1.longitude])
                .addTo(map)
                .bindPopup(`<b>IP 1</b><br>${ip1.ip}<br>${ip1.city || 'Неизвестно'}, ${ip1.country || 'Неизвестно'}`)
                .openPopup();

            L.marker([ip2.latitude, ip2.longitude])
                .addTo(map)
                .bindPopup(`<b>IP 2</b><br>${ip2.ip}<br>${ip2.city || 'Неизвестно'}, ${ip2.country || 'Неизвестно'}`);

            // Добавляем линию между точками
            L.polyline([
                [ip1.latitude, ip1.longitude],
                [ip2.latitude, ip2.longitude]
            ], {
                color: 'red',
                weight: 2,
                opacity: 0.7,
                dashArray: '5, 10'
            }).addTo(map);

            // Подгоняем карту чтобы показать оба маркера
            const group = new L.featureGroup([
                L.marker([ip1.latitude, ip1.longitude]),
                L.marker([ip2.latitude, ip2.longitude])
            ]);
            map.fitBounds(group.getBounds().pad(0.1));

        } catch (error) {
            console.error('Error initializing map:', error);
            container.innerHTML = '<div class="error-resp">Не удалось загрузить карту</div>';
        }
    }

    function createStyleContainerBg(element) {

        const containerBg = document.createElement('div');
        containerBg.className = 'modal fade';
        containerBg.id = 'container-background';
        containerBg.tabIndex = '-1';
        containerBg.style.dispaly = 'none';
        containerBg.ariaHidden = 'true';

        const parentElement = document.querySelector(element);
        parentElement.parentNode.insertBefore(containerBg, parentElement);

        const containerContent = document.createElement('div');
        containerContent.className = 'modal-dialog modal-dialog-centered';
        containerContent.id = 'style-container-content';
        containerBg.appendChild(containerContent);

        const styleContainer = document.createElement('div');
        styleContainer.className = 'modal-content';
        containerContent.appendChild(styleContainer);

        const styleContHead = document.createElement('div');
        const styleContBody = document.createElement('div');
        styleContHead.className = 'modal-header';
        styleContBody.className = 'modal-body';
        styleContBody.style.display = 'flex';
        styleContBody.style.flexDirection = 'column';
        styleContainer.appendChild(styleContHead);
        styleContainer.appendChild(styleContBody);

        const styleTitleBadge = document.createElement('span');
        styleTitleBadge.className = 'badge bg-success';
        styleTitleBadge.textContent = 'STYLE';
        styleTitleBadge.style.fontSize = '16px';
        styleContHead.appendChild(styleTitleBadge);

        const styleTitleText = document.createElement('span');
        styleTitleText.className = 'style-title-text';
        styleTitleText.textContent = 'Переключатель Тем';
        styleContHead.appendChild(styleTitleText);

        const styleClose = document.createElement('button');
        styleClose.type = 'button';
        styleClose.className = 'btn-close';
        styleClose.dataset.bsDismiss = 'modal';
        styleClose.ariaLabel = 'Close';
        styleContHead.appendChild(styleClose);

        const switchStyleBlock = document.createElement('label');
        switchStyleBlock.className = 'switch';
        switchStyleBlock.innerHTML = `
            <input type="checkbox" id="styleToggleCheck">
            <span class="slider round" style="padding-right: 20px;"></span>
            <div class="addingText tooltip-style" style="display: block; width: max-content; margin: 5px; margin-left: 50px">Включить Переливание Текста
            <span class="tooltip-style-text">Добавляет анимированный градиент на некоторые элементы (повышается нагрузка)</span></div>
            </span>
        `;
        styleContBody.appendChild(switchStyleBlock);

        const styleToggleCheck = document.getElementById('styleToggleCheck');
        if (localStorage.getItem('styleThemeEnabled') === 'true') {
            styleToggleCheck.checked = true;
            applyTextGradient();
        }
        styleToggleCheck.addEventListener('change', function () {
            if (styleToggleCheck.checked) {
                applyTextGradient();
                localStorage.setItem('styleThemeEnabled', 'true');
            } else {
                removeTextGradient();
                localStorage.setItem('styleThemeEnabled', 'false');
            }
        });

        const switchNumsBlock = document.createElement('label');
        switchNumsBlock.className = 'switch';
        switchNumsBlock.innerHTML = `
            <input type="checkbox" id="switchNumsCheck">
            <span class="slider round" style="padding-right: 20px;"></span>
            <div class="addingText tooltip-style" style="display: block; width: max-content; margin: 5px; margin-left: 50px">Включить Разряды Чисел
            <span class="tooltip-style-text">Переключает способ отображения чисел (1000 => 1 000)<br>Требуется Перезагрузка</span><img src='https://cdn-icons-png.flaticon.com/512/25/25429.png' style='width: 15px; height: 15px; filter: invert(1)'></img></div>
            </span>
        `;
        switchNumsBlock.style.marginTop = '20px';
        styleContBody.appendChild(switchNumsBlock);

        const switchNumsCheck = document.getElementById('switchNumsCheck');
        if (localStorage.getItem('numsSeparateEnabled') === 'true') {
            switchNumsCheck.checked = true;
            applyNumsSeparate();
        }
        switchNumsCheck.addEventListener('change', function () {
            if (switchNumsCheck.checked) {
                applyNumsSeparate();
                localStorage.setItem('numsSeparateEnabled', 'true');
                location.reload();
            } else {
                localStorage.setItem('numsSeparateEnabled', 'false');
                location.reload();
            }
        });

        const switchCopyBankBlock = document.createElement('label');
        switchCopyBankBlock.className = 'switch';
        switchCopyBankBlock.innerHTML = `
            <input type="checkbox" id="switchBankCopyCheck">
            <span class="slider round" style="padding-right: 20px;"></span>
            <div class="addingText tooltip-style" style="display: block; width: max-content; margin: 5px; margin-left: 50px">Включить Режим Доказательств
            <span class="tooltip-style-text">Копирование описания транзакций всех категорий (кроме Бизнесы/Фракции) в без системной информации<br>Требуется перезагрузка</span><img src='https://cdn-icons-png.flaticon.com/512/25/25429.png' style='width: 15px; height: 15px; filter: invert(1)'></img></div>
            </span>
        `;
        switchCopyBankBlock.style.marginTop = '20px';
        styleContBody.appendChild(switchCopyBankBlock);

        const switchCopyBank = document.getElementById('switchBankCopyCheck');
        if (localStorage.getItem('bankCheckEnabled') === 'true') {
            switchCopyBank.checked = true;
            applyCopyDocs();
        }
        switchCopyBank.addEventListener('change', function () {
            if (switchCopyBank.checked) {
                applyCopyDocs();
                localStorage.setItem('bankCheckEnabled', 'true');
                location.reload();
            } else {
                localStorage.setItem('bankCheckEnabled', 'false');
                location.reload();
            }
        });

        const fontSelectorBlock = document.createElement('label');
        fontSelectorBlock.className = 'font-selector-block';
        styleContBody.appendChild(fontSelectorBlock);

        const fontSelector = document.createElement('select');
        fontSelector.className = 'selector';
        fontSelector.id = 'font-selector';
        const storedFont = localStorage.getItem('selectedFont') || 'Roboto';
        const fonts = ['Bad Script', 'Comfortaa', 'Fira Sans', 'Marmelad', 'Montserrat', 'Neucha', 'Play', 'Roboto', 'Sofia Sans', 'Ubuntu'];
        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            if (font === storedFont) {
                option.selected = true;
                document.body.style.fontFamily = font;
            }
            fontSelector.appendChild(option);
        });
        fontSelector.addEventListener('change', function () {
            const selectedFont = this.value;
            document.body.style.fontFamily = selectedFont;
            localStorage.setItem('selectedFont', selectedFont);
        });
        fontSelectorBlock.appendChild(fontSelector);

        const fontSelectorText = document.createElement('span');
        fontSelectorText.className = 'addingText';
        fontSelectorText.textContent = 'Выбор Шрифта';
        fontSelectorBlock.appendChild(fontSelectorText);

        const colorSelectorBlock = document.createElement('label');
        colorSelectorBlock.className = 'color-selector-block';
        styleContBody.appendChild(colorSelectorBlock);

        const colorSelector = document.createElement('select');
        colorSelector.className = 'selector';
        colorSelector.id = 'color-selector';
        const storedColor = localStorage.getItem('selectedColor') || 'WHITE';
        const colors = ['-------МЯГКИЕ-------', 'PINK', 'KHAKI', 'SKYBLUE', 'PALEGREEN', '', '-------ЯРКИЕ-------', 'RED', 'LIME', 'CYAN', 'WHITE', 'YELLOW', 'MAGENTA', 'DEEPPINK',];
        const colorCodes = {
            'PINK': '#FFC0CB',
            'KHAKI': '#F0E68C',
            'SKYBLUE': '#87CEEB',
            'PALEGREEN': '#98FB98',
            'RED': '#FF0000',
            'LIME': '#00FF00',
            'CYAN': '#00FFFF',
            'WHITE': '#FFFFFF',
            'YELLOW': '#FFFF00',
            'MAGENTA': '#FF00FF',
            'DEEPPINK': '#FF1493'
        };
        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            if (color === storedColor) {
                option.selected = true;
                applySelectedStyle(colorCodes[color]);
            }
            colorSelector.appendChild(option);
        });
        colorSelector.addEventListener('change', function () {
            if (this.value !== '-------МЯГКИЕ-------' && this.value !== '' && this.value !== '-------ЯРКИЕ-------') {
                const selectedColor = this.value;
                localStorage.setItem('selectedColor', selectedColor);
                applySelectedStyle(colorCodes[selectedColor]);
            }
        });
        colorSelectorBlock.appendChild(colorSelector);

        const colorSelectorText = document.createElement('span');
        colorSelectorText.className = 'addingText';
        colorSelectorText.textContent = 'Выбор Цвета';
        colorSelectorBlock.appendChild(colorSelectorText);

        const brightnessSliderBlock = document.createElement('label');
        brightnessSliderBlock.className = 'brightness-slider-block';
        styleContBody.appendChild(brightnessSliderBlock);

        const storedBright = localStorage.getItem('savedBrightness') || '100';
        const htmlContent = document.querySelector('html');
        const brightnessSlider = document.createElement('input');
        htmlContent.style.filter = `brightness(${storedBright}%)`
        brightnessSlider.id = 'brightness-slider';
        brightnessSlider.type = 'range';
        brightnessSlider.min = '30';
        brightnessSlider.max = '100';
        brightnessSlider.style.marginTop = '30px';
        brightnessSlider.style.marginRight = '10px';
        brightnessSlider.value = storedBright;
        brightnessSlider.addEventListener('input', function () {
            const brightnessValue = this.value;
            localStorage.setItem('savedBrightness', brightnessValue);
            htmlContent.style.filter = `brightness(${brightnessValue}%)`;
        });
        brightnessSliderBlock.appendChild(brightnessSlider);

        const brightnessSliderText = document.createElement('span');
        brightnessSliderText.className = 'addingText';
        brightnessSliderText.textContent = 'Выбор Яркости';
        brightnessSliderBlock.appendChild(brightnessSliderText);

        const nickColorBlock = document.createElement('label');
        nickColorBlock.className = 'color-picker-nickname';
        styleContBody.appendChild(nickColorBlock);

        const colorNickElement = document.createElement('input');
        const nickColor = localStorage.getItem('playerNameColor') || '#ff8800';
        colorNickElement.className = 'color-picker';
        colorNickElement.type = 'color';
        colorNickElement.value = nickColor;
        colorNickElement.addEventListener('input', function () {
            const selectedColor = colorNickElement.value;
            const tdElements = document.querySelectorAll('td.td-player-name[data-v-2d76ca92=""]');
            localStorage.setItem('playerNameColor', selectedColor);
            tdElements.forEach(function (td) {
                const playerNick = td.querySelector('a');
                if (playerNick) {
                    playerNick.style.color = selectedColor;
                    playerNick.style.textShadow = '0px 0px 1px' + selectedColor;
                }
            });
        });
        nickColorBlock.appendChild(colorNickElement);

        const colorNickText = document.createElement('span');
        colorNickText.className = 'addingText';
        colorNickText.textContent = 'Цвет Никнеймов';
        nickColorBlock.appendChild(colorNickText);

        const categoryColorBlock = document.createElement('label');
        nickColorBlock.className = 'color-picker-category';
        styleContBody.appendChild(categoryColorBlock);

        const colorCategoryElement = document.createElement('input');
        const categoryColor = localStorage.getItem('categoryColor') || '#0088ff';
        colorCategoryElement.className = 'color-picker';
        colorCategoryElement.type = 'color';
        colorCategoryElement.value = categoryColor;
        colorCategoryElement.addEventListener('input', function () {
            const selectedColor = colorCategoryElement.value;
            const tdElements = document.querySelectorAll('td.td-category[data-v-2d76ca92=""]');
            localStorage.setItem('categoryColor', selectedColor);
            tdElements.forEach(function (td) {
                const category = td.querySelector('a');
                if (category) {
                    category.style.color = selectedColor;
                    category.style.textShadow = '0px 0px 1px' + selectedColor;
                }
            });
        });
        categoryColorBlock.appendChild(colorCategoryElement);

        const colorCategoryText = document.createElement('span');
        colorCategoryText.className = 'addingText';
        colorCategoryText.textContent = 'Цвет Категорий';
        categoryColorBlock.appendChild(colorCategoryText);

        const bugReportBlock = document.createElement('label');
        bugReportBlock.className = 'bug-report-block';
        styleContBody.appendChild(bugReportBlock);

        const bugReportTG = document.createElement('a');
        bugReportTG.href = 'https://t.me/capybarcky_team'
        bugReportTG.target = '_blank';
        bugReportTG.innerHTML = `<img class="bug-report-button" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png"></img>`;
        bugReportBlock.appendChild(bugReportTG);

        const bugReportVK = document.createElement('a');
        bugReportVK.href = 'https://vk.me/paul.pasha'
        bugReportVK.target = '_blank';
        bugReportVK.innerHTML = `<img class="bug-report-button" src="https://cdn-icons-png.flaticon.com/512/145/145813.png"></img>`;
        bugReportBlock.appendChild(bugReportVK);

        const bugReportGF = document.createElement('a');
        bugReportGF.href = 'https://greasyfork.org/ru/scripts/487756-скрипт-для-системы-логирования'
        bugReportGF.target = '_blank';
        bugReportGF.innerHTML = `<img class="bug-report-button" src="https://raw.githubusercontent.com/JasonBarnabe/greasyfork/master/public/images/blacklogo512.png"></img>`;
        bugReportBlock.appendChild(bugReportGF);

        const bugReportText = document.createElement('span');
        bugReportText.className = 'addingText';
        bugReportText.textContent = 'Баг / Предложение';
        bugReportBlock.appendChild(bugReportText);

    }

    function applyNumsSeparate() {

        function formatNumbersInTable() {

            const tableCells = document.querySelectorAll('td.td-transaction-amount, td.td-balance-after');
            tableCells.forEach(cell => {
                const text = cell.textContent.trim();
                if (!isNaN(text.replace(/,/g, ''))) {
                    const originalValue = parseInt(text.replace(/,/g, ''));
                    const formattedValue = originalValue.toLocaleString('ru');
                    cell.textContent = formattedValue.toString();
                    cell.addEventListener('copy', function (event) {
                        event.clipboardData.setData('text/plain', formattedValue.replace(/\s/g, ''));
                        event.preventDefault();
                    });
                }
            });
        }

        window.onload = function () {
            formatNumbersInTable();
        };

        const observer = new MutationObserver(function (mutationsList) {
            formatNumbersInTable();
        });

        const config = {
            childList: true,
            subtree: true
        };

        observer.observe(document.body, config);

    }

    function applyCopyDocs() {

        function formatTransactionsInTable() {

            const tableRows = document.querySelectorAll('tr.second-row');
            tableRows.forEach(row => {
                const transactionCell = row.querySelector('.td-transaction-desc');
                const playerName = row.previousSibling.querySelector('.td-player-name a').textContent;
                const categoryName = row.previousSibling.querySelector('.td-category a').textContent;
                const transactionAmount = row.previousSibling.querySelector('.td-transaction-amount').textContent;
                const transactionDate = row.previousSibling.querySelector('.td-time').textContent.replace(/\s/g, ' | ');
                const originalText = transactionCell.textContent;

                transactionCell.addEventListener('copy', function (event) {
                    const selection = window.getSelection().toString();
                    if (selection.length >= transactionCell.textContent.length) {


                        function replaceData(expected = '', regex = '') {
                            if (regex != '') {
                                var final = originalText.replace(regex, expected);
                            } else {
                                var final = expected;
                            }
                            event.clipboardData.setData('text/plain', final);
                            event.preventDefault();
                        }


                        function notSupported() {
                            alert('Данная строка не поддерживается скриптом, отправьте эту строку автору скрипта');
                            event.clipboardData.setData('text/plain', originalText);
                            event.preventDefault();
                        }

                        if (categoryName === 'BlackPass') {
                            if (originalText.includes('Получил')) {
                                replaceData(`[BlackPass | ${transactionDate}] ${playerName} - $1`, /(Получил .+)/,);
                            } else if (originalText.includes('+ Выдача')) {
                                replaceData(`[BlackPass | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей`);
                            }
                        } else if (categoryName === 'Helper чат') {
                            if (originalText) {
                                replaceData(`[Helper чат | ${transactionDate}] ${playerName} - Написал "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'NonRP чат') {
                            if (originalText) {
                                replaceData(`[NonRP чат | ${transactionDate}] ${playerName} - Написал "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'RP чат') {
                            if (originalText) {
                                replaceData(`[RP чат | ${transactionDate}] ${playerName} - Написал "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'VIP чат') {
                            if (originalText) {
                                replaceData(`[VIP чат | ${transactionDate}] ${playerName} - Написал "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Админ-блокировки') {
                            if (originalText) {
                                replaceData(`[Админ-блокировки | ${transactionDate}] ${playerName} - "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Админ-действия') {
                            if (originalText) {
                                replaceData(`[Админ-действия | ${transactionDate}] ${playerName} - "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Админ-общий-чат') {
                            if (originalText) {
                                replaceData(`[Глобальный чат (/msg) | ${transactionDate}] ${playerName} - Написал "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Админ-супердействия') {
                            if (originalText) {
                                replaceData(`[Админ-супердействия | ${transactionDate}] ${playerName} - "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Админ-чат') {
                            if (originalText) {
                                replaceData(`[Админ-чат | ${transactionDate}] ${playerName} - Написал "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Аккаунт игрока') {
                            if (originalText.includes('законопослушности')) {
                                replaceData(`[Законопослушность | ${transactionDate}] ${playerName} - Изменение законопослушности, итог: $1. Причина: $2`, /^.*значение: (.*). Причина: (.*)/);
                            } else if (originalText.includes('уровень')) {
                                replaceData(`[Уровень игрока | ${transactionDate}] ${playerName} - $1`, /^(.*)$/);
                            } else if (originalText.includes('Сменил пароль')) {
                                replaceData(`[Пароль | ${transactionDate}] ${playerName} - $1`, /^(.*)$/);
                            } else if (originalText.includes('EXP:')) {
                                replaceData(`[Опыт (EXP) | ${transactionDate}] ${playerName} - $1`, /^(.*)$/);
                            } else if (originalText.includes('Привязал аккаунт')) {
                                replaceData(`[Аккаунт | ${transactionDate}] ${playerName} - $1`, /^\+ (.*)$/);
                            }
                        } else if (categoryName == 'Античит') {
                            if (originalText) {
                                replaceData(`[Античит | ${transactionDate}] ${playerName} - Подозрение на чит: $1`, /^.*: (.*) \|.*$/);
                            }
                        } else if (categoryName == 'Аренда транспорта') {
                            if (originalText) {
                                replaceData(`[Аренда Транспорта | ${transactionDate}] ${playerName} $1 за ${transactionAmount.replace('-', '')} рублей`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Аукцион') {
                            if (originalText.includes('Выставил')) {
                                replaceData(`[Аукцион | ${transactionDate}] ${playerName} - $1 рублей`, /^(.*)$/);
                            } else if (originalText.includes('Выиграл')) {
                                replaceData(`[Аукцион | ${transactionDate}] ${playerName} - $1`, /^(.*)$/);
                            } else if (originalText.includes('Продал')) {
                                replaceData(`[Аукцион | ${transactionDate}] ${playerName} - Продал $1 и получил ${transactionAmount} рублей`, /^.*аукционе (.*) \(возвращено.*$/);
                            } else if (originalText.includes('Вернул')) {
                                replaceData(`[Аукцион | ${transactionDate}] ${playerName} - $1`, /^(.*)$/);
                            } else if (originalText.includes('Ставка')) {
                                replaceData(`[Аукцион | ${transactionDate}] ${playerName} $1, сумма: ${transactionAmount.replace('-', '')} рублей`, /^(.*)$/);
                            } else if (originalText.includes('Возвращена')) {
                                replaceData(`[Аукцион | ${transactionDate}] ${playerName} - Возвращена ставка, сумма: ${transactionAmount} рублей`);
                            }
                        } else if (categoryName == 'Банковская система') {
                            if (originalText.includes('Пополнил счет')) {
                                replaceData(`[Банк | ${transactionDate}] ${playerName} - Пополнил свой счет на ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Пополнил банк. счет')) {
                                replaceData(`[Банк | ${transactionDate}] ${playerName} - Пополнил свой дополнительный счет на ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('руб в банкомате')) {
                                replaceData(`[Банк | ${transactionDate}] ${playerName} - Снял ${transactionAmount} рублей в банкомате`);
                            } else if (originalText.includes('Продлил аренду')) {
                                replaceData(`[Банк | ${transactionDate}] ${playerName} - Продлил аренду имущества на ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Перевел на счет')) {
                                replaceData(`[Банк | ${transactionDate}] ${playerName} - Перевел ${transactionAmount} рублей на банковский счет, владелец $1`, /^.*владелец (.*) \[sql:.*$/);
                            }
                        } else if (categoryName == 'Взаимодействие с игроками') {
                            if (originalText.includes('Получение денег')) {
                                replaceData(`[Передача денег | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей от игрока $1`, /^.*от (.*) \(.*$/);
                            } else if (originalText.includes('Передача денег')) {
                                replaceData(`[Передача денег | ${transactionDate}] ${playerName} - Передал ${transactionAmount.replace('-', '')} рублей игроку $1`, /^.*игроку (.*) \(.*$/);
                            }
                        } else if (categoryName == 'Взаимодействие с казино') {
                            if (originalText.includes('Вышел из казино')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Вышел из казино и получил ${transactionAmount} рублей`);
                            } else if (originalText.includes('Сделал ставку в казино')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Поставил ${transactionAmount.replace('-', '')} рублей на игру "Кости"`);
                            } else if (originalText.includes('Проиграл в казино (пред. ставка)')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Проиграл поставленную на игру "Кости" ставку`);
                            } else if (originalText.includes('Получил выигрыш в казино набрав')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Выиграл ${transactionAmount} рублей в игре "Кости"`);
                            } else if (originalText.includes('Получил процент')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Получил процент в размере ${transactionAmount} рублей в качестве Крупье`);
                            } else if (originalText.includes('Блекджек (ставка')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Поставил ${transactionAmount.replace('-', '')} рублей на игру "BlackJack"`);
                            } else if (originalText.includes('Победил Блекджек')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Выиграл ${transactionAmount} рублей в игре "BlackJack"`);
                            } else if (originalText.includes('Ничья Блекджек')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Вернул ${transactionAmount} рублей из-за Ничьи в игре "BlackJack"`);
                            } else if (originalText.includes('Ставка на миниигру')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Поставил ${transactionAmount.replace('-', '')} рублей на игру "Дурак"`);
                            } else if (originalText.includes('Проиграл в казино дурак')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Проиграл поставленную ставку на игру "Дурак"`);
                            } else if (originalText.includes('Выиграл в казино дурак')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Выиграл ${transactionAmount} рублей в игре "Дурак"`);
                            }
                        } else if (categoryName == 'Восстановления') {
                            if (originalText) {
                                replaceData(`[Восстановление | ${transactionDate}] ${playerName} - Восстановил $2 игроку $1`, /^игроку (.*) \[.*\] (.*)$/);
                            }
                        } else if (categoryName == 'Донат') {
                            if (originalText.includes('Конвертировал')) {
                                replaceData(`[Донат | ${transactionDate}] ${playerName} - Конвертировал Black Coins в игровую валюту и получил ${transactionAmount} рублей`);
                            } else if (originalText.includes('Выиграл')) {
                                replaceData(`[Донат | ${transactionDate}] ${playerName} - Выиграл ${transactionAmount} рублей при открытии кейса`);
                            }
                        } else if (categoryName == 'Жалобы/Вопросы') {
                            if (originalText.includes('Жалоба от')) {
                                replaceData(`[Репорт | ${transactionDate}] ${playerName} - Ответил на жалобу игрока $1; "$2"`, /^Жалоба от (.*) \[.*\]\: (.*)$/);
                            } else if (originalText.includes('Вопрос от')) {
                                replaceData(`[Вопрос | ${transactionDate}] ${playerName} - Ответил игроку $2; Вопрос: "$1", Ответ: "$3"`, /^Вопрос (.*)\[.*\].*игроку (.*)\[.*\] ответ (.*)$/);
                            }
                        } else if (categoryName == 'Имущество игрока') {
                            if (originalText.includes('Получил из промокода')) {
                                replaceData(`[Промо | ${transactionDate}] ${playerName} - $1`, /^(.*?)$/);
                            } else if (originalText.includes('Приобрел улучшение для дома')) {
                                replaceData(`[Дом | ${transactionDate}] ${playerName} - Приобрел улучшение для своего дома за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Приобрел дом')) {
                                replaceData(`[Дом | ${transactionDate}] ${playerName} - Приобрел дом за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Приобрел подвальное помещение')) {
                                replaceData(`[Дом | ${transactionDate}] ${playerName} - Приобрел подвал для своего дома за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Продажа своего дома')) {
                                replaceData(`[Дом | ${transactionDate}] ${playerName} - Продал свой дом государству за $1 рублей`, /^.*итого: (.*) рублей.*$/);
                            } else if (originalText.includes('Продажа дома')) {
                                replaceData(`[Дом | ${transactionDate}] ${playerName} - Продал дом игроку $1 за ${transactionAmount}`, /^.*игроку (.*)$/);
                            } else if (originalText.includes('Слетел дом')) {
                                replaceData(`[Дом | ${transactionDate}] ${playerName} - Дом слетел и игрок получил ${transactionAmount} рублей`);
                            } else if (originalText.includes('Слетел гараж')) {
                                replaceData(`[Гараж | ${transactionDate}] ${playerName} - Гараж слетел и игрок получил ${transactionAmount} рублей`);
                            } else if (originalText.includes('Продажа гаража')) {
                                replaceData(`[Гараж | ${transactionDate}] ${playerName} - Продал свой гараж государству за ${transactionAmount} рублей`);
                            } else if (originalText.includes('Покупка гаража')) {
                                replaceData(`[Гараж | ${transactionDate}] ${playerName} - Купил гараж за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Улучшение гаража')) {
                                replaceData(`[Гараж | ${transactionDate}] ${playerName} - Купил улучшение для гаража за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Купил гараж')) {
                                replaceData(`[Гараж | ${transactionDate}] ${playerName} - Купил гараж за ${transactionAmount.replace('-', '')} рублей у игрока $1`, /^игрока (.*). .*$/);
                            } else if (originalText.includes('Продал гараж')) {
                                replaceData(`[Гараж | ${transactionDate}] ${playerName} - Продал гараж за ${transactionAmount} рублей игроку $1`, /^.*игроку (.*). .*$/);
                            } else if (originalText.includes('Приобрел улучшение для подвала')) {
                                replaceData(`[Дом | ${transactionDate}] ${playerName} - Улучшил подвал своего дома за ${transactionAmount.replace('-', '')} рублей`);
                            }
                        } else if (categoryName == 'Квесты') {
                            if (originalText) {
                                replaceData(`[Квесты | ${transactionDate}] ${playerName} - Выполнил $1 квест и получил ${transactionAmount}`, /^\+ Выполнение (.*) квеста$/);
                            }
                        } else if (categoryName == 'Контейнеры') {
                            if (originalText.includes('Продал содержимое')) {
                                replaceData(`[Контейнеры | ${transactionDate}] ${playerName} - Продал содержимое контейнера $1 и получил ${transactionAmount} рублей`, /^.*содержимое (.*) контейнера.*$/);
                            } else if (originalText.includes('Победа в торгах')) {
                                replaceData(`[Контейнеры | ${transactionDate}] ${playerName} - Выиграл торги за контейнер за ${transactionAmount.replace('-', '')}`);
                            } else if (originalText.includes('Выиграл')) {
                                replaceData(`[Контейнеры | ${transactionDate}] ${playerName} - Получил $1 ($2) после победы на торгах за контейнер`, /^Выиграл (.*) в .*: (.*) \(.*$/);
                            }
                        } else if (categoryName == 'Купоны') {
                            if (originalText) {
                                replaceData(`[Купон | ${transactionDate}] ${playerName} - Получил купон: ID $1`, /^.*ID (.*)$/);
                            }
                        } else if (categoryName == 'Лицензии') {
                            if (originalText.includes('Оплата экзамена')) {
                                replaceData(`[Лицензии | ${transactionDate}] ${playerName} $1 за ${transactionAmount.replace('-', '')} рублей`, /^(.*?)$/);
                            } else if (originalText.includes('Приобрел в правительстве')) {
                                replaceData(`[Лицензии | ${transactionDate}] ${playerName} $1 за ${transactionAmount.replace('-', '')} рублей`, /^(.*?)$/);
                            } else if (originalText.includes('Лицензия анулирована')) {
                                replaceData(`[Лицензии | ${transactionDate}] ${playerName} - $1`, /^(.*?)$/);
                            }
                        } else if (categoryName == 'Личное транспортное средство') {
                            if (originalText.includes('Купил изменение')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Купил изменение "$1" на автомобиль $2 за ${transactionAmount.replace('-', '')} рублей`, /^.*изменение "(.*)" на авто (.*) \[.*$/);
                            } else if (originalText.includes('Купил деталь')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Купил деталь "$1" на автомобиль $2 за ${transactionAmount.replace('-', '')} рублей`, /^.*деталь "(.*)".* на авто (.*) \[.*$/);
                            } else if (originalText.includes('Установил номерные')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Установил номер $1 на свой автомобиль`, /^.*знаки (.*) \(.*$/);
                            } else if (originalText.includes('Снял номерные')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Снял номер $1 со своего автомобиля`, /^.*знаки (.*) \(.*$/);
                            } else if (originalText.includes('Отметил свое')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Отметил свой автомобиль по GPS`);
                            } else if (originalText.includes('Продажа транспорта')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Продал автомобиль $1 игроку $2 за ${transactionAmount} рублей`, /^.* транспорта (.*) \(.*\) для игрока (.*) \[.*$/);
                            } else if (originalText.includes('Продал транспортное')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Продал автомобиль $1 государству за ${transactionAmount} рублей`, /^.*средство (.*) \(.*\)$/);
                            } else if (originalText.includes('Покупка транспорта') && originalText.includes('у игрока')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Купил автомобиль $1 у игрока $2 за ${transactionAmount.replace('-', '')} рублей`, /^.* Покупка транспорта (.*) \(.*$/);
                            } else if (originalText.includes('Покупка транспорта') && originalText.includes('в автосалоне')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Купил автомобиль $1 в автосалоне за ${transactionAmount.replace('-', '')} рублей`, /^.* Покупка транспорта (.*) \(.*$/);
                            } else if (originalText.includes('Обменялся')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Обменял свой автомобиль $3 на автомобиль $2 игрока $1 без доплаты`, /^Обменялся с (.*) \(Авто (.*) \(.*\) на Авто (.*) \(.*$/);
                            } else if (originalText.includes('+ Доплата за обмен')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Обменял свой автомобиль $3 на автомобиль $2 игрока $1 с доплатой ${transactionAmount.replace('-', '')}`, /^.*обмен от (.*) \(Авто (.*) \(.*\) на Авто (.*) \(.*$/);
                            } else if (originalText.includes('- Доплата за обмен')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Обменял свой автомобиль $3 на автомобиль $2 игрока $1 с доплатой ${transactionAmount.replace('-', '')}`, /^.*игроку (.*) \(Авто (.*) \(.*\) на Авто (.*) \(.*$/);
                            } else if (originalText.includes('Выиграл')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Выиграл автомобиль $1 в BlackPass`, /^.*blackpass: (.*) \[.*$/);
                            }
                        } else if (categoryName == 'Лотерея') {
                            if (originalText.includes('Приобрел')) {
                                replaceData(`[Лотерея | ${transactionDate}] ${playerName} - Приобрел лотерейный билет, число $1`, /^.*число: (.*)$/);
                            } else if (originalText.includes('Выигрыш')) {
                                replaceData(`[Лотерея | ${transactionDate}] ${playerName} - Выиграл ${transactionAmount} рублей в лотерею, $1`, /^.*совпали (.*)$/);;
                            }
                        } else if (categoryName == 'Мероприятия') {
                            if (originalText.includes('Выдача денег')) {
                                replaceData(`[BlackPass | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей из BlackPass`);
                            } else if (originalText.includes('Аренда лодки')) {
                                replaceData(`[Аренда | ${transactionDate}] ${playerName} - Арендовал лодку за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('За отметку')) {
                                replaceData(`[GPS | ${transactionDate}] ${playerName} - Отметил дом на GPS за ${transactionAmount.replace('-', '')} рублей`);
                            }
                        } else if (categoryName == 'Мобильный телефон') {
                            if (originalText.includes('Пополнил')) {
                                replaceData(`[Телефон | ${transactionDate}] ${playerName} - Пополнил счет телефона на ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Приобрел смену')) {
                                replaceData(`[Телефон | ${transactionDate}] ${playerName} - Сменил номер за ${transactionAmount.replace('-', '')} рублей. Новый номер: $1`, /^.*Новый номер: (.*)$/);
                            }
                        } else if (categoryName == 'Начальные работы') {
                            if (originalText.includes('кладо')) {
                                replaceData(`[Кладоискатель | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей, затраченное время: $1`, /^.*выполнил за (.*)\)$/);
                            } else if (originalText.includes('электрик')) {
                                replaceData(`[Электрик | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за выполнение вызова`);
                            } else if (originalText.includes('капитану')) {
                                replaceData(`[Водолаз | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за продажу предмета`);
                            } else if (originalText.includes('заказа инкассатор')) {
                                replaceData(`[Инкассация | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за выполнение заказа`);
                            } else if (originalText.includes('транспорта инкассатор')) {
                                replaceData(`[Инкассатор | ${transactionDate}] ${playerName} - Арендовал рабочий транспорт за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Арендовал прицеп')) {
                                replaceData(`[Транспортная Компания | ${transactionDate}] ${playerName} - Арендовал прицеп`);
                            } else if (originalText.includes('Выполнил заказ за')) {
                                replaceData(`[Транспортная Компания | ${transactionDate}] ${playerName} - Выполнил заказ за $1 секунд и получил ${transactionAmount} рублей`, /^.*заказ за (\d+) секунд.$/);
                            } else if (originalText.includes('[ТК] Аренда Т/О')) {
                                replaceData(`[Транспортная Компания | ${transactionDate}] ${playerName} - Арендовал фуру за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Загрузил груз')) {
                                replaceData(`[Транспортная Компания | ${transactionDate}] ${playerName} - Загрузил груз в прицеп`);
                            } else if (originalText.includes('Дошел к разгрузке')) {
                                replaceData(`[Транспортная Компания | ${transactionDate}] ${playerName} - Дошел к разгрузке за $1 секунд`, /^.*разгрузке за (.*) секунд$/);
                            } else if (originalText.includes('+ Механик, починка')) {
                                replaceData(`[Механик | ${transactionDate}] ${playerName} - Починил автомобиль игроку $1 за ${transactionAmount} рублей`, /^.*игроку (.*)$/);
                            } else if (originalText.includes('- Починка')) {
                                replaceData(`[Механик | ${transactionDate}] ${playerName} - Починил автомобиль у игрока $1 за ${transactionAmount.replace('-', '')} рублей`, /^.*механика (.*)$/);
                            } else if (originalText.includes('Зарплата водителем автобуса')) {
                                replaceData(`[Автобус | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за маршрут`);
                            } else if (originalText.includes('Аредновал автобус')) {
                                replaceData(`[Автобус | ${transactionDate}] ${playerName} - Арендовал автобус за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('шахтер')) {
                                replaceData(`[Шахта | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за смену`);
                            } else if (originalText.includes('в МЧС')) {
                                replaceData(`[МЧС | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за задание`);
                            } else if (originalText.includes('курьера')) {
                                replaceData(`[Курьер | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за заказ`);;
                            } else if (originalText.includes('газовика')) {
                                replaceData(`[Газовик | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за заказ`);
                            } else if (originalText.includes('такси')) {
                                replaceData(`[Такси | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за заказ`);
                            } else if (originalText.includes('завод')) {
                                replaceData(`[Завод | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за смену`);
                            }
                        } else if (categoryName == 'Номера') {
                            if (originalText.includes('Купил')) {
                                replaceData(`[Номер | ${transactionDate}] ${playerName} - Купил номер $1 за ${transactionAmount.replace('-', '')} рублей`, /^.*транспорта (.*) \(.*$/);
                            } else if (originalText.includes('Обновил')) {
                                replaceData(`[Номер | ${transactionDate}] ${playerName} - Обновил номер при покупке за ${transactionAmount.replace('-', '')}`);
                            }
                        } else if (categoryName == 'Обмен баллов') {
                            if (originalText.includes('+')) {
                                replaceData(`[E-Points | ${transactionDate}] ${playerName} - $1`, /^\+ (.*).$/);
                            }
                        } else if (categoryName == 'Объявления') {
                            if (originalText.includes('Отправил')) {
                                replaceData(`[СМИ | ${transactionDate}] ${playerName} - Отправил объявление "$1" за ${transactionAmount.replace('-', '')} рублей`, /^.*объявление: (.*)$/)
                            } else if (originalText.includes('Отредактировал')) {
                                replaceData(`[СМИ | ${transactionDate}] ${playerName} - Отредактировал объявление игрока $1 за ${transactionAmount} рублей, текст: "$2"`, /^.*объявление (\w+): (.*) \(.*$/);
                            }
                        } else if (categoryName == 'Остальное') {
                            if (originalText.includes('Переместил')) {
                                replaceData(`[Инвентарь | ${transactionDate}] ${playerName} - $1`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Охота') {
                            if (originalText.includes('Приобрел')) {
                                replaceData(`[Охота | ${transactionDate}] ${playerName} - $1 за ${transactionAmount.replace('-', '')} рублей`, /^- (.*)$/);
                            } else if (originalText.includes('Получил за продажу')) {
                                replaceData(`[Охота | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за продажу животного`);
                            } else if (originalText.includes('вознаграждение')) {
                                replaceData(`[Охота | ${transactionDate}] ${playerName} - Получил вознаграждение: $1`, /^.*\((.*)\)$/);
                            }
                        } else if (categoryName == 'Подключения/Отключания') {
                            if (originalText.includes('подключился')) {
                                replaceData(`[Сервер | ${transactionDate}] ${playerName} - Подключился к серверу, ID: ${transactionAmount}`);
                            } else if (originalText.includes('отключился')) {
                                replaceData(`[Сервер | ${transactionDate}] ${playerName} - Отключился от сервера, ID: ${transactionAmount}`);
                            }
                        } else if (categoryName == 'Пожертвования') {
                            if (originalText.includes('Пожертвовал')) {
                                replaceData(`[Пожертвования | ${transactionDate}] ${playerName} - Пожертвовал ${transactionAmount.replace('-', '')} рублей в банке`);
                            }
                        } else if (categoryName == 'Покупка кустов с наркотиками') {
                            if (originalText.includes('Приобрел')) {
                                replaceData(`[Покупка кустов | ${transactionDate}] ${playerName} - Купил $1 кустов за ${transactionAmount.replace('-', '')} рублей`, /^.*. \((.*).\)$/);
                            }
                        } else if (categoryName == 'Покупка предметов в магазине') {
                            if (originalText.includes('Приобрел')) {
                                replaceData(`[Покупка в магазине | ${transactionDate}] ${playerName} - Купил $1 за ${transactionAmount.replace('-', '')} рублей`, /^- Приобрел (.*) в бизнесе .*$/);
                            }
                        } else if (categoryName == 'Попрошайничество') {
                            if (originalText.includes('Получил')) {
                                replaceData(`[Попрошайничество | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за попрошайничество`);
                            }
                        } else if (categoryName == 'Промокоды') {
                            if (originalText.includes('Получил за введенный')) {
                                replaceData(`[Промо | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за введенный промокод "$1"`, /^.*\((.*)\)$/);
                            } else if (originalText.includes('Получил за введенные')) {
                                replaceData(`[Промо | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за введенные промокоды (/checkpromo)`);
                            } else if (originalText.includes('Создал')) {
                                replaceData(`[Промо | ${transactionDate}] ${playerName} - Создал промокод "$1" за ${transactionAmount.replace('-', '')} рублей`, /^.*промокод (.*)$/);
                            }
                        } else if (categoryName == 'Реклама') {
                            if (originalText.includes('Получил')) {
                                replaceData(`[Реклама | ${transactionDate}] ${playerName} - Получил мут за повторение сообщения "$1"`, /^.*Текст: (.*)$/);
                            } else if (originalText.includes('подозревается')) {
                                replaceData(`[Промо | ${transactionDate}] ${playerName} - Подозревается в рекламе. Текст: "$1"`, /^.*рекламе! \[(.*)\]$/);
                            }
                        } else if (categoryName == 'Реферальная система') {
                            if (originalText.includes('Получил вознаграждение')) {
                                replaceData(`[Рефералы | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за реферера (пригласившего)`);
                            } else if (originalText.includes('Получил деньги')) {
                                replaceData(`[Реферала | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за реферала (приглашенного)`);
                            }
                        } else if (categoryName == 'Рулетка') {
                            if (originalText.includes('Забрал')) {
                                replaceData(`[Рулетка | ${transactionDate}] ${playerName} - Забрал выигрыш из рулетки: $1`, /^.*выигрыш: (.*)$/);
                            }
                        } else if (categoryName == 'Рыболовство') {
                            if (originalText.includes('Продал')) {
                                replaceData(`[Рыболовство | ${transactionDate}] ${playerName} - Продал рыбу в рыболовном магазине`);
                            }
                        } else if (categoryName == 'Свадьба') {
                            if (originalText.includes('Покупка')) {
                                replaceData(`[Свадьба | ${transactionDate}] ${playerName} - Купил обручальные кольца за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Арендовал')) {
                                replaceData(`[Свадьба | ${transactionDate}] ${playerName} - Арендовал свадебный $1 за ${transactionAmount.replace('-', '')} рублей`, /^.*средство: (.*)$/);
                            }
                        } else if (categoryName == 'Семейный чат') {
                            if (originalText) {
                                replaceData(`[Семейный чат | ${transactionDate}] ${playerName} - Написал "$1"`, /^.*\]: (.*)$/);
                            }
                        } else if (categoryName == 'Семьи') {
                            if (originalText.includes('Взял') || originalText.includes('Положил в сейф') || originalText.includes('Выдал') || originalText.includes('Выгнал') || originalText.includes('Принял')) {
                                replaceData(`[Семьи | ${transactionDate}] ${playerName} - $1`, /^.*\)\] (.*)$/);
                            } else if (originalText.includes('Покинул')) {
                                replaceData(`[Семьи | ${transactionDate}] ${playerName} - Покинул свою семью`);
                            } else if (originalText.includes('Снял')) {
                                replaceData(`[Семьи | ${transactionDate}] ${playerName} - Снял ${transactionAmount} рублей со счета семьи`);
                            } else if (originalText.includes('Положил')) {
                                replaceData(`[Семьи | ${transactionDate}] ${playerName} - Положил ${transactionAmount.replace('-', '')} рублей на счет семьи`);
                            }
                        } else if (categoryName == 'Склад фракции') {
                            if (originalText.includes('Положил')) {
                                replaceData(`[Склад фракции | ${transactionDate}] ${playerName} - Положил ${transactionAmount.replace('-', '')} рублей на склад фракции`);
                            } else if (originalText.includes('Взял')) {
                                replaceData(`[Склад фракции | ${transactionDate}] ${playerName} - Взял ${transactionAmount} рублей со склада фракции`);
                            }
                        } else if (categoryName == 'Смена имени') {
                            if (originalText) {
                                replaceData(`[Смена имени | ${transactionDate}] ${playerName} - Сменил имя на $1`, /^.*на (.*) \(.*$/);
                            }
                        } else if (categoryName == 'Сообщения') {
                            if (originalText) {
                                replaceData(`[SMS | ${transactionDate}] ${playerName} - Написал игроку $1: "$2"`, /^Для (.*)\[.*\]: (.*)$/);
                            }
                        } else if (categoryName == 'Телефонные звонки') {
                            if (originalText) {
                                replaceData(`[Звонок | ${transactionDate}] ${playerName} - Написал игроку $1: "$2"`, /^.* > (.*)\[.*\]: (.*)$/);
                            }
                        } else if (categoryName == 'Трейды') {
                            if (originalText.includes('начат')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Начал трейд`);
                            } else if (originalText.includes('не завершился')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Обмен отменен`);
                            } else if (originalText.includes('успешно закончен')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Обмен завершен`);
                            } else if (originalText.includes('добавил предмет')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Добавил предмет $1 в обмен`, /^.*предмет (.*) \(.*$/);
                            } else if (originalText.includes('добавил') && originalText.includes('рублей')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Добавил $1 рублей в обмен`, /^.*добавил (.*) рублей$/);
                            } else if (originalText.includes('написал')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Написал "$1" в чате обмена`, /^.*написал: (.*)$/);
                            } else if (originalText.includes('+ Доплата')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей после обмена с игроком $1`, /^.*с игроком (.*) \[.*$/);
                            } else if (originalText.includes('- Доплата')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Доплатил ${transactionAmount.replace('-', '')} рублей за обмен с игроком $1`, /^.*с игроком (.*) \[.*$/);
                            }
                        } else if (categoryName == 'Ферма') {
                            if (originalText.includes('Арендовал на ферме')) {
                                replaceData(`[Ферма | ${transactionDate}] ${playerName} - Арендовал $1 за ${transactionAmount.replace('-', '')} рублей`, /^.*: (.*)$/);
                            } else if (originalText.includes('Арендовал') && originalText.includes('минут')) {
                                replaceData(`[Ферма | ${transactionDate}] ${playerName} - Арендовал $1 за ${transactionAmount.replace('-', '')} рублей`, /^.*Арендовал (.*)$/);
                            } else if (originalText.includes('Получил')) {
                                replaceData(`[Ферма | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за работу на ферме`);
                            }
                        } else if (categoryName == 'Штрафы') {
                            if (originalText.includes('Оплатил')) {
                                replaceData(`[Штрафы | ${transactionDate}] ${playerName} - Оплатил штраф(-ы) на сумму ${transactionAmount.replace('-', '')} рублей`);
                            }
                        }
                        else {
                            event.clipboardData.setData('text/plain', originalText);
                            event.preventDefault();
                        }
                    }
                });
            });
        }

        window.onload = function () {
            formatTransactionsInTable();
        };

        const observer = new MutationObserver(function (mutationsList) {
            formatTransactionsInTable();
        });

        const config = {
            childList: true,
            subtree: true
        };

        observer.observe(document.body, config);

    }

    function applySelectedStyle(color) {

        function darkenColor(hexCode, percent) {

            percent = Math.max(0, Math.min(100, percent));


            var r = parseInt(hexCode.substring(1, 3), 16);
            var g = parseInt(hexCode.substring(3, 5), 16);
            var b = parseInt(hexCode.substring(5, 7), 16);


            r = Math.round(r * (100 - percent) / 100);
            g = Math.round(g * (100 - percent) / 100);
            b = Math.round(b * (100 - percent) / 100);


            var result = '#' + (r < 16 ? '0' : '') + r.toString(16)
                + (g < 16 ? '0' : '') + g.toString(16)
                + (b < 16 ? '0' : '') + b.toString(16);

            return result;
        }


        const darkColor80 = darkenColor(color, 80);
        const darkColor50 = darkenColor(color, 50);
        const darkColor20 = darkenColor(color, 20);

        const currentStyleElement = document.getElementById('customStyle');
        if (currentStyleElement) {
            currentStyleElement.remove();
        }

        const styleElement = document.createElement('style');
        styleElement.id = 'customStyle';
        styleElement.textContent = `
                        /* Selected Font Accent Stylesheet */
                        /* In development */

                        h1, h2, h3, h4, h5, h6 {
                            color: ${color} !important;
                            text-shadow: 0px 0px 10px ${color} !important;
                        }
                        #log-filter[data-v-2d76ca92] .form-label[data-v-2d76ca92] {
                            color: ${color} !important;
                            text-shadow: 0px 0px 2px ${color} !important;
                        }
                        #log-filter-section[data-v-2d76ca92] {
                            border: 1px solid ${color} !important;
                        }
                        .navbar-dark .navbar-nav .nav-link {
                            color: ${color} !important;
                            text-shadow: 0px 0px 2px ${color} !important;
                        }
                        #log-table[data-v-2d76ca92]>:not(:last-child)>:last-child>*, .table>:not(:last-child)>:last-child>* {
                            color: ${color} !important;
                        border-bottom: 1px solid ${color} !important;
                    }
                    #log-table[data-v-2d76ca92] .first-row[data-v-2d76ca92] td[data-v-2d76ca92] {
                        color: ${color} !important;
                        text-shadow: 0px 0px 2px ${color} !important;
                    }
                    #log-table[data-v-2d76ca92]>:not(caption)>*>*, .table-borderless>:not(caption)>*>* {
                        border-bottom: 1px solid ${color} !important;
                }
                                                 #log-table[data-v-2d76ca92] .second-row[data-v-2d76ca92] td[data-v-2d76ca92] {
                    color: ${color} !important;
                    text-shadow: 0px 0px 2px ${color} !important;
                }
                .form-control {
                    color: ${color} !important;
                    border: 1px solid ${color} !important;
                }
                .form-control:focus {
                    box-shadow: 0px 0px 10px ${color} !important;
                }
                .multiselect.is-open.is-active {
                    box-shadow: 0px 0px 10px ${color} !important;
                }
                .input-group.has-validation>.dropdown-toggle:nth-last-child(n+4), .input-group.has-validation>:nth-last-child(n+3):not(.dropdown-toggle):not(.dropdown-menu), .input-group:not(.has-validation)>.dropdown-toggle:nth-last-child(n+3), .input-group:not(.has-validation)>:not(:last-child):not(.dropdown-toggle):not(.dropdown-menu) {
                    color: ${color} !important;
                    border: 1px solid ${color} !important;
                    background: ${darkColor80} !important;
                }
                .autoComplete_wrapper>input {
                    border: 1px solid ${color} !important;
                }
                .dp__input {
                    border: 1px solid ${color} !important;
                    color: ${color} !important;
                }
                .dp__calendar_header_item {
                    color: ${color} !important;
                }
                .dp__month_year_row {
                    color: ${color} !important;
                }
                .dp__overlay_cell_pad {
                    color: ${color} !important;;
                }
                body::-webkit-scrollbar-track {
                    background: ${darkColor80} !important;
                }
                body::-webkit-scrollbar-thumb {
                    background: linear-gradient(${darkColor80}, ${color}, ${darkColor80}) !important;
                }
                .style-button {
                    box-shadow: 0px 0px 10px ${darkColor20} !important;
                    border-color: ${darkColor20} !important;
                    color: ${darkColor20} !important;
                }
                .style-button:hover {
                    background: ${darkColor80} !important;
                    box-shadow: 0px 0px 10px ${color} !important;
                    border-color: ${color} !important;
                    color: ${color} !important;
                }
                .modal-content {
                    box-shadow: 0 0 10px ${color} !important;
                }
                .modal-header {
                    border: 1px solid ${color} !important;
                }
                .modal-body {
                    border: 1px solid ${color} !important;
                    color: ${color} !important;
                }
                .style-title-text {
                    color: ${color} !important;
                }
                .bg-success {
                    border: 1px solid ${color} !important;
                    box-shadow: 0px 0px 10px ${color} !important;
                    color: ${color} !important;
                }
                .bug-report-block {
                    border: 2px solid ${color} !important;
                    box-shadow: 0 0 5px ${color} !important;
                }
                .bug-report-button {
                    border: 2px solid ${color} !important;
                    box-shadow: 0 0 5px ${color} !important;
                }
                .bi-funnel {
                    color: ${color} !important;
                }
                .selector {
                    border: 1px solid ${color} !important;
                    box-shadow: 0 0 5px ${color} !important;
                    color: ${color} !important;
                    background: ${darkColor80} !important;
                }
                .selector:hover {
                    background: ${darkColor50} !important;
                }
                .selector option {
                    background: ${darkColor80} !important;
                }
                input[type=range]  {
                    box-shadow: 0px 0px 5px ${color} !important;
                }
                input[type=range]::-webkit-slider-runnable-track {
                    border: 2px solid ${color} !important;
                    background-color: ${darkColor80} !important;
                }
                input[type=range]::-webkit-slider-runnable-track:hover {
                    background-color: ${darkColor50} !important;
                }
                input[type=range]::-webkit-slider-thumb {
                    background: ${darkColor80} !important;
                }
                input[type=range]::-webkit-slider-thumb:hover {
                    background: ${darkColor50} !important;
                }
                input[type="color"] {
                    border: 2px solid ${color} !important;
                    box-shadow: 0px 0px 5px ${color} !important;
                }
                input[type="color"]:hover {
                    box-shadow: 0px 0px 10px 2px ${color} !important;
                }
                .show-filter-btn[data-v-2d76ca92] {
                    background: ${darkColor80} !important;
                }
                .navbar-brand {
                    color: ${darkColor20} !important;
                }
                .navbar-brand:hover {
                    color: ${color} !important;
                }
                .bi-arrow-bar-right {
                    color: ${color} !important;
                }
                #next-page-btn[data-v-2d76ca92], .btn-secondary, .close-btn, .icon-btn, .show-filter-btn {
                    border-color: ${color} !important;
                    color: ${color} !important;
                }
                #prev-page-btn[data-v-2d76ca92], .btn-outline-secondary {
                    border-color: ${color} !important;
                    color: ${color} !important;
                }
                .bi-sort-down::before {
                    color: ${color} !important;
                    text-shadow: 0px 0px 2px ${color} !important;
                }
                .slider {
                    background-color: ${darkColor20} !important;
                    box-shadow: 0 0 5px ${darkColor20} !important;
                    transition: all .4s ease;
                }
                .slider:hover{
                    background-color: ${darkColor50} !important;
                }
                .slider:before {
                    background-color: ${color} !important;
                }
                input:checked + .slider {
                    background-color: ${darkColor80} !important;
                }
                input:checked + .slider:hover {
                    background-color: ${darkColor50} !important;
                }
                ` ;
        document.head.appendChild(styleElement);

    }

    function applyTextGradient() {
        const textGradient = document.createElement('style');
        textGradient.id = 'text-gradient';
        textGradient.textContent = `
                /* Text Gradient Stylesheet */

                /* Gradient Keyframes (Animation) */
                    @keyframes gradientCategory {
                        0% {background-position: 0% 100%;}
                        100% {background-position: 1200% 100%;}
                    }

                /* Table Nickname & Category Gradient */
                .td-category[data-v-2d76ca92] a[data-v-2d76ca92] {
                    background: linear-gradient(45deg, #00ffff, #0045ff, #00ffff);
                    background-size: 150% 150%;
                    animation: gradientCategory 5s linear infinite;
                    color: transparent !important;
                    -webkit-background-clip: text;
                    font-style: italic;
                    font-weight: 700;
                    text-decoration: none;
                    text-shadow: 0px 0px 10px #08f;
                    padding-right: 3px;
                }
                .td-player-name[data-v-2d76ca92] a[data-v-2d76ca92] {
                    background: linear-gradient(45deg, #ffff00, #ff4400, #ffff00);
                    background-size: 150% 150%;
                    animation: gradientCategory 5s linear infinite;
                    color: transparent !important;
                    -webkit-background-clip: text;
                    font-style: italic;
                    font-weight: 700;
                    text-decoration: none;
                    text-shadow: 0px 0px 10px #f80;
                    padding-right: 3px;
                }

                /* "Black Logs" Gradient */
                .navbar-brand {
                    background: linear-gradient(45deg, #00ccff, #ff4400, #00ccff);
                    background-size: 150% 150%;
                    animation: gradientCategory 5s linear infinite;
                    color: transparent !important;
                    -webkit-background-clip: text;
                    font-style: italic;
                    font-weight: 700;
                    text-decoration: none;
                    text-shadow: 0px 0px 10px #888;
                    padding-right: 3px;
                }
                `;
        document.head.appendChild(textGradient);
    }

    function removeTextGradient() {
        var textGradient = document.querySelector('#text-gradient');
        document.head.removeChild(textGradient);
    }

    function applyMenuStyles() {

        const pseudoClasses = document.createElement('style');
        pseudoClasses.id = 'elements-pseudo-classes';
        pseudoClasses.textContent = `
                /* Style Menu Elements Stylesheet */

                /* Style Button CSS + Pseudo Classes */
                    .style-button {
                        color: #ffffff;
                        background: transparent;
                        border: 3px solid #ffffff;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px #ffffff;
                        width: 10%;
                        transition-duration: 0.5s;
                        white-space: nowrap;
                        min-width: 120px; /* Добавляем минимальную ширину для мобильных */
                    }
                .style-button:hover {
                    background: #222;
                    box-shadow: 0px 0px 10px #aaaaff;
                    border-color: #aaaaff;
                    color: #aaaaff;
                }

                /* Style Title Text CSS */
                .style-title-text {
                    font-size: 24px;
                    color: #fff;
                    font-weight: 600;
                }

                /* Switch CSS + Pseudo Classes */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 60px;
                    height: 34px;
                    padding-left: 20px;
                }
                .switch input { display: none; }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #aaaaaa;
                    box-shadow: 0 0 5px #aaaaaa;
                    transition: all .4s ease;
                }
                .slider:hover{
                    background-color: #666666;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 26px;
                    width: 26px;
                    left: 4px;
                    bottom: 4px;
                    background-color: #cccccc;
                    box-shadow: 0 0 5px #000000;
                    transition: all .4s ease;
                }
                input:checked + .slider {
                    background-color: #222222;
                }
                input:checked + .slider:hover {
                    background-color: #666666;
                }
                input:focus + .slider {
                    box-shadow: 0 0 5px #222222;
                    background-color: #444444;
                }
                input:checked + .slider:before {
                    transform: translateX(26px);
                }
                .slider.round {
                    border-radius: 34px;
                }
                .slider.round:before {
                    border-radius: 50%;
                }

                /* Tooltip CSS */
                .tooltip-style {
                    position: relative;
                    display: inline-block;
                    border-bottom: 1px dotted;
                }
                .tooltip-style .tooltip-style-text {
                    visibility: hidden;
                    background-color: #222222;
                    color: #fff;
                    text-align: center;
                    border-radius: 6px;
                    padding: 5px;
                    position: absolute;
                    z-index: 1;
                    width: 300px;
                    bottom: 100%;
                    left: 50%;
                    margin-left: -150px;
                    margin-bottom: 10px;
                    transition: opacity 0.3s;
                    opacity: 0;
                    font-size: 16px;
                }
                .tooltip-style:hover .tooltip-style-text {
                    visibility: visible;
                    opacity: 0.95;
                }

                /* Selector CSS + Pseudo Classes */
                .selector {
                    background: #222222;
                    border: 1px solid #cccccc;
                    border-radius: 20px;
                    box-shadow: 0 0 5px #cccccc;
                    color: #cccccc;
                    cursor: pointer;
                    font-size: 18px;
                    margin-right: 10px;
                    margin-top: 25px;
                    padding: 4px;
                    text-align: center;
                    width: 40%;
                    transition-duration: 0.5s;
                }
                .selector:hover {
                    background: #444444;
                    color: #ffffff;
                    box-shadow: 0 0 5px #ffffff;
                }
                .selector option{
                    background: #222222;
                }

                /* Slider CSS + Pseudo Classes */
                input[type=range]  {
                    width: 40%;
                    border-radius: 10px;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    box-shadow: 0px 0px 5px #cccccc;
                }
                input[type=range]::-webkit-slider-runnable-track {
                    border-radius: 10px;
                    height: 10px;
                    border: 2px solid #cccccc;
                    background-color: #222222;
                    transition-duration: 0.5s;
                }
                input[type=range]::-webkit-slider-runnable-track:hover {
                    border-radius: 10px;
                    height: 10px;
                    border: 2px solid #cccccc;
                    background-color: #444444;
                }
                input[type=range]::-webkit-slider-thumb {
                    background: #222222;
                    border: 1px solid #cccccc;
                    box-shadow: 0px 0px 2px #cccccc;
                    border-radius: 25px;
                    cursor: pointer;
                    width: 15px;
                    height: 30px;
                    -webkit-appearance: none;
                    margin-top: -10px;
                    transition-duration: 0.5s;
                }
                input[type=range]::-webkit-slider-thumb:hover {
                    background: #444444;
                    border: 1px solid #ffffff;
                    box-shadow: 0px 0px 2px #000000;
                    border-radius: 25px;
                    cursor: pointer;
                    width: 20px;
                    height: 40px;
                    -webkit-appearance: none;
                    margin-top: -15px;
                }
                input[type=range]::-moz-range-track {
                    border-radius: 10px/100%;
                    height: 5px;
                    border: 1px solid cyan;
                    background-color: #fff;
                }
                input[type=range]::-moz-range-thumb {
                    background: #ecf0f1;
                    border: 1px solid cyan;
                    border-radius: 10px/100%;
                    cursor: pointer;
                }

                /* Color Pickers CSS + Pseudo Classes */
                .color-picker {
                    margin-top: 25px;
                    margin-right: 10px;
                    width: 40%;
                    vertical-align: bottom;
                }
                input[type="color"]::-webkit-color-swatch-wrapper {
                    padding: 2px;
                }
                input[type="color"]::-webkit-color-swatch {
                    border: none;
                    border-radius: 20px;
                }
                input[type="color"] {
                    -webkit-appearance: none;
                    border: 2px solid #ffffff;
                    background: #000;
                    border-radius: 20px;
                    overflow: hidden;
                    outline: none;
                    cursor: pointer;
                    box-shadow: 0px 0px 5px #ffffff;
                    transition-duration: 0.5s;
                }
                input[type="color"]:hover {
                    -webkit-appearance: none;
                    border: 2px solid #ffffff;
                    background: #444444;
                    border-radius: 20px;
                    overflow: hidden;
                    outline: none;
                    cursor: pointer;
                    box-shadow: 0px 0px 10px 2px #ffffff;
                }

                /* Adding Text CSS */
                .addingText {
                    font-size: 20px;
                    font-style: italic;
                    font-weight: 800;
                    vertical-align: middle;
                }

                /* Bug Report CSS */
                .bug-report-block {
                    margin-top: 25px;
                    margin-bottom: 5px;
                    padding: 10px;
                    border: 2px solid #fff;
                    border-radius: 20px;
                    box-shadow: 0 0 5px #fff;
                }
                .bug-report-button {
                    width: 7%;
                    margin-right: 5%;
                    transition-duration: 0.5s;
                    border: 2px solid #fff;
                    border-radius: 50%;
                    box-shadow: 0 0 5px #fff;
                }
                .bug-report-button:hover {
                    filter: brightness(0.5);
                }
                `;
        document.head.appendChild(pseudoClasses);
    }

    function applySavedColors() {

        const savedNick = localStorage.getItem('playerNameColor');
        const savedCategory = localStorage.getItem('categoryColor');
        const savedColors = document.createElement('style');
        savedColors.id = 'stored-NickCategory-Colors';
        savedColors.textContent = `
                /* Saved Nickname & Category Stylesheet */

                /* Nickname */
                    .td-player-name[data-v-2d76ca92] a[data-v-2d76ca92] {
                        color: ${savedNick};
                        text-shadow: 0px 0px 1px ${savedNick};
                    }

                /* Category */
                .td-category[data-v-2d76ca92] a[data-v-2d76ca92] {
                    color: ${savedCategory};
                    text-shadow: 0px 0px 1px ${savedCategory};
                }
                `;
        document.head.appendChild(savedColors);

    }

    function applyBodyStyle() {

        const bodyStyle = document.createElement('style');
        bodyStyle.id = 'main-body-theme';
        bodyStyle.textContent = `
        /* Main Page Stylesheet */

        /* Page Heading */
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            color: #fff;
            text-shadow: 0px 0px 10px #fff;
        }

        .navbar-dark .navbar-brand,
        .navbar-dark .navbar-brand:focus,
        .navbar-dark .navbar-brand:hover {
            color: #fff;
            font-weight: 900;
            transition-duration: 0.5s;
        }

        .bg-success {
            background: #000 !important;
            border: 1px solid #fff;
            box-shadow: 0px 0px 10px #fff;
        }

        .badge {
            border-radius: 7px;
            color: #fff;
            font-weight: 500;
        }

        .navbar-dark .navbar-nav .nav-link {
            color: #fff;
            text-shadow: 0px 0px 10px #fff;
        }

        .bi-arrow-left::before {
            color: #fff;
        }

        .show-filter-btn[data-v-2d76ca92] {
            background: #333;
            border-bottom-left-radius: 10px;
        }

        .alert[data-v-0c0e47d2] {
            border-radius: 20px;
            box-shadow: 0 0 10px 2px #f00;
        }

        /* Page Body */
        .bg-dark {
            bs-bg-opacity: 0;
            background: #000 !important;
        }

        #game-logs-app {
            background: #000;
        }

        body {
            background-color: #000;
            background-size: 100%;
        }

        body::-webkit-scrollbar {
            width: 16px;
        }

        body::-webkit-scrollbar-track {
            background: #222;
        }

        body::-webkit-scrollbar-thumb {
            background: #fff;
        }

        .accessible-servers .page-intro {
            color: #0ff;
            text-align: center;
            text-shadow: 0px 0px 10px #fff;
        }

        .accessible-servers .game-logs-link {
            font-size: 1.5rem;
            text-shadow: 0px 0px 10px #f0f;
            transition-duration: 0.5s;
        }

        a {
            color: #faf;
            text-decoration: none;
        }

        a:hover {
            color: #f0f;
        }

        /* Page Footer */
        #next-page-btn[data-v-2d76ca92],
        .btn-secondary,
        .close-btn,
        .icon-btn,
        .show-filter-btn {
            background-color: #222;
            border-color: #fff;
            color: #fff;
        }

        #next-page-btn[data-v-2d76ca92]:hover,
        .btn-secondary:hover,
        .close-btn:hover,
        .icon-btn:hover,
        .show-filter-btn:hover {
            background-color: #444;
            border-color: #aaa;
            color: #fff;
        }

        #prev-page-btn[data-v-2d76ca92],
        .btn-outline-secondary {
            border-color: #fff;
            color: #fff;
        }

        #prev-page-btn[data-v-2d76ca92]:hover,
        .btn-outline-secondary:hover {
            background-color: #444;
            border-color: #aaa;
            color: #fff;
        }

        /* Logs Table - Main */
        #log-table[data-v-2d76ca92]>:not(:last-child)>:last-child>*,
        .table>:not(:last-child)>:last-child>* {
            border: 1px solid #111;
            border-bottom: 1px solid #fff;
            background: #111;
            color: #fff;
        }

        #log-table[data-v-2d76ca92] .first-row[data-v-2d76ca92] td[data-v-2d76ca92] {
            text-align: center;
            background: #111;
            color: #fff;
            text-shadow: 0px 0px 2px #fff;
        }

        #log-table[data-v-2d76ca92] .second-row[data-v-2d76ca92] td[data-v-2d76ca92] {
            padding: 0.5rem 0.5rem 0.5rem 1.5rem;
            background: #000;
            color: #fff;
            text-shadow: 0px 0px 2px #fff;
        }

        #log-table[data-v-2d76ca92]>:not(caption)>*>*,
        .table-borderless>:not(caption)>*>* {
            border: 1px solid rgba(0, 0, 0, 0);
            border-bottom: 1px solid #fff;
        }

        #log-table[data-v-2d76ca92] .first-row[data-v-2d76ca92] td[data-v-2d76ca92] {
            border: 1px solid rgba(0, 0, 0, 0);
            text-align: center;
        }

        /* Logs Table - Strokes */
        .td-category[data-v-2d76ca92] a[data-v-2d76ca92] {
            color: #08f;
            -webkit-background-clip: text;
            font-style: italic;
            font-weight: 700;
            text-decoration: none;
            text-shadow: 0px 0px 1px #08f;
            padding-right: 3px;
        }

        .td-player-name[data-v-2d76ca92] a[data-v-2d76ca92] {
            color: #f80;
            -webkit-background-clip: text;
            font-style: italic;
            font-weight: 700;
            text-decoration: none;
            text-shadow: 0px 0px 1px #f80;
            padding-right: 3px;
        }

        .td-index[data-v-2d76ca92] {
            background: linear-gradient(90deg, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 100%) !important;
            color: #fff;
        }

        .bi-sort-down::before {
            color: #f90;
            text-shadow: 0px 0px 2px #f90;
        }

        .bi-sort-up::before {
            color: #f90;
            text-shadow: 0px 0px 2px #f90;
        }

        /* Logs Filter - Main */
        #log-filter-section[data-v-2d76ca92] {
            background: #000;
            border: 1px solid #fff;
            border-radius: 25px;
            height: 1000px;
        }

        #log-filter[data-v-2d76ca92] .form-label[data-v-2d76ca92] {
            color: #fff;
            font-weight: 500;
        }

        #log-filter[data-v-2d76ca92] .close-btn[data-v-2d76ca92] {
            height: 41px;
            background: #000;
            border-bottom-left-radius: 10px;
            border: 1px solid #000;
        }

        .btn-primary,
        .submit-btn {
            background-color: #000;
            border: 3px solid #0af;
            border-radius: 10px;
            color: #0ff;
        }

        .btn-primary:hover,
        .submit-btn:hover {
            background-color: #033;
            border-color: #fff;
            color: #fff;
            transition: all .2s ease-in-out;
        }

        .btn-outline-danger {
            border: 3px solid #f00;
            color: #f00;
            border-radius: 10px;
        }

        .btn-outline-danger:hover {
            background-color: #900;
            border-color: #fff;
            color: #fff;
            transition: all .2s ease-in-out;
        }

        .bi-question-circle-fill::before {
            color: #666;
            text-shadow: 0px 0px 10px #000;
        }

        strong {
            color: #0ff;
        }

        /* Logs Filter - Strokes */
        .input-group.has-validation>.dropdown-toggle:nth-last-child(n+4),
        .input-group.has-validation>:nth-last-child(n+3):not(.dropdown-toggle):not(.dropdown-menu),
        .input-group:not(.has-validation)>.dropdown-toggle:nth-last-child(n+3),
        .input-group:not(.has-validation)>:not(:last-child):not(.dropdown-toggle):not(.dropdown-menu) {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
            background: #111;
            color: #fff;
            border: 1px solid #fff;
        }

        .input-group>:not(:first-child):not(.dropdown-menu):not(.valid-tooltip):not(.valid-feedback):not(.invalid-tooltip):not(.invalid-feedback):not(.field-error) {
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
            margin-left: -1px;
            background: #000;
            color: #fff;
        }

        .multiselect-search {
            background: #000;
            border: 0;
            bottom: 0;
            box-sizing: border-box;
            color: #fff;
            left: 0;
            outline: none;
            width: 100%;
        }

        .multiselect-option {
            align-items: center;
            box-sizing: border-box;
            cursor: pointer;
            background: #000;
            text-decoration: none;
        }

        .multiselect .multiselect-option.is-pointed {
            background-color: #222;
            color: #fff;
        }

        .multiselect .multiselect-option.is-pointed.is-selected {
            background-color: #666;
            color: #fff;
        }

        .multiselect .multiselect-option.is-selected {
            background-color: #444;
            color: #fff;
        }

        .multiselect-dropdown::-webkit-scrollbar {
            width: 12px;
        }

        .multiselect-dropdown::-webkit-scrollbar-track {
            background: #222;
            border-left: 1px solid #fff;
        }

        .multiselect-dropdown::-webkit-scrollbar-thumb {
            background-color: #fff;
            border-radius: 20px;
            border: 1px solid #222;
        }

        .multiselect.is-open.is-active {
            box-shadow: 0px 0px 10px #fff;
        }

        .dropdown-menu {
            background-color: #222;
        }

        .dropdown-menu show {
            position: absolute;
            inset: 0px auto auto 0px;
            margin: 0px;
            transform: translate(-1px, 40px);
            background: #333;
        }

        .dropdown-item:focus,
        .dropdown-item:hover {
            background-color: #444;
            color: #1e2125;
        }

        .autoComplete_wrapper>input {
            background-color: #000;
            background-origin: border-box;
            background-position: left 1.05rem top 0.8rem;
            background-repeat: no-repeat;
            background-size: 1.4rem;
            border: 1px solid #fff;
            border-radius: 4px;
            box-sizing: border-box;
            color: #f90;
            outline: none;
            transition: all .4s ease;
            width: 100%;
        }

        .autoComplete_wrapper>input:focus {
            border: 1px solid #f90;
            color: #f90;
        }

        .autoComplete_wrapper>input:hover {
            color: #a60;
            transition: all .3s ease;
        }

        .autoComplete_wrapper>ul>li {
            background-color: #000;
            color: #fff;
            transition: all .2s ease;
        }

        .autoComplete_wrapper>ul>li:hover,
        .autoComplete_wrapper>ul>li[aria-selected=true] {
            background-color: #222;
        }

        .autoComplete_wrapper>ul>li mark {
            background-color: transparent;
            color: #f90;
            font-weight: 700;
        }

        .autoComplete_wrapper>ul::-webkit-scrollbar {
            width: 12px;
        }

        .autoComplete_wrapper>ul::-webkit-scrollbar-track {
            background: #222;
            border-left: 1px solid #fff;
        }

        .autoComplete_wrapper>ul::-webkit-scrollbar-thumb {
            background-color: #fff;
            border-radius: 20px;
            border: 1px solid #222;
        }

        .form-control {
            background-color: #000;
            border: 1px solid #fff;
            color: #fff;
            font-weight: 400;
            transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            width: 100%;
        }

        .form-control:focus {
            background-color: #000;
            border-color: #fff;
            box-shadow: 0px 0px 10px #fff;
            color: #fff;
        }

        textarea.form-control {
            min-height: 100px;
            resize: none;
        }

        .lookup-symbol[data-v-2d76ca92] {
            color: #fff;
            font-weight: 500;
            text-shadow: 0px 0px 10px #fff;
        }

        .lookup-comment[data-v-2d76ca92] {
            color: #fff;
            font-weight: 400;
            text-shadow: 0px 0px 10px #fff;
        }

        .dp__input {
            background-color: #111;
            border: 1px solid #fff;
            border-radius: 5px;
            color: #fff;
            transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
            width: 100%;
        }

        .dp__input_icons {
            color: #0ff;
        }

        .dp__month_year_row {
            background: #111;
            color: #fff;
        }

        .dp__inner_nav svg {
            color: #0ff;
        }

        .dp__calendar_header,
        .dp__calendar_wrap {
            background: #111;
        }

        .dp__calendar_header_item {
            color: #fff;
        }

        .dp__cell_inner {
            color: #fff;
        }

        .dp__active_date,
        .dp__range_end,
        .dp__range_start {
            background: #666;
            color: #fff;
        }

        .dp__date_hover:hover,
        .dp__date_hover_end:hover,
        .dp__date_hover_start:hover {
            background: #444;
            color: #fff;
            transition: all .5s ease-in-out;
        }

        .dp__cell_disabled,
        .dp__cell_offset {
            color: #444;
        }

        .dp__button {
            background: #222;
        }

        .dp__button_bottom {
            background: #222;
            color: #0ff;
        }

        .dp__button:hover {
            background: #333;
            color: #077;
            transition: all .5s ease-in-out;
        }

        .dp__month_year_select:hover {
            background: #222;
            color: #fff;
            transition: all .5s ease-in-out;
        }

        .dp__overlay_cell,
        .dp__overlay_cell_active {
            background: #444;
        }

        .dp__overlay_container {
            background: #000;
        }

        .dp__overlay_cell_disabled,
        .dp__overlay_cell_disabled:hover {
            background: #111;
            color: #444;
        }

        .dp__time_display {
            color: #aaa;
        }

        .dp__time_display:hover {
            background: #111;
            color: #fff;
            transition: all .3s ease-in-out;
        }

        .dp__inc_dec_button:hover {
            background: #222;
            color: #0ff;
            transition: all .3s ease-in-out;
        }

        .dp__cell_in_between,
        .dp__overlay_cell:hover {
            background: #666;
            color: #fff;
            transition: all .3s ease-in-out;
        }

        .dp__overlay_cell_pad {
            padding: 10px 0;
            color: #999;
        }

        .dp__inner_nav:hover {
            background: #333;
            color: #fff;
            transition: all .3s ease-in-out;
        }

        .dp__today {
            border: 1px solid #fff;
        }

        #playerNameInput::placeholder {
            color: #a60;
        }

        /* Loading Overlay */
        #loading-overlay[data-v-173ec149] {
            height: 100%;
            width: 100%;
        }

        #loading-overlay-heading[data-v-173ec149] {
            font-weight: 500;
            letter-spacing: 1px;
            text-align: center;
            text-transform: uppercase;
            background: linear-gradient(90deg, #ffffff, #444444, #ffffff);
            background-size: 150% 150%;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent !important;
            filter: saturate(0);
            animation: textGradient 5s linear infinite;
            text-shadow: none !important;
        }

        #loading-overlay[data-v-173ec149] .spinner[data-v-173ec149] {
            border-width: 0.375rem;
            color: #fff;
            height: 4rem;
            width: 4rem;
        }

        #loading-overlay-container[data-v-173ec149] {
            background-color: #000;
            height: 100%;
            justify-content: center;
            width: 100%;
        }

        /* Modal Dialog */
        .modal [type=button],
        .modal [type=submit] {
            margin-left: 0.5rem;
            filter: invert(1);
        }

        .modal-header {
            background: #000;
            border: 1px solid #fff;
            align-items: center;
            border-bottom: 1px solid #dee2e6;
            border-top-left-radius: 25px;
            border-top-right-radius: 25px;
        }

        .modal-body {
            background: #000;
            border: 1px solid #fff;
            color: #fff;
            position: relative;
            border-bottom-left-radius: 25px;
            border-bottom-right-radius: 25px;
        }

        .modal-content {
            border-radius: 25px;
            box-shadow: 0 0 10px #fff;
        }

        .modal-open {
            padding-right: 0px !important;
        }

        .modal-backdrop {
            height: 100%;
            width: 100%;
        }

        .modal.fade.show {
            padding-right: 80px !important;
            padding-left: 80px !important;
        }

        .alert-danger,
        .alert-modal.failure .modal-content,
        .default-error-page .exception {
            background-color: #000;
            border: 5px solid #f11;
            border-radius: 50px;
            color: #fff;
        }

        .fade {
            transition: opacity .15s linear;
            backdrop-filter: blur(5px);
        }

        /* Media & Gradient */
        @keyframes textGradient {
            0% {
                background-position: 0% 50%;
            }

            100% {
                background-position: 1200% 50%;
            }
        }

        #placeholder-pic[data-v-9c1e68e2] {
            display: block;
            opacity: 0;
            margin: auto;
        }

        #placeholder-msg[data-v-9c1e68e2] {
            color: #0aa;
            text-align: center;
        }

        #content-placeholder[data-v-9c1e68e2] {
            background-image: url(https://snipboard.io/8kBudo.jpg);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }

        `;
        document.head.appendChild(bodyStyle);

    }

    function applyNewFonts() {
        const fontStyles = document.createElement('style');
        fontStyles.id = 'import-fonts';
        fontStyles.textContent = `
            /* Import Fonts Stylesheet */

            /* Imported Fonts:
--- Bad Script ---
--- Comfortaa ---
--- Fira Sans ---
--- Marmelad ---
--- Montserrat ---
--- Neucha ---
--- Play ---
--- Roboto ---
--- Sofia Sans ---
--- Ububntu --- */

            /* Powered by Google Fonts API */

                @import url('https://fonts.googleapis.com/css2?family=Bad+Script&family=Comfortaa&family=Fira+Sans&family=Marmelad&family=Montserrat&family=Neucha&family=Play&family=Roboto:ital@1&family=Sofia+Sans&family=Ubuntu&display=swap');

                /* Добавляем Inter и Font Awesome */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');`;
        document.head.appendChild(fontStyles);
    }

    function replaceTableHeading() {

        const titleElement = document.querySelector('div.container-fluid span.badge.bg-success');
        const tableHeading = document.querySelector('#log-table-heading');
        if (titleElement && tableHeading) {
            tableHeading.textContent += ' - ' + titleElement.textContent;
        };

    }

    function replaceSpinnerImage() {

        const spinnerElement = document.querySelector('div.spinner.spinner-border[data-v-173ec149=""]');
        if (spinnerElement) {
            const gifImageUrl = 'https://rb.ru/media/upload_tmp/2018/d1.gif';
            const gifImage = document.createElement('img');
            gifImage.id = 'replaced-loading-image';
            gifImage.src = gifImageUrl;
            gifImage.style.width = '160px';
            gifImage.style.height = '120px';
            gifImage.style.filter = 'saturate(0)';
            spinnerElement.replaceWith(gifImage);
        }

    }

    function addListenersAttributes() {

        const inputNameElement = document.querySelector('#playerNameInput');
        const transactionData = document.querySelector('#log-filter-form__transaction-desc');
        const playerIdElement = document.querySelector('#log-filter-form__player-id');
        const playerIpElement = document.querySelector('#log-filter-form__player-ip');
        const transactionAmountElement = document.querySelector('#log-filter-form__transaction-amount');
        const transactionAfterElement = document.querySelector('#log-filter-form__balance-after');
        const otherElement = document.querySelector('.btn.btn-primary');
        inputNameElement.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === 'Tab') {
                const otherElement = document.querySelector('.btn.btn-primary');
                otherElement.click();
            }
        });
        transactionData.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === 'Tab') {
                event.preventDefault();
                otherElement.click();
            };
        });
        playerIdElement.setAttribute('autocomplete', 'off');
        playerIpElement.setAttribute('autocomplete', 'off');
        transactionAmountElement.setAttribute('autocomplete', 'off');
        transactionAfterElement.setAttribute('autocomplete', 'off');

    }

    function setPageTitle() {

        const titleElement = document.querySelector('div.container-fluid span.badge.bg-success');
        document.title += ' - ' + titleElement.textContent;

    }

    // === ФУНКЦИИ TRADEID VIEWER ===

    function formatTime(iso) {
        const d = new Date(iso);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} | ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    }

    async function globalThrottle() {
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        if (timeSinceLastRequest < REQUEST_DELAY_MS) {
            const delay = REQUEST_DELAY_MS - timeSinceLastRequest;
            showGlobalWaitMessage(delay);
            await new Promise(resolve => setTimeout(resolve, delay));
            hideGlobalWaitMessage();
        }
        lastRequestTime = Date.now();
    }

    function showGlobalWaitMessage(delayMs) {
        Object.values(openModals).forEach(modal => {
            const contentArea = modal.querySelector('.trade-modal-content-resp');
            if (contentArea) {
                let waitMsg = contentArea.querySelector('.request-waiting-resp');
                if (!waitMsg) {
                    waitMsg = document.createElement('div');
                    waitMsg.className = 'request-waiting-resp';
                    contentArea.insertBefore(waitMsg, contentArea.firstChild);
                }
                waitMsg.textContent = `Ожидание ${Math.ceil(delayMs / 1000)}с перед запросом...`;
            }
        });
    }

    function hideGlobalWaitMessage() {
        Object.values(openModals).forEach(modal => {
            const waitMsg = modal.querySelector('.request-waiting-resp');
            if (waitMsg) waitMsg.remove();
        });
    }

    async function loadConnectData(nick, tradeTime) {
        await globalThrottle();
        return new Promise((resolve) => {
            const tradeDate = new Date(tradeTime);
            const startDate = new Date(tradeDate.getTime() - 24 * 60 * 60 * 1000).toISOString();
            const endDate = new Date(tradeDate.getTime() + 24 * 60 * 60 * 1000).toISOString();
            const url = `https://logs.blackrussia.online/gslogs/${SERVER_ID}/api/list-game-logs/?category_id__exact=38&player_name__exact=${encodeURIComponent(nick)}&time__gte=${startDate}&time__lte=${endDate}&order_by=time&offset=0&auto=false`;

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: (res) => {
                    try {
                        if (res.status !== 200) {
                            console.error(`[BR-Viewer] API Error: ${res.status} for ${url}`);
                            return resolve({ nick, appmdid: null, level: null, playerIp: null });
                        }
                        const data = JSON.parse(res.responseText);
                        if (!Array.isArray(data) || data.length === 0) {
                            return resolve({ nick, appmdid: null, level: null, playerIp: null });
                        }

                        let appmdid = null, level = null, playerIp = null;
                        let closestConnectTime = null, closestDisconnectTime = null;

                        for (const item of data) {
                            const itemTime = new Date(item.time).getTime();
                            if (/подключился/i.test(item.transaction_desc)) {
                                if (itemTime <= tradeDate.getTime() && (!closestConnectTime || itemTime > closestConnectTime)) {
                                    const m = item.transaction_desc.match(/APPMDID:\s*([A-Za-z0-9_-]+)/i);
                                    if (m) {
                                        appmdid = m[1];
                                        playerIp = item.player_ip;
                                        closestConnectTime = itemTime;
                                    }
                                }
                            }
                            if (/отключился/i.test(item.transaction_desc)) {
                                const timeDiff = Math.abs(itemTime - tradeDate.getTime());
                                if (!closestDisconnectTime || timeDiff < Math.abs(closestDisconnectTime - tradeDate.getTime())) {
                                    const m = item.transaction_desc.match(/Уровень:\s*(\d+)/i);
                                    if (m) {
                                        level = m[1];
                                        if (!playerIp) playerIp = item.player_ip;
                                        closestDisconnectTime = itemTime;
                                    }
                                }
                            }
                        }
                        resolve({ nick, appmdid, level, playerIp });
                    } catch (e) {
                        console.error("[BR-Viewer] Error parsing connection logs for " + nick, e);
                        resolve({ nick, appmdid: null, level: null, playerIp: null });
                    }
                },
                onerror: (err) => {
                    console.error("[BR-Viewer] Network error loading connection logs for " + nick, err);
                    resolve({ nick, appmdid: null, level: null, playerIp: null });
                }
            });
        });
    }

    function createConnectPanel(players, wrapper) {
        wrapper.querySelectorAll(".connect-panel-resp").forEach(el => el.remove());
        const panel = document.createElement("div");
        panel.className = "connect-panel-resp";
        let hasData = false;

        players.forEach(p => {
            if (p.appmdid) {
                hasData = true;
                const btnApp = document.createElement("button");
                btnApp.className = "connect-btn-resp";
                btnApp.textContent = `${p.nick} | APPMDID: ${p.appmdid}`;
                btnApp.onclick = () => {
                    navigator.clipboard.writeText(p.appmdid).then(() => {
                        const originalText = btnApp.textContent;
                        btnApp.textContent = `${p.nick} | Скопировано!`;
                        setTimeout(() => btnApp.textContent = originalText, 1500);
                    }).catch(err => console.error('[BR-Viewer] Could not copy APPMDID: ', err));
                };
                panel.appendChild(btnApp);
            }
            if (p.level) {
                hasData = true;
                const btnLvl = document.createElement("button");
                btnLvl.className = "connect-btn-resp empty";
                btnLvl.textContent = `${p.nick} | Уровень: ${p.level}`;
                panel.appendChild(btnLvl);
            }
            if (p.playerIp) {
                hasData = true;
                const btnIp = document.createElement("button");
                btnIp.className = "connect-btn-resp empty";
                btnIp.textContent = `${p.nick} | IP: ${p.playerIp}`;
                panel.appendChild(btnIp);
            }
        });

        if (!hasData) {
            panel.innerHTML = '<div class="loading-resp">Данные подключения не найдены.</div>';
        }

        const modal = wrapper.querySelector('.trade-modal-resp');
        const content = modal.querySelector('.trade-modal-content-resp');

        if (window.innerWidth < 800) {
            // На мобильном добавляем панель внутрь скролла логов
            content.appendChild(panel);
        } else {
            // На ПК добавляем панель рядом с модальным окном
            wrapper.appendChild(panel);
        }
    }

    function createModal(tradeID) {
        if (openModals[tradeID]) return;

        const overlay = document.createElement("div");
        overlay.className = "trade-modal-overlay-resp";

        const wrapper = document.createElement("div");
        wrapper.className = "trade-wrapper-resp";
        wrapper.dataset.tradeId = tradeID;

        const modal = document.createElement("div");
        modal.className = "trade-modal-resp";
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', `trade-modal-title-${tradeID}`);

        const header = document.createElement("div");
        header.className = "trade-modal-header-resp";

        const title = document.createElement("h3");
        title.className = "trade-modal-title-resp";
        title.id = `trade-modal-title-${tradeID}`;
        title.textContent = "Логи трейда #" + tradeID;

        const closeBtn = document.createElement("button");
        closeBtn.className = "trade-modal-close-resp";
        closeBtn.innerHTML = "&times;";
        closeBtn.setAttribute('aria-label', 'Закрыть окно');

        let handleEscKey;
        let handleClickOutside;

        const closeModal = () => {
            wrapper.classList.remove('visible');
            overlay.classList.remove('visible');
            setTimeout(() => {
                wrapper.remove();
                overlay.remove();
                delete openModals[tradeID];
                document.removeEventListener('keydown', handleEscKey);
                document.removeEventListener('mousedown', handleClickOutside);
            }, 300);
        };

        handleEscKey = (event) => {
            if (event.key === 'Escape' || event.keyCode === 27) closeModal();
        };

        handleClickOutside = (event) => {
            if (modal && !modal.contains(event.target)) {
                closeModal();
            }
        };

        closeBtn.onclick = closeModal;

        header.appendChild(title);
        header.appendChild(closeBtn);

        const content = document.createElement("div");
        content.className = "trade-modal-content-resp";
        content.innerHTML = '<div class="loading-resp">Загрузка логов...</div>';

        const footer = document.createElement("div");
        footer.className = "trade-modal-footer-resp";

        modal.appendChild(header);
        modal.appendChild(content);
        modal.appendChild(footer);
        wrapper.appendChild(modal);
        document.body.appendChild(overlay);
        document.body.appendChild(wrapper);
        openModals[tradeID] = wrapper;

        requestAnimationFrame(() => {
            overlay.classList.add('visible');
            wrapper.classList.add('visible');
        });

        (function makeDraggable(modalWrapper, headerElement) {
            let isDragging = false, initialX, initialY;
            const dragStart = (e) => {
                if (window.innerWidth < 800 || e.target === closeBtn) return;
                const rect = modalWrapper.getBoundingClientRect();
                initialX = e.clientX - rect.left;
                initialY = e.clientY - rect.top;
                isDragging = true;
                document.body.style.userSelect = 'none';
            };
            const drag = (e) => {
                if (isDragging) {
                    e.preventDefault();
                    modalWrapper.style.left = `${e.clientX - initialX}px`;
                    modalWrapper.style.top = `${e.clientY - initialY}px`;
                    modalWrapper.style.transform = 'none';
                }
            };
            const dragEnd = () => {
                isDragging = false;
                document.body.style.userSelect = '';
            };
            headerElement.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        })(wrapper, header);

        document.addEventListener('keydown', handleEscKey);
        document.addEventListener('mousedown', handleClickOutside);

        (async () => {
            await globalThrottle();
            const startDate = new Date(Date.now() - 5 * 30 * 24 * 60 * 1000).toISOString();
            const endDate = new Date().toISOString();
            const url = `https://logs.blackrussia.online/gslogs/${SERVER_ID}/api/list-game-logs/?transaction_desc__ilike=%25TradeID%3A+${tradeID}%25&time__gte=${startDate}&time__lte=${endDate}&order_by=time&offset=0&auto=false`;

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: (res) => {
                    try {
                        if (res.status !== 200) {
                            content.innerHTML = `<div class="error-resp">Ошибка загрузки: ${res.status}</div>`;
                            return;
                        }
                        const data = JSON.parse(res.responseText);
                        content.innerHTML = "";
                        if (!Array.isArray(data) || data.length === 0) {
                            content.innerHTML = '<div class="loading-resp">Логи трейда не найдены.</div>';
                            return;
                        }

                        const tradeTime = data[0].time;
                        data.forEach(item => {
                            const row = document.createElement("div");
                            row.className = "trade-row-resp";
                            row.innerHTML = `
                                <div class="trade-player-info">
                                    <span class="trade-player-resp">${item.player_name}</span>
                                    <span class="trade-time-resp">${formatTime(item.time)}</span>
                                </div>
                                <div class="trade-desc-resp">${item.transaction_desc}</div>
                            `;
                            content.appendChild(row);
                        });

                        const uniquePlayers = [...new Set(data.map(i => i.player_name))].slice(0, 2);
                        if (uniquePlayers.length === 2) {
                            footer.innerHTML = `<span style="color:var(--text-secondary); font-size:12px; font-style:italic;">Кнопка загрузки данных появится через ${SHOW_CONNECT_BTN_DELAY_MS / 1000} сек...</span>`;
                            setTimeout(() => {
                                footer.innerHTML = '';
                                const connectBtn = document.createElement("button");
                                connectBtn.className = "both-nicks-btn-resp";
                                connectBtn.textContent = `Загрузить данные игроков`;
                                footer.appendChild(connectBtn);

                                connectBtn.onclick = async () => {
                                    connectBtn.disabled = true;
                                    connectBtn.textContent = "Загрузка...";
                                    try {
                                        const results = await Promise.allSettled([
                                            loadConnectData(uniquePlayers[0], tradeTime),
                                            loadConnectData(uniquePlayers[1], tradeTime)
                                        ]);
                                        const playerData = results.map(r => r.status === 'fulfilled' ? r.value : null).filter(Boolean);
                                        createConnectPanel(playerData, wrapper);
                                        connectBtn.remove();
                                    } catch (error) {
                                        console.error('[BR-Viewer] Error loading connection data:', error);
                                        connectBtn.textContent = "Ошибка загрузки";
                                        setTimeout(() => {
                                            connectBtn.disabled = false;
                                            connectBtn.textContent = `Повторить загрузку`;
                                        }, 3000);
                                    }
                                };
                            }, SHOW_CONNECT_BTN_DELAY_MS);
                        } else {
                            footer.innerHTML = `<span style="color:#777; font-size:12px;">Участники трейда не определены (${uniquePlayers.length} найдено).</span>`;
                        }
                    } catch (e) {
                        content.innerHTML = '<div class="error-resp">Ошибка обработки данных.</div>';
                        console.error("[BR-Viewer] Error processing trade data #" + tradeID, e);
                    }
                },
                onerror: (err) => {
                    content.innerHTML = '<div class="error-resp">Ошибка соединения.</div>';
                    console.error("[BR-Viewer] Network error loading trade logs #" + tradeID, err);
                }
            });
        })();
    }

    function createVehicleExchangeModal(transactionDesc, playerName, transactionAmount, transactionDate) {
        const modalId = 'vehicle-exchange-modal-' + Date.now();
        if (openModals[modalId]) return;

        // Парсим данные из описания транзакции
        let fromPlayer = '', toPlayer = '', fromVehicle = '', toVehicle = '', payment = '';

        if (transactionDesc.includes('+ Доплата за обмен от')) {
            const match = transactionDesc.match(/\+ Доплата за обмен от (.+?) \[.*?\] \(Авто (.+?) \(.*?\) на Авто (.+?) \(/);
            if (match) {
                fromPlayer = match[1];
                fromVehicle = match[2];
                toVehicle = match[3];
                payment = `+${transactionAmount}`;
            }
        } else if (transactionDesc.includes('- Доплата за обмен игроку')) {
            const match = transactionDesc.match(/- Доплата за обмен игроку (.+?) \[.*?\] \(Авто (.+?) \(.*?\) на Авто (.+?) \(/);
            if (match) {
                toPlayer = match[1];
                fromVehicle = match[2];
                toVehicle = match[3];
                payment = `-${transactionAmount}`;
            }
        } else if (transactionDesc.includes('Обменялся с')) {
            const match = transactionDesc.match(/Обменялся с (.+?) \[.*?\] \(Авто (.+?) \(.*?\) на Авто (.+?) \(/);
            if (match) {
                fromPlayer = match[1];
                fromVehicle = match[2];
                toVehicle = match[3];
                payment = 'Без доплаты';
            }
        }

        const overlay = document.createElement("div");
        overlay.className = "trade-modal-overlay-resp";

        const wrapper = document.createElement("div");
        wrapper.className = "trade-wrapper-resp";
        wrapper.dataset.modalId = modalId;

        const modal = document.createElement("div");
        modal.className = "trade-modal-resp";
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', `vehicle-exchange-title-${modalId}`);

        const header = document.createElement("div");
        header.className = "trade-modal-header-resp";

        const title = document.createElement("h3");
        title.className = "trade-modal-title-resp";
        title.id = `vehicle-exchange-title-${modalId}`;
        title.textContent = "Детали обмена транспорта";

        const closeBtn = document.createElement("button");
        closeBtn.className = "trade-modal-close-resp";
        closeBtn.innerHTML = "&times;";
        closeBtn.setAttribute('aria-label', 'Закрыть окно');

        let handleEscKey;
        let handleClickOutside;

        const closeModal = () => {
            wrapper.classList.remove('visible');
            overlay.classList.remove('visible');
            setTimeout(() => {
                wrapper.remove();
                overlay.remove();
                delete openModals[modalId];
                document.removeEventListener('keydown', handleEscKey);
                document.removeEventListener('mousedown', handleClickOutside);
            }, 300);
        };

        handleEscKey = (event) => {
            if (event.key === 'Escape' || event.keyCode === 27) closeModal();
        };

        handleClickOutside = (event) => {
            if (modal && !modal.contains(event.target)) {
                closeModal();
            }
        };

        closeBtn.onclick = closeModal;

        header.appendChild(title);
        header.appendChild(closeBtn);

        const content = document.createElement("div");
        content.className = "trade-modal-content-resp";

        // Создаем таблицу с деталями обмена
        content.innerHTML = `
            <div class="exchange-table-container">
                <table class="exchange-table">
                    <thead>
                        <tr>
                            <th>Ник</th>
                            <th>Машина до обмена</th>
                            <th>Машина после обмена</th>
                            <th>Доплата</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${playerName}</td>
                            <td>${fromVehicle}</td>
                            <td>${toVehicle}</td>
                            <td class="${payment.startsWith('+') ? 'positive-resp' : payment.startsWith('-') ? 'negative-resp' : ''}">${payment}</td>
                        </tr>
                        ${fromPlayer ? `
                        <tr>
                            <td>${fromPlayer}</td>
                            <td>${toVehicle}</td>
                            <td>${fromVehicle}</td>
                            <td class="${payment.startsWith('+') ? 'negative-resp' : payment.startsWith('-') ? 'positive-resp' : ''}">${payment.startsWith('+') ? '-' + payment.substring(1) : payment.startsWith('-') ? '+' + payment.substring(1) : payment}</td>
                        </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        `;

        const footer = document.createElement("div");
        footer.className = "trade-modal-footer-resp";

        modal.appendChild(header);
        modal.appendChild(content);
        modal.appendChild(footer);
        wrapper.appendChild(modal);
        document.body.appendChild(overlay);
        document.body.appendChild(wrapper);
        openModals[modalId] = wrapper;

        requestAnimationFrame(() => {
            overlay.classList.add('visible');
            wrapper.classList.add('visible');
        });

        // Добавляем кнопку загрузки данных игроков для обмена авто
        const uniquePlayers = [playerName];
        if (fromPlayer) uniquePlayers.push(fromPlayer);
        if (toPlayer) uniquePlayers.push(toPlayer);

        const uniquePlayerNames = [...new Set(uniquePlayers)].slice(0, 2);

        if (uniquePlayerNames.length >= 1) {
            footer.innerHTML = `<span style="color:var(--text-secondary); font-size:12px; font-style:italic;">Кнопка загрузки данных появится через ${SHOW_CONNECT_BTN_DELAY_MS / 1000} сек...</span>`;
            setTimeout(() => {
                footer.innerHTML = '';
                const connectBtn = document.createElement("button");
                connectBtn.className = "both-nicks-btn-resp";
                connectBtn.textContent = `Загрузить данные игроков`;
                footer.appendChild(connectBtn);

                connectBtn.onclick = async () => {
                    connectBtn.disabled = true;
                    connectBtn.textContent = "Загрузка...";
                    try {
                        const results = await Promise.allSettled(
                            uniquePlayerNames.map(nick => loadConnectData(nick, new Date(transactionDate)))
                        );
                        const playerData = results.map(r => r.status === 'fulfilled' ? r.value : null).filter(Boolean);
                        createConnectPanel(playerData, wrapper);
                        connectBtn.remove();
                    } catch (error) {
                        console.error('[BR-Viewer] Error loading connection data:', error);
                        connectBtn.textContent = "Ошибка загрузки";
                        setTimeout(() => {
                            connectBtn.disabled = false;
                            connectBtn.textContent = `Повторить загрузку`;
                        }, 3000);
                    }
                };
            }, SHOW_CONNECT_BTN_DELAY_MS);
        }

        (function makeDraggable(modalWrapper, headerElement) {
            let isDragging = false, initialX, initialY;
            const dragStart = (e) => {
                if (window.innerWidth < 800 || e.target === closeBtn) return;
                const rect = modalWrapper.getBoundingClientRect();
                initialX = e.clientX - rect.left;
                initialY = e.clientY - rect.top;
                isDragging = true;
                document.body.style.userSelect = 'none';
            };
            const drag = (e) => {
                if (isDragging) {
                    e.preventDefault();
                    modalWrapper.style.left = `${e.clientX - initialX}px`;
                    modalWrapper.style.top = `${e.clientY - initialY}px`;
                    modalWrapper.style.transform = 'none';
                }
            };
            const dragEnd = () => {
                isDragging = false;
                document.body.style.userSelect = '';
            };
            headerElement.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        })(wrapper, header);

        document.addEventListener('keydown', handleEscKey);
        document.addEventListener('mousedown', handleClickOutside);
    }

    function attachTradeButtons() {
        const tradeRegex = /TradeID:\s*(\d+)/g;
        document.querySelectorAll('td:not([class*="-resp"])').forEach(td => {
            if (td.innerHTML.includes('TradeID:') && !td.querySelector('.details-btn-resp')) {
                const uniqueIds = [...new Set(Array.from(td.innerHTML.matchAll(tradeRegex), m => m[1]))];
                uniqueIds.forEach(tradeID => {
                    if (!td.querySelector(`.details-btn-resp[data-trade='${tradeID}']`)) {
                        const btn = document.createElement('button');
                        btn.className = 'details-btn-resp trade';
                        btn.dataset.trade = tradeID;
                        btn.textContent = `Детали`;
                        btn.style.marginLeft = '10px';
                        btn.onclick = (e) => { e.stopPropagation(); createModal(tradeID); };
                        td.appendChild(btn);
                    }
                });
            }
        });
    }

    function attachVehicleExchangeButtons() {
        document.querySelectorAll('tr.second-row').forEach(row => {
            const transactionCell = row.querySelector('.td-transaction-desc');
            const categoryCell = row.previousSibling?.querySelector('.td-category a');
            const playerName = row.previousSibling?.querySelector('.td-player-name a')?.textContent;
            const transactionAmount = row.previousSibling?.querySelector('.td-transaction-amount')?.textContent;
            const transactionDate = row.previousSibling?.querySelector('.td-time')?.textContent.replace(/\s/g, ' | ');

            if (categoryCell?.textContent === 'Личное транспортное средство' && transactionCell) {
                const transactionDesc = transactionCell.textContent;

                // Проверяем, содержит ли описание обмен автомобилями
                if ((transactionDesc.includes('+ Доплата за обмен от') ||
                     transactionDesc.includes('- Доплата за обмен игроку') ||
                     transactionDesc.includes('Обменялся с')) &&
                    transactionDesc.includes('Авто') &&
                    transactionDesc.includes('на Авто') &&
                    !transactionCell.querySelector('.details-btn-resp.vehicle')) {

                    const btn = document.createElement('button');
                    btn.className = 'details-btn-resp vehicle';
                    btn.textContent = 'Детали';
                    btn.style.marginLeft = '10px';
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        createVehicleExchangeModal(transactionDesc, playerName, transactionAmount, transactionDate);
                    };
                    transactionCell.appendChild(btn);
                }
            }
        });
    }

    function attachIPInfoButtons() {
        document.querySelectorAll('td.td-player-ip[data-v-2d76ca92]').forEach(td => {
            const ip = td.textContent.trim();
            if (ip && ip !== 'N/A' && !td.querySelector('.ip-info-btn-resp')) {
                const btn = document.createElement('button');
                btn.className = 'ip-info-btn-resp';
                btn.textContent = 'ℹ️';
                btn.title = 'Информация об IP';
                btn.style.marginLeft = '5px';
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    await showIPInfo(ip);
                };
                td.appendChild(btn);
            }
        });
    }

    async function showIPInfo(ip) {
        const modalId = 'ip-info-modal-' + Date.now();
        if (openModals[modalId]) return;

        const overlay = document.createElement("div");
        overlay.className = "trade-modal-overlay-resp";

        const wrapper = document.createElement("div");
        wrapper.className = "trade-wrapper-resp";
        wrapper.dataset.modalId = modalId;

        const modal = document.createElement("div");
        modal.className = "trade-modal-resp";
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', `ip-info-title-${modalId}`);

        const header = document.createElement("div");
        header.className = "trade-modal-header-resp";

        const title = document.createElement("h3");
        title.className = "trade-modal-title-resp";
        title.id = `ip-info-title-${modalId}`;
        title.textContent = `Информация об IP: ${ip}`;

        const closeBtn = document.createElement("button");
        closeBtn.className = "trade-modal-close-resp";
        closeBtn.innerHTML = "&times;";
        closeBtn.setAttribute('aria-label', 'Закрыть окно');

        let handleEscKey;
        let handleClickOutside;

        const closeModal = () => {
            wrapper.classList.remove('visible');
            overlay.classList.remove('visible');
            setTimeout(() => {
                wrapper.remove();
                overlay.remove();
                delete openModals[modalId];
                document.removeEventListener('keydown', handleEscKey);
                document.removeEventListener('mousedown', handleClickOutside);
            }, 300);
        };

        handleEscKey = (event) => {
            if (event.key === 'Escape' || event.keyCode === 27) closeModal();
        };

        handleClickOutside = (event) => {
            if (modal && !modal.contains(event.target)) {
                closeModal();
            }
        };

        closeBtn.onclick = closeModal;

        header.appendChild(title);
        header.appendChild(closeBtn);

        const content = document.createElement("div");
        content.className = "trade-modal-content-resp";
        content.innerHTML = '<div class="loading-resp">Загрузка информации об IP...</div>';

        const footer = document.createElement("div");
        footer.className = "trade-modal-footer-resp";

        modal.appendChild(header);
        modal.appendChild(content);
        modal.appendChild(footer);
        wrapper.appendChild(modal);
        document.body.appendChild(overlay);
        document.body.appendChild(wrapper);
        openModals[modalId] = wrapper;

        requestAnimationFrame(() => {
            overlay.classList.add('visible');
            wrapper.classList.add('visible');
        });

        (function makeDraggable(modalWrapper, headerElement) {
            let isDragging = false, initialX, initialY;
            const dragStart = (e) => {
                if (window.innerWidth < 800 || e.target === closeBtn) return;
                const rect = modalWrapper.getBoundingClientRect();
                initialX = e.clientX - rect.left;
                initialY = e.clientY - rect.top;
                isDragging = true;
                document.body.style.userSelect = 'none';
            };
            const drag = (e) => {
                if (isDragging) {
                    e.preventDefault();
                    modalWrapper.style.left = `${e.clientX - initialX}px`;
                    modalWrapper.style.top = `${e.clientY - initialY}px`;
                    modalWrapper.style.transform = 'none';
                }
            };
            const dragEnd = () => {
                isDragging = false;
                document.body.style.userSelect = '';
            };
            headerElement.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        })(wrapper, header);

        document.addEventListener('keydown', handleEscKey);
        document.addEventListener('mousedown', handleClickOutside);

        // Загружаем информацию об IP
        try {
            const ipInfo = await getIPInfo(ip);

            // Проверяем, есть ли реальные данные
            const hasRealData = ipInfo.country &&
                               ipInfo.country !== 'Неизвестно' &&
                               ipInfo.country !== 'Не удалось определить' &&
                               ipInfo.country !== 'Undefined' &&
                               ipInfo.country !== '';

            if (hasRealData) {
                content.innerHTML = `
                    <div class="ip-info-details-resp">
                        <div class="info-row-resp"><strong><i class="fas fa-desktop"></i> IP адрес:</strong> ${ipInfo.ip}</div>
                        <div class="info-row-resp"><strong><i class="fas fa-flag"></i> Страна:</strong> ${ipInfo.country}</div>
                        <div class="info-row-resp"><strong><i class="fas fa-city"></i> Город:</strong> ${ipInfo.city || 'Неизвестно'}</div>
                        <div class="info-row-resp"><strong><i class="fas fa-map"></i> Регион:</strong> ${ipInfo.region || 'Неизвестно'}</div>
                        <div class="info-row-resp"><strong><i class="fas fa-clock"></i> Временная зона:</strong> ${ipInfo.timezone || 'Неизвестно'}</div>
                        <div class="info-row-resp"><strong><i class="fas fa-building"></i> Организация:</strong> ${ipInfo.org || 'Неизвестно'}</div>
                        <div class="info-row-resp"><strong><i class="fas fa-network-wired"></i> ASN:</strong> ${ipInfo.asn || 'Неизвестно'}</div>
                        <div class="info-row-resp"><strong><i class="fas fa-map-marker-alt"></i> Координаты:</strong> ${ipInfo.latitude ? ipInfo.latitude + ', ' + ipInfo.longitude : 'Неизвестно'}</div>
                        ${ipInfo.note ? `<div class="info-row-resp note"><strong><i class="fas fa-info-circle"></i> Примечание:</strong> ${ipInfo.note}</div>` : ''}
                    </div>
                `;
            } else {
                content.innerHTML = `
                    <div class="error-resp">
                        <p><strong><i class="fas fa-exclamation-triangle"></i> Не удалось получить информацию об IP адресе ${ip}</strong></p>
                        <p>Возможные причины:</p>
                        <ul style="text-align: left; margin-left: 20px;">
                            <li><i class="fas fa-network-wired"></i> IP адрес принадлежит частной сети</li>
                            <li><i class="fas fa-server"></i> Сервисы геолокации временно недоступны</li>
                            <li><i class="fas fa-shield-alt"></i> IP адрес зарезервирован или не существует</li>
                            <li><i class="fas fa-wifi"></i> Проблемы с подключением к интернету</li>
                        </ul>
                        <p style="margin-top: 15px;"><i class="fas fa-sync-alt"></i> Попробуйте проверить другой IP адрес или повторить попытку позже.</p>
                    </div>
                `;
            }
        } catch (error) {
            content.innerHTML = `
                <div class="error-resp">
                    <p><strong><i class="fas fa-exclamation-circle"></i> Ошибка при получении информации об IP:</strong></p>
                    <p>${error.message}</p>
                    <p style="margin-top: 15px;"><i class="fas fa-sync-alt"></i> Попробуйте проверить другой IP адрес.</p>
                </div>
            `;
        }
    }

    // === СТИЛИ TRADEID VIEWER ===
    GM_addStyle(`
        :root {
            --bg-main: rgba(26, 26, 26, 0.7);
            --bg-panel: rgba(30, 39, 46, 0.7);
            --text-primary: #ffffff;
            --text-secondary: #cccccc;
            --text-highlight: #2b8cff;
            --primary-gradient: linear-gradient(145deg, #2b8cff, #1f6cd9);
            --secondary-gradient: linear-gradient(145deg, #8e2de2, #4a00e0);
            --danger-color: #ff4757;
            --warning-color: #ffd700;
            --border-color: rgba(255, 255, 255, 0.1);
            --shadow: 0 10px 35px rgba(0,0,0,.5);
            --radius: 12px;
            --font-family: 'Inter', 'Segoe UI', sans-serif;
            --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .details-btn-resp {
            background: transparent;
            color: #fff;
            border: 1px solid #fff;
            padding: 4px 8px;
            margin: 2px;
            margin-left: 10px;
            font-size: 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: var(--font-family);
        }
        .details-btn-resp:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #aaa;
        }
        .details-btn-resp.vehicle {
            background: transparent;
            border: 1px solid #fff;
        }
        .details-btn-resp.vehicle:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #aaa;
        }

        .ip-info-btn-resp {
            background: transparent;
            color: #fff;
            border: 1px solid #fff;
            padding: 4px 8px;
            margin: 2px;
            margin-left: 5px;
            font-size: 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: var(--font-family);
        }
        .ip-info-btn-resp:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #aaa;
        }

        .trade-modal-overlay-resp {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.6);
            z-index: 9999;
            backdrop-filter: blur(4px);
            opacity: 0;
            transition: opacity var(--transition);
        }
        .trade-modal-overlay-resp.visible { opacity: 1; }

        /* --- МОБИЛЬНЫЙ ВИД: ЦЕНТРИРОВАННОЕ ОКНО (Mobile-First) --- */
        .trade-wrapper-resp {
            position: fixed;
            z-index: 10000;
            inset: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 16px;
        }

        .trade-modal-resp {
            background: var(--bg-main);
            color: var(--text-primary);
            box-shadow: var(--shadow);
            width: 95%;
            max-width: 600px;
            height: auto;
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            font-family: var(--font-family);
            border: 1px solid var(--border-color);
            backdrop-filter: blur(15px);
            border-radius: var(--radius);
            opacity: 0;
            transform: scale(0.95);
            transition: opacity var(--transition), transform var(--transition), height var(--transition);
        }
        .trade-wrapper-resp.visible .trade-modal-resp {
            opacity: 1;
            transform: scale(1);
        }

        .trade-modal-header-resp {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--border-color);
            flex-shrink: 0;
        }
        .trade-modal-header-resp::before { display: none !important; }

        .trade-modal-title-resp {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-highlight);
            margin: 0;
            flex-grow: 1;
        }
        .trade-modal-close-resp {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-size: 28px;
            line-height: 1;
            padding: 0 8px;
            cursor: pointer;
            transition: color var(--transition), transform var(--transition);
        }

        .trade-modal-content-resp {
            overflow-y: auto;
            flex-grow: 1;
            padding: 8px 16px;
        }

        /* Мобильный карточный вид логов */
        .trade-row-resp {
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .trade-player-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .trade-player-resp { font-weight: 600; color: var(--text-primary); }
        .trade-time-resp { font-size: 12px; color: var(--text-secondary); }
        .trade-desc-resp {
            font-size: 14px;
            color: var(--text-primary);
            line-height: 1.5;
            word-break: break-word;
            white-space: pre-wrap;
        }

        .trade-modal-footer-resp {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 12px 16px;
            padding-bottom: calc(12px + env(safe-area-inset-bottom));
            border-top: 1px solid var(--border-color);
            flex-shrink: 0;
            background: rgba(26, 26, 26, 0.8);
        }
        .both-nicks-btn-resp {
            background: transparent;
            color: #fff;
            border: 1px solid #fff;
            padding: 8px 16px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 14px;
            width: 100%;
            font-family: var(--font-family);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .both-nicks-btn-resp:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #aaa;
        }

        .connect-panel-resp {
            background: var(--bg-panel);
            padding: 16px;
            border-radius: var(--radius);
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 16px 0;
            border: 1px solid var(--border-color);
            backdrop-filter: blur(15px);
        }
        .connect-btn-resp {
            background: transparent;
            color: var(--text-primary);
            border: 1px solid #fff;
            padding: 8px 12px;
            border-radius: 4px;
            font-weight: 500;
            text-align: left;
            font-size: 13px;
            font-family: var(--font-family);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .connect-btn-resp:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #aaa;
        }
        .connect-btn-resp.empty { 
            background: transparent; 
            cursor: default; 
        }
        .connect-btn-resp.empty:hover {
            background: transparent;
            border-color: #fff;
        }

        /* Стили для таблицы обмена транспорта */
        .exchange-table-container {
            overflow-x: auto;
            margin: 16px 0;
        }
        .exchange-table {
            width: 100%;
            border-collapse: collapse;
            font-family: var(--font-family);
            font-size: 14px;
        }
        .exchange-table th,
        .exchange-table td {
            padding: 8px 12px;
            text-align: left;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .exchange-table th {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-highlight);
            font-weight: 600;
        }
        .exchange-table td {
            background: rgba(255, 255, 255, 0.02);
        }
        .positive-resp {
            color: #00ff00;
            font-weight: 600;
        }
        .negative-resp {
            color: #ff4757;
            font-weight: 600;
        }

        /* Стили для информации об IP */
        .ip-info-details-resp {
            padding: 16px 0;
        }
        .info-row-resp {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .info-row-resp:last-child {
            border-bottom: none;
        }
        .info-row-resp i {
            width: 16px;
            margin-right: 8px;
            text-align: center;
        }

        /* Стили для проверки IP */
        .ip-check-form {
            margin-bottom: 20px;
        }
        .ip-input-group {
            margin-bottom: 15px;
        }
        .ip-input-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: var(--text-primary);
            font-family: var(--font-family);
        }
        .ip-results-container {
            margin-top: 20px;
        }
        .ip-results-grid {
            display: grid;
            gap: 20px;
            grid-template-columns: 1fr;
        }
        .ip-result-card {
            background: var(--bg-panel);
            padding: 16px;
            border-radius: var(--radius);
            border: 1px solid var(--border-color);
            font-family: var(--font-family);
        }
        .ip-result-card h4 {
            margin: 0 0 12px 0;
            color: var(--text-highlight);
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .ip-info {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 0;
        }
        .info-row i {
            width: 16px;
            margin-right: 8px;
            text-align: center;
        }
        .info-row.note {
            color: var(--warning-color);
            font-style: italic;
        }
        .distance-info {
            background: var(--bg-panel);
            padding: 16px;
            border-radius: var(--radius);
            border: 1px solid var(--border-color);
            text-align: center;
            font-family: var(--font-family);
        }
        .distance-value {
            font-size: 24px;
            font-weight: bold;
            color: #ffd700;
            margin-top: 10px;
        }
        .distance-note {
            font-size: 12px;
            color: var(--text-secondary);
            margin-top: 5px;
            font-style: italic;
        }

        /* Стили для карты */
        #ip-map-container {
            font-family: var(--font-family);
        }

        /* Сообщения о загрузке и ошибках */
        .loading-resp, .error-resp, .request-waiting-resp {
            padding: 16px;
            text-align: center;
            border-radius: var(--radius);
            margin: 10px 0;
            font-family: var(--font-family);
        }
        .loading-resp {
            background: rgba(43, 140, 255, 0.1);
            color: var(--text-highlight);
            border: 1px solid rgba(43, 140, 255, 0.3);
        }
        .error-resp {
            background: rgba(255, 71, 87, 0.1);
            color: var(--danger-color);
            border: 1px solid rgba(255, 71, 87, 0.3);
        }
        .request-waiting-resp {
            background: rgba(255, 215, 0, 0.1);
            color: var(--warning-color);
            border: 1px solid rgba(255, 215, 0, 0.3);
        }

        /* --- ДЕСКТОПНЫЙ ВИД (для экранов шире 800px) --- */
        @media (min-width: 800px) {
            .trade-wrapper-resp {
                flex-direction: row;
                align-items: center;
                padding: 32px;
            }
            .trade-modal-resp {
                max-width: 800px;
                width: 100%;
                height: auto;
                min-height: 150px;
                max-height: 85vh;
            }
            .trade-modal-header-resp { cursor: move; padding: 16px 24px; }
            .trade-modal-content-resp { padding: 8px 24px; }
            .trade-modal-footer-resp { padding: 16px 24px; padding-bottom: 16px; }
            .both-nicks-btn-resp { width: auto; }

            /* Табличный вид логов на ПК */
            .trade-row-resp {
                display: grid;
                grid-template-columns: 150px 180px 1fr;
                gap: 16px;
            }
            .trade-player-info { display: contents; }
            .trade-player-resp { margin-bottom: 0; }
            .trade-desc-resp { font-size: 13px; }

            /* Панель подключения сбоку на ПК */
            .connect-panel-resp {
                width: 340px;
                flex-shrink: 0;
                margin: 0;
                height: auto;
                max-height: 85vh;
                overflow-y: auto;
            }

            /* Результаты проверки IP на ПК */
            .ip-results-grid {
                grid-template-columns: 1fr 1fr;
            }
            .distance-info {
                grid-column: 1 / -1;
            }
        }

        /* Стили для iOS Safari */
        @supports (-webkit-touch-callout: none) {
            .details-btn-resp,
            .ip-info-btn-resp,
            .both-nicks-btn-resp,
            .connect-btn-resp {
                -webkit-appearance: none;
                appearance: none;
            }
            
            .trade-modal-resp {
                -webkit-overflow-scrolling: touch;
            }
            
            .trade-modal-content-resp {
                -webkit-overflow-scrolling: touch;
                overflow-y: scroll;
            }
        }
    `);

    // === ОСНОВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ===
    function scriptInit() {

        setPageTitle();

        replaceTableHeading();

        applyNewFonts();

        applyBodyStyle();

        replaceSpinnerImage();

        applySavedColors();

        const styleButton = createStyleButton('div.container-fluid span.badge.bg-success');
        createIPCheckButton();
        createIPCheckModal();

        const styleContainerBg = createStyleContainerBg('main');

        applyMenuStyles();

        addListenersAttributes();

        // Инициализация TradeID Viewer и Vehicle Exchange
        attachTradeButtons();
        attachVehicleExchangeButtons();
        attachIPInfoButtons();
        setInterval(() => {
            attachTradeButtons();
            attachVehicleExchangeButtons();
            attachIPInfoButtons();
        }, 1000);

    }

})();