// ==UserScript==
// @name         获取元素路径
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  获取符合天宫ui平台规范的元素路径
// @author       Mavis
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/472744/%E8%8E%B7%E5%8F%96%E5%85%83%E7%B4%A0%E8%B7%AF%E5%BE%84.user.js
// @updateURL https://update.greasyfork.org/scripts/472744/%E8%8E%B7%E5%8F%96%E5%85%83%E7%B4%A0%E8%B7%AF%E5%BE%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮按钮
    const floatingButton = document.createElement('button');
    floatingButton.textContent = 'Start';
    floatingButton.style.position = 'fixed';
    floatingButton.style.top = '20%';
    floatingButton.style.right = '20px';
    floatingButton.style.width = "90px"; //按钮宽度
    floatingButton.style.height = "80px"; //按钮高度
    floatingButton.style.zIndex = '999999999';
    floatingButton.style.background = 'rgba(144, 238, 144, 0.9)'; // 设置淡绿色背景
    floatingButton.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';

    // 创建用于显示提示的标签
    const notificationBox = document.createElement('div');
    notificationBox.style.position = 'fixed';
    notificationBox.style.top = '50%';
    notificationBox.style.left = '50%';
    notificationBox.style.transform = 'translateX(-50%,-50%)';
    notificationBox.style.padding = '10px 20px';
    notificationBox.style.background = 'rgba(0, 0, 0, 0.8)';
    notificationBox.style.color = '#fff';
    notificationBox.style.fontFamily = 'Arial, sans-serif';
    notificationBox.style.fontSize = '14px';
    notificationBox.style.borderRadius = '5px';
    floatingButton.style.zIndex = '999999999';
    notificationBox.style.transition = 'opacity 0.5s';
    notificationBox.style.opacity = '0';
    document.body.appendChild(notificationBox);

    // 添加按钮点击事件
    floatingButton.addEventListener('click', function() {
        // 在按钮被点击时执行的操作
        //alert('Button Clicked!');
        floatingButton.style.background = 'rgba(244, 100, 0, 0.9)'; // 设置淡绿色背景

        // 复制文本到剪贴板的函数
        function copyToClipboard(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);


            // 显示复制成功的提示
            notificationBox.textContent = '元素路径已复制';
            notificationBox.style.opacity = '1';
            setTimeout(() => {
                notificationBox.style.opacity = '0';
            }, 2000); // 2 秒后自动消失
        }

        document.addEventListener('click', function(event) {
            event.preventDefault(); // 阻止默认点击行为
            event.stopPropagation(); // 阻止事件继续传播，完全阻止点击事件的触发
            const clickedElement = event.target;
            let TagName
            let ClassName
            //判断当前元素是否有class，没有就找父元素的class
            if (clickedElement.classList.length !== 0) {
                TagName = clickedElement.tagName.toLowerCase();
                ClassName = clickedElement.className;
            }else{
                    const parElement = clickedElement.parentElement;
                    if (parElement && parElement.classList.length !== 0) {
                        TagName = parElement.tagName.toLowerCase();
                        ClassName = parElement.className;
                    }
            }
            const prePath = `${TagName}[class="${ClassName}"]`;

            // 获取所有具有prePath元素
            const allElements = document.querySelectorAll(prePath);

            let finalPath

            // 找到当前元素在符合条件的元素中的索引
            let currentIndex = 0;
            for (let i = 0; i < allElements.length; i++) {
                if(clickedElement.classList.length !== 0){
                    if (allElements[i] === clickedElement) {
                        currentIndex = i+1;
                        break;
                    }
                }else{
                    const parElement = clickedElement.parentElement;
                    if (allElements[i] === parElement) {
                        currentIndex = i+1;
                        break;
                    }
                    //console.log('111')
                }
            }

            if (currentIndex === 0) {
                finalPath = '//' + TagName + '[@class="'+ ClassName + '"]';
            }else{
                finalPath = '(//' + TagName + '[@class="'+ ClassName + '"])[' + currentIndex + ']';
            }

            if (finalPath) {
                //复制finalpath
                copyToClipboard(finalPath);
                //alert(`元素路径已复制`);

                // 创建显示 XPath 信息的标签
                const xpathInfo = document.createElement('div');
                xpathInfo.className = 'xpath-info-popup';
                xpathInfo.textContent = `XPath: ${finalPath}`;

                // 设置样式
                xpathInfo.style.position = 'fixed';
                xpathInfo.style.top = '50%';
                xpathInfo.style.right = '50%';
                xpathInfo.style.background = 'rgba(0, 0, 0, 0.8)';
                xpathInfo.style.color = '#fff';
                xpathInfo.style.padding = '2px 4px';
                xpathInfo.style.fontFamily = 'Arial, sans-serif';
                xpathInfo.style.fontSize = '12px';
                xpathInfo.style.zIndex = '999999999';

                // 添加标签到元素
                 document.body.appendChild(xpathInfo);

                // 点击其他地方时移除标签
                setTimeout(() => {
                     document.body.removeChild(xpathInfo);

                }, 10000);
            }
        //return false;
        })
    });

    // 将按钮添加到页面
    document.body.appendChild(floatingButton);
})();