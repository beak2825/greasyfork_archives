// ==UserScript==
// @name         看雪论坛自动签到&屏蔽抽奖
// @namespace    KX_auto_gift
// @version      0.5
// @description  看雪论坛自动签到+屏蔽抽奖
// @author       涛之雨
// @match        *://bbs.pediy.com/*
// @match        *://bbs.kanxue.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @icon         https://bbs.kanxue.com/view/img/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/412723/%E7%9C%8B%E9%9B%AA%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%B1%8F%E8%94%BD%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/412723/%E7%9C%8B%E9%9B%AA%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%B1%8F%E8%94%BD%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const s=GM_getValue("lastSign",0);
    const now=new Date(Date.now()+(new Date().getTimezoneOffset()+8*60)*60*1000).getDate();//东八区日期
    if(now===s)return setTimeout(()=>$(".signin").removeClass('signin sign signin_over').unbind("click").html('<span style="vertical-align: middle;">您已签到</span>'),100);//今天签过到了
    GM_setValue("lastSign",now);
    setTimeout(function(){
        $.xget('user-is_signin.htm', function(code, message) {
            if(code == 1) {//未签到
                $(".signin").unbind("click").html('<span style="vertical-align: middle;">正在签到...</span>');
                $.xpost('user-signin.htm?t='+(new Date()).getTime(), {}, function(code, message) {
                    if(code===-1&&message.match(/Token/g)!==null){
                        $(".signin").removeClass('signin sign signin_over').unbind("click").html('<span style="vertical-align: middle;">登录后自动签到</span>');
                        return;
                    }else{
                        $(".signin").removeClass('signin sign signin_over').unbind("click").html('<span style="vertical-align: middle;">签到获得'+message+'雪币</span>');
                    }
                    return;
                });
            }else{
                $(".signin").removeClass('signin sign signin_over').unbind("click").html('<span style="vertical-align: middle;">您已签到</span>');
            }
        });
    },100);
})();