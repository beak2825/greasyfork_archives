// ==UserScript==
// @name            [ALL] Links Open ALL in NEW FOREGROUND Tab
// @author
// @description     Open ALL links in NEW FOREGROUND tab.
// @downloadURL
// @grant
// @homepageURL     https://bitbucket.org/INSMODSCUM/userscripts-scripts/src
// @icon
// @include         http*://*
// @namespace       insmodscum 
// @require
// @run-at          document-start
// @updateURL
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/20696/%5BALL%5D%20Links%20Open%20ALL%20in%20NEW%20FOREGROUND%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/20696/%5BALL%5D%20Links%20Open%20ALL%20in%20NEW%20FOREGROUND%20Tab.meta.js
// ==/UserScript==

// rtfm: http://www.w3schools.com/tags/att_a_target.asp

var a = document.getElementsByTagName("a");
for( i=0; i < a.length; i++ )
a[i].target = "_blank";