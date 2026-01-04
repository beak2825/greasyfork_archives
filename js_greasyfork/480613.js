// ==UserScript==
// @name        Computer “Vision” - webhek.com
// @namespace   Violentmonkey Scripts
// @match       https://www.webhek.com/post/color-test/
// @grant       none
// @version     1.1
// @author      ganansuan647
// @license MIT
// @description 2023/11/23 22:04:34
// @downloadURL https://update.greasyfork.org/scripts/480613/Computer%20%E2%80%9CVision%E2%80%9D%20-%20webhekcom.user.js
// @updateURL https://update.greasyfork.org/scripts/480613/Computer%20%E2%80%9CVision%E2%80%9D%20-%20webhekcom.meta.js
// ==/UserScript==
// 这个函数用于比较两个颜色是否足够接近
// 等待页面加载完毕
window.addEventListener('load', function () {
    var isGameStarted = false;

    // 识别并点击不同颜色的方格的函数
    function findAndClickDifferentColorBox() {
        if (!isGameStarted) return; // 如果游戏未开始，则不执行任何操作

        var boxes = document.querySelectorAll('#box span');
        var colors = {};

        // 遍历所有方格并记录颜色
        boxes.forEach(function (box) {
            var color = box.style.backgroundColor;
            if (colors[color]) {
                colors[color].push(box);
            } else {
                colors[color] = [box];
            }
        });

        // 找出唯一的颜色
        for (var color in colors) {
            if (colors[color].length === 1) {
                // 模拟点击不同颜色的方格
                colors[color][0].click();
                break;
            }
        }
    }

    // 给“开始测试”按钮添加点击事件监听
    var playButton = document.querySelector('.btn.play-btn');
    if (playButton) {
        playButton.addEventListener('click', function () {
            isGameStarted = true;
            // 可以在游戏开始后立即执行一次检查
            findAndClickDifferentColorBox();
        });
    }

    // 设置定时器定期检查
    setInterval(findAndClickDifferentColorBox, 1000); // 每秒检查一次
});

