// ==UserScript==
// @name                 disable auto scrolling for newBing
// @name:zh-CN           禁用newBing的自动滚动
// @description          disable newBing chat when scrolling back
// @description:zh-cn   禁用newBing聊天时滚动回去
// @version             1.0.0
// @match               *://www.bing.com/search*
// @run-at              document-start
// @license MIT
// @namespace https://greasyfork.org/users/562260
// @downloadURL https://update.greasyfork.org/scripts/461680/disable%20auto%20scrolling%20for%20newBing.user.js
// @updateURL https://update.greasyfork.org/scripts/461680/disable%20auto%20scrolling%20for%20newBing.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener("wheel", e => {
       if (e.target.className.includes("cib-serp-main")) e.stopPropagation();
    });
})();
