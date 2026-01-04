// ==UserScript==
// @name         哔哩哔哩直播自动点赞
// @namespace    https://jixiejidiguan.top/
// @version      2024-03-25
// @description  支持开启关闭
// @author       jixiejidiguan.top
// @match        https://live.bilibili.com/*
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/490821/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/490821/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var autoClickSwitch = document.createElement('button');
    autoClickSwitch.id = 'autoClickSwitch';
    autoClickSwitch.textContent = '自动点赞';
    autoClickSwitch.style.position = 'fixed'; // 定位按钮
    autoClickSwitch.style.right = '110px'; // 放置在屏幕右边
    autoClickSwitch.style.bottom = '60px'; // 放置在屏幕底部
    autoClickSwitch.style.zIndex = '9999'; // 确保按钮在最上层
    var switchStatus = document.createElement('span');
    switchStatus.id = 'switchStatus';
    switchStatus.textContent = '关闭';
    autoClickSwitch.appendChild(switchStatus);
    document.body.appendChild(autoClickSwitch);
    var clickInterval = null;
    autoClickSwitch.addEventListener('click', toggleAutoClick);
    function toggleAutoClick() {
        if (clickInterval) {
            clearInterval(clickInterval);
            clickInterval = null;
            switchStatus.textContent = '关闭';
        } else {
            var elements = document.querySelectorAll('div[data-type="dianzan.0.show"]');
            if (elements.length > 0) {
                clickInterval = setInterval(function() {
                    elements.forEach(function(element) {
                        try {
                            element.click();
                        } catch (e) {
                            console.error('Error clicking element:', e);
                        }
                    });
                }, 1000); // 每隔1秒点击一次
                switchStatus.textContent = '开启';
            } else {
                console.log('没有找到可点击的元素。');
            }
        }
    }
    window.addEventListener('DOMContentLoaded', function() {
        var elements = document.querySelectorAll('div[data-type="dianzan.0.show"]');
        if (elements.length > 0) {
            console.log('页面加载完成，元素可用。');
        } else {
            console.log('页面加载完成，但未找到可点击的元素。');
        }
    });
})();