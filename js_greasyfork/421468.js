// ==UserScript==
// @name         FBI编辑页面
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
// @downloadURL https://update.greasyfork.org/scripts/421468/FBI%E7%BC%96%E8%BE%91%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/421468/FBI%E7%BC%96%E8%BE%91%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

function getQueryString(name) {
          var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
          var r = window.location.search.substr(1).match(reg);

          if (r != null) {
             return unescape(r[2]);
          }
          return null;
 }

var id = 'https://fbi.alibaba-inc.com/fbi/design/' + getQueryString("id") + '/edit.htm';

console.log(id);
//window.alert(id);


//debugger;
(function() {
    'use strict';
    var bt = document.createElement("a"); //创建一个a对象
    bt.style.cssText = "margin-left:20px;border:2px; border-style:dashed; border-color:red;font-size:14px;";
    bt.href = id;
    bt.target = "_blank"
    bt.innerText = "编辑报表"
    var x = document.getElementById("wrapper");
    //var x = document.querySelector(".root-title");
    x.appendChild(bt);
})();


