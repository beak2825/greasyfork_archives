// ==UserScript==
// @name         广二师随机教评
// @namespace    https://github.com/liyang8246
// @version      0.2
// @description  适用于广东第二师范学院新教务系统评教,在提交下有一随机按钮
// @author       LiYang
// @match        https://jwxt.gdei.edu.cn/*
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/499473/%E5%B9%BF%E4%BA%8C%E5%B8%88%E9%9A%8F%E6%9C%BA%E6%95%99%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/499473/%E5%B9%BF%E4%BA%8C%E5%B8%88%E9%9A%8F%E6%9C%BA%E6%95%99%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    window.onload = function() {
        var submitButton = document.querySelector('.ant-btn-primary');
        var submitButtonParent = submitButton.parentNode;
        var button = document.createElement("button");
        button.innerHTML = "<span>随机</span>";
        button.value = "large";
        button.className = "ant-btn";
        button.style.cssText = 'display: block; margin: 10px auto;';
        var event = new MouseEvent('click', {
            'bubbles': true,
            'cancelable': true
        });
        button.addEventListener("click", function() {
            var wrappers = document.querySelectorAll('.ant-form-item');
            wrappers.forEach(function(wrapper) {
                var inputs = wrapper.querySelectorAll('input');
                var input;
                var random = Math.random();
                if (random > 0.3) {
                    input = inputs[0];
                } else if (random > 0.05) {
                    input = inputs[1];
                } else {
                    input = inputs[2];
                }
                if (input) {
                    input.dispatchEvent(event);
                }
            });
        });
        submitButtonParent.insertBefore(button, submitButton.nextSibling);
    };
})();
