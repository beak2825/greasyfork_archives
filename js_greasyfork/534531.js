// ==UserScript==
// @name         bilibili--分组查看b站动态
// @namespace    Felix
// @version      1.1
// @description  这个脚本能帮你通过关注分组筛选b站时间线上的动态
// @author       Felix
// @match        https://t.bilibili.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.bilibili.com
// @connect      api.live.bilibili.com
// @run-at       document-end
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/534531/bilibili--%E5%88%86%E7%BB%84%E6%9F%A5%E7%9C%8Bb%E7%AB%99%E5%8A%A8%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/534531/bilibili--%E5%88%86%E7%BB%84%E6%9F%A5%E7%9C%8Bb%E7%AB%99%E5%8A%A8%E6%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS Styles ---
    GM_addStyle(`
        .chorme-bili-tags {
            height: 48px;
            background-color: var(--bg1);
            border-radius: 6px;
            overflow-x: auto;
            position: relative;
            margin-bottom: 10px; /* Add some space */
        }
        .chorme-bili-tags::-webkit-scrollbar {
            display: none; /* Hide scrollbar */
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
        }
        .chorme-bili-tags ul {
            padding: 0;
            position: relative;
            padding: 0px 20px;
            margin: 0;
            display: flex;
            width: max-content; /* Ensure ul takes full width of items */
        }
        .chorme-bili-tags ul li {
            list-style: none;
            display: inline-block;
            cursor: pointer;
            margin-right: 16px;
            height: 48px;
            line-height: 48px;
            flex-shrink: 0;
            color: var(--text2); /* Use Bilibili variable */
            transition: color .2s ease;
            position: relative; /* Needed for highlight positioning */
        }
         .chorme-bili-tags ul li:hover {
             color: var(--text1);
         }
         .chorme-bili-tags ul li.active {
             color: var(--brand_blue);
         }
        .chorme-bili-tags .bili-dyn-list-tabs__highlight {
            position: absolute;
            bottom: 0px;
            left: 0px;
            width: 14px; /* Adjust width */
            height: 3px; /* Adjust height */
            border-radius: 2px;
            background-color: var(--brand_blue);
            transition: transform .2s ease-in-out;
            transform: translateX(28px); /* Initial position, will be updated */
        }
        /* Bilibili's own classes for consistency (might need adjustment if Bilibili updates) */
        .fs-medium {
             font-size: 14px;
        }
    `);


    // Type Definitions (as comments for clarity)
    /*
    interface Following { mid: number; attribute: number; mtime: number; special: number; contract_info: any; uname: string; face: string; sign: string; face_nft: number; official_verify: any; vip: any; name_render: any; nft_icon: string; rec_reason: string; track_id: string; follow_time: string; tag: null | number[]; }
    interface Group { [key: number]: string[]; }
    interface TagInfo { tagid: number; name: string; count: number; tip: string; }
    */

    let groups = {}; // Will store { tagid: [uname1, uname2, ...] }
    let currentId = 0; // 0 means "All"
    let isObserve = false;
    let filterTagsCache = []; // Cache for tag info

    /**
     * Fetches data from a URL, handling credentials.
     * Uses GM_xmlhttpRequest for better cross-origin/cookie handling in userscripts if needed,
     * falls back to fetch as per original code (should work for same-origin Bilibili APIs).
     */
    async function send(url) {
        console.log(`[BiliGroupView] Fetching: ${url}`);
        try {
            // Use fetch as in original code - relies on browser handling cookies for api.bilibili.com
             const response = await fetch(url, {
                 credentials: 'include', // Important for logged-in state
             });
             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             }
             const data = await response.json();
             if (data.code !== 0) {
                 console.error(`[BiliGroupView] API Error (${url}):`, data.message || data);
                 return null; // Or handle error appropriately
             }
             console.log(`[BiliGroupView] Received data for ${url}:`, data.data);
             return data.data;

            /* // Alternative using GM_xmlhttpRequest (more robust for userscripts)
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: {
                        "Accept": "application/json", // Adjust if needed
                        // Bilibili might require other headers like Referer, User-Agent
                        "Referer": "https://t.bilibili.com/",
                        "User-Agent": navigator.userAgent
                    },
                    withCredentials: true, // Equivalent to fetch's include
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data.code !== 0) {
                                     console.error(`[BiliGroupView] API Error (${url}):`, data.message || data);
                                     resolve(null);
                                } else {
                                     console.log(`[BiliGroupView] Received data for ${url}:`, data.data);
                                     resolve(data.data);
                                }
                            } catch (e) {
                                console.error(`[BiliGroupView] Failed to parse JSON for ${url}`, e);
                                reject(e);
                            }
                        } else {
                            console.error(`[BiliGroupView] HTTP Error ${response.status} for ${url}`);
                            reject(new Error(`HTTP error! status: ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        console.error(`[BiliGroupView] Network Error for ${url}`, error);
                        reject(error);
                    }
                });
            });
            */
        } catch (error) {
            console.error(`[BiliGroupView] Failed to fetch ${url}:`, error);
            return null; // Indicate failure
        }
    }

    async function getTags() /* : Promise<TagInfo[] | null> */ {
        return await send('https://api.bilibili.com/x/relation/tags');
    }

    async function getProfile() /* : Promise<any | null> */ {
        // Original used live API, but maybe space API is sufficient? Let's try space first.
        // If live is needed: return await send('https://api.live.bilibili.com/User/getUserInfo');
        // Using space API as it's generally more stable for basic user info.
        return await send('https://api.bilibili.com/x/space/myinfo');
    }

    async function getFollowing(uid, pageNumber, pageSize = 50) /* : Promise<{ list: Following[], total: number } | null> */ {
        if (!uid) return null;
        return await send(`https://api.bilibili.com/x/relation/followings?vmid=${uid}&pn=${pageNumber}&ps=${pageSize}&order=desc&order_type=attention`);
    }

    /** Replaces chrome.storage.local.set */
    function saveGroupsInfo(data) {
        try {
            GM_setValue('groups', JSON.stringify(data));
            console.log('[BiliGroupView] Saved groups info to storage.');
        } catch (e) {
            console.error('[BiliGroupView] Failed to save groups info:', e);
        }
    }

    /** Resets dynamic item visibility */
    function resetDynamicItems() {
        const dynamicItems = document.querySelectorAll('.bili-dyn-list__item');
        dynamicItems.forEach((item /*: HTMLElement*/) => {
            item.style.display = ''; // Use empty string to reset to default display
        });
        console.log('[BiliGroupView] Reset dynamic item visibility.');
    }


    /** MutationObserver to filter newly loaded items */
    const dynamicCardObserver = new MutationObserver((mutationsList) => {
        if (currentId === 0) return; // Don't filter if "All" is selected

        let processed = false;
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList?.contains('bili-dyn-list__item')) {
                        filterSingleDynamicItem(node, groups[currentId] || []);
                        processed = true;
                    }
                    // Sometimes items are nested deeper
                    else if (node.nodeType === Node.ELEMENT_NODE && node.querySelector) {
                         const nestedItems = node.querySelectorAll('.bili-dyn-list__item');
                         nestedItems.forEach(item => {
                             filterSingleDynamicItem(item, groups[currentId] || []);
                             processed = true;
                         });
                    }
                });
            }
        });
         if (processed) console.log('[BiliGroupView] Filtered newly added dynamic items.');
    });

    /** Filters a single dynamic item based on the current group */
    function filterSingleDynamicItem(itemElement, groupUsernames) {
         const nameEle = itemElement.querySelector('.bili-dyn-title__text');
         if (nameEle) {
             const name = nameEle.textContent?.trim();
             if (name && !groupUsernames.includes(name)) {
                 itemElement.style.display = 'none';
             } else {
                 itemElement.style.display = ''; // Ensure it's visible if it belongs
             }
         } else {
            // If name element isn't found, maybe hide it to be safe or log an error?
             console.warn('[BiliGroupView] Could not find name element in dynamic item:', itemElement);
             // itemElement.style.display = 'none';
         }
    }

    async function fetchAllFollowing() /* : Promise<Following[] | null> */ {
        const profile = await getProfile();
        if (!profile || !profile.mid) {
            console.error('[BiliGroupView] Could not get user profile/UID.');
            return null;
        }
        const uid = profile.mid;
        const pageSize = 50;
        let pageNumber = 1;
        let followingList = [];
        let total = Infinity; // Initialize total

        console.log(`[BiliGroupView] Starting to fetch all followings for UID: ${uid}`);

        try {
            // Fetch first page to get total
            const firstPage = await getFollowing(uid, pageNumber, pageSize);
            if (!firstPage || !firstPage.list) {
                 console.error('[BiliGroupView] Failed to fetch the first page of followings.');
                 return null;
            }
            followingList = followingList.concat(firstPage.list);
            total = firstPage.total;
            console.log(`[BiliGroupView] Total followings: ${total}. Fetched page ${pageNumber}.`);
            pageNumber++;

            // Fetch remaining pages
            while (followingList.length < total) {
                const response = await getFollowing(uid, pageNumber, pageSize);
                if (!response || !response.list) {
                    console.warn(`[BiliGroupView] Failed to fetch page ${pageNumber}. Stopping fetch.`);
                    break; // Stop if a page fails
                }
                 if (response.list.length === 0) {
                     console.warn(`[BiliGroupView] Fetched empty list on page ${pageNumber}. Stopping fetch.`);
                     break; // Stop if empty list received unexpectedly
                 }
                followingList = followingList.concat(response.list);
                console.log(`[BiliGroupView] Fetched page ${pageNumber}. Total fetched: ${followingList.length}`);
                pageNumber++;
                // Add a small delay to avoid potential rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            console.log(`[BiliGroupView] Finished fetching all followings. Got ${followingList.length} entries.`);
            return followingList;
        } catch (error) {
            console.error('[BiliGroupView] Error during fetching all followings:', error);
            return null;
        }
    }

    /** Generates the group object and saves it */
    async function buildAndSaveGroups() {
        const followings = await fetchAllFollowing();
        if (!followings) {
            alert('[BiliGroupView] 获取关注列表失败，无法生成分组。请检查控制台日志。');
            return false;
        }

        const groupedFollowings = followings.reduce((acc, item) => {
            // Tag can be null or an array. Ensure '0' (default group) is handled if tags are null/empty.
            const tags = item.tag && item.tag.length > 0 ? item.tag : [0];
            tags.forEach((tagId) => {
                acc[tagId] = acc[tagId] ?? [];
                if (item.uname && !acc[tagId].includes(item.uname)) { // Avoid duplicates just in case
                     acc[tagId].push(item.uname);
                }
            });
            return acc;
        }, {}); // Start with empty object, default group (0) will be added if needed

        // Ensure default group '0' exists if there are followings without tags
         if (!groupedFollowings[0] && followings.some(f => !f.tag || f.tag.length === 0)) {
             groupedFollowings[0] = followings.filter(f => !f.tag || f.tag.length === 0).map(f => f.uname);
         }


        groups = groupedFollowings; // Update global variable
        saveGroupsInfo(groupedFollowings); // Save to storage
        console.log('[BiliGroupView] Built and saved new groups:', groups);
        return true;
    }

    /** Handles horizontal scrolling with the mouse wheel */
    function addMouseWheelListener(element) {
        element.addEventListener('wheel', (event /*: WheelEvent*/) => {
            // Only scroll if the target is within the tags container and it's horizontal overflow
            if (element.contains(event.target) && element.scrollWidth > element.clientWidth) {
                 // Don't prevent default if scrolling vertically on page, only if scrolling the tags
                if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
                     event.preventDefault(); // Prevent page scroll if horizontal mouse wheel is used
                     element.scrollBy({ left: event.deltaX, behavior: 'smooth' });
                } else if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                    event.preventDefault(); // Prevent page scroll if vertical mouse wheel is used
                    element.scrollBy({ left: event.deltaY, behavior: 'smooth' });
                }
            }
        }, { passive: false }); // Need passive: false to preventDefault
    }

    /** Moves the highlight bar under the selected tag */
    function moveHighlight(targetListItem) {
        const highlight = document.querySelector('.chorme-bili-tags .bili-dyn-list-tabs__highlight');
        if (highlight && targetListItem) {
            const offset = targetListItem.offsetLeft + (targetListItem.offsetWidth / 2) - (highlight.offsetWidth / 2);
            highlight.style.transform = `translateX(${offset}px)`;
        }
    }

     /** Filters all currently visible dynamic items based on tagId */
    function filterDynamicsByTag(tagId) {
        const groupUsernames = groups[tagId] || [];
        const dynamicItems = document.querySelectorAll('.bili-dyn-list__item');
        console.log(`[BiliGroupView] Filtering by tag ID: ${tagId}. Users:`, groupUsernames);

        dynamicItems.forEach((item) => {
             filterSingleDynamicItem(item, groupUsernames);
        });

         // Ensure observer is active
        const observerTarget = document.querySelector('.bili-dyn-list__items'); // Target for observer
        if (observerTarget && !isObserve) {
            try {
                 dynamicCardObserver.observe(observerTarget, { childList: true, subtree: true });
                 isObserve = true;
                 console.log('[BiliGroupView] MutationObserver started.');
            } catch (e) {
                console.error("[BiliGroupView] Failed to start MutationObserver:", e);
            }
        }
    }


    /** Handles clicks on the tag list */
    function handleTagClick(event, availableTags) {
        const target = event.target;

        if (target.tagName === 'LI') {
            const ulElement = target.parentElement;
            const liElements = ulElement.querySelectorAll('li');

            // Update active class
            liElements.forEach(item => item.classList.remove('active'));
            target.classList.add('active');

            // Move highlight
            moveHighlight(target);

            // Find the index and corresponding tagId
            const index = Array.from(ulElement.children).indexOf(target);
            if (index === 0) { // "All" clicked
                currentId = 0;
                 if (isObserve) {
                     dynamicCardObserver.disconnect();
                     isObserve = false;
                     console.log('[BiliGroupView] MutationObserver stopped.');
                 }
                resetDynamicItems();
            } else {
                currentId = availableTags[index - 1]?.tagid ?? -1; // Get tagid from cache
                 if (currentId === -1) {
                     console.error("[BiliGroupView] Couldn't find tagid for clicked element:", target.textContent);
                     return;
                 }
                filterDynamicsByTag(currentId);
            }
             console.log(`[BiliGroupView] Switched to filter ID: ${currentId}`);
        }
    }


    /** Main function to initialize the script */
    async function initialize() {
        console.log('[BiliGroupView] Initializing script...');

        // Load groups from storage
        const storedGroups = GM_getValue('groups');
        if (storedGroups) {
            try {
                groups = JSON.parse(storedGroups);
                console.log('[BiliGroupView] Loaded groups from storage.');
            } catch (e) {
                console.error('[BiliGroupView] Failed to parse stored groups:', e);
                groups = {}; // Reset if parsing fails
            }
        } else {
             console.log('[BiliGroupView] No groups found in storage.');
        }

        // Wait for the dynamic list container to be ready
        const targetNode = await waitForElement('.bili-dyn-list');
        if (!targetNode) {
            console.error('[BiliGroupView] Target .bili-dyn-list not found. Aborting.');
            return;
        }
         // Also wait for the list items container for the observer
         const observerTarget = await waitForElement('.bili-dyn-list__items');
         if (!observerTarget) {
             console.error('[BiliGroupView] Target .bili-dyn-list__items not found for observer. Aborting.');
             return;
         }


        // Fetch tags from Bilibili API
        const tags = await getTags();
         if (!tags) {
             console.warn('[BiliGroupView] Failed to fetch tags. UI might not display correctly.');
             filterTagsCache = [];
         } else {
             // Filter out tags with 0 count, keep default group '0' handling in mind
             filterTagsCache = tags.filter(item => item.count !== 0 || item.tagid === 0); // Keep default group if it exists in API? Check API response structure. Usually 0 isn't returned explicitly.
             // Filter out 0 count tags, as the "All" button handles that.
             filterTagsCache = tags.filter(item => item.count !== 0);
             console.log('[BiliGroupView] Fetched and filtered tags:', filterTagsCache);
         }

        // Check if groups are empty or seem outdated (e.g., new tags exist but not in groups)
        const needGroupUpdate = !storedGroups || Object.keys(groups).length === 0 || filterTagsCache.some(tag => !(tag.tagid in groups) && tag.tagid !== 0);

        if (needGroupUpdate) {
            console.log('[BiliGroupView] Groups data missing or potentially outdated. Fetching and building groups...');
            const success = await buildAndSaveGroups();
            if (!success) {
                 // Maybe still try to build the UI with available tags?
                 console.warn("[BiliGroupView] Failed to build groups, continuing UI setup without full filtering capability.");
            }
        }

        // --- Create and Insert UI ---
        const tagsHTML = `
            <div class='chorme-bili-tags'>
                <ul>
                    <li class='bili-dyn-list-tabs__item fs-medium active'>全部</li>
                    ${filterTagsCache.map(item => `<li class='bili-dyn-list-tabs__item fs-medium' data-tag-id='${item.tagid}'>${item.name}</li>`).join('')}
                </ul>
                <div class='bili-dyn-list-tabs__highlight'></div>
            </div>
        `;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tagsHTML.trim();
        const tagsDom = tempDiv.firstElementChild;

        if (tagsDom) {
            targetNode.parentNode.insertBefore(tagsDom, targetNode); // Insert before the list
            console.log('[BiliGroupView] Tags UI inserted.');

            // Add listeners
            const ulElement = tagsDom.querySelector('ul');
            if (ulElement) {
                ulElement.addEventListener('click', (event) => handleTagClick(event, filterTagsCache));
            }

             // Add wheel listener to the tags container itself
             addMouseWheelListener(tagsDom);

            // Set initial highlight position
             const initialActive = tagsDom.querySelector('li.active');
             moveHighlight(initialActive);

        } else {
            console.error('[BiliGroupView] Failed to create tags DOM element.');
        }

         // Add refresh button (optional but recommended)
         addRefreshButton(targetNode.parentNode, tagsDom);


        console.log('[BiliGroupView] Initialization complete.');
    }

    /** Utility to wait for an element to appear in the DOM */
    function waitForElement(selector, timeout = 15000) {
        return new Promise((resolve) => {
            const interval = 100;
            let timer = 0;
            const check = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else {
                    timer += interval;
                    if (timer < timeout) {
                        setTimeout(check, interval);
                    } else {
                        console.error(`[BiliGroupView] Element "${selector}" not found after ${timeout}ms.`);
                        resolve(null);
                    }
                }
            };
            check(); // Initial check
        });
    }

     /** Adds a manual refresh button */
    function addRefreshButton(parent, sibling) {
        const refreshButton = document.createElement('button');
        refreshButton.textContent = '🔄 刷新分组';
        refreshButton.title = '点击强制重新获取并保存关注列表和分组信息';
        refreshButton.style.cssText = `
            margin-left: 20px;
            padding: 5px 10px;
            cursor: pointer;
            border: 1px solid var(--line_regular);
            background-color: var(--bg1);
            color: var(--text2);
            border-radius: 4px;
            font-size: 12px;
             vertical-align: middle; /* Align with tags */
        `;
         refreshButton.addEventListener('click', async () => {
             if (confirm('确定要重新获取所有关注列表并更新分组吗？这可能需要一些时间。')) {
                 console.log('[BiliGroupView] Manual refresh requested.');
                 refreshButton.textContent = '刷新中...';
                 refreshButton.disabled = true;
                 const success = await buildAndSaveGroups();
                 if (success) {
                     alert('分组信息已刷新！请手动刷新页面以更新标签列表。'); // Simple notification
                     // Ideally, rebuild the UI dynamically here, but page refresh is easier
                 } else {
                    alert('分组信息刷新失败，请查看控制台日志。');
                 }
                 refreshButton.textContent = '🔄 刷新分组';
                 refreshButton.disabled = false;
             }
         });

         // Insert the button after the tags container
         if (parent && sibling && sibling.parentNode === parent) {
              // Insert inside the same container as tags for layout
             if (sibling.nextSibling) {
                 parent.insertBefore(refreshButton, sibling.nextSibling);
             } else {
                 parent.appendChild(refreshButton);
             }
             // Adjust tag container style for button alignment if needed
             sibling.style.display = 'inline-block'; // Make tags container inline
             sibling.style.verticalAlign = 'middle';

             console.log('[BiliGroupView] Refresh button added.');
         } else {
              console.warn('[BiliGroupView] Could not find suitable parent/sibling to add refresh button.');
         }

    }


    // --- Script Execution ---
    // Use a small delay or wait for a specific element if needed,
    // though document-end should often be sufficient.
    // Using waitForElement ensures the target container exists.
    initialize();

})();
