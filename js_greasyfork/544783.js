// ==UserScript==
// @name         Gemini Advanced Renderer (HTML, Mermaid, Pollinations)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Merges two scripts: 1) Renders HTML/Mermaid/ECharts code blocks with advanced syntax correction. 2) Replaces pollinations.ai image links with the actual rendered images.
// @author       YourName (Refactored by AI & Combined)
// @match        https://gemini.google.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @connect      kroki.io
// @connect      cdn.jsdelivr.net
// @connect      image.pollinations.ai
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544783/Gemini%20Advanced%20Renderer%20%28HTML%2C%20Mermaid%2C%20Pollinations%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544783/Gemini%20Advanced%20Renderer%20%28HTML%2C%20Mermaid%2C%20Pollinations%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DEBUG = true;

    // --- Styles ---
    const styles = `
        .render-preview-button{margin-left:10px;cursor:pointer;padding:4px 8px;background-color:#1a73e8;color:#fff;border:none;border-radius:4px;font-size:12px;font-weight:500;opacity:.9;transition:opacity .3s,background-color .3s}.render-preview-button:hover:not(:disabled){opacity:1;background-color:#185abc}.render-preview-button:disabled{background-color:#9e9e9e;cursor:not-allowed}.mermaid-button{background-color:#9c27b0}.mermaid-button:hover:not(:disabled){background-color:#7b1fa2}.echarts-button{background-color:#4caf50}.echarts-button:hover:not(:disabled){background-color:#45a049}.preview-container{width:100%;margin-top:10px;border:1px solid #dee2e6;border-radius:8px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,.05);background-color:#fff;position:relative}.preview-iframe{width:100%;height:600px;border:none;display:block}.preview-controls{padding:8px;background-color:#f5f5f5;border-bottom:1px solid #dee2e6;font-size:12px;display:flex;gap:10px;align-items:center;color:#333}.control-button{padding:4px 8px;background:#6c757d;color:#fff;border:none;border-radius:3px;cursor:pointer;font-size:11px}.control-button:hover{background:#5a6268}.mermaid-preview-container{width:100%;margin-top:10px;border:1px solid #dee2e6;border-radius:8px;padding:20px;background-color:#fff;box-shadow:0 2px 4px rgba(0,0,0,.05);min-height:200px;max-height:600px;overflow:auto;text-align:center;position:relative}.preview-overlay{flex-grow:1;text-align:left}.preview-error{padding:15px;color:#d32f2f;background:#ffeaea;border-radius:4px;font-family:monospace;white-space:pre-wrap;text-align:left;font-size:13px}.mermaid-success-badge{position:absolute;top:5px;right:5px;background:#4caf50;color:#fff;padding:2px 8px;border-radius:3px;font-size:12px}.mermaid-warning-badge{position:absolute;top:5px;left:5px;background:#ff9800;color:#fff;padding:2px 8px;border-radius:3px;font-size:12px;cursor:help}
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);


    // --- Trusted Types & Utilities ---
    let trustedPolicy;
    function getTrustedPolicy() {
        if (trustedPolicy) return trustedPolicy;
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            try {
                trustedPolicy = window.trustedTypes.createPolicy('gemini-advanced-renderer-policy-v1', {
                    createHTML: (string) => string, createScript: (string) => string,
                });
            } catch (e) { trustedPolicy = window.trustedTypes.getPolicy('gemini-advanced-renderer-policy-v1'); }
        }
        return trustedPolicy;
    }
    function safeSetHTML(element, html) {
        const policy = getTrustedPolicy();
        element.innerHTML = policy ? policy.createHTML(html) : html;
    }
    function fetchResource(url, method = 'GET', data = null, responseType = 'text') {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method, url, data, responseType,
                headers: data ? { 'Content-Type': 'text/plain', 'Accept': 'image/svg+xml' } : {},
                onload: (res) => (res.status >= 200 && res.status < 300) ? resolve(responseType === 'blob' ? res.response : res.responseText) : reject(new Error(`Request failed: ${res.status}\n${res.responseText}`)),
                onerror: (err) => reject(new Error(`Network error: ${err.toString()}`)),
                ontimeout: () => reject(new Error(`Request timed out`))
            });
        });
    }

    // --- HTML Rendering Engine ---
    async function createSelfContainedHTML(html, updateStatus) {
        updateStatus('Parsing HTML...');
        const parser = new DOMParser(); const policy = getTrustedPolicy();
        const trustedHtmlInput = policy ? policy.createHTML(html) : html;
        const doc = parser.parseFromString(trustedHtmlInput, 'text/html');
        doc.querySelectorAll('script[src], link[rel="stylesheet"][href]').forEach(el => { el.dataset.originalUrl = new URL(el.src || el.href, window.location.href).href; });
        const resources = Array.from(doc.querySelectorAll('script[src], link[rel="stylesheet"][href]'));
        updateStatus(`Found ${resources.length} external resource(s).`);
        for (const res of resources) {
            const url = res.dataset.originalUrl;
            try {
                updateStatus(`Downloading: ${url.split('/').pop()}`);
                const content = await fetchResource(url, 'GET', null, 'text');
                if (res.tagName === 'SCRIPT') {
                    const newScript = doc.createElement('script');
                    newScript.textContent = policy ? policy.createScript(content) : content;
                    res.parentNode.replaceChild(newScript, res);
                } else {
                    const newStyle = doc.createElement('style');
                    newStyle.textContent = content;
                    res.parentNode.replaceChild(newStyle, res);
                }
            } catch (error) {
                console.error(error);
                if (res.tagName === 'SCRIPT') {
                    const errorScript = doc.createElement('script');
                    const errorContent = `console.error("Failed to load script: ${url}. ${error.message.replace(/"/g, '\\"')}");`;
                    errorScript.textContent = policy ? policy.createScript(errorContent) : errorContent;
                    res.parentNode.replaceChild(errorScript, res);
                }
            }
        }
        updateStatus('All resources embedded.');
        return `<!DOCTYPE html><html><head>${doc.head.innerHTML}</head><body>${doc.body.innerHTML}</body></html>`;
    }
    async function renderHTML(content, codeBlockContainer) {
        const previewContainer = document.createElement('div'); previewContainer.className = 'preview-container';
        const controls = document.createElement('div'); controls.className = 'preview-controls';
        const openInTabBtn = document.createElement('button'); openInTabBtn.className = 'control-button'; openInTabBtn.textContent = 'Open in New Tab'; openInTabBtn.disabled = true;
        const statusContainer = document.createElement('div'); statusContainer.className = 'preview-overlay'; statusContainer.textContent = 'Initializing...';
        controls.appendChild(statusContainer); controls.appendChild(openInTabBtn);
        const iframe = document.createElement('iframe'); iframe.className = 'preview-iframe'; iframe.removeAttribute('sandbox');
        previewContainer.appendChild(controls); previewContainer.appendChild(iframe);
        codeBlockContainer.parentNode.insertBefore(previewContainer, codeBlockContainer.nextSibling);
        try {
            const selfContainedHTML = await createSelfContainedHTML(content, (msg) => { statusContainer.textContent = msg; });
            const blob = new Blob([selfContainedHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            previewContainer.dataset.blobUrl = url;
            iframe.onload = () => { statusContainer.textContent = 'Render successful! 🎉'; };
            iframe.onerror = () => { statusContainer.textContent = 'Error loading content in iframe.'; statusContainer.style.color = '#d32f2f'; };
            iframe.src = url;
            openInTabBtn.onclick = () => GM_openInTab(url, { active: true });
            openInTabBtn.disabled = false;
        } catch (error) {
            console.error('HTML rendering failed:', error);
            const errorDiv = document.createElement('div'); errorDiv.className = 'preview-error'; errorDiv.textContent = `Fatal Error: ${error.message}`;
            statusContainer.replaceChildren(errorDiv);
        }
    }


    // --- Mermaid Diagram Rendering Engine ---
    function isMermaidCode(content) {
        const keywords = ['C4Context','C4Container','C4Component','C4Dynamic','classDiagram','erDiagram','flowchart','gantt','gitGraph','graph','journey','mindmap','pie','quadrantChart','requirementDiagram','sequenceDiagram','stateDiagram','timeline'];
        const trimmed = content.trim();
        return keywords.some(k => trimmed.startsWith(k)) || trimmed.startsWith('%%{init:');
    }
    function fixGanttSyntax(code) {
        const lines = code.split('\n'); let fixes = [];
        const fixedLines = lines.map((line, index) => {
            let processedLine = line;
            const afterMatches = line.match(/after\s+\w+/g);
            if (afterMatches && afterMatches.length > 1) {
                afterMatches.slice(1).forEach(extraAfter => { processedLine = processedLine.replace(`, ${extraAfter}`, ''); });
                fixes.push(`Line ${index + 1}: Removed extraneous 'after' clauses.`);
            }
            if (line.includes('：')) {
                processedLine = processedLine.replace(/：/g, ':');
                fixes.push(`Line ${index + 1}: Replaced full-width colon.`);
            }
            return processedLine;
        });
        return { code: fixedLines.join('\n'), fixes };
    }
    function fixQuadrantChartSyntax(code) {
        const lines = code.split('\n'); let fixes = [];
        const fixedLines = lines.map((line, index) => {
            const match = line.match(/^( *)(title|x-axis|y-axis|quadrant-\d+) (?!")(.*)$/);
            if (match) {
                const indent = match[1], keyword = match[2]; let text = match[3];
                if (keyword === 'x-axis' || keyword === 'y-axis') {
                    const parts = text.split('-->').map(p => p.trim());
                    if (parts.length === 2) {
                        fixes.push(`Line ${index + 1}: Added quotes to axis labels.`);
                        return `${indent}${keyword} "${parts[0]}" --> "${parts[1]}"`;
                    }
                } else {
                     fixes.push(`Line ${index + 1}: Added quotes to label.`);
                     return `${indent}${keyword} "${text}"`;
                }
            }
            return line;
        });
        return { code: fixedLines.join('\n'), fixes };
    }
    function fixRequirementDiagramSyntax(code) {
        const lines = code.split('\n'); let fixes = [];
        const fixedLines = lines.map((line, index) => {
            const match = line.match(/^( *)text: (?!")(.*)$/);
             if (match) {
                fixes.push(`Line ${index + 1}: Added quotes to 'text' property.`);
                return `${match[1]}text: "${match[2]}"`;
            }
            return line;
        });
        return { code: fixedLines.join('\n'), fixes };
    }
    function preprocessMermaidCode(code) {
        let allFixes = [];
        let processedCode = code.trim();
        if (processedCode.startsWith('gantt')) {
            const result = fixGanttSyntax(processedCode);
            processedCode = result.code;
            allFixes = allFixes.concat(result.fixes);
            if (!processedCode.includes('dateFormat')) {
                const lines = processedCode.split('\n');
                lines.splice(1, 0, '    dateFormat YYYY-MM-DD');
                processedCode = lines.join('\n');
                allFixes.push('Added default `dateFormat`.');
            }
        } else if (processedCode.startsWith('quadrantChart')) {
            const result = fixQuadrantChartSyntax(processedCode);
            processedCode = result.code;
            allFixes = allFixes.concat(result.fixes);
        } else if (processedCode.startsWith('requirementDiagram')) {
            const result = fixRequirementDiagramSyntax(processedCode);
            processedCode = result.code;
            allFixes = allFixes.concat(result.fixes);
        }
        return { code: processedCode, fixes: allFixes };
    }
    async function renderMermaid(content, codeBlockContainer) {
        const previewContainer = document.createElement('div');
        previewContainer.className = 'mermaid-preview-container';
        previewContainer.textContent = '🎨 Rendering diagram with Kroki.io...';
        codeBlockContainer.parentNode.insertBefore(previewContainer, codeBlockContainer.nextSibling);
        try {
            const { code, fixes } = preprocessMermaidCode(content);
            if (DEBUG) { console.log("Processed Mermaid Code:\n", code); console.log("Fixes applied:", fixes); }
            const svg = await fetchResource('https://kroki.io/mermaid/svg', 'POST', code, 'text');
            safeSetHTML(previewContainer, svg);

            const svgElement = previewContainer.querySelector('svg');
            if (svgElement && !svgElement.querySelector('text > tspan[x="10"]')) {
                const successBadge = document.createElement('div');
                successBadge.className = 'mermaid-success-badge';
                successBadge.textContent = '✓ Rendered';
                previewContainer.appendChild(successBadge);
                if (fixes.length > 0) {
                    const warningBadge = document.createElement('div');
                    warningBadge.className = 'mermaid-warning-badge';
                    warningBadge.textContent = '⚠️ Auto-fixed';
                    warningBadge.title = 'Applied fixes:\n' + fixes.join('\n');
                    previewContainer.appendChild(warningBadge);
                }
            }
        } catch (error) {
            console.error('Mermaid rendering error:', error);
            const errorContainer = document.createElement('div');
            errorContainer.className = 'preview-error';
            if (error.message.includes('</svg>')) {
                 safeSetHTML(errorContainer, error.message.substring(error.message.indexOf('<?xml')));
            } else { errorContainer.textContent = `Mermaid Render Failed:\n${error.message}`; }
            previewContainer.replaceChildren(errorContainer);
        }
    }


    // --- Pollinations.ai Image Rendering Engine ---
    async function renderPollinationsLink(node) {
        if (node.tagName !== 'A' || !node.href || node.dataset.rendered) return;

        let imageUrl = null;
        if (node.href.startsWith('https://image.pollinations.ai/prompt/')) {
            imageUrl = node.href;
        } else if (node.href.includes('google.com/search?q=https://image.pollinations.ai/prompt/')) {
            imageUrl = new URL(node.href).searchParams.get('q');
        }

        if (!imageUrl) return;

        node.dataset.rendered = 'true';
        const placeholder = document.createElement('div');
        placeholder.textContent = 'Loading Pollinations image...';
        placeholder.style.cssText = 'padding: 10px; border: 1px dashed #ccc; display: inline-block;';
        node.parentNode.replaceChild(placeholder, node);

        try {
            const imageBlob = await fetchResource(imageUrl, 'GET', null, 'blob');
            const imageUrlObject = URL.createObjectURL(imageBlob);
            const img = document.createElement('img');
            img.src = imageUrlObject;
            img.style.cssText = 'max-width: 100%; height: auto; display: block; border-radius: 8px;';
            img.onload = () => placeholder.parentNode.replaceChild(img, placeholder);
            img.onerror = () => { throw new Error("Image could not be loaded into element."); };
        } catch (error) {
            placeholder.textContent = `Image failed to load: ${error.message}`;
            placeholder.style.color = 'red';
            console.error(`Pollinations render error for ${imageUrl}:`, error);
        }
    }


    // --- Main Script Logic & Observer ---
    function addRenderButton(codeBlockContainer) {
        if (codeBlockContainer.querySelector('.render-preview-button')) return;
        const header = codeBlockContainer.querySelector('.code-block-decoration');
        const codeElement = codeBlockContainer.querySelector('pre > code');
        if (!header || !codeElement) return;

        const content = codeElement.textContent || '';
        const lang = header.querySelector('span')?.textContent.trim().toLowerCase() || '';
        const isHtml = lang === 'html';
        const isMermaid = lang === 'mermaid' || isMermaidCode(content);
        if (!isHtml && !isMermaid) return;

        const button = document.createElement('button');
        button.className = 'render-preview-button';
        let buttonText = '', renderFn = null;

        if (isMermaid) {
            buttonText = '📊 Render Diagram';
            button.classList.add('mermaid-button');
            renderFn = () => renderMermaid(content, codeBlockContainer);
        } else {
            buttonText = '▶️ Render HTML';
            if (content.toLowerCase().includes('echarts')) {
                buttonText = '📈 Render ECharts';
                button.classList.add('echarts-button');
            }
            renderFn = () => renderHTML(content, codeBlockContainer);
        }
        button.innerText = buttonText;

        button.onclick = async (e) => {
            e.stopPropagation();
            const existingPreview = codeBlockContainer.nextElementSibling;
            if (existingPreview?.matches('.preview-container, .mermaid-preview-container')) {
                if (existingPreview.dataset.blobUrl) URL.revokeObjectURL(existingPreview.dataset.blobUrl);
                existingPreview.remove();
                button.innerText = buttonText;
                button.disabled = false;
            } else {
                button.disabled = true;
                button.innerText = '⏳ Rendering...';
                await renderFn();
                button.innerText = '❌ Close Preview';
                button.disabled = false;
            }
        };

        const buttonsDiv = header.querySelector('.buttons');
        if (buttonsDiv) {
            buttonsDiv.prepend(button);
        } else {
            if (DEBUG) console.warn('Renderer script: ".buttons" div not found. Appending to header as fallback.');
            header.appendChild(button);
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType !== 1) continue; // Ensure it's an element

                // --- Find and process new Code Blocks ---
                if (addedNode.matches('div.code-block')) {
                    addRenderButton(addedNode);
                }
                addedNode.querySelectorAll('div.code-block').forEach(addRenderButton);

                // --- Find and process new Pollinations Links ---
                const linkSelector = 'a[href*="image.pollinations.ai/prompt/"]';
                if (addedNode.matches(linkSelector)) {
                    renderPollinationsLink(addedNode);
                }
                addedNode.querySelectorAll(linkSelector).forEach(renderPollinationsLink);
            }
        }
    });

    if (DEBUG) console.log(`Gemini Advanced Renderer (v1.0) is active.`);

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run for any content already on the page when the script loads
    document.querySelectorAll('div.code-block').forEach(addRenderButton);
    document.querySelectorAll('a[href*="image.pollinations.ai/prompt/"]').forEach(renderPollinationsLink);

})();