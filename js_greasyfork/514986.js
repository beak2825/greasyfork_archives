// ==UserScript==
// @name         iOS Safari WebCrawler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A WebCrawler for iOS Safari with proxy support
// @author        SiJosxStudio
// @url               http://tinyurl.com/BuySijosxStudioCoffee
// @match        *://*/*
// @grant        GM_download
// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/514986/iOS%20Safari%20WebCrawler.user.js
// @updateURL https://update.greasyfork.org/scripts/514986/iOS%20Safari%20WebCrawler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class WebCrawler {
        constructor() {
            this.url = '';
            this.proxy = '';
            this.findings = [];
        }

        async startCrawl(url, proxy) {
            this.validateInput(url, proxy);
            this.url = url;
            this.proxy = proxy;

            try {
                const response = await fetch(this.proxy + '/' + this.url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }
                const text = await response.text();
                this.extractFindings(text);
            } catch (error) {
                console.error('Error during crawling:', error);
                throw new Error('Crawling failed: ' + error.message);
            }
        }

        validateInput(url, proxy) {
            const urlPattern = new RegExp('^(https:\\/\\/)' +
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+[a-z]{2,}|localhost|' +
                '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' +
                '\\[?[a-fA-F0-9]*:[a-fA-F0-9:]+\\]?)' +
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
                '(\\[;&a-z\\d%_.~+=-]*)' +
                '(\\#[-a-z\\d_]*)$', 'i');

            if (!urlPattern.test(url)) {
                throw new Error('Invalid URL format.');
            }

            if (!proxy) {
                throw new Error('Proxy cannot be empty.');
            }
        }

        extractFindings(html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const title = doc.querySelector('title') ? doc.querySelector('title').innerText : 'No title found';
            this.findings.push(`Title: ${title}`);
            const metaTags = doc.querySelectorAll('meta');
            metaTags.forEach(meta => {
                const name = meta.getAttribute('name') || 'unknown';
                const content = meta.getAttribute('content') || 'no content';
                this.findings.push(`Meta: ${name} = ${content}`);
            });
            const links = doc.querySelectorAll('a');
            links.forEach(link => {
                const href = link.getAttribute('href') || 'no href';
                this.findings.push(`Link: ${href}`);
            });
        }

        saveFindingsToFile(filename) {
            const blob = new Blob([this.findings.join('\n')], { type: 'text/plain' });

            if (typeof GM_download !== 'undefined') {
                // Use GM_download if available (in Tampermonkey for iOS)
                GM_download(URL.createObjectURL(blob), filename);
            } else {
                // For Safari fallback
                const reader = new FileReader();
                reader.onloadend = function () {
                    window.open(reader.result, '_blank');
                };
                reader.readAsDataURL(blob);
            }
        }
    }

    // Add buttons to the webpage for user interaction
    function createButton(id, label, onClick) {
        const button = document.createElement('button');
        button.id = id;
        button.innerText = label;
        button.style.position = 'fixed';
        button.style.top = `${50 + document.querySelectorAll('button').length * 40}px`;
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.onclick = onClick;
        document.body.appendChild(button);
    }

    const crawler = new WebCrawler();

    createButton('startCrawlButton', 'Start Crawl', async () => {
        const url = prompt("Enter the URL to crawl");
        const proxy = prompt("Enter the proxy to use");

        try {
            await crawler.startCrawl(url, proxy);
            console.log('Crawling completed:', crawler.findings);
            alert("Crawling completed! Check console for findings.");
        } catch (error) {
            console.error('Crawling error:', error.message);
            alert("Crawling error: " + error.message);
        }
    });

    createButton('saveFindingsButton', 'Save Findings', () => {
        const filename = 'findings.txt';
        crawler.saveFindingsToFile(filename);
    });

})();