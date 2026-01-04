// ==UserScript==
// @name         Hide Numbers
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Hide Twitter followers count on your page
// @author       Norza
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @require https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438192/Hide%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/438192/Hide%20Numbers.meta.js
// ==/UserScript==

var interval = setInterval(function(){
   var arr = document.querySelectorAll("span[data-testid='app-text-transition-container']");
    arr.forEach(element => element.style.display = "none");
}, 1000);

function hideFollowerCount (jNode) {
    $("a[href*='/followers']").hide();
}

function hideStatusCount (jNode) {
    $("a[href*='/followers']").hide();
    $("a[href*='/likes']").hide();
    $("a[href*='/retweets']").hide();
}

waitForKeyElements ("a[href*='/followers']", hideFollowerCount);
waitForKeyElements ("a[href*='/likes']", hideStatusCount);