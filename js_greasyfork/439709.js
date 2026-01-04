// ==UserScript==
// @name         pf自动跳转
// @namespace    http://pp.net/
// @version      0.1
// @description  world!
// @author       Derek.Ss
// @match        https://www.paperfree.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439709/pf%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/439709/pf%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Your code here...
var url2 = window.location.href;
    if(url2=="https://www.paperfree.cn/"){

    var dlzh = prompt("请输入登录帐号：").replace(/\s+/g,"");
    var dlmm = prompt("请输入登录密码：").replace(/\s+/g,"");
      if(dlmm==""){
       dlmm="dafa321";
       }

    }

          var url1 = window.location.href;
    if(url1=="https://www.paperfree.cn/user/transferBalance.html"){
        var czzh = prompt("请输入充值帐号：").replace(/\s+/g,"");
        var czzs = prompt("请输入充值金额：").replace(/\s+/g,"");

    }

$(document).ready(function() {
$('body').prepend('<input type="button" value="充值" id="button1" style="height: 200px;width: 490px;font-size: 100px;float: right;">');
$('body').prepend('<input type="button" value="登录" id="button" style="height: 200px;width: 490px;font-size: 100px;float: left;">');


$("#button").on("click", function(){
  Object.keys(values).forEach(function(key){$("#" + key).val(values[key]);document.getElementById("pfloginBtn").click()});

     // window.location.href="https://www.paperfree.cn/user/transferBalance.html"

})
      var url = window.location.href;
    if(url=="https://www.paperfree.cn/paper/submit.html?from=login"){
    setTimeout(test, 2000);
    }



$("#button1").on("click", function(){
  Object.keys(values1).forEach(function(key){$("#" + key).val(values1[key]);});
var x = document.getElementsByTagName("button");
x[0].click();
     // window.location.href="https://www.paperfree.cn/user/transferBalance.html"

})




});
var values = {
   userName:dlzh,
   password: dlmm,
};

var values1 = {
   toUserName:czzh,
   transferAmount: czzs*1000,
};


function test() {
    //alert("test");
     window.location.href="https://www.paperfree.cn/user/transferBalance.html";
}

















})();