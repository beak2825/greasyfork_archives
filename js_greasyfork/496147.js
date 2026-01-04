// ==UserScript==
// @name         Login, Not Landing!
// @name:zh-CN   登录，不是登陆！
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Replaces ALL occurences of "登陆" with "登录".
// @description:zh-CN 用“登录”替换所有“登陆”。
// @author       PRO-2684
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      gpl-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496147/Login%2C%20Not%20Landing%21.user.js
// @updateURL https://update.greasyfork.org/scripts/496147/Login%2C%20Not%20Landing%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const log = console.log.bind(console, "[Login, Not Landing!]");
    let cnt = 0;
    // Actual text replacement
    const regex = new RegExp('登(\\s*)陆', 'g');
    function replace(text) {
        const replaced = text.replace(regex, (match, p1) => {
            cnt++;
            return `登${p1}录`;
        });
        const unchanged = text === replaced;
        return [unchanged, replaced];
    }
    // Whether to accept a node
    const accepted = [Node.TEXT_NODE, Node.ELEMENT_NODE];
    function accept(node) {
        return accepted.includes(node.nodeType) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
    // Process a node
    const attrs = ['title', 'alt', 'placeholder'];
    function processNode(node) {
        switch (node.nodeType) {
            case Node.TEXT_NODE: {
                const [unchanged, replaced] = replace(node.textContent);
                if (!unchanged) {
                    node.textContent = replaced;
                }
                break;
            }
            case Node.ELEMENT_NODE: {
                for (const attr of attrs) {
                    if (node.hasAttribute(attr)) {
                        const [unchanged, replaced] = replace(node.getAttribute(attr));
                        if (!unchanged) {
                            node.setAttribute(attr, replaced);
                        }
                    }
                }
                break;
            }
        }
    }
    // Walk the DOM and replace text
    const walker = document.createTreeWalker(document, NodeFilter.SHOW_ALL, accept);
    while (walker.nextNode()) {
        processNode(walker.currentNode);
    }
    // Log the results
    if (cnt === 0) {
        log("No occurence of \"登陆\" found.");
    } else {
        log(`Replaced ${cnt} occurence(s) of "登陆" with "登录".`);
    }
})();