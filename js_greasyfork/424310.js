// ==UserScript==
// @name         统计字数
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  奇了怪了，咋就有问题啊？
// @author       You
// @match        https://www.tampermonkey.net/scripts.php
// @include      http://122.152.215.25:8088/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424310/%E7%BB%9F%E8%AE%A1%E5%AD%97%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/424310/%E7%BB%9F%E8%AE%A1%E5%AD%97%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".classtree-topbar").append($('<a class="calcText" style="'+
    'top: 0px;'+
    'position: absolute;'+
    'background-position: 4px -1000px;'+
    'font-size: 20px;'+
    'text-align: center;'+
    'cursor: pointer;'+
    '">字</a>'));
    $(".calcText").click(function(){
      var l = $("#ueditor_0").contents().find("body.view").text().trim().length || $("#document_body").text().trim().length;
      alert(l);
    });
    // Your code here...
})();