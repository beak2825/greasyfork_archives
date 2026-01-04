// ==UserScript==
// @name         Simple Editor
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Simple
// @author       SOKevg
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498032/Simple%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/498032/Simple%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция, имитирующая клик по кнопке #btn-use-custom-editor
    function clickCustomEditorButton() {
        var button = document.querySelector('#btn-use-custom-editor');
        if (button) {
            button.click();
        }
    }

    // Функция, имитирующая клик по кнопке #btn-use-simple-editor
    function clickSimpleEditorButton() {
        var button = document.querySelector('#btn-use-simple-editor');
        if (button) {
            button.click();
        }
    }

    // Функция, имитирующая клик по кнопке #btn-locked
    function clickLockedButton() {
        var button = document.querySelector('#btn-locked');
        if (button && !button.classList.contains('btn-locked')) {
            button.click();
        }
    }

    // Функция, устанавливающая обработчик кликов на заданный селектор
    function addClickListener(selector) {
        var element = document.querySelector(selector);
        if (element) {
            element.addEventListener('click', function() {
                var simpleEditorButton = document.querySelector('#btn-use-simple-editor');
                if (simpleEditorButton && simpleEditorButton.classList.contains('editorMode') &&
                    simpleEditorButton.classList.contains('btn') &&
                    simpleEditorButton.classList.contains('btn-default') &&
                    simpleEditorButton.classList.contains('btn-primary')) {
                    clickCustomEditorButton();
                    // Установка таймера для выполнения clickSimpleEditorButton через 5 секунд
                    setTimeout(function() {
                        clickSimpleEditorButton();
                        // Установка таймера для выполнения clickLockedButton через 5 секунд после clickSimpleEditorButton
                        setTimeout(clickLockedButton, 5);
                    }, 5); // 5000 миллисекунд = 5 секунд
                }
            });
        }
    }

    // Установка обработчиков кликов для обоих селекторов
    addClickListener('#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(5) > a');
    addClickListener('#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(3) > td:nth-child(5) > a');
})();

