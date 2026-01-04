// ==UserScript==
// @name         Warpwarpcast自动关注
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically click all "Follow" buttons on the page.
// @author       @0xxfeng 风无向
// @match        *://*/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/487431/Warpwarpcast%E8%87%AA%E5%8A%A8%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/487431/Warpwarpcast%E8%87%AA%E5%8A%A8%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const clickAllFollowButtons = () => {
        // 获取所有的关注按钮
        const followButtons = document.querySelectorAll('button.rounded-lg.font-semibold.disabled\\:opacity-50.bg-action.text-light.px-4.py-2.text-sm.subtle-hover-z.min-w-\\[92px\\].ml-2');

        // 如果找到了按钮
        if (followButtons && followButtons.length > 0) {
            console.log(`Found ${followButtons.length} follow buttons, clicking...`);
            followButtons.forEach(button => {
                // 检查按钮是否被禁用
                if (!button.disabled) {
                    button.click();
                }
            });
        } else {
            console.log("No follow buttons found.");
        }
    };

    // 定时检查并点击按钮，例如，每5秒执行一次
    setInterval(clickAllFollowButtons, 5000);
})();
