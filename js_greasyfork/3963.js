// ==UserScript==
// @name         Ghost Trappers - Ghost Counter
// @author       Rani Kheir
// @namespace    https://greasyfork.org/users/4271-rani-kheir
// @version      1.0
// @description  To be used with the Ghost Trappers Facebook game. This script will count the total number of ghosts a player has caught and places the information in their profile page.
// @include      *ghost-trappers.com/fb/profiletab/index_intern.php?fbid=*
// @icon         http://i44.photobucket.com/albums/f36/Rani-Kheir/ghosticon_zpsc395e1ce.png
// @copyright    2014+, Rani Kheir
// @downloadURL https://update.greasyfork.org/scripts/3963/Ghost%20Trappers%20-%20Ghost%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/3963/Ghost%20Trappers%20-%20Ghost%20Counter.meta.js
// ==/UserScript==

var countGhosts = document.getElementsByClassName('ghostCount').length;
var countGhostsTotal = 0;
var i;

for ( i = 0; i < countGhosts; i++ ) {
    var singleGhostCount = document.getElementsByClassName('ghostCount')[i].innerHTML.replace( /[^\d.]/g, '' );
    singleGhostCountInt = parseInt(singleGhostCount, 10);
    countGhostsTotal += singleGhostCountInt;
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

var contentToEdit = document.getElementsByClassName('profileBoxData')[0].innerHTML.split("<b>Location:</b>");
var contentEdited = contentToEdit.join("<b>Total ghosts caught: </b>" + addCommas(countGhostsTotal) + "<br><b>Location:</b>");
document.getElementsByClassName('profileBoxData')[0].innerHTML = contentEdited;

//document.getElementsByClassName('profileBoxData')[0].innerHTML = document.getElementsByClassName('profileBoxData')[0].innerHTML + "<b>Total ghosts caught: </b>" + addCommas(countGhostsTotal);
//alert(countGhostsTotal);
