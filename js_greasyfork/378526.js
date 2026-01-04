// ==UserScript==
// @name SZUxk_Login
// @namespace Violentmonkey Scripts
// @match http://210.39.12.30/xsxkapp/sys/xsxkapp/*default/index.do
// @grant none
// @description SZU选课系统自动登陆
// @version  1.0.2
// @downloadURL https://update.greasyfork.org/scripts/378526/SZUxk_Login.user.js
// @updateURL https://update.greasyfork.org/scripts/378526/SZUxk_Login.meta.js
// ==/UserScript==


document.querySelector('input[id]').value="账号";//此处修改为自己的账号
//发现廖神有更好的写法：$('#loginPwd').val("password")
document.querySelector('input[id="loginPwd"]').value="密码";//此处修改为自己的密码
var vcode = document.querySelector('input[id="verifyCode"]');
var token;
var imgurl = "http://210.39.12.30/xsxkapp/sys/xsxkapp/student/vcode/image.do?vtoke=";
var url = "http://210.39.12.30/xsxkapp/sys/xsxkapp/student/4/vcode.do"
$.get(url,{},function(data2){
  vcode.value=(data2.data.vode);
  token = data2.data.token;
  console.log(token)
  sessionStorage.setItem('vtoken', token);
  imgurl = imgurl+(token); $("img#vcodeImg").attr("src",imgurl);
  $('#studentLoginBtn').click();
})  
//如果不想登陆后直接进入选课界面，可将下面的代码注释掉
setTimeout( function(){
  $('#courseBtn').click();
}, 1000);
