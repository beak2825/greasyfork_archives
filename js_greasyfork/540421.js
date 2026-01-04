// ==UserScript==
// @name         Time Local Display (Main PC)
// @namespace    http://tampermonkey.net/
// @version      1.59
// @description  Показывает московское время только в главном окне, в правом нижнем углу, без повторов в iframe и всплывающих окнах.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540421/Time%20Local%20Display%20%28Main%20PC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540421/Time%20Local%20Display%20%28Main%20PC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Не выполняем скрипт во фреймах или всплывающих окнах
    if (window.top !== window.self) return;

    const timeDisplay = document.createElement('div');

    Object.assign(timeDisplay.style, {
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '14px',
        boxShadow: '0 0 12px rgba(0, 0, 0, 0.5)',
        zIndex: '999999',
        pointerEvents: 'none',
        textAlign: 'center',
        minWidth: '180px'
    });

    document.body.appendChild(timeDisplay);

    function updateTime() {
        const now = new Date();
        const options = {
            timeZone: 'Europe/Moscow',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        const moscowTime = now.toLocaleString('ru-RU', options).replace(',', ' -');
        timeDisplay.innerText = `${moscowTime}`;
    }

    updateTime();
    setInterval(updateTime, 1000);
})();
