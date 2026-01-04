// ==UserScript==
// @name         bilibili专注模式
// @namespace    jownson
// @version      0.0.2
// @description  bilibili专注模式，屏蔽一切
// @author       jownson
// @match        https://*.bilibili.com/*
// @icon         
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/528812/bilibili%E4%B8%93%E6%B3%A8%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/528812/bilibili%E4%B8%93%E6%B3%A8%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    new MutationObserver(() => {

        // id以#开头，类以.开头
        var block_id_List = [
          //  "#biliMainHeader", //标题栏
            "#commentapp",// 评论
          //  ".ad-report ad-floor-exp right-bottom-banner", // 列表下的广告
             ".ad-report", // 类应该分开写
             ".ad-floor-exp",
             ".right-bottom-banner",
            "#danmukuBox",//弹幕
            "#arc_toolbar_report",
            ".video-card-ad-small",
            "#v_desc",
            "#slide_ad",
            ".recommend-list-v1",
            "#bilibili-player-placeholder-bottom",
            ".bpx-player-sending-area",
            ".video-tag-container",
            ".tag-panel",
          //  ".m-video",// 移动端
            ".m-navbar",
            ".m-video-main-launchapp",
            ".openapp-btn",
            ".m-open-app",
            ".m-footer",
          //  ".video-natural-search",
            ".up-panel-container"//推荐
        ];


        for (var i = 0; i < block_id_List.length; i++) {
            const bbElement = document.querySelector(block_id_List[i]);
            if (bbElement) {
                bbElement.remove();
            }
        }

        const arElement = document.querySelector("a.ad-report");//类下面的 <a> 元素：
        if (arElement) {
            arElement.remove();
        }

        // 删除播放列表下的广告
       // const rcmd_tab_v1Element = document.querySelector('.rcmd-tab');
       // if (rcmd_tab_v1Element) {
       //     rcmd_tab_v1Element.removeChild();
       // }

/*
        var app = document.getElementById("app");

        function traverseAndLog(element) {
            // console.log(element);
            var children = element.children;
            for (var i = 0; i < children.length; i++) {
                //traverseAndLog(children[i]);
                if (children[i].id == "bilibili-player-placeholder")
                {
                    children[i].remove();
                }
            }
        }
        traverseAndLog(app);
*/

    }).observe(document.querySelector('body'), {
        childList: true,
        attributes: true,
        subtree: true,
    });

})();