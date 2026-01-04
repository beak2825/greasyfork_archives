// ==UserScript==
// @name         微博去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于去微博广告的脚本
// @author       千羽千鹤
// @match        https://weibo.com/u/*
// @grant none
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/408620/%E5%BE%AE%E5%8D%9A%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/408620/%E5%BE%AE%E5%8D%9A%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
    window.guanggao = function (){
    //function guanggao() {
        //这一句是移除微博信息流中的“广告”和“大家正在看”的内容，在代码前用//即可注释使其失效
        $("[feedtype=ad]").remove();
        //这一句是移除热点话题
        $("#v6_pl_rightmod_recominfo").remove();
        //微博电影榜
        $("#v6_pl_rightmod_rank").remove();
        //好友关注的动态
        $("#v6_pl_rightmod_attfeed").remove();
        //会员专区
        $("#v6_trustPagelet_recom_member").remove();
        //公告栏
        $("#v6_pl_rightmod_noticeboard").remove();
    }
    $(function(){
        guanggao();
    })
    $(window).scroll(function(){
        guanggao();
    })
})();