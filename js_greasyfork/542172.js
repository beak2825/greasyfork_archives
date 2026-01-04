// ==UserScript==
// @name         Moyu Idle - 每小时经验（点击动作弹窗）
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  在动作弹窗中显示每小时经验值，带有高亮与粗体效果（仅在用户点击动作时计算）
// @author       rilence
// @match        https://moyu-idle.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542172/Moyu%20Idle%20-%20%E6%AF%8F%E5%B0%8F%E6%97%B6%E7%BB%8F%E9%AA%8C%EF%BC%88%E7%82%B9%E5%87%BB%E5%8A%A8%E4%BD%9C%E5%BC%B9%E7%AA%97%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542172/Moyu%20Idle%20-%20%E6%AF%8F%E5%B0%8F%E6%97%B6%E7%BB%8F%E9%AA%8C%EF%BC%88%E7%82%B9%E5%87%BB%E5%8A%A8%E4%BD%9C%E5%BC%B9%E7%AA%97%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function calculateExpPerHour(dialog) {
        const spans = Array.from(dialog.querySelectorAll('span'));

        let exp = null;
        let seconds = null;
        let expSpan = null;

        spans.forEach(span => {
            if (span.textContent.includes('经验') && span.textContent.match(/\d+\s*经验/)) {
                const match = span.textContent.match(/(\d+)\s*经验/);
                if (match) {
                    exp = parseFloat(match[1]);
                    expSpan = span;
                }
            }

            if (span.textContent.includes('秒') && span.textContent.match(/([\d.]+)秒/)) {
                const match = span.textContent.match(/([\d.]+)秒/);
                if (match) {
                    seconds = parseFloat(match[1]);
                }
            }
        });

        if (exp !== null && seconds !== null && expSpan) {
            const expPerHour = (3600 / seconds) * exp;

            // Prevent duplicate box
            if (!expSpan.dataset.expAdded) {
                const newBox = document.createElement('span');
                newBox.className = 'inline-block ml-2 rounded text-sm';
                newBox.textContent = `每小时经验: ${expPerHour.toFixed(2)}`;

                // Strong inline highlight styling
                newBox.style.backgroundColor = '#facc15'; // Yellow highlight (like Tailwind yellow-400)
                newBox.style.color = '#000000';
                newBox.style.fontWeight = 'bold';
                newBox.style.padding = '2px 6px';
                newBox.style.borderRadius = '6px';
                newBox.style.display = 'inline-block';

                expSpan.insertAdjacentElement('afterend', newBox);
                expSpan.dataset.expAdded = 'true';
            }
        }
    }

    // Watch for popup dialogs
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (
                    node.nodeType === 1 &&
                    node.classList.contains('el-dialog') &&
                    node.classList.contains('cute-action-dialog')
                ) {
                    setTimeout(() => calculateExpPerHour(node), 100);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
