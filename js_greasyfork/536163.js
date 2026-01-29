// ==UserScript==
// @name         双融双创社区文档下载(iframe版）
// @namespace    http://tampermonkey.net/
// @version      2026-01-28/2
// @description  检测页面导航中的常见文件类型URL并在页面上方生成下载按钮
// @author       somiceast
// @include      *://srsc.gdedu.gov.cn/*
// @include      *://file-srsc.gdedu.gov.cn/*
// @match        *://cdn-srsc.gdedu.gov.cn/*
// @include      *://210.76.80.96/*
// @grant        none
// @run-at       document-start
// @icon         https://srsc.gdedu.gov.cn/favicon.ico
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/536163/%E5%8F%8C%E8%9E%8D%E5%8F%8C%E5%88%9B%E7%A4%BE%E5%8C%BA%E6%96%87%E6%A1%A3%E4%B8%8B%E8%BD%BD%28iframe%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536163/%E5%8F%8C%E8%9E%8D%E5%8F%8C%E5%88%9B%E7%A4%BE%E5%8C%BA%E6%96%87%E6%A1%A3%E4%B8%8B%E8%BD%BD%28iframe%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // ===== 配置区域 =====
    const CONFIG = {
        fileExtensions: [
            '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx',
            '.wps', '.et', '.dps', '.txt', '.rtf', '.odt', '.ods', '.odp',
            '.caj', '.kdh', '.nh', '.epub', '.mobi',
            '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2',
            '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp',
            '.mp3', '.wav', '.wma', '.flac', '.aac',
            '.mp4', '.avi', '.mkv', '.mov', '.flv', '.wmv',
            '.json', '.xml', '.csv', '.sql', '.db', '.py', '.js', '.html', '.css'
        ],

        // 文件基础URL（用于拼接 nasdisk 路径）
        baseUrl: 'https://cdn-srsc.gdedu.gov.cn/',

        // 按钮样式
        buttonStyle: {
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: '2147483647',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#fff',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(118, 75, 162, 0.4)',
            transition: 'all 0.3s ease',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            maxWidth: '280px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }
    };

    // ===== 状态管理 =====
    const state = {
        currentUrl: null,
        currentFilename: null,  // 存储当前文件名（用于下载时的命名）
        downloadBtn: null,
        sensorsData: null       // 缓存最新的 sensors 数据
    };

    // ===== 核心工具函数 =====

    function stripUrlParams(url) {
        if (!url) return '';
        return url.split(/[?#]/)[0];
    }

    /**
     * 检查文件类型（支持从 sensors 数据检测，不依赖 URL）
     */
    function isSupportedFileType(filename) {
        if (!filename) return false;
        const clean = stripUrlParams(filename).toLowerCase();
        const hasExt = CONFIG.fileExtensions.some(ext => clean.endsWith(ext));

        // 额外检测：如果是 preview 页面且我们有 sensors 数据，强制支持常见文档
        if (!hasExt && state.sensorsData) {
            const objId = (state.sensorsData.module_object_id || '').toLowerCase();
            const objTitle = (state.sensorsData.module_object_title || '').toLowerCase();
            // 检查是否包含任何已知扩展名
            return CONFIG.fileExtensions.some(ext =>
                                              objId.endsWith(ext) || objTitle.endsWith(ext)
                                             );
        }

        return hasExt;
    }

    function getExtFromFilename(filename) {
        if (!filename) return '';
        const match = filename.match(/\.[a-zA-Z0-9]+$/);
        return match ? match[0].toLowerCase() : '';
    }

    // 从 sensors 数据或路径提取完整URL
    function resolveFullUrl(pathOrUrl) {
        if (!pathOrUrl) return null;

        if (pathOrUrl.startsWith('http')) {
            return pathOrUrl;
        }

        const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl.slice(1) : pathOrUrl;
        return CONFIG.baseUrl + cleanPath;
    }

    // ===== 主功能 =====

    function updateDownloadButton(fileUrl, sensorsEventData) {
        // 优先从 sensors 数据获取文件名（module_object_id），否则从 URL 提取
        let displayName = '';
        let downloadUrl = '';

        if (sensorsEventData) {
            // 使用 module_object_id 作为显示和下载的文件名（用户要求）
            displayName = sensorsEventData.module_object_id || '';
            // 使用 module_object_title 作为实际下载路径
            const filePath = sensorsEventData.module_object_title || '';
            downloadUrl = resolveFullUrl(filePath) || fileUrl;

            // 缓存 sensors 数据用于类型检测
            state.sensorsData = sensorsEventData;
        } else {
            downloadUrl = fileUrl;
            displayName = fileUrl.split('/').pop();
        }

        if (!downloadUrl) return;

        // 使用 displayName（即 module_object_id）检测文件类型，因为它包含真实扩展名
        if (!isSupportedFileType(displayName)) {
            console.log('[下载助手] 不支持的文件类型:', displayName);
            hideButton();
            return;
        }

        // 避免重复创建
        if (state.currentUrl === downloadUrl && state.currentFilename === displayName) return;

        state.currentUrl = downloadUrl;
        state.currentFilename = displayName;

        console.log('[下载助手] 准备下载:', displayName, 'URL:', downloadUrl);

        // 创建按钮
        if (!state.downloadBtn) {
            createButton();
        }

        // 截断显示（避免按钮太长）
        const maxLen = 12;
        const shortName = displayName.length > maxLen ?
              displayName.slice(0, maxLen) + '...' : displayName;

        state.downloadBtn.textContent = `📥 下载 ${shortName}`;
        state.downloadBtn.title = displayName; // 悬停显示完整文件名
        state.downloadBtn.style.display = 'block';

        // 更新点击事件
        state.downloadBtn.onclick = function(e) {
            e.preventDefault();

            const a = document.createElement('a');
            a.href = downloadUrl;
            // 使用 module_object_id 作为保存时的文件名
            a.download = displayName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                if (a.parentNode) a.parentNode.removeChild(a);
            }, 100);

            // 视觉反馈
            const originalText = state.downloadBtn.textContent;
            state.downloadBtn.textContent = '✅ 开始下载';
            state.downloadBtn.style.background = '#28a745';

            setTimeout(() => {
                state.downloadBtn.textContent = originalText;
                state.downloadBtn.style.background = CONFIG.buttonStyle.background;
            }, 2000);
        };
    }

    function createButton() {
        state.downloadBtn = document.createElement('button');
        Object.assign(state.downloadBtn.style, CONFIG.buttonStyle);

        state.downloadBtn.addEventListener('mouseenter', () => {
            state.downloadBtn.style.transform = 'translateY(-2px)';
            state.downloadBtn.style.boxShadow = '0 6px 20px rgba(118, 75, 162, 0.6)';
        });
        state.downloadBtn.addEventListener('mouseleave', () => {
            state.downloadBtn.style.transform = 'translateY(0)';
            state.downloadBtn.style.boxShadow = CONFIG.buttonStyle.boxShadow;
        });

        document.body.appendChild(state.downloadBtn);
    }

    function hideButton() {
        if (state.downloadBtn) state.downloadBtn.style.display = 'none';
        state.currentUrl = null;
        state.currentFilename = null;
    }

    // ===== 监听策略 =====

    /**
     * Hook sensors 事件（关键修复）
     */
    function hookSensors() {
        // 检查页面上可能存在的 sensors 对象（可能是 window.sensors 或其他命名）
        const possibleSensors = ['sensors', 'Sensors', 'sensorsData', 'dataLayer'];

        possibleSensors.forEach(name => {
            const obj = window[name];
            if (obj && typeof obj.track === 'function') {
                const original = obj.track;
                obj.track = function(eventName, eventData) {
                    // 监听特定事件或包含 module_object_id 的任何事件
                    if (eventData && (eventData.module_object_id || eventData.module_code === 'MT03002001')) {
                        console.log('[下载助手] 拦截事件:', eventName, eventData);

                        // 传递整个 eventData，让 updateDownloadButton 提取 module_object_id 作为文件名
                        const filePath = eventData.module_object_title || eventData.module_object_id;
                        const fullUrl = resolveFullUrl(filePath);

                        if (fullUrl) {
                            // 稍延迟执行，确保 DOM 已更新
                            setTimeout(() => {
                                updateDownloadButton(fullUrl, eventData);
                            }, 100);
                        }
                    }
                    return original.apply(this, arguments);
                };
                console.log('[下载助手] 已 Hook:', name);
            }
        });

        // 备选方案：监听控制台输出（某些埋点库会打印日志）
        const originalConsoleLog = console.log;
        console.log = function(...args) {
            // 检查是否包含 sensors 相关数据
            const text = args.join(' ');
            if (text.includes('module_object_id') && text.includes('.zip')) {
                console.warn('[下载助手] 通过 console 检测到文件数据，请检查是否有 API 可直接获取');
            }
            return originalConsoleLog.apply(this, args);
        };
    }

    /**
     * 监听 iframe 变化（作为 backup）
     */
    function observeIframe() {
        // 监听现有 iframe
        document.querySelectorAll('iframe').forEach(iframe => {
            observeIframeElement(iframe);
        });

        // 监听新增 iframe
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'IFRAME') {
                        observeIframeElement(node);
                    }
                    if (node.querySelectorAll) {
                        node.querySelectorAll('iframe').forEach(observeIframeElement);
                    }
                });
            });
        });

        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    function observeIframeElement(iframe) {
        if (!iframe || iframe._hasObserver) return;
        iframe._hasObserver = true;

        // 检测 src 变化
        const checkSrc = () => {
            const src = iframe.src;
            if (src && src !== 'about:blank' && !state.sensorsData) {
                // 只有在没有 sensors 数据时才使用 iframe src（避免覆盖）
                updateDownloadButton(src, null);
            }
        };

        // 初始检查
        checkSrc();

        // 监听属性变化
        const attrObserver = new MutationObserver(checkSrc);
        attrObserver.observe(iframe, { attributes: true, attributeFilter: ['src'] });
    }

    // ===== 初始化 =====

    function init() {
        console.log('[下载助手] 初始化...');

        hookSensors();
        observeIframe();

        // 定期检查是否已有缓存数据但按钮未创建（防漏）
        setInterval(() => {
            if (state.sensorsData && !state.downloadBtn) {
                const filePath = state.sensorsData.module_object_title;
                if (filePath) {
                    updateDownloadButton(resolveFullUrl(filePath), state.sensorsData);
                }
            }
        }, 2000);
    }

    // 启动
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
        document.addEventListener('DOMContentLoaded', init);
    }
    setTimeout(init, 500);

})();