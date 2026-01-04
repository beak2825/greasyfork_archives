// ==UserScript==
// @name         Youneed.win - Copy Pre Nodes
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add a button to extract and copy all <pre> contents under dynamic protected-content-XXXX on youneed.win
// @author       suifenging
// @match        https://www.youneed.win/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534325/Youneedwin%20-%20Copy%20Pre%20Nodes.user.js
// @updateURL https://update.greasyfork.org/scripts/534325/Youneedwin%20-%20Copy%20Pre%20Nodes.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 提取所有 <pre> 标签的内容
    function extractAllPreNodes() {
        const container = document.querySelector('[id^="protected-content-"]');
        if (!container) {
            console.warn("未找到动态容器，请稍后再试或等待内容加载完成。");
            return "";
        }

        const preElements = container.querySelectorAll("pre");
        if (preElements.length === 0) {
            console.warn("未找到任何 <pre> 标签内容。");
            return "";
        }

        const contents = Array.from(preElements).reduce((result, pre, index) => {
            const content = pre.textContent.trim();
            if (!content) {
                console.log(`第 ${index + 1} 个 <pre> 标签为空，已跳过。`);
                return result;
            }
            result.push(content);
            return result;
        }, []);

        if (contents.length === 0) {
            console.warn("所有 <pre> 标签均为空。");
            return "";
        }

        return contents.join("\n");
    }

    // 创建按钮
    function createExtractButton() {
        const button = document.createElement('button');
        button.id = 'extract-ss-nodes-btn';
        button.textContent = '📋 复制节点内容';

        Object.assign(button.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: '999999',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'background-color 0.2s ease'
        });

        // 悬停效果
        button.addEventListener('mouseenter', () => button.style.backgroundColor = '#218838');
        button.addEventListener('mouseleave', () => button.style.backgroundColor = '#28a745');

        // 点击事件
        button.addEventListener('click', () => {
            const nodes = extractAllPreNodes();

            if (!nodes) {
                alert('未找到有效的节点内容，请确保页面完全加载后再尝试！');
                return;
            }

            navigator.clipboard.writeText(nodes)
                .then(() => {
                alert('✅ 节点内容已成功复制到剪贴板！');
                console.log('复制成功:\n', nodes);
            })
                .catch(err => {
                console.error('❌ 剪贴板复制失败:', err);
                fallbackCopyTextManually(nodes);
            });
        });

        document.body.appendChild(button);
    }

    // 回退方案：手动创建 textarea 并使用 execCommand 复制（兼容旧浏览器）
    function fallbackCopyTextManually(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert("✅ 已通过备用方式复制到剪贴板！");
        } catch (err) {
            alert("❌ 无法复制到剪贴板，请手动复制以下内容：\n\n" + text);
            console.error("备用复制方法失败:", err);
        }
        document.body.removeChild(textArea);
    }

    // 添加 DOM 观察器以应对动态加载内容
    function setupMutationObserver(callback) {
        const observer = new MutationObserver(() => {
            if (document.querySelector('[id^="protected-content-"]')) {
                observer.disconnect(); // 阻止重复监听
                callback();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 主程序入口
    function main() {
        if (document.querySelector('[id^="protected-content-"]')) {
            createExtractButton();
        } else {
            setupMutationObserver(createExtractButton);
        }
    }

    // 执行主函数
    setTimeout(main, 1000); // 给页面一点时间加载
})();