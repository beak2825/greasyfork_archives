// ==UserScript==
// @name         Eink-NGAAuto
// @namespace    https://greasyfork.org/users/169007
// @version      1.0.2
// @description  Automatically click next button when page reaches bottom
// @author       ZZYSonny
// @match        https://bbs.nga.cn/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/436810/Eink-NGAAuto.user.js
// @updateURL https://update.greasyfork.org/scripts/436810/Eink-NGAAuto.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var lastHeight = 0;
    document.addEventListener('scroll', function(event){
        if(document.documentElement.scrollHeight>lastHeight)
            if(document.documentElement.scrollHeight - window.pageYOffset - window.innerHeight < 0.5 * window.innerHeight){
                var btn = document.querySelector('[title="加载下一页"]');
                if (btn!=null) btn.click();
                lastHeight=document.documentElement.scrollHeight;
            }
    });
})();