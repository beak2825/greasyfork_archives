// ==UserScript==
// @name         AV番號標記與預覽和搜尋
// @namespace https://greasyfork.org/users/681644
// @version      2.9.0
// @description  高亮AV NUMBER，顯示預覽圖和搜尋，自動檢查站點有無番號,新增站點為圖片來源
// @author       kater4343587
// @match        *://**/*
// @exclude      http*://mybidu.ruten.com.*/*
// @exclude      http*://*.bid.yahoo.com/myauc*
// @exclude      http*://*.bid.yahoo.com/partner/*
// @exclude      http*://*.bid.yahoo.com/chat/*
// @exclude      http*://*.shopee.*/portal/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537871/AV%E7%95%AA%E8%99%9F%E6%A8%99%E8%A8%98%E8%88%87%E9%A0%90%E8%A6%BD%E5%92%8C%E6%90%9C%E5%B0%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/537871/AV%E7%95%AA%E8%99%9F%E6%A8%99%E8%A8%98%E8%88%87%E9%A0%90%E8%A6%BD%E5%92%8C%E6%90%9C%E5%B0%8B.meta.js
// ==/UserScript==

(function () {

    'use strict';

    // 存儲自訂域名的鍵名
    const CUSTOM_DOMAINS_KEY = 'customConnectDomains';
    const HOVER_DOMAINS_KEY = 'hoverConnectDomains';
    const LEARNED_DOMAINS_KEY = 'learnedDomains';

    const defaultSettings = {
        closeOnWheel: true,
        imagePositionX: '70%',
        imagePositionY: '70%',
        highlightColor: '#cffe81',
        hoverDelay: 900,
        previewWidth: 600,
        followMouse: true,
        parallelLinkSearch : true,
        simpleSearch: true, // 新增精簡搜尋設定
        simpleSearchTiers: [
        ['123', 'HD', 'MISSAV', 'JAVTRAILERS'],// 第一層
        ['NF', 'PORNAV', 'MOST', 'NEON', 'TK','FBT','BUS','MENU'],// 第二層
        ['nyaa', 'OneJAV']// 第三層
        ],
        trustedPreviewSources: ['JAV321', 'JAVDB', 'HD', 'PORNAV', 'JAVTRAILERS','OneJAV','JAVTRAILERS'], //信任該網站跳過圖片驗證
        hoverFuzzySearch: false, // 新增模糊搜尋開關
        previewImageOrder: [],
        disabledPreviewSources: [] // 被丟棄的站點
    };

    //===========================
    let GLOBAL_PREVIEW_SOURCES = [
        //默認來源
        {
            name: 'JAV321',
            get: async (id) => {
                const site = SITES.find(s => s.name === 'JAV321');
                return site?.getPreviewImage?.(id);
            }
        },
        {
            name: 'OneJAV',
            get: async (id) => {
                const site = SITES.find(s => s.name === 'OneJAV');
                return site?.getPreviewImage?.(id);
            }
        },
        {
            name: 'HD',
            get: async (id) => {
                const site = SITES.find(s => s.name === 'HD');
                return site?.getPreviewImage?.(id);
            }
        },
        {
            name: 'JAVDB',
            get: async (id) => {
                const site = SITES.find(s => s.name === 'JAVDB');
                return site?.getPreviewImage?.(id);
            }
        },
        {
            name: 'PORNAV',
            get: async (id) => {
                const site = SITES.find(s => s.name === 'PORNAV');
                return site?.getPreviewImage?.(id);
            }
        },
        {
            name: 'JAV-Angel', //只抓圖不做處理
            get: async (id) => {
                const site = SITES.find(s => s.name === 'JAV-Angel');
                return site?.getPreviewImage?.(id);
            }
        },
        {
            name: 'MENU',
            get: async (id) => {
                const site = SITES.find(s => s.name === 'MENU');
                return site?.getPreviewImage?.(id);
            }
        },
        {
            name: 'JAVTRAILERS',
            get: async (id) => {
                const site = SITES.find(s => s.name === 'JAVTRAILERS');
                return site?.getPreviewImage?.(id);
            }
        },
        {
            name: 'JABLE',
            get: async (id) => {
                const site = SITES.find(s => s.name === 'JABLE');
                return site?.getPreviewImage?.(id);
            }
        },
        {
            name: 'HOVER',
            get: async (id) => {
                const vrElement = document.querySelector(`.highlight-vr[data-id*="${id}"]`);
                return vrElement ? getImageFromHoveredLink(vrElement, id) : null;
            }
        }
    ];

    // 遷移舊設定（僅運行一次）
    if (!GM_getValue('hasMigratedPreviewSourcesOrder')) {
        const oldSources = GLOBAL_PREVIEW_SOURCES.map(s => s.name);
        GM_setValue('previewSourcesOrder', oldSources);
        GM_setValue('hasMigratedPreviewSourcesOrder', true);
    }

    // 預定義的安全域名列表
    const predefinedDomains = [
        'jav321.com',
        '123av.com',
        'javdb.com',
        'jav-angel.net',
        'missav.ai',
        'javhdporn.net',
        'www4.javhdporn.net',
        'pics.pornfhd.com',
        '3xplanetimg2.com',
        'www1.123av.com',
        'javmenu.com',
        'jdbstatic.com',
        'jable.tv',
        'assets-cdn.jable.tv',
        'pornav.co',
        'static.pornav.co',
        'javtrailers.com',
        'tktube.com',
        'freejavbt.com',
        'javbus.com',
        'sukebei.nyaa.si',
        'javneon.tv',
        'netflav.com',
        'javmost.com',
        'disqus.com',
        'onejav.com',
        'jav321.disqus.com'
    ];

     // 常見圖片CDN模式
    const IMAGE_CDN_PATTERNS = [
        /(cdn|img|images|static|assets|pic|pics|photo|photos|image|media|content|res|resource)/i,
        /\.(s3\.amazonaws\.com)$/i,
        /\.(cloudfront\.net)$/i,
        /\.(akamaihd\.net)$/i,
        /\.(cloudinary\.com)$/i
    ];

    // 從存儲中獲取域名列表
    let customDomains = GM_getValue(CUSTOM_DOMAINS_KEY, []);
    let hoverDomains = GM_getValue(HOVER_DOMAINS_KEY, []);
    let learnedDomains = GM_getValue(LEARNED_DOMAINS_KEY, {});

    // 提取域名函數
    function extractDomain(url) {
  if (!url || typeof url !== 'string') {
    console.warn('extractDomain 收到無效URL:', url);
    return 'unknown';
  }
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch (e) {
    console.warn('URL解析失敗:', url, e);
    // 嘗試從字符串中提取域名
    const match = url.match(/^(https?:\/\/)?([^/?#]+)/i);
    return match ? match[2] : 'unknown';
  }
}


    // 檢查是否為圖片CDN
    function isImageCDN(domain) {
        return IMAGE_CDN_PATTERNS.some(pattern => pattern.test(domain));
    }

     // 增強型安全請求封裝函數
    function safeRequest(options) {
        // 獲取請求的網站名稱（從options.context或URL解析）
        const siteName = options.context || extractDomain(options.url).replace(/^www\./, '');
        const domain = extractDomain(options.url);
        if (!domain) {
            if (options.onerror) {
                options.onerror({status: 403, statusText: 'Invalid domain'});
            }
            return null;
        }

        // 檢查請求上下文 (HOVER功能專用)
        const isHoverRequest = options.context === 'HOVER';

        // 檢查域名是否允許
        if (isDomainAllowed(domain, isHoverRequest)) {
            return GM_xmlhttpRequest(options);
        }

        console.warn(`已阻止對未授權域名的請求: ${options.url}`);
        if (options.onerror) {
            options.onerror({status: 403, statusText: 'Forbidden: Domain not allowed'});
        }
        return null;
    }

     // 增強型域名檢查
    function isDomainAllowed(domain, isHoverRequest = false) {
//===========================================================================
        /*console.log(`檢查域名: ${domain}`, {
        predefined: predefinedDomains,
        custom: customDomains,
        hover: hoverDomains
    }); */ //找域名時再用
//===================================================================================
        if (!domain) return false;

        // 允許所有域名（如果設置了通配符）
        if (customDomains.includes('*')) {
            return true;
        }

        // 檢查預定義域名
        if (predefinedDomains.includes(domain)) return true;

        // 檢查自訂域名
        if (customDomains.includes(domain)) return true;

        // 檢查子域名（例如 xxx.javdb.com）
        for (const allowed of [...predefinedDomains, ...customDomains]) {
            if (domain.endsWith(`.${allowed}`)) {
            return true;
            }
        }

        // HOVER功能專用檢查
        if (isHoverRequest) {
            // 檢查HOVER專用域名
            if (hoverDomains.includes(domain)) return true;

            // 檢查學習的域名 (有效期內)
            if (learnedDomains[domain] && learnedDomains[domain] > Date.now()) return true;

            // 檢查常見圖片CDN
            if (isImageCDN(domain)) return true;
        }

        return false;
    }

    // 在新增站點時自動添加域名
    function addDomainForSite(siteUrl) {
    const domain = extractDomain(siteUrl);
    if (!domain) return;

    // 如果已有通配符，則不再添加新域名
    if (customDomains.includes('*')) return;

    if (!customDomains.includes(domain)) {
        customDomains.push(domain);
        GM_setValue(CUSTOM_DOMAINS_KEY, customDomains);
        console.log(`已添加新域名到安全列表: ${domain}`);
    }
    }
    function getAvailableSources() {
    // 所有可能的來源（排除已在順序列表或丟棄區的）
    const allSources = GLOBAL_PREVIEW_SOURCES.map(s => s.name);
    const usedSources = [
        ...settings.previewImageOrder,
        ...settings.disabledPreviewSources
    ];
    return allSources.filter(source => !usedSources.includes(source));
}

    // 合併使用者儲存值
const settings = Object.fromEntries(
    Object.entries(defaultSettings).map(([k, v]) => [k, GM_getValue(k, v)])
);

GM_registerMenuCommand('🔧 信任圖片來源設定（勾選）', function() {
    try {
        // 移除現有的設定面板（如果存在）
        const existingWrapper = document.getElementById('trustedSourcesWrapper');
        if (existingWrapper) {
            existingWrapper.remove();
        }

        const wrapper = document.createElement('div');
        wrapper.id = 'trustedSourcesWrapper';
        Object.assign(wrapper.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            border: '2px solid #666',
            padding: '20px 24px',
            zIndex: '99999',
            fontSize: '14px',
            lineHeight: '1.5',
            maxWidth: '320px',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            borderRadius: '10px',
            fontFamily: 'sans-serif'
        });

        const current = new Set(GM_getValue('trustedPreviewSources', []));
        const checkboxList = document.createElement('div');
        checkboxList.style.marginBottom = '16px';

        // 確保allSources已定義
        const allSources = GLOBAL_PREVIEW_SOURCES.map(s => s.name);

        allSources.forEach(src => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '10px';
            label.style.margin = '6px 0';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = src;
            checkbox.checked = current.has(src);

            const text = document.createElement('span');
            text.textContent = src;
            text.style.fontWeight = 'bold';

            label.appendChild(checkbox);
            label.appendChild(text);
            checkboxList.appendChild(label);
        });

        const title = document.createElement('h3');
        title.textContent = '選擇信任圖片來源：';
        Object.assign(title.style, {
            margin: '0 0 12px',
            fontSize: '16px',
            fontWeight: 'bold'
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '10px';

        const confirmBtn = document.createElement('button');
        confirmBtn.id = 'confirmTrustSources';
        confirmBtn.textContent = '✅ 確定';
        Object.assign(confirmBtn.style, {
            padding: '6px 14px',
            background: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancelTrustSources';
        cancelBtn.textContent = '取消';
        Object.assign(cancelBtn.style, {
            padding: '6px 14px',
            background: '#e0e0e0',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
        });

        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        wrapper.appendChild(title);
        wrapper.appendChild(checkboxList);
        wrapper.appendChild(buttonContainer);

        // 添加到body
        document.body.appendChild(wrapper);

        // 確保點擊事件綁定正確
        confirmBtn.onclick = function() {
            try {
                const checkboxes = wrapper.querySelectorAll('input[type=checkbox]:checked');
                const checked = Array.from(checkboxes).map(c => c.value);
                GM_setValue('trustedPreviewSources', checked);
                wrapper.remove();
                alert('已更新信任來源：' + checked.join(', '));
                location.reload();
            } catch (e) {
                console.error('保存信任來源時出錯:', e);
                alert('保存失敗，請查看控制台獲取詳細信息');
            }
        };

        cancelBtn.onclick = function() {
            wrapper.remove();
        };

        // 點擊外部關閉
        wrapper.addEventListener('click', function(e) {
            if (e.target === wrapper) {
                wrapper.remove();
            }
        });

    } catch (error) {
        console.error('創建信任來源UI時出錯:', error);
        alert('創建設定UI時出錯，請查看控制台獲取詳細信息');
    }
});
    let SITES = [
    {
        name: 'JAV321',
        url: id => `https://www.jav321.com/video/${transformId(id)}`,
        keyword: ['video-info', 'col-md-9'],
        checkAvailability: async function(id) {
        const defaultResult = await defaultSiteCheck(
            { ...this, keyword: ['video-info', 'col-md-9'] }, // 臨時注入關鍵詞
            id
        );
            if (defaultResult) return true;
        },
        getPreviewImage: function(id) {
            return new Promise((resolve) => {
                safeRequest({
                    method: "GET",
                    url: this.url(id),
                    timeout: 2000,
                    onload: function(response) {
                        try {
                            const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                            const img = doc.querySelector('.col-xs-12.col-md-12 img');
                            resolve(img?.src || null);
                        } catch (e) {
                            console.log('[JAV321] 解析錯誤:', e);
                            resolve(null);
                        }
                    },
                    onerror: function() {
                        resolve(null);
                    }
                });
            });
        },
        getVideoInfo: async function(id) {
        return new Promise((resolve) => {
            safeRequest({
                method: "GET",
                url: this.url(id),
                timeout: 2000,
                onload: function(response) {
                    try {
                        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                        const infoDiv = doc.querySelector('.col-md-9');
                        if (!infoDiv) {
                            console.log('[JAV321] 未找到影片資訊元素');
                            return resolve(null);
                        }

                        // 直接返回原始 HTML，讓 formatVideoInfo 處理
                        resolve(infoDiv.innerHTML);
                    } catch (e) {
                        console.log('[JAV321] 解析錯誤:', e);
                        resolve(null);
                    }
                },
                onerror: function() {
                    resolve(null);
                }
            });
        });
    }
},
    {
        name: 'OneJAV',
        url: id => `https://onejav.com/search/${id}`,
        keyword: 'card mb-3',
        getPreviewImage: function(id) {
            return new Promise((resolve) => {
                safeRequest({
                    method: "GET",
                    url: this.url(id),
                    timeout: 3000,
                    onload: (response) => {
                    try {
                        const html = response.responseText;
                        const normalizedId = id.replace(/-/g, '').toLowerCase();
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');
                            const images = doc.querySelectorAll('.card .image[src*="/mono/movie/"]');
                            for (const image of images) {
                                if (image && image.src) {
                                    const imgSrc = image.src.toLowerCase();
                                    if (imgSrc.includes(normalizedId)) {
                                        return resolve(image.src);
                                    }
                                }
                            }
                        resolve(null);
                    } catch (e) {
                        console.log('[ONEJAV] 解析錯誤:', e);
                        resolve(null);
                    }
                },
                onerror: () => resolve(null)
            });
        });
    },
        checkAvailability: async function(id) {
            const defaultResult = await defaultSiteCheck(
                { ...this, keyword: ['card mb-3'] }, // 臨時注入關鍵詞
                id
            );
            if (defaultResult) return true;
        }
    },
    {
        name: '123',
        url: id => `https://123av.com/en/search?keyword=${id}`,
        checkAvailability: function(id) {
            return new Promise((resolve) => {
                const url = this.url(id);

                // 強制使用 HTTPS 並移除 www1 子網域
                const safeUrl = url.replace('http://', 'https://')
                                 .replace('www1.', '');

                safeRequest({
                    method: "GET",
                    url: safeUrl,
                    timeout: 3000,
                    onload: function(response) {
                        try {
                            const html = response.responseText;
                            const idRegex = new RegExp(id.replace(/-/g, '[-\\s]?'), 'i');

                            // 快速檢查頁面是否包含番號
                            if (!idRegex.test(html)) {
                                return resolve(false);
                            }

                            // 詳細檢查影片條目
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');
                            const videoLinks = doc.querySelectorAll('.box-item .detail a');

                            for (const link of videoLinks) {
                                if (link.textContent && idRegex.test(link.textContent)) {
                                    console.log('[123AV] 找到匹配番號:', link.textContent.trim());
                                    return resolve(true);
                                }
                            }
                            resolve(false);
                        } catch (e) {
                            console.log('[123AV] 解析錯誤:', e);
                            resolve(false);
                        }
                    },
                    onerror: function() {
                        console.log('[123AV] 請求失敗:', safeUrl);
                        resolve(false);
                    },
                    ontimeout: function() {
                        console.log('[123AV] 請求超時:', safeUrl);
                        resolve(false);
                    }
                });
            });
        }
    },
     {
    name: 'JAVTRAILERS',
    url: id => `https://javtrailers.com/video/${transformId(id)}`,
    searchUrl: id => `https://javtrailers.com/search/${id}`,
    keyword: 'DVD ID:',
    checkAvailability: function(id) {
        return new Promise((resolve) => {
            safeRequest({
                method: "GET",
                url: this.url(id),
                timeout: 3000,
                onload: function(response) {
                    try {
                        const hasResults = response.responseText.includes('DVD ID:');
                        resolve(hasResults);
                    } catch (e) {
                        console.log('[JAVTRAILERS] 檢查錯誤:', e);
                        resolve(false);
                    }
                },
                onerror: function() {
                    resolve(false);
                }
            });
        });
    }, //只能取小圖
    getPreviewImage: function(id) {
        return new Promise((resolve) => {
            safeRequest({
                method: "GET",
                url: this.searchUrl(id),
                timeout: 3000,
                onload: function(searchResponse) {
                    try {
                        const doc = new DOMParser().parseFromString(searchResponse.responseText, 'text/html');
                        const videoCards = doc.querySelectorAll('.card.video-card');
                        // 正規化番號 (移除 - 並轉小寫)
                        const normalizedId = id.replace(/-/g, '').toLowerCase();
                        for (const card of videoCards) {
                            const titleElement = card.querySelector('.card-text.title.mb-0.vid-title');
                            if (titleElement) {
                                const titleText = titleElement.textContent;
                                // 檢查標題是否包含番號
                                if (titleText.replace(/-/g, '').toLowerCase().includes(normalizedId)) {
                                    // 找到匹配的卡片，獲取圖片
                                    const img = card.querySelector('img[data-src]');
                                    if (img) {
                                        return resolve(img.dataset.src);
                                    }
                                }
                            }
                        }
                        resolve(null);
                    } catch (e) {
                        console.log('[JAVTRAILERS] 搜索頁解析錯誤:', e);
                        resolve(null);
                    }
                },
                onerror: function() {
                    resolve(null);
                }
            });
        });
    },
         getVideoInfo: async function(id) {
            return fetchVideoInfo(this.url(id), '.col-md-9');
        }
     },
    {
        name: 'MISSAV',
        url: id => `https://missav.ai/search/${id}`,
        keyword:"event: 'videoSearch'",
        checkAvailability:  async function(id) {
        const defaultResult = await defaultSiteCheck(
            { url: id => `https://missav.ai/search/${id}`, keyword: ["event: 'videoSearch'"] }, // 臨時注入關鍵詞
            id
        );
            if (defaultResult) return true;
        }
        },
    {
        name: 'MOST',
        url: id => `https://www5.javmost.com/search/${id}`,
        checkAvailability: function(id) {
        return new Promise((resolve) => {
            const url = this.url(id);
            safeRequest({
                method: "GET",
                url,
                timeout: 3000,
                onload: function(response) {
                    try {
                        // 確保 responseText 存在
                        const html = response.responseText || '';

                        // 檢查是否有 "( Result 0 )" 文字
                        if (html.includes('( Result 0 )')) {
                            console.log(`[JAVMOST] 無結果 (Result 0) 對於番號 ${id}`);
                            return resolve(false);
                        }

                        // 檢查是否有有效結果
                        const hasResults = !html.includes('No results found') &&
                                         html.includes('card-title') &&// 直接使用關鍵字
                                         !html.includes('Search Results for:');
                        resolve(hasResults);
                    } catch (e) {
                        console.log('[JAVMOST] 檢查錯誤:', e);
                        resolve(false);
                    }
                },
                onerror: function() {
                    resolve(false);
                },
                ontimeout: function() {
                    console.log('[JAVMOST] 請求超時');
                    resolve(false);
                }
            });
        });
    }
},
    {
        name: 'NF',
        url: id => `https://netflav.com/search?type=title&keyword=${id}`,
        checkAvailability: async function(id) {
            return new Promise((resolve) => {
                safeRequest({
                    method: "GET",
                    url: this.url(id),
                    timeout: 3000,
                    onload: (response) => {
                        try {
                            const html = response.responseText;

                            // 1. 檢查是否有"找不到相關結果"的提示
                            if (html.includes("找不到相關結果")) {
                                console.log('[NF] 無搜尋結果');
                                return resolve(false);
                            }

                            // 2. 解析HTML
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');

                            // 3. 獲取所有標題元素
                            const titles = doc.querySelectorAll('.grid_0_title');
                            if (titles.length === 0) {
                                console.log('[NF] 未找到影片標題元素');
                                return resolve(false);
                            }

                            // 4. 創建匹配番號的正則表達式（忽略大小寫和特殊符號）
                            const normalizedId = id.replace(/[-_]/g, '[-_\\s]?');
                            const idRegex = new RegExp(normalizedId, 'i');

                            // 5. 檢查每個標題是否匹配番號
                            for (const title of titles) {
                                if (title.textContent && idRegex.test(title.textContent)) {
                                    console.log('[NF] 找到匹配番號:', title.textContent.trim());
                                    return resolve(true);
                                }
                            }

                            console.log('[NF] 標題中未找到匹配番號');
                            resolve(false);
                        } catch (e) {
                            console.log('[NF] 解析錯誤:', e);
                            resolve(false);
                        }
                    },
                    onerror: () => {
                        console.log('[NF] 請求失敗');
                        resolve(false);
                    }
                });
            });
        },
    },
    {
        name: 'HD',
        url: id => `https://www4.javhdporn.net/search/${id}`,
        keyword: 'Search Results for: ',
        getPreviewImage: function(id) {
            return new Promise((resolve) => {
                // 第一步：獲取搜索頁面
                safeRequest({
                    method: "GET",
                    url: this.url(id),
                    timeout: 3000,
                    onload: (searchResponse) => {
                        try {
                            const searchText = searchResponse.responseText;

                            // 檢查是否無結果
                            if (searchText.includes('Nothing found')) {
                                console.log('[HD] 找不到番號');
                                return resolve(null);
                            }

                            const searchDoc = new DOMParser().parseFromString(searchText, 'text/html');
                            const detailLink = searchDoc.querySelector('a.archive-entry');

                            if (!detailLink?.href) {
                                return resolve(null);
                            }

                            // 第二步：獲取詳細頁面
                            safeRequest({
                                method: "GET",
                                url: detailLink.href,
                                timeout: 3000,
                                onload: (detailResponse) => {
                                    try {
                                        const detailDoc = new DOMParser().parseFromString(detailResponse.responseText, 'text/html');

                                        // 優先獲取 data-404-fallback 圖片
                                        const fallbackImg = detailDoc.querySelector('img[data-404-fallback]');
                                        if (fallbackImg?.getAttribute('data-404-fallback')) {
                                            return resolve(fallbackImg.getAttribute('data-404-fallback'));
                                        }

                                        // 次選常規圖片
                                        const imgElement = detailDoc.querySelector('img.data-no-lazy.lazyloaded');
                                        resolve(imgElement?.src || null);
                                    } catch (e) {
                                        console.log('[HD] 詳細頁面解析錯誤:', e);
                                        resolve(null);
                                    }
                                },
                                onerror: () => resolve(null)
                            });
                        } catch (e) {
                            console.log('[HD] 搜尋頁面解析錯誤:', e);
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null)
                });
            });
        },
        checkAvailability: function(id) {
            return new Promise((resolve) => {
                safeRequest({
                    method: "GET",
                    url: this.url(id),
                    timeout: 3000,
                    onload: (response) => {
                        try {
                            const hasResults = !response.responseText.includes('Nothing found') &&
                                             !response.responseText.includes('search-field');
                            resolve(hasResults);
                        } catch (e) {
                            console.log('[HD] Availability check error:', e);
                            resolve(false);
                        }
                    },
                    onerror: () => resolve(false)
                });
            });
        }
    },
{
    name: 'PORNAV',
    url: id => `https://pornav.co/en/search?q=${encodeURIComponent(id)}`,
    searchItems: function(id) {
        return new Promise((resolve) => {
            safeRequest({
                method: "GET",
                url: this.url(id),
                timeout: 3000,
                onload: (response) => {
                    try {
                        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                        const items = doc.querySelectorAll('.cbp-item');
                        const normalizedId = id.toUpperCase().replace(/[-_\s]/g, '');
                        const matchedItems = [];

                        for (const item of items) {
                            const titleElement = item.querySelector('.product-description h3 a');
                            if (!titleElement) continue;

                            const titleText = titleElement.textContent.toUpperCase().replace(/[-_\s]/g, '');

                            // 精確匹配番號
                            if (titleText.includes(normalizedId)) {
                                matchedItems.push(item);
                            }
                        }

                        resolve({
                            items: matchedItems,
                            doc: doc
                        });
                    } catch (e) {
                        console.log('[PORNAV] 解析錯誤:', e);
                        resolve({ items: [] });
                    }
                },
                onerror: () => resolve({ items: [] })
            });
        });
    },

    checkAvailability: async function(id) {
        const result = await this.searchItems(id);
        return result.items.length > 0;
    },

    getPreviewImage: async function(id) {
        const result = await this.searchItems(id);
        if (result.items.length === 0) return null;
        // 取第一個匹配項目的圖片
        const firstItem = result.items[0];
        const imgLink = firstItem.querySelector('a[itemprop="image"]');
        return imgLink?.href || null;
    }
},
    {
        name: 'NEON', //反爬蟲機制嚴格,檢測繞不過去
        url: id => `https://javneon.tv/?s=${id}`,
        keyword: 'name headline',
        checkAvailability:  async function(id) {
            return true;
        }
    },
        {
            name: 'TK',
            url: id => {
                // 特殊處理 FC2-PPV-3949091 → FC2--PPV--3949091
                if (/^FC2-PPV-\d+$/i.test(id)) {
                    return `https://tktube.com/zh/search/${id.replace(/-/g, '--')}/`;
                }
                // 預設處理其他番號（如 FWAY-040 → FWAY--040）
                const tkId = id.replace(/-/, '--');
                return `https://tktube.com/zh/search/${tkId}/`;
            },
            keyword: 'data-preview',
            checkAvailability: function(id) {
                const keyword = this.keyword; // 預先保存關鍵字變數
                const url = this.url(id);
                return new Promise(resolve => {
                    const timeout = setTimeout(() => resolve(null),3000);
                    safeRequest({
                        method: 'HEAD',
                        url,
                        timeout: 3000,
                        onload: headRes => {
                            clearTimeout(timeout);
                            if (headRes.status !== 200) {
                                console.log(`[TK] HTTP ${headRes.status} 錯誤`);
                                return resolve(null);
                            }
                            safeRequest({
                                method: 'GET',
                                url,
                                timeout: 3000,
                                onload: getRes => {
                                    try {
                                        const html = getRes.responseText;
                                        if (html.includes('404 Not Found') ||
                                            html.includes('該列表是空的') ||
                                            html.includes('No results found')) {
                                            console.log('[TK] 找不到番号');
                                            return resolve(false);
                                        }
                                        const hasContent = html.includes('data-preview') ||
                                              html.includes('video-card');

                                        resolve(hasContent);
                                    } catch (e) {
                                        console.log('[TK] 解析錯誤:', e);
                                        resolve(false);
                                    }
                                },
                                onerror: () => resolve(false),
                                ontimeout: () => {
                                    console.log('[TK] 請求超時');
                                    resolve(false);
                                }
                            });
                        },
                        onerror: () => resolve(false),
                        ontimeout: () => {
                            console.log('[TK] HEAD請求超時');
                            resolve(false);
                        }
                    });
                })
            }},
    {
        name: 'nyaa',
        url: id => `https://sukebei.nyaa.si/?f=0&c=2_2&q=${id}`,
        keyword: 'table-responsive',
        checkAvailability:  async function(id) {
        const url = `https://sukebei.nyaa.si/?f=0&c=2_2&q=${id}`;
            return new Promise(resolve => {
                const timeout = setTimeout(() => {
                    resolve(false);
                }, 2500);
                GM_xmlhttpRequest({
                    method: 'HEAD',
                    url,
                    onload: res => {
                        clearTimeout(timeout);
                        if (res.status === 200) {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url,
                                onload: res => resolve(res.responseText.includes('table-responsive')),
                                onerror: () => resolve(false)
                            });
                        } else {
                            resolve(false);
                        }
                    },
                    onerror: () => {
                        clearTimeout(timeout);
                        resolve(false);
                    }
                });
            });
        }
    },
    {
    name: 'FBT',
    url: id => `https://freejavbt.com/${id}`,
    keyword: 'single-video-info col-12',
    checkAvailability: async function(id) {
        const defaultResult = await defaultSiteCheck(
            { ...this, keyword: ['single-video-info col-12'] }, // 臨時注入關鍵詞
            id
        );
        if (defaultResult) return true;
    }
},
    // BUS 站點
    {
        name: 'BUS',
        url: id => `https://www.javbus.com/${id}`,
        keyword: 'photo-info',
        checkAvailability:  async function(id) {
        const url = `https://www.javbus.com/${id}`;
            return new Promise(resolve => {
                const timeout = setTimeout(() => {
                    resolve(false);
                }, 2500);
                GM_xmlhttpRequest({
                    method: 'HEAD',
                    url,
                    onload: res => {
                        clearTimeout(timeout);
                        if (res.status === 200) {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url,
                                onload: res => resolve(res.responseText.includes('photo-info')),
                                onerror: () => resolve(false)
                            });
                        } else {
                            resolve(false);
                        }
                    },
                    onerror: () => {
                        clearTimeout(timeout);
                        resolve(false);
                    }
                });
            });
        },
        getPreviewImage: function(id) {return null;},
        getVideoInfo: async function(id) {
            return fetchVideoInfo(this.url(id), '.container .info');
        }
    },
    // MENU 站點
    {
        name: 'MENU',
        url: id => `https://javmenu.com/${id}`,
        keyword: 'col-md-9 px-1 px-md-0',
        checkAvailability: async function(id) {
        // 調用默認檢查函數
        const defaultResult = await defaultSiteCheck(
            { ...this, keyword: ['col-md-9 px-1 px-md-0'] }, // 臨時注入關鍵詞
            id
        );
            if (defaultResult) return true;
        },
        getVideoInfo: async function(id) {
        const info = await fetchVideoInfo(
            this.url(id),
            '.card-body',
            {
                filter: (html) => {
                    return html
                        .replace(/<div class="card-body">[\s\S]*?流量變現[\s\S]*?<\/div>/gi, '')
                        .replace(/<div class="alert[^>]*>[\s\S]*?<\/div>/gi, '');
                }

            }
        );

        if (info && /(番號|品番):\s*\w+/.test(info)) {
            return info;
        }
        return null;
    }

},
    {
    name: 'JAVDB',
    url: id => `https://javdb.com/search?q=${encodeURIComponent(id)}`,
    _requestCount: 0,
    _lastReset: 0,

    canMakeRequest: function() {
        const now = Date.now();
        const oneMinutes = 1 * 60 * 1000; // 1分鐘計數1次

        if (now - this._lastReset > oneMinutes) {
            this._requestCount = 0;
            this._lastReset = now;
        }
        return this._requestCount < 10; // 1分鐘10次限制
    },

    incrementRequestCount: function() {
        const now = Date.now();
        const oneMinutes = 1 * 60 * 1000;

        if (now - this._lastReset > oneMinutes) {
            this._requestCount = 0;
            this._lastReset = now;
        }
        this._requestCount++;
    },

    searchItems: async function(id) {
        if (!this.canMakeRequest()) {
            console.warn('[JAVDB] 請求已達上限，等待1分鐘冷卻');
            throw new Error('RATE_LIMITED');
        }
        this.incrementRequestCount();

        return new Promise((resolve) => {
            safeRequest({
                method: "GET",
                url: this.url(id),
                timeout: 3000,
                onload: (response) => {
                    try {
                        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                        const items = doc.querySelectorAll('.movie-list .item');
                        const normalizedSearchId = id.toUpperCase().replace(/[-_\s]/g, '');

                        const matchedItems = [];
                        for (const item of items) {
                            const titleElement = item.querySelector('.video-title strong');
                            if (!titleElement) continue;

                            const titleText = titleElement.textContent.trim();
                            const codeMatch = titleText.match(/([A-Z]{2,6})[-_]?([A-Z])?(\d{2,5})([A-Z])?/i);
                            if (!codeMatch) continue;

                            const foundCode = (
                                codeMatch[1] +
                                (codeMatch[2] || '') +
                                codeMatch[3] +
                                (codeMatch[4] || '')
                            ).toUpperCase();

                            if (foundCode === normalizedSearchId) {
                                matchedItems.push({
                                    element: item,
                                    doc: doc
                                });
                            }
                        }
                        resolve(matchedItems);
                    } catch (e) {
                        console.log('[JAVDB] 解析錯誤:', e);
                        resolve([]);
                    }
                },
                onerror: () => resolve([])
            });
        });
    },

    checkAvailability: async function(id) {
        try {
            const items = await this.searchItems(id);
            return items.length > 0;
        } catch (error) {
            if (error.message === 'RATE_LIMITED') {
                throw error; // 重新拋出讓上層處理
            }
            console.warn('[JAVDB] 檢查可用性錯誤:', error);
            return false;
        }
    },

    getPreviewImage: async function(id) {
        try {
            const items = await this.searchItems(id);
            if (items.length === 0) return null;

            const item = items[0].element;
            const cover = item.querySelector('.cover img');
            return cover?.src || cover?.dataset.src || null;
        } catch (error) {
            if (error.message === 'RATE_LIMITED') {
                console.log('[JAVDB] 請求已達上限，跳過圖片獲取');
            } else {
                console.warn('[JAVDB] 獲取預覽圖錯誤:', error);
            }
            return null;
        }
    },
},
    {
    name: 'JABLE',
    url: id => `https://jable.tv/search/${id}/`,
    _requestCount: 0,
    _lastReset: 0,

    canMakeRequest: function() {
        const now = Date.now();
        const oneMinutes = 1 * 30 * 1000; // 30秒計數1次

        if (now - this._lastReset > oneMinutes) {
            this._requestCount = 0;
            this._lastReset = now;
        }
        return this._requestCount < 3;
    },

    incrementRequestCount: function() {
        const now = Date.now();
        const oneMinutes = 1 * 30 * 1000;

        if (now - this._lastReset > oneMinutes) {
            this._requestCount = 0;
            this._lastReset = now;
        }

        this._requestCount++;
    },

    searchItems: async function(id) {
        if (!this.canMakeRequest()) {
            console.log('[JABLE] 請求已達上限，等30秒後重置');
            throw new Error('RATE_LIMITED');
        }
        this.incrementRequestCount();

        return new Promise((resolve) => {
            safeRequest({
                method: "GET",
                url: this.url(id),
                timeout: 1500,
                onload: (response) => {
                    try {
                        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                        const titles = doc.querySelectorAll('.title a');
                        const normalizedId = id.toUpperCase().replace(/[-_\s]/g, '');

                        const matchedItems = [];
                        for (const title of titles) {
                            const titleText = title.textContent.toUpperCase().replace(/[-_\s]/g, '');
                            if (titleText.includes(normalizedId)) {
                                matchedItems.push({
                                    element: title.closest('.detail'),
                                    doc: doc
                                });
                            }
                        }
                        resolve(matchedItems);
                    } catch (e) {
                        console.warn('[JABLE] 檢查錯誤:', e);
                        resolve([]);
                    }
                },
                onerror: () => resolve([])
            });
        });
    },

    checkAvailability: async function(id) {
        try {
            const items = await this.searchItems(id);
            return items.length > 0;
        } catch (error) {
            if (error.message === 'RATE_LIMITED') {
                throw error; // 重新拋出讓上層處理
            }
            console.warn('[JABLE] 檢查可用性錯誤:', error);
            return false;
        }
    },

    getPreviewImage: async function(id) {
        try {
            const items = await this.searchItems(id);
            if (items.length === 0) return null;

            const detailLink = items[0].element.querySelector('a');
            if (!detailLink?.href) return null;

            return new Promise((resolve) => {
                safeRequest({
                    method: "GET",
                    url: detailLink.href,
                    timeout: 1500,
                    onload: (detailResponse) => {
                        try {
                            const detailDoc = new DOMParser().parseFromString(detailResponse.responseText, 'text/html');
                            const video = detailDoc.querySelector('video[poster]');
                            if (video?.poster) return resolve(video.poster);

                            const plyrPoster = detailDoc.querySelector('.plyr_poster');
                            if (plyrPoster) {
                                const bgImage = plyrPoster.style.backgroundImage;
                                const urlMatch = bgImage.match(/url\("(.+?)"\)/);
                                if (urlMatch?.[1]) return resolve(urlMatch[1]);
                            }
                            resolve(null);
                        } catch (e) {
                            console.warn('[JABLE] 詳細頁解析錯誤:', e);
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null)
                });
            });
        } catch (error) {
            if (error.message === 'RATE_LIMITED') {
                console.log('[JABLE] 請求已達上限，跳過圖片獲取');
            } else {
                console.warn('[JABLE] 獲取預覽圖錯誤:', error);
            }
            return null;
        }
    }
}

];
//------------獲取影片資訊-------------------
async function fetchVideoInfo(url, selector, options = {}) {
    return new Promise((resolve) => {
        safeRequest({
            method: "GET",
            url: url,
            timeout: 2000,
            onload: function(response) {
                try {
                    let html = response.responseText;

                    if (options.filter) {
                        html = options.filter(html);
                    }

                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    const infoDiv = doc.querySelector(selector);

                    if (!infoDiv) {
                        console.log(`[${url}] 未找到影片資訊元素`);
                        return resolve(null);
                    }

                    const infoText = infoDiv.textContent.trim();
                    const isInvalid = /(色站|服務器|免備案|流量變現|歡迎查詢|电报)/i.test(infoText);

                    resolve(isInvalid ? null : infoDiv.innerHTML);
                } catch (e) {
                    console.warn(`[${url}] 解析錯誤:`, e);
                    resolve(null);
                }
            },
            onerror: function() {
                resolve(null);
            }
        });
    });
}

async function getVideoInfoFromAllSources(id) {
    // 來源優先級順序
    const sources = [
        { name: 'JAV321', selector: '.col-md-9' },
        { name: 'BUS', selector: '.col-md-3.info' },
        {
        name: 'MENU',
        selector: '.card-body',
            filter: (html) => {
                return html.replace(/<div class="card-body">[\s\S]*?(色站搭建服務|免備案|流量變現)[\s\S]*?<\/div>/gi, '');
            }
        },
        { name: 'JAVTRAILERS', selector: '.col-md-9' }
    ];

    for (const source of sources) {
        const site = SITES.find(s => s.name === source.name);
        if (!site) continue;

        try {
            const info = await fetchVideoInfo(site.url(id), source.selector);
            console.log(info);
            if (info && info.trim() !== '') {
                console.log(`[${source.name}] 成功獲取影片資訊`);
                return {
                    source: source.name,
                    info: formatVideoInfo(info)
                };
            }
        } catch (e) {
            console.warn(`[${source.name},從[${source.url}]] 獲取失敗${source.info}`, e);
        }
    }

    return {
        source: 'none',
        info: '• 無法從任何來源獲取影片資訊\n• 番號: ' + id
    };
}
//-----------------------------
const previewImageSources = [];
function loadCustomSitesIntoSITES() {
    const customSites = GM_getValue('customSites', []);

    // 只移除與自訂站點同名的現有站點
    const customSiteNames = customSites.map(s => s.name);

    // 保留非自訂站點的來源
    const originalSources = GLOBAL_PREVIEW_SOURCES.filter(s => !customSiteNames.includes(s.name));

    // 保留非自訂站點的SITES
    const originalSites = SITES.filter(s => !customSiteNames.includes(s.name));

    // 重置為原始來源加上自訂來源
    GLOBAL_PREVIEW_SOURCES = [...originalSources];
    SITES = [...originalSites];

    const DEFAULT_PREVIEW_SOURCES = JSON.parse(JSON.stringify(GLOBAL_PREVIEW_SOURCES));
const DEFAULT_DISABLED_SOURCES = [];

// 修改初始化函數
function initializePreviewSources() {
    // 首次運行時設置默認值
    if (!GM_getValue('hasInitializedPreviewSources')) {
        GM_setValue('previewSourcesOrder', GLOBAL_PREVIEW_SOURCES.map(s => s.name));
        GM_setValue('disabledPreviewSources', []);
        GM_setValue('hasInitializedPreviewSources', true);
    }

    // 獲取用戶設置
    const userOrder = GM_getValue('previewSourcesOrder', []);
    const userDisabled = GM_getValue('disabledPreviewSources', []);

    // 創建來源映射表
    const sourceMap = new Map();
    GLOBAL_PREVIEW_SOURCES.forEach(source => {
        sourceMap.set(source.name, source);
    });

    // 合併來源順序
    const orderedSources = [];
    const unorderedSources = [];

    userOrder.forEach(name => {
        if (sourceMap.has(name)) {
            orderedSources.push(sourceMap.get(name));
            sourceMap.delete(name);
        }
    });

    sourceMap.forEach(source => {
        if (!userDisabled.includes(source.name)) {
            unorderedSources.push(source);
        }
    });

    // 設置全局來源
    GLOBAL_PREVIEW_SOURCES = [...orderedSources, ...unorderedSources];
        settings.disabledPreviewSources = userDisabled;

        initializePreviewSources();
}
    const btncheckoffsite = ['neon'];
    customSites.forEach(site => {
        const btncheckoff = site.name.toLowerCase().includes(btncheckoffsite);
        const transformFn = (id) => {
    let result = id;
    // 应用去除特殊字符
    if (site.removeSpecialChars) {
      result = result.replace(/[-_\s]/g, '');
    }
    // 应用大小写转换
    if (site.caseTransform === 'lower') {
      result = result.toLowerCase();
    } else if (site.caseTransform === 'upper') {
      result = result.toUpperCase();
    }
    return result;
  };


  const urlFunc = id => {
  try {
    if (!site.url || typeof site.url !== 'string') {
      throw new Error('無效的URL模版');
    }
    const transformedId = transformFn(id);
    if (!transformedId) {
      throw new Error('ID轉換結果為空');
    }
    return site.url.replace('{id}', encodeURIComponent(transformedId));
  } catch (error) {
    console.warn(`[${site.name}] URL生成失敗:`, error);
    return '#error'; //返回一個佔位符號,避免代碼崩潰
  }
};
        // 檢查是否已存在
        const exists = SITES.some(s => s.name === site.name);
        if (!exists) {
            const siteObj = {
                name: site.name,
                url: id => site.url.replace('{id}', transformFn(id)),
                keyword: site.keyword || '',
                btncheckoff: btncheckoff,
                checkAvailability: async function(id) {
                return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: this.url(id),
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "Referer": "https://javneon.tv/"
                },
                timeout: 5000,
                onload: (response) => {
                    const hasResults = response.responseText.includes(this.keyword);
                    resolve(hasResults);
                },
                onerror: () => resolve(false),
                ontimeout: () => resolve(false)
            });
        });
    }
};

        // 若有提供 DOM 選擇器才建立進階函數
        if (site.itemSel && site.titleSel && site.imgSel) {
            siteObj.searchItems= function(id) {
                const url = site.url.replace('{id}', encodeURIComponent(id));
                console.log(`[${site.name}] 開始 searchItems，URL: ${url}`);
                return new Promise(resolve => {
                    safeRequest({
                        method: 'HEAD',
                        url,
                        timeout: 3000,
                        onload: res => {
                            if (res.status === 200) {
                                safeRequest({
                                    method: 'GET',
                                    url,
                                    onload: res => {
                                        try {
                                            const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                                            const items = [...doc.querySelectorAll(site.itemSel)] || [];
                                            console.log(`[${site.name}] 找到項目數: ${items.length}`);
                                            resolve({ items, doc });
                                        } catch (e) {
                                            console.warn(`[${site.name}] searchItems 解析錯誤:`, e);
                                            resolve({ items: [] });
                                        }
                                    },
                                    onerror: () => resolve({ items: [] })
                                });
                            } else {
                                resolve(null);
                            }
                        },
                        onerror: () => {
                            resolve(null);
                        }
                    });
                });
            }

            siteObj.checkAvailability = async function(id) {
                const result = await this.searchItems(id);
                return result.items.length > 0;
            };

            siteObj.getPreviewImage = async function(id) {
                try {
                    if (!id || typeof id !== 'string') throw new Error('無效番號');

                    const transformedId = transformFn(id);
                    if (!transformedId || typeof transformedId !== 'string') throw new Error('transformFn(id) 回傳無效');

                    const url = site.url.replace('{id}', encodeURIComponent(transformedId));
                    if (!url || url.includes('undefined') || url.includes('null')) throw new Error('URL 模板填入後不合法: ' + url);

                    const result = await this.searchItems(transformedId);
                    if (!result || !Array.isArray(result.items) || result.items.length === 0) {
                        throw new Error('searchItems() 回傳無效或無項目');
                    }

                    const first = result.items[0];
                    const link = first?.querySelector(site.imgSel);
                    const imageUrl = link?.href || link?.src || link?.dataset?.src || null;

                    if (!imageUrl) throw new Error('找不到有效圖片 URL');

                    return imageUrl;
                } catch (e) {
                    console.warn(`[${site.name}] getPreviewImage 發生錯誤，將回傳 null 並讓後續來源繼續處理`, e);
                    return null;
                }
            };

            // 添加到預覽來源（如果不存在）
            const previewExists = GLOBAL_PREVIEW_SOURCES.some(s => s.name === site.name);
            if (!previewExists) {
                GLOBAL_PREVIEW_SOURCES.unshift({
                    name: site.name,
                    get: siteObj.getPreviewImage.bind(siteObj)
                });
            }
            console.log('自訂站點已加入隊列',site.name)
        }

            SITES.push(siteObj);
        }
    });

    // 確保預覽來源順序被保存
    GM_setValue('previewSourcesOrder', GLOBAL_PREVIEW_SOURCES.map(s => s.name));
}

let searchTimer = null;
const siteAvailabilityCache = new Map();
async function updateSearchLinks(id) {
  const linkContainer = document.getElementById('linkContainer');
  if (!linkContainer) return;

  // 清空容器但保留結構
  linkContainer.innerHTML = `
    <div class="buttons-container"></div>
    <div class="status-message"></div>
  `;

  const buttonsContainer = linkContainer.querySelector('.buttons-container');
  const statusMessage = linkContainer.querySelector('.status-message');

  // 添加"全部開啟"按鈕
  const openAllBtn = createSearchButton('全開', '#');
  openAllBtn.onclick = (e) => {
    e.preventDefault();
    document.querySelectorAll('.search-button.available').forEach(btn => {
      if (btn.href !== '#') window.open(btn.href, '_blank');
    });
  };
  buttonsContainer.appendChild(openAllBtn);

  // 顯示搜索中狀態
  statusMessage.textContent = '搜尋中...';
  statusMessage.style.color = '#aaa';

  // 獲取所有站點（包括自訂站點）
  const allSites = [
    ...SITES,
    ...GM_getValue('customSites', []).map(site => ({
      ...site,
      checkAvailability: site.checkAvailability || defaultSiteCheck
    }))
  ];

  // 為每個站點創建按鈕
  const buttons = allSites.map(site => {
  const btn = createSearchButton(site.name, site.url(id));
  const btncheckoff = site.name.toLowerCase().includes('neon');
  btn.dataset.site = site.name;

  // 为NEON按钮添加特殊处理
  if (btncheckoff) {
    // 强制标记为可用状态，不进行检测
    btn.classList.add('available', 'btncheckoff');
    // 添加NEON专属标签
    const tag = document.createElement('span');
    tag.textContent = '未檢測';
    tag.style.cssText = 'margin-left:5px;font-size:8px;background:#ff4444;color:white;padding:1px 3px;border-radius:3px';
    btn.appendChild(tag);
  } else {
    btn.classList.add('checking');
  }

  buttonsContainer.appendChild(btn);
  return { btn, site };
});

  // 並行檢查所有站點
  const checkPromises = buttons.map(({ btn, site }) => {
       if (site.btncheckoff === 'true') {
    return Promise.resolve(true);
  }
    return site.checkAvailability(id)
      .then(available => {
        btn.classList.remove('checking');
        if (available) {
          btn.classList.add('available');
          return true;
        } else {
          btn.classList.add('unavailable');
          return false;
        }
        if (site.btncheckoff) {
      btn.className = 'btncheckoff'; // 应用特殊样式
      btn.innerHTML = `🔥 ${site.name}`; // 添加特殊图标
    } else {
      btn.className = 'normal-site-button'; // 应用普通样式
      btn.innerHTML = `${site.icon || '🔍'} ${site.name}`;
    }
      })
      .catch(error => {
                    btn.classList.remove('checking');
                    if (error.message === 'RATE_LIMITED') {
                        // 特殊處理速率限制情況
                        btn.classList.add('rate-limited');
                        btn.title = '請求已達上限，請稍後再試';
                        btn.textContent = `${site.name}(冷卻中)`;
                    } else {
                        btn.classList.add('unavailable');
                        console.warn(`[${site.name}] 檢查錯誤:`, error);
                    }
                    return false;
                });
  });

  // 所有檢查完成後更新狀態
  Promise.all(checkPromises).then(results => {
    const availableCount = results.filter(Boolean).length;

    if (availableCount === 0) {
      statusMessage.textContent = '無結果';
      statusMessage.style.color = '#ff6b6b';
    } else {
      statusMessage.textContent = `找到 ${availableCount} 個結果`;
      statusMessage.style.color = '#51cf66';
    }
  });
}

// 3. 輔助函數
function createSearchButton(text, href) {
  const btn = document.createElement('a');
  btn.className = 'search-button';
  btn.textContent = text;
  btn.href = href;
  btn.target = '_blank';
  return btn;
}

// 檢查站點是否處於限制時間內
function isSiteRateLimited(site) {
    if (!site._lastReset || !site._requestCount) return false;

    const now = Date.now();
    const halfMinutes = site.name === 'JAVDB' ? 0.5 * 60 * 1000 : 0.5 * 60 * 1000; // JAVDB JABLE 0.5分鐘
    const maxRequests = site.name === 'JAVDB' ? 5 : 3; // JAVDB 5次，JABLE 3次

    if (now - site._lastReset > halfMinutes) {
        site._requestCount = 0;
        site._lastReset = now;
        return false;
    }

    return site._requestCount >= maxRequests;
}
//=====================創造容器區域============================
  let siteCache = {};
    const posX = GM_getValue('imagePositionX', defaultSettings.imagePositionX);
    const posY = GM_getValue('imagePositionY', defaultSettings.imagePositionY);
    const isPixel = /\d+px/.test(posX) && /\d+px/.test(posY);
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;display:none';
    document.body.appendChild(overlay);
    //整體區域的父容器
    const previewWrapper = document.createElement('div');
    previewWrapper.style.cssText = `
    position: fixed;
    left: ${posX};
    top: ${posY};
    z-index: 9999;
    display: none;
    border: 2px solid #333;
    background: #fff;
    padding: 0;
    overflow: hidden;
    cursor: pointer;
    width: ${settings.previewWidth}px;
    transition: none;
    transform: ${isPixel ? 'translate(0, 0)' : 'translate(-50%, -50%)'};
`;

    previewWrapper.style.transform = isPixel ? 'translate(0, 0)' : 'translate(-50%, -50%)';

    //影片信息的容器
    const infoContainer = document.createElement('div');
    infoContainer.style.cssText = `
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 10px 12px;
    font-size: 13px;
    line-height: 1.5;
    max-height: 150px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    display: none; // 默認隱藏
`;

    //圖片容器
    const previewImg = document.createElement('img');
    previewImg.style.cssText = `
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;;
    margin: 0;
    padding: 0;
    background-color: #000;
`;
    //超連結按鈕容器
    const linkContainer = document.createElement('div');

    linkContainer.style.cssText = `
    position: sticky;  // 改用 sticky 定位
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-wrap: wrap;
    background: rgba(0, 0, 0, 0.9);
    padding: 4px 4px 4px 70px;
    gap: 5px;         // 按鈕間距
    z-index: 10000;
    color: #fff;
`;
// 結構順序：圖片 → 信息 → 工具欄
previewWrapper.append(previewImg, infoContainer,linkContainer);

//定義卷軸樣式
const scrollStyle = document.createElement('style');
scrollStyle.textContent = `
    .preview-wrapper::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }
    .preview-wrapper::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.2);
        border-radius: 3px;
    }
`;

const dragStyle = document.createElement('style');
dragStyle.textContent = `
    .tier-box[data-tier="3"] {
        opacity: 0.9;
        background: #f5f5f5 !important;
    }
    .tier-box[data-tier="3"] .site-item {
        cursor: default !important;
        background: #E1BEE7 !important;
    }
    .locked-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.5);
        z-index: 10;
    }
`;
document.head.appendChild(dragStyle);
document.head.appendChild(scrollStyle);
//==========================================================
    // 設置預覽頁位置（從鼠標下方出現，不超出視窗）
    function setPreviewPosition(mouseX, mouseY) {
        const offsetY = 20; // 預覽頁與鼠標的垂直偏移量
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const previewWidth = previewWrapper.offsetWidth;
        const previewHeight = previewWrapper.offsetHeight;

        // 初始位置（鼠標正下方）
        let left = mouseX - 10;
        let top = mouseY + offsetY - 25;

        // 檢查右邊界
        if (left + previewWidth > windowWidth) {
            left = windowWidth - previewWidth - 10; // 留 10px 邊距
        }

        // 檢查下邊界
        if (top + previewHeight > windowHeight) {
            top = mouseY - previewHeight - offsetY + 25; // 改為鼠標上方顯示
        }

        // 確保位置不低於 0
        left = Math.max(0, left);
        top = Math.max(0, top);

        // 應用位置
        previewWrapper.style.left = `${left}px`;
        previewWrapper.style.top = `${top}px`;
        previewWrapper.style.transform = 'none'; // 移除 translate
    }


    const pinToggle = document.createElement('a');


    pinToggle.textContent = '📌';

    pinToggle.title = '固定';

    Object.assign(pinToggle.style, {

        position: 'absolute', top: '0', left: '0', background: 'rgba(80,80,80,0.5)', fontSize: '11px', padding: '2px 4px', cursor: 'pointer', color: '#eee', lineHeight: '1'

    });



    const zoomToggle = document.createElement('a');

    zoomToggle.textContent = '🔍';

    zoomToggle.title = '放大';

    Object.assign(zoomToggle.style, {

        position: 'absolute', top: '0', left: '22px', background: 'rgba(80,80,80,0.5)', fontSize: '11px', padding: '2px 4px', cursor: 'pointer', color: '#eee', lineHeight: '1'

    });

    const followToggle = document.createElement('a');
    followToggle.textContent = settings.followMouse ? '🖱️' : '📌';
    followToggle.title = settings.followMouse ? '跟隨鼠標開關' : '跟隨鼠標開關';
    Object.assign(followToggle.style, {
        position: 'absolute', top: '0', left: '44px', background: 'rgba(80,80,80,0.5)', fontSize: '11px', padding: '2px 4px', cursor: 'pointer', color: '#eee', lineHeight: '1'
    });

    previewWrapper.append(previewImg, pinToggle, zoomToggle, followToggle, linkContainer)

    document.body.appendChild(previewWrapper);



    let isPinned = false, isDragging = false, isZoomed = false, zoomHover = false, playHover = false, suppressHide = false;

    let offsetX = 0, offsetY = 0, originalStyle = {}, showTimeout;



    pinToggle.onclick = e => { e.preventDefault(); isPinned = !isPinned; pinToggle.textContent = isPinned ? '📍' : '📌'; };

    followToggle.onclick = function(e) {
    e.preventDefault();
    settings.followMouse = !settings.followMouse;
    GM_setValue('followMouse', settings.followMouse);
    this.textContent = settings.followMouse ? '🖱️' : '📌';
    this.title = `預覽頁跟隨鼠標功能已${settings.followMouse ? '開啟' : '關閉'}`;
};

    (function setupZoomOverlay() {
    const zoomLayer = document.createElement('div');
    zoomLayer.id = 'zoomFullViewportOverlay';
    Object.assign(zoomLayer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        background: '#000',
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '10010',
    });

    const zoomedImage = document.createElement('img');
    zoomedImage.id = 'zoomedImg';
    Object.assign(zoomedImage.style, {
        height: '100vh',
        width: 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
        display: 'block',
        margin: '0 auto',
    });

    zoomLayer.appendChild(zoomedImage);
    document.body.appendChild(zoomLayer);
})();

