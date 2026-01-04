// ==UserScript==
// @name         一键打开某几个 AV 片商官网当前页面所有视频的详情页
// @namespace    http://tampermonkey.net/
// @version      2024-1-1@2
// @description  如名字所示
// @author       InorySS
// @match        *://*kawaiikawaii.jp/*
// @match        https://kawaiikawaii.jp/*
// @match        *://*ideapocket.com/*
// @match        https://ideapocket.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kawaiikawaii.jp
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/483539/%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E6%9F%90%E5%87%A0%E4%B8%AA%20AV%20%E7%89%87%E5%95%86%E5%AE%98%E7%BD%91%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E7%9A%84%E8%AF%A6%E6%83%85%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/483539/%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E6%9F%90%E5%87%A0%E4%B8%AA%20AV%20%E7%89%87%E5%95%86%E5%AE%98%E7%BD%91%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E7%9A%84%E8%AF%A6%E6%83%85%E9%A1%B5.meta.js
// ==/UserScript==





(function() {

window.onload = function() {
    // 创建一个新按钮并设置样式
    var button = document.createElement("button");
    button.innerHTML = "一键打开当前页面所有视频的详情页";
    button.style.display = "block"; // 居中显示需要块级元素
    button.style.margin = "0 auto"; // 自动外边距实现居中
    button.style.border = "2px solid black"; // 添加边框

    // 找到要插入按钮的地方
    var insertPoint = document.querySelector('.p-search__key.l-wrap');
    if (!insertPoint) {
        console.error('目标元素不存在。');
        return;
    }
    insertPoint.parentNode.insertBefore(button, insertPoint.nextSibling);

    // 为按钮添加点击事件监听器
    button.addEventListener("click", function() {
        // 获取所有在 'swiper-wrapper' 类中的链接
        var links = Array.from(document.querySelectorAll('.swiper-wrapper a[href]')).filter(function(link) {
            return link.href.includes('/works/detail/');
        });


        if (links.length === 0) {
            console.error('没有找到符合条件的链接。');
            return;
        }

        // 提示用户将打开的链接数并请求确认
        var confirmMessage = `将打开 ${links.length} 个链接。是否继续？`;
        if (!confirm(confirmMessage)) {
            return;
        }

        // 定义一个函数用于逐个打开链接
        function openLinks(i) {
            if (i < links.length) {
                // 打开链接
                window.open(links[i].href, '_blank');
                // 等待0.3秒后打开下一个链接
                setTimeout(function() { openLinks(i + 1); }, 300);
            }
        }

        // 从第一个链接开始打开
        openLinks(0);
    });

    console.log('按钮已添加并设置样式。');
};



})();