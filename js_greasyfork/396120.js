// ==UserScript==
// @name         nedrug session time extender
// @namespace    https://nedrug.mfds.go.kr
// @version      1.1
// @description  extend nedrug session time
// @author       nedrug
// @match        https://nedrug.mfds.go.kr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396120/nedrug%20session%20time%20extender.user.js
// @updateURL https://update.greasyfork.org/scripts/396120/nedrug%20session%20time%20extender.meta.js
// ==/UserScript==

(function() {
    'use strict'

    window.timer_SessionTimer = function() {
        if (sessionTimer_timerObj !== undefined) {
            clearTimeout(sessionTimer_timerObj)
            sessionTimer_timerObj = undefined
        }
        let div = document.getElementById('session-timer-text')
        if (div) {
            div.innerHTML = '무제한'
        }
    }

})()