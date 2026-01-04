// ==UserScript==
// @name         bilibili - 快捷操作 - 关灯模式
// @namespace    http://tampermonkey.net/
// @description  增加关灯模式快捷操作
// @version      1.0.0
// @author       L
// @match        *://www.bilibili.com/video/*
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/527110/bilibili%20-%20%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C%20-%20%E5%85%B3%E7%81%AF%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/527110/bilibili%20-%20%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C%20-%20%E5%85%B3%E7%81%AF%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function toggleLight() {
        document.querySelector("#bilibili-player input[aria-label='关灯模式']").click();
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'a') {
            toggleLight();
        }
    });

    const offLightDiv = document.createElement("div");
    offLightDiv.className = 'bpx-player-ctrl-quality-result';
    offLightDiv.textContent = '关灯模式';
    offLightDiv.addEventListener("click", toggleLight);

    const outerDiv = document.createElement("div");
    outerDiv.className = 'bpx-player-ctrl-btn bpx-player-ctrl-quality';
    outerDiv.setAttribute('role', 'button');
    outerDiv.setAttribute('aria-label', '关灯模式');
    outerDiv.setAttribute('tabindex', '0');
    outerDiv.appendChild(offLightDiv);

    const controlPanel = document.querySelector("div.bpx-player-control-bottom-right");
    controlPanel.appendChild(outerDiv);
})();