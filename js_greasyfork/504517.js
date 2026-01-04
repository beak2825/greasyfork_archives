// ==UserScript==
// @name         Bilibili动态页依次打开18个视频
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在Bilibili动态页面添加一个按钮，每次点击依次打开下一组18个视频
// @author       Your Name
// @match        *://t.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504517/Bilibili%E5%8A%A8%E6%80%81%E9%A1%B5%E4%BE%9D%E6%AC%A1%E6%89%93%E5%BC%8018%E4%B8%AA%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/504517/Bilibili%E5%8A%A8%E6%80%81%E9%A1%B5%E4%BE%9D%E6%AC%A1%E6%89%93%E5%BC%8018%E4%B8%AA%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentIndex = 0; // 初始化当前索引

    // 函数：在新标签页中打开当前索引开始的18个视频
    function openVideos() {
        let items = document.querySelectorAll('.bili-dyn-list__item');
        let maxIndex = Math.min(currentIndex + 18, items.length);

        for (let i = currentIndex; i < maxIndex; i++) {
            let item = items[i];
            let link = item.querySelector('a');
            if (link) {
                window.open(link.href, '_blank');
            }
        }

        currentIndex += 18; // 更新当前索引
    }

    // 函数：创建并添加按钮到页面的指定位置
    function addButton() {
        let button = document.createElement('button');
        button.innerHTML = '打开18个';

        // 应用给定的样式
        button.style.alignItems = 'center';
        button.style.color = '#61666D';
        button.style.cursor = 'pointer';
        button.style.display = 'flex';
        button.style.fontWeight = '400';
        button.style.height = '100%';
        button.style.justifyContent = 'center';
        button.style.marginRight = '32px';
        button.style.position = 'relative';
        button.style.fontSize = '15px';
        button.style.lineHeight = '25px';
        button.style.fontFamily = 'PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif';
        button.style.border = 'none';
        button.style.outline = 'none';
        button.style.padding = '0';
        button.style.background = 'transparent'; // 设置背景色为透明

        // 添加悬停效果：鼠标移上去时改变字体颜色
        button.addEventListener('mouseenter', function() {
            button.style.color = '#00AEEC';
        });

        // 鼠标移出时恢复原始字体颜色
        button.addEventListener('mouseleave', function() {
            button.style.color = '#61666D';
        });

        // 找到"专栏"元素并将按钮插入其后
        let zhuanlanTab = document.querySelector('.bili-dyn-list-tabs__item.fs-medium:nth-child(4)');
        if (zhuanlanTab && zhuanlanTab.parentElement) {
            zhuanlanTab.parentElement.appendChild(button);
        }

        // 为按钮添加点击事件
        button.addEventListener('click', openVideos);
    }

    // 确保脚本在页面完全加载后运行
    window.addEventListener('load', function() {
        addButton();
    }, false);
})();
