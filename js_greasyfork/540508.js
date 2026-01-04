// ==UserScript==
// @name         PCOL-ASSIST
// @author       葉月Hikaru
// @match        http://www.heyzxz.me/pcol/*
// @version 7.6
// @namespace https://greasyfork.org/users/your-id
// @description 双人手动计分器，移动端虚拟按键
// @downloadURL https://update.greasyfork.org/scripts/540508/PCOL-ASSIST.user.js
// @updateURL https://update.greasyfork.org/scripts/540508/PCOL-ASSIST.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const keysConfig = [
        { key: '+', text: '-', top: 30, left: 40 },
        { key: 'w', text: 'W', top: 30, left: 50 },
        { key: '-', text: '+', top: 30, left: 60 },
        { key: 'space', text: 'SPACE', top: 30, left: 70 },
        { key: 'x', text: 'X', top: 30, left: 80 },
        { key: 'c', text: 'C', top: 30, left: 90 },
        { key: 'p', text: 'P', top: 120, left: 90 },
        { key: 'a', text: 'A', top: 120, left: 30 },
        { key: 's', text: 'S', top: 120, left: 50 },
        { key: 'd', text: 'D', top: 120, left: 70 },
        { key: 'meta', text: 'Cmd', top: 120, left: 80 }
    ];
    const originalButtons = [];
    let areButtonsVisible = true;
    let isScoreboardVisible = true;
    let scores = { player1: 0, player2: 0 };
    let buttonCooldowns = {};
    let minusCooldowns = {};
    let longPressTimer = null;
    const LONG_PRESS_DELAY = 500;
    const scoreColors = {
        1: 'rgba(255, 0, 0, 0.6)',
        2: 'rgba(255, 255, 0, 0.6)',
        3: 'rgba(0, 255, 0, 0.6)',
        4: 'rgba(139, 69, 19, 0.6)',
        5: 'rgba(0, 0, 255, 0.6)',
        6: 'rgba(255, 192, 203, 0.6)',
        7: 'rgba(0, 0, 0, 0.6)'
    };
    let currentPlayer = 'player1';

    function createVirtualKey(keyConfig) {
        const btn = document.createElement('button');
        btn.id = `pcol-assist-${keyConfig.key}-btn`;
        btn.textContent = keyConfig.text;
        btn.style.cssText = `
            position: fixed;
            top: ${keyConfig.top}px;
            left: ${keyConfig.left}%;
            transform: ${keyConfig.left === 50 ? 'translateX(-50%)' : 'translateX(0)'};
            width: 60px;
            height: 60px;
            font-size: ${keyConfig.text === 'SPACE' ? '16px' : '28px'};
            background-color: rgba(255, 165, 0, 0.9);
            color: white;
            border: 2px solid white;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9999;
            transition: all 0.1s ease; 
        `;

        function setPressedState(isPressed) {
            if (isPressed) {
                btn.style.backgroundColor = 'rgba(255, 140, 0, 0.7)';
                btn.style.transform = `${keyConfig.left === 50 ? 'translateX(-50%)' : 'translateX(0)'} scale(0.9)`;
                btn.style.borderColor = '#ffd700';
            } else {
                btn.style.backgroundColor = 'rgba(255, 165, 0, 0.9)';
                btn.style.transform = `${keyConfig.left === 50 ? 'translateX(-50%)' : 'translateX(0)'}`;
                btn.style.borderColor = 'white';
            }
        }

        function triggerEvent(type, keyInfo = {}) {
            if (keyConfig.key === '+' || keyConfig.key === '-') {
                const wheelEvent = new WheelEvent('wheel', {
                    deltaY: keyConfig.key === '+' ? -300 : 300,
                    bubbles: true,
                    cancelable: true
                });
                document.querySelector('canvas')?.dispatchEvent(wheelEvent) || document.dispatchEvent(wheelEvent);
            } else {
                const eventKey = keyInfo.key || (
                    keyConfig.key === 'space' ? ' ' : 
                    keyConfig.key === 'meta' ? 'Meta' : 
                    keyConfig.key
                );
                const eventCode = keyInfo.code || (
                    keyConfig.key === 'space' ? 'Space' : 
                    keyConfig.key === 'meta' ? 'MetaLeft' : 
                    `Key${keyConfig.key.toUpperCase()}`
                );
                const eventKeyCode = keyInfo.keyCode || (
                    keyConfig.key === 'w' ? 87 : 
                    keyConfig.key === 'a' ? 65 : 
                    keyConfig.key === 's' ? 83 : 
                    keyConfig.key === 'd' ? 68 : 
                    keyConfig.key === 'x' ? 88 : 
                    keyConfig.key === 'c' ? 67 : 
                    keyConfig.key === 'p' ? 80 : 
                    keyConfig.key === 'meta' ? 91 :
                    32
                );
                const event = new KeyboardEvent(type, {
                    key: eventKey === ' ' ? 'Spacebar' : eventKey,
                    code: eventCode,
                    keyCode: eventKeyCode,
                    metaKey: keyConfig.key === 'meta' && type === 'keydown',
                    bubbles: true,
                    cancelable: true
                });
                document.querySelector('canvas')?.dispatchEvent(event) || document.dispatchEvent(event);
            }
        }

        ['touchstart', 'mousedown'].forEach(e => btn.addEventListener(e, e => {
            e.preventDefault();
            setPressedState(true);
            triggerEvent('keydown');
        }));

        ['touchend', 'mouseup', 'mouseleave', 'touchcancel'].forEach(e => btn.addEventListener(e, e => {
            e.preventDefault();
            setPressedState(false);
            triggerEvent('keyup');
        }));

        document.body.appendChild(btn);
        originalButtons.push(btn);
    }
    
    function createVisibilityToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'pcol-assist-visibility-toggle';
        toggle.textContent = '按钮: 显示';
        toggle.style.cssText = `
            position: fixed;
            top: 60px;
            left: 20px;
            width: 100px;
            height: 40px;
            font-size: 16px;
            background-color: rgba(0, 128, 0, 0.9);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
        `;
        toggle.addEventListener('click', () => {
            areButtonsVisible = !areButtonsVisible;
            originalButtons.forEach(btn => {
                btn.style.display = areButtonsVisible ? 'block' : 'none';
            });
            if (areButtonsVisible) {
                toggle.textContent = '按钮: 显示';
                toggle.style.backgroundColor = 'rgba(0, 128, 0, 0.9)';
            } else {
                toggle.textContent = '按钮: 隐藏';
                toggle.style.backgroundColor = 'rgba(128, 128, 128, 0.9)';
            }
        });
        document.body.appendChild(toggle);
    }

    function createScoreboardToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'pcol-assist-scoreboard-toggle';
        toggle.textContent = '记分板: 显示';
        toggle.style.cssText = `
            position: fixed;
            top: 60px;
            left: 140px;
            width: 100px;
            height: 40px;
            font-size: 16px;
            background-color: rgba(0, 128, 0, 0.9);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
        `;
        toggle.addEventListener('click', () => {
            isScoreboardVisible = !isScoreboardVisible;
            const scoreboard = document.getElementById('pcol-assist-scoreboard');
            scoreboard.style.display = isScoreboardVisible ? 'flex' : 'none';
            if (isScoreboardVisible) {
                toggle.textContent = '记分板: 显示';
                toggle.style.backgroundColor = 'rgba(0, 128, 0, 0.9)';
            } else {
                toggle.textContent = '记分板: 隐藏';
                toggle.style.backgroundColor = 'rgba(128, 128, 128, 0.9)';
            }
        });
        document.body.appendChild(toggle);
    }

    function createFullscreenToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'pcol-assist-fullscreen-toggle';
        toggle.textContent = '全屏';
        toggle.style.cssText = `
            position: fixed;
            top: 60px;
            left: 260px;
            width: 80px;
            height: 40px;
            font-size: 16px;
            background-color: rgba(70, 130, 180, 0.9);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
        `;
        toggle.addEventListener('click', () => {
            const docEl = document.documentElement;
            const isFullscreen = document.webkitIsFullScreen || document.fullscreenElement;
            
            if (!isFullscreen) {
                if (docEl.webkitRequestFullscreen) {
                    docEl.webkitRequestFullscreen();
                } else if (docEl.requestFullscreen) {
                    docEl.requestFullscreen();
                }
                toggle.textContent = '退出全屏';
            } else {
                if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                toggle.textContent = '全屏';
            }
        });
        document.body.appendChild(toggle);
    }

    function updatePlayerSelection() {
        const player1Container = document.getElementById('pcol-player-container-player1');
        const player2Container = document.getElementById('pcol-player-container-player2');
        
        player1Container.style.border = 'none';
        player2Container.style.border = 'none';
        
        if (currentPlayer === 'player1') {
            player1Container.style.border = '3px solid #4CAF50';
        } else {
            player2Container.style.border = '3px solid #4CAF50';
        }
    }

    function createScoreboard() {
        const scoreboard = document.createElement('div');
        scoreboard.id = 'pcol-assist-scoreboard';
        scoreboard.style.cssText = `
            position: fixed;
            top: 100px;
            left: 10px;
            display: flex;
            gap: 20px;
            z-index: 9998;
        `;
        function createPlayerScore(playerId, name) {
            const container = document.createElement('div');
            container.id = `pcol-player-container-${playerId}`;
            container.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.7);
                padding: 10px;
                border-radius: 8px;
                cursor: pointer;
            `;
            container.addEventListener('click', () => {
                currentPlayer = playerId;
                updatePlayerSelection();
            });
            const nameEl = document.createElement('div');
            nameEl.textContent = name;
            nameEl.style.cssText = `
                color: white;
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 5px;
            `;
            const scoreEl = document.createElement('div');
            scoreEl.id = `pcol-score-${playerId}`;
            scoreEl.textContent = '0';
            scoreEl.style.cssText = `
                color: white;
                font-size: 36px;
                width: 80px;
                text-align: center;
                margin-bottom: 10px;
                border: 2px solid white;
                border-radius: 4px;
                padding: 5px 0;
            `;
            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.cssText = `
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 5px;
            `;
            for (let i = 1; i <= 7; i++) {
                const btn = document.createElement('button');
                btn.id = `pcol-add-${playerId}-${i}`;
                btn.textContent = `+${i}`;
                btn.style.cssText = `
                    width: 40px;
                    height: 40px;
                    font-size: 18px;
                    background-color: ${scoreColors[i]};
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                `;
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const btnId = btn.id;
                    if (buttonCooldowns[btnId]) return;
                    scores[playerId] += i;
                    scoreEl.textContent = scores[playerId];
                    buttonCooldowns[btnId] = true;
                    btn.style.backgroundColor = scoreColors[i].replace('0.6', '0.3');
                    setTimeout(() => {
                        buttonCooldowns[btnId] = false;
                        btn.style.backgroundColor = scoreColors[i];
                    }, 1000);
                });
                buttonsContainer.appendChild(btn);
            }
            const minusBtn = document.createElement('button');
            minusBtn.id = `pcol-minus-${playerId}-1`;
            minusBtn.textContent = '-1';
            minusBtn.style.cssText = `
                width: 40px;
                height: 40px;
                font-size: 18px;
                background-color: rgba(178, 34, 34, 0.6);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;
            minusBtn.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                longPressTimer = setTimeout(() => {
                    scores[playerId] = 0;
                    scoreEl.textContent = '0';
                }, LONG_PRESS_DELAY);
            });
            minusBtn.addEventListener('mouseup', (e) => {
                e.stopPropagation();
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                    const btnId = minusBtn.id;
                    if (minusCooldowns[btnId]) return;
                    if (scores[playerId] > 0) {
                        scores[playerId] -= 1;
                        scoreEl.textContent = scores[playerId];
                        minusCooldowns[btnId] = true;
                        minusBtn.style.backgroundColor = 'rgba(139, 0, 0, 0.3)';
                        setTimeout(() => {
                            minusCooldowns[btnId] = false;
                            minusBtn.style.backgroundColor = 'rgba(178, 34, 34, 0.6)';
                        }, 200);
                    }
                }
            });
            minusBtn.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                longPressTimer = setTimeout(() => {
                    scores[playerId] = 0;
                    scoreEl.textContent = '0';
                }, LONG_PRESS_DELAY);
            });
            minusBtn.addEventListener('touchend', (e) => {
                e.stopPropagation();
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                    const btnId = minusBtn.id;
                    if (minusCooldowns[btnId]) return;
                    if (scores[playerId] > 0) {
                        scores[playerId] -= 1;
                        scoreEl.textContent = scores[playerId];
                        minusCooldowns[btnId] = true;
                        minusBtn.style.backgroundColor = 'rgba(139, 0, 0, 0.3)';
                        setTimeout(() => {
                            minusCooldowns[btnId] = false;
                            minusBtn.style.backgroundColor = 'rgba(178, 34, 34, 0.6)';
                        }, 200);
                    }
                }
            });
            minusBtn.addEventListener('mouseleave', () => {
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
            });
            buttonsContainer.appendChild(minusBtn);
            container.appendChild(nameEl);
            container.appendChild(scoreEl);
            container.appendChild(buttonsContainer);
            return container;
        }
        scoreboard.appendChild(createPlayerScore('player1', 'P1'));
        scoreboard.appendChild(createPlayerScore('player2', 'P2'));
        document.body.appendChild(scoreboard);
        updatePlayerSelection();
    }

    keysConfig.forEach(createVirtualKey);
    createVisibilityToggle();
    createScoreboardToggle();
    createFullscreenToggle();
    createScoreboard();
})();