// ==UserScript==
// @name         OSM剪报系统lite Alt+C 快速生成 Markdown 链接（多站支持）
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Alt+C 快速复制当前页面标题和链接为 Markdown 格式，知乎支持清洗剪贴板并获取作者。
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537191/OSM%E5%89%AA%E6%8A%A5%E7%B3%BB%E7%BB%9Flite%20Alt%2BC%20%E5%BF%AB%E9%80%9F%E7%94%9F%E6%88%90%20Markdown%20%E9%93%BE%E6%8E%A5%EF%BC%88%E5%A4%9A%E7%AB%99%E6%94%AF%E6%8C%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/537191/OSM%E5%89%AA%E6%8A%A5%E7%B3%BB%E7%BB%9Flite%20Alt%2BC%20%E5%BF%AB%E9%80%9F%E7%94%9F%E6%88%90%20Markdown%20%E9%93%BE%E6%8E%A5%EF%BC%88%E5%A4%9A%E7%AB%99%E6%94%AF%E6%8C%81%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('keydown', async (e) => {
        if (e.altKey && e.code === 'KeyC') {
            const host = location.hostname;
            const path = location.pathname;
            let md = '';

            if (host.includes('zhihu.com')) {
                try {
                    const raw = await navigator.clipboard.readText();
                    const urlMatch = raw.match(/https?:\/\/[^\s]+/);
                    if (!urlMatch) {
                        alert('❌ 剪贴板中没有链接！');
                        return;
                    }
                    const url = urlMatch[0];
                    md = await formatZhihu(url);
                } catch (err) {
                    alert('❌ 无法读取剪贴板');
                    console.error(err);
                    return;
                }
            } else {
                const rawTitle = document.title.trim();
                const rawUrl = location.href;
                let prefix = '';
                let title = rawTitle;
                let cleanUrl = rawUrl;

                if (host.includes('bilibili.com')) {
                    prefix = 'bili ';
                    if (path.startsWith('/video/')) {
                        title = rawTitle.replace(/_哔哩哔哩_bilibili$/, '').trim();
                    } else if (path.startsWith('/read/')) {
                        title = rawTitle.replace(/ - 哔哩哔哩$/, '').trim(); // 专栏后缀少一个"bilibili"
                    }
                } else if (host.includes('youtube.com')) {
                    prefix = 'ytb ';
                    title = rawTitle.replace(/ - YouTube$/, '').trim();
                    cleanUrl = rawUrl.replace(/&?(list|start_radio|rv)=[^&]+/g, '').replace(/[?&]+$/, '');
                } else if (host.includes('xiaohongshu.com')) {
                    prefix = 'xhs ';
                    title = rawTitle.replace(/ - 小红书$/, '').trim();
                } else if (host.includes('tieba.baidu.com')) {
                    prefix = '贴吧 ';
                    title = rawTitle.replace(/_百度贴吧$/, '').trim();
                }else if (host.includes('book.douban.com')) {
                    prefix = '';
                    title = rawTitle.replace(/\(豆瓣\)$/, '豆瓣图书').trim();
                } else if (host.includes('movie.douban.com')) {
                    prefix = '';
                    title = rawTitle.replace(/\(豆瓣\)$/, '豆瓣影视').trim();
                }else{
                    prefix = '网页 ';
                }

                md = `[${prefix}${title}](${cleanUrl})`;
            }

            try {
                await navigator.clipboard.writeText(md);
                showToast('✅ 已复制为 Markdown 链接');
            } catch (err) {
                alert('❌ 无法写入剪贴板');
                console.error(err);
            }
        }
    });

    async function formatZhihu(url) {
        const title = document.title.replace(/ - 知乎$/, '').trim();
        const isAnswer = url.includes('/answer/');
        const isColumn = url.includes('zhuanlan.zhihu.com');

        let finalTitle = title;
        let author = '';

        if (isAnswer) {
            // 回答页面
            const questionTitle = document.querySelector('h1.QuestionHeader-title')?.innerText || title;
            author = document.querySelector('.AnswerAuthor-user-name')?.innerText || '';
            finalTitle = `知乎 ${questionTitle}${author ? ' ' + author + '的回答' : ''}`;
        } else if (isColumn) {
            // 专栏页面
            author = document.querySelector('.AuthorCard-user-name')?.innerText || '';
            finalTitle = `知乎 ${title}${author ? ' - ' + author + '的文章' : ''}`;
        } else {
            // 普通问题页面或其它
            finalTitle = `知乎 ${title}`;
        }

        return `[${finalTitle}](${url})`;
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            background: '#444',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '6px',
            zIndex: 9999,
            fontSize: '14px',
        });
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 2000);
    }
})();
