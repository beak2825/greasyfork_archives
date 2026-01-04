// ==UserScript==
// @name        网页抖音去广告，跳过直播，去除鼠标移动到收藏、分享后的界面
// @namespace   Violentmonkey Scripts
// @match       https://www.douyin.com/?*
// @grant       none
// @version     4.0
// @description 针对抖音广告更新修改的版本，使用SVG和父元素检测
// @author      -
// @description 2025/10/18 更新
// @downloadURL https://update.greasyfork.org/scripts/456653/%E7%BD%91%E9%A1%B5%E6%8A%96%E9%9F%B3%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E8%B7%B3%E8%BF%87%E7%9B%B4%E6%92%AD%EF%BC%8C%E5%8E%BB%E9%99%A4%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%8A%A8%E5%88%B0%E6%94%B6%E8%97%8F%E3%80%81%E5%88%86%E4%BA%AB%E5%90%8E%E7%9A%84%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/456653/%E7%BD%91%E9%A1%B5%E6%8A%96%E9%9F%B3%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E8%B7%B3%E8%BF%87%E7%9B%B4%E6%92%AD%EF%BC%8C%E5%8E%BB%E9%99%A4%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%8A%A8%E5%88%B0%E6%94%B6%E8%97%8F%E3%80%81%E5%88%86%E4%BA%AB%E5%90%8E%E7%9A%84%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function checkForAd() {
    // 隐藏指定的 div 元素
    hideLastElement('.fZtBRuGd'); // 鼠标移动到收藏后的界面
    hideLastElement('[data-e2e="video-share-container"]'); // 鼠标移动到分享后的界面
    hideLastElement('.seEhooOF[data-e2e="video-play-more"]'); // 鼠标移动到...后的界面

    var videoContainer = document.querySelector('div[data-e2e="feed-active-video"]');

    if (videoContainer) {
        // 新的广告检测逻辑 - 多种方式检测广告
        var adIndicator =
            // 方式1: 直接检测SVG元素
            videoContainer.querySelector('svg[viewBox="0 0 30 16"]') ||
            //videoContainer.querySelector('svg[width="30"][height="16"]') ||
            // 方式2: 检测包含特定路径的SVG
            //videoContainer.querySelector('svg path[fill="#fff"][fill-opacity=".5"]') ||
            // 方式3: 检测包含广告标识的父元素
            //videoContainer.querySelector('div[class*="ad"]') ||
            //videoContainer.querySelector('div[class*="Ad"]') ||
            //videoContainer.querySelector('span[class*="ad"]') ||
            videoContainer.querySelector('span[class*="Ad"]');

        if (adIndicator) {
            console.log('找到广告位置，执行跳过');
            simulateKeyDown(document, 40); // 模拟按下方向键↓

        } else {
            console.log('没有检测到广告');
        }

        // 自动选择"高清"清晰度
        const gearContainer = document.querySelector('.gear .virtual');

        if (gearContainer) {
            const items = gearContainer.querySelectorAll('.item');
            const selectedItem = gearContainer.querySelector('.item.selected');

            if (!selectedItem || !selectedItem.textContent.includes('高清')) {
                items.forEach(item => {
                    if (item.textContent.includes('高清')) {
                        item.click();
                        console.log('已选择高清画质');
                    }
                });
            }
        }

    } else {
        console.log('没有找到 feed-active-video 元素，跳过可能的内容');
        simulateKeyDown(document, 40); // 模拟按下方向键↓
    }

    // 调整检测频率，平衡性能和响应速度
    setTimeout(checkForAd, 800);
})();

// 隐藏指定元素
function hideLastElement(selector) {
    var elements = document.querySelectorAll(selector);
    var lastElement = elements[elements.length - 1];

    if (lastElement) {
        lastElement.style.display = 'none';
        console.log('已隐藏元素: ' + selector);
    }
}

// 模拟按下键盘事件
function simulateKeyDown(target, keyCode) {
    var event = new KeyboardEvent('keydown', {
        keyCode: keyCode,
        bubbles: true,
        cancelable: true,
    });
    target.dispatchEvent(event);
    console.log('模拟按下↓键');
}

// 新增：监测DOM变化，应对动态加载
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            // DOM有新增节点时，立即检查一次广告
            setTimeout(checkForAd, 100);
        }
    });
});

// 启动观察器
observer.observe(document.body, {
    childList: true,
    subtree: true
});