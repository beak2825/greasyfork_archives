// ==UserScript==
// @name         Debrid Download Helper (Multi-Provider)
// @namespace    http://tampermonkey.net/
// @version      1.20
// @description  Download files with a single click without visiting the debrid providers' website.
// @author       Superflyin
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @connect      real-debrid.com
// @connect      alldebrid.com
// @connect      premiumize.me
// @connect      linksnappy.com
// @connect      torbox.app
// @connect      torbox.io
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/542034/Debrid%20Download%20Helper%20%28Multi-Provider%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542034/Debrid%20Download%20Helper%20%28Multi-Provider%29.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    if (window.top !== window.self) return;

    // =================================================================
    // 1. CONFIGURATION
    // =================================================================
    const providers = {
        "real-debrid": {
            name: "Real-Debrid",
            icon: "https://www.google.com/s2/favicons?domain=real-debrid.com&sz=64",
            magnetUrl: "https://real-debrid.com/torrents",
            apiUnrestrict: "https://api.real-debrid.com/rest/1.0/unrestrict/link",
            apiAddTorrent: "https://api.real-debrid.com/rest/1.0/torrents/addTorrent",
            apiSelect: "https://api.real-debrid.com/rest/1.0/torrents/selectFiles",
            type: "rd",
            headers: apiKey => ({ 'Authorization': `Bearer ${apiKey}` })
        },
        "alldebrid": {
            name: "AllDebrid",
            icon: "https://www.google.com/s2/favicons?domain=alldebrid.com&sz=64",
            magnetUrl: "https://alldebrid.com/magnets/",
            apiUrl: "https://api.alldebrid.com/v4/link/unlock",
            type: "ad",
            method: "GET",
            buildUrl: (apiKey, url) => `https://api.alldebrid.com/v4/link/unlock?agent=userscript&apikey=${apiKey}&link=${encodeURIComponent(url)}`,
            parseResponse: resp => { try { let j = JSON.parse(resp); return (j.data && j.data.link) || null; } catch { return null; } }
        },
        "premiumize": {
            name: "Premiumize",
            icon: "https://www.google.com/s2/favicons?domain=premiumize.me&sz=64",
            magnetUrl: "https://www.premiumize.me/transfers",
            apiAdd: "https://www.premiumize.me/api/transfer/create",
            apiUnrestrict: "https://www.premiumize.me/api/transfer/directdl",
            type: "pm",
            headers: () => ({})
        },
        "linksnappy": {
            name: "LinkSnappy",
            icon: "https://www.google.com/s2/favicons?domain=linksnappy.com&sz=64",
            magnetUrl: "https://linksnappy.com/my-files",
            apiUrl: "https://api.linksnappy.com/file/unlock",
            type: "ls",
            method: "POST",
            headers: apiKey => ({ 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/x-www-form-urlencoded' }),
            data: url => `url=${encodeURIComponent(url)}`,
            parseResponse: resp => { try { let j = JSON.parse(resp); return (j.result && j.result.url) || null; } catch { return null; } }
        },
        "torbox": {
            name: "TorBox",
            icon: "https://www.google.com/s2/favicons?domain=torbox.app&sz=64",
            magnetUrl: "https://torbox.app/downloads",
            apiUrl: "https://api.torbox.io/v1/unrestrict",
            type: "tb",
            method: "POST",
            headers: apiKey => ({ 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/x-www-form-urlencoded' }),
            data: url => `link=${encodeURIComponent(url)}`,
            parseResponse: resp => { try { return JSON.parse(resp).download || null; } catch { return null; } }
        }
    };

    // Supported Hosters
    const supportedPatterns = [
        { host: "1fichier.com",     pattern: /^\/\?[a-zA-Z0-9]{20,}/ },
        { host: "rapidgator.net",   pattern: /^\/file\/[a-fA-F0-9]{32}/ },
        { host: "mega.nz",          pattern: /\/file\/[a-zA-Z0-9!#\-_]+/ },
        { host: "turbobit.net",     pattern: /\/([a-z0-9]+)\.html/ },
        { host: "uploaded.net",     pattern: /^\/file\/[a-z0-9]+/ },
        { host: "nitroflare.com",   pattern: /^\/view\/([A-Za-z0-9]+)/ },
        { host: "uptobox.com",      pattern: /^\/[a-zA-Z0-9]{12,}/ },
        { host: "mediafire.com",    pattern: /^\/file\/[a-zA-Z0-9_]+\/.+/ },
        { host: "ddownload.com",    pattern: /^\/[a-zA-Z0-9]{10,}/ },
        { host: "rg.to",            pattern: /^\/file\/[a-fA-F0-9]{32}/ },
        { host: "filefactory.com",  pattern: /^\/file\/([a-zA-Z0-9]+)/ },
        { host: "katfile.com",      pattern: /^\/[a-zA-Z0-9]{12,}/ },
        { host: "katfile.cloud",    pattern: /^\/[a-zA-Z0-9]+/ },
        { host: "userscloud.com",   pattern: /^\/[a-z0-9]{12,}$/ },
        { host: "drop.download",    pattern: /^\/[a-zA-Z0-9]{12,}/ },
        { host: "clicknupload.cc",  pattern: /^\/file\/.+/ },
        { host: "dailyuploads.net", pattern: /^\/[a-zA-Z0-9]{12,}$/ }
    ];

    // --- 2. STATE ---
    let currentProvider = GM_getValue('currentProvider', 'real-debrid');
    let apiKeys = GM_getValue('debridApiKeys', {});
    let apiKey = apiKeys[currentProvider] || '';
    let isAutoMode = false;

    GM_registerMenuCommand("Switch Debrid Provider", () => showProviderMenu());
    GM_registerMenuCommand("Set Debrid API Key", () => showApiKeyModal(providers[currentProvider].name, apiKey));

    // --- 3. MAGNET AUTO-FILLER ---
    if (location.hostname.includes('real-debrid.com') && location.hash.indexOf('#magnet') === 0) {
        const magnet = decodeURIComponent(location.hash.substr(1));
        const interval = setInterval(() => {
            const inp = document.querySelector('input[name="magnet"], textarea[name="magnet"], #magnet_link');
            if(inp) {
                clearInterval(interval);
                inp.value = magnet;
                location.hash = '';
                const btn = document.getElementById('downloadbutton') || document.querySelector('input[type="submit"]') || document.getElementById('sub_magnet');
                if(btn) btn.click(); else inp.form.submit();
            }
        }, 300);
        return;
    }

    // --- 4. AUTO-PROCESSOR (Tab Reuse) ---
    const autoProcessTime = GM_getValue('auto_process_start', 0);
    const now = Date.now();
    if (now - autoProcessTime < 15000) {
        isAutoMode = true;
        GM_deleteValue('auto_process_start');
        if (isExtTo()) setTimeout(() => processExtToPage(null), 500);
    }

    // --- 5. HELPERS ---
    function isExtTo() {
        const host = window.location.hostname;
        return host.includes('ext.to') || host.includes('tfiles.org');
    }

    function isFileHosterPage(url) {
        try {
            const parsedUrl = new URL(url);
            const host = parsedUrl.hostname.replace(/^www\./, '');
            const path = parsedUrl.pathname + parsedUrl.hash + parsedUrl.search;
            return supportedPatterns.some(h => h.host === host && h.pattern.test(path));
        } catch(e) { return false; }
    }

    function extractHashFromUrl(url) {
        const match = url.match(/([A-Fa-f0-9]{40})/);
        return match ? match[1] : null;
    }

    function isDirectLink(url) {
        try {
            const parsedUrl = new URL(url);
            const host = parsedUrl.hostname.replace(/^www\./, '');
            const path = parsedUrl.pathname + parsedUrl.hash + parsedUrl.search;
            return supportedPatterns.some(h => h.host === host && h.pattern.test(path));
        } catch(e) { return false; }
    }

    function isTorrentFileLink(url) {
        return url.match(/\.torrent($|\?)/i);
    }

    function findHashOnPage() {
        const html = document.body.innerHTML;
        const match = html.match(/\b([A-Fa-f0-9]{40})\b/);
        if (match) return match[1];
        return null;
    }

    // --- 6. UI: DOWNLOAD BAR ---
    function addDownloadBar() {
        if (!isFileHosterPage(window.location.href)) return;
        if ($('#debrid-download-bar').length > 0) return;

        const provider = providers[currentProvider];
        const $bar = $(`
            <div id="debrid-download-bar">
                <span>Download this file with ${provider.name}:</span>
                <button class="debrid-bar-action-button" title="Download with ${provider.name}">
                    <img src="${provider.icon}" alt="${provider.name}" width="22" height="22">
                </button>
            </div>
        `);

        $bar.find('.debrid-bar-action-button').on('click', function(e) {
            e.preventDefault();
            handleDirectUnlock(window.location.href, $(this));
        });
        $('body').prepend($bar);
    }

    // --- 7. SCANNER ---
    function scan() {
        addDownloadBar();
        if (isExtTo()) scanExtTo(); else scanGeneric();
    }

    function scanExtTo() {
        const detailSelector = '.download-btn-file, .download-btn-magnet, .detail-download-link';
        $(detailSelector).not('.debrid-processed').each(function() {
            const $el = $(this);
            $el.addClass('debrid-processed');
            createDebridButton($el, 'ext-detail');
        });

        $('.dwn-btn').not('.debrid-processed').each(function() {
            const $el = $(this);
            $el.addClass('debrid-processed');
            createDebridButton($el, 'ext-list');
        });

        $('a[href*="magnet:"], a[href*=".torrent"]').not('.debrid-processed').each(function() {
            $(this).addClass('debrid-processed');
            createDebridButton($(this), 'magnet');
        });
    }

    function scanGeneric() {
        $('a').not('.debrid-processed').each(function() {
            const $el = $(this);
            const href = $el.attr('href') || '';

            if (href.includes('magnet:')) {
                $el.addClass('debrid-processed');
                createDebridButton($el, 'magnet');
            }
            else if (isTorrentFileLink(href)) {
                $el.addClass('debrid-processed');
                createDebridButton($el, 'torrent-file');
            }
            else if (isDirectLink(href)) {
                $el.addClass('debrid-processed');
                createDebridButton($el, 'direct');
            }
        });
    }

    function createDebridButton($targetLink, type) {
        if ($targetLink.next('.debrid-btn').length > 0) return;

        const provider = providers[currentProvider];
        // Cleaned up the image tag to remove inline vertical-align since we handle it in CSS now
        let imgHtml = `<img src="${provider.icon}" width="18" height="18" style="cursor:pointer; object-fit:contain;" alt="${provider.name}">`;

        // Create the button container
        const $btn = $('<span class="debrid-btn" title="Download with Debrid">' + imgHtml + '</span>');

        $btn.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if(e.altKey) { showProviderMenu(); return; }

            const href = $targetLink.attr('href');

            if (type === 'direct') {
                handleDirectUnlock(href, $btn);
            }
            else if (type === 'ext-list') {
                let targetUrl = href;
                // Fix for ext.to lists: if href is missing/js, find the title link in the row
                if (!targetUrl || targetUrl.trim() === '' || targetUrl.includes('javascript') || targetUrl === '#') {
                    const $row = $targetLink.closest('tr, .row');
                    const $titleLink = $row.find('a[href^="/"]:not([href^="/u/"]):not([href^="/c/"]):not(.dwn-btn)').first();
                    if ($titleLink.length) {
                        targetUrl = $titleLink.attr('href');
                    }
                }

                if (targetUrl && targetUrl.startsWith('/')) {
                    GM_setValue('auto_process_start', Date.now());
                    window.open(targetUrl, '_blank');
                    $btn.html('↗️');
                } else {
                    alert("Could not find detail link.");
                }
            }
            else if (type === 'ext-detail') {
                processExtToPage($btn);
            }
            else if (type === 'torrent-file') {
                handleTorrentFileUpload(href, $btn);
            }
            else {
                let finalUrl = href;
                if (href.includes('.torrent')) {
                    const hash = extractHashFromUrl(href);
                    if (hash) finalUrl = `magnet:?xt=urn:btih:${hash}`;
                }
                sendToDebridMagnet(finalUrl, $btn);
            }
        });

        $targetLink.after($btn);
    }

    // --- 8. HANDLERS ---

    function handleTorrentFileUpload(url, $btn) {
        if (!apiKey) { showApiKeyModal(providers[currentProvider].name, apiKey); return; }
        const provider = providers[currentProvider];

        // PM API
        if (provider.type === 'pm') {
             const originalContent = $btn.html(); $btn.html('⏳');
             GM_xmlhttpRequest({
                method: "POST", url: provider.apiAdd, headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: `apikey=${apiKey}&src=${encodeURIComponent(url)}`,
                onload: function(res) {
                    const json = JSON.parse(res.responseText);
                    if(json.status === 'success') { $btn.html('✔️'); window.open("https://www.premiumize.me/transfers", "_blank"); setTimeout(() => $btn.html(originalContent), 3000); }
                    else { alert("PM Error: " + json.message); $btn.html('❌'); }
                }
             });
             return;
        }

        // RD API (Others fallback to direct open)
        if (currentProvider !== 'real-debrid') { window.open(url, '_blank'); return; }

        const originalContent = $btn.html(); $btn.html('⏳');
        GM_xmlhttpRequest({
            method: "GET", url: url, responseType: "blob", anonymous: false,
            headers: { "Referer": window.location.href, "User-Agent": navigator.userAgent },
            onload: function(response) {
                if (response.status !== 200) { if(confirm(`Download failed (${response.status}). Open torrent directly?`)) window.open(url, '_blank'); $btn.html('❌'); setTimeout(() => $btn.html(originalContent), 3000); return; }
                $btn.html('⬆️');
                GM_xmlhttpRequest({
                    method: "PUT", url: provider.apiAddTorrent, headers: { 'Authorization': `Bearer ${apiKey}` }, data: response.response,
                    onload: function(rdResp) {
                        try { const json = JSON.parse(rdResp.responseText); if (json.id) selectAllFiles(json.id, provider, $btn, originalContent); else { alert("RD Upload Failed: " + (json.error || "Unknown")); $btn.html('❌'); } } catch(e) { $btn.html('❌'); }
                    }
                });
            },
            onerror: (e) => { if(confirm("Network Error. Download .torrent file to PC?")) window.open(url, '_blank'); $btn.html('❌'); }
        });
    }

    function selectAllFiles(id, provider, $btn, originalContent) {
        GM_xmlhttpRequest({ method: "POST", url: provider.apiSelect, headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/x-www-form-urlencoded' }, data: `id=${id}&files=all`, onload: function(resp) { $btn.html('✔️'); window.open("https://real-debrid.com/torrents", "_blank"); setTimeout(() => $btn.html(originalContent), 3000); } });
    }

    function handleDirectUnlock(url, $btn) {
        if (!apiKey) { showApiKeyModal(providers[currentProvider].name, apiKey); return; }
        const provider = providers[currentProvider];
        const originalContent = $btn.html();
        $btn.html('⏳');

        if (provider.type === 'pm') {
            GM_xmlhttpRequest({ method: "POST", url: provider.apiUnrestrict, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, data: `apikey=${apiKey}&src=${encodeURIComponent(url)}`, onload: function(res) { try { const json = JSON.parse(res.responseText); if(json.status === 'success' && json.location) { window.location.href = json.location; $btn.html('<span style="color:#4CAF50;">✔️</span>'); } else { throw new Error(json.message); } } catch(e) { alert(e.message); $btn.html('❌'); } setTimeout(() => $btn.html(originalContent), 3000); } });
            return;
        }

        let reqUrl = (currentProvider === 'real-debrid') ? provider.apiUnrestrict : provider.buildUrl(apiKey, url);
        let method = (currentProvider === 'real-debrid') ? "POST" : "GET";
        let data = (currentProvider === 'real-debrid') ? `link=${encodeURIComponent(url)}` : null;
        let headers = (currentProvider === 'real-debrid') ? { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/x-www-form-urlencoded' } : {};

        GM_xmlhttpRequest({ method: method, url: reqUrl, headers: headers, data: data, onload: function(response) { if (currentProvider === 'real-debrid') { try { const json = JSON.parse(response.responseText); if (json.download) { window.location.href = json.download; $btn.html('<span style="color:#4CAF50;">✔️</span>'); } else { throw new Error(json.error); } } catch(e) { alert('Failed: ' + e.message); $btn.html('❌'); } } else { try { const json = JSON.parse(response.responseText); if (json.data && json.data.link) { window.location.href = json.data.link; $btn.html('<span style="color:#4CAF50;">✔️</span>'); } else { throw new Error("AD Error"); } } catch(e) { $btn.html('❌'); } } setTimeout(() => $btn.html(originalContent), 3000); }, onerror: () => { alert("Network Error"); $btn.html('❌'); } });
    }

    async function processExtToPage($btnUI) {
        if ($btnUI) $btnUI.html('⏳');
        let hash = findHashOnPage();
        if (!hash) { const viewHashBtn = document.getElementById('show-hash-btn'); if (viewHashBtn) { viewHashBtn.click(); for (let i = 0; i < 10; i++) { await new Promise(r => setTimeout(r, 500)); hash = findHashOnPage(); if (hash) break; } } }
        if (hash) { if ($btnUI) $btnUI.html('✔️'); sendToDebridMagnet(`magnet:?xt=urn:btih:${hash}`, $btnUI); } else { if ($btnUI) $btnUI.html('❌'); alert("Could not find hash."); }
    }

    function sendToDebridMagnet(magnetLink, $btnUI) {
        const provider = providers[currentProvider];
        if (provider.type === 'pm') {
             GM_xmlhttpRequest({ method: "POST", url: provider.apiAdd, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, data: `apikey=${apiKey}&src=${encodeURIComponent(magnetLink)}`, onload: function(res) { const json = JSON.parse(res.responseText); if(json.status === 'success') { $btnUI.html('✔️'); window.open("https://www.premiumize.me/transfers", "_blank"); } else { alert(json.message); $btnUI.html('❌'); } } });
             setTimeout(() => $btnUI.html(`<img src="${provider.icon}" width="18" height="18" style="object-fit:contain;">`), 3000);
             return;
        }
        if (currentProvider === 'real-debrid') {
            const targetUrl = `${provider.magnetUrl}#${encodeURIComponent(magnetLink)}`;
            if (isAutoMode) window.location.href = targetUrl;
            else { const win = window.open(targetUrl, '_blank'); if(!win) alert("Popup blocked!"); }
        } else { window.open(provider.magnetUrl, '_blank'); }
        if ($btnUI) setTimeout(() => $btnUI.html(`<img src="${provider.icon}" width="18" height="18" style="object-fit:contain;">`), 3000);
    }

    // --- UI: CENTERED PROVIDER MENU ---
    function showProviderMenu() {
        $('#debrid-provider-menu').remove();
        const $menu = $('<div id="debrid-provider-menu"></div>').css({
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: '#222', border: '1px solid #555', padding: '15px', borderRadius: '8px', zIndex: 999999,
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px',
            boxShadow: '0 0 20px rgba(0,0,0,0.9)', color: '#eee', fontFamily: 'Arial, sans-serif', fontSize: '14px',
            width: '90%', maxWidth: '600px'
        });
        Object.entries(providers).forEach(([key, provider]) => {
            const isSelected = (key === currentProvider);
            const $btn = $('<button></button>').css({
                background: isSelected ? '#4CAF50' : '#333', border: isSelected ? '2px solid #4CAF50' : '1px solid #555',
                cursor: 'pointer', padding: '10px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '10px',
                color: isSelected ? '#fff' : '#ccc', fontWeight: 'bold', flex: '1 1 140px', justifyContent: 'center'
            }).attr('title', provider.name);
            $btn.append($(`<img src="${provider.icon}" width="28" height="28" style="object-fit:contain;">`).css({ flexShrink: 0 }));
            $btn.append($('<span></span>').text(provider.name));
            $btn.on('click', () => {
                currentProvider = key;
                GM_setValue('currentProvider', currentProvider);
                apiKey = apiKeys[currentProvider] || '';
                $menu.remove();
                location.reload();
            });
            $menu.append($btn);
        });
        $('body').append($menu);
        setTimeout(() => { $(document).one('click.debridMenu', (e) => { if (!$(e.target).closest('#debrid-provider-menu').length) $menu.remove(); }); }, 100);
    }

    function showApiKeyModal(providerName, currentKey) {
        $('#debrid-apikey-modal-overlay').remove();
        const $overlay = $('<div id="debrid-apikey-modal-overlay"></div>').css({
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)',
            zIndex: 999998, display: 'flex', alignItems: 'center', justifyContent: 'center'
        });
        const $modal = $('<div id="debrid-apikey-modal"></div>').css({
            background: '#333', border: '1px solid #666', borderRadius: '8px', padding: '25px',
            boxShadow: '0 0 20px rgba(0,0,0,0.9)', color: '#eee', fontFamily: 'Arial', fontSize: '15px',
            textAlign: 'center', maxWidth: '400px', width: '90%'
        });
        $modal.html(`
            <h3 style="margin-top:0;color:#4CAF50;">${providerName} API Key</h3>
            <input type="text" id="debrid-api-key-input" value="${currentKey || ''}" placeholder="Enter API Key" style="width:100%;padding:10px;margin:15px 0;background:#444;border:1px solid #555;color:#eee;border-radius:4px;">
            <button id="debrid-api-key-save" style="background:#4CAF50;color:white;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;margin-right:10px;">Save</button>
            <button id="debrid-api-key-cancel" style="background:#777;color:white;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;">Cancel</button>
        `);
        $('body').append($overlay.append($modal));
        $('#debrid-api-key-input').focus();
        $('#debrid-api-key-save').on('click', () => {
            const newKey = $('#debrid-api-key-input').val().trim();
            apiKeys[currentProvider] = newKey;
            GM_setValue('debridApiKeys', apiKeys);
            apiKey = newKey;
            $overlay.remove();
        });
        $('#debrid-api-key-cancel').on('click', () => $overlay.remove());
    }

    // --- INIT ---
    $(document).ready(function() {
        scan();
        setInterval(scan, 1000);
        GM_addStyle(`
            /* UPDATED CSS: FLEX ALIGNMENT + ORIGINAL 18PX SIZE ENFORCEMENT */
            .debrid-btn {
                display: inline-flex !important;
                align-items: center !important;
                vertical-align: middle !important;
                margin-left: 6px !important;
                line-height: 1 !important;
            }
            .debrid-btn img {
                width: 18px !important;
                height: 18px !important;
                border-radius: 3px !important;
                display: block !important;
                object-fit: contain !important;
            }
            .debrid-processed { /* Marker */ }

            /* Download Bar styling */
            #debrid-download-bar { position: fixed; top: 0; left: 50%; transform: translateX(-50%); background: #282c34; color: white; padding: 8px 15px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); z-index: 100000; display: flex; align-items: center; gap: 10px; font-family: Arial, sans-serif; font-size: 14px; }
            #debrid-download-bar .debrid-bar-action-button { background: transparent; border: none; padding: 0; cursor: pointer; }
            #debrid-download-bar .debrid-bar-action-button img { width: 22px; height: 22px; object-fit: contain; border-radius: 3px; }
            #debrid-apikey-modal-overlay { z-index: 99999999; } #debrid-apikey-modal { z-index: 999999999; }
        `);
    });

})(jQuery);