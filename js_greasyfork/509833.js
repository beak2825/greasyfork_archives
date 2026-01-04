// ==UserScript==
// @name         Bilibili 清理推荐
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用于删除b站的推选与广告
// @author       Zcxxxxxxx
// @match        *://www.bilibili.com/video/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509833/Bilibili%20%E6%B8%85%E7%90%86%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/509833/Bilibili%20%E6%B8%85%E7%90%86%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建一个按钮
    var button = document.createElement('button');
    button.innerText = '删除广告和推荐内容';
    button.style.position = 'fixed'; // 固定位置
    button.style.top = '50%'; // 距离顶部50%
    button.style.right = '10px'; // 距离右侧10px
    button.style.transform = 'translateY(-50%)'; // 垂直居中
    button.style.zIndex = '1000'; // 确保在最上层
    button.style.padding = '15px 20px'; // 内边距
    button.style.fontSize = '18px'; // 字体大小
    button.style.backgroundColor = '#ff5722'; // 背景色
    button.style.color = '#fff'; // 字体颜色
    button.style.border = 'none'; // 无边框
    button.style.borderRadius = '5px'; // 圆角
    button.style.cursor = 'pointer'; // 鼠标样式
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // 添加阴影
    document.body.appendChild(button); // 将按钮添加到页面
    // 等待页面加载完成
    button.addEventListener('click', function() {
        // 找到id为reco_list的div
        var recoList = document.getElementById('reco_list');
        var slideAd = document.getElementById('slide_ad');

        if (slideAd) {
            // 删除该元素
            slideAd.remove();
        }

        var adElements = document.querySelectorAll('div.ad-floor-cover');
        adElements.forEach(function(adElement) {
            adElement.remove(); // 删除找到的每个元素
        });

        if (recoList) {
            // 找到包含它的上一级盒子
            var parentBox = recoList.parentElement;

            // 找到 id 为 multi_page 的元素
            var multiPage = document.getElementById('multi_page');

            if (multiPage) {
                // 遍历 parentBox 的子元素并删除除 multi_page 外的元素
                Array.from(parentBox.children).forEach(function(child) {
                    if (child !== multiPage) {
                        child.remove();
                    }
                });
            } else {
                // 如果没有 multi_page，删除整个 parentBox
                parentBox.remove();
            }
        }
    });
})();