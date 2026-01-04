// ==UserScript==
// @name         Hide Reddit special posts - popular near you, popular right now
// @namespace    Turtur
// @version      0.3
// @description  An attempt to hide some of the special posts from Reddit main page. Should hide popular near you, popular right now, videos that redditors liked, similar to r/, some redditors find this funny etc. Might hide too much, to be tested still.
// @author       Turtur
// @match        https://www.reddit.com/
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442424/Hide%20Reddit%20special%20posts%20-%20popular%20near%20you%2C%20popular%20right%20now.user.js
// @updateURL https://update.greasyfork.org/scripts/442424/Hide%20Reddit%20special%20posts%20-%20popular%20near%20you%2C%20popular%20right%20now.meta.js
// ==/UserScript==

(function() {
    'use strict';
    waitForKeyElements('div[data-click-id="background"] > div.RichTextJSON-root > p', hideLivestream);

    function hideLivestream(jNode) {
        console.log(`Hide Reddit special posts - hiding:`, jNode.text());
        jNode.closest("div:not([class])").hide();
    }

})();