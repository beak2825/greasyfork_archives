// ==UserScript==
// @name         起点modify
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  modify
// @author       You
// @match        *://*.qidian.com/chapter/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qidian.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519856/%E8%B5%B7%E7%82%B9modify.user.js
// @updateURL https://update.greasyfork.org/scripts/519856/%E8%B5%B7%E7%82%B9modify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 选择目标节点
    const targetNode = document.getElementById('reader');

    // 观察器的配置（需观察的变化类型）
    const config = {
        childList: true, // 观察子节点的变化
        subtree: true   // 观察后代节点
    };

    // 当观察到变化时执行的回调函数
    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (targetNode.querySelector('[title="关闭"]')) {
                let elementsWithTitleClose = targetNode.querySelector('[title="关闭"]');
                elementsWithTitleClose.click();
                observer.disconnect();
            }
        }
    };

    // 创建一个MutationObserver实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 使用配置对象启动观察器
    observer.observe(targetNode, config);

    // 稍后，你可以停止观察
    setTimeout(function() {
        observer.disconnect();

        clearReview();
    }, 3000);


    var clearReview = () => {
        let url = document.URL;
        let parts = url.split('/'); // 按照 '/' 分割字符串
        let result = parts[parts.length - 2]; // 获取倒数第二部分
        console.log(result); // 输出: 768358774
        let novel = document.querySelector('#c-'+result);

        let reviewContents = novel.querySelectorAll('.review-content');

        // 遍历这些元素并逐个移除
        reviewContents.forEach(function(element) {
            element.parentNode.removeChild(element);
        });

        let reviews = novel.querySelectorAll('* .review');

        // 遍历这些元素并逐个移除
        reviews.forEach(function(element) {
            element.parentNode.removeChild(element);
        });
    }

    // Your code here...
})();