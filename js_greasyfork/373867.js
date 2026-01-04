// ==UserScript==
// @name         Save to Zotero
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make Zotero's boorkmarklet a user script (click the button 'Zotero!' on bottom right)
// @author       SLAPaper
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373867/Save%20to%20Zotero.user.js
// @updateURL https://update.greasyfork.org/scripts/373867/Save%20to%20Zotero.meta.js
// ==/UserScript==

function loader() {
    // content of https://www.zotero.org/bookmarklet/loader.js
    var a = document.getElementById('zotero-iframe');
    if (a) {
        return void a.contentWindow.postMessage(['progressWindow.reopen', null], '*');
    }
    a = document.createElement('iframe');
    a.id = 'zotero-iframe';
    a.style.display = 'none';
    a.style.borderStyle = 'none';
    a.setAttribute('frameborder', '0');
    a.src = (
        'javascript:(function(){document.open();try{window.parent.document;}catch(e){document.domain="' +
        document.domain.replace(/[\\\"]/g, '\\$0') +
        '";}document.write(\'<!DOCTYPE html><html><head><script src="' +
        'https://www.zotero.org/bookmarklet/common.js' +
        '"></script><script src="' +
        'https://www.zotero.org/bookmarklet/inject.js' +
        '"></script></head><body></body></html>\');document.close();})()'
    );

    var tag = document.body || document.documentElement;
    tag.appendChild(a);
}

(function () {
    'use strict';
    var d = document;
    var div = d.createElement('div');
    div.id = 'div-save-to-zotero';
    div.style.position = 'fixed';
    div.style.bottom = '-0.1rem';
    div.style.right = '-0.2rem';
    div.style.zIndex = '999';

    var btn = d.createElement('button');
    btn.id = 'btn-save-to-zotero';
    btn.innerText = 'Zotero!';
    btn.onclick = loader;
    div.appendChild(btn);

    (d.body ? d.body : d.documentElement).appendChild(div);
})();