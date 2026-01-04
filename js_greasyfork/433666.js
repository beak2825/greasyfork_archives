// ==UserScript==
// @name         分派电影直接显示隐藏内容
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动显示隐藏内容
// @author       xyxy
// @match        *//ifenpaidy.com/*
// @include      *//ifenpaidy.com/*
// @icon         https://www.google.com/s2/favicons?domain=ifenpaidy.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433666/%E5%88%86%E6%B4%BE%E7%94%B5%E5%BD%B1%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/433666/%E5%88%86%E6%B4%BE%E7%94%B5%E5%BD%B1%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function showhidden() {
    var x = document.getElementById("body");
    var y = x.getElementsByClassName("hidepost");
    var i;
    for (i = 0; i < y.length; i++) {
      y[i].style.display="block";
    }

})();

(function hideads() {
    const cycle = 10;
    setInterval(function () {
        document.getElementsByClassName("row post-code-container")[0].remove();
        }, cycle);
})();

(function hide11ad() {
    $("body").removeClass("modal-open");
    document.getElementsByClassName("modal-backdrop fade in")[0].remove();
    document.getElementsByClassName("modal-dialog")[0].remove();
})();