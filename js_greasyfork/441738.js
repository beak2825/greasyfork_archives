// ==UserScript==
// @name         TAPD 删除“消息通知”模块
// @namespace    hl_qiu163@163.com
// @version      0.1.2
// @description  用于在 TAPD 内删除“消息通知”模块。TAPD 的消息太多，也无分类，太冗余。
// @author       qiuhongliang
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tapd.cn
// @match        https://www.tapd.cn/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/441738/TAPD%20%E5%88%A0%E9%99%A4%E2%80%9C%E6%B6%88%E6%81%AF%E9%80%9A%E7%9F%A5%E2%80%9D%E6%A8%A1%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/441738/TAPD%20%E5%88%A0%E9%99%A4%E2%80%9C%E6%B6%88%E6%81%AF%E9%80%9A%E7%9F%A5%E2%80%9D%E6%A8%A1%E5%9D%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let top_nav_worktable_msg = document.querySelector("div.left-tree-bottom  div  div.left-tree-bottom__personal--icons");
    if (top_nav_worktable_msg != null) {
        // 直接删除，不需要使用事件监听等操作
        // console.log("直接删除，不需要使用事件监听等操作");
        delete_msg_element();
        return;
    }

    document.querySelector("body > div.left-tree-v2.left-tree-narrow.left-tree--dark.fe-vue-component > div.left-tree-bottom > div > div.left-tree-bottom__personal--icons")

    document.addEventListener('click', delete_msg_element);
    document.addEventListener('mousemove', delete_msg_element);

    function delete_msg_element() {
        let top_nav_worktable_msg = document.querySelector("div.left-tree-bottom  div  div.left-tree-bottom__personal--icons");
        if (top_nav_worktable_msg == null) {
            // console.log("null msg");
            return;
        } else {
            top_nav_worktable_msg.style.display = "none";
            document.removeEventListener("click", delete_msg_element);
            document.removeEventListener('mousemove', delete_msg_element);
            // console.log("delete");
        }
    }
})();