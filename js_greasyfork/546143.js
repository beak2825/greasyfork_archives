// ==UserScript==
// @name         1337x Enhancements + IMDb Ratings
// @namespace    https://greasyfork.org/en/users/567951-stuart-saddler
// @version      2026.01.26
// @description  Enhances 1337x with IMDb ratings, thumbnail previews, comment popups, magnet links, and a customizable settings panel. Also shows IMDb rating beside the main title on torrent detail pages.
// @author       Stuart Saddler
// @contributor  darkred, NotNeo, barn852, French Bond, sharmanhall
// @match        *://*.1337x.to/*
// @match        *://*.1337x.ws/*
// @match        *://*.1337x.eu/*
// @match        *://*.1337x.se/*
// @match        *://*.1337x.is/*
// @match        *://*.1337x.gd/*
// @match        *://*.x1337x.cc/*
// @match        *://*.1337x.st/*
// @match        *://*.x1337x.ws/*
// @match        *://*.x1337x.eu/*
// @match        *://*.x1337x.se/*
// @match        *://*.1377x.to/*
// @match        *://*.1337xx.to/*
// @match        http://l337xdarkkaqfwzntnfk5bmoaroivtl6xsbatabvlb52umg6v3ch44yd.onion/*
// @match        https://www.1337x.to/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      imdb.com
// @connect      www.imdb.com
// @connect      m.imdb.com
// @connect      v2.sg.media-imdb.com
// @connect      omdbapi.com
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1337x.to
// @downloadURL https://update.greasyfork.org/scripts/546143/1337x%20Enhancements%20%2B%20IMDb%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/546143/1337x%20Enhancements%20%2B%20IMDb%20Ratings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- DEBUGGING ADDED ---
    const DEBUG = true;

    function log(msg) {
        if (!DEBUG) return;
        const args = Array.prototype.slice.call(arguments, 1);
        try {
            console.log.apply(console, ['[1337x DEBUG] ' + msg].concat(args));
        } catch (e) {}
    }
    // -----------------------

    let config = {
        showThumbnails: GM_getValue('showThumbnails', true),
        showExtraColumn: GM_getValue('showExtraColumn', true),
        showButtonsInNameColumn: GM_getValue('showButtonsInNameColumn', false),
        fullWidthSite: GM_getValue('fullWidthSite', true),
        visibleImages: GM_getValue('visibleImages', 4),
        queueFetchDelay: GM_getValue('queueFetchDelay', 0),
        maxRetries: GM_getValue('maxRetries', 1),
        enableCommentsPopup: GM_getValue('enableCommentsPopup', true),
        enableImdbRatings: GM_getValue('enableImdbRatings', true),
        omdbApiKey: GM_getValue('omdbApiKey', ''),
        imdbMaxReqPer5s: GM_getValue('imdbMaxReqPer5s', 10)
    };

    let extraColumnAdded = false;
    const commentCache = new Map();
    const torrentCache = new Map();
    const ratingByImdbId = new Map();
    const imdbIdByTorrentId = new Map();
    const ratingByTorrentId = new Map();
    const CACHE_DURATION = 5 * 60 * 1000;

    // ==================== CLOUDFLARE / RETRY HELPERS (PATCH) ====================

    function isCloudflareChallengeText(text) {
        if (!text) return false;
        return (
            text.indexOf('Just a moment') !== -1 ||
            text.indexOf('cf_chl') !== -1 ||
            text.indexOf('challenge-platform') !== -1 ||
            text.indexOf('/cdn-cgi/') !== -1 ||
            text.indexOf('cf-browser-verification') !== -1
        );
    }

    function computeBackoffDelayMs(retryIndex) {
        // Use queueFetchDelay as base; if 0, use a sensible minimum for CF challenges.
        const base = (typeof config.queueFetchDelay === 'number' && config.queueFetchDelay > 0)
            ? config.queueFetchDelay
            : 250;
        // Exponential backoff: base * 2^(retryIndex+1)
        return base * Math.pow(2, retryIndex + 1);
    }

    function sleep(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    }

    function fetchSameOriginText(url) {
        // Native fetch with same-origin cookies (including HttpOnly cf_clearance).
        return fetch(url, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        }).then(function(resp) {
            return resp.text().then(function(text) {
                return { ok: resp.ok, status: resp.status, text: text };
            });
        });
    }

    function fetchSameOriginJson(url) {
        // Native fetch for JSON endpoints on same origin.
        return fetch(url, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(function(resp) {
            return resp.text().then(function(text) {
                return { ok: resp.ok, status: resp.status, text: text };
            });
        });
    }

    async function fetchHtmlWithCfRetry(url, attemptIndex) {
        // attemptIndex is the current retry count (0..maxRetries)
        const r = await fetchSameOriginText(url);

        // If the site is returning HTML but it's a CF challenge page, treat as retryable.
        const cf = isCloudflareChallengeText(r.text);

        // Some CF blocks show up as 403/503.
        const retryableStatus = (r.status === 403 || r.status === 429 || r.status === 503);

        if (r.ok && !cf) return r.text;

        // If not ok OR CF challenge detected, retry if we can.
        if ((cf || retryableStatus || !r.ok) && attemptIndex < config.maxRetries) {
            const delay = computeBackoffDelayMs(attemptIndex);
            log('CF/Fetch issue for %s (status=%s cf=%s). Retrying in %sms...', url, r.status, cf, delay);
            await sleep(delay);
            return fetchHtmlWithCfRetry(url, attemptIndex + 1);
        }

        // Give up and return whatever we got (caller can decide fallback).
        return r.text || '';
    }

    async function fetchJsonWithCfRetry(url, attemptIndex) {
        const r = await fetchSameOriginJson(url);

        const cf = isCloudflareChallengeText(r.text);
        const retryableStatus = (r.status === 403 || r.status === 429 || r.status === 503);

        // If it looks like JSON and response is ok, proceed.
        if (r.ok && !cf) {
            return r.text;
        }

        if ((cf || retryableStatus || !r.ok) && attemptIndex < config.maxRetries) {
            const delay = computeBackoffDelayMs(attemptIndex);
            log('CF/Fetch issue (JSON) for %s (status=%s cf=%s). Retrying in %sms...', url, r.status, cf, delay);
            await sleep(delay);
            return fetchJsonWithCfRetry(url, attemptIndex + 1);
        }

        // Give up and return what we have.
        return r.text || '';
    }

    // ==================== IMDb RATE LIMIT ====================

    const reqTimes = [];
    async function imdbRateLimit() {
        const now = Date.now();
        while (reqTimes.length && now - reqTimes[0] > 5000) reqTimes.shift();
        if (reqTimes.length >= config.imdbMaxReqPer5s) {
            const wait = 5000 - (now - reqTimes[0]) + 25;
            await new Promise(function(r) { setTimeout(r, wait); });
        }
        reqTimes.push(Date.now());
    }

    GM_addStyle(`
    .list-button-magnet > i.flaticon-magnet { font-size:13px; color:#da3a04; }
    .list-button-dl > i.flaticon-torrent-download { font-size:13px; color:#89ad19; }
    table.table-list td.dl-buttons {
      border-left:1px solid #f6f6f6; border-right:1px solid #c0c0c0;
      padding-left:2.5px; padding-right:2.5px; text-align:center !important;
      position:relative; display:table-cell !important; width:6%;
    }
    table.table-list td.coll-1b { border-right:1px solid silver; }
    .table-list > thead > tr > th:nth-child(2),
    .table-list > thead > tr > td:nth-child(2) { text-align:center; }

    .imdb-dot {
      margin-left:6px; font-weight:600; color:#000 !important;
      display:inline-flex; align-items:center; gap:6px;
    }
    .imdb-dot .dot { width:10px; height:10px; border-radius:50%; display:inline-block; }

    ${config.fullWidthSite ? `.container{max-width:none !important} main.container,div.container{max-width:1450px}` : ''}

    #x1337-settings-wrapper{
      font-family:'Open Sans',sans-serif; background:#fff !important; color:#111 !important;
      border-radius:5px; box-shadow:0 0 10px rgba(0,0,0,.15);
      position:fixed; top:20px; right:-340px; width:340px; transition:right .3s ease; z-index:9999;
    }
    #x1337-settings-wrapper, #x1337-settings-wrapper * { color:#111 !important; }
    #x1337-settings-toggle{
      position:absolute; left:-32px; top:0; width:32px; height:32px;
      background:#F14E13 !important; color:#fff !important;
      border-top-left-radius:5px; border-bottom-left-radius:5px;
      box-shadow:-2px 0 5px rgba(0,0,0,.2); cursor:pointer; text-align:center; line-height:32px;
    }
    #x1337-settings-content{ padding:15px; }
    #x1337-settings-content h3{
      color:#e15920 !important; border-bottom:1px solid #e15920 !important;
      padding-bottom:10px; margin-bottom:15px;
    }
    .x1337-option{ margin-bottom:12px; }
    .x1337-option label{ display:flex; align-items:center; gap:8px; cursor:pointer; }
    #x1337-settings-wrapper input[type="number"],
    #x1337-settings-wrapper input[type="text"]{
      background:#fff !important; color:#111 !important;
      border:1px solid #bbb !important; padding:5px; border-radius:3px;
    }
    #x1337-settings-wrapper input::placeholder{ color:#777 !important; }
    #x1337-settings-wrapper input[type="checkbox"]{ accent-color:#e15920; }
    #x1337-save-settings{
      background:#F14E13 !important; color:#fff !important; border:none;
      padding:10px 20px; border-radius:3px; cursor:pointer;
      box-shadow:0 0 10px rgba(241,78,19,.35);
    }
    #x1337-save-settings:hover{ background:#ff6a3c !important; }

    #x1337-popup{
      position:fixed; top:20px; left:50%; transform:translateX(-50%);
      background:#F14E13; color:#fff; padding:10px 20px; border-radius:5px;
      z-index:10000; opacity:0; transition:opacity .3s;
    }

    .comments-popup-enabled span.comments{ cursor:pointer; }

    #comments-modal-overlay{ position:fixed; inset:0; background:rgba(0,0,0,.7); z-index:10001;
      display:flex; align-items:center; justify-content:center; }
    #comments-modal-container{
      background:#232323; color:#eee; border-radius:8px; box-shadow:0 2px 24px #000b;
      max-width:700px; width:90%; max-height:75vh; overflow-y:auto; padding:0 0 1em;
      border:1px solid #666; position:relative;
    }
    #comments-modal-close{ position:absolute; top:12px; right:30px; font-size:32px; font-weight:700;
      cursor:pointer; color:#aaa; }
    #comments-modal-close:hover{ color:#fff !important; }
    #comments-modal-container h2{
      font-size:1.2em; color:#e15920; margin:1.1em 1.1em .3em; padding-bottom:.3em; border-bottom:1px solid #333;
    }
    #comments-modal-content{ margin:0 1.1em .5em; }
    #comments-modal-content .comment-detail{
      background:#282828; margin:1em 0; border-radius:6px; padding:1em 1em .5em; border:1px solid #30303b;
    }

    #x1337-enlarged-wrap{
      position:fixed; z-index:10000; border:2px solid #F14E13;
      box-shadow:0 0 10px rgba(0,0,0,.5); background:transparent; pointer-events:none;
      display:inline-block; line-height:0;
    }
    #x1337-enlarged-wrap img{
      display:block; max-width:500px; max-height:500px; margin:0;
    }
  `);

    function showPopup(message, duration) {
        if (typeof duration !== 'number') duration = 2000;
        let el = document.createElement('div');
        el.id = 'x1337-popup';
        el.textContent = message;
        document.body.appendChild(el);
        requestAnimationFrame(function() { el.style.opacity = '1'; });
        setTimeout(function() {
            el.style.opacity = '0';
            setTimeout(function() { el.remove(); }, 320);
        }, duration);
    }

    function cleanTitle(title) {
        if (title && title.indexOf('Download ') === 0) title = title.substring(9);
        const i = title ? title.indexOf(' Torrent |') : -1;
        if (i !== -1) title = title.substring(0, i);
        return title;
    }

    const settingsHTML = `
    <div id="x1337-settings-wrapper">
      <div id="x1337-settings-toggle">⚙️</div>
      <div id="x1337-settings-content">
        <h3>1337x Enhancements</h3>
        <div class="x1337-option">
          <label><input type="checkbox" id="x1337-show-thumbnails" ${config.showThumbnails?'checked':''}> Show Thumbnails</label>
          <div class="x1337-sub-option" ${config.showThumbnails?'':'style="display:none"'} style="margin-left:22px;margin-top:6px">
            <label>Visible Images: <input type="number" id="x1337-visible-images" value="${config.visibleImages}" min="1" max="10"></label>
            <label>Queue Fetch Delay (ms): <input type="number" id="x1337-queue-fetch-delay" value="${config.queueFetchDelay}" min="0" max="5000"></label>
            <label>Max Fetch Retries: <input type="number" id="x1337-max-retries" value="${config.maxRetries}" min="0" max="10"></label>
          </div>
        </div>
        <div class="x1337-option"><label><input type="checkbox" id="x1337-show-magnet-column" ${config.showExtraColumn?'checked':''}> Show Magnet URL Column</label></div>
        <div class="x1337-option"><label><input type="checkbox" id="x1337-show-buttons-in-name" ${config.showButtonsInNameColumn?'checked':''}> Show Buttons in Name Column</label></div>
        <div class="x1337-option"><label><input type="checkbox" id="x1337-full-width-site" ${config.fullWidthSite?'checked':''}> Full Width Site</label></div>
        <div class="x1337-option"><label><input type="checkbox" id="x1337-enable-comments-popup" ${config.enableCommentsPopup?'checked':''}> Enable Comments Popup</label></div>
        <hr style="border-color:#F14E13;border-width:1px 0 0;margin:10px 0">
        <h3>IMDb Ratings</h3>
        <div class="x1337-option"><label><input type="checkbox" id="x1337-enable-imdb" ${config.enableImdbRatings?'checked':''}> Show IMDb Ratings</label></div>
        <div class="x1337-option">
          <label>OMDb API Key (optional):
            <input type="text" id="x1337-omdb-key" value="${config.omdbApiKey}" placeholder="Leave blank to use IMDb scrape fallback">
          </label>
        </div>
        <div class="x1337-option">
          <label>Max IMDb Requests / 5s:
            <input type="number" id="x1337-imdb-rl" value="${config.imdbMaxReqPer5s}" min="3" max="25">
          </label>
        </div>
        <button id="x1337-save-settings">Save Settings</button><br>
      </div>
    </div>
  `;

    function addSettingsMenu() {
        document.body.insertAdjacentHTML('beforeend', settingsHTML);
        document.getElementById('x1337-settings-toggle').addEventListener('click', function() {
            const wrap = document.getElementById('x1337-settings-wrapper');
            wrap.style.right = wrap.style.right === '0px' ? '-340px' : '0px';
        });
        document.getElementById('x1337-show-thumbnails').addEventListener('change', function() {
            const sub = document.querySelector('.x1337-sub-option');
            if (sub) sub.style.display = this.checked ? 'block' : 'none';
        });
        document.getElementById('x1337-save-settings').addEventListener('click', function() {
            config.showThumbnails = document.getElementById('x1337-show-thumbnails').checked;
            config.showExtraColumn = document.getElementById('x1337-show-magnet-column').checked;
            config.showButtonsInNameColumn = document.getElementById('x1337-show-buttons-in-name').checked;
            config.fullWidthSite = document.getElementById('x1337-full-width-site').checked;
            config.visibleImages = parseInt(document.getElementById('x1337-visible-images').value || '4', 10);
            config.queueFetchDelay = parseInt(document.getElementById('x1337-queue-fetch-delay').value || '0', 10);
            config.maxRetries = parseInt(document.getElementById('x1337-max-retries').value || '1', 10);
            config.enableCommentsPopup = document.getElementById('x1337-enable-comments-popup').checked;
            config.enableImdbRatings = document.getElementById('x1337-enable-imdb').checked;
            config.omdbApiKey = (document.getElementById('x1337-omdb-key').value || '').trim();
            config.imdbMaxReqPer5s = parseInt(document.getElementById('x1337-imdb-rl').value || '10', 10);

            GM_setValue('showThumbnails', config.showThumbnails);
            GM_setValue('showExtraColumn', config.showExtraColumn);
            GM_setValue('showButtonsInNameColumn', config.showButtonsInNameColumn);
            GM_setValue('fullWidthSite', config.fullWidthSite);
            GM_setValue('visibleImages', config.visibleImages);
            GM_setValue('queueFetchDelay', config.queueFetchDelay);
            GM_setValue('maxRetries', config.maxRetries);
            GM_setValue('enableCommentsPopup', config.enableCommentsPopup);
            GM_setValue('enableImdbRatings', config.enableImdbRatings);
            GM_setValue('omdbApiKey', config.omdbApiKey);
            GM_setValue('imdbMaxReqPer5s', config.imdbMaxReqPer5s);

            applySettings();
            showPopup('Settings saved');
        });
    }

    function getCachedComments(tid) {
        const c = commentCache.get(tid);
        return c && (Date.now() - c.ts < CACHE_DURATION) ? c.data : null;
    }

    function cacheComments(tid, data) {
        commentCache.set(tid, {
            ts: Date.now(),
            data: data
        });
    }

    function showCommentsPopup(commentsHTML, torrentTitle) {
        const old = document.getElementById('comments-modal-overlay');
        if (old) old.remove();
        const overlay = document.createElement('div');
        overlay.id = 'comments-modal-overlay';
        const container = document.createElement('div');
        container.id = 'comments-modal-container';
        const close = document.createElement('span');
        close.id = 'comments-modal-close';
        close.innerHTML = '&times;';
        const title = document.createElement('h2');
        title.textContent = 'Comments for: ' + torrentTitle;
        const content = document.createElement('div');
        content.id = 'comments-modal-content';
        content.innerHTML = commentsHTML || '<i>No user comments found.</i>';
        container.append(close, title, content);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        close.onclick = function() { overlay.remove(); };
        overlay.onclick = function(e) {
            if (e.target === overlay) overlay.remove();
        };
        document.addEventListener('keydown', function esc(e) {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', esc);
            }
        });
    }

    function displayComments(arr, fallbackTitle) {
        if (!Array.isArray(arr) || arr.length === 0) return showCommentsPopup('<i>No user comments found.</i>', fallbackTitle);
        const html = arr.map(function(c) {
            const safeComment = String(c.comment || '').replace(/\n/g, '<br>');
            return (
                '<div class="comment-detail">' +
                '  <div class="comment-info clearfix"><strong>' + c.username + '</strong> · <span>' + c.posted + '</span></div>' +
                '  <div class="comment-content">' + safeComment + '</div>' +
                '</div>'
            );
        }).join('');
        showCommentsPopup(html, fallbackTitle);
    }

    // Helper function to extract ID
    function getTorrentIdFromHref(url) {
        const match = String(url).match(/\/torrent\/(\d+)\//);
        return match ? match[1] : null;
    }

    // ==================== COMMENTS POPUP (PATCH: native fetch + CF retry/backoff) ====================

    async function fetchAndPopupComments(torrentUrl, fallbackTitle) {
        const tid = getTorrentIdFromHref(torrentUrl);
        if (!tid) return showPopup('Could not extract torrent ID.', 1500);

        // 1) Cache
        const cached = getCachedComments(tid);
        if (cached) return displayComments(cached, fallbackTitle);

        showPopup('Fetching comments...', 1000);

        // 2) Fetch JSON via native fetch (same-origin cookies) with CF detection + exponential backoff
        const apiUrl = location.protocol + '//' + location.host + '/comments.php?torrentid=' + tid;

        let txt = '';
        try {
            txt = await fetchJsonWithCfRetry(apiUrl, 0);
        } catch (e) {
            txt = '';
        }

        // 3) If CF still blocked it, offer fallback to open the comments in a new tab
        if (!txt || isCloudflareChallengeText(txt)) {
            const ok = confirm('Cloudflare blocked the request.\n\nOpen comments in a new tab instead?');
            if (ok) window.open(torrentUrl + '#comments', '_blank');
            return;
        }

        // 4) Parse/display
        try {
            const data = JSON.parse(txt);
            cacheComments(tid, data);
            displayComments(data, fallbackTitle);
        } catch (e) {
            log('Comments JSON parse error:', e);
            showPopup('Failed to parse comments.', 2000);
        }
    }

    function initCommentPopups() {
        document.querySelectorAll('.table-list-wrap span.comments').forEach(function(icon) {
            if (icon.dataset.listenerAttached) return;
            icon.dataset.listenerAttached = 'true';
            if ((parseInt(icon.textContent.trim(), 10) || 0) > 0) {
                icon.style.cursor = 'pointer';
                icon.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!config.enableCommentsPopup) return;
                    const row = icon.closest('tr');
                    if (!row) return;
                    const link = row.querySelector('a[href^="/torrent/"]');
                    if (!link) return showPopup('No torrent link found.');
                    const url = link.href.indexOf('http') === 0 ? link.href : (location.origin + link.getAttribute('href'));
                    const title = (link.textContent || '').trim() || document.title;
                    fetchAndPopupComments(url, title);
                }, false);
            }
        });
        document.body.classList.toggle('comments-popup-enabled', config.enableCommentsPopup);
    }

    function appendColumn() {
        if (!config.showExtraColumn || extraColumnAdded) return;
        const tables = document.querySelectorAll('.table-list-wrap');
        const isSeries = window.location.href.indexOf('/series/') !== -1;
        const title = 'ml&nbsp;dl';
        tables.forEach(function(wrap) {
            const cells = wrap.querySelectorAll(
                '.table-list > thead > tr:not(.blank) > th:nth-child(1), ' +
                '.table-list > tbody > tr:not(.blank) > td:nth-child(1)'
            );
            cells.forEach(function(cell, idx) {
                if (idx === 0 && !isSeries) {
                    cell.insertAdjacentHTML('afterend', '<th class="coll-1b">' + title + '</th>');
                } else {
                    const titleLink = cell.querySelectorAll('a')[1];
                    const href = titleLink ? titleLink.href : '';
                    cell.insertAdjacentHTML('afterend',
                        '<td class="coll-1b dl-buttons">' +
                        '  <a class="list-button-magnet" href="javascript:void(0)" data-href="' + href + '" title="Magnet link"><i class="flaticon-magnet"></i></a>' +
                        '  <a class="list-button-dl" href="javascript:void(0)" data-href="' + href + '" title="Torrent download"><i class="flaticon-torrent-download"></i></a>' +
                        '</td>'
                    );
                }
            });
            extraColumnAdded = true;
        });
        addClickListeners(document.querySelectorAll('.list-button-magnet'), 'ml');
        addClickListeners(document.querySelectorAll('.list-button-dl'), 'dl');
    }

    // ==================== MAGNET/DL ICON CLICK (PATCH: CF detect + backoff + ok handling) ====================

    function addClickListeners(links, type) {
        links.forEach(function(a) {
            a.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // If we already have a real URL, just let the browser handle it
                if (href !== 'javascript:void(0)') return;

                e.preventDefault();

                const tLink = this.getAttribute('data-href');
                if (!tLink) {
                    showPopup('No torrent URL found');
                    return;
                }

                // Avoid multiple requests for the same link
                if (this.dataset.loading === '1') return;
                this.dataset.loading = '1';
                showPopup('Loading torrent info...');

                const self = this;

                (async function() {
                    let html = '';
                    try {
                        html = await fetchHtmlWithCfRetry(tLink, 0);
                    } catch (e2) {
                        html = '';
                    }

                    // If CF is still interfering, fall back to opening the detail page
                    if (!html || isCloudflareChallengeText(html)) {
                        self.dataset.loading = '0';
                        window.location.href = tLink;
                        return;
                    }

                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    const magnet = doc.querySelector('a[href^="magnet:"]');
                    const torrent = doc.querySelector('.dropdown-menu > li > a');
                    const picked = (type === 'ml') ? magnet : torrent;

                    if (!picked) {
                        self.dataset.loading = '0';
                        window.location.href = tLink;
                        return;
                    }

                    const finalHref = picked.href.replace('http:', 'https:');
                    self.setAttribute('href', finalHref);
                    self.dataset.loading = '0';
                    window.location.href = finalHref;
                })().catch(function(err) {
                    self.dataset.loading = '0';
                    log('Icon click fetch error:', err);
                    showPopup('Error loading torrent page');
                });

            }, false);
        });
    }

    function optimizeImageUrl(src) {
        const rules = [
            { from: 'https://imgtraffic.com/1s/', to: 'https://imgtraffic.com/1/' },
            { from: /https?:\/\/.*\/images\/.*\.th\.jpg$/, to: function(u) { return u.replace(/\.th\.jpg$/, '.jpg'); } },
            { from: 'https://22pixx.xyz/as/', to: 'https://22pixx.xyz/a/' },
            { from: 'http://imgblaze.net/data_server_', to: 'https://www.imgopaleno.site/data_server_' },
            { from: '/small/small_', to: '/big/' }
        ];
        return rules.reduce(function(u, r) {
            if (typeof r.from === 'string') return u.replace(r.from, r.to);
            return (r.from.test(u) ? u.replace(r.from, r.to) : u);
        }, src);
    }

    function appendImages(link, doc) {
        if (!config.showThumbnails) return;
        if (link.parentNode.querySelector('.thumbnail-container')) return;

        // DEBUG: Log if description is missing
        const desc = doc.querySelector('#description');
        if (!desc) log('FAIL: #description ID not found on page:', link.href);

        const imgs = doc.querySelectorAll('#description img');
        log('Found %s images for %s', imgs.length, link.href);

        if (!imgs.length) return;

        const flex = document.createElement('div');
        flex.className = 'thumbnail-container';
        flex.style.display = 'flex';
        flex.style.flexWrap = 'wrap';
        flex.style.gap = '10px';
        flex.style.marginTop = '10px';

        const clones = [];
        imgs.forEach(function(img, i) {
            const c = img.cloneNode(true);
            let src = img.getAttribute('data-original') || img.src;
            c.src = optimizeImageUrl(src);
            c.loading = 'lazy';
            c.style.maxHeight = '100px';
            c.style.margin = '0';
            c.style.display = i < config.visibleImages ? 'block' : 'none';
            flex.appendChild(c);
            clones.push(c);

            c.addEventListener('mouseover', function(e) { showEnlargedImg(c.src, e); });
            c.addEventListener('mousemove', updateEnlargedImgPosition);
            c.addEventListener('mouseout', removeEnlargedImg);
        });

        if (imgs.length > config.visibleImages) {
            const btn = document.createElement('button');
            btn.textContent = 'Show More';
            btn.onclick = function() {
                const more = btn.textContent !== 'Show More';
                clones.forEach(function(img, i) {
                    if (i >= config.visibleImages) img.style.display = more ? 'none' : 'block';
                });
                btn.textContent = more ? 'Show More' : 'Show Less';
            };
            flex.appendChild(btn);
        }

        link.parentNode.insertBefore(flex, link.nextSibling);
    }

    function showEnlargedImg(imgSrc, event) {
        removeEnlargedImg();
        const wrap = document.createElement('div');
        wrap.id = 'x1337-enlarged-wrap';
        const img = new Image();
        img.id = 'x1337-enlarged-img';
        img.onload = function() {
            wrap.appendChild(img);
            document.body.appendChild(wrap);
            requestAnimationFrame(function() { updateEnlargedImgPosition(event); });
        };
        img.src = imgSrc;
    }

    function updateEnlargedImgPosition(e) {
        const wrap = document.getElementById('x1337-enlarged-wrap');
        if (!wrap) return;
        const rect = wrap.getBoundingClientRect();
        const iw = Math.ceil(rect.width);
        const ih = Math.ceil(rect.height);
        let left = e.clientX + 20;
        let top = e.clientY + 20;
        if (left + iw > window.innerWidth) left = e.clientX - iw - 20;
        if (top + ih > window.innerHeight) top = e.clientY - ih - 20;
        wrap.style.left = left + 'px';
        wrap.style.top = top + 'px';
    }

    function removeEnlargedImg() {
        const wrap = document.getElementById('x1337-enlarged-wrap');
        if (wrap) wrap.remove();
    }

    // ==================== FETCH QUEUE (PATCH: CF detect + exponential backoff + credentials) ====================

    const fetchQueue = [];
    let activeFetches = 0;
    const MAX_CONCURRENT = 3;

    function getCachedTorrent(url) {
        const c = torrentCache.get(url);
        return c && (Date.now() - c.ts < CACHE_DURATION) ? c.doc : null;
    }

    function cacheTorrent(url, doc) {
        torrentCache.set(url, {
            ts: Date.now(),
            doc: doc
        });
    }

    function queueFetchRequest(link, onSuccess) {
        fetchQueue.push({
            link: link,
            onSuccess: onSuccess,
            retries: 0
        });
        processQueue();
    }

    function processQueue() {
        while (activeFetches < MAX_CONCURRENT && fetchQueue.length) {
            const item = fetchQueue.shift();
            activeFetches++;
            fetchContent(item.link, item.onSuccess, item.retries);
        }
    }

    function fetchContent(link, onSuccess, retries) {
        if (typeof retries !== 'number') retries = 0;
        log('Fetching (Native+CF): %s (try %s/%s)', link, retries + 1, config.maxRetries + 1);

        (async function() {
            // Use CF-aware retry fetch
            const html = await fetchHtmlWithCfRetry(link, retries);

            // If still CF/challenge and we have retries left, schedule with backoff
            if (isCloudflareChallengeText(html) && retries < config.maxRetries) {
                const delay = computeBackoffDelayMs(retries);
                log('Queue got CF challenge for %s. Requeue after %sms', link, delay);
                setTimeout(function() {
                    fetchQueue.push({ link: link, onSuccess: onSuccess, retries: retries + 1 });
                    processQueue();
                }, delay);
                return;
            }

            if (!html) {
                if (retries < config.maxRetries) {
                    const delay2 = computeBackoffDelayMs(retries);
                    log('Empty HTML for %s. Requeue after %sms', link, delay2);
                    setTimeout(function() {
                        fetchQueue.push({ link: link, onSuccess: onSuccess, retries: retries + 1 });
                        processQueue();
                    }, delay2);
                }
                return;
            }

            const doc = new DOMParser().parseFromString(html, 'text/html');
            cacheTorrent(link, doc);
            onSuccess(doc);

        })().catch(function(err) {
            log('Queue fetch error for %s: %s', link, err && err.message ? err.message : err);

            if (retries < config.maxRetries) {
                const delay = computeBackoffDelayMs(retries);
                log('Retrying %s after %sms', link, delay);
                setTimeout(function() {
                    fetchQueue.push({ link: link, onSuccess: onSuccess, retries: retries + 1 });
                    processQueue();
                }, delay);
            }

        }).finally(function() {
            activeFetches--;
            setTimeout(processQueue, config.queueFetchDelay);
        });
    }

    const TV_TAG = /\bS\d{1,2}E\d{1,2}(?:[-E]\d{1,2})?\b/i;
    const TV_SEASON_PACK = /\bS\d{1,2}\b(?!E\d)/i;
    const TV_DATE = /\b(19|20)\d{2}[ ._-](0[1-9]|1[0-2])[ ._-](0[1-9]|[12]\d|3[01])\b/;
    const VIDEO_MARK = /\b(?:2160|1080|720|480)p\b|\.mkv\b|\.mp4\b/i;
    const RELEASE_MARK = /\b(?:WEB(?:-?DL|-?Rip)?|Blu(?:-?Ray)?|HDTV|DVDRip|BRRip|BDRip|REMUX|WEB[-.\s]?HD|WEBDL|WEBRip|iT|AMZN|NF|MAX|ATV|MA|IMAX|HDR10\+?|DV)\b|\b(?:x264|x265|H\.?26[45]|HEVC|AV1)\b|\b(?:DDP? ?(?:5\.1|7\.1)|AC-?3|AAC|Opus|TrueHD|DTS(?:-HD)?(?: ?MA)?|Atmos)\b/i;
    const NEGATIVE = /\b(FLAC|MP3|APE|OGG|WAV|Vinyl|Album|Soundtrack|Deluxe\sEdition|24-96|24bit|16Bit|44\.1kHz|320kbps|EPUB|MOBI|PDF|CBR|CBZ|Magazine|Cookbook|Guide|Manual|Workbook|WSJ|Wall\sStreet\sJournal|Week\+|Comics?|APK|Android|x64|x86|Portable|Pre-Activated|Keygen|Crack(?:ed)?|Patch|Setup|Installer|Plug-?in|VST|Adobe|Topaz|MAGIX|VEGAS|Office|Windows|Premiere|After\sEffects|FitGirl|DLCs?|MULTi\d{1,2}|GOG|Steam|Codex|ElAmigos|Razor1911|Reloaded|Campaign|Zombies|Multiplayer)\b/i;
    const LANG_NOISE = /\b(ita|eng|en|es|spa|lat|por|pt|de|ger|deu|fr|fre|french|rus|jpn|kor|korean|hin|hindi|tam|tamil|tel|telugu|kan|kanada|multi|dual|dubbed|sub(?:s|bed)?|esub(?:s)?|nl|pl|tr|ar|he)\b/ig;

    function isMovieOrTV(title) {
        if (NEGATIVE.test(title)) return false;
        if (TV_TAG.test(title) || TV_SEASON_PACK.test(title) || TV_DATE.test(title)) return true;
        return VIDEO_MARK.test(title) && RELEASE_MARK.test(title);
    }

    const slugify = function(s) {
        return String(s || '').toLowerCase()
            .replace(/[\.\-_]+/g, ' ')
            .replace(/[^a-z0-9 ]/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
    };

    function baseTitleForSuggest(original) {
        let s = String(original).replace(/[\[\(\{][^\]\)\}]*[\]\)\}]/g, ' ');
        const spots = [];
        [TV_TAG, TV_SEASON_PACK, TV_DATE, VIDEO_MARK, RELEASE_MARK].forEach(function(re) {
            const i = s.search(re);
            if (i >= 0) spots.push(i);
        });
        if (spots.length) s = s.slice(0, Math.min.apply(Math, spots));
        s = s.replace(LANG_NOISE, ' ').replace(/[.\-_]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
        const noisy = /\b(1080p|720p|2160p|480p|web|webrip|webdl|bluray|hdtv|remux|x26[45]|h\.?26[45]|hevc|av1|ddp?|aac|ac3|opus|truehd|dts|atmos|hdr|imax|dv)\b/i;
        const toks = s.split(' ');
        const clean = [];
        for (let i = 0; i < toks.length; i++) {
            const t = toks[i];
            if (noisy.test(t)) break;
            clean.push(t);
        }
        s = slugify(clean.length ? clean.join(' ') : s);
        if (!s) {
            const m = String(original).match(/^[A-Za-z][A-Za-z ._-]{2,}/);
            s = slugify(m ? m[0] : original);
        }
        return s;
    }

    const extractYear = function(t) {
        const m = String(t).match(/\b(19|20)\d{2}\b/);
        return m ? m[0] : '';
    };

    function gmFetch(url, headers) {
        return new Promise(function(resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: headers || { 'Accept': 'text/html,application/json;q=0.9' },
                timeout: 15000,
                onload: function(r) {
                    if (r.status >= 200 && r.status < 300) resolve(r.responseText);
                    else reject(new Error('HTTP ' + r.status + ' @ ' + url));
                },
                onerror: function() { reject(new Error('GM_xmlhttpRequest failed @ ' + url)); },
                ontimeout: function() { reject(new Error('GM_xmlhttpRequest timeout @ ' + url)); }
            });
        });
    }

    async function omdbById(imdbID) {
        if (!config.omdbApiKey) throw new Error('OMDb key missing');
        await imdbRateLimit();
        const res = await fetch('https://www.omdbapi.com/?i=' + encodeURIComponent(imdbID) + '&apikey=' + encodeURIComponent(config.omdbApiKey));
        return await res.json();
    }

    function fromJsonLd(html) {
        const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
        let m;
        while ((m = re.exec(html)) !== null) {
            try {
                const obj = JSON.parse(m[1].trim());
                const arr = Array.isArray(obj) ? obj : [obj];
                for (let i = 0; i < arr.length; i++) {
                    const o = arr[i];
                    const ag = o && o.aggregateRating;
                    const val = ag && (ag.ratingValue || ag.rating);
                    if (val && !isNaN(parseFloat(val))) return parseFloat(val);
                }
            } catch (e) {}
        }
        const m2 = /"aggregateRating"\s*:\s*\{[^}]*?"ratingValue"\s*:\s*"?([\d.]+)"?/i.exec(html);
        if (m2) {
            const v = parseFloat(m2[1]);
            if (!isNaN(v)) return v;
        }
        return null;
    }

    function fromReference(html) {
        let m = /ratingValue["'>:\s][^0-9]*([\d.]{1,3})/i.exec(html);
        if (m) {
            const v = parseFloat(m[1]);
            if (!isNaN(v)) return v;
        }
        m = /AggregateRatingButton__RatingScore[^>]*>([\d.]{1,3})</i.exec(html);
        if (m) {
            const v2 = parseFloat(m[1]);
            if (!isNaN(v2)) return v2;
        }
        return null;
    }

    function fromRatings(html) {
        let m = /"ratingValue"\s*:\s*"?([\d.]+)"?/i.exec(html);
        if (m) {
            const v = parseFloat(m[1]);
            if (!isNaN(v)) return v;
        }
        m = /aggregate-rating__score[^>]*>\s*<span[^>]*>([\d.]+)<\/span>/i.exec(html);
        if (m) {
            const v2 = parseFloat(m[1]);
            if (!isNaN(v2)) return v2;
        }
        return null;
    }

    async function imdbScrapeRating(imdbID) {
        try {
            const h1 = await gmFetch('https://m.imdb.com/title/' + imdbID + '/');
            const v1 = fromJsonLd(h1) || fromReference(h1) || fromRatings(h1);
            if (v1 && !isNaN(v1)) return v1;
        } catch (e) {}
        try {
            const hr = await gmFetch('https://www.imdb.com/title/' + imdbID + '/reference');
            const v2 = fromJsonLd(hr) || fromReference(hr) || fromRatings(hr);
            if (v2 && !isNaN(v2)) return v2;
        } catch (e2) {}
        try {
            const h2 = await gmFetch('https://www.imdb.com/title/' + imdbID + '/ratings');
            const v3 = fromJsonLd(h2) || fromRatings(h2) || fromReference(h2);
            if (v3 && !isNaN(v3)) return v3;
        } catch (e3) {}
        try {
            const h3 = await gmFetch('https://www.imdb.com/title/' + imdbID + '/');
            const v4 = fromJsonLd(h3) || fromReference(h3) || fromRatings(h3);
            if (v4 && !isNaN(v4)) return v4;
        } catch (e4) {}
        return null;
    }

    async function imdbSuggest(rawTitle, year) {
        const base = baseTitleForSuggest(rawTitle);
        if (!base) return null;
        const first = base[0] || 'a';
        const url = 'https://v2.sg.media-imdb.com/suggestion/' + encodeURIComponent(first) + '/' + encodeURIComponent(base) + '.json';
        const text = await gmFetch(url, { 'Accept': 'application/json' });
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return null;
        }
        if (!data || !Array.isArray(data.d) || !data.d.length) return null;

        const wantYear = parseInt(year, 10);
        const clean = base;
        let best = null;
        let score = -1;

        for (let i = 0; i < data.d.length; i++) {
            const it = data.d[i];
            if (!it || !it.id || !/^tt\d+/.test(it.id)) continue;
            const t = slugify(it.l || '');
            const y = parseInt(it.y, 10);
            let sc = 0;
            if (t === clean) sc += 5;
            else if (t.indexOf(clean) !== -1 || clean.indexOf(t) !== -1) sc += 3;

            if (!isNaN(wantYear) && !isNaN(y)) {
                const dy = Math.abs(wantYear - y);
                if (dy === 0) sc += 3;
                else if (dy === 1) sc += 2;
                else if (dy <= 2) sc += 1;
            }

            const tvish = (TV_TAG.test(rawTitle) || TV_SEASON_PACK.test(rawTitle) || TV_DATE.test(rawTitle));
            if (tvish) {
                if (it.q === 'tvSeries' || it.q === 'tvMiniSeries') sc += 2;
            } else {
                if (it.q === 'feature') sc += 2;
            }

            if (sc > score) {
                score = sc;
                best = it;
            }
        }
        return best ? best.id : null;
    }

    function extractImdbIdFromDoc(doc) {
        const m = String(doc.documentElement.innerHTML).match(/imdb\.com\/title\/(tt\d{7,9})/i);
        return m ? m[1] : null;
    }

    function renderImdb(el, rating) {
        if (el.parentNode.querySelector('.imdb-dot')) return;
        const n = parseFloat(rating);
        let color = '#888';
        if (n > 7) color = '#23b14d';
        else if (n >= 6) color = '#d4aa00';
        else if (n > 0) color = '#d14545';
        const span = document.createElement('span');
        span.className = 'imdb-dot';
        span.title = 'IMDb: ' + rating;
        span.innerHTML = '<span class="dot" style="background:' + color + '"></span><span>' + rating + '</span>';
        el.parentNode.insertBefore(span, el.nextSibling);
    }

    // (Keep this; used widely)
    function getTorrentIdFromHref2(href) {
        const m = String(href).match(/\/torrent\/(\d+)\//);
        return m ? m[1] : null;
    }

    async function getImdbRatingForRow(title, torrentHref, doc) {
        if (!isMovieOrTV(title)) return null;
        const tid = getTorrentIdFromHref2(torrentHref) || '';
        if (tid && ratingByTorrentId.has(tid)) return ratingByTorrentId.get(tid);

        let imdbID = tid && imdbIdByTorrentId.get(tid);
        if (!imdbID) {
            let pageId = doc ? extractImdbIdFromDoc(doc) : null;
            if (!pageId) {
                const url = torrentHref.indexOf('http') === 0 ? torrentHref : (location.origin + torrentHref);
                const cached = getCachedTorrent(url);
                if (cached) pageId = extractImdbIdFromDoc(cached);
                else {
                    try {
                        const html = await gmFetch(url);
                        const mm = html.match(/imdb\.com\/title\/(tt\d{7,9})/i);
                        pageId = (mm && mm[1]) ? mm[1] : null;
                    } catch (e) {}
                }
            }
            imdbID = pageId || await imdbSuggest(title, extractYear(title));
            if (tid && imdbID) imdbIdByTorrentId.set(tid, imdbID);
        }

        if (!imdbID) return null;

        if (ratingByImdbId.has(imdbID)) {
            const rr = ratingByImdbId.get(imdbID);
            if (tid) ratingByTorrentId.set(tid, rr);
            return rr;
        }

        try {
            if (config.omdbApiKey) {
                const omdb = await omdbById(imdbID);
                const imdbRatingStr = omdb && omdb.imdbRating ? omdb.imdbRating : '';
                const n = parseFloat(imdbRatingStr);
                if (!isNaN(n)) {
                    const rr2 = n.toFixed(1) + '/10';
                    ratingByImdbId.set(imdbID, rr2);
                    if (tid) ratingByTorrentId.set(tid, rr2);
                    return rr2;
                }
            }
        } catch (e) {}

        try {
            await imdbRateLimit();
            const v = await imdbScrapeRating(imdbID);
            if (v && !isNaN(v)) {
                const rr3 = v.toFixed(1) + '/10';
                ratingByImdbId.set(imdbID, rr3);
                if (tid) ratingByTorrentId.set(tid, rr3);
                return rr3;
            }
        } catch (e2) {}

        return null;
    }

    function updateLinkTitle(link, doc) {
        const titleEl = doc.querySelector('title');
        const raw = titleEl ? titleEl.innerText : '';
        const t = cleanTitle(raw || '');
        if (t) link.innerText = t;
    }

    function processLink(link) {
        const row = link.closest('tr');
        if (row.dataset.processed === 'true') return;

        const torrentUrl = link.href;
        const cachedDoc = getCachedTorrent(torrentUrl);

        const handleDoc = async function(doc) {
            updateLinkTitle(link, doc);
            if (config.showThumbnails) appendImages(link, doc);
            if (config.showButtonsInNameColumn) {
                const tLink = doc.querySelector("a[href*='itorrents.org/torrent/']");
                const mLink = doc.querySelector("a[href^='magnet:?']");
                addDownloadButtons(link, tLink, mLink);
            }
            if (config.enableImdbRatings) {
                try {
                    const title = (link.textContent || '').trim();
                    const rating = await getImdbRatingForRow(title, link.getAttribute('href'), doc);
                    if (rating) renderImdb(link, rating);
                } catch (e) {}
            }
            row.dataset.processed = 'true';
        };

        if (cachedDoc) {
            handleDoc(cachedDoc);
            return;
        }
        queueFetchRequest(torrentUrl, handleDoc);
    }

    function setupRowObserver() {
        const obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const row = entry.target;
                    const link = row.querySelector('a[href^="/torrent/"]');
                    if (link && row.dataset.processed !== 'true') processLink(link);
                    obs.unobserve(row);
                }
            });
        }, { rootMargin: '200px' });
        document.querySelectorAll('.table-list tbody tr:not([data-processed])').forEach(function(r) {
            obs.observe(r);
        });
    }

    function debounce(fn, wait) {
        let t;
        return function() {
            const args = arguments;
            clearTimeout(t);
            t = setTimeout(function() { fn.apply(null, args); }, wait);
        };
    }

    function addMutationObserver() {
        const mo = new MutationObserver(debounce(function(muts) {
            muts.forEach(function(m) {
                if (m.type === 'childList') {
                    m.addedNodes.forEach(function(n) {
                        if (n.nodeType === 1 && n.matches('.table-list tbody tr')) setupRowObserver();
                    });
                }
            });
        }, 250));
        mo.observe(document.body, { childList: true, subtree: true });
    }

    function appendMagnetColumnIfEnabled() {
        if (config.showExtraColumn) appendColumn();
        else {
            document.querySelectorAll('.table-list-wrap').forEach(function(table) {
                const head = table.querySelector('.table-list > thead > tr > th.coll-1b');
                if (head) head.remove();
                table.querySelectorAll('.table-list > tbody > tr > td.coll-1b.dl-buttons').forEach(function(td) {
                    td.remove();
                });
            });
            extraColumnAdded = false;
        }
    }

    function applySettings() {
        appendMagnetColumnIfEnabled();
        if (!config.showButtonsInNameColumn) {
            document.querySelectorAll('.buttons-container').forEach(function(c) { c.remove(); });
        }
        document.body.classList.toggle('full-width-site', !!config.fullWidthSite);
        initCommentPopups();
        setupRowObserver();
    }

    function modifyH1OnTorrentPage() {
        if (location.pathname.indexOf('/torrent/') !== 0) return;
        const h1 = document.querySelector('.box-info-heading h1');
        if (h1) h1.textContent = cleanTitle(document.title);
    }

    function prefetchCommentsForVisibleTorrents() {
        // PATCH: use native fetch instead of GM_xmlhttpRequest for prefetch too, with CF retry/backoff.
        const rows = Array.prototype.slice.call(document.querySelectorAll('.table-list tbody tr')).filter(function(r) {
            const c = r.querySelector('span.comments');
            return c && (parseInt(c.textContent.trim(), 10) || 0) > 0;
        }).slice(0, 15);

        rows.forEach(function(row) {
            const link = row.querySelector('a[href^="/torrent/"]');
            const tid = link ? getTorrentIdFromHref(link.href) : null;
            if (!tid) return;
            if (getCachedComments(tid)) return;

            const url = location.protocol + '//' + location.host + '/comments.php?torrentid=' + tid;

            (async function() {
                let txt = '';
                try {
                    txt = await fetchJsonWithCfRetry(url, 0);
                } catch (e) {
                    txt = '';
                }
                if (!txt || isCloudflareChallengeText(txt)) return;
                try {
                    cacheComments(tid, JSON.parse(txt));
                } catch (e2) {}
            })();
        });
    }

    // ====== NEW: Add IMDb rating beside the main H1 on torrent detail pages ======
    async function enhanceMainTitleWithImdb() {
        if (!config.enableImdbRatings) return;
        // robust selectors for different themes/skins
        const h1 = document.querySelector('.box-info-heading h1, .box-info.torrent-detail-page h1, main.container h1');
        if (!h1 || h1.dataset.imdbTitleDone) return;
        h1.dataset.imdbTitleDone = '1';

        const rawTitle = (h1.textContent || '').trim();
        if (!isMovieOrTV(rawTitle)) return;

        let rating = null;

        // Try to reuse any cached rating via ID discovered by suggest
        let imdbID = await imdbSuggest(rawTitle, extractYear(rawTitle));
        if (imdbID && ratingByImdbId.has(imdbID)) {
            rating = ratingByImdbId.get(imdbID);
        }

        if (!rating && imdbID) {
            try {
                if (config.omdbApiKey) {
                    const omdb = await omdbById(imdbID);
                    const imdbRatingStr = omdb && omdb.imdbRating ? omdb.imdbRating : '';
                    const n = parseFloat(imdbRatingStr);
                    if (!isNaN(n)) rating = n.toFixed(1) + '/10';
                }
            } catch (e) {}
            if (!rating) {
                try {
                    await imdbRateLimit();
                    const v = await imdbScrapeRating(imdbID);
                    if (v && !isNaN(v)) rating = v.toFixed(1) + '/10';
                } catch (e2) {}
            }
            if (rating) ratingByImdbId.set(imdbID, rating);
        }

        if (rating && !h1.querySelector('.imdb-dot')) {
            let color = '#888';
            const n2 = parseFloat(rating);
            if (n2 > 7) color = '#23b14d';
            else if (n2 >= 6) color = '#d4aa00';
            else if (n2 > 0) color = '#d14545';

            const span = document.createElement('span');
            span.className = 'imdb-dot';
            span.title = 'IMDb: ' + rating;
            span.style.cssText = 'margin-left:8px;color:#222;font-weight:600;display:inline-flex;align-items:center;gap:5px;';
            span.innerHTML =
                '<span class="dot" style="background:' + color + ';width:10px;height:10px;border-radius:50%;display:inline-block"></span>' +
                '<span>' + rating + '</span>';
            h1.appendChild(span);
        }
    }
    // ====== END NEW ======
    // Add small download buttons under the title (existing feature hook)
    function addDownloadButtons(link, torrentLink, magnetLink) {
        if (!config.showButtonsInNameColumn) return;
        if (link.parentNode.querySelector('.buttons-container')) return;

        const container = document.createElement('div');
        container.classList.add('buttons-container');

        if (magnetLink) {
            const magnetBtn = document.createElement('a');
            magnetBtn.href = magnetLink.href;
            magnetBtn.classList.add('list-button-magnet');
            magnetBtn.title = 'Magnet link';
            magnetBtn.innerHTML = '<i class="flaticon-magnet"></i>';
            container.appendChild(magnetBtn);
        }
        if (torrentLink) {
            const torrentBtn = document.createElement('a');
            torrentBtn.href = torrentLink.href;
            torrentBtn.classList.add('list-button-dl');
            torrentBtn.title = 'Torrent download';
            torrentBtn.innerHTML = '<i class="flaticon-torrent-download"></i>';
            container.appendChild(torrentBtn);
        }
        link.parentNode.insertBefore(container, link.nextSibling);
    }

    let inited = false;

    function init() {
        if (inited) return;
        inited = true;
        showPopup('1337x Enhancements + IMDb Ratings loaded', 2800);
        addSettingsMenu();
        applySettings();
        modifyH1OnTorrentPage();
        enhanceMainTitleWithImdb(); // show rating beside main H1 on detail page
        addMutationObserver();
        setTimeout(function() { prefetchCommentsForVisibleTorrents(); }, 1800);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
