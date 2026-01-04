// ==UserScript==
// @name         47BT专用TMDB封面快速保存
// @namespace    https://47bt.com/
// @version      1.6.2
// @author       Mobius
// @description  TMDB 封面图片快速保存,可以自定义尺寸.
// @match        https://www.themoviedb.org/movie/*/images/posters*
// @match        https://www.themoviedb.org/tv/*/season/*/images/posters*
// @match        https://www.themoviedb.org/tv/*/images/*
// @grant        none
// @icon         https://47bt.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523862/47BT%E4%B8%93%E7%94%A8TMDB%E5%B0%81%E9%9D%A2%E5%BF%AB%E9%80%9F%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/523862/47BT%E4%B8%93%E7%94%A8TMDB%E5%B0%81%E9%9D%A2%E5%BF%AB%E9%80%9F%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认设置
    let settings = {
        enableResize: false,
        width: '',
        height: '600',
        maintainAspectRatio: true,
        format: 'jpg',
        quality: 0.95,
        toolbarPosition: 'top'  // 添加工具栏位置设置，默认顶部
    };

    // 从localStorage加载设置
    function loadSettings() {
        const savedSettings = localStorage.getItem('tmdbImageSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
    }

    // 保存设置到localStorage
    function saveSettings() {
        localStorage.setItem('tmdbImageSettings', JSON.stringify(settings));
    }

    // 创建设置面板
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'tmdb-settings-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            z-index: 10000;
            display: none;
            min-width: 300px;
        `;

        panel.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 18px;">图片下载设置</h3>
            <div style="margin-bottom: 16px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="enableResize" ${settings.enableResize ? 'checked' : ''}>
                    <span>启用尺寸调整</span>
                </label>
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 6px;">宽度 (px):</label>
                <input type="number" id="width" value="${settings.width}" placeholder="自动" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 6px;">高度 (px):</label>
                <input type="number" id="height" value="${settings.height}" placeholder="自动" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="maintainAspectRatio" ${settings.maintainAspectRatio ? 'checked' : ''}>
                    <span>保持宽高比</span>
                </label>
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 6px;">格式:</label>
                <select id="format" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="jpeg" ${settings.format === 'jpeg' ? 'selected' : ''}>JPEG</option>
                    <option value="jpg" ${settings.format === 'jpg' ? 'selected' : ''}>JPG</option>
                    <option value="png" ${settings.format === 'png' ? 'selected' : ''}>PNG</option>
                    <option value="webp" ${settings.format === 'webp' ? 'selected' : ''}>WebP</option>
                </select>
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 6px;">图片质量:</label>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="range" 
                        id="quality" 
                        min="0.1" 
                        max="1.0" 
                        step="0.05" 
                        value="${settings.quality}"
                        style="flex: 1;"
                    >
                    <span id="qualityValue">${Math.round(settings.quality * 100)}%</span>
                </div>
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 6px;">工具栏位置:</label>
                <select id="toolbarPosition" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="top" ${settings.toolbarPosition === 'top' ? 'selected' : ''}>顶部</option>
                    <option value="bottom" ${settings.toolbarPosition === 'bottom' ? 'selected' : ''}>底部</option>
                </select>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="cancelSettings" style="padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">取消</button>
                <button id="saveSettings" style="padding: 8px 16px; background: #01b4e4; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
            </div>
        `;

        document.body.appendChild(panel);

        // 添加设置面板的事件处理
        document.getElementById('cancelSettings').onclick = () => {
            panel.style.display = 'none';
        };

        document.getElementById('saveSettings').onclick = () => {
            settings.enableResize = document.getElementById('enableResize').checked;
            settings.width = document.getElementById('width').value;
            settings.height = document.getElementById('height').value;
            settings.maintainAspectRatio = document.getElementById('maintainAspectRatio').checked;
            settings.format = document.getElementById('format').value;
            settings.quality = parseFloat(document.getElementById('quality').value);
            settings.toolbarPosition = document.getElementById('toolbarPosition').value;
            saveSettings();
            panel.style.display = 'none';
            
            // 刷新所有工具栏的位置
            updateAllToolbarsPosition();
        };

        // 添加质量滑块的实时更新
        const qualitySlider = document.getElementById('quality');
        const qualityValue = document.getElementById('qualityValue');
        qualitySlider.addEventListener('input', () => {
            qualityValue.textContent = Math.round(qualitySlider.value * 100) + '%';
        });

        return panel;
    }

    // 添加更新工具栏位置的函数
    function updateAllToolbarsPosition() {
        const containers = document.querySelectorAll('.tmdb-toolbar-container');
        containers.forEach(container => {
            if (settings.toolbarPosition === 'top') {
                container.style.top = '0';
                container.style.bottom = 'auto';
            } else {
                container.style.top = 'auto';
                container.style.bottom = '0';
            }
        });
    }

    // 修改createDownloadButton函数
    function createDownloadButton(link) {
        const container = document.createElement('div');
        container.classList.add('tmdb-toolbar-container');  // 添加类名以便后续更新位置
        
        // 根据设置决定工具栏位置
        const position = settings.toolbarPosition === 'top' ? 'top: 0; bottom: auto;' : 'top: auto; bottom: 0;';
        
        container.style.cssText = `
            position: absolute;
            left: 0;
            right: 0;
            ${position}
            z-index: 1000;
            display: none;
            justify-content: center;
            gap: 8px;
            padding: 8px;
            background: linear-gradient(to ${settings.toolbarPosition === 'top' ? 'bottom' : 'top'}, 
                                     rgba(0, 0, 0, 0.7), 
                                     rgba(0, 0, 0, 0.4));
            backdrop-filter: blur(4px);
        `;

        const buttonStyle = `
            background-color: rgba(255, 255, 255, 0.15);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
            white-space: nowrap;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        `;

        const buttonHoverStyle = `
            background-color: rgba(255, 255, 255, 0.3);
        `;

        const createButton = (icon, text, title) => {
            const button = document.createElement('button');
            button.innerHTML = text ? `${icon} ${text}` : icon;
            button.style.cssText = buttonStyle;
            button.title = title || text;
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            });
            return button;
        };

        const normalButton = createButton('⬇️', '原图', '下载原始尺寸');
        const customButton = createButton('🖼️', '自定义', '下载自定义尺寸');
        const settingsButton = createButton('⚙️', null, '图片下载设置');

        // 原始下载功能
        normalButton.onclick = async () => {
            await downloadImage(link, false);
        };

        // 自定义下载功能
        customButton.onclick = async () => {
            await downloadImage(link, true);
        };

        // 设置按钮功能
        settingsButton.onclick = (e) => {
            e.stopPropagation();
            const panel = document.getElementById('tmdb-settings-panel');
            if (panel) {
                panel.style.display = 'block';
            }
        };

        container.appendChild(normalButton);
        container.appendChild(customButton);
        container.appendChild(settingsButton);
        return container;
    }

    // 新增下载处理函数
    async function downloadImage(link, useCustomSettings) {
        try {
            const response = await fetch(link);
            if (!response.ok) throw new Error('下载失败');
            
            let blob = await response.blob();
            
            if (useCustomSettings && settings.enableResize) {
                // 创建一个临时图片来获取原始尺寸
                const img = new Image();
                const imgLoaded = new Promise(resolve => {
                    img.onload = resolve;
                });
                img.src = URL.createObjectURL(blob);
                await imgLoaded;
                
                const canvas = document.createElement('canvas');
                let targetWidth = settings.width ? parseInt(settings.width) : img.width;
                let targetHeight = settings.height ? parseInt(settings.height) : img.height;
                
                if (settings.maintainAspectRatio) {
                    if (settings.width && !settings.height) {
                        targetHeight = Math.round((targetWidth / img.width) * img.height);
                    } else if (settings.height && !settings.width) {
                        targetWidth = Math.round((targetHeight / img.height) * img.width);
                    }
                }
                
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                
                // 释放临时URL
                URL.revokeObjectURL(img.src);
                
                // 使用指定的格式创建新的blob
                blob = await new Promise(resolve => {
                    canvas.toBlob(resolve, `image/${settings.format}`, settings.quality);
                });
                
                // 强制设置content-disposition
                blob = new Blob([blob], {
                    type: `image/${settings.format}`
                });
            }
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // 构建文件名
            const originalName = link.split('/').pop().split('.')[0];
            const extension = settings.format || 'jpeg';
            const sizeSuffix = useCustomSettings ? `_${settings.width || 'auto'}x${settings.height || 'auto'}` : '';
            const filename = `${originalName}${sizeSuffix}.${extension}`;
            
            // 添加这些属性来强制下载
            a.setAttribute('download', filename);
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
            
            // 使用click()事件触发下载
            document.body.appendChild(a);
            a.click();
            
            // 清理
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('下载失败:', error);
        }
    }

    // 初始化
    loadSettings();
    const settingsPanel = createSettingsPanel();

    // 遍历所有封面图标
    const posters = document.querySelectorAll('.image_content');
    posters.forEach(poster => {
        const link = poster.querySelector('a').href;
        const container = createDownloadButton(link);
        poster.appendChild(container);

        poster.addEventListener('mouseenter', () => {
            container.style.cssText += `
                display: flex;
            `;
        });
        poster.addEventListener('mouseleave', () => {
            container.style.display = 'none';
        });
    });
})();
