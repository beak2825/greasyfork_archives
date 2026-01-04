// ==UserScript==
// @name         控制页面
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  防止小孩偷偷看视频专用😂😂😂😂😂,可能会对部分页面有一定的影响
// @author       Sharkor
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vrmoo.net
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js

// @downloadURL https://update.greasyfork.org/scripts/469132/%E6%8E%A7%E5%88%B6%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/469132/%E6%8E%A7%E5%88%B6%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        $("video").remove();
    },1000);
})();