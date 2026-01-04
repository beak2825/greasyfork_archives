// ==UserScript==
// @name        小雅爬爬爬
// @match       https://*.ai-augmented.com/*
// @grant       none
// @require     https://update.greasyfork.org/scripts/518632/1489865/jszip-min-js.js
// @description 🚀 小雅平台课件下载利器！批量下载、排序、筛选、导出等一应俱全！更多功能等你发掘！
// @license     MIT
// @author      Yi
// @version     1.5.2.3
// @icon        https://www.ai-augmented.com/static/logo3.1dbbea8f.png
// @namespace   https://greasyfork.org/users/1268039
// @homepageURL https://github.com/zygame1314/XiaoyaDownloader
// @supportURL  https://xiaoya.zygame1314.site
// @downloadURL https://update.greasyfork.org/scripts/488536/%E5%B0%8F%E9%9B%85%E7%88%AC%E7%88%AC%E7%88%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/488536/%E5%B0%8F%E9%9B%85%E7%88%AC%E7%88%AC%E7%88%AC.meta.js
// ==/UserScript==

var isProgressBarVisible = true;
var styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
    body,
    body * {
        font-family: 'Microsoft YaHei', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
    }

    .custom-checkbox {
        appearance: none;
        width: 25px;
        height: 25px;
        background-color: #fff;
        border: 2px solid #ffa500;
        border-radius: 50%;
        margin-right: 10px;
        cursor: pointer;
        position: relative;
        transition: all 0.3s ease;
        overflow: hidden;
    }

    .custom-checkbox::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: 15px;
        height: 15px;
        background-color: #ffa500;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .custom-checkbox:checked::before {
        transform: translate(-50%, -50%) scale(1);
        animation: newpulse 0.5s ease;
    }

    .custom-checkbox:hover {

    }

    .custom-checkbox:checked {
        border-color: #ff8c00;
        animation: rotate 0.5s ease;
    }

    .glowing-text {
        background: linear-gradient(90deg, #ffa500, #ff8c00, #ffa500);
        background-size: 200% 100%;
        animation: flowingGradient 3s ease infinite;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    @keyframes flowingGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    @keyframes slideInFade {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideOutFade {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }

    .new-history-item {
        animation: slideInFade 0.5s ease-out forwards;
    }

    .remove-history-item {
        animation: slideOutFade 0.5s ease-in forwards;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }

    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
    }

    .popup-show {
        animation: fadeIn 0.3s ease-out forwards;
    }

    .popup-hide {
        animation: fadeOut 0.3s ease-in forwards;
    }

    @keyframes glowPulse {
        0% {
            box-shadow: 0 0 5px #fcbb34;
        }
        50% {
            box-shadow: 0 0 15px #fcbb34, 0 0 20px #f0932b; /* 在中间加强发光 */
        }
        100% {
            box-shadow: 0 0 5px #fcbb34;
        }
    }

    #teacherInfoContainer, #userSearchContainer {
        .title {
            color: #333;
            border-bottom: 2px solid #fcbb34;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .teacher-list, .user-info {
            list-style-type: none;
            padding: 0;
        }
        .teacher-item, .user-info p {
            background-color: #fff;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
        }
        .teacher-item:hover, .user-info p:hover {
            background-color: #FFE0B2;
            transform: translateX(5px);
        }
        .teacher-name, .user-info strong {
            font-weight: bold;
            color: #e69b00;
        }
        .teacher-number {
            color: #757575;
            font-size: 0.9em;
        }
        .loading, .no-data {
            text-align: center;
            color: #757575;
        }
        .dot {
            animation: blink 1s infinite;
        }
        @keyframes blink {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
        }
        .search-teacher-input {
            width: 200px;
            padding: 8px;
            border: 1px solid #FFD180;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        .search-teacher-button {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            background-color: #fcbb34;
            color: #fff;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .search-teacher-button:hover {
            background-color: #e69b00;
        }
        .search-teacher-results {
            margin-top: 10px;
            border: 1px solid #FFD180;
            padding: 10px;
            border-radius: 4px;
            background-color: #fff;
        }
        .search-teacher-hint {
            color: #757575;
            font-style: italic;
            text-align: center;
            margin-top: 10px;
        }
    }
    .failed-file {
        background-color: #ffeeee;
        padding: 5px;
        margin: 5px 0;
        border-radius: 5px;
    }

    .retry-btn {
        margin-left: 10px;
        padding: 2px 5px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 3px;
        cursor: pointer;
    }

    .retry-btn:hover {
        background-color: #e0e0e0;
    }

    .failed-file {
        opacity: 0;
        transform: translateX(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .custom-select {
        position: relative;
        font-family: 'Microsoft YaHei', sans-serif;
        flex: 1;
        margin-right: 10px;
        z-index: 10000;
    }

    .custom-select select {
        display: none;
    }

    .select-selected {
        background-color: white;
        border: 2px solid #ffa500;
        border-radius: 20px;
        padding: 0 40px 0 15px;
        height: 38px;
        line-height: 38px;
        cursor: pointer;
        user-select: none;
        font-size: 14px;
        font-weight: bold;
        color: #ffa500;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
    }

    .select-selected:after {
        position: absolute;
        content: "";
        top: 50%;
        right: 15px;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-color: #ffa500 transparent transparent transparent;
        transition: all 0.3s ease;
        transform: translateY(-50%);
    }

    .select-selected.select-arrow-active {
        border-radius: 20px 20px 0 0;
        border-bottom-color: transparent;
    }

    .select-selected.select-arrow-active:after {
        border-color: transparent transparent #ffa500 transparent;
        top: 50%;
        transform: translateY(-25%);
    }

    .select-items div,.select-selected {
        font-weight: bold;
        color: #ffa500;
        padding: 8px 15px;
        cursor: pointer;
        user-select: none;
    }

    .select-items {
        position: absolute;
        background-color: white;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 10001;
        border: 2px solid #ffa500;
        border-top: none;
        border-radius: 0 0 20px 20px;
        max-height: 200px;
        overflow-y: auto;
        box-shadow: 0 4px 8px rgba(255, 165, 0, 0.2);
        margin-top: -2px;
    }

    .select-hide {
        display: none;
    }

    .select-items div {
        padding: 8px 15px;
        display: flex;
        align-items: center;
        min-height: 38px;
        box-sizing: border-box;
    }

    .select-items div:hover, .same-as-selected {
        background-color: rgba(255, 165, 0, 0.2);
    }

    .select-selected:hover, .custom-select:focus-within .select-selected {
        border-color: #ff8c00;
        box-shadow: 0 0 8px rgba(255, 165, 0, 0.5);
    }

    .select-items::-webkit-scrollbar {
        width: 8px;
    }

    .select-items::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 0 0 20px 0;
    }

    .select-items::-webkit-scrollbar-thumb {
        background: #ffa500;
        border-radius: 10px;
    }

    .select-items::-webkit-scrollbar-thumb:hover {
        background: #ff8c00;
    }

    .select-items div:last-child {
        border-radius: 0 0 18px 18px;
    }
`;
document.head.appendChild(styleSheet);

(function () {
    'use strict';
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
    script.type = 'module';
    document.head.appendChild(script);

    script.onload = () => {
        console.log('dotlottie-player模块已导入成功！');
    };

    script.onerror = () => {
        console.error('无法导入dotlottie-player模块！');
    };
})();

// 加载自定义过滤器设置
function loadCustomFilters() {
    try {
        const savedFilters = localStorage.getItem('customQuickFilters');
        if (savedFilters) {
            const parsedFilters = JSON.parse(savedFilters);
            if (Array.isArray(parsedFilters) && parsedFilters.length === window.quickFilters.length) {
                return parsedFilters;
            }
        }
    } catch (error) {
        console.error('加载自定义过滤器时出错:', error);
    }
    return null;
}

let course_resources;
let historyListElement;
let failedContainer;
let failedToggleButton;
let noErrorsMessage;
let forcedExpandedItems = new Set();
let svgElementIds = [];
let originalOrder = null;
let historyPopup = null;
let guideModal = null;
let isEasterEggActivated = false;
let downloadHistory = [];
window.currentSearchKeyword = '';
window.currentFilterCategory = '';
// 定义快速筛选的类别选项
window.quickFilters = [
    { label: "全部", value: "" },
    { label: "文档", value: "doc,docx,pdf,txt,odt,rtf,html,htm,xls,xlsx,ppt,pptx,odp,xmind" },
    { label: "图片", value: "jpg,jpeg,png,gif,bmp,tiff,svg,webp,tif" },
    { label: "音频", value: "mp3,wav,ogg,flac,aac,m4a,wma,aiff,ape,midi" },
    { label: "压缩包", value: "zip,rar,7z,gz,bz2,tar" }
];
const hostname = window.location.hostname;

// 应用保存的自定义过滤器
const savedFilters = loadCustomFilters();
if (savedFilters) {
    window.quickFilters = savedFilters;
}

// 等待 iframe 加载完成
function waitForIframe(selector, callback) {
    const iframe = document.querySelector(selector);
    if (iframe && iframe.contentDocument.readyState === 'complete') {
        callback(iframe); // iframe 已加载，执行回调
    } else {
        setTimeout(() => waitForIframe(selector, callback), 50);
    }
}

// 获取 SVG 元素 ID (仅数字)
function getSvgElementIds(iframe) {
    const iframeDocument = iframe.contentDocument;
    const targetSvgElement = iframeDocument.querySelector("body > svg > g");
    const gElementsWithId = targetSvgElement.querySelectorAll("g[id]");

    // 过滤出纯数字 ID
    const numericIds = Array.from(gElementsWithId)
    .filter(element => /^\d+$/.test(element.id))
    .map(element => element.id);
    return numericIds;
}

// 处理 iframe 的回调函数
function handleIframeLoad(iframe) {
    console.log("目标 iframe 已加载完成！");

    // 跨域处理
    try {
        svgElementIds = getSvgElementIds(iframe);
        console.log(svgElementIds);
    } catch (error) {
        console.error("无法访问 iframe 内容，可能存在跨域限制:", error);
    }
}

// 监视页面的变化
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'IFRAME') {
                    waitForIframe("#xy_app_content iframe", handleIframeLoad);
                }
            }
        }
    }
});

// 开始监视
observer.observe(document.body, { childList: true, subtree: true });

// 判断是否为视频文件
function isVideoFile(mimetype, filename) {
    const videoExtensions = [
        'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v',
        'mpeg', 'mpg', '3gp', 'ts', 'vob', 'ogv', 'divx', 'rm', 'rmvb', 'f4v'
    ];
    const extension = filename.split('.').pop().toLowerCase();
    return videoExtensions.includes(extension);
}

// 获取课程访问token
async function getCourseAccessToken(groupId) {
    const token = getCookie();
    const url = `https://${hostname}/api/jx-iresource/statistics/group/visit`;

    try {
        const visitResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ group_id: groupId })
        });

        const visitData = await visitResponse.json();
        if (!visitData.success) return null;

        const authUrl = `https://${hostname}/api/jx-iresource/group/access/authorization`;
        const authResponse = await fetch(`${authUrl}?site_id=${visitData.data.site_id}&role_type=4`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const authData = await authResponse.json();
        return authData.data?.access_group_token;
    } catch (error) {
        console.error('获取访问token失败:', error);
        return null;
    }
}

async function getCourseResources(groupId) {
    const token = getCookie();
    const url = `https://${hostname}/api/jx-iresource/resource/queryCourseResources?group_id=${groupId}`;

    try {
        let response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json; charset=utf-8'
            }
        });

        let responseData = await response.json();

        if (responseData.code === 50007) {
            const accessToken = await getCourseAccessToken(groupId);
            if (accessToken) {
                response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json; charset=utf-8',
                        'X-Course-Access': accessToken
                    }
                });
                responseData = await response.json();
            }
        }

        if (!responseData.success) {
            throw new Error(`获取课程资源失败: ${responseData.message}`);
        }

        return responseData.data;

    } catch (error) {
        console.error('获取课程资源出错:', error);
        return null;
    }
}

function isValidCourseUrl() {
    return window.location.href.startsWith(`https://${hostname}/app/jx-web/mycourse/`);
}

function getGroupIdFromUrl() {
    try {
        if (!isValidCourseUrl()) {
            return null;
        }
        const pathname = window.location.pathname;
        const match = pathname.match(/\/mycourse\/(\d{19})/);
        if (!match) {
            console.warn('未找到有效的课程ID');
            return null;
        }
        return match[1];
    } catch (error) {
        console.error('获取课程ID时出错:', error);
        return null;
    }
}

