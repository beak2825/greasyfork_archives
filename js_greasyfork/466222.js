// ==UserScript==
// @name         Anti_anti_Robot
// @version      0.4
// @description  AutoClick "I'm not a robot"
// @author       its_niks
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @run-at       document-end
// @namespace Anti_anti_Robot
// @downloadURL https://update.greasyfork.org/scripts/466222/Anti_anti_Robot.user.js
// @updateURL https://update.greasyfork.org/scripts/466222/Anti_anti_Robot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('[action="/button-handler"] > button.btn')?.click()
})();