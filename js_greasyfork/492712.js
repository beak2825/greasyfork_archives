// ==UserScript==
// @name         立德教育在线刷课刷题 山西立德 网课助手
// @license      MIT
// @match       https://www.ldzxjy.com/*
// @description         脚本免费！谨防上当受骗！整合和修改现有脚本，优化项详见脚本说明
// @version 0.0.1.20240417030525
// @namespace https://greasyfork.org/users/1289216
// @downloadURL https://update.greasyfork.org/scripts/492712/%E7%AB%8B%E5%BE%B7%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E5%88%B7%E9%A2%98%20%E5%B1%B1%E8%A5%BF%E7%AB%8B%E5%BE%B7%20%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492712/%E7%AB%8B%E5%BE%B7%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E5%88%B7%E9%A2%98%20%E5%B1%B1%E8%A5%BF%E7%AB%8B%E5%BE%B7%20%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const Z_KEY = 'q'; // 答题页面下一题
    const X_KEY = 'w'; // 视频页面学完了

    window.onload = function() {
        // Create a div element to contain the usage instructions
        var usageInstructions = document.createElement("div");
        usageInstructions.innerHTML = `
        <p>欢迎使用我的课程终结者油猴脚本！</p >
         <p>本插件在答题页面会默认显示正确答案 </p >
        <p>在答题页面按下 ${ Z_KEY } 键可快速跳转至下一题</p >
        <p>在视频播放页面按下 ${ X_KEY } 键可以快速学完本节课。</p >`;
        usageInstructions.style.backgroundColor = "rgba(248, 215, 218, 0.7)"; // Set background color with opacity
        usageInstructions.style.color = "#721c24"; // Set text color
        usageInstructions.style.padding = "5px"; // Add padding
        usageInstructions.style.marginLeft = "10px"; // Add padding

        usageInstructions.style.boxSizing = "border-box"; // Add padding
        usageInstructions.style.borderRadius = "10px"; // Add padding
        usageInstructions.style.position = "fixed"; // Set position to fixed
        usageInstructions.style.top = "50%"; // Set top to 0

        usageInstructions.style.transform = "translateY(-50%)";


        usageInstructions.style.width = "100px"; // Set top to 0
        usageInstructions.style.left = "0"; // Set left to 0
        usageInstructions.style.right = "auto"; // Set right to auto (default)
        usageInstructions.style.zIndex = "9999"; // Set z-index to ensure it is on top of other elements

        // Insert the usage instructions at the top of the page
        document.body.appendChild(usageInstructions);

        // Your code here...
        document.addEventListener('keydown', function(event) {
            // Check if the pressed key is Z_KEY, then execute $('.buttonBox > button.next').trigger("click")
            if (event.key === Z_KEY) {
                $('.buttonBox > button.next').trigger("click");
            }
            // Check if the pressed key is X_KEY, then execute $('.studyOk').click()
            if (event.key === X_KEY) {
                $('.studyOk').click();
            }
        });

        // Continuous loop to ensure the display property is always "block"
        setInterval(function() {
            // 选择所有具有类名为"resolve"的元素
            var resolveElements = document.querySelectorAll('.resolve');

            // 循环遍历这些元素，并将它们的display属性设置为"block"
            resolveElements.forEach(function(element) {
                element.style.display = 'block';
            });
        }, 100); // Adjust the interval (milliseconds) as needed
    };
})();