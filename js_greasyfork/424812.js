// ==UserScript==
// @name         52 Auto Sign
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      unlicense
// @description  进入https://www.52pojie.cn/时自动签到
// @author       PRO-2684
// @icon         https://static.52pojie.cn/static/image/common/logo.png
// @icon64       https://static.52pojie.cn/static/image/common/logo.png
// @match        https://www.52pojie.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424812/52%20Auto%20Sign.user.js
// @updateURL https://update.greasyfork.org/scripts/424812/52%20Auto%20Sign.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var sign = document.querySelector("#um > p:nth-child(3) > a:nth-child(1) > img");
    if (sign){
        window.open('https://www.52pojie.cn/home.php?mod=task&do=apply&id=2','_self');
    };
})();