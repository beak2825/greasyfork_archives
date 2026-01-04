// ==UserScript==
// @name         Danking直播间牌子修改
// @namespace    http://tampermonkey.net/
// @version      2024-10-05
// @description  danking直播间牌子修改
// @author       LeeB
// @match        https://www.huya.com/dank1ng
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huya.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513668/Danking%E7%9B%B4%E6%92%AD%E9%97%B4%E7%89%8C%E5%AD%90%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/513668/Danking%E7%9B%B4%E6%92%AD%E9%97%B4%E7%89%8C%E5%AD%90%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

// ==UserScript==
// @name         使用变量动态修改元素内容
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用变量动态修改图片 URL 中的数字部分
// @author       你自己
// @match        https://目标网站的URL/*  // 替换为你要匹配的网站
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 设置变量以动态修改 URL 中的数字部分
    let versionNumber = '18'; // 你可以根据需要更改这个数字

    // 构建完整的 URL
    let imageUrl = `https://fileserver.cdn.huya.com/web_admin_badgeNewIdentityResource/838b55e0779340099665bee2d4c2b2e7/2_3_0_0_${versionNumber}.png`;

    // 等待页面及所有资源完全加载完成
    window.addEventListener('load', function() {
        // 定时器，定期检查和修改目标元素
        var intervalId = setInterval(function() {
            // 使用 XPath 查找指定路径的元素
            var xpathResult = document.evaluate('/html/body/div[1]/div/div[2]/div/div[2]/div/div[3]/div[1]/div[2]/div/div[4]/div[1]/div[5]/div[2]/div/div/span', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            // 遍历所有匹配的元素，持续修改
            for (var i = 0; i < xpathResult.snapshotLength; i++) {
                var targetSpan = xpathResult.snapshotItem(i); // 获取每个匹配的元素

                if (targetSpan) {
                    // 检查当前背景图片是否已经是我们期望的图片
                    if (!targetSpan.style.backgroundImage.includes(versionNumber)) {
                        // 强制修改背景图片
                        targetSpan.style.backgroundImage = `url("${imageUrl}")`; // 使用变量构建的 URL

                        // 强制修改其他属性（如果需要）
                        // targetSpan.style.backgroundColor = '#ff0000'; // 修改背景颜色为红色
                        // targetSpan.textContent = "新的内容"; // 修改文本内容
                    }
                }
            }
        }, 1000); // 每秒检查和修改一次 (1000 毫秒)
    });
})();
