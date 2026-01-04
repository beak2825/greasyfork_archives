// ==UserScript==
// @name Github Markdown Mod
// @namespace https://greasyfork.org/users/676264
// @version 0.0.1.20201220180616
// @description Make Github Markdown headers more visible
// @author V1rgul (https://github.com/V1rgul)
// @license CC BY-NC - Creative Commons Attribution-NonCommercial
// @grant GM_addStyle
// @run-at document-start
// @match *://*.github.com/*
// @downloadURL https://update.greasyfork.org/scripts/408758/Github%20Markdown%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/408758/Github%20Markdown%20Mod.meta.js
// ==/UserScript==

(function() {
let css = `
@namespace url(http://www.w3.org/1999/xhtml);
.markdown-body {
    font-family: 'Segoe UI', sans-serif;
}
/* HEADERS */
.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
    border: none;
    padding: 0;
    line-height: normal;
    margin: 0.5em 0 0.1em 0;
}
.markdown-body h1 {
    text-align: center;
}
.markdown-body h1 {
    font-size: 6em;
}

.markdown-body h2 {
    color: #0366d6;
    font-size: 5em;
}
.markdown-body h3 {
    font-size: 3em;
}
.markdown-body h4 {
    color: #0366d6;
    font-size: 2em;
}
.markdown-body h5 {
    font-size: 1.2em;
}

/* LISTS */
.markdown-body ul,
.markdown-body ol {
    list-style-type: none;
    position: relative;
    padding-left: 1.6em;
}

.markdown-body ul:not(.contains-task-list) > li:before,
.markdown-body ol > li:before {
    position: absolute;
    left: 0.1em;
    display: inline-block;
}
.markdown-body ul:not(.contains-task-list) > li:before {
    color: #0366d6;
    content: "\\25AA";
    font-size: 40px;
    line-height: 20px;
    position: absolute;
    left: 0.1em;
    display: inline-block;
    vertical-align: baseline;
}
.markdown-body ul > li > ul:not(.contains-task-list) > li:before {
    content: "\\25AB";
}
.markdown-body ul > li > ul > li > ul:not(.contains-task-list) > li:before {
    content: "\\25AA";
    font-size: 20px;
    left: 0.25em;
}
.markdown-body ul > li > ul > li > ul > li > ul:not(.contains-task-list) > li:before {
    content: "\\25AB";
}

.markdown-body ol {
    counter-reset: item;
}
.markdown-body ol > li {
    counter-increment: item;
}
.markdown-body ol > li:before {
    content: counter(item) ". ";
    color: #0366d6;
    font-weight: bold;
}
.markdown-body ol > li > ol > li:before {
    content: counter(item, lower-roman) ". ";
}
.markdown-body ol > li > ol > li > ol > li:before {
    content: counter(item, lower-latin) ". ";
}

.markdown-body blockquote, .markdown-body details, .markdown-body dl, .markdown-body ol, .markdown-body p, .markdown-body pre, .markdown-body table, .markdown-body ul {
    margin-top: 0;
    margin-bottom: 8px;
}

/* CODE */
.markdown-body code,
.markdown-body pre,
.markdown-body .highlight pre {
    /*border: 1px solid rgba(153, 204, 255, .5);*/
    /*background: #F1F8FF;/*rgba(00,22,44,0.07);*/
    background: rgba(91, 122, 153, .1);
    border-radius: 2px;
    color: #191d21;
}

html[data-color-mode="dark"] .markdown-body code,
html[data-color-mode="dark"] .markdown-body pre,
html[data-color-mode="dark"] .markdown-body .highlight pre {
    color: #edf6ff;
}


.markdown-body code {
    margin: 0 0.25em;
    padding: .2em .5em;
}
.markdown-body pre,
.markdown-body .highlight pre {
    padding: 0.5em 1.5em;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
