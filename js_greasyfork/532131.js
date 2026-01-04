// ==UserScript==
// @name         LZT counter
// @namespace    Счётчик кликов
// @author       Plarq
// @version      1.0
// @description  Универсальный счётчик LZT
// @license      Apache 2.0
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @icon         https://lolz.live/styles/brand/download/avatars/three_avatar.svg
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/532131/LZT%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/532131/LZT%20counter.meta.js
// ==/UserScript==

/* global _ */

(function() {
    'use strict';

    const CONFIG = {
        COUNTER_ID: 'lzt-counter-visible',
        SETTINGS_BTN_ID: 'lzt-counter-settings-btn',
        ACHIEVEMENTS_BTN_ID: 'lzt-counter-achievements-btn',
        SETTINGS_MENU_ID: 'lzt-counter-settings-menu',
        ACHIEVEMENTS_MENU_ID: 'lzt-counter-achievements-menu',
        STORAGE_KEY: 'lztGlobalCounterV2',
        STORAGE_MAX_KEY: 'lztGlobalCounterMaxV2',
        STYLES_KEY: 'lztCounterStyles',
        FONT_SIZE_KEY: 'lztCounterFontSize',
        BACKGROUND_OPACITY_KEY: 'lztCounterBgOpacity',
        BUTTON_SELECTORS: {
            'zelenka.guru': '[data-t="update"]',
            'lzt.market': '.feed__refresh-button',
            'lolz.market': '.refresh-feed',
            'lolz.live': '.UpdateFeedButton'
        },
        ACHIEVEMENTS: [
            { threshold: 100, title: 'Новокек' },
            { threshold: 500, title: 'Местный' },
            { threshold: 1000, title: 'Постоялец' },
            { threshold: 2500, title: 'Эксперт' },
            { threshold: 5000, title: 'Гуру' },
            { threshold: 10000, title: 'Искусственный интеллект' }
        ],
        INITIAL_POSITION: { x: 260, y: 950 },
        DEFAULT_FONT_SIZE: 18,
        DEFAULT_BG_OPACITY: 1,
        NOTIFICATION_DURATION: 5000,
        NOTIFICATION_OFFSET: 20,
        DEBUG: false
    };

    let isDragging = false;
    let animationFrameId = null;

    function log(...args) {
        if (CONFIG.DEBUG) console.log('[LZT Counter]', ...args);
    }

    function isFeedPage() {
        const path = window.location.pathname;
        return path.includes('/feed') || path === '/';
    }

    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    async function applyStyles(counterElement) {
        const savedStyles = await GM.getValue(CONFIG.STYLES_KEY, {});
        const fontSize = await GM.getValue(CONFIG.FONT_SIZE_KEY, CONFIG.DEFAULT_FONT_SIZE);
        const bgOpacity = await GM.getValue(CONFIG.BACKGROUND_OPACITY_KEY, CONFIG.DEFAULT_BG_OPACITY);

        counterElement.style.cssText = `
            position: fixed;
            color: ${savedStyles.color || '#ffffff'};
            background: ${savedStyles.background === false ?
                'transparent' :
                hexToRgba('#1A1A1A', bgOpacity)};
            box-shadow: ${savedStyles.background === false ? 'none' : '0 2px 5px rgba(0,0,0,0.2)'};
            padding: ${savedStyles.background === false ? '0' : '8px 15px'};
            border-radius: 5px;
            z-index: 9998;
            cursor: pointer;
            font-size: ${fontSize}px;
            font-weight: bold;
            user-select: none;
            min-width: 60px;
            text-align: center;
            white-space: nowrap;
            transition: all 0.2s ease;
            box-sizing: border-box;
            left: ${savedStyles.customPosition?.x || CONFIG.INITIAL_POSITION.x}px;
            top: ${savedStyles.customPosition?.y || CONFIG.INITIAL_POSITION.y}px;
        `;
    }

    function createButton(text, color) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            flex: 1;
            background: ${color};
            color: white;
            border: none;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            white-space: nowrap;
            transition: opacity 0.2s;
        `;
        btn.addEventListener('mouseover', () => btn.style.opacity = '0.8');
        btn.addEventListener('mouseout', () => btn.style.opacity = '1');
        return btn;
    }

    function createSettingsMenu() {
        const menu = document.createElement('div');
        menu.id = CONFIG.SETTINGS_MENU_ID;
        menu.style.cssText = `
            position: fixed;
            bottom: 60px;
            left: 20px;
            background: #1A1A1A;
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            display: none;
            width: 300px;
            box-sizing: border-box;
        `;

        const createRow = () => {
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; gap: 8px; margin-bottom: 12px;';
            return row;
        };

        const row1 = createRow();
        const colorBtn = createButton('Цвет', '#228E5D');
        const bgBtn = createButton('Фон', '#228E5D');
        row1.appendChild(colorBtn);
        row1.appendChild(bgBtn);

        const row2 = createRow();
        const moveBtn = createButton('Переместить', '#228E5D');
        const resetBtn = createButton('Сброс позиции', '#228E5D');
        row2.appendChild(moveBtn);
        row2.appendChild(resetBtn);

        const createSlider = (config) => {
            const container = document.createElement('div');
            container.style.cssText = 'margin: 15px 0;';

            const label = document.createElement('div');
            label.textContent = config.label;
            label.style.cssText = `
                color: rgba(255,255,255,0.7);
                font-size: 12px;
                margin-bottom: 8px;
                display: flex;
                justify-content: space-between;
            `;

            const value = document.createElement('span');
            value.textContent = config.valueText;

            const slider = document.createElement('input');
            slider.type = 'range';
            Object.assign(slider, config.sliderProps);
            slider.style.cssText = `
                width: 100%;
                height: 4px;
                background: #333;
                border-radius: 2px;
                -webkit-appearance: none;
                outline: none;

                &::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    background: #228E5D;
                    border-radius: 50%;
                    cursor: pointer;
                }
            `;

            slider.addEventListener('input', _.throttle(async (e) => {
                const newValue = config.parser(e.target.value);
                value.textContent = config.formatter(newValue);
                await GM.setValue(config.key, newValue);
                applyStyles(document.getElementById(CONFIG.COUNTER_ID));
            }, 100));

            label.appendChild(value);
            container.appendChild(label);
            container.appendChild(slider);
            return container;
        };

        const fontSizeSlider = createSlider({
            label: 'Размер текста:',
            key: CONFIG.FONT_SIZE_KEY,
            sliderProps: {
                min: 12,
                max: 36,
                step: 1,
                value: CONFIG.DEFAULT_FONT_SIZE
            },
            parser: parseInt,
            formatter: v => `${v}px`,
            valueText: `${CONFIG.DEFAULT_FONT_SIZE}px`
        });

        const opacitySlider = createSlider({
            label: 'Прозрачность фона:',
            key: CONFIG.BACKGROUND_OPACITY_KEY,
            sliderProps: {
                min: 0,
                max: 1,
                step: 0.1,
                value: CONFIG.DEFAULT_BG_OPACITY
            },
            parser: parseFloat,
            formatter: v => `${Math.round(v * 100)}%`,
            valueText: `${Math.round(CONFIG.DEFAULT_BG_OPACITY * 100)}%`
        });

        const hint = document.createElement('div');
        hint.style.cssText = `
            color: rgba(255,255,255,0.7);
            font-size: 12px;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(255,255,255,0.2);
        `;
        hint.innerHTML = 'Для сохранения позиции<br>нажмите ЛКМ во время перемещения';

        menu.appendChild(row1);
        menu.appendChild(row2);
        menu.appendChild(fontSizeSlider);
        menu.appendChild(opacitySlider);
        menu.appendChild(hint);

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.style.cssText = 'position: absolute; opacity: 0; pointer-events: none;';

        colorBtn.addEventListener('click', () => {
            colorInput.value = document.getElementById(CONFIG.COUNTER_ID).style.color;
            colorInput.click();
        });

        colorInput.addEventListener('input', async (e) => {
            const styles = await GM.getValue(CONFIG.STYLES_KEY, {});
            styles.color = e.target.value;
            await GM.setValue(CONFIG.STYLES_KEY, styles);
            applyStyles(document.getElementById(CONFIG.COUNTER_ID));
        });

        bgBtn.addEventListener('click', async () => {
            const styles = await GM.getValue(CONFIG.STYLES_KEY, {});
            styles.background = !styles.background;
            await GM.setValue(CONFIG.STYLES_KEY, styles);
            applyStyles(document.getElementById(CONFIG.COUNTER_ID));
            bgBtn.textContent = styles.background ? 'Убрать фон' : 'Вернуть фон';
        });

        moveBtn.addEventListener('click', () => startDragging());

        resetBtn.addEventListener('click', async () => {
            const styles = await GM.getValue(CONFIG.STYLES_KEY, {});
            delete styles.customPosition;
            await GM.setValue(CONFIG.STYLES_KEY, styles);
            applyStyles(document.getElementById(CONFIG.COUNTER_ID));
        });

        Promise.all([
            GM.getValue(CONFIG.FONT_SIZE_KEY, CONFIG.DEFAULT_FONT_SIZE),
            GM.getValue(CONFIG.BACKGROUND_OPACITY_KEY, CONFIG.DEFAULT_BG_OPACITY)
        ]).then(([fontSize, opacity]) => {
            fontSizeSlider.querySelector('input').value = fontSize;
            fontSizeSlider.querySelector('span').textContent = `${fontSize}px`;
            opacitySlider.querySelector('input').value = opacity;
            opacitySlider.querySelector('span').textContent = `${Math.round(opacity * 100)}%`;
        });

        document.body.appendChild(menu);
        document.body.appendChild(colorInput);
        return menu;
    }

    function createAchievementsMenu() {
        const menu = document.createElement('div');
        menu.id = CONFIG.ACHIEVEMENTS_MENU_ID;
        menu.style.cssText = `
            position: fixed;
            bottom: 60px;
            left: 20px;
            background: #1A1A1A;
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            display: none;
            width: 300px;
            box-sizing: border-box;
        `;

        const title = document.createElement('div');
        title.textContent = 'Достижения';
        title.style.cssText = 'font-weight: bold; margin-bottom: 15px; font-size: 16px;';

        const progressContainer = document.createElement('div');
        progressContainer.style.marginBottom = '15px';

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            background: #333;
            height: 10px;
            border-radius: 5px;
            overflow: hidden;
        `;

        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            background: #228E5D;
            height: 100%;
            width: 0%;
            transition: width 0.3s ease;
        `;

        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressBar);

        const achievementsList = document.createElement('div');
        achievementsList.style.cssText = 'max-height: 300px; overflow-y: auto;';

        menu.appendChild(title);
        menu.appendChild(progressContainer);
        menu.appendChild(achievementsList);

        async function updateMenu() {
            const maxCounter = await GM.getValue(CONFIG.STORAGE_MAX_KEY, 0);
            const achievements = CONFIG.ACHIEVEMENTS;

            let currentAchievement = null;
            let nextAchievement = null;
            for (let i = 0; i < achievements.length; i++) {
                if (maxCounter >= achievements[i].threshold) {
                    currentAchievement = achievements[i];
                    if (i < achievements.length - 1) {
                        nextAchievement = achievements[i + 1];
                    }
                } else {
                    if (!nextAchievement) nextAchievement = achievements[i];
                    break;
                }
            }

            if (currentAchievement && nextAchievement) {
                const progress = ((maxCounter - currentAchievement.threshold) / (nextAchievement.threshold - currentAchievement.threshold)) * 100;
                progressFill.style.width = `${Math.min(progress, 100)}%`;
            } else if (currentAchievement && !nextAchievement) {
                progressFill.style.width = '100%';
            } else if (!currentAchievement && nextAchievement) {
                const progress = (maxCounter / nextAchievement.threshold) * 100;
                progressFill.style.width = `${progress}%`;
            } else {
                progressFill.style.width = '0%';
            }

            achievementsList.innerHTML = '';
            achievements.forEach(ach => {
                const isUnlocked = maxCounter >= ach.threshold;
                const item = document.createElement('div');
                item.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                `;

                const titleSpan = document.createElement('span');
                titleSpan.textContent = ach.title;
                titleSpan.style.color = isUnlocked ? '#fff' : 'rgba(255,255,255,0.5)';

                const thresholdSpan = document.createElement('span');
                thresholdSpan.textContent = ach.threshold;
                thresholdSpan.style.color = isUnlocked ? '#228E5D' : 'rgba(255,255,255,0.5)';
                thresholdSpan.style.fontSize = '14px';

                item.appendChild(titleSpan);
                item.appendChild(thresholdSpan);
                achievementsList.appendChild(item);
            });
        }

        menu.updateMenu = updateMenu;
        menu.addEventListener('click', (e) => e.stopPropagation());
        document.body.appendChild(menu);
        return menu;
    }

    function showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'lzt-achievement-notification';
        notification.innerHTML = `
            <div style="font-size: 16px; color: #228E5D; margin-bottom: 4px;">✓ Достижение получено!</div>
            <div style="font-size: 14px;"> Вы теперь ${achievement.title}</div>
        `;

        notification.style.cssText = `
            position: fixed;
            left: ${CONFIG.NOTIFICATION_OFFSET}px;
            top: 50%;
            transform: translateY(-50%);
            background: #1A1A1A;
            color: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            max-width: 250px;
        `;

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = `translate(10px, -50%)`;
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, CONFIG.NOTIFICATION_DURATION);

        notification.addEventListener('click', () => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        });
    }

    async function checkAchievements(newMax) {
        const shownAchievements = await GM.getValue('shownAchievements', {});
        const newAchievements = [];

        CONFIG.ACHIEVEMENTS.forEach(ach => {
            if (newMax >= ach.threshold && !shownAchievements[ach.threshold]) {
                newAchievements.push(ach);
                shownAchievements[ach.threshold] = true;
            }
        });

        if (newAchievements.length > 0) {
            await GM.setValue('shownAchievements', shownAchievements);
            newAchievements.forEach(ach => showAchievementNotification(ach));
        }
    }

    function startDragging() {
        const counter = document.getElementById(CONFIG.COUNTER_ID);
        const menu = document.getElementById(CONFIG.SETTINGS_MENU_ID);
        isDragging = true;
        menu.style.display = 'none';
        counter.style.cursor = 'grabbing';

        let lastX = 0, lastY = 0;
        let posX = 0, posY = 0;

        const pointerMoveHandler = e => {
            if (!isDragging) return;
            lastX = e.clientX;
            lastY = e.clientY;

            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(updatePosition);
            }
        };

        const updatePosition = () => {
            if (!isDragging) return;

            const counterRect = counter.getBoundingClientRect();
            const maxX = window.innerWidth - counterRect.width;
            const maxY = window.innerHeight - counterRect.height;

            posX = Math.min(Math.max(lastX - counterRect.width/2, 0), maxX);
            posY = Math.min(Math.max(lastY - counterRect.height/2, 0), maxY);

            counter.style.left = `${posX}px`;
            counter.style.top = `${posY}px`;

            animationFrameId = requestAnimationFrame(updatePosition);
        };

        const pointerUpHandler = async () => {
            isDragging = false;
            counter.style.cursor = 'pointer';
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;

            const styles = await GM.getValue(CONFIG.STYLES_KEY, {});
            styles.customPosition = {x: posX, y: posY};
            await GM.setValue(CONFIG.STYLES_KEY, styles);

            document.removeEventListener('pointermove', pointerMoveHandler);
            document.removeEventListener('pointerup', pointerUpHandler);
        };

        document.addEventListener('pointermove', pointerMoveHandler);
        document.addEventListener('pointerup', pointerUpHandler, {once: true});
    }

    async function main() {
        if (!isFeedPage()) return;

        const domain = window.location.hostname.replace('www.', '');
        log('Domain:', domain);

        let counter = await GM.getValue(CONFIG.STORAGE_KEY, 0);
        let maxCounter = await GM.getValue(CONFIG.STORAGE_MAX_KEY, 0);
        if (maxCounter < counter) {
            await GM.setValue(CONFIG.STORAGE_MAX_KEY, counter);
        }

        let counterElement = document.getElementById(CONFIG.COUNTER_ID);
        if (!counterElement) {
            counterElement = document.createElement('div');
            counterElement.id = CONFIG.COUNTER_ID;
            counterElement.textContent = counter;

            counterElement.addEventListener('dblclick', async () => {
                await GM.setValue(CONFIG.STORAGE_KEY, 0);
                counterElement.textContent = '0';
            });

            document.body.appendChild(counterElement);
            await applyStyles(counterElement);
        }

        if (!document.getElementById(CONFIG.SETTINGS_BTN_ID)) {
            const buttonsContainer = document.createElement('div');
            buttonsContainer.id = 'lzt-counter-buttons-container';
            buttonsContainer.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 9999;
                display: flex;
                gap: 8px;
            `;

            const settingsBtn = document.createElement('button');
            settingsBtn.id = CONFIG.SETTINGS_BTN_ID;
            settingsBtn.textContent = 'Настройки';
            settingsBtn.style.cssText = `
                padding: 8px 16px;
                background: #1A1A1A;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                white-space: nowrap;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            `;

            const achievementsBtn = document.createElement('button');
            achievementsBtn.id = CONFIG.ACHIEVEMENTS_BTN_ID;
            achievementsBtn.textContent = 'Достижения';
            achievementsBtn.style.cssText = settingsBtn.style.cssText;

            buttonsContainer.appendChild(settingsBtn);
            buttonsContainer.appendChild(achievementsBtn);
            document.body.appendChild(buttonsContainer);

            const settingsMenu = createSettingsMenu();
            const achievementsMenu = createAchievementsMenu();

            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
                achievementsMenu.style.display = 'none';
            });

            achievementsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                achievementsMenu.style.display = achievementsMenu.style.display === 'block' ? 'none' : 'block';
                settingsMenu.style.display = 'none';
                achievementsMenu.updateMenu();
            });

            document.addEventListener('click', (e) => {
                if (!settingsMenu.contains(e.target) && !achievementsMenu.contains(e.target) &&
                    !settingsBtn.contains(e.target) && !achievementsBtn.contains(e.target)) {
                    settingsMenu.style.display = 'none';
                    achievementsMenu.style.display = 'none';
                }
            });
        }

        const buttonSelector = CONFIG.BUTTON_SELECTORS[domain];
        const handleClick = _.throttle(async () => {
            const current = await GM.getValue(CONFIG.STORAGE_KEY, 0);
            const newCounter = current + 1;
            const maxCounter = await GM.getValue(CONFIG.STORAGE_MAX_KEY, 0);
            const newMax = Math.max(maxCounter, newCounter);

            await GM.setValue(CONFIG.STORAGE_KEY, newCounter);
            await GM.setValue(CONFIG.STORAGE_MAX_KEY, newMax);

            document.getElementById(CONFIG.COUNTER_ID).textContent = newCounter;

            if (newMax > maxCounter) {
                await checkAchievements(newMax);
            }
        }, 1000);

        new MutationObserver(() => {
            const button = document.querySelector(buttonSelector);
            if (button && !button.dataset.listener) {
                button.addEventListener('click', handleClick);
                button.dataset.listener = 'true';
            }
        }).observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    main().catch(e => log('Error:', e));
})();