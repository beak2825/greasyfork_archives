// ==UserScript==
// @name         吾爱破解去除table中的悬赏数据
// @namespace    http://www.xarr.cn/
// @version      0.3.2
// @description  吾爱破解论坛 最新列表中 去掉悬赏数据
// @author       xarr
// @match        *www.52pojie.cn/forum.php?mod=guide&view=newthread*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402793/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E5%8E%BB%E9%99%A4table%E4%B8%AD%E7%9A%84%E6%82%AC%E8%B5%8F%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/402793/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E5%8E%BB%E9%99%A4table%E4%B8%AD%E7%9A%84%E6%82%AC%E8%B5%8F%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelectorAll('#threadlist .bm_c table tbody tr .icn a').forEach(item=>{
        var title = item.getAttribute("title");
        if(title == '悬赏 - 新窗口打开'){
            item.parentNode.parentNode.parentNode.remove();
        }
    });
})();