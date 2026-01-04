// ==UserScript==
// @name         Телемост яндекс зайти без микро и видео
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Заходит на телемост Яндекс в браузере с выключенным микрофоном и видео
// @author       You
// @match        https://telemost.yandex.ru/j/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru
// @grant        none
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/450385/%D0%A2%D0%B5%D0%BB%D0%B5%D0%BC%D0%BE%D1%81%D1%82%20%D1%8F%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%B7%D0%B0%D0%B9%D1%82%D0%B8%20%D0%B1%D0%B5%D0%B7%20%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%20%D0%B8%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/450385/%D0%A2%D0%B5%D0%BB%D0%B5%D0%BC%D0%BE%D1%81%D1%82%20%D1%8F%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%B7%D0%B0%D0%B9%D1%82%D0%B8%20%D0%B1%D0%B5%D0%B7%20%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%20%D0%B8%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.getElementsByClassName('Button2')[0].innerHTML.includes('Хорошо')) {
        return
    }
    const delay = 500;
    document.getElementsByClassName('Button2')[0].click();

    let arrayFunc = [
        () => { document. querySelector('[title="Выключить микрофон"]')?.click(); },
        () => { document. querySelector('[title="Выключить камеру"]')?.click(); },
        () => { document.getElementsByClassName('Button2_view_accent')[0].click(); },
    ];
    const interval = setInterval(() => {
        if(document.getElementsByClassName('Button2_view_translucent').length) {
            clearInterval(interval);
            doit();
        }
    }, 500)
    const doit = () => {
        setTimeout(() => {
            console.log(arrayFunc)
            arrayFunc[0]();
            arrayFunc = arrayFunc.slice(1);
            if(arrayFunc.length) {
                doit();
            }
        }, delay);
    }
    // Your code here...
})();










