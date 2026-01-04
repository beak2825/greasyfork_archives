// ==UserScript==
// @author 23913 99164
// @name        Hides Youtube Related Videos
// @include        http://www.youtube.com/watch*
// @include        http://youtube.com/watch*
// @include        https://www.youtube.com/watch*
// @include        https://youtube.com/watch*
// @description    Hide the related videos sidebar on Youtube videos
// @version     0.1
// @grant       none
// @namespace https://greasyfork.org/users/324019
// @downloadURL https://update.greasyfork.org/scripts/393700/Hides%20Youtube%20Related%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/393700/Hides%20Youtube%20Related%20Videos.meta.js
// ==/UserScript==

var secondary_element = false;
var related_element = false;
function init() {
	console.log( "LOADING Youtube Hide Related Videos" );
    secondary_element.style.display = "none";
    related_element.style.display = "none";
}

// Init
(function() {
    var ready = setInterval(function(){
        secondary_element = document.getElementById( "secondary" );
        if ( secondary_element ) {
            related_element = document.getElementById( "related" );
            clearInterval( ready );
            init();
        }
    } , 2 );
    setTimeout( function() {
        clearInterval( ready );
    } , 10000 );
})();