// ==UserScript==
// @name         Jellyfin 弹幕设置界面优化增强
// @namespace    https://github.com/guiyuanyuanbao/jellyfin-danmaku-beautify
// @version      1.0.0
// @description  优化 Jellyfin 弹幕设置界面：分组折叠布局、控制功能集成、样式美化、响应式设计，全面提升用户体验。
// @author       guiyuanyuanbao
// @license      MIT
// @match        *://*/*/web/index.html
// @match        *://*/web/index.html
// @match        *://*/*/web/
// @match        *://*/web/
// @run-at       document-idle
// @grant        none
// @supportURL   https://github.com/guiyuanyuanbao/jellyfin-danmaku-beautify/issues
// @homepageURL  https://github.com/guiyuanyuanbao/jellyfin-danmaku-beautify
// @downloadURL https://update.greasyfork.org/scripts/545506/Jellyfin%20%E5%BC%B9%E5%B9%95%E8%AE%BE%E7%BD%AE%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/545506/Jellyfin%20%E5%BC%B9%E5%B9%95%E8%AE%BE%E7%BD%AE%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 强制应用输入框样式的函数
    function forceApplyInputStyles() {
        const targetInputs = [
            '#danmakuFontFamily',
            '#danmakuOffsetTime', 
            '#danmakuFontOptions'
        ];
        
        targetInputs.forEach(selector => {
            const input = document.querySelector(selector);
            if (input) {
                console.log(`[Danmaku] 强制应用样式到: ${selector}`);
                // 先清除可能的border-image属性
                input.style.borderImage = '';
                input.style.borderImageSource = '';
                input.style.borderImageSlice = '';
                input.style.borderImageWidth = '';
                input.style.borderImageOutset = '';
                input.style.borderImageRepeat = '';
                
                input.style.cssText = `
                    background: linear-gradient(135deg, rgba(169, 91, 194, 0.08), rgba(0, 164, 219, 0.08)) !important;
                    border: 2px solid rgba(169, 91, 194, 0.4) !important;
                    border-radius: 12px !important;
                    padding: 10px 16px !important;
                    color: #fff !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    min-height: 40px !important;
                    height: 40px !important;
                    line-height: 1.4 !important;
                    backdrop-filter: blur(25px) !important;
                    max-width: 100% !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                    flex: 1 1 auto !important;
                    flex-grow: 1 !important;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                    box-shadow: 
                        0 2px 8px rgba(169, 91, 194, 0.15),
                        inset 0 1px 2px rgba(255, 255, 255, 0.1),
                        inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
                `;
                
                // 添加焦点事件
                input.addEventListener('focus', function() {
                    this.style.background = 'linear-gradient(135deg, rgba(169, 91, 194, 0.18), rgba(0, 164, 219, 0.18))';
                    this.style.borderColor = 'rgba(169, 91, 194, 0.8)';
                    this.style.boxShadow = '0 0 0 5px rgba(169, 91, 194, 0.2), 0 6px 25px rgba(169, 91, 194, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.05)';
                    this.style.transform = 'translateY(-1px) scale(1.01)';
                });
                
                // 添加失去焦点事件
                input.addEventListener('blur', function() {
                    this.style.background = 'linear-gradient(135deg, rgba(169, 91, 194, 0.08), rgba(0, 164, 219, 0.08))';
                    this.style.border = '2px solid rgba(169, 91, 194, 0.4)';
                    this.style.boxShadow = '0 2px 8px rgba(169, 91, 194, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.05)';
                    this.style.transform = 'translateY(0) scale(1)';
                });
            }
        });
        
        // 也处理通用的文本输入框
        const allTextInputs = document.querySelectorAll('input[type="text"], input[type="number"]');
        allTextInputs.forEach(input => {
            if (input.id && input.id.includes('danmaku')) {
                console.log(`[Danmaku] 强制应用样式到通用输入框: ${input.id}`);
                // 先清除可能的border-image属性
                input.style.borderImage = '';
                input.style.borderImageSource = '';
                input.style.borderImageSlice = '';
                input.style.borderImageWidth = '';
                input.style.borderImageOutset = '';
                input.style.borderImageRepeat = '';
                
                input.style.cssText = `
                    background: linear-gradient(135deg, rgba(169, 91, 194, 0.08), rgba(0, 164, 219, 0.08)) !important;
                    border: 2px solid rgba(169, 91, 194, 0.4) !important;
                    border-radius: 12px !important;
                    padding: 10px 16px !important;
                    color: #fff !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    min-height: 40px !important;
                    height: 40px !important;
                    line-height: 1.4 !important;
                    backdrop-filter: blur(25px) !important;
                    max-width: 100% !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                    flex: 1 1 auto !important;
                    flex-grow: 1 !important;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                    box-shadow: 
                        0 2px 8px rgba(169, 91, 194, 0.15),
                        inset 0 1px 2px rgba(255, 255, 255, 0.1),
                        inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
                `;
            }
        });
    }
    
    // 添加复选框颜色动态更新
    function updateCheckboxColors() {
        const checkboxes = document.querySelectorAll('.danmakuSidebar input[type="checkbox"], .danmakuSidebar input[type="radio"], #danmakuModal input[type="checkbox"], #danmakuModal input[type="radio"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    this.style.border = '2px solid rgba(169, 91, 194, 0.8)';
                } else {
                    this.style.border = '2px solid rgba(128, 128, 128, 0.4)';
                }
            });
        });
    }
    
    // 强制修复复选框和单选框的边框
    function fixCheckboxBorders() {
        const checkboxes = document.querySelectorAll('.danmakuSidebar input[type="checkbox"], .danmakuSidebar input[type="radio"], #danmakuModal input[type="checkbox"], #danmakuModal input[type="radio"]');
        checkboxes.forEach(checkbox => {
            // 清除border-image属性
            checkbox.style.borderImage = '';
            checkbox.style.borderImageSource = '';
            checkbox.style.borderImageSlice = '';
            checkbox.style.borderImageWidth = '';
            checkbox.style.borderImageOutset = '';
            checkbox.style.borderImageRepeat = '';
            
            // 确保边框样式正确，未选中状态使用灰色
            if (!checkbox.checked) {
                checkbox.style.border = '2px solid rgba(128, 128, 128, 0.4)';
            }
            checkbox.style.borderRadius = checkbox.type === 'radio' ? '50%' : '6px';
        });
    }
    
    // 定期检查并应用样式
    setInterval(() => {
        forceApplyInputStyles();
        fixCheckboxBorders();
        updateCheckboxColors();
    }, 1000);
    
    // 在DOM加载完成后立即应用一次
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            forceApplyInputStyles();
            fixCheckboxBorders();
            updateCheckboxColors();
        });
    } else {
        forceApplyInputStyles();
        fixCheckboxBorders();
        updateCheckboxColors();
    }

    // 监听DOM变化，检测弹幕设置对话框的创建
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    // 检查新添加的节点是否包含目标输入框
                    if (node.id === 'danmakuFontFamily' || node.id === 'danmakuOffsetTime' || node.id === 'danmakuFontOptions') {
                        console.log(`[Danmaku] 检测到新增输入框: ${node.id}`);
                        setTimeout(() => forceApplyInputStyles(), 100);
                    }
                    
                    // 检查子节点中是否有目标输入框
                    if (node.querySelector) {
                        const hasTargetInputs = node.querySelector('#danmakuFontFamily, #danmakuOffsetTime, #danmakuFontOptions');
                        if (hasTargetInputs) {
                            console.log('[Danmaku] 检测到包含目标输入框的容器');
                            setTimeout(() => forceApplyInputStyles(), 100);
                        }
                    }
                    
                    if (node.id === 'danmakuModal') {
                        // 阻止原始模态框显示并创建侧边栏
                        node.style.display = 'none';
                        createDanmakuSidebar(node);
                    }
                    // 检测播放器设置菜单的创建 - 更精确的选择器
                    if (node.classList && node.classList.contains('actionSheet') && 
                        node.querySelector('[data-id="aspectratio"]') &&
                        node.querySelector('[data-id="playbackrate"]')) {
                        addDanmakuSettingsToMenu(node);
                    }
                    // 也检查子节点，以防菜单是在容器内添加的
                    const actionSheet = node.querySelector && node.querySelector('.actionSheet');
                    if (actionSheet && 
                        actionSheet.querySelector('[data-id="aspectratio"]') &&
                        actionSheet.querySelector('[data-id="playbackrate"]')) {
                        addDanmakuSettingsToMenu(actionSheet);
                    }
                    // 检测并清理空白的dialogContainer
                    if (node.classList && node.classList.contains('dialogContainer') && 
                        !node.innerHTML.trim()) {
                        console.log('[Danmaku Settings] 发现空白dialogContainer，正在清理');
                        node.remove();
                    }
                }
            });
            
            // 检测移除的节点，如果是弹幕模态框被移除，清理残留容器
            mutation.removedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.id === 'danmakuModal') {
                    setTimeout(() => {
                        cleanupEmptyDialogContainers();
                    }, 100);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 清理空白的对话框容器
    function cleanupEmptyDialogContainers() {
        const emptyContainers = document.querySelectorAll('.dialogContainer');
        emptyContainers.forEach(container => {
            // 检查容器是否为空或只包含空白内容
            if (!container.innerHTML.trim() || 
                (!container.querySelector('.dialog') && !container.querySelector('.actionSheet'))) {
                console.log('[Danmaku Settings] 清理空白dialogContainer');
                container.remove();
            }
        });
        
        // 也清理可能残留的backdrop
        const emptyBackdrops = document.querySelectorAll('.dialogBackdrop');
        emptyBackdrops.forEach(backdrop => {
            if (!backdrop.nextElementSibling || 
                !backdrop.nextElementSibling.querySelector('.dialog, .actionSheet')) {
                console.log('[Danmaku Settings] 清理空白dialogBackdrop');
                backdrop.remove();
            }
        });
    }

    // 添加弹幕设置到播放器设置菜单
    function addDanmakuSettingsToMenu(actionSheet) {
        console.log('[Danmaku Settings] 检测到播放器设置菜单');
        
        // 为播放器设置菜单添加特殊标识类
        actionSheet.classList.add('video-player-settings-menu');
        
        const scroller = actionSheet.querySelector('.actionSheetScroller');
        if (!scroller || scroller.querySelector('[data-id="danmaku-settings"]')) {
            console.log('[Danmaku Settings] 菜单已存在或找不到滚动容器');
            return;
        }

        // 延迟执行，确保菜单完全加载
        setTimeout(() => {
            // 隐藏原始弹幕设置按钮
            const originalDanmakuSettings = document.querySelector('#danmakuSettings');
            if (originalDanmakuSettings) {
                originalDanmakuSettings.style.display = 'none';
            }

            // 创建弹幕设置菜单项
            const danmakuMenuItem = document.createElement('button');
            danmakuMenuItem.setAttribute('is', 'emby-button');
            danmakuMenuItem.setAttribute('type', 'button');
            danmakuMenuItem.className = 'listItem listItem-button actionSheetMenuItem emby-button';
            danmakuMenuItem.setAttribute('data-id', 'danmaku-settings');
            
            danmakuMenuItem.innerHTML = `
                <div class="listItemBody actionsheetListItemBody">
                    <div class="listItemBodyText actionSheetItemText">弹幕设置</div>
                </div>
            `;

            // 添加点击事件
            danmakuMenuItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('[Danmaku Settings] 弹幕设置菜单项被点击');
                
                if (originalDanmakuSettings) {
                    originalDanmakuSettings.click();
                }
                
                // 关闭设置菜单
                setTimeout(() => {
                    const backdrop = document.querySelector('.dialogBackdrop') || 
                                   document.querySelector('[data-history="true"]');
                    if (backdrop && backdrop.contains(actionSheet)) {
                        backdrop.click();
                    } else {
                        actionSheet.remove();
                    }
                }, 100);
            });

            // 将弹幕设置添加到循环模式之前，如果没有循环模式就添加到播放信息之前
            const repeatModeItem = scroller.querySelector('[data-id="repeatmode"]');
            const statsItem = scroller.querySelector('[data-id="stats"]');
            
            if (repeatModeItem) {
                scroller.insertBefore(danmakuMenuItem, repeatModeItem);
            } else if (statsItem) {
                scroller.insertBefore(danmakuMenuItem, statsItem);
            } else {
                scroller.appendChild(danmakuMenuItem);
            }

            console.log('[Danmaku Settings] 弹幕设置已添加到播放器设置菜单');
        }, 50);
    }

    // 创建弹幕设置侧边栏
    function createDanmakuSidebar(originalModal) {
        // 防止创建重复的侧边栏
        if (document.getElementById('danmakuSidebar')) {
            return;
        }

        const dialog = originalModal.querySelector('.dialog');
        if (!dialog) return;

        const sidebar = document.createElement('div');
        sidebar.id = 'danmakuSidebar';
        sidebar.className = 'danmakuSidebar';
        sidebar.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 450px;
            max-width: 90vw;
            height: 100vh;
            background: rgba(18, 18, 20, 0.95);
            backdrop-filter: blur(15px);
            z-index: 1000000;
            display: flex;
            flex-direction: column;
            box-shadow: -5px 0 25px rgba(0, 0, 0, 0.5);
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            overflow: hidden;
            box-sizing: border-box;
        `;

        // 创建头部
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            min-height: 60px;
        `;

        const titleEl = document.createElement('h2');
        titleEl.textContent = '弹幕设置';
        titleEl.style.cssText = `
            color: #fff;
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;

        // 创建右侧按钮组
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            gap: 10px;
            align-items: center;
        `;

        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.innerHTML = '保存';
        saveButton.title = '保存设置';
        saveButton.style.cssText = `
            background: linear-gradient(135deg, #a95bc2, #00a4db);
            border: none;
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            padding: 10px 20px;
            border-radius: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            min-width: 60px;
        `;
        saveButton.onclick = () => {
            // 触发原始保存按钮
            const originalSaveButton = originalModal.querySelector('.btnSave, [data-role="button"][data-theme="b"]:not(.btnCancel)');
            if (originalSaveButton) {
                originalSaveButton.click();
            }
            closeDanmakuSidebar();
        };
        
        saveButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
            this.style.boxShadow = '0 4px 12px rgba(169, 91, 194, 0.4)';
        });
        
        saveButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });

        // 取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.innerHTML = '取消';
        cancelButton.title = '取消设置';
        cancelButton.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            padding: 10px 20px;
            border-radius: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            min-width: 60px;
        `;
        cancelButton.onclick = () => {
            // 触发原始取消按钮
            const originalCancelButton = originalModal.querySelector('.btnCancel, [data-role="button"][data-theme="a"]');
            if (originalCancelButton) {
                originalCancelButton.click();
            }
            closeDanmakuSidebar();
        };
        
        cancelButton.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.15)';
            this.style.transform = 'translateY(-1px)';
            this.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.1)';
        });
        
        cancelButton.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });

        buttonsContainer.appendChild(saveButton);
        buttonsContainer.appendChild(cancelButton);

        header.appendChild(titleEl);
        header.appendChild(buttonsContainer);
        sidebar.appendChild(header);

        // 创建设置内容容器
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'danmaku-settings-container';
        settingsContainer.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
        `;
        sidebar.appendChild(settingsContainer);

        // 处理设置项
        setTimeout(() => {
            setupDanmakuSettings(originalModal, settingsContainer);
        }, 100);

        document.body.appendChild(sidebar);

        // 添加样式
        addDanmakuSidebarStyles();

        // ESC键关闭
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeDanmakuSidebar();
            }
        };
        document.addEventListener('keydown', handleEscape);
        sidebar._handleEscape = handleEscape;

        // 点击外部关闭
        const handleOutsideClick = (e) => {
            // 检查是否点击了控制功能相关的原始按钮
            const originalButtons = [
                '#displayDanmaku',
                '#displayLog', 
                '#searchDanmaku',
                '#addDanmakuSource'
            ];
            
            // 如果点击的是原始按钮，不关闭侧边栏
            for (const buttonSelector of originalButtons) {
                const button = document.querySelector(buttonSelector);
                if (button && (e.target === button || button.contains(e.target))) {
                    return;
                }
            }
            
            // 如果点击的是侧边栏外部，才关闭侧边栏
            if (sidebar && !sidebar.contains(e.target)) {
                closeDanmakuSidebar();
            }
        };

        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
            sidebar._handleOutsideClick = handleOutsideClick;
        }, 300);

        // 显示侧边栏
        setTimeout(() => {
            sidebar.style.transform = 'translateX(0)';
        }, 50);

        // 隐藏原始按钮
        hideOriginalButtons();
    }

    // 设置弹幕设置内容
    function setupDanmakuSettings(originalModal, container) {
        const dialog = originalModal.querySelector('.dialog');
        if (!dialog) return;

        // 查找设置项容器
        const settingsContainer = dialog.querySelector('div[style*="flex-direction: column"]');
        if (!settingsContainer) return;

        // 获取所有设置项
        const settingItems = Array.from(settingsContainer.children);
        
        // 按功能类型分类设置项
        const categories = {
            controls: [], // 控制功能
            display: [], // 显示相关
            style: [],   // 样式相关
            filter: [],  // 过滤相关
            source: [],  // 源相关
            info: []     // 信息相关
        };

        settingItems.forEach(item => {
            const label = item.querySelector('span, label');
            const labelText = label ? label.textContent.toLowerCase() : '';
            
            // 根据标签文本和ID进行分类
            if (item.querySelector('#lbAnimeTitle, #lbEpisodeTitle')) {
                categories.info.push(item);
            } else if (labelText.includes('透明度') || labelText.includes('速度') || labelText.includes('高度') || 
                      labelText.includes('字号') || labelText.includes('字体') || labelText.includes('opacity') || 
                      labelText.includes('speed') || labelText.includes('size') || labelText.includes('font')) {
                categories.style.push(item);
            } else if (labelText.includes('过滤') || labelText.includes('屏蔽') || labelText.includes('filter')) {
                categories.filter.push(item);
            } else if (labelText.includes('源') || labelText.includes('source') || labelText.includes('api')) {
                categories.source.push(item);
            } else {
                categories.display.push(item);
            }
        });

        // 创建控制功能卡片
        const controlItems = createControlFunctions(originalModal);
        if (controlItems && controlItems.length > 0) {
            categories.controls.push(...controlItems);
        }

        // 清空容器
        container.innerHTML = '';

        // 创建标签页结构
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'danmaku-tabs-container';
        tabsContainer.style.cssText = `
            display: flex;
            overflow-x: auto;
            padding: 16px 20px;
            background: rgba(0, 0, 0, 0.2);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            scrollbar-width: thin;
            scrollbar-color: rgba(169, 91, 194, 0.5) rgba(0, 0, 0, 0.1);
            margin: -16px -16px 20px -16px;
            backdrop-filter: blur(10px);
            gap: 4px;
        `;

        container.appendChild(tabsContainer);

        // 创建并添加标签
        const tabs = [
            { id: 'controls', title: '控制功能', items: categories.controls },
            { id: 'info', title: '视频信息', items: categories.info },
            { id: 'style', title: '显示样式', items: categories.style },
            { id: 'display', title: '显示设置', items: categories.display },
            { id: 'filter', title: '过滤设置', items: categories.filter },
            { id: 'source', title: '弹幕源', items: categories.source }
        ];

        // 过滤掉空分组
        const validTabs = tabs.filter(tab => tab.items.length > 0);
        
        // 设置默认活动标签
        let activeTabId = validTabs.length > 0 ? validTabs[0].id : null;

        // 添加标签按钮
        validTabs.forEach(tab => {
            const tabButton = document.createElement('button');
            tabButton.textContent = tab.title;
            tabButton.dataset.tabId = tab.id;
            tabButton.className = 'danmaku-tab-button';
            tabButton.style.cssText = `
                padding: 10px 18px;
                border: none;
                border-radius: 8px;
                background: ${tab.id === activeTabId ? 'linear-gradient(135deg, #a95bc2, #00a4db)' : 'rgba(255, 255, 255, 0.08)'};
                color: white;
                font-weight: ${tab.id === activeTabId ? '600' : '500'};
                font-size: 14px;
                cursor: pointer;
                white-space: nowrap;
                flex-shrink: 0;
                border: 1px solid ${tab.id === activeTabId ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
                backdrop-filter: blur(10px);
            `;

            tabButton.addEventListener('click', function() {
                // 更新所有标签样式
                document.querySelectorAll('.danmaku-tab-button').forEach(btn => {
                    btn.style.background = 'rgba(255, 255, 255, 0.08)';
                    btn.style.fontWeight = '500';
                    btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                });
                
                // 设置当前标签样式
                this.style.background = 'linear-gradient(135deg, #a95bc2, #00a4db)';
                this.style.fontWeight = '600';
                this.style.borderColor = 'transparent';
                
                // 显示对应标签的内容
                showTabContent(this.dataset.tabId);
            });

            tabsContainer.appendChild(tabButton);
        });

        // 显示指定标签内容的函数
        function showTabContent(tabId) {
            // 更新活动标签ID
            activeTabId = tabId;
            
            // 清空内容区域 - 只保留标签容器
            const children = Array.from(container.children);
            children.forEach(child => {
                if (child !== tabsContainer) {
                    child.remove();
                }
            });
            
            // 查找对应标签的项目
            const tab = validTabs.find(t => t.id === tabId);
            if (!tab) return;
            
            // 如果是控制功能标签，创建弹性布局容器
            if (tabId === 'controls') {
                const controlsContainer = document.createElement('div');
                controlsContainer.style.cssText = `
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px;
                    margin-bottom: 20px;
                    padding: 0;
                `;
                
                // 直接添加控制卡片到弹性容器
                tab.items.forEach(item => {
                    controlsContainer.appendChild(item);
                });
                
                container.appendChild(controlsContainer);
            } else {
                // 其他标签直接添加项目到container
                tab.items.forEach(item => {
                    // 设置每个项目的样式
                    styleSettingItemForContent(item);
                    container.appendChild(item);
                });
            }
        }

        // 如果有有效标签，显示第一个标签的内容
        if (activeTabId) {
            showTabContent(activeTabId);
        }
    }

    // 为内容区域的设置项添加样式
    function styleSettingItemForContent(item) {
        // 检查是否是控制功能卡片，如果是则跳过样式处理
        if (item.classList && item.classList.contains('control-card')) {
            return;
        }
        
        item.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            margin-bottom: 12px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            min-height: 56px;
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        `;

        // 添加悬停效果
        item.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, rgba(169, 91, 194, 0.08), rgba(0, 164, 219, 0.08))';
            this.style.borderColor = 'rgba(169, 91, 194, 0.25)';
            this.style.transform = 'translateY(-1px)';
            this.style.boxShadow = '0 4px 16px rgba(169, 91, 194, 0.12)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))';
            this.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });

        // 调整标签和输入控件布局
        const label = item.querySelector('span, label');
        const input = item.querySelector('input, div:last-child');

        if (label && input) {
            label.style.cssText = `
                font-size: 14px;
                font-weight: 500;
                color: #fff;
                flex: 0 0 auto;
                margin-right: 20px;
                min-width: 120px;
                text-align: left;
                line-height: 1.4;
            `;

            if (input.tagName === 'INPUT') {
                input.style.flex = '1';
                
                if (input.type === 'range') {
                    input.style.cssText += `
                        max-width: 200px;
                        height: 6px;
                        border-radius: 3px;
                        background: linear-gradient(135deg, #a95bc2, #00a4db);
                        outline: none;
                        -webkit-appearance: none;
                        appearance: none;
                    `;
                } else if (input.type === 'text' || input.type === 'number') {
                    input.style.cssText += `
                        min-width: 180px;
                        max-width: 100%;
                        width: 100%;
                        padding: 10px 16px;
                        border-radius: 12px;
                        border: 2px solid rgba(169, 91, 194, 0.4);
                        background: linear-gradient(135deg, rgba(169, 91, 194, 0.08), rgba(0, 164, 219, 0.08));
                        color: #fff;
                        font-size: 14px;
                        font-weight: 500;
                        min-height: 40px;
                        line-height: 1.6;
                        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        backdrop-filter: blur(25px);
                        box-sizing: border-box;
                        box-shadow: 
                            0 2px 8px rgba(169, 91, 194, 0.15),
                            inset 0 1px 2px rgba(255, 255, 255, 0.1),
                            inset 0 -1px 1px rgba(0, 0, 0, 0.05);
                    `;
                    
                    // 添加焦点和悬停效果
                    input.addEventListener('focus', function() {
                        this.style.background = 'linear-gradient(135deg, rgba(169, 91, 194, 0.18), rgba(0, 164, 219, 0.18))';
                        this.style.borderColor = 'rgba(169, 91, 194, 0.8)';
                        this.style.boxShadow = '0 0 0 5px rgba(169, 91, 194, 0.2), 0 6px 25px rgba(169, 91, 194, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.05)';
                        this.style.transform = 'translateY(-1px) scale(1.01)';
                    });
                    
                    input.addEventListener('blur', function() {
                        this.style.background = 'linear-gradient(135deg, rgba(169, 91, 194, 0.08), rgba(0, 164, 219, 0.08))';
                        this.style.border = '2px solid rgba(169, 91, 194, 0.4)';
                        this.style.boxShadow = '0 2px 8px rgba(169, 91, 194, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.05)';
                        this.style.transform = 'translateY(0) scale(1)';
                    });
                    
                    input.addEventListener('mouseenter', function() {
                        if (document.activeElement !== this) {
                            this.style.background = 'linear-gradient(135deg, rgba(169, 91, 194, 0.12), rgba(0, 164, 219, 0.12))';
                            this.style.border = '2px solid rgba(169, 91, 194, 0.6)';
                            this.style.boxShadow = '0 4px 15px rgba(169, 91, 194, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.15), inset 0 -1px 1px rgba(0, 0, 0, 0.05)';
                            this.style.transform = 'translateY(-1px) scale(1.01)';
                        }
                    });
                    
                    input.addEventListener('mouseleave', function() {
                        if (document.activeElement !== this) {
                            this.style.background = 'linear-gradient(135deg, rgba(128, 128, 128, 0.08), rgba(160, 160, 160, 0.08))';
                            this.style.border = '2px solid rgba(128, 128, 128, 0.4)';
                            this.style.boxShadow = '0 2px 8px rgba(128, 128, 128, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.05)';
                            this.style.transform = 'translateY(0) scale(1)';
                        }
                    });
                } else if (input.type === 'checkbox' || input.type === 'radio') {
                    input.style.cssText += `
                        width: 18px;
                        height: 18px;
                        cursor: pointer;
                        position: relative;
                        -webkit-appearance: none;
                        appearance: none;
                        background: linear-gradient(135deg, rgba(128, 128, 128, 0.08), rgba(160, 160, 160, 0.08));
                        border: 2px solid rgba(128, 128, 128, 0.4);
                        border-radius: ${input.type === 'radio' ? '50%' : '6px'};
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        backdrop-filter: blur(25px);
                        box-shadow: 
                            0 2px 8px rgba(169, 91, 194, 0.15),
                            inset 0 1px 2px rgba(255, 255, 255, 0.1),
                            inset 0 -1px 1px rgba(0, 0, 0, 0.05);
                    `;
                    
                    // 添加选中状态的伪元素效果
                    const updateCheckboxStyle = () => {
                        if (input.checked) {
                            input.style.background = 'linear-gradient(135deg, #a95bc2, #00a4db)';
                            input.style.border = '2px solid rgba(169, 91, 194, 0.8)';
                            input.style.boxShadow = '0 2px 12px rgba(169, 91, 194, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.05)';
                        } else {
                            input.style.background = 'linear-gradient(135deg, rgba(128, 128, 128, 0.08), rgba(160, 160, 160, 0.08))';
                            input.style.border = '2px solid rgba(128, 128, 128, 0.4)';
                            input.style.boxShadow = '0 2px 8px rgba(128, 128, 128, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.05)';
                        }
                    };
                    
                    input.addEventListener('change', updateCheckboxStyle);
                    input.addEventListener('mouseenter', function() {
                        if (!this.checked) {
                            this.style.border = '2px solid rgba(169, 91, 194, 0.6)';
                            this.style.background = 'rgba(255, 255, 255, 0.15)';
                        }
                    });
                    
                    input.addEventListener('mouseleave', function() {
                        if (!this.checked) {
                            this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                            this.style.background = 'rgba(255, 255, 255, 0.1)';
                        }
                    });
                    
                    // 初始化样式
                    updateCheckboxStyle();
                }
            } else {
                input.style.flex = '1';
            }
        }

        // 处理复选框组 - 改为横向占满布局
        const checkboxGroup = item.querySelectorAll('input[type="checkbox"], input[type="radio"]');
        if (checkboxGroup.length > 1) {
            item.style.flexDirection = 'column';
            item.style.alignItems = 'flex-start';
            item.style.padding = '20px';
            
            const container = item.querySelector('div:last-child') || item;
            container.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 8px;
                width: 100%;
                max-width: 100%;
                margin-top: 20px;
                box-sizing: border-box;
            `;

            checkboxGroup.forEach(checkbox => {
                const parent = checkbox.parentElement;
                if (parent) {
                    parent.style.cssText = `
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;
                        max-width: 100%;
                        padding: 16px 20px;
                        margin-bottom: 8px;
                        border-radius: 12px;
                        background: linear-gradient(135deg, rgba(169, 91, 194, 0.06), rgba(0, 164, 219, 0.06));
                        font-size: 14px;
                        font-weight: 500;
                        color: rgba(255, 255, 255, 0.95);
                        border: 2px solid rgba(169, 91, 194, 0.4);
                        cursor: pointer;
                        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        min-height: 44px;
                        backdrop-filter: blur(25px);
                        position: relative;
                        overflow: hidden;
                        box-sizing: border-box;
                        box-shadow: 
                            0 2px 8px rgba(169, 91, 194, 0.1),
                            inset 0 1px 2px rgba(255, 255, 255, 0.08),
                            inset 0 -1px 1px rgba(0, 0, 0, 0.03);
                    `;
                    
                    checkbox.style.cssText = `
                        margin-right: 0;
                        margin-left: 0;
                        order: 1;
                        width: 22px;
                        height: 22px;
                        cursor: pointer;
                        position: relative;
                        -webkit-appearance: none;
                        appearance: none;
                        background: linear-gradient(135deg, rgba(128, 128, 128, 0.08), rgba(160, 160, 160, 0.08));
                        border: 2px solid rgba(128, 128, 128, 0.4);
                        border-radius: ${checkbox.type === 'radio' ? '50%' : '6px'};
                        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        backdrop-filter: blur(25px);
                        flex-shrink: 0;
                        box-shadow: 
                            0 2px 8px rgba(169, 91, 194, 0.15),
                            inset 0 1px 2px rgba(255, 255, 255, 0.1),
                            inset 0 -1px 1px rgba(0, 0, 0, 0.05);
                    `;
                    
                    // 获取标签文本并设置右对齐
                    const labelText = parent.childNodes;
                    labelText.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                            const span = document.createElement('span');
                            span.textContent = node.textContent.trim();
                            span.style.cssText = `
                                flex: 1;
                                text-align: right;
                                order: 2;
                                margin-right: 12px;
                                line-height: 1.4;
                                word-wrap: break-word;
                                overflow: hidden;
                                max-width: calc(100% - 40px);
                                box-sizing: border-box;
                            `;
                            parent.replaceChild(span, node);
                        }
                    });
                    
                    // 创建勾选标记或圆点
                    let indicator = null;
                    if (checkbox.type === 'checkbox') {
                        indicator = document.createElement('div');
                        indicator.className = 'check-mark';
                        indicator.style.cssText = `
                            position: absolute;
                            left: 5px;
                            top: 1px;
                            width: 6px;
                            height: 10px;
                            border: solid white;
                            border-width: 0 2px 2px 0;
                            transform: rotate(45deg) scale(0);
                            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                            opacity: 0;
                        `;
                        checkbox.appendChild(indicator);
                    } else if (checkbox.type === 'radio') {
                        indicator = document.createElement('div');
                        indicator.className = 'radio-dot';
                        indicator.style.cssText = `
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            width: 8px;
                            height: 8px;
                            background: white;
                            border-radius: 50%;
                            transform: translate(-50%, -50%) scale(0);
                            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                            opacity: 0;
                        `;
                        checkbox.appendChild(indicator);
                    }
                    
                    // 添加选中状态样式
                    const updateStyle = () => {
                        const indicator = checkbox.querySelector('.check-mark, .radio-dot');
                        
                        if (checkbox.checked) {
                            checkbox.style.background = 'linear-gradient(135deg, #a95bc2, #00a4db)';
                            checkbox.style.border = '2px solid rgba(169, 91, 194, 0.8)';
                            checkbox.style.boxShadow = '0 2px 12px rgba(169, 91, 194, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.05)';
                            checkbox.style.transform = 'scale(1.05)';
                            parent.style.background = 'linear-gradient(135deg, rgba(169, 91, 194, 0.15), rgba(0, 164, 219, 0.15))';
                            parent.style.border = '2px solid rgba(169, 91, 194, 0.6)';
                            parent.style.boxShadow = '0 2px 12px rgba(169, 91, 194, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.15), inset 0 -1px 1px rgba(0, 0, 0, 0.05)';
                            
                            // 显示指示器
                            if (indicator) {
                                indicator.style.transform = checkbox.type === 'radio' ? 'translate(-50%, -50%) scale(1)' : 'rotate(45deg) scale(1)';
                                indicator.style.opacity = '1';
                            }
                        } else {
                            checkbox.style.background = 'linear-gradient(135deg, rgba(128, 128, 128, 0.08), rgba(160, 160, 160, 0.08))';
                            checkbox.style.border = '2px solid rgba(128, 128, 128, 0.4)';
                            checkbox.style.boxShadow = '0 2px 8px rgba(128, 128, 128, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.05)';
                            checkbox.style.transform = 'scale(1)';
                            parent.style.background = 'linear-gradient(135deg, rgba(128, 128, 128, 0.06), rgba(160, 160, 160, 0.06))';
                            parent.style.border = '2px solid rgba(128, 128, 128, 0.2)';
                            parent.style.boxShadow = '0 2px 8px rgba(128, 128, 128, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.08), inset 0 -1px 1px rgba(0, 0, 0, 0.03)';
                            
                            // 隐藏指示器
                            if (indicator) {
                                indicator.style.transform = checkbox.type === 'radio' ? 'translate(-50%, -50%) scale(0)' : 'rotate(45deg) scale(0)';
                                indicator.style.opacity = '0';
                            }
                        }
                    };
                    
                    checkbox.addEventListener('change', updateStyle);
                    
                    parent.addEventListener('mouseenter', function() {
                        if (!checkbox.checked) {
                            this.style.background = 'linear-gradient(135deg, rgba(169, 91, 194, 0.08), rgba(0, 164, 219, 0.08))';
                            this.style.border = '2px solid rgba(169, 91, 194, 0.4)';
                            this.style.transform = 'translateY(-1px)';
                            this.style.boxShadow = '0 4px 12px rgba(169, 91, 194, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.15)';
                            checkbox.style.border = '2px solid rgba(169, 91, 194, 0.6)';
                            checkbox.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(169, 91, 194, 0.1))';
                            checkbox.style.transform = 'scale(1.1)';
                        } else {
                            this.style.background = 'linear-gradient(135deg, rgba(169, 91, 194, 0.2), rgba(0, 164, 219, 0.2))';
                            this.style.border = '2px solid rgba(169, 91, 194, 0.45)';
                            this.style.transform = 'translateY(-1px)';
                            this.style.boxShadow = '0 4px 16px rgba(169, 91, 194, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)';
                            checkbox.style.transform = 'scale(1.15)';
                        }
                    });
                    
                    parent.addEventListener('mouseleave', function() {
                        this.style.transform = 'translateY(0)';
                        updateStyle();
                    });
                    
                    // 初始化样式
                    updateStyle();
                    
                    parent.addEventListener('click', function(e) {
                        // 阻止事件冒泡和默认行为
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // 如果点击的不是复选框本身，则触发复选框点击
                        if (e.target !== checkbox) {
                            checkbox.click();
                        }
                    });
                    
                    // 确保复选框本身的点击事件不会被阻止
                    checkbox.addEventListener('click', function(e) {
                        e.stopPropagation();
                    });
                }
            });
        }
    }

    // 创建控制功能区域
    function createControlFunctions(originalModal) {
        const controlItems = [];

        const danmukuButton = document.querySelector('#displayDanmaku');
        const logButton = document.querySelector('#displayLog');
        const searchButton = document.querySelector('#searchDanmaku');
        const addSourceButton = document.querySelector('#addDanmakuSource');

        // 添加弹幕开关控制项
        if (danmukuButton) {
            // 检查当前弹幕显示状态 - 通过图标判断
            const danmukuIcon = danmukuButton.querySelector('.material-icons');
            let isDanmukuEnabled = true; // 默认认为是开启的
            
            if (danmukuIcon) {
                // 如果图标是comments_disabled，则弹幕是关闭的
                isDanmukuEnabled = !danmukuIcon.classList.contains('comments_disabled');
            }
            
            const danmakuSwitchItem = document.createElement('div');
            danmakuSwitchItem.className = 'control-item control-card';
            danmakuSwitchItem.style.cssText = `
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.15);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                min-height: 64px;
                flex: 1 1 calc(50% - 8px);
                min-width: 280px;
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            `;

            danmakuSwitchItem.innerHTML = `
                <div class="control-info" style="display: flex; align-items: center; flex: 1;">
                    <div class="control-text">
                        <div style="font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 2px;">弹幕显示</div>
                        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">控制弹幕的显示与隐藏</div>
                    </div>
                </div>
                <label class="modern-switch">
                    <input type="checkbox" ${isDanmukuEnabled ? 'checked' : ''}>
                    <span class="modern-slider"></span>
                </label>
            `;
            
            // 添加hover效果
            danmakuSwitchItem.addEventListener('mouseenter', function() {
                this.style.background = 'linear-gradient(135deg, rgba(169, 91, 194, 0.12), rgba(0, 164, 219, 0.12))';
                this.style.border = '2px solid rgba(169, 91, 194, 0.4)';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(169, 91, 194, 0.15)';
            });
            
            danmakuSwitchItem.addEventListener('mouseleave', function() {
                this.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))';
                this.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            });
            
            const checkbox = danmakuSwitchItem.querySelector('input[type="checkbox"]');
            let isUpdating = false;
            
            checkbox.addEventListener('change', function(e) {
                e.stopPropagation();
                if (isUpdating) return;
                isUpdating = true;
                
                // 点击弹幕开关按钮
                danmukuButton.click();
                
                setTimeout(() => {
                    // 检查弹幕图标状态以更新复选框
                    const currentIcon = danmukuButton.querySelector('.material-icons');
                    if (currentIcon) {
                        const isEnabled = !currentIcon.classList.contains('comments_disabled');;
                        checkbox.checked = isEnabled;
                    }
                    isUpdating = false;
                }, 200);
            });
            
            // 监听弹幕图标状态变化
            if (danmukuIcon) {
                const iconObserver = new MutationObserver((mutations) => {
                    if (isUpdating) return;
                    
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'characterData' || 
                            mutation.type === 'childList' ||
                            (mutation.type === 'attributes' && 
                             (mutation.attributeName === 'class' || 
                              mutation.attributeName === 'textContent'))) {
                            
                            const currentIcon = danmukuButton.querySelector('.material-icons');
                            if (currentIcon) {
                                const isEnabled = currentIcon.textContent.trim() !== 'comments_disabled';
                                if (checkbox.checked !== isEnabled) {
                                    checkbox.checked = isEnabled;
                                }
                            }
                        }
                    });
                });
                
                // 观察图标元素的变化
                iconObserver.observe(danmukuIcon, { 
                    characterData: true,
                    childList: true,
                    attributes: true,
                    subtree: true
                });
                
                // 观察整个按钮的变化
                iconObserver.observe(danmukuButton, {
                    childList: true,
                    attributes: true,
                    subtree: true
                });
            }
            
            controlItems.push(danmakuSwitchItem);
        }
        
        // 添加日志开关控制项
        if (logButton) {
            const debugInfo = document.querySelector('#debugInfo');
            let isLogEnabled = false;
            
            if (debugInfo) {
                const displayStyle = window.getComputedStyle(debugInfo).display;
                isLogEnabled = displayStyle !== 'none';
            }
            
            const logSwitchItem = document.createElement('div');
            logSwitchItem.className = 'control-item control-card';
            logSwitchItem.style.cssText = `
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.15);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                min-height: 64px;
                flex: 1 1 calc(50% - 8px);
                min-width: 280px;
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            `;
            
            logSwitchItem.innerHTML = `
                <div class="control-info" style="display: flex; align-items: center; flex: 1;">
                    <div class="control-text">
                        <div style="font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 2px;">日志显示</div>
                        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">显示调试信息和日志</div>
                    </div>
                </div>
                <label class="modern-switch">
                    <input type="checkbox" ${isLogEnabled ? 'checked' : ''}>
                    <span class="modern-slider"></span>
                </label>
            `;
            
            // 添加hover效果
            logSwitchItem.addEventListener('mouseenter', function() {
                this.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.12), rgba(33, 150, 243, 0.12))';
                this.style.borderColor = 'rgba(76, 175, 80, 0.4)';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.15)';
            });
            
            logSwitchItem.addEventListener('mouseleave', function() {
                this.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))';
                this.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            });
            
            const checkbox = logSwitchItem.querySelector('input[type="checkbox"]');
            let isUpdating = false;
            
            checkbox.addEventListener('change', function(e) {
                e.stopPropagation();
                if (isUpdating) return;
                isUpdating = true;
                logButton.click();
                
                setTimeout(() => {
                    const currentDebugInfo = document.querySelector('#debugInfo');
                    if (currentDebugInfo) {
                        const currentDisplayStyle = window.getComputedStyle(currentDebugInfo).display;
                        const newLogEnabled = currentDisplayStyle !== 'none';
                        checkbox.checked = newLogEnabled;
                    }
                    isUpdating = false;
                }, 200);
            });
            
            // 监听状态变化
            if (debugInfo) {
                const logStatusObserver = new MutationObserver((mutations) => {
                    if (isUpdating) return;
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                            const currentDebugInfo = document.querySelector('#debugInfo');
                            if (currentDebugInfo) {
                                const currentDisplayStyle = window.getComputedStyle(currentDebugInfo).display;
                                const currentLogEnabled = currentDisplayStyle !== 'none';
                                if (checkbox.checked !== currentLogEnabled) {
                                    checkbox.checked = currentLogEnabled;
                                }
                            }
                        }
                    });
                });
                
                logStatusObserver.observe(debugInfo, { 
                    attributes: true,
                    attributeFilter: ['style']
                });
            }
            
            controlItems.push(logSwitchItem);
        }

        // 添加搜索弹幕控制项
        if (searchButton) {
            const searchItem = document.createElement('div');
            searchItem.className = 'control-item control-card';
            searchItem.style.cssText = `
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.15);
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                min-height: 64px;
                flex: 1 1 calc(50% - 8px);
                min-width: 280px;
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            `;
            
            searchItem.innerHTML = `
                <div class="control-info" style="display: flex; align-items: center; flex: 1;">
                    <div class="control-text">
                        <div style="font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 2px;">弹幕搜索</div>
                        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">搜索视频弹幕</div>
                    </div>
                </div>
                <div class="control-action" style="
                    padding: 6px 12px;
                    background: rgba(0, 188, 212, 0.15);
                    border-radius: 6px;
                    color: #00BCD4;
                    font-size: 12px;
                    font-weight: 500;
                    border: 1px solid rgba(0, 188, 212, 0.25);
                ">搜索</div>
            `;
            
            searchItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                searchButton.click();
            });
            
            searchItem.addEventListener('mouseenter', function() {
                this.style.background = 'linear-gradient(135deg, rgba(0, 188, 212, 0.12), rgba(0, 229, 255, 0.12))';
                this.style.borderColor = 'rgba(0, 188, 212, 0.4)';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(0, 188, 212, 0.15)';
            });
            
            searchItem.addEventListener('mouseleave', function() {
                this.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))';
                this.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            });
            
            controlItems.push(searchItem);
        }

        // 添加增加弹幕源控制项
        if (addSourceButton) {
            const addSourceItem = document.createElement('div');
            addSourceItem.className = 'control-item control-card';
            addSourceItem.style.cssText = `
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.15);
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                min-height: 64px;
                flex: 1 1 calc(50% - 8px);
                min-width: 280px;
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            `;
            
            addSourceItem.innerHTML = `
                <div class="control-info" style="display: flex; align-items: center; flex: 1;">
                    <div class="control-text">
                        <div style="font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 2px;">增加弹幕源</div>
                        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">添加新的弹幕数据源，如B站播放链接</div>
                    </div>
                </div>
                <div class="control-action" style="
                    padding: 6px 12px;
                    background: rgba(255, 152, 0, 0.15);
                    border-radius: 6px;
                    color: #FF9800;
                    font-size: 12px;
                    font-weight: 500;
                    border: 1px solid rgba(255, 152, 0, 0.25);
                ">添加</div>
            `;
            
            addSourceItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                addSourceButton.click();
            });
            
            addSourceItem.addEventListener('mouseenter', function() {
                this.style.background = 'linear-gradient(135deg, rgba(255, 152, 0, 0.12), rgba(255, 193, 7, 0.12))';
                this.style.borderColor = 'rgba(255, 152, 0, 0.4)';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(255, 152, 0, 0.15)';
            });
            
            addSourceItem.addEventListener('mouseleave', function() {
                this.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))';
                this.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            });
            
            controlItems.push(addSourceItem);
        }
        
        return controlItems.length > 0 ? controlItems : null;
    }

    // 关闭弹幕侧边栏
    function closeDanmakuSidebar() {
        const sidebar = document.getElementById('danmakuSidebar');
        if (!sidebar) return;

        sidebar.style.transform = 'translateX(100%)';

        if (sidebar._handleEscape) {
            document.removeEventListener('keydown', sidebar._handleEscape);
        }

        if (sidebar._handleOutsideClick) {
            document.removeEventListener('click', sidebar._handleOutsideClick);
        }

        setTimeout(() => {
            sidebar.parentNode?.removeChild(sidebar);
            // 清理原始模态框
            const originalModal = document.getElementById('danmakuModal');
            if (originalModal) {
                originalModal.remove();
            }
            cleanupEmptyDialogContainers();
        }, 300);
    }

    // 隐藏原始按钮
    function hideOriginalButtons() {
        setTimeout(() => {
            const originalLogButton = document.querySelector('#displayLog');
            const searchButton = document.querySelector('#searchDanmaku');
            const addSourceButton = document.querySelector('#addDanmakuSource');
            const danmakuSettingsButton = document.querySelector('#danmakuSettings');
            
            [originalLogButton, searchButton, addSourceButton, danmakuSettingsButton].forEach(btn => {
                if (btn) btn.style.display = 'none';
            });
        }, 100);
    }

    // 添加侧边栏样式
    function addDanmakuSidebarStyles() {
        if (document.getElementById('danmakuSidebarStyles')) return;

        const style = document.createElement('style');
        style.id = 'danmakuSidebarStyles';
        style.textContent = `
            /* 全局复选框和单选框容器约束 */
            .danmakuSidebar label,
            .danmakuSidebar .checkbox-container,
            .danmakuSidebar .radio-container,
            #danmakuModal label,
            #danmakuModal .checkbox-container,
            #danmakuModal .radio-container {
                max-width: 100% !important;
                box-sizing: border-box !important;
                overflow: hidden !important;
                word-wrap: break-word !important;
            }

            /* 复选框组容器约束 */
            .danmakuSidebar div[style*="flex-direction: column"],
            #danmakuModal div[style*="flex-direction: column"] {
                max-width: 100% !important;
                box-sizing: border-box !important;
                overflow: hidden !important;
            }

            /* 现代化动画效果 */
            @keyframes checkbox-scale {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(0.95);
                }
                100% {
                    transform: scale(1.05);
                }
            }

            @keyframes input-focus-pulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(169, 91, 194, 0.4);
                }
                70% {
                    box-shadow: 0 0 0 8px rgba(169, 91, 194, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(169, 91, 194, 0);
                }
            }

            /* 滚动条美化 */
            .danmakuSidebar .danmaku-settings-container::-webkit-scrollbar {
                width: 6px;
            }

            .danmakuSidebar .danmaku-settings-container::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 3px;
            }

            .danmakuSidebar .danmaku-settings-container::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #a95bc2, #00a4db);
                border-radius: 3px;
            }

            .danmakuSidebar .danmaku-settings-container::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #b766d1, #0bb4f0);
            }

            .danmakuSidebar button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(169, 91, 194, 0.3);
                background: linear-gradient(135deg, #b766d1, #0bb4f0);
            }

            .danmakuSidebar button:active {
                transform: translateY(0);
                box-shadow: 0 2px 8px rgba(169, 91, 194, 0.4);
                animation: checkbox-scale 0.2s ease-out;
            }

            /* 增强的标签按钮样式 */
            .danmaku-tab-button {
                position: relative;
            }

            /* 控制卡片增强效果 */
            .control-card {
                position: relative;
                overflow: hidden;
            }

            .control-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(169, 91, 194, 0.05), rgba(0, 164, 219, 0.05));
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }

            .control-card:hover::before {
                opacity: 1;
            }

            /* 标签容器滚动条样式 */
            .danmaku-tabs-container::-webkit-scrollbar {
                height: 4px;
            }

            .danmaku-tabs-container::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 2px;
            }

            .danmaku-tabs-container::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #a95bc2, #00a4db);
                border-radius: 2px;
            }

            /* 标签按钮样式优化 */
            .danmaku-tab-button {
                font-size: 14px;
                font-weight: 500;
                letter-spacing: 0.3px;
            }

            /* 现代化的输入范围滑块样式 */
            .danmakuSidebar input[type="range"] {
                -webkit-appearance: none;
                appearance: none;
                height: 6px;
                border-radius: 3px;
                outline: none;
                background: linear-gradient(135deg, #a95bc2, #00a4db);
                cursor: pointer;
            }

            .danmakuSidebar input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: linear-gradient(135deg, #a95bc2, #00a4db);
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(169, 91, 194, 0.3);
                transition: all 0.3s ease;
            }

            .danmakuSidebar input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 3px 8px rgba(169, 91, 194, 0.5);
            }

            .danmakuSidebar input[type="range"]::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: linear-gradient(135deg, #a95bc2, #00a4db);
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 6px rgba(169, 91, 194, 0.3);
            }

            /* 现代化选择框样式 - 增强版 */
            .danmakuSidebar select,
            #danmakuModal select {
                background: linear-gradient(135deg, rgba(169, 91, 194, 0.08), rgba(0, 164, 219, 0.08)) !important;
                border: 2px solid rgba(169, 91, 194, 0.4) !important;
                border-radius: 12px !important;
                padding: 10px 16px !important;
                color: #fff !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                backdrop-filter: blur(25px) !important;
                min-height: 40px !important;
                cursor: pointer !important;
                -webkit-appearance: none !important;
                appearance: none !important;
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(169,91,194,0.8)' viewBox='0 0 16 16'%3e%3cpath d='m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z'/%3e%3c/svg%3e") !important;
                background-repeat: no-repeat !important;
                background-position: right 16px center !important;
                background-size: 14px !important;
                padding-right: 50px !important;
                width: 100% !important;
                max-width: 100% !important;
                min-width: 180px !important;
                box-sizing: border-box !important;
                box-shadow: 
                    0 2px 8px rgba(169, 91, 194, 0.15),
                    inset 0 1px 2px rgba(255, 255, 255, 0.1),
                    inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
            }

            .danmakuSidebar select:focus,
            #danmakuModal select:focus {
                background: linear-gradient(135deg, rgba(169, 91, 194, 0.18), rgba(0, 164, 219, 0.18)) !important;
                border-color: rgba(169, 91, 194, 0.8) !important;
                box-shadow: 
                    0 0 0 5px rgba(169, 91, 194, 0.2),
                    0 6px 25px rgba(169, 91, 194, 0.35),
                    inset 0 1px 2px rgba(255, 255, 255, 0.2),
                    inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
                outline: none !important;
                transform: translateY(-1px) scale(1.01) !important;
                animation: input-focus-pulse 1.5s ease-out !important;
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(169,91,194,1)' viewBox='0 0 16 16'%3e%3cpath d='m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z'/%3e%3c/svg%3e") !important;
            }

            .danmakuSidebar select:hover:not(:focus),
            #danmakuModal select:hover:not(:focus) {
                background: linear-gradient(135deg, rgba(169, 91, 194, 0.12), rgba(0, 164, 219, 0.12)) !important;
                border: 2px solid rgba(169, 91, 194, 0.6) !important;
                box-shadow: 
                    0 4px 15px rgba(169, 91, 194, 0.2),
                    inset 0 1px 2px rgba(255, 255, 255, 0.15),
                    inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
                transform: translateY(-1px) scale(1.01) !important;
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(169,91,194,0.9)' viewBox='0 0 16 16'%3e%3cpath d='m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z'/%3e%3c/svg%3e") !important;
            }

            .danmakuSidebar select option,
            #danmakuModal select option {
                background: rgba(40, 40, 40, 0.95) !important;
                color: #fff !important;
                padding: 8px 12px !important;
                border: none !important;
            }

            .danmakuSidebar select option:hover,
            #danmakuModal select option:hover {
                background: rgba(169, 91, 194, 0.3) !important;
            }

            /* 输入框验证状态样式 */
            .danmakuSidebar input[type="text"].valid,
            .danmakuSidebar input[type="number"].valid,
            #danmakuModal input[type="text"].valid,
            #danmakuModal input[type="number"].valid {
                border-color: rgba(76, 175, 80, 0.7) !important;
                box-shadow: 
                    0 0 0 2px rgba(76, 175, 80, 0.2),
                    0 2px 8px rgba(76, 175, 80, 0.15) !important;
            }

            .danmakuSidebar input[type="text"].invalid,
            .danmakuSidebar input[type="number"].invalid,
            #danmakuModal input[type="text"].invalid,
            #danmakuModal input[type="number"].invalid {
                border-color: rgba(244, 67, 54, 0.7) !important;
                box-shadow: 
                    0 0 0 2px rgba(244, 67, 54, 0.2),
                    0 2px 8px rgba(244, 67, 54, 0.15) !important;
                animation: shake 0.3s ease-in-out !important;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            /* 加载状态效果 */
            .loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(2px);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 12px;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .loading-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .loading-spinner {
                width: 24px;
                height: 24px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid #fff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* 工具提示样式 */
            .tooltip {
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 10000;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s ease;
                pointer-events: none;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .tooltip.show {
                opacity: 1;
                transform: translateY(0);
            }

            .tooltip::before {
                content: '';
                position: absolute;
                top: -5px;
                left: 50%;
                transform: translateX(-50%);
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-bottom: 5px solid rgba(0, 0, 0, 0.9);
            }

            /* 现代化输入框样式 - 增强版 */
            .danmakuSidebar input[type="text"],
            .danmakuSidebar input[type="number"] {
                background: linear-gradient(135deg, rgba(169, 91, 194, 0.08), rgba(0, 164, 219, 0.08));
                border: 2px solid rgba(169, 91, 194, 0.4);
                border-radius: 12px;
                padding: 10px 16px;
                color: #fff;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                backdrop-filter: blur(25px);
                box-shadow: 
                    0 2px 8px rgba(169, 91, 194, 0.15),
                    inset 0 1px 2px rgba(255, 255, 255, 0.1),
                    inset 0 -1px 1px rgba(0, 0, 0, 0.05);
                position: relative;
                min-height: 40px;
                height: 40px;
                line-height: 1.4;
                max-width: 100%;
                width: 100%;
                box-sizing: border-box;
                min-width: 120px;
            }

            .danmakuSidebar input[type="text"]:focus,
            .danmakuSidebar input[type="number"]:focus {
                background: linear-gradient(135deg, rgba(169, 91, 194, 0.18), rgba(0, 164, 219, 0.18));
                border-color: rgba(169, 91, 194, 0.8);
                box-shadow: 
                    0 0 0 5px rgba(169, 91, 194, 0.2),
                    0 6px 25px rgba(169, 91, 194, 0.35),
                    inset 0 1px 2px rgba(255, 255, 255, 0.2),
                    inset 0 -1px 1px rgba(0, 0, 0, 0.05);
                outline: none;
                transform: translateY(-1px) scale(1.01);
                animation: input-focus-pulse 1.5s ease-out;
            }

            .danmakuSidebar input[type="text"]:hover:not(:focus),
            .danmakuSidebar input[type="number"]:hover:not(:focus) {
                background: linear-gradient(135deg, rgba(169, 91, 194, 0.12), rgba(0, 164, 219, 0.12));
                border: 2px solid rgba(169, 91, 194, 0.6);
                box-shadow: 
                    0 4px 15px rgba(169, 91, 194, 0.2),
                    inset 0 1px 2px rgba(255, 255, 255, 0.15),
                    inset 0 -1px 1px rgba(0, 0, 0, 0.05);
                transform: translateY(-0.5px) scale(1.005);
            }

            .danmakuSidebar input[type="text"]::placeholder,
            .danmakuSidebar input[type="number"]::placeholder {
                color: rgba(255, 255, 255, 0.5);
                font-weight: 400;
                transition: color 0.3s ease;
            }

            .danmakuSidebar input[type="text"]:focus::placeholder,
            .danmakuSidebar input[type="number"]:focus::placeholder {
                color: rgba(255, 255, 255, 0.7);
            }

            /* 响应式设计 */
            @media (max-width: 600px) {
                .danmakuSidebar {
                    width: 95% !important;
                    max-width: none !important;
                }
                
                .danmaku-tab-button {
                    padding: 8px 12px !important;
                    font-size: 13px !important;
                }
                
                .control-card {
                    flex: 1 1 100% !important;
                    min-width: 100% !important;
                }
            }

            @media (max-width: 400px) {
                .control-card .control-info {
                    flex-direction: column;
                    align-items: flex-start;
                    text-align: left;
                }
                
                .control-card .control-icon {
                    margin-bottom: 8px;
                    margin-right: 0 !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function modifyDanmakuModal(modal) {
        // 不再修改原始模态框，因为我们使用侧边栏替代
        // 原始模态框会被隐藏，侧边栏会在 createDanmakuSidebar 中创建
    }

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        /* 强制约束复选框和单选框容器宽度 */
        .danmakuSidebar *,
        #danmakuModal * {
            box-sizing: border-box !important;
        }
        
        .danmakuSidebar label,
        .danmakuSidebar input[type="checkbox"]:parent,
        .danmakuSidebar input[type="radio"]:parent,
        #danmakuModal label,
        #danmakuModal input[type="checkbox"]:parent,
        #danmakuModal input[type="radio"]:parent {
            max-width: 100% !important;
            overflow: hidden !important;
            word-wrap: break-word !important;
            text-overflow: ellipsis !important;
        }

        /* 弹幕设置对话框分组样式 */
        #danmakuModal .dialog {
            max-height: 85vh;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(169, 91, 194, 0.5) rgba(255, 255, 255, 0.1);
        }

        #danmakuModal .dialog::-webkit-scrollbar {
            width: 6px;
        }

        #danmakuModal .dialog::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
        }

        #danmakuModal .dialog::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #a95bc2, #00a4db);
            border-radius: 3px;
        }

        /* 对话框标题样式 */
        #danmakuModal .dialog h1,
        #danmakuModal .dialog h2,
        #danmakuModal .dialog h3 {
            color: #fff;
            font-weight: 600;
            margin-bottom: 15px;
            text-align: center;
            font-size: 18px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        /* 隐藏原始位置的按钮 */
        #displayLog,
        #searchDanmaku,
        #addDanmakuSource,
        #danmakuSettings,
        #sendDanmaku {
            display: none !important;
        }

        /* 调整播放器设置菜单位置 - 距离底部5%屏幕高度，位于右侧 - 仅在视频播放界面生效 */
        .actionSheet.centeredDialog:has([data-id="aspectratio"]):has([data-id="playbackrate"]),
        .actionSheet.centeredDialog.video-player-settings-menu {
            position: fixed !important;
            bottom: 5vh !important;
            top: auto !important;
            /* right: 20px !important; */
            /* left: auto !important; */
            transform: none !important;
            margin: 0 !important;
        }

        .actionSheet.centeredDialog:has([data-id="aspectratio"]):has([data-id="playbackrate"])[style*="top:"],
        .actionSheet.centeredDialog:has([data-id="aspectratio"]):has([data-id="playbackrate"])[style*="left:"],
        .actionSheet.centeredDialog.video-player-settings-menu[style*="top:"],
        .actionSheet.centeredDialog.video-player-settings-menu[style*="left:"] {
            bottom: 5vh !important;
            top: auto !important;
            /* right: 20px !important; */
            /* left: auto !important; */
            transform: none !important;
        }

        /* 播放器设置菜单优化 - 仅在视频播放界面生效 */
        .actionSheet:has([data-id="aspectratio"]):has([data-id="playbackrate"]) .actionSheetContent,
        .actionSheet.video-player-settings-menu .actionSheetContent {
            max-height: 40vh !important;
            overflow-y: auto !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
            min-width: 180px !important;
        }

        /* 播放器设置菜单中的弹幕设置项样式 */
        [data-id="danmaku-settings"] {
            transition: all 0.3s ease !important;
        }

        [data-id="danmaku-settings"]:hover {
            background: rgba(169, 91, 194, 0.1) !important;
        }

        [data-id="danmaku-settings"] .actionSheetItemText {
            color: inherit !important;
        }

        /* 控制按钮容器 */
        .control-buttons-container {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            flex-wrap: wrap !important;
        }

        /* 对话框中的控制按钮样式 */
        .dialog-control-button {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 6px !important;
            padding: 8px 12px !important;
            min-width: 40px !important;
            height: 36px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        }

        .dialog-control-button:hover {
            background: rgba(255, 255, 255, 0.2) !important;
            border: 1px solid rgba(169, 91, 194, 0.5) !important;
            box-shadow: 0 0 8px rgba(169, 91, 194, 0.3) !important;
        }

        .dialog-control-button .material-icons {
            color: #fff !important;
            font-size: 20px !important;
        }

        /* 自定义复选框和单选框样式 */
        .danmakuSidebar input[type="checkbox"],
        .danmakuSidebar input[type="radio"] {
            -webkit-appearance: none !important;
            appearance: none !important;
            background: linear-gradient(135deg, rgba(128, 128, 128, 0.08), rgba(160, 160, 160, 0.08)) !important;
            border: 2px solid rgba(128, 128, 128, 0.4) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            cursor: pointer !important;
            position: relative !important;
            backdrop-filter: blur(25px) !important;
            box-shadow: 
                0 2px 8px rgba(128, 128, 128, 0.15),
                inset 0 1px 2px rgba(255, 255, 255, 0.1),
                inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
        }

        .danmakuSidebar input[type="checkbox"] {
            border-radius: 6px !important;
            width: 20px !important;
            height: 20px !important;
        }

        .danmakuSidebar input[type="radio"] {
            border-radius: 50% !important;
            width: 20px !important;
            height: 20px !important;
        }

        .danmakuSidebar input[type="checkbox"]:checked,
        .danmakuSidebar input[type="radio"]:checked {
            background: linear-gradient(135deg, #a95bc2, #00a4db) !important;
            border-color: rgba(169, 91, 194, 0.8) !important;
            box-shadow: 0 2px 12px rgba(169, 91, 194, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
        }

        .danmakuSidebar input[type="checkbox"]:checked::after {
            content: "✓" !important;
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            color: white !important;
            font-size: 12px !important;
            font-weight: bold !important;
        }

        .danmakuSidebar input[type="radio"]:checked::after {
            content: "" !important;
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 8px !important;
            height: 8px !important;
            background: white !important;
            border-radius: 50% !important;
        }

        .danmakuSidebar input[type="checkbox"]:hover:not(:checked),
        .danmakuSidebar input[type="radio"]:hover:not(:checked) {
            border: 2px solid rgba(169, 91, 194, 0.6) !important;
            background: linear-gradient(135deg, rgba(169, 91, 194, 0.12), rgba(0, 164, 219, 0.12)) !important;
            box-shadow: 0 4px 15px rgba(169, 91, 194, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.12), inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
        }

        /* 现代化开关样式 */
        .modern-switch {
            position: relative !important;
            display: inline-block !important;
            width: 44px !important;
            height: 24px !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            border: none !important;
            cursor: pointer !important;
        }

        .modern-switch input {
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            position: absolute !important;
            margin: 0 !important;
        }

        .modern-slider {
            position: absolute !important;
            cursor: pointer !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(255, 255, 255, 0.2) !important;
            border-radius: 24px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            width: 44px !important;
            height: 24px !important;
        }

        .modern-slider:before {
            position: absolute !important;
            content: "" !important;
            height: 18px !important;
            width: 18px !important;
            left: 2px !important;
            bottom: 2px !important;
            background: white !important;
            border-radius: 50% !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2) !important;
        }

        .modern-switch input:checked + .modern-slider {
            background: linear-gradient(135deg, #a95bc2, #00a4db) !important;
            border-color: transparent !important;
        }

        .modern-switch input:checked + .modern-slider:before {
            transform: translateX(20px) !important;
            box-shadow: 0 1px 4px rgba(169, 91, 194, 0.3) !important;
        }

        .modern-slider:hover {
            box-shadow: 0 0 8px rgba(169, 91, 194, 0.2) !important;
        }

        .modern-switch input:checked + .modern-slider:hover {
            box-shadow: 0 0 8px rgba(169, 91, 194, 0.4) !important;
        }

        /* 控制卡片样式 */
        .control-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .control-card:hover {
            transform: translateY(-2px) !important;
        }

        /* 苹果风格开关样式 */
        .log-switch-container {
            display: flex !important;
            align-items: center;
            margin-left: 15px;
        }

        .log-switch-label {
            margin-right: 10px;
            font-size: 14px;
            color: #fff;
        }

        .apple-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 28px;
        }

        .apple-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .apple-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #ccc;
            border-radius: 28px;
            transition: all 0.3s ease;
        }

        .apple-slider:before {
            position: absolute;
            content: "";
            height: 22px;
            width: 22px;
            left: 3px;
            bottom: 3px;
            background: white;
            border-radius: 50%;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .apple-switch input:checked + .apple-slider {
            background: linear-gradient(130deg, #a95bc2, #00a4db);
        }

        .apple-switch input:checked + .apple-slider:before {
            transform: translateX(22px);
        }

        .apple-slider:hover {
            box-shadow: 0 0 8px rgba(169, 91, 194, 0.3);
        }

        .apple-switch input:checked + .apple-slider:hover {
            box-shadow: 0 0 8px rgba(169, 91, 194, 0.5);
        }

        /* 输入范围滑块简洁样式 */
        #danmakuModal input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            height: 4px;
            border-radius: 2px;
            outline: none;
            background: linear-gradient(130deg, #a95bc2, #00a4db) !important;
        }

        #danmakuModal input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: linear-gradient(130deg, #a95bc2, #00a4db);
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        #danmakuModal input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: linear-gradient(130deg, #a95bc2, #00a4db);
            cursor: pointer;
            border: none;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        #danmakuModal input[type="range"]::-moz-range-track {
            background: linear-gradient(130deg, #a95bc2, #00a4db) !important;
            height: 4px;
            border-radius: 2px;
        }

        /* 现代化弹幕输入框样式 - 增强版 */
        #danmakuFontFamily,
        #danmakuOffsetTime,
        #danmakuFontOptions,
        #danmakuModal #danmakuOffsetTime,
        #danmakuModal #danmakuFontFamily,
        #danmakuModal #danmakuFontOptions,
        #danmakuModal input[type="text"],
        #danmakuModal input[type="number"] {
            background: linear-gradient(135deg, rgba(169, 91, 194, 0.08), rgba(0, 164, 219, 0.08)) !important;
            border: 2px solid rgba(169, 91, 194, 0.4) !important;
            border-radius: 12px !important;
            padding: 10px 16px !important;
            color: #fff !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
            backdrop-filter: blur(25px) !important;
            min-width: 120px !important;
            max-width: 100% !important;
            width: 100% !important;
            box-sizing: border-box !important;
            flex: 1 1 auto !important;
            flex-grow: 1 !important;
            min-height: 40px !important;
            height: 40px !important;
            line-height: 1.4 !important;
            box-shadow: 
                0 2px 8px rgba(169, 91, 194, 0.15),
                inset 0 1px 2px rgba(255, 255, 255, 0.1),
                inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
        }

        #danmakuFontFamily:focus,
        #danmakuOffsetTime:focus,
        #danmakuFontOptions:focus,
        #danmakuModal #danmakuOffsetTime:focus,
        #danmakuModal #danmakuFontFamily:focus,
        #danmakuModal #danmakuFontOptions:focus,
        #danmakuModal input[type="text"]:focus,
        #danmakuModal input[type="number"]:focus {
            background: linear-gradient(135deg, rgba(169, 91, 194, 0.18), rgba(0, 164, 219, 0.18)) !important;
            border-color: rgba(169, 91, 194, 0.8) !important;
            box-shadow: 
                0 0 0 5px rgba(169, 91, 194, 0.2),
                0 6px 25px rgba(169, 91, 194, 0.35),
                inset 0 1px 2px rgba(255, 255, 255, 0.2),
                inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
            outline: none !important;
            transform: translateY(-1px) scale(1.01) !important;
            animation: input-focus-pulse 1.5s ease-out !important;
        }

        #danmakuFontFamily:hover:not(:focus),
        #danmakuOffsetTime:hover:not(:focus),
        #danmakuFontOptions:hover:not(:focus),
        #danmakuModal #danmakuOffsetTime:hover:not(:focus),
        #danmakuModal #danmakuFontFamily:hover:not(:focus),
        #danmakuModal #danmakuFontOptions:hover:not(:focus),
        #danmakuModal input[type="text"]:hover:not(:focus),
        #danmakuModal input[type="number"]:hover:not(:focus) {
            background: linear-gradient(135deg, rgba(169, 91, 194, 0.12), rgba(0, 164, 219, 0.12)) !important;
            border: 2px solid rgba(169, 91, 194, 0.6) !important;
            box-shadow: 
                0 4px 15px rgba(169, 91, 194, 0.2),
                inset 0 1px 2px rgba(255, 255, 255, 0.15),
                inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
            transform: translateY(-0.5px) scale(1.005) !important;
        }

        #danmakuFontFamily::placeholder,
        #danmakuOffsetTime::placeholder,
        #danmakuFontOptions::placeholder,
        #danmakuModal #danmakuOffsetTime::placeholder,
        #danmakuModal #danmakuFontFamily::placeholder,
        #danmakuModal #danmakuFontOptions::placeholder,
        #danmakuModal input[type="text"]::placeholder,
        #danmakuModal input[type="number"]::placeholder {
            color: rgba(255, 255, 255, 0.5) !important;
            font-weight: 400 !important;
            transition: color 0.3s ease !important;
        }

        #danmakuFontFamily:focus::placeholder,
        #danmakuOffsetTime:focus::placeholder,
        #danmakuFontOptions:focus::placeholder,
        #danmakuModal #danmakuOffsetTime:focus::placeholder,
        #danmakuModal #danmakuFontFamily:focus::placeholder,
        #danmakuModal #danmakuFontOptions:focus::placeholder,
        #danmakuModal input[type="text"]:focus::placeholder,
        #danmakuModal input[type="number"]:focus::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
        }

        /* 响应式设计优化 */
        @media (max-width: 900px) {
            #danmakuModal .dialog {
                width: 95% !important;
                min-width: unset !important;
            }
            
            #danmakuModal div[style*="grid-template-columns"] {
                grid-template-columns: 1fr !important;
                gap: 15px !important;
            }
        }

        @media (max-width: 600px) {
            #danmakuModal .dialog {
                padding: 10px !important;
            }
            
            .control-buttons-container {
                flex-direction: column !important;
                align-items: stretch !important;
            }
        }

        /* 横屏手机优化 */
        @media screen and (max-height: 600px) and (orientation: landscape) {
            #danmakuModal .dialog {
                width: 98% !important;
                max-width: none !important;
                height: 95vh !important;
                padding: 8px !important;
            }
            
            #danmakuModal div[style*="grid-template-columns"] {
                grid-template-columns: 1fr 1fr 1fr !important;
                gap: 8px 20px !important;
            }
        }

        /* 分组标题折叠样式 */
        .group-title:hover {
            background: linear-gradient(90deg, rgba(169, 91, 194, 0.25), rgba(0, 164, 219, 0.25)) !important;
        }

        .group-title[data-collapsed="true"] {
            background: linear-gradient(90deg, rgba(169, 91, 194, 0.15), rgba(0, 164, 219, 0.15)) !important;
        }

        /* 控制项样式 */
        .control-item,
        .control-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .control-item:hover,
        .control-card:hover {
            transform: translateY(-2px) !important;
        }

        /* 按钮hover效果 */
        #danmakuModal button,
        #danmakuModal [data-role="button"] {
            transition: all 0.3s ease !important;
        }

        #danmakuModal button:hover,
        #danmakuModal [data-role="button"]:hover {
            background: linear-gradient(135deg, rgba(169, 91, 194, 0.2), rgba(0, 164, 219, 0.2)) !important;
            border: 2px solid rgba(169, 91, 194, 0.5) !important;
            box-shadow: 0 4px 12px rgba(169, 91, 194, 0.3) !important;
            transform: translateY(-1px) !important;
        }

        /* 复选框横向排列样式优化 - 复选框左对齐，标签右对齐 */
        #danmakuModal input[type="checkbox"] + label,
        #danmakuModal input[type="radio"] + label {
            margin-left: auto !important;
            margin-right: 0 !important;
            margin-bottom: 0 !important;
            text-align: right !important;
        }

        /* Modal中的复选框和单选框样式统一 */
        #danmakuModal input[type="checkbox"],
        #danmakuModal input[type="radio"] {
            -webkit-appearance: none !important;
            appearance: none !important;
            background: linear-gradient(135deg, rgba(128, 128, 128, 0.08), rgba(160, 160, 160, 0.08)) !important;
            border: 2px solid rgba(128, 128, 128, 0.4) !important;
            border-radius: 6px !important;
            width: 18px !important;
            height: 18px !important;
            cursor: pointer !important;
            position: relative !important;
            backdrop-filter: blur(25px) !important;
            margin-right: auto !important;
            margin-left: 0 !important;
            flex-shrink: 0 !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 
                0 2px 8px rgba(128, 128, 128, 0.15),
                inset 0 1px 2px rgba(255, 255, 255, 0.1),
                inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
        }

        #danmakuModal input[type="radio"] {
            border-radius: 50% !important;
        }

        #danmakuModal input[type="checkbox"]:checked,
        #danmakuModal input[type="radio"]:checked {
            background: linear-gradient(135deg, #a95bc2, #00a4db) !important;
            border: 2px solid rgba(169, 91, 194, 0.8) !important;
            box-shadow: 0 2px 12px rgba(169, 91, 194, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
        }

        #danmakuModal input[type="checkbox"]:hover:not(:checked),
        #danmakuModal input[type="radio"]:hover:not(:checked) {
            border: 2px solid rgba(169, 91, 194, 0.6) !important;
            background: linear-gradient(135deg, rgba(169, 91, 194, 0.12), rgba(0, 164, 219, 0.12)) !important;
            box-shadow: 0 4px 15px rgba(169, 91, 194, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.12), inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
        }

        /* 复选框容器左对齐 */
        #danmakuModal div[style*="justify-content: flex-end"] {
            justify-content: flex-start !important;
        }

        /* 复选框父元素内部布局 */
        #danmakuModal input[type="checkbox"]:parent,
        #danmakuModal input[type="radio"]:parent {
            justify-content: space-between !important;
        }

        /* 确保复选框和标签在父容器中正确对齐 */
        #danmakuModal label:has(input[type="checkbox"]),
        #danmakuModal label:has(input[type="radio"]) {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
        }

        /* 强制样式覆盖 - 确保所有danmaku相关输入框都使用新样式 */
        input#danmakuFontFamily,
        input#danmakuOffsetTime,
        input#danmakuFontOptions,
        [id*="danmaku"] input[type="text"],
        [id*="danmaku"] input[type="number"] {
            background: linear-gradient(135deg, rgba(169, 91, 194, 0.08), rgba(0, 164, 219, 0.08)) !important;
            border: 2px solid rgba(169, 91, 194, 0.3) !important;
            border-radius: 12px !important;
            padding: 10px 16px !important;
            color: #fff !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            min-height: 40px !important;
            line-height: 1.6 !important;
            backdrop-filter: blur(25px) !important;
            box-sizing: border-box !important;
            max-width: 100% !important;
            box-shadow: 
                0 2px 8px rgba(169, 91, 194, 0.15),
                inset 0 1px 2px rgba(255, 255, 255, 0.1),
                inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
        }

        input#danmakuFontFamily:focus,
        input#danmakuOffsetTime:focus,
        input#danmakuFontOptions:focus {
            background: linear-gradient(135deg, rgba(169, 91, 194, 0.18), rgba(0, 164, 219, 0.18)) !important;
            border-color: rgba(169, 91, 194, 0.8) !important;
            box-shadow: 
                0 0 0 5px rgba(169, 91, 194, 0.2),
                0 6px 25px rgba(169, 91, 194, 0.35),
                inset 0 1px 2px rgba(255, 255, 255, 0.2),
                inset 0 -1px 1px rgba(0, 0, 0, 0.05) !important;
            outline: none !important;
            transform: translateY(-1px) scale(1.01) !important;
        }

        /* 复选框标签文本右对齐 */
        #danmakuModal label span,
        #danmakuModal label:not(:has(input)) {
            text-align: right !important;
            margin-left: auto !important;
        }

        /* 响应式设计 - 控制功能弹性布局 */
        @media (max-width: 900px) {
            .control-card {
                flex: 1 1 calc(50% - 12px) !important;
                min-width: 260px !important;
            }
        }

        @media (max-width: 600px) {
            .control-card {
                flex: 1 1 100% !important;
                min-width: 100% !important;
            }
            
            /* 弹幕设置对话框移动端适配 */
            #danmakuModal .dialogContainer {
                width: 95% !important;
                margin: 20px auto !important;
                max-height: calc(100vh - 40px) !important;
            }
            
            /* 设置项在移动端堆叠布局 */
            .setting-row {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 8px !important;
            }
            
            .setting-row label {
                min-width: auto !important;
                margin-right: 0 !important;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('[Danmaku Settings] 弹幕设置界面侧边栏脚本已加载');
})();