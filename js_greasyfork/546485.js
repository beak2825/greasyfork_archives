// ==UserScript==
// @name         РесТут
// @match        https://asteriagame.com/main_frame.php
// @grant        none
// @run-at       document-end
// @namespace    https://greasyfork.org/
// @description  рес тут
// @version 0.0.1.20250820061823
// @downloadURL https://update.greasyfork.org/scripts/546485/%D0%A0%D0%B5%D1%81%D0%A2%D1%83%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/546485/%D0%A0%D0%B5%D1%81%D0%A2%D1%83%D1%82.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Создаём кнопку
    const btn = document.createElement('button');
    Object.assign(btn.style, {
        position: 'fixed',
        top: '38px',
        left: '480px',
        zIndex: 9999,
        padding: '1px 1px',
        background: '#2ecc71',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '13px',
        cursor: 'pointer',
        fontFamily: 'sans-serif'
    });
    btn.textContent = 'РЕС ТУТ';
    document.body.appendChild(btn);

    // Однократное выполнение при клике
    btn.addEventListener('click', () => {
        console.log('resurrect(1)');
        if (typeof resurrect === 'function') resurrect(1);
    });
})();