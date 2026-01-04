// ==UserScript==
// @name         屏蔽知乎视频推荐
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽知乎视频推荐，默认开启
// @author       Yixiong
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405577/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/405577/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var monitor = new MutationObserver(mutations=>block_video());

    function block_video(){
        document.querySelectorAll(".ZVideoItem").forEach((element)=>{element.parentNode.parentNode.remove()})
    }
    monitor.observe(document.querySelector(".ListShortcut"),{
        childList: true,
        subtree: true,
        characterData: false,
        attributes: false
    })

})();