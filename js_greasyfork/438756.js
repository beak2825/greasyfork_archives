// ==UserScript==
// @name         Убрать ограничения ЯКласса
// @namespace    https://greasyfork.org/ru/scripts/438756
// @version      1.3
// @description  Разрешает копирование текста в заданиях и шагах решения ЯКласс, скачивание медиафайлов
// @author       Lfejkwenfewmf
// @match        *.yaklass.ru/*
// @icon         https://www.yaklass.ru/favicon.ico
// @icon64       https://www.yaklass.ru/Content/Img/favicon/YaKlass/android-chrome-192x192.png
// @grant        none
// @run-at       document-end
// @license      Unlicense
// @homepage     https://greasyfork.org/ru/scripts/438756
// @supportURL   https://greasyfork.org/ru/scripts/438756/feedback
// @downloadURL https://update.greasyfork.org/scripts/438756/%D0%A3%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%BE%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%AF%D0%9A%D0%BB%D0%B0%D1%81%D1%81%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/438756/%D0%A3%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%BE%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%AF%D0%9A%D0%BB%D0%B0%D1%81%D1%81%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof window.Yk.exercise !== 'undefined') {
        window.Yk.utils.disableTextCopyAndContextMenu = function(n) {};
    }
    if (typeof window.Yk.exerciseJsSettings !== 'undefined') {
        window.Yk.exerciseJsSettings.disableMediaFilesDownload = 0;
    }
})();