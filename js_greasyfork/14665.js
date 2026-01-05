// ==UserScript==
// @name         Hide backticks on Hackpad
// @namespace    http://zesty.ca/
// @version      1.2
// @description  Hide the ugly backticks around code-formatted text on Hackpad.
// @author       Ka-Ping Yee
// @match        https://*.hackpad.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14665/Hide%20backticks%20on%20Hackpad.user.js
// @updateURL https://update.greasyfork.org/scripts/14665/Hide%20backticks%20on%20Hackpad.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

if (typeof ace !== 'undefined') {
    // Make backticks very small and almost invisible.  We don't set them
    // to display: none because that screws up the editor; you still have to
    // be able to insert and delete backticks to control formatting.
    addGlobalStyle('span { font-weight: normal; opacity: 0.9; }');
    addGlobalStyle('ul.listtype-code, div#sidediv, span.code { font-size: 95%; color: #600; }');
    addGlobalStyle('span.code { border-radius: 0; margin: 0 !important; padding: 1px 3px !important; box-shadow: none; background: #f4f4f4; }');
    addGlobalStyle('span.code.hidebackticks { user-select: none; font-size: 6px; font-family: arial; opacity: 0.2; margin: 0 -1px !important; padding: 1px 0 !important; }');
    addGlobalStyle('ul.listtype-code { margin-left: 26px; background: #f4f4f4; line-height: 1.1; }');
    addGlobalStyle('ul.listtype-code li { padding: 2px 3px; margin: 0 !important; }');
    addGlobalStyle('div#sidediv div { color: #ddd !important; margin-top: -2px; }');
    addGlobalStyle('a.lang-menu { border-bottom: none; color: #8c8; }');

    var originalAceEditor = ace.editor;
    ace.editor = function(a, b) {
        var result = new originalAceEditor(a, b);
        var originalGetSpansForLine = result.getSpansForLine;

        result.getSpansForLine = function(dummy, appender) {
            originalGetSpansForLine.call(result, dummy, function(text, cls) {
                if (cls.match(/ code$/)) {
                    // We can't delete the backticks altogether or the next
                    // pass of the formatter won't be able to tell that the
                    // text should still be monospaced.  So, we make separate
                    // spans for the backticks and use CSS to hide them.
                    text = text.replace(/^`(.*)`$/, '$1');
                    appender('`', cls + ' hidebackticks');
                    appender(text, cls);
                    appender('`', cls + ' hidebackticks');
                } else appender(text, cls);
            });
        };
        return result;
    };
}

// Whenever the user completes a text selection, this adjusts the ends of the
// selection to avoid picking up leading or trailing backticks.
document.body.addEventListener('mouseup', function() {
    var sel = window.getSelection();
    if (sel.rangeCount === 0) return;
    var range = sel.getRangeAt(0);
    var start = range.startContainer, soff = range.startOffset;
    var end = range.endContainer, eoff = range.endOffset;
    if (!start || !end || start === end) return;
    while (true) {
        if (start === end) break;
        if (start.textContent.substring(soff).trim() === '' ||
            start.parentNode.className.match(/ hidebackticks$/)) {
            start = start.parentNode.nextSibling.childNodes[0];
            soff = 0;
            range.setStart(start, soff);
            continue;
        }
        if (end.textContent.substring(0, eoff).trim() === '' ||
            end.parentNode.className.match(/ hidebackticks$/)) {
            end = end.parentNode.previousSibling.childNodes[0];
            eoff = end.textContent.length;
            range.setEnd(end, eoff);
            continue;
        }
        break;
    }
    sel.empty();
    sel.addRange(range);
});
