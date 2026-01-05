// ==UserScript==
// @name            Direct links
// @name:ru         Прямые ссылки
// @namespace       FIX
// @version         0.0.17
// @description     Direct links out
// @description:ru  Замена ссылок на прямые. Высокое быстродействие в сравнении с аналогичными скриптами.
// @copyright       2016-2017, raletag
// @author          raletag
// @match           *://*/*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/22667/Direct%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/22667/Direct%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.time('Direct links load');
    var doc = (document.body !== null ? document.body : document),
        r0 = /(\/(share|intent\/tweet|submitlink|submit)([^?]*)\?|api\.addthis\.com\/oexchange|cms\/\?url=|downloads\.sourceforge\.net|translate\.google\.)/i, // exclude
        r1 = /[?&](url|r|p|z|to|u|go|goto|q|st\.link|link|href|redirect_url)=([^&]+)(&|$)/i,
        r2 = /(\/leech_out\.php\?.:|\/phpBB2\/goto\/|\/go\/\?)(.+)/i, // Dude Smart Leech (DLE), phpBB2
        r3 = /outgoing\.prod\.mozaws\.net\/v1\/([^/]+)\/(.+)/i, // addons.mozilla.org
        r4 = /([^:]+):([^:]+)(|$)/, // Disqus FIX
        impCodes = '%3B%2C%2F%3F%3A%40%26%3D%2B%24%23',
        impRegex = new RegExp((impCodes.replace(/%/g,'|%').replace('|','')), 'gi'),
        impDecoded = decodeURIComponent(impCodes),
        impReplacer = function(ch) {
            return impDecoded[impCodes.indexOf(ch.toUpperCase())/3];
        },
        decodeImportant = function (text) {
            return text.replace(impRegex, impReplacer);
        };

    function Handler (e) {
        console.time('HandlerTime');
        try {
        var link = e.target, url = link.href, tourl;
        while (!url && link !== this) {
            link = link.parentNode;
            url = link.href;
        }
        link.removeEventListener('mouseenter', Handler, false);
        if (!url || typeof url !== 'string' || url.length < 5 || r0.test(url)) {
            return;
        }
        tourl = ((url.match(r1) || url.match(r2) || url.match(r3) || [])[2]);
        if (!tourl) {
            return;
        }
        try {
            tourl = decodeURIComponent(tourl);
            tourl = window.atob(tourl);
            tourl = decodeURIComponent(tourl);
            tourl = escape(tourl);
        } catch (err) {
        }
        tourl = decodeImportant(tourl);
        tourl = ((tourl.match(r4)||[])[0]);
        if (tourl && tourl.match(/^http(|s):\/\//i)) {
            console.group("Direct links");
            console.info(url);
            console.info(tourl);
            link.removeAttribute('onclick');
            link.rel = 'noreferrer';
            link.href = tourl;
            console.timeEnd('HandlerTime');
            console.groupEnd();
        }
        } catch (err) {
            console.error('Direct links error: ' + err);
            console.timeEnd('HandlerTime');
            alert('Direct links error: ' + err);
        }
        return;
    }

    function attachEvent (e) {
        for (var links = e.querySelectorAll('a[href*="/"], a[href*="?"]'), i = links.length - 1; i >= 0; --i) {
            links[i].addEventListener('mouseenter', Handler, false);
        }
    }

    attachEvent(doc);

    new MutationObserver(function(ms) {
        var m, n;
        for (m of ms) {
             for (n of m.addedNodes) {
                if (n.nodeType === Node.ELEMENT_NODE) {
                    if (n.href) {
                        n.addEventListener('mouseenter', Handler, false);
                    } else {
                        attachEvent(n);
                    }
                }
            }
        }
    }).observe(doc, {childList: true, subtree: true});
    console.log('Direct links: ' + window.location.href);
    console.timeEnd('Direct links load');
})();