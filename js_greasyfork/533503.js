// ==UserScript==
// @name         微博复制助手
// @namespace    http://tampermonkey.net/
// @version      0.29
// @description  在微博博主页面添加复制按钮，方便复制博文和评论，支持复制链接，自动展开折叠内容，提取链接，短链接自动展开，保留格式换行，优化纯文本复制
// @author       You
// @match        https://weibo.com/u/*
// @match        https://weibo.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      t.cn
// @connect      weibo.cn
// @connect      sinaurl.cn
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533503/%E5%BE%AE%E5%8D%9A%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/533503/%E5%BE%AE%E5%8D%9A%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加样式
    GM_addStyle(`
        .copy-btn, .extract-links-btn, .copy-format-btn {
            display: inline-block !important; /* 强制显示我们的按钮 */
            margin-left: 10px;
            padding: 2px 8px;
            background-color: #ff8140;
            color: white;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            border: none;
            visibility: visible !important; /* 确保我们的按钮可见 */
            opacity: 1 !important; /* 确保我们的按钮不透明 */
        }
        .copy-btn:hover, .extract-links-btn:hover, .copy-format-btn:hover {
            background-color: #f26d31;
        }
        
        /* 链接弹窗样式 */
        .links-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 80%;
            max-height: 80%;
            overflow: auto;
            padding: 15px;
            display: none; /* 默认隐藏 */
        }
        .links-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .links-modal-title {
            font-size: 16px;
            font-weight: bold;
        }
        .links-modal-close {
            cursor: pointer;
            font-size: 18px;
            color: #666;
        }
        .links-modal-content {
            margin-bottom: 10px;
        }
        .links-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .links-list li {
            margin-bottom: 12px;
            padding: 8px;
            border-bottom: 1px solid #f0f0f0;
            word-break: break-all;
        }
        .links-list li:last-child {
            border-bottom: none;
        }
        .links-list a {
            color: #ff8140;
            text-decoration: none;
            word-break: break-all;
            display: block;
        }
        .links-list a:hover {
            text-decoration: underline;
        }
        .link-original {
            color: #666;
            font-size: 12px;
            margin-top: 4px;
            display: block;
        }
        .link-loading {
            color: #999;
            font-style: italic;
            font-size: 12px;
        }
        .links-modal-footer {
            display: flex;
            justify-content: flex-end;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        .copy-all-links-btn {
            background-color: #ff8140;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 5px 10px;
            cursor: pointer;
        }
        .copy-all-links-btn:hover {
            background-color: #f26d31;
        }
        .no-links {
            color: #999;
            font-style: italic;
        }
        
        /* 隐藏微博右上角的原生复制按钮 */
        .woo-box-flex > div:last-child > div > button.woo-button-main,
        .woo-box-flex > div:last-child > button.woo-button-main,
        button.woo-button-main[class*="Copy"],
        .woo-box-item-flex + button[class*="Button_"] { /* 新版微博右上角按钮 */
            display: none !important;
        }
        
        /* 保留格式弹窗样式 */
        .format-content-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            width: 80%;
            max-height: 80%;
            padding: 15px;
            display: none;
        }
        .format-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .format-modal-title {
            font-size: 16px;
            font-weight: bold;
        }
        .format-modal-close {
            cursor: pointer;
            font-size: 18px;
            color: #666;
        }
        .format-modal-content {
            margin-bottom: 10px;
            max-height: 60vh;
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-all;
            border: 1px solid #eee;
            padding: 10px;
            background-color: #f9f9f9;
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            line-height: 1.6;
        }
        .format-modal-footer {
            display: flex;
            justify-content: flex-end;
            border-top: 1px solid #eee;
            padding-top: 10px;
            gap: 10px;
        }
        .copy-format-all-btn, .copy-format-plain-btn {
            background-color: #ff8140;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 5px 10px;
            cursor: pointer;
        }
        .copy-format-all-btn:hover, .copy-format-plain-btn:hover {
            background-color: #f26d31;
        }
    `);

    // 遮罩层
    let modalOverlay = document.createElement('div');
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalOverlay.style.zIndex = '9999';
    modalOverlay.style.display = 'none';
    document.body.appendChild(modalOverlay);

    // 链接弹窗模板
    function createLinksModal() {
        const modal = document.createElement('div');
        modal.className = 'links-modal';
        modal.innerHTML = `
            <div class="links-modal-header">
                <div class="links-modal-title">提取的链接</div>
                <div class="links-modal-close">×</div>
            </div>
            <div class="links-modal-content">
                <ul class="links-list"></ul>
                <div class="no-links" style="display: none;">没有找到链接</div>
            </div>
            <div class="links-modal-footer">
                <button class="copy-all-links-btn">复制所有链接</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // 关闭按钮事件
        modal.querySelector('.links-modal-close').addEventListener('click', function() {
            modal.style.display = 'none';
            modalOverlay.style.display = 'none';
        });
        
        // 点击遮罩层关闭
        modalOverlay.addEventListener('click', function() {
            modal.style.display = 'none';
            modalOverlay.style.display = 'none';
        });
        
        // 复制所有链接按钮事件
        modal.querySelector('.copy-all-links-btn').addEventListener('click', function() {
            const links = [];
            modal.querySelectorAll('.links-list a.real-link').forEach(link => {
                links.push(link.href);
            });
            
            if (links.length > 0) {
                GM_setClipboard(links.join('\n'));
                this.textContent = '已复制!';
                setTimeout(() => {
                    this.textContent = '复制所有链接';
                }, 1000);
            }
        });
        
        return modal;
    }
    
    // 全局链接弹窗
    const linksModal = createLinksModal();
    
    // 格式化内容弹窗模板
    function createFormatContentModal() {
        const modal = document.createElement('div');
        modal.className = 'format-content-modal';
        modal.innerHTML = `
            <div class="format-modal-header">
                <div class="format-modal-title">带格式的内容</div>
                <div class="format-modal-close">×</div>
            </div>
            <div class="format-modal-content"></div>
            <div class="format-modal-footer">
                <button class="copy-format-plain-btn">复制纯文本</button>
                <button class="copy-format-all-btn">复制HTML</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // 关闭按钮事件
        modal.querySelector('.format-modal-close').addEventListener('click', function() {
            modal.style.display = 'none';
            modalOverlay.style.display = 'none';
        });
        
        // 点击遮罩层关闭
        modalOverlay.addEventListener('click', function() {
            modal.style.display = 'none';
            modalOverlay.style.display = 'none';
        });
        
        // 复制HTML按钮事件
        modal.querySelector('.copy-format-all-btn').addEventListener('click', function() {
            const content = modal.querySelector('.format-modal-content').innerHTML;
            const tempTextarea = document.createElement('textarea');
            tempTextarea.value = content;
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextarea);
            
            this.textContent = '已复制!';
            setTimeout(() => {
                this.textContent = '复制HTML';
            }, 1000);
        });
        
        // 复制纯文本按钮事件
        modal.querySelector('.copy-format-plain-btn').addEventListener('click', function() {
            const content = modal.querySelector('.format-modal-content').textContent;
            // 处理纯文本中的换行，确保保留格式
            const formattedText = content
                .replace(/\n{3,}/g, '\n\n') // 替换多个连续换行为两个换行
                .replace(/\s{2,}/g, ' ')    // 替换多个连续空格为一个空格
                .trim();                    // 修剪首尾空白
            
            GM_setClipboard(formattedText);
            
            this.textContent = '已复制!';
            setTimeout(() => {
                this.textContent = '复制纯文本';
            }, 1000);
        });
        
        return modal;
    }
    
    // 全局格式化内容弹窗
    const formatContentModal = createFormatContentModal();
    
    // 检测是否是短链接
    function isShortUrl(url) {
        // 检查常见的微博短链接域名
        const shortUrlDomains = [
            't.cn', 
            'weibo.cn', 
            'sinaurl.cn', 
            'sina.lt',
            'dwz.cn'
        ];
        
        try {
            const urlObj = new URL(url);
            return shortUrlDomains.some(domain => urlObj.hostname.includes(domain)) || 
                   urlObj.pathname.length < 10; // 路径很短也可能是短链接
        } catch (e) {
            return false;
        }
    }
    
    // 展开短链接获取真实URL
    function expandShortUrl(shortUrl, callback) {
        console.log('微博复制助手: 尝试展开短链接', shortUrl);
        
        GM_xmlhttpRequest({
            method: 'HEAD',
            url: shortUrl,
            timeout: 5000, // 5秒超时
            onload: function(response) {
                // 检查是否有重定向
                if (response.finalUrl && response.finalUrl !== shortUrl) {
                    console.log('微博复制助手: 短链接展开成功', shortUrl, '->', response.finalUrl);
                    callback(response.finalUrl);
                } else {
                    console.log('微博复制助手: 短链接没有重定向', shortUrl);
                    callback(shortUrl);
                }
            },
            onerror: function(error) {
                console.error('微博复制助手: 展开短链接失败', shortUrl, error);
                callback(shortUrl); // 失败时返回原始URL
            },
            ontimeout: function() {
                console.error('微博复制助手: 展开短链接超时', shortUrl);
                callback(shortUrl); // 超时时返回原始URL
            }
        });
    }
    
    // 显示链接弹窗
    function showLinksModal(links, title = '提取的链接') {
        const linksList = linksModal.querySelector('.links-list');
        const noLinks = linksModal.querySelector('.no-links');
        const modalTitle = linksModal.querySelector('.links-modal-title');
        
        // 设置标题
        modalTitle.textContent = title;
        
        // 清空链接列表
        linksList.innerHTML = '';
        
        // 添加链接
        if (links && links.length > 0) {
            links.forEach((link, index) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = link;
                a.textContent = link;
                a.className = 'real-link';
                a.target = '_blank'; // 在新标签页打开
                li.appendChild(a);
                
                // 检查是否是短链接，如果是则尝试展开
                if (isShortUrl(link)) {
                    // 添加加载中提示
                    const loadingSpan = document.createElement('span');
                    loadingSpan.className = 'link-loading';
                    loadingSpan.textContent = '正在展开短链接...';
                    li.appendChild(loadingSpan);
                    
                    // 尝试展开短链接
                    expandShortUrl(link, function(realUrl) {
                        // 移除加载提示
                        if (loadingSpan.parentNode) {
                            li.removeChild(loadingSpan);
                        }
                        
                        // 如果展开成功且链接不同，显示原始短链接提示
                        if (realUrl && realUrl !== link) {
                            a.href = realUrl; // 更新链接的href为真实URL
                            a.textContent = realUrl; // 更新显示的文本为真实URL
                            
                            // 添加原始短链接提示
                            const originalSpan = document.createElement('span');
                            originalSpan.className = 'link-original';
                            originalSpan.textContent = `原始短链接: ${link}`;
                            li.appendChild(originalSpan);
                        }
                    });
                }
                
                linksList.appendChild(li);
            });
            linksList.style.display = 'block';
            noLinks.style.display = 'none';
        } else {
            linksList.style.display = 'none';
            noLinks.style.display = 'block';
        }
        
        // 显示弹窗
        linksModal.style.display = 'block';
        modalOverlay.style.display = 'block';
    }
    
    // 显示格式化内容弹窗
    function showFormatContentModal(content, title = '带格式的内容') {
        const modalContent = formatContentModal.querySelector('.format-modal-content');
        const modalTitle = formatContentModal.querySelector('.format-modal-title');
        
        // 设置标题
        modalTitle.textContent = title;
        
        // 设置内容
        modalContent.innerHTML = content;
        
        // 显示弹窗
        formatContentModal.style.display = 'block';
        modalOverlay.style.display = 'block';
    }
    
    // 保留格式提取内容
    async function extractContentWithFormat(element) {
        if (!element) return '';
        
        // 先尝试展开折叠内容
        try {
            console.log('微博复制助手: 尝试展开折叠内容');
            await expandContent(element);
        } catch (error) {
            console.error('微博复制助手: 展开内容时出错', error);
            // 继续处理，即使展开失败，也尝试获取已有内容
        }
        
        // 创建一个虚拟的容器来复制内容结构
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = element.innerHTML;
        
        // 移除"收起"按钮和文本
        const hideButtons = tempContainer.querySelectorAll([
            'a.woo-box-flex[role="button"]', // 新版收起按钮
            'button[content="收起"]', // 收起按钮
            'a[action-type="fl_fold"]', // 旧版收起按钮
            '.WB_text_opt_fold', // 旧版收起区域
            '.content_opt_fold' // 收起选项区域
        ].join(', '));
        
        hideButtons.forEach(btn => {
            if (btn && btn.parentNode) {
                btn.parentNode.removeChild(btn);
            }
        });
        
        // 单独处理包含"收起"文本的span元素
        const hideSpans = findElementsByText(tempContainer, '收起');
        hideSpans.forEach(span => {
            if (span.tagName.toLowerCase() === 'span' && span.textContent.trim() === '收起') {
                if (span.parentNode) {
                    span.parentNode.removeChild(span);
                }
            }
        });
        
        // 查找所有包含"收起"文本的元素并移除
        const allTextNodes = getAllTextNodes(tempContainer);
        allTextNodes.forEach(node => {
            if (node.textContent && node.textContent.includes('收起')) {
                // 如果只是"收起"两个字，直接删除
                if (node.textContent.trim() === '收起') {
                    if (node.parentNode) {
                        node.parentNode.removeChild(node);
                    }
                } else {
                    // 如果是包含"收起"的文本，替换掉"收起"
                    node.textContent = node.textContent.replace(/收起/g, '');
                }
            }
        });
        
        // 处理表情包图片，将其转换为文本形式
        const emojiImages = tempContainer.querySelectorAll('img.woo-emoji, img[src*="emoticon"], img[src*="emoji"], img[alt*="表情"], img.face');
        
        emojiImages.forEach(img => {
            // 使用不同的方法尝试提取表情符号文本
            let emojiText = '';
            
            // 方法1: 使用alt属性
            if (img.alt) {
                emojiText = img.alt;
            }
            // 方法2: 使用title属性
            else if (img.title) {
                emojiText = img.title;
            }
            // 方法3: 从src URL中提取表情名称
            else if (img.src) {
                // 从URL中提取表情名称
                try {
                    const urlParts = img.src.split('/');
                    const filename = urlParts[urlParts.length - 1];
                    // 移除扩展名和查询参数
                    const nameWithoutExt = filename.split('.')[0].split('?')[0];
                    // 尝试将驼峰或下划线转换为可读文本
                    emojiText = nameWithoutExt
                        .replace(/([A-Z])/g, ' $1') // 驼峰转空格
                        .replace(/_/g, ' ') // 下划线转空格
                        .trim();
                        
                    // 如果提取出的文本看起来不像表情名称，使用通用表情描述
                    if (emojiText.length < 2 || /^\d+$/.test(emojiText)) {
                        emojiText = '[表情]';
                    }
                } catch (e) {
                    console.error('微博复制助手: 提取表情名称时出错', e);
                    emojiText = '[表情]';
                }
            }
            // 如果以上方法都失败，使用通用表示
            if (!emojiText) {
                emojiText = '[表情]';
            }
            
            // 创建文本节点替换图片
            const emojiSpan = document.createElement('span');
            emojiSpan.textContent = `[${emojiText}]`;
            emojiSpan.style.color = '#FF9500';
            emojiSpan.style.fontWeight = 'bold';
            if (img.parentNode) {
                img.parentNode.replaceChild(emojiSpan, img);
            }
        });
        
        // 处理链接，保留URL
        const links = tempContainer.querySelectorAll('a[href]');
        links.forEach(link => {
            // 获取链接的href属性和文本
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            
            // 如果有有效的URL，在链接文本后添加URL
            if (href && !href.startsWith('javascript:') && text) {
                // 检查是否是用户链接（这些不需要额外处理）
                const isUserLink = link.hasAttribute('usercard') || 
                                  href.startsWith('/u/') || 
                                  href.startsWith('/n/');
                
                if (!isUserLink) {
                    // 检查是否是相对链接，需要转换为绝对链接
                    let fullUrl = href;
                    if (href.startsWith('/')) {
                        // 相对路径转换为绝对路径
                        fullUrl = window.location.origin + href;
                    } else if (!href.startsWith('http')) {
                        // 如果不是以http开头且不是相对路径，可能是其他格式的链接
                        fullUrl = 'https://' + href;
                    }
                    
                    // 保持链接的可点击性，但加入URL显示
                    if (!link.getAttribute('data-processed')) {
                        // 创建一个span来包含原始文本和URL
                        link.setAttribute('data-original-text', text);
                        link.setAttribute('data-url', fullUrl);
                        link.setAttribute('data-processed', 'true');
                        link.style.color = '#1672F3';
                        link.style.textDecoration = 'underline';
                    }
                }
            }
        });
        
        // 移除微博界面元素
        const removeElements = tempContainer.querySelectorAll([
            '.toolbar_2rnW3', // 工具栏
            '.woo-panel-main', // 评论区
            '.woo-panel-extra', // 额外面板
            '.wbpro-opts', // 操作按钮区域
            '.WB_handle', // 旧版操作区
            '.wbpro-feed-footer', // 微博底部
            '.hide-text' // 隐藏文本（包括"收起"）
        ].join(', '));
        
        removeElements.forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        
        // 获取格式化后的HTML
        const formattedHTML = tempContainer.innerHTML;
        
        // 清理HTML - 移除行内的onclick等事件处理器和一些不必要的属性
        let cleanHTML = formattedHTML
            .replace(/\son\w+="[^"]*"/g, '') // 移除所有事件处理器 如onclick
            .replace(/\sclass="[^"]*"/g, '') // 移除class
            .replace(/\saction-data="[^"]*"/g, '') // 移除action-data
            .replace(/\saction-type="[^"]*"/g, '') // 移除action-type
            .replace(/\snode-type="[^"]*"/g, '') // 移除node-type
            .replace(/\srenderengine="[^"]*"/g, '') // 移除renderengine
            .replace(/\scomponent="[^"]*"/g, '') // 移除component
            .replace(/\smfp="[^"]*"/g, '') // 移除mfp
            .replace(/\sdata-[^=]*="[^"]*"/g, '') // 移除data-属性
            .replace(/\sactived="[^"]*"/g, '') // 移除actived属性
            .replace(/\shot="[^"]*"/g, '') // 移除hot属性
            .replace(/\sinteractive="[^"]*"/g, '') // 移除interactive属性
            .replace(/\srole="[^"]*"/g, ''); // 移除role属性
        
        // 强化处理段落和换行
        cleanHTML = cleanHTML
            .replace(/<div/g, '<p') // div替换为p标签
            .replace(/<\/div>/g, '</p>') // 关闭div替换为关闭p
            .replace(/<br><br>/g, '<br>') // 移除连续的换行
            .replace(/<p>\s*<\/p>/g, '') // 移除空段落
            .replace(/收起<\/a>/g, '</a>') // 移除"收起"文本
            .replace(/收起<\/span>/g, '</span>') // 移除span中的"收起"文本
            .replace(/"收起"/g, '""'); // 移除属性中的"收起"文本
        
        return cleanHTML;
    }
    
    // 查找所有文本节点的辅助函数
    function getAllTextNodes(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const nodes = [];
        let node;
        while (node = walker.nextNode()) {
            nodes.push(node);
        }
        
        return nodes;
    }

    // 通过文本内容查找元素的辅助函数
    function findElementsByText(parentElement, searchText) {
        if (!parentElement) return [];
        
        const result = [];
        const allElements = parentElement.querySelectorAll('*');
        
        allElements.forEach(element => {
            if (element.textContent && element.textContent.includes(searchText)) {
                result.push(element);
            }
        });
        
        return result;
    }

    // 从HTML内容中提取链接
    function extractLinksFromElement(element) {
        if (!element) return [];
        
        const links = [];
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = element.innerHTML;
        
        // 查找所有链接
        const anchors = tempContainer.querySelectorAll('a[href]');
        anchors.forEach(anchor => {
            const href = anchor.getAttribute('href');
            if (href && !href.startsWith('javascript:')) {
                // 排除用户链接
                const isUserLink = anchor.hasAttribute('usercard') || 
                                  href.startsWith('/u/') || 
                                  href.startsWith('/n/');
                
                if (!isUserLink) {
                    // 处理相对链接
                    let fullUrl = href;
                    if (href.startsWith('/')) {
                        fullUrl = window.location.origin + href;
                    } else if (!href.startsWith('http')) {
                        fullUrl = 'https://' + href;
                    }
                    links.push(fullUrl);
                }
            }
        });
        
        return links;
    }

    // 检测页面变化的观察器
    const observer = new MutationObserver(checkForNewContent);
    
    // 启动监听
    function startObserver() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 检查新的微博内容和评论
    function checkForNewContent(mutations) {
        // 处理微博内容 - 适配各种版本
        const newPosts = document.querySelectorAll([
            'article:not([data-processed])',
            '.Feed_body_3R4ey:not([data-processed])', 
            '.wbpro-feed-content:not([data-processed])', 
            '.WB_detail:not([data-processed])',
            '.wbpro-feed-item:not([data-processed])',
            '.wbpro-scroller:not([data-processed])'
        ].join(', '));
        
        newPosts.forEach(post => {
            addCopyButtonToPost(post);
            post.setAttribute('data-processed', 'true');
        });
        
        // 处理评论内容 - 适配各种版本
        const newComments = document.querySelectorAll([
            '.Comment_content_2jJd2:not([data-processed])', 
            '.wbpro-commentlist-item:not([data-processed])', 
            '.list_li:not([data-processed])',
            '.woo-panel-commentMain:not([data-processed])',
            '.woo-box-item-inlineBlock:not([data-processed])',
            '.wbpro-list .item1:not([data-processed])',
            '.item1 .con1:not([data-processed])',
            '.con1:not([data-processed])',
            '.info:not([data-processed])',
            // 添加二级和三级评论选择器
            '.list2 .item2:not([data-processed])',
            '.list2 .con2:not([data-processed])',
            '.con2:not([data-processed])'
        ].join(', '));
        
        newComments.forEach(comment => {
            addCopyButtonToComment(comment);
            comment.setAttribute('data-processed', 'true');
        });
        
        // 专门处理二级评论
        processSecondLevelComments();
        
        // 监听评论图标点击
        listenToCommentIcons();
        
        // 隐藏原生复制按钮
        hideNativeCopyButtons();
    }
    
    // 专门处理二级评论
    function processSecondLevelComments() {
        // 查找所有二级评论容器
        const secondLevelContainers = document.querySelectorAll('.list2:not([data-processed])');
        
        secondLevelContainers.forEach(container => {
            // 标记容器为已处理
            container.setAttribute('data-processed', 'true');
            
            // 查找所有二级评论项
            const secondLevelItems = container.querySelectorAll('.item2:not([data-processed]), .con2:not([data-processed])');
            
            secondLevelItems.forEach(item => {
                addCopyButtonToComment(item);
                item.setAttribute('data-processed', 'true');
            });
        });
    }
    
    // 监听评论图标点击
    function listenToCommentIcons() {
        // 找到所有未处理的评论图标
        const commentIcons = document.querySelectorAll([
            '.woo-font--comment:not([data-processed])',
            '.toolbar_iconWrap_3-rI7:not([data-processed])',
            '.wbpro-opts-item[title="评论"]:not([data-processed])',
            '.WB_handle li[title="评论"]:not([data-processed])',
            '.opt i.woo-font--comment:not([data-processed])'
        ].join(', '));
        
        commentIcons.forEach(icon => {
            // 标记为已处理
            icon.setAttribute('data-processed', 'true');
            
            // 添加点击事件监听器
            icon.addEventListener('click', function() {
                // 当评论图标被点击后，评论区通常会在几百毫秒内出现
                // 给予足够的时间让评论区加载出来
                setTimeout(() => {
                    processNewlyLoadedComments();
                }, 500);
                
                // 再次检查，以防评论加载较慢
                setTimeout(() => {
                    processNewlyLoadedComments();
                }, 1000);
                
                // 最后一次检查
                setTimeout(() => {
                    processNewlyLoadedComments();
                }, 2000);
            });
            
            console.log('微博复制助手: 为评论图标添加监听器', icon);
        });
    }
    
    // 处理新加载的评论区域
    function processNewlyLoadedComments() {
        // 评论区域的可能选择器
        const commentAreaSelectors = [
            '.woo-panel-main', // 新版微博评论区
            '.woo-box-wrap',   // 新版微博评论容器
            '.wbpro-commentlist', // 新版微博专业版评论列表
            '.WB_feed_expand',  // 旧版微博评论区
            '.list_box',       // 旧版移动版评论列表
            '.comment-content', // 通用评论内容
            '.wbpro-list',     // 新版微博评论列表
            '.Feed_box_3fswx',  // 新版微博评论框容器
            '.item1',          // 评论项
            '.con1',           // 评论内容
            '.list2'           // 二级评论容器
        ];
        
        // 尝试检查所有可能的评论区域
        commentAreaSelectors.forEach(selector => {
            const commentAreas = document.querySelectorAll(selector);
            commentAreas.forEach(area => {
                // 为评论区域内的评论添加复制按钮
                const comments = area.querySelectorAll([
                    '.Comment_content_2jJd2:not([data-processed])',
                    '.wbpro-commentlist-item:not([data-processed])',
                    '.list_li:not([data-processed])',
                    '.woo-panel-commentMain:not([data-processed])',
                    '.woo-box-item-inlineBlock:not([data-processed])',
                    '.wbpro-list .item1:not([data-processed])',
                    '.item1 .con1:not([data-processed])',
                    '.con1:not([data-processed])',
                    '.info:not([data-processed])',
                    // 添加二级评论选择器
                    '.list2 .item2:not([data-processed])',
                    '.list2 .con2:not([data-processed])',
                    '.con2:not([data-processed])'
                ].join(', '));
                
                if (comments.length > 0) {
                    console.log('微博复制助手: 找到新加载的评论', comments.length);
                    comments.forEach(comment => {
                        addCopyButtonToComment(comment);
                        comment.setAttribute('data-processed', 'true');
                    });
                }
                
                // 进一步检查评论区域中是否有直接的评论项
                if (area.classList.contains('item1') || area.classList.contains('con1') || 
                    area.classList.contains('item2') || area.classList.contains('con2')) {
                    if (!area.getAttribute('data-processed')) {
                        addCopyButtonToComment(area);
                        area.setAttribute('data-processed', 'true');
                    }
                }
                
                // 专门处理二级评论区域
                if (area.classList.contains('list2') && !area.getAttribute('data-processed')) {
                    processSecondLevelComments();
                    area.setAttribute('data-processed', 'true');
                }
            });
        });
        
        // 直接查找所有可能的评论项
        const directComments = document.querySelectorAll([
            '.wbpro-list .item1:not([data-processed])',
            '.item1 .con1:not([data-processed])',
            // 二级评论
            '.list2 .item2:not([data-processed])',
            '.list2 .con2:not([data-processed])'
        ].join(', '));
        
        if (directComments.length > 0) {
            console.log('微博复制助手: 找到直接评论项', directComments.length);
            directComments.forEach(comment => {
                addCopyButtonToComment(comment);
                comment.setAttribute('data-processed', 'true');
            });
        }
    }
    
    // 隐藏微博原生的复制按钮
    function hideNativeCopyButtons() {
        // 使用JavaScript进一步隐藏可能的复制按钮
        const possibleSelectors = [
            // 右上角区域
            '.woo-box-flex > div > button.woo-button-main',
            '.woo-box-flex > div:last-child > button',
            // 右上角具有特定类名的按钮
            'button.woo-button-main[class*="Copy"]'
        ];
        
        possibleSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // 检查文本内容是否包含"复制博文"
                if (el.textContent && el.textContent.includes('复制博文')) {
                    el.style.display = 'none';
                }
            });
        });
    }
    
    // 检查并展开折叠内容
    async function expandContent(element) {
        if (!element) return false;
        
        // 可能的展开按钮选择器（不使用:contains伪类，它不是标准CSS）
        const expandSelectors = [
            // 新版微博
            'button.woo-button-flat.woo-button-s[class*="ContentMore"]',
            'button.woo-button-flat.woo-button-s.ContentMore',
            'button[class*="expand"]',
            'button[class*="Expand"]',
            'div[class*="expand"]',
            'a[class*="expand"]',
            // 旧版微博
            'a[action-type="fl_unfold"]',
            '.WB_text_opt',
            '.WB_text a[onclick*="unfold"]',
            // 特殊的span展开按钮
            'span.expand',
            '.expand'
        ];
        
        // 搜索展开按钮
        let expandButton = null;
        
        // 首先尝试使用标准选择器
        for (const selector of expandSelectors) {
            try {
                expandButton = element.querySelector(selector) || element.parentNode.querySelector(selector);
                if (expandButton) {
                    console.log('微博复制助手: 找到展开按钮(选择器)', selector, expandButton);
                    break;
                }
            } catch (error) {
                console.error('微博复制助手: 选择器错误', selector, error);
            }
        }
        
        // 如果没找到，尝试通过文本内容查找
        if (!expandButton) {
            // 查找包含"展开"或"展开全文"的元素
            const textButtons = [
                ...findElementsByText(element, '展开'),
                ...findElementsByText(element, '展开全文')
            ];
            
            // 筛选可能的按钮元素，包括span元素
            const possibleButtons = textButtons.filter(el => {
                const tagName = el.tagName.toLowerCase();
                return tagName === 'button' || tagName === 'a' || tagName === 'span' ||
                       el.role === 'button' || el.getAttribute('role') === 'button' ||
                       el.classList.contains('expand') || // 特别处理展开类
                       el.onclick || el.getAttribute('onclick');
            });
            
            if (possibleButtons.length > 0) {
                expandButton = possibleButtons[0];
                console.log('微博复制助手: 找到展开按钮(文本)', expandButton);
            }
        }
        
        // 如果找到展开按钮，点击它
        if (expandButton) {
            console.log('微博复制助手: 准备点击展开按钮', expandButton);
            
            try {
                // 对于span.expand元素尝试多种点击方式
                if (expandButton.tagName.toLowerCase() === 'span' && expandButton.classList.contains('expand')) {
                    console.log('微博复制助手: 检测到span.expand元素，尝试特殊处理');
                    
                    // 方法1: 直接点击
                    expandButton.click();
                    
                    // 方法2: 创建点击事件
                    const clickEvent = document.createEvent('MouseEvents');
                    clickEvent.initEvent('click', true, true);
                    expandButton.dispatchEvent(clickEvent);
                    
                    // 方法3: 尝试点击父元素
                    if (expandButton.parentElement) {
                        console.log('微博复制助手: 尝试点击父元素');
                        expandButton.parentElement.click();
                    }
                    
                    // 方法4: 尝试移除展开元素并修改父元素样式以显示全部内容
                    const parentEl = expandButton.parentElement;
                    if (parentEl && parentEl.classList.contains('detail_wbtext_4CRf9')) {
                        console.log('微博复制助手: 尝试移除展开元素并显示全部内容');
                        // 保存原始内容但移除展开按钮
                        const fullText = parentEl.innerHTML.replace(/<span class="expand">展开<\/span>/, '');
                        parentEl.innerHTML = fullText;
                        // 移除可能的最大高度限制
                        parentEl.style.maxHeight = 'none';
                        parentEl.style.overflow = 'visible';
                    }
                } else {
                    // 正常点击
                    expandButton.click();
                }
                
                // 等待内容展开
                await new Promise(resolve => setTimeout(resolve, 800)); // 增加等待时间，确保内容展开
                console.log('微博复制助手: 内容已展开');
                return true;
            } catch (error) {
                console.error('微博复制助手: 展开内容时出错', error);
            }
        }
        
        return false;
    }
    
    // 获取和处理内容，保留链接
    async function extractContentWithLinks(element) {
        if (!element) return '';
        
        // 先尝试展开折叠内容
        try {
            console.log('微博复制助手: 尝试展开折叠内容');
            await expandContent(element);
        } catch (error) {
            console.error('微博复制助手: 展开内容时出错', error);
            // 继续处理，即使展开失败，也尝试获取已有内容
        }
        
        // 创建一个虚拟的容器来复制内容结构
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = element.innerHTML;
        
        // 检查是否是评论内容
        const isComment = element.closest('.item1, .item2, .con1, .con2') || 
                          element.classList.contains('item1') || 
                          element.classList.contains('item2') ||
                          element.classList.contains('con1') || 
                          element.classList.contains('con2');
        
        // 处理表情包图片，将其转换为文本形式
        const emojiImages = tempContainer.querySelectorAll('img.woo-emoji, img[src*="emoticon"], img[src*="emoji"], img[alt*="表情"], img.face');
        
        emojiImages.forEach(img => {
            // 使用不同的方法尝试提取表情符号文本
            let emojiText = '';
            
            // 方法1: 使用alt属性
            if (img.alt) {
                emojiText = img.alt;
            }
            // 方法2: 使用title属性
            else if (img.title) {
                emojiText = img.title;
            }
            // 方法3: 从src URL中提取表情名称
            else if (img.src) {
                // 从URL中提取表情名称
                try {
                    const urlParts = img.src.split('/');
                    const filename = urlParts[urlParts.length - 1];
                    // 移除扩展名和查询参数
                    const nameWithoutExt = filename.split('.')[0].split('?')[0];
                    // 尝试将驼峰或下划线转换为可读文本
                    emojiText = nameWithoutExt
                        .replace(/([A-Z])/g, ' $1') // 驼峰转空格
                        .replace(/_/g, ' ') // 下划线转空格
                        .trim();
                        
                    // 如果提取出的文本看起来不像表情名称，使用通用表情描述
                    if (emojiText.length < 2 || /^\d+$/.test(emojiText)) {
                        emojiText = '[表情]';
                    }
                } catch (e) {
                    console.error('微博复制助手: 提取表情名称时出错', e);
                    emojiText = '[表情]';
                }
            }
            // 如果以上方法都失败，使用通用表示
            if (!emojiText) {
                emojiText = '[表情]';
            }
            
            // 创建文本节点替换图片
            const emojiTextNode = document.createTextNode(`[${emojiText}]`);
            if (img.parentNode) {
                img.parentNode.replaceChild(emojiTextNode, img);
            }
        });
        
        // 处理链接，保留URL
        const links = tempContainer.querySelectorAll('a[href]');
        links.forEach(link => {
            // 获取链接的href属性和文本
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            
            // 如果有有效的URL，在链接文本后添加URL
            if (href && !href.startsWith('javascript:') && text) {
                // 检查是否是用户链接（这些不需要保留）
                const isUserLink = link.hasAttribute('usercard') || 
                                  href.startsWith('/u/') || 
                                  href.startsWith('/n/');
                
                if (!isUserLink) {
                    // 检查是否是相对链接，需要转换为绝对链接
                    let fullUrl = href;
                    if (href.startsWith('/')) {
                        // 相对路径转换为绝对路径
                        fullUrl = window.location.origin + href;
                    } else if (!href.startsWith('http')) {
                        // 如果不是以http开头且不是相对路径，可能是其他格式的链接
                        fullUrl = 'https://' + href;
                    }
                    
                    // 替换链接元素为文本加URL
                    link.textContent = `${text} [${fullUrl}]`;
                }
            }
        });
        
        // 获取处理后的文本内容
        let content = tempContainer.innerText || tempContainer.textContent;
        
        if (isComment) {
            // 简化处理：找到第一个冒号（中英文都考虑），移除前面的所有内容
            const colonIndex = Math.max(content.indexOf(':'), content.indexOf('：'));
            if (colonIndex > -1) {
                content = content.substring(colonIndex + 1).trim();
            }
            
            // 不再处理回复评论的情况，保持一致的处理方式
        }
        
        // 清理内容
        content = content.replace(/复制博文|复制评论|收起|转发|评论|赞|展开全文|投诉|展开|查看图片/g, '').trim();
        
        // 移除Unicode控制字符和特殊空白
        content = content.replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202F\u2060-\u2069]/g, '');
        
        // 移除多余空格和换行，但保留基本格式
        content = content.replace(/\s{3,}/g, '\n').trim();
        
        return content;
    }
    
    // 向微博内容添加复制按钮
    function addCopyButtonToPost(post) {
        // 适配各种版本的微博内容选择器
        const contentSelectors = [
            '.detail_wbtext_4CRf9', // 放在最前面，优先查找
            '.Feed_body_3R4ey', 
            '.wbpro-feed-content-text', 
            '.WB_text',
            '.woo-box-item-flex',
            '.text'
        ];
        
        // 尝试每个选择器直到找到一个匹配
        let contentElement = null;
        for (const selector of contentSelectors) {
            contentElement = post.querySelector(selector);
            if (contentElement) break;
        }
        
        if (!contentElement) return;
        
        // 检查是否已经添加了复制按钮
        if (post.querySelector('.copy-btn')) return;
        
        // 创建复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn'; // 使用自定义的类
        copyBtn.textContent = '复制博文';
        copyBtn.style.zIndex = '9999'; // 确保按钮在最上层
        copyBtn.style.marginTop = '5px'; // 与内容保持一些距离
        copyBtn.style.marginBottom = '5px'; // 底部也加点间距
        
        // 创建提取链接按钮
        const extractLinksBtn = document.createElement('button');
        extractLinksBtn.className = 'extract-links-btn';
        extractLinksBtn.textContent = '提取链接';
        extractLinksBtn.style.zIndex = '9999';
        extractLinksBtn.style.marginTop = '5px';
        extractLinksBtn.style.marginBottom = '5px';
        
        // 创建复制带格式的按钮
        const copyFormatBtn = document.createElement('button');
        copyFormatBtn.className = 'copy-format-btn';
        copyFormatBtn.textContent = '复制带格式';
        copyFormatBtn.style.zIndex = '9999';
        copyFormatBtn.style.marginTop = '5px';
        copyFormatBtn.style.marginBottom = '5px';
        
        // 添加复制按钮事件
        copyBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 保存按钮原始文本
            const originalText = copyBtn.textContent;
            
            try {
                // 先提取内容，然后再更改按钮状态
                const content = await extractContentWithLinks(contentElement);
                
                // 内容提取完成后再更改按钮状态
                copyBtn.textContent = '处理中...';
                copyBtn.disabled = true;
                
                // 复制到剪贴板
                GM_setClipboard(content);
                
                // 提示用户
                copyBtn.textContent = '已复制!';
                copyBtn.disabled = false;
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1000);
            } catch (error) {
                console.error('微博复制助手: 复制时出错', error);
                copyBtn.textContent = '复制失败';
                copyBtn.disabled = false;
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1000);
            }
        });
        
        // 添加提取链接按钮事件
        extractLinksBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                // 先尝试展开内容
                try {
                    await expandContent(contentElement);
                } catch (error) {
                    console.error('微博复制助手: 展开内容时出错', error);
                }
                
                // 提取链接
                const links = extractLinksFromElement(contentElement);
                
                // 如果没有链接，直接显示提示
                if (!links || links.length === 0) {
                    alert('未找到任何链接');
                    return;
                }
                
                // 显示链接弹窗
                showLinksModal(links, '博文中的链接');
            } catch (error) {
                console.error('微博复制助手: 提取链接时出错', error);
                alert('提取链接失败');
            }
        });
        
        // 添加复制带格式按钮事件
        copyFormatBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 保存按钮原始文本
            const originalText = copyFormatBtn.textContent;
            
            try {
                // 更改按钮状态
                copyFormatBtn.textContent = '处理中...';
                copyFormatBtn.disabled = true;
                
                // 提取带格式的内容
                const formattedContent = await extractContentWithFormat(contentElement);
                
                // 显示格式化内容弹窗
                showFormatContentModal(formattedContent, '博文带格式内容');
                
                // 恢复按钮状态
                copyFormatBtn.textContent = originalText;
                copyFormatBtn.disabled = false;
            } catch (error) {
                console.error('微博复制助手: 复制带格式时出错', error);
                copyFormatBtn.textContent = '处理失败';
                copyFormatBtn.disabled = false;
                setTimeout(() => {
                    copyFormatBtn.textContent = originalText;
                }, 1000);
            }
        });
        
        // 优先检查是否存在detail_wbtext_4CRf9类元素
        const detailWbTextElement = post.querySelector('.detail_wbtext_4CRf9') || 
                                    (contentElement.classList.contains('detail_wbtext_4CRf9') ? contentElement : null);
        
        if (detailWbTextElement) {
            // 如果找到了detail_wbtext_4CRf9元素，将按钮放在它的后面
            if (detailWbTextElement.parentNode) {
                detailWbTextElement.parentNode.insertBefore(copyFormatBtn, detailWbTextElement.nextSibling);
                detailWbTextElement.parentNode.insertBefore(copyBtn, copyFormatBtn);
                detailWbTextElement.parentNode.insertBefore(extractLinksBtn, detailWbTextElement.nextSibling.nextSibling.nextSibling);
                console.log('微博复制助手: 添加按钮到detail_wbtext_4CRf9后');
                return;
            }
        }
        
        // 如果没有找到detail_wbtext_4CRf9元素，回退到之前的查找逻辑
        
        // 查找微博内容的主容器
        let feedContentContainer = null;
        
        // 首先检查post本身是否有wbpro-feed-content类
        if (post.classList.contains('wbpro-feed-content')) {
            feedContentContainer = post;
        } else {
            // 查找post内的wbpro-feed-content元素
            feedContentContainer = post.querySelector('.wbpro-feed-content');
            
            // 如果找不到，尝试向上查找祖先元素
            if (!feedContentContainer) {
                let parent = post.parentElement;
                while (parent && parent !== document.body) {
                    if (parent.classList.contains('wbpro-feed-content')) {
                        feedContentContainer = parent;
                        break;
                    }
                    parent = parent.parentElement;
                }
            }
        }
        
        // 如果找到了wbpro-feed-content容器，将按钮添加到其中
        if (feedContentContainer) {
            // 如果已经有操作区域(底部工具栏)，将按钮放在那里
            const toolbarArea = feedContentContainer.querySelector('.wbpro-opts') || 
                               feedContentContainer.querySelector('.toolbar_2rnW3') || 
                               feedContentContainer.querySelector('.WB_handle');
            
            if (toolbarArea) {
                // 添加到工具栏开头
                if (toolbarArea.firstChild) {
                    toolbarArea.insertBefore(copyFormatBtn, toolbarArea.firstChild);
                    toolbarArea.insertBefore(copyBtn, copyFormatBtn);
                    toolbarArea.insertBefore(extractLinksBtn, toolbarArea.firstChild.nextSibling.nextSibling);
                } else {
                    toolbarArea.appendChild(copyBtn);
                    toolbarArea.appendChild(copyFormatBtn);
                    toolbarArea.appendChild(extractLinksBtn);
                }
                console.log('微博复制助手: 添加按钮到工具栏');
            } else {
                // 没有工具栏，添加到内容元素后面
                feedContentContainer.appendChild(copyBtn);
                feedContentContainer.appendChild(copyFormatBtn);
                feedContentContainer.appendChild(extractLinksBtn);
                console.log('微博复制助手: 添加按钮到微博内容容器');
            }
            return;
        }
        
        // 如果找不到wbpro-feed-content，使用内容元素作为放置位置
        const targetElement = contentElement.parentNode;
        if (targetElement) {
            targetElement.insertBefore(copyFormatBtn, contentElement.nextSibling);
            targetElement.insertBefore(copyBtn, copyFormatBtn);
            targetElement.insertBefore(extractLinksBtn, contentElement.nextSibling.nextSibling.nextSibling);
            console.log('微博复制助手: 添加按钮到内容元素后');
        }
    }
    
    // 向评论添加复制按钮
    function addCopyButtonToComment(comment) {
        // 适配各种版本的评论内容选择器
        const contentSelectors = [
            '.Comment_text_1Lcol', 
            '.wbpro-commentlist-content', 
            '.WB_text',
            '.detail_wbtext_4CRf9',
            '.text-content',
            '.text',
            '.con1 .text'
        ];
        
        // 尝试每个选择器直到找到一个匹配
        let contentElement = null;
        for (const selector of contentSelectors) {
            contentElement = comment.querySelector(selector);
            if (contentElement) break;
        }
        
        // 如果没找到明确的内容元素，但评论是con1类，可以直接使用
        if (!contentElement && (comment.classList.contains('con1') || comment.classList.contains('woo-box-item-flex'))) {
            contentElement = comment;
        }
        
        if (!contentElement) return;
        
        // 检查是否已经添加了复制按钮
        if (comment.querySelector('.copy-btn')) return;
        
        // 创建复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = '复制评论';
        copyBtn.style.marginLeft = '5px';
        copyBtn.style.zIndex = '9999'; // 确保按钮在最上层
        
        // 创建提取链接按钮
        const extractLinksBtn = document.createElement('button');
        extractLinksBtn.className = 'extract-links-btn';
        extractLinksBtn.textContent = '提取链接';
        extractLinksBtn.style.marginLeft = '5px';
        extractLinksBtn.style.zIndex = '9999';
        
        // 添加复制按钮事件
        copyBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 保存按钮原始文本
            const originalText = copyBtn.textContent;
            
            try {
                // 先提取内容，然后再更改按钮状态
                const content = await extractContentWithLinks(contentElement);
                
                // 内容提取完成后再更改按钮状态
                copyBtn.textContent = '处理中...';
                copyBtn.disabled = true;
                
                // 复制到剪贴板
                GM_setClipboard(content);
                
                // 提示用户
                copyBtn.textContent = '已复制!';
                copyBtn.disabled = false;
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1000);
            } catch (error) {
                console.error('微博复制助手: 复制评论时出错', error);
                copyBtn.textContent = '复制失败';
                copyBtn.disabled = false;
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1000);
            }
        });
        
        // 添加提取链接按钮事件
        extractLinksBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                // 提取链接
                const links = extractLinksFromElement(contentElement);
                
                // 如果没有链接，直接显示提示
                if (!links || links.length === 0) {
                    alert('未找到任何链接');
                    return;
                }
                
                // 显示链接弹窗
                showLinksModal(links, '评论中的链接');
            } catch (error) {
                console.error('微博复制助手: 提取评论链接时出错', error);
                alert('提取链接失败');
            }
        });
        
        // 优先寻找评论区信息行元素
        const infoSelectors = [
            '.info',
            '.info .opt',
            '.opt',
            '.toolbar_2rnW3',
            '.Comment_handle_2W1IA',
            '.WB_handle'
        ];
        
        // 查找合适的位置
        let targetElement = null;
        
        // 首先尝试找info元素
        for (const selector of infoSelectors) {
            targetElement = comment.querySelector(selector);
            if (targetElement) break;
        }
        
        // 如果找到了元素，确保不是item1in或woo-box-flex
        if (targetElement && 
            !targetElement.classList.contains('item1in') && 
            !targetElement.classList.contains('woo-box-flex')) {
            // 添加按钮到找到的元素中
            targetElement.appendChild(copyBtn);
            targetElement.appendChild(extractLinksBtn);
        } else {
            // 如果没找到合适的位置，或者找到的位置是不希望添加的类，
            // 尝试找con1元素
            const con1Element = comment.querySelector('.con1');
            if (con1Element && !con1Element.classList.contains('woo-box-flex')) {
                con1Element.appendChild(copyBtn);
                con1Element.appendChild(extractLinksBtn);
            } else if (contentElement.parentNode && 
                      !contentElement.parentNode.classList.contains('item1in') && 
                      !contentElement.parentNode.classList.contains('woo-box-flex')) {
                // 如果con1也不合适，尝试添加到内容元素的父节点
                contentElement.parentNode.appendChild(copyBtn);
                contentElement.parentNode.appendChild(extractLinksBtn);
            } else {
                // 如果以上都不适合，找评论元素本身，但确保不是item1in或woo-box-flex
                if (!comment.classList.contains('item1in') && !comment.classList.contains('woo-box-flex')) {
                    comment.appendChild(copyBtn);
                    comment.appendChild(extractLinksBtn);
                } else {
                    // 最后尝试在con1内找一个适合的子元素
                    const textElement = comment.querySelector('.text');
                    if (textElement) {
                        textElement.appendChild(copyBtn);
                        textElement.appendChild(extractLinksBtn);
                    }
                    // 如果以上都失败，则不添加按钮
                }
            }
        }
        
        // 打印调试信息
        console.log('微博复制助手: 添加复制和提取链接按钮到评论');
    }
    
    // 检查页面是否有新加载的内容
    function periodicCheck() {
        checkForNewContent();
        hideNativeCopyButtons(); // 定期检查并隐藏新出现的原生按钮
        // 每2秒检查一次新内容
        setTimeout(periodicCheck, 2000);
    }
    
    // 初始化
    function init() {
        console.log('微博复制助手: 初始化脚本');
        // 首次检查页面
        setTimeout(() => {
            checkForNewContent();
            startObserver();
            periodicCheck();
            hideNativeCopyButtons();
        }, 2000); // 给页面加载足够的时间
        
        // 监听页面滚动事件，处理懒加载内容
        window.addEventListener('scroll', function() {
            setTimeout(() => {
                checkForNewContent();
                hideNativeCopyButtons();
            }, 500);
        });
    }
    
    // 启动脚本
    window.addEventListener('load', init);
    
    // 如果页面已经加载完成，立即初始化
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    }
})(); 