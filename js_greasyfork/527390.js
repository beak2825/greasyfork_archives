// ==UserScript==
// @name         微加-网络资源管理-端口数量自动增加
// @namespace    http://tampermonkey.net/
// @version      2025-02-17
// @description  对微加的功能自动化
// @author       Daniel
// @match        https://adm.iops.app.sccncd.com/manager/form-pro/management/441468?appid=58&menus=hidden
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sccncd.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527390/%E5%BE%AE%E5%8A%A0-%E7%BD%91%E7%BB%9C%E8%B5%84%E6%BA%90%E7%AE%A1%E7%90%86-%E7%AB%AF%E5%8F%A3%E6%95%B0%E9%87%8F%E8%87%AA%E5%8A%A8%E5%A2%9E%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/527390/%E5%BE%AE%E5%8A%A0-%E7%BD%91%E7%BB%9C%E8%B5%84%E6%BA%90%E7%AE%A1%E7%90%86-%E7%AB%AF%E5%8F%A3%E6%95%B0%E9%87%8F%E8%87%AA%E5%8A%A8%E5%A2%9E%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮元素
    const button = document.createElement('button');
    button.innerText = '端口数量-自增';
    button.style.position = 'fixed';
    button.style.top = '15%';
    button.style.left = '50%';
    button.style.zIndex = 1000;
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    // 将按钮添加到页面上
    document.body.appendChild(button);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    $(document).ready(async function() {
        await sleep(2000)

        // 添加点击事件
        button.addEventListener('click', async() => {
            for(var i=85;i<145;i++){
                // if(i==48){
                //     i+=1;
                //     continue;
                // }
                console.log(i)
                //点击新增数据
                $('.vj-b0f7898f')[0].click()
                await sleep(2000)
                // 1. 获取 iframe 元素
                const iframe = document.querySelector('.vj-b8673ac6');
                //console.log(iframe)
                // 3. 访问 iframe 内部的 DOM
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const 字段名称 = iframeDoc.querySelectorAll('.vj-db69b794')[0]
                字段名称.focus()
                //输入字段名称
                字段名称.value = i+"口";

                // console.warn("请选择")
                // await sleep(5000)
                //资源类型下拉框
                const input = iframeDoc.querySelectorAll("input.ant-select-selection-search-input")[0]
                input.focus();
                const mouseDownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                input.dispatchEvent(mouseDownEvent);

                await sleep(800)
                    // 找到下拉框的容器
                const dropdown = iframeDoc.querySelector('.rc-virtual-list-holder-inner'); // 替换为你的下拉框 class
                if (dropdown) {
                    dropdown.style.display = 'block'; // 显示下拉框
                }
                await sleep(500)
                // 找到下拉框中的选项并点击
                const options = dropdown.querySelectorAll('.ant-select-item'); // 替换为你的选项 class
                options.forEach(option => {
                    if (option.textContent.includes('光缆')||option.textContent.includes('数据')) {
                        option.click(); // 点击匹配的选项
                    }
                });


                await sleep(500)


                //输入序号
                const 序号 = iframeDoc.querySelectorAll('.vj-421806a2 input')[0]
                序号.focus()
                序号.value = i+3;
                // console.warn("请选择")
                // await sleep(6000)
                await sleep(1000)
                //选择数量下拉框
                const input2 = iframeDoc.querySelectorAll("input.ant-select-selection-search-input")[1]
                input2.focus();

                const mouseDownEvent2 = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                input2.dispatchEvent(mouseDownEvent2);
                await sleep(500)
                // 修改输入框的值
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    'value'
                ).set;
                nativeInputValueSetter.call(input2, i); // 直接修改值

                // 触发 input 事件
                const input2Event = new Event('input', { bubbles: true });
                input2.dispatchEvent(input2Event);

                // 触发 change 事件
                const change2Event = new Event('change', { bubbles: true });
                input2.dispatchEvent(change2Event);

                await sleep(500)
                    // 找到下拉框的容器
                const dropdown2 = iframeDoc.querySelectorAll('.rc-virtual-list-holder-inner')[1]; // 替换为你的下拉框 class
                if (dropdown2) {
                    dropdown2.style.display = 'block'; // 显示下拉框
                }
                await sleep(1000)
                // 找到下拉框中的选项并点击
                const options2 = dropdown2.querySelectorAll('.ant-select-item'); // 替换为你的选项 class
                options2.forEach(option2 => {
                    if (option2.textContent==i) {
                        console.log("成功匹配")
                        option2.click(); // 点击匹配的选项
                    }
                });
                await sleep(2000)
                //点击提交
                iframeDoc.querySelectorAll('.vj-e471ba46')[1].click()
                await sleep(3500)
            }

        });
    })
})();