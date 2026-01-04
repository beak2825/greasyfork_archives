// ==UserScript==
// @name         FC2PPVDB 自動搜尋並添加鏈接 (選單OO版)
// @namespace    fc2ppvdb_ASVL
// @version      3.1.0
// @description  自動搜尋多個網站，並在頁面左側添加可拖動的選單，控制哪些網站參與搜索（使用OO設計方法）。
// @author       jjbigjj
// @match        *://*.fc2ppvdb.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-end
// @connect      123av.com
// @connect      missav.com
// @connect      7mmtv.sx
// @connect      javfc2.xyz
// @connect      sukebei.nyaa.si
// @connect      supjav.com
// @connect      3xplanet.com
// @downloadURL https://update.greasyfork.org/scripts/522611/FC2PPVDB%20%E8%87%AA%E5%8B%95%E6%90%9C%E5%B0%8B%E4%B8%A6%E6%B7%BB%E5%8A%A0%E9%8F%88%E6%8E%A5%20%28%E9%81%B8%E5%96%AEOO%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522611/FC2PPVDB%20%E8%87%AA%E5%8B%95%E6%90%9C%E5%B0%8B%E4%B8%A6%E6%B7%BB%E5%8A%A0%E9%8F%88%E6%8E%A5%20%28%E9%81%B8%E5%96%AEOO%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 浮動選單類
     * 負責創建、拖動、展開/收起功能
     */
    class FloatingMenu {
        constructor(titleText) {
            this.menu = null; // 主選單容器
            this.title = null; // 選單標題
            this.content = null; // 選單內容
            this.isDragging = false; // 是否正在拖動
            this.offsetX = 0; // 拖動的水平偏移
            this.offsetY = 0; // 拖動的垂直偏移

            this.createMenu(titleText);
        }

        /**
         * 創建選單
         * @param {string} titleText - 選單標題文字
         */
        createMenu(titleText) {
            // 主容器
            this.menu = document.createElement("div");
            this.menu.id = "floating-menu";
            this.menu.style.position = "fixed";
            this.menu.style.top = "50%";
            this.menu.style.left = "0";
            this.menu.style.transform = "translateY(-50%)";
            this.menu.style.width = "200px";
            this.menu.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            this.menu.style.color = "white";
            this.menu.style.padding = "10px";
            this.menu.style.borderRadius = "0 10px 10px 0";
            this.menu.style.zIndex = "10000";
            this.menu.style.cursor = "grab";
            this.menu.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            document.body.appendChild(this.menu);

            // 標題
            this.title = document.createElement("div");
            this.title.textContent = titleText;
            this.title.style.fontWeight = "bold";
            this.title.style.marginBottom = "10px";
            this.title.style.cursor = "pointer";
            this.title.style.textAlign = "center";
            this.menu.appendChild(this.title);

            // 內容區域
            this.content = document.createElement("div");
            this.content.style.display = "none"; // 默認隱藏
            this.menu.appendChild(this.content);

            // 綁定事件
            this.addEventListeners();
        }

        /**
         * 綁定選單事件
         */
        addEventListeners() {
            // 點擊標題展開/收起內容
            this.title.addEventListener("click", () => {
                const isHidden = this.content.style.display === "none";
                this.content.style.display = isHidden ? "block" : "none";
            });

            // 拖動事件
            this.menu.addEventListener("mousedown", (e) => {
                this.isDragging = true;
                this.offsetX = e.clientX - this.menu.getBoundingClientRect().left;
                this.offsetY = e.clientY - this.menu.getBoundingClientRect().top;
                this.menu.style.cursor = "grabbing";
            });

            document.addEventListener("mousemove", (e) => {
                if (this.isDragging) {
                    this.menu.style.left = `${e.clientX - this.offsetX}px`;
                    this.menu.style.top = `${e.clientY - this.offsetY}px`;
                    this.menu.style.transform = "none";
                }
            });

            document.addEventListener("mouseup", () => {
                this.isDragging = false;
                this.menu.style.cursor = "grab";
            });
        }

        /**
         * 添加內容到選單
         * @param {HTMLElement} element - 要添加的內容
         */
        addContent(element) {
            this.content.appendChild(element);
        }
    }

    /**
     * 單個網站類
     */
    class Site {
        constructor(name, searchUrlFunc, responseHandler, buttonColor, queryInterval = 1, maxConcurrentSearches = 3) {
            this.name = name;
            this.searchUrlFunc = searchUrlFunc;
            this.responseHandler = responseHandler;
            this.buttonColor = buttonColor;
            this.queryInterval = queryInterval;
            this.maxConcurrentSearches = maxConcurrentSearches;
            this.queue = [];
            this.isSearching = 0;
        }

        addToQueue(id, element) {
            this.queue.push({ id, element });
            if (this.isSearching < this.maxConcurrentSearches) {
                this.processQueue();
            }
        }

        async processQueue() {
            while (this.queue.length > 0 && this.isSearching < this.maxConcurrentSearches) {
                const { id, element } = this.queue.shift();
                this.isSearching++;
                try {
                    await this.search(id, element);
                } finally {
                    this.isSearching--;
                    await new Promise(resolve => setTimeout(resolve, this.queryInterval));
                }
            }
        }

        async search(id, element) {
            const cacheKey = `${this.name}_${id}`; // 緩存鍵
            const cachedResult = await Utils.getCachedResult(cacheKey); // 嘗試從緩存攞數據
            if (cachedResult) {
                if (cachedResult.url) {
                    this.addButton(element, cachedResult.url); // 如果緩存有 URL，直接生成按鈕
                }
                return;
            }

            const searchUrl = this.searchUrlFunc(id); // 生成搜索 URL
            const loadingElement = Utils.showLoading(element, this.name); // 顯示加載提示
            new Promise((resolve, reject) => {
            // 用 GM_xmlhttpRequest 發送搜索請求
            GM_xmlhttpRequest({
                method: "GET",
                url: searchUrl,
                onload: (response) => {
                    let previewData = { url: '' }; // 初始化結果數據
                    this.responseHandler(response, id, previewData); // 調用響應處理函數
                    if (previewData.url) {
                        this.addButton(element, previewData.url); // 如果有搜索結果，生成按鈕
                    }
                    Utils.removeLoading(loadingElement); // 移除加載提示
                    Utils.cacheResult(cacheKey, previewData); // 緩存搜索結果
                },
                onerror: () => {
                    Utils.removeLoading(loadingElement); // 如果出錯，移除加載提示
                    console.error(`${this.name} 搜尋失敗`); // 打印錯誤信息
                },
            });
        })
        }

        addButton(element, url) {
            const button = Utils.createButton(url, this.name, this.buttonColor);
            element.parentElement.parentElement.appendChild(button);
        }
    }

    /**
     * 管理所有網站的類
     */
    class SearchManager {
        constructor() {
            this.sites = [];
        }

        addSite(site) {
            this.sites.push(site);
        }

        async initializeSearch() {
            const elements = document.querySelectorAll("span.absolute.top-0.left-0");
            const activeSites = await this.getActiveSites();
            elements.forEach(element => {
                const id = element.textContent.trim();
                this.sites.forEach(site => {
                    if (activeSites[site.name]) {
                        site.addToQueue(id, element);
                    }
                });
            });
        }

        async getActiveSites() {
            const activeSites = {};
            for (const site of this.sites) {
                activeSites[site.name] = await GM.getValue(`site_${site.name}`, true);
            }
            return activeSites;
        }
    }

    /**
     * 通用工具類
     */
    class Utils {
        // 顯示加載提示
        static showLoading(element, siteName) {
            const loadingText = document.createElement("span");
            loadingText.textContent = `搵緊 ${siteName}...`; // 顯示「搵緊 xxx...」
            loadingText.className = "inline-block text-gray-500 ml-2";
            element.parentElement.parentElement.appendChild(loadingText); // 插入到目標元素嘅父元素
            return loadingText;
        }

        // 移除加載提示
        static removeLoading(loadingElement) {
            if (loadingElement) loadingElement.remove(); // 如果加載提示存在，移除
        }

        // 創建按鈕
        static createButton(url, text, bgColorClass) {
            const linkButton = document.createElement("a"); // 創建一個<a>標籤
            linkButton.href = url; // 設置按鈕嘅鏈接
            linkButton.textContent = text; // 設置按鈕嘅文字
            linkButton.className = `inline-block ${bgColorClass} text-white px-2 py-1 rounded mt-2 ml-2`; // 添加樣式
            linkButton.target = "_blank"; // 新標籤頁打開
            return linkButton;
        }

        // 緩存搜尋結果（非同步）
        static async cacheResult(key, data, expiryHours = 12) {
            const timestamp = new Date().getTime(); // 獲取當前時間
            const expiry = timestamp + expiryHours * 60 * 60 * 1000; // 設置過期時間（12小時後）
            const cacheData = { data, expiry }; // 包裝數據同過期時間
            await GM.setValue(key, cacheData); // 用 GM.setValue 儲存數據（非同步操作）
        }

        // 攞緩存結果（非同步）
        static async getCachedResult(key) {
            const cacheData = await GM.getValue(key, null); // 用 GM.getValue 攞緩存數據（非同步操作）
            if (!cacheData) return null; // 如果無緩存，返 null

            const timestamp = new Date().getTime(); // 獲取當前時間
            if (cacheData.expiry < timestamp) {
                await GM.setValue(key, null); // 如果過期，清空緩存
                return null;
            }
            return cacheData.data; // 如果未過期，返返數據
        }
    }

    // 創建 SearchManager 實例
    const manager = new SearchManager();

    // 添加各個網站
    manager.addSite(new Site(
        '_123av',
        id => `https://123av.com/zh/search?keyword=${id}`,
        (response, id, previewData) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const videoCount = doc.querySelector(".text-muted")?.textContent.trim();
            if (videoCount && videoCount !== "0 视频") {
                previewData.url = `https://123av.com/zh/search?keyword=${id}`;
            }
        },
        'bg-blue-500'
    ));

    manager.addSite(new Site(
        'MissAV',
        id => `https://missav.com/search/${id}`,
        (response, id, previewData) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const matchingLink = Array.from(doc.querySelectorAll('a[alt]')).find(a => {
                const altText = a.getAttribute('alt').toLowerCase();
                const linkText = a.textContent.toLowerCase();
                return altText.includes(id.toLowerCase()) && linkText.includes(id.toLowerCase());
            });
            if (matchingLink) {
                previewData.url = `https://missav.com/search/${id}`;
            }
        },
        'bg-green-500'
    ));

    manager.addSite(new Site(
        '7MMTV',
        id => `https://7mmtv.sx/zh/searchform_search/all/index.html?search_keyword=${encodeURIComponent(id)}&search_type=searchall&op=search`,
        (response, id, previewData) => {
            const responseText = response.responseText;
            const matchResult = responseText.match(new RegExp(`搜索 "${id}" \\((\\d+)\\)`));
            if (matchResult && parseInt(matchResult[1]) > 0) {
                previewData.url = `https://7mmtv.sx/zh/searchform_search/all/index.html?search_keyword=${encodeURIComponent(id)}`;
            }
        },
        'bg-red-500'
    ));

    manager.addSite(new Site(
        'JAVFC2',
        id => `https://javfc2.xyz/search?q=${id}`,
        (response, id, previewData) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const nothingFound = Array.from(doc.querySelectorAll('h4')).find(h4 => h4.textContent.includes("Nothing found by"));
            if (!nothingFound) {
                previewData.url = `https://javfc2.xyz/search?q=${id}`;
            }
        },
        'bg-purple-500'
    ));

    manager.addSite(new Site(
        'Sukebei',
        id => `https://sukebei.nyaa.si/?page=rss&q=${encodeURIComponent(id)}&c=0_0&f=0`,
        (response, id, previewData) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/xml");
            const items = doc.querySelectorAll("item");
            if (items.length > 0) {
                previewData.url = `https://sukebei.nyaa.si/?f=0&c=0_0&q=${encodeURIComponent(id)}&s=seeders&o=desc`;
            }
        },
        'bg-yellow-500',
      1000
    ));

    manager.addSite(new Site(
        'SupJav',
        id => `https://supjav.com/?s=${id}`,
        (response, id, previewData) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const h1Element = doc.querySelector("h1");
            if (h1Element && h1Element.textContent.includes(`Search Result For: ${id}`)) {
                const resultCount = h1Element.textContent.match(/\((\d+)\)/);
                if (resultCount && parseInt(resultCount[1]) > 0) {
                    previewData.url = `https://supjav.com/?s=${id}`;
                }
            }
        },
        'bg-orange-500'
    ));

 manager.addSite(new Site(
        '3xplanet',
        id => `https://3xplanet.com/?s=${id}`,
        (response, id, previewData) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const noResults = doc.querySelector("h2");
            if (!noResults || !noResults.textContent.includes("No results for your search")) {
                previewData.url = `https://3xplanet.com/?s=${id}`;
            }
        },
        'bg-gray-500'
    ));


    // 創建浮動選單
    const floatingMenu = new FloatingMenu("搜尋開關");

    // 添加網站開關
    (async () => {
        const activeSites = await manager.getActiveSites();
        for (const site of manager.sites) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `checkbox_${site.name}`;
            checkbox.checked = activeSites[site.name];
            checkbox.style.marginRight = "5px";

            checkbox.addEventListener("change", async () => {
                await GM.setValue(`site_${site.name}`, checkbox.checked);
            });

            const label = document.createElement("label");
            label.textContent = site.name;
            label.htmlFor = `checkbox_${site.name}`;
            label.style.cursor = "pointer";

            const container = document.createElement("div");
            container.appendChild(checkbox);
            container.appendChild(label);
            floatingMenu.addContent(container);
        }
    })();

    // 開始搜索
    manager.initializeSearch();
})();