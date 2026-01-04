// ==UserScript==
// @name         LZT Better Code
// @namespace    lzt_better_code
// @version      1.1
// @description  Скрипт дает возможность раскрытия блока ввода кода на весь экран
// @author       seuyh
// @license      MIT
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.market/*
// @match        https://zelenka.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @supportURL   https://zelenka.guru/seuyh/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492006/LZT%20Better%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/492006/LZT%20Better%20Code.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isExpanded = false;

function setStyles() {
    const overlay = document.querySelector("body > div.modal.fade.in > div")
    const codeMirrorWrapper = overlay.querySelector('.CodeMirror');
    const xenForm = document.querySelector("#editor_code_form");
    const main_wrapper = document.querySelector("body > div.modal.fade.in > div > div");
    const ctrlUnit = document.querySelector("#editor_code_form > dl:nth-child(2)");
    const code_mirror = document.querySelector("#editor_code_form > dl:nth-child(2) > dd > div");
    const dd = document.querySelector("#editor_code_form > dl:nth-child(2) > dd");
    const dts = document.querySelectorAll('.xenForm .ctrlUnit > dt');

    if (isExpanded) {
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.maxWidth = '100%';
        overlay.style.width = '80%';
        overlay.style.height = '96%';
        overlay.style.zIndex = '9999';

        main_wrapper.style.maxHeight = '100%';
        main_wrapper.style.height = '100%';

        xenForm.style.margin = '0px';
        xenForm.style.maxHeight = '100%';
        xenForm.style.height = '100%';
        xenForm.style.maxWidth = '100%';

        ctrlUnit.style.height = '80%';

        code_mirror.style.height = '100%';
        code_mirror.style.width = '100%';

        dd.style.height = '100%';

        dts.forEach(dt => {
            dt.style.width = '18%';
        });
    } else {
        overlay.style.top = '';
        overlay.style.left = '';
        overlay.style.maxWidth = '';
        overlay.style.width = '';
        overlay.style.height = '';
        overlay.style.zIndex = '';

        main_wrapper.style.maxHeight = '';
        main_wrapper.style.height = '';

        xenForm.style.margin = '';
        xenForm.style.maxHeight = '';
        xenForm.style.height = '';
        xenForm.style.maxWidth = '';

        ctrlUnit.style.height = '';

        code_mirror.style.height = '';
        code_mirror.style.width = '';

        dd.style.height = '';

        dts.forEach(dt => {
            dt.style.width = '';
        });
    }
}

function toggleButtonState(button) {
    isExpanded = !isExpanded;
    button.innerHTML = isExpanded ? '<i class="fa fa-compress"></i>' : '<i class="fa fa-expand"></i>'; // Меняем иконку кнопки
    setStyles();
}

function addExpandButton() {
    const modalContent = document.querySelector("body > div.modal.fade.in > div");
    if (modalContent) {
        const expandButton = document.createElement('button');
        expandButton.innerHTML = '<i class="fa fa-expand"></i>';
        expandButton.classList.add('expand-button');
        expandButton.style.position = 'absolute';
        expandButton.style.bottom = '10px';
        expandButton.style.right = '30px';
        expandButton.style.fontSize = '15px';
        expandButton.addEventListener('click', function() {
            toggleButtonState(expandButton);
        });
        modalContent.appendChild(expandButton);
    }
}


const intervalId = setInterval(() => {
    const modalContent = document.querySelector("body > div.modal.fade.in > div");
    const editorCodeForm = document.querySelector("#editor_code_form");
    if (modalContent && editorCodeForm) {
        addExpandButton();
        clearInterval(intervalId);
    }
}, 1000);


function addPaddingToComments() {
    const commentSpans = document.querySelectorAll('span.token.comment');
    commentSpans.forEach(span => {
        span.style.padding = '3px 10px';
    });
}

setInterval(() => {
    addPaddingToComments();
}, 1000);


})();