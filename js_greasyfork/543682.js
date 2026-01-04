// ==UserScript==
// @name         替换豆包头像为自定义图片
// @namespace    https://tampermonkey.net/
// @version      0.1
// @description  每次打开豆包网页时，自动将头像替换为图床图片
// @author       NacroAlter
// @match        https://doubao.com/*  // 替换为你实际使用的豆包网页地址
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543682/%E6%9B%BF%E6%8D%A2%E8%B1%86%E5%8C%85%E5%A4%B4%E5%83%8F%E4%B8%BA%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/543682/%E6%9B%BF%E6%8D%A2%E8%B1%86%E5%8C%85%E5%A4%B4%E5%83%8F%E4%B8%BA%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 定义你的图床图片链接（替换成自己的）
    const myAvatarUrl = "https://你的图床链接.png"; // 必须是https开头的公网链接

    // 2. 等待页面加载完成后执行（避免找不到头像元素）
    window.addEventListener('load', function() {
        // 3. 查找头像元素（根据实际网页结构调整选择器）
        // 提示：用F12检查元素，找到头像img标签的特征（如class、id、属性）
        const avatarElement = document.querySelector('img[alt="豆包头像"]'); 
        // 如果找不到，可尝试更模糊的选择器，比如：
        // const avatarElement = document.querySelector('.avatar-class'); // 替换为实际class

        // 4. 如果找到头像元素，替换图片
        if (avatarElement) {
            avatarElement.src = myAvatarUrl; // 替换图片源
            avatarElement.srcset = myAvatarUrl; // 部分网页用srcset，一起替换
            avatarElement.style.borderRadius = "50%"; // 确保是圆形（可选）
            console.log("头像替换成功！");
        } else {
            console.log("未找到头像元素，请检查选择器是否正确");
        }
    });

    // 保险措施：如果页面加载完成后没找到，每隔1秒再试一次（防止元素动态加载）
    let checkTimes = 0;
    const checkInterval = setInterval(() => {
        const avatarElement = document.querySelector('img[alt="豆包头像"]');
        if (avatarElement) {
            avatarElement.src = myAvatarUrl;
            avatarElement.srcset = myAvatarUrl;
            clearInterval(checkInterval); // 成功后停止检查
        } else if (checkTimes > 10) {
            clearInterval(checkInterval); // 检查10次后放弃
        }
        checkTimes++;
    }, 1000);
})();
