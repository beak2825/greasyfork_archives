// ==UserScript==
// @name         增強報號 Lotto Auto Submit Enhanced
// @namespace    http://tampermonkey.net/
// @version      3.2.58
// @description  增強報號 Lotto Auto Submit Enhanced 是一款專為樂透研究院網站（lotto.arclink.com.tw）設計的自動化報號腳本。
// @author       ArnoldCode
// @match        https://lotto.arclink.com.tw/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/529458/%E5%A2%9E%E5%BC%B7%E5%A0%B1%E8%99%9F%20Lotto%20Auto%20Submit%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/529458/%E5%A2%9E%E5%BC%B7%E5%A0%B1%E8%99%9F%20Lotto%20Auto%20Submit%20Enhanced.meta.js
// ==/UserScript==

/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * See <https://www.gnu.org/licenses/> for more details.
 */

(function() {
    'use strict';

    const gameTypes = {
        '大樂透': {
            numbers: 6, range: [1, 49], special: false, splitByComma: true,
            urlSix: 'https://lotto.arclink.com.tw/post.do?go=game&iType=1',
            urlFive: 'https://lotto.arclink.com.tw/post.do?go=gameno&iType=1',
            urlTwo: 'https://lotto.arclink.com.tw/post.do?go=gamesec&iType=1',
            urlSingle: 'https://lotto.arclink.com.tw/post.do?go=gameone&iType=1',
            labelSix: '大樂透(報六碼):', labelFive: '大樂透(刪五碼):'
        },
        '六合彩': {
            numbers: 6, range: [1, 49], special: false, splitByComma: true,
            urlSix: 'https://lotto.arclink.com.tw/post.do?go=game&iType=5',
            urlFive: 'https://lotto.arclink.com.tw/post.do?go=gameno&iType=5',
            urlTwo: 'https://lotto.arclink.com.tw/post.do?go=gamesec&iType=5',
            urlSingle: 'https://lotto.arclink.com.tw/post.do?go=gameone&iType=5',
            labelSix: '六合彩(報六碼):', labelFive: '六合彩(刪五碼):'
        },
        '威力彩': {
            numbers: 6, range: [1, 38], special: false, splitByComma: true,
            urlSix: 'https://lotto.arclink.com.tw/post.do?go=game&iType=12',
            urlFive: 'https://lotto.arclink.com.tw/post.do?go=gameno&iType=12',
            urlTwo: 'https://lotto.arclink.com.tw/post.do?go=gamesec&iType=12',
            urlSingle: 'https://lotto.arclink.com.tw/post.do?go=gameone&iType=12',
            labelSix: '威力彩(報六碼):', labelFive: '威力彩(刪五碼):'
        },
        '今彩539': {
            numbers: 5, range: [1, 39], special: false, splitByComma: true,
            urlSix: 'https://lotto.arclink.com.tw/post.do?go=game395&iType=9',
            urlFive: 'https://lotto.arclink.com.tw/post.do?go=game395no&iType=9',
            urlTwo: 'https://lotto.arclink.com.tw/post.do?go=game395sec&iType=9',
            urlSingle: 'https://lotto.arclink.com.tw/post.do?go=game395one&iType=9',
            labelSix: '今彩539(報五碼):', labelFive: '今彩539(刪五碼):'
        },
        '三星彩': {
            numbers: 3, range: [0, 9], special: false, splitByComma: false,
            urlSix: 'https://lotto.arclink.com.tw/post.do?go=game3star&iType=7',
            urlFive: null,
            urlTwo: null,
            urlSingle: null,
            labelSix: '三星彩:', labelFive: null
        },
        '四星彩': {
            numbers: 4, range: [0, 9], special: false, splitByComma: false,
            urlSix: 'https://lotto.arclink.com.tw/post.do?go=game4star&iType=4',
            urlFive: null,
            urlTwo: null,
            urlSingle: null,
            labelSix: '四星彩:', labelFive: null
        }
    };

    const defaultChecked = ['今彩539'];

    function createFloatBox() {
    if (!window.location.href.includes('lotterygame.html')) return;

    let floatBox = document.createElement('div');
    floatBox.id = 'lottoBox';
    floatBox.style.position = 'fixed';
    floatBox.style.left = '50%';
    floatBox.style.transform = 'translateX(-50%)';
    floatBox.style.bottom = localStorage.getItem('lottoBoxBottom') || '20px';
    floatBox.style.width = '330px';
    floatBox.style.background = 'rgba(0, 0, 0, 0.8)';
    floatBox.style.color = 'white';
    floatBox.style.padding = '15px';
    floatBox.style.borderRadius = '8px';
    floatBox.style.zIndex = '9999';
    floatBox.style.cursor = 'move';
    floatBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    floatBox.style.display = 'flex';
    floatBox.style.flexDirection = 'column';
    floatBox.style.alignItems = 'center';
    floatBox.style.fontFamily = 'Arial, sans-serif';
    floatBox.style.fontSize = '14px';
    floatBox.style.transition = 'top 0.1s ease, left 0.1s ease';

    floatBox.innerHTML = `
        <b style="margin-bottom: 10px;">增強報號</b>
        <div style="display: flex; width: 100%; gap: 5px; margin-bottom: 10px;">
            <button id="tabSix" style="flex: 1; padding: 5px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">報六碼</button>
            <button id="tabFive" style="flex: 1; padding: 5px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">刪五碼</button>
            <button id="tabTwo" style="flex: 1; padding: 5px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer;">報二碼</button>
            <button id="tabSingle" style="flex: 1; padding: 5px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer;">報獨支</button>
        </div>
        <div id="tabContent" style="width: 100%;">
            <div id="sixCodeContent" style="display: block;">
                <div id="gameInputsSix" style="width: 100%;">
                    ${Object.entries(gameTypes).map(([type, config]) => `
                        <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
                            <input type="checkbox" id="checkbox_six_${type}" ${defaultChecked.includes(type) ? 'checked' : ''} style="margin-right: 5px;">
                            <label style="white-space: nowrap; width: 120px;" for="checkbox_six_${type}">${config.labelSix}</label>
                            <input type="text" id="lottoNumbers_six_${type}" style="width: 130px; padding: 5px; border-radius: 4px; border: none;" placeholder="${config.splitByComma ? `例: ${Array(config.numbers).fill(0).map((_, i) => i + 1).join(',')}` : `例: ${Array(config.numbers).fill(0).map((_, i) => i + 1).join('')}`}">
                            <button class="randomPickSix" data-type="${type}" style="padding: 5px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">隨機</button>
                        </div>
                    `).join('')}
                </div>
                <div style="display: flex; width: 100%; gap: 5px; margin-top: 10px;">
                    <button id="selectAllSix" style="padding: 5px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; width: auto;">全部勾選</button>
                    <button id="clearAllSix" style="padding: 5px; background: #F44336; color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1;">全部取消</button>
                    <button id="randomAllSix" style="padding: 5px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; width: auto;">全部隨機</button>
                </div>
                <button id="submitAllSix" style="width: 100%; margin-top: 10px; padding: 5px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">一鍵提交自動勾選號碼</button>
                <div id="messageBox" style="width: 100%; margin-top: 10px; padding: 5px; color: white; word-wrap: break-word; display: none;"></div>
            </div>
            <div id="fiveCodeContent" style="display: none;">
                <div id="gameInputsFive" style="width: 100%;">
                    ${Object.entries(gameTypes).filter(([type]) => type !== '三星彩' && type !== '四星彩').map(([type, config]) => `
                        <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
                            <input type="checkbox" id="checkbox_five_${type}" ${defaultChecked.includes(type) ? 'checked' : ''} style="margin-right: 5px;">
                            <label style="white-space: nowrap; width: 120px;" for="checkbox_five_${type}">${config.labelFive}</label>
                            <input type="text" id="lottoNumbers_five_${type}" style="width: 130px; padding: 5px; border-radius: 4px; border: none;" placeholder="例: 1,2,3,4,5">
                            <button class="randomPickFive" data-type="${type}" style="padding: 5px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">隨機</button>
                        </div>
                    `).join('')}
                </div>
                <div style="display: flex; width: 100%; gap: 5px; margin-top: 10px;">
                    <button id="selectAllFive" style="padding: 5px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; width: auto;">全部勾選</button>
                    <button id="clearAllFive" style="padding: 5px; background: #F44336; color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1;">全部取消</button>
                    <button id="randomAllFive" style="padding: 5px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; width: auto;">全部隨機</button>
                </div>
                <button id="submitAllFive" style="width: 100%; margin-top: 10px; padding: 5px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">一鍵提交自動勾選號碼</button>
                <div id="messageBox" style="width: 100%; margin-top: 10px; padding: 5px; color: white; word-wrap: break-word; display: none;"></div>
            </div>
            <div id="twoCodeContent" style="display: none;">
                <div id="gameInputsTwo" style="width: 100%;">
                    ${Object.entries(gameTypes).filter(([type]) => type !== '三星彩' && type !== '四星彩').map(([type, config]) => `
                        <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
                            <input type="checkbox" id="checkbox_two_${type}" ${defaultChecked.includes(type) ? 'checked' : ''} style="margin-right: 5px;">
                            <label style="white-space: nowrap; width: 120px;" for="checkbox_two_${type}">${config.labelFive.replace('刪五碼', '報二碼')}</label>
                            <input type="text" id="lottoNumbers_two_${type}" style="width: 130px; padding: 5px; border-radius: 4px; border: none;" placeholder="例: 1,2">
                            <button class="randomPickTwo" data-type="${type}" style="padding: 5px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer;">隨機</button>
                        </div>
                    `).join('')}
                </div>
                <div style="display: flex; width: 100%; gap: 5px; margin-top: 10px;">
                    <button id="selectAllTwo" style="padding: 5px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; width: auto;">全部勾選</button>
                    <button id="clearAllTwo" style="padding: 5px; background: #F44336; color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1;">全部取消</button>
                    <button id="randomAllTwo" style="padding: 5px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; width: auto;">全部隨機</button>
                </div>
                <button id="submitAllTwo" style="width: 100%; margin-top: 10px; padding: 5px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer;">一鍵提交自動勾選號碼</button>
                <div id="messageBox" style="width: 100%; margin-top: 10px; padding: 5px; color: white; word-wrap: break-word; display: none;"></div>
            </div>
            <div id="singleCodeContent" style="display: none;">
                <div id="gameInputsSingle" style="width: 100%;">
                    ${Object.entries(gameTypes).filter(([type]) => type !== '三星彩' && type !== '四星彩').map(([type, config]) => `
                        <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
                            <input type="checkbox" id="checkbox_single_${type}" ${defaultChecked.includes(type) ? 'checked' : ''} style="margin-right: 5px;">
                            <label style="white-space: nowrap; width: 120px;" for="checkbox_single_${type}">${config.labelFive.replace('刪五碼', '報獨支')}</label>
                            <input type="text" id="lottoNumbers_single_${type}" style="width: 130px; padding: 5px; border-radius: 4px; border: none;" placeholder="例: 1">
                            <button class="randomPickSingle" data-type="${type}" style="padding: 5px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer;">隨機</button>
                        </div>
                    `).join('')}
                </div>
                <div style="display: flex; width: 100%; gap: 5px; margin-top: 10px;">
                    <button id="selectAllSingle" style="padding: 5px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; width: auto;">全部勾選</button>
                    <button id="clearAllSingle" style="padding: 5px; background: #F44336; color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1;">全部取消</button>
                    <button id="randomAllSingle" style="padding: 5px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer; width: auto;">全部隨機</button>
                </div>
                <button id="submitAllSingle" style="width: 100%; margin-top: 10px; padding: 5px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer;">一鍵提交自動勾選號碼</button>
                <div id="messageBox" style="width: 100%; margin-top: 10px; padding: 5px; color: white; word-wrap: break-word; display: none;"></div>
            </div>
        </div>
    `;
    document.body.appendChild(floatBox);

    // 以下為原有的按鈕事件監聽器，保持不變
    const tabSix = document.getElementById('tabSix');
    const tabFive = document.getElementById('tabFive');
    const tabTwo = document.getElementById('tabTwo');
    const tabSingle = document.getElementById('tabSingle');
    const sixCodeContent = document.getElementById('sixCodeContent');
    const fiveCodeContent = document.getElementById('fiveCodeContent');
    const twoCodeContent = document.getElementById('twoCodeContent');
    const singleCodeContent = document.getElementById('singleCodeContent');

    tabSix.addEventListener('click', () => {
        tabSix.style.background = '#4CAF50';
        tabFive.style.background = '#2196F3';
        tabTwo.style.background = '#FF9800';
        tabSingle.style.background = '#9C27B0';
        sixCodeContent.style.display = 'block';
        fiveCodeContent.style.display = 'none';
        twoCodeContent.style.display = 'none';
        singleCodeContent.style.display = 'none';
    });

    tabFive.addEventListener('click', () => {
        tabSix.style.background = '#4CAF50';
        tabFive.style.background = '#2196F3';
        tabTwo.style.background = '#FF9800';
        tabSingle.style.background = '#9C27B0';
        sixCodeContent.style.display = 'none';
        fiveCodeContent.style.display = 'block';
        twoCodeContent.style.display = 'none';
        singleCodeContent.style.display = 'none';
    });

    tabTwo.addEventListener('click', () => {
        tabSix.style.background = '#4CAF50';
        tabFive.style.background = '#2196F3';
        tabTwo.style.background = '#FF9800';
        tabSingle.style.background = '#9C27B0';
        sixCodeContent.style.display = 'none';
        fiveCodeContent.style.display = 'none';
        twoCodeContent.style.display = 'block';
        singleCodeContent.style.display = 'none';
    });

    tabSingle.addEventListener('click', () => {
        tabSix.style.background = '#4CAF50';
        tabFive.style.background = '#2196F3';
        tabTwo.style.background = '#FF9800';
        tabSingle.style.background = '#9C27B0';
        sixCodeContent.style.display = 'none';
        fiveCodeContent.style.display = 'none';
        twoCodeContent.style.display = 'none';
        singleCodeContent.style.display = 'block';
    });

    makeDraggable(floatBox);
    document.querySelectorAll('.randomPickSix').forEach(btn => btn.addEventListener('click', (e) => randomPickHandler(e, 'six')));
    document.querySelectorAll('.randomPickFive').forEach(btn => btn.addEventListener('click', (e) => randomPickHandler(e, 'five')));
    document.querySelectorAll('.randomPickTwo').forEach(btn => btn.addEventListener('click', (e) => randomPickHandler(e, 'two')));
    document.querySelectorAll('.randomPickSingle').forEach(btn => btn.addEventListener('click', (e) => randomPickHandler(e, 'single')));
    document.getElementById('submitAllSix').addEventListener('click', () => submitNumbers('six'));
    document.getElementById('submitAllFive').addEventListener('click', () => submitNumbers('five'));
    document.getElementById('submitAllTwo').addEventListener('click', () => submitNumbers('two'));
    document.getElementById('submitAllSingle').addEventListener('click', () => submitNumbers('single'));
    document.getElementById('selectAllSix').addEventListener('click', () => selectAll('six'));
    document.getElementById('clearAllSix').addEventListener('click', () => clearAll('six'));
    document.getElementById('randomAllSix').addEventListener('click', () => randomAll('six'));
    document.getElementById('selectAllFive').addEventListener('click', () => selectAll('five'));
    document.getElementById('clearAllFive').addEventListener('click', () => clearAll('five'));
    document.getElementById('randomAllFive').addEventListener('click', () => randomAll('five'));
    document.getElementById('selectAllTwo').addEventListener('click', () => selectAll('two'));
    document.getElementById('clearAllTwo').addEventListener('click', () => clearAll('two'));
    document.getElementById('randomAllTwo').addEventListener('click', () => randomAll('two'));
    document.getElementById('selectAllSingle').addEventListener('click', () => selectAll('single'));
    document.getElementById('clearAllSingle').addEventListener('click', () => clearAll('single'));
    document.getElementById('randomAllSingle').addEventListener('click', () => randomAll('single'));
}

    function makeDraggable(element) {
        let isDragging = false;
        let shiftX, shiftY;

        const rect = element.getBoundingClientRect();
        element.style.left = `${rect.left}px`;
        element.style.top = `${rect.top}px`;
        element.style.bottom = 'auto';
        element.style.transform = 'none';

        element.onmousedown = function(event) {
            if (event.button !== 0) return;
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON') return;

            event.preventDefault();

            isDragging = true;

            const rect = element.getBoundingClientRect();
            shiftX = event.clientX - rect.left;
            shiftY = event.clientY - rect.top;

            element.style.left = `${rect.left}px`;
            element.style.top = `${rect.top}px`;

            function moveAt(clientX, clientY) {
                let newLeft = clientX - shiftX;
                let newTop = clientY - shiftY;

                const minLeft = 0;
                const minTop = 0;
                const maxLeft = window.innerWidth - rect.width;
                const maxTop = window.innerHeight - rect.height;

                newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
                newTop = Math.max(minTop, Math.min(newTop, maxTop));

                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
                localStorage.setItem('lottoBoxLeft', element.style.left);
                localStorage.setItem('lottoBoxTop', element.style.top);
                localStorage.removeItem('lottoBoxBottom');
            }

            function onMouseMove(event) {
                if (isDragging) {
                    moveAt(event.clientX, event.clientY);
                }
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', function onMouseUp() {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }, { once: true });
        };

        element.ondragstart = function() { return false; };
    }

    function randomPickHandler(e, tab) {
        let type = e.target.dataset.type;
        if (document.getElementById(`checkbox_${tab}_${type}`).checked) {
            randomPickNumbers(type, tab);
        } else {
            logToStorage(`請先勾選 ${type} 以啟用隨機選號`, true);
        }
    }

    function randomPickNumbers(gameType, tab) {
        let config = gameTypes[gameType];
        let numbers = [];
        let targetCount = (tab === 'five') ? 5 : (tab === 'two') ? 2 : (tab === 'single') ? 1 : config.numbers;

        while (numbers.length < targetCount) {
            let num = Math.floor(Math.random() * (config.range[1] - config.range[0] + 1)) + config.range[0];
            if (!numbers.includes(num)) numbers.push(num);
        }

        document.getElementById(`lottoNumbers_${tab}_${gameType}`).value = config.splitByComma ? numbers.join(',') : numbers.join('');
    }

    function selectAll(tab) {
        Object.keys(gameTypes).forEach(type => {
            if (tab !== 'six' && (type === '三星彩' || type === '四星彩')) return;
            document.getElementById(`checkbox_${tab}_${type}`).checked = true;
        });
    }

    function clearAll(tab) {
        Object.keys(gameTypes).forEach(type => {
            if (tab !== 'six' && (type === '三星彩' || type === '四星彩')) return;
            document.getElementById(`checkbox_${tab}_${type}`).checked = false;
            document.getElementById(`lottoNumbers_${tab}_${type}`).value = '';
        });
    }

    function randomAll(tab) {
        Object.keys(gameTypes).forEach(type => {
            if (tab !== 'six' && (type === '三星彩' || type === '四星彩')) return;
            if (document.getElementById(`checkbox_${tab}_${type}`).checked) {
                randomPickNumbers(type, tab);
            }
        });
    }

    function submitNumbers(tab) {
        let gamesToSubmit = [];
        let hasError = false;

        for (let [type, config] of Object.entries(gameTypes)) {
            if (tab !== 'six' && (type === '三星彩' || type === '四星彩')) continue;
            let checkbox = document.getElementById(`checkbox_${tab}_${type}`);
            if (!checkbox.checked) continue;

            let inputText = document.getElementById(`lottoNumbers_${tab}_${type}`).value.trim();
            if (!inputText) {
                let errorMsg = `請填寫 ${type} 的號碼`;
                logToStorage(errorMsg, true);
                showMessage(errorMsg);
                hasError = true;
                continue;
            }

            let numbers = config.splitByComma
                ? inputText.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n))
                : inputText.split('').map(n => parseInt(n, 10)).filter(n => !isNaN(n));
            let targetCount = (tab === 'five') ? 5 : (tab === 'two') ? 2 : (tab === 'single') ? 1 : config.numbers;

            if (numbers.length !== targetCount ||
                numbers.some(n => n < config.range[0] || n > config.range[1])) {
                let errorMsg = `請輸入有效的${type}號碼，${targetCount}個數字（${config.range[0]}-${config.range[1]}）`;
                logToStorage(errorMsg, true);
                showMessage(errorMsg);
                hasError = true;
                continue;
            }

            let url;
            if (tab === 'six') url = config.urlSix;
            else if (tab === 'five') url = config.urlFive;
            else if (tab === 'two') url = config.urlTwo;
            else if (tab === 'single') url = config.urlSingle;

            gamesToSubmit.push({
                gameType: type,
                numbers: numbers,
                url: url,
                isFiveCode: (tab !== 'six') // 報六碼以外的都視為類似刪五碼的提交邏輯
            });
        }

        if (hasError) return;

        if (gamesToSubmit.length === 0) {
            let errorMsg = '請至少勾選並填寫一種彩券號碼';
            logToStorage(errorMsg, true);
            showMessage(errorMsg);
            return;
        }

        logToStorage(`準備提交 ${gamesToSubmit.length} 個遊戲: ${gamesToSubmit.map(g => g.gameType).join(', ')}`);
        localStorage.setItem('gamesToSubmit', JSON.stringify(gamesToSubmit));
        localStorage.setItem('currentGameIndex', '0');
        processNextGame();
    }

    function processNextGame() {
        let gamesToSubmit = JSON.parse(localStorage.getItem('gamesToSubmit') || '[]');
        let currentGameIndex = parseInt(localStorage.getItem('currentGameIndex') || '0', 10);

        if (currentGameIndex >= gamesToSubmit.length) {
            logToStorage('所有遊戲報號完成！返回首頁...');
            localStorage.removeItem('gamesToSubmit');
            localStorage.removeItem('currentGameIndex');
            localStorage.removeItem('lottoNumbers');
            setTimeout(() => {
                window.location.href = 'https://lotto.arclink.com.tw/';
            }, 2000);
            return;
        }

        let currentGame = gamesToSubmit[currentGameIndex];
        logToStorage(`處理第 ${currentGameIndex + 1}/${gamesToSubmit.length} 個遊戲: ${currentGame.gameType}，跳轉至 ${currentGame.url}`);
        localStorage.setItem('lottoNumbers', JSON.stringify(currentGame));
        window.location.href = currentGame.url;
    }

    function logToStorage(message, isError = false) {
        let logs = JSON.parse(localStorage.getItem('lottoLogs') || '[]');
        logs.push({ time: new Date().toLocaleString(), message, isError });
        localStorage.setItem('lottoLogs', JSON.stringify(logs.slice(-10)));
    }

    function showMessage(message) {
        let activeTab = document.getElementById('sixCodeContent').style.display === 'block' ? 'sixCodeContent' :
                        document.getElementById('fiveCodeContent').style.display === 'block' ? 'fiveCodeContent' :
                        document.getElementById('twoCodeContent').style.display === 'block' ? 'twoCodeContent' : 'singleCodeContent';
        let msgBox = document.getElementById('lottoBox').querySelector(`#${activeTab} #messageBox`);
        msgBox.style.display = 'block';
        msgBox.style.background = 'rgba(255, 0, 0, 0.8)';
        msgBox.textContent = message;
        msgBox.style.height = 'auto';
        setTimeout(() => {
            msgBox.style.display = 'none';
            msgBox.textContent = '';
        }, 3000);
    }

    function fillNumbers() {
        let storedData = localStorage.getItem('lottoNumbers');
        let gamesToSubmit = localStorage.getItem('gamesToSubmit');
        if (!storedData || !gamesToSubmit) {
            logToStorage('無待處理的號碼資料或不在自動提交流程中，跳過 fillNumbers');
            return;
        }

        let data = JSON.parse(storedData);
        logToStorage(`開始填充 ${data.gameType} 的號碼: ${data.numbers.join(',')}`);

        // 等待頁面載入並檢查重複參加
        function checkDuplicateBeforeFilling(callback) {
            let attempts = 0;
            const maxAttempts = 10;

            function check() {
                attempts++;
                if (document.readyState === 'complete' || document.querySelector('.error-message, .alert, .warning')) {
                    if (checkDuplicateParticipation()) {
                        logToStorage(`提前檢測到 ${data.gameType} 已重複參加，中斷流程並返回首頁`, true);
                        localStorage.removeItem('gamesToSubmit');
                        localStorage.removeItem('currentGameIndex');
                        localStorage.removeItem('lottoNumbers');
                        setTimeout(() => {
                            window.location.href = 'https://lotto.arclink.com.tw/';
                        }, 1000);
                        return;
                    } else {
                        callback();
                    }
                } else if (attempts < maxAttempts) {
                    logToStorage(`頁面未載入完成，等待 ${attempts}/${maxAttempts}`);
                    setTimeout(check, 500);
                } else {
                    logToStorage(`頁面載入超時，繼續填充 ${data.gameType}`, true);
                    callback();
                }
            }
            check();
        }

        checkDuplicateBeforeFilling(() => {
            function startFilling() {
                let observer = new MutationObserver((mutations, obs) => {
                    let checkboxes;
                    if (data.gameType === '三星彩') {
                        checkboxes = [
                            document.querySelectorAll('input[name="c1"]'),
                            document.querySelectorAll('input[name="c2"]'),
                            document.querySelectorAll('input[name="c3"]')
                        ];
                        if (checkboxes.every(cb => cb.length >= 10)) {
                            obs.disconnect();
                            logToStorage(`三星彩 Checkboxes found: ${checkboxes.map(cb => cb.length).join(', ')}`);
                            fillInputsAndCheckboxes(null, checkboxes, data, 0);
                        }
                    } else if (data.gameType === '四星彩') {
                        checkboxes = [
                            document.querySelectorAll('input[name="c1"]'),
                            document.querySelectorAll('input[name="c2"]'),
                            document.querySelectorAll('input[name="c3"]'),
                            document.querySelectorAll('input[name="c4"]')
                        ];
                        if (checkboxes.every(cb => cb.length >= 10)) {
                            obs.disconnect();
                            logToStorage(`四星彩 Checkboxes found: ${checkboxes.map(cb => cb.length).join(', ')}`);
                            fillInputsAndCheckboxes(null, checkboxes, data, 0);
                        }
                    } else {
                        checkboxes = document.querySelectorAll('input[name="c1"]');
                        if (checkboxes.length >= data.numbers.length) {
                            obs.disconnect();
                            logToStorage(`找到 ${data.gameType} 的勾選框: ${checkboxes.length} 個`);
                            fillInputsAndCheckboxes(null, checkboxes, data, 0);
                        }
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });

                setTimeout(() => {
                    observer.disconnect();
                    let checkboxes;
                    if (data.gameType === '三星彩') {
                        checkboxes = [
                            document.querySelectorAll('input[name="c1"]'),
                            document.querySelectorAll('input[name="c2"]'),
                            document.querySelectorAll('input[name="c3"]')
                        ];
                    } else if (data.gameType === '四星彩') {
                        checkboxes = [
                            document.querySelectorAll('input[name="c1"]'),
                            document.querySelectorAll('input[name="c2"]'),
                            document.querySelectorAll('input[name="c3"]'),
                            document.querySelectorAll('input[name="c4"]')
                        ];
                    } else {
                        checkboxes = document.querySelectorAll('input[name="c1"]');
                    }
                    logToStorage(`超時後強制執行 ${data.gameType}，找到 ${checkboxes.length} 個勾選框組`);
                    fillInputsAndCheckboxes(null, checkboxes, data, 0);
                }, 2000);
            }

            setTimeout(startFilling, 2000);
        });
    }

    function fillInputsAndCheckboxes(inputs, checkboxes, data, retryCount) {
        let index = 0;
        let numbers = data.numbers;
        let checkedCount = 0;
        const maxRetries = 5;

        function fillNext() {
            if (index >= numbers.length) {
                if (checkedCount === numbers.length) {
                    setTimeout(() => {
                        let submitBtn = document.querySelector('input[type="submit"][name="start"]');
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            logToStorage(`提交 ${data.gameType} 的號碼: ${numbers.join(',')}`);
                            submitBtn.click();
                            waitForResultPage(data.gameType, data.isFiveCode);
                        } else {
                            logToStorage(`未找到 ${data.gameType} 的提交按鈕，跳至下一遊戲`, true);
                            localStorage.setItem('currentGameIndex', (parseInt(localStorage.getItem('currentGameIndex'), 10) + 1).toString());
                            processNextGame();
                        }
                    }, 1000);
                } else if (retryCount < maxRetries) {
                    logToStorage(`勾選 ${data.gameType} 未完成: ${checkedCount}/${numbers.length}，重試 (${retryCount + 1}/${maxRetries})`);
                    setTimeout(() => fillInputsAndCheckboxes(inputs, checkboxes, data, retryCount + 1), 1000);
                } else {
                    logToStorage(`超過最大重試次數 ${data.gameType}: ${checkedCount}/${numbers.length}，跳至下一遊戲`, true);
                    localStorage.setItem('currentGameIndex', (parseInt(localStorage.getItem('currentGameIndex'), 10) + 1).toString());
                    processNextGame();
                }
                return;
            }

            let num = numbers[index].toString();
            let checkbox;

            if (data.gameType === '三星彩' || data.gameType === '四星彩') {
                let checkboxGroup = checkboxes[index];
                checkbox = Array.from(checkboxGroup).find(cb => cb.value === num || cb.value === num.padStart(2, '0'));
            } else {
                checkbox = Array.from(checkboxes).find(cb => cb.value === num || cb.value === num.padStart(2, '0'));
            }

            if (checkbox) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('click', { bubbles: true }));
                setTimeout(() => {
                    if (checkbox.checked) {
                        checkedCount++;
                    }
                    index++;
                    setTimeout(fillNext, 123);
                }, 123);
            } else {
                logToStorage(`未找到 ${data.gameType} 的勾選框: ${num}`, true);
                index++;
                setTimeout(fillNext, 123);
            }
        }
        fillNext();
    }

    function checkLoginStatus() {
        const url = window.location.href;
        const title = document.title;
        const loginButton = document.querySelector('input[type="submit"][value="登入"]');
        const logoutLink = document.querySelector('a[href*="logout"]');
        let isLoggedOut = false;

        if (logoutLink) {
            isLoggedOut = false;
        } else if (loginButton || title.includes('登入') || url === 'https://lotto.arclink.com.tw/') {
            isLoggedOut = true;
        }

        logToStorage(`檢查登入狀態 - URL: ${url}, 標題: ${title}, 登入按鈕: ${!!loginButton}, 登出連結: ${!!logoutLink}, 判定: ${isLoggedOut ? '未登入' : '已登入'}`);
        return isLoggedOut;
    }

    function handleLoginStatus() {
        if (checkLoginStatus()) {
            logToStorage('未登入檢測到，返回首頁', true);
            localStorage.removeItem('gamesToSubmit');
            localStorage.removeItem('currentGameIndex');
            localStorage.removeItem('lottoNumbers');
            setTimeout(() => {
                window.location.href = 'https://lotto.arclink.com.tw/';
            }, 1000);
            return true;
        }
        return false;
    }

    function checkDuplicateParticipation() {
        const pageContent = document.body.innerHTML || '';
        const errorDiv = document.querySelector('.error-message, .alert, .warning') || {};
        const duplicateMessages = [
            '你已經有參加過該類型的報號',
            '本台電腦已經有其它帳號報過',
            '已參加',
            '重複報號',
            '報號遊戲每期每人只限報號一次',
            '你所用的電腦已經有其它帳號報號過了',
            '抱歉，報號發生錯誤，可能的原因是:你已經有參加過該類型的報號了或者是本台電腦已經有其它帳號報過該類型的遊戲了！',
            '抱歉，報號發生錯誤，可能的原因是:報號遊戲每期每人只限報號一次，或者你所用的電腦已經有其它帳號報號過了！',
            '抱歉，報號發生錯誤，可能的原因是:你已經有參加過該類型的報號了！！',
            '抱歉！開獎日的19點之後，則不能繼續進行報號。謝謝！'
        ];
        const isDuplicate = duplicateMessages.some(msg => pageContent.includes(msg)) ||
                            duplicateMessages.some(msg => errorDiv.textContent && errorDiv.textContent.includes(msg));
        logToStorage(`檢查重複參加 - URL: ${window.location.href}, 檢測結果: ${isDuplicate}, 頁面內容樣本: ${pageContent.slice(0, 200)}`);
        return isDuplicate;
    }

    function waitForResultPage(gameType, isFiveCode = false) {
        let attempts = 0;
        const maxAttempts = 10;
        const expectedUrls = [
            'https://lotto.arclink.com.tw/LottoGames.do',
            'https://lotto.arclink.com.tw/LottoGamesno.do'
        ];
        const preferredUrl = isFiveCode ? expectedUrls[1] : expectedUrls[0];

        function check() {
            attempts++;
            const hasErrorElement = !!document.querySelector('.error-message, .alert, .warning');
            logToStorage(`等待 ${gameType} 結果頁，第 ${attempts}/${maxAttempts} 次檢查，當前 URL: ${window.location.href}, 預期 URL: ${preferredUrl}, readyState: ${document.readyState}, 錯誤元素: ${hasErrorElement}`);

            if (expectedUrls.includes(window.location.href)) {
                // 只要到達任一結果頁，立即檢查重複
                logToStorage(`結果頁已載入 ${gameType}，URL: ${window.location.href}`);
                if (handleLoginStatus()) {
                    return;
                }
                if (checkDuplicateParticipation()) {
                    logToStorage(`結果頁檢測到 ${gameType} 重複參加提醒，返回首頁`, true);
                    localStorage.removeItem('gamesToSubmit');
                    localStorage.removeItem('currentGameIndex');
                    localStorage.removeItem('lottoNumbers');
                    setTimeout(() => {
                        window.location.href = 'https://lotto.arclink.com.tw/';
                    }, 1000);
                    return;
                }
                let nextIndex = parseInt(localStorage.getItem('currentGameIndex'), 10) + 1;
                localStorage.setItem('currentGameIndex', nextIndex.toString());
                setTimeout(processNextGame, 1000);
            } else if (attempts < maxAttempts) {
                setTimeout(check, 1000);
            } else {
                logToStorage(`未到達預期結果頁 ${expectedUrls.join(' 或 ')}，超過最大嘗試次數，跳至下一遊戲`, true);
                localStorage.setItem('currentGameIndex', (parseInt(localStorage.getItem('currentGameIndex'), 10) + 1).toString());
                processNextGame();
            }
        }
        setTimeout(check, 2000);
    }

    if (window.location.href.includes('lotterygame.html')) {
        createFloatBox();
    }

    if (window.location.href.includes('post.do?go=game&iType=1') ||
        window.location.href.includes('post.do?go=game&iType=5') ||
        window.location.href.includes('post.do?go=game&iType=12') ||
        window.location.href.includes('post.do?go=game395&iType=9') ||
        window.location.href.includes('post.do?go=game3star&iType=7') ||
        window.location.href.includes('post.do?go=game4star&iType=4') ||
        window.location.href.includes('post.do?go=gameno&iType=1') ||
        window.location.href.includes('post.do?go=gameno&iType=5') ||
        window.location.href.includes('post.do?go=gameno&iType=12') ||
        window.location.href.includes('post.do?go=game395no&iType=9') ||
        window.location.href.includes('post.do?go=gamesec&iType=1') ||
        window.location.href.includes('post.do?go=gamesec&iType=5') ||
        window.location.href.includes('post.do?go=gamesec&iType=12') ||
        window.location.href.includes('post.do?go=game395sec&iType=9') ||
        window.location.href.includes('post.do?go=gameone&iType=1') ||
        window.location.href.includes('post.do?go=gameone&iType=5') ||
        window.location.href.includes('post.do?go=gameone&iType=12') ||
        window.location.href.includes('post.do?go=game395one&iType=9')) {
        fillNumbers();
    } else if (window.location.href === 'https://lotto.arclink.com.tw/LottoGames.do' ||
               window.location.href === 'https://lotto.arclink.com.tw/LottoGamesno.do') {
        let storedData = JSON.parse(localStorage.getItem('lottoNumbers') || '{}');
        waitForResultPage(storedData.gameType || 'unknown', storedData.isFiveCode || false);
    }
})();
