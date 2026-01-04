// ==UserScript==
// @name         Switch520下载优化
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Switch520点击下载按钮后，直接弹出下载地址，无需反复跳转、输入密码
// @author       一身惆怅
// @match        http*://*.gamer520.com/*
// @icon         https://img.piclabo.xyz/2023/10/25/d67adcffb89dd.jpg
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      gamer520.com
// @connect      xxxxx528.com
// @connect      freer.blog
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483288/Switch520%E4%B8%8B%E8%BD%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/483288/Switch520%E4%B8%8B%E8%BD%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(() => {
    'use strict';

    GM_addStyle(`
        .swal2-content { 
            text-align: left !important; 
            line-height: unset !important; 
        } 
        .disabled { 
            pointer-events: none; opacity: 0.7; 
        }
        .settings-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            height: 80px;
            width: 360px;
            transform: translate(-50%, -50%);
            background-color: #333;
            box-shadow: 0 0 8px #00a96f;
            color: white;
            padding: 20px;
            border-radius: 12px;
            z-index: 1000;
        }
        .settings-content {
            position: relative;
        }
        .settings-close {
            position: fixed;
            top: 1px;
            right: 10px;
            font-size: 30px;
            cursor: pointer;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }
        .switch input { 
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
        }
        input:checked + .slider {
            background-color: #00a96f;
        }
        input:focus + .slider {
            box-shadow: 0 0 1px #00a96f;
        }
        input:checked + .slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
        }
        .slider.round {
            border-radius: 34px;
        }
        .slider.round:before {
            border-radius: 50%;
        }
    `);

    const registerMenuCommand = () => {
        GM_registerMenuCommand('⚙️ 设置', openSettingsDialog);
    };

    const openSettingsDialog = () => {
        const settingsDialogHTML = `
        <div id="settings-dialog" class="settings-dialog">
            <div class="settings-content">
                <span class="settings-close">&times;</span>
                <label class="switch">
                    <input type="checkbox" id="onedrive-link-toggle" ${GM_getValue("onedriveLinkEnabled", false) ? "checked" : ""}>
                    <span class="slider round"></span>
                </label>
                <span>Onedrive盘链接显示</span>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', settingsDialogHTML);
        document.getElementById('onedrive-link-toggle').addEventListener('change', toggleOnedriveLink);
        document.querySelector('.settings-close').addEventListener('click', closeSettingsDialog);
    };

    const toggleOnedriveLink = () => {
        const isChecked = document.getElementById('onedrive-link-toggle').checked;
        GM_setValue("onedriveLinkEnabled", isChecked);
    };

    const closeSettingsDialog = () => {
        const settingsDialog = document.getElementById('settings-dialog');
        if (settingsDialog) {
            settingsDialog.remove();
        }
    };

    const swalOptions = {
        warning: (message) => ({ title: message, type: "warning" }),
        success: (title, htmlContent) => ({ title, type: "success", html: htmlContent })
    };

    const showMessage = (type, ...args) => Swal.fire(swalOptions[type](...args));

    const request = async (url, method, headers = {}, data = null) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({ method, url, headers, data, onload: (response) => resolve(response.responseText), onerror: reject });
        });
    };

    const disableButton = button => button.classList.add('disabled');
    const enableButton = button => button.classList.remove('disabled');

    const parseHTML = responseText => new DOMParser().parseFromString(responseText, "text/html");

    const copyTextToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    };

    const handleCopyCodeClick = event => {
        if (event.target.matches('.copy-code-link')) {
            copyTextToClipboard(event.target.dataset.code);
            event.preventDefault();
        }
    };

    const extractCodeAndModifyLink = (linkElement, siblingParagraph) => {
        const codeRegex = /(?:提取码|解压密码|如遇到有带x的提取码请手打输入)[:：]\s*(\w+)/;
        const codeMatch = siblingParagraph?.textContent.match(codeRegex);
        if (codeMatch) {
            const [, code] = codeMatch;
            linkElement.href = `${linkElement.href}?pwd=${code}`;
            linkElement.textContent += `?pwd=${code}`;
            siblingParagraph.remove();
        }
    };

    const modifyContentElement = (contentElement) => {
        contentElement.querySelectorAll('p').forEach((paragraph) => {
            paragraph.querySelectorAll('a').forEach((link) => {
                link.setAttribute('target', '_blank');
                if (link.href.includes('pan.baidu.com') && !link.href.includes('pwd=')) {
                    extractCodeAndModifyLink(link, paragraph.nextElementSibling);
                }
            });

            const codeMatch = paragraph.textContent.match(/(?:提取码|解压密码)[:：]\s*([\w.]+)/);
            if (codeMatch) {
                const codeType = paragraph.textContent.includes('提取码') ? '提取码' : '解压密码';
                paragraph.innerHTML = `<a href="#" class="copy-code-link" data-code="${codeMatch[1]}">点击复制${codeType}: ${codeMatch[1]}</a>`;
            } else if (paragraph.textContent.includes('Onedrive盘下载')) {
                paragraph.innerHTML = `<br>`;
            }
        });
    };

    const getDownloadHTML = async (url) => {
        try {
            const responseText = await request(url, 'GET');
            const doc = parseHTML(responseText);
            const contentElement = doc.querySelector('div.entry-content.u-text-format.u-clearfix');
            const downloadButton = doc.querySelector('a.go-down.btn.btn--secondary.btn--block');
            if (contentElement) {
                modifyContentElement(contentElement);
                let messageHTML = contentElement.innerHTML;
                if (GM_getValue("onedriveLinkEnabled", false) && downloadButton) {
                    const postId = downloadButton.dataset.id;
                    const urlObject = new URL(url);
                    const redirectUrl = await getRedirectUrl(`${urlObject.origin}/go/?post_id=${postId}`);
                    if (redirectUrl) {
                        messageHTML += `<p><strong>Onedrive盘下载:</strong> <a href="${redirectUrl}" target="_blank">点击下载</a>（推荐浏览器直接下载）</p>`;
                    }
                }
                showMessage("success", "已获取下载内容", messageHTML);
            } else {
                showMessage("warning", "未找到下载内容");
            }
        } catch (error) {
            showMessage("warning", "请求失败");
        }
    };

    const submitPassword = async (password, url) => {
        const urlObject = new URL(url);
        const passwordUrl = `${urlObject.origin}/wp-login.php?action=postpass`;
        console.log(passwordUrl);
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        const data = `post_password=${password}&Submit=%E6%8F%90%E4%BA%A4`;
        try {
            await request(passwordUrl, 'POST', headers, data);
            await getDownloadHTML(url);
        } catch (error) {
            showMessage("warning", "提交密码失败");
        }
    };

    const readPassword = async (shareUrl) => {
        try {
            const responseText = await request(shareUrl, 'GET');
            const doc = parseHTML(responseText);
            const passwordElement = doc.querySelector('h1.entry-title');
            if (passwordElement) {
                const passwordMatch = passwordElement.textContent.match(/[A-Za-z0-9]+/);
                if (passwordMatch) {
                    await submitPassword(passwordMatch[0], shareUrl);
                } else {
                    showMessage("warning", "未能成功读取分享页密码");
                }
            } else {
                showMessage("warning", "未找到分享页密码");
            }
        } catch (error) {
            showMessage("warning", "请求失败");
        }
    };

    const getRedirectUrl = async (url) => {
        try {
            const responseText = await request(url, 'GET');
            const redirectRegex = /window.location\s*=\s*['"]([^'"]+)['"]/;
            const redirectMatch = responseText.match(redirectRegex);
            if (redirectMatch && redirectMatch[1]) {
                return redirectMatch[1];
            } else {
                showMessage("warning", "未找到跳转网址");
                return null;
            }
        } catch (error) {
            showMessage("warning", "请求失败，请查看控制台以获取更多信息");
            console.error(error);
            return null;
        }
    };

    const handleButtonClick = async (event) => {
        event.stopPropagation();
        const button = event.target;
        disableButton(button);
        const postId = button.dataset.id;
        const targetUrl = await getRedirectUrl(`https://www.gamer520.com/go/?post_id=${postId}`);
        if (targetUrl) {
            await readPassword(targetUrl);
        }
        enableButton(button);
    };

    const init = () => {
        const payBoxElement = document.querySelector('.go-down');
        if (payBoxElement) {
            registerMenuCommand();
            payBoxElement.addEventListener('click', handleButtonClick, true);
            document.addEventListener('click', handleCopyCodeClick);
        }
    };

    init();
})();