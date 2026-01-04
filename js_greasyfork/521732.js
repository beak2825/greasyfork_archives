// ==UserScript==
// @name         V2EX 文章总结助手
// @name:zh-CN   V2EX 文章总结助手
// @namespace    https://github.com/jandaes/v2ex_ai
// @version      2.0.1
// @description  为 V2EX 帖子生成总结
// @description:zh-CN  为 V2EX 帖子生成总结
// @author       Jandaes
// @homepage     https://greasyfork.org/zh-CN/scripts/521732-v2ex-%E6%96%87%E7%AB%A0%E6%80%BB%E7%BB%93%E5%8A%A9%E6%89%8B
// @supportURL   https://github.com/Jandaes/v2ex_ai
// @match        *.v2ex.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @icon         https://www.v2ex.com/favicon.ico
// @license      MIT
// @copyright    2024, Jandaes (https://github.com/Jandaes)
// @downloadURL https://update.greasyfork.org/scripts/521732/V2EX%20%E6%96%87%E7%AB%A0%E6%80%BB%E7%BB%93%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521732/V2EX%20%E6%96%87%E7%AB%A0%E6%80%BB%E7%BB%93%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function(){
    'use strict';
    const d=document,ls=localStorage,w=window;
    const $=(s,p=d)=>p.querySelector(s);
    const t={dark:{bg:'#2d2d2d',t:'#e0e0e0',i:'#3d3d3d',b:'#4d4d4d'},light:{bg:'#fff',t:'#333',i:'#f5f5f5',b:'#ddd'}};
    const STORAGE_KEY = 'v2ex_summary_settings';
    const DEFAULT_SETTINGS = {
        apiUrl: '',
        apiKey: '',
        modelName: '',
        prompt: '只精简总结文章内容和评论的核心要点、不需要加入你的任何观点。分别输出文章内容和用户评论',
        theme: 'system'  // 默认跟随系统
    };
    const store = {
        get: () => {
            try {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(ls.getItem(STORAGE_KEY) || '{}') };
            } catch (e) {
                return { ...DEFAULT_SETTINGS };
            }
        },
        set: (settings) => {
            ls.setItem(STORAGE_KEY, JSON.stringify({ ...store.get(), ...settings }));
        }
    };
    
    function modal(){
        // 获取当前主题
        const settings = store.get();
        const isDark = settings.theme === 'dark' || 
                       (settings.theme === 'system' && w.matchMedia('(prefers-color-scheme:dark)').matches);
        const th = t[isDark ? 'dark' : 'light'];

        const m = createElement('div', {
            style: `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);display:flex;justify-content:center;align-items:center;z-index:1000`
        });

        const c = createElement('div', {
            style: `
                position:relative;
                background:${th.bg};
                padding:25px;
                border-radius:12px;
                width:450px;
                max-width:90%;
                color:${th.t};
                padding-bottom:20px;
                border:1px solid ${th.b}
            `
        });

        m.appendChild(c);

        c.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid ${th.b};padding-bottom:10px">
                <h3 style="margin:0;font-size:18px;color:${th.t}">V2EX 文章总结助手设置</h3>
                <div style="display:flex;align-items:center;gap:8px">
                    <span style="font-size:14px">主题</span>
                    <select id="theme" style="padding:4px 8px;background:${th.i};color:${th.t};border:1px solid ${th.b};border-radius:4px">
                        <option value="system">跟随系统</option>
                        <option value="light">浅色</option>
                        <option value="dark">深色</option>
                    </select>
                </div>
            </div>
            <div class="form">
                <div class="group"><label>API URL：</label><input id="url" placeholder="输入API地址"></div>
                <div class="group"><label>API Key：</label><div class="pwd"><input type="password" id="key" placeholder="输入API Key"><span class="eye">🔒</span></div></div>
                <div class="group"><label>模型名称：</label><input id="model" placeholder="输入模型名称"></div>
                <div class="group"><label>系统提示词：</label><textarea id="prompt" placeholder="请输入"></textarea></div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:25px">
                <a href="https://github.com/Jandaes/v2ex_ai" target="_blank" class="github">
                    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                    GitHub
                </a>
                <div style="display:flex;gap:10px">
                    <button id="cancel">取消</button>
                    <button id="save" class="primary">保存</button>
                </div>
            </div>
        `;

        addStyle(c, `
            .form{display:flex;flex-direction:column;gap:15px}
            .group{display:flex;align-items:center}
            .group label{width:85px;text-align:right;margin-right:15px;color:${th.t}}
            .group input,.group textarea{
                flex:1;
                padding:8px 12px;
                border:1px solid ${th.b};
                border-radius:6px;
                background:${th.i};
                color:${th.t}
            }
            .group textarea{height:100px;resize:vertical}
            .pwd{position:relative;flex:1;display:flex}
            .eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;user-select:none;opacity:.7}
            button{
                padding:8px 16px;
                border:none;
                border-radius:6px;
                background:${th.i};
                color:${th.t};
                cursor:pointer
            }
            .primary{background:#0066cc;color:#fff}
            .github{color:${th.t};text-decoration:none;opacity:.8;display:flex;align-items:center;gap:6px;font-size:14px}
        `);

        // 加载设置
        $('#url', c).value = settings.apiUrl;
        $('#key', c).value = settings.apiKey;
        $('#model', c).value = settings.modelName;
        $('#prompt', c).value = settings.prompt;
        $('#theme', c).value = settings.theme;

        // 添加主题切换事件
        $('#theme', c).onchange = function() {
            const newTheme = this.value;
            const isDark = newTheme === 'dark' || 
                          (newTheme === 'system' && w.matchMedia('(prefers-color-scheme:dark)').matches);
            const th = t[isDark ? 'dark' : 'light'];

            // 更新所有颜色
            c.style.background = th.bg;
            c.style.color = th.t;
            c.style.borderColor = th.b;

            // 更新所有输入框和按钮
            c.querySelectorAll('input, textarea, select').forEach(el => {
                el.style.background = th.i;
                el.style.color = th.t;
                el.style.borderColor = th.b;
            });

            // 更新标签颜色
            c.querySelectorAll('label, h3, .github').forEach(el => {
                el.style.color = th.t;
            });

            // 更新普通按钮
            c.querySelectorAll('button:not(.primary)').forEach(el => {
                el.style.background = th.i;
                el.style.color = th.t;
            });
        };

        // 将 modal 添加到 body
        d.body.appendChild(m);

        // 绑定事件
        $('.eye', c).onclick = e => {
            const i = $('#key', c);
            i.type = i.type === 'password' ? 'text' : 'password';
            e.target.textContent = i.type === 'password' ? '🔒' : '🔓';
        };

        $('#save', c).onclick = () => {
            store.set({
                apiUrl: $('#url', c).value,
                apiKey: $('#key', c).value,
                modelName: $('#model', c).value,
                prompt: $('#prompt', c).value
            });
            m.remove();
        };

        $('#cancel', c).onclick = () => m.remove();
        m.onclick = e => { if(e.target === m) m.remove(); };
    }

    function summary(){
        // 检查是否是文章页面（URL 包含 /t/数字）
        if (!w.location.pathname.match(/^\/t\/\d+/)) return;
        
        // 获取 gray 元素
        const gray = $('#Main .box .header .gray');
        if (!gray) {
            // 如果没找到元素，等待后重试
            setTimeout(summary, 500);  // 增加延迟时间
            return;
        }
        
        // 避免重复添加
        if (gray.querySelector('.summary-tools')) return;
        
        // 创建一个容器来包裹总结和设置按钮
        const toolsContainer = createElement('span', {
            className: 'summary-tools',
            style: 'display: inline-block; margin-left: 5px'  // 修改样式确保显示
        });
        
        // 创建总结按钮
        const sum = createElement('a', {
            href: 'javascript:void(0)',
            className: 'tb summary-button',
            innerHTML: '总结 <span style="font-size:14px">✨</span>',
            style: 'margin-left: 5px'  // 添加间距
        });
        
        // 创建设置按钮
        const set = createElement('a', {
            href: 'javascript:void(0)',
            className: 'tb settings-button',
            innerHTML: '设置 <span style="font-size:14px">⚙️</span>',
            style: 'margin-left: 5px'  // 添加间距
        });
        
        // 绑定点击事件
        sum.onclick = async () => {
            // 获取文章内容，如果没有内容则使用空字符串
            const content = getContent() || '';
            
            const container = getContainer();
            if(!container) return;
            
            const cont = $('.summary-content',container);
            
            // 如果已经有内容且不是错误消息，直接显示
            if(container.style.display==='none' && 
               cont.innerHTML && 
               !cont.innerHTML.includes('失败')) {
                container.style.display='block';
                return;
            }
            
            // 显示加载状态
            cont.textContent='正在获取评论...';
            container.style.display='block';
            
            // 获取所有评论
            const comments = await getAllComments();            
            // 组合文章内容和评论
            const fullContent = `
文章内容：
${content}

评论内容：
${comments.map(c => c.trim()).join(' ')}`;
            
            // 更新状态
            cont.textContent='正在生成总结...';
            
            // 发送到 LLM
            const sum = await request(fullContent);
            if(sum){
                cont.innerHTML = sum;
            }else{
                cont.textContent='生成总结失败，请检查设置和网络连接';
            }
        };
        set.onclick = modal;
        
        // 将按钮添加到容器中
        toolsContainer.appendChild(document.createTextNode(' • '));
        toolsContainer.appendChild(sum);
        toolsContainer.appendChild(document.createTextNode(' • '));
        toolsContainer.appendChild(set);
        
        // 将容器添加到 gray 元素中
        gray.appendChild(toolsContainer);
    }

    async function getAllComments() {
        let allComments = [];
        
        // 获取分页信息
        const pagination = $('.cell.ps_container');
        let pageInfo = {
            currentPage: 1,
            totalPages: 1
        };
        
        if(pagination) {
            const current = pagination.querySelector('div.page_current');
            if(current) {
                pageInfo.currentPage = parseInt(current.textContent);
            }
            
            const pages = [...pagination.querySelectorAll('a.page_normal')];
            if(pages.length > 0) {
                const lastPage = parseInt(pages[pages.length - 1].textContent);
                pageInfo.totalPages = Math.max(lastPage, pageInfo.currentPage);
            }
        }        
        // 获取所有页面的评论
        const topicId = w.location.pathname.match(/\/t\/(\d+)/)?.[1];
        if(topicId) {
            for(let page = 1; page <= pageInfo.totalPages; page++) {
                try {
                    if(page === pageInfo.currentPage) {
                        // 如果是当前页，直接获取DOM中的评论
                        allComments = allComments.concat(getPageComments(d));
                    } else {
                        // 获取其他页面的评论
                        const response = await fetch(`https://www.v2ex.com/t/${topicId}?p=${page}`);
                        const text = await response.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(text, 'text/html');
                        
                        const pageComments = getPageComments(doc);
                        allComments = allComments.concat(pageComments);
                    }
                    
                    if(page < pageInfo.totalPages) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }                    
                } catch(e) {
                    console.error(`获取第 ${page} 页评论失败:`, e);
                }
            }
        }
        
        return allComments;
    }

    function getPageComments(doc) {
        return [...doc.querySelectorAll('div[id^="r_"].cell')]
            .map(comment => comment.querySelector('.reply_content')?.textContent
                .replace(/\s+/g, ' ')  // 将多个空白字符替换为单个空格
                .trim())
            .filter(Boolean);  // 过滤掉空评论
    }

    function getContainer(){
        // 检查是否存在容器
        const existingContainer = $('.summary-container');
        if (existingContainer) return existingContainer;
        
        // 取 #Main .box 元素
        const mainBox = $('#Main .box');
        if (!mainBox) return null;
        
        // 创建总结容器，添加圆角边框样式
        const c = createElement('div', {
            className: 'summary-container cell',
            style: `padding:15px;font-size:14px;line-height:1.6;display:none;border-radius:6px;border:1px solid var(--box-border-color,#eee)`
        });
        
        const tb = createElement('div', {
            style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--box-border-color,#eee)'
        });
        
        const tl = createElement('div', {style: 'display:flex;align-items:center;gap:10px'});
        const title = createElement('div', {innerHTML: '📝 文章总结', style: 'font-weight:500'});
        const regen = createElement('a', {
            href: 'javascript:void(0)',
            className: 'tb',
            innerHTML: '🔄 重新生成',
            style: 'font-size:12px'
        });
        
        regen.onclick = async () => {
            const content = getContent();
            if (!content) return;
            
            const cont = $('.summary-content');
            cont.textContent = '正在重新生成总结...';
            
            const sum = await request(content);
            if (sum) {
                cont.innerHTML = sum;
            } else {
                cont.textContent = '生成总结失败，请检查设置和网络连接';
            }
        };
        
        tl.appendChild(title);
        tl.appendChild(regen);
        
        const close = createElement('span', {
            innerHTML: '✕',
            style: 'cursor:pointer;opacity:.6;font-size:16px;padding:4px 8px'
        });
        close.onclick = () => c.style.display = 'none';
        
        tb.appendChild(tl);
        tb.appendChild(close);
        c.appendChild(tb);
        
        const cont = createElement('div', {
            className: 'summary-content',
            style: 'white-space:pre-wrap;word-break:break-word;text-align:left;padding:10px 0;line-height:1.8'
        });
        c.appendChild(cont);
        
        // 将容器插入到第一个 cell 之前
        const firstCell = mainBox.querySelector('.cell');
        if (firstCell) {
            mainBox.insertBefore(c, firstCell);
        } else {
            mainBox.appendChild(c);
        }
        
        return c;
    }

    async function request(content, retries = 3, timeout = 10000) {
        const settings = store.get();
        if (!settings.apiUrl || !settings.apiKey || !settings.modelName) {
            alert('请先完成设置（API URL、API Key 和模型名称为必填项）');
            return null;
        }

        const fetchWithTimeout = (url, options, timeout) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: options.method,
                    url: url,
                    headers: options.headers,
                    data: options.body,
                    timeout: timeout,
                    onload: function(response) {
                        resolve({
                            ok: response.status >= 200 && response.status < 300,
                            status: response.status,
                            json: () => JSON.parse(response.responseText)
                        });
                    },
                    onerror: function(error) {
                        reject(new Error('Network error'));
                    },
                    ontimeout: function() {
                        reject(new Error('Request timeout'));
                    }
                });
            });
        };

        for (let i = 0; i < retries; i++) {
            try {
                const r = await fetchWithTimeout(settings.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${settings.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: [
                            {role: "system", content: settings.prompt},
                            {role: "user", content}
                        ],
                        model: settings.modelName,
                        stream: false
                    })
                }, timeout);

                if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
                const d = await r.json();
                return d.choices?.[0]?.message?.content || '总结生成失败，请检查API返回格式';

            } catch (e) {
                if (i === retries - 1) {
                    alert(`请求失败: ${e.message}`);
                    return null;
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                console.log(`第 ${i + 1} 次重试失败，准备重试...`);
            }
        }
    }

    function createElement(tag,props={}){
        const el=d.createElement(tag);
        Object.assign(el,props);
        return el;
    }

    function addStyle(el,css){
        const s=createElement('style');
        s.textContent=css;
        el.appendChild(s);
    }

    function getContent() {
        const contentElement = document.querySelector('#Main .topic_content');
        return contentElement ? contentElement.innerText : '';
    }

    function summarizeContent() {
        const content = getContent();
        // 如果内容为空，可以提前返回或显示提示
        if (!content) {
            alert('未找到文章内容');
            return;
        }
        // 其余代码...
    }

    function addButton() {
        const mainElement = document.querySelector('#Main');
        if (!mainElement) return;

        const button = document.createElement('button');
        button.textContent = '总结内容';
        button.style.marginBottom = '10px';
        button.onclick = summarizeContent; // 直接使用函数引用

        const resummaryButton = document.createElement('button');
        resummaryButton.textContent = '重新总结';
        resummaryButton.style.marginLeft = '10px';
        resummaryButton.style.marginBottom = '10px';
        resummaryButton.onclick = summarizeContent; // 同样直接使用函数引用

        mainElement.insertBefore(button, mainElement.firstChild);
        mainElement.insertBefore(resummaryButton, mainElement.firstChild.nextSibling);
    }

    // 为了处理可能的动态加载情况，添加 MutationObserver
    const observer = new MutationObserver((mutations, obs) => {
        if (!w.location.pathname.match(/^\/t\/\d+/)) return;
        
        const gray = $('#Main .box .header .gray');
        if (gray && !gray.querySelector('.summary-tools')) {
            summary();
        }
    });

    observer.observe(d.body, {
        childList: true,
        subtree: true
    });

    // 确保在 DOM 加载完成后执行
    if(d.readyState === 'loading') {
        d.addEventListener('DOMContentLoaded', () => setTimeout(summary, 0));
    } else {
        setTimeout(summary, 0);
    }
})(); 
