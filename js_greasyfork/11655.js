// ==UserScript==
// @name        	Simulate CLICK
// @version     	1.0.0.0
// @namespace       https://greasyfork.org/users/12506
// @description 	Simulate mouse click event.
// @author       	euverve/thatskie
// @include         http://www.youtube.com/watch*
// @include         https://www.youtube.com/watch*
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/11655/Simulate%20CLICK.user.js
// @updateURL https://update.greasyfork.org/scripts/11655/Simulate%20CLICK.meta.js
// ==/UserScript==

window.addEventListener ("load", pageLoaded);
function pageLoaded () {
    if (document.getElementById('autoplay-checkbox')) {
       // Mouse click event
        var click = document.createEvent("MouseEvents");
        click.initMouseEvent("click", true, true, window,
        0, 0, 0, 0, 0, false, false, false, false, 0, null);
        var button = document.getElementById("autoplay-checkbox");
        button.dispatchEvent(click);
    }
}