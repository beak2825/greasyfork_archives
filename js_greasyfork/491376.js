// ==UserScript==
// @name         Защита от перехода на страницу бана
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Предотвращает переход на страницу бана на сайте zelenka.guru
// @author       unc
// @match        https://zelenka.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491376/%D0%97%D0%B0%D1%89%D0%B8%D1%82%D0%B0%20%D0%BE%D1%82%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%B0%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%83%20%D0%B1%D0%B0%D0%BD%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/491376/%D0%97%D0%B0%D1%89%D0%B8%D1%82%D0%B0%20%D0%BE%D1%82%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%B0%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%83%20%D0%B1%D0%B0%D0%BD%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        if (links[i].href === 'https://zelenka.guru/account/ban') {
            links[i].addEventListener('click', function(event) {
                event.preventDefault();
                XenForo.alert('Деньги Успешно переведены  ', '', 1500)
            });
        }
    }
})();
