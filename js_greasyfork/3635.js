// ==UserScript==
// @name           Confirm Report Hit
// @version        0.1
// @description  Ask for confirmation before reporting a hit to Mturk AHK friendly
// @author         Cristo
// @include        https://www.mturk.com/mturk/accept*
// @include        https://www.mturk.com/mturk/continue*
// @include        https://www.mturk.com/mturk/preview*
// @include        https://www.mturk.com/mturk/return*
// @copyright      2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/3635/Confirm%20Report%20Hit.user.js
// @updateURL https://update.greasyfork.org/scripts/3635/Confirm%20Report%20Hit.meta.js
// ==/UserScript==

var reports = document.getElementsByClassName("looksLikeText");
reports[0].addEventListener("click",function(e){
    if (!confirm("Are you sure you want to report this HIT?")){
        e.preventDefault();
    }}, false);
reports[1].addEventListener("click",function(e){
    if (!confirm("Are you sure you want to report this HIT?")){
        e.preventDefault();
    }}, false);