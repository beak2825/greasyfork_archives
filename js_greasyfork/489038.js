// ==UserScript==
// @name         方正教务快速查询绩点
// @namespace    http://tampermonkey.net/
// @version      2024-03-03
// @description  快速在方正教务系统查询绩点
// @author       张瑾涵
// @match        https://jwgl.cug.edu.cn/jwglxt/cjcx/*
// @icon         data:image/png;base64,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
// @grant        GM_addElement
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489038/%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E5%BF%AB%E9%80%9F%E6%9F%A5%E8%AF%A2%E7%BB%A9%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/489038/%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E5%BF%AB%E9%80%9F%E6%9F%A5%E8%AF%A2%E7%BB%A9%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // BEGIN添加文本提示

    // 创建一个 span 元素
    var newSpan = document.createElement('span');
    newSpan.textContent = 'GPA计算方法：先选择对应的学年和学期，再点击查询，然后点击GPA按钮即可计算。'; // 设置新的文本内容

    // 找到目标 label 元素
    var labelElement = document.querySelector('.col-sm-12.control-label.align-left');


    // 创建一个包含换行的文本节点
    var lineBreakNode = document.createElement('br');

    // 将空格和换行插入到目标元素中
    labelElement.appendChild(lineBreakNode);
    // 将新的 span 元素添加到 label 中
    labelElement.appendChild(newSpan);

    // END添加文本提示


    // BEGIN修改下拉框默认值

    var selectElement = document.querySelector('.ui-pg-selbox');

    // 模拟点击下拉框
    selectElement.click();

    // 设置要选中的值
    var valueToSelect = '100';

    // 遍历下拉框中的选项并选中指定的值
    var options = selectElement.options;
    for (var i = 0; i < options.length; i++) {
        if (options[i].value === valueToSelect) {
            options[i].selected = true;
            break;
        }
    }

    // 触发 change 事件以模拟选中
    selectElement.dispatchEvent(new Event('change'));


    // END修改下拉框默认值





    // 创建一个按钮元素
    var button = document.createElement('button');
    //     button.innerHTML = 'GPA计算'; // 设置按钮文本

    // 创建一个包含文本的 span 元素
    var buttonText = document.createElement('span');
    buttonText.textContent = 'GPA = NaN'; // 设置按钮文本内容

    // 设置文本大小的样式
    buttonText.style.fontSize = '10px'; // 设置文本大小为 16 像素

    // 将包含文本的 span 元素添加到按钮中
    button.appendChild(buttonText);



    button.className = 'btn btn-primary btn-sm';


    // 找到目标元素
    var targetElement = document.querySelector('.col-md-4.col-sm-5');

    // 将按钮添加到目标元素中
    targetElement.appendChild(button);



    button.addEventListener('click', function() {


        // 在按钮被点击时执行的操作
        console.log('按钮被点击了！');

        var pointSum = 0;
        var creditSum = 0;

        console.log(document);
        // 查找所有具有 aria-describedby="tabGrid_cj" 属性的元素


        var elements = document.querySelectorAll('td[aria-describedby=tabGrid_xf]');

        // 存储元素内容的数组
        var dataArray = [];

        // 遍历每个匹配的元素，并将内容添加到数组中
        elements.forEach(function(element) {
            var titleValue = element.textContent;

            var trElement = element.parentNode;

            // 获取上一层 <tr> 元素的 style 属性
            var trStyle = trElement.getAttribute('style');
            // 输出上一层 <tr> 元素的 style 属性
            if(trStyle == 'color:red') return


            creditSum += parseFloat(titleValue);
            dataArray.push(titleValue);
        });
        console.log('creditSum 属性值为: ', creditSum);


        elements = document.querySelectorAll('td[aria-describedby=tabGrid_xfjd]');

        // 存储元素内容的数组
        dataArray = [];

        // 遍历每个匹配的元素，并将内容添加到数组中
        elements.forEach(function(element) {
            var titleValue = element.textContent;

            var trElement = element.parentNode;

            // 获取上一层 <tr> 元素的 style 属性
            var trStyle = trElement.getAttribute('style');
            // 输出上一层 <tr> 元素的 style 属性
            if(trStyle == 'color:red') return

            pointSum += parseFloat(titleValue);
            dataArray.push(titleValue);
        });
        console.log('pointSum 属性值为: ', pointSum);

        var gpa = pointSum / creditSum;
        var gpa2 = gpa.toFixed(2);
        console.log('gpa 属性值为: ', gpa2);
        //         alert('gpa = ' + gpa2);

        buttonText.textContent = 'GPA = ' + gpa2;

    });

})();