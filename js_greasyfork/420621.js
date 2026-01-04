// ==UserScript==
// @name         QQ 空间绕过 Flash 检测，避免 Flash 提示
// @namespace    https://iyn.me/use/qzone-flash-trick/
// @version      0.2
// @description  由于 Flash 被彻底移除，为避免 QQ 空间网页版提示需要 Flash：本脚本通过覆写 QQ 空间检测 Flash 版本函数，伪造版本/可用性，绕过 Flash 检测。
//               -------------
//               QQ 空间网页版使用某些功能（如插入相册图片）前会莫名检查 Flash 版本，但实际上这些功能并无 Flash 参与的痕迹（已 HTML5 化）。
//               以插入相册图片功能为例，在 iPad 浏览器环境则会跳过 Flash 检测，这也侧面说明了该功能实际上无需依赖 Flash。
//               本脚本只是欺骗 QQ 空间 Flash 可用，遇到确实需要 Flash 的功能（如上传视频），则无法避免地会出现功能失效。
//               所谓“避免 Flash 提示”是指：防止 QQ 空间某些功能（错误地）提示（页面提示）需要 Flash 而阻断使用或影响视觉；但浏览器依旧会提示页面尝试运行 Flash。
//               最后，欢迎您在使用本脚本的过程中随时反馈遇到的任何问题、异常或错误。
// @author       一年又一年
// @include      /^https://user\.qzone\.qq\.com/\d+/
// @match        https://user.qzone.qq.com/proxy/domain/qzs.qq.com/qzone/*
// @match        https://rc.qzone.qq.com/*
// @grant        none
// @compatible   chrome
// @compatible   firefox
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/420621/QQ%20%E7%A9%BA%E9%97%B4%E7%BB%95%E8%BF%87%20Flash%20%E6%A3%80%E6%B5%8B%EF%BC%8C%E9%81%BF%E5%85%8D%20Flash%20%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/420621/QQ%20%E7%A9%BA%E9%97%B4%E7%BB%95%E8%BF%87%20Flash%20%E6%A3%80%E6%B5%8B%EF%BC%8C%E9%81%BF%E5%85%8D%20Flash%20%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SCRIPT_NAME = '[QQ 空间绕过 Flash 检测]';
    const DEBUG_MODE = false; // 调试模式开关

    const doQzoneFlashBypassTrick = () => {
        window.QZFL.media.getFlashVersion = function () {
            // 伪造 Flash 版本：major: 32, minor: 0, rev: 0, add: 465
            window.QZFL.media._flashVersion = new window.QZFL.media.SWFVersion(32, 0, 0, 465);

            if (DEBUG_MODE) {
                // 调试模式下输出函数调用栈，可检视 Flash 检测调用位点。
                let e = new Error('检测位点/调用栈');
                e.name = SCRIPT_NAME;
                console.log(e);
            }

            return window.QZFL.media._flashVersion;
        };
    };

    // ========= 执行脚本并管理错误 ==========

    try {
        doQzoneFlashBypassTrick();
    } catch (e) {
        // 执行绕过脚本异常
        e.name = SCRIPT_NAME + ': ' + e.name;
        console.log('位于 window:', window, window.location, window.document);
        throw e;
    }

    // ========= 执行完成 =========

    console.log(SCRIPT_NAME + ':', '脚本已替换 QZFL.media.getFlashVersion() 函数。');
    if (DEBUG_MODE) {
        console.log('位于 window:', window, window.location, window.document);
    }
})();