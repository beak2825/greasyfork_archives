// ==UserScript==
// @name         隐藏标题/安全标题/Title SFW
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  避免上班摸鱼的时候网页标题过于“炸裂”导致社死
// @author       You
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518781/%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98%E5%AE%89%E5%85%A8%E6%A0%87%E9%A2%98Title%20SFW.user.js
// @updateURL https://update.greasyfork.org/scripts/518781/%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98%E5%AE%89%E5%85%A8%E6%A0%87%E9%A2%98Title%20SFW.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 定义自定义标题列表
    const titles = ["富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善"];
    // 随机从列表中选择四个标题
    const customTitles = [];
    for (let i = 0; i < 6; i++) {
        customTitles.push(titles[Math.floor(Math.random() * titles.length)]);
    }

    // 将四个随机标题组合成一个字符串
    const customTitle = customTitles.join('、');


    // 随机从列表中选择一个标题
    // const customTitle = titles[Math.floor(Math.random() * titles.length)];
    document.title = customTitle + "|" + document.title;

    // Optional: Prevent future changes to the title
    const observer = new MutationObserver(() => {
        // if (document.title !== customTitle) {
        //     document.title = customTitle;
        // }
        document.title = customTitle + document.title
    });

    observer.observe(document.querySelector('title'), { childList: true });
})();
