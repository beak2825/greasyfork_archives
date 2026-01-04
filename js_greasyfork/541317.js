// ==UserScript==
// @name 终极图文发送器 v2.1
// @namespace http://tampermonkey.net/
// @version 2.1
// @description 解决所有顺序问题 + 手动调整 + 智能排版 + 最小化功能的终极图文发送器
// @author Your Name
// @match :///*
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @grant GM_setValue
// @grant GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541317/%E7%BB%88%E6%9E%81%E5%9B%BE%E6%96%87%E5%8F%91%E9%80%81%E5%99%A8%20v21.user.js
// @updateURL https://update.greasyfork.org/scripts/541317/%E7%BB%88%E6%9E%81%E5%9B%BE%E6%96%87%E5%8F%91%E9%80%81%E5%99%A8%20v21.meta.js
// ==/UserScript==

// 终极版智能图文发送器 v2.1 - 解决所有顺序问题 + 手动调整 + 智能排版 + 最小化功能
function createUltimateUserSimulator() {
    // 创建浮动窗口
    const simulator = document.createElement('div');
    simulator.id = 'ultimate-user-simulator';
    simulator.style.cssText = `
        position: fixed;
        top: 80px;
        left: 20px;
        width: 500px;
        height: 90vh;
        max-height: 95vh;
        background: white;
        border: 1px solid #ddd;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        resize: both;
        overflow: hidden;
        transition: all 0.3s ease;
    `;
    
    // 创建标题栏
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 15px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        cursor: move;
        font-weight: 600;
    `;
    header.innerHTML = `
        <span>🎯 终极图文发送器 v2.1</span>
        <div style="display: flex; gap: 10px;">
            <button id="minimize-ultimate-simulator" style="background: rgba(255,255,255,0.2); border: none; cursor: pointer; font-size: 16px; color: white; border-radius: 4px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">−</button>
            <button id="close-ultimate-simulator" style="background: rgba(255,255,255,0.2); border: none; cursor: pointer; font-size: 20px; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">×</button>
        </div>
    `;
    simulator.appendChild(header);
    
    // 创建内容区域
    const content = document.createElement('div');
    content.id = 'ultimate-content-area';
    content.style.cssText = `
        padding: 20px;
        height: calc(100% - 80px);
        overflow-y: auto;
        background: #f8fafc;
    `;
    
    // 创建智能粘贴区域
    content.innerHTML = `
        <!-- 粘贴区域 -->
        <div style="margin-bottom: 20px;">
            <div style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600;">📋 智能粘贴区域</h3>
                
                <div id="ultimate-paste-area" 
                     contenteditable="true" 
                     style="min-height: 130px; padding: 20px; border: 2px dashed #10b981; border-radius: 10px; 
                            background: #f0fdf4; outline: none; line-height: 1.8; font-size: 15px;
                            transition: all 0.3s ease;"
                     placeholder="直接粘贴图文内容到这里...">
                </div>
                
                <div style="margin-top: 15px; font-size: 13px; color: #64748b; line-height: 1.5;">
                    💡 <strong>多种解决方案</strong>：<br>
                    • 🔄 智能同步解析 - 彻底解决异步图片问题<br>
                    • ✋ 手动调整顺序 - 拖拽重新排列<br>
                    • 🧠 AI智能排版 - 自动穿插图片到合适位置
                </div>
            </div>
        </div>
        
        <!-- 解析选项 -->
        <div style="margin-bottom: 20px;">
            <div style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600;">⚙️ 解析策略</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">解析模式</label>
                        <select id="ultimate-parse-mode" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; background: white; font-size: 14px;">
                            <option value="sync">🔄 同步解析 (推荐)</option>
                            <option value="manual">✋ 手动调整</option>
                            <option value="smart">🧠 智能排版</option>
                            <option value="preserve">📄 保持原始</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">分段策略</label>
                        <select id="ultimate-segment-mode" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; background: white; font-size: 14px;">
                            <option value="auto" selected>🎯 智能分割</option>
                            <option value="paragraph">📝 按段落</option>
                            <option value="sentence">📖 按句子</option>
                            <option value="custom">🔧 自定义</option>
                        </select>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">打字速度</label>
                        <select id="ultimate-typing-speed" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; background: white; font-size: 14px;">
                            <option value="30">⚡ 极速 (30ms)</option>
                            <option value="60" selected>🚀 快速 (60ms)</option>
                            <option value="100">📝 正常 (100ms)</option>
                            <option value="150">🐌 慢速 (150ms)</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">发送间隔</label>
                        <select id="ultimate-send-interval" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; background: white; font-size: 14px;">
                            <option value="800">⚡ 0.8秒</option>
                            <option value="1200" selected>🎯 1.2秒</option>
                            <option value="1800">📝 1.8秒</option>
                            <option value="2500">🐌 2.5秒</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 内容预览和编辑区域 -->
        <div style="margin-bottom: 20px;">
            <div style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: #1e293b; font-size: 18px; font-weight: 600;">📋 内容序列编辑器</h3>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span id="ultimate-content-count" style="background: #dbeafe; color: #1e40af; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">0 项内容</span>
                        <button id="toggle-edit-mode" style="padding: 8px 15px; background: #f59e0b; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600;">✏️ 编辑模式</button>
                    </div>
                </div>
                
                <div id="ultimate-content-editor" style="max-height: 350px; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 8px; background: #fafbfc;">
                    <div style="text-align: center; color: #9ca3af; padding: 40px 20px; font-style: italic;">
                        等待粘贴和解析内容...
                    </div>
                </div>
                
                <!-- 编辑工具栏 -->
                <div id="editor-toolbar" style="margin-top: 15px; padding: 15px; background: #f1f5f9; border-radius: 8px; display: none;">
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                        <button id="smart-arrange-btn" style="padding: 10px 15px; background: #8b5cf6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600;">🧠 智能排版</button>
                        <button id="add-text-btn" style="padding: 10px 15px; background: #06b6d4; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600;">➕ 添加文本</button>
                        <button id="add-image-btn" style="padding: 10px 15px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600;">🖼️ 添加图片</button>
                        <button id="clear-all-btn" style="padding: 10px 15px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600;">🗑️ 清空</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 操作按钮 -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <button id="ultimate-parse-btn" style="padding: 15px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 15px; transition: all 0.3s ease;">
                🔄 智能解析
            </button>
            <button id="ultimate-start-sequence" style="padding: 15px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 15px; transition: all 0.3s ease;" disabled>
                🚀 开始发送
            </button>
        </div>
        
        <!-- 快捷操作 -->
        <div style="display: flex; justify-content: center;">
            <button id="preview-sequence-btn" style="padding: 12px 24px; background: #f59e0b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px;">👁️ 预览序列</button>
        </div>
    `;
    simulator.appendChild(content);
    
    // 添加到页面
    document.body.appendChild(simulator);
    
    // 添加拖拽功能
    makeDraggableUltimate(simulator, header);
    
    // 初始化功能
    initializeUltimateSimulator();
    
    return simulator;
}

// 初始化终极模拟器
function initializeUltimateSimulator() {
    // 初始化全局变量
    window.ultimateContentSequence = [];
    window.isEditMode = false;
    window.draggedElement = null;
    window.isMinimized = false;
    
    // 绑定所有事件
    bindUltimateEvents();
    
    // 设置粘贴区域
    setupUltimatePasteArea();
    
    console.log('🚀 终极图文发送器初始化完成');
}

// 绑定所有事件
function bindUltimateEvents() {
    // 基础控制
    document.getElementById('close-ultimate-simulator').addEventListener('click', () => {
        document.getElementById('ultimate-user-simulator').remove();
    });
    
    // 最小化功能
    document.getElementById('minimize-ultimate-simulator').addEventListener('click', toggleMinimize);
    
    // 主要功能按钮
    document.getElementById('ultimate-parse-btn').addEventListener('click', performUltimateParse);
    document.getElementById('ultimate-start-sequence').addEventListener('click', startUltimateSequence);
    
    // 编辑模式
    document.getElementById('toggle-edit-mode').addEventListener('click', toggleEditMode);
    
    // 编辑工具
    document.getElementById('smart-arrange-btn').addEventListener('click', performSmartArrange);
    document.getElementById('add-text-btn').addEventListener('click', addTextElement);
    document.getElementById('add-image-btn').addEventListener('click', addImageElement);
    document.getElementById('clear-all-btn').addEventListener('click', clearAllContent);
    
    // 预览功能
    document.getElementById('preview-sequence-btn').addEventListener('click', previewSequence);
    
    // 粘贴区域事件
    const pasteArea = document.getElementById('ultimate-paste-area');
    pasteArea.addEventListener('paste', handleUltimatePaste);
    pasteArea.addEventListener('input', updateUltimatePreview);
    pasteArea.addEventListener('dragover', handleUltimateDragOver);
    pasteArea.addEventListener('drop', handleUltimateDrop);
}

// 最小化/还原功能
function toggleMinimize() {
    const simulator = document.getElementById('ultimate-user-simulator');
    const contentArea = document.getElementById('ultimate-content-area');
    const minimizeBtn = document.getElementById('minimize-ultimate-simulator');
    
    if (!window.isMinimized) {
        // 最小化
        window.simulatorOriginalHeight = simulator.style.height || '90vh';
        window.simulatorOriginalWidth = simulator.style.width || '500px';
        
        simulator.style.height = '60px';
        simulator.style.width = '280px';
        simulator.style.resize = 'none';
        contentArea.style.display = 'none';
        minimizeBtn.textContent = '□';
        window.isMinimized = true;
        
        showUltimateToast('📦 窗口已最小化', 'info');
    } else {
        // 还原
        simulator.style.height = window.simulatorOriginalHeight;
        simulator.style.width = window.simulatorOriginalWidth;
        simulator.style.resize = 'both';
        contentArea.style.display = 'block';
        minimizeBtn.textContent = '−';
        window.isMinimized = false;
        
        showUltimateToast('📖 窗口已还原', 'info');
    }
}

// 设置粘贴区域
function setupUltimatePasteArea() {
    const pasteArea = document.getElementById('ultimate-paste-area');
    
    // 焦点效果
    pasteArea.addEventListener('focus', () => {
        pasteArea.style.borderColor = '#3b82f6';
        pasteArea.style.background = '#eff6ff';
        pasteArea.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
    });
    
    pasteArea.addEventListener('blur', () => {
        pasteArea.style.borderColor = '#10b981';
        pasteArea.style.background = '#f0fdf4';
        pasteArea.style.boxShadow = 'none';
    });
    
    // 占位符处理
    if (pasteArea.textContent.trim() === '') {
        pasteArea.innerHTML = '<span style="color: #9ca3af; font-style: italic;">直接粘贴图文内容到这里...</span>';
    }
    
    pasteArea.addEventListener('focus', () => {
        if (pasteArea.textContent === '直接粘贴图文内容到这里...') {
            pasteArea.innerHTML = '';
        }
    });
    
    pasteArea.addEventListener('blur', () => {
        if (pasteArea.textContent.trim() === '' && pasteArea.querySelectorAll('img').length === 0) {
            pasteArea.innerHTML = '<span style="color: #9ca3af; font-style: italic;">直接粘贴图文内容到这里...</span>';
        }
    });
}

// 处理终极粘贴 (同步解决方案)
async function handleUltimatePaste(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const clipboardData = event.clipboardData || window.clipboardData;
    const pasteArea = document.getElementById('ultimate-paste-area');
    
    showUltimateToast('🔄 正在解析粘贴内容...', 'info');
    
    // 清空占位符
    if (pasteArea.textContent === '直接粘贴图文内容到这里...') {
        pasteArea.innerHTML = '';
    }
    
    try {
        // 同步处理所有内容
        await processPasteContentSync(clipboardData, pasteArea);
        showUltimateToast('✅ 内容粘贴完成！', 'success');
    } catch (error) {
        console.error('粘贴处理错误:', error);
        showUltimateToast('❌ 粘贴处理失败', 'error');
    }
}

// 同步处理粘贴内容
async function processPasteContentSync(clipboardData, pasteArea) {
    const tempSequence = [];
    
    // 1. 首先处理HTML内容（如果有）
    const htmlData = clipboardData.getData('text/html');
    if (htmlData && htmlData.trim()) {
        console.log('📄 处理HTML内容...');
        await parseHTMLContentSync(htmlData, tempSequence);
    }
    
    // 2. 处理纯文本（如果没有HTML）
    const textData = clipboardData.getData('text/plain');
    if (textData && textData.trim() && !htmlData) {
        console.log('📝 处理纯文本内容...');
        tempSequence.push({
            type: 'text',
            content: textData.trim(),
            timestamp: Date.now()
        });
    }
    
    // 3. 同步处理剪贴板图片
    const items = clipboardData.items;
    if (items && items.length > 0) {
        const imagePromises = [];
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
                const blob = item.getAsFile();
                if (blob) {
                    const promise = new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            resolve({
                                type: 'image',
                                content: e.target.result,
                                timestamp: Date.now() + i // 确保顺序
                            });
                        };
                        reader.onerror = () => resolve(null);
                        reader.readAsDataURL(blob);
                    });
                    imagePromises.push(promise);
                }
            }
        }
        
        // 等待所有图片处理完成
        const imageResults = await Promise.all(imagePromises);
        imageResults.forEach(result => {
            if (result) {
                tempSequence.push(result);
            }
        });
    }
    
    // 4. 按时间戳排序确保顺序正确
    tempSequence.sort((a, b) => a.timestamp - b.timestamp);
    
    // 5. 将内容添加到粘贴区域
    displayParsedContent(tempSequence, pasteArea);
    
    // 6. 更新预览
    updateUltimatePreview();
}

// 同步解析HTML内容
async function parseHTMLContentSync(htmlContent, sequence) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const elementQueue = [];
    let timestamp = Date.now();
    
    // 遍历所有节点，记录顺序
    function traverseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text && text !== '直接粘贴图文内容到这里...') {
                elementQueue.push({
                    type: 'text',
                    content: text,
                    timestamp: timestamp++
                });
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'IMG') {
                const src = node.src;
                if (src) {
                    elementQueue.push({
                        type: 'image',
                        content: src,
                        timestamp: timestamp++,
                        needsConversion: !src.startsWith('data:image/')
                    });
                }
            } else if (node.tagName === 'BR') {
                // 忽略或处理换行
            } else {
                // 递归处理子节点
                for (let child of node.childNodes) {
                    traverseNodes(child);
                }
            }
        }
    }
    
    // 开始遍历
    for (let child of tempDiv.childNodes) {
        traverseNodes(child);
    }
    
    // 处理需要转换的网络图片
    for (let element of elementQueue) {
        if (element.type === 'image' && element.needsConversion) {
            try {
                element.content = await convertNetworkImageToBase64Sync(element.content);
                console.log('✅ 网络图片转换成功');
            } catch (error) {
                console.warn('⚠️ 网络图片转换失败，使用占位符');
                element.content = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzM4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPue9kee7nOWbvueJhzwvdGV4dD48L3N2Zz4=';
                element.failed = true;
            }
        }
        sequence.push(element);
    }
}

// 同步转换网络图片
function convertNetworkImageToBase64Sync(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        const timeout = setTimeout(() => {
            reject(new Error('图片加载超时'));
        }, 5000);
        
        img.onload = function() {
            clearTimeout(timeout);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            
            try {
                ctx.drawImage(img, 0, 0);
                const base64 = canvas.toDataURL('image/png');
                resolve(base64);
            } catch (e) {
                reject(e);
            }
        };
        
        img.onerror = function() {
            clearTimeout(timeout);
            reject(new Error('图片加载失败'));
        };
        
        img.src = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
    });
}

// 显示解析后的内容
function displayParsedContent(sequence, pasteArea) {
    pasteArea.innerHTML = '';
    
    sequence.forEach((item, index) => {
        if (item.type === 'text') {
            const textSpan = document.createElement('span');
            textSpan.textContent = item.content + ' ';
            textSpan.setAttribute('data-index', index);
            pasteArea.appendChild(textSpan);
        } else if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.content;
            img.style.cssText = `
                max-width: 100%;
                height: auto;
                margin: 10px 0;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                display: block;
            `;
            img.setAttribute('data-index', index);
            pasteArea.appendChild(document.createElement('br'));
            pasteArea.appendChild(img);
            pasteArea.appendChild(document.createElement('br'));
        }
    });
    
    console.log(`✅ 显示了 ${sequence.length} 个元素，保持了原始顺序`);
}

// 执行终极解析
async function performUltimateParse() {
    const pasteArea = document.getElementById('ultimate-paste-area');
    const parseMode = document.getElementById('ultimate-parse-mode').value;
    const segmentMode = document.getElementById('ultimate-segment-mode').value;
    
    const textContent = pasteArea.textContent.trim();
    const images = pasteArea.querySelectorAll('img');
    const actualTextContent = textContent === '直接粘贴图文内容到这里...' ? '' : textContent;
    
    if (!actualTextContent && images.length === 0) {
        showUltimateToast('⚠️ 请先粘贴内容到上方区域', 'warning');
        return;
    }
    
    showUltimateToast('🧠 正在智能解析内容...', 'info');
    
    // 清空序列
    window.ultimateContentSequence = [];
    
    try {
        switch (parseMode) {
            case 'sync':
                await parseSyncMode(pasteArea, segmentMode);
                break;
            case 'manual':
                await parseManualMode(pasteArea, segmentMode);
                break;
            case 'smart':
                await parseSmartMode(pasteArea, segmentMode);
                break;
            case 'preserve':
                await parsePreserveMode(pasteArea);
                break;
            default:
                await parseSyncMode(pasteArea, segmentMode);
        }
        
        // 更新编辑器
        updateContentEditor();
        
        // 启用发送按钮
        const sendBtn = document.getElementById('ultimate-start-sequence');
        sendBtn.disabled = false;
        sendBtn.style.opacity = '1';
        
        showUltimateToast(`✅ 解析完成！识别到 ${window.ultimateContentSequence.length} 个内容段`, 'success');
        
    } catch (error) {
        console.error('解析过程出错:', error);
        showUltimateToast('❌ 解析过程出现错误', 'error');
    }
}

// 同步模式解析 (彻底解决顺序问题)
async function parseSyncMode(pasteArea, segmentMode) {
    console.log('🔄 使用同步模式解析...');
    
    const children = Array.from(pasteArea.childNodes);
    const tempSequence = [];
    
    // 按DOM顺序逐个处理
    for (let i = 0; i < children.length; i++) {
        const node = children[i];
        
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text && text !== '直接粘贴图文内容到这里...') {
                tempSequence.push({
                    type: 'text',
                    content: text,
                    order: i
                });
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'IMG') {
                tempSequence.push({
                    type: 'image',
                    content: node.src,
                    order: i,
                    element: node.cloneNode(true)
                });
            } else if (node.tagName === 'SPAN') {
                const text = node.textContent.trim();
                if (text) {
                    tempSequence.push({
                        type: 'text',
                        content: text,
                        order: i
                    });
                }
            }
        }
    }
    
    // 按order排序确保顺序
    tempSequence.sort((a, b) => a.order - b.order);
    
    // 根据分段模式处理文本
    for (let item of tempSequence) {
        if (item.type === 'text') {
            const segments = segmentText(item.content, segmentMode);
            segments.forEach(segment => {
                window.ultimateContentSequence.push({
                    type: 'text',
                    content: segment,
                    id: generateUniqueId()
                });
            });
        } else {
            window.ultimateContentSequence.push({
                type: 'image',
                content: item.content,
                element: item.element,
                id: generateUniqueId()
            });
        }
    }
    
    console.log(`✅ 同步模式解析完成，共 ${window.ultimateContentSequence.length} 个元素`);
}

// 手动模式解析
async function parseManualMode(pasteArea, segmentMode) {
    console.log('✋ 使用手动模式解析...');
    
    // 先用同步模式解析
    await parseSyncMode(pasteArea, segmentMode);
    
    // 自动启用编辑模式
    toggleEditMode(true);
    
    showUltimateToast('✋ 手动模式已启用，可以拖拽调整顺序', 'info');
}

// 智能模式解析
async function parseSmartMode(pasteArea, segmentMode) {
    console.log('🧠 使用智能模式解析...');
    
    // 先用同步模式解析
    await parseSyncMode(pasteArea, segmentMode);
    
    // 智能重排
    performSmartArrange();
}

// 保持原始模式解析
async function parsePreserveMode(pasteArea) {
    console.log('📄 使用保持原始模式解析...');
    
    const children = Array.from(pasteArea.childNodes);
    
    children.forEach((node, index) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text && text !== '直接粘贴图文内容到这里...') {
                window.ultimateContentSequence.push({
                    type: 'text',
                    content: text,
                    id: generateUniqueId()
                });
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'IMG') {
                window.ultimateContentSequence.push({
                    type: 'image',
                    content: node.src,
                    element: node.cloneNode(true),
                    id: generateUniqueId()
                });
            } else if (node.tagName === 'SPAN') {
                const text = node.textContent.trim();
                if (text) {
                    window.ultimateContentSequence.push({
                        type: 'text',
                        content: text,
                        id: generateUniqueId()
                    });
                }
            }
        }
    });
}

// 分段文本
function segmentText(text, mode) {
    switch (mode) {
        case 'paragraph':
            return text.split(/\n\s*\n/).filter(s => s.trim());
        case 'sentence':
            const sentences = text.split(/[。！？.!?]\s*/).filter(s => s.trim());
            return sentences.map((s, i) => {
                if (i < sentences.length - 1 && !s.match(/[。！？.!?]$/)) {
                    return s + '。';
                }
                return s;
            });
        case 'auto':
            // 智能分割：段落优先，长段落按句子分割
            const paragraphs = text.split(/\n\s*\n/).filter(s => s.trim());
            const result = [];
            paragraphs.forEach(para => {
                if (para.length > 200) {
                    const sentences = para.split(/[。！？.!?]\s*/).filter(s => s.trim());
                    sentences.forEach((s, i) => {
                        if (i < sentences.length - 1 && !s.match(/[。！？.!?]$/)) {
                            result.push(s + '。');
                        } else {
                            result.push(s);
                        }
                    });
                } else {
                    result.push(para);
                }
            });
            return result;
        case 'custom':
            // 自定义分割逻辑
            return [text]; // 简单处理，可以扩展
        default:
            return [text];
    }
}

// 更新内容编辑器
function updateContentEditor() {
    const editor = document.getElementById('ultimate-content-editor');
    const countDisplay = document.getElementById('ultimate-content-count');
    
    if (!window.ultimateContentSequence || window.ultimateContentSequence.length === 0) {
        editor.innerHTML = '<div style="text-align: center; color: #9ca3af; padding: 40px 20px; font-style: italic;">等待解析内容...</div>';
        countDisplay.textContent = '0 项内容';
        return;
    }
    
    let editorHTML = '<div style="padding: 15px;">';
    
    window.ultimateContentSequence.forEach((item, index) => {
        const isEditMode = window.isEditMode;
        const dragHandles = isEditMode ? `
            <div class="drag-handle" style="position: absolute; left: -10px; top: 50%; transform: translateY(-50%); cursor: grab; background: #6b7280; color: white; width: 20px; height: 30px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px;">⋮⋮</div>
            <button class="delete-btn" style="position: absolute; right: -10px; top: -10px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center;">×</button>
        ` : '';
        
        if (item.type === 'text') {
            const preview_text = item.content.length > 80 ? item.content.substring(0, 80) + '...' : item.content;
            editorHTML += `
                <div class="content-item" data-id="${item.id}" data-index="${index}" style="position: relative; margin-bottom: 12px; padding: 15px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6; transition: all 0.2s ease; ${isEditMode ? 'cursor: move;' : ''}">
                    ${dragHandles}
                    <div style="font-size: 12px; color: #1e40af; font-weight: 600; margin-bottom: 6px;">📝 文本 #${index + 1}</div>
                    <div style="font-size: 14px; line-height: 1.5; color: #1e293b; word-break: break-word;">${preview_text}</div>
                </div>
            `;
        } else if (item.type === 'image') {
            editorHTML += `
                <div class="content-item" data-id="${item.id}" data-index="${index}" style="position: relative; margin-bottom: 12px; padding: 15px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981; transition: all 0.2s ease; ${isEditMode ? 'cursor: move;' : ''}">
                    ${dragHandles}
                    <div style="font-size: 12px; color: #059669; font-weight: 600; margin-bottom: 8px;">🖼️ 图片 #${index + 1}</div>
                    <img src="${item.content}" style="max-width: 100%; height: auto; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                </div>
            `;
        }
    });
    
    editorHTML += '</div>';
    editor.innerHTML = editorHTML;
    countDisplay.textContent = `${window.ultimateContentSequence.length} 项内容`;
    
    // 如果是编辑模式，绑定拖拽事件
    if (window.isEditMode) {
        setupDragAndDrop();
    }
}

// 切换编辑模式
function toggleEditMode(force = null) {
    const toolbar = document.getElementById('editor-toolbar');
    const toggleBtn = document.getElementById('toggle-edit-mode');
    
    if (force !== null) {
        window.isEditMode = force;
    } else {
        window.isEditMode = !window.isEditMode;
    }
    
    if (window.isEditMode) {
        toolbar.style.display = 'block';
        toggleBtn.textContent = '📝 退出编辑';
        toggleBtn.style.background = '#ef4444';
        showUltimateToast('✏️ 编辑模式已启用', 'info');
    } else {
        toolbar.style.display = 'none';
        toggleBtn.textContent = '✏️ 编辑模式';
        toggleBtn.style.background = '#f59e0b';
        showUltimateToast('👁️ 预览模式已启用', 'info');
    }
    
    // 更新编辑器显示
    updateContentEditor();
}

// 设置拖拽功能
function setupDragAndDrop() {
    const items = document.querySelectorAll('.content-item');
    
    items.forEach(item => {
        item.draggable = true;
        
        item.addEventListener('dragstart', (e) => {
            window.draggedElement = item;
            item.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
        });
        
        item.addEventListener('dragend', (e) => {
            item.style.opacity = '1';
            window.draggedElement = null;
        });
        
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            if (window.draggedElement && window.draggedElement !== item) {
                // 重新排序
                const draggedIndex = parseInt(window.draggedElement.dataset.index);
                const targetIndex = parseInt(item.dataset.index);
                
                // 移动数组中的元素
                const draggedItem = window.ultimateContentSequence.splice(draggedIndex, 1)[0];
                window.ultimateContentSequence.splice(targetIndex, 0, draggedItem);
                
                // 更新显示
                updateContentEditor();
                
                showUltimateToast('🔄 顺序已调整', 'success');
            }
        });
        
        // 删除按钮
        const deleteBtn = item.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(item.dataset.index);
                window.ultimateContentSequence.splice(index, 1);
                updateContentEditor();
                showUltimateToast('🗑️ 项目已删除', 'info');
            });
        }
    });
}

// 执行智能排版
function performSmartArrange() {
    if (!window.ultimateContentSequence || window.ultimateContentSequence.length === 0) {
        showUltimateToast('⚠️ 没有内容可以排版', 'warning');
        return;
    }
    
    showUltimateToast('🧠 正在执行智能排版...', 'info');
    
    // 分离文本和图片
    const textItems = window.ultimateContentSequence.filter(item => item.type === 'text');
    const imageItems = window.ultimateContentSequence.filter(item => item.type === 'image');
    
    if (imageItems.length === 0) {
        showUltimateToast('ℹ️ 没有图片需要排版', 'info');
        return;
    }
    
    // 智能排版策略：图片穿插到文本之间
    const newSequence = [];
    const imageInterval = Math.max(1, Math.floor(textItems.length / imageItems.length));
    
    let textIndex = 0;
    let imageIndex = 0;
    
    while (textIndex < textItems.length || imageIndex < imageItems.length) {
        // 添加文本（根据间隔）
        for (let i = 0; i < imageInterval && textIndex < textItems.length; i++) {
            newSequence.push(textItems[textIndex]);
            textIndex++;
        }
        
        // 添加图片
        if (imageIndex < imageItems.length) {
            newSequence.push(imageItems[imageIndex]);
            imageIndex++;
        }
    }
    
    // 添加剩余的文本
    while (textIndex < textItems.length) {
        newSequence.push(textItems[textIndex]);
        textIndex++;
    }
    
    window.ultimateContentSequence = newSequence;
    updateContentEditor();
    
    showUltimateToast('✨ 智能排版完成！图片已合理穿插', 'success');
}

// 添加文本元素
function addTextElement() {
    const text = prompt('请输入要添加的文本内容：');
    if (text && text.trim()) {
        window.ultimateContentSequence.push({
            type: 'text',
            content: text.trim(),
            id: generateUniqueId()
        });
        updateContentEditor();
        showUltimateToast('✅ 文本已添加', 'success');
    }
}

// 添加图片元素
function addImageElement() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                window.ultimateContentSequence.push({
                    type: 'image',
                    content: e.target.result,
                    id: generateUniqueId()
                });
                updateContentEditor();
                showUltimateToast('✅ 图片已添加', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// 清空所有内容
function clearAllContent() {
    if (confirm('确定要清空所有内容吗？')) {
        window.ultimateContentSequence = [];
        updateContentEditor();
        
        // 清空粘贴区域
        const pasteArea = document.getElementById('ultimate-paste-area');
        pasteArea.innerHTML = '<span style="color: #9ca3af; font-style: italic;">直接粘贴图文内容到这里...</span>';
        
        // 禁用发送按钮
        const sendBtn = document.getElementById('ultimate-start-sequence');
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.7';
        
        showUltimateToast('🗑️ 所有内容已清空', 'info');
    }
}

// 开始发送序列
async function startUltimateSequence() {
    if (!window.ultimateContentSequence || window.ultimateContentSequence.length === 0) {
        showUltimateToast('⚠️ 没有内容可发送', 'warning');
        return;
    }
    
    const typingSpeed = parseInt(document.getElementById('ultimate-typing-speed').value);
    const sendInterval = parseInt(document.getElementById('ultimate-send-interval').value);
    
    // 禁用发送按钮
    const sendBtn = document.getElementById('ultimate-start-sequence');
    sendBtn.disabled = true;
    sendBtn.textContent = '🚀 发送中...';
    sendBtn.style.opacity = '0.7';
    
    showUltimateToast('🚀 开始发送序列...', 'info');
    
    try {
        // 清空聊天输入框
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.value = '';
            chatInput.dispatchEvent(new Event('input'));
        }
        
        // 按序列发送
        for (let i = 0; i < window.ultimateContentSequence.length; i++) {
            const item = window.ultimateContentSequence[i];
            
            showUltimateToast(`📤 正在发送第 ${i + 1}/${window.ultimateContentSequence.length} 项`, 'info');
            
            if (item.type === 'text') {
                await simulateUltimateTyping(item.content, typingSpeed);
            } else if (item.type === 'image') {
                await simulateUltimateImageSend(item.content);
            }
            
            // 等待发送间隔
            if (i < window.ultimateContentSequence.length - 1) {
                await new Promise(resolve => setTimeout(resolve, sendInterval));
            }
        }
        
        showUltimateToast('✅ 所有内容发送完成！', 'success');
        
    } catch (error) {
        console.error('发送过程中出错:', error);
        showUltimateToast('❌ 发送过程中出现错误', 'error');
    } finally {
        // 恢复发送按钮
        sendBtn.disabled = false;
        sendBtn.textContent = '🚀 开始发送';
        sendBtn.style.opacity = '1';
    }
}

// 模拟打字
function simulateUltimateTyping(text, speed) {
    return new Promise((resolve) => {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput) {
            console.error('未找到聊天输入框');
            resolve();
            return;
        }
        
        chatInput.value = '';
        chatInput.focus();
        
        let index = 0;
        function typeNextChar() {
            if (index < text.length) {
                chatInput.value += text.charAt(index);
                chatInput.dispatchEvent(new Event('input'));
                chatInput.selectionStart = chatInput.selectionEnd = chatInput.value.length;
                index++;
                setTimeout(typeNextChar, speed);
            } else {
                setTimeout(() => {
                    const sendButton = document.querySelector('#btn_send, .send-button, [data-testid="send-button"]');
                    if (sendButton) {
                        sendButton.click();
                    } else {
                        const enterEvent = new KeyboardEvent('keydown', {
                            key: 'Enter',
                            keyCode: 13,
                            which: 13,
                            bubbles: true,
                            cancelable: true
                        });
                        chatInput.dispatchEvent(enterEvent);
                    }
                    resolve();
                }, 300);
            }
        }
        
        typeNextChar();
    });
}

// 模拟图片发送
function simulateUltimateImageSend(imageDataUrl) {
    return new Promise((resolve) => {
        fetch(imageDataUrl)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'image.png', { type: 'image/png' });
                
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;
                    
                    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    setTimeout(() => {
                        const sendButton = document.querySelector('#btn_send, .send-button, [data-testid="send-button"]');
                        if (sendButton) {
                            sendButton.click();
                        }
                        resolve();
                    }, 1500);
                } else {
                    console.warn('未找到文件上传输入框');
                    resolve();
                }
            })
            .catch(error => {
                console.error('处理图片时出错:', error);
                resolve();
            });
    });
}

// 预览序列
function previewSequence() {
    if (!window.ultimateContentSequence || window.ultimateContentSequence.length === 0) {
        showUltimateToast('⚠️ 没有内容可预览', 'warning');
        return;
    }
    
    const previewWindow = window.open('', '_blank', 'width=600,height=800');
    let previewHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>发送序列预览</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; line-height: 1.6; }
                .item { margin-bottom: 20px; padding: 15px; border-radius: 8px; }
                .text-item { background: #eff6ff; border-left: 4px solid #3b82f6; }
                .image-item { background: #f0fdf4; border-left: 4px solid #10b981; }
                .item-header { font-size: 12px; font-weight: 600; margin-bottom: 8px; }
                img { max-width: 100%; height: auto; border-radius: 6px; }
            </style>
        </head>
        <body>
            <h1>📋 发送序列预览</h1>
            <p>共 ${window.ultimateContentSequence.length} 项内容</p>
    `;
    
    window.ultimateContentSequence.forEach((item, index) => {
        if (item.type === 'text') {
            previewHTML += `
                <div class="item text-item">
                    <div class="item-header">📝 文本 #${index + 1}</div>
                    <div>${item.content}</div>
                </div>
            `;
        } else if (item.type === 'image') {
            previewHTML += `
                <div class="item image-item">
                    <div class="item-header">🖼️ 图片 #${index + 1}</div>
                    <img src="${item.content}" alt="图片 ${index + 1}">
                </div>
            `;
        }
    });
    
    previewHTML += `
        </body>
        </html>
    `;
    
    previewWindow.document.write(previewHTML);
    previewWindow.document.close();
}

