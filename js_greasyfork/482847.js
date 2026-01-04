// ==UserScript==
// @name         CNKI保存结果页面
// @version      1.4
// @description  在结果页面右下角添加保存按钮，点击后保存数据为JSON并下载所有文献详情页为HTML
// @match        https://kns.cnki.net/kns8s/search*
// @match        https://kns.cnki.net/kns8s/defaultresult/index*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/1237542
// @downloadURL https://update.greasyfork.org/scripts/482847/CNKI%E4%BF%9D%E5%AD%98%E7%BB%93%E6%9E%9C%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/482847/CNKI%E4%BF%9D%E5%AD%98%E7%BB%93%E6%9E%9C%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let executeScript = false;

    // 主函数：提取数据并触发保存
    function main() {
        if (!executeScript) return;
        executeScript = false; // 防止重复执行

        const rows = document.querySelectorAll('tbody tr');
        const data = Array.from(rows).map(row => {
            const titleElement = row.querySelector('.name a.fz14');
            const authors = Array.from(row.querySelectorAll('.author a'))
                .map(a => a.textContent.trim())
                .filter(a => a && !a.includes('+')); // 过滤无效作者

            return {
                title: titleElement ? sanitizeTitle(titleElement.textContent.trim()) : '',
                href: titleElement?.href || '',
                authors: authors,
                source: row.querySelector('.source a')?.textContent.trim() || '',
                date: row.querySelector('.date')?.textContent.trim() || '',
                type: row.querySelector('.data span')?.textContent.trim() || ''
            };
        });

        // 保存原始数据为JSON
        const defaultFilename = getDefaultFilename() + '.json';
        saveData(JSON.stringify(data, null, 2), defaultFilename, 'application/json');

        // 逐个下载HTML详情页（随机延迟防止封禁）
        data.forEach((item, index) => {
            if (!item.href) return;
            setTimeout(() => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: item.href,
                    onload: (resp) => {
                        const filename = `${sanitizeTitle(item.title)}.html`;
                        saveData(resp.responseText, filename, 'text/html');
                    },
                    onerror: (err) => console.error('下载失败:', item.title, err)
                });
            }, index * (1500 + Math.random() * 1000)); // 1.5-2.5秒随机延迟
        });
    }

    // 生成默认文件名（基于检索条件中的作者）
    function getDefaultFilename() {
        /* 新选择器层级说明：
           span.conditions → 条件栏容器
           a → 包含检索条件的链接
           文本结构：">作者：陈国伟"
        */
        const conditionText = document.querySelector('span.conditions a')?.textContent || '';

        // 使用更精确的正则表达式提取
        const authorMatch = conditionText.match(/作者：\s*([^<]+)/);
        if(authorMatch && authorMatch[1]) {
            return sanitizeTitle(authorMatch[1].split(/[;；]/)[0]); // 取第一个作者
        }
        return 'CNKI_Data'; // 默认值
    }

    // 清理文件名函数（增强特殊字符处理）
    function sanitizeTitle(str) {
        return str
            .replace(/[\u00A0]/g, ' ')    // 替换不间断空格
            .replace(/[\\/:*?"<>|《》]/g, '_')
            .replace(/\s{2,}/g, ' ')      // 合并多个空格
            .trim()
            .substring(0, 50);            // 限制长度
    }

    // 通用保存函数（自动根据类型添加后缀）
    function saveData(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            URL.revokeObjectURL(url);
            link.remove();
        }, 100);
    }

    // 添加悬浮按钮
    const button = document.createElement('div');
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        background: '#2196F3',
        borderRadius: '50%',
        textAlign: 'center',
        lineHeight: '50px',
        color: 'white',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        zIndex: 9999
    });
    button.textContent = '↓';
    button.title = '保存本页数据（JSON + HTML）';
    button.onclick = () => {
        executeScript = true;
        main();
        button.textContent = '...';
        setTimeout(() => button.textContent = '↓', 3000);
    };
    document.body.appendChild(button);

    // 监听AJAX加载（适用于分页场景）
    let lastPageCount = 0;
    const observer = new MutationObserver(() => {
        const currentCount = document.querySelectorAll('tbody tr').length;
        if (currentCount !== lastPageCount) {
            lastPageCount = currentCount;
            console.log('检测到DOM更新，重新挂载按钮');
            button.style.display = 'block'; // 防止分页时按钮消失
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();