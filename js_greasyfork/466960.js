// ==UserScript==
// @name         领歌列表清爽
// @namespace    https://github.com/pcy190/TamperMonkeyScript
// @version      1.0
// @description  删除不重要的元素
// @author       lnwazg
// @match        https://www.leangoo.com/kanban/board_list*
// @grant        none
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/466960/%E9%A2%86%E6%AD%8C%E5%88%97%E8%A1%A8%E6%B8%85%E7%88%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/466960/%E9%A2%86%E6%AD%8C%E5%88%97%E8%A1%A8%E6%B8%85%E7%88%BD.meta.js
// ==/UserScript==

window.onload = function(){
    setTimeout(function(){
      //隐藏脑图功能
        document.querySelector("#myMindmap").style.display="none";
    },600);
}