zoomToggle.onclick = () => {
    const zoomLayer = document.getElementById('zoomFullViewportOverlay');
    const zoomedImage = document.getElementById('zoomedImg');

    if (!isZoomed) {
        zoomedImage.src = previewImg.src;
        zoomLayer.style.display = 'flex';
        isZoomed = true;
    } else {
        zoomLayer.style.display = 'none';
        isZoomed = false;
        zoomLayer.addEventListener('mousedown', () => {
        if (isZoomed) {
            zoomToggle.onclick();
        }
    });
    }
};



    overlay.onclick = () => { if (isZoomed) zoomToggle.onclick(); };

    previewWrapper.addEventListener('mousedown', e => {

        if (isPinned || isZoomed || e.target === pinToggle || e.target === zoomToggle ) return;

        isDragging = true;

        offsetX = e.clientX - previewWrapper.getBoundingClientRect().left;

        offsetY = e.clientY - previewWrapper.getBoundingClientRect().top;

        previewWrapper.style.cursor = 'grabbing';

        e.preventDefault();

    });



    document.addEventListener('mousemove', e => {

        if (!isDragging) return;

        previewWrapper.style.left = `${e.clientX - offsetX}px`;

        previewWrapper.style.top = `${e.clientY - offsetY}px`;

        previewWrapper.style.transform = 'translate(0, 0)';

    });



    document.addEventListener('mouseup', () => {

        if (!isDragging && suppressHide) { suppressHide = false; return; }

        if (!isDragging) return;

        isDragging = false;

        previewWrapper.style.cursor = 'pointer';

        GM_setValue('imagePositionX', previewWrapper.style.left);

        GM_setValue('imagePositionY', previewWrapper.style.top);

    });



    previewWrapper.addEventListener('mouseleave', () => {

        if (!isPinned && !zoomHover && !playHover && !isZoomed && !suppressHide) {
            previewImg.src = '';
            linkContainer.innerHTML = '';
            previewWrapper.style.display = 'none';
        }

    });

    document.addEventListener('mousedown', () => {
        if (isZoomed) {
            zoomToggle.onclick();
            previewWrapper.style.display = 'none';
            overlay.style.display = 'none';
        }
    });

    document.addEventListener('wheel', () => {
        if (isZoomed) {
            zoomToggle.onclick();
            previewWrapper.style.display = 'none';
            overlay.style.display = 'none';
        }
    });
    const pattern = /(?<!magnet:\/\/)(\b(?:FC2|fc2)[\s-]*(?:PPV|ppv)[\s-]*\d{6,7}\b|\bFC2-PPV-\d{6,7}\b|\bfc2-\d{6,7}\b|\b\d{3}[A-Za-z]{2,5}-\d{3,5}\b|\b[A-Za-z]{1,5}-[A-Za-z]{1,3}\d{2,4}\b|\b[A-Za-z]{1,5}-\d{3,5}[A-Za-z]?\b|\b\d{6}_\d{2,}[A-Za-z]*\b|\b\d{6}-\d{3}(?:-[A-Za-z]+)?\b|\b\d{6}_\d{3}\b|\b[A-Za-z]-\d{3,5}\b|\b[A-Za-z]{1,3}\d{2}-\d{3}\b|\b[A-Za-z]{5,6}-\d{3,4}\b|\b[A-Za-z]{2}\d{3}[A-Za-z]{2}-\d{3,4}\b|\b\d{3}[A-Za-z]{4}-\d{4}\b|\b\d{3}[A-Za-z]{2}-\d{4}\b|\b[A-Za-z]{2}\d{3}-\d{3}\b|\b[A-Za-z]{2}\d{4}-\d{3}\b|\b[A-Za-z]{4}\d{2}-\d{3}\b|\b[A-Za-z]{3}\d{3}-\d{3}\b|\b[A-Za-z]{2}\d{2}-\d{4}\b|\b\d{2}[A-Za-z]{3}-\d{4}\b|\b\d{3}[A-Za-z]{2}-\d{4}\b|\b\d{3}[A-Za-z]{3}-\d{4}\b|\b\d{4}[A-Za-z]{2}-\d{3}\b|\b[A-Za-z]{2}\d{5}-\d{3}\b|\b[A-Za-z]{5}-\d{4}\b|\b[A-Za-z]{6}-\d{4}\b|\b\d{3}OREC[ZS]-\d{3}\b|\b\d{3}STVF-\d{3}\b|\b\d{3}GANA-\d{4}\b|\b\d{3}MIUM-\d{4}\b|\b\d{3}EROFV-\d{3}\b|\b[A-Za-z]{2}\d{3}-\d{4}\b|\b[A-Za-z]{4}-\d{4}\b|\b[A-Za-z]{5}-\d{3}\b|\b\d{3}[A-Za-z]{4}-\d{3}\b|\b[A-Z]{2,7}-\d{2,4}\b|\b\d[A-Za-z]{3,5}-\d{3,5}\b)/gi;

    function highlightTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;

    while (node = walker.nextNode()) {
        if (pattern.test(node.textContent)) {
            nodes.push(node);
        }
    }

    nodes.forEach(node => {
        // 檢查節點是否仍在 DOM 中
        if (!node.parentNode) return;

        try {
            const span = document.createElement('span');
            span.innerHTML = node.textContent.replace(pattern, match =>
                `<span class="highlight-vr" data-id="${match}"
                      style="background-color: ${settings.highlightColor};
                             font-weight: bold;
                             cursor: pointer;">${match}</span>`);
            node.parentNode.replaceChild(span, node);
        } catch (e) {
            console.error('高亮文本節點時出錯:', e);
        }
    });
}

