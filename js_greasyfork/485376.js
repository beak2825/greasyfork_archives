// ==UserScript==
// @name         AzurLane Bwiki Comment Viewer
// @namespace    AzurLaneBwikiCommentViewer
// @version      0.1
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
    // 等待网页完成加载
    window.addEventListener('load', function() {
        document.getElementById('flowthread').className = 'post-contents';
    }, false);
 
})();