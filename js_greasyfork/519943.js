// ==UserScript==
// @name         方正教务系统自动评价
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动选择所有"很满意"
// @author       wyg
// @match        *://*edu.cn/jwglxt/*
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/519943/%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/519943/%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function selectVerySatisfied() {    
        console.log('开始执行')
        const radios = document.querySelectorAll('input.radio-pjf');
        console.log(`找到 ${radios.length} 个单选按钮。`);

        radios.forEach(radio => {
            console.log(`单选按钮 data-dyf: ${radio.getAttribute('data-dyf')}`);

            // 检查单选按钮的 data-dyf 属性是否为 '5'（表示“很满意”）
            if (radio.getAttribute('data-dyf') === '5') {
                radio.checked = true;
                console.log("单选按钮已设置为“很满意”。");
            }
        });
    }

    const observer = new MutationObserver(() => {
        selectVerySatisfied();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    selectVerySatisfied();
})();