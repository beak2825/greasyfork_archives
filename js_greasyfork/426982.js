// ==UserScript==
// @name         Rewrite Reddit links to use "Old Reddit"
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Rewrites all links to Reddit to "old.reddit.com" to automatically use the original UI, not the new one
// @author       https://greasyfork.org/en/users/728793-keyboard-shortcuts
// @match        https://*/*
// @match        http://*/*
// @icon         https://www.reddit.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/426982/Rewrite%20Reddit%20links%20to%20use%20%22Old%20Reddit%22.user.js
// @updateURL https://update.greasyfork.org/scripts/426982/Rewrite%20Reddit%20links%20to%20use%20%22Old%20Reddit%22.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';
    /**
     *                                               Description
     *
     * This script looks for links to Reddit on any page and rewrites them to use old.reddit.com which forces
     * the use of the "old" (or original) site theme, which many people prefer to the current theme.
     *
     */

    /**
     * These links break when "old.reddit" is used with them, so we don't replace them.
     */
    function excludedUrl(url) {
        return url.indexOf('reddit.com/poll/') !== -1 || // do not include polls
            url.indexOf('reddit.com/gallery/') !== -1 || // or galleries
            url.indexOf('reddit.com/sw.') !== -1; // or service workers
    }

    /**
     * Each object in the `transforms` array below can have the following fields:
     * 1. `regex` matches link targets and selects them for re-writing
     * 2. `match` defines a lambda that takes a regex match object and returns whether this is a valid candidate for re-writing
     * 3. `replace` defines a lambda that takes a regex match object and returns the new target for the link
    */
    const transforms = [
        {regex: /^(https?:\/\/)((www|new)\.)?(reddit\.com\/.*)/,
         match: m => m[3] !== 'old' && !excludedUrl(m[4]), // not already containing `.old` and not a poll or gallery
         replace: m => 'https://old.' + m[4]},
        {regex: /^(https?:\/\/)redd\.it\/(.*)/,
         match: m => true, // always match
         replace: m => 'https://old.reddit.com/' + m[2]}
    ];

    function cleanupLinks() {
        const anchors = document.getElementsByTagName('a');
        for (var i = 0; i < anchors.length; i++) {
            for (const tr of transforms) {
                const target = anchors[i].href || '';
                const match = tr.regex.exec(target);
                if (match && tr.match(match)) { // link matches
                    const newTarget = tr.replace(match);
                    anchors[i].href = newTarget;
                }
            }
        }
    }
    setInterval(cleanupLinks, 1000); // call again to deal with links that were added dynamically
    cleanupLinks(); // call once first
})();