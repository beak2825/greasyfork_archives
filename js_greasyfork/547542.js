// ==UserScript==
// @license MIT
// @name         图片轮盘 V2 (终极动态图片版)
// @namespace    http://tampermonkey.net/
// @version      9.5
// @description  彻底解决动态加载图片无法触发轮盘的问题
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547542/%E5%9B%BE%E7%89%87%E8%BD%AE%E7%9B%98%20V2%20%28%E7%BB%88%E6%9E%81%E5%8A%A8%E6%80%81%E5%9B%BE%E7%89%87%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547542/%E5%9B%BE%E7%89%87%E8%BD%AE%E7%9B%98%20V2%20%28%E7%BB%88%E6%9E%81%E5%8A%A8%E6%80%81%E5%9B%BE%E7%89%87%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置和状态变量
    let THEME_MODE = '浅色';
    let FOLDER_CONFIG = {
        '1': { label: '右', icon: 'https://files.getquicker.net/_icons/DE5D3246AFC671461B62948C86EEA8903F591556.png' },
        '2': { label: '键', icon: 'https://files.getquicker.net/_icons/DE5D3246AFC671461B62948C86EEA8903F591556.png' },
        '3': { label: '动', icon: 'https://files.getquicker.net/_icons/DE5D3246AFC671461B62948C86EEA8903F591556.png' },
        '4': { label: '作', icon: 'https://files.getquicker.net/_icons/DE5D3246AFC671461B62948C86EEA8903F591556.png' },
        '5': { label: '可', icon: 'https://files.getquicker.net/_icons/DE5D3246AFC671461B62948C86EEA8903F591556.png' },
        '6': { label: '以', icon: 'https://files.getquicker.net/_icons/DE5D3246AFC671461B62948C86EEA8903F591556.png' },
        '7': { label: '设', icon: 'https://files.getquicker.net/_icons/DE5D3246AFC671461B62948C86EEA8903F591556.png' },
        '8': { label: '置', icon: 'https://files.getquicker.net/_icons/DE5D3246AFC671461B62948C86EEA8903F591556.png' }
    };

    // 从存储中获取配置
    if (GM_getValue("turntable_setting_theme")) {
        THEME_MODE = GM_getValue("turntable_setting_theme");
    } else {
        GM_setValue("turntable_setting_theme", THEME_MODE);
    }
    if (GM_getValue("turntable_setting_folder")) {
        FOLDER_CONFIG = GM_getValue("turntable_setting_folder");
    } else {
        GM_setValue("turntable_setting_folder", FOLDER_CONFIG);
    }

    const turntableConfig = {
        centerX: 0,
        centerY: 0,
        outerRadius: GM_getValue("turntable_setting_outerRadius") || 150,
        innerRadius: 50,
        sectorCount: GM_getValue("turntable_setting_sectorCount") || 8,
        colors: {
            light: { background: "#ffffff", backgroundHover: "#e5e5e5", stroke: "#737373", text: "#333" },
            dark: { background: "#262626", backgroundHover: "#404040", stroke: "#737373", text: "#f5f5f5" }
        },
        fontSize: "12px Arial, sans-serif"
    };

    if (!GM_getValue("turntable_setting_sectorCount")) {
        GM_setValue("turntable_setting_sectorCount", turntableConfig.sectorCount);
    }
    if (!GM_getValue("turntable_setting_outerRadius")) {
        GM_setValue("turntable_setting_outerRadius", turntableConfig.outerRadius);
    }

    // 全局状态
    const iconCache = new Map();
    const MAX_CACHE_SIZE = 50;
    let draggedElement = null;
    let turntableVisible = false;
    let turntableCanvas = null;
    let turntableDialog = null;
    let mutationObserver = null;
    let configObserver = null;
    let processedImages = new WeakSet();
    let intervalCheck = null;

    const getCurrentColors = () => THEME_MODE === '深色' ? turntableConfig.colors.dark : turntableConfig.colors.light;

    let FOLDER_LABELS = Object.fromEntries(Object.entries(FOLDER_CONFIG).map(([key, config]) => [key, config.label]));
    let FOLDER_ICONS = Object.fromEntries(Object.entries(FOLDER_CONFIG).map(([key, config]) => {
        return [key, config.icon || 'https://files.getquicker.net/_icons/DE5D3246AFC671461B62948C86EEA8903F591556.png'];
    }));

    let folderData = Array.from({ length: 8 }, (_, i) => {
        const id = (i + 1).toString();
        return { id, label: FOLDER_LABELS[id] || '无' };
    });

    // 添加样式
    GM_addStyle(`
        .turntable-dialog-lal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            z-index: 999999;
            display: none;
            pointer-events: none;
        }
        .turntable-canvas-lal {
            position: absolute;
            pointer-events: auto;
            border-radius: 50%;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        [data-turntable-enabled] {
            cursor: grab !important;
        }
        [data-turntable-enabled]:active {
            cursor: grabbing !important;
        }
    `);

    // 配置检测函数
    function checkForConfigElements() {
        return document.getElementById('turntable_setting_folder') ||
               document.getElementById('turntable_setting_theme') ||
               document.getElementById('turntable_setting_sectorCount') ||
               document.getElementById('turntable_setting_outerRadius');
    }

    function readConfigFromPage() {
        try {
            let configUpdated = false;
            
            const themeElement = document.getElementById('turntable_setting_theme');
            if (themeElement?.textContent) {
                const newTheme = themeElement.textContent.trim();
                if (newTheme !== THEME_MODE) {
                    THEME_MODE = newTheme;
                    GM_setValue("turntable_setting_theme", THEME_MODE);
                    configUpdated = true;
                }
                themeElement.remove();
            }

            const folderElement = document.getElementById('turntable_setting_folder');
            if (folderElement?.textContent) {
                try {
                    const newFolderConfig = JSON.parse(folderElement.textContent);
                    if (JSON.stringify(newFolderConfig) !== JSON.stringify(FOLDER_CONFIG)) {
                        FOLDER_CONFIG = newFolderConfig;
                        GM_setValue("turntable_setting_folder", FOLDER_CONFIG);
                        configUpdated = true;
                        updateDerivedConfig();
                        clearIconCache();
                    }
                    folderElement.remove();
                } catch (e) {
                    console.error('解析文件夹配置失败:', e);
                }
            }

            const sectorCountElement = document.getElementById('turntable_setting_sectorCount');
            if (sectorCountElement?.textContent) {
                try {
                    const newSectorCount = JSON.parse(sectorCountElement.textContent);
                    if (newSectorCount !== turntableConfig.sectorCount) {
                        turntableConfig.sectorCount = newSectorCount;
                        GM_setValue("turntable_setting_sectorCount", turntableConfig.sectorCount);
                        configUpdated = true;
                    }
                    sectorCountElement.remove();
                } catch (e) {
                    console.error('解析轮盘扇区配置失败:', e);
                }
            }

            const outerRadiusElement = document.getElementById('turntable_setting_outerRadius');
            if (outerRadiusElement?.textContent) {
                try {
                    const newOuterRadius = JSON.parse(outerRadiusElement.textContent);
                    if (newOuterRadius !== turntableConfig.outerRadius) {
                        turntableConfig.outerRadius = newOuterRadius;
                        GM_setValue("turntable_setting_outerRadius", turntableConfig.outerRadius);
                        configUpdated = true;
                    }
                    outerRadiusElement.remove();
                } catch (e) {
                    console.error('解析轮盘尺寸配置失败:', e);
                }
            }

            return configUpdated;
        } catch (error) {
            console.error('读取配置失败:', error);
            return false;
        }
    }

    function updateDerivedConfig() {
        FOLDER_LABELS = Object.fromEntries(Object.entries(FOLDER_CONFIG).map(([key, config]) => [key, config.label]));
        FOLDER_ICONS = Object.fromEntries(Object.entries(FOLDER_CONFIG).map(([key, config]) => {
            return [key, config.icon || 'https://files.getquicker.net/_icons/DE5D3246AFC671461B62948C86EEA8903F591556.png'];
        }));

        folderData = Array.from({ length: 8 }, (_, i) => {
            const id = (i + 1).toString();
            return { id, label: FOLDER_LABELS[id] || '无' };
        });
    }

    function clearIconCache() {
        iconCache.clear();
    }

    function initConfigObserver() {
        if (configObserver) configObserver.disconnect();

        configObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0 && checkForConfigElements()) {
                    const configUpdated = readConfigFromPage();
                    if (configUpdated && turntableCanvas && turntableVisible) {
                        const ctx = turntableCanvas.getContext('2d');
                        renderTurntable(ctx, null);
                    }
                }
            }
        });

        configObserver.observe(document, { childList: true, subtree: true });
    }

    // 核心修复：多重图片检测机制
    function enableImageDragFeature(img) {
        if (!img || processedImages.has(img) || img.complete === false) return;
        
        // 过滤掉可能不需要拖动的图片
        if (img.width < 20 || img.height < 20) return; // 太小的图片
        if (img.src.includes('pixel') || img.src.includes('track')) return; // 跟踪像素
        
        processedImages.add(img);
        
        // 设置可拖动属性
        img.draggable = true;
        img.setAttribute('data-turntable-enabled', 'true');
        img.style.cursor = 'grab';

        const handleDragStart = (e) => {
            draggedElement = img;
            readConfigFromPage();
            
            e.dataTransfer.setData('text/plain', 'turntable-drag');
            e.dataTransfer.effectAllowed = 'copy';
            
            setTimeout(() => {
                const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                let clientX = Math.max(180, Math.min(e.clientX, vw - 180));
                let clientY = Math.max(180, Math.min(e.clientY, vh - 180));
                showTurntable(clientX, clientY);
            }, 50);
        };

        const handleDragEnd = () => {
            setTimeout(() => turntableVisible && hideTurntable(), 100);
        };

        // 移除旧监听器（如果存在）
        img.removeEventListener('dragstart', img._turntableDragStart);
        img.removeEventListener('dragend', img._turntableDragEnd);

        // 添加新监听器
        img.addEventListener('dragstart', handleDragStart);
        img.addEventListener('dragend', handleDragEnd);

        // 存储引用
        img._turntableDragStart = handleDragStart;
        img._turntableDragEnd = handleDragEnd;
    }

    // 多重图片检测策略
    function scanForImages() {
        const images = document.querySelectorAll('img:not([data-turntable-enabled])');
        let count = 0;
        
        images.forEach(img => {
            if (!processedImages.has(img)) {
                enableImageDragFeature(img);
                count++;
            }
        });
        
        if (count > 0) {
            console.log(`📸 发现 ${count} 张新图片，已启用拖动功能`);
        }
        return count;
    }

    // 初始化MutationObserver - 终极版
    function initImageObserver() {
        if (mutationObserver) mutationObserver.disconnect();

        mutationObserver = new MutationObserver((mutations) => {
            if (turntableVisible) return;
            
            let shouldScan = false;
            
            for (const mutation of mutations) {
                // 检查新增节点
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        if (node.tagName === 'IMG') {
                            enableImageDragFeature(node);
                        }
                        if (node.querySelectorAll) {
                            const images = node.querySelectorAll('img');
                            images.forEach(enableImageDragFeature);
                        }
                        shouldScan = true;
                    }
                }
                
                // 检查属性变化
                if (mutation.type === 'attributes' && 
                    mutation.target.tagName === 'IMG' && 
                    (mutation.attributeName === 'src' || mutation.attributeName === 'data-src')) {
                    enableImageDragFeature(mutation.target);
                    shouldScan = true;
                }
            }
            
            if (shouldScan) {
                setTimeout(scanForImages, 100);
            }
        });

        // 全面监控
        mutationObserver.observe(document, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'data-src', 'style', 'class']
        });
    }

    // 定时检查新图片
    function startIntervalCheck() {
        if (intervalCheck) clearInterval(intervalCheck);
        
        intervalCheck = setInterval(() => {
            if (!turntableVisible) {
                scanForImages();
            }
        }, 2000); // 每2秒检查一次
    }

    // 轮盘功能（保持不变）
    function createCanvas(canvas, width, height) {
        try {
            const ratio = window.devicePixelRatio || 1;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            const context = canvas.getContext('2d');
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            return context;
        } catch (error) {
            return null;
        }
    }

    function drawSector(ctx, startAngle, endAngle, sector, isHovered = false) {
        const { centerX, centerY, outerRadius, innerRadius } = turntableConfig;
        const colors = getCurrentColors();
        const radius = isHovered ? outerRadius + 8 : outerRadius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = isHovered ? colors.backgroundHover : colors.background;
        ctx.fill();
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        const midAngle = (startAngle + endAngle) / 2;
        const textRadius = radius * 0.7;
        const textX = centerX + textRadius * Math.cos(midAngle);
        const textY = centerY + textRadius * Math.sin(midAngle);
        
        ctx.fillStyle = colors.text;
        ctx.font = turntableConfig.fontSize;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sector.label, textX, textY);

        const iconUrl = FOLDER_ICONS[sector.id];
        if (iconUrl) {
            const iconAngle = startAngle + (endAngle - startAngle) / 8;
            const iconX = centerX + (radius * 0.9) * Math.cos(iconAngle);
            const iconY = centerY + (radius * 0.9) * Math.sin(iconAngle);
            drawNetworkIcon(ctx, iconUrl, iconX, iconY, 20);
        }
    }

    function drawNetworkIcon(ctx, iconUrl, x, y, size = 16) {
        if (!iconUrl) return;

        if (iconCache.has(iconUrl)) {
            const img = iconCache.get(iconUrl);
            if (img.complete) {
                ctx.save();
                if (getCurrentColors() === turntableConfig.colors.dark) ctx.filter = 'invert(1)';
                ctx.drawImage(img, x - size/2, y - size/2, size, size);
                ctx.restore();
            }
            return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            iconCache.set(iconUrl, img);
            if (turntableCanvas && turntableVisible) {
                const ctx = turntableCanvas.getContext('2d');
                renderTurntable(ctx, null);
            }
        };
        img.onerror = () => {};
        img.src = iconUrl;
    }

    function renderTurntable(ctx, hoveredSector = null) {
        const { sectorCount } = turntableConfig;
        const size = (turntableConfig.outerRadius + 20) * 2;
        ctx.clearRect(0, 0, size, size);

        const anglePerSector = 2 * Math.PI / sectorCount;
        for (let i = 0; i < sectorCount; i++) {
            const startAngle = i * anglePerSector;
            const endAngle = startAngle + anglePerSector;
            drawSector(ctx, startAngle, endAngle, folderData[i], hoveredSector === i);
        }
        
        // 绘制中心
        const { centerX, centerY, innerRadius } = turntableConfig;
        const colors = getCurrentColors();
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = hoveredSector === -1 ? colors.backgroundHover : colors.background;
        ctx.fill();
        ctx.strokeStyle = colors.stroke;
        ctx.stroke();
        ctx.fillStyle = colors.text;
        ctx.fillText('取消', centerX, centerY);
    }

    function showTurntable(x, y) {
        if (turntableVisible) return;
        
        turntableVisible = true;
        const size = (turntableConfig.outerRadius + 20) * 2;

        turntableDialog = document.createElement('div');
        turntableDialog.className = 'turntable-dialog-lal';
        turntableDialog.style.display = 'block';

        turntableCanvas = document.createElement('canvas');
        turntableCanvas.className = 'turntable-canvas-lal';
        turntableCanvas.style.left = `${x - size/2}px`;
        turntableCanvas.style.top = `${y - size/2}px`;
        
        const ctx = createCanvas(turntableCanvas, size, size);
        if (!ctx) {
            hideTurntable();
            return;
        }
        
        turntableConfig.centerX = size / 2;
        turntableConfig.centerY = size / 2;

        let currentHoveredSector = null;
        
        const handleMouseMove = (e) => {
            const rect = turntableCanvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const hoveredSector = getHoveredSector(mouseX, mouseY);
            
            if (hoveredSector !== currentHoveredSector) {
                currentHoveredSector = hoveredSector;
                renderTurntable(ctx, hoveredSector);
            }
        };
        
        turntableCanvas.addEventListener('mousemove', handleMouseMove);
        turntableCanvas.addEventListener('mouseleave', () => {
            currentHoveredSector = null;
            renderTurntable(ctx, null);
        });
        turntableCanvas.addEventListener('dragover', (e) => e.preventDefault());
        turntableCanvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const rect = turntableCanvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const hoveredSector = getHoveredSector(mouseX, mouseY);
            
            if (hoveredSector === -1) {
                console.log('取消保存');
            } else if (hoveredSector !== null && draggedElement) {
                window.location.href = 'quicker:runaction:b9626dd2-e443-4389-7de4-08dde508dfee?' + 
                    folderData[hoveredSector].label + "+-+-+" + draggedElement.src;
            }
            
            hideTurntable();
        });

        turntableDialog.appendChild(turntableCanvas);
        document.body.appendChild(turntableDialog);
        renderTurntable(ctx, null);
    }

    function hideTurntable() {
        if (!turntableVisible) return;
        turntableVisible = false;
        
        if (turntableDialog) {
            document.body.removeChild(turntableDialog);
            turntableDialog = null;
            turntableCanvas = null;
            draggedElement = null;
        }
    }

    function getHoveredSector(mouseX, mouseY) {
        const { centerX, centerY, outerRadius, innerRadius, sectorCount } = turntableConfig;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= innerRadius + 5) return -1;
        if (distance <= outerRadius + 10) {
            const angle = Math.atan2(dy, dx);
            const normalizedAngle = angle >= 0 ? angle : 2 * Math.PI + angle;
            return Math.floor(normalizedAngle / (2 * Math.PI / sectorCount));
        }
        return null;
    }

    // 初始化
    function init() {
        // 移除旧的事件监听器
        document.removeEventListener('dragover', window._turntableGlobalDragOver);
        document.removeEventListener('drop', window._turntableGlobalDrop);

        // 添加全局事件
        const handleGlobalDragOver = (e) => e.preventDefault();
        const handleGlobalDrop = (e) => {
            if (!turntableCanvas || !turntableCanvas.contains(e.target)) {
                e.preventDefault();
                hideTurntable();
            }
        };

        document.addEventListener('dragover', handleGlobalDragOver);
        document.addEventListener('drop', handleGlobalDrop);

        // 存储引用
        window._turntableGlobalDragOver = handleGlobalDragOver;
        window._turntableGlobalDrop = handleGlobalDrop;

        // 初始化观察器
        initConfigObserver();
        initImageObserver();
        startIntervalCheck();

        // 立即扫描所有图片
        setTimeout(() => {
            const count = scanForImages();
            console.log(`🎯 轮盘脚本已加载，已启用 ${count} 张图片的拖动功能`);
        }, 1000);

        // 页面可见性变化时重新扫描
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(scanForImages, 500);
            }
        });
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 确保在页面完全加载后再次初始化
    window.addEventListener('load', () => {
        setTimeout(init, 2000);
    });

})();