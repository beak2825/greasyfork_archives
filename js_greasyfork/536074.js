// ==UserScript==
// @name         [银河奶牛]仓库分类
// @name:en      MWI Warehouse Classification
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  仓库物品分类【收藏-制造-闲置-备用】
// @description:en  Warehouse item classification [Collection - Manufacturing - Idle - Backup]
// @icon         https://www.milkywayidle.com/favicon.svg
// @author       VA
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/536074/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E4%BB%93%E5%BA%93%E5%88%86%E7%B1%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/536074/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E4%BB%93%E5%BA%93%E5%88%86%E7%B1%BB.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 定义制造分类的物品
    const SANZHIZAO_ITEMS = [
        { "name": "奶酪", "fenlei": "资源" },
        { "name": "翠绿奶酪", "fenlei": "资源" },
        { "name": "蔚蓝奶酪", "fenlei": "资源" },
        { "name": "深紫奶酪", "fenlei": "资源" },
        { "name": "绛红奶酪", "fenlei": "资源" },
        { "name": "彩虹奶酪", "fenlei": "资源" },
        { "name": "神圣奶酪", "fenlei": "资源" },
        { "name": "原木", "fenlei": "资源" },
        { "name": "白桦原木", "fenlei": "资源" },
        { "name": "雪松原木", "fenlei": "资源" },
        { "name": "紫心原木", "fenlei": "资源" },
        { "name": "银杏原木", "fenlei": "资源" },
        { "name": "红杉原木", "category": "资源" },
        { "name": "神秘原木", "category": "资源" },
        { "name": "木板", "category": "资源" },
        { "name": "白桦木板", "category": "资源" },
        { "name": "雪松木板", "category": "资源" },
        { "name": "紫心木板", "category": "资源" },
        { "name": "银杏木板", "category": "资源" },
        { "name": "红杉木板", "category": "资源" },
        { "name": "神秘木板", "category": "资源" },
        { "name": "粗糙皮革", "category": "资源" },
        { "name": "棉花布料", "category": "资源" },
        { "name": "爬行动物皮革", "category": "资源" },
        { "name": "亚麻布料", "category": "资源" },
        { "name": "哥布林皮革", "category": "资源" },
        { "name": "竹子布料", "category": "资源" },
        { "name": "野兽皮革", "category": "资源" },
        { "name": "丝绸", "category": "资源" },
        { "name": "暗影皮革", "category": "资源" },
        { "name": "光辉布料", "category": "资源" }
    ];

    // 新增初始化函数（在SANZHIZAO_ITEMS定义下方添加）
    function initializeZhizaowuping() {
        const characterName = getCharacterName();
        if (!ALLOWED_NAMES.has(characterName)) return;

        const storageKey = `ZZ_${characterName}`;
        let existingItems = loadFavoritesFromLocalStorageZZ();

        // 合并预设物品（仅添加不存在的）
        SANZHIZAO_ITEMS.forEach(newItem => {
            if (!existingItems.some(item => item.name === newItem.name)) {
                existingItems.push({
                    name: newItem.name,
                    fenlei: newItem.category
                });
            }
        });

        localStorage.setItem(storageKey, JSON.stringify(existingItems));
    }

    // 获取当前角色名
    function getCharacterName() {
        const headerInfo = document.querySelector('.Header_info__26fkk');
        if (!headerInfo) return null;
        const nameElement = headerInfo.querySelector('.CharacterName_name__1amXp');
        return nameElement ? nameElement.textContent.trim() : null;
    }
    // 定义允许的角色名列表
    const ALLOWED_NAMES = new Set(['VerdantAether', 'Blazebinder', 'Tritondeluge', 'Ponticlemency']); // 注意修正重复项


    //【保存】
    // 保存【收藏】物品到本地存储
    function saveFavoritesToLocalStorage(itemName, fenlei) {
        const characterName = getCharacterName();
        if (!characterName) return;
        const storageKey = `SC_${characterName}`;
        const favorites = loadFavoritesFromLocalStorage();

        // 检查是否已存在相同物品
        const existingIndex = favorites.findIndex(item => item.name === itemName);
        if (existingIndex === -1) {
            favorites.push({name: itemName, fenlei});
            localStorage.setItem(storageKey, JSON.stringify(favorites));
        }
    }
    // 保存【闲置】物品到本地存储
    function saveFavoritesToLocalStorageXZ(itemName, fenlei) {
        const characterName = getCharacterName();
        if (!characterName) return;
        const storageKey = `XZ_${characterName}`;
        const idleItems = loadFavoritesFromLocalStorageXZ();

        // 检查是否已存在相同物品
        const existingIndex = idleItems.findIndex(item => item.name === itemName);
        if (existingIndex === -1) {
            idleItems.push({name: itemName, fenlei});
            localStorage.setItem(storageKey, JSON.stringify(idleItems));
        }
    }
    // 保存【备用】物品到本地存储
    function saveFavoritesToLocalStorageBY(itemName, fenlei) {
        const characterName = getCharacterName();
        if (!characterName) return;
        const storageKey = `ZB_${characterName}`;
        const idleItemsB = loadFavoritesFromLocalStorageBY();

        // 检查是否已存在相同物品
        const existingIndex = idleItemsB.findIndex(item => item.name === itemName);
        if (existingIndex === -1) {
            idleItemsB.push({name: itemName, fenlei});
            localStorage.setItem(storageKey, JSON.stringify(idleItemsB));
        }
    }

    //【去重】
    // 跨分类去重函数（在加载存储前调用）
    function deduplicateAcrossCategories(characterName) {
        const keys = ['SC_', 'XZ_', 'ZZ_', 'ZB_'];
        const categories = {
            manufacture: JSON.parse(localStorage.getItem(keys[2]+characterName)) || [], // 制造 (最高)
            idle: JSON.parse(localStorage.getItem(keys[1]+characterName)) || [], // 闲置
            favorites: JSON.parse(localStorage.getItem(keys[0]+characterName)) || [] // 收藏 (最低)
        };

        const seen = new Set();

        // 按优先级顺序处理：制造 -> 闲置 -> 收藏
        [categories.manufacture, categories.idle, categories.favorites].forEach(list => {
            for (let i = list.length - 1; i >= 0; i--) {
                const item = list[i];
                if (seen.has(item.name)) {
                    list.splice(i, 1); // 删除低优先级重复项
                } else {
                    seen.add(item.name);
                }
            }
        });

        // 保存清理后的数据
        localStorage.setItem(keys[2]+characterName, JSON.stringify(categories.manufacture));
        localStorage.setItem(keys[1]+characterName, JSON.stringify(categories.idle));
        localStorage.setItem(keys[0]+characterName, JSON.stringify(categories.favorites));
    }


    //【加载】
    // 从本地存储加载【收藏】物品
    function loadFavoritesFromLocalStorage() {
        const characterName = getCharacterName();
        if (!characterName) return [];
        deduplicateAcrossCategories(characterName); // 新增去重
        const storageKey = `SC_${characterName}`;
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    }
    // 从本地存储加载【闲置】物品
    function loadFavoritesFromLocalStorageXZ() {
        const characterName = getCharacterName();
        if (!characterName) return [];
        deduplicateAcrossCategories(characterName); // 新增去重
        const storageKey = `XZ_${characterName}`;
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    }
    // 从本地存储加载【制造】物品
    function loadFavoritesFromLocalStorageZZ() {
        const characterName = getCharacterName();
        if (!characterName) return [];
        deduplicateAcrossCategories(characterName); // 新增去重
        const storageKey = `ZZ_${characterName}`;
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    }
    // 从本地存储加载【备用】物品
    function loadFavoritesFromLocalStorageBY() {
        const characterName = getCharacterName();
        if (!characterName) return [];
        deduplicateAcrossCategories(characterName); // 新增去重
        const storageKey = `ZB_${characterName}`;
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    }

    //【创建分类】
    // 创建仓库【收藏】分类
    function addFavoritesCategory() {
        // 查找仓库的所有分类容器
        const firstContainer = document.querySelector('.Inventory_items__6SXv0');
        const inventoryContainers = firstContainer.querySelectorAll(':scope > div');
        if (inventoryContainers && inventoryContainers.length > 0) {
            const existingFavorites = firstContainer.querySelector('#favorites-category');
            if (existingFavorites) {
                return;
            }

            // 创建新的收藏分类
            const favoritesContainer = document.createElement('div');

            // 复制现有分类的结构
            const itemGridHTML = `
                <div class="Inventory_itemGrid__20YAH">
                    <div class="Inventory_label__XEOAx">
                        <span class="Inventory_categoryButton__35s1x">收藏</span>
                    </div>
                    <!-- 这里将来会添加收藏的物品 -->
                </div>
            `;
            favoritesContainer.innerHTML = itemGridHTML;
            favoritesContainer.id = 'favorites-category';

            // 将收藏分类添加到仓库的最前面
            if (firstContainer) {
                firstContainer.insertBefore(favoritesContainer, firstContainer.firstChild);
                //console.log('收藏分类已添加');
            }
        }
    }
    // 创建仓库【闲置】分类
    function addFavoritesCategoryXZ() {
        // 查找仓库的所有分类容器
        const firstContainer = document.querySelector('.Inventory_items__6SXv0');
        const inventoryContainers = firstContainer.querySelectorAll(':scope > div');
        if (inventoryContainers && inventoryContainers.length > 0) {
            const existingFavorites = firstContainer.querySelector('#favorites-categoryXZ');
            if (existingFavorites) {
                return;
            }

            // 创建新的闲置分类
            const favoritesContainer = document.createElement('div');

            // 复制现有分类的结构
            const itemGridHTML = `
                <div class="Inventory_itemGrid__20YAH">
                    <div class="Inventory_label__XEOAx">
                        <span class="Inventory_categoryButton__35s1x">闲置</span>
                    </div>
                    <!-- 这里将来会添加闲置的物品 -->
                </div>
            `;
            favoritesContainer.innerHTML = itemGridHTML;
            favoritesContainer.id = 'favorites-categoryXZ';

            // 将闲置分类添加到仓库的最后面
            if (firstContainer) {
                firstContainer.insertBefore(favoritesContainer, firstContainer.lastChild.nextSibling);
                console.log('闲置分类已添加');
            }
        }
    }
    // 创建仓库【制造】分类
    function addFavoritesCategoryZZ() {
        // 检查当前角色是否符合条件
        const characterName = getCharacterName();
        if (!ALLOWED_NAMES.has(characterName)) return;
        // 查找仓库的所有分类容器
        const firstContainer = document.querySelector('.Inventory_items__6SXv0');
        const inventoryContainers = firstContainer.querySelectorAll(':scope > div');
        if (inventoryContainers && inventoryContainers.length > 0) {
            const existingFavorites = firstContainer.querySelector('#favorites-categoryZZ');
            if (existingFavorites) {
                return;
            }

            // 创建新的制造分类
            const favoritesContainer = document.createElement('div');

            // 复制现有分类的结构
            const itemGridHTML = `
                <div class="Inventory_itemGrid__20YAH">
                    <div class="Inventory_label__XEOAx">
                        <span class="Inventory_categoryButton__35s1x">制造</span>
                    </div>
                    <!-- 这里将来会添加制造的物品 -->
                </div>
            `;
            favoritesContainer.innerHTML = itemGridHTML;
            favoritesContainer.id = 'favorites-categoryZZ';

            // 修改插入位置逻辑
            if (firstContainer) {
                // 找到闲置分类的位置
                const xzCategory = firstContainer.querySelector('#favorites-categoryXZ');

                if (xzCategory) {
                    // 如果存在闲置分类，插入到它前面
                    firstContainer.insertBefore(favoritesContainer, xzCategory);
                } else {
                    // 如果不存在闲置分类，插入到最后一个位置
                    firstContainer.appendChild(favoritesContainer);
                }
                console.log('制造分类已添加到闲置分类前');
            }
        }
    }
    // 创建仓库【备用】分类
    function addFavoritesCategoryBY() {
        // 查找仓库的所有分类容器
        const firstContainer = document.querySelector('.Inventory_items__6SXv0');
        const inventoryContainers = firstContainer.querySelectorAll(':scope > div');
        if (inventoryContainers && inventoryContainers.length > 0) {
            const existingFavorites = firstContainer.querySelector('#favorites-categoryBY');
            if (existingFavorites) {
                return;
            }

            // 创建新的备用分类
            const favoritesContainer = document.createElement('div');

            // 复制现有分类的结构
            const itemGridHTML = `
                <div class="Inventory_itemGrid__20YAH">
                    <div class="Inventory_label__XEOAx">
                        <span class="Inventory_categoryButton__35s1x">备用</span>
                    </div>
                    <!-- 这里将来会添加备用的物品 -->
                </div>
            `;
            favoritesContainer.innerHTML = itemGridHTML;
            favoritesContainer.id = 'favorites-categoryBY';

            // 将备用分类添加到仓库的最后面
            if (firstContainer) {
                firstContainer.insertBefore(favoritesContainer, firstContainer.lastChild.nextSibling);
                console.log('备用分类已添加');
            }
        }
    }



    // 添加制造分类及其物品
    function addSanzhizhaoCategory() {
        const sanzhizhaoCategory = addFavoritesCategoryZZ("制造");
        if (!sanzhizhaoCategory) return;

        // 查找所有仓库物品
        const allItems = document.querySelectorAll('.Inventory_items__6SXv0 .Item_itemContainer__x7kH1');

        // 遍历三制造物品列表
        SANZHIZAO_ITEMS.forEach(item => {
            // 查找匹配的物品
            const matchedItem = [...allItems].find(itemContainer => {
                const itemName = itemContainer.querySelector('svg[aria-label]')?.getAttribute('aria-label') || '';
                return itemName === item.name;
            });

            // 如果找到匹配的物品，移动到制造分类
            if (matchedItem) {
                const itemGrid = sanzhizhaoCategory.querySelector('.Inventory_itemGrid__20YAH');
                if (itemGrid && !itemGrid.contains(matchedItem)) {
                    itemGrid.appendChild(matchedItem);
                }
            }
        });
    }


    //【添加按钮】
    // 添加仓库【收藏】按钮
    function addFavoriteButton(menuContainer) {
        // 检查是否已存在收藏按钮
        const existingButton = menuContainer.querySelector('.favorite-button');
        if (existingButton) {
            return;
        }
        const favoriteButton = document.createElement('button');
        favoriteButton.className = 'Button_button__1Fe9z Button_fullWidth__17pVU favorite-button';
        favoriteButton.textContent = '收藏/取消收藏';

        // 添加点击事件
        favoriteButton.addEventListener('click', function() {
            // 获取当前物品名称
            const itemName = menuContainer.querySelector('.Item_name__2C42x').textContent.trim();
            const characterName = getCharacterName();
            if (!characterName) return;
            const favorites = loadFavoritesFromLocalStorage();
            const itemIndex = favorites.findIndex(item => item.name === itemName);
            const isFavorite = itemIndex !== -1;

            if (isFavorite) {
                const fenlei = favorites[itemIndex].fenlei;
                favorites.splice(itemIndex, 1);
                localStorage.setItem(`SC_${characterName}`, JSON.stringify(favorites));
                const favoritesGrid = document.querySelector('#favorites-category .Inventory_itemGrid__20YAH');
                const existingItem = favoritesGrid.querySelector(`svg[aria-label="${itemName}"]`);
                if (existingItem) {
                    const inventoryItem = document.querySelector(`.Inventory_items__6SXv0 .Item_itemContainer__x7kH1 svg[aria-label="${itemName}"]`);
                    if (!inventoryItem) {
                        console.log('未在仓库中找到该物品');
                        return;
                    }
                    const itemContainer = inventoryItem.closest('.Item_itemContainer__x7kH1');
                    if (!itemContainer) {
                        console.log('无法获取物品容器');
                        return;
                    }

                    const categorySpan = [...document.querySelectorAll('.Inventory_categoryButton__35s1x')]
                    .find(span => span.textContent.trim() === fenlei);
                    if (categorySpan) {
                        const categoryGrid = categorySpan.closest('.Inventory_itemGrid__20YAH');
                        if (categoryGrid) {
                            categoryGrid.appendChild(itemContainer);
                        }
                    }
                    refresh();
                    //existingItem.closest('.Item_itemContainer__x7kH1').remove();
                }
            } else {
                const inventoryItem = document.querySelector(`.Inventory_items__6SXv0 .Item_itemContainer__x7kH1 svg[aria-label="${itemName}"]`);
                if (!inventoryItem) {
                    console.log('未在仓库中找到该物品');
                    return;
                }
                const itemContainer = inventoryItem.closest('.Item_itemContainer__x7kH1');
                if (!itemContainer) {
                    console.log('无法获取物品容器');
                    return;
                }
                const categoryGrid = itemContainer.closest('.Inventory_itemGrid__20YAH');
                const fenlei = categoryGrid ?
                      categoryGrid.querySelector('.Inventory_categoryButton__35s1x')?.textContent.trim() :
                '未知分类';
                saveFavoritesToLocalStorage(itemName, fenlei);
                const favoritesGrid = document.querySelector('#favorites-category .Inventory_itemGrid__20YAH');
                if (!favoritesGrid) {
                    console.log('未找到收藏分类');
                    return;
                }
                const existingItem = favoritesGrid.querySelector(`svg[aria-label="${itemName}"]`);
                if (!existingItem) {
                    favoritesGrid.appendChild(itemContainer);
                }
            }
        });
        menuContainer.appendChild(favoriteButton);
    }
    // 添加仓库【闲置】按钮
    function addFavoriteButtonXZ(menuContainer) {
        // 检查是否已存在闲置按钮
        const existingButton = menuContainer.querySelector('.idle-button');
        if (existingButton) {
            return;
        }
        const idleButton = document.createElement('button');
        idleButton.className = 'Button_button__1Fe9z Button_fullWidth__17pVU idle-button';
        idleButton.textContent = '闲置/取消闲置';

        // 添加点击事件
        idleButton.addEventListener('click', function() {
            // 获取当前物品名称
            const itemName = menuContainer.querySelector('.Item_name__2C42x').textContent.trim();
            const characterName = getCharacterName();
            if (!characterName) return;
            const idleItems = loadFavoritesFromLocalStorageXZ();
            const isIdle = idleItems.findIndex(item => item.name === itemName);
            const isFavorite = isIdle !== -1;

            if (isFavorite) {
                const fenlei = idleItems[isIdle].fenlei;
                idleItems.splice(isIdle, 1);
                localStorage.setItem(`XZ_${characterName}`, JSON.stringify(idleItems));
                const favoritesGrid = document.querySelector('#favorites-categoryXZ .Inventory_itemGrid__20YAH');
                const existingItem = favoritesGrid.querySelector(`svg[aria-label="${itemName}"]`);
                if (existingItem) {
                    const inventoryItem = document.querySelector(`.Inventory_items__6SXv0 .Item_itemContainer__x7kH1 svg[aria-label="${itemName}"]`);
                    if (!inventoryItem) {
                        console.log('未在仓库中找到该物品');
                        return;
                    }
                    const itemContainer = inventoryItem.closest('.Item_itemContainer__x7kH1');
                    if (!itemContainer) {
                        console.log('无法获取物品容器');
                        return;
                    }

                    const categorySpan = [...document.querySelectorAll('.Inventory_categoryButton__35s1x')]
                    .find(span => span.textContent.trim() === fenlei);
                    if (categorySpan) {
                        const categoryGrid = categorySpan.closest('.Inventory_itemGrid__20YAH');
                        if (categoryGrid) {
                            categoryGrid.appendChild(itemContainer);
                        }
                    }
                    refresh();
                    //existingItem.closest('.Item_itemContainer__x7kH1').remove();
                }
            } else {
                const inventoryItem = document.querySelector(`.Inventory_items__6SXv0 .Item_itemContainer__x7kH1 svg[aria-label="${itemName}"]`);
                if (!inventoryItem) {
                    console.log('未在仓库中找到该物品');
                    return;
                }
                const itemContainer = inventoryItem.closest('.Item_itemContainer__x7kH1');
                if (!itemContainer) {
                    console.log('无法获取物品容器');
                    return;
                }
                const categoryGrid = itemContainer.closest('.Inventory_itemGrid__20YAH');
                const fenlei = categoryGrid ?
                      categoryGrid.querySelector('.Inventory_categoryButton__35s1x')?.textContent.trim() :
                '未知分类';
                saveFavoritesToLocalStorageXZ(itemName, fenlei);
                const favoritesGrid = document.querySelector('#favorites-categoryXZ .Inventory_itemGrid__20YAH');
                if (!favoritesGrid) {
                    console.log('未找到闲置分类');
                    return;
                }
                const existingItem = favoritesGrid.querySelector(`svg[aria-label="${itemName}"]`);
                if (!existingItem) {
                    favoritesGrid.appendChild(itemContainer);
                }
            }
        });
        menuContainer.appendChild(idleButton);
    }
    // 添加仓库【备用】按钮
    function addFavoriteButtonBY(menuContainer) {
        // 检查是否已存在闲置按钮
        const existingButton = menuContainer.querySelector('.by-button');
        if (existingButton) {
            return;
        }
        const idleButton = document.createElement('button');
        idleButton.className = 'Button_button__1Fe9z Button_fullWidth__17pVU by-button';
        idleButton.textContent = '备用/取消备用';

        // 添加点击事件
        idleButton.addEventListener('click', function() {
            // 获取当前物品名称
            const itemName = menuContainer.querySelector('.Item_name__2C42x').textContent.trim();
            const characterName = getCharacterName();
            if (!characterName) return;
            const idleItemsB = loadFavoritesFromLocalStorageBY();
            const itemIndex = idleItemsB.findIndex(item => item.name === itemName);
            const isInBY = itemIndex !== -1;

            if (isInBY) {
                const fenlei = idleItemsB[itemIndex].fenlei;
                idleItemsB.splice(itemIndex, 1);
                localStorage.setItem(`ZB_${characterName}`, JSON.stringify(idleItemsB));
                const favoritesGrid = document.querySelector('#favorites-categoryBY .Inventory_itemGrid__20YAH');
                const existingItem = favoritesGrid.querySelector(`svg[aria-label="${itemName}"]`);
                if (existingItem) {
                    const inventoryItem = document.querySelector(`.Inventory_items__6SXv0 .Item_itemContainer__x7kH1 svg[aria-label="${itemName}"]`);
                    if (!inventoryItem) {
                        console.log('未在仓库中找到该物品');
                        return;
                    }
                    const itemContainer = inventoryItem.closest('.Item_itemContainer__x7kH1');
                    if (!itemContainer) {
                        console.log('无法获取物品容器');
                        return;
                    }

                    const categorySpan = [...document.querySelectorAll('.Inventory_categoryButton__35s1x')]
                    .find(span => span.textContent.trim() === fenlei);
                    if (categorySpan) {
                        const categoryGrid = categorySpan.closest('.Inventory_itemGrid__20YAH');
                        if (categoryGrid) {
                            categoryGrid.appendChild(itemContainer);
                        }
                    }
                    refresh();
                    //existingItem.closest('.Item_itemContainer__x7kH1').remove();
                }
            } else {
                const inventoryItem = document.querySelector(`.Inventory_items__6SXv0 .Item_itemContainer__x7kH1 svg[aria-label="${itemName}"]`);
                if (!inventoryItem) {
                    console.log('未在仓库中找到该物品');
                    return;
                }
                const itemContainer = inventoryItem.closest('.Item_itemContainer__x7kH1');
                if (!itemContainer) {
                    console.log('无法获取物品容器');
                    return;
                }
                const categoryGrid = itemContainer.closest('.Inventory_itemGrid__20YAH');
                const fenlei = categoryGrid ?
                      categoryGrid.querySelector('.Inventory_categoryButton__35s1x')?.textContent.trim() :
                '未知分类';
                saveFavoritesToLocalStorageBY(itemName, fenlei);
                const favoritesGrid = document.querySelector('#favorites-categoryBY .Inventory_itemGrid__20YAH');
                if (!favoritesGrid) {
                    console.log('未找到备用分类');
                    return;
                }
                const existingItem = favoritesGrid.querySelector(`svg[aria-label="${itemName}"]`);
                if (!existingItem) {
                    favoritesGrid.appendChild(itemContainer);
                }
            }
        });
        menuContainer.appendChild(idleButton);
    }


    // 刷新函数，当DOM变化时调用
    function refresh() {
        const inventoryContainer = document.querySelector('.Inventory_items__6SXv0');
        if (inventoryContainer) {
            addFavoritesCategory();
            addFavoritesCategoryXZ();
            addFavoritesCategoryZZ();
            addFavoritesCategoryBY();
            addSanzhizhaoCategory();
            initializeZhizaowuping();
            const favorites = loadFavoritesFromLocalStorage();
            const favoritesGrid = document.querySelector('#favorites-category .Inventory_itemGrid__20YAH');
            if (favoritesGrid) {
                favorites.forEach(item => {
                    const inventoryItem = document.querySelector(`.Inventory_items__6SXv0 .Item_itemContainer__x7kH1 svg[aria-label="${item.name}"]`);
                    if (inventoryItem) {
                        const itemContainer = inventoryItem.closest('.Item_itemContainer__x7kH1');
                        const existingItem = favoritesGrid.querySelector(`svg[aria-label="${item.name}"]`);
                        if (!existingItem && itemContainer) {
                            favoritesGrid.appendChild(itemContainer);
                        }
                    }
                });
            }
            const favoritesXZ = loadFavoritesFromLocalStorageXZ();
            const favoritesGridXZ = document.querySelector('#favorites-categoryXZ .Inventory_itemGrid__20YAH');
            if (favoritesGridXZ) {
                favoritesXZ.forEach(item => {
                    const inventoryItem = document.querySelector(`.Inventory_items__6SXv0 .Item_itemContainer__x7kH1 svg[aria-label="${item.name}"]`);
                    if (inventoryItem) {
                        const itemContainer = inventoryItem.closest('.Item_itemContainer__x7kH1');
                        const existingItem = favoritesGridXZ.querySelector(`svg[aria-label="${item.name}"]`);
                        if (!existingItem && itemContainer) {
                            favoritesGridXZ.appendChild(itemContainer);
                        }
                    }
                });
            }
            const favoritesZZ = loadFavoritesFromLocalStorageZZ();
            const favoritesGridZZ = document.querySelector('#favorites-categoryZZ .Inventory_itemGrid__20YAH');
            if (favoritesGridZZ) {
                favoritesZZ.forEach(item => {
                    const inventoryItem = document.querySelector(`.Inventory_items__6SXv0 .Item_itemContainer__x7kH1 svg[aria-label="${item.name}"]`);
                    if (inventoryItem) {
                        const itemContainer = inventoryItem.closest('.Item_itemContainer__x7kH1');
                        const existingItem = favoritesGridZZ.querySelector(`svg[aria-label="${item.name}"]`);
                        if (!existingItem && itemContainer) {
                            favoritesGridZZ.appendChild(itemContainer);
                        }
                    }
                });
            }
            const favoritesBY = loadFavoritesFromLocalStorageBY();
            const favoritesGridBY = document.querySelector('#favorites-categoryBY .Inventory_itemGrid__20YAH');
            if (favoritesGridBY) {
                favoritesBY.forEach(item => {
                    const inventoryItem = document.querySelector(`.Inventory_items__6SXv0 .Item_itemContainer__x7kH1 svg[aria-label="${item.name}"]`);
                    if (inventoryItem) {
                        const itemContainer = inventoryItem.closest('.Item_itemContainer__x7kH1');
                        const existingItem = favoritesGridBY.querySelector(`svg[aria-label="${item.name}"]`);
                        if (!existingItem && itemContainer) {
                            favoritesGridBY.appendChild(itemContainer);
                        }
                    }
                });
            }
        }


        // 检查是否出现物品菜单
        const itemMenu = document.querySelector('.Item_actionMenu__2yUcG');
        if (itemMenu) {
            addFavoriteButton(itemMenu);
            addFavoriteButtonXZ(itemMenu);
            addFavoriteButtonBY(itemMenu);
        }
    }

    // 设置MutationObserver监听DOM变化
    const config = { attributes: true, childList: true, subtree: true };
    const observer = new MutationObserver(function (mutationsList, observer) {
        refresh();
    });
    observer.observe(document, config);
})();