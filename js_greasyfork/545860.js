// ==UserScript==
// @name         Complex
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  отправляет продукты на модерацию
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545860/Complex.user.js
// @updateURL https://update.greasyfork.org/scripts/545860/Complex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateAndConvert(parameterName, value) {
        let hiddenInputElement = document.querySelector(`.cm-inputs .combo-value[name="${parameterName}"]`);
        let visibleInputElement = document.querySelector('.cm-inputs .combo-text');

        if (hiddenInputElement && visibleInputElement) {
            if (hiddenInputElement.value === '0') {
                hiddenInputElement.value = value;
                visibleInputElement.value = value;
                visibleInputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                let convertButton = document.querySelector('.convert-numbers-to-measure-btn');
                if (convertButton) convertButton.click();
            }
        }
    }

    function doubleClickThumb() {
        let thumbnailElement = document.querySelector("#thumbs > ul > li > a.thumb > img");
        if (thumbnailElement) {
            let dblClickEvent = new MouseEvent("dblclick", { bubbles: true, cancelable: true, view: window });
            thumbnailElement.dispatchEvent(dblClickEvent);
        }
    }

    function performActions() {
        updateAndConvert('CurrentDepth', '9');
        updateAndConvert('CurrentWidth', '9');
        updateAndConvert('CurrentHeight', '9');
        doubleClickThumb();

        let statusSelect = document.getElementById("StatusId");
        if (statusSelect) {
            statusSelect.value = "9";
            statusSelect.dispatchEvent(new Event('change'));
        }

        let saveNextBtn = document.querySelector('input#btn-save-and-next') || document.querySelector('input#btn-save');
        if (saveNextBtn) saveNextBtn.click();

        console.log("Действия выполнены и сохранено");
    }

    window.addEventListener('load', () => {
        let widgetBtn = document.getElementById('btn-widget');
        if (!widgetBtn) return;

        let computedStyle = window.getComputedStyle(widgetBtn);

        let newBtn = document.createElement('input');
        newBtn.type = 'button';
        newBtn.value = 'Complex';

        // Синий текст по умолчанию и рамка
        let defaultColor = '#3dabe9';
        newBtn.style.backgroundColor = 'white';
        newBtn.style.border = `2px solid ${defaultColor}`;
        newBtn.style.color = defaultColor;

        // Копируем текстовый стиль с Widget
        newBtn.style.fontFamily = computedStyle.fontFamily;
        newBtn.style.fontSize = computedStyle.fontSize;
        newBtn.style.fontWeight = computedStyle.fontWeight;
        newBtn.style.textAlign = computedStyle.textAlign;
        newBtn.style.lineHeight = computedStyle.lineHeight;

        newBtn.style.borderRadius = '4px';
        newBtn.style.padding = '5px 10px';
        newBtn.style.cursor = 'pointer';
        newBtn.style.marginLeft = '5px';
        newBtn.style.transition = 'all 0.2s ease';

        // Hover эффект: синий фон, белый текст
        newBtn.addEventListener('mouseover', () => {
            newBtn.style.backgroundColor = defaultColor;
            newBtn.style.color = 'white';
        });
        newBtn.addEventListener('mouseout', () => {
            newBtn.style.backgroundColor = 'white';
            newBtn.style.color = defaultColor;
        });

        newBtn.addEventListener('click', performActions);

        widgetBtn.parentNode.insertBefore(newBtn, widgetBtn.nextSibling);
    });
})();
