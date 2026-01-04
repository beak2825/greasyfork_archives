// ==UserScript==
// @name         HamsterKombat PC bypass
// @name:ru      HamsterKombat PC обход
// @namespace    http://tampermonkey.net/
// @version      1.5
// @match        *://*/*
// @author       swat1x
// @description  Plugin allows to join HamsterKombat via PC and prints it's authorization token
// @description:ru Плагин позволяет зайти в HamsterKombat через ПК и вывести в консоль свой токен авторизации
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hamsterkombat.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501355/HamsterKombat%20PC%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/501355/HamsterKombat%20PC%20bypass.meta.js
// ==/UserScript==


(function () {
    'use strict';

    if (location.hostname === 'hamsterkombatgame.io') {
        const original_indexOf = Array.prototype.indexOf
        Array.prototype.indexOf = function (...args) {
            if (JSON.stringify(this) === JSON.stringify(["android", "android_x", "ios"])) {
                setTimeout(() => {
                    Array.prototype.indexOf = original_indexOf
                })
                return 0;
            }
            return original_indexOf.apply(this, args)
        }


        var fetchedToken;
        const originalFetch = window.fetch;
        window.fetch = function (input, init) {
            if (init && init.method && init.method.toLowerCase() === 'post') {
                if (init.headers.Authorization && !fetchedToken && init.baseURL === 'https://api.hamsterkombatgame.io') {
                    fetchedToken = init.headers.Authorization
                    console.log("Copy it -> " + fetchedToken.split("Bearer ")[1])
                }
            }
            return originalFetch.apply(this, arguments);
        };


    }

})();