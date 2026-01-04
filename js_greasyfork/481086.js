// ==UserScript==
// @name         禁用弹窗
// @namespace    http://your-namespace.example.com
// @version      0.1
// @description  Automatically refreshes the page with a random interval between 1 and 4 minutes on labsafetest.uestc.edu.cn
// @author       You
// @match        https://labsafetest.uestc.edu.cn/redir.php*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481086/%E7%A6%81%E7%94%A8%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/481086/%E7%A6%81%E7%94%A8%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 重写 alert 函数，使其无操作
    window.alert = function() {};
    window.confirm = function() {};
    window.prompt = function() {};

    // 如果网站使用了其他弹窗方法，你可能需要重写这些方法
    // 例如：window.confirm = function() {}; 或 window.prompt = function() {};

})();
