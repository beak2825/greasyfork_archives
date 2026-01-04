// ==UserScript==
// @name         chordwiki行數
// @namespace    github.com/openstyles/stylus
// @version      1.0.0
// @description  A new userstyle
// @author       Me
// @match        https://ja.chordwiki.org/wiki/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/489659/chordwiki%E8%A1%8C%E6%95%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/489659/chordwiki%E8%A1%8C%E6%95%B8.meta.js
// ==/UserScript==

GM_addStyle(`
.main > div {
    counter-reset: paragraph-counter;
}

p.line:not(.comment)::before {
    margin-right: 12px;
    font-weight: 100;
    font-size: 12px;
    color: #6c757d;
    counter-increment: paragraph-counter;
    content: counter(paragraph-counter) ". ";
}
`);