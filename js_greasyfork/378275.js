// ==UserScript==
// @name         斋书苑
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  斋书苑自动书签
// @author       You
// @match        https://www.zhaishuyuan.com/chapter/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378275/%E6%96%8B%E4%B9%A6%E8%8B%91.user.js
// @updateURL https://update.greasyfork.org/scripts/378275/%E6%96%8B%E4%B9%A6%E8%8B%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.post("/ajax/user/",{action:"marks",shuid:escape(bid),zid:escape(zid)},function(result){console.log(result);});
    // Your code here...
})();