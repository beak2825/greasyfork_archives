// ==UserScript==
// @name         Proxy Collector & Checker V20
// @namespace    https://example.com/
// @version      20.1
// @description  🟢 Free HTTPS proxy collector + API checker. Auto-update, fastest highlight, filter, sort, multithreading, speed (ms), "Made in Ukraine" logo.
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/547395/Proxy%20Collector%20%20Checker%20V20.user.js
// @updateURL https://update.greasyfork.org/scripts/547395/Proxy%20Collector%20%20Checker%20V20.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================== CONFIG ==================
    const SOURCES = [
        'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
        'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt',
        'https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt',
        'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
        'https://raw.githubusercontent.com/almroot/proxylist/master/list.txt'
    ];

    const API_TEMPLATE = 'https://api.proxy-checker.net/api/check?proxy={proxy}';
    const CONCURRENCY = 10;
    const REQUEST_TIMEOUT_MS = 15000;
    const STORAGE_PREFIX = 'proxyWidgetV20_';
    const AUTO_UPDATE_INTERVAL_MS = 5 * 60 * 1000;

    let allProxies = [];
    let checkResults = {};
    let checking = false;
    let showOnlyWorking = GM_getValue(STORAGE_PREFIX + 'filter', 'false') === 'true';
    let sortMode = GM_getValue(STORAGE_PREFIX + 'sortMode', 'working');
    let lang = GM_getValue(STORAGE_PREFIX + 'lang', 'en'); // EN by default

    // ================== i18n ==================
    const i18n = {
        en: {
            title: 'Proxy V20',
            madeIn: 'Made in Ukraine',
            collapse: 'Collapse',
            close: 'Close',
            refresh: 'Refresh lists',
            check: 'Check (API)',
            copy: 'Copy',
            download: 'Download',
            filterAll: 'Filter: All',
            filterWorking: 'Filter: ✅',
            sort: 'Sort',
            ready: 'Ready',
            copied: 'Copied to clipboard',
            refreshFirst: 'Please refresh lists first'
        },
        ru: {
            title: 'Proxy V20',
            madeIn: 'Зроблено в Україні',
            collapse: 'Свернуть',
            close: 'Закрыть',
            refresh: 'Обновить списки',
            check: 'Проверить (API)',
            copy: 'Копировать',
            download: 'Скачать',
            filterAll: 'Фильтр: Все',
            filterWorking: 'Фильтр: ✅',
            sort: 'Сортировать',
            ready: 'Готово',
            copied: 'Скопировано в буфер',
            refreshFirst: 'Сначала обнови списки'
        }
    };

    function t(key) { return i18n[lang][key] || key; }

    // ================== UI ==================
    function createWidget() {
        if (document.getElementById('proxy-widget-v20')) return;

        const savedPos = JSON.parse(GM_getValue(STORAGE_PREFIX + 'pos', null) || 'null') || { top: 50, left: 50 };
        const collapsed = GM_getValue(STORAGE_PREFIX + 'collapsed', 'false') === 'true';

        const w = document.createElement('div');
        w.id = 'proxy-widget-v20';
        w.style.cssText = `
            position: fixed;
            top: ${savedPos.top}px;
            left: ${savedPos.left}px;
            width: 500px;
            max-height: 75vh;
            overflow: auto;
            background: #111;
            color: #eee;
            font-family: Arial, sans-serif;
            font-size: 13px;
            border-radius: 10px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.6);
            border: 1px solid #222;
            z-index: 2147483647;
            padding: 10px;
        `;

        w.innerHTML = `
            <div id="phead" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;cursor:grab;">
                <div style="font-weight:700;color:#4caf50;display:flex;align-items:center;gap:6px">
                    <span id="pTitle">${t('title')}</span>
                    <span style="font-size:10px;color:#feda4a;font-weight:700;">${t('madeIn')}</span>
                </div>
                <div style="display:flex;gap:6px;align-items:center">
                    <button id="btnCollapse" title="${t('collapse')}" style="background:#333;color:#fff;border:none;padding:4px 8px;border-radius:6px;cursor:pointer">${collapsed ? '+' : '−'}</button>
                    <button id="btnClose" title="${t('close')}" style="background:#b33;color:#fff;border:none;padding:4px 8px;border-radius:6px;cursor:pointer">×</button>
                </div>
            </div>
            <div id="pcontent" style="${collapsed ? 'display:none' : ''}">
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">
                    <button id="btnLoad" style="padding:6px 8px;border-radius:6px;border:none;cursor:pointer;background:#2b6cff;color:#fff">${t('refresh')}</button>
                    <button id="btnCheck" style="padding:6px 8px;border-radius:6px;border:none;cursor:pointer;background:#27ae60;color:#fff">${t('check')}</button>
                    <button id="btnCopy" style="padding:6px 8px;border-radius:6px;border:none;cursor:pointer;background:#555;color:#fff">${t('copy')}</button>
                    <button id="btnDownload" style="padding:6px 8px;border-radius:6px;border:none;cursor:pointer;background:#555;color:#fff">${t('download')}</button>
                    <button id="btnFilter" style="padding:6px 8px;border-radius:6px;border:none;cursor:pointer;background:#777;color:#fff">${showOnlyWorking ? t('filterWorking') : t('filterAll')}</button>
                    <button id="btnSort" style="padding:6px 8px;border-radius:6px;border:none;cursor:pointer;background:#999;color:#fff">${t('sort')}: ${sortMode}</button>
                    <button id="btnLang" style="padding:4px 6px;border-radius:6px;border:none;cursor:pointer;background:#ff9800;color:#111;font-weight:700">🌍</button>
                </div>
                <div id="pstatus" style="margin-bottom:8px;color:#bbb">${t('ready')}</div>
                <div id="plist" style="background:#0f0f10;border:1px solid #222;padding:8px;border-radius:6px;max-height:50vh;overflow:auto;white-space:pre-wrap;word-break:break-all"></div>
            </div>
        `;
        document.body.appendChild(w);

        // ===== Drag =====
        let dragging = false;
        let offset = { x: 0, y: 0 };
        const header = document.getElementById('phead');
        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            dragging = true;
            offset.x = e.clientX - w.offsetLeft;
            offset.y = e.clientY - w.offsetTop;
            header.style.cursor = 'grabbing';
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            w.style.left = (e.clientX - offset.x) + 'px';
            w.style.top = (e.clientY - offset.y) + 'px';
        });
        document.addEventListener('mouseup', () => {
            if (dragging) {
                dragging = false;
                header.style.cursor = 'grab';
                GM_setValue(STORAGE_PREFIX + 'pos', JSON.stringify({
                    top: parseInt(w.style.top, 10) || 50,
                    left: parseInt(w.style.left, 10) || 50
                }));
            }
        });

        // ===== Buttons =====
        document.getElementById('btnClose').addEventListener('click', () => w.remove());
        document.getElementById('btnCollapse').addEventListener('click', () => {
            const content = document.getElementById('pcontent');
            const collapsedNow = content.style.display === 'none';
            content.style.display = collapsedNow ? 'block' : 'none';
            document.getElementById('btnCollapse').textContent = collapsedNow ? '−' : '+';
            GM_setValue(STORAGE_PREFIX + 'collapsed', (!collapsedNow).toString());
        });
        document.getElementById('btnLoad').addEventListener('click', loadSources);
        document.getElementById('btnCopy').addEventListener('click', () => {
            navigator.clipboard.writeText(formatRenderText());
            setStatus(t('copied'));
        });
        document.getElementById('btnDownload').addEventListener('click', () => {
            const blob = new Blob([formatRenderText()], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'proxies_v20.txt';
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
        document.getElementById('btnFilter').addEventListener('click', () => {
            showOnlyWorking = !showOnlyWorking;
            GM_setValue(STORAGE_PREFIX + 'filter', showOnlyWorking.toString());
            document.getElementById('btnFilter').textContent = showOnlyWorking ? t('filterWorking') : t('filterAll');
            renderList();
        });
        document.getElementById('btnSort').addEventListener('click', () => {
            const modes = ['working', 'country', 'speed'];
            let idx = modes.indexOf(sortMode);
            idx = (idx + 1) % modes.length;
            sortMode = modes[idx];
            GM_setValue(STORAGE_PREFIX + 'sortMode', sortMode);
            document.getElementById('btnSort').textContent = `${t('sort')}: ${sortMode}`;
            renderList();
        });
        document.getElementById('btnCheck').addEventListener('click', () => {
            if (!allProxies.length) {
                setStatus(t('refreshFirst'));
                return;
            }
            runChecks();
        });

        // ===== Language toggle =====
        document.getElementById('btnLang').addEventListener('click', () => {
            lang = lang === 'en' ? 'ru' : 'en';
            GM_setValue(STORAGE_PREFIX + 'lang', lang);
            updateUIText();
        });

        function updateUIText() {
            document.getElementById('pTitle').textContent = t('title');
            document.getElementById('btnCollapse').title = t('collapse');
            document.getElementById('btnClose').title = t('close');
            document.getElementById('btnLoad').textContent = t('refresh');
            document.getElementById('btnCheck').textContent = t('check');
            document.getElementById('btnCopy').textContent = t('copy');
            document.getElementById('btnDownload').textContent = t('download');
            document.getElementById('btnFilter').textContent = showOnlyWorking ? t('filterWorking') : t('filterAll');
            document.getElementById('btnSort').textContent = `${t('sort')}: ${sortMode}`;
            document.getElementById('pstatus').textContent = t('ready');
        }

        const saved = GM_getValue(STORAGE_PREFIX + 'lastProxies', null);
        if (saved) {
            try {
                const arr = JSON.parse(saved);
                if (Array.isArray(arr)) allProxies = arr;
                renderList();
            } catch (e) {}
        }

        setInterval(() => loadSources(), AUTO_UPDATE_INTERVAL_MS);
    }

    function setStatus(text) {
        const el = document.getElementById('pstatus');
        if (el) el.textContent = text;
    }

    function formatRenderText() {
        const box = document.getElementById('plist');
        return box ? box.textContent : '';
    }

    /* остальная логика loadSources, parseSourceText, finishLoading, callApiCheck, runChecks, renderList без изменений */

    createWidget();
})();
