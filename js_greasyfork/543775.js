// ==UserScript==
// @name         Torn Inventory Management
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Manage your Torn inventory with custom categories
// @author       TornUser
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/index.php?page=items*
// @match        https://www.torn.com/bazaar.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543775/Torn%20Inventory%20Management.user.js
// @updateURL https://update.greasyfork.org/scripts/543775/Torn%20Inventory%20Management.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const STORAGE_KEY = 'torn_inventory_management_categories';
    const ITEMS_KEY = 'torn_inventory_management_items_mapping';
    
    // Global variables
    let categories = {};
    let itemsMapping = {};
    let isInitialized = false;

    // Initialize the script
    function init() {
        if (isInitialized) return;
        
        // Load data first
        loadData();
        
        // Check which page we're on and initialize accordingly
        if (isInventoryPage()) {
            console.log('[Torn Inventory] Initializing inventory management...');
            createCategoryInterface();
            
            setTimeout(() => {
                console.log('[Torn Inventory] Looking for inventory items...');
                setupInventoryObserver();
                addInventoryControlsToItems();
            }, 1000);
            
        } else if (isBazaarPage()) {
            console.log('[Torn Inventory] Initializing bazaar category display...');
            setTimeout(() => {
                showCategoriesOnBazaarPage();
                setupBazaarObserver();
            }, 2000);
            
        } else if (isItemMarketPage()) {
            console.log('[Torn Inventory] Initializing item market category display...');
            setTimeout(() => {
                showCategoriesOnItemMarketPage();
                setupItemMarketObserver();
            }, 2000);
            
        } else {
            console.log('[Torn Inventory] Not on supported page, skipping initialization');
            return;
        }
        
        isInitialized = true;
        console.log('[Torn Inventory] Inventory Management loaded successfully');
    }

    // Check if current page is inventory
    function isInventoryPage() {
        return (window.location.href.includes('item.php') || 
               window.location.href.includes('page=items')) &&
               (document.querySelector('.items-wrap, .inventory-wrap, #inventory, .item-list') !== null);
    }

    // Check if current page is bazaar
    function isBazaarPage() {
        return window.location.href.includes('bazaar.php');
    }

    // Check if current page is item market
    function isItemMarketPage() {
        return window.location.href.includes('page.php?sid=ItemMarket');
    }

    // Load saved data from storage
    function loadData() {
        try {
            const savedCategories = GM_getValue(STORAGE_KEY, '{}');
            const savedItems = GM_getValue(ITEMS_KEY, '{}');
            
            categories = JSON.parse(savedCategories);
            itemsMapping = JSON.parse(savedItems);
            
            console.log('[Torn Inventory] Loaded data:', {
                categories: Object.keys(categories).length,
                items: Object.keys(itemsMapping).length
            });
            
            // Initialize with default category if empty
            if (Object.keys(categories).length === 0) {
                categories = {
                    'default': {
                        id: 'default',
                        name: 'Uncategorized',
                        parent: null,
                        children: [],
                        collapsed: false,
                        order: 0
                    }
                };
                saveData();
            }
            
            // Add order property to existing categories if missing
            Object.values(categories).forEach((category, index) => {
                if (category.order === undefined) {
                    category.order = index;
                }
            });
            
        } catch (error) {
            console.error('[Torn Inventory] Error loading data:', error);
            categories = {
                'default': {
                    id: 'default',
                    name: 'Uncategorized',
                    parent: null,
                    children: [],
                    collapsed: false,
                    order: 0
                }
            };
            itemsMapping = {};
        }
    }

    // Save data to storage
    function saveData() {
        try {
            GM_setValue(STORAGE_KEY, JSON.stringify(categories));
            GM_setValue(ITEMS_KEY, JSON.stringify(itemsMapping));
            console.log('[Torn Inventory] Data saved successfully');
        } catch (error) {
            console.error('[Torn Inventory] Error saving data:', error);
        }
    }

    // Show categories on bazaar page
    function showCategoriesOnBazaarPage() {
        console.log('[Torn Inventory] Adding category labels to bazaar page...');
        
        setTimeout(() => {
            const itemElements = findItemElementsOnPage();
            console.log('[Torn Inventory] Found ' + itemElements.length + ' items on bazaar page');
            
            itemElements.forEach(element => {
                const itemId = extractItemIdFromElement(element);
                const itemName = extractItemNameFromElement(element);
                
                if (itemId && itemsMapping[itemId]) {
                    const categoryId = itemsMapping[itemId];
                    const category = categories[categoryId];
                    if (category) {
                        addCategoryLabelToElement(element, category);
                        console.log('[Torn Inventory] Added category label "' + category.name + '" to ' + (itemName || itemId));
                    }
                }
            });
        }, 500);
    }

    // Show categories on item market page
    function showCategoriesOnItemMarketPage() {
        console.log('[Torn Inventory] Adding category labels to item market page...');
        
        setTimeout(() => {
            const itemElements = findItemElementsOnPage();
            console.log('[Torn Inventory] Found ' + itemElements.length + ' items on market page');
            
            itemElements.forEach(element => {
                const itemId = extractItemIdFromElement(element);
                const itemName = extractItemNameFromElement(element);
                
                if (itemId && itemsMapping[itemId]) {
                    const categoryId = itemsMapping[itemId];
                    const category = categories[categoryId];
                    if (category) {
                        addCategoryLabelToElement(element, category);
                        console.log('[Torn Inventory] Added category label "' + category.name + '" to ' + (itemName || itemId));
                    }
                }
            });
        }, 500);
    }

    // Find item elements on any page
    function findItemElementsOnPage() {
        const selectors = [
            '[data-item]',
            'li[data-item]',
            'div[data-item]',
            'tr[data-item]'
        ];
        
        const foundElements = [];
        
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (looksLikeItemElement(element) && !foundElements.includes(element)) {
                        foundElements.push(element);
                    }
                });
            } catch (e) {
                // Ignore selector errors
            }
        });
        
        return foundElements;
    }

    // Check if an element looks like it represents an item
    function looksLikeItemElement(element) {
        if (element.querySelector('.category-label')) {
            return false;
        }
        
        const hasContent = element.textContent.trim().length > 2;
        if (!hasContent) return false;
        
        const isVisible = element.offsetWidth > 0 && element.offsetHeight > 0;
        if (!isVisible) return false;
        
        const hasReasonableSize = element.offsetWidth > 50 && element.offsetHeight > 20;
        if (!hasReasonableSize) return false;
        
        const hasImage = element.querySelector('img');
        const hasDataItem = element.hasAttribute('data-item');
        const hasCheckbox = element.querySelector('input[type="checkbox"]');
        
        return hasImage || hasDataItem || hasCheckbox;
    }

    // Extract item ID from an element on any page
    function extractItemIdFromElement(element) {
        let itemId = element.getAttribute('data-item') || 
                     element.getAttribute('data-id') ||
                     element.getAttribute('data-item-id');
        
        if (!itemId) {
            const childWithId = element.querySelector('[data-item], [data-id], [data-item-id]');
            if (childWithId) {
                itemId = childWithId.getAttribute('data-item') || 
                         childWithId.getAttribute('data-id') || 
                         childWithId.getAttribute('data-item-id');
            }
        }
        
        if (!itemId) {
            let parent = element.parentElement;
            let levels = 0;
            while (parent && levels < 2) {
                itemId = parent.getAttribute('data-item') || 
                         parent.getAttribute('data-id') || 
                         parent.getAttribute('data-item-id');
                if (itemId) break;
                parent = parent.parentElement;
                levels++;
            }
        }
        
        return itemId;
    }

    // Extract item name from an element on any page
    function extractItemNameFromElement(element) {
        const textElements = element.querySelectorAll('div, span, td, th, p');
        
        for (const textEl of textElements) {
            const text = textEl.textContent.trim();
            
            if (text && 
                text.length > 2 && 
                text.length < 100 &&
                !text.match(/^\d+$/) &&
                !text.match(/^[\d,.\s$rrp]+$/i) &&
                !text.includes('$') &&
                !text.includes('RRP') &&
                !text.toLowerCase().includes('qty') &&
                !text.toLowerCase().includes('price') &&
                !text.toLowerCase().includes('equipped') &&
                !text.toLowerCase().includes('untradeable')) {
                
                if (textEl.children.length === 0) {
                    return text;
                }
            }
        }
        
        const img = element.querySelector('img[alt]');
        if (img && img.alt) {
            return img.alt;
        }
        
        return null;
    }

    // Add a category label to an element
    function addCategoryLabelToElement(element, category) {
        if (element.querySelector('.category-label')) {
            return;
        }
        
        const label = document.createElement('div');
        label.className = 'category-label';
        if (category.parent) {
            label.classList.add('subcategory');
        }
        
        let categoryText = category.name;
        if (category.parent && categories[category.parent]) {
            categoryText = categories[category.parent].name + ' → ' + category.name;
        }
        
        label.textContent = categoryText;
        label.title = 'Category: ' + categoryText;
        
        const insertionPoint = findBestInsertionPoint(element);
        if (insertionPoint) {
            insertionPoint.appendChild(label);
        } else {
            element.style.position = 'relative';
            label.style.position = 'absolute';
            label.style.top = '2px';
            label.style.right = '2px';
            label.style.zIndex = '100';
            element.appendChild(label);
        }
    }

    // Find the best place to insert a category label
    function findBestInsertionPoint(element) {
        const candidates = element.querySelectorAll('td:last-child, div:last-child, div, span, td');
        
        for (const candidate of candidates) {
            const text = candidate.textContent.trim().toLowerCase();
            
            if (text === '' || 
                text === 'equipped' || 
                text === 'untradeable' ||
                text.includes('qty') ||
                text.includes('price') ||
                candidate.children.length === 0) {
                return candidate;
            }
        }
        
        const containerDivs = element.querySelectorAll('div');
        if (containerDivs.length > 0) {
            return containerDivs[containerDivs.length - 1];
        }
        
        return null;
    }

    // Setup observer for bazaar page
    function setupBazaarObserver() {
        const observer = new MutationObserver(() => {
            setTimeout(showCategoriesOnBazaarPage, 1000);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[Torn Inventory] Bazaar observer set up');
    }

    // Setup observer for item market page
    function setupItemMarketObserver() {
        const observer = new MutationObserver(() => {
            setTimeout(showCategoriesOnItemMarketPage, 1000);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[Torn Inventory] Item market observer set up');
    }

    // Create the category interface
    function createCategoryInterface() {
        const inventoryContainer = findInventoryContainer();
        if (!inventoryContainer) {
            console.warn('[Torn Inventory] Inventory container not found');
            return;
        }

        const categoriesPanel = createCategoriesPanel();
        inventoryContainer.parentNode.insertBefore(categoriesPanel, inventoryContainer);
        renderCategories();
    }

    // Find the inventory container
    function findInventoryContainer() {
        console.log('[Torn Inventory] Searching for inventory container...');
        
        const selectors = [
            '.items-wrap',
            '.inventory-wrap', 
            '#inventory',
            '.item-list',
            '.items-cont',
            '.item-list-wrap',
            '.your-items'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                console.log('[Torn Inventory] Found inventory container with selector:', selector);
                return element;
            }
        }
        
        const allItems = document.querySelector('ul.all-items');
        if (allItems) {
            console.log('[Torn Inventory] Found ul.all-items container');
            return allItems.parentElement || allItems;
        }
        
        console.warn('[Torn Inventory] No inventory container found');
        return null;
    }

    // Create the categories panel
    function createCategoriesPanel() {
        const panel = document.createElement('div');
        panel.id = 'torn-inventory-management-panel';
        panel.innerHTML = '<div class="inventory-management-header"><h3>Inventory Categories</h3><div class="inventory-management-controls"><button id="add-category-btn" class="torn-btn">+ Add Category</button><button id="reset-categories-btn" class="torn-btn" style="background: #d32f2f;">Reset All</button><button id="toggle-categories-btn" class="torn-btn">Toggle</button></div></div><div id="categories-container" class="categories-container"></div>';
        
        addStyles();
        
        panel.querySelector('#add-category-btn').addEventListener('click', () => {
            showAddCategoryDialog();
        });
        panel.querySelector('#reset-categories-btn').addEventListener('click', resetAllCategories);
        panel.querySelector('#toggle-categories-btn').addEventListener('click', toggleCategoriesPanel);
        
        return panel;
    }

    // Add CSS styles
    function addStyles() {
        const styles = '#torn-inventory-management-panel { background: #2e2e2e; border: 1px solid #444; border-radius: 5px; margin: 10px 0; padding: 15px; color: #ddd; } .inventory-management-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px; } .inventory-management-header h3 { margin: 0; color: #fff; } .inventory-management-controls { display: flex; gap: 10px; } .torn-btn { background: #4a4a4a; border: 1px solid #666; color: #ddd; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 12px; } .torn-btn:hover { background: #555; } .categories-container { max-height: 300px; overflow-y: auto; } .category-item { background: #3a3a3a; border: 1px solid #555; border-radius: 3px; margin: 5px 0; padding: 10px; position: relative; } .category-item.collapsed .category-children, .category-item.collapsed .category-items { display: none; } .category-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; } .category-name { font-weight: bold; color: #fff; } .category-controls { display: flex; gap: 5px; } .category-controls button { background: #555; border: none; color: #ddd; padding: 2px 6px; border-radius: 2px; cursor: pointer; font-size: 10px; } .category-controls button:hover { background: #666; } .category-reorder-controls { display: flex; gap: 2px; margin-right: 5px; } .reorder-btn { background: #666; border: none; color: #ddd; padding: 1px 4px; border-radius: 2px; cursor: pointer; font-size: 10px; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; } .reorder-btn:hover { background: #777; } .reorder-btn:disabled { background: #444; color: #666; cursor: not-allowed; } .category-children { margin-left: 20px; margin-top: 10px; } .torn-inventory-control { margin: 5px 0; padding: 3px; background: rgba(0, 0, 0, 0.3); border-radius: 3px; display: flex; gap: 5px; align-items: center; } .category-selector { background: #4a4a4a; border: 1px solid #666; color: #ddd; padding: 2px 4px; border-radius: 2px; font-size: 11px; flex: 1; max-width: 150px; } .category-quick-btn { background: #555; border: 1px solid #666; color: #ddd; padding: 2px 6px; border-radius: 2px; cursor: pointer; font-size: 10px; } .category-quick-btn:hover { background: #666; } .torn-quick-category-menu { background: #2e2e2e; border: 1px solid #444; border-radius: 3px; padding: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); min-width: 120px; } .quick-menu-title { font-size: 11px; font-weight: bold; color: #fff; padding: 3px 0; border-bottom: 1px solid #444; margin-bottom: 3px; } .quick-category-btn { display: block; width: 100%; background: #4a4a4a; border: 1px solid #666; color: #ddd; padding: 4px 8px; margin: 2px 0; border-radius: 2px; cursor: pointer; font-size: 11px; text-align: left; } .quick-category-btn:hover { background: #555; } .quick-category-btn.remove-btn { background: #d32f2f; border-color: #f44336; } .quick-category-btn.remove-btn:hover { background: #f44336; } .quick-category-btn.close-btn { background: #666; margin-top: 5px; border-top: 1px solid #777; } .category-items { margin-top: 10px; } .category-item-preview { background: #4a4a4a; border: 1px solid #666; padding: 5px; margin: 2px 0; border-radius: 2px; font-size: 11px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: background-color 0.2s ease; } .category-item-preview:hover { background: #555; } @keyframes greenFlash { 0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); } 50% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0.3); } 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); } } .inventory-item-highlighted { animation: greenFlash 2s ease-out; border: 2px solid #4CAF50 !important; background: rgba(76, 175, 80, 0.1) !important; } .remove-item-btn { background: #d32f2f; border: none; color: white; padding: 1px 4px; border-radius: 2px; cursor: pointer; font-size: 10px; } .remove-item-btn:hover { background: #f44336; } .category-label { background: #4a4a4a; color: #ddd; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-style: italic; margin: 2px 0; display: inline-block; border: 1px solid #666; } .category-label.subcategory { background: #5a5a5a; border-color: #777; } .category-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 10000; } .category-modal-content { background: #2e2e2e; border: 1px solid #444; border-radius: 5px; padding: 20px; max-width: 400px; width: 90%; color: #ddd; } .category-modal input, .category-modal select { width: 100%; padding: 8px; margin: 10px 0; background: #4a4a4a; border: 1px solid #666; border-radius: 3px; color: #ddd; } .category-modal-buttons { display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px; }';
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    setTimeout(init, 1000);

})();