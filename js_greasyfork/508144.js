// ==UserScript==
// @name               自研 - 哔哩哔哩 - 移除广告被屏蔽提示
// @name:en_US         Self-made - BiliBili - Remove Ad Block Notice
// @description        移除首页被广告屏蔽类插件屏蔽后展示的框架内容。
// @description:en_US  Remove the scaffolding content displayed on the homepage when blocked by ad-blocker extensions.
// @version            1.0.0
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://www.bilibili.com/
// @run-at             document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/508144/%E8%87%AA%E7%A0%94%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E8%A2%AB%E5%B1%8F%E8%94%BD%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/508144/%E8%87%AA%E7%A0%94%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E8%A2%AB%E5%B1%8F%E8%94%BD%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义「监听器」变量及其回调函数。
    const observer = new MutationObserver(() => {

        // 遍历所有未检查过的卡片，如果有对应内容就移除，没有就标注已检查。
        document.querySelectorAll(".recommended-container_floor-aside .feed-card:not(.RABNChecked), .recommended-container_floor-aside .bili-video-card:not(.RABNChecked)").forEach((elm) => {

            if(elm.querySelector(".bili-video-card > div:first-child:not(.bili-video-card__skeleton)")) {

                elm.remove();

            }else {

                elm.classList.add("RABNChecked");

            }

        });

    });

    // 配置「监听器」需要监听的元素和参数。
    observer.observe(document.querySelector(".recommended-container_floor-aside"), { childList: true, subtree: true });

})();