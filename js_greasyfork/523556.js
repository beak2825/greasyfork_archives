// ==UserScript==
// @name         Cryzen.io
// @description  Todos em um: Models, Anti-recoil, ESP, Rewards, Performance
// @version      1.0.2
// @match        https://cryzen.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryzen.io
// @author       _PeDeCoca
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace PeDeCoca
// @downloadURL https://update.greasyfork.org/scripts/523556/Cryzenio.user.js
// @updateURL https://update.greasyfork.org/scripts/523556/Cryzenio.meta.js
// ==/UserScript==

// Utility functions
const { log, debug, warn, error } = console;

// Model visibility enhancement
const srcset = Object.getOwnPropertyDescriptor(Image.prototype, 'src').set;
function getSqareDataURL(width, height, color) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
    return canvas.toDataURL();
}

Object.defineProperty(Image.prototype, 'src', {
    set(value) {
        this._src = value;
        if (typeof value != 'string') return srcset.call(this, value);
        if (value.includes('colorMap')) {
            if (value.toLowerCase().includes('red')) {
                value = getSqareDataURL(1000, 1000, '#FF7373');
            } else if (value.toLowerCase().includes('blue')) {
                value = getSqareDataURL(1000, 1000, '#00FFFF');
            } else {
                value = getSqareDataURL(1000, 1000, '#73FF73');
            }
        }
        if (value.includes('map-')) {
            value = getSqareDataURL(4096, 2048, '#AAAAAA');
        }
        srcset.call(this, value);
    },
    get() { return this._src; }
});

// No spread and anti-recoil
const _random = Math.random;
Object.defineProperty(Math, 'random', {
    set(value) { _random = value; },
    get() {
        try {
            throw new Error();
        } catch (error) {
            if (error.stack.includes('shoot')) return _=>.5;
        }
        return _random;
    }
});

// Player ESP with wireframe
Object.defineProperty(Object.prototype, 'material', {
    get() { return this._material; },
    set(v) {
        if (this.type === 'SkinnedMesh' && this?.skeleton) {
            Object.defineProperties(v, {
                'depthTest': {
                    get() { return false; },
                    set(v) {},
                },
                'transparent': {
                    get() { return true; },
                    set(v) {},
                }
            });
            v.wireframe = true;
            v.opacity = 1;
        }
        this._material = v;
    }
});

