// ==UserScript==
// @name         豆瓣广播备份工具
// @name:zh-CN   豆瓣广播备份工具
// @name:en      Douban Status Backup Tool
// @namespace    https://github.com/pieck42/DoubanStatusBackup
// @version      1.0.0
// @description  备份豆瓣个人广播并保存为Markdown文件，支持批量备份和断点续传
// @description:zh-CN  备份豆瓣个人广播并保存为Markdown文件，支持批量备份和断点续传
// @description:en  Backup Douban personal status to Markdown files, support batch backup and breakpoint resume
// @author       Pieck
// @license      MIT
// @match        https://www.douban.com/people/*/statuses*
// @match        https://www.douban.com/mine/statuses*
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.10.7/dayjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        none
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @supportURL   https://github.com/pieck42/DoubanStatusBackup/issues
// @homepageURL  https://github.com/pieck42/DoubanStatusBackup
// @downloadURL https://update.greasyfork.org/scripts/529789/%E8%B1%86%E7%93%A3%E5%B9%BF%E6%92%AD%E5%A4%87%E4%BB%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/529789/%E8%B1%86%E7%93%A3%E5%B9%BF%E6%92%AD%E5%A4%87%E4%BB%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .douban-backup-btn {
            display: inline-block;
            padding: 8px 16px;
            background-color: #41ac52;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px 0;
            border: none;
            font-size: 14px;
        }
        .douban-backup-btn:hover {
            background-color: #37964a;
        }
        .douban-backup-container {
            margin: 20px 0;
            padding: 15px;
            background-color: #f7f7f7;
            border-radius: 4px;
        }
        .douban-backup-progress {
            width: 100%;
            height: 20px;
            margin-top: 10px;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);

    // 创建备份按钮和容器
    const container = document.createElement('div');
    container.className = 'douban-backup-container';
    container.innerHTML = `
        <h3>豆瓣广播备份工具</h3>
        <button id="backupStatusBtn" class="douban-backup-btn">备份当前页面广播</button>
        <div style="margin-top: 10px;">
            <button id="backupAllStatusBtn" class="douban-backup-btn">备份多页广播</button>
            <span style="margin-left: 10px;">从第</span>
            <input type="number" id="startPage" placeholder="起始页" min="1" style="width: 60px; padding: 5px;">
            <span>到第</span>
            <input type="number" id="endPage" placeholder="结束页" min="1" style="width: 60px; padding: 5px;">
            <span>页</span>
        </div>
        <div id="backupInfo" style="margin-top: 10px;"></div>
        <progress id="backupProgress" class="douban-backup-progress" value="0" max="100" style="display: none;"></progress>
    `;

    // 找到适合插入按钮的位置
    const insertPoint = document.querySelector('.stream-items') || document.querySelector('#wrapper');
    if (insertPoint) {
        insertPoint.parentNode.insertBefore(container, insertPoint);
    }

    // 增强调试功能
    function debugLog(message, isError = false) {
        console.log(`[豆瓣备份] ${message}`);
        // 在页面上显示调试信息
        const infoElement = document.getElementById('backupInfo');
        if (infoElement) {
            if (isError) {
                infoElement.innerHTML += `<div style="color: red">${message}</div>`;
            } else {
                infoElement.textContent = message;
            }
        }
    }

    // 提取广播内容的函数 - 添加超时保护
    async function extractStatuses(container) {
        debugLog("开始提取广播内容...");
        const statusItems = container.querySelectorAll('.status-item');
        debugLog(`找到 ${statusItems.length} 条广播`);
        
        const statuses = [];
        let processedCount = 0;

        for (const item of statusItems) {
            try {
                // 检查是否是被转发广播中的原广播内容
                const isOriginalInReshared = item.closest('.status-real-wrapper') && 
                                           item.closest('.status-reshared-wrapper');
                
                // 跳过被转发广播中的原广播内容
                if (isOriginalInReshared) {
                    continue;
                }
                
                // 添加超时保护
                const extractPromise = extractSingleStatus(item);
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("提取超时")), 5000)
                );
                
                const status = await Promise.race([extractPromise, timeoutPromise]);
                if (status) {
                    statuses.push(status);
                }
                
                processedCount++;
                debugLog(`已处理 ${processedCount}/${statusItems.length} 条广播`);
            } catch (error) {
                console.error("处理广播时出错:", error);
                debugLog(`处理广播时出错: ${error.message}`, true);
                // 继续处理下一条广播
                processedCount++;
            }
        }

        debugLog(`广播提取完成，共 ${statuses.length} 条`);
        return statuses;
    }

    // 修改 fetchComments 函数，添加对转发广播的检查
    async function fetchComments(item) {
        const comments = [];
        
        // 检查是否在转发广播的原广播内容中
        const isInResharedOriginal = item.closest('.status-real-wrapper') && 
                                    item.closest('.status-reshared-wrapper');
        
        // 如果是转发广播中的原广播，直接返回空评论
        if (isInResharedOriginal) {
            return comments;
        }
        
        // 获取评论按钮
        const commentBtn = item.querySelector('.btn-action-reply');
        if (!commentBtn) return comments;
        
        // 检查是否会导致页面跳转
        const willRedirect = !commentBtn.getAttribute('data-action-type') || 
                            commentBtn.getAttribute('data-action-type') !== 'showComments';
        
        // 如果会导致跳转，则不获取评论
        if (willRedirect) {
            return [{
                content: `[该广播有回应，请访问原文查看]`,
                author: {
                    name: '系统提示',
                    uid: '',
                    link: ''
                }
            }];
        }
        
        // 点击评论按钮显示评论
        commentBtn.click();
        
        // 等待评论加载
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 获取评论容器
        const commentsContainer = item.querySelector('.comments-items');
        if (!commentsContainer) return comments;
        
        // 获取所有评论项
        const commentItems = commentsContainer.querySelectorAll('.lite-comment-item');
        
        commentItems.forEach(commentItem => {
            const contentElement = commentItem.querySelector('.lite-comment-item-content');
            const authorElement = commentItem.querySelector('.lite-comment-item-author');
            
            if (contentElement && authorElement) {
                comments.push({
                    content: contentElement.textContent.trim(),
                    author: {
                        name: authorElement.textContent.trim(),
                        uid: authorElement.href ? authorElement.href.match(/people\/([^\/]+)/)?.[1] || '' : '',
                        link: authorElement.href || ''
                    }
                });
            }
        });
        
        return comments;
    }

    // 修改 extractSpecialContent 函数，增强对话题讨论类型的支持
    function extractSpecialContent(item) {
        // 检查是否是话题讨论类型
        const isTopicDiscussion = item.getAttribute('data-atype') === 'group/topic' || 
                                 item.getAttribute('data-atype') === 'personal/topic';
        
        // 如果是话题讨论，优先查找 blockquote 中的内容
        if (isTopicDiscussion) {
            const blockquote = item.querySelector('blockquote');
            if (blockquote) {
                const paragraph = blockquote.querySelector('p');
                if (paragraph) {
                    return paragraph.textContent.trim();
                }
                return blockquote.textContent.trim();
            }
        }
        
        // 尝试查找可能包含内容的所有元素
        const contentSelectors = [
            'blockquote p', 
            '.bd p', 
            '.content p',
            '.status-saying p',
            '.status-content p',
            '.text p',
            'p[style*="white-space"]', // 针对您截图中的特殊样式
            '.content blockquote p'    // 特别针对您的案例
        ];
        
        for (const selector of contentSelectors) {
            const elements = item.querySelectorAll(selector);
            if (elements.length > 0) {
                const texts = Array.from(elements).map(el => el.textContent.trim()).filter(text => text);
                if (texts.length > 0) {
                    return texts.join('\n\n');
                }
            }
        }
        
        return null;
    }

    // 修改 extractSingleStatus 函数，优先处理话题讨论类型
    async function extractSingleStatus(item) {
        // 检查是否已被删除
        const isDeleted = item.classList.contains('deleted') || item.classList.contains('hidden');
        
        // 检查是否是转发类型的广播
        const isReshared = item.classList.contains('status-reshared-wrapper') || 
                           item.parentNode.classList.contains('status-reshared-wrapper');
        
        // 获取广播ID
        const statusId = item.getAttribute('data-sid') || item.id.replace('status-', '');
        debugLog(`正在处理广播 ID: ${statusId}`);
        
        // 获取广播类型
        const statusType = item.getAttribute('data-atype') || '';
        
        // 获取时间
        const timeElement = item.querySelector('.created_at') || item.querySelector('.lnk-time');
        let timeText = timeElement ? timeElement.textContent.trim() : '';
        const timeHref = timeElement && timeElement.href ? timeElement.href : '';
        
        // 获取完整时间（包括时分秒）
        let fullTimeText = '';
        if (timeElement && timeElement.getAttribute('title')) {
            // 从title属性中获取完整时间
            fullTimeText = timeElement.getAttribute('title');
        } else if (timeElement && timeElement.getAttribute('data-time')) {
            // 从data-time属性中获取时间戳
            const timestamp = parseInt(timeElement.getAttribute('data-time'));
            if (!isNaN(timestamp)) {
                const date = new Date(timestamp * 1000);
                fullTimeText = date.toLocaleString('zh-CN');
            }
        }

        // 如果没有获取到完整时间，使用页面显示的时间
        if (!fullTimeText) {
            fullTimeText = timeText;
        }
        
        // 获取作者信息
        const authorElement = item.querySelector('.lnk-people') || item.querySelector('.user-name');
        const author = {
            name: authorElement ? authorElement.textContent.trim() : '',
            uid: authorElement && authorElement.href ? authorElement.href.match(/people\/([^\/]+)/)?.[1] || '' : '',
            link: authorElement && authorElement.href ? authorElement.href : ''
        };
        
        // 获取活动信息
        const activityElement = item.querySelector('.activity');
        let activity = activityElement ? activityElement.textContent.trim() : '';

        // 如果没有找到活动元素，尝试从文本中提取活动类型
        if (!activity) {
            // 检查是否包含"看过"、"读过"、"在看"等标识
            const textDiv = item.querySelector('.text');
            if (textDiv) {
                const textContent = textDiv.textContent.trim();
                if (textContent.includes('看过')) {
                    activity = '看过';
                } else if (textContent.includes('读过')) {
                    activity = '读过';
                } else if (textContent.includes('在看')) {
                    activity = '在看';
                } else if (textContent.includes('想看')) {
                    activity = '想看';
                } else if (textContent.includes('想读')) {
                    activity = '想读';
                }
            }
        }
        
        // 获取评分信息
        let rating = '';
        const ratingElement = item.querySelector('.rating-stars');
        if (ratingElement) {
            rating = ratingElement.textContent.trim();
        }
        
        // 获取正文内容 - 针对话题讨论类型特殊处理
        let contentText = '';
        
        // 如果是话题讨论类型，优先使用特殊提取方法
        if (statusType === 'group/topic' || statusType === 'personal/topic') {
            const specialContent = extractSpecialContent(item);
            if (specialContent) {
                contentText = specialContent;
            }
        }
        
        // 如果特殊提取没有结果，继续使用常规方法
        if (!contentText) {
            // 获取广播内容 - 增强版
            const statusSaying = item.querySelector('.status-saying');
            if (statusSaying) {
                // 移除多余的空行和空格
                contentText = statusSaying.textContent.replace(/\s+/g, ' ').trim();
                
                // 如果内容包含"转发："，则正确格式化
                if (contentText.includes('转发：')) {
                    contentText = contentText.replace(/转发：\s+/, '转发：');
                }
                
                // 移除JavaScript图片代码
                contentText = removePhotoScript(contentText);
            } else {
                // 如果没有 .status-saying，尝试其他选择器
                const contentElement = item.querySelector('.status-content') || 
                                      item.querySelector('.text') || 
                                      item.querySelector('.content') ||
                                      item.querySelector('p') ||  // 添加对普通段落的支持
                                      item.querySelector('blockquote p'); // 添加对引用块中段落的支持
                
                if (contentElement) {
                    contentText = contentElement.textContent.replace(/\s+/g, ' ').trim();
                    // 移除JavaScript图片代码
                    contentText = removePhotoScript(contentText);
                }
            }
        }

        // 如果内容仍然为空，尝试从其他元素获取
        if (!contentText) {
            // 尝试从.bd元素获取所有文本内容
            const bdElement = item.querySelector('.bd');
            if (bdElement) {
                const statusSayingInBd = bdElement.querySelector('.status-saying');
                if (statusSayingInBd) {
                    const blockquote = statusSayingInBd.querySelector('blockquote');
                    if (blockquote) {
                        const paragraph = blockquote.querySelector('p');
                        if (paragraph) {
                            contentText = paragraph.textContent.trim();
                        } else {
                            contentText = blockquote.textContent.trim();
                        }
                    } else {
                        contentText = statusSayingInBd.textContent.trim();
                    }
                    // 移除JavaScript图片代码
                    contentText = removePhotoScript(contentText);
                }
            }
        }

        // 如果仍然为空，尝试获取所有可见文本，包括嵌套在深层的内容
        if (!contentText) {
            // 添加对嵌套内容的支持
            const allTextElements = item.querySelectorAll('p, div.text, div.content, blockquote p, .content p');
            const allTexts = [];
            allTextElements.forEach(el => {
                if (el.textContent.trim() && !el.querySelector('a, .created_at, .actions')) {
                    allTexts.push(el.textContent.trim());
                }
            });
            contentText = allTexts.join('\n\n');
            // 移除JavaScript图片代码
            contentText = removePhotoScript(contentText);
        }
        
        // 获取话题信息 - 增强版
        let topic = null;
        
        // 如果是话题讨论类型，优先从 data-aid 和 data-atypecn 获取信息
        if (statusType === 'group/topic' || statusType === 'personal/topic') {
            const topicId = item.getAttribute('data-aid');
            const topicType = item.getAttribute('data-atypecn') || '话题讨论';
            
            if (topicId) {
                // 尝试从内容区域找到话题链接
                const contentDiv = item.querySelector('.content');
                let topicUrl = '';
                let topicTitle = topicType;
                
                if (contentDiv) {
                    const topicLink = contentDiv.querySelector('a[href*="/topic/"]');
                    if (topicLink) {
                        topicUrl = topicLink.href;
                        topicTitle = topicLink.textContent.trim() || topicType;
                    } else {
                        // 如果找不到链接，构造一个可能的URL
                        topicUrl = `https://www.douban.com/topic/${topicId}/`;
                    }
                } else {
                    // 如果找不到内容区域，构造一个可能的URL
                    topicUrl = `https://www.douban.com/topic/${topicId}/`;
                }
                
                topic = {
                    title: topicTitle,
                    url: topicUrl
                };
            }
        }
        
        // 如果上面的方法没有找到话题，使用常规方法
        if (!topic) {
            const topicElement = item.querySelector('.title a') || item.querySelector('a[href*="/topic/"]');
            topic = topicElement ? {
                title: topicElement.textContent.trim() || '话题讨论',
                url: topicElement.href
            } : null;
        }
        
        // 获取图片
        const imageElements = item.querySelectorAll('.status-images img, .topic-pics img, .pics-wrapper img');
        const images = Array.from(imageElements).map(img => ({
            small: { url: img.src },
            large: { url: img.src.replace('/small/', '/large/').replace('/medium/', '/large/') },
            alt: img.alt || '图片'
        }));
        
        // 获取卡片信息（推荐内容）
        const cardElement = item.querySelector('.card') || item.querySelector('.subject-card');
        let card = null;
        if (cardElement) {
            const cardTitleElement = cardElement.querySelector('.title a') || cardElement.querySelector('a');
            card = {
                title: cardTitleElement ? cardTitleElement.textContent.trim() : '',
                url: cardTitleElement && cardTitleElement.href ? cardTitleElement.href : '',
                description: cardElement.querySelector('.card-summary') ? 
                            cardElement.querySelector('.card-summary').textContent.trim() : ''
            };
        }
        
        // 获取评论数和评论内容
        let comments = [];
        let commentCount = 0;
        
        // 检查是否在转发广播的原广播内容中
        const isInResharedOriginal = item.closest('.status-real-wrapper') && 
                                    item.closest('.status-reshared-wrapper');
        
        // 只处理非转发广播原文的评论
        if (!isInResharedOriginal) {
            const commentCountElement = item.querySelector('.btn-action-reply');
            commentCount = commentCountElement ? 
                parseInt(commentCountElement.getAttribute('data-count')) || 
                parseInt(commentCountElement.textContent.match(/\d+/)?.[0]) || 0 : 0;
            
            if (commentCount > 0 && commentCountElement) {
                const willRedirect = !commentCountElement.getAttribute('data-action-type') || 
                                   commentCountElement.getAttribute('data-action-type') !== 'showComments';
                
                if (!willRedirect) {
                    try {
                        comments = await fetchComments(item);
                    } catch (error) {
                        console.error('获取评论失败:', error);
                        comments = [{
                            content: `[该广播有 ${commentCount} 条回应，但获取失败]`,
                            author: {
                                name: '系统提示',
                                uid: '',
                                link: ''
                            }
                        }];
                    }
                } else {
                    comments = [{
                        content: `[该广播有 ${commentCount} 条回应，请访问原文查看]`,
                        author: {
                            name: '系统提示',
                            uid: '',
                            link: ''
                        }
                    }];
                }
            }
        }
        
        // 获取点赞数
        const likeCountElement = item.querySelector('.like-count');
        const likeCount = likeCountElement ? 
            parseInt(likeCountElement.textContent.match(/\d+/)?.[0]) || 0 : 0;
        
        // 获取转发信息 - 重要修改
        let resharedStatus = null;
        
        // 检查是否有转发内容
        const statusRealWrapper = item.querySelector('.status-real-wrapper') || 
                                 (item.parentNode && item.parentNode.querySelector('.status-real-wrapper'));
        
        if (statusRealWrapper) {
            // 获取被转发广播的ID
            const resharedId = statusRealWrapper.getAttribute('data-sid') || '';
            
            // 获取被转发广播的作者
            const resharedAuthorElement = statusRealWrapper.querySelector('.lnk-people') || 
                                         statusRealWrapper.querySelector('.user-name');
            
            // 获取被转发广播的内容
            const resharedContentElement = statusRealWrapper.querySelector('.status-saying') || 
                                          statusRealWrapper.querySelector('.status-content') || 
                                          statusRealWrapper.querySelector('.text') || 
                                          statusRealWrapper.querySelector('.content');
            
            let resharedText = '';
            if (resharedContentElement) {
                // 尝试获取blockquote中的内容
                const blockquote = resharedContentElement.querySelector('blockquote');
                if (blockquote) {
                    resharedText = blockquote.textContent.trim();
                } else {
                    resharedText = resharedContentElement.textContent.trim();
                }
            }
            
            // 获取被转发广播的图片
            const resharedImageElements = statusRealWrapper.querySelectorAll('.status-images img, .topic-pics img, .pics-wrapper img');
            const resharedImages = Array.from(resharedImageElements).map(img => ({
                small: { url: img.src },
                large: { url: img.src.replace('/small/', '/large/').replace('/medium/', '/large/') },
                alt: img.alt || '图片'
            }));
            
            // 获取被转发广播的卡片
            const resharedCardElement = statusRealWrapper.querySelector('.card') || 
                                       statusRealWrapper.querySelector('.subject-card');
            let resharedCard = null;
            if (resharedCardElement) {
                const cardTitleElement = resharedCardElement.querySelector('.title a') || 
                                        resharedCardElement.querySelector('a');
                resharedCard = {
                    title: cardTitleElement ? cardTitleElement.textContent.trim() : '',
                    url: cardTitleElement && cardTitleElement.href ? cardTitleElement.href : '',
                    description: resharedCardElement.querySelector('.card-summary') ? 
                                resharedCardElement.querySelector('.card-summary').textContent.trim() : ''
                };
            }
            
            // 构建被转发广播的信息
            resharedStatus = {
                id: resharedId,
                author: {
                    name: resharedAuthorElement ? resharedAuthorElement.textContent.trim() : '',
                    uid: resharedAuthorElement && resharedAuthorElement.href ? 
                         resharedAuthorElement.href.match(/people\/([^\/]+)/)?.[1] || '' : '',
                    link: resharedAuthorElement && resharedAuthorElement.href ? resharedAuthorElement.href : ''
                },
                text: resharedText,
                images: resharedImages,
                card: resharedCard
            };
        }
        
        // 返回提取的广播信息
        return {
            id: statusId,
            type: statusType,
            create_time: timeText,
            full_time: fullTimeText,
            sharing_url: timeHref,
            original_url: timeHref || `https://www.douban.com/people/${author.uid}/status/${statusId}/`,
            author: author,
            activity: activity,
            rating: rating,
            text: contentText,
            topic: topic,
            images: images,
            card: card,
            reshared_status: resharedStatus,
            comment_count: commentCount,
            like_count: likeCount,
            deleted: isDeleted,
            hidden: isDeleted,
            comments: comments
        };
    }

    // 添加一个新函数来移除JavaScript图片代码
    function removePhotoScript(text) {
        // 匹配 (function() {...})() 这种模式的代码，同时也匹配后面可能跟随的"长图"等描述
        return text.replace(/\(function\s*\(\)\s*\{[\s\S]*?CREATE_HONRIZONTAL_PHOTOS[\s\S]*?\}\s*\)\(\)\s*(?:长图|小图)?/g, '').trim();
    }

    // 将广播转换为Markdown格式
    function statusesToMarkdown(statuses, userName) {
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`;
        
        let md = `# 豆瓣用户 ${userName} 的广播备份\n\n`;
        md += `*备份时间：${dateStr}*\n\n`;
        md += `*共备份 ${statuses.length} 条广播*\n\n`;
        md += `---\n\n`;

        // 格式化广播内容的函数
        function formatStatus(status, isReshared = false) {
            let result = '';
            
            if (!isReshared) {
                result += `## 广播 ${status.id}\n\n`;
                
                // 添加完整时间和原始地址
                if (status.full_time) {
                    result += `**时间**：${status.full_time}\n\n`;
                } else {
                    result += `**时间**：${status.create_time}\n\n`;
                }
                
                // 添加原始地址
                if (status.original_url) {
                    result += `**原始地址**：[${status.original_url}](${status.original_url})\n\n`;
                }
                
                if (status.type) {
                    result += `**类型**：${status.type}\n\n`;
                }
            }
            
            // 添加作者信息和活动
            if (isReshared) {
                result += `**原作者**：[${status.author.name}](${status.author.link}) (@${status.author.uid})\n\n`;
            } else if (status.activity) {
                // 如果是特定活动类型，使用更友好的格式
                if (['看过', '读过', '在看', '想看', '想读'].includes(status.activity)) {
                    result += `**动态**：[${status.author.name}](${status.author.link}) (@${status.author.uid}) ${status.activity}`;
                    
                    // 如果有评分，添加评分信息
                    if (status.rating) {
                        result += ` **评分**：${status.rating}`;
                    }
                    
                    result += `\n\n`;
                } else {
                    result += `**动态**：[${status.author.name}](${status.author.link}) (@${status.author.uid}) ${status.activity}\n\n`;
                }
            }
            
            // 添加内容
            if (status.text) {
                result += `**内容**：${status.text}\n\n`;
            }
            
            // 添加话题
            if (status.topic) {
                result += `**话题**：[${status.topic.title}](${status.topic.url})\n\n`;
            }
            
            // 添加卡片（推荐内容）
            if (status.card) {
                if (status.type === 'movie' || status.text.includes('看过')) {
                    result += `**电影**：[${status.card.title}](${status.card.url})`;
                    if (status.card.rating) {
                        result += ` - 评分：${status.card.rating}`;
                    }
                    result += `\n\n`;
                } else if (status.type === 'book' || status.text.includes('读过')) {
                    result += `**图书**：[${status.card.title}](${status.card.url})`;
                    if (status.card.rating) {
                        result += ` - 评分：${status.card.rating}`;
                    }
                    result += `\n\n`;
                } else if (status.text.includes('分享电视剧')) {
                    result += `**电视剧**：[${status.card.title}](${status.card.url})`;
                    if (status.card.rating) {
                        result += ` - 评分：${status.card.rating}`;
                    }
                    result += `\n\n`;
                } else if (status.text.includes('分享网页')) {
                    result += `**网页**：[${status.card.title}](${status.card.url})\n\n`;
                } else {
                    result += `**推荐**：[${status.card.title}](${status.card.url})\n\n`;
                }
                
                if (status.card.description) {
                    result += `**描述**：${status.card.description}\n\n`;
                }
            }
            
            // 添加图片
            if (status.images && status.images.length > 0) {
                result += `**图片**：\n\n`;
                status.images.forEach(img => {
                    result += `![${img.alt}](${img.large.url})\n\n`;
                });
            }
            
            // 添加播客单集信息
            if (status.podcast_episode) {
                result += `**播客单集**：[${status.podcast_episode.title}](${status.podcast_episode.url})\n\n`;
                
                if (status.podcast_episode.podcast.title) {
                    result += `**播客**：[${status.podcast_episode.podcast.title}](${status.podcast_episode.podcast.url})\n\n`;
                }
                
                if (status.podcast_episode.description) {
                    result += `**描述**：${status.podcast_episode.description}\n\n`;
                }
                
                if (status.podcast_episode.duration) {
                    result += `**时长**：${status.podcast_episode.duration}\n\n`;
                }
            }
            
            // 添加影评信息
            if (status.review) {
                result += `**影评**：[${status.review.title}](${status.review.url})\n\n`;
                
                if (status.review.subject) {
                    result += `**影片**：[${status.review.subject.title}](${status.review.subject.url})\n\n`;
                }
                
                if (status.review.content) {
                    result += `**内容摘要**：${status.review.content}\n\n`;
                }
            }
            
            return result;
        }

        statuses.forEach(status => {
            let statusMd = formatStatus(status);
            
            // 修改转发信息的处理方式
            if (status.reshared_status) {
                // 使用更清晰的格式显示转发内容
                statusMd += `**转发内容**：\n\n`;
                statusMd += `> **原作者**：[${status.reshared_status.author.name}](${status.reshared_status.author.link}) (@${status.reshared_status.author.uid})\n>\n`;
                statusMd += `> **内容**：${status.reshared_status.text}\n>\n`;
                
                // 添加转发的图片
                if (status.reshared_status.images && status.reshared_status.images.length > 0) {
                    statusMd += `> **图片**：\n>\n`;
                    status.reshared_status.images.forEach(img => {
                        statusMd += `> ![${img.alt}](${img.large.url})\n>\n`;
                    });
                }
                
                // 添加转发的卡片信息
                if (status.reshared_status.card) {
                    statusMd += `> **推荐**：[${status.reshared_status.card.title}](${status.reshared_status.card.url})\n>\n`;
                    if (status.reshared_status.card.description) {
                        statusMd += `> **描述**：${status.reshared_status.card.description}\n>\n`;
                    }
                }
            }
            
            // 添加互动数据
            statusMd += `**互动**：${status.like_count} 人赞 · ${status.comment_count} 条回应\n\n`;
            
            // 添加评论/回应
            if (status.comments && status.comments.length > 0) {
                statusMd += `**回应**：\n\n`;
                status.comments.forEach((comment, i) => {
                    statusMd += `${i+1}. **[${comment.author.name}](${comment.author.link})** (@${comment.author.uid}): ${comment.content}\n`;
                });
                statusMd += `\n`;
            } else if (status.comment_count > 0) {
                statusMd += `**回应**：共 ${status.comment_count} 条\n\n`;
            }
            
            // 添加分隔线
            statusMd += `---\n\n`;
            
            md += statusMd;
        });

        return md;
    }

    // 添加JSZip库
    function loadJSZip() {
        return new Promise((resolve, reject) => {
            if (window.JSZip) {
                resolve(window.JSZip);
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => resolve(window.JSZip);
            script.onerror = () => reject(new Error('Failed to load JSZip'));
            document.head.appendChild(script);
        });
    }

    // 保存为Markdown文件并返回Promise
    function saveAsMarkdownAsync(content, fileName) {
        return new Promise((resolve) => {
            const blob = new Blob([content], {type: 'text/markdown;charset=utf-8'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(link.href);
            
            // 给用户一些时间保存文件
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }

    // 创建并下载ZIP文件
    async function createAndDownloadZip(files, zipName) {
        try {
            const JSZip = await loadJSZip();
            const zip = new JSZip();
            
            // 添加所有文件到zip
            files.forEach(file => {
                zip.file(file.name, file.content);
            });
            
            // 生成zip
            const zipContent = await zip.generateAsync({type: 'blob'});
            
            // 下载zip
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipContent);
            link.download = zipName;
            link.click();
            URL.revokeObjectURL(link.href);
            
            return true;
        } catch (error) {
            console.error('创建ZIP文件失败:', error);
            return false;
        }
    }

    // 获取当前页码
    function getCurrentPage() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('p')) || 1;
    }

    // 获取总页数（修改版）
    function getTotalPages() {
        const paginator = document.querySelector('.paginator');
        let totalPages = 1;
        
        if (paginator) {
            // 首先尝试从分页器中找到最大页码
            const pageLinks = paginator.querySelectorAll('a');
            for (const link of pageLinks) {
                if (/\d+/.test(link.textContent)) {
                    const pageNum = parseInt(link.textContent);
                    if (!isNaN(pageNum) && pageNum > totalPages) {
                        totalPages = pageNum;
                    }
                }
            }
            
            // 检查是否有"后页"链接，如果有，说明还有更多页
            const nextPageLink = paginator.querySelector('a.next');
            if (nextPageLink) {
                // 豆瓣通常每页显示10条广播，尝试估算总页数
                const statusItems = document.querySelectorAll('.status-item');
                if (statusItems.length > 0) {
                    // 假设每页最多显示10条广播
                    const itemsPerPage = 10;
                    // 尝试从URL或其他地方获取总条目数
                    // 如果无法获取，至少将总页数设置为一个较大的值，如100
                    totalPages = Math.max(totalPages, 100);
                }
            }
        }
        
        return totalPages;
    }

    // 获取用户名
    function getUserName() {
        // 尝试从页面中获取用户名
        const userNameElement = document.querySelector('h1') || document.querySelector('.info h1');
        if (userNameElement) {
            return userNameElement.textContent.trim();
        }
        
        // 尝试从URL获取用户ID
        const urlMatch = location.href.match(/\/people\/([^\/]+)/);
        if (urlMatch && urlMatch[1]) {
            return urlMatch[1];
        }
        
        return '豆瓣用户';
    }

    // 创建Markdown文件对象的辅助函数
    function createMarkdownFile(content, fileName) {
        return {
            name: fileName,
            content: content
        };
    }

    // 备份当前页面广播 - 添加超时保护
    document.getElementById('backupStatusBtn').addEventListener('click', async () => {
        const infoElement = document.getElementById('backupInfo');
        infoElement.textContent = '正在备份当前页面广播...';
        
        try {
            const userName = getUserName();
            const currentPage = getCurrentPage(); // 获取当前页码
            const statusContainer = document.querySelector('.stream-items') || document.getElementById('wrapper');
            
            // 设置总体超时
            const extractionPromise = extractStatuses(statusContainer);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("整体提取超时，可能是页面结构复杂")), 30000)
            );
            
            const statuses = await Promise.race([extractionPromise, timeoutPromise]);
            
            if (statuses.length === 0) {
                infoElement.textContent = '未找到任何广播内容！';
                return;
            }
            
            infoElement.textContent = '正在生成Markdown文件...';
            const markdownContent = statusesToMarkdown(statuses, userName);
            // 修改文件名，添加当前页码
            const fileName = `豆瓣广播_${userName}_第${currentPage}页_${new Date().toISOString().split('T')[0]}.md`;
            
            infoElement.textContent = '正在保存文件...';
            await saveAsMarkdownAsync(markdownContent, fileName);
            
            infoElement.textContent = `成功备份第 ${currentPage} 页，共 ${statuses.length} 条广播！`;
        } catch (error) {
            console.error('备份过程中出错:', error);
            infoElement.textContent = `备份失败: ${error.message}`;
        }
    });

    // 备份多页广播（修复版 - 确保跨页面连续运行）
    document.getElementById('backupAllStatusBtn').addEventListener('click', async () => {
        initBackup();
    });

    // 初始化备份过程
    function initBackup() {
        const infoElement = document.getElementById('backupInfo');
        const progressBar = document.getElementById('backupProgress');
        progressBar.style.display = 'block';
        
        // 首次点击按钮时，初始化备份状态
        if (!localStorage.getItem('doubanBackupState')) {
            // 获取起始页和结束页
            const startPageInput = document.getElementById('startPage');
            const endPageInput = document.getElementById('endPage');
            
            let startPage = parseInt(startPageInput.value) || 1;
            let endPage = parseInt(endPageInput.value) || 0;
            
            if (startPage < 1) startPage = 1;
            
            const userName = getUserName();
            
            // 获取估计的总页数
            const estimatedTotalPages = getTotalPages();
            
            // 如果没有设置结束页，使用估计的总页数
            if (endPage <= 0) {
                endPage = estimatedTotalPages;
            }
            
            // 如果起始页大于结束页，交换它们
            if (startPage > endPage) {
                [startPage, endPage] = [endPage, startPage];
            }
            
            // 保存备份状态到localStorage
            const state = {
                startPage: startPage,
                endPage: endPage,
                currentPage: startPage,
                userName: userName,
                originalPage: getCurrentPage(), // 记录初始页面
                status: 'running',
                timestamp: Date.now(),
                processed: [] // 保存已处理页面
            };
            
            localStorage.setItem('doubanBackupState', JSON.stringify(state));
            console.log("初始化备份状态:", state);
        }
        
        // 处理当前页面
        processCurrrentPage();
    }

    // 处理当前页面内容
    async function processCurrrentPage() {
        if (!localStorage.getItem('doubanBackupState')) {
            console.log("没有进行中的备份");
            return;
        }
        
        const infoElement = document.getElementById('backupInfo');
        const progressBar = document.getElementById('backupProgress');
        progressBar.style.display = 'block';
        
        const state = JSON.parse(localStorage.getItem('doubanBackupState'));
        console.log("当前备份状态:", state);
        
        const { startPage, endPage, currentPage, userName, originalPage, processed } = state;
        
        // 当前页码
        const actualCurrentPage = getCurrentPage();
        console.log(`准备处理页面: 目标页=${currentPage}, 当前页=${actualCurrentPage}`);
        
        // 显示当前进度
        infoElement.textContent = `正在备份第 ${currentPage} 页 (总进度: ${processed.length+1}/${endPage-startPage+1})`;
        const progress = ((processed.length) / (endPage - startPage + 1)) * 100;
        progressBar.value = progress;
        
        // 如果当前页面不是目标处理页，跳转到目标页
        if (actualCurrentPage !== currentPage) {
            infoElement.textContent = `当前是第 ${actualCurrentPage} 页，正在跳转到目标备份页 ${currentPage}...`;
            
            setTimeout(() => {
                const targetUrl = new URL(window.location.href);
                targetUrl.searchParams.set('p', currentPage);
                window.location.href = targetUrl.toString();
            }, 1000);
            return;
        }
        
        // 处理当前页面
        try {
            infoElement.textContent = `正在提取第 ${currentPage} 页数据...`;
            const statusContainer = document.querySelector('.stream-items') || document.getElementById('wrapper');
            
            if (!statusContainer) {
                throw new Error("找不到广播容器");
            }
            
            const statuses = await extractStatuses(statusContainer);
            
            if (statuses.length > 0) {
                infoElement.textContent = `正在生成第 ${currentPage} 页的Markdown...`;
                const markdownContent = statusesToMarkdown(statuses, userName);
                const fileName = `豆瓣广播_${userName}_第${currentPage}页_${new Date().toISOString().split('T')[0]}.md`;
                
                // 保存文件
                await saveAsMarkdownAsync(markdownContent, fileName);
                
                infoElement.textContent = `已备份第 ${currentPage} 页，共 ${statuses.length} 条广播`;
                
                // 记录已处理的页面
                if (!processed.includes(currentPage)) {
                    processed.push(currentPage);
                }
            } else {
                infoElement.textContent = `第 ${currentPage} 页没有广播内容`;
            }
            
            // 更新状态
            state.processed = processed;
            
            // 检查是否已完成所有页面
            if (currentPage >= endPage || processed.length >= (endPage - startPage + 1)) {
                // 备份完成
                infoElement.textContent = `备份完成！已备份从第 ${startPage} 页到第 ${endPage} 页的内容`;
                progressBar.style.display = 'none';
                
                // 清除备份状态
                localStorage.removeItem('doubanBackupState');
                
                // 返回到原始页面
                if (getCurrentPage() !== originalPage) {
                    infoElement.textContent = `备份完成！正在返回第 ${originalPage} 页...`;
                    
                    setTimeout(() => {
                        const finalUrl = new URL(window.location.href);
                        finalUrl.searchParams.set('p', originalPage);
                        window.location.href = finalUrl.toString();
                    }, 2000);
                }
            } else {
                // 更新状态到下一页
                state.currentPage = currentPage + 1;
                localStorage.setItem('doubanBackupState', JSON.stringify(state));
                
                // 随机延迟后加载下一页
                const delay = 2000 + Math.floor(Math.random() * 3000);
                infoElement.textContent = `准备加载第 ${state.currentPage} 页 (${delay/1000}秒后)...`;
                
                setTimeout(() => {
                    // 导航到下一页
                    const nextPageUrl = new URL(window.location.href);
                    nextPageUrl.searchParams.set('p', state.currentPage);
                    window.location.href = nextPageUrl.toString();
                }, delay);
            }
        } catch (error) {
            console.error(`备份第 ${currentPage} 页时出错:`, error);
            infoElement.textContent = `备份第 ${currentPage} 页出错: ${error.message}`;
            
            // 错误处理 - 可以选择重试或跳过
            if (currentPage < endPage) {
                infoElement.textContent = `跳过第 ${currentPage} 页，准备加载下一页...`;
                
                // 记录当前页(跳过的页)
                if (!processed.includes(currentPage)) {
                    processed.push(currentPage);
                }
                
                state.processed = processed;
                state.currentPage = currentPage + 1;
                localStorage.setItem('doubanBackupState', JSON.stringify(state));
                
                setTimeout(() => {
                    const nextPageUrl = new URL(window.location.href);
                    nextPageUrl.searchParams.set('p', state.currentPage);
                    window.location.href = nextPageUrl.toString();
                }, 3000);
            } else {
                localStorage.removeItem('doubanBackupState');
                progressBar.style.display = 'none';
            }
        }
    }

    // 添加一个页面初始化的函数，确保在页面加载完成后自动继续备份
    function initPageCheck() {
        console.log("页面检查初始化");
        const backupState = localStorage.getItem('doubanBackupState');
        
        // 添加取消备份按钮
        addCancelButton(!!backupState);
        
        if (backupState) {
            console.log("检测到有未完成的备份");
            try {
                const state = JSON.parse(backupState);
                // 检查备份是否过期（12小时前的备份视为过期）
                const isExpired = Date.now() - state.timestamp > 12 * 60 * 60 * 1000;
                
                if (isExpired) {
                    console.log("备份已过期，清除状态");
                    localStorage.removeItem('doubanBackupState');
                    document.getElementById('backupInfo').textContent = '检测到过期的备份状态，已清除';
                } else {
                    console.log("继续执行未完成的备份");
                    // 确保界面元素已加载
                    if (document.getElementById('backupInfo')) {
                        document.getElementById('backupInfo').textContent = `检测到未完成的备份，即将继续...`;
                        
                        // 短暂延迟后继续处理当前页面
                        setTimeout(() => {
                            processCurrrentPage();
                        }, 1500);
                    } else {
                        console.error("备份界面元素尚未加载");
                    }
                }
            } catch (error) {
                console.error("解析备份状态出错:", error);
                localStorage.removeItem('doubanBackupState');
            }
        }
    }

    // 添加取消备份的按钮
    function addCancelButton(isVisible = false) {
        // 检查按钮是否已存在
        if (document.getElementById('cancelBackupBtn')) {
            document.getElementById('cancelBackupBtn').style.display = isVisible ? 'inline-block' : 'none';
            return;
        }
        
        // 创建按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancelBackupBtn';
        cancelBtn.className = 'douban-backup-btn';
        cancelBtn.style.backgroundColor = '#e74c3c';
        cancelBtn.textContent = '取消备份';
        cancelBtn.style.display = isVisible ? 'inline-block' : 'none';
        cancelBtn.style.marginLeft = '10px';
        
        // 添加点击事件
        cancelBtn.addEventListener('click', () => {
            if (confirm('确定要取消当前备份吗？')) {
                const state = JSON.parse(localStorage.getItem('doubanBackupState') || '{}');
                localStorage.removeItem('doubanBackupState');
                
                document.getElementById('backupInfo').textContent = '备份已取消';
                document.getElementById('backupProgress').style.display = 'none';
                cancelBtn.style.display = 'none';
                
                // 询问是否返回初始页面
                if (state.originalPage && state.originalPage !== getCurrentPage()) {
                    if (confirm('是否返回初始页面？')) {
                        const originalUrl = new URL(window.location.href);
                        originalUrl.searchParams.set('p', state.originalPage);
                        window.location.href = originalUrl.toString();
                    }
                }
            }
        });
        
        // 添加到DOM
        const container = document.querySelector('.douban-backup-container');
        if (container && container.querySelector('div')) {
            container.querySelector('div').appendChild(cancelBtn);
        }
    }

    // 使用更可靠的方式在页面准备就绪后执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPageCheck);
    } else {
        // 如果DOMContentLoaded已经触发，直接初始化
        setTimeout(initPageCheck, 500);
    }
})(); 