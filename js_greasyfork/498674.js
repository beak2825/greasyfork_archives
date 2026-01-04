// ==UserScript==
// @name         原価計算
// @namespace    http://tampermonkey.net/
// @version      1.32.01
// @description  仕入れ原価(元)の入力欄に電卓機能を追加
// @license      MIT
// @match        *://plus-nao.com/forests/*/mainedit/*
// @match        *://plus-nao.com/forests/*/registered_mainedit/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/498674/%E5%8E%9F%E4%BE%A1%E8%A8%88%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/498674/%E5%8E%9F%E4%BE%A1%E8%A8%88%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalInputField = document.getElementById('TbMainproductGenkaTnk');
    const multiplierInputField = document.getElementById('TbMainproductGenkaTnkRmb');

    function evaluateExpression(expr) {
        let result = NaN;

        if (expr.trim() === '') {
            return result;
        }

        expr = expr.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
        expr = expr.replace(/＋/g, '+')
                   .replace(/－/g, '-')
                   .replace(/×/g, '*')
                   .replace(/÷/g, '/')
                   .replace(/．/g, '.');

        if (!/^[\d+\-*/().]+$/.test(expr)) {
            return result;
        }

        try {
            const maxDecimalPlaces = (expr.match(/\.\d+/g) || []).reduce((max, num) => {
                return Math.max(max, num.length - 1);
            }, 0);

            const scalingFactor = Math.pow(10, maxDecimalPlaces);
            const scaledExpr = `(${expr}) * ${scalingFactor}`;
            result = new Function('return ' + scaledExpr)() / scalingFactor;

            result = Math.round(result * 100) / 100;

        } catch (error) {
            console.error('無効な式です:', error);
        }
        return result;
    }

    if (multiplierInputField) {
        const newInputField = document.getElementById('TbMainproductGenkaTnkMultiplier');
        if (newInputField) {
            newInputField.remove();
        }

        multiplierInputField.placeholder = '原価を計算';

        multiplierInputField.addEventListener('focusout', () => {
            const expr = multiplierInputField.value.trim();
            const result = evaluateExpression(expr);

            if (!isNaN(result)) {
                multiplierInputField.value = result;
            }

            const inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            multiplierInputField.dispatchEvent(inputEvent);
        });
    } else {
        if (originalInputField) {
            const newInputField = document.createElement('input');
            newInputField.type = 'text';
            newInputField.id = 'TbMainproductGenkaTnkMultiplier';
            newInputField.placeholder = '原価を計算';

            originalInputField.parentNode.insertBefore(newInputField, originalInputField.nextSibling);

            newInputField.addEventListener('change', () => {
                const expr = newInputField.value.trim();
                const result = evaluateExpression(expr);

                if (!isNaN(result)) {
                    originalInputField.value = Math.ceil(result * 23);
                }
            });
        }
    }
})();
