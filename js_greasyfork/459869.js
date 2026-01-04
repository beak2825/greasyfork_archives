// ==UserScript==
// @name         greasyfork install
// @autor        Hader Araujo
// @namespace    http://tampermonkey.net/
// @description  code: greasyfork install
// @include      https://greasyfork.org/pt-BR/scripts*
// @license      MIT
// @version      0.03
// @grant        GM_openInTab
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/459869/greasyfork%20install.user.js
// @updateURL https://update.greasyfork.org/scripts/459869/greasyfork%20install.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const oneSecond = 1000

    function executeWithSleepBegin(delay, func) {

        setTimeout(() => {
            func.call()
        }, delay);

    };

    executeWithSleepBegin(oneSecond * 5, () => {

        document.querySelector("div[id='install-area'] > a").click()

        executeWithSleepBegin(oneSecond * 2, () => {
            window.close();
        })
    })


})();