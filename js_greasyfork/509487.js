// ==UserScript==
// @name         2024沈阳抗生素培训-自动签到
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  发布日期：2024年9月21日。针对沈阳医学会2024抗生素培训，自动点击签到按钮，但不能实现跳过或加速。
// @author       如花024
// @match        https://hylnwjpx.wsglw.net/train/courseware/cc*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509487/2024%E6%B2%88%E9%98%B3%E6%8A%97%E7%94%9F%E7%B4%A0%E5%9F%B9%E8%AE%AD-%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/509487/2024%E6%B2%88%E9%98%B3%E6%8A%97%E7%94%9F%E7%B4%A0%E5%9F%B9%E8%AE%AD-%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定时检查签到按钮是否出现
    setInterval(function() {
        const signButton = document.querySelector('.signBtn');
        if (signButton) {
            signButton.click(); // 自动点击签到按钮
            console.log('签到按钮已被自动点击');
        }
    }, 1000); // 每秒检查一次
})();