// Add tracking system
function setupModelTracking() {
    const playerTracker = {
        enabled: false,
        players: new Set(),
        nearestPlayer: null,
        highlightColor: new Color(1, 0, 0) // vermelho
    };

    // Observer para detectar jogadores
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.classList?.contains('player-model')) {
                    playerTracker.players.add(node);
                }
            });
        });
    });

    // Adicionar toggle no menu
    function addTrackingToggle() {
        const container = document.querySelector('.toggle-container');
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" id="toggle-tracking"> Target Track
        `;
        container.appendChild(label);

        document.getElementById('toggle-tracking').onchange = (e) => {
            playerTracker.enabled = e.target.checked;
            if (!e.target.checked) {
                // Limpar highlights quando desativado
                playerTracker.players.forEach(player => {
                    if (player?.material) {
                        player.material.emissive = new Color(0, 0, 0);
                    }
                });
            }
        };
    }

    // Update loop melhorado
    function trackerLoop() {
        if (!playerTracker.enabled) return;

        const center = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        let closest = null;
        let minDistance = Infinity;

        // Limpar highlight anterior
        if (playerTracker.nearestPlayer?.material) {
            playerTracker.nearestPlayer.material.emissive = new Color(0, 0, 0);
        }

        // Encontrar jogador mais próximo
        document.querySelectorAll('.player-model').forEach(player => {
            if (!player.isConnected) return;

            const rect = player.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            const distance = Math.hypot(
                center.x - (rect.left + rect.width / 2),
                center.y - (rect.top + rect.height / 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                closest = player;
            }
        });

        // Destacar novo alvo
        if (closest?.material) {
            closest.material.emissive = playerTracker.highlightColor;
            playerTracker.nearestPlayer = closest;

            if (config.debug) {
                console.log('[Target Track] Found:', {
                    distance: minDistance,
                    element: closest
                });
            }
        }

        requestAnimationFrame(trackerLoop);
    }

    // Inicializar
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    addTrackingToggle();
    trackerLoop();

    return playerTracker;
}

// Free rewards system
function skipRewardedBreak() {
    return new Promise(resolve => resolve(true));
}

Object.defineProperties(Object.prototype, {
    'rewardedBreak': {
        get() { return skipRewardedBreak.bind(this); },
        set() {},
        enumerable: false,
    },
    'gameanalytics': {
        get() {
            return {
                GameAnalytics: {
                    addAdEvent: () => {},
                }
                // ...existing gameanalytics mock...
            };
        },
        set(v) {},
        enumerable: false,
    }
});

// Enhanced menu system
(function() {
    // Add config object with blocked domains
    const config = {
        active: true,
        autoReward: true,
        debug: true,
        noSpread: true, // Ativo por padrão
        esp: true, // Ativo por padrão
        blockedDomains: new Set([
            'poki.com',
            'poki-gdn.com',
            'google-analytics.com',
            'doubleclick.net',
            'adservice.google.com',
            'analytics.google.com',
            'pagead2.googlesyndication.com',
            'googleads.g.doubleclick.net',
            'partner.googleadservices.com',
            'tpc.googlesyndication.com',
            'google.com/pagead',
            'google.com/adsense',
            'advertising.com',
            'adnxs.com',
            'adsense.google.com'
        ])
    };

    // Add ad blocking functions
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        try {
            const url = new URL(args[0]);
            if (config.blockedDomains.has(url.hostname)) {
                if (config.debug) console.log('[AdBlock] Blocked fetch:', url.hostname);
                return new Response('', { status: 200 });
            }
        } catch {}
        return originalFetch.apply(this, arguments);
    };

    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        xhr.open = function(method, url) {
            try {
                const urlObj = new URL(url);
                if (config.blockedDomains.has(urlObj.hostname)) {
                    if (config.debug) console.log('[AdBlock] Blocked XHR:', urlObj.hostname);
                    return;
                }
            } catch {}
            return originalOpen.apply(this, arguments);
        };
        return xhr;
    };

    // Block ads on document level
    function removeAdsElements() {
        const adSelectors = [
            'ins.adsbygoogle',
            'div[id*="google_ads"]',
            'div[id*="advertisement"]',
            'div[class*="ad-"]',
            'div[class*="ads-"]',
            'iframe[src*="googlead"]',
            'iframe[src*="doubleclick"]',
            'div[aria-label*="Advertisement"]'
        ];

        const observer = new MutationObserver((mutations) => {
            for (const selector of adSelectors) {
                document.querySelectorAll(selector).forEach(ad => {
                    ad.remove();
                    if (config.debug) console.log('[AdBlock] Removed ad element:', selector);
                });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Override window.open to block popup ads
    const originalWindowOpen = window.open;
    window.open = function(url, ...args) {
        try {
            const urlObj = new URL(url);
            if (config.blockedDomains.has(urlObj.hostname)) {
                if (config.debug) console.log('[AdBlock] Blocked popup:', url);
                return null;
            }
        } catch {}
        return originalWindowOpen.apply(this, arguments);
    };

    const styles = `
        #hack-menu {
            position: fixed;
            top: 50px;
            left: 10px;
            background: rgba(0,0,0,0.8);
            color: #00ff00;
            padding: 15px;
            border-radius: 10px;
            z-index: 9999;
            width: 200px;
            font-family: Arial, sans-serif;
            border: 2px solid #00ff00;
            cursor: move;
            animation: rainbow 2s infinite;
            user-select: none;
        }
        #hack-menu h3 {
            text-align: center;
            margin-bottom: 10px;
            color: #00ff00;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }
        .minimize-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            color: #00ff00;
            cursor: pointer;
            font-size: 16px;
            padding: 5px;
        }
        .toggle-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 15px 0;
        }
        .toggle-container label {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #00ff00;
            cursor: pointer;
        }
        .button-container {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .control-btn {
            background-color: #333;
            border: 1px solid #00ff00;
            color: #00ff00;
            padding: 8px;
            cursor: pointer;
            border-radius: 5px;
            width: 100%;
        }
        .control-btn:hover {
            background-color: #444;
        }
        @keyframes rainbow {
            0% { border-color: red; }
            33% { border-color: #00ff00; }
            66% { border-color: blue; }
            100% { border-color: red; }
        }
        .floating-icon {
            position: fixed;
            top: 50px;
            left: 10px;
            width: 40px;
            height: 40px;
            background: rgba(0,0,0,0);
            border-radius: 50%;
            display: none;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 9999;
            border: 2px solid #00ff00;
            animation: rainbow 2s infinite;
        }
        .discord-icon {
            width: 50px;
            height: 50px;
            margin-left: 10px;
            transition: transform 0.2s;
        }
        .discord-icon:hover {
            transform: scale(1.2);
        }
    `;

    function createMenu() {
        const menu = document.createElement('div');
        menu.id = 'hack-menu';
        menu.innerHTML = `
            <button class="minimize-btn">−</button>
            <h3>
                <span>_PeDeCoca</span>
                <a href="https://discord.gg/RWjQcR6f5T" target="_blank">
                    <img src="https://img.icons8.com/?size=100&id=61604&format=png&color=000000" alt="Discord" class="discord-icon">
                </a>
            </h3>

            <div class="toggle-container">
                <label>
                    <input type="checkbox" id="toggle-esp" checked> ESP Vision
                </label>
                <label>
                    <input type="checkbox" id="toggle-nospread" checked> No Spread
                </label>
                <label>
                    <input type="checkbox" id="toggle-rewards" checked> Auto Rewards
                </label>
            </div>

            <div class="button-container">
                <button class="control-btn" id="quality-high">High Graphics</button>
                <button class="control-btn" id="quality-medium">Medium Graphics</button>
                <button class="control-btn" id="quality-low">Low Graphics</button>
            </div>

            <button id="reset-all" class="control-btn" style="margin-top: 15px">Reset All</button>
        `;

        const floatingIcon = document.createElement('div');
        floatingIcon.className = 'floating-icon';
        floatingIcon.innerHTML = '👹';

        document.body.appendChild(menu);
        document.body.appendChild(floatingIcon);

        setupControls();
        makeMenuDraggable(menu, floatingIcon);
    }

    // Add graphics quality functions
    function setGraphicsQuality(quality) {
        switch(quality) {
            case 'High':
                resetGraphics();
                break;
            case 'Medium':
                applyMediumGraphics();
                break;
            case 'Low':
                applyLowGraphics();
                break;
        }
    }

    function resetGraphics() {
        document.querySelectorAll('.map-element').forEach(element => {
            element.style.removeProperty('backgroundColor');
            element.style.removeProperty('opacity');
            element.style.removeProperty('border');
        });
        // Reset skybox and other elements
        const skybox = document.querySelector('.skybox');
        if (skybox) skybox.style.display = 'block';
    }

    function applyMediumGraphics() {
        document.querySelectorAll('.map-element').forEach(element => {
            element.style.opacity = '0.8';
            element.style.backgroundColor = '#444';
        });
    }

    function applyLowGraphics() {
        // Remove skybox
        const skybox = document.querySelector('.skybox');
        if (skybox) skybox.style.display = 'none';

        // Simplify map elements
        document.querySelectorAll('.map-element').forEach(element => {
            element.style.backgroundColor = 'gray';
            element.style.opacity = '0.5';
            element.style.border = 'none';
        });
    }

    // Remover antigas tentativas de controle de cor e opacidade no setupControls
    function setupControls() {
        document.getElementById('toggle-esp').onchange = (e) => {
            const enabled = e.target.checked;
            // Toggle ESP visibility with wireframe
            document.querySelectorAll('.player-model').forEach(player => {
                if (player?.material) {
                    player.material.depthTest = !enabled;
                    player.material.transparent = enabled;
                    player.material.wireframe = enabled;
                    player.material.opacity = 1;
                }
            });
        };

        document.getElementById('toggle-nospread').onchange = (e) => {
            // Toggle no spread functionality
            config.noSpread = e.target.checked;
        };

        document.getElementById('toggle-rewards').onchange = (e) => {
            config.autoReward = e.target.checked;
        };

        // Graphics quality buttons
        document.getElementById('quality-high').onclick = () => setGraphicsQuality('High');
        document.getElementById('quality-medium').onclick = () => setGraphicsQuality('Medium');
        document.getElementById('quality-low').onclick = () => setGraphicsQuality('Low');

        // Reset button with proper graphics reset
        document.getElementById('reset-all').onclick = () => {
            // Reset all toggles
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

            // Reset configurations
            config.autoReward = false;
            config.noSpread = false;

            // Reset graphics to high quality
            setGraphicsQuality('High');

            // Additional resets if needed
            resetGraphics();
        };

        // Minimize button
        const menu = document.getElementById('hack-menu');
        const floatingIcon = document.querySelector('.floating-icon');
        const minimizeBtn = menu.querySelector('.minimize-btn');

        minimizeBtn.onclick = () => {
            menu.style.display = 'none';
            floatingIcon.style.display = 'flex';
        };

        floatingIcon.onclick = () => {
            menu.style.display = 'block';
            floatingIcon.style.display = 'none';
        };
    }

    function makeMenuDraggable(menu, floatingIcon) {
        [menu, floatingIcon].forEach(element => {
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;

            element.addEventListener('mousedown', (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;

                isDragging = true;
                initialX = e.clientX - element.offsetLeft;
                initialY = e.clientY - element.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                element.style.left = `${currentX}px`;
                element.style.top = `${currentY}px`;
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        });
    }

    // Initialize everything
    function initialize() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles + `
            .adsbygoogle { display: none !important; }
            [class*="advertisement"] { display: none !important; }
            [id*="google_ads"] { display: none !important; }
        `;
        document.head.appendChild(styleSheet);

        createMenu();
        removeAdsElements();

        // Inicializar tudo em ordem correta
        window.playerTracker = setupModelTracking();

        // Ativar todas as funcionalidades por padrão
        setTimeout(() => {
            // Ativar ESP
            document.querySelectorAll('.player-model').forEach(player => {
                if (player?.material) {
                    player.material.depthTest = false;
                    player.material.transparent = true;
                }
            });

            // Ativar No Spread
            config.noSpread = true;

            // Ativar Auto Rewards
            config.autoReward = true;

            // Aplicar qualidade gráfica baixa por padrão
            setGraphicsQuality('Low');
        }, 1000); // Pequeno delay para garantir que tudo foi carregado

        // Adicionar sistema de tracking
        setupModelTracking();

        // Inicializar tracking system
        const playerTracker = setupModelTracking();
        window.playerTracker = playerTracker; // Para debug
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();

// ...rest of existing code...

