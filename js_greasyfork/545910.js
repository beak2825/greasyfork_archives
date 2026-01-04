// ==UserScript==
// @name         阿里巴巴店铺分组产品数量统计
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  统计阿里巴巴店铺每个分组的产品数量 - 完全按照Python代码逻辑实现，优先从module-data中查找"产品分组"模块
// @author       You
// @license      You
// @match        https://*.alibaba.com/product*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/545910/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%BA%97%E9%93%BA%E5%88%86%E7%BB%84%E4%BA%A7%E5%93%81%E6%95%B0%E9%87%8F%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/545910/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%BA%97%E9%93%BA%E5%88%86%E7%BB%84%E4%BA%A7%E5%93%81%E6%95%B0%E9%87%8F%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .group-counter-btn {
            position: static;
            top: auto;
            right: auto;
            z-index: auto;
            background: #ff6b35;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            box-shadow: none;
            margin: 0;
            display: inline-block;
            vertical-align: middle;
        }
        .group-counter-btn:hover {
            background: #e55a2b;
            transform: scale(1.05);
            transition: all 0.2s ease;
        }
        .group-counter-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            max-width: 600px;
            max-height: 80vh;
            overflow: hidden;
            display: none;
        }
        .group-counter-header {
            background: #ff6b35;
            color: white;
            padding: 15px 20px;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .group-counter-header > div {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .group-counter-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .group-counter-content {
            padding: 20px;
            max-height: 60vh;
            overflow-y: auto;
        }
        .group-item {
            padding: 10px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .group-item:last-child {
            border-bottom: none;
        }
        .group-item.sub-group {
            margin-left: 20px;
            border-left: 3px solid #ff6b35;
            padding-left: 15px;
            background-color: #f9f9f9;
        }
        .group-name {
            flex: 1;
            font-size: 14px;
        }
        .group-count {
            background: #4CAF50;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            min-width: 40px;
            text-align: center;
        }
        .group-count.loading {
            background: #FF9800;
        }
        .group-count.error {
            background: #F44336;
        }
        .loading-spinner {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
            display: none;
        }
        .debug-info {
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            margin: 10px 0;
            font-family: monospace;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
        }
        .retry-btn {
            background: #2196F3;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px 5px;
        }
        .retry-btn:hover {
            background: #1976D2;
        }
        .debug-btn {
            background: #2196F3;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin: 0 5px;
            font-size: 12px;
        }
        .debug-btn:hover {
            background: #1976D2;
        }
    `);

    // 创建按钮
    function createButton() {
        // 这个函数现在由createButtonWithRetry替代，保留以兼容性
        createButtonWithRetry();
    }

    // 创建模态框
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'group-counter-modal';
        modal.innerHTML = `
            <div class="group-counter-header">
                <span>店铺分组产品统计</span>
                <div>
                    <button class="retry-btn" id="export-csv-btn">导出CSV</button>
                    <button class="group-counter-close">&times;</button>
                </div>
            </div>
            <div class="group-counter-content">
                <div id="group-list">
                    <div style="text-align: center; padding: 20px;">
                        <div class="loading-spinner"></div>
                        <p>正在分析店铺分组...</p>
                    </div>
                </div>
            </div>
        `;

        // 关闭按钮事件
        modal.querySelector('.group-counter-close').onclick = hideGroupCounter;
        // 导出按钮事件
        const exportBtn = modal.querySelector('#export-csv-btn');
        if (exportBtn) exportBtn.onclick = exportCurrentCountsToCSV;
        
        // 点击遮罩关闭
        modal.onclick = function(e) {
            if (e.target === modal) {
                hideGroupCounter();
            }
        };

        document.body.appendChild(modal);
        return modal;
    }

    // 创建遮罩
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.onclick = hideGroupCounter;
        document.body.appendChild(overlay);
        return overlay;
    }

    // 显示模态框
    function showGroupCounter() {
        const modal = document.querySelector('.group-counter-modal') || createModal();
        const overlay = document.querySelector('.overlay') || createOverlay();
        
        modal.style.display = 'block';
        overlay.style.display = 'block';
        
        // 开始分析分组
        analyzeGroups();
    }

    // 隐藏模态框
    function hideGroupCounter() {
        const modal = document.querySelector('.group-counter-modal');
        const overlay = document.querySelector('.overlay');
        
        if (modal) modal.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
    }

    // 递归生成分组序号和路径 - 参考Python代码的enumerate_groups函数
    function enumerateGroups(groups, parentNames = [], prefix = '') {
        const result = [];
        for (let idx = 0; idx < groups.length; idx++) {
            const group = groups[idx];
            const currentNames = [...parentNames, group.name || group.title || group.text];
            const number = prefix ? `${prefix}.${idx + 1}` : String(idx + 1);
            
            result.push({
                number: number,
                groupPath: currentNames,
                groupObj: group
            });
            
            if (group.children && group.children.length > 0) {
                result.push(...enumerateGroups(group.children, currentNames, number));
            }
        }
        return result;
    }

    // 递归查找moduleTitle - 参考Python代码的find_module_title函数
    function findModuleTitle(obj) {
        if (typeof obj === 'object' && obj !== null) {
            if (obj.moduleTitle) {
                return obj.moduleTitle;
            }
            
            for (const key in obj) {
                const found = findModuleTitle(obj[key]);
                if (found) return found;
            }
        } else if (Array.isArray(obj)) {
            for (const item of obj) {
                const found = findModuleTitle(item);
                if (found) return found;
            }
        }
        return null;
    }


    


    // 从页面中提取产品分类 - 完全按照Python代码的逻辑
    function extractCategoriesFromDOM() {
        console.log('开始从页面中提取产品分类...');
        
        // 首先尝试从当前页面的module-data中查找分组信息（按照Python代码的逻辑）
        console.log('尝试从当前页面的module-data中查找分组信息...');
        
        // 查找module-data
        const moduleDataMatches = document.documentElement.innerHTML.match(/module-data=(["\'])(.*?)\1/g);
        if (moduleDataMatches && moduleDataMatches.length > 0) {
            console.log(`当前页面找到 ${moduleDataMatches.length} 个module-data`);
            
            // 按照Python代码的逻辑，寻找"产品分组"模块
            const keepTitle = "产品分组";
            const targetPcTitle = "PC产品列表";
            
            for (let i = 0; i < moduleDataMatches.length; i++) {
                try {
                    const match = moduleDataMatches[i];
                    const moduleDataStr = match.match(/module-data=(["\'])(.*?)\1/)[2];
                    const decoded = decodeURIComponent(moduleDataStr);
                    const dataJson = JSON.parse(decoded);
                    const moduleTitle = findModuleTitle(dataJson);
                    
                    console.log(`模块 ${i + 1} 标题: ${moduleTitle}`);
                    
                    if (moduleTitle === keepTitle) {
                        console.log(`找到匹配的分组模块: ${keepTitle}`);
                        console.log(`完整模块数据结构:`, dataJson);
                        
                        // 按照Python代码的路径：dataJson['mds']['moduleData']['data']['groups']
                        if (dataJson.mds && dataJson.mds.moduleData && dataJson.mds.moduleData.data && dataJson.mds.moduleData.data.groups) {
                            const groups = dataJson.mds.moduleData.data.groups;
                            console.log('从Python代码路径找到分组数据:', groups);
                            
                            // 转换为JavaScript格式，保持层级结构
                            const categories = convertGroupsToCategories(groups);
                            console.log(`成功从module-data中提取到 ${categories.length} 个产品分类（包含子分类）`);
                            return categories;
                        }
                    }
                } catch (e) {
                    console.error(`解析模块 ${i + 1} 失败:`, e);
                    continue;
                }
            }
        }
        
        // 如果module-data中没有找到，尝试从DOM结构中查找
        console.log('module-data中未找到分组信息，尝试从DOM结构中查找...');
        const categories = extractCategoriesFromDOMStructure();
        
        if (categories.length > 0) {
            console.log(`成功从DOM中提取到 ${categories.length} 个产品分类（包含子分类）`);
            return categories;
        }
        
        console.log('从页面中未找到产品分类');
        return [];
    }
    
    // 从DOM结构中提取产品分类，支持二级分组
    function extractCategoriesFromDOMStructure() {
        const categories = [];
        
        // 尝试多种可能的选择器来找到产品分类容器
        const containerSelectors = [
            // 左侧产品分类容器
            '.category-list',
            '.product-category', 
            '.category-item',
            '.sidebar .category',
            '.left-sidebar .category',
            // 更通用的选择器
            '[class*="category"]',
            '[class*="分类"]',
            '.sidebar',
            '.left-sidebar'
        ];
        
        let categoryContainer = null;
        for (const selector of containerSelectors) {
            const container = document.querySelector(selector);
            if (container) {
                console.log(`找到分类容器: ${selector}`);
                categoryContainer = container;
                break;
            }
        }
        
        if (!categoryContainer) {
            // 如果没找到明确的容器，尝试查找包含"产品分类"文字的容器
            const allElements = document.querySelectorAll('*');
            for (const element of allElements) {
                if (element.textContent && element.textContent.includes('产品分类')) {
                    console.log('找到包含"产品分类"的容器:', element);
                    categoryContainer = element;
                    break;
                }
            }
        }
        
        if (categoryContainer) {
            // 递归提取分类，支持二级分组
            const extractedCategories = extractCategoriesRecursively(categoryContainer);
            categories.push(...extractedCategories);
        }
        
        return categories;
    }
    
    // 递归提取分类，支持多级分组
    function extractCategoriesRecursively(container, level = 0) {
        const categories = [];
        
        // 查找当前级别的分类链接
        const links = container.querySelectorAll(':scope > a, :scope > li > a, :scope > div > a');
        
        for (const link of links) {
            const text = link.textContent.trim();
            const href = link.getAttribute('href');
            
            if (text && text.length > 0 && text.length < 100) {
                // 过滤掉一些明显不是分类的文本
                if (!text.match(/^(首页|首页|联系我们|关于我们|公司简介|新闻|博客|帮助|搜索|登录|注册|English|中文)$/i)) {
                    const category = {
                        name: text,
                        url: href || '',
                        text: text,
                        level: level,
                        children: []
                    };
                    
                    // 查找子分类 - 改进的算法
                    const parentElement = link.parentElement;
                    if (parentElement) {
                        // 方法1: 查找同级的下一个元素，看是否包含子分类
                        let nextSibling = parentElement.nextElementSibling;
                        while (nextSibling && nextSibling.tagName === 'LI') {
                            // 检查这个元素是否包含子分类链接
                            const childLinks = nextSibling.querySelectorAll('a');
                            if (childLinks.length > 0) {
                                for (const childLink of childLinks) {
                                    const childText = childLink.textContent.trim();
                                    const childHref = childLink.getAttribute('href');
                                    
                                    if (childText && childText.length > 0 && childText.length < 100) {
                                        if (!childText.match(/^(首页|首页|联系我们|关于我们|公司简介|新闻|博客|帮助|搜索|登录|注册|English|中文)$/i)) {
                                            category.children.push({
                                                name: childText,
                                                url: childHref || '',
                                                text: childText,
                                                level: level + 1
                                            });
                                        }
                                    }
                                }
                                break;
                            }
                            nextSibling = nextSibling.nextElementSibling;
                        }
                        
                        // 方法2: 查找父元素的子元素，可能包含子分类
                        if (category.children.length === 0) {
                            const parentParent = parentElement.parentElement;
                            if (parentParent) {
                                // 查找包含当前链接的容器内的其他链接
                                const allLinksInContainer = parentParent.querySelectorAll('a');
                                for (const otherLink of allLinksInContainer) {
                                    if (otherLink !== link && otherLink.textContent.trim() !== text) {
                                        const otherText = otherLink.textContent.trim();
                                        const otherHref = otherLink.getAttribute('href');
                                        
                                        // 检查是否是子分类（通常子分类的文本更短，URL更具体）
                                        if (otherText && otherText.length > 0 && otherText.length < 50 && 
                                            otherHref && otherHref !== href && 
                                            !otherText.match(/^(首页|首页|联系我们|关于我们|公司简介|新闻|博客|帮助|搜索|登录|注册|English|中文)$/i)) {
                                            
                                            // 检查这个链接是否在当前链接之后（DOM顺序）
                                            if (otherLink.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING) {
                                                category.children.push({
                                                    name: otherText,
                                                    url: otherHref,
                                                    text: otherText,
                                                    level: level + 1
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        // 方法3: 查找特定的阿里巴巴分类结构
                        if (category.children.length === 0) {
                            // 查找包含"产品分类"文字的容器内的所有链接
                            const categorySection = container.closest('[class*="category"], [class*="分类"], .sidebar, .left-sidebar');
                            if (categorySection) {
                                const allCategoryLinks = categorySection.querySelectorAll('a');
                                let foundMainCategory = false;
                                
                                for (const catLink of allCategoryLinks) {
                                    const catText = catLink.textContent.trim();
                                    const catHref = catLink.getAttribute('href');
                                    
                                    if (catLink === link) {
                                        foundMainCategory = true;
                                        continue;
                                    }
                                    
                                    if (foundMainCategory && catText && catText.length > 0 && catText.length < 50 && 
                                        catHref && catHref !== href && 
                                        !catText.match(/^(首页|首页|联系我们|关于我们|公司简介|新闻|博客|帮助|搜索|登录|注册|English|中文)$/i)) {
                                        
                                        // 检查是否是子分类（通过URL模式判断）
                                        if (catHref.includes('product') || catHref.includes('category') || catHref.includes('group')) {
                                            category.children.push({
                                                name: catText,
                                                url: catHref,
                                                text: catText,
                                                level: level + 1
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    categories.push(category);
                    console.log(`找到${level === 0 ? '一级' : '二级'}分类: ${text}, URL: ${href}, 子分类数量: ${category.children.length}`);
                }
            }
        }
        
        return categories;
    }
    
    // 将module-data中的分组数据转换为分类格式，保持层级结构
    function convertGroupsToCategories(groups) {
        const categories = [];
        
        for (const group of groups) {
            const category = {
                name: group.name || group.title || group.text || '未知分组',
                url: group.url || '',
                text: group.name || group.title || group.text || '未知分组',
                level: 0,
                children: []
            };
            
            // 处理子分组
            if (group.children && group.children.length > 0) {
                for (const child of group.children) {
                    category.children.push({
                        name: child.name || child.title || child.text || '未知子分组',
                        url: child.url || '',
                        text: child.name || child.title || child.text || '未知子分组',
                        level: 1
                    });
                }
            }
            
            categories.push(category);
        }
        
        return categories;
    }
     
     // 显示从DOM中提取的分组数据
     function displayGroupsFromDOM(groups, baseUrl) {
         console.log('显示从DOM中提取的分组数据:', groups);
         
         const groupList = document.getElementById('group-list');
         
         // 显示分组列表
         let htmlContent = '';
         
         // 添加全店产品
         htmlContent += `
             <div class="group-item">
                 <span class="group-name">0. 全店所有产品</span>
                 <span class="group-count loading" id="count-all-store">
                     <span class="loading-spinner"></span>
                 </span>
             </div>
         `;
         
         // 添加橱窗产品
         htmlContent += `
             <div class="group-item">
                 <span class="group-name">0.1. 橱窗产品</span>
                 <span class="group-count loading" id="count-featured">
                     <span class="loading-spinner"></span>
                 </span>
             </div>
         `;
         
         // 添加从DOM中提取的分组，包括二级分组
         let groupIndex = 1;
         for (let i = 0; i < groups.length; i++) {
             const group = groups[i];
             
             // 显示一级分组
             htmlContent += `
                 <div class="group-item">
                     <span class="group-name">${groupIndex}. ${group.name}</span>
                     <span class="group-count loading" id="count-dom-${i}-main">
                         <span class="loading-spinner"></span>
                     </span>
                 </div>
             `;
             
             // 显示二级分组（子分类）
             if (group.children && group.children.length > 0) {
                 for (let j = 0; j < group.children.length; j++) {
                     const child = group.children[j];
                     htmlContent += `
                         <div class="group-item sub-group" style="margin-left: 20px;">
                             <span class="group-name">${groupIndex}.${j + 1}. ${child.name}</span>
                             <span class="group-count loading" id="count-dom-${i}-child-${j}">
                                 <span class="loading-spinner"></span>
                             </span>
                         </div>
                     `;
                 }
             }
             
             groupIndex++;
         }
         
         groupList.innerHTML = htmlContent;
         
         // 异步获取产品数量
         getProductCountsFromDOM(baseUrl, groups);
     }
     
     // 并发执行器（限制最大并发数）
     async function runTasksWithConcurrency(tasks, worker, limit = 8) {
         const results = new Array(tasks.length);
         let nextIndex = 0;
         let active = 0;
         return new Promise((resolve) => {
             const runNext = () => {
                 while (active < limit && nextIndex < tasks.length) {
                     const current = nextIndex++;
                     active++;
                     Promise.resolve(worker(tasks[current], current))
                         .then((res) => { results[current] = res; })
                         .catch((err) => { results[current] = err; })
                         .finally(() => {
                             active--;
                             if (nextIndex === tasks.length && active === 0) {
                                 resolve(results);
                             } else {
                                 runNext();
                             }
                         });
                 }
             };
             runNext();
         });
     }

     function sanitizeListingUrl(u) {
         if (!u) return u;
         try {
             // 移除跟踪参数（如 ?spm=...）及所有查询串/哈希，保证列表页可返回正确模块
             const cleaned = u.replace(/[?#].*$/, '');
             console.log(`URL清理: "${u}" -> "${cleaned}"`);
             return cleaned;
         } catch (e) {
             console.error('URL清理失败:', e);
             return u;
         }
     }

     function resolveUrl(rawUrl, baseUrl) {
         if (!rawUrl) return null;
         let full;
         if (rawUrl.startsWith('http')) full = rawUrl;
         else if (rawUrl.startsWith('/')) full = baseUrl + rawUrl;
         else full = baseUrl + '/' + rawUrl;
         return sanitizeListingUrl(full);
     }

     // 获取从DOM中提取的分组的产品数量
     async function getProductCountsFromDOM(baseUrl, groups) {
         try {
             const tasks = [];
             let seq = 0;
             // 全店与橱窗
             tasks.push({ id: 'count-all-store', url: sanitizeListingUrl(baseUrl + '/productlist.html'), label: '全店所有产品', parent: '', seq: seq++ });
             tasks.push({ id: 'count-featured', url: sanitizeListingUrl(baseUrl + '/featureproductlist-1.html'), label: '橱窗产品', parent: '', seq: seq++ });

             // 各分组与子分组
             for (let i = 0; i < groups.length; i++) {
                 const group = groups[i];
                 const mainUrl = resolveUrl(group.url, baseUrl);
                 if (mainUrl) {
                     tasks.push({ id: `count-dom-${i}-main`, url: mainUrl, label: group.name || `分组${i+1}`, parent: '', seq: seq++ });
                 } else {
                     updateCountDisplay(`count-dom-${i}-main`, 0);
                 }
                 if (group.children && group.children.length > 0) {
                     for (let j = 0; j < group.children.length; j++) {
                         const child = group.children[j];
                         const childUrl = resolveUrl(child.url, baseUrl);
                         if (childUrl) {
                             tasks.push({ id: `count-dom-${i}-child-${j}`, url: childUrl, label: child.name || `子分组${j+1}`, parent: group.name || `分组${i+1}`, seq: seq++ });
                         } else {
                             updateCountDisplay(`count-dom-${i}-child-${j}`, 0);
                         }
                     }
                 }
             }

            await runTasksWithConcurrency(tasks, async (task) => {
                const cnt = await getImprovedProductCount(sanitizeListingUrl(task.url), "PC产品列表");
                updateCountDisplay(task.id, cnt);
                collectCountForExport(task, cnt);
            }, 8);
         } catch (e) {
             console.error('获取产品数量失败:', e);
         }
     }
     
     // 分析店铺分组 - 参考Python代码的主要逻辑
     async function analyzeGroups() {
        const groupList = document.getElementById('group-list');
        const currentUrl = window.location.href;
        
        try {
            // 获取店铺基础URL - 参考Python代码的URL处理逻辑，并清理所有查询参数
            let baseUrl = sanitizeListingUrl(currentUrl);
            if (baseUrl.includes('/productlist.html')) {
                baseUrl = baseUrl.replace('/productlist.html', '');
            } else if (baseUrl.includes('/featureproductlist-')) {
                baseUrl = baseUrl.replace(/\/featureproductlist-\d+\.html/, '');
            } else if (baseUrl.includes('/productgrouplist-')) {
                baseUrl = baseUrl.replace(/\/productgrouplist-\d+.*/, '');
            }
            
            console.log('清理后的店铺基础URL:', baseUrl);
            
                         groupList.innerHTML = '<p>正在分析页面结构...</p>';
             
             // 首先尝试从当前页面的DOM结构中直接提取产品分类
             console.log('尝试从页面DOM结构中提取产品分类...');
             let groups = extractCategoriesFromDOM();
             
             if (groups.length > 0) {
                 console.log('从DOM结构成功提取到产品分类:', groups);
                 displayGroupsFromDOM(groups, baseUrl);
                 return;
             }
             
             // 如果DOM中没有找到，尝试从module-data中查找
             console.log('DOM中未找到产品分类，尝试从module-data中查找...');
             
             // 获取店铺主页面 - 使用清理后的URL
             const mainPageUrl = sanitizeListingUrl(baseUrl + '/productlist.html');
             console.log('获取店铺主页面URL:', mainPageUrl);
             const response = await fetch(mainPageUrl);
             const html = await response.text();
             
             // 调试信息：检查页面内容
             console.log('页面大小:', html.length);
             console.log('页面URL:', mainPageUrl);
             
             // 查找module-data - 参考Python代码的匹配逻辑
             const moduleDataMatches = html.match(/module-data=(["\'])(.*?)\1/g);
             console.log('找到module-data数量:', moduleDataMatches ? moduleDataMatches.length : 0);
             
             if (!moduleDataMatches || moduleDataMatches.length === 0) {
                 groupList.innerHTML = `
                     <p style="color: orange;">未找到module-data，尝试其他数据源...</p>
                     <p>页面大小: ${html.length} 字符</p>
                     <p>正在检查页面结构...</p>
                 `;
                 
                 await checkAlternativeDataSources(html, groupList, baseUrl);
                 return;
             }
                         // 尝试多个可能的模块标题 - 参考Python代码的逻辑，但增加更多匹配选项
             const possibleKeepTitles = ["产品分组", "分类商品", "商品分类", "产品分类"];
             const targetPcTitle = "PC产品列表";  // 参考Python代码的target_pc_title
             
             // 记录所有找到的模块标题，帮助调试
             const allModuleTitles = [];
            
            // 解析分组数据 - 参考Python代码的解析逻辑
            for (let i = 0; i < moduleDataMatches.length; i++) {
                const match = moduleDataMatches[i];
                try {
                    const moduleDataStr = match.match(/module-data=(["\'])(.*?)\1/)[2];
                    const decoded = decodeURIComponent(moduleDataStr);
                    const dataJson = JSON.parse(decoded);
                    const moduleTitle = findModuleTitle(dataJson);
                    
                                         console.log(`模块 ${i + 1} 标题:`, moduleTitle);
                     console.log(`模块 ${i + 1} 数据结构:`, dataJson);
                     
                     // 记录所有模块标题
                     if (moduleTitle) {
                         allModuleTitles.push(moduleTitle);
                     }
                     
                     // 检查是否匹配任何可能的分组模块标题
                     if (possibleKeepTitles.includes(moduleTitle)) {
                        console.log(`找到匹配的分组模块: ${moduleTitle}`);
                        console.log(`完整模块数据结构:`, dataJson);
                        
                        // 尝试多种可能的数据结构 - 参考Python代码的路径
                        console.log('检查 dataJson.mds:', dataJson.mds);
                        if (dataJson.mds) {
                            console.log('检查 dataJson.mds.moduleData:', dataJson.mds.moduleData);
                            if (dataJson.mds.moduleData) {
                                console.log('检查 dataJson.mds.moduleData.data:', dataJson.mds.moduleData.data);
                                
                                // 如果data字段不存在，尝试从moduleData的其他字段中寻找分组信息
                                if (dataJson.mds.moduleData.data) {
                                    const moduleData = dataJson.mds.moduleData.data;
                                    console.log(`模块数据字段:`, Object.keys(moduleData));
                                    console.log('模块数据内容:', moduleData);
                                    
                                    // 尝试不同的分组数据字段
                                                                         if (moduleData.groups && moduleData.groups.length > 0) {
                                         groups = moduleData.groups;
                                         console.log('从groups字段找到分组数据:', groups);
                                         
                                         // 检查分组数据中是否包含产品数量信息
                                         for (const group of groups) {
                                             console.log('分组详情:', group);
                                             console.log('分组字段:', Object.keys(group));
                                             
                                             // 检查是否有产品数量相关字段
                                             if (group.productCount !== undefined) {
                                                 console.log('分组产品数量字段:', group.productCount);
                                                 console.log('注意：这个数量可能是全店总数，不是分组特定数量');
                                             }
                                             if (group.count !== undefined) {
                                                 console.log('分组数量字段:', group.count);
                                             }
                                             if (group.total !== undefined) {
                                                 console.log('分组总数字段:', group.total);
                                             }
                                             
                                             // 检查是否有其他可能包含分组特定数量的字段
                                             for (const key in group) {
                                                 if (key !== 'productCount' && key !== 'count' && key !== 'total') {
                                                     const value = group[key];
                                                     if (typeof value === 'number' && value > 0 && value < 1000) {
                                                         console.log(`可能的数量字段 ${key}:`, value);
                                                     }
                                                 }
                                             }
                                             
                                             if (group.children && group.children.length > 0) {
                                                 for (const child of group.children) {
                                                     console.log('子分组详情:', child);
                                                     console.log('子分组字段:', Object.keys(child));
                                                     
                                                     if (child.productCount !== undefined) {
                                                         console.log('子分组产品数量字段:', child.productCount);
                                                         console.log('注意：这个数量可能是全店总数，不是子分组特定数量');
                                                     }
                                                     if (child.count !== undefined) {
                                                         console.log('子分组数量字段:', child.count);
                                                     }
                                                     if (child.total !== undefined) {
                                                         console.log('子分组总数字段:', child.total);
                                                     }
                                                     
                                                     // 检查子分组是否有其他可能包含数量的字段
                                                     for (const key in child) {
                                                         if (key !== 'productCount' && key !== 'count' && key !== 'total') {
                                                             const value = child[key];
                                                             if (typeof value === 'number' && value > 0 && value < 1000) {
                                                                 console.log(`子分组可能的数量字段 ${key}:`, value);
                                                             }
                                                         }
                                                     }
                                                 }
                                             }
                                         }
                                         break;
                                    } else if (moduleData.categories && moduleData.categories.length > 0) {
                                        groups = moduleData.categories;
                                        console.log('从categories字段找到分组数据:', groups);
                                        break;
                                    } else if (moduleData.productGroups && moduleData.productGroups.length > 0) {
                                        groups = moduleData.productGroups;
                                        console.log('从productGroups字段找到分组数据:', groups);
                                        break;
                                    } else if (moduleData.productCategories && moduleData.productCategories.length > 0) {
                                        groups = moduleData.productCategories;
                                        console.log('从productCategories字段找到分组数据:', groups);
                                        break;
                                    } else {
                                        console.log('模块数据结构:', moduleData);
                                        // 如果没有找到标准字段，尝试遍历所有字段寻找分组数据
                                        for (const key in moduleData) {
                                            if (Array.isArray(moduleData[key]) && moduleData[key].length > 0) {
                                                const firstItem = moduleData[key][0];
                                                console.log(`检查字段 ${key}:`, moduleData[key]);
                                                if (firstItem && (firstItem.name || firstItem.title || firstItem.categoryName)) {
                                                    console.log(`尝试使用字段 ${key} 作为分组数据:`, moduleData[key]);
                                                    groups = moduleData[key];
                                                    break;
                                                }
                                            }
                                        }
                                        if (groups.length > 0) break;
                                    }
                                } else {
                                    console.log('dataJson.mds.moduleData.data 不存在，尝试从moduleData中寻找分组信息');
                                    
                                    // 检查moduleData中是否有其他可能包含分组信息的字段
                                    const moduleData = dataJson.mds.moduleData;
                                    console.log('moduleData字段:', Object.keys(moduleData));
                                    console.log('moduleData内容:', moduleData);
                                    
                                    // 尝试从moduleData中寻找分组数据
                                    for (const key in moduleData) {
                                        if (Array.isArray(moduleData[key]) && moduleData[key].length > 0) {
                                            const firstItem = moduleData[key][0];
                                            console.log(`检查moduleData字段 ${key}:`, moduleData[key]);
                                            if (firstItem && (firstItem.name || firstItem.title || firstItem.categoryName || firstItem.text)) {
                                                console.log(`尝试使用moduleData字段 ${key} 作为分组数据:`, moduleData[key]);
                                                groups = moduleData[key];
                                                break;
                                            }
                                        }
                                    }
                                    if (groups.length > 0) break;
                                }
                            } else {
                                console.log('dataJson.mds.moduleData 不存在');
                            }
                        } else {
                            console.log('dataJson.mds 不存在');
                        }
                        
                        // 尝试其他可能的数据路径
                        if (dataJson.mds && dataJson.mds.data) {
                            console.log('尝试 mds.data 路径:', dataJson.mds.data);
                            const altData = dataJson.mds.data;
                            if (altData.groups && altData.groups.length > 0) {
                                groups = altData.groups;
                                console.log('从 mds.data.groups 找到分组数据:', groups);
                                break;
                            }
                        }
                        if (dataJson.data) {
                            console.log('尝试 data 路径:', dataJson.data);
                            const altData = dataJson.data;
                            if (altData.groups && altData.groups.length > 0) {
                                groups = altData.groups;
                                console.log('从 data.groups 找到分组数据:', groups);
                                break;
                            }
                        }
                        
                        // 尝试直接访问Python代码使用的路径
                        try {
                            if (dataJson.mds && dataJson.mds.moduleData && dataJson.mds.moduleData.data && dataJson.mds.moduleData.data.groups) {
                                groups = dataJson.mds.moduleData.data.groups;
                                console.log('从Python代码路径找到分组数据:', groups);
                                break;
                            }
                        } catch (e) {
                            console.log('Python代码路径访问失败:', e);
                        }
                    }
                } catch (e) {
                    console.error(`解析模块 ${i + 1} 失败:`, e);
                    continue;
                }
            }
            
                         if (groups.length === 0) {
                 console.log('所有找到的模块标题:', allModuleTitles);
                 
                 // 尝试从其他可能包含分组信息的模块中提取数据
                 console.log('尝试从其他模块中寻找分组信息...');
                 for (let i = 0; i < moduleDataMatches.length; i++) {
                     try {
                         const match = moduleDataMatches[i];
                         const moduleDataStr = match.match(/module-data=(["\'])(.*?)\1/)[2];
                         const decoded = decodeURIComponent(moduleDataStr);
                         const dataJson = JSON.parse(decoded);
                         const moduleTitle = findModuleTitle(dataJson);
                         
                         console.log(`检查模块 ${i + 1} (${moduleTitle}) 是否包含分组信息...`);
                         
                         // 尝试从各种可能的数据结构中寻找分组信息
                         if (dataJson.mds && dataJson.mds.moduleData && dataJson.mds.moduleData.data) {
                             const moduleData = dataJson.mds.moduleData.data;
                             console.log(`模块 ${i + 1} 数据结构:`, moduleData);
                             
                             // 检查是否有任何数组字段可能包含分组信息
                             for (const key in moduleData) {
                                 if (Array.isArray(moduleData[key]) && moduleData[key].length > 0) {
                                     const firstItem = moduleData[key][0];
                                     console.log(`检查字段 ${key}:`, moduleData[key]);
                                     if (firstItem && (firstItem.name || firstItem.title || firstItem.categoryName || firstItem.text || firstItem.groupName)) {
                                         console.log(`尝试使用字段 ${key} 作为分组数据:`, moduleData[key]);
                                         groups = moduleData[key];
                                         console.log(`从模块 ${i + 1} (${moduleTitle}) 的字段 ${key} 找到分组数据`);
                                         break;
                                     }
                                 }
                             }
                             if (groups.length > 0) break;
                         }
                         
                         // 尝试其他可能的数据路径
                         if (dataJson.data) {
                             const altData = dataJson.data;
                             for (const key in altData) {
                                 if (Array.isArray(altData[key]) && altData[key].length > 0) {
                                     const firstItem = altData[key][0];
                                     if (firstItem && (firstItem.name || firstItem.title || firstItem.categoryName || firstItem.text || firstItem.groupName)) {
                                         console.log(`从 data.${key} 找到分组数据:`, altData[key]);
                                         groups = altData[key];
                                         break;
                                     }
                                 }
                             }
                             if (groups.length > 0) break;
                         }
                         
                     } catch (e) {
                         console.error(`检查模块 ${i + 1} 失败:`, e);
                         continue;
                     }
                 }
                 
                 if (groups.length === 0) {
                     groupList.innerHTML = `
                         <p style="color: red;">未找到有效的分组数据</p>
                         <p>页面包含以下模块：</p>
                         <ul style="text-align: left; margin: 10px 0;">
                             ${allModuleTitles.map(title => `<li>${title}</li>`).join('')}
                         </ul>
                         <p>已尝试查找以下模块标题：</p>
                         <ul style="text-align: left; margin: 10px 0;">
                             <li>产品分组</li>
                             <li>分类商品</li>
                             <li>商品分类</li>
                             <li>产品分类</li>
                         </ul>
                         <p>可能的原因：</p>
                         <ul style="text-align: left; margin: 10px 0;">
                             <li>页面结构已更新</li>
                             <li>店铺类型不支持分组</li>
                             <li>数据加载不完整</li>
                             <li>分组数据存储在其他字段中</li>
                         </ul>
                         <p>建议：</p>
                         <ul style="text-align: left; margin: 10px 0;">
                             <li>刷新页面后重试</li>
                             <li>检查是否为阿里巴巴店铺页面</li>
                             <li>等待页面完全加载</li>
                             <li>查看控制台日志了解详细数据结构</li>
                         </ul>
                         <button class="retry-btn" onclick="location.reload()">刷新页面</button>
                         <button class="retry-btn" onclick="document.querySelector('.group-counter-modal').style.display='none';document.querySelector('.overlay').style.display='none';setTimeout(()=>{document.querySelector('.group-counter-btn').click()},1000)">重试分析</button>
                     `;
                     return;
                 }
             }
            
            // 递归生成所有分组序号和路径 - 参考Python代码的enumerate_groups调用
            const allEnums = enumerateGroups(groups);
            console.log('生成的分组枚举:', allEnums);
            
            // 显示分组列表
            let htmlContent = '';
            
            // 添加全店产品
            htmlContent += `
                <div class="group-item">
                    <span class="group-name">0. 全店所有产品</span>
                    <span class="group-count loading" id="count-all-store">
                        <span class="loading-spinner"></span>
                    </span>
                </div>
            `;
            
            // 添加橱窗产品
            htmlContent += `
                <div class="group-item">
                    <span class="group-name">0.1. 橱窗产品</span>
                    <span class="group-count loading" id="count-featured">
                        <span class="loading-spinner"></span>
                    </span>
                </div>
            `;
            
            // 添加分组 - 参考Python代码的显示逻辑
            for (const item of allEnums) {
                if (item.groupObj.url) {
                    htmlContent += `
                        <div class="group-item">
                            <span class="group-name">${item.number}. ${item.groupPath.join(' > ')}</span>
                            <span class="group-count loading" id="count-${item.number.replace(/\./g, '-')}">
                                <span class="loading-spinner"></span>
                            </span>
                        </div>
                    `;
                } else {
                    htmlContent += `
                        <div class="group-item">
                            <span class="group-name">${item.number}. ${item.groupPath.join(' > ')}</span>
                            <span class="group-count" style="background: #9E9E9B;">无产品</span>
                        </div>
                    `;
                }
            }
            
            groupList.innerHTML = htmlContent;
            
            // 异步获取产品数量
            await getProductCounts(baseUrl, allEnums, targetPcTitle);
            
        } catch (e) {
            console.error('分析分组失败:', e);
            groupList.innerHTML = `
                <p style="color: red;">分析失败: ${e.message}</p>
                <p>错误详情: ${e.stack}</p>
                <p>请检查控制台获取更多信息</p>
                <button class="retry-btn" onclick="location.reload()">刷新页面</button>
            `;
        }
    }

    // 检查其他数据源
    async function checkAlternativeDataSources(html, groupList, baseUrl) {
        try {
            // 检查是否有其他数据格式
            const possiblePatterns = [
                /window\.__INIT_DATA__\s*=\s*({.*?});/g,
                /window\.__INIT_STATE__\s*=\s*({.*?});/g,
                /window\.productData\s*=\s*({.*?});/g,
                /window\.detailData\s*=\s*({.*?});/g
            ];
            
            let foundData = false;
            for (const pattern of possiblePatterns) {
                const matches = html.match(pattern);
                if (matches && matches.length > 0) {
                    console.log('找到替代数据源:', pattern.source);
                    foundData = true;
                    break;
                }
            }
           
            
            if (!foundData) {
                // 检查页面是否包含产品相关元素
                const hasProducts = html.includes('product') || html.includes('产品') || html.includes('商品');
                const hasGroups = html.includes('group') || html.includes('分组') || html.includes('分类');
                
                groupList.innerHTML = `
                    <p style="color: red;">页面分析结果：</p>
                    <ul style="text-align: left; margin: 10px 0;">
                        <li>包含产品信息: ${hasProducts ? '是' : '否'}</li>
                        <li>包含分组信息: ${hasGroups ? '是' : '否'}</li>
                        <li>页面大小: ${html.length} 字符</li>
                    </ul>
                    <p>建议：</p>
                    <ul style="text-align: left; margin: 10px 0;">
                        <li>确认这是阿里巴巴店铺页面</li>
                        <li>尝试访问店铺主页</li>
                        <li>检查网络连接</li>
                    </ul>
                    <button class="retry-btn" onclick="location.reload()">刷新页面</button>
                    <button class="retry-btn" onclick="document.querySelector('.group-counter-modal').style.display='none';document.querySelector('.overlay').style.display='none';setTimeout(()=>{document.querySelector('.group-counter-btn').click()},1000)">重试分析</button>
                `;
            }
        } catch (e) {
            console.error('检查替代数据源失败:', e);
        }
    }

    // 获取所有分组的产品数量 - 参考Python代码的getProductCounts逻辑
    async function getProductCounts(baseUrl, allEnums, targetPcTitle) {
        try {
            const tasks = [];
            let seq = 0;
            tasks.push({ id: 'count-all-store', url: sanitizeListingUrl(baseUrl + '/productlist.html'), label: '全店所有产品', seq: seq++ });
            tasks.push({ id: 'count-featured', url: sanitizeListingUrl(baseUrl + '/featureproductlist-1.html'), label: '橱窗产品', seq: seq++ });

            for (const item of allEnums) {
                if (item.groupObj.url) {
                    tasks.push({ id: `count-${item.number.replace(/\./g, '-')}`, url: sanitizeListingUrl(baseUrl + item.groupObj.url), label: item.groupPath.join(' > '), seq: seq++ });
                }
            }

            await runTasksWithConcurrency(tasks, async (task) => {
                const cnt = await getImprovedProductCount(sanitizeListingUrl(task.url), targetPcTitle);
                updateCountDisplay(task.id, cnt);
                collectCountForExport(task, cnt);
            }, 8);
        } catch (e) {
            console.error('获取产品数量失败:', e);
        }
    }

    // 更新数量显示
    function updateCountDisplay(countId, count) {
        const countElement = document.getElementById(countId);
        if (!countElement) return;
        
        countElement.className = 'group-count';
        countElement.innerHTML = '';
        
        if (count === -1) {
            countElement.style.background = '#F44336';
            countElement.textContent = '错误';
        } else if (count === 0) {
            countElement.style.background = '#9E9E9B';
            countElement.textContent = '0';
        } else {
            countElement.style.background = '#4CAF50';
            countElement.textContent = count;
        }
    }

    // 导出计数相关
    const exportCounts = [];
    function collectCountForExport(task, count) {
        if (count === -1) return;
        const record = {
            label: task.label || task.id,
            parent: task.parent || '',
            url: sanitizeListingUrl(task.url),
            count: typeof count === 'number' ? count : 0,
            seq: typeof task.seq === 'number' ? task.seq : 999999
        };
        // 若已存在同 id/label 的记录则覆盖
        const idx = exportCounts.findIndex(r => r.label === record.label && r.url === record.url);
        if (idx >= 0) exportCounts[idx] = record; else exportCounts.push(record);
    }

    function exportCurrentCountsToCSV() {
        if (exportCounts.length === 0) {
            alert('暂无可导出的数据，请先统计完成。');
            return;
        }
        const rows = [['分组', '父分组', 'URL', '产品数量']];
        const ordered = [...exportCounts].sort((a,b) => a.seq - b.seq);
        ordered.forEach(item => rows.push([item.label, item.parent, item.url, String(item.count)]));
        const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        const host = location.host.replace(/[:\\/]/g, '_');
        a.download = `${host}.csv`;
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            URL.revokeObjectURL(a.href);
            a.remove();
        }, 100);
    }

    // 等待页面加载完成后创建按钮
    function init() {
        console.log('脚本初始化开始，页面状态:', document.readyState);
        
        if (document.readyState === 'loading') {
            console.log('页面正在加载，等待DOMContentLoaded事件');
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOMContentLoaded事件触发，开始创建按钮');
                setTimeout(createButtonWithRetry, 1000); // 延迟1秒确保页面完全渲染
            });
        } else {
            console.log('页面已加载完成，立即创建按钮');
            setTimeout(createButtonWithRetry, 1000); // 延迟1秒确保页面完全渲染
        }
        
        // 额外监听load事件，确保所有资源加载完成
        window.addEventListener('load', () => {
            console.log('页面所有资源加载完成，检查按钮状态');
            if (!document.querySelector('.group-counter-btn')) {
                console.log('按钮未找到，重新尝试创建');
                setTimeout(createButtonWithRetry, 500);
            }
        });
    }
    
    // 带重试的按钮创建函数
    function createButtonWithRetry() {
        let retryCount = 0;
        const maxRetries = 15;
        
        function tryCreateButton() {
            console.log(`尝试创建按钮，第 ${retryCount + 1} 次...`);
            
            // 方法1: 查找目标容器 - 精确匹配
            const targetDiv = document.querySelector('.title[data-spm-anchor-id="a2700.shop_pl.41413.i16.36887121iAROdA"]');
            if (targetDiv) {
                console.log('找到精确匹配的目标容器:', targetDiv);
                createButtonAtTarget(targetDiv);
                return;
            }
            
            // 方法2: 查找包含特定文本的标题元素
            const titleElements = document.querySelectorAll('[class*="title"], .title, h1, h2, h3, [class*="header"]');
            let found = false;
            
            for (const element of titleElements) {
                const text = element.textContent.trim();
                if (text && (
                    text.includes('All products') || 
                    text.includes('产品分类') ||
                    text.includes('Product categories') ||
                    text.includes('产品列表') ||
                    text.includes('商品分类') ||
                    text.includes('店铺产品') ||
                    text.includes('Store Products')
                )) {
                    console.log('找到包含目标文本的容器:', element, '文本:', text);
                    createButtonAtTarget(element);
                    found = true;
                    break;
                }
            }
            
            if (found) return;
            
            // 方法3: 查找页面中的主要导航或分类区域
            const possibleContainers = [
                '.category-list',
                '.product-category',
                '.sidebar',
                '.left-sidebar',
                '[class*="category"]',
                '[class*="分类"]',
                '.main-content',
                '.content-area'
            ];
            
            for (const selector of possibleContainers) {
                const container = document.querySelector(selector);
                if (container) {
                    console.log(`找到可能的容器: ${selector}`, container);
                    // 在容器内查找合适的标题元素
                    const titleInContainer = container.querySelector('h1, h2, h3, [class*="title"], .title');
                    if (titleInContainer) {
                        console.log('在容器内找到标题元素:', titleInContainer);
                        createButtonAtTarget(titleInContainer);
                        found = true;
                        break;
                    }
                }
            }
            
            if (found) return;
            
            // 方法4: 查找页面中任何包含"产品"或"商品"的元素
            const allElements = document.querySelectorAll('*');
            for (const element of allElements) {
                if (element.children.length === 0 && element.textContent) {
                    const text = element.textContent.trim();
                    if (text && (
                        text.includes('产品分类') ||
                        text.includes('商品分类') ||
                        text.includes('产品列表') ||
                        text.includes('商品列表')
                    )) {
                        const parent = element.parentElement;
                        if (parent && parent.tagName !== 'SCRIPT' && parent.tagName !== 'STYLE') {
                            console.log('找到包含产品相关文本的元素:', element, '文本:', text);
                            createButtonAtTarget(parent);
                            found = true;
                            break;
                        }
                    }
                }
            }
            
            if (found) return;
            
            // 如果还没找到，重试或使用默认位置
            if (retryCount < maxRetries) {
                retryCount++;
                console.log(`未找到目标容器，${retryCount}/${maxRetries} 次重试...`);
                setTimeout(tryCreateButton, 1000); // 1秒后重试
            } else {
                console.log('达到最大重试次数，使用默认位置');
                createButtonAtDefault();
            }
        }
        
        tryCreateButton();
    }
    
    // 在目标位置创建按钮
    function createButtonAtTarget(targetElement) {
        // 检查是否已经存在按钮
        if (targetElement.querySelector('.group-counter-btn')) {
            console.log('按钮已存在，跳过创建');
            return;
        }
        
        try {
            // 创建span标签
            const span = document.createElement('span');
            span.style.cssText = `
                display: inline-block;
                margin-left: 10px;
                vertical-align: middle;
            `;
            
            // 创建按钮
            const btn = document.createElement('button');
            btn.className = 'group-counter-btn';
            btn.textContent = '统计分组产品数';
            btn.onclick = showGroupCounter;
            
            // 调整按钮样式，使其适合内联显示
            btn.style.cssText = `
                position: static;
                top: auto;
                right: auto;
                z-index: auto;
                background: #ff6b35;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                box-shadow: none;
                margin: 0;
                display: inline-block;
                vertical-align: middle;
            `;
            
            // 将按钮添加到span中
            span.appendChild(btn);
            
            // 尝试将span添加到目标元素
            if (targetElement.appendChild) {
                targetElement.appendChild(span);
                console.log('按钮已成功添加到目标容器右侧:', targetElement);
                return true;
            } else {
                console.log('目标元素不支持appendChild，尝试其他方法');
                // 尝试插入到目标元素之后
                if (targetElement.parentElement && targetElement.parentElement.insertBefore) {
                    targetElement.parentElement.insertBefore(span, targetElement.nextSibling);
                    console.log('按钮已插入到目标元素之后');
                    return true;
                }
            }
            
            console.log('无法将按钮添加到目标元素，使用默认位置');
            createButtonAtDefault();
            return false;
            
        } catch (e) {
            console.error('在目标位置创建按钮失败:', e);
            console.log('使用默认位置创建按钮');
            createButtonAtDefault();
            return false;
        }
    }
    
    // 在默认位置创建按钮
    function createButtonAtDefault() {
        const btn = document.createElement('button');
        btn.className = 'group-counter-btn';
        btn.textContent = '统计分组产品数';
        btn.onclick = showGroupCounter;
        document.body.appendChild(btn);
        console.log('按钮已添加到默认位置');
    }

    // 启动脚本
    init();
    
    // 调试按钮查找问题
    function debugButtonPlacement() {}
    
    // 调试页面结构函数
    function debugPageStructure() {}
    
    // 调试产品数量获取问题
    async function debugProductCount() {}
    
    // 改进的产品数量获取函数
    // 改进的产品数量获取函数 - 智能检测可用模块，增加重试和调试
    async function getImprovedProductCount(groupUrl, targetPcTitle) {
        const maxRetries = 3;
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
            try {
                // 确保URL被正确清理，移除所有查询参数
                const cleanUrl = sanitizeListingUrl(groupUrl);
                console.log(`正在获取分组产品数量 (第${retryCount + 1}次尝试): ${cleanUrl}`);
                console.log(`原始URL: ${groupUrl}`);
                
                // 添加随机延迟 - 严格按照Python代码的延迟时间 (0.5-1.3秒)
                const delay = Math.random() * 800 + 500;
                console.log(`等待延迟: ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
                
                // 使用更完整的请求头，模拟真实浏览器
                const response = await fetch(cleanUrl, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Connection': 'keep-alive',
                        'Upgrade-Insecure-Requests': '1',
                        'Sec-Fetch-Dest': 'document',
                        'Sec-Fetch-Mode': 'navigate',
                        'Sec-Fetch-Site': 'same-origin',
                        'Cache-Control': 'max-age=0'
                    },
                    mode: 'same-origin',
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    console.error(`HTTP错误: ${response.status} ${response.statusText} - ${cleanUrl}`);
                    if (response.status === 404) {
                        console.log('页面不存在，返回0');
                        return 0;
                    }
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const html = await response.text();
                console.log(`页面大小: ${html.length} 字符`);
                
                if (html.length < 1000) {
                    console.warn('页面内容过短，可能加载失败');
                    console.log('页面内容预览:', html.substring(0, 500));
                }
                
                // 查找module-data - 使用更精确的正则表达式
                const matches = html.match(/module-data=(["\'])(.*?)\1/g);
                if (!matches || matches.length === 0) {
                    console.log(`页面 ${cleanUrl} 未找到module-data`);
                    console.log('页面内容预览:', html.substring(0, 1000));
                    return 0;
                }
                
                console.log(`页面 ${cleanUrl} 找到 ${matches.length} 个module-data`);
                
                // 首先尝试查找目标模块（如果指定了的话）
                if (targetPcTitle) {
                    console.log(`尝试查找目标模块: ${targetPcTitle}`);
                    for (let i = 0; i < matches.length; i++) {
                        try {
                            const moduleDataStr = matches[i].match(/module-data=(["\'])(.*?)\1/)[2];
                            const decoded = decodeURIComponent(moduleDataStr);
                            const dataJson = JSON.parse(decoded);
                            const moduleTitle = findModuleTitle(dataJson);
                            
                            console.log(`模块 ${i + 1} 标题: ${moduleTitle}`);
                            
                            if (moduleTitle === targetPcTitle) {
                                console.log(`找到目标模块 ${targetPcTitle}`);
                                const count = extractProductCountFromModule(dataJson);
                                if (count > 0) {
                                    console.log(`从目标模块获取到产品数量: ${count}`);
                                    return count;
                                }
                            }
                        } catch (e) {
                            console.error(`解析模块 ${i + 1} 失败:`, e);
                            continue;
                        }
                    }
                    console.log(`未找到目标模块 ${targetPcTitle} 或产品数量为0`);
                }
                
                // 智能检测：查找任何可能包含产品数量的模块
                console.log('开始智能检测包含产品数量的模块...');
                const allModules = [];
                
                for (let i = 0; i < matches.length; i++) {
                    try {
                        const moduleDataStr = matches[i].match(/module-data=(["\'])(.*?)\1/)[2];
                        const decoded = decodeURIComponent(moduleDataStr);
                        const dataJson = JSON.parse(decoded);
                        const moduleTitle = findModuleTitle(dataJson);
                        
                        allModules.push({
                            index: i + 1,
                            title: moduleTitle || `未知模块${i + 1}`,
                            data: dataJson
                        });
                        
                        // 检查这个模块是否包含产品数量
                        const count = extractProductCountFromModule(dataJson);
                        if (count > 0) {
                            console.log(`在模块 ${i + 1} (${moduleTitle || '未知标题'}) 中找到产品数量: ${count}`);
                            return count;
                        }
                    } catch (e) {
                        console.error(`解析模块 ${i + 1} 失败:`, e);
                        continue;
                    }
                }
                
                // 如果还是没有找到，记录所有模块信息用于调试
                console.log('所有模块信息:', allModules.map(m => `${m.index}: ${m.title}`));
                console.log(`页面 ${cleanUrl} 未找到任何包含产品数量的模块`);
                
                return 0;
                
            } catch (e) {
                retryCount++;
                console.error(`获取分组产品数量失败 (第${retryCount}次): ${cleanUrl} - ${e}`);
                console.log('错误详情:', e.stack);
                
                if (retryCount >= maxRetries) {
                    console.error(`达到最大重试次数，返回错误状态`);
                    return -1;
                }
                
                // 等待后重试
                const retryDelay = Math.random() * 1000 + 1000; // 1-2秒
                console.log(`等待 ${retryDelay}ms 后重试...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
        
        return -1;
    }
    
    // 从模块数据中提取产品数量的辅助函数
    function extractProductCountFromModule(dataJson) {
        try {
            let totalLines = 0;
            
            // 严格按照Python代码的逻辑获取产品数量
            if (dataJson.mds && dataJson.mds.moduleData && dataJson.mds.moduleData.data) {
                const data = dataJson.mds.moduleData.data;
                console.log(`模块数据结构:`, data);
                console.log(`可用字段:`, Object.keys(data));
                
                // 严格按照Python代码的逻辑获取产品数量
                if (data.pageNavView && data.pageNavView.totalLines) {
                    totalLines = data.pageNavView.totalLines;
                    console.log(`从 pageNavView.totalLines 获取到数量: ${totalLines}`);
                } else if (data.totalLines) {
                    totalLines = data.totalLines;
                    console.log(`从 totalLines 获取到数量: ${totalLines}`);
                } else if (data.total) {
                    totalLines = data.total;
                    console.log(`从 total 获取到数量: ${totalLines}`);
                } else {
                    console.log(`未找到产品数量字段，详细数据结构:`, data);
                    
                    // 尝试查找其他可能包含数量的字段
                    for (const key in data) {
                        const value = data[key];
                        if (typeof value === 'number' && value > 0 && value < 100000) {
                            console.log(`发现可能的数量字段 ${key}: ${value}`);
                            // 如果找到看起来像产品数量的字段，使用它
                            if (key.toLowerCase().includes('total') || key.toLowerCase().includes('count') || key.toLowerCase().includes('line')) {
                                totalLines = value;
                                console.log(`使用可能的数量字段 ${key}: ${value}`);
                                break;
                            }
                        }
                    }
                }
            } else {
                console.log('未找到 mds.moduleData.data 路径');
                console.log('dataJson.mds:', dataJson.mds);
                if (dataJson.mds) {
                    console.log('dataJson.mds.moduleData:', dataJson.mds.moduleData);
                }
                
                // 尝试直接从根级别查找
                if (dataJson.totalLines) {
                    totalLines = dataJson.totalLines;
                    console.log(`从根级别 totalLines 获取到数量: ${totalLines}`);
                } else if (dataJson.total) {
                    totalLines = dataJson.total;
                    console.log(`从根级别 total 获取到数量: ${totalLines}`);
                } else if (dataJson.count) {
                    totalLines = dataJson.count;
                    console.log(`从根级别 count 获取到数量: ${totalLines}`);
                } else if (dataJson.productCount) {
                    totalLines = dataJson.productCount;
                    console.log(`从根级别 productCount 获取到数量: ${totalLines}`);
                } else if (dataJson.productNum) {
                    totalLines = dataJson.productNum;
                    console.log(`从根级别 productNum 获取到数量: ${totalLines}`);
                }
                
                // 尝试从其他可能的结构中查找
                if (totalLines === 0 && dataJson.data && typeof dataJson.data === 'object') {
                    const data = dataJson.data;
                    if (data.totalLines) {
                        totalLines = data.totalLines;
                        console.log(`从 data.totalLines 获取到数量: ${totalLines}`);
                    } else if (data.total) {
                        totalLines = data.total;
                        console.log(`从 data.total 获取到数量: ${totalLines}`);
                    } else if (data.count) {
                        totalLines = data.count;
                        console.log(`从 data.count 获取到数量: ${totalLines}`);
                    } else if (data.productCount) {
                        totalLines = data.productCount;
                        console.log(`从 data.productCount 获取到数量: ${totalLines}`);
                    }
                }
            }
            
            return totalLines;
        } catch (e) {
            console.error('提取产品数量时出错:', e);
            console.log('错误详情:', e.stack);
            return 0;
        }
    }
    
    // 增强的产品数量调试函数 - 深入分析页面结构和module-data
    async function enhancedDebugProductCount() {
        console.log('=== 开始增强调试产品数量获取问题 ===');
        
        const groupList = document.getElementById('group-list');
        if (groupList) {
            groupList.innerHTML = '<p>正在深入调试产品数量获取...</p>';
        }
        
        try {
            // 获取当前页面URL
            const currentUrl = window.location.href;
            let baseUrl = currentUrl;
            if (baseUrl.includes('/productlist.html')) {
                baseUrl = baseUrl.replace('/productlist.html', '');
            } else if (baseUrl.includes('/featureproductlist-')) {
                baseUrl = baseUrl.replace(/\/featureproductlist-\d+\.html/, '');
            } else if (baseUrl.includes('/productgrouplist-')) {
                baseUrl = baseUrl.replace(/\/productgrouplist-\d+.*/, '');
            }
            
            console.log('店铺基础URL:', baseUrl);
            
            // 测试全店产品数量获取
            console.log('测试全店产品数量获取...');
            const allStoreUrl = baseUrl + '/productlist.html';
            console.log('测试URL:', allStoreUrl);
            
            // 首先分析页面结构
            const pageAnalysis = await analyzePageStructure(allStoreUrl);
            console.log('页面结构分析结果:', pageAnalysis);
            
            // 测试产品数量获取
            const allStoreCount = await getImprovedProductCount(allStoreUrl, "PC产品列表");
            console.log('全店产品数量结果:', allStoreCount);
            
            // 显示调试结果
            if (groupList) {
                let debugHtml = '<div class="debug-info">';
                debugHtml += '<h4>增强调试结果</h4>';
                debugHtml += `<p>店铺基础URL: ${baseUrl}</p>`;
                debugHtml += `<p>全店产品URL: ${allStoreUrl}</p>`;
                debugHtml += `<p>全店产品数量: ${allStoreCount === -1 ? '获取失败' : allStoreCount}</p>`;
                debugHtml += '<h5>页面结构分析:</h5>';
                debugHtml += `<p>找到的模块数量: ${pageAnalysis.moduleCount}</p>`;
                debugHtml += `<p>模块标题列表: ${pageAnalysis.moduleTitles.join(', ')}</p>`;
                debugHtml += `<p>包含产品数量的模块: ${pageAnalysis.productCountModules.join(', ')}</p>`;
                debugHtml += '<h5>详细分析:</h5>';
                debugHtml += `<pre style="max-height: 200px; overflow-y: auto; background: #f5f5f5; padding: 10px; font-size: 12px;">${JSON.stringify(pageAnalysis.detailedInfo, null, 2)}</pre>`;
                debugHtml += '<button class="retry-btn" onclick="enhancedDebugProductCount()">重新调试</button>';
                debugHtml += '<button class="retry-btn" onclick="analyzeGroups()">开始分析分组</button>';
                debugHtml += '</div>';
                
                groupList.innerHTML = debugHtml;
            }
            
        } catch (e) {
            console.error('增强调试失败:', e);
            if (groupList) {
                groupList.innerHTML = `<p style="color: red;">增强调试失败: ${e.message}</p>`;
            }
        }
        
        console.log('=== 增强调试完成 ===');
    }
    
    // 分析页面结构的函数
    async function analyzePageStructure(url) {
        try {
            console.log(`分析页面结构: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'same-origin',
                    'Cache-Control': 'max-age=0'
                },
                mode: 'same-origin',
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const html = await response.text();
            console.log(`页面大小: ${html.length} 字符`);
            
            // 查找所有module-data
            const matches = html.match(/module-data=(["\'])(.*?)\1/g);
            if (!matches || matches.length === 0) {
                return {
                    moduleCount: 0,
                    moduleTitles: [],
                    productCountModules: [],
                    detailedInfo: { error: '未找到module-data' }
                };
            }
            
            console.log(`找到 ${matches.length} 个module-data`);
            
            const moduleTitles = [];
            const productCountModules = [];
            const detailedInfo = {};
            
            // 分析每个模块
            for (let i = 0; i < matches.length; i++) {
                try {
                    const moduleDataStr = matches[i].match(/module-data=(["\'])(.*?)\1/)[2];
                    const decoded = decodeURIComponent(moduleDataStr);
                    const dataJson = JSON.parse(decoded);
                    const moduleTitle = findModuleTitle(dataJson);
                    
                    if (moduleTitle) {
                        moduleTitles.push(moduleTitle);
                        detailedInfo[`模块${i + 1}_${moduleTitle}`] = {
                            title: moduleTitle,
                            structure: analyzeDataStructure(dataJson),
                            hasProductCount: checkForProductCount(dataJson)
                        };
                        
                        if (checkForProductCount(dataJson)) {
                            productCountModules.push(moduleTitle);
                        }
                    }
                } catch (e) {
                    console.error(`解析模块 ${i + 1} 失败:`, e);
                    detailedInfo[`模块${i + 1}_解析失败`] = { error: e.message };
                }
            }
            
            return {
                moduleCount: matches.length,
                moduleTitles: moduleTitles,
                productCountModules: productCountModules,
                detailedInfo: detailedInfo
            };
            
        } catch (e) {
            console.error('分析页面结构失败:', e);
            return {
                moduleCount: 0,
                moduleTitles: [],
                productCountModules: [],
                detailedInfo: { error: e.message }
            };
        }
    }
    
    // 分析数据结构
    function analyzeDataStructure(obj, maxDepth = 3, currentDepth = 0) {
        if (currentDepth >= maxDepth) {
            return '达到最大深度';
        }
        
        if (typeof obj === 'object' && obj !== null) {
            const result = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key];
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        result[key] = analyzeDataStructure(value, maxDepth, currentDepth + 1);
                    } else if (Array.isArray(value)) {
                        result[key] = `数组[${value.length}]`;
                    } else {
                        result[key] = typeof value;
                    }
                }
            }
            return result;
        }
        
        return typeof obj;
    }
    
    // 检查是否包含产品数量信息 - 增强版本
    function checkForProductCount(obj) {
        if (typeof obj === 'object' && obj !== null) {
            // 检查常见的产品数量字段
            if (obj.totalLines || obj.total || obj.count) {
                return true;
            }
            
            // 检查嵌套结构
            if (obj.mds && obj.mds.moduleData && obj.mds.moduleData.data) {
                const data = obj.mds.moduleData.data;
                if (data.pageNavView && data.pageNavView.totalLines) {
                    return true;
                }
                if (data.totalLines || data.total || data.count) {
                    return true;
                }
                
                // 检查更多可能的产品数量字段
                if (data.productCount || data.productNum || data.itemCount || data.itemNum) {
                    return true;
                }
                
                // 检查产品列表长度
                if (data.productList && Array.isArray(data.productList) && data.productList.length > 0) {
                    return true;
                }
                if (data.products && Array.isArray(data.products) && data.products.length > 0) {
                    return true;
                }
            }
            
            // 检查其他可能的结构
            if (obj.data && typeof obj.data === 'object') {
                const data = obj.data;
                if (data.totalLines || data.total || data.count || data.productCount) {
                    return true;
                }
                if (data.productList && Array.isArray(data.productList) && data.productList.length > 0) {
                    return true;
                }
            }
            
            // 递归检查
            for (const key in obj) {
                if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
                    if (checkForProductCount(obj[key])) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    // 仅暴露必要函数
    window.analyzeGroups = analyzeGroups;

    // 增强的产品数量调试函数 - 深入分析页面结构和module-data
    async function enhancedDebugProductCount() {
        console.log('=== 开始增强调试产品数量获取问题 ===');
        
        const groupList = document.getElementById('group-list');
        if (groupList) {
            groupList.innerHTML = '<p>正在深入调试产品数量获取...</p>';
        }
        
        try {
            // 获取当前页面URL
            const currentUrl = window.location.href;
            let baseUrl = currentUrl;
            if (baseUrl.includes('/productlist.html')) {
                baseUrl = baseUrl.replace('/productlist.html', '');
            } else if (baseUrl.includes('/featureproductlist-')) {
                baseUrl = baseUrl.replace(/\/featureproductlist-\d+\.html/, '');
            } else if (baseUrl.includes('/productgrouplist-')) {
                baseUrl = baseUrl.replace(/\/productgrouplist-\d+.*/, '');
            }
            
            console.log('店铺基础URL:', baseUrl);
            
            // 测试全店产品数量获取
            console.log('测试全店产品数量获取...');
            const allStoreUrl = baseUrl + '/productlist.html';
            console.log('测试URL:', allStoreUrl);
            
            // 首先分析页面结构
            const pageAnalysis = await analyzePageStructure(allStoreUrl);
            console.log('页面结构分析结果:', pageAnalysis);
            
            // 测试产品数量获取
            const allStoreCount = await getImprovedProductCount(allStoreUrl, "PC产品列表");
            console.log('全店产品数量结果:', allStoreCount);
            
            // 显示调试结果
            if (groupList) {
                let debugHtml = '<div class="debug-info">';
                debugHtml += '<h4>增强调试结果</h4>';
                debugHtml += `<p>店铺基础URL: ${baseUrl}</p>`;
                debugHtml += `<p>全店产品URL: ${allStoreUrl}</p>`;
                debugHtml += `<p>全店产品数量: ${allStoreCount === -1 ? '获取失败' : allStoreCount}</p>`;
                debugHtml += '<h5>页面结构分析:</h5>';
                debugHtml += `<p>找到的模块数量: ${pageAnalysis.moduleCount}</p>`;
                debugHtml += `<p>模块标题列表: ${pageAnalysis.moduleTitles.join(', ')}</p>`;
                debugHtml += `<p>包含产品数量的模块: ${pageAnalysis.productCountModules.join(', ')}</p>`;
                debugHtml += '<h5>详细分析:</h5>';
                debugHtml += `<pre style="max-height: 200px; overflow-y: auto; background: #f5f5f5; padding: 10px; font-size: 12px;">${JSON.stringify(pageAnalysis.detailedInfo, null, 2)}</pre>`;
                debugHtml += '<button class="retry-btn" onclick="enhancedDebugProductCount()">重新调试</button>';
                debugHtml += '<button class="retry-btn" onclick="analyzeGroups()">开始分析分组</button>';
                debugHtml += '</div>';
                
                groupList.innerHTML = debugHtml;
            }
            
        } catch (e) {
            console.error('增强调试失败:', e);
            if (groupList) {
                groupList.innerHTML = `<p style="color: red;">增强调试失败: ${e.message}</p>`;
            }
        }
        
        console.log('=== 增强调试完成 ===');
    }
    
    // 分析页面结构的函数
    async function analyzePageStructure(url) {
        try {
            console.log(`分析页面结构: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'same-origin',
                    'Cache-Control': 'max-age=0'
                },
                mode: 'same-origin',
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const html = await response.text();
            console.log(`页面大小: ${html.length} 字符`);
            
            // 查找所有module-data
            const matches = html.match(/module-data=(["\'])(.*?)\1/g);
            if (!matches || matches.length === 0) {
                return {
                    moduleCount: 0,
                    moduleTitles: [],
                    productCountModules: [],
                    detailedInfo: { error: '未找到module-data' }
                };
            }
            
            console.log(`找到 ${matches.length} 个module-data`);
            
            const moduleTitles = [];
            const productCountModules = [];
            const detailedInfo = {};
            
            // 分析每个模块
            for (let i = 0; i < matches.length; i++) {
                try {
                    const moduleDataStr = matches[i].match(/module-data=(["\'])(.*?)\1/)[2];
                    const decoded = decodeURIComponent(moduleDataStr);
                    const dataJson = JSON.parse(decoded);
                    const moduleTitle = findModuleTitle(dataJson);
                    
                    if (moduleTitle) {
                        moduleTitles.push(moduleTitle);
                        detailedInfo[`模块${i + 1}_${moduleTitle}`] = {
                            title: moduleTitle,
                            structure: analyzeDataStructure(dataJson),
                            hasProductCount: checkForProductCount(dataJson)
                        };
                        
                        if (checkForProductCount(dataJson)) {
                            productCountModules.push(moduleTitle);
                        }
                    }
                } catch (e) {
                    console.error(`解析模块 ${i + 1} 失败:`, e);
                    detailedInfo[`模块${i + 1}_解析失败`] = { error: e.message };
                }
            }
            
            return {
                moduleCount: matches.length,
                moduleTitles: moduleTitles,
                productCountModules: productCountModules,
                detailedInfo: detailedInfo
            };
            
        } catch (e) {
            console.error('分析页面结构失败:', e);
            return {
                moduleCount: 0,
                moduleTitles: [],
                productCountModules: [],
                detailedInfo: { error: e.message }
            };
        }
    }
    
    // 分析数据结构
    function analyzeDataStructure(obj, maxDepth = 3, currentDepth = 0) {
        if (currentDepth >= maxDepth) {
            return '达到最大深度';
        }
        
        if (typeof obj === 'object' && obj !== null) {
            const result = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key];
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        result[key] = analyzeDataStructure(value, maxDepth, currentDepth + 1);
                    } else if (Array.isArray(value)) {
                        result[key] = `数组[${value.length}]`;
                    } else {
                        result[key] = typeof value;
                    }
                }
            }
            return result;
        }
        
        return typeof obj;
    }
    
})();