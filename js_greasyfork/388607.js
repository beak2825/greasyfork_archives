// ==UserScript==
// @name         爱否类别隐藏
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       yx
// @match        http://www.aifou.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388607/%E7%88%B1%E5%90%A6%E7%B1%BB%E5%88%AB%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/388607/%E7%88%B1%E5%90%A6%E7%B1%BB%E5%88%AB%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    //C
    $("img[src='//img002.fview.cn/aifou/Public/Pc/img/level/C.png']").parent().parent().hide();
    //D
    $("img[src='//img002.fview.cn/aifou/Public/Pc/img/level/D.png']").parent().parent().hide();
    // Your code here...
})();