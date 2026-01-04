// ==UserScript==
// @name         乾杉--基础知识
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  由吴大师编写,请先安装Tampermonkey(油猴插件)
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @require     https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// @author       吴大师(wxj)
// @match        http://www.shqszx.com/*
// @downloadURL https://update.greasyfork.org/scripts/468812/%E4%B9%BE%E6%9D%89--%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/468812/%E4%B9%BE%E6%9D%89--%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var t_time=0;
    //http://www.shqszx.com/app-afstudy/sign.html
    if (window.location.href=="http://www.shqszx.com/app-afstudy/sign.html"){
        $.cookie('jichu', '0', { path:'/',domain:'shqszx.com'});
    }
    //dlayout-item slide-type-bag_relative
    //s-vbench-type-image s-vbench-key-image1
    if (window.location.href=="http://www.shqszx.com/app-afstudy/indarticle.html"){
        setTimeout(function(){
            var xiangmu=$.cookie('jichu');
            console.log(123123123132132,xiangmu);
            if (xiangmu==null || xiangmu>2){
                $.cookie('jichu', '0', { path:'/',domain:'shqszx.com'});
                xiangmu=0;
            }
            console.log(8888989898989,xiangmu);
            $('.s-vbench-type-image.s-vbench-key-image1')[parseInt(xiangmu)].click();
        },3000)
    }
    //app-afstudy/listarticle.html?
    if (window.location.href.indexOf("article.html?")>0){
        console.log(2424242424242424,"开始扫描！");
        setTimeout(function(){
            if ($('section[data-key=bag3]').length>0){
                setInterval(function(){
                    // do whatever you want to do
                    var str1=$('section[data-key=bag3]');//[0].outerText
                    //console.log($('.s-vbench-type-image.s-vbench-key-image1').length);
                    for (var i = 0; i < str1.length; i++) {
                        if (str1[i].outerText.indexOf("未学")>0){
                            console.log(str1[i].outerText);
                            //$.cookie('oldstr', window.location.href, { path:'/',domain:'shqszx.com'});
                            $('.s-vbench-type-text.s-vbench-key-text1')[i].click();
                            break;
                        }
                    }
                    //console.log(2424242424,$('a').length);
                    var str2=$('a');
                    if (i>=str1.length){
                        for (var i1 = 0; i1 < str2.length; i1++) {
                            //console.log(str2[i1].outerText);
                            if (str2[i1].outerText.indexOf("下一页")>=0){
                                //console.log(333333333,str2[i1].parent);
                                if ($('.disabled[data-action=next-page]').length>0){
                                    var xiangmu2=parseInt($.cookie('jichu'));
                                    xiangmu2=xiangmu2+1;
                                    $.cookie('jichu', xiangmu2.toString(), { path:'/',domain:'shqszx.com'});
                                    //self.location=document.referrer;
                                    $(window).attr('location','http://www.shqszx.com/app-afstudy/indarticle.html');
                                }
                                else
                                {
                                    str2[i1].click();
                                    console.log(2424242424,"跳转");
                                }
                                break;
                            }
                        }}
                }, 3000);
            }
        },3000)
        setTimeout(function(){//s-vbench-type-text s-vbench-key-text3
            if ($('.s-vbench-type-text.s-vbench-key-text3:contains("上一篇：")').length>0){
                console.log(2424242424,"开始倒计时3分钟");
                console.log(2424242424,$.cookie('jichu'));
                setTimeout(function(){//三分钟后返回并刷新
                    //window.history.go(-1);
                    self.location=document.referrer;
                },180000);
            }
        },3000)
    }
})();