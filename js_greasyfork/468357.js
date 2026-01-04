// ==UserScript==
// @name         Goole位置自动更新
// @namespace    http://tampermonkey.net/
// @version      0.5
// @icon  https://raw.githubusercontent.com/Twoandz9/Emby-icons/main/Icons3/Robot1.png
// @license      MIT
// @description  不断尝试更新位置，在Goole搜索框输入hello启动脚本，每10秒自动进行位置更新，请自行配合Location Gurad插件固定定位。
// @author       You
// @match        https://www.google.com/search?q=hello*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468357/Goole%E4%BD%8D%E7%BD%AE%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/468357/Goole%E4%BD%8D%E7%BD%AE%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        // 获取需要点击的元素
        let element = document.querySelector('update-location');

        // 检查元素是否存在
        if (element) {
            // 模拟用户点击
            element.click();
        } else {
            console.log('未找到元素');
        }
    }, 10000); // 10000毫秒，即每10秒执行一次

})();
