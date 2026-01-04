// ==UserScript==
// @name         РесАрена
// @match        https://asteriagame.com/main_frame.php
// @grant        none
// @run-at       document-end
// @version 0.0.1.20250820195145
// @namespace https://greasyfork.org/users/1505689
// @description рес на арене
// @downloadURL https://update.greasyfork.org/scripts/546198/%D0%A0%D0%B5%D1%81%D0%90%D1%80%D0%B5%D0%BD%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/546198/%D0%A0%D0%B5%D1%81%D0%90%D1%80%D0%B5%D0%BD%D0%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Создаём кнопку
    const btn = document.createElement('button');
    Object.assign(btn.style, {
        position: 'fixed',
        top: '19px',
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
    btn.textContent = 'РЕС АРЕНА';
    document.body.appendChild(btn);

    // Однократное выполнение при клике
    btn.addEventListener('click', () => {
        console.log('resurrect(1)');
        if (typeof resurrect === 'function') resurrect(4);
    });
})();