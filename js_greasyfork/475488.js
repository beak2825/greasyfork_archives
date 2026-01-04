// ==UserScript==
// @name         ⚡️域名封锁⚡️🔥🔥🔥🔥Bilibili and other entreatment website blocker🔥🔥🔥🔥
// @namespace    http://tampermonkey.net/
// @version      3.4.1.1
// @description  Custom redirect script with customization options
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475488/%E2%9A%A1%EF%B8%8F%E5%9F%9F%E5%90%8D%E5%B0%81%E9%94%81%E2%9A%A1%EF%B8%8F%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5Bilibili%20and%20other%20entreatment%20website%20blocker%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/475488/%E2%9A%A1%EF%B8%8F%E5%9F%9F%E5%90%8D%E5%B0%81%E9%94%81%E2%9A%A1%EF%B8%8F%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5Bilibili%20and%20other%20entreatment%20website%20blocker%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRedirectEnabled = GM_getValue('isRedirectEnabled', true);
    let blockURLs = GM_getValue('blockURLs', ['https://www.bilibili.com']);
    let redirectURL = GM_getValue('redirectURL', 'https://www.google.com');
    let isLightFlowEnabled = GM_getValue('isLightFlowEnabled', true);

    function blockPage(url) {
        if (window.location.href.includes(url) && isRedirectEnabled && !window.location.href.includes(redirectURL)) {
            document.documentElement.innerHTML = '';
            document.documentElement.style.background = 'white';
            window.stop();
            window.location.replace(redirectURL);
        }
    }

    blockURLs.forEach(blockPage);

    function restoreDefaults() {
        GM_setValue('blockURLs', ['https://www.bilibili.com']);
        GM_setValue('redirectURL', 'https://www.google.com');
        alert('已恢复到默认设置');
    }

    window.addEventListener('DOMContentLoaded', () => {
        if (window.location.href !== 'https://www.google.com/') return;

        const addButton = document.createElement('div');
        addButton.style.position = 'fixed';
        addButton.style.bottom = '10px';
        addButton.style.right = '10px';
        addButton.style.width = '50px';
        addButton.style.height = '50px';
        addButton.style.backgroundColor = '#FFC0CB'; // 默认颜色为粉色
        addButton.style.borderRadius = '50%';
        addButton.style.cursor = 'pointer';
        addButton.style.zIndex = '9999';
        addButton.style.display = 'flex';
        addButton.style.alignItems = 'center';
        addButton.style.justifyContent = 'center';
        addButton.style.fontSize = '24px';
        addButton.textContent = '♾️';

        // 光流效果
        if (isLightFlowEnabled) {
            addButton.style.animation = 'lightflow 5s infinite alternate';
        }

        addButton.addEventListener('click', () => {
            toggleContainer.style.display = toggleContainer.style.display === 'none' ? 'block' : 'none';
        });

        const toggleContainer = document.createElement('div');
        toggleContainer.style.position = 'fixed';
        toggleContainer.style.bottom = '70px';
        toggleContainer.style.right = '10px';
        toggleContainer.style.backgroundColor = 'white';
        toggleContainer.style.border = '1px solid black';
        toggleContainer.style.padding = '10px';
        toggleContainer.style.borderRadius = '10px';
        toggleContainer.style.zIndex = '9999';
        toggleContainer.style.display = 'none';

        const toggleSwitch = document.createElement('input');
        toggleSwitch.type = 'checkbox';
        toggleSwitch.id = 'redirectToggle';
        toggleSwitch.checked = isRedirectEnabled;

        toggleSwitch.addEventListener('change', () => {
            isRedirectEnabled = toggleSwitch.checked;
            GM_setValue('isRedirectEnabled', toggleSwitch.checked);
        });

        const label = document.createElement('label');
        label.htmlFor = 'redirectToggle';
        label.textContent = 'Enable Custom Redirect';

        const urlTable = document.createElement('table');

        blockURLs.forEach((url, index) => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = url;
            input.style.marginTop = '5px';
            input.addEventListener('change', () => {
                blockURLs[index] = input.value;
                GM_setValue('blockURLs', blockURLs);
            });
            cell.appendChild(input);
            row.appendChild(cell);
            urlTable.appendChild(row);
        });

        const addRowButton = document.createElement('button');
        addRowButton.textContent = 'Add New Row';
        addRowButton.style.marginTop = '10px';
        addRowButton.addEventListener('click', () => {
            blockURLs.push('');
            GM_setValue('blockURLs', blockURLs);

            const newRow = document.createElement('tr');
            const newCell = document.createElement('td');
            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.style.marginTop = '5px';
            newInput.addEventListener('change', () => {
                blockURLs[blockURLs.length - 1] = newInput.value;
                GM_setValue('blockURLs', blockURLs);
            });
            newCell.appendChild(newInput);
            newRow.appendChild(newCell);
            urlTable.appendChild(newRow);
        });

        // 创建恢复默认设置按钮
        let restoreDefaultsButton = document.createElement('button');
        restoreDefaultsButton.innerText = '恢复默认设置';
        restoreDefaultsButton.addEventListener('click', restoreDefaults);

        const lightFlowToggle = document.createElement('input');
        lightFlowToggle.type = 'checkbox';
        lightFlowToggle.id = 'lightFlowToggle';
        lightFlowToggle.checked = isLightFlowEnabled;

        lightFlowToggle.addEventListener('change', () => {
            isLightFlowEnabled = lightFlowToggle.checked;
            GM_setValue('isLightFlowEnabled', lightFlowToggle.checked);

            if (lightFlowToggle.checked) {
                addButton.style.animation = 'lightflow 5s infinite alternate';
            } else {
                addButton.style.animation = '';
            }
        });

        const lightFlowLabel = document.createElement('label');
        lightFlowLabel.htmlFor = 'lightFlowToggle';
        lightFlowLabel.textContent = 'Enable Light Flow Effect';

        toggleContainer.appendChild(toggleSwitch);
        toggleContainer.appendChild(label);
        toggleContainer.appendChild(urlTable);
        toggleContainer.appendChild(addRowButton);
        toggleContainer.appendChild(restoreDefaultsButton);
        toggleContainer.appendChild(lightFlowToggle);
        toggleContainer.appendChild(lightFlowLabel);
        addButton.textContent = '🤡';

        // 添加光流效果的CSS
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            @keyframes lightflow {
                0% { background-color: #FFC0CB; }
                25% { background-color: #FF4500; }
                50% { background-color: #8A2BE2; }
                75% { background-color: #E6A2D2; }
                100% { background-color: #FFC0CB; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(addButton);
        document.body.appendChild(toggleContainer);
    });
})();
