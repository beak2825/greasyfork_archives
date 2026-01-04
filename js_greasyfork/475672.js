// ==UserScript==
// @name         DetectTextStateChange
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Отслеживание элементов ввода текста на форуме и защита от случайного перехода
// @author       vuchaev2015
// @match        https://zelenka.guru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475672/DetectTextStateChange.user.js
// @updateURL https://update.greasyfork.org/scripts/475672/DetectTextStateChange.meta.js
// ==/UserScript==

let element = document.querySelector('.fr-wrapper');

let lastState = null;

let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === "class") {
            let classList = mutation.target.classList;
            if (classList.contains('show-placeholder')) {
                if (lastState !== 'empty') {
                    lastState = 'empty';
                }
            } else {
                if (lastState !== 'filled') {
                    lastState = 'filled';
                }
            }
        }
    });
});

observer.observe(element, { attributes: true });

window.addEventListener('beforeunload', function (e) {
    if (lastState === 'filled') {
        e.preventDefault();
        e.returnValue = '';
    }
});
