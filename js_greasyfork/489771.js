// ==UserScript==
// @name         Collecting Tickets
// @namespace    http://tampermonkey.net/
// @version      1.09
// @description  Collecting Tickets Automatically in Events
// @author       paladiny
// @license      MIT
// @match        https://www.managerzone.com/?p=event
// @icon         https://www.managerzone.com/favicon.ico?v2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489771/Collecting%20Tickets.user.js
// @updateURL https://update.greasyfork.org/scripts/489771/Collecting%20Tickets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("onload的时间：" + new Date());
    setTimeout(function() {
        console.log("timeout后的时间" + new Date());

        // 使用XPath表达式定位<span>标签
        var xpath = "//span[text()='Claim']";
        var result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var element = result.singleNodeValue;
        //console.log('预期值：Claim');

        // 判断element的值是否为Claim
        if (element !== null && element.innerHTML === 'Claim') {
            // 点击element
            //console.log("值一样：" + element.innerHTML);
            element.click();
            location.reload();
        } else {
            // 打印element的值
            //console.log("值不一样：" + element.innerHTML);
            location.reload();
        }
    }, 60000);
})();