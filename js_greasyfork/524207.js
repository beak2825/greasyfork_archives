// ==UserScript==
// @name         西南交通大学评教助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键完成课程评教,支持自定义评分和评价内容
// @author       renyumeng
// @match        *://one.swjtu.edu.cn/gsapp/sys/wspjapp/*
// @match        *://one.swjtu.edu.cn/*
// @grant        none
// @license      CC BY-NC-4.0
// @downloadURL https://update.greasyfork.org/scripts/524207/%E8%A5%BF%E5%8D%97%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/524207/%E8%A5%BF%E5%8D%97%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入样式
    const style = document.createElement('style');
    style.textContent = `

        .eval-helper {
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            width: 300px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
        }
         .title-block {
        flex: 1;
    }

    .eval-helper-title {
        font-weight: bold;
        color: #333;
        margin-bottom: 5px;
    }


        .eval-helper-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
        cursor: move;
        user-select: none;
    }
        .eval-helper-title {
            font-weight: bold;
            color: #333;
        }
        .eval-helper-minimize {
        padding: 0 5px;
        cursor: pointer;
        color: #666;
    }
        .eval-helper-content {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .eval-helper label {
            display: block;
            margin-bottom: 5px;
            color: #333;
        }
        .eval-helper select,
        .eval-helper textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        .eval-helper textarea {
            height: 80px;
            resize: vertical;
        }
        .eval-helper button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
        }
        .eval-helper button:hover {
            background: #45a049;
        }
        .eval-helper button:disabled {
            background: #cccccc;
            cursor: not-allowed;
        }
        .eval-helper.minimized {
            width: auto;
            height: auto;
        }
        .eval-helper.minimized .eval-helper-content {
            display: none;
        }
        .eval-status {
            margin-top: 10px;
            padding: 8px;
            border-radius: 4px;
            display: none;
        }
        .eval-status.success {
            background: #e8f5e9;
            color: #2e7d32;
            display: block;
        }
        .eval-status.error {
            background: #ffebee;
            color: #c62828;
            display: block;
        }
        .author-info {
            font-size: 12px;
            color: #666;
            text-align: left;
        }
        .title-block {
            font-size: 18px;
            font-weight: bold;
            text-align: left;
            margin-bottom: 15px;
        }
    `;
    document.head.appendChild(style);

    // 创建界面
    const helper = document.createElement('div');
    helper.className = 'eval-helper';
    helper.innerHTML = `
        <div class="eval-helper-header">
            <div class="title-block">
            <div class="eval-helper-title">西南交通大学评教助手</div>
            <div class="author-info">© 2025 by renyumeng</div>
        </div>
             <div class="eval-helper-minimize">_</div>
        </div>

        <div class="eval-helper-content">
            <div>
                <label>评分选择:</label>
                <select id="eval-score">
                    <option value="5">5分</option>
                    <option value="4">4分</option>
                    <option value="3">3分</option>
                    <option value="2">2分</option>
                    <option value="1">1分</option>
                </select>
            </div>
            <div>
                <label>学习收获:</label>
                <textarea id="eval-gain">通过本课程的学习，加深了对该学科的理解和认识，掌握了相关的基础知识和实践技能。老师的教学方式生动有趣，让我对这门课程产生了浓厚的兴趣。</textarea>
            </div>
            <div>
                <label>课程建议:</label>
                <textarea id="eval-suggestion">老师的教学很专业，课程安排也很合理。希望以后能有更多的实践机会，让我们能够更好地掌握和运用所学知识。</textarea>
            </div>
            <button id="eval-submit">开始评教</button>
            <div id="eval-status" class="eval-status"></div>
        </div>
    `;
    document.body.appendChild(helper);

    // 拖动功能
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    helper.querySelector('.eval-helper-header').addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        if (e.target.closest('.eval-helper-header')) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            helper.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }

    function dragEnd() {
        isDragging = false;
    }

    // 最小化功能
    const minimizeBtn = helper.querySelector('.eval-helper-minimize');
    minimizeBtn.addEventListener('click', () => {
        helper.classList.toggle('minimized');
        minimizeBtn.textContent = helper.classList.contains('minimized') ? '□' : '_';
    });

   async function doEvaluation() {
    // 获取评教表单数据
    const score = document.getElementById('eval-score').value;
    const gain = document.getElementById('eval-gain').value;
    const suggestion = document.getElementById('eval-suggestion').value;

    // 获取提交按钮
    const submitBtn = document.getElementById('eval-submit');

    try {
        // 验证必填项
        if (!score) {
            throw new Error('请选择评分');
        }
        if (!gain) {
            throw new Error('请填写学习收获');
        }
        if (!suggestion) {
            throw new Error('请填写课程建议');
        }

        // 禁用提交按钮
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = '#ccc';
        showStatus('正在提交评教...', 'info');

        // 选择评分
        const scoreButtons = $(`input[type="radio"][value="${score}"]`);
        if (scoreButtons.length === 0) {
            throw new Error('未找到评分选项');
        }
        scoreButtons.each(function() {
            $(this).prop('checked', true);
        });

        // 填写文本框
        $('#wb_db50f190e2cc4ca38b17019971dab7f6').val(gain);  // 学习收获
        $('#wb_973b6c7a40f74e0589ab2e2f10de6bd8').val(suggestion);  // 课程建议

        // 等待DOM更新
        await new Promise(resolve => setTimeout(resolve, 500));

        // 点击提交按钮
        const submitButton = $('a[data-action="提交"]');
        if (submitButton.length === 0) {
            throw new Error('未找到提交按钮');
        }
        submitButton.click();

        // 等待确认弹窗出现
        await new Promise(resolve => setTimeout(resolve, 500));

        // 点击确认按钮
        const confirmButton = $('.bh-dialog-btn').filter(function() {
            return $(this).text().trim() === '确定';
        });
        if (confirmButton.length === 0) {
            throw new Error('未找到确认按钮');
        }
        confirmButton.click();

        // 等待提交完成
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 检查是否提交成功
        const errorMsg = $('.bh-dialog-content').text();
        if (errorMsg && errorMsg.includes('错误')) {
            throw new Error(errorMsg);
        }

        showStatus('评教完成！', 'success');

    } catch (error) {
        showStatus('评教失败: ' + error.message, 'error');
        console.error('评教失败:', error);

        // 失败时重新启用按钮
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = '';

    } finally {
        // 检查是否真的提交成功
        const isSubmitSuccess = !document.querySelector('.bh-dialog-btn');

        if (!isSubmitSuccess) {
            // 如果提交未成功,重新启用按钮
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = '';
        }
        submitBtn.disabled = false;
    }
}

// 显示状态信息的辅助函数
function showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('eval-status');
    if (!statusDiv) return;

    statusDiv.textContent = message;
    statusDiv.className = `eval-status ${type}`;

    // 如果是错误消息,3秒后自动清除
    if (type === 'error') {
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = 'eval-status';
        }, 3000);
    }
}


    // 绑定评教事件
    document.getElementById('eval-submit').addEventListener('click', doEvaluation);

    // 保存配置到localStorage
    function saveConfig() {
        const config = {
            score: document.getElementById('eval-score').value,
            gain: document.getElementById('eval-gain').value,
            suggestion: document.getElementById('eval-suggestion').value
        };
        localStorage.setItem('evalHelperConfig', JSON.stringify(config));
    }

    // 加载配置
    function loadConfig() {
        const savedConfig = localStorage.getItem('evalHelperConfig');
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            document.getElementById('eval-score').value = config.score;
            document.getElementById('eval-gain').value = config.gain;
            document.getElementById('eval-suggestion').value = config.suggestion;
        }
    }

    // 自动保存配置
    ['eval-score', 'eval-gain', 'eval-suggestion'].forEach(id => {
        document.getElementById(id).addEventListener('change', saveConfig);
    });

    // 加载保存的配置
    loadConfig();
})();