// 处理拖拽
function handleUltimateDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    const pasteArea = event.currentTarget;
    pasteArea.style.borderColor = '#3b82f6';
    pasteArea.style.background = '#eff6ff';
}

function handleUltimateDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const pasteArea = event.currentTarget;
    pasteArea.style.borderColor = '#10b981';
    pasteArea.style.background = '#f0fdf4';
    
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
        if (pasteArea.textContent === '直接粘贴图文内容到这里...') {
            pasteArea.innerHTML = '';
        }
        
        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                insertUltimateImage(pasteArea, e.target.result, `拖拽图片: ${file.name}`);
            };
            reader.readAsDataURL(file);
        });
        
        showUltimateToast(`✅ 已添加 ${imageFiles.length} 张图片`, 'success');
    }
}

// 插入图片
function insertUltimateImage(pasteArea, src, alt = '图片') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 100%;
        height: auto;
        margin: 10px 0;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        display: block;
    `;
    
    pasteArea.appendChild(document.createElement('br'));
    pasteArea.appendChild(img);
    pasteArea.appendChild(document.createElement('br'));
}

// 更新预览
function updateUltimatePreview() {
    // 这里可以添加实时预览逻辑
    console.log('预览已更新');
}

// 显示通知
function showUltimateToast(message, type = 'info') {
    const existingToast = document.getElementById('ultimate-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.id = 'ultimate-toast';
    
    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: ${colors[type]};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 600;
        max-width: 350px;
        animation: slideInRightUltimate 0.3s ease-out;
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOutRightUltimate 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// 生成唯一ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 拖拽功能
function makeDraggableUltimate(element, handle) {
    let isDragging = false;
    let offsetX, offsetY;
    
    handle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    function startDrag(e) {
        isDragging = true;
        const rect = element.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        element.style.left = (e.clientX - offsetX) + 'px';
        element.style.top = (e.clientY - offsetY) + 'px';
    }
    
    function stopDrag() {
        isDragging = false;
    }
}

// 添加CSS动画
const ultimateStyle = document.createElement('style');
ultimateStyle.textContent = `
    @keyframes slideInRightUltimate {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRightUltimate {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .content-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .drag-handle:hover {
        background: #4b5563 !important;
    }
    
    .delete-btn:hover {
        background: #dc2626 !important;
    }
`;
document.head.appendChild(ultimateStyle);

// 启动终极模拟器
createUltimateUserSimulator();
console.log('🚀 终极图文发送器 v2.1 已创建！');