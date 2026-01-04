// ==UserScript==
// @name         福利吧分享 屋里社 GIF剧情图解破解VIP隐藏-查看GIF出处番号 GIF图解出处
// @namespace    http://tampermonkey.net/
// @version      2025-07-07
// @description  破解VIP 福利视频 GIF出处剧情图解 查看出处番号
// @author       You
// @match        https://gifbb.cc
// @match        https://wulishe.cc
// @match        http://144.34.234.186:9999/*
// @match        http://144.34.234.186:8899/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541778/%E7%A6%8F%E5%88%A9%E5%90%A7%E5%88%86%E4%BA%AB%20%E5%B1%8B%E9%87%8C%E7%A4%BE%20GIF%E5%89%A7%E6%83%85%E5%9B%BE%E8%A7%A3%E7%A0%B4%E8%A7%A3VIP%E9%9A%90%E8%97%8F-%E6%9F%A5%E7%9C%8BGIF%E5%87%BA%E5%A4%84%E7%95%AA%E5%8F%B7%20GIF%E5%9B%BE%E8%A7%A3%E5%87%BA%E5%A4%84.user.js
// @updateURL https://update.greasyfork.org/scripts/541778/%E7%A6%8F%E5%88%A9%E5%90%A7%E5%88%86%E4%BA%AB%20%E5%B1%8B%E9%87%8C%E7%A4%BE%20GIF%E5%89%A7%E6%83%85%E5%9B%BE%E8%A7%A3%E7%A0%B4%E8%A7%A3VIP%E9%9A%90%E8%97%8F-%E6%9F%A5%E7%9C%8BGIF%E5%87%BA%E5%A4%84%E7%95%AA%E5%8F%B7%20GIF%E5%9B%BE%E8%A7%A3%E5%87%BA%E5%A4%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

// ==UserScript==
// @name         显示并优化Meta描述信息
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  从meta描述标签中提取内容，自动清理[vip]和[erphpdown]等多余标签，并格式化显示在页面顶部。
// @author       Gemini
// @match        http://144.34.234.186:9999/*.html
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 1. 定位到包含描述信息的meta标签
    const metaDescription = document.querySelector('meta[name="description"]');

    if (metaDescription) {
        // 2. 提取content属性的原始值
        const originalContent = metaDescription.getAttribute('content');

        if (originalContent && originalContent.trim() !== '') {

            // 3. **核心优化步骤：清理和格式化文本**
            let cleanedContent = originalContent
                // 使用正则表达式移除所有 [vip]、[/vip]、[erphpdown]、[/erphpdown] 标签
                .replace(/\[\/?(vip|erphpdown)\]/g, ' ')
                // 将文本中重复的 "GIF出处" 替换为空格，避免信息冗余
                .replace(/GIF出处/g, ' ')
                // 将多个连续的空格或换行符替换为单个空格
                .replace(/\s+/g, ' ')
                // 去除字符串开头和结尾的空格
                .trim();

            // 4. 创建一个新的div元素来显示提取到的信息
            const infoBox = document.createElement('div');

            // 5. 为这个div添加样式，使其更显眼
            infoBox.style.padding = '15px';
            infoBox.style.marginBottom = '20px';
            infoBox.style.border = '2px dashed #00afa3'; // 换个颜色以示区分
            infoBox.style.backgroundColor = '#f0f8f7';
            infoBox.style.color = '#333';
            infoBox.style.fontSize = '18px'; // 字体稍大一些
            infoBox.style.lineHeight = '1.7';
            infoBox.style.fontWeight = 'bold'; // 加粗显示代码
            infoBox.style.wordBreak = 'break-all';

            // 6. 设置div的内部HTML内容，使用清理后的文本
            infoBox.innerHTML = `<h3 style="margin-top: 0; margin-bottom: 10px; font-size:16px; font-weight:normal; border-bottom: 1px solid #ddd; padding-bottom: 8px;">[优化后] 提取的出处信息：</h3><p style="margin: 0;">${cleanedContent}</p>`;

            // 7. 找到要在其前面插入新div的元素（文章内容区域）
            const articleContent = document.querySelector('.article-content');

            // 8. 将新创建的div插入到它的前面
            if (articleContent) {
                articleContent.parentNode.insertBefore(infoBox, articleContent);
            } else {
                // 备用方案
                document.body.prepend(infoBox);
            }
        }
    }
})();
})();