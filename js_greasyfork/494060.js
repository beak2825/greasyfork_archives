// ==UserScript==
// @name         小二审核匹配页面审核按钮插件
// @namespace    https://blog.csdn.net/weixin_44710412?type=blog
// @version      1.0.2
// @description  -
// @author       yg
// @match        https://achoice.workstation.lazada.com/achoice/product/review-mapping*
// @icon         https://lzd-img-global.slatic.net/g/tps/imgextra/i3/O1CN01NmesYV1siS0pcg2C6_!!6000000005800-55-tps-90-90.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494060/%E5%B0%8F%E4%BA%8C%E5%AE%A1%E6%A0%B8%E5%8C%B9%E9%85%8D%E9%A1%B5%E9%9D%A2%E5%AE%A1%E6%A0%B8%E6%8C%89%E9%92%AE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/494060/%E5%B0%8F%E4%BA%8C%E5%AE%A1%E6%A0%B8%E5%8C%B9%E9%85%8D%E9%A1%B5%E9%9D%A2%E5%AE%A1%E6%A0%B8%E6%8C%89%E9%92%AE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

// 自定义变量
let toastTitle = '插件已生效，你现在可以操作了！'; // 生效toast文案
let toastTime = 2000; // 生效toast停留时间
let toastFontSize = 20;

let default_not_match_reason_index = 1; // 默认点击的不匹配原因序号

let flag = '';
let current_flag = '';
let butArr = [];
let intervalId;
(function () {
    'use strict';

    intervalId = setInterval(function () {
        if (!diff()) {
            current_flag = flag;
            // console.log('[lazada_check_plugin] page changed' + current_flag);

            console.log('[lazada_check_plugin] page changed ' + new Date());
            // 翻页时需要执行的逻辑
            nextPage();
            // 按钮刷新完成
            showToast(toastTitle, toastTime);
        }
    }, 1000);

    console.log('[lazada_check_plugin] console input clearInterval(' + intervalId + ') to stop');
})();

function nextPage() {
    clearButton(butArr); // 将上一页的按钮删除

    let curButArr = [];
    for (let i = 0; i < document.getElementsByClassName('next-btn').length; i++) {
        // 定位到审核按钮
        if (document.getElementsByClassName('next-btn')[i].children[0].textContent === '审核') {
            let _button_not_match = getButton('rgba(245, 201, 69)', 'white'); // 创建一个按钮
            // let _button_not_match = getButton('blue', 'white'); // 创建一个按钮
            _button_not_match.textContent = "不匹配"; // 按钮内容
            curButArr.push(_button_not_match);

            let _button_match = getButton('rgb(143, 193, 87)', 'white'); // 创建一个按钮
            // let _button_match = getButton('blue', 'white'); // 创建一个按钮
            _button_match.textContent = "匹配"; // 按钮内容
            curButArr.push(_button_match);

            // 不匹配按钮
            // 使用立即执行函数表达式(IIFE)来创建闭包，冻结循环中的i值
            _button_not_match.addEventListener("click", (function (index) {
                return function clickButton() {
                    console.log("测试点击-不匹配");

                    // 使用冻结的index值来确保正确访问元素
                    document.getElementsByClassName('next-btn')[index]
                        .children[0].click(); // 此处为点击审核按钮

                    // 延迟执行，等待弹窗出现
                    setTimeout(function () {
                        document.getElementsByClassName('algo-btn')[0].children[1].click(); // 点击不匹配
                        setTimeout(function () {
                            document.getElementById('reason').children[default_not_match_reason_index].children[0].children[0].click(); // 默认点击第二个选项
                            setTimeout(function () {
                                document.getElementsByClassName('next-dialog-body next-dialog-body-no-footer')[0].getElementsByClassName('next-btn')[0].click(); // 点击不匹配
                            }, 100);
                        }, 100);
                    }, 100); // 延迟100毫秒后执行，根据实际情况调整
                };
            })(i));

            // 匹配按钮
            _button_match.addEventListener("click", (function (index) {
                return function clickButton() {
                    console.log("测试点击-匹配");

                    // 使用冻结的index值来确保正确访问元素
                    document.getElementsByClassName('next-btn')[index]
                        .children[0].click(); // 此处为点击审核按钮

                    // 延迟执行，等待弹窗出现
                    setTimeout(function () {
                        document.getElementsByClassName('algo-btn')[0].children[0].click(); // 点击匹配
                    }, 100); // 延迟100毫秒后执行，根据实际情况调整
                }
            })(i));

            let parentNode = document.getElementsByClassName('next-btn')[i].parentNode;
            parentNode.appendChild(_button_match);
            parentNode.appendChild(_button_not_match);
        }
    }
    butArr = curButArr;
}

// 观察页面元素是否发生变化
function diff() {
    flag = '';
    for (let i = 0; i < document.getElementsByClassName('id-scope').length; i++) {
        flag += document.getElementsByClassName('id-scope')[i].children[0].textContent + ';';
    }
    return current_flag === flag;
}

// function diff() {
//     flag = '';
//     for (let i = 0; i < document.getElementsByClassName('text-ellipsis').length; i++) {
//         let content = document.getElementsByClassName('text-ellipsis')[i].textContent;
//         if (isPureNumber(content)) {
//             flag += content + ';';
//         }
//     }
//     return current_flag === flag;
// }
//
// function isPureNumber(str) {
//     return /^\d+$/.test(str);
// }

// rgbColor: 'rgba(255, 0, 0, 0.5)'
function getButton(bkRgbColor, fontRgbColor) {
    var button = document.createElement("button"); // 创建一个按钮
    // 修改按钮的样式
    button.style.backgroundColor = bkRgbColor; // 背景色
    button.style.color = fontRgbColor; // 文字颜色
    button.style.fontSize = '14px'; // 字体大小设置为20像素
    button.style.border = 'none'; // 移除边框
    button.style.padding = '2px 5px'; // 设置内边距
    button.style.cursor = 'pointer'; // 更改鼠标悬停时的指针形状

    button.style.borderRadius = '5px'; // 设置圆角为10像素
    button.style.margin = '10px 1px'; // 分别设置上、右、下、左边距为10像素

    button.style.display = 'block'; /* 或 block，具体取决于布局需求 */
    button.style.whiteSpace = 'nowrap'; /* 防止文本换行 */
    button.style.width = 'auto'; /* 自动调整宽度以适应内容 */

    return button;
}

function clearButton(arr) {
    // 将上一页的按钮删除
    arr.forEach(function (item, index, array) {
        if (item) {
            item.parentNode.removeChild(item); // 从DOM中移除按钮
            console.log('[lazada_check_plugin] removeChild');
        }
    });
}

// 展示toast使用方法
// showToast("Hello, this is a toast message!", 2000);
function showToast(message, duration = 3000) {
    // 创建div元素作为Toast
    var toastDiv = document.createElement('div');
    toastDiv.innerHTML = message;
    toastDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 20px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        border-radius: 5px;
        z-index: 1000;
        max-width: 60%;
        min-width: 200px;
        text-align: center;
    `;
    toastDiv.style.cssText += `font-size: ` + toastFontSize + `px;`

    // 添加到DOM
    document.body.appendChild(toastDiv);

    // 设置自动消失
    setTimeout(() => {
        document.body.removeChild(toastDiv);
    }, duration);
}

function show() {
    showToast("Hello, this is a toast message!", 2000);
}
