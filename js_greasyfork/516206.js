// ==UserScript==
// @name         Title Fetcher Optimized
// @namespace    coolakov
// @version      2.4.56
// @description  Observes table changes and adds new columns with fetched link titles, descriptions, and H1s efficiently using GM_xmlhttpRequest only
// @author       GreatFireDragon
// @match        https://coolakov.ru/tools/most_promoted/
// @grant        GM_xmlhttpRequest
// @connect      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coolakov.ru
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516206/Title%20Fetcher%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/516206/Title%20Fetcher%20Optimized.meta.js
// ==/UserScript==

const cache = JSON.parse(localStorage.getItem('cache')) || {};
const MAX_CACHE_SIZE = 5000;

// Trim cache if necessary
if (Object.keys(cache).length > MAX_CACHE_SIZE) {
    Object.keys(cache).slice(0, Object.keys(cache).length - MAX_CACHE_SIZE).forEach(k => delete cache[k]);
    localStorage.setItem('cache', JSON.stringify(cache));
}

const saveCache = () => localStorage.setItem('cache', JSON.stringify(cache));
const supportsRangeCache = {};
let skipDomains = JSON.parse(localStorage.getItem('GFD_skipDomains')) || ['megamarket.ru', "market.yandex.ru", "ozon.ru", "ozon.by", "avito.ru"];

// Create and append textarea for skipDomains
const textarea = Object.assign(document.createElement('textarea'), {
    value: skipDomains.join(', '),
    title: "Домены для которых никогда не собирать тайтл, дескрипшн и H1",
});
document.querySelector("#navbar-header").appendChild(textarea);

textarea.addEventListener('change', () => {
    skipDomains = textarea.value.split(',').map(d => d.trim()).filter(Boolean);
    localStorage.setItem('GFD_skipDomains', JSON.stringify(skipDomains));
    refreshTable();
});

// Normalize URLs
const normalizeUrl = url => /^https?:\/\//i.test(url.trim()) ? url.trim() : `http://${url.trim()}`;

// Get headers based on user agent
const getUserAgentHeaders = ua => {
    const agents = {
        'Googlebot': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/118.0.5993.70 Safari/537.36)',
        'YandexBot': 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)'
    };
    return ua ? { 'User-Agent': agents[ua], 'X-User-Agent': agents[ua] } : {};
};

// Decode HTML entities safely
const decodeEntities = str => {
    if (typeof str !== 'string') return '-';
    const entities = {
        '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'",
        '&copy;': '©', '&reg;': '®', '&euro;': '€', '&trade;': '™', '&mdash;': '—', '&ndash;': '–',
        '&uarr;': '↑', '&darr;': '↓', '&larr;': '←', '&rarr;': '→', '&harr;': '↔', '&bull;': '•',
        '&hellip;': '…', '&laquo;': '«', '&raquo;': '»', '&lsquo;': '‘', '&rsquo;': '’',
        '&ldquo;': '“', '&rdquo;': '”', '&frasl;': '⁄', '&times;': '×', '&divide;': '÷', '&para;': '¶'
    };
    return str.replace(/&amp;#(\d+);|&#(\d+);|&\w+;/g, (match, dec1, dec2) => {
        if (dec1) return String.fromCharCode(dec1);
        if (dec2) return String.fromCharCode(dec2);
        return entities[match] || match;
    });
};

// Update cell content
const updateCell = (cell, text) => {
    cell.textContent = text;
    cell.title = text;
    if (text.startsWith('Error') || text.includes('not found') || text === '-') cell.classList.add('GFD_title_error');
};

// Extract title, description, and H1 from HTML
const extractContent = text => ({
    title: (text.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim(),
    description: (text.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) || [])[1]?.trim(),
    h1: (text.match(/<h1[^>]*>([^<]*)<\/h1>/i) || [])[1]?.trim()
});

// Fetch data with optional range and user agent
const fetchData = (url, cellTitle, cellDesc, cellH1, range, ua) => {
    if (cache[url]) {
        updateCell(cellTitle, cache[url].title);
        updateCell(cellDesc, cache[url].description);
        updateCell(cellH1, cache[url].h1);
        return;
    }

    cellTitle.textContent = cellDesc.textContent = cellH1.textContent = 'Fetching... 0';
    let seconds = 0;
    const timer = setInterval(() => {
        seconds++;
        cellTitle.textContent = `Fetching... ${seconds}`;
        cellDesc.textContent = `Fetching... ${seconds}`;
        cellH1.textContent = `Fetching... ${seconds}`;
    }, 1000);

    GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { ...(range ? { 'Range': range } : {}), ...getUserAgentHeaders(ua) },
        onload: res => {
            clearInterval(timer);
            if ([200, 206].includes(res.status)) {
                const { title, description, h1 } = extractContent(res.responseText);

                const fields = { // Safely decode entities and handle missing fields
                    title: decodeEntities(title) || 'missing',description: decodeEntities(description) || 'missing',h1: decodeEntities(h1) || 'missing'
                };

                // Update cells and cache the results
                [ cellTitle, cellDesc, cellH1 ].forEach((cell, index) => {
                    const fieldKey = Object.keys(fields)[index]; // Get the corresponding field key (title, description, h1)
                    updateCell(cell, fields[fieldKey]);
                });
                cache[url] = fields;
                saveCache();
            } else {
                handleError(url, cellTitle, cellDesc, cellH1, range, ua, res.status);
            }
        },
        onerror: () => {
            clearInterval(timer);
            handleError(url, cellTitle, cellDesc, cellH1, range, ua, 'Network Error');
        },
        ontimeout: () => {
            var RequestTimesOut = 'Request timed out';
            clearInterval(timer);
            [ cellTitle, cellDesc, cellH1 ].forEach(cell => updateCell(cell, RequestTimesOut));
        },
        timeout: 10000
    });
};

