// ==UserScript==
// @name         例：SWPU西南石油大学 校园网自动认证登录
// @namespace    http://4532.none
// @version      1
// @description  当浏览器处于认证界面，自动进行校园网认证自动登录
// @author       4532
// @match        http://172.16.245.50/*
// @match        https://172.16.245.50/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466018/%E4%BE%8B%EF%BC%9ASWPU%E8%A5%BF%E5%8D%97%E7%9F%B3%E6%B2%B9%E5%A4%A7%E5%AD%A6%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E8%AE%A4%E8%AF%81%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/466018/%E4%BE%8B%EF%BC%9ASWPU%E8%A5%BF%E5%8D%97%E7%9F%B3%E6%B2%B9%E5%A4%A7%E5%AD%A6%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E8%AE%A4%E8%AF%81%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    //这里在双引号中填写账户（学号）                示例：var studentID = "202213131313" 
var studentID = "你的学号";
    //这里填写你的密码                              示例：var password  = "sssssssss" 
var password  = "你的密码";       
	//填写数字！！！    1电信 2学生 3教师 4移动无线 5移动有线    移动有线推荐使用拨号器 示例：var Logintype =   0       
var Logintype = 1;              
 
  //搭配计划任务，实现当电脑连接到SWPU-EDU或者CMCC-EDU时自动打开浏览器认证界面自动连接 请按照脚本页面说明下载配置
  //计划任务参数详见脚本详情页面
 
    window.addEventListener('load', function() {
        //获取各组件元素
      var IDIPT = document.getElementById("username");
      var PSIPT = document.getElementById("password");
      var CSIPT = document.getElementById("domain");
      var LGBTN = document.getElementById("login");
       //填入数据，并点击按钮
        if (IDIPT&&PSIPT&&CSIPT && CSIPT.options.length > 1&&LGBTN) {
            IDIPT.value = studentID;
            PSIPT.value = password;
            CSIPT.selectedIndex = Logintype;
            LGBTN.click();
        }
    });
})();