// ==UserScript==
// @name         cnbeta 去额外的广告
// @namespace    http://tampermonkey.net/
// @version		 0.1
// @description	 一键 收藏 点赞 评论 页面优化增强
// @author		 cuteribs
// @match        https://www.cnbeta.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382956/cnbeta%20%E5%8E%BB%E9%A2%9D%E5%A4%96%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/382956/cnbeta%20%E5%8E%BB%E9%A2%9D%E5%A4%96%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(() => {
        let observer = new MutationObserver(list => {
            for(let node of list[0].addedNodes) {
                const $node = $(node);

                if($node.hasClass('tbl-feed-container') || $node.hasClass('trc_related_container')) {
                    $node.remove();
                }
            }
        }).observe($('.cnbeta-article, .items-area')[0], {
            childList: true
        });
    });
})();