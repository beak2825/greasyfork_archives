// ==UserScript==
// @name            Google Sheets Diff alerts mods & Google Search Link Cleaner
// @namespace       http://tampermonkey.net/
// @version         3.9
// @description     Remove .row-header-wrapper elements on Sheets diffs, modify Google redirect links (including CSE & Search), remove srsltid parameter from links, and decode %3D to = in table text.
// @author          luascfl
// @icon            https://e7.pngegg.com/pngimages/660/350/png-clipart-green-and-white-sheet-icon-google-docs-google-sheets-spreadsheet-g-suite-google-angle-rectangle-thumbnail.png
// @match           https://docs.google.com/spreadsheets/d/*/notify/show*
// @match           https://docs.google.com/spreadsheets/u/*/d/*/revisions/show*
// @match           https://cse.google.com/*
// @match           https://www.google.com/search*
// @home            https://github.com/luascfl/gsheets-diff-alerts-mods
// @supportURL      https://github.com/luascfl/gsheets-diff-alerts-mods/issues
// @license         MIT
// @grant           none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/531380/Google%20Sheets%20Diff%20alerts%20mods%20%20Google%20Search%20Link%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/531380/Google%20Sheets%20Diff%20alerts%20mods%20%20Google%20Search%20Link%20Cleaner.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const INTERVALO = 100; // Interval in milliseconds

    // --- Helper Functions ---

    // Function to check if the current page is a Google Sheets diff/revision page
    function isSheetsPage() {
        const href = window.location.href;
        return href.includes('/spreadsheets/d/') && (href.includes('/notify/show') || href.includes('/revisions/show'));
    }

    // Function to remove row headers (only on Sheets pages)
    function removerElementos() {
        if (isSheetsPage()) {
            document.querySelectorAll('.row-header-wrapper').forEach(el => {
                el.remove();
            });
        }
    }

    // Function to modify links (redirects and srsltid) and decode text
    function modificarLinksETextos() {
        // Process all links on the page for redirects and srsltid
        document.querySelectorAll('a').forEach(link => {
            processarLink(link);
        });

        // Only decode %3D within table bodies (relevant for Sheets/CSE)
        if (isSheetsPage() || window.location.href.includes('cse.google.com')) {
            document.querySelectorAll('tbody a').forEach(link => {
                decodificarEncodingNoLink(link); // Decode %3D in table links
            });
            decodificarTextosEmTbody(); // Decode %3D in table text
        }
    }

    // Function to process each individual link - MODIFIED
    function processarLink(link) {
        let currentHref = link.getAttribute('href'); // Get current href attribute value
        let currentDataHref = link.getAttribute('data-href'); // Get current data-href attribute value
        let hrefChanged = false;
        let dataHrefChanged = false;

        // 1. Handle Google Redirects (google.com/url?q=...)
        if (currentHref && currentHref.includes('google.com/url?')) {
            try {
                const urlObj = new URL(currentHref);
                const params = urlObj.searchParams;
                if (params.has('q')) {
                    currentHref = params.get('q'); // Update currentHref with the real URL
                    hrefChanged = true;
                }
            } catch (e) {
                console.warn('Erro ao processar URL de redirecionamento (href):', link.href, e);
            }
        }
        // Also check data-href for redirects
        if (currentDataHref && currentDataHref.includes('google.com/url?')) {
             try {
                const dataUrlObj = new URL(currentDataHref);
                const dataParams = dataUrlObj.searchParams;
                if (dataParams.has('q')) {
                    currentDataHref = dataParams.get('q'); // Update currentDataHref
                    dataHrefChanged = true;
                }
            } catch (e) {
                console.warn('Erro ao processar URL de redirecionamento (data-href):', link.getAttribute('data-href'), e);
            }
        }

        // 2. Remove srsltid parameter from the potentially updated href
        if (currentHref && (currentHref.includes('?srsltid=') || currentHref.includes('&srsltid='))) {
            try {
                const urlObj = new URL(currentHref);
                if (urlObj.searchParams.has('srsltid')) {
                    urlObj.searchParams.delete('srsltid');
                    currentHref = urlObj.toString();
                    // If the URL ends with '?' after removal, remove it too
                    if (currentHref.endsWith('?')) {
                        currentHref = currentHref.slice(0, -1);
                    }
                    hrefChanged = true;
                }
            } catch (e) {
                console.warn('Erro ao remover srsltid (href):', currentHref, e);
                // Attempt simple string replacement as fallback (less robust)
                const paramIndex = currentHref.indexOf('srsltid=');
                if (paramIndex > 0) {
                    const charBefore = currentHref[paramIndex - 1];
                    if (charBefore === '?' || charBefore === '&') {
                         // Find the end of the parameter (next '&' or end of string)
                         const nextAmp = currentHref.indexOf('&', paramIndex);
                         if (nextAmp !== -1) {
                             currentHref = currentHref.substring(0, paramIndex -1) + currentHref.substring(nextAmp); // Remove '&srsltid=...'
                         } else {
                             currentHref = currentHref.substring(0, paramIndex -1); // Remove '?srsltid=...' or '&srsltid=...' at the end
                         }
                         hrefChanged = true;
                    }
                }
            }
        }
         // Also remove srsltid from the potentially updated data-href
        if (currentDataHref && (currentDataHref.includes('?srsltid=') || currentDataHref.includes('&srsltid='))) {
             try {
                const dataUrlObj = new URL(currentDataHref);
                 if (dataUrlObj.searchParams.has('srsltid')) {
                    dataUrlObj.searchParams.delete('srsltid');
                    currentDataHref = dataUrlObj.toString();
                    // If the URL ends with '?' after removal, remove it too
                    if (currentDataHref.endsWith('?')) {
                        currentDataHref = currentDataHref.slice(0, -1);
                    }
                    dataHrefChanged = true;
                }
            } catch (e) {
                console.warn('Erro ao remover srsltid (data-href):', currentDataHref, e);
                // Add fallback string replacement for data-href if needed, similar to href
            }
        }


        // 3. Apply changes if any occurred
        if (hrefChanged) {
            link.href = currentHref; // Set the final href property
        }
        if (dataHrefChanged) {
            link.setAttribute('data-href', currentDataHref); // Set the final data-href attribute
        }
    }

    // Function specifically for decoding %3D to = in links within tbody
    function decodificarEncodingNoLink(link) {
        // Decode %3D to = in href (both property and attribute)
        let hrefChanged = false;
        let currentHref = link.getAttribute('href');
        if (currentHref && currentHref.includes('%3D')) {
            currentHref = currentHref.replaceAll('%3D', '=');
            hrefChanged = true;
        }
        if (hrefChanged) {
             link.setAttribute('href', currentHref);
             // Also update the property in case the attribute update doesn't reflect immediately
             link.href = currentHref;
        }


        // Decode %3D to = in data-href if it exists
        if (link.hasAttribute('data-href')) {
            const dataHref = link.getAttribute('data-href');
            if (dataHref.includes('%3D')) {
                link.setAttribute('data-href', dataHref.replaceAll('%3D', '='));
            }
        }

        // Decode %3D to = in the link's text content if needed
        if (link.textContent.includes('%3D')) {
            link.textContent = link.textContent.replaceAll('%3D', '=');
        }

        // Check if visible text is correct but href is not (re-check after potential changes)
        if (link.textContent.includes('=') && !link.textContent.includes('%3D')) {
            let hrefAttr = link.getAttribute('href'); // Get potentially updated href
            if (hrefAttr && hrefAttr.includes('%3D')) {
                 const paramsInText = link.textContent.match(/[?&][^?&=]+=[^?&=]+/g);
                 if (paramsInText) {
                     let hrefAtual = hrefAttr;
                     paramsInText.forEach(param => {
                         const [paramName, paramValue] = param.substring(1).split('=');
                         // Look for the encoded version in the href
                         const encodedParam = `${paramName}%3D${encodeURIComponent(paramValue)}`; // More robust encoding check might be needed
                         const encodedParamSimple = `${paramName}%3D${paramValue}`; // Simpler check

                         if (hrefAtual.includes(encodedParamSimple)) {
                            hrefAtual = hrefAtual.replaceAll(encodedParamSimple, `${paramName}=${paramValue}`);
                         } else if (hrefAtual.includes(encodedParam)) {
                              hrefAtual = hrefAtual.replaceAll(encodedParam, `${paramName}=${paramValue}`);
                         }
                     });
                     if (hrefAtual !== hrefAttr) {
                         link.setAttribute('href', hrefAtual);
                         link.href = hrefAtual; // Update property too
                     }
                 }
            }
        }
    }


    // Function to decode %3D in all text elements within tbody
    function decodificarTextosEmTbody() {
        document.querySelectorAll('tbody').forEach(tbody => {
            iterarESusbstituirTextoEmElemento(tbody);
        });
    }

    // Recursive function to iterate over all child nodes and replace text
    function iterarESusbstituirTextoEmElemento(elemento) {
        Array.from(elemento.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.includes('%3D')) {
                    node.textContent = node.textContent.replaceAll('%3D', '=');
                }
            } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'A') { // Don't re-process links here
                // Check common attributes
                 ['value', 'title', 'alt', 'placeholder', 'data-text'].forEach(attr => {
                    let attrValue = null;
                    if (attr === 'value' && node.value && typeof node.value === 'string') {
                         attrValue = node.value;
                         if (attrValue.includes('%3D')) {
                             node.value = attrValue.replaceAll('%3D', '=');
                         }
                    } else if (node.hasAttribute(attr)) {
                        attrValue = node.getAttribute(attr);
                        if (attrValue.includes('%3D')) {
                            node.setAttribute(attr, attrValue.replaceAll('%3D', '='));
                        }
                    }
                });
                // Recurse into children
                iterarESusbstituirTextoEmElemento(node);
            }
        });
    }

    // Function that combines all functionalities
    function processarPagina() {
        removerElementos(); // Runs conditionally inside the function
        modificarLinksETextos(); // Processes links/text based on page type inside
    }

    // --- Execution Logic ---

    // Configuration of the observer to detect DOM changes
    let observer;
    // Use a simple debounce to avoid excessive processing with the observer
    let timeoutId;
    const debouncedProcessarPagina = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(processarPagina, 50); // 50ms delay for debounce
    };

    const callback = (mutationsList, observerInstance) => {
        // Check if any relevant mutation occurred (node addition or attribute changes)
        // This avoids reprocessing the entire page for trivial changes
        let relevantChange = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                 // Check if added nodes contain links or if we are on sheets page where structure might change
                 let addedLinks = false;
                 mutation.addedNodes.forEach(node => {
                     if (node.nodeType === Node.ELEMENT_NODE) {
                         if (node.matches('a') || node.querySelector('a')) {
                             addedLinks = true;
                         }
                         // On sheets page, any table change could be relevant
                         if (isSheetsPage() && (node.matches('tbody, tr, td') || node.querySelector('tbody, tr, td'))) {
                             addedLinks = true; // Treat table changes as relevant for Sheets
                         }
                     }
                 });
                 if(addedLinks){
                    relevantChange = true;
                    break;
                 }
            }
            if (mutation.type === 'attributes' && (mutation.attributeName === 'href' || mutation.attributeName === 'data-href')) {
                relevantChange = true;
                break;
            }
        }
        if (relevantChange) {
           debouncedProcessarPagina();
        }
    };

    // Execute immediately and maintain interval (Interval may be less necessary with Observer)
    (function loop() {
        processarPagina(); // Execute once
        // The loop can be removed or have a longer interval if the Observer is reliable
        setTimeout(loop, INTERVALO * 10); // Increased interval, as the observer should catch most changes
    })();

    // Ensure execution after initial full load
     window.addEventListener('load', () => {
         processarPagina();
         // Start the observer after the initial load and first processing
         if (!observer) {
             observer = new MutationObserver(callback); // Use the callback defined above
             observer.observe(document.documentElement || document.body, {
                 childList: true,
                 subtree: true,
                 attributes: true, // Observe attribute changes too (important for href/data-href)
                 attributeFilter: ['href', 'data-href'] // Focus on relevant attributes
             });
         }
     });

    // DOMNodeInserted listener is legacy and can cause performance issues.
    // The MutationObserver above is the modern and more efficient way.
    // Removed the old listener.

})();
