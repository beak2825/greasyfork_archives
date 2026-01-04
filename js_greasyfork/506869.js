// ==UserScript==
// @name         检测网址跳转
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  选中一个网址后在新标签页跳转，并添加 F2 弹出窗口功能
// @author       小楠
// @match        *://*/*
// @icon         https://t.tutu.to/img/kjcbA
// @license      MIT
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/506869/%E6%A3%80%E6%B5%8B%E7%BD%91%E5%9D%80%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/506869/%E6%A3%80%E6%B5%8B%E7%BD%91%E5%9D%80%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

let isSelecting = false;
let selectedText = '';
let hasPattern = false;
let showedPopup = false;
let currentPageUrl = window.location.href;
let isDetectionEnabled = true;
let isProcessed = false;
let lastSelectedUrl = '';

let linkRecords = [];

// 当标签重新获得焦点或页面重新可见时，允许再次对相同链接弹窗
try {
    window.addEventListener('focus', () => { showedPopup = false; lastSelectedUrl = ''; currentPageUrl = window.location.href; });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') { showedPopup = false; lastSelectedUrl = ''; currentPageUrl = window.location.href; }
    });
} catch {}


function trimTrailingPunctuation(text) {
    if (!text) return text;
    return text.replace(/[\)\]\}\.,;:!?]+$/g, '');
}

