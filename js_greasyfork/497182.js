// ==UserScript==
// @name         访问码
// @namespace    http://tampermonkey.net/
// @version      V1.0.0
// @description  自动填充访问码
// @author       ZhaoTengchao
// @match        https://meta.iohubonline.club/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iohubonline.club
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497182/%E8%AE%BF%E9%97%AE%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/497182/%E8%AE%BF%E9%97%AE%E7%A0%81.meta.js
// ==/UserScript==
jQuery.noConflict();
(function($) {
    // 确保 jQuery 已加载
    if (typeof jQuery === 'undefined') {
        console.error('jQuery not found. This script requires jQuery.');
        return;
    }
    // 等待文档加载完毕后执行
    $(document).ready(function() {
        // 获取之前存储的数据
        const storedData = JSON.parse(localStorage.getItem('formData'));
        var floatingButtonText = "访问码";
        if (storedData) {
          floatingButtonText = "点击复制访问码"
        }
        // 创建悬浮按钮
        const floatingButton = $('<button>')
            .text(floatingButtonText)
            .css({
                position: 'fixed',
                bottom: '200px',
                right: '20px',
                padding: '10px',
                backgroundColor: '#f00',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                zIndex: '9999',

            })
            .appendTo('body'); // 使按钮可拖动并限制在窗口内

        // 点击按钮事件
        floatingButton.on('click', function() {
            if (storedData) {
                copyToClipboard(storedData.add)
            } else {
                createPopDialog();
            }
        });
        floatingButton.on('contextmenu', function(e) {
            e.preventDefault(); // 阻止默认的右键菜单
            createPopDialog();
        });
        var pressTimer;
        var longPressThreshold = 1000; // 长按的时间阈值（毫秒）
    });
    function createPopDialog() {
    // 创建弹窗
            const popup = $('<div>').css({
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '40px',
                backgroundColor: '#fff',
                border: '2px solid #ccc',
                borderRadius: '10px',
                width: '400px',
                height: '300px',
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between'
            });

            // 添加两个表单和按钮到弹窗
            const addInput = $('<textarea>').attr('placeholder', '待插入ID').css('margin-bottom', '20px').css('width','100%').css('height','30%').addClass('form-control');
            const buttonWrapper = $('<div>').css({display: 'flex', justifyContent: 'space-between', width: '100%'});
            const addButton = $('<button>').text('确定').addClass('btn btn-primary').css('width', '30%');
            const cancelButton = $('<button>').text('取消').addClass('btn btn-secondary').css('width', '30%');

            addButton.on('click', function() {
                // 存储输入的数据到数组中
                const addValue = addInput.val();
                const data = {
                    add: addValue
                };
                console.log(data);
                // 存储数据到 localStorage
                localStorage.setItem('formData', JSON.stringify(data));
                popup.remove(); // 移除弹窗
            });

            cancelButton.on('click', function() {
                popup.remove(); // 移除弹窗
            });
            // 获取之前存储的数据
            const storedData = JSON.parse(localStorage.getItem('formData'));
            if (storedData) {
                addInput.val(storedData.add); // 填充待插入ID文本框
            }

            // 将按钮添加到按钮容器内，并将容器添加到弹窗
            buttonWrapper.append(addButton, cancelButton);
            popup.append(addInput, buttonWrapper);
            $('body').append(popup);
    }
    function copyToClipboard(text) {
        // 创建一个临时的文本区域元素
        var $temp = $('<textarea>');
        $('body').append($temp);
        $temp.val(text).select();

        try {
            // 执行复制命令
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            showAlert('Copying ' + text + ' successful');
        } catch (err) {
            showAlert('Copying ' + text + 'failed');
        }

        // 移除临时的文本区域元素
        $temp.remove();
    }

     function showAlert(message) {
        // 或者使用自定义的提示框
        var $alertBox = $('<div></div>', {
            text: message,
            css: {
                position: 'fixed',
                top: '10px',
                right: '10px',
                padding: '10px',
                backgroundColor: '#5cb85c',
                color: 'white',
                borderRadius: '5px',
                zIndex: 10000,
            }
        });
        $('body').append($alertBox);
        setTimeout(function() {
            $alertBox.fadeOut('slow', function() {
                $(this).remove();
            });
        }, 2000);
    }
})(jQuery);