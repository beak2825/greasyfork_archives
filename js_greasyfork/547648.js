// ==UserScript==
// @name         Black Russia TradeID Viewer (Centered Adaptive UI)
// @namespace    http://tampermonkey.net/
// @version      5.3
// @author       Assistant
// @description  Идеально адаптивный скрипт с элегантным полупрозрачным дизайном. Динамический размер окна на ПК, адаптирующийся под контент.
// @license      GNU GPLv3
// @match        https://logs.blackrussia.online/gslogs/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      logs.blackrussia.online
// @downloadURL https://update.greasyfork.org/scripts/547648/Black%20Russia%20TradeID%20Viewer%20%28Centered%20Adaptive%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547648/Black%20Russia%20TradeID%20Viewer%20%28Centered%20Adaptive%20UI%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REQUEST_DELAY_MS = 4000;
    const SHOW_CONNECT_BTN_DELAY_MS = 2000;
    let lastRequestTime = 0;
    const openModals = {};

    const SERVER_ID_MATCH = window.location.pathname.match(/\/gslogs\/(\d+)/);
    const SERVER_ID = SERVER_ID_MATCH ? SERVER_ID_MATCH[1] : '1';

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
            --font-family: 'Segoe UI', sans-serif;
            --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .trade-btn-resp {
            background: var(--primary-gradient);
            color: white;
            border: none;
            padding: 6px 12px;
            margin: 2px;
            font-size: 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: transform var(--transition), box-shadow var(--transition);
        }
        .trade-btn-resp:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(43, 140, 255, 0.3);
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
            /* Центрируем по вертикали */
            align-items: center;
            padding: 16px;
        }

        .trade-modal-resp {
            background: var(--bg-main);
            color: var(--text-primary);
            box-shadow: var(--shadow);
            width: 95%; /* Ограничиваем ширину на мобильных */
            max-width: 600px;
            height: auto;
            max-height: 90vh; /* Максимальная высота, чтобы не закрывать весь экран */
            overflow: hidden;
            display: flex;
            flex-direction: column;
            font-family: var(--font-family);
            border: 1px solid var(--border-color);
            backdrop-filter: blur(15px);
            border-radius: var(--radius);

            /* Анимация появления */
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
        /* Убираем "ручку" шторки */
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
            overflow-y: auto; /* Главный скролл */
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
            background: var(--secondary-gradient);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            width: 100%;
        }

        .connect-panel-resp {
            background: var(--bg-panel);
            padding: 16px;
            border-radius: var(--radius);
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 16px 0; /* Отступы внутри скролла */
            border: 1px solid var(--border-color);
            backdrop-filter: blur(15px);
        }
        .connect-btn-resp {
            background: linear-gradient(145deg, #3742fa, #1e90ff);
            color: var(--text-primary);
            border: none;
            padding: 10px 14px;
            border-radius: 8px;
            font-weight: 500;
            text-align: left;
            font-size: 13px;
        }
        .connect-btn-resp.empty { background: rgba(47, 53, 66, 0.7); cursor: default; }

        /* --- ДЕСКТОПНЫЙ ВИД (для экранов шире 800px) --- */
        @media (min-width: 800px) {
            .trade-wrapper-resp {
                flex-direction: row;
                align-items: center;
                padding: 32px;
            }
            /* --- ИЗМЕНЕНИЯ ЗДЕСЬ --- */
            .trade-modal-resp {
                max-width: 800px;
                width: 100%;
                height: auto; /* <-- ИЗМЕНЕНО: Высота зависит от контента */
                min-height: 150px; /* <-- ДОБАВЛЕНО: Минимальная высота для эстетики */
                max-height: 85vh; /* <-- ОСТАВЛЕНО: Ограничение максимальной высоты */
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
        }
    `);

    // --- JAVASCRIPT ЛОГИКА ---

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
            const startDate = new Date(Date.now() - 5 * 30 * 24 * 60 * 60 * 1000).toISOString();
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

    function attachTradeButtons() {
        const tradeRegex = /TradeID:\s*(\d+)/g;
        document.querySelectorAll('td:not([class*="-resp"])').forEach(td => {
            if (td.innerHTML.includes('TradeID:') && !td.querySelector('.trade-btn-resp')) {
                const uniqueIds = [...new Set(Array.from(td.innerHTML.matchAll(tradeRegex), m => m[1]))];
                uniqueIds.forEach(tradeID => {
                    if (!td.querySelector(`.trade-btn-resp[data-trade='${tradeID}']`)) {
                        const btn = document.createElement('button');
                        btn.className = 'trade-btn-resp';
                        btn.dataset.trade = tradeID;
                        btn.textContent = `Трейд #${tradeID}`;
                        btn.onclick = (e) => { e.stopPropagation(); createModal(tradeID); };
                        td.appendChild(btn);
                    }
                });
            }
        });
    }

    attachTradeButtons();
    setInterval(attachTradeButtons, 1000);

})();