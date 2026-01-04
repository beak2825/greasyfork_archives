// ==UserScript==
// @name         X.com Night Mode Cookie Setter
// @name:zh-CN   X.com 夜间模式 Cookie 设置脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Detect system color scheme and set night_mode cookie on X.com
// @description:zh-CN 自动检测系统配色方案并在 X.com 上设置 night_mode Cookie，确保主题与系统偏好一致。
// @author       You
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528416/Xcom%20Night%20Mode%20Cookie%20Setter.user.js
// @updateURL https://update.greasyfork.org/scripts/528416/Xcom%20Night%20Mode%20Cookie%20Setter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 matchMedia 检测系统主题
    function checkColorScheme() {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // 根据主题设置 cookie 值
        // 浅色 = 0, 深色 = 2
        const nightModeValue = isDarkMode ? 2 : 0;

        // 设置 cookie
        document.cookie = `night_mode=${nightModeValue}; path=/; domain=x.com; max-age=31536000`; // 有效期1年

        console.log(`System is in ${isDarkMode ? 'dark' : 'light'} mode. Set night_mode cookie to ${nightModeValue}`);
    }

    // 页面加载时执行
    window.addEventListener('load', checkColorScheme);

    // 当系统主题发生变化时重新检测
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkColorScheme);
})();