let isScanning = false;

function lightweightScan() {
    if (isScanning) return;
    isScanning = true;

    // 只掃描可見區域的文本節點（性能關鍵！）
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                return node.textContent.trim().length < 100 ?
                    NodeFilter.FILTER_ACCEPT :
                    NodeFilter.FILTER_REJECT;
            }
        }
    );

    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    requestIdleCallback(() => {
        textNodes.forEach(node => {
            const text = node.textContent;
            if (pattern.test(text)) {
                // 再次檢查節點是否仍在 DOM 中
                if (!node.parentNode) return;

                try {
                    const span = document.createElement('span');
                    span.innerHTML = text.replace(pattern, `<span class="highlight-vr" style="background:${settings.highlightColor};font-weight:bold;cursor:pointer;">$&</span>`);
                    node.parentNode.replaceChild(span, node);
                } catch (e) {
                    console.warn('輕量掃描時出錯:', e);
                }
            }
        });
        isScanning = false;
    });
}

    highlightTextNodes(document.body);

// 初掃 + 滾動時局部掃描
lightweightScan();
let lastScrollTime = 0;
const SCROLL_THROTTLE = 200; // 200毫秒

window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime < SCROLL_THROTTLE) return;
    lastScrollTime = now;

    requestIdleCallback(lightweightScan);
}, { passive: true });

    async function checkSiteAvailability(site, id) {
    // 如果有自定義檢查函數，優先使用
    if (typeof site.checkAvailability === 'function') {
        try {
            return await site.checkAvailability(id);
        } catch (e) {
            console.log(`[Custom Check Error] ${site.name}:`, e);
            return false;
        }
    }

    const url = site.url(id);
    return new Promise(resolve => {
        const timeout = setTimeout(() => {
            resolve(false);
        }, 2500);

        safeRequest({
            method: 'GET', // 改用GET以便檢查內容
            url,
            timeout: 2000,
            onload: res => {
                clearTimeout(timeout);

                // 先檢查HTTP錯誤狀態碼
                if (res.status >= 400) {
                    console.log(`[${site.name}] HTTP ${res.status} 錯誤`);
                    return resolve(false);
                }

                // 檢查是否被重定向到首頁或錯誤頁
                if (isErrorPage(res.finalUrl, url)) {
                    console.log(`[${site.name}] 被重定向到錯誤頁面`);
                    return resolve(false);
                }

                try {
                    // 使用站點設定的關鍵字檢查
                    if (site.keyword) {
                        return resolve(res.responseText.includes(site.keyword));
                    }

                    // 如果沒有設定關鍵字，檢查頁面是否包含番號
                    const normalizedId = id.toUpperCase().replace(/[-_\s]/g, '');
                    const idRegex = new RegExp(normalizedId.replace(/(\W)/g, '\\$1'), 'i');
                    resolve(idRegex.test(res.responseText));
                } catch (e) {
                    console.warn(`[${site.name}] 解析錯誤:`, e);
                    resolve(false);
                }
            },
            onerror: res => {
                clearTimeout(timeout);
                console.log(`[${site.name}] 請求失敗:`, res.status);
                resolve(false);
            },
            ontimeout: () => {
                clearTimeout(timeout);
                console.log(`[${site.name}] 請求超時`);
                resolve(false);
            }
        });
    });
}

