// ==UserScript==
// @name         mytan一键清空对话
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the mytan!
// @author       ᶘ ᵒᴥᵒᶅ
// @match        https://mytan.maiseed.com.cn/chat/*
// @icon         https://mytan.maiseed.com.cn/assets/white-logo.png
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/481607/mytan%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA%E5%AF%B9%E8%AF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/481607/mytan%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA%E5%AF%B9%E8%AF%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        if (document.body) {
            var button = document.createElement('button');

            // 创建一个img元素
            var img = document.createElement('img');
            // 设置图片源为当前目录下的1.jpg
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAGTSURBVGiB7ZixTsMwEIY/B3Z4g3biOdK5BBbWqFIRyc4LtH0BdtoBocyd3M7Na8AEOwPsNGaghaqQkqRXokr3SZYs3+XOv2M7jkFRFEVRlPowuwg6Sqz/W/tVGKTSucQFDBM7A/wccxqFQUsynycZ7DaxffI7D+AvfMQQFWCgB+BgYKC1WoB01UcwZ3FGifWz7xFuLsqSpoHGov7q4G0t0RFwDODgGXhaC58uK3EY9Iv2qZSAYWJdGf+qGGgVXfClppCDQaUelSMts1tV2oVGifUdzBYBCo/WLuKILuI62HsBh9IBh/fTEzx37cDG4ekU4DaZtA0EZOYm6rQfJfOJvwHjuQtwsWfofiUxdMHFnzZZxAVkLsvdGDbZqrL3a0AF1I0KqBsV8COg8XJPrJtsVRH/EnvMx++YBnNnl21unt05j5cDsrF0PnEBl+H5AxCvtkWdswkwkc4FugbqZ+splIE/SuzfjjnPbns42lqAgZ6reNMgcbKrHEP6Bz8Kg0p92WoQ8q4Qy7KLK0dFURRFUf6DD0q0bxXJho3oAAAAAElFTkSuQmCC';
            // 设置图片样式，如尺寸等
            img.style.width = '24px'; // 举例，根据需要调整尺寸
            img.style.height = '24px';
            img.style.marginRight = '1px'; // 在图片和文字之间添加一些间隔
            img.alt = 'Icon'; // 设置备用文字

            // 在按钮文字前添加图片
            button.appendChild(img);
            button.appendChild(document.createTextNode('一键清空对话'));

            // ... (省略了样式和事件处理器的代码)

            // 设置按钮的样式
            button.style.position = 'fixed';
            button.style.bottom = '127px';
            button.style.right = '890px';
            button.style.padding = '8px 11px';
            button.style.fontSize = '1em';
            button.style.color = 'black';
            button.style.border = '1px solid #e4eaed';

            button.style.borderRadius = '4px';



            // 添加点击事件
            button.onclick = function() {
                if (confirm('是否删除本对话所有消息？')) {
                    var messageContainers = $('.message-container');
                    var currentIndex = 0;

                    function clickConfirmButton() {
                        var confirmButton = $('.ant-modal-content').find('.ant-modal-footer .ant-btn-primary:not(.ng-animating)');
                        if (confirmButton.length > 0) {
                            confirmButton.click();
                            console.log(confirmButton);
                            setTimeout(processNextMessageContainer, 0);
                        } else {
                            setTimeout(clickConfirmButton, 0);
                        }
                    }

                    function processNextMessageContainer() {
                        if (currentIndex < messageContainers.length) {
                            var element = messageContainers[currentIndex];
                            currentIndex++;

                            console.log(element); // 输出消息容器的代码

                            var deleteButtons = $(element).find('.message-content .message-main .message-btns .ng-star-inserted');
                            if (deleteButtons.length > 1) {
                                var deleteButton = deleteButtons.eq(1);
                                deleteButton.click();
                                setTimeout(clickConfirmButton, 0);
                            } else {
                                setTimeout(processNextMessageContainer, 0);
                            }
                        } else {
                            console.log('All message containers have been processed.');
                        }
                    }

                    processNextMessageContainer();
                } else {
                    console.log('Deletion cancelled by user.');
                }
            };



            // 将按钮添加到网页中
            document.body.appendChild(button);
        } else {
            console.log('The document.body does not exist yet.');
        }
    });
})();
