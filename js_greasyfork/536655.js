// ==UserScript==
// @name         HackMyVM 增强
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  HackMyVM 增强脚本
// @author       ChatGPT, Gemini, Grok, azwhikaru
// @match        *://hackmyvm.eu/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/536655/HackMyVM%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/536655/HackMyVM%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 常量 ---
    const LOG_PREFIX = '[HackMyVM 增强]';

    // --- 配置 ---
    const config = {
        keepAlive: {
            enabled: true,
            intervalMs: 60_000,
            url: 'https://hackmyvm.eu/',
        },
        removeCss: {
            enabled: true,
            removeFontFamily: true,
            removeTextShadow: true,
            fontFamilyRegex: /font-family:\s*"Press Start 2P"\s*(?:,\s*[^;]+)?;/gi,
            textShadowRegex: /text-shadow:\s*[^;]+;/gi,
        },
        modifyVmnameColor: {
            enabled: true,
            color: 'black',
        },
        styleDownloadLinks: {
            enabled: true,
            color: '#d0699e',
        },
        updateDownloadUrl: {
            enabled: true,
            selector: 'a.download.js-scroll-trigger[href]',
        },
        hideStickySidebarScrollbar: {
            enabled: false,
        },
        dualFlagSubmit: {
            enabled: true,
            userFlagSelector: '.col .card form',
            submitUrl: 'https://hackmyvm.eu/machines/checkflag.php',
            titleSelector: 'h4.vmtitlel.card-header',
        },
        removeSpanFontSize: {
            enabled: true,
            fontSizeRegex: /font-size:\s*10px\s*;/gi,
        },
        modifyVmtitle2FontSize: {
            enabled: true,
            fontSize: '20px',
        },
        modifyCazPizFontSize: {
            enabled: true,
            fontSize: '20px',
        },
        profileStats: {
            enabled: true,
            profileUrlRegex: /^https:\/\/hackmyvm\.eu\/profile\/\?user=.+$/,
            headerSelector: '.page-header.d-flex.d-md-block.flex-shrink-0',
            logsSelector: '.col-md-8.col-12 .card-body',
        },
    };

    // --- 工具函数 ---
    function log(message, level = 'log') {
        console[level](`${LOG_PREFIX} ${message}`);
    }

    function validateConfig() {
        if (typeof config !== 'object') throw new Error('配置对象缺失');
        if (config.keepAlive.intervalMs < 10_000) {
            log('警告：保持会话活跃间隔太短，设置为10秒', 'warn');
            config.keepAlive.intervalMs = 10_000;
        }
        if (!/^https?:\/\//.test(config.keepAlive.url)) throw new Error('无效的保持会话活跃 URL');
        if (!/^https?:\/\//.test(config.dualFlagSubmit.submitUrl)) throw new Error('无效的提交 URL');
        if (!/^[0-9a-fA-F]{6}$|^#[0-9a-fA-F]{6}$/.test(config.styleDownloadLinks.color)) {
            log('无效的下载链接颜色，使用默认值', 'warn');
            config.styleDownloadLinks.color = '#d0699e';
        }
        if (!/^\d+px$/.test(config.modifyVmtitle2FontSize.fontSize)) {
            log('无效的 vmtitle2 字体大小，使用默认值', 'warn');
            config.modifyVmtitle2FontSize.fontSize = '20px';
        }
        if (!/^\d+px$/.test(config.modifyCazPizFontSize.fontSize)) {
            log('无效的 caz.piz 字体大小，使用默认值', 'warn');
            config.modifyCazPizFontSize.fontSize = '20px';
        }
    }

    function runWhenDomReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback, { once: true });
        } else {
            callback();
        }
    }

    // --- 保持会话活跃 ---
    function setupKeepAlive() {
        if (!config.keepAlive.enabled) {
            log('保持会话活跃功能已禁用。');
            return;
        }

        const keepAlive = () => {
            GM_xmlhttpRequest({
                method: 'HEAD',
                url: config.keepAlive.url,
                onload: res => log(res.status >= 200 && res.status < 300 ? '保持会话活跃：请求成功。' : `保持会话活跃：请求失败，状态码：${res.status}`, res.status >= 200 && res.status < 300 ? 'log' : 'warn'),
                onerror: err => log(`保持会话活跃：请求错误：${err}`, 'error'),
            });
        };

        try {
            keepAlive();
            setInterval(keepAlive, config.keepAlive.intervalMs);
            log('保持会话活跃脚本已启动。');
        } catch (e) {
            log(`保持会话活跃设置失败：${e}`, 'error');
        }
    }

    // --- 移除 CSS ---
    function removeStyles() {
        if (!config.removeCss.enabled) {
            log('CSS 移除功能已禁用。');
            return;
        }

        try {
            for (const sheet of Array.from(document.styleSheets)) {
                try {
                    for (const rule of Array.from(sheet.cssRules || [])) {
                        if (!rule.style || typeof rule.style.cssText !== 'string') continue;
                        let cssText = rule.style.cssText;
                        if (config.removeCss.removeFontFamily) cssText = cssText.replace(config.removeCss.fontFamilyRegex, '');
                        if (config.removeCss.removeTextShadow) cssText = cssText.replace(config.removeCss.textShadowRegex, '');
                        if (cssText !== rule.style.cssText) rule.style.cssText = cssText;
                    }
                } catch (e) {
                    // 忽略跨域样式表错误
                }
            }
            log('CSS 移除脚本已启动。');
        } catch (e) {
            log(`CSS 移除失败：${e}`, 'error');
        }
    }

    // --- 移除 Span 字体大小 ---
    function removeSpanFontSize() {
        if (!config.removeSpanFontSize.enabled) {
            log('Span 字体大小移除功能已禁用。');
            return;
        }

        try {
            for (const sheet of Array.from(document.styleSheets)) {
                try {
                    for (const rule of Array.from(sheet.cssRules || [])) {
                        if (!rule.style || typeof rule.style.cssText !== 'string' || !rule.selectorText?.includes('span')) continue;
                        let cssText = rule.style.cssText.replace(config.removeSpanFontSize.fontSizeRegex, '');
                        if (cssText !== rule.style.cssText) rule.style.cssText = cssText;
                    }
                } catch (e) {
                    // 忽略跨域样式表错误
                }
            }
            GM_addStyle('span { font-size: inherit !important; }');
            log('Span 字体大小移除脚本已启动。');
        } catch (e) {
            log(`Span 字体大小移除失败：${e}`, 'error');
        }
    }

    // --- 样式修改 ---
    function applyStyleModifications() {
        try {
            if (config.modifyVmnameColor.enabled) {
                GM_addStyle(`.vmname { color: ${config.modifyVmnameColor.color} !important; }`);
                log('.vmname 颜色修改脚本已启动。');
            } else {
                log('.vmname 颜色修改功能已禁用。');
            }

            if (config.styleDownloadLinks.enabled) {
                GM_addStyle(`a.download { color: ${config.styleDownloadLinks.color} !important; }`);
                log('下载链接样式脚本已启动。');
            } else {
                log('下载链接样式功能已禁用。');
            }

            if (config.modifyVmtitle2FontSize.enabled) {
                GM_addStyle(`.vmtitle2 { font-size: ${config.modifyVmtitle2FontSize.fontSize} !important; }`);
                log('.vmtitle2 字体大小修改脚本已启动。');
            } else {
                log('.vmtitle2 字体大小修改功能已禁用。');
            }

            if (config.modifyCazPizFontSize.enabled) {
                GM_addStyle(`p.caz.piz { font-size: ${config.modifyCazPizFontSize.fontSize} !important; }`);
                log('p.caz.piz 字体大小修改脚本已启动。');
            } else {
                log('p.caz.piz 字体大小修改功能已禁用。');
            }

            if (config.hideStickySidebarScrollbar.enabled) {
                GM_addStyle('div#sticky-sidebar { overflow: hidden !important; }');
                log('隐藏 div#sticky-sidebar 滚动条脚本已启动。');
            } else {
                log('隐藏 div#sticky-sidebar 滚动条功能已禁用。');
            }
        } catch (e) {
            log(`样式修改失败：${e}`, 'error');
        }
    }

    // --- 更新下载链接 ---
    function updateDownloadLink() {
        if (!config.updateDownloadUrl.enabled) {
            log('下载链接更新功能已禁用。');
            return;
        }

        try {
            const downloadButtons = Array.from(document.querySelectorAll(config.updateDownloadUrl.selector))
                .filter(link => link.textContent.trim() === 'Download');
            if (downloadButtons.length === 0) {
                log('未找到有效的下载按钮，无法更新链接。');
                return;
            }

            downloadButtons.forEach((downloadBtn, index) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: downloadBtn.href,
                    onload: res => {
                        const finalUrl = res.finalUrl || res.responseURL || downloadBtn.href;
                        if (finalUrl !== downloadBtn.href) {
                            downloadBtn.href = finalUrl;
                            log(`下载链接 ${index + 1} 已更新为：${finalUrl}`);
                        } else {
                            log(`下载链接 ${index + 1} 未发生重定向或最终 URL 未更改。`);
                        }
                    },
                    onerror: err => log(`下载链接 ${index + 1} 获取失败：${err}`, 'error'),
                });
            });
            log(`下载链接更新脚本已启动，找到 ${downloadButtons.length} 个有效链接。`);
        } catch (e) {
            log(`下载链接更新失败：${e}`, 'error');
        }
    }

    // --- 双 flag 提交 ---
    function setupDualFlagSubmit() {
        if (!config.dualFlagSubmit.enabled) {
            log('双 flag 提交功能已禁用。');
            return;
        }

        try {
            const titleElement = document.querySelector(config.dualFlagSubmit.titleSelector);
            if (!titleElement || titleElement.textContent !== 'Submit Flag') {
                log('未找到提交 flag 标题或 flag 已提交，跳过双 flag 提交。');
                return;
            }

            const originalFormContainer = document.querySelector(config.dualFlagSubmit.userFlagSelector);
            if (!originalFormContainer) {
                log('未找到原始 flag 表单，无法进行双 flag 提交。');
                return;
            }

            const cardDiv = originalFormContainer.closest('.card');
            if (!cardDiv) {
                log('未找到 flag 表单的卡片容器。');
                return;
            }

            // 动态获取 vm 值
            const vmTitleElement = document.querySelector('h1.vmtitle');
            const vmValue = vmTitleElement ? vmTitleElement.textContent.replace(/[^a-zA-Z0-9]/g, '') : 'Unknown';
            if (vmValue === 'Unknown') {
                log('未找到 vmtitle 元素，vm 值设为 Unknown。', 'warn');
            } else {
                log(`动态获取 vm 值：${vmValue}`);
            }

            const newFlagContainer = document.createElement('div');
            newFlagContainer.innerHTML = `
                <div class="mt-3">
                    <div class="form-group">
                        <label for="userFlag">User Flag</label>
                        <input type="text" id="userFlag" name="userFlag" autocomplete="off" class="form-control" placeholder="User Flag">
                    </div>
                    <div class="form-group mt-2">
                        <label for="rootFlag">Root Flag</label>
                        <input type="text" id="rootFlag" name="rootFlag" autocomplete="off" class="form-control" placeholder="Root Flag">
                    </div>
                    <input type="hidden" name="vm" value="${vmValue}">
                    <button type="button" class="btn btn-outline-primary w-100 mt-3" id="submitBothFlags">提交</button>
                </div>
            `;
            originalFormContainer.parentElement.replaceChild(newFlagContainer, originalFormContainer);

            const toastContainer = document.createElement('div');
            toastContainer.className = 'custom-toast-container';
            document.body.appendChild(toastContainer);

            GM_addStyle(`
                .custom-toast-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1050;
                }
                .custom-toast {
                    min-width: 200px;
                    max-width: 300px;
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                }
                .custom-toast.show {
                    opacity: 1;
                }
                .custom-toast .toast-body {
                    font-size: 14px;
                }
            `);

            const showToast = (message, isSuccess) => {
                const toast = document.createElement('div');
                toast.className = `custom-toast toast bg-${isSuccess ? 'success' : 'danger'} text-white`;
                toast.setAttribute('role', 'alert');
                toast.setAttribute('aria-live', 'assertive');
                toast.setAttribute('aria-atomic', 'true');
                toast.innerHTML = `<div class="toast-body">${message}</div>`;
                toastContainer.appendChild(toast);

                setTimeout(() => toast.classList.add('show'), 100);
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            };

            const submitButton = newFlagContainer.querySelector('#submitBothFlags');
            submitButton.addEventListener('click', () => {
                const userFlag = (newFlagContainer.querySelector('#userFlag')?.value || '').trim();
                const rootFlag = (newFlagContainer.querySelector('#rootFlag')?.value || '').trim();
                const vmValueDynamic = (newFlagContainer.querySelector('input[name="vm"]')?.value || '').trim();

                if (!userFlag && !rootFlag) {
                    showToast('请至少输入一个 flag', false);
                    return;
                }

                const submitFlag = (flag, type) => {
                    if (!flag) return Promise.resolve(null);
                    return new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: config.dualFlagSubmit.submitUrl,
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            data: `flag=${encodeURIComponent(flag)}&vm=${encodeURIComponent(vmValueDynamic)}`,
                            onload: res => {
                                if (res.status >= 200 && res.status < 300) {
                                    const isWrong = res.responseText.includes('Wrong Flag');
                                    log(`${type} flag 已提交。响应：${res.responseText}`);
                                    resolve({ type, isWrong, message: isWrong ? `${type} flag 不正确` : `${type} flag 提交成功` });
                                } else {
                                    log(`${type} flag 提交失败，状态码：${res.status}`, 'error');
                                    reject(new Error(`${type} flag 提交失败，状态码：${res.status}`));
                                }
                            },
                            onerror: err => {
                                log(`${type} flag 提交错误：${err}`, 'error');
                                reject(err);
                            },
                        });
                    });
                };

                Promise.all([submitFlag(userFlag, 'User'), submitFlag(rootFlag, 'Root')])
                    .then(results => {
                        results.filter(Boolean).forEach(result => showToast(result.message, !result.isWrong));
                        if (results.every(result => !result)) showToast('未提交任何 flag', false);
                    })
                    .catch(err => showToast(`提交 flag 错误：${err.message}`, false));
            });
            log('flag 提交脚本已启动。');
        } catch (e) {
            log(`flag 提交失败：${e}`, 'error');
        }
    }

    // --- 个人资料统计 ---
    function setupProfileStats() {
        if (!config.profileStats.enabled) {
            log('个人资料统计功能已禁用。');
            return;
        }

        if (!config.profileStats.profileUrlRegex.test(window.location.href)) {
            log('不在个人资料页面，跳过个人资料统计。');
            return;
        }

        try {
            const header = document.querySelector(config.profileStats.headerSelector);
            if (!header) {
                log('未找到个人资料头部。');
                return;
            }

            const sendMsgButton = header.querySelector('input[value="✉️ Send MSG"]');
            if (!sendMsgButton) {
                log('未找到发送消息按钮。');
                return;
            }

            const statsButtonContainer = document.createElement('div');
            statsButtonContainer.className = 'ml-2 d-inline';
            statsButtonContainer.innerHTML = `
                <input type="button" value="查看统计（按时间顺序）" class="shadow btn btn-primary">
                <input type="button" value="查看统计（按数量排序）" class="shadow btn btn-primary ml-2">
            `;
            sendMsgButton.parentElement.insertAdjacentElement('afterend', statsButtonContainer);

            const logsContainer = document.querySelector(config.profileStats.logsSelector);
            if (!logsContainer) {
                log('未找到日志容器。');
                return;
            }

            const parseLogs = () => {
                const rootStats = {};
                const logEntries = logsContainer.innerHTML.split('<br>').filter(entry => entry.trim());

                logEntries.forEach(entry => {
                    const timestampMatch = entry.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
                    if (!timestampMatch) return;

                    const timestamp = timestampMatch[1];
                    const month = timestamp.slice(0, 7); // 提取 YYYY-MM
                    if (entry.includes('got <strong><span>root</span></strong>')) {
                        rootStats[month] = (rootStats[month] || 0) + 1;
                    }
                });

                return rootStats;
            };

            const displayStats = (sorted) => {
                const stats = parseLogs();
                if (Object.keys(stats).length === 0) {
                    alert('未找到 Root 成就。');
                    return;
                }

                let output = '';
                const months = Object.keys(stats);

                if (sorted) {
                    months.sort((a, b) => stats[b] - stats[a] || a.localeCompare(b));
                    output += months.map(month => `${month}: ${stats[month]}`).join('\n');
                } else {
                    months.sort();
                    output += months.map(month => `${month}: ${stats[month]}`).join('\n');
                }

                alert(output);
            };

            statsButtonContainer.querySelector('input[value="查看统计（按时间顺序）"]').addEventListener('click', () => displayStats(false));
            statsButtonContainer.querySelector('input[value="查看统计（按数量排序）"]').addEventListener('click', () => displayStats(true));

            log('个人资料统计脚本已启动。');
        } catch (e) {
            log(`个人资料统计失败：${e}`, 'error');
        }
    }

    // --- 主执行 ---
    try {
        validateConfig();
        setupKeepAlive();
        runWhenDomReady(() => {
            removeStyles();
            removeSpanFontSize();
            applyStyleModifications();
            updateDownloadLink();
            setupDualFlagSubmit();
            setupProfileStats();
        });
        log('脚本初始化成功。');
    } catch (e) {
        log(`脚本初始化失败：${e}`, 'error');
    }
})();