// ==UserScript==
// @name         NGA帖子宽度缩小
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  NGA Post width reduced!
// @author       maypu
// @match        http*://bbs.nga.cn/thread.php*
// @match        http*://bbs.nga.cn/read.php*
// @icon         https://www.google.com/s2/favicons?domain=nga.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430107/NGA%E5%B8%96%E5%AD%90%E5%AE%BD%E5%BA%A6%E7%BC%A9%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/430107/NGA%E5%B8%96%E5%AD%90%E5%AE%BD%E5%BA%A6%E7%BC%A9%E5%B0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let customWidth = 1200;

    //帖子列表
    let threadList = document.getElementById("topicrows");
    if (threadList) {
        threadList.style.width = customWidth + "px";
        threadList.style.marginLeft = "auto";
        threadList.style.marginRight = "auto";
    }

    //帖子详情
    let threadDetail = document.getElementById("m_posts");
    if (threadDetail) {
        threadDetail.style.width = customWidth + "px";
        threadDetail.style.marginLeft = "auto";
        threadDetail.style.marginRight = "auto";
    }

    //页码按钮
    let threadBtntop = document.getElementById("m_pbtntop");
    if (threadBtntop) {
        threadBtntop.style.width = customWidth + "px";
        threadBtntop.style.marginLeft = "auto";
        threadBtntop.style.marginRight = "auto";
    }
    let threadBtnbtm = document.getElementById("m_pbtnbtm");
    if (threadBtnbtm) {
        threadBtnbtm.style.width = customWidth + "px";
        threadBtnbtm.style.marginLeft = "auto";
        threadBtnbtm.style.marginRight = "auto";
    }
})();