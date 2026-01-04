// ==UserScript==
// @name         Oracle download auto login
// @namespace    http://gv7.me
// @version      0.1.1
// @description  自动登录Oracle官网，方便下载Oracle的各种产品，比如:Java JDK,Weblogic等
// @author       c0ny1
// @match        https://login.oracle.com/mysso/signon.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382627/Oracle%20download%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/382627/Oracle%20download%20auto%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //是否自动点击登录
    var is_auto_login = true;

     //获取随机数
     function random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    }
    //通过标签名，属性名和属性值来定位元素
    function getTargetByTAV(t_tag,t_attr,t_value){
        var target = document.getElementsByTagName(t_tag);
        for(var i=0;i <target.length;i++){
            if(target[i].getAttribute(t_attr) == t_value){
                return target[i];
            }
        }
    }


   //存储账号密码
    var users = new Array(3);
    var passs = new Array(3);
    users[0] = "1772885836@qq.com";
    passs[0] = "OracleTest1234";
    users[1] = "541509124@qq.com";
    passs[1] = "LR4ever.1314";
    users[2] = "2696671285@qq.com";
    passs[2] = "Oracle123";

    var sso_username = document.getElementById("sso_username");
    var sso_password = document.getElementById("ssopassword");
    var i = random(0,users.length);
    sso_username.value = users[i];
    sso_password.value = passs[i];

    if(is_auto_login){
        var btn_login = getTargetByTAV("input","tabindex",3);
        btn_login.click();
    }

})();