// ==UserScript==
// @name         Whatslink磁力预览
// @namespace    http://whatslink.info/
// @version      2.9.1
// @description  在磁力链接后添加标识符号，通过点击或悬停显示完整链接信息,如果选中的文本中包含磁力链接或磁力链接特征码,在附近添加悬浮标志,悬停预览链接内容
// @author       sexjpg
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      whatslink.info
// @require      https://cdn.jsdelivr.net/npm/qrcode@1/build/qrcode.min.js
// @match        *://*/*

// @noframes
// @run-at       document-end

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/544637/Whatslink%E7%A3%81%E5%8A%9B%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/544637/Whatslink%E7%A3%81%E5%8A%9B%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置参数
    const CONFIG = {
        delay: 500, // 悬浮延迟时间（毫秒）
        cacheTTL: 1*24*60 * 60 * 1000, // 缓存有效期（天）
        indicator_innerhtml: '🧲'
    };

    // 缓存对象,使用{}
    const magnetCache = GM_getValue('magnetCache', {});

    // 创建悬浮框容器
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
    position: fixed;
    max-width: 400px;
    min-width: 300px;
    padding: 15px;
    background: rgba(0, 0, 0, 0.95);
    color: #fff;
    border-radius: 8px;
    font-size: 14px;
    font-family: Arial, sans-serif;
    z-index: 9999;
    pointer-events: auto; /* 修改为 auto，允许鼠标事件 */
    word-break: break-all;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    transform: scale(0.95);
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    display: none;
`;

    // 新增：创建图片放大预览容器
    const imageModal = document.createElement('div');
    imageModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    cursor: zoom-out;
`;

    const modalImage = document.createElement('img');
    modalImage.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    cursor: auto;
