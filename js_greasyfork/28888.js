// ==UserScript==
// @name         HPMOR Footnote
// @namespace    http://youmu.moe/
// @version      0.3
// @description  Footnote support
// @author       Shuhao Tan
// @match        http://hpmor.lofter.com/post/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28888/HPMOR%20Footnote.user.js
// @updateURL https://update.greasyfork.org/scripts/28888/HPMOR%20Footnote.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findFootnotenodes(id) {
        var xpath_finder;
        var elems = [];
        var i;
        xpath_finder = document.evaluate('//p[contains(.,"[' + id + ']")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
        for(i = 0; i < xpath_finder.snapshotLength; i++) {
            elems.push(xpath_finder.snapshotItem(i));
        }
        xpath_finder = document.evaluate('//p[contains(.,"［' + id + '］")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
        for(i = 0; i < xpath_finder.snapshotLength; i++) {
            elems.push(xpath_finder.snapshotItem(i));
        }
        return elems;
    }

    function findFootnodeStart() {
        var elems;
        var i;
        elems = findFootnotenodes(1);
        if(elems.length === 0) {
            return null;
        }
        for(i = 0; i < elems.length; i++) {
            if(elems[i].textContent.match(/^\s*[\[［]1[］\]]/i)) {
                return elems[i];
            }
        }
    }

    function isFootnote(elem) {
        return elem && elem.textContent.match(/^\s*[\[［]\d+[］\]]/i);
    }

    function generateFootnote(elem) {
        var id = elem.textContent.match(/^\s*[\[［](\d+)[］\]]/i)[1];
        var pattern = "([\\[［]" + id + "[］\\]])";
        var regex = new RegExp(pattern, 'g');
        var elems = findFootnotenodes(id);
        var foottext = elem.textContent.replace('"', '&quot;').replace(/^\s*[\[［]\d+[］\]]/i, '');
        var i;
        elem.setAttribute('id', 'footnote_' + id);
        for(i = 0; i < elems.length; i++) {
            if(elems[i] != elem) {
                elems[i].innerHTML = elems[i].innerHTML.replace(regex, '<a footnote="' + foottext + '" class="body_footnote" href="#footnote_' + id + '">$1</a>');
            }
        }
    }

    var elem = findFootnodeStart();
    if(!elem) {
        return;
    }
    while(isFootnote(elem)) {
        generateFootnote(elem);
        elem = elem.nextElementSibling;
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('a.body_footnote { width:auto; position:relative; }');
    addGlobalStyle('a.body_footnote::after {line-height: 1.3em; opacity: 0; transition: opacity linear 150ms; border-radius: 3px; background: #444; width: 300px; color: #ccc; content: attr(footnote);padding: 5px;left: -5px;top: 100%; margin-top: 7px; position: absolute;z-index: 1;pointer-events: none;word-wrap: break-word; }');
    addGlobalStyle('a.body_footnote:hover::after, a.body_footnote:hover::before {opacity: 1;}');
    addGlobalStyle('a.body_footnote::before {opacity: 0; transition: opacity linear 150ms;width: 0;height: 0;border: solid;border-color:#444 transparent;border-width:0 6px 6px 6px;left: 3px;margin-top: 1px; content: "";top: 100%;position: absolute;z-index: 1;pointer-events: none;');
})();