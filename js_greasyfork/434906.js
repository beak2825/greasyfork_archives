
// ========================================================
// ===========                               ==============
// ===========  Change search keyword below  ==============
// ===========                               ==============
// ========================================================

var keywords = '';

// =======================================================
// =======================================================
// =======================================================
// ===========   Don't touch below here       ============
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// ==UserScript==
// @name        D2JSP D2R Softcore ISO Refresher
// @namespace   Lost
// @version      2.0.1
// @description Reloads D2JSP D2R Softcore ISO every 10 seconds
// @include     https://forums.d2jsp.org/forum.php?f=268&t=4
// @grant       GM_notification
// @downloadURL https://update.greasyfork.org/scripts/434906/D2JSP%20D2R%20Softcore%20ISO%20Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/434906/D2JSP%20D2R%20Softcore%20ISO%20Refresher.meta.js
// ==/UserScript==
/* eslint-disable no-multi-spaces */

'use strict';

var numSec = 10;
setTimeout(function(){ location.reload(); }, numSec*1000);
if(keywords != '') {
    var rQuantifiers = /[-\/\\^$*+?.()|[\]{}]/g;
    keywords = keywords.replace(rQuantifiers, '\\$&').split(',').join(' |');
    var pat = new RegExp('(' + keywords + ')', 'gi');

            NodeList.prototype.forEach = Array.prototype.forEach
var children = document.body.childNodes;
children.forEach(function(item){
    var as = item.getElementsByTagName('a');

    for (var j = 0; j < as.length; j++) {
        var a = as[j];
        if(pat.test (a.childNodes[0].nodeValue)) {
         sendNotification(a);
         return
        }
    }
});
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function sendNotification(a) {
    GM_notification ( {
        title: capitalizeFirstLetter(keywords) + ' found on D2JSP', text: a.childNodes[0].nodeValue + '\n\nClick notification to go to the post.', timeout: 10000, image: 'https://www.google.com/s2/favicons?domain=forums.d2jsp.org',
        onclick: () => {
            //window.focus ();
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            window.open(a.childNodes[0].parentElement.href, '_blank')
        }
    });
}