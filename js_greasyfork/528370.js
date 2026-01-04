// ==UserScript==
// @name         KamiHime battle speed up
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  change speed up factor of animation in KamiHime battles
// @include      https://gskh-api-r-zh.prod.skh.johren.games/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/528370/KamiHime%20battle%20speed%20up.user.js
// @updateURL https://update.greasyfork.org/scripts/528370/KamiHime%20battle%20speed%20up.meta.js
// ==/UserScript==

//////// Settings Start ////////
const SPEED = 1.3; //speed up animation by x times
//////// Settings End ///////

(function() {
    'use strict';

    function waitGame(callback) {
        const intervalID = setInterval(() => {
            if (window?.kh?.PlayerGameConfig) {
                console.log(window.location.href)
                clearInterval(intervalID);
                callback();
            }
        }, 1000);
    }

    function modifySpeed(){
        const config = window.kh.PlayerGameConfig.prototype.BATTLE_SPEED_SETTINGS;
        config.quick = SPEED;
    }
    waitGame(modifySpeed)
})();