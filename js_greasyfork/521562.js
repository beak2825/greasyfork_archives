// ==UserScript==
// @name         社区助手1.1.1
// @namespace    https://boyshelpboys.com/
// @version      1.1.1
// @description  论坛增强功能：AI内容总结、新标签页打开、用户屏蔽、快速预览、自定义CSS等
// @author       全民制作人
// @match        https://*.boyshelpboys.com/*
// @icon         https://boyshelpboys.com/upload/attach/202410/b.svg
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      api.siliconflow.cn
// @connect      boyshelpboys.com
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521562/%E7%A4%BE%E5%8C%BA%E5%8A%A9%E6%89%8B111.user.js
// @updateURL https://update.greasyfork.org/scripts/521562/%E7%A4%BE%E5%8C%BA%E5%8A%A9%E6%89%8B111.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 配置
    const CONFIG = {
        apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
        defaultApiKey: 'sk-jantscvokoclrasijsgfdxuujcbikpebkzosubcjwmjteebu',
        defaultModel: 'THUDM/glm-4-9b-chat',
        checkInterval: 60000,    // 通知检查间隔 (1分钟)
        maxSavedIds: 100,        // 最大保存的帖子ID数量
        maxNotifications: 3,     // 最大同时显示的通知数
        notificationTimeout: 20000 // 通知自动消失时间 (20秒)
    };
    
    // 初始化 CSS
    GM_addStyle(`
        .blocked-post{display:none!important}
        #bhb-panel{position:fixed;right:20px;top:20px;background:#1a1a1a;border:1px solid #333;border-radius:4px;padding:8px;z-index:9999;box-shadow:0 2px 8px rgba(0,0,0,.3);transition:.3s;width:280px;color:#ccc;font-size:12px}
        #bhb-panel.mini{width:24px;height:24px;min-width:24px;padding:0;overflow:hidden;cursor:pointer}
        #bhb-panel.mini #bhb-content{display:none}
        #bhb-panel-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #333}
        .bhb-section{margin-bottom:10px}
        .bhb-section-title{color:#888;font-size:11px;margin-bottom:6px;padding-left:2px}
        .bhb-options-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:6px}
        .bhb-option{position:relative}
        .bhb-option-content{display:flex;align-items:center;justify-content:space-between;gap:8px}
        .bhb-label{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .bhb-checkbox-label{display:flex;align-items:center;gap:4px}
        .bhb-checkbox{margin:0;transform:scale(.9)}
        .bhb-input-section{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}
        .bhb-input-area{display:none;margin-top:8px;background:#1a1a1a;border:1px solid #333;border-radius:4px;padding:8px}
        .bhb-input-area.active{display:block}
        .bhb-textarea{width:100%;height:100px;background:#222;border:1px solid #333;border-radius:2px;color:#ccc;padding:4px;font-size:12px;resize:vertical;margin-bottom:4px}
        .bhb-btn{background:#222;color:#ccc;border:1px solid #333;padding:0 8px;border-radius:2px;cursor:pointer;font-size:12px;text-align:center;white-space:nowrap;line-height:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;width:100%}
        .bhb-btn:hover{background:#2a2a2a;color:#fff}
        .ai-summary-btn{background:#222;color:#ccc;border:1px solid #333;padding:4px 12px;border-radius:12px;cursor:pointer;margin:6px auto;font-size:12px;display:block;transition:all .2s ease}
        .ai-summary-btn:hover{background:#2a2a2a;color:#fff}
        .ai-summary{background:#1a1a1a;border:1px solid #333;border-radius:4px;padding:12px;margin:8px 0;color:#ccc;line-height:1.6;white-space:pre-line}
        .ai-loading{color:#888;text-align:center;padding:8px}
        .ai-summary.hide{display:none}
        #bhb-toggle{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#ccc;cursor:pointer}
        #bhb-toggle:hover{background:#222}
        #bhb-help-area{position:relative;width:100%;box-sizing:border-box;border-top:1px solid #333;margin-top:8px;z-index:9000}
        .bhb-help-content{max-height:120px;overflow-y:auto}
        #bhb-panel.mini #bhb-toggle{display:flex}
        .bhb-tip{font-size:10px;color:#666;margin-top:2px}
        .auto-pagination-loader{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1a1a1a;color:#ccc;padding:5px 10px;border-radius:4px;font-size:12px;z-index:999;opacity:0;transition:opacity 0.3s ease;}
        .auto-pagination-loader.show{opacity:1;}
        .bhb-page-marker{text-align:center;width:100%;display:block;padding:5px 0;color:#888;font-size:12px;}
        
        /* 快速预览样式 - 左侧固定 */
        .bhb-preview-container{position:fixed;z-index:10000;width:300px;left:0;top:0;bottom:0;background:#1a1a1a;border-right:1px solid #333;box-shadow:2px 0 10px rgba(0,0,0,.3);padding:0;overflow:hidden;opacity:0;visibility:hidden;transition:all .3s ease;transform:translateX(-100%)}
        .bhb-preview-container.show{opacity:1;visibility:visible;transform:translateX(0)}
        .bhb-preview-header{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#222;border-bottom:1px solid #333}
        .bhb-preview-title{font-size:14px;font-weight:bold;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}
        .bhb-preview-info{font-size:12px;color:#888;margin-left:10px}
        .bhb-preview-content{padding:12px;overflow-y:auto;color:#ccc;line-height:1.5;font-size:13px;position:absolute;top:40px;bottom:40px;left:0;right:0;scrollbar-width:thin;scrollbar-color:#444 #222}
        .bhb-preview-content::-webkit-scrollbar{width:6px;height:6px}
        .bhb-preview-content::-webkit-scrollbar-track{background:#222}
        .bhb-preview-content::-webkit-scrollbar-thumb{background:#444;border-radius:3px}
        .bhb-preview-content::-webkit-scrollbar-thumb:hover{background:#555}
        .bhb-preview-footer{display:flex;justify-content:space-between;padding:8px 12px;border-top:1px solid #333;background:#222;font-size:12px;color:#888;position:absolute;bottom:0;left:0;right:0}
        .bhb-preview-loading{display:flex;justify-content:center;align-items:center;height:100px;color:#888}
        .bhb-preview-error{color:#ff6b6b;text-align:center;padding:20px}
        .bhb-preview-img{max-width:100%;height:auto;margin:8px 0;border-radius:2px}
        .bhb-preview-close{position:absolute;top:8px;right:8px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#888;font-size:18px;border-radius:50%;background:#333;z-index:1}
        .bhb-preview-close:hover{background:#444;color:#fff}
        
        /* 预览高亮样式 */
        .bhb-preview-highlight{background:rgba(255,255,255,0.05);border-radius:2px;transition:background 0.2s ease}
        .bhb-preview-highlight:hover{background:rgba(255,255,255,0.1)}
    `);

    // 工具函数
    const Utils = {
        $: (selector, parent = document) => parent.querySelector(selector),
        $$: (selector, parent = document) => [...parent.querySelectorAll(selector)],
        
        toggleClass: (el, className) => el.classList.toggle(className),
        
        createEl: (tag, props = {}) => {
            const el = document.createElement(tag);
            Object.entries(props).forEach(([k, v]) => {
                if (k === 'className') el.className = v;
                else if (k === 'innerHTML') el.innerHTML = v;
                else if (k === 'textContent') el.textContent = v;
                else if (k === 'onclick') el.onclick = v;
                else el.setAttribute(k, v);
            });
            return el;
        },
        
        // 简化的HTTP请求
        request: (url, options = {}) => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url,
                headers: options.headers || {},
                data: options.data ? JSON.stringify(options.data) : undefined,
                timeout: options.timeout || 10000,
                onload: r => r.status >= 200 && r.status < 300 ? 
                    resolve(options.isJson ? JSON.parse(r.responseText) : r.responseText) : 
                    reject(new Error(`请求失败: ${r.status}`)),
                onerror: reject,
                ontimeout: () => reject(new Error('请求超时'))
            });
        }),
        
        // 统一的通知发送
        notify: (title, body, url, tag) => {
            if ("Notification" in window && Notification.permission === "granted") {
                const notification = new Notification(title, {
                    body,
                    icon: 'https://boyshelpboys.com/upload/attach/202410/b.svg',
                    tag
                });
                
                if (url) {
                    notification.onclick = () => {
                        window.open(url, '_blank');
                        notification.close();
                    };
                }

                // 设置通知20秒后自动关闭
                setTimeout(() => notification.close(), CONFIG.notificationTimeout);
            } else {
                GM_notification({
                    title,
                    text: body,
                    image: 'https://boyshelpboys.com/upload/attach/202410/b.svg',
                    onclick: url ? () => window.open(url, '_blank') : null,
                    timeout: CONFIG.notificationTimeout
                });
            }
        }
    };

    // 功能实现
    const Features = {
        // 在新标签页打开帖子
        openInNewTab: () => {
            Utils.$$('a.subject[href*="thread-"]').forEach(a => {
                a.target = '_blank';
                a.rel = 'noopener';
            });
        },
        
        // 自动翻页功能 - AJAX实现
        autoPagination: {
            isLoading: false,
            nextPageLink: null,
            container: null,
            pageCount: 1,
            
            // 初始化自动翻页
            init: () => {
                if (!GM_getValue('auto_pagination', false)) return;
                if (location.href.includes('/thread-') && !location.href.includes('/forum-')) return;
                
                // 创建加载提示元素
                const loader = Utils.createEl('div', {
                    className: 'auto-pagination-loader',
                    textContent: '正在加载下一页...'
                });
                document.body.appendChild(loader);
                Features.autoPagination.loaderElement = loader;
                
                // 找到列表容器和下一页链接
                Features.autoPagination.findContainer();
                Features.autoPagination.findNextPageLink();
                
                // 添加滚动监听(使用节流函数)
                let scrollTimer = null;
                window.addEventListener('scroll', () => {
                    if (scrollTimer) clearTimeout(scrollTimer);
                    scrollTimer = setTimeout(Features.autoPagination.checkScroll, 200);
                });
            },
            
            // 查找内容容器
            findContainer: () => {
                // 常见容器选择器
                const selectors = ['.table', '.thread_list', '.threadlist', '#threadlist', 
                                  '.content-list', '.forum_body', 'table.list tbody', '#content'];
                
                // 尝试所有选择器
                for (const selector of selectors) {
                    const container = document.querySelector(selector);
                    if (container && container.children.length > 2) {
                        Features.autoPagination.container = container;
                        return;
                    }
                }
                
                // 未找到，分析帖子链接
                const links = document.querySelectorAll('a[href*="thread-"]');
                if (links.length > 3) {
                    // 找出最可能是列表容器的父元素
                    const parents = {};
                    links.forEach(link => {
                        const parent = link.closest('tr, li, .thread, .item');
                        if (parent && parent.parentElement) {
                            const parentPath = parent.parentElement.tagName.toLowerCase() + 
                                (parent.parentElement.id ? `#${parent.parentElement.id}` : '');
                            parents[parentPath] = (parents[parentPath] || 0) + 1;
                        }
                    });
                    
                    // 选择包含最多帖子链接的容器
                    const bestParent = Object.entries(parents)
                        .sort((a, b) => b[1] - a[1])
                        .shift();
                        
                    if (bestParent && bestParent[1] > 2) {
                        Features.autoPagination.container = document.querySelector(bestParent[0]);
                    }
                }
            },
            
            // 查找下一页链接
            findNextPageLink: () => {
                const pagination = document.querySelector('.pagination');
                if (!pagination) return;
                
                // 常见下一页按钮模式
                const nextLinkSelectors = [
                    // 活动页面后面的链接
                    () => {
                        const active = pagination.querySelector('.active, .current');
                        if (active && active.nextElementSibling) {
                            return active.nextElementSibling.querySelector('a');
                        }
                        return null;
                    },
                    // 下一页文本或符号
                    () => {
                        const links = pagination.querySelectorAll('a');
                        for (const link of links) {
                            const text = link.textContent.trim();
                            if (text === '下一页' || text === '>' || text === '›' || 
                                text === '»' || text === '▶' || 
                                link.title?.includes('下一页') || 
                                link.title?.includes('Next')) {
                                return link;
                            }
                        }
                        return null;
                    },
                    // 当前页数+1
                    () => {
                        const active = pagination.querySelector('.active, .current');
                        if (active) {
                            const currentPage = parseInt(active.textContent.trim());
                            if (currentPage) {
                                const links = pagination.querySelectorAll('a');
                                for (const link of links) {
                                    if (parseInt(link.textContent.trim()) === currentPage + 1) {
                                        return link;
                                    }
                                }
                            }
                        }
                        return null;
                    }
                ];
                
                // 尝试所有选择器
                for (const selector of nextLinkSelectors) {
                    const link = selector();
                    if (link && link.href) {
                        Features.autoPagination.nextPageLink = link;
                        return;
                    }
                }
            },
            
            // 检查滚动位置和加载下一页
            checkScroll: () => {
                if (Features.autoPagination.isLoading || !Features.autoPagination.nextPageLink) return;
                
                const scrollBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
                if (scrollBottom < 300) {
                    Features.autoPagination.loadNextPage();
                }
            },
            
            // 加载下一页内容
            loadNextPage: () => {
                if (Features.autoPagination.isLoading || !Features.autoPagination.nextPageLink) return;
                
                // 无容器时直接跳转
                if (!Features.autoPagination.container) {
                    location.href = Features.autoPagination.nextPageLink.href;
                    return;
                }
                
                Features.autoPagination.isLoading = true;
                
                // 显示加载提示
                const loader = Features.autoPagination.loaderElement;
                if (loader) {
                    loader.textContent = '正在加载下一页...';
                    loader.classList.add('show');
                }
                
                // 获取下一页内容
                fetch(Features.autoPagination.nextPageLink.href)
                    .then(res => res.text())
                    .then(html => {
                        const doc = new DOMParser().parseFromString(html, 'text/html');
                        
                        // 尝试找到新页面中对应的内容容器
                        const container = Features.autoPagination.container;
                        let selector = container.id ? `#${container.id}` : 
                                      container.className ? `.${container.className.replace(/\s+/g, '.')}` : 
                                      container.tagName.toLowerCase();
                        
                        let newContent = doc.querySelector(selector);
                        
                        // 找不到时尝试其他选择器
                        if (!newContent) {
                            for (const sel of ['.table', '.thread_list', '.threadlist', '#threadlist']) {
                                newContent = doc.querySelector(sel);
                                if (newContent) break;
                            }
                        }
                        
                        if (!newContent) throw new Error('未找到内容');
                        
                        // 提取内容项
                        const isTable = /^(TABLE|TBODY)$/i.test(container.tagName);
                        const items = isTable 
                            ? Array.from(newContent.querySelectorAll('tr')).filter(tr => !tr.classList.contains('header')) 
                            : Array.from(newContent.children);
                        
                        if (items.length < 3) throw new Error('内容项太少');
                        
                        // 创建分页标记
                        const marker = Utils.createEl('div', {
                            className: 'bhb-page-marker',
                            textContent: `第 ${++Features.autoPagination.pageCount} 页`
                        });
                        
                        // 添加新内容
                        if (isTable) {
                            const tbody = container.tagName === 'TABLE' ? container.querySelector('tbody') : container;
                            const row = document.createElement('tr');
                            const cell = document.createElement('td');
                            cell.colSpan = 10;
                            cell.appendChild(marker);
                            row.appendChild(cell);
                            tbody.appendChild(row);
                            
                            items.forEach(item => tbody.appendChild(item.cloneNode(true)));
                        } else {
                            container.appendChild(marker);
                            items.forEach(item => container.appendChild(item.cloneNode(true)));
                        }
                        
                        // 更新URL
                        history.pushState(
                            { page: Features.autoPagination.pageCount }, 
                            document.title, 
                            Features.autoPagination.nextPageLink.href
                        );
                        
                        // 处理新内容
                        if (GM_getValue('newtab', true)) Features.openInNewTab();
                        Features.blockUser(container);
                        
                        // 查找新的下一页链接
                        const pagination = doc.querySelector('.pagination');
                        if (pagination) {
                            const active = pagination.querySelector('.active, .current');
                            if (active && active.nextElementSibling) {
                                const nextLink = active.nextElementSibling.querySelector('a');
                                if (nextLink && nextLink.href) {
                                    Features.autoPagination.nextPageLink = {
                                        href: nextLink.href,
                                        textContent: nextLink.textContent
                                    };
                                } else {
                                    Features.autoPagination.nextPageLink = null;
                                }
                            } else {
                                Features.autoPagination.nextPageLink = null;
                            }
                        } else {
                            Features.autoPagination.nextPageLink = null;
                        }
                        
                        // 重置状态
                        Features.autoPagination.isLoading = false;
                        if (loader) loader.classList.remove('show');
                    })
                    .catch(error => {
                        if (confirm('加载失败，是否跳转到下一页？')) {
                            location.href = Features.autoPagination.nextPageLink.href;
                        }
                        Features.autoPagination.isLoading = false;
                        if (loader) loader.classList.remove('show');
                    });
            },
            
            // 清理资源
            cleanup: () => {
                window.removeEventListener('scroll', Features.autoPagination.checkScroll);
                if (Features.autoPagination.loaderElement) Features.autoPagination.loaderElement.remove();
            }
        },
        
        // 屏蔽用户
        blockUser: (container = document) => {
            const blockedUsers = GM_getValue('blockedUsers', '')
                .split('\n').map(u => u.trim()).filter(Boolean);

        if (blockedUsers.length === 0) return;

            // 帖子选择器
            const posts = Utils.$$('li.thread.card.tap, .thread.card.tap, .media.post, .post_reply_item', container);
            
            posts.forEach(post => {
                let found = false;
                
                // 方法1: 精确查找最内层的用户名span
                const innerUsername = Utils.$('.haya-post-info-username span.username', post);
                if (innerUsername) {
                    const username = innerUsername.textContent.trim();
                    if (username && blockedUsers.includes(username)) {
                post.classList.add('blocked-post');
                        found = true;
                    }
                }
                
                // 方法2: 查找最后回复的用户名（去掉时间信息）
                if (!found) {
                    const lastPostEl = Utils.$('.last-post.username', post);
                    if (lastPostEl) {
                        let username = lastPostEl.textContent.trim()
                            .replace(/.*·\s*/, '')                    // 移除"xx分钟前 ·"
                            .trim();
                        
                        if (username && blockedUsers.includes(username)) {
                            post.classList.add('blocked-post');
                            found = true;
                        }
                    }
                }
            });
        },
        
        // AI摘要
        aiSummary: {
            // 获取AI摘要
            getSummary: async (text) => {
                const apiKey = GM_getValue('api_key', CONFIG.defaultApiKey);
                
                return Utils.request(CONFIG.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                    data: {
                        model: CONFIG.defaultModel,
                    messages: [
                        {
                            role: 'system',
                                content: '两句话总结帖子的内容'
                        },
                        {
                            role: 'user',
                            content: text
                        }
                    ],
                    stream: false,
                    max_tokens: 512,
                    temperature: 0.7,
                    top_p: 0.7,
                    top_k: 50,
                    frequency_penalty: 0.5,
                    n: 1,
                        response_format: { type: 'text' }
                    },
                    isJson: true
                }).then(result => {
                    if (result.error) throw new Error(result.error.message);
                    return result.choices[0].message.content.trim();
                });
            },
            
            // 添加AI摘要按钮
            addButtons: () => {
        if (!GM_getValue('ai_summary', false) || !location.href.includes('/thread-')) return;
        
                const mainPost = Utils.$('.message.break-all');
                if (!mainPost?.textContent.trim() || mainPost.classList.contains('ai-summary-added') || Utils.$('.ai-summary-btn')) return;
                
                const summaryDiv = Utils.createEl('div', {
                    className: 'ai-summary',
                    innerHTML: '<div class="ai-loading">正在生成AI摘要...</div>'
                });
                
                const summaryBtn = Utils.createEl('button', {
                    className: 'ai-summary-btn',
                    textContent: 'AI总结',
                    onclick: () => Utils.toggleClass(summaryDiv, 'hide')
                });
        
        mainPost.parentNode.insertBefore(summaryDiv, mainPost);
        mainPost.parentNode.insertBefore(summaryBtn, summaryDiv);
        
                Features.aiSummary.getSummary(mainPost.textContent.trim())
                    .then(summary => {
                        summaryDiv.innerHTML = `<div style="color:#fff">${summary}</div>`;
            mainPost.classList.add('ai-summary-added');
                    })
                    .catch(error => {
                        summaryDiv.innerHTML = `<div style="color:#ff4444">生成摘要失败：${error.message}</div>`;
            setTimeout(() => {
                summaryDiv.remove();
                summaryBtn.remove();
            }, 3000);
        });
            }
        },
        
        // 新帖通知
        notification: {
            timer: null,
            
            // 获取最新帖子
            fetchPosts: async () => {
                const html = await Utils.request('https://boyshelpboys.com/');
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                return Utils.$$('.thread', doc)
                    .map(post => {
                        const id = post.getAttribute('data-tid') || post.id || '';
                        const titleEl = Utils.$('.subject, .title, h3, a[title]', post);
                        const authorEl = Utils.$('.username, .author, .user', post);
                        const url = post.getAttribute('data-href') || 
                                  (Utils.$('a', post)?.getAttribute('href') || '');
                        
                        return {
                            id,
                            title: titleEl ? titleEl.textContent.trim() : '无标题',
                            author: authorEl ? authorEl.textContent.trim() : '匿名',
                            url
                        };
                    })
                    .filter(p => p.id && p.title && p.url);
            },
            
            // 检查新帖子
            check: async () => {
                try {
                    const posts = await Features.notification.fetchPosts();
                    const knownIds = GM_getValue('knownPostsIds', []);
                    
                    // 首次运行，只保存ID
                    if (!knownIds.length) {
                        GM_setValue('knownPostsIds', posts.map(p => p.id));
                        return;
                    }
                    
                    // 找出新帖
                    const newPosts = posts.filter(p => !knownIds.includes(p.id));
                    
                    // 发送通知
                    if (newPosts.length > 0) {
                        // 显示最多CONFIG.maxNotifications个通知
                        newPosts.slice(0, CONFIG.maxNotifications).forEach(post => {
                            Utils.notify(
                                '论坛新帖提醒', 
                                `${post.title}\n作者: ${post.author}`,
                                `https://boyshelpboys.com/${post.url}`,
                                post.id
                            );
                        });
                        
                        // 超过限制显示汇总通知
                        if (newPosts.length > CONFIG.maxNotifications) {
                            Utils.notify(
                                '论坛新帖提醒',
                                `还有 ${newPosts.length - CONFIG.maxNotifications} 个新帖未显示，点击查看`,
                                'https://boyshelpboys.com/'
                            );
                        }
                    }
                    
                    // 更新已知ID列表，保留最新的CONFIG.maxSavedIds个
                    const mergedIds = [...new Set([...posts.map(p => p.id), ...knownIds])].slice(0, CONFIG.maxSavedIds);
                    GM_setValue('knownPostsIds', mergedIds);
                    
                    } catch (error) {}
            },
            
            // 设置通知
            setup: () => {
                if (Features.notification.timer) {
                    clearInterval(Features.notification.timer);
                    Features.notification.timer = null;
                }
                
                if (GM_getValue('notification', false)) {
                    Features.notification.check();
                    Features.notification.timer = setInterval(
                        Features.notification.check,
                        CONFIG.checkInterval
                    );
                }
            }
        },
        
        // 快速预览功能
        quickPreview: {
            previewContainer: null,
            previewTimeout: null,
            previewDelay: 500, // 悬停多久后显示预览
            cache: {},         // 缓存已加载的帖子内容
            currentLink: null, // 当前预览的链接元素
            
            // 创建预览容器
            createContainer: () => {
                if (Features.quickPreview.previewContainer) return;
                
                const container = Utils.createEl('div', {
                    className: 'bhb-preview-container',
                    innerHTML: `
                        <div class="bhb-preview-header">
                            <div class="bhb-preview-title">加载中...</div>
                            <div class="bhb-preview-info"></div>
                        </div>
                        <div class="bhb-preview-content">
                            <div class="bhb-preview-loading">加载中...</div>
                        </div>
                        <div class="bhb-preview-footer">
                            <span>点击链接查看完整内容</span>
                            <span>社区助手提供</span>
                        </div>
                    `
                });
                
                document.body.appendChild(container);
                Features.quickPreview.previewContainer = container;
                
                // 添加点击事件监听器到document
                document.addEventListener('click', (e) => {
                    // 如果点击的是预览容器内部或当前预览的链接，不关闭
                    if (container.contains(e.target) || 
                        (Features.quickPreview.currentLink && 
                         Features.quickPreview.currentLink.contains(e.target))) {
                        return;
                    }
                    
                    // 点击其他地方，关闭预览
                    if (container.classList.contains('show')) {
                        container.classList.remove('show');
                        Features.quickPreview.currentLink = null;
                        
                        // 移除所有高亮
                        Utils.$$('.bhb-preview-highlight').forEach(el => {
                            el.classList.remove('bhb-preview-highlight');
                        });
                    }
                });
                
                // 添加键盘事件监听器 - ESC键关闭预览
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && container.classList.contains('show')) {
                        container.classList.remove('show');
                        Features.quickPreview.currentLink = null;
                        
                        // 移除所有高亮
                        Utils.$$('.bhb-preview-highlight').forEach(el => {
                            el.classList.remove('bhb-preview-highlight');
                        });
                    }
                });
            },
            
            // 获取帖子内容
            fetchPostContent: async (url) => {
                // 如果已缓存，直接返回
                if (Features.quickPreview.cache[url]) {
                    return Features.quickPreview.cache[url];
                }
                
                try {
                    const html = await Utils.request(url);
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    
                    // 尝试找到主帖内容
                    const mainPost = doc.querySelector('.message.break-all, .post-content, .thread-content');
                    if (!mainPost) throw new Error('无法找到帖子内容');
                    
                    // 获取帖子标题
                    const title = doc.querySelector('h1, .subject, .thread-subject')?.textContent.trim() || '无标题';
                    
                    // 获取作者和时间
                    const author = doc.querySelector('.username, .author')?.textContent.trim() || '匿名';
                    const time = doc.querySelector('.date, .time, .post-time')?.textContent.trim() || '';
                    
                    // 处理内容中的图片
                    const content = mainPost.innerHTML;
                    const processedContent = content
                        .replace(/<img[^>]*src="([^"]+)"[^>]*>/gi, '<img class="bhb-preview-img" src="$1" alt="图片">')
                        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''); // 移除脚本标签
                    
                    const result = {
                        title,
                        author,
                        time,
                        content: processedContent
                    };
                    
                    // 缓存结果
                    Features.quickPreview.cache[url] = result;
                    return result;
                } catch (error) {
                    throw error;
                }
            },
            
            // 显示预览
            showPreview: (link, event) => {
                if (!GM_getValue('quick_preview', false)) return;
                
                Features.quickPreview.createContainer();
                const container = Features.quickPreview.previewContainer;
                
                // 移除之前的高亮
                if (Features.quickPreview.currentLink && 
                    Features.quickPreview.currentLink !== link) {
                    const parentElement = Features.quickPreview.currentLink.closest('tr, li, .thread, .item');
                    if (parentElement) {
                        parentElement.classList.remove('bhb-preview-highlight');
                    }
                }
                
                // 保存当前预览的链接
                Features.quickPreview.currentLink = link;
                
                // 高亮当前链接所在的行或项目
                const parentElement = link.closest('tr, li, .thread, .item');
                if (parentElement) {
                    parentElement.classList.add('bhb-preview-highlight');
                }
                
                // 清除之前的定时器
                if (Features.quickPreview.previewTimeout) {
                    clearTimeout(Features.quickPreview.previewTimeout);
                }
                
                // 设置新的定时器
                Features.quickPreview.previewTimeout = setTimeout(async () => {
                    try {
                        // 显示加载状态
                        container.querySelector('.bhb-preview-title').textContent = '加载中...';
                        container.querySelector('.bhb-preview-info').textContent = '';
                        container.querySelector('.bhb-preview-content').innerHTML = '<div class="bhb-preview-loading">加载中...</div>';
                        container.classList.add('show');
                        
                        // 获取帖子内容
                        const url = link.href;
                        const postData = await Features.quickPreview.fetchPostContent(url);
                        
                        // 更新预览内容
                        container.querySelector('.bhb-preview-title').textContent = postData.title;
                        container.querySelector('.bhb-preview-info').textContent = `${postData.author} ${postData.time}`;
                        container.querySelector('.bhb-preview-content').innerHTML = postData.content;
                        
                    } catch (error) {
                        container.querySelector('.bhb-preview-content').innerHTML = 
                            `<div class="bhb-preview-error">加载失败: ${error.message}</div>`;
                    }
                }, Features.quickPreview.previewDelay);
            },
            
            // 添加预览事件
            addPreviewEvents: () => {
                if (!GM_getValue('quick_preview', false)) return;
                
                // 针对论坛特定结构的头像选择器
                const avatarSelectors = [
                    '.v_avatar', // 头像容器
                    '.v_avatar img', // 头像图片
                    '.avatar-3', // 具体的头像类名
                    'img.avatar' // 通用头像
                ];
                
                // 为所有头像添加预览事件
                Utils.$$(avatarSelectors.join(', ')).forEach(element => {
                    if (element.classList.contains('bhb-preview-added')) return;
                    
                    // 标记已添加预览事件
                    element.classList.add('bhb-preview-added');
                    
                    // 查找关联的帖子容器
                    let container = element.closest('li.thread, .thread');
                    if (!container) return;
                    
                    // 查找帖子链接或使用容器的data-href属性
                    let link = container.querySelector('a.subject[href*="thread-"]');
                    
                    // 如果找不到链接，尝试从data-href属性获取
                    if (!link && container.hasAttribute('data-href')) {
                        // 创建一个虚拟链接对象
                        link = {
                            href: 'https://boyshelpboys.com/' + container.getAttribute('data-href'),
                            textContent: container.querySelector('.subject')?.textContent || '帖子预览'
                        };
                    }
                    
                    // 如果找不到任何链接，放弃
                    if (!link) return;
                    
                    // 添加鼠标悬停事件
                    element.style.cursor = 'pointer';
                    element.setAttribute('title', '悬停查看帖子预览');
                    
                    element.addEventListener('mouseenter', (e) => {
                        Features.quickPreview.showPreview(link, e);
                    });
                });
                
                // 备选方案：直接处理thread元素
                if (Utils.$$('.bhb-preview-added').length === 0) {
                    Utils.$$('li.thread[data-href*="thread-"]').forEach(thread => {
                        const avatarContainer = thread.querySelector('.v_avatar');
                        if (!avatarContainer || avatarContainer.classList.contains('bhb-preview-added')) return;
                        
                        avatarContainer.classList.add('bhb-preview-added');
                        avatarContainer.style.cursor = 'pointer';
                        avatarContainer.setAttribute('title', '悬停查看帖子预览');
                        
                        const link = {
                            href: 'https://boyshelpboys.com/' + thread.getAttribute('data-href'),
                            textContent: thread.querySelector('.subject')?.textContent || '帖子预览'
                        };
                        
                        avatarContainer.addEventListener('mouseenter', (e) => {
                            Features.quickPreview.showPreview(link, e);
                        });
                    });
                }
            },
            
            // 清理资源
            cleanup: () => {
                if (Features.quickPreview.previewContainer) {
                    Features.quickPreview.previewContainer.remove();
                    Features.quickPreview.previewContainer = null;
                }
                
                if (Features.quickPreview.previewTimeout) {
                    clearTimeout(Features.quickPreview.previewTimeout);
                    Features.quickPreview.previewTimeout = null;
                }
                
                // 移除所有高亮
                Utils.$$('.bhb-preview-highlight').forEach(el => {
                    el.classList.remove('bhb-preview-highlight');
                });
                
                Features.quickPreview.cache = {};
                Features.quickPreview.currentLink = null;
            }
        },
        
        // 控制面板
        panel: {
            create: () => {
                const panel = Utils.createEl('div', {
                    id: 'bhb-panel',
                    innerHTML: `
            <div id="bhb-content">
                <div id="bhb-panel-header">
                    <span id="bhb-panel-title">社区助手</span>
                    <span class="bhb-tip">点击收起</span>
                </div>
                
                            <div class="bhb-section">
                                <div class="bhb-section-title">功能开关</div>
                                <div class="bhb-options-grid">
                    <div class="bhb-option">
                        <label class="bhb-checkbox-label">
                                            <input type="checkbox" id="bhb-newtab" class="bhb-checkbox">
                                            <span class="bhb-label">新标签</span>
                        </label>
                    </div>

                    <div class="bhb-option">
                        <label class="bhb-checkbox-label">
                                            <input type="checkbox" id="bhb-notification" class="bhb-checkbox">
                                            <span class="bhb-label">新帖通知</span>
                        </label>
                    </div>

                    <div class="bhb-option">
                        <label class="bhb-checkbox-label">
                                            <input type="checkbox" id="bhb-auto-pagination" class="bhb-checkbox">
                                            <span class="bhb-label">自动翻页</span>
                        </label>
                </div>

                                    <div class="bhb-option">
                                        <label class="bhb-checkbox-label">
                            <input type="checkbox" id="bhb-ai-summary" class="bhb-checkbox">
                                            <span class="bhb-label">AI总结</span>
                                        </label>
                    </div>

                                    <div class="bhb-option">
                                        <label class="bhb-checkbox-label">
                                            <input type="checkbox" id="bhb-quick-preview" class="bhb-checkbox">
                                            <span class="bhb-label">快速预览</span>
                                        </label>
                                    </div>
                        </div>
                    </div>

                            <div class="bhb-section">
                                <div class="bhb-section-title">高级设置</div>
                                <div class="bhb-input-section">
                                    <div class="bhb-option">
                                        <span class="bhb-btn" id="bhb-toggle-block">屏蔽用户</span>
                                    </div>
                                    <div class="bhb-option">
                            <span class="bhb-btn" id="bhb-toggle-css">自定义CSS</span>
                    </div>
                </div>

                <div class="bhb-input-area" id="bhb-block-area">
                    <textarea class="bhb-textarea" id="bhb-blocked-users" placeholder="每行一个用户名">${GM_getValue('blockedUsers', '')}</textarea>
                    <div style="display:flex;justify-content:flex-end">
                                        <button class="bhb-btn" id="bhb-apply-block" style="width:auto">应用</button>
                    </div>
                </div>

                <div class="bhb-input-area" id="bhb-css-area">
                    <textarea class="bhb-textarea" id="bhb-css" placeholder="输入CSS代码">${GM_getValue('customCSS', '')}</textarea>
                    <div style="display:flex;justify-content:flex-end">
                                        <button class="bhb-btn" id="bhb-apply-css" style="width:auto">应用</button>
                                    </div>
                    </div>
                </div>
            </div>
            <div id="bhb-toggle">B</div>
                    `
                });
                document.body.appendChild(panel);
                
                // 创建帮助区域
                const helpArea = Utils.createEl('div', {
                    id: 'bhb-help-area',
                    className: 'bhb-input-area',
                    innerHTML: `
                        <div class="bhb-help-content">
                            <h4 style="margin:4px 0;color:#ddd">BOYS HELP BOYS</h4>
                            <p style="margin:6px 0;line-height:1.4;font-size:12px"> 
                                - 鼠标悬浮到帖子头像即可预览帖子内容<br>


                                <br>
                                使用过程中有任何问题，请联系开发者。
                            </p>
                        </div>
                    `
                });
                panel.appendChild(helpArea);
                Features.panel.setup(panel);
            },
            
            setup: (panel) => {
            // 添加自定义样式元素
                const customStyle = Utils.createEl('style', {
                    id: 'bhb-custom-style',
                    textContent: GM_getValue('customCSS', '')
                });
            document.head.appendChild(customStyle);
                
                // 切换输入区域
                ['block', 'css'].forEach(type => {
                    Utils.$(`#bhb-toggle-${type}`, panel).onclick = () => {
                        const area = Utils.$(`#bhb-${type}-area`, panel);
                        Utils.$$('.bhb-input-area', panel).forEach(a => a !== area && a.classList.remove('active'));
                        Utils.toggleClass(area, 'active');
                };
            });

            // AI总结设置
                const aiSummaryCheckbox = Utils.$('#bhb-ai-summary', panel);
            aiSummaryCheckbox.checked = GM_getValue('ai_summary', false);
            aiSummaryCheckbox.onchange = () => {
                GM_setValue('ai_summary', aiSummaryCheckbox.checked);
                if (aiSummaryCheckbox.checked) {
                        Features.aiSummary.addButtons();
                } else {
                        Utils.$$('.ai-summary, .ai-summary-btn').forEach(el => el.remove());
                        Utils.$$('.ai-summary-added').forEach(el => el.classList.remove('ai-summary-added'));
                }
            };

            // 面板最小化功能
            const togglePanel = () => {
                    Utils.toggleClass(panel, 'mini');
                    GM_setValue('panelMini', panel.classList.contains('mini'));
                };
                
                Utils.$('#bhb-panel-header', panel).onclick = togglePanel;
                
                // 修改B按钮功能为展开帮助说明
                Utils.$('#bhb-toggle', panel).onclick = () => {
                    if (panel.classList.contains('mini')) {
                        // 如果面板是最小化状态，先恢复面板
                        Utils.toggleClass(panel, 'mini');
                        GM_setValue('panelMini', false);
                    } else {
                        // 否则切换帮助区域显示/隐藏
                        const helpArea = Utils.$('#bhb-help-area', panel);
                        Utils.toggleClass(helpArea, 'active');
                    }
                };
                
                if (GM_getValue('panelMini', false)) panel.classList.add('mini');
                
                // 新标签页设置
                const newTabCheckbox = Utils.$('#bhb-newtab', panel);
            newTabCheckbox.checked = GM_getValue('newtab', true);
            newTabCheckbox.onchange = () => {
                GM_setValue('newtab', newTabCheckbox.checked);
                    newTabCheckbox.checked && Features.openInNewTab();
                };
                
                // 新帖通知设置
                const notificationCheckbox = Utils.$('#bhb-notification', panel);
                notificationCheckbox.checked = GM_getValue('notification', false);
                notificationCheckbox.onchange = async () => {
                    const checked = notificationCheckbox.checked;
                    if (checked && "Notification" in window) {
                    const permission = await Notification.requestPermission();
                        if (permission !== 'granted') {
                            alert('需要开启浏览器通知权限才能接收新帖通知！');
                            notificationCheckbox.checked = false;
                            return;
                        }
                    }
                    GM_setValue('notification', checked);
                    Features.notification.setup();
                };
                
                // 自动翻页设置
                const autoPaginationCheckbox = Utils.$('#bhb-auto-pagination', panel);
                autoPaginationCheckbox.checked = GM_getValue('auto_pagination', false);
                autoPaginationCheckbox.onchange = () => {
                    const checked = autoPaginationCheckbox.checked;
                    GM_setValue('auto_pagination', checked);
                    
                    if (checked) {
                        Features.autoPagination.init();
                    } else {
                        Features.autoPagination.cleanup();
                    }
                };
                
                // 屏蔽用户设置
                Utils.$('#bhb-apply-block', panel).onclick = () => {
                    GM_setValue('blockedUsers', Utils.$('#bhb-blocked-users', panel).value.trim());
                    Features.blockUser();
                };
                
                // 自定义CSS设置
                Utils.$('#bhb-apply-css', panel).onclick = () => {
                    const css = Utils.$('#bhb-css', panel).value.trim();
                    GM_setValue('customCSS', css);
                    customStyle.textContent = css;
                };
                
                // 快速预览设置
                const quickPreviewCheckbox = Utils.$('#bhb-quick-preview', panel);
                quickPreviewCheckbox.checked = GM_getValue('quick_preview', false);
                quickPreviewCheckbox.onchange = () => {
                    GM_setValue('quick_preview', quickPreviewCheckbox.checked);
                    if (quickPreviewCheckbox.checked) {
                        Features.quickPreview.addPreviewEvents();
                } else {
                        Features.quickPreview.cleanup();
                    }
                };
            }
        }
    };
    
    // 初始化函数
    const init = () => {
        Features.panel.create();
        if (GM_getValue('newtab', true)) Features.openInNewTab();
        Features.blockUser();
        Features.notification.setup();
        Features.autoPagination.init();
        if (GM_getValue('quick_preview', false)) Features.quickPreview.addPreviewEvents();
        
        // 动态内容监听
        const observer = new MutationObserver((() => {
        let timer = null;
            return () => {
            if (timer) return;
            timer = setTimeout(() => {
                    if (GM_getValue('newtab', true)) Features.openInNewTab();
                    Features.blockUser();
                    if (GM_getValue('ai_summary', false)) Features.aiSummary.addButtons();
                    if (GM_getValue('quick_preview', false)) Features.quickPreview.addPreviewEvents();
                timer = null;
            }, 1000);
            };
        })());

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            if (GM_getValue('ai_summary', false)) Features.aiSummary.addButtons();
        }
    };

    // 等待DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 