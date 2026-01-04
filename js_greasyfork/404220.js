// ==UserScript==
// @name         ssrcloud自动签到
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  登录ssrcloud后在用户中心自动签到
// @author       传奇Legend
// @match        http*://*.ssrcloud.com/user*
// @match        http*://*.ssrcloud.net/user*
// @match        http*://*.clashcloud.net/user*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404220/ssrcloud%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/404220/ssrcloud%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
        var btnSignin = $('#checkin');
        if(btnSignin)
        {
            btnSignin.click();
            var result_ok = $('#result_ok');
            var closeResult = setInterval(function(){
                if(!result_ok)
                {
                    clearInterval(closeResult);
                    return;
                }
                result_ok.click();
            },100)
        }
    });
})();