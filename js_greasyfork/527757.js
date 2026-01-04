// ==UserScript==
// @name         Instagram Post Date, Location and Paid Partnership (OSINT)
// @namespace    http://tampermonkey.net/
// @version      1.8.3
// @description  Add Date, Location and Paid Partnership in instagram Posts by sniffing background requests
// @author       SH3LL
// @match        https://www.instagram.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527757/Instagram%20Post%20Date%2C%20Location%20and%20Paid%20Partnership%20%28OSINT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527757/Instagram%20Post%20Date%2C%20Location%20and%20Paid%20Partnership%20%28OSINT%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    .post-date-label {
        position: absolute;
        top: 8px;
        left: 8px;
        max-width: 50%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 99999;
    }
    .post-location-label {
        position: absolute;
        top: 8px;
        right: 8px;
        max-width: 40%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 99999;
    }
    .post-paid-label {
        position: absolute;
        bottom: 8px;
        left: 8px;
        background-color: rgba(0, 0, 0, 0.7);
        color: gold;
        padding: 5px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 99999;
    }
`);


    const interceptedJsons = [];
    const postIndex = {}; // map: code -> node

    // Intercept XHR GraphQL requests
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('readystatechange', function() {
            try {
                if (this.readyState === 4 && this.responseURL && this.responseURL.includes('/graphql/query')) {
                    let json;
                    try {
                        json = JSON.parse(this.responseText);
                    } catch {
                        return;
                    }
                    interceptedJsons.push(json);
                    Object.assign(postIndex, indexJsonNodes(json));
                }
            } catch {}
        });
        return originalSend.apply(this, arguments);
    };

    // Recursively scan JSON and collect media nodes
    function indexJsonNodes(json) {
        const map = {};
        function walk(obj) {
            if (!obj || typeof obj !== 'object') return;
            if (Array.isArray(obj)) return obj.forEach(walk);
            if (obj.code && (obj.taken_at || obj.taken_at_timestamp || obj.taken_at_ms)) {
                map[obj.code] = obj;
            }
            for (const k in obj) {
                if (obj.hasOwnProperty(k)) walk(obj[k]);
            }
        }
        walk(json && json.data ? json.data : json);
        return map;
    }

    function extractPostCodeFromHref(href) {
        if (!href) return null;
        const regex = /\/(?:p|reel|tv)\/([^\/?#]+)/i;
        const m = href.match(regex);
        if (m && m[1]) return m[1];
        const parts = href.split('/').filter(Boolean);
        for (let i = 0; i < parts.length - 1; i++) {
            const seg = parts[i].toLowerCase();
            if (seg === 'p' || seg === 'reel' || seg === 'tv') return parts[i+1];
        }
        return null;
    }

    function addDateLabel(postElement, dateSeconds) {
        if (!postElement.querySelector('.post-date-label')) {
            const label = document.createElement('div');
            label.classList.add('post-date-label');
            label.textContent = "📅 " + formatDate(dateSeconds * 1000);
            postElement.style.position = 'relative';
            postElement.appendChild(label);
        }
    }

    function formatDate(ms) {
        const date = new Date(ms);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
        const map = {};
        parts.forEach(p => { if (p.type !== 'literal') map[p.type] = p.value; });
        return `${map.month} ${map.day} ${map.year} ${map.hour}:${map.minute}`;
    }




    function addLocationLabel(postElement, locationName, locationPk) {
        if (locationName && !postElement.querySelector('.post-location-label')) {
            const label = document.createElement('a');
            label.classList.add('post-location-label');
            // Usa il nome completo, senza taglio manuale
            label.textContent = `📌 ${locationName}`;
            label.href = `https://www.instagram.com/explore/locations/${locationPk}`;
            label.target = "_blank";
            postElement.style.position = 'relative';
            postElement.appendChild(label);
        }
    }


    function addPaidLabel(postElement) {
        if (!postElement.querySelector('.post-paid-label')) {
            const label = document.createElement('div');
            label.classList.add('post-paid-label');
            label.textContent = "💰 Sponsor";
            postElement.style.position = 'relative';
            postElement.appendChild(label);
        }
    }
    function processPosts() {
        const postElements = document.querySelectorAll('._aagu');
        postElements.forEach(postElement => {
            try {
                const linkElement = postElement.closest('a[href*="/p/"], a[href*="/reel/"], a[href*="/tv/"]');
                if (!linkElement) return;
                const postCode = extractPostCodeFromHref(linkElement.getAttribute('href'));
                if (!postCode) return;

                const node = postIndex[postCode];
                if (node) {
                    const ts = node.taken_at || node.taken_at_timestamp || node.taken_at_ms;
                    if (ts) addDateLabel(postElement, ts);

                    if (node.location) {
                        addLocationLabel(postElement, node.location.name || '', node.location.pk || node.location.id || '');
                    }

                    if (node.is_paid_partnership === true) {
                        addPaidLabel(postElement);
                    }
                }
            } catch {}
        });
    }

    processPosts();
    const observer = new MutationObserver(() => processPosts());
    observer.observe(document.body, { childList: true, subtree: true });

})();
