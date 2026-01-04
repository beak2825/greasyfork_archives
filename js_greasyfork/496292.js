// ==UserScript==
// @name         【停用通知】视频学习辅助脚本
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  此脚本仅用于提示旧版脚本已停止维护，请卸载相关辅助脚本以确保账号安全。
// @author       izlx
// @match        *://www.0755tt.com/video*
// @match        *://www.0755tt.com/FE/player*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/496292/%E3%80%90%E5%81%9C%E7%94%A8%E9%80%9A%E7%9F%A5%E3%80%91%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/496292/%E3%80%90%E5%81%9C%E7%94%A8%E9%80%9A%E7%9F%A5%E3%80%91%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 弹窗提示内容
    const message = `【重要通知】

您正在使用的视频辅助脚本已永久停止维护。

由于目标网站已启用高精度的作弊检测机制（特别是针对倍速播放的检测），继续使用任何自动化脚本都可能导致您的账号被标记或封禁。

为了您的账号安全，请立即卸载此脚本和任何其他版本的辅助脚本。

感谢您的理解。`;

    // 页面加载后立即弹出提示
    alert(message);
})();