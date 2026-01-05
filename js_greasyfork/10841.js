// ==UserScript==
// @name         Copy Magnets
// @namespace    http://rix.li/
// @version      0.3
// @description  Copy magnet links to clipboard
// @author       rix
// @match        *://www.tokyotosho.info/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_setClipboard
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/10841/Copy%20Magnets.user.js
// @updateURL https://update.greasyfork.org/scripts/10841/Copy%20Magnets.meta.js
// ==/UserScript==

var list = $('a[href^=magnet]');
var links = [];

list.each(function(){
    links.push(this.href);
});

list.click(function(e) {
    e.preventDefault();
    GM_setClipboard(this.href, 'text');
});

$('<div style="text-align: center; margin: 20px;"></div>').append(
    $('<button>Copy All</button>').click(function(e){
        GM_setClipboard(links.join('\n'));
        e.preventDefault();
    })
).insertBefore('.listing');
