// ==UserScript==
// @name         刷题必备
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  限制能打开的网页
// @author       https://github.com/ChaunceyBai98
// @match        *
// @icon         data:image/png;base64,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
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464457/%E5%88%B7%E9%A2%98%E5%BF%85%E5%A4%87.user.js
// @updateURL https://update.greasyfork.org/scripts/464457/%E5%88%B7%E9%A2%98%E5%BF%85%E5%A4%87.meta.js
// ==/UserScript==
(function() {
  'use strict';
  var whitelist = ['leetcode','mail','google','extension','usc','jianshu','csdn','BV11Z4y157RY','BV1tp4y1i7rL','video','python','java'];
  var blacklist = ['tieba.baidu','nga','popular','yhdmp','uhaozu','bilibili','youtube','1point3acres'];
    //,'nga','popular','yhdmp','uhaozu'
  var quanPiPeiBlackList = ['https://www.bilibili.com/','https://www.bilibili.com/?spm_id_from=333.788.0.0']
  var currentURL = window.location.href;
  var counter = 0;
  var flag = true;
  for (let i = 0; i < blacklist.length; i++) {
    if(currentURL.includes(blacklist[i])){
      //false 不能看
      flag = false;
      break;
    }
  }
  for (let i = 0; i < whitelist.length; i++) {
    if(currentURL.includes(whitelist[i])){
      //true 能看
      flag = true;
      break;
    }
  }
  // for (let i = 0; i < quanPiPeiBlackList.length; i++) {
  //   if(currentURL == quanPiPeiBlackList[i]){
  //     //true 能看
  //     flag = false;
  //     break;
  //   }
  // }
  if(!flag){
    document.head.innerHTML = '<meta charset="UTF-8">'+
      '<link href="https://g.csdnimg.cn/static/logo/favicon32.ico" rel="shortcut icon" type="image/x-icon">'+
      '<meta content="">'+
      '<title>劝学</title>';
    document.body.innerHTML = '<div align="center">'+
      '</br>'+
      '</br>'+
      '</br>'+
      '</br>'+
      '</br>'+
      '</br>'+
      '<h1 style="color: #FF0000;">不要摄取过多杂乱无章的信息</h1>'+
      '</div>'
    ;
  }
// Your code here...
})();
