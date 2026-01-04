// ==UserScript==
// @name         自动评教（山传教务系统）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  运行后会在页面右下角添加一个“自动评教”按钮，点击后将会自动打分并随机写入评语。当前版本切换老师和保存仍然需要自己手动点击（该版本适用于“新教务系统”，8.2.23-9.0.1）。
// @match        *://*.cusx.edu.cn/*
// @grant        none
// @author       Doubt-Fact
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469411/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%EF%BC%88%E5%B1%B1%E4%BC%A0%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/469411/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%EF%BC%88%E5%B1%B1%E4%BC%A0%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个包含多个正面评语的数组，可在此处修改
    const comments = [
        "老师备课充分，讲解细致入微，总能将复杂的知识点化繁为简，让我们轻松掌握，真是受益匪浅。",
        "老师不仅专业知识丰富，而且极具耐心，对待每位学生的问题都能耐心解答，让人感受到温暖与关怀，是位不可多得的好老师。",
        "老师的课堂充满活力，善于运用多种教学方法激发我们的学习兴趣，让学习变得不再枯燥，每次上课都充满期待。",
        "老师对待学术严谨认真，对学生则充满热情与鼓励，总能在关键时刻给予我们方向性的指导，帮助我们克服学习中的难关。",
        "老师的讲解深入浅出，能够很好地平衡理论与实践，让我们在掌握知识的同时，也学会了如何应用，真是教学有方，令人敬佩。"
    ];

    // 定义自动评教函数
    function autoEvaluate() {
        // 查找所有的input输入框
        var inputs = document.querySelectorAll('input');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            // 根据不同的class输入不同的内容
            if (input.className === 'form-control input-sm input-pjf') {
                input.value = '100';
            }
        }

        // 查找所有的textarea输入框
        var textareas = document.querySelectorAll('textarea');
        for (var i = 0; i < textareas.length; i++) {
            var textarea = textareas[i];
            // 根据不同的class输入不同的内容
                        // 根据不同的class输入不同的内容
            if (textarea.className === 'form-control input-zgpj') {
                if (i === 0) {
                    textarea.value = comments[Math.floor(Math.random() * comments.length)];
                } else {
                    textarea.value = '无';
                }
            } else if (textarea.className === 'form-control') {
                textarea.value = comments[Math.floor(Math.random() * comments.length)];
            }
        }

        const container = document.documentElement;
        // 获取页面的总高度
        const pageHeight = document.body.scrollHeight;

        // 计算滚动距离
        const scrollDistance = pageHeight - window.innerHeight;

        // 使用scrollTo方法平滑滚动到页尾
        container.scrollTo({
            top: scrollDistance,
            behavior: 'smooth'
        });

        // 不需要点击“提交”按钮
    }

    // 创建一个固定定位的按钮
    var floatBtn = document.createElement('button');
    floatBtn.className = 'btn btn-success';
    floatBtn.textContent = '自动评教';
    floatBtn.style.position = 'fixed';
    floatBtn.style.bottom = '10px';
    floatBtn.style.right = '10px';
    floatBtn.style.zIndex = '9999';
    document.body.appendChild(floatBtn);

    // 给按钮添加点击事件，调用自动评教的函数
    floatBtn.addEventListener('click', autoEvaluate);
})();