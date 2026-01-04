// ==UserScript==
// @name         移除菜鸟教程广告
// @namespace    https://github.com/hayatesa
// @version      2.2
// @description  移除菜鸟教程悬浮按钮、广告、及右边导航菜单。
// @author       溶酶菌.
// @match        http://www.runoob.com/*.html
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/378097/%E7%A7%BB%E9%99%A4%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/378097/%E7%A7%BB%E9%99%A4%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    window.onload = resize;
    window.onresize = resize;

    function resize() {
        $('.middle-column').css('width', document.body.clientWidth > 769 ? '84%' : '100%').css('margin-right', '0');
    };

     function removeEls() {
        let selectors = ['.ad-box', '.ad-box-large', '.feedback-btn', '.fixed-btn'];
        selectors.forEach(slt => {
            $(slt).remove();
        });
    }
    resize();
    removeEls();

})();