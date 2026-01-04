// ==UserScript==
// @name         Audible Buttons ➜ MyAnonamouse Search
// @namespace    https://www.myanonamouse.net/u/253587
// @version      1.7
// @description  Replace All orange buttons with MyAnonamouse search.
// @include      https://www.audible.*
// @grant        none
// @run-at       document-idle
// @author       Gorgonian
// @downloadURL https://update.greasyfork.org/scripts/537822/Audible%20Buttons%20%E2%9E%9C%20MyAnonamouse%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/537822/Audible%20Buttons%20%E2%9E%9C%20MyAnonamouse%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const icons = {
        icon1: 'data:image/png;base64,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',
    };

    const cleanAuthor = (name = '') =>
    name.replace(/^(Sir|Dame|Dr\.?|Prof\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i, '')
    .replace(/,?\s*(Jr\.?|Sr\.?|III|IV|Ph\.?D\.?|M\.?D\.?|DPhil|EdD|Esq\.?|OBE|MBE|CBE|by)$/i, '')
    .trim();

    const cleanTitle = (title = '') =>
    title.replace(/\b(the complete|box\s*set|boxset|books|series|volume|audiobook|editor|by|1st\s*Edition)\b/gi, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

    function getSearchUrl(author = '', title = '') {
        const query = `${title} ${author}`.trim();
        return `https://www.myanonamouse.net/tor/browse.php?tor[text]=${encodeURIComponent(query)}&tor[srchIn][title]=true&tor[srchIn][tags]=true&tor[srchIn][author]=true&tor[srchIn][narrator]=true&tor[srchIn][series]=true&tor[srchIn][fileTypes]=true&tor[srchIn][filenames]=true&tor[searchType]=all&tor[searchIn]=torrents&tor[cat][]=0&tor[main_cat]=13`;
    }

    function getTitleAndAuthor() {
        const ldJsonScripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of ldJsonScripts) {
            try {
                const json = JSON.parse(script.textContent);
                const items = Array.isArray(json) ? json : [json];
                for (const item of items) {
                    if (item['@type'] === 'Audiobook') {
                        return {
                            title: item.name,
                            author: cleanAuthor(item.author?.[0]?.name || ''),
                        };
                    }
                }
            } catch (_) {}
        }
        return null;
    }

    const patchAdblButton = () => {
        const buttonSelectors = ['adbl-button', 'span.bc-button-primary'];
        const buttons = document.querySelectorAll(buttonSelectors.join(', '));
        buttons.forEach(buttonEl => {
            const text = buttonEl.textContent?.trim();
            if (!text || !/try|credit|confirm|play/i.test(text)) return;
            if (buttonEl.dataset.mamPatched) return;
            buttonEl.dataset.mamPatched = 'true';
            let title = document.title.replace(/[-|–] Audible.*$/, '').trim();
            const ldData = document.querySelector('script[type="application/ld+json"]');
            if (ldData) {
                try {
                    const json = JSON.parse(ldData.textContent);
                    if (json && json['@type'] === 'Audiobook' && json.name) {
                        title = json.name;
                    }
                } catch (_) {}
            }
            let author = '';
            const authorLabel = document.querySelector('.authorLabel');
            if (authorLabel) {
                const authorLink = authorLabel.querySelector('a');
                if (authorLink) {
                    author = authorLink.textContent.trim();
                }
            }
            author = cleanAuthor(author);
            title = cleanTitle(title);
            const searchUrl = getSearchUrl(author, title);
            if (/play/i.test(text)) {
                if (buttonEl.dataset.mamPlayHandled) return;
                buttonEl.dataset.mamPlayHandled = 'true';
                const MAMlink = document.createElement('adbl-button');
                MAMlink.href = searchUrl;
                MAMlink.target = '_blank';
                MAMlink.variant = 'primary';
                MAMlink.style.display = 'flex';
                MAMlink.style.alignItems = 'center';
                MAMlink.style.justifyContent = 'center';
                MAMlink.style.fontWeight = 'bold';
                MAMlink.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    window.open(searchUrl, '_blank');
                });
                const icon = document.createElement('img');
                icon.src = icons.icon1;
                icon.alt = '';
                icon.style.cssText = 'margin-right: 6px; height: 24px; width: auto; vertical-align: middle;';
                const textNode = document.createTextNode('Search MyAnonamouse');
                MAMlink.appendChild(icon);
                MAMlink.appendChild(textNode);
                buttonEl.insertAdjacentElement('afterend', MAMlink);
                return;
            }
            const MAMlink = document.createElement('adbl-button');
            MAMlink.href = searchUrl;
            MAMlink.target = '_blank';
            MAMlink.className = buttonEl.className;
            MAMlink.variant = 'primary';
            const icon = document.createElement('img');
            icon.src = icons.icon1;
            icon.alt = '';
            icon.style.cssText = 'margin-right: 8px; height: 24px; width: auto; vertical-align: middle;';
            const spanText = document.createElement('span');
            spanText.textContent = 'Search MyAnonamouse';
            spanText.style.cssText = 'vertical-align: middle;';
            MAMlink.appendChild(icon);
            MAMlink.appendChild(spanText);
            buttonEl.replaceWith(MAMlink);
        });
    };

    function updateListLinks() {
        if (/\/(pd|ac)\//.test(location.pathname)) return;
        const buttons = document.querySelectorAll('a.bc-button-text[href*="/pd/"], a.bc-button-text[href*="/ac/"], button.bc-button-text[title*=" to cart"]');
        buttons.forEach(button => {
            if (button.dataset.mamPatched) return;
            button.dataset.mamPatched = 'true';
            let titleMatch = button.title?.match(/Add (.*?) to cart/);
            let rawTitle = '';
            if (titleMatch) {
                rawTitle = titleMatch[1];
            } else {
                const hrefMatch = button.href?.match(/\/(pd|ac)\/([^/?#]+)/);
                if (hrefMatch) {
                    rawTitle = hrefMatch[2].replace(/-+/g, ' ').replace(/\bAudiobook\b/i, '').trim();
                } else {
                    return;
                }
            }
            const title = cleanTitle(rawTitle);
            let author = '';
            let node = button.closest('li.bc-list-item');
            while (node && !author) {
                const authorLabel = node.querySelector('.authorLabel');
                if (authorLabel) {
                    const authorLink = authorLabel.querySelector('a');
                    if (authorLink) {
                        author = authorLink.textContent.trim();
                        break;
                    }
                }
                node = node.parentElement?.closest('li.bc-list-item');
            }
            author = cleanAuthor(author);
            const searchUrl = getSearchUrl(author, title);
            const MAMlink = document.createElement('a');
            MAMlink.href = searchUrl;
            MAMlink.target = '_blank';
            MAMlink.className = button.className;
            MAMlink.style.display = 'flex';
            MAMlink.style.alignItems = 'center';
            MAMlink.style.justifyContent = 'center';
            MAMlink.style.fontWeight = 'bold';
            MAMlink.dataset.mamPatched = 'true';
            MAMlink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                window.open(searchUrl, '_blank');
            });
            const icon = document.createElement('img');
            icon.src = icons.icon1;
            icon.alt = '';
            icon.style.cssText = 'margin-right: 6px; height: 24px; width: auto; vertical-align: middle;';
            const text = document.createTextNode('Search MyAnonamouse');
            MAMlink.appendChild(icon);
            MAMlink.appendChild(text);
            button.replaceWith(MAMlink);
            const observer = new MutationObserver(() => {
                if (!MAMlink.textContent.includes('Search MyAnonamouse')) {
                    MAMlink.innerHTML = '';
                    MAMlink.appendChild(icon);
                    MAMlink.appendChild(text);
                }
            });
            observer.observe(MAMlink, {
                childList: true,
                subtree: true,
            });
        });

        const playSpans = document.querySelectorAll('span[id^="adbl-buy-box-play-now-button"]');
        playSpans.forEach(span => {
            if (span.dataset.mamPatched) return;
            const playButton = span.querySelector('button.bc-button-text');
            const label = playButton?.innerText?.trim();
            if (label && /play/i.test(label)) {
                let title = '';
                let author = '';
                let container = span.closest('li.bc-list-item') || span.closest('[class*="productList"]') || document;
                const titleNode = container.querySelector('.bc-list-item-title a, h3 a');
                const authorNode = container.querySelector('.authorLabel a');
                if (titleNode) title = cleanTitle(titleNode.textContent.trim());
                if (authorNode) author = cleanAuthor(authorNode.textContent.trim());
                const searchUrl = getSearchUrl(author, title);
                const MAMlink = document.createElement('a');
                MAMlink.href = searchUrl;
                MAMlink.className = 'bc-button-text';
                MAMlink.target = '_blank';
                MAMlink.dataset.mamPatched = 'true';
                MAMlink.style.alignItems = 'center';
                MAMlink.style.justifyContent = 'center';
                MAMlink.style.fontWeight = 'bold';
                MAMlink.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    window.open(searchUrl, '_blank');
                });
                const icon = document.createElement('img');
                icon.src = icons.icon1;
                icon.alt = '';
                icon.style.cssText = 'margin-right: 6px; height: 24px; width: auto; vertical-align: middle;';
                const text = document.createTextNode('Search MyAnonamouse');
                MAMlink.appendChild(icon);
                MAMlink.appendChild(text);
                const wrapper = document.createElement('span');
                wrapper.className = 'bc-button bc-button-primary bc-button-small';
                wrapper.id = 'searchmambutton';
                wrapper.style.marginTop = '8px';
                wrapper.appendChild(MAMlink);
                span.dataset.mamPatched = 'true';
                span.insertAdjacentElement('afterend', wrapper);
            }
        });

        document.querySelectorAll('span.adbl-library-listen-now-button').forEach(span => {
            if (span.dataset.mamPatched) return;

            const playButton = span.querySelector('button.bc-button-text');
            const label = playButton?.innerText?.trim();

            if (label && /listen now|play/i.test(label)) {
                let title = '';
                let author = '';
                let container = span.closest('.adbl-library-item') || span.parentElement;
                let current = container;
                while (current && (!title || !author)) {
                    const titleNode = current.querySelector('.bc-size-headline3');
                    const authorNode = current.querySelector('.authorLabel a');
                    if (!title && titleNode) title = cleanTitle(titleNode.textContent.trim());
                    if (!author && authorNode) author = cleanAuthor(authorNode.textContent.trim());
                    current = current.parentElement;
                }

                console.log('TITLE:', title);
                console.log('AUTHOR:', author);

                const searchUrl = getSearchUrl(author, title);
                const MAMlink = document.createElement('a');
                MAMlink.href = searchUrl;
                MAMlink.className = 'bc-button-text';
                MAMlink.target = '_blank';
                MAMlink.dataset.mamPatched = 'true';
                MAMlink.style.alignItems = 'center';
                MAMlink.style.justifyContent = 'center';
                MAMlink.style.fontWeight = 'bold';
                MAMlink.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    window.open(searchUrl, '_blank');
                });

                const icon = document.createElement('img');
                icon.src = icons.icon1;
                icon.alt = '';
                icon.style.cssText = 'margin-right: 6px; height: 16px; width: auto; vertical-align: middle;';
                const text = document.createTextNode('MyAnonamouse');
                MAMlink.appendChild(icon);
                MAMlink.appendChild(text);

                const wrapper = document.createElement('span');
                wrapper.className = 'bc-button bc-button-primary bc-button-small';
                wrapper.style.marginTop = '8px';
                wrapper.appendChild(MAMlink);

                span.dataset.mamPatched = 'true';
                span.insertAdjacentElement('afterend', wrapper);
            }
        });
    }

    const runPatch = () => {
        const meta = getTitleAndAuthor();
        if (!meta) return;
        patchAdblButton();
    };

    function observeListArea() {
        const listContainer = document.querySelector('[data-test="productList"]') || document.body;
        const observer = new MutationObserver(() => {
            updateListLinks();
        });
        observer.observe(listContainer, {
            childList: true,
            subtree: true,
        });
    }

    function fullyReady(callback) {
        if (document.readyState === 'complete') {
            setTimeout(callback, 100);
        } else {
            window.addEventListener('load', () => setTimeout(callback, 100));
        }
    }

    fullyReady(() => {
        updateListLinks();
        runPatch();
        observeListArea();
    });
})();