// ==UserScript==
// @name         WHMCS发票超链接增强
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为WHMCS发票页面的每一行添加超链接，方便使用鼠标中键打开新页面
// @author       shedya
// @match        *://*/clientarea.php?action=invoices
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535021/WHMCS%E5%8F%91%E7%A5%A8%E8%B6%85%E9%93%BE%E6%8E%A5%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/535021/WHMCS%E5%8F%91%E7%A5%A8%E8%B6%85%E9%93%BE%E6%8E%A5%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 等待页面完全加载
    window.addEventListener('load', function() {
        // 查找所有带有onclick属性且包含viewinvoice.php的行
        const invoiceRows = document.querySelectorAll('tr[onclick*="viewinvoice.php"]');
        
        invoiceRows.forEach(row => {
            // 提取onclick属性中的URL
            const onclickAttr = row.getAttribute('onclick');
            const match = onclickAttr.match(/viewinvoice\.php\?id=(\d+)/);
            
            if (match && match[1]) {
                const invoiceId = match[1];
                const invoiceUrl = `viewinvoice.php?id=${invoiceId}`;
                
                // 找到第一个单元格（发票ID列）
                const firstCell = row.querySelector('td:first-child');
                if (firstCell) {
                    // 保存原始内容
                    const originalContent = firstCell.innerHTML;
                    
                    // 创建链接元素
                    const link = document.createElement('a');
                    link.href = invoiceUrl;
                    link.innerHTML = originalContent;
                    link.style.textDecoration = 'none'; // 保持原样式
                    link.style.color = 'inherit';
                    link.title = '点击打开发票详情（可使用鼠标中键在新标签页打开）';
                    
                    // 清空单元格并添加链接
                    firstCell.innerHTML = '';
                    firstCell.appendChild(link);
                    
                    // 保持行的原有点击功能
                    link.addEventListener('click', function(e) {
                        e.stopPropagation(); // 防止触发行的onclick事件
                    });
                }
            }
        });
    });
})(); 