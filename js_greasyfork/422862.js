// ==UserScript==
// @name         高亮
// @namespace    https://github.com/HaoNShi/Tampermonkey_Scripts
// @version      0309
// @icon         https://www.baidu.com/favicon.ico
// @description  11111
// @author       sundaolin
// @match        *://mediastd.video.qq.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422862/%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/422862/%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

var dom = {};
dom.query = jQuery.noConflict(true);
dom.query(document).ready(function ($) {
    'use strict';
  var a = document.getElementsByClassName("el-form-item__label");
  function checkItemExisted(){
    return a.length > 0;
  }
  function timerFunc(){
    setTimeout(function(){
      if(!checkItemExisted()){
        timerFunc();
      }else{
        console.log(a.length,'11111111')
        //a[0].style.backgroundColor='#FF0000'
        for(var i=0;i<a.length;i++){
          a[i].style.backgroundColor='#FF0000'
          a[i].style.color='#FFFFFF'
        }
      }
    },1000);
}
timerFunc();
});