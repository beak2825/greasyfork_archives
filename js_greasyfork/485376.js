// ==UserScript==
// @name         AzurLane Bwiki Comment Viewer
// @namespace    AzurLaneBwikiCommentViewer
// @version      0.2
// @description  碧蓝航线Bwiki评论查看工具
// @author       Tiny
// @match        https://wiki.biligame.com/blhx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=biligame.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485376/AzurLane%20Bwiki%20Comment%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/485376/AzurLane%20Bwiki%20Comment%20Viewer.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    // 修改flowthread元素的class名称以规避隐藏
    function changeFlowthreadClass() {
        const targetElement = document.getElementById('flowthread');
        if (targetElement) {
            targetElement.className = 'post-contents';
            return true;
        }
        return false;
    }

    // 如果元素已存在，直接修改
    if (changeFlowthreadClass()) {
        console.log('flowthread元素class已修改');
    } else {
        // 如果元素不存在，使用MutationObserver监听DOM变化
        const observer = new MutationObserver(function(mutations) {
            if (changeFlowthreadClass()) {
                console.log('flowthread元素已加载并修改class');
                observer.disconnect(); // 停止观察
            }
        });

        // 开始观察整个document的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 可选：设置超时，防止无限观察
        setTimeout(() => {
            observer.disconnect();
        }, 10000); // 10秒后停止观察
    }
})();