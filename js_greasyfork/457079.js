// ==UserScript==
// @name         四川开放大学招生管理平台自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  四川开放大学招生管理平台自动输入账号自动登录
// @author       You
// @match        http://zs.zh.scrtvu.net/auth/login.do?service=http%3A%2F%2Fzs.zh.scrtvu.net%2Fddzs%2Findex.do
// @match        http://zs.zh.scrtvu.net/ddzs/index.do
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/457079/%E5%9B%9B%E5%B7%9D%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E6%8B%9B%E7%94%9F%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/457079/%E5%9B%9B%E5%B7%9D%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E6%8B%9B%E7%94%9F%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
     //固定账号密码
    var humin;
    humin= {u:"",p:""};
     //var yangmin = {u:,p:};
     var allmg ;
     //allmg = {u:,p:};
     var jq = jQuery.noConflict();//改变jq对象$为原始jq
     var user = jq("input[id='username']");//获取用户名

    if(user&&user.val()=="用户名"){
     var pwd = jq("input[id='password']");//获取密码
     var rember = jq("input[id='accautologin']");//获取记住账号状态

    //选择以哪个账号登陆
   // var htmls = "<input type='submit' class='humin'>"+humin['u']+"</input>"
    //jq(".formbox").append(htmls);
         var htmls = "<div >准备登录计时：<p class='time'>0</p><div/>"
         jq(".formbox").append(htmls);
         if(humin){
             user.prop("value",humin['u']);
             pwd.prop("value",humin['p']);
         }else{
             user.prop("value",allmg['u']);
             pwd.prop("value",allmg['p']);
         }

         var myDate = new Date();//获取当前系统时间对象1
         var tm = myDate.getSeconds();//获取当前系统时间1
         var ms = myDate.getTime();//获取当前时间(从1970.1.1开始的毫秒数)

         var year= myDate.getYear();//获取当前年份(2位)
         year = myDate.getFullYear();//获取完整的年份(4位,1970-????)
         var month =myDate.getMonth();//获取月份
         var day = myDate.getDate();//获取天
         var hour = myDate.getHours();//获取当前小时数(0-23)
         var min = myDate.getMinutes();//获取当前分钟数(0-59)
         var s = myDate.getSeconds();//获取当前秒数(0-59)

         var fulltime = year +"-"+month+"-"+day+"-"+hour+"-"+min+"-"+s;

         var html = "<div style='color:red;float:right;'>当前系统时间：<p class='fulltime'>0</p><div/>"
         jq(".logo1").append(html);

         var waitTime = setInterval(function(){
             myDate = new Date();
             year = myDate.getFullYear();//获取完整的年份(4位,1970-????)
             month =myDate.getMonth();//获取月份
             day = myDate.getDate();//获取天
             hour = myDate.getHours();//获取当前小时数(0-23)
             min = myDate.getMinutes();//获取当前分钟数(0-59)
             s = myDate.getSeconds();//获取当前秒数(0-59)
             fulltime = year +"-"+month+"-"+day+"-"+hour+"-"+min+"-"+s;

                myDate = new Date();//获取当前系统时间毫秒级
                var wait = parseInt((myDate.getTime() - ms)/1000);//获取经过时长：秒
                jq(".time").text(wait +"s");
                jq(".fulltime").text(fulltime);
                console.log(wait);

                if(wait&&wait==3){//计时器
                    console.log("准备停止计时！");
                    jq(".w-button").click();
                    clearInterval(waitTime);
                }
         },1000);
    }else{//注入js
    var js = '<script type="text/javascript">setTimeout(function(){$(".k-button-icontext").trigger("click"); },3000);</script>'
    var js2 = "<script type='text/javascript'>setTimeout(function(){console.log($('li.k-item').eq(1).click()); },3000);</script>";
    jq('body').append(js);
    jq('body').append(js2);}
})();