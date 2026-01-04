// ==UserScript==
// @name         lemmy show top comment
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto sort comment by top on all lemmy forums
// @author       siminsimin
// @include      https://lemmy.*/post*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lemmy.world
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js?version=1059316
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475738/lemmy%20show%20top%20comment.user.js
// @updateURL https://update.greasyfork.org/scripts/475738/lemmy%20show%20top%20comment.meta.js
// ==/UserScript==

//did not use match as lemmy fediverse domains have host as lemmy.(world|ml|...) which cannot be matched
// see https://stackoverflow.com/questions/20462544/greasemonkey-tampermonkey-match-for-a-page-with-parameters
(function() {
    'use strict';
    waitForKeyElements ('label:contains("Top")', function (jNode) {
        jNode.click();
    });
})();