// ==UserScript==
// @name        RuijieRouterBypass
// @namespace   Violentmonkey Scripts
// @match       http://192.168.110.1/*
// @grant       none
// @version     0.1
// @license     WTFPL
// @description 解除锐捷睿易路由器 EWEB 登录次数限制
// @downloadURL https://update.greasyfork.org/scripts/528133/RuijieRouterBypass.user.js
// @updateURL https://update.greasyfork.org/scripts/528133/RuijieRouterBypass.meta.js
// ==/UserScript==


(function() {
    'use strict';

    window.addEventListener('load', function() {
        if (typeof loginNum !== 'undefined' && typeof loginTime !== 'undefined') {
            loginNum = 0;
            loginTime = Math.floor(new Date().getTime() / 1000);

            console.log('Login limit bypassed. loginNum:', loginNum, 'loginTime:', loginTime);
        } else {
            console.log('loginNum or loginTime not found in the global scope.');
        }
    });
})();
