// ==UserScript==
// @name         知乎回答复制助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在知乎回答底部添加复制全文按钮，复制包含问题标题、答案链接、答主信息、签名档、正文和发布时间
// @author       https://github.com/Simon-CHOU/
// @license      GPL-3.0
// @match        https://www.zhihu.com/*
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/answer/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/539913/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/539913/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加按钮样式
    const style = document.createElement('style');
    style.textContent = `
        .copy-full-text-btn {
            margin-left: 12px;
            padding: 0;
            color: #8590a6;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
        }
        .copy-full-text-btn:hover {
            color: #76839b;
        }
        .copy-icon {
            margin-right: 4px;
            display: inline-flex;
            align-items: center;
        }
    `;
    document.head.appendChild(style);

    // 监听页面变化
    const observer = new MutationObserver((mutations) => {
        const actionBars = document.querySelectorAll('.ContentItem-actions');
        actionBars.forEach(actionBar => {
            if (!actionBar.querySelector('.copy-full-text-btn')) {
                addCopyButton(actionBar);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 获取问题标题和链接
    function getQuestionInfo(contentItem) {
        let questionTitle = '';
        let questionUrl = '';
        
        // 方法1：从问题页面的标题元素获取 (针对 /question/ 页面)
        const questionHeaderTitle = document.querySelector('h1.QuestionHeader-title');
        if (questionHeaderTitle) {
            questionTitle = questionHeaderTitle.textContent.trim();
            console.log('从 h1.QuestionHeader-title 获取问题标题:', questionTitle);
        }
        
        // 方法2：从答案项的标题元素获取
        if (!questionTitle) {
            const titleElement = contentItem.querySelector('.ContentItem-title a, h2.ContentItem-title a');
            if (titleElement) {
                questionTitle = titleElement.textContent.trim();
                questionUrl = titleElement.href;
            }
        }
        
        // 方法3：从meta标签获取
        if (!questionTitle) {
            const metaName = contentItem.querySelector('meta[itemprop="name"]');
            const metaUrl = contentItem.querySelector('meta[itemprop="url"]');
            if (metaName) {
                questionTitle = metaName.getAttribute('content');
            }
            if (metaUrl) {
                questionUrl = metaUrl.getAttribute('content');
            }
        }
        
        // 方法4：从页面标题获取
        if (!questionTitle) {
            const pageTitle = document.title;
            if (pageTitle && pageTitle.includes(' - 知乎')) {
                questionTitle = pageTitle.replace(' - 知乎', '').trim();
            }
        }
        
        // 方法5：从当前URL推断
        if (!questionUrl) {
            const currentUrl = window.location.href;
            const questionMatch = currentUrl.match(/\/question\/(\d+)/);
            if (questionMatch) {
                questionUrl = `https://www.zhihu.com/question/${questionMatch[1]}`;
            }
        }
        
        return { title: questionTitle, url: questionUrl };
    }

    // 获取答主信息
    function getAuthorInfo(contentItem) {
        let authorName = '';
        let authorUrl = '';
        let signature = '';

        // 方法1: 从 data-zop 属性解析
        if (contentItem.dataset.zop) {
            try {
                const zopData = JSON.parse(contentItem.dataset.zop);
                if (zopData.authorName) {
                    authorName = zopData.authorName;
                    console.log('从 data-zop 获取答主姓名:', authorName);
                }
            } catch (e) {
                console.warn('解析 data-zop 失败:', e);
            }
        }

        // 方法2: 从 .AuthorInfo 区域的 meta 标签获取
        const authorInfoDiv = contentItem.querySelector('.AuthorInfo');
        if (authorInfoDiv) {
            if (!authorName) {
                const metaName = authorInfoDiv.querySelector('meta[itemprop="name"]');
                if (metaName) {
                    authorName = metaName.getAttribute('content');
                    console.log('从 .AuthorInfo meta[itemprop="name"] 获取答主姓名:', authorName);
                }
            }
            const metaUrl = authorInfoDiv.querySelector('meta[itemprop="url"]');
            if (metaUrl) {
                authorUrl = metaUrl.getAttribute('content');
                console.log('从 .AuthorInfo meta[itemprop="url"] 获取答主链接:', authorUrl);
            }
        }
        
        // 方法3: 从特定链接元素获取 (作为备用)
        if (!authorName) {
            const authorLinkName = contentItem.querySelector('.AuthorInfo-name a.UserLink-link, a.UserLink-link[data-za-detail-view-element_name="User"]');
            if (authorLinkName) {
                authorName = authorLinkName.textContent.trim();
                console.log('从 .AuthorInfo-name a 或 .UserLink-link 获取答主姓名:', authorName);
            }
        }
        if (!authorUrl) {
            const authorLinkHref = contentItem.querySelector('.AuthorInfo-name a.UserLink-link, a.UserLink-link[data-za-detail-view-element_name="User"]');
            if (authorLinkHref) {
                authorUrl = authorLinkHref.href;
                console.log('从 .AuthorInfo-name a 或 .UserLink-link 获取答主链接:', authorUrl);
            }
        }

        // 备用：如果上述方法都失败，尝试从 contentItem 的 meta（这可能导致获取问题标题，作为最后手段）
        if (!authorName) {
            const metaNameFallback = contentItem.querySelector('meta[itemprop="name"]');
            if (metaNameFallback) {
                authorName = metaNameFallback.getAttribute('content');
                 console.log('备用：从 contentItem meta[itemprop="name"] 获取答主姓名:', authorName);
            }
        }
        if (!authorUrl) {
            const metaUrlFallback = contentItem.querySelector('meta[itemprop="url"]');
            if (metaUrlFallback) {
                authorUrl = metaUrlFallback.getAttribute('content');
                console.log('备用：从 contentItem meta[itemprop="url"] 获取答主链接:', authorUrl);
            }
        }
        
        // 查找签名档
        const signatureElement = contentItem.querySelector('.AuthorInfo-badgeText, .AuthorInfo-detail .ztext, .AuthorInfo-badge .ztext, .RichText.css-1g0fqss');
        if (signatureElement) {
            signature = signatureElement.textContent.trim();
            console.log('获取到签名档:', signature);
        } else {
            console.log('未找到签名档元素');
        }
        
        return { name: authorName, url: authorUrl, signature: signature };
    }

    // 获取答案链接
    function getAnswerUrl(contentItem) {
        // 方法1：从meta标签获取完整答案URL
        const metaUrl = contentItem.querySelector('meta[itemprop="url"]');
        if (metaUrl) {
            const url = metaUrl.getAttribute('content');
            if (url && url.includes('/answer/')) {
                return url;
            }
        }
        
        // 方法2：从当前URL获取
        const currentUrl = window.location.href;
        if (currentUrl.includes('/answer/')) {
            return currentUrl;
        }
        
        // 方法3：从答案元素构建URL
        const answerItem = contentItem.closest('.AnswerItem, .ContentItem');
        if (answerItem) {
            const nameAttr = answerItem.getAttribute('name');
            if (nameAttr) {
                // 获取问题ID
                const questionInfo = getQuestionInfo(contentItem);
                if (questionInfo.url) {
                    const questionId = questionInfo.url.match(/\/question\/(\d+)/)?.[1];
                    if (questionId) {
                        return `https://www.zhihu.com/question/${questionId}/answer/${nameAttr}`;
                    }
                }
            }
        }
        
        return '';
    }

    // 添加复制按钮
    function addCopyButton(actionBar) {
        console.log('开始添加复制按钮');
        const button = document.createElement('button');
        button.className = 'Button ContentItem-action copy-full-text-btn FEfUrdfMIKpQDJDqkjte Button--plain Button--withIcon Button--withLabel';
        
        button.innerHTML = `
            <span style="display: inline-flex; align-items: center;" class="copy-icon">
                <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H5V6h14v12z"/>
                    <path d="M7 8h10v2H7zm0 4h10v2H7z"/>
                </svg>
            </span>复制全文`;
        
        button.onclick = async () => {
            console.log('=== 开始复制全文操作 ===');
            console.log('1. 复制按钮被点击，开始执行复制流程');
            
            try {
                // 获取答案项容器
                console.log('2. 正在查找答案项容器...');
                const answerItem = actionBar.closest('.AnswerItem, .ContentItem');
                if (!answerItem) {
                    const error = new Error('未找到答案项容器：无法定位到 .AnswerItem 或 .ContentItem 元素');
                    console.error('❌ 错误:', error.message);
                    console.log('可用的父级元素:', actionBar.parentElement);
                    throw error;
                }
                console.log('✅ 成功找到答案项容器:', answerItem);
                console.log('答案项容器类名:', answerItem.className);
                
                // 获取正文内容容器
                console.log('3. 正在查找正文内容容器...');
                const richContent = answerItem.querySelector('.RichContent');
                if (!richContent) {
                    const error = new Error('未找到 .RichContent 元素：答案项中缺少正文内容容器');
                    console.error('❌ 错误:', error.message);
                    console.log('答案项内部结构:', answerItem.innerHTML.substring(0, 500) + '...');
                    throw error;
                }
                console.log('✅ 成功找到正文内容容器:', richContent);
                
                // 获取问题信息
                console.log('4. 正在获取问题信息...');
                const questionInfo = getQuestionInfo(answerItem);
                console.log('问题信息获取结果:', questionInfo);
                if (!questionInfo.title) {
                    console.warn('⚠️ 警告: 未能获取到问题标题');
                }
                if (!questionInfo.url) {
                    console.warn('⚠️ 警告: 未能获取到问题链接');
                }
                
                // 获取答案链接
                console.log('5. 正在获取答案链接...');
                const answerUrl = getAnswerUrl(answerItem);
                console.log('答案链接获取结果:', answerUrl);
                if (!answerUrl) {
                    console.warn('⚠️ 警告: 未能获取到答案链接');
                }
                
                // 获取答主信息
                console.log('6. 正在获取答主信息...');
                const authorInfo = getAuthorInfo(answerItem);
                console.log('答主信息获取结果:', authorInfo);
                if (!authorInfo.name) {
                    console.warn('⚠️ 警告: 未能获取到答主姓名');
                }
                if (!authorInfo.url) {
                    console.warn('⚠️ 警告: 未能获取到答主链接');
                }
                if (!authorInfo.signature) {
                    console.warn('⚠️ 警告: 未能获取到答主签名档');
                }
            
                // 获取发布日期
                console.log('7. 正在获取发布日期...');
                const timeDiv = answerItem.querySelector('.ContentItem-time span');
                let publishDate = '';
                if (timeDiv) {
                    console.log('找到时间元素:', timeDiv);
                    const tooltip = timeDiv.getAttribute('data-tooltip');
                    console.log('时间元素的 data-tooltip 属性:', tooltip);
                    const dateMatch = tooltip?.match(/发布于\s*(.*)/);
                    publishDate = dateMatch ? dateMatch[1].trim() : '';
                    console.log('✅ 解析出的发布日期:', publishDate);
                } else {
                    console.warn('⚠️ 警告: 未找到发布日期元素 .ContentItem-time span');
                }
                
                // 获取正文内容
                console.log('8. 正在获取正文内容...');
                const richContentInner = richContent.querySelector('.RichContent-inner');
                if (!richContentInner) {
                    const error = new Error('未找到 .RichContent-inner 元素：正文内容结构异常');
                    console.error('❌ 错误:', error.message);
                    console.log('RichContent 内部结构:', richContent.innerHTML.substring(0, 500) + '...');
                    throw error;
                }
                console.log('✅ 成功找到 .RichContent-inner 元素');

                const richText = richContentInner.querySelector('.RichText');
                if (!richText) {
                    const error = new Error('未找到 .RichText 元素：正文文本内容缺失');
                    console.error('❌ 错误:', error.message);
                    console.log('RichContent-inner 内部结构:', richContentInner.innerHTML.substring(0, 500) + '...');
                    throw error;
                }
                console.log('✅ 成功找到 .RichText 元素');
                console.log('原始正文内容长度:', richText.innerHTML.length);

                // 每次都从原始内容创建新的临时元素
                console.log('9. 正在处理正文内容...');
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = richText.innerHTML;
                console.log('临时元素创建完成，内容长度:', tempDiv.innerHTML.length);

                // 删除SVG
                console.log('10. 正在删除SVG元素...');
                const svgs = tempDiv.getElementsByTagName('svg');
                const svgCount = svgs.length;
                console.log('找到 SVG 元素数量:', svgCount);
                while (svgs.length > 0) {
                    svgs[0].parentNode.removeChild(svgs[0]);
                }
                console.log('✅ 已删除所有 SVG 元素');

                // 处理链接
                console.log('11. 正在处理链接元素...');
                const links = tempDiv.getElementsByTagName('a');
                const linkCount = links.length;
                console.log('找到链接元素数量:', linkCount);
                Array.from(links).forEach((link, index) => {
                    console.log(`处理第 ${index + 1} 个链接:`, link.href, link.textContent);
                    const span = document.createElement('span');
                    span.innerHTML = link.innerHTML;
                    if (link.className) {
                        span.className = link.className;
                    }
                    if (link.style.cssText) {
                        span.style.cssText = link.style.cssText;
                    }
                    link.parentNode.replaceChild(span, link);
                });
                console.log('✅ 已处理所有链接元素');

                // 组合内容
                console.log('12. 正在组合最终内容...');
                let plainText = '';
                if (questionInfo.title && authorInfo.name) {
                    plainText += questionInfo.title + ` - ${authorInfo.name}的回答 - 知乎\n`;
                }
                if (answerUrl) {
                    plainText += answerUrl + '\n';
                }
                if (authorInfo.url) {
                    plainText += authorInfo.url + '\n';
                }
                if (authorInfo.signature) {
                    plainText += '#签名档 ' + authorInfo.signature + '\n';
                }

                const tempDivForText = document.createElement('div');
                tempDivForText.innerHTML = tempDiv.innerHTML;

                // 保留段落格式，将<p>标签转换为单个换行
                let bodyText = '';
                const paragraphs = tempDivForText.querySelectorAll('p');
                if (paragraphs.length > 0) {
                    paragraphs.forEach((p, idx) => {
                        let txt = p.innerText.trimEnd();
                        // 最后一个段落后不加多余换行
                        if (idx < paragraphs.length - 1) {
                            bodyText += txt + '\n';
                        } else {
                            bodyText += txt;
                        }
                    });
                } else {
                    bodyText = tempDivForText.innerText.trimEnd();
                }
                // 签名档和正文之间不加多余空行
                plainText += bodyText;

                if (publishDate) {
                    plainText += `\n发布时间：${publishDate}`;
                }

                console.log('✅ 纯文本内容组合完成，总长度:', plainText.length);
                console.log('最终纯文本内容预览（前200字符）:', plainText.substring(0, 200) + '...');

                // 复制到剪贴板
                console.log('13. 正在复制到剪贴板...');
                try {
                    console.log('尝试使用 navigator.clipboard.writeText 方法...');
                    await navigator.clipboard.writeText(plainText);
                    console.log('✅ 使用 navigator.clipboard.writeText 复制成功');
                } catch (err) {
                    console.error('❌ navigator.clipboard.writeText 失败:', err);
                    console.log('尝试使用 textarea 回退方法...');
                    const textarea = document.createElement('textarea');
                    textarea.style.position = 'fixed';
                    textarea.style.top = '-9999px';
                    textarea.value = plainText;
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        document.execCommand('copy');
                        console.log('✅ 使用 textarea 回退方法复制成功');
                    } catch (e) {
                        console.error('❌ 使用 textarea 回退方法复制失败:', e);
                        alert('复制失败，请手动复制');
                    }
                    document.body.removeChild(textarea);
                }

                // 更新按钮状态
                console.log('14. 正在更新按钮状态为成功状态...');
                button.innerHTML = `
                    <span style="display: inline-flex; align-items: center;" class="copy-icon">
                        <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                        </svg>
                    </span>已复制！`;
                console.log('✅ 按钮状态已更新为成功状态');
                
                setTimeout(() => {
                    console.log('15. 2秒后恢复按钮原始状态...');
                    button.innerHTML = `
                        <span style="display: inline-flex; align-items: center;" class="copy-icon">
                            <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H5V6h14v12z"/>
                                <path d="M7 8h10v2H7zm0 4h10v2H7z"/>
                            </svg>
                        </span>复制全文`;
                    console.log('✅ 按钮状态已恢复为原始状态');
                }, 2000);
                
                console.log('🎉 复制全文操作完成！');
                console.log('=== 复制全文操作结束 ===');
                
            } catch (error) {
                console.error('💥 复制全文操作发生异常:', error);
                console.error('异常堆栈:', error.stack);
                
                // 更新按钮状态为错误状态
                button.innerHTML = `
                    <span style="display: inline-flex; align-items: center;" class="copy-icon">
                        <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </span>复制失败`;
                
                setTimeout(() => {
                    button.innerHTML = `
                        <span style="display: inline-flex; align-items: center;" class="copy-icon">
                            <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H5V6h14v12z"/>
                                <path d="M7 8h10v2H7zm0 4h10v2H7z"/>
                            </svg>
                        </span>复制全文`;
                }, 3000);
                
                console.log('=== 复制全文操作异常结束 ===');
                
                // 重新抛出异常，让用户知道操作失败
                throw error;
            }
        };

        actionBar.appendChild(button);
        console.log('复制按钮添加完成');
    }

    // 初始化：为页面上已有的操作栏添加复制按钮
    const existingActionBars = document.querySelectorAll('.ContentItem-actions');
    existingActionBars.forEach(actionBar => {
        addCopyButton(actionBar);
    });
})();