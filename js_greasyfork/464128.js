// ==UserScript==
// @name         Zelenka Guru Green
// @namespace    https://zelenka.guru/
// @version      1.0
// @description  none
// @author      none
// @match       https://zelenka.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464128/Zelenka%20Guru%20Green.user.js
// @updateURL https://update.greasyfork.org/scripts/464128/Zelenka%20Guru%20Green.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML = '::selection { background-color: #2BAD72; color: white; }';
    document.head.appendChild(style);
})();