function decryptFileUrl(encryptedUrl) {
    try {
        // 生产环境的key和vector
        const key = "94374647";
        const vector = "99526255";

        // 还原Base64 URL安全字符
        const base64Str = encryptedUrl
        .replace(/_/g, '+')
        .replace(/\*/g, '/')
        .replace(/-/g, '=');

        // 创建DES-CBC解密器
        const keyUtf8 = window.CryptoJS.enc.Utf8.parse(key);
        const ivUtf8 = window.CryptoJS.enc.Utf8.parse(vector);

        // 解密
        const decrypted = window.CryptoJS.DES.decrypt({
            ciphertext: window.CryptoJS.enc.Base64.parse(base64Str)
        }, keyUtf8, {
            iv: ivUtf8,
            mode: window.CryptoJS.mode.CBC,
            padding: window.CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(window.CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('URL解密失败:', error);
        return encryptedUrl;
    }
}

async function parseContent() {
    if (!isValidCourseUrl()) {
        return;
    }
    window.currentSearchKeyword = '';
    window.currentFilterCategory = '';

    const groupId = getGroupIdFromUrl();
    if (!groupId) {
        showNotification('无法获取课程ID', 'error');
        return;
    }

    // 从API获取课程资源
    course_resources = await getCourseResources(groupId);

    if (!course_resources) {
        showNotification('获取课程资源失败', 'error');
        return;
    }

    // 重置搜索筛选
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.value = '';
    }
    const quickFilterSelect = document.getElementById("quickFilterSelect");
    if (quickFilterSelect) {
        quickFilterSelect.selectedIndex = 0;
    }

    var download_list = document.getElementById("download_list");
    download_list.innerHTML = '<h3 style="color:#fcbb34; font-weight:bold;">课程附件清单</h3>';

    failedContainer = document.createElement('div');
    failedContainer.id = 'failedContainer';
    failedContainer.style.cssText = `
        display: none;
        margin-top: 10px;
        border: 1px solid #ffcccc;
        border-radius: 5px;
        padding: 10px;
        background-color: #fff5f5;
        max-height: 200px;
        overflow-y: auto;
    `;
    noErrorsMessage = document.createElement('div');
    noErrorsMessage.style.cssText = `
        display: none;
        text-align: center;
        padding: 10px;
        color: #4caf50;
        font-weight: bold;
    `;
    noErrorsMessage.textContent = '太棒了！没有任何错误 (≧▽≦)';

    failedToggleButton = document.createElement('button');
    failedToggleButton.textContent = '显示失败项 (0)';
    failedToggleButton.style.cssText = `
        margin-top: 10px;
        padding: 5px 10px;
        background-color: #ff9999;
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
        font-weight: bold;
        transition: transform 0.3s ease;
    `;
    failedToggleButton.onmouseover = () => {
        failedToggleButton.style.transform = 'scale(1.05)';
    };
    failedToggleButton.onmouseout = () => {
        failedToggleButton.style.transform = 'scale(1)';
    };
    failedToggleButton.onclick = toggleFailedContainer;

    download_list.appendChild(failedToggleButton);
    download_list.appendChild(failedContainer);
    failedContainer.appendChild(noErrorsMessage);
    updateFailedCount();

    // 生成文件列表UI
    function createFileItem(resource) {
        let file_name = resource.name;
        let create_time = new Date(resource.created_at).toLocaleDateString();
        let update_time = new Date(resource.updated_at).toLocaleDateString();

        var file_container = document.createElement('div');
        file_container.className = 'file-item';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'custom-checkbox';
        checkbox.setAttribute('data-visible', 'true');
        checkbox.id = 'file-checkbox-' + resource.id;

        checkbox.addEventListener('change', function () {
            updateTreeCheckbox(this);
            syncTreeWithDownloadList();
        });

        var fileIconInfo = getFileIconSvg(file_name);
        var fileIcon = document.createElement('span');
        fileIcon.className = `file-icon ${fileIconInfo.colorClass}`;
        fileIcon.innerHTML = fileIconInfo.svg;

        var file_info = document.createElement('div');
        file_info.className = 'file-info';

        var fileName = document.createElement('div');
        fileName.className = 'file-name';
        fileName.textContent = file_name;
        fileName.title = file_name;

        var fileDetails = document.createElement('div');
        fileDetails.className = 'file-details';

        const svgIcons = {
            create: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
            update: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"></path></svg>'
        };

        var dateContainer = document.createElement('div');
        dateContainer.style.display = 'flex';
        dateContainer.style.justifyContent = 'space-between';

        var dateElement = document.createElement('span');
        dateElement.style.display = 'flex';
        dateElement.style.alignItems = 'center';

        if (create_time === update_time) {
            dateElement.innerHTML = `${svgIcons.create} 创建/更新: ${create_time}`;
            dateElement.title = '创建和更新日期';
        } else {
            dateElement.innerHTML = `
                ${svgIcons.create} 创建: ${create_time}
                <span style="margin: 0 8px;"></span>
                ${svgIcons.update} 更新: ${update_time}
            `;
            dateElement.title = '创建日期 / 更新日期';
        }

        dateContainer.appendChild(dateElement);
        fileDetails.appendChild(dateContainer);
        file_info.appendChild(fileName);
        file_info.appendChild(fileDetails);

        var downloadLink = document.createElement('a');
        downloadLink.className = 'download-link';
        downloadLink.href = '#';
        downloadLink.target = "_blank";
        downloadLink.title = `下载 ${file_name}`;
        downloadLink.setAttribute('data-created-at', resource.created_at);
        downloadLink.setAttribute('data-updated-at', resource.updated_at);
        downloadLink.setAttribute('data-origin-name', file_name);
        downloadLink.setAttribute('data-resource-id', resource.id);
        downloadLink.setAttribute('data-path', resource.path);
        downloadLink.setAttribute('data-parent-id', resource.parent_id);
        downloadLink.setAttribute('data-quote-id', resource.quote_id);
        downloadLink.draggable = true;

        var downloadIcon = document.createElement('span');
        downloadIcon.className = 'download-icon';
        downloadIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: translateY(2px);"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';

        downloadLink.appendChild(downloadIcon);

        // 点击下载按钮时获取下载链接
        downloadLink.addEventListener('click', async function (event) {
            event.preventDefault();
            const downloadIcon = this.querySelector('.download-icon');
            downloadIcon.innerHTML = '<span class="loading-spinner"></span>';

            try {
                totalDownloads++;
                updateTotalProgress();

                const fileUrl = await window.getDownloadUrl(resource.quote_id);
                courseDownload(fileUrl, file_name);
            } catch (error) {
                console.error('获取下载链接失败:', error);
                addFailedFileNotification(file_name);
                completedDownloads++;
                updateTotalProgress();
            } finally {
                downloadIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: translateY(2px);"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';
            }
        });

        var previewLink = document.createElement('a');
        previewLink.className = 'preview-link';
        previewLink.href = '#';
        previewLink.title = `预览 ${file_name}`;
        previewLink.setAttribute('data-created-at', resource.created_at);
        previewLink.setAttribute('data-updated-at', resource.updated_at);
        previewLink.setAttribute('data-origin-name', file_name);
        previewLink.setAttribute('data-resource-id', resource.id);
        previewLink.setAttribute('data-path', resource.path);
        previewLink.setAttribute('data-parent-id', resource.parent_id);

        var previewIcon = document.createElement('span');
        previewIcon.className = 'preview-icon';
        previewIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: translateY(2px);"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        previewLink.appendChild(previewIcon);

        previewLink.addEventListener('click', async function (event) {
            event.preventDefault();
            const previewIcon = this.querySelector('.preview-icon');
            previewIcon.innerHTML = '<span class="loading-spinner"></span>';

            try {
                const fileUrl = await window.getDownloadUrl(resource.quote_id);
                previewFile(file_name, fileUrl);
            } catch (error) {
                console.error('获取预览链接失败:', error);
                showNotification('获取预览链接失败', 'error');
            } finally {
                previewIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: translateY(2px);"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
            }
        });

        file_container.appendChild(checkbox);
        file_container.appendChild(fileIcon);
        file_container.appendChild(file_info);
        file_container.appendChild(previewLink);
        file_container.appendChild(downloadLink);
        return file_container;
    }

    // 获取下载链接的函数
    window.getDownloadUrl = async function (quoteId) {
        const maxRetries = 3;
        const retryDelay = 1000;
        let retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                const token = getCookie();
                const response = await fetch('https://' + hostname + '/api/jx-oresource/cloud/file_url/' + quoteId, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (data.success) {
                    let fileUrl = data.data.url;
                    if (data.data.is_encryption) {
                        fileUrl = decryptFileUrl(fileUrl);
                    }
                    return fileUrl;
                }
                throw new Error('获取下载链接失败');
            } catch (error) {
                retryCount++;
                if (retryCount === maxRetries) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }

    // 遍历资源生成列表
    for (let i in course_resources) {
        let resource = course_resources[i];
        if (resource.mimetype &&
            resource.type !== 'folder' &&
            !isVideoFile(resource.mimetype, resource.name)) {
            const fileItem = createFileItem(resource);
            download_list.appendChild(fileItem);
        }
    }

    function getFileIconSvg(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        let iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M13.06 8.11l1.415 1.415a7 7 0 0 1 0 9.9l-.354.353a7 7 0 0 1-9.9-9.9l1.415 1.415a5 5 0 1 0 7.071 7.071l.354-.354a5 5 0 0 0 0-7.07l-1.415-1.415 1.415-1.414zm6.718 6.011l-1.414-1.414a5 5 0 1 0-7.071-7.071l-.354.354a5 5 0 0 0 0 7.07l1.415 1.415-1.415 1.414-1.414-1.414a7 7 0 0 1 0-9.9l.354-.353a7 7 0 0 1 9.9 9.9z"/></svg>';
        let colorClass = 'file-icon-default';

        for (let filter of window.quickFilters) {
            if (filter.value.includes(extension)) {
                switch (filter.label) {
                    case "文档":
                        iconSvg = '<svg t="1723563293477" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32502" width="24" height="24"><path d="M530.46 269c4.64 0 9.05 2.01 12.09 5.52l109.54 126.3A16.01 16.01 0 0 1 656 411.3V893c0 8.82-7.18 16-16 16H178c-8.82 0-16-7.18-16-16V285c0-8.82 7.18-16 16-16h352.46m0-64H178c-44.18 0-80 35.82-80 80v608c0 44.18 35.82 80 80 80h462c44.18 0 80-35.82 80-80V411.3c0-19.26-6.95-37.87-19.56-52.42L590.9 232.58A80.014 80.014 0 0 0 530.46 205z" p-id="32503" fill="#2c2c2c"></path><path d="M819.29 864h-45.92c-17.67 0-32-14.33-32-32s14.33-32 32-32h45.92c25.21 0 45.71-19.94 45.71-44.46V295.17c0-10.61-3.91-20.88-11.01-28.94L747.58 145.52c-8.7-9.87-21.35-15.52-34.7-15.52H370.49c-17.67 0-32-14.33-32-32s14.33-32 32-32h342.38c31.72 0 61.87 13.56 82.71 37.2L902 223.91c17.41 19.75 27 45.06 27 71.26v460.37C929 815.35 879.78 864 819.29 864z" p-id="32504" fill="#2c2c2c"></path><path d="M702 468H552.09c-41.96 0-76.09-31.47-76.09-70.15V240.5h64v157.35c0 1.88 4.57 6.15 12.09 6.15H702v64zM898 326H748.09c-41.96 0-76.09-31.47-76.09-70.15V98.5h64v157.35c0 1.88 4.57 6.15 12.09 6.15H898v64zM535.13 784.5H262.88c-17.67 0-32 14.33-32 32s14.33 32 32 32h272.25c17.67 0 32-14.33 32-32s-14.33-32-32-32zM535.13 638.75H262.88c-17.67 0-32 14.33-32 32s14.33 32 32 32h272.25c17.67 0 32-14.33 32-32s-14.33-32-32-32zM535.13 493H262.88c-17.67 0-32 14.33-32 32s14.33 32 32 32h272.25c17.67 0 32-14.33 32-32s-14.33-32-32-32z" p-id="32505" fill="#2c2c2c"></path></svg>';
                        colorClass = 'file-icon-document';
                        break;
                    case "图片":
                        iconSvg = '<svg t="1723563406253" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="35753" width="24" height="24"><path d="M938.666667 553.92V768c0 64.8-52.533333 117.333333-117.333334 117.333333H202.666667c-64.8 0-117.333333-52.533333-117.333334-117.333333V256c0-64.8 52.533333-117.333333 117.333334-117.333333h618.666666c64.8 0 117.333333 52.533333 117.333334 117.333333v297.92z m-64-74.624V256a53.333333 53.333333 0 0 0-53.333334-53.333333H202.666667a53.333333 53.333333 0 0 0-53.333334 53.333333v344.48A290.090667 290.090667 0 0 1 192 597.333333a286.88 286.88 0 0 1 183.296 65.845334C427.029333 528.384 556.906667 437.333333 704 437.333333c65.706667 0 126.997333 16.778667 170.666667 41.962667z m0 82.24c-5.333333-8.32-21.130667-21.653333-43.648-32.917333C796.768 511.488 753.045333 501.333333 704 501.333333c-121.770667 0-229.130667 76.266667-270.432 188.693334-2.730667 7.445333-7.402667 20.32-13.994667 38.581333-7.68 21.301333-34.453333 28.106667-51.370666 13.056-16.437333-14.634667-28.554667-25.066667-36.138667-31.146667A222.890667 222.890667 0 0 0 192 661.333333c-14.464 0-28.725333 1.365333-42.666667 4.053334V768a53.333333 53.333333 0 0 0 53.333334 53.333333h618.666666a53.333333 53.333333 0 0 0 53.333334-53.333333V561.525333zM320 480a96 96 0 1 1 0-192 96 96 0 0 1 0 192z m0-64a32 32 0 1 0 0-64 32 32 0 0 0 0 64z" fill="#2c2c2c" p-id="35754"></path></svg>';
                        colorClass = 'file-icon-image';
                        break;
                    case "音频":
                        iconSvg = '<svg t="1723887950224" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5126" width="24" height="24"><path d="M988.74783 23.733531a106.803451 106.803451 0 0 0-84.406083-22.397368L373.460126 81.902696c-60.536887 9.150925-107.955315 62.840616-107.955315 122.225639v514.627531a172.715706 172.715706 0 0 0-94.772864-28.156691C76.471022 690.599175 0.064 765.214407 0.064 857.299587 0.064 949.384767 76.471022 1024 170.731947 1024c94.196932 0 170.603954-74.615233 170.603954-166.700413V384.011199l606.776703-91.957195v331.673028a172.715706 172.715706 0 0 0-94.836856-28.156692c-94.196932 0-170.603954 74.679225-170.603954 166.764406 0 92.08518 76.407022 166.700413 170.603954 166.700412 94.260924 0 170.667947-74.615233 170.667946-166.700412V100.652493c0-30.204451-12.798496-58.233158-35.195864-76.918962zM170.795939 949.896707c-52.281857 0-94.836857-41.53112-94.836857-92.59712 0-51.129992 42.555-92.661112 94.836857-92.661112s94.772864 41.595113 94.772864 92.661112c0 51.066-42.491007 92.59712-94.772864 92.59712zM341.335901 309.012011v-104.947669c0-22.589346 20.477594-45.434661 43.770856-49.01824l530.881622-80.438548a29.052586 29.052586 0 0 1 23.421248 5.375368 25.852962 25.852962 0 0 1 8.702977 20.669571v116.466316L341.335901 308.948019z m511.939847 545.919855c-52.281857 0-94.772864-41.53112-94.772865-92.59712s42.491007-92.59712 94.772865-92.59712c52.281857 0 94.836857 41.53112 94.836856 92.59712s-42.555 92.59712-94.836856 92.59712z" fill="#2c2c2c" p-id="5127"></path></svg>';
                        colorClass = 'file-icon-music';
                        break;
                    case "压缩包":
                        iconSvg = '<svg t="1723563514606" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="41199" width="24" height="24"><path d="M594.24 53.376h31.744c67.2-0.064 105.472-0.128 141.44 12.48 57.536 20.224 103.616 63.36 125.568 118.656v0.128c13.824 35.008 13.824 71.872 13.76 135.872v281.408c0 71.168 0 126.912-5.248 173.568-5.376 47.616-16.832 87.232-41.984 119.04a32 32 0 0 1-50.176-39.808c15.104-19.008 23.808-44.672 28.544-86.4 4.672-41.6 4.864-97.6 4.864-170.944V333.632c0-72.256-1.216-105.152-9.28-125.504a144.384 144.384 0 0 0-87.36-81.92c-22.784-7.936-58.496-8.832-135.232-8.832H572.8a109.632 109.632 0 0 0-107.072 110.08c0 6.4 0.448 13.632 0.96 21.376 1.28 22.08 2.944 48.896-4.48 76.544-9.472 35.52-37.312 63.36-72.832 72.896-27.648 7.36-54.4 5.76-76.48 4.416-7.68-0.512-14.848-0.96-21.248-0.96-61.248 0-110.272 49.024-110.272 110.272v116.352c0 65.536 0.064 113.984 4.224 149.248 4.16 35.328 11.584 55.872 24.96 72.768 8.512 10.624 18.56 20.096 29.952 28.16 31.552 22.208 82.048 27.52 186.368 28.096a32 32 0 0 1-0.384 64c-105.792-0.512-170.816-3.2-222.848-39.872a208 208 0 0 1-43.136-40.512c-22.784-28.608-33.472-63.552-38.4-105.088-4.736-40.448-4.736-88.576-4.736-151.424V503.04c0-115.648-0.064-178.816 22.272-235.136 35.712-90.24 111.04-160.64 205.568-193.92 58.944-20.672 125.44-20.672 249.024-20.608z m-410.304 321.92a173.248 173.248 0 0 1 107.712-37.568c10.048 0 19.968 0.384 29.44 0.64 20.8 0.768 39.36 1.408 51.648-1.92a39.232 39.232 0 0 0 27.776-27.712c3.264-12.288 2.624-30.912 1.92-51.776a844.16 844.16 0 0 1-0.64-29.44c0-40.064 13.632-76.992 36.48-106.496-29.824 2.496-52.544 6.528-71.872 13.376-77.952 27.328-138.688 84.8-167.296 156.992-8.384 21.248-12.8 47.104-15.168 83.84z" fill="#2c2c2c" p-id="41200"></path><path d="M572.864 705.728c-43.008 20.096-71.488 62.336-71.488 109.12v62.4c-0.256 19.264-0.384 34.048 8.256 50.752 8.192 15.808 21.632 28.16 37.76 35.392 16.768 7.552 31.424 7.424 51.84 7.296l9.536-0.064h50.624c20.416 0.192 35.2 0.32 51.968-7.232 16.128-7.296 29.44-19.584 37.632-35.392 8.704-16.896 8.576-31.744 8.448-51.2l-0.064-8.576v-53.376c0-46.784-28.544-89.024-71.488-109.12a133.888 133.888 0 0 0-113.024 0z m27.136 58.048c18.304-8.576 40.448-8.576 58.752 0 22.08 10.24 34.624 30.08 34.624 51.072v53.376c0 17.472-0.896 26.112-1.216 29.12-0.128 1.152-0.128 1.472 0 1.28a14.272 14.272 0 0 1-7.04 6.4c-0.448 0.192-9.6 1.6-35.2 1.6h-41.152c-25.6 0-34.688-1.408-35.2-1.6a14.656 14.656 0 0 1-7.04-6.4l-0.064-1.472a296.832 296.832 0 0 1-1.088-28.928v-53.376c0-20.992 12.544-40.832 34.624-51.072zM574.72 147.968a32 32 0 0 1 22.656-9.344H640a32 32 0 0 1 0 64h-42.624a32 32 0 0 1-22.656-54.656zM660.096 254.72a32 32 0 0 1 22.656-9.344h42.624a32 32 0 1 1 0 64h-42.624a32 32 0 0 1-22.656-54.656zM574.72 339.968a32 32 0 0 1 22.656-9.344H640a32 32 0 0 1 0 64h-42.624a32 32 0 0 1-22.656-54.656zM660.096 429.632a32 32 0 0 1 22.656-9.408h42.624a32 32 0 1 1 0 64h-42.624a32 32 0 0 1-22.656-54.592zM574.72 531.968a32 32 0 0 1 22.656-9.344H640a32 32 0 0 1 0 64h-42.624a32 32 0 0 1-22.656-54.656zM660.096 617.344a32 32 0 0 1 22.656-9.344h42.624a32 32 0 1 1 0 64h-42.624a32 32 0 0 1-22.656-54.656z" fill="#2c2c2c" p-id="41201"></path></svg>';
                        colorClass = 'file-icon-archive';
                        break;
                }
                break;
            }
        }
        return { svg: iconSvg, colorClass: colorClass };
    }

    function toggleFailedContainer() {
        if (failedContainer.style.display === 'none') {
            failedContainer.style.display = 'block';
            failedToggleButton.textContent = '隐藏失败项 (' + (failedContainer.children.length - 1) + ')';
        } else {
            failedContainer.style.display = 'none';
            failedToggleButton.textContent = '显示失败项 (' + (failedContainer.children.length - 1) + ')';
        }
    }

    function updateFailedCount() {
        const count = failedContainer.children.length - 1;
        failedToggleButton.textContent = (failedContainer.style.display === 'none' ? '显示' : '隐藏') + '失败项 (' + count + ')';

        if (count > 0) {
            failedToggleButton.style.display = 'block';
            noErrorsMessage.style.display = 'none';
        } else {
            failedToggleButton.style.display = 'none';
            noErrorsMessage.style.display = 'block';
        }
    }

    function addFailedFileNotification(fileName) {
        const failedItem = document.createElement('div');
        failedItem.className = 'failed-file';
        failedItem.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        margin-bottom: 10px;
        background-color: #fff0f0;
        border-left: 4px solid #ff4d4d;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    `;

        const fileNameSpan = document.createElement('span');
        fileNameSpan.style.cssText = `
        color: #ff4d4d;
        font-weight: bold;
        margin-right: 10px;
    `;
        fileNameSpan.textContent = `❌ 添加失败: ${fileName}`;

        const retryButton = document.createElement('button');
        retryButton.className = 'retry-btn';
        retryButton.textContent = '重试';
        retryButton.style.cssText = `
        background-color: #ff9999;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
        outline: none;
        box-shadow: 0 2px 4px rgba(255, 77, 77, 0.3);
    `;

        retryButton.onmouseover = () => {
            retryButton.style.backgroundColor = '#ff7777';
            retryButton.style.boxShadow = '0 4px 8px rgba(255, 77, 77, 0.5)';
        };

        retryButton.onmouseout = () => {
            retryButton.style.backgroundColor = '#ff9999';
            retryButton.style.boxShadow = '0 2px 4px rgba(255, 77, 77, 0.3)';
        };

        retryButton.onclick = () => {
            failedItem.style.opacity = '0';
            failedItem.style.transform = 'translateX(20px)';
            setTimeout(() => {
                failedItem.remove();
                const resource = Object.values(course_resources).find(r => r.name === fileName);
                updateFailedCount();
                if (failedContainer.children.length === 1) {
                    noErrorsMessage.style.display = 'block';
                }
            }, 300);
        };

        failedItem.appendChild(fileNameSpan);
        failedItem.appendChild(retryButton);
        failedContainer.appendChild(failedItem);
        updateFailedCount();

        // 添加入场动画
        setTimeout(() => {
            failedItem.style.opacity = '1';
            failedItem.style.transform = 'translateX(0)';
        }, 10);
    }
    noErrorsMessage.style.display = 'none';
}

// 预览逻辑
function previewFile(fileName, fileUrl) {
    const extension = fileName.split('.').pop().toLowerCase();
    const supportedDocs = ['pdf', 'txt', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'js', 'json', 'css', 'sql', 'xml', 'java', 'cs'];
    const supportedImages = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'];
    const supportedAudio = ['mp3', 'wav', 'ogg'];
    const supportedArchives = ['zip', 'rar'];
    const supportedDocsForInfo = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];

    const previewBaseUrl = 'https://vip.ow365.cn/?i=29353&ssl=1&draw=1';

    if (!supportedDocs.includes(extension) &&
        !supportedImages.includes(extension) &&
        !supportedAudio.includes(extension) &&
        !supportedArchives.includes(extension)) {
        showNotification('该类型文件不支持预览╯︿╰', 'warning');
        return;
    }

    let previewModal = document.createElement('div');
    previewModal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(255, 255, 255, 0.98);
        z-index: 1000;
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0,0,0,0.25);
        width: 85%;
        height: 85%;
        overflow: hidden;
        opacity: 0;
        backdrop-filter: blur(15px);
        transition: opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        border: 1px solid rgba(255,255,255,0.18);
    `;

    let dragPreviewHandle = document.createElement('div');
    dragPreviewHandle.style.cssText = `
        width: 100%;
        height: 40px;
        background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        cursor: move;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        position: relative;
        overflow: hidden;
    `;

    let style = document.createElement('style');
    style.textContent = `
        @keyframes shimmer {
            0% {background-position: 200% 0;}
            100% {background-position: -200% 0;}
        }
    `;
    document.head.appendChild(style);

    let dragPreviewIndicator = document.createElement('div');
    dragPreviewIndicator.style.cssText = `
        width: 50px;
        height: 5px;
        background-color: rgba(0,0,0,0.2);
        border-radius: 2.5px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `;
    dragPreviewHandle.appendChild(dragPreviewIndicator);

    let textLabel = document.createElement('span');
    textLabel.textContent = '预览窗口';
    textLabel.style.cssText = `
        font-weight: bold;
        font-size: 14px;
        color: #555;
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.7;
    `;
    dragPreviewHandle.appendChild(textLabel);
    previewModal.appendChild(dragPreviewHandle);

    let isDragging = false;
    let startX, startY, startLeft, startTop;

    function onMouseMove(e) {
        if (!isDragging) return;
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;

        requestAnimationFrame(() => {
            let newLeft = startLeft + dx;
            let newTop = startTop + dy;
            previewModal.style.left = `${newLeft}px`;
            previewModal.style.top = `${newTop}px`;
        });
    }

    function onTouchMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        let dx = e.touches[0].clientX - startX;
        let dy = e.touches[0].clientY - startY;

        requestAnimationFrame(() => {
            let newLeft = startLeft + dx;
            let newTop = startTop + dy;
            previewModal.style.left = `${newLeft}px`;
            previewModal.style.top = `${newTop}px`;
        });
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onMouseUp);
    }

    dragPreviewHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = previewModal.offsetLeft;
        startTop = previewModal.offsetTop;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    dragPreviewHandle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startLeft = previewModal.offsetLeft;
        startTop = previewModal.offsetTop;

        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onMouseUp);
    });

    let closeButton = document.createElement('button');
    closeButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    closeButton.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: #FFA500;
        color: white;
        border: none;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 1001;
        box-shadow: 0 4px 6px rgba(255, 165, 0, 0.3);
    `;
    closeButton.onmouseover = () => {
        closeButton.style.backgroundColor = '#FFB732';
        closeButton.style.transform = 'scale(1.1) rotate(90deg)';
        closeButton.style.boxShadow = '0 6px 8px rgba(255, 165, 0, 0.5)';
    };
    closeButton.onmouseout = () => {
        closeButton.style.backgroundColor = '#FFA500';
        closeButton.style.transform = 'scale(1) rotate(0deg)';
        closeButton.style.boxShadow = '0 4px 6px rgba(255, 165, 0, 0.3)';
    };

    closeButton.onclick = () => {
        previewModal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(previewModal);
        }, 400);
    };

    previewModal.appendChild(closeButton);

    let contentWrapper = document.createElement('div');
    contentWrapper.style.cssText = `
        width: 100%;
        height: calc(100% - 30px);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 30px;
        box-sizing: border-box;
    `;

    let iframe;
    if (supportedDocs.includes(extension) || supportedArchives.includes(extension)) {
        const previewUrl = `${previewBaseUrl}&furl=${encodeURIComponent(fileUrl)}`;
        iframe = document.createElement('iframe');
        iframe.src = previewUrl;
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 15px;
            box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        `;
        contentWrapper.appendChild(iframe);

        if (supportedDocsForInfo.includes(extension)) {
            let isShowingInfo = false;
            let infoContent = null;

            let infoButton = document.createElement('button');
            infoButton.title = '切换文件信息/预览';
            infoButton.innerHTML = `
            <svg t="1726054601642" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8140" width="24" height="24"><path d="M921.6 614.4a102.4 102.4 0 0 1 102.4 102.4v204.8a102.4 102.4 0 0 1-102.4 102.4h-204.8a102.4 102.4 0 0 1-102.4-102.4v-204.8a102.4 102.4 0 0 1 102.4-102.4h204.8zM78.3872 524.8l9.728 16.64c1.024 3.3792 2.3552 18.688 3.1744 24.4224a435.2 435.2 0 0 0 74.6496 186.0096 420.352 420.352 0 0 0 64.256 71.7824c77.1072 68.5056 153.4464 101.0176 229.8368 99.4816a38.4 38.4 0 1 1 1.536 76.8c-97.28 1.9456-191.6416-38.2976-282.368-118.8864a497.1008 497.1008 0 0 1-87.9104-102.4512l-1.6896-2.816v62.1568a38.4 38.4 0 0 1-76.8 0.0512l0.1024-288.768 0.512-4.2496 1.536-5.7856 63.4368-14.3872zM921.6 691.2h-204.8a25.6 25.6 0 0 0-25.1904 20.992L691.2 716.8v204.8a25.6 25.6 0 0 0 20.992 25.1904l4.608 0.4096h204.8a25.6 25.6 0 0 0 25.1904-20.992L947.2 921.6v-204.8a25.6 25.6 0 0 0-20.992-25.1904L921.6 691.2zM562.432 12.8512c97.28-1.9456 191.6416 38.2976 282.368 118.8864a497.1008 497.1008 0 0 1 87.9104 102.4512l1.6896 2.816V174.848a38.4 38.4 0 0 1 76.8-0.0512l-0.1024 288.768-0.512 4.2496-1.536 5.7856-63.4368 14.336-9.728-16.5888c-1.024-3.3792-2.3552-18.7392-3.1744-24.4224a435.2 435.2 0 0 0-74.6496-186.0096 420.352 420.352 0 0 0-64.256-71.7824c-77.1072-68.5056-153.4464-101.0176-229.8368-99.4816a38.4 38.4 0 0 1-1.536-76.8zM307.2 0a102.4 102.4 0 0 1 102.4 102.4v204.8a102.4 102.4 0 0 1-102.4 102.4H102.4a102.4 102.4 0 0 1-102.4-102.4V102.4a102.4 102.4 0 0 1 102.4-102.4h204.8z m0 76.8H102.4a25.6 25.6 0 0 0-25.1904 20.992L76.8 102.4v204.8a25.6 25.6 0 0 0 20.992 25.1904L102.4 332.8h204.8a25.6 25.6 0 0 0 25.1904-20.992L332.8 307.2V102.4a25.6 25.6 0 0 0-20.992-25.1904L307.2 76.8z" fill="#ffffff" p-id="8141"></path></svg>
        `;
            infoButton.style.cssText = `
            position: absolute;
            bottom: 50px;
            left: 5px;
            background-color: #FFA500;
            color: white;
            border: none;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 1001;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;

            let style = document.createElement('style');
            style.textContent = `
            @keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .rotating {
                animation: rotate 2s linear infinite;
            }
            .switch-icon {
                transition: transform 0.3s ease;
            }
            button:hover .switch-icon {
                transform: scale(1.1);
            }
        `;
            document.head.appendChild(style);

            infoButton.onmouseover = () => {
                infoButton.style.backgroundColor = '#FFB732';
                infoButton.style.transform = 'scale(1.1)';
                infoButton.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
            };
            infoButton.onmouseout = () => {
                if (!infoButton.classList.contains('rotating')) {
                    infoButton.style.backgroundColor = '#FFA500';
                    infoButton.style.transform = 'scale(1)';
                    infoButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }
            };

            infoButton.onclick = () => {
                if (isShowingInfo) {
                    iframe.style.display = 'block';
                    infoContent.style.display = 'none';
                    isShowingInfo = false;
                    infoButton.title = '查看文件信息';
                } else {
                    if (infoContent === null) {
                        infoButton.classList.add('rotating');
                        infoButton.style.pointerEvents = 'none';

                        const infoUrl = `${previewBaseUrl}&info=0&furl=${encodeURIComponent(fileUrl)}`;
                        fetch(infoUrl)
                            .then(response => response.json())
                            .then(data => {
                            infoContent = createInfoContent(data);
                            contentWrapper.appendChild(infoContent);
                            toggleInfoDisplay();
                            resetButton();
                        })
                            .catch(error => {
                            console.error('获取文档信息失败:', error);
                            showNotification('获取文档信息失败，请稍后重试。', 'error');
                            resetButton();
                        });
                    } else {
                        toggleInfoDisplay();
                    }
                }
            };

            function toggleInfoDisplay() {
                iframe.style.display = 'none';
                infoContent.style.display = 'block';
                isShowingInfo = true;
                infoButton.title = '返回文件预览';
            }

            function resetButton() {
                infoButton.classList.remove('rotating');
                infoButton.style.pointerEvents = 'auto';
            }

            previewModal.appendChild(infoButton);
        }
    } else if (supportedImages.includes(extension)) {
        let img = document.createElement('img');
        img.src = fileUrl;
        img.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            border-radius: 15px;
            box-shadow: 0 15px 30px rgba(0,0,0,0.15);
            transition: transform 0.3s ease;
        `;
        img.onmouseover = () => {
            img.style.transform = 'scale(1.02)';
        };
        img.onmouseout = () => {
            img.style.transform = 'scale(1)';
        };
        contentWrapper.appendChild(img);
    } else if (supportedAudio.includes(extension)) {
        let audio = document.createElement('audio');
        audio.controls = true;
        audio.src = fileUrl;
        audio.style.cssText = `
            width: 80%;
            max-width: 500px;
            box-shadow: 0 15px 30px rgba(0,0,0,0.15);
            border-radius: 30px;
        `;
        contentWrapper.appendChild(audio);
    }

    previewModal.appendChild(contentWrapper);
    document.body.appendChild(previewModal);

    requestAnimationFrame(() => {
        previewModal.style.opacity = '1';
    });
}

function createInfoContent(data) {
    let infoDiv = document.createElement('div');
    infoDiv.style.cssText = `
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
        background-color: #f0f4f8;
        display: none;
    `;

    const getIconForFileType = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        const icons = {
            pdf: '📄', doc: '📝', docx: '📝', xls: '📊', xlsx: '📊', ppt: '📽️', pptx: '📽️',
            default: '📁'
        };
        return icons[extension] || icons.default;
    };

    const fileIcon = getIconForFileType(data.FileName);

    const { formattedContent, characterCount } = formatTextContent(data.Text);

    let contentHtml = `
        <div class="file-header">
            <div class="file-icon">${fileIcon}</div>
            <h1>${data.FileName}</h1>
        </div>
        <div class="info-grid">
            <div class="info-item">
                <span class="icon">📏</span>
                <span class="label">文件大小:</span>
                <span class="value">${formatFileSize(data.FileSize)}</span>
            </div>
            <div class="info-item">
                <span class="icon">🕒</span>
                <span class="label">创建时间:</span>
                <span class="value">${formatDate(data.CreateTime)}</span>
            </div>
            <div class="info-item">
                <span class="icon">🔄</span>
                <span class="label">修改时间:</span>
                <span class="value">${formatDate(data.LastTime)}</span>
            </div>
        </div>
    `;

    if (data.PageCount !== undefined) {
        contentHtml += `
            <div class="info-grid">
                <div class="info-item">
                    <span class="icon">📚</span>
                    <span class="label">页数:</span>
                    <span class="value">${data.PageCount}</span>
                </div>
                <div class="info-item">
                    <span class="icon">🔤</span>
                    <span class="label">字数:</span>
                    <span class="value">${characterCount}</span>
                </div>
            </div>
            <h2 class="section-title">📝 文本内容提取</h2>
            <div class="search-container">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder=" " />
                    <label for="searchInput">🔍 搜索文本...</label>
                    <span class="search-border"></span>
                </div>
                <div class="search-buttons">
                    <button id="prevButton" disabled>⬆ 上一个</button>
                    <button id="nextButton" disabled>⬇ 下一个</button>
                    <button id="searchButton">搜索</button>
                </div>
            </div>
            <div class="text-content" id="textContent">${formattedContent}</div>
        `;
    } else if (data.SlideCount !== undefined) {
        contentHtml += `
            <div class="info-grid">
                <div class="info-item">
                    <span class="icon">🎞️</span>
                    <span class="label">幻灯片数:</span>
                    <span class="value">${data.SlideCount}</span>
                </div>
                <div class="info-item">
                    <span class="icon">📐</span>
                    <span class="label">尺寸:</span>
                    <span class="value">${data.Width} x ${data.Height}</span>
                </div>
                <div class="info-item">
                    <span class="icon">🔲</span>
                    <span class="label">比例:</span>
                    <span class="value">${data.Ratio}</span>
                </div>
            </div>
            <h2 class="section-title">🖥️ 幻灯片标题</h2>
            <ul class="slide-names">
                ${data.SlideNames.split(';').map(name => `<li>${name.trim()}</li>`).join('')}
            </ul>
        `;
    } else if (data.SheetCount !== undefined) {
        contentHtml += `
            <div class="info-grid">
                <div class="info-item">
                    <span class="icon">📊</span>
                    <span class="label">工作表数:</span>
                    <span class="value">${data.SheetCount}</span>
                </div>
            </div>
            <h2 class="section-title">📑 工作表名称</h2>
            <ul class="sheet-names">
                ${data.SheetNames.split(';').map(name => `<li>${name.trim()}</li>`).join('')}
            </ul>
        `;
    }

    infoDiv.innerHTML = contentHtml;

    if (data.PageCount !== undefined) {
        const searchInput = infoDiv.querySelector('#searchInput');
        const searchButton = infoDiv.querySelector('#searchButton');
        const prevButton = infoDiv.querySelector('#prevButton');
        const nextButton = infoDiv.querySelector('#nextButton');
        const textContentDiv = infoDiv.querySelector('#textContent');

        let currentMatchIndex = -1;
        let matches = [];

        function highlightText(searchTerm) {
            const innerHTML = textContentDiv.innerHTML.replace(/<span class="highlight current">(.*?)<\/span>/gi, '$1')
            .replace(/<span class="highlight">(.*?)<\/span>/gi, '$1');
            textContentDiv.innerHTML = innerHTML;

            if (!searchTerm) {
                matches = [];
                currentMatchIndex = -1;
                prevButton.disabled = true;
                nextButton.disabled = true;
                return;
            }

            const regex = new RegExp(`(${searchTerm})`, 'gi');
            let matchCount = 0;

            const replacer = (match) => {
                matchCount++;
                return `<span class="highlight">${match}</span>`;
            };

            textContentDiv.innerHTML = innerHTML.replace(regex, replacer);

            matches = textContentDiv.querySelectorAll('.highlight');
            if (matches.length > 0) {
                currentMatchIndex = 0;
                updateCurrentMatch();
                prevButton.disabled = false;
                nextButton.disabled = false;
            } else {
                currentMatchIndex = -1;
                prevButton.disabled = true;
                nextButton.disabled = true;
            }
        }

        function updateCurrentMatch() {
            matches.forEach((match) => match.classList.remove('current'));

            if (currentMatchIndex >= 0 && currentMatchIndex < matches.length) {
                const currentMatch = matches[currentMatchIndex];
                currentMatch.classList.add('current');
                currentMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            highlightText(searchTerm);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                highlightText(searchTerm);
            }
        });

        nextButton.addEventListener('click', () => {
            if (matches.length > 0) {
                currentMatchIndex = (currentMatchIndex + 1) % matches.length;
                updateCurrentMatch();
            }
        });

        prevButton.addEventListener('click', () => {
            if (matches.length > 0) {
                currentMatchIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
                updateCurrentMatch();
            }
        });
    }

    const style = document.createElement('style');
    style.textContent = `
        * {
            box-sizing: border-box;
        }

        body {
            line-height: 1.6;
            color: #333;
            background-color: #f0f4f8;
        }

        .file-header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .file-icon {
            font-size: 48px;
            margin-right: 20px;
        }

        h1 {
            font-size: 24px;
            color: #2c3e50;
            margin: 0;
        }

        h2.section-title {
            font-size: 20px;
            color: #34495e;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
            margin-top: 40px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .info-item {
            background-color: #fff;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
        }

        .info-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .info-item .icon {
            font-size: 24px;
            margin-bottom: 10px;
        }

        .info-item .label {
            font-weight: bold;
            color: #7f8c8d;
            margin-bottom: 5px;
        }

        .info-item .value {
            color: #2c3e50;
            font-size: 18px;
        }

        .text-content {
            background-color: #fff;
            padding: 25px;
            border-radius: 8px;
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-height: 500px;
            overflow-y: auto;
            font-size: 16px;
            line-height: 1.8;
            color: #34495e;
            border-left: 4px solid #3498db;
        }

        .text-content h3 {
            font-size: 20px;
            color: #2c3e50;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ecf0f1;
            padding-bottom: 5px;
        }

        .text-content p {
            margin-bottom: 15px;
        }

        .text-content ul {
            padding-left: 20px;
            margin-bottom: 15px;
        }

        .text-content li {
            margin-bottom: 5px;
        }

        .text-content strong {
            color: #2c3e50;
            font-weight: 700;
        }

        .text-content::-webkit-scrollbar {
            width: 8px;
        }
        .text-content::-webkit-scrollbar-thumb {
            background-color: #bdc3c7;
            border-radius: 4px;
        }
        .text-content::-webkit-scrollbar-track {
            background-color: #ecf0f1;
        }

        .slide-names, .sheet-names {
            list-style-type: none;
            padding-left: 0;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .slide-names li, .sheet-names li {
            margin-bottom: 10px;
            color: #3498db;
            font-size: 16px;
            transition: all 0.2s ease;
            padding: 10px;
            border-radius: 4px;
            background-color: #f7f9fc;
        }

        .slide-names li:hover, .sheet-names li:hover {
            color: #2980b9;
            transform: translateX(5px);
            background-color: #e8f0fe;
        }

        .search-container {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 10px;
        }

        .search-box {
            position: relative;
            flex: 1;
            min-width: 250px;
        }

        .search-box input[type="text"] {
            width: 100%;
            padding: 15px 20px;
            font-size: 16px;
            color: #2c3e50;
            border: none;
            border-bottom: 2px solid #ccc;
            background: transparent;
            outline: none;
            transition: border-color 0.3s;
        }

        .search-box input[type="text"]::placeholder {
            color: transparent;
        }

        .search-box label {
            position: absolute;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            color: #aaa;
            font-size: 16px;
            pointer-events: none;
            transition: all 0.3s;
        }

        .search-box input[type="text"]:focus + label,
        .search-box input[type="text"]:not(:placeholder-shown) + label {
            top: 5px;
            transform: translateY(-100%);
            font-size: 12px;
            color: #3498db;
        }

        .search-box .search-border {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background-color: #3498db;
            transition: width 0.3s;
        }

        .search-box input[type="text"]:focus ~ .search-border {
            width: 100%;
        }

        .search-buttons {
            display: flex;
            gap: 10px;
        }

        .search-buttons button {
            padding: 12px 15px;
            font-size: 16px;
            background: linear-gradient(135deg, #6dd5ed, #2193b0);
            color: #fff;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            outline: none;
        }

        .search-buttons button:disabled {
            background: #bdc3c7;
            cursor: not-allowed;
            box-shadow: none;
        }

        .search-buttons button:not(:disabled):hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }

        .highlight {
            background-color: #ffeb3b;
            padding: 2px 0;
            transition: background-color 0.3s;
        }

        .highlight.current {
            background-color: #ffc107;
        }
    `;

    infoDiv.appendChild(style);
    return infoDiv;
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    else return (bytes / 1073741824).toFixed(2) + ' GB';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function formatTextContent(text) {
    if (typeof text !== 'string') {
        console.error('Invalid text input:', text);
        return {
            formattedContent: '',
            characterCount: 0,
        };
    }

    // 处理特殊字符
    text = text
        .replace(/\u0007/g, '\n')
        .replace(/\f/g, '\n')
        .replace(/\r/g, '\n')
        .trim();

    const characterCount = text.length;

    const lines = text.split(/\n+/).map((line) => line.trim()).filter((line) => line);

    let formattedContent = '';
    let inList = false;

    lines.forEach((line) => {
        if (line.match(/^[一二三四五六七八九十]+[、\.．]/)) {
            if (inList) {
                formattedContent += '</ul>';
                inList = false;
            }
            formattedContent += `<h2>${line}</h2>`;
        }
        else if (line.match(/^\d+[\.\、\.．]/)) {
            if (inList) {
                formattedContent += '</ul>';
                inList = false;
            }
            formattedContent += `<h3>${line}</h3>`;
        }
        else if (line.match(/^[①②③④⑤⑥⑦⑧⑨⑩]/)) {
            if (!inList) {
                formattedContent += '<ul>';
                inList = true;
            }
            formattedContent += `<li>${line}</li>`;
        }
        else if (line.match(/^[•⚫-]/)) {
            if (!inList) {
                formattedContent += '<ul>';
                inList = true;
            }
            formattedContent += `<li>${line.replace(/^[•⚫-]\s*/, '')}</li>`;
        }
        else {
            if (inList) {
                formattedContent += '</ul>';
                inList = false;
            }
            formattedContent += `<p>${line}</p>`;
        }
    });

    if (inList) {
        formattedContent += '</ul>';
        inList = false;
    }

    return {
        formattedContent,
        characterCount,
    };
}

let toggleButton;
let downloadsContainer = document.getElementById('downloadsContainer');
let wrapperContainer = document.getElementById('downloadsWrapperContainer');
let totalProgressBar;
let totalProgressText;
let totalDownloads = 0;
let completedDownloads = 0;

if (!wrapperContainer) {
    wrapperContainer = document.createElement('div');
    wrapperContainer.id = 'downloadsWrapperContainer';
    Object.assign(wrapperContainer.style, {
        position: 'fixed',
        bottom: '150px',
        left: '10px',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        overflow: 'visible',
        transition: 'transform 0.3s ease-in-out',
        transform: 'translateX(calc(-100% + 25px))'
    });

    // 创建进度条容器
    downloadsContainer = document.createElement('div');
    downloadsContainer.id = 'downloadsContainer';
    // 设置容器样式
    Object.assign(downloadsContainer.style, {
        position: 'relative',
        bottom: 'auto',
        left: 'auto',
        right: 'auto',
        zIndex: '9999',
        backgroundColor: '#FFF3E0',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        padding: '30px',
        width: 'auto',
        minWidth: '600px',
        boxSizing: 'border-box',
        margin: '0 auto',
        border: '1px solid #FFD180',
        transition: 'transform 0.3s ease-in-out',
        maxHeight: '190px',
        overflowY: 'auto',
        overflowX: 'hidden',
    });

    wrapperContainer.appendChild(downloadsContainer);

    // 创建总进度条
    totalProgressBar = document.createElement('div');
    totalProgressBar.id = 'totalProgressBar';
    Object.assign(totalProgressBar.style, {
        width: '100%',
        height: '10px',
        backgroundColor: '#E0E0E0',
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '10px'
    });

    let totalProgressInner = document.createElement('div');
    Object.assign(totalProgressInner.style, {
        width: '0%',
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: '5px',
        transition: 'width 0.3s'
    });

    totalProgressBar.appendChild(totalProgressInner);

    // 创建总进度文本
    totalProgressText = document.createElement('div');
    totalProgressText.id = 'totalProgressText';
    Object.assign(totalProgressText.style, {
        textAlign: 'center',
        marginBottom: '10px',
        fontWeight: 'bold',
        color: '#4CAF50'
    });
    totalProgressText.textContent = '总进度: 0%';

    downloadsContainer.appendChild(totalProgressText);
    downloadsContainer.appendChild(totalProgressBar);

    // 创建收起/展示按钮
    toggleButton = document.createElement('button');
    toggleButton.title = '点击展开/收折进度条';
    toggleButton.textContent = '▶';

    // 设置按钮样式
    Object.assign(toggleButton.style, {
        position: 'absolute',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        marginLeft: '5px',
        zIndex: '10000',
        border: 'none',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.24), 0 4px 5px 0 rgba(0, 0, 0, 0.19)',
        background: 'linear-gradient(45deg, #FFC107, #FF9800)',
        borderRadius: '8px',
        padding: '4px 8px',
        paddingRight: '2px',
        paddingLeft: '2px',
        color: 'white',
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'left 0.3s, transform 0.3s, background-color 0.3s, box-shadow 0.3s',
        textShadow: '0 0 0px transparent'
    });

    // 按钮悬停效果
    toggleButton.onmouseover = () => {
        Object.assign(toggleButton.style, {
            background: 'linear-gradient(45deg, #FFEB3B, #FFC107)',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.24), 0 6px 10px 0 rgba(0, 0, 0, 0.19)',
            transform: 'translateY(-60%)'
        });
    };

    toggleButton.onmouseout = () => {
        Object.assign(toggleButton.style, {
            background: 'linear-gradient(45deg, #FFC107, #FF9800)',
            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.24), 0 4px 5px 0 rgba(0, 0, 0, 0.19)',
            transform: 'translateY(-50%)'
        });
    };

    let isCollapsed = true;

    // 按钮点击事件
    toggleButton.onclick = () => {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
            wrapperContainer.style.transform = 'translateX(calc(-100% + 25px))';
        } else {
            wrapperContainer.style.transform = 'translateX(0)';
        }
        toggleButton.textContent = isCollapsed ? '▶' : '◀';
    };

    wrapperContainer.appendChild(toggleButton);

    // 创建 dotlottie-player 容器
    let lottieContainer = document.createElement('div');
    Object.assign(lottieContainer.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '-1'
    });
    lottieContainer.innerHTML = `
        <dotlottie-player src="https://lottie.host/0500ecdb-7f3b-4f73-ab09-155a70f85ce3/ZCLltVc7A4.json"
                          background="transparent" speed="1"
                          style="width: 100%; height: 100%;" loop autoplay>
        </dotlottie-player>`;
    downloadsContainer.prepend(lottieContainer);
}

function addDownloadsContainer() {
    document.body.appendChild(wrapperContainer);
}

function updateContainerPosition() {
    let windowHeight = window.innerHeight;
    let downloadsContainerHeight = downloadsContainer.offsetHeight;
    let currentTop = downloadsContainer.getBoundingClientRect().top;
    if (currentTop + downloadsContainerHeight > windowHeight) {
        let newTop = windowHeight - downloadsContainerHeight - 10;
        downloadsContainer.style.top = `${newTop}px`;
        downloadsContainer.style.bottom = 'auto';
    }
}

function updateIndicator() {
    let indicator = document.getElementById('progressIndicator');
    let progressBarCount = downloadsContainer.querySelectorAll('.progressBar').length;

    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'progressIndicator';
        Object.assign(indicator.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: '10000',
            backgroundColor: '#f00',
            backgroundImage: 'linear-gradient(to bottom right, #ffcc80, #ff8c00)',
            color: 'white',
            textShadow: '0px 1px 2px rgba(0, 0, 0, 0.7)',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
            transition: 'background-color 0.3s, box-shadow 0.3s'
        });
        wrapperContainer.appendChild(indicator);
    }
    indicator.textContent = progressBarCount;
}

function updateDownloadsContainerVisibility() {
    const nonEmptyNodes = Array.from(downloadsContainer.children).filter(child =>
                                                                         !child.classList.contains('slide-out') &&
                                                                         child.tagName !== 'P' &&
                                                                         child !== downloadsContainer.firstChild &&
                                                                         child !== toggleButton &&
                                                                         child.id !== 'progressIndicator' &&
                                                                         child.id !== 'totalProgressBar' &&
                                                                         child.id !== 'totalProgressText'
                                                                        );

    if (nonEmptyNodes.length === 0) {
        if (!downloadsContainer.querySelector('p')) {
            let emptyText = document.createElement('p');
            emptyText.innerHTML = `
                暂无下载内容 ᓚᘏᗢ<br>
                <span style="font-size: 10px;">(在右侧添加任务吧~)</span>
            `;
            Object.assign(emptyText.style, {
                color: '#FF9800',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '20px',
                marginTop: '15px',
                borderRadius: '8px',
                opacity: '0',
                transition: 'opacity 1s ease-in-out, transform 1s',
                transform: 'translateY(-20px)',
                top: '50%'
            });

            setTimeout(() => {
                emptyText.style.opacity = '1';
                emptyText.style.transform = 'translateY(0)';
            }, 100);

            emptyText.animate([
                { transform: 'translateY(0)' },
                { transform: 'translateY(-10px)' },
                { transform: 'translateY(0)' }
            ], {
                duration: 3000,
                iterations: Infinity,
                easing: 'ease-in-out'
            });

            downloadsContainer.appendChild(emptyText);
        }
        wrapperContainer.style.display = isProgressBarVisible ? 'flex' : 'none';

        if (totalProgressBar) totalProgressBar.style.display = 'none';
        if (totalProgressText) totalProgressText.style.display = 'none';
    } else {
        let emptyText = downloadsContainer.querySelector('p');
        if (emptyText) {
            downloadsContainer.removeChild(emptyText);
        }

        if (totalProgressBar) totalProgressBar.style.display = 'block';
        if (totalProgressText) totalProgressText.style.display = 'block';
    }
    toggleButton.style.display = isProgressBarVisible ? 'block' : 'none';

    updateTotalProgress();
}

// 更新总进度的函数
function updateTotalProgress() {
    if (totalDownloads === 0) {
        totalProgressBar.classList.add('hidden');
        totalProgressText.classList.add('hidden');
        setTimeout(() => {
            totalProgressBar.style.display = 'none';
            totalProgressText.style.display = 'none';
            totalProgressBar.classList.remove('hidden');
            totalProgressText.classList.remove('hidden');
        }, 500);
        return;
    }

    if (totalProgressBar.style.display === 'none') {
        totalProgressBar.style.display = 'block';
        totalProgressText.style.display = 'block';
        totalProgressBar.offsetHeight;
        totalProgressText.offsetHeight;
        totalProgressBar.classList.add('visible');
        totalProgressText.classList.add('visible');
    }

    if (completedDownloads === 0) {
        const progressInner = totalProgressBar.firstChild;
        progressInner.style.width = '0%';
        progressInner.style.backgroundColor = 'hsl(0, 100%, 35%)';
        totalProgressText.style.color = 'hsl(0, 100%, 35%)';
        totalProgressText.textContent = `总进度: 0.00% (0/${totalDownloads})`;
        return;
    }

    const progressPercentage = (completedDownloads / totalDownloads) * 100;
    const nextProgressPoint = ((completedDownloads + 0.5) / totalDownloads) * 100;
    const progressInner = totalProgressBar.firstChild;

    const startProgress = parseFloat(progressInner.style.width) || 0;
    const duration = 500;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 3);

        let currentProgress;
        if (completedDownloads < totalDownloads) {
            currentProgress = startProgress + (nextProgressPoint - startProgress) * easeProgress;
        } else {
            currentProgress = startProgress + (progressPercentage - startProgress) * easeProgress;
        }

        progressInner.style.width = `${currentProgress}%`;

        const hue = Math.floor(120 * (currentProgress / 100));
        const color = `hsl(${hue}, 100%, 35%)`;
        progressInner.style.backgroundColor = color;
        totalProgressText.style.color = color;

        totalProgressText.textContent = `总进度: ${currentProgress.toFixed(2)}% (${completedDownloads}/${totalDownloads})`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else if (progressPercentage === 100) {
            progressInner.style.backgroundColor = '#4CAF50';
            totalProgressText.style.color = '#4CAF50';
            setTimeout(() => {
                totalProgressBar.classList.add('hidden');
                totalProgressText.classList.add('hidden');
                setTimeout(() => {
                    totalProgressBar.style.display = 'none';
                    totalProgressText.style.display = 'none';
                    totalProgressBar.classList.remove('hidden', 'visible');
                    totalProgressText.classList.remove('hidden', 'visible');
                    totalDownloads = 0;
                    completedDownloads = 0;
                }, 500);
            }, 1500);
        }
    }

    requestAnimationFrame(animate);
}

if (!document.getElementById('total-progress-styles')) {
    const style = document.createElement('style');
    style.id = 'total-progress-styles';
    style.textContent = `
        #totalProgressBar, #totalProgressText {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }

        #totalProgressBar.visible, #totalProgressText.visible {
            opacity: 1;
            transform: translateY(0);
        }

        #totalProgressBar.hidden, #totalProgressText.hidden {
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.5s ease-in, transform 0.5s ease-in;
        }

        #totalProgressBar > div {
            transition: width 0.5s ease-in-out, background-color 0.5s ease-in-out;
            background-image: linear-gradient(
                45deg,
                rgba(255, 255, 255, 0.15) 25%,
                transparent 25%,
                transparent 50%,
                rgba(255, 255, 255, 0.15) 50%,
                rgba(255, 255, 255, 0.15) 75%,
                transparent 75%,
                transparent
            );
            background-size: 40px 40px;
            animation: progress-bar-stripes 1s linear infinite;
        }
        @keyframes progress-bar-stripes {
            from { background-position: 40px 0; }
            to { background-position: 0 0; }
        }
    `;
    document.head.appendChild(style);
}

updateIndicator()
updateDownloadsContainerVisibility();

function courseDownload(file_url, file_name) {
    return new Promise((resolve, reject) => {
        const useThirdPartyDownload = localStorage.getItem('useThirdPartyDownload') === 'true';
        const token = getCookie();
        const downloadsContainer = document.getElementById('downloadsContainer');
        const controller = new AbortController();
        const signal = controller.signal;

        // 创建进度条相关元素
        const progressText = document.createElement('span');
        const progressBar = document.createElement('div');
        const progressBarContainer = document.createElement('div');
        const progressContainer = document.createElement('div');
        const progressPercentText = document.createElement('span');
        const speedAndTimeContainer = document.createElement('div');
        const speedText = document.createElement('span');
        const remainingTimeText = document.createElement('span');

        // 设置样式
        const styles = {
            progressText: {
                color: '#FF9800',
                fontWeight: 'bold',
                fontSize: '16px',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                padding: '5px 0',
                borderRadius: '4px'
            },
            progressBar: {
                height: '18px',
                width: '0%',
                borderRadius: '8px',
                className: 'progressBar'
            },
            progressBarContainer: {
                background: '#E0E0E0',
                borderRadius: '8px',
                height: '18px',
                width: '100%',
                overflow: 'hidden',
                position: 'relative'
            },
            progressContainer: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around'
            },
            progressPercentText: {
                fontSize: '16px',
                marginLeft: '10px',
                position: 'absolute',
                left: '0',
                top: '0',
                width: '100%',
                textAlign: 'center',
                lineHeight: '18px',
                zIndex: '1',
                fontWeight: 'bold'
            },
            speedAndTimeContainer: {
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: '5px'
            },
            speedText: {
                fontSize: '14px',
                color: '#4CAF50',
                fontWeight: 'bold'
            },
            remainingTimeText: {
                fontSize: '14px',
                color: '#4CAF50',
                fontWeight: 'bold'
            }
        };

        // 应用样式
        Object.assign(progressText.style, styles.progressText);
        Object.assign(progressBar.style, styles.progressBar);
        Object.assign(progressBarContainer.style, styles.progressBarContainer);
        Object.assign(progressContainer.style, styles.progressContainer);
        Object.assign(progressPercentText.style, styles.progressPercentText);
        Object.assign(speedAndTimeContainer.style, styles.speedAndTimeContainer);
        Object.assign(speedText.style, styles.speedText);
        Object.assign(remainingTimeText.style, styles.remainingTimeText);

        progressText.innerText = `正在下载: ${file_name}`;
        progressBar.className = 'progressBar';
        speedText.innerText = '速度: 0 B/s';
        remainingTimeText.innerText = '剩余时间: 计算中...';

        // 组装进度条元素
        progressBarContainer.appendChild(progressBar);
        progressContainer.appendChild(progressText);
        progressContainer.appendChild(progressBarContainer);
        progressBarContainer.appendChild(progressPercentText);
        speedAndTimeContainer.appendChild(speedText);
        speedAndTimeContainer.appendChild(remainingTimeText);
        progressContainer.appendChild(speedAndTimeContainer);
        progressContainer.classList.add('slide-in');

        updateIndicator();
        updateDownloadsContainerVisibility();

        downloadsContainer.appendChild(progressContainer);
        window.AbortController = window.AbortController || {};
        window.AbortController[file_name] = controller;

        // 创建控制容器
        const controlContainer = document.createElement('div');
        const fileSizeSpan = document.createElement('span');
        const stopButton = document.createElement('button');

        Object.assign(controlContainer.style, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
        });

        Object.assign(fileSizeSpan.style, {
            fontSize: '14px',
            marginRight: 'auto',
            fontWeight: 'bold'
        });

        Object.assign(stopButton.style, {
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#FF4136',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.3s ease',
            marginTop: '10px'
        });

        stopButton.textContent = '停止';
        stopButton.onmouseover = () => { stopButton.style.transform = 'scale(1.2)'; };
        stopButton.onmouseout = () => { stopButton.style.transform = 'scale(1)'; };
        stopButton.onclick = () => {
            console.log(`尝试停止下载: ${file_name}`);
            controller.abort();
            progressContainer.classList.add('slide-out');
            progressContainer.addEventListener('animationend', () => {
                progressContainer.remove();
                completedDownloads++;
                updateIndicator();
                updateDownloadsContainerVisibility();

                if (completedDownloads >= totalDownloads) {
                    setTimeout(() => {
                        totalProgressBar.classList.add('hidden');
                        totalProgressText.classList.add('hidden');
                        setTimeout(() => {
                            totalProgressBar.style.display = 'none';
                            totalProgressText.style.display = 'none';
                            totalProgressBar.classList.remove('hidden', 'visible');
                            totalProgressText.classList.remove('hidden', 'visible');
                            totalDownloads = 0;
                            completedDownloads = 0;
                        }, 500);
                    }, 1500);
                }
            }, { once: true });
        };

        controlContainer.appendChild(fileSizeSpan);
        controlContainer.appendChild(stopButton);
        progressContainer.appendChild(controlContainer);

        addProgressBarStyles();

        updateIndicator();
        updateDownloadsContainerVisibility();
        updateContainerPosition();

        // 保存下载历史
        saveDownloadHistory(file_name, file_url);

        if (useThirdPartyDownload) {
            handleThirdPartyDownload(file_url, file_name, progressBar, progressPercentText, progressContainer, () => {
                completedDownloads++;
                updateTotalProgress();
                resolve();
            });
        } else {
            handleFetchDownload(file_url, token, signal, fileSizeSpan, progressBar, progressPercentText,
                                speedText, remainingTimeText, progressContainer, file_name, () => {
                completedDownloads++;
                updateTotalProgress();
                resolve();
            }, reject);
        }
    });
}

function addProgressBarStyles() {
    if (!document.getElementById('progress-bar-styles')) {
        let styles = document.createElement('style');
        styles.id = 'progress-bar-styles';
        styles.textContent = `
            .progressBar {
                background-color: #FF9800;
                background-image: repeating-linear-gradient(
                    45deg,
                    rgba(255, 255, 255, 0.15) 25%,
                    transparent 25%,
                    transparent 50%,
                    rgba(255, 255, 255, 0.15) 50%,
                    rgba(255, 255, 255, 0.15) 75%,
                    transparent 75%,
                    transparent
                );
                background-size: 40px 40px;
                animation: moveBackground 2s linear infinite;
            }
            @keyframes moveBackground {
                from { background-position: 0 0; }
                to { background-position: 40px 0; }
            }
            .slide-in {
                animation: slideIn 0.5s ease-out forwards;
            }
            .slide-out {
                animation: slideOut 0.5s ease-in forwards;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
}

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

