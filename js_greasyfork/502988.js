// ==UserScript==
// @name         哔哩哔哩动态、私信回到过去
// @namespace    https://space.bilibili.com/314017356
// @version      3.0.3
// @description  抵抗万恶的opus新动态
// @author       清遥
// @match        https://www.bilibili.com/opus/*
// @match        https://message.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @compatible   Chrome
// @compatible   Edge
// @run-at       document-body
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502988/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8A%A8%E6%80%81%E3%80%81%E7%A7%81%E4%BF%A1%E5%9B%9E%E5%88%B0%E8%BF%87%E5%8E%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/502988/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8A%A8%E6%80%81%E3%80%81%E7%A7%81%E4%BF%A1%E5%9B%9E%E5%88%B0%E8%BF%87%E5%8E%BB.meta.js
// ==/UserScript==

(() => {
    const log = (msg) => console.log(`[脚本日志]: ${msg}`);

    // 动态添加样式
    const addCustomStyle = () => {
        GM_addStyle(`
            .custom-message-bg {
                background: url(//s1.hdslb.com/bfs/static/blive/blfe-message-web/static/img/infocenterbg.a1a0d152.jpg) top/cover no-repeat fixed !important;
            }
        `);
    };

    // 处理 Message 页
    const handleMessagePage = () => {
        if (!window.location.href.includes("index_new_sync")) {
            document.body.classList.add("custom-message-bg");
            log("已设置私信页面的自定义背景。");
        }
    };

    // 处理 Opus 页
    const handleOpusPage = () => {
        const observer = new MutationObserver(() => {
            const elements = document.getElementsByClassName("side-toolbar__btn");
            if (elements.length > 0) {
                elements[0].click();
                observer.disconnect();
                log("Opus 页面已回到旧版。");
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // 处理动态页面
    const handleDynamicPage = () => {
        document.cookie = "go-back-dyn=1";
        document.cookie = "opus-goback=1";
        log("已设置动态页面的回退 cookie。");
    };

    // 处理空间页
    const handleSpacePage = () => {
        document.cookie = "go-old-space=1";
        log("已设置空间页面的回退 cookie。");
    };

    // 主逻辑路由
    const route = () => {
        const url = window.location.href;
        log(`当前页面 URL: ${url}`);

        if (url.includes("message")) {
            handleMessagePage();
        } else if (url.includes("opus")) {
            handleOpusPage();
        } else if (url.includes("t.")) {
            handleDynamicPage();
        } else if (url.includes("space.")) {
            handleSpacePage();
        } else {
            log("未匹配的页面，脚本未执行任何操作。");
        }
    };

    // 初始化
    const init = () => {
        addCustomStyle(); // 添加样式
        route();          // 执行页面路由
    };

    init();
})();