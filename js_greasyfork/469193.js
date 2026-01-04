// ==UserScript==
// @name         暗黑4事件倒计时
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  alert when countdown less than 3 minutes
// @author       绯鸢
// @match        https://map.caimogu.cc/d4.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469193/%E6%9A%97%E9%BB%914%E4%BA%8B%E4%BB%B6%E5%80%92%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/469193/%E6%9A%97%E9%BB%914%E4%BA%8B%E4%BB%B6%E5%80%92%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Notification.requestPermission().then(function(result) {
        console.log('Notification permission:', result);
    });

    let startCountdownOnPanel = function(panelId, notificationTitle) {
        let panel = document.querySelector('#' + panelId);
        let countdownElement = panel.querySelector('.time');
        let intervalId;
        let isCountingDown = true;

        let checkCountdown = function() {
            let text = countdownElement.textContent;
            if (text.startsWith('下次刷新：') && isCountingDown) {
                let timeStr = text.split('下次刷新：')[1];
                let timeParts = timeStr.split(':').map(part => parseInt(part));
                let timeLeft = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
                if (timeLeft <= 180) { 
                    new Notification(notificationTitle, { body: '倒计时还剩3分钟!' });
                    isCountingDown = false; 
                    clearInterval(intervalId); 
                }
            } else if (text.includes('结束时间：')) {
                // 当显示"结束时间："时，不执行任何操作
            } else if (!isCountingDown && text.startsWith('下次刷新：')) {
                // 当再次显示"下次刷新："，且当前不在倒计时状态时，重新开始倒计时
                isCountingDown = true;
                intervalId = setInterval(checkCountdown, 1000); 
            }
        };

        intervalId = setInterval(checkCountdown, 1000); // 每秒检查一次
    };

    startCountdownOnPanel('legion-panel-block', '军团集结');
    startCountdownOnPanel('world-boss-panel-block', '世界boss');
    startCountdownOnPanel('torrent-panel-block', '地狱狂潮');

})();
