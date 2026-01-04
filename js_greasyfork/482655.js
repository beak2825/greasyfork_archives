// ==UserScript==
// @name         A移除三方GPT授权弹窗
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  用于移除三方GPT授权弹窗
// @author       黑六网(blog.hi6k.com)
// @match        *
// @grant        GM_addStyle
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/482655/A%E7%A7%BB%E9%99%A4%E4%B8%89%E6%96%B9GPT%E6%8E%88%E6%9D%83%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/482655/A%E7%A7%BB%E9%99%A4%E4%B8%89%E6%96%B9GPT%E6%8E%88%E6%9D%83%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建对话框元素
    var dialog = document.createElement('div');
    dialog.id = 'my-dialog';
    dialog.innerHTML = ``;

    // 配置对话框样式
    GM_addStyle(`
   #my-dialog {
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      background-color: #fff;
      padding: 10px;
      border: 1px solid #ccc;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }`);

    // 显示对话框
    function showDialog() {
        dialog.classList.add('show');
    }

    function setClearDialog(){
        var count = 0;
        var interval = setInterval(function() {
            count++;
            if(count<=30){ //检测30次
                var modalContainer = $(".n-modal-container");
                if (modalContainer.length > 0) {
                    document.body.appendChild(dialog);
                    dialog.innerHTML = "<p>检测到已出现授权弹窗，检测了" + count + "次</p>";
                    document.addEventListener('DOMContentLoaded', showDialog);

                    // 使用 jQuery 删除 .n-modal-container 元素
                    modalContainer.remove();

                    // 停止循环检测
                    clearInterval(interval);
                }
            }else{
                clearInterval(interval);
            }
        }, 500);
    }

    document.onreadystatechange = function() {
        if (document.readyState === "complete") {
            setClearDialog();
            window.onhashchange = setClearDialog;

            setTimeout(function() {
                dialog.remove();
            }, 5000);
        }
    }
})();