// ==UserScript==
// @name         Kick.com to Twitch.tv Embedder
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  Embeds Kick.com stream video player into Twitch.tv pages with live status indicators
// @author       sushisuish and not AI
// @match        https://www.twitch.tv/*
// @grant        GM_xmlhttpRequest
// @connect      kick.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539105/Kickcom%20to%20Twitchtv%20Embedder.user.js
// @updateURL https://update.greasyfork.org/scripts/539105/Kickcom%20to%20Twitchtv%20Embedder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Config & state
    const cfg = {
        channel: 'tapa_tapa_mateo',
        intervals: {check: 1000, url: 1000, live: 300000},
        maxRecent: 5,
        defaultFavs: [
            {name: "Manastore", id: "manastore"},
            {name: "Xasmur", id: "xasmur"},
            {name: "rolling_typhoon", id: "rolling_typhoon"}
        ]
    };
    
    let S = {
        player: null, orig: null, kick: false,
        intv: {}, btnAdded: false, recent: [],
        curKick: "", favs: [], lastUrl: '',
        isTarget: false, cache: {}, curTwitch: '',
        clickHandler: null
    };

    // HTML templates & styles
    const h = {
        s: { // Status indicators
            live: `<span class="k-live" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#f00;margin-right:8px;"></span>`,
            off: `<span class="k-off" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#888;margin-right:8px;"></span>`,
            err: `<span class="k-err" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#fc0;margin-right:8px;"></span>`
        },
        i: { // Icons
            k: `<span style="font-size:18px;font-weight:bold;text-align:center;display:inline-block;width:100%;">K</span>`,
            t: `<span style="display:flex;align-items:center;justify-content:center;width:100%;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43Z"/></svg></span>`,
            dn: `<span class="k-arrow" style="margin-left:5px;width:14px;text-align:center;">&#9660;</span>`,
            up: `<span class="k-arrow" style="margin-left:5px;width:14px;text-align:center;">&#9650;</span>`,
            sf: `<svg width="20" height="20" viewBox="0 0 24 24" style="margin-left:8px;cursor:pointer;vertical-align:middle;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#FFD700" /></svg>`,
            se: `<svg width="20" height="20" viewBox="0 0 24 24" style="margin-left:8px;cursor:pointer;vertical-align:middle;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="none" stroke="#FFD700" stroke-width="1.5" /></svg>`,
            tr: `<svg width="18" height="18" viewBox="0 0 24 24" style="margin-left:8px;cursor:pointer;vertical-align:middle;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#ff6b6b"/></svg>`
        },
        c: { // CSS
            btn: {
                base: `position:absolute;top:10px;z-index:9999;color:white;border:none;border-radius:4px;padding:6px 10px;font-weight:bold;cursor:pointer;display:flex;align-items:center;justify-content:center;height:30px;`,
                main: `background:#00b800;right:25%;min-width:125px;white-space:nowrap;`,
                min: `background:#00b800;right:calc(25% + 45px);width:40px;transition:width 0.5s ease;`,
                exp: `background:#00b800;right:calc(25% + 45px);width:auto;transition:width 0.5s ease;`,
                twitch: `background:#772ce8;right:25%;width:40px;`
            },
            dd: {
                cont: `position:absolute;background:#18181b;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,0.5);padding:8px;z-index:10000;display:none;width:240px;`,
                item: `padding:8px 12px;cursor:pointer;color:white;border-radius:4px;margin-bottom:4px;font-weight:bold;display:flex;align-items:center;justify-content:space-between;`,
                sect: `padding:4px 12px;color:#adadb8;font-size:12px;margin-top:6px;margin-bottom:2px;`,
                inp: `background:#18181b;color:white;border:1px solid #3a3a3d;border-radius:4px;padding:6px 8px;font-size:14px;width:70%;flex-grow:1;`,
                add: `background:#00b800;color:white;border:none;border-radius:4px;padding:6px 10px;font-weight:bold;cursor:pointer;font-size:12px;`,
                wrap: `padding:8px 12px;color:#dedee3;border-radius:4px;display:flex;align-items:center;gap:8px;margin-top:4px;`
            }
        }
    };

    // Initialize script
    function init() {
        loadChannels();
        S.lastUrl = location.href;
        S.intv.url = setInterval(checkUrl, cfg.intervals.url);
        S.intv.live = setInterval(updateLive, cfg.intervals.live);
        updateLive();
        window.addEventListener('popstate', checkUrl);
    }

    // Load & save channels
    function loadChannels() {
        try {
            const r = localStorage.getItem('kickTwitchRecentChannels');
            if (r) S.recent = JSON.parse(r);

            const f = localStorage.getItem('kickTwitchFavoriteChannels');
            if (f) {
                S.favs = JSON.parse(f);
            } else {
                S.favs = cfg.defaultFavs;
                saveChannels();
            }
        } catch (e) {
            S.recent = [];
            S.favs = cfg.defaultFavs;
        }
    }

    function saveChannels() {
        try {
            localStorage.setItem('kickTwitchRecentChannels', JSON.stringify(S.recent));
            localStorage.setItem('kickTwitchFavoriteChannels', JSON.stringify(S.favs));
        } catch (e) {
            console.error('Error saving channels:', e);
        }
    }

    // Check if URL changed and we're on target channel
    function checkUrl() {
        const url = location.href;
        const changed = url !== S.lastUrl;
        
        // Get current channel from path
        const match = location.pathname.match(/^\/([^\/]+)/);
        const ch = match ? match[1].toLowerCase() : '';
        const onTarget = ch === cfg.channel.toLowerCase();
        
        // First time check
        if (!changed && !S.isTarget && onTarget) {
            S.curTwitch = ch;
            S.isTarget = true;
            if (!S.intv.check) S.intv.check = setInterval(findPlayer, cfg.intervals.check);
            return;
        }
        
        if (!changed) return;
        
        // URL changed
        S.lastUrl = url;
        
        // If on Kick and Twitch channel changed, revert
        if (S.kick && ch !== S.curTwitch && ch) {
            if (S.player && S.orig) {
                S.player.innerHTML = S.orig;
                S.kick = false;
                if (ch === cfg.channel.toLowerCase()) addBtn();
            }
        }
        
        S.curTwitch = ch;
        
        if (onTarget && !S.isTarget) {
            // Entering target channel
            S.isTarget = true;
            if (!S.intv.check) S.intv.check = setInterval(findPlayer, cfg.intervals.check);
        } else if (!onTarget && S.isTarget) {
            // Leaving target channel
            S.isTarget = false;
            if (S.intv.check) {
                clearInterval(S.intv.check);
                S.intv.check = null;
            }
            document.querySelectorAll('.k-btn, .k-switch-btn').forEach(b => b.remove());
            S.player = null;
            S.btnAdded = false;
        }
    }

    // Find Twitch player
    function findPlayer() {
        if (!S.isTarget) return;
        
        const selectors = [
            '.video-player__container', '.video-player', '.player-overlay',
            '.video-ref', '.channel-root .persistent-player',
            '.channel-info-content .persistent-player', '.persistent-player',
            '.stream-player', '[data-a-target="video-player"]', '.player',
            '.video-player__container div[data-a-target="player-overlay"]'
        ];
        
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el) {
                clearInterval(S.intv.check);
                S.intv.check = null;
                S.player = el;
                S.player.style.position = 'relative';
                S.player.style.overflow = 'hidden';
                
                if (!S.btnAdded) {
                    addBtn();
                    S.btnAdded = true;
                }
                break;
            }
        }
    }

    // Check channel live status
    function updateLive() {
        // Check favorites & recent channels
        S.favs.forEach(ch => checkStatus(ch.id));
        S.recent.forEach(ch => checkStatus(ch));
        
        // Update button
        const btn = document.querySelector('.k-btn');
        if (btn && btn.dataset.open !== 'true') updateBtnIndicator(btn);
    }

    function checkStatus(id) {
        const now = Date.now();
        const cached = S.cache[id];
        
        if (cached && (now - cached.time < 60000)) return;
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://kick.com/api/v1/channels/${id}`,
            headers: {'Accept': 'application/json'},
            onload: function(r) {
                try {
                    const data = JSON.parse(r.responseText);
                    const exists = data && data.id && data.slug && data.user_id;
                    const isLive = exists && data.livestream !== null;
                    
                    S.cache[id] = {
                        live: isLive,
                        exists: exists,
                        time: now
                    };
                    
                    updateLive();
                    
                    const dd = document.querySelector('.k-dropdown');
                    if (dd && dd.style.display !== 'none') updateStatusIcons();
                } catch (e) {
                    S.cache[id] = {live: false, exists: false, error: true, time: now};
                    updateStatusIcons();
                }
            },
            onerror: function() {
                S.cache[id] = {live: false, exists: false, error: true, time: now};
                updateStatusIcons();
            }
        });
    }

    // Update button indicator (live dot or arrow)
    function updateBtnIndicator(btn) {
        // Check if any channels are live
        let anyLive = false;
        
        // Check favorites then recent channels
        for (const ch of [...S.favs, ...S.recent.map(id => ({id}))]) {
            const cached = S.cache[ch.id];
            if (cached && cached.live && cached.exists) {
                anyLive = true;
                break;
            }
        }
        
        btn.dataset.anyLive = anyLive ? 'true' : 'false';
        
        const ind = btn.querySelector('.indicator');
        if (ind) {
            ind.innerHTML = anyLive ? 
                '<span style="width:10px;height:10px;border-radius:50%;background:#f00;display:inline-block;"></span>' : 
                '&#9660;';
        }
    }

    // Update status indicators in dropdown
    function updateStatusIcons() {
        document.querySelectorAll('.k-channel-item').forEach(item => {
            const id = item.dataset.channelId;
            if (!id) return;
            
            let ind = item.querySelector('.k-live, .k-off, .k-err');
            
            if (!ind) {
                ind = document.createElement('span');
                item.prepend(ind);
            }
            
            const cached = S.cache[id];
            
            if (!cached) {
                ind.outerHTML = h.s.off;
            } else if (cached.error || !cached.exists) {
                ind.outerHTML = h.s.err;
                const newInd = item.querySelector('.k-err');
                if (newInd) {
                    newInd.title = cached.exists === false ? 
                        "Channel doesn't exist" : "Error checking channel";
                }
            } else if (cached.live) {
                ind.outerHTML = h.s.live;
            } else {
                ind.outerHTML = h.s.off;
            }
        });
    }

    // Add the main Kick button
    function addBtn() {
        if (!S.player) return;
        
        document.querySelectorAll('.k-btn, .k-switch-btn').forEach(b => b.remove());
        
        // Check for any live channels
        let anyLive = false;
        for (const ch of [...S.favs, ...S.recent.map(id => ({id}))]) {
            const cached = S.cache[ch.id];
            if (cached && cached.live && cached.exists) {
                anyLive = true;
                break;
            }
        }
        
        const btn = document.createElement('button');
        btn.classList.add('k-btn');
        btn.dataset.open = 'false';
        btn.dataset.anyLive = anyLive ? 'true' : 'false';
        btn.setAttribute('style', h.c.btn.base + h.c.btn.main);
        
        btn.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;width:100%;">
                <span>Switch to</span>
                <span style="font-size:18px;font-weight:bold;padding:0 5px;">K</span>
                <span class="indicator" style="width:14px;display:inline-flex;align-items:center;justify-content:center;">
                    ${anyLive ? 
                        '<span style="width:10px;height:10px;border-radius:50%;background:#f00;display:inline-block;"></span>' : 
                        '&#9660;'}
                </span>
            </div>
        `;
        
        btn.addEventListener('click', e => {
            e.stopPropagation();
            
            const isOpen = btn.dataset.open === 'true';
            
            document.querySelectorAll('.k-dropdown').forEach(d => d.remove());
            
            if (S.clickHandler) {
                document.removeEventListener('click', S.clickHandler);
                S.clickHandler = null;
            }
            
            const ind = btn.querySelector('.indicator');
            
            if (isOpen) {
                btn.dataset.open = 'false';
                updateBtnIndicator(btn);
                return;
            }
            
            btn.dataset.open = 'true';
            ind.innerHTML = '&#9650;';
            
            createDropdown(btn.getBoundingClientRect(), btn);
        });
        
        document.body.appendChild(btn);
    }

    // Add switch channel buttons (when on Kick)
    function addSwitchBtns() {
        if (!S.player) return;
        
        document.querySelectorAll('.k-btn, .k-switch-btn').forEach(b => b.remove());
        
        // Back to Twitch button
        const backBtn = document.createElement('button');
        backBtn.innerHTML = h.i.t;
        backBtn.setAttribute('style', h.c.btn.base + h.c.btn.twitch);
        backBtn.classList.add('k-btn');
        
        backBtn.addEventListener('click', () => {
            S.player.innerHTML = S.orig;
            S.kick = false;
            addBtn();
        });
        
        // Switch Kick channel button
        const switchBtn = document.createElement('button');
        switchBtn.innerHTML = h.i.k;
        switchBtn.setAttribute('style', h.c.btn.base + h.c.btn.min);
        switchBtn.classList.add('k-switch-btn');
        switchBtn.dataset.open = 'false';
        
        // Hover effects
        switchBtn.addEventListener('mouseenter', function() {
            this.innerHTML = '';
            
            const text = document.createElement('span');
            text.textContent = 'Switch Channel ';
            this.appendChild(text);
            
            const kLogo = document.createElement('span');
            kLogo.innerHTML = `<span style="font-size:18px;font-weight:bold;margin-left:4px;">K</span>`;
            this.appendChild(kLogo);
            
            const arrow = document.createElement('span');
            arrow.innerHTML = this.dataset.open === 'true' ? h.i.up : h.i.dn;
            arrow.classList.add('k-arrow');
            this.appendChild(arrow);
            
            this.setAttribute('style', h.c.btn.base + h.c.btn.exp);
        });
        
        switchBtn.addEventListener('mouseleave', function() {
            if (this.dataset.open !== 'true') {
                this.innerHTML = h.i.k;
                this.setAttribute('style', h.c.btn.base + h.c.btn.min);
            }
        });
        
        // Dropdown toggle
        switchBtn.addEventListener('click', e => {
            e.stopPropagation();
            
            const isOpen = switchBtn.dataset.open === 'true';
            
            document.querySelectorAll('.k-dropdown').forEach(d => d.remove());
            
            if (S.clickHandler) {
                document.removeEventListener('click', S.clickHandler);
                S.clickHandler = null;
            }
            
            if (isOpen) {
                switchBtn.dataset.open = 'false';
                
                if (!switchBtn.matches(':hover')) {
                    switchBtn.innerHTML = h.i.k;
                    switchBtn.setAttribute('style', h.c.btn.base + h.c.btn.min);
                } else {
                    const arrow = switchBtn.querySelector('.k-arrow');
                    if (arrow) arrow.innerHTML = h.i.dn;
                }
                return;
            }
            
            switchBtn.dataset.open = 'true';
            
            if (switchBtn.innerHTML === h.i.k) {
                switchBtn.innerHTML = '';
                
                const text = document.createElement('span');
                text.textContent = 'Switch Channel ';
                switchBtn.appendChild(text);
                
                const kLogo = document.createElement('span');
                kLogo.innerHTML = `<span style="font-size:18px;font-weight:bold;margin-left:4px;">K</span>`;
                switchBtn.appendChild(kLogo);
                
                const arrow = document.createElement('span');
                arrow.innerHTML = h.i.up;
                arrow.classList.add('k-arrow');
                switchBtn.appendChild(arrow);
            } else {
                const arrow = switchBtn.querySelector('.k-arrow');
                if (arrow) arrow.innerHTML = h.i.up;
            }
            
            switchBtn.setAttribute('style', h.c.btn.base + h.c.btn.exp);
            
            createDropdown(switchBtn.getBoundingClientRect(), switchBtn);
        });
        
        document.body.appendChild(backBtn);
        document.body.appendChild(switchBtn);
    }

    // Create dropdown with channel list
    function createDropdown(rect, parentBtn) {
        const dd = document.createElement('div');
        dd.setAttribute('style', h.c.dd.cont);
        dd.classList.add('k-dropdown');
        
        dd.style.top = (rect.bottom + window.scrollY) + 'px';
        dd.style.left = (rect.left + window.scrollX) + 'px';
        dd.style.display = 'block';
        
        // Add favorites section
        if (S.favs.length > 0) {
            const header = document.createElement('div');
            header.textContent = 'FAVORITE CHANNELS';
            header.setAttribute('style', h.c.dd.sect);
            dd.appendChild(header);
            
            // Add favorite channels
            S.favs.forEach(ch => {
                dd.appendChild(createChannelItem(ch.id, ch.name, true, rect, parentBtn, dd));
            });
        }
        
        // Add recent channels section
        if (S.recent.length > 0) {
            const header = document.createElement('div');
            header.textContent = 'RECENT CHANNELS';
            header.setAttribute('style', h.c.dd.sect);
            dd.appendChild(header);
            
            S.recent.forEach(ch => {
                dd.appendChild(createChannelItem(ch, ch, false, rect, parentBtn, dd));
            });
        }
        
        // Add separator
        const sep = document.createElement('div');
        sep.setAttribute('style', 'border-top:1px solid #3a3a3d;margin:8px 0;');
        dd.appendChild(sep);
        
        // Add custom channel input
        const container = document.createElement('div');
        container.setAttribute('style', h.c.dd.wrap);
        
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Custom channel...');
        input.setAttribute('style', h.c.dd.inp);
        
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add';
        addBtn.setAttribute('style', h.c.dd.add);
        
        input.addEventListener('click', e => e.stopPropagation());
        
        input.addEventListener('keypress', e => {
            e.stopPropagation();
            if (e.key === 'Enter') {
                e.preventDefault();
                const channel = input.value.trim();
                if (channel) validateChannel(channel, dd);
            }
        });
        
        addBtn.addEventListener('click', e => {
            e.stopPropagation();
            const channel = input.value.trim();
            if (channel) validateChannel(channel, dd);
        });
        
        container.appendChild(input);
        container.appendChild(addBtn);
        dd.appendChild(container);
        
        // Close dropdown on outside click
        S.clickHandler = e => {
            if (!dd.contains(e.target) &&
                !e.target.classList.contains('k-btn') &&
                !e.target.classList.contains('k-switch-btn')) {
                
                document.querySelectorAll('.k-dropdown').forEach(d => d.style.display = 'none');
                
                // Update buttons
                document.querySelectorAll('.k-btn').forEach(btn => {
                    if (btn.dataset.open === 'true') {
                        btn.dataset.open = 'false';
                        updateBtnIndicator(btn);
                    }
                });
                
                document.querySelectorAll('.k-switch-btn').forEach(btn => {
                    if (btn.dataset.open === 'true') {
                        btn.dataset.open = 'false';
                        
                        if (!btn.matches(':hover')) {
                            btn.innerHTML = h.i.k;
                            btn.setAttribute('style', h.c.btn.base + h.c.btn.min);
                        } else {
                            const arrow = btn.querySelector('.k-arrow');
                            if (arrow) arrow.innerHTML = h.i.dn;
                        }
                    }
                });
                
                document.removeEventListener('click', S.clickHandler);
                S.clickHandler = null;
            }
        };
        
        document.addEventListener('click', S.clickHandler);
        document.body.appendChild(dd);
        updateStatusIcons();
        
        return dd;
    }

    // Create a channel item for the dropdown
    function createChannelItem(id, name, isFav, rect, parentBtn, dd) {
        const item = document.createElement('div');
        item.setAttribute('style', h.c.dd.item + `background:${isFav ? '#00b800' : '#006600'};`);
        item.classList.add('k-channel-item');
        item.dataset.channelId = id;
        
        // Add status indicator
        const cached = S.cache[id];
        let status = h.s.off;
        
        if (cached) {
            if (cached.error || !cached.exists) {
                status = h.s.err;
            } else if (cached.live) {
                status = h.s.live;
            }
        }
        
        item.innerHTML = status;
        
        // Channel name
        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        nameSpan.style.flexGrow = '1';
        nameSpan.style.cursor = 'pointer';
        
        // Trash icon
        const trashIcon = document.createElement('span');
        trashIcon.innerHTML = h.i.tr;
        trashIcon.title = 'Remove from list';
        trashIcon.style.display = 'flex';
        trashIcon.style.alignItems = 'center';
        
        // Star icon
        const starIcon = document.createElement('span');
        starIcon.innerHTML = isFav ? h.i.sf : h.i.se;
        starIcon.title = isFav ? 'Remove from favorites' : 'Add to favorites';
        starIcon.style.display = 'flex';
        starIcon.style.alignItems = 'center';
        
        // Add elements
        item.appendChild(nameSpan);
        item.appendChild(trashIcon);
        item.appendChild(starIcon);
        
        // Channel name click
        nameSpan.addEventListener('click', e => {
            e.stopPropagation();
            dd.style.display = 'none';
            embedKick(id);
        });
        
        // Trash icon click
        trashIcon.addEventListener('click', e => {
            e.stopPropagation();
            
            if (isFav) {
                if (confirm(`Remove "${name}" from your channels?`)) {
                    S.favs = S.favs.filter(ch => ch.id.toLowerCase() !== id.toLowerCase());
                    saveChannels();
                    item.style.display = 'none';
                    setTimeout(() => {
                        dd.style.display = 'none';
                        createDropdown(rect, parentBtn);
                    }, 10);
                }
            } else {
                // Remove from recent without confirmation
                S.recent = S.recent.filter(ch => ch.toLowerCase() !== id.toLowerCase());
                saveChannels();
                item.style.display = 'none';
                
                if (S.recent.length === 0) {
                    setTimeout(() => {
                        dd.style.display = 'none';
                        createDropdown(rect, parentBtn);
                    }, 10);
                }
            }
        });
        
        // Star icon click
        starIcon.addEventListener('click', e => {
            e.stopPropagation();
            
            if (isFav) {
                S.favs = S.favs.filter(ch => ch.id.toLowerCase() !== id.toLowerCase());
                saveChannels();
                item.style.display = 'none';
            } else {
                if (!S.favs.some(ch => ch.id.toLowerCase() === id.toLowerCase())) {
                    S.favs.push({id, name});
                    S.recent = S.recent.filter(ch => ch.toLowerCase() !== id.toLowerCase());
                    saveChannels();
                    item.style.display = 'none';
                }
            }
            
            setTimeout(() => {
                dd.style.display = 'none';
                createDropdown(rect, parentBtn);
            }, 10);
        });
        
        return item;
    }

    // Validate a channel before adding
    function validateChannel(channelName, dd) {
        const cached = S.cache[channelName];
        const now = Date.now();
        
        if (cached && now - cached.time < 60000) {
            if (cached.exists === false) {
                alert(`Channel "${channelName}" doesn't exist on Kick.com.`);
                return;
            } else {
                dd.style.display = 'none';
                embedKick(channelName);
            }
        } else {
            // Show loading message
            const loading = document.createElement('div');
            loading.textContent = `Validating channel "${channelName}"...`;
            loading.style.position = 'fixed';
            loading.style.transform = 'translate(-50%, -50%)';
            loading.style.backgroundColor = '#18181b';
            loading.style.color = 'white';
            loading.style.padding = '10px 20px';
            loading.style.borderRadius = '4px';
            loading.style.zIndex = '10001';
            document.body.appendChild(loading);
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://kick.com/api/v1/channels/${channelName}`,
                headers: {'Accept': 'application/json'},
                onload: function(r) {
                    document.body.removeChild(loading);
                    
                    try {
                        const data = JSON.parse(r.responseText);
                        const exists = data && data.id && data.slug && data.user_id;
                        
                        S.cache[channelName] = {
                            live: exists && data.livestream !== null,
                            exists: exists,
                            time: now
                        };
                        
                        if (exists) {
                            dd.style.display = 'none';
                            embedKick(channelName);
                        } else {
                            alert(`Channel "${channelName}" doesn't exist on Kick.com.`);
                        }
                    } catch (e) {
                        alert(`Error validating channel "${channelName}". Please try again.`);
                        
                        S.cache[channelName] = {
                            live: false, exists: false, error: true, time: now
                        };
                    }
                },
                onerror: function() {
                    document.body.removeChild(loading);
                    alert(`Error connecting to Kick.com. Please check your connection.`);
                    
                    S.cache[channelName] = {
                        live: false, exists: false, error: true, time: now
                    };
                }
            });
        }
    }

    // Embed Kick player
    function embedKick(channelName) {
        const cached = S.cache[channelName];
        if (cached && cached.exists === false) {
            alert(`Channel "${channelName}" doesn't exist on Kick.com.`);
            return;
        }
        
        S.curKick = channelName;
        
        // Add to recent channels if not a favorite
        if (!S.favs.some(ch => ch.id.toLowerCase() === channelName.toLowerCase())) {
            S.recent = S.recent.filter(ch => ch.toLowerCase() !== channelName.toLowerCase());
            S.recent.unshift(channelName);
            
            if (S.recent.length > cfg.maxRecent) {
                S.recent = S.recent.slice(0, cfg.maxRecent);
            }
            
            saveChannels();
            checkStatus(channelName);
        }
        
        if (!S.orig) {
            S.orig = S.player.innerHTML;
        }
        
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        
        container.innerHTML = `
            <iframe
                id="kick-iframe"
                height="100%"
                width="100%"
                scrolling="no"
                style="border:none;"
                src="https://kick.com/${channelName}">
            </iframe>
        `;
        
        S.player.innerHTML = '';
        S.player.appendChild(container);
        S.kick = true;
        addSwitchBtns();
    }

    // Start the script
    init();
})();