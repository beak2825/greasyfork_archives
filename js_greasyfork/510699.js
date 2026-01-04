// ==UserScript==
// @name         文本翻译脚本
// @namespace    https://example.com
// @version      1.0
// @description  鼠标左键选中文本后，自动请求翻译并显示结果
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/510699/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/510699/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Function to decode HTML entities
    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
 
    // 创建气泡样式
    const tooltipStyle = `
        position: absolute;
        z-index: 9999;
        background-color: #333;
        color: #fff;
        padding: 5px;
        font-size: 14px;
        border-radius: 3px;
        max-width: 450px;
        text-align: left;
        white-space: normal;
        word-wrap: break-word;
        pointer-events: auto;
    `;
 
    const buttonStyle = `
        background-color: #555;
        color: #fff;
        border: none;
        padding: 5px 10px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 12px;
        margin: 5px 2px;
        cursor: pointer;
        border-radius: 2px;
    `;
 
    // 创建气泡元素
    function createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.id = 'translation-tooltip';
        tooltip.style.cssText = tooltipStyle;
        return tooltip;
    }
 
    // 显示气泡
    function showTooltip(text, x, y) {
        let tooltip = document.getElementById('translation-tooltip');
        if (!tooltip) {
            tooltip = createTooltip();
            document.body.appendChild(tooltip);
        }
        tooltip.innerHTML = text;
 
        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制';
        copyButton.style.cssText = buttonStyle;
        copyButton.onclick = function() {
            // Decode HTML entities before copying
            const decodedText = decodeHtml(text);
            navigator.clipboard.writeText(decodedText).then(function() {
                // Show success message
                copyButton.textContent = '复制成功';
                setTimeout(function() {
                    copyButton.textContent = '复制';
                }, 2000);
            }, function(err) {
                console.error('复制失败:', err);
            });
        };
        tooltip.appendChild(copyButton);
 
        // Adjust tooltip position
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const tooltipX = Math.max(0, Math.min(x - tooltipWidth / 2, windowWidth - tooltipWidth));
        const tooltipY = Math.max(0, y - tooltipHeight - 10);
 
        tooltip.style.left = tooltipX + 'px';
        tooltip.style.top = tooltipY + 'px';
    }
 
    // 隐藏气泡
    function hideTooltip() {
        const tooltip = document.getElementById('translation-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
 
    // 发送翻译请求
    function translateText(text) {
        const url = 'https://findmyip.net/api/translate.php?text=' + encodeURIComponent(text);
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                const Jresponse = JSON.parse(response.responseText);
                var translation = '内部接口错误，请联系开发者'
                if(Jresponse.code==400){
                    translation = Jresponse.error;
                }else{
                    translation = Jresponse.data.translate_result;
                }
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    const x = rect.left + window.pageXOffset + rect.width / 2;
                    const y = rect.top + window.pageYOffset;
                    showTooltip(translation, x, y);
                }
            },
            onerror: function(error) {
                console.error('翻译请求发生错误:', error);
            }
        });
    }
 
    // 监听鼠标释放事件
    window.addEventListener('mouseup', function(event) {
        if (event.button === 0) { // 鼠标左键
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            if (selectedText !== '') {
                translateText(selectedText);
            } else {
                hideTooltip();
            }
        }
    });
 
    // 初始化气泡元素
    window.addEventListener('DOMContentLoaded', function() {
        createTooltip();
    });
})();