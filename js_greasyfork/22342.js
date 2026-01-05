// ==UserScript==
// @name        NBC Olympics Video Spoilers Hider
// @namespace   driver8.net
// @description Hide potential spoilers on NBC Olympics video pages
// @match       *://www.nbcolympics.com/video/*
// @match       *://stream.nbcolympics.com/*
// @version     0.2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22342/NBC%20Olympics%20Video%20Spoilers%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/22342/NBC%20Olympics%20Video%20Spoilers%20Hider.meta.js
// ==/UserScript==

LOGGING = false;
function log(msg) {
    LOGGING && console.log(msg);
}
log('Hello, Olympics');

function qs(q) {  return document.querySelector(q); }
function qsa(q) { return document.querySelectorAll(q); }

var i = 0;
if (document.location.href.indexOf('.com/video/') > -1) {
    (function wait() {
        log('wait ' + ++i);
        if (qs('.video-hub-replay a.ng-binding')) {
            log('yes ' + i);
            do_it();
        } else {
            log('no ' + i);
            window.setTimeout(wait, 200);
        }
    })();
} else if (document.location.href.indexOf('stream.nbcolympics.com/') > -1) {
    (function wait() {
        log('wait ' + ++i);
        if (qs('#block-olympics-breaking-news-breaking-news')) {
            log('yes ' + i);
            do_it();
        } else {
            log('no ' + i);
            window.setTimeout(wait, 200);
        }
    })();
}

function do_it() {
    var hides = qsa('div.home_tophl, div.latest-highlights, div.must-see-block, div.watch-block--live,' +
        '#midbanner, #parallax, #block-olympics-breaking-news-breaking-news');
    hides && [].forEach.call(hides, function (el) {
        log(el);
        el.parentNode.removeChild(el);
    });

    var obfs = qsa('.video-hub-replay a.ng-binding');
    log('obfs', obfs);
    obfs && [].forEach.call(obfs, function (el) {
        if (!el.href.match(/stream\.nbcolympics.com\//)) return;
        log(el);
        var m = el.href.match(/stream\.nbcolympics.com\/([\w\-]+)/);
        if (m && m[1]) {
            var linktitle = m[1].replace(/-/g, ' ');
            linktitle = linktitle.replace(/\b[a-z]/g, function (f) {
                return f.toUpperCase();
            });
            el.innerHTML = linktitle;
        }
    });

    var pics = qsa('.video-hub-replay li.list-item.ng-scope a.pic-thumbnail img');
    pics && [].forEach.call(pics, function (el) {
        log(el);
        el.parentNode.parentNode.style.backgroundColor = 'black';
        el.style.opacity = '0';
    });

    var loadbutton = qs('.video-hub-replay a.load-more-button');
    loadbutton.addEventListener('click', function(evt) {
        window.setTimeout( function() {
            log(evt);
            do_it();
        } , 200)
    });
}