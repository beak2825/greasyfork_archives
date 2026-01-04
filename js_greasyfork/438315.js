// ==UserScript==
// @name          mbbs360resize
// @namespace      https://greasyfork.org/zh-CN/users/135090
// @version        0.1
// @description    改变360论坛移动版的视图方便在PC上观看,因为PC版论坛经常导致浏览器卡死
// @author        zwb83925462
// @include       https://m.bbs.360.cn/
// @include       https://m.bbs.360.cn/*.html*
// @icon         http://360.cn/favicon.ico
// @license      CC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438315/mbbs360resize.user.js
// @updateURL https://update.greasyfork.org/scripts/438315/mbbs360resize.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("html").style.fontSize="4rem";
    if (location.pathname=="/category.html"){
        document.body.style.width="auto";
    }else{
        document.body.style.margin="0";
        document.querySelectorAll(".banner").forEach(function(i){i.remove()});
        document.querySelector("#js-tabList").style.width="auto";
    }
})();