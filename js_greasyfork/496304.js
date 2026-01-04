// ==UserScript==
// @name         去除百度AI回答
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  去除百度搜索的AI回答
// @author       husky180
// @match        https://www.baidu.com/s*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496304/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6AI%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/496304/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6AI%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let observer;
    setTimeout(() => {
        console.log("去除百度AI回答")
        let baiduList = document.getElementById("content_left").querySelectorAll('.result-op')
        baiduList.forEach(el => {
            el.style.display = 'none'
        })
    }, 0)
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            // 页面变为可见时重新启动观察器
            startObserving();
        } else if (!!observer) {
            // 页面不可见时停止观察器
            observer.disconnect();
            observer = null
        }
    });

    function startObserving() {

        // 选择需要观察变动的节点
        const targetNode = document.getElementById("content_left");

        // 观察器的配置（需要观察什么变动）
        const config = {
            childList: true,
            subtree: true
        };
        if (!!observer) {
            // 页面不可见时停止观察器
            observer.disconnect();
            observer = null
        }
        // 当观察到变动时执行的回调函数

        // 创建一个观察器实例并传入回调函数
        observer = new MutationObserver(onChangeFun);

        // 以上述配置开始观察目标节点
        observer.observe(targetNode, config);
    }

    function onChangeFun(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // 检查是否有我们关注的元素
                let baiduList = document.getElementById("content_left").querySelectorAll('.result-op')
                baiduList.forEach(el => {
                    el.style.display = 'none'
                })
            }
        }
    };

    startObserving();

    // 获取表单元素
    const form = document.getElementById('form');

    // 添加提交事件监听器
    form.addEventListener('submit', function (event) {

        setTimeout(() => {
            console.log("去除百度AI回答")
            let baiduList = document.getElementById("content_left").querySelectorAll('.result-op')
            baiduList.forEach(el => {
                el.style.display = 'none'
            })
        }, 1000)
    });
    // Your code here...
})();