function handleThirdPartyDownload(file_url, file_name, progressBar, progressPercentText, progressContainer, resolve) {
    const downloadLink = document.createElement('a');
    downloadLink.href = file_url;
    downloadLink.download = file_name;
    downloadLink.setAttribute('data-downloadurl', `application/octet-stream:${file_name}:${file_url}`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
            progressBar.style.width = `${progress}%`;
            progressPercentText.innerText = `${progress}%`;
        } else {
            clearInterval(interval);
            progressContainer.classList.add('slide-out');
            progressContainer.addEventListener('animationend', () => {
                progressContainer.remove();
                updateIndicator();
                updateDownloadsContainerVisibility();
                resolve();
            }, { once: true });
        }
    }, 200);
}

function handleFetchDownload(file_url, token, signal, fileSizeSpan, progressBar, progressPercentText, speedText, remainingTimeText, progressContainer, file_name, resolve, reject) {
    let startTime = Date.now();
    let lastUpdateTime = startTime;
    let lastReceivedBytes = 0;

    fetch(file_url, {
        signal,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
        const contentLength = response.headers.get('Content-Length');
        if (contentLength) {
            const fileSize = bytesToSize(contentLength);
            fileSizeSpan.innerText = `文件大小: ${fileSize}`;
        } else {
            fileSizeSpan.innerText = `无法获取文件大小`;
            updateIndicator();
            updateDownloadsContainerVisibility();
        }

        const reader = response.body.getReader();
        let receivedBytes = 0;
        let chunks = [];

        function processResult(result) {
            if (result.done) {
                const blob = new Blob(chunks, { type: 'application/octet-stream' });
                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = file_name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);
                progressContainer.classList.add('slide-out');
                progressContainer.addEventListener('animationend', () => {
                    progressContainer.remove();
                    updateIndicator();
                    updateDownloadsContainerVisibility();
                    resolve();
                }, { once: true });
                return;
            }
            chunks.push(result.value);
            receivedBytes += result.value.length;

            // 更新进度条,但不调用resolve
            let percentComplete = (receivedBytes / contentLength) * 100;
            progressBar.style.width = `${percentComplete.toFixed(2)}%`;
            progressPercentText.innerText = `${percentComplete.toFixed(2)}%`;

            // 更新下载速度和剩余时间
            const currentTime = Date.now();
            const timeDiff = (currentTime - lastUpdateTime) / 1000;
            if (timeDiff >= 1) {
                const bytesPerSecond = (receivedBytes - lastReceivedBytes) / timeDiff;
                const speed = bytesToSize(bytesPerSecond) + '/s';
                speedText.innerText = `速度: ${speed}`;

                const remainingBytes = contentLength - receivedBytes;
                const remainingTime = remainingBytes / bytesPerSecond;
                const remainingTimeFormatted = formatTime(remainingTime);
                remainingTimeText.innerText = `剩余: ${remainingTimeFormatted}`;

                lastUpdateTime = currentTime;
                lastReceivedBytes = receivedBytes;
            }

            reader.read().then(processResult);
        }

        reader.read().then(processResult);
    })
        .catch(e => {
        progressContainer.remove();
        updateIndicator();
        updateDownloadsContainerVisibility();
        reject(e);
    });
}

// 格式化时间函数
function formatTime(seconds) {
    if (seconds === Infinity || isNaN(seconds)) {
        return '计算中...';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    let timeString = '';
    if (hours > 0) {
        timeString += `${hours}小时 `;
    }
    if (minutes > 0 || hours > 0) {
        timeString += `${minutes}分钟 `;
    }
    timeString += `${remainingSeconds}秒`;

    return timeString.trim();
}

window.updateUI = function () {
    const download_list = document.getElementById("download_list");
    const container = createOrUpdateContainer(download_list);

    // 创建或更新 UI 组件
    createLottieAnimation(download_list);
    createOrUpdateSearchInput(container);
    createOrUpdateQuickFilterSelect(container);
    createOrUpdateSortSelect(container);
    createOrUpdateSelectAllCheckbox(download_list);
    createOrUpdateBulkDownloadButton(download_list);
    createOrUpdateTreeViewButton(download_list);
}

function createLottieAnimation(parent) {
    if (!document.getElementById("lottie-animation-container")) {
        const lottieContainer = document.createElement("div");
        lottieContainer.id = "lottie-animation-container";
        lottieContainer.innerHTML = `
        <dotlottie-player src="https://lottie.host/f6cfdc36-5c9a-4dac-bb71-149cdf2e7d92/VRIhn9vXE5.json"
                          background="transparent" speed="1" loop autoplay>
        </dotlottie-player>`;

        Object.assign(lottieContainer.style, {
            position: "absolute",
            top: "85%",
            right: "0",
            transform: "translateY(-50%)",
            zIndex: "-1",
            width: "300px",
            height: "130px",
            overflow: "hidden"
        });

        const style = document.createElement('style');
        style.textContent = `
            #lottie-animation-container dotlottie-player {
                width: 300px !important;
                height: 300px !important;
                transform: scaleX(-1) translateY(-25%);
            }
        `;
        document.head.appendChild(style);

        parent.appendChild(lottieContainer);
    }
}

function createOrUpdateContainer(parent) {
    let container = document.getElementById("searchAndFilterContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "searchAndFilterContainer";
        Object.assign(container.style, {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            marginTop: '30px',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: 'rgba(255, 249, 230, 0.9)',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '2px solid #ffd700',
            zIndex: '10000'
        });

        // 添加标题
        const title = document.createElement("h3");
        title.textContent = "资源筛选";
        Object.assign(title.style, {
            margin: '0 0 15px 0',
            color: '#ffa500',
            textAlign: 'center',
            fontWeight: 'bold',
            zIndex: '2'
        });
        container.appendChild(title);

        // 创建输入框容器
        const inputContainer = document.createElement("div");
        Object.assign(inputContainer.style, {
            display: "flex",
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            zIndex: '2'
        });
        container.appendChild(inputContainer);

        // 添加 Lottie 动画
        const lottieContainer = document.createElement("div");
        Object.assign(lottieContainer.style, {
            position: 'absolute',
            top: '5px',
            left: '10px',
            width: '40px',
            height: '40px',
            zIndex: '1'
        });
        container.appendChild(lottieContainer);

        const player = document.createElement('dotlottie-player');
        player.setAttribute('src', "https://lottie.host/fbd042e1-0e8e-43a9-8a29-3407c692f209/UNft7IfOMP.json");
        player.setAttribute('autoplay', '');
        player.setAttribute('loop', '');
        player.style.width = "100%";
        player.style.height = "100%";
        lottieContainer.appendChild(player);

        player.addEventListener('ready', () => {
            player.play();
        });

        parent.prepend(container);

        if (document.readyState === 'complete') {
            initLottie();
        } else {
            window.addEventListener('load', initLottie);
        }

        function initLottie() {
            document.querySelectorAll('.lottie-animation').forEach(element => {
                if (element.lottieInstance) {
                    try {
                        element.lottieInstance.play();
                    } catch (error) {
                        console.warn('播放 Lottie 动画失败:', error);
                    }
                } else {
                    console.warn('Lottie 实例不存在:', element);
                }
            });
        }
    }
    return container;
}

function createOrUpdateSearchInput(container) {
    let searchInput = document.getElementById("searchInput");
    if (!searchInput) {
        searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = "搜索文件名/后缀名";
        searchInput.id = "searchInput";
        searchInput.className = "course-search-input search-input-with-icon";
        Object.assign(searchInput.style, {
            width: '200px',
            height: '38px',
            padding: '0 40px 0 15px',
            flex: '1',
            marginRight: '10px',
            border: '2px solid #ffa500',
            borderRadius: '20px',
            outline: 'none',
            color: '#ffa500',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#fff',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 5px rgba(255, 165, 0, 0.2)',
        });

        searchInput.addEventListener("input", () => filterList(searchInput.value));
        searchInput.addEventListener("focus", () => {
            searchInput.style.boxShadow = '0 0 8px rgba(255, 165, 0, 0.5)';
            searchInput.style.borderColor = '#ff8c00';
        });
        searchInput.addEventListener("blur", () => {
            searchInput.style.boxShadow = '0 2px 5px rgba(255, 165, 0, 0.2)';
            searchInput.style.borderColor = '#ffa500';
        });

        const style = document.createElement('style');
        style.textContent = `
            .course-search-input::placeholder{
                color: #ffa500;
            }
            .search-input-with-icon {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23ffa500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>');
                background-repeat: no-repeat;
                background-position: right 15px center;
            }
        `;
        document.head.appendChild(style);

        container.querySelector("div").appendChild(searchInput);
    }
    searchInput.value = window.currentSearchKeyword || '';
}

function createOrUpdateQuickFilterSelect(container) {
    let quickFilterSelect = document.getElementById("quickFilterSelect");
    if (!quickFilterSelect) {
        quickFilterSelect = createCustomSelect("quickFilterSelect", "筛选类别");
        quickFilterSelect.addEventListener("change", (e) => filterListByCategory(e.detail));
        container.querySelector("div").appendChild(quickFilterSelect);
    }
    updateCustomSelectOptions(quickFilterSelect, window.quickFilters);
    // 保持当前的筛选类别
    setCustomSelectValue(quickFilterSelect, window.currentFilterCategory || '');
}

function createOrUpdateSortSelect(container) {
    let sortSelect = document.getElementById("sortSelect");
    if (!sortSelect) {
        sortSelect = createCustomSelect("sortSelect", "排序方式");
        sortSelect.addEventListener("change", (e) => sortList(e.detail));
        container.querySelector("div").appendChild(sortSelect);
    }
    updateCustomSelectOptions(sortSelect, [
        { value: '', label: '排序方式' },
        { value: 'date_asc', label: '日期升序' },
        { value: 'date_desc', label: '日期降序' },
        { value: 'xiaoya_order', label: '小雅排序' }
    ]);
}

function createCustomSelect(id, placeholder) {
    const select = document.createElement("div");
    select.id = id;
    select.className = "custom-select";
    select.innerHTML = `
        <div class="select-selected" data-value="">${placeholder}</div>
        <div class="select-items select-hide"></div>
    `;

    const selected = select.querySelector(".select-selected");
    const items = select.querySelector(".select-items");

    selected.addEventListener("click", function (e) {
        e.stopPropagation(); // 阻止事件冒泡
        closeAllSelect(this);
        items.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });

    items.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    document.addEventListener("click", closeAllSelect);

    return select;
}

function updateCustomSelectOptions(select, options) {
    const items = select.querySelector(".select-items");
    items.innerHTML = '';
    options.forEach(option => {
        const div = document.createElement("div");
        div.textContent = option.label;
        div.dataset.value = option.value;
        div.addEventListener("click", function (e) {
            e.stopPropagation();
            const selected = this.parentNode.previousElementSibling;
            selected.textContent = this.textContent;
            selected.dataset.value = this.dataset.value;
            this.parentNode.querySelector(".same-as-selected")?.classList.remove("same-as-selected");
            this.classList.add("same-as-selected");
            select.dispatchEvent(new CustomEvent('change', { detail: this.dataset.value }));
            closeAllSelect();
        });
        items.appendChild(div);
    });

    const rect = items.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
        items.style.bottom = '100%';
        items.style.top = 'auto';
    } else {
        items.style.top = '100%';
        items.style.bottom = 'auto';
    }
}


function setCustomSelectValue(select, value) {
    const items = select.querySelector(".select-items");
    const selected = select.querySelector(".select-selected");
    const option = items.querySelector(`[data-value="${value}"]`);
    if (option) {
        selected.textContent = option.textContent;
        selected.dataset.value = value;
        items.querySelector(".same-as-selected")?.classList.remove("same-as-selected");
        option.classList.add("same-as-selected");
    }
}

function closeAllSelect(elmnt) {
    const items = document.getElementsByClassName("select-items");
    const selected = document.getElementsByClassName("select-selected");
    for (let i = 0; i < selected.length; i++) {
        if (elmnt != selected[i]) {
            selected[i].classList.remove("select-arrow-active");
        }
    }
    for (let i = 0; i < items.length; i++) {
        if (elmnt != items[i] && elmnt != selected[i]) {
            items[i].classList.add("select-hide");
        }
    }
}

function applyCommonSelectStyle(select) {
    Object.assign(select.style, {
        padding: '10px 15px',
        flex: '1',
        marginRight: '10px',
        border: '2px solid #ffa500',
        borderRadius: '20px',
        outline: 'none',
        cursor: 'pointer',
        color: '#ffa500',
        fontWeight: 'bold',
        backgroundColor: '#fff',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 5px rgba(255, 165, 0, 0.2)',
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none'
    });

    select.style.backgroundImage = 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFA500%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")';
    select.style.backgroundRepeat = 'no-repeat';
    select.style.backgroundPosition = 'right 15px top 50%';
    select.style.backgroundSize = '12px auto';
    select.style.paddingRight = '30px';

    select.addEventListener("focus", () => {
        select.style.boxShadow = '0 0 10px rgba(255, 165, 0, 0.5)';
    });
    select.addEventListener("blur", () => {
        select.style.boxShadow = '0 2px 5px rgba(255, 165, 0, 0.2)';
    });
}

function updateSelectOptions(select, options) {
    select.innerHTML = '';
    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.text = option.label;
        opt.style.fontWeight = 'bold';
        select.appendChild(opt);
    });
}

function createOrUpdateSelectAllCheckbox(parent) {
    if (!document.getElementById("selectAllCheckbox")) {
        const checkboxContainer = document.createElement('div');
        Object.assign(checkboxContainer.style, {
            display: 'flex',
            position: "relative",
            alignItems: 'center',
            padding: '5px 10px',
            marginBottom: '10px'
        });

        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.className = 'custom-checkbox';
        selectAllCheckbox.id = 'selectAllCheckbox';
        selectAllCheckbox.style.marginRight = '10px';

        const selectAllLabel = document.createElement('label');
        selectAllLabel.htmlFor = 'selectAllCheckbox';
        selectAllLabel.textContent = '全选';
        Object.assign(selectAllLabel.style, {
            fontWeight: 'bold',
            color: '#FFA500',
            userSelect: 'none'
        });

        checkboxContainer.appendChild(selectAllCheckbox);
        checkboxContainer.appendChild(selectAllLabel);
        parent.prepend(checkboxContainer);

        selectAllCheckbox.addEventListener('change', handleSelectAllChange);
    }
}

function handleSelectAllChange() {
    const selectAllCheckbox = document.getElementById("selectAllCheckbox");
    const checkboxes = document.querySelectorAll("#download_list input[type='checkbox']:not(#selectAllCheckbox)");
    checkboxes.forEach(checkbox => {
        if (checkbox.getAttribute('data-visible') === 'true') {
            checkbox.checked = selectAllCheckbox.checked;
            checkbox.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        }
    });

    // 更新树状图
    syncTreeWithDownloadList();
}

// 按钮通用样式
function applyCommonButtonStyle(button, gradientColors) {
    Object.assign(button.style, {
        background: `linear-gradient(90deg, ${gradientColors.join(", ")})`,
        backgroundSize: '200% 100%',
        animation: 'flowingGradient 3s ease infinite',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '30px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        position: 'fixed',
        top: '20px',
        zIndex: 10000,
        fontSize: '16px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        outline: 'none',
    });

    button.addEventListener('mouseover', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 7px 14px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.08)';
        button.style.filter = 'brightness(110%)';
    });

    button.addEventListener('mouseout', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)';
        button.style.filter = 'brightness(100%)';
    });

    button.addEventListener('mousedown', () => {
        button.style.transform = 'translateY(1px)';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.08)';
    });

    button.addEventListener('mouseup', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 7px 14px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.08)';
    });

    button.addEventListener('focus', () => {
        button.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.5), 0 4px 6px rgba(0,0,0,0.1)';
    });

    button.addEventListener('blur', () => {
        button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)';
    });
}

function createOrUpdateBulkDownloadButton(parent) {
    if (!document.getElementById("bulkDownloadButton")) {
        const bulkDownloadButton = document.createElement('button');
        const bulkDownloadButtonGradient = ['#ffa500', '#ff8c00', '#ffa500'];
        bulkDownloadButton.innerHTML = '<span style="font-weight: bold;">批量下载</span>';
        bulkDownloadButton.id = "bulkDownloadButton";
        bulkDownloadButton.title = '点击下载所选文件';
        applyCommonButtonStyle(bulkDownloadButton, bulkDownloadButtonGradient);
        bulkDownloadButton.style.right = '15px';
        bulkDownloadButton.addEventListener('click', handleBulkDownload);
        parent.appendChild(bulkDownloadButton);
    }
}

// 批量下载处理函数
async function handleBulkDownload() {
    console.log('开始批量下载');
    const checkboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked");

    if (checkboxes.length === 0) {
        showNotification('还啥都没选呢（；´д｀）ゞ', 'warning');
        console.log('没有选择任何文件，批量下载已取消');
        return;
    }

    const downloadQueue = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked && checkbox.getAttribute('data-visible') === 'true')
    .map(checkbox => {
        const container = checkbox.closest('div');
        const link = container.querySelector('a.download-link');
        return {
            quoteId: link.getAttribute('data-quote-id'),
            name: link.getAttribute('data-origin-name')
        };
    });

    if (totalDownloads === 0) {
        totalDownloads = downloadQueue.length;
        completedDownloads = 0;
    } else {
        totalDownloads += downloadQueue.length;
    }

    console.log(`队列中的文件数: ${downloadQueue.length}`);

    if (downloadQueue.length > 10) {
        showNotification(
            `已选择 ${downloadQueue.length} 个文件，下载可能造成网络或性能瓶颈。确认继续？`,
            'confirm',
            async () => {
                processDownloadQueue(downloadQueue);
            },
            () => {
                showNotification('批量下载已取消', 'info');
                console.log('用户取消了批量下载');
                totalDownloads = 0;
                completedDownloads = 0;
            }
        );
    } else {
        processDownloadQueue(downloadQueue);
    }
}

async function processDownloadQueue(downloadQueue) {
    const useThirdPartyDownload = localStorage.getItem('useThirdPartyDownload') === 'true';

    for (let file of downloadQueue) {
        try {
            console.log(`准备下载: ${file.name}`);
            const fileUrl = await window.getDownloadUrl(file.quoteId);
            courseDownload(fileUrl, file.name).then(() => {
                console.log(`完成下载: ${file.name}`);
            }).catch(error => {
                console.error(`下载失败: ${file.name}`, error);
            });

            if (useThirdPartyDownload) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error(`处理文件失败: ${file.name}`, error);
        }
    }
}

async function startBulkDownload(downloadQueue) {
    const useThirdPartyDownload = localStorage.getItem('useThirdPartyDownload') === 'true';

    totalDownloads = downloadQueue.length;
    completedDownloads = 0;

    for (let file of downloadQueue) {
        try {
            console.log(`正在处理文件: ${file.name}`);
            const fileUrl = await window.getDownloadUrl(file.quoteId);
            await courseDownload(fileUrl, file.name);

            console.log(`成功下载: ${file.name}`);

            if (useThirdPartyDownload) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error(`下载 ${file.name} 时发生错误:`, error);
        }
    }

    console.log('批量下载任务全部完成');
}

function sortList(order) {
    const downloadList = document.getElementById("download_list");
    const items = Array.from(downloadList.querySelectorAll(".file-item"));

    // 构建文件夹 ID 到索引的映射（用于小雅排序）
    const folderIndexMap = {};
    svgElementIds.forEach((id, index) => {
        folderIndexMap[id] = index;
    });

    items.sort((a, b) => {
        const aParentId = a.querySelector('a').getAttribute('data-parent-id');
        const bParentId = b.querySelector('a').getAttribute('data-parent-id');
        const aId = a.querySelector('a').getAttribute('data-resource-id');
        const bId = b.querySelector('a').getAttribute('data-resource-id');

        if (order === 'xiaoya_order') {
            const aFolderIndex = folderIndexMap[aParentId] || Infinity;
            const bFolderIndex = folderIndexMap[bParentId] || Infinity;

            if (aFolderIndex !== bFolderIndex) {
                return aFolderIndex - bFolderIndex; // 不同文件夹，按文件夹顺序排序
            } else {
                return aId.localeCompare(bId); // 同一文件夹，按文件 ID 排序
            }
        } else {
            const aDate = new Date(a.querySelector('a').getAttribute('data-created-at'));
            const bDate = new Date(b.querySelector('a').getAttribute('data-created-at'));

            if (order === 'date_asc') {
                return aDate - bDate;
            } else if (order === 'date_desc') {
                return bDate - aDate;
            }
        }
    });

    items.forEach(item => downloadList.appendChild(item));

    // 重新应用筛选条件
    applyFilters();
}

window.toggleListVisibility = function () {
    var download_list = document.getElementById("download_list");

    if (download_list.style.transform === 'scaleY(0)' || download_list.style.transform === '') {
        download_list.style.transform = "scaleY(1)";
        download_list.style.opacity = "1";
        download_list.style.overflowY = "auto";
    } else {
        download_list.style.transform = "scaleY(0)";
        download_list.style.opacity = "0";
    }
}

function filterList(keyword) {
    window.currentSearchKeyword = keyword.toLowerCase();
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.value = keyword;
    }
    applyFilters();
}

function filterListByCategory(categoryValue) {
    window.currentFilterCategory = categoryValue;
    applyFilters();
}

function applyFilters() {
    var searchKeyword = window.currentSearchKeyword;
    var filterCategory = window.currentFilterCategory;
    var extensions = filterCategory ? filterCategory.split(',').map(ext => ext.trim()) : [];

    var containers = document.querySelectorAll("#download_list .file-item");
    containers.forEach(function (container) {
        var file = container.querySelector("a");
        var checkbox = container.querySelector("input[type='checkbox']");
        var fileName = file.getAttribute('data-origin-name').toLowerCase();
        var fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);

        var isSearchMatch = searchKeyword === '' || fileName.includes(searchKeyword);
        var isFilterMatch = filterCategory === "" || extensions.includes(fileExtension);

        var isVisible = isSearchMatch && isFilterMatch;
        container.style.display = isVisible ? "flex" : "none";
        checkbox.setAttribute('data-visible', isVisible.toString());
    });

    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        const visibleCheckboxes = Array.from(document.querySelectorAll("#download_list .file-item input[type='checkbox'][data-visible='true']"));
        const allVisibleChecked = visibleCheckboxes.every(checkbox => checkbox.checked);
        selectAllCheckbox.checked = visibleCheckboxes.length > 0 && allVisibleChecked;
    }
    var visibleItems = document.querySelectorAll("#download_list .file-item[style*='display: flex']");
    // 获取下载列表容器
    var download_list = document.getElementById("download_list");
    var noResultsMessage = download_list.querySelector('p');
    if (visibleItems.length === 0) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('p');
            noResultsMessage.style.color = '#FFA500';
            noResultsMessage.style.textAlign = 'center';
            noResultsMessage.style.fontWeight = 'bold';
            noResultsMessage.innerHTML = '<span style="font-size: 1.2em;"><span style="color: red;">没有</span></span>课件( ´･･)ﾉ(._.`)';
            download_list.appendChild(noResultsMessage);
        }
    } else {
        if (noResultsMessage) {
            download_list.removeChild(noResultsMessage);
        }
    }
}

// 配置对象
const TREE_VIEW_CONFIG = {
    buttonId: 'treeViewButton',
    containerId: 'treeContainer',
    contentId: 'treeContent',
    loadingId: 'loadingAnimation',
    buttonGradient: ['#27B4DB', '#2DC3FF', '#03A9F4'],
    buttonText: '课程结构',
    containerStyles: {
        width: '80%',
        minHeight: '600px',
        maxWidth: '600px',
        maxHeight: '80vh',
        backgroundColor: '#fefefe',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        zIndex: 10000
    }
};

// 主函数
function createOrUpdateTreeViewButton(parent) {
    let treeViewButton = document.getElementById(TREE_VIEW_CONFIG.buttonId);
    let treeContainer = document.getElementById(TREE_VIEW_CONFIG.containerId);

    if (!treeViewButton) {
        treeViewButton = createTreeViewButton();
        treeViewButton.title = '点击构建树状图';
        parent.appendChild(treeViewButton);
    }

    if (!treeContainer) {
        treeContainer = createTreeContainer();
        document.body.appendChild(treeContainer);
        makeDraggable(treeContainer);
    }
    treeContainer.innerHTML = '';

    const dragHandle = createDragHandle();
    treeContainer.appendChild(dragHandle);

    const closeButton = createCloseButton(treeContainer);
    dragHandle.appendChild(closeButton);

    const searchContainer = createSearchContainer();
    treeContainer.appendChild(searchContainer);

    const clearSearchButton = searchContainer.querySelector('#treeClearSearchButton');
    if (clearSearchButton) {
        clearSearchButton.addEventListener('click', clearTreeSearch);
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'treeContentWrapper';
    contentWrapper.style.cssText = `
        max-height: calc(80vh - 100px);
        overflow-y: auto;
        padding: 20px;
    `;
    treeContainer.appendChild(contentWrapper);

    const bulkDownloadButton = document.createElement('button');
    bulkDownloadButton.id = 'treeBulkDownloadButton';
    bulkDownloadButton.title = '点击下载所选文件';
    bulkDownloadButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    <span style="margin-left: 8px;">下载</span>
`;
    bulkDownloadButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 12px 24px;
    border: none;
    border-radius: 50px;
    z-index: 9999;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
`;

    bulkDownloadButton.addEventListener('mouseover', function () {
        this.style.backgroundColor = '#45a049';
        this.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
        this.style.transform = 'translateY(-2px)';
    });

    bulkDownloadButton.addEventListener('mouseout', function () {
        this.style.backgroundColor = '#4CAF50';
        this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        this.style.transform = 'translateY(0)';
    });

    bulkDownloadButton.addEventListener('click', handleBulkDownload);
    contentWrapper.appendChild(bulkDownloadButton);

    const loadingAnimation = createLoadingAnimation();
    const treeContent = createTreeContent();

    contentWrapper.appendChild(loadingAnimation);
    contentWrapper.appendChild(treeContent);

    const searchInput = searchContainer.querySelector('#treeSearchInput');
    const searchButton = searchContainer.querySelector('#treeSearchButton');
    const prevButton = searchContainer.querySelector('#treePrevButton');
    const nextButton = searchContainer.querySelector('#treeNextButton');

    let currentMatchIndex = -1;
    let matches = [];
    let highlightTimeout;

    if (searchInput && searchButton && prevButton && nextButton) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performTreeSearch();
            }
        });

        searchButton.addEventListener('click', performTreeSearch);
        prevButton.addEventListener('click', () => navigateMatches(-1));
        nextButton.addEventListener('click', () => navigateMatches(1));
    }


    function performTreeSearch() {
        if (!searchInput) return;

        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm === '') {
            clearTreeSearch();
            return;
        }

        forcedExpandedItems.clear();

        const treeItems = treeContainer.querySelectorAll('.item-content');
        matches = [];

        removeAllHighlights();

        treeItems.forEach(item => {
            let textContent, span;

            const folderSpan = item.querySelector('.folder');
            if (folderSpan) {
                textContent = folderSpan.textContent.trim();
                span = folderSpan;
            } else {
                textContent = item.textContent.trim();
                span = item.querySelector('span:not(.folder-toggle):not(.folder):not(.file-extension)');
            }

            if (textContent && textContent.toLowerCase().includes(searchTerm)) {
                matches.push(span);
                const parentElements = getParentElements(item.closest('li'));
                parentElements.forEach(el => forcedExpandedItems.add(el));
                expandParentFolders(item.closest('li'));
            }
        });

        currentMatchIndex = matches.length > 0 ? 0 : -1;
        updateNavigationButtons();
        updateSearchInfo();

        if (matches.length > 0) {
            highlightCurrentMatch();
            scrollToMatch(currentMatchIndex);
        }
    }

    function getParentElements(element) {
        const parents = [];
        let current = element;
        while (current && current !== treeContainer) {
            if (current.tagName === 'LI') {
                parents.push(current);
            }
            current = current.parentElement;
        }
        return parents;
    }

    function navigateMatches(direction) {
        if (matches.length === 0) return;

        currentMatchIndex += direction;
        if (currentMatchIndex < 0) currentMatchIndex = matches.length - 1;
        if (currentMatchIndex >= matches.length) currentMatchIndex = 0;

        updateNavigationButtons();
        updateSearchInfo();
        highlightCurrentMatch();
        scrollToMatch(currentMatchIndex);
    }

    function updateSearchInfo() {
        const searchInfo = document.getElementById('treeSearchInfo');
        if (searchInfo) {
            if (matches.length > 0) {
                searchInfo.textContent = `${currentMatchIndex + 1} / ${matches.length}`;
            } else {
                searchInfo.textContent = '无匹配结果';
            }
        }
    }

    function highlightCurrentMatch() {
        removeAllHighlights();
        if (currentMatchIndex >= 0 && currentMatchIndex < matches.length) {
            const currentMatch = matches[currentMatchIndex];

            const fragment = document.createDocumentFragment();
            while (currentMatch.firstChild) {
                fragment.appendChild(currentMatch.firstChild);
            }

            fragment.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const highlightSpan = document.createElement('span');
                    highlightSpan.className = 'highlight';
                    highlightSpan.textContent = node.textContent;
                    node.parentNode.replaceChild(highlightSpan, node);
                }
            });

            currentMatch.appendChild(fragment);

            scrollToMatch(currentMatchIndex);

            clearTimeout(highlightTimeout);
            highlightTimeout = setTimeout(() => {
                removeAllHighlights();
            }, 2000);
        }
    }

    function removeAllHighlights() {
        treeContainer.querySelectorAll('.highlight').forEach(el => {
            const parent = el.parentNode;
            while (el.firstChild) {
                parent.insertBefore(el.firstChild, el);
            }
            parent.removeChild(el);
        });
    }

    function scrollToMatch(index) {
        if (index >= 0 && index < matches.length) {
            const contentWrapper = document.getElementById('treeContentWrapper');
            const matchElement = matches[index];
            const wrapperRect = contentWrapper.getBoundingClientRect();
            const matchRect = matchElement.getBoundingClientRect();

            contentWrapper.scrollTop += matchRect.top - wrapperRect.top - wrapperRect.height / 2 + matchRect.height / 2;

            matchElement.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
    }

    function clearTreeSearch() {
        const searchInput = document.getElementById('treeSearchInput');
        const searchInfo = document.getElementById('treeSearchInfo');
        if (searchInput) {
            searchInput.value = '';
        }
        if (searchInfo) {
            searchInfo.textContent = '';
        }

        forcedExpandedItems.clear();
        removeAllHighlights();
        matches = [];
        currentMatchIndex = -1;
        updateNavigationButtons();

        const allFolders = treeContainer.querySelectorAll('.folder-toggle.open');
        allFolders.forEach(toggle => {
            const li = toggle.closest('li');
            const ul = li.querySelector('ul');
            if (ul) {
                toggle.classList.remove('open');
                ul.classList.remove('expanded');
                ul.classList.add('collapsed');
                ul.style.height = ul.scrollHeight + 'px';
                ul.style.display = 'block';
                ul.offsetHeight;

                ul.style.height = '0px';
                ul.addEventListener('transitionend', function handler() {
                    if (ul.classList.contains('collapsed')) {
                        ul.style.display = 'none';
                    }
                    ul.removeEventListener('transitionend', handler);
                }, { once: true });
            }
        });
    }

    function updateNavigationButtons() {
        prevButton.disabled = matches.length === 0;
        nextButton.disabled = matches.length === 0;
    }

    function expandParentFolders(element) {
        let current = element;
        while (current !== treeContainer) {
            if (current.tagName === 'LI') {
                const folderToggle = current.querySelector('.folder-toggle');
                const ul = current.querySelector('ul');
                if (folderToggle && ul) {
                    folderToggle.classList.add('open');
                    ul.classList.remove('collapsed');
                    ul.classList.add('expanded');
                    ul.style.display = 'block';
                    ul.style.height = 'auto';
                }
            }
            current = current.parentElement;
        }
    }

    setupTreeViewButtonEvents(treeViewButton, treeContainer, treeContent, loadingAnimation);
    setupTreeCheckboxEvents(treeContainer);
    addTreeViewStyles();
    setInitialFoldState(treeContainer);
}

function setInitialFoldState(container) {
    const rootUl = container.querySelector('ul');
    if (rootUl) {
        const subFolders = rootUl.querySelectorAll('li > ul');
        subFolders.forEach(ul => {
            if (!ul.classList.contains('collapsed')) {
                ul.classList.add('collapsed');
                ul.style.display = 'none';
                const toggle = ul.parentElement.querySelector('.folder-toggle');
                if (toggle) {
                    toggle.classList.remove('open');
                }
            }
        });
    }
}

// 创建树状图按钮
function createTreeViewButton() {
    const button = document.createElement('button');
    button.id = TREE_VIEW_CONFIG.buttonId;
    button.innerHTML = `<span style="font-weight: bold;">${TREE_VIEW_CONFIG.buttonText}</span>`;
    applyCommonButtonStyle(button, TREE_VIEW_CONFIG.buttonGradient);
    button.style.right = '150px';
    return button;
}

