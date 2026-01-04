// ==UserScript==
// @name         Blackwood FightEnhancer
// @namespace    http://tampermonkey.net/
// @version      0.28
// @description  Мод для улучшенного опыта в аб
// @copyright    2025, fifthrank
// @license      MIT
// @match        *://*/cw3/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/540860/Blackwood%20FightEnhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/540860/Blackwood%20FightEnhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // НАСТРОЙКИ
    let config = {
        speedMode: GM_getValue('speedMode', 2),
        arrowFixMode: GM_getValue('arrowFixMode', 3),
        arrowId: GM_getValue('arrowId', '1234567'),
        posX: GM_getValue('posX', 20),
        posY: GM_getValue('posY', 100),
        energyTracker: GM_getValue('energyTracker', true),
        damageSkins: GM_getValue('damageSkins', true),
        diagonalSkin: GM_getValue('diagonalSkin', false),
        removeCostumes: GM_getValue('removeCostumes', false),
        dangerSkins: GM_getValue('dangerSkins', false),
        gridMode: GM_getValue('gridMode', 0),
        backgroundImage: GM_getValue('backgroundImage', 'https://i.postimg.cc/kg6P9vhn/image.png')
    };

    const SPEED_SETTINGS = {
        0: [0, 0],
        1: [120, 80],
        2: [100, 40],
    };

    const ARROW_FIX_SETTINGS = {
        0: {check:0, repeat:0, threshold:0},
        1: {check:100, repeat:160, threshold:1.6},
        2: {check:60, repeat:120, threshold:0.8},
        3: {check:30, repeat:80, threshold:0.1}
    };

    const DAMAGE_SKIN_CONFIG = {
        url: 'https://i.postimg.cc/VNJmkg3K/16.png',
        minSize: 55,
        maxSize: 100
    };

    const DIAGONAL_SKIN_CONFIG = {
        url: 'https://i.postimg.cc/90mpJHfF/6.png',
        minSize: 55,
        maxSize: 100,
        className: 'diagonal-skin-element',
        zIndex: -11
    };

    const GRID_STYLES = {
        0: '',
        1: 'td.cage { box-shadow: inset 0px 0px 0px 0.30px black; }',
        2: 'td.cage { box-shadow: inset 0px 0px 0px 0.30px white; }',
        3: 'td.cage { box-shadow: inset 0px 0px 0px 0.30px gray; }'
    };

    let [HOLD_DELAY, REPEAT_INTERVAL] = SPEED_SETTINGS[config.speedMode];
    let arrowConfig = ARROW_FIX_SETTINGS[config.arrowFixMode];
    const MOVEMENT_KEYS = ['KeyA','KeyD','KeyW','KeyS','KeyQ','KeyE','KeyZ','KeyX'];
    const ARROW_KEYS = {KeyL:false, KeyJ:false};

    let isMovementKeyDown = false;
    let currentMovementKey = null;
    let movementTimers = {repeat:null, hold:null};
    let arrowTimers = {check:null, repeat:null};
    let lastArrowPos = {KeyL:null, KeyJ:null};
    let isDragging = false;
    let dragStartX, dragStartY, elementStartX, elementStartY;
    let energyTrackerInterval = null;
    let lastEnergyUpdate = 0;
    const ENERGY_UPDATE_DELAY = 20;
    let damageSkinObserver = null;
    let costumeObserver = null;
    let dangerSkinObserver = null;
    let gridStyleElement = null;
    let diagonalSkinObserver = null;
    let diagonalSkinInterval = null;

    // ИНТЕРФЕЙС
    GM_addStyle(`
        #cwe-container {
            position: fixed;
            top: ${Math.min(Math.max(config.posY, 0), window.innerHeight - 30)}px;
            left: ${Math.min(Math.max(config.posX, 0), window.innerWidth - 200)}px;
            width: 200px;
            min-height: 30px;
            background: rgba(40, 40, 40, 0.8);
            border: 2px solid #2d4a2d;
            border-radius: 5px;
            color: #e0e0e0;
            font-family: "Comic Sans MS", cursive, sans-serif;
            z-index: 9999;
            overflow: visible;
            transition: height 0.3s ease;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            user-select: none;
        }

        #cwe-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('${config.backgroundImage}');
            background-size: cover;
            background-position: center;
            opacity: 0.5;
            z-index: -1;
            border-radius: 3px;
        }

        #cwe-header {
            padding: 5px;
            background: rgba(45, 60, 45, 0.7);
            cursor: move;
            font-weight: bold;
            border-bottom: 1px solid #2d4a2d;
            white-space: nowrap;
            font-size: 12px;
        }

        #cwe-content {
            padding: 8px;
            display: none;
            font-size: 11px;
        }

        .cwe-section {
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(45, 60, 45, 0.5);
        }

        .cwe-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            white-space: nowrap;
        }

        .cwe-label {
            margin-right: 10px;
            text-align: left;
            display: flex;
            align-items: center;
        }

        .cwe-help {
            color: #8a9c8a;
            cursor: help;
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 14px;
            height: 14px;
            font-size: 11px;
            margin-left: 5px;
        }

        .cwe-tooltip {
            display: none;
            position: absolute;
            background: rgba(30, 40, 30, 0.98);
            border: 1px solid #2d4a2d;
            padding: 6px;
            min-width: 180px;
            max-width: 250px;
            z-index: 10000;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 4px;
            text-align: left;
            box-shadow: 0 0 8px rgba(0,0,0,0.6);
            font-family: "Comic Sans MS", cursive, sans-serif;
            margin-bottom: 5px;
            pointer-events: none;
            font-size: 10px;
            white-space: normal;
            word-wrap: break-word;
        }

        .cwe-help:hover .cwe-tooltip {
            display: block;
        }

        .cwe-select-container {
            display: flex;
            align-items: center;
            width: 100px;
        }

        .cwe-select-arrow {
            cursor: pointer;
            padding: 0 5px;
            font-weight: bold;
        }

        .cwe-select-value {
            flex-grow: 1;
            text-align: center;
            padding: 3px;
            background: #111111;
            color: #e0e0e0;
            border: 1px solid #3a5a3a;
            border-radius: 3px;
            font-size: 11px;
            font-family: "Comic Sans MS", cursive, sans-serif;
        }

        input {
            width: 100px;
            padding: 3px;
            background: #111111;
            color: #e0e0e0;
            border: 1px solid #3a5a3a;
            border-radius: 3px;
            font-size: 11px;
            text-align: left;
            font-family: "Comic Sans MS", cursive, sans-serif;
        }

        #cwe-footer {
            text-align: center;
            margin-top: 5px;
            padding-top: 5px;
            border-top: 1px solid #2d4a2d;
            white-space: nowrap;
            font-size: 10px;
        }

        #cwe-footer a {
            color: #c0d0c0;
            text-decoration: none;
            font-weight: bold;
            display: block;
            padding: 0 5px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .cwe-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            cursor: pointer;
        }

        .cwe-toggle-switch {
            position: relative;
            width: 40px;
            height: 20px;
            background: #2d4a2d;
            border-radius: 10px;
            transition: background 0.3s;
        }

        .cwe-toggle-switch:after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #e0e0e0;
            top: 2px;
            left: 2px;
            transition: transform 0.3s;
        }

        .cwe-toggle.active .cwe-toggle-switch {
            background: #3a8a3a;
        }

        .cwe-toggle.active .cwe-toggle-switch:after {
            transform: translateX(20px);
        }

        .cwe-toggle-label {
            margin-right: 10px;
            display: flex;
            align-items: center;
        }

        .energy-percent-final {
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            font-weight: bold;
            pointer-events: none;
            background: rgba(0, 0, 0, 0.4);
            border-radius: 3px;
            padding: 1px 6px;
            white-space: nowrap;
            z-index: 100;
            text-shadow: 0 0 2px #000;
            font-size: 10px;
        }

        .mashroom-costume {
            position: absolute;
            width: 100%;
            height: auto;
            pointer-events: none;
            z-index: -10;
            top: 0;
            left: 0;
        }

        .${DIAGONAL_SKIN_CONFIG.className} {
            position: absolute;
            width: 100%;
            height: auto;
            pointer-events: none;
            z-index: ${DIAGONAL_SKIN_CONFIG.zIndex};
            top: 0;
            left: 0;
        }
    `);

    function createUI() {
        const container = document.createElement('div');
        container.id = 'cwe-container';

        container.innerHTML = `
            <div id="cwe-header">Blackwood FightEnhancer ▼</div>
            <div id="cwe-content">
                <div class="cwe-section">
                    <div class="cwe-row">
                        <div style="display: flex; align-items: center;">
                            <span class="cwe-label">Фикс стрелы
                                <div class="cwe-help">❔
                                    <div class="cwe-tooltip">
                                        Немного исправляет стопы стрелы с помощью костыля,
                                        проверяя положение стрелы и если она встала, то
                                        дает ей пинок для отлага. Тут можно выбрать как
                                        часто срабатывает проверка стрелы, с котячьей пользуюсь
                                        режимом "Часто", для остальных не протестировано.
                                        Ниже нужно вписать ваш catwar ID для того чтобы
                                        мод понимал какая из стрел ваша.
                                        Микрофриз так и так останется, но хотя бы стрела
                                        перестанет вставать намертво.
                                    </div>
                                </div>
                            </span>
                        </div>
                        <div class="cwe-select-container">
                            <span class="cwe-select-arrow">◄</span>
                            <span class="cwe-select-value" id="cwe-arrow-mode-value">${['Выкл','Реже','Средне','Часто'][config.arrowFixMode]}</span>
                            <span class="cwe-select-arrow">►</span>
                        </div>
                    </div>

                    <div class="cwe-row">
                        <span class="cwe-label">Ваш ID</span>
                        <input type="text" id="cwe-arrow-id" value="${config.arrowId}">
                    </div>

                    <div class="cwe-row">
                        <div style="display: flex; align-items: center;">
                            <span class="cwe-label">Ускорение
                                <div class="cwe-help">❔
                                    <div class="cwe-tooltip">
                                        Позволяет двигаться более быстро, почти уменьшая
                                        отклик на поле. Работает тоже через костыль. Мод
                                        повторяет прожатие клавиш направления позволяя ускоряться,
                                        Из минусов, чем быстрее режим - тем больше могут быть
                                        лаги.
                                    </div>
                                </div>
                            </span>
                        </div>
                        <div class="cwe-select-container">
                            <span class="cwe-select-arrow">◄</span>
                            <span class="cwe-select-value" id="cwe-speed-mode-value">${['Выкл','Норма','Быстро'][config.speedMode]}</span>
                            <span class="cwe-select-arrow">►</span>
                        </div>
                    </div>
                </div>

                <div class="cwe-section">
                    <div class="cwe-toggle ${config.energyTracker ? 'active' : ''}" id="cwe-energy-tracker">
                        <span class="cwe-toggle-label">Трекер энергии</span>
                        <div class="cwe-toggle-switch"></div>
                    </div>

                    <div class="cwe-toggle ${config.damageSkins ? 'active' : ''}" id="cwe-damage-skins">
                        <span class="cwe-toggle-label">Уронки</span>
                        <div class="cwe-toggle-switch"></div>
                    </div>

                    <div class="cwe-toggle ${config.diagonalSkin ? 'active' : ''}" id="cwe-diagonal-skin">
                        <span class="cwe-toggle-label">Диагонали
                            <div class="cwe-help">❔
                                <div class="cwe-tooltip">
                                    Добавляет специальный костюм для персонажа, который помогает визуально ориентироваться в дигах.
                                    Он так же прикрепляется по ID и работает только при включённом БР. Диагонали зашквар, но пусть будет.
                                </div>
                            </div>
                        </span>
                        <div class="cwe-toggle-switch"></div>
                    </div>

                    <div class="cwe-toggle ${config.removeCostumes ? 'active' : ''}" id="cwe-remove-costumes">
                        <span class="cwe-toggle-label">Снять костюмы
                            <div class="cwe-help">❔
                                <div class="cwe-tooltip">
                                    Убирает все костюмы с персонажей на поле боя кроме модовских.
                                    ВАЖНО: может удалять ботов, не знаю как это сработает
                                    с приходящими ежемесячно, но скорее всего он станет невидимым.
                                </div>
                            </div>
                        </span>
                        <div class="cwe-toggle-switch"></div>
                    </div>

                    <div class="cwe-toggle ${config.dangerSkins ? 'active' : ''}" id="cwe-danger-skins">
                        <span class="cwe-toggle-label">Опаски
                            <div class="cwe-help">❔
                                <div class="cwe-tooltip">
                                    Заменяет стандартные изображения ранений на более заметные варианты.
                                    По факту перенос мода со Stylus.
                                </div>
                            </div>
                        </span>
                        <div class="cwe-toggle-switch"></div>
                    </div>

                    <div class="cwe-row">
                        <span class="cwe-label">Сетка</span>
                        <div class="cwe-select-container">
                            <span class="cwe-select-arrow">◄</span>
                            <span class="cwe-select-value" id="cwe-grid-mode-value">${['Выкл','Черная','Белая','Серая'][config.gridMode]}</span>
                            <span class="cwe-select-arrow">►</span>
                        </div>
                    </div>
                </div>

                <div id="cwe-footer">
                    <a href="https://catwar.net/blog685095" target="_blank">СОБСТВЕННОСТЬ ЧЕРНОЛЕСЬЯ</a>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        setupSelectControl('cwe-arrow-mode', ['Выкл','Реже','Средне','Часто'], config.arrowFixMode, (value) => {
            config.arrowFixMode = value;
            GM_setValue('arrowFixMode', config.arrowFixMode);
            arrowConfig = ARROW_FIX_SETTINGS[config.arrowFixMode];
            stopArrowTimers();
        });

        setupSelectControl('cwe-speed-mode', ['Выкл','Норма','Быстро'], config.speedMode, (value) => {
            config.speedMode = value;
            GM_setValue('speedMode', config.speedMode);
            [HOLD_DELAY, REPEAT_INTERVAL] = SPEED_SETTINGS[config.speedMode];
            stopMovementRepeat();
        });

        setupSelectControl('cwe-grid-mode', ['Выкл','Черная','Белая','Серая'], config.gridMode, (value) => {
            config.gridMode = value;
            GM_setValue('gridMode', config.gridMode);
            updateGridStyle();
        });

        document.getElementById('cwe-header').addEventListener('click', toggleUI);
        document.getElementById('cwe-arrow-id').addEventListener('change', updateArrowId);
        document.getElementById('cwe-energy-tracker').addEventListener('click', toggleEnergyTracker);
        document.getElementById('cwe-damage-skins').addEventListener('click', toggleDamageSkins);
        document.getElementById('cwe-diagonal-skin').addEventListener('click', toggleDiagonalSkin);
        document.getElementById('cwe-remove-costumes').addEventListener('click', toggleRemoveCostumes);
        document.getElementById('cwe-danger-skins').addEventListener('click', toggleDangerSkins);

        setupDrag();

        if (config.energyTracker) startEnergyTracker();
        if (config.damageSkins) startDamageSkins();
        if (config.diagonalSkin) startDiagonalSkin();
        if (config.removeCostumes) startRemoveCostumes();
        if (config.dangerSkins) startDangerSkins();
        if (config.gridMode > 0) updateGridStyle();
    }

    function setupSelectControl(prefix, options, currentValue, callback) {
        const valueElement = document.getElementById(`${prefix}-value`);
        const leftArrow = valueElement.previousElementSibling;
        const rightArrow = valueElement.nextElementSibling;

        leftArrow.addEventListener('click', () => {
            let newValue = currentValue - 1;
            if (newValue < 0) newValue = options.length - 1;
            valueElement.textContent = options[newValue];
            callback(newValue);
            currentValue = newValue;
        });

        rightArrow.addEventListener('click', () => {
            let newValue = currentValue + 1;
            if (newValue >= options.length) newValue = 0;
            valueElement.textContent = options[newValue];
            callback(newValue);
            currentValue = newValue;
        });
    }

    function setupDrag() {
        const header = document.getElementById('cwe-header');
        const container = document.getElementById('cwe-container');

        header.addEventListener('mousedown', function(e) {
            if (e.target !== header) return;
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            const rect = container.getBoundingClientRect();
            elementStartX = rect.left;
            elementStartY = rect.top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            container.style.left = (elementStartX + dx) + 'px';
            container.style.top = (elementStartY + dy) + 'px';
            e.preventDefault();
        });

        document.addEventListener('mouseup', function() {
            if (!isDragging) return;
            isDragging = false;
            const rect = container.getBoundingClientRect();
            config.posX = Math.min(Math.max(rect.left, 0), window.innerWidth - 200);
            config.posY = Math.min(Math.max(rect.top, 0), window.innerHeight - 30);
            GM_setValue('posX', config.posX);
            GM_setValue('posY', config.posY);
            container.style.left = config.posX + 'px';
            container.style.top = config.posY + 'px';
        });
    }

    function toggleUI(e) {
        if (isDragging) return;
        const content = document.getElementById('cwe-content');
        const header = document.getElementById('cwe-header');

        if (content.style.display === 'block') {
            content.style.display = 'none';
            header.innerHTML = 'Blackwood FightEnhancer ▼';
            document.getElementById('cwe-container').style.height = '30px';
        } else {
            content.style.display = 'block';
            header.innerHTML = 'Blackwood FightEnhancer ▲';
            document.getElementById('cwe-container').style.height = 'auto';
        }
    }

    function updateArrowId() {
        config.arrowId = this.value;
        GM_setValue('arrowId', config.arrowId);
        stopArrowTimers();
        if (config.diagonalSkin) {
            stopDiagonalSkin();
            startDiagonalSkin();
        }
    }

    function toggleEnergyTracker() {
        const element = document.getElementById('cwe-energy-tracker');
        element.classList.toggle('active');
        config.energyTracker = !config.energyTracker;
        GM_setValue('energyTracker', config.energyTracker);
        if (config.energyTracker) startEnergyTracker();
        else stopEnergyTracker();
    }

    function toggleDamageSkins() {
        const element = document.getElementById('cwe-damage-skins');
        element.classList.toggle('active');
        config.damageSkins = !config.damageSkins;
        GM_setValue('damageSkins', config.damageSkins);
        if (config.damageSkins) startDamageSkins();
        else stopDamageSkins();
    }

    function toggleDiagonalSkin() {
        const element = document.getElementById('cwe-diagonal-skin');
        element.classList.toggle('active');
        config.diagonalSkin = !config.diagonalSkin;
        GM_setValue('diagonalSkin', config.diagonalSkin);
        if (config.diagonalSkin) startDiagonalSkin();
        else stopDiagonalSkin();
    }

    function toggleRemoveCostumes() {
        const element = document.getElementById('cwe-remove-costumes');
        element.classList.toggle('active');
        config.removeCostumes = !config.removeCostumes;
        GM_setValue('removeCostumes', config.removeCostumes);
        if (config.removeCostumes) {
            startRemoveCostumes();
        } else {
            stopRemoveCostumes();
            // Принудительно обновляем костюмы после выключения
            setTimeout(() => {
                const allCats = document.querySelectorAll(".catWithArrow, .cat");
                allCats.forEach(catWrapper => {
                    const divs = catWrapper.querySelectorAll("div");
                    divs.forEach(div => {
                        if (isCostumeLayer(div)) {
                            div.style.display = "";
                        }
                    });
                });
            }, 100);
        }
    }

    function toggleDangerSkins() {
        const element = document.getElementById('cwe-danger-skins');
        element.classList.toggle('active');
        config.dangerSkins = !config.dangerSkins;
        GM_setValue('dangerSkins', config.dangerSkins);
        if (config.dangerSkins) startDangerSkins();
        else stopDangerSkins();
    }

    function updateGridStyle() {
        if (gridStyleElement) {
            gridStyleElement.remove();
            gridStyleElement = null;
        }

        if (config.gridMode > 0) {
            gridStyleElement = document.createElement('style');
            gridStyleElement.id = 'cwe-grid-style';
            gridStyleElement.textContent = GRID_STYLES[config.gridMode];
            document.head.appendChild(gridStyleElement);
        }
    }

    function isCostumeLayer(div) {
        const style = div.getAttribute("style");
        return style && style.includes("/cw3/cats/0/costume/");
    }

    function processCostumes() {
        const allCats = document.querySelectorAll(".catWithArrow, .cat");
        allCats.forEach(catWrapper => {
            const divs = catWrapper.querySelectorAll("div");
            divs.forEach(div => {
                if (isCostumeLayer(div)) {
                    div.style.display = config.removeCostumes ? "none" : "";
                }
            });
        });
    }

    function startRemoveCostumes() {
        if (costumeObserver) return;
        processCostumes();
        costumeObserver = new MutationObserver(processCostumes);
        costumeObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        window.addEventListener("load", processCostumes);
        setTimeout(processCostumes, 1500);
    }

    function stopRemoveCostumes() {
        if (!costumeObserver) return;
        costumeObserver.disconnect();
        costumeObserver = null;

        const allCats = document.querySelectorAll(".catWithArrow, .cat");
        allCats.forEach(catWrapper => {
            const divs = catWrapper.querySelectorAll("div");
            divs.forEach(div => {
                if (isCostumeLayer(div)) {
                    div.style.display = "";
                }
            });
        });
    }

    // ТРЕКЕР ЭНЕРГИИ
    function updateEnergyBars() {
        const now = Date.now();
        if (now - lastEnergyUpdate < ENERGY_UPDATE_DELAY) return;
        lastEnergyUpdate = now;

        document.querySelectorAll('.energy-percent-final').forEach(ind => {
            ind.style.display = 'none';
        });

        document.querySelectorAll('.arrow').forEach(arrow => {
            const red = arrow.querySelector('.arrow_red');
            const green = arrow.querySelector('.arrow_green');
            if (!green || !red) return;

            const greenWidth = parseFloat(green.style.width) || 0;
            const redWidth = parseFloat(red.style.width) || 0;
            const total = greenWidth + redWidth;
            if (total === 0) return;

            const percent = Math.round((greenWidth / total) * 100);
            const cage = arrow.closest('.cage');
            if (!cage) return;

            let indicator = cage.querySelector('.energy-percent-final');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.className = 'energy-percent-final';
                cage.style.position = 'relative';
                cage.appendChild(indicator);
            }

            if (percent <= 0) {
                indicator.style.color = '#FF0000';
                indicator.textContent = `💀 ${percent}% DEAD`;
            }
            else if (percent <= 25) {
                indicator.style.color = '#FFA500';
                indicator.textContent = `🔋 ${percent}%`;
            }
            else if (percent <= 50) {
                indicator.style.color = '#FFFF00';
                indicator.textContent = `🔋 ${percent}%`;
            }
            else {
                indicator.style.color = '#00FF00';
                indicator.textContent = `🔋 ${percent}%`;
            }

            indicator.style.display = 'block';
        });
    }

    function startEnergyTracker() {
        if (energyTrackerInterval) return;
        energyTrackerInterval = setInterval(updateEnergyBars, 10);
    }

    function stopEnergyTracker() {
        if (!energyTrackerInterval) return;
        clearInterval(energyTrackerInterval);
        energyTrackerInterval = null;
        document.querySelectorAll('.energy-percent-final').forEach(ind => {
            ind.style.display = 'none';
        });
    }

    // УРОНКИ
    function applyDamageSkins() {
        if (!config.damageSkins) return;

        document.querySelectorAll('span.cat').forEach(cat => {
            const layers = cat.querySelectorAll('div[style*="background-size"]');
            if (!layers.length) return;

            const sizeMatch = layers[0].style.backgroundSize.match(/(\d+)%/);
            if (!sizeMatch) return;

            const size = parseInt(sizeMatch[1]);
            if (isNaN(size) || size < DAMAGE_SKIN_CONFIG.minSize || size > DAMAGE_SKIN_CONFIG.maxSize) return;
            if (cat.querySelector('.mashroom-costume')) return;

            const img = document.createElement('img');
            img.src = DAMAGE_SKIN_CONFIG.url;
            img.className = 'mashroom-costume';
            img.style.width = `${size}%`;
            cat.insertBefore(img, cat.firstChild);
        });
    }

    function startDamageSkins() {
        if (damageSkinObserver) return;
        applyDamageSkins();
        damageSkinObserver = new MutationObserver(() => applyDamageSkins());
        damageSkinObserver.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('load', applyDamageSkins);
        setTimeout(applyDamageSkins, 2000);
    }

    function stopDamageSkins() {
        if (!damageSkinObserver) return;
        damageSkinObserver.disconnect();
        damageSkinObserver = null;
        document.querySelectorAll('.mashroom-costume').forEach(costume => {
            costume.remove();
        });
    }

    // ДИАГОНАЛИ
    function applyDiagonalSkins() {
        if (!config.diagonalSkin) return;

        const arrowId = 'arrow' + config.arrowId;
        const playerArrow = document.getElementById(arrowId);
        if (!playerArrow) return;

        const playerCat = playerArrow.closest('.catWithArrow');
        if (!playerCat) return;

        const catElement = playerCat.querySelector('.cat');
        if (!catElement) return;

        if (catElement.querySelector('.' + DIAGONAL_SKIN_CONFIG.className)) return;

        const layers = catElement.querySelectorAll('div[style*="background-size"]');
        if (!layers.length) return;

        const sizeMatch = layers[0].style.backgroundSize.match(/(\d+)%/);
        if (!sizeMatch) return;

        const size = parseInt(sizeMatch[1]);
        if (isNaN(size) || size < DIAGONAL_SKIN_CONFIG.minSize || size > DIAGONAL_SKIN_CONFIG.maxSize) return;

        const diagonalElement = document.createElement('img');
        diagonalElement.src = DIAGONAL_SKIN_CONFIG.url;
        diagonalElement.className = DIAGONAL_SKIN_CONFIG.className;
        diagonalElement.style.position = 'absolute';
        diagonalElement.style.width = `${size}%`;
        diagonalElement.style.height = 'auto';
        diagonalElement.style.top = '0';
        diagonalElement.style.left = '0';
        diagonalElement.style.pointerEvents = 'none';
        diagonalElement.style.zIndex = DIAGONAL_SKIN_CONFIG.zIndex;

        catElement.insertBefore(diagonalElement, catElement.firstChild);
    }

    function startDiagonalSkin() {
        if (!config.diagonalSkin) return;

        applyDiagonalSkins();

        if (!diagonalSkinObserver) {
            diagonalSkinObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes) {
                        applyDiagonalSkins();
                    }
                });
            });

            diagonalSkinObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        if (!diagonalSkinInterval) {
            diagonalSkinInterval = setInterval(applyDiagonalSkins, 500);
        }
    }

    function stopDiagonalSkin() {
        document.querySelectorAll('.' + DIAGONAL_SKIN_CONFIG.className).forEach(el => el.remove());

        if (diagonalSkinObserver) {
            diagonalSkinObserver.disconnect();
            diagonalSkinObserver = null;
        }

        if (diagonalSkinInterval) {
            clearInterval(diagonalSkinInterval);
            diagonalSkinInterval = null;
        }
    }

    // ОПАСКИ
    function applyDangerSkins() {
        if (!config.dangerSkins) return;

        const styles = `
            [style*='/cw3/cats/0/defects/wound/4'] {
                background-image: url(https://i.ibb.co/LhsWZ8D/4.png) !important;
            }
            [style*='/cw3/cats/0/defects/wound/3'] {
                background-image: url(https://i.ibb.co/CvrMZgK/3.png) !important;
            }
            [style*='/cw3/cats/0/defects/wound/2'] {
                background-image: url(https://i.ibb.co/1zKsFnm/2.png) !important;
            }
            [style*='/cw3/cats/0/defects/wound/1'] {
                background-image: url(https://i.ibb.co/S7DBv7m/1.png) !important;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.id = 'danger-skins-style';
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    function startDangerSkins() {
        if (dangerSkinObserver) return;
        applyDangerSkins();
        dangerSkinObserver = new MutationObserver(() => applyDangerSkins());
        dangerSkinObserver.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('load', applyDangerSkins);
        setTimeout(applyDangerSkins, 2000);
    }

    function stopDangerSkins() {
        if (!dangerSkinObserver) return;
        dangerSkinObserver.disconnect();
        dangerSkinObserver = null;
        const styleElement = document.getElementById('danger-skins-style');
        if (styleElement) {
            styleElement.remove();
        }
    }

    // ОСНОВНЫЕ ФУНКЦИИ
    function getArrowPosition() {
        if (config.arrowFixMode === 0) return null;
        const arrowId = 'arrow' + config.arrowId;
        const arrow = document.getElementById(arrowId);
        if (!arrow) return null;
        const style = window.getComputedStyle(arrow);
        const transform = style.transform || style.webkitTransform;
        if (!transform || transform === 'none') return null;
        const values = transform.match(/matrix\((.+)\)/)?.[1].split(', ');
        if (!values) return null;
        const angle = Math.atan2(parseFloat(values[1]), parseFloat(values[0])) * (180 / Math.PI);
        return (angle + 360) % 360;
    }

    function pressArrowKey(code) {
        if (config.arrowFixMode === 0) return;
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: code === 'KeyL' ? 'l' : 'j',
            code: code,
            keyCode: code === 'KeyL' ? 76 : 74,
            bubbles: true,
            cancelable: true
        }));
    }

    function checkArrowMovement() {
        if (config.arrowFixMode === 0 || (!ARROW_KEYS.KeyL && !ARROW_KEYS.KeyJ)) {
            stopArrowTimers();
            return;
        }

        const currentPos = getArrowPosition();
        if (currentPos === null) return;

        ['KeyL','KeyJ'].forEach(code => {
            if (!ARROW_KEYS[code]) {
                lastArrowPos[code] = null;
                return;
            }
            if (lastArrowPos[code] === null) {
                lastArrowPos[code] = currentPos;
                return;
            }
            const angleDiff = Math.abs(currentPos - lastArrowPos[code]);
            const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);
            if (normalizedDiff < arrowConfig.threshold) {
                if (!arrowTimers.repeat) {
                    pressArrowKey(code);
                    arrowTimers.repeat = setInterval(() => {
                        ['KeyL','KeyJ'].forEach(k => ARROW_KEYS[k] && pressArrowKey(k));
                    }, arrowConfig.repeat);
                }
            } else if (arrowTimers.repeat) {
                clearInterval(arrowTimers.repeat);
                arrowTimers.repeat = null;
            }
            lastArrowPos[code] = currentPos;
        });
    }

    function startArrowCheck() {
        if (config.arrowFixMode === 0 || arrowTimers.check) return;
        arrowTimers.check = setInterval(checkArrowMovement, arrowConfig.check);
    }

    function stopArrowTimers() {
        clearInterval(arrowTimers.check);
        clearInterval(arrowTimers.repeat);
        arrowTimers = {check:null, repeat:null};
        lastArrowPos = {KeyL:null, KeyJ:null};
    }

    function sendKeyPress() {
        if (!isMovementKeyDown || !currentMovementKey || config.speedMode === 0) return;
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: currentMovementKey.replace('Key','').toLowerCase(),
            code: currentMovementKey,
            keyCode: getKeyCode(currentMovementKey),
            bubbles: true,
            cancelable: true
        }));
    }

    function getKeyCode(key) {
        const keyMap = {
            'KeyA':65, 'KeyD':68, 'KeyW':87, 'KeyS':83,
            'KeyQ':81, 'KeyE':69, 'KeyZ':90, 'KeyX':88
        };
        return keyMap[key] || 0;
    }

    function startMovementRepeat() {
        if (!isMovementKeyDown || config.speedMode === 0) return;
        sendKeyPress();
        movementTimers.repeat = setInterval(sendKeyPress, REPEAT_INTERVAL);
    }

    function stopMovementRepeat() {
        clearTimeout(movementTimers.hold);
        clearInterval(movementTimers.repeat);
        movementTimers = {repeat:null, hold:null};
    }

    document.addEventListener('keydown', e => {
        if (MOVEMENT_KEYS.includes(e.code)) {
            if (!isMovementKeyDown && !currentMovementKey) {
                isMovementKeyDown = true;
                currentMovementKey = e.code;
                movementTimers.hold = setTimeout(startMovementRepeat, HOLD_DELAY);
            }
        } else if (['KeyL','KeyJ'].includes(e.code) && !ARROW_KEYS[e.code]) {
            ARROW_KEYS[e.code] = true;
            startArrowCheck();
        }
    });

    document.addEventListener('keyup', e => {
        if (MOVEMENT_KEYS.includes(e.code) && currentMovementKey === e.code) {
            isMovementKeyDown = false;
            currentMovementKey = null;
            stopMovementRepeat();
        } else if (['KeyL','KeyJ'].includes(e.code)) {
            ARROW_KEYS[e.code] = false;
            if (!ARROW_KEYS.KeyL && !ARROW_KEYS.KeyJ) stopArrowTimers();
        }
    });

    createUI();
})();