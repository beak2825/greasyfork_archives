// ==UserScript==
// @name         fucking NJFU WIFI
// @namespace    https://zkwzkw.top
// @version      0.7
// @description  fucking NJFU WIFI!!
// @author       kaiwen zhou
// @include      http://*/a70.htm
// @include      http://*/0.htm
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/415292/fucking%20NJFU%20WIFI.user.js
// @updateURL https://update.greasyfork.org/scripts/415292/fucking%20NJFU%20WIFI.meta.js
// ==/UserScript==

// 请在下面下面两行中输入你的wifi账号和密码
var username = ''
var password = ''

var reg_a70 = /a70.htm$/;
var reg_0 = /0.htm$/;
var url = window.location.href

function login(username, password){
    if(reg_a70.test(url)){
        $('.edit_lobo_cell')[1].value = username
        $('.edit_lobo_cell')[2].value = password
        $('.edit_lobo_cell')[0].click()
    }else if(reg_0.test(url)){
        $("input[name=DDDDD]")[0].value = username
        $("input[name=upass]")[0].value = password
        $("input[name=0MKKey]").click()
    }else{
        alert('未能够成功匹配！！')
    }
}

function saveCookie(){
    if(reg_a70.test(url)){
        $('form[name=f3]').submit(function(){
            // 保存cookie
            $.cookie('username', $('.edit_lobo_cell')[1].value, { expires: 99999 });
            $.cookie('password', $('.edit_lobo_cell')[2].value, { expires: 99999 });
        })
    }else if(reg_0.test(url)){
        $("input[name=0MKKey]").click(function(){
            // 保存cookie
            $.cookie('username', $("input[name=DDDDD]")[0].value, { expires: 99999 });
            $.cookie('password', $("input[name=upass]")[0].value, { expires: 99999 });
        })
    }else{
        alert('保存cookie失败！！')
    }
}

(function() {
    'use strict';
    if (username === '' || password === ''){
        if($.cookie('username') === undefined || $.cookie('password') === undefined){
            // 添加cookie
            alert('这是你的第一次登陆，请先手动登陆一下，脚本会自动为你添加cookie, 或者你可以直接在js中设置你的账号与密码')
            saveCookie()
        }else{
            // 使用cookie登录
            login($.cookie('username'), $.cookie('password'))
        }
    }else{
        login(username, password)
    }
})();
