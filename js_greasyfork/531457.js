// ==UserScript==
// @name         注入vue到智慧基建
// @namespace    http://tampermonkey.net/
// @version      20250401150633
// @description  进入系统后，三秒后注入devtools到vue
// @author       You
// @match        https://10-152-252-1-9fse9py3ym8010c.ztna-dingtalk.com/*
// @match        https://test1.gzztdh.com:9445/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ztna-dingtalk.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531457/%E6%B3%A8%E5%85%A5vue%E5%88%B0%E6%99%BA%E6%85%A7%E5%9F%BA%E5%BB%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/531457/%E6%B3%A8%E5%85%A5vue%E5%88%B0%E6%99%BA%E6%85%A7%E5%9F%BA%E5%BB%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.onload = function () {
        setTimeout(function () {
            // Your code here...
            try {
                const devtools = window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
                const Vue = $("#app")[0].__vue__.__proto__.__proto__.constructor;
                Vue.config.devtools = true;
                devtools.emit("init", Vue);
            } catch (e) {
                console.error(e)
            }
        }, 3000)
    }
})();