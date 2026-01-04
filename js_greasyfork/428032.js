// ==UserScript==
// @name         绯月防自爆脚本
// @namespace    https://greasyfork.org/zh-CN/users/453092
// @version      0.4
// @description  一键口球自己
// @author       ikarosf
// @include     https://*kfmax.com/*
// @include     https://*kforz.com/*
// @include     https://*bakabbs.com/*
// @include     https://*365gal.com/*
// @include     https://*365galgame.com/*
// @include     https://*fygal.com/*
// @include     https://*kfgal.com/*
// @include     https://*miaola.info/*
// @include     https://*9shenmi.com/*
// @icon         https://www.google.com/s2/favicons?domain=kfmax.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428032/%E7%BB%AF%E6%9C%88%E9%98%B2%E8%87%AA%E7%88%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/428032/%E7%BB%AF%E6%9C%88%E9%98%B2%E8%87%AA%E7%88%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("input[type='submit'][value='确定发表'],input[type='submit'][value='回复帖子']").click(function(event){
        alert('您已被自己禁言!');
        event.preventDefault();
        return false;
    });
    // Your code here...
})();