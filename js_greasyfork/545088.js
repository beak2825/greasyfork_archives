// ==UserScript==
// @name         Gosuslugi FIO changer
// @namespace    http://tampermonkey.net/
// @version      2025-08-10
// @description  Gosuslugi FIO + Phone changer
// @author       vitalto
// @match        https://lk.gosuslugi.ru/settings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gosuslugi.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545088/Gosuslugi%20FIO%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/545088/Gosuslugi%20FIO%20changer.meta.js
// ==/UserScript==

const FIO = "Иванов Иван Иванович";
const PHONE = "+7 999 999-99-99";
const OPERATOR = "Билайн";
const EMAIL = "ivanov@example.com";
const NO_AVATAR_FI = "ИИ";

(function() {
    'use strict';

    const replaceInfo = () => {
         [...document.querySelectorAll('.no-avatar')].forEach(el => {el.textContent = NO_AVATAR_FI});
         [...document.querySelectorAll('.name')].forEach(el => {el.textContent = FIO});
         [...document.querySelectorAll('lk-contact-phone .contact__value')].forEach(el => {el.textContent = PHONE});
         [...document.querySelectorAll('lk-sim-personal .personal__item .title-h4')].slice(0, 1).forEach(el => {el.textContent = PHONE});
         [...document.querySelectorAll('lk-contact-email .contact__value')].forEach(el => {el.textContent = EMAIL});
         [...document.querySelectorAll('lk-sim-personal lk-doc-card-row h4')].slice(0, 1).forEach(el => {el.textContent = OPERATOR});
    };


    const patchDOMMethod = (proto, methodName) => {
        const original = proto[methodName];
        proto[methodName] = function (...args) {
            const result = original.apply(this, args);
            replaceInfo();
            return result;
        };
    };

    patchDOMMethod(Node.prototype, 'appendChild');
    patchDOMMethod(Node.prototype, 'insertBefore');
    patchDOMMethod(Node.prototype, 'replaceChild');

    replaceInfo();
})();