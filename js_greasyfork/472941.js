// ==UserScript==
// @name         网页反隐形
// @author       Antecer
// @namespace    https://greasyfork.org/zh-CN/users/42351
// @version      1.5
// @description  解除网页内容前端阅读限制
// @icon64       https://antecer.gitlab.io/amusingdevice/icon/antecer.ico
// @icon         https://antecer.gitlab.io/amusingdevice/icon/antecer.ico
// @grant        none
// @run-at       document-end
// @match        http://*/*
// @match        https://*/*
// @exclude      https://bbs.21ic.com/ic*
// @downloadURL https://update.greasyfork.org/scripts/472941/%E7%BD%91%E9%A1%B5%E5%8F%8D%E9%9A%90%E5%BD%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/472941/%E7%BD%91%E9%A1%B5%E5%8F%8D%E9%9A%90%E5%BD%A2.meta.js
// ==/UserScript==

(async () => {
    // 创建sleep方法(用于async/await的延时处理)
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    // 在网页head标签内添加样式表
    function addStyle(css) {
        let style = document.createElement('style');
        style.setHTML(css);
        document.head.appendChild(style);
    }

    // 解除文章隐藏限制
    if (window.location.href.match(/javascriptc.com\/\d+/)) {
        addStyle(`#lockerPage{height: auto !important;} #unlockReadall{display: none !important;}`);
        console.log(`[网页反隐形] 已解除文章阅读限制!`);
        return;
    }

    if (window.location.href.match('cloud.tencent.com/developer/article/')) {
        while (!document.querySelector('.toggle-link')) await sleep(1000);
        document.querySelector('.toggle-link').click();
        return;
    }

    if (window.location.href.match(/elecfans.com/)) {
        addStyle(`.seeHide_new_login_box{height: auto !important; overflow: inherit !important;} .seeHide_new_login{display:none !important;}`);
        console.log(`[网页反隐形] 已解除文章阅读限制!`);
        return;
    }

    if (window.location.href.match(/developer.aliyun.com\/article\/\d+/)) {
        addStyle(`.article-hide-content{height: auto !important;} .article-hide-box{display:none !important;}`);
        console.log(`[网页反隐形] 已解除文章阅读限制!`);
        return;
    }

    if (window.location.href.match(/v2rayssr.com/)) {
        addStyle(`.mask{display: none !important;}`);
        console.log(`[网页反隐形] 已解除网页阅读限制!`);
        return;
    }

    if (window.location.href.match(/it1352.com/)) {
        addStyle(`.arc-body-main-more{display: none !important;} .arc-body-main{ height: auto !important;}`);
        console.log(`[网页反隐形] 已解除网页阅读限制!`);
        return;
    }

    // 解除iframe覆盖方式屏蔽显示的网页
    var iframeClosed = document.querySelector('iframe[src="/close.html"]');
    if (iframeClosed) {
        iframeClosed.style.display = 'none';
        document.querySelector('div[style="display:none;"]').style = '';
        console.log(`[网页反隐形] 已解除网页阅读限制!`);
    }

    if (window.location.href.match(/discord.com\/channels/)) {
        addStyle(`[style*='overflow: hidden']{overflow: initial !important;}`);
        console.log(`[网页反隐形] 已修复滚动条错误!`);
        return;
    }
})();