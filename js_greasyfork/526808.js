// ==UserScript==
// @name         Jerkmate Cheats
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  CheatGUI for jerkmate, Auto-clicker, Auto-Upgrader, Infinite points, Max level.
// @match        https://jerkmate.com/jerkmate-ranked
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526808/Jerkmate%20Cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/526808/Jerkmate%20Cheats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const createGUI = () => {
        const container = document.createElement('div');
        container.innerHTML = `
            <style>
                .jm-gui {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: rgba(28, 28, 28, 0.95);
                    color: white;
                    padding: 15px;
                    border-radius: 10px;
                    z-index: 10000;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    min-width: 250px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(5px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .jm-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    cursor: move;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .jm-title {
                    font-weight: bold;
                    font-size: 14px;
                    color: #fff;
                }
                .jm-controls {
                    display: flex;
                    gap: 5px;
                }
                .jm-button {
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    padding: 2px 6px;
                    font-size: 12px;
                    border-radius: 4px;
                }
                .jm-button:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .jm-section {
                    margin-bottom: 15px;
                }
                .jm-input-group {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                }
                .jm-input {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    color: white;
                    padding: 4px 8px;
                    width: 70px;
                    margin-right: 8px;
                }
                .jm-label {
                    font-size: 12px;
                    margin-right: 8px;
                    min-width: 100px;
                }
                .jm-action-button {
                    background: rgba(79, 70, 229, 0.8);
                    border: none;
                    border-radius: 4px;
                    color: white;
                    padding: 4px 12px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background 0.2s;
                }
                .jm-action-button:hover {
                    background: rgba(79, 70, 229, 1);
                }
                .jm-content {
                    transition: max-height 0.3s ease-out;
                    overflow: hidden;
                }
                .auto-buy-section {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
                .auto-buy-toggle {
                    background: rgba(79, 70, 229, 0.8);
                    border: none;
                    border-radius: 4px;
                    color: white;
                    padding: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background 0.2s;
                }
                .auto-buy-toggle.active {
                    background: #22c55e;
                }
            </style>
            <div class="jm-gui">
                <div class="jm-header">
                    <div class="jm-title">JM CheatGUI | github.com/theogbob</div>
                    <div class="jm-controls">
                        <button class="jm-button" id="minimize-btn">−</button>
                        <button class="jm-button" id="close-btn">×</button>
                    </div>
                </div>
                <div class="jm-content">
                    <div class="jm-section"></div>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        const gui = container.querySelector('.jm-gui');
        const header = container.querySelector('.jm-header');
        const content = container.querySelector('.jm-content');
        const minimizeBtn = container.querySelector('#minimize-btn');
        const closeBtn = container.querySelector('#close-btn');

        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const dragStart = (e) => {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === header) {
                isDragging = true;
            }
        };

        const dragEnd = () => {
            isDragging = false;
        };

        const drag = (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                gui.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        };

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        let isMinimized = false;
        minimizeBtn.addEventListener('click', () => {
            isMinimized = !isMinimized;
            content.style.maxHeight = isMinimized ? '0' : '1000px';
            minimizeBtn.textContent = isMinimized ? '+' : '−';
        });

        closeBtn.addEventListener('click', () => {
            container.remove();
        });

        const createControlSection = () => {
            const section = content.querySelector('.jm-section');

            const controls = [
                { label: 'Level', id: 'level', default: 1 },
                { label: 'Orgasm Points', id: 'orgasmPoints', default: 1 },
                { label: 'Click Speed (ms)', id: 'clickSpeed', default: 1000 }
            ];

            controls.forEach(control => {
                const group = document.createElement('div');
                group.className = 'jm-input-group';

                const label = document.createElement('label');
                label.className = 'jm-label';
                label.textContent = control.label;

                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'jm-input';
                input.id = control.id;
                input.value = control.default;
                input.min = control.id === 'clickSpeed' ? 50 : 0;

                const button = document.createElement('button');
                button.className = 'jm-action-button';
                button.textContent = control.id === 'clickSpeed' ? 'Toggle Auto' : 'Set';

                group.appendChild(label);
                group.appendChild(input);
                group.appendChild(button);
                section.appendChild(group);

                if (control.id === 'clickSpeed') {
                    let clickInterval = null;
                    button.onclick = () => {
                        if (clickInterval === null) {
                            const speed = Math.max(50, parseInt(input.value));
                            const videoElement = document.evaluate(
                                '/html/body/div[7]/div[1]/div/div[3]/div[2]/video',
                                document,
                                null,
                                XPathResult.FIRST_ORDERED_NODE_TYPE,
                                null
                            ).singleNodeValue;

                            if (videoElement) {
                                clickInterval = setInterval(() => videoElement.click(), speed);
                                button.textContent = 'Stop Auto';
                                button.style.background = '#ef4444';
                            }
                        } else {
                            clearInterval(clickInterval);
                            clickInterval = null;
                            button.textContent = 'Toggle Auto';
                            button.style.background = '';
                        }
                    };
                } else {
                    button.onclick = () => updateGameData(control.id, parseInt(input.value));
                }
            });

            const autoBuySection = document.createElement('div');
            autoBuySection.className = 'auto-buy-section';

            const upgrades = [
                { name: 'Lube', xpath: '/html/body/div[7]/div[1]/div/div[2]/div[2]/div[1]/button' },
                { name: 'Poster', xpath: '/html/body/div[7]/div[1]/div/div[2]/div[2]/div[2]/button' },
                { name: 'Magazine', xpath: '/html/body/div[7]/div[1]/div/div[2]/div[2]/div[3]/button' },
                { name: 'Private Show', xpath: '/html/body/div[7]/div[1]/div/div[2]/div[2]/div[4]/button' },
                { name: 'Cam-to-Cam', xpath: '/html/body/div[7]/div[1]/div/div[2]/div[2]/div[5]/button' }
            ];

            upgrades.forEach(upgrade => {
                const button = document.createElement('button');
                button.className = 'auto-buy-toggle';
                button.textContent = `Auto ${upgrade.name}`;

                let buyInterval = null;
                button.onclick = () => {
                    if (buyInterval === null) {
                        buyInterval = setInterval(() => {
                            const upgradeButton = document.evaluate(
                                upgrade.xpath,
                                document,
                                null,
                                XPathResult.FIRST_ORDERED_NODE_TYPE,
                                null
                            ).singleNodeValue;
                            if (upgradeButton) upgradeButton.click();
                        }, 100);
                        button.classList.add('active');
                    } else {
                        clearInterval(buyInterval);
                        buyInterval = null;
                        button.classList.remove('active');
                    }
                };

                autoBuySection.appendChild(button);
            });

            section.appendChild(autoBuySection);
        };

        createControlSection();
    };

    const updateGameData = (key, value) => {
        try {
            let gameData = JSON.parse(getCookie('gameData'));
            gameData[key] = value;
            document.cookie = `gameData=${JSON.stringify(gameData)}; path=/`;
            location.reload();
        } catch (error) {
            console.error('Error updating game data:', error);
        }
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    if (window.location.href === 'https://jerkmate.com/jerkmate-ranked') {
        window.addEventListener('load', () => setTimeout(createGUI, 1000));
    }
})();