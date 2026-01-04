// ==UserScript==
// @name         屏蔽B站短视频
// @namespace    https://www.funstrart.com/
// @version      0.1
// @description  屏蔽时间较短的视频（默认3分钟为标准）
// @author       akuya
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426799/%E5%B1%8F%E8%94%BDB%E7%AB%99%E7%9F%AD%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/426799/%E5%B1%8F%E8%94%BDB%E7%AB%99%E7%9F%AD%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(hideVideo, 500);

function hideVideo() {
    //获取class=right的节点，其中包含着视频时间长度
    var list = document.getElementsByClassName("right");

    var regex = /^(0?[0-9]|1[0-9]|[2][0-3]):(0?[0-9]|[1-5][0-9])$/;

    list.forEach(item => {
        if (item.tagName.toLowerCase() == "div" || item.tagName.toLowerCase() == "span") {

            //匹配视频时间长度，如果低于限定值则隐藏
            if (regex.test(item.textContent)) {

                if(item.textContent > "03:00" && item.textContent.length == 5 ){
                    return;
                }

                if(item.textContent > "3:00" && item.textContent.length == 4 ){
                    return;
                }

                //向上遍历父节点，直至找到当前视频模块的顶部，将其整个隐藏（保留占位）
                var parent = item.parentElement;
                if (parent != null) {
                    while (parent.tagName.toLowerCase() != "body") {

                        if (parent.tagName.toLowerCase() == "div" && parent.className.indexOf("video-card-common") != -1) {
                           parent.style.visibility = "hidden";
                           break;
                        //    item.textContent = "### "+ item.textContent;
                        //    break;
                        }

                         parent = parent.parentElement;
                    }
                }
            }
        }
    })
}
    // Your code here...
})();