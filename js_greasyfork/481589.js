// ==UserScript==
// @name         图怪兽去水印
// @namespace    https://yby6.com
// @version      0.1
// @description 去掉水印
// @author       杨不易呀
// @match        https://ue.818ps.com/*
// @match     *://*.818ps.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @antifeature referral-link 【应GreasyFork代码规范要求：含有优惠券查询功能的脚本必须添加此提示！在此感谢大家的理解...】
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481589/%E5%9B%BE%E6%80%AA%E5%85%BD%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/481589/%E5%9B%BE%E6%80%AA%E5%85%BD%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function () {

    function deleteElementsByClassName(className) {
        // 获取所有具有指定类名的元素
        const elements = document.querySelectorAll('.' + className);
           console.log(elements)
        // 遍历这些元素并删除它们
        elements.forEach(element => {
            element.parentNode.removeChild(element);
        });
    }

    // 设置定时器，定期检查并删除指定类名的元素
     deleteElementsByClassName('pageWidgetWrap');

    })();

})();
