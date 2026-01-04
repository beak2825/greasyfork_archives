// ==UserScript==
// @name         🔥Insight News Hunter🏹（Beta）
// @version      2.3.1
// @description  🎉全新版本（2.3.1）🎉 | 🚀 内测版
// @namespace    http://dxy.cn/
// @author       DXY Insight FE
// @match        http*://*/*
// @exclude      http*://*.dxy.*/*
// @noframes
// @run-at       //context-menu
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @antifeature  tracking ==============>>> 说明：仅用于丁香园内网补录数据使用
// @note         21-10-20 v2.3.1 第二版发布，核心是解决了样式隔离，以及一些交互和bug
// @note         21-10-12 v2.2.x 第二版 Bate 测试
// @note         21-10-12 v2.1.x 第一版补充发布
// @note         21-09-27 v1.0.x 第一版发布
// @downloadURL https://update.greasyfork.org/scripts/433770/%F0%9F%94%A5Insight%20News%20Hunter%F0%9F%8F%B9%EF%BC%88Beta%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/433770/%F0%9F%94%A5Insight%20News%20Hunter%F0%9F%8F%B9%EF%BC%88Beta%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // if (location.href === "http://localhost:8080/") return;
    var script = document.createElement("script");
    // script.src = "http://localhost:8080/app.bundle.js";
    script.charset = "utf-8";
    script.src =
        "https://assets.dxycdn.com/gitrepo/insight-news-hunter_develop/dist/app.bundle.js?v=2.3.1";
    document.body.appendChild(script);

    // 测试代码
    (function () {
        const storageKeys = GM_listValues();
        const storageAll = getStorageByKeys(storageKeys);
        console.log("目前所有的本地缓存数据>>>", storageAll);
    })();

    // 变量名统一前缀
    const prefixMonkey = `monkey_`;

    // 发送给插件的 API，自己不应用
    const GM_API = {
        GM_registerMenuCommand: `${prefixMonkey}GM_registerMenuCommand`,
        GM_getValue: `${prefixMonkey}GM_getValue`,
    };

    // 统一管理 handle 处理（浏览器与插件同步）
    // 表示的是通过某个 GM_* API, 猴子与插件一起完成的事件
    const GM_HANDLE = {
        // 改变接口环境
        changeEnv: {
            name: "changeEnv",
        },
        // 用户登录
        loginDialog: {
            name: "loginDialog",
        },
        // 缓存，存
        setStorage: {
            name: "setStorage",
        },
        // 缓存，取
        getStorage: {
            name: "getStorage",
        },
        // 缓存，删
        removeStorage: {
            name: "removeStorage",
        },
    };

    // 给插件发送信息
    function createPostMessageEvent({ apiName, params = {} }) {
        const messageTxt = JSON.stringify({
            apiName,
            params,
        });
        window.postMessage(messageTxt, "*");
    }

    // API1：增加环境切换弹窗
    // NOTE 要区分正式版和测试版，所以不放在一起使用
    /* GM_registerMenuCommand("环境切换", () => {
        createPostMessageEvent({
            apiName: GM_API["GM_registerMenuCommand"],
            params: { type: GM_HANDLE.changeEnv.name },
        });
    }); */

    // API 2：增加登录弹窗
    GM_registerMenuCommand("用户登录", () => {
        createPostMessageEvent({
            apiName: GM_API["GM_registerMenuCommand"],
            params: { type: GM_HANDLE.loginDialog.name },
        });
    });

    // API 3:清空缓存
    GM_registerMenuCommand("清理缓存", () => {
        if (
            window.confirm(
                "这是个「危险」操作，将会清空本地缓存和重置状态。可能会影响您本地使用的记录和登录状态"
            )
        ) {
            const keys = GM_listValues();
            keys.forEach((key) => {
                GM_deleteValue(key);
            });

            const res = getStorageByKeys(GM_listValues());
            console.log("缓存清理成功， 现查询本地缓存结果为 >>>", res);
            alert(`缓存清理成功！`);
        }
    });

    // 一次拿到更多的缓存值
    function getStorageByKeys(keys) {
        const res = [];
        keys.map((key) => {
            res.push({ key, value: GM_getValue(key) });
        });

        return res;
    }

    window.onmessage = (event) => {
        var messageJSON;
        try {
            messageJSON = JSON.parse(event.data);
        } catch (zError) {
            // Do nothing
        }

        if (!messageJSON) {
            return;
        }

        const { apiName, params } = messageJSON;

        if (Object.keys(GM_API).some((name) => apiName === GM_API[name])) {
            return;
        }
        // console.log("messageJSON 猴子解析:", messageJSON);

        let value = null;
        switch (params?.type) {
            case GM_HANDLE.setStorage.name:
                GM_setValue(params.key, params.value);
                break;
            case GM_HANDLE.removeStorage.name:
                GM_deleteValue(params.key);
                break;
            case GM_HANDLE.getStorage.name:
                value = getStorageByKeys(params.key);
                if (!value) {
                    return GM_deleteValue(params.key);
                }
                createPostMessageEvent({
                    apiName: GM_API.GM_getValue,
                    params: {
                        type: GM_HANDLE.getStorage.name,
                        value,
                    },
                });
                break;
            default:
                // console.log("nothing", messageJSON);
                // do nothing
                break;
        }
    };
})();
