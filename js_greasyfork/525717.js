// ==UserScript==
// @name         CPP便捷快速扫本
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  增强版筛选，支持黑名单,支持心愿单
// @author       AnchorCat
// @match        https://www.allcpp.cn/allcpp/event/eventdoujinshi.do?*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/525717/CPP%E4%BE%BF%E6%8D%B7%E5%BF%AB%E9%80%9F%E6%89%AB%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/525717/CPP%E4%BE%BF%E6%8D%B7%E5%BF%AB%E9%80%9F%E6%89%AB%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 本地默认黑名单值
    const DEFAULT_BLACKLIST = [];

    // 配置参数
    const CONFIG = {
        REQUEST_SIZE: 30,
        LOAD_DELAY: 500,
        // 检查GM中是否存在BLACKLIST数据，不存在则使用默认值并存储
        BLACKLIST: (function () {
            const storedBlacklist = GM_getValue("BLACKLIST", []);
            if (storedBlacklist) {
                return storedBlacklist;
            } else {
                GM_setValue("BLACKLIST", DEFAULT_BLACKLIST);
                return DEFAULT_BLACKLIST;
            }
        })(),
        API_URL: "https://www.allcpp.cn/api/doujinshi/search.do",
        COVER_PREFIX: "https://imagecdn3.allcpp.cn/upload"
    };

    // 从GM中获取缓存
    const CACHE = GM_getValue('REQUEST_CACHE', {});

    // 用于存储正在进行的请求
    const activeRequests = new Set();
    // 请求暂停标记
    let isRequestPaused = false;

    // 获取页面勾选的 typeIds
    function getCheckedTypeIds() {
        const activeTypeBoxes = document.querySelectorAll('.type-box .active');
        const typeIds = [];
        activeTypeBoxes.forEach(box => {
            const id = box.getAttribute('data-id');
            if (id) {
                typeIds.push(id);
            }
        });
        return typeIds.join('%2C');
    }

    // 获取当前活动的eventID
    function getActiveEventDayId() {
        const activeEventDay = document.querySelector('.event-days .active');
        return activeEventDay ? activeEventDay.getAttribute('data-id') : null;
    }

    // 创建悬浮按钮
    const floatBtn = document.createElement('div');
    floatBtn.id = 'float-btn';
    floatBtn.textContent = '打开作品筛选\n(按照当前类型)';
    document.body.appendChild(floatBtn);

    // 悬浮按钮点击处理
    document.body.addEventListener('click', async (e) => {
        if (e.target.id === 'float-btn') {
            const filterPage = createFilterPage();
            filterPage.currentRequestPage = 1;
            const checkedTypeIds = getCheckedTypeIds();
            const eventId = getActiveEventDayId();
            CONFIG.BASE_PARAMS = `eventId=${eventId}&orderBy=1&typeIds=${checkedTypeIds}&pageSize=30`;
            CONFIG.CURRENT_EVENTID = eventId;
            setupIntersectionObserver(filterPage); // 设置曝光监听，用于获取更多数据
        }
    });

    // 创建筛选页面
    function createFilterPage() {
        const existing = document.querySelector('.filter-page');
        if (existing) existing.remove();

        const filterPage = document.createElement('div');
        filterPage.className = 'filter-page';
        filterPage.innerHTML = `
            <div class="close-btn">关闭</div>
            <div class="blacklist-btn">管理Tag黑名单</div>
            <div class="force-refresh-btn">强制刷新</div>
            <h1>作品筛选列表（总计 <span id="total-count">0</span> 页）</h1>
            <div id="works-container"></div>
            <div id="loading-status" style="padding: 20px; text-align: center;"></div>
        `;
        // 黑名单面板交互
        let blacklistPanel = null;
        filterPage.querySelector('.blacklist-btn').addEventListener('click', (e) => {
            if (!blacklistPanel) {
                blacklistPanel = createBlacklistPanel(filterPage);
                filterPage.appendChild(blacklistPanel);

                // 点击外部关闭
                const clickHandler = (event) => {
                    const isDeleteButton = event.target.classList.contains('delete-btn');
                    if (isDeleteButton) return;
                    if (!blacklistPanel.contains(event.target) &&
                        event.target !== e.target) {
                        blacklistPanel.remove();
                        blacklistPanel = null;
                        document.removeEventListener('click', clickHandler);
                    }
                };
                document.addEventListener('click', clickHandler);
            }
        });
        // 绑定关闭事件
        filterPage.querySelector('.close-btn').addEventListener('click', () => {
            filterPage.remove();
        });

        // 绑定强制刷新事件
        filterPage.querySelector('.force-refresh-btn').addEventListener('click', () => {
            isRequestPaused = true; // 暂停新请求
            // 取消所有正在进行的请求
            activeRequests.forEach(request => {
                if (request.abort) {
                    request.abort();
                }
            });
            activeRequests.clear(); // 清空请求队列

            GM_setValue('REQUEST_CACHE', {});
            Object.keys(CACHE).forEach(key => delete CACHE[key]);
            filterPage.querySelector('#works-container').innerHTML = '';
            filterPage.currentRequestPage = 1;

            setTimeout(() => {
                isRequestPaused = false; // 恢复请求
                loadMoreData(filterPage, 1);
            }, 100); // 短暂延迟后重新发起请求
        });
        document.body.appendChild(filterPage);
        return filterPage;
    }

    // 单页加载逻辑
    async function loadPage(page) {
        if (isRequestPaused) {
            return null;
        }
        const url = `${CONFIG.API_URL}?${CONFIG.BASE_PARAMS}&pageIndex=${page}`;
        if (CACHE[url]) {
            console.log(`使用缓存数据，第${page}页`);
            return CACHE[url];
        }

        console.log(`正在请求第${page}页数据`);
        return new Promise((resolve, reject) => {
            const request = GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: (response) => {
                    activeRequests.delete(request); // 请求完成，从队列中移除
                    if (response.status >= 200 && response.status < 300) {
                        const data = JSON.parse(response.responseText);
                        const result = {
                            works: data.result?.list || [],
                            total: data.result?.total || 0
                        };
                        CACHE[url] = result;
                        GM_setValue('REQUEST_CACHE', CACHE);
                        resolve(result);
                    } else {
                        reject(new Error(`HTTP error: ${response.status}`));
                    }
                },
                onerror: (error) => {
                    activeRequests.delete(request); // 请求出错，从队列中移除
                    reject(new Error(`Network error: ${error.message}`));
                }
            });
            activeRequests.add(request); // 将请求添加到队列中
        });
    }

    function setupIntersectionObserver(filterPage) {
        const placeholder = filterPage.querySelector('#loading-status');
        let isLoading = false;

        const observer = new IntersectionObserver(async (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isLoading) {
                    isLoading = true;
                    loadMoreData(filterPage, filterPage.currentRequestPage).then(() => {
                        isLoading = false;
                    });
                }
            });
        });

        observer.observe(placeholder);
    }

    // 加载更多数据（每次加载CONFIG.REQUEST_SIZE条）
    async function loadMoreData(filterPage, startPage) {
        if (isRequestPaused) {
            return;
        }
        const container = filterPage.querySelector('#works-container');
        const status = filterPage.querySelector('#loading-status');
        let currentPage = startPage;
        let loadedCount = 0;
        let hasMore = true;

        while (loadedCount < CONFIG.REQUEST_SIZE && hasMore) {
            if (isRequestPaused) {
                break;
            }
            status.textContent = `正在加载第 ${currentPage} 页...`;
            const result = await loadPage(currentPage);
            currentPage++;
            filterPage.currentRequestPage = currentPage;
            if (!result || result.works.length === 0) {
                hasMore = false;
                status.textContent = "没有更多数据";
                break;
            }

            // 初始化数据存储
            if (!filterPage.allWorks) filterPage.allWorks = [];

            // 添加原始数据并建立索引
            result.works.forEach((work, index) => {
                work.index = filterPage.allWorks.length + 1;
                work.pageIndex = currentPage;
                filterPage.allWorks.push(work);
            });

            // 渲染过滤后的数据
            result.works.forEach(work => {
                if (checkWorkInBlackList(work)) {
                    return;
                }
                renderWorkItem(container, work, filterPage);
                loadedCount++;
            });
            updateCounter(filterPage, result.total);

            await new Promise(r => setTimeout(r, CONFIG.LOAD_DELAY));
        }

        status.textContent = hasMore ? "滚动到底部加载更多" : "已加载全部数据";
    }

    // 更新计数器
    function updateCounter(filterPage, total) {
        const counter = filterPage.querySelector('#total-count');
        if (counter) counter.textContent = Math.ceil(total / 30);
    }

    // 创建黑名单管理面板
    function createBlacklistPanel(filterPage) {
        const panel = document.createElement('div');
        panel.className = 'blacklist-panel';
        panel.innerHTML = `
        <div class="blacklist-controls">
            <input type="text" class="blacklist-input" placeholder="添加/搜索黑名单词">
            <button class="blacklist-add-btn">添加</button>
        </div>
        <div class="blacklist-items"></div>
        <button class="blacklist-export-btn">导出Json文件</button>
        <button class="blacklist-import-btn">导入Json文件</button>
    `;

        // 事件绑定
        const addBtn = panel.querySelector('.blacklist-add-btn');
        const input = panel.querySelector('.blacklist-input');
        const itemsContainer = panel.querySelector('.blacklist-items');
        const exportBtn = panel.querySelector('.blacklist-export-btn');
        const importBtn = panel.querySelector('.blacklist-import-btn');

        // 添加黑名单
        function addToBlacklist() {
            const word = input.value.trim();
            if (word && !CONFIG.BLACKLIST.includes(word)) {
                CONFIG.BLACKLIST.push(word);
                GM_setValue('BLACKLIST', CONFIG.BLACKLIST);
                input.value = '';
                refreshBlacklistItems();
                updateWorksByBlacklist(filterPage);
            }
        }

        // 搜索过滤
        function searchBlacklist() {
            const keyword = input.value.trim().toLowerCase();
            refreshBlacklistItems(keyword);
        }

        // 导出黑名单为 JSON 文件
        function exportBlacklist() {
            const jsonData = JSON.stringify(CONFIG.BLACKLIST, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'blacklist.json';
            a.click();
            URL.revokeObjectURL(url);
        }

        // 导入 JSON 文件到黑名单
        function importBlacklist() {
            const inputElement = document.createElement('input');
            inputElement.type = 'file';
            inputElement.accept = 'application/json';
            inputElement.onchange = function (event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        try {
                            const importedData = JSON.parse(e.target.result);
                            if (Array.isArray(importedData)) {
                                CONFIG.BLACKLIST = [...new Set([...GM_getValue('BLACKLIST', CONFIG.BLACKLIST), ...importedData])];
                                GM_setValue('BLACKLIST', CONFIG.BLACKLIST);
                                refreshBlacklistItems();
                                updateWorksByBlacklist(filterPage);
                            } else {
                                alert('导入的文件格式不正确，必须是 JSON 数组。');
                            }
                        } catch (error) {
                            alert('导入失败，请确保文件是有效的 JSON 格式。');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            inputElement.click();
        }

        // 点击添加按钮
        addBtn.addEventListener('click', addToBlacklist);

        // 输入框输入时自动搜索
        input.addEventListener('input', searchBlacklist);

        // 点击导出按钮
        exportBtn.addEventListener('click', exportBlacklist);

        // 点击导入按钮
        importBtn.addEventListener('click', importBlacklist);

        // 刷新黑名单列表
        function refreshBlacklistItems(keyword = '') {
            itemsContainer.innerHTML = '';
            CONFIG.BLACKLIST
                .filter(word => word.toLowerCase().includes(keyword)).reverse()
                .forEach(word => {
                    const item = document.createElement('div');
                    item.className = 'blacklist-item';
                    item.innerHTML = `
                    <span>${word}</span>
                    <span class="delete-btn">删除</span>
                `;

                    item.querySelector('.delete-btn').addEventListener('click', () => {
                        CONFIG.BLACKLIST = CONFIG.BLACKLIST.filter(w => w !== word);
                        GM_setValue('BLACKLIST', CONFIG.BLACKLIST);
                        refreshBlacklistItems(input.value.trim().toLowerCase());
                        updateWorksByBlacklist(filterPage);
                    });

                    itemsContainer.appendChild(item);
                });
        }

        // 初始加载
        refreshBlacklistItems();
        return panel;
    }

    // 根据黑名单，从当前的container中移除作品，不刷新全部作品
    function updateWorksByBlacklist(filterPage) {
        const container = filterPage.querySelector('#works-container');
        const works = container.querySelectorAll('.work-item');
        works.forEach(work => {
            const tags = work.querySelectorAll('.tag-text');
            const tagTexts = Array.from(tags).map(tag => tag.textContent);

            // 检查标签文本是否包含黑名单中的词
            if (tagTexts.some(tag => CONFIG.BLACKLIST.includes(tag))) {
                // 若包含，则隐藏该作品项
                work.style.display = 'none';
            } else {
                // 若不包含，则确保该作品项是显示的
                work.style.display = '';
            }
        });
    }

    // 全局刷新作品列表
    function refreshWorks(filterPage) {
        const container = filterPage.querySelector('#works-container');
        container.innerHTML = '';
        filterPage.allWorks.forEach(work => {
            if (!checkWorkInBlackList(work)) {
                renderWorkItem(container, work, filterPage);
            }
        });
    }

    // 判断作品是否命中黑名单
    function checkWorkInBlackList(work) {
        if (CONFIG.BLACKLIST.some(word => work.tag.includes(word))
            || CONFIG.BLACKLIST.some(word => work.themeAlias.includes(word))) {
            return true;
        }
        return false;
    }

    // 独立渲染单个作品的方法
    function renderWorkItem(container, work, filterPage) {
        if (CONFIG.BLACKLIST.some(word => work.tag.includes(word))) return;

        const item = document.createElement('div');
        item.className = 'work-item';
        const coverUrl = `${CONFIG.COVER_PREFIX}${work.coverPicUrl}?x-oss-process=style/rectangle_450-600_60`;

        // 添加 type 图标
        const typeIcon = document.createElement('div');
        typeIcon.className = 'type-icon';
        typeIcon.textContent = work.type;

        // 划分标签并生成可点击按钮
        let tags = [];
        if (work.tag) {
            tags = work.tag.split('|');
        }
        tags.unshift(work.themeAlias); // 存在没写tag的作品，添加原作作为tag标签
        tags.unshift(`圈子: ${work.circleName}(${work.circleID})`); // 存在没写tag的作品，添加原作作为tag标签
        tags.unshift(`作者: ${work.nickname}(${work.userID})`);
        tags = [...new Set(tags)];

        const tagButtons = tags.map(tag => {
            const button = document.createElement('button');
            button.innerHTML = `
            <span class="tag-content">
                <span class="tag-text">${tag}</span>
                <span class="close-emoji">❌</span>
            </span>
        `;
            button.classList.add('tag-button');

            // 鼠标悬停事件
            button.addEventListener('mouseover', () => {
                button.classList.add('hovered');
            });

            // 鼠标移出事件
            button.addEventListener('mouseout', () => {
                button.classList.remove('hovered');
            });

            // 点击事件
            button.addEventListener('click', () => {
                if (!CONFIG.BLACKLIST.includes(tag)) {
                    CONFIG.BLACKLIST.push(tag);
                    GM_setValue('BLACKLIST', CONFIG.BLACKLIST);
                    const rect = button.getBoundingClientRect();
                    showToast(`已将 ${tag} 加入到黑名单`, rect.left, rect.bottom);
                    updateWorksByBlacklist(filterPage);
                }
            });

            return button;
        });

        const tagDiv = document.createElement('div');
        tagDiv.classList.add('tags');
        tagButtons.forEach(button => tagDiv.appendChild(button));

        item.innerHTML = `
        <div class="count-box">
            <div class="count">${work.index}</div>
            <div class="page-index">（页面：${work.pageIndex}）</div>
        </div>
        <img class="cover-img" src="${coverUrl}"
             onerror="this.src='https://placehold.co/100x140?text=封面加载失败'">
        <div>
            <h2>
                <a class="title-link" href="https://www.allcpp.cn/d/${work.doujinshiId}.do#tabType=0"
                   target="_blank">
                   ${work.doujinshiName}
                </a>
            </h2>
        </div>
    `;

        // 将 type 图标插入到标题上方
        const titleDiv = item.querySelector('div:nth-child(3)');
        titleDiv.insertBefore(typeIcon, titleDiv.firstChild);

        // 添加标签按钮到作品项中
        item.querySelector('div:nth-child(3)').appendChild(tagDiv);

        // 添加心愿单按钮和显示区域
        const wishlistContainer = document.createElement('div');
        wishlistContainer.className = 'wishlist-container';
        const currentWork = work;
        const wishlistInfoContainer = document.createElement('div');
        wishlistInfoContainer.className = 'wishlist-info';
        renderWishlistInfo(currentWork.doujinshiId, wishlistInfoContainer);
        wishlistContainer.appendChild(wishlistInfoContainer);
        item.appendChild(wishlistContainer);
        container.appendChild(item);
    }

    // 显示 toast 提示的函数
    function showToast(message, left, top) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        // 设置位置并留出空隙
        toast.style.left = `${left}px`;
        toast.style.top = `${top + 5}px`;
        document.body.appendChild(toast);

        // 添加淡入效果
        setTimeout(() => {
            toast.classList.add('toast-fade-in');
        }, 50);

        // 定时移除 toast 并添加淡出效果
        setTimeout(() => {
            toast.classList.add('toast-fade-out');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }

    // 查询该作品目前适用于哪个心愿单
    async function getCouldBuyEventList(doujinshiid) {
        const url = `https://www.allcpp.cn/allcpp/djswb/getCouldBuyEventList.do?doujinshiid=${doujinshiid}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        const data = JSON.parse(response.responseText);
                        const validEvents = data.result.filter(event => event.eventId > 0);
                        resolve(validEvents);
                    } else {
                        reject(new Error(`HTTP error: ${response.status}`));
                    }
                },
                onerror: (error) => {
                    reject(new Error(`Network error: ${error.message}`));
                }
            });
        });
    }

    // 添加该作品到对应心愿单
    async function addToWishlist(doujinshiid, eventids) {
        const url = `https://www.allcpp.cn/api/djswb/addDoujinshiWannaBuy.do?doujinshiid=${doujinshiid}&eventids=${eventids}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve();
                    } else {
                        reject(new Error(`HTTP error: ${response.status}`));
                    }
                },
                onerror: (error) => {
                    reject(new Error(`Network error: ${error.message}`));
                }
            });
        });
    }

    // 删除该作品到对应心愿单
    async function deleteFromWishlist(doujinshiid, eventids) {
        const url = `https://www.allcpp.cn/api/djswb/deleteDoujinshiWannaBuy.do?doujinshiid=${doujinshiid}&eventids=${eventids}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve();
                    } else {
                        reject(new Error(`HTTP error: ${response.status}`));
                    }
                },
                onerror: (error) => {
                    reject(new Error(`Network error: ${error.message}`));
                }
            });
        });
    }

    // 渲染心愿单信息
    async function renderWishlistInfo(doujinshiid, container) {
        const eventList = await getCouldBuyEventList(doujinshiid);
        container.innerHTML = '';
        eventList.forEach(event => {
            const eventInfo = document.createElement('div');
            if (event.isWannaBuy) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'wishlist-btn del_wish_button';
                deleteBtn.textContent = `${event.eventId == CONFIG.CURRENT_EVENTID ? `⭐️` : ``} 从【${event.eventName}】心愿单里删除`;
                deleteBtn.addEventListener('click', async () => {
                    await deleteFromWishlist(doujinshiid, event.eventId);
                    // 刷新心愿单显示
                    renderWishlistInfo(doujinshiid, container);
                });
                eventInfo.appendChild(deleteBtn);
            } else {
                const addBtn = document.createElement('button');
                addBtn.className = 'wishlist-btn add_wish_button';
                addBtn.textContent = `${event.eventId == CONFIG.CURRENT_EVENTID ? `⭐️` : ``} 添加到【${event.eventName}】心愿单`;
                addBtn.addEventListener('click', async () => {
                    await addToWishlist(doujinshiid, event.eventId);
                    // 刷新心愿单显示
                    renderWishlistInfo(doujinshiid, container);
                });
                eventInfo.appendChild(addBtn);
            }

            container.appendChild(eventInfo);
        });
    }

})();

// 添加 toast 样式，包含淡入淡出效果
GM_addStyle(`
    .toast {
        position: fixed;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10003;
        opacity: 0;
        transition: opacity 0.3s;
    }
    .toast-fade-in {
        opacity: 1;
    }
    .toast-fade-out {
        opacity: 0;
    }
`);

GM_addStyle(`
    .type-icon {
        font-family: 'Microsoft YaHei','Helvetica';
        line-height: 20px;
        -webkit-font-smoothing: antialiased;
        display: inline-block;
        margin: 3px 10px 5px 0;
        border-radius: 5px;
        border: 1px solid #e1ca82;
        font-size: 14px;
        padding: 3px 5px;
        cursor: pointer;
        background: #e1ca82;
        color: #fff;
    }
`);

// 添加按钮样式
GM_addStyle(`
    .tag-button {
        margin: 2px;
        padding: 4px 8px;
        background-color: #e0e0e0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        white-space: nowrap;

        font-family: 'Microsoft YaHei','Helvetica';
        line-height: 20px;
        -webkit-font-smoothing: antialiased;
        display: inline-block;
        font-size: 14px;

    }
    .tag-button:hover {
        background-color: #bdbdbd;
    }
    .tag-button .tag-content {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .tag-button .tag-text {
        opacity: 1;
        transition: opacity 0.2s;
    }
    .tag-button .close-emoji {
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: opacity 0.2s;
    }
    .tag-button.hovered .tag-text {
        opacity: 0;
    }
    .tag-button.hovered .close-emoji {
        opacity: 1;
    }
`);

// 关闭按钮
GM_addStyle(`
    .close-btn {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 8px 16px;
        background: #ff4444;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        z-index: 10001;
}
`);

GM_addStyle(`
    /* 黑名单管理按钮 */
    .blacklist-btn {
        position: fixed;
        top: 20px;
        right: 80px;
        padding: 8px 16px;
        background: #ff9800;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        z-index: 10001;
    }

    .force-refresh-btn {
        position: fixed;
        top: 20px;
        right: 195px;
        padding: 8px 16px;
        background:rgb(69, 37, 215);
        color: white;
        border-radius: 4px;
        cursor: pointer;
        z-index: 10001;
    }

    /* 黑名单管理面板 */
    .blacklist-panel {
        position: fixed;
        top: 60px;
        right: 20px;
        width: 300px;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10002;
        padding: 15px;
        border-radius: 8px;
    }

    .blacklist-controls {
        margin-bottom: 10px;
        display: flex;
        gap: 10px;
    }

    .blacklist-add-btn {
        padding: 6px 12px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .blacklist-add-btn:hover {
        background-color: #1976D2;
    }
    .blacklist-add-btn:active {
        background-color: #1565C0;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .blacklist-export-btn {
        padding: 6px 12px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .blacklist-export-btn:hover {
        background-color: #1976D2;
    }
    .blacklist-export-btn:active {
        background-color: #1565C0;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .blacklist-import-btn {
        padding: 6px 12px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .blacklist-import-btn:hover {
        background-color: #1976D2;
    }
    .blacklist-import-btn:active {
        background-color: #1565C0;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .blacklist-input {
        flex: 1;
        padding: 6px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .blacklist-items {
        max-height: 300px;
        overflow-y: auto;
    }

    .blacklist-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid #eee;
    }

    .blacklist-item:hover {
        background: #f5f5f5;
    }

    .delete-btn {
        color: #ff4444;
        cursor: pointer;
        margin-left: 10px; /* 原样式中的左外边距 */
        position: relative;
        left: -10px; /* 往左移动 10px */
    }
`);

GM_addStyle(`
    /* 调整序号样式 */
    .count-box {
        position: absolute;
    left: 15px;
    top: 50%;
    text-align: center;
    font-size: 25px;

    /* 使用 transform 进行偏移 */
    transform: translate(0%, -50%);
    }
    .page-index {
        font-size: 0.8em;
        color: #999;
        margin-top:10px;
    }
    #float-btn {
        position: fixed;
        right: 20px;
        bottom: 20px;
        padding: 12px 24px;
        background: #2196F3;
        color: white;
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        transition: 0.3s;
    }
    #float-btn:hover {
        background: #1976D2;
        transform: translateY(-2px);
    }
    .filter-page {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 10000;
        overflow-y: auto;
        padding: 20px;
    }
    .work-item {
        display: flex;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #eee;
        gap: 20px;
    }
    .cover-img {
        width: 100px;
        height: 140px;
        object-fit: cover;
        border-radius: 4px;
        margin-left: 35px;
    }
    .tags {
        color: #666;
        font-size: 0.9em;
        margin-top:5px;
        max-width: 600px;
    }
    .count {
        min-width: 80px;
        color: #666;
        font-weight: bold;
    }
    .work-item {
        position: relative;
        padding-left: 100px;
    }
    .title-link {
        color: #2196F3;
        text-decoration: none;
    }
    .title-link:hover {
        text-decoration: underline;
    }
`);
GM_addStyle(`
/* 心愿单容器整体样式 */
.wishlist-container {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    background: #f8f9fa;
}

/* 单个活动条目样式 */
.wishlist-event {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    margin: 8px 0;
    background: white;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s;
}

.wishlist-event:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* 活动名称样式 */
.wishlist-event-name {
    flex: 1;
    font-weight: 500;
    color: #2c3e50;
    font-size: 14px;
    margin-right: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 通用按钮基础样式 */
.wishlist-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 5px;
    margin-bottom: 5px;
}

/* 删除按钮特定样式 */
.del_wish_button {
    background: #ff4757;
    color: white;
    min-width: 70px;
}

.del_wish_button:hover {
    background: #ff6b81;
    transform: translateY(-1px);
}

/* 添加按钮特定样式 */
.add_wish_button {
    background: #2ecc71;
    color: white;
    min-width: 100px;
}

.add_wish_button:hover {
    background: #27ae60;
    transform: translateY(-1px);
}

/* 按钮图标样式 */
.wishlist-btn::before {
    content: '';
    display: inline-block;
    width: 14px;
    height: 14px;
    background-size: contain;
}

.del_wish_button::before {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>');
}

.add_wish_button::before {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>');
}
`);