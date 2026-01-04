// ==UserScript==
// @name        Google URL Shorten
// @namespace   https://github.com/wzshiming/userscripts
// @version     0.1
// @description Mark Google URL Shortest.
// @author      wzshiming
// @match       *://*.google.com/*
// @grant       none
// @icon        https://www.google.com/favicon.ico
// @supportURL  https://github.com/wzshiming/userscripts/issues
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/479141/Google%20URL%20Shorten.user.js
// @updateURL https://update.greasyfork.org/scripts/479141/Google%20URL%20Shorten.meta.js
// ==/UserScript==

(function () {
    'use strict';
    sturl();
    window.addEventListener('locationchange', function () {
        sturl();
    })
})();

function sturl() {
    var url = window.location.href;
    var nurl = window.location.href;
    var qs = [
        'newwindow', 'sca_esv', 'sxsrf', 'source', 'ei', 'iflsig', 'ved', 'uact', 'gs_lp', 'sclient', 'oq',
    ];
    nurl = rmqs(nurl, qs);

    if (url == nurl) {
        return false;
    }

    window.history.replaceState(null, null, nurl);
}

function rmqs(url, qs) {
    url = new URL(url);
    qs.forEach(function (i) {
        url.searchParams.delete(i);
    });
    return url.toString();
}

/*----force listen to locationchange work start----*/
history.pushState = (f => function pushState() {
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.pushState);

history.replaceState = (f => function replaceState() {
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.replaceState);

window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'))
});
/*----force listen to locationchange work end----*/
