// ==UserScript==
// @name         EnfusionLive Yassine Nacer
// @author       Yassine Nacer: www.facebook.com/profile.php?id=100010302216530
// @namespace    sc
// @include      http://www.enfusionlive.com/*
// @version      1
// @description  enfusionlive plugin
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27306/EnfusionLive%20Yassine%20Nacer.user.js
// @updateURL https://update.greasyfork.org/scripts/27306/EnfusionLive%20Yassine%20Nacer.meta.js
// ==/UserScript==


(function() {
    'use strict';

window.addEventListener ("load", Greasemonkey_main, false);

function Greasemonkey_main () {
    var div = document.getElementById('simplemodal-overlay');
    var div2 = document.getElementById('simplemodal-container');
    //console.log(div);
if (div) {
	// Element found, do stuff.
	console.log(div);
    div.outerHTML = "";
    console.log('element 1 deleted');
}
else {
	// Element wasn't found, do something else.
	console.log('element 1 not found');
}

    if (div2) {
	// Element found, do stuff.
	console.log(div2);
    div2.outerHTML = "";
        console.log('element 2 deleted');
}
else {
	// Element wasn't found, do something else.
	console.log('element 2 not found');
}
    
}



    
    
})();