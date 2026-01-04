// ==UserScript==
// @name        Bloqueador Navideño XP
// @namespace   Violentmonkey Scripts
// @match       https://wormax.io/
// @grant       none
// @version     1.0
// @author      -
// @description Bloqueador de anuncios estilo Windows XP con efectos navideños
// @downloadURL https://update.greasyfork.org/scripts/523421/Bloqueador%20Navide%C3%B1o%20XP.user.js
// @updateURL https://update.greasyfork.org/scripts/523421/Bloqueador%20Navide%C3%B1o%20XP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Insertar estilos CSS
    const styles = `
    .xp-button {
        position: fixed;
        top: 10px;
        left: 10px;
        padding: 5px 10px;
        background: linear-gradient(to bottom, #2580c6 0%, #1958a3 45%, #1856a3 50%, #195ca7 95%, #1958a3 100%);
        border: 1px solid #4a0c85;
        border-radius: 4px;
        color: white;
        font-size: 12px;
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 5px;
        z-index: 999999;
    }

    .xp-panel {
        position: fixed;
        top: 45px;
        left: 10px;
        width: 300px;
        background: #ECE9D8;
        border: 1px solid #0f3d7c;
        border-radius: 3px;
        box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
        display: none;
        padding: 10px;
        z-index: 999999;
    }

    .xp-panel.active {
        display: block;
    }

    .snow-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 999998;
    }

    .snowman {
        position: absolute;
        font-size: 40px;
        animation: waddle 20s linear infinite;
        z-index: 999998;
    }

    @keyframes waddle {
        0% {
            transform: translateX(-50px) rotate(-5deg);
        }
        25% {
            transform: translateX(calc(50vw - 25px)) rotate(5deg);
        }
        50% {
            transform: translateX(calc(100vw + 50px)) rotate(-5deg);
        }
        51% {
            transform: translateX(calc(100vw + 50px)) rotate(-5deg) scaleX(-1);
        }
        75% {
            transform: translateX(calc(50vw - 25px)) rotate(5deg) scaleX(-1);
        }
        100% {
            transform: translateX(-50px) rotate(-5deg) scaleX(-1);
        }
    }

    .snowflake {
        color: #fff;
        font-size: 1em;
        position: absolute;
        top: -10px;
        animation: fall linear forwards;
        text-shadow: 0 0 3px rgba(0,0,0,0.3);
    }

    @keyframes fall {
        to {
            transform: translateY(100vh);
        }
    }

    .xp-header {
        background: linear-gradient(to right, #0058b3 0%, #2680eb 100%);
        color: white;
        padding: 5px;
        margin: -10px -10px 10px -10px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .option-button {
        width: 100%;
        padding: 8px;
        margin: 5px 0;
        background: linear-gradient(to bottom, #ffffff 0%, #e1e1e1 100%);
        border: 1px solid #999;
        border-radius: 3px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .status {
        font-size: 11px;
        color: #666;
        margin-top: 10px;
        padding: 5px;
        background: #fff;
        border: 1px solid #ccc;
    }

    .close-button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
    }
    `;

    // Insertar HTML
    const html = `
    <button class="xp-button">
        <span>🖥️ Menu XP Come1</span>
    </button>

    <div class="xp-panel">
        <div class="xp-header">
            <span>Bloqueador Navideño</span>
            <button class="close-button">×</button>
        </div>
        <button class="option-button" id="toggle-blocker">
            <span>🎅 Activar/Desactivar Bloqueador</span>
        </button>
        <button class="option-button" id="toggle-snow">
            <span>❄️ Activar/Desactivar Nieve</span>
        </button>
        <button class="option-button" id="toggle-snowmen">
            <span>⛄ Activar/Desactivar Muñecos</span>
        </button>
        <div class="status">Estado: Desactivado ⭐</div>
    </div>

    <div class="snow-container"></div>
    `;

    // Agregar estilos y HTML al documento
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    // Clase del bloqueador
    class ChristmasAdBlocker {
        constructor() {
            this.adSelectors = [
                '.advertisement',
                '.ad-container',
                '.banner-ads',
                '.google-ads',
                '[id*="google_ads"]',
                '[id*="banner-ad"]',
                '[class*="adsbox"]',
                '[class*="ad-box"]'
            ];
            this.isEnabled = false;
            this.snowEnabled = false;
            this.snowmenEnabled = false;
        }

        enable() {
            if (!this.isEnabled) {
                this.isEnabled = true;
                this.hideAds();
                this.startObserver();
                document.querySelector('.status').textContent = 'Estado: Activado 🎄';
            }
        }

        disable() {
            if (this.isEnabled) {
                this.isEnabled = false;
                this.showAds();
                if (this.observer) {
                    this.observer.disconnect();
                }
                document.querySelector('.status').textContent = 'Estado: Desactivado ⭐';
            }
        }

        hideAds() {
            const selector = this.adSelectors.join(', ');
            const ads = document.querySelectorAll(selector);
            ads.forEach(ad => ad.style.display = 'none');
        }

        showAds() {
            const selector = this.adSelectors.join(', ');
            const ads = document.querySelectorAll(selector);
            ads.forEach(ad => ad.style.display = '');
        }

        startObserver() {
            this.observer = new MutationObserver(() => {
                if (this.isEnabled) {
                    this.hideAds();
                }
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // Funciones para efectos visuales
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.innerHTML = '❄';
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
        snowflake.style.opacity = Math.random();
        snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';

        document.querySelector('.snow-container').appendChild(snowflake);

        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
        });
    }

    function createSnowman() {
        const snowman = document.createElement('div');
        snowman.classList.add('snowman');
        snowman.innerHTML = '⛄';
        snowman.style.bottom = Math.random() * 20 + 10 + 'px';
        snowman.style.animationDelay = -Math.random() * 20 + 's';

        document.querySelector('.snow-container').appendChild(snowman);
    }

    // Inicializar
    const adBlocker = new ChristmasAdBlocker();
    let snowInterval;
    let snowmenInterval;

    // Event listeners
    document.querySelector('.xp-button').addEventListener('click', () => {
        document.querySelector('.xp-panel').classList.toggle('active');
    });

    document.querySelector('.close-button').addEventListener('click', () => {
        document.querySelector('.xp-panel').classList.remove('active');
    });

    document.getElementById('toggle-blocker').addEventListener('click', () => {
        if (adBlocker.isEnabled) {
            adBlocker.disable();
        } else {
            adBlocker.enable();
        }
    });

    document.getElementById('toggle-snow').addEventListener('click', () => {
        if (adBlocker.snowEnabled) {
            clearInterval(snowInterval);
            document.querySelectorAll('.snowflake').forEach(el => el.remove());
            adBlocker.snowEnabled = false;
        } else {
            snowInterval = setInterval(createSnowflake, 100);
            adBlocker.snowEnabled = true;
        }
    });

    document.getElementById('toggle-snowmen').addEventListener('click', () => {
        if (adBlocker.snowmenEnabled) {
            clearInterval(snowmenInterval);
            document.querySelectorAll('.snowman').forEach(el => el.remove());
            adBlocker.snowmenEnabled = false;
        } else {
            // Crear 5 muñecos de nieve iniciales
            for (let i = 0; i < 5; i++) {
                createSnowman();
            }
            // Agregar nuevo muñeco cada 30 segundos hasta un máximo de 8
            snowmenInterval = setInterval(() => {
                if (document.querySelectorAll('.snowman').length < 8) {
                    createSnowman();
                }
            }, 30000);
            adBlocker.snowmenEnabled = true;
        }
    });
})();