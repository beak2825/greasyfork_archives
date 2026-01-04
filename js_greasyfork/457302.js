// ==UserScript==
// @name         稀土掘金重定向
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  跳过稀土掘金跳转提示
// @author       share121
// @match        https://link.juejin.cn/?*target=*
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457302/%E7%A8%80%E5%9C%9F%E6%8E%98%E9%87%91%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/457302/%E7%A8%80%E5%9C%9F%E6%8E%98%E9%87%91%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function () {
    "use strict";
    if (/target=([^&]+)/.test(location.search)) {
        location.href = decodeURIComponent(
            location.search.match(/target=([^&]+)/)[1]
        );
    }
})();
