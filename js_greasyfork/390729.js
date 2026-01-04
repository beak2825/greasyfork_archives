
// ==UserScript==
// @name 什么什么安全微伴
// @namespace    ku-m.cn
// @version      0.1
// @description  学习，学个屁！ 2019年10月3日15:39:29可用
// @match *://weiban.mycourse.cn/#/courses/pre/study?type=1
// @match *://mcwk.mycourse.cn/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/390729/%E4%BB%80%E4%B9%88%E4%BB%80%E4%B9%88%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/390729/%E4%BB%80%E4%B9%88%E4%BB%80%E4%B9%88%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4.meta.js
// ==/UserScript==


(function() {
  'use strict';
  var url=document.URL;
  if(url.indexOf("weiban.mycourse.cn/#/courses/pre/study?type=1")!=-1){
    
          setTimeout( function(){   
           //需要手动更改 div:nth-child(10) 的值，从第一个课程列表1-10  依次进行刷
                document.querySelector("#app > div > div.viewport > div.mint-tab-container > div > div:nth-child(1) > div > div:nth-child(10) > ul > li:nth-child(1) > div.listview-main").click();
              }, 1000 );
  
 }else{
     finishWxCourse();
     backToList();
    
  }
})();
