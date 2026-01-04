// ==UserScript==
// @name         SlideWordTimeConverter
// @namespace    Cocowwy
// @github       https://github.com/Cocowwy/Tampermonkey-Tools
// @version      0.1
// @description  滑词时间转换脚本
// @author       Cocowwy
// @license      MIT
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/524030/SlideWordTimeConverter.user.js
// @updateURL https://update.greasyfork.org/scripts/524030/SlideWordTimeConverter.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 监听 mouseup 事件，当用户松开鼠标时检查是否有文本被选中
    document.addEventListener('mouseup', function() {
        // 获取当前的选择对象
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            // 将选中的内容转换为字符串
            var selectedText = selection.toString().trim();
            var popup;
            var content;
            var isTimestamp = /^\d{13}$/.test(selectedText);
            var isDatetime = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(selectedText);

            if (isTimestamp) {
                // 处理 13 位时间戳
                var timestamp = parseInt(selectedText);
                var date = new Date(timestamp);
                content = date.getFullYear() + '-' +
                          ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                          ('0' + date.getDate()).slice(-2) + ' ' +
                          ('0' + date.getHours()).slice(-2) + ':' +
                          ('0' + date.getMinutes()).slice(-2) + ':' +
                          ('0' + date.getSeconds()).slice(-2);
            } else if (isDatetime) {
                // 处理日期时间字符串
                var date = new Date(selectedText);
                timestamp = date.getTime();
                content = timestamp.toString();
            }

            if (isTimestamp || isDatetime) {
                // 创建一个新的 div 元素作为弹出框
                popup = document.createElement('div');
                popup.className = 'timestamp-popup';
                popup.innerHTML = `
                    <div class="popup-content">
                        ${content}
                    </div>
                    <button class="copy-button">复制</button>
                `;

                // 添加关闭弹出框的功能
                popup.onclick = function(event) {
                    if (event.target!== this.querySelector('.copy-button')) {
                        document.body.removeChild(popup);
                    }
                };

                // 复制按钮的点击事件
                popup.querySelector('.copy-button').onclick = function(event) {
                    event.stopPropagation();
                    navigator.clipboard.writeText(content).then(function() {
                        console.log('复制成功');
                    }).catch(function(err) {
                        console.error('复制失败: ', err);
                    });
                };

                // 根据选中的文本位置定位弹出框
                var range = selection.getRangeAt(0).getBoundingClientRect();
                popup.style.left = (range.right + 10) + 'px';
                popup.style.top = range.top + 'px';

                // 将弹出框添加到页面的 body 元素中
                document.body.appendChild(popup);

                // x秒后自动关闭弹出框
                setTimeout(function() {
                    document.body.removeChild(popup);
                }, 2500);
            }
        }
    });
})();


// 添加样式
var style = document.createElement('style');
style.innerHTML = `
.timestamp-popup {
        position: fixed;
        background-color: white;
        border: 1px solid black;
        padding: 10px;
        z-index: 1000;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        min-width: 150px;
    }
.popup-content {
        margin-bottom: 5px;
    }
.copy-button {
        align-self: flex-end;
        padding: 5px 10px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 3px;
        cursor: pointer;
    }
.copy-button:hover {
        background-color: #e0e0e0;
    }
`;
document.head.appendChild(style);