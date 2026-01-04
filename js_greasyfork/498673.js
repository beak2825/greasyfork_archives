// ==UserScript==
// @name         カラー欄定型文自動入力
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  ページロード時にカラー欄のテキストエリアに定型文を自動入力。
// @license      MIT
// @match        *plus-nao.com/forests/*/mainedit/*
// @match        *plus-nao.com/forests/*/registered_mainedit/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/498673/%E3%82%AB%E3%83%A9%E3%83%BC%E6%AC%84%E5%AE%9A%E5%9E%8B%E6%96%87%E8%87%AA%E5%8B%95%E5%85%A5%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/498673/%E3%82%AB%E3%83%A9%E3%83%BC%E6%AC%84%E5%AE%9A%E5%9E%8B%E6%96%87%E8%87%AA%E5%8B%95%E5%85%A5%E5%8A%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetTextAreaId = 'TbMainproductカラーについて';
    const inputText = `生産ロットにより柄の出方や色の濃淡が異なる場合がございます。
お使いのモニターや撮影時の光の加減などにより
画像と実際の商品のカラーが異なる場合もございます。
予告なしにカラーやデザインなどの変更がある場合もございます。`; // 定型文を変更する場合ここを変更

    function setTextIfEmpty() {
        const textArea = document.getElementById(targetTextAreaId);
        if (textArea) {
            if (textArea.value.trim() === '') {
                textArea.value = inputText;
            }
        } else {

        }
    }

    setTimeout(setTextIfEmpty, 1000);

    let skipDialog = false;

    window.addEventListener('load', () => {
    const inputs = document.querySelectorAll('input[type="text"]:not(#daihyo_syohin_code):not(#TbMainproductWeight), input[type="checkbox"]');
    const selects = document.querySelectorAll('select:not(#TbMainproduct送料設定)');
    const textareas = document.querySelectorAll('textarea:not([data-index="0"]):not([data-index="1"]):not([data-index="2"]):not([data-index="3"]):not(#TbMainproductカラーについて)');


        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.dataset.initialValue = input.checked;
            } else {
                input.dataset.initialValue = input.value;
            }
        });

        selects.forEach(select => {
            select.dataset.initialValue = select.value;
        });

        textareas.forEach(textarea => {
            textarea.dataset.initialValue = textarea.value;
        });

        const buttonIds = ['tempSaveButton', 'saveAndSkuStock', 'registeredSaveAndSkuStock', 'registeredSaveButton'];
        buttonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => {
                    skipDialog = true;
                });
            }
        });

        window.onbeforeunload = function(event) {
            if (skipDialog) {
                skipDialog = false;
                return;
            }

            let hasChanges = false;

            for (let input of inputs) {
                if (input.type === 'checkbox') {
                    if (input.checked !== (input.dataset.initialValue === 'true')) {
                        hasChanges = true;
                        break;
                    }
                } else {
                    if (input.value !== input.dataset.initialValue) {
                        hasChanges = true;
                        break;
                    }
                }
            }

            if (!hasChanges) {
                for (let select of selects) {
                    if (select.value !== select.dataset.initialValue) {
                        hasChanges = true;
                        break;
                    }
                }
            }

            if (!hasChanges) {
                for (let textarea of textareas) {
                    if (textarea.value !== textarea.dataset.initialValue) {
                        hasChanges = true;
                        break;
                    }
                }
            }

            if (hasChanges) {
                event.preventDefault();
                event.returnValue = '';
            }
        };
    });
})();
