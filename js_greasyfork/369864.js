// ==UserScript==
// @name         Airbnb Cookie Master
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.airbnb.com/*
// @match        https://zh.airbnb.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369864/Airbnb%20Cookie%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/369864/Airbnb%20Cookie%20Master.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.createElement('img').src = 'https://bloc.airbnb.com/1.gif';
    document.createElement('img').src = 'https://bloc.dev.airbnb.com/1.gif';
})();