function createDragHandle() {
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.innerHTML = `
        <span>课程结构</span>
        <span class="drag-icon">&#x2630;</span>
        <span class="drag-hint">拖动区域</span>
    `;
    dragHandle.style.position = 'sticky';
    dragHandle.style.top = '0';
    dragHandle.style.zIndex = '1';
    return dragHandle;
}

function createSearchContainer() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="treeSearchInput" placeholder="搜索..." style="font-weight: bold;" />
        <button id="treeSearchButton" class="search-button" title="搜索">
            <svg class="search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
        </button>
        <button id="treeClearSearchButton" class="search-button" title="清除搜索并全部收起">
            <svg class="search-icon" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        </button>
        <button id="treePrevButton" class="search-button" title="上一个" disabled>
            <svg class="search-icon" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
        </button>
        <button id="treeNextButton" class="search-button" title="下一个" disabled>
            <svg class="search-icon" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
        </button>
        <span id="treeSearchInfo" class="search-info"></span>
    `;
    return searchContainer;
}

// 创建树状图容器
function createTreeContainer() {
    const container = document.createElement('div');
    container.id = TREE_VIEW_CONFIG.containerId;
    Object.assign(container.style, TREE_VIEW_CONFIG.containerStyles, {
        display: 'none',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(1)',
        overflowY: 'hidden',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
    });

    container.close = function () {
        this.style.opacity = '0';
        this.style.transform = 'translate(-50%, -50%) scale(0.95)';

        this.addEventListener('transitionend', function closeHandler() {
            this.style.display = 'none';
            this.removeEventListener('transitionend', closeHandler);
            disableControls(false); // 在关闭容器时启用控件
        }, { once: true });
    };

    return container;
}

// 创建树状图内容区
function createTreeContent() {
    const content = document.createElement('div');
    content.id = TREE_VIEW_CONFIG.contentId;
    content.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 600px;
            width: 100%;
        ">
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">🌱</div>
                <h3 style="margin-bottom: 15px;">
                    <span style="
                        background: linear-gradient(90deg, #1e90ff, #00bfff, #87cefa);
                        background-size: 200% 100%;
                        animation: flowingGradient 5s ease infinite;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        font-weight: bold;
                        font-size: 24px;
                    ">课程结构已改变</span>
                </h3>
                <p style="
                    font-size: 14px;
                    font-weight: bold;
                    color: #4682b4;
                    max-width: 300px;
                    margin: 0 auto;
                    line-height: 1.6;
                ">
                    请重新构建树状图(ˉ﹃ˉ)
                </p>
            </div>
        </div>
    `;
    return content;
}

// 创建加载动画
function createLoadingAnimation() {
    const loading = document.createElement('div');
    loading.id = TREE_VIEW_CONFIG.loadingId;
    loading.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        z-index: 10001;
    `;

    const container = document.createElement('div');
    container.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    `;
    loading.appendChild(container);

    const loader = document.createElement('div');
    loader.className = 'loader';
    container.appendChild(loader);

    const style = document.createElement('style');
    style.textContent = `
        .loader {
            font-weight: bold;
            font-size: 30px;
            display: inline-grid;
            color: #3498db;
        }
        .loader:before,
        .loader:after {
            content: "正在构建……";
            grid-area: 1/1;
            line-height: 1em;
            -webkit-mask: linear-gradient(90deg, #000 50%, #0000 0) 0 50%/2ch 100%;
            -webkit-mask-position: calc(var(--s,0)*1ch) 50%;
            animation: l30 2s infinite;
        }
        .loader:after {
            --s:-1;
        }
        @keyframes l30 {
            33%  {transform: translateY(calc(var(--s,1)*50%));-webkit-mask-position:calc(var(--s,0)*1ch) 50%}
            66%  {transform: translateY(calc(var(--s,1)*50%));-webkit-mask-position:calc(var(--s,0)*1ch + 1ch) 50%}
            100% {transform: translateY(calc(var(--s,1)*0%)); -webkit-mask-position:calc(var(--s,0)*1ch + 1ch) 50%}
        }
    `;

    document.head.appendChild(style);

    return loading;
}

// 创建关闭按钮
function createCloseButton(treeContainer) {
    const closeButton = document.createElement('span');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        margin-top: -10px;
        margin-right: -10px;
        padding: 5px;
        z-index: 10001;
    `;
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        treeContainer.close(); // 使用容器的 close 方法
    });
    return closeButton;
}

// 设置树状图按钮事件
function setupTreeViewButtonEvents(button, container, content, loading) {
    button.onclick = () => {
        if (course_resources) {
            if (container.style.display === 'none') {
                // 打开树状图
                container.style.display = 'block';
                container.style.opacity = '0';
                container.style.transform = 'translate(-50%, -50%) scale(0.95)';
                loading.style.display = 'block';
                content.innerHTML = '';

                // 清除搜索输入和结果
                const searchInput = container.querySelector('#treeSearchInput');
                const searchInfo = container.querySelector('#treeSearchInfo');
                if (searchInput) searchInput.value = '';
                if (searchInfo) searchInfo.textContent = '';

                // 禁用导航按钮
                const prevButton = document.querySelector('#treePrevButton');
                const nextButton = document.querySelector('#treeNextButton');
                if (prevButton) prevButton.disabled = true;
                if (nextButton) nextButton.disabled = true;

                // 禁用搜索框、筛选框和排序框
                disableControls(true);
                requestAnimationFrame(() => {
                    container.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                    container.style.opacity = '1';
                    container.style.transform = 'translate(-50%, -50%) scale(1)';
                });

                // 全部收起按钮的事件监听
                const collapseAllButton = container.querySelector('#treeCollapseAllButton');
                if (collapseAllButton) {
                    collapseAllButton.addEventListener('click', () => {
                        const allOpenFolders = container.querySelectorAll('.folder-toggle.open');
                        allOpenFolders.forEach(toggle => {
                            const li = toggle.closest('li');
                            const ul = li.querySelector('ul');
                            if (ul) {
                                toggle.classList.remove('open');
                                ul.classList.remove('expanded');
                                ul.classList.add('collapsed');
                                ul.style.height = ul.scrollHeight + 'px';
                                ul.offsetHeight; // 触发重排
                                ul.style.height = '0px';
                                ul.addEventListener('transitionend', function handler() {
                                    if (ul.classList.contains('collapsed')) {
                                        ul.style.display = 'none';
                                    }
                                    ul.removeEventListener('transitionend', handler);
                                }, { once: true });
                            }
                        });
                    });
                }

                const itemCount = countTreeItems(course_resources);
                const animationDuration = Math.min(Math.max(itemCount * 10, 500), 3000);

                setTimeout(() => {
                    // 重新生成树状图内容
                    content.innerHTML = createTreeHTML(course_resources);
                    addFolderToggle(content);
                    syncTreeWithDownloadList();
                    setInitialFoldState(container);
                    addPreviewButtonListeners();
                    loading.style.display = 'none';
                    content.style.opacity = '0';
                    requestAnimationFrame(() => {
                        content.style.transition = 'opacity 0.3s ease-out';
                        content.style.opacity = '1';
                    });

                    // 启用搜索功能
                    const searchInput = container.querySelector('#treeSearchInput');
                    const searchButton = container.querySelector('#treeSearchButton');
                    if (searchInput && searchButton) {
                        searchInput.disabled = false;
                        searchButton.disabled = false;
                    }
                }, animationDuration);
            } else {
                // 关闭树状图
                container.close();
            }
        } else {
            showNotification('课程资源尚未加载，请稍后再试。', 'warning');
        }
    };
}

// 递归计算树状图中的项目数量
function countTreeItems(resources) {
    if (!resources) return 0;

    if (Array.isArray(resources)) {
        let count = 0;
        for (const resource of resources) {
            count++; // 计算当前项
            if (resource.children) {
                count += countTreeItems(resource.children);
            }
        }
        return count;
    } else if (typeof resources === 'object') {
        let count = 1; // 计算当前对象
        for (const key in resources) {
            if (resources.hasOwnProperty(key) && typeof resources[key] === 'object') {
                count += countTreeItems(resources[key]);
            }
        }
        return count;
    } else {
        return 1;
    }
}

function disableControls(disable) {
    const container = document.getElementById('searchAndFilterContainer');
    const searchInput = document.getElementById('searchInput');
    const quickFilterSelect = document.getElementById('quickFilterSelect');
    const sortSelect = document.getElementById('sortSelect');

    if (container) {
        container.className = disable ? 'disabled' : '';
    }

    if (searchInput) {
        searchInput.disabled = disable;
        searchInput.style.color = disable ? '#888' : '#ffa500';
    }
    if (quickFilterSelect) quickFilterSelect.disabled = disable;
    if (sortSelect) sortSelect.disabled = disable;
}

// 设置树状图复选框事件
function setupTreeCheckboxEvents(container) {
    container.addEventListener('change', e => {
        if (e.target.classList.contains('tree-checkbox')) {
            handleTreeCheckboxChange(e.target);
        }
    });
}

function handleTreeCheckboxChange(checkbox) {

    // 使用 requestAnimationFrame 来批量更新 UI
    requestAnimationFrame(() => {
        batchUpdate(checkbox);
        updateSelectAllCheckbox();
        syncTreeWithDownloadList();
    });
}

function addPreviewButtonListeners() {
    const treePreviewButtons = document.querySelectorAll('#treeContainer .preview-button');
    treePreviewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const resourceId = button.getAttribute('data-resource-id');
            const correspondingPreviewLink = document.querySelector(`#download_list .preview-link[data-resource-id="${resourceId}"]`);
            if (correspondingPreviewLink) {
                correspondingPreviewLink.click();
            } else {
                console.error('找不到对应的预览链接');
                showNotification('预览链接不存在，请刷新页面后重试。', 'error');
            }
        });
    });
}

// 创建树状图 HTML
function createTreeHTML() {
    let tree = {};
    let folderOrder = {};
    let folderNames = {};

    // 收集所有文件夹信息
    course_resources.forEach(resource => {
        if (resource.type === 1) { // 文件夹类型
            folderNames[resource.id] = resource.name;
        }
    });

    svgElementIds.forEach((id, index) => {
        folderOrder[id] = index;
    });

    document.querySelectorAll("#download_list .file-item").forEach(fileItem => {
        let fileInfo = fileItem.querySelector('a');
        let checkbox = fileItem.querySelector('input[type="checkbox"]');

        let resource = {
            id: fileInfo.getAttribute('data-resource-id'),
            parent_id: fileInfo.getAttribute('data-parent-id'),
            name: fileInfo.getAttribute('data-origin-name'),
            path: fileInfo.getAttribute('data-path'),
            checkbox: checkbox
        };

        let pathIds = resource.path.split('/');
        let current = tree;
        let currentPath = [];

        pathIds.forEach((id, index) => {
            let name = folderNames[id] || (index === pathIds.length - 1 ? resource.name : id);
            currentPath.push(id);

            if (!current[name]) {
                current[name] = {
                    children: {},
                    resources: [],
                    order: folderOrder[id] || Infinity,
                    id: id,
                    name: name,
                    isFolder: index < pathIds.length - 1,
                    path: currentPath.join('/')
                };
            }

            if (index === pathIds.length - 1) {
                current[name].resources.push(resource);
                current[name].id = resource.id;
                current[name].name = resource.name;
            }

            current = current[name].children;
        });
    });

    return buildTreeHTML(tree);
}

// 递归构建树状图 HTML
function buildTreeHTML(node, parentPath = '', level = 0) {
    let html = '<ul' + (level > 0 ? ' class="collapsed"' : '') + '>';
    let folderEntries = [];
    let fileEntries = [];
    for (let key in node) {
        let item = node[key];
        if (item.isFolder) {
            folderEntries.push({ key, item });
        } else {
            fileEntries.push({ key, item });
        }
    }
    folderEntries.sort((a, b) => a.item.order - b.item.order);
    for (let { item } of folderEntries) {
        let currentPath = item.path;
        let folderContent = buildTreeHTML(item.children, currentPath, level + 1);
        html += `
            <li>
                <div class="item-content">
                    <div class="item-content-left">
                        <input type="checkbox" class="tree-checkbox folder-checkbox" data-path="${currentPath}">
                        <span class="folder-toggle"></span>
                        <span class="folder">${item.name}</span>
                    </div>
                </div>
                ${folderContent}
            </li>
        `;
    }
    fileEntries.sort((a, b) => a.item.name.localeCompare(b.item.name));
    for (let { item } of fileEntries) {
        for (let resource of item.resources) {
            let isChecked = resource.checkbox.checked ? 'checked' : '';
            let fileIcon = getFileIcon(resource.name);
            html += `
    <li>
        <div class="item-content">
            <div class="item-content-left">
                <input type="checkbox" class="tree-checkbox" data-path="${resource.path}" ${isChecked}>
                <span>${fileIcon} ${resource.name}</span>
            </div>
            <button class="preview-button" data-resource-id="${resource.id}" title="预览">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </button>
        </div>
    </li>
            `;
        }
    }
    html += '</ul>';
    return html;
}

// 批量更新复选框状态
function batchUpdate(checkbox) {
    const isChecked = checkbox.checked;
    const listItem = checkbox.closest('li');
    const childCheckboxes = listItem.querySelectorAll('input.tree-checkbox');
    const path = checkbox.getAttribute('data-path');

    // 批量更新子复选框
    childCheckboxes.forEach(child => {
        child.checked = isChecked;
    });

    // 批量更新文件列表复选框
    const fileListCheckboxes = document.querySelectorAll(`#download_list .file-item a[data-path^="${path}"]`);
    fileListCheckboxes.forEach(fileInfo => {
        const fileCheckbox = fileInfo.parentElement.querySelector('input[type="checkbox"]');
        if (fileCheckbox.checked !== isChecked) {
            fileCheckbox.checked = isChecked;
        }
    });

    // 更新父级复选框
    updateParentCheckboxes(checkbox);
}

// 获取文件图标
function getFileIcon(filename) {
    let extension = filename.split('.').pop().toLowerCase();
    let icon = '📄';
    let colorClass = '';

    let matched = false;
    for (let filter of window.quickFilters) {
        if (filter.value.includes(extension)) {
            switch (filter.label) {
                case "文档":
                    icon = '📄';
                    colorClass = 'ext-other';
                    if (extension === 'ppt' || extension === 'pptx') {
                        colorClass = 'ext-ppt';
                    } else if (extension === 'doc' || extension === 'docx') {
                        colorClass = 'ext-doc';
                    } else if (extension === 'xls' || extension === 'xlsx') {
                        colorClass = 'ext-xls';
                    } else if (extension === 'txt') {
                        colorClass = 'ext-txt';
                    } else if (extension === 'pdf') {
                        colorClass = 'ext-pdf';
                    }
                    break;
                case "图片":
                    icon = '🖼️';
                    colorClass = 'ext-img';
                    break;
                case "音频":
                    icon = '🎵';
                    colorClass = 'ext-mp3';
                    break;
                case "压缩包":
                    icon = '📦';
                    colorClass = 'ext-zip';
                    break;
            }
            matched = true;
            break;
        }
    }
    if (!matched) {
        colorClass = 'ext-other';
    }

    return `${icon} <span class="file-extension ${colorClass}">${extension}</span>`;
}

// 添加树状图样式
function addTreeViewStyles() {
    const style = document.createElement('style');
    style.textContent = `
    #${TREE_VIEW_CONFIG.containerId} {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            max-height: 80vh;
        }
        .drag-handle {
            flex-shrink: 0;
            z-index: 2;
            background-color: #e6f7ff;
            border-bottom: 1px solid #b3e0ff;
            padding: 10px 15px;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            color: #0066cc;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
        #treeContainer > div:not(.drag-handle) {
            flex-grow: 1;
            overflow-y: auto;
        }
        .drag-icon {
            font-size: 20px;
            color: #0066cc;
        }
        .drag-hint {
            font-size: 12px;
            color: #666;
            margin-right: 10px;
        }
        .drag-handle:hover {
            background-color: #cce5ff;
        }
        .drag-handle:active {
            background-color: #b3d9ff;
        }
    #treeContainer {
        color: #333;
        background-color: #f0f8ff;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(135, 206, 235, 0.2);
        transition: all 0.3s ease;
    }
    #treeContentWrapper {
            flex-grow: 1;
            overflow-y: auto;
        }
    #treeContainer:hover {
        box-shadow: 0 15px 40px rgba(135, 206, 235, 0.3);
    }
    #treeContainer ul {
        overflow: hidden;
        list-style-type: none;
        padding-left: 25px;
        position: relative;
        transition: height 0.3s ease-out;
    }
    #treeContainer ul.collapsed {
        display: none;
    }
    #treeContainer li {
        margin: 20px 0;
        position: relative;
    }
    .tree-container li > ul {
        display: none;
        height: 0;
        overflow: hidden;
        transition: height 0.3s ease-out;
    }

    .tree-container li > ul.expanded {
        display: block;
        height: auto;
    }

    .tree-container li:hover > ul {
        display: block;
    }

    .tree-container li:hover > ul.collapsed {
        height: 0;
    }
    #treeContainer li::before {
        content: "";
        position: absolute;
        top: -10px;
        left: -20px;
        border-left: 2px solid rgba(135, 206, 235, 0.5);
        border-bottom: 2px solid rgba(135, 206, 235, 0.5);
        width: 20px;
        height: 25px;
        border-bottom-left-radius: 8px;
    }
    #treeContainer .item-content {
        display: flex;
        align-items: center;
        padding: 12px 18px;
        border-radius: 40px;
        transition: all 0.3s ease;
        background-color: #fff;
        box-shadow: 0 4px 10px rgba(135, 206, 235, 0.1);
        justify-content: space-between;
    }
    #treeContainer .item-content > div:first-child {
        display: flex;
        align-items: center;
        flex-grow: 1;
    }
    #treeContainer .item-content:has(> .folder-toggle) {
        cursor: pointer;
    }
    #treeContainer .item-content span:not(.folder-toggle):not(.folder):not(.file-extension) {
        color: #555;
        font-size: 14px;
        font-weight: bold;
        max-width: 80%;
    }
    #treeContainer .item-content:hover {
        background-color: #e6f7ff;
        transform: translateX(5px);
        transition: all 0.1s ease-out;
    }
    #treeContainer .folder {
        cursor: pointer;
        font-weight: 600;
        margin-left: 10px;
        color: #1e90ff;
    }
    #treeContainer .folder-toggle {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 28px;
        height: 28px;
        background-color: #87CEEB;
        border-radius: 50%;
        margin-right: 12px;
        transition: transform 0.1s ease-out;
        box-shadow: 0 4px 10px rgba(135, 206, 235, 0.2);
        position: relative;
    }
    #treeContainer .folder-toggle::after {
        content: '▶';
        color: #fff;
        font-size: 14px;
        transition: all 0.3s ease;
    }
    #treeContainer .folder-toggle:hover {
        background-color: #1e90ff;
        transform: rotate(15deg) scale(1.1);
    }
    #treeContainer .folder-toggle.open {
        transform: rotate(90deg);
        background-color: #1e90ff;
    }
    #treeContainer .tree-checkbox {
        margin-right: 12px;
        appearance: none;
        -webkit-appearance: none;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 22px;
        height: 22px;
        border: 2px solid #87CEEB;
        border-radius: 5px;
        outline: none;
        transition: all 0.3s ease;
        position: relative;
        cursor: pointer;
    }
    #treeContainer .tree-checkbox:checked {
        background-color: #1e90ff;
        border-color: #1e90ff;
    }
    #treeContainer .tree-checkbox:checked::after {
        content: '✓';
        color: white;
        font-size: 16px;
        font-weight: bold;
    }
    #treeContainer .tree-checkbox:indeterminate {
        background-color: #87CEEB;
    }
    #treeContainer .tree-checkbox:indeterminate::after {
        content: '-';
        color: white;
        font-size: 20px;
        font-weight: bold;
    }
    @keyframes ripple {
        0% { box-shadow: 0 0 0 0 rgba(135, 206, 235, 0.3); }
        100% { box-shadow: 0 0 0 20px rgba(135, 206, 235, 0); }
    }
    #treeContainer .item-content:active {
        animation: ripple 0.6s linear;
    }
    @keyframes expand {
        from { height: 0; opacity: 0; transform: translateY(-50px); }
        to { height: auto; opacity: 1; transform: translateY(0); }
    }
    @keyframes collapse {
        from { height: auto; opacity: 1; transform: translateY(0); }
        to { height: 0; opacity: 0; transform: translateY(-50px); }
    }
    #treeContainer .expanded {
        animation: expand 0.3s ease-out forwards;
    }
    #treeContainer .collapsed {
        animation: collapse 0.4s ease-out forwards;
    }
    #treeContainer .folder::before {
        content: '📁';
        margin-right: 8px;
        font-size: 18px;
    }
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }

    #searchAndFilterContainer {
        position: relative;
    }

    #searchAndFilterContainer.disabled::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
    }

    #searchAndFilterContainer.disabled .search-icon {
        color: #888 !important;
    }

    .course-search-input:disabled {
        background-color: #f0f0f0 !important;
        color: #888 !important;
        border-color: #ccc !important;
        opacity: 0.7;
    }

    .course-search-input:disabled::placeholder {
        color: #888 !important;
    }

    .search-input-with-icon:disabled {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>') !important;
    }

    #searchAndFilterContainer.disabled .select-selected,
    #searchAndFilterContainer.disabled .select-items {
        background-color: #f0f0f0 !important;
        color: #888 !important;
        border-color: #ccc !important;
        opacity: 0.7;
    }

    #searchAndFilterContainer.disabled .select-selected:after {
        border-color: #888 transparent transparent transparent !important;
    }

    #searchAndFilterContainer.disabled .select-selected:hover,
    #searchAndFilterContainer.disabled .custom-select:focus-within .select-selected {
        border-color: #ccc !important;
        box-shadow: none !important;
    }

    #searchAndFilterContainer.disabled .select-items div:hover {
        background-color: transparent !important;
    }

    #searchAndFilterContainer.disabled .select-selected,
    #searchAndFilterContainer.disabled .select-items {
        pointer-events: none;
    }

    .tree-content-fade-in {
        animation: fadeIn 0.3s ease-out;
    }
    .file-extension {
            font-size: 10px;
            padding: 2px 4px;
            border-radius: 3px;
            margin-left: 5px;
            font-weight: bold;
            color: white;
        }
        .ext-ppt { background-color: #ed6c47; }
        .ext-doc { background-color: #0074D9; }
        .ext-xls { background-color: #2ECC40; }
        .ext-txt { background-color: #B10DC9; }
        .ext-img { background-color: #FFDC00; }
        .ext-mp3 { background-color: #00f7e3; }
        .ext-zip { background-color: #AAAAAA; }
        .ext-pdf { background-color: #cc2121; }
        .ext-other { background-color: #FF851B; }

        .search-container {
            top: 0;
            flex-shrink: 0;
            z-index: 1;
            position: sticky;
            padding: 15px;
            display: flex;
            background-color: #e6f7ff;
            align-items: center;
            border-bottom: 1px solid #b3e0ff;
            transition: all 0.3s ease;
        }
        .search-icon {
            width: 20px;
            height: 20px;
            fill: white;
        }
        #treeSearchInput {
            flex-grow: 1;
            padding: 10px 15px;
            margin-right: 10px;
            border: 2px solid #87CEEB;
            border-radius: 25px;
            font-size: 14px;
            outline: none;
            transition: all 0.3s ease;
            background-color: white;
        }
        #treeSearchInput:focus {
            border-color: #1e90ff;
            box-shadow: 0 0 5px rgba(30, 144, 255, 0.5);
        }
        .search-button {
            background-color: #87CEEB;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-left: 10px;
            padding: 0;
        }
        .search-button:hover {
            background-color: #1e90ff;
            transform: scale(1.05);
        }
        .search-button:active {
            transform: scale(0.95);
        }
        .search-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
            opacity: 0.7;
        }
        .search-button:disabled:hover {
            transform: none;
        }
        .search-button:disabled .search-icon {
            fill: #999999;
        }
        .search-info {
            margin-left: 10px;
            font-size: 14px;
            color: #666;
            font-weight: bold;
        }

        @keyframes simpleHighlight {
            0% { background-color: rgba(255, 255, 0, 0.7); }
            100% { background-color: transparent; }
        }

        #treeContainer .highlight {
            background-color: rgba(255, 255, 0, 0.3);
            border-radius: 3px;
            animation: simpleHighlight 2s ease-out forwards;
        }

        #treePrevButton,
        #treeNextButton {
            background-color: #87CEEB;
        }
        #treePrevButton:hover:not(:disabled),
        #treeNextButton:hover:not(:disabled) {
            background-color: #1e90ff;
        }
        .preview-button {
            background-color: transparent;
            border: none;
            color: #4CAF50;
            padding: 5px;
            text-align: center;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            margin-left: 10px;
            cursor: pointer;
            border-radius: 50%;
            transition: background-color 0.3s, transform 0.2s;
            flex-shrink: 0;
        }
        .preview-button:hover {
            background-color: rgba(76, 175, 80, 0.1);
            transform: scale(1.1);
        }
        .preview-button:active {
            transform: scale(0.95);
        }
        .preview-button svg {
            transition: stroke 0.3s;
        }
        .preview-button:hover svg {
            stroke: #45a049;
        }
    `;
    document.head.appendChild(style);
}

// 添加文件夹展开/折叠功能
function addFolderToggle(container) {
    container.removeEventListener('click', folderToggleHandler);
    container.addEventListener('click', folderToggleHandler);
}

function folderToggleHandler(e) {
    const toggle = e.target.closest('.folder-toggle');
    const folderContent = e.target.closest('.item-content');
    const li = folderContent ? folderContent.closest('li') : null;

    if (e.target.classList.contains('tree-checkbox')) {
        return;
    }

    if (toggle || (folderContent && li && li.querySelector('ul'))) {
        e.stopPropagation();
        const ul = li.querySelector('ul');
        if (ul) {
            const isExpanding = !li.querySelector('.folder-toggle').classList.contains('open');
            li.querySelector('.folder-toggle').classList.toggle('open');
            ul.classList.toggle('collapsed');
            ul.classList.toggle('expanded');

            if (isExpanding) {
                ul.style.display = 'block';
                ul.style.height = 'auto';
                const height = ul.scrollHeight;
                ul.style.height = '0px';
                ul.offsetHeight;
                ul.style.height = height + 'px';
                ul.addEventListener('transitionend', function handler() {
                    ul.style.height = 'auto';
                    ul.removeEventListener('transitionend', handler);
                }, { once: true });
            } else {
                ul.style.height = ul.scrollHeight + 'px';
                ul.offsetHeight; // 触发重排
                ul.style.height = '0px';
                ul.addEventListener('transitionend', function handler() {
                    if (ul.classList.contains('collapsed')) {
                        ul.style.display = 'none';
                    }
                    ul.removeEventListener('transitionend', handler);
                }, { once: true });
            }
        }
    }
}

// 更新父级复选框状态
function updateParentCheckboxes(checkbox) {
    let currentCheckbox = checkbox;
    while (currentCheckbox) {
        const parentLi = currentCheckbox.closest('li').parentElement.closest('li');
        if (!parentLi) break;

        const parentCheckbox = parentLi.querySelector('.tree-checkbox');
        updateFolderState(parentCheckbox);
        currentCheckbox = parentCheckbox;
    }
}

function updateFileListCheckbox(treeCheckbox) {
    const path = treeCheckbox.getAttribute('data-path');
    const isChecked = treeCheckbox.checked;

    document.querySelectorAll(`#download_list .file-item a[data-path^="${path}"]`).forEach(fileInfo => {
        const checkbox = fileInfo.parentElement.querySelector('input[type="checkbox"]');
        if (checkbox.checked !== isChecked) {
            checkbox.checked = isChecked;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    updateSelectAllCheckbox();
}

// 更新"全选"复选框
function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        const allCheckboxes = document.querySelectorAll("#download_list .file-item input[type='checkbox']");
        let allChecked = true;
        for (let checkbox of allCheckboxes) {
            if (!checkbox.checked) {
                allChecked = false;
                break;
            }
        }
        selectAllCheckbox.checked = allChecked;
    }
}

// 同步树状图与下载列表
function syncTreeWithDownloadList() {
    const treeCheckboxes = document.querySelectorAll('#treeContainer .tree-checkbox');
    const downloadCheckboxes = document.querySelectorAll('#download_list .file-item input[type="checkbox"]');

    const downloadCheckboxMap = new Map();
    downloadCheckboxes.forEach(cb => {
        const path = cb.parentElement.querySelector('a').getAttribute('data-path');
        downloadCheckboxMap.set(path, cb.checked);
    });

    treeCheckboxes.forEach(treeCheckbox => {
        const path = treeCheckbox.getAttribute('data-path');
        if (downloadCheckboxMap.has(path)) {
            treeCheckbox.checked = downloadCheckboxMap.get(path);
        }
    });

    // 从叶子节点开始更新文件夹状态
    const folderCheckboxes = Array.from(document.querySelectorAll('#treeContainer .folder-checkbox')).reverse();
    folderCheckboxes.forEach(updateFolderState);
}

// 更新树状图复选框
function updateTreeCheckbox(downloadCheckbox) {
    let path = downloadCheckbox.parentElement.querySelector('a').getAttribute('data-path');
    let treeCheckbox = document.querySelector(`#treeContainer .tree-checkbox[data-path="${path}"]`);
    if (treeCheckbox) {
        treeCheckbox.checked = downloadCheckbox.checked;
        updateParentCheckboxes(treeCheckbox);
    }
}

// 更新文件夹状态
function updateFolderState(folderCheckbox) {
    const folderLi = folderCheckbox.closest('li');
    const allDescendants = folderLi.querySelectorAll(':scope > ul .tree-checkbox');

    let allChecked = true;
    let anyChecked = false;

    for (let cb of allDescendants) {
        if (cb.checked || cb.indeterminate) {
            anyChecked = true;
        }
        if (!cb.checked) {
            allChecked = false;
        }
        if (anyChecked && !allChecked) break;
    }

    folderCheckbox.checked = allChecked;
    folderCheckbox.indeterminate = !allChecked && anyChecked;
}

function makeDraggable(container) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    let lastTouchTime = 0;
    let lastTouchX, lastTouchY;

    function onStart(e) {
        if (e.target.closest('.drag-handle') && !e.target.closest('.search-container')) {
            isDragging = true;
            if (e.type === 'mousedown') {
                startX = e.clientX;
                startY = e.clientY;
            } else if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                lastTouchTime = new Date().getTime();
                lastTouchX = startX;
                lastTouchY = startY;
            }
            startLeft = container.offsetLeft;
            startTop = container.offsetTop;
            if (e.type === 'mousedown') {
                e.preventDefault();
            }
        }
    }

    function onMove(e) {
        if (!isDragging) return;
        let clientX, clientY;
        if (e.type === 'mousemove') {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        const dx = clientX - startX;
        const dy = clientY - startY;
        container.style.left = `${startLeft + dx}px`;
        container.style.top = `${startTop + dy}px`;
        e.preventDefault();
    }

    function onEnd(e) {
        if (isDragging) {
            isDragging = false;
            if (e.type === 'touchend') {
                const endTime = new Date().getTime();
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const timeDiff = endTime - lastTouchTime;
                const distance = Math.sqrt(Math.pow(endX - lastTouchX, 2) + Math.pow(endY - lastTouchY, 2));

                if (distance < 10 && timeDiff < 200) {
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    e.target.dispatchEvent(clickEvent);
                }
            }
        }
    }

    // 鼠标事件
    container.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    // 触摸事件
    container.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);

    // 防止文本选择
    container.addEventListener('selectstart', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });
}

function add_download_button() {
    // 创建下载图标容器
    var downloadIconContainer = document.createElement('div');
    downloadIconContainer.id = "download_icon_container";
    downloadIconContainer.innerHTML = `
        <dotlottie-player class="downloadlist-icon"
                          src="https://lottie.host/604bb467-91d8-46f3-a7ce-786e25f8fded/alw6gwjRdU.json"
                          background="transparent"
                          speed="1"
                          style="width: 60px; height: 60px; margin: -15px;"
                          loop autoplay onclick="toggleListVisibility()"
                          title="点击展开或关闭列表"></dotlottie-player>
    `;

    // 设置下载图标容器的样式
    downloadIconContainer.style.cssText = `
        position: fixed;
        right: 10px;
        bottom: 10px;
        z-index: 9000;
        cursor: pointer;
    `;

    // 创建下载列表容器
    var downloadListContainer = document.createElement('div');
    downloadListContainer.id = "download_list";
    downloadListContainer.style.cssText = `
    z-index: 9999;
    backdrop-filter: blur(10px);
    border: 2px solid #fcbb34;
    border-radius: 15px;
    width: 600px;
    max-height: 600px;
    overflow-y: auto;
    padding: 20px;
    transform-origin: bottom;
    transform: scaleY(0);
    transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
    opacity: 0;
    position: fixed;
    right: 30px;
    bottom: 50px;
    background-color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;
    downloadListContainer.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
            width: 100%;
        ">
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">📚</div>
                <h3 style="margin-bottom: 15px;">
                    <span style="
                        background: linear-gradient(90deg, #ffa500, #ff8c00, #ffa500);
                        background-size: 200% 100%;
                        animation: flowingGradient 3s ease infinite;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        font-weight: bold;
                        font-size: 24px;
                    ">暂无课件♪(´▽｀)</span>
                </h3>
                <p style="
                    font-size: 14px;
                    font-weight: bold;
                    color: #888;
                    max-width: 400px;
                    margin: 0 auto;
                    line-height: 1.6;
                ">
                    （在课程首页才能获取到资源）
                </p>
            </div>
        </div>
    `;
    // 添加图标的样式
    var downloadIconStyle = document.createElement('style');
    downloadIconStyle.innerHTML = `
.download-icon, .preview-icon, .downloadlist-icon {
    background-color: rgba(255, 255, 255, 0);
    border-radius: 10px;
    transition: transform 0.3s ease;
    cursor: pointer;
}

.download-icon:hover, .preview-icon:hover, .downloadlist-icon:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.2);
}

.downloadlist-icon {
    padding: 2px;
    margin: -20px;
}
`;

    var newStyles = document.createElement('style');
    newStyles.innerHTML = `
    #download_list .file-item {
        display: flex;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #ffeeba;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    #download_list .file-item:last-child {
        border-bottom: none;
    }
    #download_list .file-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #fff9e6, #fff5d6);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
    }
    #download_list .file-item:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
    }
    #download_list .file-item:hover::before {
        opacity: 1;
    }
    #download_list .file-item .custom-checkbox {
        margin-right: 10px;
        flex-shrink: 0;
    }
    #download_list .file-item .file-icon {
        margin-right: 10px;
        font-size: 20px;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        flex-shrink: 0;
        transition: transform 0.3s ease;
    }
    #download_list .file-item:hover .file-icon {
        transform: scale(1.1);
    }
    #download_list .file-item .file-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-grow: 1;
        overflow: hidden;
        max-width: calc(100% - 90px);
    }
    #download_list .file-item .file-name {
        font-size: 14px;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #ffa500;
        line-height: 1.2;
        margin: 2px 0;
        cursor: help;
        transition: color 0.3s ease;
    }
    #download_list .file-item .file-details {
        color: #888;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
        margin: 2px 0;
        cursor: help;
        transition: color 0.3s ease;
    }
    #download_list .file-item .download-link {
        text-decoration: none;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #fff3cd;
        transition: all 0.3s ease;
        flex-shrink: 0;
        margin-left: 10px;
    }
    #download_list .file-item:hover .download-link {
        background-color: #ffc107;
        color: white;
        transform: rotate(360deg);
    }
    #download_list .file-item .preview-link {
        text-decoration: none;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #fff3cd;
        transition: all 0.3s ease;
        flex-shrink: 0;
        margin-left: 10px;
    }
    #download_list .file-item:hover .preview-link {
        background-color: #ffc107;
        color: white;
        transform: rotate(360deg);
    }
    #download_list .file-icon-document {
        background-color: #fff3cd;
        color: #e69500;
    }
    #download_list .file-icon-image {
        background-color: #fff3cd;
        color: #e69500;
    }
    #download_list .file-icon-music {
        background-color: #fff3cd;
        color: #e69500;
    }
    #download_list .file-icon-archive {
        background-color: #fff3cd;
        color: #e69500;
    }
    #download_list .file-icon-default {
        background-color: #fff3cd;
        color: #e69500;
    }
    #searchAndFilterContainer {
        background-image: linear-gradient(45deg, #fff9e6 25%, #fff5d6 25%, #fff5d6 50%, #fff9e6 50%, #fff9e6 75%, #fff5d6 75%, #fff5d6 100%);
        background-size: 40px 40px;
        animation: moveBackgroundStripes 1s linear infinite;
    }

    @keyframes moveBackgroundStripes {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: 40px 0;
        }
    }
`;
    document.head.appendChild(newStyles);
    document.head.appendChild(downloadIconStyle);
    document.body.appendChild(downloadIconContainer);
    document.body.appendChild(downloadListContainer);
}

