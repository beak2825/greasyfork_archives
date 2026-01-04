// ==UserScript==
// @name         即梦AI图片生成提示词输入框优化
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  修改即梦AI图片生成输入区域高度
// @author       igwen6w@gmail.com
// @match        *://jimeng.jianying.com/ai-tool/image/generate
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533389/%E5%8D%B3%E6%A2%A6AI%E5%9B%BE%E7%89%87%E7%94%9F%E6%88%90%E6%8F%90%E7%A4%BA%E8%AF%8D%E8%BE%93%E5%85%A5%E6%A1%86%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/533389/%E5%8D%B3%E6%A2%A6AI%E5%9B%BE%E7%89%87%E7%94%9F%E6%88%90%E6%8F%90%E7%A4%BA%E8%AF%8D%E8%BE%93%E5%85%A5%E6%A1%86%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        /* 图片生成输入框 */
        #image-input-drag-content {
            height: auto !important;
        }
        /* 视频生成输入框 */
        .inputWrap-R_YEqD .input-pNZvb5 {
            max-height: 1000px !important;
        }
        /* 数字人输入框 */
        .lv-textarea.text-area-PkdMz4 {
            resize: none !important; /* 禁用手动调整 */
            min-height: 40px !important; /* 设置最小高度 */
            overflow-y: hidden !important; /* 隐藏滚动条 */
        }
        .text-input-D2QuFA {
            height: auto !important;
        }
        /* 音乐生成输入框 */
        .audioInputEditor-geWIGo .editor-XkGvbj,.audioInputEditor-cpgXmB .editor-ay1h5m {
            max-height: 1000px !important;
        }
    `);

    // 动态调整 textarea 高度
    function adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto'; // 先重置高度
        textarea.style.height = (textarea.scrollHeight) + 'px'; // 设置新高度
    }

    // 监听 textarea 输入事件
    function setupAutoResizeTextarea() {
        const textarea = document.querySelector('.lv-textarea.text-area-PkdMz4');
        if (textarea) {
            // 初始调整高度
            adjustTextareaHeight(textarea);

            // 监听输入事件
            textarea.addEventListener('input', function() {
                adjustTextareaHeight(this);
            });

            console.log('数字人文本输入，已启用 textarea 自动高度调整');
        } else {
            console.log('数字人文本输入，未找到目标 textarea，可能未加载完成');
        }
    }

    // 如果页面是动态加载的，使用 MutationObserver 检测元素
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAutoResizeTextarea);
    } else {
        setupAutoResizeTextarea();
    }

    // 如果页面是SPA（如Vue/React），可能需要延迟检测或监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        if (document.querySelector('.lv-textarea.text-area-PkdMz4')) {
            setupAutoResizeTextarea();
            observer.disconnect(); // 找到后停止监听
        }
    });

    // 监听整个 body 的子元素变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    console.log('即梦提示词输入框优化成功；作者：igwen6w@gmail.com');
})();