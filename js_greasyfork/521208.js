// ==UserScript==
// @name         慕课复制题目
// @version      1.0.2
// @author       BaiLu
// @description  在慕课页面上添加一个按钮，用于复制题目文本到剪贴板。
// @license MIT
// @match        https://www.icourse163.org/*
// @grant        none
// @namespace https://greasyfork.org/users/1411786
// @downloadURL https://update.greasyfork.org/scripts/521208/%E6%85%95%E8%AF%BE%E5%A4%8D%E5%88%B6%E9%A2%98%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/521208/%E6%85%95%E8%AF%BE%E5%A4%8D%E5%88%B6%E9%A2%98%E7%9B%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';



    // 添加样式以显示按钮
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        #copyTextBtn {
            position: fixed;
            bottom: 70px;
            right: 20px;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transition: background-color 0.3s ease;
        }
        #copyTextBtn:hover {
            background-color: #0056b3;
        }
        #copyTextBtn:active {
            background-color: #004494;
        }
    `;
    document.head.appendChild(style);



    // 创建按钮并添加到页面，但只在特定域名下
    var btn = document.createElement('button');
    btn.id = 'copyTextBtn';
    btn.textContent = '慕课题目';
    document.body.appendChild(btn);

    // 定义复制文本到剪贴板的函数
    function copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function () {
                console.log('Text copied to clipboard');
            }).catch(function (error) {
                console.error('Could not copy text: ', error);
            });
        } else {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'Copied to clipboard' : 'Failed to copy';
                console.log(msg);
            } catch (err) {
                console.error('Could not copy text: ', err);
            }
            document.body.removeChild(textArea);
        }
    }

    // 为按钮添加点击事件
    btn.addEventListener('click', function () {
        let a = document.querySelectorAll(".u-questionItem")
        let b = ""
        a.forEach(i => {
            let s = i.querySelector(".u-icon-correct")
            if (!s) {
                b += i.innerText + "\n"
            } else {
                b += i.querySelector(".j-title").innerText + " "
                let s1 = i.querySelector(".choices.f-cb").querySelectorAll("li.f-cb")
                s1.forEach(ss => {
                    b += ss.innerText
                    if (ss.querySelector(".u-icon-correct")) {
                        b += "√ "
                    } else {
                        b += "x "
                    }
                })
            }
        })
        copyTextToClipboard(b);
    });

})();