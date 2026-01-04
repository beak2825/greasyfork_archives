// ==UserScript==
// @name         shuke excel write
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  数科网页快捷填写-按照从页面识别出来的字段顺序从excel整行填入到input中
// @author       owell
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        *://*.igfax.net/*
// @match        *://*.igfax.com/*
// @exclude      https://jenkins-ci.igfax.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526350/shuke%20excel%20write.user.js
// @updateURL https://update.greasyfork.org/scripts/526350/shuke%20excel%20write.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加按钮
    $('body').append(`
    <style>
    .sk_shibie{
        border: 1px solid #ff0000;
        border-radius: 5px;
        color: #ff0000
    }
    </style>
        <div style="position:fixed; bottom:20px; left:20px; z-index:1000;">
            <button id="parseDom" style="background-color:#a385ea; color:white; border:none; border-radius:5px; padding:10px 15px; font-size:16px; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.3);">粘贴</button>
            <button id="indexDom" style="background-color:#007bff; color:white; border:none; border-radius:5px; padding:10px 15px; font-size:16px; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.3);">识别</button>
        </div>
    `);

    function getAllInputField(){
        return document.querySelectorAll('input:not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly])');
    }


    $('#indexDom').on('click', async function () {
        // 获取页面中所有的 input 元素
        var inputs = getAllInputField();
        // 将字段依次填入 input 元素中
        inputs.forEach((field, index) => {
            // 设置边框样式和圆角
            field.classList.add('sk_shibie');
            field.value = "字段"+index; // 填入值
        });
    });

    // 点击事件处理
    $('#parseDom').on('click', async function () {
        try {
            // 使用 navigator.clipboard.readText() 方法获取粘贴板的文本内容
            const clipboardText = await navigator.clipboard.readText();

            // 打印剪贴板内容到控制台
            console.log('Clipboard content:', clipboardText);

            // 按照制表符 \t 切割字符串
            var data = clipboardText.split('\t');

            // 获取页面中所有的 input 元素
            var inputs = getAllInputField();

            // 将字段依次填入 input 元素中
            inputs.forEach((field, index) => {
                if(field.classList.contains('sk_shibie')){
                    field.classList.remove('sk_shibie')
                    field.value = "";
                }
                if (data[index]) {
                    field.value = data[index]; // 填入值
                }
            });
        } catch (error) {
            // 处理错误
            console.error('读取剪贴板失败:', error);
            alert('错误：无法读取剪贴板。请检查权限或手动粘贴。');
        }
    });
})();