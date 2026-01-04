// ==UserScript==
// @name         Nyaa hide 0 seeders
// @namespace    zeusex81@gmail.com
// @version      1.3
// @description  Hide torrent with 0 seeders
// @include      https://nyaa.si/*
// @include      https://sukebei.nyaa.si/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370004/Nyaa%20hide%200%20seeders.user.js
// @updateURL https://update.greasyfork.org/scripts/370004/Nyaa%20hide%200%20seeders.meta.js
// ==/UserScript==

(function() {
    var mode = 0;
    var styles = [];
    styles[0] = document.createElement('STYLE');
    styles[0].innerHTML = '.noSeeders { display: none; }';
    styles[1] = document.createElement('STYLE');
    styles[1].innerHTML = '.noSeeders { font-style: italic; }';
    document.head.appendChild(styles[0]);
    var today = new Date() - 12*60*60*1000;
    var nodes = document.querySelectorAll('table.torrent-list td:nth-child(5)');
    for(var i = 0; i < nodes.length; ++i) {
        if(Date.parse(nodes[i].textContent) > today)
            nodes[i].parentNode.style = 'font-weight: bold;';
        else if(nodes[i].nextElementSibling.textContent == '0')
            nodes[i].parentNode.classList.add('noSeeders');
    }
    addEventListener('keyup', function(e) {
        if(e.keyCode == 72 /* H key */ && document.activeElement.tagName != 'INPUT') {
            document.head.removeChild(styles[mode]);
            mode = (mode+1) % 2
            document.head.appendChild(styles[mode]);
        }
    });
})();