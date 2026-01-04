// ==UserScript==
// @name         AtCoder Problems Pie Chart 正常判定
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  AtCoder ProblemsのPieチャートにおいて、正常判定を行い、状態を表示します。
// @author       shogo314
// @match        https://kenkoooo.com/atcoder/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539930/AtCoder%20Problems%20Pie%20Chart%20%E6%AD%A3%E5%B8%B8%E5%88%A4%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/539930/AtCoder%20Problems%20Pie%20Chart%20%E6%AD%A3%E5%B8%B8%E5%88%A4%E5%AE%9A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const colClasses = ['col-md-2', 'col-md-3', 'col-lg-3', 'col-xl-2'];

    function getPieContainers() {
        return Array.from(document.querySelectorAll('div.text-center.col-6')).filter(div =>
            colClasses.some(cls => div.classList.contains(cls))
        );
    }

    function parseRatio(text) {
        // "988 / 988" のような形式を数値に分割
        const m = text.match(/(\d+)\s*\/\s*(\d+)/);
        if (!m) return null;
        const numerator = Number(m[1]);
        const denominator = Number(m[2]);
        if (denominator === 0) return null;
        return numerator / denominator;
    }

    function analyzeEachPie() {
        const pieContainers = getPieContainers();

        pieContainers.forEach(container => {
            // n/nを含むh5.text-mutedを探す
            const ratioH5 = container.querySelector('h5.text-muted');
            if (!ratioH5) return;

            const ratio = parseRatio(ratioH5.textContent);
            if (ratio === null) return;

            const isNormal = ratio === 1;

            const statusText = isNormal ? '✅ 正常' : '⚠️ 遅延あり';
            const statusColor = isNormal ? '#28a745' : '#dc3545';

            if (container.querySelector('.pie-status-label')) return;

            const label = document.createElement('div');
            label.className = 'pie-status-label';
            label.textContent = statusText;
            label.style = `
                margin-top: 6px;
                font-weight: bold;
                color: white;
                background: ${statusColor};
                padding: 3px 8px;
                border-radius: 4px;
                display: inline-block;
                font-size: 13px;
            `;

            container.appendChild(label);
        });
    }

    function waitForCharts() {
        let lastHash = location.hash;
        const intervalId = setInterval(() => {
            if (location.hash !== lastHash) {
                lastHash = location.hash;
                setTimeout(() => {
                    analyzeEachPie();
                }, 1200);
            }
        }, 500);

        window.addEventListener('load', () => {
            setTimeout(() => analyzeEachPie(), 1500);
        });
    }

    waitForCharts();
})();
