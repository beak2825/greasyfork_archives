// ==UserScript==
// @name        Bing URL Shorten
// @namespace   https://github.com/wzshiming/userscripts
// @version     0.1.2
// @description Mark Bing URL Shortest.
// @author      wzshiming
// @match       *://*.bing.com/*
// @grant       none
// @icon        https://www.bing.com/favicon.ico
// @supportURL  https://github.com/wzshiming/userscripts/issues
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/479139/Bing%20URL%20Shorten.user.js
// @updateURL https://update.greasyfork.org/scripts/479139/Bing%20URL%20Shorten.meta.js
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
        'form', 'sp', 'lq', 'pq', 'sc', 'qs', 'sk', 'cvid', 'ghsh', 'ghacc', 'ghpl',
        'FPIG', 'FORM', 'mkt',
        'asbe', 'filters',
    ];
    nurl = rmqs(nurl, qs);

    var qseq = [['first', '1']];
    nurl = rmqseq(nurl, qseq);

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

function rmqseq(url, qseq) {
    url = new URL(url);
    qseq.forEach(function (i) {
        if (url.searchParams.get(i[0]) == i[1]) {
            url.searchParams.delete(i[0]);
        }
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
