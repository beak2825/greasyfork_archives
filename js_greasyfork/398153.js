// ==UserScript==
// @name         保持网站登录状态
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  通过使用脚本静默刷新来保持网站登录状态
// @require      http://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @author       auko
// @match        https://moodle.scnu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398153/%E4%BF%9D%E6%8C%81%E7%BD%91%E7%AB%99%E7%99%BB%E5%BD%95%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/398153/%E4%BF%9D%E6%8C%81%E7%BD%91%E7%AB%99%E7%99%BB%E5%BD%95%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function refresh(){
        $.ajax({
            url:window.location.href,
            success:(arg)=>{
                console.log("刷新成功");
            },
            error:function(a,b,c){
                console.warn("请求失败："+b);
            }
        })
    }
    // 3-4min刷新一次
    setInterval(refresh,180000 + Math.floor(Math.random()*60000));

})();