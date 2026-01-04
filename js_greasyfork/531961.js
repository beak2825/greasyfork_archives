// ==UserScript==
// @name         dabanke-历史数据
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  导出文一科技历史交易数据到Markdown
// @author       YourName
// @match        *://www.dabanke.com/hangqing-*.html
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531961/dabanke-%E5%8E%86%E5%8F%B2%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/531961/dabanke-%E5%8E%86%E5%8F%B2%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 创建卡片内按钮
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="bi bi-file-earmark-code"></i> 生成Markdown';
    btn.className = 'btn btn-sm btn-outline-danger ms-3';
    btn.style.verticalAlign = 'middle';

    // 创建增强版弹窗
    const modal = `
    <div class="modal fade" id="dataModal" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header bg-light">
                    <h5 class="modal-title text-danger">数据预览 - 文一科技</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-0">
                    <div class="d-flex">
                        <!-- 预览区域 -->
                        <div class="flex-grow-1 p-3 border-end" id="previewArea"
                             style="max-height: 600px; overflow-y: auto;">
                        </div>
                        <!-- 源码区域 -->
                        <textarea id="markdownSource" class="d-none"></textarea>
                    </div>
                </div>
                <div class="modal-footer bg-light">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                    <button type="button" class="btn btn-success" id="copyBtn">
                        <i class="bi bi-clipboard"></i> 复制Markdown源码
                    </button>
                </div>
            </div>
        </div>
    </div>`;

    // 添加点击事件
    btn.addEventListener('click', () => {
        // 获取标题
        const header = document.querySelector('.card-header').innerText;

        // 获取表格数据
        const table = document.querySelector('.table');
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
        const rows = Array.from(table.querySelectorAll('tbody tr')).map(row =>
            Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim())
        );

        // 生成Markdown
        let markdown = `# ${header}\n\n`;
        markdown += `| ${headers.join(' | ')} |\n`;
        markdown += `| ${headers.map(() => '---').join(' | ')} |\n`;
        rows.forEach(row => {
            markdown += `| ${row.join(' | ')} |\n`;
        });

        // 插入内容到弹窗
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modal;
        document.body.appendChild(tempDiv);

        // 填充数据
        document.getElementById('markdownSource').value = markdown;

        // 生成预览HTML
        const previewArea = document.getElementById('previewArea');
        previewArea.innerHTML = `
            <h3 class="text-center mb-3">${header}</h3>
            <table class="table table-bordered table-hover">
                <thead class="table-light">
                    <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${rows.map(row =>
                        `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
                    ).join('')}
                </tbody>
            </table>
        `;

        // 初始化模态框
        const myModal = new bootstrap.Modal(document.getElementById('dataModal'));
        myModal.show();

        // 复制按钮事件
        document.getElementById('copyBtn').addEventListener('click', () => {
            const source = document.getElementById('markdownSource').value;
            navigator.clipboard.writeText(source)
                .then(() => {
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> 复制成功！';
                    setTimeout(() => btn.innerHTML = originalHTML, 2000);
                })
                .catch(err => console.error('复制失败:', err));
        });
    });

    // 将按钮添加到数据卡片
    const dataCard = document.querySelector('.card.mt-3.mb-3');
    if (dataCard) {
        const cardHeader = dataCard.querySelector('.card-header');
        if (cardHeader) {
            // 创建按钮容器
            const btnGroup = document.createElement('div');
            btnGroup.className = 'd-inline-block float-end';
            btnGroup.appendChild(btn);
            // 插入到标题文字后面
            cardHeader.appendChild(btnGroup);
        }
    }
})();