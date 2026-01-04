// ==UserScript==
// @name         精简抖音直播页
// @namespace    http://tampermonkey.net/
// @version      v1.1.0
// @description  streamline douyin live page
// @author       JohnnyXie
// @match        https://live.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502565/%E7%B2%BE%E7%AE%80%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/502565/%E7%B2%BE%E7%AE%80%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    let done = false;
    let check_times = 0;

    function removeElements(className) {
        // 使用document.querySelectorAll获取所有具有指定类的元素
        const elements = document.querySelectorAll(className);

        // 遍历所有这些元素并删除它们
        elements.forEach(function(element) {
            element.parentNode.removeChild(element);
        });
    }
    function doJob () {
        let nodes = document.getElementsByTagName('header')[0].getElementsByTagName('pace-island')[0].childNodes[0].childNodes;
        let len = nodes.length || 0;
        for (let i in nodes) {
            if (i < len - 1) {
                nodes[i].style.opacity = 0;
                nodes[i].remove();
            }
        }
        check_times++;
        if (check_times > 10) {
            done = true;
            console.log('delete done.');
            return true;
        }
        setTimeout(function () {
            doJob();
        }, 1000);
    }

    /**
     * 隐藏视频底部礼物
     */
    function removeGift() {
        if (document.getElementsByClassName('LE4P00KT').length === 0) {
            setTimeout(function () {
                removeGift();
            }, 1000);
            return;
        }
        removeElements('.LE4P00KT');
    }

    /**
     * 隐藏左侧导航
     */
    function removeLeftNav() {
        if (document.getElementById('douyin-navigation').length === 0) {
            setTimeout(function () {
                removeLeftNav();
            }, 1000);
            return;
        }
        removeElements('#douyin-navigation');
    }

    function cssChange() {
        // 顶部搜索栏
        let ele = document.getElementById('douyin-header');
        if (ele.length === 0) {
            setTimeout(function () {
                cssChange();
            }, 1000);
            return;
        }
        ele.style.position = 'absolute';
        ele.style.background = 'transparent';
        ele.style.marginLeft = '20%';
        document.getElementById('douyin-header-menuCt').style.margin = '0 30px 20px';

        // 右下角帮助按钮
        removeElements('#douyin-sidebar');
    }

    if (done !== true) {
        setTimeout(function () {
            doJob();
            removeGift();
            removeLeftNav();
            cssChange();
        }, 5000);
    }
})();