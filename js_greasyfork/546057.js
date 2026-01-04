// ==UserScript==
// @name         简书火狐优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用自定义UA的XHR请求图片+删除广告
// @match        https://www.jianshu.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546057/%E7%AE%80%E4%B9%A6%E7%81%AB%E7%8B%90%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/546057/%E7%AE%80%E4%B9%A6%E7%81%AB%E7%8B%90%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
// 配置参数
const CUSTOM_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 27194'; // 自定义User-Agent
const Attributes = ['src', 'data-src', 'data-original-src'];
function getImageSource(img) {
    for (let attr of Attributes) {
        const value = img.getAttribute(attr);
        if (value) {
            return value;
        }
    }
    return null; // 如果都没有找到有效的值
}
function errorhandle(event) {
    event.stopImmediatePropagation();
    const imgElement = event.target;
    replaceImageWithXHR(imgElement);
}
// 用XHR请求替换图片
function replaceImageWithXHR(imgElement) {
    const url = getImageSource(imgElement)
    imgElement.alt = "加载中..."
    console.log('检测到错误,正在加载图片:', url);

    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'User-Agent': CUSTOM_UA
        },
        responseType: 'blob',
        onload: function (response) {
            if (response.status === 200) {
                const blob = response.response;
                const imageUrl = URL.createObjectURL(blob);
                imgElement.src = imageUrl;
                console.log('图片替换成功:', url);
            } else {
                console.error('XHR请求失败:', response.status, url);
            }
        },
        onerror: function (error) {
            console.error('XHR请求错误:', error, url);
        }
    });
}
(function () {
    'use strict';

    // 使用 MutationObserver 监听新添加的图片
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 检查是否是元素节点
                        if (node.tagName === 'IMG') {
                            replaceImageWithXHR(node);
                            node.addEventListener('error', errorhandle, true);
                        }
                        // 如果是包含图片的容器，继续检查子元素
                        const imgs = node.querySelectorAll('img');
                        imgs.forEach(img => {
                            replaceImageWithXHR(img);
                            img.addEventListener('error', errorhandle, true);
                        });
                    }
                });
            }
        });
    });

    unsafeWindow.document.addEventListener('DOMContentLoaded', (event) => {
        const images = unsafeWindow.document.querySelectorAll('img');
        images.forEach(img => {
            replaceImageWithXHR(img);
            img.addEventListener('error', errorhandle, true);
        });
        if (unsafeWindow.location.href.includes("/p/")) {
            unsafeWindow.document.addEventListener('scroll', (event) => {
                event.stopImmediatePropagation();
                //屏蔽广告
            }, true);
        }
        const elementsWithClassA = document.querySelectorAll('.image-loading');

        elementsWithClassA.forEach(element => {
            element.classList.remove('image-loading');
        });//屏蔽他自己加载的脚本
        // 保存原始的 add 方法
        const originalAdd = unsafeWindow.DOMTokenList.prototype.add;

        // 重写 add 方法
        unsafeWindow.DOMTokenList.prototype.add = function (...classes) {
            // 检查是否包含 'a' 或 'b'
            const shouldBlock = classes.some(className =>
                className === 'image-loading' || className === 'image-view-error'
            );

            // 如果检测到 'a' 或 'b'，则不执行
            if (shouldBlock) {
                console.log('Blocked classList.add for classes:', classes);
                return; // 阻止执行
            }

            // 否则正常执行原始方法
            return originalAdd.apply(this, classes);
        };
        // 开始监听 DOM 变化
        observer.observe(unsafeWindow.document.body, {
            childList: true,
            subtree: true,
        });
    });

})();