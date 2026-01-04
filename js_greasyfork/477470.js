// ==UserScript==
// @name         中铁微课堂刷课时
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  解决中铁微课堂视频学习中每五分钟暂停一次问题，插件可以自动点击继续。
// @author       Lionel
// @match        http://aqpx.crec.cn/student/study*
// @license      GPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477470/%E4%B8%AD%E9%93%81%E5%BE%AE%E8%AF%BE%E5%A0%82%E5%88%B7%E8%AF%BE%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/477470/%E4%B8%AD%E9%93%81%E5%BE%AE%E8%AF%BE%E5%A0%82%E5%88%B7%E8%AF%BE%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        var bt = $(".layui-layer-btn0");
        if(bt.length > 0){
            bt[0].click();
        }
    },5000);
    // Your code here...
})();