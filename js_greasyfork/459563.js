// ==UserScript==
// @name         FBI快速编辑&查看访问统计
// @namespace    ...
// @version      0.0.1-alpha
// @license      GPLv3
// @description  快速进入FBI编辑页面
// @author       @谦望
// @include      *fbi.alibaba-inc.com/*
// @include      *quark.alibaba-inc.com/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/459563/FBI%E5%BF%AB%E9%80%9F%E7%BC%96%E8%BE%91%E6%9F%A5%E7%9C%8B%E8%AE%BF%E9%97%AE%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/459563/FBI%E5%BF%AB%E9%80%9F%E7%BC%96%E8%BE%91%E6%9F%A5%E7%9C%8B%E8%AE%BF%E9%97%AE%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

function getQueryString(name) {
          var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
          var r = window.location.search.substr(1).match(reg);

          if (r != null) {
             return unescape(r[2]);
          }
          return null;
 }

var id_design = 'https://fbi.alibaba-inc.com/fbi/design/' + getQueryString("id") + '/edit.htm';
var id_stat = 'https://fbi.alibaba-inc.com/dashboard/view/page.htm?id=523916&reportid=' + getQueryString("id");
//涉及申请报表权限

//console.log(id);
//window.alert(id);


//debugger;
(function() {
    'use strict';
    var id_design_l = document.createElement("a"); //创建一个a对象
    id_design_l.style.cssText = "margin-left:20px;border:2px; border-style:dashed; border-color:red;font-size:14px;";
    id_design_l.href = id_design;
    id_design_l.target = "_blank"
    id_design_l.innerText = "编辑报表"
    var xa = document.getElementById("wrapper");
    //var x = document.querySelector(".root-title");
    xa.appendChild(id_design_l);

  	var id_stat_l = document.createElement("a"); //创建一个a对象
        id_stat_l.style.cssText = "margin-left:80px;border:2px; border-style:dashed; border-color:red;font-size:14px;";
        id_stat_l.href = id_stat;
        id_stat_l.target = "_blank"
        id_stat_l.innerText = "访问统计"
    var xb = document.getElementById("wrapper");
    //var x = document.querySelector(".root-footer");
    xb.appendChild(id_stat_l);
})();


