// ==UserScript==
// @name Автоматический старт разговора в голосовом чате nekto.me
// @namespace http://tampermonkey.net/
// @version 0.6
// @description Автоматизируйте начало новых разговоров на сайте nekto.me
// @author Vladimir01
// @match https://nekto.me/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491676/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D1%81%D1%82%D0%B0%D1%80%D1%82%20%D1%80%D0%B0%D0%B7%D0%B3%D0%BE%D0%B2%D0%BE%D1%80%D0%B0%20%D0%B2%20%D0%B3%D0%BE%D0%BB%D0%BE%D1%81%D0%BE%D0%B2%D0%BE%D0%BC%20%D1%87%D0%B0%D1%82%D0%B5%20nektome.user.js
// @updateURL https://update.greasyfork.org/scripts/491676/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D1%81%D1%82%D0%B0%D1%80%D1%82%20%D1%80%D0%B0%D0%B7%D0%B3%D0%BE%D0%B2%D0%BE%D1%80%D0%B0%20%D0%B2%20%D0%B3%D0%BE%D0%BB%D0%BE%D1%81%D0%BE%D0%B2%D0%BE%D0%BC%20%D1%87%D0%B0%D1%82%D0%B5%20nektome.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoStartEnabled = true;

    function startNewConversation() {
        if (!autoStartEnabled) return;
        const button = document.querySelector('button.btn.btn-lg.go-scan-button');
        if (button) {
            setTimeout(() => {
                button.click();
            }, 1000);
        }
    }

    function handleStopButtonClick(event) {
        if (event.target.matches('button.btn.btn-lg.stop-talk-button, button.swal2-confirm.swal2-styled')) {
            autoStartEnabled = false;
        }
    }

    function handleStartButtonClick(event) {
        if (event.target.matches('button.btn.btn-lg.go-scan-button')) {
            autoStartEnabled = true;
        }
    }

    function createUI() {
        const uiContainer = document.createElement('div');
        uiContainer.style.position = 'fixed';
        uiContainer.style.top = '10px';
        uiContainer.style.right = '10px';
        uiContainer.style.zIndex = '9999';
        uiContainer.style.backgroundColor = 'white';
        uiContainer.style.padding = '5px';
        uiContainer.style.border = '1px solid black';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Автостарт: ' + (autoStartEnabled ? 'Вкл' : 'Выкл');
        toggleButton.onclick = function() {
            autoStartEnabled = !autoStartEnabled;
            toggleButton.textContent = 'Автостарт: ' + (autoStartEnabled ? 'Вкл' : 'Выкл');
        };

        uiContainer.appendChild(toggleButton);
        document.body.appendChild(uiContainer);
    }

    function observeDOM(callback) {
        const observer = new MutationObserver(callback);
        observer.observe(document.body, { childList: true, subtree: true });
        return observer;
    }

    createUI();

    document.addEventListener('click', handleStopButtonClick);
    document.addEventListener('click', handleStartButtonClick);

    observeDOM(function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                startNewConversation();
            }
        }
    });
})();