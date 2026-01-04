// ==UserScript==
// @name         music only
// @namespace    http://tampermonkey.net/
// @include      https://www.youtube.com/*
// @version      0.69
// @description  try to take over the world!
// @author       tuwuna
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408254/music%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/408254/music%20only.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';
    let a = document.getElementsByClassName('ytd-rich-grid-video-renderer');
    for (let i = a.length - 1; i >= 0; i--) {
        if (a[i].id != 'dismissable') continue;
        let s = a[i].children[1].children[1].children[0].children[1].children[0].getAttribute('aria-label');
        if (s == null) continue;
        if (!s.includes(' - ')) a[i].remove();
    }
    a = document.getElementsByClassName('title');
    for (let i = 0; i < a.length; i++) {
        if (a[i].children[0] == undefined) continue;
        let s = a[i].children[0].innerText;
        if (typeof s != 'string') continue;
        console.log(s);
        if (s.includes('  ')) continue;
        let sad = document.getElementById('upnext');
        if (sad == null) continue;
        if (sad.innerText == 'Up next' && !s.includes(' - ')) {
            document.getElementById('content').remove();
        }
    }
}, 100);
