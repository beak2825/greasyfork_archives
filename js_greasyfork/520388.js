// ==UserScript==
// @name         【测速网】去广告 Speedtest.cn
// @namespace    https://mdhyy.cn/
// @version      1.1
// @description  隐藏国产测速网的广告
// @author       明灯花月夜
// @match        https://www.speedtest.cn/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520388/%E3%80%90%E6%B5%8B%E9%80%9F%E7%BD%91%E3%80%91%E5%8E%BB%E5%B9%BF%E5%91%8A%20Speedtestcn.user.js
// @updateURL https://update.greasyfork.org/scripts/520388/%E3%80%90%E6%B5%8B%E9%80%9F%E7%BD%91%E3%80%91%E5%8E%BB%E5%B9%BF%E5%91%8A%20Speedtestcn.meta.js
// ==/UserScript==

(function() {
    'use strict';


  // 创建一个新的span元素
    var customTextSpan = document.createElement('span');
    customTextSpan.textContent = '801去广告版本'; // 设置要插入的文字
    customTextSpan.style.cssText = `
        color: white;        /* 文字颜色为白色 */
        font-size: 24px;     /* 文字大小为24像素 */
        font-weight: bold;   /* 文字加粗 */
        display: inline-block;
        text-align: center;  /* 文字居中 */
        margin: 0 auto;      /* 水平居中 */
        background-color: black; /* 背景灰色 */
        padding: 8px;        /* 内边距8像素 */
        border-radius: 4px;  /* 圆角边框 */
    `;

    // 获取页面中的标题元素（通常是h1）
    var titleElement = document.querySelector('h1');
    if (titleElement) {
        // 如果存在标题元素，则在其前面插入span元素
        titleElement.insertBefore(customTextSpan, titleElement.firstChild);
    } else {
        // 如果没有标题元素，则创建一个新的h1元素并插入到body的开始位置
        var newTitleElement = document.createElement('h1');
        newTitleElement.appendChild(customTextSpan);
        document.body.insertBefore(newTitleElement, document.body.firstChild);
    }



  // 创建样式
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        #dualPopup {
            position: fixed;
            top: 0px;
            right:0px;
            margin: 0px;
            padding: 10px;
            background-color: black;
            color: white;
            z-index: 9999;
            font-size: 16px;
            border-radius: 5px;
            max-width: 200px;
            word-wrap: break-word;
        }
    `;
    document.head.appendChild(style);

    // 创建弹窗
    var popup = document.createElement('div');
    popup.id = 'dualPopup';
    document.body.appendChild(popup);

     // 为弹窗添加点击事件
        popup.addEventListener('click', function() {
            var content = popup.textContent.replace('复制成功', '').replace('复制失败', '').replace(' ', '');
            copyToClipboard(content.trim().replace(' ', ''));
        });

    // 更新弹窗内容的函数
    function updatePopupContent(content1, content2) {
        popup.innerHTML =  content1 + '<br>' + content2;
    }
            updatePopupContent('下载：未测试','上传：未测试');


    // 观察元素的函数
    function observeElementChanges() {
        var targetElement1 = document.querySelector('#app > section > div.speed-home-warp > div.speed-home-content > div.speedtest-warp.speedtest-end-warp > div.speedtest-run.speed-end-wrap.add-speed-warp.speedup-speed-warp > div.speed-run-warp.speed-run-warp-border > div.transfer-warp > div.transfer-item.transfer-item-down > a > dl ');
        var targetElement2 = document.querySelector('#app > section > div.speed-home-warp > div.speed-home-content > div.speedtest-warp.speedtest-end-warp > div.speedtest-run.speed-end-wrap.add-speed-warp.speedup-speed-warp > div.speed-run-warp.speed-run-warp-border > div.transfer-warp > div.transfer-item.transfer-item-up > a > dl ');

        if (targetElement1 && targetElement2) {
            // 初始更新弹窗内容
                      updatePopupContent(targetElement1.textContent, targetElement2.textContent);


            // 创建MutationObserver实例并传入回调函数
            var observer1 = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'characterData') {
                        updatePopupContent(mutation.target.textContent, targetElement2.textContent);
                    }
                });
            });

            var observer2 = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'characterData') {
                        updatePopupContent(targetElement1.textContent, mutation.target.textContent);
                    }
                });
            });

            // 配置观察选项
            var config = { characterData: true, subtree: true };

            // 开始观察目标元素
            observer1.observe(targetElement1, config);
            observer2.observe(targetElement2, config);
        } else {
            // 如果元素不存在，稍后再次尝试
            setTimeout(observeElementChanges, 500);
        }
    }

    // 尝试观察元素
    observeElementChanges();

  // 复制到剪贴板的函数
    function copyToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            showSuccessMessage('复制成功');
        } catch (err) {
           showSuccessMessage('复制失败');
        }
        document.body.removeChild(textArea);
    }


 // 创建复制成功消息的弹窗
    var successPopup = document.createElement('div');
    successPopup.style.cssText = `
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: black;
        color: white;
        padding: 8px;
        border-radius: 4px;
        z-index: 10000;
        text-align: center;
    `;
    document.body.appendChild(successPopup);

    // 显示复制成功消息
    function showSuccessMessage(message) {
        successPopup.textContent = message;
        successPopup.style.display = 'block';
        setTimeout(function() {
            successPopup.style.display = 'none';
        }, 2000); // 显示2秒后消失
    }




 // List of selectors for the elements to hide
    const selectorsToHide = [
        '#app > section > div.wg > div.network-module',
        '#app > section > div.wg > div.b-content',
        '#app > section > div.wg > div:nth-child(3)',
        '#app > div.sus-window',
        '#app > section > div.container',
        '#app > footer',
        '#speedUpNotice',
        '#app > div.header-container',
        '#app > section > div.speed-home-warp > div.speed-home-content > div.speedtest-warp > div.speed-tisu-run-status',
        '#app > section > div.speed-home-warp > div.speed-home-content > div.speedtest-warp.speedtest-end-warp > div.pub-pop-box > div',
        '#app > section > div.speed-home-warp > div.speed-home-content > div.speedtest-warp.speedtest-end-warp > div.speedtest-run.speed-end-wrap.add-speed-warp.speedup-speed-warp > div.speed-run-warp.speed-run-warp-border > div:nth-child(2)',
        '#app > section > div.speed-home-warp > div.speed-home-content > div.speedtest-warp.speedtest-end-warp > div.speedtest-run.speed-end-wrap.add-speed-warp.speedup-speed-warp > div.speed-run-warp.speed-run-warp-border > div.mark_wrap',
        '#app > section > div.speed-home-warp > div.speed-home-content > div.speedtest-warp.speedtest-end-warp > div.speedtest-run.speed-end-wrap.add-speed-warp.speedup-speed-warp > div.gauge-warp > div.app-download-wrap',
        '#app > section > div.speed-home-warp > div.speed-home-content > div.speedtest-warp > div:nth-child(1) > div',
        '#app > section > div.speed-home-warp > div.speed-home-content > div.speedtest-warp > div.speed-tisu-run-status > div',
        '#app > section > div.speed-home-warp > div.speed-home-content > div.speedtest-warp.speedtest-end-warp > div.speedtest-run.speed-end-wrap.add-speed-warp.speedup-speed-warp > div.speed-run-warp.speed-run-warp-border > div:nth-child(2) > div',
        '#app > section > div.speed-home-warp > div.speed-home-content > div.speedtest-warp.speedtest-end-warp > div.account_wrap'
    ];

    // Function to hide elements by selectors
    function hideElements() {
        selectorsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.display = 'none'; // Hide each element
            });
        });
    }

    // Run the function when the document is fully loaded
    window.addEventListener('load', hideElements);

})();
