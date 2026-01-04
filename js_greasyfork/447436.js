// ==UserScript==
// @name         SEO群发脚本
// @namespace    https://vkk.im/
// @version      1.2
// @description  做SEO外链的辅助脚本
// @author       Mr.Du
// @match        *://*/*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @grant        unsafeWindow
// @license Apache License 2.0
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_setClipboard
// @grant GM_getClipboard
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/447436/SEO%E7%BE%A4%E5%8F%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/447436/SEO%E7%BE%A4%E5%8F%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

'use strict';
var $ = $ || window.$;


// 控制页面滚动到指定位置
function scrollPosition(pElementId) {
    var tTop = jQuery(pElementId).offset().top;  //得到控件Top
    var tWindowHeight = jQuery(window).height(); //浏览器可视窗口高度
    var tElementHeight = jQuery(pElementId).height(); //控件高度
    var tScrollTop = tTop-tWindowHeight*0.3-tElementHeight*0.5; //让控件中心位于可视窗口3分之1处
    jQuery('html, body').animate({  
            scrollTop: tScrollTop
    }, 1000);  
}


// 获取长度为len的随机字符串
function _getRandomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

//随机密码
function passwords(pasLen) {
	var pasArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];
	var password = '';
	var pasArrLen = pasArr.length;
	for (var i=0; i<pasLen; i++){
		var x = Math.floor(Math.random()*pasArrLen);
		password += pasArr[x];
	}
	console.log(password);
  return password;
}


function gotoMyProfile(){
  var googleusername="brittanthyxzae";
  var nowdomain = window.location.host;
  var url = "http://" + nowdomain + "/profile/" + googleusername + "/profile";
  window.location.href = url;
}

function submitKrWeb(){
  var gmail = "brittanthyxzae@gmail.com";
  var content = 'curve plus,curve plus size clothing,curve plus size,curve plus dresses,curve plus clothing\n\
https://veeink.com/\n\
https://maps.google.com/url?q=https://veeink.com/product-category/women/\n\
https://maps.google.com/url?q=https://veeink.com/product-category/curveplus/\n\
https://maps.google.com/url?q=https://veeink.com/product-category/kids/\n\
https://maps.google.com/url?q=https://veeink.com/product-category/men/\n\
https://maps.google.com/url?q=https://veeink.com/product-category/beauty/\n\
https://maps.google.com/url?q=https://veeink.com/product-category/home/\n';  
//   情况一
  if($("input[name='wr_name']").length >0){
    scrollPosition("input[name='wr_name']");
    $("input[name='wr_name']").click();
    $("input[name='wr_name']").val(_getRandomString(6));
    $("input[name='wr_password']").click();
    $("input[name='wr_password']").val(passwords(8));
    $("textarea[name='wr_content']").click();
    $("textarea[name='wr_content']").val(content);
    $("#captcha_key").focus();
    $("#captcha_key").click(); 
  }else if($("input[name='author']").length >0){
    // 情况二
    scrollPosition("textarea[id='comment']");
    $("input[name='author']").click();
    $("input[name='author']").val(_getRandomString(6));
    $("input[name='email']").click();
    $("input[name='email']").val(passwords(8)+"@gmail.com");
    $("input[name='url']").click();
    $("input[name='url']").val("https://veeink.com");
    $("textarea[id='comment']").click();
    $("textarea[id='comment']").val(content);
  }else{
    alert("这个网站找不到输入信息的地方,有可能是我还没有发现又或者这个网站不合适使用这个程序,\n请自己手动将网页拉到最下面检查看一下有没有输入信息地方,如果有请手工填写一下并将网站地址发给我.");
  }
}


$(function(){
  window.onkeydown = function (event) {
    if(event.altKey && event.keyCode === 49){
      gotoMyProfile();
    }
    if(event.altKey && event.keyCode === 50){
      submitKrWeb();
    }
  }
  
  console.clear();
  console.log("SEO群发脚本启动");
})