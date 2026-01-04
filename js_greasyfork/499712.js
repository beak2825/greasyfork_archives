// ==UserScript==
// @name         Real-Debrid Premium Link Converter
// @version      5.4.6
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @include      *://*
// @exclude      https://real-debrid.com/*
// @description  Convert links using Real-Debrid. Uses /hosts/regex for accurate matching. Collapsed toolbox, selection/context conversion, improved results panel with textarea for successful links.
// @icon         https://icons.duckduckgo.com/ip2/real-debrid.com.ico
// @run-at       document-end
// @author       JRem
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499712/Real-Debrid%20Premium%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/499712/Real-Debrid%20Premium%20Link%20Converter.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // ---- storage/state ----
    let targetRegexStrings = GM_getValue('targetRegexStrings', []) || [];
    let token = GM_getValue('api_token', '') || '';
    const processedURLs = new Set();

    // compiled regex objects: [{ pattern: string, global: RegExp, test: RegExp }]
    let compiledRegexes = [];

    // results UI state: map url -> entry element
    const resultsEntries = new Map();
    const successfulDownloads = []; // list of download URLs added to textarea

    // ---- helpers ----
    function showToast(message, ms = 3000) {
        const toast = document.createElement('div');
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: '#333', color: '#fff', padding: '8px 14px', borderRadius: '6px',
            zIndex: '9999999', fontSize: '13px'
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), ms);
    }

    function gmRequest(options) {
        return new Promise((resolve, reject) => {
            options.onload = options.onload || (r => resolve(r));
            options.onerror = options.onerror || (e => reject(e));
            try {
                GM.xmlHttpRequest(options);
            } catch (e) {
                reject(e);
            }
        });
    }

    // ---- regex compile/load ----
    function compileServerRegexString(s) {
        if (!s || typeof s !== 'string') return null;
        let pattern = s;
        let flags = '';
        if (pattern.startsWith('/')) {
            const lastSlash = pattern.lastIndexOf('/');
            if (lastSlash > 0) {
                flags = pattern.slice(lastSlash + 1);
                pattern = pattern.slice(1, lastSlash);
            } else {
                pattern = pattern.slice(1);
            }
        }
        try {
            const global = new RegExp(pattern, 'ig'); // scanning
            const test = new RegExp(pattern, 'i');    // single test
            return { pattern, global, test, original: s };
        } catch (e) {
            console.warn('Failed to compile RD regex:', s, e);
            return null;
        }
    }

    function compileAllRegexes() {
        compiledRegexes = [];
        if (!Array.isArray(targetRegexStrings)) return;
        for (const s of targetRegexStrings) {
            const comp = compileServerRegexString(s);
            if (comp) compiledRegexes.push(comp);
        }
    }

    function isRegexListLoaded() { return compiledRegexes.length > 0; }

    function urlDomain(url) {
        try {
            const u = new URL(url);
            return u.hostname.replace(/^www\./i, '').toLowerCase();
        } catch (e) {
            const m = url.match(/https?:\/\/([^\/]+)/i);
            return m ? m[1].replace(/^www\./i, '').toLowerCase() : '';
        }
    }

    function extractUrlsUsingRegexesFromText(text) {
        if (!text || !isRegexListLoaded()) return [];
        const set = new Set();
        for (const comp of compiledRegexes) {
            try {
                comp.global.lastIndex = 0;
                let m;
                while ((m = comp.global.exec(text)) !== null) {
                    const candidate = m[0].trim();
                    if (candidate) set.add(candidate);
                }
            } catch (e) {
                console.warn('regex scan failed for pattern', comp.pattern, e);
            }
        }
        return Array.from(set);
    }

    function urlMatchesAnyRegex(href) {
        if (!href || !isRegexListLoaded()) return false;
        for (const comp of compiledRegexes) {
            try {
                if (comp.test.test(href)) return true;
            } catch (e) {}
        }
        return false;
    }

    // ---- RD API call ----
    async function rdUnrestrict(link) {
        if (!token) return { success: false, error: 'No API token' };
        try {
            const response = await gmRequest({
                method: 'POST',
                url: 'https://app.real-debrid.com/rest/1.0/unrestrict/link',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: `link=${encodeURIComponent(link)}&password=`
            });
            if (!response || !response.responseText) {
                return { success: false, error: `Empty response (status ${response ? response.status : 'n/a'})` };
            }
            if (response.status >= 200 && response.status < 300) {
                const json = JSON.parse(response.responseText);
                if (json && json.download) return { success: true, download: json.download, filename: json.filename, raw: json };
                return { success: false, error: JSON.stringify(json) };
            } else {
                let parsed = response.responseText;
                try { parsed = JSON.parse(response.responseText); } catch (e) {}
                return { success: false, error: `Status ${response.status}: ${JSON.stringify(parsed)}`, errmsg: `${parsed.error}` };
            }
        } catch (e) {
            return { success: false, error: e && e.message ? e.message : String(e) };
        }
    }

    // ---- find matched hosts on page ----
    function findMatchingHostsOnPage() {
        const map = new Map();
        // anchors
        document.querySelectorAll('a[href]').forEach(a => {
            try {
                const href = a.href;
                if (!href || !(href.startsWith('http://') || href.startsWith('https://'))) return;
                if (!urlMatchesAnyRegex(href)) return;
                const host = urlDomain(href);
                if (!map.has(host)) map.set(host, { urls: new Set(), anchors: new Set(), sources: new Set() });
                map.get(host).urls.add(href);
                map.get(host).anchors.add(a);
                map.get(host).sources.add('link');
            } catch (e) {}
        });
        // textareas
        document.querySelectorAll('textarea').forEach(t => {
            const urls = extractUrlsUsingRegexesFromText(t.value || '');
            urls.forEach(u => {
                const host = urlDomain(u);
                if (!map.has(host)) map.set(host, { urls: new Set(), anchors: new Set(), sources: new Set() });
                map.get(host).urls.add(u);
                map.get(host).sources.add('textarea');
            });
        });
        // pre/code
        document.querySelectorAll('pre, code').forEach(el => {
            const txt = el.innerText || el.textContent || '';
            const urls = extractUrlsUsingRegexesFromText(txt);
            urls.forEach(u => {
                const host = urlDomain(u);
                if (!map.has(host)) map.set(host, { urls: new Set(), anchors: new Set(), sources: new Set() });
                map.get(host).urls.add(u);
                map.get(host).sources.add('pre');
            });
        });
        // body text fallback
        const bodyText = document.body ? (document.body.innerText || '') : '';
        extractUrlsUsingRegexesFromText(bodyText).forEach(u => {
            const host = urlDomain(u);
            if (!map.has(host)) map.set(host, { urls: new Set(), anchors: new Set(), sources: new Set() });
            map.get(host).urls.add(u);
            map.get(host).sources.add('text');
        });
        const result = {};
        for (const [host, data] of map.entries()) {
            result[host] = { urls: Array.from(data.urls), anchors: Array.from(data.anchors), sources: Array.from(data.sources) };
        }
        return result;
    }

    // ---- Results panel UI (top list + successful textarea) ----
    let toolboxWrapper = null;
    let toolboxContent = null;
    let resultsPanel = null;
    let convertSelectionBtn = null;

    function createResultsPanel() {
        if (resultsPanel) return resultsPanel;

        resultsPanel = document.createElement('div');
        Object.assign(resultsPanel.style, {
            position: 'fixed',
            right: '10px',
            bottom: '10px',
            zIndex: '9999999',
            background: 'rgba(111,111,111,0.98)',
            color: '#000',
            fontSize: '14px',
            padding: '10px',
            borderRadius: '8px',
            width: '560px',
            maxHeight: '80vh',       // limit panel height relative to viewport
            overflow: 'auto',        // allow scrolling of the panel when content exceeds maxHeight
            boxShadow: '0 8px 30px rgba(0,0,0,0.25)'
        });

        // Header
        const header = document.createElement('div');
        Object.assign(header.style, { display: 'fixed', justifyContent: 'space-between', alignItems: 'center' });
        const title = document.createElement('div'); title.textContent = 'RD Conversion Results'; title.style.fontWeight = '700';
        const controls = document.createElement('div');
        const closeBtn = document.createElement('button'); closeBtn.textContent = 'Close'; closeBtn.onclick = () => resultsPanel.style.display = 'none';
        controls.appendChild(closeBtn);
        header.appendChild(title); header.appendChild(controls); resultsPanel.appendChild(header);


        // Top pane: list of URLs and statuses
        const topPane = document.createElement('div');
        topPane.id = 'rd-results-top';
        Object.assign(topPane.style, {
            display: 'fixed',
            marginTop: '4px',
            background: '#111',
            color: '#fff',
            fontSize: '14px',
            padding: '4px',
            borderRadius: '6px',
            maxHeight: '30vh',   // limit top pane height so bottom pane stays visible
            overflow: 'auto'     // internal scrollbar for the list
        });
        // instruction
        const topInfo = document.createElement('div');
        topInfo.textContent = 'Links and statuses (updated in place):';
        topInfo.style.marginBottom = '6px';
        topPane.appendChild(topInfo);
        const list = document.createElement('div'); list.id = 'rd-results-list';
        topPane.appendChild(list);
        resultsPanel.appendChild(topPane);

        // Bottom pane: textarea for successful downloads and buttons
        const bottomPane = document.createElement('div');
        bottomPane.id = 'rd-results-bottom';
        Object.assign(bottomPane.style, { marginTop: '10px' });

        const bottomInfo = document.createElement('div');
        bottomInfo.textContent = 'Successful download links (copyable):';
        bottomInfo.style.marginBottom = '6px';
        bottomPane.appendChild(bottomInfo);

        const textarea = document.createElement('textarea');
        textarea.id = 'rd-success-textarea';
        Object.assign(textarea.style, {
            display: 'fixed',
            width: '100%',
            height: '160px',       // fixed height for textarea
            maxHeight: '30vh',     // prevent bottom pane from growing too large
            boxSizing: 'border-box',
            padding: '8px',
            fontSize: '12px',
            overflow: 'auto'
        });
        textarea.readOnly = false;
        bottomPane.appendChild(textarea);

        const btnRow = document.createElement('div');
        Object.assign(btnRow.style, { display: 'flex', gap: '8px', marginTop: '6px' });
        const copyBtn = document.createElement('button'); copyBtn.textContent = 'Copy All'; copyBtn.onclick = () => {
            textarea.select();
            document.execCommand('copy');
            showToast('Copied to clipboard');
        };
        const clearBtn = document.createElement('button'); clearBtn.textContent = 'Clear'; clearBtn.onclick = () => {
            textarea.value = '';
            successfulDownloads.length = 0;
            showToast('Cleared successful links');
        };
        btnRow.appendChild(copyBtn); btnRow.appendChild(clearBtn);
        bottomPane.appendChild(btnRow);
        resultsPanel.appendChild(bottomPane);

        resultsPanel.style.display = 'none';
        document.body.appendChild(resultsPanel);
        return resultsPanel;
    }

    // Backwards-compat helper used by older code paths.
    // Adds a simple log line to the top results list. Keeps old appendResultLine calls working.
    function appendResultLine(text, success = null) {
        createResultsPanel();
        const list = document.getElementById('rd-results-list');
        if (!list) return;
        const line = document.createElement('div');
        line.textContent = text;
        line.style.marginBottom = '6px';
        if (success === true) line.style.color = 'green';
        else if (success === false) line.style.color = 'red';
        else line.style.color = '#fff';
        // Prepend for newest-first
        list.insertBefore(line, list.firstChild);
    }

    function ensureResultEntry(url) {
        createResultsPanel();
        if (resultsEntries.has(url)) return resultsEntries.get(url);
        const list = document.getElementById('rd-results-list');

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'space-between';
        row.style.padding = '6px';
        row.style.borderBottom = '1px solid rgba(255,255,255,0.06)';

        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.gap = '8px';
        const a = document.createElement('a');
        a.href = url;
        a.textContent = url.length > 80 ? url.slice(0, 77) + '…' : url;
        a.title = url;
        a.target = '_blank';
        a.style.color = '#fff';
        a.style.textDecoration = 'underline';
        a.style.wordBreak = 'break-all';
        left.appendChild(a);
        row.appendChild(left);

        const status = document.createElement('div');
        status.className = 'rd-status';
        status.textContent = 'pending';
        status.style.color = '#ffffff';
        status.style.fontWeight = '700';
        status.style.marginLeft = '8px';
        row.appendChild(status);

        // Attach to list and map
        list.insertBefore(row, list.firstChild);
        resultsEntries.set(url, { row, linkEl: a, statusEl: status });
        return resultsEntries.get(url);
    }

    function updateResultStatus(url, state, extraText) {
        // state: 'pending' | 'ok' | 'fail' | 'skip'
        const entry = ensureResultEntry(url);
        const statusEl = entry.statusEl;
        if (!statusEl) return;
        if (state === 'pending') {
            statusEl.textContent = extraText || 'pending';
            statusEl.style.color = '#ffffff';
        } else if (state === 'ok') {
            statusEl.textContent = extraText || 'OK';
            statusEl.style.color = 'green';
        } else if (state === 'fail') {
            statusEl.textContent = extraText || 'FAILED';
            statusEl.style.color = 'red';
        } else if (state === 'skip') {
            statusEl.textContent = extraText || 'SKIPPED';
            statusEl.style.color = 'gray';
        }
    }

    function appendSuccessfulDownload(downloadUrl) {
        const ta = document.getElementById('rd-success-textarea');
        if (!ta) {
            // ensure panel created
            createResultsPanel();
        }
        const downloadToAdd = downloadUrl.trim();
        if (!downloadToAdd) return;
        // avoid duplicates
        if (successfulDownloads.includes(downloadToAdd)) return;
        successfulDownloads.push(downloadToAdd);
        const textarea = document.getElementById('rd-success-textarea');
        if (textarea) {
            textarea.value = successfulDownloads.join('\n');
        }
    }

    // ---- toolbox UI and domain buttons (regex-based) ----
    function createToolbox() {
        if (toolboxWrapper) return toolboxWrapper;

        toolboxWrapper = document.createElement('div');
        Object.assign(toolboxWrapper.style, {
            position: 'fixed',
            zIndex: '999999',
            fontFamily: 'Arial, sans-serif',
            userSelect: 'none',
            touchAction: 'none'
        });

        // ---- saved-percent helpers (same as before) ----
        function getSavedPositionPct() {
            try { return GM_getValue('rd_button_pos_pct', null); } catch (e) { return null; }
        }
        function savePositionPctFromPx(leftPx, topPx) {
            try {
                const leftPct = Math.round((leftPx / window.innerWidth) * 10000) / 10000;
                const topPct = Math.round((topPx / window.innerHeight) * 10000) / 10000;
                GM_setValue('rd_button_pos_pct', { leftPct, topPct });
            } catch (e) { console.warn('Failed to save position pct', e); }
        }
        function clearSavedPositionPct() { try { GM_setValue('rd_button_pos_pct', null); } catch (e) {} }

        function clampToViewportPx(leftPx, topPx, w = 60, h = 60) {
            const minLeft = 10;
            const minTop = 10;
            const maxLeft = Math.max(minLeft, window.innerWidth - w - 10);
            const maxTop = Math.max(minTop, window.innerHeight - h - 10);
            const clampedLeft = Math.min(Math.max(minLeft, leftPx), maxLeft);
            const clampedTop = Math.min(Math.max(minTop, topPx), maxTop);
            return { left: clampedLeft, top: clampedTop };
        }

        // Apply saved pct (converted to px)
        const savedPct = getSavedPositionPct();
        if (savedPct && typeof savedPct.leftPct === 'number' && typeof savedPct.topPct === 'number') {
            let leftPx = Math.round(savedPct.leftPct * window.innerWidth);
            let topPx = Math.round(savedPct.topPct * window.innerHeight);
            const clamped = clampToViewportPx(leftPx, topPx, 60, 60);
            toolboxWrapper.style.left = clamped.left + 'px';
            toolboxWrapper.style.top = clamped.top + 'px';
        } else {
            const defaultLeft = Math.max(10, window.innerWidth - 54);
            toolboxWrapper.style.left = defaultLeft + 'px';
            toolboxWrapper.style.top = '10px';
        }

        // Collapsed button
        const collapsedBtn = document.createElement('button');
        collapsedBtn.textContent = 'RD';
        collapsedBtn.title = 'Open Real-Debrid Tools (drag to move)';
        Object.assign(collapsedBtn.style, {
            width: '44px', height: '44px', borderRadius: '50%', border: 'none',
            background: '#111', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
            cursor: 'grab', fontWeight: '700', fontSize: '14px', display: 'inline-block'
        });
        toolboxWrapper.appendChild(collapsedBtn);

        // Expanded content (positioned relative to wrapper)
        toolboxContent = document.createElement('div');
        Object.assign(toolboxContent.style, {
            display: 'none',
            position: 'absolute',
            left: '0px',
            top: '52px',
            marginTop: '6px',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            padding: '10px',
            borderRadius: '8px',
            width: '340px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
        });

        // Header + drag handle (always draggable)
        const contentHeader = document.createElement('div');
        Object.assign(contentHeader.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', cursor: 'move' });
        const title = document.createElement('div'); title.textContent = 'Real-Debrid Tools'; title.style.fontWeight = '700';
        const dragHandle = document.createElement('div'); dragHandle.textContent = '⇳'; dragHandle.title = 'Drag to move';
        Object.assign(dragHandle.style, { cursor: 'move', paddingLeft: '6px' });
        contentHeader.appendChild(title); contentHeader.appendChild(dragHandle);
        toolboxContent.appendChild(contentHeader);

        // Controls (Refresh, Token, Reset Position)
        const controls = document.createElement('div');
        controls.style.display = 'flex'; controls.style.gap = '6px'; controls.style.flexWrap = 'wrap';
        const refreshBtn = document.createElement('button'); refreshBtn.textContent = 'Refresh Regexes'; refreshBtn.onclick = async () => { await updateRDRegexes().catch(e => console.error(e)); buildDomainButtons(); showToast('Regex list refreshed'); };
        const updateTokenBtn = document.createElement('button'); updateTokenBtn.textContent = 'Update Token'; updateTokenBtn.onclick = () => updatetoken();
        const resetPosBtn = document.createElement('button'); resetPosBtn.textContent = 'Reset Position'; resetPosBtn.title = 'Reset floating button to default position';
        resetPosBtn.onclick = () => { clearSavedPositionPct(); const defaultLeft = Math.max(10, window.innerWidth - 54); toolboxWrapper.style.left = defaultLeft + 'px'; toolboxWrapper.style.top = '10px'; showToast('Position reset'); };
        controls.appendChild(refreshBtn); controls.appendChild(updateTokenBtn); controls.appendChild(resetPosBtn);
        toolboxContent.appendChild(controls);

        // Convert Selection button
        convertSelectionBtn = document.createElement('button');
        convertSelectionBtn.textContent = 'Convert Selection';
        convertSelectionBtn.style.display = 'block';
        convertSelectionBtn.style.marginTop = '8px';
        convertSelectionBtn.disabled = true;
        convertSelectionBtn.onclick = async () => {
            const sel = window.getSelection();
            const urls = extractUrlsFromSelection(sel);
            if (!urls || urls.length === 0) { showToast('No matching RD URLs in selection.'); return; }
            const grouped = {};
            urls.forEach(u => { const d = urlDomain(u); if (!grouped[d]) grouped[d] = []; grouped[d].push(u); });
            for (const d of Object.keys(grouped)) await convertDomainLinks(d, grouped[d], []);
        };
        toolboxContent.appendChild(convertSelectionBtn);

        // Domain buttons container & other controls
        const container = document.createElement('div'); container.id = 'rd-domain-buttons-container'; container.style.marginTop = '8px'; container.style.maxHeight = '48vh'; container.style.overflow = 'auto';
        toolboxContent.appendChild(container);
        const toggleResults = document.createElement('button'); toggleResults.textContent = 'Show/Hide Results'; toggleResults.style.display = 'block'; toggleResults.style.marginTop = '8px';
        toggleResults.onclick = () => { if (!resultsPanel) createResultsPanel(); resultsPanel.style.display = resultsPanel.style.display === 'none' ? 'block' : 'none'; };
        toolboxContent.appendChild(toggleResults);
        const collapseBtn = document.createElement('button'); collapseBtn.textContent = 'Collapse'; collapseBtn.style.display = 'block'; collapseBtn.style.marginTop = '8px'; collapseBtn.onclick = () => toggleToolbox(false);
        toolboxContent.appendChild(collapseBtn);

        toolboxWrapper.appendChild(toolboxContent);
        document.body.appendChild(toolboxWrapper);

        // Toggle function that ensures content stays visible
        function toggleToolbox(expand) {
            if (expand === undefined) expand = toolboxContent.style.display === 'none';
            if (!expand) {
                toolboxContent.style.display = 'none';
                collapsedBtn.style.display = 'inline-block';
                return;
            }
            toolboxContent.style.display = 'block';
            collapsedBtn.style.display = 'none';

            const wrapperRect = toolboxWrapper.getBoundingClientRect();
            toolboxContent.style.visibility = 'hidden';
            toolboxContent.style.display = 'block';
            const contentRect = toolboxContent.getBoundingClientRect();

            let relLeft = 0;
            const overflowRight = wrapperRect.left + contentRect.width + 10 - window.innerWidth;
            if (overflowRight > 0) relLeft = -overflowRight;
            if (wrapperRect.left + relLeft < 10) relLeft = 10 - wrapperRect.left;

            const spaceBelow = window.innerHeight - (wrapperRect.top + wrapperRect.height) - 10;
            const spaceAbove = wrapperRect.top - 10;
            let relTop;
            if (contentRect.height <= spaceBelow) relTop = wrapperRect.height + 6;
            else if (contentRect.height <= spaceAbove) relTop = -contentRect.height - 6;
            else {
                const maxTop = window.innerHeight - contentRect.height - 10 - wrapperRect.top;
                relTop = Math.max(-contentRect.height, maxTop);
            }

            toolboxContent.style.left = relLeft + 'px';
            toolboxContent.style.top = relTop + 'px';
            toolboxContent.style.visibility = 'visible';
        }

        // ---- Dragging (edge/movement threshold logic) ----
        // Parameters:
        const edgeDragWidth = 10;   // px from the circular button edge that allows immediate drag
        const moveThreshold = 8;    // px movement required to begin drag when not on edge

        let pointerDown = false;
        let startClientX = 0, startClientY = 0;
        let startLeft = 0, startTop = 0;
        let dragging = false;
        let dragAllowedImmediate = false; // true when started on edge or handle
        let movedDuringInteraction = false;

        function startInteraction(clientX, clientY) {
            pointerDown = true;
            startClientX = clientX;
            startClientY = clientY;
            const rect = toolboxWrapper.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            dragging = false;
            movedDuringInteraction = false;
            dragAllowedImmediate = false;
        }

        function beginActualDrag() {
            dragging = true;
            collapsedBtn.style.cursor = 'grabbing';
            // if the content panel is open, hide it while dragging to avoid odd measuring issues
            toolboxContent.style.display = 'none';
        }

        function doInteractionMove(clientX, clientY) {
            if (!pointerDown) return;
            const dx = clientX - startClientX;
            const dy = clientY - startClientY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            movedDuringInteraction = movedDuringInteraction || dist > 0;

            if (!dragging) {
                // If immediate allowed (start on edge or handle), start drag as soon as there's any movement
                if (dragAllowedImmediate) {
                    beginActualDrag();
                } else if (dist >= moveThreshold) {
                    // movement threshold passed -> start drag
                    beginActualDrag();
                } else {
                    // not enough movement yet; don't move wrapper
                    return;
                }
            }

            // dragging is active: apply new position
            const newLeft = startLeft + dx;
            const newTop = startTop + dy;
            const clamped = clampToViewportPx(newLeft, newTop, toolboxWrapper.offsetWidth, toolboxWrapper.offsetHeight);
            toolboxWrapper.style.left = clamped.left + 'px';
            toolboxWrapper.style.top = clamped.top + 'px';
            toolboxWrapper.style.right = 'auto';
        }

        function endInteraction() {
            if (!pointerDown) return;
            pointerDown = false;
            // If we were dragging, save percentage and finish
            if (dragging) {
                dragging = false;
                collapsedBtn.style.cursor = 'grab';
                const rect = toolboxWrapper.getBoundingClientRect();
                savePositionPctFromPx(rect.left, rect.top);
                showToast('Position saved');
                // small delay to avoid immediate re-opening from the same click
                setTimeout(() => { movedDuringInteraction = false; }, 50);
                return;
            }
            // Not dragging -> this was a click/tap (only if pointer down/up without having moved past threshold)
            movedDuringInteraction = false;
            // Click behavior will be handled by the click listener on collapsedBtn
        }

        // Pointer/mouse/touch event handlers: unify using pointer events where available
        function onPointerDownForButton(e) {
            // Accept mouse and touch pointer coordinates
            const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
            const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
            startInteraction(clientX, clientY);

            // Edge detection: check if pointer started near the circular button edge
            const btnRect = collapsedBtn.getBoundingClientRect();
            const radius = btnRect.width / 2;
            const centerX = btnRect.left + radius;
            const centerY = btnRect.top + radius;
            const distFromCenter = Math.hypot(clientX - centerX, clientY - centerY);
            // if pointer is within edgeDragWidth of the outer edge, allow immediate drag
            if (distFromCenter >= Math.max(0, radius - edgeDragWidth)) {
                dragAllowedImmediate = true;
            } else {
                dragAllowedImmediate = false;
            }

            // Add move/up listeners on document to track dragging even if pointer leaves button
            document.addEventListener('mousemove', pointerMoveHandler);
            document.addEventListener('mouseup', pointerUpHandler);
            document.addEventListener('touchmove', pointerMoveHandler, { passive: false });
            document.addEventListener('touchend', pointerUpHandler);
            // prevent default to avoid accidental text selection on desktop
            e.preventDefault && e.preventDefault();
        }

        function onPointerDownForHandle(e) {
            // handle in header: allow immediate drag
            const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
            const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
            startInteraction(clientX, clientY);
            dragAllowedImmediate = true; // always allow when starting from the header handle
            document.addEventListener('mousemove', pointerMoveHandler);
            document.addEventListener('mouseup', pointerUpHandler);
            document.addEventListener('touchmove', pointerMoveHandler, { passive: false });
            document.addEventListener('touchend', pointerUpHandler);
            e.preventDefault && e.preventDefault();
        }

        function pointerMoveHandler(e) {
            const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
            const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
            doInteractionMove(clientX, clientY);
            if (e.cancelable) e.preventDefault();
        }

        function pointerUpHandler(e) {
            // remove listeners
            document.removeEventListener('mousemove', pointerMoveHandler);
            document.removeEventListener('mouseup', pointerUpHandler);
            document.removeEventListener('touchmove', pointerMoveHandler);
            document.removeEventListener('touchend', pointerUpHandler);
            endInteraction();
        }

        // Start drag on collapsed button or header handle
        collapsedBtn.addEventListener('mousedown', onPointerDownForButton);
        collapsedBtn.addEventListener('touchstart', onPointerDownForButton, { passive: false });
        dragHandle.addEventListener('mousedown', onPointerDownForHandle);
        dragHandle.addEventListener('touchstart', onPointerDownForHandle, { passive: false });

        // collapsed button click toggles toolbox only if we didn't start a drag
        collapsedBtn.addEventListener('click', (ev) => {
            // If pointerDown triggers drag or movement happened, ignore click
            // movedDuringInteraction is set when movement occurs; pointerDown false here means interaction ended without dragging
            // However to be safe, check dragging state - if a drag was started recently we suppressed click by not performing open
            if (dragging || movedDuringInteraction) {
                // reset moved flag and ignore
                movedDuringInteraction = false;
                return;
            }
            // otherwise open toolbox
            toggleToolbox(true);
            buildDomainButtons();
        });

        // close toolbox when clicking outside
        document.addEventListener('click', (ev) => {
            if (!toolboxWrapper.contains(ev.target) && toolboxContent.style.display === 'block') {
                toolboxContent.style.display = 'none';
                collapsedBtn.style.display = 'inline-block';
            }
        });

        // On window resize: reapply saved percentages (if any) or clamp current px and save
        window.addEventListener('resize', () => {
            const saved = getSavedPositionPct();
            if (saved && typeof saved.leftPct === 'number' && typeof saved.topPct === 'number') {
                let leftPx = Math.round(saved.leftPct * window.innerWidth);
                let topPx = Math.round(saved.topPct * window.innerHeight);
                const clamped = clampToViewportPx(leftPx, topPx, 60, 60);
                toolboxWrapper.style.left = clamped.left + 'px';
                toolboxWrapper.style.top = clamped.top + 'px';
            } else {
                const rect = toolboxWrapper.getBoundingClientRect();
                const clamped = clampToViewportPx(rect.left, rect.top, rect.width, rect.height);
                toolboxWrapper.style.left = clamped.left + 'px';
                toolboxWrapper.style.top = clamped.top + 'px';
                savePositionPctFromPx(clamped.left, clamped.top);
            }
        });

        return toolboxWrapper;
    }

    // ---- domain buttons ----
    function clearDomainButtons() {
        const container = document.getElementById('rd-domain-buttons-container');
        if (container) container.innerHTML = '';
    }

    function buildDomainButtons() {
        createToolbox();
        clearDomainButtons();
        const container = document.getElementById('rd-domain-buttons-container');

        if (!isRegexListLoaded()) {
            const msg = document.createElement('div'); msg.textContent = 'Regex list not loaded. Click "Refresh Regexes".'; container.appendChild(msg); return;
        }

        const found = findMatchingHostsOnPage();
        const hosts = Object.keys(found);
        if (!hosts.length) {
            const none = document.createElement('div'); none.textContent = 'No matching RD links detected on this page.'; container.appendChild(none); return;
        }

        hosts.forEach(host => {
            const info = found[host];
            const btn = document.createElement('button');
            btn.textContent = `${host} (${info.urls.length})`;
            btn.style.display = 'block'; btn.style.marginTop = '6px';
            btn.onclick = async () => { await convertDomainLinks(host, info.urls, info.anchors); };
            container.appendChild(btn);
        });

        const allBtn = document.createElement('button'); allBtn.textContent = 'Convert ALL matched links on page'; allBtn.style.display = 'block'; allBtn.style.marginTop = '8px';
        allBtn.onclick = async () => { for (const host of hosts) await convertDomainLinks(host, found[host].urls, found[host].anchors); };
        container.appendChild(allBtn);
    }

    // ---- conversion routine (updates results UI in-place) ----
    async function convertDomainLinks(domain, urls, anchors = []) {
        if (!Array.isArray(urls) || urls.length === 0) { showToast(`No links to convert for ${domain}`); return; }
        showToast(`Converting ${urls.length} links for ${domain}...`, 2000);

        // ensure top entries exist and set pending
        urls.forEach(u => updateResultStatus(u, 'pending', 'pending'));

        for (const url of urls) {
            if (processedURLs.has(url)) {
                updateResultStatus(url, 'skip', 'skipped');
                continue;
            }
            updateResultStatus(url, 'pending', 'processing');
            const res = await rdUnrestrict(url);
            if (res.success) {
                updateResultStatus(url, 'ok', 'OK');
                // update anchors on page
                anchors.forEach(a => { try { if (a.href === url) { a.href = res.download; if (res.filename) a.textContent = res.filename; a.setAttribute('data-rd-converted', '1'); } } catch (e) {} });
                // replace in textareas / pre blocks
                document.querySelectorAll('textarea').forEach(t => { if (t.value && t.value.includes(url)) t.value = t.value.split(url).join(res.download); });
                document.querySelectorAll('pre, code').forEach(el => { if ((el.textContent || '').includes(url)) el.textContent = (el.textContent || '').split(url).join(res.download); });
                processedURLs.add(url);
                // add the download link to successful textarea
                appendSuccessfulDownload(res.download);
            } else {
                updateResultStatus(url, 'fail', 'FAILED');
                // include error as title on status for tooltip
                const entry = resultsEntries.get(url);
                if (entry && entry.statusEl) entry.statusEl.title = res.error;
            }
            await new Promise(r => setTimeout(r, 180));
        }
        showToast(`Done converting ${domain}`);
    }

    // ---- selection/context menu extraction with regexes ----
    function extractUrlsFromSelection(sel) {
        const urls = new Set();
        if (!sel || !isRegexListLoaded()) return [];
        try {
            if (sel.rangeCount && sel.rangeCount > 0) {
                for (let i = 0; i < sel.rangeCount; i++) {
                    const range = sel.getRangeAt(i);
                    const frag = range.cloneContents();
                    if (frag.querySelectorAll && frag.querySelectorAll('a[href]').length) {
                        frag.querySelectorAll('a[href]').forEach(a => {
                            let href = a.getAttribute('href') || '';
                            if (!href) return;
                            try { href = new URL(href, document.baseURI).href; } catch (e) {}
                            if (urlMatchesAnyRegex(href)) urls.add(href);
                        });
                    }
                    const txt = (frag.textContent || '').trim();
                    if (txt) extractUrlsUsingRegexesFromText(txt).forEach(u => urls.add(u));
                    else { const plain = sel.toString(); if (plain) extractUrlsUsingRegexesFromText(plain).forEach(u => urls.add(u)); }
                }
            } else {
                const plain = sel.toString();
                if (plain) extractUrlsUsingRegexesFromText(plain).forEach(u => urls.add(u));
            }
        } catch (e) {
            const plain = sel.toString();
            if (plain) extractUrlsUsingRegexesFromText(plain).forEach(u => urls.add(u));
        }
        return Array.from(urls);
    }

    let customMenu = null;
    function hideCustomMenu() { if (customMenu && customMenu.parentNode) customMenu.parentNode.removeChild(customMenu); customMenu = null; }

    function onContextMenu(e) {
        const sel = window.getSelection();
        const urls = extractUrlsFromSelection(sel);
        if (!urls || !urls.length) { hideCustomMenu(); return; }
        e.preventDefault();
        hideCustomMenu();
        customMenu = document.createElement('div');
        Object.assign(customMenu.style, { position: 'fixed', zIndex: '99999999', left: `${e.clientX}px`, top: `${e.clientY}px`, background: '#111', color: '#fff', padding: '8px', borderRadius: '6px', boxShadow: '0 6px 20px rgba(0,0,0,0.4)', fontSize: '13px' });
        const title = document.createElement('div'); title.textContent = `Convert ${urls.length} selected RD link(s)`; title.style.fontWeight = '700'; title.style.marginBottom = '6px';
        customMenu.appendChild(title);

        const allBtn = document.createElement('button'); allBtn.textContent = 'Convert all selected links'; allBtn.style.display = 'block';
        allBtn.onclick = async () => { hideCustomMenu(); const grouped = {}; urls.forEach(u => { const d = urlDomain(u); if (!grouped[d]) grouped[d] = []; grouped[d].push(u); }); for (const d of Object.keys(grouped)) await convertDomainLinks(d, grouped[d], []); };
        customMenu.appendChild(allBtn);

        const grouped = {};
        urls.forEach(u => { const d = urlDomain(u); if (!grouped[d]) grouped[d] = []; grouped[d].push(u); });

        Object.keys(grouped).forEach(d => {
            const btn = document.createElement('button'); btn.textContent = `Convert ${d} (${grouped[d].length})`; btn.style.display = 'block'; btn.style.marginTop = '6px';
            btn.onclick = async () => { hideCustomMenu(); await convertDomainLinks(d, grouped[d], []); };
            customMenu.appendChild(btn);
        });

        const cancelBtn = document.createElement('button'); cancelBtn.textContent = 'Cancel'; cancelBtn.style.display = 'block'; cancelBtn.style.marginTop = '6px'; cancelBtn.onclick = () => hideCustomMenu();
        customMenu.appendChild(cancelBtn);

        document.body.appendChild(customMenu);
    }

    function installSelectionContextHandler() {
        document.addEventListener('contextmenu', onContextMenu);
        document.addEventListener('click', () => hideCustomMenu());
        window.addEventListener('blur', () => hideCustomMenu());
        document.addEventListener('selectionchange', () => {
            if (!convertSelectionBtn) return;
            const sel = window.getSelection();
            const urls = extractUrlsFromSelection(sel);
            if (urls && urls.length) { convertSelectionBtn.disabled = false; convertSelectionBtn.textContent = `Convert Selection (${urls.length})`; }
            else { convertSelectionBtn.disabled = true; convertSelectionBtn.textContent = 'Convert Selection'; }
        });
    }

    // ---- per-link buttons (only for matches) ----
    function createFastDownloadButton(linkElement, fileURL) {
        if (!linkElement || linkElement.getAttribute('realdebrid')) return;
        if (!urlMatchesAnyRegex(fileURL)) return;
        const button = document.createElement('button');
        button.innerHTML = 'Send to RD';
        Object.assign(button.style, { marginLeft: '6px', padding: '2px 6px', backgroundColor: '#000', color: '#fff', borderRadius: '6px', border: 'none', cursor: 'pointer' });
        button.onclick = async (ev) => {
            ev.preventDefault(); ev.stopPropagation();
            button.disabled = true; button.textContent = 'Sending...';
            // ensure result entry present
            updateResultStatus(fileURL, 'pending', 'sending');
            const res = await rdUnrestrict(fileURL);
            if (res.success) {
                try { linkElement.href = res.download; if (res.filename) linkElement.textContent = res.filename; } catch (e) {}
                updateResultStatus(fileURL, 'ok', 'OK');
                appendSuccessfulDownload(res.download);
                button.remove();
            } else {
                updateResultStatus(fileURL, 'fail', 'FAILED');
                const entry = resultsEntries.get(fileURL);
                if (entry && entry.statusEl) entry.statusEl.title = res.error;
                button.textContent = 'Failed - ' + res.errmsg;
                setTimeout(() => button.disabled = false, 2000);
            }
        };
        linkElement.setAttribute('realdebrid', 'true');
        linkElement.insertAdjacentElement('afterend', button);
    }

    function createMagnetButton(linkElement, fileURL) {
        if (!linkElement || linkElement.getAttribute('realdebrid-magnet')) return;
        let button = document.createElement('button');
        button.innerHTML = 'Send Magnet to RD';
        button.style.marginLeft = '6px';
        button.style.padding = '2px 6px';
        button.style.backgroundColor = 'green';
        button.style.color = '#fff';
        button.style.borderRadius = '6px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.onclick = async (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            button.disabled = true;
            // Mark the magnet in results UI
            updateResultStatus(fileURL, 'pending', 'adding magnet');
            appendResultLine && appendResultLine(`[magnet] adding ${fileURL}...`);

            try {
                const addResp = await gmRequest({
                    method: 'POST',
                    url: 'https://api.real-debrid.com/rest/1.0/torrents/addMagnet',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: `magnet=${encodeURIComponent(fileURL)}`
            });

            if (addResp.status === 201) {
                const json = JSON.parse(addResp.responseText);
                const torrentId = json.id;
                updateResultStatus(fileURL, 'ok', 'magnet added');
                appendResultLine && appendResultLine(`[magnet] added ID ${torrentId}`, true);
                showToast('Magnet successfully added to Real-Debrid.');

                // Now attempt to select all files
                try {
                    const selectResp = await gmRequest({
                        method: 'POST',
                        url: `https://api.real-debrid.com/rest/1.0/torrents/selectFiles/${torrentId}`,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: 'files=all'
                    });

                    if (selectResp.status === 200 || selectResp.status === 204) {
                        updateResultStatus(fileURL, 'ok', 'files selected');
                        appendResultLine && appendResultLine(`[magnet] All files selected for ${torrentId}`, true);
                        showToast('All files selected for download.');
                    } else {
                        updateResultStatus(fileURL, 'fail', `select failed (${selectResp.status})`);
                        appendResultLine && appendResultLine(`[magnet] Failed to select files: ${selectResp.status}`, false);
                    }
                } catch (e) {
                    updateResultStatus(fileURL, 'fail', 'select error');
                    appendResultLine && appendResultLine(`[magnet] Error selecting files: ${e && e.message ? e.message : e}`, false);
                }

            } else {
                // Add magnet failed
                let err = addResp.responseText || `status ${addResp.status}`;
                updateResultStatus(fileURL, 'fail', 'add failed');
                appendResultLine && appendResultLine(`[magnet] Failed to add magnet: ${addResp.status} ${err}`, false);
                showToast('Failed to add magnet link.');
            }
        } catch (e) {
            updateResultStatus(fileURL, 'fail', 'error');
            appendResultLine && appendResultLine(`[magnet] Error adding magnet: ${e && e.message ? e.message : e}`, false);
            showToast('Error adding magnet link.');
        } finally {
            // remove the button from UI
            try { button.remove(); } catch (e) {}
        }
    };
        linkElement.setAttribute('realdebrid-magnet', 'true');
        linkElement.insertAdjacentElement('afterend', button);
    }

    // ---- process page links & pre blocks ----
    function processLinks() {
        document.querySelectorAll('a[href]').forEach(link => {
            try {
                const href = link.href;
                if (!href) return;
                if (href.startsWith('magnet:?')) { if (!link.hasAttribute('realdebrid-magnet')) createMagnetButton(link, href); }
                else { if (!link.hasAttribute('realdebrid') && urlMatchesAnyRegex(href)) createFastDownloadButton(link, href); }
            } catch (e) {}
        });

        document.querySelectorAll('pre').forEach(pre => {
            if (pre.getAttribute('rd-processed')) return;
            const txt = pre.textContent || '';
            const urls = extractUrlsUsingRegexesFromText(txt);
            if (!urls || !urls.length) { pre.setAttribute('rd-processed', '1'); return; }
            const container = document.createElement('div');
            urls.forEach(u => {
                const a = document.createElement('a'); a.href = u; a.textContent = u; a.style.display = 'block'; a.style.wordBreak = 'break-all';
                container.appendChild(a);
                createFastDownloadButton(a, u);
            });
            pre.parentNode.insertBefore(container, pre);
            pre.setAttribute('rd-processed', '1');
        });
    }

    // ---- mutation observer ----
    function debounce(fn, wait = 450) { let t = null; return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); }; }
    const observer = new MutationObserver(debounce(() => { processLinks(); buildDomainButtons(); }, 450));

    // ---- RD regex fetch ----
    async function updateRDRegexes() {
        try {
            const bearer = GM_getValue('api_token', '') || token || '';
            if (!bearer) { showToast('No API token. Use Update Token.'); return []; }
            const response = await gmRequest({ method: 'GET', url: 'https://api.real-debrid.com/rest/1.0/hosts/regex', headers: { 'Authorization': `Bearer ${bearer}` } });
            if (response.status === 200) {
                const arr = JSON.parse(response.responseText);
                if (Array.isArray(arr) && arr.length) {
                    targetRegexStrings = arr;
                    GM_setValue('targetRegexStrings', targetRegexStrings);
                    GM_setValue('lastUpdateTimestamp', Date.now());
                    compileAllRegexes();
                    return arr;
                } else { showToast('No regexes returned.'); return []; }
            } else {
                showToast(`Failed to fetch regexes: ${response.status}`);
                return [];
            }
        } catch (e) {
            console.error(e);
            showToast('Error updating regex list');
            throw e;
        }
    }

    // ---- token update ----
    async function updatetoken() {
        try {
            const response = await gmRequest({ method: 'GET', url: 'https://real-debrid.com/apitoken' });
            if (response.status === 200) {
                const text = response.responseText || '';
                const match = text.match(/document\.querySelectorAll\('input\[name=private_token\]'\)\[0\]\.value\s*=\s*'([^']+)'/);
                if (match && match[1]) {
                    token = match[1];
                    GM_setValue('api_token', token);
                    showToast('API token updated automatically.');
                    return token;
                } else {
                    const manual = prompt('API token not found automatically. Please paste your Real-Debrid API token:');
                    if (manual) { token = manual.trim(); GM_setValue('api_token', token); showToast('API token saved.'); return token; }
                    showToast('API token not set.'); return null;
                }
            } else { showToast('Failed to fetch token page.'); return null; }
        } catch (e) { console.error(e); showToast('Error updating token.'); return null; }
    }

    function ensureUpdateDDLDomains() {
        const last = GM_getValue('lastUpdateTimestamp', 0);
        const now = Date.now();
        const msPerDay = 24 * 60 * 60 * 1000;
        if (now - last >= msPerDay) updateRDRegexes().catch(e => console.error(e));
    }

    // ---- init ----
    function init() {
        token = GM_getValue('api_token', '') || token;
        targetRegexStrings = GM_getValue('targetRegexStrings', targetRegexStrings || []);
        compileAllRegexes();
        createToolbox();
        buildDomainButtons();
        processLinks();
        installSelectionContextHandler();
        observer.observe(document.body, { childList: true, subtree: true });
        ensureUpdateDDLDomains();
        try { GM_registerMenuCommand('Update API Token', updatetoken); GM_registerMenuCommand('Refresh RD Regexes', updateRDRegexes); } catch (e) {}
    }

    if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', init); else init();

})();