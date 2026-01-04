// ==UserScript==
// @name           Pixiv 显示信息增强脚本
// @name:en        Pixiv Info Enhancer
// @namespace      http://tampermonkey.net/
// @version        2.1.8
// @description    给 pixiv 图片添加收藏数、日期、分辨率，支持用户主页、推荐和排行榜，支持识别列表类名以适应网站变动
// @description:en Add bookmarks count, date, and image resolution to pixiv images; supports user pages, recommendation lists, and ranking pages; supports identifying list class names to adapt to website changes
// @author         InMirrors
// @license        GPL-3.0-or-later
// @icon           https://www.pixiv.net/favicon20250122.ico
// @match          https://www.pixiv.net/*
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/538404/Pixiv%20%E6%98%BE%E7%A4%BA%E4%BF%A1%E6%81%AF%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/538404/Pixiv%20%E6%98%BE%E7%A4%BA%E4%BF%A1%E6%81%AF%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Cache for artwork data (bookmark count and create date)
    const artworkDataCache = {};



    // =================================================================================
    // Style Customization
    // =================================================================================

    GM_addStyle(`
    /* 书签数量元素本体 */
    .bmcount {
        position: absolute !important; /* 绝对定位 */
        z-index: 10; /* 确保在图片上方显示 */

        bottom: 2px;
        left  : 2px;
        right : auto;
        top   : auto;

        background-color: rgba(220, 220, 220, 0.5);
        border-radius: 8px;

        /* 移除旧的布局样式 */
        text-align: initial !important; /* 取消居中 */
        padding-bottom: 0 !important; /* 移除底部填充 */
    }

    /* 书签数量链接和文本 */
    .bmcount a {
        display: block; /* 使 padding 生效 */
        height: initial !important;
        width: initial !important;
        border-radius: inherit !important; /* 继承父元素的圆角 */
        padding: 3px 6px 3px 18px; /* 文本和链接内边距变量 */

        font-family: sans-serif;
        font-size  : 12px !important;
        font-weight: bold !important;
        color      : rgba(0, 105, 177, 1) !important;
        opacity    : 1.0;
        text-decoration: none !important;

        /* 图标样式 */
        background-image: url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%2210%22 viewBox=%220 0 12 12%22><path fill=%22%230069B1%22 d=%22M9,1 C10.6568542,1 12,2.34314575 12,4 C12,6.70659075 10.1749287,9.18504759 6.52478604,11.4353705 L6.52478518,11.4353691 C6.20304221,11.6337245 5.79695454,11.6337245 5.4752116,11.4353691 C1.82507053,9.18504652 0,6.70659017 0,4 C1.1324993e-16,2.34314575 1.34314575,1 3,1 C4.12649824,1 5.33911281,1.85202454 6,2.91822994 C6.66088719,1.85202454 7.87350176,1 9,1 Z%22/></svg>") !important;
        background-position: center left 6px !important; /* 垂直居中 水平靠左 距离左侧6px */
        background-size    : 10px !important;
        background-repeat  : no-repeat !important;
    }

    /* 在图片下方插入的元素的容器 */
    .script-generated-footer {
        font-family: sans-serif;
        font-size  : 12px !important;
        font-weight: normal !important;
        color      : #000000 !important;
        opacity    : 0.7;
        line-height: 20px;
        text-decoration: none !important; /* 移除可能的下划线 */
        display: flex;
        flex-wrap: wrap;                /* Allow wrapping to next line */
        gap: 10px;                      /* Minimum gap between items */
        justify-content: space-between; /* Distribute space between left and right */
        width: 100%;                    /* Make sure the container spans full width */
    }

    /* 日期元素 */
    .createdate {
        white-space: nowrap; /* 防止日期换行 */
    }

    /* 分辨率元素 */
    .illust-res {
        white-space: nowrap;
    }
`);

    const url = window.location.href;

    if (url.includes("ranking.php")) {
        GM_addStyle(`
            .script-generated-footer {
                display: block;
            }
        `)
    }



    // =================================================================================
    // Storage and Selector Management
    // =================================================================================

    const STORAGE_KEY = 'pixiv_bookmark_selectors';

    // Selectors that seem relatively stable or cover specific cases
    const ALWAYS_INCLUDED_SELECTORS = [
        '.ranking-item', // 排行榜
        '.gtm-illust-recommend-zone[data-gtm-recommend-zone="discovery"] li', // 插图页面下方的推荐
        ".sc-8d5ac044-6.iIVQGq",
        ".sc-8d5ac044-6.jUPNzm",
        ".sc-bf8cea3f-0.dKbaFf"
    ];

    let dynamicArtworkSelectors = loadSelectors();
    let currentCombinedSelector = buildSelectorString();

    // Load selectors from storage
    function loadSelectors() {
        try {
            const selectors = GM_getValue(STORAGE_KEY, '[]');
            if (Array.isArray(selectors) && selectors.every(s => typeof s === 'string')) {
                return selectors.filter(s => s.trim() !== '');
            }
            console.error("Failed to parse stored selectors, returning empty array.", stored);
            return [];
        } catch (e) {
            console.error("Error loading selectors from storage:", e);
            return [];
        }
    }

    // Save selectors to storage
    function saveSelectors(selectors) {
        GM_setValue(STORAGE_KEY, selectors);
        dynamicArtworkSelectors = selectors; // Update in-memory variable
        currentCombinedSelector = buildSelectorString(); // Rebuild selector string
        // Note: The MutationObserver will pick up the new currentCombinedSelector
        // on its next execution cycle after a DOM change.
    }

    // Build the full CSS selector string for querySelectorAll
    function buildSelectorString() {
        // Note: .ranking-item (appears in the ranking page) is an item selector, not a container selector
        const containerSelectors = dynamicArtworkSelectors.filter(s => !s.endsWith(' li') && s !== '.ranking-item'); // Exclude .ranking-item from containers
        const itemSelectors = dynamicArtworkSelectors.filter(s => s.endsWith(' li') || s === '.ranking-item'); // Include .ranking-item as an item

        const alwaysIncludedContainerSelectors = ALWAYS_INCLUDED_SELECTORS.filter(s => !s.endsWith(' li') && s !== '.ranking-item');
        const alwaysIncludedItemSelectors = ALWAYS_INCLUDED_SELECTORS.filter(s => s.endsWith(' li') || s === '.ranking-item');

        const finalContainerSelectors = [...new Set([...containerSelectors, ...alwaysIncludedContainerSelectors])];
        const finalItemSelectors = [...new Set([...itemSelectors, ...alwaysIncludedItemSelectors])];

        // Build the query: all items + li descendants of all containers
        const queryParts = [
            ...finalItemSelectors, // Items already selected (.ranking-item is here)
            ...finalContainerSelectors.map(s => s + ' li') // li inside containers
        ];

        // Add the :not([data-dummybmc]) exclusion to each part
        const finalQuery = queryParts.map(s => s + ':not([data-dummybmc])').join(',');

        console.log("Built selector string:", finalQuery);
        return finalQuery;
    }

    // Find potential new container selectors on the current page
    // 基本只有用户主页会用到这个功能，排行榜和推荐都是固定类名
    function findPotentialSelectors() {
        const allPotentialOnPage = new Set(); // 记录在页面上找到的所有潜在选择器
        const existingSelectors = new Set([...dynamicArtworkSelectors, ...ALWAYS_INCLUDED_SELECTORS]);
        const newFound = new Set(); // 记录在页面上找到且是新的选择器

        const artworkLinks = document.querySelectorAll('a[href*="/artworks/"]');

        artworkLinks.forEach(link => {
            const li = link.closest('li');
            if (!li) return;

            const ul = li.parentElement;
            if (!ul || ul.tagName !== 'UL') return;

            const container = ul.parentElement;
            if (container && (container.tagName === 'DIV' || container.tagName === 'SECTION')) {
                if (container.classList.length > 0) {
                    const selector = '.' + Array.from(container.classList).join('.');
                    allPotentialOnPage.add(selector); // 添加到所有找到的集合

                    // 如果这个选择器不在现有列表中，则添加到新找到的集合
                    if (!existingSelectors.has(selector)) {
                        newFound.add(selector);
                    }
                }
            }
        });

        // 返回包含详细信息的对象
        return {
            totalFound: Array.from(allPotentialOnPage), // 页面上找到的所有潜在选择器
            newFound: Array.from(newFound)              // 页面上找到且是新的选择器
        };
    }



    // =================================================================================
    // Context Menu Commands
    // =================================================================================

    GM_registerMenuCommand("添加 (Add) 当前页面的 Pixiv 书签选择器", async () => {
        const result = findPotentialSelectors();

        if (result.totalFound.length === 0) {
            // 情况 1: 页面上没有找到任何潜在的选择器
            alert("未能在当前页面找到任何潜在的书签列表容器结构。请确保当前页面显示有插图列表。");
        } else {
            // 页面上找到了潜在的选择器
            if (result.newFound.length === 0) {
                // 情况 2: 找到了，但都是已存在的
                alert("在当前页面找到了潜在的书签列表容器结构，但所有找到的选择器都已存在于列表中，无需添加新的。");
                console.log("Found existing potential selectors:", result.totalFound.join(', '));
            } else {
                // 情况 3: 找到了新的选择器
                const currentSelectors = loadSelectors(); // 再次加载最新状态
                const updatedSelectors = [...new Set([...currentSelectors, ...result.newFound])]; // 合并并去重

                // 理论上 newFound 不为空时，updatedSelectors 长度应该大于 currentSelectors 长度，但为了严谨还是检查一下
                if (updatedSelectors.length > currentSelectors.length) {
                    saveSelectors(updatedSelectors);
                    const addedList = result.newFound.join('\n');
                    alert(`成功添加了 ${result.newFound.length} 个新的书签列表容器选择器：\n\n${addedList}\n\n脚本将尝试使用这些新的选择器，请刷新页面使变更生效。`);
                    console.log("Added new selectors:", result.newFound.join(', '));
                } else {
                    // 这通常不应该发生，除非 findPotentialSelectors 或 saveSelectors 逻辑有误
                    alert("找到了新的选择器，但在保存时未能实际增加列表项。请检查控制台输出。");
                    console.error("Logic error: newFound is not empty, but list size did not increase.");
                    console.log("New found:", result.newFound);
                    console.log("Current selectors:", currentSelectors);
                    console.log("Updated selectors (after merge):", updatedSelectors);
                }
            }
        }
    });

    GM_registerMenuCommand("清除 (Clear) 已添加的 Pixiv 书签选择器", () => {
        if (confirm("确定要清除所有动态学习到的 Pixiv 书签列表容器选择器吗？这可能导致脚本失效，直到重新添加。")) {
            saveSelectors([]);
            alert("已清除所有动态书签选择器。");
        }
    });



    // =================================================================================
    // Utils
    // =================================================================================

    /**
     * 基于 ISO 字符串快速生成 "yy-MM-dd HH:mm"
     * 因为 pixiv 的时间精度只到分，秒部分全是 0，所以本函数去掉秒和微秒部分
     * @param {Date} date - 要格式化的 Date 对象
     * @returns {string} 格式化后的字符串
     */
    function formatFromISO(date) {
        const iso = date.toISOString();              // e.g. "yyyy-MM-ddTHH:mm:ss.fffZ"
        const [datePart, timePart] = iso.split('T'); // ["yyyy-MM-dd", "HH:mm:ss.fffZ"]
        const dateShort = datePart.slice(2);         // "yy-MM-dd"
        const time = timePart.slice(0, 5);           // "HH:mm"
        return `${dateShort} ${time}`;               // "yy-MM-dd HH:mm:ss"
    }

    /**
     * 按目标时区偏移后再格式化
     * @param {Date} date - 原始 Date 对象（本地时区或任意时区）
     * @param {number} timeZoneCode - 目标时区，例如 +8。默认使用当前时区
     * @returns {string} 格式化后的目标时区时间字符串
     */
    function formatWithTimezone(date, timeZoneCode = -date.getTimezoneOffset() / 60) {
        // 其实 getTime() 返回的已经是当前时区的时间戳了，但之后的 toISOString() 会引入偏移
        const utcTimestamp = date.getTime();
        // 所以加上一个偏移以抵消 toISOString() 引入的偏移
        const targetTimestamp = utcTimestamp + timeZoneCode * 60 * 60000;
        const targetDate = new Date(targetTimestamp);
        return formatFromISO(targetDate);
    }



    // =================================================================================
    // Configuration for elements to be inserted
    // =================================================================================

    const elementConfigs = [
        {
            keys: ['bookmarkCount'], // The key for the data in the artworkData object
            settingName: 'showBookmarkCount', // Unique name for storing the setting with GM_setValue
            menuLabel: '显示收藏数 (Show Bookmark Count)', // Label for the Tampermonkey menu
            isEnabledByDefault: true, // Default state if no setting is saved
            // Function to find the parent element for insertion
            getTarget: (listItem) => listItem.querySelector('a[href*="/artworks/"]'),
            // Position for insertAdjacentHTML (e.g., 'beforeend', 'afterend')
            position: 'beforeend',
            getHTMLValueNum: 1,
            // Function to generate the HTML string for the element
            getHTML: (bmCount, id) => `<div class="bmcount"><a href="/bookmark_detail.php?illust_id=${id}">${bmCount}</a></div>`
        },
        {
            keys: ['createDate'],
            settingName: 'showCreateDate',
            menuLabel: '显示创建日期 (Show Creation Date)',
            isEnabledByDefault: true,
            group: 'footer', // Each group corresponds to a CSS class, set the value to apply specific styles.
            getHTMLValueNum: 1,
            // The generated HTML does NOT include its own wrapper, as it will be placed inside the group container.
            getHTML: (createDate, id) => {
                try {
                    // Format date to yyyy-MM-dd HH:mm
                    const date = new Date(createDate);
                    const formattedDate = formatWithTimezone(date);
                    // Return just the content's HTML. The container is handled by the group.
                    return `<div class="createdate">${formattedDate}</div>`;
                } catch (e) {
                    console.error("Error formatting or inserting create date for ID", id, ":", e);
                    return null; // Return null on error to prevent insertion
                }
            },
            // Whether to exclude this element from the normal list items (normal pages)
            excludeNormal: false,
            // Whether to exclude this element from the ranking pages
            excludeRanking: true
            // Note: No 'getTarget' or 'position' is needed here, as the group config handles placement.
        },
        {
            keys: ['width', 'height'],
            settingName: 'showResolution',
            menuLabel: '显示图像分辨率 (Show Image Resolution)',
            isEnabledByDefault: true,
            group: 'footer',
            getHTMLValueNum: 2,
            getHTML: (width, height, id) => {
                const widthInt = parseInt(width);
                const heightInt = parseInt(height);
                let orientationMark = '';

                if (Math.abs(widthInt - heightInt) <= Math.max(widthInt, heightInt) * 0.20) {
                    orientationMark = '='; // Approximately square
                } else if (widthInt > heightInt) {
                    orientationMark = '–'; // Landscape
                } else {
                    orientationMark = '|'; // Portrait
                }

                return `<div class="illust-res">${orientationMark}${width}x${height}</div>`;
            }
        },
    ];

    // Object to hold the current state of all settings
    const SCRIPT_SETTINGS = {};

    /**
     * Initializes settings from GM_getValue and registers menu commands.
     * Call this function once when the script starts.
     */
    function initializeSettings() {
        console.log("Initializing script settings and menu...");
        elementConfigs.forEach(config => {
            // Load the saved setting, or use the default value
            SCRIPT_SETTINGS[config.settingName] = GM_getValue(config.settingName, config.isEnabledByDefault);

            // Register a command in the Tampermonkey menu for each element
            GM_registerMenuCommand(
                `${SCRIPT_SETTINGS[config.settingName] ? '✅' : '❌'} ${config.menuLabel}`,
                () => {
                    // Toggle the setting
                    const newValue = !SCRIPT_SETTINGS[config.settingName];
                    GM_setValue(config.settingName, newValue);
                    alert(`'${config.menuLabel}' 已${newValue ? '开启' : '关闭'}。\n请刷新页面以应用更改。`);
                }
            );
        });
    }

    initializeSettings();

    // Configuration for element groups/containers
    // Defines shared containers for multiple elements.
    const groupConfigs = {
        // A group for elements to be placed at the end of the list item
        footer: {
            selector: '.script-generated-footer', // The CSS selector for the container div
            // Function to find the anchor element to insert the container relative to
            getTarget: (listItem) => listItem.querySelector(':scope > div'),
            // Where to insert the container relative to the target ('afterend', 'beforebegin', etc.)
            position: 'afterend',
            // The HTML for the container itself. Elements will be inserted inside this.
            containerHTML: '<div class="script-generated-footer"></div>'
        }
    };



    // =================================================================================
    // Mutation Observer
    // =================================================================================

    const doneCheckSelectors = '.bmcount , .bookmark-count , a[href*="/bookmark_detail.php?illust_id="]';

    // 辅助函数：根据ID获取作品数据 (书签数和创建日期)
    async function fetchArtworkData(id) {
        //console.log(`Attempting to fetch data for ID: ${id}`);
        // Check cache first
        if (artworkDataCache[id]) {
            //console.log(`Cache hit for ID: ${id}`);
            return artworkDataCache[id];
        }

        try {
            const response = await fetch("https://www.pixiv.net/ajax/illust/" + id, { credentials: "omit" });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const artworkData = data?.body;

            // Store in cache
            artworkDataCache[id] = artworkData;
            //console.log(`Fetched and cached data for ID ${id}:`, artworkData);
            return artworkData;

        } catch (error) {
            console.error("Error fetching artwork data for ID", id, ":", error);
            // Store error state in cache to avoid repeated failed requests
            artworkDataCache[id] = { error: true };
            throw error; // Re-throw to be caught by the caller
        }
    } // fetchArtworkData

    /**
     * Inserts various elements into an artwork list item based on configuration.
     * This function is data-driven by the 'elementConfigs' array.
     * @param {HTMLElement} listItem - The list item element (e.g., <li> or <div>).
     * @param {string} id - The artwork ID.
     * @param {object} artworkData - The object containing artwork details.
     */
    function insertArtworkElements(listItem, id, artworkData) {
        // Check if elements already exist within this item.
        // Use a generic data attribute to mark as processed by this script.
        if (listItem.hasAttribute("data-insertion-processed")) {
            return;
        }

        // Mark the listItem as processed to prevent re-insertion
        listItem.dataset.insertionProcessed = 'true';

        // Iterate over all configured elements
        elementConfigs.forEach(config => {
            // 1. Check if this element is enabled in the settings
            if (!SCRIPT_SETTINGS[config.settingName]) return;

            // 2. Check for exclusion conditions
            if (config.excludeRanking && listItem.tagName === 'SECTION') return;
            if (config.excludeNormal && listItem.tagName === 'LI') return;

            // 3. Check if the required data is available in artworkData
            // Get all missing keys (i.e., keys not present in artworkData)
            const missingKeys = config.keys.filter(key => !(key in artworkData));
            if (missingKeys.length > 0) {
                console.warn("Missing keys:", missingKeys);
                return;
            }
            const dataValues = config.keys.map(key => artworkData[key]);

            // 4. Generate the element's inner HTML
            function getHTML(config, id) {
                if (config.getHTMLValueNum === 2) {
                    return config.getHTML(dataValues[0], dataValues[1], id);
                } else { // Defaults to one value
                    return config.getHTML(dataValues[0], id);
                }
            }
            const elementHTML = getHTML(config, id);
            if (!elementHTML) return; // Skip if HTML generation failed

            // 5. Determine insertion logic: Grouped or Standalone
            if (config.group) {
                // --- Logic for Grouped Elements ---
                // Elements in the same group share the same CSS
                const groupConfig = groupConfigs[config.group];
                if (!groupConfig) {
                    console.warn(`Group '${config.group}' is not defined in groupConfigs.`);
                    return;
                }

                // Find or create the container for this group within the listItem
                let container = listItem.querySelector(groupConfig.selector);
                if (!container) {
                    // Container does not exist, so create it.
                    const parentForContainer = groupConfig.getTarget(listItem);
                    if (parentForContainer) {
                        parentForContainer.insertAdjacentHTML(groupConfig.position, groupConfig.containerHTML);
                        // Now that it's created, find it to get the element reference.
                        container = listItem.querySelector(groupConfig.selector);
                    }
                }

                // If container exists (or was just created), insert the element's HTML into it.
                if (container) {
                    container.insertAdjacentHTML('beforeend', elementHTML);
                } else {
                    console.warn(`Could not find or create container for group '${config.group}' in item ID ${id}.`);
                }
            }
            // --- Logic for Standalone Elements ---
            else {
                const insertionParent = config.getTarget(listItem);
                if (insertionParent) {
                    insertionParent.insertAdjacentHTML(config.position, elementHTML);
                } else {
                    console.warn(`Insertion parent for '${config.key}' not found for item ID ${id}.`);
                }
            }
        });
    } // insertArtworkElements

    // 处理元素，添加书签数和创建日期
    async function processSingleArtworkElement(Each) {
        // Each could be an LI or a SECTION.ranking-item
        const listItem = (Each.tagName === 'LI' || Each.tagName === 'SECTION') ? Each : Each.closest('li, section');

        // Check if it's a valid item and hasn't been fully processed
        if (!listItem || listItem.hasAttribute("data-insertion-processed")) {
            return;
        }

        // Only process LI and SECTION elements
        if (listItem.tagName !== 'LI' && listItem.tagName !== 'SECTION') {
            return;
        }

        let id = null;
        const artworkLink = listItem.querySelector('a[href*="/artworks/"]');

        // If artworkLink not found, cannot proceed
        if (!artworkLink) {
            return;
        }

        // Extract ID from the href attribute
        // Format: "/artworks/ID" or "/lang/artworks/ID"
        id = /\d+$/.exec(artworkLink.href)?.[0];

        // If ID not found, skip
        if (!id) {
            return;
        }

        // Check cache first
        let artworkData = artworkDataCache[id];

        if (artworkData) {
            // If data is in cache (even error state), attempt insertion
            if (!artworkData.error) {
                insertArtworkElements(listItem, id, artworkData);
            } else {
                // If cached data indicates error, mark item as processed to avoid retries
                listItem.dataset.insertionProcessed = 'error';
            }
        } else {
            // Data not in cache, fetch it
            // Use a temporary marker to prevent duplicate fetches for the same element
            if (listItem.hasAttribute("data-fetching-bmc-cd")) {
                return;
            }
            listItem.dataset.fetchingBmcCd = 'true';

            try {
                artworkData = await fetchArtworkData(id);
                insertArtworkElements(listItem, id, artworkData);
            } catch (error) {
                // Error already logged in fetchArtworkData
                listItem.dataset.insertionProcessed = 'error'; // Mark item as processed with error
            } finally {
                // Remove temporary fetching marker
                delete listItem.dataset.fetchingBmcCd;
            }
        }
    } // processSingleArtworkElement()

    // MutationObserver 回调函数调用处理函数
    const observer = new MutationObserver((mutations) => {
        // On any mutation, re-query all matching elements and process them.
        // processSingleArtworkElement handles checking if an element needs processing.
        document.querySelectorAll(currentCombinedSelector).forEach(processSingleArtworkElement);
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    console.log("Pixiv Bookmark Count script started.");
    console.log("Initial selectors:", dynamicArtworkSelectors);
    console.log("Always included selectors:", ALWAYS_INCLUDED_SELECTORS);
    console.log("Combined query selector:", currentCombinedSelector);

})();
