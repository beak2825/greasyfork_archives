// ==UserScript==
// @name        Youtube Live Time
// @namespace   https://alzarath.dev/
// @description Forces the display of the current video time for live streams
// @author      Alzarath
// @version     1.2
// @grant       none
// @include     /^https?://(www\.)?youtube.com/watch.*[?&]v=.*/
// @downloadURL https://update.greasyfork.org/scripts/428510/Youtube%20Live%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/428510/Youtube%20Live%20Time.meta.js
// ==/UserScript==
 
var timeStyle = ".ytp-live > .ytp-time-current {" +
                "  display: inline-block !important;" +
                "  margin-right: 5px;" +
                "}";
 
var timeStyleSheet = document.createElement("style");
timeStyleSheet.type = "text/css";
timeStyleSheet.innerText = timeStyle;
document.head.appendChild(timeStyleSheet);