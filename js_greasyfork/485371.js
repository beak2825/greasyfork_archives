// ==UserScript==
// @name         小叽资源 邀请码批量测试提交工具
// @namespace    http://tampermonkey.net/
// @version      2024-01-21
// @description  用于官网发布的大量邀请码,免去一个个试邀请码注册工作.
// @author       Hill_Man
// @match        https://steamzg.com/9197/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamzg.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485371/%E5%B0%8F%E5%8F%BD%E8%B5%84%E6%BA%90%20%E9%82%80%E8%AF%B7%E7%A0%81%E6%89%B9%E9%87%8F%E6%B5%8B%E8%AF%95%E6%8F%90%E4%BA%A4%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/485371/%E5%B0%8F%E5%8F%BD%E8%B5%84%E6%BA%90%20%E9%82%80%E8%AF%B7%E7%A0%81%E6%89%B9%E9%87%8F%E6%B5%8B%E8%AF%95%E6%8F%90%E4%BA%A4%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("Hill_Man");
    $ = jQuery;
    $('body').append(`<button id='hill_man' style='display:none;position: fixed;right:10px;bottom:80px; box-shadow: 0px 0px 20px 5px #f00;z-index: 99999999;'>辅助填邀请码</button>
    <div id='hill_man_box' style='display:none;position: fixed;    bottom: 80px;    right: 80px;    background: #eee;    padding: 10px;    box-shadow: 0px 0px 20px 5px #f00;    border-radius: 4px;    z-index: 99999999; width:150px'>
         <textarea id='hill_yqm' style='width:100%;height: 200px;'></textarea>
         <div class='hill_msg'></div>
         <button id='hill_ok'>开始</button>
    <div>`);
    var hill_man_show = false;
    var okey,Interval,hill_yqmA;

    $('.inn-nav-tool__container').click(function(){
        $('#hill_man').show();
        $('#hill_yqm').val($('.su-spoiler-content.su-u-clearfix.su-u-trim').text().trim());
        if($('#hill_yqm').val()){
            $('.hill_msg').text('已识别到邀请码,请填写完注册信息后点击【开始】');
        }else{
             $('.hill_msg').text('没有识别到邀请码,请手动填写邀请码和完注册信息后点击【开始】');
        }
    });
    $('#hill_man').click(function(){
        if(hill_man_show){
            $('#hill_man_box').hide();
            hill_man_show = false;
        }else{
            $('#hill_man_box').show();
            hill_man_show = true;
        }
    });

     $('#hill_ok').click(function(){
         if(okey){
             // 关闭
             okey = false;
             clearInterval(Interval);
              $('.hill_msg').text('已终止！');
              $('#hill_ok').text('开始');
             return true;
         }

         // 开始
         $('.hill_msg').text('已开始，请稍后！');
         $('#hill_ok').text('终止');
         okey = true;
         hill_yqmA= $('#hill_yqm').val().split("\n");
        console.log(hill_yqmA)
        if($('input[name="inviCode"]').length == 0){
            alert('请先打开注册页面,填写注册相关信息.');
            return false;
        }

         function run(){
             var yqm = hill_yqmA.shift();
             if(!yqm){
                 alert('验证码全部试完!');
                 clearInterval(Interval);
                 $('.hill_msg').text('已终止！');
                 $('#hill_ok').text('开始');
                 return true;
             }
             $('input[name="inviCode"]').val(yqm);
             $('button[type="submit"]').click();
         }
         run();

         Interval = setInterval(function(){
             if($('.poi-alert__msg').text()=='抱歉，该邀请码已过期。'){
                 run();
             }
         },200);

    });
})();