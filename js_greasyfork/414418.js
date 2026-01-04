// ==UserScript==
// @name         小宇宙-inject-script
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       You
// @match        https://*.weibo.cn/*
// @match        https://*.weibo.com/*
// @match        https://weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414418/%E5%B0%8F%E5%AE%87%E5%AE%99-inject-script.user.js
// @updateURL https://update.greasyfork.org/scripts/414418/%E5%B0%8F%E5%AE%87%E5%AE%99-inject-script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    document.body.appendChild(document.createElement("app-root"));
    ['https://fy.arieleo.com/libs/styles.user.css',
        'https://fy.arieleo.com/libs/indigo-pink.css',
        'https://cdn.bootcdn.net/ajax/libs/material-design-icons/3.0.2/iconfont/material-icons.min.css'].forEach(link => {
            const linkElement = document.createElement("link");
            linkElement.rel = "stylesheet";
            linkElement.href = link;
            document.head.appendChild(linkElement);
        });

    ['https://fy.arieleo.com/libs/main-es2015.user.js',
        'https://fy.arieleo.com/libs/polyfills-es2015.user.js',
        'https://fy.arieleo.com/libs/runtime-es2015.user.js'].forEach(src => {
            const scriptElement = document.createElement("script");
            scriptElement.type = "module";
            scriptElement.src = src;
            document.body.appendChild(scriptElement);
        });
    ['https://fy.arieleo.com/libs/scripts.user.js',
    'https://fy.arieleo.com/libs/zone.min.js'].forEach(src => {
        const scriptElement = document.createElement("script");
        scriptElement.src = src;
        document.body.appendChild(scriptElement);
    });
})();