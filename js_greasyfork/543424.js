// ==UserScript==
// @name         TMDB封面快速保存 - Workers代理版
// @namespace    https://47bt.com/
// @version      2.0.0
// @author       Mobius
// @description  TMDB 封面图片快速保存，通过Cloudflare Workers代理加速图片下载，可以自定义尺寸。
// @match        https://www.themoviedb.org/movie/*/images/posters*
// @match        https://www.themoviedb.org/tv/*/season/*/images/posters*
// @match        https://www.themoviedb.org/tv/*/images/*
// @grant        none
// @icon         https://47bt.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543424/TMDB%E5%B0%81%E9%9D%A2%E5%BF%AB%E9%80%9F%E4%BF%9D%E5%AD%98%20-%20Workers%E4%BB%A3%E7%90%86%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/543424/TMDB%E5%B0%81%E9%9D%A2%E5%BF%AB%E9%80%9F%E4%BF%9D%E5%AD%98%20-%20Workers%E4%BB%A3%E7%90%86%E7%89%88.meta.js
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
        quality: 0.85,  // 降低默认质量以减少文件体积
        forceResize: false,  // 强制使用调整后的尺寸，即使体积增大
        toolbarPosition: 'top',
        useProxy: true,  // 默认启用代理
        proxyUrl: '',    // Workers代理URL
        proxyApiKey: '', // Workers API密钥
        fallbackToLocal: true  // 代理失败时回退到本地
    };

    // 从localStorage加载设置
    function loadSettings() {
        const savedSettings = localStorage.getItem('tmdbImageProxySettings');
        if (savedSettings) {
            settings = { ...settings, ...JSON.parse(savedSettings) };
        }
    }

    // 保存设置到localStorage
    function saveSettings() {
        localStorage.setItem('tmdbImageProxySettings', JSON.stringify(settings));
        showStatusMessage('设置已保存', 'success');
    }

    // 显示状态消息
    function showStatusMessage(message, type = 'info') {
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: bold;
            z-index: 10001;
            transition: all 0.3s ease;
            ${type === 'success' ? 'background: #28a745;' :
              type === 'error' ? 'background: #dc3545;' :
              type === 'warning' ? 'background: #ffc107; color: #212529;' :
              'background: #17a2b8;'}
        `;
        statusDiv.textContent = message;
        document.body.appendChild(statusDiv);

        setTimeout(() => {
            statusDiv.style.opacity = '0';
            setTimeout(() => {
                if (statusDiv.parentNode) {
                    statusDiv.parentNode.removeChild(statusDiv);
                }
            }, 300);
        }, 3000);
    }

    // 创建设置面板
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'tmdb-proxy-settings-panel';
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
            width: 600px;
            max-width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
        `;

        panel.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 18px; text-align: center;">📸 图片下载设置</h3>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <!-- 左列：代理设置 -->
                <div>
                    <div style="margin-bottom: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px; height: fit-content;">
                        <h4 style="margin: 0 0 12px 0; color: #495057;">🚀 Workers代理设置</h4>
                        <div style="margin-bottom: 12px;">
                            <label style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="useProxy" ${settings.useProxy ? 'checked' : ''}>
                                <span>启用Workers代理加速</span>
                            </label>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <label style="display: block; margin-bottom: 6px;">Workers代理URL:</label>
                            <input type="url" id="proxyUrl" value="${settings.proxyUrl}"
                                   placeholder="https://your-worker.workers.dev"
                                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">
                            <small style="color: #6c757d;">请输入你的Cloudflare Workers代理服务URL</small>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <label style="display: block; margin-bottom: 6px;">API密钥 (可选):</label>
                            <input type="password" id="proxyApiKey" value="${settings.proxyApiKey}"
                                   placeholder="如果Workers启用了验证，请输入API密钥"
                                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">
                            <small style="color: #6c757d;">用于验证Workers访问权限，防止滥用</small>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <label style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="fallbackToLocal" ${settings.fallbackToLocal ? 'checked' : ''}>
                                <span>代理失败时回退到本地下载</span>
                            </label>
                        </div>
                        <button id="testProxy" style="padding: 6px 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">测试代理连接</button>
                    </div>

                    <!-- 界面设置 -->
                    <div style="padding: 16px; background: #f8f9fa; border-radius: 8px;">
                        <h4 style="margin: 0 0 12px 0; color: #495057;">🎨 界面设置</h4>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 6px;">工具栏位置:</label>
                            <select id="toolbarPosition" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                                <option value="top" ${settings.toolbarPosition === 'top' ? 'selected' : ''}>顶部</option>
                                <option value="bottom" ${settings.toolbarPosition === 'bottom' ? 'selected' : ''}>底部</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 右列：图片处理设置 -->
                <div>
                    <div style="padding: 16px; background: #f8f9fa; border-radius: 8px;">
                        <h4 style="margin: 0 0 12px 0; color: #495057;">🖼️ 图片处理设置</h4>
                        <div style="margin-bottom: 16px;">
                            <label style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="enableResize" ${settings.enableResize ? 'checked' : ''}>
                                <span>启用尺寸调整</span>
                            </label>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                            <div>
                                <label style="display: block; margin-bottom: 6px;">宽度 (px):</label>
                                <input type="number" id="width" value="${settings.width}" placeholder="自动" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 6px;">高度 (px):</label>
                                <input type="number" id="height" value="${settings.height}" placeholder="自动" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="maintainAspectRatio" ${settings.maintainAspectRatio ? 'checked' : ''}>
                                <span>保持宽高比</span>
                            </label>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="forceResize" ${settings.forceResize ? 'checked' : ''}>
                                <span>强制使用调整后的尺寸</span>
                            </label>
                            <small style="color: #6c757d; display: block; margin-top: 4px;">即使处理后体积增大也使用调整后的图片</small>
                        </div>
                        <div style="margin-bottom: 16px;">
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
                                <input type="range" id="quality" min="0.1" max="1.0" step="0.05" value="${settings.quality}" style="flex: 1;">
                                <span id="qualityValue" style="min-width: 40px; text-align: center;">${Math.round(settings.quality * 100)}%</span>
                            </div>
                            <small style="color: #6c757d;">建议85%以下以获得更好的压缩效果</small>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px; padding-top: 16px; border-top: 1px solid #dee2e6;">
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
            settings.useProxy = document.getElementById('useProxy').checked;
            settings.proxyUrl = document.getElementById('proxyUrl').value.trim();
            settings.proxyApiKey = document.getElementById('proxyApiKey').value.trim();
            settings.fallbackToLocal = document.getElementById('fallbackToLocal').checked;
            settings.enableResize = document.getElementById('enableResize').checked;
            settings.width = document.getElementById('width').value;
            settings.height = document.getElementById('height').value;
            settings.maintainAspectRatio = document.getElementById('maintainAspectRatio').checked;
            settings.forceResize = document.getElementById('forceResize').checked;
            settings.format = document.getElementById('format').value;
            settings.quality = parseFloat(document.getElementById('quality').value);
            settings.toolbarPosition = document.getElementById('toolbarPosition').value;
            saveSettings();
            panel.style.display = 'none';
            updateAllToolbarsPosition();
        };

        // 测试代理连接
        document.getElementById('testProxy').onclick = async () => {
            const proxyUrl = document.getElementById('proxyUrl').value.trim();
            if (!proxyUrl) {
                showStatusMessage('请先输入代理URL', 'warning');
                return;
            }

            try {
                showStatusMessage('正在测试代理连接...', 'info');

                const headers = {};
                const apiKey = document.getElementById('proxyApiKey').value.trim();
                if (apiKey) {
                    headers['X-API-Key'] = apiKey;
                }

                const response = await fetch(`${proxyUrl}/health`, {
                    headers: headers
                });

                if (response.ok) {
                    const data = await response.json();
                    let message = '代理连接测试成功！';
                    if (data.authRequired) {
                        message += apiKey ? ' (已启用API密钥验证)' : ' (注意: 该代理需要API密钥)';
                    }
                    showStatusMessage(message, 'success');
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                showStatusMessage(`代理连接测试失败: ${error.message}`, 'error');
            }
        };

        // 添加质量滑块的实时更新
        const qualitySlider = document.getElementById('quality');
        const qualityValue = document.getElementById('qualityValue');
        qualitySlider.addEventListener('input', () => {
            qualityValue.textContent = Math.round(qualitySlider.value * 100) + '%';
        });

        return panel;
    }

    // 更新工具栏位置
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

    // 创建下载按钮
    function createDownloadButton(link) {
        const container = document.createElement('div');
        container.classList.add('tmdb-toolbar-container');

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

        // 根据代理状态显示不同的图标
        const proxyIcon = settings.useProxy && settings.proxyUrl ? '🚀' : '';
        const normalButton = createButton('⬇️', `${proxyIcon}原图`, settings.useProxy ? '通过Workers代理下载原始尺寸' : '下载原始尺寸');
        const customButton = createButton('🖼️', `${proxyIcon}自定义`, settings.useProxy ? '通过Workers代理下载自定义尺寸' : '下载自定义尺寸');
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
            const panel = document.getElementById('tmdb-proxy-settings-panel');
            if (panel) {
                panel.style.display = 'block';
            }
        };

        container.appendChild(normalButton);
        container.appendChild(customButton);
        container.appendChild(settingsButton);
        return container;
    }

    // 通过Workers代理下载图片
    async function downloadImageWithProxy(imageUrl) {
        if (!settings.proxyUrl) {
            throw new Error('代理URL未配置');
        }

        const headers = {
            'Content-Type': 'application/json'
        };

        // 如果设置了API密钥，添加到请求头
        if (settings.proxyApiKey) {
            headers['X-API-Key'] = settings.proxyApiKey;
        }

        const response = await fetch(`${settings.proxyUrl}/proxy`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ imageUrl })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `代理请求失败: ${response.status}`);
        }

        return response;
    }

    // 本地下载图片
    async function downloadImageLocal(imageUrl) {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`本地下载失败: ${response.status}`);
        }
        return response;
    }

    // 统一的图片下载函数
    async function downloadImage(link, useCustomSettings) {
        try {
            let response;
            let downloadMethod = '本地';

            // 尝试使用代理下载
            if (settings.useProxy && settings.proxyUrl) {
                try {
                    showStatusMessage('🚀 通过Workers代理下载中...', 'info');
                    response = await downloadImageWithProxy(link);
                    downloadMethod = 'Workers代理';
                } catch (proxyError) {
                    console.warn('代理下载失败:', proxyError);
                    if (settings.fallbackToLocal) {
                        showStatusMessage('⚠️ 代理失败，切换到本地下载...', 'warning');
                        response = await downloadImageLocal(link);
                        downloadMethod = '本地(回退)';
                    } else {
                        throw proxyError;
                    }
                }
            } else {
                showStatusMessage('📥 本地下载中...', 'info');
                response = await downloadImageLocal(link);
            }

            let blob = await response.blob();

            // 如果需要自定义处理
            if (useCustomSettings && settings.enableResize) {
                // 检查是否真的需要调整尺寸
                const needsResize = settings.width || settings.height;
                const needsFormatChange = settings.format && !blob.type.includes(settings.format);

                // 如果只是格式转换且不需要调整尺寸，尝试简单转换
                if (!needsResize && needsFormatChange) {
                    try {
                        const img = new Image();
                        const imgLoaded = new Promise(resolve => { img.onload = resolve; });
                        img.src = URL.createObjectURL(blob);
                        await imgLoaded;

                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);

                        const newBlob = await new Promise(resolve => {
                            canvas.toBlob(resolve, `image/${settings.format}`, settings.quality);
                        });

                        // 如果转换后体积更小，使用新格式
                        if (newBlob.size < blob.size) {
                            blob = newBlob;
                            console.log(`格式转换完成: ${(blob.size/1024).toFixed(1)}KB -> ${(newBlob.size/1024).toFixed(1)}KB`);
                        } else {
                            console.log('格式转换后体积增大，保持原格式');
                        }

                        URL.revokeObjectURL(img.src);
                    } catch (error) {
                        console.warn('格式转换失败，保持原格式:', error);
                    }
                } else if (needsResize) {
                const originalSize = blob.size;
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
                // 启用图像平滑以获得更好的缩放质量
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                URL.revokeObjectURL(img.src);

                // 智能格式和质量选择
                let outputFormat = settings.format;
                let outputQuality = settings.quality;

                // 如果原图是PNG且用户选择JPEG，检查是否有透明度
                if (blob.type.includes('png') && outputFormat === 'jpeg') {
                    // 检查是否有透明像素
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const hasTransparency = imageData.data.some((_, i) => i % 4 === 3 && imageData.data[i] < 255);
                    if (hasTransparency) {
                        outputFormat = 'png'; // 保持PNG格式以保留透明度
                        console.log('检测到透明度，保持PNG格式');
                    }
                }

                // 尝试多个质量级别，选择最优的
                const qualityLevels = [outputQuality, Math.max(0.1, outputQuality - 0.2), Math.max(0.1, outputQuality - 0.4)];
                let bestBlob = null;
                let bestSize = Infinity;

                for (const quality of qualityLevels) {
                    const testBlob = await new Promise(resolve => {
                        canvas.toBlob(resolve, `image/${outputFormat}`, quality);
                    });

                    if (testBlob.size < bestSize) {
                        bestBlob = testBlob;
                        bestSize = testBlob.size;
                    }

                    // 如果找到比原图小的版本，就使用它
                    if (testBlob.size < originalSize) {
                        break;
                    }
                }

                // 计算像素减少比例和体积变化
                const originalPixels = img.width * img.height;
                const targetPixels = targetWidth * targetHeight;
                const pixelReduction = targetPixels / originalPixels; // 新像素数/原像素数
                const sizeIncrease = bestBlob.size / originalSize; // 新体积/原体积

                // 智能判断是否使用处理后的图片
                 let useProcessed = true;
                 let reason = '';

                 // 检查是否有明显的尺寸调整需求
                  const hasSignificantResize = pixelReduction < 0.9 || pixelReduction > 1.1; // 像素变化超过10%

                  if (settings.forceResize) {
                      // 强制调整模式：无论如何都使用处理后的图片
                      if (bestBlob.size > originalSize) {
                          const reduction = Math.round((1-pixelReduction)*100);
                          const increase = Math.round((sizeIncrease-1)*100);
                          showStatusMessage(`✅ 强制调整完成，体积增大${increase}%`, 'info');
                          console.log(`强制调整模式(像素${reduction > 0 ? '-' : '+'}${Math.abs(reduction)}%)，体积增大${increase}%，按用户要求处理`);
                      }
                  } else if (bestBlob.size > originalSize && !hasSignificantResize) {
                      // 只有在尺寸变化不大且体积增大时才考虑使用原图
                      if (pixelReduction > 0.8 && sizeIncrease > 1.1) {
                          useProcessed = false;
                          reason = `尺寸变化较小(${Math.round((1-pixelReduction)*100)}%)但体积增大${Math.round((sizeIncrease-1)*100)}%`;
                      }
                  } else if (bestBlob.size > originalSize && hasSignificantResize) {
                      // 有明显尺寸调整需求时，给出警告但仍然使用处理后的图片
                      const reduction = Math.round((1-pixelReduction)*100);
                      const increase = Math.round((sizeIncrease-1)*100);
                      showStatusMessage(`⚠️ 尺寸调整完成，但体积增大${increase}%`, 'warning');
                      console.log(`用户要求尺寸调整(像素${reduction > 0 ? '-' : '+'}${Math.abs(reduction)}%)，体积增大${increase}%，按需求处理`);
                  }

                if (!useProcessed) {
                    console.log(`处理后不合理 (${(bestBlob.size/1024).toFixed(1)}KB > ${(originalSize/1024).toFixed(1)}KB)，${reason}，使用原图`);
                    showStatusMessage(`⚠️ ${reason}，使用原图`, 'warning');
                    // 如果需要重命名，创建新的blob
                    if (outputFormat !== blob.type.split('/')[1]) {
                        blob = new Blob([blob], { type: `image/${outputFormat}` });
                    }
                } else {
                    blob = new Blob([bestBlob], {
                        type: `image/${outputFormat}`
                    });
                    const reduction = Math.round((1-pixelReduction)*100);
                    const sizeChange = sizeIncrease > 1 ? `+${Math.round((sizeIncrease-1)*100)}%` : `-${Math.round((1-sizeIncrease)*100)}%`;
                    console.log(`图片处理完成: ${img.width}x${img.height} -> ${targetWidth}x${targetHeight} (像素-${reduction}%), ${(originalSize/1024).toFixed(1)}KB -> ${(blob.size/1024).toFixed(1)}KB (${sizeChange})`);
                 }
                 } // 结束 needsResize 分支
             }

            // 下载文件
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            const originalName = link.split('/').pop().split('.')[0];
            const extension = settings.format || 'jpeg';
            const filename = `${originalName}.${extension}`;

            a.setAttribute('download', filename);
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');

            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            showStatusMessage(`✅ 下载完成 (${downloadMethod})`, 'success');
        } catch (error) {
            console.error('下载失败:', error);
            showStatusMessage(`❌ 下载失败: ${error.message}`, 'error');
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

    // 如果没有配置代理URL，显示提示
    if (!settings.proxyUrl) {
        setTimeout(() => {
            showStatusMessage('💡 提示：配置Workers代理可以加速图片下载', 'info');
        }, 2000);
    }
})();