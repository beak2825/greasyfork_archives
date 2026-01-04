// ==UserScript==
// @name         Notion Tags
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Makes Notion better - #tags decoration
// @author       Andreas Huttenrauch
// @match        https://www.notion.so/*
// @grant        GM_log
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/384589/Notion%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/384589/Notion%20Tags.meta.js
// ==/UserScript==

var debug = false;

LOG ("starting up");
GM_addStyle('div.gwstagblock { }');
GM_addStyle('div.gwstagblock tag { padding: 1px 5px; font-weight: bold; background: red; border-radius: 5px; color: white; }');

// create an observer instance
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        var target = false;
        if ( mutation.target.nodeName == "DIV" ) target = mutation.target;
        else target = mutation.target.parentElement;
        if ( target.getAttribute("contentEditable") == "true" ) target = target.parentElement;
        if ( ! target ) return;
        findtags(target);
    });
});
var config = { characterData: true, attributes: false, childList: true, subtree: true };
var mutgt = document.body;
observer.observe(mutgt, config);
var lastBlock = false;

function findtags(elm) {
    elm = elm || document;
    //if ( typeof elm.querySelectorAll !== 'function' ) return;
    var blocks = elm.querySelectorAll("div[contenteditable='true']");
    blocks.forEach(function(el) {
        var s = el.textContent
        if ( s.indexOf("#") != -1 || el.classList.contains("gwstagblock")) {
            markuptags(el);
        }
    })
}

function replaceTags(text, html) {
    var matches = text.match(/(?:^|\s)(#[^\n\s\t]+)/g);
    if ( matches ) {
        for (var i=0; i<matches.length; i++) {
            var word = matches[i].trim();
            if ( html.indexOf('<tag>'+word+'</tag>') == -1 ) {
                html = html.replace(word, '<tag>'+word+'</tag>');
            }
        }
    }
    matches = html.match(/<tag>([^#].*?)<\/tag>/g);
    if ( matches ) {
        for (i=0; i<matches.length; i++) {
            html = html.replace('<tag>'+matches[i]+'</tag>', matches[i]);
        }
    }
    return html;
}

function removeTags(html) {
    var matches = html.match(/<tag>(.*?)<\/tag>/g);
    if ( matches ) {
        for (var i=0; i<matches.length; i++) {
            html = html.replace('<tag>'+matches[i]+'</tag>', matches[i]);
        }
    }
    return html;
}

function lostFocusEvent() {
    if (document.activeElement === lastBlock) return;
    document.removeEventListener('keyup', lostFocusEvent);
    document.removeEventListener('click', lostFocusEvent);
    markuptags(lastBlock);
}

function markuptags(element) {
    var isFocused = (document.activeElement === element);
    var text = element.textContent;
    var html = element.innerHTML;
    if ( isFocused ) {
        var untagged = removeTags(html);
        if ( untagged != html ) {
            element.innerHTML = untagged;
        }
        lastBlock = element;
        document.addEventListener('keyup', lostFocusEvent);
        document.addEventListener('click', lostFocusEvent);
        return;
    }
    var tagged = replaceTags(text, element.innerHTML);
    if ( element.innerHTML == tagged ) return;
    element.innerHTML = tagged;
    if ( text.indexOf("#") != -1 ) {
        if ( ! element.classList.contains("gwstagblock") ) {
            LOG("markuptags found: "+text);
            element.classList.add("gwstagblock");
        }
    } else if ( element.classList.contains("gwstagblock") ) {
        LOG("removing tag from: "+text);
        element.classList.remove("gwstagblock");
    }
}

function LOG(...args) {
    if (!debug) return
    console.log('[Notion UserScript]', ...args)
}


