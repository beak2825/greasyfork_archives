// ==UserScript==
// @name         Docin Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  豆丁网清理页面广告及无关信息
// @author       Zzn
// @match        https://www.docin.com/*
// @match        https://jz.docin.com/*
// @icon         https://www.docin.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440856/Docin%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/440856/Docin%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //from here
    window.onload = function(){
        var el0;
        // el0 = document.getElementById("floderbtn")//默认将侧边推荐折叠
        // if(el0 != undefined && el0 != null)
        //     el0.click();

        el0 = document.getElementById("top_right_ad")//header广告
        if(el0 != undefined && el0 != null)
            el0.remove();
        el0 = document.getElementById("docinShareSlider")//侧边分享
        if(el0 != undefined && el0 != null)
            el0.remove();
        el0 = document.getElementsByClassName('head_wrapper');//header
        if(el0.length != 0) el0[0].remove();
        el0 = document.getElementsByClassName('sider_guanggao');//侧边广告
        if(el0.length != 0) el0[0].remove();
        el0 = document.getElementsByClassName('docin_shasdff23re_sns ');//header分享
        if(el0.length != 0) el0[0].remove();
        el0 = document.getElementsByClassName('docin_share_sns ');//header分享
        if(el0.length != 0) el0[0].remove();
        el0 = document.getElementsByClassName('backToTop');
        if(el0.length != 0) el0[0].remove();
        el0 = document.getElementById("jControlDiv")//末尾广告
        if(el0 != undefined && el0 != null)
            el0.remove();

        //每页的小广告
        var i = 1;
        var mini_ads;
        do{
            mini_ads = document.getElementById("ad"+(i++))
        }while((mini_ads != undefined || mini_ads != null)?(mini_ads.remove() || true):false);

        //末尾处猜你喜欢
        var j_recomm_flag = true;
        document.addEventListener("DOMNodeInserted",function(e) {
            if(j_recomm_flag && e.target.id != undefined && e.target.id == "j_recomm"){
                console.log("remove j_recomm",e.target);
                el0 = document.getElementById("j_recomm")
                empty(el0);
                j_recomm_flag = false;
            }
        });


        //jz.docin
        el0 = document.getElementById("docin-global-nav")//header
        if(el0 != undefined && el0 != null)
            el0.remove();
        el0 = document.getElementById("showPrice")//价格优惠
        if(el0 != undefined && el0 != null)
            el0.remove();
        el0 = document.getElementsByClassName('doc_fun_wrap');//下载收藏打印分享
        if(el0.length != 0) el0[0].remove();
        el0 = document.getElementsByClassName('addMember tools_btns');//加入会员
        if(el0.length != 0) el0[0].remove();
        el0 = document.getElementsByClassName('share_new_style');//结尾处分享
        if(el0.length != 0) el0[0].remove();


    };

    function empty (e) {
        while (e.firstChild) {
            e.removeChild (e.firstChild);
        }
    }

    // $(document).ready(function(){
    //     $(".head_wrapper").remove();//header
    //     $("#container").remove();//head ads
    //     $("#docinShareSlider").remove();//share
    //     $(".sider_guanggao").remove();//aside ads
    //     $(".sider_gg").remove();//aside ads
    //     $(".backToTop").remove();//aside ads

    //     var i = 1;
    //     var mini_ads;
    //     do{
    //         mini_ads = document.getElementById(i++)
    //     }while(mini_ads != undefined || mini_ads != null);

    //     //$("#ocinShareSlider").remove();//share
    // })
    //end here

})();
