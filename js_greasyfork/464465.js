// ==UserScript==
// @name         划词转语音播放
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  用于在浏览器中划词转语音播放的脚本，功能是在用户选中文本时，将选中的文本转换为语音并播放出来。脚本还包括了一些额外功能：1、可以通过点击菜单命令来开启或关闭脚本。2、可以使用快捷键Ctrl + Alt + o来开启脚本。3、在开启或关闭脚本时，会显示一个通知消息。4、开关选项设置记忆
// @author       wll
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      End-User License Agreement
// @downloadURL https://update.greasyfork.org/scripts/463798/%E5%88%92%E8%AF%8D%E8%BD%AC%E8%AF%AD%E9%9F%B3%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/463798/%E5%88%92%E8%AF%8D%E8%BD%AC%E8%AF%AD%E9%9F%B3%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isEnabled = GM_getValue('isEnabled', true); // 获取保存的开关状态，默认为开启

    // 注册菜单命令，用于开启或关闭脚本
    GM_registerMenuCommand("划词转语音播放 开/关", toggleScript);

    // 监听鼠标划词事件
    document.addEventListener('mouseup', function(event) {
        if (isEnabled) {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                var msg = new SpeechSynthesisUtterance(selectedText);
                window.speechSynthesis.speak(msg);
            }
        }
    });

    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.altKey && event.key === "o") {
            toggleScript(true);
        }
    });

    // 切换脚本状态
    function toggleScript(showNotification) {
        isEnabled = !isEnabled;
        GM_setValue('isEnabled', isEnabled);
        if (showNotification) {
            var message = isEnabled ? "划词转语音播放已开启" : "划词转语音播放已关闭";
            showMessageNotification(message);
        }
    }

    // 显示通知
    function showMessageNotification(message) {
        var notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#000';
        notification.style.color = '#fff';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-in-out';

        document.body.appendChild(notification);

        setTimeout(function() {
            notification.style.opacity = '1';
        }, 100);

        setTimeout(function() {
            notification.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
})();