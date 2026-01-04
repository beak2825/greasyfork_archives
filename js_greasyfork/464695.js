// ==UserScript==
// @name         HD Custom Log
// @namespace    http://tampermonkey.net
// @version      0.1
// @description  这个是用油猴脚本的开始，开启新天地
// @author       denglibing
// @match        https://juejin.cn/*
// @match        https://zhihu.com/*
// @icon         https://p3-passport.byteimg.com/img/user-avatar/35e31e38b45121054904c7d2be5fafca~100x100.awebp
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464695/HD%20Custom%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/464695/HD%20Custom%20Log.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("custom log");
    GM_log("GM Log");
    alert("Custom Log");
})();