// 輔助函數：檢查是否被重定向到錯誤頁面
function isErrorPage(finalUrl, originalUrl) {
    // 如果被重定向到首頁
    if (finalUrl !== originalUrl &&
        (finalUrl.endsWith('/') ||
         finalUrl.includes('/home') ||
         finalUrl.includes('/error'))) {
        return true;
    }
    return false;
}

async function searchSites(id) {
    if (siteCache[id] && siteCache[id].timestamp > Date.now() - CACHE_EXPIRY_MS) {
        return siteCache[id].results;
    }

    const timeoutPromise = new Promise(resolve =>
        setTimeout(() => resolve([]), 8000)); // 8秒

    const searchPromise = (async () => {
        const foundSites = [];

        if (settings.simpleSearch) {
            const tiers = settings.simpleSearchTiers || defaultSettings.simpleSearchTiers;
            for (let tierIndex = 0; tierIndex < tiers.length; tierIndex++) {
                const tierSites = tiers[tierIndex];
                const isWildcardTier = tierSites.includes('*');

                const sitesToCheck = isWildcardTier
                    ? SITES.filter(s =>
                        !tiers.slice(0, tierIndex).some(t => t.includes(s.name)))
                    : tierSites.map(name => SITES.find(s => s.name === name)).filter(Boolean);
                //批次檢查,每批8個
                const batchSize = 8;
                for (let i = 0; i < sitesToCheck.length; i += batchSize) {
                    const batch = sitesToCheck.slice(i, i + batchSize);
                    const batchResults = await Promise.allSettled(
                        batch.map(site => checkSiteWithTimeout(site, id))
                    );
                    for (const result of batchResults) {
                        if (result.status === 'fulfilled' && result.value) {
                            let siteUrl;
                            if (typeof result.value.url === 'function') {
                                siteUrl = result.value.url(id);
                            } else if (typeof result.value.url === 'string') {
                                siteUrl = result.value.url;
                            } else {
                                console.warn(`[URL生成] 站點 ${result.value.name} 的URL格式無效，使用默認URL`);
                                siteUrl = `https://jable.tv/search/${encodeURIComponent(id)}`;
                            }
                            foundSites.push({
                                name: result.value.name,
                                url: siteUrl
                            });
                        }
                    }
                    if (foundSites.length > 0) {
                        return foundSites;
                    }
                }
            }
        } else {
            const batchSize = 8;
            for (let i = 0; i < SITES.length; i += batchSize) {
                const batch = SITES.slice(i, i + batchSize);
                const batchResults = await Promise.allSettled(
                    batch.map(site => checkSiteWithTimeout(site, id))
                );
                batchResults.forEach(result => {
                    if (result.status === 'fulfilled' && result.value) {
                        let siteUrl;
                        if (typeof result.value.url === 'function') {
                            siteUrl = result.value.url(id);
                        } else if (typeof result.value.url === 'string') {
                            siteUrl = result.value.url;
                        } else {
                            console.warn(`[URL生成] 站點 ${result.value.name} 的URL格式無效，使用默認URL`);
                            siteUrl = `https://jable.tv/search/${encodeURIComponent(id)}/`;
                        }

                        foundSites.push({
                            name: result.value.name,
                            url: siteUrl
                        });
                    }
                });
            }
        }

        return foundSites;
    })();

    return Promise.race([searchPromise, timeoutPromise]).then(results => {
        siteCache[id] = {
            results: results,
            timestamp: Date.now()
        };
        GM_setValue('siteCache', siteCache);
        return results;
    });
}
// 添加帶超時的站點檢查函數
function checkSiteWithTimeout(site, id) {
    return new Promise(resolve => {
        const timeout = setTimeout(() => {
            resolve(false);
        }, 3000); // 單個站點3秒超時

        site.checkAvailability(id)
            .then(available => {
                clearTimeout(timeout);
                resolve(available ? site : false);
            })
            .catch(error => {
                clearTimeout(timeout);
                console.warn(`[${site.name}] 檢查錯誤:`, error);
                resolve(false);
            });
    });
}
function cacheImage(id, url, info) {
    // 確保快取結構完整
    const cacheEntry = {
        url: url,
        timestamp: Date.now()
    };

    // 如果有info則儲存
    if (info && typeof info === 'object') {
        cacheEntry.info = info.info || '';
        cacheEntry.source = info.source || { image: 'unknown', info: 'unknown' };
    } else if (info && typeof info === 'string') {
        cacheEntry.info = info;
        cacheEntry.source = { image: 'cache', info: 'cache' };
    }

    imageCache[id] = cacheEntry;
    GM_setValue('imageCache', imageCache);
    console.log(`[快取更新] ${id}`, cacheEntry);
}
    const fallbackImageUrl = 'https://i.ibb.co/0hCdbp2/default-image.jpg';
    const CACHE_EXPIRY_MS = 15 * 24 * 60 * 60 * 1000; //快取只保留15天
    let imageCache = GM_getValue('imageCache', {});

  function saveCache() {
    GM_setValue('imageCache', imageCache);
    GM_setValue('siteCache', siteCache); // 新增
}

    function cleanOldCache() {
    const now = Date.now();
    let changed = false;
    const CACHE_EXPIRY_MS = 15 * 24 * 60 * 60 * 1000;

    for (const id in imageCache) {
        // 保留沒有timestamp的舊快取（兼容性處理）
        if (imageCache[id].timestamp && (now - imageCache[id].timestamp > CACHE_EXPIRY_MS)) {
            console.log(`[清理快取] 過期項目: ${id}`);
            delete imageCache[id];
            changed = true;
        }
    }

    if (changed) {
        GM_setValue('imageCache', imageCache);
    }
}

    cleanOldCache();



function clearAllCache() {
    // 清除儲存的值
    GM_setValue('imageCache', {});
    GM_setValue('siteCache', {});


    // 更新內存中的變量引用
    siteCache = {};
    imageCache = {};

    unsafeWindow.alert('所有快取已清除！');
}
        // 圖片有效性檢查
    function validateImageUrl(url) {
    return new Promise(resolve => {
        if (!url || url === fallbackImageUrl) {
            resolve(false);
            return;
        }

        const img = new Image();
        img.onload = () => {
            // 基本尺寸驗證，避免1x1像素的無效圖片
            resolve(img.width > 10 && img.height > 10);
        };
        img.onerror = () => resolve(false);
        img.src = url;

        // 設置超時時間
        setTimeout(() => {
            img.onload = img.onerror = null;
            resolve(false);
        }, 3000);
    });
}
    // 圖片取得與快取加強驗證
async function getImageFromSource(url, selector, filterFn = null) {
    return new Promise((resolve) => {
        safeRequest({
            method: "GET",
            url: url,
            timeout: 2500,
            onload: function(response) {
                // 檢查 403 Forbidden
                if (response.status === 403) {
                    console.log(`[403 Blocked] 無法存取: ${url}`);
                    return resolve(null);
                }
                try {
                    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                    const elements = Array.from(doc.querySelectorAll(selector));
                    const el = filterFn ? elements.find(filterFn) : elements[0];
                    resolve(el?.src || null);
                } catch (error) {
                    resolve(null);
                }
            },
            onerror: function() {
                resolve(null);
            }
        });
    });
}
    // HOVER抓圖功能
    async function fetchHoverImage(url, id) {
        return new Promise((resolve) => {
            safeRequest({
                context: 'HOVER', // 標記為HOVER請求
                method: "GET",
                url: url,
                timeout: 3000,
                onload: function(response) {
                    try {
                        // 檢查圖片有效性
                        const img = new Image();
                        img.onload = () => resolve(url);
                        img.onerror = () => resolve(null);
                        img.src = url;
                    } catch (e) {
                        resolve(null);
                    }
                },
                onerror: function() {
                    resolve(null);
                }
            });
        });
    }

// 新增函數：從懸停元素附近的連結獲取圖片
async function getImageFromHoveredLink(vrElement, id) {
    try {
        //檢查懸停元素本身是否為連結
        const link = vrElement.closest('a');
        if (link?.href) {
            const imgUrl = await extractImageFromLink(link, id);
            console.log('開始HOVER搜圖','番號'+id);
            if (imgUrl) return imgUrl;
        }
    } catch (error) {
        console.warn('[HOVER取圖] 錯誤:', error);
        return null;
    }
}

// 輔助函數：檢查元素是否在附近
function isElementNearby(element1, element2, maxDistance = 100) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(
        rect1.right < rect2.left - maxDistance ||
        rect1.left > rect2.right + maxDistance ||
        rect1.bottom < rect2.top - maxDistance ||
        rect1.top > rect2.bottom + maxDistance
    );
}

// 輔助函數：從連結提取圖片
async function extractImageFromLink(link, id) {
    try {
        // 情況1: 連結本身就是圖片
        if (link.href.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i)) {
            return link.href;
        }

        // 情況2: 連結包含圖片元素
        const img = link.querySelector('img[src]');
        if (img) {
            return img.src;
        }

        // 情況3: 獲取連結頁面內容並搜索圖片
        const pageContent = await fetchLinkContent(link.href);
        if (!pageContent) return null;

        // 根據設定決定使用哪種搜尋模式
        if (settings.hoverFuzzySearch) {
            // 模糊搜尋模式 - 四種匹配方式
            const regexPatterns = [
            // 匹配包含番號的圖片URL
            new RegExp(`(https?:\\/\\/[^"\\s]+${id.replace(/[-_]/g, '[-_]?')}[^"\\s]*\\.(?:jpg|jpeg|png|gif|webp))`, 'i'),
            // 匹配標準img標籤
            /<img[^>]+src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^"]*)?)"/i,
            // 匹配data-src屬性
            /<img[^>]+data-(?:src|lazy-src)="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^"]*)?)"/i,
            // 匹配og:image meta標籤
            /<meta[^>]+property="og:image"[^>]+content="(https?:\/\/[^"]+)"/i

        ];

            for (const pattern of regexPatterns) {
                const match = pageContent.match(pattern);
                if (match && match[1]) {
                    const cleanUrl = match[1].replace(/(\.(jpg|jpeg|png|gif|webp)).*$/i, '$1');
                    const isValid = await validateImageAccess(cleanUrl);
                    if (isValid) return cleanUrl;
                }
            }
        } else {
            // 精確搜尋模式 - 只搜尋包含番號的圖片URL
            const exactPattern = new RegExp(`(https?:\\/\\/[^"\\s]+${id.replace(/[-_]/g, '[-_]?')}[^"\\s]*\\.(?:jpg|jpeg|png|gif))`, 'i')
            const match = pageContent.match(exactPattern);
            if (match && match[1]) {
                const cleanUrl = match[1].replace(/(\.(jpg|jpeg|png|gif)).*$/i, '$1');
                const isValid = await validateImageAccess(cleanUrl);
                if (isValid) return cleanUrl;
            }
        }

        return null;
    } catch (error) {
        console.warn('[HOVER取圖] 錯誤:', error);
        return null;
    }
}

// 輔助函數：獲取連結內容
function fetchLinkContent(url) {
    return new Promise((resolve) => {
        safeRequest({
            method: "GET",
            url: url,
            timeout: 2000,
            onload: (response) => resolve(response.responseText),
            onerror: () => resolve(null)
        });
    });
}

// 新增：驗證圖片是否可存取（檢查 403）
function validateImageAccess(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => {
            console.log(`${img.source}[403 Blocked] 圖片無法載入: ${url}`);
            resolve(false);
        };
        img.src = url;
    });
}

function initPreviewSources() {
    // 1. 載入自訂站點（確保搜尋功能正常）
    const customSites = GM_getValue('customSites', []).map(site => ({
        name: site.name,
        get: async (id) => {
            try {
                // 載入自訂站點到 SITES 陣列
                loadCustomSitesIntoSITES();

                // 查找對應的站點配置
                const siteObj = SITES.find(s => s.name === site.name);
                if (!siteObj || typeof siteObj.getPreviewImage !== 'function') {
                    return null;
                }

                // 調用站點的 getPreviewImage 方法
                return await siteObj.getPreviewImage(id);
            } catch (e) {
                console.warn(`[${site.name}] 獲取預覽圖錯誤:`, e);
                return null;
            }
        }
    }));

    // 2. 合併所有站點（預設9個 + 自訂）
    const allSources = [
        ...GLOBAL_PREVIEW_SOURCES, // 預設9個
        ...customSites // 自訂站點
    ];

    // 3. 載入使用者設定的順序
    let savedOrder = GM_getValue('previewSourcesOrder', []);

    // 4. 如果沒有保存順序，初始化為預設+自訂的順序
    if (savedOrder.length === 0) {
        const defaultOrder = allSources.map(s => s.name);
        GM_setValue('previewSourcesOrder', defaultOrder);
        savedOrder = defaultOrder; // 用於後續處理
    }

    // 5. 建立快速查找表（優化效能）
    const sourceMap = new Map(allSources.map(s => [s.name, s]));

    // 6. 重建排序（保留1.txt的邏輯）
    const orderedSources = [];
    const unusedSources = [];

    // 6.1 先加入已排序的站點
    savedOrder.forEach(name => {
        const source = sourceMap.get(name);
        if (source && !settings.disabledPreviewSources.includes(name)) {
            orderedSources.push(source);
            sourceMap.delete(name); // 避免重複
        }
    });

    // 6.2 加入剩餘未排序且未禁用的站點
    sourceMap.forEach(source => {
        if (!settings.disabledPreviewSources.includes(source.name)) {
            unusedSources.push(source);
        }
    });

    // 7. 更新全局變量
    GLOBAL_PREVIEW_SOURCES = [...orderedSources, ...unusedSources];

    // 8. 確保保存當前順序
    GM_setValue('previewSourcesOrder', GLOBAL_PREVIEW_SOURCES.map(s => s.name));
}

