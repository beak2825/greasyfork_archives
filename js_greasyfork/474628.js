// ==UserScript==
// @name         执行js脚本
// @namespace    http://tampermonkey.net/
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @version      1.0
// @description  当按下快捷键Ctrl+P时，弹出一个输入框，输入JavaScript或jQuery脚本，点击确定后执行脚本,可用于重复输入，脚本执行工作
// @author       wll
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/471299-toastify-js/code/toastifyjs.js?version=1222923
// @resource     css2 https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/474628/%E6%89%A7%E8%A1%8Cjs%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/474628/%E6%89%A7%E8%A1%8Cjs%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // 检查是否按下Ctrl和P键
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault();

            // 提示输入脚本
            var script = prompt('请输入JavaScript或jQuery脚本：');
            if (script) {
                // 检查脚本语法
                try {
                    // 使用eval执行脚本
                    eval(script);
                } catch (error) {
                    // 提示语法错误
                    alert('脚本语法错误：' + error.message);
                    showtoastMessage('脚本语法错误：' + error.message);
                }
            }
        }
    });

    /**
     * 在页面右下角显示
     * @param msgText
     */
    function showtoastMessage(msgText){
        GM_addStyle(GM_getResourceText("css2"));
        Toastify({
            text: msgText,
            duration: 1500,
            newWindow: false,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    }
})();