// ==UserScript==
// @name         去除elearning倒計時並自動勾選帶✔️選項
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  去除解答腳本的倒計時，並自動勾選帶✔️的選項
// @author       Shanlan
// @match        https://*.elearning.cht.com.tw/mod/quiz/attempt.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cht.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538877/%E5%8E%BB%E9%99%A4elearning%E5%80%92%E8%A8%88%E6%99%82%E4%B8%A6%E8%87%AA%E5%8B%95%E5%8B%BE%E9%81%B8%E5%B8%B6%E2%9C%94%EF%B8%8F%E9%81%B8%E9%A0%85.user.js
// @updateURL https://update.greasyfork.org/scripts/538877/%E5%8E%BB%E9%99%A4elearning%E5%80%92%E8%A8%88%E6%99%82%E4%B8%A6%E8%87%AA%E5%8B%95%E5%8B%BE%E9%81%B8%E5%B8%B6%E2%9C%94%EF%B8%8F%E9%81%B8%E9%A0%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 新增 eLearning答案顯示透明度 CSS
    const style = document.createElement('style');
    style.textContent = `
/* eLearning答案顯示透明度 */
.option-hint {
    opacity: .07!important;
}
/* eLearning答案滑鼠經過增加透明度 */
.formulation.clearfix:hover .option-hint {
    opacity: .5!important;
}
    `;
    document.head.appendChild(style);

    // 定義一個函數來移除 disabled 屬性
    function removeDisabledAttributes() {
        var inputs = document.querySelectorAll('input.mod_quiz-next-nav');
        inputs.forEach(function(input) {
            if (input.hasAttribute('disabled')) {
                input.removeAttribute('disabled');
            }
        });
    }

    // 定義一個函數來自動勾選帶✔️的選項
    function autoSelectCorrectOptions() {
        const options = document.querySelectorAll('sup.option-hint');
        options.forEach(function(optionHint){
            if(optionHint.textContent.trim() === '✔️'){
                let parent = optionHint.closest('div.r0, div.r1');
                if(parent){
                    let input = parent.querySelector('input[type="checkbox"], input[type="radio"]');
                    if(input && !input.checked){
                        input.click();
                    }
                }
            }
        });
    }

    // 2秒後移除 disabled 屬性
    setTimeout(removeDisabledAttributes, 2000);

    // 2秒後自動勾選帶✔️的選項
    setTimeout(autoSelectCorrectOptions, 2000);

})();
