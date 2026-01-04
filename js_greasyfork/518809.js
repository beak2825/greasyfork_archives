// ==UserScript==
// @name         HWM_Redirect_Roulette by SqZ
// @namespace    http://your.homepage/
// @version      0.2
// @description  Блочит рулетку 
// @match        *://www.heroeswm.ru/roulette.php
// @match        *://www.heroeswm.ru/inforoul.php?id=*
// @match        *://www.heroeswm.ru/allroul.php
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/518809/HWM_Redirect_Roulette%20by%20SqZ.user.js
// @updateURL https://update.greasyfork.org/scripts/518809/HWM_Redirect_Roulette%20by%20SqZ.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Проверяем текущий URL
    if (window.location.href === "https://www.heroeswm.ru/roulette.php") {
        // Перенаправление на домашнюю страницу
        window.location.href = "https://www.heroeswm.ru/home.php";
    }
})();

(function() {
    'use strict';

    // Проверяем текущий URL
    if (window.location.href === "https://www.heroeswm.ru/inforoul.php?id=*") {
        // Перенаправление на домашнюю страницу
        window.location.href = "https://www.heroeswm.ru/home.php";
    }
})();

(function() {
    'use strict';

    // Проверяем текущий URL
    if (window.location.href === "https://www.heroeswm.ru/allroul.php") {
        // Перенаправление на домашнюю страницу
        window.location.href = "https://www.heroeswm.ru/home.php";
    }
})();