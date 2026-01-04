// ==UserScript==
// @name         自己举报自己
// @namespace    https://greasyfork.org/zh-CN/users/822325-mininb666
// @version      0.1
// @description  为自己的评论添加举报按钮
// @author       mininb666
// @match        *://*.greasyfork.org/*
// @icon         https://greasyfork.org/packs/media/images/blacklogo96-b2384000fca45aa17e45eb417cbcbb59.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443467/%E8%87%AA%E5%B7%B1%E4%B8%BE%E6%8A%A5%E8%87%AA%E5%B7%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/443467/%E8%87%AA%E5%B7%B1%E4%B8%BE%E6%8A%A5%E8%87%AA%E5%B7%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll(".comment").forEach(e=>{
            if (e.innerHTML.indexOf("举报评论") == -1) {
                var el = document.createElement("div");
                el.innerHTML = '<a href="https://greasyfork.org/zh-CN/reports/new?item_class=comment&item_id=' + (e.id.substring(e.id.indexOf("-") + 1)) + '">举报评论</a>';
                el.className = "comment-meta-item";
                e.querySelector(".comment-meta").appendChild(el)
            }
        }
    )
})();