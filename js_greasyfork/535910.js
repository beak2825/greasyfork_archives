// ==UserScript==
// @name         微伴信息提取器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  提取 x-token、userId、userProjectId，并导出 txt 文件
// @author       Roy
// @match        https://weiban.mycourse.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535910/%E5%BE%AE%E4%BC%B4%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/535910/%E5%BE%AE%E4%BC%B4%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('✅微伴信息提取器加载中...');

    let extractedData = {
        token: null,
        userId: null,
        userProjectId: null
    };

    // Hook XMLHttpRequest
    const open = XMLHttpRequest.prototype.open;
    const send = XMLHttpRequest.prototype.send;
    const setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function (method, url) {
        this._url = url;
        this._headers = {};
        return open.apply(this, arguments);
    };

    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        this._headers = this._headers || {};
        this._headers[header.toLowerCase()] = value;
        return setRequestHeader.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        const xhr = this;
        xhr.addEventListener('load', function () {
            if (xhr._url.includes('listStudyTask.do')) {
                console.log('命中接口:', xhr._url);

                // 提取 x-token
                const token = xhr._headers['x-token'];
                if (token) {
                    console.log('x-token:', token);
                    extractedData.token = token;
                } else {
                    console.warn('未获取到 x-token');
                }

                // 提取 userId（body中 or 请求参数中）
                const userIdMatch = body && body.match(/userId=([^&]+)/);
                if (userIdMatch) {
                    const userId = decodeURIComponent(userIdMatch[1]);
                    console.log('userId:', userId);
                    extractedData.userId = userId;
                }

                // 提取 userProjectId（响应里）
                try {
                    const json = JSON.parse(xhr.responseText);
                    if (json.data && json.data.length > 0) {
                        const userProjectId = json.data[0].userProjectId;
                        console.log('userProjectId:', userProjectId);
                        extractedData.userProjectId = userProjectId;
                    }
                } catch (e) {
                    console.error('JSON 解析失败:', e);
                }
            }
        });
        return send.apply(this, arguments);
    };

    // 添加导出按钮
    const addExportButton = () => {
        const btn = document.createElement('button');
        btn.innerText = '📥 导出微伴信息';
        btn.style.position = 'fixed';
        btn.style.top = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = 9999;
        btn.style.padding = '10px 16px';
        btn.style.backgroundColor = '#4CAF50';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.fontSize = '14px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        btn.addEventListener('click', () => {
            const content = `x-token: ${extractedData.token || '未获取'}\nuserId: ${extractedData.userId || '未获取'}\nuserProjectId: ${extractedData.userProjectId || '未获取'}`;
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'weiban_info.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
        document.body.appendChild(btn);
    };

    window.addEventListener('load', addExportButton);
})();
