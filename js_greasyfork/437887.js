// ==UserScript==
// @name         蓝奏云盘增强
// @namespace    https://greasyfork.org/zh-CN/scripts/437887
// @version      0.1
// @description  蓝奏云盘个人中心隐藏充值遮罩
// @author       You
// @match        *://pc.woozooo.com/mydisk.php?item=profile&action=mypower
// @match        *://www.lanzou.com/mydisk.php?item=profile&action=mypower
// @icon         https://www.lanzou.com/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @homepageURL  https://greasyfork.org/zh-CN/users/859890
// @downloadURL https://update.greasyfork.org/scripts/437887/%E8%93%9D%E5%A5%8F%E4%BA%91%E7%9B%98%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/437887/%E8%93%9D%E5%A5%8F%E4%BA%91%E7%9B%98%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // $('#nopay').hide();
    var cover = document.getElementById('nopay');
    cover.style.display = 'none';
})();