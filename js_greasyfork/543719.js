// ==UserScript==
// @name         CPR Requirements
// @namespace    https://lzpt.io/
// @version      1.5
// @description  Show faction requirements for CPRs
// @author       Lazerpent
// @match        https://www.torn.com/factions.php?step=your*
// @connect      api.lzpt.io
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/543719/CPR%20Requirements.user.js
// @updateURL https://update.greasyfork.org/scripts/543719/CPR%20Requirements.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_BASE = 'https://api.lzpt.io/static/cprs/';

    // Inject pulsing CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cprPulse {
            0% { background-color: rgba(255, 0, 0, 0.3); }
            50% { background-color: rgba(255, 0, 0, 0.7); }
            100% { background-color: rgba(255, 0, 0, 0.3); }
        }
        @keyframes cprPulseDark {
            0% { background-color: rgba(255, 0, 0, 0.2); box-shadow: 0 0 4px rgba(255, 0, 0, 0.5); }
            50% { background-color: rgba(255, 0, 0, 0.6); box-shadow: 0 0 12px rgba(255, 0, 0, 0.8); }
            100% { background-color: rgba(255, 0, 0, 0.2); box-shadow: 0 0 4px rgba(255, 0, 0, 0.5); }
        }
        .cpr-invalid {
            animation: cprPulse 1s infinite;
            border-radius: 3px;
            padding: 0 4px;
            font-weight: bold;
            color: #333333 !important;
        }
        .dark-mode .cpr-invalid {
            color: #DDDDDD !important;
            animation: cprPulseDark 1s infinite;
        }
    `;
    document.head.appendChild(style);

    const getFactionId = () => {
        const link = document.getElementById('factions')?.querySelector('a[href*="forums"][href*="a="]');
        if (!link) return null;
        const match = link.href.match(/a=(\d+)/);
        return match ? match[1] : null;
    };

    const fetchCPRs = (factionId) => {
        const url = `${API_BASE}${factionId}.json`;
        console.log("Fetching CPRs from", url);
        return new Promise((resolve, reject) => {
            (GM_xmlhttpRequest ? GM_xmlhttpRequest : GM.xmlhttpRequest)({
                method: 'GET',
                url: url,
                headers: {'Accept': 'application/json'},
                onload: function (response) {
                    try {
                        const json = JSON.parse(response.responseText);
                        resolve(json);
                    } catch (e) {
                        console.error("Failed to parse CPR response", e);
                        console.log(url, response.responseText);
                        reject(e);
                    }
                },
                onerror: function (err) {
                    console.error("Failed to fetch CPR data", err);
                    reject(err);
                }
            });
        });
    };

    const parseOCName = (wrapper) => {
        const nameNode = wrapper.closest('[class^=contentLayer]')?.querySelector('[class^=panelTitle]');
        return nameNode?.textContent?.trim() || null;
    };

    // ---- Bounds helpers ----
    // Supports:
    //   number           => {lower:number, upper:-1}
    //   [lower, upper]   => {lower, upper}
    //   {min/max} or {lower/upper} (optional convenience)
    // Sentinel semantics:
    //   lower=0  => no lower bound
    //   upper=-1 => no upper bound
    const normalizeBounds = (value, fallback) => {
        const v = (value !== undefined ? value : fallback);

        let lower = 0;
        let upper = -1;

        if (typeof v === 'number') {
            lower = v;
            upper = -1;
        } else if (Array.isArray(v)) {
            lower = (v[0] ?? 0);
            upper = (v[1] ?? -1);
        } else if (v && typeof v === 'object') {
            lower = (v.min ?? v.lower ?? 0);
            upper = (v.max ?? v.upper ?? -1);
        } else {
            lower = 0;
            upper = -1;
        }

        // Ensure numeric
        lower = Number(lower);
        upper = Number(upper);

        if (!Number.isFinite(lower)) lower = 0;
        if (!Number.isFinite(upper)) upper = -1;

        return {lower, upper};
    };

    const isOutOfRange = (current, bounds) => {
        if (!Number.isFinite(current)) return false;
        if (bounds.lower > 0 && current < bounds.lower) return true;
        if (bounds.upper !== -1 && current > bounds.upper) return true;
        return false;
    };

    const formatBounds = (bounds) => {
        const hasLower = bounds.lower > 0;
        const hasUpper = bounds.upper !== -1;

        if (hasLower && hasUpper) return `${bounds.lower}–${bounds.upper}%`;
        if (hasLower) return `≥ ${bounds.lower}%`;
        if (hasUpper) return `≤ ${bounds.upper}%`;
        return `Any`;
    };

    const getRoleBounds = (ocInfo, roleName) => {
        let fallback = ocInfo?.default;

        // Optional backward-compat if you ever add these keys:
        if (fallback === undefined && ocInfo && (ocInfo.defaultLower !== undefined || ocInfo.defaultUpper !== undefined)) {
            fallback = [ocInfo.defaultLower ?? 0, ocInfo.defaultUpper ?? -1];
        }

        const roleValue = ocInfo?.roles?.[roleName];
        return normalizeBounds(roleValue, fallback);
    };
    // ---- end bounds helpers ----

    const processSlots = (data) => {
        console.log("CPR: Updating slots");
        const slots = document.querySelectorAll('[class^=wrapper][class*="success"]');
        const redSuccessClass = findSuccessRedClass();

        slots.forEach((slot) => {
            const successEl = slot.querySelector('[class^=successChance]');
            const titleEl = slot.querySelector('[class^=title]');
            if (!successEl || !titleEl) return;

            const currentCPR = parseInt(successEl.textContent.split(/\s+/)[0].trim(), 10);
            if (isNaN(currentCPR)) return;

            const roleName = titleEl.textContent.trim();
            const ocName = parseOCName(slot);
            if (!ocName || !data[ocName]) return;

            const ocInfo = data[ocName];
            const bounds = getRoleBounds(ocInfo, roleName);

            if (successEl.dataset._cpr_patched) return;
            successEl.dataset._cpr_patched = true;

            // Only show CPR (no required value) in the slot itself
            successEl.textContent = `${currentCPR}`;

            if (isOutOfRange(currentCPR, bounds)) {
                successEl.classList.add('cpr-invalid');

                const wrapper = slot.closest('[class*="success"][class*="wrapper"]');
                if (wrapper && !wrapper.dataset._cpr_patched && redSuccessClass) {
                    for (const cls of [...wrapper.classList]) {
                        if (/^success[A-Z]/.test(cls)) {
                            wrapper.classList.remove(cls);
                        }
                    }

                    wrapper.classList.add(redSuccessClass);
                    wrapper.dataset._cpr_patched = 'true';
                }
            }
        });
    };

    function findSuccessRedClass() {
        for (const sheet of document.styleSheets) {
            let rules;
            try {
                rules = sheet.cssRules || sheet.rules;
            } catch (e) {
                continue; // Some stylesheets are CORS-restricted
            }
            if (!rules) continue;

            for (const rule of rules) {
                if (!rule.selectorText) continue;

                const match = rule.selectorText.match(/\.successRed___[a-zA-Z0-9_-]+/);
                if (match) {
                    return match[0].substring(1); // Remove leading '.'
                }
            }
        }
        return null;
    }

    const patchTooltip = (tooltipId, bounds, currentCPR) => {
        const tooltipEl = document.getElementById(tooltipId);
        if (!tooltipEl || tooltipEl.dataset._cpr_patched) return;

        const wrapper = tooltipEl.querySelector('[class*="wrapper___"]');
        if (!wrapper) return;

        const refSection = wrapper.querySelector('[class*="section___"][class*="iconWithText___"]');
        const refIcon = wrapper.querySelector('[class*="icon___"]');

        const isInvalid = isOutOfRange(currentCPR, bounds);

        // ----- Build the visual "Required pass rate: ..." row (as you already do) -----
        const iconColor = isInvalid ? '#cc0000' : '#33aa33';
        const iconSVG = isInvalid
            ? `<line x1="2" y1="2" x2="10" y2="10" stroke="${iconColor}" stroke-width="3.5" stroke-linecap="round"/>
           <line x1="10" y1="2" x2="2" y2="10" stroke="${iconColor}" stroke-width="3.5" stroke-linecap="round"/>`
            : `<path d="M8.452,2,3.75,6.82l-2.2-2.088L0,6.28,3.75,9.917,10,3.548Z"
                 transform="translate(0 -2)"
                 fill="${iconColor}"
                 stroke="rgba(0,0,0,0)"
                 stroke-width="1"></path>`;

        const newSection = document.createElement('div');
        newSection.className = refSection?.className || '';

        const iconDiv = document.createElement('div');
        iconDiv.className = refIcon?.className || '';
        iconDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
            <g>${iconSVG}</g>
        </svg>
    `;

        const textSpan = document.createElement('span');
        textSpan.textContent = `Required pass rate: ${formatBounds(bounds)}`;
        if (isInvalid) textSpan.style.fontWeight = 'bold';

        newSection.appendChild(iconDiv);
        newSection.appendChild(textSpan);

        // Insert after the "Checkpoint pass rate" UI line
        const sections = wrapper.querySelectorAll('[class*="section___"][class*="iconWithText___"]');
        let inserted = false;

        for (const s of sections) {
            if (s.textContent.includes('Checkpoint pass rate')) {
                if (s.nextSibling) wrapper.insertBefore(newSection, s.nextSibling);
                else wrapper.appendChild(newSection);
                inserted = true;
                break;
            }
        }
        if (!inserted) wrapper.appendChild(newSection);
        // ---------------------------------------------------------------------------

        // ----- Minimal-change aria-label patch -----
        updateAriaLabelMinimal(wrapper, bounds, isInvalid);
        // ------------------------------------------

        tooltipEl.dataset._cpr_patched = true;
    };

    const updateAriaLabelMinimal = (wrapper, bounds, isInvalid) => {
        const formatBoundsSpoken = (b) => {
            const hasLower = b.lower > 0;
            const hasUpper = b.upper !== -1;

            if (hasLower && hasUpper) return `between ${b.lower} and ${b.upper} percent`;
            if (hasLower) return `at least ${b.lower} percent`;
            if (hasUpper) return `at most ${b.upper} percent`;
            return `any pass rate`;
        };

        const spokenRequired = formatBoundsSpoken(bounds);
        const warningText = 'WARNING checkpoint pass rate does not meet the required threshold.';

        let label = wrapper.getAttribute('aria-label') || '';

        // Remove our prior WARNING prefix (only if it matches exactly)
        label = label.replace(new RegExp(
            '^' + warningText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*',
            'i'
        ), '');

        // Remove our prior injected requirement (idempotent)
        // Matches: "; Required pass rate at least 75 percent" (with or without colon)
        label = label.replace(/\s*[;,]\s*Required pass rate:?\s+[^.;]+/i, '');

        // Insert requirement immediately after the existing "Checkpoint pass rate: ..." clause.
        // Minimal edit: only touches that clause.
        //
        // We match up to the first '.' or ';' (not greedy), keep trailing punctuation if present.
        const cprPattern = /(Checkpoint pass rate:\s*[^.;]+)([.;]?)/i;

        if (cprPattern.test(label)) {
            label = label.replace(cprPattern, (m, cprClause, punct) => {
                const requiredClause = `; Required pass rate ${spokenRequired}`;
                return `${cprClause}${requiredClause}${punct || ''}`;
            });
        } else {
            // Fallback if Torn changes wording; append safely as a separate sentence.
            const needsPeriod = label.trim().length > 0 && !/[.!?]\s*$/.test(label);
            label = `${label}${needsPeriod ? '.' : ''} Required pass rate ${spokenRequired}.`;
        }

        // Prefix warning (minimal change, no reformatting)
        if (isInvalid) {
            label = `${warningText} ${label}`.trim();
        }

        wrapper.setAttribute('aria-label', label);
    };

    const monitorTooltips = (requiredMap) => {
        // Prevent duplicate observers if start() runs multiple times (hashchange, etc.)
        if (monitorTooltips._observer) {
            try {
                monitorTooltips._observer.disconnect();
            } catch (e) {
            }
            monitorTooltips._observer = null;
        }

        const tooltipObserver = new MutationObserver(() => {
            document.querySelectorAll('button[aria-describedby]').forEach(btn => {
                const id = btn.getAttribute('aria-describedby');
                const successEl = btn.querySelector('[class^=successChance]');
                const titleEl = btn.querySelector('[class^=title]');
                const ocName = parseOCName(btn);
                if (!successEl || !titleEl || !ocName || !requiredMap[ocName]) return;

                const roleName = titleEl.textContent.trim();
                const ocInfo = requiredMap[ocName];
                const bounds = getRoleBounds(ocInfo, roleName);

                const currentCPR = parseInt(successEl.textContent.trim(), 10);
                if (isNaN(currentCPR)) return;

                patchTooltip(id, bounds, currentCPR);
            });
        });

        tooltipObserver.observe(document.body, {childList: true, subtree: true});
        monitorTooltips._observer = tooltipObserver;
    };

    const run = async (cprData) => {
        const root = document.getElementById('faction-crimes-root');
        if (!root) {
            setTimeout(() => run(cprData), 200);
            return;
        }

        // Tooltips observer should be registered once per run()
        monitorTooltips(cprData);

        const observer = new MutationObserver((mutations) => {
            const isRelevant = mutations.some(m => !m.target.closest('[class^=phase]'));
            if (isRelevant) processSlots(cprData);
        });

        observer.observe(root, {childList: true, subtree: true});

        // Also do an initial pass once content is present
        processSlots(cprData);
    };

    const start = async () => {
        const factionId = getFactionId();
        if (!factionId || parseInt(factionId) === 0) {
            setTimeout(start, 100);
            return;
        }

        try {
            const cprData = await fetchCPRs(factionId);
            if (!cprData || typeof cprData !== 'object') {
                alert("Failed to get CPR Requirements");
                return;
            }
            run(cprData);
        } catch (e) {
            console.error("CPR Userscript failed to start", e);
        }
    };

    start();
    window.addEventListener("hashchange", function () {
        start();
    });

})();