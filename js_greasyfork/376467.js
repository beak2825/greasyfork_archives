

// ==UserScript==
// @name          Hello World_cjn2
// @namespace
// @description   test
// @match      *://jszy.ezhupei.com/pdsci/main/res/*
//@require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version 0.0.1.20190108085849
// @namespace https://greasyfork.org/users/238069
// @downloadURL https://update.greasyfork.org/scripts/376467/Hello%20World_cjn2.user.js
// @updateURL https://update.greasyfork.org/scripts/376467/Hello%20World_cjn2.meta.js
// ==/UserScript==



(function () {
    'use strict';
    var button = document.createElement("input"); //创建一个input对象（提示框按钮）
    button.setAttribute("type", "button");
    button.setAttribute("value", "一键评分");
    button.style.width = "60px";
    button.style.align = "center";
    button.style.marginLeft = "250px";
    button.style.marginBottom = "10px";
    button.style.background = "#b46300";
    button.style.border = "1px solid " + "#b46300";//52
    button.style.color = "white";
    var x = document.getElementById("resRecGradeForm");
    x.appendChild(button);

    alert("Hello World");

})();