// ==UserScript==
// @name         Popup blocker on ani.gamer.com.tw
// @namespace    https://github.com/gslin/popup-blocker-on-ani.gamer.com.tw/
// @version      0.20200523.0
// @description  Block popup windows on ani.gamer.com.tw
// @author       Gea-Suan Lin <gslin@gslin.com>
// @match        https://ani.gamer.com.tw/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/403973/Popup%20blocker%20on%20anigamercomtw.user.js
// @updateURL https://update.greasyfork.org/scripts/403973/Popup%20blocker%20on%20anigamercomtw.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.alert = (msg) => {
        console.debug('Alert (blocked): ' + msg)
    };
})();
