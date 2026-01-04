// ==UserScript==
// @name         bloxd.io Hack v3
// @namespace    http://tampermonkey.net/
// @version      v3
// @description  Hack completo para Sword Masters.io (Speed + Ad Block)
// @author       Discord >> pedecoca
// @match        https://bloxd.io/
// @icon         https://bloxd.io/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530484/bloxdio%20Hack%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/530484/bloxdio%20Hack%20v3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        active: true,
        autoReward: true,
        debug: true,
        speedMultiplier: 1,
        attackMultiplier: 1,
        intervalMultiplier: 1,
        timeoutMultiplier: 1,
        blockedDomains: new Set([
            'poki.com',
            'poki-gdn.com',
            'google-analytics.com',
            'doubleclick.net',
            'adservice.google.com',
            'analytics.google.com'
        ])
    };

    function setupAntiKnockbackMonitor() {
        setInterval(() => {
            if (antiKnockback) {
                const script = document.createElement('script');
                script.textContent = `
                    if (window.pc?.app) {
                        const playerEntity = pc.app.root.findByName('Player');
                        if (playerEntity && !window.antiKnockbackEnabled) {
                            console.log('[Hack] Reapplying Anti Knockback after respawn');
                            window.antiKnockbackEnabled = true;
                        }
                    }
                `;
                document.documentElement.appendChild(script);
                script.remove();
            }
        }, 5000);
    }


    let speedMultiplierDate = 1;
    let intervalMultiplier = 1;
    let timeoutMultiplier = 1;
    const originalDateNow = Date.now;
    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;
    let baseTime = originalDateNow();

    let antiKnockback = true;

    function updateSpeedDate() {
        Date.now = () => {
            const currentTime = originalDateNow();
            return baseTime + (currentTime - baseTime) * speedMultiplierDate;
        };
    }


    function updateIntervalSpeed() {
        window.setInterval = (callback, delay, ...args) => {
            const adjustedDelay = delay / config.intervalMultiplier;
            return originalSetInterval(callback, adjustedDelay, ...args);
        };
    }


    function updateTimeoutSpeed() {
        window.setTimeout = (callback, delay, ...args) => {
            const adjustedDelay = delay / config.timeoutMultiplier;
            return originalSetTimeout(callback, adjustedDelay, ...args);
        };
    }


    function applyAntiKnockback() {
        const script = document.createElement('script');
        script.textContent = `
            if (window.pc?.app) {
                try {
                    const playerEntity = pc.app.root.findByName('Player');
                    if (playerEntity && playerEntity.script && playerEntity.script.playerController) {
                        console.log('[Hack] Applying enhanced Anti-Knockback');

                        const originalGetDamage = playerEntity.script.playerController.getDamage;


                        playerEntity.script.playerController.getDamage = function(amount, attacker) {

                            const originalPosition = this.entity.getPosition().clone();
                            const originalRotation = this.entity.getRotation().clone();


                            const result = originalGetDamage.call(this, amount, attacker);

                            if (window.antiKnockbackEnabled) {

                                this.entity.setPosition(originalPosition);
                                this.entity.setRotation(originalRotation);


                                setTimeout(() => {
                                    this.entity.setPosition(originalPosition);
                                    this.entity.setRotation(originalRotation);
                                }, 5);


                                setTimeout(() => {
                                    this.entity.setPosition(originalPosition);
                                    this.entity.setRotation(originalRotation);
                                }, 10);
                            }

                            return result;
                        };


                        if (playerEntity.script.movement && playerEntity.script.movement.knockback) {
                            const originalKnockback = playerEntity.script.movement.knockback;
                            playerEntity.script.movement.knockback = function() {
                                if (window.antiKnockbackEnabled) {

                                    return;
                                }
                                return originalKnockback.apply(this, arguments);
                            };
                        }


                        if (playerEntity.rigidbody) {
                            const originalApplyImpulse = playerEntity.rigidbody.applyImpulse;
                            playerEntity.rigidbody.applyImpulse = function(impulse) {
                                if (window.antiKnockbackEnabled) {

                                    if (impulse.y < 0 || Math.abs(impulse.x) > 1 || Math.abs(impulse.z) > 1) {

                                        return;
                                    }
                                }
                                return originalApplyImpulse.apply(this, arguments);
                            };
                        }


                        const app = pc.app;
                        if (app.systems && app.systems.script) {
                            const originalUpdate = app.systems.script.update;
                            let lastPosition = null;
                            let isRestoringPosition = false;

                            app.systems.script.update = function(dt) {

                                const result = originalUpdate.call(this, dt);


                                if (window.antiKnockbackEnabled && playerEntity) {
                                    const currentPos = playerEntity.getPosition();


                                    if (lastPosition && !isRestoringPosition) {
                                        const diff = new pc.Vec3();
                                        diff.sub2(currentPos, lastPosition);


                                        if (diff.length() > 0.1) {
                                            isRestoringPosition = true;
                                            playerEntity.setPosition(lastPosition);
                                            setTimeout(() => {
                                                isRestoringPosition = false;
                                            }, 20);
                                        }
                                    }


                                    if (!isRestoringPosition && playerEntity.script.playerController &&
                                        !playerEntity.script.playerController.isMoving) {
                                        lastPosition = currentPos.clone();
                                    }
                                }

                                return result;
                            };
                        }


                        window.antiKnockbackEnabled = ${antiKnockback};
                        console.log('[Hack] Enhanced Anti Knockback ' + (window.antiKnockbackEnabled ? 'Enabled' : 'Disabled'));
                    }
                } catch(e) {
                    console.error('[Anti Knockback] Error:', e);
                }
            }
        `;
        document.documentElement.appendChild(script);
        script.remove();
    }

    function toggleAntiKnockback() {
        antiKnockback = !antiKnockback;
        const script = document.createElement('script');
        script.textContent = `
            window.antiKnockbackEnabled = ${antiKnockback};
            console.log('[Hack] Anti Knockback ' + (window.antiKnockbackEnabled ? 'Enabled' : 'Disabled'));
        `;
        document.documentElement.appendChild(script);
        script.remove();
        return antiKnockback;
    }

    function applySpeedHack() {
        const script = document.createElement('script');
        script.textContent = `
            if (window.originalRequestAnimationFrame) {
                window.requestAnimationFrame = function(callback) {
                    return window.originalRequestAnimationFrame(function(timestamp) {
                        timestamp *= ${config.speedMultiplier};
                        callback(timestamp);
                    });
                };
            }

            if (window.pc?.app) {
                try {
                    pc.app.timeScale = ${config.speedMultiplier};
                    pc.app.systems.script.update = function(dt) {
                        dt *= ${config.speedMultiplier};
                        this._callScriptMethod('update', dt);
                    };
                } catch(e) {
                    console.error('[Speed Hack] Error:', e);
                }
            }
        `;
        document.documentElement.appendChild(script);
    }


    function disableAutoAttack() {
        const script = document.createElement('script');
        script.textContent = `
            function disableAutoAttack() {
                if (window.pc?.app) {
                    try {
                        const app = window.pc.app;
                        const root = app.root;
                        if (root) {
                            const autoAttacks = root.findByTag('AutoAttack');
                            autoAttacks?.forEach(component => {
                                if (component?.enabled) {
                                    component.enabled = false;
                                }
                            });
                        }
                    } catch(e) {
                        console.error('[Hack] Error:', e);
                    }
                }
            }

            const autoAttackInterval = setInterval(() => {
                if (window.pc?.app) {
                    disableAutoAttack();
                    clearInterval(autoAttackInterval);
                }
            }, 1000);
        `;
        document.documentElement.appendChild(script);
    }


    function updateSpeed(value) {
        config.speedMultiplier = Math.min(value, 9999999999999999);

        const speedValueElement = document.getElementById('speed-value');
        if (speedValueElement) {
            speedValueElement.textContent = config.speedMultiplier + 'x';
        }

        applyPCSpeedHack();

        if (config.useRequestAnimationFrame) {
            applyRAFSpeedHack();
        }
    }


    const styles = `
        #hack-menu {
            position: fixed;
            top: 206px;
            left: 3px;
            background: rgba(0,0,0,0.8);
            color: #00ff00;
            padding: 15px;
            border-radius: 10px;
            z-index: 9999;
            width: 240px;
            font-family: Arial, sans-serif;
            border: 2px solid #00ff00;
            cursor: move;
            animation: rainbow 2s infinite;
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
        .discord-icon {
            width: 64px;
            height: 64px;
            position: absolute;
            left: -15px;
            top: -40px;
        }
        .slider-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin: 10px 0;
        }
        .btn, .hack-btn {
            width: 40px;
            height: 30px;
            background-color: #444;
            color: #00ff00;
            border: 1px solid #ff0;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }
        .control-btn {
            background-color: #333;
            width: 100%;
            font-size: 14px;
            margin-top: 10px;
            border: 1px solid #ff3300;
            color: #00ff00;
            padding: 5px;
            cursor: pointer;
        }
        #speed-slider {
            width: 180px;
        }
        @keyframes rainbow {
            0% { border-color: red; }
            14% { border-color: orange; }
            28% { border-color: yellow; }
            42% { border-color: green; }
            57% { border-color: blue; }
            71% { border-color: indigo; }
            85% { border-color: violet; }
            100% { border-color: red; }
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
        .floating-icon {
            position: fixed;
            width: 40px;
            height: 40px;
            background: rgba(0,0,0,0.8);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: 24px;
            z-index: 9999;
            border: 2px solid #00ff00;
            animation: rainbow 2s infinite;
            transition: transform 0.2s;
        }
        .floating-icon:hover {
            transform: scale(1.1);
        }
        .hack-menu.minimized {
            display: none;
        }
        .toggle-btn {
            background-color: #333;
            color: #00ff00;
            border: 1px solid #ff3300;
            border-radius: 5px;
            padding: 5px 10px;
            margin-top: 5px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .toggle-btn.active {
            background-color: #006600;
            border-color: #00ff00;
        }

        .toggle-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #ff3300;
            margin-left: 10px;
        }

        .toggle-indicator.active {
            background-color: #00ff00;
        }
    `;


    function createHackMenu() {
        const menu = document.createElement('div');
        menu.id = 'hack-menu';
        menu.className = 'hack-menu';
        menu.innerHTML = `
            <button class="minimize-btn">−</button>
            <h3>
                <span>PeDeCoca</span>
                <a href="https://discord.gg/Tsa7dtJe5R" target="_blank">
                    <img src="https://img.icons8.com/?size=100&id=61604&format=png&color=000000" alt="Discord" class="discord-icon">
                </a>
            </h3>
            <div style="eight:10px">
            <div class="hack-section">
                <span>Game Speed: <strong id="speed-value">${config.speedMultiplier}x</strong></span>
            <div style="eight:10px">
                <div class="slider-container">
                    <input type="range" id="speed-slider" min="0.1" max="9999999999999999" step="0.1" value="${config.speedMultiplier}">
                </div>
            </div>
            <div class="hack-section">
                <span>Attack Speed: <strong id="attack-value">${speedMultiplierDate}x</strong></span>
                <div class="slider-container">
                    <input type="range" id="attack-slider" min="1" max="9999999999999999" step="1" value="${speedMultiplierDate}">
                </div>
            </div>

            <!-- New interval speed slider -->
            <div class="hack-section">
                <span>Interval Speed: <strong id="interval-value">${config.intervalMultiplier}x</strong></span>
                <div class="slider-container">
                    <input type="range" id="interval-slider" min="1" max="9999999999999999" step="1" value="${config.intervalMultiplier}">
                </div>
            </div>

            <!-- New timeout speed slider -->
            <div class="hack-section">
                <span>Timeout Speed: <strong id="timeout-value">${config.timeoutMultiplier}x</strong></span>
                <div class="slider-container">
                    <input type="range" id="timeout-slider" min="1" max="9999999999999999" step="1" value="${config.timeoutMultiplier}">
                </div>
            </div>

            <button id="max-attack" class="control-btn">Max Attack</button>
            <button id="reset-all" class="control-btn">Reset All</button>
        `;

        const floatingIcon = document.createElement('div');
        floatingIcon.className = 'floating-icon';
        floatingIcon.innerHTML = '🕹️';
        floatingIcon.style.display = 'none';

        document.body.appendChild(menu);
        document.body.appendChild(floatingIcon);


        const minimizeBtn = menu.querySelector('.minimize-btn');
        minimizeBtn.addEventListener('click', () => {
            const menuPos = menu.getBoundingClientRect();
            menu.classList.add('minimized');
            floatingIcon.style.display = 'flex';
            floatingIcon.style.left = `${menuPos.left}px`;
            floatingIcon.style.top = `${menuPos.top}px`;
        });

        floatingIcon.addEventListener('click', () => {
            const iconPos = floatingIcon.getBoundingClientRect();
            menu.classList.remove('minimized');
            menu.style.left = `${iconPos.left}px`;
            menu.style.top = `${iconPos.top}px`;
            floatingIcon.style.display = 'none';
        });

        setupMenuControls();
        makeMenuMovable();
    }


    window.PokiSDK = {
        init() {
            console.log('[Hack] PokiSDK initialized');
            return Promise.resolve();
        },
        rewardedBreak(beforeBreak) {
            console.log('[Hack] Rewarded break called');
            if (beforeBreak) beforeBreak();
            return new Promise(resolve => {
                setTimeout(() => {
                    if (window.pc?.app) {
                        window.pc.app.fire('adSuccess', true);
                        window.pc.app.fire('rewardedBreakComplete', true);
                        window.pc.app.fire('rewardedBreakReward', true);
                    }
                    resolve(true);
                }, 10);
            });
        },
        commercialBreak() { return Promise.resolve(); },
        gameplayStart() { return Promise.resolve(); },
        gameplayStop() { return Promise.resolve(); },
        customEvent() { return Promise.resolve(); },
        enableEventTracking() { return Promise.resolve(); },
        setDebug() { return Promise.resolve(); },
        gameLoadingStart() { return Promise.resolve(); },
        gameLoadingFinished() { return Promise.resolve(); },
        gameInteractive() { return Promise.resolve(); },
        happyTime() { return Promise.resolve(); },
        setPlayerAge() { return Promise.resolve(); }
    };


    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        try {
            const urlObj = new URL(url);
            if (config.blockedDomains.has(urlObj.hostname)) {
                console.log('[Hack] Blocked request to:', urlObj.hostname);
                return new Promise(() => {});
            }
        } catch (e) {}
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
                    console.log('[Hack] Blocked XHR to:', urlObj.hostname);
                    return;
                }
            } catch (e) {}
            return originalOpen.apply(this, arguments);
        };
        return xhr;
    };


    function setupMenuControls() {
        const speedSlider = document.getElementById('speed-slider');
        const attackSlider = document.getElementById('attack-slider');
        const intervalSlider = document.getElementById('interval-slider');
        const timeoutSlider = document.getElementById('timeout-slider');

        const speedValue = document.getElementById('speed-value');
        const attackValue = document.getElementById('attack-value');
        const intervalValue = document.getElementById('interval-value');
        const timeoutValue = document.getElementById('timeout-value');

        speedSlider.addEventListener('input', () => {
            const value = parseFloat(speedSlider.value);
            updateSpeed(value);
        });

        attackSlider.addEventListener('input', () => {
            const value = parseInt(attackSlider.value);
            speedMultiplierDate = value;
            attackValue.textContent = value + 'x';
            updateSpeedDate();
        });


        intervalSlider.addEventListener('input', () => {
            const value = parseInt(intervalSlider.value);
            config.intervalMultiplier = value;
            intervalValue.textContent = value + 'x';
            updateIntervalSpeed();
        });


        timeoutSlider.addEventListener('input', () => {
            const value = parseInt(timeoutSlider.value);
            config.timeoutMultiplier = value;
            timeoutValue.textContent = value + 'x';
            updateTimeoutSpeed();
        });

        document.getElementById('max-attack').addEventListener('click', () => {
            speedMultiplierDate = 1000;
            attackSlider.value = 1000;
            attackValue.textContent = '1000x';
            updateSpeedDate();
        });

        document.getElementById('reset-all').addEventListener('click', () => {

            updateSpeed(1);
            speedSlider.value = 1;


            speedMultiplierDate = 1;
            attackSlider.value = 1;
            attackValue.textContent = '1x';
            updateSpeedDate();


            config.intervalMultiplier = 1;
            intervalSlider.value = 1;
            intervalValue.textContent = '1x';
            updateIntervalSpeed();


            config.timeoutMultiplier = 1;
            timeoutSlider.value = 1;
            timeoutValue.textContent = '1x';
            updateTimeoutSpeed();
        });
        const antiKnockbackToggle = document.getElementById('toggle-anti-knockback');
        if (antiKnockbackToggle) {
            antiKnockbackToggle.addEventListener('click', function() {
                const isActive = toggleAntiKnockback();
                this.classList.toggle('active', isActive);
                this.querySelector('.toggle-indicator').classList.toggle('active', isActive);
                applyAntiKnockback();
            });
        }
    }


    function makeMenuMovable() {
        const menu = document.getElementById('hack-menu');
        let isDragging = false;
        let offsetX, offsetY;

        menu.addEventListener('mousedown', (e) => {

            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
                return;
            }

            isDragging = true;
            offsetX = e.clientX - menu.offsetLeft;
            offsetY = e.clientY - menu.offsetTop;
            menu.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                menu.style.left = `${e.clientX - offsetX}px`;
                menu.style.top = `${e.clientY - offsetY}px`;
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            menu.style.cursor = 'move';
        });


        const sliders = menu.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            slider.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });
            slider.addEventListener('mousemove', (e) => {
                e.stopPropagation();
            });
        });


        const floatingIcon = document.querySelector('.floating-icon');
        let isDraggingIcon = false;
        let hasMoved = false;
        let iconOffsetX, iconOffsetY;

        floatingIcon.addEventListener('mousedown', (e) => {
            isDraggingIcon = true;
            hasMoved = false;
            iconOffsetX = e.clientX - floatingIcon.offsetLeft;
            iconOffsetY = e.clientY - floatingIcon.offsetTop;
            floatingIcon.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (isDraggingIcon) {
                hasMoved = true;
                floatingIcon.style.left = `${e.clientX - iconOffsetX}px`;
                floatingIcon.style.top = `${e.clientY - iconOffsetY}px`;
            }
        });

        window.addEventListener('mouseup', () => {
            isDraggingIcon = false;
            floatingIcon.style.cursor = 'pointer';
        });


        floatingIcon.addEventListener('click', (e) => {
            if (!hasMoved) {
                const menu = document.getElementById('hack-menu');
                const iconPos = floatingIcon.getBoundingClientRect();
                menu.classList.remove('minimized');
                menu.style.left = `${iconPos.left}px`;
                menu.style.top = `${iconPos.top}px`;
                floatingIcon.style.display = 'none';
            }
        });
    }
    function applyPCSpeedHack() {
        const script = document.createElement('script');
        script.textContent = `
            if (window.pc?.app) {
                try {

                    pc.app.timeScale = ${config.speedMultiplier};


                    if (pc.app.systems && pc.app.systems.script) {
                        pc.app.systems.script.update = function(dt) {
                            dt *= ${config.speedMultiplier};
                            this._callScriptMethod('update', dt);
                        };
                    }

                    console.log('[Hack] PC Speed multiplier set to ${config.speedMultiplier}x');
                } catch(e) {
                    console.error('[Speed Hack] PC Error:', e);
                }
            }
        `;
        document.documentElement.appendChild(script);
        script.remove();
    }
    function applyRAFSpeedHack() {
        const script = document.createElement('script');
        script.textContent = `
            if (window.originalRequestAnimationFrame) {
                window.requestAnimationFrame = function(callback) {
                    return window.originalRequestAnimationFrame(function(timestamp) {

                        timestamp *= ${config.speedMultiplier};
                        callback(timestamp);
                    });
                };
                console.log('[Hack] RAF Speed multiplier set to ${config.speedMultiplier}x');
            }
        `;
        document.documentElement.appendChild(script);
        script.remove();
    }

    function initialize() {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
        config.useRequestAnimationFrame = true;
        const script = document.createElement('script');
        script.textContent = `
            window.originalRequestAnimationFrame = window.requestAnimationFrame;
        `;
        document.documentElement.appendChild(script);
        script.remove();

        createHackMenu();
        updateSpeedDate();
        updateIntervalSpeed();
        updateTimeoutSpeed();
        applySpeedHack();
        applyAntiKnockback();
        setupAntiKnockbackMonitor();
        setInterval(() => {
            if (window.pc?.app) {
                window.pc.app.fire('adSuccess', true);
                window.pc.app.fire('rewardedBreakComplete', true);
                window.pc.app.fire('rewardedBreakReward', true);
            }
        }, 30000);

        console.log('[Hack] Script loaded successfully!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
