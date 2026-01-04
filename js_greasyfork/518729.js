// ==UserScript==
// @name         Torn City Reviver's Tool
// @namespace    http://tampermonkey.net/
// @version      4.0.4
// @description  A tool to make it easier to revive people while in the Hospital page. Now mobile-responsive with row filtering!
// @author       LilyWaterbug [2608747]
// @match        https://www.torn.com/hospitalview.php*
// @match        https://www.torn.com/factions.php?step=profile*
// @match        https://www.torn.com/factions.php?step=your*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518729/Torn%20City%20Reviver%27s%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/518729/Torn%20City%20Reviver%27s%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent duplicate initialization
    if (window.tornReviverInitialized) return;
    window.tornReviverInitialized = true;

    const COLORS = {A:'#28a745',I:'#ffc107',O:'#6c757d'}, STATUSES = ['Active','Idle','Offline'],
          DEFAULTS = {left:'10px',top:'10px',width:'215px'}, SP = 'tornReviver_';
    let drag = 0, dx = 0, dy = 0, page = 0, users = [], els = {}, box = null, toolEnabled = true;

    const $ = id => els[id] || (els[id] = document.getElementById(id)),
          ce = (t, p={}) => Object.assign(document.createElement(t), p),
          st = {
              g: k => localStorage[SP+k],
              s: (k,v) => localStorage[SP+k] = v,
              r: k => delete localStorage[SP+k]
          },
          deb = (f,w) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => f(...a), w); }; };

    // Mobile detection
    const isMobile = () => window.innerWidth <= 784;

    // Check page type
    const isHospitalPage = location.pathname.includes('hospitalview.php');
    const isFactionPage = location.pathname.includes('factions.php');
    const isOwnFaction = location.search.includes('step=your');
    const isOtherFaction = location.search.includes('step=profile');

    // Check if we're on the info tab for own faction page
    const isInfoTab = () => {
        if (!isOwnFaction) return true; // Not own faction, always show
        return location.hash.includes('tab=info');
    };

    // Load tool enabled state
    toolEnabled = st.g('toolEnabled') !== '0';

    // Inject CSS
    const style = document.createElement('style');
    style.id = 'trb-styles';
    if (!document.getElementById('trb-styles')) {
        style.textContent = `
            /* Base styles (same as original) */
            .trb{position:fixed;padding:10px;background:#f4f4f4;border:1px solid #ccc;z-index:1000;
                 font-size:14px;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.2);resize:both;overflow:auto;max-height:80vh}
            .trb.min{padding:8px 12px;resize:none;overflow:hidden;cursor:pointer;background:#2c2c2c;border-color:#555;min-width:150px}
            .trb.min *{display:none !important}
            .trb.min .ttb{display:flex !important;margin:0;cursor:pointer}
            .trb.min .ttb *{display:inline !important;color:#fff !important}
            .trb.min .ttb button{display:none !important}

            /* Mobile embedded styles */
            .trb.mobile-mode{position:relative !important;left:auto !important;top:auto !important;right:auto !important;
                 width:100% !important;max-width:100% !important;margin:10px 0;resize:none;
                 box-sizing:border-box;max-height:none;border-radius:8px;padding:10px}
            .trb.mobile-mode .ttb{cursor:pointer}
            .trb.mobile-mode .desktop-only{display:none !important}
            .trb.mobile-mode #ct{display:none}

            /* Collapsed mobile */
            .trb.mobile-mode.min{padding:8px 12px;background:#2c2c2c;border-color:#555}

            .tfc{appearance:none;width:14px;height:14px;border:2px solid currentColor;border-radius:3px;
                 margin-right:6px;cursor:pointer;transition:all 0.2s;box-shadow:0 2px 4px rgba(0,0,0,0.2)}
            .tfc:checked{background:currentColor;box-shadow:inset 0 2px 4px rgba(0,0,0,0.2)}
            .tfl{display:inline-flex;align-items:center;font-size:13px;font-weight:bold;cursor:pointer}
            .ttb{display:flex;justify-content:space-between;align-items:center;cursor:grab;margin-bottom:8px}
            .ttb.d{cursor:grabbing}
            .tcb{cursor:pointer;padding:5px;border-radius:4px;border:1px solid #ccc;background:#f9f9f9;
                 box-shadow:0 2px 5px rgba(0,0,0,0.05)}
            .tur{display:grid;grid-template-columns:1fr auto;align-items:center;gap:8px;margin-bottom:5px;
                 padding:5px;border-radius:4px;background:#fff;box-shadow:0 2px 5px rgba(0,0,0,0.2);transition:opacity 0.3s}
            .tur.u{opacity:0.5;border:1px dashed #ccc}
            .trv{cursor:pointer;background:#FF6347;border:none;border-radius:50%;width:24px;height:24px;
                 display:flex;align-items:center;justify-content:center;color:white;font-weight:bold}
            .trv:disabled{background:#ccc;cursor:not-allowed}
            .tsb{font-size:12px;margin-bottom:8px;padding:5px;border-radius:4px;background:#e9e9e9;
                 display:flex;justify-content:space-between}
            .tpb{margin-top:5px;padding:4px 8px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;font-size:11px}
            .tpb:hover{background:#0056b3}

            /* Hidden row styling */
            .user-info-list-wrap li.trb-hidden{display:none !important}
            .faction-info-wrap li.table-row.trb-hidden{display:none !important}

            /* Mobile filters - two rows */
            .trb-mobile-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:6px 8px;background:#f0f0f0;border-radius:4px;margin-bottom:6px;justify-content:space-between}
            .trb-mobile-row:last-child{margin-bottom:8px}
            .trb-mobile-row .tfl{font-size:11px;margin-right:0}
            .trb-mobile-row .tfc{width:12px;height:12px;margin-right:4px}
            .trb-mobile-row select{padding:4px 6px;border-radius:4px;border:1px solid #ccc;font-size:11px;flex:1}
            .trb-mobile-row input[type="text"]{padding:4px 6px;border-radius:4px;border:1px solid #ccc;font-size:11px;flex:1;min-width:60px}

            /* Power button toggle - smaller and cleaner */
            .trb-power-btn{width:22px;height:22px;border-radius:50%;border:2px solid #28a745;background:#28a745;
                          color:white;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;
                          transition:all 0.2s;padding:0;line-height:1;flex-shrink:0}
            .trb-power-btn:hover{opacity:0.85;transform:scale(1.1)}
            .trb-power-btn.off{background:transparent;border-color:#999;color:#999}

            /* Desktop filter sections (original style) */
            .trb-desktop-filters{margin-bottom:10px}
            .trb-desktop-filters > div{margin-bottom:10px}

            /* Faction row with toggle */
            .trb-faction-row{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:5px}

            /* Power button row for faction pages */
            .trb-power-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px;background:#f0f0f0;border-radius:4px;margin-bottom:10px}
            .trb-power-row select{flex:1;padding:5px;border-radius:4px;border:1px solid #ccc}
        `;
        document.head.appendChild(style);
    }

    // Remove any existing box first
    const existingBox = document.getElementById('trb-main-box');
    if (existingBox) existingBox.remove();

    // Create UI
    box = ce('div', {className:'trb', id:'trb-main-box'});

    const title = isHospitalPage ? 'Reviver' : 'Hospitalized';

    // Build the HTML based on page type
    const buildHTML = () => {
        return `
        <div class="ttb">
            <strong><span id="arr"></span> ${title} (<span id="uc">0</span>)</strong>
            <div><button id="rb" class="desktop-only" title="Reset">⟳</button> <span id="cb" style="cursor:pointer;font-size:16px">▼</span></div>
        </div>
        <div class="trb-content">
            <!-- Mobile filters - Row 1: Status toggles -->
            <div class="trb-mobile-row mobile-only" style="display:none;justify-content:space-around">
                <label class="tfl" style="color:${COLORS.A}"><input type="checkbox" id="fa_m" class="tfc" checked style="color:${COLORS.A}">Active</label>
                <label class="tfl" style="color:${COLORS.I}"><input type="checkbox" id="fi_m" class="tfc" checked style="color:${COLORS.I}">Idle</label>
                <label class="tfl" style="color:${COLORS.O}"><input type="checkbox" id="fo_m" class="tfc" checked style="color:${COLORS.O}">Offline</label>
                ${isHospitalPage ? `
                <label class="tfl" style="color:#3A5998"><input type="checkbox" id="fhf_m" class="tfc" checked style="color:#3A5998">Fac</label>
                <label class="tfl" style="color:#666"><input type="checkbox" id="fnf_m" class="tfc" checked style="color:#666">NoFac</label>
                ` : ''}
            </div>
            <!-- Mobile filters - Row 2: Search, Sort, Power -->
            <div class="trb-mobile-row mobile-only" style="display:none">
                ${isHospitalPage ? `<input type="text" id="fif_m" placeholder="Filter faction...">` : ''}
                <select id="sm_m" style="flex:1">
                    <option value="s">Status ↓</option>
                    <option value="sr">Status ↑</option>
                    <option value="t">Time ↓</option>
                    <option value="tr">Time ↑</option>
                    <option value="l">Level ↓</option>
                    <option value="lr">Level ↑</option>
                </select>
                <button id="toolToggle_m" class="trb-power-btn ${toolEnabled ? '' : 'off'}" title="Toggle Tool">⏻</button>
            </div>

            <!-- Desktop filters (original style) -->
            <div class="trb-desktop-filters desktop-only">
                ${isHospitalPage ? `
                <select id="sm" style="margin-bottom:10px;width:100%;padding:5px;border-radius:4px;border:1px solid #ccc">
                    <option value="s">Status: Active→Offline</option>
                    <option value="sr">Status: Offline→Active</option>
                    <option value="t">Time: Long→Short</option>
                    <option value="tr">Time: Short→Long</option>
                    <option value="l">Level: High→Low</option>
                    <option value="lr">Level: Low→High</option>
                </select>
                <div id="fc" style="display:flex;justify-content:space-between;margin-bottom:10px;padding:5px;background:#f0f0f0;border-radius:4px"></div>
                <div style="margin-bottom:5px;padding:5px;background:#f0f0f0;border-radius:4px">
                    <div class="trb-faction-row" style="margin-bottom:10px">
                        <label class="tfl" style="color:#666"><input type="checkbox" id="fhf" class="tfc" checked style="color:#666">Faction</label>
                        <label class="tfl" style="color:#666"><input type="checkbox" id="fnf" class="tfc" checked style="color:#666">No Faction</label>
                        <button id="toolToggle" class="trb-power-btn ${toolEnabled ? '' : 'off'}" title="Toggle Tool">⏻</button>
                    </div>
                    <input type="text" id="fif" placeholder="Faction" style="width:97%;padding:3px;border-radius:3px;border:1px solid #ccc">
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:10px">
                    <button class="tcb" id="pb">⬅️</button>
                    <button class="tcb" id="rl">🔁</button>
                    <button class="tcb" id="nb">➡️</button>
                </div>
                ` : `
                <!-- Faction page: Sort dropdown, Status filters and Power button -->
                <div class="trb-power-row" style="justify-content:space-between;padding:8px;margin-bottom:10px">
                    <select id="sm" style="padding:5px;border-radius:4px;border:1px solid #ccc;flex:1;margin-right:-2px">
                        <option value="s">Status: Active→Offline</option>
                        <option value="sr">Status: Offline→Active</option>
                        <option value="t">Time: Long→Short</option>
                        <option value="tr">Time: Short→Long</option>
                        <option value="l">Level: High→Low</option>
                        <option value="lr">Level: Low→High</option>
                    </select>
                    <div style="display:flex;align-items:center;gap:0px">
                        <button id="toolToggle" class="trb-power-btn ${toolEnabled ? '' : 'off'}" title="Toggle Tool">⏻</button>
                    </div>
                </div>
                <div id="fc" style="display:flex;justify-content:space-between;margin-bottom:10px;padding:5px;background:#f0f0f0;border-radius:4px"></div>
                `}
            </div>

            <div id="sb" class="tsb"></div>
            ${isHospitalPage ? `
            <div class="tsb desktop-only">
                <span id="fcs" style="color:#3A5998">Faction: 0</span>
                <span id="nfc" style="color:#666">No Faction: 0</span>
                <span id="mfc" style="color:#28a745;display:none"></span>
            </div>
            ` : ''}
            <div id="ct"></div>
        </div>
    `;
    };

    box.innerHTML = buildHTML();

    // Update power button states
    const updatePowerButtons = () => {
        const btns = document.querySelectorAll('.trb-power-btn');
        btns.forEach(btn => {
            btn.classList.toggle('off', !toolEnabled);
        });
    };

    // Show all rows (remove all trb-hidden classes)
    const showAllRows = () => {
        document.querySelectorAll('.trb-hidden').forEach(el => {
            el.classList.remove('trb-hidden');
        });
    };

    // Insert based on mobile or desktop and page type
    const insertUI = () => {
        // For own faction page, only show on info tab
        if (isOwnFaction && !isInfoTab()) {
            if (box.parentNode) box.remove();
            return;
        }

        const mobile = isMobile();
        box.classList.toggle('mobile-mode', mobile);

        // Toggle visibility of mobile vs desktop elements
        box.querySelectorAll('.mobile-only').forEach(el => el.style.display = mobile ? '' : 'none');
        box.querySelectorAll('.desktop-only').forEach(el => el.style.display = mobile ? 'none' : '');

        if (mobile) {
            // Mobile placement
            if (isHospitalPage) {
                // Hospital page: after .msg-info-wrap
                const msgWrap = document.querySelector('.msg-info-wrap');
                if (msgWrap && msgWrap.parentNode) {
                    if (box.parentNode !== msgWrap.parentNode || box.previousElementSibling !== msgWrap) {
                        msgWrap.parentNode.insertBefore(box, msgWrap.nextSibling);
                    }
                } else if (!document.body.contains(box)) {
                    document.body.insertBefore(box, document.body.firstChild);
                }
            } else if (isFactionPage) {
                // Faction page: after "Faction Description" title - wait for it to appear
                const descTitle = document.querySelector('.faction-title[data-title="description"]');
                if (descTitle && descTitle.parentNode) {
                    if (box.parentNode !== descTitle.parentNode || box.previousElementSibling !== descTitle) {
                        descTitle.parentNode.insertBefore(box, descTitle.nextSibling);
                    }
                } else {
                    // Element not found yet, don't insert - wait for it to appear
                    return;
                }
            }
            box.style.cssText = '';
        } else {
            // Desktop: floating box
            if (!document.body.contains(box)) {
                document.body.appendChild(box);
            }
            box.style.cssText = `left:${st.g('pX')||DEFAULTS.left};top:${st.g('pY')||DEFAULTS.top};width:${st.g('w')||DEFAULTS.width}`;
        }
    };

    // Initialize UI
    const init = () => {
        insertUI();

        // For mobile faction pages, retry until faction-title appears
        if (isMobile() && isFactionPage && !document.body.contains(box)) {
            const retryInsert = () => {
                const descTitle = document.querySelector('.faction-title[data-title="description"]');
                if (descTitle) {
                    insertUI();
                } else {
                    setTimeout(retryInsert, 200);
                }
            };
            retryInsert();
        }

        // Create desktop status filters
        const fc = document.getElementById('fc');
        if (fc) {
            ['Active','Idle','Offline'].forEach((s,i) => {
                const l = ce('label', {className:'tfl', style:`color:${[COLORS.A,COLORS.I,COLORS.O][i]}`});
                const c = ce('input', {type:'checkbox', id:`f${s[0].toLowerCase()}`, className:'tfc',
                                       checked: st.g(`f_${s[0]}`) !== '0', style:`color:${[COLORS.A,COLORS.I,COLORS.O][i]}`});
                l.append(c, s);
                fc.appendChild(l);
            });
        }

        // Stats bar
        const sb = document.getElementById('sb');
        if (sb) {
            sb.innerHTML = ['Active','Idle','Offline'].map((s,i) =>
                `<span id="${s[0].toLowerCase()}c" style="color:${[COLORS.A,COLORS.I,COLORS.O][i]}">${s}: 0</span>`).join('');
        }

        // Cache elements
        els = {
            box,
            ct: document.getElementById('ct'),
            uc: document.getElementById('uc'),
            sm: document.getElementById('sm'),
            sm_m: document.getElementById('sm_m'),
            cb: document.getElementById('cb'),
            fif: document.getElementById('fif'),
            fif_m: document.getElementById('fif_m'),
            ttb: box.querySelector('.ttb')
        };

        // Load saved states
        const loadSavedStates = () => {
            // Sort
            if (st.g('srt')) {
                if (els.sm) els.sm.value = st.g('srt');
                if (els.sm_m) els.sm_m.value = st.g('srt');
            }
            // Faction filter text
            if (st.g('ff')) {
                if (els.fif) els.fif.value = st.g('ff');
                if (els.fif_m) els.fif_m.value = st.g('ff');
            }
            // Status filters
            ['A','I','O'].forEach(s => {
                const saved = st.g(`f_${s}`);
                const checked = saved !== '0';
                const desktop = document.getElementById(`f${s.toLowerCase()}`);
                const mobile = document.getElementById(`f${s.toLowerCase()}_m`);
                if (desktop) desktop.checked = checked;
                if (mobile) mobile.checked = checked;
            });
            // Faction/No Faction filters
            if (isHospitalPage) {
                ['hf','nf'].forEach(f => {
                    const saved = st.g(`f_${f}`);
                    const checked = saved !== '0';
                    const desktop = document.getElementById(`f${f}`);
                    const mobile = document.getElementById(`f${f}_m`);
                    if (desktop) desktop.checked = checked;
                    if (mobile) mobile.checked = checked;
                });
            }
            // Collapsed state
            if (st.g('col') === '1') {
                box.classList.add('min');
                els.cb.textContent = '▶';
            }
        };
        loadSavedStates();

        // Sync function for mobile/desktop filters
        const syncFilters = (sourceId, value) => {
            const pairs = {
                'fa': 'fa_m', 'fa_m': 'fa',
                'fi': 'fi_m', 'fi_m': 'fi',
                'fo': 'fo_m', 'fo_m': 'fo',
                'fhf': 'fhf_m', 'fhf_m': 'fhf',
                'fnf': 'fnf_m', 'fnf_m': 'fnf',
                'sm': 'sm_m', 'sm_m': 'sm',
                'fif': 'fif_m', 'fif_m': 'fif'
            };
            const targetId = pairs[sourceId];
            const target = document.getElementById(targetId);
            if (target) {
                if (target.type === 'checkbox') target.checked = value;
                else target.value = value;
            }
        };

        // Event handlers
        const rb = document.getElementById('rb');
        if (rb) {
            rb.onclick = (e) => {
                e.stopPropagation();
                box.style.cssText = `left:${DEFAULTS.left};top:${DEFAULTS.top};width:${DEFAULTS.width}`;
                ['pX','pY','w','col'].forEach(st.r);
                box.classList.remove('min');
                els.cb.textContent = '▼';
            };
        }

        const toggleCollapse = () => {
            const min = box.classList.toggle('min');
            els.cb.textContent = min ? '▶' : '▼';
            document.getElementById('arr').textContent = '';
            st.s('col', min ? '1' : '0');
        };

        els.cb.onclick = e => { e.stopPropagation(); toggleCollapse(); };
        els.ttb.onclick = e => {
            if (box.classList.contains('min') && !e.target.closest('button')) {
                e.stopPropagation();
                toggleCollapse();
            }
        };
        box.onclick = e => {
            if (box.classList.contains('min') && !e.target.closest('button')) {
                toggleCollapse();
            }
        };

        // Navigation buttons
        const pb = document.getElementById('pb');
        const rl = document.getElementById('rl');
        const nb = document.getElementById('nb');
        if (pb) pb.onclick = () => nav(-1);
        if (rl) rl.onclick = () => location.reload();
        if (nb) nb.onclick = () => nav(1);

        // Sort change handlers
        const handleSortChange = (e) => {
            st.s('srt', e.target.value);
            syncFilters(e.target.id, e.target.value);
            upd();
        };
        if (els.sm) els.sm.onchange = handleSortChange;
        if (els.sm_m) els.sm_m.onchange = handleSortChange;

        // Checkbox handlers
        box.querySelectorAll('.tfc').forEach(c => {
            c.onchange = () => {
                const baseId = c.id.replace('_m', '');
                let key;
                if (baseId === 'fhf') key = 'f_hf';
                else if (baseId === 'fnf') key = 'f_nf';
                else key = `f_${baseId.replace('f','').toUpperCase()}`;

                st.s(key, c.checked ? '1' : '0');
                syncFilters(c.id, c.checked);
                upd();
            };
        });

        // Faction filter text handlers
        const handleFactionFilter = deb((e) => {
            st.s('ff', e.target.value);
            syncFilters(e.target.id, e.target.value);
            upd();
        }, 300);
        if (els.fif) els.fif.oninput = handleFactionFilter;
        if (els.fif_m) els.fif_m.oninput = handleFactionFilter;

        // Power button toggle handlers - turns entire tool on/off
        const handlePowerToggle = (e) => {
            e.preventDefault();
            e.stopPropagation();
            toolEnabled = !toolEnabled;
            st.s('toolEnabled', toolEnabled ? '1' : '0');
            updatePowerButtons();

            if (toolEnabled) {
                // Tool turned ON - run the filter
                scan();
            } else {
                // Tool turned OFF - show all rows
                showAllRows();
                // Update count to show all
                const uc = document.getElementById('uc');
                if (uc) uc.textContent = '-';
            }
        };

        const toolToggle = document.getElementById('toolToggle');
        const toolToggle_m = document.getElementById('toolToggle_m');
        if (toolToggle) toolToggle.onclick = handlePowerToggle;
        if (toolToggle_m) toolToggle_m.onclick = handlePowerToggle;

        // Drag (desktop only)
        els.ttb.onmousedown = e => {
            if (isMobile() || box.classList.contains('min') || e.target.closest('button') || e.target.id === 'cb') return;
            drag = 1; dx = e.clientX - box.offsetLeft; dy = e.clientY - box.offsetTop;
            els.ttb.classList.add('d'); e.preventDefault();
        };

        document.addEventListener('mousemove', e => {
            if (!drag) return;
            box.style.left = Math.max(0, Math.min(e.clientX - dx, innerWidth - box.offsetWidth)) + 'px';
            box.style.top = Math.max(0, Math.min(e.clientY - dy, innerHeight - box.offsetHeight)) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (!drag) return;
            drag = 0; els.ttb.classList.remove('d');
            st.s('pX', box.style.left); st.s('pY', box.style.top);
        });

        // Resize observer (desktop)
        new ResizeObserver(deb(() => {
            if (box.style.width && !box.classList.contains('min') && !isMobile()) {
                st.s('w', box.style.width);
            }
        }, 500)).observe(box);

        // Handle window resize
        window.addEventListener('resize', deb(() => {
            insertUI();
            if (toolEnabled) upd();
        }, 200));

        // Start scanning only if tool is enabled
        if (toolEnabled) {
            scan();
        }
    };

    // Navigation
    const nav = d => {
        page = Math.max(0, page + d);
        location.href = `https://www.torn.com/hospitalview.php#start=${page * 50}`;
    };

    // Helper function to scroll to user and simulate long press on their profile
    const scrollAndOpenProfile = (userId, userRow) => {
        if (userRow) {
            userRow.scrollIntoView({behavior:'smooth', block:'center'});
            setTimeout(() => {
                const honorWrap = userRow.querySelector('.honorWrap a, a[href*="profiles.php?XID="]');
                if (honorWrap) {
                    const mouseDownEvent = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    honorWrap.dispatchEvent(mouseDownEvent);
                    setTimeout(() => {
                        const mouseUpEvent = new MouseEvent('mouseup', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        honorWrap.dispatchEvent(mouseUpEvent);
                    }, 500);
                }
            }, 500);
        }
    };

    // Scan hospital page
    const scanHospital = () => {
        // If tool is disabled, don't do anything
        if (!toolEnabled) return;

        const allRows = [...document.querySelectorAll('.user-info-list-wrap li')];

        users = allRows.map(u => {
            const r = u.querySelector('a.revive');
            const isAvailable = r && !r.classList.contains('reviveNotAvailable');

            if (!isAvailable) {
                u.classList.add('trb-hidden');
                return null;
            }

            const m = r?.href?.match(/ID=(\d+)/);
            if (!m) return null;

            // Fixed icon detection - check icon ID pattern
            // icon1 = Online, icon62 = Idle, icon2 = Offline
            const iconTray = u.querySelector('#iconTray');
            let status = 'Offline';
            if (iconTray) {
                const icons = iconTray.querySelectorAll('li');
                for (const icon of icons) {
                    const iconId = icon.id || '';
                    const iconTitle = icon.title || '';

                    // Check by title first (more reliable)
                    if (iconTitle.includes('Online')) {
                        status = 'Active';
                        break;
                    } else if (iconTitle.includes('Idle')) {
                        status = 'Idle';
                        break;
                    } else if (iconTitle.includes('Offline')) {
                        status = 'Offline';
                        break;
                    }

                    // Fallback to icon ID pattern
                    if (iconId.startsWith('icon1_')) {
                        status = 'Active';
                        break;
                    } else if (iconId.startsWith('icon62_')) {
                        status = 'Idle';
                        break;
                    } else if (iconId.startsWith('icon2_')) {
                        status = 'Offline';
                        break;
                    }
                }
            }

            const tm = (u.querySelector('.time')?.innerText || '0m').match(/(\d+)([hm])/),
                  t = tm ? (tm[2] === 'h' ? +tm[1] * 60 : +tm[1]) : 0,
                  fl = u.querySelector('a.user.faction'),
                  hf = fl && (fl.classList.length > 2 || fl.href),
                  fm = fl?.href?.match(/ID=(\d+)/);

            const lvlEl = u.querySelector('.level');
            const lvl = lvlEl ? parseInt(lvlEl.textContent) || 0 : 0;

            // Get player name
            const nameEl = u.querySelector('a.user.name') || u.querySelector('.honorWrap a');
            const name = nameEl?.textContent?.trim() || `ID: ${m[1]}`;

            return {
                id: m[1],
                name,
                r,
                st: status,
                t,
                u,
                lvl,
                f: hf ? {h:1, i:fm?.[1]||'', n:fl.querySelector('img')?.title?.trim()||''} : {h:0}
            };
        }).filter(Boolean);

        upd();
    };

    // Scan faction page
    const scanFaction = () => {
        // If tool is disabled, don't do anything
        if (!toolEnabled) return;

        // For own faction page, only run on info tab
        if (isOwnFaction && !isInfoTab()) return;

        users = [...document.querySelectorAll('.faction-info-wrap li.table-row')].map(row => {
            const nameLink = row.querySelector('.honorWrap a, a[href*="profiles.php?XID="]');
            if (!nameLink) return null;

            const idMatch = nameLink.href?.match(/XID=(\d+)/);
            if (!idMatch) return null;

            let name = nameLink.textContent.trim();
            const lvl = parseInt(row.querySelector('.table-cell.lvl')?.textContent || '0');

            const statusIcon = row.querySelector('.userStatusWrap svg');
            let status = 'Offline';
            if (statusIcon) {
                const fill = statusIcon.getAttribute('fill') || '';
                if (fill.includes('online') && !fill.includes('offline')) status = 'Active';
                else if (fill.includes('idle')) status = 'Idle';
            }

            const statusCell = row.querySelector('.table-cell.status span');
            const isHospital = statusCell?.textContent?.toLowerCase().includes('hospital');
            if (!isHospital) {
                row.classList.add('trb-hidden');
                return null;
            }

            return { id: idMatch[1], name, lvl, st: status, t: 0, u: row, f: {h:1} };
        }).filter(Boolean);

        upd();
    };

    const scan = isHospitalPage ? scanHospital : scanFaction;

    // Update display and filter rows
    const upd = () => {
        // If tool is disabled, don't do anything
        if (!toolEnabled) return;

        // For own faction page, only run on info tab
        if (isOwnFaction && !isInfoTab()) return;

        const mobile = isMobile();

        // Get filter values (check both mobile and desktop elements)
        const getChecked = (id) => {
            const el = document.getElementById(id) || document.getElementById(id + '_m');
            return el ? el.checked : true;
        };
        const getValue = (id) => {
            const el = document.getElementById(id) || document.getElementById(id + '_m');
            return el ? el.value : '';
        };

        const fa = getChecked('fa');
        const fi = getChecked('fi');
        const fo = getChecked('fo');
        const fhf = isHospitalPage ? getChecked('fhf') : true;
        const fnf = isHospitalPage ? getChecked('fnf') : true;
        const ff = getValue('fif').toLowerCase();
        const sortVal = getValue('sm') || 's';

        const fs = { A: fa, I: fi, O: fo };

        // Filter users
        let flt = users.filter(u => {
            // Status filter
            if (!fs[u.st[0]]) return false;

            // Faction filters (hospital page only)
            if (isHospitalPage) {
                if (u.f.h && !fhf) return false;
                if (!u.f.h && !fnf) return false;
                if (ff && u.f.h && !u.f.i?.includes(ff) && !u.f.n?.toLowerCase().includes(ff)) return false;
            }
            return true;
        });

        // Sort
        const srt = {
            s: (a,b) => STATUSES.indexOf(a.st) - STATUSES.indexOf(b.st),
            sr: (a,b) => STATUSES.indexOf(b.st) - STATUSES.indexOf(a.st),
            t: (a,b) => b.t - a.t,
            tr: (a,b) => a.t - b.t,
            l: (a,b) => (b.lvl || 0) - (a.lvl || 0),
            lr: (a,b) => (a.lvl || 0) - (b.lvl || 0)
        };
        flt.sort(srt[sortVal]);

        // Create set of filtered IDs
        const filteredIds = new Set(flt.map(u => u.id));

        // Stats
        const cnt = {T:flt.length, Total:users.length, A:0, I:0, O:0, hf:0, nf:0};
        flt.forEach(u => {
            cnt[u.st[0]]++;
            if (u.f.h) cnt.hf++; else cnt.nf++;
        });

        // Update stats display
        const uc = document.getElementById('uc');
        if (uc) uc.textContent = cnt.T;

        ['A','I','O'].forEach((s,i) => {
            const el = document.getElementById(`${s.toLowerCase()}c`);
            if (el) el.textContent = `${STATUSES[i]}: ${cnt[s]}`;
        });

        if (isHospitalPage) {
            const fcs = document.getElementById('fcs');
            const nfc = document.getElementById('nfc');
            const mfc = document.getElementById('mfc');
            if (fcs) fcs.textContent = `Faction: ${cnt.hf}`;
            if (nfc) nfc.textContent = `No Faction: ${cnt.nf}`;
            if (mfc) {
                if (ff && cnt.T) {
                    const mc = flt.filter(u => u.f.h && (u.f.i?.includes(ff) || u.f.n?.toLowerCase().includes(ff))).length;
                    mfc.textContent = `"${ff.substr(0,8)}${ff.length>8?'...':''}": ${mc}`;
                    mfc.style.display = 'inline';
                } else {
                    mfc.style.display = 'none';
                }
            }
        }

        // FILTER THE ACTUAL ROWS
        users.forEach(u => {
            if (u.u) {
                if (filteredIds.has(u.id)) {
                    u.u.classList.remove('trb-hidden');
                } else {
                    u.u.classList.add('trb-hidden');
                }
            }
        });

        // Reorder visible rows
        if (isHospitalPage) {
            const listWrap = document.querySelector('.user-info-list-wrap ul');
            if (listWrap) {
                flt.forEach(u => {
                    if (u.u && u.u.parentNode === listWrap) {
                        listWrap.appendChild(u.u);
                    }
                });
            }
        }

        // Desktop only: show list in panel
        if (!mobile && els.ct) {
            els.ct.innerHTML = flt.length ? '' : `<div style="color:gray;text-align:center;padding:10px">No ${isHospitalPage ? 'revivable users' : 'hospital members'} found</div>`;

            const fg = document.createDocumentFragment();
            flt.forEach(u => {
                const r = ce('div', {className:'tur'});
                const tm = u.t < 60 ? u.t+'m' : Math.floor(u.t/60)+'h '+(u.t%60)+'m';

                if (isHospitalPage) {
                    // Hospital page layout
                    r.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:flex-start">
                        <div>
                            <a href="https://www.torn.com/profiles.php?XID=${u.id}" target="_blank" style="color:#000;font-weight:bold;text-decoration:none">${(u.name || u.id).substring(0, 12)}</a>
                            <div style="font-size:11px;color:#666">⏱️ ${tm}${u.f.h ? ` · F: ${u.f.n || u.f.i || 'Yes'}` : ''}</div>
                        </div>
                        <span style="color:${COLORS[u.st[0]]};font-size:12px;white-space:nowrap">(${u.st})</span>
                    </div>`;

                    if (u.r) {
                        const b = ce('button', {className:'trv', innerHTML:'+', title:'Revive'});
                        b.onclick = () => {
                            const icon = u.r.querySelector('.revive-icon');
                            if (icon) icon.click();
                            b.disabled = true; b.innerHTML = '✓'; r.classList.add('u');
                            setTimeout(() => u.u.scrollIntoView({behavior:'smooth', block:'center'}), 500);
                        };
                        r.appendChild(b);
                    }
                } else {
                    // Faction page layout - original style with Profile button
                    const tmStr = u.t > 0 ? (u.t < 60 ? u.t+'m' : Math.floor(u.t/60)+'h '+(u.t%60)+'m') : '';

                    r.innerHTML = `<div style="line-height:1.3">
                        <div style="font-weight:bold">
                            <a href="https://www.torn.com/profiles.php?XID=${u.id}" target="_blank" style="color:#000;text-decoration:none">
                                ${u.name || u.id}</a> <span style="color:#666;font-size:10px">[${u.id}]</span>
                        </div>
                        <div style="font-size:10px;color:#666">
                            L${u.lvl || 0} • <span style="color:${COLORS[u.st[0]]}">${u.st}</span> • <span style="color:#FF6347">Hospital</span>${tmStr ? ` • ${tmStr}` : ''}
                        </div>
                    </div>`;

                    const btnDiv = ce('div', {style:'display:flex;gap:4px;flex-direction:column'});
                    const profileBtn = ce('button', {className:'tpb', textContent:'Profile', style:'padding:3px 6px;font-size:10px'});
                    profileBtn.onclick = () => {
                        scrollAndOpenProfile(u.id, u.u);
                    };
                    btnDiv.appendChild(profileBtn);
                    r.appendChild(btnDiv);
                }

                fg.appendChild(r);
            });
            els.ct.appendChild(fg);
        }
    };

    // Observers
    const setupObservers = () => {
        if (isHospitalPage) {
            let lastUrl = location.href;
            const urlObserver = new MutationObserver(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    if (toolEnabled) {
                        setTimeout(scan, 500);
                    }
                }
            });
            urlObserver.observe(document, {subtree: true, childList: true});

            const waitForList = () => {
                const hl = document.querySelector('.user-info-list-wrap');
                if (hl) {
                    new MutationObserver(deb(() => {
                        if (toolEnabled) scan();
                    }, 200)).observe(hl, {childList: true, subtree: true});
                } else {
                    setTimeout(waitForList, 200);
                }
            };
            waitForList();
        } else if (isFactionPage) {
            // Watch for hash changes (tab changes on own faction page)
            let lastHash = location.hash;
            const hashObserver = new MutationObserver(() => {
                if (location.hash !== lastHash) {
                    lastHash = location.hash;
                    // Re-check if we should show/hide based on tab
                    insertUI();
                    if (toolEnabled && isInfoTab()) {
                        setTimeout(scan, 500);
                    }
                }
            });
            hashObserver.observe(document, {subtree: true, childList: true});

            // Also listen to hashchange event
            window.addEventListener('hashchange', () => {
                insertUI();
                if (toolEnabled && isInfoTab()) {
                    setTimeout(scan, 500);
                }
            });

            const waitForFaction = () => {
                const fl = document.querySelector('.faction-info-wrap');
                if (fl) {
                    new MutationObserver(deb(() => {
                        if (toolEnabled && isInfoTab()) scan();
                    }, 200)).observe(fl, {childList: true, subtree: true});
                    if (toolEnabled && isInfoTab()) scan();
                } else {
                    setTimeout(waitForFaction, 200);
                }
            };
            waitForFaction();
        }
    };

    // Start when DOM is ready
    const waitForPage = () => {
        if (isHospitalPage) {
            const msgWrap = document.querySelector('.msg-info-wrap');
            const content = document.querySelector('.content-wrapper, .content, #mainContainer');
            if (msgWrap || content || document.readyState === 'complete') {
                init();
                setupObservers();
            } else {
                setTimeout(waitForPage, 100);
            }
        } else if (isFactionPage) {
            const mobile = isMobile();
            if (mobile) {
                // Mobile: wait for .faction-title[data-title="description"]
                const factionTitle = document.querySelector('.faction-title[data-title="description"]');
                if (factionTitle || document.readyState === 'complete') {
                    init();
                    setupObservers();
                } else {
                    setTimeout(waitForPage, 100);
                }
            } else {
                // Desktop: wait for .faction-info-wrap
                const factionWrap = document.querySelector('.faction-info-wrap');
                const content = document.querySelector('.content-wrapper, .content, #mainContainer');
                if (factionWrap || content || document.readyState === 'complete') {
                    init();
                    setupObservers();
                } else {
                    setTimeout(waitForPage, 100);
                }
            }
        }
    };

    waitForPage();
})();