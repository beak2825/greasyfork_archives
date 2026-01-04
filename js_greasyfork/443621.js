// ==UserScript==
// @name         gitee codes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  开启gitee codes
// @author       You
// @match        https://gitee.com/*
// @icon         https://gitee.com/assets/favicon.ico
// @grant        none
// @license      Apache 2
// @downloadURL https://update.greasyfork.org/scripts/443621/gitee%20codes.user.js
// @updateURL https://update.greasyfork.org/scripts/443621/gitee%20codes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(() => {
        let parent = $(".ui.secondary.pointing.menu");
        if (parent != null && parent.children().length > 0) {
            let first = $(parent.children()[0]).text();
            if(first == "\n概览\n") {
                let arr = location.pathname.split("/");
                let active = arr.length == 3 && arr[2] == "codes";
                $(".ui.secondary.pointing.menu").append(`
<a class="item project ${active? "active":""}" href="/${arr[1]}/codes"><i class="iconfont icon-code"></i>
codes
</a>
`)
            }
        }
    });

    // Your code here...
})();