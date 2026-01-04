// ==UserScript==
// @name         5ch楼主内容提取器 / 5ch OP Content Extractor
// @name:zh-CN   5ch楼主内容提取器
// @name:ja      5ch スレ主発言抽出器
// @name:en      5ch OP Content Extractor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  提取5ch帖子中楼主的所有发言并在新窗口中纯净显示 | 5chスレッドでスレ主の全発言を抽出し、新しいウィンドウできれいに表示
// @description:zh-CN  提取5ch帖子中楼主的所有发言并在新窗口中纯净显示
// @description:ja     5chスレッドでスレ主の全ての発言を抽出し、新しいウィンドウできれいに表示します
// @description:en     Extract all posts from the original poster in 5ch threads and display them cleanly in a new window
// @author       Gao + Claude
// @match        https://*/test/read.cgi/*/*
// @match        http://*/test/read.cgi/*/*
// @grant        GM_addStyle
// @grant        window.open
// @license      MIT
// @supportURL   https://greasyfork.org/scripts/你的脚本ID
// @homepageURL  https://greasyfork.org/scripts/你的脚本ID
// @downloadURL https://update.greasyfork.org/scripts/544125/5ch%E6%A5%BC%E4%B8%BB%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96%E5%99%A8%20%205ch%20OP%20Content%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/544125/5ch%E6%A5%BC%E4%B8%BB%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96%E5%99%A8%20%205ch%20OP%20Content%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加按钮样式
    GM_addStyle(`
        .op-extractor-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: rgba(0, 123, 255, 0.4);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: move;
            z-index: 9999;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            user-select: none;
            transition: all 0.3s;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .op-extractor-btn:hover {
            background: rgba(0, 123, 255, 0.7);
            transform: scale(1.05);
        }
        .op-extractor-btn:active {
            cursor: grabbing;
        }
        .loading-indicator {
            position: fixed;
            top: 90px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 9998;
            display: none;
        }
    `);

    // 检查是否在完整帖子页面
    function isFullThreadPage() {
        const url = window.location.href;
        const isLimited = url.includes('/l50') || url.includes('-') || url.match(/\/\d+-\d+/);
        console.log('页面类型检查:', { url, isLimited });
        return !isLimited;
    }

    // 自动切换到全部楼层
    function switchToAllPosts() {
        if (isFullThreadPage()) {
            console.log('已在完整页面');
            return false;
        }

        console.log('尝试跳转到完整页面...');

        // 查找"全部"链接
        const allLinks = document.querySelectorAll('a[href*="全部"], a.menuitem');
        for (let link of allLinks) {
            if (link.textContent.includes('全部')) {
                console.log('跳转到全部楼层:', link.href);
                window.location.href = link.href;
                return true;
            }
        }

        // 如果没找到，尝试构造完整URL
        const currentUrl = window.location.href;
        if (currentUrl.includes('/l50')) {
            const fullUrl = currentUrl.replace('/l50', '/');
            console.log('构造完整URL:', fullUrl);
            window.location.href = fullUrl;
            return true;
        }

        // 尝试移除URL中的分页参数
        const match = currentUrl.match(/^(.*?\/test\/read\.cgi\/[^\/]+\/\d+)/);
        if (match) {
            const baseUrl = match[1] + '/';
            if (baseUrl !== currentUrl) {
                console.log('跳转到基础URL:', baseUrl);
                window.location.href = baseUrl;
                return true;
            }
        }

        return false;
    }

    // 等待页面完全加载
    async function ensureFullPageLoad() {
        console.log('开始等待页面完全加载...');

        // 显示加载指示器
        const indicator = document.createElement('div');
        indicator.className = 'loading-indicator';
        indicator.textContent = '正在加载完整页面...';
        indicator.style.display = 'block';
        document.body.appendChild(indicator);

        // 统计当前帖子数量
        let currentPostCount = document.querySelectorAll('[data-userid]').length;
        console.log('初始帖子数量:', currentPostCount);

        // 滚动到页面底部，触发可能的懒加载
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
            attempts++;
            indicator.textContent = `正在加载... (${attempts}/${maxAttempts})`;

            // 滚动到底部
            window.scrollTo(0, document.body.scrollHeight);

            // 等待一段时间让内容加载
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 检查是否有新内容加载
            const newPostCount = document.querySelectorAll('[data-userid]').length;
            console.log(`尝试 ${attempts}: 帖子数量从 ${currentPostCount} 变为 ${newPostCount}`);

            if (newPostCount === currentPostCount) {
                // 没有新内容，再等一次确认
                await new Promise(resolve => setTimeout(resolve, 1000));
                const finalCount = document.querySelectorAll('[data-userid]').length;
                if (finalCount === newPostCount) {
                    console.log('页面加载完成，总帖子数:', finalCount);
                    break;
                }
            }

            currentPostCount = newPostCount;
        }

        // 滚动回顶部
        window.scrollTo(0, 0);

        // 隐藏加载指示器
        indicator.style.display = 'none';

        // 最后统计
        const totalPosts = document.querySelectorAll('[data-userid]').length;
        console.log('页面加载完成统计:', { totalPosts });

        return totalPosts;
    }

    // 获取楼主的用户名
    function getOPUsername() {
        // 从第一个帖子获取楼主用户名
        const firstPost = document.querySelector('[id="1"], [data-id="1"]');
        if (firstPost) {
            const username = firstPost.querySelector('.postusername')?.textContent?.trim();
            console.log('楼主用户名:', username);
            return username;
        }

        // 如果找不到第一个帖子，从任何帖子获取用户名
        const anyPost = document.querySelector('[data-userid]');
        if (anyPost) {
            const username = anyPost.querySelector('.postusername')?.textContent?.trim();
            console.log('默认用户名:', username);
            return username;
        }

        return null;
    }

    // 根据用户名提取所有发言
    function extractPostsByUsername(targetUsername) {
        console.log('根据用户名提取发言:', targetUsername);

        if (!targetUsername) {
            console.log('未指定目标用户名');
            return [];
        }

        const allPosts = document.querySelectorAll('[data-userid]');
        const matchingPosts = [];

        allPosts.forEach((post, index) => {
            try {
                const postUsername = post.querySelector('.postusername')?.textContent?.trim();
                const postContent = post.querySelector('.post-content');

                // 检查用户名是否匹配，并且有内容
                if (postUsername === targetUsername && postContent && postContent.innerHTML.trim()) {
                    const postData = {
                        id: post.getAttribute('data-id') || post.id || (index + 1),
                        userId: post.getAttribute('data-userid') || '',
                        postNumber: post.querySelector('.postid')?.textContent?.trim() || '',
                        username: postUsername,
                        date: post.querySelector('.date')?.textContent?.trim() || '',
                        uid: post.querySelector('.uid')?.textContent?.trim() || '',
                        content: postContent.innerHTML || ''
                    };

                    matchingPosts.push(postData);
                }
            } catch (e) {
                console.log('提取帖子时出错:', e);
            }
        });

        // 按帖子编号排序
        matchingPosts.sort((a, b) => {
            const numA = parseInt(a.postNumber) || 0;
            const numB = parseInt(b.postNumber) || 0;
            return numA - numB;
        });

        console.log(`找到 ${matchingPosts.length} 个匹配的帖子`);
        return matchingPosts;
    }

    // 提取楼主的所有发言
    async function extractOPPosts() {
        // 首先确保页面完全加载
        await ensureFullPageLoad();

        // 获取楼主用户名
        const opUsername = getOPUsername();
        if (!opUsername) {
            console.log('无法获取楼主用户名');
            return [];
        }

        // 统计信息
        const allPosts = document.querySelectorAll('[data-userid]');
        const usernameCounts = new Map();

        allPosts.forEach(post => {
            const username = post.querySelector('.postusername')?.textContent?.trim();
            if (username) {
                usernameCounts.set(username, (usernameCounts.get(username) || 0) + 1);
            }
        });

        console.log('用户名统计:', Array.from(usernameCounts.entries()).slice(0, 10));
        console.log(`目标用户名 "${opUsername}" 的发言数:`, usernameCounts.get(opUsername) || 0);

        // 根据用户名提取发言
        return extractPostsByUsername(opUsername);
    }

    // 将HTML转换为纯文本
    function htmlToText(html) {
        // 创建临时div来解析HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // 将<br>转换为换行符
        temp.querySelectorAll('br').forEach(br => {
            br.replaceWith('\n');
        });

        // 处理链接，保留URL
        temp.querySelectorAll('a').forEach(a => {
            const href = a.getAttribute('href');
            const text = a.textContent;
            if (href && href !== text) {
                a.replaceWith(`${text} (${href})`);
            }
        });

        // 获取纯文本内容
        return temp.textContent || temp.innerText || '';
    }

    // 生成TXT格式内容
    function generateTxtContent(posts, threadTitle) {
        const lines = [];
        lines.push('='.repeat(60));
        lines.push(`标题: ${threadTitle || '楼主发言汇总'}`);
        lines.push(`共 ${posts.length} 条发言`);
        lines.push(`导出时间: ${new Date().toLocaleString('zh-CN')}`);
        lines.push('='.repeat(60));
        lines.push('');

        posts.forEach((post, index) => {
            lines.push(`【${post.postNumber || (index + 1)}楼】`);
            lines.push(`用户: ${post.username}`);
            lines.push(`时间: ${post.date}`);
            lines.push(`ID: ${post.uid}`);
            lines.push('-'.repeat(40));

            // 转换HTML内容为纯文本
            const textContent = htmlToText(post.content);
            lines.push(textContent.trim());
            lines.push('');
            lines.push('');
        });

        return lines.join('\n');
    }

    // 下载文本文件
    function downloadTxtFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // 生成纯净的HTML页面
    function generateCleanHTML(posts, threadTitle) {
        const html = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${threadTitle || '楼主发言汇总'}</title>
            <style>
                body {
                    font-family: "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", sans-serif;
                    line-height: 1.6;
                    max-width: 100%;
                    margin: 0;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .thread-title {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 30px;
                    text-align: center;
                    color: #333;
                    border-bottom: 2px solid #007bff;
                    padding-bottom: 10px;
                }
                .export-section {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .export-btn {
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                    margin: 0 10px;
                    transition: background 0.3s;
                }
                .export-btn:hover {
                    background: #218838;
                }
                .post {
                    background: white;
                    margin-bottom: 20px;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    width: 100%;
                    box-sizing: border-box;
                }
                .post-header {
                    background: #f8f9fa;
                    padding: 10px;
                    margin: -15px -15px 15px -15px;
                    border-radius: 8px 8px 0 0;
                    font-size: 14px;
                    color: #666;
                    border-bottom: 1px solid #dee2e6;
                }
                .post-number {
                    font-weight: bold;
                    color: #007bff;
                    margin-right: 10px;
                }
                .post-content {
                    font-size: 16px;
                    line-height: 1.8;
                    color: #333;
                    width: 100%;
                    word-wrap: break-word;
                }
                .post-content br {
                    margin: 8px 0;
                }
                .reply_link {
                    color: #007bff;
                    text-decoration: none;
                }
                .reply_link:hover {
                    text-decoration: underline;
                }
                @media (max-width: 768px) {
                    body {
                        padding: 10px;
                    }
                    .post {
                        padding: 10px;
                    }
                    .post-header {
                        margin: -10px -10px 10px -10px;
                    }
                }
            </style>
        </head>
        <body>
            <h1 class="thread-title">${threadTitle || '楼主发言汇总'} (共${posts.length}条发言)</h1>

            <div class="export-section">
                <button class="export-btn" onclick="exportToTxt()">📄 导出为TXT文件</button>
                <button class="export-btn" onclick="window.print()">🖨️ 打印页面</button>
            </div>

            ${posts.map(post => `
                <div class="post">
                    <div class="post-header">
                        <span class="post-number">${post.postNumber}</span>
                        <span class="username">${post.username}</span>
                        <span style="float: right;">
                            <span class="date">${post.date}</span>
                            <span class="uid">${post.uid}</span>
                        </span>
                    </div>
                    <div class="post-content">${post.content}</div>
                </div>
            `).join('')}

            <script>
                // 导出数据
                const postsData = ${JSON.stringify(posts)};
                const threadTitle = "${threadTitle || '楼主发言汇总'}";

                // HTML转文本函数
                function htmlToText(html) {
                    const temp = document.createElement('div');
                    temp.innerHTML = html;

                    temp.querySelectorAll('br').forEach(br => {
                        br.replaceWith('\\n');
                    });

                    temp.querySelectorAll('a').forEach(a => {
                        const href = a.getAttribute('href');
                        const text = a.textContent;
                        if (href && href !== text) {
                            a.replaceWith(text + ' (' + href + ')');
                        }
                    });

                    return temp.textContent || temp.innerText || '';
                }

                function exportToTxt() {
                    const lines = [];
                    lines.push('${'='.repeat(60)}');
                    lines.push('标题: ' + threadTitle);
                    lines.push('共 ' + postsData.length + ' 条发言');
                    lines.push('导出时间: ' + new Date().toLocaleString('zh-CN'));
                    lines.push('${'='.repeat(60)}');
                    lines.push('');

                    postsData.forEach((post, index) => {
                        lines.push('【' + (post.postNumber || (index + 1)) + '楼】');
                        lines.push('用户: ' + post.username);
                        lines.push('时间: ' + post.date);
                        lines.push('ID: ' + post.uid);
                        lines.push('${'-'.repeat(40)}');

                        const textContent = htmlToText(post.content);
                        lines.push(textContent.trim());
                        lines.push('');
                        lines.push('');
                    });

                    const content = lines.join('\\n');
                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = (threadTitle || '楼主发言汇总') + '.txt';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }
            </script>
        </body>
        </html>`;

        return html;
    }

    // 在新窗口中显示结果
    async function showCleanContent() {
        try {
            console.log('开始提取楼主内容...');
            const posts = await extractOPPosts();

            if (posts.length === 0) {
                alert(`未找到发言\n\n调试信息:\n- 页面总帖子数: ${document.querySelectorAll('[data-userid]').length}\n- 请查看控制台了解详细信息`);
                return;
            }

            console.log(`成功提取${posts.length}个帖子`);
            const threadTitle = document.querySelector('#threadtitle')?.textContent?.trim() ||
                              document.querySelector('h1')?.textContent?.trim() ||
                              '楼主发言汇总';

            const cleanHTML = generateCleanHTML(posts, threadTitle);

            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(cleanHTML);
                newWindow.document.close();
                console.log('新窗口已打开，显示发言');
            } else {
                alert('无法打开新窗口，请检查浏览器弹窗设置');
            }
        } catch (error) {
            console.error('提取内容时出错:', error);
            alert('提取内容时出错: ' + error.message);
        }
    }

    // 创建可拖动按钮
    function createDraggableButton() {
        const button = document.createElement('button');
        button.className = 'op-extractor-btn';
        button.innerHTML = '楼主<br>提取';
        button.title = '点击提取楼主发言到新窗口';

        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        let startPos = { x: 0, y: 0 };

        button.addEventListener('mousedown', (e) => {
            isDragging = true;
            startPos.x = e.clientX;
            startPos.y = e.clientY;
            dragOffset.x = e.clientX - button.offsetLeft;
            dragOffset.y = e.clientY - button.offsetTop;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                button.style.left = (e.clientX - dragOffset.x) + 'px';
                button.style.top = (e.clientY - dragOffset.y) + 'px';
                button.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                const distance = Math.sqrt(
                    Math.pow(e.clientX - startPos.x, 2) +
                    Math.pow(e.clientY - startPos.y, 2)
                );
                if (distance < 5) {
                    showCleanContent();
                }
            }
        });

        document.body.appendChild(button);
        console.log('提取按钮已创建');
    }

    // 主函数
    function init() {
        console.log('脚本开始执行, URL:', window.location.href);

        // 检查是否需要跳转到完整页面
        if (switchToAllPosts()) {
            console.log('正在跳转到完整页面...');
            return;
        }

        // 等待页面加载完成后创建按钮
        setTimeout(() => {
            console.log('创建提取按钮...');
            createDraggableButton();
        }, 2000);
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();