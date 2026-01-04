// ==UserScript==
// @name        浏览器爬虫油猴脚本
// @namespace   https://greasyfork.org/users/14059
// @description 用浏览器进行爬虫的脚本.自己在var urlList定义爬虫地址列表,然后手动绕过验证码,运行菜单:运行爬虫脚本
// @include     https://wikiwiki.jp/vbl/*
// @author      setycyas
// @version     0.01
// @grant       GM_registerMenuCommand
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/380002/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%88%AC%E8%99%AB%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/380002/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%88%AC%E8%99%AB%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function(){
  /* 脚本正式开始 */

  'use strict';
  console.log("浏览器爬虫脚本运行开始!");

  /****************************************
  ######## version 2019-03-13 ###########
  ######## 脚本正式开始 ###################
  ****************************************/

  /* Global Variable */
  // 新建的div与文本框
  var dialogDiv = document.createElement('div');
  var dialogText = document.createElement('textarea');
  
  // 自定义爬虫地址数组
  var urlList = [
    'https://wikiwiki.jp/vbl/%E5%9F%BA%E7%A4%8E%E7%9F%A5%E8%AD%98',
    'https://wikiwiki.jp/vbl/%E5%91%A8%E5%9B%9E%E8%BF%BD%E5%8A%A0%E8%A6%81%E7%B4%A0'
  ];
  
  // 用于记录所有爬取内容的数组
  var contentList = [];

  /* Functions */
  // 添加文本框层
  function addDiv(){
    dialogDiv.id = "dialogDiv";
    dialogDiv.style = "margin-left:100px;width:600px;height:480px;z-index:1003;padding:5px;border:1px solid #9191ff;";
    dialogText.id = "id:dialogText";
    dialogText.style = "width:550px;height:430px;";
    dialogText.value = "";
    dialogDiv.appendChild(dialogText);
    document.body.appendChild(dialogDiv);
    console.log("addDiv()完成");
  }
  
  // 读取urlList的地址,把内容加入到contentList,如果urlList未空,则继续执行自己,否则显示结果
  function getNextUrl(){
    if (urlList.length > 0){
      var url = urlList.pop();
      console.log('现在读取url: '+url);
      var xmlHttpRequest = new XMLHttpRequest();
      xmlHttpRequest.onreadystatechange = function(){
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200){
          contentList.push(xmlHttpRequest.responseText);
          console.log('读取完成,已记录读取结果!');
          getNextUrl();
        }
      };
      xmlHttpRequest.open('GET',url);
      xmlHttpRequest.send();
    }else{
      console.log('所有url读取完毕!显示结果!');
      var msg = contentList.join('\n====================\n');
      dialogText.value = msg;
    }
  }
  
  // 主函数
  function main(){
    addDiv();
    getNextUrl();
  }
  
  /* Main Script */
  GM_registerMenuCommand('运行爬虫脚本',main);

/* 脚本结束 */
})();
