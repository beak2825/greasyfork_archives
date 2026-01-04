// ==UserScript==
// @name        Redirect to old reddit
// @namespace   greasyfork Scripts
// @grant       none
// @include     *://www.reddit.com/*
// @version     1.1
// @author      Mohamed Elashri
// @run-at      document-start
// @description Automatic redirect for reddit links to old.reddit
// @icon        https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-76x76.png
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js?version=1059316
// @downloadURL https://update.greasyfork.org/scripts/430133/Redirect%20to%20old%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/430133/Redirect%20to%20old%20reddit.meta.js
// ==/UserScript==

window.location.replace("https://old.reddit.com" + window.location.pathname);

// remove livestream
(function() {
    'use strict';
    waitForKeyElements('a[href*="/rpan/r/" i]', hideLivestream);

    function hideLivestream (jNode) {
        jNode.closest("div:not([class])").hide();
    }

})();