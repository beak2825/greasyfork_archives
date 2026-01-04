// ==UserScript==
// @name         覆盖 window confirm
// @namespace    http://play.sportsteam685.com
// @version      1
// @description  将 window confirm 覆盖为空功能
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466181/%E8%A6%86%E7%9B%96%20window%20confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/466181/%E8%A6%86%E7%9B%96%20window%20confirm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个新的 confirm 函数
    function newConfirm(message) {
        // 直接返回 false，表示用户点击了“取消”按钮
      console.log('覆盖confirm')
        return false;
    }

    // 将 window.confirm 更改为新的函数
    Object.defineProperty(window, 'confirm', {
        value: newConfirm
    });
})();