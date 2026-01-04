// ==UserScript==
// @name         BJTU 北京交通大学 自动评教
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动填写北京交通大学教学评价问卷
// @license      MIT
// @author       上条当咩
// @match        https://aa.bjtu.edu.cn/teaching_assessment/stu/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521464/BJTU%20%E5%8C%97%E4%BA%AC%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%20%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/521464/BJTU%20%E5%8C%97%E4%BA%AC%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%20%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建日志显示区域
    function createLogArea() {
        const logArea = document.createElement('div');
        logArea.id = 'autoFillLog';
        logArea.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            width: 300px;
            max-height: 400px;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            font-size: 12px;
        `;
        document.body.appendChild(logArea);
        return logArea;
    }

    // 日志函数
    function log(message) {
        const logArea = document.getElementById('autoFillLog');
        const time = new Date().toLocaleTimeString();
        logArea.innerHTML += `[${time}] ${message}<br>`;
        logArea.scrollTop = logArea.scrollHeight;
        console.log(`[AutoFill] ${message}`);
    }

    // 自动填写函数
    function autoFill() {
        log('开始自动填写评教...');

        // 处理单选题
        for (let i = 0; i < 11; i++) {
            const groupId = `id_select-${i}-select_result`;
            const group = document.getElementById(groupId);

            if (!group) {
                log(`⚠️ 未找到问题组 ${groupId}`);
                continue;
            }

            log(`处理问题 ${i + 1}`);

            // 获取所有选项
            const radios = group.querySelectorAll('input[type="radio"]');

            if (radios.length === 0) {
                log(`⚠️ 问题 ${i + 1} 没有找到选项`);
                continue;
            }

            // 遍历选项寻找最佳答案
            let bestOption = null;
            radios.forEach(radio => {
                const labelText = radio.parentElement.textContent.trim();
                if (i < 10 && labelText === '非常符合') {
                    bestOption = radio;
                } else if (i === 10 && labelText === '优秀') {
                    bestOption = radio;
                }
            });

            if (bestOption) {
                bestOption.checked = true;
                log(`✅ 问题 ${i + 1} 已选择: ${bestOption.parentElement.textContent.trim()}`);
            } else {
                log(`⚠️ 问题 ${i + 1} 未找到最佳选项`);
            }
        }

        // 填写主观评价
        const commentBox = document.querySelector('#id_comment-0-comment_result');
        if (commentBox) {
            commentBox.value = '老师教学认真负责，课程设置合理，让学生受益匪浅。教学方式生动有趣，课堂氛围活跃，充分调动了学生的积极性。在课程中不仅学到了专业知识，还提升了综合素质。';
            log('✅ 主观评价已填写');
        } else {
            log('⚠️ 未找到主观评价输入框');
        }

        log('填写完成！请检查并提交。');
    }

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        // 创建自动填写按钮
        const fillButton = document.createElement('button');
        fillButton.textContent = '自动填写最佳评价';
        fillButton.className = 'btn btn-sm btn-success';
        fillButton.onclick = autoFill;

        // 创建清除日志按钮
        const clearLogButton = document.createElement('button');
        clearLogButton.textContent = '清除日志';
        clearLogButton.className = 'btn btn-sm btn-warning';
        clearLogButton.onclick = () => {
            document.getElementById('autoFillLog').innerHTML = '';
        };

        panel.appendChild(fillButton);
        panel.appendChild(clearLogButton);
        document.body.appendChild(panel);
    }

    // 初始化
    window.addEventListener('load', () => {
        createLogArea();
        createControlPanel();
        log('评教自动填写脚本已加载');
        log('点击"自动填写最佳评价"开始填写');
    });
})();