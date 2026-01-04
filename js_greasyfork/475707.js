// ==UserScript==
// @name         vuchaev2015 Simulator
// @namespace    https://yaebalosla.com
// @version      alpha0.1
// @description  я запрещаю вам тратить деньги
// @author       Kanoyo
// @match        https://zelenka.guru/*
// @grant        none
// @icon         https://cdn-icons-png.flaticon.com/512/1361/1361339.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475707/vuchaev2015%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/475707/vuchaev2015%20Simulator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentURL = window.location.href;

    if (currentURL.indexOf('/forums/contests/create-thread') !== -1) {
        XenForo.alert('Ошибка: вам запрещено создавать розыгрыши');

        setTimeout(function() {
            history.back();
        }, 1000);
    }
})();