`;

    // 添加左右切换按钮
    const prevButton = document.createElement('div');
    // prevButton.innerHTML = '&#10094;';
    prevButton.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 25vw;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        color: white;
        cursor: pointer;
        user-select: none;
        z-index: 10001;
        opacity: 0.3;
        transition: opacity 0.3s ease;
    `;


    const nextButton = document.createElement('div');
    // nextButton.innerHTML = '&#10095;';
    nextButton.style.cssText = `
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 25vw;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        color: white;
        cursor: pointer;
        user-select: none;
        z-index: 10001;
        opacity: 0.3;
        transition: opacity 0.3s ease;
    `;
        // 鼠标悬停时增加透明度
    prevButton.addEventListener('mouseenter', () => {
        prevButton.style.opacity = '0.7';
    });
    prevButton.addEventListener('mouseleave', () => {
        prevButton.style.opacity = '0.3';
    });
    nextButton.addEventListener('mouseenter', () => {
        nextButton.style.opacity = '0.7';
    });
    nextButton.addEventListener('mouseleave', () => {
        nextButton.style.opacity = '0.3';
    });

    imageModal.appendChild(prevButton);
    imageModal.appendChild(nextButton);
    imageModal.appendChild(modalImage);
    document.body.appendChild(imageModal);

    // 点击模态框关闭
    imageModal.addEventListener('click', (e) => {
        // 只有点击模态框背景时才关闭，点击按钮或图片时不关闭
        if (e.target === imageModal) {
            imageModal.style.display = 'none';
        }
    });

    // 新增变量用于控制 tooltip 状态
    let tooltipHideTimer = null;
    let isTooltipHovered = false;

    // 存储当前tooltip中的截图信息
    let currentScreenshots = [];
    let currentScreenshotIndex = 0;

    document.body.appendChild(tooltip);

    // 磁力链接检测正则
    const magnetRegex = /^magnet:\?xt=urn:btih:([a-fA-F0-9]{40})(?:&|$)/i;

    // 标识符号样式
    const indicatorStyle = `
        display: inline-block;
        width: 16px;
        height: 16px;
        background: #007bff;
        border-radius: 50%;
        color: white;
        text-align: center;
        font-size: 12px;
        margin-left: 4px;
        cursor: progress;
        user-select: none;
        vertical-align: middle;
        transition: all 0.2s ease;
    `;

    // 获取磁力链接特征码
    function getMagnetHash(magnetLink) {
        const match = magnetLink.match(magnetRegex);
        return match ? match[1].toLowerCase() : null;
    }

    // API请求函数（修正GET请求方式）
    function fetchMagnetInfo(magnetLink, callback) {
        try {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://whatslink.info/api/v1/link?url=${magnetLink}`,
                headers: { 'Content-Type': "text/plain", 
                            'referer':'https://whatslink.info/'},
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        console.debug('网络请求数据', data);
                        // 只缓存有效数据,有数据,且数据无错误,且文件类型不为空
                        if (data && !data.error && data.file_type) {
                            const hash = getMagnetHash(magnetLink);
                            if (hash) {
                                magnetCache[hash] = {
                                    data: data,
                                    expiresAt: Date.now() + CONFIG.cacheTTL
                                };
                                // 保存缓存
                                console.debug('更新缓存', magnetCache[hash]);
                                GM_setValue('magnetCache', magnetCache);
                                console.debug('更新缓存完成,总缓存数量:', Object.keys(magnetCache).length);
                            }
                        }

                        callback(null, data);
                    } catch (error) {
                        callback(new Error('解析响应数据失败: ' + error.message));
                    }
                },
                onerror: function (error) {
                    callback(new Error('API请求失败: ' + error.statusText));
                }
            });
        } catch (error) {
            callback(new Error('请求异常: ' + error.message));
        }
    }

    // 检查缓存
    function checkCache(magnetLink) {
        const hash = getMagnetHash(magnetLink);
        console.debug('开始检索缓存,缓存总量', Object.keys(magnetCache).length, magnetCache);
        console.debug('检索特征码', hash);
        if (!hash || !magnetCache[hash]) {
            console.debug('缓存中未检索到特征码:', hash);
            return null
        };

        // 检查缓存是否过期
        if (Date.now() > magnetCache[hash].expiresAt) {
            delete magnetCache[hash];
            console.debug('缓存特征码过期', hash);
            return null;
        }
        console.debug('获取缓存数据', magnetCache[hash]);
        return magnetCache[hash].data;
    }

    // 数据展示函数
    function renderMagnetInfo(data) {
        let html = `
            <div style="margin-bottom: 10px;">
                <strong style="font-size: 16px; word-break: break-word;">${data.name || '未知名称'}</strong>
            </div>
            <div id="magnet-qrcode" style="text-align: center; margin-top: 10px;"></div>
            <div style="margin-bottom: 8px;">
                <span>类型：</span>
                <span style="color: #17a2b8;">${data.type || '未知类型'}</span>
            </div>
            <div style="margin-bottom: 8px;">
                <span>文件类型：</span>
                <span style="color: #ffc107;">${data.file_type || '未知文件类型'}</span>
            </div>
            <div style="margin-bottom: 8px;">
                <span>大小：</span>
                <span style="color: #28a745;">${formatFileSize(data.size) || '未知大小'}</span>
            </div>
            <div style="margin-bottom: 8px;">
                <span>文件数：</span>
                <span style="color: #dc3545;">${data.count || 0}</span>
            </div>
        `;

        if (data.screenshots && data.screenshots.length > 0) {
            html += `<div style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 5px;">`;
            data.screenshots.slice(0, 5).forEach(screenshot => {
                html += `
                    <div style="flex: 1 1 45%; min-width: 100px; cursor: zoom-in;" class="screenshot-item" data-src="${screenshot.screenshot}">
                        <img src="${screenshot.screenshot}" 
                             style="width: 100%; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
                    </div>
                `;
            });
            html += `</div>`;
        }

        // html += `<div id="magnet-qrcode" style="text-align: center; margin-top: 10px;"></div>`;

        return html;
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === undefined || bytes === null) return '未知大小';
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 新增：生成二维码函数
    function generateQrCode(magnetLink) {
        const qrElement = tooltip.querySelector('#magnet-qrcode');
        if (qrElement) {
            qrElement.innerHTML = ''; // 清除之前的二维码
            QRCode.toCanvas(magnetLink, { width: 128, margin: 1, errorCorrectionLevel: 'L' }, function (error, canvas) {
                if (error) {
                    console.error(error);
                    qrElement.textContent = 'QR Code Error';
                } else {
                    canvas.style.width = "128px";
                    canvas.style.height = "128px";
                    qrElement.appendChild(canvas);
                }
            });
        }
    }

    // 显示悬浮框的核心逻辑
    function showTooltip(magnetLink, event) {
        // 检查缓存
        const cachedData = checkCache(magnetLink);
        if (cachedData) {
            // 使用缓存数据
            tooltip.innerHTML = renderMagnetInfo(cachedData);
            updateTooltipPosition(event);
            tooltip.style.display = 'block';
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'scale(1)';
            
            // 新增：为截图添加点击放大事件
            addScreenshotClickEvents(cachedData.screenshots || []);
            // 新增：生成二维码
            generateQrCode(magnetLink);
            return;
        }

        // 显示加载状态
        tooltip.innerHTML = '<div style="text-align: center; padding: 10px;">加载中...</div>';
        tooltip.style.display = 'block';
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'scale(1)';
        updateTooltipPosition(event);

        // 请求API数据
        fetchMagnetInfo(magnetLink, (error, data) => {
            if (error) {
                tooltip.innerHTML = `<div style="color: #dc3545; text-align: center; padding: 10px;">${error.message}</div>`;
            } else {
                tooltip.innerHTML = renderMagnetInfo(data);
                
                // 新增：为截图添加点击放大事件
                addScreenshotClickEvents(data.screenshots || []);
                // 新增：生成二维码
                generateQrCode(magnetLink);
            }
            updateTooltipPosition(event);
        });

    }

    // 新增：为截图添加点击放大事件的函数
    function addScreenshotClickEvents(screenshots) {
        const screenshotItems = tooltip.querySelectorAll('.screenshot-item');
        screenshotItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const src = item.getAttribute('data-src');
                modalImage.src = src;
                imageModal.style.display = 'flex';
                
                // 保存当前截图信息
                currentScreenshots = screenshots;
                currentScreenshotIndex = index;
                
                // 根据是否有前后图片决定是否显示按钮
                updateNavigationButtons();
            });
        });
    }
    
    // 更新导航按钮状态
    function updateNavigationButtons() {
        prevButton.style.display = 'block'
        nextButton.style.display = 'block'
        // prevButton.style.display = currentScreenshotIndex > 0 ? 'block' : 'none';
        // nextButton.style.display = currentScreenshotIndex < currentScreenshots.length - 1 ? 'block' : 'none';
    }


