// ==UserScript==
// @name         LangLink fbCAT 工具
// @namespace    http://tampermonkey.net/
// @version      19.3
// @description  提取所有fbCAT的内容，保存成mqxliff文件，支持批量提取，兼容新旧页面格式
// @author       LL-Floyd
// @match        https://www.internalfb.com/translations/fbcat/*
// @match        https://www.facebook.com/translations/fbcat/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_notification
// @connect      www.internalfb.com
// @connect      www.facebook.com
// @connect      update.greasyfork.org
// @connect      greasyfork.org
// @require      data:application/javascript,window.setImmediate%20%3D%20window.setImmediate%20%7C%7C%20((f%2C%20...args)%20%3D%3E%20window.setTimeout(()%20%3D%3E%20f(args)%2C%200))%3B
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539220/LangLink%20fbCAT%20%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/539220/LangLink%20fbCAT%20%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';


    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://update.greasyfork.org/scripts/539220/LangLink%20fbCAT%20%E5%B7%A5%E5%85%B7.meta.js",
            onload: function (response) {
                try {
                    const latestVersion = /@version\s+([0-9.]+)/.exec(response.responseText)?.[1];
                    const currentVersion = GM_info.script.version;
                    if (latestVersion && latestVersion > currentVersion) {
                        alert("LangLink fbCAT 工具 有新版本可用: " + latestVersion + "\n请点击OK更新");
                        window.location.href = "https://greasyfork.org/en/scripts/539220-langlink-fbcat-tool";
                    }
                } catch (error) {
                    console.warn('解析更新信息失败:', error);
                }
            },
            onerror: function (error) {
                console.warn('检查更新失败 (这不会影响脚本正常功能):', error);
            }
        })
    }

    // ===================================================================
    // 1. 全局变量和参数嗅探逻辑
    // ===================================================================

    let capturedParams = { fb_dtsg: null, jazoest: null };
    let pageParams = null; // 存储页面参数
    let generatedZipBlobUrl = null; // 新增: 存储生成的zip文件的URL
    let controlPanelMinimized = false;
    let controlPanelIcon = null;
    let controlPanelElement = null;
    let controlPanelWrapper = null;

    function showMessage(text, type = 'info') {
        console.log(`[fbCAT] ${type.toUpperCase()}: ${text}`);
        const messageArea = document.getElementById('ll-floyd-message-area');
        if (messageArea) {
            messageArea.textContent = text;
            messageArea.className = `ll-floyd-message-${type}`;
        }
    }

    function enableDrag(element, options = {}) {
        if (!element) return;

        const dragHandle = options.handle || element;
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let initialLeft = 0;
        let initialTop = 0;
        let hasMoved = false;

        const getPoint = (event) => {
            if (event.touches && event.touches.length > 0) {
                return { x: event.touches[0].clientX, y: event.touches[0].clientY };
            }
            return { x: event.clientX, y: event.clientY };
        };

        const handlePointerDown = (event) => {
            if (event.type === 'mousedown' && event.button !== 0) return;
            if (event.target.closest('[data-no-drag="true"]')) return;

            const { x, y } = getPoint(event);
            isDragging = true;
            hasMoved = false;
            element.dataset.dragging = 'false';

            const rect = element.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            startX = x;
            startY = y;

            element.style.left = `${initialLeft}px`;
            element.style.top = `${initialTop}px`;
            element.style.right = 'auto';
            element.style.bottom = 'auto';

            document.addEventListener('mousemove', handlePointerMove);
            document.addEventListener('mouseup', handlePointerUp);
            document.addEventListener('touchmove', handlePointerMove, { passive: false });
            document.addEventListener('touchend', handlePointerUp);

            if (event.cancelable) {
                event.preventDefault();
            }
        };

        const handlePointerMove = (event) => {
            if (!isDragging) return;

            if (event.cancelable) {
                event.preventDefault();
            }

            const { x, y } = getPoint(event);
            const deltaX = x - startX;
            const deltaY = y - startY;

            if (!hasMoved && (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2)) {
                hasMoved = true;
                element.dataset.dragging = 'true';
            }

            element.style.left = `${initialLeft + deltaX}px`;
            element.style.top = `${initialTop + deltaY}px`;
        };

        const handlePointerUp = () => {
            if (!isDragging) return;

            isDragging = false;
            document.removeEventListener('mousemove', handlePointerMove);
            document.removeEventListener('mouseup', handlePointerUp);
            document.removeEventListener('touchmove', handlePointerMove, { passive: false });
            document.removeEventListener('touchend', handlePointerUp);

            // 轻微延迟以避免click事件立即触发
            setTimeout(() => {
                element.dataset.dragging = hasMoved ? 'true' : 'false';
                hasMoved = false;
            }, 0);
        };

        dragHandle.addEventListener('mousedown', handlePointerDown);
        dragHandle.addEventListener('touchstart', handlePointerDown, { passive: false });
    }

    function minimizeControlPanel() {
        if (!controlPanelElement || !controlPanelIcon || controlPanelMinimized) return;

        controlPanelElement.classList.add('ll-floyd-panel-hidden');
        controlPanelElement.setAttribute('aria-hidden', 'true');
        controlPanelMinimized = true;
        controlPanelIcon.classList.add('ll-floyd-icon-minimized');
    }

    function restoreControlPanel() {
        if (!controlPanelElement || !controlPanelIcon) return;

        controlPanelElement.classList.remove('ll-floyd-panel-hidden');
        controlPanelElement.setAttribute('aria-hidden', 'false');
        controlPanelMinimized = false;
        controlPanelIcon.classList.remove('ll-floyd-icon-minimized');
    }

    function toggleControlPanel() {
        if (controlPanelMinimized) {
            restoreControlPanel();
        } else {
            minimizeControlPanel();
        }
    }

    function updateButtonState(isReset = false) {
        const extractButton = document.getElementById('ll-floyd-extract-btn');
        const xliffButton = document.getElementById('ll-floyd-xliff-btn');
        const batchButton = document.getElementById('ll-floyd-batch-btn');

        if (isReset && generatedZipBlobUrl) {
            URL.revokeObjectURL(generatedZipBlobUrl);
            generatedZipBlobUrl = null;
        }

        if (batchButton && (isReset || !generatedZipBlobUrl)) {
            batchButton.textContent = '提取该项目的所有文件';
            batchButton.onclick = handleBatchExtraction;
        }

        const areParamsReady = capturedParams.fb_dtsg && capturedParams.jazoest && pageParams;

        if (extractButton) {
            extractButton.disabled = !areParamsReady;
            if (areParamsReady) extractButton.textContent = '提取当前页面内容';
        }

        if (xliffButton) {
            xliffButton.disabled = !areParamsReady;
            if (areParamsReady) xliffButton.textContent = '下载当前页面的MQXLIFF文件';
        }

        if (batchButton) {
            batchButton.disabled = !areParamsReady;
            if (areParamsReady && (isReset || !generatedZipBlobUrl)) {
                // Check if this is new page format to adjust button text
                const hashes = extractHashesFromPage();
                const cmsObjects = getCMSObjectsFromPage();
                const isNewPageFormat = hashes && hashes.length > 0 && (!cmsObjects || cmsObjects.length === 0);

                if (isNewPageFormat) {
                    batchButton.textContent = '新格式：单次下载即可获取全部';
                } else {
                    batchButton.textContent = '提取该项目的所有文件';
                }
            }
        }

        if (areParamsReady) {
            showMessage('脚本已就绪', 'success');
        }
    }

    function sniffParameters(bodyText) {
        if (typeof bodyText !== 'string' || bodyText.length === 0) {
            return;
        }
        try {
            const params = new URLSearchParams(bodyText);
            let updated = false;

            if (!capturedParams.fb_dtsg && params.has('fb_dtsg')) {
                capturedParams.fb_dtsg = params.get('fb_dtsg');
                console.log('[fbCAT] Captured fb_dtsg:', capturedParams.fb_dtsg);
                updated = true;
            }
            if (!capturedParams.jazoest && params.has('jazoest')) {
                capturedParams.jazoest = params.get('jazoest');
                console.log('[fbCAT] Captured jazoest:', capturedParams.jazoest);
                updated = true;
            }
            if (!capturedParams.__user && params.has('__user')) {
                capturedParams.__user = params.get('__user');
                console.log('[fbCAT] Captured __user:', capturedParams.__user);
                updated = true;
            }

            // Also look for other useful parameters from the new API format
            const otherParams = ['__req', '__hs', '__rev', '__s', '__hsi', '__dyn', 'dpr', '__ccg', 'lsd', '__spin_r', '__spin_b', '__spin_t', '__jssesw', 'translation_action', 'read_only_mode', '__a'];
            otherParams.forEach(param => {
                if (!capturedParams[param] && params.has(param)) {
                    capturedParams[param] = params.get(param);
                    console.log('[fbCAT] Captured', param + ':', capturedParams[param]);
                    updated = true;
                }
            });

            if (updated) {
                updateButtonState();
            }
        } catch (e) {
            console.error('[fbCAT] Error in sniffParameters:', e);
        }
    }

    function extractPageParams() {
        const urlParams = new URLSearchParams(window.location.search);
        pageParams = {
            translation_task_id: urlParams.get('translation_task_id'),
            translation_task_step_id: urlParams.get('translation_task_step_id'),
            translating_locale: urlParams.get('translating_locale') || 'zh_CN',
            locale: urlParams.get('locale') || 'en_US',
            active_cms_id: urlParams.get('active_cms_id')
        };
    }

    // ===================================================================
    // 2. CMS对象获取功能
    // ===================================================================

    function getCMSObjectsFromPage() {
        try {
            const scripts = document.querySelectorAll('script');

            for (let script of scripts) {
                const content = script.textContent || script.innerText;
                if (content.includes('cmsObjectRecords')) {
                    const processCMSObjects = (cmsObjects) => {
                        return Object.keys(cmsObjects).map(id => {
                            const obj = {
                                id: id,
                                title: cmsObjects[id][3] || `CMS_${id}`,
                                version: cmsObjects[id][5] || '4',
                                href: `${window.location.origin}/translations/fbcat/?translation_task_id=${pageParams.translation_task_id}&translation_task_step_id=${pageParams.translation_task_step_id}&translating_locale=${pageParams.translating_locale}&locale=${pageParams.locale}&active_cms_id=${id}`
                            };
                            return obj;
                        });
                    };

                    const match = content.match(/"cmsObjectRecords":\s*(\{(?:[^{}]|{[^{}]*})*\})/);
                    if (match) {
                        try {
                            const cmsObjects = JSON.parse(match[1]);
                            return processCMSObjects(cmsObjects);
                        } catch (e) {
                            console.error('[fbCAT] Error parsing CMS objects from regex match:', e);
                        }
                    }

                    try {
                        const startIndex = content.indexOf('"cmsObjectRecords":');
                        if (startIndex !== -1) {
                            const afterColon = content.substring(startIndex + '"cmsObjectRecords":'.length);
                            const objectStart = afterColon.indexOf('{');
                            if (objectStart !== -1) {
                                let braceCount = 1;
                                let endIndex = objectStart + 1;
                                let inString = false;
                                let escapeNext = false;

                                // Improved JSON extraction that handles strings properly
                                for (; endIndex < afterColon.length && braceCount > 0; endIndex++) {
                                    const char = afterColon[endIndex];

                                    if (escapeNext) {
                                        escapeNext = false;
                                        continue;
                                    }

                                    if (char === '\\') {
                                        escapeNext = true;
                                        continue;
                                    }

                                    if (char === '"' && !escapeNext) {
                                        inString = !inString;
                                        continue;
                                    }

                                    if (!inString) {
                                        if (char === '{') braceCount++;
                                        if (char === '}') braceCount--;
                                    }
                                }

                                const objectStr = afterColon.substring(objectStart, endIndex);
                                console.log('[fbCAT Debug] Extracted object string length:', objectStr.length);
                                console.log('[fbCAT Debug] Object string preview:', objectStr.substring(0, 200));

                                const cmsObjects = JSON.parse(objectStr);
                                return processCMSObjects(cmsObjects);
                            }
                        }
                    } catch (e) {
                        console.error('[fbCAT Debug] Error parsing CMS objects from manual extraction:', e);
                        console.log('[fbCAT Debug] Error occurred at character position:', e.message);
                    }
                }
            }

            console.log('[fbCAT Debug] No CMS objects found in scripts, falling back to link detection');
            const links = [];
            const linkElements = document.querySelectorAll("a[href*='/translations/fbcat/']");
            console.log('[fbCAT Debug] Found', linkElements.length, 'translation links');

            linkElements.forEach((a) => {
                const href = a.href;
                const match = href.match(/active_cms_id=(\d+)/);
                if (match) {
                    const id = match[1];
                    const title = (a.getAttribute('data-tooltip-content') || a.textContent || `CMS_${id}`).replace('CMS: ', '').trim();
                    console.log('[fbCAT Debug] Found link with CMS ID:', id, 'Title:', title);
                    if (title && title !== '# CMS Objects' && !title.includes('CMS Objects')) {
                        links.push({ id, title, href, version: '4' });
                    }
                }
            });

            // Also check for CMS objects in the current page if we're on a CMS page
            if (pageParams && pageParams.active_cms_id) {
                if (links.length === 0 || !links.find(link => link.id === pageParams.active_cms_id)) {
                    links.push({
                        id: pageParams.active_cms_id,
                        title: `Current CMS ${pageParams.active_cms_id}`,
                        href: window.location.href,
                        version: '4'
                    });
                }
            }

            return links.length > 0 ? links : null;
        } catch (e) {
            console.error('[fbCAT] Error in getCMSObjectsFromPage:', e);
            return null;
        }
    }

    // ===================================================================
    // 3. 数据提取功能
    // ===================================================================

    function extractHashesFromPage() {
        try {
            const scripts = document.querySelectorAll('script');
            let hashes = [];

            for (let script of scripts) {
                const content = script.textContent || script.innerText;
                if (!content) continue;

                // Look for hash patterns in various formats
                const hashPatterns = [
                    // Direct hash array assignment: hashes[0]="abc123..."
                    /hashes\[[\d+]\]\s*=\s*['"]([a-f0-9]{32})['"]?/g,
                    // Object key format: "abc123...": {
                    /['"]([a-f0-9]{32})['"]?\s*:\s*\{/g,
                    // Hash property: "hash": "abc123..."
                    /"hash"\s*:\s*['"]([a-f0-9]{32})['"]?/g,
                    // Array of hashes: ["abc123...", "def456..."]
                    /['"]([a-f0-9]{32})['"]?/g,
                    // URL parameters: hash=abc123...
                    /[?&]hash=([a-f0-9]{32})/g,
                    // Data attributes: data-hash="abc123..."
                    /data-hash\s*=\s*['"]([a-f0-9]{32})['"]?/g
                ];

                for (let pattern of hashPatterns) {
                    let match;
                    pattern.lastIndex = 0; // Reset regex state
                    while ((match = pattern.exec(content)) !== null) {
                        const hash = match[1];
                        if (hash && hash.length === 32 && /^[a-f0-9]+$/.test(hash) && !hashes.includes(hash)) {
                            hashes.push(hash);
                        }
                    }
                }
            }

            // Also check the current page URL for hash parameters
            const urlParams = new URLSearchParams(window.location.search);
            for (let [key, value] of urlParams.entries()) {
                if (key.toLowerCase().includes('hash') || key.toLowerCase().includes('id')) {
                    if (value && value.length === 32 && /^[a-f0-9]+$/.test(value) && !hashes.includes(value)) {
                        hashes.push(value);
                    }
                }
            }

            // Look for form inputs and hidden fields
            const inputs = document.querySelectorAll('input[name*="hash"], input[name*="id"], input[type="hidden"]');
            inputs.forEach(input => {
                const value = input.value;
                if (value && value.length === 32 && /^[a-f0-9]+$/.test(value) && !hashes.includes(value)) {
                    hashes.push(value);
                }
            });

            // Remove duplicates and limit to reasonable number
            hashes = [...new Set(hashes)].slice(0, 50); // Limit to 50 hashes max

            return hashes.length > 0 ? hashes : null;
        } catch (e) {
            console.error('[fbCAT] Error extracting hashes:', e);
            return null;
        }
    }

    // New API function for hash-based requests
    async function extractByHashes(hashes) {
        const postData = new URLSearchParams();
        hashes.forEach((hash, index) => {
            postData.append(`hashes[${index}]`, hash);
        });

        // Add all required parameters, prefer captured values over defaults
        postData.append('source_locale', pageParams.locale);
        postData.append('target_locale', pageParams.translating_locale);
        postData.append('translation_task_id', pageParams.translation_task_id);
        postData.append('translation_action', capturedParams.translation_action || '10');
        postData.append('read_only_mode', capturedParams.read_only_mode || 'false');
        postData.append('__user', capturedParams.__user || '100064841808968');
        postData.append('__a', capturedParams.__a || '1');
        postData.append('__req', capturedParams.__req || '1');
        postData.append('fb_dtsg', capturedParams.fb_dtsg);
        postData.append('jazoest', capturedParams.jazoest);
        postData.append('locale', pageParams.locale);

        // Add other parameters if available
        if (capturedParams.lsd) postData.append('lsd', capturedParams.lsd);
        if (capturedParams.__hs) postData.append('__hs', capturedParams.__hs);
        if (capturedParams.__rev) postData.append('__rev', capturedParams.__rev);
        if (capturedParams.__s) postData.append('__s', capturedParams.__s);
        if (capturedParams.__hsi) postData.append('__hsi', capturedParams.__hsi);
        if (capturedParams.__dyn) postData.append('__dyn', capturedParams.__dyn);
        if (capturedParams.dpr) postData.append('dpr', capturedParams.dpr);
        if (capturedParams.__ccg) postData.append('__ccg', capturedParams.__ccg);
        if (capturedParams.__spin_r) postData.append('__spin_r', capturedParams.__spin_r);
        if (capturedParams.__spin_b) postData.append('__spin_b', capturedParams.__spin_b);
        if (capturedParams.__spin_t) postData.append('__spin_t', capturedParams.__spin_t);
        if (capturedParams.__jssesw) postData.append('__jssesw', capturedParams.__jssesw);

        const requestUrl = `${window.location.origin}/translations/fbcat/fbt/fetch/`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: requestUrl,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                data: postData.toString(),
                onload: function (response) {
                    try {
                        const responseText = response.responseText;

                        if (!responseText || responseText.trim() === '') {
                            return reject(new Error('服务器返回空响应'));
                        }

                        const cleanedText = responseText.replace('for (;;);', '');

                        // Check for truncated JSON and fix it
                        let fixedJson = cleanedText;

                        // First, try to identify if JSON is truncated
                        const targetStartIndex = fixedJson.indexOf('"target"');
                        if (targetStartIndex !== -1) {

                            // Count braces to see if JSON is complete
                            let braceCount = 0;
                            let inString = false;
                            let escapeNext = false;

                            for (let i = 0; i < fixedJson.length; i++) {
                                const char = fixedJson[i];

                                if (escapeNext) {
                                    escapeNext = false;
                                    continue;
                                }

                                if (char === '\\') {
                                    escapeNext = true;
                                    continue;
                                }

                                if (char === '"' && !escapeNext) {
                                    inString = !inString;
                                    continue;
                                }

                                if (!inString) {
                                    if (char === '{') braceCount++;
                                    if (char === '}') braceCount--;
                                }
                            }

                            if (braceCount > 0) {
                                for (let i = 0; i < braceCount; i++) {
                                    fixedJson += '}';
                                }
                            }
                        }

                        const data = JSON.parse(fixedJson);

                        if (data && data.payload) {
                            // Convert new format to old format for compatibility
                            const convertedPayload = convertNewFormatToOld(data.payload, hashes);
                            resolve(convertedPayload);
                        } else {
                            reject(new Error('响应数据结构不符合预期'));
                        }
                    } catch (error) {
                        console.error('[fbCAT] Error parsing hash-based response:', error);
                        reject(error);
                    }
                },
                onerror: function (response) {
                    reject(new Error(`请求失败: ${response.statusText}`));
                }
            });
        });
    }

    // Convert new API format to old format for compatibility
    function convertNewFormatToOld(newPayload, hashes) {

        const segments = [];
        const tm_suggestions = {};
        let segmentCounter = 1;
        let expiredCount = 0;
        let totalCount = 0;

        if (newPayload.source && newPayload.target) {
            hashes.forEach(hash => {
                const sourceData = newPayload.source[hash];
                const targetDataArray = newPayload.target[hash];

                if (sourceData) {
                    totalCount++;
                    // Skip expired segments
                    if (sourceData.isExpired === true) {
                        expiredCount++;
                        return;
                    }

                    // Create segment from source data
                    const segment = {
                        id: sourceData.id || hash,
                        segmentNumber: segmentCounter++,
                        text: sourceData.text || '',
                        fileID: sourceData.appID || '',
                        tagLocalizability: [], // May need to extract this if available
                        translation: null
                    };


                    // Add translation data if available
                    if (targetDataArray && targetDataArray.length > 0) {
                        const targetData = targetDataArray[0]; // Use first translation

                        segment.translation = {
                            text: targetData.text || '',
                            confirmedText: targetData.liveTranslation || targetData.text || '',
                            reviewedText: targetData.reviewInfo?.reviewedTranslation || '',
                            editedText: targetData.text || ''
                        };

                        // Create TM suggestion data for compatibility
                        tm_suggestions[segment.id] = [{
                            confidenceScore: targetData.isApproved ? 1.0 : 0.8,
                            fuzzyMatchScore: targetData.isApproved ? 1.0 : 0.8,
                            isICE: targetData.isApproved || false,
                            isMachineTranslated: targetData.isAutoTranslated || false,
                            translationSegment: {
                                text: targetData.text || '',
                                confirmedText: targetData.liveTranslation || targetData.text || '',
                                editedText: targetData.text || '',
                                translationFromPreviousTranslationAction: ''
                            }
                        }];
                    }

                    segments.push(segment);
                }
            });
        }

        // Also try to use TM suggestions from the response if available
        if (newPayload.tmSuggestions) {
            Object.keys(newPayload.tmSuggestions).forEach(segmentId => {
                const tmSug = newPayload.tmSuggestions[segmentId];
                if (tmSug && tmSug.length > 0) {
                    tm_suggestions[segmentId] = tmSug;
                }
            });
        }

        const convertedPayload = {
            segments: segments,
            tm_suggestions: tm_suggestions
        };

        console.log(`[fbCAT] 转换完成: 总段数 ${totalCount}, 过期段数 ${expiredCount}, 有效段数 ${segments.length}`);
        return convertedPayload;
    }

    // Legacy API function (CMS-based)
    async function extractSingleCMSLegacy(cmsId, version = '4') {
        console.log('[fbCAT Debug] extractSingleCMSLegacy called with:', { cmsId, version });

        const postData = new URLSearchParams({
            'translation_action': '2',
            'cms_id': cmsId,
            'cms_version': version,
            'translation_locale': pageParams.translating_locale,
            'locale': pageParams.locale,
            'translation_task_id': pageParams.translation_task_id,
            'fb_dtsg': capturedParams.fb_dtsg,
            'jazoest': capturedParams.jazoest,
            '__a': '1',
        }).toString();

        const requestUrl = `${window.location.origin}/translations/fbcat/segments/fetch/`;
        console.log('[fbCAT Debug] Sending legacy request to:', requestUrl);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: requestUrl,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                data: postData,
                onload: function (response) {
                    console.log('[fbCAT Debug] Legacy response received, status:', response.status);
                    try {
                        const responseText = response.responseText;

                        if (!responseText || responseText.trim() === '') {
                            return reject(new Error('服务器返回空响应'));
                        }

                        const cleanedText = responseText.replace('for (;;);', '');
                        const data = JSON.parse(cleanedText);

                        if (data && data.payload) {
                            // Filter out expired segments for legacy API too
                            if (data.payload.segments) {
                                const originalCount = data.payload.segments.length;
                                data.payload.segments = data.payload.segments.filter(segment => {
                                    return segment.isExpired !== true;
                                });
                                const filteredCount = data.payload.segments.length;
                                const expiredCount = originalCount - filteredCount;

                                console.log(`[fbCAT] Legacy API 过滤完成: 总段数 ${originalCount}, 过期段数 ${expiredCount}, 有效段数 ${filteredCount}`);
                            }
                            resolve(data.payload);
                        } else {
                            reject(new Error('响应数据结构不符合预期'));
                        }
                    } catch (error) {
                        console.error('[fbCAT] Error parsing legacy response:', error);
                        reject(error);
                    }
                },
                onerror: function (response) {
                    reject(new Error(`请求失败: ${response.statusText}`));
                }
            });
        });
    }

    // Main extraction function - tries both APIs
    async function extractSingleCMS(cmsId, version = '4') {
        // First, try to detect if this is a new page format by checking for hashes
        const hashes = extractHashesFromPage();

        if (hashes && hashes.length > 0) {
            try {
                const result = await extractByHashes(hashes);
                if (result && result.segments && result.segments.length > 0) {
                    return result;
                }
            } catch (error) {
                // Fall through to legacy API
            }
        }

        // Fallback to legacy API
        try {
            const result = await extractSingleCMSLegacy(cmsId, version);
            if (result && result.segments && result.segments.length > 0) {
                return result;
            } else {
                // If legacy returns empty but we have hashes, try the new API again
                if (hashes && hashes.length > 0) {
                    return await extractByHashes(hashes);
                }
                return result; // Return empty result
            }
        } catch (error) {
            // If both fail and we have hashes, try new API as final fallback
            if (hashes && hashes.length > 0) {
                return await extractByHashes(hashes);
            }
            throw error;
        }
    }

    // ===================================================================
    // 4. MQXLIFF生成功能
    // ===================================================================

    function makeMQXLIFF(filename, segments, tm_suggestions) {

        const out = [];
        out.push('<?xml version="1.0" encoding="utf-8"?>');
        out.push('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2" xmlns:mq="MQXliff" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:tc:xliff:document:1.2 xliff-core-1.2-transitional.xsd">');

        const fname = filename.replace("'", "&apos;").replace("&", "&amp;");
        out.push(`<file original='${fname}' fileid='${segments?.[0]?.fileID}' taskid='${pageParams.translation_task_id}' source-language='${pageParams.locale.replace('_', '-')}' target-language='${pageParams.translating_locale.replace('_', '-')}' datatype='plaintext' xml:space='preserve'>`);
        out.push(``);
        out.push('<header><tool tool-id="MQ" tool-name="MemoQ" tool-version="9.4.11" tool-company="Kilgray"/></header>');
        out.push("<body>");

        let id = 0;
        if (segments != null) {
            for (let seg of segments) {
                const tmSug = tm_suggestions?.[seg.id]?.[0];
                const tagLiz = seg.tagLocalizability || [];
                const tagNonLoc = new Set(tagLiz.filter(x => !x.localizable).map(x => x.tagName));

                const score = tmSug?.confidenceScore ?? 0;
                const matchPct = tmSug && score !== 0
                    ? tmSug.isICE
                        ? ` mq:percent="101"`
                        : ` mq:percent="${Math.floor(100 * score)}"`
                    : "";

                out.push(`<trans-unit id="${seg.id}" mq:status="TranslatorConfirmed"${matchPct}>`);

                const src = markTag(seg.text, id, tagNonLoc);
                id = src.id;
                out.push(`<source>${src.txt}</source>`);

                const txt = getTrgText(seg.translation);
                const trg = markTag(txt, id, tagNonLoc);
                id = trg.id;
                out.push(`<target>${trg.txt}</target>`);
                out.push("</trans-unit>");
            }
        } else {
            out.push(``);
        }
        out.push("</body></file></xliff>");

        return out.join('\n');
    }

    const rxTag = /<(?<end>\/)?(?<name>[\w.:-]+)(\s+[\w.-]+(?:\s*=\s*(?:(?<q>["']).*?\k<q>|[^\s"'>]*?(?=[\s>])))?)*(?<empty>\s*\/)?>|(?<ent>&(?:\w+|#x?\d+));|(?<badamp>&)|(?<text>[^<&]+)|(?<cdata><!\[CDATA\[.*?\]\]>)/g;

    function markTag(txt, id, tagNonLoc) {
        const idStack = [];
        let ret = '';
        let m, ignore = false, placeholder = '';

        rxTag.lastIndex = 0;

        while ((m = rxTag.exec(txt)) != null) {
            const tagName = m.groups?.['name'];
            const isEnd = m.groups?.['end'];

            if (ignore) {
                placeholder += m[0];
                if (isEnd && tagNonLoc.has(tagName)) {
                    ++id;
                    ret += `<ph id='t${id}'>${placeholder
                        .replaceAll('&', '&amp;')
                        .replaceAll('<', '&lt;')
                        .replaceAll('>', '&gt;')}</ph>`;
                    placeholder = '';
                    ignore = false;
                }
                continue;
            }

            if (!isEnd && tagNonLoc.has(tagName)) {
                placeholder += m[0];
                ignore = true;
                continue;
            }

            if (tagName != null) {
                if (isEnd) {
                    const _id = idStack.pop();
                    const tag = escapeTag(m[0]);
                    ret += `<ept id='t${_id}'>${tag}</ept>`;
                } else if (m.groups?.['empty']) {
                    ++id;
                    const tag = escapeTag(m[0]);
                    ret += `<ph id='t${id}'>${tag}</ph>`;
                } else {
                    idStack.push(++id);
                    const tag = escapeTag(m[0]);
                    ret += `<bpt id='t${id}'>${tag}</bpt>`;
                }
            } else if (m.groups?.['ent'] != null) {
                const tag = m[0].replaceAll('&nbsp;', '\xa0');
                ret += tag;
            } else if (m.groups?.['badamp'] != null) {
                ret += "&amp;";
            } else if (m.groups?.['cdata'] != null) {
                ++id;
                const tag = escapeTag(m[0]);
                ret += `<ph id='t${id}'>${tag}</ph>`;
            } else {
                ret += m[0];
            }
        }
        return { id: id, txt: ret };
    }

    const rxEscTag = /[&<>]/g;
    function escapeTag(txt) {
        return txt.replaceAll(rxEscTag, (m) => {
            if (m[0] == '&') return '&amp;';
            if (m[0] == '<') return '&lt;';
            if (m[0] == '>') return '&gt;';
            return m;
        });
    }

    function getTrgText(trg) {
        if (!trg) return '';
        return trg?.confirmedText ?? trg?.reviewedText ?? trg?.editedText ?? trg?.text ?? '';
    }

    // ===================================================================
    // 5. 主要处理函数
    // ===================================================================

    function getCurrentCMSVersion() {
        const cmsObjects = getCMSObjectsFromPage();
        const currentCMS = cmsObjects?.find(obj => obj.id === pageParams.active_cms_id);
        return currentCMS?.version || '4';
    }

    function handleExtraction() {
        const extractButton = document.getElementById('ll-floyd-extract-btn');
        extractButton.disabled = true;
        extractButton.textContent = '处理中...';
        showMessage('正在发送请求...', 'info');

        const version = getCurrentCMSVersion();

        extractSingleCMS(pageParams.active_cms_id, version)
            .then(payload => {
                displayResultsInModal(payload, 'main');
                showMessage('提取成功！结果已在弹窗中显示。', 'success');
            })
            .catch(error => {
                showMessage(`提取失败: ${error.message}`, 'error');
            })
            .finally(() => {
                extractButton.disabled = false;
                extractButton.textContent = '提取当前页面内容';
            });
    }

    function handleXliffDownload() {
        const xliffButton = document.getElementById('ll-floyd-xliff-btn');
        xliffButton.disabled = true;
        xliffButton.textContent = '生成中...';
        showMessage('正在生成 MQXLIFF 文件...', 'info');

        const version = getCurrentCMSVersion();
        extractSingleCMS(pageParams.active_cms_id, version)
            .then(payload => {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const filename = `fbcat_${pageParams.active_cms_id}_${pageParams.translating_locale}_${timestamp}.mqxliff`;
                const xliffContent = makeMQXLIFF(filename, payload.segments, payload.tm_suggestions);

                const blob = new Blob([xliffContent], { type: 'application/xml;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                showMessage('MQXLIFF 文件下载成功！', 'success');
            })
            .catch(error => {
                showMessage(`生成 MQXLIFF 失败: ${error.message}`, 'error');
            })
            .finally(() => {
                xliffButton.disabled = false;
                xliffButton.textContent = '下载当前页面的MQXLIFF文件';
            });
    }

    function checkJSZipAvailability() {
        if (typeof JSZip === 'undefined') {
            showMessage('JSZip库加载失败，请刷新页面重试', 'error');
            return false;
        }
        return true;
    }

    async function generateZipWithTimeout(zip, options = {}, timeoutMs = 30000) {
        return new Promise((resolve, reject) => {
            const batchProgressZipStatus = document.getElementById('ll-floyd-batch-zip-status');
            const startTime = Date.now();

            const timeoutTimer = setTimeout(() => {
                if (batchProgressZipStatus) batchProgressZipStatus.textContent = 'ZIP 生成超时！';
                reject(new Error('ZIP生成超时，请尝试减少文件数量或刷新页面重试'));
            }, timeoutMs);

            zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 3
                },
                ...options
            }, function updateCallback(metadata) {
                const percent = Math.round(metadata.percent);
                if (batchProgressZipStatus) {
                    batchProgressZipStatus.textContent = `压缩中... ${percent}%`;
                }
            }).then(blob => {
                clearTimeout(timeoutTimer);
                if (batchProgressZipStatus) batchProgressZipStatus.textContent = `压缩完成!`;
                resolve(blob);
            }).catch(error => {
                clearTimeout(timeoutTimer);
                if (batchProgressZipStatus) batchProgressZipStatus.textContent = `压缩失败: ${error.message}`;
                reject(error);
            });
        });
    }


    async function handleBatchExtraction() {
        if (!checkJSZipAvailability()) {
            return;
        }

        const cmsObjects = getCMSObjectsFromPage();

        // Check if this is a new page format by detecting hashes
        const hashes = extractHashesFromPage();
        const isNewPageFormat = hashes && hashes.length > 0;

        if (!cmsObjects || cmsObjects.length === 0) {
            if (isNewPageFormat) {
                // For new page format, batch extraction is the same as single extraction
                showMessage('新页面格式中，单次提取即可获取所有内容，无需批量操作。请使用"下载当前页面的MQXLIFF文件"按钮。', 'info');
                return;
            } else {
                throw new Error('未找到CMS对象。请确保页面已完全加载，或尝试手动刷新页面。');
            }
        }

        const batchData = cmsObjects.map((obj, index) => ({
            index,
            cms_id: obj.id,
            title: obj.title,
            version: obj.version,
            status: 'pending',
            payload: null,
            xliffContent: null,
            filename: null,
            error_message: null,
            ui: {}
        }));

        createBatchProgressUI(batchData);

        const extractButton = document.getElementById('ll-floyd-extract-btn');
        const xliffButton = document.getElementById('ll-floyd-xliff-btn');
        const batchButton = document.getElementById('ll-floyd-batch-btn');

        extractButton.disabled = true;
        xliffButton.disabled = true;
        batchButton.textContent = `处理中 0/${cmsObjects.length}`;
        showMessage(`找到 ${cmsObjects.length} 个CMS对象，开始批量处理...`, 'info');

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < batchData.length; i++) {
            const data = batchData[i];
            data.status = 'processing';
            updateBatchProgressRow(data);
            batchButton.textContent = `处理中 ${i + 1}/${cmsObjects.length}`;

            try {
                const payload = await extractSingleCMS(data.cms_id, data.version);

                if (payload && payload.segments && payload.segments.length > 0) {
                    const filename = `${sanitizeFilename(data.title)}_${data.cms_id}.mqxliff`;
                    const xliffContent = makeMQXLIFF(filename, payload.segments, payload.tm_suggestions);

                    if (!xliffContent || xliffContent.trim().length === 0) {
                        throw new Error('生成的MQXLIFF内容为空');
                    }

                    data.status = 'success';
                    data.payload = payload;
                    data.xliffContent = xliffContent;
                    data.filename = filename;
                    successCount++;
                } else {
                    data.status = 'empty';
                    data.error_message = '没有找到任何片段数据或返回了无效的payload';
                    errorCount++;
                }
            } catch (error) {
                data.status = 'error';
                data.error_message = error.message;
                errorCount++;
            }

            updateBatchProgressRow(data);
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        finalizeBatchProgressUI(batchData, successCount, errorCount);
        batchButton.textContent = '提取该项目的所有文件';
        extractButton.disabled = false;
        xliffButton.disabled = false;

        const resultMessage = `批量处理完成！成功: ${successCount}, 失败/为空: ${errorCount}。`;
        showMessage(resultMessage, 'success');
    }

    function generateComprehensiveReport(data) {
        const {
            projectName,
            pageParams,
            cmsObjects,
            processedResults,
            successCount,
            errorCount,
            timestamp
        } = data;

        const xliffFiles = processedResults.filter(r => r.status === 'success');
        const totalSize = xliffFiles.reduce((sum, file) => sum + file.xliffContent.length, 0);

        return `================================================================================
    FBCAT 批量提取综合报告
    ================================================================================

    项目信息:
    -----------
    项目名称: ${projectName}
    任务ID: ${pageParams.translation_task_id}
    任务步骤ID: ${pageParams.translation_task_step_id}
    源语言: ${pageParams.locale}
    目标语言: ${pageParams.translating_locale}
    生成时间: ${new Date().toLocaleString('zh-CN')}
    处理时间戳: ${timestamp}

    处理摘要:
    -----------
    总CMS对象数量: ${cmsObjects.length}
    成功处理数量: ${successCount}
    失败/空数据数量: ${errorCount}
    生成MQXLIFF文件数: ${xliffFiles.length}
    总MQXLIFF内容大小: ${(totalSize / 1024).toFixed(1)} KB

    CMS对象列表:
    -----------
    ${cmsObjects.map((obj, index) => `${index + 1}. ${obj.title} (ID: ${obj.id}, Ver: ${obj.version})`).join('\n')}

    详细处理结果:
    ===============================================================================

    ${processedResults.map((result, index) => {
            let section = `${index + 1}. ${result.title} (ID: ${result.cms_id})
    状态: ${result.status === 'success' ? '✅ 成功' : (result.status === 'empty' ? '⚠️  空数据' : '❌ 失败')}
    版本: ${result.version}`;

            if (result.status === 'success') {
                section += `
    文件名: ${result.filename}
    片段数量: ${result.payload.segments.length}
    TM建议数量: ${result.payload.tm_suggestions ? Object.keys(result.payload.tm_suggestions).length : 0}
    MQXLIFF大小: ${(result.xliffContent.length / 1024).toFixed(1)} KB`;
            } else {
                section += `
    错误信息: ${result.error_message}`;
            }

            return section;
        }).join('\n\n')}

    ================================================================================
    文件下载说明:
    - 本报告和所有成功的MQXLIFF文件都已包含在下载的ZIP压缩包中。
    - 如有问题请检查本报告的错误信息部分。

    报告生成完成 - ${new Date().toLocaleString('zh-CN')}
    ================================================================================`;
    }

    function createBatchProgressUI(batchData) {
        let downloadPanel = document.getElementById('ll-floyd-download-panel');
        if (downloadPanel) downloadPanel.remove();

        downloadPanel = document.createElement('div');
        downloadPanel.id = 'll-floyd-download-panel';

        const title = document.createElement('h3');
        title.textContent = `批量处理进度 (${batchData.length}个对象)`;

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'll-floyd-panel-controls';

        const downloadAllBtn = document.createElement('button');
        downloadAllBtn.id = 'll-floyd-batch-download-all-btn';
        downloadAllBtn.textContent = `等待处理完成...`;
        downloadAllBtn.disabled = true;
        downloadAllBtn.className = 'll-floyd-button ll-floyd-button-primary';
        downloadAllBtn.onclick = () => handleZipDownload(batchData);

        const zipStatus = document.createElement('span');
        zipStatus.id = 'll-floyd-batch-zip-status';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&#x2715;'; // Close icon
        closeBtn.className = 'll-floyd-button-close';
        closeBtn.onclick = () => downloadPanel.remove();

        controlsDiv.appendChild(downloadAllBtn);
        controlsDiv.appendChild(zipStatus);
        controlsDiv.appendChild(closeBtn);

        const fileListDiv = document.createElement('div');
        fileListDiv.id = 'll-floyd-batch-file-list';

        batchData.forEach(data => {
            const row = document.createElement('div');
            row.className = 'll-floyd-batch-row';

            const titleDiv = document.createElement('div');
            titleDiv.textContent = data.title;
            titleDiv.className = 'll-floyd-batch-row-title';

            const statusDiv = document.createElement('div');
            statusDiv.className = 'll-floyd-batch-row-status';

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'll-floyd-batch-row-actions';

            const viewBtn = document.createElement('button');
            viewBtn.textContent = '查看';
            viewBtn.disabled = true;
            viewBtn.className = 'll-floyd-button ll-floyd-button-small ll-floyd-button-secondary';
            viewBtn.onclick = () => displayResultsInModal(data.payload, 'batch');

            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = '下载';
            downloadBtn.disabled = true;
            downloadBtn.className = 'll-floyd-button ll-floyd-button-small ll-floyd-button-success';
            downloadBtn.onclick = () => downloadSingleFile(data.filename, data.xliffContent);

            actionsDiv.appendChild(viewBtn);
            actionsDiv.appendChild(downloadBtn);
            row.appendChild(titleDiv);
            row.appendChild(statusDiv);
            row.appendChild(actionsDiv);
            fileListDiv.appendChild(row);

            data.ui = { row, title: titleDiv, status: statusDiv, viewBtn, downloadBtn };
            updateBatchProgressRow(data);
        });

        downloadPanel.appendChild(title);
        downloadPanel.appendChild(controlsDiv);
        downloadPanel.appendChild(fileListDiv);
        document.body.appendChild(downloadPanel);
    }

    function updateBatchProgressRow(data) {
        const { status, ui } = data;
        const { status: statusDiv, viewBtn, downloadBtn, row } = ui;

        const statusMap = {
            pending: { text: '⚪ 等待中', color: '#6c757d' },
            processing: { text: '🔵 处理中...', color: '#007bff' },
            success: { text: '✅ 成功', color: '#28a745' },
            empty: { text: '⚠️ 空数据', color: '#ffc107' },
            error: { text: '❌ 失败', color: '#dc3545' }
        };

        statusDiv.textContent = statusMap[status].text;
        statusDiv.style.color = statusMap[status].color;

        if (status === 'success') {
            viewBtn.disabled = false;
            downloadBtn.disabled = false;
            row.classList.add('success');
        } else if (status === 'error' || status === 'empty') {
            row.classList.add('error');
        }
    }

    function finalizeBatchProgressUI(batchData, successCount, errorCount) {
        const downloadAllBtn = document.getElementById('ll-floyd-batch-download-all-btn');
        if (successCount > 0) {
            downloadAllBtn.disabled = false;
            downloadAllBtn.textContent = `📥 打包下载全部 (${successCount}个文件)`;
            downloadAllBtn.classList.remove('ll-floyd-button-primary');
            downloadAllBtn.classList.add('ll-floyd-button-danger');
        } else {
            downloadAllBtn.textContent = '无文件可下载';
        }

        const batchButton = document.getElementById('ll-floyd-batch-btn');
        if (batchButton) {
            batchButton.textContent = '重新打开下载面板';
            batchButton.onclick = () => {
                const panel = document.getElementById('ll-floyd-download-panel');
                if (panel) panel.style.display = 'flex';
                else handleBatchExtraction();
            };
        }
    }

    async function handleZipDownload(batchData) {
        const downloadAllBtn = document.getElementById('ll-floyd-batch-download-all-btn');
        downloadAllBtn.disabled = true;

        try {
            const zip = new JSZip();
            const successfulFiles = batchData.filter(d => d.status === 'success');

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const projectName = `fbcat_batch_${pageParams.translation_task_id}_${pageParams.translating_locale}_${timestamp}`;
            const reportContent = generateComprehensiveReport({
                projectName,
                pageParams,
                cmsObjects: batchData.map(d => ({ id: d.cms_id, title: d.title, version: d.version })),
                processedResults: batchData,
                successCount: successfulFiles.length,
                errorCount: batchData.length - successfulFiles.length,
                timestamp
            });
            zip.file(`${projectName}_综合报告.txt`, reportContent);

            for (const data of successfulFiles) {
                zip.file(`xliff/${data.filename}`, data.xliffContent);
            }

            const blob = await generateZipWithTimeout(zip, {});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${projectName}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            downloadAllBtn.textContent = '下载成功!';
            downloadAllBtn.classList.remove('ll-floyd-button-danger');
            downloadAllBtn.classList.add('ll-floyd-button-success');
            setTimeout(() => {
                downloadAllBtn.disabled = false;
                downloadAllBtn.textContent = `📥 打包下载全部 (${successfulFiles.length}个文件)`;
                downloadAllBtn.classList.remove('ll-floyd-button-success');
                downloadAllBtn.classList.add('ll-floyd-button-danger');
            }, 3000);

        } catch (error) {
            const zipStatus = document.getElementById('ll-floyd-batch-zip-status');
            if (zipStatus) zipStatus.textContent = `错误: ${error.message}`;
            alert(`ZIP打包或下载失败: ${error.message}`);
            downloadAllBtn.disabled = false;
        }
    }

    function downloadSingleFile(filename, content) {
        try {
            const blob = new Blob([content], { type: 'application/xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showMessage(`已下载: ${filename}`, 'success');
        } catch (error) {
            alert(`下载文件失败: ${filename}\n错误: ${error.message}`);
        }
    }

    function sanitizeFilename(filename) {
        return filename.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_');
    }

    // ===================================================================
    // 6. 结果展示功能
    // ===================================================================
    function displayResultsInModal(payload, source = 'main') {

        const { segments, tm_suggestions } = payload;

        const mergedData = segments.map(seg => {
            const tm = (tm_suggestions && tm_suggestions[seg.id] && tm_suggestions[seg.id][0]) ? tm_suggestions[seg.id][0] : null;
            return {
                segNumber: seg.segmentNumber,
                id: seg.id,
                originalText: escapeHtml(seg.text),
                translatedText: escapeHtml(getTrgText(seg.translation)),
                confidenceScore: tm ? (tm.confidenceScore * 100).toFixed(0) + '%' : 'N/A',
                fuzzyMatchScore: tm ? (tm.fuzzyMatchScore * 100).toFixed(0) + '%' : 'N/A',
                isICE: tm ? (tm.isICE ? '✔️' : '❌') : 'N/A',
                isMachineTranslated: tm ? (tm.isMachineTranslated ? '✔️' : '❌') : 'N/A',
                tmTranslation: tm ? tm.translationSegment : null
            };
        });

        if (source === 'batch') {
            const downloadPanel = document.getElementById('ll-floyd-download-panel');
            if (downloadPanel) {
                downloadPanel.style.left = '20px';
                downloadPanel.style.transform = 'translateY(-50%)';
                downloadPanel.style.width = '450px';
            }
        }

        let resultsModal = document.getElementById('ll-floyd-results-modal');
        if (resultsModal) resultsModal.remove();

        resultsModal = document.createElement('div');
        resultsModal.id = 'll-floyd-results-modal';

        if (source === 'batch') {
            resultsModal.style.right = '20px';
            resultsModal.style.left = '490px';
            resultsModal.style.width = 'auto';
            resultsModal.style.transform = 'translateY(-50%)';
        }

        const titleBar = document.createElement('div');
        titleBar.className = 'll-floyd-modal-title-bar';

        const title = document.createElement('h3');
        title.textContent = 'FBCAT 提取结果';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&#x2715;';
        closeBtn.className = 'll-floyd-button-close';
        closeBtn.onclick = () => {
            resultsModal.remove();
            if (source === 'batch') {
                const downloadPanel = document.getElementById('ll-floyd-download-panel');
                if (downloadPanel) {
                    downloadPanel.style.left = '50%';
                    downloadPanel.style.transform = 'translate(-50%, -50%)';
                    downloadPanel.style.width = '800px';
                }
            }
        };

        titleBar.appendChild(title);
        titleBar.appendChild(closeBtn);

        const toolbar = document.createElement('div');
        toolbar.className = 'll-floyd-modal-toolbar';

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '显示所有隐藏信息';
        toggleBtn.className = 'll-floyd-button ll-floyd-button-secondary';
        toggleBtn.onclick = function () {
            const table = resultsModal.querySelector('#results-table');
            const isHidden = !table.classList.toggle('show-hidden');
            this.textContent = isHidden ? '显示所有隐藏信息' : '隐藏附加信息';
        };
        toolbar.appendChild(toggleBtn);

        if (source === 'main') {
            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = '下载 MQXLIFF 文件';
            downloadBtn.className = 'll-floyd-button ll-floyd-button-success';
            downloadBtn.onclick = function () {
                this.disabled = true;
                this.textContent = '生成中...';
                try {
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                    const filename = `fbcat_${pageParams.active_cms_id}_${pageParams.translating_locale}_${timestamp}.mqxliff`;
                    const xliffContent = makeMQXLIFF(filename, payload.segments, payload.tm_suggestions);
                    downloadSingleFile(filename, xliffContent);
                    this.textContent = '下载成功！';
                } catch (error) {
                    this.textContent = '下载失败';
                } finally {
                    setTimeout(() => {
                        this.textContent = '下载 MQXLIFF 文件';
                        this.disabled = false;
                    }, 2000);
                }
            };
            toolbar.appendChild(downloadBtn);
        }

        const tableContainer = document.createElement('div');
        tableContainer.className = 'll-floyd-table-container';

        const table = document.createElement('table');
        table.id = 'results-table';

        table.innerHTML = `
                <colgroup>
                <col style="width: 4%;">
                <col class="hidden-col" style="width: 12%;">
                <col style="width: 25%;">
                <col style="width: 25%;">
                <col style="width: 7%;">
                <col class="hidden-col" style="width: 7%;">
                <col class="hidden-col" style="width: 5%;">
                <col class="hidden-col" style="width: 5%;">
                <col style="width: auto;">
                </colgroup>
                <thead>
                    <tr>
                        <th>#</th>
                        <th class="hidden-col">ID</th>
                        <th>原文</th>
                        <th>译文</th>
                        <th>Confidence</th>
                        <th class="hidden-col">Fuzzy</th>
                        <th class="hidden-col">ICE?</th>
                        <th class="hidden-col">机翻?</th>
                        <th>TM Translation Segment Details</th>
                    </tr>
                </thead>
                <tbody>
                    ${mergedData.map(item => `
                        <tr>
                            <td>${item.segNumber}</td>
                            <td class="hidden-col">${item.id}</td>
                            <td><div class="cell-content">${item.originalText}</div></td>
                            <td><div class="cell-content">${item.translatedText}</div></td>
                            <td>${item.confidenceScore}</td>
                            <td class="hidden-col">${item.fuzzyMatchScore}</td>
                            <td class="hidden-col">${item.isICE}</td>
                            <td class="hidden-col">${item.isMachineTranslated}</td>
                            <td>
                                ${item.tmTranslation ? `
                                    <span class="sub-item"><span class="sub-item-label">Text:</span> ${escapeHtml(item.tmTranslation.text || '')}</span>
                                    <span class="sub-item"><span class="sub-item-label">From Previous:</span> ${escapeHtml(item.tmTranslation.translationFromPreviousTranslationAction || '')}</span>
                                    <span class="sub-item"><span class="sub-item-label">Confirmed:</span> ${escapeHtml(item.tmTranslation.confirmedText || '')}</span>
                                    <span class="sub-item"><span class="sub-item-label">Edited:</span> ${escapeHtml(item.tmTranslation.editedText || '')}</span>
                                ` : 'N/A'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;

        tableContainer.appendChild(table);

        resultsModal.appendChild(titleBar);
        resultsModal.appendChild(toolbar);
        resultsModal.appendChild(tableContainer);
        document.body.appendChild(resultsModal);
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // ===================================================================
    // 7. UI初始化
    // ===================================================================

    function initializeUI() {
        if (document.getElementById('ll-floyd-control-panel')) {
            return;
        }

        let wrapper = document.getElementById('ll-floyd-control-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = 'll-floyd-control-wrapper';
            wrapper.dataset.dragging = 'false';
            document.body.appendChild(wrapper);
        }
        controlPanelWrapper = wrapper;

        const panel = document.createElement('div');
        panel.id = 'll-floyd-control-panel';
        panel.setAttribute('aria-hidden', 'false');
        controlPanelElement = panel;

        const panelHeader = document.createElement('div');
        panelHeader.className = 'll-floyd-panel-header';

        const headerTitle = document.createElement('span');
        headerTitle.className = 'll-floyd-panel-header-title';
        headerTitle.textContent = 'LangLink fbCAT';

        panelHeader.appendChild(headerTitle);
        panel.appendChild(panelHeader);

        const extractButton = document.createElement('button');
        extractButton.id = 'll-floyd-extract-btn';
        extractButton.textContent = '等待参数...';
        extractButton.disabled = true;
        extractButton.onclick = handleExtraction;
        extractButton.className = 'll-floyd-button ll-floyd-button-primary';
        extractButton.dataset.noDrag = 'true';

        const xliffButton = document.createElement('button');
        xliffButton.id = 'll-floyd-xliff-btn';
        xliffButton.textContent = '等待参数...';
        xliffButton.disabled = true;
        xliffButton.onclick = handleXliffDownload;
        xliffButton.className = 'll-floyd-button ll-floyd-button-success';
        xliffButton.dataset.noDrag = 'true';

        const batchButton = document.createElement('button');
        batchButton.id = 'll-floyd-batch-btn';
        batchButton.textContent = '等待参数...';
        batchButton.disabled = true;
        batchButton.onclick = handleBatchExtraction;
        batchButton.className = 'll-floyd-button ll-floyd-button-danger';
        batchButton.dataset.noDrag = 'true';

        const versionInfo = document.createElement('div');
        versionInfo.id = 'll-floyd-version-info';
        versionInfo.textContent = `fbCAT v${GM_info.script.version}`;
        versionInfo.className = 'll-floyd-version';
        versionInfo.dataset.noDrag = 'true';

        const messageArea = document.createElement('div');
        messageArea.id = 'll-floyd-message-area';
        messageArea.textContent = '脚本启动中...';
        messageArea.dataset.noDrag = 'true';

        panel.appendChild(versionInfo);
        panel.appendChild(extractButton);
        panel.appendChild(xliffButton);
        panel.appendChild(batchButton);
        panel.appendChild(messageArea);
        let panelIcon = document.getElementById('ll-floyd-control-icon');
        if (!panelIcon) {
            panelIcon = document.createElement('div');
            panelIcon.id = 'll-floyd-control-icon';
            panelIcon.textContent = 'fbCAT';
            panelIcon.title = '点击展开/收起 fbCAT 面板，拖动可移动';
            panelIcon.dataset.dragging = 'false';
        }
        if (!panelIcon.parentElement) {
            controlPanelWrapper.appendChild(panelIcon);
        } else if (panelIcon.parentElement !== controlPanelWrapper) {
            panelIcon.parentElement.removeChild(panelIcon);
            controlPanelWrapper.appendChild(panelIcon);
        }
        controlPanelIcon = panelIcon;
        controlPanelIcon.classList.remove('ll-floyd-icon-minimized');

        if (!panel.parentElement) {
            controlPanelWrapper.appendChild(panel);
        }

        panelIcon.addEventListener('click', () => {
            if (controlPanelWrapper && controlPanelWrapper.dataset.dragging === 'true') {
                controlPanelWrapper.dataset.dragging = 'false';
                return;
            }
            toggleControlPanel();
        });

        enableDrag(controlPanelWrapper, { handle: panel });
        enableDrag(controlPanelWrapper, { handle: panelIcon });

        GM_addStyle(`
                :root {
                    --ll-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    --ll-primary-color: #007bff;
                    --ll-success-color: #28a745;
                    --ll-danger-color: #dc3545;
                    --ll-secondary-color: #6c757d;
                    --ll-light-gray: #f8f9fa;
                    --ll-border-color: #dee2e6;
                    --ll-text-color: #212529;
                    --ll-text-muted: #6c757d;
                    --ll-panel-shadow: 0 6px 20px rgba(0,0,0,0.12);
                    --ll-border-radius: 8px;
                }
                #ll-floyd-control-wrapper {
                    position: fixed; bottom: 20px; right: 20px; z-index: 10000;
                    display: flex; flex-direction: column; align-items: center;
                    gap: 10px; font-family: var(--ll-font-family);
                }
                #ll-floyd-control-panel { 
                    background-color: #ffffff; border: 1px solid var(--ll-border-color);
                    border-radius: var(--ll-border-radius); padding: 15px; 
                    box-shadow: var(--ll-panel-shadow);
                    display: flex; flex-direction: column; gap: 10px; 
                    min-width: 250px; cursor: move;
                    font-family: var(--ll-font-family);
                    max-height: 520px; overflow: hidden;
                    transition: max-height 0.28s ease, opacity 0.22s ease, transform 0.28s ease, padding 0.28s ease, margin 0.28s ease, border-width 0.28s ease;
                }
                .ll-floyd-panel-header {
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 600; font-size: 14px; color: var(--ll-text-color);
                    user-select: none; touch-action: none;
                }
                .ll-floyd-panel-header-title { display: flex; align-items: center; gap: 6px; }
                #ll-floyd-control-panel.ll-floyd-panel-hidden {
                    max-height: 0;
                    opacity: 0;
                    padding-top: 0;
                    padding-bottom: 0;
                    margin: 0;
                    border-width: 0;
                    transform: translateY(-12px);
                    pointer-events: none;
                }
                .ll-floyd-button {
                    padding: 10px 18px; font-size: 14px; font-weight: 500;
                    border: none; border-radius: 6px; cursor: pointer;
                    transition: background-color 0.2s ease-in-out, transform 0.1s ease;
                    color: #fff;
                }
                .ll-floyd-button:hover:not(:disabled) { transform: translateY(-1px); }
                .ll-floyd-button:disabled { background-color: #ced4da; cursor: not-allowed; }
                .ll-floyd-button-primary { background-color: var(--ll-primary-color); }
                .ll-floyd-button-primary:hover:not(:disabled) { background-color: #0069d9; }
                .ll-floyd-button-success { background-color: var(--ll-success-color); }
                .ll-floyd-button-success:hover:not(:disabled) { background-color: #218838; }
                .ll-floyd-button-danger { background-color: var(--ll-danger-color); }
                .ll-floyd-button-danger:hover:not(:disabled) { background-color: #c82333; }
                .ll-floyd-button-secondary { background-color: var(--ll-secondary-color); color: white; }
                .ll-floyd-button-secondary:hover:not(:disabled) { background-color: #5a6268; }
                #ll-floyd-message-area { 
                    font-size: 13px; font-weight: 500; text-align: center; padding-top: 5px; 
                    border-top: 1px solid var(--ll-border-color); margin-top: 5px;
                }
                .ll-floyd-message-error { color: var(--ll-danger-color); }
                .ll-floyd-message-success { color: var(--ll-success-color); }
                .ll-floyd-message-info { color: var(--ll-text-muted); }
                .ll-floyd-version { 
                    font-size: 11px; color: var(--ll-text-muted); text-align: center;
                    font-weight: 500; background: var(--ll-light-gray);
                    padding: 4px 8px; border-radius: 4px; margin-bottom: 8px;
                }
                #ll-floyd-control-icon {
                    width: 56px; height: 56px; border-radius: 50%;
                    background: rgba(0, 123, 255, 0.55);
                    color: #fff; display: flex; align-items: center; justify-content: center;
                    font-weight: 600; letter-spacing: 0.5px; cursor: pointer;
                    box-shadow: var(--ll-panel-shadow);
                    transition: background-color 0.2s ease, transform 0.1s ease;
                    user-select: none; touch-action: none;
                }
                #ll-floyd-control-icon:hover { background: rgba(0, 123, 255, 0.75); transform: translateY(-1px); }
                #ll-floyd-control-icon.ll-floyd-icon-minimized { background: rgba(40, 167, 69, 0.55); }

                /* Batch Download Panel Styles */
                #ll-floyd-download-panel, #ll-floyd-results-modal {
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; border: 1px solid var(--ll-border-color);
                    border-radius: 12px; padding: 25px; z-index: 10001; 
                    width: 800px; max-height: 90vh;
                    display: flex; flex-direction: column; box-shadow: var(--ll-panel-shadow);
                    font-family: var(--ll-font-family);
                }
                #ll-floyd-download-panel h3, #ll-floyd-results-modal h3 {
                    margin: 0 0 20px 0; color: var(--ll-text-color); font-size: 20px; font-weight: 600;
                }
                .ll-floyd-panel-controls, .ll-floyd-modal-title-bar, .ll-floyd-modal-toolbar {
                    margin-bottom: 20px; display: flex; align-items: center; gap: 15px; flex-shrink: 0;
                }
                .ll-floyd-modal-title-bar { justify-content: space-between; }
                #ll-floyd-batch-zip-status { font-size: 13px; color: var(--ll-text-muted); }
                .ll-floyd-button-close {
                    background: transparent; border: none; font-size: 24px;
                    color: var(--ll-text-muted); cursor: pointer; padding: 0 5px;
                    line-height: 1; opacity: 0.7; transition: opacity 0.2s;
                }
                .ll-floyd-button-close:hover { opacity: 1; }
                #ll-floyd-batch-file-list {
                    overflow-y: auto; border: 1px solid var(--ll-border-color); border-radius: var(--ll-border-radius);
                    flex-grow: 1;
                }
                .ll-floyd-batch-row {
                    display: flex; align-items: center; padding: 12px 15px; 
                    border-bottom: 1px solid #e9ecef; background: #fff;
                    transition: background-color 0.2s;
                }
                .ll-floyd-batch-row:last-child { border-bottom: none; }
                .ll-floyd-batch-row.success { background-color: #f2fff5; }
                .ll-floyd-batch-row.error { background-color: #fff8f8; }
                .ll-floyd-batch-row-title {
                    flex: 1; font-weight: 500; color: var(--ll-text-color);
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 15px;
                }
                .ll-floyd-batch-row-status { width: 120px; text-align: center; font-size: 13px; font-weight: bold; }
                .ll-floyd-batch-row-actions { display: flex; gap: 8px; width: 180px; justify-content: flex-end; }
                .ll-floyd-button-small { padding: 5px 12px; font-size: 13px; }

                /* Results Modal & Table Styles */
                #ll-floyd-results-modal { border-color: var(--ll-success-color); z-index: 10002; width: 90vw; }
                #ll-floyd-results-modal h3 { color: var(--ll-success-color); }
                .ll-floyd-table-container { overflow: auto; flex: 1; border: 1px solid var(--ll-border-color); border-radius: var(--ll-border-radius); }
                #results-table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: fixed; }
                #results-table th, #results-table td { 
                    padding: 12px 15px; border-bottom: 1px solid var(--ll-border-color); text-align: left; 
                    vertical-align: top;
                }
                #results-table thead { background-color: var(--ll-light-gray); position: sticky; top: 0; z-index: 10; }
                #results-table th { font-weight: 600; }
                #results-table tr:nth-child(even) { background-color: var(--ll-light-gray); }
                #results-table .cell-content { max-height: 100px; overflow-y: auto; font-family: monospace; white-space: pre-wrap; word-break: break-all; }
                .sub-item { display: block; margin-bottom: 4px; font-family: monospace; font-size: 12px; }
                .sub-item-label { font-weight: bold; color: var(--ll-text-muted); margin-right: 5px; }
                .hidden-col { display: none; }
                #results-table.show-hidden .hidden-col { display: table-cell; }
            `);
    }

    // ===================================================================
    // 8. 初始化和事件监听
    // ===================================================================

    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        sniffParameters(body);
        return originalXHRSend.apply(this, arguments);
    };

    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
        if (init && init.method && init.method.toUpperCase() === 'POST' && init.body) {
            sniffParameters(init.body);
        }
        return originalFetch.apply(this, arguments);
    };

    function onUrlChange() {
        setTimeout(() => {
            extractPageParams();
            updateButtonState(true);
        }, 500);
    }

    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        onUrlChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        onUrlChange();
    };

    window.addEventListener('popstate', onUrlChange);

    function main() {
        initializeUI();
        extractPageParams();

        setTimeout(() => {
            if (checkJSZipAvailability()) {
                updateButtonState();
            }
        }, 1000);
    }

    if (document.readyState !== 'loading') {
        main();
    } else {
        window.addEventListener('DOMContentLoaded', main, { once: true });
    }

    checkForUpdates();

})();
