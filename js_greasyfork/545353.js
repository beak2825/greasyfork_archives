"use strict";
// ==UserScript==
// @name         CSES Solved Filter by Date
// @namespace    https://cses.fi/
// @version      0.1.8
// @description  Hide solved check marks (list & task pages) for problems whose last submission is before a selected date.
// @author       Gaurish Gangwar
// @match        https://cses.fi/problemset/list
// @match        https://cses.fi/problemset/list/
// @match        https://cses.fi/problemset/list/*
// @match        https://cses.fi/problemset/task/*
// @match        https://cses.fi/problemset/*
// @icon         https://cses.fi/favicon.ico
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545353/CSES%20Solved%20Filter%20by%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/545353/CSES%20Solved%20Filter%20by%20Date.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const CACHE_PREFIX = 'cses:lastSubmission:';
    const CACHE_VERSION_KEY = 'cses:lastSubmission:__version';
    const CACHE_VERSION = 'v1';
    const THRESHOLD_DATE_KEY = 'cses:thresholdDate';
    const EXCLUDED_SECTIONS_KEY = 'cses:excludedSections';
    function loadExcludedSections() {
        try {
            const raw = localStorage.getItem(EXCLUDED_SECTIONS_KEY);
            if (!raw)
                return new Set();
            const arr = JSON.parse(raw);
            return new Set(Array.isArray(arr) ? arr : []);
        }
        catch {
            return new Set();
        }
    }
    function saveExcludedSections(set) {
        try {
            localStorage.setItem(EXCLUDED_SECTIONS_KEY, JSON.stringify(Array.from(set)));
        }
        catch { }
    }
    function isDarkTheme() {
        const dm = document.getElementById('darkmode-enabled');
        if (dm && dm.textContent && dm.textContent.trim() === 'true')
            return true;
        const themeMeta = document.getElementById('theme-color');
        const c = themeMeta && themeMeta.getAttribute('content');
        return !!(c && c.toLowerCase() === '#292929');
    }
    // Ensure cache version
    if (localStorage.getItem(CACHE_VERSION_KEY) !== CACHE_VERSION) {
        Object.keys(localStorage).forEach(k => { if (k.startsWith(CACHE_PREFIX))
            localStorage.removeItem(k); });
        localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
    }
    function extractLatestSubmissionDate(htmlText) {
        const re = /(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})/;
        const match = re.exec(htmlText);
        if (!match)
            return null;
        const dateTimeStr = match[1] + 'T' + match[2];
        const date = new Date(dateTimeStr);
        return isNaN(date.getTime()) ? null : date;
    }
    function toISODate(d) {
        const iso = d.toISOString();
        const idx = iso.indexOf('T');
        return idx === -1 ? iso : iso.slice(0, idx);
    }
    function createUI() {
        let panel = document.getElementById('cses-filter-panel');
        if (panel)
            return panel;
        panel = document.createElement('div');
        panel.id = 'cses-filter-panel';
        panel.innerHTML = `
      <label style="display:flex;align-items:center;gap:4px;font:12px system-ui;"> 
        <span style="font-weight:600;">Solved after:</span>
        <input type="date" id="cses-threshold-date" style="padding:2px;font-size:12px;" />
        <button type="button" id="cses-clear-cache" title="Clear cached submission timestamps" style="font-size:11px;padding:2px 6px;">Clear Cache</button>
      </label>
      <div id="cses-filter-status" style="margin-top:4px;font:11px system-ui;color:#444;max-width:260px;line-height:1.3;"></div>
    `;
        function applyTheme() {
            const dark = isDarkTheme();
            if (dark) {
                Object.assign(panel.style, {
                    position: 'fixed', top: '6px', left: '6px', background: 'rgba(32,32,32,0.92)',
                    border: '1px solid #444', padding: '6px 8px', borderRadius: '6px', zIndex: '10000',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.5)', color: '#eee'
                });
                const status = panel.querySelector('#cses-filter-status');
                if (status)
                    status.style.color = '#bbb';
                const input = panel.querySelector('#cses-threshold-date');
                if (input)
                    Object.assign(input.style, { background: '#1e1e1e', color: '#eee', border: '1px solid #555' });
                const btn = panel.querySelector('#cses-clear-cache');
                if (btn)
                    Object.assign(btn.style, { background: '#2a2a2a', color: '#ddd', border: '1px solid #555', cursor: 'pointer' });
            }
            else {
                Object.assign(panel.style, {
                    position: 'fixed', top: '6px', left: '6px', background: 'rgba(255,255,255,0.9)',
                    border: '1px solid #ccc', padding: '6px 8px', borderRadius: '6px', zIndex: '10000',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)', color: '#222'
                });
                const status = panel.querySelector('#cses-filter-status');
                if (status)
                    status.style.color = '#444';
                const input = panel.querySelector('#cses-threshold-date');
                if (input)
                    Object.assign(input.style, { background: '#fff', color: '#111', border: '1px solid #bbb' });
                const btn = panel.querySelector('#cses-clear-cache');
                if (btn)
                    Object.assign(btn.style, { background: '#f5f5f5', color: '#222', border: '1px solid #bbb', cursor: 'pointer' });
            }
        }
        applyTheme();
        const themeMeta = document.getElementById('theme-color');
        if (themeMeta) {
            const observer = new MutationObserver(() => applyTheme());
            observer.observe(themeMeta, { attributes: true, attributeFilter: ['content'] });
        }
        document.body.appendChild(panel);
        return panel;
    }
    async function fetchViewContent(url) {
        const resp = await fetch(url, { credentials: 'same-origin' });
        if (!resp.ok)
            throw new Error('HTTP ' + resp.status);
        const ct = (resp.headers.get('content-type') || '').toLowerCase();
        if (ct.startsWith('text/') || ct.includes('json') || ct.includes('xml') || ct.includes('csv') || ct.includes('charset=')) {
            return await resp.text();
        }
        try {
            const blob = await resp.blob();
            if (blob.text) {
                return await blob.text();
            }
        }
        catch { }
        try {
            const buf = await resp.arrayBuffer();
            return new TextDecoder('utf-8').decode(buf);
        }
        catch {
            return await resp.text();
        }
    }
    function getThresholdDate() {
        const input = document.getElementById('cses-threshold-date');
        if (!input || !input.value)
            return null;
        const d = new Date(input.value + 'T00:00:00');
        return isNaN(d.getTime()) ? null : d;
    }
    function setStatus(msg) {
        const el = document.getElementById('cses-filter-status');
        if (el)
            el.textContent = msg;
    }
    async function getSubmissionMeta(problemId) {
        const cacheKey = CACHE_PREFIX + problemId;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            if (cached === 'NONE')
                return { date: null, attempted: false };
            const d = new Date(cached);
            if (!isNaN(d.getTime()))
                return { date: d, attempted: true };
        }
        try {
            const url = `https://cses.fi/problemset/submit/${problemId}/`;
            const resp = await fetch(url, { credentials: 'same-origin' });
            if (!resp.ok)
                throw new Error('HTTP ' + resp.status);
            const text = await resp.text();
            const date = extractLatestSubmissionDate(text);
            if (date) {
                localStorage.setItem(cacheKey, date.toISOString());
                return { date, attempted: true };
            }
            else {
                localStorage.setItem(cacheKey, 'NONE');
                return { date: null, attempted: false };
            }
        }
        catch (e) {
            console.error('Failed to fetch submissions for', problemId, e);
            return { date: null, attempted: false };
        }
    }
    async function getLastSubmissionDate(problemId) {
        const meta = await getSubmissionMeta(problemId);
        return meta.date;
    }
    async function refreshProblem(problemId, icon, forceRefetch = false) {
        if (forceRefetch)
            localStorage.removeItem(CACHE_PREFIX + problemId);
        const date = await getLastSubmissionDate(problemId);
        const threshold = getThresholdDate();
        if (icon) {
            if (icon.classList.contains('full'))
                icon.dataset.originalSolved = '1';
            if (date && threshold && date < threshold) {
                if (icon.classList.contains('full'))
                    icon.classList.remove('full');
                icon.title = `Hidden (old solve): last submission ${date.toLocaleString()}`;
            }
            else if (date) {
                if (!icon.classList.contains('full'))
                    icon.classList.add('full');
                icon.title = `Last submission ${date.toLocaleString()}`;
            }
        }
        if (/\/problemset\/list\/?/.test(location.pathname))
            updateFilteredSectionStats();
    }
    class TaskQueue {
        constructor(concurrency = 3) {
            this.running = 0;
            this.q = [];
            this.c = concurrency;
        }
        push(task) { this.q.push(task); this.run(); }
        run() {
            while (this.running < this.c && this.q.length) {
                const t = this.q.shift();
                this.running++;
                Promise.resolve().then(t).catch(() => { }).finally(() => { this.running--; this.run(); });
            }
        }
    }
    async function init() {
        const path = location.pathname;
        if (!/\/problemset\//.test(path))
            return;
        const panel = createUI();
        const dateInput = panel.querySelector('#cses-threshold-date');
        const saved = localStorage.getItem(THRESHOLD_DATE_KEY);
        const today = toISODate(new Date());
        dateInput.value = saved || today;
        dateInput.addEventListener('change', () => {
            localStorage.setItem(THRESHOLD_DATE_KEY, dateInput.value);
            applyFilter();
            buildSectionStats();
        });
        panel.querySelector('#cses-clear-cache').addEventListener('click', () => {
            if (!confirm('Clear cached submission timestamps?'))
                return;
            let cleared = 0;
            Object.keys(localStorage).forEach(k => { if (k.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(k);
                cleared++;
            } });
            setStatus(`Cleared ${cleared} cached entries.`);
            applyFilter(true);
            buildSectionStats();
        });
        document.addEventListener('click', (e) => {
            if (!(e instanceof MouseEvent) || !e.altKey)
                return;
            const target = e.target;
            if (!target)
                return;
            if (target.classList.contains('task-score')) {
                const problemId = target.getAttribute('data-problem-id') || extractProblemId(target);
                if (problemId) {
                    setStatus(`Refreshing problem ${problemId}...`);
                    refreshProblem(problemId, target, true).then(() => setStatus(`Refreshed problem ${problemId}.`));
                }
                e.preventDefault();
                e.stopPropagation();
            }
        });
        const mo = new MutationObserver(muts => {
            muts.forEach(m => {
                if (m.type === 'attributes' && m.attributeName === 'class') {
                    const el = m.target;
                    if (el && el.classList.contains('task-score') && el.classList.contains('full')) {
                        const pid = el.getAttribute('data-problem-id') || extractProblemId(el);
                        if (pid) {
                            el.dataset.originalSolved = '1';
                            refreshProblem(pid, el, true);
                        }
                    }
                }
                else if (m.addedNodes && m.addedNodes.length) {
                    m.addedNodes.forEach(n => {
                        if (n instanceof HTMLElement) {
                            const icons = (n.matches && n.matches('span.task-score.icon.full')) ? [n] : Array.from(n.querySelectorAll('span.task-score.icon.full'));
                            icons.forEach(ic => {
                                const pid = ic.getAttribute('data-problem-id') || extractProblemId(ic);
                                if (pid) {
                                    ic.dataset.originalSolved = '1';
                                    refreshProblem(pid, ic, true);
                                }
                            });
                        }
                    });
                }
            });
        });
        mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
        applyFilter();
        buildSectionStats();
        if (/\/problemset\/result\//.test(path) || /\/problemset\/view\//.test(path)) {
            enhanceResultCopyButtons();
            const mo2 = new MutationObserver(() => enhanceResultCopyButtons());
            mo2.observe(document.body, { childList: true, subtree: true });
        }
    }
    function collectSolved() {
        const nodes = Array.from(document.querySelectorAll('span.task-score.icon'));
        nodes.forEach(n => { if (n.classList.contains('full'))
            n.dataset.originalSolved = '1'; });
        return nodes.filter(n => n.dataset.originalSolved === '1');
    }
    function extractProblemId(el) {
        let link = null;
        const li = el.closest('li.task');
        if (li)
            link = li.querySelector('a[href*="/problemset/task/"]');
        if (!link)
            link = el.closest('a[href*="/problemset/task/"]');
        if (!link)
            return null;
        const href = link.getAttribute('href') || '';
        const m = /\/problemset\/task\/(\d+)/.exec(href);
        return m && m[1] ? m[1] : null;
    }
    function extractProblemTitle(icon) {
        let link = null;
        const li = icon.closest('li.task');
        if (li)
            link = li.querySelector('a[href*="/problemset/task/"]');
        if (!link)
            link = icon.closest('a[href*="/problemset/task/"]');
        const text = (link && link.childNodes && Array.from(link.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim()) || 'Unknown';
        return text;
    }
    const sectionQueue = new TaskQueue(2);
    function getHeadingTitle(heading) {
        try {
            const clone = heading.cloneNode(true);
            const injected = clone.querySelectorAll('.cses-section-stats, .cses-section-stats-filter, .cses-section-toggle');
            injected.forEach(n => n.remove());
            return (clone.textContent || '').trim().toLowerCase();
        }
        catch {
            return (heading.textContent || '').trim().toLowerCase();
        }
    }
    function findSections() {
        return Array.from(document.querySelectorAll('h2')).map(h => ({
            heading: h,
            list: (h.nextElementSibling && h.nextElementSibling.matches('ul.task-list')) ? h.nextElementSibling : null
        }));
    }
    function classifyTask(li) {
        var _a;
        const icon = li.querySelector('span.task-score.icon');
        const solved = !!(icon && icon.classList.contains('full'));
        const wrongImmediate = !!(icon && icon.classList.contains('zero'));
        const link = li.querySelector('a[href*="/problemset/task/"]');
        const problemId = link ? (_a = (link.getAttribute('href') || '').match(/(\d+)/)) === null || _a === void 0 ? void 0 : _a[1] : null;
        if (!problemId)
            return { solved: false, attempted: false, unattended: true, pending: false };
        if (solved)
            return { solved: true, attempted: true, unattended: false, pending: false, problemId };
        if (wrongImmediate)
            return { solved: false, attempted: true, unattended: false, pending: false, problemId };
        const cacheVal = localStorage.getItem(CACHE_PREFIX + problemId);
        if (cacheVal) {
            if (cacheVal === 'NONE')
                return { solved: false, attempted: false, unattended: true, pending: false, problemId };
            const d = new Date(cacheVal);
            if (!isNaN(d.getTime()))
                return { solved: false, attempted: true, unattended: false, pending: false, problemId };
        }
        return { solved: false, attempted: false, unattended: true, pending: true, problemId };
    }
    function updateSectionHeading(section) {
        const { heading, list } = section;
        if (!list)
            return;
        const tasks = Array.from(list.querySelectorAll('li.task'));
        let total = tasks.length, correct = 0, wrong = 0, unattended = 0;
        tasks.forEach(li => {
            const c = classifyTask(li);
            if (c.solved)
                correct++;
            else if (c.attempted)
                wrong++;
            else
                unattended++;
        });
        const base = heading.getAttribute('data-base-text') || (heading.textContent || '').trim();
        heading.setAttribute('data-base-text', base);
        let badge = heading.querySelector(':scope > .cses-section-stats');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cses-section-stats';
            badge.style.cssText = 'margin-right:6px;font-weight:normal;font-size:0.75em;color:#888;';
            heading.prepend(badge);
        }
        badge.innerHTML = `[<span style="color:#ccc;">${total}</span> / <span style="color:#3c9b3c;">${correct}</span> / <span style="color:#d28b26;">${wrong}</span> / <span style="color:#777;">${unattended}</span>] `;
        badge.title = 'Overall: total / solved / wrong (attempted unsolved) / unattended';
        heading.dataset.sectionOverall = JSON.stringify({ total, correct, wrong, unattended });
    }
    function buildSectionStats() {
        if (!/\/problemset\/list\/?/.test(location.pathname))
            return;
        const sections = findSections();
        sections.forEach(section => {
            updateSectionHeading(section);
            if (section.list)
                addSectionToggle(section);
            if (!section.list)
                return;
            const tasks = Array.from(section.list.querySelectorAll('li.task'));
            tasks.forEach(li => {
                const c = classifyTask(li);
                if (c.pending && c.problemId) {
                    sectionQueue.push(async () => {
                        await getSubmissionMeta(c.problemId);
                        updateSectionHeading(section);
                        updateFilteredSectionStats();
                    });
                }
            });
        });
        updateFilteredSectionStats();
    }
    function updateFilteredSectionStats() {
        if (!/\/problemset\/list\/?/.test(location.pathname))
            return;
        const sections = findSections();
        sections.forEach(section => {
            const { heading, list } = section;
            if (!list)
                return;
            const tasks = Array.from(list.querySelectorAll('li.task'));
            let filteredSolved = 0, filteredWrong = 0, filteredUnatt = 0;
            tasks.forEach(li => {
                var _a;
                const icon = li.querySelector('span.task-score.icon');
                if (!icon)
                    return;
                const originallySolved = icon.dataset.originalSolved === '1' || icon.classList.contains('full');
                const isSolvedNow = icon.classList.contains('full');
                const wrongImmediate = icon.classList.contains('zero');
                const link = li.querySelector('a[href*="/problemset/task/"]');
                const problemId = link ? (_a = (link.getAttribute('href') || '').match(/(\d+)/)) === null || _a === void 0 ? void 0 : _a[1] : null;
                let attempted = false;
                if (wrongImmediate)
                    attempted = true;
                else if (problemId) {
                    const cacheVal = localStorage.getItem(CACHE_PREFIX + problemId);
                    if (cacheVal && cacheVal !== 'NONE')
                        attempted = true;
                }
                if (isSolvedNow && originallySolved)
                    filteredSolved++;
                else if (attempted && !originallySolved)
                    filteredWrong++;
                else
                    filteredUnatt++;
            });
            if (!tasks.length)
                return;
            let filteredBadge = heading.querySelector(':scope > .cses-section-stats-filter');
            if (!filteredBadge) {
                filteredBadge = document.createElement('span');
                filteredBadge.className = 'cses-section-stats-filter';
                filteredBadge.style.cssText = 'margin-left:8px;font-weight:normal;font-size:0.7em;color:#5aa;';
                heading.appendChild(filteredBadge);
            }
            filteredBadge.innerHTML = `[filtered <span style="color:#3c9b3c;">${filteredSolved}</span> / <span style="color:#d28b26;">${filteredWrong}</span> / <span style="color:#777;">${filteredUnatt}</span>]`;
            filteredBadge.title = 'Filtered (date threshold): solved-after-threshold / wrong (attempted unsolved) / old-or-unattended';
            heading.dataset.sectionFiltered = JSON.stringify({ solved: filteredSolved, wrong: filteredWrong, unattended: filteredUnatt });
        });
        let aggTotal = 0, aggSolved = 0, aggWrong = 0, aggUnatt = 0, aggFilteredSolved = 0, aggFilteredWrong = 0, aggFilteredUnatt = 0;
        sections.forEach(section => {
            const { heading, list } = section;
            if (!list)
                return;
            const included = heading.dataset.excluded !== '1';
            if (!included)
                return;
            let overall = null;
            try {
                overall = JSON.parse(heading.dataset.sectionOverall || 'null');
            }
            catch { }
            if (!overall) {
                const tasks = Array.from(list.querySelectorAll('li.task'));
                let total = tasks.length, correct = 0, wrong = 0, unattended = 0;
                tasks.forEach(li => {
                    const c = classifyTask(li);
                    if (c.solved)
                        correct++;
                    else if (c.attempted)
                        wrong++;
                    else
                        unattended++;
                });
                overall = { total, correct, wrong, unattended };
            }
            aggTotal += (overall.total || 0);
            aggSolved += (overall.correct || 0);
            aggWrong += (overall.wrong || 0);
            aggUnatt += (overall.unattended || 0);
            let filt = null;
            try {
                filt = JSON.parse(heading.dataset.sectionFiltered || 'null');
            }
            catch { }
            if (!filt) {
                const tasks = Array.from(list.querySelectorAll('li.task'));
                let fs = 0, fw = 0, fu = 0;
                tasks.forEach(li => {
                    var _a;
                    const icon = li.querySelector('span.task-score.icon');
                    if (!icon)
                        return;
                    const originallySolved = icon.dataset.originalSolved === '1' || icon.classList.contains('full');
                    const isSolvedNow = icon.classList.contains('full');
                    const wrongImmediate = icon.classList.contains('zero');
                    const link = li.querySelector('a[href*="/problemset/task/"]');
                    const problemId = link ? (_a = (link.getAttribute('href') || '').match(/(\d+)/)) === null || _a === void 0 ? void 0 : _a[1] : null;
                    let attempted = false;
                    if (wrongImmediate)
                        attempted = true;
                    else if (problemId) {
                        const cacheVal = localStorage.getItem(CACHE_PREFIX + problemId);
                        if (cacheVal && cacheVal !== 'NONE')
                            attempted = true;
                    }
                    if (isSolvedNow && originallySolved)
                        fs++;
                    else if (attempted && !originallySolved)
                        fw++;
                    else
                        fu++;
                });
                filt = { solved: fs, wrong: fw, unattended: fu };
            }
            aggFilteredSolved += (filt.solved || 0);
            aggFilteredWrong += (filt.wrong || 0);
            aggFilteredUnatt += (filt.unattended || 0);
        });
        const general = sections.find(s => getHeadingTitle(s.heading).startsWith('general'));
        if (general) {
            const h = general.heading;
            let overallBadge = h.querySelector(':scope > .cses-section-stats');
            if (!overallBadge) {
                overallBadge = document.createElement('span');
                overallBadge.className = 'cses-section-stats';
                overallBadge.style.cssText = 'margin-right:6px;font-weight:normal;font-size:0.75em;color:#888;';
                h.prepend(overallBadge);
            }
            overallBadge.innerHTML = `[<span style="color:#ccc;">${aggTotal}</span> / <span style="color:#3c9b3c;">${aggSolved}</span> / <span style=\"color:#d28b26;\">${aggWrong}</span> / <span style=\"color:#777;\">${aggUnatt}</span>] `;
            overallBadge.title = 'Overall totals across all included sections: total / solved / wrong / unattended';
            let filteredBadge = h.querySelector(':scope > .cses-section-stats-filter');
            if (!filteredBadge) {
                filteredBadge = document.createElement('span');
                filteredBadge.className = 'cses-section-stats-filter';
                filteredBadge.style.cssText = 'margin-left:8px;font-weight:normal;font-size:0.7em;color:#5aa;';
                h.appendChild(filteredBadge);
            }
            filteredBadge.innerHTML = `[filtered <span style=\"color:#3c9b3c;\">${aggFilteredSolved}</span> / <span style=\"color:#d28b26;\">${aggFilteredWrong}</span> / <span style=\"color:#777;\">${aggFilteredUnatt}</span>]`;
            filteredBadge.title = 'Aggregate filtered counts (date threshold) across included sections';
        }
    }
    function addSectionToggle(section) {
        const { heading, list } = section;
        if (!list)
            return;
        const title = getHeadingTitle(heading);
        if (title.startsWith('general'))
            return;
        const excludedSet = loadExcludedSections();
        let btn = heading.querySelector(':scope > .cses-section-toggle');
        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'cses-section-toggle';
            btn.type = 'button';
            btn.style.marginLeft = '8px';
            btn.style.fontSize = '11px';
            btn.style.padding = '1px 6px';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            const dark = isDarkTheme();
            btn.style.border = '1px solid ' + (dark ? '#555' : '#bbb');
            btn.style.background = dark ? '#2a2a2a' : '#f5f5f5';
            btn.style.color = dark ? '#ddd' : '#222';
            heading.appendChild(btn);
        }
        const key = title;
        if (excludedSet.has(key)) {
            heading.dataset.excluded = '1';
            list.style.display = 'none';
        }
        const updateBtnUI = () => {
            const excluded = heading.dataset.excluded === '1';
            btn.textContent = excluded ? '🙈' : '👁';
            btn.title = excluded ? 'Include Section' : 'Exclude Section';
            btn.setAttribute('aria-label', btn.title);
        };
        updateBtnUI();
        btn.onclick = () => {
            const excluded = heading.dataset.excluded === '1';
            if (excluded) {
                delete heading.dataset.excluded;
                list.style.display = '';
                excludedSet.delete(key);
            }
            else {
                heading.dataset.excluded = '1';
                list.style.display = 'none';
                excludedSet.add(key);
            }
            saveExcludedSections(excludedSet);
            updateBtnUI();
            updateFilteredSectionStats();
        };
    }
    function applyFilter(forceRefetch = false) {
        const threshold = getThresholdDate();
        if (!threshold)
            return;
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const solvedIcons = collectSolved();
        if (!solvedIcons.length) {
            setStatus('No solved problems detected.');
            return;
        }
        solvedIcons.forEach(icon => { if (!icon.classList.contains('full'))
            icon.classList.add('full'); });
        const queue = new TaskQueue(3);
        let processed = 0, total = solvedIcons.length, fetched = 0;
        const thresholdIso = threshold.toISOString();
        console.log('[CSES Filter] Threshold:', thresholdIso, 'Solved icons:', total);
        solvedIcons.forEach((icon, i) => {
            console.log(`[CSES Filter][DISCOVER] #${i} classes=`, icon.className, 'outerHTML=', icon.outerHTML);
        });
        solvedIcons.forEach(icon => {
            const problemId = extractProblemId(icon);
            if (!problemId) {
                console.warn('[CSES Filter][NO-ID] Could not find problem id for icon', icon);
                return;
            }
            const title = extractProblemTitle(icon);
            icon.setAttribute('data-problem-id', problemId);
            icon.setAttribute('data-problem-title', title);
            if (forceRefetch)
                localStorage.removeItem(CACHE_PREFIX + problemId);
            queue.push(async () => {
                const fetchStart = performance.now();
                console.log(`[CSES Filter][FETCH START] ${title} id=${problemId}`);
                const date = await getLastSubmissionDate(problemId);
                const fetchDur = (performance.now() - fetchStart).toFixed(0);
                if (date) {
                    fetched++;
                    if (threshold.getTime() === todayMidnight.getTime()) {
                        if (!icon.classList.contains('full'))
                            icon.classList.add('full');
                        icon.title = `Last submission ${date.toLocaleString()}`;
                        console.log(`[CSES Filter][DECISION] ${title} (id ${problemId}) last=${date.toISOString()} -> keep (threshold is today) fetch=${fetchDur}ms`);
                    }
                    else if (date < threshold) {
                        if (icon.classList.contains('full'))
                            icon.classList.remove('full');
                        icon.title = `Hidden: last submission ${date.toLocaleString()}`;
                        console.log(`[CSES Filter][DECISION] ${title} (id ${problemId}) last=${date.toISOString()} threshold=${thresholdIso} -> HIDE fetch=${fetchDur}ms`);
                    }
                    else {
                        if (!icon.classList.contains('full'))
                            icon.classList.add('full');
                        icon.title = `Last submission ${date.toLocaleString()}`;
                        console.log(`[CSES Filter][DECISION] ${title} (id ${problemId}) last=${date.toISOString()} threshold=${thresholdIso} -> keep fetch=${fetchDur}ms`);
                    }
                }
                else {
                    console.warn(`[CSES Filter][ERROR] ${title} (id ${problemId}) failed to fetch/parse date.`);
                }
                processed++;
                if (processed % 5 === 0 || processed === total) {
                    setStatus(`Processed ${processed}/${total} solved problems (fetched ${fetched}). Threshold ${toISODate(threshold)}.`);
                    updateFilteredSectionStats();
                }
            });
        });
        setStatus(`Queued ${solvedIcons.length} solved problems...`);
        console.log('[CSES Filter] Queue filled. Beginning async fetches.');
        updateFilteredSectionStats();
    }
    function enhanceResultCopyButtons() {
        const actions = Array.from(document.querySelectorAll('div.samp-actions'));
        if (!actions.length)
            return;
        actions.forEach(act => {
            if (act.getAttribute('data-copy-enhanced') === '1')
                return;
            const view = act.querySelector('a.view');
            const save = act.querySelector('a.save');
            const href = view ? view.getAttribute('href') : (save ? save.getAttribute('href') : null);
            if (!href)
                return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'cses-copy-btn';
            btn.textContent = 'Copy';
            btn.title = 'Copy full data to clipboard';
            const dark = isDarkTheme();
            Object.assign(btn.style, {
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                border: '1px solid ' + (dark ? '#555' : '#bbb'),
                background: dark ? '#2a2a2a' : '#f5f5f5',
                color: dark ? '#ddd' : '#222',
                padding: '1px 6px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer'
            });
            const url = new URL(href, location.origin).toString();
            let resetTimer = null;
            btn.addEventListener('click', async () => {
                if (btn.disabled)
                    return;
                const prev = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Copying';
                try {
                    const content = await fetchViewContent(url);
                    await navigator.clipboard.writeText(content);
                    btn.innerHTML = '<i class="fas fa-check"></i> Copied';
                    btn.style.borderColor = '#3c9b3c';
                    btn.style.color = isDarkTheme() ? '#bde5bd' : '#2a6f2a';
                }
                catch (e) {
                    console.error('[CSES Copy] Failed to copy', e);
                    btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed';
                    btn.style.borderColor = '#b55';
                    btn.style.color = isDarkTheme() ? '#ffbdbd' : '#7a1f1f';
                }
                finally {
                    if (resetTimer)
                        window.clearTimeout(resetTimer);
                    resetTimer = window.setTimeout(() => { btn.disabled = false; btn.innerHTML = prev; }, 1400);
                }
            });
            act.appendChild(document.createTextNode(' '));
            act.appendChild(btn);
            act.setAttribute('data-copy-enhanced', '1');
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    }
    else {
        init();
    }
})();
