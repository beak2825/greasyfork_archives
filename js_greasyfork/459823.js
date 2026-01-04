// ==UserScript==
// @name         elecfans 电子发烧友移动版自动跳转 PC 页面
// @namespace    https://ivanli.cc/
// @version      0.1
// @description  自动将电子发烧友移动版的页面跳转到 PC 页面。
// @author       Ivan Li
// @match        *://m.elecfans.com/article/*.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459823/elecfans%20%E7%94%B5%E5%AD%90%E5%8F%91%E7%83%A7%E5%8F%8B%E7%A7%BB%E5%8A%A8%E7%89%88%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%20PC%20%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/459823/elecfans%20%E7%94%B5%E5%AD%90%E5%8F%91%E7%83%A7%E5%8F%8B%E7%A7%BB%E5%8A%A8%E7%89%88%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%20PC%20%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const matches = /^https?:\/\/m\.elecfans\.com\/article\/(\d+)\.html$/.exec(location.href);
    const isReferrerFromElecfans = /elecfans/.exec(document.referrer); // 仅允许来自站外的访问自动跳转，避免误跳。如果误跳，返回上一页就好
    const id = matches?.[1] ?? null;
    if (id != null && !isReferrerFromElecfans) {
        const timer = setTimeout(() =>{
            location.href = `https://www.elecfans.com/news/${id}.html`;
        }, 2000);
        GM_notification({
            text: "正在跳转到 PC 版",
            title: "脚本判定当前页面是电子发烧友移动版页面，正常跳转到 PC 版。点我取消！",
            onclick: () => clearTimeout(timer),
        });
    }
})();