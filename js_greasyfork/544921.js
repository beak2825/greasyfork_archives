// ==UserScript==
// @name         网页图片采集器
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @description  支持动态加载、智能去重、大图预览的网页图片下载工具
// @author       晚风知我意
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @icon         https://cdn-icons-png.flaticon.com/512/2107/2107957.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544921/%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E9%87%87%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/544921/%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E9%87%87%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';
    
    const CONFIG = {
        buttonSize: 30,
        activeColor: '#e74c3c',
        hoverColor: '#c0392b',
        zIndex: 99999,
        positionOffset: 25,
        touchDelay: 300,
        supportFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'],
        maxPreviewSize: 50,
        loadTimeout: 5000,
        infoTruncateLength: 4,
        panelSafeMargin: '20px',
        panelMinSize: '320px',
        defaultImageFormat: 'png',       
        fixedFontSize: '10px',
        scrollCheckInterval: 500,
        clickDetectDelay: 1500,
        clickLoadSelectors: [
            '.load-more', '.load-btn', '.next-page', '.load-more-btn',
            '[data-action="load-more"]', '[class*="load"]', '[class*="more"]',
            '.pagination-next', '.next-btn', '.load-additional'
        ],
        maxBlobUrlCount: 100,
        blobCleanupNotification: true,
        previewZoom: {
            maxWidth: '90vw',
            maxHeight: '80vh',
            background: 'rgba(0,0,0,0.9)',
            closeButtonSize: '40px',
            headerHeight: '60px',
            footerHeight: '70px'
        },
        deduplication: {
            enabled: true,
            similarityThreshold: 0.95,
            checkContent: true,
            maxFileSizeForCheck: 5 * 1024 * 1024,
            urlNormalization: true
        }
    };
    
    GM_addStyle(`
        #svgSnifferModal,
        #svgSnifferModal * {
            font-size: ${CONFIG.fixedFontSize} !important;
            line-height: 1.4 !important; 
        }
        .radar-container {position:fixed;z-index:${CONFIG.zIndex};cursor:move;transition:transform 0.2s;touch-action:none;}
        .radar-button {width:${CONFIG.buttonSize}px;height:${CONFIG.buttonSize}px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#e74c3c,#922b21);box-shadow:0 6px 18px rgba(0,0,0,0.3),0 0 0 4px rgba(255,255,255,0.15),inset 0 0 12px rgba(0,0,0,0.3);cursor:pointer;border:none;outline:none;position:relative;overflow:hidden;user-select:none;-webkit-tap-highlight-color:transparent;animation:pulse 2s infinite;transition:transform 0.3s,box-shadow 0.3s;}
        .radar-button:hover {transform:scale(1.05);box-shadow:0 8px 22px rgba(0,0,0,0.4),0 0 0 4px rgba(255,255,255,0.25),inset 0 0 15px rgba(0,0,0,0.4);}
        .radar-button:active {transform:scale(0.95);}
        .radar-icon {width:24px;height:24px;position:relative;display:flex;justify-content:center;align-items:center;filter:drop-shadow(0 0 2px rgba(255,255,255,0.5));animation:radar-scan 4s linear infinite;}
        .radar-icon svg {width:100%;height:100%;}
       
        #svgSnifferModal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: ${CONFIG.panelSafeMargin};
            max-width: calc(100vw - 2 * ${CONFIG.panelSafeMargin});
            max-height: calc(100vh - 2 * ${CONFIG.panelSafeMargin});
            min-width: ${CONFIG.panelMinSize};
            min-height: ${CONFIG.panelMinSize};
            width: auto;
            height: auto;
            z-index: 10000;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid #ddd;
            display: none;
            flex-direction: column;
            font-family: Arial, sans-serif;
            overflow: hidden;
        }
        .modal-header {
            padding: 12px 20px;
            background:linear-gradient(135deg,#e74c3c,#922b21);
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }
        .modal-header h2 {margin: 0; font-weight: 600;} 
        .close-btn {
            background: none;
            border: none;
            color: #fff;
            font-size: 18px !important; 
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .close-btn:hover {background: rgba(255,255,255,0.2);}
        .action-bar {
            padding: 10px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            flex-wrap: wrap;
            gap: 10px;
        }
        .select-all-control {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .action-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;
        }
        .action-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            white-space: nowrap;
            transition: all 0.2s;
        }
        .download-btn {background: #27ae60;color: #fff;}
        .download-btn:hover {background: #219653;transform: translateY(-2px);}
        .copy-btn {background: #2980b9;color: #fff;}
        .copy-btn:hover {background: #2573a7;transform: translateY(-2px);}
        .dedupe-control {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: 10px;
        }
        .dedupe-toggle {
            width: 16px;
            height: 16px;
            cursor: pointer;
        }
        .dedupe-label {
            color: #666;
            font-size: 12px;
            white-space: nowrap;
        }
        .modal-content {
            padding: 15px;
            overflow-y: auto;
            flex-grow: 1;
            min-height: 0;
        }
        .svg-item {
            display: flex;
            align-items: center;
            padding: 12px;
            border-bottom: 1px solid #eee;
            transition: background 0.2s;
            justify-content: space-between;
            gap: 10px;
            min-width: 0;
        }
        .svg-item:hover {background: #f8fafc;}
        .svg-checkbox {
            width: 18px;
            height: 18px;
            cursor: pointer;
            flex-shrink: 0;
        }
        .svg-preview {
            width: ${CONFIG.maxPreviewSize}px;
            height: ${CONFIG.maxPreviewSize}px;
            border: 1px solid #e0e0e0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            background-image: 
                linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
                linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
                linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
            background-size: 10px 10px;
            background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
            background-color: #f8f8f8;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            overflow: hidden;
            flex-shrink: 0;
            min-width: ${CONFIG.maxPreviewSize}px; 
            min-height: ${CONFIG.maxPreviewSize}px;
            position: relative;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .svg-preview:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .svg-preview svg {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            display: block !important;
            max-width: ${CONFIG.maxPreviewSize}px !important;
            max-height: ${CONFIG.maxPreviewSize}px !important;
        }
        .svg-preview img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            display: block;
        }
        .svg-info {
            flex-grow: 1;
            min-width: 0;
        }
        .svg-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #2c3e50;
            margin-bottom: 3px;
            max-width: 80px; 
        }
        .svg-meta {
            color: #6e6e73;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        .svg-meta span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 80px;
        }
        .item-download-btn {
            padding: 5px 10px;
            background: #e74c3c;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            white-space: nowrap;
            flex-shrink: 0;
            transition: background 0.2s;
        }
        .item-download-btn:hover {background: #c0392b;}
        .overlay {display: none;position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.5);z-index: 9999;}
        
        #imagePreviewModal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${CONFIG.previewZoom.background};
            z-index: 100001;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        }
        .preview-container {
            position: relative;
            width: ${CONFIG.previewZoom.maxWidth};
            height: ${CONFIG.previewZoom.maxHeight};
            display: flex;
            flex-direction: column;
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .preview-header {
            width: 100%;
            height: ${CONFIG.previewZoom.headerHeight};
            padding: 0 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            box-sizing: border-box;
        }
        .preview-title {
            font-weight: 600;
            color: #2c3e50;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: calc(100% - 60px);
        }
        .preview-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6c757d;
            width: ${CONFIG.previewZoom.closeButtonSize};
            height: ${CONFIG.previewZoom.closeButtonSize};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            flex-shrink: 0;
        }
        .preview-close:hover {
            background: #e9ecef;
            color: #495057;
        }
        .preview-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: auto;
            padding: 20px;
            box-sizing: border-box;
            min-height: 0;
        }
        .preview-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 8px;
        }
        .preview-svg {
            max-width: 100%;
            max-height: 100%;
            border-radius: 8px;
        }
        .preview-footer {
            width: 100%;
            height: ${CONFIG.previewZoom.footerHeight};
            padding: 0 20px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            flex-shrink: 0;
            box-sizing: border-box;
        }
        .preview-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 12px;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .preview-download {
            background: #27ae60;
            color: white;
        }
        .preview-download:hover {
            background: #219653;
            transform: translateY(-1px);
        }
        .preview-copy {
            background: #2980b9;
            color: white;
        }
        .preview-copy:hover {
            background: #2573a7;
            transform: translateY(-1px);
        }
        
        .loading {text-align: center;padding: 25px;color: #666;}
        .copy-notification {
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #27ae60;
            color: #fff;
            padding: 10px 20px;
            border-radius: 6px;
            z-index: 100000;
            opacity: 0;
            transition: opacity 0.5s;
            pointer-events: none;
            white-space: nowrap;
            font-weight: 500;
        }
        @keyframes radar-scan {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}
        @keyframes pulse {0% {box-shadow: 0 0 0 0 rgba(231,76,60,0.6);} 70% {box-shadow: 0 0 0 12px rgba(231,76,60,0);} 100% {box-shadow: 0 0 0 0 rgba(231,76,60,0);}}
        .temp-visible-for-scan {display: block !important;visibility: visible !important;opacity: 1 !important;position: absolute !important;top: -9999px !important;left: -9999px !important;width: auto !important;height: auto !important;}
    `);
    const radarContainer = document.createElement('div');
    radarContainer.className = 'radar-container';
    radarContainer.id = 'radarContainer';
    
    const radarButton = document.createElement('div');
    radarButton.className = 'radar-button';
    radarButton.id = 'radarButton';
    radarButton.innerHTML = `
        <div class="radar-icon">
            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.11 21 21 20.1 21 19V5C21 3.9 20.11 3 19 3ZM19 19H5V5H19V19ZM12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12ZM12 8C11.45 8 11 8.45 11 9C11 9.55 11.45 10 12 10C12.55 10 13 9.55 13 9C13 8.45 12.55 8 12 8Z"/>
                <path d="M16.59 16.59L13.7 18.65C13.25 18.96 12.63 19 12 19C11.37 19 10.75 18.96 10.3 18.65L7.41 16.59L8.58 14.41L10.54 15.91C10.91 16.15 11.45 16.15 11.82 15.91L16.59 12.59L17.76 14.41L16.59 16.59Z"/>
            </svg>
        </div>
    `;
    
    radarContainer.appendChild(radarButton);
    document.body.appendChild(radarContainer);
    const svgModal = document.createElement('div');
    svgModal.id = 'svgSnifferModal';
    svgModal.innerHTML = `
        <div class="modal-header">
            <h2>网页图片资源列表（支持动态加载与智能去重）</h2>
            <button class="close-btn">&times;</button>
        </div>
        <div class="action-bar">
            <div class="select-all-control">
                <input type="checkbox" id="selectAll">
                <label for="selectAll">全选（共<span id="imageCount">0</span>张）</label>
            </div>
            <div class="action-buttons">
                <button class="action-btn download-btn" id="batchDownloadBtn">批量下载</button>
                <button class="action-btn copy-btn">复制链接</button>
                <div class="dedupe-control">
                    <input type="checkbox" id="dedupeToggle" class="dedupe-toggle" ${CONFIG.deduplication.enabled ? 'checked' : ''}>
                    <label for="dedupeToggle" class="dedupe-label">智能去重</label>
                </div>
            </div>
        </div>
        <div class="modal-content" id="svgList">
            <div class="loading">正在扫描页面图片资源（含CSS/隐藏元素/动态加载）...</div>
        </div>
    `;
    document.body.appendChild(svgModal);
    const imagePreviewModal = document.createElement('div');
    imagePreviewModal.id = 'imagePreviewModal';
    imagePreviewModal.innerHTML = `
        <div class="preview-container">
            <div class="preview-header">
                <div class="preview-title" id="previewTitle">图片预览</div>
                <button class="preview-close">&times;</button>
            </div>
            <div class="preview-content" id="previewContent">
                <div class="loading">加载中...</div>
            </div>
            <div class="preview-footer">
                <button class="preview-btn preview-download" id="previewDownload">下载图片</button>
                <button class="preview-btn preview-copy" id="previewCopy">复制链接</button>
            </div>
        </div>
    `;
    document.body.appendChild(imagePreviewModal);
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    const copyNotification = document.createElement('div');
    copyNotification.className = 'copy-notification';
    document.body.appendChild(copyNotification);
    let globalImageItems = [];
    let imageItemCache = new Map();
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    let dragStartTime = 0;
    let touchTimer = null;
    let tempVisibleElements = [];
    let scrollTimer = null;
    let lastScrollHeight = document.documentElement.scrollHeight;
    let isClickDetecting = false;
    let blobUrlMap = new Map();
    let currentPreviewItem = null;
    let imageSignatureMap = new Map();
    function truncateTo4Bytes(text) {
        if (!text || typeof text !== 'string') return '';
        let byteCount = 0;
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charBytes = /[\u4e00-\u9fa5]/.test(char) ? 2 : 1;
            if (byteCount + charBytes > CONFIG.infoTruncateLength) break;
            result += char;
            byteCount += charBytes;
            if (byteCount === CONFIG.infoTruncateLength) break;
        }
        return result;
    }
    function completeImageSuffix(fileName, originalFormat) {
        const extMatch = fileName.match(/\.([^.]+)$/);
        const hasValidSuffix = extMatch 
            ? CONFIG.supportFormats.includes(extMatch[1].toLowerCase()) 
            : false;
        if (hasValidSuffix) return fileName;
        const targetFormat = (originalFormat && CONFIG.supportFormats.includes(originalFormat.toLowerCase())) 
            ? originalFormat.toLowerCase() 
            : CONFIG.defaultImageFormat;
        return fileName.endsWith('.') 
            ? `${fileName}${targetFormat}` 
            : `${fileName}.${targetFormat}`;
    }
    function processSVGForPreview(svgContent) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgContent, 'image/svg+xml');
            const svgElement = doc.documentElement;
            svgElement.removeAttribute('width');
            svgElement.removeAttribute('height');
            const viewBox = svgElement.getAttribute('viewBox') || `0 0 ${CONFIG.maxPreviewSize} ${CONFIG.maxPreviewSize}`;
            svgElement.setAttribute('viewBox', viewBox);
            svgElement.setAttribute('style', 'width:100%;height:100%;object-fit:contain;');
            return svgElement.outerHTML;
        } catch (error) {
            console.warn('SVG处理失败，使用原始内容:', error);
            return svgContent;
        }
    }
    function getFileExtension(url) {
        try {
            const path = new URL(url).pathname;
            const lastPart = path.split('/').pop();
            const extMatch = lastPart.match(/\.([^.]+)$/);
            return extMatch ? extMatch[1].toLowerCase() : '';
        } catch {
            return '';
        }
    }
    function getImageName(url, altText) {
        if (altText && altText.trim()) return altText.trim();
        try {
            const path = new URL(url).pathname;
            const fileName = path.split('/').pop().split('?')[0].split('#')[0];
            return fileName || `未知图片-${Date.now().toString().slice(-6)}`;
        } catch {
            return `未知图片-${Date.now().toString().slice(-6)}`;
        }
    }
    function normalizeUrl(url) {
        try {
            const urlObj = new URL(url, window.location.href);
            const paramsToRemove = ['v', 'version', 'ts', 'timestamp', 't', 'time', 'width', 'height', 'size'];
            paramsToRemove.forEach(param => {
                if (urlObj.searchParams.has(param)) {
                    urlObj.searchParams.delete(param);
                }
            });
            return urlObj.href;
        } catch {
            return url;
        }
    }
    async function simpleHash(arrayBuffer) {
        const hashBuffer = await crypto.subtle.digest('SHA-1', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
    }
    async function generateContentSignature(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const contentLength = response.headers.get('content-length');
            if (contentLength && parseInt(contentLength) > CONFIG.deduplication.maxFileSizeForCheck) {
                return 'oversized';
            }
            
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const hash = await simpleHash(arrayBuffer);
            return `content-${hash}`;
        } catch (error) {
            return `error-${error.message}`;
        }
    }
    function normalizeSVGContent(svgContent) {
        if (!svgContent) return '';
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgContent, 'image/svg+xml');
            const svgElement = doc.documentElement;
            
            const attributesToRemove = ['id', 'class', 'style'];
            attributesToRemove.forEach(attr => {
                if (svgElement.hasAttribute(attr)) {
                    svgElement.removeAttribute(attr);
                }
            });
            
            const paths = svgElement.querySelectorAll('path');
            paths.forEach(path => {
                if (path.hasAttribute('d')) {
                    const d = path.getAttribute('d')
                        .replace(/\s+/g, ' ')
                        .replace(/([a-zA-Z])\s+/g, '$1')
                        .trim();
                    path.setAttribute('d', d);
                }
            });
            
            return svgElement.outerHTML;
        } catch (error) {
            console.warn('SVG标准化失败，使用原始内容:', error);
            return svgContent;
        }
    }
    async function generateImageSignature(imgItem) {
        const urlSignature = normalizeUrl(imgItem.url);
        
        if (CONFIG.deduplication.checkContent && 
            !imgItem.url.startsWith('blob:') && 
            !imgItem.url.startsWith('data:')) {
            try {
                const contentSignature = await generateContentSignature(imgItem.url);
                return `${urlSignature}|${contentSignature}`;
            } catch (error) {
                console.warn('内容签名生成失败，使用URL签名:', error);
            }
        }
        
        return urlSignature;
    }
    async function checkAndRemoveDuplicates(newImageItems) {
        if (!CONFIG.deduplication.enabled) {
            return newImageItems;
        }
        const uniqueItems = [];
        const seenSignatures = new Set();
        
        for (const imgItem of newImageItems) {
            try {
                let signature;
                
                if (imgItem.format === 'svg' && imgItem.svgContent) {
                    const normalizedContent = normalizeSVGContent(imgItem.svgContent);
                    signature = await simpleHash(new TextEncoder().encode(normalizedContent));
                    signature = `svg-${signature}`;
                } else {
                    signature = await generateImageSignature(imgItem);
                }
                
                if (!seenSignatures.has(signature)) {
                    seenSignatures.add(signature);
                    imageSignatureMap.set(imgItem.id, signature);
                    uniqueItems.push(imgItem);
                } else {
                    console.log('跳过重复图片:', imgItem.name, imgItem.url);
                }
            } catch (error) {
                console.warn('去重检查失败，保留图片:', imgItem.name, error);
                uniqueItems.push(imgItem);
            }
        }
        
        const removedCount = newImageItems.length - uniqueItems.length;
        if (removedCount > 0) {
            showNotification(`已自动过滤 ${removedCount} 张重复图片`, 'info');
        }
        
        return uniqueItems;
    }
    function createImageItemElement(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'svg-item';
        
        const truncatedTitle = item.name;
        const fullName = item.originalName || truncatedTitle;
        const fullFormat = item.originalFormat || CONFIG.defaultImageFormat;
        const fullType = item.originalType || item.type;
        const completedFileName = completeImageSuffix(fullName, fullFormat);
        
        let previewHtml = '';
        if (item.format === 'svg' && item.svgContent) {
            previewHtml = item.svgContent;
        } else {
            previewHtml = `<img src="${item.preview}" alt="${fullName}" loading="lazy" onError="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTUiIGZpbGw9IiNmNGY0ZjQiLz4KPHBhdGggZD0iTTIwIDI1QzIwIDI1IDIyIDIyIDI1IDIyQzI4IDIyIDMwIDI1IDMwIDI1QzMwIDI1IDI4IDI4IDI1IDI4QzIyIDI4IDIwIDI1IDIwIDI1WiIgc3Ryb2tlPSIjNzc3IiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTMwIDI1QzMwIDI1IDI4IDI4IDI1IDI4QzIyIDI4IDIwIDI1IDIwIDI1QzIwIDI1IDIyIDIyIDI1IDIyQzI4IDIyIDMwIDI1IDMwIDI1WiIgc3Ryb2tlPSIjNzc3IiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTI1IDMwQzI1IDMwIDI1IDM1IDI1IDM1QzI1IDM1IDI1IDMwIDI1IDMwWiIgc3Ryb2tlPSIjNzc3IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg=='">`;
        }
        
        itemElement.innerHTML = `
            <div style="display: flex; align-items: center; min-width: 0; gap: 10px;">
                <input type="checkbox" class="svg-checkbox" data-id="${item.id}" checked>
                <div class="svg-preview" data-img-id="${item.id}">${previewHtml}</div>
                <div class="svg-info">
                    <div class="svg-name" title="文件名：${completedFileName}">${truncatedTitle}</div>
                    <div class="svg-meta">
                        <span title="格式：${fullFormat || CONFIG.defaultImageFormat}">格式: ${item.format}</span>
                        <span title="类型：${fullType}">类型: ${item.type}</span>
                    </div>
                </div>
            </div>
            <button class="item-download-btn" data-img-id="${item.id}" title="下载 ${completedFileName}">下载</button>
        `;
        const previewElement = itemElement.querySelector('.svg-preview');
        previewElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const imgId = e.currentTarget.dataset.imgId;
            const imgItem = imageItemCache.get(imgId);
            if (imgItem) {
                showImagePreview(imgItem);
            }
        });
        const itemDownloadBtn = itemElement.querySelector('.item-download-btn');
        itemDownloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const imgId = e.currentTarget.dataset.imgId;
            const imgItem = imageItemCache.get(imgId);
            if (imgItem) {
                downloadImage(imgItem, imgItem.originalName, imgItem.originalFormat);
            }
        });
        return itemElement;
    }
    function showImagePreview(imgItem) {
        currentPreviewItem = imgItem;
        const modal = document.getElementById('imagePreviewModal');
        const title = document.getElementById('previewTitle');
        const content = document.getElementById('previewContent');
        const downloadBtn = document.getElementById('previewDownload');
        const copyBtn = document.getElementById('previewCopy');
        const closeBtn = modal.querySelector('.preview-close');
        const completedFileName = completeImageSuffix(imgItem.originalName || imgItem.name, imgItem.originalFormat);
        title.textContent = completedFileName;
        content.innerHTML = '<div class="loading">加载中...</div>';
        modal.style.display = 'flex';
        
        // 修复：正确定义预览内容，移除原错误的imgInfo变量引用
        let previewContent = '';
        if (imgItem.format === 'svg' && imgItem.svgContent) {
            const processedSvg = processSVGForPreview(imgItem.svgContent);
            previewContent = `<div class="preview-svg">${processedSvg}</div>`;
        } else {
            previewContent = `<img class="preview-image" src="${imgItem.url}" alt="${completedFileName}" onload="this.style.opacity='1'" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjRmNGY0Ii8+CjxwYXRoIGQ9Ik04MCA4MEM4MCA4MCA4OCA3MCAxMDAgNzBDMTEyIDcwIDEyMCA4MCAxMjAgODBDMTIwIDgwIDExMiA5MCAxMDAgOTBDODggOTAgODAgODAgODAgODBaIiBzdHJva2U9IiM3NzciIHN0cm9rZS13aWR0aD0iNCIvPgo8cGF0aCBkPSJNMTIwIDgwQzEyMCA4MCAxMTIgOTAgMTAwIDkwQzg4IDkwIDgwIDgwIDgwIDgwQzgwIDgwIDg4IDcwIDEwMCA3MEMxMTIgNzAgMTIwIDgwIDEyMCA4MFoiIHN0cm9rZT0iIzc3NyIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzEwMCAxMjAgMTAwIDE0MCAxMDAgMTQwQzEwMCAxNDAgMTAwIDEyMCAxMDAgMTIwWiIgc3Ryb2tlPSIjNzc3IiBzdHJva2Utd2lkdGg9IjQiLz4KPC9zdmc+Cg=='" style="opacity:0;transition:opacity 0.3s">`;
        }
        content.innerHTML = previewContent;
        
        downloadBtn.onclick = () => {
            downloadImage(imgItem, imgItem.originalName, imgItem.originalFormat);
        };
        
        // 修复：优化复制逻辑，补充异常捕获，确保URL正确传递
        previewCopy.onclick = async () => {
    if (!currentPreviewItem || !currentPreviewItem.url) {
        showNotification('复制失败：图片URL不存在', 'error');
        return;
    }
    
    try {
        let urlToCopy = currentPreviewItem.url;
        
        // 对于SVG内容，创建blob URL
        if (currentPreviewItem.format === 'svg' && currentPreviewItem.svgContent) {
            const svgBlob = new Blob([currentPreviewItem.svgContent], { type: 'image/svg+xml' });
            urlToCopy = createManagedBlobUrl(svgBlob);
        }
        
        // 使用更可靠的复制方法
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(urlToCopy);
        } else {
            // 使用备用方法
            const textArea = document.createElement('textarea');
            textArea.value = urlToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (!successful) {
                throw new Error('execCommand 复制失败');
            }
        }
        
        showNotification('图片链接已成功复制到剪贴板', 'success');
    } catch (error) {
        console.error('预览窗口复制链接失败:', error);
        showNotification('复制失败，请重试', 'error');
    }
};
        
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            currentPreviewItem = null;
        };
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                currentPreviewItem = null;
            }
        };
        
        // 修复：确保键盘事件正确绑定与移除
        const handleEscape = function(e) {
            if (e.key === 'Escape') {
                modal.style.display = 'none';
                currentPreviewItem = null;
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    async function detectNewImages() {
        const modal = document.getElementById('svgSnifferModal');
        const svgList = document.getElementById('svgList');
        const imageCountEl = document.getElementById('imageCount');
        if (modal.style.display !== 'flex') return;
        const processedUrls = new Set(globalImageItems.map(item => item.url));
        const newImageItems = [];
        tempShowHiddenElements();
        try {
            const imgElements = document.querySelectorAll('img');
            for (const img of imgElements) {
                try {
                    let imgUrl = img.src || img.dataset.src || img.dataset.original || img.currentSrc;
                    if (!imgUrl || processedUrls.has(imgUrl) || imgUrl.startsWith('data:')) continue;
                    
                    const fullUrl = new URL(imgUrl, window.location.href).href;
                    const originalFormat = getFileExtension(fullUrl).toLowerCase();
                    if (!CONFIG.supportFormats.includes(originalFormat) && originalFormat) continue;
                    if (processedUrls.has(fullUrl)) continue;
                    
                    const originalName = getImageName(fullUrl, img.alt);
                    const truncatedName = truncateTo4Bytes(originalName);
                    const truncatedFormat = truncateTo4Bytes(originalFormat || CONFIG.defaultImageFormat);
                    
                    let svgContent = '';
                    if (originalFormat === 'svg') {
                        try {
                            const svgResponse = await fetch(fullUrl);
                            if (svgResponse.ok) svgContent = await svgResponse.text();
                        } catch (svgErr) {
                            console.warn('获取新SVG内容失败:', svgErr);
                        }
                    }
                    const imgInfo = await new Promise((resolve) => {
                        if (img.complete) {
                            resolve({
                                id: `dynamic-img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                url: fullUrl,
                                name: truncatedName,
                                format: truncatedFormat,
                                width: img.naturalWidth || img.width || '未知',
                                height: img.naturalHeight || img.height || '未知',
                                type: 'dynamic-img',
                                preview: fullUrl,
                                originalName: originalName,
                                originalFormat: originalFormat,
                                svgContent: svgContent
                            });
                        } else {
                            img.onload = () => {
                                resolve({
                                    id: `dynamic-img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                    url: fullUrl,
                                    name: truncatedName,
                                    format: truncatedFormat,
                                    width: img.naturalWidth || img.width || '未知',
                                    height: img.naturalHeight || img.height || '未知',
                                    type: 'dynamic-img',
                                    preview: fullUrl,
                                    originalName: originalName,
                                    originalFormat: originalFormat,
                                    svgContent: svgContent
                                });
                            };
                            img.onerror = () => resolve(null);
                        }
                    });
                    if (imgInfo) {
                        processedUrls.add(imgUrl);
                        newImageItems.push(imgInfo);
                    }
                } catch (e) {
                    console.warn('动态采集<img>标签失败:', e);
                }
            }
            const elementsWithBg = document.querySelectorAll('*');
            for (const el of elementsWithBg) {
                try {
                    const bgStyle = window.getComputedStyle(el).backgroundImage;
                    if (!bgStyle || bgStyle === 'none' || processedUrls.has(bgStyle)) continue;
                    const bgUrls = bgStyle.match(/url\(["']?([^"']+)["']?\)/g);
                    if (!bgUrls) continue;
                    
                    for (const bgUrl of bgUrls) {
                        try {
                            const match = bgUrl.match(/url\(["']?([^"']+)["']?\)/);
                            if (!match || !match[1]) continue;
                            let imgUrl = match[1];
                            if (processedUrls.has(imgUrl)) continue;
                            
                            const fullUrl = new URL(imgUrl, window.location.href).href;
                            const originalFormat = getFileExtension(fullUrl).toLowerCase();
                            
                            let svgContent = '';
                            if (originalFormat === 'svg') {
                                try {
                                    const svgResponse = await fetch(fullUrl);
                                    if (svgResponse.ok) svgContent = await svgResponse.text();
                                } catch (svgErr) {
                                    console.warn('获取动态背景SVG内容失败:', svgErr);
                                }
                            }
                            
                            const originalName = `动态背景图-${el.tagName.toLowerCase()}-${Date.now().toString().slice(-4)}`;
                            const truncatedName = truncateTo4Bytes(originalName);
                            const truncatedFormat = truncateTo4Bytes(originalFormat || CONFIG.defaultImageFormat);
                            const truncatedType = truncateTo4Bytes('动态背景');
                            
                            const imgInfo = {
                                id: `dynamic-bg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                url: fullUrl,
                                name: truncatedName,
                                format: truncatedFormat,
                                width: '动态背景',
                                height: '动态背景',
                                type: truncatedType,
                                preview: fullUrl,
                                originalName: originalName,
                                originalFormat: originalFormat,
                                originalType: '动态背景图',
                                svgContent: svgContent
                            };
                            processedUrls.add(imgUrl);
                            newImageItems.push(imgInfo);
                        } catch (e) {
                            console.warn('动态采集背景图失败:', e);
                        }
                    }
                } catch (e) {
                    console.warn('处理动态背景图样式失败:', e);
                }
            }
            if (newImageItems.length > 0) {
                const uniqueNewItems = await checkAndRemoveDuplicates(newImageItems);
                const finalNewItems = uniqueNewItems.filter(newItem => {
                    return !globalImageItems.some(existingItem => 
                        imageSignatureMap.get(existingItem.id) === imageSignatureMap.get(newItem.id)
                    );
                });
                
                if (finalNewItems.length > 0) {
                    globalImageItems.push(...finalNewItems);
                    finalNewItems.forEach(item => {
                        imageItemCache.set(item.id, item);
                    });
                    imageCountEl.textContent = globalImageItems.length;
                    const fragment = document.createDocumentFragment();
                    finalNewItems.forEach(item => {
                        fragment.appendChild(createImageItemElement(item));
                    });
                    svgList.appendChild(fragment);
                    showNotification(`发现新图片：${finalNewItems.length}张`, 'success');
                }
            }
            lastScrollHeight = document.documentElement.scrollHeight;
        } catch (error) {
            console.error('动态图片采集失败:', error);
            showNotification('动态图片采集失败', 'error');
        } finally {
            restoreHiddenElements();
        }
    }
    function handleScroll() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const currentScrollHeight = document.documentElement.scrollHeight;
            if (currentScrollHeight > lastScrollHeight) {
                detectNewImages();
            }
        }, CONFIG.scrollCheckInterval);
    }
    function handleClick(e) {
        if (e.target.closest('#radarContainer') || e.target.closest('#svgSnifferModal')) {
            return;
        }
        const isLoadButton = CONFIG.clickLoadSelectors.some(selector => {
            return e.target.closest(selector);
        });
        if (isLoadButton && !isClickDetecting) {
            isClickDetecting = true;
            setTimeout(async () => {
                try {
                    await detectNewImages();
                } finally {
                    isClickDetecting = false;
                }
            }, CONFIG.clickDetectDelay);
        }
    }
    function initDynamicLoadListeners() {
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('click', handleClick, true);
    }
    function createManagedBlobUrl(blob) {
        const blobUrl = URL.createObjectURL(blob);
        const now = Date.now();
        blobUrlMap.set(blobUrl, now);
        if (blobUrlMap.size > CONFIG.maxBlobUrlCount) {
            const sortedUrls = Array.from(blobUrlMap.entries()).sort((a, b) => a[1] - b[1]);
            const urlsToClean = sortedUrls.slice(0, blobUrlMap.size - CONFIG.maxBlobUrlCount);
            
            urlsToClean.forEach(([url]) => {
                cleanupSingleBlobUrl(url);
            });
            if (CONFIG.blobCleanupNotification) {
                showNotification(`Blob URL超限，已清理${urlsToClean.length}个历史URL`, 'info');
            }
        }
        return blobUrl;
    }
    function cleanupSingleBlobUrl(url) {
        if (blobUrlMap.has(url)) {
            try {
                URL.revokeObjectURL(url);
                blobUrlMap.delete(url);
            } catch (error) {
                console.warn('清理Blob URL失败:', url, error);
            }
        }
    }
    function cleanupBlobUrls() {
        blobUrlMap.forEach((_, url) => {
            cleanupSingleBlobUrl(url);
        });
        blobUrlMap.clear();
        if (CONFIG.blobCleanupNotification) {
            showNotification('已清理所有Blob URL', 'info');
        }
    }
    function collectBasicImages() {
        const images = [];
        const imgElements = document.querySelectorAll('img');
        imgElements.forEach((img, index) => {
            const src = img.src || img.dataset.src || img.currentSrc;
            if (src && !src.startsWith('data:')) {
                const truncatedName = truncateTo4Bytes(img.alt || '未命名图片');
                const originalFormat = getFileExtension(src).toLowerCase();
                const format = truncateTo4Bytes(originalFormat || CONFIG.defaultImageFormat);
                
                images.push({
                    id: `basic-img-${index}`,
                    url: src,
                    name: truncatedName,
                    format: format,
                    width: img.naturalWidth || img.width || '未知',
                    height: img.naturalHeight || img.height || '未知',
                    type: 'img-tag',
                    preview: src,
                    element: img,
                    originalName: img.alt || '未命名图片',
                    originalFormat: originalFormat,
                    svgContent: ''
                });
            }
        });
        return images;
    }
    async function collectImagesFromCss(cssUrl) {
        const imageUrls = [];
        try {
            const response = await fetch(cssUrl, {
                headers: { 'Accept': 'text/css,*/*;q=0.1' },
                credentials: 'same-origin'
            });
            if (!response.ok) throw new Error(`CSS请求失败: ${response.status}`);
            
            const cssText = await response.text();
            const bgUrlRegex = /background-image\s*:\s*url\(["']?([^"']+)["']?\)/gi;
            let match;
            while ((match = bgUrlRegex.exec(cssText)) !== null) {
                if (match[1]) {
                    const fullUrl = new URL(match[1], cssUrl).href;
                    const ext = getFileExtension(fullUrl).toLowerCase();
                    if (CONFIG.supportFormats.includes(ext)) {
                        imageUrls.push(fullUrl);
                    }
                }
            }
        } catch (e) {
            console.warn('采集CSS中的图片失败:', cssUrl, e);
        }
        return imageUrls;
    }
    async function collectAllCssResources() {
        const cssUrls = [];
        const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
        linkElements.forEach(link => {
            const href = link.getAttribute('href');
            if (href) cssUrls.push(new URL(href, window.location.href).href);
        });
        const styleElements = document.querySelectorAll('style');
        styleElements.forEach(style => {
            const bgUrlRegex = /background-image\s*:\s*url\(["']?([^"']+)["']?\)/gi;
            let match;
            while ((match = bgUrlRegex.exec(style.textContent)) !== null) {
                if (match[1]) {
                    const fullUrl = new URL(match[1], window.location.href).href;
                    const ext = getFileExtension(fullUrl).toLowerCase();
                    if (CONFIG.supportFormats.includes(ext)) {
                        cssUrls.push(`inline:${fullUrl}`);
                    }
                }
            }
        });
        const allImageUrls = [];
        for (const cssUrl of cssUrls) {
            if (cssUrl.startsWith('inline:')) {
                allImageUrls.push(cssUrl.replace('inline:', ''));
            } else {
                const imagesFromCss = await collectImagesFromCss(cssUrl);
                allImageUrls.push(...imagesFromCss);
            }
        }
        return allImageUrls;
    }
    async function collectImages() {
        const imageItems = [];
        const processedUrls = new Set();
        let cssImageUrls = [];
        const basicImages = collectBasicImages();
        basicImages.forEach(img => {
            if (!processedUrls.has(img.url)) {
                processedUrls.add(img.url);
                imageItems.push(img);
            }
        });
        try {
            cssImageUrls = await collectAllCssResources();
        } catch (e) {
            console.warn('CSS图片采集异常:', e);
        }
        tempShowHiddenElements();
        try {
            const imgElements = document.querySelectorAll('img');
            for (const img of imgElements) {
                try {
                    let imgUrl = img.src || img.dataset.src || img.dataset.original || img.currentSrc;
                    if (!imgUrl || processedUrls.has(imgUrl) || imgUrl.startsWith('data:')) continue;
                    
                    const fullUrl = new URL(imgUrl, window.location.href).href;
                    const originalFormat = getFileExtension(fullUrl).toLowerCase();
                    if (!CONFIG.supportFormats.includes(originalFormat) && originalFormat) continue;
                    if (processedUrls.has(fullUrl)) continue;
                    
                    const originalName = getImageName(fullUrl, img.alt);
                    const truncatedName = truncateTo4Bytes(originalName);
                    const truncatedFormat = truncateTo4Bytes(originalFormat || CONFIG.defaultImageFormat);
                    
                    let svgContent = '';
                    if (originalFormat === 'svg') {
                        try {
                            const svgResponse = await fetch(fullUrl);
                            if (svgResponse.ok) svgContent = await svgResponse.text();
                        } catch (svgErr) {
                            console.warn('获取SVG原始内容失败:', svgErr);
                        }
                    }
                    const imgInfo = await new Promise((resolve) => {
                        const timer = setTimeout(() => {
                            resolve({
                                id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                url: fullUrl,
                                name: truncatedName,
                                format: truncatedFormat,
                                width: img.width || '未知',
                                height: img.height || '未知',
                                type: 'img-tag',
                                preview: fullUrl,
                                originalName: originalName,
                                originalFormat: originalFormat,
                                svgContent: svgContent
                            });
                        }, CONFIG.loadTimeout);
                        
                        if (img.complete) {
                            clearTimeout(timer);
                            resolve({
                                id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                url: fullUrl,
                                name: truncatedName,
                                format: truncatedFormat,
                                width: img.naturalWidth || img.width || '未知',
                                height: img.naturalHeight || img.height || '未知',
                                type: 'img-tag',
                                preview: fullUrl,
                                originalName: originalName,
                                originalFormat: originalFormat,
                                svgContent: svgContent
                            });
                        } else {
                            img.onload = () => {
                                clearTimeout(timer);
                                resolve({
                                    id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                    url: fullUrl,
                                    name: truncatedName,
                                    format: truncatedFormat,
                                    width: img.naturalWidth || img.width || '未知',
                                    height: img.naturalHeight || img.height || '未知',
                                    type: 'img-tag',
                                    preview: fullUrl,
                                    originalName: originalName,
                                    originalFormat: originalFormat,
                                    svgContent: svgContent
                                });
                            };
                            img.onerror = () => {
                                clearTimeout(timer);
                                resolve(null);
                            };
                        }
                    });
                    if (imgInfo) {
                        processedUrls.add(imgUrl);
                        imageItems.push(imgInfo);
                    }
                } catch (e) {
                    console.warn('采集<img>标签失败:', e);
                }
            }
            const elementsWithBg = document.querySelectorAll('*');
            for (const el of elementsWithBg) {
                try {
                    const bgStyle = window.getComputedStyle(el).backgroundImage;
                    if (!bgStyle || bgStyle === 'none' || processedUrls.has(bgStyle)) continue;
                    const bgUrls = bgStyle.match(/url\(["']?([^"']+)["']?\)/g);
                    if (!bgUrls) continue;
                    
                    for (const bgUrl of bgUrls) {
                        try {
                            const match = bgUrl.match(/url\(["']?([^"']+)["']?\)/);
                            if (!match || !match[1]) continue;
                            let imgUrl = match[1];
                            if (processedUrls.has(imgUrl)) continue;
                            
                            const fullUrl = new URL(imgUrl, window.location.href).href;
                            const originalFormat = getFileExtension(fullUrl).toLowerCase();
                            
                            let svgContent = '';
                            if (originalFormat === 'svg') {
                                try {
                                    const svgResponse = await fetch(fullUrl);
                                    if (svgResponse.ok) svgContent = await svgResponse.text();
                                } catch (svgErr) {
                                    console.warn('获取背景SVG内容失败:', svgErr);
                                }
                            }
                            
                            const originalName = `背景图-${el.tagName.toLowerCase()}-${Date.now().toString().slice(-4)}`;
                            const truncatedName = truncateTo4Bytes(originalName);
                            const truncatedFormat = truncateTo4Bytes(originalFormat || CONFIG.defaultImageFormat);
                            const truncatedType = truncateTo4Bytes('背景图');
                            
                            const imgInfo = {
                                id: `bg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                url: fullUrl,
                                name: truncatedName,
                                format: truncatedFormat,
                                width: '背景图',
                                height: '背景图',
                                type: truncatedType,
                                preview: fullUrl,
                                originalName: originalName,
                                originalFormat: originalFormat,
                                originalType: '背景图',
                                svgContent: svgContent
                            };
                            processedUrls.add(imgUrl);
                            imageItems.push(imgInfo);
                        } catch (e) {
                            console.warn('采集背景图失败:', e);
                        }
                    }
                } catch (e) {
                    console.warn('处理背景图样式失败:', e);
                }
            }
            for (const imgUrl of cssImageUrls) {
                try {
                    if (!imgUrl || processedUrls.has(imgUrl)) continue;
                    const fullUrl = new URL(imgUrl, window.location.href).href;
                    const originalFormat = getFileExtension(fullUrl).toLowerCase();
                    
                    let svgContent = '';
                    if (originalFormat === 'svg') {
                        try {
                            const svgResponse = await fetch(fullUrl);
                            if (svgResponse.ok) svgContent = await svgResponse.text();
                        } catch (svgErr) {
                            console.warn('获取CSS SVG内容失败:', svgErr);
                        }
                    }
                    
                    const originalName = `CSS图片-${Date.now().toString().slice(-4)}`;
                    const truncatedName = truncateTo4Bytes(originalName);
                    const truncatedFormat = truncateTo4Bytes(originalFormat || CONFIG.defaultImageFormat);
                    const truncatedType = truncateTo4Bytes('CSS图片');
                    
                    const imgInfo = {
                        id: `css-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                        url: fullUrl,
                        name: truncatedName,
                        format: truncatedFormat,
                        width: 'CSS引用',
                        height: 'CSS引用',
                        type: truncatedType,
                        preview: fullUrl,
                        originalName: originalName,
                        originalFormat: originalFormat,
                        originalType: 'CSS图片',
                        svgContent: svgContent
                    };
                    processedUrls.add(imgUrl);
                    imageItems.push(imgInfo);
                } catch (e) {
                    console.warn('采集CSS图片失败:', e);
                }
            }
            const svgElements = document.querySelectorAll('svg');
            for (const svg of svgElements) {
                try {
                    const svgId = `svg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
                    const svgContent = svg.outerHTML;
                    const processedSvgContent = processSVGForPreview(svgContent);
                    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
                    const svgUrl = createManagedBlobUrl(svgBlob);
                    
                    const originalName = `SVG图片-${Date.now().toString().slice(-4)}`;
                    const truncatedName = truncateTo4Bytes(originalName);
                    const truncatedFormat = truncateTo4Bytes('svg');
                    const truncatedType = truncateTo4Bytes('SVG标签');
                    
                    const imgInfo = {
                        id: svgId,
                        url: svgUrl,
                        name: truncatedName,
                        format: truncatedFormat,
                        width: svg.naturalWidth || svg.width.baseVal.value || '自适应',
                        height: svg.naturalHeight || svg.height.baseVal.value || '自适应',
                        type: truncatedType,
                        preview: svgUrl,
                        svgContent: svgContent,
                        originalName: originalName,
                        originalFormat: 'svg',
                        originalType: 'SVG标签'
                    };
                    imageItems.push(imgInfo);
                } catch (e) {
                    console.warn('采集SVG标签失败:', e);
                }
            }
        } catch (e) {
            console.error('图片采集主流程异常:', e);
        } finally {
            restoreHiddenElements();
        }
        return await checkAndRemoveDuplicates(imageItems);
    }
    function initRadarButton() {
        const domain = location.hostname.replace(/\./g, '-');
        const positionKey = `radarPosition_${domain}`;
        
        const savedPosition = GM_getValue(positionKey);
        if (savedPosition) {
            radarContainer.style.left = `${savedPosition.x}px`;
            radarContainer.style.top = `${savedPosition.y}px`;
        } else {
            radarContainer.style.right = `${CONFIG.positionOffset}px`;
            radarContainer.style.bottom = `${CONFIG.positionOffset}px`;
        }
        
        radarContainer.addEventListener('mousedown', startDrag);
        radarContainer.addEventListener('touchstart', startDrag, { passive: false });
        
        radarButton.addEventListener('click', (e) => {
            if (!isDragging && Date.now() - dragStartTime > CONFIG.touchDelay) {
                showImageList();
            }
        });
    }
    function startDrag(e) {
        e.preventDefault();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const computedStyle = window.getComputedStyle(radarContainer);
        startLeft = parseInt(computedStyle.left) || 0;
        startTop = parseInt(computedStyle.top) || 0;
        
        if (computedStyle.right !== 'auto') {
            const rightPos = parseInt(computedStyle.right);
            startLeft = window.innerWidth - rightPos - CONFIG.buttonSize;
            radarContainer.style.right = 'auto';
            radarContainer.style.left = `${startLeft}px`;
        }
        
        startX = clientX;
        startY = clientY;
        dragStartTime = Date.now();
        
        if (e.type === 'touchstart') {
            touchTimer = setTimeout(() => {
                isDragging = true;
                radarContainer.style.transition = 'none';
            }, CONFIG.touchDelay);
        } else {
            isDragging = true;
            radarContainer.style.transition = 'none';
        }
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    }
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const dx = clientX - startX;
        const dy = clientY - startY;
        radarContainer.style.left = `${startLeft + dx}px`;
        radarContainer.style.top = `${startTop + dy}px`;
        radarContainer.style.right = 'auto';
    }
    function endDrag(e) {
        if (touchTimer) {
            clearTimeout(touchTimer);
            touchTimer = null;
        }
        
        if (!isDragging) {
            if (Date.now() - dragStartTime < CONFIG.touchDelay) {
                showImageList();
            }
            return;
        }
        
        isDragging = false;
        radarContainer.style.transition = '';
        
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);
        
        const domain = location.hostname.replace(/\./g, '-');
        const positionKey = `radarPosition_${domain}`;
        const rect = radarContainer.getBoundingClientRect();
        GM_setValue(positionKey, {
            x: rect.left,
            y: rect.top
        });
    }
    function tempShowHiddenElements() {
        tempVisibleElements = [];
        const hiddenSelectors = [
            'div[style*="display:none"]',
            'div[style*="visibility:hidden"]',
            'div[style*="opacity:0"]',
            '.errorpage[style*="display:none"]',
            '[class*="hidden"]',
            '[hidden]'
        ];
        hiddenSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const originalStyle = {
                    display: el.style.display,
                    visibility: el.style.visibility,
                    opacity: el.style.opacity,
                    position: el.style.position,
                    top: el.style.top,
                    left: el.style.left,
                    width: el.style.width,
                    height: el.style.height,
                    className: el.className
                };
                tempVisibleElements.push({ el, originalStyle });
                el.classList.add('temp-visible-for-scan');
                el.style.display = '';
                el.style.visibility = '';
                el.style.opacity = '';
            });
        });
    }
    function restoreHiddenElements() {
        tempVisibleElements.forEach(({ el, originalStyle }) => {
            el.classList.remove('temp-visible-for-scan');
            el.style.display = originalStyle.display;
            el.style.visibility = originalStyle.visibility;
            el.style.opacity = originalStyle.opacity;
            el.style.position = originalStyle.position;
            el.style.top = originalStyle.top;
            el.style.left = originalStyle.left;
            el.style.width = originalStyle.width;
            el.style.height = originalStyle.height;
            el.className = originalStyle.className;
        });
        tempVisibleElements = [];
    }
    async function showImageList() {
        const modal = document.getElementById('svgSnifferModal');
        const svgList = document.getElementById('svgList');
        const imageCountEl = document.getElementById('imageCount');
        
        svgList.innerHTML = '<div class="loading">正在扫描页面图片资源（含CSS/隐藏元素/动态加载/智能去重）...</div>';
        modal.style.display = 'flex';
        overlay.style.display = 'block';
        
        try {
            const imageItems = await collectImages();
            globalImageItems = imageItems;
            imageItemCache.clear();
            imageSignatureMap.clear();
            imageCountEl.textContent = imageItems.length;
            imageItems.forEach(item => {
                imageItemCache.set(item.id, item);});
            
            if (imageItems.length === 0) {
                svgList.innerHTML = '<div class="loading">没有找到任何图片资源（已尝试采集隐藏元素、CSS和动态加载）</div>';
                return;
            }
            
            svgList.innerHTML = '';
            const fragment = document.createDocumentFragment();
            imageItems.forEach(item => {
                fragment.appendChild(createImageItemElement(item));
            });
            svgList.appendChild(fragment);
            setupModalEvents();
        } catch (error) {
            console.error('扫描图片失败:', error);
            svgList.innerHTML = '<div class="loading">扫描失败，请刷新页面重试</div>';
        }
    }

    function setupModalEvents() {
    const modal = document.getElementById('svgSnifferModal');
    const closeBtn = modal.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    const selectAllCheckbox = document.getElementById('selectAll');
    const batchDownloadBtn = document.getElementById('batchDownloadBtn');
    const copyBtn = modal.querySelector('.copy-btn');
    const dedupeToggle = document.getElementById('dedupeToggle');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        cleanupBlobUrls();
    });
    
    overlay.addEventListener('click', () => {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        cleanupBlobUrls();
    });
    
    selectAllCheckbox.addEventListener('change', (e) => {
        const checkboxes = modal.querySelectorAll('.svg-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });
    
    batchDownloadBtn.addEventListener('click', () => {
        const checkboxes = modal.querySelectorAll('.svg-checkbox:checked');
        const selectedIds = Array.from(checkboxes).map(cb => cb.dataset.id);
        const selectedItems = selectedIds.map(id => imageItemCache.get(id)).filter(Boolean);
        
        if (selectedItems.length === 0) {
            alert('请至少选择一张图片');
            return;
        }
        
        if (selectedItems.length === 1) {
            const item = selectedItems[0];
            downloadImage(item, item.originalName, item.originalFormat);
        } else {
            downloadMultipleImages(selectedItems);
        }
    });
    
    // 修复列表面板复制链接功能
    copyBtn.addEventListener('click', async () => {
    const checkboxes = modal.querySelectorAll('.svg-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.dataset.id);
    const selectedItems = selectedIds.map(id => imageItemCache.get(id)).filter(Boolean);
    
    if (selectedItems.length === 0) {
        showNotification('请至少选择一张图片', 'warning');
        return;
    }
    
    try {
        // 收集所有选中的图片URL
        const urls = selectedItems.map(item => {
            // 对于SVG内容，需要特殊处理
            if (item.format === 'svg' && item.svgContent) {
                // 创建blob URL用于SVG
                const svgBlob = new Blob([item.svgContent], { type: 'image/svg+xml' });
                const blobUrl = createManagedBlobUrl(svgBlob);
                return blobUrl;
            }
            return item.url;
        });
        
        const urlsText = urls.join('\n');
        
        // 使用更可靠的复制方法
        if (navigator.clipboard && window.isSecureContext) {
            // 使用现代 Clipboard API
            await navigator.clipboard.writeText(urlsText);
        } else {
            // 使用备用方法
            const textArea = document.createElement('textarea');
            textArea.value = urlsText;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (!successful) {
                throw new Error('execCommand 复制失败');
            }
        }
        
        showNotification(`成功复制 ${selectedItems.length} 个图片链接到剪贴板`, 'success');
        
    } catch (error) {
        console.error('复制链接失败:', error);
        showNotification('复制失败，请手动选择链接', 'error');
        
        // 提供备选方案：显示链接让用户手动复制
        const urlsText = selectedItems.map(item => item.url).join('\n');
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = urlsText;
        tempTextArea.style.width = '300px';
        tempTextArea.style.height = '150px';
        tempTextArea.style.position = 'fixed';
        tempTextArea.style.top = '50%';
        tempTextArea.style.left = '50%';
        tempTextArea.style.transform = 'translate(-50%, -50%)';
        tempTextArea.style.zIndex = '1000000';
        document.body.appendChild(tempTextArea);
        
        setTimeout(() => {
            tempTextArea.select();
            setTimeout(() => {
                document.body.removeChild(tempTextArea);
            }, 3000);
        }, 100);
    }
});

    if (dedupeToggle) {
        dedupeToggle.addEventListener('change', (e) => {
            CONFIG.deduplication.enabled = e.target.checked;
            showNotification(`智能去重 ${e.target.checked ? '已启用' : '已禁用'}`, 'info');
        });
    }
}

    function downloadImage(imgItem, originalName, originalFormat) {
        const baseName = originalName || imgItem.name;
        const completedFileName = completeImageSuffix(baseName, originalFormat);
        
        if (completedFileName.endsWith('.svg') && imgItem.svgContent) {
            try {
                const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>${imgItem.svgContent}`;
                const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
                saveAs(blob, completedFileName);
                showNotification(`下载成功: ${completedFileName}`, 'success');
                return;
            } catch (svgErr) {
                console.warn('SVG专属下载失败，尝试备用方案:', svgErr);
            }
        }
        
        const mimeType = completedFileName.endsWith('.svg') 
            ? 'image/svg+xml' 
            : `image/${completedFileName.split('.').pop().toLowerCase()}`;
        
        GM_download({
            url: imgItem.url,
            name: completedFileName,
            mimetype: mimeType,
            onload: () => {
                showNotification(`下载成功: ${completedFileName}`, 'success');
            },
            onerror: (e) => {
                console.error('下载失败:', e);
                showNotification(`下载失败: ${completedFileName}`, 'error');
            }
        });
    }

    async function downloadMultipleImages(selectedItems) {
        const zip = new JSZip();
        let downloadedCount = 0;
        const totalCount = selectedItems.length;
        
        for (const imgItem of selectedItems) {
            try {
                const baseName = imgItem.originalName || imgItem.name;
                const originalFormat = imgItem.originalFormat || '';
                const completedFileName = completeImageSuffix(baseName, originalFormat);
                
                if (completedFileName.endsWith('.svg') && imgItem.svgContent) {
                    const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>${imgItem.svgContent}`;
                    zip.file(completedFileName, svgContent);
                    downloadedCount++;
                    continue;
                }
                
                const response = await fetch(imgItem.url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const blob = await response.blob();
                zip.file(completedFileName, blob);
                downloadedCount++;
            } catch (error) {
                const errBaseName = imgItem.originalName || imgItem.name;
                const errFileName = completeImageSuffix(`${errBaseName}_加载失败`, 'txt');
                zip.file(errFileName, `图片加载失败: ${imgItem.url}\n错误原因: ${error.message}`);
                console.error(`下载失败 ${errBaseName}:`, error);
            }
        }
        
        if (downloadedCount === 0) {
            alert('所有图片下载失败');
            return;
        }
        
        try {
            const content = await zip.generateAsync({ 
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });
            const zipFileName = `网页图片_${location.hostname}_${new Date().toISOString().slice(0, 10)}.zip`;
            saveAs(content, zipFileName);
            
            showNotification(`批量下载成功: ${zipFileName}（共${downloadedCount}/${totalCount}个）`, 'success');
            if (downloadedCount < totalCount) {
                alert(`部分图片下载失败，成功下载 ${downloadedCount}/${totalCount} 个资源`);
            }
        } catch (error) {
            console.error('创建ZIP失败:', error);
            showNotification('创建ZIP文件失败', 'error');
            alert('创建ZIP文件失败');
        }
    }

    function showNotification(message, type = 'info') {
        const colors = {
            info: '#3498db',
            success: '#27ae60',
            warning: '#f39c12',
            error: '#e74c3c'
        };
        
        copyNotification.textContent = message;
        copyNotification.style.backgroundColor = colors[type] || colors.info;
        copyNotification.style.opacity = '1';
        
        setTimeout(() => {
            copyNotification.style.opacity = '0';
        }, 3000);
    }

    window.addEventListener('beforeunload', () => {
        cleanupBlobUrls();
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('click', handleClick, true);
        clearTimeout(scrollTimer);
        if (touchTimer) clearTimeout(touchTimer);
    });

    function initAllFeatures() {
        initRadarButton();
        initDynamicLoadListeners();
    }

    initAllFeatures();
})();