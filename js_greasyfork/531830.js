// ==UserScript==
// @name         学习通小助手
// @namespace    your-namespace
// @version      1.0.1
// @description  刷课小程序
// @match        *://*/*
// @icon         https://www.pngcdn.cn/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531830/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/531830/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 需要替换的目标图片地址（请修改为你的图片URL）
    const targetImage = 'https://free4.yunpng.top/2025/04/04/67efe1323e1e9.jpg';

    let autoChange = GM_getValue("autoChange", false);
    GM_setValue("autoChange", autoChange);

    // 替换现有图片
    function replaceImages() {
        document.querySelectorAll('img').forEach(img => {
            img.src = targetImage;
            // 可选：替换延迟加载图片的属性
            if(img.dataset.src) img.dataset.src = targetImage;
            img.style.objectFit = 'cover';    // 保持图片比例
            img.style.maxHeight = '100%';      // 限制最大宽度
            // 或者添加特定网站例外：
            // if (!location.hostname.includes('example.com')) {
            //     img.src = targetImage;
            // }
        });

        document.querySelectorAll('source').forEach(item => {
            item.srcset = targetImage;
        })

        document.querySelectorAll('div').forEach(item => {
            if(item.style.backgroundImage)  {
                item.style.backgroundImage = `url(${targetImage})`
                item.style.objectFit = "cover";
                item.style.maxHeight = "100%"
            }
        })
    }

    let switchMode = false

    const changeDom = () => {
        if(switchMode || autoChange){
            replaceImages();
        }
    }
    
    // // 初始化替换
    // replaceImages();
    
    // 监听DOM变化（应对动态加载的图片）
    const observer = new MutationObserver(changeDom);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 按钮点击事件
    const buttonClick = () => {
        switchMode = !switchMode;
        replaceImages(); 
        autoChange = true;
        GM_setValue("autoChange", true); // 保存到存储
        button.style.display = 'none';
    }


    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .custom-button {
            position: fixed !important;
            bottom: 0px !important;
            left: 10px !important;
            z-index: 9999 !important;
            color: white !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
            font-size: 14px !important;
            font-weight: bold !important;
            display: block;
            border: none !important;
            font-family: system-ui, sans-serif !important;
            transition: all 0.3s ease!important;
            background: #f1f1f1 url(https://free4.yunpng.top/2025/04/03/67eeae9e32c20.gif) no-repeat;
            height:362px;
            width: 288px;
            
        }

        .brand-login-close {
            width: 30px;
            height: 30px;
            position: absolute;
            top: 0px;
            right: 0;
            cursor: pointer;
            background:rgba(241, 241, 241, 0.65) url(https://free4.yunpng.top/2025/04/04/67eeb5fa49885.png) no-repeat;
            background-size: 50% 50%;
            background-position: center;
            transition: all 0.3s ease!important;
        }

        .brand-login-close:hover {
            width: 35px;
            height: 35px;
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
        }
    `;
    document.head.appendChild(style);

    // 按钮创建部分修改为
    const button = document.createElement('div');
    button.classList.add('custom-button');  // 添加CSS类
    const bodyDom = document.querySelector('body');
    const closeButton = document.createElement('p')
    closeButton.classList.add('brand-login-close')
    closeButton.addEventListener('click', buttonClick);
    // button.addEventListener('click', buttonClick);

    if(!autoChange){
        setTimeout(() => {
            bodyDom?.appendChild(button);
            button?.appendChild(closeButton)
        }, 1000);
    } else {
        replaceImages();
    }
})();