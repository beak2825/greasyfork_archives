// ==UserScript==
// @name          netdna-storage bypass clicker
// @namespace     https://github.com/JonnyShuali/netdna-storage-click-bypass
// @description   Bypass the clicking on netdna-storage.
// @version       6
// @include       http://www.netdna-storage.com/f/*
// @include       http://www.netdna-storage.com/step/*
// @include       http://netdna-storage.com/f/*
// @include       http://netdna-storage.com/step/*
// @include       https://www.netdna-storage.com/f/*
// @include       https://www.netdna-storage.com/step/*
// @include       https://netdna-storage.com/f/*
// @include       https://netdna-storage.com/step/*
// @run-at        document-start
// @grant         GM_xmlhttpRequest 
// @downloadURL https://update.greasyfork.org/scripts/36107/netdna-storage%20bypass%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/36107/netdna-storage%20bypass%20clicker.meta.js
// ==/UserScript==



GM_xmlhttpRequest({
    method: 'GET',
    url: window.location.href,
    onload: function(response) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(response.responseText, 'text/html');
        if (doc === null) {
            return;
        }
        var g = doc.getElementsByClassName('plan-footer-item');
        for (var i = 0; i < g.length; i++) {
            if (g[i].getAttribute('href')) {
                location.assign(g[i].getAttribute('href'));
            }
        }
    }
});