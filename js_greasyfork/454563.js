// ==UserScript==
// @name         飞书开放平台截图辅助工具
// @namespace    https://open.feishu.cn
// @version      0.1.1
// @description  移除可能导致出现 Bad Case 的内容，降低截图的成本。
// @author       bestony
// @match        https://open.feishu.cn/*
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/lark/passport/staticfiles/passport/Open-Platform.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454563/%E9%A3%9E%E4%B9%A6%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E6%88%AA%E5%9B%BE%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/454563/%E9%A3%9E%E4%B9%A6%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E6%88%AA%E5%9B%BE%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


function checkExistAndDelete(obj){
    try{
        if (typeof obj != "undefined" && obj != null) {
            obj.remove();
            return true;
        } else{
            return false;
        }
    } catch(e){
        console.error("remove error",obj,e)
    }
}

(function() {
    'use strict';
    window.addEventListener('load', function() {
        checkExistAndDelete(document.getElementsByClassName('side-bar')[0]);
        checkExistAndDelete(document.getElementById('zendeskmy'));
        document.getElementsByClassName('_pp-header-avatar')[0].innerHTML = "<img src='https://lf1-cdn-tos.bytegoofy.com/goofy/lark/passport/staticfiles/passport/Open-Platform.png'>"
    }, false);
})();