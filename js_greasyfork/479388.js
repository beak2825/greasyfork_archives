// ==UserScript==
// @name         Markdown Viewer
// @namespace    muvsado
// @version      0.5.9
// @description  Simple Markdown viewer
// @require      https://cdn.jsdelivr.net/npm/marked@17.0.1/lib/marked.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/marked-gfm-heading-id@4.1.3/lib/index.umd.min.js
// @match        file:///*.md
// @match        file:///*.markdown
// @license      Public Domain
// @downloadURL https://update.greasyfork.org/scripts/479388/Markdown%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/479388/Markdown%20Viewer.meta.js
// ==/UserScript==

// Remove default Firefox styles
let styles = document.querySelectorAll('link[rel="stylesheet"]');
for (let i = 0; i < styles.length; i++) {
    styles[i].remove();
}

marked.use(markedGfmHeadingId.gfmHeadingId());

document.body.innerHTML = marked.parse(document.body.textContent);