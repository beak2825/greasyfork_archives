// ==UserScript==
// @name         uplibra自动点击
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       sakuta
// @match        https://uplibra.io/dashboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394398/uplibra%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/394398/uplibra%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function(){
        // 刷新页面后自动点击
        setTimeout(function(){
            var buy = document.getElementById('yj_lottery_btn_open');
    	    buy.click();
        },5000)
    });
})();