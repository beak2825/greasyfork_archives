// ==UserScript==
// @name        UnlockCardsGoByBy 
// @namespace   Violentmonkey Scripts
// @include       *://*.mcbbs.net/forum.php?mod=viewthread&tid=*
// @exclude     *://*.mcbbs.net/forum.php?*action=printable
// @run-at      document-start
// @grant       none
// @version     1.0.0
// @author      Nora Hanegan
// @description 1/8/2021, 7:58:45 PM
// @downloadURL https://update.greasyfork.org/scripts/419914/UnlockCardsGoByBy.user.js
// @updateURL https://update.greasyfork.org/scripts/419914/UnlockCardsGoByBy.meta.js
// ==/UserScript==


var brokenUrl  = window.location.href;

if ( ! /\&action=printable$/.test (brokenUrl) ) {

    var fixedURL = brokenUrl + "&action=printable"
                 
                ;
    /*-- replace() puts the good page in the history instead of the
        bad page.
    */
    window.location.replace (fixedURL);
}