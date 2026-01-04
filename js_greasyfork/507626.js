// ==UserScript==
// @name         智能下单通知
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  获取位置后持续检测剪贴板变化，变化后复制单号到剪切板并点击对应按钮
// @match        *://www.jetcloud.vip/purchasing-system*
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/507626/%E6%99%BA%E8%83%BD%E4%B8%8B%E5%8D%95%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/507626/%E6%99%BA%E8%83%BD%E4%B8%8B%E5%8D%95%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 偏移量设置
    const OFFSET_X = 0;  // 水平偏移量
    const OFFSET_Y = 120;  // 垂直偏移量

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.key === 'm') {
            const selectedText = getSelectedText();
            if (selectedText) {
                const xpath = `//div[@id='imageWrapper' and .//span[contains(text(),'${selectedText}')]]`;
                const element = getElementByXPath(xpath);
                const sales = document.evaluate(`//div[@id='imageWrapper' and .//span[contains(text(),'${selectedText}')]]/div[1]/div[4]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.trim();
               // alert(sales)

                if (element) {
                    // 克隆元素并修改子节点的class
                    const popup = showElementInNewPopup(element);

                    // 获取新弹窗的位置并复制到剪贴板
                    const positionString = logPopupPosition(popup);

                    // 开始持续检测剪贴板变化
                    // 等待 1 秒后开始持续检测剪贴板变化
                    setTimeout(() => {
                        startClipboardChangeDetection(positionString, selectedText, sales, popup);
                    }, 1000);  // 1000 毫秒 = 1 秒
                } else {
                    console.log('未找到匹配的元素');
                }
            } else {
                console.log('未找到选中的文本');
            }
        }
    });

    // 获取用户选中的文本
    function getSelectedText() {
        const selection = window.getSelection();
        return selection ? selection.toString().trim() : '';
    }

    // 创建一个新的弹窗展示找到的元素并修改子节点class
    function showElementInNewPopup(element) {
        // 复制目标元素
        const elementClone = element.cloneNode(true);

        // 修改克隆的元素中第一个子节点的class
        updateFirstChildClass(elementClone);

        // 创建新的弹窗容器
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '0px';
        popup.style.left = '0px';
        popup.style.border = '2px solid black';
        popup.style.backgroundColor = 'white';
        popup.style.zIndex = '10000';  // 确保新弹窗在最前面
        popup.style.margin = '0';  // 无外边距
        popup.style.padding = '0';  // 无内边距
        popup.style.overflow = 'hidden';  // 无滚动条

        // 获取浏览器窗口的高度
        const windowHeight = window.innerHeight;

        // 获取元素的原始尺寸
        const originalWidth = element.offsetWidth;
        const originalHeight = element.offsetHeight;

        // 判断高度是否超出浏览器窗口，若超出则进行缩放
        let heightScale = 1;
        if (originalHeight > windowHeight) {
            heightScale = windowHeight / originalHeight * 0.9;  // 仅缩放高度，确保不超出窗口
        }

        // 设置弹窗的宽度保持不变，高度按比例调整
        popup.style.width = `${originalWidth + 200}px`;
        popup.style.height = `${originalHeight * heightScale + 20}px`;

        // 缩放克隆的元素高度
        elementClone.style.transform = `scale(1, ${heightScale})`;  // 仅缩放高度
        elementClone.style.transformOrigin = 'top left';  // 缩放原点为左上角
        popup.appendChild(elementClone);

        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '✖';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.background = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = 'black';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(popup);
        });
        popup.appendChild(closeButton);

        // 将新弹窗添加到页面
        document.body.appendChild(popup);

        // 返回新弹窗供后续使用
        return popup;
    }

    // 修改克隆元素的第一个子节点class
    function updateFirstChildClass(cloneElement) {
        const firstDiv = cloneElement.querySelector('div');  // 获取第一个 div 子节点
        if (firstDiv) {
            firstDiv.className = 'el-row';  // 更新 class 名
        }
    }

    // 获取新弹窗的位置并输出
    function logPopupPosition(popup) {
        const rect = popup.getBoundingClientRect();
        // 获取浏览器的缩放比例
        let zoomLevel = window.devicePixelRatio;
        const screenX = Math.round(rect.left + window.screenX + OFFSET_X);
        const screenY = Math.round(rect.top + window.screenY + OFFSET_Y);
        const screenRight = Math.round(rect.left + rect.width + window.screenX + OFFSET_X-460);
        const screenBottom = Math.round(rect.top + rect.height*zoomLevel + window.screenY + OFFSET_Y);

        const positionString = `${screenX},${screenY},${screenRight},${screenBottom}`;
        copyToClipboard(positionString);

        //console.log(`新弹窗位置 (相对于显示器): 左上角: (${screenX}, ${screenY}) 右下角: (${screenRight}, ${screenBottom})`);
        return positionString;
    }

    // 开始持续检测剪贴板变化
    function startClipboardChangeDetection(positionString, selectedText, sales, popup) {
        let initialClipboardContent = getClipboardText();
        const intervalId = setInterval(() => {
            const currentClipboardContent = getClipboardText();
            if ( currentClipboardContent !== positionString) {
                //console.log('剪切板内容发生变化：'+currentClipboardContent)
                clearInterval(intervalId);
                handleClipboardChange(selectedText, sales, popup);
            }
        }, 500);
    }

    // 处理剪贴板变化后的操作
    function handleClipboardChange(selectedText, sales, popup) {
        // 关闭弹窗
        document.body.removeChild(popup);

        // 复制单号到剪贴板
        const orderNumberText = `拍单号: ${selectedText} ;
${sales}`;
        copyToClipboard(orderNumberText);

        //console.log('新内容已复制到剪贴板:', orderNumberText);

        // 模拟点击按钮
        const buttonXPath = `//div[@id='imageWrapper' and .//span[contains(text(),'${selectedText}')]]/div/div/*[2]/*`;
        const buttonElement = getElementByXPath(buttonXPath);
        if (buttonElement) {
            if (typeof buttonElement.click === 'function') {
                buttonElement.click();
            } else {
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                buttonElement.dispatchEvent(event);
            }
            //console.log('已点击按钮');
        } else {
            console.log('未找到按钮元素');
        }
    }

    // 通过 XPath 获取第一个匹配的元素
    function getElementByXPath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // 将内容复制到剪贴板
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            //console.log('内容已复制到剪贴板！');
        } catch (err) {
            console.error('复制到剪贴板失败: ', err);
        } finally {
            document.body.removeChild(textarea);
        }
    }

    // 从剪贴板获取内容（使用隐藏的 textarea 作为回退方案）
function getClipboardText() {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.select();
    let clipboardContent = "无";
    try {
        // 尝试粘贴剪贴板内容
        if (document.execCommand('paste')) {
            clipboardContent = textarea.value.trim();
            // 如果粘贴后文本为空，可能是图片或其他非文本内容
            if (clipboardContent === "") {
                clipboardContent = "无";
            }
        }
    } catch (err) {
        console.error('获取剪贴板内容失败:', err);
    } finally {
        document.body.removeChild(textarea);
    }
    return clipboardContent;
}
})();