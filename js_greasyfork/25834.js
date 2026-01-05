// ==UserScript==
// @name               Sangfor BBS Auto Login
// @name:zh-CN         深信服论坛自动登录
// @namespace          daizp
// @version            0.6.0
// @description        深信服论坛自动登录，使用前请设置账号密码
// @author             daizp
// @include            http://bbs.sangfor.com.cn/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/25834/Sangfor%20BBS%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/25834/Sangfor%20BBS%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var username = "username";
    var password = "password";

    //判断账号密码是否为默认
    if(username == "username" || password == "password"){
        return false;
    }

    //判断当前页面
    switch(location.pathname){
        case "/plugin.php":
            switch(getQueryString("id")){
                case "common_plug:raffle":
                    //签到页
                    signPage();
                    break;
                default:
                    //首页
                    mainPage();
                    break;
            }
            break;
        case "/member.php":
            switch(getQueryString("mod")){
                case "logging":
                    //首页
                    autoFillIn();
                    break;
            }
            break;
    }

    function mainPage(){
        //寻找用户登录信息
        if(document.getElementsByClassName("col-xs-4")[0]){
            if(document.getElementsByClassName("col-xs-4")[0].getElementsByClassName("username")[0]){
                //已登录
                autoSign();
            }else{
                //未登录
                //判断是否已经自动登录
                if(getQueryString("alreadyLogin") == "yes"){
                    //已自动登录
                    alert("登录失败");
                    window.location = "member.php?mod=logging&action=login";
                }else{
                    //未自动登录
                    autoLogin();
                }
            }
        }
    }

    function autoLogin(){
        //生成表单
        var tempForm = document.createElement("form");
        tempForm.id = "tempForm";
        tempForm.method = "post";
        tempForm.target = "tempFrame";
        tempForm.action = "member.php?mod=logging&action=login&loginsubmit=yes&handlekey=post&loginhash=LdQ3k&inajax=1";
        //来源页输入框
        var tempInput1 = document.createElement("input");
        tempInput1.type = "hidden";
        tempInput1.name = "referer";
        tempInput1.value = "http://bbs.sangfor.com.cn/plugin.php?id=info:index";
        tempForm.appendChild(tempInput1);
        //用户名输入框
        var tempInput2 = document.createElement("input");
        tempInput2.type = "hidden";
        tempInput2.name = "username";
        tempInput2.value = username;
        tempForm.appendChild(tempInput2);
        //密码输入框
        var tempInput3 = document.createElement("input");
        tempInput3.type = "hidden";
        tempInput3.name = "password";
        tempInput3.value = password;
        tempForm.appendChild(tempInput3);
        //结果iframe
        var tempFrame = document.createElement("iframe");
        tempFrame.name = "tempFrame";
        tempFrame.id = "tempFrame";
        tempFrame.onload = reloadMainPage;
        //添加frame到页面
        document.body.appendChild(tempFrame);
        //登录事件
        tempForm.submit();
    }

    function reloadMainPage(){
        //转到首页并防止连续自动登录
        window.location = "plugin.php?id=info:index&alreadyLogin=yes";
    }

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) return unescape(r[2]);
        return null;
    }

    function autoSign(){
        if(document.getElementsByClassName("btn sign-btn")[0].getElementsByClassName("sign-info has_sign")[0]){
            //已签到
        }else{
            //未签到
            //设置cookie
            var signhash = document.getElementsByClassName("btn sign-btn")[0].getElementsByTagName("input")[0].value;
            //生成表单
            var tempForm = document.createElement("form");
            tempForm.id = "tempForm";
            tempForm.method = "post";
            tempForm.target = "tempFrame";
            tempForm.action = "plugin.php?id=sign:index&op=sign";
            //来源页输入框
            var tempInput1 = document.createElement("input");
            tempInput1.type = "hidden";
            tempInput1.name = "hash";
            tempInput1.value = signhash;
            tempForm.appendChild(tempInput1);
            //用户名输入框
            var tempInput2 = document.createElement("input");
            tempInput2.type = "hidden";
            tempInput2.name = "ajaxdata";
            tempInput2.value = "json";
            tempForm.appendChild(tempInput2);
            //结果iframe
            var tempFrame = document.createElement("iframe");
            tempFrame.name = "tempFrame";
            tempFrame.id = "tempFrame";
            //添加frame到页面
            document.body.appendChild(tempFrame);
            //登录事件
            tempForm.submit();
            //2秒后跳转到签到页
            setTimeout(toSignPage,2000);
        }
    }

    function toSignPage(){
        //跳转到签到页，准备抽奖
        //window.location = 'plugin.php?id=sign:index';//0.5.2版本方法
        window.location = 'plugin.php?id=common_plug:raffle';
    }

    function signPage(){
        var times = document.getElementsByClassName("raffle-wrap")[0].getElementsByClassName("text-center text-white")[0].getElementsByClassName("text-warning-light")[2].innerHTML;
        if(times == "1次"){
            //抽奖
            document.getElementsByClassName("raffle-con-btn")[0].click();
        }
    }

    /*
    * 0.5.2版本方法
    function signPage(){
        if(document.getElementsByClassName("orange-btn start ng-scope")[0]){
            //未抽奖
            //结果iframe
            var tempFrame = document.createElement("iframe");
            tempFrame.name = "tempFrame";
            tempFrame.id = "tempFrame";
            //添加frame到页面
            document.body.appendChild(tempFrame);
            //frame发送开始抽奖请求
            document.getElementById("tempFrame").src = "plugin.php?id=sign:index&op=times&_"+(new Date()).valueOf();
            //1秒后停止抽奖
            setTimeout(stopLottery,1000);
        }
    }

    function stopLottery(){
        //发送停止抽奖请求
        document.getElementById("tempFrame").src = "plugin.php?id=sign:index&op=stop&_="+(new Date()).valueOf();
        //主页面跳转到抽奖页
        window.location = "plugin.php?id=sign:index";
    }*/

    function autoFillIn(){
        var secretStr = document.getElementsByClassName("member-box-inner")[0].getElementsByTagName("div")[0].id.substr(-5);
        document.getElementById("username_" + secretStr).value = username;
        document.getElementById("password3_" + secretStr).value = password;
    }
})();