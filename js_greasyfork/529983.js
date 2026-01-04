// ==UserScript==
// @name         干净的百度搜索
// @namespace    Erocats
// @version      2025-03-16
// @description  remove some uncomfortable elements in Baidu Search's homepage
// @author       Erocats
// @match        www.baidu.com
// @match        www.baidu.com/s*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kdocs.cn
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529983/%E5%B9%B2%E5%87%80%E7%9A%84%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/529983/%E5%B9%B2%E5%87%80%E7%9A%84%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Home Page
    if (location.href == 'https://www.baidu.com/') {
        const eles = []
        eles.push(document.querySelector('#s_mancard_main'));
        eles.push(document.querySelector('.new_search_guide_bub_container'))
        eles.push(document.querySelector('#s-top-left'))
        eles.push(document.querySelector('.s-top-right.s-isindex-wrap'))
        eles.push(document.querySelector('.s-bottom-layer-content'))
        eles.forEach(ele => {
            ele.remove();
        });
    }

    //检测搜索结果容器,防止新的广告插入

    const targetDiv = document.getElementById('content_left');

    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // 遍历新增的节点
                mutation.addedNodes.forEach((node) => {
                    // 这里设置条件，例如删除类名为 'to-remove' 的元素
                    if (node.classList && node.classList.contains('result')) {
                        node.parentNode.removeChild(node);
                        console.log('红颜试图插入广告,去你的')
                    }
                });
            }
        }
    });

    // 配置观察选项
    const config = { childList: true };

    // 开始观察目标 div 元素
    observer.observe(targetDiv, config);

    //Search Result
        if (location.href.indexOf('www.baidu.com/s') != -1) {
            const eles = document.querySelectorAll('._3rqxpq2')
            eles.forEach(ele => {
                ele.remove();
            });
            const results = document.querySelectorAll('.result-op, .result');
            results.forEach(ele => {
                ele.querySelectorAll('span, a').forEach((spanA) => {
                    if (spanA.innerText == '优质商家' || spanA.innerText == '广告') {
                        ele.remove();
                    }
                })
                if (ele?.querySelector('.pc-down_1c6jp')) {
                    ele.remove();
                }
            });
        }

    const search = document.querySelector('#su')
    search.addEventListener('click', () => {
        location.href = 'https://www.baidu.com/s?wd=' + document.querySelector('#kw').value
    })

})();