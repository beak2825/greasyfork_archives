// ==UserScript==
// @name         Black Russia TradeID
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Модальное окно трейдов (просмотр)
// @author       You
// @match        https://logs.blackrussia.online/gslogs/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license ааааа
// @downloadURL https://update.greasyfork.org/scripts/547515/Black%20Russia%20TradeID.user.js
// @updateURL https://update.greasyfork.org/scripts/547515/Black%20Russia%20TradeID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .trade-btn {
            background: linear-gradient(145deg, #0d47a1, #1565c0);
            color: white;
            border: none;
            padding: 6px 12px;
            margin: 2px;
            font-size: 12px;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .trade-btn:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 4px 10px rgba(13, 71, 161, 0.4);
            background: linear-gradient(145deg, #1565c0, #0d47a1);
        }
        .trade-btn:active {
            transform: translateY(0) scale(0.98);
        }
        .trade-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: 0.5s;
        }
        .trade-btn:hover::before {
            left: 100%;
        }
        .trade-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #fff;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            z-index: 10000;
            width: 90%;
            max-width: 800px;
            max-height: 80vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border: 1px solid rgba(13, 71, 161, 0.5);
        }
        .trade-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 9999;
            display: none;
        }
        .trade-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #2d3748;
        }
        .trade-modal-title {
            font-size: 18px;
            font-weight: bold;
            color: #64b5f6;
            margin: 0;
            text-shadow: 0 0 5px rgba(100, 181, 246, 0.3);
        }
        .trade-modal-close {
            background: #ff4757;
            border: none;
            color: #fff;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        .trade-modal-close:hover {
            transform: rotate(90deg);
            background: #ff6b81;
        }
        .trade-modal-content {
            overflow-y: auto;
            flex-grow: 1;
            padding-right: 5px;
            margin-bottom: 15px;
        }
        .trade-row {
            display: flex;
            flex-wrap: wrap;
            padding: 8px 0;
            border-bottom: 1px solid #2d3748;
            transition: background-color 0.2s ease;
        }
        .trade-row:hover {
            background-color: rgba(13, 71, 161, 0.1);
        }
        .trade-time {
            width: 140px;
            color: #90a4ae;
            font-size: 12px;
        }
        .trade-player {
            width: 160px;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .trade-desc {
            flex-grow: 1;
            min-width: 200px;
            color: #cfd8dc;
        }
        .loading {
            text-align: center;
            padding: 20px;
            color: #90a4ae;
            font-style: italic;
        }
        .server-selector-container {
            margin-top: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 12px;
            border: 1px solid rgba(13, 71, 161, 0.5);
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }
        .server-selector-title {
            color: #64b5f6;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
        }
        .server-selector-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }
        .server-input {
            width: 80px;
            padding: 10px 15px;
            border: 1px solid #64b5f6;
            border-radius: 8px;
            background: #2d3748;
            color: white;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
        }
        .server-label {
            color: #e2e8f0;
            font-size: 14px;
            white-space: nowrap;
            font-weight: 500;
        }
        .save-server-btn {
            background: linear-gradient(145deg, #4caf50, #45a049);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .save-server-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .current-server-info {
            color: #90caf9;
            font-weight: bold;
            font-size: 14px;
            background: rgba(13, 71, 161, 0.3);
            padding: 5px 10px;
            border-radius: 5px;
        }

        @media (max-width: 768px) {
            .trade-modal {
                width: 95%;
                padding: 15px;
                max-height: 85vh;
            }
            .trade-row {
                flex-direction: column;
            }
            .trade-time, .trade-player {
                width: 100%;
                margin-bottom: 5px;
            }
            .trade-modal-title {
                font-size: 16px;
            }
            .trade-btn {
                font-size: 11px;
                padding: 4px 8px;
            }
            .server-selector-container {
                padding: 15px;
                margin-top: 20px;
            }
            .server-selector-content {
                flex-direction: column;
                gap: 10px;
            }
            .server-input {
                width: 70px;
                padding: 8px 12px;
                font-size: 13px;
            }
            .server-label {
                font-size: 13px;
            }
            .save-server-btn {
                padding: 8px 16px;
                font-size: 13px;
            }
        }

        .trade-modal-content::-webkit-scrollbar {
            width: 6px;
        }
        .trade-modal-content::-webkit-scrollbar-track {
            background: #1e293b;
            border-radius: 10px;
        }
        .trade-modal-content::-webkit-scrollbar-thumb {
            background: #1565c0;
            border-radius: 10px;
        }
        .trade-modal-content::-webkit-scrollbar-thumb:hover {
            background: #0d47a1;
        }
    `);

    const openModals = {};

    // Получаем сохраненный сервер или используем 56 по умолчанию
    let currentServer = GM_getValue('br_trade_server', '56');

    // Создаем элемент выбора сервера внизу страницы
    function createServerSelector() {
        // Ждем загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createServerSelector);
            return;
        }

        // Ищем основной контейнер контента
        const mainContent = document.querySelector('.main-content') || document.querySelector('main') || document.body;

        const container = document.createElement('div');
        container.className = 'server-selector-container';
        container.id = 'server-selector-container';

        const title = document.createElement('div');
        title.className = 'server-selector-title';
        title.textContent = 'Настройки сервера';

        const content = document.createElement('div');
        content.className = 'server-selector-content';

        const label = document.createElement('span');
        label.className = 'server-label';
        label.textContent = 'Номер сервера:';

        const currentInfo = document.createElement('span');
        currentInfo.className = 'current-server-info';
        currentInfo.textContent = `Текущий: ${currentServer}`;
        currentInfo.id = 'current-server-info';

        const input = document.createElement('input');
        input.className = 'server-input';
        input.type = 'number';
        input.value = currentServer;
        input.min = '1';
        input.id = 'server-input';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-server-btn';
        saveBtn.textContent = 'Сохранить';
        saveBtn.onclick = () => {
            const inputValue = input.value.trim();
            if (inputValue && inputValue > 0 && !isNaN(inputValue)) {
                currentServer = inputValue;
                GM_setValue('br_trade_server', currentServer);
                document.getElementById('current-server-info').textContent = `Текущий: ${currentServer}`;
                alert(`Сервер изменен на ${currentServer}`);
            } else {
                alert('Введите корректный номер сервера');
            }
        };

        content.appendChild(label);
        content.appendChild(currentInfo);
        content.appendChild(input);
        content.appendChild(saveBtn);

        container.appendChild(title);
        container.appendChild(content);

        // Добавляем в конец основного контента
        mainContent.appendChild(container);
    }

    function formatTime(iso){
        const d = new Date(iso);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} | ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
    }

    function createModal(tradeID){
        if(openModals[tradeID]) return;

        const overlay = document.createElement("div");
        overlay.className = "trade-modal-overlay";
        overlay.style.display = "block";
        document.body.appendChild(overlay);

        const modal = document.createElement("div");
        modal.className = "trade-modal";

        const header = document.createElement("div");
        header.className = "trade-modal-header";

        const title = document.createElement("h3");
        title.className = "trade-modal-title";
        title.textContent = "Логи трейда #" + tradeID;

        const closeBtn = document.createElement("button");
        closeBtn.className = "trade-modal-close";
        closeBtn.textContent = "×";
        closeBtn.onclick = () => {
            modal.remove();
            overlay.remove();
            delete openModals[tradeID];
        };

        header.appendChild(title);
        header.appendChild(closeBtn);

        const content = document.createElement("div");
        content.className = "trade-modal-content";
        content.innerHTML = '<div class="loading">Загрузка логов...</div>';

        modal.appendChild(header);
        modal.appendChild(content);

        document.body.appendChild(modal);
        openModals[tradeID] = modal;

        let isDragging = false;
        let offsetX, offsetY;

        header.onmousedown = (e) => {
            isDragging = true;
            offsetX = e.clientX - modal.getBoundingClientRect().left;
            offsetY = e.clientY - modal.getBoundingClientRect().top;
            modal.style.cursor = "grabbing";
        };

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                modal.style.left = `${e.clientX - offsetX}px`;
                modal.style.top = `${e.clientY - offsetY}px`;
                modal.style.transform = "none";
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            modal.style.cursor = "default";
        });

        const startDate = new Date(Date.now() - 5*30*24*60*60*1000).toISOString();
        const endDate = new Date().toISOString();
        const url = `/gslogs/${currentServer}/api/list-game-logs/?transaction_desc__ilike=%25TradeID%3A+${tradeID}%25&time__gte=${startDate}&time__lte=${endDate}&order_by=time&offset=0&auto=false`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(res) {
                try {
                    const data = JSON.parse(res.responseText);
                    content.innerHTML = "";

                    if(data.length === 0) {
                        content.textContent = "Логи не найдены";
                        return;
                    }

                    data.forEach(item => {
                        const row = document.createElement("div");
                        row.className = "trade-row";

                        const time = document.createElement("div");
                        time.className = "trade-time";
                        time.textContent = formatTime(item.time);

                        const player = document.createElement("div");
                        player.className = "trade-player";
                        player.textContent = item.player_name;

                        const sum = Math.abs(item.transaction_amount);
                        let hue = Math.min(120, Math.max(0, Math.floor(120 - sum/20000000*120)));
                        if(item.transaction_amount < 0) hue = 240;
                        player.style.color = `hsl(${hue},100%,70%)`;

                        const desc = document.createElement("div");
                        desc.className = "trade-desc";
                        desc.textContent = item.transaction_desc;

                        row.appendChild(time);
                        row.appendChild(player);
                        row.appendChild(desc);
                        content.appendChild(row);
                    });
                } catch(e) {
                    content.textContent = "Ошибка данных";
                }
            },
            onerror: function() {
                content.textContent = "Ошибка соединения";
            }
        });

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                modal.remove();
                overlay.remove();
                delete openModals[tradeID];
            }
        };
    }

    function attachTradeButtons(){
        const tradeRegex = /TradeID:\s*(\d+)/g;
        document.querySelectorAll('td:not(.trade-modal td)').forEach(td => {
            let html = td.innerHTML;
            let match;
            while((match = tradeRegex.exec(html)) !== null){
                const tradeID = match[1];
                if(!td.querySelector(`.trade-btn[data-trade='${tradeID}']`)){
                    const btn = document.createElement('button');
                    btn.className = 'trade-btn';
                    btn.dataset.trade = tradeID;
                    btn.textContent = `Трейд #${tradeID}`;

                    btn.addEventListener('click', () => {
                        createModal(tradeID);
                    });
                    td.appendChild(btn);
                }
            }
        });
    }

    // Создаем селектор сервера
    createServerSelector();

    // Запускаем проверку каждую секунду
    setInterval(attachTradeButtons, 1000);

    // Также запускаем один раз сразу
    setTimeout(attachTradeButtons, 500);
})();