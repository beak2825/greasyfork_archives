// ==UserScript==
// @name         快速查看密码框
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  鼠标移动到密码框自动显示密码, 移出恢复.
// @author       felix
// @include      *
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/426654/%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B%E5%AF%86%E7%A0%81%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/426654/%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B%E5%AF%86%E7%A0%81%E6%A1%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var interval = setInterval(handle, 500)

    function handle() {
        clearInterval(interval)
        $("input:password").each((index, element) => {
            element.addEventListener("mouseover", function () {
                $(element).attr("type", "text");
            });
            element.addEventListener("mouseout", function () {
                $(element).attr("type", "password");
            });
        });
    }
})();