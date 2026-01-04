// ==UserScript==
// @name         长网页分割
// @namespace    http://tampermonkey.net/
// @version      20250518
// @description  将长网页分割成多份并在新标签页中打开。因为有的网页非常长文字太多，调用网页翻译功能会非常卡
// @author       You
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536399/%E9%95%BF%E7%BD%91%E9%A1%B5%E5%88%86%E5%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/536399/%E9%95%BF%E7%BD%91%E9%A1%B5%E5%88%86%E5%89%B2.meta.js
// ==/UserScript==


// 设置分割份数，可以根据需要修改
let NUM_CHUNKS = 3;


(function() {
    'use strict';
    

    
    // 注册菜单命令
    GM_registerMenuCommand("分割网页内容为n份", splitPage);

    // 主函数
    function splitPage() {
        // 获取当前页面的HTML内容
        const fullHTML = document.documentElement.outerHTML;
        const bodyContent = document.body.innerHTML;
        
        // 获取<head>标签内容
        const headContent = document.head.outerHTML;
        
        // 计算每一份的大致长度
        const contentLength = bodyContent.length;
        const chunkSize = Math.floor(contentLength / NUM_CHUNKS);
        
        // 准备HTML片段
        let chunks = [];
        
        // 寻找合适的分割点（尽量在标签结束处分割）
        for (let i = 0; i < NUM_CHUNKS - 1; i++) {
            let idealPosition = (i + 1) * chunkSize;
            let actualPosition = findSplitPosition(bodyContent, idealPosition);
            let startPosition = i === 0 ? 0 : chunks[i-1].endPosition;
            chunks.push({
                content: bodyContent.substring(startPosition, actualPosition),
                endPosition: actualPosition,
                index: i
            });
        }
        // 添加最后一份
        chunks.push({
            content: bodyContent.substring(chunks[NUM_CHUNKS - 2].endPosition),
            index: NUM_CHUNKS - 1
        });
        
        // 创建HTML文档
        const documents = chunks.map(chunk => {
            return `<!DOCTYPE html>
<html>
${headContent}
<body>
<div style="padding: 10px; background-color: #f0f0f0; margin-bottom: 15px; position: sticky; top: 0;">
    <h3>分割页面 - 当前为第 ${chunk.index + 1} 部分 (共${NUM_CHUNKS}部分)</h3>
    <button onclick="window.close()">关闭此页面</button>
</div>
${chunk.content}
<div style="padding: 10px; background-color: #f0f0f0; margin-top: 15px;">
    <p>页面分割结束 - 第 ${chunk.index + 1} 部分</p>
</div>
</body>
</html>`;
        });
        
        // 在新标签页中打开文档
        documents.forEach(doc => {
            const blob = new Blob([doc], {type: 'text/html'});
            const url = URL.createObjectURL(blob);
            GM_openInTab(url);
        });
        
        // 显示操作完成的消息
        alert(`网页已分割成${NUM_CHUNKS}份，并在新标签页中打开`);
    }
    
    // 辅助函数：寻找合适的分割位置
    function findSplitPosition(html, idealPosition) {
        // 尝试在标签结束处分割
        let tagClosePos = html.indexOf('>', idealPosition);
        if (tagClosePos !== -1 && tagClosePos < idealPosition + 100) {
            return tagClosePos + 1;
        }
        
        // 回退找标签结束
        tagClosePos = html.lastIndexOf('>', idealPosition);
        if (tagClosePos !== -1 && tagClosePos > idealPosition - 100) {
            return tagClosePos + 1;
        }
        
        // 如果无法找到合适的标签边界，就直接使用理想位置
        return idealPosition;
    }
})();
