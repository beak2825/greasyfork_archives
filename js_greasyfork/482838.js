// ==UserScript==
// @name        西南民大mycos一键评教
// @namespace   http://tampermonkey.net/
// @version     0.2
// @description 点击开始按钮自动开始评教，为评分安全起见，需要手动提交与翻页
// @author      CCFer/木山MUS
// @match       https://swun.mycospxk.com/*
// @license     GPL
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/482838/%E8%A5%BF%E5%8D%97%E6%B0%91%E5%A4%A7mycos%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/482838/%E8%A5%BF%E5%8D%97%E6%B0%91%E5%A4%A7mycos%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待1秒钟
    setTimeout(function() {
        var 等待AntDesign = setInterval(function() {
            // 替换成 Ant Design InputNumber 的正确类名或其他标识符
            var antInputNumbers = document.querySelectorAll('.ant-input-number-input');
            var radioGroups = document.querySelectorAll('.ant-radio-group');

            if (antInputNumbers.length > 0 && radioGroups.length > 0) {
                // 停止等待
                clearInterval(等待AntDesign);

                // 模拟点击每个 Ant Design InputNumber
                antInputNumbers.forEach(function(antInput) {
                    let input = antInput;
                    let lastValue = input.value;
                    input.value = antInput.getAttribute("max");
                    let event = new Event('input', { bubbles: true });
                    let trc = input._valueTracker;
                    if (trc) {
                        trc.setValue(lastValue);
                    }
                    input.dispatchEvent(event);
                });

                // 选择单选题的选项
                function Fill_it() {
                 var checkbox_list = document.querySelectorAll(".ant-radio-group");
                checkbox_list.forEach(function(group) {
                   var firstOption = group.querySelector(".ant-radio-input");
                   if (firstOption) {
                       firstOption.click();
                                     }
                                                          });
                    }
                Fill_it();
            }
        }, 100); // 每100毫秒检查一次
    }, 1000); // 一秒钟的延迟

    var refreshButton = document.createElement('button');
    refreshButton.textContent = '启动脚本';
    refreshButton.style.position = 'fixed';
    refreshButton.style.top = '10px';
    refreshButton.style.left = '50%';
    refreshButton.style.transform = 'translateX(-50%)';
    refreshButton.style.padding = '10px';
    refreshButton.style.cursor = 'pointer';
    refreshButton.style.zIndex = '9999';

    refreshButton.addEventListener('click', function() {
        location.reload();
    });

    document.body.appendChild(refreshButton);

})();
