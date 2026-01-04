// ==UserScript==
// @name      Пауза без дичи
// @namespace   https://hd.kinopoisk.ru/
// @version  1.1
// @grant    GM_addStyle
// @description  В онлайн кинотеатре kinopoiskHD, когда нажимаешь на паузу, убирает затемнение экрана, постер и блок "Какая музыка сейчас играет".
// @match    https://hd.kinopoisk.ru/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467266/%D0%9F%D0%B0%D1%83%D0%B7%D0%B0%20%D0%B1%D0%B5%D0%B7%20%D0%B4%D0%B8%D1%87%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/467266/%D0%9F%D0%B0%D1%83%D0%B7%D0%B0%20%D0%B1%D0%B5%D0%B7%20%D0%B4%D0%B8%D1%87%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyStyle() {
        GM_addStyle('.styles_root__BuMKZ.styles_withControls__6KSS8:after { opacity: 0 !important; }');
    }

    function removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    function monitorAndRemoveElement() {
        var divElement = document.querySelector('.Meta_logo__b1_6W, .styles_compactCardsLayout__N3_bW, .AgeRestriction_snippet__bkTN9.AgeRestriction_snippet_positioned__PNCzA');

        removeElement(divElement);

        setTimeout(monitorAndRemoveElement, 200);
    }

    window.addEventListener('load', function() {
        monitorAndRemoveElement();

        modifyStyle();
    });
})();
