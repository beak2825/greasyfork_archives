// ==UserScript==
// @name         自动点击继续学习
// @namespace    1
// @version      0.1
// @description  0
// @author       vx:shuake345
// @match        *://lms.hactcm.edu.cn/venus/study/*
// @match        *://cjmanager.hactcm.edu.cn/*
// @grant        none
// @icon         https://cjfiles.hactcm.edu.cn/web-public-file/logo/ae6a31b8637444e8a44c8ecafe84daad.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515513/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/515513/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickContinueLearning() {
        // 查找包含“继续学习”的元素并点击
        let continueButton = Array.from(document.querySelectorAll('a'))
            .find(a => a.textContent.trim() === "继续学习");

        if (continueButton) {
            continueButton.click();
            console.log("点击了“继续学习”按钮");
        } else {
            console.log("未找到“继续学习”按钮");
        }
    }

    // 每隔10秒尝试点击“继续学习”按钮
    setInterval(clickContinueLearning, 10000);
})();
