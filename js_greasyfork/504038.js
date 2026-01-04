// ==UserScript==
// @name         Little Big Snake  Menu - Vip
// @namespace    http://tampermonkey.net/
// @version      2024-10-27
// @description  Menú personalizado mejorado con zoom en juego, efectos de rayos, anti-lag y tema Halloween
// @author       You
// @match        https://littlebigsnake.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/504038/Little%20Big%20Snake%20%20Menu%20-%20Vip.user.js
// @updateURL https://update.greasyfork.org/scripts/504038/Little%20Big%20Snake%20%20Menu%20-%20Vip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname !== 'littlebigsnake.com') return;

    // Variables globales
    let autoEmojiInterval = null;
    let autoEmojiBackupInterval = null;
    let currentEmojiNumber = 1;
    let isAutoEmojiActive = false;
    let lastZoomUpdate = Date.now();
    let lagReducerInterval = null;

    // Keyframes para la animación de rayos
    const lightningKeyframes = `
        @keyframes lightning {
            0% {
                background-position: 0% 0%;
                opacity: 0.3;
            }
            48% {
                background-position: 0% 0%;
                opacity: 0.3;
            }
            50% {
                background-position: 100% 100%;
                opacity: 1;
            }
            52% {
                background-position: 0% 0%;
                opacity: 0.3;
            }
            100% {
                background-position: 0% 0%;
                opacity: 0.3;
            }
        }
        
        @keyframes menuFloat {
            0% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
            100% {
                transform: translateY(0px);
            }
        }
    `;

    // Estilos mejorados con tema Halloween y rayos
    const styles = lightningKeyframes + `
        .custom-menu {
            position: fixed;
            top: 20px;
            left: 0;
            width: 300px;
            height: auto;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(44, 24, 16, 0.95));
            color: #ff9800;
            border: 5px solid #ff6b00;
            z-index: 9999;
            padding: 20px;
            box-shadow: 0 0 20px rgba(255, 107, 0, 0.7);
            border-radius: 15px;
            backdrop-filter: blur(5px);
            transform: translateX(-100%);
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .custom-menu::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, 
                transparent 0%, 
                rgba(255, 107, 0, 0.1) 45%, 
                rgba(255, 107, 0, 0.4) 50%, 
                rgba(255, 107, 0, 0.1) 55%, 
                transparent 100%);
            background-size: 400% 400%;
            animation: lightning 5s infinite;
            pointer-events: none;
            border-radius: 10px;
        }

        .menu-title {
            text-align: center;
            margin-bottom: 20px;
            color: #ff6b00;
            font-size: 24px;
            text-shadow: 0 0 10px #ff6b00,
                         0 0 20px #ff6b00,
                         0 0 30px #ff6b00;
            font-family: "Creepster", cursive;
            animation: textGlow 2s infinite alternate;
        }

        @keyframes textGlow {
            from {
                text-shadow: 0 0 10px #ff6b00, 0 0 20px #ff6b00;
            }
            to {
                text-shadow: 0 0 15px #ff6b00, 0 0 25px #ff6b00, 0 0 35px #ff6b00;
            }
        }

        .option {
            margin: 15px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: rgba(255, 107, 0, 0.1);
            border-radius: 10px;
            border: 1px solid #ff6b00;
            transition: all 0.3s ease;
        }

        .option:hover {
            background: rgba(255, 107, 0, 0.2);
            transform: translateX(5px);
            box-shadow: 0 0 15px rgba(255, 107, 0, 0.3);
        }

        .option span {
            font-size: 16px;
            font-weight: 500;
            text-shadow: 0 0 5px #ff6b00;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #2c1810;
            transition: .4s;
            border-radius: 34px;
            overflow: hidden;
        }.slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: #ff9800;
            transition: .4s;
            border-radius: 50%;
            box-shadow: 0 0 10px #ff6b00;
        }

        input:checked + .slider {
            background-color: #ff6b00;
        }

        input:checked + .slider:before {
            transform: translateX(26px);
            background-color: #2c1810;
        }

        .zoom-slider {
            width: 100%;
            height: 10px;
            border-radius: 5px;
            background: #2c1810;
            outline: none;
            -webkit-appearance: none;
            box-shadow: inset 0 0 5px #ff6b00;
        }

        .zoom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #ff6b00;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 10px #ff6b00;
        }

        .zoom-slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 0 15px #ff6b00;
        }

        .menu-toggle-btn {
            position: fixed;
            top: 20px;
            left: 310px;
            z-index: 10000;
            padding: 12px 20px;
            border-radius: 10px;
            background-color: #ff6b00;
            color: #2c1810;
            border: none;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 0 15px #ff6b00;
            transition: all 0.3s ease;
            animation: menuFloat 3s ease-in-out infinite;
        }

        .menu-toggle-btn:hover {
            background-color: #ff9800;
            transform: scale(1.05);
        }

        .emoji-speed {
            width: 100px;
            padding: 5px;
            border-radius: 5px;
            border: 1px solid #ff6b00;
            background: #2c1810;
            color: #ff9800;
            transition: all 0.3s ease;
        }

        .emoji-speed:hover {
            border-color: #ff9800;
            box-shadow: 0 0 10px #ff6b00;
        }

        .game-container {
            transform-origin: center center;
            transition: transform 0.3s ease;
        }
    `;

    // Sistema de zoom mejorado que solo afecta al juego
    function updateZoom(value) {
        const now = Date.now();
        if (now - lastZoomUpdate > 16) { // Limitar a ~60fps
            const zoomValue = value / 100;
            const gameContainer = document.querySelector('#game-container, #gameContainer, .game-container');
            if (gameContainer) {
                gameContainer.style.transform = `scale(${zoomValue})`;
                gameContainer.style.transformOrigin = 'center center';
            }
            lastZoomUpdate = now;
        }
    }

    // Sistema de auto-emoji mejorado
    function setupAutoEmoji(speed) {
        if (autoEmojiInterval) clearInterval(autoEmojiInterval);
        if (autoEmojiBackupInterval) clearInterval(autoEmojiBackupInterval);

        autoEmojiInterval = setInterval(() => {
            const emojiButton = document.querySelector('.emoji-button, [class*="emoji"]');
            if (emojiButton) {
                emojiButton.click();
                currentEmojiNumber = (currentEmojiNumber % 8) + 1;
                setTimeout(() => {
                    const emojiSelector = document.querySelector(`[data-emoji="${currentEmojiNumber}"]`);
                    if (emojiSelector) emojiSelector.click();
                }, 50);
            }
        }, speed);

        // Sistema de respaldo para asegurar funcionamiento
        autoEmojiBackupInterval = setInterval(() => {
            const event = new KeyboardEvent('keypress', {
                key: 'e',
                code: 'KeyE',
                which: 69,
                keyCode: 69,
                bubbles: true
            });
            document.dispatchEvent(event);
        }, speed + 100);
    }

    // Función de inicialización del menú
    function initialize() {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Agregar el menú al DOM
        document.body.insertAdjacentHTML('beforeend', `
            <div id="custom-menu" class="custom-menu">
                <h2 class="menu-title">🎃 Opciones de Juego 🎃</h2>
                <div class="option">
                    <span>🔍 Zoom</span>
                    <div style="width: 150px;">
                        <input type="range" id="zoomSlider" class="zoom-slider" min="50" max="150" value="100">
                        <div id="zoomValue" style="color: #ff9800; text-align: center;">100%</div>
                    </div>
                </div>
                <div class="option">
                    <span>😀 Auto Emoji</span>
                    <label class="switch">
                        <input type="checkbox" id="autoEmojiToggle">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="option">
                    <span>⚡ Velocidad Emoji</span>
                    <select id="emojiSpeed" class="emoji-speed">
                        <option value="500">Rápido</option>
                        <option value="1000">Normal</option>
                        <option value="2000">Lento</option>
                    </select>
                </div>
                <div class="option">
                    <span>🚀 Anti-Lag</span>
                    <label class="switch">
                        <input type="checkbox" id="lagReducerToggle">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="option">
                    <span>🌈 Borde RGB</span>
                    <label class="switch">
                        <input type="checkbox" id="rgbBorderToggle">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            <button id="menuToggle" class="menu-toggle-btn">🎮 Menú</button>
        `);

        // Event Listeners
        document.getElementById('menuToggle').addEventListener('click', function() {
            const menu = document.getElementById('custom-menu');
            const isHidden = menu.style.transform === 'translateX(-100%)' || !menu.style.transform;
            menu.style.transform = isHidden ? 'translateX(0)' : 'translateX(-100%)';
        });

        document.getElementById('zoomSlider').addEventListener('input', function() {
            const value = this.value;
            document.getElementById('zoomValue').textContent = value + '%';
            updateZoom(value);
        });

        document.getElementById('autoEmojiToggle').addEventListener('change', function() {
            if (this.checked) {
                const speed = parseInt(document.getElementById('emojiSpeed').value);
                setupAutoEmoji(speed);
            } else {
                if (autoEmojiInterval) clearInterval(autoEmojiInterval);
                if (autoEmojiBackupInterval) clearInterval(autoEmojiBackupInterval);
            }
        });

        document.getElementById('emojiSpeed').addEventListener('change', function() {
            if (document.getElementById('autoEmojiToggle').checked) {
                setupAutoEmoji(parseInt(this.value));
            }
        });

        document.getElementById('lagReducerToggle').addEventListener('change', function() {
            setupLagReducer(this.checked);
        });

        document.getElementById('rgbBorderToggle').addEventListener('change', function() {
            const menu = document.getElementById('custom-menu');
            if (this.checked) {
                let hue = 0;
                setInterval(() => {
                    hue = (hue + 1) % 360;
                    menu.style.border = `5px solid hsl(${hue}, 100%, 50%)`;
                }, 50);
            } else {
                menu.style.border = '5px solid #ff6b00';
            }
        });
    }

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();