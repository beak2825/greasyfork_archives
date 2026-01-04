// ==UserScript==
// @name         Hydro 难度数字转文字
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将难度一栏的数字改为文字
// @author       YourName
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511557/Hydro%20%E9%9A%BE%E5%BA%A6%E6%95%B0%E5%AD%97%E8%BD%AC%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/511557/Hydro%20%E9%9A%BE%E5%BA%A6%E6%95%B0%E5%AD%97%E8%BD%AC%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义难度对应的文字和颜色
    const difficultyMap = {
        1: { text: '入门', color: '#FE4C61' },
        2: { text: '普及-', color: '#F39C11' },
        3: { text: '普及', color: '#FFC116' },
        4: { text: '普及+', color: '#52C41A' },
        5: { text: '提高+', color: '#3498DB' },
        6: { text: '省选', color: '#9D3DCF' },
        7: { text: 'NOI', color: '#0E1D69' },
        8: { text: '未评定', color: '#BFBFBF' },
        9: { text: '未评定', color: '#BFBFBF' },
        10: { text: '未评定', color: '#BFBFBF' },
        '(无)': { text: '未评定', color: '#BFBFBF' },
    };
    window.addEventListener('load', function() {
        const difficultyCells = document.querySelectorAll('td.col--difficulty');

        difficultyCells.forEach(cell => {
            const difficultyNumber = cell.textContent.trim();
            if (difficultyMap[difficultyNumber]) {
                cell.textContent = difficultyMap[difficultyNumber].text;
                cell.style.color = difficultyMap[difficultyNumber].color;
            }
        });
    });
})();
