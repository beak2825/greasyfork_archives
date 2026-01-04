// ==UserScript==
// @name         B24: Remove blur from task description
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes the blur from task description in B24.
// @author       an
// @match        https://b24.office.partner-its.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482801/B24%3A%20Remove%20blur%20from%20task%20description.user.js
// @updateURL https://update.greasyfork.org/scripts/482801/B24%3A%20Remove%20blur%20from%20task%20description.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function resolveAfterXSecond(x) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(x);
            }, x);
        });
    }

    async function f1() {
        var x = await resolveAfterXSecond(500);
        console.log(x);
        for (let i of document.querySelectorAll('#task-detail-description')) {
        i.setAttribute('style', 'filter: none; -webkit-filter: inherit; pointer-events: auto; user-select: auto;');
    }
    }
    f1();
})();