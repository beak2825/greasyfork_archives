// ==UserScript==
// @name         Facebook AutoPoke
// @version      2.0
// @description  Poke your friends autonomously!
// @author       Zackton & boinger
// @match        https://www.facebook.com/pokes/?show_outgoing=0
// @match        https://www.facebook.com/pokes/?notif_t=poke
// @grant        none
// @start-at     document-end
// @namespace https://greasyfork.org/users/8935
// @downloadURL https://update.greasyfork.org/scripts/377823/Facebook%20AutoPoke.user.js
// @updateURL https://update.greasyfork.org/scripts/377823/Facebook%20AutoPoke.meta.js
// ==/UserScript==

var exec_interval = 2999; //run every almost-3-seconds (don't make this too low or Chrome ignores you)
var rand_delay_min = 1; //random delay min (added to the exec_interval)
var rand_delay_max = 10000; //random delay max (added to the exec_interval)

// end adjusting things

function randomInt(min, max) { //min and max inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function multiParentsOf(element, n = 1) {
    let {parentNode} = element;
    for (let i = 1; parentNode && i < n; ++i) {
        ({parentNode} = parentNode);
    }
    return parentNode;
}

function tryPoke(){
    var pokeclass = "_42ft _4jy0 _4jy3 _4jy1 selected _51sy";

    if(document.getElementsByClassName(pokeclass).length > 1) {
        var i;
        setTimeout(function(){ //delay the running...
            for(i = 1; i < document.getElementsByClassName(pokeclass).length; ++i) { //find the div items
                if(multiParentsOf(document.getElementsByClassName(pokeclass)[i], 5).className == "") {
                    document.getElementsByClassName(pokeclass)[i].click();
                }
            }
        }, randomInt(rand_delay_min,rand_delay_max)); //... by this random amount
    }
}

setInterval(tryPoke, exec_interval); // run every almost-3-seconds