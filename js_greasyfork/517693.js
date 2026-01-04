// ==UserScript==
// @name         一括受発注チェック
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  条件に基づいてチェックボックスを一括操作
// @license      MIT
// @match        *://plus-nao.com/forests/*/sku_check/*
// @match        *://plus-nao.com/forests/*/sku_edit/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/517693/%E4%B8%80%E6%8B%AC%E5%8F%97%E7%99%BA%E6%B3%A8%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/517693/%E4%B8%80%E6%8B%AC%E5%8F%97%E7%99%BA%E6%B3%A8%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let selectedHorizontal = [];
    let selectedVertical = [];

    let horizontalAxisNames = [];
    let verticalAxisNames = [];

    const rows = document.querySelectorAll('table.formdot tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 3) {
            const horizontal = cells[2].textContent.trim();
            const vertical = cells[3].textContent.trim();

            if (horizontal && !horizontalAxisNames.includes(horizontal)) {
                horizontalAxisNames.push(horizontal);
            }
            if (vertical && !verticalAxisNames.includes(vertical)) {
                verticalAxisNames.push(vertical);
            }
        }
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'custom-button-container';
    document.body.appendChild(buttonContainer);

    createAxisButtons('横軸', horizontalAxisNames, 'horizontal', buttonContainer);
    createAxisButtons('縦軸', verticalAxisNames, 'vertical', buttonContainer);

    const onOffContainer = document.createElement('div');
    onOffContainer.id = 'on-off-container';
    buttonContainer.appendChild(onOffContainer);

    const onButton = createActionButton('オン', () => toggleCheckboxes(true));
    const offButton = createActionButton('オフ', () => toggleCheckboxes(false));
    onOffContainer.appendChild(onButton);
    onOffContainer.appendChild(offButton);

    const hideButton = document.createElement('button');
    hideButton.textContent = '-';
    hideButton.id = 'hide-button';
    buttonContainer.appendChild(hideButton);
    hideButton.onclick = hideContainer;

    const showButton = document.createElement('button');
    showButton.textContent = '+';
    showButton.id = 'show-button';
    showButton.style.position = 'fixed';
    showButton.style.right = '25px';
    showButton.style.top = '50%';
    showButton.style.transform = 'translateY(-50%)';
    document.body.appendChild(showButton);
    showButton.onclick = showContainer;

    const configButton = document.createElement('button');
    configButton.textContent = '⚙';
    configButton.id = 'config-button';
    buttonContainer.appendChild(configButton);

    configButton.onclick = () => {
        const isHidden = toggleRememberStateButton.style.display === 'none';
        toggleRememberStateButton.style.display = isHidden ? 'block' : 'none';
    };

    const toggleRememberStateButton = document.createElement('button');
    toggleRememberStateButton.textContent = getRememberState() ? '表示状態の記憶: オン' : '表示状態の記憶: オフ';
    toggleRememberStateButton.id = 'toggle-remember-state';
    toggleRememberStateButton.style.display = 'none';
    toggleRememberStateButton.style.position = 'absolute';
    toggleRememberStateButton.style.bottom = '-24px';
    toggleRememberStateButton.style.left = '-2px';
    toggleRememberStateButton.title = 'オン: リロード時は最後の表示状態を維持\nオフ: リロード時は常に展開';
    buttonContainer.appendChild(toggleRememberStateButton);
    toggleRememberStateButton.onclick = toggleRememberState;

    window.addEventListener('load', restoreState);

    function createAxisButtons(label, axisNames, axis, container) {
        const axisContainer = document.createElement('div');
        axisContainer.classList.add('axis-container');

        const axisLabel = document.createElement('div');
        axisLabel.textContent = label;
        axisLabel.classList.add('axis-label');
        axisContainer.appendChild(axisLabel);

        axisNames.forEach(name => {
            const button = document.createElement('button');
            button.textContent = name;
            button.classList.add('axis-button');
            button.dataset.axis = axis;
            button.dataset.name = name;
            button.onclick = () => toggleSelection(button, axis, name);
            axisContainer.appendChild(button);
        });

        container.appendChild(axisContainer);
    }

    function toggleSelection(button, axis, name) {
        if (axis === 'horizontal') {
            if (selectedHorizontal.includes(name)) {
                selectedHorizontal = selectedHorizontal.filter(item => item !== name);
            } else {
                selectedHorizontal.push(name);
            }
        } else if (axis === 'vertical') {
            if (selectedVertical.includes(name)) {
                selectedVertical = selectedVertical.filter(item => item !== name);
            } else {
                selectedVertical.push(name);
            }
        }
        updateButtonStyles();
    }

    function updateButtonStyles() {
        document.querySelectorAll('.axis-button[data-axis="horizontal"]').forEach(button => {
            button.classList.toggle('selected', selectedHorizontal.includes(button.dataset.name));
        });
        document.querySelectorAll('.axis-button[data-axis="vertical"]').forEach(button => {
            button.classList.toggle('selected', selectedVertical.includes(button.dataset.name));
        });
    }

    function toggleCheckboxes(state) {
        let feedbackMessage = '';

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const checkbox = row.querySelector('td input[type="checkbox"]');
            if (cells.length > 3 && checkbox) {
                const horizontal = cells[2].textContent.trim();
                const vertical = cells[3].textContent.trim();

                if (selectedHorizontal.length > 0 && selectedVertical.length > 0) {
                    if (selectedHorizontal.includes(horizontal) && selectedVertical.includes(vertical)) {
                        checkbox.checked = state;
                        feedbackMessage = `「${selectedHorizontal.join('」「')}」 と 「${selectedVertical.join('」「')}」 の条件に一致する項目を変更しました。`;
                    }
                } else if (selectedHorizontal.length > 0 && selectedVertical.length === 0) {
                    if (selectedHorizontal.includes(horizontal)) {
                        checkbox.checked = state;
                        feedbackMessage = `「${selectedHorizontal.join('」「')}」 に一致する項目を変更しました。`;
                    }
                } else if (selectedVertical.length > 0 && selectedHorizontal.length === 0) {
                    if (selectedVertical.includes(vertical)) {
                        checkbox.checked = state;
                        feedbackMessage = `「${selectedVertical.join('」「')}」 に一致する項目を変更しました。`;
                    }
                }
            }
        });

        if (!feedbackMessage) {
            feedbackMessage = '選択条件がありません。';
        }

        displayFeedback(feedbackMessage);
    }

    function createActionButton(label, callback) {
        const button = document.createElement('button');
        button.textContent = label;
        button.classList.add('on-off-button');
        button.onclick = callback;
        return button;
    }

    function displayFeedback(message) {
        let feedbackDiv = document.getElementById('feedback-message');

        if (!feedbackDiv) {
            feedbackDiv = document.createElement('div');
            feedbackDiv.id = 'feedback-message';
            document.body.appendChild(feedbackDiv);
        }

        feedbackDiv.textContent = message;
        feedbackDiv.style.display = 'block';

        setTimeout(() => {
            feedbackDiv.style.display = 'none';
        }, 3000);
    }

    function hideContainer() {
        const container = document.getElementById('custom-button-container');
        const showButton = document.getElementById('show-button');
        container.style.display = 'none';
        showButton.style.display = 'block';
        if (getRememberState()) {
            localStorage.setItem('buttonContainerState', 'hidden');
        }
    }

    function showContainer() {
        const container = document.getElementById('custom-button-container');
        const showButton = document.getElementById('show-button');
        container.style.display = 'grid';
        showButton.style.display = 'none';
        if (getRememberState()) {
            localStorage.setItem('buttonContainerState', 'visible');
        }
    }

    function restoreState() {
        if (getRememberState()) {
            const savedState = localStorage.getItem('buttonContainerState');
            const container = document.getElementById('custom-button-container');
            const showButton = document.getElementById('show-button');

            if (savedState === 'hidden') {
                container.style.display = 'none';
                showButton.style.display = 'block';
            } else {
                container.style.display = 'grid';
                showButton.style.display = 'none';
            }
        }
    }

    function toggleRememberState() {
        const currentState = getRememberState();
        localStorage.setItem('rememberState', currentState ? 'false' : 'true');
        toggleRememberStateButton.textContent = currentState ? '表示状態の記憶: オフ' : '表示状態の記憶: オン';
    }

    function getRememberState() {
        return localStorage.getItem('rememberState') !== 'false';
    }

    GM_addStyle(`
        #custom-button-container {
            position: fixed;
            top: 50%;
            right: 10px;
            min-width: 150px;
            transform: translateY(-50%);
            background-color: #fff;
            padding: 10px 20px;
            border: 1px solid #ccc;
            z-index: 1000;
            display: grid;
            grid-template-columns: 1fr 1fr;
            max-height: 90vh;
        }

        .axis-container {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding-bottom: 45px;
            max-height: 80vh;
        }

        .axis-label {
            margin-bottom: 3px;
            font-weight: bold;
            text-align: center;
        }

        .axis-button {
            margin: 3px;
            background-color: gray;
            color: white;
            border: none;
            padding: 3px 10px;
            cursor: pointer;
            text-align: center;
        }

        .axis-button.selected {
            background-color: #205668;
            color: white;
        }

        .axis-button:hover {
            background-color: #888;
        }

        .axis-button.selected:hover {
            background-color: #205668 !important;
        }

        #on-off-container {
            position: fixed;
            bottom: 0;
            left: 10px;
            right: 10px;
            background-color: #ffffff;
            padding: 10px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            border-top: 1px solid #ccc;
            z-index: 1001;
        }

        .on-off-button {
            background-color: #4c72af;
            color: white;
            padding: 5px 10px;
            border: none;
            cursor: pointer;
            transition: transform 0.1s ease, background-color 0.1s ease, box-shadow 0.1s ease;
        }

        .on-off-button:last-child {
            background-color: #f44336;
        }

        .on-off-button:active {
            transform: scale(0.95);
            background-color: #3b5a8e;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
        }

        .on-off-button:last-child:active {
            background-color: #d32f2f;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
        }

        .on-off-button:hover {
            background-color: #3c80b5;
            transition: background-color 0.3s;
        }

        .on-off-button:last-child:hover {
            background-color: #e53935;
            transition: background-color 0.3s;
        }

        #feedback-message {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 1002;
        }

        #hide-button {
            position: absolute;
            top: 0;
            left: 0;
            background-color: #ccc;
            color: white;
            border: none;
            padding: 2px 7px;
            cursor: pointer;
        }

        #config-button {
            position: absolute;
            top: 0;
            left: 22px;
            background-color: #ccc;
            color: white;
            border: none;
            padding: 1px 4px;
            cursor: pointer;
        }

        #hide-button, #config-button {
            position: absolute;
            background-color: #ccc;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
        }

        #hide-button:hover, #config-button:hover {
            background-color: #888;
            color: #fff;
        }

        #show-button {
            width: 40px;
            height: 40px;
            background: rgba(102, 204, 102, 0.5);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(102, 204, 102, 0.4);
            border-radius: 50%;
            font-size: 26px;
            font-weight: bold;
            color: #fff;
            display: none;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            pointer-events: auto;
            transform-origin: center;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
            opacity: 0;
            animation: fadeIn 0.5s forwards;
        }

        #show-button:hover {
            transform: scale(1.5);
            background: rgba(102, 204, 102, 0.8);
            font-size: 32px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        #showButton:active {
            transform: scale(1.35);
            background: rgba(102, 204, 102, 0.8);
            transition: transform 0.05s ease;
        }

        #showButton.fadeOut {
            animation: fadeOut 0.5s forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
        }

        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.5); }
        }
    `);
})();