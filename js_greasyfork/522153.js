// ==UserScript==
// @name         Enhanced Context Menu
// @author       ALFHAZERO
// @namespace    http://
// @version      2.1.1
// @description  Enhanced context menu with additional features and customization
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/522153/Enhanced%20Context%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/522153/Enhanced%20Context%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* 1. CONSTANTS & GLOBAL VARIABLES */
    const STORAGE_KEYS = {
        PREFERENCES: 'userPreferences',
        HIDDEN_ELEMENTS: 'hiddenElements',
        BOOKMARKS: 'globalBookmarks'
    };

    /* 2. STYLES */
    const styles = {
        contextMenu: {
            position: 'fixed',
            backgroundColor: '#ffffff',
            border: '1px solid #cccccc',
            borderRadius: '4px',
            padding: '5px 0',
            minWidth: '200px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: '9999999',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif'
        },
        menuItem: {
            padding: '8px 20px',
            cursor: 'pointer',
            listStyle: 'none',
            margin: '0',
            color: '#333333',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        divider: {
            height: '1px',
            backgroundColor: '#e0e0e0',
            margin: '5px 0'
        }
    };

    /* 3. DEFAULT PREFERENCES */
    const defaultPreferences = {
        showBookmark: true,
        showShare: true,
        showOpen: true,
        showViewImage: true,
        showHideElement: true,
        showSaveImage: true,
        showReload: true,
        showPrint: true,
        showOpenInNewTab: true,
        showCopyOptions: true,
        menuPosition: 'right',
        darkMode: false,
        fontSize: 'normal',
        menuStyle: 'default',
        menuAnimation: true,
        menuTransparency: 1,
        timeoutDuration: 3000,
        vibrateOnLongPress: true,
        swipeGestures: true,
        longPressDelay: 500,
        preventDefaultContextMenu: true,
        touchMoveThreshold: 10
    };

    /* 4. GLOBAL VARIABLES */
    let userPreferences = { ...defaultPreferences };
    let hiddenElements = [];
    let globalBookmarks = [];

    /* 5. UTILITY FUNCTIONS */
    function applyStyles(element, styleObject) {
        Object.assign(element.style, styleObject);
    }

    function removeContextMenu() {
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
    }

    function vibrate(duration = 50) {
        if (userPreferences.vibrateOnLongPress && navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('Berhasil disalin!');
        } catch (err) {
            // Fallback method for browsers that don't support clipboard API
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showNotification('Berhasil disalin!');
            } catch (e) {
                showNotification('Gagal menyalin teks');
            }
            document.body.removeChild(textarea);
        }
    }

    function showNotification(message, duration = 2000) {
        const notification = document.createElement('div');
        applyStyles(notification, {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '4px',
            zIndex: '10000',
            transition: 'opacity 0.3s'
        });
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    function getSelectedText() {
        const selection = window.getSelection();
        return selection ? selection.toString().trim() : '';
    }

    function getLinkUrl(element) {
        const linkElement = element.closest('a') || (element.tagName === 'A' ? element : null);
        return linkElement ? linkElement.href : null;
    }

    function getImageUrl(element) {
        if (element.tagName === 'IMG') {
            return element.src;
        } else if (element.style.backgroundImage) {
            const match = element.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            return match ? match[1] : null;
        }
        return null;
    }

    function getElementText(element) {
        // Get only the text directly contained by this element, excluding child elements
        let text = '';
        for (let node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent.trim();
            }
        }
        return text || element.innerText.trim() || '';
    }


    /* 6. MANAGER FUNCTIONS */
    function createBookmarkManager() {
        removeContextMenu();
        
        const manager = document.createElement('div');
        applyStyles(manager, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: userPreferences.darkMode ? '#333' : '#fff',
            color: userPreferences.darkMode ? '#fff' : '#333',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: '10000',
            maxWidth: '80%',
            maxHeight: '80vh',
            overflow: 'auto'
        });

        const title = document.createElement('h3');
        title.textContent = 'Bookmark Manager';
        title.style.marginTop = '0';
        manager.appendChild(title);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        applyStyles(closeBtn, {
            position: 'absolute',
            right: '10px',
            top: '10px',
            border: 'none',
            background: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: userPreferences.darkMode ? '#fff' : '#333'
        });
        closeBtn.onclick = () => manager.remove();
        manager.appendChild(closeBtn);

        if (globalBookmarks.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'Tidak ada bookmark';
            manager.appendChild(emptyMsg);
        } else {
            const list = document.createElement('ul');
            applyStyles(list, {
                listStyle: 'none',
                padding: '0',
                margin: '0'
            });

            globalBookmarks.forEach((bookmark, index) => {
                const item = document.createElement('li');
                applyStyles(item, {
                    padding: '10px',
                    borderBottom: '1px solid ' + (userPreferences.darkMode ? '#555' : '#eee'),
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                });

                const link = document.createElement('a');
                link.href = bookmark.url;
                link.textContent = bookmark.title;
                link.target = '_blank';
                applyStyles(link, {
                    color: userPreferences.darkMode ? '#fff' : '#333',
                    textDecoration: 'none'
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Hapus';
                applyStyles(deleteBtn, {
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#ff4444',
                    color: '#fff',
                    cursor: 'pointer'
                });
                deleteBtn.onclick = () => {
                    globalBookmarks.splice(index, 1);
                    saveAllData();
                    item.remove();
                    if (globalBookmarks.length === 0) {
                        manager.querySelector('ul').remove();
                        const emptyMsg = document.createElement('p');
                        emptyMsg.textContent = 'Tidak ada bookmark';
                        manager.appendChild(emptyMsg);
                    }
                };

                item.appendChild(link);
                item.appendChild(deleteBtn);
                list.appendChild(item);
            });

            manager.appendChild(list);
        }

        document.body.appendChild(manager);
    }

    function createHiddenElementsManager() {
        removeContextMenu();
        
        const manager = document.createElement('div');
        applyStyles(manager, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: userPreferences.darkMode ? '#333' : '#fff',
            color: userPreferences.darkMode ? '#fff' : '#333',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: '10000',
            maxWidth: '80%',
            maxHeight: '80vh',
            overflow: 'auto'
        });

        const title = document.createElement('h3');
        title.textContent = 'Hidden Elements Manager';
        title.style.marginTop = '0';
        manager.appendChild(title);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        applyStyles(closeBtn, {
            position: 'absolute',
            right: '10px',
            top: '10px',
            border: 'none',
            background: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: userPreferences.darkMode ? '#fff' : '#333'
        });
        closeBtn.onclick = () => manager.remove();
        manager.appendChild(closeBtn);

        if (hiddenElements.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'Tidak ada elemen tersembunyi';
            manager.appendChild(emptyMsg);
        } else {
            const list = document.createElement('ul');
            applyStyles(list, {
                listStyle: 'none',
                padding: '0',
                margin: '0'
            });

            hiddenElements.forEach((selector, index) => {
                const item = document.createElement('li');
                applyStyles(item, {
                    padding: '10px',
                    borderBottom: '1px solid ' + (userPreferences.darkMode ? '#555' : '#eee'),
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                });

                const text = document.createElement('span');
                text.textContent = selector;

                const showBtn = document.createElement('button');
                showBtn.textContent = 'Tampilkan';
                applyStyles(showBtn, {
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    cursor: 'pointer',
                    marginRight: '5px'
                });
                showBtn.onclick = () => {
                    try {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(el => {
                            el.style.display = '';
                        });
                        hiddenElements.splice(index, 1);
                        saveAllData();
                        item.remove();
                        if (hiddenElements.length === 0) {
                            manager.querySelector('ul').remove();
                            const emptyMsg = document.createElement('p');
                            emptyMsg.textContent = 'Tidak ada elemen tersembunyi';
                            manager.appendChild(emptyMsg);
                        }
                    } catch (e) {
                        console.error('Error showing element:', e);
                    }
                };

                item.appendChild(text);
                item.appendChild(showBtn);
                list.appendChild(item);
            });

            manager.appendChild(list);
        }

        document.body.appendChild(manager);
    }


    /* 7. CONTEXT MENU CREATION */
    function createContextMenu(target, x, y) {
        removeContextMenu();

        const menu = document.createElement('ul');
        menu.className = 'context-menu';
        applyStyles(menu, {
            ...styles.contextMenu,
            ...(userPreferences.darkMode ? {
                backgroundColor: '#333333',
                border: '1px solid #555555',
                color: '#ffffff'
            } : {}),
            opacity: userPreferences.menuTransparency
        });

        // Menu Items Array
        const menuItems = [];

        // Copy Options
        const selectedText = getSelectedText();
        if (selectedText) {
            menuItems.push({
                text: 'Salin Teks Terpilih',
                icon: '📋',
                action: () => copyToClipboard(selectedText)
            });
        }

        // Get element text (excluding child elements)
        const elementText = getElementText(target);
        if (elementText && elementText !== selectedText) {
            menuItems.push({
                text: 'Salin Teks Elemen',
                icon: '📝',
                action: () => copyToClipboard(elementText)
            });
        }

        // Image Options
        const imageUrl = getImageUrl(target);
        if (imageUrl) {
            if (userPreferences.showViewImage) {
                menuItems.push({
                    text: 'Lihat Gambar',
                    icon: '🖼️',
                    action: () => window.open(imageUrl, '_blank')
                });
            }
            if (userPreferences.showSaveImage) {
                menuItems.push({
                    text: 'Simpan Gambar',
                    icon: '💾',
                    action: () => {
                        const link = document.createElement('a');
                        link.href = imageUrl;
                        link.download = imageUrl.split('/').pop() || 'image';
                        link.click();
                    }
                });
            }
            menuItems.push({
                text: 'Salin URL Gambar',
                icon: '🔗',
                action: () => copyToClipboard(imageUrl)
            });
        }

        // Link Options
        const linkUrl = getLinkUrl(target);
        if (linkUrl) {
            menuItems.push({
                text: 'Salin Link',
                icon: '🔗',
                action: () => copyToClipboard(linkUrl)
            });

            if (userPreferences.showOpenInNewTab) {
                menuItems.push({
                    text: 'Buka di Tab Baru',
                    icon: '📑',
                    action: () => window.open(linkUrl, '_blank')
                });
            }
        }

        // Standard Menu Items
        if (userPreferences.showBookmark) {
            menuItems.push({
                text: 'Bookmark',
                icon: '⭐',
                action: () => {
                    const url = imageUrl || linkUrl || window.location.href;
                    const title = elementText || document.title;
                    globalBookmarks.push({ url, title });
                    saveAllData();
                    showNotification('Bookmark ditambahkan!');
                }
            });
        }

        if (userPreferences.showShare) {
            menuItems.push({
                text: 'Bagikan',
                icon: '📤',
                action: () => {
                    const url = imageUrl || linkUrl || window.location.href;
                    if (navigator.share) {
                        navigator.share({
                            title: document.title,
                            url: url
                        }).catch(console.error);
                    } else {
                        copyToClipboard(url);
                    }
                }
            });
        }

        if (userPreferences.showHideElement) {
            menuItems.push({
                text: 'Sembunyikan Elemen',
                icon: '👁️',
                action: () => {
                    target.style.display = 'none';
                    const selector = target.tagName.toLowerCase() + 
                        (target.className ? '.' + target.className.replace(/\s+/g, '.') : '');
                    hiddenElements.push(selector);
                    saveAllData();
                    showNotification('Elemen disembunyikan!');
                }
            });
        }

        // Management Options
        menuItems.push({
            text: 'Kelola Bookmark',
            icon: '📚',
            action: () => createBookmarkManager()
        });

        menuItems.push({
            text: 'Kelola Elemen Tersembunyi',
            icon: '👁️',
            action: () => createHiddenElementsManager()
        });

        if (userPreferences.showReload) {
            menuItems.push({
                text: 'Muat Ulang',
                icon: '🔄',
                action: () => location.reload()
            });
        }

        // Create Menu Items
        menuItems.forEach((item, index) => {
            if (index > 0) {
                const divider = document.createElement('li');
                applyStyles(divider, styles.divider);
                menu.appendChild(divider);
            }

            const menuItem = document.createElement('li');
            applyStyles(menuItem, styles.menuItem);
            
            menuItem.innerHTML = `<span class="menu-icon">${item.icon}</span><span>${item.text}</span>`;
            
            if (userPreferences.darkMode) {
                menuItem.style.color = '#ffffff';
            }

            menuItem.addEventListener('mouseover', () => {
                menuItem.style.backgroundColor = userPreferences.darkMode ? '#444444' : '#f0f0f0';
            });

            menuItem.addEventListener('mouseout', () => {
                menuItem.style.backgroundColor = 'transparent';
            });

            menuItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                item.action();
                removeContextMenu();
            });

            menu.appendChild(menuItem);
        });


        // Position Menu
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const menuWidth = 200; // Estimated menu width
        const menuHeight = menuItems.length * 40; // Estimated menu height

        let posX = x;
        let posY = y;

        // Check horizontal position
        if (x + menuWidth > viewportWidth) {
            posX = viewportWidth - menuWidth - 10;
        }

        // Check vertical position
        if (y + menuHeight > viewportHeight) {
            posY = viewportHeight - menuHeight - 10;
        }

        applyStyles(menu, {
            left: posX + 'px',
            top: posY + 'px'
        });

        document.body.appendChild(menu);

        // Auto hide menu after timeout
        if (userPreferences.timeoutDuration > 0) {
            setTimeout(() => {
                if (document.body.contains(menu)) {
                    menu.style.opacity = '0';
                    setTimeout(() => removeContextMenu(), 300);
                }
            }, userPreferences.timeoutDuration);
        }

        return menu;
    }

    /* 8. LONG PRESS HANDLER */
    function setupLongPress(element) {
        if (element.hasAttribute('data-longpress-initialized')) return;

        let timeoutId;
        let startX, startY;
        let isLongPress = false;
        const moveThreshold = userPreferences.touchMoveThreshold;

        const startLongPress = (e) => {
            const coords = e.type.includes('touch') ? 
                { x: e.touches[0].clientX, y: e.touches[0].clientY } :
                { x: e.clientX, y: e.clientY };

            startX = coords.x;
            startY = coords.y;
            isLongPress = false;

            timeoutId = setTimeout(() => {
                isLongPress = true;
                vibrate();
                createContextMenu(e.target, coords.x, coords.y);
            }, userPreferences.longPressDelay);
        };

        const moveHandler = (e) => {
            if (!timeoutId) return;

            const coords = e.type.includes('touch') ?
                { x: e.touches[0].clientX, y: e.touches[0].clientY } :
                { x: e.clientX, y: e.clientY };

            if (Math.abs(coords.x - startX) > moveThreshold || 
                Math.abs(coords.y - startY) > moveThreshold) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        };

        const endLongPress = (e) => {
            clearTimeout(timeoutId);
            if (!isLongPress) return true;
            e.preventDefault();
            return false;
        };

        // Touch Events
        element.addEventListener('touchstart', startLongPress, { passive: true });
        element.addEventListener('touchmove', moveHandler, { passive: true });
        element.addEventListener('touchend', endLongPress);
        element.addEventListener('touchcancel', endLongPress);

        // Mouse Events
        element.addEventListener('mousedown', startLongPress);
        element.addEventListener('mousemove', moveHandler);
        element.addEventListener('mouseup', endLongPress);
        element.addEventListener('mouseleave', endLongPress);

        // Context Menu Prevention
        if (userPreferences.preventDefaultContextMenu) {
            element.addEventListener('contextmenu', (e) => e.preventDefault());
        }

        element.setAttribute('data-longpress-initialized', 'true');
    }

    /* 9. INITIALIZATION AND SETUP */
    function setupGlobalEvents() {
        document.addEventListener('click', (e) => {
            const contextMenu = document.querySelector('.context-menu');
            if (contextMenu && !contextMenu.contains(e.target)) {
                removeContextMenu();
            }
        });

        document.addEventListener('scroll', () => {
            removeContextMenu();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                removeContextMenu();
            }
        });
    }

    /* 10. STORAGE FUNCTIONS */
    function loadAllData() {
        try {
            const savedPreferences = GM_getValue(STORAGE_KEYS.PREFERENCES);
            if (savedPreferences) {
                userPreferences = { ...defaultPreferences, ...JSON.parse(savedPreferences) };
            }
            
            const savedHiddenElements = GM_getValue(STORAGE_KEYS.HIDDEN_ELEMENTS);
            if (savedHiddenElements) {
                hiddenElements = JSON.parse(savedHiddenElements);
            }
            
            const savedBookmarks = GM_getValue(STORAGE_KEYS.BOOKMARKS);
            if (savedBookmarks) {
                globalBookmarks = JSON.parse(savedBookmarks);
            }
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }

    function saveAllData() {
        try {
            GM_setValue(STORAGE_KEYS.PREFERENCES, JSON.stringify(userPreferences));
            GM_setValue(STORAGE_KEYS.HIDDEN_ELEMENTS, JSON.stringify(hiddenElements));
            GM_setValue(STORAGE_KEYS.BOOKMARKS, JSON.stringify(globalBookmarks));
        } catch (e) {
            console.error('Error saving data:', e);
        }
    }

    /* 11. INITIALIZATION */
    function init() {
        loadAllData();
        setupGlobalEvents();
        
        const supportedElements = [
            'a', 'img', 'video',
            '[style*="background-image"]',
            '.product__sidebar__view__item',
            'div', 'span', 'p',
            'article', 'section',
            '.clickable',
            '[role="button"]',
            'button',
            'input[type="button"]',
            'input[type="submit"]',
            'iframe'
        ];
        
        supportedElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!el.hasAttribute('data-longpress-initialized')) {
                    setupLongPress(el);
                }
            });
        });

        // Apply hidden elements
        hiddenElements.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    el.style.display = 'none';
                });
            } catch (e) {
                console.error('Error applying hidden element:', e);
            }
        });

        // Auto save data every 5 minutes
        setInterval(saveAllData, 300000);
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on page unload
    window.addEventListener('unload', saveAllData);

})();