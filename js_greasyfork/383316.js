// ==UserScript==
// @name         autoLoginAndRefreshEasyPM
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        https://easypm.sjfood.us/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383316/autoLoginAndRefreshEasyPM.user.js
// @updateURL https://update.greasyfork.org/scripts/383316/autoLoginAndRefreshEasyPM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hour = 60*60*1000;

    window.setInterval(login,2000);

    window.setInterval(refresh,2*hour);

    function login(){
        if($('.el-button--primary').text() == '登录') {
            setTimeout(function() {
                $('.el-button--primary').click();
            }, 1000);
        } 
    }

    function refresh() {
        location.reload();
    }
    

})();
