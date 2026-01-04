// ==UserScript==
// @name         cnbeta只保留列表
// @namespace    http://tampermonkey.net/
// @version		 0.1
// @description	 整体加载后只保留列表，监视动态列表加载去除广告
// @author		 hueidou
// @match        https://www.cnbeta.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386639/cnbeta%E5%8F%AA%E4%BF%9D%E7%95%99%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/386639/cnbeta%E5%8F%AA%E4%BF%9D%E7%95%99%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(() => {
        //$('header').remove();
        $('.topContent').remove();
        $('.cnbeta-side-sponsor').remove();
        $('#left1').remove();
        $('.cnbeta-home-side').remove();
        $('.cnbeta-headlines').remove();
        $('.item.cooperation').remove();

        $('.cnbeta-update-list').width('auto');

        let observer = new MutationObserver(list => {
            for(let node of list) {
                const $node = $(node.addedNodes[0]);

                if($node.hasClass('cooperation') || !$node.hasClass('item')) {
                    $node.remove();
                }
            }
        }).observe($('.cnbeta-update .items-area')[0], {
            childList: true
        });
    });
})();