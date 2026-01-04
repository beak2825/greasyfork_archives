// ==UserScript==
// @name         [银河奶牛]仓库物品收藏和快速切换角色
// @name:en      MWI Item Favorites Manager && Quickly Switch Characters
// @namespace    http://tampermonkey.net/
// @version      test0.23
// @description  仓库物品收藏管理和快速切换角色||Added a favorite button to the item menu and 4 characters buttons to the main page.
// @description:en  Added a favorite button to the item menu and 4 characters buttons to the main page.
// @icon         https://www.milkywayidle.com/favicon.svg
// @author       Meoling
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/531682/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E4%BB%93%E5%BA%93%E7%89%A9%E5%93%81%E6%94%B6%E8%97%8F%E5%92%8C%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%E8%A7%92%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/531682/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E4%BB%93%E5%BA%93%E7%89%A9%E5%93%81%E6%94%B6%E8%97%8F%E5%92%8C%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%E8%A7%92%E8%89%B2.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 获取当前角色名
    function getCharacterName() {
        const headerInfo = document.querySelector('.Header_info__26fkk');
        if (!headerInfo) return null;
        const nameElement = headerInfo.querySelector('.CharacterName_name__1amXp');
        return nameElement ? nameElement.textContent.trim() : null;
    }

    // 保存收藏物品到本地存储
    function saveFavoritesToLocalStorage(itemName, categoryName) {
        const characterName = getCharacterName();
        if (!characterName) return;
        const storageKey = `mw_favorites_${characterName}`;
        const favorites = loadFavoritesFromLocalStorage();

        // 检查是否已存在相同物品
        const existingIndex = favorites.findIndex(item => item.name === itemName);
        if (existingIndex === -1) {
            favorites.push({name: itemName, category: categoryName});
            localStorage.setItem(storageKey, JSON.stringify(favorites));
        }
    }

    // 从本地存储加载收藏物品
    function loadFavoritesFromLocalStorage() {
        const characterName = getCharacterName();
        if (!characterName) return [];
        const storageKey = `mw_favorites_${characterName}`;
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    }

    // 创建仓库收藏分类
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

    // 添加仓库收藏按钮
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
                const itemCategory = favorites[itemIndex].category;
                favorites.splice(itemIndex, 1);
                localStorage.setItem(`mw_favorites_${characterName}`, JSON.stringify(favorites));
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
                        .find(span => span.textContent.trim() === itemCategory);
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
                const categoryName = categoryGrid ?
                    categoryGrid.querySelector('.Inventory_categoryButton__35s1x')?.textContent.trim() :
                    '未知分类';
                saveFavoritesToLocalStorage(itemName, categoryName);
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
    
    // 添加市场的分类容器（未完成）
    function addMarketFavoritesCategory() {

    }

    // 刷新函数，当DOM变化时调用
    function refresh() {
        try {
            // 仓库收藏功能
            const inventoryContainer = document.querySelector('.Inventory_items__6SXv0');
            if (inventoryContainer) {
                addFavoritesCategory();
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
            }

            // 检查是否出现物品菜单
            const itemMenu = document.querySelector('.Item_actionMenu__2yUcG');
            if (itemMenu) {
                addFavoriteButton(itemMenu);
            }


            //市场物品的收藏（未完成）

            // 角色选择页面检测 - 添加防抖
            if (isCharacterSelectPage()) {
                if (!window.mwCharacterDetected) {
                    window.mwCharacterDetected = true;
                    detectAndSaveCharacters();
                }
            } else {
                window.mwCharacterDetected = false;
                // 非角色选择页面，创建快速切换按钮 - 添加防抖
                if (!document.querySelector('#character-switch-container')) {
                    createCharacterSwitchButtons();
                }
            }
        } catch (error) {
            console.log('刷新函数出错:', error);
        }
    }

    // 设置MutationObserver监听DOM变化
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(function (mutationsList, observer) {
        refresh();
    });
    observer.observe(document, config);

    // 页面加载完成后执行一次
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', refresh);
    } else {
        refresh();
    }

    // ===== 快速切换角色功能 =====
    
    // 获取服务器类型
    function getServerType() {
        return window.location.hostname.includes('test') ? 'test' : 'main';
    }

    // 检查是否在角色选择页面
    function isCharacterSelectPage() {
        return window.location.pathname.includes('/characterSelect');
    }

    // 检测并保存角色信息
    function detectAndSaveCharacters() {
        const serverType = getServerType();
        const storageKey = `mw_characters_${serverType}`;
        
        setTimeout(() => {
            try {
                const characterElements = document.querySelectorAll('.MuiTypography-root');
                const gameModeElements = document.querySelectorAll('.CharacterSelectPage_gameMode__R2el7');
                const characters = [];
                
                let characterIndex = 0;
                characterElements.forEach((element) => {
                    try {
                        if (element.tagName !== 'A') return;
                        
                        const link = element.href;
                        if (!link || !link.includes('characterId=')) return;
                        
                        const characterNameElement = element.querySelector('.CharacterName_characterName__2FqyZ');
                        if (!characterNameElement) return;
                        const characterName = characterNameElement.textContent.trim();
                        
                        // 获取角色模式
                        let mode = '';
                        if (gameModeElements[characterIndex]) {
                            const modeText = gameModeElements[characterIndex].textContent.trim();
                            if (modeText === '标准' || modeText === 'Standard') {
                                mode = '标准';
                            } else if (modeText === '铁牛' || modeText === 'Ironcow') {
                                mode = '铁牛';
                            }
                        }
                        
                        const displayText = mode ? `${mode}(${characterName})` : characterName;
                        
                        characters.push({
                            name: characterName,
                            mode: mode,
                            link: link,
                            displayText: displayText
                        });
                        
                        characterIndex++;
                    } catch (error) {
                        console.log('处理单个角色信息时出错:', error);
                    }
                });
                
                if (characters.length > 0) {
                    localStorage.setItem(storageKey, JSON.stringify(characters));
                    console.log(`已保存${characters.length}个角色信息到${serverType}服`);
                }
            } catch (error) {
                console.log('检测角色信息时出错:', error);
            }
        }, 2000);
    }

    // 从本地存储加载角色信息
    function loadCharactersFromStorage() {
        const serverType = getServerType();
        const storageKey = `mw_characters_${serverType}`;
        const storedData = localStorage.getItem(storageKey);
        return storedData ? JSON.parse(storedData) : [];
    }

    // 创建快速切换角色按钮
    function createCharacterSwitchButtons() {
        const existingContainer = document.querySelector('#character-switch-container');
        if (existingContainer) existingContainer.remove();
        
        const characters = loadCharactersFromStorage();
        
        let isCollapsed = false;
        
        // 主容器
        const mainContainer = document.createElement('div');
        mainContainer.id = 'character-switch-container';
        Object.assign(mainContainer.style, {
            position: 'fixed',
            top: '10px',
            left: '73%',
            transform: 'translateX(-50%)',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        });
        
        // 折叠按钮
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '▼';
        toggleButton.title = characters.length > 0 ? '收起角色切换' : '收起角色选择';
        Object.assign(toggleButton.style, {
            padding: '2px 8px',
            backgroundColor: 'rgba(48, 63, 159, 0.3)',
            color: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
            fontSize: '12px',
            cursor: 'pointer',
            backdropFilter: 'blur(2px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            minWidth: '24px',
            height: '20px',
            marginBottom: '5px'
        });
        
        // 按钮容器
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            maxWidth: '500px',
            justifyContent: 'center'
        });
        
        // 通用按钮样式
        const buttonStyle = {
            padding: '4px 8px',
            backgroundColor: 'rgba(48, 63, 159, 0.3)',
            color: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
            fontSize: '12px',
            backdropFilter: 'blur(2px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textDecoration: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        };
        
        const hoverStyle = {
            backgroundColor: 'rgba(26, 35, 126, 0.5)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        };
        
        // 如果没有角色数据，创建一个跳转到角色选择界面的按钮
        if (characters.length === 0) {
            const characterSelectButton = document.createElement('a');
            characterSelectButton.textContent = '获取角色数据';
            
            // 构建角色选择页面的URL
            const currentOrigin = window.location.origin;
            characterSelectButton.href = `${currentOrigin}/characterSelect`;
            characterSelectButton.title = '前往角色选择页面获取角色信息';
            
            Object.assign(characterSelectButton.style, buttonStyle);
            
            characterSelectButton.addEventListener('mouseover', () => Object.assign(characterSelectButton.style, hoverStyle));
            characterSelectButton.addEventListener('mouseout', () => Object.assign(characterSelectButton.style, buttonStyle));
            
            buttonContainer.appendChild(characterSelectButton);
        } else {
            // 有角色数据时，创建角色按钮
            characters.forEach((character) => {
                const button = document.createElement('a');
                button.textContent = character.displayText;
                button.href = character.link;
                button.title = `切换到: ${character.displayText}`;
                Object.assign(button.style, buttonStyle);
                
                button.addEventListener('mouseover', () => Object.assign(button.style, hoverStyle));
                button.addEventListener('mouseout', () => Object.assign(button.style, buttonStyle));
                
                buttonContainer.appendChild(button);
            });
        }
        
        // 折叠按钮事件
        toggleButton.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            buttonContainer.style.display = isCollapsed ? 'none' : 'flex';
            toggleButton.textContent = isCollapsed ? '▲' : '▼';
            if (characters.length > 0) {
                toggleButton.title = isCollapsed ? '展开角色切换' : '收起角色切换';
            } else {
                toggleButton.title = isCollapsed ? '展开角色选择' : '收起角色选择';
            }
        });
        
        toggleButton.addEventListener('mouseover', () => Object.assign(toggleButton.style, hoverStyle));
        toggleButton.addEventListener('mouseout', () => Object.assign(toggleButton.style, buttonStyle));
        
        mainContainer.appendChild(toggleButton);
        mainContainer.appendChild(buttonContainer);
        document.body.appendChild(mainContainer);
    }

})();