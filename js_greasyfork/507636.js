// ==UserScript==
// @name        zuzhi
// @namespace   https://greasyfork.org/users/14059
// @description 强制跳转到发货页面（但登录页不跳）
// @version     0.14
// @match       *://*/*
// @author      setycyas
// @downloadURL https://update.greasyfork.org/scripts/507636/zuzhi.user.js
// @updateURL https://update.greasyfork.org/scripts/507636/zuzhi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const target = "https://www.taobaimei.com/thailand/deliver_order.php";
    const loginPage = "https://www.taobaimei.com/login/login.html";

    // 当前页面
    const url = location.href;

    // ⭐ 如果是登录页面 → 不跳转（避免无限循环）
    if (url.startsWith(loginPage)) {
        return;
    }

    // ⭐ 如果不是发货页面 → 跳转到 deliver_order.php
    if (!url.startsWith(target)) {
        location.replace(target);
    }

})();
