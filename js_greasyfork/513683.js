// ==UserScript==
// @name         Free subscribe
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Free subscribe freesmetaonline.ru
// @author       Вы
// @match        *://freesmetaonline.ru/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/513683/Free%20subscribe.user.js
// @updateURL https://update.greasyfork.org/scripts/513683/Free%20subscribe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const desiredValue = "Wed, 07 Jan 2099 00:00:00 GMT";

    function setSubscribeGS() {
        const currentValue = localStorage.getItem("subscribeGS");

        if (currentValue !== desiredValue) {
            localStorage.setItem("subscribeGS", desiredValue);
            console.log("Значение subscribeGS изменено на:", desiredValue);
        }
    }

    setSubscribeGS();

    window.addEventListener('storage', function(event) {
        if (event.key === "subscribeGS" && event.newValue !== desiredValue) {
            setSubscribeGS();
        }
    });
})();