function normalizeUrl(rawUrl) {
    if (!rawUrl) return '';
    let url = rawUrl.trim();
    url = trimTrailingPunctuation(url);

    const looksLikeDomain = /^(?:www\.)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[\w\-\.~!$&'()*+,;=:@%\/?#]*)?$/;
    if (looksLikeDomain.test(url) && !/^([a-zA-Z][a-zA-Z0-9+.-]*):/.test(url)) {
        return 'https://' + url;
    }

    return url;
}

function extractUrlsFromText(text) {
    if (!text) return [];
    const matches = [];

    const schemeRegex = /\b((?:https?|ftps?):\/\/[\w\-\.~!$&'()*+,;=:@%\/?#]+)\b/gi;
    const specialRegex = /\b(magnet:\?[\w\-\.~!$&'()*+,;=:@%\/?#]+|ed2k:\/\/[\w\-\.~!$&'()*+,;=:@%\/?#]+|thunder:\/\/[\w\-\.~!$&'()*+,;=:@%\/?#]+)\b/gi;
    const domainRegex = /\b((?:www\.)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[\w\-\.~!$&'()*+,;=:@%\/?#]*)?)\b/g;

    const addMatches = (regex, normalizer) => {
        let m;
        while ((m = regex.exec(text)) !== null) {
            const found = normalizer ? normalizer(m[1]) : m[1];
            if (found) matches.push(found);
        }
    };

    addMatches(schemeRegex, (u) => normalizeUrl(u));
    addMatches(specialRegex, (u) => normalizeUrl(u));
    addMatches(domainRegex, (u) => normalizeUrl(u));

    const unique = Array.from(new Set(matches)).filter(Boolean);
    return unique;
}

function openUrlWithMode(url, mode) {
    const finalUrl = normalizeUrl(url);
    if (!finalUrl) return;
    if (mode === 'backgroundTab') {
        if (typeof GM_openInTab === 'function') {
            GM_openInTab(finalUrl, { active: false, insert: true, setParent: true });
        } else {
            window.open(finalUrl, '_blank');
        }
    } else if (mode === 'foregroundTab') {
        if (typeof GM_openInTab === 'function') {
            GM_openInTab(finalUrl, { active: true, insert: true, setParent: true });
        } else {
            window.open(finalUrl, '_blank');
        }
    } else if (mode === 'newWindow') {
        window.open(finalUrl, '_blank', 'noopener,noreferrer,width=1200,height=800');
    } else {
        window.open(finalUrl, '_blank');
    }
}

function batchOpen(urls, mode, delayMs = 200) {
    if (!Array.isArray(urls) || urls.length === 0) return;
    urls.forEach((u, idx) => {
        setTimeout(() => openUrlWithMode(u, mode), idx * delayMs);
    });
}

document.addEventListener('click', function (event) {
    const anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!anchor) return;

    const href = anchor.href;
    if (!href) return;

    const isCtrlLike = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;

    if (isCtrlLike) {
        event.preventDefault();
        event.stopPropagation();
        openUrlWithMode(href, 'backgroundTab');
    } else if (isShift) {
        event.preventDefault();
        event.stopPropagation();
        openUrlWithMode(href, 'newWindow');
    }
}, true);

const KEY_ALIASES = 'domainAliases.v1';
const CODE_KEY_PREFIX = 'pendingExtractCode.';
const KEY_ALIASES_BUILTIN_OVERRIDE = 'domainAliases.builtinOverride.v1';

const BUILT_IN_ALIASES = {};

function getUserAliases() {
    try { return GM_getValue(KEY_ALIASES, {}); } catch { return {}; }
}
function getAliases() {
    const builtin = BUILT_IN_ALIASES || {};
    let override = {};
    try { override = GM_getValue(KEY_ALIASES_BUILTIN_OVERRIDE, {}); } catch {}
    try {
        const userMap = GM_getValue(KEY_ALIASES, {});
        return Object.assign({}, builtin, override, userMap);
    } catch {
        return Object.assign({}, builtin, override);
    }
}
function setAliases(map) {
    try { GM_setValue(KEY_ALIASES, map); } catch {}
}
function upsertAlias(domain, name) {
    if (!domain || !name) return;
    const map = getUserAliases();
    map[domain] = name;
    setAliases(map);
}
function getAlias(domain) {
    if (!domain) return '';
    const map = getAliases();
    let host = domain.toLowerCase();
    if (map[host]) return map[host];
    const nowww = host.replace(/^www\./, '');
    if (map[nowww]) return map[nowww];
    let h = host;
    while (h.indexOf('.') !== -1) {
        h = h.substring(h.indexOf('.') + 1);
        if (map[h]) return map[h];
        const hNoWww = h.replace(/^www\./, '');
        if (map[hNoWww]) return map[hNoWww];
    }
    return '';
}
function getBaseDomain(host) {
    try {
        const parts = (host || '').split('.');
        if (parts.length <= 2) return host || '';
        return parts.slice(parts.length - 2).join('.');
    } catch { return host || ''; }
}
function setPendingCodeForHost(host, code) {
    if (!host || !code) return;
    try {
        GM_setValue(CODE_KEY_PREFIX + host, code);
        const base = getBaseDomain(host);
        if (base && base !== host) GM_setValue(CODE_KEY_PREFIX + base, code);
    } catch {}
}
function takePendingCodeForHost(host) {
    try {
        const exactKey = CODE_KEY_PREFIX + host;
        let val = GM_getValue(exactKey, '');
        if (val) { GM_deleteValue(exactKey); return val; }
        const base = getBaseDomain(host);
        const baseKey = CODE_KEY_PREFIX + base;
        val = GM_getValue(baseKey, '');
        if (val) GM_deleteValue(baseKey);
        return val || '';
    } catch { return ''; }
}

function extractCodesFromText(text) {
    if (!text) return [];
    const codes = [];
    const regex = /(提取码|密码|访问码|暗号|口令|Pass\s*Code|Access\s*Code)[：: ]*([a-zA-Z0-9]{4,8})/g;
    let m;
    while ((m = regex.exec(text)) !== null) {
        codes.push(m[2]);
    }
    return Array.from(new Set(codes));
}

function getHostnameFromUrl(url) {
    try { return new URL(normalizeUrl(url)).hostname; } catch { return ''; }
}

function isNetdiskHost(host) {
    if (!host) return false;
    const h = host.toLowerCase();
    const patterns = [
        'pan.baidu.com', 'yun.baidu.com',
        'cloud.189.cn',
        'lanzou.com', 'lanzoui.com', 'lanzoux.com', 'lanzoup.com', 'lanzouy.com',
        '123pan.com',
        'weiyun.com', 'share.weiyun.com',
        'pan.xunlei.com',
        'pan.quark.cn', 'drive.quark.cn',
        'alipan.com', 'aliyundrive.com', 'drive.aliyundrive.com',
        'terabox.com',
        'ctfile.com',
        'cowtransfer.com',
        'sendspace.com', 'dropbox.com', 'drive.google.com', 'onedrive.live.com', 'sharepoint.com',
        'mega.nz'
    ];
    return patterns.some(d => h === d || h.endsWith('.' + d)) || /(lanzou[a-z]|lanzn)\.com$/.test(h);
}

// 新增：常见网盘站点的输入与按钮选择器，以及辅助方法
const PAN_SITE_CONFIG = [
    { host: /(pan|e?yun)\.baidu\.com/, input: ['#accessCode', '.share-access-code', '#wpdoc-share-page .u-input__inner'], button: ['#submitBtn', '.share-access .g-button', '#wpdoc-share-page .u-btn--primary'] },
    { host: /www\.(aliyundrive|alipan)\.com|alywp\.net/, input: ['form .ant-input', 'form input[type="text"]', 'input[name="pwd"]'], button: ['form .button--fep7l', 'form button[type="submit"]'] },
    { host: /share\.weiyun\.com/, input: ['.mod-card-s input[type=password]', 'input.pw-input'], button: ['.mod-card-s .btn-main', '.pw-btn-wrap button.btn'] },
    { host: /(?:lanzou[a-z]|lanzn)\.com/, input: ['#pwd','input[name="pwd"]','.pwd','form input[type="text"]'], button: ['.passwddiv-btn', '#sub','form button','button[type="submit"]'] },
    { host: /cloud\.189\.cn/, input: ['.access-code-item #code_txt', 'input.access-code-input'], button: ['.access-code-item .visit', '.button'] },
    { host: /www\.123pan\.com/, input: ['.ca-fot input', '.appinput .appinput'], button: ['.ca-fot button', '.appinput button'] },
    { host: /pan\.xunlei\.com/, input: ['.pass-input-wrap .td-input__inner'], button: ['.pass-input-wrap .td-button'] },
    { host: /pan\.quark\.cn/, input: ['.ant-input'], button: ['.ant-btn-primary'] },
    { host: /(?:ctfile|545c|u062|ghpym)\.com/, input: ['#passcode'], button: ['.card-body button'] },
    { host: /(?:[a-zA-Z\d-.]+)?cowtransfer\.com/, input: ['.receive-code-input input'], button: ['.open-button'] }
];
function getPanConfigByHost(host) {
    try {
        for (let i = 0; i < PAN_SITE_CONFIG.length; i++) {
            if (PAN_SITE_CONFIG[i].host.test(host)) return PAN_SITE_CONFIG[i];
        }
    } catch {}
    return null;
}
function queryAny(selectors) {
    if (!selectors || selectors.length === 0) return null;
    for (let i = 0; i < selectors.length; i++) {
        try { const el = document.querySelector(selectors[i]); if (el) return el; } catch {}
    }
    return null;
}
function isHiddenEl(el) {
    try {
        const cs = window.getComputedStyle(el);
        return cs.display === 'none' || cs.visibility === 'hidden' || el.offsetParent === null;
    } catch { return false; }
}
function augmentNetdiskUrlWithCode(url, code) {
    try {
        if (!code) return url;
        const u = new URL(normalizeUrl(url));
        if (!isNetdiskHost(u.hostname)) return url;
        const params = u.searchParams;
        if (!params.get('pwd')) params.set('pwd', code);
        u.search = params.toString();
        u.hash = '#' + code;
        return u.toString();
    } catch { return url; }
}

function buildLinkRecordsFromAllText(text) {
    const lines = (text || '').split(/\r?\n/);
    const records = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const urls = extractUrlsFromText(line);
        if (urls.length === 0) continue;
        const neighborhood = line + '\n' + (lines[i + 1] || '');
        const codes = extractCodesFromText(neighborhood);
        let code = codes[0] || '';
        urls.forEach(u => {
            const host = getHostnameFromUrl(u);
            const effectiveCode = isNetdiskHost(host) ? code : '';
            records.push({ url: u, host, code: effectiveCode, display: getAlias(host) || '' });
        });
    }
    const seen = new Set();
    const dedup = [];
    for (const r of records) {
        if (seen.has(r.url)) continue;
        seen.add(r.url);
        dedup.push(r);
    }
    return dedup;
}

function findCodeFromSelectionContext() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return '';
    const range = sel.getRangeAt(0);
    let node = range.commonAncestorContainer;
    if (node.nodeType !== 1) node = node.parentElement;
    if (!node) return '';
    const container = node.closest ? node.closest('p,li,div,section,article') || node : node;
    const txt = container ? container.innerText : '';
    const codes = extractCodesFromText(txt);
    return codes[0] || '';
}

function showConfirmModal(options) {
    const { title = '确认跳转', message = '', confirmText = '打开', cancelText = '取消', onConfirm, onCancel } = options || {};
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;background:rgba(2,8,23,.25);z-index:99998;`;

    const modal = document.createElement('div');
    modal.style.cssText = `position:fixed;top:64px;left:50%;transform:translateX(-50%);width:280px;max-width:92vw;background:#ffffff;color:#0f172a;border-radius:12px;border:1px solid #e2e8f0;box-shadow:0 10px 24px rgba(2,8,23,.12);z-index:99999;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;`;
    modal.innerHTML = `
        <div style="padding:12px 14px;border-bottom:1px solid #f1f5f9;font-weight:600;font-size:14px;">${title}</div>
        <div style="padding:12px 14px;font-size:13px;color:#334155;line-height:1.6;word-break:break-all;">${message}</div>
        <div style="display:flex;justify-content:flex-end;gap:8px;padding:10px 14px;border-top:1px solid #f1f5f9;">
            <button id="cm_cancel" style="padding:6px 10px;border:1px solid #cbd5e1;background:#fff;color:#334155;border-radius:8px;cursor:pointer;font-size:12px;">${cancelText}</button>
            <button id="cm_ok" style="padding:6px 12px;border:1px solid #2563eb;background:#2563eb;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;">${confirmText}</button>
        </div>
    `;

    function cleanup() {
        if (modal.parentNode) modal.parentNode.removeChild(modal);
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    overlay.addEventListener('click', () => { cleanup(); onCancel && onCancel(); });
    modal.querySelector('#cm_cancel').addEventListener('click', () => { cleanup(); onCancel && onCancel(); });
    modal.querySelector('#cm_ok').addEventListener('click', () => { cleanup(); onConfirm && onConfirm(); });

    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

function showLinkJumpConfirm(url, code) {
    const host = getHostnameFromUrl(url);
    const alias = getAlias(host);
    const title = '跳转确认';
    const display = alias || host || url;
    const isPan = isNetdiskHost(host);
    let message = `是否跳转到：<br><strong>${display}</strong>`;
    if (code && isPan) message += `<br><span style=\"color:#16a34a;\">已识别提取码：<b>${code}</b>（将自动填入）</span>`;
    showConfirmModal({ title, message, onConfirm: () => {
        if (code && isPan) {
            const targetHost = host || getHostnameFromUrl(url);
            setPendingCodeForHost(targetHost, code);
            try { localStorage.setItem('nd_last_code', code); } catch {}
            navigator.clipboard.writeText(code).catch(() => {});
        }
        const targetUrl = augmentNetdiskUrlWithCode(url, code);
        window.open(targetUrl, '_blank');
    } });
}

document.addEventListener('mousedown', function () {
    isSelecting = true;
    // 当用户重新在当前标签页进行新的选择时，解除上一次去重限制
    if (document.hasFocus()) {
        showedPopup = false;
    }
});

document.addEventListener('mouseup', function () {
    isSelecting = false;
    if (window.getSelection().toString()) {
        selectedText = window.getSelection().toString();
        hasPattern = extractUrlsFromText(selectedText).length > 0;
    } else {
        selectedText = '';
        hasPattern = false;
    }
    checkAndPrompt();
});

let checkAndPrompt = function () {
    if (!isDetectionEnabled) return;
    if (hasPattern && window.location.href === currentPageUrl) {
        const urls = extractUrlsFromText(selectedText);
        if (urls && urls.length > 0) {
            const urlToCopy = urls[0];
            if (urlToCopy !== lastSelectedUrl) {
                const host = getHostnameFromUrl(urlToCopy);
                const code = isNetdiskHost(host) ? (findCodeFromSelectionContext() || extractCodesFromText(selectedText)[0] || '') : '';
                navigator.clipboard.writeText(urlToCopy).catch(() => {});
                showLinkJumpConfirm(urlToCopy, code);
                showedPopup = true;
                lastSelectedUrl = urlToCopy;
                setTimeout(() => { showedPopup = false; }, 1200);
            }
        }
    } else {
        showedPopup = false;
        isProcessed = false;
        lastSelectedUrl = '';
    }
};

document.addEventListener('selectionchange', checkAndPrompt);

document.addEventListener('keydown', function (event) {
    if (event.key === 'F2') {
        const allTextContent = document.body.innerText;
        linkRecords = buildLinkRecordsFromAllText(allTextContent);

        const popupStyle = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 360px;
            height: 420px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(2, 8, 23, .18);
            padding: 14px;
            z-index: 9999;
            overflow-y: auto;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
        `;
        const popupTitleStyle = `
            text-align: left;
            font-size: 16px;
            font-weight: 700;
            display: inline-block;
            margin-right: 10px;
        `;
        const linkContainerStyle = `
            margin-top: 10px;
        `;
        const toolbarStyle = `
            background: #f8fafc;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 6px;
            margin-top: 6px;
        `;
        const btnStyle = `
            padding: 4px 8px;
            border: 1px solid #cbd5e1;
            background: #fff;
            border-radius: 8px;
            cursor: pointer;
        `;

        const popupContent = `<div style="display:flex;flex-direction:column;justify-content:flex-start;height:100%;"><div style="position:sticky;top:0;background:#f8fafc;display:flex;justify-content:space-between;align-items:center;z-index:2;padding-bottom:6px;"><h3 id="popupTitle" style="width:100%;${popupTitleStyle}">链接列表（${linkRecords.length}）</h3></div><div id="toolbar" style="${toolbarStyle}"><div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;"><button id="selectAllBtn" style="${btnStyle}">全选</button><input id="searchInput" placeholder="搜索别名/域名/链接/提取码" style="padding:6px 8px;border:1px solid #cbd5e1;border-radius:8px;width:200px;background:#fff;color:#111;outline:none;" /></div><div style="display:flex;gap:6px;flex-wrap:wrap;"><button id="openSelBg" style="${btnStyle}">打开选中(后台)</button><button id="openSelWin" style="${btnStyle}">打开选中(新窗口)</button><button id="openAllBg" style="${btnStyle}">打开全部(后台)</button></div></div><div id="linkContainer" style="${linkContainerStyle}"></div></div>`;
        const popup = document.createElement('div');
        popup.style.cssText = popupStyle;
        popup.innerHTML = popupContent;
        document.body.appendChild(popup);

        const outsideClose = document.createElement('button');
        outsideClose.id = 'popupCloseOutside';
        outsideClose.textContent = '✕';
        outsideClose.style.cssText = `position:fixed;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;line-height:1;border:1px solid #cbd5e1;background:#fff;color:#334155;border-radius:999px;cursor:pointer;box-shadow:0 6px 16px rgba(2,8,23,.2);z-index:10000;`;
        document.body.appendChild(outsideClose);
        function positionOutsideClose() {
            const rect = popup.getBoundingClientRect();
            const left = Math.min(window.innerWidth - 36, Math.max(8, rect.right + 8));
            const top = Math.min(window.innerHeight - 36, Math.max(8, rect.top - 8));
            outsideClose.style.left = left + 'px';
            outsideClose.style.top = top + 'px';
        }
        positionOutsideClose();
        window.addEventListener('resize', positionOutsideClose);
        outsideClose.addEventListener('click', function () {
            try { document.body.removeChild(popup); } catch {}
            try { document.body.removeChild(outsideClose); } catch {}
        });

        let isDragging = false;
        let offsetX, offsetY;
        let originalBorderColor = '#e2e8f0';
        let draggingBorderColor = '#60a5fa';

        popup.addEventListener('mousedown', function (event) {
            isDragging = true;
            offsetX = event.clientX - popup.offsetLeft;
            offsetY = event.clientY - popup.offsetTop;
            popup.style.borderColor = draggingBorderColor;
        });

        document.addEventListener('mousemove', function (event) {
            if (isDragging) {
                popup.style.left = event.clientX - offsetX + 'px';
                popup.style.top = event.clientY - offsetY + 'px';
                try { positionOutsideClose(); } catch {}
            }
        });

        document.addEventListener('mouseup', function () {
            isDragging = false;
            popup.style.borderColor = originalBorderColor;
            try { positionOutsideClose(); } catch {}
        });

        popup.addEventListener('wheel', function (event) {
            event.preventDefault();
            popup.scrollTop += event.deltaY;
            try { positionOutsideClose(); } catch {}
        });

        const linkContainer = popup.querySelector('#linkContainer');
        linkRecords.forEach(() => {});

        const selectAllBtn = document.getElementById('selectAllBtn');
        const searchInput = document.getElementById('searchInput');
        const openSelBg = document.getElementById('openSelBg');
        const openSelWin = document.getElementById('openSelWin');
        const openAllBg = document.getElementById('openAllBg');

        let allSelected = false;
        selectAllBtn.addEventListener('click', function () {
            const checks = popup.querySelectorAll('.link-check');
            allSelected = !allSelected;
            checks.forEach(c => c.checked = allSelected);
            selectAllBtn.textContent = allSelected ? '取消全选' : '全选';
        });

        function normalize(str) {
            return (str || '').toLowerCase();
        }
        function itemMatches(rec, q) {
            const s = normalize(q);
            if (!s) return true;
            const fields = [rec.display, rec.host, rec.url, rec.code];
            return fields.some(f => normalize(f).includes(s));
        }
        function renderList(filterText) {
            linkContainer.innerHTML = '';
            let count = 0;
            linkRecords.forEach((rec, index) => {
                if (!itemMatches(rec, filterText)) return;
                count++;
                const row = document.createElement('div');
                row.style.margin = '8px 0';
                const safe = rec.url.replace(/"/g, '&quot;');
                const label = rec.display || rec.host || rec.url;
                const codeBadge = rec.code ? `<span style="margin-left:6px;color:#16a34a;background:#dcfce7;border:1px solid #86efac;border-radius:4px;padding:0 4px;">码:${rec.code}</span>` : '';
                row.innerHTML = `<label style="display:flex;align-items:flex-start;gap:8px;line-height:1.4;"><input type="checkbox" class="link-check" data-url="${safe}" data-code="${rec.code || ''}" data-host="${rec.host || ''}"/><span style="opacity:.7;min-width:2.2em;text-align:right;">${index + 1}.</span><div style="display:flex;flex-direction:column;gap:2px;min-width:0;"><div style="font-size:12px;color:#334155;">${label}${codeBadge}</div><a href="${safe}" target="_blank" rel="noopener noreferrer" style="word-break:break-all;color:#0ea5e9;text-decoration:none;">${safe}</a></div></label>`;
                linkContainer.appendChild(row);
            });
            const titleEl = popup.querySelector('#popupTitle');
            if (titleEl) titleEl.textContent = `链接列表（${count}）`;
        }
        if (searchInput) {
            searchInput.addEventListener('input', function(){
                renderList(searchInput.value);
                allSelected = false;
                selectAllBtn.textContent = '全选';
            });
        }
        renderList('');

        function openOne(recUrl, mode, code, host) {
            if (code && isNetdiskHost(host || getHostnameFromUrl(recUrl))) {
                setPendingCodeForHost(host || getHostnameFromUrl(recUrl), code);
                navigator.clipboard.writeText(code).catch(() => {});
            }
            const finalUrl = augmentNetdiskUrlWithCode(recUrl, code);
            openUrlWithMode(finalUrl, mode);
        }

        function getSelectedRecs() {
            const checks = popup.querySelectorAll('.link-check');
            const recs = [];
            checks.forEach(c => {
                if (c.checked) recs.push({ url: c.getAttribute('data-url'), code: c.getAttribute('data-code') || '', host: c.getAttribute('data-host') || '' });
            });
            return recs;
        }

        openSelBg.addEventListener('click', function () {
            const recs = getSelectedRecs();
            recs.forEach((r, idx) => setTimeout(() => openOne(r.url, 'backgroundTab', r.code, r.host), idx * 200));
        });
        openSelWin.addEventListener('click', function () {
            const recs = getSelectedRecs();
            recs.forEach((r, idx) => setTimeout(() => openOne(r.url, 'newWindow', r.code, r.host), idx * 200));
        });
        openAllBg.addEventListener('click', function () {
            linkRecords.forEach((r, idx) => setTimeout(() => openOne(r.url, 'backgroundTab', r.code, r.host), idx * 200));
        });
    }

    if (event.key === 'F3') {
        let prefillDomain = '';
        const sel = window.getSelection().toString().trim();
        const urls = extractUrlsFromText(sel);
        if (urls.length > 0) prefillDomain = getHostnameFromUrl(urls[0]);
        if (!prefillDomain && document.activeElement && document.activeElement.href) {
            try { prefillDomain = new URL(document.activeElement.href).hostname; } catch {}
        }
        const body = `
            <div style="display:flex;flex-direction:column;gap:10px;padding:12px 0;">
                <label style="display:flex;flex-direction:column;gap:6px;">
                    <span style="font-size:12px;color:#475569;">域名（例如：example.com）</span>
                    <input id="alias_domain" placeholder="example.com" style="padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;outline:none;background:#fff;color:#111;" value="${prefillDomain || ''}" />
                </label>
                <label style="display:flex;flex-direction:column;gap:6px;">
                    <span style="font-size:12px;color:#475569;">显示名称（别名）</span>
                    <input id="alias_name" placeholder="我的网盘" style="padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;outline:none;background:#fff;color:#111;" value="${getAlias(prefillDomain) || ''}" />
                </label>
                <div style="display:flex;gap:8px;flex-wrap:wrap;padding-top:4px;">
                    <button id="alias_export" style="padding:6px 10px;border:1px solid #cbd5e1;background:#fff;color:#334155;border-radius:8px;cursor:pointer;font-size:12px;">导出</button>
                    <button id="alias_import" style="padding:6px 10px;border:1px solid #cbd5e1;background:#fff;color:#334155;border-radius:8px;cursor:pointer;font-size:12px;">导入</button>
                    <button id="alias_copy_embed" style="padding:6px 10px;border:1px solid #cbd5e1;background:#fff;color:#334155;border-radius:8px;cursor:pointer;font-size:12px;">设为内置</button>
                </div>
            </div>
        `;
        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed;inset:0;background:rgba(2,8,23,.25);z-index:99998;`;
        const modal = document.createElement('div');
        modal.style.cssText = `position:fixed;top:64px;left:50%;transform:translateX(-50%);width:360px;max-width:92vw;background:#ffffff;color:#0f172a;border-radius:12px;border:1px solid #e2e8f0;box-shadow:0 10px 24px rgba(2,8,23,.12);z-index:99999;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;`;
        modal.innerHTML = `
            <div style="padding:12px 14px;border-bottom:1px solid #f1f5f9;font-weight:600;font-size:14px;">设置域名别名 (F3)</div>
            <div style="padding:10px 14px;">${body}</div>
            <div style="display:flex;justify-content:flex-end;gap:8px;padding:10px 14px;border-top:1px solid #f1f5f9;">
                <button id="alias_cancel" style="padding:6px 10px;border:1px solid #cbd5e1;background:#fff;color:#334155;border-radius:8px;cursor:pointer;font-size:12px;">取消</button>
                <button id="alias_ok" style="padding:6px 12px;border:1px solid #2563eb;background:#2563eb;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;">保存</button>
            </div>`;
        function cleanup() {
            if (modal.parentNode) modal.parentNode.removeChild(modal);
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }
        function downloadText(filename, text) {
            try {
                const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            } catch {}
        }
        function copyToClipboard(text) { try { navigator.clipboard.writeText(text); } catch {} }
        function pretty(obj) { try { return JSON.stringify(obj, null, 2); } catch { return '{}'; } }

        const exportBtn = modal.querySelector('#alias_export');
        const importBtn = modal.querySelector('#alias_import');
        const embedBtn = modal.querySelector('#alias_copy_embed');
        if (exportBtn) exportBtn.addEventListener('click', () => {
            const data = getUserAliases();
            downloadText('aliases.json', pretty(data));
        });
        if (importBtn) importBtn.addEventListener('click', async () => {
            try {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'application/json,.json';
                input.onchange = () => {
                    const file = input.files && input.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                        try {
                            const obj = JSON.parse(reader.result);
                            if (obj && typeof obj === 'object') setAliases(obj);
                            alert('导入成功');
                        } catch { alert('导入失败：JSON 格式不正确'); }
                    };
                    reader.readAsText(file, 'utf-8');
                };
                input.click();
            } catch { alert('导入失败：浏览器不支持文件选择'); }
        });
        if (embedBtn) embedBtn.addEventListener('click', () => {
            try {
                const data = getUserAliases();
                GM_setValue(KEY_ALIASES_BUILTIN_OVERRIDE, data);
                alert('已将当前别名保存为内置（本地），将作为默认值使用。');
            } catch {
                alert('保存失败：环境不支持写入本地存储');
            }
        });
        overlay.addEventListener('click', cleanup);
        modal.querySelector('#alias_cancel').addEventListener('click', cleanup);
        modal.querySelector('#alias_ok').addEventListener('click', () => {
            const d = modal.querySelector('#alias_domain').value.trim().replace(/^https?:\/\//,'');
            const n = modal.querySelector('#alias_name').value.trim();
            if (d && n) upsertAlias(d, n);
            try {
                if (Array.isArray(linkRecords) && linkRecords.length > 0) {
                    linkRecords = linkRecords.map(r => {
                        if (!r) return r;
                        const alias = getAlias(r.host);
                        return Object.assign({}, r, { display: alias || r.display || '' });
                    });
                }
            } catch {}
            cleanup();
        });
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }
});

(function tryAutoFillExtractionCode() {
    const host = location.hostname;
    // 从 URL 参数、hash 或待写入的本地值获取提取码
    let code = '';
    try {
        const sp = new URLSearchParams(location.search);
        code = sp.get('pwd') || sp.get('p') || '';
    } catch {}
    if (!code) {
        try { code = (location.hash || '').replace(/^#/, '').trim(); } catch {}
    }
    if (!code) code = takePendingCodeForHost(host);
    if (!code) { try { code = localStorage.getItem('nd_last_code') || ''; } catch {}
    }
    if (!code) return;

    let attempts = 0;
    const conf = getPanConfigByHost(host);

    const timer = setInterval(() => {
        attempts++;
        let input = null;
        let button = null;

        if (conf) {
            input = queryAny(conf.input);
            button = queryAny(conf.button);
        }

        if (!input) {
            // 退化为通用探测
            let inputs = Array.from(document.querySelectorAll('input'))
                .filter(el => {
                    const p = (el.getAttribute('placeholder') || '').trim();
                    const a = (el.getAttribute('aria-label') || '').trim();
                    const name = (el.getAttribute('name') || '').toLowerCase();
                    const id = (el.getAttribute('id') || '').toLowerCase();
                    const nearby = el.parentElement ? el.parentElement.innerText : '';
                    const kw = /(提取码|密码|访问码|Access\s*Code|提取)/;
                    return kw.test(p) || kw.test(a) || kw.test(nearby) || /code|access|pass/.test(name) || /code|access|pass/.test(id);
                });
            if (inputs.length > 0) input = inputs[0];
        }

        if (input && !isHiddenEl(input)) {
            input.focus();
            const last = input.value;
            input.value = code;
            try { const tracker = input._valueTracker; if (tracker) tracker.setValue(last); } catch {}
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));

            // 若有按钮，优先点击；否则尝试智能按钮匹配
            const clickSubmit = () => {
                if (button) { try { button.click(); } catch {} return; }
                const candidateSelectors = ['button','input[type="submit"]','input[type="button"]','a','[role="button"]','[class*="btn"]','[class*="button"]','[class*="submit"]','[class*="confirm"]'];
                const candidates = Array.from(document.querySelectorAll(candidateSelectors.join(',')));
                const matchRe = /^(确\s*定|确定|提交|访问|打开|提取|确认|继续|下一步|GO|Enter|OK|Submit|Continue)$/i;
                const btn = candidates.find(el => {
                    if (el.disabled) return false;
                    const style = window.getComputedStyle(el);
                    if (style.display === 'none' || style.visibility === 'hidden' || style.pointerEvents === 'none') return false;
                    const text = (el.innerText || el.value || el.textContent || '').trim();
                    const title = (el.getAttribute('title') || el.getAttribute('aria-label') || '').trim();
                    const className = (el.className || '').toString();
                    return matchRe.test(text) || matchRe.test(title) || /(submit|confirm|ok|go|enter)/i.test(className);
                });
                if (btn) {
                    try { btn.click(); } catch {}
                } else {
                    const form = input.form || (input.closest && input.closest('form'));
                    if (form) {
                        if (typeof form.requestSubmit === 'function') {
                            form.requestSubmit();
                        } else {
                            form.submit();
                        }
                    } else {
                        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
                        input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
                    }
                }
            };
            setTimeout(clickSubmit, 500);
            clearInterval(timer);
        } else if (attempts > 100) {
            clearInterval(timer);
        }
    }, 200);
})();

const KEY_AUTO_EXPAND = 'autoExpandHidden.v1';
function isAutoExpandEnabled() { try { return GM_getValue(KEY_AUTO_EXPAND, false); } catch { return false; } }
function setAutoExpandEnabled(v) { try { GM_setValue(KEY_AUTO_EXPAND, !!v); } catch {} }

function isAutoExpandSupportedSite() {
    const h = location.hostname;
    const p = location.pathname;
    const hp = (host, pathPrefix) => h === host && (pathPrefix ? p.startsWith(pathPrefix) : true);
    return (
        hp('blog.csdn.net') ||
        hp('bbs.csdn.net') ||
        hp('download.csdn.net', '/download/') ||
        hp('www.doc88.com') ||
        hp('wenku.baidu.com', '/view/') ||
        hp('zhidao.baidu.com', '/question') ||
        hp('www.ipaperclip.net', '/doku.php') ||
        hp('wap.peopleapp.com', '/article/') ||
        hp('ishare.ifeng.com', '/c/s/') ||
        hp('www.ximalaya.com') ||
        hp('www.awesomes.cn') ||
        hp('www.imooc.com', '/article/') ||
        hp('www.zhihu.com', '/question/') ||
        hp('www.bandbbs.cn') ||
        hp('www.cnbeta.com') ||
        hp('www.chinaz.com') ||
        hp('www.douban.com', '/note/')
    );
}

const AutoExpand = (function(){
    let loopTimer = null;
    let loadHandler = null;

    const btns = Array(
        '.btn-readmore',
        '.show-hide-btn',
        '.down-arrow',
        '.paperclip__showbtn',
        '.expend',
        '.shadow-2n5oidXt',
        '.read_more_btn',
        '.QuestionRichText-more',
        '.QuestionMainAction',
        '.ContentItem-expandButton',
        '.js_show_topic',
        '.tbl-read-more-btn',
        '.more-intro-wrapper',
        '.showMore',
        '.unfoldFullText',
        '.taboola-open',
    );
    const asyncBtns = Array(
        '#continueButton',
        '.read-more-zhankai',
        '.wgt-answers-showbtn',
        '.wgt-best-showbtn',
        '.bbCodeBlock-expandLink'
    );
    const delay = 500;

    function showFull(selectors, handler, once) {
        for (let i = 0; i < selectors.length; i++) {
            try { continue }
            finally {
                const sel = selectors[i], nodes = document.querySelectorAll(sel);
                if (!!nodes[0]) {
                    handler(nodes, sel);
                }
            }
        }
        clearTimeout(loopTimer);
        if (!once) loopTimer = setTimeout(() => showFull(selectors, handler, false), delay);
    }

    function doShow(nodes, sel) {
        if (sel === '.paperclip__showbtn') {
            nodes.forEach(item => item.click());
        } else if (sel === '.showMore') {
            try { nodes[0].querySelector('span').click(); } catch { try { nodes[0].click(); } catch {} }
        } else {
            try { nodes[0].click(); } catch {}
        }
    }

    function doAsyncShow(nodes, sel) {
        try { nodes[0].click(); } catch {}
    }

    function start() {
        if (loopTimer || loadHandler) return;
        showFull(btns, doShow, false);
        loadHandler = () => {
            clearTimeout(loopTimer);
            setTimeout(() => showFull(asyncBtns, doAsyncShow, true), delay);
        };
        window.addEventListener('load', loadHandler);
    }

    function stop() {
        if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
        if (loadHandler) { window.removeEventListener('load', loadHandler); loadHandler = null; }
    }

    return { start, stop };
})();

(function initAutoExpand(){
    const enabled = isAutoExpandEnabled();
    if (enabled && isAutoExpandSupportedSite()) {
        AutoExpand.start();
    }
    try {
        GM_registerMenuCommand('自动展开隐藏内容：' + (enabled ? '已开启' : '已关闭'), () => {
            const now = isAutoExpandEnabled();
            const next = !now;
            setAutoExpandEnabled(next);
            if (next && isAutoExpandSupportedSite()) {
                AutoExpand.start();
            } else {
                AutoExpand.stop();
            }
            alert('自动展开隐藏内容已' + (next ? '开启' : '关闭') + (isAutoExpandSupportedSite() ? '' : '（当前站点不在支持列表）'));
        });
    } catch {}
})();

// 新增：全站链接打开方式（当前页 / 新标签页）
const KEY_OPEN_LINKS_NEW_TAB = 'openLinksNewTab.v1';
function isOpenLinksInNewTab() { try { return GM_getValue(KEY_OPEN_LINKS_NEW_TAB, true); } catch { return true; } }
function setOpenLinksInNewTab(v) { try { GM_setValue(KEY_OPEN_LINKS_NEW_TAB, !!v); } catch {} }

function isEligibleAnchorForOpenMode(a) {
    try {
        if (!a || a.nodeType !== 1) return false;
        if (a.closest && a.closest('button, [role="button"], .no-link-open-mode')) return false;
        const hrefAttr = a.getAttribute('href') || '';
        if (!hrefAttr) return false;
        if (hrefAttr.startsWith('#')) return false;
        if (/^javascript:/i.test(hrefAttr)) return false;
        if (/^(mailto:|tel:|sms:|intent:)/i.test(hrefAttr)) return false;
        return true;
    } catch { return false; }
}

function applyLinkOpenModeToPage() {
    const newTab = isOpenLinksInNewTab();
    const anchors = document.querySelectorAll('a[href]');
    anchors.forEach(a => {
        if (!isEligibleAnchorForOpenMode(a)) return;
        if (newTab) {
            a.setAttribute('target', '_blank');
            const rel = (a.getAttribute('rel') || '').toLowerCase();
            let nextRel = rel;
            if (!/\bnoopener\b/.test(rel)) nextRel = (nextRel ? nextRel + ' ' : '') + 'noopener';
            if (!/\bnoreferrer\b/.test(rel)) nextRel = (nextRel ? nextRel + ' ' : '') + 'noreferrer';
            a.setAttribute('rel', nextRel.trim());
        } else {
            a.removeAttribute('target');
        }
    });
}

(function initGlobalLinkOpenMode(){
    try { applyLinkOpenModeToPage(); } catch {}
    try {
        GM_registerMenuCommand('链接打开方式：' + (isOpenLinksInNewTab() ? '新标签页' : '当前页'), () => {
            const next = !isOpenLinksInNewTab();
            setOpenLinksInNewTab(next);
            applyLinkOpenModeToPage();
            alert('已切换为：' + (next ? '新标签页打开' : '当前页打开'));
        });
    } catch {}
    try {
        const mo = new MutationObserver((muts) => {
            for (let i = 0; i < muts.length; i++) {
                const m = muts[i];
                if (m.addedNodes && m.addedNodes.length) { applyLinkOpenModeToPage(); break; }
            }
        });
        mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
    } catch {}
})();