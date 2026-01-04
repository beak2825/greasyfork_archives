// ==UserScript==
// @name         📘点击全屏翻页丨自定义翻页区域丨点击翻页丨悬浮窗设置丨电纸书墨水屏
// @version      1.0
// @license      GPL
// @match        *://*/*
// @description  👍通过点击页面上下左右不同区域快速翻页，支持自定义翻页比例及区域，可选择禁用页面其他区域点击，只允许悬浮窗和设置窗口操作。轻松实现高效的页面浏览体验。
// @namespace https://greasyfork.org/users/1292046
// @downloadURL https://update.greasyfork.org/scripts/499063/%F0%9F%93%98%E7%82%B9%E5%87%BB%E5%85%A8%E5%B1%8F%E7%BF%BB%E9%A1%B5%E4%B8%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BF%BB%E9%A1%B5%E5%8C%BA%E5%9F%9F%E4%B8%A8%E7%82%B9%E5%87%BB%E7%BF%BB%E9%A1%B5%E4%B8%A8%E6%82%AC%E6%B5%AE%E7%AA%97%E8%AE%BE%E7%BD%AE%E4%B8%A8%E7%94%B5%E7%BA%B8%E4%B9%A6%E5%A2%A8%E6%B0%B4%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/499063/%F0%9F%93%98%E7%82%B9%E5%87%BB%E5%85%A8%E5%B1%8F%E7%BF%BB%E9%A1%B5%E4%B8%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BF%BB%E9%A1%B5%E5%8C%BA%E5%9F%9F%E4%B8%A8%E7%82%B9%E5%87%BB%E7%BF%BB%E9%A1%B5%E4%B8%A8%E6%82%AC%E6%B5%AE%E7%AA%97%E8%AE%BE%E7%BD%AE%E4%B8%A8%E7%94%B5%E7%BA%B8%E4%B9%A6%E5%A2%A8%E6%B0%B4%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let LANG = {
        en: {
            buttons: {
                toggle: 'Close',
                settings: 'Settings'
            },
            settings: {
                reserveHeightUpper: 'Reserved Height Percentage (Upper)',
                reserveHeightLower: 'Reserved Height Percentage (Lower)',
                pageMode: 'Page Turn Mode',
                upDown: 'Up/Down',
                downUp: 'Down/Up',
                leftRight: 'Left/Right',
                rightLeft: 'Right/Left',
                upperPart: 'Enable Upper Part',
                lowerPart: 'Enable Lower Part',
                disablePageClick: 'Disable Page Click When Open',
                save: 'Save',
                close: 'Close',
                pageTurnUpper: 'Page Turn Percentage (Upper/Left)',
                pageTurnLower: 'Page Turn Percentage (Lower/Right)'
            }
        }
    };

    const userLang = navigator.language.slice(0, 2);
    const currentLang = LANG[userLang] ? userLang : 'en';

    const state = {
        isEnabled: GM_getValue('isEnabled', false),
        reservedHeightUpperPercentage: GM_getValue('reservedHeightUpperPercentage', 50),
        reservedHeightLowerPercentage: GM_getValue('reservedHeightLowerPercentage', 50),
        pageTurnMode: GM_getValue('pageTurnMode', 'upDown'),
        enableUpperPart: GM_getValue('enableUpperPart', true),
        enableLowerPart: GM_getValue('enableLowerPart', true),
        floatWindowLeft: GM_getValue('floatWindowLeft', 'calc(100% - 110px)'),
        floatWindowTop: GM_getValue('floatWindowTop', 'calc(100% - 70px)'),
        disablePageClick: GM_getValue('disablePageClick', false),
        pageTurnUpperPercentage: GM_getValue('pageTurnUpperPercentage', 20),
        pageTurnLowerPercentage: GM_getValue('pageTurnLowerPercentage', 30)
    };

    const floatWindow = document.createElement('div');
    const toggleButton = document.createElement('button');
    const settingsButton = document.createElement('button');

    const updateToggleButton = () => {
        toggleButton.innerHTML = state.isEnabled ? 'Open' : 'Close';
    };

    const createTransparentLayer = () => {
        const layer = document.createElement('div');
        layer.id = 'transparentLayer';
        layer.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0);
            z-index: 9999;
            pointer-events: auto;
        `;
        document.body.appendChild(layer);
        return layer;
    };

    const transparentLayer = createTransparentLayer();
    transparentLayer.style.display = 'none';

    toggleButton.onclick = (e) => {
        e.stopPropagation();
        state.isEnabled = !state.isEnabled;
        GM_setValue('isEnabled', state.isEnabled);
        updateToggleButton();

        if (state.isEnabled && state.disablePageClick) {
            transparentLayer.style.display = 'block';
        } else {
            transparentLayer.style.display = 'none';
        }
    };

    settingsButton.innerHTML = LANG[currentLang].buttons.settings;
    settingsButton.onclick = (e) => {
        e.stopPropagation();
        showSettings();
    };

    floatWindow.id = 'clickPageTurnerWindow';
    floatWindow.style = `
        position: fixed;
        left: ${state.floatWindowLeft};
        top: ${state.floatWindowTop};
        width: 100px;
        height: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        z-index: 10001;
        cursor: pointer;
    `;

    const applyDraggable = (element) => {
        let isDragging = false;
        let dragOffsetX, dragOffsetY;

        element.addEventListener('mousedown', (event) => {
            isDragging = true;
            dragOffsetX = element.offsetLeft - event.clientX;
            dragOffsetY = element.offsetTop - event.clientY;
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                element.style.left = event.clientX + dragOffsetX + 'px';
                element.style.top = event.clientY + dragOffsetY + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                GM_setValue('floatWindowLeft', element.style.left);
                GM_setValue('floatWindowTop', element.style.top);
                isDragging = false;
            }
        });
    };

    applyDraggable(floatWindow);

    floatWindow.appendChild(toggleButton);
    floatWindow.appendChild(settingsButton);
    document.body.appendChild(floatWindow);

    const showSettings = () => {
        state.isEnabled = false;
        updateToggleButton();

        const settingsWindow = document.createElement('div');
        settingsWindow.classList.add('settings-window');
        settingsWindow.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            background-color: white;
            color: black;
            border: 1px solid #ccc;
            z-index: 10001;
            padding: 20px;
            border-radius: 5px;
        `;

        const closeButton = document.createElement('button');
        closeButton.innerHTML = LANG[currentLang].settings.close;
        closeButton.style = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 16px;
            color: black;
            cursor: pointer;
        `;
        closeButton.onclick = () => {
            document.body.removeChild(settingsWindow);
            if (state.isEnabled) {
                state.isEnabled = true;
                updateToggleButton();
            }
        };

        settingsWindow.appendChild(closeButton);

        const settingsContainer = document.createElement('div');
        settingsContainer.style = `
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        `;

        const createPercentageInput = (labelText, value, min, max, onChange) => {
            const container = document.createElement('div');
            container.style = `
                display: flex;
                justify-content: space-between;
                width: 100%;
                margin-bottom: 10px;
            `;

            const label = document.createElement('label');
            label.innerText = labelText;
            container.appendChild(label);

            const input = document.createElement('input');
            input.type = 'number';
            input.value = value;
            input.min = min;
            input.max = max;
            input.oninput = onChange;

            container.appendChild(input);
            return container;
        };

        const reserveHeightUpperInput = createPercentageInput(LANG[currentLang].settings.reserveHeightUpper, state.reservedHeightUpperPercentage, 0, 100, (e) => {
            state.reservedHeightUpperPercentage = parseInt(e.target.value, 10);
        });
        const reserveHeightLowerInput = createPercentageInput(LANG[currentLang].settings.reserveHeightLower, state.reservedHeightLowerPercentage, 0, 100, (e) => {
            state.reservedHeightLowerPercentage = parseInt(e.target.value, 10);
        });
        settingsContainer.appendChild(reserveHeightUpperInput);
        settingsContainer.appendChild(reserveHeightLowerInput);

        const pageTurnUpperInput = createPercentageInput(LANG[currentLang].settings.pageTurnUpper, state.pageTurnUpperPercentage, 0, 100, (e) => {
            state.pageTurnUpperPercentage = parseInt(e.target.value, 10);
        });
        const pageTurnLowerInput = createPercentageInput(LANG[currentLang].settings.pageTurnLower, state.pageTurnLowerPercentage, 0, 100, (e) => {
            state.pageTurnLowerPercentage = parseInt(e.target.value, 10);
        });
        settingsContainer.appendChild(pageTurnUpperInput);
        settingsContainer.appendChild(pageTurnLowerInput);

        const createDropdown = (labelText, options, selectedValue, onChange) => {
            const container = document.createElement('div');
            container.style = `
                display: flex;
                justify-content: space-between;
                width: 100%;
                margin-bottom: 10px;
            `;

            const label = document.createElement('label');
            label.innerText = labelText;
            container.appendChild(label);

            const select = document.createElement('select');
            options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.innerText = option.text;
                if (option.value === selectedValue) {
                    opt.selected = true;
                }
                select.appendChild(opt);
            });
            select.onchange = onChange;
            container.appendChild(select);
            return container;
        };

        const pageModeOptions = [{
                value: 'upDown',
                text: LANG[currentLang].settings.upDown
            },
            {
                value: 'downUp',
                text: LANG[currentLang].settings.downUp
            },
            {
                value: 'leftRight',
                text: LANG[currentLang].settings.leftRight
            },
            {
                value: 'rightLeft',
                text: LANG[currentLang].settings.rightLeft
            }
        ];

        const pageModeDropdown = createDropdown(LANG[currentLang].settings.pageMode, pageModeOptions, state.pageTurnMode, (e) => {
            state.pageTurnMode = e.target.value;
        });
        settingsContainer.appendChild(pageModeDropdown);

        const createCheckbox = (labelText, checked, onChange) => {
            const container = document.createElement('div');
            container.style = `
                display: flex;
                justify-content: space-between;
                width: 100%;
                margin-bottom: 10px;
            `;

            const label = document.createElement('label');
            label.innerText = labelText;
            container.appendChild(label);

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = checked;
            input.onchange = onChange;

            container.appendChild(input);
            return container;
        };

        const upperPartCheckbox = createCheckbox(LANG[currentLang].settings.upperPart, state.enableUpperPart, (e) => {
            state.enableUpperPart = e.target.checked;
        });
        settingsContainer.appendChild(upperPartCheckbox);

        const lowerPartCheckbox = createCheckbox(LANG[currentLang].settings.lowerPart, state.enableLowerPart, (e) => {
            state.enableLowerPart = e.target.checked;
        });
        settingsContainer.appendChild(lowerPartCheckbox);

        const disablePageClickCheckbox = createCheckbox(LANG[currentLang].settings.disablePageClick, state.disablePageClick, (e) => {
            state.disablePageClick = e.target.checked;
        });
        settingsContainer.appendChild(disablePageClickCheckbox);

        const saveButton = document.createElement('button');
        saveButton.innerHTML = LANG[currentLang].settings.save;
        saveButton.onclick = () => {
            const upperPercentage = state.reservedHeightUpperPercentage;
            const lowerPercentage = state.reservedHeightLowerPercentage;
            const pageTurnUpper = state.pageTurnUpperPercentage;
            const pageTurnLower = state.pageTurnLowerPercentage;

            if (upperPercentage + lowerPercentage <= 100 && upperPercentage >= 0 && lowerPercentage >= 0 &&
                pageTurnUpper + pageTurnLower <= 100 && pageTurnUpper >= 0 && pageTurnLower >= 0) {
                GM_setValue('reservedHeightUpperPercentage', upperPercentage);
                GM_setValue('reservedHeightLowerPercentage', lowerPercentage);
                GM_setValue('pageTurnMode', state.pageTurnMode);
                GM_setValue('enableUpperPart', state.enableUpperPart);
                GM_setValue('enableLowerPart', state.enableLowerPart);
                GM_setValue('disablePageClick', state.disablePageClick);
                GM_setValue('pageTurnUpperPercentage', pageTurnUpper);
                GM_setValue('pageTurnLowerPercentage', pageTurnLower);
                document.body.removeChild(settingsWindow);
                location.reload();
            } else {
                alert('The combined percentages must be between 0% and 100%.');
            }
        };
        settingsContainer.appendChild(saveButton);

        settingsWindow.appendChild(settingsContainer);
        document.body.appendChild(settingsWindow);
    };

    const handlePageTurn = (e) => {
        if (!state.isEnabled) return;

        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;

        const pageTurnUpper = screenHeight * state.pageTurnUpperPercentage / 100;
        const pageTurnLower = screenHeight * state.pageTurnLowerPercentage / 100;

        const isLeftPart = e.clientX < screenWidth * state.pageTurnUpperPercentage / 100;
        const isRightPart = e.clientX > screenWidth * (1 - state.pageTurnLowerPercentage / 100);
        const isUpperPart = e.clientY < screenHeight * state.pageTurnUpperPercentage / 100;
        const isLowerPart = e.clientY > screenHeight * (1 - state.pageTurnLowerPercentage / 100);

        if (state.pageTurnMode === 'upDown' || state.pageTurnMode === 'downUp') {
            if (isUpperPart && state.enableUpperPart) {
                window.scrollBy(0, state.pageTurnMode === 'upDown' ? -(screenHeight - pageTurnUpper) : screenHeight - pageTurnUpper);
            } else if (isLowerPart && state.enableLowerPart) {
                window.scrollBy(0, state.pageTurnMode === 'upDown' ? screenHeight - pageTurnLower : -(screenHeight - pageTurnLower));
            }
        } else if (state.pageTurnMode === 'leftRight' || state.pageTurnMode === 'rightLeft') {
            if (isLeftPart) {
                if (state.pageTurnMode === 'leftRight') {
                    window.scrollBy(0, -(screenHeight - pageTurnUpper));
                } else {
                    window.scrollBy(0, screenHeight - pageTurnLower);
                }
            } else if (isRightPart) {
                if (state.pageTurnMode === 'leftRight') {
                    window.scrollBy(0, screenHeight - pageTurnLower);
                } else {
                    window.scrollBy(0, -(screenHeight - pageTurnUpper));
                }
            }
        }
    };

    document.addEventListener('click', handlePageTurn);

    updateToggleButton();
})();