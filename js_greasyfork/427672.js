// ==UserScript==
// @name         广西科技大学校园网自动登录
// @version      0.1.4
// @namespace    天涯之北
// @author       天涯之北
// @match        http://172.16.1.3
// @match        http://172.16.1.3/?isReback=1
// @include      *://172.16.1.3*
// @include      *://172.16.1.11*
// @description  自动登录校园网，减少等待时间。代码指令只是模拟用户输入点击。
// @description  首次使用需要自行进行登录一次,下次自动进行登录
// @note         重点:账号密码保存到本地的localStorage中,以进行加密,且不会进行上传.源码开源可见,如有顾虑自行查看代码.
// @note         重点：登录非默认账号时，需关闭该脚本运行
// @note         V0.1.1,2021/06/06,实现基础功能
// @note         V0.1.3,2021/06/09,改用读取本地缓存方式记住账号密码,清除浏览器数据时可清除账号密码
// @nite         如有BUG请反馈
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427672/%E5%B9%BF%E8%A5%BF%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/427672/%E5%B9%BF%E8%A5%BF%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

//声明变量，本地缓存名称
var account_number="LoginAccount";
var password="LoginPassword";
var drop_down='LoginDrop_down';

//循环点击，页面加载完成后检查为登录成功页面即停止循环
(function() {
    'use strict';
    var Auto=setInterval(function() {
    //判断是否为登录成功页面
    if(document.getElementsByName("logout").length==1){
        setTimeout(function stopLoop(){clearInterval(Auto2)},20000);
        clearInterval(Auto);
        var username=document.getElementById("account").innerText;
        //与默认账号不相同时自动注销登录（解决sometime开机自动登录别人账号的bug）
        if(username!=LoginAccount){
            document.getElementsByName("logout")[0].click();//注销
            if(document.getElementsByClassName("boxy-btn1").length==1){
                document.getElementsByClassName("boxy-btn1")[0].click();//确认
            }
        }
    }
    //网络未连接页面，自动点击“重新加载”
    else if(document.getElementsByClassName("blue-button text-button").length==2){
        document.getElementsByClassName("blue-button text-button")[0].click();
    }
    else{
        //登录页面执行写入和登录动作
        if(!LoginAccount||!LoginPassword){
            clearInterval(Auto);
            clearInterval(Auto2);
            alert("首次登录，请自行登录一次，下次将自动登录");
            document.getElementsByName("0MKKey")[1].addEventListener('click',() =>{
                var UserNameRead=document.querySelector("div").getElementsByClassName("edit_lobo_cell")[1].value;
                var PasswordRead=document.querySelector("div").getElementsByClassName("edit_lobo_cell")[2].value;
                var Drop_down=document.querySelector("div").getElementsByClassName("edit_lobo_cell")[5].value;
                localStorage.setItem(account_number,UserNameRead);
                localStorage.setItem(password,btoa(PasswordRead));
                localStorage.setItem(drop_down,Drop_down);
            })
        }
        else{
            document.f1.DDDDD.value=LoginAccount;
            document.f1.upass.value=atob(LoginPassword);
            document.querySelector("div").getElementsByClassName("edit_lobo_cell")[5].value=LoginDropDown;
            var Login=document.getElementsByName("0MKKey");//读取登录按钮
            Login[1].click();//点击登录
        }
    }
    },200);
    //判断是否为返回页面
    var Auto2=setInterval(function(){
        if(document.getElementsByName("GobackButton").length==1){
            document.getElementsByName("GobackButton")[0].click();
        }
    },1000);
    //读取本地缓存
    const LoginAccount=localStorage.getItem(account_number);
    const LoginPassword=localStorage.getItem(password);
    const LoginDropDown=localStorage.getItem(drop_down);
})();