// 新增：格式化影片資訊
function formatVideoInfo(html) {
    if (!html) return '';

    // 創建臨時div解析HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 通用清理規則
    let text = tempDiv.textContent
        .replace(/\s+/g, ' ')
        .replace(/(DVD ID|Content ID|Release Date|Duration|Director|Studio|Categories|番號|發佈於|時長|出版|出演者|女優|品番|番号|配信開始日|発売日|メーカー|ジャンル|製作商|識別碼|發行日期|發行商|長度|製作|類別|演員|系列|片商|導演|清單|熱搜|お気に入り登録数|平均評価|収録時間|檢索):?/gi, '\n• $1: ')
        .replace(/\n\s+/g, '\n')
        .trim();
    
    // 確保以項目符號開頭
    if (!text.startsWith('•')) {
        text = '• ' + text;
    }

    // 限制長度並移除多餘空行
    return text.substring(0, 600)
        .replace(/\n+/g, '\n')
        .trim();
}

async function fetchPreviewImage(id) {

    //1. 參數檢查 //影響性能
    if (!id || typeof id !== 'string') {
        console.warn('[fetchPreviewImage] 提供的 id 無效:', id);
        return {
            url: fallbackImageUrl,
            info: 'ID 無效，無法搜尋圖片',
            source: { image: 'invalid-id', info: 'invalid-id' }
        };
    }

    // 2. 檢查快取（合併 imageCache 和 infoCache 讀取）
    if (imageCache[id]?.url) {
        const isTrusted = settings.trustedPreviewSources.includes(imageCache[id].source);
        const isValid = isTrusted ? true : await validateImageAccess(imageCache[id].url);

        if (isValid) {
            console.log(`[快取命中] 使用 ${imageCache[id].source} 圖片`);

            // 優先讀取 infoCache，不存在時才重新獲取
            const infoCache = GM_getValue('infoCache', {});
            const cachedInfo = infoCache[id]?.info || await getVideoInfoFromAllSources(id);

            return {
                url: imageCache[id].url,
                info: cachedInfo,
                source: {
                    image: imageCache[id].source,
                    info: infoCache[id]?.source || 'cache'
                }
            };
        }
    }

    // 3. 從所有來源搜尋圖片
    const trusted = settings.trustedPreviewSources;
    const disabled = settings.disabledPreviewSources;
    const validSources = GLOBAL_PREVIEW_SOURCES
    .filter(src => !disabled.includes(src.name))
    .map(src => {
        // 如果沒有 get 方法，嘗試使用 getPreviewImage
        if (!src.get && src.getPreviewImage) {
            return {
                ...src,
                get: src.getPreviewImage
            };
        }
        return src;
    })
    .filter(src => typeof src.get === 'function');

    let selectedResult = null;

try {
    selectedResult = await Promise.any(
        validSources.map(source =>
            withTimeout(source.get(id), 3000, source.name)
                .then(imgUrl => {
                    if (imgUrl) return { source, imgUrl };
                    // 回傳 null 的也視為錯誤，讓 Promise.any 跳過
                    throw new Error(`[${source.name}] 沒有圖片`);
                })
        )
    );
} catch (e) {
    selectedResult = null;
}

    // 4. 處理搜尋結果
    let finalImageUrl = null;
    let imageSource = null;
    let videoInfo = { info: '', source: 'none' };

    if (selectedResult) {
    const { source, imgUrl } = selectedResult;
    const isTrusted = trusted.includes(source.name);
    const isValid = isTrusted ? true : await validateImageAccess(imgUrl);

    if (isValid) {
        finalImageUrl = imgUrl;
        imageSource = source.name;

        imageCache[id] = {
            url: finalImageUrl,
            timestamp: Date.now(),
            source: imageSource
        };

        videoInfo = await getVideoInfoFromAllSources(id);

        Promise.resolve().then(() => {
            const infoCache = GM_getValue('infoCache', {});
            infoCache[id] = {
                info: videoInfo.info,
                source: videoInfo.source,
                timestamp: Date.now()
            };
            GM_setValue('infoCache', infoCache);
            saveCache();
        });
    }
}

    // 5. 回退處理
    if (!finalImageUrl) {
        finalImageUrl = fallbackImageUrl;
        videoInfo = {
            info: '無法從任何來源獲取影片資訊',
            source: 'fallback'
        };
    }

    return {
        url: finalImageUrl,
        info: videoInfo.info,
        source: {
            image: imageSource || 'fallback',
            info: videoInfo.source || 'fallback'
        }
    };
}
// 輔助函數：帶超時的 Promise
function withTimeout(promise, timeoutMs, sourceName = '') {
    return Promise.race([
        promise,
        new Promise(resolve =>
            setTimeout(() => {
                resolve(null);
            }, timeoutMs)
        )
    ]);
}
// 默認站點檢查邏輯
async function defaultSiteCheck(site, id) {
    const url = site.url(id);

    return new Promise(resolve => {
        // 設置 2.5 秒超時機制
        const timeout = setTimeout(() => {
            console.log(`[${site.name}] 檢查超時 (3000ms)`);
            resolve(false);
        }, 3000);

        // 先用 HEAD 方法快速檢查站點可用性
        safeRequest({// 使用安全封裝的請求函數
            method: "HEAD",
            url,
            timeout: 2500,
            onload: headRes => {
                clearTimeout(timeout);

                // 只有當 HEAD 請求返回 200 時才繼續 GET 請求
                if (headRes.status === 200) {
                    safeRequest({
                        method: "GET",
                        url,
                        timeout: 2500,
                        onload: getRes => {
                            try {
                                // 關鍵改進點：
                                // 1. 同時檢查關鍵字和番號存在性
                                const html = getRes.responseText;
                                const hasKeyword = site.keyword ?
                                    (Array.isArray(site.keyword) ?
                                        site.keyword.some(kw => html.includes(kw)) :
                                        html.includes(site.keyword)) :
                                    true;

                                // 2. 檢查番號存在
                                const hasId = new RegExp(id, 'i').test(html);
                                resolve(hasKeyword && hasId);
                            } catch (e) {
                                console.warn(`[${site.name}] 解析HTML失敗:`, e);
                                resolve(false);
                            }
                        },
                        onerror: () => resolve(false)
                    });
                } else {
                    console.log(`[${site.name}] HEAD 狀態碼: ${headRes.status}`);
                    resolve(false);
                }
            },
            onerror: () => {
                clearTimeout(timeout);
                resolve(false);
            }
        });
    });
}

// 統一的站點檢查函數
async function checkSiteWithRetry(site, id, retries = 2) {
    // 檢查站點是否處於限制時間內
    if (isSiteRateLimited(site)) {
        console.log(`[${site.name}] 請求已達上限，跳過檢查`);
        return false;
    }

    const cacheKey = `${site.name}-${id}`;

    // 檢查快取（但設置較短有效期）
    if (siteAvailabilityCache.has(cacheKey)) {
        const entry = siteAvailabilityCache.get(cacheKey);
        if (Date.now() - entry.timestamp < 30000) { // 30秒快取
            return entry.result;
        }
    }

    try {
        let result;
        if (typeof site.checkAvailability === 'function') {
            result = await site.checkAvailability(id);
        } else {
            result = await defaultSiteCheck(site, id);
        }

        siteAvailabilityCache.set(cacheKey, {
            result,
            timestamp: Date.now()
        });
        return result;
    } catch (e) {
        if (retries > 0) {
            return checkSiteWithRetry(site, id, retries - 1);
        }
        return false;
    }
}

    function transformId(id) {
    // 如果全局已有 transformId 函數，優先使用
    if (typeof window.transformId === 'function') {
        return window.transformId(id);
    }
         // 特例：如 LCDV-71568 → lcdv071568
        if (/^LCDV-\d{5,}$/.test(id.toUpperCase())) {
            const [prefix, num] = id.split('-');
            const number = parseInt(num);
            // 小於5開頭的用5125前綴,大於用5608前綴
            const prefixCode = Number(num[0]) < 5 ? '5125' : '5608';
            if(prefixCode)
            {
                return prefixCode + prefix.toLowerCase() + num.padStart(5, '0');
            }
            else
            {return prefixCode + prefix.toLowerCase() + num.padStart(6, '0');}
        }
        if (/^NAAC-\d{3,4}$/.test(id.toUpperCase())) {
            const [prefix, num] = id.split('-');
            return 'h_706'+prefix.toLowerCase() + num.padStart(5, '0')+"b";
        }
        const mbrMatch = id.toUpperCase().match(/^(MBR)-(\d{1,3})$/);
        const mwMatch = id.toUpperCase().match(/^(MW)-(\d{1,3})$/);
        const jtdkMatch = id.toUpperCase().match(/^(JTDK)-(\d{1,3})$/);
        if (mbrMatch) {
            const prefix = mbrMatch[1].toLowerCase(); // "mbr"
            const num = parseInt(mbrMatch[2], 10);// 提取數字部分
            // 根據數字範圍使用不同的前綴
            if (num >= 1 && num <= 9) {
                return `433${prefix}${num.toString().padStart(5, '0')}`;
            } else if (num >= 10 && num <= 999) {
                return `406${prefix}${num.toString().padStart(5, '0')}`;
            }
        }
        if (mwMatch) {
            const prefix = mwMatch[1].toLowerCase();
            const num = parseInt(mwMatch[2], 10);
            if (num <= 42) {
                return `h_1265${prefix}${num.toString().padStart(5, '0')}`;
            } else if (num >= 43) {
                return `5578${prefix}${num.toString().padStart(5, '0')}`;
            }
        }
        if (jtdkMatch) {
            const prefix = jtdkMatch[1].toLowerCase();
            const num = parseInt(jtdkMatch[2], 10);
            if (num <= 23) {
                return `301${prefix}${num.toString().padStart(5, '0')}`;
            } else if (num >= 24) {
                return `h_1524${prefix}${num.toString().padStart(5, '0')}`;
            }
        }
        if (/^3DSVR-\d{3,5}$/.test(id.toUpperCase())) {
            const [prefix, num] = id.split('-');
            return '1'+prefix.toLowerCase() + num.padStart(5, '0');
        }
        if (/^HEYZO-\d{3,5}$/.test(id.toUpperCase())) {
            const [prefix, num] = id.split('-');
            return prefix.toLowerCase() + num.padStart(4, '0');
        }
        if (/^OFSD-\d{3,6}$/.test(id.toUpperCase())) {
            const [prefix, num] = id.split('-');
            return '1'+prefix.toLowerCase() + num.padStart(6, '0');
        }
        if (/^GTRP-\d{3,4}$/.test(id.toUpperCase())) {
            const [prefix, num] = id.split('-');
            return 'h_706'+prefix.toLowerCase() + num.padStart(5, '0')+"b";
        }

    const wildcardMap = {

        "M*R-A*": "406"

        // 可擴充更多萬用規則

    };



    const fullPrefixMap = {

        "MBR-BN": "5050",

        "MBR-BM": "5141"

        // 更多特定前綴對應

    };



    const prefixMap = {


        // fallback 預設

    };



    if (/^[A-Z]{2,5}-[A-Z]{2}\d{3}$/i.test(id)) {

        const [p1, p2] = id.split('-');

        const fullKey = `${p1.toUpperCase()}-${p2.slice(0, 2).toUpperCase()}`;

        // 1. 精準前綴

        if (fullPrefixMap[fullKey]) {

            const prefix = p1.toLowerCase() + p2.slice(0, 2).toLowerCase();

            const number = p2.slice(2).padStart(5, '0');

            return `${fullPrefixMap[fullKey]}${prefix}${number}`;

        }

        // 2. 萬用對應

        for (const pattern in wildcardMap) {

            const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');

            if (regex.test(fullKey)) {

                const prefix = p1.toLowerCase() + p2.slice(0, 2).toLowerCase();

                const number = p2.slice(2).padStart(5, '0');

                return `${wildcardMap[pattern]}${prefix}${number}`;

            }

        }



        // 3. fallback

        if (prefixMap[p1.toUpperCase()]) {

            const prefix = p1.toLowerCase() + p2.slice(0, 2).toLowerCase();

            const number = p2.slice(2).padStart(5, '0');

            return `${prefixMap[p1.toUpperCase()]}${prefix}${number}`;

        }

    }



    // 原始 map fallback

    const [prefix, num] = id.split('-');

    const lower = prefix?.toLowerCase() ?? '';

    const padded = num?.padStart(5, '0') ?? '';

    const map = {

        ABF: '118', ABP: '118', ABW: '118', AIDV: '41', AKDL: '1', AMBI: 'h_237', AP: '1', ARBB: 'h_092', ARSO: 'h_1378',

        BANK: 'h_1495', BEAF: 'h_1615', BF: '00', BFD: '24', BFKB: 'h_1285', BGN: '118', BKYNB: '1', BRK: '143', BTHA: '5433',

        BUNO: '301', CAND: 'h_722', CLOT: 'h_237', CSCT: '55', DANDY: '1', DAVK: '55', DLDSS: '1', DOCP: '118',

        DOKS: '36', DORI: 'h_491', DRPT: '1', DSVR: '13', DTVR: '24', DV: '53', DVAJ: '53', DVDES: '1', ECR: 'h_295',

        ELO: '767', EMTH: 'h_1638', ENFD: '5085', ENKI: '84', ETEF: 'h_706', FADSS: '1', FERA: 'h_086', FGAN: 'h_1440',

        FIR: '118', FNEO: 'h_491', FONE: 'h_491', FSDSS: '1', FSET: '1', FSRE: 'h_491', FSVR: 'h_955', FTHT: '1',

        FUGA: 'h_086', GAS: '71', GASO: 'h_906', GAR: '1', GETS: '118', GESU: '49', GG: '13', GGPVR: 'h_1472',

        GIRO: '118', GNAB: '118', GNAX: 'h_1345', GONE: 'h_1133', GOOD: '118', GRED: 'h_706', GUILD: '5170',

        GVG: '13', HAR: '118', HARU: 'h_687', HAVD: '1', HBAD: '1', HEZ: '59', HIGR: 'h_706', HGOT: '84', HMNF: 'h_172',

        HODV: '41', HONB: 'h_1133', HRAV: 'h_1763', HZ: 'h_113', HZGB: 'h_1100', HZGD: 'h_1100', IENF: '1', JBS: '118',

        JSSJ: '301', JRZE: 'h_086', JUKF: 'h_227', KBI: '118', KEED: 'h_086', KIRE: '1msfh', KIRM: 'h_1540', KMHR: '1',

        KMHRS: '1', KTRA: 'h_094', KRI: 'h_286', LBDD: 'n_1515', LOL: '12', MACB: 'h_687', MANE: '1', MAS: '118',

        MCSR: '57', MCT: '118', MDTM: 'h_585', MDS: '84', MEKO: 'h_1160', MESU: 'h_086', MIST: '1', MMB: '406',

        MOGI: '1', MOKO: 'h_254', MOND: '18', MSFH: '1', MTALL: '1', MXGS: 'h_068', NACR: 'h_237', NATR: 'h_06700',

        NEO: '433', NHDTA: '1', NHDTB: '1', NHVR: '1', NPV: '118', NTR: '1', NXGS: 'h_254', NYH: '1', OFKU: 'h_254',

        OKAX: '84', ONEZ: 'h_1674', PAKO: 'h_1133', PIYO: '1', PPT: '118', PRIAN: '5389', PYDVR: 'h_132100',

        PYM: 'h_283', RCT: '1', RCTD: '1', RDT: '118', REBD: 'h_346', REBDB: 'h_346', SAN: 'h_79600', SAIT: '55',

        SBMO: 'h_714', SBVD: '5294', SCPX: '84', SCR: '12', SDAB: '1', SDAM: '1', SDDE: '1', SDJS: '1', SDMF: '1',

        SDMM: '1', SDMU: '1', SDMUA: '1', SDNM: '1', SDNT: '1', SDTH: '1', SEVEN: '1', SENN: '1', SG: '118',

        SHH: '1', SHIC: 'h_839', SHIND: 'h_1560', SHN: '1', SILKC: '1', SKMJ: 'h_1324', SPLY: '1', SPRD: '18',

        SPRO: 'h_1594', SPZ: 'h_254', STAR: '1', START: '1', STARS: '1', STCV: 'h_1616', STKO: '1', STSK: 'h_1605',

        SUN: '1', SVDVD: '1', SVMGM: '1', SVVRT: '1', SW: '1', T28: '55', TEM: '118', THNIB: 'h_706',

        TMAVR: '55', TMHP: 'h_452', TMVI: 'h_452', TRAC: '5141', TSDS: '5013', TSDV: 'h_082',UDAK: 'h_254', UMD: '125',

        VRTM: 'h_910', WO: '1', WPS: '118', XRW: '84', YPAA: 'h_086', YSN: 'h_127', YST: '540', YURD: '5561',

        ZEAA: 'h_086', ZEX: 'h_720', GRACE: 'h_1714', COCH: 'h_706', SS: '47', ANBO: 'h_706', MBDD: '301',PRBY: 'h_706',

        MMR:'406', SXAR: '5433', GRD: '5578', BAGBD: 'h_305', PIST: '5581', LD: 'h_1231', FRNC: '5050', CRMD: '5556', BFAZ: '5601',

        SPRBD: 'h_706', OLB: 'h_706', JFIC: '5141', LOOTA: '5433', IMPNO: 'h_1154'

    };

    return map[prefix] ? `${map[prefix]}${lower}${padded}` : `${lower}${padded}`;

}
    function normalizeFC2Id(id) {
    // 處理 fc2-ppv 4707284 → FC2-PPV-4707284
    return id.replace(/(fc2)[\s-]*(ppv)[\s-]*(\d{6,7})/gi, '$1-$2-$3')
             .replace(/(fc2)[\s-]*(\d{6,7})/gi, '$1-$2')
             .toUpperCase();
}

//============================獲取影片資訊===========================
document.body.addEventListener('mouseover', (e) => {
    const vrElement = e.target.closest('.highlight-vr');
    if (!vrElement) return;
    // 獲取原始文本並標準化
    const rawId = vrElement.textContent;
    const id = normalizeFC2Id(rawId.replace(/\s+/g, '')); // 先移除所有空格再標準化
    previewWrapper.style.display = 'block';
    previewWrapper.style.width = `${settings.previewWidth}px`; // 固定寬度
    previewWrapper.style.height = 'auto'; // 高度隨內容擴展

    // 強制同步重繪以獲取正確的 offsetWidth/Height
    void previewWrapper.offsetWidth;

    // 計算避開邊界的位置（立即執行）
    setPreviewPosition(e.clientX + 20, e.clientY);
    clearTimeout(showTimeout);

    showTimeout = setTimeout(async () => {
         try {
            const result = await fetchPreviewImage(id);
            previewImg.src = result.url;

            // 顯示來源標記（調試用，正式版可移除）
            infoContainer.innerHTML = `${result.info}<div style="color:#aaa;font-size:11px;margin-top:5px;">
                圖片來源: ${result.source.image} | 資訊來源: ${result.source.info}
            </div>`;
            infoContainer.style.display = result.info ? 'block' : 'none';

            // 如果獲取資訊失敗，稍後重試
            if (!result.info) {

                setTimeout(async () => {
                    const retryInfo = await getVideoInfoFromAllSources(id);
                    infoContainer.textContent = formatVideoInfo(retryInfo) || '無法獲取影片資訊';
                    infoContainer.style.display = 'block';
                }, 500);

            }
            previewWrapper.style.display = 'block';
            // 創建全開按鈕（先創建但不添加到DOM）
            const openAllBtn = document.createElement('button'); // 改用button元素
            openAllBtn.textContent = '全開';
            openAllBtn.title = '在新分頁開啟所有搜尋結果';
            Object.assign(openAllBtn.style, {
                position: 'absolute',
                left: '0',
                bottom: '0',
                color: '#fff',
                textDecoration: 'none',
                padding: '0 4px',
                border: '1px solid #fff',
                borderRadius: '3px',
                width: '56px',
                height: '24px',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.7)',
                zIndex: '10001',
                margin: '2px',
                lineHeight: '24px',
                boxSizing: 'border-box',
                cursor: 'pointer', // 確保顯示手型指針
                display: 'none' // 初始隱藏
            });

            // 點擊事件處理（使用事件委託）
            openAllBtn.onclick = (e) => {
                e.preventDefault();
                const links = Array.from(linkContainer.querySelectorAll('a[href]'));
                if (links.length > 0) {
                    links.forEach(link => {
                        window.open(link.href, '_blank');
                    });
                }
            };

            // 重建預覽容器結構
            previewWrapper.innerHTML = '';
            previewWrapper.append(
                previewImg,
                infoContainer,
                pinToggle,
                zoomToggle,
                followToggle,
                linkContainer,
                openAllBtn // 最後添加按鈕
            );

            linkContainer.innerHTML = '<span style="color:#aaa; margin-left: 60px;">搜尋中...</span>';

// 強制重新執行繪製，無論快取與否
const sites = await searchSites(id);
linkContainer.innerHTML = ''; // 清掉「搜尋中...」
if (sites.length) {
    sites.forEach(site => {
        const a = document.createElement('a');
        a.href = site.url;
        a.textContent = site.name;
        a.target = '_blank';
        Object.assign(a.style, {
            color: '#fff',
            textDecoration: 'none',
            padding: '0 4px',
            border: '1px solid #fff',
            borderRadius: '3px',
            minWidth: '40px',
            textAlign: 'center',
            display: 'inline-block',
            margin: '2px'
        });
        linkContainer.appendChild(a);
    });
    openAllBtn.style.display = 'block';
} else {
    linkContainer.innerHTML = '<span style="color:#aaa; margin-left: 60px;">無結果</span>';
    openAllBtn.style.display = 'none';
}

        } catch (error) {
            console.warn('預覽錯誤:', error);
            previewImg.src = fallbackImageUrl;
            infoContainer.innerHTML = '• 系統錯誤\n• 請嘗試直接搜尋: ' + id;
        }

        // 調整位置
        const followMouse = GM_getValue('followMouse', defaultSettings.followMouse);
        if(followMouse){
            // 固定預覽圖大小
            previewImg.style.width = `${settings.previewWidth}px`;
            previewImg.style.height = 'auto';
            // 設置預覽頁位置（基於鼠標位置）
            setPreviewPosition(e.clientX, e.clientY);
        }
    }, settings.hoverDelay);
}, { passive: true });

    if (settings.closeOnWheel) {
        window.addEventListener('wheel', () => {
            if (!isPinned && previewWrapper.style.display === 'block') previewWrapper.style.display = 'none';
        }, { passive: true });
    }

