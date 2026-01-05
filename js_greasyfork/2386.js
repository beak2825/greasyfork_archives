// ==UserScript==
// @name        click_confirm
// @namespace   links
// @description Confirm if you want to follow certain links.
// @include     *
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2386/click_confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/2386/click_confirm.meta.js
// ==/UserScript==

// here's the message that will popup asking if you really want to go there
var que = 'You clicked on a link to a stupid site. \nDo you really want to go there?'
// gets all links on the page
var links = document.getElementsByTagName('a');

// iterate through links on the page
for (var i = 0; i < links.length; i++) {
    var link = links[i];
// if site1 OR site2 OR etc., you can also use fancier regex if you only want to avoid certain parts of the site
    if (
        (/dailykos/.test(link.href))
        || (/democraticunderground/.test(link.href))
//        || (/insertregexhere/.test(link.href))
       ) {
        link.addEventListener('click', function(clk) {
            var b = confirm(que);
// if the link matches one of the regex strings above
            if (b==true) {/* do nothing, i.e., follow the link */}
            else {
                clk.preventDefault(/* prevent your click from opening the link */);
            }
        }, false);
    }
}