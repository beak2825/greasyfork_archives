// ==UserScript==
// @name         LaTeX for LIHKG
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  This is to convert LaTeX to image in LIHKG posts
// @author       CY Fung
// @match        https://lihkg.com/*
// @icon         https://avatars.githubusercontent.com/u/431808?s=48&v=4
// @grant        none
// @run-at       document-body
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/464141/LaTeX%20for%20LIHKG.user.js
// @updateURL https://update.greasyfork.org/scripts/464141/LaTeX%20for%20LIHKG.meta.js
// ==/UserScript==

'use strict';
(function() {
    'use strict';

    /*
     * Copyright (C) 2023 culefa.
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not
     * use this file except in compliance with the License. You may obtain a copy of
     * the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
     * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
     * License for the specific language governing permissions and limitations under
     * the License.
     */

    // Check if the current hostname ends with 'lihkg.com'
    if (!location.hostname.endsWith('lihkg.com')) return;

    const MAX_QUERY_LENGTH = 800; // 2000 for encoded

    // Create an image element for LaTeX rendering
    const createLatexNode = (t) => {
        if (typeof t != 'string') return null;
        const img = document.createElement('img');
        img.className = 'lihkg-userscript-latex';
        img.loading = 'lazy';
        let s = t.length > MAX_QUERY_LENGTH ? t.substring(0, MAX_QUERY_LENGTH) : t;
        img.src = `https://math.now.sh?bgcolor=auto&from=${encodeURIComponent(s)}`;
        let title = `[latex]${t}[/latex]`;
        img.setAttribute('alt', title);
        img.setAttribute('title', title);
        return img;
    };

    const validatedMap = new Map();

    const validateLaTeX = (t) => {
        let r = validatedMap.get(t);
        if (typeof r == 'boolean') return r;
        r = true;
        if (/\:\/\/|\:\\\\|\<(script|h5|h4|h3|h2|h1|span|div|br|pre|quote|img|table|tr|td)\>|\b(javascript)\b|\`\`\`/i.test(t)) r = false;
        validatedMap.set(t, r);
        return r;
    }

    // Process a text node to replace LaTeX tags with image elements
    const processTextNode = (textNode) => {
        if (!textNode) return;
        let textContent = textNode.textContent;
        if (typeof textContent === 'string' && textContent.length > 15) {} else {
            return;
        }

        textContent = textContent.trim();

        // Check if the text content is long enough and has LaTeX tags
        if (textContent.length > 15) {} else {
            return;
        }
        if (textContent.indexOf('[latex]') < 0) return;
        const split = textContent.split(/\[latex\]((?:(?!\[latex\]|\[\/latex\]).)*)\[\/latex\]/g);

        // Check if the split array has an odd length (latex tags are found)
        if (split.length >= 3 && (split.length % 2) === 1) {
            const newNodes = split.map((t, j) => ((((j % 2) === 0) || !validateLaTeX(t)) ? document.createTextNode(t) : createLatexNode(t)));
            textNode.replaceWith(...newNodes);
        }

    };

    // Check a div element and process its text nodes
    const checkDivDOM = (div) => {
        let textNode = div.firstChild;
        while (textNode) {
            if (textNode.nodeType === Node.TEXT_NODE) {
                processTextNode(textNode);
            }
            textNode = textNode.nextSibling;
        }
    }

    // Check a post div for LaTeX tags and process its children divs
    const checkPostDiv = (postDiv) => {
        const html = postDiv.innerHTML;
        if (html.indexOf('[latex]') >= 0) {
            const divs = postDiv.querySelectorAll('div[class]:not(:empty), div[data-ast-root]:not(:empty)');
            if (divs.length >= 1) {
                for (const div of divs) {
                    checkDivDOM(div);
                }
            } else {
                checkDivDOM(postDiv);
            }
        }
    };

    // Delayed check for processing post divs
    function delayedCheck(arr) {
        window.requestAnimationFrame(() => {
            for (const s of arr) {
                checkPostDiv(s);
            }
        });
    }

    // Create an observer to check for new posts and previews
    const observer = new MutationObserver((mutations) => {
        if (!location.pathname.startsWith('/thread/')) return;
        let arr = [];
        for (const s of document.querySelectorAll('[data-post-id]:not(.y24Yt), ._3rEWfQ3U63bl18JSaUvRX7 .GAagiRXJU88Nul1M7Ai0H:not(.y24Yt)')) {
            s.classList.add('y24Yt');
            arr.push(s);
        }
        if (arr.length >= 1) delayedCheck(arr);
    });

    // Start observing the body element for changes
    observer.observe(document.body, {
        subtree: true,
        childList: true
    });

})();