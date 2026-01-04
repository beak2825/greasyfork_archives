// ==UserScript==
// @name         Styles for Markdown Viewer
// @namespace    muvsado
// @version      0.2.11
// @description  Cool CSS for Markdown Viewer
// @match        file:///*.md
// @match        file:///*.markdown
// @grant        GM_addStyle
// @run-at       document-start
// @license      Public Domain
// @downloadURL https://update.greasyfork.org/scripts/480759/Styles%20for%20Markdown%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/480759/Styles%20for%20Markdown%20Viewer.meta.js
// ==/UserScript==

GM_addStyle(`
    body {
        font-family: sans-serif;
    }

    p {
        margin: 15px 0;
    }

    a {
        border-bottom: 1px dotted;
        text-decoration: none;
    }

    h1, h2, h3 {
        margin: 16px 0 12px;
    }

    h1 {
        font-size: 1.5rem;
    }

    h2 {
        font-size: 1.25rem;
    }

    h3 {
        font-size: 1.1rem;
    }

    ul, ol {
        padding-left: 36px;
    }

    li {
        margin: 3px 0;
    }

    pre, code {
        background-color: #e0e0e0;
        font-size: 14px;
    }

    pre {
        border: 2px dotted #888;
        overflow-x: auto;
        padding: 3px;
    }

    table {
        border-collapse: collapse;
    }

    table td, th {
        border: 1px solid #cccccc;
        padding: 5px 7px;
    }
`);