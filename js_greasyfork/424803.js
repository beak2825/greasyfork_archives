// ==UserScript==
// @name              新客服系统_工单查询_导出
// @namespace         iuya
// @icon              https://cdn.jsdelivr.net/gh/iuyaa/NewCs@master/NewCs/NewCsLogo.ico
// @icon64            https://cdn.jsdelivr.net/gh/iuyaa/NewCs@master/NewCs/NewCsLogo.ico
// @version           1.7.0
// @author            iuya
// @description       显示工单查询中的导出按钮。
// @match             http://10.238.1.245/cs/*/sheet/es/page/sheetquery-es-datagrid.html
// @match             http://10.238.1.245/cs/*/sheet/es/page/sheetquery-es-datagrid.html
// @downloadURL https://update.greasyfork.org/scripts/424803/%E6%96%B0%E5%AE%A2%E6%9C%8D%E7%B3%BB%E7%BB%9F_%E5%B7%A5%E5%8D%95%E6%9F%A5%E8%AF%A2_%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/424803/%E6%96%B0%E5%AE%A2%E6%9C%8D%E7%B3%BB%E7%BB%9F_%E5%B7%A5%E5%8D%95%E6%9F%A5%E8%AF%A2_%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var $$ = function(func){  
            if (document.addEventListener) {  
                window.addEventListener("load", func, false);  
            }  
            else if (document.attachEvent) {  
                window.attachEvent("onload", func);  
            }  
        }  
          
        $$(function(){  
           //需要执行的内容 
             document.getElementById('exportId').style = "padding-left: 3px; "

        }) 

})();
