// ==UserScript==
// @name         Reverse Whoxy Domain Status (OSINT)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Check if websites are online
// @author       SH3LL
// @match        https://www.whoxy.com/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/541732/Reverse%20Whoxy%20Domain%20Status%20%28OSINT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541732/Reverse%20Whoxy%20Domain%20Status%20%28OSINT%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const table = document.querySelector('table.grid.first_col_center');
    if (!table) {
        console.log('No table found on the page.');
        return;
    }

    const defaultHosterKeywords = [
        'this domain is for sale',
        'domain registered',
        'domain reserved',
        'courtesy page',
        'coming soon',
        'welcome to your new website',
        'this domain has been registered',
        'placeholder page',
        'parked domain',
        'under construction',
        'domain parking',
        'domain reserved'
    ];

    const knownProviders = [
        'godaddy.com',
        'namecheap.com',
        'bluehost.com',
        'hostgator.com',
        'dreamhost.com',
        'squarespace.com',
        'wix.com',
        'siteground.com',
        'ionos.com',
        'dynadot.com'
    ];

    async function checkDomainStatus(url) {
        try {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'http://' + url;
            }

            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: 8000,
                    onload: function(response) {
                        const finalUrl = response.finalUrl || url;
                        const content = (response.responseText || '').toLowerCase();
                        const status = response.status;

                        // WAF / protected detection
                        if (
                            content.includes('cloudflare') ||
                            content.includes('ddos-guard') ||
                            content.includes('sucuri') ||
                            content.includes('access denied') ||
                            content.includes('request blocked') ||
                            status === 403 || status === 503
                        ) {
                            console.log(`🟠 WAF PROTECTED   | ${url} (HTTP ${status})`);
                            resolve('🟠');
                            return;
                        }

                        // Redirect to known provider
                        if (knownProviders.some(provider => finalUrl.includes(provider))) {
                            console.log(`🔴 REDIRECT        | ${url} (Redirected to ${finalUrl})`);
                            resolve('🔴');
                            return;
                        }

                        // Minimal or empty body
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const bodyContent = doc.body ? doc.body.textContent.trim() : '';
                        if (!bodyContent || bodyContent.length < 50) {
                            console.log(`🔴 EMPTY PAGE      | ${url}`);
                            resolve('🔴');
                            return;
                        }

                        // Default hoster keywords
                        const matchingKeyword = defaultHosterKeywords.find(keyword => content.includes(keyword.toLowerCase()));
                        if (matchingKeyword) {
                            console.log(`🔴 HOSTER KEYWORD  | ${url} (${matchingKeyword})`);
                            resolve('🔴');
                            return;
                        }

                        // Online
                        console.log(`🟢 ONLINE          | ${url} (HTTP ${status})`);
                        resolve('🟢');
                    },
                    onerror: function() {
                        console.log(`🟠 BLOCKED         | ${url} (Network error or blocked by server)`);
                        resolve('🟠');
                    },
                    ontimeout: function() {
                        console.log(`🔴 TIMEOUT         | ${url} (Request timed out)`);
                        resolve('🔴');
                    }
                });
            });
        } catch (error) {
            console.log(`🔴 ERROR           | ${url} (${error.message})`);
            return '🔴';
        }
    }

    const rows = table.querySelectorAll('tbody tr');
    for (const row of rows) {
        const domainCell = row.querySelector('td:nth-child(2) a');
        if (domainCell) {
            const domain = domainCell.textContent.trim();
            const statusLink = document.createElement('a');
            statusLink.style.marginLeft = '5px';
            statusLink.textContent = '🔄'; // Loading
            statusLink.href = `http://${domain}`;
            statusLink.target = '_blank';
            domainCell.parentElement.appendChild(statusLink);

            const status = await checkDomainStatus(domain);
            statusLink.textContent = status;
        }
    }
})();
