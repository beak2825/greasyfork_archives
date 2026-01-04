// ==UserScript==
// @name         淘宝&天猫商品图片快捷复制
// @namespace    http://tampermonkey.net/
// @version      0.8.2
// @description  将商品图片拷贝到剪切板
// @author       lwj
// @match        *://detail.tmall.com/item*
// @match        *://item.taobao.com/item*
// @match        *://chaoshi.detail.tmall.com/item*
// @match        *://traveldetail.fliggy.com/item*
// @match        *://detail.tmall.hk/hk/item*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504484/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%95%86%E5%93%81%E5%9B%BE%E7%89%87%E5%BF%AB%E6%8D%B7%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/504484/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%95%86%E5%93%81%E5%9B%BE%E7%89%87%E5%BF%AB%E6%8D%B7%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    var notificationTimer; // 通知计时器
    var isHiding = false; // 标志，表示是否正在隐藏通知
  
    var notification_style = document.createElement('style');
    notification_style.type = 'text/css';
    notification_style.innerHTML = `
            @keyframes showNotification {
                0% {
                    transform: translateX(-50%) scale(0);
                }
                40% {
                    transform: translateX(-50%) scale(.96);
                }
                55% {
                    transform: translateX(-50%) scale(1.04);
                }
                100% {
                    transform: translateX(-50%) scale(1);
                }
            }
  
            @keyframes hideNotification {
                5% {
                    transform: translateX(-50%) scale(1);
                }
                100% {                
                    opacity: 0;
                    transform: translateX(-50%) scale(0.2);
                }
            }
  
            @keyframes notificationButtonAnimation {
                0% { transform: translateX(-50%) scale(1); }
                100% { transform: translateX(-50%) scale(1.15); opacity: 0;}
            }
  
            .notification {
                cursor: default;
                position: fixed;
                bottom: 60px; 
                left: 50%;
                background-color: rgba(233, 233, 233, .7);
                color: rgb(51, 51, 51);
                font-size: 16px;
                font-weight: 500;
                padding: 10px;
                border-radius: 12px;
                border: 1px solid rgba(173, 173, 173, .3);
                display: none;
                z-index: 9999999999;
                backdrop-filter: saturate(180%) blur(20px); /* 添加模糊效果 */
                -webkit-backdrop-filter: blur(20px); /* 兼容Safari浏览器 */
                transform-origin: center;
                width: auto; /* 默认宽度 */
                max-width: 68%;
                white-space: nowrap; /* 单行显示 */
                overflow: hidden; /* 超出内容隐藏 */
                text-overflow: ellipsis; /* 溢出省略号 */
                text-align: center; /* 文本居中显示 */
                transform: translateX(-50%); /* 初始水平居中 */
            }
            `;
    document.head.appendChild(notification_style);
  
    // 创建通知弹窗
    var NotificationContainer = document.createElement('div');
    NotificationContainer.classList.add('notification');
    NotificationContainer.id = 'showNotificationContainer';
    document.body.appendChild(NotificationContainer);
  
    // 添加鼠标悬浮和移出事件监听器
    NotificationContainer.addEventListener('mouseenter', function () {
        clearTimeout(notificationTimer); // 悬浮时清除计时器
        // console.log('Mouse entered notification'); // 调试日志
    });
    NotificationContainer.addEventListener('mouseleave', function () {
        // console.log('Mouse left notification'); // 调试日志
        var time = 3000;
        resetTimer(time); // 移出时重置计时器
    });
  
    function showNotification(message, duringTime = 3000, showImage = false) {
        // 清除之前的计时器
        if (notificationTimer) {
            clearTimeout(notificationTimer);
        }
  
        // 重置隐藏标志
        isHiding = false;
  
        // 重置通知样式
        NotificationContainer.innerHTML = '';
        NotificationContainer.style.width = 'auto';
        NotificationContainer.style.transform = 'translateX(-50%)';
        NotificationContainer.style.animation = 'none';
        NotificationContainer.style.padding = '10px';
  
        // 短暂移除并重新添加通知元素，强制触发动画
        document.body.removeChild(NotificationContainer);
        setTimeout(() => {
            document.body.appendChild(NotificationContainer);
  
            // 设置通知文本内容
            NotificationContainer.innerHTML = message;
  
            // 如果指定了显示图片，则读取剪贴板中的图片并显示
            if (showImage) {
                NotificationContainer.style.padding = '5px';
                navigator.clipboard.read().then(async function (data) {
                    for (const item of data) {
                        for (const type of item.types) {
                            if (type.startsWith('image/')) {
                                const blob = await item.getType(type);
                                const imageURL = URL.createObjectURL(blob);
  
                                const imageElement = document.createElement('img');
                                imageElement.src = imageURL;
                                imageElement.style.width = '300px';
                                imageElement.style.borderRadius = '8px';
  
                                const imageContainer = document.createElement('div');
                                imageContainer.style.paddingTop = '10px';
                                imageElement.style.maxWidth = 'auto';
                                imageContainer.style.borderRadius = '8px';
                                imageContainer.style.margin = 'auto';
                                imageContainer.style.display = 'block';
                                imageContainer.appendChild(imageElement);
  
                                NotificationContainer.appendChild(imageContainer);
  
                                // 图片加载完成后调整位置并设置消失定时器
                                imageElement.onload = function () {
                                    NotificationContainer.style.left = '50%';
  
                                    NotificationContainer.style.display = 'block';
                                    NotificationContainer.style.animation = 'showNotification 0.5s forwards';
                                    // 设置消失动画计时器
                                    resetTimer(duringTime);
                                };
  
                                break;
                            }
                        }
                    }
                }).catch(function (error) {
                    console.error('Error reading clipboard:', error);
                });
            } else {
                // 显示通知
                NotificationContainer.style.display = 'block';
                NotificationContainer.style.animation = 'showNotification 0.5s forwards';
  
                // 设置消失动画计时器
                resetTimer(duringTime);
            }
        }, 50); // 确保通知元素短暂移除再添加
    }
  
    function hideNotification() {
        if (isHiding) return;
        isHiding = true;
  
        NotificationContainer.style.animation = 'hideNotification 0.5s forwards';
  
        // 在动画结束后隐藏元素
        notificationTimer = setTimeout(function () {
            NotificationContainer.style.display = 'none';
            isHiding = false;
        }, 500);
    }
  
    function resetTimer(duringTime = 3000) {
        if (notificationTimer) {
            clearTimeout(notificationTimer);
            console.log("清除计时器");
        }
        if (duringTime > 0) {
            notificationTimer = setTimeout(function () {
                hideNotification();
                console.log("设置计时器");
            }, duringTime); // 3秒后自动隐藏通知
        }
    }
  
    /*
    淘宝、天猫主图复制到剪贴板功能
    */
    function createGetTmallPngButton() {
        // 找到匹配的元素的编号
        function findMatchingIndex(wrapperClass, imgClass) {
            for (let i = 0; i < wrapperClass.length; i++) {
                const wrapper = document.querySelector(wrapperClass[i]);
                if (wrapper) {
                    const img = wrapper.querySelector(imgClass[i]); // 找到图片元素
                    const button = wrapper.querySelector('#button_getTmallPngButton'); // 找到按钮元素
  
                    if (img && !button) {
                        return i; // 返回匹配的编号
                    } else {
                        return -1; // 如果按钮已存在，则返回 -1
                    }
                }
            }
            return -1; // 如果没有找到匹配的元素，则返回 -1
        }
  
  
        // 飞猪, 猫超天猫淘宝
        const wrapperClass = ['.item-gallery-top.item-gallery-prepub2', '[class*="mainPicWrap"]'];
        const imgClass = ['.item-gallery-top__img', '[class*="mainPic"]'];
       
        const matchingIndex = findMatchingIndex(wrapperClass, imgClass);
  
        if (matchingIndex !== -1) {
            addButton(wrapperClass, imgClass, matchingIndex);
            addButton(wrapperClass, imgClass, 0);
        } else {
            // console.error('Wrapper element not found.');
        }
  
        function addButton(wrapperClass, imgClass, matchingIndex) {
            const wrapper = document.querySelector(wrapperClass[matchingIndex]);
            console.log("wrapper:", wrapper);
  
            const old_button = wrapper.querySelector('#button_getTmallPngButton'); // 找到按钮元素
            if (old_button) {
                return; // 如果按钮已存在，则直接返回
            }
  
            if (wrapper) {
                const button = document.createElement('button');
                button.textContent = '复制图片';
                button.id = 'button_getTmallPngButton';
                button.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 5px 20px;
                    font-size: 16px;
                    background-color: rgba(22, 22, 23, .7);
                    color: #fff;
                    border: none;
                    border-radius: 999px;
                    font-family: AlibabaPuHuiTi_2_55_Regular;
                    backdrop-filter: saturate(180%) blur(20px); /* 添加模糊效果 */
                    -webkit-backdrop-filter: blur(20px); /* 兼容Safari浏览器 */
                    text-align: center; /* 文本居中显示 */
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.3s ease, color 0.15s ease, background-color 0.25s ease;;
                    z-index: 999;
                `;
  
                // 控制按钮显示
                wrapper.addEventListener('mouseenter', () => {
                    button.style.opacity = '1';
                });
  
                // 控制按钮隐藏
                wrapper.addEventListener('mouseleave', () => {
                    button.style.opacity = '0';
                });
  
                button.addEventListener('click', async () => {
                    const img = wrapper.querySelector(imgClass[matchingIndex]);
                    // console.log("img:", img);
                    if (img) {
                        try {
                            const imageUrl = img.src;
                            const response = await fetch(imageUrl);
                            const blob = await response.blob();
                            const image = new Image();
                            image.src = URL.createObjectURL(blob);
  
                            image.onload = () => {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                canvas.width = image.width;
                                canvas.height = image.height;
                                ctx.drawImage(image, 0, 0);
                                canvas.toBlob(async (blob) => {
                                    try {
                                        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                                        showNotification("图片已成功复制到剪贴板", undefined, true);
                                        button.textContent = '复制成功';
                                        button.style.backgroundColor = 'rgba(233, 233, 233, .7)'; // 按钮颜色改变
                                        button.style.color = '#000'; // 按钮文字颜色改变
  
                                        setTimeout(() => {
                                            button.textContent = '复制图片';
                                            button.style.backgroundColor = 'rgba(22, 22, 23, .7)'; // 按钮颜色恢复
                                            button.style.color = '#fff'; // 按钮文字颜色恢复
  
                                        }, 1500); // 1.5秒后恢复按钮文字
                                        // alert('Image copied to clipboard!');
                                    } catch (error) {
                                        console.error('Failed to copy image to clipboard:', error);
                                        // alert('Failed to copy image to clipboard.');
                                        showNotification('图片复制失败！');
                                    }
                                }, 'image/png');
                            };
                        } catch (error) {
                            showNotification('图片复制失败！');
                            console.error('Failed to fetch or process image:', error);
                            // alert('Failed to copy image to clipboard.');
                        }
                    } else {
                        // alert('Image not found!');
                    }
                });
  
                wrapper.style.position = 'relative'; // 确保按钮在图片上层
                wrapper.appendChild(button);
            }
        }
    }
  
    window.addEventListener('load', createGetTmallPngButton);
    const auxiliaryFunctions = new MutationObserver((mutationsList) => {
  
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                createGetTmallPngButton();
            }
        }
    });
  
    // 观察目标节点的子节点添加和移除
    auxiliaryFunctions.observe(document.body, { childList: true, subtree: true });
  })();
  