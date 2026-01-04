// ==UserScript==
// @name         屏蔽知乎的tardis
// @namespace    http://tampermonkey.net/
// @version      2024-01-31
// @description  try to take over the world!HAHA
// @author       You
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486099/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E7%9A%84tardis.user.js
// @updateURL https://update.greasyfork.org/scripts/486099/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E7%9A%84tardis.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function fk(){
    // 获取具有指定类名的元素集合
var elements = document.getElementsByClassName('result c-container xpath-log new-pmd');

// 遍历获取到的元素集合
for (var i = 0; i < elements.length; i++) {
    // 获取当前元素的 mu 属性值
    var muAttributeValue = elements[i].getAttribute('mu');
    // 检查 mu 属性值是否以指定字符串开头
    if (muAttributeValue.startsWith("https://www.zhihu.com/tardis/bd/")) {
        // 如果是，则移除该元素
        elements[i].remove();
    }
}
    }

setInterval(function() {
        fk();
    }, 5000);  // 每隔5秒执行一次 deleteAns()
    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                fk();
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    // Your code here...
})();