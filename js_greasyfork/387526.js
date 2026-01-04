// ==UserScript==
// @name         百度测试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387526/%E7%99%BE%E5%BA%A6%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/387526/%E7%99%BE%E5%BA%A6%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loginFlg = sessionStorage.getItem('test')
    if(!loginFlg){

    var input1 = document.createElement('input')
    var input2 = document.createElement('input')
    input1.value='请输入登录用户名'
    input2.value='请输入登录密码'
    document.getElementById('form').append(input1)
    document.getElementById('form').append(input2)

    var input = document.createElement('input')
    input.value='用户登录'
    input.className="bg s_btn"
    input.type='button'
    document.getElementById('form').append(input)

    input.addEventListener('click',function(){

        input1.value='请重新刷新页面'
        input2.value=''
        input.value='登录成功'
        sessionStorage.setItem('test',true)
    })
    return;
}else{
    console.log("已经登录")
}

    // Your code here...
    if(window.location.host =="www.baidu.com"&&window.location.pathname=="/"){

       console.log("进入百度，开始填充数据")
       document.getElementById("kw").value='这是自动填充的信息'
       document.getElementById('form').submit()
   }

})();