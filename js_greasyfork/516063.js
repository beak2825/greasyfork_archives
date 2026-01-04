// ==UserScript==
// @name         AGSV-Delete-Assistant
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  AGSV Delete
// @author       7oomy
// @match        *://*.agsvpt.com/details.php?id=*
// @match        *://*.agsvpt.com/edit.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agsvpt.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516063/AGSV-Delete-Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/516063/AGSV-Delete-Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var delete_reason = "应求"; // 删种原因
    var right_distance = "6%"; // 按钮拒右侧距离

    if (window.location.href.includes("details.php")) {
        // 添加删除按钮
        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = '删除';
        deleteButton.style.position = "fixed";
        deleteButton.style.width = "70px";
        deleteButton.style.height = "30px";
        deleteButton.style.background = "rgb(218, 230, 242)";
        deleteButton.style.cursor = "pointer";
        deleteButton.style.zIndex = "1";
        deleteButton.style.top = "50%";
        deleteButton.style.right = right_distance;
        deleteButton.style.borderRadius = "8px";
        deleteButton.style.display = "block";
        document.body.appendChild(deleteButton);

        // 删除按钮的点击事件
        deleteButton.addEventListener('click', function() {
            // 获取当前页面的ID参数，跳转到编辑页面
            let urlParams = new URLSearchParams(window.location.search);
            let id = urlParams.get('id');
            let hit = urlParams.get('hit');
            if (id && hit) {
                let editUrl = `https://www.agsvpt.com/edit.php?id=${id}`;

                // 在跳转前设置一个标记，表示是通过删除按钮跳转的
                localStorage.setItem('fromDeleteButton', 'true');

                // 跳转到编辑页面
                window.location.href = editUrl;
            }
        });

        // 监听快捷键 ALT + CTRL + 0
        window.addEventListener('keydown', function(event) {
            if (event.altKey && event.ctrlKey && event.key === '0') {
                // 阻止默认操作，防止快捷键冲突
                event.preventDefault();
                // 模拟点击删除按钮
                deleteButton.click();
            }
        });
    }

    // 检查当前页面是否为编辑页面，如果是则自动填写表单
    if (window.location.href.includes("edit.php")) {
        // 如果是通过删除按钮跳转的，执行自动填写和点击操作
        if (localStorage.getItem('fromDeleteButton') === 'true') {
             // 填写输入框和点击按钮
            console.log("================DOne=====================");
            let inputBox = document.querySelector("#outer > form:nth-child(7) > table > tbody > tr:nth-child(6) > td.rowfollow > input[type=text]")
            console.log(inputBox)
            let submitButton = document.querySelector("#outer > form:nth-child(7) > table > tbody > tr:nth-child(7) > td > input[type=submit]")

            if (inputBox && submitButton) {
                inputBox.value = delete_reason;
                submitButton.click();
            }

            // 操作完成后，清除本地存储的标记
            localStorage.removeItem('fromDeleteButton');
        }
    }
})();