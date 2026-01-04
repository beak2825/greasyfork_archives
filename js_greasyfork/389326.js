// ==UserScript==
// @name         数据库查询
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://superset.changingedu.com/superset/sqllab
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389326/%E6%95%B0%E6%8D%AE%E5%BA%93%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/389326/%E6%95%B0%E6%8D%AE%E5%BA%93%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
   var $ = window.jQuery;
   var ace = window.ace;
   function googleIt() {
       var selectedFile = document.getElementById('files').files[0];
       var reader = new FileReader();
       if (selectedFile != null ){
           console.log("文件名:"+selectedFile.name+"大小:"+selectedFile.size);
           reader.readAsText(selectedFile);
       } else {
          alert("未选择文件");
           return;
       }
       reader.onload = function () {
           ace.edit('brace-editor').setValue(this.result);
       }

   }
    function searchNext() {
        ace.edit('brace-editor').find( $("#searchTxt").val())
    }
   $('#js-sql-toolbar>.pull-left').after('<button class="btn btn-sm btn-primary" style="margin-left: 10px"><input id="files" type="file"/></button> <button type="button" id="google" class="btn btn-sm btn-primary" style="margin-left: 10px"><i class="fa fa-refresh" > </i> 刷新文本</button> <input style="margin-left: 10px" type="text" id="searchTxt"/><button id="searchNext" style="margin-left: 10px" class="btn btn-sm btn-primary">查找</button>');
   $("#google").click(function() {
       googleIt();
   });
   $("#searchNext").click(function() {
       searchNext();
   });
})();