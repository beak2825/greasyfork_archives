// ==UserScript==
// @name         Drawaria Time Tracker 
// @namespace    http://tampermonkey.net/
// @author       лазер дмитрий прайм
// @version      6.3
// @description  Таймер с топом, онлайн-статусом и премиум дизайном
// @match        https://drawaria.online/*
// @grant        none
// @author       GothbreachHelper
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546332/Drawaria%20Time%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/546332/Drawaria%20Time%20Tracker.meta.js
// ==/UserScript==

(function() {
    // Конфигурация
    const TOP_SIZE = 100;
    const TOP_KEY = 'drawariaGlobalTop';
    const ONLINE_KEY = 'drawariaOnlineUsers';
    const USER_ID = Math.random().toString(36).substr(2, 9);
    const USER_NAME = `Player${Math.floor(Math.random() * 1000)}`;
    const COLORS = {
        primary: '#4cc9f0',
        secondary: '#4361ee',
        accent: '#f72585',
        success: '#4ade80',
        danger: '#ff6b6b',
        warning: '#ffcc00',
        dark: '#1a1a2e'
    };

    // Стили с анимациями
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes glow {
            0% { box-shadow: 0 0 5px ${COLORS.primary}; }
            50% { box-shadow: 0 0 20px ${COLORS.primary}; }
            100% { box-shadow: 0 0 5px ${COLORS.primary}; }
        }
        
        .timer-container {
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            z-index: 9999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border: 2px solid ${COLORS.primary};
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            min-width: 300px;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            animation: glow 3s infinite;
        }
        
        .timer-container.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .drag-header {
            cursor: move;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(76, 201, 240, 0.3);
            text-align: center;
            font-weight: bold;
            color: ${COLORS.primary};
            font-size: 20px;
            text-shadow: 0 0 10px ${COLORS.primary};
            letter-spacing: 1px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .drag-header::before, .drag-header::after {
            content: '✦';
            margin: 0 10px;
            color: ${COLORS.accent};
            animation: pulse 2s infinite;
        }
        
        .time-display {
            font-size: 32px;
            text-align: center;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
            background: rgba(0, 0, 0, 0.3);
            padding: 15px;
            border-radius: 12px;
            border: 1px solid rgba(76, 201, 240, 0.2);
            color: #f8f9fa;
            text-shadow: 0 0 10px ${COLORS.primary};
            letter-spacing: 3px;
            position: relative;
            overflow: hidden;
        }
        
        .time-display::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(transparent, rgba(76, 201, 240, 0.1), transparent);
            transform: rotate(30deg);
            animation: shine 6s infinite;
        }
        
        @keyframes shine {
            0% { transform: rotate(30deg) translate(-10%, -10%); }
            100% { transform: rotate(30deg) translate(90%, 90%); }
        }
        
        .controls-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 20px;
        }
        
        .timer-btn {
            background: linear-gradient(to right, ${COLORS.secondary}, #3a0ca3);
            color: white;
            border: none;
            padding: 12px 5px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            outline: none;
            position: relative;
            overflow: hidden;
        }
        
        .timer-btn::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: rgba(255,255,255,0.1);
            transform: rotate(30deg);
            transition: all 0.6s;
        }
        
        .timer-btn:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
            background: linear-gradient(to right, #4895ef, ${COLORS.secondary});
        }
        
        .timer-btn:hover::after {
            transform: rotate(30deg) translate(10%, 10%);
        }
        
        .timer-btn:active {
            transform: translateY(2px);
        }
        
        .menu-btn {
            position: fixed;
            top: 15px;
            right: 15px;
            background: linear-gradient(135deg, ${COLORS.secondary} 0%, #3a0ca3 100%);
            color: white;
            border: none;
            padding: 14px 24px;
            border-radius: 30px;
            cursor: pointer;
            z-index: 9998;
            font-family: 'Segoe UI', sans-serif;
            font-weight: bold;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            letter-spacing: 1px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            animation: pulse 3s infinite;
        }
        
        .menu-btn:hover {
            transform: translateY(-5px) scale(1.1);
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);
        }

        .saves-container, .top-container, .online-container {
            max-height: 250px;
            overflow-y: auto;
            margin-top: 20px;
            border-top: 1px solid rgba(76, 201, 240, 0.3);
            padding-top: 15px;
            display: none;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.2);
            padding: 15px;
        }

        .container-header {
            text-align: center;
            font-weight: bold;
            margin-bottom: 15px;
            color: ${COLORS.primary};
            font-size: 18px;
            position: relative;
            padding-bottom: 10px;
        }
        
        .container-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 25%;
            width: 50%;
            height: 2px;
            background: linear-gradient(to right, transparent, ${COLORS.primary}, transparent);
        }

        .save-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            margin: 8px 0;
            background: rgba(76, 201, 240, 0.15);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            border-left: 3px solid ${COLORS.primary};
        }

        .save-item:hover {
            background: rgba(76, 201, 240, 0.3);
            transform: translateX(10px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .delete-btn {
            background: ${COLORS.danger};
            color: white;
            border: none;
            border-radius: 50%;
            width: 26px;
            height: 26px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .delete-btn:hover {
            background: #ff4c4c;
            transform: scale(1.2) rotate(90deg);
        }
        
        .top-item {
            display: flex;
            align-items: center;
            padding: 10px 15px;
            margin: 8px 0;
            background: rgba(28, 58, 128, 0.3);
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.3s;
            border-left: 3px solid ${COLORS.accent};
        }
        
        .top-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .top-position {
            background: ${COLORS.primary};
            color: #16213e;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
            font-size: 14px;
            box-shadow: 0 0 10px ${COLORS.primary};
        }
        
        .top-you {
            background: ${COLORS.warning};
            color: #000;
            box-shadow: 0 0 10px ${COLORS.warning};
        }
        
        .top-name {
            flex-grow: 1;
            font-weight: bold;
        }
        
        .online-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 15px;
            margin: 8px 0;
            background: rgba(76, 201, 240, 0.15);
            border-radius: 8px;
            animation: pulse 2s infinite;
            border-left: 3px solid ${COLORS.success};
            transition: all 0.3s;
        }
        
        .online-item:hover {
            transform: scale(1.02);
            box-shadow: 0 0 15px rgba(76, 201, 240, 0.5);
        }
        
        .online-you {
            background: rgba(255, 204, 0, 0.25);
            border-left: 3px solid ${COLORS.warning};
        }
        
        .online-time {
            font-family: 'Courier New', monospace;
            font-weight: bold;
            font-size: 16px;
            color: ${COLORS.primary};
            text-shadow: 0 0 5px ${COLORS.primary};
        }
        
        .delete-top-btn {
            background: ${COLORS.danger};
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            margin-left: 10px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .delete-top-btn:hover {
            background: #ff4c4c;
            transform: scale(1.1);
        }
        
        /* Стили для скроллбара */
        *::-webkit-scrollbar {
            width: 8px;
        }
        
        *::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
            border-radius: 4px;
        }
        
        *::-webkit-scrollbar-thumb {
            background: ${COLORS.primary};
            border-radius: 4px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
            background: ${COLORS.accent};
        }
    `;
    document.head.appendChild(style);

    // Создание элементов интерфейса
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-btn';
    menuButton.innerHTML = '⏱️ ТАЙМЕР <span class="pulse-dot"></span>';
    menuButton.style.opacity = '0';
    
    const timerContainer = document.createElement('div');
    timerContainer.className = 'timer-container';
    
    const dragHeader = document.createElement('div');
    dragHeader.className = 'drag-header';
    dragHeader.textContent = 'ULTIMATE TIME TRACKER';
    
    const timeDisplay = document.createElement('div');
    timeDisplay.className = 'time-display';
    timeDisplay.textContent = '00:00:00';
    
    const controls = document.createElement('div');
    controls.className = 'controls-grid';
    
    // Функция создания кнопок с иконками
    const createButton = (text, icon) => {
        const btn = document.createElement('button');
        btn.className = 'timer-btn';
        btn.innerHTML = `${icon} ${text}`;
        return btn;
    };
    
    // Создаем кнопки с иконками
    const btnStart = createButton('СТАРТ', '▶️');
    const btnPause = createButton('ПАУЗА', '⏸️');
    const btnReset = createButton('СБРОС', '⏹️');
    const btnSave = createButton('СОХРАНИТЬ', '💾');
    const btnLoad = createButton('ЗАГРУЗИТЬ', '📂');
    const btnTop = createButton('ТОП', '🏆');
    const btnOnline = createButton('ОНЛАЙН', '👥');
    const btnClose = createButton('ЗАКРЫТЬ', '✖️');
    
    // Собираем интерфейс
    controls.appendChild(btnStart);
    controls.appendChild(btnPause);
    controls.appendChild(btnReset);
    controls.appendChild(btnSave);
    controls.appendChild(btnLoad);
    controls.appendChild(btnTop);
    controls.appendChild(btnOnline);
    controls.appendChild(btnClose);
    
    timerContainer.appendChild(dragHeader);
    timerContainer.appendChild(timeDisplay);
    timerContainer.appendChild(controls);

    // Контейнеры
    const savesContainer = document.createElement('div');
    savesContainer.className = 'saves-container';
    timerContainer.appendChild(savesContainer);

    const topContainer = document.createElement('div');
    topContainer.className = 'top-container';
    timerContainer.appendChild(topContainer);

    const onlineContainer = document.createElement('div');
    onlineContainer.className = 'online-container';
    timerContainer.appendChild(onlineContainer);
    
    document.body.appendChild(timerContainer);
    document.body.appendChild(menuButton);
    
    // Анимация появления
    setTimeout(() => {
        menuButton.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        menuButton.style.opacity = '1';
        menuButton.animate([
            { transform: 'translateY(-20px)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 }
        ], {
            duration: 800,
            easing: 'ease-out'
        });
    }, 300);

    // Логика таймера
    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval = null;
    let isRunning = false;
    let onlineStatusInterval = null;

    function formatTime(ms) {
        if (isNaN(ms)) ms = 0;
        const totalSec = Math.floor(ms / 1000);
        const hours = Math.floor(totalSec / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSec % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    function updateTimer() {
        elapsedTime = Date.now() - startTime;
        timeDisplay.textContent = formatTime(elapsedTime);
        
        // Анимация обновления времени
        timeDisplay.animate([
            { opacity: 0.7, transform: 'scale(0.95)' },
            { opacity: 1, transform: 'scale(1)' }
        ], { duration: 300, easing: 'ease-out' });
        
        // Анимация для цифр
        const digits = timeDisplay.textContent.split('');
        timeDisplay.innerHTML = digits.map(d => 
            `<span style="display:inline-block; transition: all 0.3s;">${d}</span>`
        ).join('');
        
        setTimeout(() => {
            timeDisplay.querySelectorAll('span').forEach((span, i) => {
                span.animate([
                    { transform: 'translateY(0)', textShadow: '0 0 5px #4cc9f0' },
                    { transform: 'translateY(-10px)', textShadow: '0 0 15px #4cc9f0' },
                    { transform: 'translateY(0)', textShadow: '0 0 5px #4cc9f0' }
                ], {
                    duration: 500,
                    delay: i * 100,
                    easing: 'ease-out'
                });
            });
        }, 50);
    }

    // Функции для работы с топом
    function updateGlobalTop() {
        const topData = JSON.parse(localStorage.getItem(TOP_KEY)) || [];
        topContainer.innerHTML = '';
        
        if (topData.length === 0) {
            topContainer.innerHTML = '<div class="container-header">Топ пуст</div>';
            return;
        }
        
        const header = document.createElement('div');
        header.className = 'container-header';
        header.textContent = `ГЛОБАЛЬНЫЙ ТОП • ${Math.min(topData.length, TOP_SIZE)}/${TOP_SIZE}`;
        topContainer.appendChild(header);
        
        topData.slice(0, 10).forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'top-item';
            
            const position = document.createElement('div');
            position.className = `top-position ${entry.you ? 'top-you' : ''}`;
            position.textContent = index + 1;
            
            const name = document.createElement('div');
            name.className = 'top-name';
            name.textContent = entry.name;
            
            const time = document.createElement('div');
            time.textContent = formatTime(entry.time);
            
            item.appendChild(position);
            item.appendChild(name);
            item.appendChild(time);
            
            if (entry.you) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-top-btn';
                deleteBtn.textContent = 'Удалить';
                deleteBtn.title = 'Удалить из топа';
                
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    item.animate([
                        { opacity: 1, transform: 'scale(1) rotate(0deg)' },
                        { opacity: 0, transform: 'scale(0.8) rotate(10deg)' }
                    ], { duration: 500, easing: 'ease-out' });
                    
                    setTimeout(() => {
                        const updatedTop = topData.filter(e => 
                            !(e.time === entry.time && e.date === entry.date)
                        );
                        localStorage.setItem(TOP_KEY, JSON.stringify(updatedTop));
                        updateGlobalTop();
                    }, 500);
                });
                
                item.appendChild(deleteBtn);
            }
            
            topContainer.appendChild(item);
        });
    }

    function saveToGlobalTop() {
        const playerName = prompt('Введите ваше имя для топа:', USER_NAME);
        if (!playerName) return;
        
        const topData = JSON.parse(localStorage.getItem(TOP_KEY)) || [];
        const newEntry = {
            id: USER_ID,
            name: playerName,
            time: elapsedTime,
            date: Date.now(),
            you: true
        };
        
        topData.push(newEntry);
        topData.sort((a, b) => b.time - a.time);
        
        if (topData.length > TOP_SIZE) {
            topData.length = TOP_SIZE;
        }
        
        localStorage.setItem(TOP_KEY, JSON.stringify(topData));
        updateGlobalTop();
        
        // Эффектная анимация сохранения
        timeDisplay.animate([
            { textShadow: '0 0 5px #ffcc00' },
            { textShadow: '0 0 30px #ffcc00' },
            { textShadow: '0 0 5px #ffcc00' }
        ], { duration: 2000, easing: 'ease-in-out' });
        
        timerContainer.animate([
            { boxShadow: '0 0 10px #ffcc00' },
            { boxShadow: '0 0 30px #ffcc00' },
            { boxShadow: '0 0 10px #4cc9f0' }
        ], { duration: 2000, easing: 'ease-in-out' });
    }

    // Функции для онлайн-статуса
    function updateOnlineStatus() {
        const onlineUsers = JSON.parse(localStorage.getItem(ONLINE_KEY)) || {};
        onlineUsers[USER_ID] = {
            name: USER_NAME,
            time: elapsedTime,
            lastUpdate: Date.now(),
            you: true
        };
        localStorage.setItem(ONLINE_KEY, JSON.stringify(onlineUsers));
    }

    function updateOnlineList() {
        onlineContainer.innerHTML = '';
        const onlineUsers = JSON.parse(localStorage.getItem(ONLINE_KEY)) || {};
        
        // Удаляем неактивных
        Object.keys(onlineUsers).forEach(id => {
            if (Date.now() - onlineUsers[id].lastUpdate > 10000) {
                delete onlineUsers[id];
            }
        });
        localStorage.setItem(ONLINE_KEY, JSON.stringify(onlineUsers));
        
        if (Object.keys(onlineUsers).length === 0) {
            onlineContainer.innerHTML = '<div class="container-header">Нет активных пользователей</div>';
            return;
        }
        
        const header = document.createElement('div');
        header.className = 'container-header';
        header.textContent = `ОНЛАЙН • ${Object.keys(onlineUsers).length} ПОЛЬЗОВАТЕЛЕЙ`;
        onlineContainer.appendChild(header);
        
        Object.values(onlineUsers).forEach(user => {
            const item = document.createElement('div');
            item.className = `online-item ${user.you ? 'online-you' : ''}`;
            
            const name = document.createElement('div');
            name.textContent = user.you ? `Вы (${user.name})` : user.name;
            name.style.fontWeight = 'bold';
            
            const time = document.createElement('div');
            time.className = 'online-time';
            time.textContent = formatTime(user.time);
            
            item.appendChild(name);
            item.appendChild(time);
            onlineContainer.appendChild(item);
            
            // Анимация для новых пользователей
            if (Date.now() - user.lastUpdate < 3000) {
                item.animate([
                    { opacity: 0, transform: 'scale(0.8)' },
                    { opacity: 1, transform: 'scale(1)' }
                ], { duration: 500, easing: 'ease-out' });
            }
        });
    }

    // Обработчики кнопок с анимациями
    btnStart.addEventListener('click', () => {
        if (!isRunning) {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(updateTimer, 1000);
            isRunning = true;
            
            onlineStatusInterval = setInterval(updateOnlineStatus, 3000);
            updateOnlineStatus();
            
            // Анимация кнопки
            btnStart.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.3)' },
                { transform: 'scale(1)' }
            ], { duration: 600, easing: 'ease-out' });
            
            // Эффект пульсации
            timerContainer.animate([
                { boxShadow: '0 0 10px #4cc9f0' },
                { boxShadow: '0 0 25px #4cc9f0' },
                { boxShadow: '0 0 10px #4cc9f0' }
            ], { duration: 1500, easing: 'ease-in-out' });
        }
    });

    btnPause.addEventListener('click', () => {
        if (isRunning) {
            clearInterval(timerInterval);
            clearInterval(onlineStatusInterval);
            isRunning = false;
            updateOnlineStatus();
            
            // Анимация заморозки
            timeDisplay.animate([
                { textShadow: '0 0 10px rgba(76, 201, 240, 0.8)' },
                { textShadow: '0 0 2px rgba(76, 201, 240, 0.2)' }
            ], { duration: 1000, easing: 'ease-out' });
        }
    });

    btnReset.addEventListener('click', () => {
        clearInterval(timerInterval);
        clearInterval(onlineStatusInterval);
        elapsedTime = 0;
        timeDisplay.textContent = '00:00:00';
        isRunning = false;
        updateOnlineStatus();
        
        // Анимация сброса
        timeDisplay.animate([
            { transform: 'rotate(0deg) scale(1)' },
            { transform: 'rotate(15deg) scale(1.2)' },
            { transform: 'rotate(-15deg) scale(1.2)' },
            { transform: 'rotate(0deg) scale(1)' }
        ], { duration: 800, easing: 'ease-in-out' });
    });

    btnSave.addEventListener('click', () => {
        const saveToTop = confirm('Сохранить в глобальный топ? (OK - да, Отмена - локальное сохранение)');
        if (saveToTop) {
            saveToGlobalTop();
        } else {
            const saveName = prompt('Введите имя сохранения:', `Сессия ${new Date().toLocaleDateString()}`);
            if (saveName) {
                const saves = JSON.parse(localStorage.getItem('drawariaTimeSaves')) || {};
                saves[saveName] = elapsedTime;
                localStorage.setItem('drawariaTimeSaves', JSON.stringify(saves));
                
                // Анимация сохранения
                btnSave.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.2) rotate(10deg)' },
                    { transform: 'scale(1) rotate(0deg)' }
                ], { duration: 600, easing: 'ease-out' });
            }
        }
    });

    btnOnline.addEventListener('click', () => {
        onlineContainer.style.display = onlineContainer.style.display === 'none' ? 'block' : 'none';
        savesContainer.style.display = 'none';
        topContainer.style.display = 'none';
        
        if (onlineContainer.style.display === 'block') {
            updateOnlineList();
        }
    });

    // Обработчики остальных кнопок
    btnLoad.addEventListener('click', () => {
        savesContainer.style.display = savesContainer.style.display === 'none' ? 'block' : 'none';
        topContainer.style.display = 'none';
        onlineContainer.style.display = 'none';
    });

    btnTop.addEventListener('click', () => {
        topContainer.style.display = topContainer.style.display === 'none' ? 'block' : 'none';
        savesContainer.style.display = 'none';
        onlineContainer.style.display = 'none';
    });

    btnClose.addEventListener('click', () => {
        timerContainer.classList.remove('visible');
        setTimeout(() => {
            timerContainer.style.display = 'none';
        }, 500);
    });

    menuButton.addEventListener('click', () => {
        if (timerContainer.style.display === 'none' || !timerContainer.style.display) {
            timerContainer.style.display = 'block';
            setTimeout(() => {
                timerContainer.classList.add('visible');
            }, 10);
        } else {
            timerContainer.classList.remove('visible');
            setTimeout(() => {
                timerContainer.style.display = 'none';
            }, 500);
        }
    });

    // Перетаскивание окна
    let isDragging = false;
    let offsetX, offsetY;

    dragHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - timerContainer.getBoundingClientRect().left;
        offsetY = e.clientY - timerContainer.getBoundingClientRect().top;
        timerContainer.style.cursor = 'grabbing';
        
        timerContainer.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(0.98)' }
        ], { duration: 200, fill: 'forwards' });
    });

    document.addEventListener('mousemove', (e) => {
        if (isRunning) {
            updateOnlineStatus();
        }
        
        if (isDragging) {
            timerContainer.style.left = (e.clientX - offsetX) + 'px';
            timerContainer.style.top = (e.clientY - offsetY) + 'px';
            timerContainer.style.right = 'unset';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            timerContainer.style.cursor = 'default';
            
            timerContainer.animate([
                { transform: 'scale(0.98)' },
                { transform: 'scale(1)' }
            ], { duration: 300, easing: 'ease-out' });
        }
    });

    // Инициализация
    window.addEventListener('load', () => {
        // Создание демо-топа
        if (!localStorage.getItem(TOP_KEY)) {
            const demoTop = [];
            const names = ['Alex', 'Mia', 'Max', 'Luna', 'Leo', 'Zoe', 'Finn', 'Ruby'];
            
            for (let i = 0; i < 15; i++) {
                demoTop.push({
                    id: Math.random().toString(36).substr(2, 9),
                    name: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100),
                    time: 3600000 + Math.floor(Math.random() * 36000000),
                    date: Date.now() - Math.floor(Math.random() * 30 * 24 * 3600000),
                    you: false
                });
            }
            
            demoTop.sort((a, b) => b.time - a.time);
            localStorage.setItem(TOP_KEY, JSON.stringify(demoTop));
        }
        
        // Анимация приветствия
        setTimeout(() => {
            timeDisplay.animate([
                { textShadow: '0 0 5px #4cc9f0' },
                { textShadow: '0 0 30px #4cc9f0' },
                { textShadow: '0 0 5px #4cc9f0' }
            ], { duration: 2500, easing: 'ease-in-out' });
            
            menuButton.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.1)' },
                { transform: 'scale(1)' }
            ], { duration: 2000, iterations: Infinity, easing: 'ease-in-out' });
        }, 1000);
        
        // Периодическое обновление онлайн-статуса
        setInterval(() => {
            if (onlineContainer.style.display === 'block') {
                updateOnlineList();
            }
        }, 5000);
    });
})();