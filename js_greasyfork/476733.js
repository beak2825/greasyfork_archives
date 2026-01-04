// ==UserScript==
// @name         南邮校园网自动登录
// @namespace    https://lenjon.top
// @version      2.4
// @description  njupt校园网自动登录脚本
// @author       ZZZ
// @match        *://10.10.244.11/a79.htm*
// @match        *://p.njupt.edu.cn/a79.htm*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/476733/%E5%8D%97%E9%82%AE%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/476733/%E5%8D%97%E9%82%AE%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

function do_login_old(username, password) {
    const accountInput = document.querySelectorAll('input[name=DDDDD]');
    const passwordInput = document.querySelectorAll('input[name=upass]');
    const loginButton = document.querySelectorAll('input[name="0MKKey"]');
    accountInput[1].value = username;
    passwordInput[1].value = password;
    loginButton[1].click();
}

function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    };
    return null;
}
(function() {
    'use strict';
    console.log('insert script => autoLogin');
    const CARRIER = {
        NJUPT: 0,
        CMCC: 1,
        CHINANET: 2
    }

    
    //运营商选择，这三个里面选一个，把开头的两个斜杠去掉，你办的移动就选CMCC，你办的电信就用CHINANET，若使用旧版本可以忽略
   // var carrier = CARRIER.NJUPT; //NJUPT
    //var carrier = CARRIER.CMCC;//NJUPT-CMCC
    var carrier = CARRIER.CHINANET;//NJUPT-CHINANET
    const username = "添加自己的账号";
    const password = "添加自己的密码";
    var flag = 1; //0运行旧版本，1运行新版本

    if (flag === 0) {
        do_login_old();
        return;
    }

    if (username === "" || password === "") {
        alert("请点击Tampermonkey图标打开管理面板修改源码输入用户名和密码");
        return;
    };

    if (username.indexOf("nic") == -1) {
        switch (carrier) {
            case 0:
                carrier = "";
                break;
            case 1:
                carrier = "@cmcc";
                break;
            case 2:
                carrier = "@njxy";
                break;
            default:
                alert("无效运营商");
                return;
        }
    } else {
        carrier = "";
    }

    const pwd = encodeURIComponent(password).toLowerCase();

    const wlanuserip = getQueryString("wlanuserip");
    const wlanacip = getQueryString("wlanacip");
    const wlanacname = getQueryString("wlanacname"); //这个还不知道有没有必要，先留着

    const url = "https://p.njupt.edu.cn/a79.htm" +
        "c=ACSetting&" +
        "a=Login&" +
        "protocol=http:&" +
        "hostname=p.njupt.edu.cn&" +
        "iTermType=1&" +
        "wlanuserip=" + wlanuserip + "&" +
        "wlanacip=" + wlanacip + "&" +
        "wlanacname=" + wlanacname + "&" +
        "mac=00-00-00-00-00-00&" +
        "ip=" + wlanuserip + "&" +
        "enAdvert=0&" +
        "queryACIP=0&" +
        "loginMethod=1";

    const form_data = "DDDDD=%2C0%2C" + username + carrier +
        "&upass=" + pwd +
        "&R1=0&R2=0&R3=0&R6=0&para=00&0MKKey=123456&buttonClicked=&redirect_url=&err_flag=&username=&password=&user=&cmd=&Login=&v6ip=";

    GM_xmlhttpRequest({
        method: "POST",
        url: url,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: form_data,
        onload: function(response) {
            console.log("请求成功");
            let success = "认证成功页";
            let resp = response.responseText;
            let flag = resp.indexOf(success);
            if (flag === -1) {
                do_login_old(username, password);
            } else {
                //alert("登录成功");
                window.location.href = "https://cn.bing.com/"; //避免重复登录导致瞬间三个设备同时登录的状态
            }
        },
        onerror: function(response) {
            do_login_old(username, password);
        }
    });


})();