// 获取token令牌
function getCookie(keyword = 'prd-access-token') {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name.includes(keyword)) {
            return value;
        }
    }
    return null;
}

function showDownloadHistory() {
    if (historyPopup) {
        return;
    }

    historyPopup = document.createElement('div');
    Object.assign(historyPopup.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        width: '80%',
        maxWidth: '800px',
        maxHeight: '80%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        opacity: '0',
    });

    const title = document.createElement('h2');
    title.textContent = '下载历史';
    Object.assign(title.style, {
        textAlign: 'center',
        color: '#fcbb34',
        marginTop: '0',
        marginBottom: '20px',
        fontWeight: 'bold',
    });

    historyPopup.historyListElement = document.createElement('ul');
    Object.assign(historyPopup.historyListElement.style, {
        listStyleType: 'none',
        padding: '0',
        marginBottom: '20px',
        overflowY: 'auto',
        fontWeight: 'bold',
        flex: '1'
    });

    const buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px'
    });

    const clearButton = document.createElement('button');
    clearButton.textContent = '清空历史';
    Object.assign(clearButton.style, {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#fcbb34',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
    });
    clearButton.onmouseover = () => {
        clearButton.style.backgroundColor = '#fba100';
    };
    clearButton.onmouseout = () => {
        clearButton.style.backgroundColor = '#fcbb34';
    };
    clearButton.onclick = () => {
        showNotification('确定要清空所有下载历史吗？此操作不可撤销。', 'confirm',
                         () => {
            const items = historyPopup.historyListElement.querySelectorAll('li');

            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('remove-history-item');
                }, index * 50);
            });

            setTimeout(() => {
                downloadHistory = [];
                localStorage.removeItem('downloadHistory');
                updateHistoryList();
                showNotification('下载历史已清空', 'info');
            }, items.length * 50 + 500);
        },
                         () => {
            showNotification('操作已取消', 'info');
        }
                        );
    };

    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    Object.assign(closeButton.style, {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#ccc',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
    });
    closeButton.onmouseover = () => {
        closeButton.style.backgroundColor = '#bbb';
    };
    closeButton.onmouseout = () => {
        closeButton.style.backgroundColor = '#ccc';
    };
    closeButton.onclick = () => {
        const rect = historyPopup.getBoundingClientRect();
        const startX = rect.left;
        const startY = rect.top;

        // 设置起始位置
        historyPopup.style.top = startY + 'px';
        historyPopup.style.left = startX + 'px';
        historyPopup.style.transform = 'none';

        // 添加关闭动画类
        historyPopup.classList.remove('popup-show');
        historyPopup.classList.add('popup-hide');

        historyPopup.addEventListener('animationend', function () {
            document.body.removeChild(historyPopup);
            historyPopup = null; // 重置historyPopup
        }, { once: true });
    };

    buttonContainer.appendChild(clearButton);
    buttonContainer.appendChild(closeButton);

    historyPopup.appendChild(title);
    historyPopup.appendChild(historyPopup.historyListElement);
    historyPopup.appendChild(buttonContainer);
    document.body.appendChild(historyPopup);

    // 添加搜索框
    const searchContainer = createSearchBox();
    historyPopup.insertBefore(searchContainer, historyPopup.historyListElement);

    document.body.appendChild(historyPopup);

    // 触发显示动画
    setTimeout(() => {
        historyPopup.classList.add('popup-show');
    }, 10);

    updateHistoryList();
}

function createSearchBox() {
    const searchContainer = document.createElement('div');
    Object.assign(searchContainer.style, {
        margin: '0 0 20px 0',
        position: 'relative',
        width: '100%'
    });

    const searchInput = document.createElement('input');
    Object.assign(searchInput.style, {
        width: '100%',
        padding: '10px 40px 10px 15px',
        fontSize: '16px',
        border: '2px solid #fcbb34',
        borderRadius: '25px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease'
    });
    searchInput.placeholder = '搜索下载历史...';

    const searchIcon = document.createElement('div');
    Object.assign(searchIcon.style, {
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '20px',
        height: '20px',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23fcbb34"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>')`,
        backgroundSize: 'cover',
        cursor: 'pointer'
    });

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchIcon);

    // 添加搜索功能
    searchInput.addEventListener('input', () => {
        filterHistory(searchInput.value);
    });

    return searchContainer;
}

function filterHistory(searchTerm) {
    const items = historyPopup.historyListElement.querySelectorAll('li');
    items.forEach((item, index) => {
        const text = item.textContent.toLowerCase();
        const matchesSearch = text.includes(searchTerm.toLowerCase());
        if (matchesSearch) {
            item.style.display = '';
            resetListItemStyles(item);
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        } else {
            item.style.display = 'none';
        }
    });
}

function resetListItemStyles(item) {
    Object.assign(item.style, {
        padding: '10px',
        borderBottom: '1px solid #eee',
        color: '#333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'opacity 0.3s, transform 0.3s'
    });

    const redownloadButton = item.querySelector('button');
    if (redownloadButton) {
        Object.assign(redownloadButton.style, {
            padding: '5px 10px',
            border: 'none',
            borderRadius: '3px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px',
            transition: 'background-color 0.3s'
        });
    }
}

