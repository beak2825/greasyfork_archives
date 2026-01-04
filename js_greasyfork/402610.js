// ==UserScript==
// @name         互联网堡垒机全自动
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @author       李现琳
// @match        *://10.29.134.34/shterm/*
// @grant        none
// @description try to take over the world!
// @downloadURL https://update.greasyfork.org/scripts/402610/%E4%BA%92%E8%81%94%E7%BD%91%E5%A0%A1%E5%9E%92%E6%9C%BA%E5%85%A8%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/402610/%E4%BA%92%E8%81%94%E7%BD%91%E5%A0%A1%E5%9E%92%E6%9C%BA%E5%85%A8%E8%87%AA%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    
    var webAccount="lixl07";//TODO 替换成你堡垒机网页登录账户  默认是你的OA账户
    var webPwd="abc123456!";//TODO 替换成你堡垒机网页登录密码
    var rdpAccount="administrator";//TODO 替换成你自己用户名  默认是administrator
    var rdpPwd="abc123456!";//TODO 替换成你自己堡垒机的远程桌面密码

    //登录页面自动填充 账户密码
    if(document.getElementById('inputUserName')&&document.getElementById('inputPassword')){
        document.getElementById('inputUserName').value = webAccount;
        document.getElementById('inputPassword').value = webPwd;
        //自动点击登录按钮
        document.getElementById('loginBtn').click();
    }
    // 快捷登录按钮自动填充账户密码
    if($("qz-main")[0]){
        window.onload = setTimeout(initItems,500);
        function initItems(){
            if($(".quick_access")[1]){
                $(".quick_access")[1].addEventListener("click",function(){
                    setTimeout(fillpwd,500);
                });
                //自动点击连接按钮
                 $(".quick_access")[1].click();
            }else{
                setTimeout(initItems,300);
            }
        }
    };
    //自动填充账户密码
    function fillpwd(){
        var accountElement= $("[name='deviceAccessForm'] .device-access-modal .modal-body [name='account']")[0];
        accountElement.value = rdpAccount;
        changeText(accountElement);
        var pwdElement= $("[name='deviceAccessForm'] .device-access-modal .modal-body [name='password']")[0];
        pwdElement.value = rdpPwd;
        changeText(pwdElement);
        //自动点击启动按钮
        $(".device-access-modal .form-horizontal .form-group .col-md-12 button")[0].click();
    };
    //触发文本变更事件
    function changeText(element){
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            element.dispatchEvent(evt);
        }
        else{
            element.fireEvent("onchange");
        }
    };
})();
