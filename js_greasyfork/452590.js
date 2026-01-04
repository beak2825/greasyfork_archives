// ==UserScript==
// @name         洛谷签到转换器
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  让你的签到有趣起来
// @author       VitamineC(?
// @match        https://*.luogu.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452590/%E6%B4%9B%E8%B0%B7%E7%AD%BE%E5%88%B0%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/452590/%E6%B4%9B%E8%B0%B7%E7%AD%BE%E5%88%B0%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==


$(window).load(function()
{
    'use strict';
    /*求大神自己添加下洛谷签到按钮onclick->update() qwq*/
    function update(){
    var luckno=document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(1) > div > div > div > div.am-u-md-4.lg-punch.am-text-center > span");
    if(luckno!=null){
        var today=luckno.innerText;
        if(today=='§ 大吉 §'){
            luckno.innerText='§ 囉銏钵锿玅宥契 §';
        }else if(today=='§ 中吉 §'){
            luckno.innerText='§ 锣硕菠嬡篎铀萋 §';
        }else if(today=='§ 小吉 §'){
            luckno.innerText='§ 箩硕钵皑庿侑琦 §';
        }else if(today=='§ 中平 §'){
            luckno.innerText='§ 雒说柏暧繆釉企 §';
        }else if(today=='§ 凶 §'){
            luckno.innerText='§ 啰嗦博哀描油漆 §';
        }else if(today=='§ 大凶 §'){
            luckno.innerText='§ 罗硕博哎苗有其 §';
        }
    }
    }
    update();
});
