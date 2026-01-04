// ==UserScript==
// @name         云平台今日验证码
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  每日首次访问输入验证码，后续自动显示，并可一键复制
// @author       眇眇然坚
// @match        http://111.229.11.44:8888/*
// @match        http://gcms.gwifi.com.cn:8888/*
// @grant        GM_setClipboard
// @icon    data:image/x-icon;base64,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
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/540414/%E4%BA%91%E5%B9%B3%E5%8F%B0%E4%BB%8A%E6%97%A5%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/540414/%E4%BA%91%E5%B9%B3%E5%8F%B0%E4%BB%8A%E6%97%A5%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取今天的日期字符串
    function getTodayStr() {
        const now = new Date();
        return now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
    }

    const today = getTodayStr();
    const codeKey = 'today_code_' + today;
    const settingKey = 'today_code_copy_setting';

    // 获取设置
    function getCopySetting() {
        return localStorage.getItem(settingKey) === 'true';
    }

    // 设置设置
    function setCopySetting(val) {
        localStorage.setItem(settingKey, val ? 'true' : 'false');
    }

    // 显示验证码弹窗（右下角悬浮窗，饿了么风格）
    function showCodeDialog(code) {
        // 创建弹窗
        let dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.bottom = '30px';
        dialog.style.right = '30px';
        dialog.style.left = 'auto';
        dialog.style.top = 'auto';
        dialog.style.transform = 'none';
        dialog.style.background = '#fff';
        dialog.style.border = 'none';
        dialog.style.padding = '24px 32px';
        dialog.style.zIndex = 9999;
        dialog.style.boxShadow = '0 4px 24px rgba(0,160,255,0.15)';
        dialog.style.textAlign = 'center';
        dialog.style.minWidth = '240px';
        dialog.style.borderRadius = '16px';
        dialog.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
        dialog.style.border = '1.5px solid #00aaff';

        let codeElem = document.createElement('div');
        codeElem.textContent = '今日验证码：' + code;
        codeElem.style.fontSize = '22px';
        codeElem.style.marginBottom = '20px';
        codeElem.style.color = '#222';
        dialog.appendChild(codeElem);

        // 复制按钮（饿了么风格）
        let copyBtn = document.createElement('button');
        copyBtn.textContent = '复制验证码';
        copyBtn.style.background = 'linear-gradient(90deg, #00aaff 0%, #0084ff 100%)';
        copyBtn.style.color = '#fff';
        copyBtn.style.border = 'none';
        copyBtn.style.borderRadius = '8px';
        copyBtn.style.padding = '10px 28px';
        copyBtn.style.fontSize = '16px';
        copyBtn.style.cursor = 'pointer';
        copyBtn.style.boxShadow = '0 2px 8px rgba(0,160,255,0.10)';
        copyBtn.style.transition = 'background 0.2s';
        copyBtn.onmouseover = function() {
            copyBtn.style.background = 'linear-gradient(90deg, #0084ff 0%, #00aaff 100%)';
        };
        copyBtn.onmouseout = function() {
            copyBtn.style.background = 'linear-gradient(90deg, #00aaff 0%, #0084ff 100%)';
        };
        copyBtn.onclick = function() {
            GM_setClipboard(code);
            // 饿了么风格的轻提示
            let tip = document.createElement('div');
            tip.textContent = '已复制到剪贴板';
            tip.style.position = 'fixed';
            tip.style.bottom = '100px';
            tip.style.right = '50px';
            tip.style.background = '#00aaff';
            tip.style.color = '#fff';
            tip.style.padding = '10px 24px';
            tip.style.borderRadius = '8px';
            tip.style.boxShadow = '0 2px 8px rgba(0,160,255,0.10)';
            tip.style.fontSize = '16px';
            tip.style.zIndex = 10000;
            document.body.appendChild(tip);
            setTimeout(() => { tip.remove(); }, 1200);
        };
        dialog.appendChild(copyBtn);

        // 关闭按钮（饿了么风格）
        let closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.marginLeft = '16px';
        closeBtn.style.background = '#f5f7fa';
        closeBtn.style.color = '#0084ff';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '8px';
        closeBtn.style.padding = '10px 24px';
        closeBtn.style.fontSize = '16px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.boxShadow = '0 2px 8px rgba(0,160,255,0.05)';
        closeBtn.onclick = function() {
            dialog.remove();
        };
        dialog.appendChild(closeBtn);

        document.body.appendChild(dialog);

        // 10秒后自动关闭弹窗
        setTimeout(() => {
            if (dialog.parentNode) dialog.remove();
        }, 10000);
    }

    // 显示验证码输入弹窗（右下角悬浮窗，饿了么风格）
    function showInputDialog(onSubmit) {
        let dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.bottom = '30px';
        dialog.style.right = '30px';
        dialog.style.left = 'auto';
        dialog.style.top = 'auto';
        dialog.style.transform = 'none';
        dialog.style.background = '#fff';
        dialog.style.border = 'none';
        dialog.style.padding = '24px 32px';
        dialog.style.zIndex = 9999;
        dialog.style.boxShadow = '0 4px 24px rgba(0,160,255,0.15)';
        dialog.style.textAlign = 'center';
        dialog.style.minWidth = '260px';
        dialog.style.borderRadius = '16px';
        dialog.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
        dialog.style.border = '1.5px solid #00aaff';

        let titleElem = document.createElement('div');
        titleElem.textContent = '请输入今日验证码';
        titleElem.style.fontSize = '20px';
        titleElem.style.marginBottom = '16px';
        titleElem.style.color = '#222';
        dialog.appendChild(titleElem);

        let inputElem = document.createElement('input');
        inputElem.type = 'text';
        inputElem.placeholder = '输入验证码';
        inputElem.style.width = '80%';
        inputElem.style.padding = '8px 12px';
        inputElem.style.fontSize = '16px';
        inputElem.style.border = '1px solid #d0e2ff';
        inputElem.style.borderRadius = '6px';
        inputElem.style.marginBottom = '18px';
        inputElem.style.outline = 'none';
        inputElem.style.boxSizing = 'border-box';
        dialog.appendChild(inputElem);
        dialog.appendChild(document.createElement('br'));

        let submitBtn = document.createElement('button');
        submitBtn.textContent = '提交';
        submitBtn.style.background = 'linear-gradient(90deg, #00aaff 0%, #0084ff 100%)';
        submitBtn.style.color = '#fff';
        submitBtn.style.border = 'none';
        submitBtn.style.borderRadius = '8px';
        submitBtn.style.padding = '10px 28px';
        submitBtn.style.fontSize = '16px';
        submitBtn.style.cursor = 'pointer';
        submitBtn.style.boxShadow = '0 2px 8px rgba(0,160,255,0.10)';
        submitBtn.style.transition = 'background 0.2s';
        submitBtn.onmouseover = function() {
            submitBtn.style.background = 'linear-gradient(90deg, #0084ff 0%, #00aaff 100%)';
        };
        submitBtn.onmouseout = function() {
            submitBtn.style.background = 'linear-gradient(90deg, #00aaff 0%, #0084ff 100%)';
        };
        submitBtn.onclick = function() {
            let val = inputElem.value.trim();
            if (!val) {
                inputElem.style.border = '1.5px solid #ff4d4f';
                inputElem.placeholder = '请输入验证码';
                return;
            }
            dialog.remove();
            onSubmit(val);
        };
        dialog.appendChild(submitBtn);

        // 关闭按钮
        let closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.marginLeft = '16px';
        closeBtn.style.background = '#f5f7fa';
        closeBtn.style.color = '#0084ff';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '8px';
        closeBtn.style.padding = '10px 24px';
        closeBtn.style.fontSize = '16px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.boxShadow = '0 2px 8px rgba(0,160,255,0.05)';
        closeBtn.onclick = function() {
            dialog.remove();
        };
        dialog.appendChild(closeBtn);

        document.body.appendChild(dialog);
    }

    // 主逻辑
    let code = localStorage.getItem(codeKey);
    if (!code) {
        // 首次访问，弹出输入弹窗
        showInputDialog(function(val) {
            localStorage.setItem(codeKey, val);
            GM_setClipboard(val);
            showCodeDialog(val);
        });
    } else {
        // 已有验证码，自动复制并弹窗
        GM_setClipboard(code);
        showCodeDialog(code);
    }
})();