function openSiteEditor(existing = null, index = -1) {
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: '#fff', border: '2px solid #666', padding: '20px', zIndex: 99999,
        fontSize: '14px', fontFamily: 'sans-serif', width: '400px', boxShadow: '0 0 10px #0006',
        borderRadius: '8px'
    });

    wrapper.innerHTML = `
      <h2 style="margin-top: 0">${existing ? '編輯站點' : '新增搜尋站點'}</h2>
      <label>按鈕名稱 <input id="siteName" style="width:100%" placeholder="如：PORNAV" required value="${existing?.name || ''}"></label><br><br>
      <label>搜尋URL <input id="siteUrl" style="width:100%" placeholder="https://example.com/search?q={id}" value="${existing?.url || ''}"></label><br><br>
      <label>詳細頁URL (選填) <input id="detailUrl" style="width:100%" placeholder="https://example.com/video/{id}" value="${existing?.detailUrl || ''}"></label><br><br>
      <label>關鍵字（optional）<input id="siteKeyword" style="width:100%" placeholder="如：Search Results for:" value="${existing?.keyword || ''}"></label><br><br>
      <label>title的所在容器 <input id="siteItemSelector" style="width:100%" placeholder="如：.cbp-item" value="${existing?.itemSel || ''}"></label><br><br>
      <label>title所在標籤 <input id="siteTitleSelector" style="width:100%" placeholder="如：.product-description h3 a" value="${existing?.titleSel || ''}" ${existing?.itemSel ? '' : 'disabled'}></label><br><br>
      <label>預覽圖標籤 <input id="siteImgSelector" style="width:100%" placeholder="如：a[itemprop='image']" value="${existing?.imgSel || ''}" ${existing?.itemSel ? '' : 'disabled'}></label><br><br>
      <label><input type="checkbox" id="prependHost" ${existing?.prependHost ? 'checked' : ''}> 圖片加上HOST位址</label><br><br>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
        <div>
          <label>番號處理方式</label>
          <select id="idTransform" style="width:100%">
            <option value="none" ${existing?.transformRule !== 'transformId' ? 'selected' : ''}>無</option>
            <option value="transformId" ${existing?.transformRule === 'transformId' ? 'selected' : ''}>使用 transformId(id)</option>
          </select>
        </div>
        <div>
          <label>大小寫轉換</label>
          <select id="caseTransform" style="width:100%">
            <option value="none" ${existing?.caseTransform === 'none' ? 'selected' : ''}>保持原樣</option>
            <option value="lower" ${existing?.caseTransform === 'lower' ? 'selected' : ''}>轉小寫</option>
            <option value="upper" ${existing?.caseTransform === 'upper' ? 'selected' : ''}>轉大寫</option>
          </select>
        </div>
      </div>

      <label>
        <input type="checkbox" id="removeSpecialChars" ${existing?.removeSpecialChars ? 'checked' : ''}>
        去除特殊字符（-號和空格）
      </label><br><br>

      <button id="saveSiteBtn">✅ 儲存</button>
      <button id="cancelSiteBtn">取消</button>
    `;

    document.body.appendChild(wrapper);
    const itemInput = wrapper.querySelector('#siteItemSelector');
    const titleInput = wrapper.querySelector('#siteTitleSelector');
    const imgInput = wrapper.querySelector('#siteImgSelector');
    itemInput.addEventListener('input', () => {
        const filled = itemInput.value.trim();
        titleInput.disabled = !filled;
        imgInput.disabled = !filled;
    });

    wrapper.querySelector('#saveSiteBtn').onclick = () => {
        const siteName = wrapper.querySelector('#siteName').value.trim();
        const siteUrl = wrapper.querySelector('#siteUrl').value.trim();
        const detailUrl = wrapper.querySelector('#detailUrl').value.trim();

        // 檢查必要欄位
        if (!siteName) return alert('請填寫按鈕名稱');
        if (!siteUrl && !detailUrl) return alert('請至少填寫搜尋URL或詳細頁URL');

        // 驗證URL格式
        if (siteUrl && !/^https?:\/\//i.test(siteUrl)) {
            return alert('搜尋URL必須以http://或https://開頭');
        }
        if (detailUrl && !/^https?:\/\//i.test(detailUrl)) {
            return alert('詳細頁URL必須以http://或https://開頭');
        }

        const site = {
            name: siteName,
            url: siteUrl,
            detailUrl: detailUrl,
            keyword: wrapper.querySelector('#siteKeyword').value.trim(),
            itemSel: wrapper.querySelector('#siteItemSelector').value.trim(),
            titleSel: wrapper.querySelector('#siteTitleSelector').value.trim(),
            imgSel: wrapper.querySelector('#siteImgSelector').value.trim(),
            prependHost: wrapper.querySelector('#prependHost').checked,
            transformRule: wrapper.querySelector('#idTransform').value,
            caseTransform: wrapper.querySelector('#caseTransform').value,
            removeSpecialChars: wrapper.querySelector('#removeSpecialChars').checked,
            checkAvailability: async function(id) {
                return checkSiteWithRetry(this, id);
            },
            getPreviewImage: async function(id) {
                try {
                    // 如果有詳細頁URL且沒有設定選擇器，直接使用詳細頁URL
                    if (this.detailUrl && (!this.itemSel || !this.imgSel)) {
                        const transformedId = this.transformRule === 'transformId' ? transformId(id) : id;
                        const cleanId = this.removeSpecialChars ? transformedId.replace(/[-_\s]/g, '') : transformedId;
                        const finalId = this.caseTransform === 'lower' ? cleanId.toLowerCase() :
                                       this.caseTransform === 'upper' ? cleanId.toUpperCase() : cleanId;

                        const url = this.detailUrl.replace('{id}', encodeURIComponent(finalId));
                        const imgUrl = this.prependHost ? await getAbsoluteImageUrl(url, this.imgSel) :
                                      await getImageFromSource(url, this.imgSel || 'img');
                        return imgUrl || null;
                    }

                    // 正常處理流程
                    const transformedId = this.transformRule === 'transformId' ? transformId(id) : id;
                    const cleanId = this.removeSpecialChars ? transformedId.replace(/[-_\s]/g, '') : transformedId;
                    const finalId = this.caseTransform === 'lower' ? cleanId.toLowerCase() :
                                   this.caseTransform === 'upper' ? cleanId.toUpperCase() : cleanId;

                    const url = this.url.replace('{id}', encodeURIComponent(finalId));
                    const result = await this.searchItems(id);

                    // 增強錯誤檢查
                    if (!result?.items?.length) return null;

                    const firstItem = result.items[0];
                    const imgElement = firstItem.querySelector(this.imgSel);

                    if (!imgElement) return null;
                    let imgUrl = imgElement.src || imgElement.href;
                    if (!imgUrl) return null;

                    // 如果需要加上HOST位址且是相對路徑
                    if (this.prependHost && imgUrl.startsWith('/')) {
                        const domain = extractDomain(url);
                        if (domain) {
                            imgUrl = `https://${domain}${imgUrl}`;
                        }
                    }
                    console.log(`[${imgUrl}] [${this.name}]獲取預覽圖:`);
                    return imgUrl;
                } catch (e) {
                    console.warn(`[${this.name}] 獲取預覽圖錯誤:`, e);
                    return null;
                }
            }
        };

        const list = GM_getValue('customSites', []);
        if (index >= 0) list[index] = site;
        else list.push(site);
        GM_setValue('customSites', list);

        // 將新站點加入第一層檢查
        if (index === -1) { // 只有新增站點時才執行
        const tiers = GM_getValue('simpleSearchTiers', defaultSettings.simpleSearchTiers);
            if (!tiers[0].includes(site.name)) {
                tiers[0].push(site.name);
                GM_setValue('simpleSearchTiers', tiers);
            }
        }

        addDomainForSite(site.url);
        if (site.detailUrl) addDomainForSite(site.detailUrl);

        alert(`已${index >= 0 ? '更新' : '新增'}站點：${site.name}`);
        wrapper.remove();
        location.reload();
    };

    wrapper.querySelector('#cancelSiteBtn').onclick = () => wrapper.remove();
}

// 輔助函數：獲取絕對圖片URL
async function getAbsoluteImageUrl(pageUrl, selector) {
    return new Promise((resolve) => {
        safeRequest({
            method: "GET",
            url: pageUrl,
            timeout: 2500,
            onload: function(response) {
                try {
                    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                    const img = doc.querySelector(selector);
                    if (!img) return resolve(null);

                    let imgUrl = img.src || img.href;
                    if (!imgUrl) return resolve(null);

                    // 如果是相對路徑，轉換為絕對路徑
                    if (imgUrl.startsWith('/')) {
                        const domain = extractDomain(pageUrl);
                        if (domain) {
                            imgUrl = `https://${domain}${imgUrl}`;
                            console.log(`[${this.name}]'輸出的圖片路徑:'`,imgUrl)
                        }
                    }

                    resolve(imgUrl);
                } catch (e) {
                    resolve(null);
                }
            },
            onerror: () => resolve(null)
        });
    });
}

function manageCustomSites() {
    const customSites = GM_getValue('customSites', []);
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: '#fff', padding: '20px', zIndex: 99999, border: '2px solid #999',
        fontSize: '14px', fontFamily: 'sans-serif', width: '420px', boxShadow: '0 0 12px #0006',
        borderRadius: '10px', maxHeight: '80vh', overflowY: 'auto'
    });

    // 標題和清空按鈕
    const titleContainer = document.createElement('div');
    titleContainer.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;';

    const title = document.createElement('h3');
    title.textContent = '🛠 自訂站點清單';
    title.style.margin = '0';

    const clearAllBtn = document.createElement('button');
    clearAllBtn.textContent = '🗑️ 清空全部';
    clearAllBtn.style.cssText = 'background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;';

    titleContainer.appendChild(title);
    titleContainer.appendChild(clearAllBtn);
    panel.appendChild(titleContainer);

    // 清空按鈕點擊事件
    clearAllBtn.addEventListener('click', () => {
        if (customSites.length === 0) {
            alert('目前沒有自訂站點可清除');
            return;
        }

        if (confirm('⚠️ 真的要清空所有自訂站點嗎？此操作無法復原！')) {
            GM_setValue('customSites', []);
            alert('已清除所有自訂站點');
            panel.remove();
            manageCustomSites(); // 重新載入管理界面
        }
    });

    // 顯示站點列表
    customSites.forEach((site, i) => {
        const entry = document.createElement('div');
        entry.style.cssText = 'margin-bottom: 12px; padding: 6px; border-bottom: 1px solid #ccc';
        entry.innerHTML = `
          <strong>${site.name}</strong><br>
          <code>${site.url}</code><br>
          <button data-edit="${i}">✏️ 編輯</button>
          <button data-del="${i}">🗑 刪除</button>
        `;
        panel.appendChild(entry);
    });

    // 關閉按鈕
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '關閉';
    closeBtn.style.cssText = 'margin-top: 10px; padding: 5px 15px; background: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; cursor: pointer;';
    closeBtn.onclick = () => panel.remove();
    panel.appendChild(closeBtn);

    // 編輯和刪除按鈕事件
    panel.querySelectorAll('button[data-edit]').forEach(btn => {
        btn.onclick = () => {
            const i = parseInt(btn.dataset.edit);
            panel.remove();
            openSiteEditor(customSites[i], i);
        };
    });

    panel.querySelectorAll('button[data-del]').forEach(btn => {
        btn.onclick = () => {
            const i = parseInt(btn.dataset.del);
            const siteName = customSites[i].name;

            if (!confirm(`確定刪除「${siteName}」？這將從所有區域移除該站點。`)) return;

            customSites.splice(i, 1);
            GM_setValue('customSites', customSites);

            const tiers = GM_getValue('simpleSearchTiers', defaultSettings.simpleSearchTiers);
            const newTiers = tiers.map(tier => tier.filter(s => s !== siteName));
            GM_setValue('simpleSearchTiers', newTiers);

            let previewOrder = GM_getValue('previewSourcesOrder', []);
            previewOrder = previewOrder.filter(s => s !== siteName);
            GM_setValue('previewSourcesOrder', previewOrder);

            let disabledSources = GM_getValue('disabledPreviewSources', []);
            disabledSources = disabledSources.filter(s => s !== siteName);
            GM_setValue('disabledPreviewSources', disabledSources);

            settings.simpleSearchTiers = newTiers;
            settings.disabledPreviewSources = disabledSources;

            SITES = SITES.filter(s => s.name !== siteName);
            GLOBAL_PREVIEW_SOURCES = GLOBAL_PREVIEW_SOURCES.filter(s => s.name !== siteName);

            alert(`已刪除「${siteName}」並從所有區域移除`);
            location.reload();
            manageCustomSites();
        };
    });

    document.body.appendChild(panel);
}

