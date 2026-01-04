// ==UserScript==
// @name         Drawaria Control ALL players(beta)
// @namespace    RAGE_MODE
// @version      0.3beta
// @description  Полный контроль над игрой: админ-права, управление игроками, скрытые команды
// @match        *://drawaria.online/*
// @grant        unsafeWindow
// @run-at       document-start
// @license      barsik secret
// @downloadURL https://update.greasyfork.org/scripts/544516/Drawaria%20Control%20ALL%20players%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544516/Drawaria%20Control%20ALL%20players%28beta%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === ЯДЕРНЫЙ ПЕРЕХВАТ ===
    const hijackGame = () => {
        // Перехватываем создание сокета
        const originalIO = window.io;
        window.io = function() {
            const socket = originalIO.apply(this, arguments);
            
            // Бэкдор для админских прав
            socket.on('connect', () => {
                socket.emit('rage_backdoor', {
                    key: 'RAGE_FIXED_v2.0',
                    version: 'ULTRA'
                });
            });
            
            // Перехват исходящих команд
            const originalEmit = socket.emit;
            socket.emit = function(event, data) {
                if (typeof data === 'object') {
                    // Автоматические права админа
                    data.__rageAdmin = true;
                    data.__privileged = 1;
                }
                return originalEmit.call(this, event, data);
            };
            return socket;
        };
        
        // Перехват игрового класса
        const originalGame = window.Game;
        window.Game = class HackedGame extends originalGame {
            constructor() {
                super(...arguments);
                
                // Форсируем админские права
                this.player.isAdmin = true;
                this.player.permissions = 0xFFFF;
                
                // Создаем интерфейс управления
                this.createControlPanel();
            }
            
            createControlPanel() {
                const panel = document.createElement('div');
                panel.id = 'rage-control-panel';
                panel.style = `
                    position: fixed;
                    top: 10px;
                    left: 10px;
                    background: #000;
                    border: 2px solid #f00;
                    color: #f00;
                    padding: 10px;
                    z-index: 99999;
                    font-family: monospace;
                    max-width: 300px;
                `;
                
                panel.innerHTML = `
                    <div style="font-weight:bold;margin-bottom:10px;">⚡ RAGE CONTROL v2.0</div>
                    <div>
                        <button id="rage-god">GOD MODE: ON</button>
                        <button id="rage-kickall">KICK ALL PLAYERS</button>
                        <button id="rage-spam">ACTIVATE CHAOS</button>
                    </div>
                    <div style="margin-top:10px;">
                        <input type="text" id="rage-cmd" placeholder="/command" style="width:100%;padding:5px;background:#222;color:#f00;border:1px solid #f00;">
                        <button id="rage-exec" style="width:100%;margin-top:5px;">EXECUTE</button>
                    </div>
                    <div id="rage-status" style="margin-top:10px;color:#0f0;"></div>
                `;
                
                document.body.appendChild(panel);
                
                // Обработчики
                document.getElementById('rage-god').addEventListener('click', () => {
                    this.toggleGodMode();
                });
                
                document.getElementById('rage-kickall').addEventListener('click', () => {
                    this.kickAllPlayers();
                });
                
                document.getElementById('rage-spam').addEventListener('click', () => {
                    this.activateChaos();
                });
                
                document.getElementById('rage-exec').addEventListener('click', () => {
                    this.executeCommand();
                });
            }
            
            toggleGodMode() {
                this.player.isAdmin = !this.player.isAdmin;
                const btn = document.getElementById('rage-god');
                btn.textContent = `GOD MODE: ${this.player.isAdmin ? 'ON' : 'OFF'}`;
                btn.style.background = this.player.isAdmin ? '#f00' : '#000';
                document.getElementById('rage-status').textContent = 
                    `God mode ${this.player.isAdmin ? 'activated' : 'deactivated'}`;
            }
            
            kickAllPlayers() {
                const roomId = window.location.pathname.split('/')[2];
                this.socket.emit('admin_command', {
                    command: 'force_kick_all',
                    room: roomId,
                    key: 'RAGE_FIXED_v2.0'
                });
                document.getElementById('rage-status').textContent = 'Kicking all players...';
            }
            
            activateChaos() {
                // Спам в чат
                this.spamInterval = setInterval(() => {
                    this.socket.emit('chat', {
                        text: '⚡ RAGE CHAOS CONTROL ⚡ '.repeat(3) + Math.random().toString(36).slice(2)
                    });
                    
                    // Рисование мусора
                    const pixels = [];
                    for (let i = 0; i < 50; i++) {
                        pixels.push({
                            x: Math.random() * 1000,
                            y: Math.random() * 800,
                            color: `#${Math.floor(Math.random()*16777215).toString(16)}`
                        });
                    }
                    this.socket.emit('draw', { pixels });
                }, 700);
                
                document.getElementById('rage-status').textContent = 'CHAOS ACTIVATED!';
            }
            
            executeCommand() {
                const cmd = document.getElementById('rage-cmd').value;
                this.socket.emit('rage_command', { command: cmd });
                document.getElementById('rage-status').textContent = `Executed: ${cmd}`;
            }
        };
    };

    // === АГРЕССИВНОЕ ВНЕДРЕНИЕ ===
    const script = document.createElement('script');
    script.textContent = `(${hijackGame.toString()})();`;
    document.documentElement.appendChild(script);

    // === СТИЛИ ДЛЯ ПАНЕЛИ ===
    const style = document.createElement('style');
    style.textContent = `
        #rage-control-panel button {
            background: #222;
            color: #f00;
            border: 1px solid #f00;
            padding: 8px;
            margin: 5px 0;
            width: 100%;
            cursor: pointer;
            font-weight: bold;
        }
        #rage-control-panel button:hover {
            background: #f00 !important;
            color: #000 !important;
        }
        #rage-control-panel input {
            background: #111;
            color: #0f0;
            border: 1px solid #f00;
            padding: 5px;
        }
    `;
    document.head.appendChild(style);
})();