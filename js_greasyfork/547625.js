// ==UserScript==
// @name         Zendesk Ticket Counter
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Показує кількість тікетів, веде статистику з динамічним оновленням часу в черзі, експортом та візуальними ефектами.
// @author       Swiftlyx
// @match        https://*.zendesk.com/agent/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/547625/Zendesk%20Ticket%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/547625/Zendesk%20Ticket%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- КОНФІГУРАЦІЯ ---
    const ZENDESK_VIEW_URL = 'https://askcrew.zendesk.com/api/v2/views/16959163844636/execute.json';
    const POLLING_INTERVAL = 30000;
    const THRESHOLD_SECONDS = 60;

    // --- ГЛОБАЛЬНІ ЗМІННІ ---
    let statistics = {};
    let counterButton, modal, modalContentNew, modalContentOpen, dailySummary, counterText;
    let effectsEnabled = true;
    let starfieldAnimationId = null;


    /**
     * Ініціалізація UI: створення кнопки, модального вікна та ефектів.
     */
    async function initUI() {
        effectsEnabled = await GM_getValue('zendeskEffectsEnabled', true);

        counterButton = document.createElement('div');
        counterButton.id = 'ticket-counter-button';

        counterText = document.createElement('span');
        counterText.id = 'ticket-counter-text';
        counterText.innerText = '...';
        counterButton.appendChild(counterText);

        counterButton.addEventListener('click', toggleModal);

        counterButton.addEventListener('mousemove', (e) => {
            if (!effectsEnabled) return;
            const rect = counterButton.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            counterButton.style.setProperty('--x', `${x}px`);
            counterButton.style.setProperty('--y', `${y}px`);
        });

        document.body.appendChild(counterButton);

        modal = document.createElement('div');
        modal.id = 'ticket-stats-modal';
        modal.innerHTML = `
            <canvas id="starfield-canvas"></canvas>
            <div class="modal-content-wrapper">
                <div class="modal-header">
                    <h2>Статистика тікетів (> ${THRESHOLD_SECONDS} сек)</h2>
                    <div class="modal-controls">
                        <button id="toggle-effects-button" class="modal-button">${effectsEnabled ? 'Вимкнути ефекти' : 'Увімкнути ефекти'}</button>
                        <button id="export-stats-button" class="modal-button">Експорт</button>
                        <span class="close-button">&times;</span>
                    </div>
                </div>
                <div class="modal-body">
                    <div id="daily-summary"></div>
                    <h3>Статус "New"</h3>
                    <div id="modal-content-new" class="stats-container"></div>
                    <h3>Статус "Open" (без виконавця)</h3>
                    <div id="modal-content-open" class="stats-container"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modalContentNew = document.getElementById('modal-content-new');
        modalContentOpen = document.getElementById('modal-content-open');
        dailySummary = document.getElementById('daily-summary');

        modal.querySelector('.close-button').addEventListener('click', toggleModal);
        modal.querySelector('#export-stats-button').addEventListener('click', exportStatistics);
        modal.querySelector('#toggle-effects-button').addEventListener('click', toggleEffects);

        addStyles();
        initStarfield();
    }

    /**
     * Додавання CSS стилів для UI.
     */
    function addStyles() {
        GM_addStyle(`
            #ticket-counter-button {
                -webkit-tap-highlight-color: transparent; cursor: pointer; outline: none; border: none;
                font-family: inherit; font-size: 22px; font-weight: bold; position: fixed;
                top: 5px; left: 5px; z-index: 9998; width: 50px; height: 50px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center; background: #3d3d3d;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.1);
                transition: transform 0.2s ease, box-shadow 0.2s ease; overflow: hidden;
            }
            #ticket-counter-button::before {
                content: ''; position: absolute; left: var(--x, 50%); top: var(--y, 50%);
                width: 60px; height: 60px;
                background: radial-gradient(circle, #00ffc3 10%, transparent 70%);
                transform: translate(-50%, -50%) scale(0);
                transition: transform 0.4s ease; border-radius: 50%; opacity: 0.5;
                pointer-events: none; z-index: 0;
            }
            #ticket-counter-button:hover::before { transform: translate(-50%, -50%) scale(1.2); }
            #ticket-counter-text { position: relative; z-index: 1; }
            #ticket-counter-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1);
            }
            #ticket-counter-button:active { transform: scale(1.05); }
            .text-status-green { color: #28a745; }
            .text-status-orange { color: #ffc107; }
            .text-status-red { color: #dc3545; }
            .text-status-default { color: #ffffff; }
            #ticket-stats-modal {
                display: none; position: fixed; z-index: 10000; left: 50%; top: 50%;
                transform: translate(-50%, -50%); width: 80%; max-width: 700px; max-height: 80vh;
                border: 1px solid #ccc; border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                overflow: hidden; background-color: #000;
                background-image: radial-gradient(circle at top right, rgba(121, 68, 154, 0.13), transparent),
                                  radial-gradient(circle at 20% 80%, rgba(41, 196, 255, 0.13), transparent);
            }
            #starfield-canvas {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 1; display: none;
            }
            .modal-content-wrapper {
                position: relative; z-index: 2; width: 100%; height: 100%;
                background: rgba(40, 40, 40, 0.8);
                display: flex; flex-direction: column; border-radius: 8px;
            }
            .modal-header {
                padding: 15px 20px; background-color: rgba(242, 242, 242, 0.1); border-bottom: 1px solid #444;
                display: flex; justify-content: space-between; align-items: center; color: #fff;
            }
            .modal-header h2 { margin: 0; font-size: 18px; }
            .modal-controls { display: flex; align-items: center; }
            .modal-button {
                padding: 5px 12px; border: 1px solid #555; background-color: #333; color: #fff;
                border-radius: 4px; cursor: pointer; margin-left: 10px; font-size: 14px;
            }
            .modal-button:hover { background-color: #444; }
            .close-button { color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; margin-left: 15px; }
            .close-button:hover { color: #fff; }
            .modal-body { padding: 20px; overflow-y: auto; color: #eee; }
            .modal-body h3 { margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #007bff; padding-bottom: 5px; }
            .stats-container { display: grid; grid-template-columns: 1fr; gap: 8px; }
            .stat-item { background-color: rgba(249, 249, 249, 0.05); padding: 10px; border-radius: 4px; border: 1px solid #444; font-size: 14px; }
            #daily-summary {
                background-color: rgba(231, 243, 255, 0.1); border: 1px solid #b3d7ff; color: #b3d7ff;
                padding: 15px; border-radius: 5px; font-weight: bold; text-align: center; margin-bottom: 20px;
            }
        `);
    }

    async function toggleEffects() {
        effectsEnabled = !effectsEnabled;
        await GM_setValue('zendeskEffectsEnabled', effectsEnabled);

        const button = document.getElementById('toggle-effects-button');
        button.textContent = effectsEnabled ? 'Вимкнути ефекти' : 'Увімкнути ефекти';

        const canvas = document.getElementById('starfield-canvas');
        if (effectsEnabled) {
            if (modal.style.display === 'block') {
                canvas.style.display = 'block';
                startStarfield();
            }
            counterButton.style.setProperty('--x', '50%');
            counterButton.style.setProperty('--y', '50%');
        } else {
            canvas.style.display = 'none';
            stopStarfield();
            counterButton.style.removeProperty('--x');
            counterButton.style.removeProperty('--y');
        }
    }

    /**
     * Exports all stored statistics to a CSV file.
     */
    async function exportStatistics() {
        const statsToExport = await GM_getValue('zendeskTicketStats', {});
        if (Object.keys(statsToExport).length === 0) {
            showCustomAlert('Немає даних для експорту.');
            return;
        }

        // --- ЗМІНЕНО: Видалено колонку "Subject" з заголовка ---
        let csvContent = "Date;Status;Ticket ID;Recorded At;Duration;Brand\n";
        const sanitize = (str) => `"${(str || '').replace(/"/g, '""')}"`;

        for (const date in statsToExport) {
            for (const status in statsToExport[date]) {
                for (const ticket of statsToExport[date][status]) {
                    // --- НОВЕ: Створення гіперпосилання для Ticket ID для Excel/Google Sheets ---
                    // --- ВИПРАВЛЕНО: Змінено форматування формули для коректної роботи в Excel/Google Sheets ---
                    // Формат: =HYPERLINK("URL";"Текст")
                    const ticketUrl = `https://askcrew.zendesk.com/agent/tickets/${ticket.id}`;
                    // Для CSV, подвійні лапки всередині поля, яке взято в лапки, мають бути подвоєні.
                    // Також, для багатьох європейських локалей роздільником у формулах є крапка з комою.
                    const ticketLinkCell = `"=HYPERLINK(""${ticketUrl}"";""${ticket.id}"")"`;


                    // --- ЗМІНЕНО: Видалено `sanitize(ticket.subject)` та додано `ticketLinkCell` ---
                    const row = [date, status, ticketLinkCell, ticket.recordedAt, ticket.duration, sanitize(ticket.brand)].join(';');
                    csvContent += row + "\n";
                }
            }
        }

        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // BOM для коректного відображення UTF-8 в Excel
        const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        const today = new Date().toISOString().slice(0, 10);
        link.setAttribute("download", `zendesk_stats_${today}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    function showCustomAlert(message) {
        let alertBox = document.getElementById('custom-alert-box');
        if (!alertBox) {
            alertBox = document.createElement('div');
            alertBox.id = 'custom-alert-box';
            GM_addStyle(`
                #custom-alert-box {
                    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                    background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;
                    padding: 15px 20px; border-radius: 5px; z-index: 10001;
                    opacity: 0; transition: opacity 0.3s; font-size: 16px;
                }
            `);
            document.body.appendChild(alertBox);
        }
        alertBox.textContent = message;
        alertBox.style.opacity = '1';
        setTimeout(() => { alertBox.style.opacity = '0'; }, 3000);
    }

    function toggleModal() {
        const canvas = document.getElementById('starfield-canvas');
        const isOpening = modal.style.display !== 'block';

        if (isOpening) {
            modal.style.display = 'block';
            updateModalContent();
            if (effectsEnabled) {
                canvas.style.display = 'block';
                startStarfield();
            }
        } else {
            modal.style.display = 'none';
            canvas.style.display = 'none';
            stopStarfield();
        }
    }

    function getTodayKey() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${day}/${month}/${year}`;
    }

    async function loadStatistics() {
        statistics = await GM_getValue('zendeskTicketStats', {});
    }

    async function saveStatistics() {
        await GM_setValue('zendeskTicketStats', statistics);
    }

    function formatDateTime(dateObj) {
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    function formatDuration(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.round(totalSeconds % 60);
        return `${minutes}m ${seconds}sec`;
    }

    async function fetchAndProcessTickets() {
        try {
            const urlWithCacheBuster = new URL(ZENDESK_VIEW_URL);
            urlWithCacheBuster.searchParams.append('_', new Date().getTime());

            const response = await fetch(urlWithCacheBuster.toString());
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            updateButton(data.count);

            const now = new Date();
            const todayKey = getTodayKey();

            if (!statistics[todayKey]) {
                statistics[todayKey] = { new: [], open: [] };
            }

            const statsForToday = statistics[todayKey];

            for (const ticket of data.rows) {
                const isNew = ticket.ticket.status === 'new';
                const isOpenUnassigned = ticket.status === 'Open' && ticket.assignee_id === null;

                if (isNew || isOpenUnassigned) {
                    const relevantDate = isNew ? new Date(ticket.created) : new Date(ticket.updated);
                    const timeInQueueSeconds = (now - relevantDate) / 1000;

                    const targetArray = isNew ? statsForToday.new : statsForToday.open;
                    const existingStat = targetArray.find(t => t.id === ticket.ticket_id);

                    if (existingStat) {
                        existingStat.duration = formatDuration(timeInQueueSeconds);
                        existingStat.recordedAt = formatDateTime(now);
                    } else {
                        if (timeInQueueSeconds > THRESHOLD_SECONDS) {
                            const newStatEntry = {
                                id: ticket.ticket_id,
                                recordedAt: formatDateTime(now),
                                duration: formatDuration(timeInQueueSeconds),
                                subject: ticket.subject,
                                brand: ticket.brand
                            };
                            targetArray.push(newStatEntry);
                        }
                    }
                }
            }

            await saveStatistics();
            if (modal.style.display === 'block') updateModalContent();

        } catch (error) {
            console.error('Zendesk Script Error:', error);
            updateButton('!');
        }
    }

    function updateButton(count) {
        if (!counterText) return;
        counterText.innerText = count;
        counterText.className = '';

        if (typeof count === 'number') {
            if (count === 0) counterText.classList.add('text-status-default');
            else if (count <= 4) counterText.classList.add('text-status-green');
            else if (count <= 12) counterText.classList.add('text-status-orange');
            else counterText.classList.add('text-status-red');
        } else {
            counterText.classList.add('text-status-red');
        }
    }

    function updateModalContent() {
        const todayKey = getTodayKey();
        const statsForToday = statistics[todayKey] || { new: [], open: [] };
        const totalToday = statsForToday.new.length + statsForToday.open.length;
        dailySummary.innerHTML = `Всього за сьогодні (${todayKey}) зафіксовано: <strong>${totalToday}</strong> тікет(ів)`;

        const createStatItemHTML = t => `
            <div class="stat-item">
                <strong>ID: ${t.id}</strong> (${t.subject})<br>
                Бренд: <strong>${t.brand || 'N/A'}</strong><br>
                Зафіксовано: ${t.recordedAt}<br>
                Час в черзі: ${t.duration}
            </div>`;

        modalContentNew.innerHTML = statsForToday.new.length > 0 ? statsForToday.new.map(createStatItemHTML).join('') : '<p>Немає даних</p>';
        modalContentOpen.innerHTML = statsForToday.open.length > 0 ? statsForToday.open.map(createStatItemHTML).join('') : '<p>Немає даних</p>';
    }

    // --- Код для анімації "зоряного поля" (без змін) ---
    let starfieldState = {};
    function initStarfield() {
        const STAR_COLOR = '#fff', STAR_SIZE = 3, STAR_MIN_SCALE = 0.2, OVERFLOW_THRESHOLD = 50;
        const canvas = document.getElementById('starfield-canvas');
        if (!canvas) return;
        const context = canvas.getContext('2d');
        let scale = 1, width, height, stars = [], pointerX, pointerY;
        let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };
        let touchInput = false;
        Object.assign(starfieldState, { canvas, context, scale, width, height, stars, pointerX, pointerY, velocity, touchInput, STAR_COLOR, STAR_SIZE, STAR_MIN_SCALE, OVERFLOW_THRESHOLD });
        starfieldState.generate = function() {
            const STAR_COUNT = (window.innerWidth + window.innerHeight) / 8;
            starfieldState.stars = [];
            for (let i = 0; i < STAR_COUNT; i++) starfieldState.stars.push({ x: 0, y: 0, z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE) });
        };
        starfieldState.placeStar = function(star) { star.x = Math.random() * starfieldState.width; star.y = Math.random() * starfieldState.height; };
        starfieldState.recycleStar = function(star) {
            let direction = 'z', vx = Math.abs(starfieldState.velocity.x), vy = Math.abs(starfieldState.velocity.y);
            if (vx > 1 || vy > 1) {
                let axis = (Math.random() < vx / (vx + vy)) ? 'h' : 'v';
                if (axis === 'h') direction = starfieldState.velocity.x > 0 ? 'l' : 'r'; else direction = starfieldState.velocity.y > 0 ? 't' : 'b';
            }
            star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);
            if (direction === 'z') { star.z = 0.1; star.x = Math.random() * starfieldState.width; star.y = Math.random() * starfieldState.height; }
            else if (direction === 'l') { star.x = -OVERFLOW_THRESHOLD; star.y = starfieldState.height * Math.random(); }
            else if (direction === 'r') { star.x = starfieldState.width + OVERFLOW_THRESHOLD; star.y = starfieldState.height * Math.random(); }
            else if (direction === 't') { star.x = starfieldState.width * Math.random(); star.y = -OVERFLOW_THRESHOLD; }
            else if (direction === 'b') { star.x = starfieldState.width * Math.random(); star.y = starfieldState.height + OVERFLOW_THRESHOLD; }
        };
        starfieldState.resize = function() {
            starfieldState.scale = window.devicePixelRatio || 1;
            starfieldState.width = modal.clientWidth * starfieldState.scale;
            starfieldState.height = modal.clientHeight * starfieldState.scale;
            starfieldState.canvas.width = starfieldState.width;
            starfieldState.canvas.height = starfieldState.height;
            starfieldState.stars.forEach(starfieldState.placeStar);
        };
        starfieldState.step = function() {
            starfieldState.context.clearRect(0, 0, starfieldState.width, starfieldState.height);
            starfieldState.update();
            starfieldState.render();
            starfieldAnimationId = requestAnimationFrame(starfieldState.step);
        };
        starfieldState.update = function() {
            starfieldState.velocity.tx *= 0.96; starfieldState.velocity.ty *= 0.96;
            starfieldState.velocity.x += (starfieldState.velocity.tx - starfieldState.velocity.x) * 0.8;
            starfieldState.velocity.y += (starfieldState.velocity.ty - starfieldState.velocity.y) * 0.8;
            starfieldState.stars.forEach((star) => {
                star.x += starfieldState.velocity.x * star.z; star.y += starfieldState.velocity.y * star.z;
                star.x += (star.x - starfieldState.width / 2) * starfieldState.velocity.z * star.z;
                star.y += (star.y - starfieldState.height / 2) * starfieldState.velocity.z * star.z;
                star.z += starfieldState.velocity.z;
                if (star.x < -OVERFLOW_THRESHOLD || star.x > starfieldState.width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > starfieldState.height + OVERFLOW_THRESHOLD) starfieldState.recycleStar(star);
            });
        };
        starfieldState.render = function() {
            starfieldState.stars.forEach((star) => {
                starfieldState.context.beginPath(); starfieldState.context.lineCap = 'round';
                starfieldState.context.lineWidth = STAR_SIZE * star.z * starfieldState.scale;
                starfieldState.context.globalAlpha = 0.5 + 0.5 * Math.random();
                starfieldState.context.strokeStyle = STAR_COLOR;
                starfieldState.context.beginPath(); starfieldState.context.moveTo(star.x, star.y);
                var tailX = starfieldState.velocity.x * 2, tailY = starfieldState.velocity.y * 2;
                if (Math.abs(tailX) < 0.1) tailX = 0.5; if (Math.abs(tailY) < 0.1) tailY = 0.5;
                starfieldState.context.lineTo(star.x + tailX, star.y + tailY);
                starfieldState.context.stroke();
            });
        };
        starfieldState.movePointer = function(x, y) {
            if (typeof starfieldState.pointerX === 'number' && typeof starfieldState.pointerY === 'number') {
                let ox = x - starfieldState.pointerX, oy = y - starfieldState.pointerY;
                starfieldState.velocity.tx += (ox / 8 * starfieldState.scale) * (starfieldState.touchInput ? 1 : -1);
                starfieldState.velocity.ty += (oy / 8 * starfieldState.scale) * (starfieldState.touchInput ? 1 : -1);
            }
            starfieldState.pointerX = x; starfieldState.pointerY = y;
        };
        starfieldState.onMouseMove = function(event) { starfieldState.touchInput = false; starfieldState.movePointer(event.clientX, event.clientY); };
        starfieldState.onMouseLeave = function() { starfieldState.pointerX = null; starfieldState.pointerY = null; };
        modal.addEventListener('mousemove', starfieldState.onMouseMove);
        modal.addEventListener('mouseleave', starfieldState.onMouseLeave);
    }
    function startStarfield() {
        if (starfieldAnimationId) return;
        starfieldState.generate();
        starfieldState.resize();
        starfieldState.step();
        window.addEventListener('resize', starfieldState.resize);
    }
    function stopStarfield() {
        if (starfieldAnimationId) { cancelAnimationFrame(starfieldAnimationId); starfieldAnimationId = null; }
        window.removeEventListener('resize', starfieldState.resize);
    }

    async function main() {
        await initUI();
        await loadStatistics();
        fetchAndProcessTickets();
        setInterval(fetchAndProcessTickets, POLLING_INTERVAL);
    }

    main();
})();