function showHoverSettings() {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2c3e50;
            padding: 20px;
            border-radius: 10px;
            z-index: 99999;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            width: 500px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            border: 2px solid #3498db;
        `;

        wrapper.innerHTML = `
            <h3 style="margin-top: 0; color: #3498db; border-bottom: 1px solid #3498db; padding-bottom: 10px;">
                <i class="fas fa-cog" style="margin-right: 10px;"></i>
                HOVER抓圖域名管理
            </h3>

            <div style="margin: 15px 0;">
                <h4 style="color: #2ecc71; margin-bottom: 10px;">
                    <i class="fas fa-check-circle" style="margin-right: 8px;"></i>
                    永久允許的域名
                </h4>
                <div id="hoverDomainsList" style="background: #34495e; border-radius: 5px; padding: 10px; max-height: 200px; overflow-y: auto;">
                    ${hoverDomains.map(domain => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #3d566e;">
                            <span>${domain}</span>
                            <button data-domain="${domain}" class="removeDomainBtn" style="background: #e74c3c; color: white; border: none; border-radius: 3px; padding: 3px 8px; cursor: pointer;">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    `).join('')}
                    ${hoverDomains.length === 0 ? '<p style="text-align: center; color: #7f8c8d;">暫無永久允許的域名</p>' : ''}
                </div>
                <div style="display: flex; margin-top: 10px;">
                    <input type="text" id="newHoverDomain" placeholder="輸入新域名 (不含http://)" style="flex-grow: 1; padding: 8px; border: 1px solid #3d566e; border-radius: 5px 0 0 5px; background: #34495e; color: white;">
                    <button id="addHoverDomainBtn" style="padding: 8px 15px; background: #2ecc71; color: white; border: none; border-radius: 0 5px 5px 0; cursor: pointer;">
                        <i class="fas fa-plus"></i> 添加
                    </button>
                </div>
            </div>

            <div style="margin: 20px 0;">
                <h4 style="color: #f39c12; margin-bottom: 10px;">
                    <i class="fas fa-clock" style="margin-right: 8px;"></i>
                    暫時允許的域名 (1小時)
                </h4>
                <div id="learnedDomainsList" style="background: #34495e; border-radius: 5px; padding: 10px; max-height: 200px; overflow-y: auto;">
                    ${Object.keys(learnedDomains)
                        .filter(domain => learnedDomains[domain] > Date.now())
                        .map(domain => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #3d566e;">
                                <span>${domain}</span>
                                <div>
                                    <span style="color: #bdc3c7; font-size: 0.8em; margin-right: 10px;">
                                        剩餘 ${Math.round((learnedDomains[domain] - Date.now()) / 60000)} 分鐘
                                    </span>
                                    <button data-domain="${domain}" class="removeLearnedBtn" style="background: #e74c3c; color: white; border: none; border-radius: 3px; padding: 3px 8px; cursor: pointer;">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    ${Object.keys(learnedDomains).filter(domain => learnedDomains[domain] > Date.now()).length === 0
                        ? '<p style="text-align: center; color: #7f8c8d;">暫無暫時允許的域名</p>'
                        : ''}
                </div>
                <button id="clearExpiredBtn" style="margin-top: 10px; padding: 8px 15px; background: #34495e; color: white; border: 1px solid #3d566e; border-radius: 5px; cursor: pointer; width: 100%;">
                    <i class="fas fa-broom" style="margin-right: 8px;"></i> 清除已過期的域名
                </button>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
                <button id="closeDomainManagerBtn" style="padding: 8px 15px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-times" style="margin-right: 8px;"></i> 關閉
                </button>
            </div>
        `;

        document.body.appendChild(wrapper);

        // 添加Font Awesome圖標
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
        document.head.appendChild(fa);

        // 添加域名
        wrapper.querySelector('#addHoverDomainBtn').onclick = () => {
            const domain = wrapper.querySelector('#newHoverDomain').value.trim().replace(/^https?:\/\//, '');
            if (!domain) return;

            if (!hoverDomains.includes(domain)) {
                hoverDomains.push(domain);
                GM_setValue(HOVER_DOMAINS_KEY, hoverDomains);

                // 更新顯示
                const domainItem = document.createElement('div');
                domainItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #3d566e;';
                domainItem.innerHTML = `
                    <span>${domain}</span>
                    <button data-domain="${domain}" class="removeDomainBtn" style="background: #e74c3c; color: white; border: none; border-radius: 3px; padding: 3px 8px; cursor: pointer;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;

                wrapper.querySelector('#hoverDomainsList').appendChild(domainItem);
                wrapper.querySelector('#newHoverDomain').value = '';

                // 添加刪除事件
                domainItem.querySelector('.removeDomainBtn').onclick = function() {
                    const domainToRemove = this.getAttribute('data-domain');
                    hoverDomains = hoverDomains.filter(d => d !== domainToRemove);
                    GM_setValue(HOVER_DOMAINS_KEY, hoverDomains);
                    domainItem.remove();
                };
            }
        };

        // 刪除永久域名
        wrapper.querySelectorAll('.removeDomainBtn').forEach(btn => {
            btn.onclick = function() {
                const domain = this.getAttribute('data-domain');
                hoverDomains = hoverDomains.filter(d => d !== domain);
                GM_setValue(HOVER_DOMAINS_KEY, hoverDomains);
                this.parentElement.remove();
            };
        });
        // 清除過期的域名
        wrapper.querySelector('#clearExpiredBtn').onclick = () => {
            const now = Date.now();
            Object.keys(learnedDomains).forEach(domain => {
                if (learnedDomains[domain] <= now) {
                    delete learnedDomains[domain];
                }
            });
            GM_setValue(LEARNED_DOMAINS_KEY, learnedDomains);

            // 重新載入列表
            wrapper.querySelector('#learnedDomainsList').innerHTML =
                Object.keys(learnedDomains)
                    .filter(domain => learnedDomains[domain] > now)
                    .map(domain => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #3d566e;">
                            <span>${domain}</span>
                            <div>
                                <span style="color: #bdc3c7; font-size: 0.8em; margin-right: 10px;">
                                    剩餘 ${Math.round((learnedDomains[domain] - now) / 60000)} 分鐘
                                </span>
                                <button data-domain="${domain}" class="removeLearnedBtn" style="background: #e74c3c; color: white; border: none; border-radius: 3px; padding: 3px 8px; cursor: pointer;">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    `).join('') || '<p style="text-align: center; color: #7f8c8d;">暫無暫時允許的域名</p>';

            // 重新綁定刪除事件
            wrapper.querySelectorAll('.removeLearnedBtn').forEach(btn => {
                btn.onclick = function() {
                    const domain = this.getAttribute('data-domain');
                    delete learnedDomains[domain];
                    GM_setValue(LEARNED_DOMAINS_KEY, learnedDomains);
                    this.closest('div').remove();
                };
            });
        };

        // 關閉管理器
        wrapper.querySelector('#closeDomainManagerBtn').onclick = () => {
            wrapper.remove();
        };
    };

    GM_registerMenuCommand('管理連接域名', showDomainManager);
    GM_registerMenuCommand("AV預覽設定選單", createSettingsMenu);
    GM_registerMenuCommand("清除所有快取", clearAllCache);
    GM_registerMenuCommand('切換預覽頁跟隨鼠標', () => {
        settings.followMouse = !settings.followMouse;
        GM_setValue('followMouse', settings.followMouse);
        alert(`預覽頁跟隨鼠標功能已${settings.followMouse ? '開啟' : '關閉'}`);
    });
    GM_registerMenuCommand('切換精簡搜尋模式', () => {
        settings.simpleSearch = !settings.simpleSearch;
        GM_setValue('simpleSearch', settings.simpleSearch);
        alert(`精簡搜尋模式已${settings.simpleSearch ? '開啟' : '關閉'}`);
    });
    GM_registerMenuCommand('➕ 新增搜尋站點', () => openSiteEditor());
    GM_registerMenuCommand('🛠 編輯自訂站點', () => manageCustomSites());
    GM_registerMenuCommand('懸停Link抓圖', () => showHoverSettings());

    function showDomainManager() {
        const manager = document.createElement('div');
        manager.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 2px solid #666;
            z-index: 99999;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            border-radius: 10px;
            font-family: sans-serif;
        `;

        manager.innerHTML += `
            <h2 style="margin-top:0;color:#333;">管理連接域名</h2>
            <p style="color:#666;font-size:14px;">
                這些是腳本能訪問的域名。新增站點時會自動添加域名。
            </p>

            <div style="margin:15px 0;">
                <h3 style="margin-bottom:10px;">預定義域名</h3>
                <div id="predefined-domains" style="
                    background: #f9f9f9;
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                "></div>

                <h3 style="margin-bottom:10px;">自訂域名</h3>
                <div id="custom-domains" style="
                    background: #f0f7ff;
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                "></div>
            </div>

            <div style="left:15px;">
            <label>
                    <input type="checkbox" id="allowAllDomains" ${customDomains.includes('*') ? 'checked' : ''}>
                    全域允許（危險,僅在測試時用）
            </label>
            </div>
            <div style="display:flex;justify-content:space-between;">
                <button id="closeDomainManager" style="
                    padding: 8px 15px;
                    background: #f0f0f0;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    cursor: pointer;
                ">關閉</button>
            </div>
        `;




        // 處理通配符選項
        manager.querySelector('#allowAllDomains').addEventListener('change', function() {
            if (this.checked) {
                customDomains = ['*'];
            } else {
                customDomains = GM_getValue(CUSTOM_DOMAINS_KEY, []).filter(d => d !== '*');
            }
            GM_setValue(CUSTOM_DOMAINS_KEY, customDomains);
        });

        document.body.appendChild(manager);

        // 渲染域名列表
        renderDomains();

        // 關閉按鈕
        manager.querySelector('#closeDomainManager').onclick = () => {
            manager.remove();
        };

        function renderDomains() {
            const predefinedContainer = manager.querySelector('#predefined-domains');
            predefinedContainer.innerHTML = predefinedDomains.map(domain => `
                <div style="
                    padding: 8px;
                    margin: 5px 0;
                    background: #e8f5e9;
                    border-radius: 4px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <span>${domain}</span>
                    <span style="color:#666;">系統預設</span>
                </div>
            `).join('');

            const customContainer = manager.querySelector('#custom-domains');
            if (customDomains.length === 0) {
                customContainer.innerHTML = `<div style="text-align:center;padding:20px;color:#888;">暫無自訂域名</div>`;
            } else {
                customContainer.innerHTML = customDomains.map((domain, index) => `
                    <div style="
                        padding: 8px;
                        margin: 5px 0;
                        background: #e3f2fd;
                        border-radius: 4px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <span>${domain}</span>
                        <button data-index="${index}" style="
                            background: #ffebee;
                            border: 1px solid #ffcdd2;
                            border-radius: 3px;
                            padding: 3px 8px;
                            cursor: pointer;
                            color: #c62828;
                        ">刪除</button>
                    </div>
                `).join('');

                // 添加刪除事件
                customContainer.querySelectorAll('button').forEach(btn => {
                    btn.onclick = () => {
                        const index = parseInt(btn.dataset.index);
                        customDomains.splice(index, 1);
                        GM_setValue(CUSTOM_DOMAINS_KEY, customDomains);
                        renderDomains();
                    };
                });
            }
        }
    }

    function createSettingsMenu() {
    // ======================
    // 1. 創建設定選單容器
    // ======================
    const style = document.createElement('style');
style.textContent = `
  .search-button {
    color: #fff;
    text-decoration: none;
    padding: 0 4px;
    border: 1px solid #fff;
    border-radius: 3px;
    width: 60px;
    height: 24px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
    font-size: 12px;
    transition: all 0.3s ease;
    margin: 2px;
  }

  .search-button.checking {
    opacity: 0.6;
    border-style: dashed;
  }

  .search-button.available {
    opacity: 1;
    border-style: solid;
    background: rgba(0,255,0,0.1);
  }

  .search-button.unavailable {
    opacity: 0.3;
  }

  .search-button.btncheckoff {
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  border-color: #ff00ff;
  color: white;
  font-weight: bold;
  box-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
  }

  .search-button.btncheckoff:hover {
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.8);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}
.btncheckoff {
      background-color: #FF5722;
      color: white;
      border: none;
      padding: 6px 12px;
      margin: 2px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      transition: all 0.3s;
      box-shadow: 0 0 5px rgba(255, 87, 34, 0.7);
    }

    .btncheckoff:hover {
      background-color: #f4511e;
      box-shadow: 0 0 10px rgba(255, 87, 34, 0.9);
      transform: translateY(-1px);
    }
`;
document.head.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff;
        border: 1px solid #ccc;
        padding: 15px;
        z-index: 100000;
        font-size: 14px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        width: 500px;
        max-height: 90vh;
        overflow-y: auto;
    `;

    // ======================
    // 2. 基本設定區塊
    // ======================
    wrapper.innerHTML = `
        <h2 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:5px;">AV預覽設定選單</h2>

        <!-- 基本設定區塊 -->
        <div>
            <div><label>文字標記顏色: <input type="color" id="highlightColorPicker" value="${settings.highlightColor}"></label></div>
            <div><label>懸停延遲: <input type="range" id="hoverDelay" min="100" max="2000" value="${settings.hoverDelay}" step="50">
                  <span id="hoverDelayValue">${settings.hoverDelay}</span> ms</label></div>
            <div><label>預覽圖寬度: <input type="range" id="previewWidth" min="50" max="1000" value="${settings.previewWidth}" step="10">
                  <span id="previewWidthValue">${settings.previewWidth}</span> px</label></div>
            <div><label>滑鼠滾動關閉預覽: <input type="checkbox" id="closeOnWheel" ${settings.closeOnWheel ? 'checked' : ''}></label></div>
            <div><label>預覽跟隨鼠標: <input type="checkbox" id="followMouse" ${settings.followMouse ? 'checked' : ''}></label></div>
            <div><label>精簡搜尋模式: <input type="checkbox" id="simpleSearch" ${settings.simpleSearch ? 'checked' : ''}></label></div>
            <div><label>HOVER模糊搜尋: <input type="checkbox" id="hoverFuzzySearch" ${settings.hoverFuzzySearch ? 'checked' : ''}></label></div>
        </div>

        <!-- 精簡搜尋層級設置區塊 -->
        <div style="margin-top:20px; border-top:1px solid #ddd; padding-top:15px;">
            <h3 style="margin-bottom:10px;">精簡搜尋層級設置</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div class="tier-box" data-tier="1" style="border: 2px dashed #aaa; padding: 10px; min-height: 120px; background: #f9f9f9;">
                    <div style="font-weight: bold; margin-bottom: 8px; color: #2196F3;">第一層檢查</div>
                    <div class="tier-items">${renderTierItems(settings.simpleSearchTiers[0], 0)}</div>
                </div>
                <div class="tier-box" data-tier="2" style="border: 2px dashed #aaa; padding: 10px; min-height: 120px; background: #f9f9f9;">
                    <div style="font-weight: bold; margin-bottom: 8px; color: #4CAF50;">第二層檢查</div>
                    <div class="tier-items">${renderTierItems(settings.simpleSearchTiers[1], 1)}</div>
                </div>
                <div class="tier-box" data-tier="3" style="border: 2px dashed #aaa; padding: 10px; min-height: 120px; background: #f9f9f9;">
                    <div style="font-weight: bold; margin-bottom: 8px; color: #9C27B0;">其他站點</div>
                    <div class="tier-items">${renderTierItems(settings.simpleSearchTiers[2], 2)}</div>
                </div>
            </div>

            <div id="available-sites" style="background: #f5f5f5; padding: 10px; border-radius: 4px;">
                <div style="font-weight: bold; margin-bottom: 8px;">可用站點（拖曳到上方層級）:</div>
                <div class="available-items" style="display: flex; flex-wrap: wrap; gap: 5px;">
                    ${renderAvailableSites()}
                </div>
            </div>
        </div>

        <!-- 預覽圖來源區塊 -->
        <div style="margin-top:20px; border-top:1px solid #ddd; padding-top:15px;">
            <h3 style="margin-bottom:10px;">預覽圖來源</h3>
            <div style="font-size:12px; color:#666; margin-bottom:10px;">
                按下x移動到棄用取圖區,可放棄從站點搜圖
            </div>
            <div id="preview-sources-order" style="
                background: #f5f5f5;
                padding: 10px;
                border-radius: 4px;
                max-height: 300px;
                overflow-y: auto;
            ">
                ${renderPreviewSourcesOrder()}
            </div>
        </div>

        <!-- 棄用取圖區塊 -->
        <div style="margin-top:20px; border-top:1px solid #ddd; padding-top:15px;">
            <h3 style="margin-bottom:10px;">棄用取圖區</h3>
            <div style="font-size:12px; color:#666; margin-bottom:10px;">
                此區域的站點將不會進行圖片抓取
            </div>
            <div id="disabled-preview-sources" style="
                background: #ffeeee;
                padding: 10px;
                border-radius: 4px;
                max-height: 300px;
                overflow-y: auto;
            ">
                ${renderDisabledPreviewSources()}
            </div>
        </div>

        <!-- 按鈕區塊 -->
        <div style="margin-top: 20px; display: flex; justify-content: space-between;">
            <button id="resetDefaults" style="padding: 5px 10px;">恢復預設值</button>
            <button id="saveSettings" style="padding: 5px 15px; background: #4CAF50; color: white;">保存所有設定</button>
        </div>
    `;

    // ======================
    // 3. 工具提示功能
    // ======================
    const tooltips = {
        highlightColorPicker: '設置高亮標記的背景顏色',
        hoverDelay: '鼠標懸停後顯示預覽的延遲時間（毫秒）',
        previewWidth: '預覽圖片的寬度（像素）',
        closeOnWheel: '啟用後，滾動鼠標滾輪會關閉預覽窗口',
        followMouse: '啟用後，預覽窗口會跟隨鼠標位置',
        simpleSearch: '啟用後，使用分層搜尋策略提高效率',
        hoverFuzzySearch: '啟用後，使用更寬鬆的圖片匹配規則',
        resetDefaults: '恢復所有設定為默認值',
        saveSettings: '保存當前所有設定'
    };

    // 為每個選項添加提示
    Object.keys(tooltips).forEach(id => {
        const element = wrapper.querySelector('#' + id);
        if (!element) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = tooltips[id];

        // 樣式設置
        Object.assign(tooltip.style, {
            position: 'absolute',
            left: 'calc(100% + 10px)',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            opacity: '0',
            transition: 'opacity 0.2s',
            zIndex: '100001'
        });

        // 容器需要相對定位
        element.parentNode.style.position = 'relative';
        element.parentNode.appendChild(tooltip);

        // 懸停事件
        element.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });
        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });

    // ======================
    // 4. 拖放功能初始化
    // ======================
    initDragAndDropSimple(wrapper);

        // 在 createSettingsMenu 函數中添加專用樣式
const orderStyle = document.createElement('style');
orderStyle.textContent = `
    .preview-order-item.dragging {
        opacity: 0.5;
        background: #f0f0f0 !important;
    }
    .preview-order-item:hover {
        background: #f5f5f5 !important;
    }
    .order-ghost-active {
        opacity: 0.8 !important;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
        transform: rotate(2deg) !important;
    }
    .order-drag-placeholder {
        height: 2px;
        background: #2196F3;
        margin: 5px 0;
    }
    #preview-sources-order {
        min-height: 100px;
    }
`;
wrapper.appendChild(orderStyle);

    // ======================
    // 5. 事件監聽器綁定
    // ======================
    bindEventListeners(wrapper);

    // ======================
    // 6. 關閉按鈕
    // ======================
    const closeBtn = document.createElement('div');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 20px;
        cursor: pointer;
        color: #999;
    `;
    closeBtn.addEventListener('click', () => wrapper.remove());
    wrapper.appendChild(closeBtn);

    // ======================
    // 7. 添加到DOM
    // ======================
    document.body.appendChild(wrapper);
}


// 渲染棄用取圖區（只顯示被棄用的來源）
function renderDisabledPreviewSources() {
    return settings.disabledPreviewSources.map((psource, pindex) => `
        <div class="disabled-source-item"
             data-name="${psource}"
             data-index="${pindex}"
             style="padding: 8px; margin: 5px 0;
                    background: #ffdddd; border: 1px solid #ff9999;
                    border-radius: 4px; cursor: move;
                    display: flex; justify-content: space-between;
                    align-items: center;">
            <span>${psource}</span>
            <button class="restore-source" style="cursor:pointer;">↑</button>
        </div>
    `).join('');
}

// 修改 renderPreviewSourcesOrder 函數
function renderPreviewSourcesOrder() {
    const disabledSet = new Set(settings.disabledPreviewSources);
    const activeSources = GLOBAL_PREVIEW_SOURCES.filter(s => !disabledSet.has(s.name));
    return activeSources.map((source, index) => `
        <div class="preview-source-item"
             data-name="${source.name}"
             data-index="${index}"
             style="padding: 8px; margin: 5px 0;
                    background: #fff; border: 1px solid #ddd;
                    border-radius: 4px; cursor: pointer;
                    display: flex; justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s ease;
                    position: relative;">
            <div style="flex-grow: 1; display: flex; align-items: center;">
                <span class="item-number" style="margin-right: 10px; color: #666; min-width: 20px; text-align: right;">${index + 1}.</span>
                <span class="item-name">${source.name}</span>
            </div>
            <button class="remove-source" style="cursor: pointer; color: #ff5252; background: none; border: none;">×</button>
        </div>
    `).join('');
}

function initClickToSwap(wrapper) {
    let selectedItem = null;
    const container = wrapper.querySelector('#preview-sources-order');

    // 點擊項目處理
    container.addEventListener('click', (e) => {
        const targetItem = e.target.closest('.preview-source-item');
        const removeBtn = e.target.closest('.remove-source');

        // 如果點擊的是刪除按鈕，不處理交換
        if (removeBtn) return;

        if (!targetItem) {
            // 點擊空白處取消選擇
            if (selectedItem) {
                resetItemStyle(selectedItem);
                selectedItem = null;
            }
            return;
        }

        // 如果沒有已選中的項目，選中當前項目
        if (!selectedItem) {
            selectedItem = targetItem;
            setSelectedStyle(selectedItem);
            return;
        }

        // 如果點擊的是已選中的項目，取消選中
        if (selectedItem === targetItem) {
            resetItemStyle(selectedItem);
            selectedItem = null;
            return;
        }

        // 交換兩個項目的位置
        swapItems(selectedItem, targetItem);

        // 重置選中狀態
        resetItemStyle(selectedItem);
        selectedItem = null;
    });
    previewWrapper.style.width = `${settings.previewWidth}px`; // 固定寬度
    previewWrapper.style.height = 'auto'; // 高度隨內容擴展

    // 強制同步重繪以獲取正確的 offsetWidth/Height
    void previewWrapper.offsetWidth;



    // 設置選中項目的樣式（低調半透明浮起）
    function setSelectedStyle(item) {
        item.style.opacity = '0.7';
        item.style.transform = 'translateY(-3px)';
        item.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        item.style.border = '1px solid #ddd';
        item.style.backgroundColor = '#f9f9f9';
    }

    // 設置目標項目的高亮樣式（亮橘色顯眼）
    function setTargetStyle(item) {
        item.style.border = '2px solid #FF9800';
        item.style.backgroundColor = '#FFF3E0';

        // 添加交換指示器（小星星）
        const indicator = document.createElement('span');
        indicator.className = 'swap-indicator';
        indicator.innerHTML = '★';
        indicator.style.cssText = `
            position: absolute;
            left: 5px;
            top: 50%;
            transform: translateY(-50%);
            color: #FF9800;
            font-size: 12px;
        `;
        item.prepend(indicator);
    }

    // 重置項目樣式
    function resetItemStyle(item) {
        item.style.opacity = '1';
        item.style.transform = '';
        item.style.boxShadow = '';
        item.style.border = '1px solid #ddd';
        item.style.backgroundColor = '#fff';

        // 移除交換指示器
        const indicator = item.querySelector('.swap-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // 鼠標移入效果
    container.addEventListener('mouseover', (e) => {
        if (!selectedItem) return;

        const hoverItem = e.target.closest('.preview-source-item');
        if (!hoverItem || hoverItem === selectedItem) return;

        // 移除所有其他項目的高亮樣式
        container.querySelectorAll('.preview-source-item').forEach(item => {
            if (item !== selectedItem) {
                resetItemStyle(item);
            }
        });

        // 設置當前懸停項目的高亮樣式
        setTargetStyle(hoverItem);
    });

    // 鼠標移出效果
    container.addEventListener('mouseout', (e) => {
        if (!selectedItem) return;

        const hoverItem = e.target.closest('.preview-source-item');
        if (!hoverItem || hoverItem === selectedItem) return;

        // 不移除樣式，保持最後懸停項目的高亮狀態
    });

    // 交換兩個項目的位置
    function swapItems(item1, item2) {
        // 獲取兩個項目的位置
        const index1 = Array.from(container.children).indexOf(item1);
        const index2 = Array.from(container.children).indexOf(item2);

        if (index1 === index2) return;

        // 交換DOM位置
        if (index1 < index2) {
            item2.parentNode.insertBefore(item1, item2.nextSibling);
            item1.parentNode.insertBefore(item2, container.children[index1]);
        } else {
            item1.parentNode.insertBefore(item2, item1.nextSibling);
            item2.parentNode.insertBefore(item1, container.children[index2]);
        }

        // 直接交換數字標籤內容
        const item1Number = item1.querySelector('.item-number');
        const item2Number = item2.querySelector('.item-number');
        const tempNumber = item1Number.textContent;
        item1Number.textContent = item2Number.textContent;
        item2Number.textContent = tempNumber;

        // 更新全局順序並保存
        updatePreviewSourceOrder();
    }

    // 更新預覽來源順序
    function updatePreviewSourceOrder() {
        const items = container.querySelectorAll('.preview-source-item');
        const newOrder = Array.from(items).map(item => item.dataset.name);
        const disabledSet = new Set(settings.disabledPreviewSources);

        // 重新排序 GLOBAL_PREVIEW_SOURCES
        const newSources = [];
        newOrder.forEach(name => {
            const source = GLOBAL_PREVIEW_SOURCES.find(s => s.name === name);
            if (source) newSources.push(source);
        });

        // 添加被禁用的來源（保持原順序）
        GLOBAL_PREVIEW_SOURCES.forEach(source => {
            if (disabledSet.has(source.name) && !newSources.includes(source)) {
                newSources.push(source);
            }
        });

        GLOBAL_PREVIEW_SOURCES = newSources;
        GM_setValue('previewSourcesOrder', newOrder);
    }
}

//==============================================================
function renderTierItems(tierSites, tierIndex) {
    const uniqueSites = [...new Set(tierSites)];

    return uniqueSites.map(site => {
        // 根據層級決定背景色
        let bgColor;
        if (tierIndex === 0) bgColor = '#BBDEFB'; // 第一層 - 藍色
        else if (tierIndex === 1) bgColor = '#C8E6C9'; // 第二層 - 綠色
        else bgColor = '#E1BEE7'; // 第三層 - 紫色

        return `
            <div class="site-item" draggable="true" data-site="${site}"
                 style="padding: 4px 8px; margin: 2px 0; background: ${bgColor};
                        border-radius: 3px; cursor: move;
                        display: flex; align-items: center; justify-content: space-between;">
                <span>${site}</span>
                <span class="remove-item" style="margin-left: 5px; color: #666; cursor: pointer;">×</span>
            </div>
        `;
    }).join('');
}

function renderAvailableSites() {
    const usedSites = [
        ...settings.simpleSearchTiers[0],
        ...settings.simpleSearchTiers[1],
        ...settings.simpleSearchTiers[2]
    ];

    const availableSites = SITES.map(s => s.name)
        .filter(name => !usedSites.includes(name));

    return availableSites.map(site => `
        <div class="site-item" draggable="true" data-site="${site}"
             style="padding: 4px 8px; background: #FFECB3; border-radius: 3px;
                    cursor: move; display: inline-flex; align-items: center;">
            ${site}
        </div>
    `).join('');
}

//精簡搜尋層級設置拖動事件處理
function initDragAndDropSimple(wrapper) {
    let draggedItem = null;
    let dragCounter = 0; // 新增拖曳計數器防止過度觸發
    const DRAG_THROTTLE = 50; // 拖曳事件節流間隔(毫秒)
    let lastDragTime = 0;

    // 單一事件委派取代多個監聽器
    wrapper.addEventListener('dragstart', (e) => {
        const item = e.target.closest('.site-item');
        if (!item) {
            e.preventDefault();
            return;
        }

        // 節流控制
        const now = Date.now();
        if (now - lastDragTime < DRAG_THROTTLE) {
            e.preventDefault();
            return;
        }
        lastDragTime = now;

        draggedItem = item;
        item.style.opacity = '0.5';
        item.classList.add('dragging');
        e.dataTransfer.setData('text/plain', item.dataset.site);
        e.dataTransfer.setData('source-tier', item.closest('.tier-box')?.dataset.tier || 'available');
    });

    wrapper.addEventListener('dragend', (e) => {
        const item = e.target.closest('.site-item');
        if (!item) return;

        item.style.opacity = '1';
        item.classList.remove('dragging');
        draggedItem = null;
    });

    // 移除按鈕事件委派
    wrapper.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            e.stopPropagation();
            const item = e.target.closest('.site-item');
            if (!item || item.dataset.site === '*') return;

            const tierBox = item.closest('.tier-box');
            if (tierBox) {
                const tierIndex = parseInt(tierBox.dataset.tier) - 1;
                const siteIndex = settings.simpleSearchTiers[tierIndex].indexOf(item.dataset.site);
                if (siteIndex > -1) {
                    settings.simpleSearchTiers[tierIndex].splice(siteIndex, 1);
                    GM_setValue('simpleSearchTiers', settings.simpleSearchTiers);
                }
            }
            item.remove();
            updateAvailableSites(wrapper);
        }
    });

    // 拖放區域處理 (使用事件委派)
    const handleDragOver = (e) => {
        e.preventDefault();
        const tier = e.target.closest('.tier-box');
        // 節流處理
        if (++dragCounter % 3 !== 0) return;

        tier.style.borderColor = '#2196F3';
        tier.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        const tier = e.target.closest('.tier-box');
        if (!tier || tier.dataset.tier === '3') return;

        tier.style.borderColor = '#aaa';
        tier.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const tier = e.target.closest('.tier-box');

        tier.style.borderColor = '#aaa';
        tier.classList.remove('drag-over');

        const site = e.dataTransfer.getData('text/plain');
        const fromTier = e.dataTransfer.getData('source-tier');
        const toTier = tier.dataset.tier;

        if (!site || fromTier === toTier) return;

        // 效能優化：批量DOM操作
        requestAnimationFrame(() => {
            // 移除原層中的該站點元素
            const sourceBox = fromTier === 'available'
                ? wrapper.querySelector('.available-items')
                : wrapper.querySelector(`.tier-box[data-tier="${fromTier}"] .tier-items`);

            if (sourceBox) {
                const draggedItem = sourceBox.querySelector(`[data-site="${site}"]`);
                if (draggedItem) draggedItem.remove();
            }

            // 檢查目標層是否已有該站點
            const tierItems = tier.querySelector('.tier-items');
            const existing = tierItems.querySelector(`[data-site="${site}"]`);

            if (!existing) {
                // 創建新項目
                const newItem = document.createElement('div');
                newItem.className = 'site-item';
                newItem.draggable = true;
                newItem.dataset.site = site;

                // 根據層級設置背景色
                let bgColor = '#BBDEFB'; // 第一層默認藍色
                if (toTier === '2') bgColor = '#C8E6C9'; // 第二層綠色
                else if (toTier === '3') bgColor = '#E1BEE7'; // 第三層紫色

                newItem.innerHTML = `
                    <span>${site}</span>
                    <span class="remove-item" style="margin-left:5px;color:#666;cursor:pointer;">×</span>
                `;

                Object.assign(newItem.style, {
                    padding: '4px 8px',
                    margin: '2px 0',
                    background: bgColor,
                    borderRadius: '3px',
                    cursor: 'move',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                });

                // 計算放置位置
                const afterElementS = getDragAfterElementS(tierItems, e.clientY);
                if (afterElementS) {
                    tierItems.insertBefore(newItem, afterElementS);
                } else {
                    tierItems.appendChild(newItem);
                }
            }

            // 更新設定值中的 tiers 陣列
            if (fromTier !== 'available') {
                const tierIndexFrom = parseInt(fromTier) - 1;
                const index = settings.simpleSearchTiers[tierIndexFrom].indexOf(site);
                if (index > -1) settings.simpleSearchTiers[tierIndexFrom].splice(index, 1);
            }

            const tierIndexTo = parseInt(toTier) - 1;
            if (!settings.simpleSearchTiers[tierIndexTo].includes(site)) {
                settings.simpleSearchTiers[tierIndexTo].push(site);
            }

            GM_setValue('simpleSearchTiers', settings.simpleSearchTiers);
            updateAvailableSites(wrapper);
        });
    };

    // 綁定事件到容器而非個別元素
    wrapper.querySelectorAll('.tier-box').forEach(tier => {
        tier.addEventListener('dragover', handleDragOver);
        tier.addEventListener('dragleave', handleDragLeave);
        tier.addEventListener('drop', handleDrop);
    });

    // 可用站點區域事件
    const availableContainer = wrapper.querySelector('.available-items');
    const handleAvailableDrop = (e) => {
        e.preventDefault();
        availableContainer.style.borderColor = '#f5f5f5';

        const site = e.dataTransfer.getData('text/plain');
        const fromTier = e.dataTransfer.getData('source-tier');

        if (!site || fromTier === 'available') return;

        requestAnimationFrame(() => {
            // 移除原層中的該站點元素
            const sourceBox = wrapper.querySelector(`.tier-box[data-tier="${fromTier}"] .tier-items`);
            if (sourceBox) {
                const draggedItem = sourceBox.querySelector(`[data-site="${site}"]`);
                if (draggedItem) draggedItem.remove();
            }

            // 檢查可用站點是否已有該站點
            const existing = availableContainer.querySelector(`[data-site="${site}"]`);
            if (!existing) {
                // 創建新項目
                const newItem = document.createElement('div');
                newItem.className = 'site-item';
                newItem.draggable = true;
                newItem.dataset.site = site;
                newItem.textContent = site;
                Object.assign(newItem.style, {
                    padding: '4px 8px',
                    background: '#FFECB3',
                    borderRadius: '3px',
                    cursor: 'move',
                    display: 'inline-flex',
                    alignItems: 'center'
                });

                availableContainer.appendChild(newItem);
            }

            // 更新設定值中的 tiers 陣列
            const tierIndexFrom = parseInt(fromTier) - 1;
            const index = settings.simpleSearchTiers[tierIndexFrom].indexOf(site);
            if (index > -1) settings.simpleSearchTiers[tierIndexFrom].splice(index, 1);

            GM_setValue('simpleSearchTiers', settings.simpleSearchTiers);
        });
    };

    availableContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        availableContainer.style.borderColor = '#2196F3';
    });

    availableContainer.addEventListener('dragleave', () => {
        availableContainer.style.borderColor = '#f5f5f5';
    });

    availableContainer.addEventListener('drop', handleAvailableDrop);
    initClickToSwap(wrapper);
}

// 計算放置位置
function getDragAfterElementS(container, y) {
    const draggableElements = [...container.querySelectorAll('.site-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 更新可用站點列表
function updateAvailableSites(wrapper) {
    const usedSites = new Set();
    wrapper.querySelectorAll('.tier-box .site-item').forEach(item => {
        usedSites.add(item.dataset.site);
    });

    const availableContainer = wrapper.querySelector('.available-items');
    availableContainer.innerHTML = SITES
        .map(s => s.name)
        .filter(name => !usedSites.has(name))
        .map(site => `
            <div class="site-item" draggable="true" data-site="${site}"
                 style="padding: 4px 8px; background: #FFECB3; border-radius: 3px;
                        cursor: move; display: inline-flex; align-items: center;">
                ${site}
            </div>
        `).join('');

    // 重新綁定事件
    initDragAndDropSimple(wrapper);

}

previewImg.onerror = function(e) {
    console.log('[圖片載入失敗]', {
        src: e.target.src,// 記錄失敗的圖片URL
        isTrusted: e.isTrusted,
        timestamp: new Date().toISOString()
    });
    e.target.src = fallbackImageUrl; // 確保回退到預設圖片
};

function bindEventListeners(wrapper) {

    //交換按鈕位置
    // 移動按鈕事件
    wrapper.addEventListener('click', (e) => {
        // 處理上移/下移按鈕
        const moveUpBtn = e.target.closest('.move-up');
        const moveDownBtn = e.target.closest('.move-down');

        if (moveUpBtn || moveDownBtn) {
            const item = (moveUpBtn || moveDownBtn).closest('.preview-source-item');
            const currentIndex = parseInt(item.dataset.index);
            const newIndex = moveUpBtn ? currentIndex - 1 : currentIndex + 1;

            // 交換數組中的位置
            [GLOBAL_PREVIEW_SOURCES[currentIndex], GLOBAL_PREVIEW_SOURCES[newIndex]] =
            [GLOBAL_PREVIEW_SOURCES[newIndex], GLOBAL_PREVIEW_SOURCES[currentIndex]];

            // 保存新順序
            GM_setValue('previewSourcesOrder', GLOBAL_PREVIEW_SOURCES.map(s => s.name));

            // 重新渲染列表
            wrapper.querySelector('#preview-sources-order').innerHTML = renderPreviewSourcesOrder();
        }

        // 處理刪除按鈕（移動到棄用區）
    wrapper.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-source');
        if (removeBtn) {
            const item = removeBtn.closest('.preview-source-item');
            const sourceName = item.dataset.name;

            // 從預覽來源中移除
            const sourceIndex = GLOBAL_PREVIEW_SOURCES.findIndex(s => s.name === sourceName);
            if (sourceIndex !== -1) {
                GLOBAL_PREVIEW_SOURCES.splice(sourceIndex, 1);
                GM_setValue('previewSourcesOrder', GLOBAL_PREVIEW_SOURCES.map(s => s.name));
            }

            // 添加到棄用區（如果尚未存在）
            if (!settings.disabledPreviewSources.includes(sourceName)) {
                settings.disabledPreviewSources.push(sourceName);
                GM_setValue('disabledPreviewSources', settings.disabledPreviewSources);
            }

            // 重新渲染兩個列表
            wrapper.querySelector('#preview-sources-order').innerHTML = renderPreviewSourcesOrder();
            wrapper.querySelector('#disabled-preview-sources').innerHTML = renderDisabledPreviewSources();
        }

        // 處理恢復按鈕（從棄用區移回）
        const restoreBtn = e.target.closest('.restore-source');
        if (restoreBtn) {
            const item = restoreBtn.closest('.disabled-source-item');
            const sourceName = item.dataset.name;

            // 從棄用區移除
            const disabledIndex = settings.disabledPreviewSources.indexOf(sourceName);
            if (disabledIndex !== -1) {
                settings.disabledPreviewSources.splice(disabledIndex, 1);
                GM_setValue('disabledPreviewSources', settings.disabledPreviewSources);
            }

            // 添加到預覽來源（如果尚未存在）
            if (!GLOBAL_PREVIEW_SOURCES.some(s => s.name === sourceName)) {
                const restoredSource = {
                    name: sourceName,
                    get: async (id) => {
                        // 這裡需要根據實際情況實現 get 方法
                        return null;
                    }
                };
                GLOBAL_PREVIEW_SOURCES.push(restoredSource);
                GM_setValue('previewSourcesOrder', GLOBAL_PREVIEW_SOURCES.map(s => s.name));
            }

            // 重新渲染兩個列表
            wrapper.querySelector('#preview-sources-order').innerHTML = renderPreviewSourcesOrder();
            wrapper.querySelector('#disabled-preview-sources').innerHTML = renderDisabledPreviewSources();
        }
    });

        // 處理恢復按鈕（從棄用區移回）
        const restoreBtn = e.target.closest('.restore-source');
        if (restoreBtn) {
            const item = restoreBtn.closest('.disabled-source-item');
            const sourceName = item.dataset.name;

            // 從棄用區移除
            const disabledIndex = settings.disabledPreviewSources.indexOf(sourceName);
            if (disabledIndex !== -1) {
                settings.disabledPreviewSources.splice(disabledIndex, 1);
                GM_setValue('disabledPreviewSources', settings.disabledPreviewSources);
            }

            // 添加到預覽來源（如果尚未存在）
            if (!GLOBAL_PREVIEW_SOURCES.some(s => s.name === sourceName)) {
                const restoredSource = {
                    name: sourceName,
                    get: async (id) => {
                        // 這裡需要根據實際情況實現 get 方法
                        return null;
                    }
                };
                GLOBAL_PREVIEW_SOURCES.push(restoredSource);
                GM_setValue('previewSourcesOrder', GLOBAL_PREVIEW_SOURCES.map(s => s.name));
            }

            // 重新渲染兩個列表
            wrapper.querySelector('#preview-sources-order').innerHTML = renderPreviewSourcesOrder();
            wrapper.querySelector('#disabled-preview-sources').innerHTML = renderDisabledPreviewSources();
        }
    });

    // 滑桿數值顯示
    wrapper.querySelector('#hoverDelay').addEventListener('input', function() {
        wrapper.querySelector('#hoverDelayValue').textContent = this.value;
    });

    wrapper.querySelector('#previewWidth').addEventListener('input', function() {
        wrapper.querySelector('#previewWidthValue').textContent = this.value;
    });

    // 恢復預設值
    wrapper.querySelector('#resetDefaults').addEventListener('click', function() {
        if (confirm('確定要恢復所有設定為預設值嗎？')) {
            wrapper.querySelector('#highlightColorPicker').value = defaultSettings.highlightColor;
            wrapper.querySelector('#hoverDelay').value = defaultSettings.hoverDelay;
            wrapper.querySelector('#hoverDelayValue').textContent = defaultSettings.hoverDelay;
            wrapper.querySelector('#previewWidth').value = defaultSettings.previewWidth;
            wrapper.querySelector('#previewWidthValue').textContent = defaultSettings.previewWidth;
            wrapper.querySelector('#closeOnWheel').checked = defaultSettings.closeOnWheel;
            wrapper.querySelector('#followMouse').checked = defaultSettings.followMouse;
            wrapper.querySelector('#simpleSearch').checked = defaultSettings.simpleSearch;

            // 重置層級設置
            const defaultTiers = defaultSettings.simpleSearchTiers;
            wrapper.querySelectorAll('.tier-box').forEach((box, index) => {
                box.querySelector('.tier-items').innerHTML = renderTierItems(defaultTiers[index]);
            });
            wrapper.querySelector('.available-items').innerHTML = renderAvailableSites();
            GM_deleteValue('previewSourcesOrder');
            GM_deleteValue('disabledPreviewSources');
            initDragAndDropSimple(wrapper);
        }
    });

    // 保存設定
    wrapper.querySelector('#saveSettings').addEventListener('click', function() {
        // 基本設定
        const newColor = wrapper.querySelector('#highlightColorPicker').value;
        GM_setValue('highlightColor', newColor);
        GM_setValue('hoverDelay', parseInt(wrapper.querySelector('#hoverDelay').value));
        GM_setValue('previewWidth', parseInt(wrapper.querySelector('#previewWidth').value));
        GM_setValue('closeOnWheel', wrapper.querySelector('#closeOnWheel').checked);
        GM_setValue('followMouse', wrapper.querySelector('#followMouse').checked);
        GM_setValue('simpleSearch', wrapper.querySelector('#simpleSearch').checked);
        GM_setValue('hoverFuzzySearch', wrapper.querySelector('#hoverFuzzySearch').checked);
        GM_registerMenuCommand('切換HOVER模糊搜尋', () => {
            settings.hoverFuzzySearch = !settings.hoverFuzzySearch;
            GM_setValue('hoverFuzzySearch', settings.hoverFuzzySearch);
            alert(`HOVER模糊搜尋已${settings.hoverFuzzySearch ? '開啟' : '關閉'}`);
        });

        //標記顏色更新
        applyHighlightColor(newColor);
            wrapper.remove();
            function applyHighlightColor(color) {
                // 更新當前頁面所有標記
                document.querySelectorAll('.highlight-vr').forEach(el => {
                    el.style.backgroundColor = color;
                });
                // 更新設定物件
                settings.highlightColor = color;
            }//標記顏色更新結束
        // 層級設定
        const newTiers = Array.from(wrapper.querySelectorAll('.tier-box')).map(box => {
            return Array.from(box.querySelectorAll('.site-item')).map(item => item.dataset.site);
        });
        GM_setValue('simpleSearchTiers', newTiers);
        GM_setValue('previewSourcesOrder', GLOBAL_PREVIEW_SOURCES.map(s => s.name));
        alert('設定已保存！');
        wrapper.remove();
        location.reload(); // 重新載入以應用新設定
    });
}
// 初始化時檢查所有現有站點的域名
    function initializeDomains() {
        const customSites = GM_getValue('customSites', []);
        customSites.forEach(site => {
            addDomainForSite(site.url);
        });
    }
    // 執行初始化
(function init() {
    settings.highlightColor = GM_getValue('highlightColor', defaultSettings.highlightColor);
    highlightTextNodes(document.body);
    initPreviewSources();
    initializeDomains();
})();
})();