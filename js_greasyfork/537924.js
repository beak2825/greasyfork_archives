// ==UserScript==
// @name         F-List / Ascendant
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds [replace], recursive BBCode, lists, entity decoding, etc.
// @author       Your Name
// @match        https://www.f-list.net/c/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537924/F-List%20%20Ascendant.user.js
// @updateURL https://update.greasyfork.org/scripts/537924/F-List%20%20Ascendant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function decodeHTMLEntitiesRecursive(text, maxDepth = 5) {
        if (typeof text !== 'string' || maxDepth <= 0) return text;
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        let decoded = textarea.value;
        if (decoded !== text) {
            return decodeHTMLEntitiesRecursive(decoded, maxDepth - 1);
        }
        return decoded;
    }

    function convertCustomBBCodeToHTML(bbcodeString) {
        let processedHtml = String(bbcodeString); // Ensure it's a string

        // Order of processing is important: simpler/content tags first, then containers.
        // Decode entities from the entire incoming string once, as it might be serialized HTML.
        // This is a bit broad. A more targeted decode happens when extracting content from regex.
        // processedHtml = decodeHTMLEntitiesRecursive(processedHtml);


        // --- Process Tables ---
        processedHtml = processedHtml.replace(/\[table class="([^"]+)"\]/gi, '<table class="$1">');
        processedHtml = processedHtml.replace(/\[table\]/gi, '<table>');
        processedHtml = processedHtml.replace(/\[\/table\]/gi, '</table>');
        processedHtml = processedHtml.replace(/\[tr\]/gi, '<tr>');
        processedHtml = processedHtml.replace(/\[\/tr\]/gi, '</tr>');
        processedHtml = processedHtml.replace(/\[th\]/gi, '<th>');
        processedHtml = processedHtml.replace(/\[\/th\]/gi, '</th>');
        processedHtml = processedHtml.replace(/\[td\]/gi, '<td>');
        processedHtml = processedHtml.replace(/\[\/td\]/gi, '</td>');

        // --- Process Lists (Basic) ---
        processedHtml = processedHtml.replace(/\[list\]/gi, '<ul>');
        processedHtml = processedHtml.replace(/\[\/list\]/gi, '</ul>');
        processedHtml = processedHtml.replace(/\[\*\]\s*([\s\S]*?)(?=\r?\n\s*\[\*\]|\r?\n\s*\[\/list\]|\[\/list\]|$)/gi, (match, itemContent) => {
            // Recursively process content of list items
            let decodedItemContent = decodeHTMLEntitiesRecursive(itemContent.trim());
            let processedItemHtml = convertCustomBBCodeToHTML(decodedItemContent);
            return `<li>${processedItemHtml}</li>`;
        });

        // --- Process Columns ---
        processedHtml = processedHtml.replace(/\[columns\]([\s\S]*?)\[\/columns\]/gi, (match, columnsContent) => {
            let innerColsHtml = columnsContent.replace(/\[col\]([\s\S]*?)\[\/col\]/gi, (colMatch, colBbcodeContent) => {
                let decodedColBbcodeContent = decodeHTMLEntitiesRecursive(colBbcodeContent.trim());
                let processedColHtml = convertCustomBBCodeToHTML(decodedColBbcodeContent);
                return `<div style="flex: 1; padding: 10px;">${processedColHtml}</div>`;
            });
            return `<div style="display: flex; width: 100%; gap: 15px;">${innerColsHtml}</div>`;
        });

        // --- Process Custom Collapses (BBCode to HTML) ---
        processedHtml = processedHtml.replace(/\[collapse(?:=([^\]]*))?\]([\s\S]*?)\[\/collapse\]/gi, (match, titleFromRegex, bbcodeContentWithinCollapse) => {
            let rawTitleAttribute = titleFromRegex;
            let displayTitle;
            if (typeof rawTitleAttribute === 'string') {
                displayTitle = decodeHTMLEntitiesRecursive(rawTitleAttribute);
            } else {
                displayTitle = 'Details';
            }
            const tempTitleDiv = document.createElement('div');
            tempTitleDiv.textContent = displayTitle;
            const sanitizedTitleForHeader = tempTitleDiv.innerHTML;

            let decodedBbcodeContent = decodeHTMLEntitiesRecursive(bbcodeContentWithinCollapse.trim());
            let processedContentHtml = convertCustomBBCodeToHTML(decodedBbcodeContent);

            return `<div class="tm-custom-collapse">
                        <div class="tm-custom-collapse-header">${sanitizedTitleForHeader}</div>
                        <div class="tm-custom-collapse-content" style="display: none;">${processedContentHtml}</div>
                    </div>`;
        });
        return processedHtml;
    }

    function attachCustomCollapseEventListeners(rootElement = document) {
        // (No changes)
        rootElement.querySelectorAll('.tm-custom-collapse-header:not(.tm-listener-attached)').forEach(header => {
            header.classList.add('tm-listener-attached');
            header.style.cursor = 'pointer';
            header.addEventListener('click', function(event) {
                event.stopPropagation(); event.preventDefault();
                const contentElement = this.nextElementSibling;
                if (contentElement && contentElement.classList.contains('tm-custom-collapse-content')) {
                    const isVisible = contentElement.style.display !== 'none';
                    contentElement.style.display = isVisible ? 'none' : 'block';
                    this.classList.toggle('tm-collapse-active', !isVisible);
                }
            });
        });
    }

    function processProfileContent() {
        const contentAreas = document.querySelectorAll('#tabs-1 .FormattedBlock, #tabs-2 .FormattedBlock');

        contentAreas.forEach(area => {
            // Clear old listeners before reprocessing an area
            area.querySelectorAll('.tm-listener-attached').forEach(el => {
                // A more robust way to remove listeners if we re-create elements often,
                // but for now, just removing the flag is part of the strategy.
                // If elements are fully replaced by area.innerHTML, listeners are gone anyway.
                el.classList.remove('tm-listener-attached');
            });

            let currentHtmlContent = area.innerHTML;

            // STEP 0: Handle [replace] functionality FIRST
            const replaceRegex = /\[replace\]([\s\S]*?)\[\/replace\]/i; // Case-insensitive
            const replaceMatch = currentHtmlContent.match(replaceRegex);

            if (replaceMatch && replaceMatch[1]) {
                // If [replace] is found, its content becomes the new base HTML for this area.
                // All other original content of the area is discarded.
                currentHtmlContent = replaceMatch[1].trim();
                // The [replace] tags themselves are removed by this assignment.
                // Note: The [replace] block itself is consumed and doesn't appear in the output.
            }
            // From now on, all operations use 'currentHtmlContent' which is either original or replaced.

            // --- Convert F-List Native Collapses to BBCode Text Nodes (within currentHtmlContent) ---
            // This step needs to operate on a DOM structure if we are to reliably get innerHTML of F-List blocks.
            // So, we'll parse currentHtmlContent, do the conversion, then serialize back.
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = currentHtmlContent;

            const convertFListCollapseToBBCodeNode = (fListHeader) => {
                // (No changes to this helper from v0.9)
                const fListBlock = fListHeader.querySelector(':scope > .CollapseBlock');
                const fListTitleSpan = fListHeader.querySelector(':scope > .CollapseHeaderText > span');
                if (fListBlock && fListTitleSpan) {
                    let rawTitle = fListTitleSpan.textContent || "";
                    let titleForBBCode;
                    if (rawTitle === " ") { titleForBBCode = " "; }
                    else if (rawTitle.trim() === "") { titleForBBCode = ""; }
                    else { titleForBBCode = rawTitle.trim(); }
                    const content = fListBlock.innerHTML;
                    let bbCodeString;
                    if (titleForBBCode === " ") { bbCodeString = `[collapse=${titleForBBCode}]`; }
                    else if (titleForBBCode) { bbCodeString = `[collapse=${titleForBBCode}]`; }
                    else { bbCodeString = `[collapse]`; }
                    bbCodeString += content + '[/collapse]';
                    return document.createTextNode(bbCodeString);
                }
                return null;
            };

            tempDiv.querySelectorAll('.CollapseHeader:not(.tm-custom-collapse-header)').forEach(fListHeader => {
                if (fListHeader.closest('.tm-custom-collapse')) return; // Avoid re-processing tm-custom-collapse internals
                const bbNode = convertFListCollapseToBBCodeNode(fListHeader);
                if (bbNode) fListHeader.replaceWith(bbNode);
            });
            currentHtmlContent = tempDiv.innerHTML; // Get back the string with F-List collapses as BBCode

            // --- Main BBCode string to Final HTML conversion ---
            const processedAreaHtml = convertCustomBBCodeToHTML(currentHtmlContent);

            // Set the fully processed HTML to the area.
            // This single assignment replaces the entire content of 'area'.
            if (area.innerHTML !== processedAreaHtml) {
                area.innerHTML = processedAreaHtml;
            }

            // --- Iterative DOM pass for F-List collapses newly rendered INSIDE tm-custom-collapse content ---
            // This part *must* run after area.innerHTML is set with processedAreaHtml,
            // because it operates on the live DOM structure created by the browser from processedAreaHtml.
            let iterations = 0; const maxIterations = 15;
            while (iterations < maxIterations) {
                // (No changes from v0.9 for this F-List native nested collapse handling, but it operates on 'area' now)
                iterations++; let workDoneThisIteration = false;
                const nestedFListHeaders = area.querySelectorAll('.tm-custom-collapse-content .CollapseHeader:not(.tm-custom-collapse-header)');
                if (nestedFListHeaders.length === 0) break;
                nestedFListHeaders.forEach(fListHeader => {
                    const fListBlock = fListHeader.querySelector(':scope > .CollapseBlock');
                    const fListTitleSpan = fListHeader.querySelector(':scope > .CollapseHeaderText > span');
                    if (fListBlock && fListTitleSpan) {
                        let rawTitle = fListTitleSpan.textContent || "";
                        let actualTitleText;
                        if (rawTitle === " ") { actualTitleText = " "; }
                        else if (rawTitle.trim() === "") { actualTitleText = 'Details'; }
                        else { actualTitleText = rawTitle.trim(); }
                        const content = fListBlock.innerHTML;
                        const tempTitleDivForHeader = document.createElement('div');
                        tempTitleDivForHeader.textContent = actualTitleText;
                        const sanitizedTitle = tempTitleDivForHeader.innerHTML;
                        const newTmCollapseHTML = `
                            <div class="tm-custom-collapse">
                                <div class="tm-custom-collapse-header">${sanitizedTitle}</div>
                                <div class="tm-custom-collapse-content" style="display: none;">${content}</div>
                            </div>`;
                        const tempNewCollapseContainer = document.createElement('div');
                        tempNewCollapseContainer.innerHTML = newTmCollapseHTML;
                        const newTmCollapseElement = tempNewCollapseContainer.firstElementChild;
                        if (newTmCollapseElement) {
                            fListHeader.replaceWith(newTmCollapseElement);
                            workDoneThisIteration = true;
                        } else { fListHeader.remove(); }
                    } else { fListHeader.remove(); }
                });
                if (!workDoneThisIteration) break;
            }
            if (iterations === maxIterations && area.querySelectorAll('.tm-custom-collapse-content .CollapseHeader:not(.tm-custom-collapse-header)').length > 0) {
                console.warn("F-List Enhanced BBCode: Max iterations for nested F-List collapses.");
            }

            // --- Remove "Quote:" text ---
            area.querySelectorAll('.QuoteHeader').forEach(quoteHeader => {
                if (quoteHeader.textContent.trim() === "Quote:") {
                    quoteHeader.textContent = '';
                }
            });

            // --- Attach event listeners to all custom collapses in the area ---
            attachCustomCollapseEventListeners(area);
        });
    }

    // --- Script Execution & Observer --- (No changes from v0.9)
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        processProfileContent();
    } else {
        document.addEventListener('DOMContentLoaded', processProfileContent);
    }
    const profileContentContainer = document.getElementById('Content');
    if (profileContentContainer) {
        const observer = new MutationObserver((mutationsList) => {
            let needsProcessing = false;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && (node.matches('.FormattedBlock, .ui-tabs-panel') || node.querySelector('.FormattedBlock'))) {
                            needsProcessing = true;
                        }
                    });
                } else if (mutation.type === 'attributes' && (mutation.target.matches('.ui-tabs-panel') || mutation.target.matches('.FormattedBlock'))) {
                    needsProcessing = true;
                }
                if (needsProcessing) break;
            }
            if (needsProcessing) { processProfileContent(); }
        });
        observer.observe(profileContentContainer, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    }

    // --- Stylesheet --- (No changes from v0.9)
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        .FormattedBlock table { border-collapse: collapse; width: 90%; margin: 15px auto; border: 1px solid #555; }
        .FormattedBlock th, .FormattedBlock td { border: 1px solid #444; padding: 8px; text-align: left; }
        .FormattedBlock th { background-color: #333; color: #eee; }
        .tm-custom-collapse { margin: 10px 0; border: 1px solid #4a4a4a; border-radius: 4px; overflow: hidden; background-color: #2c2c2c; }
        .tm-custom-collapse-header { background-color: #3a3a3a; color: #eee; padding: 10px 15px; cursor: pointer; user-select: none; transition: background-color 0.2s ease; }
        .tm-custom-collapse-header:hover { background-color: #454545; }
        .tm-custom-collapse-header.tm-collapse-active { background-color: #505050; }
        .tm-custom-collapse-content { padding: 15px; border-top: 1px solid #4a4a4a; color: #ddd; background-color: #2f2f2f; }
    `;
    document.head.appendChild(styleSheet);

})();