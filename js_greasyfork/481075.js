// ==UserScript==
// @name         Random Auto Refresh for labsafetest.uestc.edu.cn
// @namespace    http://your-namespace.example.com
// @version      0.1
// @license MIT
// @description  Automatically refreshes the page with a random interval between 1 and 4 minutes on labsafetest.uestc.edu.cn
// @author       You
// @match        https://labsafetest.uestc.edu.cn/redir.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481075/Random%20Auto%20Refresh%20for%20labsafetestuestceducn.user.js
// @updateURL https://update.greasyfork.org/scripts/481075/Random%20Auto%20Refresh%20for%20labsafetestuestceducn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 生成1到4分钟之间的随机间隔（以毫秒为单位）
    function getRandomInterval() {
        return Math.floor(Math.random() * (4 * 60 * 1000 - 1 * 60 * 1000 + 1)) + 1 * 60 * 1000;
    }

    // 设置定时器，每随机间隔刷新一次页面
    setInterval(function() {
        location.reload();
    }, getRandomInterval());
})();
