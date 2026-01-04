// ==UserScript==
// @name         catmv_edit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  猫站删除种子简介中空行
// @author       You
// @match        https://pterclub.com/edit.php*
// @match        https://pterclub.com/details.php*
// @match        https://music.apple.com/*/search*&source_file_name
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pterclub.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517971/catmv_edit.user.js
// @updateURL https://update.greasyfork.org/scripts/517971/catmv_edit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href //网页url
    // 创建一个 URL 对象
    var urlObj = new URL(url);
    var params = new URLSearchParams(urlObj.search);
    var id = params.get('id');

    if (url.includes('https://pterclub.com/edit')){
        // 原提交按钮
        let srcButton = document.querySelector('#qr')
        // 原简介内容
        let srcStr = document.querySelector('textarea.bbcode.wysibb-texarea').value

        // 检查是否有空行
        if (srcStr.includes("[table][tr][td]\n")) {
            // 创建“修复空行”按钮
            let fixButton = document.createElement('button');
            fixButton.textContent = '修复空行';
            fixButton.style.marginRight = '10px';

            // 按钮事件：去除字符串的空行
            fixButton.addEventListener('click', function() {
                event.preventDefault(); // 防止默认行为
                event.stopPropagation(); // 阻止事件冒泡
                let newStr = srcStr.replace("[table][tr][td]\n","[table][tr][td]");
                document.querySelector('textarea.bbcode.wysibb-texarea').value = newStr;
                // alert('已去除空行');
            });

            // 将修复按钮插入到原提交按钮左侧
            srcButton.parentNode.insertBefore(fixButton, srcButton);
            let fix = params.get('fix');
            if(fix === "true"){
                fixButton.click();
                srcButton.click();
            }
        }
    }else if(url.includes('https://pterclub.com/details')){
        let img = document.querySelectorAll('img[src^="https://img.pterclub.com/images"]')[2]
        let isBr = false;
        let isD = false;
        // 检查目标 img 标签是否存在
        if (img) {
            // 获取 img 标签的上一个兄弟元素
            var previousSibling = img.previousElementSibling;

            // 判断上一个兄弟元素是否为 br 标签
            if (previousSibling && previousSibling.tagName.toLowerCase() === 'br') {
                console.log('上一个标签是 <br>');
                isBr = true;
            } else {
                console.log('上一个标签不是 <br>');
            }
        } else {
            console.log('没有找到匹配的 img 标签');
            isD = true
        }
        let mainTitle = document.querySelector("#top").innerText
        if (mainTitle && mainTitle.includes(".")){
            console.log("主标题中包含点")
        }else{
            console.log("主标题中不包含点")
        }
        if(isBr == true){
            // 创建一个按钮元素
            var button = document.createElement('button');
            button.innerText = 'Click Me!';

            // 应用样式
            button.style.position = 'fixed';
            button.style.top = '10%';
            button.style.right = '0';
            button.style.padding = '10px 20px';
            button.style.backgroundColor = '#EFF7FD'; // 使用漂亮的紫色背景
            button.style.color = '#ffffff'; // 白色文字
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            button.style.cursor = 'pointer';
            button.style.transition = 'background-color 0.3s, box-shadow 0.3s';

            // 添加悬停效果
            button.addEventListener('mouseover', function() {
                button.style.backgroundColor = '#3700b3';
                button.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)';
            });

            button.addEventListener('mouseout', function() {
                button.style.backgroundColor = '#6200ea';
                button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            });

            // 添加点击事件
            button.addEventListener('click', function() {
                console.log(id);
                window.location.href = 'https://pterclub.com/edit.php?id=' + id + '&fix=true';
            });

            // 将按钮添加到页面
            document.body.appendChild(button);
        }
    }
})();