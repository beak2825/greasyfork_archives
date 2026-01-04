// ==UserScript==
// @name         淘宝获取评论图片
// @namespace    http://tampermonkey.net/
// @version      2024-07-11
// @description  淘宝天猫评论图片获取!
// @author       Ruindong
// @match        https://item.taobao.com/*
// @match        https://detail.tmall.com/*
// @icon         https://gw.alicdn.com/imgextra/i4/O1CN01H11jUw1gVppn3YjsM_!!6000000004148-2-tps-480-144.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500271/%E6%B7%98%E5%AE%9D%E8%8E%B7%E5%8F%96%E8%AF%84%E8%AE%BA%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/500271/%E6%B7%98%E5%AE%9D%E8%8E%B7%E5%8F%96%E8%AF%84%E8%AE%BA%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const imgsList= [];
    const getAllImgs = () => {
        document.getElementsByClassName('Comments--tagList--bAGGORJ')[0].children[1].click();
        setTimeout(() => {
            const dialogBox = document.getElementsByClassName('ShowButton--showButton--YUEsNpz')[0];
            if (dialogBox){
                dialogBox.click()
            } else {
                alert("评价数量太少")
            }
        }, 1000)
        setTimeout(() => {
            document.getElementsByClassName('Comments--tagList--bAGGORJ')[1].children[1].click();
        }, 1500)
        const timer = setInterval(() => {
            const dom = document.getElementsByClassName('Comments--comments--inymoD7');
            if (dom && dom[1]) {
                dom[1].scrollBy(0, 100);
            }
        }, 100)

        setTimeout(() => {
            clearTimeout(timer)
            var comments = document.getElementsByClassName('Comments--comments--inymoD7')[1];
            var imgs = comments.getElementsByTagName('img');
            Array.from(imgs).forEach(function(img) {
                if (img.src.indexOf('.webp') > 0) {
                    imgsList.push(img.src)
                }
            });
            const contentToCopy = document.querySelector('body').innerText; // 修改选择器以匹配你要复制的内容
            navigator.clipboard.writeText(imgsList.join('\n')).then(() => {
                alert('内容已复制到剪切板');
            }).catch(err => {
                alert('复制失败: ' + err);
            });
        }, 10000)
    }
    // 创建按钮
    const button = document.createElement('button');
    button.innerHTML = '获取评论图片';
    button.style.position = 'fixed';
    button.style.top = '100px';
    button.style.right = '50px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = '#ff6600';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // 将按钮添加到页面上
    document.body.appendChild(button);

    // 按钮点击事件
    button.addEventListener('click', () => {
        // alert('获取评论图片的功能尚未实现');
        // 在这里添加获取评论图片的逻辑
        getAllImgs()
    });
    // Your code here...
})();