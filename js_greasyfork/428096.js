// ==UserScript==
// @name         JSON Format
// @description  format json for Chromium based browsers
// @namespace    https://www.kookxiang.com/
// @version      1.0
// @author       kookxiang
// @match        https://*/*
// @match        http://*/*
// @grant        GM_addElement
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/428096/JSON%20Format.user.js
// @updateURL https://update.greasyfork.org/scripts/428096/JSON%20Format.meta.js
// ==/UserScript==

if (document.all.length === 4 && document.contentType === 'application/json') {
    var interval;
    var pre = document.querySelector('pre');

    pre.innerHTML = JSON.stringify(JSON.parse(pre.innerHTML), null, 2);
    pre.className = 'language-json';

    GM_addElement('script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.0.1/highlight.min.js', onload: 'hljs.highlightElement(document.querySelector("pre"))' });
    GM_addElement('link', { rel: "stylesheet", type: "text/css", href: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.0.1/styles/github.min.css" });
}