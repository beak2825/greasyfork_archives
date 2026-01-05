// ==UserScript==
// @name      turk HPCBeauty
// @version    0.1
// @description Hides the Instructions in the Mturk hit
// @author     Cristo
// @include       *
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/2745/turk%20HPCBeauty.user.js
// @updateURL https://update.greasyfork.org/scripts/2745/turk%20HPCBeauty.meta.js
// ==/UserScript==

var page = document.getElementById("mturk_form");
var div = page.getElementsByClassName("row")[0];
div.style.display = "none";
var hand = page.getElementsByClassName("col-sm-6")[0];
console.log(hand.innerHTML);

var but = document.createElement("button");
but.innerHTML = "Show/Hide Instructions"
hand.parentNode.insertBefore(but,hand);

but.addEventListener("mousedown", mas, false);

function mas() {
    if (div.style.display == "none") {
    	div.style.display = "block"
    } else if (div.style.display == "block") {
    	div.style.display = "none"
    }
}