// ==UserScript==
// @name         shiyuegame h5
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  a h5 game assistance
// @author       techsimon
// @match        https://sszgh5-cdn.shiyuegame.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403471/shiyuegame%20h5.user.js
// @updateURL https://update.greasyfork.org/scripts/403471/shiyuegame%20h5.meta.js
// ==/UserScript==


(function () {
    'use strict';

    var _this = window

    setTimeout(function(){

        console.log(_this.gcore)
        //debugger

        _this.message('自动登入中...')
        _this.gcore.SmartSocket.connect('s176-shmix-h5sszg.shiyuegame.com', 55061, 'wws')

    }, 3000)


})();