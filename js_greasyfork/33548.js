// ==UserScript==
// @name        noAdblock
// @description  come fucking on.
// @namespace   *
// @include     https://chan.sankakucomplex.com/*
// @version     1
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/33548/noAdblock.user.js
// @updateURL https://update.greasyfork.org/scripts/33548/noAdblock.meta.js
// ==/UserScript==

//a search string to uniquely identify the script
//for example, an anti-adblock script
var re = /eval/i;

window.addEventListener('beforescriptexecute', function(e) {

    if(re.test(e.target.text)){

        e.stopPropagation();
        e.preventDefault();
    }

}, true);