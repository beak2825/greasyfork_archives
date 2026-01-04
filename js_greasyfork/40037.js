// ==UserScript==
// @name         LQE server unlocker
// @version      0.1
// @description  Unlock some good stuff :)
// @author       You
// @match        https://gloc-lqe-tool.appspot.com/app/*
// @grant        none
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @run-at      document-idle
// @namespace https://greasyfork.org/users/166154
// @downloadURL https://update.greasyfork.org/scripts/40037/LQE%20server%20unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/40037/LQE%20server%20unlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var checkExist = setInterval(function () {
        var length = $('.ui-select-match').length;
        if(length > 10) {
            clearInterval(checkExist);
            Unlock();
        }
    },500);

    function Unlock() {
        console.log("Unlocking!");
        $('.ui-select-container[disabled=disabled]')[0].removeAttribute('disabled');
        $('.ui-select-match-item[disabled=disabled]')[0].removeAttribute('disabled');
        $('input[disabled=disabled]')[0].removeAttribute('disabled');
        $('button:contains("all")[disabled=disabled]')[0].removeAttribute('disabled');
    }
})();