// ==UserScript==
// @name         This Ain't A Phone
// @namespace    https://schiff.io
// @version      10
// @description  Automatically redirect from mobile webpages to the non-mobile equivalent
// @author       Hayden Schiff (oxguy3)
// @match        *://m.dailykos.com/*
// @match        *://m.facebook.com/*
// @match        *://m.imdb.com/*
// @match        *://mobile.nytimes.com/*
// @match        *://m.phys.org/*
// @match        *://m.sweclockers.com/*
// @match        *://mobile.twitter.com/*
// @match        *://m.mediawiki.org/*
// @match        *://*.m.wikibooks.org/*
// @match        *://m.wikidata.org/*
// @match        *://*.m.wikimedia.org/*
// @match        *://*.m.wikinews.org/*
// @match        *://*.m.wikipedia.org/*
// @match        *://*.m.wikiquote.org/*
// @match        *://m.wikisource.org/*
// @match        *://*.m.wikisource.org/*
// @match        *://*.m.wikiversity.org/*
// @match        *://*.m.wikivoyage.org/*
// @match        *://*.m.wiktionary.org/*
// @match        *://m.xkcd.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/33171/This%20Ain%27t%20A%20Phone.user.js
// @updateURL https://update.greasyfork.org/scripts/33171/This%20Ain%27t%20A%20Phone.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Checks if the location is a mobile site, and returns the URL of the non-mobile equivalent
    // Params: loc: window.location
    // Returns: string of new URL, or false if no match
    function checkLocation(loc) {

        // simple hostname replacement rules
        var hostRules = [
            [ 'm.dailykos.com', 'www.dailykos.com' ],
            [ 'm.facebook.com', 'www.facebook.com' ],
            [ 'm.imdb.com', 'imdb.com' ],
            [ 'm.mediawiki.org', 'www.mediawiki.org' ],
            [ 'mobile.nytimes.com', 'www.nytimes.com' ],
            [ 'm.phys.org', 'phys.org' ],
            [ 'm.sweclockers.com', 'sweclockers.com' ],
            [ 'mobile.twitter.com', 'twitter.com' ],
            [ 'm.wikidata.org', 'www.wikidata.org' ],
            [ 'm.wikisource.org', 'www.wikisource.org' ],
            [ 'm.xkcd.com', 'xkcd.com' ]
        ];

        // shared logic for sites that only require a changed hostname
        for (var i = 0; i < hostRules.length; i++) {
            var rule = hostRules[i];
            if (loc.host == rule[0]) {
                return loc.href.replace('//'+rule[0], '//'+rule[1]);
            }
        }

        // special logic for Wikimedia sites (too many subdomains to list individually)
        var wikimediaHosts = [
            'wikipedia.org',
            'wikibooks.org',
            'wikimedia.org',
            'wikinews.org',
            'wikiquote.org',
            'wikisource.org',
            'wikiversity.org',
            'wikivoyage.org',
            'wiktionary.org',
        ];
        for (var i = 0; i < wikimediaHosts.length; i++) {
            var wmHost = wikimediaHosts[i];
            if (loc.host.endsWith('.m.'+wmHost)) {
                var newHost = loc.host.slice(0, 0 - ('m.'+wmHost).length) + wmHost;
                return loc.protocol + "//" + newHost + ":" + loc.port + loc.pathname + loc.search + loc.hash;
            }
        }

        return false;
    }

    var destination = checkLocation(window.location);
    if (destination !== false) {
        window.location.href = destination;
    }
})();
