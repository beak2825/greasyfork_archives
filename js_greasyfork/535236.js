// ==UserScript==
// @name         LWN.net Code Beautifier (v1.0.1)
// @name:zh-CN   LWN.net 代码美化脚本 (v1.0.1)
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Improves code block appearance on lwn.net with syntax highlighting and better diff formatting. Reduced logging.
// @description:zh-CN 使用语法高亮改进 LWN.net 代码块外观。
// @author       Sy03
// @license      MIT
// @match        *://lwn.net/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
// @resource     hljsCSS https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/535236/LWNnet%20Code%20Beautifier%20%28v101%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535236/LWNnet%20Code%20Beautifier%20%28v101%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_VERSION = 'v1.1.29'; // Internal logic version
    GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): Starting...`);

    // --- Global variables and state ---
    let isEnhanced = GM_getValue('lwnBeautifierEnabled', true);
    const originalContentMap = new Map();
    const enhancedStylesId = 'lwn-beautifier-styles-' + Date.now();
    let styleElement = null;

    // --- Check Highlight.js ---
    if (typeof hljs === 'undefined') {
        const errorMsg = `LWN Code Beautifier (${SCRIPT_VERSION}): Highlight.js (hljs) not found!`;
        console.error(errorMsg);
        GM_log(errorMsg);
        return;
    } else {
        GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): Highlight.js loaded.`);
    }

    // --- CSS Definitions ---
    function getEnhancedCss() {
        const themeCss = GM_getResourceText("hljsCSS");
        const customCss = `
            body.lwn-beautifier-active pre {
                background-color: #fafafa !important; color: #383a42 !important;
                border: 1px solid #e8e8e8 !important; padding: 1em !important;
                margin-bottom: 1em !important; overflow-x: auto !important;
                font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
                font-size: 14px !important; line-height: 1.45em !important;
                white-space: pre !important; position: relative;
            }
            body.lwn-beautifier-active pre code.hljs {
                padding: 0; background-color: transparent; border-radius: 0px;
                display: block; overflow-x: visible; white-space: pre !important;
            }
            body.lwn-beautifier-active pre code.hljs span.line { display: block; position: relative; }
            body.lwn-beautifier-active pre code.hljs span.line.is-diff-hunk-line { display: flex; }
            body.lwn-beautifier-active pre code.hljs span.line[data-line-type^="hunk_"]::before,
            body.lwn-beautifier-active pre code.hljs span.line[data-line-type="normal"]::before { content: ""; display: none; }
            body.lwn-beautifier-active pre code.hljs span.line.is-diff-hunk-line .diff-marker-column {
                display: inline-block; width: 1.8em; text-align: center;
                font-weight: bold; flex-shrink: 0; user-select: none; 
            }
            body.lwn-beautifier-active pre code.hljs span.line.is-diff-hunk-line .diff-code-column {
                flex-grow: 1; white-space: pre; display: block; 
            }
            body.lwn-beautifier-active pre code.hljs span.line[data-line-type="hunk_addition"] .diff-marker-column { color: #50a14f; }
            body.lwn-beautifier-active pre code.hljs span.line[data-line-type="hunk_deletion"] .diff-marker-column { color: #e45649; }
            body.lwn-beautifier-active pre code.hljs span.line[data-line-type="hunk_context"] .diff-marker-column { color: #383a42; }
            body.lwn-beautifier-active pre code.hljs span.line[data-line-type="empty_original_in_hunk"] .diff-marker-column { color: #383a42; }
            body.lwn-beautifier-active pre code.hljs span.line.diff-meta-line { color: #6c757d; font-style: italic; }
            body.lwn-beautifier-active pre code.hljs span.line.diff-meta-line::before { content: ""; display: none; }
        `;
        return themeCss + '\n' + customCss;
    }
    
    function decodeEntities(encodedString) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = encodedString;
        return textarea.value;
    }


    // --- Core Beautification Logic ---
    function applyHighlighting() {
        GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): Applying highlighting...`);
        document.body.classList.add('lwn-beautifier-active');

        if (!styleElement || !document.head.contains(styleElement)) {
             styleElement = document.createElement('style');
             styleElement.id = enhancedStylesId;
             document.head.appendChild(styleElement);
        }
         styleElement.textContent = getEnhancedCss();

        const codeBlocks = document.querySelectorAll('pre');
        if (codeBlocks.length === 0) {
            GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): No <pre> elements found.`);
            return;
        }

        codeBlocks.forEach((block, index) => {
            GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): [Block ${index}] Starting processing.`);
            if (block.closest('blockquote.QuoteBody') || block.closest('.GAByline') || block.closest('.CommentTitle') || (block.innerText.length < 10 && !block.innerHTML.includes('<'))) {
                return;
            }

            const storedHTML = originalContentMap.get(block);
            if (block.dataset.lwnBeautifierProcessed === 'true' && storedHTML === block.innerHTML && document.body.classList.contains('lwn-beautifier-active')) {
                 return;
            }
            const initialPreHTML = storedHTML || block.innerHTML;
            if (!originalContentMap.has(block) || storedHTML !== block.innerHTML) {
                originalContentMap.set(block, block.innerHTML);
            }

            try {
                block.innerHTML = initialPreHTML; 

                let codeElement = block.querySelector('code');
                let actualCodeOriginalHTML;

                if (codeElement) {
                    actualCodeOriginalHTML = codeElement.innerHTML;
                } else {
                    actualCodeOriginalHTML = block.innerHTML;
                    codeElement = document.createElement('code');
                }

                if (!block.contains(codeElement) || !codeElement.parentElement) {
                    block.innerHTML = '';
                    block.appendChild(codeElement);
                }

                const originalHtmlLinesForAnalysis = actualCodeOriginalHTML.split('\n');
                const lineDataArray = []; 
                let overallBlockContainsDiffMeta = false;

                for (const lineHtml of originalHtmlLinesForAnalysis) {
                    let textLine = decodeEntities(lineHtml.replace(/<[^>]*>/g, ''));
                    if (/^(diff --git |index |--- a\/|^\+\+\+ b\/|@@ )/.test(textLine)) {
                        overallBlockContainsDiffMeta = true;
                        break;
                    }
                }
                GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): [Block ${index}] Initial scan: overallBlockContainsDiffMeta = ${overallBlockContainsDiffMeta}.`);

                if (!overallBlockContainsDiffMeta) {
                    // --- NON-DIFF BLOCK PROCESSING (v1.1.29 REVISION) ---
                    GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): [Block ${index}] Processing as non-diff.`);
                    
                    const processedLines = []; // Stores { originalHtml: string, textForHighlight: string|null, isLinkLine: boolean }
                    const linesToHighlightTogether = []; // Collects text of non-link lines
                    let lineIndexMap = []; // Maps index in linesToHighlightTogether to index in processedLines

                    originalHtmlLinesForAnalysis.forEach((htmlLine, i) => {
                        const textVersion = decodeEntities(htmlLine.replace(/<[^>]*>/g, '')).trim();
                        const containsLink = /<a\s[^>]*href=/i.test(htmlLine);

                        if (textVersion !== '' || (htmlLine.trim() !== '' && containsLink) ) { // Keep line if it has text or is a link line with some HTML
                            if (containsLink) {
                                processedLines.push({ originalHtml: htmlLine, textForHighlight: null, isLinkLine: true });
                                GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): [Block ${index}][Line ${i}] Non-diff: Link line, preserving HTML: "${htmlLine.substring(0,60)}..."`);
                            } else {
                                // It's a code line (no link, has text content)
                                const cleanTextForHighlight = decodeEntities(htmlLine.replace(/<[^>]*>/g, '')); // Use undecoded for hljs if issues
                                processedLines.push({ originalHtml: htmlLine, textForHighlight: cleanTextForHighlight, isLinkLine: false });
                                lineIndexMap.push(processedLines.length - 1); // Store index in processedLines
                                linesToHighlightTogether.push(cleanTextForHighlight);
                                GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): [Block ${index}][Line ${i}] Non-diff: Code line, text for highlight: "${cleanTextForHighlight.substring(0,60)}..."`);
                            }
                        } else {
                             GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): [Block ${index}][Line ${i}] Non-diff: Empty/Whitespace line skipped: "${htmlLine.substring(0,60)}..."`);
                        }
                    });

                    if (processedLines.length === 0) {
                        codeElement.innerHTML = '';
                    } else {
                        let highlightedCodeLines = [];
                        if (linesToHighlightTogether.length > 0) {
                            const fullCodeToHighlight = linesToHighlightTogether.join('\n');
                            const autoResult = hljs.highlightAuto(fullCodeToHighlight);
                            let language = autoResult.language || 'plaintext';
                            GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): [Block ${index}] Non-diff: Language for code parts: ${language}, Relevance: ${autoResult.relevance}`);
                            const highlightResult = hljs.highlight(fullCodeToHighlight, { language: language, ignoreIllegals: true });
                            highlightedCodeLines = highlightResult.value.split('\n');
                        }
                        
                        let codeHighlightIndex = 0;
                        const finalOutputLines = processedLines.map(lineInfo => {
                            if (lineInfo.isLinkLine) {
                                return `<span class="line" data-line-type="normal">${lineInfo.originalHtml}</span>`;
                            } else if (lineInfo.textForHighlight !== null) { // It's a code line that was part of highlighting
                                const highlightedLine = highlightedCodeLines[codeHighlightIndex] !== undefined ? highlightedCodeLines[codeHighlightIndex] : lineInfo.textForHighlight;
                                codeHighlightIndex++;
                                return `<span class="line" data-line-type="normal">${highlightedLine}</span>`;
                            }
                            return ''; // Should not happen if processedLines only contains valid lines
                        }).filter(line => line !== ''); // Filter out any potential empty strings from logic errors

                        codeElement.innerHTML = finalOutputLines.join('');
                        codeElement.className = 'hljs'; // Apply base hljs class for theme
                        // If a specific language was detected for code parts, we could add it, but it might conflict with link lines.
                        // For simplicity, just 'hljs' is fine for now.
                    }

                } else {
                    // --- DIFF BLOCK PROCESSING ---
                    GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): [Block ${index}] Processing as diff.`);
                    const plainTextLinesForActualDiffHighlighting = [];
                    let hasEncounteredAnyDiffMetaLine = false;
                    let inHunkSection = false;

                    for (let i = 0; i < originalHtmlLinesForAnalysis.length; i++) {
                        const lineHtml = originalHtmlLinesForAnalysis[i];
                        let textLine = decodeEntities(lineHtml.replace(/<[^>]*>/g, ''));
                        GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): [Block ${index}][Line ${i}] Raw HTML: "${lineHtml}", Processed textLine: "${textLine}"`);
                        
                        const trimmedTextLine = textLine.trim();
                        let entry = {
                            originalHtml: lineHtml, type: 'unknown', shouldRender: true,
                            textContentForHighlight: null
                        };

                        if (/^(diff --git |index |--- a\/|^\+\+\+ b\/)/.test(textLine)) {
                            entry.type = 'meta'; hasEncounteredAnyDiffMetaLine = true; inHunkSection = false;
                        } else if (/^@@ /.test(textLine)) {
                            entry.type = 'meta'; hasEncounteredAnyDiffMetaLine = true; inHunkSection = true;
                        } else if (trimmedTextLine === '') {
                            entry.type = 'empty_original_in_hunk';
                            entry.shouldRender = inHunkSection; 
                            if (inHunkSection) {
                                entry.textContentForHighlight = ''; 
                                plainTextLinesForActualDiffHighlighting.push('');
                            }
                        } else if (hasEncounteredAnyDiffMetaLine && inHunkSection) {
                            const diffMatch = textLine.match(/^([ \t]*)([\+\-])( ?)(.*)/);
                            let contentForHighlight; 

                            if (diffMatch) { 
                                entry.type = diffMatch[2] === '+' ? 'hunk_addition' : 'hunk_deletion';
                                let actualContentAfterMarker = diffMatch[4];
                                
                                if (actualContentAfterMarker.trim() === '' && (i + 1) < originalHtmlLinesForAnalysis.length) {
                                    const nextLineHtml = originalHtmlLinesForAnalysis[i+1];
                                    let nextTextLine = decodeEntities(nextLineHtml.replace(/<[^>]*>/g, ''));
                                    if (nextTextLine.trim() !== '' && !/^(diff --git |index |--- a\/|^\+\+\+ b\/|@@ |[\+\-])/.test(nextTextLine)) {
                                        GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): [Block ${index}][Line ${i}] Merging with next line: "${nextTextLine}"`);
                                        actualContentAfterMarker = nextTextLine;
                                        entry.originalHtml += '\n' + nextLineHtml; 
                                        i++; 
                                    }
                                }
                                contentForHighlight = diffMatch[1] + actualContentAfterMarker;

                                if (actualContentAfterMarker.trim() === '') { 
                                    entry.shouldRender = true; 
                                    entry.textContentForHighlight = diffMatch[1]; 
                                    plainTextLinesForActualDiffHighlighting.push(diffMatch[1]); 
                                } else {
                                    const commentLineMatch = contentForHighlight.match(/^(\s*)(\*.*)/); 
                                    if (commentLineMatch) {
                                        contentForHighlight = commentLineMatch[2]; 
                                    }
                                    entry.textContentForHighlight = contentForHighlight;
                                    plainTextLinesForActualDiffHighlighting.push(contentForHighlight);
                                }
                            } else { 
                                entry.type = 'hunk_context';
                                contentForHighlight = textLine; 
                                const commentLineMatch = contentForHighlight.match(/^(\s*)(\*.*)/); 
                                if (commentLineMatch) {
                                    contentForHighlight = commentLineMatch[2]; 
                                }
                                entry.textContentForHighlight = contentForHighlight;
                                plainTextLinesForActualDiffHighlighting.push(contentForHighlight);
                            }
                        } else if (hasEncounteredAnyDiffMetaLine && !inHunkSection) {
                            entry.type = 'verbatim_inter_hunk';
                        } else {
                            entry.type = 'verbatim_preamble';
                        }
                        lineDataArray.push(entry);
                    }

                    let highlightedHunkContentLines = [];
                    if (plainTextLinesForActualDiffHighlighting.length > 0) {
                        const textToHighlight = plainTextLinesForActualDiffHighlighting.join('\n');
                        const highlightResult = hljs.highlight(textToHighlight, { language: 'c', ignoreIllegals: true });
                        highlightedHunkContentLines = highlightResult.value.split('\n');
                        if (plainTextLinesForActualDiffHighlighting.length !== highlightedHunkContentLines.length) {
                            GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): [Block ${index}] Diff highlight line count mismatch! Fallback.`);
                            codeElement.innerHTML = actualCodeOriginalHTML; codeElement.className = 'language-c hljs';
                            hljs.highlightElement(codeElement);
                            codeElement.innerHTML = codeElement.innerHTML.split('\n')
                                .filter(l => l.trim() !== '').map(l => `<span class="line">${l || ''}</span>`).join('');
                            block.dataset.lwnBeautifierProcessed = 'true';
                            if (!block.classList.contains('hljs')) block.classList.add('hljs');
                            if (codeElement && !codeElement.classList.contains('hljs')) codeElement.classList.add('hljs');
                            return;
                        }
                    }

                    const finalHtmlLines = [];
                    let highlightIndex = 0;
                    lineDataArray.forEach(data => {
                        if (!data.shouldRender) {
                            return;
                        }
                        let lineOutput = '';
                        switch (data.type) {
                            case 'meta':
                                lineOutput = `<span class="line diff-meta-line">${data.originalHtml || ''}</span>`;
                                break;
                            case 'hunk_addition':
                            case 'hunk_deletion':
                            case 'hunk_context':
                            case 'empty_original_in_hunk': 
                                const markerText = data.type === 'hunk_addition' ? '+' : 
                                                 (data.type === 'hunk_deletion' ? '-' : '&nbsp;');
                                const codeContent = data.textContentForHighlight !== null && highlightedHunkContentLines[highlightIndex] !== undefined
                                                  ? highlightedHunkContentLines[highlightIndex]
                                                  : (data.textContentForHighlight || ''); 
                                lineOutput = `<span class="line is-diff-hunk-line" data-line-type="${data.type === 'empty_original_in_hunk' ? 'hunk_context' : data.type}">` + 
                                             `<span class="diff-marker-column">${markerText}</span>` +
                                             `<span class="diff-code-column">${codeContent}</span>` +
                                             `</span>`;
                                if (data.textContentForHighlight !== null) { 
                                    highlightIndex++;
                                }
                                break;
                            case 'verbatim_preamble':
                            case 'verbatim_inter_hunk':
                                lineOutput = `<span class="line" data-line-type="normal">${data.originalHtml || ''}</span>`;
                                break;
                            default:
                                lineOutput = `<span class="line" data-line-type="normal">${data.originalHtml || ''}</span>`;
                        }
                        if (lineOutput) finalHtmlLines.push(lineOutput);
                    });
                    codeElement.innerHTML = finalHtmlLines.join('');
                    GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): [Block ${index}] Diff processing complete. Generated ${finalHtmlLines.length} lines.`);
                }

                block.dataset.lwnBeautifierProcessed = 'true';
                if (!block.classList.contains('hljs')) block.classList.add('hljs');
                if (codeElement && !codeElement.classList.contains('hljs')) codeElement.classList.add('hljs');

            } catch (e) {
                 GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): [Block ${index}] Error during highlighting:`, e, block);
                 console.error(`LWN Code Beautifier (${SCRIPT_VERSION}): [Block ${index}] Error during highlighting:`, e, block);
                 if (originalContentMap.has(block)) {
                     block.innerHTML = originalContentMap.get(block);
                 }
                 delete block.dataset.lwnBeautifierProcessed;
            }
        });
        GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): Highlighting finished.`);
    }

    function restoreOriginal() {
        GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): Restoring original state...`);
        document.body.classList.remove('lwn-beautifier-active');
        originalContentMap.forEach((originalPreHTML, block) => {
            if (document.body.contains(block)) {
                block.innerHTML = originalPreHTML;
                block.classList.remove('hljs');
                delete block.dataset.lwnBeautifierProcessed;
            } else {
                originalContentMap.delete(block);
            }
        });
    }

    function createToggleButton() {
        let button = document.getElementById('lwn-beautifier-toggle');
        if (button) {
             button.textContent = isEnhanced ? 'Restore Original' : 'Enable Beautifier';
             return;
        }
        button = document.createElement('button');
        button.id = 'lwn-beautifier-toggle';
        button.textContent = isEnhanced ? 'Restore Original' : 'Enable Beautifier';
        Object.assign(button.style, {
            position: 'fixed', bottom: '15px', right: '15px', zIndex: '9999',
            padding: '8px 12px', backgroundColor: '#007bff', color: 'white',
            border: 'none', borderRadius: '4px', cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)', fontSize: '13px'
        });
        button.addEventListener('click', () => {
            isEnhanced = !isEnhanced;
            GM_setValue('lwnBeautifierEnabled', isEnhanced);
            button.textContent = isEnhanced ? 'Restore Original' : 'Enable Beautifier';
            if (isEnhanced) {
                 if (styleElement) styleElement.textContent = getEnhancedCss();
                 document.body.classList.add('lwn-beautifier-active');
                 applyHighlighting();
            } else {
                restoreOriginal();
            }
        });
        document.body.appendChild(button);
    }

    function initialize() {
        GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): Initializing...`);
        styleElement = document.getElementById(enhancedStylesId);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = enhancedStylesId;
            document.head.appendChild(styleElement);
        }
        if (isEnhanced) {
             styleElement.textContent = getEnhancedCss();
             document.body.classList.add('lwn-beautifier-active');
             setTimeout(applyHighlighting, 250); 
        } else {
             styleElement.textContent = '';
             document.body.classList.remove('lwn-beautifier-active');
             GM_log(`LWN Code Beautifier (${SCRIPT_VERSION}): Beautifier currently disabled.`);
        }
        createToggleButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
