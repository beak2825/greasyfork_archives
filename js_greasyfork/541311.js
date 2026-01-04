// ==UserScript==
// @name         第一版主网小说下载器
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  支持版主（https://m.diyibanzhu.me/）小说单个目录页的所有章节下载，下载下一页需要自行切换后再次点击下载。交流群：1046755681
// @match        https://m.diyibanzhu.me/wap.php?action=list&id=*
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        window.close
// @run-at       document-end
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/541311/%E7%AC%AC%E4%B8%80%E7%89%88%E4%B8%BB%E7%BD%91%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541311/%E7%AC%AC%E4%B8%80%E7%89%88%E4%B8%BB%E7%BD%91%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 高级样式
    GM_addStyle(`
        #novelDownloadContainer {
            position: fixed !important;
            bottom: 30px !important;
            right: 30px !important;
            z-index: 99999 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        #novelDownloadBtn {
            background: linear-gradient(135deg, #6e8efb, #a777e3) !important;
            color: white !important;
            border: none !important;
            border-radius: 50px !important;
            padding: 12px 24px !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
            display: flex !important;
            align-items: center !important;
            transition: all 0.3s ease !important;
            position: relative !important;
            overflow: hidden !important;
        }

        #novelDownloadBtn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important;
        }

        #novelDownloadBtn:active {
            transform: translateY(0) !important;
        }

        #novelDownloadBtn::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0));
            opacity: 0;
            transition: opacity 0.3s;
        }

        #novelDownloadBtn:hover::after {
            opacity: 1;
        }

        #novelDownloadBtn svg {
            margin-right: 8px !important;
            width: 20px !important;
            height: 20px !important;
            transition: transform 0.3s;
        }

        #novelDownloadBtn:hover svg {
            transform: translateY(-2px);
        }

        .dropdown-menu {
            position: absolute;
            bottom: 100%;
            right: 0;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
            padding: 10px 0;
            margin-bottom: 10px;
            width: 220px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s ease;
            z-index: 100000;
        }

        .dropdown-menu.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .dropdown-item {
            padding: 12px 20px;
            color: #333;
            font-size: 14px;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s;
        }

        .dropdown-item:hover {
            background: #f5f5f5;
            color: #6e8efb;
        }

        .dropdown-item svg {
            margin-right: 10px;
            width: 18px;
            height: 18px;
        }

        .progressWindow {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: #fff !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2) !important;
            padding: 25px !important;
            width: 350px !important;
            max-width: 90vw !important;
            z-index: 100000 !important;
        }

        .progressBar {
            height: 8px !important;
            background: #e0e0e0 !important;
            border-radius: 4px !important;
            margin: 15px 0 !important;
            overflow: hidden !important;
        }

        .progressFill {
            height: 100% !important;
            background: linear-gradient(90deg, #6e8efb, #a777e3) !important;
            border-radius: 4px !important;
            transition: width .3s !important;
        }
    `);

    // 创建高级按钮和下拉菜单
    const createUI = () => {
        // 移除旧按钮
        const oldContainer = document.getElementById('novelDownloadContainer');
        if (oldContainer) oldContainer.remove();

        // 创建新按钮和下拉菜单
        const container = document.createElement('div');
        container.id = 'novelDownloadContainer';
        container.innerHTML = `
            <button id="novelDownloadBtn">
                <svg viewBox="0 0 24 24" fill="white"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                小说工具
            </button>
            <div class="dropdown-menu" id="dropdownMenu">
                <div class="dropdown-item" id="downloadCurrentPage">
                    <svg viewBox="0 0 24 24" fill="#6e8efb"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                    下载本页章节
                </div>
                <div class="dropdown-item" id="joinGroup">
                    <svg viewBox="0 0 24 24" fill="#6e8efb"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                    加入交流群
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // 按钮点击事件
        const btn = container.querySelector('#novelDownloadBtn');
        const dropdown = container.querySelector('#dropdownMenu');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        // 下拉菜单项点击事件
        container.querySelector('#downloadCurrentPage').addEventListener('click', () => {
            dropdown.classList.remove('show');
            showProgressWindow();
        });

        container.querySelector('#joinGroup').addEventListener('click', () => {
            dropdown.classList.remove('show');
            GM_openInTab('https://qun.qq.com/universal-share/share?ac=1&authKey=99OeixWNY4zvn3DIii6c3iDewMHjgtKJWd4IH8Sl0x70XJu4P4bU3XIUUspkiqMu&busi_data=eyJncm91cENvZGUiOiIxMDQ2NzU1NjgxIiwidG9rZW4iOiIyMVZZWElLd0tqUW9aUzJ6eWQwb05UbkNQVUl4MkdDMElBTEJhYmdzMng4TlJEcHU2SEpwRXk5dGhJUVFPSGpvIiwidWluIjoiMjkwMTI1NjQzNSJ9&data=5LI-i7qMVHaqitkwF-5KETtp81V2ugnfoi1UtptIhYMAX6bi7kq-imfPPwKfPnLoNGWISzK3HMQec7J04mN38g&svctype=4&tempid=h5_group_info', {
                active: true
            });
        });

        // 点击页面其他位置关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        // 5秒后检查按钮是否存在
        setTimeout(checkButtonExists, 5000);
    };

    // 检查按钮是否存在
    const checkButtonExists = () => {
        if (!document.getElementById('novelDownloadContainer')) {
            createUI();
        } else {
            const btn = document.getElementById('novelDownloadBtn');
            if (!btn || btn.offsetParent === null) {
                createUI();
            }
        }
    };

    // 显示进度窗口
    const showProgressWindow = () => {
        const novelTitle = document.title.split('_')[0].trim() || '未知小说';
        const bookId = new URLSearchParams(window.location.search).get('id');
        if (document.querySelector('.progressWindow')) return;

        const div = document.createElement('div');
        div.className = 'progressWindow';
        div.innerHTML = `
            <h3 style="margin:0 0 10px 0;color:#333;">正在下载《${novelTitle}》</h3>
            <div id="progressText" style="font-size:14px;color:#666;">准备中...</div>
            <div class="progressBar"><div id="progressFill" class="progressFill" style="width:0%"></div></div>
            <div style="display:flex;justify-content: space-between;font-size:13px;color:#888;">
                <span id="progressStats">0/0 章</span>
                <span id="progressSpeed">速度: -</span>
            </div>
            <button id="cancelBtn" style="margin-top:20px;padding:8px 16px;background:#f5f5f5;border:none;border-radius:4px;cursor:pointer;">取消下载</button>
        `;
        document.body.appendChild(div);
        div.querySelector('#cancelBtn').addEventListener('click', () => div.remove());
        startDownload(bookId, novelTitle, div);
    };

    // 开始下载
    const startDownload = async (bookId, novelTitle, progressWindow) => {
        const updateProgress = (text, percent, stats, speed) => {
            progressWindow.querySelector('#progressText').textContent = text;
            progressWindow.querySelector('#progressFill').style.width = `${percent}%`;
            progressWindow.querySelector('#progressStats').textContent = stats;
            progressWindow.querySelector('#progressSpeed').textContent = speed ? `速度: ${speed}章/分钟` : '速度: -';
        };

        try {
            updateProgress('正在收集章节列表...', 5, '0/0 章');

            // 只获取当前页的章节链接
            const currentPageHtml = document.documentElement.outerHTML;
            const chapterLinks = extractChapterLinks(currentPageHtml);

            if (chapterLinks.length === 0) {
                throw new Error('没有找到章节链接');
            }

            updateProgress('开始下载内容...', 30, `0/${chapterLinks.length} 章`);
            let fullContent = `《${novelTitle}》\n\n`;
            const startTime = Date.now();

            for (let i = 0; i < chapterLinks.length; i++) {
                const url = chapterLinks[i];
                const percent = 30 + Math.floor(i / chapterLinks.length * 70);
                const elapsed = (Date.now() - startTime) / 60000;
                const speed = elapsed > 0 ? (i / elapsed).toFixed(1) : '0';

                updateProgress(`下载第 ${i + 1}/${chapterLinks.length} 章`, percent, `${i + 1}/${chapterLinks.length} 章`, speed);

                try {
                    const content = await getChapterContent(url);
                    fullContent += content;

                    if ((i + 1) % 5 === 0 || i === chapterLinks.length - 1) {
                        GM_setValue('downloadProgress', {
                            bookId,
                            novelTitle,
                            completed: i + 1,
                            total: chapterLinks.length,
                            content: fullContent
                        });
                    }

                    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
                } catch (e) {
                    fullContent += `\n[第 ${i + 1} 章下载失败: ${e.message}]\n\n`;
                }
            }

            updateProgress('生成文件中...', 100, `${chapterLinks.length}/${chapterLinks.length} 章`);
            const ts = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\D/g, '');
            const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${novelTitle}_${ts}.txt`;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                a.remove();
                URL.revokeObjectURL(a.href);
            }, 100);

            updateProgress('下载完成！', 100, `${chapterLinks.length}/${chapterLinks.length} 章`);
            GM_notification({
                title: '下载完成',
                text: `${novelTitle}.txt 已保存`,
                timeout: 3000
            });

            setTimeout(() => progressWindow.remove(), 3000);
        } catch (err) {
            console.error(err);
            progressWindow.querySelector('#progressText').textContent = `下载失败: ${err.message}`;
            GM_notification({
                title: '下载失败',
                text: err.message,
                timeout: 5000,
                highlight: true
            });
        }
    };

    // 提取章节链接
    const extractChapterLinks = (html) => {
        const base = 'https://m.diyibanzhu.me';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const links = [];

        const blocks = doc.querySelectorAll('.chapter-list');
        blocks.forEach(block => {
            const title = block.querySelector('h4')?.textContent || '';
            if (!title.includes('章节列表')) return; // 跳过最新章节
            block.querySelectorAll('li a').forEach(a => {
                const href = a.getAttribute('href');
                if (href) {
                    links.push(href.startsWith('http') ? href : base + href);
                }
            });
        });

        return links;
    };

    // 获取章节内容
    const getChapterContent = async (url) => {
        const res = await fetch(url, {
            credentials: 'include',
            headers: { 'Accept': 'text/html' }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const title = doc.querySelector('.page-title')?.textContent.trim() || '未知章节';
        const contentDiv = doc.getElementById('nr1');
        let text = `${title}\n\n`;

        if (contentDiv) {
            text += processContent(contentDiv);
            const pagelinks = [...doc.querySelectorAll('.chapterPages a')].map(a => new URL(a.href, url).href);

            for (const pl of pagelinks) {
                await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
                const sub = await fetch(pl, { credentials: 'include' });

                if (sub.ok) {
                    const subdoc = new DOMParser().parseFromString(await sub.text(), 'text/html');
                    const subContent = subdoc.getElementById('nr1');
                    if (subContent) text += processContent(subContent);
                }
            }
        } else {
            text += `[内容获取失败]\n\n`;
        }

        return text + '\n';
    };

    // 处理内容
    const processContent = (div) => {
        const clone = div.cloneNode(true);
        ['font', 'center', 'script', 'style', '.chapterPages', '.ad', 'iframe', 'div[style*="display:none"]', 'div[style*="visibility:hidden"]']
            .forEach(sel => clone.querySelectorAll(sel).forEach(e => e.remove()));

        let s = clone.innerHTML;
        s = s.replace(/<br\s*\/?>\s*<br\s*\/?>/g, '\n\n')
            .replace(/<br\s*\/?>/g, '\n')
            .replace(/<\/p>\s*<p>/g, '\n\n')
            .replace(/<\/div>\s*<div>/g, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/^\s+/gm, '')
            .replace(/\s+$/gm, '')
            .replace(/([^\n])\n([^\n])/g, '$1\n\n$2')
            .replace(/&nbsp;/g, ' ')
            .replace(/&[a-z]+;/g, '');

        return s;
    };

    // 初始化
    function init() {
        createUI();

        // 监听DOM变化
        const observer = new MutationObserver(() => {
            if (!document.getElementById('novelDownloadContainer')) {
                createUI();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        // 5秒后再次检查
        setTimeout(checkButtonExists, 5000);
    }

    // 启动脚本
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
    }
})();