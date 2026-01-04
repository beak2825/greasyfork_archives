// ==UserScript==
// @name         MooMoo.io Big Store
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Simple script that make store bigger
// @author       Mr.Penguin
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495297/MooMooio%20Big%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/495297/MooMooio%20Big%20Store.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeStyle() {
        var storeHolder = document.getElementById('storeHolder');

        if (storeHolder) {
            storeHolder.style.height = '600px';
            storeHolder.style.width = '400px';
            clearInterval(intervalId);
        }
    }

    var intervalId = setInterval(changeStyle, 500);
})();
