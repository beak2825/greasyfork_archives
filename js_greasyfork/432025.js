// ==UserScript==
// @name         知乎暗黑模式
// @namespace    undefined
// @version      0.1
// @description  自动运行知乎暗黑模式
// @author       fyang0728
// @match        *://*.zhihu.com/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432025/%E7%9F%A5%E4%B9%8E%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/432025/%E7%9F%A5%E4%B9%8E%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log(123);
    document.querySelector('html').dataset.theme = 'dark';

    // 选择需要观察变动的节点
    var targetNode = document.querySelector('html');

    // 观察器的配置（需要观察什么变动）
    var config = { attributes: true, childList: false, subtree: false };

    // 当观察到变动时执行的回调函数
    var callback = function (mutationsList, observer) {

        console.log('-------------元素观察者开始运行-------------');

        for (var mutation in mutationsList) {
            if (mutationsList[mutation].type === 'attributes') {
                if (
                    document.querySelector('html').getAttribute('data-theme') !== 'dark'
                ) {
                    console.log('这个' + mutationsList[mutation].attributeName + '属性被修改...');
                    document.querySelector('html').dataset.theme = 'dark';
                }
            }
        }
    };

    // 创建一个观察器实例并传入回调函数
    var observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    observer.observe(targetNode, config);
})();