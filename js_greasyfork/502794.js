// ==UserScript==
// @name         Soutong Forum Last Visit Time
// @version      1.0.5
// @description  记录搜同网某板块上次访问时间，以方便查找新的帖子
// @author       FelixChristian
// @match        https://soutong.men/forum.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace https://greasyfork.org/users/1346616
// @downloadURL https://update.greasyfork.org/scripts/502794/Soutong%20Forum%20Last%20Visit%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/502794/Soutong%20Forum%20Last%20Visit%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前时间
    const now = new Date();
    const currentTime = now.toLocaleString();
    const currentTimestamp = now.getTime();

    // 获取保存的时间变量
    const lastDisplayedVisitTime = GM_getValue('lastDisplayedVisitTime', '第一次访问');
    const lastUpdateTimestamp = GM_getValue('lastUpdateTimestamp', 0);
    const lastUnupdatedVisitTime = GM_getValue('lastUnupdatedVisitTime', 0);

    // 计算时间差（以小时为单位）
    const hoursSinceLastUpdate = (currentTimestamp - lastUpdateTimestamp) / (1000 * 60 * 60);

    // 定义时间阈值（以小时为单位）
    const timeThreshold = 2;

    // 如果时间间隔超过阈值，更新显示的时间
    if (hoursSinceLastUpdate >= timeThreshold) {
        GM_setValue('lastDisplayedVisitTime', lastUnupdatedVisitTime);
        GM_setValue('lastUpdateTimestamp', currentTimestamp);
    }

    // 更新最新的上次访问时间
    GM_setValue('lastUnupdatedVisitTime', currentTime);

    // 显示上次访问时间
    const visitInfoDiv = document.createElement('div');
    visitInfoDiv.style.position = 'fixed';
    visitInfoDiv.style.top = '10px';
    visitInfoDiv.style.left = '10px';
    visitInfoDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    visitInfoDiv.style.padding = '5px';
    visitInfoDiv.style.border = '1px solid #000';
    visitInfoDiv.style.zIndex = '1000';
    visitInfoDiv.textContent = `上次访问时间: ${GM_getValue('lastDisplayedVisitTime', '第一次访问')}`;

    document.body.appendChild(visitInfoDiv);
})();