// Handle fetch errors with retries
const handleError = (url, cellTitle, cellDesc, cellH1, range, ua, status) => {
    if (ua === 'Googlebot') {
        fetchData(url, cellTitle, cellDesc, cellH1, range, 'YandexBot'); // Retry with YandexBot
    } else if (ua === 'YandexBot') {
        fetchData(url, cellTitle, cellDesc, cellH1, range, null); // Final attempt without specifying User-Agent
    } else { // Final failure, cache '-' and update cells
        updateCell(cellTitle, 'fetch error'); updateCell(cellDesc, 'fetch error'); updateCell(cellH1, 'fetch error');
        // cache[url] = { title: '-', description: '-', h1: '-' };
        // saveCache();
    }
};

// Check if server supports range requests
const checkRangeSupport = url => new Promise(resolve => {
    const domain = new URL(url).origin;
    if (supportsRangeCache[domain] !== undefined) return resolve(supportsRangeCache[domain]);

    GM_xmlhttpRequest({
        method: 'HEAD',
        url,
        headers: getUserAgentHeaders('Googlebot'),
        onload: res => {
            const supports = /Accept-Ranges:\s*bytes/i.test(res.responseHeaders);
            supportsRangeCache[domain] = supports;
            resolve(supports);
        },
        onerror: () => {
            supportsRangeCache[domain] = false;
            resolve(false);
        }
    });
});

// Process each URL
const processUrl = async (url, cellTitle, cellDesc, cellH1) => {
    const normalized = normalizeUrl(url);
    let domain;
    try {
        domain = new URL(normalized).hostname.replace(/^www\./, '');
    } catch (e) {
        // Invalid URL
        updateCell(cellTitle, '-');updateCell(cellDesc, '-');updateCell(cellH1, '-');
        cache[normalized] = { title: '-',description: '-',h1: '-' };
        saveCache();
        return;
    }

    if (skipDomains.includes(domain)) {
        updateCell(cellTitle, '-');updateCell(cellDesc, '-');updateCell(cellH1, '-');
        return;
    }

    if (cache[normalized]) {
        updateCell(cellTitle, cache[normalized].title); updateCell(cellDesc, cache[normalized].description); updateCell(cellH1, cache[normalized].h1);
        return;
    }

    const supportsRange = await checkRangeSupport(normalized);
    fetchData(normalized, cellTitle, cellDesc, cellH1, supportsRange ? 'bytes=0-1024' : null, 'Googlebot');
};

// Process the table by adding headers and cells
const processTable = table => {
    const header = table.querySelector('thead tr');
    if (header && !header.querySelector('.title-header')) {
        ['Title', 'Description', 'H1'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            th.classList.add(`${text.toLowerCase()}-header`);
            header.insertBefore(th, header.lastElementChild);
        });
    }

    table.querySelectorAll('tbody tr').forEach(row => {
        if (!row.querySelector('.title-cell')) {
            const cells = ['title', 'description', 'h1'].map(cls => {
                const td = document.createElement('td');
                td.classList.add(`${cls}-cell`);
                const div = document.createElement('div');
                td.appendChild(div);
                row.insertBefore(td, row.lastElementChild);
                return div;
            });

            const link = row.cells[1]?.querySelector('a');
            if (link) {
                processUrl(link.href, cells[0], cells[1], cells[2]);
            } else {
                updateCell(cells[0], '-'); updateCell(cells[1], 'No link'); updateCell(cells[2], 'No link');
            }
        }
    });
};

// Refresh table based on updated skipDomains
const refreshTable = () => {
    document.querySelectorAll('table#myTable').forEach(table => {
        table.querySelectorAll('tbody tr').forEach(row => {
            const cellTitle = row.querySelector('.title-cell div');
            const cellDesc = row.querySelector('.description-cell div');
            const cellH1 = row.querySelector('.h1-cell div');
            const link = row.cells[1]?.querySelector('a');
            if (link) {
                processUrl(link.href, cellTitle, cellDesc, cellH1);
            } else {
                updateCell(cellTitle, '-'); updateCell(cellDesc, 'No link'); updateCell(cellH1, 'No link');
            }
        });
    });
};

// Initial processing
document.querySelectorAll('table#myTable').forEach(processTable);

// Observe mutations to handle dynamic changes
const observer = new MutationObserver(() => document.querySelectorAll('table#myTable').forEach(processTable));
observer.observe(document.body, { childList: true, subtree: true });
