// ==UserScript==
// @name         Bunyabetu Rate Colorizer
// @namespace    https://greasyfork.org/
// @version      2.1
// @description  OMCの分野別レートに色を付けるスクリプト 都合により回転は消えました
// @author       noppi
// @match        https://onlinemathcontest.com/users/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521902/Bunyabetu%20Rate%20Colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/521902/Bunyabetu%20Rate%20Colorizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes rotate {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);

    const colorRules = [
        { min: 3600,  color: 'transparent', fontSize: '1em', fontWeight: '700', background: 'linear-gradient(to bottom, rgb(255, 150, 0), rgb(255, 220, 70), rgb(255, 150, 0))', WebkitBackgroundClip: 'text' },  // 金
        { min: 3200,  color: 'transparent', fontSize: '1em', fontWeight: '700', background: 'linear-gradient(to bottom, rgb(110, 110, 110), rgb(200, 200, 200), rgb(110, 110, 110))', WebkitBackgroundClip: 'text' },  // 銀
        { min: 2800,  color: '#ff0000', fontSize: '1em', fontWeight: '400' },
        { min: 2400,  color: '#ff8000', fontSize: '1em', fontWeight: '400' },
        { min: 2000,  color: '#c0c000', fontSize: '1em', fontWeight: '400' },
        { min: 1600,  color: '#0000ff', fontSize: '1em', fontWeight: '400' },
        { min: 1200,  color: '#00c0c0', fontSize: '1em', fontWeight: '400' },
        { min: 800,  color: '#008000', fontSize: '1em', fontWeight: '400' },
        { min: 400,  color: '#804000', fontSize: '1em', fontWeight: '400' },
        { min: 1,  color: '#808080', fontSize: '1em', fontWeight: '400' },
        { min: 0,  color: '#000000', fontSize: '1em', fontWeight: '400' }
    ];

    const rateCells = document.querySelectorAll("#rating-container table td");

    rateCells.forEach(cell => {
        const rate = parseInt(cell.textContent.trim(), 10);
        if (!isNaN(rate)) {
            const rule = colorRules.find(r => rate >= r.min);
            if (rule) {
                cell.style.color = rule.color;
                cell.style.fontSize = rule.fontSize;
                if (rule.fontWeight) {
                    cell.style.fontWeight = rule.fontWeight;
                }
                if (rule.background) {
                    cell.style.background = rule.background;
                    cell.style.WebkitBackgroundClip = rule.WebkitBackgroundClip;
                }
            }
        }
    });
})();
