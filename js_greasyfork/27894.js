// ==UserScript==
// @name        Firebase docs in English please
// @namespace   Symmetry
// @match       *://firebase.google.com/*
// @run-at      document-start
// @description Firebase documentation always in english 
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/27894/Firebase%20docs%20in%20English%20please.user.js
// @updateURL https://update.greasyfork.org/scripts/27894/Firebase%20docs%20in%20English%20please.meta.js
// ==/UserScript==

 
if ( ! /hl=en/.test(window.location.search) ) {

    var newURL  = window.location.protocol + "//"
                + window.location.host
                + window.location.pathname + "/?hl=en"
                + window.location.search
                + window.location.hash
                ;
    /*-- replace() puts the good page in the history instead of the
        bad page.
    */
    window.location.replace (newURL);
}