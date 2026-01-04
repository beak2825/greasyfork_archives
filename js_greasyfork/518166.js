// ==UserScript==
// @name         简洁ZK8
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  屏蔽不必要的元素，优化页面浏览体验。
// @author       StayExploring
// @match        *://*.zuanke8.com/*
// @grant        none
// @license      MIT
// @icon         none
// @downloadURL https://update.greasyfork.org/scripts/518166/%E7%AE%80%E6%B4%81ZK8.user.js
// @updateURL https://update.greasyfork.org/scripts/518166/%E7%AE%80%E6%B4%81ZK8.meta.js
// ==/UserScript==

(function() {
    // Helper function to hide an element and log result
    function hideElement(element, description) {
        if (element) {
            element.style.display = 'none';
            console.log(description + ' 已隐藏。');
        } else {
            console.warn(description + ' 未找到。');
        }
    }

    // 隐藏不必要的元素，保留吧友交流区模块
    var nvElement = document.getElementById('nv');
    hideElement(nvElement, '#nv 元素');

    var logoElement = document.querySelector('h2 > a[title="赚客吧"]');
    if (logoElement) {
        var h2Element = logoElement.closest('h2');
        hideElement(h2Element, 'Logo 元素');
    }

    var searchTrElement = document.querySelector('tr');
    if (searchTrElement && searchTrElement.querySelector('.scbar_txt_td')) {
        hideElement(searchTrElement, '搜索框的 <tr> 元素');
    }

    var scbarElement = document.getElementById('scbar');
    hideElement(scbarElement, '整个搜索框的 <div id="scbar"> 元素');

    var wpATElement = document.querySelector('div.wp.a_t');
    hideElement(wpATElement, '包含求助和其他链接的 <div class="wp a_t"> 元素');

    var xadMuElement = document.getElementById('xad_mu');
    hideElement(xadMuElement, '#xad_mu 元素');

    var recommendedTable = document.querySelector('table.dt.valt');
    hideElement(recommendedTable, '推荐阅读的 <table> 元素');

    var zuanpwElement = document.querySelector('div.zuanpw.zuanat');
    hideElement(zuanpwElement, '广告区域的 <div class="zuanpw zuanat"> 元素');

    var hmElement = document.querySelector('td.plc.plm');
    hideElement(hmElement, '今日热门帖子推荐的 <td class="plc plm"> 元素');

    // 隐藏头像元素 <div class="avatar"> 
    var avatarElements = document.querySelectorAll('div.avatar');
    avatarElements.forEach(function(avatar) {
        hideElement(avatar, '头像元素');
    });

    // 隐藏 "chart" 元素 (包括今日、昨日统计信息)
    var chartElement = document.getElementById('chart');
    hideElement(chartElement, '统计信息的 <div id="chart"> 元素');

    // 隐藏除 "吧友交流区" 外的所有模块
    // 隐藏 "有奖一起赚" 模块
    var category1Element = document.querySelector('#category_1');
    if (category1Element) {
        hideElement(category1Element.closest('.bm'), '有奖一起赚模块');
    }

    // 隐藏 "互助共享区" 模块
    var category10Element = document.querySelector('#category_10');
    if (category10Element) {
        hideElement(category10Element.closest('.bm'), '互助共享区模块');
    }

    // 隐藏 "论坛版务区" 模块
    var category7Element = document.querySelector('#category_7');
    if (category7Element) {
        hideElement(category7Element.closest('.bm'), '论坛版务区模块');
    }

    // 保留 "吧友交流区" 模块
    var category16Element = document.querySelector('#category_16');
    if (category16Element) {
        console.log('保留吧友交流区模块');
    } else {
        console.warn('未找到 "吧友交流区" 模块。');
    }

    // 隐藏 "在线会员" 模块
    var onlineElement = document.getElementById('online');
    hideElement(onlineElement, '在线会员模块');

    // 隐藏 "收藏本版" 模块
    var favoriteElement = document.querySelector('.bm.bml.pbn');
    hideElement(favoriteElement, '收藏本版模块');

    // 使用 MutationObserver 来监控动态加载的内容
    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 检查是否是元素节点
                        // 如果是 "吧友交流区" 模块，则保留
                        if (node.id === 'category_16') {
                            console.log('发现动态加载的吧友交流区模块，已保留。');
                        } else if (node.classList.contains('avatar')) {
                            // 动态加载的头像元素隐藏
                            node.style.display = 'none';
                            console.log('动态加载的头像元素已隐藏。');
                        } else if (node.id === 'chart') {
                            // 动态加载的统计信息模块隐藏
                            node.style.display = 'none';
                            console.log('动态加载的统计信息模块已隐藏。');
                        } else {
                            // 隐藏动态加载的其他模块
                            node.style.display = 'none';
                            console.log('动态加载的其他模块已隐藏。');
                        }
                    }
                });
            }
        });
    });

    // 开始监听 document.body 中的变化
    observer.observe(document.body, { childList: true, subtree: true });

})();
