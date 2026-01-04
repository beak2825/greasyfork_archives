// ==UserScript==
// @name         Pkg.go.dev to LLM.txt Formatter
// @name:zh-CN   Pkg.go.dev 文档转 LLM.txt 格式化工具
// @namespace    https://x.com/janxin
// @version      0.1.1
// @description  Extracts Go package documentation (API definitions, examples) from pkg.go.dev and converts it into a structured LLM.txt format, suitable for local AI/LLM reference and analysis.
// @description:zh-CN 从 pkg.go.dev 提取 Go 语言包的文档内容（包括 API 定义和代码示例），并将其转换为结构化的 LLM.txt 文本格式，方便在本地使用大型语言模型 (LLM) 进行参考和分析。
// @author       hellowor
// @match        https://pkg.go.dev/*
// @icon         https://pkg.go.dev/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @homepageURL  https://x.com/janxin
// @supportURL   https://x.com/janxin
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538657/Pkggodev%20to%20LLMtxt%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/538657/Pkggodev%20to%20LLMtxt%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .llm-download-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 15px;
            background-color: #007d9c;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .llm-download-button:hover {
            background-color: #005f79;
        }
    `);

    function getCleanText(element) {
        return element ? element.textContent.trim() : '';
    }

    function getCodeFromPre(preElement) {
        if (!preElement) return '';
        // Check if there's a span inside the pre, which often holds the actual code lines
        const spanInsidePre = preElement.querySelector('span');
        if (spanInsidePre) {
            let code = '';
            spanInsidePre.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    code += node.textContent;
                } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
                    code += '\n';
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    code += node.textContent;
                }
            });
            const trimmedCodeFromSpan = code.trim();
            if (trimmedCodeFromSpan) {
                return trimmedCodeFromSpan;
            }
        }
        // Fallback if no span or span processing yielded empty string
        return preElement.textContent; // textContent decodes HTML entities
    }


    function getDirectSiblingParagraphs(element) {
        if (!element) {
            return '';
        }
        let description = [];
        let sibling = element.nextElementSibling;
        while (sibling && (sibling.tagName === 'P' || (sibling.tagName === 'UL' && !sibling.closest('.Documentation-exampleDetails')))) {
            if (sibling.tagName === 'P') {
                description.push(getCleanText(sibling));
            } else if (sibling.tagName === 'UL') {
                 let listItems = [];
                 sibling.querySelectorAll('li').forEach(li => listItems.push('- ' + getCleanText(li)));
                 if (listItems.length > 0) {
                     description.push(listItems.join('\n'));
                 }
            }
            sibling = sibling.nextElementSibling;
        }
        return description.join('\n\n');
    }

    function extractExample(detailElement, level = 3) {
        const summaryEl = detailElement.querySelector('.Documentation-exampleDetailsHeader');
        const exampleBody = detailElement.querySelector('.Documentation-exampleDetailsBody');
        let codeContent = '';

        if (exampleBody) {
            const textareaEl = exampleBody.querySelector('textarea.Documentation-exampleCode.code');
            if (textareaEl) {
                codeContent = textareaEl.value;
                // console.log(`[extractExample] Found textarea for "${getCleanText(summaryEl)}". Value length: ${codeContent.length}. Starts with: ${codeContent.substring(0, 70).replace(/\n/g, '\\n')}`);
            }

            // If textarea not found or its value is empty, try <pre>
            if (!codeContent.trim()) {
                const preEl = exampleBody.querySelector('pre.Documentation-exampleCode');
                if (preEl) {
                    codeContent = getCodeFromPre(preEl);
                    // console.log(`[extractExample] Found pre for "${getCleanText(summaryEl)}". Content length: ${codeContent.length}. Starts with: ${codeContent.substring(0, 70).replace(/\n/g, '\\n')}`);
                }
            }
             if (!codeContent.trim() && !textareaEl && !exampleBody.querySelector('pre.Documentation-exampleCode')) {
                // console.warn(`[extractExample] No code element (textarea or pre) found for example: "${getCleanText(summaryEl)}" in body:`, exampleBody.innerHTML.substring(0,200));
            }
        } else {
            // console.warn(`[extractExample] No exampleBody found for example: "${getCleanText(summaryEl)}"`);
        }

        const outputLabelEl = detailElement.querySelector('.Documentation-exampleOutputLabel');
        const outputEl = exampleBody ? exampleBody.querySelector('span.Documentation-exampleOutput, pre.Documentation-exampleOutput') : null;

        let exampleText = "";
        const title = getCleanText(summaryEl).replace(/ ¶$/, '');
        if (title) {
            exampleText += `${'#'.repeat(level)} Example: ${title}\n\n`;
        } else {
            exampleText += `${'#'.repeat(level)} Example\n\n`;
        }

        const trimmedCode = codeContent.trim();
        if (trimmedCode) {
            exampleText += "```go\n" + trimmedCode + "\n```\n\n";
        } else {
            // console.warn(`[extractExample] Code content is effectively empty for: "${title}"`);
        }

        if (outputLabelEl && outputEl) {
            let outputContent = "";
            if (outputEl.tagName === 'PRE') {
                outputContent = getCodeFromPre(outputEl);
            } else {
                const preInsideSpan = outputEl.querySelector('pre');
                if (preInsideSpan) {
                    outputContent = getCodeFromPre(preInsideSpan);
                } else {
                    outputContent = getCleanText(outputEl);
                }
            }
            const trimmedOutput = outputContent.trim();
            if (trimmedOutput) {
                exampleText += `Output:\n\`\`\`\n${trimmedOutput}\n\`\`\`\n\n`;
            }
        }
        return exampleText;
    }

    function extractNameFromSignatureOrHeader(headerEl, sigPre, entityType = "Unknown") {
        if (headerEl) {
            const nameAnchor = headerEl.querySelector('a:not(.Documentation-idLink):not(.Documentation-source)');
            if (nameAnchor && getCleanText(nameAnchor)) {
                return getCleanText(nameAnchor);
            }
        }
        if (sigPre) {
            const sigText = getCodeFromPre(sigPre).trim(); // Ensure sigText is trimmed before regex
            let match;
            switch (entityType) {
                case "Function":
                case "Constructor":
                    match = sigText.match(/^func\s+([A-Z_][A-Za-z0-9_]*)\s*\(/);
                    if (match && match[1]) return match[1];
                    break;
                case "Method":
                    match = sigText.match(/^func\s*\([\s\S]*?\)\s*([A-Z_][A-Za-z0-9_]*)\s*\(/);
                    if (match && match[1]) return match[1];
                    break;
                case "Type":
                    match = sigText.match(/^type\s+([A-Z_][A-Za-z0-9_]*)/);
                    if (match && match[1]) return match[1];
                    break;
            }
        }
        if (headerEl) {
            let headerText = getCleanText(headerEl).replace(/ ¶$/, '');
            headerText = headerText.replace(/^func\s+/, '').replace(/^type\s+/, '');
            const firstWord = headerText.split(/\s|\(/)[0];
            if (firstWord) return firstWord;
        }
        return `Unknown${entityType}`;
    }


    function processDocumentationSection() {
        let output = [];
        const docContainer = document.querySelector('.Documentation.js-documentation .Documentation-content.js-docContent');
        if (!docContainer) {
            console.warn("Main documentation content (.Documentation-content.js-docContent) not found.");
            return '';
        }

        const overviewSection = docContainer.querySelector('section.Documentation-overview');
        if (overviewSection) {
            const overviewHeader = overviewSection.querySelector('h3#pkg-overview');
            if (overviewHeader) {
                const packageDescription = getDirectSiblingParagraphs(overviewHeader);
                 if (packageDescription) {
                    output.push("## Package Overview\n\n" + packageDescription + "\n\n");
                }
            }
            const overviewExamples = overviewSection.querySelectorAll('details.Documentation-exampleDetails');
            if (overviewExamples.length > 0) {
                let examplesInSectionFound = false;
                overviewExamples.forEach(ex => {
                    const exampleContent = extractExample(ex, 3);
                    if (exampleContent.split('\n').filter(l => l.trim() !== '').length > 2) { // Check if more than just title
                        if (!examplesInSectionFound) {
                            output.push("## Package Examples (from Overview)\n");
                            examplesInSectionFound = true;
                        }
                        output.push(exampleContent);
                    }
                });
            }
        }

        const examplesSectionHeader = docContainer.querySelector('h4#pkg-examples');
        if (examplesSectionHeader) {
            const examplesList = examplesSectionHeader.parentElement.querySelector('ul.Documentation-examplesList');
            if (examplesList) {
                 let examplesInSectionFound = false;
                 examplesList.querySelectorAll('li a.js-exampleHref').forEach(exLink => {
                     const exampleId = exLink.getAttribute('href').substring(1);
                     const exampleDetail = docContainer.querySelector(`details#${exampleId}.Documentation-exampleDetails`);
                     if (exampleDetail) {
                         const exampleContent = extractExample(exampleDetail, 3);
                         if (exampleContent.split('\n').filter(l => l.trim() !== '').length > 2) {
                            if (!examplesInSectionFound) {
                                output.push("## Examples (Listed)\n");
                                examplesInSectionFound = true;
                            }
                            output.push(exampleContent);
                         }
                     }
                 });
            }
        }

        const constHeader = docContainer.querySelector('#pkg-constants');
        if (constHeader) {
            const constSection = constHeader.closest('h3').nextElementSibling;
            if (constSection && constSection.classList.contains('Documentation-constants')) {
                const declarations = constSection.querySelectorAll('div.Documentation-declaration');
                if (declarations.length > 0) {
                    output.push("## Constants\n");
                    declarations.forEach(decl => {
                        const sigPre = decl.querySelector('pre');
                        if (sigPre) output.push("```go\n" + getCodeFromPre(sigPre).trim() + "\n```\n");
                        const desc = getDirectSiblingParagraphs(decl);
                        if (desc) output.push(desc + "\n");
                        output.push("---\n");
                    });
                }
            }
        }

        const varHeader = docContainer.querySelector('#pkg-variables');
        if (varHeader) {
            const varSection = varHeader.closest('h3').nextElementSibling;
            if (varSection && varSection.classList.contains('Documentation-variables')) {
                const declarations = varSection.querySelectorAll('div.Documentation-declaration');
                if (declarations.length > 0) {
                    output.push("## Variables\n");
                    declarations.forEach(decl => {
                        const sigPre = decl.querySelector('pre');
                        if (sigPre) output.push("```go\n" + getCodeFromPre(sigPre).trim() + "\n```\n");
                        const desc = getDirectSiblingParagraphs(decl);
                        if (desc) output.push(desc + "\n");
                        output.push("---\n");
                    });
                }
            }
        }

        const funcHeader = docContainer.querySelector('#pkg-functions');
        if (funcHeader) {
            const funcSection = funcHeader.closest('h3').nextElementSibling;
            if (funcSection && funcSection.classList.contains('Documentation-functions')) {
                const functions = funcSection.querySelectorAll('div.Documentation-function');
                 if (functions.length > 0) {
                    output.push("## Functions\n");
                    functions.forEach(fnDiv => {
                        const fnHeaderEl = fnDiv.querySelector('h4.Documentation-functionHeader');
                        const declarationDiv = fnDiv.querySelector('div.Documentation-declaration');
                        const sigPre = declarationDiv ? declarationDiv.querySelector('pre') : null;
                        const funcName = extractNameFromSignatureOrHeader(fnHeaderEl, sigPre, "Function");

                        output.push(`### Function: ${funcName}\n`);
                        if (sigPre) {
                            output.push("```go\n" + getCodeFromPre(sigPre).trim() + "\n```\n");
                        }
                        const desc = declarationDiv ? getDirectSiblingParagraphs(declarationDiv) : (fnHeaderEl ? getDirectSiblingParagraphs(fnHeaderEl) : '');
                        if (desc) output.push(desc + "\n");

                        fnDiv.querySelectorAll('details.Documentation-exampleDetails').forEach(ex => {
                            const exampleContent = extractExample(ex, 4);
                            if (exampleContent.split('\n').filter(l => l.trim() !== '').length > 2) {
                                output.push(exampleContent);
                            }
                        });
                        output.push("---\n");
                    });
                }
            }
        }

        const typeHeader = docContainer.querySelector('#pkg-types');
        if (typeHeader) {
            const typeSection = typeHeader.closest('h3').nextElementSibling;
            if (typeSection && typeSection.classList.contains('Documentation-types')) {
                const types = typeSection.querySelectorAll('div.Documentation-type');
                if (types.length > 0) {
                    output.push("## Types\n");
                    types.forEach(typeDiv => {
                        const typeHeaderEl = typeDiv.querySelector('h4.Documentation-typeHeader');
                        const typeDeclarationDiv = typeDiv.querySelector('div.Documentation-declaration');
                        const sigPre = typeDeclarationDiv ? typeDeclarationDiv.querySelector('pre') : null;
                        const typeName = extractNameFromSignatureOrHeader(typeHeaderEl, sigPre, "Type");

                        output.push(`### Type: ${typeName}\n`);
                        if (sigPre) {
                            output.push("```go\n" + getCodeFromPre(sigPre).trim() + "\n```\n");
                        }
                        const desc = typeDeclarationDiv ? getDirectSiblingParagraphs(typeDeclarationDiv) : (typeHeaderEl ? getDirectSiblingParagraphs(typeHeaderEl) : '');
                        if (desc) output.push(desc + "\n");

                        typeDiv.querySelectorAll(':scope > details.Documentation-exampleDetails').forEach(ex => {
                             const exampleContent = extractExample(ex, 4);
                             if (exampleContent.split('\n').filter(l => l.trim() !== '').length > 2) {
                                 output.push(exampleContent);
                             }
                        });

                        typeDiv.querySelectorAll('div.Documentation-typeFunc').forEach(assocFnDiv => {
                            const assocFnHeaderEl = assocFnDiv.querySelector('h4.Documentation-functionHeader');
                            const assocFnDeclarationDiv = assocFnDiv.querySelector('div.Documentation-declaration');
                            const assocSigPre = assocFnDeclarationDiv ? assocFnDeclarationDiv.querySelector('pre') : null;
                            const constructorName = extractNameFromSignatureOrHeader(assocFnHeaderEl, assocSigPre, "Constructor");

                            output.push(`#### Constructor: ${constructorName}\n`);
                            if (assocSigPre) {
                                output.push("```go\n" + getCodeFromPre(assocSigPre).trim() + "\n```\n");
                            }
                            const assocDesc = assocFnDeclarationDiv ? getDirectSiblingParagraphs(assocFnDeclarationDiv) : (assocFnHeaderEl ? getDirectSiblingParagraphs(assocFnHeaderEl) : '');
                            if (assocDesc) output.push(assocDesc + "\n");

                            assocFnDiv.querySelectorAll('details.Documentation-exampleDetails').forEach(ex => {
                                const exampleContent = extractExample(ex, 5);
                                if (exampleContent.split('\n').filter(l => l.trim() !== '').length > 2) {
                                    output.push(exampleContent);
                                }
                            });
                            output.push("---\n");
                        });

                        typeDiv.querySelectorAll('div.Documentation-typeMethod').forEach(assocMethodDiv => {
                            const assocMethodHeaderEl = assocMethodDiv.querySelector('h4.Documentation-functionHeader');
                            const assocMethodDeclarationDiv = assocMethodDiv.querySelector('div.Documentation-declaration');
                            const assocSigPre = assocMethodDeclarationDiv ? assocMethodDeclarationDiv.querySelector('pre') : null;
                            const methodName = extractNameFromSignatureOrHeader(assocMethodHeaderEl, assocSigPre, "Method");

                            output.push(`#### Method: ${methodName}\n`);
                             if (assocSigPre) {
                                output.push("```go\n" + getCodeFromPre(assocSigPre).trim() + "\n```\n");
                            }
                            const assocDesc = assocMethodDeclarationDiv ? getDirectSiblingParagraphs(assocMethodDeclarationDiv) : (assocMethodHeaderEl ? getDirectSiblingParagraphs(assocMethodHeaderEl) : '');
                            if (assocDesc) output.push(assocDesc + "\n");
                             assocMethodDiv.querySelectorAll('details.Documentation-exampleDetails').forEach(ex => {
                                const exampleContent = extractExample(ex, 5);
                                if (exampleContent.split('\n').filter(l => l.trim() !== '').length > 2) {
                                    output.push(exampleContent);
                                }
                            });
                            output.push("---\n");
                        });
                         output.push("===\n");
                    });
                }
            }
        }
        let cleanedOutput = output.join('\n')
                                .replace(/(\n---\n)+(\s*(\n---|\n===|$))/g, '\n---\n$2') // Consolidate multiple --- unless followed by ===
                                .replace(/(\n===\n)+/g, '\n===\n') // Consolidate multiple ===
                                .replace(/\n{3,}/g, '\n\n');       // Max 2 blank lines
        return cleanedOutput.trim();
    }

    function getPackageNameForFilename() {
        let path = window.location.pathname;
        path = path.split('@')[0];
        if (path.startsWith('/')) {
            path = path.substring(1);
        }
        return path.replace(/\/$/, '').replace(/\//g, '_');
    }

    function download(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    function initializeScraper() {
        // console.log("Starting extraction...");
        const data = processDocumentationSection();
        if (data.trim()) {
            const packageName = getPackageNameForFilename();
            const filename = packageName ? `${packageName}_llm.txt` : 'llm.txt';
            download(filename, data);
            // console.log(`${filename} download initiated.`);
            // GM_setClipboard(data); // For debugging
            // alert('Data extracted and download initiated!');
        } else {
            // console.warn("No documentation section found or no actual data was extracted.");
            alert("Could not find documentation section or no actual data was extracted. Check console for details (if any logs were enabled).");
        }
    }

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download llm.txt';
    downloadButton.className = 'llm-download-button';
    downloadButton.addEventListener('click', () => {
        // console.log("Button clicked, scheduling scraper with 1s delay.");
        setTimeout(initializeScraper, 1000); // 1 second delay
    });

    // Fallback: if the page is very simple and loads fast, or if the button is added very late
    // For very dynamic pages, a MutationObserver on document.body or a specific container might be more robust
    // but setTimeout is simpler for now.
    if (document.readyState === "complete") {
        // If page is already loaded, maybe CodeMirror is also ready?
        // This is less likely to be the case for why it's not working.
        // The click handler with setTimeout is more reliable.
    }

    document.body.appendChild(downloadButton);

})();