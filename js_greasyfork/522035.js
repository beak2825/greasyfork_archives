// ==UserScript==
// @name         百家号信息查询
// @namespace    https://github.com/your-repo-link
// @version      1.19
// @description  显示百家号名称、粉丝量、BID、UID、UK、MCN信息
// @license      MIT
// @match        https://baijiahao.baidu.com/*
// @match        https://author.baidu.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/522035/%E7%99%BE%E5%AE%B6%E5%8F%B7%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/522035/%E7%99%BE%E5%AE%B6%E5%8F%B7%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否已经执行过脚本
    if (window.bjInfoInserted) {
        console.log('百家号信息已插入，脚本已跳过执行。');
        return;
    }

    window.bjInfoInserted = true; // 设置标志，防止重复执行

    // 在带有 displaytype_exinfo 属性的元素中，解析 UID
    function extractUidFromUgc(userInfo) {
        const ugcEls = document.querySelectorAll('[displaytype_exinfo]');
        for (const el of ugcEls) {
            try {
                const raw = el.getAttribute('displaytype_exinfo');
                const decoded = raw.replace(/&quot;/g, '"');
                const data = JSON.parse(decoded);
                if (data.uid) {
                    userInfo['UID'] = data.uid;
                    console.log('从 displaytype_exinfo 中获取到 UID:', data.uid);
                    break; // 找到后退出循环
                }
            } catch (e) {
                console.warn('解析 displaytype_exinfo 出错:', e);
            }
        }
    }

    // 从页面中提取百家号信息
    function extractUserInfo() {
        const userInfo = {
            '名称': document.querySelector('h2.name')?.textContent.trim() || '未知',
            '粉丝量': extractFansCount(),
            'UID': '非UGC作者', // 默认值，如果找到会更新
            'BID': '未知',
            'UK': '未知'
            // 'MCN': '未知' // 不初始化 MCN，避免未找到时显示
        };

        const scripts = document.querySelectorAll('script:not([src])');
        scripts.forEach(script => {
            const content = script.textContent;
            if (content.includes('bjh_id') || content.includes('uid') || content.includes('uk')) {
                const regex = /"bjh_id":"(\d+)"|"uid":"(\d+)"|"uk":"([\w-]+)"/g;
                let match;
                while ((match = regex.exec(content)) !== null) {
                    if (match[1]) userInfo['BID'] = match[1];
                    if (match[2]) userInfo['UID'] = match[2];
                    if (match[3]) userInfo['UK'] = match[3];
                }
            }
        });

        if (userInfo['UID'] === '非UGC作者') {
            extractUidFromUgc(userInfo);
        }

        // 提取 MCN 信息
        const mcnSpan = Array.from(document.querySelectorAll('span')).find(span =>
            span.textContent.startsWith('MCN:') || span.textContent.startsWith('MCN：')
        );
        if (mcnSpan) {
            const mcnText = mcnSpan.textContent.split(/[:：]/)[1]?.trim();
            if (mcnText) { // 仅在存在有效值时添加 MCN 字段
                userInfo['MCN'] = mcnText;
                console.log('提取到 MCN:', mcnText);
            }
        }

        return userInfo;
    }

    // 精确提取粉丝量
    function extractFansCount() {
        const fansElements = document.querySelectorAll('.pc-user-info .info-item');
        let fansCount = '未知';
        fansElements.forEach(item => {
            if (item.textContent.includes('粉丝')) {
                const numEl = item.querySelector('.info-num');
                if (numEl) {
                    const mainValue = numEl.childNodes[0].nodeValue.trim(); // 获取第一个节点的值，通常是数字
                    const unitEl = item.querySelector('.unit');
                    const unit = unitEl ? unitEl.textContent.trim() : '';
                    fansCount = mainValue + unit; // 正确组合数字和单位
                }
            }
        });
        return fansCount;
    }

    // 创建并显示复制提示
    function showCopyAlert(key) {
        // 创建提示框
        const alertBox = document.createElement('div');
        alertBox.textContent = `已复制“${key}”`;
        alertBox.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.7);
            color: #fff;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(alertBox);

        // 触发动画
        setTimeout(() => {
            alertBox.style.opacity = '1';
        }, 10);

        // 隐藏并移除提示框
        setTimeout(() => {
            alertBox.style.opacity = '0';
            setTimeout(() => {
                alertBox.remove();
            }, 300);
        }, 2000);
    }

    // 备用复制方法，使用 textarea
    function fallbackCopy(textToCopy, keyName) {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showCopyAlert(keyName);
        } catch (err) {
            console.error('备用复制失败:', err);
        }
        document.body.removeChild(textarea);
    }

    // 在指定位置显示信息
    function displayUserInfo(userInfo) {
        // 检查信息容器是否已存在
        if (document.getElementById('baijiahao-info-container')) {
            console.log('信息容器已存在，脚本已跳过插入。');
            return;
        }

        const rightContent = document.querySelector('.right-content');
        if (!rightContent) {
            console.error('未找到 .right-content 元素，无法插入用户信息');
            return;
        }

        // 创建信息容器，仅应用网站的背景样式
        const infoContainer = document.createElement('div');
        infoContainer.id = 'baijiahao-info-container'; // 添加唯一 ID
        infoContainer.style.cssText = `
            margin-top: 20px;
            padding: 20px;
            background-color: #ffffff; /* 设置背景色为白色 */
            border: 1px solid #ddd; /* 设置边框 */
            border-radius: 8px; /* 添加圆角 */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 添加模糊的阴影以增强圆角效果 */
            font-size: 16px;
            line-height: 1.6;
            position: relative;
        `;

        // 添加标题
        const title = document.createElement('h3');
        title.textContent = '百家号信息';
        title.style.cssText = `
            margin-bottom: 15px;
            color: #333;
            font-size: 18px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        `;
        infoContainer.appendChild(title);

        // 创建信息列表容器
        const infoList = document.createElement('div');
        infoList.style.display = 'flex';
        infoList.style.flexDirection = 'column';
        infoList.style.gap = '10px'; // 行间距

        // 添加用户信息
        Object.entries(userInfo).forEach(([key, value]) => {
            const infoRow = document.createElement('div');
            infoRow.style.display = 'flex';
            infoRow.style.alignItems = 'center';

            // 仅在值不为 '未知' 和 '非UGC作者' 时显示
            if (value !== '未知' && value !== '非UGC作者') {
                // 创建标签部分
                const label = document.createElement('div');
                label.textContent = `${key}:`; // 使用英文冒号
                label.style.cssText = `
                    font-weight: bold;
                    color: #333;
                    margin-right: 8px; /* 标签与数值之间的间距 */
                    white-space: nowrap; /* 防止标签换行 */
                `;

                // 创建数值部分
                const valueSpan = document.createElement('span');
                valueSpan.textContent = `${value}`; // 移除前导空格
                valueSpan.className = 'copyable-value';
                valueSpan.setAttribute('data-key', key);
                valueSpan.style.cssText = `
                    cursor: pointer;
                    color: #007BFF; /* 设置颜色以提示可点击 */
                `;
                valueSpan.title = '点击复制';

                // 添加点击事件监听器
                valueSpan.addEventListener('click', () => {
                    const textToCopy = valueSpan.textContent.trim();
                    const keyName = valueSpan.getAttribute('data-key');

                    // 复制到剪贴板
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(textToCopy).then(() => {
                            showCopyAlert(keyName);
                        }).catch(err => {
                            console.error('复制失败:', err);
                            fallbackCopy(textToCopy, keyName);
                        });
                    } else {
                        // 备用复制方法
                        fallbackCopy(textToCopy, keyName);
                    }
                });

                // 组装行
                infoRow.appendChild(label);
                infoRow.appendChild(valueSpan);
                infoList.appendChild(infoRow);
            }
        });

        infoContainer.appendChild(infoList);
        rightContent.appendChild(infoContainer);

        // 可选：添加自适应样式
        injectResponsiveStyles();
    }

    // 注入响应式样式以适应不同屏幕尺寸
    function injectResponsiveStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 600px) {
                #baijiahao-info-container {
                    padding: 15px;
                }
                #baijiahao-info-container h3 {
                    font-size: 16px;
                }
                #baijiahao-info-container div {
                    gap: 8px;
                }
                #baijiahao-info-container span.copyable-value {
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 使用 MutationObserver 监听 .right-content 的变化
    function observeRightContent() {
        const targetNode = document.querySelector('.right-content');
        if (!targetNode) {
            console.error('未找到 .right-content 元素，无法监听 DOM 变化');
            return;
        }

        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 当有新的子节点添加时，提取并显示用户信息
                    const userInfo = extractUserInfo();
                    displayUserInfo(userInfo);
                    // 一旦插入信息后，可以停止观察
                    observer.disconnect();
                    break;
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // 页面加载后提取并显示信息
    window.addEventListener('load', () => {
        const userInfo = extractUserInfo();
        displayUserInfo(userInfo);

        // 监听 .right-content 的动态变化，防止单页应用重复加载
        observeRightContent();
    });
})();