function updateHistoryList() {
    if (!historyPopup || !historyPopup.historyListElement) return;

    const historyListElement = historyPopup.historyListElement;
    historyListElement.innerHTML = '';

    // 过滤并保留最近3天的历史记录
    const threeDaysAgo = new Date().getTime() - (3 * 24 * 60 * 60 * 1000);
    downloadHistory = downloadHistory.filter(item => item.time > threeDaysAgo);

    if (downloadHistory.length === 0) {
        const noHistory = showNoHistoryMessage(historyListElement);
        requestAnimationFrame(() => {
            noHistory.style.opacity = '1';
            noHistory.style.transform = 'translateY(0)';
        });
    } else {
        downloadHistory.forEach((item, index) => {
            const listItem = createHistoryListItem(item, index);
            historyListElement.appendChild(listItem);

            setTimeout(() => {
                listItem.style.opacity = '1';
                listItem.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    // 更新本地存储
    localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
}

function showNoHistoryMessage(historyListElement) {
    const noHistory = document.createElement('div');
    noHistory.id = 'noHistoryMessage';
    noHistory.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#fcbb34" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>暂无下载历史</p>
        <span>开始下载以添加记录 (⌐■_■)</span>
    `;
    Object.assign(noHistory.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#888',
        textAlign: 'center',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'opacity 0.5s, transform 0.5s'
    });

    const p = noHistory.querySelector('p');
    Object.assign(p.style, {
        fontSize: '18px',
        fontWeight: 'bold',
        margin: '10px 0 5px',
        color: '#fcbb34'
    });

    const span = noHistory.querySelector('span');
    Object.assign(span.style, {
        fontSize: '14px',
        opacity: '0.8',
        fontWeight: 'bold'
    });

    historyListElement.appendChild(noHistory);
    return noHistory;
}

function createHistoryListItem(item, index) {
    const listItem = document.createElement('li');
    Object.assign(listItem.style, {
        padding: '10px',
        borderBottom: '1px solid #eee',
        color: '#333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: '0',
        transform: 'translateY(-20px)'
    });

    const itemInfo = document.createElement('span');
    itemInfo.textContent = `${index + 1}. ${item.filename} - ${new Date(item.time).toLocaleString()}`;

    const redownloadButton = createRedownloadButton(item);

    listItem.appendChild(itemInfo);
    listItem.appendChild(redownloadButton);

    return listItem;
}

function createRedownloadButton(item) {
    const redownloadButton = document.createElement('button');
    redownloadButton.textContent = '重新下载';
    Object.assign(redownloadButton.style, {
        padding: '5px 10px',
        border: 'none',
        borderRadius: '3px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
    });
    redownloadButton.onmouseover = () => {
        redownloadButton.style.backgroundColor = '#45a049';
    };
    redownloadButton.onmouseout = () => {
        redownloadButton.style.backgroundColor = '#4CAF50';
    };
    redownloadButton.onclick = () => {
        courseDownload(item.url, item.filename);
    };
    return redownloadButton;
}

function createDownloadHistoryPopup() {
    const popup = document.createElement('div');
    popup.id = 'downloadHistoryPopup';
    Object.assign(popup.style, {
        display: 'none',
        position: 'fixed',
        zIndex: '10002',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        maxWidth: '80%',
        maxHeight: '80%',
        overflowY: 'auto',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });

    document.body.appendChild(popup);
}

function saveDownloadHistory(filename, url) {
    const historyItem = { filename, url, time: new Date().getTime() };
    downloadHistory.unshift(historyItem);

    // 过滤并保留最近3天的历史记录
    const threeDaysAgo = new Date().getTime() - (3 * 24 * 60 * 60 * 1000);
    downloadHistory = downloadHistory.filter(item => item.time > threeDaysAgo);

    localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));

    if (historyPopup && historyPopup.historyListElement) {
        const noHistoryMessage = historyPopup.historyListElement.querySelector('#noHistoryMessage');
        if (noHistoryMessage) {
            noHistoryMessage.remove();
        }

        const newListItem = createHistoryListItem(historyItem, 0);
        historyPopup.historyListElement.insertBefore(newListItem, historyPopup.historyListElement.firstChild);

        // 触发动画
        setTimeout(() => {
            newListItem.classList.add('new-history-item');
        }, 10);

        // 更新其他项的序号
        const existingItems = historyPopup.historyListElement.querySelectorAll('li');
        existingItems.forEach((item, index) => {
            if (index > 0) {
                const itemInfo = item.querySelector('span');
                itemInfo.textContent = itemInfo.textContent.replace(/^\d+\./, `${index + 1}.`);
            }
        });
    }
}

function loadDownloadHistory() {
    const savedHistory = localStorage.getItem('downloadHistory');
    if (savedHistory) {
        downloadHistory = JSON.parse(savedHistory);
        const threeDaysAgo = new Date().getTime() - (3 * 24 * 60 * 60 * 1000);
        downloadHistory = downloadHistory.filter(item => item.time > threeDaysAgo);
        localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
    }
}

function createZipProgressIndicator() {
    const TextContainer = document.getElementById('zipTextContainer');
    if (!TextContainer) {
        console.error('zipTextContainer not found');
        return null;
    }

    // 清空容器
    TextContainer.innerHTML = '';

    // 创建图标容器
    const iconContainer = document.createElement('div');
    iconContainer.style.cssText = `
        margin-bottom: 10px;
        font-size: 24px;
    `;
    iconContainer.innerHTML = '📁';
    TextContainer.appendChild(iconContainer);

    // 创建文本元素
    const progressText = document.createElement('p');
    progressText.style.margin = '0';
    progressText.textContent = 'ZIP导出准备就绪，等待操作...';
    TextContainer.appendChild(progressText);

    // 创建进度条背景
    const progressBackground = document.createElement('div');
    progressBackground.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background-color: #fff;
    `;
    TextContainer.appendChild(progressBackground);

    // 创建进度条
    const zipProgressBar = document.createElement('div');
    zipProgressBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background-color: #fcbb34;
        transition: width 0.3s ease;
    `;
    TextContainer.appendChild(zipProgressBar);

    return {
        updateProgress: (text, progress = 0) => {
            progressText.textContent = text;
            zipProgressBar.style.width = `${progress}%`;

            // 更新图标
            if (progress === 0) {
                iconContainer.innerHTML = '📁';
            } else if (progress < 100) {
                iconContainer.innerHTML = '🗜️';
            } else {
                iconContainer.innerHTML = '📦';
            }
        },
        hide: () => {
            progressText.textContent = 'ZIP导出准备就绪，等待操作...';
            zipProgressBar.style.width = '0%';
            iconContainer.innerHTML = '📁';
        }
    };
}

function initializeControlPanel() {
    const controlPanel = document.createElement('div');
    const checkboxesContainer = document.createElement('div');
    const downloadInterfaceCheckbox = document.createElement('input');
    const downloadButtonCheckbox = document.createElement('input');
    const progressBarCheckbox = document.createElement('input');
    const videoCheckbox = document.createElement('input');
    const toggleButton = document.createElement('button');
    const tipsDisplay = document.createElement('div');
    const showCourseNameText = document.createElement('div');
    let isControlPanelVisible = false;

    // 创建Lottie动画播放器元素
    const lottiePlayer = document.createElement('dotlottie-player');
    lottiePlayer.setAttribute('src', "https://lottie.host/4f5910c1-63a3-4ffa-965c-7c0e46a29928/PCa2EgPj4N.json");
    lottiePlayer.setAttribute('background', 'transparent');
    lottiePlayer.setAttribute('speed', '1');
    lottiePlayer.style.width = '100%';
    lottiePlayer.style.height = '100%';
    lottiePlayer.style.position = 'absolute';
    lottiePlayer.style.zIndex = '-2';
    lottiePlayer.style.top = '0';
    lottiePlayer.style.left = '0';
    lottiePlayer.setAttribute('loop', '');
    lottiePlayer.setAttribute('autoplay', '');

    // 模糊效果
    const blurredBackground = document.createElement('div');
    blurredBackground.style.position = 'absolute';
    blurredBackground.style.top = '0';
    blurredBackground.style.left = '0';
    blurredBackground.style.right = '0';
    blurredBackground.style.bottom = '0';
    blurredBackground.style.zIndex = '-1';
    blurredBackground.style.backdropFilter = 'blur(3px)';
    blurredBackground.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';

    controlPanel.appendChild(blurredBackground);

    // 设置控制面板样式
    controlPanel.style.position = 'fixed';
    controlPanel.style.top = '210px';
    controlPanel.style.right = isControlPanelVisible ? '40px' : '-740px';
    controlPanel.style.zIndex = '10000';
    controlPanel.style.backgroundColor = 'transparent';
    controlPanel.style.padding = '10px';
    controlPanel.style.borderRadius = '5px';
    controlPanel.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    controlPanel.style.border = '1px solid #fcbb34';
    controlPanel.style.transition = 'right 0.3s ease-in-out, width 0.3s ease-in-out, height 0.3s ease-in-out';
    controlPanel.style.overflow = 'hidden';
    controlPanel.style.width = '700px';
    controlPanel.style.height = '260px';

    controlPanel.appendChild(lottiePlayer);
    controlPanel.appendChild(tipsDisplay);
    controlPanel.appendChild(showCourseNameText);

    // 创建横向菜单容器
    const menuContainer = document.createElement('div');
    menuContainer.style.display = 'flex';
    menuContainer.style.justifyContent = 'space-around';
    menuContainer.style.marginBottom = '15px';
    menuContainer.style.borderBottom = '2px solid #fcbb34';
    menuContainer.style.padding = '10px 0';

    const menuItems = [
        { text: '<strong>消息管理</strong>', category: 'message', icon: '📨' },
        { text: '<strong>下载管理</strong>', category: 'download', icon: '📥' },
        { text: '<strong>导出功能</strong>', category: 'export', icon: '📤' },
        { text: '<strong>显示设置</strong>', category: 'display', icon: '🖥️' },
        { text: '<strong>自定义过滤器</strong>', category: 'customFilter', icon: '🔧' },
        { text: '<strong>检查更新</strong>', category: 'update', icon: '🔎' }
    ];

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.innerHTML = `${item.icon} <span>${item.text}</span>`;
        menuItem.style.padding = '8px 12px';
        menuItem.style.cursor = 'pointer';
        menuItem.style.borderRadius = '20px';
        menuItem.style.transition = 'all 0.3s ease';
        menuItem.dataset.category = item.category;

        menuItem.addEventListener('mouseover', () => {
            menuItem.style.backgroundColor = 'rgba(252, 187, 52, 0.2)';
        });

        menuItem.addEventListener('mouseout', () => {
            if (!menuItem.classList.contains('active')) {
                menuItem.style.backgroundColor = 'transparent';
            }
        });

        menuContainer.appendChild(menuItem);
    });

    menuContainer.addEventListener('click', (event) => {
        const clickedItem = event.target.closest('div[data-category]');
        if (clickedItem) {
            const category = clickedItem.dataset.category;

            // 更新菜单项样式
            menuContainer.querySelectorAll('div[data-category]').forEach(mi => {
                mi.classList.toggle('active', mi.dataset.category === category);
                mi.style.backgroundColor = mi.dataset.category === category ? 'rgba(252, 187, 52, 0.2)' : 'transparent';
                mi.style.color = mi.dataset.category === category ? '#fcbb34' : '#000';
                mi.style.fontWeight = mi.dataset.category === category ? 'bold' : 'normal';
            });
            if (category === 'customFilter') {
                controlPanel.style.width = '720px';
                controlPanel.style.height = '610px';
            } else if (category === 'display') {
                controlPanel.style.width = '700px';
                controlPanel.style.height = '390px';
            } else if (category === 'update') {
                controlPanel.style.width = '690px';
                controlPanel.style.height = '330px';
            } else if (category === 'export') {
                controlPanel.style.width = '690px';
                controlPanel.style.height = '400px';
            } else {
                controlPanel.style.width = '700px';
                controlPanel.style.height = '260px';
            }
            // 更新容器可见性
            [messageContainer, downloadContainer, exportContainer, displayContainer, updateContainer, customFilterContainer].forEach(container => {
                container.style.display = container.dataset.category === category ? 'block' : 'none';
            });
        }
    });

    // 添加动画效果
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    #controlPanel > div {
        animation: fadeIn 0.3s ease-out;
    }
`;
    document.head.appendChild(styleSheet);

    // 将菜单容器添加到控制面板
    controlPanel.prepend(menuContainer);

    // 创建容器来包装按钮和装饰元素
    const Beautifulupdater = document.createElement('div');
    Beautifulupdater.style.position = 'relative';
    Beautifulupdater.style.width = '200px';
    Beautifulupdater.style.margin = '20px auto';
    Beautifulupdater.style.display = 'flex';
    Beautifulupdater.style.flexDirection = 'column';
    Beautifulupdater.style.justifyContent = 'center';
    Beautifulupdater.style.alignItems = 'center';

    // 创建更新按钮容器
    const updateButtonContainer = document.createElement('div');
    updateButtonContainer.style.textAlign = 'center';
    updateButtonContainer.style.marginTop = '20px';

    // 创建更新按钮
    const updateButton = document.createElement('button');
    updateButton.id = 'updateButton';
    updateButton.textContent = '检查更新';
    updateButton.style.padding = '10px 20px';
    updateButton.style.border = 'none';
    updateButton.style.borderRadius = '25px';
    updateButton.style.background = 'linear-gradient(90deg, #ffa500, #ff8c00, #ffa500)';
    updateButton.style.backgroundSize = '200% 100%';
    updateButton.style.animation = 'flowingGradient 3s ease infinite';
    updateButton.style.color = '#fff';
    updateButton.style.cursor = 'pointer';
    updateButton.style.fontWeight = 'bold';
    updateButton.style.fontSize = '16px';
    updateButton.style.transition = 'all 0.3s ease';
    updateButton.style.zIndex = '2';
    updateButtonContainer.appendChild(updateButton);

    // 添加悬浮和点击效果
    updateButton.onmouseover = () => {
        updateButton.style.transform = 'scale(1.1)';
        updateButton.style.boxShadow = '0 0 15px rgba(255, 165, 0, 0.7)';
    };
    updateButton.onmouseout = () => {
        updateButton.style.transform = 'scale(1)';
        updateButton.style.boxShadow = 'none';
    };
    updateButton.onmousedown = () => {
        updateButton.style.transform = 'scale(0.95)';
    };
    updateButton.onmouseup = () => {
        updateButton.style.transform = 'scale(1.1)';
    };

    // 创建版本号容器
    const versionContainer = document.createElement('div');
    versionContainer.style.textAlign = 'center'; // 居中对齐

    // 添加版本号显示
    const versionDisplay = document.createElement('div');
    versionDisplay.textContent = `V${GM_info.script.version}`;
    versionDisplay.style.cssText = `
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
  background: linear-gradient(45deg, #f0932b, #fcbb34);
  box-shadow: 0 0 10px rgba(255, 165, 0, 0.5);
  animation: glowPulse 2s ease-in-out infinite;
  cursor: pointer;
`;
    versionContainer.appendChild(versionDisplay);

    // 添加点击计数器和事件监听器
    let clickCount = 0;
    let lastClickTime = 0;
    versionDisplay.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止事件冒泡
        const currentTime = new Date().getTime();
        if (currentTime - lastClickTime > 1000) {
            clickCount = 0;
        }
        clickCount++;
        lastClickTime = currentTime;

        if (clickCount === 5) {
            activateEasterEgg();
            clickCount = 0;
        }
    });

    // 添加视觉反馈
    versionDisplay.addEventListener('mousedown', () => {
        versionDisplay.style.transform = 'scale(0.95)';
    });
    versionDisplay.addEventListener('mouseup', () => {
        versionDisplay.style.transform = 'scale(1)';
    });

    // 创建装饰元素
    const createDecorElement = (color, size, top, left, animationDelay) => {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.borderRadius = '50%';
        element.style.backgroundColor = color;
        element.style.top = `${top}px`;
        element.style.left = `${left}px`;
        element.style.animation = `float 3s ease-in-out infinite`;
        element.style.animationDelay = `${animationDelay}s`;
        element.style.zIndex = '1';
        return element;
    };

    // 添加装饰元素
    Beautifulupdater.appendChild(createDecorElement('#FFD700', 10, 10, 20, 0));
    Beautifulupdater.appendChild(createDecorElement('#FFA07A', 15, 70, 30, 0.5));
    Beautifulupdater.appendChild(createDecorElement('#98FB98', 12, 20, 160, 1));
    Beautifulupdater.appendChild(createDecorElement('#87CEFA', 8, 80, 170, 1.5));

    // 添加到容器
    Beautifulupdater.appendChild(versionContainer);
    Beautifulupdater.appendChild(updateButtonContainer);

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
    @keyframes flowingGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
`;
    document.head.appendChild(style);

    function compareVersions(currentVersion, latestVersion) {
        const currentParts = currentVersion.split('.').map(Number);
        const latestParts = latestVersion.split('.').map(Number);

        const maxLength = Math.max(currentParts.length, latestParts.length);

        for (let i = 0; i < maxLength; i++) {
            const currentPart = String(currentParts[i] || 0).padStart(3, '0');
            const latestPart = String(latestParts[i] || 0).padStart(3, '0');

            if (latestPart > currentPart) {
                return -1; // 最新版本较大
            } else if (currentPart > latestPart) {
                return 1; // 当前版本较大
            }
        }

        return 0; // 版本相同
    }

    function checkForUpdates(retries = 3) {
        const scriptInfo = GM_info;
        const currentVersion = scriptInfo.script.version;

        // 构建元数据文件的 URL
        const metaURL = scriptInfo.script.downloadURL.replace(/\.user\.js$/, '.meta.js') + '?t=' + Date.now();

        fetch(metaURL)
            .then(response => {
            if (!response.ok) {
                throw new Error(`无法获取元数据文件，状态码: ${response.status}`);
            }
            return response.text();
        })
            .then(text => {
            console.log('获取到的元数据:', text);

            const match = text.match(/\/\/\s*@version\s+([\d.]+)/);
            if (match && match[1]) {
                const latestVersion = match[1];
                const comparisonResult = compareVersions(currentVersion, latestVersion);

                if (comparisonResult < 0) {
                    showNotification(`检测到新版本 ${latestVersion}，是否立即更新？`, 'confirm',
                                     () => {
                        window.location.href = scriptInfo.script.downloadURL;
                    },
                                     () => {
                        showNotification('更新已取消', 'info');
                    });
                } else {
                    showNotification('当前已是最新版本！', 'info');
                }
            } else {
                throw new Error('无法从更新信息中提取版本号。');
            }
        })
            .catch(error => {
            console.error('更新检查失败:', error);

            if (retries > 0) {
                console.log(`重试中...剩余次数: ${retries}`);
                setTimeout(() => checkForUpdates(retries - 1), 3000);
            } else {
                showNotification('更新检查失败，请稍后再试。', 'warning');
            }
        });
    }

    updateButton.onclick = function () {
        checkForUpdates();
    };

    // 存放自定义过滤器的控件的容器
    const customFilterContainer = document.createElement('div');
    customFilterContainer.dataset.category = 'customFilter';
    customFilterContainer.style.display = 'none';

    // 生成过滤器编辑界面
    function createFilterEditor() {
        const editor = document.createElement('div');
        editor.style.padding = '20px';
        editor.style.backgroundColor = 'rgba(252, 187, 52, 0.05)';
        editor.style.borderRadius = '10px';
        editor.style.marginBottom = '20px';
        editor.style.boxShadow = '0 4px 15px rgba(252, 187, 52, 0.15)';

        window.quickFilters.forEach((filter, index) => {
            if (filter.label === "全部") return;

            const filterRow = document.createElement('div');
            filterRow.style.marginBottom = '20px';
            filterRow.style.display = 'flex';
            filterRow.style.alignItems = 'center';
            filterRow.style.transition = 'all 0.3s ease';

            const labelSpan = document.createElement('span');
            labelSpan.textContent = filter.label + ': ';
            labelSpan.style.marginRight = '15px';
            labelSpan.style.fontWeight = '600';
            labelSpan.style.color = '#e67e22';
            labelSpan.style.minWidth = '70px';
            labelSpan.style.fontSize = '16px';
            labelSpan.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)';
            labelSpan.style.letterSpacing = '0.5px';

            const valueInput = document.createElement('input');
            valueInput.type = 'text';
            valueInput.value = filter.value;
            valueInput.placeholder = '文件扩展名（用逗号分隔）';
            valueInput.style.flex = '1';
            valueInput.style.padding = '10px 15px';
            valueInput.style.borderRadius = '6px';
            valueInput.style.border = '2px solid #fcbb34';
            valueInput.style.outline = 'none';
            valueInput.style.transition = 'all 0.3s ease';
            valueInput.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            valueInput.style.fontSize = '14px';
            valueInput.style.color = '#333';
            valueInput.style.fontWeight = 'bold';
            valueInput.style.transform = 'skew(-10deg)';

            valueInput.addEventListener('focus', () => {
                valueInput.style.boxShadow = '0 0 0 3px rgba(252, 187, 52, 0.3)';
                filterRow.style.transform = 'translateX(5px)';
                labelSpan.style.color = '#d35400';
            });

            valueInput.addEventListener('blur', () => {
                valueInput.style.boxShadow = 'none';
                filterRow.style.transform = 'translateX(0)';
                labelSpan.style.color = '#e67e22';
            });

            valueInput.addEventListener('input', () => {
                window.quickFilters[index].value = valueInput.value;
            });

            filterRow.appendChild(labelSpan);
            filterRow.appendChild(valueInput);
            editor.appendChild(filterRow);
        });

        // 添加说明文字
        const instructionText = document.createElement('p');
        instructionText.textContent = '注意：该规则也对树状图生效，建议是增加而不是删除。';
        instructionText.style.marginTop = '15px';
        instructionText.style.fontSize = '14px';
        instructionText.style.color = '#666';
        instructionText.style.fontStyle = 'italic';
        instructionText.style.textAlign = 'center';
        editor.appendChild(instructionText);

        return editor;
    }

    function updateFilterEditor() {
        const oldEditor = customFilterContainer.querySelector('.filter-editor');
        const buttonsContainer = customFilterContainer.querySelector('.buttons-container');
        if (oldEditor) {
            oldEditor.remove();
        }

        const newEditor = createFilterEditor();
        newEditor.classList.add('filter-editor');

        if (buttonsContainer) {
            customFilterContainer.insertBefore(newEditor, buttonsContainer);
        } else {
            customFilterContainer.appendChild(newEditor);
        }
    }

    controlPanel.appendChild(customFilterContainer);
    updateFilterEditor();

    // 定义默认的过滤器设置
    const defaultQuickFilters = [
        { label: "全部", value: "" },
        { label: "文档", value: "doc,docx,pdf,txt,odt,rtf,html,htm,xls,xlsx,ppt,pptx,odp,xmind" },
        { label: "图片", value: "jpg,jpeg,png,gif,bmp,tiff,svg,webp,tif" },
        { label: "音频", value: "mp3,wav,ogg,flac,aac,m4a,wma,aiff,ape,midi" },
        { label: "压缩包", value: "zip,rar,7z,gz,bz2,tar" }
    ];

    function createSaveAndResetButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('buttons-container');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '20px';

        const saveButton = document.createElement('button');
        saveButton.textContent = '保存设置';
        saveButton.title = '保存设置并刷新页面';

        const resetButton = document.createElement('button');
        resetButton.textContent = '重置设置';
        resetButton.title = '重置为默认设置并刷新页面';

        const buttonStyle = `
        background-color: #3498db;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    `;

        saveButton.style.cssText = buttonStyle;
        resetButton.style.cssText = buttonStyle;
        resetButton.style.backgroundColor = '#e74c3c';

        const addHoverEffect = (button, defaultColor, hoverColor) => {
            button.onmouseover = function () {
                this.style.backgroundColor = hoverColor;
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
            };

            button.onmouseout = function () {
                this.style.backgroundColor = defaultColor;
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
            };
        };

        addHoverEffect(saveButton, '#3498db', '#2980b9');
        addHoverEffect(resetButton, '#e74c3c', '#c0392b');

        saveButton.onclick = () => {
            try {
                localStorage.setItem('customQuickFilters', JSON.stringify(window.quickFilters));
                showNotification('设置已保存，页面将在3秒后自动刷新以应用修改', 'info');
                setTimeout(() => {
                    location.reload();
                }, 3000);
            } catch (error) {
                showNotification('保存设置时出错，请重试', 'warning');
            }
        };

        resetButton.onclick = () => {
            showNotification('确定要重置所有过滤器设置吗？', 'confirm',
                             () => {
                window.quickFilters = JSON.parse(JSON.stringify(defaultQuickFilters));
                localStorage.removeItem('customQuickFilters');
                showNotification('设置已重置为默认值，页面将在3秒后自动刷新以应用修改', 'info');
                setTimeout(() => {
                    location.reload();
                }, 3000);
            },
                             () => {
                showNotification('重置操作已取消', 'info');
            }
                            );
        };

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(resetButton);
        return buttonContainer;
    }

    customFilterContainer.appendChild(createSaveAndResetButtons());

    // 定义CSS
    const hoverGlowName = 'hover-glow';
    const styleSheet1 = document.createElement('style');
    styleSheet1.type = 'text/css';
    styleSheet1.innerText = `
    @keyframes ${hoverGlowName} {
        from {
            box-shadow: 0 0 8px #fcbb34;
        }
        to {
            box-shadow: 0 0 20px #fcbb34, 0 0 30px #fcbb34;
        }
    }

    #toggleButton:hover {
        animation: ${hoverGlowName} 1s ease-in-out infinite alternate;
    }

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #FF8C00; /* 改为橙色 */
}

input:checked + .slider:before {
  transform: translateX(24px);
}

/* 显示/隐藏图标 */
.slider:after {
  content: "•";
  position: absolute;
  top: 50%;
  left: 30px;
  transform: translateY(-50%);
  color: white;
  font-size: 20px;
  opacity: 0;
  transition: .4s;
}

input:checked + .slider:after {
  opacity: 1;
  left: 8px;
}

.slider:hover {
  box-shadow: 0 0 5px rgba(255, 140, 0, 0.5);
}

.slider:hover:before {
  animation: newpulse 1.5s infinite;
}

@keyframes newpulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 140, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0); }
}

.switch:hover .slider:before {
  animation: newpulse 1.5s infinite;
}

.switch::after {
  content: attr(data-label);
  position: absolute;
  right: -65px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #555;
}

input:checked + .slider:before {
  transform: translateX(24px);
  transition: .4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.slider:before {
  transition: .4s, transform .2s;
}

input:checked + .slider:before {
  transform: translateX(24px) scale(1.1);
}

.slider {
  background: linear-gradient(to right, #ccc 50%, #FF8C00 50%);
  background-size: 200% 100%;
  background-position: left bottom;
  transition: all .4s ease;
}

input:checked + .slider {
  background-position: right bottom;
}

#allTipsContainer::-webkit-scrollbar {
            width: 10px;
        }
        #allTipsContainer::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        #allTipsContainer::-webkit-scrollbar-thumb {
            background: #fcbb34;
            border-radius: 10px;
        }
        #allTipsContainer::-webkit-scrollbar-thumb:hover {
            background: #e67e22;
        }
        .tip-item {
            background-color: #fff8e1;
            border-left: 4px solid #fcbb34;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 5px;
            transition: all 0.2s ease;
        }
        .tip-item:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        #closeTipsBtn {
            background-color: #fcbb34;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.2s ease;
            display: block;
            margin: 20px auto 0;
        }
        #closeTipsBtn:hover {
            background-color: #e67e22;
            transform: scale(1.05);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        #allTipsContainer.show {
            animation: fadeIn 0.3s ease-out forwards;
        }

        ${style.textContent}
        @keyframes popOutToCenter {
            0% { transform: translate(var(--start-x), var(--start-y)) scale(0.7); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes popInToOrigin {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { transform: translate(var(--end-x), var(--end-y)) scale(0.7); opacity: 0; }
        }
        @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes typing {
        from { width: 0 }
        to { width: 100% }
    }

    @keyframes blink-caret {
        from, to { border-color: transparent }
        50% { border-color: #fcbb34; }
    }

    .tip-item {
        background: linear-gradient(45deg, #f3f4f6, #fff);
        border-left: 4px solid #fcbb34;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        animation: fadeInUp 0.5s ease-out both;
        animation-play-state: paused;
}
        opacity: 0;
    }

    .tip-item:hover {
        transform: translateX(5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .tip-number {
        display: inline-block;
        background-color: #fcbb34;
        color: white;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 50%;
        margin-right: 10px;
    }

    .tip-text {
        display: inline-block;
        vertical-align: middle;
    }

    #allTipsContainer h2 {
        font-size: 28px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
        color: #fcbb34;
        overflow: hidden;
        border-right: .15em solid #fcbb34;
        white-space: nowrap;
        letter-spacing: .15em;
        animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
    }
`;
    document.head.appendChild(styleSheet1);

    // 设置切换按钮样式
    const gearIcon = document.createElement('span');
    gearIcon.textContent = '⚙️';
    gearIcon.style.fontSize = '16px';
    // 齿轮图标的样式
    gearIcon.style.transition = 'transform 0.3s ease';
    gearIcon.style.display = 'inline-block';
    gearIcon.style.verticalAlign = 'middle';
    toggleButton.appendChild(gearIcon);
    toggleButton.id = 'toggleButton';
    toggleButton.style.fontSize = '16px';
    toggleButton.title = '控制面板';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '210px';
    toggleButton.style.right = '0';
    toggleButton.style.zIndex = '10001';
    toggleButton.style.backgroundColor = '#fcbb34';
    toggleButton.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2)';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px 0 0 5px';
    toggleButton.style.padding = '10px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.transition = 'right 0.3s ease-in-out, transform 0.3s ease';
    // 添加悬停效果
    toggleButton.style.transform = 'scale(1)';
    toggleButton.addEventListener('mouseover', function () {
        toggleButton.style.transform = 'scale(1.1)';
    });
    toggleButton.addEventListener('mouseout', function () {
        toggleButton.style.transform = 'scale(1)';
    });

    // 切换按钮点击事件
    toggleButton.addEventListener('click', function () {
        isControlPanelVisible = !isControlPanelVisible;
        controlPanel.style.right = isControlPanelVisible ? '40px' : '-740px';
        gearIcon.style.transform = 'rotate(360deg)';
        gearIcon.addEventListener('transitionend', function () {
            gearIcon.style.transform = 'none';
        }, { once: true });
    });

    // 创建分类容器
    const messageContainer = document.createElement('div');
    messageContainer.dataset.category = 'message';
    messageContainer.style.justifyContent = 'space-between';
    messageContainer.style.width = '100%';

    const downloadContainer = document.createElement('div');
    downloadContainer.dataset.category = 'download';
    downloadContainer.style.justifyContent = 'space-between';
    downloadContainer.style.width = '100%';

    const exportContainer = document.createElement('div');
    exportContainer.dataset.category = 'export';
    exportContainer.style.justifyContent = 'space-between';
    exportContainer.style.width = '100%';

    const displayContainer = document.createElement('div');
    displayContainer.dataset.category = 'display';
    displayContainer.style.justifyContent = 'space-between';
    displayContainer.style.width = '100%';

    const updateContainer = document.createElement('div');
    updateContainer.dataset.category = 'update';
    updateContainer.style.justifyContent = 'space-between';
    updateContainer.style.width = '100%';

    // 初始化复选框状态
    function initializeCheckboxState(checkbox, index) {
        const savedState = localStorage.getItem(`checkbox-${index}`);
        checkbox.checked = savedState === null ? true : savedState === 'true';
        progressBarCheckbox.addEventListener('change', () => {
            isProgressBarVisible = progressBarCheckbox.checked;
            updateVisibility();
        });
    }

    // 保存复选框状态
    function saveCheckboxState(checkbox, index) {
        localStorage.setItem(`checkbox-${index}`, checkbox.checked);
    }

    // 初始化复选框
    [downloadInterfaceCheckbox, downloadButtonCheckbox, progressBarCheckbox, videoCheckbox].forEach((checkbox, index) => {
        checkbox.type = 'checkbox';
        initializeCheckboxState(checkbox, index);
        checkbox.id = `checkbox-${index}`;
        checkbox.style.display = 'none';

        const label = document.createElement('label');
        label.className = 'switch';
        label.htmlFor = `checkbox-${index}`;
        const slider = document.createElement('span');
        slider.className = 'slider';
        label.appendChild(checkbox);
        label.appendChild(slider);

        const labelText = document.createElement('span');
        labelText.textContent = ['右上角下载栏', '右下角下载栏', '左下角进度条', '右侧视频组件'][index];

        labelText.style.color = '#fcbb34';
        labelText.style.marginRight = '15px';
        labelText.style.fontWeight = '600';
        labelText.style.fontSize = '16px';
        labelText.style.letterSpacing = '0.5px';
        labelText.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)';
        labelText.style.transition = 'all 0.3s ease';
        labelText.style.cursor = 'pointer';

        // 添加悬停效果
        labelText.addEventListener('mouseover', () => {
            labelText.style.transform = 'translateY(-2px)';
            labelText.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.2)';
        });

        labelText.addEventListener('mouseout', () => {
            labelText.style.transform = 'translateY(0)';
            labelText.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)';
        });

        checkbox.addEventListener('change', () => {
            if (index === 1) {
                updateDownloadListVisibility();
            } else {
                updateVisibility();
            }
            saveCheckboxState(checkbox, index);
        });

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.alignItems = 'center';
        container.style.padding = '10px';
        container.style.position = 'relative';
        container.appendChild(labelText);

        // 创建装饰元素容器
        const decorationContainer = document.createElement('div');
        decorationContainer.style.display = 'flex';
        decorationContainer.style.alignItems = 'center';
        decorationContainer.style.margin = '0 15px';

        // 添加装饰线
        const decorativeLine = document.createElement('div');
        decorativeLine.style.width = '40px';
        decorativeLine.style.height = '2px';
        decorativeLine.style.background = 'linear-gradient(to right, #ff9800, #ff5722)';

        // 添加动态小圆点 (第一个)
        const dotContainer1 = document.createElement('div');
        dotContainer1.style.position = 'relative';
        dotContainer1.style.width = '20px';
        dotContainer1.style.height = '20px';

        const dot1 = document.createElement('div');
        dot1.style.position = 'absolute';
        dot1.style.top = '50%';
        dot1.style.left = '50%';
        dot1.style.width = '8px';
        dot1.style.height = '8px';
        dot1.style.borderRadius = '50%';
        dot1.style.backgroundColor = '#ff9800';
        dot1.style.transform = 'translate(-50%, -50%)';
        dot1.style.animation = 'newpulse 2s infinite';

        dotContainer1.appendChild(dot1);

        // 添加动态小圆点 (第二个)
        const dotContainer2 = document.createElement('div');
        dotContainer2.style.position = 'relative';
        dotContainer2.style.width = '20px';
        dotContainer2.style.height = '20px';

        const dot2 = document.createElement('div');
        dot2.style.position = 'absolute';
        dot2.style.top = '50%';
        dot2.style.left = '50%';
        dot2.style.width = '8px';
        dot2.style.height = '8px';
        dot2.style.borderRadius = '50%';
        dot2.style.backgroundColor = '#ff9800';
        dot2.style.transform = 'translate(-50%, -50%)';
        dot2.style.animation = 'newpulse 2s infinite';

        dotContainer2.appendChild(dot2);

        // 将装饰元素添加到装饰容器
        decorationContainer.appendChild(dotContainer1);
        decorationContainer.appendChild(decorativeLine);
        decorationContainer.appendChild(dotContainer2);

        // 将装饰容器添加到主容器
        container.appendChild(decorationContainer);

        // 添加开关
        container.appendChild(label);

        checkboxesContainer.appendChild(container);
    });

    // 创建第一个按钮容器（用于已读和清空消息按钮）
    const messageButtonContainer = document.createElement('div');
    messageButtonContainer.style.display = 'flex';
    messageButtonContainer.style.justifyContent = 'space-between';
    messageButtonContainer.style.marginTop = '10px';

    // 创建"已读所有消息"按钮
    const markReadButton = document.createElement('button');
    markReadButton.id = 'markReadButton';
    markReadButton.textContent = '已读所有消息';
    markReadButton.title = '标记所有消息为已读并刷新页面';

    // 添加样式
    markReadButton.style.cssText = `
  background-color: #2ecc71;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

    // 添加hover效果
    markReadButton.onmouseover = function () {
        this.style.backgroundColor = '#27ae60';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
    };

    markReadButton.onmouseout = function () {
        this.style.backgroundColor = '#2ecc71';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    };

    // 绑定点击事件处理函数
    markReadButton.onclick = async function () {
        try {
            this.disabled = true;
            this.textContent = '正在处理...';
            const result = await markAllMessagesAsRead();
            if (result.hasUnreadMessages) {
                showNotification('所有消息已标记为已读，页面将刷新', 'info');
                location.reload();
            } else {
                showNotification('没有未读消息', 'info');
            }
        } catch (error) {
            console.error('Error marking messages as read:', error);
            showNotification('标记消息时出错，请重试', 'warning');
        } finally {
            this.disabled = false;
            this.textContent = '已读所有消息';
        }
    };

    // 定义标记所有消息为已读的函数
    async function markAllMessagesAsRead() {
        const token = getCookie();
        const hostname = window.location.hostname;
        const pageSize = 20;
        const messageTypes = ["todo", "group", "personal", "system"];
        let hasUnreadMessages = false;

        for (const messageType of messageTypes) {
            try {
                let pageIndex = 1;
                let unreadMessageIds = [];

                while (true) {
                    const apiUrl = `https://${hostname}/api/jx-iresource/message/im/${messageType}?page_size=${pageSize}&page_index=${pageIndex}&msg_status=0`;
                    const response = await fetch(apiUrl, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`获取未读${messageType}消息失败: ${response.status} ${response.statusText}`);
                    }

                    const data = await response.json();
                    const messages = data.data.list;

                    if (messages.length === 0 || pageIndex * pageSize >= data.data.total) {
                        break;
                    }

                    unreadMessageIds = unreadMessageIds.concat(messages.map(message => message.id));
                    pageIndex++;
                }

                if (unreadMessageIds.length > 0) {
                    hasUnreadMessages = true;
                    const updateResponse = await fetch(`https://${hostname}/api/jx-iresource/message/im/updateStatus`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            message_ids: unreadMessageIds,
                            status: 1
                        })
                    });

                    if (!updateResponse.ok) {
                        throw new Error(`标记${messageType}消息失败: ${updateResponse.status} ${updateResponse.statusText}`);
                    }

                    console.log(`所有${messageType}消息已标记为已读`);
                } else {
                    console.log(`没有未读${messageType}消息`);
                }
            } catch (error) {
                console.error(`Error processing ${messageType} messages:`, error);
                throw error;
            }
        }

        // 调用API更新未读消息计数
        try {
            const updateCountResponse = await fetch(`https://${hostname}/api/jx-iresource/message/im/un_read_count`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!updateCountResponse.ok) {
                throw new Error(`更新未读消息计数失败: ${updateCountResponse.status} ${updateCountResponse.statusText}`);
            }

            const countData = await updateCountResponse.json();
            console.log("未读消息计数已更新:", countData);
        } catch (error) {
            console.error("更新未读消息计数时发生错误:", error);
        }

        return { hasUnreadMessages };
    }

    // 创建"清空所有消息"按钮
    const clearMessagesButton = document.createElement('button');
    clearMessagesButton.id = 'clearMessagesButton';
    clearMessagesButton.textContent = '清空所有消息';
    clearMessagesButton.title = '清空所有消息并刷新页面';

    // 添加样式
    clearMessagesButton.style.cssText = `
  background-color: #e74c3c;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

    // 添加hover效果
    clearMessagesButton.onmouseover = function () {
        this.style.backgroundColor = '#c0392b';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
    };

    clearMessagesButton.onmouseout = function () {
        this.style.backgroundColor = '#e74c3c';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    };

    // 绑定点击事件处理函数
    clearMessagesButton.onclick = function () {
        showNotification("确定要清空所有消息吗？该操作无法撤销。", 'confirm',
                         async () => {
            try {
                this.disabled = true;
                this.textContent = '正在清空...';
                const result = await clearAllMessages();
                if (result.hasMessagesToClear) {
                    showNotification('所有消息已清空，页面将在3秒后刷新', 'info');
                    setTimeout(() => {
                        location.reload();
                    }, 3000);
                } else {
                    showNotification('没有消息可清空', 'info');
                }
            } catch (error) {
                console.error('Error clearing messages:', error);
                showNotification('清空消息时出错，请重试', 'error');
            } finally {
                this.disabled = false;
                this.textContent = '清空所有消息';
            }
        },
                         () => {
            showNotification('清空操作已取消', 'info');
        }
                        );
    };

    async function clearAllMessages() {
        const token = getCookie();
        const hostname = window.location.hostname;
        const pageSize = 20;
        const messageTypes = ["todo", "group", "personal", "system"];
        let hasMessagesToClear = false;

        for (const messageType of messageTypes) {
            try {
                let pageIndex = 1;
                let messageIdsToClear = [];

                while (true) {
                    const apiUrl = `https://${hostname}/api/jx-iresource/message/im/${messageType}?page_size=${pageSize}&page_index=${pageIndex}`;
                    const response = await fetch(apiUrl, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`获取${messageType}消息失败: ${response.status} ${response.statusText}`);
                    }

                    const data = await response.json();
                    const messages = data.data.list;

                    if (messages.length === 0 || pageIndex * pageSize >= data.data.total) {
                        break;
                    }

                    messageIdsToClear = messageIdsToClear.concat(messages.map(message => message.id));
                    pageIndex++;
                }

                if (messageIdsToClear.length > 0) {
                    hasMessagesToClear = true;
                    const clearResponse = await fetch(`https://${hostname}/api/jx-iresource/message/im/selected/empty`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            message_ids: messageIdsToClear
                        })
                    });

                    if (!clearResponse.ok) {
                        const errorText = await clearResponse.text();
                        throw new Error(`清空${messageType}消息失败: ${errorText}`);
                    }

                    console.log(`所有${messageType}消息已清空`);
                } else {
                    console.log(`没有${messageType}消息可清空`);
                }
            } catch (error) {
                console.error(`Error processing ${messageType} messages:`, error);
                throw error;
            }
        }

        // 调用API更新未读消息计数
        try {
            const updateCountResponse = await fetch(`https://${hostname}/api/jx-iresource/message/im/un_read_count`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!updateCountResponse.ok) {
                throw new Error(`更新未读消息计数失败: ${updateCountResponse.status} ${updateCountResponse.statusText}`);
            }

            const countData = await updateCountResponse.json();
            console.log("未读消息计数已更新:", countData);
        } catch (error) {
            console.error("更新未读消息计数时发生错误:", error);
        }

        return { hasMessagesToClear };
    }

    // 将按钮添加到第一个容器
    messageButtonContainer.appendChild(markReadButton);
    messageButtonContainer.appendChild(clearMessagesButton);

    // 创建第二个按钮容器
    const downloadButtonContainer = document.createElement('div');
    downloadButtonContainer.style.display = 'flex';
    downloadButtonContainer.style.justifyContent = 'space-between';
    downloadButtonContainer.style.marginTop = '10px';

    // 创建"查看下载历史"按钮
    const showHistoryButton = document.createElement('button');
    showHistoryButton.id = 'showHistoryButton';
    showHistoryButton.textContent = '查看下载历史';
    showHistoryButton.title = '导出的文件不会被记录';

    // 添加样式
    showHistoryButton.style.cssText = `
        background-color: #3498db;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    `;

    // 添加hover效果
    showHistoryButton.onmouseover = function () {
        showHistoryButton.style.backgroundColor = '#2980b9';
        showHistoryButton.style.transform = 'translateY(-2px)';
        showHistoryButton.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
    };

    showHistoryButton.onmouseout = function () {
        showHistoryButton.style.backgroundColor = '#3498db';
        showHistoryButton.style.transform = 'translateY(0)';
        showHistoryButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    };

    showHistoryButton.onclick = showDownloadHistory;

    // 将"查看下载历史"按钮添加到第二个容器
    downloadButtonContainer.appendChild(showHistoryButton);

    // 创建第三方下载切换按钮
    const thirdPartyDownloadButton = document.createElement('button');
    thirdPartyDownloadButton.id = 'thirdPartyDownloadButton';
    thirdPartyDownloadButton.title = '切换下载方式';

    // 添加样式
    thirdPartyDownloadButton.style.cssText = `
        background-color: #f39c12;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    `;

    // 添加hover效果
    thirdPartyDownloadButton.onmouseover = function () {
        thirdPartyDownloadButton.style.transform = 'translateY(-2px)';
        thirdPartyDownloadButton.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
    };

    thirdPartyDownloadButton.onmouseout = function () {
        thirdPartyDownloadButton.style.transform = 'translateY(0)';
        thirdPartyDownloadButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    };

    // 从localStorage中获取当前状态
    let useThirdPartyDownload = localStorage.getItem('useThirdPartyDownload') === 'true';
    updateThirdPartyDownloadButtonState();

    thirdPartyDownloadButton.onclick = function () {
        useThirdPartyDownload = !useThirdPartyDownload;
        localStorage.setItem('useThirdPartyDownload', useThirdPartyDownload);
        updateThirdPartyDownloadButtonState();
    };

    function updateThirdPartyDownloadButtonState() {
        if (useThirdPartyDownload) {
            thirdPartyDownloadButton.textContent = '用第三方下载';
            thirdPartyDownloadButton.style.backgroundColor = '#27ae60';
        } else {
            thirdPartyDownloadButton.textContent = '用浏览器下载';
            thirdPartyDownloadButton.style.backgroundColor = '#f39c12';
        }
    }

    // 将按钮添加到第二个容器
    downloadButtonContainer.appendChild(thirdPartyDownloadButton);

    // 创建第三个按钮容器
    const exportButtonContainer = document.createElement('div');
    exportButtonContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        padding: 10px;
        background-color: rgba(252, 187, 52, 0.1);
        border-radius: 8px;
    `;

    // 创建文本容器
    const TextContainer = document.createElement('div');
    TextContainer.id = 'zipTextContainer';
    TextContainer.style.cssText = `
        margin-top: 15px;
        padding: 15px 20px;
        background-color: #fff;
        border: 2px solid #fcbb34;
        border-radius: 12px;
        font-size: 14px;
        font-weight: bold;
        color: #333;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    `;

    // 创建自定义下拉框
    function createCustomDropdown(container, options) {
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'custom-dropdown';
        dropdownContainer.style.cssText = `
            position: relative;
            width: 250px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;

        const selectedOption = document.createElement('div');
        selectedOption.className = 'selected-option';
        selectedOption.textContent = options[0].text;
        selectedOption.style.cssText = `
            padding: 12px 40px 12px 15px;
            font-size: 16px;
            font-weight: bold;
            border: 2px solid #fcbb34;
            border-radius: 8px;
            background-color: #fff;
            color: #333;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(252, 187, 52, 0.2);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            letter-spacing: 0.3px;
            line-height: 1.4;
        `;

        const arrow = document.createElement('div');
        arrow.className = 'dropdown-arrow';
        arrow.style.cssText = `
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid #fcbb34;
            transition: all 0.3s ease;
            cursor: pointer;
        `;

        const optionsList = document.createElement('ul');
        optionsList.className = 'options-list';
        optionsList.style.cssText = `
            position: fixed;
            background-color: #fff;
            border: 2px solid #e67e22;
            border-top: none;
            border-radius: 0 0 8px 8px;
            list-style-type: none;
            margin: 0;
            padding: 0;
            max-height: 250px;
            overflow-y: auto;
            display: none;
            z-index: 10001;
            box-shadow: 0 4px 10px rgba(230, 126, 34, 0.2);
        `;

        options.forEach(option => {
            const li = document.createElement('li');
            li.textContent = option.text;
            li.dataset.value = option.value;
            li.style.cssText = `
                padding: 12px 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 15px;
                font-weight: bold;
                color: #555;
                border-bottom: 1px solid #f0f0f0;
                letter-spacing: 0.2px;
                line-height: 1.3;
            `;
            li.onmouseover = () => {
                li.style.backgroundColor = '#fff5e6';
                li.style.color = '#e67e22';
            };
            li.onmouseout = () => {
                li.style.backgroundColor = '#fff';
                li.style.color = '#555';
            };
            li.onclick = (event) => {
                event.stopPropagation();
                selectedOption.textContent = option.text;
                optionsList.style.display = 'none';
                arrow.style.transform = 'translateY(-50%) rotate(0deg)';

                // 恢复显示框的原始状态
                selectedOption.style.borderRadius = '8px';
                selectedOption.style.borderBottom = '2px solid #fcbb34';
                selectedOption.style.borderColor = '#fcbb34';
                selectedOption.style.color = '#333';
            };
            optionsList.appendChild(li);
        });

        function positionOptionsList() {
            const rect = selectedOption.getBoundingClientRect();
            optionsList.style.width = `${rect.width}px`;
            optionsList.style.left = `${rect.left}px`;

            const spaceBelow = window.innerHeight - rect.bottom;
            if (spaceBelow < 200 && rect.top > spaceBelow) {
                optionsList.style.top = 'auto';
                optionsList.style.bottom = `${window.innerHeight - rect.top + 2}px`;
                optionsList.style.borderTop = '2px solid #e67e22';
                optionsList.style.borderBottom = 'none';
                optionsList.style.borderRadius = '8px 8px 0 0';
                selectedOption.style.borderTopLeftRadius = '0';
                selectedOption.style.borderTopRightRadius = '0';
                selectedOption.style.borderTop = 'none';
            } else {
                optionsList.style.top = `${rect.bottom - 2}px`;
                optionsList.style.bottom = 'auto';
                optionsList.style.borderTop = 'none';
                optionsList.style.borderBottom = '2px solid #e67e22';
                optionsList.style.borderRadius = '0 0 8px 8px';
            }
        }

        function toggleDropdown(event) {
            event.stopPropagation();
            const isOpen = optionsList.style.display === 'block';
            if (!isOpen) {
                positionOptionsList();
                selectedOption.style.borderBottomLeftRadius = '0';
                selectedOption.style.borderBottomRightRadius = '0';
                selectedOption.style.borderBottom = 'none';
                selectedOption.style.borderColor = '#e67e22';
                selectedOption.style.color = '#e67e22';
                optionsList.style.display = 'block';
                optionsList.style.borderTop = 'none';
            } else {
                selectedOption.style.borderRadius = '8px';
                selectedOption.style.borderBottom = '2px solid #fcbb34';
                selectedOption.style.borderColor = '#fcbb34';
                selectedOption.style.color = '#333';
                optionsList.style.display = 'none';
            }
            arrow.style.transform = isOpen
                ? 'translateY(-50%) rotate(0deg)'
            : 'translateY(-50%) rotate(180deg)';
        }

        selectedOption.onclick = toggleDropdown;

        arrow.onclick = (event) => {
            event.stopPropagation();
            toggleDropdown(event);
        };

        document.addEventListener('click', () => {
            optionsList.style.display = 'none';
            arrow.style.transform = 'translateY(-50%) rotate(0deg)';
            selectedOption.style.borderRadius = '8px';
            selectedOption.style.borderBottom = '2px solid #fcbb34';
            selectedOption.style.borderColor = '#fcbb34';
            selectedOption.style.color = '#333';
        });

        window.addEventListener('resize', () => {
            if (optionsList.style.display === 'block') {
                positionOptionsList();
            }
        });

        dropdownContainer.appendChild(selectedOption);
        dropdownContainer.appendChild(arrow);
        document.body.appendChild(optionsList);
        container.appendChild(dropdownContainer);

        return { dropdownContainer, optionsList };
    }

    // 创建下拉框容器
    const selectWrapper = document.createElement('div');
    selectWrapper.style.cssText = `
        position: relative;
        margin-right: 15px;
    `;

    // 定义格式选项
    const formats = [
        { value: 'ef2', text: 'EF2 格式 (IDM专用)' },
        { value: 'txt', text: 'TXT 格式 (通用)' },
        { value: 'json', text: 'JSON 格式 (结构化数据)' },
        { value: 'csv', text: 'CSV 格式 (电子表格)' },
        { value: 'zip', text: 'ZIP 格式 (压缩文件)' }
    ];

    // 创建自定义下拉框
    const { dropdownContainer, optionsList } = createCustomDropdown(selectWrapper, formats);

    // 创建导出按钮
    const exportButton = document.createElement('button');
    exportButton.id = 'exportButton';
    exportButton.textContent = '导出文件';
    exportButton.style.cssText = `
        background-color: #fcbb34;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    `;

    exportButton.onmouseover = function () {
        this.style.backgroundColor = '#e67e22';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
    };

    exportButton.onmouseout = function () {
        this.style.backgroundColor = '#fcbb34';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    };

    // 导出按钮点击事件
    exportButton.onclick = function () {
        const selectedOption = dropdownContainer.querySelector('.selected-option');
        const selectedFormat = selectedOption.textContent.includes('EF2') ? 'ef2' :
        selectedOption.textContent.includes('JSON') ? 'json' :
        selectedOption.textContent.includes('CSV') ? 'csv' :
        selectedOption.textContent.includes('ZIP') ? 'zip' : 'txt';
        if (selectedFormat === 'ef2') {
            exportToEf2();
        } else if (selectedFormat === 'txt') {
            exportToTxt();
        } else if (selectedFormat === 'json') {
            exportToJson();
        } else if (selectedFormat === 'csv') {
            exportToCsv();
        } else if (selectedFormat === 'zip') {
            exportToZip();
        }
    };

    exportButtonContainer.appendChild(selectWrapper);
    exportButtonContainer.appendChild(exportButton);
    addShowCourseNameText();
    addTipsDisplay();

    async function exportToEf2() {
        const checkedCheckboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked:not(#selectAllCheckbox)");

        // 获取选中文件的信息
        const selectedFiles = Array.from(checkedCheckboxes).reduce((acc, checkbox) => {
            const container = checkbox.closest('div');
            if (!container) return acc;

            const link = container.querySelector('a.download-link');
            if (!link) return acc;

            const quoteId = link.getAttribute('data-quote-id');
            const filename = link.getAttribute('data-origin-name');

            if (!quoteId || !filename) return acc;

            acc.push({ quoteId, filename });
            return acc;
        }, []);

        if (selectedFiles.length === 0) {
            showNotification('请选择要导出的文件', 'warning');
            return;
        }

        // 显示进度提示
        showNotification('正在获取下载链接...', 'info');

        try {
            // 获取所有文件的下载链接
            const filesWithUrls = await Promise.all(
                selectedFiles.map(async file => {
                    const url = await window.getDownloadUrl(file.quoteId);
                    return { ...file, url };
                })
            );

            const referer = window.location.href;
            const cookieString = document.cookie;

            // 生成ef2内容
            let ef2Content = '';
            filesWithUrls.forEach(file => {
                ef2Content += '<\r\n';
                ef2Content += `${file.url}\r\n`;
                ef2Content += `referer: ${referer}\r\n`;
                ef2Content += `cookie: ${cookieString}\r\n`;
                ef2Content += `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0\r\n`;
                ef2Content += '>\r\n';
            });

            ef2Content += '\r\n';

            // 下载ef2文件
            const blob = new Blob([ef2Content], { type: 'text/plain' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${getCourseName()}_课件链接.ef2`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            showNotification('导出成功!', 'info');
        } catch (error) {
            console.error('导出ef2文件时发生错误:', error);
            showNotification('导出失败,请重试', 'error');
        }
    }

    async function exportToTxt() {
        const checkedCheckboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked:not(#selectAllCheckbox)");

        // 获取选中文件信息
        const selectedFiles = Array.from(checkedCheckboxes).reduce((acc, checkbox) => {
            const container = checkbox.closest('div');
            if (!container) return acc;

            const link = container.querySelector('a.download-link');
            if (!link) return acc;

            const quoteId = link.getAttribute('data-quote-id');
            if (!quoteId) return acc;

            acc.push(quoteId);
            return acc;
        }, []);

        if (selectedFiles.length === 0) {
            showNotification('请选择要导出的文件', 'info');
            return;
        }

        // 显示进度提示
        showNotification('正在获取下载链接...', 'info');

        try {
            // 获取所有下载链接
            const urls = await Promise.all(
                selectedFiles.map(quoteId => window.getDownloadUrl(quoteId))
            );

            let txtContent = urls.join('\r\n');
            console.log('TXT 内容长度:', txtContent.length);

            const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${getCourseName()}_课件链接.txt`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            showNotification('导出成功!', 'info');
        } catch (error) {
            console.error('导出txt文件时发生错误:', error);
            showNotification('导出失败,请重试', 'error');
        }
    }

    async function exportToJson() {
        const checkedCheckboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked:not(#selectAllCheckbox)");

        const selectedFiles = Array.from(checkedCheckboxes).reduce((acc, checkbox) => {
            const container = checkbox.closest('div');
            if (checkbox.id === 'selectAllCheckbox') {
                return acc;
            }
            if (!container) {
                return acc;
            }
            const link = container.querySelector('a.download-link');
            if (!link) {
                return acc;
            }

            acc.push({
                quoteId: link.getAttribute('data-quote-id'),
                filename: link.getAttribute('data-origin-name'),
                course: getCourseName(),
                createdAt: link.getAttribute('data-created-at'),
                updatedAt: link.getAttribute('data-updated-at'),
                resourceId: link.getAttribute('data-resource-id'),
                path: link.getAttribute('data-path'),
                parentId: link.getAttribute('data-parent-id')
            });
            return acc;
        }, []);

        if (selectedFiles.length === 0) {
            showNotification('请选择要导出的文件', 'warning');
            return;
        }

        showNotification('正在获取下载链接...', 'info');

        try {
            // 获取所有文件的下载链接
            const filesWithUrls = await Promise.all(
                selectedFiles.map(async file => {
                    const url = await window.getDownloadUrl(file.quoteId);
                    return { ...file, url };
                })
            );

            const jsonContent = JSON.stringify({
                exportDate: new Date().toISOString(),
                totalFiles: filesWithUrls.length,
                files: filesWithUrls
            }, null, 2);

            console.log('JSON 内容长度:', jsonContent.length);

            const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${getCourseName()}_课件数据.json`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            showNotification('导出成功!', 'info');
        } catch (error) {
            console.error('导出json文件时发生错误:', error);
            showNotification('导出失败,请重试', 'error');
        }
    }

    async function exportToCsv() {
        const checkedCheckboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked:not(#selectAllCheckbox)");

        const headers = ['URL', '文件名', '课程', '创建时间', '更新时间', '资源ID', '路径', '父ID'];
        let csvContent = headers.join(',') + '\n';

        // 收集文件信息
        const selectedFiles = Array.from(checkedCheckboxes).reduce((acc, checkbox) => {
            const container = checkbox.closest('div');
            if (checkbox.id === 'selectAllCheckbox') return acc;
            if (!container) return acc;

            const link = container.querySelector('a.download-link');
            if (!link) return acc;

            acc.push({
                quoteId: link.getAttribute('data-quote-id'),
                filename: link.getAttribute('data-origin-name'),
                course: getCourseName(),
                createdAt: link.getAttribute('data-created-at'),
                updatedAt: link.getAttribute('data-updated-at'),
                resourceId: link.getAttribute('data-resource-id'),
                path: link.getAttribute('data-path'),
                parentId: link.getAttribute('data-parent-id')
            });
            return acc;
        }, []);

        if (selectedFiles.length === 0) {
            showNotification('请选择要导出的文件', 'warning');
            return;
        }

        showNotification('正在获取下载链接...', 'info');

        try {
            // 获取所有文件的下载链接
            const filesWithUrls = await Promise.all(
                selectedFiles.map(async file => {
                    const url = await window.getDownloadUrl(file.quoteId);
                    return { ...file, url };
                })
            );

            // 生成CSV内容
            csvContent = headers.join(',') + '\n';
            filesWithUrls.forEach(file => {
                const row = [
                    file.url,
                    file.filename,
                    file.course,
                    file.createdAt,
                    file.updatedAt,
                    file.resourceId,
                    file.path,
                    file.parentId
                ].map(item => `"${(item || '').replace(/"/g, '""')}"`);

                csvContent += row.join(',') + '\n';
            });

            console.log('CSV 内容长度:', csvContent.length);

            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${getCourseName()}_课件表格.csv`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            showNotification('导出成功!', 'info');
        } catch (error) {
            console.error('导出CSV文件时发生错误:', error);
            showNotification('导出失败,请重试', 'error');
        }
    }

    async function exportToZip() {
        const progressIndicator = createZipProgressIndicator();
        if (!progressIndicator) {
            return;
        }

        const { updateProgress, hide } = progressIndicator;

        updateProgress("正在准备导出...", 0);

        const checkedCheckboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked:not(#selectAllCheckbox)");
        const selectedFiles = Array.from(checkedCheckboxes).reduce((acc, checkbox) => {
            const container = checkbox.closest('div');
            if (!container) return acc;

            const link = container.querySelector('a.download-link');
            if (!link) return acc;

            const quoteId = link.getAttribute('data-quote-id');
            const filename = link.getAttribute('data-origin-name');
            if (!quoteId || !filename) return acc;

            acc.push({ quoteId, filename });
            return acc;
        }, []);

        if (selectedFiles.length === 0) {
            updateProgress('请选择要导出的文件', 0);
            setTimeout(hide, 3000);
            return;
        }

        const proceedWithZip = async () => {
            const zip = new window.JSZip();
            const totalFiles = selectedFiles.length;
            let processedFiles = 0;

            updateProgress("正在获取下载链接...", 5);

            try {
                // 获取所有文件的下载链接
                const filesWithUrls = await Promise.all(
                    selectedFiles.map(async file => {
                        const url = await window.getDownloadUrl(file.quoteId);
                        return { ...file, url };
                    })
                );

                updateProgress("正在准备ZIP文件...", 20);

                const addFilePromises = filesWithUrls.map(file => {
                    return fetch(file.url)
                        .then(response => response.blob())
                        .then(blob => {
                        zip.file(file.filename, blob);
                        processedFiles++;
                        const progress = 20 + (processedFiles / totalFiles) * 60;
                        updateProgress(`正在添加文件 (${processedFiles}/${totalFiles})...`, progress);
                    })
                        .catch(error => {
                        console.error(`获取文件失败: ${file.filename}`, error);
                        throw error;
                    });
                });

                const courseName = getCourseName();

                await Promise.all(addFilePromises);

                updateProgress("正在生成ZIP文件...", 80);
                const content = await zip.generateAsync({ type: "blob" });

                updateProgress("ZIP文件已生成，准备下载...", 90);

                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(content);
                downloadLink.download = `${courseName}_课件包.zip`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                updateProgress("ZIP文件下载已开始", 100);
                setTimeout(hide, 3000);

            } catch (error) {
                updateProgress("创建ZIP文件时发生错误，请查看控制台获取详细信息。", 0);
                console.error("创建ZIP文件出错:", error);
                setTimeout(() => {
                    hide();
                    showInterceptionMessage("创建ZIP文件时发生错误，可能是网络问题或被IDM拦截");
                }, 1000);
            }
        };

        if (selectedFiles.length > 10) {
            showNotification(
                `已选择 ${selectedFiles.length} 个文件，压缩大量文件可能需要较长时间。是否继续？`,
                'confirm',
                () => {
                    proceedWithZip();
                },
                () => {
                    hide();
                    showNotification('压缩操作已取消', 'info');
                }
            );
        } else {
            proceedWithZip();
        }
    }

    function showInterceptionMessage(message) {
        const messageHTML = `
            <div id="interceptionMessage" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #fff9e6;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(255, 165, 0, 0.2);
                max-width: 550px;
                width: 90%;
                z-index: 9999;
                animation: fadeIn 0.5s ease-out;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                ">
                    <span style="
                        font-size: 28px;
                        margin-right: 15px;
                    ">⚠️</span>
                    <h3 style="
                        color: #ffa500;
                        margin: 0;
                        font-size: 24px;
                        font-weight: bold;
                    ">下载遇到问题</h3>
                </div>
                <p style="
                    color: #5d4037;
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                ">${message}</p>
                <p style="
                    color: #33691e;
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 15px;
                ">可能的解决方法：</p>
                <ol style="
                    color: #5d4037;
                    font-size: 14px;
                    line-height: 1.7;
                    padding-left: 0;
                    margin-bottom: 25px;
                    list-style-type: none;
                    counter-reset: item;
                ">
                    <li style="
                        margin-bottom: 15px;
                        position: relative;
                        padding-left: 35px;
                        counter-increment: item;
                    ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffa500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 0; top: 0;">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        网络问题：请检查网络连接，稍后重试。
                    </li>
                    <li style="
                    margin-bottom: 15px;
                    position: relative;
                    padding-left: 35px;
                    counter-increment: item;
                ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffa500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 0; top: 0;">
                        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                        <line x1="7" y1="2" x2="7" y2="22"></line>
                        <line x1="17" y1="2" x2="17" y2="22"></line>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <line x1="2" y1="7" x2="7" y2="7"></line>
                        <line x1="2" y1="17" x2="7" y2="17"></line>
                        <line x1="17" y1="17" x2="22" y2="17"></line>
                        <line x1="17" y1="7" x2="22" y2="7"></line>
                    </svg>
                    IDM拦截：如果你在使用IDM，以下是一种绕过手段：
                    <ul style="
                        padding-left: 20px;
                        margin-top: 10px;
                        list-style-type: none;
                    ">
                        <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffa500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 0; top: 2px;">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                            在 IDM 中，转到“下载” > "选项"
                        </li>
                        <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffa500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 0; top: 2px;">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                            选择“文件类型”标签
                        </li>
                        <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffa500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 0; top: 2px;">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                            在“下列站点不要自动开始下载”中添加 oss.ai-augmented.com（以空格分隔）
                        </li>
                        <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffa500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 0; top: 2px;">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                            点击“确定”保存设置
                        </li>
                        <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffa500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 0; top: 2px;">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                            当然，你也可以在IDM的弹窗里选择“该站点不要自动开始下载(oss.ai-augmented.com)”
                        </li>
                    </ul>
                </li>
                    <li style="
                        margin-bottom: 15px;
                        position: relative;
                        padding-left: 35px;
                        counter-increment: item;
                    ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffa500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 0; top: 0;">
                            <polyline points="1 4 1 10 7 10"></polyline>
                            <polyline points="23 20 23 14 17 14"></polyline>
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                        </svg>
                        也许我们可以试试刷新？（小声）
                    </li>
                </ol>
                <button onclick="
                const msgEl = document.getElementById('interceptionMessage');
                msgEl.style.animation = 'fadeOut 0.5s ease-out';
                setTimeout(() => msgEl.remove(), 500);
            " style="
                background-color: #ffa500;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s;
                display: block;
                margin: 0 auto;
                box-shadow: 0 4px 6px rgba(255, 165, 0, 0.2);
            ">我知道了</button>
            </div>
        `;
        const messageElement = document.createElement('div');
        messageElement.innerHTML = messageHTML;
        document.body.appendChild(messageElement);

        const button = messageElement.querySelector('button');
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#ff8c00';
            button.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#ffa500';
            button.style.transform = 'translateY(0)';
        });
    }

    // 获取课程名称
    function getCourseName() {
        const footer = document.querySelector('.img_footer');
        if (footer) {
            const groupNameElement = footer.querySelector('.group_name');
            if (groupNameElement) {
                return groupNameElement.textContent; // 返回课程名称
            }
        }
        return '未知';
    }

    function addShowCourseNameText() {
        showCourseNameText.style.marginTop = '10px';
        showCourseNameText.style.marginBottom = '10px';
        showCourseNameText.style.fontSize = '16px';
        showCourseNameText.style.backgroundColor = 'transparent';
        showCourseNameText.style.width = '100%';
        showCourseNameText.style.textAlign = 'center';
        showCourseNameText.style.fontWeight = '600';
        showCourseNameText.style.letterSpacing = '0.5px';
        showCourseNameText.style.padding = '6px';
        showCourseNameText.style.boxSizing = 'border-box';
        showCourseNameText.className = 'glowing-text animated-text';

        // 添加 CSS 动画和样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
                100% { transform: translateY(0px); }
            }
            @keyframes colorChange {
                0% { color: #ff6600; text-shadow: 0 0 5px rgba(255, 102, 0, 0.7); }
                50% { color: #ff9900; text-shadow: 0 0 8px rgba(255, 153, 0, 0.8); }
                100% { color: #ff6600; text-shadow: 0 0 5px rgba(255, 102, 0, 0.7); }
            }
            @keyframes borderBlink {
                0% { box-shadow: 0 0 0 1px rgba(255, 165, 0, 0.3); }
                50% { box-shadow: 0 0 0 1px rgba(255, 165, 0, 0.8); }
                100% { box-shadow: 0 0 0 1px rgba(255, 165, 0, 0.3); }
            }
            .animated-text {
                animation:
                    float 3s ease-in-out infinite,
                    colorChange 5s linear infinite,
                    borderBlink 2s linear infinite;
                border-radius: 5px;
            }
        `;
        document.head.appendChild(style);

        const observer = new MutationObserver((mutations, obs) => {
            const courseName = getCourseName();
            if (courseName !== showCourseNameText.getAttribute('data-course')) {
                showCourseNameText.setAttribute('data-course', courseName);
                typeWriter(`当前课程：${courseName}`, showCourseNameText);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }

    // 打字机效果函数
    function typeWriter(text, element, index = 0) {
        if (index < text.length) {
            element.textContent = text.substring(0, index + 1);
            setTimeout(() => typeWriter(text, element, index + 1), 50);
        }
    }

    function addTipsDisplay() {
        tipsDisplay.id = 'tipsDisplay';
        tipsDisplay.id = 'tipsDisplay';
        tipsDisplay.style.padding = '15px';
        tipsDisplay.style.margin = '15px auto';
        tipsDisplay.style.maxWidth = '800px';
        tipsDisplay.style.width = '90%';
        tipsDisplay.style.backgroundColor = 'rgba(252, 187, 52, 0.1)';
        tipsDisplay.style.border = '2px solid #fcbb34';
        tipsDisplay.style.color = '#e67e22';
        tipsDisplay.style.borderRadius = '8px';
        tipsDisplay.style.fontSize = '16px';
        tipsDisplay.style.fontWeight = 'bold';
        tipsDisplay.style.textAlign = 'center';
        tipsDisplay.style.position = 'relative';
        tipsDisplay.style.overflow = 'hidden';
        tipsDisplay.style.cursor = 'pointer';
        tipsDisplay.style.boxShadow = '0 4px 6px rgba(252, 187, 52, 0.2)';
        tipsDisplay.style.maxHeight = '4em';
        tipsDisplay.style.transition = 'all 0.3s ease, max-height 0.5s ease-out';
        tipsDisplay.style.lineHeight = '1.6';
        tipsDisplay.title = '点击以查看/收起所有提示。';
        tipsDisplay.style.opacity = '1';
        tipsDisplay.style.transform = 'translateY(0)';

        // 添加脉动动画
        tipsDisplay.style.animation = 'pulsate 2s infinite';

        // 添加闪光效果
        tipsDisplay.style.backgroundImage = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)';
        tipsDisplay.style.backgroundSize = '200% 100%';
        tipsDisplay.style.animation = 'pulsate 2s infinite, shine 3s infinite';


        // 添加新的样式
        const style = document.createElement('style');
        style.textContent = `
            #tipsDisplay:hover {
                background-color: rgba(252, 187, 52, 0.2);
                transform: translateY(-2px);
            }
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            #tipsDisplay {
                animation: fadeInUp 0.5s ease-out;
            }

            @keyframes pulsate {
            0% {
                box-shadow: 0 0 0 0 rgba(252, 187, 52, 0.4);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(252, 187, 52, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(252, 187, 52, 0);
            }
        }

        @keyframes shine {
            0% {
                background-position: -100% 0;
            }
            100% {
                background-position: 100% 0;
            }
        }
    `;
        document.head.appendChild(style);

        // 提示信息列表
        const tipsList = [
            '教程：https://xiaoya.zygame1314.site。',
            '右上角下载栏支持当前页面的单个文件下载。',
            '右下角下载栏支持批量下载多个文件。',
            '脚本需要在课程首页获取到课程资源后才能正常工作。',
            '可将下载链接直接拖拽至左下角进度条区域触发下载任务。',
            '下载进度条位于左下角可折叠列表中。',
            '搜索栏支持按文件名、后缀名等多种条件进行筛选。',
            '图片和音频文件也可通过右键菜单直接选择“另存为”下载。',
            '视频需打开原始链接后，在播放器上点击右键选择“另存为”下载。',
            '控制面板提供下载方式切换，即浏览器下载和第三方下载。',
            'IDM会自动接管所有下载请求，即便选择“用浏览器下载”。',
            '文件下载历史记录默认保留三天。',
            '导出文件前需在右下角列表中勾选要导出的项目。',
            '点击已读或清空按钮后，页面会自动刷新。',
            '仅在课程首页才能获取到教师信息和课程附件。',
            '搜索功能的准确性取决于用户填写的信息完整度。',
            '启用树状图视图时，部分功能组件会被暂时禁用。',
            '仅支持Office三件套和PDF的内容详情获取。',
            '只要是小雅能预览的，理论上都能预览（反之亦然）。',
            '如有功能建议或问题反馈，请在油猴脚本页面的评论区留言。',
        ];

        let isPaused = false;
        let currentTipIndex = 0;
        let intervalId;
        let isShowingAllTips = false;

        function changeTip() {
            if (!isShowingAllTips && !isPaused) {
                currentTipIndex = (currentTipIndex + 1) % tipsList.length;
                tipsDisplay.style.transition = 'opacity 0.3s, transform 0.3s';
                tipsDisplay.style.opacity = '0';
                tipsDisplay.style.transform = 'translateX(-100%)';
            }
        }

        function updateTipDisplay() {
            tipsDisplay.innerHTML = '<i class="fas fa-lightbulb" style="margin-right: 10px;"></i>' + tipsList[currentTipIndex];
            tipsDisplay.style.opacity = '1';
            tipsDisplay.style.transform = 'translateX(0)';
        }

        tipsDisplay.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'opacity' && tipsDisplay.style.opacity === '0' && !isShowingAllTips) {
                updateTipDisplay();
            }
        });

        // 创建元素来显示所有提示
        const allTipsContainer = document.createElement('div');
        allTipsContainer.id = 'allTipsContainer';
        allTipsContainer.style.display = 'none';
        allTipsContainer.style.position = 'fixed';
        allTipsContainer.style.top = '50%';
        allTipsContainer.style.left = '50%';
        allTipsContainer.style.transform = 'translate(-50%, -50%)';
        allTipsContainer.style.backgroundColor = '#fff';
        allTipsContainer.style.padding = '30px';
        allTipsContainer.style.borderRadius = '15px';
        allTipsContainer.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        allTipsContainer.style.zIndex = '10002';
        allTipsContainer.style.maxWidth = '600px';
        allTipsContainer.style.width = '90%';
        allTipsContainer.style.maxHeight = '80vh';
        allTipsContainer.style.overflowY = 'auto';
        allTipsContainer.style.color = '#333';
        allTipsContainer.style.transition = 'none';
        allTipsContainer.style.transformOrigin = 'center center';
        // 获取提示框的位置
        function getTipsDisplayPosition() {
            const rect = tipsDisplay.getBoundingClientRect();
            return {
                left: rect.left + rect.width / 2,
                top: rect.top + rect.height / 2
            };
        }

        // 点击事件处理
        tipsDisplay.addEventListener('click', () => {
            isShowingAllTips = !isShowingAllTips;
            clearInterval(intervalId);

            if (isShowingAllTips) {
                const position = getTipsDisplayPosition();
                const startX = position.left - window.innerWidth / 2;
                const startY = position.top - window.innerHeight / 2;

                allTipsContainer.style.setProperty('--start-x', `${startX}px`);
                allTipsContainer.style.setProperty('--start-y', `${startY}px`);

                allTipsContainer.style.left = '50%';
                allTipsContainer.style.top = '50%';
                allTipsContainer.style.transform = `translate(${startX}px, ${startY}px) scale(0.7)`;
                allTipsContainer.style.opacity = '0';

                allTipsContainer.innerHTML = `
                <h2>所有提示</h2>
                ${tipsList.map((tip, index) => `
                    <div class="tip-item" style="animation: fadeInUp 0.5s ease-out ${index * 0.1}s both;">
                        <span class="tip-number">${index + 1}</span>
                        <span class="tip-text">${tip}</span>
                    </div>
                `).join('')}
                <button id="closeTipsBtn">关闭</button>
            `;

                allTipsContainer.style.display = 'block';

                // 重置并启动打开动画
                allTipsContainer.style.animation = 'none';
                void allTipsContainer.offsetWidth;
                allTipsContainer.style.animation = 'popOutToCenter 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards';
                // 添加关闭按钮事件
                document.getElementById('closeTipsBtn').addEventListener('click', closeTips);
            } else {
                closeTips();
            }
        });

        tipsDisplay.addEventListener('mouseover', () => {
            pauseTips();
            tipsDisplay.style.animation = 'pulsate 1s infinite, shine 2s infinite';
            tipsDisplay.style.transform = 'scale(1.02)';
        });

        tipsDisplay.addEventListener('mouseout', () => {
            resumeTips();
            tipsDisplay.style.animation = 'pulsate 2s infinite, shine 3s infinite';
            tipsDisplay.style.transform = 'scale(1)';
        });

        function closeTips() {
            allTipsContainer.querySelectorAll('*').forEach(el => {
                el.style.animation = 'none';
                void el.offsetWidth; // 强制重绘
            });

            allTipsContainer.style.animation = 'none';

            void allTipsContainer.offsetWidth;

            const position = getTipsDisplayPosition();
            const endX = position.left - window.innerWidth / 2;
            const endY = position.top - window.innerHeight / 2;

            allTipsContainer.style.setProperty('--end-x', `${endX}px`);
            allTipsContainer.style.setProperty('--end-y', `${endY}px`);

            // 设置关闭动画
            allTipsContainer.style.animation = 'popInToOrigin 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards';

            allTipsContainer.addEventListener('animationend', () => {
                allTipsContainer.style.display = 'none';
                isShowingAllTips = false;
                resumeTips();
            }, { once: true });
        }

        function pauseTips() {
            isPaused = true;
            clearInterval(intervalId);
            // 停止移动动画
            tipsDisplay.style.transition = 'none';
            tipsDisplay.style.transform = 'translateX(0)';
        }

        function resumeTips() {
            if (!isShowingAllTips) {
                isPaused = false;
                updateTipDisplay();
                startTipInterval();
            }
        }

        function startTipInterval() {
            clearInterval(intervalId);
            intervalId = setInterval(changeTip, 5000);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && !isShowingAllTips) {
                resumeTips();
            } else {
                pauseTips();
            }
        });

        updateTipDisplay();
        startTipInterval();
        document.body.appendChild(allTipsContainer);
        return {
            pauseTips,
            resumeTips
        };
    }

    function updateVisibility() {
        const downloadInterface = document.getElementById('downloadInterface');
        const progressBarInterface = document.getElementById('downloadsWrapperContainer');
        const downloadIconContainer = document.getElementById('download_icon_container');
        const downloadListContainer = document.getElementById('download_list');
        const videoAssistant = document.getElementById('tm-video-assistant');

        if (downloadInterface) {
            downloadInterface.style.display = downloadInterfaceCheckbox.checked ? 'block' : 'none';
        }
        if (videoAssistant) {
            videoAssistant.style.display = videoCheckbox.checked ? 'block' : 'none';
        }
        if (progressBarInterface) {
            const isVisible = progressBarCheckbox.checked;
            progressBarInterface.style.display = isVisible ? 'block' : 'none';
            isProgressBarVisible = isVisible;
        }
    }

    let isFirstLoad = true;

    // 专门更新右下角下载列表可见性的函数
    function updateDownloadListVisibility() {
        const downloadIconContainer = document.getElementById('download_icon_container');
        const downloadListContainer = document.getElementById('download_list');
        const isVisible = downloadButtonCheckbox.checked;

        if (downloadIconContainer && downloadListContainer) {
            downloadIconContainer.style.display = isVisible ? 'block' : 'none';
            downloadListContainer.style.display = isVisible ? 'block' : 'none';
            downloadListContainer.style.opacity = isVisible ? '1' : '0';
        }
    }

    // 将控件移动到对应的分类容器中
    messageContainer.appendChild(messageButtonContainer);
    downloadContainer.appendChild(downloadButtonContainer);
    exportContainer.appendChild(exportButtonContainer);
    exportContainer.appendChild(TextContainer);
    displayContainer.appendChild(checkboxesContainer);
    updateContainer.appendChild(Beautifulupdater);

    // 将分类容器添加到控制面板中
    controlPanel.appendChild(messageContainer);
    controlPanel.appendChild(downloadContainer);
    controlPanel.appendChild(exportContainer);
    controlPanel.appendChild(displayContainer);
    controlPanel.appendChild(updateContainer);

    // 默认隐藏除了第一个分类以外的容器
    downloadContainer.style.display = 'none';
    exportContainer.style.display = 'none';
    displayContainer.style.display = 'none';
    updateContainer.style.display = 'none';

    // 将控制面板和切换按钮添加到页面中
    document.body.appendChild(controlPanel);
    document.body.appendChild(toggleButton);

    updateVisibility();
    updateDownloadListVisibility();
}

