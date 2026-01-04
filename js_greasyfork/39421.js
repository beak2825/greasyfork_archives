// ==UserScript==
// @name noAdblock
// @namespace nani
// @include https://chan.sankakucomplex.com/*
// @include https://idol.sankakucomplex.com/*
// @version 2
// @run-at document-start
// @description remove the anti-adblock splash from sankaku
// @downloadURL https://update.greasyfork.org/scripts/39421/noAdblock.user.js
// @updateURL https://update.greasyfork.org/scripts/39421/noAdblock.meta.js
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