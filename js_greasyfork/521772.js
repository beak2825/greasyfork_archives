// ==UserScript==
// @name         自动评教脚本（scut）
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  使用scut评教网站时开启，能够一键选择评价并根据评价输出评语
// @author       BAIKEMARK
// @match        https://pj.jw.scut.edu.cn/*
// @grant        none
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/521772/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC%EF%BC%88scut%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521772/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC%EF%BC%88scut%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // State to track which option is active
    let activeOption = null;

    // Function to select all options based on the label text
    function selectAllOptions(option) {
        const labels = document.querySelectorAll('label.ant-radio-wrapper');
        labels.forEach(label => {
            const text = label.textContent.trim();
            if (text === option) {
                const input = label.querySelector('input.ant-radio-input');
                if (input && !input.checked) {
                    input.click();

                    // Trigger input and change events
                    const inputEvent = new Event('input', { bubbles: true });
                    input.dispatchEvent(inputEvent);

                    const changeEvent = new Event('change', { bubbles: true });
                    input.dispatchEvent(changeEvent);
                }
            }
        });

        // Automatically generate and set feedback for each textarea
        const feedbackAreas = document.querySelectorAll('textarea.ant-input.index_UEditoTextarea-3MlcS[placeholder="请输入您的回答"]');
        feedbackAreas.forEach(area => {
            let feedback = '';
            switch (option) {
                case '完全同意':
                    feedback = '老师的教学非常精彩，课程内容全面且深入，极大地提升了我的知识储备和实践能力。非常感谢老师的辛勤付出！';
                    break;
                case '同意':
                    feedback = '老师的教学很不错，课程内容充实，对我的学习帮助很大。希望课程可以更加细化某些知识点。';
                    break;
                case '基本同意':
                    feedback = '课程内容还算可以，但某些部分有待改进，整体体验中规中矩。建议老师关注学生的理解反馈。';
                    break;
                case '不同意':
                    feedback = '课程内容较为欠缺，对我的帮助不大，希望老师能够进一步优化教学内容和方式。';
                    break;
                case '完全不同意':
                    feedback = '课程效果不佳，对我的学习帮助有限，建议重新规划课程设计并提高教学质量。';
                    break;
                default:
                    feedback = '感谢老师的付出！';
            }

            // Use native input value setter and dispatch events to notify the framework
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
            nativeInputValueSetter.call(area, feedback);

            const inputEvent = new Event('input', { bubbles: true });
            area.dispatchEvent(inputEvent);

            console.log('内容已成功填充并同步：', feedback);
        });
    }

    // Function to submit the form
    function submitForm(submitButton) {
        if (submitButton) {
            setTimeout(() => {
                submitButton.click();
                console.log('表单已成功提交！');
            }, 500); // Delay submission to ensure data binding
        } else {
            console.error('提交按钮未找到！');
        }
    }

    // Create toggle buttons for each option and a separate submit button
    function createToggleButtons() {
        const options = ["完全同意", "同意", "基本同意", "不同意", "完全不同意"];
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = '1000';
        container.style.padding = '15px';
        container.style.backgroundColor = '#ffffff';
        container.style.border = '1px solid #d9d9d9';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
        container.style.fontFamily = 'Arial, sans-serif';

        const title = document.createElement('div');
        title.textContent = '一键选择评价';
        title.style.fontSize = '20px';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';

        container.appendChild(title);

        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.style.display = 'block';
            button.style.width = '120px';
            button.style.height = '40px';
            button.style.marginBottom = '10px';
            button.style.padding = '0';
            button.style.backgroundColor = '#1890ff';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.borderRadius = '4px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '14px';
            button.style.textAlign = 'center';
            button.style.lineHeight = '40px';

            button.addEventListener('click', () => {
                // Reset all buttons to default color
                const allButtons = container.querySelectorAll('button');
                //allButtons.forEach(btn => btn.style.backgroundColor = '#1890ff');
                allButtons.forEach(btn =>{if (btn.textContent !== '提交评价') { btn.style.backgroundColor = '#1890ff';}});
                // Highlight the clicked button
                button.style.backgroundColor = '#52c41a';

                activeOption = option;
                selectAllOptions(option);
            });

            container.appendChild(button);
        });

        // Add a separate submit button
        const submitButton = document.createElement('button');
        submitButton.textContent = '提交评价';
        submitButton.style.display = 'block';
        submitButton.style.width = '120px';
        submitButton.style.height = '40px';
        submitButton.style.marginTop = '20px';
        submitButton.style.padding = '0';
        submitButton.style.backgroundColor = '#ffa500';
        submitButton.style.color = '#fff';
        submitButton.style.border = 'none';
        submitButton.style.borderRadius = '4px';
        submitButton.style.cursor = 'pointer';
        submitButton.style.fontSize = '14px';
        submitButton.style.textAlign = 'center';
        submitButton.style.lineHeight = '40px';

        submitButton.addEventListener('mousedown', () => {
            submitButton.style.backgroundColor = '#cc8400';
        });

        submitButton.addEventListener('mouseup', () => {
            submitButton.style.backgroundColor = '#ffa500';
            const formSubmitButton = document.querySelector('button.ant-btn.index_submit-2EYSG.ant-btn-primary');
            submitForm(formSubmitButton);
            const allButtons = container.querySelectorAll('button');
                //allButtons.forEach(btn => btn.style.backgroundColor = '#1890ff');
                allButtons.forEach(btn =>{if (btn.textContent !== '提交评价') { btn.style.backgroundColor = '#1890ff';}});
                // Highlight the clicked button
                button.style.backgroundColor = '#52c41a';
        });

        container.appendChild(submitButton);

        document.body.appendChild(container);
    }

    // Run the script
    window.addEventListener('load', () => {
        setTimeout(() => {
            createToggleButtons();
        }, 1000);
    });
})();
