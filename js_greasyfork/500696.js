// ==UserScript==
// @name         10086-fee-script
// @namespace    http://touch.10086.cn/
// @version      1.0.0
// @description  dynamic change the content of touch 10086 website.
// @author       cfz
// @match        https://touch.10086.cn/i/mobile/billqry.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @license      AGPL License
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/500696/10086-fee-script.user.js
// @updateURL https://update.greasyfork.org/scripts/500696/10086-fee-script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用MutationObserver观察DOM变化，确保页面所有元素加载完毕后再执行脚本逻辑
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 判断是否是元素节点
                        checkAndModifyElement(node);
                    }
                });
            }
        });
    });

    // 观察整个文档
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 检查并修改元素内容
    function checkAndModifyElement(node) {
        // 获取所有 class 为 "font-rose" 的元素
        const targetElements = $('.font-rose');

        // 遍历所有元素并修改其文本内容
        targetElements.each(function() {
            $(this).text(' 158.00');
        });

        // Modify the text of the element with class 'zd-names' containing '8元4G飞享套餐升级版' to '158元4G飞享套餐升级版'
        $('.zd-names:contains("8元4G飞享套餐升级版")').text('158元4G飞享套餐升级版');

        // Modify the text of elements within class 'fzs' from '8.00' to '158.00'
        $('.fzs').text('158.00');

        // Modify the text of elements within class 'fhs' from '8.00' to '158.00'
        $('.fhs').text('158.00');

        // 清空class="bl-arrearages"的所有内容
        $('.bl-arrearages').empty();

//         $('#zd-star').text('三星客户');

    }

})();