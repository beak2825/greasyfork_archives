// ==UserScript==
// @name         No YYW on timeline
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Remove elements containing YYW and its parent element until div
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/467459/No%20YYW%20on%20timeline.user.js
// @updateURL https://update.greasyfork.org/scripts/467459/No%20YYW%20on%20timeline.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetStrings = ["Yiwei Wang", "Yiwei Yang", "victoryang00"];
    const targetElements = targetStrings.map(s => `a:contains(${s})`).join(",");
    const $targets = $(targetElements).addBack(targetElements);
    $targets.each(function() {
        let $parent = $(this).parent();
        while($parent.length && !$parent.is("div")) {
            $parent = $parent.parent();
        }
        if($parent.length) {
            $parent.remove();
        }
    });
})();