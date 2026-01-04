// ==UserScript==
// @name downlist
// @namespace Violentmonkey Scripts
// @description 不能为空字符对生意参谋的搜索排行及搜索分析栏列表数据简单导出功能
// @match *://*/*
// @grant none
// @version 0.0.1.20191225061507
// @downloadURL https://update.greasyfork.org/scripts/390206/downlist.user.js
// @updateURL https://update.greasyfork.org/scripts/390206/downlist.meta.js
// ==/UserScript==
// 
// 
// 
(function() {
function deleteheerdownDiv(){
	var my = document.getElementById("divCell");
	if (my != null)
	my.parentNode.removeChild(my);
}

function heerdown(){
  //搜索排行
  if(document.getElementById("itemRank")){
    if(document.getElementsByTagName("tbody")){
      document.getElementsByTagName("tbody")[0].setAttribute('id','heertest');
      //循环
      GetInfoFromTable('heertest');
      //导出
      tableToExcel2('heertest')
    }
    return;
  }
  //搜索分析
  if(document.getElementById("relatedWord")){
    if(document.getElementsByTagName("tbody")){
      document.getElementsByTagName("tbody")[0].setAttribute('id','heertest');
        //method5('heertest')     
      tableToExcel2('heertest')
    }
    return;
  }
  
}
function GetInfoFromTable(tableid) {
    var tableInfo = "";
    var tableObj = document.getElementById(tableid);
    for (var i = 0; i < tableObj.rows.length; i++) {    //遍历Table的所有Row
      tableObj.rows[i].cells[0].lastChild.innerText = tableObj.rows[i].cells[0].lastChild.title;
    }
}

function addNewStyle(newStyle) {
     var styleElement = document.getElementById('styles_js');
 
      if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.type = 'text/css';
          styleElement.id = 'styles_js';
          document.getElementsByTagName('head')[0].appendChild(styleElement);
      }

      styleElement.appendChild(document.createTextNode(newStyle));
  }
 
var tableToExcel2 = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->'+
    ' <style type="text/css">'+
    '.excelTable  {'+
    'border-collapse:collapse;'+
    ' border:thin solid #999; '+
    '}'+
    '   .excelTable  th {'+
    '   border: thin solid #999;'+
    '  padding:20px;'+
    '  text-align: center;'+
    '  border-top: thin solid #999;'+
    ' '+
    '  }'+
    ' .excelTable  td{'+
    ' border:thin solid #999;'+
    '  padding:2px 5px;'+
    
    ' }</style>'+'</head><body><table border="1" class="excelTable">{table}</table></body></html>'
        , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
    return function(table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML};
        var downloadLink = document.createElement("a");
        downloadLink.href = uri + base64(format(template, ctx));
        downloadLink.download = "table.xls";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
})()

window.onload= function (){
  deleteheerdownDiv()
  var newdiv = document.createElement("div"); 
  newdiv.style.position="fixed";
  newdiv.style.bottom= '50px';
  newdiv.style.right= '20px';
  newdiv.style.width='80px';
  newdiv.style.height='40px';
  newdiv.style.zIndex=99999;
  newdiv.style.backgroundColor="#ffffcc";
  newdiv.style.filter = "alpha(opacity=50)";
  newdiv.id = "divCell";
  newdiv.onclick = heerdown;
  document.getElementById("app").appendChild(newdiv);
  addNewStyle(".ant-table-row>td:first-child {max-width: 400px;white-space:normal;overflow: visible;}");
}
})();