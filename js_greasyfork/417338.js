// ==UserScript==
// @name         I don't want to login
// @version      0.2
// @description  remove the login modal in some force login website
// @author       Richard
// @match        *://*.zhihu.com/*
// @match        *://*.csdn.net/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/711192
// @downloadURL https://update.greasyfork.org/scripts/417338/I%20don%27t%20want%20to%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/417338/I%20don%27t%20want%20to%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function zhihu() {
        var timer = setInterval(function () {
            times += 1;
            console.log('checking ' + (times + 1) + ' times');
            var loginModal = document.querySelector('.signFlowModal');
            if (loginModal) {
                loginModal.parentNode.remove();
                document.querySelector('html').style.overflow = 'auto';
                times = maxCheckTimes;
            }
            if (times >= maxCheckTimes) {
                clearInterval(timer);
            }
        }, 1000);
    }
    function csdn() {
        var timer = setInterval(function () {
            times += 1;
            var loginModal = document.querySelector('#passportbox');
            if (loginModal) {
                loginModal.remove();
                var loginMask = document.querySelector('.login-mark');
                loginMask && loginMask.remove();
            }
        }, 1000);

    }
    var url = location.href;
    var times = 0;
    var maxCheckTimes = 10;
    if (~url.indexOf('zhihu')) {
        zhihu();
    } else if (~url.indexOf('csdn')) {
        csdn();
    }
})();