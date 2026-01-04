// ==UserScript==
// @name              新客服系统_Menu+
// @namespace         iuya
// @icon              https://cdn.jsdelivr.net/gh/iuyaa/NewCs@master/NewCs/NewCsLogo.ico
// @icon64            https://cdn.jsdelivr.net/gh/iuyaa/NewCs@master/NewCs/NewCsLogo.ico
// @version           1.2.0
// @author            iuya
// @description       在新客服系统的菜单iframe中添加“我的导出”“工作小结”菜单。
// @match             http://10.238.1.245/cs/workbench/page/menu.html
// @match             http://10.188.34.1/cs/workbench/page/menu.html
// @downloadURL https://update.greasyfork.org/scripts/425536/%E6%96%B0%E5%AE%A2%E6%9C%8D%E7%B3%BB%E7%BB%9F_Menu%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/425536/%E6%96%B0%E5%AE%A2%E6%9C%8D%E7%B3%BB%E7%BB%9F_Menu%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if($("span#9904030600").text() != " 工作小结"){
      var li = document.createElement('li');
        var el = document.getElementById("9904030200").parentElement.parentElement;
        el.appendChild(li);
        li.innerHTML = '<span style="color:#fff;cursor: pointer;" id="9904030600" title="工作小结" lang="/cs/ccc/portal/web/statistics/page/statisticsmanage.html" isnewwin="0" onclick="addTab(\'9904030600\',\'工作小结\',\'/cs/ccc/portal/web/statistics/page/statisticsmanage.html\')"> 工作小结</span>';
        li.style = "float: left;margin-right: 10px;width:120px;";
        li.class = "item_all"
    }
    if($("span#9904020400").text() != " 我的导出"){
        var li = document.createElement('li');
        var el = document.getElementById("9904030200").parentElement.parentElement;
        el.appendChild(li);
        li.innerHTML = '<span style="color:#fff;cursor: pointer;" id="9904020400" title="我的导出" lang="/cs/gcc/web/system/media/page/media-manger.html" isnewwin="0" onclick="addTab(\'9904020400\',\'我的导出\',\'/cs/gcc/web/system/media/page/media-manger.html\')"> 我的导出</span>';
        li.style = "float: left;margin-right: 10px;width:120px;";
        li.class = "item_all"
    }
})();
