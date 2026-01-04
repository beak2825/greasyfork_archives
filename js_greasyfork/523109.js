// ==UserScript==
// @name         MP4吧下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  MP4吧一键复制全集下载链接
// @author       psefgrep
// @match        https://www.c494.com/mp4/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/523109/MP4%E5%90%A7%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/523109/MP4%E5%90%A7%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建“下载解析”按钮并添加到页面
    const button = document.createElement('button');
    button.textContent = '一键复制所有下载链接';
    button.style.margin = '10px';
    button.style.float = 'left';
    button.style.width = '30%';
    button.style.backgroundColor = 'yellow';
    button.style.color = 'red';
    // 查找<ul class="bread-crumbs">元素
    const breadCrumbsUl = document.querySelector('ul.bread-crumbs');
    const liBack = document.querySelector('li.back');
    if (breadCrumbsUl && liBack) {
        //breadCrumbsUl.appendChild(button);
        breadCrumbsUl.insertBefore(button, liBack);
    }
    else{
        button.textContent = '下载解析失败';
    }
    //document.body.appendChild(button);

    button.addEventListener('click', function() {
        let links = [];
        // 选择所有class为down_list的div元素
        const downListDivs = document.querySelectorAll('div.down_list');
        for (const div of downListDivs) {
            // 在每个div下查找type为text的input元素
            const textInputs = div.querySelectorAll('input[type="text"]');
            for (const input of textInputs) {
                links.push(input.value);
            }
        }

        // 将收集到的链接拼接成文本
        const contentToCopy = links.length > 0? links.join('\n') : '未找到相关下载链接';
        // 使用navigator.clipboard API将内容复制到剪贴板
        if (navigator.clipboard) {
            navigator.clipboard.writeText(contentToCopy)
                .then(() => {
                console.log('内容已复制到剪贴板，可直接粘贴');
                button.textContent = '内容已复制到剪贴板，可直接粘贴';
            })
                .catch((err) => {
                console.error('复制到剪贴板失败: ', err);
                button.textContent = '复制到剪贴板失败';
            });
        } else {
            console.error('当前浏览器不支持navigator.clipboard API');
            button.textContent = '当前浏览器不支持navigator.clipboard API';
        }
    });
})();