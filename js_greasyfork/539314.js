// ==UserScript==
// @name         Search with Goodreads, Anna's Archive, LibGen, and Z-Library (Enhanced Search)
// @namespace    Search-with-goodreads-annas-archive-libgen-zlibrary-enhanced-search
// @version      1.0
// @description  Automatically finds the ISBNs of all editions of a book and adds convenient buttons to search directly on Goodreads, Anna's Archive, Libgen and Z-Library
// @match        https://*.amazon.com/*
// @match        https://*.amazon.co.uk/*
// @match        https://*.amazon.com.au/*
// @match        https://*.amazon.com.be/*
// @match        https://*.amazon.com.br/*
// @match        https://*.amazon.ca/*
// @match        https://*.amazon.cn/*
// @match        https://*.amazon.eg/*
// @match        https://*.amazon.fr/*
// @match        https://*.amazon.de/*
// @match        https://*.amazon.in/*
// @match        https://*.amazon.it/*
// @match        https://*.amazon.co.jp/*
// @match        https://*.amazon.com.mx/*
// @match        https://*.amazon.nl/*
// @match        https://*.amazon.pl/*
// @match        https://*.amazon.sa/*
// @match        https://*.amazon.sg/*
// @match        https://*.amazon.es/*
// @match        https://*.amazon.se/*
// @match        https://*.amazon.com.tr/*
// @match        https://*.amazon.ae/*
// @grant        none
// @license      MIT
// @author       agfdo5tl8
// @icon         https://www.amazon.com/favicon.ico
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539314/Search%20with%20Goodreads%2C%20Anna%27s%20Archive%2C%20LibGen%2C%20and%20Z-Library%20%28Enhanced%20Search%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539314/Search%20with%20Goodreads%2C%20Anna%27s%20Archive%2C%20LibGen%2C%20and%20Z-Library%20%28Enhanced%20Search%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        debug: false,
        sites: {
            goodreads: {
                name: 'Goodreads',
                faviconUrl: 'https://www.goodreads.com/favicon.ico',
                color: '#377458',
                urlTemplate: 'https://www.goodreads.com/search?q={ID}',
                searchType: 'stateful-item-by-item'
            },
            annas: {
                name: "Anna's Archive",
                faviconUrl: 'https://annas-archive.org/favicon.ico',
                color: '#6447c4',
                urlTemplate: 'https://annas-archive.org/search?q={ID}',
		searchType: 'stateful-hybrid'
            },
            libgen: {
                name: 'LibGen',
                faviconUrl: 'https://libgen.is/favicon.ico',
                color: '#de741d',
                urlTemplate: 'https://libgen.is/search.php?req={ID}&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def',
                searchType: 'stateful-item-by-item'
            },
            zlibrary: {
                name: 'Z-Library',
                faviconUrl: 'https://z-lib.fm/favicon.ico',
                color: '#2c5aa0',
                urlTemplate: 'https://z-lib.fm/s/{ID}',
                searchType: 'stateful-item-by-item'
            }
        }
    };

    const utils = {
        log: (...args) => CONFIG.debug && console.log('[BookScript]', ...args),
        error: (...args) => console.error('[BookScript]', ...args),
    };

    class BookPageDetector {
        static isBookPage() {
            if (!window.location.pathname.match(/\/(dp|gp\/product)\//)) return false;
            if (document.querySelector('#wayfinding-breadcrumbs_feature_div')?.textContent.includes('Books')) return true;
            const detailsText = document.querySelector('#detailBullets_feature_div, #productDetails_feature_div')?.textContent || '';
            const keywords = ['ISBN-10', 'ISBN-13', 'Publisher', 'Paperback', 'Hardcover'];
            return keywords.some(keyword => detailsText.includes(keyword));
        }
    }

    class IdentifierExtractor {
        static async extractAllFromAllFormats() {
            const allIdentifiers = new Set();
            const formatUrls = this.getAllFormatURLs();
            formatUrls.add(window.location.href);
            const fetchPromises = Array.from(formatUrls).map(url =>
                this.fetchAndParse(url).catch(err => {
                    utils.error(`Failed to fetch or parse ${url}:`, err);
                    return new Set();
                })
            );
            const results = await Promise.all(fetchPromises);
            results.forEach(ids => ids.forEach(id => allIdentifiers.add(id)));
            const bookInfo = this.extractTitleAndAuthor(document);
            if (bookInfo?.title) {
                const titleAuthorQuery = `${bookInfo.title} ${bookInfo.author}`.trim();
                allIdentifiers.add(titleAuthorQuery);
            }
            const finalIds = Array.from(allIdentifiers).filter(Boolean);
            utils.log("COMPLETED EXTRACTION. All search options:", finalIds);
            return finalIds;
        }

        static extractTitleAndAuthor(doc = document) {
            const titleElement = doc.querySelector('#productTitle');
            const title = titleElement ? titleElement.textContent.trim() : '';
            const authorElements = doc.querySelectorAll('#bylineInfo .author a, .author-contributor-list .author a');
            const authors = Array.from(authorElements).map(el => el.textContent.trim()).join(' ');
            return (title) ? { title, author: authors } : null;
        }

        static async fetchAndParse(url) {
            if (url === window.location.href) {
                return this.parsePageForIdentifiers(document, window.location.href);
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            return this.parsePageForIdentifiers(doc, url);
        }

        static getAllFormatURLs() {
            const urls = new Set();
            document.querySelectorAll('#tmmSwatches a[href*="/dp/"], #MediaMatrix a[href*="/dp/"]').forEach(link => {
                urls.add(new URL(link.href, window.location.origin).href);
            });
            return urls;
        }

        static parsePageForIdentifiers(doc, pageUrl) {
            const pageIdentifiers = new Set();
            if (pageUrl) {
                const urlPath = new URL(pageUrl).pathname;
                const urlMatch = urlPath.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
                if (urlMatch) pageIdentifiers.add(urlMatch[1]);
            }
            const detailsList = doc.querySelectorAll('#detailBullets_feature_div li, #productDetails_feature_div li');
            detailsList.forEach(item => {
                const labelElement = item.querySelector('span.a-text-bold');
                if (!labelElement) return;
                const labelText = labelElement.textContent.trim();
                let idType = null;
                if (labelText.includes('ISBN-13')) idType = 'isbn13';
                else if (labelText.includes('ISBN-10')) idType = 'isbn10';
                if (idType) {
                    const valueElement = labelElement.nextElementSibling;
                    if (valueElement) {
                        const cleanId = valueElement.textContent.replace(/[-:]/g, '').trim();
                        if (idType === 'isbn13' && cleanId.length === 13) pageIdentifiers.add(cleanId);
                        else if (idType === 'isbn10' && cleanId.length === 10) pageIdentifiers.add(cleanId);
                    }
                }
            });
            return pageIdentifiers;
        }
    }

    class ButtonManager {
        constructor() {
            this.containerId = 'book-redirect-buttons';
            this.statefulSearchStates = {};
        }

        async insertButtons() {
            if (!BookPageDetector.isBookPage()) return;
            document.getElementById(this.containerId)?.remove();
            const targetElement = ['#imageBlockNew_feature_div', '#booksImageBlock_feature_div', '#imageBlock_feature_div', '#leftCol']
                .map(s => document.querySelector(s)).find(el => el);
            if (!targetElement) { utils.error('Could not find a target element.'); return; }
            utils.log("Starting comprehensive search across all formats...");
            let identifiers = await IdentifierExtractor.extractAllFromAllFormats();
            if (!identifiers || identifiers.length === 0) {
                utils.log('No identifiers found after comprehensive search.'); return;
            }
            identifiers = this.sortIdentifiersByPriority(identifiers);
            utils.log('Sorted identifiers for stateful search:', identifiers);
            this.statefulSearchStates = {};
            const buttonContainer = this.createButtonContainer(identifiers);
            Object.entries(CONFIG.sites).forEach(([key, config]) => {
                let clickHandler;
                switch (config.searchType) {
                    case 'stateful-item-by-item':
                        clickHandler = this.createStatefulItemByItemHandler(key, config, identifiers);
                        break;
                    case 'stateful-hybrid':
                        clickHandler = this.createStatefulHybridHandler(key, config, identifiers);
                        break;
                    default:
                        clickHandler = this.createComprehensiveRedirectHandler(config, identifiers);
                        break;
                }
                const button = this.createButton(key, config, clickHandler);
                buttonContainer.appendChild(button);
            });
            targetElement.parentNode.insertBefore(buttonContainer, targetElement.nextSibling);
            utils.log('Buttons inserted successfully.');
        }

        sortIdentifiersByPriority(ids) {
            const getPriority = (id) => {
                if (id.length === 13 && id.startsWith('97')) return 1;
                if (id.length === 10 && /^\d{9}[\dX]$/i.test(id)) return 2;
                if (id.includes(' ')) return 4;
                return 3;
            };
            return ids.sort((a, b) => getPriority(a) - getPriority(b));
        }

        createComprehensiveRedirectHandler(config, identifiers) {
            return () => {
                const searchQuery = identifiers.join(' ');
                window.open(config.urlTemplate.replace('{ID}', encodeURIComponent(searchQuery)), '_blank');
            };
        }

        createStatefulItemByItemHandler(siteKey, config, identifiers) {
            this.statefulSearchStates[siteKey] = { currentIndex: 0, identifiers: identifiers };
            return () => {
                const state = this.statefulSearchStates[siteKey];
                if (state.currentIndex >= state.identifiers.length) {
                    this.showNotification(`All ${state.identifiers.length} search options tried. Resetting.`, 'info');
                    state.currentIndex = 0;
                    this.updateItemByItemButtonText(siteKey, config, state);
                    return;
                }
                const identifier = state.identifiers[state.currentIndex];
                window.open(config.urlTemplate.replace('{ID}', encodeURIComponent(identifier)), '_blank');
                state.currentIndex++;
                this.updateItemByItemButtonText(siteKey, config, state);
            };
        }

        createStatefulHybridHandler(siteKey, config, allIdentifiers) {
            const numericIds = allIdentifiers.filter(id => !id.includes(' ')).join(' ');
            const titleAuthorId = allIdentifiers.find(id => id.includes(' '));
            const searchList = [];
            if (numericIds) searchList.push(numericIds);
            if (titleAuthorId) searchList.push(titleAuthorId);
            this.statefulSearchStates[siteKey] = { currentIndex: 0, identifiers: searchList };
            return () => {
                const state = this.statefulSearchStates[siteKey];
                if (state.currentIndex >= state.identifiers.length) {
                    this.showNotification(`All search options tried for ${config.name}. Resetting.`, 'info');
                    state.currentIndex = 0;
                    this.updateHybridButtonText(siteKey, config, state);
                    return;
                }
                const identifier = state.identifiers[state.currentIndex];
                window.open(config.urlTemplate.replace('{ID}', encodeURIComponent(identifier)), '_blank');
                state.currentIndex++;
                this.updateHybridButtonText(siteKey, config, state);
            };
        }

        updateItemByItemButtonText(siteKey, config, state) {
            const button = document.getElementById(`btn-${siteKey}`);
            if (!button) return;
            const textSpan = button.querySelector('span');
            if (!textSpan) return;
            const baseText = `Search with ${config.name}`;
            const total = state.identifiers.length;
            const current = state.currentIndex;
            const nextIdentifier = state.identifiers[current];
            if (current < total) {
                let nextActionText = `Try ${current + 1}/${total}`;
                if (nextIdentifier && nextIdentifier.includes(' ')) {
                    nextActionText = `Try Title/Author`;
                }
                textSpan.innerHTML = `${baseText} <small style="opacity:0.8;">(${nextActionText})</small>`;
                button.style.opacity = '0.9';
            } else {
                textSpan.innerHTML = `${baseText} <small style="opacity:0.8;">(All Tried - Click to Reset)</small>`;
                button.style.opacity = '0.7';
            }
        }

        updateHybridButtonText(siteKey, config, state) {
            const button = document.getElementById(`btn-${siteKey}`);
            if (!button) return;
            const textSpan = button.querySelector('span');
            if (!textSpan) return;
            const baseText = `Search with ${config.name}`;
            const current = state.currentIndex;
            if (current === 1) {
                textSpan.innerHTML = `${baseText} <small style="opacity:0.8;">(Try Title/Author Fallback)</small>`;
                button.style.opacity = '0.9';
            } else if (current >= state.identifiers.length) {
                textSpan.innerHTML = `${baseText} <small style="opacity:0.8;">(All Tried - Click to Reset)</small>`;
                button.style.opacity = '0.7';
            } else {
                textSpan.innerHTML = baseText;
                button.style.opacity = '1.0';
            }
        }

        createButton(key, config, clickHandler) {
            const button = document.createElement('button');
            button.id = `btn-${key}`;
            Object.assign(button.style, {
                width: '95%', margin: '5px', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignItems: 'center',
                color: '#ffffff', backgroundColor: config.color, border: 'none', borderRadius: '4px', padding: '8px 12px',
                fontFamily: 'Arial, sans-serif', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
                transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            });
            const iconHtml = `<img src="${config.faviconUrl}" style="height:16px; width:16px; margin-right:8px; vertical-align:middle; border-radius:2px;">`;
            button.innerHTML = `${iconHtml}<span>Search with ${config.name}</span>`;
            if (!config.faviconUrl) {
                button.style.textAlign = 'center';
                button.innerHTML = `<span>Search with ${config.name}</span>`;
            }
            button.addEventListener('mouseenter', () => { button.style.transform = 'translateY(-1px)'; button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'; });
            button.addEventListener('mouseleave', () => { button.style.transform = 'translateY(0)'; button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'; });
            button.addEventListener('click', (e) => { e.preventDefault(); clickHandler(); });
            return button;
        }

        createButtonContainer(identifiers) {
            const container = document.createElement('div');
            container.id = this.containerId;
            Object.assign(container.style, {
                textAlign: 'center', margin: '15px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '8px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            });
            const header = document.createElement('div');
            const idCount = identifiers.filter(id => !id.includes(' ')).length;
            const hasFallback = identifiers.some(id => id.includes(' '));
            let headerText = `📚 <strong>Found ${idCount} unique identifiers`;
            if (hasFallback) { headerText += ` + title/author fallback`; }
            headerText += `.</strong>`;
            header.innerHTML = headerText;
            Object.assign(header.style, { fontSize: '12px', color: '#666', marginBottom: '10px', fontFamily: 'Arial, sans-serif', lineHeight: '1.4' });
            container.appendChild(header);
            return container;
        }

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.textContent = message;
            Object.assign(notification.style, {
                position: 'fixed', top: '20px', right: '20px', padding: '10px 15px', borderRadius: '5px', color: 'white',
                fontWeight: 'bold', zIndex: '10000', fontSize: '14px', maxWidth: '300px',
                backgroundColor: type === 'error' ? '#dc3545' : '#007bff', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            });
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3500);
        }
    }

    function main() {
        utils.log('Script starting v6.0 (Stable Hybrid Model)...');
        const buttonManager = new ButtonManager();
        buttonManager.insertButtons();

        let currentHref = document.location.href;
        const observer = new MutationObserver(() => {
            if (document.location.href !== currentHref) {
                currentHref = document.location.href;
                utils.log('URL changed. Re-initializing comprehensive search.');
                buttonManager.insertButtons();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        utils.log('Initialization complete.');
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
    else main();
})();