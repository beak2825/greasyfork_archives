// ==UserScript==
// @name     新疆交通职业技术学院 取消切屏提示以及新增自动点击播放按钮
// @namespace 新疆交通职业技术学院 取消切屏提示以及新增自动点击播放按钮
// @version  1.2
// @grant    none
// @license  MIT
// @author   muzhihuoying
// @description  新疆交通职业技术学院 专业课职称继续教育学习 取消切屏提示以及新增自动点击播放按钮。 ，------------------- 客户忙或需全自动帮忙 请+：muzhihuoying----------------------
// @match        https://www.qingsuyun.com/*
// @downloadURL https://update.greasyfork.org/scripts/495943/%E6%96%B0%E7%96%86%E4%BA%A4%E9%80%9A%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%20%E5%8F%96%E6%B6%88%E5%88%87%E5%B1%8F%E6%8F%90%E7%A4%BA%E4%BB%A5%E5%8F%8A%E6%96%B0%E5%A2%9E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%92%AD%E6%94%BE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/495943/%E6%96%B0%E7%96%86%E4%BA%A4%E9%80%9A%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%20%E5%8F%96%E6%B6%88%E5%88%87%E5%B1%8F%E6%8F%90%E7%A4%BA%E4%BB%A5%E5%8F%8A%E6%96%B0%E5%A2%9E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%92%AD%E6%94%BE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
  
  var myDivContent = document.getElementsByClassName('el-button button el-button--primary el-button--small');
  var mydiv2=document.getElementsByClassName('prism-play-btn');

  setInterval(function(){
	if(myDivContent.length>0){

    document.getElementById(mydiv2[0].id).click()

  }  }, 1000)

})();