// ==UserScript==
// @name         Fo4BP
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Сбор наград в ивенте Путь чемпиона!
// @author       BwinkyPC
// @match        https://fo4.101xp.com/shop/path-of-champion-season-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=101xp.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453730/Fo4BP.user.js
// @updateURL https://update.greasyfork.org/scripts/453730/Fo4BP.meta.js
// ==/UserScript==
(function () {
    'use strict';

    if (document.querySelector('.fc-shop-link') !== null) {
        var d1 = document.querySelector('.btn.btn--main.btn--bp-main')
        if (document.querySelector('.js--get-lvl-reward.btn--main.btn--bp-main') !== null) {
            d1.insertAdjacentHTML('afterend', '<button class="btn--main btn--bp-main" id="clickMe" style="margin-left:5px;"><span>Получить все награды</span></button>');
        } else {
            d1.insertAdjacentHTML('afterend', '<button disabled class="btn--main btn--bp-main" id="clickMe" style="margin-left:5px; opacity: 0.5; background: none;";><span>Получить все награды</span></button>');
        }
        document.getElementById("clickMe").onclick = function() {
            const f = () => {
                document.querySelectorAll('.js--get-lvl-reward.btn--main.btn--bp-main span').forEach(i => i.click());
                window.setTimeout(f, 10)
            };
            f();
        };
    } else {}

})();