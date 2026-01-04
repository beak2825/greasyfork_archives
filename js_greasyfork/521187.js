// ==UserScript==
// @name         兰州工业学院 实验室安全考试系统刷时长
// @namespace    http://tampermonkey.net/
// @version      2024-12-01
// @description  刷时长
// @author       ONEX
// @match        https://v.lzit.edu.cn/https/*/redir.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lzit.edu.cn
// @grant        none
// @license           blessing
// @require           https://code.jquery.com/jquery-3.7.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/521187/%E5%85%B0%E5%B7%9E%E5%B7%A5%E4%B8%9A%E5%AD%A6%E9%99%A2%20%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F%E5%88%B7%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/521187/%E5%85%B0%E5%B7%9E%E5%B7%A5%E4%B8%9A%E5%AD%A6%E9%99%A2%20%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F%E5%88%B7%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(function () {
        console.log("以检测到页面")
        const url = window.location.href.replace(/\/[^/]*$/, '/')
        console.log(url)
        initInputBox()


        function initInputBox() {
            const floatingInputHtml = `
                <div class="floating-input">
                    <input type="number" id="floatingInput" placeholder="分钟数" />
                    <button id="floatingSubmit">开刷</button>
                </div>
            `;
            $('body').append(floatingInputHtml);
            // 添加 CSS 样式
            const floatingInputCss = `
                <style>
                    .floating-input {
                        position: fixed;
                        bottom: 20px; /* 距离底部 */
                        right: 20px;  /* 距离右侧 */
                        z-index: 9999;
                        background-color: #ffffff;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                        padding: 10px;
                        width: 150px;
                        display: flex; /* 启用 Flexbox 布局 */
                        justify-content: center; /* 水平居中 */
                    }

                    .floating-input input {
                        width: 80%;
                        padding: 5px;
                        margin-right: 10px;
                        border: 1px solid #ddd;
                        border-radius: 3px;
                    }

                    .floating-input button {
                        padding: 5px 10px;
                        background-color: #007BFF;
                        color: white;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                    }

                    .floating-input button:hover {
                        background-color: #0056b3;
                    }
                </style>
            `;
            $('head').append(floatingInputCss);
        }


        // 添加按钮点击事件
        $('#floatingSubmit').on('click', function () {
            const inputValue = $('#floatingInput').val();
            brushTime(url, inputValue)
            alert("完成")
        });

        /**
         * 刷时长
         * @param number 次数 一次30秒
         */
        function brushTime(url, number) {
            for (let i = 0; i < number*2; i++) {
                $.ajax({
                    url: `${url}/exam_xuexi_online.php?vpn-12-o2-lse.lzit.edu.cn=`,
                    data: {
                        "cmd": "xuexi_online"
                    },
                    type: 'POST',
                    success: function (resp) {
                        console.log(resp)
                    }
                })
            }

        }

    })
})();