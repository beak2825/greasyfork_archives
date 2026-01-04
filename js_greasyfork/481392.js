// ==UserScript==
// @name         公用OA及网络自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于广州市公用事业技师学院OA自动登录及上网自动登录
// @author       KK
// @match        https://smart.gzgyjx.com/login
// @match        http://192.168.99.1:30004/byod/view/byod/template/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481392/%E5%85%AC%E7%94%A8OA%E5%8F%8A%E7%BD%91%E7%BB%9C%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/481392/%E5%85%AC%E7%94%A8OA%E5%8F%8A%E7%BD%91%E7%BB%9C%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //OA系统帐号及密码
    var oaname="你的oa用户名";
    var oapassword="你的oa密码";
    //上网帐号及密码
    var netname="你的上网账号";
    var netpassword="你的上网密码";

    if(location.hostname.toString().startsWith('smart')){
        //OA
        $('[dsid="userName"]').val(oaname);
        $('[dsid="password"]').val(oapassword);
        $('[dsid="btn_submit"]').click();
    }else{
        //上网
        console.log(window.location.href);
        document.querySelector('#id_userName').value=netname;
        document.querySelector('#id_userPwd').value=netpassword;
        if(document.querySelector('#id_lable_loginbutton_auth')!=null){
            $('#id_lable_loginbutton_auth').click();
            console.log(document.querySelector('#id_lable_loginbutton_auth'));
            console.log('登录。。。');
            var newURL="https://www.baidu.com";
            //window.location=newURL;
            window.location.replace(newURL);
        }else{
            console.log('哎呀，元素是空的呀');
        }
    }
})();