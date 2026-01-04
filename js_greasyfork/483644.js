// ==UserScript==
// @name         Aviso ad
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Renda Extra
// @author       Groland
// @match        https://aviso.bz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483644/Aviso%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/483644/Aviso%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

function autoClaim() {
        const element = document.querySelector('.youtube-error');
        if (element.innerText === 'Площадка Вам не доступна') {
            element.click();
            location.reload();
        }
    }
    ((setInterval))(autoClaim, 5000);

    function fun() {
        const element = document.querySelector('.youtube-error');
        if (element.innerText === 'Площадка не найдена') {
            element.click();
            location.reload();
        }
    }
    ((setInterval))(fun, 5000);
})();