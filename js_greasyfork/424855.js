// ==UserScript==
// @name              新客服系统_工作小结
// @namespace         iuya
// @icon              https://cdn.jsdelivr.net/gh/iuyaa/NewCs@master/NewCs/NewCsLogo.ico
// @icon64            https://cdn.jsdelivr.net/gh/iuyaa/NewCs@master/NewCs/NewCsLogo.ico

// @version           1.6.0
// @author            iuya
// @description       为新客服系统添加工作小结元素。
// @match             http://10.238.1.245/cs/workbench/page/menu.html
// @match             http://10.188.34.1/cs/workbench/page/menu.html
// @downloadURL https://update.greasyfork.org/scripts/424855/%E6%96%B0%E5%AE%A2%E6%9C%8D%E7%B3%BB%E7%BB%9F_%E5%B7%A5%E4%BD%9C%E5%B0%8F%E7%BB%93.user.js
// @updateURL https://update.greasyfork.org/scripts/424855/%E6%96%B0%E5%AE%A2%E6%9C%8D%E7%B3%BB%E7%BB%9F_%E5%B7%A5%E4%BD%9C%E5%B0%8F%E7%BB%93.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var $$ = function (func) {
        if (document.addEventListener) {
            window.addEventListener("load", func, false);
        } else if (document.attachEvent) {
            window.attachEvent("onload", func);
        }
    }

    $$(function () {
        //需要执行的内容 
        var li = document.createElement('li');
        var el = document.getElementById("9904030200").parentElement.parentElement;
        el.appendChild(li);
        li.innerHTML = '<span style="color:#fff;cursor: pointer;" id="9904030600" title="工作小结" lang="/cs/ccc/portal/web/statistics/page/statisticsmanage.html" isnewwin="0" onclick="addTab(\'9904030600\',\'工作小结\',\'/cs/ccc/portal/web/statistics/page/statisticsmanage.html\')"> 工作小结</span>';
        li.style = "float: left;margin-right: 10px;width:120px;";
        li.class = "item_all"
    })

})();
