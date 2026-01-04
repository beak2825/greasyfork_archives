// ==UserScript==
// @name         Перезагрузчик Moodle ЧувГУ
// @namespace    https://greasyfork.org/ru/scripts/458350
// @version      1.3
// @description  Обновляет веб-страницы с обеими версиями Moodle ЧувГУ через каждые 1 час 59 минут, чтобы не вылетали
// @author       Lfejkwenfewmf
// @match        https://moodle.chuvsu.ru/*
// @match        https://study.chuvsu.ru/*
// @icon         https://study.chuvsu.ru/theme/image.php/adaptable/theme/1681980929/favicon
// @grant        none
// @run-at       document-start
// @license      Unlicense
// @homepage     https://greasyfork.org/ru/scripts/458350
// @supportURL   https://greasyfork.org/ru/scripts/458350/feedback
// @downloadURL https://update.greasyfork.org/scripts/458350/%D0%9F%D0%B5%D1%80%D0%B5%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%20Moodle%20%D0%A7%D1%83%D0%B2%D0%93%D0%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/458350/%D0%9F%D0%B5%D1%80%D0%B5%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%20Moodle%20%D0%A7%D1%83%D0%B2%D0%93%D0%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // https://stackoverflow.com/questions/19807665/auto-refresh-for-every-5-mins
	setInterval(function() {
                  window.location.reload();
                }, (1*60+59)*60*1000);
})();