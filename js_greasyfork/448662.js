// ==UserScript==
// @name         湖南科技大学校园网自动登录HNUST
// @version      2.3
// @namespace    WYJ
// @author       Arrow
// @match        http://login.hnust.cn/*
// @license MIT
// @description  自动登录校园网http://login.hnust.cn/
// @description  有BUG请反馈QQ395841716
// @description  开机自动打开校园网认证页面:①win+r 输入"shell:startup" ②右键空白处——新建快捷方式③输入"http://login.hnust.cn/"
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/448662/%E6%B9%96%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95HNUST.user.js
// @updateURL https://update.greasyfork.org/scripts/448662/%E6%B9%96%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95HNUST.meta.js
// ==/UserScript==


//本地缓存变量声明
var account_number="LoginAccount";
var password="LoginPassword";
var drop_down="LoginDrop_down";
var net;

//循环点击，页面加载完成后检查为登录成功页面即停止循环
(function() {
    'use strict';
    var Auto=setInterval(function() {
//判断是否为登录成功页面
    if(document.getElementsByName("logout").length==1){
        setTimeout(function stopLoop(){clearInterval(Auto2)},20000);
        clearInterval(Auto);
        var username=document.getElementById("account").innerText;
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
                var Drop_down=GetRadioValue("network");
                localStorage.setItem(account_number,UserNameRead);
                localStorage.setItem(password,btoa(PasswordRead));
                localStorage.setItem(drop_down,Drop_down);
                setTimeout('location.reload(true)', 2000);//延时2s刷新显示初始化按钮
            })
        }
        else{
            document.f1.DDDDD.value=LoginAccount;
            document.f1.upass.value=atob(LoginPassword);
//运营商选择
        if (LoginDropDown=='') {net=6;}
        if (LoginDropDown=='@telecom') {net=7;}
        if (LoginDropDown=='@unicom') {net=8;}
        if (LoginDropDown=='@cmcc') {net=9;}
            document.querySelector("div").getElementsByClassName("edit_lobo_cell")[net].click();

            var Login=document.getElementsByName("0MKKey");//读取登录按钮
            Login[1].click();//点击登录
            setTimeout('location.reload(true)', 2000);//延时2s刷新显示初始化按钮
        }
    }
    },3000);//等待登录页面加载
//判断是否为返回页面
    var Auto2=setInterval(function(){
        if(document.getElementsByName("GobackButton").length==1){
            document.getElementsByName("GobackButton")[0].click();
        }
    },1000);
//读取本地缓存
    const LoginAccount=window.localStorage.getItem(account_number);
    const LoginPassword=window.localStorage.getItem(password);
    const LoginDropDown=window.localStorage.getItem(drop_down);
//读取手动选择的运营商
    function GetRadioValue(RadioName)
    {
    var obj;
    obj=document.getElementsByName(RadioName);
    if(obj!=null){
        var i;
        for(i=0;i<obj.length;i++){
            if(obj[i].checked){
                return obj[i].value;
            }
        }
    }
    return null;
    }

//注销页初始化功能模块
    function init(){
        window.localStorage.removeItem("LoginAccount");
        window.localStorage.removeItem("LoginPassword");
        window.localStorage.removeItem("LoginDropDown");
        alert("初始化成功！")
        location.reload(true)
            }
    function alterWebPage(){
        var btn=document.createElement("INPUT");
        btn.name="mybtn";
        btn.type="button";
        btn.value="初始化";
        //这里的style是直接用的校园网登录按钮的style
        btn.onclick=init;
        btn.style="top: 345px; left: 1200px; width: 200px; height: 34px; color: rgb(255, 255, 255); border-radius: 2px; text-align: center; padding: 6px; position: absolute; font-size: 16px; background-color: rgb(94, 191, 255); right: auto; bottom: auto; border-color: rgb(184, 184, 184);"
        document.body.appendChild(btn);
    }

    window.onload =function(){ //网页完全载入后执行
        alterWebPage();}


})();