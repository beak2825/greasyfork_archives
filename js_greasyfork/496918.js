// ==UserScript==
// @name         TM Time Display(CN)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  显示不同时区的时间
// @match        https://trophymanager.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496918/TM%20Time%20Display%28CN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496918/TM%20Time%20Display%28CN%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCurrentTime(offset) {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const localTime = new Date(utc + (3600000 * offset));
        const hours = localTime.getHours().toString().padStart(2, '0');
        const minutes = localTime.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function displayTime() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50px';
        container.style.right = '10px';
        container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        container.style.padding = '10px';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.zIndex = 10000;
        container.style.display = 'none';
        container.style.display = 'flex';
        container.style.alignItems = 'center';

        const selectBox = document.createElement('select');
        selectBox.style.width = '70px';
        selectBox.style.padding = '5px';
        selectBox.style.marginRight = '10px'; // Add margin to separate select box and time display
        selectBox.style.backgroundColor = 'white';
        selectBox.style.color = 'black';
        selectBox.style.border = 'none';
        selectBox.style.borderRadius = '5px';
        selectBox.style.cursor = 'pointer';

        const timezones = {
            '中国': 8,
            '丹麦': 2,
            '美国': -5,
            '日本': 9,
            '沙特': 3,
            '英国': 1,
            '意大利': 2,
            '德国': 2,
            '法国': 2,
            '俄罗斯': 3,
            '巴西': -4,
            '阿根廷': -3,
            '埃及': 3,
            '罗马尼亚': 3,
            // Add more timezones as needed
        };

        for (const timezone in timezones) {
            const option = document.createElement('option');
            option.value = timezones[timezone];
            option.text = timezone;
            selectBox.appendChild(option);
        }

        const timeDisplay = document.createElement('p');
        timeDisplay.style.margin = '0';
        timeDisplay.style.textAlign = 'center';

        container.appendChild(selectBox);
        container.appendChild(timeDisplay);
        container.style.display = 'none';
        document.body.appendChild(container);

        const toggleButton = document.createElement('button');
        toggleButton.textContent = '展开/隐藏时间';
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '10px';
        toggleButton.style.right = '10px';
        toggleButton.style.zIndex = 10000;
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.backgroundColor = '#007bff';
        toggleButton.style.color = '#fff';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.cursor = 'pointer';

        toggleButton.addEventListener('click', function() {
            if (container.style.display == 'none') {
                container.style.display = 'flex';
            }
            else {
                container.style.display = 'none';
            }
        });

        document.body.appendChild(toggleButton);

        // Update time every second
        setInterval(function() {
            const selectedOffset = parseInt(selectBox.value);
            const time = getCurrentTime(selectedOffset);
            timeDisplay.textContent = `${time}`;
        }, 1000);
    }

    displayTime();
})();
