// ==UserScript==
// @name shimo.io
// @namespace Violentmonkey Scripts
// @match https://shimo.im/docs/*
// @match https://shimo.im/dashboard/updated
// @grant none
// @version 0.2.2
// @description 1. 切换左右屏幕的时候左侧的内容导航会遮盖内容，此脚本增加一个button，点击button来开启和关闭这个内容导航 2. 自动关闭首次打开的升级付费弹出页面
// @downloadURL https://update.greasyfork.org/scripts/380666/shimoio.user.js
// @updateURL https://update.greasyfork.org/scripts/380666/shimoio.meta.js
// ==/UserScript==

(function () {
  "use strict";
  
function main(){
  dashboard_ad_close();
  if (location.href.split("/")[3] == "docs") { 
    docs_add_togo();
  }
}
  
function dashboard_ad_close(){
  setTimeout(function(){
    // https://shimo.im/dashboard/updated

  var dashboard_node = document.querySelector('.sm-modal-close');
  if (dashboard_node) {
    dashboard_node.click();
  }

  }, 500)
}
  
 function docs_add_togo(){
   
    setTimeout(function () {
    // https://shimo.im/docs/*
    // 给内容导航栏加上一个id
    document.querySelector(".ql-table-of-content").setAttribute("id", "_hidden");

    function hidden() {
      // 根据导航栏当前状态决定是显或隐藏
      var el = document.querySelector("#_hidden");
      if (el.style.display === 'none') {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    }
    // 创建一个开关元素添加到 编辑栏
    var node = document.createElement("span");
    node.setAttribute("id", "_togo");
    node.setAttribute("class", "ql-formats");
    node.innerHTML = "<button type='button'>Togo<button>";
    node.onclick = hidden;
    var parent_node = document.querySelector(".ql-toolbar-default")
    parent_node.insertBefore(node, parent_node.firstElementChild);

    //
  }, 2000);
 }
main(); 
})();