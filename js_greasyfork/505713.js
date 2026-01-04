// ==UserScript==
// @name         干净Bing
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Bing搜索去除视频&相关信息板块、菜单栏不需要的选项、语音输入按钮
// @author       大触紫衣WisteriaZy
// @match        https://www.bing.com/search*
// @match        https://cn.bing.com/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505713/%E5%B9%B2%E5%87%80Bing.user.js
// @updateURL https://update.greasyfork.org/scripts/505713/%E5%B9%B2%E5%87%80Bing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 视频
    const videoSection = document.querySelector('li.b_ans.b_mop.b_vidAns');
    if (videoSection) {
        videoSection.style.display = 'none';
    }

    // 新闻
    const newsSection = document.querySelector('li.b_ans.b_mop.b_nwsAns');
    if (newsSection) {
        newsSection.style.display = 'none';
    }

    // 趣味阅读
    const readSection = document.querySelector('li.b_ans.b_mop.b_mopb');
    if (readSection) {
        readSection.style.display = 'none';
    }

    // 语音输入
    const micSection = document.querySelector('#mic_cont_icon.mic_cont.icon.partner');
    if (micSection) {
        micSection.style.display = 'none';
    }

    // 隐藏导航栏中的不需要的项目
    function hideNavItemById(itemId) {
        const navItem = document.getElementById(itemId);
        if (navItem) {
            navItem.style.display = 'none';
        }
    }

    // Hide specific navigation items
    hideNavItemById('b-scopeListItem-video'); // 隐藏“视频”
    hideNavItemById('b-scopeListItem-dictionary'); // 隐藏“词典”
    hideNavItemById('b-scopeListItem-academic'); // 隐藏“学术”
    hideNavItemById('b-scopeListItem-menu');
    //hideNavItemById('b-scopeListItem-local'); // 隐藏“地图”（在“更多”里面）
    //hideNavItemById('b-scopeListItem-flights'); // 隐藏“航班”（在“更多”里面）

})();