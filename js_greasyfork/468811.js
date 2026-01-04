// ==UserScript==
// @name         乾杉--模拟考试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  假币在线学习脚本，由吴大师编写,请先安装Tampermonkey(油猴插件)
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @require     https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// @author       吴大师(wxj)
// @match        http://www.shqszx.com/*
// @downloadURL https://update.greasyfork.org/scripts/468811/%E4%B9%BE%E6%9D%89--%E6%A8%A1%E6%8B%9F%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/468811/%E4%B9%BE%E6%9D%89--%E6%A8%A1%E6%8B%9F%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    var arry1=[];
    var rstringify = JSON.stringify;
    JSON.stringify = function(a){
        if (a.question != null){
            arry1.push({'question':a.question,'answer':a.answer});
        }
        return rstringify(a);
    }
    if (window.location.href=="http://www.shqszx.com/app-afstudy/sign.html"){
        $.cookie('kscs', '0', { path:'/',domain:'shqszx.com'});
    }
    if (window.location.href.indexOf("app-afstudy/self_test.html?")>0){
        $.cookie('ksurl',window.location.href, { path:'/',domain:'shqszx.com'});
        setTimeout(function(){
            var str1=$('.b-exam-tit.b-group-text1.clearfix');
            for (var i = 0; i < str1.length; i++){
                $('.b-items').eq(i).find('input').each(function () {
                    if (arry1[i]['answer'].indexOf($(this).attr("value"))>=0){
                        $(this).click();
                    }
                });
            }
            arry1.splice(0,arry1.length);
            if ($('a:contains(提交答案)').length>0 && parseInt($.cookie('kscs'))<10){
                $('a:contains(提交答案)')[0].click();
                var xiangmu2=parseInt($.cookie('kscs'));
                xiangmu2=xiangmu2+1;
                $.cookie('kscs', xiangmu2.toString(), { path:'/',domain:'shqszx.com'});
            }
        },5000)
    }
    if (window.location.href.indexOf("app-afstudy/exam_detail.html?")>0){
        if (parseInt($.cookie('kscs'))>9){
            alert("考试完毕！");
        }
        else
        {
            $(window).attr('location',$.cookie('ksurl'));
        }
    }
})();