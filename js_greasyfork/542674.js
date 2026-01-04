// ==UserScript==
// @name         大阪世博会 EXPO 2025 空位预定助手 ｜ 隐藏不可用场馆、自动加载更多、过滤特定场馆
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  自动隐藏EXPO 2025搜索结果列表中不可预定的场馆
// @author       You
// @match        https://ticket.expo2025.or.jp/*
// @match        https://www.expo2025.or.jp/*
// @match        https://expo2025.or.jp/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542674/%E5%A4%A7%E9%98%AA%E4%B8%96%E5%8D%9A%E4%BC%9A%20EXPO%202025%20%E7%A9%BA%E4%BD%8D%E9%A2%84%E5%AE%9A%E5%8A%A9%E6%89%8B%20%EF%BD%9C%20%E9%9A%90%E8%97%8F%E4%B8%8D%E5%8F%AF%E7%94%A8%E5%9C%BA%E9%A6%86%E3%80%81%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A%E3%80%81%E8%BF%87%E6%BB%A4%E7%89%B9%E5%AE%9A%E5%9C%BA%E9%A6%86.user.js
// @updateURL https://update.greasyfork.org/scripts/542674/%E5%A4%A7%E9%98%AA%E4%B8%96%E5%8D%9A%E4%BC%9A%20EXPO%202025%20%E7%A9%BA%E4%BD%8D%E9%A2%84%E5%AE%9A%E5%8A%A9%E6%89%8B%20%EF%BD%9C%20%E9%9A%90%E8%97%8F%E4%B8%8D%E5%8F%AF%E7%94%A8%E5%9C%BA%E9%A6%86%E3%80%81%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A%E3%80%81%E8%BF%87%E6%BB%A4%E7%89%B9%E5%AE%9A%E5%9C%BA%E9%A6%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let debugMode = true; // 调试模式，默认开启以便诊断问题
    let filterMode = 'hide-unavailable'; // 过滤模式: 'hide-unavailable', 'show-all', 'only-available', 'only-unavailable'
    let autoLoadMore = true; // 是否自动加载更多
    let selectedVenues = new Set(); // 选中的场馆名称
    let venueNameFilter = false; // 是否启用场馆名称过滤
    
    function log(...args) {
        if (debugMode) {
            console.log('[EXPO隐藏脚本]', ...args);
        }
    }

    // 获取场馆状态类型
    function getVenueStatus(element) {
        const icon = element.querySelector('img[src*="calendar"]');
        if (icon) {
            const src = icon.getAttribute('src');
            if (src && src.includes('calendar_none.svg')) {
                return 'unavailable';
            }
            if (src && src.includes('calendar_few.svg')) {
                return 'crowded';
            }
            if (src && src.includes('calendar_ok.svg')) {
                return 'available';
            }
        }
        return 'unknown';
    }

    // 检测元素是否为不可预定的场馆
    function isUnavailableVenue(element) {
        return getVenueStatus(element) === 'unavailable';
    }
    
    // 获取场馆名称
    function getVenueName(element) {
        const titleElement = element.querySelector('.style_search_item_title__aePLg');
        return titleElement ? titleElement.textContent.trim() : '';
    }
    
    // 提取所有场馆名称
    function getAllVenueNames() {
        const venueNames = new Set();
        const elements = document.querySelectorAll('div.style_search_item_row__moqWC');
        
        elements.forEach(element => {
            const button = element.querySelector('button[class*="search_item"]');
            const icon = element.querySelector('img[src*="calendar"]');
            
            if (button && icon && !element.querySelector('.style_more_btn__ymb22')) {
                const name = getVenueName(element);
                if (name) {
                    // 清理场馆名称，去掉时间和特殊说明
                    let cleanName = name.replace(/[\d:：～〜-]+\d+:\d+/g, '') // 去掉时间
                                      .replace(/\s*～.*$/, '') // 去掉～后面的内容
                                      .replace(/\s*\(.*?\)/g, '') // 去掉括号内容
                                      .replace(/\s*【.*?】/g, '') // 去掉【】内容
                                      .replace(/\s*※.*$/, '') // 去掉※后面的内容
                                      .replace(/\s*\*.*$/, '') // 去掉*后面的内容
                                      .replace(/\s+/g, ' ') // 合并多个空格
                                      .trim();
                    
                    if (cleanName) {
                        venueNames.add(cleanName);
                    }
                }
            }
        });
        
        return Array.from(venueNames).sort();
    }
    
    // 应用过滤模式
    function applyFilter() {
        const elements = document.querySelectorAll('div.style_search_item_row__moqWC');
        let stats = { available: 0, crowded: 0, unavailable: 0, total: 0, shown: 0, hidden: 0 };
        
        log('开始应用过滤，找到元素数量:', elements.length);
        
        elements.forEach(element => {
            // 确保是场馆行，必须包含按钮和图标
            const button = element.querySelector('button[class*="search_item"]');
            const icon = element.querySelector('img[src*="calendar"]');
            
            if (!button || !icon) {
                log('跳过非场馆元素（无按钮或图标）:', element);
                return;
            }
            
            // 跳过"查看更多"按钮的容器
            if (element.querySelector('.style_more_btn__ymb22')) {
                log('跳过"查看更多"按钮容器');
                return;
            }
            
            const status = getVenueStatus(element);
            stats.total++;
            
            // 统计各状态数量
            if (status === 'available') stats.available++;
            else if (status === 'crowded') stats.crowded++;
            else if (status === 'unavailable') stats.unavailable++;
            
            let shouldShow = false;
            
            // 首先按状态过滤
            switch (filterMode) {
                case 'show-all':
                    shouldShow = true;
                    break;
                case 'hide-unavailable':
                    shouldShow = status !== 'unavailable';
                    break;
                case 'only-available':
                    shouldShow = status === 'available';
                    break;
                case 'only-crowded':
                    shouldShow = status === 'crowded';
                    break;
                case 'only-unavailable':
                    shouldShow = status === 'unavailable';
                    break;
            }
            
            // 然后按场馆名称过滤
            if (shouldShow && venueNameFilter && selectedVenues.size > 0) {
                const venueName = getVenueName(element);
                const cleanName = venueName.replace(/[\d:：～〜-]+\d+:\d+/g, '')
                                          .replace(/\s*～.*$/, '')
                                          .replace(/\s*\(.*?\)/g, '')
                                          .replace(/\s*【.*?】/g, '')
                                          .replace(/\s*※.*$/, '')
                                          .replace(/\s*\*.*$/, '')
                                          .replace(/\s+/g, ' ')
                                          .trim();
                
                shouldShow = selectedVenues.has(cleanName);
            }
            
            element.style.display = shouldShow ? '' : 'none';
            
            if (shouldShow) {
                stats.shown++;
            } else {
                stats.hidden++;
            }
        });
        
        log(`过滤统计 - 总计: ${stats.total}, 空闲: ${stats.available}, 拥挤: ${stats.crowded}, 已满: ${stats.unavailable}, 显示: ${stats.shown}, 隐藏: ${stats.hidden}`);
        return stats;
    }
    
    // 自动点击"查看更多"按钮
    function autoClickLoadMore() {
        if (!autoLoadMore) return;
        
        const loadMoreBtn = document.querySelector('.style_more_btn__ymb22');
        if (loadMoreBtn && loadMoreBtn.offsetParent !== null) {
            log('自动点击"查看更多"按钮');
            loadMoreBtn.click();
            
            // 等待新内容加载后重新应用过滤
            setTimeout(() => {
                applyFilter();
                // 更新场馆列表（如果启用了场馆过滤）
                if (venueNameFilter && window.controlPanelInstance) {
                    window.controlPanelInstance.updateVenueList();
                }
                // 继续查找是否还有更多
                setTimeout(autoClickLoadMore, 1000);
            }, 1500);
        } else {
            log('没有找到"查看更多"按钮或已全部加载');
        }
    }
    
    // 创建控制面板
    function createControlPanel() {
        // 创建容器
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: white;
            border: 2px solid #ddd;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            min-width: 250px;
        `;
        
        // 标题
        const title = document.createElement('h3');
        title.textContent = 'EXPO 场馆过滤器';
        title.style.cssText = `
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #333;
            text-align: center;
        `;
        
        // 统计信息
        const statsDiv = document.createElement('div');
        statsDiv.style.cssText = `
            margin-bottom: 10px;
            padding: 5px;
            background: #f5f5f5;
            border-radius: 5px;
            font-size: 12px;
            text-align: center;
        `;
        
        // 状态过滤模式选择
        const filterLabel = document.createElement('label');
        filterLabel.textContent = '状态过滤：';
        filterLabel.style.cssText = `
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            font-weight: bold;
        `;
        
        const filterSelect = document.createElement('select');
        filterSelect.style.cssText = `
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 3px;
        `;
        
        const filterOptions = [
            { value: 'show-all', text: '显示全部' },
            { value: 'hide-unavailable', text: '隐藏已满场馆' },
            { value: 'only-available', text: '只显示空闲场馆 🟢' },
            { value: 'only-crowded', text: '只显示拥挤场馆 🟡' },
            { value: 'only-unavailable', text: '只显示已满场馆 🔴' }
        ];
        
        filterOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            if (option.value === filterMode) opt.selected = true;
            filterSelect.appendChild(opt);
        });
        
        filterSelect.addEventListener('change', () => {
            filterMode = filterSelect.value;
            const stats = applyFilter();
            updateStats(stats);
            log('切换过滤模式到:', filterMode);
        });
        
        // 场馆名称过滤
        const venueFilterLabel = document.createElement('label');
        venueFilterLabel.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            cursor: pointer;
        `;
        
        const venueFilterCheckbox = document.createElement('input');
        venueFilterCheckbox.type = 'checkbox';
        venueFilterCheckbox.checked = venueNameFilter;
        venueFilterCheckbox.style.marginRight = '5px';
        
        const venueFilterText = document.createElement('span');
        venueFilterText.textContent = '按场馆名称过滤';
        venueFilterText.style.fontSize = '12px';
        
        venueFilterLabel.appendChild(venueFilterCheckbox);
        venueFilterLabel.appendChild(venueFilterText);
        
        // 场馆选择区域
        const venueSelectDiv = document.createElement('div');
        venueSelectDiv.style.cssText = `
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 5px;
            margin-bottom: 10px;
            background: #f9f9f9;
            display: ${venueNameFilter ? 'block' : 'none'};
        `;
        
        // 全选/取消全选按钮
        const selectAllDiv = document.createElement('div');
        selectAllDiv.style.cssText = `
            margin-bottom: 5px;
            text-align: center;
        `;
        
        const selectAllBtn = document.createElement('button');
        selectAllBtn.textContent = '全选';
        selectAllBtn.style.cssText = `
            padding: 3px 8px;
            margin-right: 5px;
            background: #007cba;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
        `;
        
        const deselectAllBtn = document.createElement('button');
        deselectAllBtn.textContent = '取消全选';
        deselectAllBtn.style.cssText = `
            padding: 3px 8px;
            background: #999;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
        `;
        
        selectAllDiv.appendChild(selectAllBtn);
        selectAllDiv.appendChild(deselectAllBtn);
        venueSelectDiv.appendChild(selectAllDiv);
        
        // 更新场馆列表
        function updateVenueList() {
            // 清除现有列表（保留全选按钮）
            const checkboxes = venueSelectDiv.querySelectorAll('label');
            checkboxes.forEach(label => label.remove());
            
            const venueNames = getAllVenueNames();
            venueNames.forEach(name => {
                const label = document.createElement('label');
                label.style.cssText = `
                    display: block;
                    margin-bottom: 3px;
                    cursor: pointer;
                    font-size: 11px;
                `;
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = selectedVenues.has(name);
                checkbox.style.marginRight = '5px';
                
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        selectedVenues.add(name);
                    } else {
                        selectedVenues.delete(name);
                    }
                    const stats = applyFilter();
                    updateStats(stats);
                });
                
                const span = document.createElement('span');
                span.textContent = name;
                
                label.appendChild(checkbox);
                label.appendChild(span);
                venueSelectDiv.appendChild(label);
            });
        }
        
        // 全选事件
        selectAllBtn.addEventListener('click', () => {
            const venueNames = getAllVenueNames();
            venueNames.forEach(name => selectedVenues.add(name));
            updateVenueList();
            const stats = applyFilter();
            updateStats(stats);
        });
        
        // 取消全选事件
        deselectAllBtn.addEventListener('click', () => {
            selectedVenues.clear();
            updateVenueList();
            const stats = applyFilter();
            updateStats(stats);
        });
        
        // 场馆过滤开关事件
        venueFilterCheckbox.addEventListener('change', () => {
            venueNameFilter = venueFilterCheckbox.checked;
            venueSelectDiv.style.display = venueNameFilter ? 'block' : 'none';
            if (venueNameFilter) {
                updateVenueList();
            }
            const stats = applyFilter();
            updateStats(stats);
        });
        
        // 自动加载开关
        const autoLoadLabel = document.createElement('label');
        autoLoadLabel.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            cursor: pointer;
        `;
        
        const autoLoadCheckbox = document.createElement('input');
        autoLoadCheckbox.type = 'checkbox';
        autoLoadCheckbox.checked = autoLoadMore;
        autoLoadCheckbox.style.marginRight = '5px';
        
        autoLoadCheckbox.addEventListener('change', () => {
            autoLoadMore = autoLoadCheckbox.checked;
            log('自动加载更多:', autoLoadMore ? '开启' : '关闭');
            if (autoLoadMore) {
                setTimeout(autoClickLoadMore, 1000);
            }
        });
        
        const autoLoadText = document.createElement('span');
        autoLoadText.textContent = '自动点击"查看更多"';
        autoLoadText.style.fontSize = '12px';
        
        autoLoadLabel.appendChild(autoLoadCheckbox);
        autoLoadLabel.appendChild(autoLoadText);
        
        // 手动加载按钮
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.textContent = '手动点击"查看更多"';
        loadMoreBtn.style.cssText = `
            width: 100%;
            padding: 8px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            margin-bottom: 5px;
        `;
        
        loadMoreBtn.addEventListener('click', () => {
            const btn = document.querySelector('.style_more_btn__ymb22');
            if (btn && btn.offsetParent !== null) {
                btn.click();
                setTimeout(() => {
                    const stats = applyFilter();
                    updateStats(stats);
                    // 更新场馆列表
                    if (venueNameFilter) {
                        updateVenueList();
                    }
                }, 1500);
            } else {
                alert('没有找到"查看更多"按钮');
            }
        });
        
        // 调试模式开关
        const debugBtn = document.createElement('button');
        debugBtn.textContent = debugMode ? '关闭调试' : '开启调试';
        debugBtn.style.cssText = `
            width: 100%;
            padding: 5px;
            background-color: #FF9800;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
        `;
        
        debugBtn.addEventListener('click', () => {
            debugMode = !debugMode;
            debugBtn.textContent = debugMode ? '关闭调试' : '开启调试';
        });
        
        // 更新统计信息
        function updateStats(stats) {
            log('更新统计信息:', stats);
            if (stats && typeof stats === 'object' && stats.total !== undefined) {
                statsDiv.innerHTML = `
                    总计: ${stats.total} | 
                    🟢 ${stats.available} | 
                    🟡 ${stats.crowded} | 
                    🔴 ${stats.unavailable}
                    <br>显示: ${stats.shown || 0} | 隐藏: ${stats.hidden || 0}
                `;
            } else {
                statsDiv.innerHTML = '统计加载中...';
                log('统计数据无效:', stats);
            }
        }
        
        // 组装面板
        container.appendChild(title);
        container.appendChild(statsDiv);
        container.appendChild(filterLabel);
        container.appendChild(filterSelect);
        container.appendChild(venueFilterLabel);
        container.appendChild(venueSelectDiv);
        container.appendChild(autoLoadLabel);
        container.appendChild(loadMoreBtn);
        container.appendChild(debugBtn);
        
        document.body.appendChild(container);
        
        // 初始化统计
        setTimeout(() => {
            log('开始初始化统计');
            const initialStats = applyFilter();
            log('初始化统计结果:', initialStats);
            updateStats(initialStats);
            if (venueNameFilter) {
                updateVenueList();
            }
        }, 1000);
        
        return { updateStats, updateVenueList };
    }
    
    // 等待元素出现
    function waitForElements(timeout = 10000) {
        const startTime = Date.now();
        
        function checkElements() {
            const hasContent = document.querySelector('main') && 
                             document.querySelector('main').children.length > 0;
            
            if (hasContent) {
                log('页面内容已加载');
                applyFilter();
                return true;
            }
            
            if (Date.now() - startTime < timeout) {
                setTimeout(checkElements, 200);
            } else {
                log('等待超时，尝试执行过滤功能');
                applyFilter();
            }
        }
        
        checkElements();
    }
    
    // 使用MutationObserver监听DOM变化
    function observeChanges() {
        let debounceTimer;
        const observer = new MutationObserver((mutations) => {
            // 使用防抖来避免过多执行
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                log('检测到DOM变化，重新执行过滤功能');
                applyFilter();
            }, 300);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'disabled', 'aria-disabled', 'data-available', 'data-status']
        });
        
        log('MutationObserver 已启动');
    }
    
    // 初始化函数
    function init() {
        log('脚本开始执行');
        
        // 创建控制面板
        window.controlPanelInstance = createControlPanel();
        
        // 等待元素加载
        waitForElements();
        
        // 启动观察器
        setTimeout(() => {
            observeChanges();
        }, 1000);
        
        // 启动自动加载更多
        setTimeout(() => {
            if (autoLoadMore) {
                autoClickLoadMore();
            }
        }, 3000);
        
        // 定期检查（针对某些特殊情况）
        setInterval(() => {
            if (document.hidden) return; // 页面不可见时跳过
            applyFilter();
        }, 5000);
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // 如果页面已经加载，等待一下让React/Next.js完成渲染
        setTimeout(init, 500);
    }
})();