// 切换到上一张图片
function showPrevImage() {
    if (currentScreenshotIndex > 0) {
        currentScreenshotIndex--;
    } else {
        // 新增：循环到最后一张
        currentScreenshotIndex = currentScreenshots.length - 1;
    }
    modalImage.src = currentScreenshots[currentScreenshotIndex].screenshot;
    updateNavigationButtons();
}

// 切换到下一张图片
function showNextImage() {
    if (currentScreenshotIndex < currentScreenshots.length - 1) {
        currentScreenshotIndex++;
    } else {
        // 新增：循环到第一张
        currentScreenshotIndex = 0;
    }
    modalImage.src = currentScreenshots[currentScreenshotIndex].screenshot;
    updateNavigationButtons();
}


    // 绑定左右按钮点击事件
    prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });

    nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });

    // 支持键盘左右键切换
    imageModal.addEventListener('keydown', (e) => {
        if (imageModal.style.display !== 'none') {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });

    // 更新悬浮框位置
    function updateTooltipPosition(e) {
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        let x = e.clientX + 15;
        //本身是y = e.clientY + 15,改为往上调整15个像素
        let y = e.clientY - 15;

        // 防止超出右侧视口
        if (x + tooltipRect.width > viewportWidth - 20) {
            x = e.clientX - tooltipRect.width - 15;
        }

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }

    // 处理单个链接元素
    function processLink(link) {
        // 检查是否是磁力链接且未被处理过
        if (link.dataset.magnetProcessed || !magnetRegex.test(link.href)) {
            return;
        }
        link.dataset.magnetProcessed = 'true'; // 标记为已处理

        let timer = null;
        let isHovered = false; // 新增悬停状态

        const indicator = document.createElement('span');
        indicator.innerHTML = CONFIG.indicator_innerhtml;
        indicator.style.cssText = indicatorStyle;
        link.appendChild(indicator);

        // 鼠标进入事件
        indicator.addEventListener('mouseenter', (e) => {
            clearTimeout(tooltipHideTimer); // 清除之前的隐藏计时器
            timer = setTimeout(() => {
                showTooltip(link.href, e);
            }, CONFIG.delay);
        });

        indicator.addEventListener('mouseleave', () => {
            clearTimeout(timer); // 取消未触发的显示
            // 不再立即隐藏 tooltip，交给 tooltip 自己控制
        });

        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            clearTimeout(timer);
            showTooltip(link.href, e);
        });

        tooltip.addEventListener('mouseenter', () => {
            isTooltipHovered = true;
            clearTimeout(tooltipHideTimer);
        });

        tooltip.addEventListener('mouseleave', () => {
            isTooltipHovered = false;
            tooltipHideTimer = setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    tooltip.style.display = 'none';
                }, 300); // 与 transition 时间匹配
            }, CONFIG.delay);
        });
    }

    // 新增：处理选中文本中的磁力链接
    function processSelectedText() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;
        
        const range = selection.getRangeAt(0);
        // const selectedText = range.toString().trim();
        
        // 修改这行代码，移除所有空白字符（包括空格、换行符、制表符等）
        const selectedText = range.toString().replace(/\s/g, '');

        console.debug('选中文字:', selectedText);
        
        // 新增：检查是否为40位十六进制字符串
        const hexHashRegex = /^[a-fA-F0-9]{40}$/;
        let processedText = selectedText;
        let isMagnetLink = magnetRegex.test(selectedText);
        
        // 如果是40位十六进制字符串，构造完整磁力链接
        if (hexHashRegex.test(selectedText)) {
            processedText = `magnet:?xt=urn:btih:${selectedText}`;
            isMagnetLink = true;
        }
        
        // 检查选中的文本是否是磁力链接
        if (isMagnetLink) {
            // 检查是否已经添加过指示器
            const existingIndicator = document.getElementById('magnet-selection-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            // 创建指示器
            const indicator = document.createElement('span');
            indicator.id = 'magnet-selection-indicator';
            indicator.innerHTML = CONFIG.indicator_innerhtml;
            indicator.style.cssText = indicatorStyle;
            
            // 在选中文本末尾插入指示器
            const rect = range.getBoundingClientRect();
            indicator.style.position = 'fixed';
            indicator.style.left = `${rect.right + 5}px`;
            // indicator.style.top = `${rect.top + window.scrollY}px`;
            indicator.style.top = `${rect.top}px`;
            indicator.style.zIndex = '99999';
            
            document.body.appendChild(indicator);
            
            let timer = null;
            let isTooltipShownByThisIndicator = false; // 标记这个指示器是否显示了tooltip
            
            // 添加事件监听
            indicator.addEventListener('mouseenter', (e) => {
                clearTimeout(tooltipHideTimer);
                timer = setTimeout(() => {
                    showTooltip(processedText, e);
                    isTooltipShownByThisIndicator = true;
                }, CONFIG.delay);
            });
            
            indicator.addEventListener('mouseleave', () => {
                clearTimeout(timer);
                // 如果这个指示器显示了tooltip，则添加mouseleave处理逻辑
                if (isTooltipShownByThisIndicator) {
                    tooltipHideTimer = setTimeout(() => {
                        tooltip.style.opacity = '0';
                        tooltip.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            tooltip.style.display = 'none';
                        }, 300);
                    }, CONFIG.delay);
                }
            });
            
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                clearTimeout(timer);
                showTooltip(processedText, e);
                isTooltipShownByThisIndicator = true;
            });
            
            // 当选择改变时移除指示器
            document.addEventListener('selectionchange', function removeIndicator() {
                if (document.getElementById('magnet-selection-indicator')) {
                    document.getElementById('magnet-selection-indicator').remove();
                }
                document.removeEventListener('selectionchange', removeIndicator);
            }, { once: true });


        tooltip.addEventListener('mouseenter', () => {
            isTooltipHovered = true;
            clearTimeout(tooltipHideTimer);
        });

        tooltip.addEventListener('mouseleave', () => {
            isTooltipHovered = false;
            tooltipHideTimer = setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    tooltip.style.display = 'none';
                }, 300); // 与 transition 时间匹配
            }, CONFIG.delay);
        });
        }
    }

    // 使用 MutationObserver 监听动态内容
    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    // 只处理元素节点
                    if (node.nodeType === 1) {
                        // 检查节点本身是否是链接
                        if (node.tagName === 'A') {
                            processLink(node);
                        }
                        // 检查节点下的所有链接
                        node.querySelectorAll('a').forEach(processLink);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始执行 + 启动监听
    document.querySelectorAll('a').forEach(processLink); // 处理页面已有的链接
    observeDOMChanges(); // 监听后续动态添加的链接
    
    // 监听鼠标抬起事件，用于检测选中文本
    document.addEventListener('mouseup', processSelectedText);
})();