// ==UserScript==
// @name         Manus验证码获取助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  注册 Manus 时，通过一个清爽的弹窗快速获取验证码，并能真正成功地自动填入，原生JS实现，轻量、美观。
// @author       A嘉博客
// @license CC-BY-NC-ND-4.0
// @match        *://*.manus.ai/*
// @match        *://manus.im/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/540370/Manus%E9%AA%8C%E8%AF%81%E7%A0%81%E8%8E%B7%E5%8F%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/540370/Manus%E9%AA%8C%E8%AF%81%E7%A0%81%E8%8E%B7%E5%8F%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // 1. --- 注入自定义 CSS 样式 ---
    GM_addStyle(`
        :root {
            --primary-color: #007bff;
            --primary-hover: #0056b3;
            --success-color: #28a745;
            --error-color: #dc3545;
            --light-gray: #f8f9fa;
            --gray-border: #dee2e6;
            --text-color: #333;
        }

        /* 触发按钮 */
        .gm-trigger-button {
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 99998;
            height: 50px;
            width: 50px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            font-size: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s ease;
        }
        .gm-trigger-button:hover {
            background-color: var(--primary-hover);
            transform: translateY(-3px);
        }

        /* 弹窗背景 */
        .gm-modal-backdrop {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(5px);
            z-index: 99999;
            display: none; /* 默认隐藏 */
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        /* 弹窗容器 */
        .gm-modal-container {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            width: 90%;
            max-width: 500px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            transition: all 0.3s ease;
            display: none; /* 默认隐藏 */
            opacity: 0;
            z-index: 100000;
        }
        .gm-modal-backdrop.visible, .gm-modal-container.visible {
            display: block;
            opacity: 1;
        }
        .gm-modal-container.visible {
            transform: translate(-50%, -50%) scale(1);
        }


        /* 弹窗头部 */
        .gm-modal-header {
            padding: 16px 24px;
            border-bottom: 1px solid var(--gray-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .gm-modal-header h2 {
            margin: 0;
            font-size: 18px;
            color: var(--text-color);
            font-weight: 600;
        }
        .gm-modal-close {
            background: none;
            border: none;
            font-size: 28px;
            font-weight: 300;
            color: #888;
            cursor: pointer;
            line-height: 1;
            padding: 0 5px;
        }
        .gm-modal-close:hover {
            color: #000;
        }

        /* 弹窗内容 */
        .gm-modal-body {
            padding: 24px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        .gm-form-item {
            display: flex;
            flex-direction: column;
            grid-column: span 1; /* 默认占一列 */
        }
        .gm-form-item.full-width {
            grid-column: span 2; /* 占满两列 */
        }
        .gm-form-item label {
            margin-bottom: 6px;
            font-size: 14px;
            font-weight: 500;
            color: #555;
        }
        .gm-form-item input, .gm-form-item textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--gray-border);
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s, box-shadow 0.2s;
            box-sizing: border-box; /* 重要 */
        }
        .gm-form-item input:focus, .gm-form-item textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
        }
        .gm-form-item textarea {
            resize: vertical;
            min-height: 80px;
        }

        /* 结果显示区域 */
        #gm-result-display {
            padding: 12px;
            border-radius: 8px;
            margin-top: 8px;
            text-align: center;
            font-weight: 500;
            display: none; /* 默认隐藏 */
        }
        #gm-result-display.success {
            background-color: #e9f7ec;
            color: var(--success-color);
        }
        #gm-result-display.error {
            background-color: #fdecea;
            color: var(--error-color);
        }

        /* 弹窗底部 */
        .gm-modal-footer {
            padding: 16px 24px;
            border-top: 1px solid var(--gray-border);
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
        .gm-button {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }
        .gm-button.primary {
            background-color: var(--primary-color);
            color: white;
        }
        .gm-button.primary:hover {
            background-color: var(--primary-hover);
        }
        .gm-button.secondary {
            background-color: var(--light-gray);
            color: var(--text-color);
            border: 1px solid var(--gray-border);
        }
        .gm-button.secondary:hover {
            background-color: #e2e6ea;
        }
        .gm-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        /* 加载动画 */
        .gm-loader {
            border: 2px solid #f3f3f3;
            border-top: 2px solid var(--primary-color);
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: gm-spin 1s linear infinite;
            display: inline-block;
            margin-right: 8px;
        }
        @keyframes gm-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* 输入框高亮效果 */
        .gm-input-highlight {
            background-color: #e9f7ec !important;
            box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.25) !important;
            transition: all 0.4s ease-in-out;
        }
    `);

    // 2. --- 创建 HTML 结构 ---
    const modalHTML = `
        <div class="gm-modal-backdrop"></div>
        <div class="gm-modal-container">
            <div class="gm-modal-header">
                <h2>验证码获取助手</h2>
                <button class="gm-modal-close">&times;</button>
            </div>
            <div class="gm-modal-body">
                <div class="gm-form-item">
                    <label for="gm-userName">邮箱</label>
                    <input type="text" id="gm-userName" placeholder="cq29u2m5xxx@hotmail.com">
                </div>
                <div class="gm-form-item">
                    <label for="gm-passWord">密码</label>
                    <input type="text" id="gm-passWord" placeholder="XBIi4ip6B49H">
                </div>
                <div class="gm-form-item">
                    <label for="gm-refreshToken">Refresh Token</label>
                    <input type="text" id="gm-refreshToken" placeholder="M.C546_SN1...">
                </div>
                <div class="gm-form-item">
                    <label for="gm-clientId">Client ID</label>
                    <input type="text" id="gm-clientId" placeholder="1b4ba9dd...">
                </div>
                <div class="gm-form-item full-width">
                    <label for="gm-emailStr">自动填充 (邮箱----密码----token----id)</label>
                    <textarea id="gm-emailStr"></textarea>
                </div>
                 <div class="gm-form-item full-width">
                    <div id="gm-result-display"></div>
                </div>
            </div>
            <div class="gm-modal-footer">
                <button class="gm-button secondary" id="gm-autofill-btn">自动填充</button>
                <button class="gm-button primary" id="gm-submit-btn">
                    <span class="gm-btn-text">开始获取</span>
                </button>
            </div>
        </div>
    `;

    const triggerButtonHTML = `
        <button class="gm-trigger-button" title="获取验证码">
            <span>&#128233;</span> </button>
    `;

    // 3. --- 将 HTML 注入到页面 ---
    $('body').append(modalHTML);
    $('body').append(triggerButtonHTML);


    // 4. --- 缓存 jQuery 对象 ---
    const $backdrop = $('.gm-modal-backdrop');
    const $modal = $('.gm-modal-container');
    const $closeBtn = $('.gm-modal-close');
    const $triggerBtn = $('.gm-trigger-button');
    const $submitBtn = $('#gm-submit-btn');
    const $autofillBtn = $('#gm-autofill-btn');
    const $resultDisplay = $('#gm-result-display');

    // 5. --- 编写事件处理逻辑 ---

    // 打开弹窗
    $triggerBtn.on('click', function() {
        $backdrop.addClass('visible');
        $modal.addClass('visible');
    });

    // 关闭弹窗
    function closeModal() {
        $backdrop.removeClass('visible');
        $modal.removeClass('visible');
    }
    $closeBtn.on('click', closeModal);
    $backdrop.on('click', closeModal);


    // 自动填充
    $autofillBtn.on('click', function() {
        const str = $('#gm-emailStr').val();
        const parts = str.split('----').map(p => p.trim());
        if (parts.length >= 4) {
            $('#gm-userName').val(parts[0]);
            $('#gm-passWord').val(parts[1]);
            if (parts[2].length > 45) {
                $('#gm-refreshToken').val(parts[2]);
                $('#gm-clientId').val(parts[3]);
            } else {
                $('#gm-clientId').val(parts[2]);
                $('#gm-refreshToken').val(parts[3]);
            }
        } else if (str) {
            alert('格式错误！\n请确保4个值以 "----" 分隔。');
        }
    });

    // 提交表单
    $submitBtn.on('click', function() {
        const formData = {
            userName: $('#gm-userName').val().trim(),
            passWord: $('#gm-passWord').val().trim(),
            refreshToken: $('#gm-refreshToken').val().trim(),
            clientId: $('#gm-clientId').val().trim()
        };

        if (!formData.userName || !formData.passWord || !formData.refreshToken || !formData.clientId) {
            alert('所有字段均为必填项！');
            return;
        }

        const $btnText = $submitBtn.find('.gm-btn-text');
        const originalText = $btnText.text();
        $submitBtn.prop('disabled', true);
        $btnText.html('<span class="gm-loader"></span>正在获取...');
        $resultDisplay.hide();

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://ppcode.bilivo.top/oauth2',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(formData),
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (response.status === 200 && data.code === 200) {
                    const verificationCode = data.verification_code;
                    $resultDisplay.html(`获取成功！正在自动填入...`).removeClass('error').addClass('success').show();
                    autofillCode(verificationCode);
                } else {
                    $resultDisplay.text(data.message || "获取失败，请重试！").removeClass('success').addClass('error').show();
                }
            },
            onerror: function(error) {
                console.error('GM_xmlhttpRequest Error:', error);
                $resultDisplay.text('请求服务失败，请检查网络或控制台日志。').removeClass('success').addClass('error').show();
            },
            ontimeout: function() {
                $resultDisplay.text('请求超时，请检查网络。').removeClass('success').addClass('error').show();
            },
            onloadend: function() {
                // BUG修复1：无论成功失败，最后都恢复按钮状态
                $submitBtn.prop('disabled', false);
                $btnText.text(originalText);
            }
        });
    });

    // 自动填充函数
    function autofillCode(code) {
        const $targetInput = $('input[placeholder="输入验证码"]');

        if ($targetInput.length > 0) {
            const nativeInput = $targetInput[0];

            // BUG修复2：使用更原生的方式设置值，以兼容 React/Vue 等框架
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(nativeInput, code);

            // 手动触发 input 事件，通知框架更新
            const event = new Event('input', { bubbles: true });
            nativeInput.dispatchEvent(event);

            // 视觉反馈
            $targetInput.addClass('gm-input-highlight');
            setTimeout(() => { $targetInput.removeClass('gm-input-highlight'); }, 1500);

            // 更新弹窗内的成功信息
            $resultDisplay.html(`已自动填入验证码: <b>${code}</b>`);
            // 延迟关闭弹窗
            setTimeout(closeModal, 2000);

        } else {
             $resultDisplay.html(`获取成功！请手动复制: <b>${code}</b> <br>(未在页面上找到验证码输入框)`)
                                 .removeClass('error').addClass('success').show();
        }
    }

})(jQuery);