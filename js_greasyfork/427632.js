// ==UserScript==
// @name         董神的低语
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在bing界面唤醒董神！
// @author       You
// @match        https://cn.bing.com/*
// @icon         https://www.google.com/s2/favicons?domain=bing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427632/%E8%91%A3%E7%A5%9E%E7%9A%84%E4%BD%8E%E8%AF%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/427632/%E8%91%A3%E7%A5%9E%E7%9A%84%E4%BD%8E%E8%AF%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var num=0
    var num_time=0
    var cookie_code
    function setCookie(cname,cvalue,exdays){
        var cookie_all=cname
        for(var i=0;i<20;i++){
            cookie_all=cookie_all+"1"
        }
        exdays=-1
        cookie_all=cname+"="+cvalue+"; "+exdays
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cookie_all;
        num=num+1
    }
    //————————————————————————————————调取cookie
    function getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0){
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }
    function delCookie(name){
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = name + "=a; expires=" + date.toGMTString();
    }
    document.onkeydown = function(event){
        var cookie_code
        var keycode=event.keyCode
        if(num==0){
            cookie_code=keycode
            setCookie("keycode",cookie_code,-1)
        }
        else{
            cookie_code=getCookie("keycode")+keycode
            setCookie("keycode",cookie_code,-1)
        }
        var ans=getCookie("keycode").match("68797871907273876978")
        if(ans!=null&&num_time==0){
            //           window.open("http://bing.com")
            alert("是谁唤醒了董神？")
            /*
            for(var o=0;o<4;o++){
            alert("是谁唤醒了董神？")
            }
            */
            num=0
            num_time++
            delCookie("keycode")
        }
        else if(ans!=null&&num_time==1){
            //           window.open("http://bing.com")
            alert("难不成你想来几套数学卷子？")
            num=0
            num_time++
            delCookie("keycode")
        }
        else if(ans!=null&&num_time==2){
            //           window.open("http://bing.com")
            alert("哇屮哇，别TM叫爷了！！！")
            num=0
            num_time++
            delCookie("keycode")
        }
        else if(ans!=null&&num_time>=3&&num_time<6){
            //           window.open("http://bing.com")
            alert("。。。。。。。。。")
            num=0
            num_time++
            delCookie("keycode")
        }
        else if(ans!=null&&num_time==6){
            alert("我发誓如果你在叫一次，绝对有你好看。。。")
            num=0
            num_time++
            delCookie("keycode")
        }
        else if(ans!=null&&num_time==7){
            delCookie("keycode")
            num=0
            num_time++
            for(var o=0;o<30;o++){
            alert("")
            }
        }
        else if(ans!=null&&num_time==8){
            alert("你是怎么做到的！？")
            num=0
            num_time++
            delCookie("keycode")
        }
        else if(ans!=null&&num_time>=9){
            alert("。。。。。。。。。")
            num=0
            num_time++
            delCookie("keycode")
        }
    }
})();