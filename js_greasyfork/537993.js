// ==UserScript==
// @name         英文大小写转换 (Title Case)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  选中全大写或全小写的英文文本，自动转换为首字母大写
// @author       Saphra
// @match        *://*/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537993/%E8%8B%B1%E6%96%87%E5%A4%A7%E5%B0%8F%E5%86%99%E8%BD%AC%E6%8D%A2%20%28Title%20Case%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537993/%E8%8B%B1%E6%96%87%E5%A4%A7%E5%B0%8F%E5%86%99%E8%BD%AC%E6%8D%A2%20%28Title%20Case%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertToTitleCase(str) {
        if (!str) {
            return '';
        }
        return str.toLowerCase().replace(/(^|\s)\S/g, function(firstChar) {
            return firstChar.toUpperCase();
        });
    }

    document.addEventListener('mouseup', function() {
        setTimeout(function() { // 使用 setTimeout 确保选择已完成
            const selectedText = window.getSelection().toString();

            if (selectedText) {
                // 检查选中的文本是否包含字母
                const containsLetters = /[a-zA-Z]/.test(selectedText);
                if (!containsLetters) {
                    return; // 如果不包含字母，则不处理
                }

                // 检查是否是全大写或全小写
                const isAllUppercase = selectedText === selectedText.toUpperCase();
                const isAllLowercase = selectedText === selectedText.toLowerCase();

                if (isAllUppercase || isAllLowercase) {
                    const convertedText = convertToTitleCase(selectedText);

                    // 尝试替换可编辑元素中的文本
                    const activeElement = document.activeElement;
                    if (activeElement && (activeElement.isContentEditable || activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                        const start = activeElement.selectionStart;
                        const end = activeElement.selectionEnd;
                        // 确保替换只发生在选中的文本上
                        if (activeElement.value.substring(start, end) === selectedText) {
                             activeElement.value = activeElement.value.substring(0, start) + convertedText + activeElement.value.substring(end);
                            activeElement.setSelectionRange(start, start + convertedText.length); // 恢复选择或设置光标位置
                        } else if (activeElement.textContent && activeElement.isContentEditable) { // For contenteditable divs
                            const selection = window.getSelection();
                            const range = selection.getRangeAt(0);
                            range.deleteContents();
                            range.insertNode(document.createTextNode(convertedText));
                        }
                    } else {
                        // 对于不可编辑元素，使用油猴的 GM_setClipboard 复制到剪贴板
                        if (typeof GM_setClipboard !== 'undefined') {
                            GM_setClipboard(convertedText);
                            // 可以在这里添加一个小的视觉提示，例如：
                            // alert('转换后的文本已复制到剪贴板: \n\n"' + convertedText + '"');
                            console.log('转换后的文本已复制到剪贴板:', convertedText);
                        } else {
                            // 如果 GM_setClipboard 不可用 (不应该发生在油猴中)，则使用原生的
                            navigator.clipboard.writeText(convertedText).then(function() {
                                console.log('转换后的文本已复制到剪贴板:', convertedText);
                            }).catch(function(err) {
                                console.error('无法复制到剪贴板:', err);
                            });
                        }
                    }
                }
            }
        }, 100);
    });
})();