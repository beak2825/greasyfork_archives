// ==UserScript==
// @name         乾杉-视频学习
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  假币在线学习脚本，由吴大师编写,请先安装Tampermonkey(油猴插件)
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @require     https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// @author       吴大师(wxj)
// @match        http://www.shqszx.com/*
// @downloadURL https://update.greasyfork.org/scripts/468480/%E4%B9%BE%E6%9D%89-%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/468480/%E4%B9%BE%E6%9D%89-%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var t_time=0;
    //dlayout-item slide-type-bag_relative
    //s-vbench-type-image s-vbench-key-image1
    if (window.location.href=="://www.shqszx.com/imageset.html"){
        $('.s-vbench-type-image.s-vbench-key-image1')[0].click();
    }
    setTimeout(function(){
        if ($('.dlayout-item.slide-type-bag_relative').length>0){
            setInterval(function(){
                // do whatever you want to do
                var str1=$('.dlayout-item.slide-type-bag_relative');//[0].outerText
                //console.log($('.s-vbench-type-image.s-vbench-key-image1').length);
                for (var i = 0; i < str1.length; i++) {
                    if (str1[i].outerText.indexOf("未学")>0){
                        //console.log(str1[i].outerText);
                        //$.cookie('oldstr', window.location.href, { path:'/',domain:'shqszx.com'});
                        $('.s-vbench-type-image.s-vbench-key-image1')[i].click();
                        break;
                    }
                }
                //console.log(2424242424,$('a').length);
                var str2=$('a');
                if (i>=str1.length){
                    for (var i1 = 0; i1 < str2.length; i1++) {
                        //console.log(str2[i1].outerText);
                        if (str2[i1].outerText.indexOf("下一页")>=0){
                            //console.log(333333333,str2[i1].outerText);
                            str2[i1].click();
                            console.log(2424242424,"跳转");
                            break;
                        }
                    }}
            }, 3000);
        }
    },1000)
    setTimeout(function(){
        if ($("video").length>0){
            var div1 = $("video")[0];
            t_time=div1.duration;
            console.log(div1.duration);
            $("video")[0].play();
            //window.history.go(-1);
            setTimeout(function(){
                //window.history.go(-1);
                self.location=document.referrer;
            },t_time*1000);
        }
    },3000)
})();