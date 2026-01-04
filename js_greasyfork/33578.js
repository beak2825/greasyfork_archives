// ==UserScript==
// @name         掘金文章自动展开全文
// @namespace    https://github.com/qumuase
// @version      0.0.1
// @description  非登录情况下自动展开全文
// @author       qumuase
// @match        https://juejin.im/post/*
// @supportURL   https://github.com/qumuase/juejin-expand-the-full-text
// @downloadURL https://update.greasyfork.org/scripts/33578/%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/33578/%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    function showContent() {
        // 半秒钟后执行
        setTimeout(function(){
            // 移除显示全文及半遮罩按钮
            document.querySelector(".show-full").remove();
            document.querySelector(".show-full-block").remove();
            // 取消限制文章高度
            document.querySelector(".post-content-container").style.maxHeight = "100%";
        },500);
    }
    showContent();
})();