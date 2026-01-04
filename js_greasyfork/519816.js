// ==UserScript==
// @name         GB688-DEBUG-TOOLS
// @namespace    http://tampermonkey.net/
// @version      2024-12-05
// @description  国标网调试工具箱 | 提供一些工具函数/能力
// @author       JoyofFire
// @match        http://c.gb688.cn/bzgk/gb/showGb*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gb688.cn
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519816/GB688-DEBUG-TOOLS.user.js
// @updateURL https://update.greasyfork.org/scripts/519816/GB688-DEBUG-TOOLS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 禁止图像被销毁
    Object.defineProperty(URL, "revokeObjectURL", {
        value: (url) => console.info(`data url 移除被拦截: ${url}`),
        configruable: false
    });
    console.info("URL.revokeObjectURL =", URL.revokeObjectURL);

    // 禁止反调试
    Object.defineProperty(window, "ConsoleBan", {
        value: {
            init: (options) => console.info(`trapped: ConsoleBan.init(${JSON.stringify(options)})`)
        },
        configruable: false,
        enumerable: true,
    });
    console.info("window.ConsoleBan =", window.ConsoleBan);
})();