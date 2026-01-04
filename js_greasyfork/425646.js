// ==UserScript==
// @name         苏州教师培训网
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  避免弹窗，每10分钟刷新一次。
// @author       TeacherA
// @match        http://sztt.suzhou.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425646/%E8%8B%8F%E5%B7%9E%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/425646/%E8%8B%8F%E5%B7%9E%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tishiBar = document.getElementById("hidSecond").parentNode;
    var tishiSecond = document.getElementById("hidSecond");
    var pjscript = document.createElement("script");
    var scriptText = document.createTextNode(
   'var confirm=function(){return 1};\n'+
   'setInterval(function(){location.reload()},600000);'
    )
    pjscript.appendChild(scriptText);
    tishiBar.appendChild(pjscript);
    var childText = document.createTextNode("成功");
    tishiBar.appendChild(childText);

})();