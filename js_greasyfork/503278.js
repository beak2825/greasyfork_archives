// ==UserScript==
// @name         自己的互联网世界
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  根据自定义的规则屏蔽网页元素
// @author       jahv
// @match        *://*/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/503278/%E8%87%AA%E5%B7%B1%E7%9A%84%E4%BA%92%E8%81%94%E7%BD%91%E4%B8%96%E7%95%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/503278/%E8%87%AA%E5%B7%B1%E7%9A%84%E4%BA%92%E8%81%94%E7%BD%91%E4%B8%96%E7%95%8C.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 第一部分：定义
    const ruleSet = {
        "blog.csdn.net": {
            hideElement: [
                ".passport-login-container",
                ".wap-shadowbox",
                ".feed-Sign-weixin",
                "#operate",
                ".btn_open_app_prompt_div",
                ".open_app_channelCode",
                ".csdn-toolbar",
                "#recommend",
                ".aside-header-fixed"
            ],
        },
        "another-example.com": {
            hideElement: ".banner",
            customAction: () => {
                console.log("执行自定义操作");
            },
        },
    };

    // 第二部分：实现
    function applyRules() {
        const currentUrl = window.location.hostname;

        for (let urlPattern in ruleSet) {
            if (currentUrl.includes(urlPattern)) {
                const actions = ruleSet[urlPattern];
                for (let action in actions) {
                    if (action in actionHandlers) {
                        actionHandlers[action](actions[action]);
                    }
                }
                break;
            }
        }
    }

    // 操作集定义
    const actionHandlers = {
        hideElement: (selectors) => {
            selectors = typeof selectors === "string" ? [selectors] : selectors;
            const style = document.createElement("style");
            style.innerHTML = `${selectors.join(",")} { display: none !important; }`;
            document.head.appendChild(style);
        },
        customAction: (callback) => {
            if (typeof callback === "function") {
                callback();
            }
        },
    };

    // 执行规则匹配和操作
    applyRules();
})();
