// ==UserScript==
// @name         Bangumi NSFW 大过滤器
// @version      1.0.1
// @author       wataame
// @match        https://bgm.tv/group/topic/*
// @match        https://bangumi.tv/group/topic/*
// @match        https://chii.in/group/topic/*
// @match        https://bgm.tv/subject/topic/*
// @match        https://bangumi.tv/subject/topic/*
// @match        https://chii.in/subject/topic/*
// @match        https://bgm.tv/blog/*
// @match        https://bangumi.tv/blog/*
// @match        https://chii.in/blog/*
// @match        https://bgm.tv/settings/privacy
// @match        https://bangumi.tv/settings/privacy
// @match        https://chii.in/settings/privacy
// @grant        none
// @license      MIT
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1389779
// @description 自动检测并模糊化 Bangumi 帖子中的 NSFW 图片。
// @downloadURL https://update.greasyfork.org/scripts/538463/Bangumi%20NSFW%20%E5%A4%A7%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/538463/Bangumi%20NSFW%20%E5%A4%A7%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BACKEND_URL = 'https://nsfw.ry.mk';
    const PROCESS_ENDPOINT = `${BACKEND_URL}/process-image`;
    const REPORT_ENDPOINT = `${BACKEND_URL}/report-image`;
    const BLUR_AMOUNT = '35px';
    const HOVER_BLUR_AMOUNT = '30px';
    const STORAGE_KEY_NSFW_THRESHOLD = 'bgm_nsfw_filter_threshold';
    const STORAGE_KEY_SCRIPT_ENABLED = 'bgm_nsfw_filter_enabled';

    let NSFW_THRESHOLDS = {};

    function loadNsfwThresholds() {
        const storedValue = localStorage.getItem(STORAGE_KEY_NSFW_THRESHOLD) || '10';
        const threshold = parseInt(storedValue, 10) / 100;
        NSFW_THRESHOLDS = { 'Porn': threshold, 'Hentai': threshold, 'Sexy': threshold };
        console.log(`Bangumi NSFW Filter: Threshold loaded and set to ${threshold}`);
    }

    function initSettingsUI() {
        const anchor = document.querySelector('#columnA .settings:last-of-type');
        if (!anchor) { console.warn('Bangumi NSFW Filter: Settings anchor not found.'); return; }
        const settingsHTML = `
            <form id="nsfwFilterSettingsForm" style="margin-top: 1.5em;">
                <table align="center" width="98%" cellspacing="0" cellpadding="5" class="settings">
                    <tbody>
                        <tr><td valign="top" colspan="2"><h2 class="subtitle">Bangumi NSFW 大过滤器 (脚本设置)</h2></td></tr>
                        <tr>
                            <td valign="top" width="25%">脚本开关</td>
                            <td valign="top">
                                <input type="checkbox" id="nsfwScriptEnabledCheckbox" style="vertical-align: middle;">
                                <label for="nsfwScriptEnabledCheckbox" style="vertical-align: middle;"> 启用 NSFW 过滤器</label>
                            </td>
                        </tr>
                        <tr>
                            <td valign="top" width="25%">NSFW 识别阈值</td>
                            <td valign="top">
                                <input type="range" id="nsfwThresholdSlider" min="5" max="95" step="1" style="vertical-align: middle;">
                                <span id="nsfwThresholdValue" style="margin-left: 10px; font-weight: bold; width: 40px; display: inline-block;"></span>
                                <p class="tip_j">阈值越低，审查越严格。</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        `;
        anchor.insertAdjacentHTML('afterend', settingsHTML);

        const enabledCheckbox = document.getElementById('nsfwScriptEnabledCheckbox');
        const isEnabled = localStorage.getItem(STORAGE_KEY_SCRIPT_ENABLED) !== 'false';
        enabledCheckbox.checked = isEnabled;
        enabledCheckbox.addEventListener('change', () => {
            localStorage.setItem(STORAGE_KEY_SCRIPT_ENABLED, enabledCheckbox.checked);
            console.log(`Bangumi NSFW Filter: Script enabled set to ${enabledCheckbox.checked}`);
        });

        const slider = document.getElementById('nsfwThresholdSlider');
        const valueDisplay = document.getElementById('nsfwThresholdValue');
        const updateDisplay = (value) => { valueDisplay.textContent = `${value}%`; };
        const saveThreshold = (value) => {
            localStorage.setItem(STORAGE_KEY_NSFW_THRESHOLD, value);
            console.log(`Bangumi NSFW Filter: Threshold saved to ${value}%`);
            loadNsfwThresholds();
        };
        const currentStoredValue = localStorage.getItem(STORAGE_KEY_NSFW_THRESHOLD) || '10';
        slider.value = currentStoredValue;
        updateDisplay(currentStoredValue);
        slider.addEventListener('input', () => updateDisplay(slider.value));
        slider.addEventListener('change', () => saveThreshold(slider.value));
        console.log('Bangumi NSFW Filter: Settings UI injected.');
    }

    const allCSS = `
        .nsfw-image-wrapper { position: relative; display: inline-block; min-width: 32px; min-height: 32px; vertical-align: middle; line-height: 15px; }
        .nsfw-image-wrapper:hover .nsfw-report-bar { opacity: 1; visibility: visible; }
        .nsfw-image-wrapper img.nsfw-image-element { display: block; height: auto; transition: filter 0.3s ease-in-out; }
        .nsfw-image-wrapper img.nsfw-image-element.nsfw-blurred { filter: blur(${BLUR_AMOUNT}); }
        .nsfw-image-wrapper img.nsfw-image-element.nsfw-blurred.unlocked:hover { filter: blur(${HOVER_BLUR_AMOUNT}); }
        .nsfw-image-wrapper.clickable { cursor: pointer; }
        .nsfw-report-bar { position: absolute; bottom: 5px; right: 5px; background: rgba(0,0,0,0.6); border-radius: 4px; padding: 2px 5px; opacity: 0; visibility: hidden; transition: opacity 0.2s, visibility 0.2s; z-index: 11; font-family: sans-serif; }
        .nsfw-report-bar .report-msg { font-size: 10px; color: white; user-select: none; }
        .nsfw-report-bar .report-msg.clickable { cursor: pointer; }
        .nsfw-report-bar .report-msg.clickable:hover { text-decoration: underline; color: #a5d6a7; }
        .nsfw-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 6px 12px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            font-family: sans-serif;
            z-index: 10;
            pointer-events: none;
            user-select: none;
        }
        .nsfw-loader {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 32px;
            height: 32px;
            margin-top: -16px;
            margin-left: -16px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top-color: #ffffff;
            border-radius: 50%;
            animation: nsfw-spin 1s linear infinite;
            z-index: 12;
        }
        @keyframes nsfw-spin {
            to {
                transform: rotate(360deg);
            }
        }
        #nsfw-report-dialog-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; }
        #nsfw-report-dialog { background: #fdfdfd; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); width: 450px; max-width: 90%; font-family: sans-serif; }
        .nsfw-report-dialog-header { padding: 12px 15px; border-bottom: 1px solid #e0e0e0; font-size: 16px; font-weight: bold; color: #333; }
        .nsfw-report-dialog-content { padding: 20px 15px; line-height: 1.6; font-size: 14px; }
        .nsfw-report-dialog-footer { padding: 10px 15px; text-align: right; border-top: 1px solid #e0e0e0; background: #f7f7f7; }
        .nsfw-report-dialog-footer button { margin-left: 10px; padding: 5px 15px; border-radius: 4px; border: 1px solid #ccc; cursor: pointer; }
    `;
    function addGlobalStyle(css) {
        const style = document.createElement('style'); style.type = 'text/css';
        style.appendChild(document.createTextNode(css)); document.head.appendChild(style);
    }

    async function fetchWithTimeout(resource, options = {}, timeout = 10000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(resource, { ...options, signal: controller.signal });
            clearTimeout(id); return response;
        } catch (error) { clearTimeout(id); throw error; }
    }

    async function reportImage(imageUrl, reportType, reportBar) {
        try {
            reportBar.innerHTML = `<span class="report-msg">正在报告...</span>`;
            const payload = JSON.stringify({ image_url: imageUrl, report_type: reportType });
            const response = await fetchWithTimeout(REPORT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload });
            if (!response.ok) { throw new Error(`Report request failed (${response.status})`); }
            const result = await response.json();
            reportBar.innerHTML = `<span class="report-msg">${result.message || '感谢报告!'}</span>`;
        } catch (error) {
            console.error('Bangumi NSFW Filter: Reporting error', error);
            reportBar.innerHTML = `<span class="report-msg" style="color: #ef9a9a;">报告失败</span>`;
        }
    }

    function isImageEligible(img) {
        if (img.dataset.nsfwProcessed === 'true' || img.closest('.nsfw-image-wrapper')) return false;
        if (img.closest('a.avatar, .avatar') || img.classList.contains('avatarNeue')) return false;
        if (img.src && (img.src.includes('/img/smiles/') || img.getAttribute('smileid') || img.classList.contains('emoji'))) return false;
        if (img.src && img.src.includes('/img/code/')) return false;
        if (!img.src || img.src.startsWith('blob:') || img.src.startsWith('data:')) return false;
        if (!img.closest('.topic_content, .blog_entry, .message, .cmt_sub_content')) return false;
        if (img.complete && img.naturalWidth > 0 && (img.naturalWidth <= 16 && img.naturalHeight <= 16)) return false;
        return true;
    }

    function cleanupAndFinalize(imgElement, wrapper) {
        if (imgElement.parentNode === wrapper) {
            wrapper.parentNode.insertBefore(imgElement, wrapper);
            wrapper.remove();
        }
    }

    function showReportDialog(imageUrl, currentStatusText, reportBarElement) {
        const existingDialog = document.getElementById('nsfw-report-dialog-overlay');
        if (existingDialog) existingDialog.remove();

        const overlay = document.createElement('div');
        overlay.id = 'nsfw-report-dialog-overlay';

        const dialogHTML = `
            <div id="nsfw-report-dialog">
                <div class="nsfw-report-dialog-header">报告确认</div>
                <div class="nsfw-report-dialog-content">
                    <p>当前判定: <strong>${currentStatusText}</strong></p>
                    <p>点击进行报告，达到3人报告将被确认</p>
                </div>
                <div class="nsfw-report-dialog-footer">
                    <button id="nsfw-report-cancel">取消</button>
                    <button id="nsfw-report-safe" class="inputBtn" style="background-color: #43A047; color: white; border-color: #43A047;">报告为 SFW</button>
                    <button id="nsfw-report-nsfw" class="inputBtn" style="background-color: #E53935; color: white; border-color: #E53935;">报告为 NSFW</button>
                </div>
            </div>
        `;
        overlay.innerHTML = dialogHTML;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        const closeDialog = () => {
            overlay.remove();
            document.body.style.overflow = '';
        };

        overlay.querySelector('#nsfw-report-nsfw').onclick = () => {
            reportImage(imageUrl, 'nsfw', reportBarElement);
            closeDialog();
        };
        overlay.querySelector('#nsfw-report-safe').onclick = () => {
            reportImage(imageUrl, 'safe', reportBarElement);
            closeDialog();
        };
        overlay.querySelector('#nsfw-report-cancel').onclick = closeDialog;
        overlay.onclick = (e) => { if (e.target === overlay) closeDialog(); };
    }

    async function analyzeAndFinalizeImage(imgElement, wrapper, originalSrc) {
        const reportBar = document.createElement('div');
        reportBar.className = 'nsfw-report-bar';

        try {
            wrapper.appendChild(reportBar);
            const payload = JSON.stringify({ image_url: originalSrc });
            const response = await fetchWithTimeout(PROCESS_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload });
            if (!response.ok) { const errText = await response.text(); throw new Error(`Backend request failed (${response.status}): ${errText}`); }
            const predictions = await response.json();
            if (predictions.error) { throw new Error(`Backend error: ${predictions.error}`); }

            let isNsfw = false;
            let shortClassificationText = '';
            let longClassificationText = '';

            if (predictions.override) {
                isNsfw = (predictions.override === 'nsfw');
                const resultText = isNsfw ? 'NSFW' : 'SFW';
                shortClassificationText = `社区判定: ${resultText}`;
                longClassificationText = shortClassificationText;
            } else if (typeof predictions === 'object' && predictions !== null) {
                let highestNsfwScore = 0;
                let highestNsfwClass = '';
                for (const className in NSFW_THRESHOLDS) {
                    const apiResponseKey = className.toLowerCase();
                    if (predictions.hasOwnProperty(apiResponseKey) && typeof predictions[apiResponseKey] === 'number' && predictions[apiResponseKey] >= NSFW_THRESHOLDS[className]) {
                        isNsfw = true;
                        if (predictions[apiResponseKey] > highestNsfwScore) {
                            highestNsfwScore = predictions[apiResponseKey];
                            highestNsfwClass = className;
                        }
                    }
                }
                if (isNsfw) {
                    shortClassificationText = `自动判定: NSFW`;
                    longClassificationText = `自动判定: NSFW (${highestNsfwClass}: ${(highestNsfwScore * 100).toFixed(1)}%)`;
                } else {
                    shortClassificationText = '自动判定: SFW';
                    longClassificationText = shortClassificationText;
                }
            }

            if (shortClassificationText) {
                reportBar.innerHTML = `<span class="report-msg clickable" title="点击可重新报告此图片">${shortClassificationText}</span>`;
                reportBar.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showReportDialog(originalSrc, longClassificationText, reportBar);
                });
            } else {
                reportBar.remove();
            }

            if (isNsfw) {
                const nsfwLabel = document.createElement('div');
                nsfwLabel.className = 'nsfw-indicator';
                nsfwLabel.textContent = 'NSFW';
                wrapper.appendChild(nsfwLabel);

                wrapper.classList.add('clickable');
                wrapper.title = `${longClassificationText}. Click to view.`;
                wrapper.addEventListener('click', function unblurImage(e) {
                    if (e.target.closest('.nsfw-report-bar')) return;
                    imgElement.classList.remove('nsfw-blurred');
                    imgElement.classList.add('unlocked');
                    wrapper.classList.remove('clickable');
                    wrapper.title = longClassificationText;

                    const label = wrapper.querySelector('.nsfw-indicator');
                    if (label) {
                        label.remove();
                    }
                }, { once: true });
            } else {
                imgElement.classList.remove('nsfw-blurred');
                wrapper.title = longClassificationText;
            }

        } catch (error) {
            console.error('Bangumi NSFW Filter: Error processing image', originalSrc, error.name === 'AbortError' ? 'Request Timeout' : error.message);
            if (wrapper) wrapper.title = `Error: ${error.name === 'AbortError' ? 'Request Timeout' : (error.message || 'Could not process image').substring(0, 100)}`;
            reportBar.remove();
            imgElement.classList.remove('nsfw-blurred');
        } finally {
            const loader = wrapper.querySelector('.nsfw-loader');
            if (loader) {
                loader.remove();
            }
        }
    }

    function findAndHandleImageElement(img) {
        if (!isImageEligible(img)) return;
        img.dataset.nsfwProcessed = 'true';

        const wrapper = document.createElement('div');
        wrapper.className = 'nsfw-image-wrapper';

        const loader = document.createElement('div');
        loader.className = 'nsfw-loader';
        wrapper.appendChild(loader);

        img.classList.add('nsfw-image-element', 'nsfw-blurred');

        if (img.parentNode) img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        const handleImageError = () => cleanupAndFinalize(img, wrapper);
        img.onerror = handleImageError;

        const startAnalysis = () => {
             if (img.naturalWidth > 0 && (img.naturalWidth <= 16 && img.naturalHeight <= 16)) {
                 cleanupAndFinalize(img, wrapper);
                 img.classList.remove('nsfw-blurred');
             } else {
                 analyzeAndFinalizeImage(img, wrapper, img.src);
             }
        };

        if (img.complete) {
            startAnalysis();
        } else {
            img.onload = startAnalysis;
        }
    }

    let observer;
    function observeDOMChanges() {
        if (observer) observer.disconnect();
        observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.addedNodes) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'IMG') findAndHandleImageElement(node);
                            else node.querySelectorAll('img').forEach(findAndHandleImageElement);
                        }
                    }
                }
            }
        });
        observer.observe(document.getElementById('main') || document.body, { childList: true, subtree: true });
    }

    function initialScan() {
        document.querySelectorAll('img').forEach(findAndHandleImageElement);
    }

    function runFilterLogic() {
        const isEnabled = localStorage.getItem(STORAGE_KEY_SCRIPT_ENABLED) !== 'false';
        if (!isEnabled) {
            console.log('Bangumi NSFW Filter: Script is disabled by user setting.');
            return;
        }

        addGlobalStyle(allCSS);
        initialScan();
        observeDOMChanges();
    }

    loadNsfwThresholds();
    function scheduleMainLogic() {
        if (window.location.pathname === '/settings/privacy') {
            initSettingsUI();
        } else {
            runFilterLogic();
        }
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(scheduleMainLogic, 200);
    } else {
        window.addEventListener('load', () => setTimeout(scheduleMainLogic, 200), { once: true });
    }

})();