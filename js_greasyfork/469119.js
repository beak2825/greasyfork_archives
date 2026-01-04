// ==UserScript==
// @name         TRON-半自动
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  自动填充地址，自动提交领币，你需要验证图片验证码
// @license      MIT
// @author       E·T
// @match        https://nileex.io/join/getJoinPage
// @icon         https://nileex.io/static/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/469119/TRON-%E5%8D%8A%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/469119/TRON-%E5%8D%8A%E8%87%AA%E5%8A%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    function resetTitleText() {
        const lg_12 = document.getElementsByClassName("col-lg-12");
        const title = lg_12[0];
        const inputEle = lg_12[1];
        if (title) {
            title.innerHTML = `
                <div class="section-title text-center">
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <h1 class="text-center">脚本已过期！请更新至 0.2.3 版本</h1>
                    <br>
                    <p>最新脚本地址：<a target="_blank" href="https://gist.github.com/tqtvjd/8b1db1ba10d2f16fbedd1aa2bd37d0cd/raw/2be482af4bc2d4fd4f43aed3439ebc99b5b63c48/Tron-script.user.js">点击去安装</a> </p>
                    <br>
                    <br>
                </div>
            `;
        }
        if(inputEle) {
            inputEle.innerHTML = '';
        }
    }

    function removeSiblingsExcept(id) {
        let element = document.getElementById(id);
        if (!element) return;

        let siblings = Array.from(element.parentNode.children);
        siblings.forEach(function (sibling) {
            if (sibling !== element) {
                sibling.parentNode.removeChild(sibling);
            }
        });
    }

    removeSiblingsExcept('contact1');
    resetTitleText();
})();