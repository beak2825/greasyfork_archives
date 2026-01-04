// ==UserScript==
// @author       不清蒸的野鸽
// @name         维基百科中文不转换
// @version      1.00
// @description  语言栏显示“不转换”
// @match        *://zh.wikipedia.org/*
// @icon        data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2218%22 height=%2218%22 viewBox=%220 0 24 24%22%3E %3Cpath fill=%22%2372777d%22 d=%22M13 19l.8-3h5.3l.9 3h2.2L18 6h-3l-4.2 13H13zm3.5-11l2 6h-4l2-6zM5 4l.938 1.906H1V8h1.594C3.194 9.8 4 11.206 5 12.406c-1.1.7-4.313 1.781-4.313 1.781L2 16s3.487-1.387 4.688-2.188c1 .7 2.319 1.188 3.719 1.688l.594-2c-1-.3-1.988-.688-2.688-1.188 1.1-1.1 1.9-2.506 2.5-4.406h2.188l.5-2H7.938L7 4H5zm-.188 4h3.781c-.4 1.3-.906 2-1.906 3-1.1-1-1.475-1.7-1.875-3z%22/%3E %3C/svg%3E
// @namespace https://greasyfork.org/users/234292
// @downloadURL https://update.greasyfork.org/scripts/375816/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E4%B8%AD%E6%96%87%E4%B8%8D%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/375816/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E4%B8%AD%E6%96%87%E4%B8%8D%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==


function showMe(){
    var text = "ca-varlang-0";
    var target = document.getElementById(text);
    if (target.style.display==""){
        target.style.display = "block";
    };
};

(function () {
    'use strict';  
  	setTimeout(function(){showMe();}, 1);   
})();