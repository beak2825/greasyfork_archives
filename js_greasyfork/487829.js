// ==UserScript==
// @name        Tistory Copyright Remover
// @namespace   TCM_V1
// @version     1.0
// @description remove tistory copyright notation when copying content
// @author      Laria
// @match       https://*.tistory.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=tistory.com
// @grant       none
// @license     MIT
// @encoding    utf-8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/487829/Tistory%20Copyright%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/487829/Tistory%20Copyright%20Remover.meta.js
// ==/UserScript==

function copyWithSource (event) {
    const range = window.getSelection().getRangeAt(0);
    const contents = range.cloneContents();
    const temp = document.createElement('div');
    temp.appendChild(contents);
    event.clipboardData.setData('text/plain', temp.innerText);
    event.clipboardData.setData('text/html', '<pre data-ke-type="codeblock">' + temp.innerHTML + '</pre>');
    event.preventDefault();
}

document.addEventListener('copy', copyWithSource);