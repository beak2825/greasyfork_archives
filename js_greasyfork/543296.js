// ==UserScript==
// @name         Danbooru Tag Picker
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Pick tags on Danbooru
// @author       DFlat
// @match        https://danbooru.donmai.us
// @match        https://danbooru.donmai.us/posts*
// @run-at document-end
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/543296/Danbooru%20Tag%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/543296/Danbooru%20Tag%20Picker.meta.js
// ==/UserScript==

async function onButtonClick(tag) {
    let current = await navigator.clipboard.readText();
    if (tag.indexOf('(') >= 0) {
        tag = tag.replaceAll('(', '\\(');
        tag = tag.replaceAll(')', '\\)');
    }
    if (current.endsWith(',')) {
        await navigator.clipboard.write([new ClipboardItem({"text/plain": `${current}${tag},`})]);
    } else {
        await navigator.clipboard.write([new ClipboardItem({"text/plain": `${tag},`})]);
    }
}

function addClearButton() {
    let anchor = document.querySelector("#tag-box h2");
    if (anchor == null) {
        anchor = document.querySelector("#tag-list .artist-tag-list");
    }
    let b = document.createElement("button");
    b.textContent = 'Clear Clipboard';
    b.onclick = async() => {
        await navigator.clipboard.write([new ClipboardItem({"text/plain": ""})]);
    };
    anchor.parentElement.insertBefore(b, anchor);
}


function main() {
    'use strict';
    addClearButton();
    let tags = document.getElementsByClassName("search-tag");
    for (let tag of tags) {
        let b = document.createElement("button");
        b.textContent = '➕';
        b.title = 'Copy tag';
        b.onclick = async() => await onButtonClick(tag.textContent);
        tag.parentElement.appendChild(b);
    }
}

main();

