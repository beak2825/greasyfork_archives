// ==UserScript==
// @name         二轮土地延包
// @namespace    zhaiwei
// @version      0.1.3
// @description  autofill
// @author       zhaiwei
// @match        http://36.134.85.57:18882/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=85.57
// @grant        none
// @license      GPL license
// @downloadURL https://update.greasyfork.org/scripts/522670/%E4%BA%8C%E8%BD%AE%E5%9C%9F%E5%9C%B0%E5%BB%B6%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/522670/%E4%BA%8C%E8%BD%AE%E5%9C%9F%E5%9C%B0%E5%BB%B6%E5%8C%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 生成按钮
    var btn = document.createElement('button');
    // 按钮文字
    btn.innerText = '公示填充';
    // 添加按钮的样式类名class值为chooseBtn
    btn.setAttribute('class', 'chooseBtn');
    // 生成style标签
    var style = document.createElement('style');
    // 把样式写进去
    style.innerText = `.chooseBtn{position:fixed;top:70%;right:5%;width:75px;height:55px;padding:3px 5px;border:3px solid #0d6efd;cursor:pointer;color:#0d6efd;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.chooseBtn:hover{background-color:#0d6efd;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(style);
    // 在body中添加button按钮
    document.body.appendChild(btn);
    // 点击按钮去执行一键全选函数 chooseAll
    document.querySelector('.chooseBtn').addEventListener('click', function () {
        chooseAll();
    })

    // 生成按钮
    var btnSave = document.createElement('button');
    // 按钮文字
    btnSave.innerText = '同意';
    // 添加按钮的样式类名class值为saveBtn
    btnSave.setAttribute('class', 'saveBtn');
    // 生成style标签
    var styleSave = document.createElement('style');
    // 把样式写进去
    styleSave.innerText = `.saveBtn{position:fixed;top:80%;right:5%;width:75px;height:55px;padding:3px 5px;border:3px solid #ce0000;cursor:pointer;color:#ce0000;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.saveBtn:hover{background-color:#ce0000;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(styleSave);
    // 在body中添加button按钮
    document.body.appendChild(btnSave);
    // 点击按钮去执行一键全选函数 saveAll
    document.querySelector('.saveBtn').addEventListener('click', function () {
        saveAll();
    })

    // 一键全选函数
    function chooseAll() {

        //
        // 先获取外层的div（根据其特定属性等条件，如果有的话可以更精准选择，这里仅示例）
        var outerDiv1 = document.querySelector('div[content="请输入公示人"]');
        if (outerDiv1) {
            // 再从外层div里获取内层的el-input相关的div
            var inputDiv1 = outerDiv1.querySelector('.el-input.el-input--small.el-input--suffix.avue-input');
            if (inputDiv1) {
                // 最后获取里面的input元素
                var input = inputDiv1.querySelector('.el-input__inner');
                if (input) {
                    input.value = "吴勤";
                    // 创建一个input事件对象并触发该事件
                    let event = new Event('input', { bubbles: true });
                    input.dispatchEvent(event);

                }
            }
        }
        // 先通过外层div的自定义属性定位到外层div
        var outerDiv2 = document.querySelector('div[content="请输入公示人联系电话"]');
        if (outerDiv2) {
            // 从外层div中查找具有特定类名的内层div
            var innerDiv2 = outerDiv2.querySelector('.el-input.el-input--small.el-input--suffix.avue-input');
            if (innerDiv2) {
                // 再从内层div里获取目标input元素
                var inputElement = innerDiv2.querySelector('.el-input__inner');
                if (inputElement) {
                    inputElement.value = "18055787000";
                    // 创建一个input事件对象并触发该事件
                    let event = new Event('input', { bubbles: true });
                    inputElement.dispatchEvent(event);

                }
            }
        }
        //公示方式
        var suffixSpan = document.querySelectorAll('.el-input__suffix')[13];
        if (suffixSpan) {
            // 找到它所在的下拉框元素，这里假设父元素往上找两层能找到el-select对应的div（需根据实际DOM结构调整）
            var selectDiv = suffixSpan.parentNode.parentNode;
            if (selectDiv) {
                // 查找下拉框中的选项列表元素，通常是ul或者类名为dropdown-menu之类的元素，需根据实际结构调整
                var optionList = selectDiv.querySelector('ul');
                if (optionList && optionList.children.length >= 2) {
                    // 获取第二个选项元素（索引为1，因为索引从0开始）
                    var secondOption = optionList.children[1];
                    // 触发点击事件来选中它
                    var clickEvent = new Event('click', { bubbles: true });
                    secondOption.dispatchEvent(clickEvent);
                }
            }
        }

        //公示天数
        var publicDays = document.querySelector('input[aria-label="请输入公示天数"]');
        if (publicDays) {
            // 对选中元素进行操作
            publicDays.value = '15';
            // 触发change事件（适用于基于change事件监听验证的情况，比如输入框失去焦点时验证等）
            let changeEvent = new Event('change', { bubbles: true });
            publicDays.dispatchEvent(changeEvent);
        }

        //公示开始日期
//         setTimeout(function() {
//             // 通过类名选择到对应的输入框元素，你也可以根据实际情况换用其他选择器（比如id等）来精准定位
//             var inputElement = document.querySelectorAll('.el-input__inner')[105];
//             if (inputElement) {
//                 inputElement.value = '2024-11-22';
//             }
//         }, 1000);
        setTimeout(function() {document.getElementsByClassName("el-input__icon el-icon-date")[4].click()},10);

        setTimeout(function() {document.getElementsByClassName("el-date-picker__header-label")[0].click()},110);
        //2024
        setTimeout(function() {document.getElementsByClassName("available")[35].children[0].click()},310);
        //11月
       setTimeout(function() {document.querySelectorAll("a.cell")[20].click()},510);
        //22日
        setTimeout(function() {document.querySelectorAll("td.available")[21].click()},710);



        // 公示地址
        var outerDiv = document.querySelector('div[content="请输入公示地址"]');
        if (outerDiv) {
            // 再从外层div里获取内层的el-textarea相关的div
            var textareaDiv = outerDiv.querySelector('.el-textarea.el-input--small.el-input--suffix.avue-input');
            if (textareaDiv) {
                // 最后获取里面的textarea元素
                var textarea = textareaDiv.querySelector('.el-textarea__inner');
                if (textarea) {
                    textarea.value = "于城村";
                    var event = new Event('input', {
                        bubbles: true,
                        cancelable: true
                    });
                    textarea.dispatchEvent(event);
                }
            }
        }
    }




    // 保存函数
    function saveAll() {



        //同意：
        var outerDiv = document.querySelector('div[content="请输入审核意见"]');
        if (outerDiv) {
            // 再从外层div里获取内层的el-textarea相关的div
            var textareaDiv = outerDiv.querySelector('.el-textarea.el-input--small.el-input--suffix.avue-input');
            if (textareaDiv) {
                // 最后获取里面的textarea元素
                var textarea = textareaDiv.querySelector('.el-textarea__inner');
                if (textarea) {
                    textarea.value = "同意";
                    var event = new Event('input', {
                        bubbles: true,
                        cancelable: true
                    });
                    textarea.dispatchEvent(event);
                }
            }
        }
    }

    // Your code here...
})();