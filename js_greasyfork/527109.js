// ==UserScript==
// @name         Double-click Math Formula to Copy to Word
// @namespace    http://tampermonkey.net/
// @version      1.7
// @license      GPLv3
// @description  Double-click on a math formula on supported websites to copy it to the clipboard, then paste it into Microsoft Word. Wikipedia, ChatGPT, Google AI Studio, Gemini, DeepSeek, Moonshot, Luogu, StackExchange, Zhihu, Doubao, OIWiki, IEEE Xplore, ChatBox AI
// @match        *://*.wikipedia.org/*
// @match        *://chatgpt.com/*
// @match        *://gemini.google.com/*
// @match        *://aistudio.google.com/*
// @match        *://*.stackexchange.com/*
// @match        *://*.deepseek.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.moonshot.cn/*
// @match        *://*.oiwiki.org/*
// @match        *://*.luogu.com.cn/*
// @match        *://*.luogu.com/*
// @match        *://*.doubao.com/*
// @match        *://*.chatboxai.app/*
// @match        *://ieeexplore.ieee.org/*
// @require      https://cdn.jsdelivr.net/npm/temml-ts@0.10.14-12/dist/temml.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527109/Double-click%20Math%20Formula%20to%20Copy%20to%20Word.user.js
// @updateURL https://update.greasyfork.org/scripts/527109/Double-click%20Math%20Formula%20to%20Copy%20to%20Word.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const css = `
        .math-hover-effect {
            background-color: rgba(255, 215, 0, 0.25) !important;
            transition: background-color 0.2s ease;
            cursor: pointer !important;
        }
        .mathml-copy-success {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 5px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-family: sans-serif;
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.5s;
            pointer-events: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);


    const siteConfig = [
        { name: "ChatGPT Canvas", domain: "chatgpt.com", selector: '.katex', type: 'mathml' },
        { name: "Wikipedia", domain: "wikipedia.org", selector: 'span.mwe-math-element', type: 'mathml' },
        { name: "Zhihu", domain: "zhihu.com", selector: 'span.ztext-math', type: 'mathml' },
        { name: "Oiwiki", domain: "oiwiki.org", selector: 'mjx-container.MathJax', type: 'mathml' },
        { name: "Doubao", domain: "doubao.com", selector: 'span.math-inline', type: 'mathml' },
        { name: "IEEE Xplore", domain: "ieeexplore.ieee.org", selector: 'span[id^="MathJax-Element-"][id$="-Frame"]', type: 'mathml' },
        { name: "StackExchange", domain: "stackexchange.com", selector: 'span.math-container', type: 'mathml' },
        { name: "Gemini", domain: "gemini.google.com", selector: '[data-math]', type: 'latex' },
        { name: "Gemini Canvas", domain: "gemini.google.com", selector: '.math-inline', type: 'mathml' },
        { name: "AiStudio", domain: "aistudio.google.com", selector: 'span.katex', type: 'mathml' },
        { name: "DeepSeek", domain: "deepseek.com", selector: 'span.katex', type: 'mathml' },
        { name: "Moonshot", domain: "moonshot.cn", selector: 'span.katex', type: 'mathml' },
        { name: "Luogu", domain: "luogu.com", selector: 'span.katex', type: 'mathml' },
        { name: "ChatBoxAI", domain: "chatboxai.app", selector: 'span.katex', type: 'mathml' }
    ];

    function getCurrentSiteConfig(url) {
        return siteConfig.find(site => url.includes(site.domain)) || null;
    }

    function convertLatexToMathML(latex, isDisplayMode = false) {
        try {
            return temml.renderToString(latex, { xml: true, displayMode: isDisplayMode });
        } catch (e) {
            console.error("Temml conversion failed:", e);
            return null;
        }
    }

// ---For Gemini---
    let sanitizer = { createHTML: (x) => x };
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            sanitizer = window.trustedTypes.createPolicy('mathml-copy-policy', {
                createHTML: (string) => string
            });
        } catch (e) {
            console.warn('Trusted Types policy creation failed (CSP might be strict). Using fallback.', e);
        }
    }


    function processGeminiDisplay(element) {
        if (element.getAttribute('data-mathml-converted') === 'true') return;
        const latex = element.getAttribute('data-math');
        if (!latex) return;

        try {
            const isDisplayMode = element.classList.contains('math-block');
            const mathmlHTML = convertLatexToMathML(latex, isDisplayMode);

            if (mathmlHTML) {
                element.innerHTML = sanitizer.createHTML(mathmlHTML);
                element.style.fontFamily = "Latin Modern Math, STIX Two Math, Cambria Math, serif";
                element.style.fontSize = "1.1em";
                element.setAttribute('data-mathml-converted', 'true');
                const mathTag = element.querySelector('math');
                if (mathTag) {
                    mathTag.setAttribute('display', isDisplayMode ? 'block' : 'inline');
                }
            }
        } catch (e) {
            console.error("Gemini display processing error:", e);
        }
    }
// ------

    function extractMathML(element) {
        let mathML = element.querySelector('math');
        if (mathML && !mathML.getAttribute('xmlns')) {
            mathML.setAttribute('xmlns', 'http://www.w3.org/1998/Math/MathML');
        }
        return mathML ? mathML.outerHTML : null;
    }

    function extractMathString(element, type) {
        if (type === 'latex') {
            const existingMathTag = extractMathML(element);
            if (existingMathTag) return existingMathTag;

            const latex = element.getAttribute('data-math');
            return latex ? convertLatexToMathML(latex) : null;
        }

        if (type === 'mathml') {
            return extractMathML(element);
        }
        return null;
    }

    function showCopySuccessTooltip(event) {
        const copyTooltip = document.createElement("div");
        copyTooltip.className = "mathml-copy-success";
        copyTooltip.innerText = "Copied";
        document.body.appendChild(copyTooltip);

        const x = event.clientX;
        const y = event.clientY;

        copyTooltip.style.left = `${x}px`;
        copyTooltip.style.top = `${y - 30}px`;

        setTimeout(() => {
            copyTooltip.style.opacity = "0";
            setTimeout(() => {
                if (copyTooltip.parentNode) document.body.removeChild(copyTooltip);
            }, 500);
        }, 1000);
    }



    function attachHandlers() {
        const config = getCurrentSiteConfig(window.location.href);
        if (!config) return;

        if (config.name === "Gemini") {
            document.querySelectorAll(config.selector).forEach(element => {
                processGeminiDisplay(element);
            });
        }
        document.querySelectorAll(config.selector).forEach(element => {
            if (element.dataset.mathCopyAttached) return;
            element.dataset.mathCopyAttached = "true";

            element.addEventListener('mouseenter', () => element.classList.add('math-hover-effect'));
            element.addEventListener('mouseleave', () => element.classList.remove('math-hover-effect'));

            element.ondblclick = (event) => {
                event.stopPropagation();
                event.preventDefault();

                const mathString = extractMathString(element, config.type);
                if (mathString) {
                    navigator.clipboard.writeText(mathString).then(() => showCopySuccessTooltip(event));
                } else {
                    console.warn("No math content found or conversion failed.");
                }
                window.getSelection().removeAllRanges();
            };
        });
    }


    document.addEventListener('DOMContentLoaded', attachHandlers);

    new MutationObserver((mutations) => {
        let shouldScan = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldScan = true;
                break;
            }
        }
        if (shouldScan) {
            attachHandlers();
        }
    }).observe(document.body, { childList: true, subtree: true });

})();