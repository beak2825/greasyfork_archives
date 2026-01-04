// ==UserScript==
// @name         Inject Ruffle (Flash Player)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动注入 Ruffle 脚本到网页中，让 Flash 内容可以运行
// @author       You
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532493/Inject%20Ruffle%20%28Flash%20Player%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532493/Inject%20Ruffle%20%28Flash%20Player%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建 <script> 标签
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@ruffle-rs/ruffle';
    script.async = true;

    // 加到页面中
    document.documentElement.appendChild(script);
})();