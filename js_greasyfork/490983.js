// ==UserScript==
// @name         Feishu Bubble Enhancement
// @namespace    http://tampermonkey.net/
// @version      2024-04-01
// @description  a script to enhance lark/feishu's msg bubble in wrong way
// @author       haru
// @match        https://*/next/messenger
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bytedance.larkoffice.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490983/Feishu%20Bubble%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/490983/Feishu%20Bubble%20Enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 替换为想要屏蔽的人名
    const groupA = ['小李', '李四', '王八'];

    // 替换为想要强调的人名
    const groupB = ['张经理', '小明', '马云'];

    const messageItemSelector = '.js-message-item.message-item';
    const nameSelector = '.message-info-name';

    const blurEffect = 'blur(5px)';
    const renderDouble = 'scale(2.5)';

    const rainbowEffect = `
        background: linear-gradient(90deg, rgba(255, 0, 0, 0.60) 0%, rgba(255, 230, 0, 0.60) 17.4%, rgba(4, 252, 44, 0.60) 33.4%, rgba(0, 224, 255, 0.60) 51.09%, rgba(66, 0, 255, 0.60) 66.4%, rgba(250, 0, 255, 0.60) 79.9%, rgba(255, 0, 0, 0.60) 100%);
        background-size: 100% 100%;
        opcaity: 0.5;
    `;

    setInterval(() => {
        const messageItems = [...document.querySelectorAll(messageItemSelector)];

        messageItems.forEach(item => {
            const name = item.querySelector(nameSelector)?.innerText;
            if (!name) {
                return;
            }

            if (groupA.includes(name)) {
                item.style.filter = blurEffect;
            } else if (groupB.includes(name)) {
                item.style.transform = renderDouble;
                item.style.transformOrigin = 'left';
                item.style.paddingTop = '4em';
                item.style.paddingBottom = '4em';

                // 如果一个人连续发多句话，这里就没法改下边的样式了。哎呀但是就这样吧随便了【
                const div = item.querySelector('.NewMessageContextMenuTrigger.MessageContextMenuTrigger.MessageContextMenuTrigger--scene-chat.message-section-left.message-section-newFileCard');
                if (div) {
                    div.style.cssText = rainbowEffect;
                }
            }
        });
    }, 1000);
})();