// 添加全局变量存储上一次的group id
let lastGroupId = null;

function watchGroupIdChange() {
    setInterval(() => {
        const currentGroupId = getGroupIdFromUrl();
        if (currentGroupId && currentGroupId !== lastGroupId) {
            lastGroupId = currentGroupId;
            parseContent();

            // 添加更新教师信息的逻辑
            if (isEasterEggActivated) {
                getTeacherInfo(currentGroupId).then((teacherInfo) => {
                    if (teacherInfo) {
                        updateTeacherInfo(teacherInfo);
                    } else {
                        updateTeacherInfo([]); // 清空之前的教师信息
                        console.error("无法获取教师信息");
                    }
                });
            }
        }
    }, 1000);
}

// 延迟 1 秒执行所有代码
if (window.top === window.self) {
    setTimeout(() => {
        add_download_button(); // 添加下载按钮
        loadDownloadHistory(); // 加载下载历史
        initVideoAssistant(); // 初始化右侧下载组件
        initCourseCapture(); // 初始化右上角下载组件
        addDownloadsContainer(); // 添加进度条容器
        initializeControlPanel(); // 初始化控制面板
        createZipProgressIndicator(); // 初始化ZIP导出
        parseContent(); // 首次解析
        watchGroupIdChange(); // 添加URL监听

        const observer = new MutationObserver(function (mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.target.id === 'download_list') {
                    window.updateUI();
                    break;
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }, 1000);
}

// 全局变量
let previewLink;
let isDownloading = false;
let currentTitle = '';

// 主函数
function initCourseCapture() {
    const list = createDownloadInterface();
    createInitialPreviewLink();
    observeTitleChanges();
    handleXhrResponse();
}

// 监听页面标题变化
function observeTitleChanges() {
    const titleElement = document.querySelector('title');
    if (!titleElement) return;

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.target === titleElement) {
                const newTitle = document.title.split('|')[0].trim();
                if (newTitle !== currentTitle) {
                    currentTitle = newTitle;
                    handleXhrResponse();
                }
            }
        });
    });

    observer.observe(titleElement, { childList: true });
}

// 创建下载界面
function createDownloadInterface() {
    const list = document.createElement("div");
    initializeListStyles(list);
    addAnimationStyles();
    return list;
}

// 初始化列表样式
function initializeListStyles(element) {
    element.id = "downloadInterface";
    Object.assign(element.style, {
        position: "fixed",
        top: "100px",
        right: "0",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        zIndex: "9997",
        background: "linear-gradient(270deg, #ffc700, #ff8c00, #ff6500)",
        backgroundSize: "400% 400%",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
        cursor: "pointer"
    });

    element.classList.add("dynamic-gradient");
    element.innerHTML = `
        <h3 style="
            margin: 0;
            padding: 8px 12px;
            font-family: 'Microsoft YaHei', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 16px;
            font-weight: bold;
            color: #FFFFFF;
            border-radius: 8px;
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            transition: all 0.3s ease;
            text-align: center;
            letter-spacing: 1px;
        ">
            当前页面课件
        </h3>
    `;
    element.querySelector('h3').style.opacity = 0;

    addLottieAnimation(element);
    addInteractivity(element);

    document.body.appendChild(element);
}

// 添加Lottie动画
function addLottieAnimation(element) {
    const lottieContainer = document.createElement('div');
    Object.assign(lottieContainer.style, {
        position: "absolute",
        transition: "all 0.3s ease-in-out",
        width: "200%",
        height: "200%",
        left: "-60%",
        top: "-45%",
        overflow: "hidden",
        zIndex: "9998",
        pointerEvents: "none"
    });

    const lottiePlayer = document.createElement('dotlottie-player');
    lottiePlayer.setAttribute('src', "https://lottie.host/995b71c8-b7aa-45b0-bb77-94b850da5d5d/dyezqbvtia.json");
    lottiePlayer.setAttribute('background', "transparent");
    lottiePlayer.setAttribute('speed', "1");
    lottiePlayer.setAttribute('style', "width: 125%; height: 100%; position: absolute; left: -12.5%;");
    lottiePlayer.setAttribute('loop', "");
    lottiePlayer.setAttribute('autoplay', "");

    lottieContainer.appendChild(lottiePlayer);
    element.appendChild(lottieContainer);
}

// 添加交互性
function addInteractivity(element) {
    element.addEventListener("mouseover", () => {
        if (element.style.width === "50px") {
            element.style.transform = "scale(1.1)";
        }
    });
    element.addEventListener("mouseout", () => {
        if (element.style.width === "50px") {
            element.style.transform = "scale(1)";
        }
    });
    element.addEventListener("click", toggleInterfaceSize);
}

// 切换界面大小
function toggleInterfaceSize() {
    const element = document.getElementById("downloadInterface");
    const lottieContainer = element.querySelector('div');
    const h3 = element.querySelector('h3');

    if (element.style.width === "50px") {
        Object.assign(element.style, {
            width: "400px",
            height: "100px",
            padding: "8px",
            borderRadius: "10px",
            overflow: "hidden",
            transform: "scale(1)"
        });
        Object.assign(lottieContainer.style, {
            width: "70%",
            height: "100%",
            left: `${element.offsetWidth - lottieContainer.offsetWidth + 280}px`,
            top: "-20px"
        });
        h3.style.opacity = 1;
    } else {
        Object.assign(element.style, {
            width: "50px",
            height: "50px",
            padding: "0",
            borderRadius: "50%",
            overflow: "hidden",
            transform: "scale(1)",
        });
        Object.assign(lottieContainer.style, {
            width: "200%",
            height: "200%",
            left: "-60%",
            top: "-45%"
        });
        h3.style.opacity = 0;
    }
}

// 添加动画样式
function addAnimationStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes gradientBgAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .dynamic-gradient {
            animation: gradientBgAnimation 15s ease infinite;
        }
        #downloadInterface a {
            max-width: 250px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        #downloadInterface a span {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `;
    document.head.appendChild(style);
}

// 处理XHR响应
function handleXhrResponse() {
    if (isDownloading) return;
    isDownloading = true;

    const content = document.title.split('|')[0].trim();
    const urlParts = window.location.href.split('/');
    const id = urlParts[urlParts.length - 1];
    let checkCount = 0;
    const maxChecks = 10;
    const checkInterval = 500;

    function checkResources() {
        if (course_resources && Object.keys(course_resources).length > 0) {
            processResources();
        } else if (checkCount < maxChecks) {
            checkCount++;
            setTimeout(checkResources, checkInterval);
        } else {
            createInitialPreviewLink();
            showNotification('请先在课程首页获取课程资源（出现树状图后）。', 'warning');
            isDownloading = false;
        }
    }

    function processResources() {
        let quoteId = null;
        let resourceMimetype = null;
        let resourceName = null;
        for (const resourceId in course_resources) {
            if (course_resources[resourceId].id === id) {
                quoteId = course_resources[resourceId].quote_id;
                resourceMimetype = course_resources[resourceId].mimetype;
                resourceName = course_resources[resourceId].name;
                break;
            }
        }

        if (quoteId) {
            // 检查是否为视频文件
            if (isVideoFile(resourceMimetype, resourceName)) {
                createInitialPreviewLink();
                showNotification('当前资源为视频，请通过视频组件下载。', 'info');
                isDownloading = false;
                return;
            }

            const url = 'https://' + hostname + '/api/jx-oresource/cloud/file_url/' + quoteId;
            const token = getCookie();

            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                let downloadUrl = data.data.url;
                if (data.data.is_encryption) {
                    downloadUrl = decryptFileUrl(downloadUrl);
                }
                triggerNewLinkAnimation();
                updatePreviewLink(downloadUrl, content);
            })
                .catch(error => {
                console.error('获取文件下载地址失败:', error);
                createInitialPreviewLink();
                showNotification('获取文件下载地址失败X﹏X（或者根本不是个文件？）', 'error');
            });
        } else {
            createInitialPreviewLink();
        }
        isDownloading = false;
    }
    checkResources();
}

// 显示通知的函数
function showNotification(message, type = 'info', onConfirm = null, onCancel = null) {
    if (!document.getElementById('custom-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'custom-notification-styles';
        style.textContent = `
            .custom-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 16px;
                border-radius: 16px;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
                background-color: #fff;
                color: #333;
                z-index: 10000;
                transition: transform 0.3s ease, opacity 0.3s ease;
                opacity: 0;
                display: flex;
                flex-direction: column;
                font-family: 'Baloo 2', cursive, sans-serif;
                overflow: hidden;
                width: auto;
                max-width: 600px;
                transform: translateX(100%);
                border: 2px solid #333;
            }
            .custom-notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            .notification-content {
                display: flex;
                align-items: center;
                position: relative;
            }
            .notification-icon {
                font-size: 24px;
                margin-right: 12px;
                flex-shrink: 0;
                margin-top: 2px;
            }
            .notification-message {
                flex: 1;
                font-size: 15px;
                font-weight: bold;
                line-height: 1.5;
                word-break: break-word;
                padding-right: 30px;
            }
            .notification-close {
                position: absolute;
                top: 8px;
                right: 8px;
                font-size: 18px;
                cursor: pointer;
                color: #888;
                line-height: 1;
            }
            .notification-close:hover {
                color: #333;
            }
            .notification-buttons {
                margin-top: 12px;
                display: flex;
                justify-content: flex-end;
            }
            .notification-button {
                padding: 8px 16px;
                margin-left: 8px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: background-color 0.2s;
            }
            .notification-button.primary {
                background-color: #FFB400;
                color: #fff;
            }
            .notification-button.primary:hover {
                background-color: #e0a000;
            }
            .notification-button.secondary {
                background-color: #6c757d;
                color: #fff;
            }
            .notification-button.secondary:hover {
                background-color: #5a6268;
            }
            .notification-info {
                border-color: #00BFFF;
                background-color: #E0F7FF;
            }
            .notification-warning {
                border-color: #FFA500;
                background-color: #FFF5E6;
            }
            .notification-error {
                border-color: #FF6347;
                background-color: #FFEDED;
            }
            .notification-confirm {
                border-color: #32CD32;
                background-color: #E6FFE6;
            }
            .notification-countdown {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 4px;
                background-color: rgba(0, 0, 0, 0.1);
                transition: width linear;
            }
            .notification-info .notification-countdown {
                background-color: #00BFFF;
            }
            .notification-warning .notification-countdown {
                background-color: #FFA500;
            }
            .notification-error .notification-countdown {
                background-color: #FF6347;
            }
            .notification-confirm .notification-countdown {
                background-color: #32CD32;
            }
        `;
        document.head.appendChild(style);
    }

    const notifications = document.querySelectorAll('.custom-notification');
    const notificationHeight = 100;
    const spacing = 10;

    const offset = notifications.length * (notificationHeight + spacing);

    const notification = document.createElement('div');
    notification.classList.add('custom-notification', `notification-${type}`);
    notification.style.top = `${20 + offset}px`;

    const content = document.createElement('div');
    content.classList.add('notification-content');

    const icon = document.createElement('div');
    icon.classList.add('notification-icon');
    icon.innerHTML = getIcon(type);

    const messageElement = document.createElement('div');
    messageElement.classList.add('notification-message');
    messageElement.textContent = message;

    content.appendChild(icon);
    content.appendChild(messageElement);
    notification.appendChild(content);

    const closeBtn = document.createElement('span');
    closeBtn.classList.add('notification-close');
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = closeNotification;
    notification.appendChild(closeBtn);

    const notificationDuration = 4000;

    if (type !== 'confirm') {
        const countdownBar = document.createElement('div');
        countdownBar.classList.add('notification-countdown');
        countdownBar.style.width = '100%';
        countdownBar.style.transitionDuration = `${notificationDuration}ms`;
        notification.appendChild(countdownBar);

        setTimeout(() => {
            countdownBar.style.width = '0%';
        }, 10);
    }

    if (type === 'confirm') {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('notification-buttons');

        const createButton = (text, isPrimary, onClick) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.classList.add('notification-button');
            if (isPrimary) {
                button.classList.add('primary');
            } else {
                button.classList.add('secondary');
            }
            button.onclick = onClick;
            return button;
        };

        const cancelButton = createButton('取消', false, () => {
            if (onCancel) onCancel();
            closeNotification();
        });

        const confirmButton = createButton('确认', true, () => {
            if (onConfirm) onConfirm();
            closeNotification();
        });

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(confirmButton);
        notification.appendChild(buttonContainer);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    function closeNotification() {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
                const remainingNotifications = document.querySelectorAll('.custom-notification');
                remainingNotifications.forEach((notif, index) => {
                    notif.style.top = `${20 + index * (notificationHeight + spacing)}px`;
                });
            }
        }, 300);
    }

    if (type !== 'confirm') {
        setTimeout(closeNotification, notificationDuration);
    }

    function getIcon(type) {
        const svgStyles = 'width:24px;height:24px;fill:currentColor;';
        switch (type) {
            case 'info':
                return `<svg t="1726300424717" class="icon" viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg" p-id="9517" width="24" height="24">
                            <path d="M469.333333 217.6V170.666667h85.333334v46.933333c136.533333
                            21.333333 243.2 132.266667 256 273.066667V768H213.333333v-277.333333c12.8-140.8
                            119.466667-256 256-273.066667zM298.666667 682.666667h426.666666v-170.666667c0-119.466667-93.866667-213.333333-213.333333-213.333333s-213.333333
                            93.866667-213.333333 213.333333v170.666667z m85.333333 128h256v85.333333H384v-85.333333z"
                            fill="#2c2c2c" p-id="9518"></path></svg>`;
            case 'warning':
                return `<svg t="1726300459989" class="icon" viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg" p-id="10617" width="24" height="24">
                            <path d="M533.333333 170.666667L938.666667 853.333333H128l405.333333-682.666666z
                            m-256 597.333333h512l-256-448-256 448z m213.333334-298.666667h85.333333v128h-85.333333v-128z
                            m0 170.666667h85.333333v85.333333h-85.333333v-85.333333z" fill="#2c2c2c"
                            p-id="10618"></path></svg>`;
            case 'error':
                return `<svg t="1726300541103" class="icon" viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg" p-id="8245" width="24" height="24">
                            <path d="M469.333333 853.333333h85.333334v-85.333333h-85.333334v85.333333z
                            m85.333334-128V170.666667h-85.333334v554.666666h85.333334z" fill="#2c2c2c"
                            p-id="8246"></path></svg>`;
            case 'confirm':
                return `<svg t="1726300633974" class="icon" viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg" p-id="8503" width="24" height="24">
                            <path d="M490.666667 507.733333L597.333333 401.066667l59.733334 59.733333-166.4
                            166.4-119.466667-119.466667 59.733333-59.733333 59.733334 59.733333zM213.333333
                            213.333333h597.333334v597.333334H213.333333V213.333333z m85.333334 85.333334v426.666666h426.666666V298.666667H298.666667z"
                            fill="#2c2c2c" p-id="8504"></path></svg>`;
            default:
                return `<svg t="1726300692215" class="icon" viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg" p-id="8809" width="24" height="24">
                            <path d="M469.333333 597.333333v-85.333333h-42.666666v-85.333333h128v170.666666h42.666666v85.333334h-170.666666v-85.333334h42.666666z
                            m42.666667 256c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333
                            341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333
                            341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256
                            256 115.2 256 256 256z m42.666667-469.333333v85.333333h-85.333334V298.666667h85.333334z"
                            fill="#2c2c2c" p-id="8810"></path></svg>`;
        }
    }
}

// 触发新链接动画
function triggerNewLinkAnimation() {
    const downloadInterface = document.getElementById("downloadInterface");
    if (downloadInterface.style.width === "50px") {
        downloadInterface.style.animation = "newpulse 0.5s ease-in-out";
        downloadInterface.addEventListener('animationend', () => {
            downloadInterface.style.animation = '';
        }, { once: true });
    }
}

// 创建初始预览链接
function createInitialPreviewLink() {
    if (!previewLink || !document.contains(previewLink)) {
        createPreviewLink("#", "等待课件...( ＿ ＿)ノ｜");
        previewLink.removeAttribute("href");
        Object.assign(previewLink.style, {
            pointerEvents: "none",
            color: "#DDD"
        });
    }
}

// 创建或更新预览链接
function updatePreviewLink(href, content) {
    const list = document.getElementById("downloadInterface");

    if (previewLink && document.contains(previewLink)) {
        previewLink.style.animation = "fadeOut 0.5s forwards";
        previewLink.addEventListener('animationend', () => {
            list.removeChild(previewLink);
            list.removeChild(list.lastChild);
            createNewPreviewLink(href, content);
        }, { once: true });
    } else {
        createNewPreviewLink(href, content);
    }
}

function createNewPreviewLink(href, content) {
    createPreviewLink(href, content);
    previewLink.style.animation = "slideIn 0.5s forwards";
}

// 创建预览链接
function createPreviewLink(href, content) {
    previewLink = document.createElement("a");
    Object.assign(previewLink.style, {
        background: "linear-gradient(45deg, #FF8E53, #FF6B35)",
        color: "white",
        padding: "10px 15px",
        margin: "5px auto",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontSize: "14px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        maxWidth: "380px",
        width: "calc(100% - 30px)",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    });

    const downloadIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; flex-shrink: 0;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
    `;

    previewLink.innerHTML = `${downloadIcon}<span style="overflow: hidden; text-overflow: ellipsis;">${content}</span>`;

    previewLink.title = content;

    addPreviewLinkEventListeners(previewLink);

    const list = document.getElementById("downloadInterface");
    list.appendChild(previewLink);
    list.appendChild(document.createElement("br"));

    Object.assign(previewLink, {
        href: href,
        target: "_blank"
    });

    previewLink.style.animation = "slideIn 0.5s forwards";
}

// 添加预览链接事件监听器
function addPreviewLinkEventListeners(previewLink) {
    let isPressed = false;

    previewLink.addEventListener('dragstart', (event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', previewLink.dataset.downloadUrl);
        event.dataTransfer.setData('text/filename', previewLink.dataset.filename);
    });

    previewLink.addEventListener('mouseover', () => {
        if (!isPressed) {
            previewLink.style.transform = "translateY(-3px)";
            previewLink.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
            previewLink.style.filter = "brightness(1.1)";
        }
    });

    previewLink.addEventListener('mouseout', () => {
        if (!isPressed) {
            previewLink.style.transform = "translateY(0)";
            previewLink.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            previewLink.style.filter = "brightness(1)";
        }
    });

    previewLink.addEventListener('mousedown', (event) => {
        isPressed = true;
        previewLink.style.transform = "translateY(2px)";
        previewLink.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        previewLink.style.filter = "brightness(0.95)";
    });

    previewLink.addEventListener('mouseup', () => {
        isPressed = false;
        previewLink.style.transform = "translateY(-3px)";
        previewLink.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
        previewLink.style.filter = "brightness(1.1)";
    });

    previewLink.addEventListener('mouseleave', () => {
        isPressed = false;
        previewLink.style.transform = "translateY(0)";
        previewLink.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        previewLink.style.filter = "brightness(1)";
    });

    previewLink.addEventListener("click", function (event) {
        totalDownloads++;
        updateTotalProgress();

        event.preventDefault();
        event.stopPropagation();
        courseDownload(previewLink.href, previewLink.textContent.trim());
    });
}

function createToggleButton(text) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
        position: absolute;
        top: 10px;
        left: 100%;
        padding: 8px 16px;
        background-color: #fcbb34;
        color: white;
        border: none;
        border-radius: 0 8px 8px 0;
        cursor: pointer;
        white-space: nowrap;
        z-index: 10001;
        transition: all 0.3s ease;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        outline: none;
    `;

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#e5a72e';
        button.style.transform = 'translateX(5px)';
    });

    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#fcbb34';
        button.style.transform = 'translateX(0)';
    });

    button.addEventListener('mousedown', () => {
        button.style.transform = 'translateX(2px) scale(0.98)';
    });

    button.addEventListener('mouseup', () => {
        button.style.transform = 'translateX(5px) scale(1)';
    });

    return button;
}

function createDebuggerToggleButton(text) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 0 0 8px 8px;
        cursor: pointer;
        white-space: nowrap;
        z-index: 10003;
        transition: background-color 0.3s ease;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        outline: none;
    `;

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#45a049';
    });

    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#4CAF50';
    });

    return button;
}

// 切换容器的显示/隐藏
function toggleContainer(container, button) {
    const isHidden = container.style.left === '-400px';
    container.style.left = isHidden ? '0' : '-400px';
    button.style.backgroundColor = isHidden ? '#e69b00' : '#fcbb34';
    button.textContent = isHidden ? '关闭' : button.getAttribute('data-original-text');
}

// 创建并设置教师信息容器
function createTeacherInfoContainer() {
    const container = document.createElement("div");
    container.id = "teacherInfoContainer";
    container.style.cssText = `
        position: fixed;
        top: 30vh;
        left: -400px;
        z-index: 10000;
        background-color: #FFF3E0;
        border: 1px solid #FFD180;
        border-radius: 0 8px 8px 0;
        padding: 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        width: 400px;
        height: 130px;
        max-height: 60vh;
        transition: all 0.3s ease;
        font-weight: bold;
    `;
    const scrollContent = document.createElement('div');
    scrollContent.style.cssText = `
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        font-weight: bold;
    `;
    scrollContent.id = "teacherInfoContent";
    scrollContent.innerHTML = `
        <div class="loading-message" style="text-align: center; padding: 20px;">
            <p style="margin-bottom: 10px; font-size: 16px;">
                等待获取教师信息...
            </p>
            <div class="loading-dots">
                <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
            </div>
        </div>
    `;
    const toggleButton = createToggleButton("教师信息");
    toggleButton.setAttribute('data-original-text', "教师信息");
    toggleButton.style.left = '400px';
    toggleButton.style.fontWeight = 'bold';
    toggleButton.onclick = (e) => {
        e.stopPropagation();
        toggleContainer(container, toggleButton);
    };
    container.appendChild(scrollContent);
    container.appendChild(toggleButton);
    document.body.appendChild(container);

    // 添加样式
    const teacher_style = document.createElement('style');
    teacher_style.textContent = `
        @keyframes blink {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
        }
        .loading-dots .dot {
            animation: blink 1.4s infinite;
            animation-fill-mode: both;
            font-size: 24px;
        }
        .loading-dots .dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .loading-dots .dot:nth-child(3) {
            animation-delay: 0.4s;
        }
    `;
    document.head.appendChild(teacher_style);
}

function updateTeacherInfo(teacherInfo) {
    const content = document.getElementById("teacherInfoContent");
    if (!content) return;

    if (teacherInfo && teacherInfo.length > 0) {
        content.innerHTML = `
            <h3 class="title" style="font-weight: bold; margin-bottom: 15px; padding-left: 10px;">教师信息</h3>
            <div class="teacher-list" style="font-weight: bold;">
                ${teacherInfo.map((teacher) => `
                    <div class="teacher-item" style="margin-bottom: 10px; padding: 10px; background-color: #FFE0B2; border-radius: 5px;">
                        <div class="teacher-name" style="margin-bottom: 5px;">${teacher.nickname}</div>
                        <div class="teacher-number" style="color: #757575;">${teacher.studentNumber}</div>
                    </div>
                `).join("")}
            </div>
        `;
    } else {
        content.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p style="color: #757575; font-weight: bold; margin-bottom: 10px;">
                    暂无教师信息或尚未打开课程
                </p>
                <p style="color: #999; font-size: 14px;">
                    请确保在课程页面中使用此功能
                </p>
            </div>
        `;
    }
}

