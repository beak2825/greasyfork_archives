// ==UserScript==
// @name         创意工坊订阅增强(Steam Workshop Subscription Enhancer)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在仿照壁纸引擎创意工坊物品列表中添加下载按钮，还不完善，先只针对暗黑地牢这一个创意工坊
// @author       fly9593
// @match        https://steamcommunity.com/workshop/browse/?appid=262060*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480739/%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E8%AE%A2%E9%98%85%E5%A2%9E%E5%BC%BA%28Steam%20Workshop%20Subscription%20Enhancer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480739/%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E8%AE%A2%E9%98%85%E5%A2%9E%E5%BC%BA%28Steam%20Workshop%20Subscription%20Enhancer%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载后再执行脚本
    window.onload = function() {
        // 获取所有的创意工坊物品
        var items = document.querySelectorAll('.workshopItem');

        items.forEach(function(item) {
            // 使用 getAttribute 方法获取 data-publishedfileid 属性的值
            var element = item.querySelector('a.ugc');
            var itemId = element.getAttribute('data-publishedfileid');

            // 检查 itemId 是否为 "null"
            if (itemId !== "null") {
                // 输出 itemId 的值到控制台
                console.log(itemId);

                // 构建下载按钮的 HTML 代码
                var downloadButtonHTML = `
                    <div class="workshopItemSubscriptionControls aspectratio_square">
                        <span class="action_wait" id="action_wait_${itemId}" style="display: none;">
                            <img src="https://community.cloudflare.steamstatic.com/public/images/login/throbber.gif">
                        </span>
                        <a href="#" class="general_btn subscribe">
                            <div class="subscribeIcon"></div>
                        </a>
                    </div>
                `;

                // 获取创意工坊物品图片元素
                var previewImage = item.querySelector('.workshopItemPreviewImage');

                // 创建容器元素，用于定位下载按钮
                var buttonContainer = document.createElement('div');
                buttonContainer.classList.add('download-button-container');
                buttonContainer.innerHTML = downloadButtonHTML;

                // 检查是否已订阅
                var subscribedElement = item.querySelector('[id^="user_action_history_icon_subscribed"]');
                // 检查是否已经订阅
                var isSubscribed = subscribedElement && window.getComputedStyle(subscribedElement).getPropertyValue('display') === 'none';

                // 如果已订阅，添加已订阅的样式
                if (!isSubscribed) {
                    buttonContainer.querySelector('.subscribe').classList.add('toggled');
                }

                // 添加点击事件处理程序
                var subscribeButton = buttonContainer.querySelector('.subscribe');
                subscribeButton.addEventListener('click', function(event) {
                    event.preventDefault(); // 阻止默认行为
                    SubscribeInlineItem(itemId, '262060');
                });

                // 将容器插入到图片元素中
                previewImage.parentNode.appendChild(buttonContainer);
            }
        });
    };
})();