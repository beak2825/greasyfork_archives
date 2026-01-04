// ==UserScript==
// @name         天津城建大学教学评估助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  天津城建大学urp 一键评估
// @author       Bakadream
// @match        *://*/*/student/teachingEvaluation/newEvaluation/index
// @match        *://*/*/student/teachingEvaluation/newEvaluation/evaluation/*
// @match        https://jwxs.tcu.edu.cn/student/teachingEvaluation/newEvaluation/index
// @match        https://jwxs.tcu.edu.cn/student/teachingEvaluation/newEvaluation/evaluation/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498440/%E5%A4%A9%E6%B4%A5%E5%9F%8E%E5%BB%BA%E5%A4%A7%E5%AD%A6%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/498440/%E5%A4%A9%E6%B4%A5%E5%9F%8E%E5%BB%BA%E5%A4%A7%E5%AD%A6%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getCourseList() {
        document.querySelector('#myTab > li:nth-child(1) > a').click();
      console.log('ok');
              setTimeout(() => {
            // 这里是你想要在10秒后执行的代码
            // 获取所有的按钮元素
        var buttons = document.querySelectorAll('button');
        var jxpgButtons = []; // 存储符合条件的按钮
        console.log(buttons)
        // 遍历所有按钮，检查flag属性是否等于jxpg
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].getAttribute('flag') === 'jxpg') {
                jxpgButtons.push(buttons[i]);
            }
        }

        // 使用querySelector找到h4元素（确保选择器匹配你的HTML结构）
        var h4Element = document.querySelector('h4.header.smaller.lighter.grey');

        // 创建一个新的span元素作为子元素
        var countSpan = document.createElement('span');

        // 创建两个文本节点，一个用于描述，一个用于数字
        var countText = document.createTextNode('未评教课程数量: ');
        var countNumberSpan = document.createElement('span'); // 创建一个新的span来包裹数字
        countNumberSpan.textContent = jxpgButtons.length; // 设置数字的文本内容

        // 设置数字span的样式为红色粗体
        countNumberSpan.style.color = 'red';
        countNumberSpan.style.fontWeight = 'bold';

        // 将文本节点和数字的span添加到主span中
        countSpan.appendChild(countText);
        countSpan.appendChild(countNumberSpan);

        // 将新的span元素添加到h4元素的子节点列表中
        h4Element.appendChild(countSpan);
        jxpgButtons[0].click();
        }, 500); // 第二个参数是毫秒数

    }

    // 函数b，在evaluation子页面执行
    function evaluation() {
        console.log('正在评教中');
        // 在这里编写你的代码...
        var input = document.getElementsByTagName('input');  // 获取所有的input
        for (var i = 0; i < input.length; i++) {
            if (input[i].getAttribute('value') == 'A_完全同意') {    // 找到所有为1的选项，即A选项
                input[i].setAttribute("checked", "checked");    // 选中
            }
            if (input[i].getAttribute('value') == 'A_很好') {    // 找到a
                input[i].setAttribute("checked", "checked");    // 选中
            }
        }
        document.getElementsByTagName('textarea')[0].value = '老师讲的很好，我很喜欢！';

        setTimeout(() => {
            // 这里是你想要在10秒后执行的代码
            save();
        }, 10000); // 第二个参数是毫秒数，所以10秒是10000毫秒
    }

    // 根据当前页面的URL路径执行相应的函数
    if (location.pathname.endsWith('/student/teachingEvaluation/newEvaluation/index')) {
        // 检查是否在index页面上
      setTimeout(function(){
            getCourseList();
}, 5000);
    } else if (location.pathname.startsWith('/student/teachingEvaluation/newEvaluation/evaluation/')) {
        // 检查是否在evaluation子页面上
        evaluation();
    }
})();