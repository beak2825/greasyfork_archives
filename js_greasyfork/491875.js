// ==UserScript==
// @name         DLsite添加复制RJ号和标题按钮
// @version      1.11
// @description  在DLsite作品网页上添加“复制RJ号”和“复制标题”的按钮
// @author       LC2808
// @match        https://www.dlsite.com/maniax/work/=/product_id/*
// @grant        none
// @namespace https://greasyfork.org/users/1284881
// @downloadURL https://update.greasyfork.org/scripts/491875/DLsite%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6RJ%E5%8F%B7%E5%92%8C%E6%A0%87%E9%A2%98%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/491875/DLsite%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6RJ%E5%8F%B7%E5%92%8C%E6%A0%87%E9%A2%98%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前网页的URL
    var currentURL = window.location.href;

    // 使用正则表达式提取RJ号
    var regex = /\/(RJ\d+)\.html/;
    var match = currentURL.match(regex);

    if (match && match.length > 1) {
        var productCode = match[1];

        // 找到h1#work_name元素
        var workNameElement = document.querySelector('h1#work_name');

        if (workNameElement) {
            // 创建按钮元素（复制RJ号）
            var copyRJButton = document.createElement('button');
            copyRJButton.textContent = '复制RJ号';
            copyRJButton.style.fontFamily = 'Microsoft YaHei'; // 使用微软雅黑字体
            copyRJButton.style.marginLeft = '10px'; // 调整按钮与h1#work_name元素之间的间距
            copyRJButton.style.cursor = 'pointer';
            copyRJButton.style.verticalAlign = 'middle';

            // 绑定复制RJ号按钮点击事件
            copyRJButton.addEventListener('click', function() {
                // 复制RJ号到剪贴板
                navigator.clipboard.writeText(productCode).then(function() {
                    console.log('Copied RJ code to clipboard: ' + productCode);
                    // 显示复制成功提示
                    var infoBox = createInfoBox('已复制RJ号: ' + productCode);
                    document.body.appendChild(infoBox);
                    // 3秒后隐藏提示
                    setTimeout(function() {
                        infoBox.style.display = 'none';
                    }, 3000);
                }, function(err) {
                    console.error('Unable to copy RJ code to clipboard: ', err);
                    alert('复制失败，请手动复制。');
                });
            });

            // 创建按钮元素（复制标题）
            var copyTitleButton = document.createElement('button');
            copyTitleButton.textContent = '复制标题';
            copyTitleButton.style.fontFamily = 'Microsoft YaHei'; // 使用微软雅黑字体
            copyTitleButton.style.marginLeft = '10px'; // 调整按钮与复制RJ号按钮之间的间距
            copyTitleButton.style.cursor = 'pointer';
            copyTitleButton.style.verticalAlign = 'middle';

            // 绑定复制标题按钮点击事件
            copyTitleButton.addEventListener('click', function() {
                // 复制h1#work_name元素的文本内容到剪贴板
                var workName = workNameElement.textContent.trim();
                // 复制标题内容到剪贴板，但不包含“复制RJ号复制标题”这几个文字
                var titleWithoutButtons = workName.replace('复制RJ号复制标题', '');
                navigator.clipboard.writeText(titleWithoutButtons).then(function() {
                    console.log('Copied work name to clipboard: ' + titleWithoutButtons);
                    // 显示复制成功提示
                    var infoBox = createInfoBox('已复制标题: ' + titleWithoutButtons);
                    document.body.appendChild(infoBox);
                    // 3秒后隐藏提示
                    setTimeout(function() {
                        infoBox.style.display = 'none';
                    }, 3000);
                }, function(err) {
                    console.error('Unable to copy work name to clipboard: ', err);
                    alert('复制失败，请手动复制。');
                });
            });

            // 插入按钮到h1#work_name元素后面
            workNameElement.appendChild(copyRJButton);
            workNameElement.appendChild(copyTitleButton);
        } else {
            console.error('h1#work_name元素不存在');
        }
    } else {
        console.log('未找到RJ号');
    }

    // 创建提示框元素
    function createInfoBox(message) {
        var infoBox = document.createElement('div');
        infoBox.textContent = message;
        infoBox.style.fontFamily = 'Microsoft YaHei'; // 使用微软雅黑字体
        infoBox.style.position = 'fixed';
        infoBox.style.top = '50%';
        infoBox.style.left = '50%';
        infoBox.style.transform = 'translate(-50%, -50%)';
        infoBox.style.backgroundColor = '#f0f0f0';
        infoBox.style.padding = '10px';
        infoBox.style.borderRadius = '5px';
        infoBox.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        infoBox.style.zIndex = '9999';
        return infoBox;
    }
})();