// 绕过反调试按钮
function createDebuggerDisablerContainer() {
    const container = document.createElement('div');
    container.id = "debuggerDisablerContainer";
    container.style.cssText = `
        position: fixed;
        top: -280px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10002;
        background-color: #1a1a1a;
        border: 2px solid #ff6600;
        border-radius: 0 0 10px 10px;
        padding: 20px;
        box-shadow: 0 5px 15px rgba(255, 102, 0, 0.3);
        width: 300px;
        height: 220px;
        transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        color: #ff6600;
    `;

    content.innerHTML = `
        <h3 style="margin: 0; color: #ff6600; text-align: center; font-size: 18px; letter-spacing: 2px;">反调试禁用器</h3>
        <div style="width: 100%; height: 2px; background: linear-gradient(to right, #1a1a1a, #ff6600, #1a1a1a);"></div>
        <p style="text-align: center; margin: 10px 0; font-size: 14px; font-weight: bold; color: #cccccc;">禁用小雅反调试措施</p>
        <button id="disableDebuggerBtn" style="
            background-color: #1a1a1a;
            border: 2px solid #ff6600;
            color: #ff6600;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 4px 2px;
            cursor: pointer;
            transition: all 0.3s ease;
            outline: none;
            letter-spacing: 1px;
        ">⚡点击禁用⚡</button>
    `;

    container.appendChild(content);

    const toggleButton = document.createElement('button');
    toggleButton.id = "debuggerToggleButton"
    toggleButton.textContent = "🔑 打开";
    toggleButton.style.cssText = `
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 16px;
        background-color: #ff6600;
        color: #1a1a1a;
        border: none;
        border-radius: 0 0 5px 5px;
        cursor: pointer;
        z-index: 10003;
        transition: all 0.3s ease;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 1px;
    `;

    document.body.appendChild(toggleButton);
    document.body.appendChild(container);

    let isOpen = false;

    toggleButton.onclick = (e) => {
        e.stopPropagation();
        isOpen = !isOpen;

        if (isOpen && !localStorage.getItem('debuggerDisablerShownWarning')) {
            // 首次打开组件时显示警告
            showNotification("警告⚠️：此功能可能会影响网站的正常运行，请谨慎使用！", 'warning');
            localStorage.setItem('debuggerDisablerShownWarning', 'true');
        }

        container.style.top = isOpen ? '0' : '-280px';
        toggleButton.style.backgroundColor = isOpen ? '#ff8533' : '#ff6600';
        toggleButton.textContent = isOpen ? "🔒 关闭" : "🔑 打开";
        toggleButton.style.top = isOpen ? '220px' : '0';
    };

    toggleButton.addEventListener('mouseover', () => {
        toggleButton.style.backgroundColor = '#ff8533';
    });

    toggleButton.addEventListener('mouseout', () => {
        toggleButton.style.backgroundColor = isOpen ? '#ff8533' : '#ff6600';
    });

    const disableDebuggerBtn = document.getElementById('disableDebuggerBtn');
    disableDebuggerBtn.addEventListener('mouseover', () => {
        disableDebuggerBtn.style.backgroundColor = '#ff6600';
        disableDebuggerBtn.style.color = '#1a1a1a';
    });
    disableDebuggerBtn.addEventListener('mouseout', () => {
        disableDebuggerBtn.style.backgroundColor = '#1a1a1a';
        disableDebuggerBtn.style.color = '#ff6600';
    });
    disableDebuggerBtn.addEventListener('click', function () {
        (function () {
            'use strict';
            Function.prototype.constructor = function () {
                return function () { };
            };
        })();
        this.textContent = '反调试已禁用';
        this.style.backgroundColor = '#1a1a1a';
        this.style.color = '#00ff00';
        this.style.borderColor = '#00ff00';
        this.disabled = true;
        this.style.cursor = 'default';

        // 添加禁用后的动画效果
        container.style.animation = 'glitch 0.5s';
    });

    // 添加动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitch {
            0% { transform: translateX(-50%) translate(2px, 2px); }
            25% { transform: translateX(-50%) translate(-2px, -2px); }
            50% { transform: translateX(-50%) translate(2px, -2px); }
            75% { transform: translateX(-50%) translate(-2px, 2px); }
            100% { transform: translateX(-50%) translate(0, 0); }
        }
    `;
    document.head.appendChild(style);

    return { container, toggleButton };
}

let teacherInfoRequestTimeout;

// 获取教师信息
async function getTeacherInfo(groupId) {
    // 清除之前的超时
    if (teacherInfoRequestTimeout) {
        clearTimeout(teacherInfoRequestTimeout);
    }

    return new Promise((resolve) => {
        teacherInfoRequestTimeout = setTimeout(async () => {
            if (!course_resources || Object.keys(course_resources).length === 0) {
                console.error("无法获取课程资源信息");
                resolve(null);
                return;
            }

            const token = getCookie();
            const apiUrl = `https://${hostname}/api/jx-iresource/statistics/group/visit`;

            const requestBody = {
                group_id: groupId,
                role_type: "normal"
            };

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`API 请求失败：${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                const teachers = data.data.teachers;

                resolve(teachers.map((teacher) => ({
                    nickname: teacher.nickname,
                    studentNumber: teacher.studentNumber,
                })));
            } catch (error) {
                console.error("获取教师信息时出错：", error);
                resolve(null);
            }
        }, 500);
    });
}

function createUserSearchContainer() {
    const container = document.createElement('div');
    container.id = "userSearchContainer";
    container.style.cssText = `
        position: fixed;
        top: 45vh;
        left: -400px;
        z-index: 9999;
        background-color: #FFF3E0;
        border: 1px solid #FFD180;
        border-radius: 0 8px 8px 0;
        padding: 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        width: 400px;
        height: 150px;
        transition: all 0.3s ease;
        font-weight: bold;
    `;

    const scrollContent = document.createElement('div');
    scrollContent.style.cssText = `
        height: 100%;
        overflow-y: auto;
    `;

    scrollContent.innerHTML = `
        <input type="text" id="userSearchInput" placeholder="输入电话/一卡通号" class="search-teacher-input" style="
            font-weight: normal;
            width: 70%;
            padding: 10px 15px;
            margin-right: 10px;
            border: 2px solid #FFD180;
            border-radius: 20px;
            font-size: 16px;
            color: #333;
            outline: none;
            transition: all 0.3s ease;
        ">
        <button id="userSearchButton" class="search-teacher-button" style="
            font-weight: bold;
            padding: 10px 20px;
            cursor: pointer;
            background-color: #FFD180;
            color: #333;
            border: none;
            border-radius: 20px;
            font-size: 16px;
            transition: all 0.3s ease;
        ">搜索</button>
        <div id="userSearchResults" class="search-teacher-results" style="
            margin-top: 15px;
            font-weight: normal;
        ">
            <p class="search-teacher-hint">请输入电话或一卡通号进行搜索</p>
        </div>
    `;

    const toggleButton = createToggleButton("用户搜索");
    toggleButton.setAttribute('data-original-text', "用户搜索");
    toggleButton.style.left = '400px';
    toggleButton.style.fontWeight = 'bold';
    toggleButton.onclick = (e) => {
        e.stopPropagation();
        toggleContainer(container, toggleButton);

        // 检查是否是第一次打开
        if (!localStorage.getItem('userSearchWarningShown')) {
            showUserSearchWarning();
            localStorage.setItem('userSearchWarningShown', 'true');
        }
    };

    container.appendChild(scrollContent);
    container.appendChild(toggleButton);
    document.body.appendChild(container);

    setTimeout(() => {
        const input = document.getElementById("userSearchInput");
        if (input) {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#FFA000';
                input.style.boxShadow = '0 0 5px rgba(255, 160, 0, 0.5)';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = '#FFD180';
                input.style.boxShadow = 'none';
            });

            // 添加回车键搜索功能
            input.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    await performSearch();
                }
            });
        }

        const button = document.getElementById("userSearchButton");
        if (button) {
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#FFA000';
            });
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#FFD180';
            });
            button.addEventListener('click', performSearch);
        }
    }, 0);

    // 添加样式
    const search_style = document.createElement('style');
    search_style.textContent = `
        #userSearchInput::placeholder {
            color: #999;
            opacity: 1;
            transition: opacity 0.3s ease;
        }
        #userSearchInput:focus::placeholder {
            opacity: 0.5;
        }
    `;
    document.head.appendChild(search_style);
}

// 执行搜索的函数
async function performSearch() {
    const input = document.getElementById("userSearchInput");
    const resultsDiv = document.getElementById("userSearchResults");
    if (input && resultsDiv) {
        const username = input.value.trim();
        if (username.length > 0) {
            const userInfo = await searchUser(username);
            displayUserInfo(userInfo, resultsDiv);
        } else {
            resultsDiv.innerHTML = '<p class="search-teacher-hint">请输入用户名或学号进行搜索</p>';
        }
    }
}

// 添加显示警告的函数
function showUserSearchWarning() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10001;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);

    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #FFF3E0;
        border: none;
        border-radius: 12px;
        padding: 40px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10002;
        max-width: 600px;
        width: 90%;
        text-align: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    warningDiv.innerHTML = `
        <h3 style="
            color: #E65100;
            margin-top: 0;
            font-size: 28px;
            margin-bottom: 25px;
            font-weight: bold;
        ">⚠️ 警告</h3>
        <p style="
            color: #555;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 30px;
        ">请注意：用户搜索功能仅供学习和研究使用。不当用途可能违反相关法律法规和学校政策。请遵守相关规定，尊重他人隐私。</p>
        <button id="warningCloseBtn" style="
            background-color: #FF9800;
            border: none;
            color: white;
            padding: 14px 28px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 18px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 50px;
            transition: background-color 0.3s ease;
            outline: none;
        ">我已了解</button>
    `;
    document.body.appendChild(warningDiv);

    const closeBtn = document.getElementById('warningCloseBtn');
    closeBtn.onmouseover = () => {
        closeBtn.style.backgroundColor = '#F57C00';
    };
    closeBtn.onmouseout = () => {
        closeBtn.style.backgroundColor = '#FF9800';
    };
    closeBtn.onclick = () => {
        fadeOutAndRemove(overlay);
        fadeOutAndRemove(warningDiv);
    };

    // 淡入效果
    setTimeout(() => {
        overlay.style.opacity = '1';
        warningDiv.style.opacity = '1';
    }, 10);
}

function fadeOutAndRemove(element) {
    element.style.opacity = '0';
    element.addEventListener('transitionend', function handler() {
        element.removeEventListener('transitionend', handler);
        element.parentNode.removeChild(element);
    });
}

// 搜索用户函数
async function searchUser(username) {
    const token = getCookie();
    const apiUrl = `https://${hostname}/api/jx-iresource/auth/user/info?username=${username}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.data;
        } else {
            throw new Error(`API 请求失败：${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error("搜索用户时出错：", error);
        return null;
    }
}

// 显示用户信息函数
function displayUserInfo(userInfo, resultsDiv) {
    if (userInfo && userInfo.length > 0) {
        const user = userInfo[0];
        resultsDiv.innerHTML = `
            <div class="user-info">
                <p><strong>用户名:</strong> ${user.loginName || "未知"}</p>
                <p><strong>昵称:</strong> ${user.nickname || "未知"}</p>
                <p><strong>姓名:</strong> ${user.realname || "未知"}</p>
                <p><strong>性别:</strong> ${user.sex || "未知"}</p>
                <p><strong>邮箱:</strong> ${user.email || "未知"}</p>
                <p><strong>电话:</strong> ${user.phone || "未知"}</p>
                <p><strong>学校:</strong> ${user.schoolName || "未知"}</p>
                <p><strong>QQ:</strong> ${user.qq || "未知"}</p>
            </div>
        `;
    } else {
        resultsDiv.innerHTML = '<p class="no-data">未找到该用户</p>';
    }
}

// 初始化函数
function initContainers() {
    createTeacherInfoContainer();
    createUserSearchContainer();
    createDebuggerDisablerContainer();
}

// 初始化 Konami 代码序列
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

// 监听键盘事件
document.addEventListener('keydown', (e) => {
    // 如果彩蛋已经被激活，则直接返回
    if (isEasterEggActivated) {
        return;
    }

    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// 激活彩蛋功能
function activateEasterEgg() {
    if (isEasterEggActivated) {
        showNotification("彩蛋已激活！别再戳啦！", 'info');
        return;
    }

    console.log("彩蛋已激活！");
    initContainers();
    interceptAndModifyRequests();
    let groupId = null;
    for (const resourceId in course_resources) {
        if (course_resources[resourceId].group_id) {
            groupId = course_resources[resourceId].group_id;
            break;
        }
    }

    if (groupId) {
        getTeacherInfo(groupId).then((teacherInfo) => {
            if (teacherInfo) {
                updateTeacherInfo(teacherInfo);
            } else {
                console.error("无法获取老师信息");
            }
        });
    } else {
        console.warn("无法找到包含 group_id 属性的资源，无法获取老师信息");
    }

    isEasterEggActivated = true;
}

function initVideoAssistant() {
    const container = document.createElement('div');
    container.id = 'tm-video-assistant';
    container.innerHTML = `
        <div id="tm-assistant-icon">
            <dotlottie-player
                src="https://lottie.host/e0b82942-db68-44a1-b729-df62ceb4c75e/bBXqj2oy9a.json"
                background="transparent"
                speed="1"
                style="width: 50px; height: 50px;"
                loop
                autoplay
            ></dotlottie-player>
        </div>
        <div id="tm-assistant-content">
            <div id="tm-header">
                <h3>视频源检测</h3>
                <button id="tm-download-guide-button" class="tm-button">
                    <span class="tm-button-icon">📽️</span>
                    视频下载指南
                </button>
            </div>
            <div id="tm-video-title-container" class="tm-info-container">
                <div class="tm-info-label">视频标题:</div>
                <div id="tm-video-title" class="tm-info-content">等待获取视频标题...</div>
            </div>
            <div id="tm-video-src-container" class="tm-info-container">
                <div class="tm-info-label">视频链接:</div>
                <div id="tm-video-src" class="tm-info-content">等待检测视频源...</div>
            </div>
            <div id="tm-button-container">
                <button id="tm-copy-src" class="tm-button">
                    <span class="tm-button-icon">📋</span>
                    <strong>复制链接</strong>
                </button>
                <button id="tm-open-src" class="tm-button">
                    <span class="tm-button-icon">🔗</span>
                    <strong>打开链接</strong>
                </button>
            </div>
            <p id="tm-status"></p>
        </div>
    `;
    document.body.appendChild(container);

    // 设置样式
    const style = document.createElement('style');
    style.textContent = `
        #tm-video-assistant {
            position: fixed;
            top: 320px;
            right: 0;
            width: 50px;
            height: 50px;
            background: linear-gradient(270deg, #ffc700, #ff8c00, #ff6500);
            background-size: 600% 600%;
            animation: gradientBgAnimation 15s ease infinite;
            border-radius: 25px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            color: #333;
            overflow: hidden;
            z-index: 9999;
            transition: all 0.3s ease-in-out;
            cursor: pointer;
        }
        #tm-video-assistant:not(.expanded):hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(0,0,0,0.2);
        }
        @keyframes gradientBgAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        #tm-assistant-icon {
            width: 50px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform 0.3s ease;
        }
        #tm-assistant-content {
            display: none;
            padding: 20px;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            box-sizing: border-box;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        #tm-video-assistant.expanded #tm-assistant-content {
            opacity: 1;
        }
        #tm-video-assistant h3 {
            margin: 0 0 10px 0;
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }
        .tm-info-container {
            width: 100%;
            height: 80px;
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
            transition: all 0.3s ease;
            box-sizing: border-box;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        #tm-video-title-container {
            background: rgba(255, 255, 255, 0.3);
            border-left: 4px solid #6495ff;
        }
        #tm-video-src-container {
            background: rgba(255, 255, 255, 0.2);
            border-left: 4px solid #ff2201;
        }
        .tm-info-label {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #555;
        }
        .tm-info-content {
            font-size: 14px;
            font-weight: bold;
            word-break: break-all;
            white-space: pre-wrap;
            flex-grow: 1;
            height: 50px;
            overflow-y: auto;
        }
        .tm-info-content::-webkit-scrollbar {
            width: 6px;
        }
        .tm-info-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
        }
        .tm-info-content::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }
        #tm-button-container {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-top: 15px;
        }
        .tm-button {
            background: rgba(255, 140, 0, 0.8);
            border: none;
            color: white;
            padding: 8px 15px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            width: 48%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .tm-button:hover {
            background: rgba(255, 215, 0, 0.9);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .tm-button-icon {
            margin-right: 5px;
            font-size: 16px;
        }
        #tm-status {
            font-size: 12px;
            margin-top: 10px;
            font-style: italic;
            width: 100%;
            text-align: center;
            color: #555;
        }
        #tm-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 15px;
        }
        #tm-download-guide-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #4CAF50;
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1;
        }
        #tm-download-guide-button:hover {
            background: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        #tm-download-guide-button .tm-button-icon {
            margin-right: 4px;
            font-size: 14px;
        }

        @keyframes flash {
            0% { opacity: 1; }
            50% { opacity: 0.2; }
            100% { opacity: 1; }
        }

        .flash-animation {
            animation: flash 1s ease-in-out;
        }
    `;
    document.head.appendChild(style);

    let lastUrl = location.href;
    let isExpanded = false;
    let initialTop = null;
    let detectInterval;

    async function getVideoInfo(maxAttempts = 10, interval = 1000) {
        const assistant = document.getElementById('tm-video-assistant');

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const playerDiv = document.querySelector('div.prism-player');
            if (playerDiv) {
                const videoElement = playerDiv.querySelector('video');
                if (videoElement && videoElement.src) {
                    const newSrc = videoElement.src;
                    const content = document.title.split('|')[0].trim();
                    const oldSrc = document.getElementById('tm-video-src').textContent;

                    if (newSrc !== oldSrc) {
                        document.getElementById('tm-video-src').textContent = newSrc;
                        document.getElementById('tm-video-title').textContent = content;

                        if (!isExpanded) {
                            assistant.style.animation = "newpulse 0.5s ease-in-out";
                            setTimeout(() => {
                                assistant.style.animation = "";
                            }, 1000);
                        }
                    }
                    return { src: newSrc, title: content };
                }
            }
            await new Promise(resolve => setTimeout(resolve, interval));
        }

        document.getElementById('tm-video-src').textContent = '未找到视频源';
        document.getElementById('tm-video-title').textContent = '未找到视频标题';
        return null;
    }

    function checkUrlAndExecute() {
        if (lastUrl !== location.href) {
            lastUrl = location.href;
            getVideoInfo();
        }
    }

    document.getElementById('tm-copy-src').addEventListener('click', function (e) {
        e.stopPropagation();
        const src = document.getElementById('tm-video-src').textContent;
        if (src && src !== '等待检测视频源...' && src !== '未找到视频源') {
            navigator.clipboard.writeText(src).then(() => {
                showStatus('链接已复制！');
            }).catch(err => {
                console.error('复制失败:', err);
                showStatus('复制失败，请重试');
            });
        } else {
            showStatus('暂无可复制的链接');
        }
    });

    document.getElementById('tm-open-src').addEventListener('click', function (e) {
        e.stopPropagation();
        const src = document.getElementById('tm-video-src').textContent;
        if (src && src !== '等待检测视频源...' && src !== '未找到视频源') {
            window.open(src, '_blank');
            showStatus('已打开（小心音量爆炸哦~）');
        } else {
            showStatus('暂无可打开的链接');
        }
    });

    function addGuideButtonListener() {
        const guideButton = document.getElementById('tm-download-guide-button');
        if (guideButton) {
            guideButton.addEventListener('click', function (e) {
                e.stopPropagation();
                showDownloadGuide();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addGuideButtonListener);
    } else {
        addGuideButtonListener();
    }

    function showDownloadGuide() {
        if (guideModal) {
            closeGuide();
            return;
        }
        guideModal = document.createElement('div');
        guideModal.id = 'tm-guide-modal';
        guideModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: linear-gradient(135deg, #FFF9C4, #FFE082);
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(255, 152, 0, 0.3), 0 0 0 1px rgba(255, 152, 0, 0.1);
            z-index: 10000;
            max-width: 90%;
            width: 500px;
            color: #5D4037;
            opacity: 0;
            transition: all 0.3s ease-in-out;
            overflow: hidden;
        `;

        // 添加动态背景
        const background = document.createElement('div');
        background.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #FFF9C4, #FFE082);
            z-index: -1;
            animation: gradientBG 15s ease infinite;
        `;
        guideModal.appendChild(background);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradientBG {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            .step-icon {
                width: 24px;
                height: 24px;
            }
            .step-content {
                display: block;
            }
        `;
        document.head.appendChild(style);

        const keywords = ['打开', '新标签页', '三点', '下载', '右键', '另存为'];
        const highlightKeywords = (text) => {
            return keywords.reduce((acc, keyword) => {
                return acc.replace(new RegExp(keyword, 'g'), `<strong style="color: #E65100; font-weight: 600;">${keyword}</strong>`);
            }, text);
        };

        const steps = [
            {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>',
                text: '打开视频链接。'
            },
            {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play-circle"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>',
                text: '在新标签页中找到播放器。'
            },
            {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>',
                text: '点击右下角"三点"图标。'
            },
            {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
                text: '选择下载选项。'
            },
            {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
                text: '如果没有下载选项，尝试右键点击视频并选择"将视频另存为……"。'
            }
        ];

        guideModal.innerHTML = `
        <h2 style="margin-top: 0; color: #FF8F00; text-align: center; font-size: 28px; font-weight: 600;">如何下载视频</h2>
        <ol style="padding-left: 0; counter-reset: item; list-style-type: none;">
            ${steps.map((step, index) => `
                <li style="margin-bottom: 20px; position: relative; padding-left: 70px; line-height: 1.6; opacity: 0; transform: translateY(20px); transition: all 0.5s ease; overflow: hidden; min-height: 40px;">
                    <span style="position: absolute; left: 0; top: 0; background: #FF8F00; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 2px 5px rgba(255, 143, 0, 0.3);">${index + 1}</span>
                    <span class="step-icon" style="position: absolute; left: 35px; top: 2px;">${step.icon}</span>
                    <span class="step-content" style="display: block; margin-left: 10px;">${highlightKeywords(step.text)}</span>
                </li>
            `).join('')}
        </ol>
            <button id="close-guide" style="
                padding: 12px 25px;
                background: #FF8F00;
                color: white;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-size: 18px;
                font-weight: 600;
                display: block;
                margin: 25px auto 0;
                transition: all 0.3s ease;
                box-shadow: 0 4px 6px rgba(255, 143, 0, 0.2);
            ">我知道了</button>
        `;
        document.body.appendChild(guideModal);

        const closeButton = document.getElementById('close-guide');
        closeButton.addEventListener('click', closeGuide);

        closeButton.addEventListener('mouseover', () => {
            closeButton.style.background = '#F57C00';
            closeButton.style.transform = 'translateY(-2px)';
            closeButton.style.boxShadow = '0 6px 8px rgba(255, 143, 0, 0.3)';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.background = '#FF8F00';
            closeButton.style.transform = 'translateY(0)';
            closeButton.style.boxShadow = '0 4px 6px rgba(255, 143, 0, 0.2)';
        });
        // 添加打开动画
        setTimeout(() => {
            guideModal.style.opacity = '1';
            guideModal.style.transform = 'translate(-50%, -50%) scale(1)';

            // 逐步显示每个步骤
            const steps = guideModal.querySelectorAll('li');
            steps.forEach((step, index) => {
                setTimeout(() => {
                    step.style.opacity = '1';
                    step.style.transform = 'translateY(0)';
                }, 200 * (index + 1));
            });
        }, 50);
    }

    function closeGuide() {
        if (!guideModal) return;

        guideModal.style.opacity = '0';
        guideModal.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(guideModal);
            guideModal = null;
        }, 300);
    }

    function showStatus(message) {
        const statusElement = document.getElementById('tm-status');
        statusElement.textContent = message;
        statusElement.style.opacity = '1';
        setTimeout(() => {
            statusElement.style.opacity = '0';
        }, 5000);
    }

    // 切换展开/收起状态
    document.getElementById('tm-video-assistant').addEventListener('click', function () {
        if (!initialTop) {
            initialTop = this.offsetTop;
        }

        const centerY = initialTop + 25;
        const lottiePlayer = this.querySelector('dotlottie-player');

        if (isExpanded) {
            this.style.width = '50px';
            this.style.height = '50px';
            this.style.borderRadius = '25px';
            this.style.top = `${initialTop}px`;
            document.getElementById('tm-assistant-content').style.display = 'none';
            lottiePlayer.style.transform = 'rotate(0deg)';
            this.classList.remove('expanded');
            this.style.animation = '';
        } else {
            const expandedHeight = 420;
            this.style.width = '380px';
            this.style.height = `${expandedHeight}px`;
            this.style.borderRadius = '15px';
            this.style.top = `${centerY - expandedHeight / 5.5}px`;
            document.getElementById('tm-assistant-content').style.display = 'flex';
            lottiePlayer.style.transform = 'rotate(360deg)';
            this.classList.add('expanded');
        }
        isExpanded = !isExpanded;
    });

    getVideoInfo();
    detectInterval = setInterval(checkUrlAndExecute, 1000);

    window.addEventListener('popstate', checkUrlAndExecute);
}

function interceptAndModifyRequests() {
    initRequestInterceptor();
    initUIManager();
}

function initRequestInterceptor() {
    monitorFetch();
    monitorXHR();
}

const urlPattern = /https:\/\/.*\.ai-augmented\.com\/api\/jx-oresource\/cloud\/file_url\/\d+\?.*encryption_status=1(\&.*)?$/;

function monitorFetch() {
    const originalFetch = window.fetch;
    window.fetch = function () {
        let fetchArguments = Array.from(arguments);
        let requestInfo = fetchArguments[0];

        let url;
        if (typeof requestInfo === 'string') {
            url = requestInfo;
        } else if (requestInfo instanceof Request) {
            url = requestInfo.url;
        }

        if (url && url.match(urlPattern)) {
            return originalFetch.apply(this, fetchArguments)
                .then(response => {
                const responseClone = response.clone();
                responseClone.json().then(responseData => {
                    console.log('监控的 fetch 请求响应:', responseData);
                    handleResponse(responseData);
                }).catch(e => {
                    console.error('解析 fetch 响应失败:', e);
                });
                return response;
            });
        } else {
            return originalFetch.apply(this, fetchArguments);
        }
    };
}

function monitorXHR() {
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        if (url && url.match(urlPattern)) {
            this._monitor = true;
        } else {
            this._monitor = false;
        }

        this._url = url;
        this._method = method;
        this._async = async;
        this._requestHeaders = {};

        return originalXHROpen.apply(this, [method, url, async, user, password]);
    };

    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        this._requestHeaders[header] = value;
        originalXHRSetRequestHeader.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        if (this._monitor) {
            this.addEventListener('load', function () {
                try {
                    if (this.responseType === '' || this.responseType === 'text') {
                        const responseData = JSON.parse(this.responseText);
                        console.log('监控的 XHR 请求响应 (text):', responseData);
                        handleResponse(responseData);
                    } else if (this.responseType === 'blob') {
                        blobToText(this.response).then(text => {
                            const responseData = JSON.parse(text);
                            console.log('监控的 XHR 请求响应 (blob):', responseData);
                            handleResponse(responseData);
                        }).catch(e => {
                            console.error('读取 blob 响应失败:', e);
                        });
                    } else {
                        console.warn('未处理的 responseType:', this.responseType);
                    }
                } catch (e) {
                    console.error('解析响应失败:', e);
                }
            });
        }
        return originalXHRSend.apply(this, arguments);
    };
}

function blobToText(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(blob);
    });
}

function handleResponse(responseData) {
    if (responseData && responseData.data && responseData.data.url) {
        let url = responseData.data.url;
        if (responseData.data.is_encryption) {
            url = decryptFileUrl(url);
        }
        showDownloadLink(url);
    }
}

function initUIManager() {
    createFloatingButton();
    createLinkContainer();
}

let floatingButton;
let linkDisplayContainer;
let isExpanded = false;

function createFloatingButton() {
    if (!floatingButton) {
        floatingButton = document.createElement('div');
        floatingButton.id = 'floating-button';
        floatingButton.style.position = 'fixed';
        floatingButton.style.bottom = '5px';
        floatingButton.style.left = '5px';
        floatingButton.style.width = '60px';
        floatingButton.style.height = '60px';
        floatingButton.style.background = 'linear-gradient(270deg, #f7b733, #ff9900, #ffb347)';
        floatingButton.style.backgroundSize = '400% 400%';
        floatingButton.style.borderRadius = '50%';
        floatingButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        floatingButton.style.cursor = 'pointer';
        floatingButton.style.zIndex = '9999';
        floatingButton.style.display = 'flex';
        floatingButton.style.justifyContent = 'center';
        floatingButton.style.alignItems = 'center';
        floatingButton.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        floatingButton.style.overflow = 'hidden';
        floatingButton.style.animation = 'flowingGradient 5s ease infinite';

        const buttonIcon = document.createElement('div');
        buttonIcon.innerHTML = `
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
        `;
        buttonIcon.style.transition = 'transform 0.4s ease';
        floatingButton.appendChild(buttonIcon);

        floatingButton.addEventListener('click', toggleLinkContainer);
        floatingButton.addEventListener('mouseenter', () => {
            if (!isExpanded) {
                floatingButton.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        floatingButton.addEventListener('mouseleave', () => {
            if (!isExpanded) {
                floatingButton.style.transform = 'scale(1) rotate(0deg)';
            }
        });

        document.body.appendChild(floatingButton);
    }
}

function createLinkContainer() {
    if (!linkDisplayContainer) {
        linkDisplayContainer = document.createElement('div');
        linkDisplayContainer.id = 'download-link-container';
        linkDisplayContainer.style.position = 'fixed';
        linkDisplayContainer.style.bottom = '5px';
        linkDisplayContainer.style.left = '5px';
        linkDisplayContainer.style.width = '0';
        linkDisplayContainer.style.height = '0';
        linkDisplayContainer.style.background = 'linear-gradient(270deg, #f7b733, #ff9900, #ffb347)';
        linkDisplayContainer.style.backgroundSize = '400% 400%';
        linkDisplayContainer.style.borderRadius = '30px';
        linkDisplayContainer.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
        linkDisplayContainer.style.zIndex = '9998';
        linkDisplayContainer.style.overflow = 'hidden';
        linkDisplayContainer.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        linkDisplayContainer.style.opacity = '0';
        linkDisplayContainer.style.display = 'flex';
        linkDisplayContainer.style.flexDirection = 'column';
        linkDisplayContainer.style.justifyContent = 'center';
        linkDisplayContainer.style.alignItems = 'center';
        linkDisplayContainer.style.padding = '0';
        linkDisplayContainer.style.color = '#ffffff';
        linkDisplayContainer.style.animation = 'flowingGradient 5s ease infinite';

        const title = document.createElement('h3');
        title.innerText = '备用下载';
        title.style.margin = '5px 0 5px 0';
        title.style.opacity = '0';
        title.style.fontWeight = 'bold';
        title.style.transition = 'opacity 0.3s ease 0.2s';
        linkDisplayContainer.appendChild(title);

        const description = document.createElement('p');
        description.innerText = '点击按钮获取链接';
        description.style.margin = '0 0 10px 0';
        description.style.fontSize = '14px';
        description.style.opacity = '0';
        description.style.fontWeight = 'bold';
        description.style.transition = 'opacity 0.3s ease 0.3s';
        linkDisplayContainer.appendChild(description);

        document.body.appendChild(linkDisplayContainer);
    }
}

function toggleLinkContainer() {
    isExpanded = !isExpanded;

    if (isExpanded) {
        linkDisplayContainer.style.width = '300px';
        linkDisplayContainer.style.height = '130px';
        linkDisplayContainer.style.borderRadius = '10px';
        linkDisplayContainer.style.opacity = '1';
        linkDisplayContainer.style.padding = '20px';

        setTimeout(() => {
            linkDisplayContainer.querySelectorAll('h3, p, #emergency-download-button').forEach(el => {
                el.style.opacity = '1';
            });
        }, 200);

        floatingButton.style.transform = 'scale(0.8) rotate(45deg)';
        floatingButton.style.backgroundColor = '#d35400';
    } else {
        linkDisplayContainer.style.width = '0';
        linkDisplayContainer.style.height = '0';
        linkDisplayContainer.style.borderRadius = '30px';
        linkDisplayContainer.style.opacity = '0';
        linkDisplayContainer.style.padding = '0';

        linkDisplayContainer.querySelectorAll('h3, p, #emergency-download-button').forEach(el => {
            el.style.opacity = '0';
        });

        floatingButton.style.transform = 'scale(1) rotate(0deg)';
        floatingButton.style.backgroundColor = '#f39c12';
    }
}

function showDownloadLink(fileUrl) {
    let downloadButton = document.getElementById('emergency-download-button');
    const fileName = document.title.split('|')[0].trim();

    if (!downloadButton) {
        downloadButton = document.createElement('a');
        downloadButton.id = 'emergency-download-button';
        downloadButton.style.display = 'inline-block';
        downloadButton.style.backgroundColor = '#2ecc71';
        downloadButton.style.color = '#ffffff';
        downloadButton.style.padding = '10px 20px';
        downloadButton.style.borderRadius = '25px';
        downloadButton.style.textDecoration = 'none';
        downloadButton.style.fontSize = '16px';
        downloadButton.style.fontWeight = 'bold';
        downloadButton.style.transition = 'all 0.3s ease';
        downloadButton.style.opacity = '0';
        downloadButton.style.transition = 'opacity 0.3s ease 0.4s, background-color 0.3s ease, transform 0.3s ease';

        downloadButton.addEventListener('mouseover', () => {
            downloadButton.style.backgroundColor = '#27ae60';
            downloadButton.style.transform = 'scale(1.05)';
        });

        downloadButton.addEventListener('mouseout', () => {
            downloadButton.style.backgroundColor = '#2ecc71';
            downloadButton.style.transform = 'scale(1)';
        });

        linkDisplayContainer.appendChild(downloadButton);
    }

    downloadButton.innerText = '获取下载链接';
    downloadButton.onclick = function (event) {
        totalDownloads++;
        updateTotalProgress();

        event.preventDefault();
        courseDownload(fileUrl, fileName);
    };

    requestAnimationFrame(() => {
        downloadButton.style.opacity = '0';
        requestAnimationFrame(() => {
            downloadButton.style.opacity = '1';
        });
    });

    triggerAnimation(downloadButton, 'flash-animation');

    if (!isExpanded) {
        toggleLinkContainer();
    } else {
        downloadButton.style.display = 'inline-block';
        downloadButton.style.opacity = '1';
    }
}

function triggerAnimation(element, animationClass) {
    element.classList.remove(animationClass);
    void element.offsetWidth;
    element.classList.add(animationClass);
}

let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 200) {
        floatingButton.style.transform = 'translateY(100px)';
    } else {
        floatingButton.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);