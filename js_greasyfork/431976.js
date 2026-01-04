
// ==UserScript==
// @name         表格下载工具
// @version      0.0.3
// @description  功能介绍：1、下载网页中出现的表格到本地
// @author       SvenJiA
// @match      *://zh.wikipedia.org/*
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.17.1/dist/xlsx.min.js
// @license      MIT
// @antifeature  referral-link 此提示为GreasyFork代码规范要求含有查券功能的脚本必须添加，实际使用无任何强制跳转，代码可查，请知悉。
// @namespace https://greasyfork.org/users/812577
// @downloadURL https://update.greasyfork.org/scripts/431976/%E8%A1%A8%E6%A0%BC%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/431976/%E8%A1%A8%E6%A0%BC%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

window.onload = function(){
  var btn  = document.createElement('button');
  btn.id = 'download_excel';
  btn.innerHTML = '下载表格'
  appendStyle();
  document.body.appendChild(btn);
    var dowloadBtn = document.getElementById('download_excel')
    dowloadBtn.onclick = function(){
      var tables = document.getElementsByTagName("table");
      var wb = XLSX.utils.book_new();
      for(var i = 0; i < tables.length; ++i) {
        var ws = XLSX.utils.table_to_sheet(tables[i]);
        XLSX.utils.book_append_sheet(wb, ws, "Table" + i);
      }
      XLSX.writeFile(wb, "excel.xlsx");
    }
}

function appendStyle(){
  var style = document.createElement("style");
  style.type = "text/css";
　　style.appendChild(document.createTextNode(`#download_excel {
  position:fixed;
  right:50px;
  bottom:50px;
  background-color: #f22;
  outline: none;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: #fff;
  z-index:999999999;
}
#download_excel:hover{
  cursor: pointer;
  color: #ff2;
  background-color: #F00;
}`));



var head = document.getElementsByTagName("head")[0];

head.appendChild(style);
}
