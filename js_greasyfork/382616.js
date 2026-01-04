// ==UserScript==
// @icon         https://www.52pojie.cn/favicon.ico
// @name         学破解论坛自动签到助手_免打扰
// @namespace    https://zfdev.com/
// @version      0.3.4
// @description  打开论坛自动签到, 无其他提示
// @author       ZFDev
// @match        *://www.xuepojie.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382616/%E5%AD%A6%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B_%E5%85%8D%E6%89%93%E6%89%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/382616/%E5%AD%A6%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B_%E5%85%8D%E6%89%93%E6%89%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function saveDate(){
        localStorage.setItem('autoSign',new Date().toDateString());
    }
    function isTody(){
        var lastSignDate = localStorage.getItem('autoSign');
        if(lastSignDate){
            return new Date(lastSignDate).toDateString() === new Date().toDateString();
        }else{
            return false;
        }
    }
    let s = {
        a: "正在自动签到...",
        b: "本期您已申请过此任务",
        c: "您已经签到了!",
        d: "任务已完成",
        f: "签到成功!",
        g: "签到失败!",
        h: '<img src="https://www.52pojie.cn/static/image/common/wbs.png" class="qq_bind" align="absmiddle" alt="">',
        i: "自动签到中..",
        j: '#hd .wp #um p > a > 签到领奖',
        k: 'hzb7com_sign-sign.html?signop=sign&formhash=bc11d4e1',

    }
    function autoSign(num) {
        if (!isTody()){
            let a = document.querySelector(s.j);
            if(a){
                a = a.parentNode;
                a.text = s.i;
                try{
                    var x = new Ajax();

                }catch(e){
                    if(!num || num < 2){
                        setTimeout(function(){
                            autoSign(num+1);
                        },2000);
                    }
                    return;
                }
                console.log(s.a);
                x.getHTML(s.k , function(res) {
                    if(res.indexOf(s.b)>0){
                        console.log(s.c);
                        saveDate();
                        a.outerHTML = s.h;
                    }else if(res.indexOf(s.d)>0){
                        console.log(s.f);
                        saveDate();
                        a.outerHTML = s.h;
                    }else{
                        console.log(s.g);
                    }

                });
            }
        }
    }
    autoSign(0);
})();