// ==UserScript==
// @name         leetcode enhanced code editor
// @homepageURL  https://discord.gg/keybypass
// @description  unlocks Intellisense on leetcode for free
// @author       d15c0rdh4ckr (768868463459434517)
// @match        https://leetcode.com/*
// @run-at       document-start
// @version      1.0
// @license      MIT
// @supportURL   https://discord.gg/keybypass
// @icon         https://files.catbox.moe/5hnfoq.png
// @namespace https://greasyfork.org/users/1237543
// @downloadURL https://update.greasyfork.org/scripts/502740/leetcode%20enhanced%20code%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/502740/leetcode%20enhanced%20code%20editor.meta.js
// ==/UserScript==

let oldDocHeadAppendChild = document.head.appendChild;

document.head.appendChild = function (element) {
    if (!(element?.src && element.src.includes("monaco"))) {
        return oldDocHeadAppendChild.call(document.head, element);
    }
    element.onload = patchMonaco;
    return oldDocHeadAppendChild.call(document.head, element);
}

let overrideOptions = {
    selectionHighlight: true,
    parameterHints: {
        enabled: true
    },
    hover: {
        enabled: true
    },
    quickSuggestions: true,
    suggestOnTriggerCharacters: true,
    "bracketPairColorization.enabled": true,
};

function patchMonaco() {
    let oldEditorUpdateOptions = monaco.editor.getEditors()[0].updateOptions;
    monaco.editor.getEditors()[0].updateOptions = function (options) {
        return oldEditorUpdateOptions.call(this, { ...options, ...overrideOptions });
    }
}