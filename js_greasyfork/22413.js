// ==UserScript==
// @name         DLE links decoder
// @namespace    lainscripts_dle_links_decoder
// @version      1.3
// @description  Прямые ссылки на сайтах с движком DataLife Engine (DLE)
// @author       lainverse
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22413/DLE%20links%20decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/22413/DLE%20links%20decoder.meta.js
// ==/UserScript==
// Script based on a similar script by raletag:
// https://greasyfork.org/en/scripts/22290-Прямые-ссылки-в-dle

(function() {
    'use strict';

    var impCodes = '%3B%2C%2F%3F%3A%40%26%3D%2B%24%23',
        impRegex = new RegExp((impCodes.replace(/%/g,'|%').replace('|','')), 'gi'),
        impDecoded = decodeURIComponent(impCodes),
        impReplacer = function(ch) {
            return impDecoded[impCodes.indexOf(ch.toUpperCase())/3];
        };
    function decodeImportant(text) {
        return text.replace(impRegex, impReplacer);
    }

    function linkHandler(e){
        var link = e.target, url = link.href, url64;

        // Detach event from a link since we don't need to parse it more than once
        link.removeEventListener('mouseenter', linkHandler, false);

        // Check if it's one of the DLE-redirected links and exit if not
        url64 = (url.match(/([?&]url=|\/leech_out\.php\?.:)([^&]+)(&|$)/i)||[])[2];
        if (!url64) {
            return true;
        }

        // Try to decode base64 encoded link, if fails then take it as-is
        try {
            url64 = decodeURIComponent(url64);
            url = window.atob(url64);
        } catch(ignore) {
            url = url64;
        }

        // Decode important %-encoded parts of a link (browser should handle the rest)
        url = decodeImportant(url);

        // Replace target with decoded link and make it open in a new tab by default
        console.log('Replaced ' + link.href + ' with ' + url);
        link.href = url;
        link.target = '_blank';

        return true;
    }

    // Get a list of all link in a given object and attach mouseover event to it
    function attachEventToLinks(root) {
        var links = root.querySelectorAll('a[href]'),
            i = links.length;
        while(i--) {
            links[i].addEventListener('mouseenter', linkHandler, false);
        }
    }

    // Parse all existing links
    attachEventToLinks(document);

    // Monitor changes to the document structure and attach events to all new links
    var o = new MutationObserver(function(ms){
        ms.forEach(function(m){
            m.addedNodes.forEach(function(n){
                if (n.nodeType !== Node.ELEMENT_NODE) {
                    return; // parse only document elements and skip the rest
                }
                if (n.href) {
                    n.addEventListener('mouseenter', linkHandler, false);
                    return; // if node is a link attach event and exit since we
                    // don't want to parse link's content (links within links?!)
                }
                attachEventToLinks(n);
            });
        });
    });
    o.observe(document, {childList: true, subtree: true});
})();