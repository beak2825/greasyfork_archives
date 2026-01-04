// ==UserScript==
// @name         河北远程学习
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  河北远程学习刷时间
// @author       You
// @match        *://*.teacher.com.cn/*
// @icon         https://www.google.com/s2/favicons?domain=teacher.com.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442246/%E6%B2%B3%E5%8C%97%E8%BF%9C%E7%A8%8B%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/442246/%E6%B2%B3%E5%8C%97%E8%BF%9C%E7%A8%8B%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //播放
    setInterval(setT,3000)
    function setT(){
        document.querySelector(".ccH5PlayBtn").click()
    }
    //8分钟后刷新，重新开始计时
    setInterval(function(){
      location.reload()
    },485000)

})();