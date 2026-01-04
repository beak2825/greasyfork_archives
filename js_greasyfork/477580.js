// ==UserScript==
// @name         translate网站提取匹配度最高内容
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动提取匹配内容!
// @author       yydny
// @match        https://web.expasy.org/translate/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=expasy.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477580/translate%E7%BD%91%E7%AB%99%E6%8F%90%E5%8F%96%E5%8C%B9%E9%85%8D%E5%BA%A6%E6%9C%80%E9%AB%98%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/477580/translate%E7%BD%91%E7%AB%99%E6%8F%90%E5%8F%96%E5%8C%B9%E9%85%8D%E5%BA%A6%E6%9C%80%E9%AB%98%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
let strContent = ''
let compareData = {}
let key = ''
// 上传文件
const fileInput = document.createElement('input');
const btn = document.createElement('button')
fileInput.type = 'file';
fileInput.id = 'my-file-input';
// 将新元素插入到现有元素之前
var existingElement = document.getElementById('translate_form');
var parentElement = existingElement.parentNode;
parentElement.insertBefore(fileInput, existingElement);
// document.body.pre(fileInput);
const localDate = JSON.parse(localStorage.getItem('compareDate'))
if (localDate) {
    for (let key in localDate) {
        console.log(key)
        console.log(localDate[key])
    }
}
btn.addEventListener('click', (e) => {
    e.preventDefault()
    copyToClipboard(strContent)
})
fileInput.addEventListener('change', () => {
    readFile()
})

// 读取文本
function readFile() {
    const btnBox = document.querySelectorAll('div.main-elmt')[3]
    var fileInput = document.getElementById('my-file-input');
    // 输入框
    const searchBox = document.querySelector('#dna_sequence')
    var file = fileInput.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result; // 获取文件内容
            searchBox.value = contents
            btnBox.children[1].click()
            // var lines = contents.split('\n'); // 按行分割文本内容
            // let str = ''
            // for (var i = 0; i < lines.length; i++) {
            //     var line = lines[i];
            //     // 对每一行进行处理逻辑
            //     if (line.includes('>')) {
            //         if (key != '') {
            //             compareData[key] = str
            //         }
            //         key = line
            //         str = ''
            //     } else {
            //         str += line
            //     }
            // }
            // const date = JSON.stringify(compareData)
            // localStorage.setItem('compareDate', date)
        };
        reader.readAsText(file); // 以文本形式读取文件
        // 如果需要读取其他类型的文件，可以使用以下方法：
        // reader.readAsDataURL(file); // 以DataURL形式读取文件
        // reader.readAsArrayBuffer(file); // 以ArrayBuffer形式读取文件
    }
}
// 复制文本
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            console.log('已成功复制到剪贴板');
        })
        .catch((error) => {
            console.error('复制失败:', error);
        });
}
window.onload = function () {
    const framRes = document.querySelectorAll('fieldset')
    const framNum = framRes.length
    // 复制按钮
    const btnBox = document.querySelectorAll('div.main-elmt')[3]
    btn.innerHTML = '复制结果'
    btnBox.appendChild(btn)
    for (let i = 0; i < framNum; i++) {
        const str = framRes[i].children[0].innerText
        if (!str.includes("5'3' Frame")) {
            continue
        } else {
            const content = framRes[i].children[1]
            const contentRed = content.children.length
            for (let j = 0; j < contentRed; j++) {
                if (content.children[j].tagName == 'SPAN') {
                    const text = content.children[j].innerText
                    if (text.length > strContent.length) {
                        strContent = text
                    }
                }
            }
        }
    }
    // const result = window.confirm(strContent); // 显示确认框，等待用户选择
    // if (result) { // 用户选择“确定”按钮
    //   copyToClipboard(strContent)
    // } else { // 用户选择“取消”按钮
    //   console.log("用户取消");
    // }


}
})();