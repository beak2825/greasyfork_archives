// ==UserScript==
// @name         hookaddress
// @namespace    http://tampermonkey.net/
// @description 模拟任何人的web3地址访问某些网站.
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476495/hookaddress.user.js
// @updateURL https://update.greasyfork.org/scripts/476495/hookaddress.meta.js
// ==/UserScript==

(function () {
    "use strict";

    console.log("hook address start");
    // 检查总开关状态
    let isEnabled = GM_getValue("isEnabled", false); // 默认关闭

    // 配置修改的值
    let customValue = GM_getValue(
        "customValue",
        "0xcf11e6d8522462dbd275cb6396471b0493cb763a"
    ); // 默认值为 "1"

    // 保存原始的 window.ethereum.request 方法
    const originalRequest = window.ethereum.request;

    // 定义一个新的 request 方法，用于拦截请求
    window.ethereum.request = function (options) {
        // 在这里可以添加你的拦截逻辑
        console.log("拦截到了请求：", options);

        // 如果总开关为关闭状态，不修改任何返回内容
        if (!isEnabled) {
            console.log("总开关已关闭，返回原始内容");
            return originalRequest(options);
        }

        // 如果请求的方法是 "eth_requestAccounts"
        if (options.method === "eth_requestAccounts") {
            // 修改返回内容为配置的 customValue
            const modifiedResult = [customValue];
            console.log("修改后的结果：", modifiedResult);
            return Promise.resolve(modifiedResult);
        } else {
            // 对于其他请求，调用原始的 request 方法并返回结果
            const originalPromise = originalRequest(options);
            return originalPromise;
        }
    };

    // 添加一个总开关的配置选项
    GM_registerMenuCommand("启用/禁用 模拟账号", function () {
        isEnabled = !isEnabled;
        GM_setValue("isEnabled", isEnabled);
        alert("模拟账号已" + (isEnabled ? "启用" : "禁用"));
    });

    // 添加一个配置 customValue 的选项
    GM_registerMenuCommand("模拟的地址", function () {
        const newValue = prompt("请输入新的模拟地址：", customValue);
        if (newValue !== null) {
            customValue = newValue;
            GM_setValue("customValue", customValue);
            console.log("模拟地址的值已更新为：" + customValue);
        }
    });

    // 现在 window.ethereum.request 方法已经被拦截了，并且可以根据总开关和配置的值进行修改

    //
})();
