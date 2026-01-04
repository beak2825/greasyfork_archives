// ==UserScript==
// @name         Steam屏蔽链接还原
// @license      GPL version 3
// @encoding     utf-8
// @namespace    https://sinon.top/
// @version      1.1
// @description  还原被删除的Steam链接。
// @author       SinonJZH
// @match        https://steamcommunity.com/*
// @match        https://store.steampowered.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429119/Steam%E5%B1%8F%E8%94%BD%E9%93%BE%E6%8E%A5%E8%BF%98%E5%8E%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/429119/Steam%E5%B1%8F%E8%94%BD%E9%93%BE%E6%8E%A5%E8%BF%98%E5%8E%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $J('.bb_removedlink').each(function(){
        var link = $J(this).next().html();
        var link_dis = $J(this).next().attr('href');
        link_dis = link_dis == "#" ? link : linkdis;
        var new_a = '<a href="' + link + '" target="_blank">' + link_dis + '</a>';
        $J(this).after(new_a);
        $J(this).hide();
    });
})();