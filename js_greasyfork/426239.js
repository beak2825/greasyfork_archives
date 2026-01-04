// ==UserScript==
// @name         Remove multiple email trackers from links in GMail
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  This script removes the YesWare, ConvertKit, and SkimResources email trackers from links received in GMail. This means the sender will not know that you have clicked on their links if they use these tracking systems.
// @match        https://mail.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=gmail.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426239/Remove%20multiple%20email%20trackers%20from%20links%20in%20GMail.user.js
// @updateURL https://update.greasyfork.org/scripts/426239/Remove%20multiple%20email%20trackers%20from%20links%20in%20GMail.meta.js
// ==/UserScript==

/**
 * YesWare tracking links look like this:
 * http://t.yesware.com/tt/d9fbcc52aa217aeec95457ead96daaee0c23b5ca/df6ccb12940ec0d69ac63a5be14e018a/a22c14da6fbc87418a7a2303a74e0ca3/realdomain.tld/some/page
 * This script replaces the above ^ with https://realdomain.tld/some/page, which is found at the end.
 *
 * ConvertKit tracking links look like this:
 * https://click.convertkit-mail.com/13vyokfqpr2wzxz7vqn1/ml70lp19elw6tdl3/aHR0cHM6Ly9leGFtcGxlLmNvbS9zb21lLXVybA==
 * This script replaces the above ^ with https://example.com/some-url, which is found encoded at the end.
 *
 * SkimLinks tracking links look like this:
 * https://go.skimresources.com/?id=038934X1768130&xs=1&xcust=01bef1039c01d020068061039&url=https%3A%2F%2Fthe-real-website.com%2Fsome%2Fpage
 * This script replaces the above ^ with https://the-real-website.com/some/page, which is found URL-encoded at the end.
 *
 * RedirectingAt (part of SkimLinks):
 * http://go.redirectingat.com/?id=12345X9876543&url=https%3A%2F%2Freal-website.com%2F&sref=...
 */

/* jshint esversion: 6 */

(function() {
    'use strict';

    const debug = false; // change to true to log the links found and updated

    const trackers = [ // these are the configurations used by the script, each contains:
      /*{
            name:  the name of the tracker (used for logging if debug is set to true)
            xpathSearch: how to find the links on the page
            hrefRegex: the exact format we're looking for
            rewrite: a function taking the match object and returning the new link without a tracker
        }*/
        {
            name: 'YesWare',
            xpathSearch: ['.yesware.com'],
            hrefRegex: /http(?:s)?:\/\/[a-z]+\.yesware\.com\/tt\/(?:[0-9a-f]+\/){3}(.+)$/,
            rewrite: match => 'https://' + match[1]
        },
        {
            name: 'ConvertKit',
            xpathSearch: ['.convertkit-mail.com'],
            hrefRegex: /http(?:s)?:\/\/[a-z]+.convertkit-mail.com\/[a-z0-9]+\/[a-z0-9]+\/([a-zA-Z0-9_\-=]+)$/,
            rewrite: match => atob(match[1])
        },
        {
            name: 'SkimLinks',
            xpathSearch: ['.skimresources.com', '.redirectingat.com'],
            hrefRegex: /http(?:s)?:\/\/[a-z]+.(skimresources|redirectingat).com\/\?.*url=http.*$/,
            rewrite: match => getQueryStringParameter('url', match[0])
        },
    ];

    /**
     * Returns a query string parameter by name
     */
    function getQueryStringParameter(name, url) {
        const escapedName = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + escapedName + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) {
            return null;
        } else if (!results[2]) {
            return '';
        } else {
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }
    }

    function matches(anchor, regex) {
        return regex.exec(anchor.href.toString()) !== null;
    }

    // join all the domains together to create the XPath query, which looks like: a[contains(@href,'x.com') or contains(@href,'y.com')]
    const domainPredicate = trackers.flatMap(tracker =>
                                             tracker.xpathSearch.map(search => "contains(@href,'" + search + "')")).join(' or ');

    setInterval(function() {
        const xpathResult = document.evaluate(`//a[${ domainPredicate }]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); // search for tracker links using XPath
        if (xpathResult) {
            for (var i = 0; i < xpathResult.snapshotLength; i++) { // go over all the matching links
                const anchor = xpathResult.snapshotItem(i);
                for (const tracker of trackers) {
                    if (matches(anchor, tracker.hrefRegex)) {
                        if (anchor.getAttribute('data-saferedirecturl')) { // remove GMail's own redirect
                            anchor.removeAttribute('data-saferedirecturl');
                        }
                        const match = tracker.hrefRegex.exec(anchor.href.toString()); // match the exact tracking link format, and extract the real target
                        const newUrl = tracker.rewrite(match); // rewrite the link target
                        if (!newUrl || !newUrl.trim()) {
                            continue;
                        }
                        anchor.href = newUrl.trim();
                        anchor.onclick = function(){}; // disable any JavaScript interceptors that GMail may add
                        anchor.click = function(){};

                        debug && console.log(`Removed ${ tracker.name } tracker, now pointing to ${ anchor.href }`); // if enabled, log to the console to list all changes made
                    }
                }
            }
        }
    }, 200); // repeat as more content is loaded
})();