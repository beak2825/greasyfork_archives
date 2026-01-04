// ==UserScript==
// @name        3gmfw（聚焦搜索栏+回车监听）
// @namespace   cowvirgina
// @match       *://*.3gmfw.cn/*
// @grant       none
// @version     1.0
// @author      cowvirgina
// @license     MIT
// @description 3/27/2023, 4:37:53 PM
// @downloadURL https://update.greasyfork.org/scripts/464806/3gmfw%EF%BC%88%E8%81%9A%E7%84%A6%E6%90%9C%E7%B4%A2%E6%A0%8F%2B%E5%9B%9E%E8%BD%A6%E7%9B%91%E5%90%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/464806/3gmfw%EF%BC%88%E8%81%9A%E7%84%A6%E6%90%9C%E7%B4%A2%E6%A0%8F%2B%E5%9B%9E%E8%BD%A6%E7%9B%91%E5%90%AC%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $("#link").focus();
    $("body > div > div > div > div:nth-child(1) > div > div > div > p:nth-child(2) > button").attr("id","idscb");

    $("#link").bind("keyup",function(event){
      if (event.keyCode == "13") {
        $("#idscb").click();
      }
    });

})();