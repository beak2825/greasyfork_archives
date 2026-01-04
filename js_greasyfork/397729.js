// ==UserScript==
// @name        bjmu partner
// @description bjmu score list get
// @namespace   abh
// @author      abh
// @icon        https://static.zhihu.com/static/favicon.ico
// @version     1.02
// @match       http://apps.bjmu.edu.cn/jwapp/sys/zywcjd/*
// @grant       none
// @inject-into context
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/397729/bjmu%20partner.user.js
// @updateURL https://update.greasyfork.org/scripts/397729/bjmu%20partner.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var age;
    age = prompt("输入你的学号，确定后如果网页加载5s内完成则5s后生效:","");
    var cnmb = age.toString();

setTimeout(function(){
    alert("现在生效");
  var cnm=document.getElementById("row0zywcjd-index-table").cells[1].innerHTML;
    cnm=cnm.replace(/1[0-9]10[0-9][0-9][0-9][0-9][0-9][0-9]/g,cnmb);
    document.getElementById("row0zywcjd-index-table").cells[1].innerHTML=cnm;

} ,5000)

})();
