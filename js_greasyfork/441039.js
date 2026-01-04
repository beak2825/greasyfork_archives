// ==UserScript==
// @name         目录点击
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  模拟点击目录按钮
// @author       MriJ
// @match        *://www.notion.so/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441039/%E7%9B%AE%E5%BD%95%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/441039/%E7%9B%AE%E5%BD%95%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    document.onkeydown = function(e) {
        var keyCode = e.keyCode;
        var ctrlKey = e.ctrlKey;
        if(ctrlKey && keyCode == 81) {
            var q = document.createEvent("MouseEvents");
            q.initEvent("click", true, true);
            var sidebar = document.getElementById("notionx-sidebar-btn");
            if(sidebar.className.indexOf("hide") > -1){
                document.getElementsByClassName("notionx-hider-btn")[0].dispatchEvent(q);
            }else{
                sidebar.dispatchEvent(q);
            }
        }
    }
})();