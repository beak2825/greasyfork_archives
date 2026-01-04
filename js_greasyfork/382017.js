// ==UserScript==
// @name         wulihun auto login
// @namespace    http://www.wulihub.com.cn/
// @version      1.0
// @description  cause I'm busy
// @author       Lennon
// @match        *.wulihub.com.cn/*
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @run-at       document-end
// @icon         http://www.wulihub.com.cn/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/382017/wulihun%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/382017/wulihun%20auto%20login.meta.js
// ==/UserScript==
(function() {
    'use strict';

    setTimeout(function () {
        var elementPassword = $('input[name="password"]');
        var elementButton = $('input[value="访问"]');
        if(!elementPassword.val() || !elementButton.length){
            return false;
        }

        elementButton.click();
    }, 800);
})();