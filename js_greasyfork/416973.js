// ==UserScript==
// @name         Подмена фона
// @namespace    https://monopolize.ru/
// @version      2.3
// @description  Пользовательскоe меню
// @author       Tim
// @match        https://monolife.ru/game/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/416973/%D0%9F%D0%BE%D0%B4%D0%BC%D0%B5%D0%BD%D0%B0%20%D1%84%D0%BE%D0%BD%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/416973/%D0%9F%D0%BE%D0%B4%D0%BC%D0%B5%D0%BD%D0%B0%20%D1%84%D0%BE%D0%BD%D0%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let cacheImage = null;
    let cachedResult = null;

    function getImage() {
        if (cacheImage !== null) {
            return cacheImage;
        }
        cacheImage = window.localStorage.getItem('background');
        return cacheImage;
    }

    function myNum() {
        if (cachedResult !== null) {
            return cachedResult;
        }

        if (document.querySelector('.btnum9')) {
            cachedResult = document.querySelector('.Chip.current').className.replace(/[^0-9]/g, "");
            return cachedResult;
        }
    }

    function updateBackground() {
        let image = getImage();
        if (image) {
            document.querySelectorAll('.game-step__inner-info').forEach(item => {
                let num = item.className.replace(/[^0-9]/g, "")
                if (myNum() == num) {
                    item.style.cssText = `background-image: url(${image});background-size: cover;`;
                } else {
                    item.removeAttribute('style');
                }
            })
        }
    }

    setInterval(function () {
        if (!document.querySelector(`#player${userId}`)) {
            cachedResult = null;
            return;
        }
        updateBackground()
    }, 500);

    GM_registerMenuCommand("Ввести url картинки", function () {
        let input = prompt("Введите url картинки:");

        let img = new Image();
        img.src = input;
        img.onload = function () {
            window.localStorage.setItem('background', input);
        };
        img.onerror = function () {
            alert('url картинки не верный');
        }
    });

})();