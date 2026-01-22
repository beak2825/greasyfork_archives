// ==UserScript==
// @name        FreshRSS NG Filter
// @namespace   https://github.com/hiroki-miya
// @version     1.0.5
// @description Mark as read and hide articles matching the rule in FreshRSS. Rules are described by regular expressions.
// @author      hiroki-miya
// @license     MIT
// @match       https://freshrss.example.net/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       unsafeWindow
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/509727/FreshRSS%20NG%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/509727/FreshRSS%20NG%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
#freshrss-ng-filter {
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
z-index: 10000;
background-color: white;
border: 1px solid black;
padding: 10px;
width: max-content;
}
#freshrss-ng-filter > h2 {
box-shadow: inset 0 0 0 0.5px black;
padding: 5px 10px;
text-align: center;
cursor: move;
}
#freshrss-ng-filter > h4 {
margin-top: 0;
}
#filter-list {
margin-bottom: 10px;
max-height: 30vh;
overflow-y: auto;
}
.filter-item  {
display: flex;
justify-content: space-between;
align-items: center;
}
#filter-edit > div {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 5px;
}
#filter-edit > div input {
margin: 0;
width: 500px;
padding: 0.25rem;
font-size: 0.9rem;
}
.filter-name,
#filter-edit > div > label {
flex-grow: 1;
margin-right: 10px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}
#filter-edit > div > div:has(input[type="checkbox"]) {
margin-left: 5px;
max-width: 90%;
width: 300px;
}
#filter-edit > div input[type="checkbox"] {
transform: scale(1.5);
margin-left: 4px;
}
.edit-filter, .delete-filter,
#filter-edit > div > input {
margin-left: 5px;
}
.filter-info-label {
display: inline;
}
.filter-info {
display: inline-block;
border-radius: 50%;
width: 16px;
height: 16px;
min-height: 16px;
line-height: 1.2;
margin-left: 4px;
position: relative;
top: -2px;
text-align: center;
background-color: black;
color: white;
font-weight: 700;
}
`);


    // Language for sorting
    const sortLocale = 'ja';
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    // Retrieve saved filters
    let savedFilters = GM_getValue('filters', {});
    let editingFilterName = null;

    // Precompiled filters for performance
    let compiledFilters = [];
    const FILTER_FIELDS = ['currentUrl', 'title', 'url', 'content', 'text'];
    const FORM_FIELDS = [
        ['filter-name', 'name', 'value', ''],
        ['filter-currentUrl', 'currentUrl', 'value', ''],
        ['filter-title', 'title', 'value', ''],
        ['filter-url', 'url', 'value', ''],
        ['filter-content', 'content', 'value', ''],
        ['filter-text', 'text', 'value', ''],
        ['filter-case', 'caseInsensitive', 'checked', false],
    ];

    function readForm() {
        const out = {};
        for (const [id, key, prop, def] of FORM_FIELDS) {
            const el = document.getElementById(id);
            out[key] = el ? (el[prop] ?? def) : def;
        }
        return out;
    }

    function writeForm(name = '', filter = {}) {
        const src = { name, ...filter };
        for (const [id, key, prop, def] of FORM_FIELDS) {
            const el = document.getElementById(id);
            if (!el) continue;
            el[prop] = src[key] ?? def;
        }
    }

    function rebuildCompiledFilters() {
        compiledFilters = Object.entries(savedFilters)
            .filter(([, f]) => !f.disabled)
            .map(([name, f]) => {
                const flags = f.caseInsensitive ? 'i' : '';
                const mk = (p) => (p ? new RegExp(p, flags) : null);
                const re = {
                    currentUrl: mk(f.currentUrl),
                    title: mk(f.title),
                    url: mk(f.url),
                    content: mk(f.content),
                    text: mk(f.text),
                };
                return { name, re };
            });
    }

    function persist({ refreshList = true, apply = true } = {}) {
        GM_setValue('filters', savedFilters);
        rebuildCompiledFilters();
        if (refreshList) updateFilterList();
        if (apply) applyAllFilters();
    }

    function areFiltersDisabled() {
        return Object.values(savedFilters).every(filter => filter.disabled);
    }

    function toggleAllFilters() {
        const disableAll = !areFiltersDisabled();
        Object.values(savedFilters).forEach(filter => { filter.disabled = disableAll; });
        persist();
    }

    function updateFilterList() {
        const filterNames = Object.keys(savedFilters).sort((a, b) => a.localeCompare(b, sortLocale));
        const filterList = filterNames.map(name => {
            const filter = savedFilters[name];
            const checked = filter.disabled ? 'checked' : '';
            return `
                <div class="filter-item">
                    <div class="filter-name">${name}</div>
                    <button class="edit-filter" data-name="${name}">Edit</button>
                    <button class="delete-filter" data-name="${name}">Delete</button>
                    <label><input type="checkbox" class="disable-filter" data-name="${name}" ${checked}> Disabled</label>
                </div>
            `;
        }).join('');

        const listEl = document.getElementById('filter-list');
        if (listEl) listEl.innerHTML = filterList || 'No registered filters';

        const toggleBtn = document.getElementById('fnfs-toggle-all-filters');
        if (toggleBtn) toggleBtn.innerText = areFiltersDisabled() ? 'Enable All Filters' : 'Disable All Filters';
    }

    function startEdit(filterName) {
        const filter = savedFilters[filterName];
        if (!filter) return;

        editingFilterName = filterName;
        writeForm(filterName, filter);

        const titleEl = $('#filter-edit-title');
        if (titleEl) titleEl.innerText = 'Edit Existing Filter';
        const saveBtn = $('#fnfs-save');
        if (saveBtn) saveBtn.innerText = 'Update';
    }

    function initEdit() {
        editingFilterName = null;
        writeForm('', {});
        const titleEl = $('#filter-edit-title');
        if (titleEl) titleEl.innerText = 'Create New Filter';
        const saveBtn = $('#fnfs-save');
        if (saveBtn) saveBtn.innerText = 'Save';
    }

    function bindListEvents(root) {
        const list = $('#filter-list', root);
        if (!list) return;

        list.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const name = btn.getAttribute('data-name');
            if (!name) return;

            if (btn.classList.contains('edit-filter')) {
                startEdit(name);
                return;
            }
            if (btn.classList.contains('delete-filter')) {
                delete savedFilters[name];
                persist();
            }
        });

        list.addEventListener('change', (e) => {
            const cb = e.target;
            if (!(cb instanceof HTMLInputElement) || !cb.classList.contains('disable-filter')) return;
            const name = cb.getAttribute('data-name');
            if (!name || !savedFilters[name]) return;
            savedFilters[name].disabled = cb.checked;
            persist({ refreshList: false });
            updateFilterList();
        });
    }

    function bindSettingsEvents(root) {
        $('#fnfs-save', root)?.addEventListener('click', () => {
            const form = readForm();
            const filterName = (form.name || '').trim();
            if (!filterName) {
                alert('Please enter a filter name');
                return;
            }

            const next = {
                currentUrl: form.currentUrl,
                title: form.title,
                url: form.url,
                content: form.content,
                text: form.text,
                caseInsensitive: !!form.caseInsensitive,
                disabled: false
            };
            savedFilters[filterName] = next;

            if (editingFilterName && editingFilterName !== filterName) {
                delete savedFilters[editingFilterName];
            }

            persist();
            showTooltip('Saved!');
            initEdit();
        });

        $('#fnfs-clear', root)?.addEventListener('click', initEdit);

        $('#fnfs-close', root)?.addEventListener('click', () => {
            root.remove();
        });

        $('#fnfs-toggle-all-filters', root)?.addEventListener('click', toggleAllFilters);
    }

    // Display filter settings
    function showSettings() {
    // Remove existing panel if opened before
    document.getElementById('freshrss-ng-filter')?.remove();
            const settingsHTML = `
                        <h2>NG Filter Settings</h2>
                        <h4>Saved Filters</h4>
                        <div id="filter-list"></div>
                        <button id="fnfs-toggle-all-filters">${areFiltersDisabled() ? 'Enable All Filters' : 'Disable All Filters'}</button>
                        <br>
                        <hr>
                        <h4 id="filter-edit-title">Create New Filter</h4>
                        <div id="filter-edit">
                        <div><label>Filter Name</label><input type="text" id="filter-name"></div>
                        <div><label>FreshRSS Feed List URL</label><input type="text" id="filter-currentUrl"></div>
                        <div><label>Title</label><input type="text" id="filter-title"></div>
                        <div><label>Content URL</label><input type="text" id="filter-url"></div>
                        <div><label class="filter-info-label">Content<div title="article.flux_content.innerText" class="filter-info">i</div></label><input type="text" id="filter-content"></div>
                        <div><label class="filter-info-label">Text<div title="div.text.innerHTML" class="filter-info">i</div></label><input type="text" id="filter-text"></div>
                        <div><label>Case insensitive?</label><div><input type="checkbox" id="filter-case"></div></div>
                        <br>
                        </div>
                        <button id="fnfs-save">Save</button>
                        <button id="fnfs-clear">Clear</button>
                        <button id="fnfs-close">Close</button>
                    `;
    const settingsDiv = document.createElement('div');
    settingsDiv.id = 'freshrss-ng-filter';
    settingsDiv.innerHTML = settingsHTML;
    document.body.appendChild(settingsDiv);

    // Initial render of saved filter list
    updateFilterList();

    // Make settings panel draggable
    makeDraggable(settingsDiv);

    // Bind UI events once (delegation)
    bindListEvents(settingsDiv);
    bindSettingsEvents(settingsDiv);
}

function applyAllFilters() {
    if (!compiledFilters.length) return;

    const currentPageUrl = window.location.href;
    for (const article of $$('#stream > .flux')) {
        const title = article.querySelector('a.item-element.title')?.innerText || '';
        const url = article.querySelector('a.item-element.title')?.href || '';
        const content = article.querySelector('.flux_content')?.innerText || '';
        const text = article.querySelector('div.text')?.innerHTML || '';

        for (const { re } of compiledFilters) {
            const currentUrlMatch = !re.currentUrl || re.currentUrl.test(currentPageUrl);
            const titleMatch = !re.title || re.title.test(title);
            const urlMatch = !re.url || re.url.test(url);
            const contentMatch = !re.content || re.content.test(content);
            const textMatch = !re.text || re.text.test(text);

            if (currentUrlMatch && titleMatch && urlMatch && contentMatch && textMatch) {
                markAsNG(article);
                break;
            }
        }
    }
}

    function showTooltip(message) {
            // Create the tooltip element
            const tooltip = document.createElement('div');
            tooltip.textContent = message;
            tooltip.style.position = 'fixed';
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '10px 20px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.zIndex = '10000';
            tooltip.style.fontSize = '16px';
            tooltip.style.textAlign = 'center';

            // Add the tooltip to the page
            document.body.appendChild(tooltip);

            // Automatically remove the tooltip after 1 second
            setTimeout(() => {
                document.body.removeChild(tooltip);
            }, 1000);
        }

        // Make element draggable
        function makeDraggable(elmnt) {
            const header = elmnt.querySelector('h2');
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            header.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();

                // Get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();

                // Calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                // Set the element's new position:
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

    

        // -----------------------------
        // Mark as read (persist) helpers
        // (minimal addition: used only by markAsNG)
        // -----------------------------
        function htmlDecode(s) { const t = document.createElement('textarea'); t.innerHTML = s; return t.value; }

        function getCtx() {
            if (window.context && typeof window.context === 'object') return window.context;
            const el = document.getElementById('jsonVars');
            if (!el) return null;
            const raw = (el.textContent || '').trim();
            if (!raw) return null;
            const txt = (raw.includes('&quot;') || raw.includes('&#')) ? htmlDecode(raw) : raw;
            try { return JSON.parse(txt); } catch { return null; }
        }

        function csrfOf(ctx) {
            const c = ctx && (ctx.csrf || ctx._csrf || ctx.csrf_token || ctx.token);
            if (typeof c === 'string' && c) return c;
            const meta = document.querySelector('meta[name="csrf-token"], meta[name="csrf"], meta[name="_csrf"]');
            if (meta?.content) return meta.content;
            const inp = document.querySelector('input[name="_csrf"], input[name="csrf"], input[name="csrf_token"]');
            if (inp?.value) return inp.value;
            return '';
        }

        function readTplOf(ctx) {
            const found = [], seen = new Set();
            const walk = (o) => {
                if (!o || typeof o !== 'object' || seen.has(o)) return;
                seen.add(o);
                for (const k of Object.keys(o)) {
                    const v = o[k];
                    if (typeof v === 'string') {
                        if (/c=entry/i.test(v) && /a=read/i.test(v)) found.push(v);
                    } else if (v && typeof v === 'object') {
                        walk(v);
                    }
                }
            };
            walk(ctx);
            return found.find(s => /ajax=1/i.test(s)) || found[0] || '';
        }

        function entryIdOf(articleElement) {
            const ds = articleElement.dataset || {};
            for (const k of ['entryId', 'entry', 'id', 'fluxId', 'id_entry', 'idEntry']) {
                const v = ds[k];
                if (v && /^\d+$/.test(v)) return v;
            }
            if (articleElement.id) {
                const m = articleElement.id.match(/(\d+)/);
                if (m) return m[1];
            }
            const a = articleElement.querySelector('a[href*="id="], a[href*="entry="], a[href*="c=entry"]');
            if (a?.href) {
                try {
                    const u = new URL(a.href, location.href);
                    const id = u.searchParams.get('id') || u.searchParams.get('entry') || u.searchParams.get('entry_id');
                    if (id && /^\d+$/.test(id)) return id;
                } catch {}
            }
            return '';
        }

        async function markReadPersist(articleElement) {
            const id = entryIdOf(articleElement);
            if (!id) return false;

            // 1) Prefer FreshRSS helper in page scope (sandbox-safe)
            try {
                const mr =
                    (typeof unsafeWindow !== 'undefined' && unsafeWindow && unsafeWindow.mark_read) ||
                    window.mark_read;
                if (typeof mr === 'function') {
                    mr(articleElement, true, true);
                    return true;
                }
            } catch {}

            // 2) Fallback: POST to "read" endpoint
            const ctx = getCtx();
            const csrf = csrfOf(ctx);

            let url = '';
            const tpl = readTplOf(ctx);
            if (tpl) {
                try {
                    if (/\{id\}/i.test(tpl)) url = tpl.replace(/\{id\}/ig, id);
                    else if (/%d/.test(tpl)) url = tpl.replace(/%d/g, id);
                    else {
                        const u = new URL(tpl, location.href);
                        u.searchParams.set('id', id);
                        u.searchParams.set('ajax', '1');
                        url = u.toString();
                    }
                } catch { url = ''; }
            }
            if (!url) {
                const u = new URL(location.href);
                u.searchParams.set('c', 'entry');
                u.searchParams.set('a', 'read');
                u.searchParams.set('id', id);
                u.searchParams.set('ajax', '1');
                url = u.toString();
            }

            // Put CSRF in query + headers + body for compatibility
            try {
                const u = new URL(url, location.href);
                if (csrf && !u.searchParams.has('_csrf')) u.searchParams.set('_csrf', csrf);
                if (csrf && !u.searchParams.has('csrf')) u.searchParams.set('csrf', csrf);
                if (csrf && !u.searchParams.has('csrf_token')) u.searchParams.set('csrf_token', csrf);
                url = u.toString();
            } catch {}

            const headers = { 'X-Requested-With': 'XMLHttpRequest' };
            if (csrf) { headers['X-CSRF-Token'] = csrf; headers['X-CSRF-TOKEN'] = csrf; }

            const body = new URLSearchParams();
            if (csrf) { body.set('_csrf', csrf); body.set('csrf', csrf); body.set('csrf_token', csrf); }

            try {
                const r = await fetch(url, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: body.toString(),
                    keepalive: true,
                });
                if (r.ok) return true;
            } catch {}

            try {
                const r2 = await fetch(url, { method: 'GET', credentials: 'same-origin', keepalive: true });
                return r2.ok;
            } catch {
                return false;
            }
        }

        // Mark as read and hide articles
        function markAsNG(articleElement) {
            if (!articleElement) return;

            // Persist "read" on server (so unread count decreases)
            markReadPersist(articleElement);

            // Hide the article
            articleElement.remove();
        }

        // Setup observer to monitor changes in the stream
    function setupObserver() {
        const targetNode = document.getElementById('stream');
        if (targetNode) {
            const observer = new MutationObserver(applyAllFilters);
            observer.observe(targetNode, { childList: true, subtree: true });
            applyAllFilters();
        } else {
            setTimeout(setupObserver, 1000);
        }
    }

    // Initialize compiled filters at startup
    rebuildCompiledFilters();

    // Register settings screen
    GM_registerMenuCommand('Settings', showSettings);

    // Start setupObserver when the script starts
    setupObserver();
})();