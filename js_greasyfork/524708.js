// ==UserScript==
// @name        Highlight Selected Text
// @description A context menu item which highlights selected text.
// @author      Schimon Jehudah, Adv.
// @namespace   i2p.schimon.highlight-selected-text-context-menu
// @homepageURL https://greasyfork.org/scripts/524708-highlight-selected-text
// @supportURL  https://greasyfork.org/scripts/524708-highlight-selected-text/feedback
// @copyright   2025, Schimon Jehudah (http://schimon.i2p)
// @license     Public Domain
// @exclude     devtools://*
// @match       file:///*
// @match       *://*/*
// @version     25.01
// @run-at      context-menu
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5aN77iPPC90ZXh0Pjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/524708/Highlight%20Selected%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/524708/Highlight%20Selected%20Text.meta.js
// ==/UserScript==

(function colorSelectedText() {
    const selection = document.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.color = 'black';
    span.style.background = 'khaki';
    range.surroundContents(span);
})();
