// ==UserScript==
// @name         RemoveCountdown
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  解除了按钮的禁用，取消了10s倒计时，自动页面跳转
// @author       BlueShootingStar
// @match        https://jwxk.shu.edu.cn/xsxk/profile/index.html?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522331/RemoveCountdown.user.js
// @updateURL https://update.greasyfork.org/scripts/522331/RemoveCountdown.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        const mybutton = document.querySelector('.el-button--primary.is-disabled');
            mybutton.removeAttribute('disabled');
            mybutton.classList.remove('is-disabled');
        const innerSpan = document.querySelector('div .dialog-footer span');
        innerSpan.textContent = '确定';
         innerSpan.click();
    }, 300);
})();