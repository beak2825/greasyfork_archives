// ==UserScript==
// @name         Bilibli 隐藏大乱斗PK条
// @version      0.2
// @description  Bilibili 直播间隐藏大乱斗的 PK 条避免遮挡屏幕
// @author       albertz
// @include      /https?:\/\/live\.bilibili\.com\/[blanc\/]?[^?]*?\d+\??.*/
// @grant        none
// @run-at       document-idle
// @license      MIT License
// @grant        none
// @namespace https://greasyfork.org/users/665772
// @downloadURL https://update.greasyfork.org/scripts/406861/Bilibli%20%E9%9A%90%E8%97%8F%E5%A4%A7%E4%B9%B1%E6%96%97PK%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/406861/Bilibli%20%E9%9A%90%E8%97%8F%E5%A4%A7%E4%B9%B1%E6%96%97PK%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timerId = null;
    var attempts = 0;
    var MAX_TIMEOUT = 30 * 1000;

    function hidePkVm() {
        let chaosPkVm = document.getElementById('chaos-pk-vm');
        if (chaosPkVm) {
            // 考虑只隐藏 PK 条不隐藏结果？
            chaosPkVm.style.opacity=0;
            console.log("已关闭关闭大乱斗 PK 栏.");
        } else {
            let timeout = Math.min(MAX_TIMEOUT, ++attempts * 1000);
            console.log(`未找到大乱斗 PK 栏, ${timeout / 1000} 秒后尝试...`);
            timerId = setTimeout(hidePkVm, timeout);
        }
    }
    // let banners = document.getElementsByClassName("chaos-pk-banner");
    // if (banners && banners.length > 0) {
        // TODO 考虑非大乱斗时期休眠？
        console.log("尝试关闭大乱斗 PK...");
        hidePkVm();
    //} else {
    //    console.log("似乎是非大乱斗时期.");
    //    hidePkVm();
    //}
})();