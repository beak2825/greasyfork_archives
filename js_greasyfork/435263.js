// ==UserScript==
// @name         azkaban 自动刷新
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  这个功能可能在job list的日志每5秒给刷新一下。
// @author       You
// @match        https://10.4.4.182:8444/executor*
// @icon         https://www.google.com/s2/favicons?domain=4.182
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435263/azkaban%20%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/435263/azkaban%20%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var obj = document.getElementById("updateLogBtn");
    var autoRefreshBTN = document.createElement('button');
    autoRefreshBTN.className='btn btn-xs btn-default';
    autoRefreshBTN.textContent='auto refresh in 5s';
    var timeclick;
    var startRefresh = function(){
        console.log('开始');
        autoRefreshBTN.textContent='stop';
        autoRefreshBTN.onclick = function(){
            clearInterval(timeclick);
            autoRefreshBTN.textContent='auto refresh in 5s';
            autoRefreshBTN.onclick= startRefresh;
        };
        timeclick = setInterval(function(){
            obj.click();
        }, 5000);
    };
    autoRefreshBTN.onclick= startRefresh;
    obj.parentElement.append(autoRefreshBTN);
    // Your code here...
})();