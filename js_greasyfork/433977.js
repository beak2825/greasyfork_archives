// ==UserScript==
// @name         水源解码
// @namespace    CCCC_David
// @version      0.1.3
// @description  可在水源论坛 base64 解码选中内容
// @author       CCCC_David
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433977/%E6%B0%B4%E6%BA%90%E8%A7%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/433977/%E6%B0%B4%E6%BA%90%E8%A7%A3%E7%A0%81.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // From Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com
    // License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc.
    // Modified class attribute to fit in.
    const DECODE_ICON = '<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zm40-176c-22.1 0-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40s-17.9 40-40 40z"/></svg>';

    // Parameters.
    const APPEND_DECODE_BUTTON_TARGET_CLASS = 'buttons';

    // Utility functions.
    const escapeRegExpOutsideCharacterClass = (s) => s.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');

    const allowedPolicy = window.trustedTypes?.createPolicy?.('allowedPolicy', {createHTML: (x) => x});
    const createTrustedHTML = (html) => (allowedPolicy ? allowedPolicy.createHTML(html) : html);

    const utf8Decoder = new TextDecoder('utf-8', {fatal: true});
    const htmlParser = new DOMParser();

    const isBinaryString = (s) => s.split('').every((c) => c.charCodeAt(0) < 256);

    const decodeUTF8BinaryString = (s) => {
        // Assuming input is binary string.
        const byteArray = new Uint8Array(s.split('').map((c) => c.charCodeAt(0)));
        try {
            return utf8Decoder.decode(byteArray);
        } catch {
            return null;
        }
    };

    const decodeBase64AndURI = (data) => {
        let result = data, prevResult = data;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const tempResult = result;
            try {
                result = atob(result);
            } catch {
                break;
            }
            prevResult = tempResult;
            if (result === prevResult) {
                break;
            }
        }
        if (isBinaryString(result)) {
            result = decodeUTF8BinaryString(result) ?? prevResult;
        }
        try {
            result = decodeURIComponent(result);
        } catch {
        }
        return result;
    };

    const lookupShortURLs = async (shortURLs) => {
        if (!shortURLs) {
            return new Map();
        }
        try {
            const response = await fetch('/uploads/lookup-urls', {
                method: 'POST',
                body: shortURLs.map((url) => `short_urls%5B%5D=${encodeURIComponent(url)}`).join('&'),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Discourse-Present': 'true',
                    'Discourse-Logged-In': 'true',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': document.querySelector('meta[name=csrf-token]').content,
                },
                mode: 'same-origin',
                credentials: 'include',
            });
            if (!response.ok) {
                // eslint-disable-next-line no-console
                console.error(`lookupShortURLs fetch failure: ${response.status}${response.statusText ? ` ${response.statusText}` : ''}`);
                return new Map();
            }
            const result = await response.json();
            return new Map(result.map((item) => [item.short_url, item.url]));
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            return new Map();
        }
    };

    const renderContent = async (content) => {
        // First cook the content.
        const cookedContent = await window.require('discourse/lib/text').cookAsync(content);
        let tree;
        try {
            tree = htmlParser.parseFromString(cookedContent, 'text/html');
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            return '<font color="red">(Parse error)</font>';
        }

        // Extract all short URLs and look up in batch.
        const shortURLs = [];
        for (const el of tree.querySelectorAll('img[data-orig-src], source[data-orig-src]')) {
            shortURLs.push(el.getAttribute('data-orig-src'));
        }
        for (const el of tree.querySelectorAll('a[data-orig-href]')) {
            shortURLs.push(el.getAttribute('data-orig-href'));
        }
        const shortURLMapping = await lookupShortURLs(shortURLs);

        // Replace short URLs with real URLs.
        for (const el of tree.querySelectorAll('img[data-orig-src], source[data-orig-src]')) {
            const src = el.getAttribute('data-orig-src');
            if (shortURLMapping.has(src)) {
                el.src = shortURLMapping.get(src);
                el.removeAttribute('data-orig-src');
            }
        }
        for (const el of tree.querySelectorAll('a[data-orig-href]')) {
            const href = el.getAttribute('data-orig-href');
            if (shortURLMapping.has(href)) {
                el.href = shortURLMapping.get(href);
                el.removeAttribute('data-orig-href');
            }
        }
        return tree.body.innerHTML;
    };

    const convertSelection = async () => {
        const selection = window.getSelection();
        const selectionString = selection.toString();
        const {anchorNode, focusNode} = selection;
        if (!selectionString || !anchorNode || !focusNode) {
            return;
        }
        let targetNode;
        if (anchorNode === focusNode) {
            targetNode = anchorNode;
        } else if (anchorNode.contains(focusNode)) {
            targetNode = focusNode;
        } else if (focusNode.contains(anchorNode)) {
            targetNode = anchorNode;
        } else {
            targetNode = focusNode;
        }
        if (targetNode.outerHTML === undefined) {
            targetNode = targetNode.parentNode;
        }
        targetNode.outerHTML = createTrustedHTML(await renderContent(decodeBase64AndURI(selectionString)));
        selection.removeAllRanges();
    };

    const addDecodeButton = (quoteButtonContainer) => {
        if (!quoteButtonContainer?.matches?.('div') ||
            quoteButtonContainer.closest('.error-page') ||
            document.getElementById('decode-selection-button')) {
            return;
        }
        const decodeButtonContainer = document.createElement('span');
        decodeButtonContainer.innerHTML = createTrustedHTML(`
            <button title="解码" id="decode-selection-button" class="btn-flat btn btn-icon-text" type="button">
                ${DECODE_ICON}
                <span class="d-button-label">解码</span>
            </button>
        `);
        quoteButtonContainer.appendChild(decodeButtonContainer);
        const decodeSelectionButton = document.getElementById('decode-selection-button');
        decodeSelectionButton.addEventListener('click', () => {
            decodeSelectionButton.disabled = true;
            setTimeout(() => {
                decodeSelectionButton.disabled = false;
            }, 1000);
            convertSelection();
        });
    };

    const matchRegExp = new RegExp(`(?:^|\\s)${escapeRegExpOutsideCharacterClass(APPEND_DECODE_BUTTON_TARGET_CLASS)}(?:\\s|$)`, 'u');

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.matches?.(`.${APPEND_DECODE_BUTTON_TARGET_CLASS}`)) {
                        addDecodeButton(node);
                    }
                    for (const el of node.getElementsByClassName?.(APPEND_DECODE_BUTTON_TARGET_CLASS) || []) {
                        addDecodeButton(el);
                    }
                }
            } else if (mutation.type === 'attributes') {
                if (mutation.attributeName === 'class') {
                    if (!matchRegExp.test(mutation.oldValue ?? '') &&
                        mutation.target.matches?.(`.${APPEND_DECODE_BUTTON_TARGET_CLASS}`)) {
                        addDecodeButton(mutation.target);
                    }
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributeFilter: ['class'],
        attributeOldValue: true,
    });

    for (const el of document.getElementsByClassName(APPEND_DECODE_BUTTON_TARGET_CLASS)) {
        addDecodeButton(el);
    }
})();
