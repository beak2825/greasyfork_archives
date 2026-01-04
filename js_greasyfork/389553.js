// ==UserScript==
// @name         正版中国去除拖拽、右键菜单、F12限制
// @namespace    正版中国去除拖拽、右键菜单、F12限制
// @version      0.2
// @description  拖拽、右键菜单、F12限制
// @author       SYXIXI
// @match        https://getitfree.cn/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389553/%E6%AD%A3%E7%89%88%E4%B8%AD%E5%9B%BD%E5%8E%BB%E9%99%A4%E6%8B%96%E6%8B%BD%E3%80%81%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%E3%80%81F12%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/389553/%E6%AD%A3%E7%89%88%E4%B8%AD%E5%9B%BD%E5%8E%BB%E9%99%A4%E6%8B%96%E6%8B%BD%E3%80%81%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%E3%80%81F12%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    document.oncontextmenu = function(){
        return true;
    }
    document.ondragstart = function() {
        return true;
    };
    document.oncopy = function() {
        return true;
    };
    document.onkeydown = function(e) {
        if (e.ctrlKey &&
            (e.keyCode === 65 ||
             e.keyCode === 67 ||
             e.keyCode === 73 ||
             e.keyCode === 74 ||
             e.keyCode === 80 ||
             e.keyCode === 83 ||
             e.keyCode === 85 ||
             e.keyCode === 86 ||
             e.keyCode === 117
            )) {
            return true;
        }
        if(e.keyCode==18||e.keyCode==123){return true}
    };
})();