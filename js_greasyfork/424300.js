// ==UserScript==
// @name         取消远程图片本地化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   取消远程图片本地化123
// @author       You
// @match        http*://*/forum.php*
// @match        http*://*/thread-*.html
// @icon         https://www.google.com/s2/favicons?domain=ftv168.com
// @grant        none
// @require http://code.jquery.com/jquery-1.11.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/424300/%E5%8F%96%E6%B6%88%E8%BF%9C%E7%A8%8B%E5%9B%BE%E7%89%87%E6%9C%AC%E5%9C%B0%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/424300/%E5%8F%96%E6%B6%88%E8%BF%9C%E7%A8%8B%E5%9B%BE%E7%89%87%E6%9C%AC%E5%9C%B0%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("input[type='checkbox']").prop("checked",false);
})();