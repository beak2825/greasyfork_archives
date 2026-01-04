// ==UserScript==
// @name         安徽专业技术人员继续教育在线-100倍速度刷课
// @namespace    https://www.tuziang.com/
// @version      0.1
// @description  100倍的速度刷课，也就是500分钟的课程5分钟就学完了
// @author       github.com/rockxsj
// @match        *://*.zjzx.ah.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408392/%E5%AE%89%E5%BE%BD%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF-100%E5%80%8D%E9%80%9F%E5%BA%A6%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/408392/%E5%AE%89%E5%BE%BD%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF-100%E5%80%8D%E9%80%9F%E5%BA%A6%E5%88%B7%E8%AF%BE.meta.js
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