// ==UserScript==
// @name        PTT Improver
// @namespace   pttImprover
// @description  This script makes PTT prettier and with a better user experience.
// @include     https://ptt.w3-969.ibm.com/track/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28562/PTT%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/28562/PTT%20Improver.meta.js
// ==/UserScript==

var body = unsafeWindow.document.getElementsByTagName("body")[0];
var jq = document.createElement('script');
jq.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js" ;

var mptool = document.createElement('script');
mptool.src = "http://gttstage.dst.ibm.com/tools/ppt-improver/ptt-improver.js";
body.appendChild(jq);
body.appendChild(mptool);
