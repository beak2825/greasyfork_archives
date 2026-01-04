// ==UserScript==
// @name         CSDN 专栏优化脚本 📚
// @description  通过在 CSDN 专栏页面添加一个侧边栏菜单，列出当前专栏的所有文章，提升阅读体验 🌟
// @version      1.4.2
// @author       Silence
// @match        *://blog.csdn.net/*/article/*
// @match        *://*.blog.csdn.net/article/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1394594
// @downloadURL https://update.greasyfork.org/scripts/517074/CSDN%20%E4%B8%93%E6%A0%8F%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC%20%F0%9F%93%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/517074/CSDN%20%E4%B8%93%E6%A0%8F%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC%20%F0%9F%93%9A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        cleanParams: GM_getValue('cleanParams', true)
    };

    // 在脚本开始时立即执行清理
    cleanAnalyticsParams();

    // 监听URL变化,处理动态加载的情况
    window.addEventListener('popstate', cleanAnalyticsParams);
    window.addEventListener('pushState', cleanAnalyticsParams);
    window.addEventListener('replaceState', cleanAnalyticsParams);

    const $ = (Selector, el) => (el || document).querySelector(Selector);
    const $$ = (Selector, el) => (el || document).querySelectorAll(Selector);

    window.onload = function () {
        console.log('CSDN 专栏优化脚本开始加载');
        initSidebar();
    };

    // 添加缓存相关的常量
    const CACHE_KEY_PREFIX = 'csdn_column_';
    const CACHE_EXPIRE_TIME = 24 * 60 * 60 * 1000; // 24小时过期

    // 缓存操作工具函数
    const CacheUtil = {
        /**
         * 获取缓存数据
         * @param {string} key - 缓存键名
         * @returns {any|null} - 缓存数据或null
         */
        get(key) {
            const data = localStorage.getItem(CACHE_KEY_PREFIX + key);
            if (!data) return null;
            
            try {
                const { value, timestamp } = JSON.parse(data);
                // 检查是否过期
                if (Date.now() - timestamp > CACHE_EXPIRE_TIME) {
                    this.remove(key);
                    return null;
                }
                return value;
            } catch (e) {
                return null;
            }
        },

        /**
         * 设置缓存数据
         * @param {string} key - 缓存键名
         * @param {any} value - 缓存数据
         */
        set(key, value) {
            const data = {
                value,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(data));
        },

        /**
         * 删除缓存数据
         * @param {string} key - 缓存键名
         */
        remove(key) {
            localStorage.removeItem(CACHE_KEY_PREFIX + key);
        }
    };

    /**
     * 获取专栏文章列表（带缓存和懒加载）
     * @param {string} columnId - 专栏ID
     * @param {string} blogUsername - 博客用户名
     * @param {number} articleCount - 文章总数
     * @returns {Promise<Array>} - 文章列表
     */
    async function getColumnArticles(columnId, blogUsername, articleCount) {
        // 尝试从缓存获取
        const cacheKey = `${columnId}_${blogUsername}`;
        const cachedData = CacheUtil.get(cacheKey);
        if (cachedData) {
            console.log('从缓存获取专栏文章');
            // 确保缓存的数据也是排序的
            return sortArticles(cachedData);
        }
    
        const pageSize = 100; // 每页最大100条
        const totalPages = Math.ceil(articleCount / pageSize);
        let allArticles = [];
        
        try {
            // 懒加载：先只加载第一页
            const firstPageData = await fetchArticlePage(columnId, blogUsername, 1, pageSize);
            allArticles = firstPageData;
    
            // 如果有更多页，异步加载其余页面
            if (totalPages > 1) {
                loadRemainingPages(columnId, blogUsername, totalPages, pageSize).then(articles => {
                    allArticles = allArticles.concat(articles);
                    // 排序后再缓存
                    const sortedArticles = sortArticles(allArticles);
                    CacheUtil.set(cacheKey, sortedArticles);
                    // 触发更新UI
                    updateArticleList(sortedArticles);
                });
            } else {
                // 只有一页时直接排序并缓存
                const sortedArticles = sortArticles(allArticles);
                CacheUtil.set(cacheKey, sortedArticles);
                allArticles = sortedArticles;
            }
            
        } catch (error) {
            console.error('获取专栏文章失败:', error);
        }
    
        // 返回排序后的结果
        return sortArticles(allArticles);
    }
    
    /**
     * 按文章ID排序
     * @param {Array} articles - 文章列表
     * @returns {Array} - 排序后的文章列表
     */
    function sortArticles(articles) {
        return articles.sort((a, b) => {
            const aId = parseInt(a.url.split('/').pop());
            const bId = parseInt(b.url.split('/').pop());
            return aId - bId;
        });
    }

    /**
     * 获取单页文章数据
     * @param {string} columnId 专栏ID
     * @param {string} blogUsername 博客用户名
     * @param {number} page 页码
     * @param {number} pageSize 每页文章数量
     * @return {Promise<Array<{url: string, title: string}>>} 文章列表
     */
    async function fetchArticlePage(columnId, blogUsername, page, pageSize) {
        try {
            const response = await fetch(
                `https://blog.csdn.net/phoenix/web/v1/column/article/list?columnId=${columnId}&blogUsername=${blogUsername}&page=${page}&pageSize=${pageSize}`
            );
            const data = await response.json();
            
            if (data.code === 200) {
                return data.data.map(article => ({
                    url: article.url,
                    title: article.title
                }));
            }
            throw new Error(`获取专栏文章失败: ${data.message}`);
        } catch (error) {
            console.error(`获取第${page}页文章失败:`, error);
            return [];
        }
    }

    /**
     * 异步加载剩余页面
     * @param {string} columnId 专栏ID
     * @param {string} blogUsername 博客用户名
     * @param {number} totalPages 总页数
     * @param {number} pageSize 每页文章数量
     * @return {Promise<Array<{url: string, title: string}>>} 文章列表
     */
    async function loadRemainingPages(columnId, blogUsername, totalPages, pageSize) {
        const remainingPages = Array.from(
            { length: totalPages - 1 }, 
            (_, i) => fetchArticlePage(columnId, blogUsername, i + 2, pageSize)
        );
        
        try {
            const results = await Promise.all(remainingPages);
            return results.flat();
        } catch (error) {
            console.error('加载剩余页面失败:', error);
            return [];
        }
    }

    /**
     * 更新文章列表UI
     * @param {Object} articles 文章信息
     */
    function updateArticleList(articles) {
        const menu = document.querySelector('.column-menu');
        if (!menu) return;
        
        const currentColumnIndex = menu.querySelector('.column-selector').value;
        showColumnArticles({ 
            columnTitle: menu.querySelector('option:checked').textContent, 
            articles 
        }, menu);
    }

    /**
     * 获取专栏信息
     * @returns {Promise<{blogUsername: string, columnId: string}>} 专栏信息
     */
    function getColumnInfo() {
        const columnInfoListDom = $$('#blogColumnPayAdvert .column-group-item');
        const promises = Array.from(columnInfoListDom).map(async element => {
            const columnUrl = element.querySelector('.item-target').href;
            const columnTitle = element.querySelector('.item-target').title;
            const columnInfo = element.querySelector('.item-m').querySelectorAll('span');
            let articleCount = 0;
            columnInfo.forEach(info => {
                if (info.innerText.includes('篇文章')) {
                    articleCount = info.innerText.replace(' 篇文章', '');
                }
            })
            console.log('文章数量: ', articleCount);
            // 从columnUrl获取blogUserName和columnId
            const urlInfo = parseColumnUrl(columnUrl);
            if (!urlInfo) {
                console.error('无法解析专栏 URL:', columnUrl);
                return null;
            }

            const { blogUsername, columnId } = urlInfo;
            console.log('解析结果:', { blogUsername, columnId });
            
            // 访问专栏地址，获取专栏所有文章列表
            try {
                const articles = await getColumnArticles(columnId, blogUsername, articleCount);

                return { columnTitle, articles };
            } catch (error) {
                console.error('Error fetching column articles:', error);
                return null;
            }
        });
    
        return Promise.all(promises).then(results => {
            return results.filter(column => column !== null);  // 过滤掉null值
        });
    }

    /**
     * 解析专栏 URL 获取用户名和专栏 ID
     * @param {string} url 专栏地址
     * @returns {Promise<{blogUsername: string, columnId: string}>} 专栏信息
     */
    function parseColumnUrl(url) {
        // 使用正则表达式匹配 URL 中的用户名和专栏 ID
        const regex = /blog\.csdn\.net\/([^\/]+)\/category_(\d+)\.html/;
        const match = url.match(regex);
        
        if (match) {
            return {
                blogUsername: match[1],  // 第一个捕获组是用户名
                columnId: match[2]       // 第二个捕获组是专栏 ID
            };
        }
        
        return null;
    }

    /**
     * 构建专栏目录菜单
     * @param {Object} columnInfo 专栏目录信息 
     * @returns {Object} 菜单元素
     */
    function buildMenu(columnInfo) {
        const currentUrl = window.location.href;
        const menu = document.createElement('div');
        menu.classList.add('column-menu');
        
        // 添加专栏选择器
        const columnSelector = document.createElement('select');
        columnSelector.classList.add('column-selector');
        
        // 找到当前文章所在的专栏
        let currentColumnIndex = 0;
        columnInfo.forEach((column, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = column.columnTitle;
            columnSelector.appendChild(option);
            // 检查当前文章是否在这个专栏中
            if (column.articles.some(article => article.url.split('/').pop().split('?')[0] === currentUrl.split('/').pop().split('?')[0])) {
                currentColumnIndex = index;
            }
        });

        // 设置当前专栏为默认选中
        columnSelector.value = currentColumnIndex;

        // 添加切换事件
        columnSelector.addEventListener('change', (e) => {
            const selectedIndex = e.target.value;
            showColumnArticles(columnInfo[selectedIndex], menu);
        });

        menu.appendChild(columnSelector);

        // 显示当前专栏的文章
        showColumnArticles(columnInfo[currentColumnIndex], menu);
        
        return menu;
    }

    /**
     * 展示专栏文章列表
     * @param {Object} column 专栏信息
     * @param {Object} menu 菜单元素
     */
    function showColumnArticles(column, menu) {
        const currentUrl = window.location.href;
    
        // 移除现有的文章列表
        const existingList = menu.querySelector('.article-list');
        if (existingList) {
            existingList.remove();
        }

        const articleList = document.createElement('ul');
        articleList.classList.add('article-list');

        let activeArticleElement = null;

        column.articles.forEach(article => {
            const articleItem = document.createElement('li');
            const articleLink = document.createElement('a');
            articleLink.href = article.url;
            articleLink.textContent = article.title;
            
            if (article.url.split('/').pop().split('?')[0] === currentUrl.split('/').pop().split('?')[0]) {
                articleItem.classList.add('column-active');
                activeArticleElement = articleItem;
            }
            
            articleItem.appendChild(articleLink);
            articleList.appendChild(articleItem);
        });

        menu.appendChild(articleList);

        // 滚动到当前文章
        if (activeArticleElement) {
            // 等待 DOM 更新完成后再滚动
            setTimeout(() => {
                activeArticleElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center'
                });
            }, 100);
        }
    }

    /**
     * 初始化侧边栏
     */
    async function initSidebar() {
        try {
            // 获取专栏信息
            const columnInfo = await getColumnInfo();
            const article = document.querySelector('.blog-content-box');
            const headers = article?.querySelectorAll('h1, h2, h3, h4, h5, h6');
            
            // 如果既没有专栏信息也没有文章目录，则不添加侧边栏
            if ((!columnInfo || columnInfo.length === 0) && (!headers || headers.length === 0)) {
                return;
            }

            const sidebar = document.createElement('div');
            sidebar.id = 'custom-sidebar';
            sidebar.classList.add('column-menu-sidebar');

            if (columnInfo && columnInfo.length > 0) {
                // 有专栏信息时显示专栏目录
                const menu = buildMenu(columnInfo);
                addMenuToSidebar(menu, false, true);
            } else {
                // 没有专栏信息但有文章目录时直接显示文章目录
                addMenuToSidebar(null, true, false);
            }
        } catch (error) {
            console.error('初始化侧边栏失败:', error);
        }
    }

    /**
     * 添加侧边栏到页面
     * @param {HTMLElement} menu - 菜单元素
     * @param {boolean} showTocDirectly - 是否直接显示文章目录
     * @param {boolean} hasColumnMenu - 是否有专栏目录
     */
    function addMenuToSidebar(menu, showTocDirectly = false, hasColumnMenu = true) {
        const sidebar = document.createElement('div');
        sidebar.id = 'custom-sidebar';
        sidebar.classList.add('column-menu-sidebar');
        
        // 添加标题栏
        const titleBar = document.createElement('div');
        titleBar.classList.add('sidebar-title');
        
        // 添加标题文本容器
        const titleContent = document.createElement('div');
        titleContent.classList.add('title-content');
        titleContent.textContent = showTocDirectly ? '文章目录' : '专栏文章';
        
        // 添加按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('title-buttons');

        // 添加目录切换按钮
        if (hasColumnMenu) {
            const toggleTocBtn = document.createElement('button');
            toggleTocBtn.classList.add('sidebar-btn', 'toggle-toc-btn');
            toggleTocBtn.innerHTML = showTocDirectly ? '&#x1F4DA;' : '&#x1F4D1;';
            toggleTocBtn.title = '切换文章目录';
            toggleTocBtn.onclick = () => toggleTocMode(showTocDirectly);
            buttonContainer.appendChild(toggleTocBtn);
        }
        
        // 添加定位按钮（在两种模式下都显示）
        const locateBtn = document.createElement('button');
        locateBtn.classList.add('sidebar-btn', 'locate-btn');
        locateBtn.innerHTML = '&#x1F50D;';
        locateBtn.title = '定位当前位置';
        locateBtn.onclick = () => {
            if (showTocDirectly || sidebar.querySelector('.article-toc')) {
                // 目录模式下定位到当前标题
                const activeTocItem = sidebar.querySelector('.toc-active');
                if (activeTocItem) {
                    activeTocItem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            } else {
                // 专栏模式下定位到当前文章
                const activeArticle = sidebar.querySelector('.column-active');
                if (activeArticle) {
                    activeArticle.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        };
        buttonContainer.appendChild(locateBtn);
        
        // 添加配置按钮
        const configBtn = document.createElement('button');
        configBtn.classList.add('sidebar-btn', 'config-btn');
        configBtn.innerHTML = '&#x2699';
        configBtn.title = '设置';
        configBtn.onclick = showConfig;
        buttonContainer.appendChild(configBtn);

        // 添加收起按钮
        const collapseBtn = document.createElement('button');
        collapseBtn.classList.add('sidebar-btn', 'collapse-btn');
        collapseBtn.innerHTML = '&times;';
        collapseBtn.title = '收起侧边栏';
        collapseBtn.onclick = () => toggleSidebar(false);
        buttonContainer.appendChild(collapseBtn);
        
        // 组装标题栏
        titleBar.appendChild(titleContent);
        titleBar.appendChild(buttonContainer);
        sidebar.appendChild(titleBar);

        // 添加返回顶部按钮
        const backToTopBtn = document.createElement('button');
        backToTopBtn.classList.add('back-to-top');
        backToTopBtn.title = '返回顶部';
        
        // 监听滚动事件
        sidebar.addEventListener('scroll', () => {
            if (sidebar.scrollTop > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.onclick = () => {
            sidebar.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
        
        sidebar.appendChild(backToTopBtn);
        
        if (menu && !showTocDirectly) {
            sidebar.appendChild(menu);
        }
        
        // 插入侧边栏到页面
        const blogContentBox = document.querySelector('.blog-content-box');
        if (blogContentBox) {
            blogContentBox.insertAdjacentElement('beforeBegin', sidebar);
        } else {
            document.body.insertBefore(sidebar, document.body.firstChild);
        }
        
        adjustMainContentStyle(true);
        
        // 如果需要直接显示文章目录
        if (showTocDirectly) {
            generateToc(sidebar);
        }
    }

    /**
     * 切换侧边栏的显示状态
     * @param {boolean} show 是否显示
     */
    function toggleSidebar(show) {
        const sidebar = document.querySelector('#custom-sidebar');
        let expandBtn = document.querySelector('#sidebar-expand-btn');
        
        if (show) {
            sidebar.style.transform = 'translateX(0)';
            if (expandBtn) {
                expandBtn.style.display = 'none';
            }
            adjustMainContentStyle(true);
        } else {
            sidebar.style.transform = 'translateX(-250px)';
            
            // 如果展开按钮不存在，则创建
            if (!expandBtn) {
                expandBtn = document.createElement('div');
                expandBtn.id = 'sidebar-expand-btn';
                expandBtn.onclick = () => toggleSidebar(true);
                document.body.appendChild(expandBtn);
            }
            expandBtn.style.display = 'block';
            adjustMainContentStyle(false);
        }
    }

    /**
     * 切换目录模式
     * @param {boolean} [isInTocMode=false] - 当前是否在目录模式
     */
    function toggleTocMode(isInTocMode = false) {
        const sidebar = document.querySelector('#custom-sidebar');
        const menu = sidebar.querySelector('.column-menu');
        const existingToc = sidebar.querySelector('.article-toc');
        const titleContent = sidebar.querySelector('.title-content');
        const toggleBtn = sidebar.querySelector('.toggle-toc-btn');
        const locateBtn = sidebar.querySelector('.locate-btn');

        if (existingToc) {
            // 切换回专栏模式
            existingToc.remove();
            if (menu) menu.style.display = 'block';
            titleContent.textContent = '专栏文章';
            toggleBtn.innerHTML = '&#x1F4D1;';
            
            // 更新定位按钮功能为专栏模式
            if (locateBtn) {
                locateBtn.onclick = () => {
                    const activeArticle = sidebar.querySelector('.column-active');
                    if (activeArticle) {
                        activeArticle.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                };
            }
        } else {
            // 切换到目录模式
            if (menu) menu.style.display = 'none';
            titleContent.textContent = '文章目录';
            toggleBtn.innerHTML = '&#x1F4DA;';
            generateToc(sidebar);
            
            // 更新定位按钮功能为目录模式
            if (locateBtn) {
                locateBtn.onclick = () => {
                    const activeTocItem = sidebar.querySelector('.toc-active');
                    if (activeTocItem) {
                        activeTocItem.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                };
            }
        }
    }

    /**
     * 显示配置面板
     */
    function showConfig() {
        const configPanel = document.createElement('div');
        configPanel.classList.add('config-panel');

        const cleanParamsOption = document.createElement('label');
        cleanParamsOption.innerHTML = `
            <input type="checkbox" ${CONFIG.cleanParams ? 'checked' : ''}>
            去除链接中的分析参数
        `;

        cleanParamsOption.querySelector('input').onchange = (e) => {
            CONFIG.cleanParams = e.target.checked;
            GM_setValue('cleanParams', CONFIG.cleanParams);
        };

        configPanel.appendChild(cleanParamsOption);

        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.onclick = () => {
            configPanel.remove();
        };
        configPanel.appendChild(closeBtn);

        document.body.appendChild(configPanel);
        
    }

    /**
     * 去除链接中的分析参数
     */
    function cleanAnalyticsParams() {
        if (!CONFIG.cleanParams) return ;
        
        const paramsToRemove = ['spm', 'utm_source', 'utm_medium', 'utm_campaign', 'depth_1-utm_source', 'depth_1-utm_medium', 'depth_1-utm_campaign'];
        const url = new URL(window.location.href);
        let changed = false;
        
        paramsToRemove.forEach(param => {
            if (url.searchParams.has(param)) {
                url.searchParams.delete(param);
                changed = true;
            }
        });
        
        if (changed) {
            window.history.replaceState({}, '', url.toString());
        }
    }

    /**
     * 生成文章目录
     * @param {HTMLElement} sidebar - 侧边栏元素
     */
    function generateToc(sidebar) {
        const article = document.querySelector('.blog-content-box');
        if (!article) return;

        const toc = document.createElement('div');
        toc.classList.add('article-toc');

        // 获取所有标题
        const headers = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const tocList = document.createElement('ul');
        tocList.classList.add('toc-list');

        // 创建目录树结构
        const headerTree = buildHeaderTree(headers);
        renderHeaderTree(headerTree, tocList);

        toc.appendChild(tocList);
        sidebar.appendChild(toc);

        // 添加目录滚动监听
        addTocScrollSpy(headers, tocList);
    }

    /**
     * 构建标题树结构
     * @param {NodeList} headers - 标题元素列表
     * @returns {Array} 标题树结构
     */
    function buildHeaderTree(headers) {
        const tree = [];
        const stack = [{ level: 0, children: tree }];

        headers.forEach((header, index) => {
            const level = parseInt(header.tagName.charAt(1));
            const node = {
                id: header.id || `toc-heading-${index}`,
                title: header.textContent,
                level,
                children: []
            };

            if (!header.id) {
                header.id = node.id;
            }

            while (stack[stack.length - 1].level >= level) {
                stack.pop();
            }

            stack[stack.length - 1].children.push(node);
            stack.push({ level, children: node.children });
        });

        return tree;
    }

    /**
     * 渲染标题树
     * @param {Array} tree - 标题树结构
     * @param {HTMLElement} parent - 父容器元素
     */
    function renderHeaderTree(tree, parent) {
        tree.forEach(node => {
            const item = document.createElement('li');
            item.classList.add(`toc-level-${node.level}`);
            
            const titleContainer = document.createElement('div');
            titleContainer.classList.add('toc-title-container');
            
            // 只有当有子节点时才添加展开/折叠按钮
            if (node.children.length > 0) {
                const toggleBtn = document.createElement('span');
                toggleBtn.classList.add('toc-toggle');
                toggleBtn.innerHTML = '▼';
                toggleBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const subList = item.querySelector('ul');
                    if (subList) {
                        const isExpanded = subList.style.display !== 'none';
                        subList.style.display = isExpanded ? 'none' : 'block';
                        toggleBtn.innerHTML = isExpanded ? '▶' : '▼';
                    }
                };
                titleContainer.appendChild(toggleBtn);
            } else {
                // 添加一个空的占位符，保持对齐
                const spacer = document.createElement('span');
                spacer.classList.add('toc-toggle-spacer');
                titleContainer.appendChild(spacer);
            }
            
            const link = document.createElement('a');
            link.href = `#${node.id}`;
            link.textContent = node.title;
            link.onclick = (e) => {
                e.preventDefault();
                document.getElementById(node.id).scrollIntoView({ behavior: 'smooth' });
            };
            
            titleContainer.appendChild(link);
            item.appendChild(titleContainer);
            
            if (node.children.length > 0) {
                const subList = document.createElement('ul');
                renderHeaderTree(node.children, subList);
                item.appendChild(subList);
            }
            
            parent.appendChild(item);
        });
    }

    /**
     * 添加目录滚动监听
     * @param {HTMLElement} headers 
     * @param {HTMLElement} tocList 
     */
    function addTocScrollSpy(headers, tocList) {
        const tocLinks = tocList.querySelectorAll('a');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const tocLink = tocList.querySelector(`a[href="#${id}"]`);
                
                if (entry.isIntersecting) {
                    tocLinks.forEach(link => link.classList.remove('toc-active'));
                    tocLink?.classList.add('toc-active');
                }
            });
        }, {
            rootMargin: '-20% 0px -80% 0px'
        });
    
        headers.forEach(header => observer.observe(header));
    }

    /**
     * 调整主内容区域的样式
     * @param {boolean} isExpanded 是否展开
     */
    function adjustMainContentStyle(isExpanded) {
        const mainContent = document.querySelector('.blog-content-box');
        if (mainContent) {
            const margin = isExpanded ? '250px' : '0';
            
            mainContent.style.marginLeft = margin;
            mainContent.style.marginRight = '0';
    
            // 调整顶部工具栏
            const topToolbarBox = document.querySelector('#toolbarBox');
            if (topToolbarBox) {
                topToolbarBox.style.marginLeft = margin;
            }
            
            // 调整底部工具栏
            const bottomToolbox = document.querySelector('#toolBarBox');
            if (bottomToolbox) {
                bottomToolbox.style.marginLeft = margin;
            }
    
            // 调整评论区
            const footer = document.querySelector('#pcCommentBox');
            if (footer) {
                footer.style.marginLeft = margin;
            }
        }
    }

    /**
     * 添加点击事件到菜单
     * @param {Object} menu 菜单对象
     */
    function addClickEventToMenu(menu) {
        const articleLinks = menu.querySelectorAll('.article-list a');
        articleLinks.forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                const targetUrl = link.getAttribute('href');
                // 直接在当前页面重新加载
                window.location.href = targetUrl;
            });
        });
    }

    // 更新样式
    const customStyle = `
        /* 侧边栏基础样式 */
        #custom-sidebar {
            all: unset;
            position: fixed;
            left: 0;
            top: 0;
            width: 250px;
            height: 100vh;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            z-index: 999;
            overflow-x: auto;
            overflow-y: auto;
            padding: 0;
            border-right: 1px solid #eee;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            transition: transform 0.3s ease;
        }

        /* 标题栏样式组 */
        .sidebar-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 15px;
            font-size: 16px;
            font-weight: bold;
            border-bottom: 1px solid #eee;
            background-color: #f8f9fa;
        }

        .title-buttons {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .title-content {
            flex: 1;
        }

        /* 按钮通用样式 */
        .sidebar-btn {
            background: none;
            border: none;
            color: #666;
            font-size: 16px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
        }

        .sidebar-btn:hover {
            background-color: rgba(0, 0, 0, 0.05);
            color: #1890ff;
        }

        .sidebar-btn:active {
            transform: scale(0.95);
        }

        /* 特定按钮样式 */
        .locate-btn { font-size: 14px; }
        .collapse-btn { font-size: 18px; }
        .toggle-toc-btn { font-size: 16px; }

        /* 展开按钮样式 */
        #sidebar-expand-btn {
            position: fixed;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 50px;
            background-color: #fff;
            box-shadow: 2px 0 4px rgba(0,0,0,0.1);
            cursor: pointer;
            z-index: 999;
            border-radius: 0 4px 4px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
            text-align: center;
            line-height: 50px;
        }

        #sidebar-expand-btn:hover {
            background-color: #f0f0f0;
        }

        #sidebar-expand-btn::after {
            content: '›';
            font-size: 20px;
            color: #666;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            line-height: 1;
        }

        /* 专栏选择器样式 */
        .column-selector {
            width: 90%;
            margin: 10px auto;
            display: block;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            background-color: #fff;
        }

        .column-selector:hover {
            border-color: #40a9ff;
        }

        .column-selector:focus {
            outline: none;
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
        }

        /* 文章列表样式 */
        .article-list {
            list-style: none;
            padding: 0;
            margin: 0;
            background-color: #fff;
        }

        .article-list li {
            padding: 0;
            border-bottom: 1px solid #f0f0f0;
            background-color: #fff;
        }

        .article-list li a {
            display: block;
            padding: 12px 15px;
            color: #000;
            text-decoration: none;
            font-size: 14px;
            line-height: 1.5;
            transition: all 0.2s;
            background-color: #fff;
            white-space: normal;
            word-break: break-all;
        }

        .article-list li:hover {
            background-color: #f8f9fa;
        }

        .article-list li:hover a {
            color: #1890ff;
        }

        .column-active {
            background-color: #e6f7ff;
        }

        .column-active a {
            color: #1890ff !important;
            font-weight: 500;
        }

        /* 目录树样式 */
        .article-toc {
            padding: 10px 0;
            overflow-y: auto;
            height: calc(100vh - 50px);
        }

        .toc-list, .toc-list ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .toc-list > li {
            padding-left: 0;
        }

        .toc-list ul > li {
            padding-left: 20px;
            background-color: #fff !important;
        }

        .toc-title-container {
            display: flex;
            align-items: center;
            padding: 8px 15px;
            cursor: pointer;
            transition: all 0.2s;
            background-color: #fff !important;
        }

        .toc-title-container:hover {
            background-color: #f8f9fa;
        }

        .toc-toggle, .toc-toggle-spacer {
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            margin-right: 5px;
        }

        .toc-toggle:hover {
            color: #1890ff;
        }

        /* 目录链接样式 */
        .toc-list a {
            flex: 1;
            color: #333;
            text-decoration: none;
            font-size: 14px;
            line-height: 1.5;
            transition: all 0.2s;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            word-break: break-all;
        }

        .toc-list a:hover {
            color: #1890ff;
        }

        /* 目录级别样式 */
        .toc-level-1 > .toc-title-container { font-size: 16px; font-weight: 500; }
        .toc-level-2 > .toc-title-container { font-size: 15px; }
        .toc-level-3 > .toc-title-container { font-size: 14px; }
        .toc-level-4 > .toc-title-container,
        .toc-level-5 > .toc-title-container,
        .toc-level-6 > .toc-title-container { font-size: 13px; }

        /* 激活状态样式 */
        .toc-active {
            color: #1890ff !important;
            font-weight: 500;
        }

        .toc-active > .toc-title-container {
            background-color: #e6f7ff;
        }

        /* 滚动条样式 */
        #custom-sidebar::-webkit-scrollbar {
            width: 6px;
        }

        #custom-sidebar::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        #custom-sidebar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
        }

        #custom-sidebar::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        /* 响应式样式 */
        @media (max-width: 1200px) {
            #custom-sidebar {
                width: 200px;
            }
            
            .blog-content-box {
                margin-left: 200px !important;
            }
            
            #sidebar-expand-btn {
                width: 16px;
            }
            
            .column-selector {
                width: 85%;
            }
        }

        /* 过渡动画 */
        .blog-content-box,
        #toolbarBox,
        #toolBarBox,
        #pcCommentBox {
            transition: margin-left 0.3s ease;
        }

        /* 返回顶部按钮样式 */
        .back-to-top {
            position: fixed;
            top: 10%;
            left: 190px;
            width: 40px;
            height: 40px;
            background-color: #fff;
            border: 1px solid #eee;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 1000;
        }

        .back-to-top:hover {
            background-color: #f8f9fa;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateY(-2px);
        }

        .back-to-top::after {
            content: '↑';
            font-size: 20px;
            color: #1890ff;
            font-weight: bold;
        }

        .column-menu {
            position: relative;
            height: 100%;
        }

        .config-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
        }
        
        .config-panel label {
            display: block;
            margin: 10px 0;
            cursor: pointer;
        }
        
        .config-panel button {
            margin-top: 15px;
            padding: 5px 15px;
            background: #1890ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .config-btn {
            font-size: 16px;
        }
    `;

    // 如果支持GM_addStyle，则使用它来添加样式
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(customStyle);
    } else {
        // 否则，创建一个style元素并添加到head中
        const styleEl = document.createElement('style');
        styleEl.type = 'text/css';
        styleEl.innerHTML = customStyle;
        document.head.appendChild(styleEl);
    }
})();