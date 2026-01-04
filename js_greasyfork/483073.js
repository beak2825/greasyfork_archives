// ==UserScript==
// @name         一键打开 Javlibrary 当前页面所有视频的详情页
// @namespace    http://tampermonkey.net/
// @version      2024-05-24_01
// @description  一键打开 Javlibrary 当前页面所有视频的详情页（带自定义间隔时间）
// @author       InorySS
// @match        *://*javlibrary.com/*
// @match        *://*javlib.com/*
// @match        https://www.javlibrary.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javlibrary.com
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/483073/%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%20Javlibrary%20%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E7%9A%84%E8%AF%A6%E6%83%85%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/483073/%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%20Javlibrary%20%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E7%9A%84%E8%AF%A6%E6%83%85%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    window.onload = function() {
        var emptyLine = document.createElement('div');
        emptyLine.style.height = '20px';

        var button = document.createElement('button');
        button.innerHTML = '一键打开当前页面所有视频的详情页';
        button.style.marginRight = '20px';

        var intervalLabel = document.createElement('label');
        intervalLabel.textContent = '打开间隔：';
        intervalLabel.style.marginRight = '10px';

        var intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.value = 1000; // 默认间隔时间设置为 1000 毫秒
        intervalInput.style.margin = '5px';

        var intervalSuffix = document.createElement('span');
        intervalSuffix.textContent = '毫秒';

        var boxTitle = document.querySelector('div.boxtitle');
        if (!boxTitle) {
            console.error('目标元素不存在。');
            return;
        }
        boxTitle.parentNode.insertBefore(emptyLine, boxTitle.nextSibling);
        boxTitle.parentNode.insertBefore(button, emptyLine.nextSibling);
        boxTitle.parentNode.insertBefore(intervalLabel, button.nextSibling);
        boxTitle.parentNode.insertBefore(intervalInput, intervalLabel.nextSibling);
        boxTitle.parentNode.insertBefore(intervalSuffix, intervalInput.nextSibling);


        button.onclick = function() {
            // 获取用户设置的间隔时间
            var interval = parseInt(intervalInput.value, 10) || 1000; // 如果输入不是数字，则默认为 1000 毫秒

            // 兼容封面插件
            var videos = Array.from(document.querySelectorAll('div.detail-b a[name="av-title"], div.videos a')).filter(link => link.href && link.href.startsWith('http'));

            if (!confirm(`将打开 ${videos.length} 个视频详情页。是否继续？`)) {
                return;
            }

            function openVideoLinks(index) {
                if (index < videos.length) {
                    var link = videos[index].href;
                    window.open(link, '_blank');
                    setTimeout(function() { openVideoLinks(index + 1); }, interval);
                }
            }

            openVideoLinks(0);
        };

        console.log('一键打开详情页：按钮已添加');
    };
})();
