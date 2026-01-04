// ==UserScript==
// @name         I love Robot
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  I miss Robot
// @license MIT
// @author       Somebody
// @match        https://dangjian.hxq.komect.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=komect.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464736/I%20love%20Robot.user.js
// @updateURL https://update.greasyfork.org/scripts/464736/I%20love%20Robot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        var path = window.location.pathname;
        if (path == '/dkdtweb/' || path == '/dkdtweb/index') {
            document.getElementsByClassName('with-computer')[0].click();
            console.log('press with computer');
        } else if (path == '/dkdtweb/computer' || path == '/dkdtweb/result') {
            var begin = document.getElementsByClassName('btn-begin');
            if (begin.length > 0) {
                begin[0].click();
                console.log('press with begin');
            }
            var cont = document.getElementsByClassName('btn-continue');
            if (cont.length > 0) {
                cont[0].click();
                console.log('press with continue');
            }
        } else if (path == '/dkdtweb/answerRobot') {
            var length = document.getElementsByClassName('answer').length;
            var answer = Math.floor(Math.random() * length);
            document.getElementsByClassName('answer')[answer].click();
            console.log('randomly choose an answer');
        }
    },1000);

})();