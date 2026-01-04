// ==UserScript==
// @name         DownArchive Link Extractor
// @namespace   https://greasyfork.org/users/30331-setcher
// @version      0.61
// @description  Extract links from DownArchive and copy them to clipboard
// @author       Setcher
// @match        *://downarchive.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      rg.to
// @connect      rapidgator.net
// @downloadURL https://update.greasyfork.org/scripts/528354/DownArchive%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/528354/DownArchive%20Link%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createCopyButton(container, text, links, placeholder) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.marginTop = '10px';
        button.style.marginBottom = '10px';
        button.style.marginRight = '10px';
        button.onclick = function() {
            const clipboardText = links.join('\n');
            GM_setClipboard(clipboardText);
            alert(`Copied ${links.length} links to clipboard!`);
        };
        container.replaceChild(button, placeholder);
    }

    function createPlaceholder(domain, isVisible = true) {
        const placeholder = document.createElement('button');
        placeholder.disabled = true;
        placeholder.id = domain
        placeholder.innerText = `Loading ${domain} links...`;
        placeholder.style.display = isVisible ? 'block' : 'none'
        placeholder.style.marginTop = '10px';
        placeholder.style.marginBottom = '10px';
        placeholder.style.marginRight = '10px';
        return placeholder;
    }

    function extractRGLinks(folderUrl, container, placeholder) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: folderUrl,
            onload: function(response) {
                const source = response.responseText

                if (!source.includes('/filemanager/file_small.png')) {
                    document.getElementById(placeholder.id).remove()
                    return
                }

                const doc = new DOMParser().parseFromString(source, 'text/html');
                const fileLinks = Array.from(doc.querySelectorAll('a[href^="/file/"]')).map(link => "https://rapidgator.net" + link.getAttribute('href'));

                if (fileLinks.length == 0) {
                    document.getElementById(placeholder.id).remove()
                    return
                }

                let totalSize = 0;
                const sizeElements = doc.querySelectorAll('.td-for-select');
                sizeElements.forEach(el => {
                    const match = el.innerText.match(/([0-9.]+)\s*(MB|GB)/i);
                    if (match) {
                        let size = parseFloat(match[1]);
                        if (match[2].toUpperCase() === 'GB') {
                            size *= 1024;
                        }
                        totalSize += size;
                    }
                });
                totalSize = Math.round(totalSize);

                createCopyButton(container, `Copy all ${fileLinks.length} rapidgator.net links (${totalSize} MB)`, fileLinks, placeholder);
            }
        });
    }

    function processQuoteDiv(quoteDiv) {
        const links = Array.from(quoteDiv.querySelectorAll('a'));

        let rgLink = null;
        const otherLinks = {
            'rapidgator.net': [],
            'uploadgig.com': [],
            'nitroflare.com': [],
            'nitro.download': [],
            'filextras.com': []
        };

        const placeholders = [];
        const rgLinks = []

        links.forEach(link => {
            const href = link.href;
            if (href.startsWith('https://rg.to/folder/')) {
                rgLinks.push(href)
            } else if (href.includes('rapidgator.net/file/')) {
                otherLinks['rapidgator.net'].push(href);
            } else if (href.includes('uploadgig.com/file/')) {
                otherLinks['uploadgig.com'].push(href);
            } else if (href.includes('nitroflare.com/')) {
                otherLinks['nitroflare.com'].push(href);
            } else if (href.includes('nitro.download/')) {
                otherLinks['nitro.download'].push(href);
            } else if (href.includes('filextras.com/')) {
                otherLinks['filextras.com'].push(href);
            }
        });

        for (const domain in otherLinks) {
            if (otherLinks[domain].length > 0) {
                const placeholder = createPlaceholder(domain);
                quoteDiv.appendChild(placeholder);
                placeholders.push({ domain, placeholder, links: otherLinks[domain] });
            }
        }

        placeholders.forEach(({ domain, placeholder, links }) => {
            createCopyButton(quoteDiv, `Copy all ${links.length} ${domain} links`, links, placeholder);
        });

        for (let i = 0; i <= rgLinks.length-1 ; i++) {
            const rgPlaceholder = createPlaceholder('rg.to_'+i.toString(), false);
            const rgLink = rgLinks[i]
            quoteDiv.appendChild(rgPlaceholder);
            window.rgLinksToProcess = window.rgLinksToProcess || [];
            window.rgLinksToProcess.push({ rgLink, quoteDiv, rgPlaceholder });
        }
    }

    function processRGFolders() {
        if (window.rgLinksToProcess && window.rgLinksToProcess.length > 0) {
            window.rgLinksToProcess.forEach(({ rgLink, quoteDiv, rgPlaceholder }) => {
                extractRGLinks(rgLink, quoteDiv, rgPlaceholder);
            });
            window.rgLinksToProcess = [];
        }
    }

    window.addEventListener('load', function() {
        const quoteDivs = document.querySelectorAll('div.quote');
        quoteDivs.forEach(quoteDiv => {
            processQuoteDiv(quoteDiv);
        });
        processRGFolders();
    });
})();
