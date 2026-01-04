// ==UserScript==
// @name         Moonloader & CLEO Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ну подсвечивает код епта че еще делать ему
// @author       вадим общажный
// @match        https://www.blast.hk/*
// @grant        GM_xmlhttpRequest
// @connect      pastebin.com
// @connect      blast.hk
// @downloadURL https://update.greasyfork.org/scripts/502914/Moonloader%20%20CLEO%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/502914/Moonloader%20%20CLEO%20Highlighter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const opcodeJsonUrl = 'https://pastebin.com/raw/pz5eKb0R';
    const functionJsonUrl = 'https://pastebin.com/raw/auAGxDNU';
    let opcodeData = [];
    let functionData = [];

    const fetchJsonData = (url) => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload: response => response.status === 200 ? resolve(JSON.parse(response.responseText)) : reject(`Failed to load JSON: ${response.status}`)
        });
    });

    const processPage = () => {
        document.querySelectorAll('.bbCodeBlock--code .bbCodeCode, pre.bbCodeCode').forEach(block => {
            block.innerHTML = highlightContent(block.innerHTML);
        });
    };

    const highlightContent = (codeText) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = codeText;

        getTextNodes(tempDiv).forEach(node => {
            node.parentNode.replaceChild(createHighlightedNode(node.textContent), node);
        });

        return tempDiv.innerHTML;
    };

    const createHighlightedNode = (text) => {
        const span = document.createElement('span');
        span.innerHTML = text
            .replace(/\b[0-9a-fA-F]{4}\b/g, match => {
                const opcode = opcodeData.find(op => op.o.toLowerCase() === match.toLowerCase());
                return opcode ? `<a href="${opcode.l}" title="${opcode.t}" target="_blank" style="color: #00b3ff; text-decoration: underline;">${match}</a>` : match;
            })
            .replace(/\b\w+\b/g, match => {
                const func = functionData.find(func => func.luaFunction === match);
                return func ? `<a href="${func.luaFunctionUrl}" title="${match}" target="_blank" style="color: #00b3ff; text-decoration: underline;">${match}</a>` : match;
            });
        return span;
    };

    const getTextNodes = (node) => {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        let currentNode;
        while (currentNode = walker.nextNode()) nodes.push(currentNode);
        return nodes;
    };

    const observeAttachments = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(({ addedNodes }) => {
                addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('.bbCodeBlock--code .bbCodeCode, pre.bbCodeCode')) {
                        processPage();
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    window.addEventListener('load', async () => {
        try {
            opcodeData = await fetchJsonData(opcodeJsonUrl);
            functionData = await fetchJsonData(functionJsonUrl);
            processPage();
            observeAttachments();
        } catch (error) {
            console.error(error);
        }
    });
})();
