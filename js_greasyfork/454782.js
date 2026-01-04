// ==UserScript==
// @name         usm disable
// @namespace    https://usm.minmaxtec.com/
// @version      0.1
// @description  对usm主机运维禁止自动退出
// @author       wangzhenlei
// @match        https://usm.minmaxtec.com/index.php/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minmaxtec.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454782/usm%20disable.user.js
// @updateURL https://update.greasyfork.org/scripts/454782/usm%20disable.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => console.log(1), 2000);
     clearInterval(check_login_id);
    setTimeout(function(){ location.reload(); }, 10*60*1000); // 10分钟 * 60秒/分钟 * 1000毫秒/秒
    // Your code here...
})();