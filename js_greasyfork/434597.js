// ==UserScript==
// @name         专技天下刷课脚本
// @namespace    https://www.zgzjzj.com/
// @version      0.1
// @description  专技天下刷课脚本（自动播放、自动下一节）
// @author       itxcc
// @match        *://*.zgzjzj.com/*
// @grant        none
// @note 2020-09-25 更新
// @downloadURL https://update.greasyfork.org/scripts/434597/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/434597/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function isAlert(){
        return false
    }
    
    function changeClock()
    {
        var d = new Date((++time) * 1000);
        var d2 = new Date((++totalTime) * 1000);
        $("#nowTime").html(d.getUTCHours() + ":" + d.getMinutes() + ":" + d.getSeconds()) ;
        $("#totalTime").html(d2.getUTCHours() + ":" + d2.getMinutes() + ":" + d2.getSeconds()) ;
    }
    
    clockTimer = window.setInterval(changeClock, 10);
    saveTimer = window.setInterval(learningSave, 1200);
})();