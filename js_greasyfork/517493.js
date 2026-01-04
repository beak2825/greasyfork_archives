// ==UserScript==
// @name         自动点击下线及确认
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动点击下线按钮和随后出现的确认按钮，具有记忆功能。
// @author       YourName
// @match        *://*:8800/home*
// @match        *://*/8800/home*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517493/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E4%B8%8B%E7%BA%BF%E5%8F%8A%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/517493/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E4%B8%8B%E7%BA%BF%E5%8F%8A%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查本地存储中是否有脚本启动设置
    var autoStart = localStorage.getItem('autoStart') === 'true';

    // 创建对话框
    var dialog = document.createElement('div');
    dialog.innerHTML = `
        <div id="scriptDialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10000; background: white; padding: 20px; border: 1px solid #ccc;">
            <h2>自动点击下线按钮及确认</h2>
            <p>这个脚本将自动点击下线按钮和随后出现的确认按钮。</p>
            <label>
                <input type="checkbox" id="autoStartCheckbox" ${autoStart ? 'checked' : ''}> 自动启动
            </label>
        </div>
    `;
    document.body.appendChild(dialog);

    // 添加复选框事件监听
    document.getElementById('autoStartCheckbox').addEventListener('change', function() {
        autoStart = this.checked;
        localStorage.setItem('autoStart', autoStart);
        if (!autoStart) {
            dialog.style.display = 'none'; // 如果取消勾选，则隐藏对话框
        }
    });

    function startScript() {
        function clickConfirmButton() {
            var confirmButtons = document.querySelectorAll('button.btn.btn-warning');
            if (confirmButtons.length > 0) {
                confirmButtons[0].click();
            }
        }

        function clickOfflineButton() {
            var buttons = document.querySelectorAll('a.btn.btn-xs.btn-danger');
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].textContent.trim() === '下线') {
                    buttons[i].click();
                    setTimeout(clickConfirmButton, 500);
                    break;
                }
            }
        }

        for (var j = 0; j < 5; j++) {
            setTimeout(clickOfflineButton, 1000 * j);
        }
    }

    // 如果复选框被勾选，则自动启动脚本
    if (autoStart) {
        startScript();
    }
})();