// ==UserScript==
// @name         bilibili 批量取关
// @namespace    https://github.com/Nriver
// @version      1.2.1
// @description  批量取消 B 站关注
// @author       Nriver
// @license      AGPL-3.0
// @match        https://space.bilibili.com/*/relation/follow
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @homepage     https://github.com/Nriver/monkey-scripts/tree/main/bilibili_unfollow
// @supportURL   https://github.com/Nriver/monkey-scripts/issues
// @source       https://github.com/Nriver/monkey-scripts/tree/main/bilibili_unfollow
// @downloadURL https://update.greasyfork.org/scripts/540898/bilibili%20%E6%89%B9%E9%87%8F%E5%8F%96%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/540898/bilibili%20%E6%89%B9%E9%87%8F%E5%8F%96%E5%85%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = window.jQuery;

    const AUTO_NEXT = true;    // ✅ 设置为 true 启用自动翻页，false 只处理当前页
    const clickDelay = 250;     // 每次取关之间的间隔
    const pageDelay = 1750;     // 翻页后等待时间
    const numPages = 100;       // 最多处理页数（仅在 AUTO_NEXT = true 时有效）

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function processOnePage() {
        const triggers = $(".follow-btn__trigger.gray");
        console.log(`👉 本页共发现 ${triggers.length} 个关注项`);

        for (let i = 0; i < triggers.length; i++) {
            const domElem = triggers[i];
            domElem.click();
            console.log(`✅ 已取消第 ${i + 1} 个关注`);
            await sleep(clickDelay);
        }
    }

    async function main() {

        if (!confirm("是否开始批量取关操作？")) {
            return;
        }

        let page = 0;

        do {
            console.log(`📄 开始处理第 ${page + 1} 页`);
            await processOnePage();
            page++;

            if (!AUTO_NEXT) {
                console.log("🚫 自动翻页未开启，处理结束");
                break;
            }

            const nextBtn = $("button.vui_button.vui_pagenation--btn.vui_pagenation--btn-side:contains('下一页')");
            if (nextBtn.length === 0 || nextBtn.prop("disabled") || nextBtn.hasClass("disabled")) {
                console.log("🚫 没有下一页了，任务结束");
                break;
            }

            nextBtn[0].click();
            console.log("➡️ 翻到下一页...");
            await sleep(pageDelay);
        } while (page < numPages);

        console.log("✅ 批量取关完成！");
    }

    $(document).ready(() => {
        setTimeout(main, 3000); // 页面加载后稍等启动
    });
})();
