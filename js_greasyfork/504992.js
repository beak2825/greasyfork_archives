// ==UserScript==
// @name               自研 - AcFun - 投稿页始终可滚动
// @name:en_US         Self-made - AcFun - Upload page always scrollable
// @description        监听 body 元素样式变化，有 style 参数就移除。
// @description:en_US  Listen for body style changes, and remove if present.
// @version            1.0.0
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://member.acfun.cn/
// @match              https://member.acfun.cn/upload-video
// @icon               https://member.acfun.cn/favicon.ico
// @run-at             document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/504992/%E8%87%AA%E7%A0%94%20-%20AcFun%20-%20%E6%8A%95%E7%A8%BF%E9%A1%B5%E5%A7%8B%E7%BB%88%E5%8F%AF%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/504992/%E8%87%AA%E7%A0%94%20-%20AcFun%20-%20%E6%8A%95%E7%A8%BF%E9%A1%B5%E5%A7%8B%E7%BB%88%E5%8F%AF%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义「移除器」函数。
    function remover() {

        // 定义「监听」变量。
        const observer = new MutationObserver(() => {

            // 如果 body 中有 style 元素参数就移除它。
            document.body.hasAttribute("style") ? document.body.removeAttribute("style") : null;

        });

        // 配置「监听」。在 body 元素的 style 参数有变化时执行回调。
        observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    };

    // 如果是投稿配置页就直接运行「移除器」；
    // 不然就定义「检查器」参数，如何页面路径变成了投稿配置页就运行「移除器」并停止「检查器」的循环。
    if(location.pathname === "/upload-video") {

        remover();

    }else {

        let checker = setInterval(() => {

            if(location.pathname === "/upload-video") {

                remover();
                clearInterval(checker);

            }

        }, 500);

    };

})();